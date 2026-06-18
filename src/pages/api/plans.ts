import type { APIRoute } from 'astro';
import { addMealPlanItem, createMealPlan, getDb, listRecipes } from '../../lib/db';
import { boundedPositiveInteger } from '../../lib/forms';
import { buildPlan } from '../../lib/plan';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const db = getDb();
	const userId = locals.userId;
	const requestedStartDate = String(formData.get('start_date') || '');
	const startDate = /^\d{4}-\d{2}-\d{2}$/.test(requestedStartDate) ? requestedStartDate : new Date().toISOString().slice(0, 10);
	const plannedDayCount = boundedPositiveInteger(formData, 'planned_day_count', 5, 14);
	const peopleCount = boundedPositiveInteger(formData, 'people_count', 2, 20);
	const recipes = await listRecipes(db, userId);
	const plan = buildPlan(recipes, plannedDayCount, peopleCount, { cycle: true });
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
