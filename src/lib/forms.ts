export function requiredString(formData: FormData, key: string): string {
	const value = String(formData.get(key) ?? '').trim();
	if (!value) {
		throw new Error(`Missing required field: ${key}`);
	}
	return value;
}

export function positiveNumber(formData: FormData, key: string, fallback: number): number {
	const value = Number(formData.get(key));
	return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function positiveInteger(formData: FormData, key: string, fallback: number): number {
	return Math.max(1, Math.round(positiveNumber(formData, key, fallback)));
}

export type IngredientInput = { name: string; category: string; quantity: number; unit: string; note: string };

/**
 * Parse the repeated ingredient row fields produced by RecipeForm.
 * Rows with an empty name or non-positive quantity are dropped.
 */
export function parseIngredientRows(formData: FormData): IngredientInput[] {
	const names = formData.getAll('ingredient_name').map(String);
	const quantities = formData.getAll('ingredient_quantity').map(String);
	const units = formData.getAll('ingredient_unit').map(String);
	const categories = formData.getAll('ingredient_category').map(String);
	const notes = formData.getAll('ingredient_note').map(String);

	return names
		.map((name, index) => ({
			name: name.trim(),
			quantity: Number(quantities[index] ?? 0),
			unit: (units[index] ?? '').trim(),
			category: (categories[index] ?? '').trim() || 'Other',
			note: (notes[index] ?? '').trim(),
		}))
		.filter((ingredient) => ingredient.name && Number.isFinite(ingredient.quantity) && ingredient.quantity > 0);
}
