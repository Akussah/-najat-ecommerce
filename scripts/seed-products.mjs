import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import pg from 'pg';

const argMap = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.split('=');
    return [key.replace(/^--/, ''), rest.join('=') || 'true'];
  })
);

const cwd = process.cwd();
const dataPath = path.resolve(cwd, argMap.data || 'data/products.seed.json');
const imagesDir = path.resolve(cwd, argMap.images || 'data/product-images');
const publicDir = path.resolve(cwd, 'public');
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('Missing DATABASE_URL. Set it in .env or environment variables.');
}

if (!fs.existsSync(dataPath)) {
  throw new Error(`Seed file not found: ${dataPath}`);
}

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!Array.isArray(raw)) {
  throw new Error('Seed file must contain an array of products.');
}

const normalizeImagePath = (item) => {
  if (item.imageFile) {
    const publicCandidate = path.join(publicDir, item.imageFile);
    if (fs.existsSync(publicCandidate)) {
      return `/${item.imageFile}`;
    }

    const seedCandidate = path.join(imagesDir, item.imageFile);
    if (fs.existsSync(seedCandidate)) {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const destination = path.join(publicDir, item.imageFile);
      if (!fs.existsSync(destination)) {
        fs.copyFileSync(seedCandidate, destination);
      }
      return `/${item.imageFile}`;
    }
  }

  if (typeof item.image === 'string' && (item.image.startsWith('/') || item.image.startsWith('http') || item.image.match(/\.(jpg|jpeg|png|gif|webp)$/i))) {
    return item.image;
  }

  return '';
};

const pool = new pg.Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' || String(databaseUrl).includes('render.com')
    ? { rejectUnauthorized: false }
    : undefined
});

const run = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const [index, product] of raw.entries()) {
      if (!product?.name || typeof product.price === 'undefined') {
        throw new Error(`Invalid product at index ${index}. 'name' and 'price' are required.`);
      }

      const image = normalizeImagePath(product);
      let images = [];
      if (Array.isArray(product.images) && product.images.length > 0) {
        images = product.images.map((img) => String(img || '')).filter(Boolean);
      } else if (image) {
        images = [image];
      }

      let colors = [];
      if (Array.isArray(product.colors)) {
        colors = product.colors.map((color) => String(color || '').trim()).filter(Boolean);
      } else if (typeof product.colors === 'string') {
        colors = product.colors.split(',').map((color) => color.trim()).filter(Boolean);
      }

      await client.query(
        'INSERT INTO products (name, price, description, stock, image, images, colors, bio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          String(product.name),
          Number(product.price || 0),
          String(product.description || ''),
          String(product.stock || ''),
          image,
          images,
          colors,
          String(product.bio || '')
        ]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${raw.length} products into the database.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
