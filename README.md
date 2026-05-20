# BeadBag Ecommerce (Frontend + Backend)

## Stack
- Frontend: React + Vite
- Backend: Node.js HTTP API (`backend/server.mjs`)
- Database: PostgreSQL

## Run locally
1. Install deps:
```bash
npm install
```
2. Create `.env` with database and payment config:
```bash
DATABASE_URL=postgres://user:password@localhost:5432/yourdb
ADMIN_EMAIL=admin@admin.com
ADMIN_PASSWORD=Admin1234
STRIPE_SECRET_KEY=sk_test_...
PAYSTACK_SECRET_KEY=sk_test_...
PAYSTACK_CURRENCY=USD
RESEND_API_KEY=...
SMTP_HOST=...
SMTP_PORT=587
SMTP_USER=...
SMTP_PASS=...
EMAIL_FROM=...
```
3. Start backend API:
```bash
npm run api
```
4. In another terminal, start frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173` and backend on `http://localhost:4001`.

## Backend database usage
- PostgreSQL is the primary data store.
- `users`, `products`, `orders`, `consult_requests`, and `sessions` are managed by the backend.
- Product images can be seeded from local files and served from the app.
- Payments and order verification still run through the backend payment API routes.

## Bulk upload products + images
Use this when you want the backend database to seed products and local image assets.

1. Put your images in `data/product-images/`.
2. Edit `data/products.seed.json`.
3. Run:
```bash
npm run seed:products -- --data=./data/products.seed.json --images=./data/product-images
```

Optional flags:
- `--data=path/to/products.seed.json`
- `--images=path/to/image-folder`

`data/products.seed.json` supports:
- `name` (required)
- `description`
- `price` (required)
- `stock`
- `image` (fallback style key)
- `imageFile` (filename inside `data/product-images`)
- `bio`
- `images` (optional array of additional image paths)
- `colors` (optional array or comma-separated string)

## Features implemented
- Guest browsing and add-to-cart
- Checkout requires sign-in/sign-up
- Redirect back to checkout after auth
- Email/password authentication via backend sessions
- Orders stored in PostgreSQL
- Live Paystack card payment flow with post-payment shipping step
- Consultation request submission stored in PostgreSQL
- Product loading from PostgreSQL with local image support
- Polished responsive UI theme
