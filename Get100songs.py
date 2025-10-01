import requests
import sqlite3
conn = sqlite3.connect(".venv/samples.db")
cursor = conn.cursor()
API_KEY = '4e74e4b12d08f03f54c4b72bbfdac4db'   # Reemplaza con tu API key de Last.fm
URL = 'http://ws.audioscrobbler.com/2.0/'

params = {
    'method': 'tag.gettoptracks',
    'tag': 'rock',
    'limit': 200,
    'api_key': API_KEY,
    'format': 'json'
}

resp = requests.get(URL, params=params)
resp.raise_for_status()
data = resp.json()

# Extraer lista de (artista, canción)
top_100_rock = [
    (track['artist']['name'], track['name'])
    for track in data['tracks']['track']
]

# Mostrar resultado
for artist, title in top_100_rock:
    print(f"{artist} — {title}")
    cursor.execute("""
                   SELECT id
                   FROM original_songs
                   WHERE artist = ?
                     AND title = ?
                   """, (artist,title))
    row = cursor.fetchone()

    if row:
        original_song_id = row[0]
    else:
        cursor.execute("""
                       INSERT INTO original_songs (artist, title)
                       VALUES (?, ?)
                       """, (artist, title))
        original_song_id = cursor.lastrowid

conn.commit()
conn.close()
