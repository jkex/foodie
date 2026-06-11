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

export function getDb(locals: App.Locals): D1Database {
	const db = locals.runtime?.env.DB;

	if (!db) {
		throw new Error('Missing D1 binding: DB');
	}

	return db;
}

export async function listRecipes(db: D1Database): Promise<Recipe[]> {
	const result = await db
		.prepare(
			`SELECT *
			 FROM recipes
			 ORDER BY
			   last_cooked_at IS NOT NULL,
			   last_cooked_at ASC,
			   rotation_index ASC,
			   id ASC`,
		)
		.all<Recipe>();

	return result.results ?? [];
}

export async function listRecipeIngredients(db: D1Database, recipeId: number): Promise<RecipeIngredient[]> {
	const result = await db
		.prepare(
			`SELECT
			   ri.id,
			   ri.recipe_id,
			   ri.ingredient_id,
			   i.name,
			   i.category,
			   ri.quantity,
			   ri.unit,
			   ri.note
			 FROM recipe_ingredients ri
			 JOIN ingredients i ON i.id = ri.ingredient_id
			 WHERE ri.recipe_id = ?
			 ORDER BY i.category, i.name`,
		)
		.bind(recipeId)
		.all<RecipeIngredient>();

	return result.results ?? [];
}

export async function createRecipe(
	db: D1Database,
	input: {
		name: string;
		description: string;
		instructions: string;
		baseServings: number;
		defaultDays: number;
		ingredients: Array<{ name: string; category: string; quantity: number; unit: string; note: string }>;
	},
): Promise<number> {
	const maxRotation = await db.prepare('SELECT COALESCE(MAX(rotation_index), 0) AS value FROM recipes').first<{ value: number }>();
	const recipe = await db
		.prepare(
			`INSERT INTO recipes (name, description, instructions, base_servings, default_days, rotation_index)
			 VALUES (?, ?, ?, ?, ?, ?)
			 RETURNING id`,
		)
		.bind(input.name, input.description, input.instructions, input.baseServings, input.defaultDays, (maxRotation?.value ?? 0) + 1)
		.first<{ id: number }>();

	if (!recipe) {
		throw new Error('Failed to create recipe');
	}

	await replaceRecipeIngredients(db, recipe.id, input.ingredients);
	return recipe.id;
}

export async function deleteRecipe(db: D1Database, recipeId: number): Promise<void> {
	await db.prepare('DELETE FROM recipes WHERE id = ?').bind(recipeId).run();
}

async function replaceRecipeIngredients(
	db: D1Database,
	recipeId: number,
	ingredients: Array<{ name: string; category: string; quantity: number; unit: string; note: string }>,
): Promise<void> {
	await db.prepare('DELETE FROM recipe_ingredients WHERE recipe_id = ?').bind(recipeId).run();

	for (const ingredient of ingredients) {
		if (!ingredient.name || ingredient.quantity <= 0) {
			continue;
		}

		await db
			.prepare(
				`INSERT INTO ingredients (name, category)
				 VALUES (?, ?)
				 ON CONFLICT(name) DO UPDATE SET category = excluded.category, updated_at = CURRENT_TIMESTAMP`,
			)
			.bind(ingredient.name, ingredient.category || 'Other')
			.run();

		const row = await db.prepare('SELECT id FROM ingredients WHERE name = ?').bind(ingredient.name).first<{ id: number }>();
		if (!row) {
			throw new Error(`Failed to find ingredient: ${ingredient.name}`);
		}

		await db
			.prepare(
				`INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit, note)
				 VALUES (?, ?, ?, ?, ?)`,
			)
			.bind(recipeId, row.id, ingredient.quantity, ingredient.unit, ingredient.note)
			.run();
	}
}

export async function latestMealPlan(db: D1Database): Promise<MealPlan | null> {
	return db.prepare('SELECT * FROM meal_plans ORDER BY created_at DESC, id DESC LIMIT 1').first<MealPlan>();
}

export async function listMealPlanItems(db: D1Database, mealPlanId: number): Promise<MealPlanItem[]> {
	const result = await db
		.prepare(
			`SELECT
			   mpi.id,
			   mpi.meal_plan_id,
			   mpi.recipe_id,
			   r.name AS recipe_name,
			   mpi.start_day_index,
			   mpi.day_count,
			   mpi.people_count,
			   mpi.serving_multiplier
			 FROM meal_plan_items mpi
			 JOIN recipes r ON r.id = mpi.recipe_id
			 WHERE mpi.meal_plan_id = ?
			 ORDER BY mpi.start_day_index`,
		)
		.bind(mealPlanId)
		.all<MealPlanItem>();

	return result.results ?? [];
}

export async function shoppingListForPlan(db: D1Database, mealPlanId: number): Promise<ShoppingListItem[]> {
	const result = await db
		.prepare(
			`SELECT
			   i.name,
			   i.category,
			   ri.unit,
			   SUM(ri.quantity * mpi.serving_multiplier) AS total_quantity,
			   GROUP_CONCAT(NULLIF(ri.note, ''), '; ') AS notes
			 FROM meal_plan_items mpi
			 JOIN recipe_ingredients ri ON ri.recipe_id = mpi.recipe_id
			 JOIN ingredients i ON i.id = ri.ingredient_id
			 WHERE mpi.meal_plan_id = ?
			 GROUP BY LOWER(i.name), i.category, ri.unit
			 ORDER BY i.category, i.name`,
		)
		.bind(mealPlanId)
		.all<ShoppingListItem>();

	return result.results ?? [];
}
