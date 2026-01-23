'use client';

import { useMemo } from 'react';
import { useDB } from '../provider/DBProvider';
import type { UserMentorshipRecord, MentorshipStatus, NunuProfileRecord } from '../schema';
import { NUNU_LEVEL_CONFIG } from '../schema';

export interface MentorshipWithRelations extends UserMentorshipRecord {
  nunu?: {
    id: string;
    name: string;
    avatar?: string;
    level?: string;
    type?: string;
    discordId?: string;
    githubUsername?: string;
  };
  vava?: {
    id: string;
    name: string;
    avatar?: string;
    discordId?: string;
    githubUsername?: string;
  };
}

/**
 * Hook to access user's mentorship data (both as Nunu and as Vava) - optimized with batch lookups
 */
export function useMentorships(userId?: string) {
  const db = useDB();

  // Get mentorships where user is the Nunu (mentor) - batch lookup vavas
  const mentorshipsAsNunu = useMemo((): MentorshipWithRelations[] => {
    if (!db || !userId) return [];

    const mentorships = db.userMentorships.findMany({ where: { nunuId: userId } });

    // Batch fetch all vava users
    const vavaIds = new Set(mentorships.map((m) => m.vavaId));
    const vavasMap = new Map<string, { id: string; name: string; avatar?: string; discordId?: string; githubUsername?: string }>();
    for (const vavaId of vavaIds) {
      const user = db.users.findById(vavaId);
      if (user) {
        vavasMap.set(vavaId, { id: user.id, name: user.name, avatar: user.avatar, discordId: user.discordId, githubUsername: user.githubUsername });
      }
    }

    return mentorships.map((m) => ({
      ...m,
      vava: vavasMap.get(m.vavaId),
    }));
  }, [db, userId]);

  // Get mentorships where user is the Vava (learner) - batch lookup nunus
  const mentorshipsAsVava = useMemo((): MentorshipWithRelations[] => {
    if (!db || !userId) return [];

    const mentorships = db.userMentorships.findMany({ where: { vavaId: userId } });

    // Batch fetch all nunu users and profiles
    const nunuIds = new Set(mentorships.map((m) => m.nunuId));
    const nunusMap = new Map<string, { id: string; name: string; avatar?: string; discordId?: string; githubUsername?: string }>();
    const profilesMap = new Map<string, { level?: string; type?: string }>();

    for (const nunuId of nunuIds) {
      const user = db.users.findById(nunuId);
      if (user) {
        nunusMap.set(nunuId, { id: user.id, name: user.name, avatar: user.avatar, discordId: user.discordId, githubUsername: user.githubUsername });
      }
      const profile = db.nunuProfiles.findFirst({ where: { userId: nunuId } });
      if (profile) {
        profilesMap.set(nunuId, { level: profile.level, type: profile.type });
      }
    }

    return mentorships.map((m) => {
      const nunuUser = nunusMap.get(m.nunuId);
      const nunuProfile = profilesMap.get(m.nunuId);
      return {
        ...m,
        nunu: nunuUser
          ? {
              ...nunuUser,
              level: nunuProfile?.level,
              type: nunuProfile?.type,
            }
          : undefined,
      };
    });
  }, [db, userId]);

  // Get user's current Nunu (mentor)
  const myNunu = useMemo(() => {
    const activeMentorship = mentorshipsAsVava.find((m) => m.status === 'active');
    return activeMentorship?.nunu ?? null;
  }, [mentorshipsAsVava]);

  // Get user's current Vavas (learners)
  const myVavas = useMemo(() => {
    return mentorshipsAsNunu
      .filter((m) => m.status === 'active')
      .map((m) => m.vava)
      .filter(Boolean);
  }, [mentorshipsAsNunu]);

  // Get active mentorship count as Nunu
  const activeVavaCount = useMemo(() => {
    return mentorshipsAsNunu.filter((m) => m.status === 'active').length;
  }, [mentorshipsAsNunu]);

  // Get total session count as Nunu
  const totalSessionsAsNunu = useMemo(() => {
    return mentorshipsAsNunu.reduce((sum, m) => sum + m.sessionCount, 0);
  }, [mentorshipsAsNunu]);

  // Get total session count as Vava
  const totalSessionsAsVava = useMemo(() => {
    return mentorshipsAsVava.reduce((sum, m) => sum + m.sessionCount, 0);
  }, [mentorshipsAsVava]);

  return {
    mentorshipsAsNunu,
    mentorshipsAsVava,
    myNunu,
    myVavas,
    activeVavaCount,
    totalSessionsAsNunu,
    totalSessionsAsVava,
    isReady: !!db,
    hasNunu: myNunu !== null,
    hasVavas: myVavas.length > 0,
  };
}

/**
 * Hook to get all mentorships (for admin dashboard) - optimized with batch lookups
 */
export function useAllMentorships() {
  const db = useDB();

  const mentorships = useMemo((): MentorshipWithRelations[] => {
    if (!db) return [];

    const allMentorships = db.userMentorships.findAll();

    // Batch fetch all unique users and profiles
    const userIds = new Set<string>();
    const nunuIds = new Set<string>();
    for (const m of allMentorships) {
      userIds.add(m.nunuId);
      userIds.add(m.vavaId);
      nunuIds.add(m.nunuId);
    }

    const usersMap = new Map<string, { id: string; name: string; avatar?: string; discordId?: string; githubUsername?: string }>();
    for (const id of userIds) {
      const user = db.users.findById(id);
      if (user) {
        usersMap.set(id, { id: user.id, name: user.name, avatar: user.avatar, discordId: user.discordId, githubUsername: user.githubUsername });
      }
    }

    const profilesMap = new Map<string, { level?: string; type?: string }>();
    for (const nunuId of nunuIds) {
      const profile = db.nunuProfiles.findFirst({ where: { userId: nunuId } });
      if (profile) {
        profilesMap.set(nunuId, { level: profile.level, type: profile.type });
      }
    }

    return allMentorships.map((m) => {
      const nunuUser = usersMap.get(m.nunuId);
      const vavaUser = usersMap.get(m.vavaId);
      const nunuProfile = profilesMap.get(m.nunuId);

      return {
        ...m,
        nunu: nunuUser
          ? {
              ...nunuUser,
              level: nunuProfile?.level,
              type: nunuProfile?.type,
            }
          : undefined,
        vava: vavaUser,
      };
    });
  }, [db]);

  const activeMentorships = useMemo(() => {
    return mentorships.filter((m) => m.status === 'active');
  }, [mentorships]);

  return {
    mentorships,
    activeMentorships,
    isReady: !!db,
    getMentorshipsByNunu: (nunuId: string) => mentorships.filter((m) => m.nunuId === nunuId),
    getMentorshipsByVava: (vavaId: string) => mentorships.filter((m) => m.vavaId === vavaId),
    getMentorshipsByStatus: (status: MentorshipStatus) =>
      mentorships.filter((m) => m.status === status),
  };
}

/**
 * Hook to get a specific mentorship
 */
export function useMentorship(mentorshipId: string): MentorshipWithRelations | null {
  const db = useDB();

  return useMemo(() => {
    if (!db) return null;

    const mentorship = db.userMentorships.findById(mentorshipId);
    if (!mentorship) return null;

    const nunuUser = db.users.findById(mentorship.nunuId);
    const vavaUser = db.users.findById(mentorship.vavaId);
    const nunuProfile = db.nunuProfiles.findFirst({ where: { userId: mentorship.nunuId } });

    return {
      ...mentorship,
      nunu: nunuUser
        ? {
            id: nunuUser.id,
            name: nunuUser.name,
            avatar: nunuUser.avatar,
            level: nunuProfile?.level,
            type: nunuProfile?.type,
            discordId: nunuUser.discordId,
            githubUsername: nunuUser.githubUsername,
          }
        : undefined,
      vava: vavaUser
        ? {
            id: vavaUser.id,
            name: vavaUser.name,
            avatar: vavaUser.avatar,
            discordId: vavaUser.discordId,
            githubUsername: vavaUser.githubUsername,
          }
        : undefined,
    };
  }, [db, mentorshipId]);
}
