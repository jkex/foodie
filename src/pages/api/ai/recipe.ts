import type { APIRoute } from 'astro';
import { generateRecipe, getAiSettings } from '../../../lib/ai';
import { createRecipe, getDb, getRecipe, listRecipeIngredients, updateRecipe } from '../../../lib/db';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? 'generate');
	const prompt = String(formData.get('prompt') ?? '').trim();
	const recipeId = Number(formData.get('id'));
	const backTo = action === 'edit' && Number.isFinite(recipeId) ? `/recipes/${recipeId}` : '/recipes/new';

	if (!prompt) {
		return redirect(backTo);
	}

	const db = getDb();
	const userId = locals.userId;
	const settings = await getAiSettings(db, userId);
	if (!settings) {
		return redirect(`${backTo}?ai_error=${encodeURIComponent('AI is not configured.')}`);
	}

	try {
		if (action === 'edit') {
			const recipe = await getRecipe(db, userId, recipeId);
			if (!recipe) {
				return redirect('/recipes');
			}
			const ingredients = await listRecipeIngredients(db, userId, recipe.id);
			const result = await generateRecipe(settings, prompt, { recipe, ingredients });
			await updateRecipe(db, userId, recipe.id, {
				name: result.name,
				description: result.description,
				instructions: result.instructions,
				baseServings: result.base_servings,
				defaultDays: result.default_days,
				ingredients: result.ingredients,
			});
			return redirect(`/recipes/${recipe.id}`);
		}

		const result = await generateRecipe(settings, prompt);
		const id = await createRecipe(db, userId, {
			name: result.name,
			description: result.description,
			instructions: result.instructions,
			baseServings: result.base_servings,
			defaultDays: result.default_days,
			ingredients: result.ingredients,
		});
		return redirect(`/recipes/${id}`);
	} catch (error) {
		const message = error instanceof Error ? error.message : 'AI request failed';
		return redirect(`${backTo}?ai_error=${encodeURIComponent(message.slice(0, 200))}`);
	}
};
