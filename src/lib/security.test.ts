import { describe, expect, it } from 'vitest';
import { boundedString, hasAcceptableBodySize, isSameOriginRequest, readJsonBodyWithLimit, RequestBodyTooLargeError } from './security';

describe('request security', () => {
	it('allows safe methods and same-origin writes', () => {
		expect(isSameOriginRequest(new Request('https://foodie.test/plan'))).toBe(true);
		expect(
			isSameOriginRequest(
				new Request('https://foodie.test/api/plans', {
					method: 'POST',
					headers: { origin: 'https://foodie.test' },
				}),
			),
		).toBe(true);
	});

	it('rejects cross-origin and originless writes', () => {
		expect(
			isSameOriginRequest(
				new Request('https://foodie.test/api/plans', {
					method: 'POST',
					headers: { origin: 'https://evil.test' },
				}),
			),
		).toBe(false);
		expect(isSameOriginRequest(new Request('https://foodie.test/api/plans', { method: 'POST' }))).toBe(false);
	});

	it('limits body sizes and text', () => {
		const request = new Request('https://foodie.test/api/ai/chat', { headers: { 'content-length': '101' } });
		expect(hasAcceptableBodySize(request, 100)).toBe(false);
		expect(boundedString(' abcdef ', 3)).toBe('abc');
	});

	it('enforces the body limit even without a content-length header', async () => {
		const request = new Request('https://foodie.test/api/ai/chat', {
			method: 'POST',
			body: JSON.stringify({ prompt: 'x'.repeat(200) }),
		});
		expect(request.headers.get('content-length')).toBeNull();
		await expect(readJsonBodyWithLimit(request, 100)).rejects.toBeInstanceOf(RequestBodyTooLargeError);
	});

	it('parses JSON within the body limit', async () => {
		const request = new Request('https://foodie.test/api/ai/chat', {
			method: 'POST',
			body: JSON.stringify({ prompt: 'hello' }),
		});
		await expect(readJsonBodyWithLimit(request, 100)).resolves.toEqual({ prompt: 'hello' });
	});
});
