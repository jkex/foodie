import type { APIRoute } from 'astro';
import { commitMealPlanRotation, getDb } from '../../../lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const formData = await request.formData();
	const mealPlanId = Number(formData.get('meal_plan_id'));
	const db = getDb();

	if (!Number.isFinite(mealPlanId)) {
		return redirect('/');
	}

	await commitMealPlanRotation(db, mealPlanId);

	return redirect('/');
};
