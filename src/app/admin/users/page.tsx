'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useDBContext } from '@/lib/db';
import {
  SpinnerIcon,
  UsersIcon,
  SearchIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface UserWithRelations {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  identityType: string;
  isNunu: boolean;
  nunuLevel?: string;
  nunuType?: string;
  vavas: Array<{ id: string; name: string; avatar?: string }>;
  nunu?: { id: string; name: string; avatar?: string };
}

export default function AdminUsersPage() {
  const { db, isReady } = useDBContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'nunus' | 'vavas'>('all');

  // Build user data with relationships
  const users = useMemo((): UserWithRelations[] => {
    if (!db || !isReady) return [];

    const allUsers = db.users.findAll();
    const mentorships = db.userMentorships.findAll();
    const nunuProfiles = db.nunuProfiles.findAll();

    // Map user IDs to their Nunu profiles
    const nunuProfilesByUserId = new Map(
      nunuProfiles.map((p) => [p.userId, p])
    );

    // Build mentorship relationships
    // nunuId -> vavaIds
    const nunuToVavas = new Map<string, string[]>();
    // vavaId -> nunuId
    const vavaToNunu = new Map<string, string>();

    for (const mentorship of mentorships) {
      if (mentorship.status === 'active') {
        if (!nunuToVavas.has(mentorship.nunuId)) {
          nunuToVavas.set(mentorship.nunuId, []);
        }
        nunuToVavas.get(mentorship.nunuId)!.push(mentorship.vavaId);
        vavaToNunu.set(mentorship.vavaId, mentorship.nunuId);
      }
    }

    // Build user map for quick lookups
    const userMap = new Map(allUsers.map((u) => [u.id, u]));

    return allUsers.map((user) => {
      const nunuProfile = nunuProfilesByUserId.get(user.id);
      const vavaIds = nunuToVavas.get(user.id) || [];
      const nunuId = vavaToNunu.get(user.id);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        identityType: user.identityType,
        isNunu: !!nunuProfile,
        nunuLevel: nunuProfile?.level,
        nunuType: nunuProfile?.type,
        vavas: vavaIds.map((id) => {
          const vavaUser = userMap.get(id);
          return vavaUser
            ? { id: vavaUser.id, name: vavaUser.name, avatar: vavaUser.avatar }
            : { id, name: 'Unknown', avatar: undefined };
        }),
        nunu: nunuId
          ? (() => {
              const nunuUser = userMap.get(nunuId);
              return nunuUser
                ? { id: nunuUser.id, name: nunuUser.name, avatar: nunuUser.avatar }
                : { id: nunuId, name: 'Unknown', avatar: undefined };
            })()
          : undefined,
      };
    });
  }, [db, isReady]);

  // Filter and search users
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by type
    if (filterType === 'nunus') {
      result = result.filter((u) => u.isNunu);
    } else if (filterType === 'vavas') {
      result = result.filter((u) => u.nunu !== undefined);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.id.toLowerCase().includes(query)
      );
    }

    return result;
  }, [users, filterType, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const nunus = users.filter((u) => u.isNunu).length;
    const vavasWithNunu = users.filter((u) => u.nunu !== undefined).length;
    const totalMentorships = users.reduce((acc, u) => acc + u.vavas.length, 0);

    return { total: users.length, nunus, vavasWithNunu, totalMentorships };
  }, [users]);

  if (!isReady) {
    return (
      <div className="flex justify-center py-12">
        <SpinnerIcon size="lg" className="text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">User Directory</h1>
        <p className="text-neutral-400 mt-1">View all users and their Nunu/Vava relationships</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-neutral-400">Total Users</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-amber-400">{stats.nunus}</div>
          <div className="text-sm text-neutral-400">Active Nunus</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-green-400">{stats.vavasWithNunu}</div>
          <div className="text-sm text-neutral-400">Vavas with Nunu</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-2xl font-bold text-blue-400">{stats.totalMentorships}</div>
          <div className="text-sm text-neutral-400">Active Mentorships</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size="md" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filterType === 'all'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('nunus')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filterType === 'nunus'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            Nunus Only
          </button>
          <button
            onClick={() => setFilterType('vavas')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              filterType === 'vavas'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            Vavas Only
          </button>
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            No users found matching your criteria.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-neutral-700 shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-white">{user.name}</span>
                    {user.isNunu && (
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        user.nunuType === 'verified'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-neutral-700 text-neutral-300'
                      )}>
                        Nunu {user.nunuLevel}
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-700 text-neutral-400">
                      {user.identityType}
                    </span>
                  </div>
                  <div className="text-sm text-neutral-500 truncate">{user.email}</div>
                  <div className="text-xs text-neutral-600">{user.id}</div>

                  {/* Relationships */}
                  <div className="mt-3 flex flex-wrap gap-4 text-sm">
                    {/* Their Nunu */}
                    {user.nunu && (
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Nunu:</span>
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-amber-500/50">
                            {user.nunu.avatar ? (
                              <img src={user.nunu.avatar} alt={user.nunu.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-amber-600 flex items-center justify-center text-white text-xs font-semibold">
                                {user.nunu.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          <span className="text-amber-400">{user.nunu.name}</span>
                        </div>
                      </div>
                    )}

                    {/* Their Vavas */}
                    {user.vavas.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-500">Vavas ({user.vavas.length}):</span>
                        <div className="flex items-center -space-x-1">
                          {user.vavas.slice(0, 5).map((vava) => (
                            <div
                              key={vava.id}
                              className="w-5 h-5 rounded-full overflow-hidden ring-1 ring-green-500/50"
                              title={vava.name}
                            >
                              {vava.avatar ? (
                                <img src={vava.avatar} alt={vava.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-green-600 flex items-center justify-center text-white text-xs font-semibold">
                                  {vava.name.charAt(0)}
                                </div>
                              )}
                            </div>
                          ))}
                          {user.vavas.length > 5 && (
                            <div className="w-5 h-5 rounded-full bg-neutral-700 flex items-center justify-center text-neutral-400 text-xs ring-1 ring-neutral-600">
                              +{user.vavas.length - 5}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* No relationships */}
                    {!user.nunu && user.vavas.length === 0 && !user.isNunu && (
                      <span className="text-neutral-600">No active mentorship relationships</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Results count */}
      <div className="text-sm text-neutral-500">
        Showing {filteredUsers.length} of {users.length} users
      </div>
    </div>
  );
}
