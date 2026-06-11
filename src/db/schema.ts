import { sql } from 'drizzle-orm';
import { check, index, integer, real, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core';

export const recipes = sqliteTable(
	'recipes',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: text('user_id').notNull().default('local'),
		name: text('name').notNull(),
		description: text('description').notNull().default(''),
		instructions: text('instructions').notNull().default(''),
		baseServings: real('base_servings').notNull().default(2),
		defaultDays: integer('default_days').notNull().default(1),
		lastCookedAt: text('last_cooked_at'),
		rotationIndex: integer('rotation_index').notNull().default(0),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		check('recipes_base_servings_positive', sql`${table.baseServings} > 0`),
		check('recipes_default_days_positive', sql`${table.defaultDays} > 0`),
		index('idx_recipes_rotation').on(table.lastCookedAt, table.rotationIndex, table.id),
		index('idx_recipes_user').on(table.userId),
	],
);

export const ingredients = sqliteTable(
	'ingredients',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: text('user_id').notNull().default('local'),
		name: text('name').notNull(),
		category: text('category').notNull().default('Other'),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [uniqueIndex('ingredients_user_name_unique').on(table.userId, table.name)],
);

export const recipeIngredients = sqliteTable(
	'recipe_ingredients',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		recipeId: integer('recipe_id')
			.notNull()
			.references(() => recipes.id, { onDelete: 'cascade' }),
		ingredientId: integer('ingredient_id')
			.notNull()
			.references(() => ingredients.id, { onDelete: 'cascade' }),
		quantity: real('quantity').notNull(),
		unit: text('unit').notNull().default(''),
		note: text('note').notNull().default(''),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		check('recipe_ingredients_quantity_non_negative', sql`${table.quantity} >= 0`),
		index('idx_recipe_ingredients_recipe').on(table.recipeId),
	],
);

export const mealPlans = sqliteTable(
	'meal_plans',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		userId: text('user_id').notNull().default('local'),
		startDate: text('start_date').notNull(),
		plannedDayCount: integer('planned_day_count').notNull().default(5),
		peopleCount: integer('people_count').notNull().default(2),
		status: text('status', { enum: ['draft', 'accepted'] }).notNull().default('draft'),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
		updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		check('meal_plans_planned_day_count_positive', sql`${table.plannedDayCount} > 0`),
		check('meal_plans_people_count_positive', sql`${table.peopleCount} > 0`),
		check('meal_plans_status_valid', sql`${table.status} IN ('draft', 'accepted')`),
		index('idx_meal_plans_created').on(table.createdAt),
		index('idx_meal_plans_user').on(table.userId),
	],
);

export const mealPlanItems = sqliteTable(
	'meal_plan_items',
	{
		id: integer('id').primaryKey({ autoIncrement: true }),
		mealPlanId: integer('meal_plan_id')
			.notNull()
			.references(() => mealPlans.id, { onDelete: 'cascade' }),
		recipeId: integer('recipe_id')
			.notNull()
			.references(() => recipes.id, { onDelete: 'cascade' }),
		startDayIndex: integer('start_day_index').notNull(),
		dayCount: integer('day_count').notNull(),
		peopleCount: integer('people_count').notNull(),
		servingMultiplier: real('serving_multiplier').notNull(),
		createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [
		check('meal_plan_items_start_day_index_non_negative', sql`${table.startDayIndex} >= 0`),
		check('meal_plan_items_day_count_positive', sql`${table.dayCount} > 0`),
		check('meal_plan_items_people_count_positive', sql`${table.peopleCount} > 0`),
		check('meal_plan_items_serving_multiplier_positive', sql`${table.servingMultiplier} > 0`),
		index('idx_meal_plan_items_plan').on(table.mealPlanId, table.startDayIndex),
	],
);

export const aiSettings = sqliteTable(
	'ai_settings',
	{
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: text('user_id').notNull().default('local'),
	provider: text('provider', { enum: ['anthropic', 'openai'] }).notNull(),
	apiKey: text('api_key').notNull(),
	model: text('model').notNull().default(''),
	createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
	},
	(table) => [uniqueIndex('ai_settings_user_unique').on(table.userId)],
);

export type RecipeRow = typeof recipes.$inferSelect;
export type RecipeInsert = typeof recipes.$inferInsert;
export type MealPlanRow = typeof mealPlans.$inferSelect;
