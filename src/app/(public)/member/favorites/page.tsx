'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { cn } from '@/lib/utils';
import { formatDateCompact } from '@/lib/utils/date';

type TabType = 'all' | 'course' | 'post' | 'product';

const TABS: { key: TabType; label: string; icon: React.ReactNode }[] = [
  {
    key: 'all',
    label: 'All',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    key: 'course',
    label: 'Courses',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    key: 'post',
    label: 'Posts',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
  },
  {
    key: 'product',
    label: 'Products',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
  },
];

interface FavoriteItem {
  id: string;
  type: string;
  itemId: string;
  addedAt: string | Date;
  title: string;
  subtitle: string;
  thumbnail?: string;
  href: string;
  meta?: string;
}

export default function FavoritesPage() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Get favorites from BFF
  useEffect(() => {
    if (!user) return;

    let mounted = true;
    fetch(`/api/bff/member/favorites?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setFavorites(data);
          setIsLoading(false);
        }
      })
      .catch(err => console.error('Failed to fetch favorites', err));

    return () => { mounted = false; };
  }, [user]);

  // Filter by tab
  const filteredFavorites = useMemo(() => {
    if (activeTab === 'all') return favorites;
    return favorites.filter(f => f.type === activeTab);
  }, [favorites, activeTab]);

  // Counts by type
  const counts = useMemo(() => {
    return {
      all: favorites.length,
      course: favorites.filter(f => f.type === 'course').length,
      post: favorites.filter(f => f.type === 'post').length,
      product: favorites.filter(f => f.type === 'product').length,
    };
  }, [favorites]);

  const removeFavorite = async (id: string) => {
    try {
      const response = await fetch(`/api/bff/member/favorites?favoriteId=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFavorites(prev => prev.filter(f => f.id !== id));
      }
    } catch (error) {
      console.error('Failed to remove favorite', error);
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Favorites</h1>
        <p className="text-neutral-400 mt-1">Courses, posts, and products you've saved for later.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-neutral-800 pb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-primary-500/10 text-primary-400'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
            <span className={cn(
              'px-1.5 py-0.5 rounded text-xs',
              activeTab === tab.key
                ? 'bg-primary-500/20 text-primary-400'
                : 'bg-neutral-800 text-neutral-500'
            )}>
              {counts[tab.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Favorites List */}
      {filteredFavorites.length === 0 ? (
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-12 text-center">
          <svg className="w-16 h-16 text-neutral-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-semibold text-white mb-2">No favorites yet</h3>
          <p className="text-neutral-400 mb-4">
            {activeTab === 'course'
              ? 'Save courses you want to watch later.'
              : activeTab === 'post'
                ? 'Bookmark interesting forum posts to read later.'
                : activeTab === 'product'
                  ? 'Save products you want to purchase later.'
                  : 'Start saving items to access them quickly.'}
          </p>
          <Link
            href={activeTab === 'course' ? '/learn' : activeTab === 'post' ? '/forum' : activeTab === 'product' ? '/shop' : '/'}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
          >
            Browse {activeTab === 'all' ? 'Content' : activeTab === 'course' ? 'Courses' : activeTab === 'post' ? 'Forum' : 'Shop'}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFavorites.map((item) => (
            <div
              key={item.id}
              className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden hover:border-neutral-700 transition-colors group"
            >
              <div className="flex">
                {/* Thumbnail */}
                {item.thumbnail && (
                  <div className="w-32 h-24 shrink-0">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 p-4 flex items-start justify-between gap-4">
                  <Link href={item.href} className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium capitalize',
                        item.type === 'course' && 'bg-primary-500/10 text-primary-400',
                        item.type === 'post' && 'bg-green-500/10 text-green-400',
                        item.type === 'product' && 'bg-amber-500/10 text-amber-400'
                      )}>
                        {item.type}
                      </span>
                      <span className="text-xs text-neutral-500">Saved {formatDateCompact(new Date(item.addedAt))}</span>
                    </div>
                    <h3 className="font-semibold text-white group-hover:text-primary-400 transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1 line-clamp-1">{item.subtitle}</p>
                    {item.meta && (
                      <p className="text-sm text-neutral-500 mt-2">{item.meta}</p>
                    )}
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => removeFavorite(item.id)}
                      className="p-2 rounded-lg text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
