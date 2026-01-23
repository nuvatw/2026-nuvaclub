import type { MockDB } from '../core/MockDB';

/**
 * Seed users data
 *
 * 10 Canonical Users (used consistently across all platform data):
 * Note: In the new marketplace model, duo identities have been removed.
 * Users can access Space marketplace with Explorer+ identity and
 * purchase mentorship directly from Nunus.
 *
 * 1. user-1 (Alex Chen) - solo-traveler - Active community member
 * 2. user-2 (Sarah Lin) - solo-traveler - Power user, Nunu mentor (N4)
 * 3. user-3 (Mike Wang) - solo-traveler - Experienced learner
 * 4. user-4 (Emily Huang) - solo-traveler - Premium user, Nunu mentor (N3)
 * 5. user-5 (Kevin Lee) - explorer - New user, asking questions
 * 6. user-6 (Jessica Wu) - explorer - Engaged learner
 * 7. user-7 (David Zhang) - explorer - Casual user
 * 8. user-8 (Lisa Chen) - explorer - Active participant
 * 9. user-9 (Tom Huang) - solo-traveler - Regular contributor
 * 10. user-10 (Amy Lin) - solo-traveler - Nunu mentor (N2)
 */
export async function seedUsers(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // 10 Canonical Users
  // ==========================================
  db.users.createMany([
    // 1. Alex Chen - solo-traveler - Active community member
    {
      id: 'user-1',
      email: 'alex@nuvaclub.test',
      name: 'Alex Chen',
      avatar: 'https://i.pravatar.cc/150?u=alex',
      bio: 'Passionate learner exploring web development and design.',
      discordId: 'alexchen#1234',
      githubUsername: 'OliverTai688',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 2. Sarah Lin - solo-traveler - Power user, Nunu mentor (N4)
    {
      id: 'user-2',
      email: 'sarah@nuvaclub.test',
      name: 'Sarah Lin',
      avatar: 'https://i.pravatar.cc/150?u=sarah',
      bio: 'Senior developer and mentor. Love helping others grow!',
      discordId: 'sarahlin#5678',
      githubUsername: 'OliverTai688',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-08-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 3. Mike Wang - solo-traveler - Experienced learner
    {
      id: 'user-3',
      email: 'mike@nuvaclub.test',
      name: 'Mike Wang',
      avatar: 'https://i.pravatar.cc/150?u=mike',
      bio: 'Full-stack developer diving deep into React and TypeScript.',
      discordId: 'mikewang#9012',
      githubUsername: 'OliverTai688',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-09-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 4. Emily Huang - solo-traveler - Premium user, Nunu mentor (N3)
    {
      id: 'user-4',
      email: 'emily@nuvaclub.test',
      name: 'Emily Huang',
      avatar: 'https://i.pravatar.cc/150?u=emily',
      bio: 'Content creator and tech educator. Building cool stuff!',
      discordId: 'emilyhuang#3456',
      githubUsername: 'OliverTai688',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-07-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 5. Kevin Lee - explorer - New user, asking questions
    {
      id: 'user-5',
      email: 'kevin@nuvaclub.test',
      name: 'Kevin Lee',
      avatar: 'https://i.pravatar.cc/150?u=kevin',
      bio: 'Newbie developer eager to learn and grow.',
      discordId: 'kevinlee#7890',
      githubUsername: 'OliverTai688',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 6. Jessica Wu - explorer - Engaged learner
    {
      id: 'user-6',
      email: 'jessica@nuvaclub.test',
      name: 'Jessica Wu',
      avatar: 'https://i.pravatar.cc/150?u=jessica',
      bio: 'UI/UX enthusiast learning frontend development.',
      discordId: 'jessicawu#2345',
      githubUsername: 'OliverTai688',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2025-11-15'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-20'),
    },
    // 7. David Zhang - explorer - Casual user
    {
      id: 'user-7',
      email: 'david@nuvaclub.test',
      name: 'David Zhang',
      avatar: 'https://i.pravatar.cc/150?u=david',
      bio: 'Casual coder exploring different technologies.',
      discordId: 'davidzhang#6789',
      githubUsername: 'OliverTai688',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-19'),
    },
    // 8. Lisa Chen - explorer - Active participant
    {
      id: 'user-8',
      email: 'lisa@nuvaclub.test',
      name: 'Lisa Chen',
      avatar: 'https://i.pravatar.cc/150?u=lisa',
      bio: 'Active community member and aspiring developer.',
      discordId: 'lisachen#0123',
      githubUsername: 'OliverTai688',
      identityType: 'explorer',
      emailVerified: true,
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
    // 9. Tom Huang - solo-traveler - Regular contributor
    {
      id: 'user-9',
      email: 'tom@nuvaclub.test',
      name: 'Tom Huang',
      avatar: 'https://i.pravatar.cc/150?u=tom',
      bio: 'Open source contributor and community helper.',
      discordId: 'tomhuang#4567',
      githubUsername: 'OliverTai688',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-10-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-21'),
    },
    // 10. Amy Lin - solo-traveler - Nunu mentor (N2)
    {
      id: 'user-10',
      email: 'amy@nuvaclub.test',
      name: 'Amy Lin',
      avatar: 'https://i.pravatar.cc/150?u=amy',
      bio: 'Expert mentor with 10+ years of experience in tech.',
      discordId: 'amylin#8901',
      githubUsername: 'OliverTai688',
      identityType: 'solo-traveler',
      emailVerified: true,
      createdAt: new Date('2025-06-01'),
      updatedAt: now,
      lastLoginAt: new Date('2026-01-22'),
    },
  ]);

  // ==========================================
  // User Subscriptions (updated schema)
  // ==========================================
  db.userSubscriptions.createMany([
    // Solo Traveler subscriptions (user-1, user-3, user-9)
    {
      id: 'sub-user-1',
      userId: 'user-1',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-10-15'),
      updatedAt: now,
    },
    {
      id: 'sub-user-3',
      userId: 'user-3',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-09-10'),
      updatedAt: now,
    },
    {
      id: 'sub-user-9',
      userId: 'user-9',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-10-01'),
      updatedAt: now,
    },
    // Duo Run subscription (user-2)
    {
      id: 'sub-user-2',
      userId: 'user-2',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-08-01'),
      updatedAt: now,
    },
    // Duo Fly subscriptions (user-4, user-10)
    {
      id: 'sub-user-4',
      userId: 'user-4',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'yearly',
      periodStart: new Date('2025-07-01'),
      periodEnd: new Date('2026-07-01'),
      createdAt: new Date('2025-07-01'),
      updatedAt: now,
    },
    {
      id: 'sub-user-10',
      userId: 'user-10',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'yearly',
      periodStart: new Date('2025-06-01'),
      periodEnd: new Date('2026-06-01'),
      createdAt: new Date('2025-06-01'),
      updatedAt: now,
    },
    // Duo Go subscriptions (user-6, user-8)
    {
      id: 'sub-user-6',
      userId: 'user-6',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-11-15'),
      updatedAt: now,
    },
    {
      id: 'sub-user-8',
      userId: 'user-8',
      plan: 'traveler',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-01'),
      periodEnd: new Date('2026-02-01'),
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
    },
    // Explorer subscriptions (user-5, user-7)
    {
      id: 'sub-user-5',
      userId: 'user-5',
      plan: 'explorer',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-10'),
      periodEnd: new Date('2026-02-10'),
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    {
      id: 'sub-user-7',
      userId: 'user-7',
      plan: 'explorer',
      status: 'active',
      billingCycle: 'monthly',
      periodStart: new Date('2026-01-05'),
      periodEnd: new Date('2026-02-05'),
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // User Duo Tickets (updated schema)
  // ==========================================
  db.userDuoTickets.createMany([
    // Duo Run ticket (user-2)
    {
      id: 'ticket-user-2',
      userId: 'user-2',
      tier: 'run',
      status: 'active',
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      purchasedAt: new Date('2025-08-01'),
      createdAt: new Date('2025-08-01'),
    },
    // Duo Fly tickets (user-4, user-10)
    {
      id: 'ticket-user-4',
      userId: 'user-4',
      tier: 'fly',
      status: 'active',
      validFrom: new Date('2025-07-01'),
      validUntil: new Date('2026-07-01'),
      purchasedAt: new Date('2025-07-01'),
      createdAt: new Date('2025-07-01'),
    },
    {
      id: 'ticket-user-10',
      userId: 'user-10',
      tier: 'fly',
      status: 'active',
      validFrom: new Date('2025-06-01'),
      validUntil: new Date('2026-06-01'),
      purchasedAt: new Date('2025-06-01'),
      createdAt: new Date('2025-06-01'),
    },
    // Duo Go tickets (user-6, user-8)
    {
      id: 'ticket-user-6',
      userId: 'user-6',
      tier: 'go',
      status: 'active',
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      purchasedAt: new Date('2025-11-15'),
      createdAt: new Date('2025-11-15'),
    },
    {
      id: 'ticket-user-8',
      userId: 'user-8',
      tier: 'go',
      status: 'active',
      validFrom: new Date('2026-01-01'),
      validUntil: new Date('2026-03-31'),
      purchasedAt: new Date('2025-12-01'),
      createdAt: new Date('2025-12-01'),
    },
  ]);

  // ==========================================
  // User Favorites (updated schema)
  // ==========================================
  db.userFavorites.createMany([
    // User 1 favorites
    {
      id: 'fav-1-1',
      userId: 'user-1',
      itemType: 'course',
      itemId: 'course-1',
      createdAt: new Date('2026-01-15'),
    },
    {
      id: 'fav-1-2',
      userId: 'user-1',
      itemType: 'course',
      itemId: 'course-7',
      createdAt: new Date('2026-01-18'),
    },
    {
      id: 'fav-1-3',
      userId: 'user-1',
      itemType: 'post',
      itemId: 'post-4',
      createdAt: new Date('2026-01-16'),
    },
    // User 2 favorites
    {
      id: 'fav-2-1',
      userId: 'user-2',
      itemType: 'course',
      itemId: 'course-3',
      createdAt: new Date('2026-01-12'),
    },
    {
      id: 'fav-2-2',
      userId: 'user-2',
      itemType: 'post',
      itemId: 'post-1',
      createdAt: new Date('2026-01-14'),
    },
    // User 3 favorites
    {
      id: 'fav-3-1',
      userId: 'user-3',
      itemType: 'course',
      itemId: 'course-5',
      createdAt: new Date('2026-01-10'),
    },
    {
      id: 'fav-3-2',
      userId: 'user-3',
      itemType: 'post',
      itemId: 'post-2',
      createdAt: new Date('2026-01-15'),
    },
    // User 4 favorites
    {
      id: 'fav-4-1',
      userId: 'user-4',
      itemType: 'course',
      itemId: 'course-6',
      createdAt: new Date('2026-01-08'),
    },
    {
      id: 'fav-4-2',
      userId: 'user-4',
      itemType: 'course',
      itemId: 'course-8',
      createdAt: new Date('2026-01-12'),
    },
    // User 5 favorites
    {
      id: 'fav-5-1',
      userId: 'user-5',
      itemType: 'course',
      itemId: 'course-1',
      createdAt: new Date('2026-01-18'),
    },
    // User 6 favorites
    {
      id: 'fav-6-1',
      userId: 'user-6',
      itemType: 'course',
      itemId: 'course-4',
      createdAt: new Date('2026-01-11'),
    },
    {
      id: 'fav-6-2',
      userId: 'user-6',
      itemType: 'post',
      itemId: 'post-3',
      createdAt: new Date('2026-01-17'),
    },
    // User 7 favorites
    {
      id: 'fav-7-1',
      userId: 'user-7',
      itemType: 'course',
      itemId: 'course-2',
      createdAt: new Date('2026-01-13'),
    },
    // User 8 favorites
    {
      id: 'fav-8-1',
      userId: 'user-8',
      itemType: 'course',
      itemId: 'course-5',
      createdAt: new Date('2026-01-09'),
    },
    {
      id: 'fav-8-2',
      userId: 'user-8',
      itemType: 'post',
      itemId: 'post-4',
      createdAt: new Date('2026-01-19'),
    },
    // User 9 favorites
    {
      id: 'fav-9-1',
      userId: 'user-9',
      itemType: 'course',
      itemId: 'course-7',
      createdAt: new Date('2026-01-14'),
    },
    // User 10 favorites
    {
      id: 'fav-10-1',
      userId: 'user-10',
      itemType: 'course',
      itemId: 'course-8',
      createdAt: new Date('2026-01-07'),
    },
    {
      id: 'fav-10-2',
      userId: 'user-10',
      itemType: 'post',
      itemId: 'post-2',
      createdAt: new Date('2026-01-16'),
    },
  ]);

  // ==========================================
  // User Activities (sample analytics data)
  // ==========================================
  db.userActivities.createMany([
    {
      id: 'activity-1',
      userId: 'user-1',
      activityType: 'view',
      targetType: 'course',
      targetId: 'course-1',
      metadata: { duration: 120, source: 'homepage' },
      createdAt: new Date('2026-01-20T10:00:00'),
    },
    {
      id: 'activity-2',
      userId: 'user-1',
      activityType: 'complete',
      targetType: 'lesson',
      targetId: 'l1-1',
      metadata: { progress: 100 },
      createdAt: new Date('2026-01-20T10:30:00'),
    },
    {
      id: 'activity-3',
      userId: 'user-2',
      activityType: 'comment',
      targetType: 'post',
      targetId: 'post-1',
      createdAt: new Date('2026-01-21T14:00:00'),
    },
    {
      id: 'activity-4',
      userId: 'user-5',
      activityType: 'view',
      targetType: 'course',
      targetId: 'course-2',
      metadata: { duration: 60, source: 'search', referrer: 'google' },
      createdAt: new Date('2026-01-21T15:00:00'),
    },
  ]);

  // ==========================================
  // User Points (reputation system)
  // ==========================================
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  db.userPoints.createMany([
    // user-1 (Alex Chen) - Active community member
    {
      id: 'points-user-1',
      userId: 'user-1',
      totalPoints: 850,
      learningPoints: 450,
      communityPoints: 400,
      dailyLearningPoints: 30,
      dailyCommunityPoints: 25,
      dailyUpvotePoints: 10,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-10-15'),
      updatedAt: now,
    },
    // user-2 (Sarah Lin) - Power user, mentor
    {
      id: 'points-user-2',
      userId: 'user-2',
      totalPoints: 2450,
      learningPoints: 1200,
      communityPoints: 1250,
      dailyLearningPoints: 50,
      dailyCommunityPoints: 45,
      dailyUpvotePoints: 20,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-08-01'),
      updatedAt: now,
    },
    // user-3 (Mike Wang) - Experienced learner
    {
      id: 'points-user-3',
      userId: 'user-3',
      totalPoints: 1120,
      learningPoints: 720,
      communityPoints: 400,
      dailyLearningPoints: 40,
      dailyCommunityPoints: 15,
      dailyUpvotePoints: 8,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-09-10'),
      updatedAt: now,
    },
    // user-4 (Emily Huang) - Premium user, content creator
    {
      id: 'points-user-4',
      userId: 'user-4',
      totalPoints: 3200,
      learningPoints: 1500,
      communityPoints: 1700,
      dailyLearningPoints: 60,
      dailyCommunityPoints: 55,
      dailyUpvotePoints: 25,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-07-01'),
      updatedAt: now,
    },
    // user-5 (Kevin Lee) - New user
    {
      id: 'points-user-5',
      userId: 'user-5',
      totalPoints: 180,
      learningPoints: 100,
      communityPoints: 80,
      dailyLearningPoints: 20,
      dailyCommunityPoints: 10,
      dailyUpvotePoints: 4,
      lastDailyReset: todayStart,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    // user-6 (Jessica Wu) - Engaged learner
    {
      id: 'points-user-6',
      userId: 'user-6',
      totalPoints: 620,
      learningPoints: 380,
      communityPoints: 240,
      dailyLearningPoints: 35,
      dailyCommunityPoints: 20,
      dailyUpvotePoints: 12,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-11-15'),
      updatedAt: now,
    },
    // user-7 (David Zhang) - Casual user
    {
      id: 'points-user-7',
      userId: 'user-7',
      totalPoints: 95,
      learningPoints: 60,
      communityPoints: 35,
      dailyLearningPoints: 10,
      dailyCommunityPoints: 5,
      dailyUpvotePoints: 2,
      lastDailyReset: todayStart,
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },
    // user-8 (Lisa Chen) - Active participant
    {
      id: 'points-user-8',
      userId: 'user-8',
      totalPoints: 480,
      learningPoints: 250,
      communityPoints: 230,
      dailyLearningPoints: 25,
      dailyCommunityPoints: 18,
      dailyUpvotePoints: 8,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
    },
    // user-9 (Tom Huang) - Regular contributor
    {
      id: 'points-user-9',
      userId: 'user-9',
      totalPoints: 920,
      learningPoints: 400,
      communityPoints: 520,
      dailyLearningPoints: 30,
      dailyCommunityPoints: 35,
      dailyUpvotePoints: 15,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-10-01'),
      updatedAt: now,
    },
    // user-10 (Amy Lin) - Expert mentor
    {
      id: 'points-user-10',
      userId: 'user-10',
      totalPoints: 4100,
      learningPoints: 1800,
      communityPoints: 2300,
      dailyLearningPoints: 80,
      dailyCommunityPoints: 70,
      dailyUpvotePoints: 30,
      lastDailyReset: todayStart,
      createdAt: new Date('2025-06-01'),
      updatedAt: now,
    },
  ]);
}
