const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const originalDbPath = path.join(__dirname, '../../../render/mibase.db');
const newDbPath = path.join(__dirname, '../local-review.db');

console.log('Original DB:', originalDbPath);
console.log('New DB:', newDbPath);

// Remove existing new DB if it exists to start fresh (optional, but good for setup)
if (fs.existsSync(newDbPath)) {
    console.log('Removing existing local-review.db...');
    fs.unlinkSync(newDbPath);
}

const db = new Database(newDbPath);

try {
    // Attach original DB
    db.exec(`ATTACH DATABASE '${originalDbPath}' AS original`);

    // Copy Question table
    console.log('Copying Question table...');
    db.exec('CREATE TABLE Question AS SELECT * FROM original.Question');

    // Create Review table
    console.log('Creating Review table...');
    db.exec(`
    CREATE TABLE Review (
      question_id INTEGER PRIMARY KEY,
      status INTEGER NOT NULL, -- 0 = NO, 1 = SI
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    console.log('Database setup complete!');
} catch (err) {
    console.error('Error setting up database:', err);
} finally {
    db.close();
}
