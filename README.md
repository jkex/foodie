# Foodie

Recipe rotation and shopping-list app built with Astro, TypeScript, Cloudflare Pages, and Cloudflare D1.

## Development

Install dependencies:

```bash
npm install
```

Run the Astro dev server:

```bash
npm run dev
```

The app expects a D1 binding named `DB` for database-backed pages and API routes. For Cloudflare-compatible local testing, apply migrations locally and run Pages dev:

```bash
npm run db:migrations:local
npm run pages:dev
```

## Database

The initial schema is in [migrations/0001_initial.sql](./migrations/0001_initial.sql).

For production, create a Cloudflare D1 database, replace `database_id` in [wrangler.toml](./wrangler.toml), then apply remote migrations:

```bash
npm run db:migrations:remote
```

## Product Reference

- [Recipe Rotation App](./docs/recipe-rotation-app.md)
- [Future Ideas](./docs/future-ideas.md)
