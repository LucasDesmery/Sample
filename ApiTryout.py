import sqlite3

DB = r"C:\Proyectos propios\SampleMaster\TestSQLite\mibase.db"
conn = sqlite3.connect(DB)
cur = conn.cursor()

# 1) Renombrar la tabla vieja
cur.execute("ALTER TABLE Question RENAME TO Question_old;")

# 2) Crear de nuevo con urlYT que puede ser NULL
cur.execute("""
CREATE TABLE Question (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    answer_id INTEGER NOT NULL,
    artista TEXT,
    nombre TEXT,
    sampling_url TEXT,
    urlYT TEXT,  -- <- AHORA PERMITE NULL
    UNIQUE(answer_id, artista, nombre),
    FOREIGN KEY(answer_id) REFERENCES newAnswer(id) ON DELETE CASCADE
);
""")

# 3) Copiar datos manteniendo urlYT si existía
cur.execute("""
INSERT INTO Question (id, answer_id, artista, nombre, sampling_url, urlYT)
SELECT id, answer_id, artista, nombre, sampling_url, urlYT
FROM Question_old;
""")

# 4) Borrar tabla vieja
cur.execute("DROP TABLE Question_old;")

conn.commit()
conn.close()

print("✅ Tabla Question reconstruida correctamente.")
