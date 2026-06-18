import type { APIRoute } from 'astro';
import { consumeAiQuota, resolveAiRequest, suggestPlanOrder } from '../../../lib/ai';
import { addMealPlanItem, createMealPlan, getDb, latestMealPlan, listRecipes } from '../../../lib/db';
import { applyRecipeOrder, buildPlan, PLAN_HORIZON_DAYS, weeklyPlanStartDate } from '../../../lib/plan';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const db = getDb();
	const userId = locals.userId;

	const formData = await request.formData();
	const provider = formData.get('provider') || undefined;
	const model = formData.get('model') || undefined;

	const recipes = await listRecipes(db, userId);
	if (recipes.length === 0) {
		return redirect('/plan');
	}

	// Reuse the current plan's shape so an AI re-roll feels like a remix, not a reset.
	const latest = await latestMealPlan(db, userId);
	const startDate = latest?.start_date ?? weeklyPlanStartDate();
	const plannedDayCount = latest?.planned_day_count ?? PLAN_HORIZON_DAYS;
	const peopleCount = latest?.people_count ?? 2;

	try {
		const settings = await resolveAiRequest(db, userId, { provider, model });
		if (!(await consumeAiQuota(db, userId))) {
			return redirect(`/plan?ai_error=${encodeURIComponent('AI request limit reached. Try again next hour.')}`);
		}

		const order = await suggestPlanOrder(settings, recipes, plannedDayCount);
		const ordered = applyRecipeOrder(recipes, order);
		const plan = buildPlan(ordered, plannedDayCount, peopleCount, { cycle: true });

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
	} catch (error) {
		const message = error instanceof Error ? error.message : 'AI request failed';
		return redirect(`/plan?ai_error=${encodeURIComponent(message.slice(0, 200))}`);
	}
};
