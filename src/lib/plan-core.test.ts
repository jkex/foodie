import { describe, expect, it } from 'vitest';
import { applyRecipeOrder, buildPlan, weeklyPlanStartDate } from './plan-core';

describe('buildPlan', () => {
	it('clamps the last recipe and scales servings', () => {
		const recipes = [
			{ id: 1, default_days: 2, base_servings: 2 },
			{ id: 2, default_days: 4, base_servings: 4 },
		];
		expect(buildPlan(recipes, 5, 2)).toEqual([
			{ recipe: recipes[0], startDayIndex: 0, dayCount: 2, servingMultiplier: 2 },
			{ recipe: recipes[1], startDayIndex: 2, dayCount: 3, servingMultiplier: 1.5 },
		]);
	});

	it('stops when recipes run out', () => {
		expect(buildPlan([{ id: 1, default_days: 1, base_servings: 2 }], 5, 2)).toHaveLength(1);
	});

	it('cycles through recipes to fill the horizon when asked', () => {
		const recipes = [
			{ id: 1, default_days: 2, base_servings: 2 },
			{ id: 2, default_days: 1, base_servings: 2 },
		];
		const plan = buildPlan(recipes, 14, 2, { cycle: true });
		expect(plan.reduce((sum, item) => sum + item.dayCount, 0)).toBe(14);
		expect(plan[0].recipe.id).toBe(1);
		expect(plan[1].recipe.id).toBe(2);
		expect(plan[2].recipe.id).toBe(1);
		expect(plan.at(-1)!.startDayIndex + plan.at(-1)!.dayCount).toBe(14);
	});
});

describe('applyRecipeOrder', () => {
	const recipes = [{ id: 1 }, { id: 2 }, { id: 3 }];

	it('reorders recipes to match the suggested ids', () => {
		expect(applyRecipeOrder(recipes, [3, 1, 2])).toEqual([{ id: 3 }, { id: 1 }, { id: 2 }]);
	});

	it('appends omitted recipes in original order', () => {
		expect(applyRecipeOrder(recipes, [2])).toEqual([{ id: 2 }, { id: 1 }, { id: 3 }]);
	});

	it('ignores unknown and duplicate ids', () => {
		expect(applyRecipeOrder(recipes, [99, 2, 2, 1])).toEqual([{ id: 2 }, { id: 1 }, { id: 3 }]);
	});

	it('falls back to the original order for empty suggestions', () => {
		expect(applyRecipeOrder(recipes, [])).toEqual(recipes);
	});
});

describe('weeklyPlanStartDate', () => {
	it('targets the current Monday through Wednesday', () => {
		expect(weeklyPlanStartDate(new Date('2026-06-17T12:00:00Z'))).toBe('2026-06-15');
	});

	it('targets next Monday from Thursday', () => {
		expect(weeklyPlanStartDate(new Date('2026-06-18T12:00:00Z'))).toBe('2026-06-22');
	});
});
