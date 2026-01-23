'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UsersIcon, ChevronRightIcon } from '@/components/icons';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useDBContext } from '@/lib/db';
import {
  useMentorshipAgreements,
  useNunuEarnings,
  useVavaSpending,
} from '@/lib/db/hooks/useMentorshipAgreements';
import { cn } from '@/lib/utils';
import { formatDateCompact } from '@/lib/utils/date';
import { getStatusBadge } from '@/features/space/types';

function formatCurrency(amount: number): string {
  return `NT$${amount.toLocaleString()}`;
}

function formatMonths(months: string[]): string {
  if (months.length === 0) return 'N/A';
  if (months.length === 1) {
    const date = new Date(months[0] + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  const first = new Date(months[0] + '-01');
  const last = new Date(months[months.length - 1] + '-01');
  return `${first.toLocaleDateString('en-US', { month: 'short' })} - ${last.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
}

function getAgreementStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return { label: 'Pending', color: 'bg-yellow-500/20 text-yellow-400' };
    case 'accepted':
      return { label: 'Accepted', color: 'bg-blue-500/20 text-blue-400' };
    case 'active':
      return { label: 'Active', color: 'bg-green-500/20 text-green-400' };
    case 'completed':
      return { label: 'Completed', color: 'bg-neutral-500/20 text-neutral-400' };
    case 'cancelled':
      return { label: 'Cancelled', color: 'bg-red-500/20 text-red-400' };
    default:
      return { label: status, color: 'bg-neutral-500/20 text-neutral-400' };
  }
}

function getPaymentStatusBadge(status: string) {
  switch (status) {
    case 'paid':
      return { label: 'Paid', color: 'text-green-400' };
    case 'unpaid':
      return { label: 'Unpaid', color: 'text-yellow-400' };
    case 'refunded':
      return { label: 'Refunded', color: 'text-red-400' };
    default:
      return { label: status, color: 'text-neutral-400' };
  }
}

export default function MySpacePage() {
  const { user, identity } = useAuth();
  const { db, isReady } = useDBContext();

  // Space is now open to all logged-in users (Explorer+)
  const hasSpaceAccess = identity !== 'guest';

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

  // Get marketplace agreements (as Nunu and as Vava)
  const { agreements: nunuAgreements } = useMentorshipAgreements({ nunuId: user?.id });
  const { agreements: vavaAgreements } = useMentorshipAgreements({ vavaId: user?.id });

  // Get earnings and spending summaries
  const earnings = useNunuEarnings(user?.id);
  const spending = useVavaSpending(user?.id);

  // Check if user is a Nunu
  const isNunu = useMemo(() => {
    if (!db || !user) return false;
    const profile = db.nunuProfiles.findFirst({ where: { userId: user.id } });
    return !!profile;
  }, [db, user]);

  if (!user) return null;

  if (!hasSpaceAccess) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-white">My Space</h1>
          <p className="text-neutral-400 mt-1">Connect with learning companions.</p>
        </div>

        {/* Login Prompt */}
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
            <UsersIcon size="lg" className="w-10 h-10 text-primary-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Sign In to Access Space</h2>
          <p className="text-neutral-400 max-w-md mx-auto mb-6">
            Sign in to connect with learning companions. Find a Nunu mentor to guide your journey and
            Vava companions to learn alongside.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/space"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
            >
              Explore Space
              <ChevronRightIcon size="sm" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const hasAgreements = nunuAgreements.length > 0 || vavaAgreements.length > 0;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Space</h1>
          <p className="text-neutral-400 mt-1">Manage your mentorships and marketplace activity.</p>
        </div>
        <Link
          href="/space"
          className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
        >
          Browse Marketplace
        </Link>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Earnings Card (for Nunus) */}
        {isNunu && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm text-neutral-400">Total Earnings</h3>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(earnings.totalEarnings)}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-semibold text-white">{earnings.totalMonths}</p>
                <p className="text-xs text-neutral-500">Months Sold</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{earnings.activeAgreements}</p>
                <p className="text-xs text-neutral-500">Active</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{earnings.completedAgreements}</p>
                <p className="text-xs text-neutral-500">Completed</p>
              </div>
            </div>
            {earnings.pendingPayments > 0 && (
              <div className="mt-4 pt-4 border-t border-green-500/20 text-sm text-yellow-400">
                {formatCurrency(earnings.pendingPayments)} pending payment
              </div>
            )}
          </div>
        )}

        {/* Spending Card (for Vavas) */}
        <div className={cn(
          "bg-gradient-to-br from-primary-500/10 to-accent-500/10 rounded-xl border border-primary-500/20 p-6",
          !isNunu && "md:col-span-2"
        )}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm text-neutral-400">My Purchases</h3>
              <p className="text-2xl font-bold text-primary-400">{formatCurrency(spending.totalSpent)}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-white">{spending.totalMonths}</p>
              <p className="text-xs text-neutral-500">Months Bought</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{spending.activeAgreements}</p>
              <p className="text-xs text-neutral-500">Active</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-white">{spending.completedAgreements}</p>
              <p className="text-xs text-neutral-500">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Purchases (as Vava) */}
      {vavaAgreements.length > 0 && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-white">My Purchased Mentorships</h2>
            <p className="text-sm text-neutral-400">Mentorships you've purchased from Nunus</p>
          </div>
          <div className="divide-y divide-neutral-800">
            {vavaAgreements.map((agreement) => {
              const statusBadge = getAgreementStatusBadge(agreement.status);
              const paymentBadge = getPaymentStatusBadge(agreement.paymentStatus);
              return (
                <div key={agreement.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-amber-500/30 flex-shrink-0">
                    {agreement.nunu?.avatar ? (
                      <Image
                        src={agreement.nunu.avatar}
                        alt={agreement.nunu.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white font-semibold">
                        {agreement.nunu?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white">{agreement.nunu?.name || 'Unknown Nunu'}</p>
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', statusBadge.color)}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 truncate">
                      {agreement.post?.title || 'Mentorship Agreement'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatMonths(agreement.agreedMonths)} • {formatCurrency(agreement.agreedPrice)}/mo
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-white">{formatCurrency(agreement.totalAmount)}</p>
                    <p className={cn('text-xs', paymentBadge.color)}>{paymentBadge.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* My Sales (as Nunu) */}
      {isNunu && nunuAgreements.length > 0 && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <h2 className="text-lg font-semibold text-white">My Sold Mentorships</h2>
            <p className="text-sm text-neutral-400">Vavas who purchased your mentorship</p>
          </div>
          <div className="divide-y divide-neutral-800">
            {nunuAgreements.map((agreement) => {
              const statusBadge = getAgreementStatusBadge(agreement.status);
              const paymentBadge = getPaymentStatusBadge(agreement.paymentStatus);
              return (
                <div key={agreement.id} className="p-4 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/30 flex-shrink-0">
                    {agreement.vava?.avatar ? (
                      <Image
                        src={agreement.vava.avatar}
                        alt={agreement.vava.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-semibold">
                        {agreement.vava?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-white">{agreement.vava?.name || 'Unknown Vava'}</p>
                      <span className={cn('px-2 py-0.5 rounded text-xs font-medium', statusBadge.color)}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-400 truncate">
                      {agreement.post?.title || 'Mentorship Agreement'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatMonths(agreement.agreedMonths)} • {formatCurrency(agreement.agreedPrice)}/mo
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-green-400">+{formatCurrency(agreement.totalAmount)}</p>
                    <p className={cn('text-xs', paymentBadge.color)}>{paymentBadge.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State for No Agreements */}
      {!hasAgreements && (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-neutral-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-white mb-2">No Marketplace Activity Yet</h3>
          <p className="text-neutral-500 mb-6 max-w-md mx-auto">
            {isNunu
              ? "You haven't sold any mentorships yet. Create a post on the marketplace to find Vavas!"
              : "You haven't purchased any mentorships yet. Browse the marketplace to find your Nunu mentor!"}
          </p>
          <Link
            href="/space"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition-colors"
          >
            {isNunu ? 'Create a Post' : 'Find a Nunu'}
            <ChevronRightIcon size="sm" />
          </Link>
        </div>
      )}

      {/* Legacy Mentorships Section (from old system) */}
      {(mentorships.asNunu.length > 0 || mentorships.asVava.length > 0) && (
        <>
          <div className="border-t border-neutral-800 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">Legacy Mentorships</h2>
          </div>

          {/* My Nunu (Mentor) */}
          {mentorships.asVava.length > 0 && (
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <h2 className="text-lg font-semibold text-white">My Nunu</h2>
                <p className="text-sm text-neutral-400">Your learning mentor</p>
              </div>
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
                          Matched on {formatDateCompact(mentorship.startedAt)}
                        </p>
                      </div>
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium', status.color)}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* My Vava (Mentees) */}
          {mentorships.asNunu.length > 0 && (
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
              <div className="p-6 border-b border-neutral-800">
                <h2 className="text-lg font-semibold text-white">My Vava</h2>
                <p className="text-sm text-neutral-400">Companions you're mentoring</p>
              </div>
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
                          Matched on {formatDateCompact(mentorship.startedAt)}
                        </p>
                      </div>
                      <span className={cn('px-3 py-1 rounded-full text-xs font-medium', status.color)}>
                        {status.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
