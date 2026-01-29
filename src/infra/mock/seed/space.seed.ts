import type { MockDB } from '../core/MockDB';

/**
 * Seed space module data
 *
 * NUNUS (6 active mentors):
 * - user-2 (Sarah Lin) - N4, Regular - 3/5 vavas, 4.7 rating
 * - user-4 (Emily Huang) - N2, Verified - 4/30 vavas, 4.9 rating
 * - user-10 (Amy Lin) - N1, Verified - 5/50 vavas, 5.0 rating
 * - user-11 (Ryan Chen) - N5, Regular - 2/3 vavas, 4.2 rating
 * - user-14 (Sophia Wang) - N3, Verified - 6/10 vavas, 4.8 rating
 * - user-18 (Eric Liu) - N4, Regular - 3/5 vavas, 4.5 rating
 *
 * ACTIVE PAIRINGS (6 pairs):
 * 1. Sarah Lin (N4) → Alex Chen (3 months: Feb-Apr 2026, NT$800/mo)
 * 2. Emily Huang (N2) → Kevin Lee (2 months: Feb-Mar 2026, NT$2,000/mo)
 * 3. Amy Lin (N1) → Jessica Wu (6 months: Feb-Jul 2026, NT$3,500/mo)
 * 4. Ryan Chen (N5) → David Zhang (1 month: Feb 2026, NT$600/mo)
 * 5. Sophia Wang (N3) → Mia Huang (4 months: Feb-May 2026, NT$1,500/mo)
 * 6. Eric Liu (N4) → Zoe Wu (3 months: Feb-Apr 2026, NT$900/mo)
 */
export async function seedSpace(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // COMPANIONS (Legacy external companions)
  // ==========================================
  db.companions.createMany([
    { id: 'companion-1', name: 'Amy', avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=amy-nunu&top=longHairStraight', type: 'nunu', bio: 'Loves helping beginners get started with AI tools.', discordId: 'amy#1234', isAvailable: true, createdAt: new Date('2025-06-01'), updatedAt: now },
    { id: 'companion-2', name: 'Ben', avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=ben-nunu&top=shortHairShortFlat', type: 'nunu', bio: 'Focused on AI automation workflows.', discordId: 'ben#5678', isAvailable: true, createdAt: new Date('2025-07-01'), updatedAt: now },
    { id: 'companion-3', name: 'Carol', avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=carol-nunu&top=longHairBob', type: 'nunu', bio: 'Content creator using AI for efficiency.', discordId: 'carol#9012', isAvailable: false, createdAt: new Date('2025-08-01'), updatedAt: now },
    { id: 'companion-4', name: 'David', avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=david-certified&top=shortHairShortWaved', type: 'certified-nunu', bio: 'Senior AI engineer specializing in Prompt Engineering.', discordId: 'david#3456', isAvailable: true, createdAt: new Date('2025-05-01'), updatedAt: now },
    { id: 'companion-5', name: 'Eva', avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=eva-certified&top=longHairMiaWallace', type: 'certified-nunu', bio: 'AI Product Manager helping with execution.', discordId: 'eva#7890', isAvailable: true, createdAt: new Date('2025-04-01'), updatedAt: now },
    { id: 'companion-6', name: 'Shangzhe', avatar: 'https://api.dicebear.com/9.x/avataaars/png?seed=shangzhe&top=shortHairShortCurly', type: 'shangzhe', bio: 'nuvaClub founder and AI education expert.', discordId: 'shangzhe#0001', isAvailable: true, createdAt: new Date('2025-01-01'), updatedAt: now },
  ]);

  // ==========================================
  // COMPANION EXPERTISE
  // ==========================================
  db.companionExpertise.createMany([
    { id: 'exp-1-1', companionId: 'companion-1', expertise: 'ChatGPT', sortOrder: 1 },
    { id: 'exp-1-2', companionId: 'companion-1', expertise: 'Beginner Tutorial', sortOrder: 2 },
    { id: 'exp-2-1', companionId: 'companion-2', expertise: 'Make.com', sortOrder: 1 },
    { id: 'exp-2-2', companionId: 'companion-2', expertise: 'Zapier', sortOrder: 2 },
    { id: 'exp-3-1', companionId: 'companion-3', expertise: 'Content Creation', sortOrder: 1 },
    { id: 'exp-4-1', companionId: 'companion-4', expertise: 'Prompt Engineering', sortOrder: 1 },
    { id: 'exp-5-1', companionId: 'companion-5', expertise: 'Product Planning', sortOrder: 1 },
    { id: 'exp-6-1', companionId: 'companion-6', expertise: 'AI Strategy', sortOrder: 1 },
  ]);

  // ==========================================
  // COMPANION STATS
  // ==========================================
  db.companionStats.createMany([
    { companionId: 'companion-1', matchCount: 28, completedMatchCount: 25, totalRatings: 25, sumRatings: 120, avgRating: 4.8, lastUpdatedAt: now },
    { companionId: 'companion-2', matchCount: 15, completedMatchCount: 14, totalRatings: 14, sumRatings: 64, avgRating: 4.6, lastUpdatedAt: now },
    { companionId: 'companion-3', matchCount: 22, completedMatchCount: 20, totalRatings: 20, sumRatings: 94, avgRating: 4.7, lastUpdatedAt: now },
    { companionId: 'companion-4', matchCount: 45, completedMatchCount: 42, totalRatings: 42, sumRatings: 206, avgRating: 4.9, lastUpdatedAt: now },
    { companionId: 'companion-5', matchCount: 38, completedMatchCount: 35, totalRatings: 35, sumRatings: 168, avgRating: 4.8, lastUpdatedAt: now },
    { companionId: 'companion-6', matchCount: 120, completedMatchCount: 100, totalRatings: 100, sumRatings: 500, avgRating: 5.0, lastUpdatedAt: now },
  ]);

  // ==========================================
  // NUNU APPLICATIONS (6 approved + 1 pending)
  // ==========================================
  db.nunuApplications.createMany([
    // Approved applications
    { id: 'nunu-app-2', userId: 'user-2', status: 'approved', applicationText: 'I have extensive experience with automation tools like Make.com and Zapier. I love helping others streamline their workflows.', discordId: 'sarahlin#5678', submittedAt: new Date('2025-10-01'), reviewedAt: new Date('2025-10-05'), reviewedBy: 'admin-1', createdAt: new Date('2025-10-01'), updatedAt: new Date('2025-10-05') },
    { id: 'nunu-app-4', userId: 'user-4', status: 'approved', applicationText: 'As a senior AI consultant, I specialize in helping businesses leverage AI strategically. Proven track record with 15+ mentees.', discordId: 'emilyhuang#3456', submittedAt: new Date('2025-08-15'), reviewedAt: new Date('2025-08-20'), reviewedBy: 'admin-1', createdAt: new Date('2025-08-15'), updatedAt: new Date('2025-08-20') },
    { id: 'nunu-app-10', userId: 'user-10', status: 'approved', applicationText: 'Master-level mentor with 10+ years of teaching experience. Have helped over 100 learners achieve their goals in AI and tech.', discordId: 'amylin#8901', submittedAt: new Date('2025-01-01'), reviewedAt: new Date('2025-01-02'), reviewedBy: 'admin-1', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-02') },
    { id: 'nunu-app-11', userId: 'user-11', status: 'approved', applicationText: 'New to mentoring but passionate about helping beginners. I understand the struggles of starting out and can relate to new learners.', discordId: 'ryanchen#1234', submittedAt: new Date('2025-12-01'), reviewedAt: new Date('2025-12-05'), reviewedBy: 'admin-1', createdAt: new Date('2025-12-01'), updatedAt: new Date('2025-12-05') },
    { id: 'nunu-app-14', userId: 'user-14', status: 'approved', applicationText: 'Former PM at a tech startup with expertise in AI product integration. Can help learners apply AI to real product development scenarios.', discordId: 'sophiawang#5678', submittedAt: new Date('2025-09-01'), reviewedAt: new Date('2025-09-05'), reviewedBy: 'admin-1', createdAt: new Date('2025-09-01'), updatedAt: new Date('2025-09-05') },
    { id: 'nunu-app-18', userId: 'user-18', status: 'approved', applicationText: 'Full-stack developer passionate about teaching modern web development with AI integration. Hands-on practical approach.', discordId: 'ericliu#9012', submittedAt: new Date('2025-10-01'), reviewedAt: new Date('2025-10-03'), reviewedBy: 'admin-1', createdAt: new Date('2025-10-01'), updatedAt: new Date('2025-10-03') },
    // Pending application
    { id: 'nunu-app-9', userId: 'user-9', status: 'pending', applicationText: 'Open source contributor with experience teaching coding workshops. Want to help beginners get started with AI tools.', discordId: 'tomhuang#4567', submittedAt: new Date('2026-01-15'), createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
  ]);

  // ==========================================
  // NUNU APPLICATION EXPERTISE
  // ==========================================
  db.nunuApplicationExpertise.createMany([
    { id: 'nae-2-1', applicationId: 'nunu-app-2', expertise: 'Automation', sortOrder: 1 },
    { id: 'nae-2-2', applicationId: 'nunu-app-2', expertise: 'Make.com', sortOrder: 2 },
    { id: 'nae-2-3', applicationId: 'nunu-app-2', expertise: 'Zapier', sortOrder: 3 },
    { id: 'nae-4-1', applicationId: 'nunu-app-4', expertise: 'AI Strategy', sortOrder: 1 },
    { id: 'nae-4-2', applicationId: 'nunu-app-4', expertise: 'Business Application', sortOrder: 2 },
    { id: 'nae-10-1', applicationId: 'nunu-app-10', expertise: 'Comprehensive Guidance', sortOrder: 1 },
    { id: 'nae-10-2', applicationId: 'nunu-app-10', expertise: 'AI Strategy', sortOrder: 2 },
    { id: 'nae-11-1', applicationId: 'nunu-app-11', expertise: 'Beginner Tutorial', sortOrder: 1 },
    { id: 'nae-11-2', applicationId: 'nunu-app-11', expertise: 'ChatGPT', sortOrder: 2 },
    { id: 'nae-14-1', applicationId: 'nunu-app-14', expertise: 'Product AI', sortOrder: 1 },
    { id: 'nae-14-2', applicationId: 'nunu-app-14', expertise: 'Project Management', sortOrder: 2 },
    { id: 'nae-18-1', applicationId: 'nunu-app-18', expertise: 'Full-Stack', sortOrder: 1 },
    { id: 'nae-18-2', applicationId: 'nunu-app-18', expertise: 'AI Integration', sortOrder: 2 },
    { id: 'nae-9-1', applicationId: 'nunu-app-9', expertise: 'Open Source', sortOrder: 1 },
    { id: 'nae-9-2', applicationId: 'nunu-app-9', expertise: 'Beginner Tutorial', sortOrder: 2 },
  ]);

  // ==========================================
  // NUNU APPLICATION ANSWERS
  // ==========================================
  db.nunuApplicationAnswers.createMany([
    { id: 'naa-2-1', applicationId: 'nunu-app-2', questionId: 'question1', question: 'How would you handle a struggling Vava?', answer: 'I would first listen to understand their specific challenges, then break down the learning into smaller manageable steps with clear milestones.', sortOrder: 1 },
    { id: 'naa-4-1', applicationId: 'nunu-app-4', questionId: 'question1', question: 'How would you handle a struggling Vava?', answer: 'I believe in positive reinforcement and celebrating small wins. I would adjust my teaching pace and find alternative approaches.', sortOrder: 1 },
    { id: 'naa-10-1', applicationId: 'nunu-app-10', questionId: 'question1', question: 'How would you handle a struggling Vava?', answer: 'With 10+ years of experience, I have developed a toolkit of strategies. I start by diagnosing the root cause and then tailor my approach accordingly.', sortOrder: 1 },
  ]);

  // ==========================================
  // NUNU PROFILES (6 active Nunus)
  // ==========================================
  db.nunuProfiles.createMany([
    // Sarah Lin - N4, Regular
    { id: 'nunu-profile-2', userId: 'user-2', applicationId: 'nunu-app-2', level: 'N4', type: 'regular', bio: 'Automation specialist helping you master Make.com, Zapier, and workflow efficiency. Patient and thorough teaching style.', discordId: 'sarahlin#5678', isAvailable: true, maxVavas: 5, approvedAt: new Date('2025-10-05'), createdAt: new Date('2025-10-05'), updatedAt: now },
    // Emily Huang - N2, Verified
    { id: 'nunu-profile-4', userId: 'user-4', applicationId: 'nunu-app-4', level: 'N2', type: 'verified', bio: 'Certified AI Strategy consultant. Expert in helping businesses and individuals leverage AI for real-world impact.', discordId: 'emilyhuang#3456', isAvailable: true, maxVavas: 30, approvedAt: new Date('2025-08-20'), createdAt: new Date('2025-08-20'), updatedAt: now },
    // Amy Lin - N1, Verified (Master)
    { id: 'nunu-profile-10', userId: 'user-10', applicationId: 'nunu-app-10', level: 'N1', type: 'verified', bio: 'Master N1 Nunu with 100+ successful mentorships. Comprehensive guidance from beginner to advanced AI mastery.', discordId: 'amylin#8901', isAvailable: true, maxVavas: 50, approvedAt: new Date('2025-01-02'), createdAt: new Date('2025-01-02'), updatedAt: now },
    // Ryan Chen - N5, Regular (Beginner)
    { id: 'nunu-profile-11', userId: 'user-11', applicationId: 'nunu-app-11', level: 'N5', type: 'regular', bio: 'New N5 Nunu perfect for beginners. I recently went through the learning journey myself and understand the challenges.', discordId: 'ryanchen#1234', isAvailable: true, maxVavas: 3, approvedAt: new Date('2025-12-05'), createdAt: new Date('2025-12-05'), updatedAt: now },
    // Sophia Wang - N3, Verified
    { id: 'nunu-profile-14', userId: 'user-14', applicationId: 'nunu-app-14', level: 'N3', type: 'verified', bio: 'Certified N3 Nunu specializing in Product & AI integration. Former PM with hands-on startup experience.', discordId: 'sophiawang#5678', isAvailable: true, maxVavas: 10, approvedAt: new Date('2025-09-05'), createdAt: new Date('2025-09-05'), updatedAt: now },
    // Eric Liu - N4, Regular
    { id: 'nunu-profile-18', userId: 'user-18', applicationId: 'nunu-app-18', level: 'N4', type: 'regular', bio: 'Full-stack developer teaching modern web development with AI. Build real projects together.', discordId: 'ericliu#9012', isAvailable: true, maxVavas: 5, approvedAt: new Date('2025-10-03'), createdAt: new Date('2025-10-03'), updatedAt: now },
  ]);

  // ==========================================
  // NUNU PROFILE EXPERTISE
  // ==========================================
  db.nunuProfileExpertise.createMany([
    // Sarah Lin
    { id: 'npe-2-1', profileId: 'nunu-profile-2', expertise: 'Automation', sortOrder: 1 },
    { id: 'npe-2-2', profileId: 'nunu-profile-2', expertise: 'Make.com', sortOrder: 2 },
    { id: 'npe-2-3', profileId: 'nunu-profile-2', expertise: 'Zapier', sortOrder: 3 },
    { id: 'npe-2-4', profileId: 'nunu-profile-2', expertise: 'Workflow Design', sortOrder: 4 },
    // Emily Huang
    { id: 'npe-4-1', profileId: 'nunu-profile-4', expertise: 'AI Strategy', sortOrder: 1 },
    { id: 'npe-4-2', profileId: 'nunu-profile-4', expertise: 'Business Application', sortOrder: 2 },
    { id: 'npe-4-3', profileId: 'nunu-profile-4', expertise: 'Product Planning', sortOrder: 3 },
    // Amy Lin
    { id: 'npe-10-1', profileId: 'nunu-profile-10', expertise: 'Comprehensive Guidance', sortOrder: 1 },
    { id: 'npe-10-2', profileId: 'nunu-profile-10', expertise: 'AI Strategy', sortOrder: 2 },
    { id: 'npe-10-3', profileId: 'nunu-profile-10', expertise: 'Prompt Engineering', sortOrder: 3 },
    { id: 'npe-10-4', profileId: 'nunu-profile-10', expertise: 'Business Application', sortOrder: 4 },
    // Ryan Chen
    { id: 'npe-11-1', profileId: 'nunu-profile-11', expertise: 'Beginner Tutorial', sortOrder: 1 },
    { id: 'npe-11-2', profileId: 'nunu-profile-11', expertise: 'ChatGPT', sortOrder: 2 },
    { id: 'npe-11-3', profileId: 'nunu-profile-11', expertise: 'Getting Started', sortOrder: 3 },
    // Sophia Wang
    { id: 'npe-14-1', profileId: 'nunu-profile-14', expertise: 'Product AI', sortOrder: 1 },
    { id: 'npe-14-2', profileId: 'nunu-profile-14', expertise: 'Project Management', sortOrder: 2 },
    { id: 'npe-14-3', profileId: 'nunu-profile-14', expertise: 'AI Integration', sortOrder: 3 },
    // Eric Liu
    { id: 'npe-18-1', profileId: 'nunu-profile-18', expertise: 'Full-Stack', sortOrder: 1 },
    { id: 'npe-18-2', profileId: 'nunu-profile-18', expertise: 'AI Integration', sortOrder: 2 },
    { id: 'npe-18-3', profileId: 'nunu-profile-18', expertise: 'React', sortOrder: 3 },
    { id: 'npe-18-4', profileId: 'nunu-profile-18', expertise: 'TypeScript', sortOrder: 4 },
  ]);

  // ==========================================
  // NUNU STATS (Rating & Review counts)
  // ==========================================
  db.nunuStats.createMany([
    // Sarah Lin - N4, 4.7 rating, 23 reviews
    { profileId: 'nunu-profile-2', currentVavaCount: 3, totalMentorships: 28, completedMentorships: 25, totalRatings: 23, sumRatings: 108, avgRating: 4.7, lastUpdatedAt: now },
    // Emily Huang - N2, 4.9 rating, 45 reviews
    { profileId: 'nunu-profile-4', currentVavaCount: 4, totalMentorships: 52, completedMentorships: 48, totalRatings: 45, sumRatings: 221, avgRating: 4.9, lastUpdatedAt: now },
    // Amy Lin - N1, 5.0 rating, 100 reviews
    { profileId: 'nunu-profile-10', currentVavaCount: 5, totalMentorships: 120, completedMentorships: 115, totalRatings: 100, sumRatings: 500, avgRating: 5.0, lastUpdatedAt: now },
    // Ryan Chen - N5, 4.2 rating, 5 reviews
    { profileId: 'nunu-profile-11', currentVavaCount: 2, totalMentorships: 6, completedMentorships: 4, totalRatings: 5, sumRatings: 21, avgRating: 4.2, lastUpdatedAt: now },
    // Sophia Wang - N3, 4.8 rating, 32 reviews
    { profileId: 'nunu-profile-14', currentVavaCount: 6, totalMentorships: 38, completedMentorships: 32, totalRatings: 32, sumRatings: 154, avgRating: 4.8, lastUpdatedAt: now },
    // Eric Liu - N4, 4.5 rating, 18 reviews
    { profileId: 'nunu-profile-18', currentVavaCount: 3, totalMentorships: 22, completedMentorships: 19, totalRatings: 18, sumRatings: 81, avgRating: 4.5, lastUpdatedAt: now },
  ]);

  // ==========================================
  // USER MENTORSHIPS (6 active pairings with duration)
  // Time-based mentorship model (like Airbnb)
  // ==========================================
  db.userMentorships.createMany([
    // 1. Sarah Lin (N4) → Alex Chen (3 months: Feb-Apr 2026, NT$800/mo)
    {
      id: 'mentorship-1',
      nunuId: 'user-2',
      vavaId: 'user-1',
      nunuProfileId: 'nunu-profile-2',
      months: ['2026-02', '2026-03', '2026-04'],
      status: 'active',
      sessionCount: 8,
      startedAt: new Date('2026-02-01'),
      lastSessionAt: new Date('2026-01-22'),
      notes: 'Learning automation workflows. Great progress on Make.com.',
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
    },
    // 2. Emily Huang (N2) → Kevin Lee (2 months: Feb-Mar 2026, NT$2,000/mo)
    {
      id: 'mentorship-2',
      nunuId: 'user-4',
      vavaId: 'user-5',
      nunuProfileId: 'nunu-profile-4',
      months: ['2026-02', '2026-03'],
      status: 'active',
      sessionCount: 6,
      startedAt: new Date('2026-02-01'),
      lastSessionAt: new Date('2026-01-21'),
      notes: 'AI strategy for startup. Focus on business applications.',
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    // 3. Amy Lin (N1) → Jessica Wu (6 months: Feb-Jul 2026, NT$3,500/mo)
    {
      id: 'mentorship-3',
      nunuId: 'user-10',
      vavaId: 'user-6',
      nunuProfileId: 'nunu-profile-10',
      months: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
      status: 'active',
      sessionCount: 15,
      startedAt: new Date('2026-02-01'),
      lastSessionAt: new Date('2026-01-22'),
      notes: 'Intensive 6-month program. Comprehensive AI mastery track.',
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },
    // 4. Ryan Chen (N5) → David Zhang (1 month: Feb 2026, NT$600/mo)
    {
      id: 'mentorship-4',
      nunuId: 'user-11',
      vavaId: 'user-7',
      nunuProfileId: 'nunu-profile-11',
      months: ['2026-02'],
      status: 'active',
      sessionCount: 3,
      startedAt: new Date('2026-02-01'),
      lastSessionAt: new Date('2026-01-22'),
      notes: 'Beginner getting started with AI. 1-month trial.',
      createdAt: new Date('2026-01-20'),
      updatedAt: now,
    },
    // 5. Sophia Wang (N3) → Mia Huang (4 months: Feb-May 2026, NT$1,500/mo)
    {
      id: 'mentorship-5',
      nunuId: 'user-14',
      vavaId: 'user-12',
      nunuProfileId: 'nunu-profile-14',
      months: ['2026-02', '2026-03', '2026-04', '2026-05'],
      status: 'active',
      sessionCount: 10,
      startedAt: new Date('2026-02-01'),
      lastSessionAt: new Date('2026-01-21'),
      notes: 'PM learning to integrate AI into product workflows.',
      createdAt: new Date('2026-01-12'),
      updatedAt: now,
    },
    // 6. Eric Liu (N4) → Zoe Wu (3 months: Feb-Apr 2026, NT$900/mo)
    {
      id: 'mentorship-6',
      nunuId: 'user-18',
      vavaId: 'user-17',
      nunuProfileId: 'nunu-profile-18',
      months: ['2026-02', '2026-03', '2026-04'],
      status: 'active',
      sessionCount: 7,
      startedAt: new Date('2026-02-01'),
      lastSessionAt: new Date('2026-01-22'),
      notes: 'Frontend developer expanding to full-stack with AI.',
      createdAt: new Date('2026-01-08'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // MENTORSHIP SESSIONS (Sample session records)
  // ==========================================
  db.mentorshipSessions.createMany([
    { id: 'session-1-1', mentorshipId: 'mentorship-1', sessionNumber: 1, occurredAt: new Date('2026-01-16'), durationMinutes: 60, notes: 'Introduction to Make.com', topics: 'Automation basics', createdAt: new Date('2026-01-16') },
    { id: 'session-1-2', mentorshipId: 'mentorship-1', sessionNumber: 2, occurredAt: new Date('2026-01-22'), durationMinutes: 45, notes: 'Built first workflow', topics: 'Workflow design', createdAt: new Date('2026-01-22') },
    { id: 'session-2-1', mentorshipId: 'mentorship-2', sessionNumber: 1, occurredAt: new Date('2026-01-12'), durationMinutes: 90, notes: 'AI strategy assessment', topics: 'Business goals', createdAt: new Date('2026-01-12') },
    { id: 'session-3-1', mentorshipId: 'mentorship-3', sessionNumber: 1, occurredAt: new Date('2026-01-08'), durationMinutes: 120, notes: 'Comprehensive assessment', topics: 'Learning roadmap', createdAt: new Date('2026-01-08') },
    { id: 'session-4-1', mentorshipId: 'mentorship-4', sessionNumber: 1, occurredAt: new Date('2026-01-21'), durationMinutes: 45, notes: 'ChatGPT basics', topics: 'Getting started', createdAt: new Date('2026-01-21') },
    { id: 'session-5-1', mentorshipId: 'mentorship-5', sessionNumber: 1, occurredAt: new Date('2026-01-14'), durationMinutes: 60, notes: 'Product AI overview', topics: 'AI in PM', createdAt: new Date('2026-01-14') },
    { id: 'session-6-1', mentorshipId: 'mentorship-6', sessionNumber: 1, occurredAt: new Date('2026-01-10'), durationMinutes: 75, notes: 'Full-stack introduction', topics: 'Project setup', createdAt: new Date('2026-01-10') },
  ]);

  // ==========================================
  // MATCHING POSTS (Marketplace with pricing)
  // Nunus post with fixed prices, Vavas post with budget ranges
  // ==========================================
  db.matchingPosts.createMany([
    // === NUNU POSTS (Looking for Vava) - 12 posts ===
    // Sarah Lin (N4) - Automation Mentoring
    {
      id: 'matching-post-1',
      authorId: 'user-2',
      type: 'nunu-looking-for-vava',
      title: 'Automation & Make.com Mentoring',
      content: 'N4 Nunu specializing in automation workflows. I will help you master Make.com, Zapier, and other automation tools. Perfect for those wanting to streamline their work processes. Weekly 1-hour sessions included.',
      priceType: 'fixed',
      priceAmount: 800,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06'],
      maxSlots: 5,
      currentSlots: 3,
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    // Emily Huang (N2) - AI Strategy
    {
      id: 'matching-post-2',
      authorId: 'user-4',
      type: 'nunu-looking-for-vava',
      title: '[Certified] AI Strategy for Business',
      content: 'Certified N2 Nunu with proven track record in AI strategy consulting. I help businesses and individuals leverage AI effectively. Includes bi-weekly strategy sessions and ongoing Discord support.',
      priceType: 'fixed',
      priceAmount: 2000,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05'],
      maxSlots: 5,
      currentSlots: 4,
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },
    // Amy Lin (N1) - Master Program
    {
      id: 'matching-post-3',
      authorId: 'user-10',
      type: 'nunu-looking-for-vava',
      title: '[Master N1] Premium Mentorship Program',
      content: 'Master N1 Nunu with 100+ successful mentorships. Comprehensive AI mastery track from beginner to advanced. Premium support with priority scheduling. Limited slots available.',
      priceType: 'fixed',
      priceAmount: 3500,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      maxSlots: 3,
      currentSlots: 1,
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-02'),
      updatedAt: now,
    },
    // Ryan Chen (N5) - Beginner Friendly
    {
      id: 'matching-post-4',
      authorId: 'user-11',
      type: 'nunu-looking-for-vava',
      title: 'Beginner-Friendly AI Guidance',
      content: 'N5 Nunu perfect for complete beginners! I recently went through the learning journey myself so I understand the challenges. Patient and understanding approach. Affordable rate for those just starting.',
      priceType: 'fixed',
      priceAmount: 600,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03'],
      maxSlots: 3,
      currentSlots: 2,
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-18'),
      updatedAt: now,
    },
    // Sophia Wang (N3) - Product AI
    {
      id: 'matching-post-5',
      authorId: 'user-14',
      type: 'nunu-looking-for-vava',
      title: '[Certified] Product & AI Integration',
      content: 'Certified N3 Nunu and former PM at tech startup. Specializing in AI for product development. Learn to integrate AI into your product workflows and make data-driven decisions.',
      priceType: 'fixed',
      priceAmount: 1500,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
      maxSlots: 5,
      currentSlots: 2,
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-08'),
      updatedAt: now,
    },
    // Eric Liu (N4) - Full-Stack
    {
      id: 'matching-post-6',
      authorId: 'user-18',
      type: 'nunu-looking-for-vava',
      title: 'Full-Stack Development with AI',
      content: 'N4 Nunu teaching modern web development integrated with AI tools. Build real projects using React, TypeScript, and AI APIs. Hands-on practical approach with code reviews.',
      priceType: 'fixed',
      priceAmount: 900,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05'],
      maxSlots: 4,
      currentSlots: 2,
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-12'),
      updatedAt: now,
    },
    // Additional Nunu posts (7-12)
    {
      id: 'matching-post-10',
      authorId: 'user-2',
      type: 'nunu-looking-for-vava',
      title: 'Advanced Zapier Workflows',
      content: 'Take your automation skills to the next level. Learn complex multi-step Zaps, conditional logic, and API integrations. For those who already know the basics.',
      priceType: 'fixed',
      priceAmount: 1200,
      priceCurrency: 'TWD',
      availableMonths: ['2026-03', '2026-04', '2026-05'],
      maxSlots: 3,
      currentSlots: 1,
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
    },
    {
      id: 'matching-post-11',
      authorId: 'user-4',
      type: 'nunu-looking-for-vava',
      title: '[Certified] ChatGPT for Professionals',
      content: 'Learn advanced prompt engineering techniques for business applications. Custom GPTs, API usage, and enterprise integration strategies.',
      priceType: 'fixed',
      priceAmount: 2500,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      maxSlots: 4,
      currentSlots: 2,
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-08'),
      updatedAt: now,
    },
    {
      id: 'matching-post-12',
      authorId: 'user-10',
      type: 'nunu-looking-for-vava',
      title: '[Master N1] AI Career Transformation',
      content: 'Comprehensive 6-month program to transition into AI-powered roles. Career coaching, portfolio building, and interview prep included.',
      priceType: 'fixed',
      priceAmount: 5000,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
      maxSlots: 2,
      currentSlots: 1,
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-03'),
      updatedAt: now,
    },
    {
      id: 'matching-post-13',
      authorId: 'user-11',
      type: 'nunu-looking-for-vava',
      title: 'AI Writing Assistant Basics',
      content: 'Learn to use AI for writing - emails, reports, social media content. Perfect for non-tech professionals who want to save time.',
      priceType: 'fixed',
      priceAmount: 500,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03'],
      maxSlots: 5,
      currentSlots: 1,
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-20'),
      updatedAt: now,
    },
    {
      id: 'matching-post-14',
      authorId: 'user-14',
      type: 'nunu-looking-for-vava',
      title: '[Certified] AI for Startups',
      content: 'Strategic AI implementation for early-stage startups. Learn to build AI-first products and leverage AI for rapid growth.',
      priceType: 'fixed',
      priceAmount: 1800,
      priceCurrency: 'TWD',
      availableMonths: ['2026-03', '2026-04', '2026-05'],
      maxSlots: 3,
      currentSlots: 0,
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    {
      id: 'matching-post-15',
      authorId: 'user-18',
      type: 'nunu-looking-for-vava',
      title: 'AI-Powered Mobile Apps',
      content: 'Build mobile apps with integrated AI features. React Native + AI APIs. Project-based learning with real deployable apps.',
      priceType: 'fixed',
      priceAmount: 1100,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      maxSlots: 4,
      currentSlots: 1,
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-14'),
      updatedAt: now,
    },

    // === VAVA POSTS (Looking for Nunu) - 12 posts ===
    // Lisa Chen - Seeking Patient Mentor
    {
      id: 'matching-post-7',
      authorId: 'user-8',
      type: 'vava-looking-for-nunu',
      title: 'Seeking Patient Mentor for AI Basics',
      content: 'Complete beginner looking for a patient Nunu who can explain concepts clearly. I have no technical background but am eager to learn. Looking for 2-3 months to build a foundation.',
      priceType: 'range',
      priceMin: 500,
      priceMax: 1000,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-20'),
      updatedAt: now,
    },
    // Noah Lin - Looking for Verified Nunu
    {
      id: 'matching-post-8',
      authorId: 'user-15',
      type: 'vava-looking-for-nunu',
      title: 'Software Dev Seeking Certified Nunu',
      content: 'Experienced software developer wanting to learn advanced AI techniques. Looking for a Certified Nunu who can teach prompt engineering and AI integration at a professional level. Willing to commit 3-6 months.',
      priceType: 'range',
      priceMin: 1500,
      priceMax: 2500,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-16'),
      updatedAt: now,
    },
    // Tom Huang - Automation Learning (pending Nunu)
    {
      id: 'matching-post-9',
      authorId: 'user-9',
      type: 'vava-looking-for-nunu',
      title: 'Want to Learn Automation Tools',
      content: 'Open source contributor wanting to learn automation to improve my workflow. Interested in Make.com and Zapier. Flexible on schedule, looking for 2 months initially.',
      priceType: 'range',
      priceMin: 800,
      priceMax: 1200,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-19'),
      updatedAt: now,
    },
    // Additional Vava posts (16-24)
    {
      id: 'matching-post-16',
      authorId: 'user-1',
      type: 'vava-looking-for-nunu',
      title: 'Marketing Manager Learning AI',
      content: 'Marketing professional looking to integrate AI into campaigns. Need help with AI copywriting, image generation, and analytics. Budget flexible for the right mentor.',
      priceType: 'range',
      priceMin: 1000,
      priceMax: 1800,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-18'),
      updatedAt: now,
    },
    {
      id: 'matching-post-17',
      authorId: 'user-3',
      type: 'vava-looking-for-nunu',
      title: 'Designer Exploring AI Art Tools',
      content: 'Graphic designer wanting to learn Midjourney, DALL-E, and Stable Diffusion. Looking for someone who can teach artistic prompting techniques.',
      priceType: 'range',
      priceMin: 600,
      priceMax: 1200,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-17'),
      updatedAt: now,
    },
    {
      id: 'matching-post-18',
      authorId: 'user-5',
      type: 'vava-looking-for-nunu',
      title: 'Entrepreneur Needs AI Strategy',
      content: 'Running a small e-commerce business. Want to learn how AI can help with customer service, inventory, and marketing. Need practical, actionable guidance.',
      priceType: 'range',
      priceMin: 1500,
      priceMax: 3000,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05'],
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
    },
    {
      id: 'matching-post-19',
      authorId: 'user-6',
      type: 'vava-looking-for-nunu',
      title: 'Teacher Learning AI for Education',
      content: 'High school teacher wanting to use AI tools in the classroom responsibly. Looking for guidance on educational AI applications and ethics.',
      priceType: 'range',
      priceMin: 400,
      priceMax: 800,
      priceCurrency: 'TWD',
      availableMonths: ['2026-03', '2026-04'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-19'),
      updatedAt: now,
    },
    {
      id: 'matching-post-20',
      authorId: 'user-7',
      type: 'vava-looking-for-nunu',
      title: 'Data Analyst Upskilling in AI',
      content: 'Already proficient in Excel and SQL. Want to learn AI-powered data analysis tools and predictive modeling basics.',
      priceType: 'range',
      priceMin: 1200,
      priceMax: 2000,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-16'),
      updatedAt: now,
    },
    {
      id: 'matching-post-21',
      authorId: 'user-12',
      type: 'vava-looking-for-nunu',
      title: 'Freelancer Wants AI Productivity',
      content: 'Freelance writer and consultant. Need to learn AI tools to be more productive and competitive. Looking for practical, immediately applicable skills.',
      priceType: 'range',
      priceMin: 700,
      priceMax: 1100,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-20'),
      updatedAt: now,
    },
    {
      id: 'matching-post-22',
      authorId: 'user-13',
      type: 'vava-looking-for-nunu',
      title: 'Student Preparing for AI Career',
      content: 'University student in computer science. Want guidance on AI career paths and skills to develop. Looking for mentorship beyond just technical skills.',
      priceType: 'range',
      priceMin: 500,
      priceMax: 900,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-18'),
      updatedAt: now,
    },
    {
      id: 'matching-post-23',
      authorId: 'user-16',
      type: 'vava-looking-for-nunu',
      title: 'HR Manager Exploring AI Recruitment',
      content: 'Want to learn AI tools for recruitment, resume screening, and HR analytics. Need certified mentor who understands enterprise context.',
      priceType: 'range',
      priceMin: 1800,
      priceMax: 2800,
      priceCurrency: 'TWD',
      availableMonths: ['2026-03', '2026-04', '2026-05'],
      isVerifiedNunuOnly: true,
      isActive: true,
      createdAt: new Date('2026-01-14'),
      updatedAt: now,
    },
    {
      id: 'matching-post-24',
      authorId: 'user-17',
      type: 'vava-looking-for-nunu',
      title: 'Content Creator AI Workflow',
      content: 'YouTube content creator looking to streamline production with AI. Video scripting, thumbnail generation, and editing assistance.',
      priceType: 'range',
      priceMin: 900,
      priceMax: 1500,
      priceCurrency: 'TWD',
      availableMonths: ['2026-02', '2026-03', '2026-04'],
      isVerifiedNunuOnly: false,
      isActive: true,
      createdAt: new Date('2026-01-17'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // MATCHING POST STATS
  // ==========================================
  db.matchingPostStats.createMany([
    { postId: 'matching-post-1', viewCount: 156, commentCount: 8, lastUpdatedAt: now },
    { postId: 'matching-post-2', viewCount: 234, commentCount: 12, lastUpdatedAt: now },
    { postId: 'matching-post-3', viewCount: 312, commentCount: 15, lastUpdatedAt: now },
    { postId: 'matching-post-4', viewCount: 89, commentCount: 5, lastUpdatedAt: now },
    { postId: 'matching-post-5', viewCount: 178, commentCount: 9, lastUpdatedAt: now },
    { postId: 'matching-post-6', viewCount: 145, commentCount: 7, lastUpdatedAt: now },
    { postId: 'matching-post-7', viewCount: 67, commentCount: 4, lastUpdatedAt: now },
    { postId: 'matching-post-8', viewCount: 98, commentCount: 6, lastUpdatedAt: now },
    { postId: 'matching-post-9', viewCount: 45, commentCount: 3, lastUpdatedAt: now },
    // New posts stats
    { postId: 'matching-post-10', viewCount: 112, commentCount: 6, lastUpdatedAt: now },
    { postId: 'matching-post-11', viewCount: 189, commentCount: 10, lastUpdatedAt: now },
    { postId: 'matching-post-12', viewCount: 267, commentCount: 14, lastUpdatedAt: now },
    { postId: 'matching-post-13', viewCount: 78, commentCount: 4, lastUpdatedAt: now },
    { postId: 'matching-post-14', viewCount: 134, commentCount: 7, lastUpdatedAt: now },
    { postId: 'matching-post-15', viewCount: 98, commentCount: 5, lastUpdatedAt: now },
    { postId: 'matching-post-16', viewCount: 56, commentCount: 3, lastUpdatedAt: now },
    { postId: 'matching-post-17', viewCount: 72, commentCount: 4, lastUpdatedAt: now },
    { postId: 'matching-post-18', viewCount: 123, commentCount: 8, lastUpdatedAt: now },
    { postId: 'matching-post-19', viewCount: 34, commentCount: 2, lastUpdatedAt: now },
    { postId: 'matching-post-20', viewCount: 89, commentCount: 5, lastUpdatedAt: now },
    { postId: 'matching-post-21', viewCount: 45, commentCount: 3, lastUpdatedAt: now },
    { postId: 'matching-post-22', viewCount: 67, commentCount: 4, lastUpdatedAt: now },
    { postId: 'matching-post-23', viewCount: 102, commentCount: 6, lastUpdatedAt: now },
    { postId: 'matching-post-24', viewCount: 78, commentCount: 4, lastUpdatedAt: now },
  ]);

  // ==========================================
  // MATCHING POST TAGS
  // ==========================================
  db.matchingPostTags.createMany([
    // Sarah Lin post
    { id: 'mpt-1-1', postId: 'matching-post-1', tag: 'Automation' },
    { id: 'mpt-1-2', postId: 'matching-post-1', tag: 'Make.com' },
    { id: 'mpt-1-3', postId: 'matching-post-1', tag: 'Zapier' },
    // Emily Huang post
    { id: 'mpt-2-1', postId: 'matching-post-2', tag: 'AI Strategy' },
    { id: 'mpt-2-2', postId: 'matching-post-2', tag: 'Business' },
    { id: 'mpt-2-3', postId: 'matching-post-2', tag: 'Certified' },
    // Amy Lin post
    { id: 'mpt-3-1', postId: 'matching-post-3', tag: 'Master Level' },
    { id: 'mpt-3-2', postId: 'matching-post-3', tag: 'Comprehensive' },
    { id: 'mpt-3-3', postId: 'matching-post-3', tag: 'Premium' },
    // Ryan Chen post
    { id: 'mpt-4-1', postId: 'matching-post-4', tag: 'Beginner' },
    { id: 'mpt-4-2', postId: 'matching-post-4', tag: 'ChatGPT' },
    { id: 'mpt-4-3', postId: 'matching-post-4', tag: 'Affordable' },
    // Sophia Wang post
    { id: 'mpt-5-1', postId: 'matching-post-5', tag: 'Product' },
    { id: 'mpt-5-2', postId: 'matching-post-5', tag: 'AI Integration' },
    { id: 'mpt-5-3', postId: 'matching-post-5', tag: 'Certified' },
    // Eric Liu post
    { id: 'mpt-6-1', postId: 'matching-post-6', tag: 'Full-Stack' },
    { id: 'mpt-6-2', postId: 'matching-post-6', tag: 'React' },
    { id: 'mpt-6-3', postId: 'matching-post-6', tag: 'TypeScript' },
    // Lisa Chen post
    { id: 'mpt-7-1', postId: 'matching-post-7', tag: 'Beginner' },
    { id: 'mpt-7-2', postId: 'matching-post-7', tag: 'Patient Mentor' },
    // Noah Lin post
    { id: 'mpt-8-1', postId: 'matching-post-8', tag: 'Advanced' },
    { id: 'mpt-8-2', postId: 'matching-post-8', tag: 'Prompt Engineering' },
    { id: 'mpt-8-3', postId: 'matching-post-8', tag: 'Professional' },
    // Tom Huang post
    { id: 'mpt-9-1', postId: 'matching-post-9', tag: 'Automation' },
    { id: 'mpt-9-2', postId: 'matching-post-9', tag: 'Make.com' },
    // New Nunu posts tags
    { id: 'mpt-10-1', postId: 'matching-post-10', tag: 'Zapier' },
    { id: 'mpt-10-2', postId: 'matching-post-10', tag: 'Advanced' },
    { id: 'mpt-10-3', postId: 'matching-post-10', tag: 'API' },
    { id: 'mpt-11-1', postId: 'matching-post-11', tag: 'ChatGPT' },
    { id: 'mpt-11-2', postId: 'matching-post-11', tag: 'Prompt Engineering' },
    { id: 'mpt-11-3', postId: 'matching-post-11', tag: 'Certified' },
    { id: 'mpt-12-1', postId: 'matching-post-12', tag: 'Career' },
    { id: 'mpt-12-2', postId: 'matching-post-12', tag: 'Master Level' },
    { id: 'mpt-12-3', postId: 'matching-post-12', tag: 'Long-term' },
    { id: 'mpt-13-1', postId: 'matching-post-13', tag: 'Writing' },
    { id: 'mpt-13-2', postId: 'matching-post-13', tag: 'Beginner' },
    { id: 'mpt-13-3', postId: 'matching-post-13', tag: 'Productivity' },
    { id: 'mpt-14-1', postId: 'matching-post-14', tag: 'Startup' },
    { id: 'mpt-14-2', postId: 'matching-post-14', tag: 'Strategy' },
    { id: 'mpt-14-3', postId: 'matching-post-14', tag: 'Certified' },
    { id: 'mpt-15-1', postId: 'matching-post-15', tag: 'Mobile' },
    { id: 'mpt-15-2', postId: 'matching-post-15', tag: 'React Native' },
    { id: 'mpt-15-3', postId: 'matching-post-15', tag: 'AI API' },
    // New Vava posts tags
    { id: 'mpt-16-1', postId: 'matching-post-16', tag: 'Marketing' },
    { id: 'mpt-16-2', postId: 'matching-post-16', tag: 'Content' },
    { id: 'mpt-16-3', postId: 'matching-post-16', tag: 'Analytics' },
    { id: 'mpt-17-1', postId: 'matching-post-17', tag: 'Design' },
    { id: 'mpt-17-2', postId: 'matching-post-17', tag: 'AI Art' },
    { id: 'mpt-17-3', postId: 'matching-post-17', tag: 'Midjourney' },
    { id: 'mpt-18-1', postId: 'matching-post-18', tag: 'E-commerce' },
    { id: 'mpt-18-2', postId: 'matching-post-18', tag: 'Business' },
    { id: 'mpt-18-3', postId: 'matching-post-18', tag: 'Strategy' },
    { id: 'mpt-19-1', postId: 'matching-post-19', tag: 'Education' },
    { id: 'mpt-19-2', postId: 'matching-post-19', tag: 'Teaching' },
    { id: 'mpt-19-3', postId: 'matching-post-19', tag: 'Ethics' },
    { id: 'mpt-20-1', postId: 'matching-post-20', tag: 'Data Analysis' },
    { id: 'mpt-20-2', postId: 'matching-post-20', tag: 'Predictive' },
    { id: 'mpt-20-3', postId: 'matching-post-20', tag: 'Analytics' },
    { id: 'mpt-21-1', postId: 'matching-post-21', tag: 'Freelance' },
    { id: 'mpt-21-2', postId: 'matching-post-21', tag: 'Productivity' },
    { id: 'mpt-21-3', postId: 'matching-post-21', tag: 'Writing' },
    { id: 'mpt-22-1', postId: 'matching-post-22', tag: 'Student' },
    { id: 'mpt-22-2', postId: 'matching-post-22', tag: 'Career' },
    { id: 'mpt-22-3', postId: 'matching-post-22', tag: 'Mentorship' },
    { id: 'mpt-23-1', postId: 'matching-post-23', tag: 'HR' },
    { id: 'mpt-23-2', postId: 'matching-post-23', tag: 'Recruitment' },
    { id: 'mpt-23-3', postId: 'matching-post-23', tag: 'Enterprise' },
    { id: 'mpt-24-1', postId: 'matching-post-24', tag: 'Content Creator' },
    { id: 'mpt-24-2', postId: 'matching-post-24', tag: 'YouTube' },
    { id: 'mpt-24-3', postId: 'matching-post-24', tag: 'Video' },
  ]);

  // ==========================================
  // MATCHING COMMENTS
  // ==========================================
  db.matchingComments.createMany([
    // Comments on Sarah Lin's post
    { id: 'mc-1', postId: 'matching-post-1', authorId: 'user-8', content: 'Is this suitable for complete beginners?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-12'), updatedAt: new Date('2026-01-12') },
    { id: 'mc-2', postId: 'matching-post-1', authorId: 'user-2', parentId: 'mc-1', content: 'Yes! I tailor my approach to your level. Beginners are welcome!', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-12'), updatedAt: new Date('2026-01-12') },
    { id: 'mc-3', postId: 'matching-post-1', authorId: 'user-3', content: 'How many sessions per month?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
    { id: 'mc-4', postId: 'matching-post-1', authorId: 'user-2', parentId: 'mc-3', content: 'Usually 4 sessions (1 per week), but we can adjust based on your needs.', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
    // Comments on Emily Huang's post
    { id: 'mc-5', postId: 'matching-post-2', authorId: 'user-15', content: 'Your track record is impressive! What industries have you worked with?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-08'), updatedAt: new Date('2026-01-08') },
    { id: 'mc-6', postId: 'matching-post-2', authorId: 'user-4', parentId: 'mc-5', content: 'I have worked with startups, e-commerce, and SaaS companies. Happy to discuss your specific case!', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-08'), updatedAt: new Date('2026-01-08') },
    // Comments on Amy Lin's post
    { id: 'mc-7', postId: 'matching-post-3', authorId: 'user-15', content: 'What does the premium program include?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-05'), updatedAt: new Date('2026-01-05') },
    { id: 'mc-8', postId: 'matching-post-3', authorId: 'user-10', parentId: 'mc-7', content: 'Weekly 90-min sessions, unlimited async Q&A, personalized learning roadmap, and priority scheduling.', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-05'), updatedAt: new Date('2026-01-05') },
    { id: 'mc-9', postId: 'matching-post-3', authorId: 'user-13', content: 'Is 3 months enough to see real progress?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-01-10') },
    { id: 'mc-10', postId: 'matching-post-3', authorId: 'user-10', parentId: 'mc-9', content: 'Absolutely! Most learners see significant improvement within the first month. 3 months is ideal for building a solid foundation.', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-01-10') },
    // Comments on Ryan Chen's post
    { id: 'mc-11', postId: 'matching-post-4', authorId: 'user-7', content: 'This seems perfect for me! Can I try 1 month first?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-19'), updatedAt: new Date('2026-01-19') },
    { id: 'mc-12', postId: 'matching-post-4', authorId: 'user-11', parentId: 'mc-11', content: 'Of course! 1-month trial is totally fine. We can extend if it works well.', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-19'), updatedAt: new Date('2026-01-19') },
    // Comments on Lisa's Vava post
    { id: 'mc-13', postId: 'matching-post-7', authorId: 'user-11', content: 'Hi! I think I would be a great fit for you. I am very patient with beginners!', isPrivate: true, isDeleted: false, createdAt: new Date('2026-01-21'), updatedAt: new Date('2026-01-21') },
    { id: 'mc-14', postId: 'matching-post-7', authorId: 'user-2', content: 'I would love to help you get started! Feel free to DM me to discuss.', isPrivate: true, isDeleted: false, createdAt: new Date('2026-01-22'), updatedAt: new Date('2026-01-22') },
  ]);

  // ==========================================
  // MENTORSHIP AGREEMENTS (Paid bookings)
  // ==========================================
  db.mentorshipAgreements.createMany([
    // Alex Chen bought from Sarah Lin (3 months)
    {
      id: 'agreement-1',
      postId: 'matching-post-1',
      nunuId: 'user-2',
      vavaId: 'user-1',
      agreedPrice: 800,
      agreedMonths: ['2026-02', '2026-03', '2026-04'],
      totalAmount: 2400,
      status: 'active',
      paymentStatus: 'paid',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      acceptedAt: new Date('2026-01-15'),
      startedAt: new Date('2026-02-01'),
    },
    // Kevin Lee bought from Emily Huang (2 months)
    {
      id: 'agreement-2',
      postId: 'matching-post-2',
      nunuId: 'user-4',
      vavaId: 'user-5',
      agreedPrice: 2000,
      agreedMonths: ['2026-02', '2026-03'],
      totalAmount: 4000,
      status: 'active',
      paymentStatus: 'paid',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-10'),
      createdAt: new Date('2026-01-10'),
      acceptedAt: new Date('2026-01-10'),
      startedAt: new Date('2026-02-01'),
    },
    // Jessica Wu bought from Amy Lin (6 months)
    {
      id: 'agreement-3',
      postId: 'matching-post-3',
      nunuId: 'user-10',
      vavaId: 'user-6',
      agreedPrice: 3500,
      agreedMonths: ['2026-02', '2026-03', '2026-04', '2026-05', '2026-06', '2026-07'],
      totalAmount: 21000,
      status: 'active',
      paymentStatus: 'paid',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-05'),
      createdAt: new Date('2026-01-05'),
      acceptedAt: new Date('2026-01-05'),
      startedAt: new Date('2026-02-01'),
    },
    // David Zhang bought from Ryan Chen (1 month)
    {
      id: 'agreement-4',
      postId: 'matching-post-4',
      nunuId: 'user-11',
      vavaId: 'user-7',
      agreedPrice: 600,
      agreedMonths: ['2026-02'],
      totalAmount: 600,
      status: 'active',
      paymentStatus: 'paid',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-20'),
      createdAt: new Date('2026-01-20'),
      acceptedAt: new Date('2026-01-20'),
      startedAt: new Date('2026-02-01'),
    },
    // Mia Huang bought from Sophia Wang (4 months)
    {
      id: 'agreement-5',
      postId: 'matching-post-5',
      nunuId: 'user-14',
      vavaId: 'user-12',
      agreedPrice: 1500,
      agreedMonths: ['2026-02', '2026-03', '2026-04', '2026-05'],
      totalAmount: 6000,
      status: 'active',
      paymentStatus: 'paid',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-12'),
      createdAt: new Date('2026-01-12'),
      acceptedAt: new Date('2026-01-12'),
      startedAt: new Date('2026-02-01'),
    },
    // Zoe Wu bought from Eric Liu (3 months)
    {
      id: 'agreement-6',
      postId: 'matching-post-6',
      nunuId: 'user-18',
      vavaId: 'user-17',
      agreedPrice: 900,
      agreedMonths: ['2026-02', '2026-03', '2026-04'],
      totalAmount: 2700,
      status: 'active',
      paymentStatus: 'paid',
      paymentMethod: 'credit-card',
      paidAt: new Date('2026-01-08'),
      createdAt: new Date('2026-01-08'),
      acceptedAt: new Date('2026-01-08'),
      startedAt: new Date('2026-02-01'),
    },
  ]);

  // ==========================================
  // MATCH RATINGS (Reviews from completed mentorships)
  // ==========================================
  db.matchRatings.createMany([
    // Sample ratings for Nunus
    { id: 'rating-1', matchId: 'mentorship-1', raterId: 'user-1', rateeId: 'user-2', rating: 5, feedback: 'Sarah is an amazing mentor! Very patient and explains concepts clearly.', createdAt: new Date('2026-01-22') },
    { id: 'rating-2', matchId: 'mentorship-2', raterId: 'user-5', rateeId: 'user-4', rating: 5, feedback: 'Emily has transformed how I think about AI strategy. Highly recommended!', createdAt: new Date('2026-01-21') },
    { id: 'rating-3', matchId: 'mentorship-3', raterId: 'user-6', rateeId: 'user-10', rating: 5, feedback: 'Amy is truly a master. The premium program is worth every penny.', createdAt: new Date('2026-01-22') },
    { id: 'rating-4', matchId: 'mentorship-4', raterId: 'user-7', rateeId: 'user-11', rating: 4, feedback: 'Ryan is very understanding and relates well to beginners. Great first experience!', createdAt: new Date('2026-01-22') },
    { id: 'rating-5', matchId: 'mentorship-5', raterId: 'user-12', rateeId: 'user-14', rating: 5, feedback: 'Sophia helped me integrate AI into my PM workflow. Game changer!', createdAt: new Date('2026-01-21') },
    { id: 'rating-6', matchId: 'mentorship-6', raterId: 'user-17', rateeId: 'user-18', rating: 4, feedback: 'Eric is a solid full-stack mentor. Building real projects together is great.', createdAt: new Date('2026-01-22') },
  ]);
}
