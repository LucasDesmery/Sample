const sqlite3 = require('sqlite3').verbose();

function getEmbedURL(url) {
  if (!url) return null;
  let id = url.split("v=")[1];
  if (!id) return url; // si ya es embed no tocamos
  if (id.includes("&")) id = id.split("&")[0];
  return "https://www.youtube.com/embed/" + id;
}

const db = new sqlite3.Database('miBase.db', (err) => {
  if (err) console.error("Error al abrir DB:", err.message);
  else console.log("✅ Base abierta");
});

db.all(`
  SELECT q.id, na.artist_name, na.song_title, q.artista, q.nombre, q.urlYT
  FROM Question q
  JOIN newAnswer na ON q.answer_id = na.id
  LIMIT 10;
`, [], (err, rows) => {
  if (err) return console.error(err.message);

  rows.forEach(row => {
    console.log(
      `[${row.id}] ${row.artist_name} - ${row.song_title} → ${row.nombre} por ${row.artista} | Video: ${getEmbedURL(row.urlYT)}`
    );
  });
});

db.close();
