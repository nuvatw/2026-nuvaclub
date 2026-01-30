'use client';

import { useState, useEffect, useMemo } from 'react';

import type { Mentorship as BaseMentorship } from '@/features/space/types';

export type Mentorship = BaseMentorship;

export interface MentorshipWithRelations extends Mentorship {
  // BaseMentorship already has basic nunu and vava sub-structures,
  // but we can keep the specialized ones here if they have extra fields.
  // Actually, let's just make sure they match what's expected.
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
