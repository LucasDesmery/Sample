const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('samples.db', (err) => {
  if (err) {
    console.error("Error al abrir la base de datos: " + err.message);
  } else {
    console.log("Base de datos abierta correctamente");
  }
});

// Listar las tablas de la base
db.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, filas) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Tablas en la base de datos:");
    filas.forEach((fila) => {
      console.log(fila.name);
    });
  }
});

db.close();
