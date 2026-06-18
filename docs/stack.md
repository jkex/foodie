# Stack

This document records the technical choices for the Foodie app so future agents keep the project consistent.

## Runtime And Deployment

- App framework: Astro
- Language: TypeScript
- Deployment target: Cloudflare Workers via the Astro Cloudflare adapter
- Deploy tool: Wrangler
- Package manager: pnpm

Cloudflare Workers Builds should use `prod` as the production branch.

Cloudflare build settings should use:

```text
Build command:
Deploy command: pnpm deploy:production
Non-production branch deploy command: pnpm deploy:staging
Path: /
```

This project deploys as a Cloudflare Worker with assets. Do not add `pages_build_output_dir` to `wrangler.toml`; that key is for Cloudflare Pages projects and causes Wrangler to validate the generated Worker asset binding incorrectly.

Leave the Cloudflare build command empty because the deploy scripts build internally with the correct environment:

- `pnpm deploy:staging` runs `CLOUDFLARE_ENV=staging astro build` before deploy.
- `pnpm deploy:production` runs `CLOUDFLARE_ENV=production astro build` before deploy.

This is required because the Astro Cloudflare adapter emits `dist/server/wrangler.json` during build, and Wrangler deploys using that generated config.

### Deployment Lessons Learned

- `wrangler.toml` is the source of truth for Worker names, D1 bindings, and environment-specific resources.
- Do not configure D1 bindings manually in the Cloudflare dashboard unless the matching change is also made in `wrangler.toml`; the next Wrangler deploy can overwrite dashboard-only changes.
- The generated `dist/server/wrangler.json` is what Wrangler actually deploys after `astro build`.
- `CLOUDFLARE_ENV` must be set before `astro build`, not only before `wrangler deploy`, because the generated deploy config captures the selected environment at build time.
- Running `wrangler deploy --env production` against a staging-built `dist/` can deploy with the staging D1 binding. Use the package scripts instead.
- A dry run is the fastest binding check:

```bash
pnpm build:staging
pnpm wrangler deploy --env staging --dry-run
pnpm build:production
pnpm wrangler deploy --env production --dry-run
```

The dry-run binding summary should show:

```text
env.DB (foodie)             D1 Database
env.DB (foodie-production)  D1 Database
```

for staging and production respectively.

## Database

- Database: Cloudflare D1
- Binding name: `DB`
- Staging database name: `foodie`
- Production database name: `foodie-production`
- Schema source of truth: Drizzle schema in `src/db/schema.ts`
- Migration application: Wrangler D1 migrations from `migrations/`

The app code imports the D1 binding through `cloudflare:workers` and wraps it with Drizzle's D1 driver.

D1 database IDs in `wrangler.toml` are resource identifiers, not secrets. They are fine to commit publicly. Cloudflare API tokens, `.env` files, and private keys must not be committed.

Important files:

- `wrangler.toml`
- `drizzle.config.ts`
- `src/db/schema.ts`
- `src/lib/db.ts`
- `migrations/0001_initial.sql`

## Database Commands

Generate a migration after changing the Drizzle schema:

```bash
pnpm db:generate
```

Apply migrations to the local D1 database:

```bash
pnpm db:migrations:local
```

The local migration script must target the binding name `DB`, not the database name. If local dev shows `Database setup needed` or writes fail with a missing `recipes` table, run:

```bash
pnpm db:migrations:local
pnpm wrangler d1 execute DB --local --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name"
```

Apply migrations to the remote D1 database:

```bash
pnpm db:migrations:staging
pnpm db:migrations:production
```

## Styling

- Styling system: Tailwind CSS v4
- Icon library: `@lucide/astro`
- Authentication: WorkOS AuthKit via `@workos-inc/node`
- Tailwind entrypoint: `src/styles/global.css`
- Tailwind is wired through `@tailwindcss/vite` in `astro.config.mjs`.

Use Tailwind utility classes for app UI. Do not add shadcn/ui unless the app gains React islands and needs richer interactive components.

Use Lucide icons for navigation and app controls. shadcn/ui uses Lucide by default; in this Astro app the framework-appropriate package is `@lucide/astro`, not `lucide-react`.

## Authentication

Use WorkOS AuthKit for authentication.

Provider setup:

- Enable Google login in the WorkOS Dashboard.
- Enable Apple login in the WorkOS Dashboard.
- The app starts provider-specific AuthKit flows through `/auth/login?provider=GoogleOAuth` and `/auth/login?provider=AppleOAuth`.
- WorkOS owns provider credentials and Apple-specific setup; do not store Google or Apple OAuth client secrets in this repo.

Required Worker secrets:

```text
WORKOS_API_KEY
WORKOS_CLIENT_ID
WORKOS_COOKIE_PASSWORD
```

`WORKOS_COOKIE_PASSWORD` must be at least 32 characters. Generate it with:

```bash
openssl rand -base64 32
```

Session model:

- WorkOS returns a sealed session from `authenticateWithCode`.
- The sealed session is stored in an HttpOnly `foodie_session` cookie.
- Middleware validates the sealed session with `authenticateWithSessionCookie`.
- App pages and `/api/*` routes require a valid session when WorkOS is configured.
- If WorkOS secrets are missing, local development remains usable and `/login` shows setup instructions.

Auth routes:

```text
/login
/auth/login
/auth/callback
/logout
```

Dashboard redirect URIs must include:

```text
http://localhost:4321/auth/callback
https://<staging-worker-domain>/auth/callback
https://<production-domain>/auth/callback
```

## UI Approach

The app is mobile-first and installable as a PWA. The first version is server-rendered Astro with regular HTML forms and API routes.

PWA files:

- `public/manifest.webmanifest`
- `public/sw.js`

The service worker caches the app shell and static assets only. API routes and form submissions stay network-first by not handling non-GET requests or `/api/*` requests in the service worker.

### PWA Automatic Updates

To ensure users always run the latest client code and assets:

- **Triggering Updates (Automated)**: To trigger an update on users' browsers, `astro.config.mjs` registers a custom `pwa-version-plugin` integration. At the end of every build (for both staging and production stages), this plugin automatically generates a unique timestamp-based `CACHE_NAME` and updates it in the output `dist/client/sw.js` file. The byte change is detected by the browser on the next update check, initiating the PWA update.
- **Immediate Activation**: `public/sw.js` uses `self.skipWaiting()` during install and `self.clients.claim()` during activation to force the new service worker to take control of all clients immediately.
- **Proactive Checks**: `src/layouts/AppLayout.astro` registers the service worker and triggers manual checks with `registration.update()` on page load and on `visibilitychange` (whenever the user brings the app back to focus).
- **Reloading Clients**: `src/layouts/AppLayout.astro` listens for the `controllerchange` event to detect when the new service worker takes over, triggering a page reload (`window.location.reload()`) to cleanly reload stale assets.

Mobile-first shell rules:

- Primary phone workflows are Plan, Recipes, Shopping, and Settings.
- Use bottom navigation on mobile.
- Respect safe-area insets with `env(safe-area-inset-*)`.
- Keep touch targets at least about 44px tall.
- Optimize the phone workflow first; desktop can use the same sections in wider grids.
- The app uses real routes for primary navigation, with drill-down sub-routes that keep the parent tab active and show a back link:

```text
/             redirects to /plan
/plan         latest plan + plan generation
/plan/edit    adjust the draft plan
/recipes      searchable recipe list
/recipes/new  recipe editor (create)
/recipes/[id] recipe editor (edit/delete)
/shopping     shopping list grouped by category
/settings     language and theme settings
```

Component structure:

- `src/layouts/AppLayout.astro` is the app shell (PWA meta, theme bootstrap, bottom/top nav, service worker registration).
- `src/components/ui/` holds the shared primitives (Panel, Button, Input, Select, Textarea, Field, Badge, EmptyState, Alert). Pages must use these instead of duplicating Tailwind class strings.
- `src/components/PageHeader.astro` renders the page title, optional subtitle, optional back link, and an `action` slot.
- `src/components/recipes/RecipeForm.astro` is the shared create/edit recipe form with structured ingredient rows (`IngredientRow.astro`); rows are added/removed by a small inline script cloning a `<template>`, and the form is still a plain HTML post.
- The accent color is emerald (`emerald-600` light / `emerald-500` dark) on a neutral palette.

Language and theme:

- The locale is server-rendered. `src/lib/i18n.ts` resolves it from the `foodie.locale` cookie, falling back to the request `Accept-Language` header.
- The settings page writes the `foodie.locale` cookie on change and reloads; there is no client-side re-translation pass and no `data-i18n` attributes. Do not reintroduce them.
- All UI strings live in `src/lib/preferences.ts` (`translations`, English and German). Add new keys to both locales.
- Theme supports `system`, `light`, and `dark`, stored client-side in `localStorage` under `foodie.theme`; `system` follows `prefers-color-scheme`.
- Shopping list check-offs are local UI state stored in `localStorage` under `foodie.shopping.<planId>`.

Prefer this pattern until there is a clear need for client-side state, such as:

- Drag-and-drop meal planning
- Rich dialogs
- Calendar widgets
- Command menus
- Offline shopping-list state

## AI Integration

- Users store their own API key per user in the `ai_settings` table (Settings page).
- Anthropic calls go through the official `@anthropic-ai/sdk` (never raw fetch) with `output_config: {format: {type: 'json_schema', ...}}` for guaranteed-valid recipe JSON; default model `claude-opus-4-8`.
- OpenAI calls use the REST chat-completions endpoint with `response_format: json_schema` (no SDK dependency); default model `gpt-4o`.
- The shared recipe JSON schema and provider dispatch live in `src/lib/ai.ts`.
- `wrangler.toml` needs `compatibility_flags = ["nodejs_compat"]` for the Anthropic SDK on Workers.

## Per-User Data Scoping

- `recipes`, `ingredients`, `meal_plans`, and `ai_settings` carry a `user_id` column (WorkOS user id; `'local'` when WorkOS is unconfigured).
- `src/middleware.ts` resolves `locals.userId`; all functions in `src/lib/db.ts`, `src/lib/ai.ts`, and `src/lib/plan.ts` take it as a parameter and must filter by it — never add an unscoped query.
- Ingredient names are unique per user (`ingredients_user_name_unique`), and AI settings are one row per user.

## Package Manager Policy

Use pnpm for local development, CI, and Cloudflare build commands.

Do not add `package-lock.json` or `bun.lockb`.

Use:

```bash
pnpm install
pnpm dev
pnpm build
```

## Notes

- Keep the D1 binding name as `DB`; app code depends on it.
- Keep staging and production D1 database IDs separate in `wrangler.toml`.
- Do not run D1 migrations automatically from branch deploys unless the workflow explicitly gates production migrations.
