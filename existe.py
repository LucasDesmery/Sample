# check_whosampled_pages.py
import sqlite3
import time
import json
from urllib.parse import quote
from playwright.sync_api import sync_playwright

DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\mibase.db"
OUTPUT_JSON = "exists.json"
TABLE_NAME = "whosampled_exists"
SOURCE_TABLE = "Answer"  # tabla con columnas id, nombre, artista

def slugify_for_whosampled(s: str) -> str:
    if s is None:
        return ""
    s = s.strip()
    s = "-".join(s.split())
    return quote(s, safe='-')

def ensure_result_table(conn: sqlite3.Connection):
    cur = conn.cursor()
    # 🔥 Limpiamos tabla anterior para reescribir resultados
    cur.execute(f"DROP TABLE IF EXISTS {TABLE_NAME}")
    cur.execute(f"""
        CREATE TABLE {TABLE_NAME} (
            id INTEGER PRIMARY KEY,
            exists_flag INTEGER NOT NULL
        );
    """)
    conn.commit()

def save_result_to_db(conn: sqlite3.Connection, row_id: int, exists_flag: int):
    cur = conn.cursor()
    cur.execute(f"""
        INSERT OR REPLACE INTO {TABLE_NAME} (id, exists_flag) VALUES (?, ?)
    """, (row_id, exists_flag))

def load_answers(conn: sqlite3.Connection):
    cur = conn.cursor()
    cur.execute(f"SELECT id, nombre, artista FROM {SOURCE_TABLE} ORDER BY id")
    return cur.fetchall()

def page_exists(page, url) -> bool:
    try:
        response = page.goto(url, timeout=60000, wait_until="domcontentloaded")
        status = response.status if response else None
        html = page.content()

        not_found_markers = [
            "Page Not Found",
            "404",
            "Not Found",
            "The page you requested could not be found"
        ]
        if status == 200 and not any(m in html for m in not_found_markers):
            return True
        if status in (301, 302):
            page.wait_for_timeout(800)
            html2 = page.content()
            if not any(m in html2 for m in not_found_markers):
                return True
        return False
    except Exception as e:
        print(f"  ✖ Error al cargar {url}: {e}")
        return False

def main():
    conn = sqlite3.connect(DB_PATH)
    ensure_result_table(conn)
    answers = load_answers(conn)
    total = len(answers)
    print(f"Encontradas {total} filas a chequear.\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,   # 👀 Navegador visible
            slow_mo=350,      # ⏳ Acciones lentas para observar
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
        )
        page = context.new_page()

        # 👋 Te damos 3 segundos para ver que todo está abierto antes de arrancar
        print("Mostrando navegador... (esperando 3s)")
        page.goto("https://www.whosampled.com/")
        page.wait_for_timeout(3000)

        exists_array = []

        try:
            for idx, (row_id, nombre, artista) in enumerate(answers):
                artist_slug = slugify_for_whosampled(artista or "")
                title_slug = slugify_for_whosampled(nombre or "")
                url = f"https://www.whosampled.com/{artist_slug}/{title_slug}/"

                print(f"[{idx+1}/{total}] id={row_id} -> {artist_slug}/{title_slug} ... ", end="", flush=True)

                exists = page_exists(page, url)
                exists_flag = 1 if exists else 0
                exists_array.append(exists_flag)

                save_result_to_db(conn, row_id, exists_flag)

                print("EXISTE" if exists else "NO")

                # ⏱ Pequeña espera anti-baneo (ajustá si querés)
                time.sleep(0.8)

        finally:
            conn.commit()
            context.close()
            browser.close()
            conn.close()

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump({"exists": exists_array}, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Hecho. Resultados reescritos en DB y guardados en {OUTPUT_JSON}.\n")

if __name__ == "__main__":
    main()
