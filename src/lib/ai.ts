import Anthropic from '@anthropic-ai/sdk';
import { and, eq, sql } from 'drizzle-orm';
import { env } from 'cloudflare:workers';
import { aiProviderKeys, aiSettings, aiUsage } from '../db/schema';
import type { Database, Recipe, RecipeIngredient } from './db';
import { INGREDIENT_CATEGORIES } from './preferences';

export type AiProvider = 'anthropic' | 'openai' | 'gemini';

export const AI_PROVIDERS: readonly AiProvider[] = ['anthropic', 'openai', 'gemini'] as const;

export const PROVIDER_LABELS: Record<AiProvider, string> = {
	anthropic: 'Anthropic (Claude)',
	openai: 'OpenAI',
	gemini: 'Google Gemini',
};

/** Where users create an API key, shown as a help link in settings. */
export const PROVIDER_KEY_URLS: Record<AiProvider, string> = {
	anthropic: 'https://console.anthropic.com/settings/keys',
	openai: 'https://platform.openai.com/api-keys',
	gemini: 'https://aistudio.google.com/app/apikey',
};

export const DEFAULT_MODELS: Record<AiProvider, string> = {
	anthropic: 'claude-opus-4-8',
	openai: 'gpt-5.5',
	gemini: 'gemini-3.5-flash',
};

export type ModelOption = { id: string; label: string };

/**
 * Fallback model lists shown when the provider's live model listing is
 * unavailable (no key yet, network/permission error). Kept short and current.
 */
export const CURATED_MODELS: Record<AiProvider, ModelOption[]> = {
	anthropic: [
		{ id: 'claude-opus-4-8', label: 'Claude Opus 4.8' },
		{ id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
		{ id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
	],
	openai: [
		{ id: 'gpt-5.5', label: 'GPT-5.5' },
		{ id: 'gpt-5.4-mini', label: 'GPT-5.4 mini' },
		{ id: 'gpt-5.4', label: 'GPT-5.4' },
		{ id: 'o4-mini', label: 'o4-mini' },
	],
	gemini: [
		{ id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash' },
		{ id: 'gemini-3.5-pro', label: 'Gemini 3.5 Pro' },
		{ id: 'gemini-3.1-pro', label: 'Gemini 3.1 Pro' },
		{ id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' },
	],
};

export function isAiProvider(value: unknown): value is AiProvider {
	return value === 'anthropic' || value === 'openai' || value === 'gemini';
}

/** Keep model IDs to a conservative character set so overrides can't smuggle anything into a URL/header. */
export function sanitizeModelId(value: unknown): string {
	return String(value ?? '')
		.trim()
		.replace(/[^A-Za-z0-9._:-]/g, '')
		.slice(0, 200);
}

/** A fully resolved request target: which provider, which model, and the decrypted key. */
export type ResolvedAi = {
	provider: AiProvider;
	model: string;
	apiKey: string;
};

export type AiConfig = {
	/** Providers that have a stored API key. */
	providers: AiProvider[];
	/** The active default provider + its preferred model, if any provider is configured. */
	active: { provider: AiProvider; model: string } | null;
};

// Backwards-compatible alias for existing callers and pages.
export type AiSettings = AiConfig;

const AI_REQUEST_TIMEOUT_MS = 45_000;
const AI_REQUESTS_PER_HOUR = 20;
const ENCRYPTED_PREFIX = 'enc:v1:';

export type AiRecipe = {
	name: string;
	description: string;
	instructions: string;
	base_servings: number;
	default_days: number;
	ingredients: Array<{ name: string; quantity: number; unit: string; category: string; note: string }>;
};

// --- Settings / key management ---------------------------------------------

/** List providers the user has stored a key for. */
export async function listConfiguredProviders(db: Database, userId: string): Promise<AiProvider[]> {
	const rows = await db.select({ provider: aiProviderKeys.provider }).from(aiProviderKeys).where(eq(aiProviderKeys.userId, userId));
	return rows.map((row) => row.provider).filter(isAiProvider);
}

async function getActiveProvider(db: Database, userId: string): Promise<AiProvider | null> {
	const [row] = await db.select({ provider: aiSettings.provider }).from(aiSettings).where(eq(aiSettings.userId, userId)).limit(1);
	return row && isAiProvider(row.provider) ? row.provider : null;
}

/** Read configured providers plus the resolved active default for the settings UI and AI panels. */
export async function getAiConfig(db: Database, userId: string): Promise<AiConfig> {
	const [providers, activeProvider, keyRows] = await Promise.all([
		listConfiguredProviders(db, userId),
		getActiveProvider(db, userId),
		db
			.select({ provider: aiProviderKeys.provider, model: aiProviderKeys.model })
			.from(aiProviderKeys)
			.where(eq(aiProviderKeys.userId, userId)),
	]);

	if (providers.length === 0) {
		return { providers, active: null };
	}

	// Prefer the stored active provider, but fall back to the first configured one if it lost its key.
	const provider = activeProvider && providers.includes(activeProvider) ? activeProvider : providers[0];
	const model = keyRows.find((row) => row.provider === provider)?.model || DEFAULT_MODELS[provider];
	return { providers, active: { provider, model } };
}

export async function getAiSettings(db: Database, userId: string): Promise<AiSettings> {
	return getAiConfig(db, userId);
}

/** Preferred (saved) model for a single provider. */
export async function getProviderModel(db: Database, userId: string, provider: AiProvider): Promise<string> {
	const [row] = await db
		.select({ model: aiProviderKeys.model })
		.from(aiProviderKeys)
		.where(and(eq(aiProviderKeys.userId, userId), eq(aiProviderKeys.provider, provider)))
		.limit(1);
	return row?.model || DEFAULT_MODELS[provider];
}

async function getProviderKey(db: Database, userId: string, provider: AiProvider): Promise<string | null> {
	const [row] = await db
		.select()
		.from(aiProviderKeys)
		.where(and(eq(aiProviderKeys.userId, userId), eq(aiProviderKeys.provider, provider)))
		.limit(1);
	if (!row) {
		return null;
	}

	const apiKey = await decryptApiKey(row.apiKey);
	// Lazily upgrade legacy plaintext keys to the encrypted format on first read.
	if (!row.apiKey.startsWith(ENCRYPTED_PREFIX)) {
		await db
			.update(aiProviderKeys)
			.set({ apiKey: await encryptApiKey(apiKey), updatedAt: sql`CURRENT_TIMESTAMP` })
			.where(eq(aiProviderKeys.id, row.id));
	}
	return apiKey;
}

/**
 * Upsert a provider's key and/or preferred model. An empty `apiKey` keeps the
 * stored key, so users can change the model without re-entering their key.
 */
export async function saveProviderConfig(
	db: Database,
	userId: string,
	provider: AiProvider,
	input: { apiKey?: string; model?: string },
): Promise<void> {
	const model = input.model !== undefined ? sanitizeModelId(input.model) : undefined;
	const [existing] = await db
		.select()
		.from(aiProviderKeys)
		.where(and(eq(aiProviderKeys.userId, userId), eq(aiProviderKeys.provider, provider)))
		.limit(1);

	if (existing) {
		await db
			.update(aiProviderKeys)
			.set({
				apiKey: input.apiKey ? await encryptApiKey(input.apiKey) : existing.apiKey,
				model: model ?? existing.model,
				updatedAt: sql`CURRENT_TIMESTAMP`,
			})
			.where(eq(aiProviderKeys.id, existing.id));
		return;
	}

	if (!input.apiKey) {
		return; // Nothing to store yet — no key for a brand-new provider entry.
	}
	await db.insert(aiProviderKeys).values({
		userId,
		provider,
		apiKey: await encryptApiKey(input.apiKey),
		model: model ?? '',
	});
}

export async function deleteProviderKey(db: Database, userId: string, provider: AiProvider): Promise<void> {
	await db.delete(aiProviderKeys).where(and(eq(aiProviderKeys.userId, userId), eq(aiProviderKeys.provider, provider)));

	// If the deleted provider was the active default, repoint it to a remaining one (or clear it).
	const active = await getActiveProvider(db, userId);
	if (active === provider) {
		const remaining = await listConfiguredProviders(db, userId);
		if (remaining.length > 0) {
			await setActiveProvider(db, userId, remaining[0]);
		} else {
			await db.delete(aiSettings).where(eq(aiSettings.userId, userId));
		}
	}
}

export async function setActiveProvider(db: Database, userId: string, provider: AiProvider): Promise<void> {
	const [existing] = await db.select({ id: aiSettings.id }).from(aiSettings).where(eq(aiSettings.userId, userId)).limit(1);
	if (existing) {
		await db
			.update(aiSettings)
			.set({ provider, updatedAt: sql`CURRENT_TIMESTAMP` })
			.where(eq(aiSettings.id, existing.id));
		return;
	}
	await db.insert(aiSettings).values({ userId, provider });
}

/**
 * Resolve a concrete request target. Honors a per-request override of provider
 * and/or model (used by the AI panels), otherwise falls back to the active
 * default. Throws if no usable provider/key is configured.
 */
export async function resolveAiRequest(
	db: Database,
	userId: string,
	override?: { provider?: unknown; model?: unknown },
): Promise<ResolvedAi> {
	const configured = await listConfiguredProviders(db, userId);
	if (configured.length === 0) {
		throw new Error('AI is not configured.');
	}

	const requested = isAiProvider(override?.provider) ? override.provider : null;
	let provider: AiProvider;
	if (requested && configured.includes(requested)) {
		provider = requested;
	} else {
		const active = await getActiveProvider(db, userId);
		provider = active && configured.includes(active) ? active : configured[0];
	}

	const apiKey = await getProviderKey(db, userId, provider);
	if (!apiKey) {
		throw new Error('AI is not configured.');
	}

	const overrideModel = override?.model !== undefined ? sanitizeModelId(override.model) : '';
	const model = overrideModel || (await getProviderModel(db, userId, provider));
	return { provider, model, apiKey };
}

export async function consumeAiQuota(db: Database, userId: string): Promise<boolean> {
	const now = new Date();
	now.setUTCMinutes(0, 0, 0);
	const windowStartedAt = now.toISOString();

	const [usage] = await db
		.select({ requestCount: aiUsage.requestCount })
		.from(aiUsage)
		.where(and(eq(aiUsage.userId, userId), eq(aiUsage.windowStartedAt, windowStartedAt)))
		.limit(1);

	if ((usage?.requestCount ?? 0) >= AI_REQUESTS_PER_HOUR) {
		return false;
	}

	await db
		.insert(aiUsage)
		.values({ userId, windowStartedAt, requestCount: 1 })
		.onConflictDoUpdate({
			target: [aiUsage.userId, aiUsage.windowStartedAt],
			set: { requestCount: sql`${aiUsage.requestCount} + 1` },
		});
	return true;
}

async function encryptionKey(): Promise<CryptoKey> {
	const secret = env.AI_KEY_ENCRYPTION_SECRET || env.WORKOS_COOKIE_PASSWORD;
	if (!secret) {
		throw new Error('AI key encryption is not configured.');
	}
	const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(secret));
	return crypto.subtle.importKey('raw', digest, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

async function encryptApiKey(value: string): Promise<string> {
	if (value.startsWith(ENCRYPTED_PREFIX)) {
		return value;
	}
	const iv = crypto.getRandomValues(new Uint8Array(12));
	const encrypted = new Uint8Array(
		await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await encryptionKey(), new TextEncoder().encode(value)),
	);
	return `${ENCRYPTED_PREFIX}${toBase64(iv)}:${toBase64(encrypted)}`;
}

async function decryptApiKey(value: string): Promise<string> {
	if (!value.startsWith(ENCRYPTED_PREFIX)) {
		return value;
	}
	const [ivText, encryptedText] = value.slice(ENCRYPTED_PREFIX.length).split(':');
	if (!ivText || !encryptedText) {
		throw new Error('Stored AI key is invalid.');
	}
	const decrypted = await crypto.subtle.decrypt(
		{ name: 'AES-GCM', iv: fromBase64(ivText) as Uint8Array<ArrayBuffer> },
		await encryptionKey(),
		fromBase64(encryptedText) as Uint8Array<ArrayBuffer>,
	);
	return new TextDecoder().decode(decrypted);
}

function toBase64(value: Uint8Array): string {
	return btoa(String.fromCharCode(...value));
}

function fromBase64(value: string): Uint8Array {
	return Uint8Array.from(atob(value), (character) => character.charCodeAt(0));
}

// --- Live model discovery ---------------------------------------------------

/**
 * Fetch the models a provider currently offers, using the stored key. Returns a
 * sorted, de-duplicated list. Throws on any failure so callers can fall back to
 * the curated list.
 */
export async function listProviderModels(provider: AiProvider, apiKey: string): Promise<ModelOption[]> {
	const signal = AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS);
	if (provider === 'anthropic') {
		return listAnthropicModels(apiKey, signal);
	}
	if (provider === 'openai') {
		return listOpenAiModels(apiKey, signal);
	}
	return listGeminiModels(apiKey, signal);
}

async function listAnthropicModels(apiKey: string, signal: AbortSignal): Promise<ModelOption[]> {
	const response = await fetch('https://api.anthropic.com/v1/models?limit=1000', {
		headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
		signal,
	});
	if (!response.ok) {
		throw new Error(`Anthropic model listing failed (${response.status})`);
	}
	const data = (await response.json()) as { data?: Array<{ id?: string; display_name?: string }> };
	return dedupeModels(
		(data.data ?? [])
			.filter((model) => typeof model.id === 'string')
			.map((model) => ({ id: model.id as string, label: model.display_name || (model.id as string) })),
	);
}

async function listOpenAiModels(apiKey: string, signal: AbortSignal): Promise<ModelOption[]> {
	const response = await fetch('https://api.openai.com/v1/models', {
		headers: { authorization: `Bearer ${apiKey}` },
		signal,
	});
	if (!response.ok) {
		throw new Error(`OpenAI model listing failed (${response.status})`);
	}
	const data = (await response.json()) as { data?: Array<{ id?: string }> };
	const chatModels = (data.data ?? [])
		.map((model) => model.id)
		.filter((id): id is string => typeof id === 'string')
		// Keep chat/reasoning families; drop embeddings, audio, image, moderation, etc.
		.filter(
			(id) =>
				/^(gpt-|o\d|chatgpt-)/.test(id) &&
				!/(embedding|whisper|tts|audio|realtime|image|dall-e|moderation|transcribe|search|computer)/.test(id),
		)
		.map((id) => ({ id, label: id }));
	return dedupeModels(chatModels);
}

async function listGeminiModels(apiKey: string, signal: AbortSignal): Promise<ModelOption[]> {
	const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', {
		headers: { 'x-goog-api-key': apiKey },
		signal,
	});
	if (!response.ok) {
		throw new Error(`Gemini model listing failed (${response.status})`);
	}
	const data = (await response.json()) as {
		models?: Array<{ name?: string; displayName?: string; supportedGenerationMethods?: string[] }>;
	};
	const models = (data.models ?? [])
		.filter((model) => model.supportedGenerationMethods?.includes('generateContent'))
		.map((model) => {
			const id = (model.name ?? '').replace(/^models\//, '');
			return { id, label: model.displayName || id };
		})
		.filter((model) => model.id);
	return dedupeModels(models);
}

/**
 * Resolve the model list to show for a provider in the UI: live from the
 * provider when a key is stored and reachable, otherwise the curated fallback.
 */
export async function getModelsForProvider(
	db: Database,
	userId: string,
	provider: AiProvider,
): Promise<{ models: ModelOption[]; source: 'live' | 'curated' }> {
	const apiKey = await getProviderKey(db, userId, provider);
	if (apiKey) {
		try {
			const models = await listProviderModels(provider, apiKey);
			if (models.length > 0) {
				return { models, source: 'live' };
			}
		} catch {
			// Fall through to the curated list on any provider/network error.
		}
	}
	return { models: CURATED_MODELS[provider], source: 'curated' };
}

function dedupeModels(models: ModelOption[]): ModelOption[] {
	const seen = new Map<string, ModelOption>();
	for (const model of models) {
		if (!seen.has(model.id)) {
			seen.set(model.id, model);
		}
	}
	return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
}

// --- Recipe generation ------------------------------------------------------

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
		ingredients: existing.ingredients.map((i) => ({
			name: i.name,
			quantity: i.quantity,
			unit: i.unit,
			category: i.category,
			note: i.note,
		})),
	};
	return `Here is an existing recipe as JSON:\n${JSON.stringify(current, null, 2)}\n\nApply this change and return the full updated recipe: ${prompt}`;
}

export async function generateRecipe(
	settings: ResolvedAi,
	prompt: string,
	existing?: { recipe: Recipe; ingredients: RecipeIngredient[] },
): Promise<AiRecipe> {
	const userPrompt = buildUserPrompt(prompt, existing);
	const raw = await callJson(settings, SYSTEM_PROMPT, userPrompt, RECIPE_SCHEMA, 'recipe');

	const recipe = JSON.parse(raw) as AiRecipe;
	return {
		...recipe,
		base_servings: recipe.base_servings > 0 ? recipe.base_servings : 2,
		default_days: recipe.default_days > 0 ? Math.round(recipe.default_days) : 1,
		ingredients: recipe.ingredients.filter((i) => i.name && i.quantity > 0),
	};
}

// --- Chat -------------------------------------------------------------------

const CHAT_RESPONSE_SCHEMA = {
	type: 'object',
	additionalProperties: false,
	properties: {
		message: { type: 'string', description: 'Chat response, explanation, or follow-up question to the user.' },
		recipe: {
			type: ['object', 'null'],
			description:
				'The updated recipe matching the recipe schema. Set to null if only answering a question or asking a follow-up without modifying the recipe.',
			additionalProperties: false,
			properties: {
				name: { type: 'string', description: 'Recipe name' },
				description: { type: 'string', description: 'One-sentence description' },
				instructions: { type: 'string', description: 'Step-by-step cooking instructions, one step per line' },
				base_servings: { type: 'number', description: 'Number of servings' },
				default_days: { type: 'integer', description: 'Typical consecutive days to eat' },
				ingredients: {
					type: 'array',
					items: {
						type: 'object',
						additionalProperties: false,
						properties: {
							name: { type: 'string', description: 'Ingredient name' },
							quantity: { type: 'number' },
							unit: { type: 'string' },
							category: { type: 'string', enum: [...INGREDIENT_CATEGORIES] },
							note: { type: 'string' },
						},
						required: ['name', 'quantity', 'unit', 'category', 'note'],
					},
				},
			},
			required: ['name', 'description', 'instructions', 'base_servings', 'default_days', 'ingredients'],
		},
	},
	required: ['message', 'recipe'],
} as const;

const CHAT_SYSTEM_PROMPT =
	'You are a helpful kitchen assistant for a meal-planning app. ' +
	'You help the user edit, customize, or scale their recipe through a chat conversation. ' +
	'If the user requests changes to the recipe, you must return the full updated recipe in the "recipe" field of your JSON response, ' +
	'and explain the changes or ask follow-up questions in the "message" field. ' +
	'If the user is only asking a question or if you need to ask a follow-up question before modifying the recipe, ' +
	'set the "recipe" field to null and write your response in the "message" field. ' +
	'Always write your chat responses and recipe details in the same language as the user request.';

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type AiChatResponse = {
	message: string;
	recipe: AiRecipe | null;
};

export async function chatWithAi(
	settings: ResolvedAi,
	prompt: string,
	history: ChatMessage[],
	currentRecipe: Record<string, unknown>,
): Promise<AiChatResponse> {
	const userPrompt = `Current recipe state:\n${JSON.stringify(currentRecipe, null, 2)}\n\nUser request: ${prompt}`;
	const raw = await callJson(settings, CHAT_SYSTEM_PROMPT, userPrompt, CHAT_RESPONSE_SCHEMA, 'chat_response', history);

	const response = JSON.parse(raw) as AiChatResponse;
	if (response.recipe) {
		response.recipe = {
			...response.recipe,
			base_servings: response.recipe.base_servings > 0 ? response.recipe.base_servings : 2,
			default_days: response.recipe.default_days > 0 ? Math.round(response.recipe.default_days) : 1,
			ingredients: response.recipe.ingredients.filter((i) => i.name && i.quantity > 0),
		};
	}
	return response;
}

// --- Plan ordering ----------------------------------------------------------

const PLAN_ORDER_SCHEMA = {
	type: 'object',
	additionalProperties: false,
	properties: {
		order: {
			type: 'array',
			description: 'Recipe ids in the order they should be cooked, most recommended first. Use every provided id exactly once.',
			items: { type: 'integer' },
		},
	},
	required: ['order'],
} as const;

const PLAN_ORDER_SYSTEM_PROMPT =
	"You arrange a home cook's existing recipes into a varied meal plan. " +
	'You are given recipes with an id, name, description, default number of consecutive days, and how many days since each was last cooked. ' +
	'Return an ordering (most recommended first) that maximizes variety between consecutive meals — vary the cuisine, the main protein, and how heavy the meal is, and avoid repeating similar dishes back to back. ' +
	'Bring forward recipes that have not been cooked in a long time. ' +
	'Only use the provided ids, and include every id exactly once.';

export type PlanOrderRecipe = {
	id: number;
	name: string;
	description: string;
	default_days: number;
	last_cooked_at: string | null;
};

/**
 * Ask the configured model to order the user's recipes for variety and freshness.
 * Returns a list of recipe ids; callers should pass it through `applyRecipeOrder`,
 * which tolerates missing/unknown/duplicate ids. Throws on provider/parse errors
 * so the caller can fall back to the deterministic rotation.
 */
export async function suggestPlanOrder(settings: ResolvedAi, recipes: PlanOrderRecipe[], plannedDayCount: number): Promise<number[]> {
	if (recipes.length === 0) {
		return [];
	}

	const now = Date.now();
	const list = recipes.map((recipe) => ({
		id: recipe.id,
		name: recipe.name,
		description: recipe.description || '',
		default_days: recipe.default_days,
		days_since_cooked: recipe.last_cooked_at
			? Math.max(0, Math.round((now - new Date(recipe.last_cooked_at).getTime()) / 86_400_000))
			: null,
	}));
	const userPrompt =
		`Plan ${plannedDayCount} days of dinners by ordering these recipes for the most varied, enjoyable rotation.\n` +
		`A "days_since_cooked" of null means it has never been cooked.\n\n${JSON.stringify(list, null, 2)}`;

	const raw = await callJson(settings, PLAN_ORDER_SYSTEM_PROMPT, userPrompt, PLAN_ORDER_SCHEMA, 'plan_order');

	const parsed = JSON.parse(raw) as { order?: unknown };
	return Array.isArray(parsed.order) ? parsed.order.filter((value): value is number => typeof value === 'number') : [];
}

// --- Provider dispatch ------------------------------------------------------

/**
 * Single JSON entry point for every provider. Returns the raw JSON string the
 * caller then parses against the matching schema.
 */
async function callJson(
	settings: ResolvedAi,
	system: string,
	userPrompt: string,
	schema: Record<string, unknown>,
	schemaName: string,
	history: ChatMessage[] = [],
): Promise<string> {
	const model = settings.model || DEFAULT_MODELS[settings.provider];
	if (settings.provider === 'anthropic') {
		return callAnthropicJson(settings.apiKey, model, system, userPrompt, schema, history);
	}
	if (settings.provider === 'openai') {
		return callOpenAiJson(settings.apiKey, model, system, userPrompt, schema, schemaName, history);
	}
	return callGeminiJson(settings.apiKey, model, system, userPrompt, schema, history);
}

async function callAnthropicJson(
	apiKey: string,
	model: string,
	system: string,
	userPrompt: string,
	schema: Record<string, unknown>,
	history: ChatMessage[],
): Promise<string> {
	const client = new Anthropic({ apiKey });
	const response = await client.messages.create(
		{
			model,
			max_tokens: 16000,
			system,
			thinking: { type: 'adaptive' },
			output_config: { format: { type: 'json_schema', schema } },
			messages: [...history, { role: 'user', content: userPrompt }],
		},
		{ signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS) },
	);

	if (response.stop_reason === 'refusal') {
		throw new Error('The model declined this request.');
	}
	const text = response.content.find((block) => block.type === 'text');
	if (!text || text.type !== 'text') {
		throw new Error('The model returned no response.');
	}
	return text.text;
}

async function callOpenAiJson(
	apiKey: string,
	model: string,
	system: string,
	userPrompt: string,
	schema: Record<string, unknown>,
	schemaName: string,
	history: ChatMessage[],
): Promise<string> {
	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
		body: JSON.stringify({
			model,
			messages: [{ role: 'system', content: system }, ...history, { role: 'user', content: userPrompt }],
			response_format: {
				type: 'json_schema',
				json_schema: { name: schemaName, strict: true, schema },
			},
		}),
		signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
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
		throw new Error('The model returned no response.');
	}
	return message.content;
}

async function callGeminiJson(
	apiKey: string,
	model: string,
	system: string,
	userPrompt: string,
	schema: Record<string, unknown>,
	history: ChatMessage[],
): Promise<string> {
	// Gemini's responseSchema accepts only a subset of JSON Schema, so we ask for
	// JSON output and pin the exact shape via the system instruction instead.
	const systemInstruction =
		`${system}\n\nReturn ONLY a single JSON object (no markdown, no code fences) that strictly conforms to this JSON Schema:\n` +
		JSON.stringify(schema);

	const contents = [
		...history.map((entry) => ({ role: entry.role === 'assistant' ? 'model' : 'user', parts: [{ text: entry.content }] })),
		{ role: 'user', parts: [{ text: userPrompt }] },
	];

	const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`, {
		method: 'POST',
		headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
		body: JSON.stringify({
			systemInstruction: { parts: [{ text: systemInstruction }] },
			contents,
			generationConfig: { responseMimeType: 'application/json' },
		}),
		signal: AbortSignal.timeout(AI_REQUEST_TIMEOUT_MS),
	});

	if (!response.ok) {
		const body = (await response.json().catch(() => null)) as { error?: { message?: string } } | null;
		throw new Error(body?.error?.message ?? `Gemini request failed with status ${response.status}`);
	}

	const data = (await response.json()) as {
		candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
	};
	const candidate = data.candidates?.[0];
	if (candidate?.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
		throw new Error('The model declined this request.');
	}
	const text = candidate?.content?.parts?.map((part) => part.text ?? '').join('') ?? '';
	if (!text) {
		throw new Error('The model returned no response.');
	}
	return text;
}
