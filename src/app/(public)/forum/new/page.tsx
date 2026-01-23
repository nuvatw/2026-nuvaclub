'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button, Card, CardContent } from '@/components/atoms';
import { LockIcon, ChevronLeftIcon } from '@/components/icons';
import { PostForm } from '@/features/forum/components/PostForm';
import { useAuth } from '@/features/auth/components/AuthProvider';

function UpgradePrompt() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-4"
      >
        <Card className="text-center">
          <CardContent className="py-12 px-8">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-800 flex items-center justify-center">
              <LockIcon size="lg" className="w-8 h-8 text-neutral-400" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">Upgrade to Unlock Posting</h2>

            <p className="text-neutral-400 mb-8">
              Subscribe to the Solo Traveler plan to post in the forum and share your thoughts and experiences with the community.
            </p>

            <div className="space-y-3">
              <Link href="/pricing" className="block">
                <Button className="w-full" size="lg">
                  View Subscription Plans
                </Button>
              </Link>

              <Link href="/forum" className="block">
                <Button variant="ghost" className="w-full" size="lg">
                  Back to Forum
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
    </div>
  );
}

export default function NewPostPage() {
  const router = useRouter();
  const { hasPermission, user, isLoading } = useAuth();

  const canPost = hasPermission('forum:post');

  const handleSuccess = (postId: string) => {
    router.push(`/forum/${postId}`);
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/forum"
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6"
        >
          <ChevronLeftIcon size="sm" />
          Back to Forum
        </Link>

        {canPost && user ? (
          <>
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold text-white mb-2">Create New Post</h1>
              <p className="text-neutral-400">Share your thoughts, questions, or resources</p>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent>
                  <PostForm
                    authorId={user.id}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <UpgradePrompt />
        )}
      </div>
    </div>
  );
}
