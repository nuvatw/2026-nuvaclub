'use client';

import type { AgendaItem } from '@/features/shop/types';

interface EventAgendaProps {
  agenda: AgendaItem[];
}

export function EventAgenda({ agenda }: EventAgendaProps) {
  if (!agenda || agenda.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold text-[var(--shop-text)] mb-6">
        Event Schedule
      </h2>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-[19px] top-3 bottom-3 w-0.5 bg-[var(--shop-border)]" />

        {/* Timeline Items */}
        <div className="space-y-6">
          {agenda.map((item, index) => (
            <div key={index} className="relative flex gap-4">
              {/* Dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[var(--shop-card)] border-2 border-primary-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-primary-500" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-mono text-primary-500">
                    {item.time}
                  </span>
                </div>
                <h3 className="font-medium text-[var(--shop-text)]">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-sm text-[var(--shop-text-muted)] mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
