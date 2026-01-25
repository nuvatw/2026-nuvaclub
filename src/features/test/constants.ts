export const TOTAL_LEVELS = 12;

export const PASSING_PERCENTAGE = 60;

// Detailed level information including topics and skills tested
export const LEVEL_DETAILS: Record<
  number,
  {
    title: string;
    description: string;
    topics: string[];
    skills: string[];
    whatYouWillLearn: string[];
  }
> = {
  1: {
    title: 'AI Fundamentals',
    description: 'Introduction to AI concepts and basic terminology',
    topics: ['AI Basics', 'Prompt Basics', 'AI Tools'],
    skills: ['Identify common AI tools', 'Understand basic AI concepts', 'Write simple prompts'],
    whatYouWillLearn: [
      'What is AI and how it works',
      'Common AI chatbots (ChatGPT, Claude, Gemini)',
      'Basic prompt writing fundamentals',
      'Understanding AI limitations and hallucinations',
    ],
  },
  2: {
    title: 'Prompt Foundations',
    description: 'Core concepts of effective prompt writing',
    topics: ['AI Basics', 'Prompt Basics', 'Context & Tokens'],
    skills: ['Set roles in prompts', 'Provide context', 'Understand tokens and context limits'],
    whatYouWillLearn: [
      'Role setting in prompts',
      'Token and context length concepts',
      'Zero-shot prompting basics',
      'Providing specific constraints',
    ],
  },
  3: {
    title: 'Prompt Techniques',
    description: 'Essential prompting techniques and parameters',
    topics: ['Advanced Prompt', 'AI Parameters', 'AI Applications'],
    skills: ['Use few-shot learning', 'Adjust AI parameters', 'Apply Chain-of-Thought'],
    whatYouWillLearn: [
      'Few-shot learning techniques',
      'Temperature and Max Tokens parameters',
      'System Prompts basics',
      'Chain-of-Thought prompting',
    ],
  },
  4: {
    title: 'Applied Prompting',
    description: 'Practical applications and advanced techniques',
    topics: ['Advanced Prompt', 'AI Security', 'AI Parameters'],
    skills: ['Design structured prompts', 'Handle prompt injection risks', 'Apply self-consistency'],
    whatYouWillLearn: [
      'Using delimiters effectively',
      'Prompt injection awareness',
      'Self-consistency techniques',
      'Output format specification',
    ],
  },
  5: {
    title: 'AI Technologies',
    description: 'Technical concepts behind modern AI systems',
    topics: ['Advanced Prompt', 'AI Technology', 'Embeddings'],
    skills: ['Design prompt chains', 'Understand RAG systems', 'Work with embeddings'],
    whatYouWillLearn: [
      'Prompt Chaining for complex tasks',
      'RAG (Retrieval-Augmented Generation)',
      'Tree of Thoughts technique',
      'Embeddings and vector concepts',
    ],
  },
  6: {
    title: 'AI Systems Design',
    description: 'Building and integrating AI systems',
    topics: ['AI Technology', 'AI Agent', 'AI Security'],
    skills: ['Use function calling', 'Design AI agents', 'Implement guardrails'],
    whatYouWillLearn: [
      'Function Calling in AI APIs',
      'AI Agent planning and execution',
      'Multi-Agent systems',
      'Guardrails and safety mechanisms',
    ],
  },
  7: {
    title: 'Professional Applications',
    description: 'Enterprise-level AI implementation',
    topics: ['Advanced Prompt', 'AI Technology', 'AI Applications'],
    skills: ['Design prompt templates', 'Manage conversations', 'Handle errors gracefully'],
    whatYouWillLearn: [
      'Context window management',
      'Multi-turn conversation design',
      'Structured output techniques',
      'Error handling strategies',
    ],
  },
  8: {
    title: 'Advanced AI Systems',
    description: 'Complex AI architectures and optimization',
    topics: ['AI Agent', 'AI Technology', 'AI Applications'],
    skills: ['Implement tool use', 'Design memory systems', 'Optimize RAG pipelines'],
    whatYouWillLearn: [
      'Tool use in AI Agents',
      'Chunking strategies for long text',
      'AI memory system design',
      'Multi-modal AI challenges',
    ],
  },
  9: {
    title: 'AI Architecture',
    description: 'Scalable AI systems and orchestration',
    topics: ['AI Technology', 'AI Security', 'AI Agent'],
    skills: ['Build scalable systems', 'Implement constitutional AI', 'Design human-AI workflows'],
    whatYouWillLearn: [
      'AI Orchestration frameworks',
      'Constitutional AI principles',
      'Knowledge Graph integration',
      'Agentic AI concepts',
    ],
  },
  10: {
    title: 'AI Strategy',
    description: 'Strategic AI implementation and governance',
    topics: ['AI Workflow', 'AI Ethics', 'AI Strategy', 'AI Governance'],
    skills: ['Design AI workflows', 'Develop AI policies', 'Compare AI tools strategically'],
    whatYouWillLearn: [
      'AI-driven content creation workflows',
      'AI in education considerations',
      'SME AI transformation strategies',
      'AI usage policy development',
    ],
  },
  11: {
    title: 'AI Leadership',
    description: 'Leading AI initiatives and transformation',
    topics: ['AI Applications', 'AI Trends', 'AI Strategy', 'AI Talent'],
    skills: ['Lead AI product development', 'Analyze industry trends', 'Build AI capabilities'],
    whatYouWillLearn: [
      'AI-driven product development',
      'Research analysis with AI',
      'Industry transformation analysis',
      'AI talent development strategies',
    ],
  },
  12: {
    title: 'AI Mastery',
    description: 'Expert-level AI governance and future vision',
    topics: ['AI Governance', 'AI Social Impact', 'AI Future', 'AI Ethics'],
    skills: ['Design governance frameworks', 'Analyze societal impact', 'Envision AI futures'],
    whatYouWillLearn: [
      'Large-scale AI governance',
      'AI socioeconomic impact analysis',
      'Enterprise AI strategic planning',
      'AGI and responsible AI development',
    ],
  },
};

export const LEVEL_CONFIGS = {
  // Lv1-3: True/False + Multiple Choice, 5 min
  basic: {
    levels: [1, 2, 3],
    durationMinutes: 5,
    questionTypes: 'True/False + Multiple Choice',
    description: 'Basic Concepts Test',
  },
  // Lv4-6: Multiple Choice + Short Answer, 15 min
  intermediate: {
    levels: [4, 5, 6],
    durationMinutes: 15,
    questionTypes: 'Multiple Choice + Short Answer',
    description: 'Intermediate Application Test',
  },
  // Lv7-9: Short Answer + Essay, 30 min
  advanced: {
    levels: [7, 8, 9],
    durationMinutes: 30,
    questionTypes: 'Short Answer + Essay',
    description: 'Advanced Skills Test',
  },
  // Lv10-12: All Essay, 60 min
  expert: {
    levels: [10, 11, 12],
    durationMinutes: 60,
    questionTypes: 'Essay',
    description: 'Expert Level Test',
  },
};

export type LevelTier = 'basic' | 'intermediate' | 'advanced' | 'expert';

const TIER_COLORS: Record<LevelTier, string> = {
  basic: 'text-green-500',
  intermediate: 'text-blue-500',
  advanced: 'text-purple-500',
  expert: 'text-amber-500',
};

const TIER_BG_COLORS: Record<LevelTier, string> = {
  basic: 'bg-green-500/10 border-green-500/30',
  intermediate: 'bg-blue-500/10 border-blue-500/30',
  advanced: 'bg-purple-500/10 border-purple-500/30',
  expert: 'bg-amber-500/10 border-amber-500/30',
};

export function getLevelTier(level: number): LevelTier {
  if (level <= 3) return 'basic';
  if (level <= 6) return 'intermediate';
  if (level <= 9) return 'advanced';
  return 'expert';
}

export function getLevelColor(level: number): string {
  return TIER_COLORS[getLevelTier(level)];
}

export function getLevelBgColor(level: number): string {
  return TIER_BG_COLORS[getLevelTier(level)];
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours} hr`;
  }
  return `${hours} hr ${mins} min`;
}

export function getLevelDuration(level: number): number {
  if (level <= 3) return 5;
  if (level <= 6) return 15;
  if (level <= 9) return 30;
  return 60;
}

// ==================== NUNU EXAM SYSTEM ====================
// Separate from course levels - these are for Nunu rank certification

import type { NunuExamInfo, NunuRank } from './types';

export const TOTAL_NUNU_RANKS = 5;

// Nunu rank details (1 = beginner Nunu, 5 = expert Nunu)
export const NUNU_RANK_DETAILS: Record<NunuRank, {
  title: string;
  description: string;
  requirements: string;
  topics: string[];
  skills: string[];
}> = {
  1: {
    title: 'Nunu Level 1 - Newcomer',
    description: 'Entry-level mentorship certification',
    requirements: 'Complete Nunu training courses',
    topics: ['Mentorship Basics', 'Communication', 'Setting Goals'],
    skills: ['Active listening', 'Basic feedback', 'Goal setting'],
  },
  2: {
    title: 'Nunu Level 2 - Guide',
    description: 'Established mentor with proven track record',
    requirements: 'Mentor 2+ Vavas, 3+ months experience',
    topics: ['Advanced Communication', 'Progress Tracking', 'Conflict Resolution'],
    skills: ['Constructive feedback', 'Progress measurement', 'Problem solving'],
  },
  3: {
    title: 'Nunu Level 3 - Mentor',
    description: 'Experienced mentor with diverse mentee base',
    requirements: 'Mentor 5+ Vavas, 6+ months experience',
    topics: ['Teaching Techniques', 'Learning Styles', 'Curriculum Design'],
    skills: ['Adaptive teaching', 'Custom learning paths', 'Assessment design'],
  },
  4: {
    title: 'Nunu Level 4 - Senior',
    description: 'Senior mentor guiding other Nunus',
    requirements: 'Mentor 10+ Vavas, 12+ months, train new Nunus',
    topics: ['Nunu Leadership', 'Quality Standards', 'Community Building'],
    skills: ['Leadership', 'Quality assurance', 'Mentor training'],
  },
  5: {
    title: 'Nunu Level 5 - Master',
    description: 'Master Nunu and community leader',
    requirements: 'Mentor 20+ Vavas, outstanding contributions',
    topics: ['Program Design', 'Community Leadership', 'Strategic Mentorship'],
    skills: ['Program management', 'Community leadership', 'Strategic planning'],
  },
};

// Nunu exam configurations
export const NUNU_EXAM_CONFIGS: NunuExamInfo[] = [
  // Rank exams (Levels 1-5)
  {
    id: 'nunu-rank-1',
    type: 'rank',
    rank: 1,
    title: 'Nunu Level 1 Exam',
    description: 'Entry-level Nunu certification exam',
    topics: NUNU_RANK_DETAILS[1].topics,
    skills: NUNU_RANK_DETAILS[1].skills,
    durationMinutes: 15,
    questionCount: 15,
    passingScore: 60,
  },
  {
    id: 'nunu-rank-2',
    type: 'rank',
    rank: 2,
    title: 'Nunu Level 2 Exam',
    description: 'Guide-level Nunu certification exam',
    topics: NUNU_RANK_DETAILS[2].topics,
    skills: NUNU_RANK_DETAILS[2].skills,
    durationMinutes: 20,
    questionCount: 20,
    passingScore: 65,
  },
  {
    id: 'nunu-rank-3',
    type: 'rank',
    rank: 3,
    title: 'Nunu Level 3 Exam',
    description: 'Mentor-level Nunu certification exam',
    topics: NUNU_RANK_DETAILS[3].topics,
    skills: NUNU_RANK_DETAILS[3].skills,
    durationMinutes: 25,
    questionCount: 25,
    passingScore: 70,
  },
  {
    id: 'nunu-rank-4',
    type: 'rank',
    rank: 4,
    title: 'Nunu Level 4 Exam',
    description: 'Senior Nunu certification exam',
    topics: NUNU_RANK_DETAILS[4].topics,
    skills: NUNU_RANK_DETAILS[4].skills,
    durationMinutes: 30,
    questionCount: 30,
    passingScore: 75,
  },
  {
    id: 'nunu-rank-5',
    type: 'rank',
    rank: 5,
    title: 'Nunu Level 5 Exam',
    description: 'Master Nunu certification exam',
    topics: NUNU_RANK_DETAILS[5].topics,
    skills: NUNU_RANK_DETAILS[5].skills,
    durationMinutes: 45,
    questionCount: 40,
    passingScore: 80,
  },
  // Verified Nunu exam (separate from ranks)
  {
    id: 'nunu-verified',
    type: 'verified',
    title: 'Verified Nunu Exam',
    description: 'Comprehensive exam for Verified Nunu certification. Requires completing all 5 Verified Required courses.',
    topics: ['All Nunu Training Topics', 'Ethics & Standards', 'Professional Practice'],
    skills: ['Complete mentorship competency', 'Professional conduct', 'Advanced teaching'],
    durationMinutes: 60,
    questionCount: 50,
    passingScore: 75,
  },
];

// Helper to get Nunu exam by ID
export function getNunuExamById(id: string): NunuExamInfo | undefined {
  return NUNU_EXAM_CONFIGS.find((exam) => exam.id === id);
}

// Helper to get Nunu rank exam
export function getNunuRankExam(rank: NunuRank): NunuExamInfo | undefined {
  return NUNU_EXAM_CONFIGS.find((exam) => exam.type === 'rank' && exam.rank === rank);
}

// Helper to get Verified Nunu exam
export function getVerifiedNunuExam(): NunuExamInfo | undefined {
  return NUNU_EXAM_CONFIGS.find((exam) => exam.type === 'verified');
}

// Nunu rank colors
export const NUNU_RANK_COLORS: Record<NunuRank, string> = {
  1: 'text-green-500',
  2: 'text-blue-500',
  3: 'text-purple-500',
  4: 'text-amber-500',
  5: 'text-red-500',
};

export const NUNU_RANK_BG_COLORS: Record<NunuRank, string> = {
  1: 'bg-green-500/10 border-green-500/30',
  2: 'bg-blue-500/10 border-blue-500/30',
  3: 'bg-purple-500/10 border-purple-500/30',
  4: 'bg-amber-500/10 border-amber-500/30',
  5: 'bg-red-500/10 border-red-500/30',
};

// Format Nunu rank for display
export function formatNunuRank(rank: NunuRank): string {
  return `Nunu Level ${rank}`;
}

// Get Nunu rank color
export function getNunuRankColor(rank: NunuRank): string {
  return NUNU_RANK_COLORS[rank];
}

// Get Nunu rank background color
export function getNunuRankBgColor(rank: NunuRank): string {
  return NUNU_RANK_BG_COLORS[rank];
}
