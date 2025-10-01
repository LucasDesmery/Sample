import sqlite3

conn = sqlite3.connect("samples.db")
cursor = conn.cursor()

cursor.execute("""
    DELETE FROM samples
    WHERE id NOT IN (
        SELECT MIN(id)
        FROM samples
        GROUP BY original_song_id, sample_title
    )
""")
