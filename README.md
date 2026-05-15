# Mobile-Masr-Clone

Mobile-Masr-Clone is a full-stack e-commerce project composed of three main parts:

- `client` — React (Vite) storefront
- `admin-dashboard` — Angular admin panel
- `server` — Node.js / Express API with MongoDB and integrations (Stripe, Cloudinary, OpenAI)

## Folder structure

- `client/` — React frontend (Vite)
- `admin-dashboard/` — Angular admin panel
- `server/` — Express backend and API
- `.env` files (local) — environment variables (do not commit)

## Prerequisites

- Node.js 16+ and npm or yarn
- MongoDB (Atlas or local) for `DATABASE_URL`
- API keys/accounts for Stripe, Cloudinary, Google OAuth and OpenAI if you use those features

## Environment

Copy example env files and fill values:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Edit the created `.env` files and set real values for `DATABASE_URL`, `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, and other keys.

Important: Never commit `.env` files containing secrets. Keep `.env.example` in the repository.

## Run (development)

1. Start the server

```bash
cd server
npm install
npm run dev
```

2. Start the client (storefront)

```bash
cd client
npm install
npm run dev
```

3. Start the admin dashboard (Angular)

```bash
cd admin-dashboard
npm install
ng serve -o
```

Notes:

- The server expects `DATABASE_URL` to be set in `server/.env` (Atlas connection string or `mongodb://localhost:27017/your-db`).
- The client uses Vite env vars prefixed with `VITE_` (see `client/.env.example`).

## Build (production)

Build the client for production:

```bash
cd client
npm run build
```

Build the admin dashboard according to its Angular configuration.

## Local DB fallback (optional)

To run with a local MongoDB instead of Atlas, set in `server/.env`:

```
DATABASE_URL=mongodb://localhost:27017/mobilemasr
```

Start a local `mongod` service before running the server.

## Troubleshooting

- MongoDB Atlas connection issues: verify Network Access (IP whitelist), cluster connection string, and local firewall/VPN/proxy settings.
- SSL/TLS or timeout errors: try from a different network (hotspot) to rule out ISP/route blocking.

## Migration (Atlas)

For moving data between clusters use `mongodump` / `mongorestore` or Atlas Live Migration for minimal downtime.

## Contributing

Fork the repository, create a branch, make changes, and open a PR. Keep secrets out of the code.

## Contact

If you need help with setup, share error logs and the relevant `.env` values (without secrets).
