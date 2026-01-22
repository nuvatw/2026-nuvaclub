'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge, Button } from '@/components/atoms';
import { cn } from '@/lib/utils';
import { formatTimeAgo } from '@/lib/utils/date';
import type { NunuLevel, NunuType } from '@/features/space/types';
import { getNunuLevelConfig, NUNU_TYPE_COLORS, NUNU_TYPE_LABELS } from '@/features/space/types';

interface PairingCardProps {
  type: 'nunu' | 'vava';
  user: {
    id: string;
    name: string;
    avatar?: string;
    level?: NunuLevel;
    nunuType?: NunuType;
  };
  status: 'active' | 'completed' | 'paused';
  startedAt: Date;
  sessionCount: number;
  onViewProfile?: () => void;
  onMessage?: () => void;
}

export function PairingCard({
  type,
  user,
  status,
  startedAt,
  sessionCount,
  onViewProfile,
  onMessage,
}: PairingCardProps) {
  const isNunu = type === 'nunu';
  const levelConfig = user.level ? getNunuLevelConfig(user.level) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-xl',
        'bg-neutral-900 border border-neutral-800',
        'hover:border-neutral-700 transition-colors'
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <Image
            src={user.avatar || 'https://i.pravatar.cc/150?u=default'}
            alt={user.name}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div
            className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900',
              status === 'active' ? 'bg-green-500' : 'bg-neutral-500'
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-white truncate">{user.name}</h4>
            {isNunu && levelConfig && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-xs font-medium border',
                  levelConfig.color
                )}
              >
                {levelConfig.level}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>{isNunu ? 'Your Nunu' : 'Your Vava'}</span>
            {isNunu && user.nunuType && (
              <>
                <span>-</span>
                <span className={cn('px-1.5 py-0.5 rounded text-xs', NUNU_TYPE_COLORS[user.nunuType])}>
                  {NUNU_TYPE_LABELS[user.nunuType]}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-neutral-800/50">
          <div className="text-xs text-neutral-500 mb-1">Started</div>
          <div className="text-sm font-medium text-white">
            {formatTimeAgo(startedAt, 'en-US')}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-neutral-800/50">
          <div className="text-xs text-neutral-500 mb-1">Sessions</div>
          <div className="text-sm font-medium text-white">{sessionCount} sessions</div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-4">
        <Badge
          variant={status === 'active' ? 'success' : status === 'paused' ? 'warning' : 'default'}
          size="sm"
        >
          {status === 'active' && 'In Progress'}
          {status === 'paused' && 'Paused'}
          {status === 'completed' && 'Completed'}
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={onViewProfile}>
          View Profile
        </Button>
        <Button size="sm" className="flex-1" onClick={onMessage}>
          <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
          </svg>
          Discord
        </Button>
      </div>
    </motion.div>
  );
}
