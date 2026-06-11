import { and, asc, eq, max, sql } from 'drizzle-orm';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import { ingredients, mealPlanItems, mealPlans, recipeIngredients, recipes } from '../db/schema';

type Database = DrizzleD1Database<{
	ingredients: typeof ingredients;
	mealPlanItems: typeof mealPlanItems;
	mealPlans: typeof mealPlans;
	recipeIngredients: typeof recipeIngredients;
	recipes: typeof recipes;
}>;

export type Recipe = {
	id: number;
	name: string;
	description: string;
	instructions: string;
	base_servings: number;
	default_days: number;
	last_cooked_at: string | null;
	rotation_index: number;
	created_at: string;
	updated_at: string;
};

export type RecipeIngredient = {
	id: number;
	recipe_id: number;
	ingredient_id: number;
	name: string;
	category: string;
	quantity: number;
	unit: string;
	note: string;
};

export type MealPlan = {
	id: number;
	start_date: string;
	planned_day_count: number;
	people_count: number;
	status: 'draft' | 'accepted';
	created_at: string;
	updated_at: string;
};

export type MealPlanItem = {
	id: number;
	meal_plan_id: number;
	recipe_id: number;
	recipe_name: string;
	start_day_index: number;
	day_count: number;
	people_count: number;
	serving_multiplier: number;
};

export type ShoppingListItem = {
	name: string;
	category: string;
	unit: string;
	total_quantity: number;
	notes: string | null;
};

export function getDb(): Database {
	if (!env.DB) {
		throw new Error('Missing D1 binding: DB');
	}

	return drizzle(env.DB, {
		schema: {
			ingredients,
			mealPlanItems,
			mealPlans,
			recipeIngredients,
			recipes,
		},
	});
}

export async function listRecipes(db: Database): Promise<Recipe[]> {
	const rows = await db
		.select()
		.from(recipes)
		.orderBy(sql`${recipes.lastCookedAt} IS NOT NULL`, asc(recipes.lastCookedAt), asc(recipes.rotationIndex), asc(recipes.id));

	return rows.map(toRecipe);
}

export async function listRecipeIngredients(db: Database, recipeId: number): Promise<RecipeIngredient[]> {
	const rows = await db
		.select({
			id: recipeIngredients.id,
			recipeId: recipeIngredients.recipeId,
			ingredientId: recipeIngredients.ingredientId,
			name: ingredients.name,
			category: ingredients.category,
			quantity: recipeIngredients.quantity,
			unit: recipeIngredients.unit,
			note: recipeIngredients.note,
		})
		.from(recipeIngredients)
		.innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
		.where(eq(recipeIngredients.recipeId, recipeId))
		.orderBy(asc(ingredients.category), asc(ingredients.name));

	return rows.map((row) => ({
		id: row.id,
		recipe_id: row.recipeId,
		ingredient_id: row.ingredientId,
		name: row.name,
		category: row.category,
		quantity: row.quantity,
		unit: row.unit,
		note: row.note,
	}));
}

export async function createRecipe(
	db: Database,
	input: {
		name: string;
		description: string;
		instructions: string;
		baseServings: number;
		defaultDays: number;
		ingredients: Array<{ name: string; category: string; quantity: number; unit: string; note: string }>;
	},
): Promise<number> {
	const [maxRotation] = await db.select({ value: max(recipes.rotationIndex) }).from(recipes);
	const [recipe] = await db
		.insert(recipes)
		.values({
			name: input.name,
			description: input.description,
			instructions: input.instructions,
			baseServings: input.baseServings,
			defaultDays: input.defaultDays,
			rotationIndex: (maxRotation?.value ?? 0) + 1,
		})
		.returning({ id: recipes.id });

	if (!recipe) {
		throw new Error('Failed to create recipe');
	}

	await replaceRecipeIngredients(db, recipe.id, input.ingredients);
	return recipe.id;
}

export async function deleteRecipe(db: Database, recipeId: number): Promise<void> {
	await db.delete(recipes).where(eq(recipes.id, recipeId));
}

async function replaceRecipeIngredients(
	db: Database,
	recipeId: number,
	inputIngredients: Array<{ name: string; category: string; quantity: number; unit: string; note: string }>,
): Promise<void> {
	await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, recipeId));

	for (const ingredient of inputIngredients) {
		if (!ingredient.name || ingredient.quantity <= 0) {
			continue;
		}

		await db
			.insert(ingredients)
			.values({
				name: ingredient.name,
				category: ingredient.category || 'Other',
			})
			.onConflictDoUpdate({
				target: ingredients.name,
				set: {
					category: ingredient.category || 'Other',
					updatedAt: sql`CURRENT_TIMESTAMP`,
				},
			});

		const [row] = await db.select({ id: ingredients.id }).from(ingredients).where(eq(ingredients.name, ingredient.name)).limit(1);
		if (!row) {
			throw new Error(`Failed to find ingredient: ${ingredient.name}`);
		}

		await db.insert(recipeIngredients).values({
			recipeId,
			ingredientId: row.id,
			quantity: ingredient.quantity,
			unit: ingredient.unit,
			note: ingredient.note,
		});
	}
}

export async function latestMealPlan(db: Database): Promise<MealPlan | null> {
	const [row] = await db.select().from(mealPlans).orderBy(sql`${mealPlans.createdAt} DESC`, sql`${mealPlans.id} DESC`).limit(1);
	return row ? toMealPlan(row) : null;
}

export async function listMealPlanItems(db: Database, mealPlanId: number): Promise<MealPlanItem[]> {
	const rows = await db
		.select({
			id: mealPlanItems.id,
			mealPlanId: mealPlanItems.mealPlanId,
			recipeId: mealPlanItems.recipeId,
			recipeName: recipes.name,
			startDayIndex: mealPlanItems.startDayIndex,
			dayCount: mealPlanItems.dayCount,
			peopleCount: mealPlanItems.peopleCount,
			servingMultiplier: mealPlanItems.servingMultiplier,
		})
		.from(mealPlanItems)
		.innerJoin(recipes, eq(recipes.id, mealPlanItems.recipeId))
		.where(eq(mealPlanItems.mealPlanId, mealPlanId))
		.orderBy(asc(mealPlanItems.startDayIndex));

	return rows.map((row) => ({
		id: row.id,
		meal_plan_id: row.mealPlanId,
		recipe_id: row.recipeId,
		recipe_name: row.recipeName,
		start_day_index: row.startDayIndex,
		day_count: row.dayCount,
		people_count: row.peopleCount,
		serving_multiplier: row.servingMultiplier,
	}));
}

export async function shoppingListForPlan(db: Database, mealPlanId: number): Promise<ShoppingListItem[]> {
	const totalQuantity = sql<number>`SUM(${recipeIngredients.quantity} * ${mealPlanItems.servingMultiplier})`;
	const notes = sql<string | null>`GROUP_CONCAT(NULLIF(${recipeIngredients.note}, ''), '; ')`;

	const rows = await db
		.select({
			name: ingredients.name,
			category: ingredients.category,
			unit: recipeIngredients.unit,
			total_quantity: totalQuantity,
			notes,
		})
		.from(mealPlanItems)
		.innerJoin(recipeIngredients, eq(recipeIngredients.recipeId, mealPlanItems.recipeId))
		.innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
		.where(eq(mealPlanItems.mealPlanId, mealPlanId))
		.groupBy(sql`LOWER(${ingredients.name})`, ingredients.category, recipeIngredients.unit)
		.orderBy(asc(ingredients.category), asc(ingredients.name));

	return rows;
}

export async function createMealPlan(
	db: Database,
	input: { startDate: string; plannedDayCount: number; peopleCount: number },
): Promise<number> {
	const [mealPlan] = await db
		.insert(mealPlans)
		.values({
			startDate: input.startDate,
			plannedDayCount: input.plannedDayCount,
			peopleCount: input.peopleCount,
			status: 'draft',
		})
		.returning({ id: mealPlans.id });

	if (!mealPlan) {
		throw new Error('Failed to create meal plan');
	}

	return mealPlan.id;
}

export async function addMealPlanItem(
	db: Database,
	input: {
		mealPlanId: number;
		recipeId: number;
		startDayIndex: number;
		dayCount: number;
		peopleCount: number;
		servingMultiplier: number;
	},
): Promise<void> {
	await db.insert(mealPlanItems).values(input);
}

export async function commitMealPlanRotation(db: Database, mealPlanId: number): Promise<void> {
	const items = await listMealPlanItems(db, mealPlanId);
	const [maxRotation] = await db.select({ value: max(recipes.rotationIndex) }).from(recipes);
	let rotationIndex = maxRotation?.value ?? 0;
	const cookedAt = new Date().toISOString();

	for (const item of items) {
		rotationIndex += 1;
		await db
			.update(recipes)
			.set({
				lastCookedAt: cookedAt,
				rotationIndex,
				updatedAt: sql`CURRENT_TIMESTAMP`,
			})
			.where(eq(recipes.id, item.recipe_id));
	}

	await db
		.update(mealPlans)
		.set({
			status: 'accepted',
			updatedAt: sql`CURRENT_TIMESTAMP`,
		})
		.where(and(eq(mealPlans.id, mealPlanId), eq(mealPlans.status, 'draft')));
}

function toRecipe(row: typeof recipes.$inferSelect): Recipe {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		instructions: row.instructions,
		base_servings: row.baseServings,
		default_days: row.defaultDays,
		last_cooked_at: row.lastCookedAt,
		rotation_index: row.rotationIndex,
		created_at: row.createdAt,
		updated_at: row.updatedAt,
	};
}

function toMealPlan(row: typeof mealPlans.$inferSelect): MealPlan {
	return {
		id: row.id,
		start_date: row.startDate,
		planned_day_count: row.plannedDayCount,
		people_count: row.peopleCount,
		status: row.status,
		created_at: row.createdAt,
		updated_at: row.updatedAt,
	};
}
