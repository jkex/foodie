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
- Tailwind entrypoint: `src/styles/global.css`
- Tailwind is wired through `@tailwindcss/vite` in `astro.config.mjs`.

Use Tailwind utility classes for app UI. Do not add shadcn/ui unless the app gains React islands and needs richer interactive components.

Use Lucide icons for navigation and app controls. shadcn/ui uses Lucide by default; in this Astro app the framework-appropriate package is `@lucide/astro`, not `lucide-react`.

## UI Approach

The app is mobile-first and installable as a PWA. The first version is server-rendered Astro with regular HTML forms and API routes.

PWA files:

- `public/manifest.webmanifest`
- `public/sw.js`

The service worker caches the app shell and static assets only. API routes and form submissions stay network-first by not handling non-GET requests or `/api/*` requests in the service worker.

Mobile-first shell rules:

- Primary phone workflows are Plan, Recipes, Shopping, and Settings.
- Use bottom navigation on mobile.
- Respect safe-area insets with `env(safe-area-inset-*)`.
- Keep touch targets at least about 44px tall.
- Optimize the phone workflow first; desktop can use the same sections in wider grids.
- The app uses real routes for primary navigation:

```text
/             redirects to /plan
/plan         meal planning
/recipes      recipe management
/shopping     current shopping list
/settings     language and theme settings
```

Theme and language preferences use a small no-framework client script in `src/pages/index.astro`:

- Initial locale is chosen from the request `Accept-Language` header.
- Browser language is used client-side if no stored locale exists.
- User locale overrides are stored in `localStorage` under `foodie.locale`.
- Theme supports `system`, `light`, and `dark`.
- Theme overrides are stored in `localStorage` under `foodie.theme`.
- `system` theme follows `prefers-color-scheme`.

Prefer this pattern until there is a clear need for client-side state, such as:

- Drag-and-drop meal planning
- Rich dialogs
- Calendar widgets
- Command menus
- Offline shopping-list state

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
