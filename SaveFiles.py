import sqlite3

# Datos
original_artist = "The Cure"
original_title = "Lovesong"
samples = [
    "Wiz Khalifa's Low Riding Freestyle",
    "Solomun's Something We All Adore",
    "Marcus Worgull's Love Song",
    "DropxLife's MEHXKA",
    "Tha Impaila's Naive",
    "The Hood Internet's 1989",
    "HMLTD's Love Is Not Enough (Chapter 2: Grief)",
    "Nacho Sotomayor's Hyper (Pt.2)",
    "Nacho Sotomayor's Hyper (Part 1)",
    "BL▲CK † CEILING's Sight"
]

# Conectar a base de datos
conn = sqlite3.connect(".venv/samples.db")
cursor = conn.cursor()

# Crear tablas si no existen
cursor.execute("""
    CREATE TABLE IF NOT EXISTS original_songs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        artist TEXT,
        title TEXT,
        UNIQUE(artist, title)
    )
""")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS samples (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        original_song_id INTEGER,
        sample_title TEXT,
        FOREIGN KEY(original_song_id) REFERENCES original_songs(id),
        UNIQUE(original_song_id, sample_title)
    )
""")

# Buscar o insertar canción original
cursor.execute("""
    SELECT id FROM original_songs WHERE artist = ? AND title = ?
""", (original_artist, original_title))
row = cursor.fetchone()

if row:
    original_song_id = row[0]
else:
    cursor.execute("""
        INSERT INTO original_songs (artist, title) VALUES (?, ?)
    """, (original_artist, original_title))
    original_song_id = cursor.lastrowid

# Insertar samples sin duplicar
for s in samples:
    cursor.execute("""
        INSERT OR IGNORE INTO samples (original_song_id, sample_title)
        VALUES (?, ?)
    """, (original_song_id, s))

# Guardar y cerrar
conn.commit()
conn.close()
