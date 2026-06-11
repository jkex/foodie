import {
	addMealPlanItem,
	createMealPlan,
	getMealPlan,
	latestMealPlan,
	listRecipes,
	type Database,
	type MealPlan,
	type Recipe,
} from './db';

export type PlannedRecipe = {
	recipe: Recipe;
	startDayIndex: number;
	dayCount: number;
	servingMultiplier: number;
};

export function buildPlan(recipes: Recipe[], plannedDayCount: number, peopleCount: number): PlannedRecipe[] {
	const plan: PlannedRecipe[] = [];
	let dayIndex = 0;

	for (const recipe of recipes) {
		if (dayIndex >= plannedDayCount) {
			break;
		}

		const remainingDays = plannedDayCount - dayIndex;
		const dayCount = Math.min(Math.max(1, recipe.default_days), remainingDays);
		const servingMultiplier = (peopleCount * dayCount) / recipe.base_servings;

		plan.push({
			recipe,
			startDayIndex: dayIndex,
			dayCount,
			servingMultiplier,
		});

		dayIndex += dayCount;
	}

	return plan;
}

/**
 * Plans always start on a Monday. Monday through Wednesday still target the
 * current week's Monday; from Thursday on the target is next Monday.
 */
export function weeklyPlanStartDate(today: Date = new Date()): string {
	const day = today.getUTCDay(); // 0 = Sunday … 6 = Saturday
	const offset = day >= 1 && day <= 3 ? 1 - day : ((8 - day) % 7) || 7;
	const date = new Date(today);
	date.setUTCDate(date.getUTCDate() + offset);
	return date.toISOString().slice(0, 10);
}

/**
 * Make sure a plan exists for the week the user would currently shop for.
 * If the latest plan starts before the target Monday (or there is none), a
 * fresh draft is generated with the default 5 days for 2 people. Returns the
 * plan to display, or null when there are no recipes to plan with.
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

	const plannedDayCount = 5;
	const peopleCount = 2;
	const items = buildPlan(recipes, plannedDayCount, peopleCount);
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
