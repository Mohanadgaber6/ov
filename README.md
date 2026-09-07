# OV Office Website — Project Handoff

Complete source handoff for the current OV Office Arabic RTL website.

## Current functionality

- React/Vite public website with Wouter routing and Tailwind CSS.
- Express API server with a health endpoint at `/api/healthz`.
- Contact and request-service forms currently prepare a WhatsApp message in the browser; they do not save requests or send email.
- Official receiving email documented for future server-side form notifications: **ovoffiice@gmail.com**.
- No admin dashboard, CRM, customer portal, payment system, or customer accounts are included.

## Technology

- Node.js and pnpm workspace
- React 19 + TypeScript + Vite
- Tailwind CSS v4 and Framer Motion
- Wouter client-side routing
- Express 5 API server
- PostgreSQL support through Drizzle ORM (`lib/db`)
- OpenAPI contract and generated Zod/client packages

## Prerequisites

- Node.js 20 or newer
- pnpm 10 or newer
- PostgreSQL only if database functionality/schema commands are needed

## Install dependencies

```bash
pnpm install
```

## Required Environment Variables

Copy `.env.example` to `.env` or configure these variables in the hosting provider.

- `PORT`: Port used by the currently started service. Use separate values when running frontend and API simultaneously.
- `BASE_PATH`: Public base path for the Vite site. Use `/` for a root-domain deployment.
- `NODE_ENV`: Runtime mode, normally `development` or `production`.
- `LOG_LEVEL`: API structured logging level; `info` is the normal default.
- `DATABASE_URL`: PostgreSQL connection string used by Drizzle. Keep it private. The current website does not persist form submissions.

No email-provider secret is currently required because no email service is connected. If server-side form email is implemented later, notifications must be sent only to **ovoffiice@gmail.com**, and provider credentials must be stored as hosting secrets rather than committed.

## Run locally

Frontend terminal:

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ov-office-site run dev
```

API terminal:

```bash
PORT=3000 NODE_ENV=development pnpm --filter @workspace/api-server run dev
```

API health check:

```bash
curl http://localhost:3000/api/healthz
```

## Type checking

```bash
pnpm run typecheck
```

## Production build

```bash
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ov-office-site run build
pnpm --filter @workspace/api-server run build
```

Frontend output: `artifacts/ov-office-site/dist/public`  
API output: `artifacts/api-server/dist`

## Database

Database support uses PostgreSQL and Drizzle ORM. Schema definitions belong under `lib/db/src/schema/`. At handoff time the schema barrel contains no application tables and there are no migrations or customer records to export.

To apply future schema definitions to a configured development database:

```bash
DATABASE_URL='postgresql://...' pnpm --filter @workspace/db run push
```

Do not commit the real connection string. Database records, if added later, must be exported separately from source-code backups and handled as confidential customer data.

## SEO

- `artifacts/ov-office-site/public/sitemap.xml`
- `artifacts/ov-office-site/public/robots.txt`
- Page-level SEO hook: `artifacts/ov-office-site/src/hooks/use-seo.ts`
- Structured data and metadata are implemented in the website source and HTML entry point.

## Assets

The `attached_assets` directory contains only images currently imported by the website, including the official logo, Makkah hero image, and section images.

## External services and links

The current website uses direct public links/embeds only, including WhatsApp, official social profiles, telephone/email links, and map/location links. It does not currently use a transactional email API, payment provider, CRM, or authentication provider.

## Replit-specific behavior

Replit artifact/workflow metadata is included for continuity on Replit. The Vite configuration conditionally loads Replit development plugins only when running in Replit. PostgreSQL credentials are provided automatically on Replit but must be supplied manually outside Replit.

## Deploying outside Replit

The project can be deployed outside Replit without rewriting the application. Configure the listed environment variables, build the Vite frontend, serve its output with SPA route fallback, and run the Express API as a Node service if needed. Route `/api` to the API service on the same public origin if future frontend functionality calls it.

No DNS or deployment changes are performed by this handoff package.
