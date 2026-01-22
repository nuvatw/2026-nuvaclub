import type { MockDB } from '../core/MockDB';
import type {
  QuestionRecord,
  UserTestProgressRecord,
} from '../schema';

/**
 * Level Configuration
 * Lv1-3: 50% True/False + 50% Multiple Choice, 5 min
 * Lv4-6: 50% Multiple Choice + 50% Short Answer, 15 min
 * Lv7-9: All Short Answer + 2 Essay, 30 min
 * Lv10-12: 5 Essay, 60 min
 */
export const LEVEL_CONFIGS = [
  { levels: [1, 2, 3], durationMinutes: 5 },
  { levels: [4, 5, 6], durationMinutes: 15 },
  { levels: [7, 8, 9], durationMinutes: 30 },
  { levels: [10, 11, 12], durationMinutes: 60 },
];

export function getLevelDuration(level: number): number {
  if (level <= 3) return 5;
  if (level <= 6) return 15;
  if (level <= 9) return 30;
  return 60;
}

export async function seedTest(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // Level 1 Questions (5 True/False + 5 Multiple Choice)
  // ==========================================
  const level1Questions: Omit<QuestionRecord, 'id'>[] = [
    // True/False
    {
      level: 1,
      type: 'true-false',
      content: 'ChatGPT is a large language model developed by OpenAI.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'true-false',
      content: 'A Prompt refers to the instructions or questions we give to AI.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'true-false',
      content: 'AI can 100% guarantee that its output is completely accurate.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'true-false',
      content: 'Midjourney is a text generation tool.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10,
      category: 'AI Tools',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'true-false',
      content: 'GPT stands for Generative Pre-trained Transformer.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'AI Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    // Multiple Choice
    {
      level: 1,
      type: 'multiple-choice',
      content: 'Which of the following is NOT a common AI chatbot?',
      options: ['ChatGPT', 'Claude', 'Midjourney', 'Gemini'],
      correctAnswer: 'Midjourney',
      points: 10,
      category: 'AI Tools',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'multiple-choice',
      content: 'What is the main purpose of Prompt Engineering?',
      options: ['Writing code', 'Optimizing communication with AI', 'Training AI models', 'Building databases'],
      correctAnswer: 'Optimizing communication with AI',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'multiple-choice',
      content: 'Which AI tool is best suited for generating images?',
      options: ['ChatGPT', 'DALL-E', 'Notion AI', 'Grammarly'],
      correctAnswer: 'DALL-E',
      points: 10,
      category: 'AI Tools',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'multiple-choice',
      content: 'What does "Hallucination" refer to in the AI field?',
      options: [
        'Visual effects produced by AI',
        'AI generating inaccurate or false information',
        'AI\'s creative expression',
        'AI\'s learning process',
      ],
      correctAnswer: 'AI generating inaccurate or false information',
      points: 10,
      category: 'AI Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 1,
      type: 'multiple-choice',
      content: 'What is usually the first step in writing an effective Prompt?',
      options: ['Start asking questions directly', 'Clearly define goals and roles', 'Use lots of technical jargon', 'Set length limits'],
      correctAnswer: 'Clearly define goals and roles',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 2 Questions (5 True/False + 5 Multiple Choice)
  // ==========================================
  const level2Questions: Omit<QuestionRecord, 'id'>[] = [
    // True/False
    {
      level: 2,
      type: 'true-false',
      content: 'Claude is an AI assistant developed by Anthropic.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'true-false',
      content: 'All AI models require an internet connection to be used.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10,
      category: 'AI Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'true-false',
      content: 'Providing examples in a Prompt can help AI better understand the task.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'true-false',
      content: 'AI-generated content can be used directly without human review.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'true-false',
      content: 'Token is the basic unit that AI uses to process text.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'AI Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    // Multiple Choice
    {
      level: 2,
      type: 'multiple-choice',
      content: 'Which of the following is the main capability of AI language models?',
      options: ['Autonomous driving', 'Image recognition', 'Text generation and understanding', 'Hardware control'],
      correctAnswer: 'Text generation and understanding',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'multiple-choice',
      content: 'What is the main purpose of setting a "role" in a Prompt?',
      options: ['Increase word count', 'Make AI respond from a specific perspective', 'Speed up response', 'Reduce errors'],
      correctAnswer: 'Make AI respond from a specific perspective',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'multiple-choice',
      content: 'What does "context length limit" refer to in AI models?',
      options: ['Maximum response length', 'Total input/output length that can be processed', 'Size of training data', 'Model memory capacity'],
      correctAnswer: 'Total input/output length that can be processed',
      points: 10,
      category: 'AI Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'multiple-choice',
      content: 'Which approach can make AI responses more accurate?',
      options: ['Use vague descriptions', 'Provide specific constraints', 'Give no examples at all', 'Use slang'],
      correctAnswer: 'Provide specific constraints',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 2,
      type: 'multiple-choice',
      content: 'What does "Zero-shot" mean in Prompt Engineering?',
      options: ['Not providing any examples', 'Providing one example', 'Providing multiple examples', 'Not giving any instructions'],
      correctAnswer: 'Not providing any examples',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 3 Questions (5 True/False + 5 Multiple Choice)
  // ==========================================
  const level3Questions: Omit<QuestionRecord, 'id'>[] = [
    // True/False
    {
      level: 3,
      type: 'true-false',
      content: 'Few-shot learning means providing a few examples in the Prompt to guide AI.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'true-false',
      content: 'The higher the Temperature parameter, the more creative but potentially unstable the AI response.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'AI Parameters',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'true-false',
      content: 'AI can remember all your previous conversation content, even after closing the browser.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'true-false',
      content: 'System Prompt can set the basic behavior and response style of AI.',
      options: ['True', 'False'],
      correctAnswer: 'True',
      points: 10,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'true-false',
      content: 'All AI models have real-time updated knowledge.',
      options: ['True', 'False'],
      correctAnswer: 'False',
      points: 10,
      category: 'AI Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    // Multiple Choice
    {
      level: 3,
      type: 'multiple-choice',
      content: 'What is the core technique of Chain-of-Thought (CoT) prompting?',
      options: ['Using more keywords', 'Asking AI to reason step by step', 'Shortening Prompt length', 'Avoiding examples'],
      correctAnswer: 'Asking AI to reason step by step',
      points: 10,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'multiple-choice',
      content: 'Which of the following is NOT a valid Prompt structure element?',
      options: ['Role setting', 'Task description', 'Random filler text', 'Output format'],
      correctAnswer: 'Random filler text',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'multiple-choice',
      content: 'What is the best approach when AI response does not meet expectations?',
      options: ['Give up directly', 'Adjust the Prompt and retry', 'Ask a completely different question', 'Keep repeating the same question'],
      correctAnswer: 'Adjust the Prompt and retry',
      points: 10,
      category: 'Prompt Basics',
      difficulty: 'easy',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'multiple-choice',
      content: 'What does the Max Tokens parameter control?',
      options: ['Maximum response length', 'Model accuracy', 'Processing speed', 'Creativity level'],
      correctAnswer: 'Maximum response length',
      points: 10,
      category: 'AI Parameters',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 3,
      type: 'multiple-choice',
      content: 'Which situation is most suitable for AI assistance?',
      options: ['Queries requiring real-time information', 'Brainstorming and draft writing', 'Final review of legal documents', 'Medical diagnosis'],
      correctAnswer: 'Brainstorming and draft writing',
      points: 10,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 4 Questions (5 Multiple Choice + 5 Short Answer)
  // ==========================================
  const level4Questions: Omit<QuestionRecord, 'id'>[] = [
    // Multiple Choice
    {
      level: 4,
      type: 'multiple-choice',
      content: 'What is the purpose of "Delimiters" when designing a Prompt?',
      options: ['Improve aesthetics', 'Clearly separate different sections of content', 'Increase word count', 'Improve response speed'],
      correctAnswer: 'Clearly separate different sections of content',
      points: 15,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'multiple-choice',
      content: 'What is a "Prompt Injection" attack?',
      options: ['Injecting more examples', 'Malicious input attempting to bypass AI restrictions', 'Increasing Prompt length', 'Optimizing response speed'],
      correctAnswer: 'Malicious input attempting to bypass AI restrictions',
      points: 15,
      category: 'AI Security',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'multiple-choice',
      content: 'What is a characteristic of the "Self-Consistency" technique?',
      options: ['Only generates one answer', 'Generates multiple answers and selects the most consistent one', 'Completely random responses', 'Only uses fixed templates'],
      correctAnswer: 'Generates multiple answers and selects the most consistent one',
      points: 15,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'multiple-choice',
      content: 'What is the most important consideration when using AI-generated content in business applications?',
      options: ['Generation speed', 'Content review and compliance', 'Interface aesthetics', 'Using the latest model'],
      correctAnswer: 'Content review and compliance',
      points: 15,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'multiple-choice',
      content: 'What does the "Top-p" (Nucleus Sampling) parameter control?',
      options: ['Response length', 'Vocabulary selection diversity', 'Response format', 'Topic scope'],
      correctAnswer: 'Vocabulary selection diversity',
      points: 15,
      category: 'AI Parameters',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    // Short Answer
    {
      level: 4,
      type: 'short-answer',
      content: 'Explain what "Role Setting" does in Prompt Engineering and give an example.',
      correctAnswer:
        'Role setting involves setting the role AI should play at the beginning of the Prompt, helping AI better understand the task context and response style. For example: "You are a senior Python developer, please help me review this code."',
      points: 25,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'short-answer',
      content: 'Explain the effect of the Temperature parameter on AI output, and when to use higher or lower values.',
      correctAnswer:
        'Temperature controls the randomness of output. Lower values (like 0.2) produce more deterministic, consistent responses, suitable for tasks requiring precise answers; higher values (like 0.8) produce more creative, diverse responses, suitable for creative writing.',
      points: 25,
      category: 'AI Parameters',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'short-answer',
      content: 'Describe the differences between "Few-shot Learning" and "Zero-shot Learning" and their applicable scenarios.',
      correctAnswer:
        'Zero-shot provides no examples, suitable for simple, straightforward tasks. Few-shot provides a few examples, suitable for tasks requiring specific formats or styles. Few-shot usually achieves more accurate results but requires more tokens.',
      points: 25,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'short-answer',
      content: 'Explain what AI "Hallucination" is and how to reduce its occurrence.',
      correctAnswer:
        'AI hallucination refers to AI generating information that seems reasonable but is actually incorrect or fabricated. Reduction methods include: asking AI to only answer based on provided information, requiring source citations, using lower temperature, and manually verifying outputs.',
      points: 25,
      category: 'AI Basics',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 4,
      type: 'short-answer',
      content: 'Explain why specifying output format is important when designing Prompts, with an example.',
      correctAnswer:
        'Specifying output format ensures AI responses match the expected structure, facilitating subsequent processing. For example: "Please respond in JSON format with name, description, and price fields," allowing direct use in programming.',
      points: 25,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 5 Questions (5 Multiple Choice + 5 Short Answer)
  // ==========================================
  const level5Questions: Omit<QuestionRecord, 'id'>[] = [
    // Multiple Choice
    {
      level: 5,
      type: 'multiple-choice',
      content: 'What is the core concept of the "ReAct" (Reasoning and Acting) framework?',
      options: ['Focus only on reasoning', 'Combining reasoning and action', 'Focus only on action', 'Avoiding reasoning'],
      correctAnswer: 'Combining reasoning and action',
      points: 15,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'multiple-choice',
      content: 'What is the most effective strategy when processing long text?',
      options: ['Send all content at once', 'Process in segments and summarize', 'Only process the beginning', 'Randomly extract paragraphs'],
      correctAnswer: 'Process in segments and summarize',
      points: 15,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'multiple-choice',
      content: 'What is a characteristic of the "Tree of Thoughts" (ToT) technique?',
      options: ['Linear thinking', 'Exploring multiple reasoning paths', 'Using only a single answer', 'Avoiding intermediate steps'],
      correctAnswer: 'Exploring multiple reasoning paths',
      points: 15,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'multiple-choice',
      content: 'What is the main advantage of "Streaming" mode in API calls?',
      options: ['Lower cost', 'Real-time response display', 'Higher accuracy', 'Fewer tokens'],
      correctAnswer: 'Real-time response display',
      points: 15,
      category: 'AI Technology',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'multiple-choice',
      content: 'What is "Embedding" mainly used for in AI applications?',
      options: ['Generating images', 'Converting text to numerical vectors', 'Translating languages', 'Compressing files'],
      correctAnswer: 'Converting text to numerical vectors',
      points: 15,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    // Short Answer
    {
      level: 5,
      type: 'short-answer',
      content: 'Explain what "Prompt Chaining" is and how it helps handle complex tasks.',
      correctAnswer:
        'Prompt Chaining breaks down complex tasks into multiple smaller Prompts, executed sequentially with the output of one becoming the input of the next. This improves accuracy, facilitates debugging, and handles tasks exceeding context limits.',
      points: 25,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'short-answer',
      content: 'Explain how RAG (Retrieval-Augmented Generation) works and its advantages.',
      correctAnswer:
        'RAG combines retrieval systems with generation models, first retrieving relevant information from a knowledge base, then providing it as context for AI to generate responses. Advantages include: reducing hallucinations, providing up-to-date information, and traceable sources.',
      points: 25,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'short-answer',
      content: 'Describe how to design an effective "System Prompt" and what elements it should include.',
      correctAnswer:
        'An effective System Prompt should include: role definition, task scope, behavior guidelines, response format, and constraints. For example, setting professional domain, prohibited content, default language style, etc.',
      points: 25,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'short-answer',
      content: 'Explain the differences between "Fine-tuning" and "In-context Learning" and their applicable scenarios.',
      correctAnswer:
        'Fine-tuning retrains the model to adapt to specific tasks, requiring data and computational resources, suitable for large-scale professional applications. In-context Learning provides examples through Prompts, no training needed, suitable for rapid prototyping and small-scale applications.',
      points: 25,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 5,
      type: 'short-answer',
      content: 'Explain how to effectively manage "Prompt versioning" in AI application development.',
      correctAnswer:
        'Prompt version management includes: using version control systems to track changes, creating test cases to evaluate effectiveness, recording performance metrics for each version, maintaining a Prompt template library, and establishing A/B testing processes.',
      points: 25,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 6 Questions (5 Multiple Choice + 5 Short Answer)
  // ==========================================
  const level6Questions: Omit<QuestionRecord, 'id'>[] = [
    // Multiple Choice
    {
      level: 6,
      type: 'multiple-choice',
      content: 'What is the purpose of "Function Calling" in AI APIs?',
      options: ['Calling remote servers', 'Enabling AI to use external tools', 'Optimizing response speed', 'Reducing costs'],
      correctAnswer: 'Enabling AI to use external tools',
      points: 15,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'multiple-choice',
      content: 'What is the main task of the "Planning" stage when building an AI Agent?',
      options: ['Executing actions', 'Developing steps to solve problems', 'Collecting data', 'Generating responses'],
      correctAnswer: 'Developing steps to solve problems',
      points: 15,
      category: 'AI Agent',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'multiple-choice',
      content: 'What is the advantage of "Semantic Search" compared to traditional keyword search?',
      options: ['Faster speed', 'Understanding meaning rather than just matching text', 'Lower cost', 'No index needed'],
      correctAnswer: 'Understanding meaning rather than just matching text',
      points: 15,
      category: 'AI Technology',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'multiple-choice',
      content: 'What is the key to collaboration between Agents in a Multi-Agent system?',
      options: ['Using the same model', 'Clear role division and communication protocols', 'Sharing all information', 'Avoiding interaction'],
      correctAnswer: 'Clear role division and communication protocols',
      points: 15,
      category: 'AI Agent',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'multiple-choice',
      content: 'What is the purpose of "Guardrails" in AI applications?',
      options: ['Increase speed', 'Restrict AI behavior within safe boundaries', 'Increase creativity', 'Reduce costs'],
      correctAnswer: 'Restrict AI behavior within safe boundaries',
      points: 15,
      category: 'AI Security',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    // Short Answer
    {
      level: 6,
      type: 'short-answer',
      content: 'Explain how to design an AI system capable of "Self-Reflection" to improve output quality.',
      correctAnswer:
        'Designing a self-reflection system requires: having AI generate an initial response, then evaluate the quality and issues of that response, then make corrections based on the evaluation. Prompts like "Please check if your answer..." can be used to trigger reflection.',
      points: 25,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'short-answer',
      content: 'Describe the security issues to consider when deploying AI applications in enterprise environments.',
      correctAnswer:
        'Considerations include: data privacy protection, Prompt Injection defense, output content review, API key management, access control, audit logs, compliance requirements, and data leakage risks.',
      points: 25,
      category: 'AI Security',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'short-answer',
      content: 'Explain the role of "Vector Database" in AI applications and factors to consider when choosing one.',
      correctAnswer:
        'Vector Database stores and retrieves embedding vectors, core to RAG systems. Selection factors: query speed, scalability, supported distance functions, integration with existing systems, cost, and metadata filtering needs.',
      points: 25,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'short-answer',
      content: 'Explain how to evaluate AI system output quality, including metrics and methods.',
      correctAnswer:
        'Evaluation methods include: human evaluation, automated metrics (like BLEU, ROUGE), A/B testing, user satisfaction surveys. Metrics include: accuracy, relevance, completeness, consistency, safety, and latency.',
      points: 25,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 6,
      type: 'short-answer',
      content: 'Describe the main features and use cases of "LLM Orchestration" frameworks (like LangChain).',
      correctAnswer:
        'LLM Orchestration frameworks provide: Prompt template management, Chain composition, Agent construction, memory management, tool integration. Suitable for building complex AI applications like chatbots, document Q&A, and automated workflows.',
      points: 25,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 7 Questions (8 Short Answer + 2 Essay)
  // ==========================================
  const level7Questions: Omit<QuestionRecord, 'id'>[] = [
    // Short Answer
    {
      level: 7,
      type: 'short-answer',
      content: 'Compare the differences and applicable scenarios of Zero-shot, One-shot, and Few-shot prompting.',
      correctAnswer:
        'Zero-shot: No examples provided, suitable for simple tasks. One-shot: One example provided, suitable for tasks requiring format reference. Few-shot: Multiple examples provided, suitable for complex tasks or those requiring specific styles. Few-shot has highest accuracy but consumes more tokens.',
      points: 20,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Explain how to use System Prompt to control AI behavior and response style.',
      correctAnswer:
        'System Prompt sets AI\'s basic behavior rules, including role definition, response style, and constraints. It is set before the conversation begins and affects the entire dialogue. It needs to be clear, specific, and include both positive and negative instructions.',
      points: 20,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Explain the concept of "Context Window" and its impact on AI application design.',
      correctAnswer:
        'Context Window is the maximum number of tokens a model can process simultaneously. Impacts include: need to manage conversation history, long texts need segmented processing, need to design effective context compression strategies, and affects RAG system chunk size design.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Describe how to effectively manage conversation history when building a chatbot.',
      correctAnswer:
        'Conversation history management strategies: sliding window keeping only the last N turns, summarizing old conversations, extracting and storing important information, using embeddings to retrieve relevant history, and layered storage (short-term/long-term memory).',
      points: 20,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Explain the design principles and best practices of "Prompt Templates".',
      correctAnswer:
        'Design principles: modular structure, clear variable marking, include error handling instructions, consider edge cases, version control. Best practices: use delimiters, provide output examples, set clear constraints, consider multilingual support.',
      points: 20,
      category: 'Advanced Prompt',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Explain how to use "Structured Output" to ensure AI responses match specific formats.',
      correctAnswer:
        'Structured Output methods: explicitly specify JSON/XML format, provide schema definition, use Function Calling, require format declaration before response, use post-processing validation and correction.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Describe "Error Handling" strategies in AI applications, including common error types and handling methods.',
      correctAnswer:
        'Error types: API errors, timeouts, format errors, content violations, hallucinations. Handling methods: retry mechanisms, fallback responses, error logging, user-friendly prompts, backup model switching.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'short-answer',
      content: 'Explain how to design an AI system capable of handling multi-turn conversations.',
      correctAnswer:
        'Multi-turn conversation design: maintain conversation state, track user intent, handle context switching, support clarification questions, implement conversation repair, design exit mechanisms. Need to consider memory management and consistency.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    // Essay
    {
      level: 7,
      type: 'essay',
      content:
        'Design a complete Prompt architecture for AI to assist in writing a tech product review article. Include role setting, task description, format requirements, and examples.',
      rubric:
        'Grading Criteria: 1. Clear role setting (20%) 2. Complete task description (20%) 3. Clear format requirements (20%) 4. Appropriate examples provided (20%) 5. Overall logic and executability (20%)',
      points: 60,
      category: 'Prompt Practice',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 7,
      type: 'essay',
      content: 'Analyze the challenges and best practices of introducing AI tools in enterprise environments, and provide your recommendations.',
      rubric:
        'Grading Criteria: 1. In-depth challenge analysis (25%) 2. Specific and feasible best practices (25%) 3. Creative and practical recommendations (25%) 4. Clear logical argumentation (25%)',
      points: 60,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 8 Questions (8 Short Answer + 2 Essay)
  // ==========================================
  const level8Questions: Omit<QuestionRecord, 'id'>[] = [
    // Short Answer
    {
      level: 8,
      type: 'short-answer',
      content: 'Explain the implementation methods and design considerations of "Tool Use" in AI Agents.',
      correctAnswer:
        'Implementation methods: define tool schema, Function Calling API, tool selection logic. Design considerations: clear tool descriptions, error handling, permission control, execution result parsing, avoiding infinite loops.',
      points: 20,
      category: 'AI Agent',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Explain the importance of "Chunking" strategies in processing long text and implementation methods.',
      correctAnswer:
        'Chunking divides long text into segments suitable for model processing. Strategies include: fixed size, sentence boundaries, paragraph boundaries, semantic segmentation. Need to consider overlap to maintain context coherence, and chunk size needs to balance accuracy and efficiency.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Describe how to design an AI assistant with "memory" functionality.',
      correctAnswer:
        'Memory design: short-term memory (current conversation), long-term memory (persistent storage), working memory (task-related). Implementation: vector database storage, key information extraction, memory retrieval, forgetting mechanisms, memory update strategies.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Explain how to evaluate and compare different AI models on specific tasks.',
      correctAnswer:
        'Evaluation methods: create test sets, define evaluation metrics (accuracy, latency, cost), human evaluation, A/B testing. Comparison dimensions: task fit, cost-effectiveness, stability, availability, compliance.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Explain optimization strategies for "Retrieval-Augmented Generation" (RAG) systems.',
      correctAnswer:
        'RAG optimization: improve embedding models, adjust chunk strategies, optimize retrieval algorithms, rerank results, hybrid retrieval (keyword + semantic), dynamically adjust retrieval count, context compression.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Describe "cost optimization" strategies in AI applications.',
      correctAnswer:
        'Cost optimization: choose appropriate model size, cache common responses, compress Prompts, batch processing, limit output length, use cheaper models for initial screening, monitor usage, set budget alerts.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'medium',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Explain how to design an AI system capable of handling "fuzzy queries".',
      correctAnswer:
        'Fuzzy query handling: intent recognition, entity extraction, clarification question generation, multiple hypothesis handling, progressive refinement, relevant suggestions, context inference.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'short-answer',
      content: 'Explain the design challenges and solutions for "Multi-Modal" AI systems.',
      correctAnswer:
        'Challenges: alignment of different modalities, unified representation, cross-modal reasoning, resource consumption. Solutions: use multi-modal models, modality conversion, hierarchical processing, attention mechanism integration.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    // Essay
    {
      level: 8,
      type: 'essay',
      content:
        'Design a complete AI customer service system architecture, including intent recognition, knowledge base retrieval, multi-turn conversation management, and human handoff mechanisms. Explain the design considerations and implementation methods of each component.',
      rubric:
        'Grading Criteria: 1. Architecture completeness (20%) 2. Reasonable component design (20%) 3. Clear process logic (20%) 4. Appropriate technology choices (20%) 5. Practicality and scalability (20%)',
      points: 60,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 8,
      type: 'essay',
      content:
        'Analyze the technical features, strengths and weaknesses of current mainstream AI models (GPT-4, Claude, Gemini, etc.), and provide model selection recommendations for different application scenarios.',
      rubric:
        'Grading Criteria: 1. Depth of technical analysis (25%) 2. Objective and comprehensive comparison (25%) 3. Practical scenario recommendations (25%) 4. Professional and clear argumentation (25%)',
      points: 60,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 9 Questions (8 Short Answer + 2 Essay)
  // ==========================================
  const level9Questions: Omit<QuestionRecord, 'id'>[] = [
    // Short Answer
    {
      level: 9,
      type: 'short-answer',
      content: 'Explain the concept of "AI Orchestration" and its applications in complex systems.',
      correctAnswer:
        'AI Orchestration coordinates multiple AI components and external systems to work together. Applications: workflow automation, multi-model collaboration, conditional branch handling, error recovery, state management. Frameworks like LangChain, LlamaIndex.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Explain the principles of "Constitutional AI" and its applications in safe AI systems.',
      correctAnswer:
        'Constitutional AI uses a set of principles (constitution) to guide AI behavior, through self-criticism and correction to comply with these principles. Applied to reduce harmful outputs, ensure value alignment, and build explainable safety mechanisms.',
      points: 20,
      category: 'AI Security',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Describe how to build a scalable AI service architecture.',
      correctAnswer:
        'Scalable architecture: load balancing, model service separation, caching layer, asynchronous processing, auto-scaling, monitoring and alerting, multi-region deployment, API gateway, rate limiting.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Explain automated methods and tools for "Prompt Optimization".',
      correctAnswer:
        'Automated methods: Prompt search space definition, evaluation function design, genetic algorithm/gradient method optimization, automated A/B testing. Tools: DSPy, PromptPerfect, custom evaluation pipelines.',
      points: 20,
      category: 'Advanced Prompt',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Explain how "Knowledge Graph" can be combined with AI applications.',
      correctAnswer:
        'Combination methods: Knowledge Graph provides structured knowledge, AI performs reasoning and generation. Applications: enhanced RAG, entity relationship queries, knowledge reasoning, Q&A systems, knowledge completion.',
      points: 20,
      category: 'AI Technology',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Describe design methods for AI system "explainability".',
      correctAnswer:
        'Explainability methods: require AI to explain reasoning process, provide evidence citations, confidence assessment, decision tree visualization, attention mechanism analysis, counterfactual explanations.',
      points: 20,
      category: 'AI Security',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Explain how to design "human-AI collaboration" workflows.',
      correctAnswer:
        'Human-AI collaboration design: clear division of labor, human review checkpoints, confidence threshold settings, exception escalation, feedback loops, performance monitoring, gradual automation. Balance efficiency and controllability.',
      points: 20,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'short-answer',
      content: 'Explain the core concepts and implementation challenges of "Agentic AI".',
      correctAnswer:
        'Core concepts: autonomous planning, tool use, continuous execution, self-reflection. Challenges: task decomposition, error recovery, safety control, resource management, avoiding infinite loops, maintaining goal consistency.',
      points: 20,
      category: 'AI Agent',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    // Essay
    {
      level: 9,
      type: 'essay',
      content:
        'Design an enterprise-level AI document processing system that can handle multiple document formats (PDF, Word, images, etc.), implement intelligent classification, information extraction, and Q&A functionality. Please detail the technical architecture, module design, and deployment strategy.',
      rubric:
        'Grading Criteria: 1. Complete architecture design (20%) 2. Reasonable technology selection (20%) 3. Detailed module design (20%) 4. Feasible deployment strategy (20%) 5. Consideration of scalability and maintainability (20%)',
      points: 60,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 9,
      type: 'essay',
      content:
        'Discuss the security issues of AI Agent systems, including potential risks, attack vectors, and defense mechanisms, and propose a complete security design framework.',
      rubric:
        'Grading Criteria: 1. Comprehensive risk analysis (25%) 2. Accurate attack vector identification (25%) 3. Effective defense mechanisms (25%) 4. Systematic framework design (25%)',
      points: 60,
      category: 'AI Security',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 10 Questions (5 Essay)
  // ==========================================
  const level10Questions: Omit<QuestionRecord, 'id'>[] = [
    {
      level: 10,
      type: 'essay',
      content:
        'Design a complete AI-driven content creation workflow covering all stages from ideation to publication. Include specific tool selections, Prompt design, quality control mechanisms, and team collaboration methods.',
      rubric:
        'Grading Criteria: 1. Workflow completeness (20%) 2. Tool selection rationality (20%) 3. Prompt design quality (20%) 4. Quality control mechanisms (20%) 5. Innovation and practicality (20%)',
      points: 100,
      category: 'AI Workflow',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 10,
      type: 'essay',
      content:
        'Explore the application potential and ethical considerations of AI in education. Analyze from three perspectives: teachers, students, and educational institutions, and propose specific implementation recommendations and risk control measures.',
      rubric:
        'Grading Criteria: 1. In-depth application potential analysis (25%) 2. Comprehensive ethical considerations (25%) 3. Balanced multi-perspective analysis (25%) 4. Specific and feasible recommendations (25%)',
      points: 100,
      category: 'AI Ethics',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 10,
      type: 'essay',
      content:
        'Design an AI transformation strategy for small and medium enterprises, including detailed planning for four stages: assessment, implementation, training, and evaluation. Consider challenges such as budget constraints, talent gaps, and change management.',
      rubric:
        'Grading Criteria: 1. Strategy completeness (25%) 2. Practical feasibility (25%) 3. Reasonable resource considerations (25%) 4. Scientific effectiveness evaluation methods (25%)',
      points: 100,
      category: 'AI Strategy',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 10,
      type: 'essay',
      content:
        'Compare and analyze three mainstream AI chatbots (ChatGPT, Claude, Gemini) in terms of technical architecture, advantages and disadvantages, and provide selection recommendations for different use cases (customer service, content creation, software development, education).',
      rubric:
        'Grading Criteria: 1. Professional technical analysis (25%) 2. Objective and comprehensive comparison (25%) 3. Practical scenario recommendations (25%) 4. Clear argumentation structure (25%)',
      points: 100,
      category: 'AI Tools',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 10,
      type: 'essay',
      content:
        'Write an AI usage policy draft suitable for a 50-person technology company. Cover data security, intellectual property rights, usage guidelines, responsibility attribution, and employee training.',
      rubric:
        'Grading Criteria: 1. Policy completeness (20%) 2. Security considerations (20%) 3. Legal compliance (20%) 4. Practical enforceability (20%) 5. Format and professionalism (20%)',
      points: 100,
      category: 'AI Governance',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 11 Questions (5 Essay)
  // ==========================================
  const level11Questions: Omit<QuestionRecord, 'id'>[] = [
    {
      level: 11,
      type: 'essay',
      content:
        'Design an AI-driven product development process from market research, concept design, prototype development to user testing. Explain the specific application methods and expected benefits of AI at each stage.',
      rubric:
        'Grading Criteria: 1. Complete process design (20%) 2. Specific AI applications (20%) 3. Reasonable benefit analysis (20%) 4. Feasible implementation steps (20%) 5. Innovation (20%)',
      points: 100,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 11,
      type: 'essay',
      content:
        'Build an AI-driven research analysis framework capable of processing academic papers, market reports, and technical documents. Detail the data processing workflow, analysis methods, and result presentation.',
      rubric:
        'Grading Criteria: 1. Framework completeness (25%) 2. Methodological rigor (25%) 3. Technical implementation feasibility (25%) 4. Professional result presentation (25%)',
      points: 100,
      category: 'AI Applications',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 11,
      type: 'essay',
      content:
        'Analyze the transformative impact of AI on different industries (manufacturing, finance, healthcare, retail) and predict development trends for the next five years. Provide specific cases and data to support your analysis.',
      rubric:
        'Grading Criteria: 1. Depth of industry analysis (25%) 2. Specific and compelling cases (25%) 3. Reasonable trend predictions (25%) 4. Insightful cross-industry comparisons (25%)',
      points: 100,
      category: 'AI Trends',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 11,
      type: 'essay',
      content:
        'Design a complete AI productization pathway from proof of concept (POC) to commercial deployment. Include technical development, user validation, business model, and scaling strategy.',
      rubric:
        'Grading Criteria: 1. Complete pathway planning (25%) 2. Thorough technical considerations (25%) 3. Clear business thinking (25%) 4. Adequate risk management (25%)',
      points: 100,
      category: 'AI Strategy',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 11,
      type: 'essay',
      content:
        'Explore talent development strategies in the AI era, including skill transformation, learning paths, organizational change, and leadership development. Propose specific action recommendations and evaluation metrics.',
      rubric:
        'Grading Criteria: 1. Comprehensive and in-depth analysis (25%) 2. Complete systematic strategy (25%) 3. Specific and feasible recommendations (25%) 4. Scientific evaluation metrics (25%)',
      points: 100,
      category: 'AI Talent',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Level 12 Questions (5 Essay)
  // ==========================================
  const level12Questions: Omit<QuestionRecord, 'id'>[] = [
    {
      level: 12,
      type: 'essay',
      content:
        'Design a governance framework for large-scale AI systems, covering technical standards, ethical guidelines, regulatory compliance, and risk management. Consider regulatory differences and cultural factors across different global regions.',
      rubric:
        'Grading Criteria: 1. Governance framework completeness (20%) 2. Multi-dimensional considerations (20%) 3. International perspective (20%) 4. Practical feasibility (20%) 5. Forward-thinking (20%)',
      points: 100,
      category: 'AI Governance',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 12,
      type: 'essay',
      content:
        'Analyze the long-term impact of AI on socioeconomic structures, including the job market, wealth distribution, social equity, and democratic institutions. Propose policy recommendations to balance technological development with social welfare.',
      rubric:
        'Grading Criteria: 1. Depth and breadth of analysis (25%) 2. Logical argumentation (25%) 3. Policy recommendation feasibility (25%) 4. Social responsibility awareness (25%)',
      points: 100,
      category: 'AI Social Impact',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 12,
      type: 'essay',
      content:
        'Design a ten-year enterprise AI strategic blueprint including technology roadmap, organizational capability building, ecosystem construction, and competitive strategy. Consider differentiated strategies for companies of different sizes.',
      rubric:
        'Grading Criteria: 1. Macro strategic vision (20%) 2. Complete systematic planning (20%) 3. Clear execution path (20%) 4. Differentiated thinking (20%) 5. Balance of innovation and pragmatism (20%)',
      points: 100,
      category: 'AI Strategy',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 12,
      type: 'essay',
      content:
        'Explore the development prospects, technical challenges, ethical boundaries, and social readiness for Artificial General Intelligence (AGI). Share your insights on AGI development paths and management mechanisms.',
      rubric:
        'Grading Criteria: 1. Depth of technical understanding (25%) 2. Maturity of ethical thinking (25%) 3. Breadth of social perspective (25%) 4. Original insights (25%)',
      points: 100,
      category: 'AI Future',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
    {
      level: 12,
      type: 'essay',
      content:
        'Write a white paper outline on "Responsible AI Development" covering principle formulation, practical guidelines, evaluation mechanisms, and case studies. Demonstrate deep understanding and systematic thinking about AI ethics.',
      rubric:
        'Grading Criteria: 1. Content completeness (20%) 2. Principle clarity (20%) 3. Practical guidance (20%) 4. Scientific evaluation (20%) 5. Professional expression (20%)',
      points: 100,
      category: 'AI Ethics',
      difficulty: 'hard',
      createdAt: now,
      updatedAt: now,
    },
  ];

  // ==========================================
  // Create all questions
  // ==========================================
  const allQuestions = [
    ...level1Questions.map((q, i) => ({ ...q, id: `q-lv1-${i + 1}` })),
    ...level2Questions.map((q, i) => ({ ...q, id: `q-lv2-${i + 1}` })),
    ...level3Questions.map((q, i) => ({ ...q, id: `q-lv3-${i + 1}` })),
    ...level4Questions.map((q, i) => ({ ...q, id: `q-lv4-${i + 1}` })),
    ...level5Questions.map((q, i) => ({ ...q, id: `q-lv5-${i + 1}` })),
    ...level6Questions.map((q, i) => ({ ...q, id: `q-lv6-${i + 1}` })),
    ...level7Questions.map((q, i) => ({ ...q, id: `q-lv7-${i + 1}` })),
    ...level8Questions.map((q, i) => ({ ...q, id: `q-lv8-${i + 1}` })),
    ...level9Questions.map((q, i) => ({ ...q, id: `q-lv9-${i + 1}` })),
    ...level10Questions.map((q, i) => ({ ...q, id: `q-lv10-${i + 1}` })),
    ...level11Questions.map((q, i) => ({ ...q, id: `q-lv11-${i + 1}` })),
    ...level12Questions.map((q, i) => ({ ...q, id: `q-lv12-${i + 1}` })),
  ];

  db.questions.createMany(allQuestions as QuestionRecord[]);

  // ==========================================
  // Create test account progress data
  // ==========================================
  const progressRecords: UserTestProgressRecord[] = [
    {
      id: 'utp-guest',
      userId: 'guest',
      currentLevel: 1,
      highestPassedLevel: 0,
      totalAttempts: 0,
      totalPassed: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'utp-user-5',
      userId: 'user-5',
      currentLevel: 1,
      highestPassedLevel: 0,
      totalAttempts: 0,
      totalPassed: 0,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'utp-user-7',
      userId: 'user-7',
      currentLevel: 2,
      highestPassedLevel: 1,
      totalAttempts: 3,
      totalPassed: 1,
      lastAttemptAt: new Date('2026-01-20'),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'utp-user-1',
      userId: 'user-1',
      currentLevel: 4,
      highestPassedLevel: 3,
      totalAttempts: 8,
      totalPassed: 3,
      lastAttemptAt: new Date('2026-01-18'),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'utp-user-6',
      userId: 'user-6',
      currentLevel: 5,
      highestPassedLevel: 4,
      totalAttempts: 10,
      totalPassed: 4,
      lastAttemptAt: new Date('2026-01-19'),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'utp-user-2',
      userId: 'user-2',
      currentLevel: 7,
      highestPassedLevel: 6,
      totalAttempts: 15,
      totalPassed: 6,
      lastAttemptAt: new Date('2026-01-20'),
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'utp-user-4',
      userId: 'user-4',
      currentLevel: 10,
      highestPassedLevel: 9,
      totalAttempts: 25,
      totalPassed: 9,
      lastAttemptAt: new Date('2026-01-21'),
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.userTestProgress.createMany(progressRecords);
}
