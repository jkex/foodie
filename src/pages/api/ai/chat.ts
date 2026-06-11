import type { APIRoute } from 'astro';
import { chatWithAi, getAiSettings } from '../../../lib/ai';
import { getDb } from '../../../lib/db';

export const POST: APIRoute = async ({ request, locals }) => {
	const db = getDb();
	const userId = locals.userId;
	const settings = await getAiSettings(db, userId);

	if (!settings) {
		return new Response(JSON.stringify({ error: 'AI is not configured.' }), {
			status: 400,
			headers: { 'content-type': 'application/json' },
		});
	}

	try {
		const body = await request.json() as { prompt: string; history: any[]; recipe: any };
		const { prompt, history, recipe } = body;

		if (!prompt) {
			return new Response(JSON.stringify({ error: 'Missing prompt.' }), {
				status: 400,
				headers: { 'content-type': 'application/json' },
			});
		}

		const result = await chatWithAi(settings, prompt, history, recipe);
		return new Response(JSON.stringify(result), {
			status: 200,
			headers: { 'content-type': 'application/json' },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'AI request failed';
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { 'content-type': 'application/json' },
		});
	}
};
