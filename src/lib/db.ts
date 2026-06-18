import { and, asc, eq, max, sql, or } from 'drizzle-orm';
import { drizzle, type DrizzleD1Database } from 'drizzle-orm/d1';
import { env } from 'cloudflare:workers';
import {
	aiProviderKeys,
	aiSettings,
	aiUsage,
	ingredients,
	mealPlanItems,
	mealPlans,
	recipeIngredients,
	recipeRotationState,
	recipes,
} from '../db/schema';

export type Database = DrizzleD1Database<{
	ingredients: typeof ingredients;
	mealPlanItems: typeof mealPlanItems;
	mealPlans: typeof mealPlans;
	recipeIngredients: typeof recipeIngredients;
	recipeRotationState: typeof recipeRotationState;
	recipes: typeof recipes;
	aiSettings: typeof aiSettings;
	aiProviderKeys: typeof aiProviderKeys;
	aiUsage: typeof aiUsage;
}>;

export type Recipe = {
	id: number;
	userId: string;
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
			recipeRotationState,
			recipes,
			aiSettings,
			aiProviderKeys,
			aiUsage,
		},
	});
}

export async function listRecipes(db: Database, userId: string): Promise<Recipe[]> {
	const rows = await db
		.select({
			recipe: recipes,
			effectiveLastCookedAt: sql<string | null>`CASE
				WHEN ${recipes.userId} = 'system' THEN ${recipeRotationState.lastCookedAt}
				ELSE ${recipes.lastCookedAt}
			END`,
			effectiveRotationIndex: sql<number>`CASE
				WHEN ${recipes.userId} = 'system' THEN COALESCE(${recipeRotationState.rotationIndex}, ${recipes.rotationIndex})
				ELSE ${recipes.rotationIndex}
			END`,
		})
		.from(recipes)
		.leftJoin(recipeRotationState, and(eq(recipeRotationState.recipeId, recipes.id), eq(recipeRotationState.userId, userId)))
		.where(
			userId === 'local'
				? or(eq(recipes.userId, 'local'), eq(recipes.userId, 'system'))
				: or(eq(recipes.userId, userId), eq(recipes.userId, 'system')),
		)
		.orderBy(
			sql`CASE WHEN ${recipes.userId} = 'system' THEN ${recipeRotationState.lastCookedAt} ELSE ${recipes.lastCookedAt} END IS NOT NULL`,
			asc(sql`CASE WHEN ${recipes.userId} = 'system' THEN ${recipeRotationState.lastCookedAt} ELSE ${recipes.lastCookedAt} END`),
			asc(
				sql`CASE
					WHEN ${recipes.userId} = 'system' THEN COALESCE(${recipeRotationState.rotationIndex}, ${recipes.rotationIndex})
					ELSE ${recipes.rotationIndex}
				END`,
			),
			asc(recipes.id),
		);

	return rows.map(({ recipe, effectiveLastCookedAt, effectiveRotationIndex }) => ({
		...toRecipe(recipe),
		last_cooked_at: effectiveLastCookedAt,
		rotation_index: effectiveRotationIndex,
	}));
}

export async function listRecipeIngredients(db: Database, userId: string, recipeId: number): Promise<RecipeIngredient[]> {
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
		.innerJoin(recipes, eq(recipes.id, recipeIngredients.recipeId))
		.where(
			and(
				eq(recipeIngredients.recipeId, recipeId),
				userId === 'local'
					? or(eq(recipes.userId, 'local'), eq(recipes.userId, 'system'))
					: or(eq(recipes.userId, userId), eq(recipes.userId, 'system')),
			),
		)
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
	userId: string,
	input: {
		name: string;
		description: string;
		instructions: string;
		baseServings: number;
		defaultDays: number;
		ingredients: Array<{ name: string; category: string; quantity: number; unit: string; note: string }>;
	},
): Promise<number> {
	const [maxRotation] = await db
		.select({ value: max(recipes.rotationIndex) })
		.from(recipes)
		.where(eq(recipes.userId, userId));
	const [recipe] = await db
		.insert(recipes)
		.values({
			userId,
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

	await replaceRecipeIngredients(db, userId, recipe.id, input.ingredients);
	return recipe.id;
}

export async function getRecipe(db: Database, userId: string, recipeId: number): Promise<Recipe | null> {
	const [row] = await db
		.select()
		.from(recipes)
		.where(
			and(
				eq(recipes.id, recipeId),
				userId === 'local'
					? or(eq(recipes.userId, 'local'), eq(recipes.userId, 'system'))
					: or(eq(recipes.userId, userId), eq(recipes.userId, 'system')),
			),
		)
		.limit(1);
	return row ? toRecipe(row) : null;
}

export async function updateRecipe(
	db: Database,
	userId: string,
	recipeId: number,
	input: {
		name: string;
		description: string;
		instructions: string;
		baseServings: number;
		defaultDays: number;
		ingredients: Array<{ name: string; category: string; quantity: number; unit: string; note: string }>;
	},
): Promise<void> {
	const owned = await getRecipe(db, userId, recipeId);
	if (!owned || owned.userId !== userId) {
		return;
	}

	await db
		.update(recipes)
		.set({
			name: input.name,
			description: input.description,
			instructions: input.instructions,
			baseServings: input.baseServings,
			defaultDays: input.defaultDays,
			updatedAt: sql`CURRENT_TIMESTAMP`,
		})
		.where(and(eq(recipes.id, recipeId), eq(recipes.userId, userId)));

	await replaceRecipeIngredients(db, userId, recipeId, input.ingredients);
}

export async function deleteRecipe(db: Database, userId: string, recipeId: number): Promise<void> {
	await db.delete(recipes).where(and(eq(recipes.id, recipeId), eq(recipes.userId, userId)));
}

async function replaceRecipeIngredients(
	db: Database,
	userId: string,
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
				userId,
				name: ingredient.name,
				category: ingredient.category || 'Other',
			})
			.onConflictDoUpdate({
				target: [ingredients.userId, ingredients.name],
				set: {
					category: ingredient.category || 'Other',
					updatedAt: sql`CURRENT_TIMESTAMP`,
				},
			});

		const [row] = await db
			.select({ id: ingredients.id })
			.from(ingredients)
			.where(and(eq(ingredients.name, ingredient.name), eq(ingredients.userId, userId)))
			.limit(1);
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

export async function latestMealPlan(db: Database, userId: string): Promise<MealPlan | null> {
	const [row] = await db
		.select()
		.from(mealPlans)
		.where(eq(mealPlans.userId, userId))
		.orderBy(sql`${mealPlans.createdAt} DESC`, sql`${mealPlans.id} DESC`)
		.limit(1);
	return row ? toMealPlan(row) : null;
}

export async function listMealPlanItems(db: Database, userId: string, mealPlanId: number): Promise<MealPlanItem[]> {
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
		.innerJoin(mealPlans, eq(mealPlans.id, mealPlanItems.mealPlanId))
		.where(and(eq(mealPlanItems.mealPlanId, mealPlanId), eq(mealPlans.userId, userId)))
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

export async function shoppingListForPlan(db: Database, userId: string, mealPlanId: number): Promise<ShoppingListItem[]> {
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
		.innerJoin(mealPlans, eq(mealPlans.id, mealPlanItems.mealPlanId))
		.innerJoin(recipeIngredients, eq(recipeIngredients.recipeId, mealPlanItems.recipeId))
		.innerJoin(ingredients, eq(ingredients.id, recipeIngredients.ingredientId))
		.where(and(eq(mealPlanItems.mealPlanId, mealPlanId), eq(mealPlans.userId, userId)))
		.groupBy(sql`LOWER(${ingredients.name})`, ingredients.category, recipeIngredients.unit)
		.orderBy(asc(ingredients.category), asc(ingredients.name));

	return rows;
}

export async function createMealPlan(
	db: Database,
	userId: string,
	input: { startDate: string; plannedDayCount: number; peopleCount: number },
): Promise<number> {
	const [mealPlan] = await db
		.insert(mealPlans)
		.values({
			userId,
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

export async function getMealPlan(db: Database, userId: string, mealPlanId: number): Promise<MealPlan | null> {
	const [row] = await db
		.select()
		.from(mealPlans)
		.where(and(eq(mealPlans.id, mealPlanId), eq(mealPlans.userId, userId)))
		.limit(1);
	return row ? toMealPlan(row) : null;
}

export async function setMealPlanItemDays(db: Database, itemId: number, dayCount: number): Promise<void> {
	await db.update(mealPlanItems).set({ dayCount }).where(eq(mealPlanItems.id, itemId));
}

export async function setMealPlanItemRecipe(db: Database, itemId: number, recipeId: number): Promise<void> {
	await db.update(mealPlanItems).set({ recipeId }).where(eq(mealPlanItems.id, itemId));
}

/**
 * Recompute start day indexes, clamp blocks to the plan's day budget, and refresh
 * serving multipliers after an item edit. Items pushed entirely past the planned
 * day count are removed.
 */
export async function resequenceMealPlan(db: Database, userId: string, mealPlanId: number): Promise<void> {
	const plan = await getMealPlan(db, userId, mealPlanId);
	if (!plan) {
		return;
	}

	const items = await listMealPlanItems(db, userId, mealPlanId);
	const recipeRows = await db
		.select({ id: recipes.id, baseServings: recipes.baseServings })
		.from(recipes)
		.where(or(eq(recipes.userId, userId), eq(recipes.userId, 'system')));
	const baseServingsById = new Map(recipeRows.map((row) => [row.id, row.baseServings]));
	let dayIndex = 0;

	for (const item of items) {
		if (dayIndex >= plan.planned_day_count) {
			await db.delete(mealPlanItems).where(eq(mealPlanItems.id, item.id));
			continue;
		}

		const dayCount = Math.min(Math.max(1, item.day_count), plan.planned_day_count - dayIndex);
		const baseServings = baseServingsById.get(item.recipe_id) ?? 1;
		const servingMultiplier = (plan.people_count * dayCount) / baseServings;

		await db
			.update(mealPlanItems)
			.set({ startDayIndex: dayIndex, dayCount, peopleCount: plan.people_count, servingMultiplier })
			.where(eq(mealPlanItems.id, item.id));

		dayIndex += dayCount;
	}
}

export async function commitMealPlanRotation(db: Database, userId: string, mealPlanId: number): Promise<void> {
	const plan = await getMealPlan(db, userId, mealPlanId);
	if (!plan || plan.status !== 'draft') {
		return;
	}

	const items = await listMealPlanItems(db, userId, mealPlanId);
	const visibleRecipes = await listRecipes(db, userId);
	let rotationIndex = visibleRecipes.reduce((currentMax, recipe) => Math.max(currentMax, recipe.rotation_index), 0);
	const cookedAt = new Date().toISOString();

	for (const recipeId of new Set(items.map((item) => item.recipe_id))) {
		rotationIndex += 1;
		const recipe = visibleRecipes.find((candidate) => candidate.id === recipeId);
		if (recipe?.userId === 'system') {
			await db
				.insert(recipeRotationState)
				.values({ userId, recipeId, lastCookedAt: cookedAt, rotationIndex })
				.onConflictDoUpdate({
					target: [recipeRotationState.userId, recipeRotationState.recipeId],
					set: { lastCookedAt: cookedAt, rotationIndex, updatedAt: sql`CURRENT_TIMESTAMP` },
				});
		} else {
			await db
				.update(recipes)
				.set({
					lastCookedAt: cookedAt,
					rotationIndex,
					updatedAt: sql`CURRENT_TIMESTAMP`,
				})
				.where(and(eq(recipes.id, recipeId), eq(recipes.userId, userId)));
		}
	}

	await db
		.update(mealPlans)
		.set({
			status: 'accepted',
			updatedAt: sql`CURRENT_TIMESTAMP`,
		})
		.where(and(eq(mealPlans.id, mealPlanId), eq(mealPlans.userId, userId), eq(mealPlans.status, 'draft')));
}

function toRecipe(row: typeof recipes.$inferSelect): Recipe {
	return {
		id: row.id,
		userId: row.userId,
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
