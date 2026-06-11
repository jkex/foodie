import type { APIRoute } from 'astro';
import { commitMealPlanRotation, getDb } from '../../../lib/db';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const mealPlanId = Number(formData.get('meal_plan_id'));

	if (Number.isFinite(mealPlanId)) {
		await commitMealPlanRotation(getDb(), locals.userId, mealPlanId);
	}

	return redirect('/plan');
};
