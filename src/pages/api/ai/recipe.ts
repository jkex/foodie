import type { APIRoute } from 'astro';
import { consumeAiQuota, generateRecipe, resolveAiRequest } from '../../../lib/ai';
import { createRecipe, getDb, getRecipe, listRecipeIngredients, updateRecipe } from '../../../lib/db';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? 'generate');
	const prompt = String(formData.get('prompt') ?? '')
		.trim()
		.slice(0, 2_000);
	const recipeId = Number(formData.get('id'));
	const backTo = action === 'edit' && Number.isFinite(recipeId) ? `/recipes/${recipeId}` : '/recipes/new';

	if (!prompt) {
		return redirect(backTo);
	}

	const db = getDb();
	const userId = locals.userId;
	try {
		const provider = formData.get('provider') || undefined;
		const model = formData.get('model') || undefined;
		const settings = await resolveAiRequest(db, userId, { provider, model });

		if (!(await consumeAiQuota(db, userId))) {
			return redirect(`${backTo}?ai_error=${encodeURIComponent('AI request limit reached. Try again next hour.')}`);
		}

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
