'use client';

import { useState, useEffect, useMemo } from 'react';

// Local types
export interface Mentorship {
  id: string;
  nunuId: string;
  vavaId: string;
  status: string;
  sessionCount: number;
  months?: string[];
}

export interface MentorshipWithRelations extends Mentorship {
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
 * Hook to access user's mentorship data via BFF
 */
export function useMentorships(userId?: string) {
  const [mentorshipsAsNunu, setMentorshipsAsNunu] = useState<MentorshipWithRelations[]>([]);
  const [mentorshipsAsVava, setMentorshipsAsVava] = useState<MentorshipWithRelations[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!userId) return;

    Promise.all([
      fetch(`/api/bff/space/mentorships?userId=${userId}&role=nunu`).then(r => r.json()),
      fetch(`/api/bff/space/mentorships?userId=${userId}&role=vava`).then(r => r.json()),
    ])
      .then(([asNunu, asVava]) => {
        setMentorshipsAsNunu(Array.isArray(asNunu) ? asNunu : []);
        setMentorshipsAsVava(Array.isArray(asVava) ? asVava : []);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch mentorships:', err);
        setIsReady(true);
      });
  }, [userId]);

  const myNunu = useMemo(() => {
    const activeMentorship = mentorshipsAsVava.find(m => m.status === 'active');
    return activeMentorship?.nunu ?? null;
  }, [mentorshipsAsVava]);

  const myVavas = useMemo(() => {
    return mentorshipsAsNunu
      .filter(m => m.status === 'active')
      .map(m => m.vava)
      .filter(Boolean);
  }, [mentorshipsAsNunu]);

  const activeVavaCount = useMemo(() => {
    return mentorshipsAsNunu.filter(m => m.status === 'active').length;
  }, [mentorshipsAsNunu]);

  const totalSessionsAsNunu = useMemo(() => {
    return mentorshipsAsNunu.reduce((sum, m) => sum + m.sessionCount, 0);
  }, [mentorshipsAsNunu]);

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
    isReady,
    hasNunu: myNunu !== null,
    hasVavas: myVavas.length > 0,
  };
}

/**
 * Hook to get all mentorships (for admin)
 */
export function useAllMentorships() {
  const [mentorships, setMentorships] = useState<MentorshipWithRelations[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch('/api/bff/space/mentorships')
      .then(r => r.json())
      .then(data => {
        setMentorships(Array.isArray(data) ? data : []);
        setIsReady(true);
      })
      .catch(err => {
        console.error('Failed to fetch all mentorships:', err);
        setIsReady(true);
      });
  }, []);

  const activeMentorships = useMemo(() => {
    return mentorships.filter(m => m.status === 'active');
  }, [mentorships]);

  return {
    mentorships,
    activeMentorships,
    isReady,
    getMentorshipsByNunu: (nunuId: string) => mentorships.filter(m => m.nunuId === nunuId),
    getMentorshipsByVava: (vavaId: string) => mentorships.filter(m => m.vavaId === vavaId),
    getMentorshipsByStatus: (status: string) => mentorships.filter(m => m.status === status),
  };
}

/**
 * Hook to get a specific mentorship
 */
export function useMentorship(mentorshipId: string): MentorshipWithRelations | null {
  const { mentorships, isReady } = useAllMentorships();

  if (!isReady) return null;
  return mentorships.find(m => m.id === mentorshipId) || null;
}
