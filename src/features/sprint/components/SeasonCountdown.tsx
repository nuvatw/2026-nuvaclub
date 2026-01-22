'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface SeasonCountdownProps {
  endDate: Date;
  seasonName: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function SeasonCountdown({ endDate, seasonName }: SeasonCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const calculateTimeLeft = () => {
      const difference = endDate.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!mounted) {
    return (
      <div className="bg-gradient-to-r from-primary-900/50 to-primary-800/30 rounded-2xl p-6 border border-primary-700/30">
        <div className="text-center">
          <p className="text-neutral-400 mb-2">Season ends in</p>
          <div className="flex justify-center gap-4">
            {['Days', 'Hours', 'Minutes', 'Seconds'].map((label) => (
              <div key={label} className="text-center">
                <div className="bg-neutral-900/50 rounded-lg px-4 py-3 min-w-[70px]">
                  <span className="text-3xl font-bold text-white">--</span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const timeUnits = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary-900/50 to-primary-800/30 rounded-2xl p-6 border border-primary-700/30"
    >
      <div className="text-center">
        <p className="text-neutral-400 mb-2">
          {seasonName} ends in
        </p>
        <div className="flex justify-center gap-3 sm:gap-4">
          {timeUnits.map((unit, index) => (
            <motion.div
              key={unit.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-neutral-900/50 rounded-lg px-3 sm:px-4 py-3 min-w-[60px] sm:min-w-[70px]">
                <span className="text-2xl sm:text-3xl font-bold text-white tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">{unit.label}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-sm text-primary-400 mt-4">
          Ends on March 31, 2026
        </p>
      </div>
    </motion.div>
  );
}
