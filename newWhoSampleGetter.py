# crawl_who_sampled_artists.py
import sqlite3
import time
import random
import pathlib
import os
from urllib.parse import quote
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import re
# ---------- CONFIG ----------
DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\mibase.db"
ARTIST_TABLE = "artist"            # tabla con columna 'artista' o ajustá si tu columna se llama distinto
ARTIST_COLUMN = "name"         # nombre de columna en ARTIST_TABLE que guarda el nombre
TMP_DIR = pathlib.Path(r"C:\Proyectos propios\SampleMaster\TestSQLite\tmp_html")
OUTPUT_JSON = "artist_samples.json" # opcional, no usado por ahora
HEADLESS = False                  # ver navegador mientras corre
MIN_DELAY = 1.0
MAX_DELAY = 2.0
# -----------------------------

TMP_DIR.mkdir(exist_ok=True)

def slugify_for_whosampled(s: str) -> str:
    if not s:
        return ""
    s = s.strip()
    s = "-".join(s.split())
    return quote(s, safe='-')

def ensure_tables(conn: sqlite3.Connection):
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS newAnswer (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            artist_name TEXT NOT NULL,
            song_title TEXT NOT NULL,
            UNIQUE(artist_name, song_title)
        );
    """)
    cur.execute("""
        CREATE TABLE IF NOT EXISTS Question (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            answer_id INTEGER NOT NULL,
            artista TEXT,
            nombre TEXT,
            sampling_url TEXT,
            UNIQUE(answer_id, artista, nombre),
            FOREIGN KEY(answer_id) REFERENCES newAnswer(id) ON DELETE CASCADE
        );
    """)
    conn.commit()

def get_artists_from_db(conn: sqlite3.Connection):
    cur = conn.cursor()
    cur.execute(f"SELECT {ARTIST_COLUMN} FROM {ARTIST_TABLE} WHERE {ARTIST_COLUMN} IS NOT NULL AND {ARTIST_COLUMN} <> ''")
    rows = [r[0] for r in cur.fetchall()]
    # Deduplicate while preserving order
    seen = set()
    out = []
    for a in rows:
        key = a.strip()
        if key and key.lower() not in seen:
            seen.add(key.lower())
            out.append(key)
    return out

def save_temp_html(html_text: str) -> pathlib.Path:
    fname = TMP_DIR / "current.html"  # siempre el mismo archivo
    fname.write_text(html_text, encoding="utf-8")
    return fname


def parse_artist_html(artist_name: str, html_text: str):
    soup = BeautifulSoup(html_text, "html.parser")
    results = []

    # cada trackItem = una canción ORIGINAL del artista analizado
    for track in soup.find_all("section", class_="trackItem"):
        # obtener nombre del tema original: <span itemprop="name">
        original_name_tag = track.find("span", itemprop="name")
        if not original_name_tag:
            continue
        original_song_name = original_name_tag.get_text(strip=True)

        # ahora dentro de este track, vemos las conexiones
        connections = track.find_all("div", class_="track-connection")

        for block in connections:
            action = block.find("span", class_="sampleAction")
            if not action:
                continue

            # SOLO queremos "was sampled in"
            if "was sampled in" not in action.get_text(strip=True).lower():
                continue

            ul = block.find("ul")
            if not ul:
                continue

            # cada li = alguien sampleando el tema original
            for li in ul.find_all("li"):
                play_link = li.find("a", class_="connectionName")
                if not play_link:
                    continue

                sampled_song_name = play_link.get_text(strip=True)
                sampled_href = play_link.get("href") or ""
                sampled_url = "https://www.whosampled.com" + sampled_href

                # artista está en el segundo <a> dentro del <li>
                links = li.find_all("a")
                sampled_artist = links[1].get_text(strip=True) if len(links) > 1 else None

                results.append((
                    original_song_name,   # ej. "Creep"
                    sampled_artist,       # ej. "Girl Talk"
                    sampled_song_name,    # ej. "Jump on Stage"
                    sampled_url           # link completo
                ))

    return results

def _normalize_text(s: str) -> str:
    if s is None:
        return ""
    # normalizar espacios múltiples y trim
    s2 = re.sub(r"\s+", " ", s).strip()
    return s2

def insert_newanswer_and_questions(conn: sqlite3.Connection, artist_name: str, parsed_list):
    """
    parsed_list: list of tuples (original_song_name, sampled_artist, sampled_song, sampling_url)
    Insertará:
      - newAnswer (artist_name, original_song) si no existe
      - Question(answer_id, artista, nombre, sampling_url) si no existe
    Devuelve el número de filas nuevas insertadas en Question.
    """
    cur = conn.cursor()
    inserted_questions = 0

    for original_song, sampled_artist, sampled_song, sampling_url in parsed_list:
        # Ignorar incompletos
        if not sampled_artist or not sampled_song or not original_song:
            print(f"  ⚠️ Datos incompletos → original='{original_song}', artista='{sampled_artist}', tema='{sampled_song}'. Saltando.")
            continue

        # Normalizar
        artist_name_norm = _normalize_text(artist_name)
        original_song_norm = _normalize_text(original_song)
        sampled_artist_norm = _normalize_text(sampled_artist)
        sampled_song_norm = _normalize_text(sampled_song)
        sampling_url_norm = (sampling_url or "").strip()

        # 1) Asegurarnos que existe la fila en newAnswer
        cur.execute("""
            SELECT id FROM newAnswer
            WHERE artist_name = ? AND song_title = ?
        """, (artist_name_norm, original_song_norm))
        row = cur.fetchone()

        if not row:
            # insertar y recuperar id
            cur.execute("""
                INSERT INTO newAnswer (artist_name, song_title)
                VALUES (?, ?)
            """, (artist_name_norm, original_song_norm))
            conn.commit()
            answer_id = cur.lastrowid
            if not answer_id:
                # fallback: buscar de nuevo
                cur.execute("""
                    SELECT id FROM newAnswer WHERE artist_name = ? AND song_title = ?
                """, (artist_name_norm, original_song_norm))
                row2 = cur.fetchone()
                if not row2:
                    print(f"  ❌ Error al crear newAnswer para {artist_name_norm} - {original_song_norm}")
                    continue
                answer_id = row2[0]
        else:
            answer_id = row[0]

        # 2) Comprobar explícitamente si existe la Question con esos valores normalizados
        cur.execute("""
            SELECT id FROM Question
            WHERE answer_id = ? AND artista = ? AND nombre = ?
        """, (answer_id, sampled_artist_norm, sampled_song_norm))
        qrow = cur.fetchone()
        if qrow:
            print(f"  🔹 Ya existía relación: ({answer_id}, '{sampled_artist_norm}', '{sampled_song_norm}')  -- id={qrow[0]}")
            continue

        # 3) Insertar la Question (ya sabemos que no existía)
        cur.execute("""
            INSERT INTO Question (answer_id, artista, nombre, sampling_url, urlYT)
            VALUES (?, ?, ?, ?, ?)
        """, (answer_id, sampled_artist_norm, sampled_song_norm, sampling_url_norm, None))
        conn.commit()

        # Confirmación
        new_id = cur.lastrowid
        if new_id:
            inserted_questions += 1
            print(f"  ✅ Insertado (Question.id={new_id}): {original_song_norm}  <=  {sampled_song_norm} por {sampled_artist_norm}")
        else:
            # intento de comprobación alternativa: ver si ahora existe
            cur.execute("""
                SELECT id FROM Question
                WHERE answer_id = ? AND artista = ? AND nombre = ?
            """, (answer_id, sampled_artist_norm, sampled_song_norm))
            qrow2 = cur.fetchone()
            if qrow2:
                print(f"  ✅ Insertado (confirmado por SELECT) id={qrow2[0]}")
                inserted_questions += 1
            else:
                print(f"  ❌ Falló inserción para ({answer_id}, '{sampled_artist_norm}', '{sampled_song_norm}')")

    return inserted_questions


def fetch_artist_page(playwright_browser, slug: str, max_tries=3):
    page = playwright_browser.new_page()
    try:
        for attempt in range(1, max_tries+1):
            try:
                resp = page.goto(f"https://www.whosampled.com/{slug}/", timeout=60000, wait_until="domcontentloaded")
                html = page.content()
                # heurística simple: si hay mensaje de rate limit, lanzar excepción para reintentar
                if "You are being rate limited" in html or "Error 1015" in html:
                    raise RuntimeError("rate_limited")
                return html
            except PlaywrightTimeoutError:
                print(f"Timeout al cargar {slug} (intento {attempt}/{max_tries})")
            except RuntimeError as e:
                print(f"{e} detectado al cargar {slug} (intento {attempt}/{max_tries})")
            # backoff
            backoff = 2 ** attempt + random.random()
            print(f"Esperando {backoff:.1f}s antes de reintentar...")
            time.sleep(backoff)
        return None
    finally:
        try:
            page.close()
        except Exception:
            pass

def main():
    conn = sqlite3.connect(DB_PATH)
    ensure_tables(conn)
    artists = get_artists_from_db(conn)
    total_artists = len(artists)
    print(f"Artistas a procesar: {total_artists}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=HEADLESS, args=["--disable-blink-features=AutomationControlled"])
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
        )
        # usaremos context.new_page() dentro de fetch; pasar context como 'playwright_browser'
        for i, artist_name in enumerate(artists, start=1):
            try:
                print(f"\n[{i}/{total_artists}] {artist_name}")
                slug = slugify_for_whosampled(artist_name)
                # fetch page
                html = fetch_artist_page(context, slug)
                if not html:
                    print(f"  ❌ No se pudo descargar la página de {artist_name} (slug={slug}), saltando.")
                    # espera antes de continuar
                    time.sleep(random.uniform(MIN_DELAY, MAX_DELAY))
                    continue

                # guardar temporal
                tmp_path = save_temp_html(html)
                print(f"  Guardado temporal: {tmp_path}")

                # parsear
                parsed = parse_artist_html(artist_name, html)
                print(f"  Encontrados {len(parsed)} relaciones 'was sampled in' en la página.")

                # insertar en DB
                inserted = insert_newanswer_and_questions(conn, artist_name, parsed)
                print(f"  Insertadas {inserted} nuevas filas en Question para este artista.")

                # espera humanizada
                time.sleep(random.uniform(MIN_DELAY, MAX_DELAY))

            except Exception as e:
                print(f"  ERROR inesperado con {artist_name}: {e}")
                time.sleep(3)

        # cerrar contexto y browser
        try:
            context.close()
        except Exception:
            pass
        try:
            browser.close()
        except Exception:
            pass

    conn.close()
    print("\nProceso completado.")

if __name__ == "__main__":
    main()
