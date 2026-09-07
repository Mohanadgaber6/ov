# OV Office Arabic Website

واجهة عربية أولى فاخرة لشركة أوفي الذكية تساعد المستثمرين وأصحاب الأعمال في خدمات تأسيس الأعمال والخدمات الحكومية والإدارية.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/ov-office-site/src/App.tsx` — application shell and route entry
- `artifacts/ov-office-site/src/pages/home.tsx` — public homepage composition
- `artifacts/ov-office-site/src/components/sections/` — homepage sections and reusable presentation components
- `artifacts/ov-office-site/src/data/content.ts` — Arabic copy, contact details, navigation, and replaceable image references
- `artifacts/ov-office-site/src/index.css` — design tokens, typography, RTL-friendly theme, and shared CSS
- `artifacts/ov-office-site/index.html` — homepage metadata and social sharing tags

## Architecture decisions

- The public experience is Arabic-first and RTL; English routes are intentionally deferred to a later phase.
- Homepage content and image references are isolated from presentation components to support a future CMS/content-management layer.
- Phone and WhatsApp are the primary conversions; analytics hooks/data attributes are prepared without binding to a tracking provider.
- Public marketing UI is intentionally separate from the future customer portal and admin dashboard.

## Product

- Premium public homepage for OV Office with service discovery, investor-services messaging, process explanation, packages, government-platform coverage, FAQ, knowledge-center empty state, and contact conversion paths.
- Direct phone and WhatsApp actions use the official business number configured in the content module.

## User preferences

- Prioritize Arabic quality and mobile experience before expanding the English version or private portal surfaces.
- Avoid generic SaaS layouts, fake statistics, unverifiable claims, and placeholder trust signals.

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
