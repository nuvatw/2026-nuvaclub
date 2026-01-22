'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useDBContext } from '@/lib/db';
import { cn } from '@/lib/utils';

function formatDate(date: Date | undefined): string {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getCompanionLimit(identity: string): number | 'unlimited' {
  switch (identity) {
    case 'duo-go':
      return 1;
    case 'duo-run':
      return 5;
    case 'duo-fly':
      return 'unlimited';
    default:
      return 0;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'active':
      return { label: 'Active', color: 'bg-green-500/10 text-green-400' };
    case 'pending':
      return { label: 'Pending', color: 'bg-amber-500/10 text-amber-400' };
    case 'completed':
      return { label: 'Completed', color: 'bg-primary-500/10 text-primary-400' };
    default:
      return { label: status, color: 'bg-neutral-500/10 text-neutral-400' };
  }
}

export default function MySpacePage() {
  const { user, identity } = useAuth();
  const { db, isReady } = useDBContext();

  // Check if user has space access
  const hasSpaceAccess = ['duo-go', 'duo-run', 'duo-fly'].includes(identity);
  const companionLimit = getCompanionLimit(identity);

  // Get mentorship relationships
  const mentorships = useMemo(() => {
    if (!isReady || !db || !user) return { asNunu: [], asVava: [] };

    const asNunu = db.userMentorships.findMany({ where: { nunuId: user.id } });
    const asVava = db.userMentorships.findMany({ where: { vavaId: user.id } });

    // Get user details for each relationship
    const asNunuWithUsers = asNunu.map(m => ({
      ...m,
      partner: db.users.findById(m.vavaId),
    }));

    const asVavaWithUsers = asVava.map(m => ({
      ...m,
      partner: db.users.findById(m.nunuId),
    }));

    return { asNunu: asNunuWithUsers, asVava: asVavaWithUsers };
  }, [db, isReady, user]);

  // Get duo ticket info
  const duoTicket = useMemo(() => {
    if (!isReady || !db || !user) return null;
    return db.duoTickets.findFirst({ where: { userId: user.id, status: 'active' } });
  }, [db, isReady, user]);

  if (!user) return null;

  if (!hasSpaceAccess) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">My Space</h1>
          <p className="text-neutral-400 mt-1">Connect with learning companions.</p>
        </div>

        {/* Upgrade Prompt */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
            <svg className="w-10 h-10 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unlock Companion Matching</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-6">
            Get a Duo ticket to connect with learning companions. Find a Nunu mentor to guide your journey and
            Vava companions to learn alongside.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Get Duo Ticket
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/space"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neutral-800 text-white font-medium hover:bg-neutral-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalCompanions = mentorships.asNunu.length + mentorships.asVava.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Space</h1>
          <p className="text-neutral-400 mt-1">Manage your learning companions and mentorships.</p>
        </div>
        <Link
          href="/space"
          className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Find Companions
        </Link>
      </div>

      {/* Duo Ticket Status */}
      {duoTicket && (
        <div className="bg-gradient-to-r from-primary-500/10 to-accent-500/10 rounded-xl border border-primary-500/20 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white capitalize">Duo {duoTicket.ticketType} Ticket</h3>
                <p className="text-sm text-neutral-400">
                  Valid until {formatDate(duoTicket.validUntil)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-neutral-400">Companion Slots</p>
              <p className="text-2xl font-bold text-white">
                {totalCompanions} / {companionLimit === 'unlimited' ? '∞' : companionLimit}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-amber-400">{mentorships.asVava.length}</div>
          <div className="text-sm text-neutral-400 mt-1">My Nunu (Mentor)</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-green-400">{mentorships.asNunu.length}</div>
          <div className="text-sm text-neutral-400 mt-1">My Vava (Mentees)</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-primary-400">
            {mentorships.asNunu.filter(m => m.status === 'active').length +
              mentorships.asVava.filter(m => m.status === 'active').length}
          </div>
          <div className="text-sm text-neutral-400 mt-1">Active Matches</div>
        </div>
      </div>

      {/* My Nunu (Mentor) */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">My Nunu</h2>
              <p className="text-sm text-neutral-400">Your learning mentor</p>
            </div>
            {mentorships.asVava.length === 0 && (
              <Link
                href="/space"
                className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
              >
                Find a Nunu
              </Link>
            )}
          </div>
        </div>

        {mentorships.asVava.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-neutral-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <p className="text-neutral-500">You don't have a Nunu mentor yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {mentorships.asVava.map((mentorship) => {
              const status = getStatusBadge(mentorship.status);
              return (
                <div key={mentorship.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-500/30">
                    {mentorship.partner?.avatar ? (
                      <img src={mentorship.partner.avatar} alt={mentorship.partner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {mentorship.partner?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{mentorship.partner?.name || 'Unknown'}</p>
                    <p className="text-sm text-neutral-400">
                      Matched on {formatDate(mentorship.startedAt)}
                    </p>
                  </div>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-medium', status.color)}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* My Vava (Mentees) */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-6 border-b border-neutral-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">My Vava</h2>
              <p className="text-sm text-neutral-400">Companions you're mentoring</p>
            </div>
            {(companionLimit === 'unlimited' || mentorships.asNunu.length < companionLimit) && (
              <Link
                href="/space"
                className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
              >
                Find Vava
              </Link>
            )}
          </div>
        </div>

        {mentorships.asNunu.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="w-12 h-12 text-neutral-700 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-neutral-500">You're not mentoring any Vava yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800">
            {mentorships.asNunu.map((mentorship) => {
              const status = getStatusBadge(mentorship.status);
              return (
                <div key={mentorship.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/30">
                    {mentorship.partner?.avatar ? (
                      <img src={mentorship.partner.avatar} alt={mentorship.partner.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                        {mentorship.partner?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{mentorship.partner?.name || 'Unknown'}</p>
                    <p className="text-sm text-neutral-400">
                      Matched on {formatDate(mentorship.startedAt)}
                    </p>
                  </div>
                  <span className={cn('px-3 py-1 rounded-full text-xs font-medium', status.color)}>
                    {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
