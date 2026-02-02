import { Locale, DEFAULT_LOCALE } from './locales';
import { Messages } from './messages/zh-TW';

/**
 * Dynamically load messages for a given locale
 * In a real Next.js App Router env, you might want to use static imports
 * or a specific loading strategy. For simplicity, we provide a sync loader.
 */
export function getMessages(locale: Locale): Messages {
    try {
        // In a real production build, these would be bundled
        // For now we use the exported constants
        switch (locale) {
            case 'en':
                return require('./messages/en').messages;
            case 'ja':
                return require('./messages/ja').messages;
            case 'ko':
                return require('./messages/ko').messages;
            case 'zh-TW':
            default:
                return require('./messages/zh-TW').messages;
        }
    } catch (error) {
        console.error(`Failed to load messages for locale: ${locale}`, error);
        return require('./messages/zh-TW').messages;
    }
}

/**
 * Lightweight t() function for message resolution
 */
export function t(messages: Messages, key: keyof Messages, params?: Record<string, string | number>): string {
    let message = messages[key] || (key as string);

    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            message = message.replace(`{${k}}`, String(v));
        });
    }

    return message;
}

export * from './locales';
