# ShopEZ Backend

Express + MongoDB API for the ShopEZ store.

## Setup

```bash
npm install
cp .env.example .env   # then edit if needed
npm run seed            # loads demo products into the db
npm run dev
```

Server runs on `http://localhost:5000` by default.

## Routes

### Auth (`/api/auth`)
- `POST /register` — create an account
- `POST /login` — log in, returns a JWT
- `GET /me` — get the logged-in user (requires token)
- `PUT /me` — update name/phone/addresses (requires token)

### Products (`/api/products`)
- `GET /` — list products, supports `?category=`, `?search=`, `?minPrice=`, `?maxPrice=`, `?sort=`
- `GET /categories` — list of distinct categories
- `GET /:id` — single product
- `POST /` — create (admin only)
- `PUT /:id` — update (admin only)
- `DELETE /:id` — delete (admin only)

### Orders (`/api/orders`)
- `POST /` — place an order (requires token)
- `GET /my-orders` — your past orders (requires token)
- `GET /:id` — a single order (yours, or any if admin)
- `GET /` — all orders (admin only)
- `PUT /:id/status` — update order status (admin only)

## Auth flow

Register/login returns a JWT. Send it back as `Authorization: Bearer <token>` on protected routes. Tokens last 7 days by default (see `JWT_EXPIRES_IN` in `.env`).

## Making someone an admin

There's no UI for this on purpose — register a normal account, then flip the role manually:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```
