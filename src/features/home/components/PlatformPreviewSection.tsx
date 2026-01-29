'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Badge, Card, CardContent } from '@/components/atoms';
import { cn } from '@/lib/utils';
import {
  PLATFORM_PREVIEW_CONTENT,
  PLATFORM_MODULES,
} from '@/content/home-content';
import { ModuleIcon } from '../utils/icons';

export function PlatformPreviewSection() {
  return (
    <section className="py-20 bg-neutral-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="info" className="mb-4">
            {PLATFORM_PREVIEW_CONTENT.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {PLATFORM_PREVIEW_CONTENT.headline}
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            {PLATFORM_PREVIEW_CONTENT.subheadline}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_MODULES.map((module, index) => (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={module.href}>
                <Card
                  hover
                  className={cn(
                    'h-full overflow-hidden group',
                    module.borderColor
                  )}
                >
                  <CardContent className="p-0">
                    {/* Header with gradient */}
                    <div className={cn('p-6 bg-gradient-to-br', module.color)}>
                      <div className="flex items-center justify-between">
                        <div className="group-hover:scale-110 transition-transform text-white/80">
                          <ModuleIcon title={module.title} />
                        </div>
                        <Badge variant="outline" size="sm">
                          Preview
                        </Badge>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                          {module.title}
                        </h3>
                      </div>
                      <p className="text-neutral-400 text-sm mb-2">
                        {module.subtitle}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {module.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
