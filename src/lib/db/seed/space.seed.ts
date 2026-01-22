import type { MockDB } from '../core/MockDB';

/**
 * Seed space module data
 */
export async function seedSpace(db: MockDB): Promise<void> {
  const now = new Date();

  // Create companions
  db.companions.createMany([
    // Nunu (Go ticket)
    {
      id: 'companion-1',
      name: 'Amy',
      avatar: 'https://i.pravatar.cc/150?u=amy-nunu',
      type: 'nunu',
      bio: 'Loves helping beginners get started with AI tools, skilled at explaining complex concepts in simple ways.',
      discordId: 'amy#1234',
      isAvailable: true,
      matchCount: 28,
      avgRating: 4.8,
      totalRatings: 25,
      createdAt: new Date('2025-06-01'),
      updatedAt: now,
    },
    {
      id: 'companion-2',
      name: 'Ben',
      avatar: 'https://i.pravatar.cc/150?u=ben-nunu',
      type: 'nunu',
      bio: 'Focused on AI automation, can help you build workflows.',
      discordId: 'ben#5678',
      isAvailable: true,
      matchCount: 15,
      avgRating: 4.6,
      totalRatings: 14,
      createdAt: new Date('2025-07-01'),
      updatedAt: now,
    },
    {
      id: 'companion-3',
      name: 'Carol',
      avatar: 'https://i.pravatar.cc/150?u=carol-nunu',
      type: 'nunu',
      bio: 'Content creator, skilled at using AI to boost creative efficiency.',
      discordId: 'carol#9012',
      isAvailable: false,
      matchCount: 22,
      avgRating: 4.7,
      totalRatings: 20,
      createdAt: new Date('2025-08-01'),
      updatedAt: now,
    },
    // Certified Nunu (Run ticket)
    {
      id: 'companion-4',
      name: 'David',
      avatar: 'https://i.pravatar.cc/150?u=david-certified',
      type: 'certified-nunu',
      bio: 'Senior AI engineer, specializing in Prompt Engineering and AI application development.',
      discordId: 'david#3456',
      isAvailable: true,
      matchCount: 45,
      avgRating: 4.9,
      totalRatings: 42,
      createdAt: new Date('2025-05-01'),
      updatedAt: now,
    },
    {
      id: 'companion-5',
      name: 'Eva',
      avatar: 'https://i.pravatar.cc/150?u=eva-certified',
      type: 'certified-nunu',
      bio: 'AI Product Manager, helping you go from idea to execution.',
      discordId: 'eva#7890',
      isAvailable: true,
      matchCount: 38,
      avgRating: 4.8,
      totalRatings: 35,
      createdAt: new Date('2025-04-01'),
      updatedAt: now,
    },
    // Shangzhe (Fly ticket)
    {
      id: 'companion-6',
      name: 'Shangzhe',
      avatar: 'https://i.pravatar.cc/150?u=shangzhe',
      type: 'shangzhe',
      bio: 'nuvaClub founder, AI education expert, providing one-on-one in-depth consultation.',
      discordId: 'shangzhe#0001',
      isAvailable: true,
      matchCount: 120,
      avgRating: 5.0,
      totalRatings: 100,
      createdAt: new Date('2025-01-01'),
      updatedAt: now,
    },
  ]);

  // Create companion expertise
  db.companionExpertise.createMany([
    { id: 'exp-1-1', companionId: 'companion-1', expertise: 'ChatGPT' },
    { id: 'exp-1-2', companionId: 'companion-1', expertise: 'Beginner Tutorial' },
    { id: 'exp-1-3', companionId: 'companion-1', expertise: 'Copywriting' },
    { id: 'exp-2-1', companionId: 'companion-2', expertise: 'Make.com' },
    { id: 'exp-2-2', companionId: 'companion-2', expertise: 'Zapier' },
    { id: 'exp-2-3', companionId: 'companion-2', expertise: 'Automation' },
    { id: 'exp-3-1', companionId: 'companion-3', expertise: 'Content Creation' },
    { id: 'exp-3-2', companionId: 'companion-3', expertise: 'SEO' },
    { id: 'exp-3-3', companionId: 'companion-3', expertise: 'Social Media Management' },
    { id: 'exp-4-1', companionId: 'companion-4', expertise: 'Prompt Engineering' },
    { id: 'exp-4-2', companionId: 'companion-4', expertise: 'API Integration' },
    { id: 'exp-4-3', companionId: 'companion-4', expertise: 'Python' },
    { id: 'exp-5-1', companionId: 'companion-5', expertise: 'Product Planning' },
    { id: 'exp-5-2', companionId: 'companion-5', expertise: 'Project Management' },
    { id: 'exp-5-3', companionId: 'companion-5', expertise: 'AI Strategy' },
    { id: 'exp-6-1', companionId: 'companion-6', expertise: 'AI Strategy' },
    { id: 'exp-6-2', companionId: 'companion-6', expertise: 'Business Application' },
    { id: 'exp-6-3', companionId: 'companion-6', expertise: 'Career Development' },
  ]);

  // Create some sample matches (user-to-companion)
  db.matches.createMany([
    // Duo Run matched with certified nunu
    {
      id: 'match-1',
      userId: 'user-2',
      companionId: 'companion-4', // David (certified-nunu)
      ticketId: 'ticket-duo-run',
      status: 'active',
      matchedAt: new Date('2026-01-05'),
      acceptedAt: new Date('2026-01-05'),
      createdAt: new Date('2026-01-05'),
    },
    // Duo Fly matched with Shangzhe
    {
      id: 'match-2',
      userId: 'user-4',
      companionId: 'companion-6', // Shangzhe
      ticketId: 'ticket-duo-fly',
      status: 'active',
      matchedAt: new Date('2026-01-02'),
      acceptedAt: new Date('2026-01-02'),
      createdAt: new Date('2026-01-02'),
    },
    // Duo Go matched with nunu Amy
    {
      id: 'match-3',
      userId: 'user-6',
      companionId: 'companion-1', // Amy (nunu)
      ticketId: 'ticket-duo-go',
      status: 'active',
      matchedAt: new Date('2026-01-10'),
      acceptedAt: new Date('2026-01-10'),
      createdAt: new Date('2026-01-10'),
    },
  ]);

  // Create match ratings
  db.matchRatings.createMany([
    {
      id: 'rating-1',
      matchId: 'match-3',
      rating: 5,
      feedback: 'Great learning experience, Amy patiently answered all my questions!',
      createdAt: new Date('2026-01-15'),
    },
  ]);

  // ==========================================
  // User-to-User Mentorships (Nunu-Vava relationships)
  // ==========================================
  // Concept:
  // - Nunu = Mentor (the one who teaches/helps)
  // - Vava = Learner (the one being helped)
  //
  // Relationships:
  // - Duo Go User: has 1 nunu (user-10), is nunu to 1 vava (alice)
  // - Duo Run User: has 1 nunu (user-10), is nunu to 5 vava (bob, carol, dave, eve, frank)
  // - Duo Fly User: has 1 nunu (user-10), is nunu to 2 vava (grace, henry)
  // ==========================================

  db.userMentorships.createMany([
    // ==========================================
    // Nunu Mentor teaching duo users
    // ==========================================
    {
      id: 'mentorship-nunu-to-duo-go',
      nunuId: 'user-10',
      vavaId: 'user-6',
      status: 'active',
      startedAt: new Date('2025-12-15'),
      lastSessionAt: new Date('2026-01-20'),
      sessionCount: 8,
      notes: 'Duo Go Mei is progressing quickly, has mastered basic AI tools',
      createdAt: new Date('2025-12-15'),
      updatedAt: now,
    },
    {
      id: 'mentorship-nunu-to-duo-run',
      nunuId: 'user-10',
      vavaId: 'user-2',
      status: 'active',
      startedAt: new Date('2025-11-01'),
      lastSessionAt: new Date('2026-01-18'),
      sessionCount: 15,
      notes: 'Duo Run Daxiong is a serious learner, has started helping others',
      createdAt: new Date('2025-11-01'),
      updatedAt: now,
    },
    {
      id: 'mentorship-nunu-to-duo-fly',
      nunuId: 'user-10',
      vavaId: 'user-4',
      status: 'active',
      startedAt: new Date('2025-09-15'),
      lastSessionAt: new Date('2026-01-21'),
      sessionCount: 25,
      notes: 'Duo Fly Xiaofei is the most senior learner, preparing to become a certified mentor',
      createdAt: new Date('2025-09-15'),
      updatedAt: now,
    },

    // ==========================================
    // Duo Go User (user-6) as Nunu - teaching 1 vava
    // ==========================================
    {
      id: 'mentorship-duo-go-to-alice',
      nunuId: 'user-6',
      vavaId: 'user-5',
      status: 'active',
      startedAt: new Date('2026-01-05'),
      lastSessionAt: new Date('2026-01-19'),
      sessionCount: 3,
      notes: 'Alice just started learning, needs basic beginner guidance',
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },

    // ==========================================
    // Duo Run User (user-2) as Nunu - teaching 5 vava
    // ==========================================
    {
      id: 'mentorship-duo-run-to-bob',
      nunuId: 'user-2',
      vavaId: 'user-7',
      status: 'active',
      startedAt: new Date('2025-11-15'),
      lastSessionAt: new Date('2026-01-18'),
      sessionCount: 12,
      notes: 'Bob is focused on learning automation',
      createdAt: new Date('2025-11-15'),
      updatedAt: now,
    },
    {
      id: 'mentorship-duo-run-to-carol',
      nunuId: 'user-2',
      vavaId: 'user-8',
      status: 'active',
      startedAt: new Date('2025-11-20'),
      lastSessionAt: new Date('2026-01-17'),
      sessionCount: 10,
      notes: 'Carol is interested in content creation',
      createdAt: new Date('2025-11-20'),
      updatedAt: now,
    },
    {
      id: 'mentorship-duo-run-to-dave',
      nunuId: 'user-2',
      vavaId: 'user-1',
      status: 'active',
      startedAt: new Date('2025-12-01'),
      lastSessionAt: new Date('2026-01-15'),
      sessionCount: 8,
      notes: 'Dave is learning prompt engineering',
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
    },
    {
      id: 'mentorship-duo-run-to-eve',
      nunuId: 'user-2',
      vavaId: 'user-3',
      status: 'active',
      startedAt: new Date('2025-12-10'),
      lastSessionAt: new Date('2026-01-14'),
      sessionCount: 6,
      notes: 'Eve is focused on image generation',
      createdAt: new Date('2025-12-10'),
      updatedAt: now,
    },
    {
      id: 'mentorship-duo-run-to-frank',
      nunuId: 'user-2',
      vavaId: 'user-9',
      status: 'active',
      startedAt: new Date('2026-01-01'),
      lastSessionAt: new Date('2026-01-13'),
      sessionCount: 4,
      notes: 'Frank is a newly joined learner',
      createdAt: new Date('2026-01-01'),
      updatedAt: now,
    },

    // ==========================================
    // Duo Fly User (user-4) as Nunu - teaching 2 vava
    // ==========================================
    {
      id: 'mentorship-duo-fly-to-grace',
      nunuId: 'user-4',
      vavaId: 'user-5',
      status: 'active',
      startedAt: new Date('2025-10-15'),
      lastSessionAt: new Date('2026-01-19'),
      sessionCount: 18,
      notes: 'Grace is already an advanced learner',
      createdAt: new Date('2025-10-15'),
      updatedAt: now,
    },
    {
      id: 'mentorship-duo-fly-to-henry',
      nunuId: 'user-4',
      vavaId: 'user-7',
      status: 'active',
      startedAt: new Date('2025-11-01'),
      lastSessionAt: new Date('2026-01-18'),
      sessionCount: 14,
      notes: 'Henry is focused on business applications',
      createdAt: new Date('2025-11-01'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // Nunu Applications
  // ==========================================
  db.nunuApplications.createMany([
    // Approved application (Duo Run user)
    {
      id: 'nunu-app-1',
      userId: 'user-2',
      status: 'approved',
      applicationText:
        'I have been using AI tools for over a year, especially skilled in automation workflows and Prompt Engineering. I hope to help more people get started with AI and share my experience.',
      expertise: ['Prompt Engineering', 'Automation', 'Make.com'],
      discordId: 'daxiong#5678',
      submittedAt: new Date('2025-10-01'),
      reviewedAt: new Date('2025-10-05'),
      reviewedBy: 'admin-1',
      createdAt: new Date('2025-10-01'),
      updatedAt: new Date('2025-10-05'),
    },
    // Approved verified application (Duo Fly user)
    {
      id: 'nunu-app-2',
      userId: 'user-4',
      status: 'approved',
      applicationText:
        'As a senior AI user, I have extensive experience in AI strategy planning and business applications. I hope to become a Certified Nunu and help more learners.',
      expertise: ['AI Strategy', 'Business Application', 'Product Planning'],
      discordId: 'xiaofei#9012',
      submittedAt: new Date('2025-08-15'),
      reviewedAt: new Date('2025-08-20'),
      reviewedBy: 'admin-1',
      createdAt: new Date('2025-08-15'),
      updatedAt: new Date('2025-08-20'),
    },
    // Pending application
    {
      id: 'nunu-app-3',
      userId: 'user-7',
      status: 'pending',
      applicationText:
        'I have been learning automation for half a year and want to start helping other beginners. My Nunu is a Duo Run user, and he recommended that I apply.',
      expertise: ['Automation', 'Zapier', 'Beginner Tutorial'],
      discordId: 'bob#1111',
      submittedAt: new Date('2026-01-15'),
      createdAt: new Date('2026-01-15'),
      updatedAt: new Date('2026-01-15'),
    },
    // Rejected application
    {
      id: 'nunu-app-4',
      userId: 'user-8',
      status: 'rejected',
      applicationText: 'I want to be a Nunu to help others.',
      expertise: ['ChatGPT'],
      discordId: 'carol#2222',
      submittedAt: new Date('2026-01-10'),
      reviewedAt: new Date('2026-01-12'),
      reviewedBy: 'admin-1',
      rejectionReason: 'Application content is too brief, please provide more details about your experience and expertise. You are welcome to reapply!',
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-12'),
    },
  ]);

  // ==========================================
  // Nunu Profiles (for approved Nunus)
  // ==========================================
  db.nunuProfiles.createMany([
    // Duo Run user as N4 Regular Nunu
    {
      id: 'nunu-profile-1',
      userId: 'user-2',
      applicationId: 'nunu-app-1',
      level: 'N4',
      type: 'regular',
      bio: 'Skilled in automation workflow design, helping you boost work efficiency with AI.',
      expertise: ['Prompt Engineering', 'Automation', 'Make.com'],
      discordId: 'daxiong#5678',
      currentVavaCount: 5,
      totalMentorships: 8,
      avgRating: 4.7,
      totalRatings: 6,
      isAvailable: true,
      createdAt: new Date('2025-10-05'),
      updatedAt: now,
    },
    // Duo Fly user as N2 Verified Nunu
    {
      id: 'nunu-profile-2',
      userId: 'user-4',
      applicationId: 'nunu-app-2',
      level: 'N2',
      type: 'verified',
      bio: 'Senior AI strategy consultant, focused on helping learners apply AI to real business scenarios.',
      expertise: ['AI Strategy', 'Business Application', 'Product Planning'],
      discordId: 'xiaofei#9012',
      currentVavaCount: 2,
      totalMentorships: 15,
      avgRating: 4.9,
      totalRatings: 12,
      isAvailable: true,
      createdAt: new Date('2025-08-20'),
      updatedAt: now,
    },
    // The dedicated nunu mentor as N1 Verified
    {
      id: 'nunu-profile-3',
      userId: 'user-10',
      applicationId: 'nunu-app-mentor', // implied application
      level: 'N1',
      type: 'verified',
      bio: 'Senior mentor with extensive teaching experience, has helped over a hundred learners.',
      expertise: ['Comprehensive Guidance', 'AI Strategy', 'Prompt Engineering', 'Business Application'],
      discordId: 'mentor#0001',
      currentVavaCount: 3,
      totalMentorships: 120,
      avgRating: 5.0,
      totalRatings: 100,
      isAvailable: true,
      createdAt: new Date('2025-01-01'),
      updatedAt: now,
    },
  ]);

  // ==========================================
  // Matching Board Posts
  // ==========================================
  db.matchingPosts.createMany([
    // Offering Nunu post (Regular)
    {
      id: 'matching-post-1',
      authorId: 'user-2',
      type: 'nunu-looking-for-vava',
      title: 'Automation Expert Looking for Vava! Learn Make.com and Zapier Together',
      content:
        'I am a Nunu focused on automation, skilled in Make.com, Zapier, and other tools. If you want to learn how to automate workflows, feel free to match with me!\n\nMy teaching style is hands-on oriented, I will guide you step by step to build your own automation workflows.',
      timeSelection: 'monthly',
      timePeriod: '2026-02',
      isVerifiedNunuOnly: false,
      viewCount: 45,
      isActive: true,
      createdAt: new Date('2026-01-10'),
      updatedAt: now,
    },
    // Offering Nunu post (Verified)
    {
      id: 'matching-post-2',
      authorId: 'user-4',
      type: 'nunu-looking-for-vava',
      title: '[Certified Nunu] AI Strategy and Business Application Guidance',
      content:
        'As a Certified Nunu, I focus on helping learners apply AI to real business scenarios.\n\nSuitable for:\n- Professionals who want to integrate AI into their work\n- People interested in AI product planning\n- Learners who want to develop AI strategic thinking\n\nWeekly online consultation, seasonal matching.',
      timeSelection: 'seasonal',
      timePeriod: '2026-Q1',
      isVerifiedNunuOnly: true,
      viewCount: 78,
      isActive: true,
      createdAt: new Date('2026-01-05'),
      updatedAt: now,
    },
    // Looking for Nunu post
    {
      id: 'matching-post-3',
      authorId: 'user-5',
      type: 'vava-looking-for-nunu',
      title: 'Beginner Looking for Nunu! Want to Learn AI Copywriting',
      content:
        'I am a beginner with AI tools, hoping to find a patient Nunu to guide me.\n\nI especially want to learn:\n- Basic ChatGPT operations\n- AI-assisted copywriting\n- Prompt writing techniques\n\nMy schedule is flexible, hoping to have a session once a week!',
      timeSelection: 'monthly',
      timePeriod: '2026-02',
      isVerifiedNunuOnly: false,
      viewCount: 23,
      isActive: true,
      createdAt: new Date('2026-01-18'),
      updatedAt: now,
    },
    // Looking for Vava post
    {
      id: 'matching-post-4',
      authorId: 'user-10',
      type: 'nunu-looking-for-vava',
      title: 'Master-Level Nunu Recruiting Vava! Comprehensive AI Guidance',
      content:
        'I am an N1 level Certified Nunu with extensive teaching experience.\n\nCurrently opening 2 Vava slots, suitable for:\n- Learners who are serious about learning AI\n- People willing to invest time in practice\n- Friends with long-term AI learning plans\n\nAfter matching, I will create a learning plan based on your needs.',
      timeSelection: 'seasonal',
      timePeriod: '2026-Q1',
      isVerifiedNunuOnly: true,
      viewCount: 156,
      isActive: true,
      createdAt: new Date('2026-01-02'),
      updatedAt: now,
    },
    // Another looking for nunu (for verified)
    {
      id: 'matching-post-5',
      authorId: 'user-5',
      type: 'vava-looking-for-nunu',
      title: 'Advanced Learner Looking for Certified Nunu! Want to Dive Deep into AI Product Planning',
      content:
        'I already have a solid AI foundation and now want to dive deeper into AI product planning.\n\nLooking for a Nunu who:\n- Has AI product experience\n- Can guide on business applications\n- Certified Nunu preferred\n\nI am currently working on my own AI side project and hope to get guidance.',
      timeSelection: 'seasonal',
      timePeriod: '2026-Q1',
      isVerifiedNunuOnly: true,
      viewCount: 34,
      isActive: true,
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
    },
    // Inactive post (closed)
    {
      id: 'matching-post-6',
      authorId: 'user-6',
      type: 'nunu-looking-for-vava',
      title: '[Matched] Beginner Nunu Looking for Vava',
      content: 'I am a beginner Nunu, looking for a Vava to grow and learn together.',
      timeSelection: 'monthly',
      timePeriod: '2026-01',
      isVerifiedNunuOnly: false,
      viewCount: 12,
      isActive: false,
      createdAt: new Date('2025-12-20'),
      updatedAt: new Date('2026-01-05'),
    },
  ]);

  // ==========================================
  // Matching Post Tags
  // ==========================================
  db.matchingPostTags.createMany([
    // Post 1 tags
    { id: 'mpt-1-1', postId: 'matching-post-1', tag: 'Automation' },
    { id: 'mpt-1-2', postId: 'matching-post-1', tag: 'Make.com' },
    { id: 'mpt-1-3', postId: 'matching-post-1', tag: 'Zapier' },
    // Post 2 tags
    { id: 'mpt-2-1', postId: 'matching-post-2', tag: 'AI Strategy' },
    { id: 'mpt-2-2', postId: 'matching-post-2', tag: 'Business Application' },
    { id: 'mpt-2-3', postId: 'matching-post-2', tag: 'Product Planning' },
    // Post 3 tags
    { id: 'mpt-3-1', postId: 'matching-post-3', tag: 'ChatGPT' },
    { id: 'mpt-3-2', postId: 'matching-post-3', tag: 'Copywriting' },
    { id: 'mpt-3-3', postId: 'matching-post-3', tag: 'Beginner' },
    // Post 4 tags
    { id: 'mpt-4-1', postId: 'matching-post-4', tag: 'Comprehensive Guidance' },
    { id: 'mpt-4-2', postId: 'matching-post-4', tag: 'AI Strategy' },
    { id: 'mpt-4-3', postId: 'matching-post-4', tag: 'N1 Level' },
    // Post 5 tags
    { id: 'mpt-5-1', postId: 'matching-post-5', tag: 'Product Planning' },
    { id: 'mpt-5-2', postId: 'matching-post-5', tag: 'Advanced Learning' },
    { id: 'mpt-5-3', postId: 'matching-post-5', tag: 'AI Strategy' },
    // Post 6 tags
    { id: 'mpt-6-1', postId: 'matching-post-6', tag: 'Beginner Tutorial' },
  ]);

  // ==========================================
  // Matching Comments
  // ==========================================
  db.matchingComments.createMany([
    // Comments on post 1 (Offering Nunu - automation)
    {
      id: 'mc-1',
      postId: 'matching-post-1',
      authorId: 'user-1',
      content: 'What is your teaching style like? How much time is needed per week?',
      isPrivate: false,
      createdAt: new Date('2026-01-11'),
      updatedAt: new Date('2026-01-11'),
    },
    {
      id: 'mc-2',
      postId: 'matching-post-1',
      authorId: 'user-2',
      content: 'About 1-2 hours of online communication per week, plus some homework for hands-on practice!',
      isPrivate: false,
      parentId: 'mc-1',
      createdAt: new Date('2026-01-11'),
      updatedAt: new Date('2026-01-11'),
    },
    {
      id: 'mc-3',
      postId: 'matching-post-1',
      authorId: 'user-3',
      content: 'I am very interested in Make.com! Are there still slots available?',
      isPrivate: false,
      createdAt: new Date('2026-01-12'),
      updatedAt: new Date('2026-01-12'),
    },
    // Comments on post 2 (Verified Nunu - AI Strategy)
    {
      id: 'mc-4',
      postId: 'matching-post-2',
      authorId: 'user-5',
      content: 'How would you guide someone who wants to do an AI side project?',
      isPrivate: false,
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-08'),
    },
    {
      id: 'mc-5',
      postId: 'matching-post-2',
      authorId: 'user-4',
      content:
        'I would first understand your project goals, then plan the technical roadmap and business model together. Feel free to DM me for a detailed chat!',
      isPrivate: false,
      parentId: 'mc-4',
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-08'),
    },
    // Private comment on post 3
    {
      id: 'mc-6',
      postId: 'matching-post-3',
      authorId: 'user-2',
      content: 'Hi! I think I can help you get started. Want to chat privately? Here is my Discord: daxiong#5678',
      isPrivate: true,
      createdAt: new Date('2026-01-19'),
      updatedAt: new Date('2026-01-19'),
    },
    // Comments on post 4
    {
      id: 'mc-7',
      postId: 'matching-post-4',
      authorId: 'user-7',
      content: 'N1 level is amazing! What are your requirements for learners?',
      isPrivate: false,
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
    {
      id: 'mc-8',
      postId: 'matching-post-4',
      authorId: 'user-10',
      content:
        'Mainly hoping learners have clear learning goals and are willing to invest at least 3-5 hours per week in learning and practice. Attitude matters more than ability!',
      isPrivate: false,
      parentId: 'mc-7',
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-05'),
    },
    {
      id: 'mc-9',
      postId: 'matching-post-4',
      authorId: 'user-5',
      content: 'I really want to be mentored! But I am a complete beginner, not sure if I am suitable?',
      isPrivate: false,
      createdAt: new Date('2026-01-06'),
      updatedAt: new Date('2026-01-06'),
    },
    {
      id: 'mc-10',
      postId: 'matching-post-4',
      authorId: 'user-10',
      content: 'Beginners are welcome! The key is passion and determination to learn. If interested, feel free to DM me to discuss your background and goals.',
      isPrivate: false,
      parentId: 'mc-9',
      createdAt: new Date('2026-01-06'),
      updatedAt: new Date('2026-01-06'),
    },
    // Comments on post 5
    {
      id: 'mc-11',
      postId: 'matching-post-5',
      authorId: 'user-4',
      content: 'Your background sounds like a great fit for my mentoring direction! Would you mind sharing the project you are currently working on?',
      isPrivate: false,
      createdAt: new Date('2026-01-16'),
      updatedAt: new Date('2026-01-16'),
    },
    {
      id: 'mc-12',
      postId: 'matching-post-5',
      authorId: 'user-5',
      content: 'It is a project using AI for content recommendation! I can DM you for more details~',
      isPrivate: false,
      parentId: 'mc-11',
      createdAt: new Date('2026-01-16'),
      updatedAt: new Date('2026-01-16'),
    },
  ]);
}
