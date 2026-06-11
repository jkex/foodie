import { defineMiddleware } from 'astro:middleware';
import { getAuthConfig, getSession } from './lib/auth';

const PUBLIC_PATHS = ['/login', '/auth/login', '/auth/callback', '/favicon.ico', '/favicon.svg', '/manifest.webmanifest', '/sw.js'];

function isPublicPath(pathname: string) {
	return PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/_astro/');
}

export const onRequest = defineMiddleware(async ({ request, url, redirect, locals }, next) => {
	// All data is scoped to this ID. Without WorkOS configured (local dev) a single
	// shared 'local' user is used.
	locals.userId = 'local';

	if (isPublicPath(url.pathname)) {
		return next();
	}

	const authConfig = getAuthConfig();
	const session = await getSession(request);

	if (session) {
		locals.userId = session.user.id;
		return next();
	}

	if (!authConfig) {
		return next();
	}

	if (url.pathname.startsWith('/api/')) {
		return new Response('Unauthorized', { status: 401 });
	}

	const returnTo = `${url.pathname}${url.search}`;
	return redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
});
