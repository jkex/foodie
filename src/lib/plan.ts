import { addMealPlanItem, createMealPlan, getMealPlan, latestMealPlan, listRecipes, type Database, type MealPlan } from './db';
import { applyRecipeOrder, buildPlan, PLAN_HORIZON_DAYS, weeklyPlanStartDate } from './plan-core';

export { applyRecipeOrder, buildPlan, PLAN_HORIZON_DAYS, weeklyPlanStartDate };

/**
 * Make sure a full two-week plan is always waiting when the user opens the app.
 * If the latest plan starts before the upcoming shopping Monday (or there is
 * none), a fresh draft covering the next two weeks is generated for 2 people,
 * cycling through the recipe rotation so every day is filled. Returns the plan
 * to display, or null when there are no recipes to plan with.
 */
export async function ensureWeeklyPlan(db: Database, userId: string): Promise<MealPlan | null> {
	const target = weeklyPlanStartDate();
	const latest = await latestMealPlan(db, userId);
	if (latest && latest.start_date >= target) {
		return latest;
	}

	const recipes = await listRecipes(db, userId);
	if (recipes.length === 0) {
		return latest;
	}

	const plannedDayCount = PLAN_HORIZON_DAYS;
	const peopleCount = 2;
	const items = buildPlan(recipes, plannedDayCount, peopleCount, { cycle: true });
	const mealPlanId = await createMealPlan(db, userId, { startDate: target, plannedDayCount, peopleCount });
	for (const item of items) {
		await addMealPlanItem(db, {
			mealPlanId,
			recipeId: item.recipe.id,
			startDayIndex: item.startDayIndex,
			dayCount: item.dayCount,
			peopleCount,
			servingMultiplier: item.servingMultiplier,
		});
	}

	return getMealPlan(db, userId, mealPlanId);
}
