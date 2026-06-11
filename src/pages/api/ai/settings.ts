import type { APIRoute } from 'astro';
import { deleteAiSettings, getAiSettings, saveAiSettings, type AiProvider } from '../../../lib/ai';
import { getDb } from '../../../lib/db';

export const POST: APIRoute = async ({ request, redirect, locals }) => {
	const formData = await request.formData();
	const action = String(formData.get('action') ?? 'save');
	const db = getDb();
	const userId = locals.userId;

	if (action === 'delete') {
		await deleteAiSettings(db, userId);
		return redirect('/settings');
	}

	const provider = String(formData.get('provider') ?? 'anthropic');
	if (provider !== 'anthropic' && provider !== 'openai') {
		return redirect('/settings');
	}

	const apiKey = String(formData.get('api_key') ?? '').trim();
	const model = String(formData.get('model') ?? '').trim();
	const existing = await getAiSettings(db, userId);
	if (!apiKey && !existing) {
		return redirect('/settings');
	}

	await saveAiSettings(db, userId, { provider: provider as AiProvider, apiKey, model });
	return redirect('/settings');
};
