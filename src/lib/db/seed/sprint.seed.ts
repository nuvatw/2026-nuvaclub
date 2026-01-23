import type { MockDB } from '../core/MockDB';

/**
 * Seed sprint module data
 */
export async function seedSprint(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // SEASONS
  // ==========================================
  db.seasons.createMany([
    {
      id: 'season-1',
      name: '2026 Q1',
      description: '2026 First Quarter Sprint Season',
      theme: 'AI Automation & Productivity',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      status: 'active',
      createdAt: new Date('2025-12-01'),
      updatedAt: now,
    },
    {
      id: 'season-2',
      name: '2025 Q4',
      description: '2025 Fourth Quarter Sprint Season',
      theme: 'AI Innovation Challenge',
      startDate: new Date('2025-10-01'),
      endDate: new Date('2025-12-31'),
      status: 'ended',
      createdAt: new Date('2025-09-01'),
      updatedAt: new Date('2025-12-31'),
    },
  ]);

  // ==========================================
  // SPRINTS
  // ==========================================
  db.sprints.createMany([
    {
      id: 'sprint-1',
      seasonId: 'season-1',
      title: 'AI Automation Tools',
      description: 'Build your own AI automation tools to boost daily productivity',
      theme: 'Automation',
      thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      submissionDeadline: new Date('2026-01-15'),
      votingStartDate: new Date('2026-01-16'),
      votingEndDate: new Date('2026-01-31'),
      status: 'voting',
      createdAt: new Date('2025-12-15'),
      updatedAt: now,
    },
    {
      id: 'sprint-2',
      seasonId: 'season-1',
      title: 'AI Content Creation',
      description: 'Create various types of content with AI',
      theme: 'Creation',
      thumbnailUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
      submissionDeadline: new Date('2026-02-12'),
      votingStartDate: new Date('2026-02-13'),
      votingEndDate: new Date('2026-02-28'),
      status: 'upcoming',
      createdAt: new Date('2026-01-15'),
      updatedAt: now,
    },
    {
      id: 'sprint-3',
      seasonId: 'season-2',
      title: 'AI Customer Service Assistant',
      description: 'Build an intelligent customer service chatbot',
      theme: 'Customer Service',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800',
      startDate: new Date('2025-12-01'),
      endDate: new Date('2025-12-31'),
      submissionDeadline: new Date('2025-12-15'),
      votingStartDate: new Date('2025-12-16'),
      votingEndDate: new Date('2025-12-31'),
      status: 'ended',
      createdAt: new Date('2025-11-15'),
      updatedAt: new Date('2025-12-31'),
    },
  ]);

  // ==========================================
  // SPRINT STATS (denormalized statistics)
  // ==========================================
  db.sprintStats.createMany([
    { sprintId: 'sprint-1', projectCount: 12, participantCount: 12, totalVotes: 133, lastUpdatedAt: now },
    { sprintId: 'sprint-2', projectCount: 8, participantCount: 8, totalVotes: 0, lastUpdatedAt: now },
    { sprintId: 'sprint-3', projectCount: 15, participantCount: 15, totalVotes: 245, lastUpdatedAt: now },
  ]);

  // ==========================================
  // SPRINT AWARDS
  // ==========================================
  db.sprintAwards.createMany([
    // Sprint 1 awards
    { id: 'award-1-1', sprintId: 'sprint-1', name: 'Best Overall', description: 'The highest-rated project overall', sortOrder: 1, createdAt: now },
    { id: 'award-1-2', sprintId: 'sprint-1', name: 'Most Innovative', description: 'Most creative and innovative solution', sortOrder: 2, createdAt: now },
    { id: 'award-1-3', sprintId: 'sprint-1', name: 'Best Design', description: 'Best user interface and experience', sortOrder: 3, createdAt: now },
    // Sprint 3 awards
    { id: 'award-3-1', sprintId: 'sprint-3', name: 'Best Overall', description: 'The highest-rated project overall', sortOrder: 1, createdAt: now },
    { id: 'award-3-2', sprintId: 'sprint-3', name: 'Most Practical', description: 'Most practical real-world application', sortOrder: 2, createdAt: now },
  ]);

  // ==========================================
  // PROJECTS
  // ==========================================
  db.projects.createMany([
    {
      id: 'project-1',
      sprintId: 'sprint-1',
      authorId: 'user-1',
      title: 'Automated Social Media Scheduler',
      description: 'Integrates ChatGPT and Make.com to automatically generate and schedule social media posts',
      summary: 'AI-powered social media automation tool',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      githubUrl: 'https://github.com/example/social-scheduler',
      liveUrl: 'https://social-scheduler.demo.com',
      status: 'approved',
      rank: 1,
      isWinner: true,
      awardType: 'Best Overall',
      submittedAt: new Date('2026-01-10'),
      approvedAt: new Date('2026-01-10'),
      createdAt: new Date('2026-01-10'),
      updatedAt: new Date('2026-01-15'),
    },
    {
      id: 'project-2',
      sprintId: 'sprint-1',
      authorId: 'user-2',
      title: 'AI Meeting Summary Assistant',
      description: 'Automatically records meetings and generates key summaries and action items',
      summary: 'Meeting transcription and summary tool',
      thumbnailUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
      githubUrl: 'https://github.com/example/meeting-summary',
      status: 'approved',
      rank: 2,
      isWinner: false,
      submittedAt: new Date('2026-01-08'),
      approvedAt: new Date('2026-01-08'),
      createdAt: new Date('2026-01-08'),
      updatedAt: new Date('2026-01-12'),
    },
    {
      id: 'project-3',
      sprintId: 'sprint-1',
      authorId: 'user-3',
      title: 'Smart Email Classifier',
      description: 'Uses AI to automatically categorize and prioritize emails',
      summary: 'Intelligent email organization system',
      thumbnailUrl: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800',
      status: 'approved',
      rank: 3,
      isWinner: false,
      submittedAt: new Date('2026-01-05'),
      approvedAt: new Date('2026-01-05'),
      createdAt: new Date('2026-01-05'),
      updatedAt: new Date('2026-01-10'),
    },
    {
      id: 'project-4',
      sprintId: 'sprint-1',
      authorId: 'user-4',
      title: 'Code Review Assistant',
      description: 'Automated code review with improvement suggestions',
      summary: 'AI-powered code review tool',
      thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
      githubUrl: 'https://github.com/example/code-reviewer',
      status: 'approved',
      isWinner: false,
      submittedAt: new Date('2026-01-12'),
      approvedAt: new Date('2026-01-12'),
      createdAt: new Date('2026-01-12'),
      updatedAt: new Date('2026-01-14'),
    },
  ]);

  // ==========================================
  // PROJECT STATS (denormalized statistics)
  // ==========================================
  db.projectStats.createMany([
    { projectId: 'project-1', voteCount: 42, viewCount: 1280, starCount: 156, commentCount: 23, lastUpdatedAt: now },
    { projectId: 'project-2', voteCount: 38, viewCount: 980, starCount: 142, commentCount: 18, lastUpdatedAt: now },
    { projectId: 'project-3', voteCount: 28, viewCount: 756, starCount: 89, commentCount: 12, lastUpdatedAt: now },
    { projectId: 'project-4', voteCount: 25, viewCount: 620, starCount: 78, commentCount: 8, lastUpdatedAt: now },
  ]);

  // ==========================================
  // PROJECT TECH STACK
  // ==========================================
  db.projectTechStack.createMany([
    { id: 'tech-1-1', projectId: 'project-1', technology: 'ChatGPT', category: 'ai', sortOrder: 1 },
    { id: 'tech-1-2', projectId: 'project-1', technology: 'Make.com', category: 'automation', sortOrder: 2 },
    { id: 'tech-1-3', projectId: 'project-1', technology: 'React', category: 'frontend', sortOrder: 3 },
    { id: 'tech-2-1', projectId: 'project-2', technology: 'Whisper', category: 'ai', sortOrder: 1 },
    { id: 'tech-2-2', projectId: 'project-2', technology: 'GPT-4', category: 'ai', sortOrder: 2 },
    { id: 'tech-2-3', projectId: 'project-2', technology: 'Python', category: 'backend', sortOrder: 3 },
    { id: 'tech-3-1', projectId: 'project-3', technology: 'Claude', category: 'ai', sortOrder: 1 },
    { id: 'tech-3-2', projectId: 'project-3', technology: 'Zapier', category: 'automation', sortOrder: 2 },
    { id: 'tech-3-3', projectId: 'project-3', technology: 'Gmail API', category: 'integration', sortOrder: 3 },
    { id: 'tech-4-1', projectId: 'project-4', technology: 'GPT-4', category: 'ai', sortOrder: 1 },
    { id: 'tech-4-2', projectId: 'project-4', technology: 'GitHub API', category: 'integration', sortOrder: 2 },
    { id: 'tech-4-3', projectId: 'project-4', technology: 'TypeScript', category: 'backend', sortOrder: 3 },
  ]);

  // ==========================================
  // PROJECT SCREENSHOTS
  // ==========================================
  db.projectScreenshots.createMany([
    { id: 'ss-1-1', projectId: 'project-1', imageUrl: 'https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?w=800', caption: 'Dashboard overview', sortOrder: 1, createdAt: now },
    { id: 'ss-1-2', projectId: 'project-1', imageUrl: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800', caption: 'Post scheduling interface', sortOrder: 2, createdAt: now },
    { id: 'ss-2-1', projectId: 'project-2', imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800', caption: 'Meeting transcript view', sortOrder: 1, createdAt: now },
  ]);

  // ==========================================
  // PROJECT TEAM MEMBERS
  // ==========================================
  db.projectTeamMembers.createMany([
    { id: 'tm-1-1', projectId: 'project-1', userId: 'user-1', name: 'Alex Chen', role: 'Full Stack Developer', sortOrder: 1 },
    { id: 'tm-2-1', projectId: 'project-2', userId: 'user-2', name: 'Sarah Lin', role: 'AI Engineer', sortOrder: 1 },
    { id: 'tm-2-2', projectId: 'project-2', name: 'Mike Wang', role: 'Backend Developer', githubUsername: 'mikewang', sortOrder: 2 },
  ]);

  // ==========================================
  // PROJECT VOTES
  // ==========================================
  db.projectVotes.createMany([
    { id: 'pvote-1', projectId: 'project-1', userId: 'user-2', weight: 1, createdAt: new Date('2026-01-17') },
    { id: 'pvote-2', projectId: 'project-1', userId: 'user-3', weight: 1, createdAt: new Date('2026-01-18') },
    { id: 'pvote-3', projectId: 'project-1', userId: 'user-4', weight: 1, createdAt: new Date('2026-01-19') },
    { id: 'pvote-4', projectId: 'project-2', userId: 'user-1', weight: 1, createdAt: new Date('2026-01-17') },
    { id: 'pvote-5', projectId: 'project-2', userId: 'user-3', weight: 1, createdAt: new Date('2026-01-18') },
    { id: 'pvote-6', projectId: 'project-3', userId: 'user-1', weight: 1, createdAt: new Date('2026-01-19') },
    { id: 'pvote-7', projectId: 'project-3', userId: 'user-2', weight: 1, createdAt: new Date('2026-01-20') },
  ]);

  // ==========================================
  // PROJECT STARS (favorites)
  // ==========================================
  db.projectStars.createMany([
    { id: 'star-1', projectId: 'project-1', userId: 'user-2', createdAt: new Date('2026-01-17') },
    { id: 'star-2', projectId: 'project-1', userId: 'user-3', createdAt: new Date('2026-01-18') },
    { id: 'star-3', projectId: 'project-2', userId: 'user-1', createdAt: new Date('2026-01-17') },
  ]);

  // ==========================================
  // PROJECT COMMENTS
  // ==========================================
  db.projectComments.createMany([
    { id: 'pcomment-1', projectId: 'project-1', authorId: 'user-2', content: 'Amazing work! The automation flow is really impressive.', isDeleted: false, createdAt: new Date('2026-01-17'), updatedAt: new Date('2026-01-17') },
    { id: 'pcomment-2', projectId: 'project-1', authorId: 'user-3', parentId: 'pcomment-1', content: 'Agreed! Would love to see more AI features in the future.', isDeleted: false, createdAt: new Date('2026-01-18'), updatedAt: new Date('2026-01-18') },
    { id: 'pcomment-3', projectId: 'project-2', authorId: 'user-1', content: 'The transcription accuracy is really high. Great job!', isDeleted: false, createdAt: new Date('2026-01-17'), updatedAt: new Date('2026-01-17') },
  ]);

  // ==========================================
  // PROJECT AWARDS (awarded to projects)
  // ==========================================
  db.projectAwards.createMany([
    { id: 'pa-1', projectId: 'project-1', awardId: 'award-1-1', awardedAt: new Date('2026-01-31') },
  ]);
}
