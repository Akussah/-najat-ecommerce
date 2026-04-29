import 'dotenv/config';
import pg from 'pg';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync, existsSync } from 'node:fs';
import { hashPassword } from './lib/security.mjs';

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not configured. Set it in .env or environment variables.');
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' || String(databaseUrl).includes('render.com')
    ? { rejectUnauthorized: false }
    : undefined,
});

export const initDb = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      is_admin INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT NOT NULL,
      stock TEXT NOT NULL,
      image TEXT,
      bio TEXT
    );

    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      user_email TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total REAL NOT NULL,
      address TEXT NOT NULL,
      payment_method TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS consult_requests (
      id SERIAL PRIMARY KEY,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      revoked_at TEXT
    );
  `);

  await seedAdmin();
  await seedProducts();

  try { await pool.query('ALTER TABLE products ADD COLUMN bio TEXT'); } catch (e) {}
  try { await pool.query('ALTER TABLE users ADD COLUMN is_admin INTEGER DEFAULT 0'); } catch (e) {}
};

const seedAdmin = async () => {
  try {
    const email = (process.env.ADMIN_EMAIL || 'admin@admin.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin1234';
    const name = process.env.ADMIN_NAME || 'Admin';
    const createdAt = new Date().toISOString();
    const passwordHash = hashPassword(password);

    const existingResult = await pool.query('SELECT id, is_admin FROM users WHERE email = $1', [email]);
    const existingUser = existingResult.rows[0];

    if (existingUser) {
      if (!existingUser.is_admin) {
        await pool.query('UPDATE users SET is_admin = 1 WHERE id = $1', [existingUser.id]);
        // eslint-disable-next-line no-console
        console.log(`Updated existing user to admin: ${email}`);
      }
      return;
    }

    await pool.query(
      'INSERT INTO users (name, email, password_hash, created_at, is_admin) VALUES ($1, $2, $3, $4, $5)',
      [name, email, passwordHash, createdAt, 1]
    );

    // eslint-disable-next-line no-console
    console.log(`Seeded default admin user: ${email}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed admin user:', error);
  }
};

const seedProducts = async () => {
  try {
    const countRow = await pool.query('SELECT COUNT(*) AS count FROM products');
    if (countRow.rows[0].count > 0) return;

    const seedPath = path.join(__dirname, '../data/products.seed.json');
    if (!existsSync(seedPath)) return;

    const products = JSON.parse(readFileSync(seedPath, 'utf-8'));
    if (!Array.isArray(products) || products.length === 0) return;

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const item of products) {
        await client.query(
          'INSERT INTO products (name, price, description, stock, image, bio) VALUES ($1, $2, $3, $4, $5, $6)',
          [
            item.name || '',
            Number(item.price || 0),
            item.description || '',
            item.stock || '',
            item.imageFile ? `/${item.imageFile}` : item.image || '',
            item.bio || ''
          ]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed products:', error);
  }
};

export default pool;
