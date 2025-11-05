import sqlite3
from googleapiclient.discovery import build
import itertools

# ================================
# CONFIG
# ================================
API_KEYS = [
    "AIzaSyC9FUdyNGUCIWc2ssmB-3FfqkdhXpBQn8Y",
    "AIzaSyDroABlefeW4o5--expvuV0mIP6qZaGjH0",
    "AIzaSyC0vDOUOH_kytpJ7e3Osj85xrXwDnYfN-E",
    "AIzaSyB6PNa-lN6hE_lshje28hoNo_ctOh0BoMs",
    "AIzaSyBBiPphoRFhuJ5PYrmDBcb1D0jomREWRI0",
    "AIzaSyAFYThHKP9_k0NYkoZ4HMjHXYaFNapvobQ",
    "AIzaSyDwwEO-u3u3Hzw7OGpbOcspkf_Qxh_eEe0",
    "AIzaSyBV4RrO17Yt70yFPrALuZJ7UeHU0WK1Ijg",
    "AIzaSyDad_usrSyoUSUTbIvo6cMWap5G57rEaDg"

]

N_PER_KEY = 90
START_ID = 1
TOTAL_TO_FETCH = N_PER_KEY * len(API_KEYS)

DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\miBase.db"
conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()


# ================================
# FUNCIONES
# ================================
def get_youtube_link(song_title: str, artist_name: str, api_key: str) -> str | None:
    youtube = build('youtube', 'v3', developerKey=api_key)
    query = f"{song_title} {artist_name}"
    req = youtube.search().list(
        q=query,
        part='id',
        type='video',
        maxResults=1
    )
    res = req.execute()

    items = res.get('items', [])
    if not items:
        return None

    video_id = items[0]['id']['videoId']
    return f"https://www.youtube.com/watch?v={video_id}"


# ================================
# MAIN
# ================================
if __name__ == "__main__":
    cursor.execute("""
        SELECT id, nombre, artista
        FROM Question
        WHERE (urlYT IS NULL OR urlYT = '')
          AND id >= ?
        ORDER BY id ASC LIMIT ?
    """, (START_ID, TOTAL_TO_FETCH))
    rows = cursor.fetchall()

    api_cycle = itertools.cycle(API_KEYS)

    processed = 0
    for row in rows:
        q_id, nombre, artista = row
        api_key = next(api_cycle)

        try:
            link = get_youtube_link(nombre, artista, api_key)
        except Exception as e:
            print(f"⚠️ Error buscando {nombre} - {artista}: {e}")
            link = None

        if link:
            print(f"✅ {nombre} - {artista} → {link}")
            cursor.execute(
                "UPDATE Question SET urlYT = ? WHERE id = ?",
                (link, q_id)
            )

        conn.commit()
        processed += 1

    print(f"🎵 Procesados {processed} registros con {len(API_KEYS)} API keys")
    cursor.close()
    conn.close()
