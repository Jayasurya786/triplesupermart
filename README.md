# Triple N Supermart Loyalty Platform

Production-ready MERN platform for in-store customer engagement, loyalty, and promotions. This is not an e-commerce system.

## Highlights

- Modular MERN architecture with client and server separation
- JWT access + refresh tokens, OTP verification, role-based access
- Customer ID generation format: TNS0001
- SEO scaffolding: sitemap, robots, dynamic meta tags, structured data
- Dockerized with Nginx reverse proxy and health checks

## Structure

- client: Vite React SPA (TypeScript, Tailwind, Redux Toolkit, TanStack Query, Framer Motion)
- server: Node.js + Express + TypeScript + MongoDB Atlas
- nginx: Reverse proxy configuration
- docker-compose.yml: Multi-container orchestration

## Setup

1. Copy `.env.example` to `.env` and update values.
2. Install dependencies:

   - `npm install`

3. Run development servers in separate terminals:

   - `npm run dev:server`
   - `npm run dev:client`

## Docker

1. Ensure `.env` is set.
2. Build and start containers:

   - `docker compose up --build`

## Notes

- Add real OTP delivery and notification providers before production.
- Add branded font files or imports for Sora/Manrope typography.
- Replace placeholder content and assets with production content.
- Configure HTTPS and production secrets in your deployment environment.
