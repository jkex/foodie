import { defineMiddleware } from 'astro:middleware';
import { getAuthConfig, getSession } from './lib/auth';
import { isSameOriginRequest } from './lib/security';

const PUBLIC_PATHS = ['/login', '/auth/login', '/auth/callback', '/favicon.svg', '/manifest.webmanifest', '/sw.js'];

function isPublicPath(pathname: string) {
	return PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/_astro/');
}

export const onRequest = defineMiddleware(async ({ request, url, redirect, locals }, next) => {
	// All data is scoped to this ID. Without WorkOS configured (local dev) a single
	// shared 'local' user is used.
	locals.userId = 'local';

	if (!isSameOriginRequest(request)) {
		return new Response('Forbidden', { status: 403 });
	}

	if (isPublicPath(url.pathname)) {
		return withPrivateCacheHeaders(await next(), url.pathname);
	}

	const authConfig = getAuthConfig();
	const session = await getSession(request);

	if (session) {
		locals.userId = session.user.id;
		return withPrivateCacheHeaders(await next(), url.pathname);
	}

	if (!authConfig) {
		return withPrivateCacheHeaders(await next(), url.pathname);
	}

	if (url.pathname.startsWith('/api/')) {
		return new Response('Unauthorized', { status: 401 });
	}

	const returnTo = `${url.pathname}${url.search}`;
	return redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
});

function withPrivateCacheHeaders(response: Response, pathname: string): Response {
	if (pathname.startsWith('/_astro/') || pathname === '/favicon.svg' || pathname === '/manifest.webmanifest' || pathname === '/sw.js') {
		return response;
	}
	const headers = new Headers(response.headers);
	headers.set('Cache-Control', 'private, no-store');
	headers.set('Vary', 'Cookie');
	return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
