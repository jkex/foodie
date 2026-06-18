import type { APIRoute } from 'astro';
import { chatWithAi, consumeAiQuota, resolveAiRequest, type ChatMessage } from '../../../lib/ai';
import { getDb } from '../../../lib/db';
import { boundedString, readJsonBodyWithLimit, RequestBodyTooLargeError } from '../../../lib/security';

export const POST: APIRoute = async ({ request, locals }) => {
	const db = getDb();
	const userId = locals.userId;

	try {
		const settings = await resolveAiRequest(db, userId);
		const body = (await readJsonBodyWithLimit(request, 100_000)) as {
			prompt?: unknown;
			history?: unknown;
			recipe?: unknown;
		} | null;
		if (!body || typeof body !== 'object' || Array.isArray(body)) {
			return Response.json({ error: 'Invalid request body.' }, { status: 400 });
		}
		const prompt = boundedString(body.prompt, 2_000);
		const history = sanitizeHistory(body.history);
		const recipe = sanitizeRecipe(body.recipe);

		if (!prompt) {
			return new Response(JSON.stringify({ error: 'Missing prompt.' }), {
				status: 400,
				headers: { 'content-type': 'application/json' },
			});
		}

		if (!(await consumeAiQuota(db, userId))) {
			return Response.json({ error: 'AI request limit reached. Try again next hour.' }, { status: 429 });
		}

		const result = await chatWithAi(settings, prompt, history, recipe);
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		if (error instanceof RequestBodyTooLargeError) {
			return Response.json({ error: error.message }, { status: 413 });
		}
		const message = error instanceof Error ? error.message : 'AI request failed';
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
};

function sanitizeHistory(value: unknown): ChatMessage[] {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.slice(-12).flatMap((entry): ChatMessage[] => {
		if (!entry || typeof entry !== 'object') {
			return [];
		}
		const role = (entry as { role?: unknown }).role;
		const content = boundedString((entry as { content?: unknown }).content, 2_000);
		return (role === 'user' || role === 'assistant') && content ? [{ role, content }] : [];
	});
}

function sanitizeRecipe(value: unknown): Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return {};
	}
	const recipe = value as Record<string, unknown>;
	return {
		name: boundedString(recipe.name, 200),
		description: boundedString(recipe.description, 1_000),
		instructions: boundedString(recipe.instructions, 10_000),
		base_servings: boundedNumber(recipe.base_servings, 2, 0.1, 100),
		default_days: Math.round(boundedNumber(recipe.default_days, 1, 1, 14)),
		ingredients: sanitizeIngredients(recipe.ingredients),
	};
}

function sanitizeIngredients(value: unknown): Array<Record<string, unknown>> {
	if (!Array.isArray(value)) {
		return [];
	}
	return value.slice(0, 100).flatMap((entry): Array<Record<string, unknown>> => {
		if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
			return [];
		}
		const ingredient = entry as Record<string, unknown>;
		const name = boundedString(ingredient.name, 200);
		const quantity = boundedNumber(ingredient.quantity, 0, 0, 1_000_000);
		if (!name || quantity <= 0) {
			return [];
		}
		return [
			{
				name,
				quantity,
				unit: boundedString(ingredient.unit, 40),
				category: boundedString(ingredient.category, 40),
				note: boundedString(ingredient.note, 500),
			},
		];
	});
}

function boundedNumber(value: unknown, fallback: number, min: number, max: number): number {
	const number = Number(value);
	return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
}
