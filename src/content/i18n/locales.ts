export type Locale = 'zh-TW' | 'en' | 'ja' | 'ko';

export const LOCALES: Locale[] = ['zh-TW', 'en', 'ja', 'ko'];
export const DEFAULT_LOCALE: Locale = 'zh-TW';

export const LOCALE_COOKIE_NAME = 'nuva_locale';

/**
 * Get locale from cookie (client-side)
 */
export function getLocaleFromCookie(): Locale {
    if (typeof document === 'undefined') return DEFAULT_LOCALE;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${LOCALE_COOKIE_NAME}=`);
    if (parts.length === 2) {
        const locale = parts.pop()?.split(';').shift() as Locale;
        if (LOCALES.includes(locale)) return locale;
    }

    return DEFAULT_LOCALE;
}

/**
 * Set locale in cookie (client-side)
 */
export function setLocaleInCookie(locale: Locale) {
    if (typeof document === 'undefined') return;

    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Lax`;
}

/**
 * Get locale from headers (server-side)
 */
export function getLocaleFromHeaders(headers: Headers): Locale {
    // 1. Check cookie
    const cookie = headers.get('cookie');
    if (cookie) {
        const match = cookie.match(new RegExp(`(^|; )^{LOCALE_COOKIE_NAME}=([^;]*)`));
        const locale = match?.[2] as Locale;
        if (LOCALES.includes(locale)) return locale;
    }

    // 2. Check Accept-Language
    const acceptLanguage = headers.get('accept-language');
    if (acceptLanguage) {
        if (acceptLanguage.includes('en')) return 'en';
        if (acceptLanguage.includes('ja')) return 'ja';
        if (acceptLanguage.includes('ko')) return 'ko';
    }

    return DEFAULT_LOCALE;
}
