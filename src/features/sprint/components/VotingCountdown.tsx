'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/atoms';
import { VOTING_DEADLINE } from '../hooks/useSprintVoting';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(deadline: Date): TimeRemaining {
  const now = new Date();
  const diff = deadline.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

interface VotingCountdownProps {
  className?: string;
}

export function VotingCountdown({ className }: VotingCountdownProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(() =>
    calculateTimeRemaining(VOTING_DEADLINE)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining(VOTING_DEADLINE));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (timeRemaining.isExpired) {
    return (
      <div className={className}>
        <Badge variant="error">投票已截止</Badge>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-3">
        <Badge variant="warning">開投票中</Badge>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span>截止：</span>
          <div className="flex items-center gap-1 font-mono">
            {timeRemaining.days > 0 && (
              <>
                <span className="text-white font-semibold">{timeRemaining.days}</span>
                <span className="text-xs">天</span>
              </>
            )}
            <span className="text-white font-semibold">
              {String(timeRemaining.hours).padStart(2, '0')}
            </span>
            <span className="text-xs">:</span>
            <span className="text-white font-semibold">
              {String(timeRemaining.minutes).padStart(2, '0')}
            </span>
            <span className="text-xs">:</span>
            <span className="text-white font-semibold">
              {String(timeRemaining.seconds).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-neutral-500 mt-1">
        投票截止日期：2026/2/28 23:59
      </p>
    </div>
  );
}
