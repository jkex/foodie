/// <reference types="astro/client" />
/// <reference types="@cloudflare/workers-types" />

declare namespace App {
	interface Locals {
		userId: string;
	}
}

interface Env {
	DB: D1Database;
	WORKOS_API_KEY?: string;
	WORKOS_CLIENT_ID?: string;
	WORKOS_COOKIE_PASSWORD?: string;
}
