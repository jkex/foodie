import type { APIRoute } from 'astro';
import { AUTH_COOKIE, clearCookie, getAppUrl, getAuthConfig, getCookie, getWorkOS } from '../lib/auth';

export const POST: APIRoute = async ({ request, redirect }) => {
	const config = getAuthConfig();
	const workos = getWorkOS();
	const sessionData = getCookie(request, AUTH_COOKIE);
	const secure = new URL(request.url).protocol === 'https:';

	if (!config || !workos || !sessionData) {
		return redirect('/login');
	}

	let logoutUrl = '/login';

	try {
		const session = workos.userManagement.loadSealedSession({
			sessionData,
			cookiePassword: config.cookiePassword,
		});
		logoutUrl = await session.getLogoutUrl({ returnTo: `${getAppUrl(request)}/login` });
	} catch {
		logoutUrl = '/login';
	}

	return new Response(null, {
		status: 302,
		headers: {
			Location: logoutUrl,
			'Set-Cookie': clearCookie(AUTH_COOKIE, secure),
		},
	});
};
