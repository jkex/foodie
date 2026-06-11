# Foodie

Foodie is a recipe rotation and shopping-list app. It manages recipes, generates a plan for the number of cooked-food days needed, rotates recipes so older uncooked recipes come first, and aggregates ingredients into one shopping list.

The product reference lives in [docs/recipe-rotation-app.md](./docs/recipe-rotation-app.md). Future-scope ideas live in [docs/future-ideas.md](./docs/future-ideas.md). Stack decisions are also documented in [docs/stack.md](./docs/stack.md).

## Current Stack

- Astro
- TypeScript
- Tailwind CSS v4
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
Build command: pnpm build
Deploy command: pnpm deploy:production
Non-production branch deploy command: pnpm deploy:staging
Path: /
```

With this setup:

- Pushes to `main` deploy the staging Worker and use the staging D1 database.
- Pushes to `prod` deploy the production Worker and use the production D1 database.
- Production changes should normally land in `main` first, then be promoted by merging `main` into `prod`.

Do not run production migrations automatically from branch deploys. Apply D1 migrations deliberately with the scripts below.

## Cloudflare Resources

The app expects a D1 binding named `DB` in every environment. Keep this binding name stable because app code depends on it.

Configured resources:

- Staging Worker: `foodie-staging`
- Production Worker: `foodie`
- Staging D1 database: `foodie`
- Production D1 database: `foodie-production`

The database IDs are configured in [wrangler.toml](./wrangler.toml).

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

The local app runs at:

```text
http://127.0.0.1:4321/
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

## Scripts

Common scripts:

```bash
pnpm dev
pnpm build
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
- Use Tailwind utility classes for UI styling.
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
- Default people count is `2`.
- Rotate recipes based on oldest cooked date/rotation order.
- Support multi-day recipe blocks.
- Aggregate duplicate shopping-list ingredients by name and unit.

Future ideas such as Google Keep integration, pantry tracking, recipe imports, and nutrition metadata are tracked in [docs/future-ideas.md](./docs/future-ideas.md).
