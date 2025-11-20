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

cursor.execute("SELECT nombre, artista FROM answer")
rows = cursor.fetchall()

print("availableSongs = [")
for nombre, artista in rows:
    value = slugify(f"{nombre} {artista}")
    label = f"{nombre} - {artista}"
    print(f'  {{ value: "{value}", label: "{label}" }},')
print("]")
