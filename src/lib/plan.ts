import type { Recipe } from './db';

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
