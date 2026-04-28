import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdirSync, readFileSync, existsSync } from 'node:fs';
import { hashPassword } from './lib/security.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'app.db');

mkdirSync(dataDir, { recursive: true });
const db = new Database(dbPath);

db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    is_admin INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT NOT NULL,
    stock TEXT NOT NULL,
    image TEXT,
    bio TEXT
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    user_email TEXT NOT NULL,
    items_json TEXT NOT NULL,
    total REAL NOT NULL,
    address TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS consult_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payload_json TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    revoked_at TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);

const seedAdmin = () => {
  try {
    const countRow = db.prepare('SELECT COUNT(*) AS count FROM users').get();
    if (countRow && countRow.count > 0) return;

    const email = process.env.ADMIN_EMAIL || 'admin@admin.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin1234';
    const name = process.env.ADMIN_NAME || 'Admin';
    const createdAt = new Date().toISOString();
    const passwordHash = hashPassword(password);

    db.prepare(
      'INSERT INTO users (name, email, password_hash, created_at, is_admin) VALUES (?, ?, ?, ?, ?)' 
    ).run(name, email.toLowerCase(), passwordHash, createdAt, 1);

    // eslint-disable-next-line no-console
    console.log(`Seeded default admin user: ${email}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed admin user:', error);
  }
};

const seedProducts = () => {
  try {
    const countRow = db.prepare('SELECT COUNT(*) AS count FROM products').get();
    if (countRow && countRow.count > 0) return;

    const seedPath = path.join(__dirname, '../data/products.seed.json');
    if (!existsSync(seedPath)) return;

    const products = JSON.parse(readFileSync(seedPath, 'utf-8'));
    if (!Array.isArray(products) || products.length === 0) return;

    const insert = db.prepare(
      'INSERT INTO products (name, price, description, stock, image, bio) VALUES (?, ?, ?, ?, ?, ?)'
    );
    const insertMany = db.transaction((items) => {
      for (const item of items) {
        insert.run(
          item.name || '',
          Number(item.price || 0),
          item.description || '',
          item.stock || '',
          item.imageFile ? `/${item.imageFile}` : item.image || '',
          item.bio || ''
        );
      }
    });

    insertMany(products);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed products:', error);
  }
};

seedAdmin();
seedProducts();

try { db.prepare('ALTER TABLE products ADD COLUMN bio TEXT').run(); } catch (e) {}
try { db.prepare('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0').run(); } catch (e) {}

export { dbPath };
export default db;
