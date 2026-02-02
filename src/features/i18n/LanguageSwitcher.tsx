'use client';

import React from 'react';
import { useLanguage } from './LanguageProvider';
import { Locale } from '@/content/i18n';

const LOCALE_LABELS: Record<Locale, string> = {
    'zh-TW': '繁體中文',
    'en': 'English',
    'ja': '日本語 (Coming Soon)',
    'ko': '한국어 (Coming Soon)',
};

export const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useLanguage();

    const handleLocaleChange = (newLocale: Locale) => {
        if (newLocale === 'ja' || newLocale === 'ko') return;
        setLocale(newLocale);
    };

    return (
        <div className="flex items-center space-x-2">
            <select
                value={locale}
                onChange={(e) => handleLocaleChange(e.target.value as Locale)}
                className="bg-transparent border border-white/20 text-white rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
                <option value="zh-TW" className="bg-slate-800 text-white">{LOCALE_LABELS['zh-TW']}</option>
                <option value="en" className="bg-slate-800 text-white">{LOCALE_LABELS['en']}</option>
                <option value="ja" disabled className="bg-slate-800 text-gray-400">{LOCALE_LABELS['ja']}</option>
                <option value="ko" disabled className="bg-slate-800 text-gray-400">{LOCALE_LABELS['ko']}</option>
            </select>
        </div>
    );
};
