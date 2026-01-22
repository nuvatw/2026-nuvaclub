'use client';

import { useMemo, useCallback } from 'react';
import { useDB } from '../provider/DBProvider';
import type {
  NunuApplicationRecord,
  NunuProfileRecord,
  NunuApplicationStatus,
  NunuLevel,
  NunuApplicationSituationalAnswers,
} from '../schema';
import { NUNU_LEVEL_MAX_VAVAS } from '../schema';

export interface SubmitApplicationData {
  applicationText: string;
  expertise: string[];
  discordId: string;
  introVideoUrl?: string;
  introVideoFileName?: string;
  situationalAnswers: NunuApplicationSituationalAnswers;
}

export interface NunuApplicationWithUser extends NunuApplicationRecord {
  userName?: string;
  userAvatar?: string;
}

export interface NunuProfileWithUser extends NunuProfileRecord {
  userName?: string;
  userAvatar?: string;
  maxVavas: number;
}

/**
 * Hook to access Nunu application and profile data
 */
export function useNunuProfile(userId?: string) {
  const db = useDB();

  // Get user's Nunu application
  const application = useMemo((): NunuApplicationWithUser | null => {
    if (!db || !userId) return null;

    const apps = db.nunuApplications.findMany({ where: { userId } });
    if (apps.length === 0) return null;

    // Get the most recent application
    const app = apps.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    )[0];

    // Enrich with user data
    const user = db.users.findById(userId);
    return {
      ...app,
      userName: user?.name,
      userAvatar: user?.avatar,
    };
  }, [db, userId]);

  // Get user's Nunu profile (if approved)
  const profile = useMemo((): NunuProfileWithUser | null => {
    if (!db || !userId) return null;

    const profiles = db.nunuProfiles.findMany({ where: { userId } });
    if (profiles.length === 0) return null;

    const profileData = profiles[0];

    // Enrich with user data and max vavas
    const user = db.users.findById(userId);
    return {
      ...profileData,
      userName: user?.name,
      userAvatar: user?.avatar,
      maxVavas: NUNU_LEVEL_MAX_VAVAS[profileData.level],
    };
  }, [db, userId]);

  // Check if user is a Nunu
  const isNunu = useMemo(() => {
    return profile !== null && profile.isAvailable !== false;
  }, [profile]);

  // Check if user is a verified Nunu
  const isVerifiedNunu = useMemo(() => {
    return profile?.type === 'verified';
  }, [profile]);

  // Check if user can accept more Vavas
  const canAcceptMoreVavas = useMemo(() => {
    if (!profile) return false;
    return profile.currentVavaCount < profile.maxVavas;
  }, [profile]);

  // Get available slots
  const availableSlots = useMemo(() => {
    if (!profile) return 0;
    return Math.max(profile.maxVavas - profile.currentVavaCount, 0);
  }, [profile]);

  // Get application status
  const applicationStatus = useMemo((): NunuApplicationStatus | null => {
    return application?.status ?? null;
  }, [application]);

  // Submit a new application
  const submitApplication = useCallback(
    async (data: SubmitApplicationData): Promise<NunuApplicationRecord> => {
      if (!db || !userId) {
        throw new Error('Database not available or user not logged in');
      }

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const now = new Date();
      const newApplication: NunuApplicationRecord = {
        id: `app_${Date.now()}`,
        userId,
        status: 'pending',
        applicationText: data.applicationText,
        expertise: data.expertise,
        discordId: data.discordId,
        introVideoUrl: data.introVideoUrl,
        introVideoFileName: data.introVideoFileName,
        situationalAnswers: data.situationalAnswers,
        submittedAt: now,
        createdAt: now,
        updatedAt: now,
      };

      // In production, this would call the actual API
      // For now, we'll just return the mock application
      // The database would be updated via the mock DB
      db.nunuApplications.create(newApplication);

      return newApplication;
    },
    [db, userId]
  );

  return {
    application,
    profile,
    isNunu,
    isVerifiedNunu,
    canAcceptMoreVavas,
    availableSlots,
    applicationStatus,
    submitApplication,
    isReady: !!db,
  };
}

/**
 * Hook to get all Nunu profiles (for matching board)
 */
export function useNunuProfiles() {
  const db = useDB();

  const profiles = useMemo((): NunuProfileWithUser[] => {
    if (!db) return [];

    const allProfiles = db.nunuProfiles.findAll();

    return allProfiles.map((profile) => {
      const user = db.users.findById(profile.userId);
      return {
        ...profile,
        userName: user?.name,
        userAvatar: user?.avatar,
        maxVavas: NUNU_LEVEL_MAX_VAVAS[profile.level],
      };
    });
  }, [db]);

  const availableNunus = useMemo(() => {
    return profiles.filter((p) => p.isAvailable && p.currentVavaCount < p.maxVavas);
  }, [profiles]);

  const verifiedNunus = useMemo(() => {
    return profiles.filter((p) => p.type === 'verified');
  }, [profiles]);

  return {
    profiles,
    availableNunus,
    verifiedNunus,
    isReady: !!db,
    getProfileByUserId: (userId: string) => profiles.find((p) => p.userId === userId) ?? null,
    getProfilesByLevel: (level: NunuLevel) => profiles.filter((p) => p.level === level),
  };
}

/**
 * Hook to get Nunu applications (for admin)
 */
export function useNunuApplications() {
  const db = useDB();

  const applications = useMemo((): NunuApplicationWithUser[] => {
    if (!db) return [];

    const allApps = db.nunuApplications.findAll();

    return allApps.map((app) => {
      const user = db.users.findById(app.userId);
      return {
        ...app,
        userName: user?.name,
        userAvatar: user?.avatar,
      };
    });
  }, [db]);

  const pendingApplications = useMemo(() => {
    return applications.filter((a) => a.status === 'pending');
  }, [applications]);

  return {
    applications,
    pendingApplications,
    isReady: !!db,
    getApplicationsByStatus: (status: NunuApplicationStatus) =>
      applications.filter((a) => a.status === status),
    getApplicationByUserId: (userId: string) =>
      applications.find((a) => a.userId === userId) ?? null,
  };
}
