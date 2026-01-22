'use client';

import Image from 'next/image';
import { motion } from 'motion/react';
import { Badge } from '@/components/atoms';
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
    discordId?: string;
    githubUsername?: string;
  };
  status: 'active' | 'completed' | 'paused';
  startedAt: Date;
  sessionCount: number;
}

export function PairingCard({
  type,
  user,
  status,
  startedAt,
  sessionCount,
}: PairingCardProps) {
  const isNunu = type === 'nunu';
  const levelConfig = user.level ? getNunuLevelConfig(user.level) : null;

  const discordUrl = user.discordId ? `https://discord.com/users/${user.discordId}` : 'https://discord.com';
  const githubUrl = user.githubUsername ? `https://github.com/${user.githubUsername}` : 'https://github.com';

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

      {/* Social Links */}
      <div className="flex gap-2">
        <a
          href={discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
          </svg>
          <span className="text-sm font-medium">Discord</span>
        </a>
        <a
          href={githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          <span className="text-sm font-medium">GitHub</span>
        </a>
      </div>
    </motion.div>
  );
}
