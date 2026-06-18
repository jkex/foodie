import type { APIRoute } from 'astro';
import {
	AI_PROVIDERS,
	deleteProviderKey,
	isAiProvider,
	listConfiguredProviders,
	saveProviderConfig,
	setActiveProvider,
} from '../../../lib/ai';
import { getDb } from '../../../lib/db';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? 'save');
	const db = getDb();
	const userId = locals.userId;

	if (action === 'delete') {
		const provider = formData.get('provider');
		if (isAiProvider(provider)) {
			await deleteProviderKey(db, userId, provider);
		}
		return redirect('/settings');
	}

	// Save every provider's key and preferred model in one submit.
	for (const provider of AI_PROVIDERS) {
		const apiKey = String(formData.get(`key_${provider}`) ?? '')
			.trim()
			.slice(0, 500);
		const model = String(formData.get(`model_${provider}`) ?? '')
			.trim()
			.slice(0, 200);
		await saveProviderConfig(db, userId, provider, { apiKey, model });
	}

	const requestedActive = formData.get('active_provider');
	if (isAiProvider(requestedActive)) {
		const configured = await listConfiguredProviders(db, userId);
		if (configured.includes(requestedActive)) {
			await setActiveProvider(db, userId, requestedActive);
		}
	}

	return redirect('/settings');
};
