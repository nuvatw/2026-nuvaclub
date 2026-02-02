'use client';

import { useLanguage } from '@/features/i18n/LanguageProvider';
import { LOCALES_DATA } from '@/content/i18n/home-content.data';

export function useHomeContent() {
    const { locale } = useLanguage();

    // Get content based on current locale, fallback to zh-TW
    const content = LOCALES_DATA[locale] || LOCALES_DATA['zh-TW'];

    return {
        ...content,
        locale,
    };
}
