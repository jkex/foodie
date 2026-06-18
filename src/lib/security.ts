const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

export function isSameOriginRequest(request: Request): boolean {
	if (!UNSAFE_METHODS.has(request.method.toUpperCase())) {
		return true;
	}

	const requestUrl = new URL(request.url);
	const origin = request.headers.get('origin');
	if (origin) {
		return origin === requestUrl.origin;
	}

	const referer = request.headers.get('referer');
	return Boolean(referer && new URL(referer).origin === requestUrl.origin);
}

export function hasAcceptableBodySize(request: Request, maxBytes: number): boolean {
	const value = request.headers.get('content-length');
	if (!value) {
		return true;
	}
	const length = Number(value);
	return Number.isFinite(length) && length >= 0 && length <= maxBytes;
}

export class RequestBodyTooLargeError extends Error {}

export async function readJsonBodyWithLimit(request: Request, maxBytes: number): Promise<unknown> {
	if (!hasAcceptableBodySize(request, maxBytes)) {
		throw new RequestBodyTooLargeError('Request is too large.');
	}
	if (!request.body) {
		return null;
	}

	const reader = request.body.getReader();
	const chunks: Uint8Array[] = [];
	let totalBytes = 0;

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			totalBytes += value.byteLength;
			if (totalBytes > maxBytes) {
				await reader.cancel();
				throw new RequestBodyTooLargeError('Request is too large.');
			}
			chunks.push(value);
		}
	} finally {
		reader.releaseLock();
	}

	const body = new Uint8Array(totalBytes);
	let offset = 0;
	for (const chunk of chunks) {
		body.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return JSON.parse(new TextDecoder().decode(body));
}

export function boundedString(value: unknown, maxLength: number): string {
	return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}
