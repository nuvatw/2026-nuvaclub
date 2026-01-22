'use client';

import { motion } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useMentorships } from '@/lib/db/hooks/useMentorships';
import { PairingCard } from './PairingCard';
import { EmptyPairingState } from './EmptyPairingState';
import type { NunuLevel, NunuType } from '@/features/space/types';

interface MyNunuSectionProps {
  onNavigateToMatchingBoard?: () => void;
}

export function MyNunuSection({ onNavigateToMatchingBoard }: MyNunuSectionProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const { myNunu, hasNunu, mentorshipsAsVava } = useMentorships(userId);

  // Get the active mentorship to show session count
  const activeMentorship = mentorshipsAsVava.find((m) => m.status === 'active');

  const handleNavigateToBoard = () => {
    onNavigateToMatchingBoard?.();
    const boardSection = document.getElementById('matching-board');
    boardSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h2 className="text-xl font-bold text-white mb-1">My Nunu</h2>
        <p className="text-sm text-neutral-400">Your mentor who guides your learning journey</p>
      </motion.div>

      {hasNunu && myNunu ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PairingCard
            type="nunu"
            user={{
              id: myNunu.id,
              name: myNunu.name,
              avatar: myNunu.avatar,
              level: myNunu.level as NunuLevel | undefined,
              nunuType: myNunu.type as NunuType | undefined,
              discordId: myNunu.discordId,
              githubUsername: myNunu.githubUsername,
            }}
            status="active"
            startedAt={activeMentorship?.startedAt ? new Date(activeMentorship.startedAt) : new Date()}
            sessionCount={activeMentorship?.sessionCount || 0}
          />
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <EmptyPairingState
            type="nunu"
            onAction={handleNavigateToBoard}
          />
        </motion.div>
      )}
    </section>
  );
}
