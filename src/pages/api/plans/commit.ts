import type { APIRoute } from 'astro';
import { getDb, listMealPlanItems } from '../../../lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const formData = await request.formData();
	const mealPlanId = Number(formData.get('meal_plan_id'));
	const db = getDb();

	if (!Number.isFinite(mealPlanId)) {
		return redirect('/');
	}

	const items = await listMealPlanItems(db, mealPlanId);
	const maxRotation = await db.prepare('SELECT COALESCE(MAX(rotation_index), 0) AS value FROM recipes').first<{ value: number }>();
	let rotationIndex = maxRotation?.value ?? 0;
	const cookedAt = new Date().toISOString();

	for (const item of items) {
		rotationIndex += 1;
		await db
			.prepare('UPDATE recipes SET last_cooked_at = ?, rotation_index = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
			.bind(cookedAt, rotationIndex, item.recipe_id)
			.run();
	}

	await db.prepare("UPDATE meal_plans SET status = 'accepted', updated_at = CURRENT_TIMESTAMP WHERE id = ?").bind(mealPlanId).run();

	return redirect('/');
};
