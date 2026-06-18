# Agent Notes

- Read `docs/recipe-rotation-app.md` before changing product behavior, `docs/stack.md` before changing technical or deployment decisions, and `docs/future-ideas.md` before expanding scope.
- Treat `system` recipes as immutable shared data. User-specific cooking history and rotation state must remain separate.
- Evolve built-in recipes additively and preserve existing recipe IDs. Their ingredient quantities use two base servings.
- Validate migrations with the local D1 workflow; plain SQLite success is not sufficient.
- Preserve encrypted-at-rest AI credentials and the lazy upgrade path for legacy plaintext values.
- Respect pnpm's package-age policy and security overrides instead of bypassing them.
- Review generated schema migrations before keeping them; the applied migration history contains deliberate handwritten SQL.
- Before deployment, run local migrations, tests, type checks, the production build, and the dependency audit.
