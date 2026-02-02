'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Locale, DEFAULT_LOCALE, getLocaleFromCookie, setLocaleInCookie, getMessages, t } from '@/content/i18n';
import { Messages } from '@/content/i18n/messages/zh-TW';

interface LanguageContextType {
    locale: Locale;
    t: (key: keyof Messages, params?: Record<string, string | number>) => string;
    setLocale: (locale: Locale) => void;
    messages: Messages;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
    const [messages, setMessages] = useState<Messages>(() => getMessages(DEFAULT_LOCALE));

    // Initialize from cookie on mount
    useEffect(() => {
        const savedLocale = getLocaleFromCookie();
        if (savedLocale !== locale) {
            setLocaleState(savedLocale);
            setMessages(getMessages(savedLocale));
        }
    }, []);

    const setLocale = useCallback((newLocale: Locale) => {
        setLocaleState(newLocale);
        setMessages(getMessages(newLocale));
        setLocaleInCookie(newLocale);
        // Optional: reload page if needed for server components to sync via cookie
        // window.location.reload(); 
    }, []);

    const translate = useCallback((key: keyof Messages, params?: Record<string, string | number>) => {
        return t(messages, key, params);
    }, [messages]);

    return (
        <LanguageContext.Provider value={{ locale, t: translate, setLocale, messages }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
