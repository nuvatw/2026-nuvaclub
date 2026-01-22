'use client';

import { useMemo, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, Button } from '@/components/atoms';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useNunuProfile } from '@/lib/db/hooks/useNunuProfile';
import { useMentorships } from '@/lib/db/hooks/useMentorships';
import { NunuApplicationCard } from './NunuApplicationCard';
import { NunuApplicationModal, type NunuApplicationFormData } from './NunuApplicationModal';
import { cn } from '@/lib/utils';
import {
  getNunuLevelConfig,
  NUNU_TYPE_LABELS,
  type NunuLevel,
} from '@/features/space/types';

interface MyVavaSectionProps {
  onNavigateToMatchingBoard?: () => void;
}

export function MyVavaSection({ onNavigateToMatchingBoard }: MyVavaSectionProps) {
  const { user } = useAuth();
  const userId = user?.id;

  const { application, profile, isNunu, applicationStatus, submitApplication } = useNunuProfile(userId);
  const { mentorshipsAsNunu } = useMentorships(userId);

  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);

  // Get active vavas
  const activeVavas = useMemo(() => {
    return mentorshipsAsNunu
      .filter((m) => m.status === 'active')
      .map((m) => ({
        id: m.vava?.id || m.vavaId,
        name: m.vava?.name || 'Unknown',
        avatar: m.vava?.avatar,
        sessionCount: m.sessionCount,
        startedAt: m.startedAt,
        discordId: m.vava?.discordId,
        githubUsername: m.vava?.githubUsername,
      }));
  }, [mentorshipsAsNunu]);

  const handleOpenApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(true);
  }, []);

  const handleCloseApplicationModal = useCallback(() => {
    setIsApplicationModalOpen(false);
  }, []);

  const handleSubmitApplication = useCallback(async (data: NunuApplicationFormData) => {
    let videoUrl: string | undefined;
    let videoFileName: string | undefined;

    if (data.introVideo) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      videoUrl = URL.createObjectURL(data.introVideo);
      videoFileName = data.introVideo.name;
    }

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
    const boardSection = document.getElementById('matching-board');
    boardSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // If user is not a Nunu, show application card
  if (!isNunu || !profile) {
    return (
      <section className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4"
        >
          <h2 className="text-xl font-bold text-white mb-1">My Vava</h2>
          <p className="text-sm text-neutral-400">Become a Nunu to mentor others</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NunuApplicationCard
            status={applicationStatus}
            submittedAt={application?.submittedAt}
            rejectionReason={application?.rejectionReason}
            onApply={handleOpenApplicationModal}
            onReapply={handleOpenApplicationModal}
          />
        </motion.div>

        <NunuApplicationModal
          isOpen={isApplicationModalOpen}
          onClose={handleCloseApplicationModal}
          onSubmit={handleSubmitApplication}
        />
      </section>
    );
  }

  // User is a Nunu - show their vavas
  const levelConfig = getNunuLevelConfig(profile.level as NunuLevel);

  return (
    <section className="mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">My Vava</h2>
            <p className="text-sm text-neutral-400">
              {activeVavas.length > 0
                ? `You are mentoring ${activeVavas.length} learner${activeVavas.length > 1 ? 's' : ''}`
                : 'Find learners to mentor'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={cn('px-2 py-1 rounded text-xs font-medium', levelConfig.color)}>
              {levelConfig.name}
            </span>
            <span className="text-xs text-neutral-500">
              {profile.currentVavaCount}/{profile.maxVavas} slots
            </span>
          </div>
        </div>
      </motion.div>

      {activeVavas.length > 0 ? (
        <div className="space-y-4">
          {/* 5 cards per row grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {activeVavas.map((vava, index) => (
              <motion.div
                key={vava.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Card className="hover:border-neutral-700 transition-colors">
                  <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center">
                      {/* Avatar */}
                      <div className="relative mb-2">
                        {vava.avatar ? (
                          <img
                            src={vava.avatar}
                            alt={vava.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-medium text-lg">
                            {vava.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-neutral-900" />
                      </div>

                      {/* Name */}
                      <p className="font-medium text-white text-sm truncate w-full mb-1">{vava.name}</p>
                      <p className="text-xs text-neutral-500 mb-3">
                        {vava.sessionCount} session{vava.sessionCount !== 1 ? 's' : ''}
                      </p>

                      {/* Social Links */}
                      <div className="flex gap-2">
                        <a
                          href={vava.discordId ? `https://discord.com/users/${vava.discordId}` : 'https://discord.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-[#5865F2]/10 hover:bg-[#5865F2]/20 text-[#5865F2] transition-colors"
                          title="Discord"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" />
                          </svg>
                        </a>
                        <a
                          href={vava.githubUsername ? `https://github.com/${vava.githubUsername}` : 'https://github.com'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
                          title="GitHub Profile"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Add more vavas button if slots available */}
            {profile.currentVavaCount < profile.maxVavas && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <button
                  onClick={handleNavigateToBoard}
                  className="w-full h-full min-h-[160px] p-3 rounded-xl border-2 border-dashed border-neutral-700 text-neutral-400 hover:border-neutral-600 hover:text-neutral-300 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs text-center">
                    {profile.maxVavas - profile.currentVavaCount} slots
                  </span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center py-8 rounded-xl bg-neutral-900 border border-neutral-800"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Vavas Yet</h3>
          <p className="text-neutral-400 mb-4 max-w-sm mx-auto">
            Post on the Matching Board to find learners who want your guidance
          </p>
          <Button onClick={handleNavigateToBoard}>
            Find Vavas to Mentor
          </Button>
        </motion.div>
      )}

      <NunuApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={handleCloseApplicationModal}
        onSubmit={handleSubmitApplication}
      />
    </section>
  );
}
