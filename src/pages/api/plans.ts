import type { APIRoute } from 'astro';
import { getDb, listRecipes } from '../../lib/db';
import { buildPlan } from '../../lib/plan';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const formData = await request.formData();
	const db = getDb(locals);
	const startDate = String(formData.get('start_date') || new Date().toISOString().slice(0, 10));
	const plannedDayCount = positiveInteger(formData, 'planned_day_count', 7);
	const peopleCount = positiveInteger(formData, 'people_count', 2);
	const recipes = await listRecipes(db);
	const plan = buildPlan(recipes, plannedDayCount, peopleCount);

	const mealPlan = await db
		.prepare(
			`INSERT INTO meal_plans (start_date, planned_day_count, people_count, status)
			 VALUES (?, ?, ?, 'draft')
			 RETURNING id`,
		)
		.bind(startDate, plannedDayCount, peopleCount)
		.first<{ id: number }>();

	if (!mealPlan) {
		throw new Error('Failed to create meal plan');
	}

	for (const item of plan) {
		await db
			.prepare(
				`INSERT INTO meal_plan_items
				   (meal_plan_id, recipe_id, start_day_index, day_count, people_count, serving_multiplier)
				 VALUES (?, ?, ?, ?, ?, ?)`,
			)
			.bind(mealPlan.id, item.recipe.id, item.startDayIndex, item.dayCount, peopleCount, item.servingMultiplier)
			.run();
	}

	return redirect('/');
};

function positiveInteger(formData: FormData, key: string, fallback: number): number {
	const value = Number(formData.get(key));
	return Number.isFinite(value) && value > 0 ? Math.max(1, Math.round(value)) : fallback;
}
