import type { MockDB } from '../core/MockDB';

/**
 * Seed space module data
 * Following 3NF normalization with proper junction tables
 */
export async function seedSpace(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // COMPANIONS
  // ==========================================
  db.companions.createMany([
    // Nunu (Go ticket)
    { id: 'companion-1', name: 'Amy', avatar: 'https://i.pravatar.cc/150?u=amy-nunu', type: 'nunu', bio: 'Loves helping beginners get started with AI tools, skilled at explaining complex concepts in simple ways.', discordId: 'amy#1234', isAvailable: true, createdAt: new Date('2025-06-01'), updatedAt: now },
    { id: 'companion-2', name: 'Ben', avatar: 'https://i.pravatar.cc/150?u=ben-nunu', type: 'nunu', bio: 'Focused on AI automation, can help you build workflows.', discordId: 'ben#5678', isAvailable: true, createdAt: new Date('2025-07-01'), updatedAt: now },
    { id: 'companion-3', name: 'Carol', avatar: 'https://i.pravatar.cc/150?u=carol-nunu', type: 'nunu', bio: 'Content creator, skilled at using AI to boost creative efficiency.', discordId: 'carol#9012', isAvailable: false, createdAt: new Date('2025-08-01'), updatedAt: now },
    // Certified Nunu (Run ticket)
    { id: 'companion-4', name: 'David', avatar: 'https://i.pravatar.cc/150?u=david-certified', type: 'certified-nunu', bio: 'Senior AI engineer, specializing in Prompt Engineering and AI application development.', discordId: 'david#3456', isAvailable: true, createdAt: new Date('2025-05-01'), updatedAt: now },
    { id: 'companion-5', name: 'Eva', avatar: 'https://i.pravatar.cc/150?u=eva-certified', type: 'certified-nunu', bio: 'AI Product Manager, helping you go from idea to execution.', discordId: 'eva#7890', isAvailable: true, createdAt: new Date('2025-04-01'), updatedAt: now },
    // Shangzhe (Fly ticket)
    { id: 'companion-6', name: 'Shangzhe', avatar: 'https://i.pravatar.cc/150?u=shangzhe', type: 'shangzhe', bio: 'nuvaClub founder, AI education expert, providing one-on-one in-depth consultation.', discordId: 'shangzhe#0001', isAvailable: true, createdAt: new Date('2025-01-01'), updatedAt: now },
  ]);

  // ==========================================
  // COMPANION EXPERTISE (Junction Table - 1NF)
  // ==========================================
  db.companionExpertise.createMany([
    { id: 'exp-1-1', companionId: 'companion-1', expertise: 'ChatGPT', sortOrder: 1 },
    { id: 'exp-1-2', companionId: 'companion-1', expertise: 'Beginner Tutorial', sortOrder: 2 },
    { id: 'exp-1-3', companionId: 'companion-1', expertise: 'Copywriting', sortOrder: 3 },
    { id: 'exp-2-1', companionId: 'companion-2', expertise: 'Make.com', sortOrder: 1 },
    { id: 'exp-2-2', companionId: 'companion-2', expertise: 'Zapier', sortOrder: 2 },
    { id: 'exp-2-3', companionId: 'companion-2', expertise: 'Automation', sortOrder: 3 },
    { id: 'exp-3-1', companionId: 'companion-3', expertise: 'Content Creation', sortOrder: 1 },
    { id: 'exp-3-2', companionId: 'companion-3', expertise: 'SEO', sortOrder: 2 },
    { id: 'exp-3-3', companionId: 'companion-3', expertise: 'Social Media Management', sortOrder: 3 },
    { id: 'exp-4-1', companionId: 'companion-4', expertise: 'Prompt Engineering', sortOrder: 1 },
    { id: 'exp-4-2', companionId: 'companion-4', expertise: 'API Integration', sortOrder: 2 },
    { id: 'exp-4-3', companionId: 'companion-4', expertise: 'Python', sortOrder: 3 },
    { id: 'exp-5-1', companionId: 'companion-5', expertise: 'Product Planning', sortOrder: 1 },
    { id: 'exp-5-2', companionId: 'companion-5', expertise: 'Project Management', sortOrder: 2 },
    { id: 'exp-5-3', companionId: 'companion-5', expertise: 'AI Strategy', sortOrder: 3 },
    { id: 'exp-6-1', companionId: 'companion-6', expertise: 'AI Strategy', sortOrder: 1 },
    { id: 'exp-6-2', companionId: 'companion-6', expertise: 'Business Application', sortOrder: 2 },
    { id: 'exp-6-3', companionId: 'companion-6', expertise: 'Career Development', sortOrder: 3 },
  ]);

  // ==========================================
  // COMPANION STATS (Denormalized)
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
  // MATCHES
  // ==========================================
  db.matches.createMany([
    { id: 'match-1', userId: 'user-2', companionId: 'companion-4', ticketId: 'ticket-user-2', status: 'active', requestedAt: new Date('2026-01-05'), acceptedAt: new Date('2026-01-05'), activatedAt: new Date('2026-01-05'), createdAt: new Date('2026-01-05'), updatedAt: now },
    { id: 'match-2', userId: 'user-4', companionId: 'companion-6', ticketId: 'ticket-user-4', status: 'active', requestedAt: new Date('2026-01-02'), acceptedAt: new Date('2026-01-02'), activatedAt: new Date('2026-01-02'), createdAt: new Date('2026-01-02'), updatedAt: now },
    { id: 'match-3', userId: 'user-6', companionId: 'companion-1', ticketId: 'ticket-user-6', status: 'active', requestedAt: new Date('2026-01-10'), acceptedAt: new Date('2026-01-10'), activatedAt: new Date('2026-01-10'), createdAt: new Date('2026-01-10'), updatedAt: now },
  ]);

  // ==========================================
  // MATCH RATINGS
  // ==========================================
  db.matchRatings.createMany([
    { id: 'rating-1', matchId: 'match-3', raterId: 'user-6', rateeId: 'companion-1', rating: 5, feedback: 'Great learning experience, Amy patiently answered all my questions!', createdAt: new Date('2026-01-15') },
  ]);

  // ==========================================
  // NUNU APPLICATIONS
  // ==========================================
  db.nunuApplications.createMany([
    { id: 'nunu-app-1', userId: 'user-2', status: 'approved', applicationText: 'I have been using AI tools for over a year, especially skilled in automation workflows and Prompt Engineering.', discordId: 'sarahlin#5678', submittedAt: new Date('2025-10-01'), reviewedAt: new Date('2025-10-05'), reviewedBy: 'admin-1', createdAt: new Date('2025-10-01'), updatedAt: new Date('2025-10-05') },
    { id: 'nunu-app-2', userId: 'user-4', status: 'approved', applicationText: 'As a senior AI user, I have extensive experience in AI strategy planning and business applications.', discordId: 'emilyhuang#3456', submittedAt: new Date('2025-08-15'), reviewedAt: new Date('2025-08-20'), reviewedBy: 'admin-1', createdAt: new Date('2025-08-15'), updatedAt: new Date('2025-08-20') },
    { id: 'nunu-app-3', userId: 'user-7', status: 'pending', applicationText: 'I have been learning automation for half a year and want to start helping other beginners.', discordId: 'davidzhang#6789', submittedAt: new Date('2026-01-15'), createdAt: new Date('2026-01-15'), updatedAt: new Date('2026-01-15') },
    { id: 'nunu-app-4', userId: 'user-8', status: 'rejected', applicationText: 'I want to be a Nunu to help others.', discordId: 'lisachen#0123', submittedAt: new Date('2026-01-10'), reviewedAt: new Date('2026-01-12'), reviewedBy: 'admin-1', rejectionReason: 'Application content is too brief, please provide more details.', createdAt: new Date('2026-01-10'), updatedAt: new Date('2026-01-12') },
    { id: 'nunu-app-mentor', userId: 'user-10', status: 'approved', applicationText: 'Expert mentor with extensive teaching experience.', discordId: 'amylin#8901', submittedAt: new Date('2025-01-01'), reviewedAt: new Date('2025-01-02'), reviewedBy: 'admin-1', createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-02') },
  ]);

  // ==========================================
  // NUNU APPLICATION EXPERTISE (Junction Table - 1NF)
  // ==========================================
  db.nunuApplicationExpertise.createMany([
    { id: 'nae-1-1', applicationId: 'nunu-app-1', expertise: 'Prompt Engineering', sortOrder: 1 },
    { id: 'nae-1-2', applicationId: 'nunu-app-1', expertise: 'Automation', sortOrder: 2 },
    { id: 'nae-1-3', applicationId: 'nunu-app-1', expertise: 'Make.com', sortOrder: 3 },
    { id: 'nae-2-1', applicationId: 'nunu-app-2', expertise: 'AI Strategy', sortOrder: 1 },
    { id: 'nae-2-2', applicationId: 'nunu-app-2', expertise: 'Business Application', sortOrder: 2 },
    { id: 'nae-2-3', applicationId: 'nunu-app-2', expertise: 'Product Planning', sortOrder: 3 },
    { id: 'nae-3-1', applicationId: 'nunu-app-3', expertise: 'Automation', sortOrder: 1 },
    { id: 'nae-3-2', applicationId: 'nunu-app-3', expertise: 'Zapier', sortOrder: 2 },
    { id: 'nae-4-1', applicationId: 'nunu-app-4', expertise: 'ChatGPT', sortOrder: 1 },
    { id: 'nae-m-1', applicationId: 'nunu-app-mentor', expertise: 'Comprehensive Guidance', sortOrder: 1 },
    { id: 'nae-m-2', applicationId: 'nunu-app-mentor', expertise: 'AI Strategy', sortOrder: 2 },
  ]);

  // ==========================================
  // NUNU APPLICATION ANSWERS (Normalized from JSON)
  // ==========================================
  db.nunuApplicationAnswers.createMany([
    // User-2 answers
    { id: 'naa-1-1', applicationId: 'nunu-app-1', questionId: 'question1', question: 'How would you handle a struggling Vava?', answer: 'I would first understand their struggles and provide encouragement, then break down the learning into smaller steps.', sortOrder: 1 },
    { id: 'naa-1-2', applicationId: 'nunu-app-1', questionId: 'question2', question: 'What if a Vava disagrees with your approach?', answer: 'I would listen to their perspective and find a middle ground that works for both of us.', sortOrder: 2 },
    // User-4 answers
    { id: 'naa-2-1', applicationId: 'nunu-app-2', questionId: 'question1', question: 'How would you handle a struggling Vava?', answer: 'I believe in positive reinforcement and celebrating small wins to build confidence.', sortOrder: 1 },
  ]);

  // ==========================================
  // NUNU PROFILES
  // ==========================================
  db.nunuProfiles.createMany([
    { id: 'nunu-profile-1', userId: 'user-2', applicationId: 'nunu-app-1', level: 'N4', type: 'regular', bio: 'Skilled in automation workflow design, helping you boost work efficiency with AI.', discordId: 'sarahlin#5678', isAvailable: true, maxVavas: 5, approvedAt: new Date('2025-10-05'), createdAt: new Date('2025-10-05'), updatedAt: now },
    { id: 'nunu-profile-2', userId: 'user-4', applicationId: 'nunu-app-2', level: 'N2', type: 'verified', bio: 'Senior AI strategy consultant, focused on helping learners apply AI to real business scenarios.', discordId: 'emilyhuang#3456', isAvailable: true, maxVavas: 30, approvedAt: new Date('2025-08-20'), createdAt: new Date('2025-08-20'), updatedAt: now },
    { id: 'nunu-profile-3', userId: 'user-10', applicationId: 'nunu-app-mentor', level: 'N1', type: 'verified', bio: 'Senior mentor with extensive teaching experience, has helped over a hundred learners.', discordId: 'amylin#8901', isAvailable: true, maxVavas: 50, approvedAt: new Date('2025-01-02'), createdAt: new Date('2025-01-02'), updatedAt: now },
  ]);

  // ==========================================
  // NUNU PROFILE EXPERTISE (Junction Table - 1NF)
  // ==========================================
  db.nunuProfileExpertise.createMany([
    { id: 'npe-1-1', profileId: 'nunu-profile-1', expertise: 'Prompt Engineering', sortOrder: 1 },
    { id: 'npe-1-2', profileId: 'nunu-profile-1', expertise: 'Automation', sortOrder: 2 },
    { id: 'npe-1-3', profileId: 'nunu-profile-1', expertise: 'Make.com', sortOrder: 3 },
    { id: 'npe-2-1', profileId: 'nunu-profile-2', expertise: 'AI Strategy', sortOrder: 1 },
    { id: 'npe-2-2', profileId: 'nunu-profile-2', expertise: 'Business Application', sortOrder: 2 },
    { id: 'npe-2-3', profileId: 'nunu-profile-2', expertise: 'Product Planning', sortOrder: 3 },
    { id: 'npe-3-1', profileId: 'nunu-profile-3', expertise: 'Comprehensive Guidance', sortOrder: 1 },
    { id: 'npe-3-2', profileId: 'nunu-profile-3', expertise: 'AI Strategy', sortOrder: 2 },
    { id: 'npe-3-3', profileId: 'nunu-profile-3', expertise: 'Prompt Engineering', sortOrder: 3 },
    { id: 'npe-3-4', profileId: 'nunu-profile-3', expertise: 'Business Application', sortOrder: 4 },
  ]);

  // ==========================================
  // NUNU STATS (Denormalized)
  // ==========================================
  db.nunuStats.createMany([
    { profileId: 'nunu-profile-1', currentVavaCount: 5, totalMentorships: 8, completedMentorships: 3, totalRatings: 6, sumRatings: 28, avgRating: 4.7, lastUpdatedAt: now },
    { profileId: 'nunu-profile-2', currentVavaCount: 2, totalMentorships: 15, completedMentorships: 13, totalRatings: 12, sumRatings: 59, avgRating: 4.9, lastUpdatedAt: now },
    { profileId: 'nunu-profile-3', currentVavaCount: 3, totalMentorships: 120, completedMentorships: 117, totalRatings: 100, sumRatings: 500, avgRating: 5.0, lastUpdatedAt: now },
  ]);

  // ==========================================
  // USER MENTORSHIPS
  // ==========================================
  db.userMentorships.createMany([
    // Nunu Mentor (user-10) teaching duo users
    { id: 'mentorship-1', nunuId: 'user-10', vavaId: 'user-6', nunuProfileId: 'nunu-profile-3', status: 'active', sessionCount: 8, startedAt: new Date('2025-12-15'), lastSessionAt: new Date('2026-01-20'), notes: 'Duo Go user progressing quickly', createdAt: new Date('2025-12-15'), updatedAt: now },
    { id: 'mentorship-2', nunuId: 'user-10', vavaId: 'user-2', nunuProfileId: 'nunu-profile-3', status: 'active', sessionCount: 15, startedAt: new Date('2025-11-01'), lastSessionAt: new Date('2026-01-18'), notes: 'Duo Run user, started helping others', createdAt: new Date('2025-11-01'), updatedAt: now },
    { id: 'mentorship-3', nunuId: 'user-10', vavaId: 'user-4', nunuProfileId: 'nunu-profile-3', status: 'active', sessionCount: 25, startedAt: new Date('2025-09-15'), lastSessionAt: new Date('2026-01-21'), notes: 'Duo Fly user, preparing to become certified', createdAt: new Date('2025-09-15'), updatedAt: now },

    // Duo Go User (user-6) as Nunu
    { id: 'mentorship-4', nunuId: 'user-6', vavaId: 'user-5', nunuProfileId: 'nunu-profile-1', status: 'active', sessionCount: 3, startedAt: new Date('2026-01-05'), lastSessionAt: new Date('2026-01-19'), notes: 'New learner, needs basic guidance', createdAt: new Date('2026-01-05'), updatedAt: now },

    // Duo Run User (user-2) as Nunu
    { id: 'mentorship-5', nunuId: 'user-2', vavaId: 'user-7', nunuProfileId: 'nunu-profile-1', status: 'active', sessionCount: 12, startedAt: new Date('2025-11-15'), lastSessionAt: new Date('2026-01-18'), notes: 'Learning automation', createdAt: new Date('2025-11-15'), updatedAt: now },
    { id: 'mentorship-6', nunuId: 'user-2', vavaId: 'user-8', nunuProfileId: 'nunu-profile-1', status: 'active', sessionCount: 10, startedAt: new Date('2025-11-20'), lastSessionAt: new Date('2026-01-17'), notes: 'Interested in content creation', createdAt: new Date('2025-11-20'), updatedAt: now },
    { id: 'mentorship-7', nunuId: 'user-2', vavaId: 'user-1', nunuProfileId: 'nunu-profile-1', status: 'active', sessionCount: 8, startedAt: new Date('2025-12-01'), lastSessionAt: new Date('2026-01-15'), notes: 'Learning prompt engineering', createdAt: new Date('2025-12-01'), updatedAt: now },

    // Duo Fly User (user-4) as Nunu
    { id: 'mentorship-8', nunuId: 'user-4', vavaId: 'user-5', nunuProfileId: 'nunu-profile-2', status: 'active', sessionCount: 18, startedAt: new Date('2025-10-15'), lastSessionAt: new Date('2026-01-19'), notes: 'Advanced learner', createdAt: new Date('2025-10-15'), updatedAt: now },
    { id: 'mentorship-9', nunuId: 'user-4', vavaId: 'user-7', nunuProfileId: 'nunu-profile-2', status: 'active', sessionCount: 14, startedAt: new Date('2025-11-01'), lastSessionAt: new Date('2026-01-18'), notes: 'Business applications focus', createdAt: new Date('2025-11-01'), updatedAt: now },
  ]);

  // ==========================================
  // MENTORSHIP SESSIONS
  // ==========================================
  db.mentorshipSessions.createMany([
    { id: 'session-1-1', mentorshipId: 'mentorship-1', sessionNumber: 1, occurredAt: new Date('2025-12-16'), durationMinutes: 60, notes: 'Initial assessment', topics: 'ChatGPT basics', createdAt: new Date('2025-12-16') },
    { id: 'session-1-2', mentorshipId: 'mentorship-1', sessionNumber: 2, occurredAt: new Date('2025-12-23'), durationMinutes: 45, notes: 'Good progress', topics: 'Prompt techniques', createdAt: new Date('2025-12-23') },
    { id: 'session-2-1', mentorshipId: 'mentorship-2', sessionNumber: 1, occurredAt: new Date('2025-11-02'), durationMinutes: 60, notes: 'Advanced learner', topics: 'Automation workflows', createdAt: new Date('2025-11-02') },
  ]);

  // ==========================================
  // MATCHING POSTS (Marketplace Model with Pricing)
  // ==========================================
  db.matchingPosts.createMany([
    // Nunu posts with fixed prices
    { id: 'matching-post-1', authorId: 'user-2', type: 'nunu-looking-for-vava', title: 'Automation Expert Looking for Vava!', content: 'I am a Nunu focused on automation, skilled in Make.com, Zapier, and other tools. I can help you build your first workflow and automate repetitive tasks.', priceType: 'fixed', priceAmount: 800, priceCurrency: 'TWD', availableMonths: ['2026-02', '2026-03', '2026-04'], maxSlots: 3, currentSlots: 1, isVerifiedNunuOnly: false, isActive: true, createdAt: new Date('2026-01-10'), updatedAt: now },
    { id: 'matching-post-2', authorId: 'user-4', type: 'nunu-looking-for-vava', title: '[Certified Nunu] AI Strategy and Business Application Guidance', content: 'As a Certified Nunu, I focus on helping learners apply AI to real business scenarios. Premium mentorship with guaranteed results.', priceType: 'fixed', priceAmount: 2000, priceCurrency: 'TWD', availableMonths: ['2026-02', '2026-03', '2026-04', '2026-05'], maxSlots: 5, currentSlots: 2, isVerifiedNunuOnly: true, isActive: true, createdAt: new Date('2026-01-05'), updatedAt: now },
    { id: 'matching-post-4', authorId: 'user-10', type: 'nunu-looking-for-vava', title: 'Master-Level Nunu Recruiting Vava!', content: 'I am an N1 level Certified Nunu with extensive teaching experience. Personal mentorship for serious learners.', priceType: 'fixed', priceAmount: 3500, priceCurrency: 'TWD', availableMonths: ['2026-02', '2026-03'], maxSlots: 3, currentSlots: 0, isVerifiedNunuOnly: true, isActive: true, createdAt: new Date('2026-01-02'), updatedAt: now },
    { id: 'matching-post-6', authorId: 'user-6', type: 'nunu-looking-for-vava', title: '[Matched] Beginner Nunu Looking for Vava', content: 'I am a beginner Nunu, looking for a Vava to grow and learn together.', priceType: 'negotiable', priceCurrency: 'TWD', availableMonths: ['2026-01'], maxSlots: 1, currentSlots: 1, isVerifiedNunuOnly: false, isActive: false, createdAt: new Date('2025-12-20'), updatedAt: new Date('2026-01-05') },
    // Vava posts with budget ranges
    { id: 'matching-post-3', authorId: 'user-5', type: 'vava-looking-for-nunu', title: 'Beginner Looking for Nunu!', content: 'I am a beginner with AI tools, hoping to find a patient Nunu to guide me. Looking for someone who can explain concepts simply.', priceType: 'range', priceMin: 500, priceMax: 1000, priceCurrency: 'TWD', availableMonths: ['2026-02', '2026-03'], isVerifiedNunuOnly: false, isActive: true, createdAt: new Date('2026-01-18'), updatedAt: now },
    { id: 'matching-post-5', authorId: 'user-7', type: 'vava-looking-for-nunu', title: 'Advanced Learner Looking for Certified Nunu!', content: 'I already have a solid AI foundation and now want to dive deeper into prompt engineering and automation.', priceType: 'range', priceMin: 1500, priceMax: 2500, priceCurrency: 'TWD', availableMonths: ['2026-02', '2026-03', '2026-04'], isVerifiedNunuOnly: true, isActive: true, createdAt: new Date('2026-01-15'), updatedAt: now },
  ]);

  // ==========================================
  // MENTORSHIP AGREEMENTS (Marketplace Purchases)
  // ==========================================
  db.mentorshipAgreements.createMany([
    // User-5 purchased from User-2's post (matching-post-1)
    { id: 'agreement-1', postId: 'matching-post-1', nunuId: 'user-2', vavaId: 'user-5', agreedPrice: 800, agreedMonths: ['2026-02'], totalAmount: 800, status: 'active', paymentStatus: 'paid', paymentMethod: 'credit-card', paidAt: new Date('2026-01-20'), createdAt: new Date('2026-01-20'), acceptedAt: new Date('2026-01-20'), startedAt: new Date('2026-02-01') },
    // User-7 purchased from User-4's post (matching-post-2) - multiple months
    { id: 'agreement-2', postId: 'matching-post-2', nunuId: 'user-4', vavaId: 'user-7', agreedPrice: 2000, agreedMonths: ['2026-02', '2026-03'], totalAmount: 4000, status: 'accepted', paymentStatus: 'paid', paymentMethod: 'credit-card', paidAt: new Date('2026-01-18'), createdAt: new Date('2026-01-18'), acceptedAt: new Date('2026-01-18') },
    // User-8 purchased from User-4's post (matching-post-2)
    { id: 'agreement-3', postId: 'matching-post-2', nunuId: 'user-4', vavaId: 'user-8', agreedPrice: 2000, agreedMonths: ['2026-02'], totalAmount: 2000, status: 'accepted', paymentStatus: 'paid', paymentMethod: 'credit-card', paidAt: new Date('2026-01-15'), createdAt: new Date('2026-01-15'), acceptedAt: new Date('2026-01-15') },
    // User-1 purchased from User-6's post before it closed (matching-post-6)
    { id: 'agreement-4', postId: 'matching-post-6', nunuId: 'user-6', vavaId: 'user-1', agreedPrice: 500, agreedMonths: ['2026-01'], totalAmount: 500, status: 'active', paymentStatus: 'paid', paymentMethod: 'credit-card', paidAt: new Date('2026-01-05'), createdAt: new Date('2026-01-05'), acceptedAt: new Date('2026-01-05'), startedAt: new Date('2026-01-05') },
  ]);

  // ==========================================
  // MATCHING POST STATS (Denormalized)
  // ==========================================
  db.matchingPostStats.createMany([
    { postId: 'matching-post-1', viewCount: 45, commentCount: 3, lastUpdatedAt: now },
    { postId: 'matching-post-2', viewCount: 78, commentCount: 2, lastUpdatedAt: now },
    { postId: 'matching-post-3', viewCount: 23, commentCount: 1, lastUpdatedAt: now },
    { postId: 'matching-post-4', viewCount: 156, commentCount: 4, lastUpdatedAt: now },
    { postId: 'matching-post-5', viewCount: 34, commentCount: 2, lastUpdatedAt: now },
    { postId: 'matching-post-6', viewCount: 12, commentCount: 0, lastUpdatedAt: now },
  ]);

  // ==========================================
  // MATCHING POST TAGS (Junction Table)
  // ==========================================
  db.matchingPostTags.createMany([
    { id: 'mpt-1-1', postId: 'matching-post-1', tag: 'Automation' },
    { id: 'mpt-1-2', postId: 'matching-post-1', tag: 'Make.com' },
    { id: 'mpt-1-3', postId: 'matching-post-1', tag: 'Zapier' },
    { id: 'mpt-2-1', postId: 'matching-post-2', tag: 'AI Strategy' },
    { id: 'mpt-2-2', postId: 'matching-post-2', tag: 'Business Application' },
    { id: 'mpt-3-1', postId: 'matching-post-3', tag: 'ChatGPT' },
    { id: 'mpt-3-2', postId: 'matching-post-3', tag: 'Copywriting' },
    { id: 'mpt-3-3', postId: 'matching-post-3', tag: 'Beginner' },
    { id: 'mpt-4-1', postId: 'matching-post-4', tag: 'Comprehensive Guidance' },
    { id: 'mpt-4-2', postId: 'matching-post-4', tag: 'AI Strategy' },
    { id: 'mpt-4-3', postId: 'matching-post-4', tag: 'N1 Level' },
    { id: 'mpt-5-1', postId: 'matching-post-5', tag: 'Product Planning' },
    { id: 'mpt-5-2', postId: 'matching-post-5', tag: 'Advanced Learning' },
    { id: 'mpt-6-1', postId: 'matching-post-6', tag: 'Beginner Tutorial' },
  ]);

  // ==========================================
  // MATCHING COMMENTS
  // ==========================================
  db.matchingComments.createMany([
    { id: 'mc-1', postId: 'matching-post-1', authorId: 'user-1', content: 'What is your teaching style like?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-11'), updatedAt: new Date('2026-01-11') },
    { id: 'mc-2', postId: 'matching-post-1', authorId: 'user-2', parentId: 'mc-1', content: 'About 1-2 hours of online communication per week!', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-11'), updatedAt: new Date('2026-01-11') },
    { id: 'mc-3', postId: 'matching-post-1', authorId: 'user-3', content: 'I am very interested in Make.com!', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-12'), updatedAt: new Date('2026-01-12') },
    { id: 'mc-4', postId: 'matching-post-2', authorId: 'user-5', content: 'How would you guide an AI side project?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-08'), updatedAt: new Date('2026-01-08') },
    { id: 'mc-5', postId: 'matching-post-2', authorId: 'user-4', parentId: 'mc-4', content: 'I would understand your goals first, then plan together!', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-08'), updatedAt: new Date('2026-01-08') },
    { id: 'mc-6', postId: 'matching-post-3', authorId: 'user-2', content: 'Hi! I think I can help you get started.', isPrivate: true, isDeleted: false, createdAt: new Date('2026-01-19'), updatedAt: new Date('2026-01-19') },
    { id: 'mc-7', postId: 'matching-post-4', authorId: 'user-7', content: 'N1 level is amazing! What are your requirements?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-05'), updatedAt: new Date('2026-01-05') },
    { id: 'mc-8', postId: 'matching-post-4', authorId: 'user-10', parentId: 'mc-7', content: 'Hoping learners have clear goals and invest 3-5 hours weekly.', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-05'), updatedAt: new Date('2026-01-05') },
    { id: 'mc-9', postId: 'matching-post-4', authorId: 'user-5', content: 'I really want to be mentored! Am I suitable?', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-06'), updatedAt: new Date('2026-01-06') },
    { id: 'mc-10', postId: 'matching-post-4', authorId: 'user-10', parentId: 'mc-9', content: 'Beginners are welcome! The key is passion and determination.', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-06'), updatedAt: new Date('2026-01-06') },
    { id: 'mc-11', postId: 'matching-post-5', authorId: 'user-4', content: 'Your background sounds like a great fit!', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-16'), updatedAt: new Date('2026-01-16') },
    { id: 'mc-12', postId: 'matching-post-5', authorId: 'user-5', parentId: 'mc-11', content: 'It is a content recommendation project! Can DM for details~', isPrivate: false, isDeleted: false, createdAt: new Date('2026-01-16'), updatedAt: new Date('2026-01-16') },
  ]);
}
