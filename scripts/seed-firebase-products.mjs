import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

const argMap = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...rest] = arg.split('=');
    return [key.replace(/^--/, ''), rest.join('=') || 'true'];
  })
);

const cwd = process.cwd();
const dataPath = path.resolve(cwd, argMap.data || 'data/products.seed.json');
const imagesDir = path.resolve(cwd, argMap.images || 'data/product-images');
const serviceAccountPath = argMap.serviceAccount
  ? path.resolve(cwd, argMap.serviceAccount)
  : process.env.GOOGLE_APPLICATION_CREDENTIALS
    ? path.resolve(process.env.GOOGLE_APPLICATION_CREDENTIALS)
    : null;

const storageBucket =
  argMap.bucket || process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET;

if (!storageBucket) {
  throw new Error(
    'Missing storage bucket. Provide --bucket=<bucket-name> or set FIREBASE_STORAGE_BUCKET.'
  );
}

if (!serviceAccountPath || !fs.existsSync(serviceAccountPath)) {
  throw new Error(
    'Missing service account JSON. Provide --serviceAccount=path/to/serviceAccountKey.json or set GOOGLE_APPLICATION_CREDENTIALS.'
  );
}

if (!fs.existsSync(dataPath)) {
  throw new Error(`Seed file not found: ${dataPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
initializeApp({
  credential: cert(serviceAccount),
  storageBucket
});

const db = getFirestore();
const bucket = getStorage().bucket();

const raw = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
if (!Array.isArray(raw)) {
  throw new Error('Seed file must contain an array of products.');
}

const uploadImageIfNeeded = async (product) => {
  if (product.imageUrl) {
    return { imageUrl: product.imageUrl, imagePath: product.imagePath || '' };
  }

  if (!product.imageFile) {
    return { imageUrl: '', imagePath: product.imagePath || '' };
  }

  const localImagePath = path.resolve(imagesDir, product.imageFile);
  if (!fs.existsSync(localImagePath)) {
    throw new Error(`Image file not found: ${localImagePath}`);
  }

  const destination = product.imagePath || `products/${product.imageFile}`;
  await bucket.upload(localImagePath, { destination });

  return {
    imageUrl: '',
    imagePath: destination
  };
};

const run = async () => {
  console.log(`Reading products from: ${dataPath}`);
  console.log(`Using image directory: ${imagesDir}`);
  console.log(`Using bucket: ${storageBucket}`);

  for (const [index, product] of raw.entries()) {
    if (!product?.name || typeof product.price === 'undefined') {
      throw new Error(`Invalid product at index ${index}. 'name' and 'price' are required.`);
    }

    const { imagePath, imageUrl } = await uploadImageIfNeeded(product);

    const payload = {
      name: String(product.name),
      description: String(product.description || ''),
      price: Number(product.price || 0),
      stock: String(product.stock || 'In stock'),
      image: String(product.image || ''),
      imagePath,
      imageUrl,
      createdAt: FieldValue.serverTimestamp()
    };

    if (product.id) {
      await db.collection('products').doc(String(product.id)).set(payload, { merge: true });
      console.log(`Upserted product doc: ${product.id}`);
    } else {
      const docRef = await db.collection('products').add(payload);
      console.log(`Created product doc: ${docRef.id}`);
    }
  }

  console.log('Done: products and images synced to Firebase.');
};

run().catch((error) => {
  console.error(error.message || error);
  process.exitCode = 1;
});
