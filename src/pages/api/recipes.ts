import type { APIRoute } from 'astro';
import { createRecipe, deleteRecipe, getDb, updateRecipe } from '../../lib/db';
import { parseIngredientRows, positiveInteger, positiveNumber, requiredString } from '../../lib/forms';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? 'create');
	const db = getDb();
	const userId = locals.userId;

	if (action === 'delete') {
		const id = Number(formData.get('id'));
		if (Number.isFinite(id)) {
			await deleteRecipe(db, userId, id);
		}
		return redirect('/recipes');
	}

	const input = {
		name: requiredString(formData, 'name'),
		description: String(formData.get('description') ?? ''),
		instructions: String(formData.get('instructions') ?? ''),
		baseServings: positiveNumber(formData, 'base_servings', 2),
		defaultDays: positiveInteger(formData, 'default_days', 1),
		ingredients: parseIngredientRows(formData),
	};

	if (action === 'update') {
		const id = Number(formData.get('id'));
		if (Number.isFinite(id)) {
			await updateRecipe(db, userId, id, input);
			return redirect(`/recipes/${id}`);
		}
		return redirect('/recipes');
	}

	await createRecipe(db, userId, input);
	return redirect('/recipes');
};
