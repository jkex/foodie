import { WorkOS, type AuthenticateWithSessionCookieSuccessResponse } from '@workos-inc/node';
import { env } from 'cloudflare:workers';

export const AUTH_COOKIE = 'foodie_session';
export const AUTH_STATE_COOKIE = 'foodie_auth_state';
export const AUTH_PROVIDERS = ['GoogleOAuth', 'AppleOAuth'] as const;

export type AuthProvider = (typeof AUTH_PROVIDERS)[number];
export type AuthenticatedUser = AuthenticateWithSessionCookieSuccessResponse['user'];

export function getAuthConfig() {
	const apiKey = env.WORKOS_API_KEY;
	const clientId = env.WORKOS_CLIENT_ID;
	const cookiePassword = env.WORKOS_COOKIE_PASSWORD;

	if (!apiKey || !clientId || !cookiePassword) {
		return null;
	}

	return { apiKey, clientId, cookiePassword };
}

export function getWorkOS() {
	const config = getAuthConfig();
	if (!config) {
		return null;
	}

	return new WorkOS(config.apiKey, { clientId: config.clientId });
}

export async function getSession(request: Request) {
	const config = getAuthConfig();
	const workos = getWorkOS();
	const sessionData = getCookie(request, AUTH_COOKIE);

	if (!config || !workos || !sessionData) {
		return null;
	}

	try {
		const session = await workos.userManagement.authenticateWithSessionCookie({
			sessionData,
			cookiePassword: config.cookiePassword,
		});
		return session.authenticated ? session : null;
	} catch (error) {
		console.error('Failed to authenticate session cookie:', error);
		return null;
	}
}

export function getAppUrl(request: Request) {
	const url = new URL(request.url);
	return `${url.protocol}//${url.host}`;
}

export function safeReturnTo(value: string | null) {
	if (!value || !value.startsWith('/') || value.startsWith('//')) {
		return '/plan';
	}

	return value;
}

export function isAllowedProvider(value: string | null): value is AuthProvider {
	return AUTH_PROVIDERS.includes(value as AuthProvider);
}

export function createState(returnTo: string) {
	const nonce = crypto.randomUUID();
	return {
		nonce,
		state: `${nonce}.${encodeURIComponent(safeReturnTo(returnTo))}`,
	};
}

export function parseState(value: string | null) {
	if (!value) {
		return null;
	}

	const [nonce, encodedReturnTo] = value.split('.', 2);
	if (!nonce || !encodedReturnTo) {
		return null;
	}

	return {
		nonce,
		returnTo: safeReturnTo(decodeURIComponent(encodedReturnTo)),
	};
}

export function getCookie(request: Request, name: string) {
	const cookie = request.headers.get('cookie');
	if (!cookie) {
		return null;
	}

	for (const part of cookie.split(';')) {
		const [key, ...value] = part.trim().split('=');
		if (key === name) {
			return decodeURIComponent(value.join('='));
		}
	}

	return null;
}

export function serializeCookie(
	name: string,
	value: string,
	options: {
		httpOnly?: boolean;
		maxAge?: number;
		path?: string;
		sameSite?: 'Lax' | 'Strict' | 'None';
		secure?: boolean;
	} = {},
) {
	const parts = [`${name}=${encodeURIComponent(value)}`];
	parts.push(`Path=${options.path ?? '/'}`);
	parts.push(`SameSite=${options.sameSite ?? 'Lax'}`);

	if (options.maxAge !== undefined) {
		parts.push(`Max-Age=${options.maxAge}`);
	}

	if (options.httpOnly ?? true) {
		parts.push('HttpOnly');
	}

	if (options.secure) {
		parts.push('Secure');
	}

	return parts.join('; ');
}

export function clearCookie(name: string, secure: boolean) {
	return serializeCookie(name, '', {
		maxAge: 0,
		secure,
	});
}
