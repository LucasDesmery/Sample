const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('miBase.db', (err) => {
  if (err) {
    console.error("Error al abrir la base de datos: " + err.message);
  } else {
    console.log("✅ Base de datos abierta correctamente");
  }
});

// Listar tablas
db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, filas) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("\n📌 Tablas en la base:");
    filas.forEach(fila => console.log(" -", fila.name));
  }
});

// Mostrar ejemplo de relación entre newAnswer y Question
db.all(`
  SELECT q.id AS question_id,
         na.artist_name AS original_artist,
         na.song_title AS original_song,
         q.artista AS sampler_artist,
         q.nombre AS sampled_song,
         q.urlYT
  FROM Question q
  JOIN newAnswer na ON q.answer_id = na.id
  LIMIT 20;
`, [], (err, rows) => {
  if (err) {
    console.error("\n❌ Error consultando relación:", err.message);
  } else {
    console.log("\n🎶 Ejemplos de relaciones:");
    rows.forEach(row => {
      console.log(
        `[${row.question_id}] ${row.original_artist} - ${row.original_song}  <=  ${row.sampled_song} por ${row.sampler_artist}  | YouTube: ${row.urlYT ?? '✖'}`
      );
    });
  }
});

db.close();
