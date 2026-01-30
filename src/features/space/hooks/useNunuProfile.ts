'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

import type { NunuProfile as BaseNunuProfile, NunuApplicationStatus } from '@/features/space/types';

export type NunuProfile = BaseNunuProfile;

export interface NunuProfileWithUser extends NunuProfile {
  // BaseNunuProfile already has some fields like userName and userAvatar as optional.
}

export interface NunuApplicationSituationalAnswers {
  question1: string;
  question2: string;
  question3: string;
}

export interface SubmitApplicationData {
  applicationText: string;
  expertise: string[];
  discordId: string;
  introVideoUrl?: string;
  introVideoFileName?: string;
  situationalAnswers: NunuApplicationSituationalAnswers;
}

interface NunuApplication {
  id: string;
  userId: string;
  status: NunuApplicationStatus;
  submittedAt: Date;
  rejectionReason?: string;
  // ... other fields
}

/**
 * Hook to access Nunu profile data via BFF
 */
export function useNunuProfile(userId?: string) {
  const [profile, setProfile] = useState<NunuProfileWithUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/bff/space/profile?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        setProfile(data);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch Nunu profile:', err);
        setIsReady(true);
      });
  }, [userId]);

  const isNunu = useMemo(() => {
    return profile !== null && profile.isAvailable !== false;
  }, [profile]);

  const isVerifiedNunu = useMemo(() => {
    return profile?.type === 'verified';
  }, [profile]);

  const canAcceptMoreVavas = useMemo(() => {
    if (!profile) return false;
    return profile.currentVavaCount < profile.maxVavas;
  }, [profile]);

  const availableSlots = useMemo(() => {
    if (!profile) return 0;
    return Math.max(profile.maxVavas - profile.currentVavaCount, 0);
  }, [profile]);

  const submitApplication = useCallback(
    async (data: SubmitApplicationData) => {
      // Would call BFF endpoint to submit application
      console.log('Submitting application:', data);
      return { id: 'app-1', status: 'pending' };
    },
    []
  );

  return {
    application: null as NunuApplication | null,
    profile,
    isNunu,
    isVerifiedNunu,
    canAcceptMoreVavas,
    availableSlots,
    applicationStatus: null as NunuApplicationStatus | null,
    submitApplication,
    isReady,
  };
}

/**
 * Hook to get all Nunu profiles
 */
export function useNunuProfiles() {
  const [profiles, setProfiles] = useState<NunuProfileWithUser[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch('/api/bff/space/profile')
      .then(r => r.json())
      .then(data => {
        setProfiles(Array.isArray(data) ? data : []);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch Nunu profiles:', err);
        setIsReady(true);
      });
  }, []);

  const availableNunus = useMemo(() => {
    return profiles.filter(p => p.isAvailable && p.currentVavaCount < p.maxVavas);
  }, [profiles]);

  const verifiedNunus = useMemo(() => {
    return profiles.filter(p => p.type === 'verified');
  }, [profiles]);

  return {
    profiles,
    availableNunus,
    verifiedNunus,
    isReady,
    getProfileByUserId: (userId: string) => profiles.find(p => p.userId === userId) ?? null,
    getProfilesByLevel: (level: string) => profiles.filter(p => p.level === level),
  };
}

/**
 * Hook to get Nunu applications (for admin)
 */
export function useNunuApplications() {
  const [applications, setApplications] = useState<NunuApplication[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Would fetch from BFF endpoint
    setApplications([]);
    setIsReady(true);
  }, []);

  const pendingApplications = useMemo(() => {
    return applications.filter(a => a.status === 'pending');
  }, [applications]);

  return {
    applications,
    pendingApplications,
    isReady,
    getApplicationsByStatus: (status: string) => applications.filter(a => a.status === status),
    getApplicationByUserId: (userId: string) => applications.find(a => a.userId === userId) ?? null,
  };
}
