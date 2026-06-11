import type { APIRoute } from 'astro';
import { AUTH_STATE_COOKIE, createState, getAppUrl, getAuthConfig, getWorkOS, isAllowedProvider, safeReturnTo, serializeCookie } from '../../lib/auth';

export const GET: APIRoute = async ({ request, redirect, url }) => {
	const config = getAuthConfig();
	const workos = getWorkOS();
	const provider = url.searchParams.get('provider');
	const returnTo = safeReturnTo(url.searchParams.get('returnTo'));

	if (!config || !workos) {
		return redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
	}

	const { nonce, state } = createState(returnTo);
	const authorizationUrl = workos.userManagement.getAuthorizationUrl({
		clientId: config.clientId,
		provider: isAllowedProvider(provider) ? provider : 'authkit',
		redirectUri: `${getAppUrl(request)}/auth/callback`,
		state,
	});

	return new Response(null, {
		status: 302,
		headers: {
			Location: authorizationUrl,
			'Set-Cookie': serializeCookie(AUTH_STATE_COOKIE, nonce, {
				maxAge: 600,
				secure: new URL(request.url).protocol === 'https:',
			}),
		},
	});
};
