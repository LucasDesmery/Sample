import Database from 'better-sqlite3';
import path from 'path';

// Point to the new local-review.db in the project root (or wherever setup-db.js put it)
// setup-db.js put it in ../local-review.db relative to scripts/
// scripts is in Sample/Page/scripts
// so local-review.db is in Sample/Page/local-review.db
const dbPath = path.join(process.cwd(), 'local-review.db');

// Use globalThis to prevent multiple connections in development
const globalForDb = globalThis as unknown as {
  conn: Database.Database | undefined;
};

const db = globalForDb.conn ?? new Database(dbPath);

if (process.env.NODE_ENV !== 'production') {
  globalForDb.conn = db;
}

// Initialize Review table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS Review (
    question_id INTEGER PRIMARY KEY,
    status INTEGER NOT NULL, -- 0 = NO, 1 = SI
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;
