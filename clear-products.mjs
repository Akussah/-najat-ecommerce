import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
});

const result = await pool.query('DELETE FROM products');
await pool.end();

console.log(`Success! Cleared ${result.rowCount} old placeholder products from your store.`);