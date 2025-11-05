import requests
import sqlite3
import base64
import time

# ================================
# CONFIGURACIÓN
# ================================
CLIENT_ID = "5ec45c2b6ef840eead36b9f76756f03f"       # ⚠️ Reemplazar por tu client_id
CLIENT_SECRET = "1069dead38484045aa4a37e9e613a392"  # ⚠️ Reemplazar por tu client_secret
TARGET_USER_ID = "jonegrotto"  # ⚠️ Reemplazar por el id del usuario objetivo
DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\miBase.db"


# ================================
# 1. OBTENER TOKEN DE SPOTIFY
# ================================
def get_spotify_token(client_id, client_secret):
    auth_string = f"{client_id}:{client_secret}"
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = base64.b64encode(auth_bytes).decode("utf-8")

    url = "https://accounts.spotify.com/api/token"
    headers = {"Authorization": f"Basic {auth_base64}"}
    data = {"grant_type": "client_credentials"}

    response = requests.post(url, headers=headers, data=data)
    response.raise_for_status()
    return response.json()["access_token"]


# ================================
# 2. OBTENER TODAS LAS PLAYLISTS DE UN USUARIO
# ================================
def get_user_playlists(user_id, token):
    url = f"https://api.spotify.com/v1/users/{user_id}/playlists"
    headers = {"Authorization": f"Bearer {token}"}
    limit = 50
    offset = 0
    playlists = []

    while True:
        params = {"limit": limit, "offset": offset}
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 429:  # rate limit
            retry = int(response.headers.get("Retry-After", 1))
            print(f"⚠️ Rate limited. Esperando {retry}s...")
            time.sleep(retry)
            continue

        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])
        if not items:
            break

        for pl in items:
            playlists.append((pl["id"], pl["name"]))
        offset += limit

        if len(items) < limit:
            break

    return playlists


# ================================
# 3. OBTENER TRACKS DE UNA PLAYLIST
# ================================
def get_playlist_tracks(playlist_id, token):
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks"
    headers = {"Authorization": f"Bearer {token}"}
    limit = 100
    offset = 0
    tracks = []

    while True:
        params = {"limit": limit, "offset": offset}
        response = requests.get(url, headers=headers, params=params)
        if response.status_code == 429:  # rate limit
            retry = int(response.headers.get("Retry-After", 1))
            print(f"⚠️ Rate limited en tracks. Esperando {retry}s...")
            time.sleep(retry)
            continue

        response.raise_for_status()
        data = response.json()
        items = data.get("items", [])
        if not items:
            break

        for item in items:
            track = item.get("track")
            if track:
                nombre = track["name"]
                artista = track["artists"][0]["name"] if track["artists"] else "Desconocido"
                tracks.append((nombre, artista))

        offset += limit
        if len(items) < limit:
            break

    return tracks


# ================================
# 4. GUARDAR EN SQLITE
# ================================
def save_to_db(tracks, db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    for nombre, artista in tracks:
        cursor.execute("""
            INSERT INTO Answer (nombre, artista, urlYT)
            VALUES (?, ?, ?)
        """, (nombre, artista, ""))  # urlYT vacío

    conn.commit()
    conn.close()

def mostrar_datos(db_path, limite=100):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT nombre, artista, urlYT FROM Answer LIMIT ?", (limite,))
    rows = cursor.fetchall()

    conn.close()

    print(f"🔎 Mostrando {len(rows)} registros de la tabla Answer:")
    for i, row in enumerate(rows, start=1):
        nombre, artista, url = row
        print(f"{i}. {nombre} — {artista} — {url}")

# ================================
# MAIN
# ================================
def contar_elementos(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM Answer")
    total = cursor.fetchone()[0]

    conn.close()
    return total


if __name__ == "__main__":
    DB_PATH = r"C:\Proyectos propios\SampleMaster\TestSQLite\miBase.db"

    cantidad = contar_elementos(DB_PATH)
    print(f"📊 La tabla Answer tiene {cantidad} registros.")
    mostrar_datos(DB_PATH)