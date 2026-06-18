# ShopEZ Frontend

React + Vite client for the ShopEZ store.

## Setup

```bash
npm install
npm run dev
```

Runs on `http://localhost:5173`. Make sure the backend (see `../backend`) is running on port 5000, or update `VITE_API_URL` in `.env` if it's somewhere else.

## Pages

- `/` — Home
- `/login`, `/register` — auth
- `/products` — shop, with category/price/sort filters
- `/products/:id` — product detail
- `/cart` — cart
- `/checkout` — checkout (requires login)
- `/order-confirmation/:orderId` — order success page
- `/profile` — order history + account info (requires login)
- `/admin` — dashboard, product & order management (requires admin role)

## Structure

```
src/
  components/   Header, Footer, ProductCard, etc.
  context/       AuthContext, CartContext, OrdersContext
  pages/         one file per route
  utils/         api.js (fetch wrapper), currency.js (INR formatting)
```

Cart state lives in `localStorage` so it survives refreshes even before logging in. Auth uses a JWT stored in `localStorage` under `shopez_token`.
