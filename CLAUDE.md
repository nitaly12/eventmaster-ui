# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## ⚠️ Non-standard Next.js

Per `AGENTS.md`: this project pins **Next.js 16.2.7** (App Router) with **React 19**, a version newer than most training data. APIs, conventions, and file structure may differ. **Read the relevant guide in `node_modules/next/dist/docs/` before writing framework code**, and heed deprecation notices. Do not assume App Router behavior from memory.

Note: a stale `src/CLAUDE.md` may exist with inaccurate claims (Turbopack default, shadcn/Radix). Ignore it — the facts below reflect the actual code.

## Setup from a fresh clone

```bash
git clone <repo-url>
cd eventmaster

npm install                 # also runs `prisma generate` (postinstall)

cp .env.example .env        # then edit .env (see Environment below)
                            # Windows PowerShell: Copy-Item .env.example .env

npm run db:setup            # prisma db push + seed (creates tables, loads sample data)
npm run db:check            # verify DB connectivity

npm run dev                 # http://localhost:3000
```

Prerequisites: Node 20+ and a reachable PostgreSQL database (Neon recommended). `npm install` fails fast if Prisma can't generate; `db:setup` fails if `DATABASE_URL` is missing or unreachable.

## Commands

```bash
npm run dev          # dev server — uses WEBPACK (next dev --webpack), not turbopack
npm run dev:turbo    # dev server on turbopack (opt-in)
npm run build        # production build (runs `prisma generate` first via prebuild)
npm run lint         # eslint (flat config, eslint-config-next)
npm start            # serve the production build

# Database (Prisma + PostgreSQL/Neon)
npm run db:push      # push schema.prisma to the DB (no migrations are used)
npm run db:seed      # seed via prisma/seed.ts (tsx) — wipes and reloads tables
npm run db:setup     # db:push + db:seed
npm run db:check     # quick connectivity check (counts EventCategory rows)
npm run db:studio    # Prisma Studio
npm run db:generate  # prisma generate

# Recovery (Windows file-lock issues on .next/)
npm run clean        # delete .next/ — STOP all dev servers first
npm run dev:reset    # clean + prisma generate + db:push + db:seed + db:check
```

There is no test runner configured. `predev`/`prebuild`/`postinstall` all run `prisma generate` automatically.

## Environment

Copy `.env.example` → `.env`. Required: `DATABASE_URL` (Neon **pooled** connection string for serverless) and `AUTH_JWT_SECRET` (required in production; falls back to a dev default otherwise). For local `prisma db push`/`db:seed` against Neon, use the **direct** (non-pooled) URL.

## Architecture

Three route groups under `src/app/`, each with a distinct data strategy:

- **`(clientView)`** — public marketing/landing/detail/register pages. Currently reads from **static fixtures** in `src/app/(clientView)/_data/*.js` and `(dashboard)/_data/*.js`, accessed through `src/services/clientPage/*.js`. These pages do **not** hit the database yet.
- **`(dashboard)`** — admin app (overview, events, members, assets, categories, settings). Server pages read the DB through `src/lib/db/*`; client components mutate through API routes.
- **`(auth)`** — login/signup.

**API layer** (`src/app/api/**/route.ts`) is the write path and the dashboard's data source. Every route follows the same shape:
1. Validate/parse with `parseJsonBody` (`src/lib/api-response.ts`), return `jsonError(msg, status)` on bad input.
2. Query through `prisma` (`src/lib/prisma.ts`) — directly or via a `src/lib/db/*` helper.
3. Convert Prisma rows to API/UI shapes with mappers in `src/lib/mappers.ts` (DB `displayId` → public `id`, JSON columns parsed, etc.). **Don't return raw Prisma rows.**
4. Wrap the body in `try/catch` and return `prismaErrorResponse(error) ?? jsonError("Internal server error", 500)` — `src/lib/prisma-error.ts` maps Prisma error codes (P2002→409, P2025→404, connection issues→503 with setup hints).

Client components fetch through `src/lib/client-api.ts` (`apiGet` / `apiSend` / `apiUpload`), which send `credentials: "include"` and throw `Error(payload.error)` on non-2xx.

**Auth.** JWT stored in an httpOnly `auth_token` cookie; bcrypt password hashing; helpers in `src/lib/auth-utils.ts`. Routes read the cookie via `next/headers` `cookies()` and call `verifyAuthToken`. The `AuthUser` model (login credentials) is intentionally separate from `UserProfile` (the editable dashboard profile card).

**Prisma client** (`src/lib/prisma.ts`) is a `globalThis` singleton keyed on the resolved DB URL. `resolveDatabaseUrl()` supports both PostgreSQL URLs and local `file:` SQLite paths (resolved relative to `prisma/`). `schema.prisma` declares `provider = "postgresql"`.

**Seeding.** `prisma/seed.ts` imports the same `_data/*.js` fixtures the client pages use and reloads every table. The `_data` files are the single source of truth for both static UI and seed data — keep them in sync with `schema.prisma`.

**File uploads.** Avatars are written to `public/uploads/avatars/` by `src/lib/save-uploaded-image.ts` (5MB cap; JPG/PNG/WebP/GIF).

## Conventions

- React components are `.jsx`; libs, API routes, mappers, and Prisma helpers are `.ts`/`.tsx`.
- Import alias `@/` → `src/`.
- Styling is **Tailwind CSS v4** plus CSS Modules (e.g. `dashboard.module.css`). UI primitives are hand-rolled in `src/components/ui/` (no shadcn/Radix). Brand color `#7939EF`.
- Co-location: route groups keep `_components/` and `_data/` folders beside their pages.
