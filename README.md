# Foodie

Foodie is a recipe rotation and shopping-list app. It manages recipes, generates a plan for the number of cooked-food days needed, rotates recipes so older uncooked recipes come first, and aggregates ingredients into one shopping list.

The product reference lives in [docs/recipe-rotation-app.md](./docs/recipe-rotation-app.md). Future-scope ideas live in [docs/future-ideas.md](./docs/future-ideas.md). Stack decisions are also documented in [docs/stack.md](./docs/stack.md).

## Current Stack

- Astro
- TypeScript
- Tailwind CSS v4
- Lucide icons through `@lucide/astro`
- WorkOS AuthKit
- Cloudflare Workers via `@astrojs/cloudflare`
- Cloudflare D1
- Drizzle ORM
- Wrangler D1 migrations
- pnpm

Use pnpm for all dependency, script, build, and deploy commands. Do not add `package-lock.json` or `bun.lockb`.

## Branching And Environments

This repo uses two long-lived branches:

- `main`: staging branch
- `prod`: production branch

Cloudflare Workers Builds should be configured with:

```text
Production branch: prod
Build command: 
Deploy command: pnpm deploy:production
Non-production branch deploy command: pnpm deploy:staging
Path: /
```

Leave the Cloudflare build command empty. The deploy scripts run the correct build internally with `CLOUDFLARE_ENV=staging` or `CLOUDFLARE_ENV=production` before calling Wrangler. This matters because the Astro Cloudflare adapter generates a deploy config during build, and that generated config must contain the correct D1 binding for the target environment.

With this setup:

- Pushes to `main` deploy the staging Worker and use the staging D1 database.
- Pushes to `prod` deploy the production Worker and use the production D1 database.
- Production changes should normally land in `main` first, then be promoted by merging `main` into `prod`.

Do not run production migrations automatically from branch deploys. Apply D1 migrations deliberately with the scripts below.

Do not add `pages_build_output_dir` to `wrangler.toml`. This app deploys as a Cloudflare Worker with assets through the Astro Cloudflare adapter, not as a Cloudflare Pages project.

## Cloudflare Resources

The app expects a D1 binding named `DB` in every environment. Keep this binding name stable because app code depends on it.

Configured resources:

- Staging Worker: `foodie-staging`
- Production Worker: `foodie`
- Staging D1 database: `foodie`
- Production D1 database: `foodie-production`

The database IDs are configured in [wrangler.toml](./wrangler.toml).

Required Worker secrets:

```text
WORKOS_API_KEY
WORKOS_CLIENT_ID
WORKOS_COOKIE_PASSWORD
```

Generate `WORKOS_COOKIE_PASSWORD` with at least 32 characters, for example:

```bash
openssl rand -base64 32
```

Set secrets per environment:

```bash
pnpm wrangler secret put WORKOS_API_KEY --env staging
pnpm wrangler secret put WORKOS_CLIENT_ID --env staging
pnpm wrangler secret put WORKOS_COOKIE_PASSWORD --env staging
pnpm wrangler secret put WORKOS_API_KEY --env production
pnpm wrangler secret put WORKOS_CLIENT_ID --env production
pnpm wrangler secret put WORKOS_COOKIE_PASSWORD --env production
```

In the WorkOS Dashboard, enable Google and Apple as AuthKit/social login providers. Configure redirect URIs for each deployed environment:

```text
http://localhost:4321/auth/callback
https://<staging-worker-domain>/auth/callback
https://<production-domain>/auth/callback
```

Configure the AuthKit sign-in endpoint as:

```text
/login
```

## Local Development

Install dependencies:

```bash
pnpm install
```

Apply local D1 migrations:

```bash
pnpm db:migrations:local
```

Run the dev server:

```bash
pnpm dev
```

If you need to expose the dev server on a specific host, use:

```bash
pnpm dev --host 127.0.0.1
```

The local app runs at:

```text
http://127.0.0.1:4321/
```

If local development shows a database setup warning or recipe writes fail because a table is missing, apply local migrations again:

```bash
pnpm db:migrations:local
```

## Database And Migrations

The app uses Drizzle for typed schema and queries, while Wrangler applies SQL migrations to D1.

Important files:

- Drizzle schema: [src/db/schema.ts](./src/db/schema.ts)
- Drizzle config: [drizzle.config.ts](./drizzle.config.ts)
- Migration directory: [migrations/](./migrations)
- DB helper/query layer: [src/lib/db.ts](./src/lib/db.ts)
- Cloudflare bindings/environments: [wrangler.toml](./wrangler.toml)

After changing [src/db/schema.ts](./src/db/schema.ts), generate a migration:

```bash
pnpm db:generate
```

Apply migrations locally:

```bash
pnpm db:migrations:local
```

Apply migrations to staging:

```bash
pnpm db:migrations:staging
```

Apply migrations to production:

```bash
pnpm db:migrations:production
```

Check Drizzle config:

```bash
pnpm exec drizzle-kit check
```

Verify environment-specific Worker bindings before changing deploy settings:

```bash
pnpm build:staging
pnpm wrangler deploy --env staging --dry-run
pnpm build:production
pnpm wrangler deploy --env production --dry-run
```

The staging dry run should show `env.DB (foodie)`. The production dry run should show `env.DB (foodie-production)`.

## Scripts

Common scripts:

```bash
pnpm dev
pnpm build
pnpm build:staging
pnpm build:production
pnpm preview
pnpm db:generate
pnpm db:migrations:local
pnpm db:migrations:staging
pnpm db:migrations:production
pnpm deploy:staging
pnpm deploy:production
```

## Development Notes For Future Agents

- Read [docs/recipe-rotation-app.md](./docs/recipe-rotation-app.md) before changing product behavior.
- Read [docs/stack.md](./docs/stack.md) before changing framework, package manager, database, styling, or deployment setup.
- Keep the D1 binding name as `DB`.
- Keep staging and production D1 databases separate.
- Use `pnpm deploy:staging` and `pnpm deploy:production` instead of calling `wrangler deploy` directly; the scripts build with the correct `CLOUDFLARE_ENV`.
- Use Tailwind utility classes for UI styling, through the shared components in `src/components/ui/` where one exists.
- Treat this as a mobile-first PWA. Preserve manifest/service-worker behavior and bottom mobile navigation unless replacing it with a better mobile app shell.
- The first version is server-rendered Astro with regular HTML forms and API routes.
- Do not add React, shadcn/ui, or client-side state unless the feature clearly needs it.
- Prefer Drizzle for schema and typed query work.
- Keep Wrangler migrations as the mechanism that applies SQL to D1.
- Run `pnpm build` before pushing implementation changes.

## Product Scope

Initial app capabilities:

- Manage recipes.
- Store structured ingredients.
- Generate meal plans for a configurable number of cooked-food days.
- Auto-create a draft weekly plan when none exists for the target week: plans always start on Monday; Mon–Wed targets this week's Monday, Thu–Sun targets next Monday (see `ensureWeeklyPlan` in `src/lib/plan.ts`).
- Default people count is `2`.
- Rotate recipes based on oldest cooked date/rotation order.
- Support multi-day recipe blocks.
- Aggregate duplicate shopping-list ingredients by name and unit.

Future ideas such as Google Keep integration, pantry tracking, recipe imports, and nutrition metadata are tracked in [docs/future-ideas.md](./docs/future-ideas.md).

## Routes

Current app routes:

```text
/             redirects to /plan
/login        WorkOS AuthKit login page
/auth/login   starts WorkOS AuthKit OAuth flow
/auth/callback handles WorkOS callback and sets the sealed session cookie
/logout       clears the session and redirects through WorkOS logout
/plan         latest plan overview and plan generation
/plan/edit    adjust the draft plan: change block days, replace recipes, regenerate, accept
/recipes      searchable recipe list (?q= filters server-side)
/recipes/new  recipe editor (create) with structured ingredient rows
/recipes/[id] recipe editor (edit/delete)
/shopping     shopping list grouped by category with local check-offs
/settings     language and theme settings
```

API routes (form-posting endpoints, all redirect back to the relevant page):

```text
/api/recipes      create / update / delete via the `action` field
/api/plans        generate or regenerate a draft plan
/api/plans/commit accept a plan and rotate recipes
/api/plans/items  update item day count or replace a recipe, then resequence the plan
/api/ai/settings  save or remove the user's AI provider settings and API key
/api/ai/recipe    generate a new recipe or edit an existing one with the configured LLM
```

## Per-User Data

All data is scoped to the signed-in WorkOS user. `src/middleware.ts` sets `locals.userId` (the WorkOS user id, or `'local'` when WorkOS is not configured, e.g. local dev), and every query in `src/lib/db.ts` / `src/lib/ai.ts` filters by it. Rows created before user scoping carry the default `user_id = 'local'`; to hand existing production data to a user, run a one-off `UPDATE <table> SET user_id = '<workos-user-id>' WHERE user_id = 'local'` against the relevant database.

## AI Recipe Assistant

Users bring their own API key (Settings → AI assistant). Supported providers: Anthropic (default model `claude-opus-4-8`, via `@anthropic-ai/sdk` with structured outputs / `output_config.format`) and OpenAI (default `gpt-4o`, via the REST chat-completions API with `response_format: json_schema`). The recipe JSON schema lives in `src/lib/ai.ts`. Keys are stored per user in the `ai_settings` D1 table — they are not encrypted at rest, which is acceptable for this household app but should be revisited before any multi-tenant use. The `nodejs_compat` compatibility flag in `wrangler.toml` is required by the Anthropic SDK.

## UI Structure

- Layout/shell: `src/layouts/AppLayout.astro` (bottom nav on mobile, header nav on desktop).
- Shared UI primitives: `src/components/ui/` (Panel, Button, Input, Select, Textarea, Field, Badge, EmptyState, Alert) — use these instead of repeating Tailwind class strings in pages.
- Page header with optional back link: `src/components/PageHeader.astro`.
- Recipe editor: `src/components/recipes/RecipeForm.astro` with `IngredientRow.astro` (structured rows, add/remove via a small inline script, plain form post).
- i18n: server-rendered from `src/lib/i18n.ts`. The locale comes from the `foodie.locale` cookie (set on the settings page, which reloads) with `Accept-Language` fallback. There is no client-side re-translation pass; do not reintroduce `data-i18n` attributes.
- Theme stays client-only in `localStorage` (`foodie.theme`); shopping check-offs are local UI state in `localStorage` (`foodie.shopping.<planId>`).
- Accent color is emerald; keep primary actions on the emerald `Button` variant.
