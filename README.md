# Foodie

Recipe rotation and shopping-list app built with Astro, TypeScript, Cloudflare Workers, Cloudflare D1, Drizzle, Tailwind, and pnpm.

## Development

Install dependencies:

```bash
pnpm install
```

Run the Astro dev server:

```bash
pnpm dev
```

The app expects a D1 binding named `DB` for database-backed pages and API routes. For Cloudflare-compatible local testing, apply migrations locally and run the dev server:

```bash
pnpm db:migrations:local
pnpm dev
```

## Database

The app uses Cloudflare D1 for storage, Drizzle ORM for typed schema/query management, and Wrangler D1 migrations for applying SQL migrations.

- Drizzle schema: [src/db/schema.ts](./src/db/schema.ts)
- Drizzle config: [drizzle.config.ts](./drizzle.config.ts)
- Initial migration: [migrations/0001_initial.sql](./migrations/0001_initial.sql)

Generate migrations after schema changes:

```bash
pnpm db:generate
```

Apply remote migrations to staging:

```bash
pnpm db:migrations:staging
```

Apply remote migrations to production:

```bash
pnpm db:migrations:production
```

## Deployment

Cloudflare Workers Builds should use `prod` as the production branch.

Use these commands in Cloudflare:

```text
Build command: pnpm build
Deploy command: pnpm deploy:production
Non-production branch deploy command: pnpm deploy:staging
Path: /
```

With that setup:

- `prod` deploys to the production Worker and production D1 database.
- `main` deploys to the staging Worker and staging D1 database.

## Product Reference

- [Recipe Rotation App](./docs/recipe-rotation-app.md)
- [Stack](./docs/stack.md)
- [Future Ideas](./docs/future-ideas.md)
