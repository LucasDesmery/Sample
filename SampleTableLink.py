import sqlite3
from googleapiclient.discovery import build
import itertools
#AIzaSyCQFFILuqLHUeMvl-zpVb3ABIvf5W1fhzE
#"AIzaSyArNa5LAdA0kc0giWt00NLq9jzQZijSlaw",
 #   "AIzaSyAgXVBERCGqaqp_bzSQ0JU1t7WwqdA4EJI",
  #  "AIzaSyBL9IMGE0wSPhS2X3FNGAa22btRrYgeNnE",
   # "AIzaSyD80X6v6-v3wtQP-nBLmv0jWSNSdxBHJ48"
# Lista de API Keys disponibles
API_KEYS = [


    "AIzaSyD8sg5wK994IGJTcBM079T4lnhpGHYEqqc",
    "AIzaSyCbLMei06sQQQLNNYOFztvNBmdKlMI0sWM",
    "AIzaSyCtIUWtDeue88rZpcw4FTaFwGgy5zFFUQo",
    "AIzaSyDCv7SKGy3plq0j2ZW-C5H-JDpwrlKmHvE"

    # agregá las que tengas
]

# Cantidad de resultados a obtener por API
N_PER_KEY = 90  # ← cada API puede hacer hasta 80 búsquedas

START_ID = 550   # ID inicial desde la cual buscar
TOTAL_TO_FETCH = N_PER_KEY * len(API_KEYS)  # total de canciones a procesar

# Conexión a la base de datos
conn = sqlite3.connect(".venv/samples.db")
cursor = conn.cursor()


def get_youtube_link(title: str, api_key: str) -> str | None:
    """
    Busca en YouTube la primera coincidencia para "title" usando una api_key distinta.
    """
    youtube = build('youtube', 'v3', developerKey=api_key)
    query = f"{title}"
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


if __name__ == "__main__":
    # Traigo tantas filas como búsquedas totales necesito cubrir
    cursor.execute("""
                   SELECT id, original_song_id, sample_title
                   FROM samples
                   WHERE (YTLink IS NULL OR YTLink = '')
                     AND id >= ?
                   ORDER BY id ASC LIMIT ?
                   """, (START_ID, TOTAL_TO_FETCH))
    rows = cursor.fetchall()

    # Rota entre las API keys
    api_cycle = itertools.cycle(API_KEYS)

    processed = 0
    for row in rows:
        id_sample, originalID, name = row
        api_key = next(api_cycle)  # usar la siguiente API key
        try:
            link = get_youtube_link(name, api_key)
        except Exception as e:
            print(f"⚠️ Error con {name}: {e}")
            link = None

        if link:
            print(f"Encontrado: {link}")
            cursor.execute(
                "UPDATE samples SET YTLink = ? WHERE id = ?",
                (link, id_sample)
            )



        conn.commit()
        processed += 1

    print(f"✅ Procesados {processed} registros con {len(API_KEYS)} API keys")
    cursor.close()
    conn.close()


