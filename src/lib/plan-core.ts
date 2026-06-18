export type PlanRecipe = {
	id: number;
	base_servings: number;
	default_days: number;
};

export type PlannedRecipe<T extends PlanRecipe = PlanRecipe> = {
	recipe: T;
	startDayIndex: number;
	dayCount: number;
	servingMultiplier: number;
};

/** How many days a freshly opened plan should always cover ahead: two weeks. */
export const PLAN_HORIZON_DAYS = 14;

/**
 * Lay recipes out across the planned days. By default each recipe is used once,
 * in rotation order, and the plan stops when the list is exhausted. With
 * `{ cycle: true }` the rotation wraps around so the full horizon is filled even
 * when the user only has a handful of recipes — used for the always-on two-week plan.
 */
export function buildPlan<T extends PlanRecipe>(
	recipes: T[],
	plannedDayCount: number,
	peopleCount: number,
	options: { cycle?: boolean } = {},
): PlannedRecipe<T>[] {
	const plan: PlannedRecipe<T>[] = [];
	if (recipes.length === 0) return plan;

	let dayIndex = 0;
	let pick = 0;
	while (dayIndex < plannedDayCount) {
		const recipe = recipes[pick % recipes.length];
		const dayCount = Math.min(Math.max(1, recipe.default_days), plannedDayCount - dayIndex);
		plan.push({
			recipe,
			startDayIndex: dayIndex,
			dayCount,
			servingMultiplier: (peopleCount * dayCount) / recipe.base_servings,
		});
		dayIndex += dayCount;
		pick++;
		if (!options.cycle && pick >= recipes.length) break;
	}

	return plan;
}

/**
 * Reorder recipes to follow an AI-suggested sequence of recipe ids. Unknown or
 * duplicate ids in `orderedIds` are ignored, and any recipes the model left out
 * are appended in their original rotation order — so the result is always a
 * complete permutation of `recipes`, no matter how malformed the model output is.
 */
export function applyRecipeOrder<T extends { id: number }>(recipes: T[], orderedIds: number[]): T[] {
	const byId = new Map(recipes.map((recipe) => [recipe.id, recipe]));
	const seen = new Set<number>();
	const ordered: T[] = [];

	for (const id of orderedIds) {
		const recipe = byId.get(id);
		if (recipe && !seen.has(id)) {
			ordered.push(recipe);
			seen.add(id);
		}
	}
	for (const recipe of recipes) {
		if (!seen.has(recipe.id)) {
			ordered.push(recipe);
		}
	}

	return ordered;
}

export function weeklyPlanStartDate(today: Date = new Date()): string {
	const day = today.getUTCDay();
	const offset = day >= 1 && day <= 3 ? 1 - day : (8 - day) % 7 || 7;
	const date = new Date(today);
	date.setUTCDate(date.getUTCDate() + offset);
	return date.toISOString().slice(0, 10);
}
