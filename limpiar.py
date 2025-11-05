import sqlite3
import json
from urllib.parse import quote

DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\mibase.db"
JSON_PATH = "artist_exists.json"
ARTIST_TABLE = "artist"


def slugify_for_whosampled(s: str) -> str:
    if s is None:
        return ""
    s = s.strip()
    s = "-".join(s.split())
    return quote(s, safe='-')


def main():
    # Leer JSON
    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    artist_slugs = data.get("artist_slugs", [])
    artist_exists = data.get("artist_exists", [])

    if len(artist_slugs) != len(artist_exists):
        print("❌ ERROR: El JSON no tiene longitudes iguales en las listas.")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Cargar todos los artistas actuales (nombre real)
    cur.execute(f"SELECT id, name FROM {ARTIST_TABLE}")
    db_rows = cur.fetchall()  # [(1, "Radiohead"), (2, "Conociendo Rusia"), ...]

    # Creamos un dict {slug: id} para búsqueda rápida
    slug_to_id = {}
    for row_id, artist_name in db_rows:
        slug = slugify_for_whosampled(artist_name)
        slug_to_id[slug.lower()] = row_id  # case-insensitive

    borrados = 0

    for slug, exists_flag in zip(artist_slugs, artist_exists):
        slug_lower = slug.lower()

        # Si no existe en WhoSampled
        if exists_flag == 0:
            if slug_lower in slug_to_id:
                artist_id = slug_to_id[slug_lower]

                print(f"🗑 Borrando artista con id={artist_id} slug={slug} ...")
                cur.execute(f"DELETE FROM {ARTIST_TABLE} WHERE id = ?", (artist_id,))
                borrados += 1
            else:
                print(f"⚠ No encontrado en DB (saltado): {slug}")

    conn.commit()
    conn.close()

    print(f"\n✅ Proceso terminado. Artistas borrados: {borrados}\n")


if __name__ == "__main__":
    main()
