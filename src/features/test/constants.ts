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

export function getLevelTier(level: number): 'basic' | 'intermediate' | 'advanced' | 'expert' {
  if (level <= 3) return 'basic';
  if (level <= 6) return 'intermediate';
  if (level <= 9) return 'advanced';
  return 'expert';
}

export function getLevelColor(level: number): string {
  const tier = getLevelTier(level);
  switch (tier) {
    case 'basic':
      return 'text-green-500';
    case 'intermediate':
      return 'text-blue-500';
    case 'advanced':
      return 'text-purple-500';
    case 'expert':
      return 'text-amber-500';
  }
}

export function getLevelBgColor(level: number): string {
  const tier = getLevelTier(level);
  switch (tier) {
    case 'basic':
      return 'bg-green-500/10 border-green-500/30';
    case 'intermediate':
      return 'bg-blue-500/10 border-blue-500/30';
    case 'advanced':
      return 'bg-purple-500/10 border-purple-500/30';
    case 'expert':
      return 'bg-amber-500/10 border-amber-500/30';
  }
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
