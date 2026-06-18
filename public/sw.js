const CACHE_NAME = 'foodie-static-v3';
const APP_SHELL = ['/favicon.svg', '/manifest.webmanifest'];

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
	self.skipWaiting();
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
			.then(() => self.clients.claim()),
	);
});

self.addEventListener('fetch', (event) => {
	const request = event.request;
	const url = new URL(request.url);

	const isStaticAsset =
		url.origin === self.location.origin &&
		(url.pathname.startsWith('/_astro/') ||
			url.pathname === '/favicon.svg' ||
			url.pathname === '/manifest.webmanifest');

	if (request.method !== 'GET' || !isStaticAsset) {
		return;
	}

	event.respondWith(
		caches.match(request).then((cached) => {
			const network = fetch(request)
				.then((response) => {
					if (response.ok && url.origin === self.location.origin) {
						const copy = response.clone();
						caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
					}
					return response;
				})
				.catch(() => cached);

			return cached || network;
		}),
	);
});
