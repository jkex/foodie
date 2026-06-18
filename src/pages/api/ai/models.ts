import type { APIRoute } from 'astro';
import { getModelsForProvider, isAiProvider } from '../../../lib/ai';
import { getDb } from '../../../lib/db';

/**
 * Returns the models available for a provider, fetched live from the provider
 * when a key is configured, or a curated fallback list otherwise. Used by the
 * settings page and the per-request AI model pickers.
 */
export const GET: APIRoute = async ({ url, locals }) => {
	const provider = url.searchParams.get('provider');
	if (!isAiProvider(provider)) {
		return Response.json({ error: 'Unknown provider.' }, { status: 400 });
	}

	try {
		const { models, source } = await getModelsForProvider(getDb(), locals.userId, provider);
		return Response.json({ provider, source, models });
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to load models.';
		return Response.json({ error: message }, { status: 500 });
	}
};
