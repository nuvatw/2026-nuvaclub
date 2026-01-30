import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/features/auth/components/AuthProvider';
import { getMembershipDetails } from '@/features/auth/types';
import { Modal, Button } from '@/components/atoms';
import { EditIcon, CheckIcon } from '@/components/icons';
import { cn } from '@/lib/utils';
import { formatDateMedium } from '@/lib/utils/date';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit profile modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    discordId: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    let mounted = true;
    fetch(`/api/bff/member/profile?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (mounted) {
          setProfileData(data);
          setIsLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to fetch profile', err);
        if (mounted) setIsLoading(false);
      });

    return () => { mounted = false; };
  }, [user]);

  const handleOpenEditModal = useCallback(() => {
    if (user) {
      setEditForm({
        name: user.name,
        bio: user.bio || '',
        discordId: user.discordId || '',
      });
      setIsEditModalOpen(true);
    }
  }, [user]);

  const handleSaveProfile = useCallback(async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const response = await fetch('/api/bff/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: editForm.name,
          bio: editForm.bio,
          discordId: editForm.discordId,
        }),
      });

      if (response.ok) {
        setIsEditModalOpen(false);
        // Reload profile data
        const updatedProfile = await response.json();
        setProfileData((prev: any) => ({ ...prev, user: updatedProfile }));
        window.location.reload(); // Still reloading to update AuthContext for now
      }
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setIsSaving(false);
    }
  }, [user, editForm]);

  if (!user || isLoading || !profileData) {
    return null;
  }

  const { subscription, duoTicket, enrollments, favoritesCount } = profileData;
  const identity = profileData.user.identityType;
  const membership = getMembershipDetails(identity);

  const completedCourses = enrollments.filter((p: any) => p.completedAt);
  const inProgressCourses = enrollments.filter((p: any) => !p.completedAt && p.progressPercent > 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-neutral-400 mt-1">Manage your account information and view your membership status.</p>
      </div>

      {/* Profile Card */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-neutral-800">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-white font-bold text-3xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-3 border-neutral-900 rounded-full" />
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{user.name}</h2>
              <p className="text-neutral-400 mt-0.5">{user.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium text-white', membership.color)}>
                  {membership.label}
                </span>
                <span className="text-sm text-neutral-500">
                  Member since {formatDateMedium(user.createdAt)}
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={handleOpenEditModal}
              className="px-4 py-2 rounded-lg bg-neutral-800 text-white text-sm font-medium hover:bg-neutral-700 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Self Introduction */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-white">About Me</h3>
              <p className="text-sm text-neutral-500 mt-0.5">Your self-introduction visible to others</p>
            </div>
            <button
              onClick={handleOpenEditModal}
              className="text-sm text-primary-400 hover:text-primary-300"
            >
              Edit
            </button>
          </div>

          {user.bio ? (
            <p className="text-neutral-300 whitespace-pre-wrap">{user.bio}</p>
          ) : (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-neutral-800 flex items-center justify-center">
                <EditIcon size="lg" className="text-neutral-500" />
              </div>
              <p className="text-neutral-500 mb-3">No introduction yet</p>
              <button
                onClick={handleOpenEditModal}
                className="text-sm text-primary-400 hover:text-primary-300"
              >
                Add your introduction
              </button>
            </div>
          )}

          {user.discordId && (
            <div className="mt-4 pt-4 border-t border-neutral-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-[#5865F2]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
              </svg>
              <span className="text-sm text-neutral-400">{user.discordId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-white">{completedCourses.length}</div>
          <div className="text-sm text-neutral-400 mt-1">Courses Completed</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-white">{inProgressCourses.length}</div>
          <div className="text-sm text-neutral-400 mt-1">In Progress</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-white">{favoritesCount}</div>
          <div className="text-sm text-neutral-400 mt-1">Favorites</div>
        </div>
        <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-4">
          <div className="text-3xl font-bold text-primary-400">
            {Math.round(enrollments.reduce((sum: number, p: any) => sum + p.progressPercent, 0) / Math.max(enrollments.length, 1))}%
          </div>
          <div className="text-sm text-neutral-400 mt-1">Avg. Progress</div>
        </div>
      </div>

      {/* Membership Details */}
      <div className={cn('bg-neutral-900 rounded-xl border overflow-hidden', membership.borderColor)}>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">Membership Plan</h3>
              <p className="text-neutral-400 mt-1">{membership.description}</p>
            </div>
            <span className={cn('px-3 py-1 rounded-full text-sm font-medium text-white', membership.color)}>
              {membership.label}
            </span>
          </div>

          {/* Features */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {membership.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckIcon size="md" className={membership.textColor} />
                <span className="text-sm text-neutral-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* Subscription Info */}
          {subscription && (
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Billing Cycle</span>
                  <p className="text-white font-medium capitalize">{subscription.billingCycle}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Status</span>
                  <p className="text-green-400 font-medium capitalize">{subscription.status}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Current Period</span>
                  <p className="text-white font-medium">{formatDateMedium(subscription.periodStart)}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Renews On</span>
                  <p className="text-white font-medium">{formatDateMedium(subscription.periodEnd)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Duo Ticket Info */}
          {duoTicket && (
            <div className="mt-6 pt-6 border-t border-neutral-800">
              <h4 className="text-sm font-medium text-neutral-400 mb-3">Duo Ticket Details</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-neutral-500">Ticket Type</span>
                  <p className="text-white font-medium capitalize">Duo {duoTicket.tier}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Status</span>
                  <p className="text-green-400 font-medium capitalize">{duoTicket.status}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Valid From</span>
                  <p className="text-white font-medium">{formatDateMedium(duoTicket.validFrom)}</p>
                </div>
                <div>
                  <span className="text-neutral-500">Valid Until</span>
                  <p className="text-white font-medium">{formatDateMedium(duoTicket.validUntil)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        {(identity === 'explorer' || identity === 'solo-traveler') && (
          <div className="px-6 py-4 bg-neutral-800/50 border-t border-neutral-800">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-400">
                {identity === 'explorer'
                  ? 'Upgrade to unlock all courses and features'
                  : 'Add a Duo ticket to connect with learning companions'}
              </p>
              <a
                href="/shop"
                className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
              >
                {identity === 'explorer' ? 'Upgrade Now' : 'Get Duo Ticket'}
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Account Information */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-800 overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-800">
              <div>
                <span className="text-neutral-400 text-sm">Email Address</span>
                <p className="text-white">{user.email}</p>
              </div>
              <button className="text-sm text-primary-400 hover:text-primary-300">Change</button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-800">
              <div>
                <span className="text-neutral-400 text-sm">Password</span>
                <p className="text-white">********</p>
              </div>
              <button className="text-sm text-primary-400 hover:text-primary-300">Change</button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <span className="text-neutral-400 text-sm">Two-Factor Authentication</span>
                <p className="text-neutral-500">Not enabled</p>
              </div>
              <button className="text-sm text-primary-400 hover:text-primary-300">Enable</button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profile"
        size="md"
      >
        <div className="p-6 space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Display Name</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="Your display name"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </div>

          {/* Discord */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Discord Username</label>
            <input
              type="text"
              value={editForm.discordId}
              onChange={(e) => setEditForm((prev) => ({ ...prev, discordId: e.target.value }))}
              placeholder="e.g., username or username#1234"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
            <p className="mt-1 text-xs text-neutral-500">Others can contact you via Discord</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">Self Introduction</label>
            <textarea
              value={editForm.bio}
              onChange={(e) => setEditForm((prev) => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell others about yourself, your interests, and what you're learning..."
              rows={5}
              maxLength={500}
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
            />
            <div className="mt-1 flex justify-between text-xs text-neutral-500">
              <span>This will be visible on your profile</span>
              <span>{editForm.bio.length}/500</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-700">
            <Button variant="ghost" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveProfile} isLoading={isSaving}>
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
