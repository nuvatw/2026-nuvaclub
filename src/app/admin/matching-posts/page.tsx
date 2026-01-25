'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { useMatchingPosts } from '@/lib/db/hooks/useMatchingPosts';
import { Button } from '@/components/atoms';
import {
  TrashIcon,
  RefreshIcon,
  SpinnerIcon,
  SearchIcon,
  CheckIcon,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export default function AdminMatchingPostsPage() {
  const { currentAccountId } = useAuth();
  const { posts, isReady } = useMatchingPosts();
  const [deletedPostIds, setDeletedPostIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'nunu-looking-for-vava' | 'vava-looking-for-nunu'>('all');

  // Fetch deleted post IDs
  const fetchDeletedPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/matching-posts', {
        headers: { 'x-admin-user': currentAccountId },
      });
      if (!response.ok) throw new Error('Failed to fetch deleted posts');
      const data = await response.json();
      setDeletedPostIds(data.deletedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedPosts();
  }, [currentAccountId]);

  // Delete a post
  const handleDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this matching post? This will hide it from users.')) return;
    try {
      setActionLoading(postId);
      const response = await fetch(`/api/admin/matching-posts?postId=${postId}`, {
        method: 'DELETE',
        headers: { 'x-admin-user': currentAccountId },
      });
      if (!response.ok) throw new Error('Failed to delete post');
      await fetchDeletedPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setActionLoading(null);
    }
  };

  // Restore a post
  const handleRestore = async (postId: string) => {
    try {
      setActionLoading(postId);
      const response = await fetch('/api/admin/matching-posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-user': currentAccountId,
        },
        body: JSON.stringify({ postId, action: 'restore' }),
      });
      if (!response.ok) throw new Error('Failed to restore post');
      await fetchDeletedPosts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to restore');
    } finally {
      setActionLoading(null);
    }
  };

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    let result = posts;

    // Filter by type
    if (filterType !== 'all') {
      result = result.filter((p) => p.type === filterType);
    }

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          p.author?.name.toLowerCase().includes(query)
      );
    }

    return result;
  }, [posts, filterType, searchQuery]);

  // Separate active and deleted posts
  const activePosts = filteredPosts.filter((p) => !deletedPostIds.includes(p.id));
  const deletedPosts = filteredPosts.filter((p) => deletedPostIds.includes(p.id));

  if (!isReady || loading) {
    return (
      <div className="flex justify-center py-12">
        <SpinnerIcon size="lg" className="text-amber-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Moderate Matching Board</h1>
          <p className="text-neutral-400 mt-1">Review and delete Find Nunu / Find Vava posts</p>
        </div>
        <Button variant="ghost" onClick={fetchDeletedPosts} className="gap-2">
          <RefreshIcon size="sm" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <SearchIcon size="md" className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-white placeholder-neutral-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              filterType === 'all'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('nunu-looking-for-vava')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              filterType === 'nunu-looking-for-vava'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            Find Vava
          </button>
          <button
            onClick={() => setFilterType('vava-looking-for-nunu')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              filterType === 'vava-looking-for-nunu'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            )}
          >
            Find Nunu
          </button>
        </div>
      </div>

      {/* Active Posts */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-3">
          Active Posts ({activePosts.length})
        </h2>
        <div className="space-y-3">
          {activePosts.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 bg-neutral-900 rounded-xl border border-neutral-800">
              No active posts found.
            </div>
          ) : (
            activePosts.map((post) => (
              <div
                key={post.id}
                className="bg-neutral-900 rounded-xl border border-neutral-800 p-4 hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neutral-700 shrink-0">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-primary-600 flex items-center justify-center text-white font-semibold">
                        {post.author?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-white">{post.title}</span>
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-medium rounded-full',
                        post.type === 'nunu-looking-for-vava'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-green-500/20 text-green-400'
                      )}>
                        {post.type === 'nunu-looking-for-vava' ? 'Find Vava' : 'Find Nunu'}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-400 mt-1 line-clamp-2">
                      {post.content}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neutral-500">
                      <span>By {post.author?.name || 'Unknown'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                      <span>{post.viewCount} views</span>
                      <span>{post.commentCount} comments</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={actionLoading === post.id}
                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Delete post"
                  >
                    {actionLoading === post.id ? (
                      <SpinnerIcon size="sm" />
                    ) : (
                      <TrashIcon size="sm" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Deleted Posts */}
      {deletedPosts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-3">
            Deleted Posts ({deletedPosts.length})
          </h2>
          <div className="space-y-3">
            {deletedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-neutral-900/50 rounded-xl border border-red-500/20 p-4 opacity-75"
              >
                <div className="flex items-start gap-4">
                  {/* Author Avatar */}
                  <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-neutral-700 shrink-0 grayscale">
                    {post.author?.avatar ? (
                      <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-700 flex items-center justify-center text-neutral-400 font-semibold">
                        {post.author?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-neutral-400 line-through">{post.title}</span>
                      <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-red-500/20 text-red-400">
                        Deleted
                      </span>
                    </div>
                    <div className="text-sm text-neutral-500 mt-1 line-clamp-2">
                      {post.content}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-neutral-600">
                      <span>By {post.author?.name || 'Unknown'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Restore Action */}
                  <button
                    onClick={() => handleRestore(post.id)}
                    disabled={actionLoading === post.id}
                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-colors disabled:opacity-50"
                    aria-label="Restore post"
                  >
                    {actionLoading === post.id ? (
                      <SpinnerIcon size="sm" />
                    ) : (
                      <CheckIcon size="sm" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
