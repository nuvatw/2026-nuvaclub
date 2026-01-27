'use client';

import { cn } from '@/lib/utils';
import { AcademicCapIcon, BookIcon, ChartBarIcon } from '@/components/icons';

export type TestTrack = 'nunu' | 'vava' | 'report';

interface TrackConfig {
  id: TestTrack;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
}

const TRACK_CONFIGS: TrackConfig[] = [
  {
    id: 'nunu',
    label: 'Nunu',
    sublabel: 'Mentor',
    icon: <AcademicCapIcon size="md" />,
    activeColor: 'text-purple-400',
    activeBg: 'bg-purple-500/20 border-purple-500',
  },
  {
    id: 'vava',
    label: 'Vava',
    sublabel: 'Learner',
    icon: <BookIcon size="md" />,
    activeColor: 'text-blue-400',
    activeBg: 'bg-blue-500/20 border-blue-500',
  },
  {
    id: 'report',
    label: 'Report',
    sublabel: 'Monthly',
    icon: <ChartBarIcon size="md" />,
    activeColor: 'text-green-400',
    activeBg: 'bg-green-500/20 border-green-500',
  },
];

interface TrackSwitcherProps {
  activeTrack: TestTrack;
  onTrackChange: (track: TestTrack) => void;
  className?: string;
}

/**
 * Shop-style track switcher with pill buttons
 * Matches the UI pattern from the Shop page category selector
 */
export function TrackSwitcher({
  activeTrack,
  onTrackChange,
  className,
}: TrackSwitcherProps) {
  return (
    <div className={cn('flex gap-3 justify-center', className)}>
      {TRACK_CONFIGS.map((config) => {
        const isActive = activeTrack === config.id;
        return (
          <button
            key={config.id}
            onClick={() => onTrackChange(config.id)}
            className={cn(
              'flex items-center gap-2.5 px-6 py-3 rounded-full border-2 transition-all duration-200',
              'font-semibold text-sm',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950',
              isActive
                ? cn(config.activeBg, config.activeColor, 'focus-visible:ring-current')
                : 'bg-neutral-800/50 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-white focus-visible:ring-neutral-500'
            )}
            aria-pressed={isActive}
            aria-label={`${config.label} track`}
          >
            <span className="w-5 h-5 flex items-center justify-center">
              {config.icon}
            </span>
            <span className="flex items-center gap-1.5">
              <span>{config.label}</span>
              <span className="text-xs opacity-70">({config.sublabel})</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

export { TRACK_CONFIGS };
