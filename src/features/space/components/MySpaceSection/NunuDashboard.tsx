'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge, Button, Card, CardContent } from '@/components/atoms';
import { cn } from '@/lib/utils';
import type { NunuLevel, NunuType } from '@/features/space/types';
import { getNunuLevelConfig, NUNU_TYPE_LABELS, NUNU_TYPE_COLORS } from '@/features/space/types';

interface VavaInfo {
  id: string;
  name: string;
  avatar?: string;
  sessionCount: number;
  status: 'active' | 'completed' | 'paused';
}

interface NunuDashboardProps {
  level: NunuLevel;
  type: NunuType;
  currentVavaCount: number;
  maxVavas: number;
  totalMentorships: number;
  avgRating: number;
  totalRatings: number;
  vavas: VavaInfo[];
  isAvailable: boolean;
  onToggleAvailability?: () => void;
  onAddVava?: () => void;
  onViewVava?: (vavaId: string) => void;
}

export function NunuDashboard({
  level,
  type,
  currentVavaCount,
  maxVavas,
  totalMentorships,
  avgRating,
  totalRatings,
  vavas,
  isAvailable,
  onToggleAvailability,
  onAddVava,
  onViewVava,
}: NunuDashboardProps) {
  const levelConfig = getNunuLevelConfig(level);
  const progressPercent = Math.min((currentVavaCount / maxVavas) * 100, 100);
  const availableSlots = maxVavas - currentVavaCount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-6 rounded-xl',
        'bg-neutral-900 border border-neutral-800'
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-white">Nunu Dashboard</h3>
            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', NUNU_TYPE_COLORS[type])}>
              {NUNU_TYPE_LABELS[type]}
            </span>
          </div>
          <p className="text-sm text-neutral-400">Manage your Vavas and mentorship activities</p>
        </div>

        <Badge
          className={cn(
            'cursor-pointer transition-colors',
            isAvailable
              ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30'
              : 'bg-neutral-700 text-neutral-400 hover:bg-neutral-600'
          )}
          onClick={onToggleAvailability}
        >
          {isAvailable ? 'Available' : 'Not Available'}
        </Badge>
      </div>

      {/* Level & Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Level Badge */}
        <div className={cn('p-4 rounded-xl border', levelConfig.color)}>
          <div className="text-2xl font-bold mb-1">{level}</div>
          <div className="text-xs opacity-80">{levelConfig.name}</div>
        </div>

        {/* Total Mentorships */}
        <div className="p-4 rounded-xl bg-neutral-800/50">
          <div className="text-2xl font-bold text-white mb-1">{totalMentorships}</div>
          <div className="text-xs text-neutral-500">Total Mentorships</div>
        </div>

        {/* Rating */}
        <div className="p-4 rounded-xl bg-neutral-800/50">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-2xl font-bold text-white">{avgRating.toFixed(1)}</span>
            <svg className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div className="text-xs text-neutral-500">{totalRatings} ratings</div>
        </div>

        {/* Slots */}
        <div className="p-4 rounded-xl bg-neutral-800/50">
          <div className="text-2xl font-bold text-white mb-1">
            {currentVavaCount}/{maxVavas}
          </div>
          <div className="text-xs text-neutral-500">Vava Slots</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">Vava Capacity</span>
          <span className="text-sm text-neutral-300">
            {availableSlots} {availableSlots === 1 ? 'slot' : 'slots'} available
          </span>
        </div>
        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              progressPercent >= 100
                ? 'bg-red-500'
                : progressPercent >= 80
                  ? 'bg-yellow-500'
                  : 'bg-green-500'
            )}
          />
        </div>
      </div>

      {/* Current Vavas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-white">Current Vavas ({vavas.length})</h4>
          {availableSlots > 0 && (
            <Button variant="outline" size="sm" onClick={onAddVava}>
              <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Vava
            </Button>
          )}
        </div>

        {vavas.length === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-neutral-700 text-center">
            <p className="text-sm text-neutral-500 mb-3">You don&apos;t have any Vavas yet</p>
            <Button variant="outline" size="sm" onClick={onAddVava}>
              Find a Vava on the Matching Board
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vavas.map((vava) => (
              <div
                key={vava.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-lg cursor-pointer',
                  'bg-neutral-800/50 border border-neutral-800',
                  'hover:border-neutral-700 transition-colors'
                )}
                onClick={() => onViewVava?.(vava.id)}
              >
                <Image
                  src={vava.avatar || 'https://i.pravatar.cc/150?u=default'}
                  alt={vava.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-white truncate">{vava.name}</div>
                  <div className="text-xs text-neutral-500">{vava.sessionCount} sessions</div>
                </div>
                <Badge
                  variant={
                    vava.status === 'active'
                      ? 'success'
                      : vava.status === 'paused'
                        ? 'warning'
                        : 'default'
                  }
                  size="sm"
                >
                  {vava.status}
                </Badge>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: Math.min(availableSlots, 2) }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className={cn(
                  'flex items-center justify-center p-3 rounded-lg cursor-pointer',
                  'border border-dashed border-neutral-700',
                  'hover:border-neutral-600 hover:bg-neutral-800/30 transition-colors'
                )}
                onClick={onAddVava}
              >
                <div className="text-center">
                  <svg
                    className="w-6 h-6 mx-auto mb-1 text-neutral-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span className="text-xs text-neutral-500">Add Vava</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
