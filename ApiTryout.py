import sqlite3
import re

DB = r"C:\Proyectos propios\SampleMaster\TestSQLite\mibase.db"

def slugify(text):
    # Convierte a slug: minusculas, espacios → guiones, borra caracteres raros
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    return text.strip("-")

connection = sqlite3.connect(DB)
cursor = connection.cursor()

cursor.execute("SELECT song_title, artist_name FROM newAnswer")
rows = cursor.fetchall()

print("availableSongs = [")
for song_title, artist_name in rows:
    value = slugify(f"{song_title} {artist_name}")
    label = f"{song_title} - {artist_name}"
    print(f'  {{ value: "{value}", label: "{label}" }},')
print("]")
