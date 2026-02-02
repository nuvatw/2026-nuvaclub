'use client';

import React, { useState } from 'react';
import { useLanguage } from './LanguageProvider';
import { Locale } from '@/content/i18n';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const LOCALE_CONFIG: { code: Locale; label: string; disabled?: boolean }[] = [
    { code: 'zh-TW', label: '中' },
    { code: 'en', label: 'EN' },
    { code: 'ja', label: '日', disabled: true },
    { code: 'ko', label: '韓', disabled: true },
];

export const LanguageSwitcher: React.FC = () => {
    const { locale, setLocale } = useLanguage();
    const [hoveredCode, setHoveredCode] = useState<Locale | null>(null);

    return (
        <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/10">
            {LOCALE_CONFIG.map((conf) => {
                const isActive = locale === conf.code;
                const isDisabled = conf.disabled;

                return (
                    <div key={conf.code} className="relative">
                        <button
                            onClick={() => !isDisabled && setLocale(conf.code)}
                            onMouseEnter={() => isDisabled && setHoveredCode(conf.code)}
                            onMouseLeave={() => setHoveredCode(null)}
                            disabled={isDisabled}
                            className={cn(
                                'relative w-7 h-7 flex items-center justify-center rounded-full text-[10px] font-bold transition-all duration-300',
                                isActive
                                    ? 'bg-white text-neutral-900 shadow-lg scale-110 z-10'
                                    : isDisabled
                                        ? 'text-white/20 cursor-not-allowed'
                                        : 'text-white/60 hover:bg-white/10 hover:text-white'
                            )}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="active-language"
                                    className="absolute inset-0 bg-white rounded-full -z-10"
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                />
                            )}
                            {conf.label}
                        </button>

                        <AnimatePresence>
                            {isDisabled && hoveredCode === conf.code && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1.5 bg-neutral-800 text-white text-[10px] font-bold whitespace-nowrap rounded-lg border border-white/10 shadow-2xl pointer-events-none z-50 ring-1 ring-white/5"
                                >
                                    Coming Soon
                                    {/* Arrow */}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[5px] border-transparent border-t-neutral-800" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};
