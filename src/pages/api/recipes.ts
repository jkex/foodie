import type { APIRoute } from 'astro';
import { createRecipe, deleteRecipe, getDb } from '../../lib/db';

export const POST: APIRoute = async ({ request, locals, redirect }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? 'create');
	const db = getDb(locals);

	if (action === 'delete') {
		const id = Number(formData.get('id'));
		if (Number.isFinite(id)) {
			await deleteRecipe(db, id);
		}
		return redirect('/');
	}

	await createRecipe(db, {
		name: requiredString(formData, 'name'),
		description: String(formData.get('description') ?? ''),
		instructions: String(formData.get('instructions') ?? ''),
		baseServings: positiveNumber(formData, 'base_servings', 2),
		defaultDays: positiveInteger(formData, 'default_days', 1),
		ingredients: parseIngredients(String(formData.get('ingredients') ?? '')),
	});

	return redirect('/');
};

function requiredString(formData: FormData, key: string): string {
	const value = String(formData.get(key) ?? '').trim();
	if (!value) {
		throw new Error(`Missing required field: ${key}`);
	}
	return value;
}

function positiveNumber(formData: FormData, key: string, fallback: number): number {
	const value = Number(formData.get(key));
	return Number.isFinite(value) && value > 0 ? value : fallback;
}

function positiveInteger(formData: FormData, key: string, fallback: number): number {
	return Math.max(1, Math.round(positiveNumber(formData, key, fallback)));
}

function parseIngredients(value: string): Array<{ name: string; category: string; quantity: number; unit: string; note: string }> {
	return value
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map((line) => {
			const [name = '', quantity = '0', unit = '', category = 'Other', note = ''] = line.split('|').map((part) => part.trim());
			return {
				name,
				quantity: Number(quantity),
				unit,
				category: category || 'Other',
				note,
			};
		});
}
