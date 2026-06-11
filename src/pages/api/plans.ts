import type { APIRoute } from 'astro';
import { addMealPlanItem, createMealPlan, getDb, listRecipes } from '../../lib/db';
import { buildPlan } from '../../lib/plan';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const formData = await request.formData();
	const db = getDb();
	const startDate = String(formData.get('start_date') || new Date().toISOString().slice(0, 10));
	const plannedDayCount = positiveInteger(formData, 'planned_day_count', 7);
	const peopleCount = positiveInteger(formData, 'people_count', 2);
	const recipes = await listRecipes(db);
	const plan = buildPlan(recipes, plannedDayCount, peopleCount);
	const mealPlanId = await createMealPlan(db, { startDate, plannedDayCount, peopleCount });

	for (const item of plan) {
		await addMealPlanItem(db, {
			mealPlanId,
			recipeId: item.recipe.id,
			startDayIndex: item.startDayIndex,
			dayCount: item.dayCount,
			peopleCount,
			servingMultiplier: item.servingMultiplier,
		});
	}

	return redirect('/');
};

function positiveInteger(formData: FormData, key: string, fallback: number): number {
	const value = Number(formData.get(key));
	return Number.isFinite(value) && value > 0 ? Math.max(1, Math.round(value)) : fallback;
}
