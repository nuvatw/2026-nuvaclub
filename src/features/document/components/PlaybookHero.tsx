'use client';

import { motion } from 'motion/react';
import { QUICK_START_ITEMS, PLAYBOOK_CONTENT } from '../data/playbook-content';
import { cn } from '@/lib/utils';

interface QuickStartCardProps {
  item: (typeof QUICK_START_ITEMS)[0];
  index: number;
}

function QuickStartCard({ item, index }: QuickStartCardProps) {
  const handleClick = () => {
    const element = document.getElementById(item.id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
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

export function PlaybookHero() {
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
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          {PLAYBOOK_CONTENT.hero.title}
        </h1>
        <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-2">
          {PLAYBOOK_CONTENT.hero.subtitle}
        </p>
        <p className="text-neutral-500 max-w-3xl mx-auto">
          {PLAYBOOK_CONTENT.hero.description}
        </p>
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
          {QUICK_START_ITEMS.map((item, index) => (
            <QuickStartCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
