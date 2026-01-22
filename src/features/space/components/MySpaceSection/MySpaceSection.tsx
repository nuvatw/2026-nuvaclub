'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useNunuProfile } from '@/lib/db/hooks/useNunuProfile';
import { useMentorships } from '@/lib/db/hooks/useMentorships';
import { PairingCard } from './PairingCard';
import { NunuApplicationCard } from './NunuApplicationCard';
import { NunuDashboard } from './NunuDashboard';
import { EmptyPairingState } from './EmptyPairingState';
import { NunuApplicationModal, type NunuApplicationFormData } from './NunuApplicationModal';
import type { NunuLevel, NunuType } from '@/features/space/types';

interface MySpaceSectionProps {
  onNavigateToMatchingBoard?: () => void;
}

export function MySpaceSection({ onNavigateToMatchingBoard }: MySpaceSectionProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const { application, profile, isNunu, applicationStatus, submitApplication } = useNunuProfile(userId);
  const { myNunu, mentorshipsAsNunu, hasNunu } = useMentorships(userId);

  // Modal state
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Transform mentorships to VavaInfo for NunuDashboard
  const vavas = useMemo(() => {
    return mentorshipsAsNunu
      .filter((m) => m.status === 'active')
      .map((m) => ({
        id: m.vava?.id || m.vavaId,
        name: m.vava?.name || 'Unknown',
        avatar: m.vava?.avatar,
        sessionCount: m.sessionCount,
        status: m.status as 'active' | 'completed' | 'paused',
      }));
  }, [mentorshipsAsNunu]);

  const handleOpenApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(true);
  }, []);

  const handleCloseApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(false);
  }, []);

  const handleSubmitApplication = useCallback(async (data: NunuApplicationFormData) => {
    // Simulate video upload - in production, this would upload to cloud storage
    let videoUrl: string | undefined;
    let videoFileName: string | undefined;

    if (data.introVideo) {
      // Simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In production, upload to S3/CloudFlare/etc. and get URL
      videoUrl = URL.createObjectURL(data.introVideo);
      videoFileName = data.introVideo.name;
    }

    // Submit to database
    await submitApplication({
      applicationText: data.applicationText,
      expertise: data.expertise,
      discordId: data.discordId,
      introVideoUrl: videoUrl,
      introVideoFileName: videoFileName,
      situationalAnswers: data.situationalAnswers,
    });
  }, [submitApplication]);

  const handleNavigateToBoard = () => {
    onNavigateToMatchingBoard?.();
    // Scroll to matching board section
    const boardSection = document.getElementById('matching-board');
    boardSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold text-white mb-2">My Space</h2>
        <p className="text-neutral-400">Your Nunu-Vava relationships and mentorship info</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: My Nunu */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
            My Nunu (Mentor)
          </h3>

          {hasNunu && myNunu ? (
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
              startedAt={new Date()}
              sessionCount={8}
            />
          ) : (
            <EmptyPairingState
              type="nunu"
              onAction={handleNavigateToBoard}
            />
          )}
        </div>

        {/* Right Column: Nunu Dashboard or Application */}
        <div>
          <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
            My Nunu Role
          </h3>

          {isNunu && profile ? (
            <NunuDashboard
              level={profile.level}
              type={profile.type}
              currentVavaCount={profile.currentVavaCount}
              maxVavas={profile.maxVavas}
              totalMentorships={profile.totalMentorships}
              avgRating={profile.avgRating}
              totalRatings={profile.totalRatings}
              vavas={vavas}
              isAvailable={profile.isAvailable}
              onToggleAvailability={() => console.log('Toggle availability')}
              onAddVava={handleNavigateToBoard}
              onViewVava={(vavaId) => console.log('View vava', vavaId)}
            />
          ) : (
            <NunuApplicationCard
              status={applicationStatus}
              submittedAt={application?.submittedAt}
              rejectionReason={application?.rejectionReason}
              onApply={handleOpenApplicationModal}
              onReapply={handleOpenApplicationModal}
            />
          )}
        </div>
      </div>

      {/* Nunu Application Modal */}
      <NunuApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={handleCloseApplicationModal}
        onSubmit={handleSubmitApplication}
      />
    </section>
  );
}
