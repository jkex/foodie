import { eq } from 'drizzle-orm';
import type { APIRoute } from 'astro';
import { mealPlanItems } from '../../../db/schema';
import { getDb, getMealPlan, resequenceMealPlan, setMealPlanItemDays, setMealPlanItemRecipe } from '../../../lib/db';
import { positiveInteger } from '../../../lib/forms';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? '');
	const itemId = Number(formData.get('item_id'));
	const db = getDb();

	if (!Number.isFinite(itemId)) {
		return redirect('/plan/edit');
	}

	const [item] = await db
		.select({ mealPlanId: mealPlanItems.mealPlanId })
		.from(mealPlanItems)
		.where(eq(mealPlanItems.id, itemId))
		.limit(1);

	if (!item) {
		return redirect('/plan/edit');
	}

	const plan = await getMealPlan(db, locals.userId, item.mealPlanId);
	if (!plan || plan.status !== 'draft') {
		return redirect('/plan');
	}

	if (action === 'update_days') {
		await setMealPlanItemDays(db, itemId, positiveInteger(formData, 'day_count', 1));
	} else if (action === 'replace') {
		const recipeId = Number(formData.get('recipe_id'));
		if (Number.isFinite(recipeId)) {
			await setMealPlanItemRecipe(db, itemId, recipeId);
		}
	}

	await resequenceMealPlan(db, locals.userId, item.mealPlanId);
	return redirect('/plan/edit');
};
