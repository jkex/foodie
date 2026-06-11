import type { APIRoute } from 'astro';
import { AUTH_COOKIE, AUTH_STATE_COOKIE, clearCookie, getAuthConfig, getCookie, getWorkOS, parseState, serializeCookie } from '../../lib/auth';

export const GET: APIRoute = async ({ request, redirect, url }) => {
	const config = getAuthConfig();
	const workos = getWorkOS();
	const code = url.searchParams.get('code');
	const state = parseState(url.searchParams.get('state'));
	const expectedNonce = getCookie(request, AUTH_STATE_COOKIE);
	const secure = new URL(request.url).protocol === 'https:';

	if (!config || !workos || !code || !state || !expectedNonce || state.nonce !== expectedNonce) {
		return redirect('/login');
	}

	const auth = await workos.userManagement.authenticateWithCode({
		code,
		clientId: config.clientId,
		session: {
			sealSession: true,
			cookiePassword: config.cookiePassword,
		},
	});

	if (!auth.sealedSession) {
		return redirect('/login');
	}

	return new Response(null, {
		status: 302,
		headers: [
			['Location', state.returnTo],
			[
				'Set-Cookie',
				serializeCookie(AUTH_COOKIE, auth.sealedSession, {
					maxAge: 60 * 60 * 24 * 30,
					secure,
				}),
			],
			['Set-Cookie', clearCookie(AUTH_STATE_COOKIE, secure)],
		],
	});
};
