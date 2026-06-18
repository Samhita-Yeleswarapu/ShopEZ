# ShopEZ

A full-stack ecommerce app built on the MERN stack — MongoDB, Express, React, and Node. You can browse a product catalog, create an account, add things to a cart, and check out with Cash on Delivery, UPI, or card. All prices are in Indian Rupees (₹).

This started as a front-end-only demo (fake login, mock data pulled from a public API) and was rebuilt into a real client-server app: a proper Express + MongoDB backend, JWT-based auth with hashed passwords, and a React frontend that actually talks to that backend instead of faking everything in `localStorage`.

## What's in here

```
shopez/
├── backend/      Express + MongoDB API
├── frontend/     React + Vite client
└── README.md     you are here
```

Each folder has its own README with more focused setup notes — this one is the bird's-eye view.

## Tech stack

**Backend:** Node.js, Express 4, Mongoose 8, JSON Web Tokens for auth, bcryptjs for password hashing, dotenv for config, cors for cross-origin requests, nodemon for dev reloads.

**Frontend:** React 18, Vite 5, React Router 6. No UI framework — the design is hand-rolled CSS (a charcoal-and-gold palette, Cormorant Garamond + Inter fonts) rather than Bootstrap/Tailwind/MUI.

**Database:** MongoDB (works with a local instance or MongoDB Atlas).


## Data models

**User** — name, email (unique), hashed password, phone, role (`user` or `admin`), saved addresses, timestamps.

**Product** — title, description, price (₹), discount percentage, category, brand, stock, rating, image URLs, sizes (for apparel).

**Order** — reference to the user, line items (each with its own snapshot of title/image/price at time of purchase), shipping address, payment method, subtotal/shipping/tax/total, and a status (`processing`, `shipped`, `delivered`, `cancelled`).

## Known limitations

- Product images are hotlinked from Unsplash's CDN, so they won't load without an internet connection.
- The seed script wipes the entire products collection before inserting fresh data — don't run `npm run seed` again after you've added your own products through the admin panel, unless you mean to start over.
- Payment methods (UPI, card) are recorded but not actually processed through any payment gateway — this is a demo checkout flow, not a production payments integration.