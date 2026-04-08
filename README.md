# Astikan Corporate Portal

Corporate-facing React app for company login, registration, agreement upload, and application status tracking.

## Local

```bash
npm install
npm run dev
```

Default dev URL:
- `http://localhost:5175`

## Production

Live URLs:
- `https://corporate.astikan.tech`
- `https://astikan.tech`
- `https://www.astikan.tech`

## Important routes

- register: `/register`
- status tracking: `/track-status`
- typo fallback supported: `/tract-status`

## Backend integration

All backend calls go through:
- `/api/*`

In production nginx proxies these requests to the backend service.

## Deploy

Published on the VPS under:
- `/srv/astikan/apps/corporate/current`
- `/srv/astikan/apps/root/current`

