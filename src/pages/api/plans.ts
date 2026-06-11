import type { APIRoute } from 'astro';
import { addMealPlanItem, createMealPlan, getDb, listRecipes } from '../../lib/db';
import { positiveInteger } from '../../lib/forms';
import { buildPlan } from '../../lib/plan';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const db = getDb();
	const userId = locals.userId;
	const startDate = String(formData.get('start_date') || new Date().toISOString().slice(0, 10));
	const plannedDayCount = positiveInteger(formData, 'planned_day_count', 7);
	const peopleCount = positiveInteger(formData, 'people_count', 2);
	const recipes = await listRecipes(db, userId);
	const plan = buildPlan(recipes, plannedDayCount, peopleCount);
	const mealPlanId = await createMealPlan(db, userId, { startDate, plannedDayCount, peopleCount });

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

	return redirect('/plan');
};
