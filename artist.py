import sqlite3
import time
import json
from urllib.parse import quote
from playwright.sync_api import sync_playwright

DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\mibase.db"
ARTIST_TABLE = "artist"       # <- tu tabla con artistas (columna: nombre o artista)
OUTPUT_JSON = "artist_exists.json"

def slugify_for_whosampled(s: str) -> str:
    """Convierte 'Foo Fighters' → 'Foo-Fighters', codifica caracteres especiales."""
    if s is None:
        return ""
    s = s.strip()
    s = "-".join(s.split())
    return quote(s, safe='-')

def load_unique_artists(conn: sqlite3.Connection):
    cur = conn.cursor()
    cur.execute(f"SELECT DISTINCT name FROM {ARTIST_TABLE} ORDER BY name")
    rows = [r[0] for r in cur.fetchall() if r[0]]
    return rows

def page_exists(page, url) -> bool:
    try:
        response = page.goto(url, timeout=60000, wait_until="domcontentloaded")
        status = response.status if response else None
        html = page.content().lower()

        not_found_markers = [
            "page not found",
            "404",
            "not found",
            "the page you requested could not be found",
            "rate limited",
            "error 1015",
        ]

        if status == 200 and not any(m in html for m in not_found_markers):
            return True

        if status in (301, 302):
            page.wait_for_timeout(800)
            html2 = page.content().lower()
            if not any(m in html2 for m in not_found_markers):
                return True

        return False

    except Exception as e:
        print(f"  ✖ Error al cargar {url}: {e}")
        return False

def main():
    conn = sqlite3.connect(DB_PATH)
    artists = load_unique_artists(conn)
    conn.close()

    total = len(artists)
    print(f"Encontrados {total} artistas.\n")

    artist_slugs = [slugify_for_whosampled(a) for a in artists]
    artist_exists = [0] * total

    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=False,
            slow_mo=300,
            args=["--disable-blink-features=AutomationControlled"]
        )
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                       "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
        )
        page = context.new_page()

        page.goto("https://www.whosampled.com/")
        page.wait_for_timeout(2000)

        for i, slug in enumerate(artist_slugs):
            url = f"https://www.whosampled.com/{slug}/"
            print(f"[{i+1}/{total}] {artists[i]} → {slug} ... ", end="", flush=True)

            exists_flag = 1 if page_exists(page, url) else 0
            artist_exists[i] = exists_flag

            print("EXISTE" if exists_flag else "NO")

            time.sleep(0.9)  # delay anti-baneo

        browser.close()

    output = {
        "artist_slugs": artist_slugs,
        "artist_exists": artist_exists
    }

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Listo. Resultados guardados en {OUTPUT_JSON}.\n")

if __name__ == "__main__":
    main()
