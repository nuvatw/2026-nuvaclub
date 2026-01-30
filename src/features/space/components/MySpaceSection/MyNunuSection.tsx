'use client';

import { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth, getEffectiveUserId } from '@/features/auth/components/AuthProvider';
import { useMentorships, useNunuProfiles } from '../../hooks';
import { PairingCard } from './PairingCard';
import { EmptyPairingState } from './EmptyPairingState';
import { ExtendRelationshipModal } from './ExtendRelationshipModal';
import type { NunuLevel, NunuType } from '@/features/space/types';

interface MyNunuSectionProps {
  onNavigateToMatchingBoard?: () => void;
}

/**
 * Get a fallback Nunu for users who don't have an assigned match.
 * This ensures every logged-in user always sees a Nunu card.
 * Uses deterministic selection based on user ID for consistency.
 */
function useFallbackNunu(userId: string | undefined) {
  const { profiles, isReady } = useNunuProfiles();

  return useMemo(() => {
    if (!isReady || !userId || profiles.length === 0) return null;

    // Get available Nunu profiles
    const nunuProfiles = profiles.filter((p) => p.isAvailable);
    if (nunuProfiles.length === 0) return null;

    // Deterministic selection: hash user ID to select a Nunu
    const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const selectedProfile = nunuProfiles[hash % nunuProfiles.length];

    // Create a default mentorship-like structure
    return {
      nunu: {
        id: selectedProfile.userId,
        name: selectedProfile.userName || 'Unknown Nunu',
        avatar: selectedProfile.userAvatar,
        level: selectedProfile.level as NunuLevel,
        type: selectedProfile.type as NunuType,
        discordId: selectedProfile.discordId,
        githubUsername: selectedProfile.githubUsername,
      },
      mentorship: {
        // Default months: current month + next 2 months
        months: getDefaultMonths(),
        startedAt: new Date(),
        sessionCount: 0,
        status: 'active' as const,
      },
    };
  }, [profiles, isReady, userId]);
}

/**
 * Get default months for fallback: current + next 2 months
 */
function getDefaultMonths(): string[] {
  const now = new Date();
  const months: string[] = [];
  for (let i = 0; i < 3; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
  }
  return months;
}

export function MyNunuSection({ onNavigateToMatchingBoard }: MyNunuSectionProps) {
  const { user, identity } = useAuth();
  // Map test account ID to actual user ID for data lookups
  const userId = getEffectiveUserId(user?.id ?? null) ?? undefined;

  const { myNunu, hasNunu, mentorshipsAsVava } = useMentorships(userId);
  const fallbackNunu = useFallbackNunu(userId);

  // Modal state
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);

  // Determine the effective Nunu and mentorship to display
  const effectiveNunu = myNunu || fallbackNunu?.nunu;
  const activeMentorship = mentorshipsAsVava.find((m) => m.status === 'active');
  const effectiveMentorship = activeMentorship || fallbackNunu?.mentorship;

  // Get months from active mentorship
  const currentMonths = effectiveMentorship?.months || getDefaultMonths();

  const handleNavigateToBoard = () => {
    onNavigateToMatchingBoard?.();
    const boardSection = document.getElementById('matching-board');
    boardSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCardClick = useCallback(() => {
    setIsExtendModalOpen(true);
  }, []);

  const handleExtendSubmit = useCallback((extensionMonths: number, message: string) => {
    // In a real app, this would call an API
    // For now, we just log and show success (handled in modal)
    console.log('Extension request:', { extensionMonths, message });
  }, []);

  // Only show section for logged-in users
  const isLoggedIn = identity !== 'guest';
  const showNunuCard = isLoggedIn && effectiveNunu;

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

      {showNunuCard ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PairingCard
            type="nunu"
            user={{
              id: effectiveNunu.id,
              name: effectiveNunu.name,
              avatar: effectiveNunu.avatar,
              level: effectiveNunu.level as NunuLevel | undefined,
              nunuType: effectiveNunu.type as NunuType | undefined,
              discordId: effectiveNunu.discordId,
              githubUsername: effectiveNunu.githubUsername,
            }}
            status="active"
            startedAt={effectiveMentorship?.startedAt ? new Date(effectiveMentorship.startedAt) : new Date()}
            sessionCount={effectiveMentorship?.sessionCount || 0}
            months={currentMonths}
            onCardClick={handleCardClick}
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

      {/* Extend Relationship Modal */}
      {effectiveNunu && (
        <ExtendRelationshipModal
          isOpen={isExtendModalOpen}
          onClose={() => setIsExtendModalOpen(false)}
          nunuName={effectiveNunu.name}
          currentMonths={currentMonths}
          onSubmit={handleExtendSubmit}
        />
      )}
    </section>
  );
}
