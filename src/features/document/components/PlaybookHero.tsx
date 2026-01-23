'use client';

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { scrollToSection } from '../utils/scroll';
import type { QuickStartItem, PlaybookContentType, VersionInfo } from '../types';

interface QuickStartCardProps {
  item: QuickStartItem;
  index: number;
}

function QuickStartCard({ item, index }: QuickStartCardProps) {
  const handleClick = () => {
    scrollToSection(item.id);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
      onClick={handleClick}
      className={cn(
        'group text-left p-5 rounded-xl border border-neutral-800',
        'bg-gradient-to-br',
        item.color,
        'hover:border-primary-500/50 hover:shadow-lg hover:shadow-primary-500/10',
        'transition-all duration-300'
      )}
    >
      <div className="text-3xl mb-3">{item.icon}</div>
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-neutral-400">{item.description}</p>
    </motion.button>
  );
}

interface PlaybookHeroProps {
  quickStartItems: QuickStartItem[];
  content: PlaybookContentType;
  versionInfo: VersionInfo;
  isLatest: boolean;
}

export function PlaybookHero({ quickStartItems, content, versionInfo, isLatest }: PlaybookHeroProps) {
  return (
    <section className="mb-16">
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 mb-6">
          <span className="text-2xl">📖</span>
          <span className="text-sm font-medium text-primary-400">
            Official Guide
          </span>
          {!isLatest && (
            <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
              v{versionInfo.version}
            </span>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {content.hero.title}
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-2">
          {content.hero.subtitle}
        </p>
        <p className="text-neutral-500 max-w-3xl mx-auto">
          {content.hero.description}
        </p>

        {/* Version Info */}
        {!isLatest && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-sm text-amber-300">
              You&apos;re viewing an older version. Released on {versionInfo.releaseDate}
            </span>
          </div>
        )}
      </motion.div>

      {/* Quick Start Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-lg font-semibold text-neutral-300 mb-4 flex items-center gap-2">
          <span className="text-xl">⚡</span>
          Jump to Section
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStartItems.map((item, index) => (
            <QuickStartCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
