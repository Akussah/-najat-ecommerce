import Database from 'better-sqlite3';

const db = new Database('./backend/data/app.db');
const result = db.prepare('DELETE FROM products').run();
console.log(`Success! Cleared ${result.changes} old placeholder products from your store.`);