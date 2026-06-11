import type { AstroGlobal } from 'astro';
import { detectLocale, LOCALE_COOKIE, translations, type Locale, type TranslationKey } from './preferences';

export type Translator = (key: TranslationKey) => string;

/**
 * Resolve the request locale: explicit cookie override first, Accept-Language fallback.
 * The settings page writes the cookie and reloads, so server-rendered text is always
 * in the right language and no client-side re-translation pass is needed.
 */
export function getLocale(Astro: Pick<AstroGlobal, 'cookies' | 'request'>): Locale {
	const cookieLocale = Astro.cookies.get(LOCALE_COOKIE)?.value;
	if (cookieLocale === 'en' || cookieLocale === 'de') {
		return cookieLocale;
	}
	return detectLocale(Astro.request.headers.get('accept-language'));
}

export function useTranslations(Astro: Pick<AstroGlobal, 'cookies' | 'request'>): { locale: Locale; t: Translator } {
	const locale = getLocale(Astro);
	return { locale, t: (key) => translations[locale][key] };
}

export function formatPlanDay(locale: Locale, startDate: string, dayOffset: number): string {
	const date = new Date(`${startDate}T00:00:00`);
	if (Number.isNaN(date.getTime())) {
		return `${dayOffset + 1}`;
	}
	date.setDate(date.getDate() + dayOffset);
	return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);
}

export function formatLastCooked(locale: Locale, lastCookedAt: string | null): string | null {
	if (!lastCookedAt) {
		return null;
	}
	const date = new Date(lastCookedAt);
	if (Number.isNaN(date.getTime())) {
		return null;
	}
	return new Intl.DateTimeFormat(locale === 'de' ? 'de-DE' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

export function formatQuantity(value: number): string {
	return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}
