'use client';

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    // Initial calculation
    setTimeLeft(calculateTimeLeft());

    // Update every second
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div className="h-5" />; // Placeholder to prevent layout shift
  }

  const { days, hours, minutes, seconds } = timeLeft;
  const isEnded = days === 0 && hours === 0 && minutes === 0 && seconds === 0;

  if (isEnded) {
    return (
      <p className="text-amber-400 text-xs sm:text-sm font-medium">
        募資已結束
      </p>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
      <span className="text-neutral-400">募資倒數</span>
      <div className="flex items-center gap-1 font-mono">
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {days}
        </span>
        <span className="text-neutral-500">天</span>
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {String(hours).padStart(2, '0')}
        </span>
        <span className="text-neutral-500">時</span>
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {String(minutes).padStart(2, '0')}
        </span>
        <span className="text-neutral-500">分</span>
        <span className="bg-neutral-800 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs sm:text-sm font-semibold">
          {String(seconds).padStart(2, '0')}
        </span>
        <span className="text-neutral-500">秒</span>
      </div>
    </div>
  );
}
