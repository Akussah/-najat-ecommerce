# BeadBag Ecommerce (Frontend + Backend)

## Stack
- Frontend: React + Vite
- Backend: Node.js HTTP API (`backend/server.mjs`)
- Firebase: Auth + Firestore + Storage

## Run locally
1. Install deps:
```bash
npm install
```
2. Create `.env` with Firebase config:
```bash
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_CURRENCY=USD
```
3. Start backend API (required for Paystack payment session):
```bash
npm run api
```
4. In another terminal, start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:4001`.

## Firebase usage
- Authentication: Sign up / Sign in / Sign out
- Firestore collections:
  - `users`
  - `orders`
  - `consultRequests`
  - `products`
- Storage:
  - `products/*` image files for product cards
- Payments:
  - Paystack card checkout session (`/api/payments/create-paystack-session`)
  - Paystack payment verification (`/api/payments/paystack/verify`)

## Bulk upload products + images
Use this when you want Firebase to handle the goods area and pictures.

1. Download a Firebase service account key JSON from Firebase Console.
2. Put your images in `data/product-images/`.
3. Edit `data/products.seed.json`.
4. Run:
```bash
npm run seed:firebase:products -- --serviceAccount=./serviceAccountKey.json --bucket=YOUR_BUCKET_NAME
```

Optional flags:
- `--data=path/to/products.seed.json`
- `--images=path/to/image-folder`

`data/products.seed.json` supports:
- `id` (optional Firestore doc id)
- `name` (required)
- `description`
- `price` (required)
- `stock`
- `image` (fallback style key)
- `imageFile` (filename inside `data/product-images`)
- `imagePath` (optional destination path in Storage)
- `imageUrl` (optional direct URL instead of upload)

## Features implemented
- Guest browsing and add-to-cart
- Checkout requires sign-in/sign-up
- Redirect back to checkout after auth
- Firebase Authentication
- Firestore order submission
- Live Paystack card payment flow with post-payment shipping step
- Firestore consultation request submission
- Product loading from Firestore + Storage image support
- Polished responsive UI theme
