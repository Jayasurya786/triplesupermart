# Triple N Supermart Loyalty Platform

Production-ready MERN platform for in-store customer engagement, loyalty, and promotions. This is not an e-commerce system.

## Highlights

- Modular app with a Vite React client and an Express API
- JWT access + refresh tokens, OTP verification, role-based access
- Customer ID generation format: TNS0001
- SEO scaffolding: sitemap, robots, dynamic meta tags, structured data
- Netlify Functions deployment for the API with same-origin client calls

## Structure

- client: Vite React SPA (TypeScript, Tailwind, Redux Toolkit, TanStack Query, Framer Motion)
- server: Node.js + Express + TypeScript + MongoDB Atlas source used by Netlify Functions
- netlify/functions: Netlify Function wrapper around the API

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:

   - `npm install`

3. Run development servers in separate terminals:

   - `npm run dev:server`
   - `npm run dev:client`

## Deploy On Netlify

The backend is exposed as a Netlify Function and the frontend calls the same-origin API path.

1. Connect this repository to Netlify.
2. Use the root `netlify.toml` file.
3. Set the runtime environment variables for the function in Netlify site settings:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `JWT_REFRESH_SECRET`
   - `JWT_ACCESS_EXPIRES`
   - `JWT_REFRESH_EXPIRES`
   - `OTP_TTL_MINUTES`
   - `CLIENT_ORIGIN`
   - `COOKIE_SECURE`
4. Redeploy the site.

The frontend uses `VITE_API_BASE_URL=/api/v1`, and Netlify routes that path to the API function.

## Local Development

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies with `npm install`.
3. Run the client and server locally with:

   - `npm run dev:server`
   - `npm run dev:client`

## Notes

- Add real OTP delivery and notification providers before production.
- Add branded font files or imports for Sora/Manrope typography.
- Replace placeholder content and assets with production content.
- Configure HTTPS and production secrets in your deployment environment.
