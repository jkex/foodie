import Anthropic from '@anthropic-ai/sdk';
import { eq, sql } from 'drizzle-orm';
import { aiSettings } from '../db/schema';
import type { Database, Recipe, RecipeIngredient } from './db';
import { INGREDIENT_CATEGORIES } from './preferences';

export type AiProvider = 'anthropic' | 'openai';

export type AiSettings = {
	id: number;
	provider: AiProvider;
	api_key: string;
	model: string;
};

export const DEFAULT_MODELS: Record<AiProvider, string> = {
	anthropic: 'claude-opus-4-8',
	openai: 'gpt-4o',
};

export type AiRecipe = {
	name: string;
	description: string;
	instructions: string;
	base_servings: number;
	default_days: number;
	ingredients: Array<{ name: string; quantity: number; unit: string; category: string; note: string }>;
};

export async function getAiSettings(db: Database, userId: string): Promise<AiSettings | null> {
	const [row] = await db.select().from(aiSettings).where(eq(aiSettings.userId, userId)).limit(1);
	return row ? { id: row.id, provider: row.provider, api_key: row.apiKey, model: row.model } : null;
}

export async function saveAiSettings(db: Database, userId: string, input: { provider: AiProvider; apiKey: string; model: string }): Promise<void> {
	const existing = await getAiSettings(db, userId);
	if (existing) {
		await db
			.update(aiSettings)
			.set({
				provider: input.provider,
				// An empty key field keeps the stored key so users can change provider/model without re-entering it.
				apiKey: input.apiKey || existing.api_key,
				model: input.model,
				updatedAt: sql`CURRENT_TIMESTAMP`,
			})
			.where(eq(aiSettings.id, existing.id));
		return;
	}
	await db.insert(aiSettings).values({ userId, provider: input.provider, apiKey: input.apiKey, model: input.model });
}

export async function deleteAiSettings(db: Database, userId: string): Promise<void> {
	await db.delete(aiSettings).where(eq(aiSettings.userId, userId));
}

const RECIPE_SCHEMA = {
	type: 'object',
	additionalProperties: false,
	properties: {
		name: { type: 'string', description: 'Recipe name' },
		description: { type: 'string', description: 'One-sentence description' },
		instructions: { type: 'string', description: 'Step-by-step cooking instructions, one step per line' },
		base_servings: { type: 'number', description: 'Number of servings the ingredient quantities are written for' },
		default_days: { type: 'integer', description: 'How many consecutive days this recipe is typically eaten, usually 1' },
		ingredients: {
			type: 'array',
			items: {
				type: 'object',
				additionalProperties: false,
				properties: {
					name: { type: 'string', description: 'Canonical ingredient name, singular' },
					quantity: { type: 'number' },
					unit: { type: 'string', description: 'e.g. g, ml, tbsp, pcs' },
					category: { type: 'string', enum: [...INGREDIENT_CATEGORIES] },
					note: { type: 'string', description: 'Optional preparation note, empty string if none' },
				},
				required: ['name', 'quantity', 'unit', 'category', 'note'],
			},
		},
	},
	required: ['name', 'description', 'instructions', 'base_servings', 'default_days', 'ingredients'],
} as const;

const SYSTEM_PROMPT =
	'You write home-cooking recipes for a meal-planning app. ' +
	'Return a complete recipe matching the JSON schema. Quantities must be realistic for the stated base servings. ' +
	'Write the recipe in the same language as the user request.';

function buildUserPrompt(prompt: string, existing?: { recipe: Recipe; ingredients: RecipeIngredient[] }): string {
	if (!existing) {
		return `Create a recipe: ${prompt}`;
	}
	const current = {
		name: existing.recipe.name,
		description: existing.recipe.description,
		instructions: existing.recipe.instructions,
		base_servings: existing.recipe.base_servings,
		default_days: existing.recipe.default_days,
		ingredients: existing.ingredients.map((i) => ({ name: i.name, quantity: i.quantity, unit: i.unit, category: i.category, note: i.note })),
	};
	return `Here is an existing recipe as JSON:\n${JSON.stringify(current, null, 2)}\n\nApply this change and return the full updated recipe: ${prompt}`;
}

export async function generateRecipe(
	settings: AiSettings,
	prompt: string,
	existing?: { recipe: Recipe; ingredients: RecipeIngredient[] },
): Promise<AiRecipe> {
	const userPrompt = buildUserPrompt(prompt, existing);
	const model = settings.model || DEFAULT_MODELS[settings.provider];
	const raw = settings.provider === 'anthropic'
		? await callAnthropic(settings.api_key, model, userPrompt)
		: await callOpenAi(settings.api_key, model, userPrompt);

	const recipe = JSON.parse(raw) as AiRecipe;
	return {
		...recipe,
		base_servings: recipe.base_servings > 0 ? recipe.base_servings : 2,
		default_days: recipe.default_days > 0 ? Math.round(recipe.default_days) : 1,
		ingredients: recipe.ingredients.filter((i) => i.name && i.quantity > 0),
	};
}

async function callAnthropic(apiKey: string, model: string, userPrompt: string): Promise<string> {
	const client = new Anthropic({ apiKey });
	const response = await client.messages.create({
		model,
		max_tokens: 16000,
		system: SYSTEM_PROMPT,
		thinking: { type: 'adaptive' },
		output_config: { format: { type: 'json_schema', schema: RECIPE_SCHEMA } },
		messages: [{ role: 'user', content: userPrompt }],
	});

	if (response.stop_reason === 'refusal') {
		throw new Error('The model declined this request.');
	}
	const text = response.content.find((block) => block.type === 'text');
	if (!text || text.type !== 'text') {
		throw new Error('The model returned no recipe.');
	}
	return text.text;
}

async function callOpenAi(apiKey: string, model: string, userPrompt: string): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
		body: JSON.stringify({
			model,
			messages: [
				{ role: 'system', content: SYSTEM_PROMPT },
				{ role: 'user', content: userPrompt },
			],
			response_format: {
				type: 'json_schema',
				json_schema: { name: 'recipe', strict: true, schema: RECIPE_SCHEMA },
			},
		}),
	});

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
		throw new Error(body?.error?.message ?? `OpenAI request failed with status ${response.status}`);
	}

	const data = (await response.json()) as { choices?: Array<{ message?: { content?: string; refusal?: string } }> };
	const message = data.choices?.[0]?.message;
	if (message?.refusal) {
		throw new Error('The model declined this request.');
	}
	if (!message?.content) {
		throw new Error('The model returned no recipe.');
	}
	return message.content;
}
