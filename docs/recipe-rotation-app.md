# Recipe Rotation App

## Product Goal

Build a full-stack TypeScript app for managing personal recipes, generating a rotating meal plan, and producing a useful shopping list for the selected planning period.

The app is mobile-first and should be installable as a PWA. Core weekly planning and shopping workflows must be comfortable on a phone before optimizing desktop layouts.

The app should support one main cooked meal per planned day. The user can configure how many days need cooked food for a given plan. For example, a normal week may need 7 days of food, while a week with travel over the weekend may only need 5 days.

Core behavior:

- Store, edit, and delete recipes.
- Store recipe ingredients with quantities, units, and categories.
- Generate a plan for the configured number of cooked-food days.
- Prefer recipes that have not been cooked for the longest time.
- Move used recipes to the end of the rotation after the plan is accepted.
- Generate one aggregated shopping list for the full plan.
- Let the user adjust the number of people to cook for.
- Let the user set how many consecutive days a recipe should be eaten.

Defaults:

- People count: `2`
- Cooked-food days per plan: `5`
- Main meals per cooked-food day: `1`

## Core User Workflows

### Manage Recipes

The user can create and maintain recipes with:

- Name
- Description
- Instructions
- Base servings
- Default number of days to eat the recipe
- Ingredients
- Ingredient quantity
- Ingredient unit
- Ingredient category
- Optional ingredient notes

### Generate A Plan

The user chooses:

- Plan start date
- Number of cooked-food days needed
- Number of people to cook for

The app generates a plan using recipes that have not been cooked for the longest time.

Example:

- Plan start date: Monday
- Cooked-food days needed: `5`
- People count: `2`
- Result: 5 planned main meals instead of 7, useful when the user is away for the weekend.

### Adjust Planned Recipes

The user can:

- Change the number of people for the plan.
- Change how many days a recipe should cover.
- Replace a planned recipe.
- Regenerate the plan.
- Accept or commit the final plan.

### View Shopping List

The app calculates all ingredients needed for the plan, scales them by servings, groups duplicate ingredients, and displays one weekly shopping list.

## Stack Decision

Use:

- Astro
- TypeScript
- Cloudflare Pages
- Cloudflare D1

Use Cloudflare D1 instead of Worker KV because the app needs relational data and aggregation across:

- Recipes
- Ingredients
- Recipe ingredient quantities
- Meal plans
- Planned recipe blocks
- Cook history
- Rotation ordering

D1 is a better fit for sorting by last cooked date, joining recipes to ingredients, and aggregating shopping list quantities.

## Data Model

The first implementation should use a D1 relational schema similar to the following.

### `recipes`

Stores recipe-level data.

Fields:

- `id`
- `name`
- `description`
- `instructions`
- `base_servings`
- `default_days`
- `last_cooked_at`
- `rotation_index`
- `created_at`
- `updated_at`

Notes:

- `base_servings` is the number of servings the recipe ingredient quantities are written for.
- `default_days` defaults to `1`.
- `last_cooked_at` and `rotation_index` are used to determine which recipes have waited longest.

### `ingredients`

Stores canonical ingredient records.

Fields:

- `id`
- `name`
- `category`
- `created_at`
- `updated_at`

Example categories:

- Produce
- Dairy
- Meat
- Dry goods
- Spices
- Frozen
- Other

### `recipe_ingredients`

Stores ingredient quantities for a recipe.

Fields:

- `id`
- `recipe_id`
- `ingredient_id`
- `quantity`
- `unit`
- `note`

Examples:

- `200`, `g`, `pasta`
- `1`, `tbsp`, `olive oil`
- `2`, `pcs`, `onion`

### `meal_plans`

Stores a generated or accepted plan.

Fields:

- `id`
- `start_date`
- `planned_day_count`
- `people_count`
- `status`
- `created_at`
- `updated_at`

Notes:

- `planned_day_count` is the number of days that need cooked food.
- `planned_day_count` defaults to `7`.
- `planned_day_count` can be lower, such as `5`, when the user does not need cooked food for every day of the week.
- `status` should distinguish drafts from accepted plans.

### `meal_plan_items`

Stores recipe blocks within a plan.

Fields:

- `id`
- `meal_plan_id`
- `recipe_id`
- `start_day_index`
- `day_count`
- `people_count`
- `serving_multiplier`
- `created_at`

Notes:

- `start_day_index` starts at `0` for the first cooked-food day in the plan.
- `day_count` is how many consecutive cooked-food days this recipe covers.
- `serving_multiplier = (people_count * day_count) / recipe.base_servings`.
- A recipe block may cover multiple cooked-food days.

## Meal Rotation Rules

The generator fills the configured number of cooked-food days, not always 7 calendar days.

Rules:

1. Default `planned_day_count` is `7`.
2. The user can set `planned_day_count` for each plan.
3. Sort eligible recipes by oldest `last_cooked_at`, then by `rotation_index`.
4. Pick recipes from the front of the queue until `planned_day_count` cooked-food slots are filled.
5. Each recipe occupies a consecutive block of cooked-food days.
6. Default block size is the recipe's `default_days`, usually `1`.
7. The user can manually set a recipe to cover `2` or more cooked-food days.
8. A multi-day recipe counts as cooked once for rotation purposes.
9. If a recipe block would exceed the remaining cooked-food days, reduce the block to the remaining number of days unless the user manually changes the plan.
10. Generating a draft plan should not immediately update recipe rotation.
11. Rotation updates only when the user accepts or commits the generated plan.
12. After the plan is accepted, every recipe used in the plan is moved to the back of the rotation queue.

Chosen multi-day policy:

```text
One recipe block, cooked once, scaled by people count and number of cooked-food days.
```

Example:

```text
People count: 2
Recipe days: 2
Total servings needed: 4
```

If a recipe has `base_servings = 2`, the multiplier is:

```text
(2 people * 2 days) / 2 base servings = 2x recipe ingredients
```

If a recipe stores ingredient quantities per single serving, then `base_servings` should be `1`.

## Shopping List Rules

The shopping list is generated from all recipe blocks in the selected plan.

Rules:

1. Calculate each ingredient using `ingredient.quantity * serving_multiplier`.
2. Group duplicate ingredients across the full plan.
3. Sum quantities when ingredient name and unit match.
4. Keep separate rows when the same ingredient uses incompatible units.
5. Display the list grouped by ingredient category.
6. Preserve notes where useful, but notes should not prevent quantity aggregation.
7. The result should be one practical shopping list for the configured plan.

Example:

```text
Recipe A needs 200 g pasta
Recipe B needs 300 g pasta
Shopping list shows 500 g pasta
```

Configurable day count example:

```text
Plan needs cooked food for 5 days
People count is 2
A recipe is planned for 2 cooked-food days
The recipe contributes ingredients for 4 servings
```

## UI Requirements

### Recipe List

Capabilities:

- View all recipes.
- Search or filter recipes.
- See when each recipe was last cooked.
- See base servings.
- See default days.
- Add, edit, and delete recipes.

### Recipe Editor

Capabilities:

- Edit recipe name.
- Edit description.
- Edit instructions.
- Edit base servings.
- Edit default days.
- Add, edit, and remove ingredients.
- Set ingredient quantity, unit, category, and optional note.

### Plan Generator

Capabilities:

- Set the plan start date.
- Set the number of cooked-food days.
- Set people count, defaulting to `2`.
- Generate a draft plan.
- Regenerate a draft plan.
- Accept or commit a plan.

### Meal Plan View

Capabilities:

- View each cooked-food day in the plan.
- Show recipe blocks spanning multiple cooked-food days.
- Change how many days a recipe should be eaten.
- Replace a recipe manually.
- Update shopping list calculations immediately after changes.

### Shopping List

Capabilities:

- View aggregated ingredients for the selected plan.
- Group ingredients by category.
- Show summed quantity and unit.
- Support checking items off locally in the UI.

### Mobile PWA Shell

Capabilities:

- Installable app manifest.
- Service worker for basic app shell caching.
- Mobile safe-area spacing.
- Bottom navigation for primary mobile workflows.
- System/light/dark theme support.
- Browser language detection with English and German UI strings.

## API / Server Actions

Prefer Astro server actions or API routes for mutations.

Initial server-side operations:

- `createRecipe`
- `updateRecipe`
- `deleteRecipe`
- `listRecipes`
- `getRecipe`
- `generateMealPlan`
- `updateMealPlanPeopleCount`
- `updateMealPlanPlannedDayCount`
- `updateMealPlanItemDays`
- `replaceMealPlanRecipe`
- `getShoppingListForMealPlan`
- `commitMealPlanRotation`

Important behavior:

- Generated plans can be drafts.
- Draft generation should not mutate recipe rotation.
- Rotation should update only when the user accepts or commits the plan.
- Shopping list calculation should be derived from plan items and recipe ingredients, not stored as duplicated permanent data unless needed later.

## Deployment Notes

Target deployment:

- Cloudflare Pages
- Astro Cloudflare adapter
- Cloudflare D1 binding

Expected implementation files:

- `astro.config.mjs`
- `wrangler.toml`
- D1 migration files
- TypeScript config
- Cloudflare D1 database binding

## Related Documents

See [Future Ideas](./future-ideas.md) for planned enhancements that are not part of the initial build.

See [Stack](./stack.md) for current framework, database, package manager, styling, and deployment decisions.

## Acceptance Criteria

The first implementation should satisfy:

- User can create, edit, and delete recipes.
- User can add structured ingredients to recipes.
- User can set recipe base servings.
- User can set recipe default days.
- User can generate a plan for a configurable number of cooked-food days.
- Default plan uses `7` cooked-food days.
- User can reduce planned cooked-food days, such as generating only `5` days when away for a weekend.
- Default people count is `2`.
- User can adjust people count for a plan.
- User can set a recipe to cover multiple cooked-food days.
- Multi-day recipes scale ingredient quantities correctly.
- Plan generation prefers recipes that have not been cooked for the longest time.
- Draft plan generation does not update rotation history.
- Accepting a plan moves used recipes to the end of the rotation.
- Shopping list groups duplicate ingredients and sums matching units.
- App is ready to deploy to Cloudflare Pages with D1.
