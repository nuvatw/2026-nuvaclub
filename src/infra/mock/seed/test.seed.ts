import type { MockDB } from '../core/MockDB';
import type {
  UserTestProgressRecord,
} from '../schema';

/**
 * Level Configuration
 * Lv1-3: True/False + Multiple Choice, 15 min
 * Lv4-6: Multiple Choice + Short Answer, 20 min
 * Lv7-9: Short Answer + Essay, 30 min
 * Lv10-12: Essay only, 45 min
 */
export const LEVEL_CONFIGS = [
  { levels: [1, 2, 3], durationMinutes: 15 },
  { levels: [4, 5, 6], durationMinutes: 20 },
  { levels: [7, 8, 9], durationMinutes: 30 },
  { levels: [10, 11, 12], durationMinutes: 45 },
];

export function getLevelDuration(level: number): number {
  if (level <= 3) return 15;
  if (level <= 6) return 20;
  if (level <= 9) return 30;
  return 45;
}

export async function seedTest(db: MockDB): Promise<void> {
  const now = new Date();

  // ==========================================
  // TEST LEVELS
  // ==========================================
  db.testLevels.createMany([
    { id: 'level-1', level: 1, name: 'AI Fundamentals I', description: 'Introduction to AI basics and terminology', passingPercentage: 70, timeLimit: 900, questionCount: 10, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-2', level: 2, name: 'AI Fundamentals II', description: 'ChatGPT and AI chatbot basics', passingPercentage: 70, timeLimit: 900, questionCount: 10, prerequisiteLevel: 1, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-3', level: 3, name: 'Prompt Basics', description: 'Fundamentals of prompt engineering', passingPercentage: 70, timeLimit: 900, questionCount: 10, prerequisiteLevel: 2, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-4', level: 4, name: 'Advanced Prompting I', description: 'Advanced prompt techniques and patterns', passingPercentage: 75, timeLimit: 1200, questionCount: 10, prerequisiteLevel: 3, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-5', level: 5, name: 'Advanced Prompting II', description: 'Tool integration and AI workflows', passingPercentage: 75, timeLimit: 1200, questionCount: 10, prerequisiteLevel: 4, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-6', level: 6, name: 'Content Creation', description: 'AI-powered content creation strategies', passingPercentage: 75, timeLimit: 1200, questionCount: 10, prerequisiteLevel: 5, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-7', level: 7, name: 'API Fundamentals', description: 'Working with AI APIs and integrations', passingPercentage: 80, timeLimit: 1800, questionCount: 10, prerequisiteLevel: 6, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-8', level: 8, name: 'Automation Workflows', description: 'Building AI automation pipelines', passingPercentage: 80, timeLimit: 1800, questionCount: 10, prerequisiteLevel: 7, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-9', level: 9, name: 'AI in Business', description: 'Enterprise AI applications and strategy', passingPercentage: 80, timeLimit: 1800, questionCount: 10, prerequisiteLevel: 8, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-10', level: 10, name: 'AI Architecture', description: 'Designing AI systems and infrastructure', passingPercentage: 85, timeLimit: 2700, questionCount: 10, prerequisiteLevel: 9, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-11', level: 11, name: 'Enterprise Deployment', description: 'Large-scale AI deployment strategies', passingPercentage: 85, timeLimit: 2700, questionCount: 10, prerequisiteLevel: 10, isActive: true, createdAt: now, updatedAt: now },
    { id: 'level-12', level: 12, name: 'AI Leadership', description: 'AI governance, ethics, and innovation', passingPercentage: 85, timeLimit: 2700, questionCount: 10, prerequisiteLevel: 11, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // QUESTION CATEGORIES
  // ==========================================
  db.questionCategories.createMany([
    { id: 'cat-1', name: 'AI Basics', slug: 'ai-basics', description: 'Fundamental AI concepts and terminology', sortOrder: 1, createdAt: now, updatedAt: now },
    { id: 'cat-2', name: 'Prompt Engineering', slug: 'prompt-engineering', description: 'Prompt design and optimization', sortOrder: 2, createdAt: now, updatedAt: now },
    { id: 'cat-3', name: 'AI Tools', slug: 'ai-tools', description: 'AI tools and applications', sortOrder: 3, createdAt: now, updatedAt: now },
    { id: 'cat-4', name: 'Advanced Techniques', slug: 'advanced-techniques', description: 'Advanced prompting and AI techniques', sortOrder: 4, createdAt: now, updatedAt: now },
    { id: 'cat-5', name: 'AI Parameters', slug: 'ai-parameters', description: 'AI model parameters and settings', sortOrder: 5, createdAt: now, updatedAt: now },
    { id: 'cat-6', name: 'Content Creation', slug: 'content-creation', description: 'AI-powered content generation', sortOrder: 6, createdAt: now, updatedAt: now },
    { id: 'cat-7', name: 'API & Integration', slug: 'api-integration', description: 'AI APIs and system integration', sortOrder: 7, createdAt: now, updatedAt: now },
    { id: 'cat-8', name: 'Automation', slug: 'automation', description: 'AI automation and workflows', sortOrder: 8, createdAt: now, updatedAt: now },
    { id: 'cat-9', name: 'Business Strategy', slug: 'business-strategy', description: 'AI in business applications', sortOrder: 9, createdAt: now, updatedAt: now },
    { id: 'cat-10', name: 'Architecture', slug: 'architecture', description: 'AI system design and architecture', sortOrder: 10, createdAt: now, updatedAt: now },
    { id: 'cat-11', name: 'Enterprise', slug: 'enterprise', description: 'Enterprise AI deployment', sortOrder: 11, createdAt: now, updatedAt: now },
    { id: 'cat-12', name: 'Leadership & Ethics', slug: 'leadership-ethics', description: 'AI governance and ethics', sortOrder: 12, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 1 QUESTIONS - AI Fundamentals I
  // (5 True/False + 5 Multiple Choice)
  // ==========================================
  db.questions.createMany([
    // True/False Questions (5 points each)
    { id: 'q-lv1-1', levelId: 'level-1', categoryId: 'cat-1', type: 'true-false', content: 'Artificial Intelligence (AI) refers to computer systems that can perform tasks typically requiring human intelligence.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-2', levelId: 'level-1', categoryId: 'cat-1', type: 'true-false', content: 'Machine Learning is a subset of AI that enables systems to learn from data without being explicitly programmed.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-3', levelId: 'level-1', categoryId: 'cat-1', type: 'true-false', content: 'AI systems can guarantee 100% accuracy in all their outputs and predictions.', correctAnswer: 'False', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-4', levelId: 'level-1', categoryId: 'cat-1', type: 'true-false', content: 'Deep Learning is a type of machine learning that uses neural networks with multiple layers.', correctAnswer: 'True', points: 5, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-5', levelId: 'level-1', categoryId: 'cat-1', type: 'true-false', content: 'Natural Language Processing (NLP) is an AI field focused on enabling computers to understand human language.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    // Multiple Choice Questions (10 points each)
    { id: 'q-lv1-6', levelId: 'level-1', categoryId: 'cat-1', type: 'multiple-choice', content: 'Which of the following is NOT a type of AI?', correctAnswer: 'Mechanical Intelligence', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-7', levelId: 'level-1', categoryId: 'cat-1', type: 'multiple-choice', content: 'What does "LLM" stand for in the context of AI?', correctAnswer: 'Large Language Model', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-8', levelId: 'level-1', categoryId: 'cat-1', type: 'multiple-choice', content: 'Which company developed GPT (Generative Pre-trained Transformer)?', correctAnswer: 'OpenAI', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-9', levelId: 'level-1', categoryId: 'cat-1', type: 'multiple-choice', content: 'What is "AI hallucination"?', correctAnswer: 'When AI generates false or inaccurate information', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv1-10', levelId: 'level-1', categoryId: 'cat-1', type: 'multiple-choice', content: 'Which of the following best describes Generative AI?', correctAnswer: 'AI that creates new content like text, images, or code', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 2 QUESTIONS - AI Fundamentals II (ChatGPT Basics)
  // (5 True/False + 5 Multiple Choice)
  // ==========================================
  db.questions.createMany([
    // True/False Questions
    { id: 'q-lv2-1', levelId: 'level-2', categoryId: 'cat-3', type: 'true-false', content: 'ChatGPT is a large language model developed by OpenAI.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-2', levelId: 'level-2', categoryId: 'cat-3', type: 'true-false', content: 'ChatGPT has real-time access to the internet and can browse current websites.', correctAnswer: 'False', points: 5, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-3', levelId: 'level-2', categoryId: 'cat-3', type: 'true-false', content: 'Claude is an AI assistant developed by Anthropic.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-4', levelId: 'level-2', categoryId: 'cat-3', type: 'true-false', content: 'AI chatbots remember all previous conversations permanently across different sessions.', correctAnswer: 'False', points: 5, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-5', levelId: 'level-2', categoryId: 'cat-3', type: 'true-false', content: 'GPT-4 is more capable than GPT-3.5 in terms of reasoning and accuracy.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    // Multiple Choice Questions
    { id: 'q-lv2-6', levelId: 'level-2', categoryId: 'cat-3', type: 'multiple-choice', content: 'Which of the following is NOT a popular AI chatbot?', correctAnswer: 'Photoshop', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-7', levelId: 'level-2', categoryId: 'cat-3', type: 'multiple-choice', content: 'What is the primary function of ChatGPT?', correctAnswer: 'Generate human-like text responses', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-8', levelId: 'level-2', categoryId: 'cat-3', type: 'multiple-choice', content: 'Which AI tool is specifically designed for image generation?', correctAnswer: 'DALL-E', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-9', levelId: 'level-2', categoryId: 'cat-3', type: 'multiple-choice', content: 'What is a "token" in the context of AI language models?', correctAnswer: 'A unit of text that the model processes', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv2-10', levelId: 'level-2', categoryId: 'cat-3', type: 'multiple-choice', content: 'Which company developed the Gemini AI model?', correctAnswer: 'Google', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 3 QUESTIONS - Prompt Basics
  // (5 True/False + 5 Multiple Choice)
  // ==========================================
  db.questions.createMany([
    // True/False Questions
    { id: 'q-lv3-1', levelId: 'level-3', categoryId: 'cat-2', type: 'true-false', content: 'A prompt is the input text you provide to an AI to get a response.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-2', levelId: 'level-3', categoryId: 'cat-2', type: 'true-false', content: 'The quality of AI output is independent of how well the prompt is written.', correctAnswer: 'False', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-3', levelId: 'level-3', categoryId: 'cat-2', type: 'true-false', content: 'Providing context in your prompt helps AI generate more relevant responses.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-4', levelId: 'level-3', categoryId: 'cat-2', type: 'true-false', content: 'Longer prompts always produce better results than shorter prompts.', correctAnswer: 'False', points: 5, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-5', levelId: 'level-3', categoryId: 'cat-2', type: 'true-false', content: 'Role-playing prompts (e.g., "Act as a teacher") can help AI adopt specific perspectives.', correctAnswer: 'True', points: 5, difficulty: 'easy', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    // Multiple Choice Questions
    { id: 'q-lv3-6', levelId: 'level-3', categoryId: 'cat-2', type: 'multiple-choice', content: 'What is the main purpose of prompt engineering?', correctAnswer: 'To optimize AI responses through better input design', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-7', levelId: 'level-3', categoryId: 'cat-2', type: 'multiple-choice', content: 'Which element is MOST important for a clear prompt?', correctAnswer: 'Specific instructions about the desired output', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-8', levelId: 'level-3', categoryId: 'cat-2', type: 'multiple-choice', content: 'What does "zero-shot" prompting mean?', correctAnswer: 'Asking AI to perform a task without providing examples', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-9', levelId: 'level-3', categoryId: 'cat-2', type: 'multiple-choice', content: 'Which of the following is a good practice when writing prompts?', correctAnswer: 'Be specific about the format you want', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv3-10', levelId: 'level-3', categoryId: 'cat-2', type: 'multiple-choice', content: 'What is "few-shot" prompting?', correctAnswer: 'Providing a few examples to guide the AI response', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 4 QUESTIONS - Advanced Prompting I
  // (5 Multiple Choice + 5 Short Answer)
  // ==========================================
  db.questions.createMany([
    // Multiple Choice Questions
    { id: 'q-lv4-1', levelId: 'level-4', categoryId: 'cat-4', type: 'multiple-choice', content: 'What is "Chain-of-Thought" (CoT) prompting?', correctAnswer: 'Asking AI to explain its reasoning step by step', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-2', levelId: 'level-4', categoryId: 'cat-5', type: 'multiple-choice', content: 'What does the "Temperature" parameter control in AI models?', correctAnswer: 'The randomness/creativity of responses', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-3', levelId: 'level-4', categoryId: 'cat-4', type: 'multiple-choice', content: 'What is the purpose of using delimiters in prompts?', correctAnswer: 'To clearly separate different sections of content', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-4', levelId: 'level-4', categoryId: 'cat-4', type: 'multiple-choice', content: 'What is "prompt injection"?', correctAnswer: 'Malicious input attempting to manipulate AI behavior', points: 10, difficulty: 'hard', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-5', levelId: 'level-4', categoryId: 'cat-5', type: 'multiple-choice', content: 'What happens when you set Temperature to 0?', correctAnswer: 'AI gives more deterministic, consistent responses', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    // Short Answer Questions
    { id: 'q-lv4-6', levelId: 'level-4', categoryId: 'cat-4', type: 'short-answer', content: 'Explain what "role setting" means in prompt engineering and provide one example.', correctAnswer: 'Role setting involves assigning a specific persona or expertise to the AI at the start of a prompt. Example: "You are an experienced Python developer" or "Act as a marketing expert"', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-7', levelId: 'level-4', categoryId: 'cat-5', type: 'short-answer', content: 'What is the difference between Temperature and Top-P parameters?', correctAnswer: 'Temperature controls randomness of word selection (0=deterministic, 1=creative). Top-P (nucleus sampling) limits word choices to a cumulative probability threshold. Both affect output diversity but work differently.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-8', levelId: 'level-4', categoryId: 'cat-4', type: 'short-answer', content: 'What are the benefits of using structured output formats (like JSON) in prompts?', correctAnswer: 'Benefits include: consistent parsing, easier integration with code, reduced ambiguity, machine-readable responses, and better data extraction for downstream processing.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-9', levelId: 'level-4', categoryId: 'cat-4', type: 'short-answer', content: 'Describe the "Persona Pattern" in prompt engineering.', correctAnswer: 'The Persona Pattern assigns AI a specific role/character to adopt, including expertise, tone, and perspective. It helps get specialized responses by framing the AI as an expert in a particular domain.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv4-10', levelId: 'level-4', categoryId: 'cat-4', type: 'short-answer', content: 'What is "prompt chaining" and when would you use it?', correctAnswer: 'Prompt chaining breaks complex tasks into sequential prompts where output from one becomes input for the next. Use it for multi-step tasks, complex reasoning, or when single prompts cannot handle the full workflow.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 5 QUESTIONS - Advanced Prompting II (Tool Integration)
  // (5 Multiple Choice + 5 Short Answer)
  // ==========================================
  db.questions.createMany([
    // Multiple Choice Questions
    { id: 'q-lv5-1', levelId: 'level-5', categoryId: 'cat-3', type: 'multiple-choice', content: 'What is "Function Calling" in AI APIs?', correctAnswer: 'Allowing AI to invoke external tools or functions', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-2', levelId: 'level-5', categoryId: 'cat-7', type: 'multiple-choice', content: 'What is RAG (Retrieval-Augmented Generation)?', correctAnswer: 'Combining AI with external knowledge retrieval', points: 10, difficulty: 'hard', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-3', levelId: 'level-5', categoryId: 'cat-3', type: 'multiple-choice', content: 'What is the primary benefit of using embeddings?', correctAnswer: 'Converting text to numerical vectors for similarity search', points: 10, difficulty: 'hard', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-4', levelId: 'level-5', categoryId: 'cat-3', type: 'multiple-choice', content: 'Which tool would you use to create AI-powered workflows without coding?', correctAnswer: 'Zapier or Make (Integromat)', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-5', levelId: 'level-5', categoryId: 'cat-7', type: 'multiple-choice', content: 'What is a vector database used for in AI applications?', correctAnswer: 'Storing and searching embeddings efficiently', points: 10, difficulty: 'hard', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    // Short Answer Questions
    { id: 'q-lv5-6', levelId: 'level-5', categoryId: 'cat-7', type: 'short-answer', content: 'Explain how RAG improves AI responses compared to using only the base model.', correctAnswer: 'RAG retrieves relevant information from external sources before generating responses. This provides up-to-date information, reduces hallucinations, enables domain-specific knowledge, and allows citing sources for accuracy.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-7', levelId: 'level-5', categoryId: 'cat-3', type: 'short-answer', content: 'What are the key considerations when choosing between different AI models for a task?', correctAnswer: 'Key considerations: task complexity, cost per token, response speed, context window size, accuracy requirements, available features (vision, code, etc.), and API availability/reliability.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-8', levelId: 'level-5', categoryId: 'cat-7', type: 'short-answer', content: 'Describe the process of creating an AI-powered chatbot with custom knowledge.', correctAnswer: 'Process: 1) Collect and clean knowledge documents, 2) Create embeddings and store in vector DB, 3) Set up retrieval system, 4) Design prompt template with context injection, 5) Implement conversation memory, 6) Add error handling and fallbacks.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-9', levelId: 'level-5', categoryId: 'cat-3', type: 'short-answer', content: 'What is the difference between fine-tuning and RAG for customizing AI?', correctAnswer: 'Fine-tuning trains model weights on custom data, permanently changing behavior. RAG retrieves context at runtime without modifying the model. RAG is more flexible and cost-effective; fine-tuning is better for consistent style/behavior changes.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv5-10', levelId: 'level-5', categoryId: 'cat-3', type: 'short-answer', content: 'Explain how AI plugins/tools extend the capabilities of language models.', correctAnswer: 'Plugins allow AI to perform actions beyond text generation: web browsing, code execution, database queries, API calls, file manipulation. They bridge the gap between AI knowledge and real-world actions/data.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 6 QUESTIONS - Content Creation
  // (5 Multiple Choice + 5 Short Answer)
  // ==========================================
  db.questions.createMany([
    // Multiple Choice Questions
    { id: 'q-lv6-1', levelId: 'level-6', categoryId: 'cat-6', type: 'multiple-choice', content: 'Which AI technique is best for maintaining consistent brand voice across content?', correctAnswer: 'Creating a detailed style guide prompt', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-2', levelId: 'level-6', categoryId: 'cat-6', type: 'multiple-choice', content: 'What is the best approach for AI-assisted long-form content creation?', correctAnswer: 'Outline first, then expand section by section', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-3', levelId: 'level-6', categoryId: 'cat-6', type: 'multiple-choice', content: 'Which factor is MOST important when using AI for SEO content?', correctAnswer: 'Human review and fact-checking', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-4', levelId: 'level-6', categoryId: 'cat-6', type: 'multiple-choice', content: 'What is "AI content detection" primarily used for?', correctAnswer: 'Identifying text generated by AI systems', points: 10, difficulty: 'easy', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-5', levelId: 'level-6', categoryId: 'cat-6', type: 'multiple-choice', content: 'Which approach produces the most natural AI-generated content?', correctAnswer: 'Iterative refinement with specific feedback', points: 10, difficulty: 'medium', isRandomized: true, isActive: true, createdAt: now, updatedAt: now },
    // Short Answer Questions
    { id: 'q-lv6-6', levelId: 'level-6', categoryId: 'cat-6', type: 'short-answer', content: 'Describe an effective workflow for creating blog posts with AI assistance.', correctAnswer: 'Workflow: 1) Research topic and gather sources, 2) Generate outline with AI, 3) Expand each section, 4) Add personal insights/examples, 5) Edit for voice and accuracy, 6) Optimize for SEO, 7) Final human review and polish.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-7', levelId: 'level-6', categoryId: 'cat-6', type: 'short-answer', content: 'How can you use AI to repurpose content across different formats and platforms?', correctAnswer: 'Strategies: Transform blog to social posts, extract quotes for graphics, create video scripts from articles, generate podcast outlines, adapt tone for different audiences, create summaries for newsletters, translate for international audiences.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-8', levelId: 'level-6', categoryId: 'cat-6', type: 'short-answer', content: 'What strategies help avoid generic AI-generated content?', correctAnswer: 'Strategies: Include specific examples, add personal anecdotes, use unique data/research, specify uncommon perspectives, provide detailed context, iterate with specific feedback, and always add human editorial polish.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-9', levelId: 'level-6', categoryId: 'cat-6', type: 'short-answer', content: 'Explain the ethical considerations when publishing AI-generated content.', correctAnswer: 'Considerations: Transparency/disclosure about AI use, fact-checking for accuracy, avoiding plagiarism, respecting copyright, maintaining authenticity, not misleading readers, ensuring human oversight, and following platform policies.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv6-10', levelId: 'level-6', categoryId: 'cat-6', type: 'short-answer', content: 'How do you create effective prompts for generating marketing copy?', correctAnswer: 'Effective prompts include: target audience description, product/service details, desired tone/voice, key benefits to highlight, call-to-action goals, character limits, brand guidelines, and examples of successful copy to emulate.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 7 QUESTIONS - API Fundamentals
  // (5 Short Answer + 5 Essay)
  // ==========================================
  db.questions.createMany([
    // Short Answer Questions
    { id: 'q-lv7-1', levelId: 'level-7', categoryId: 'cat-7', type: 'short-answer', content: 'Explain the difference between synchronous and streaming API responses for AI.', correctAnswer: 'Synchronous: Wait for complete response before returning. Streaming: Send response chunks as generated, enabling real-time display. Streaming improves UX for long responses but requires handling partial data.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-2', levelId: 'level-7', categoryId: 'cat-7', type: 'short-answer', content: 'What are API rate limits and how should you handle them?', correctAnswer: 'Rate limits restrict API calls per time period to prevent abuse. Handle with: exponential backoff, request queuing, caching responses, monitoring usage, using batch endpoints, and implementing graceful degradation.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-3', levelId: 'level-7', categoryId: 'cat-7', type: 'short-answer', content: 'Describe best practices for securing API keys in applications.', correctAnswer: 'Best practices: Never commit keys to code, use environment variables, implement server-side proxies, rotate keys regularly, use key scoping/permissions, monitor for leaked keys, and implement IP whitelisting where possible.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-4', levelId: 'level-7', categoryId: 'cat-7', type: 'short-answer', content: 'What is context window and why does it matter for API usage?', correctAnswer: 'Context window is the maximum tokens (input + output) a model can process. It limits conversation length and document size. Managing it requires truncation strategies, summarization, or chunking long content.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-5', levelId: 'level-7', categoryId: 'cat-7', type: 'short-answer', content: 'Explain how to implement conversation memory in AI applications.', correctAnswer: 'Implement memory by: storing message history, managing context window limits, summarizing old messages, using vector stores for long-term memory, implementing sliding windows, and distinguishing system/user/assistant roles.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    // Essay Questions
    { id: 'q-lv7-6', levelId: 'level-7', categoryId: 'cat-7', type: 'essay', content: 'Design an error handling strategy for an AI-powered application that uses multiple external APIs. Include handling for network failures, rate limits, content policy violations, and unexpected responses.', rubric: 'Grading: Comprehensive error types (25%), Retry strategies (25%), User experience handling (25%), Logging and monitoring (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-7', levelId: 'level-7', categoryId: 'cat-7', type: 'essay', content: 'Compare and contrast the APIs of OpenAI, Anthropic, and Google for AI applications. Discuss pricing, capabilities, ease of use, and ideal use cases for each.', rubric: 'Grading: Accurate comparisons (25%), Pricing analysis (25%), Use case recommendations (25%), Technical depth (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-8', levelId: 'level-7', categoryId: 'cat-7', type: 'essay', content: 'Design an API cost optimization strategy for a high-volume AI application. Consider caching, model selection, prompt optimization, and batching strategies.', rubric: 'Grading: Cost analysis (25%), Optimization techniques (25%), Implementation feasibility (25%), Trade-off considerations (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-9', levelId: 'level-7', categoryId: 'cat-7', type: 'essay', content: 'Explain how to implement a fallback system that switches between different AI providers based on availability, cost, and performance requirements.', rubric: 'Grading: Architecture design (25%), Failover logic (25%), Provider selection criteria (25%), Implementation details (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv7-10', levelId: 'level-7', categoryId: 'cat-7', type: 'essay', content: 'Design a system for monitoring and logging AI API usage in production. Include metrics to track, alerting strategies, and debugging approaches.', rubric: 'Grading: Metrics selection (25%), Monitoring architecture (25%), Alerting strategy (25%), Debugging workflows (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 8 QUESTIONS - Automation Workflows
  // (5 Short Answer + 5 Essay)
  // ==========================================
  db.questions.createMany([
    // Short Answer Questions
    { id: 'q-lv8-1', levelId: 'level-8', categoryId: 'cat-8', type: 'short-answer', content: 'What are the key components of an AI automation pipeline?', correctAnswer: 'Key components: Trigger/input mechanism, data preprocessing, AI model invocation, output parsing, decision logic, action execution, error handling, logging, and feedback loops for improvement.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-2', levelId: 'level-8', categoryId: 'cat-8', type: 'short-answer', content: 'Explain the concept of "human-in-the-loop" in AI automation.', correctAnswer: 'Human-in-the-loop involves human oversight at critical decision points in automated workflows. Used for quality assurance, handling edge cases, approval workflows, and training data generation while maintaining automation benefits.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-3', levelId: 'level-8', categoryId: 'cat-8', type: 'short-answer', content: 'What is an AI Agent and how does it differ from a simple chatbot?', correctAnswer: 'AI Agents can plan, use tools, take actions, and iterate toward goals autonomously. Unlike chatbots (single response), agents maintain state, make decisions, execute multi-step tasks, and interact with external systems.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-4', levelId: 'level-8', categoryId: 'cat-8', type: 'short-answer', content: 'Describe strategies for testing AI automation workflows.', correctAnswer: 'Testing strategies: Unit tests for components, mock AI responses, test with edge cases, validate output parsing, test error handling, use staging environments, monitor production behavior, and implement A/B testing.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-5', levelId: 'level-8', categoryId: 'cat-8', type: 'short-answer', content: 'What are the risks of fully automated AI systems without human oversight?', correctAnswer: 'Risks include: Cascading errors, hallucination propagation, security vulnerabilities, compliance violations, reputation damage, unintended actions, bias amplification, and inability to handle novel situations.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    // Essay Questions
    { id: 'q-lv8-6', levelId: 'level-8', categoryId: 'cat-8', type: 'essay', content: 'Design an AI-powered customer support automation system. Include ticket classification, response generation, escalation logic, and performance metrics.', rubric: 'Grading: System architecture (25%), AI components (25%), Escalation logic (25%), Success metrics (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-7', levelId: 'level-8', categoryId: 'cat-8', type: 'essay', content: 'Create an automation workflow for processing and analyzing customer feedback at scale. Include data collection, sentiment analysis, categorization, and actionable insights generation.', rubric: 'Grading: Data pipeline design (25%), AI analysis methods (25%), Insight generation (25%), Scalability (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-8', levelId: 'level-8', categoryId: 'cat-8', type: 'essay', content: 'Design an AI Agent system for automating research tasks. Include planning capabilities, tool usage, information synthesis, and quality assurance mechanisms.', rubric: 'Grading: Agent architecture (25%), Tool integration (25%), Output quality (25%), Safety measures (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-9', levelId: 'level-8', categoryId: 'cat-8', type: 'essay', content: 'Propose a system for automating document processing in a legal or financial context. Address accuracy requirements, compliance, audit trails, and error handling.', rubric: 'Grading: Process design (25%), Compliance handling (25%), Accuracy measures (25%), Audit capabilities (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv8-10', levelId: 'level-8', categoryId: 'cat-8', type: 'essay', content: 'Design a continuous improvement system for AI automation that learns from errors and user feedback. Include feedback collection, analysis, and prompt/system updates.', rubric: 'Grading: Feedback mechanisms (25%), Learning pipeline (25%), Update processes (25%), Performance tracking (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 9 QUESTIONS - AI in Business
  // (5 Short Answer + 5 Essay)
  // ==========================================
  db.questions.createMany([
    // Short Answer Questions
    { id: 'q-lv9-1', levelId: 'level-9', categoryId: 'cat-9', type: 'short-answer', content: 'What factors should businesses consider when calculating AI ROI?', correctAnswer: 'ROI factors: Time savings, quality improvements, cost reduction, revenue increase, employee satisfaction, customer experience, competitive advantage, risk reduction, and scalability benefits minus implementation and ongoing costs.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-2', levelId: 'level-9', categoryId: 'cat-9', type: 'short-answer', content: 'Describe the key challenges in AI adoption for enterprises.', correctAnswer: 'Challenges: Data quality/availability, integration with legacy systems, skills gap, change management, security concerns, regulatory compliance, budget constraints, vendor lock-in, and measuring success.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-3', levelId: 'level-9', categoryId: 'cat-9', type: 'short-answer', content: 'What is an AI Center of Excellence and why create one?', correctAnswer: 'AI CoE is a centralized team providing AI expertise, standards, and governance across an organization. Benefits: Consistent implementation, knowledge sharing, resource efficiency, risk management, and strategic alignment.', points: 15, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-4', levelId: 'level-9', categoryId: 'cat-9', type: 'short-answer', content: 'How should businesses approach AI vendor selection?', correctAnswer: 'Selection criteria: Capabilities vs requirements, pricing model, security/compliance certifications, integration options, support quality, vendor stability, data handling policies, scalability, and exit strategy options.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-5', levelId: 'level-9', categoryId: 'cat-9', type: 'short-answer', content: 'What are the key metrics for measuring AI project success in business?', correctAnswer: 'Metrics: Accuracy/quality scores, time saved, cost reduction, user adoption rate, customer satisfaction, error rates, throughput, revenue impact, and comparison to baseline/manual processes.', points: 15, difficulty: 'medium', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    // Essay Questions
    { id: 'q-lv9-6', levelId: 'level-9', categoryId: 'cat-9', type: 'essay', content: 'Develop a comprehensive AI adoption roadmap for a mid-sized company. Include assessment, pilot projects, scaling strategy, and organizational change management.', rubric: 'Grading: Assessment methodology (25%), Implementation phases (25%), Scaling approach (25%), Change management (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-7', levelId: 'level-9', categoryId: 'cat-9', type: 'essay', content: 'Create a business case for implementing AI in customer service operations. Include current state analysis, proposed solution, expected benefits, risks, and investment requirements.', rubric: 'Grading: Analysis depth (25%), Solution design (25%), Financial projections (25%), Risk assessment (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-8', levelId: 'level-9', categoryId: 'cat-9', type: 'essay', content: 'Design an AI training and upskilling program for non-technical employees. Include curriculum, delivery methods, success metrics, and ongoing support.', rubric: 'Grading: Curriculum design (25%), Delivery approach (25%), Engagement strategy (25%), Measurement plan (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-9', levelId: 'level-9', categoryId: 'cat-9', type: 'essay', content: 'Analyze how AI is transforming a specific industry (choose one: healthcare, finance, retail, or manufacturing). Discuss current applications, emerging trends, and future opportunities.', rubric: 'Grading: Industry knowledge (25%), Current state analysis (25%), Trend identification (25%), Future vision (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv9-10', levelId: 'level-9', categoryId: 'cat-9', type: 'essay', content: 'Develop a framework for evaluating when to build custom AI solutions versus using off-the-shelf products. Include decision criteria, cost considerations, and risk factors.', rubric: 'Grading: Framework completeness (25%), Decision criteria (25%), Cost analysis (25%), Risk assessment (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 10 QUESTIONS - AI Architecture
  // (10 Essay Questions)
  // ==========================================
  db.questions.createMany([
    { id: 'q-lv10-1', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Design a scalable architecture for an AI-powered recommendation system handling millions of users. Include data pipeline, model serving, caching strategy, and performance optimization.', rubric: 'Grading: Architecture design (25%), Scalability approach (25%), Performance optimization (25%), Technical depth (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-2', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Create a comprehensive data architecture for training and deploying custom AI models. Address data collection, storage, preprocessing, versioning, and governance.', rubric: 'Grading: Data pipeline design (25%), Storage strategy (25%), Governance framework (25%), Implementation feasibility (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-3', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Design a multi-model AI system that orchestrates different specialized models (language, vision, code) to solve complex tasks. Include routing logic, integration patterns, and failure handling.', rubric: 'Grading: Orchestration design (25%), Model integration (25%), Routing logic (25%), Reliability measures (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-4', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Architect a real-time AI processing system for streaming data (e.g., fraud detection, content moderation). Address latency requirements, scalability, and accuracy trade-offs.', rubric: 'Grading: Real-time architecture (25%), Latency optimization (25%), Scalability design (25%), Trade-off analysis (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-5', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Design a secure AI infrastructure for handling sensitive data (healthcare, financial). Include encryption, access controls, audit logging, and compliance mechanisms.', rubric: 'Grading: Security architecture (25%), Compliance design (25%), Access control (25%), Audit capabilities (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-6', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Create a MLOps architecture for continuous training, deployment, and monitoring of AI models. Include CI/CD pipelines, model registry, A/B testing, and rollback mechanisms.', rubric: 'Grading: MLOps completeness (25%), Pipeline design (25%), Monitoring strategy (25%), Deployment safety (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-7', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Design an AI system architecture that supports both cloud and edge deployment. Address model optimization, synchronization, and offline capabilities.', rubric: 'Grading: Hybrid architecture (25%), Edge optimization (25%), Sync mechanisms (25%), Offline support (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-8', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Architect a conversational AI platform that supports multiple channels (web, mobile, voice), maintains conversation state, and provides analytics.', rubric: 'Grading: Multi-channel design (25%), State management (25%), Analytics integration (25%), User experience (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-9', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Design a cost-efficient AI architecture that dynamically scales based on demand and optimizes for both performance and cost. Include resource allocation strategies.', rubric: 'Grading: Cost optimization (25%), Auto-scaling design (25%), Performance balance (25%), Resource efficiency (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv10-10', levelId: 'level-10', categoryId: 'cat-10', type: 'essay', content: 'Create an architecture for AI model evaluation and benchmarking at scale. Include test data management, automated evaluation pipelines, and result visualization.', rubric: 'Grading: Evaluation framework (25%), Automation design (25%), Metrics selection (25%), Reporting capabilities (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 11 QUESTIONS - Enterprise Deployment
  // (10 Essay Questions)
  // ==========================================
  db.questions.createMany([
    { id: 'q-lv11-1', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Develop a comprehensive enterprise AI deployment strategy including infrastructure selection, security requirements, compliance considerations, and rollout phases.', rubric: 'Grading: Strategy completeness (25%), Security depth (25%), Compliance coverage (25%), Rollout planning (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-2', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Create a change management plan for introducing AI tools across a large organization. Address resistance, training needs, communication strategy, and success measurement.', rubric: 'Grading: Change strategy (25%), Training plan (25%), Communication approach (25%), Success metrics (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-3', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Design an AI governance framework for a multinational corporation. Include policy development, risk management, ethical guidelines, and compliance monitoring.', rubric: 'Grading: Governance structure (25%), Policy framework (25%), Risk management (25%), Monitoring systems (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-4', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Develop a vendor management strategy for enterprise AI, including evaluation criteria, contract considerations, SLA requirements, and exit strategies.', rubric: 'Grading: Evaluation framework (25%), Contract elements (25%), SLA design (25%), Exit planning (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-5', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Create a disaster recovery and business continuity plan for AI-dependent systems. Address failover mechanisms, data backup, and service restoration.', rubric: 'Grading: DR planning (25%), Failover design (25%), Data protection (25%), Recovery procedures (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-6', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Design an enterprise-wide AI monitoring and observability system. Include performance metrics, cost tracking, usage analytics, and alerting mechanisms.', rubric: 'Grading: Monitoring scope (25%), Metrics design (25%), Analytics capabilities (25%), Alerting strategy (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-7', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Develop a data privacy and security strategy for AI systems processing personal data under GDPR, CCPA, and other regulations.', rubric: 'Grading: Privacy design (25%), Regulatory compliance (25%), Security measures (25%), Documentation (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-8', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Create an integration strategy for connecting AI systems with existing enterprise applications (ERP, CRM, HCM). Address data flow, authentication, and maintenance.', rubric: 'Grading: Integration architecture (25%), Data management (25%), Security integration (25%), Maintainability (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-9', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Develop a capacity planning framework for enterprise AI workloads. Include demand forecasting, resource allocation, and budget optimization.', rubric: 'Grading: Forecasting approach (25%), Resource planning (25%), Budget optimization (25%), Scalability (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv11-10', levelId: 'level-11', categoryId: 'cat-11', type: 'essay', content: 'Design an enterprise AI platform that enables self-service for business users while maintaining IT governance and security controls.', rubric: 'Grading: Platform design (25%), Self-service capabilities (25%), Governance controls (25%), Security balance (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // LEVEL 12 QUESTIONS - AI Leadership & Ethics
  // (10 Essay Questions)
  // ==========================================
  db.questions.createMany([
    { id: 'q-lv12-1', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Develop a comprehensive AI ethics framework for an organization. Include principles, decision-making processes, oversight mechanisms, and accountability structures.', rubric: 'Grading: Ethical principles (25%), Process design (25%), Oversight mechanisms (25%), Accountability (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-2', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Create a strategy for addressing AI bias and fairness in enterprise applications. Include detection methods, mitigation strategies, and ongoing monitoring.', rubric: 'Grading: Bias detection (25%), Mitigation approaches (25%), Monitoring systems (25%), Continuous improvement (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-3', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Design an AI transparency and explainability strategy. Address requirements for different stakeholders (users, regulators, internal teams) and implementation approaches.', rubric: 'Grading: Stakeholder analysis (25%), Explainability methods (25%), Implementation plan (25%), Communication strategy (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-4', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Develop a responsible AI innovation strategy that balances competitive advantage with ethical considerations and societal impact.', rubric: 'Grading: Innovation approach (25%), Ethical integration (25%), Societal consideration (25%), Competitive analysis (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-5', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Create an AI workforce impact assessment and mitigation plan. Address job displacement concerns, reskilling programs, and new role creation.', rubric: 'Grading: Impact assessment (25%), Mitigation strategies (25%), Reskilling programs (25%), Future planning (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-6', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Design an AI risk management framework covering technical, operational, reputational, and regulatory risks. Include assessment, monitoring, and response procedures.', rubric: 'Grading: Risk identification (25%), Assessment methods (25%), Monitoring approach (25%), Response procedures (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-7', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Develop a vision for AI-enabled organizational transformation over the next 5 years. Include strategic priorities, capability building, and competitive positioning.', rubric: 'Grading: Vision clarity (25%), Strategic priorities (25%), Capability roadmap (25%), Competitive analysis (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-8', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Create a framework for evaluating and responding to emerging AI regulations globally. Include monitoring approaches, compliance strategies, and policy engagement.', rubric: 'Grading: Regulatory monitoring (25%), Compliance framework (25%), Policy engagement (25%), Global coverage (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-9', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Design an AI innovation ecosystem strategy including partnerships, research collaborations, startup engagement, and open source participation.', rubric: 'Grading: Ecosystem design (25%), Partnership strategy (25%), Innovation mechanisms (25%), Value creation (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
    { id: 'q-lv12-10', levelId: 'level-12', categoryId: 'cat-12', type: 'essay', content: 'Write a white paper on "The Future of Human-AI Collaboration" addressing augmentation vs. automation, skill evolution, and organizational design implications.', rubric: 'Grading: Conceptual depth (25%), Practical implications (25%), Future vision (25%), Actionable insights (25%)', points: 25, difficulty: 'hard', isRandomized: false, isActive: true, createdAt: now, updatedAt: now },
  ]);

  // ==========================================
  // QUESTION OPTIONS (for multiple choice and true/false)
  // ==========================================

  // Level 1 Options
  db.questionOptions.createMany([
    // True/False options for Level 1
    { id: 'opt-lv1-1-a', questionId: 'q-lv1-1', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-1-b', questionId: 'q-lv1-1', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-2-a', questionId: 'q-lv1-2', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-2-b', questionId: 'q-lv1-2', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-3-a', questionId: 'q-lv1-3', optionKey: 'True', optionText: 'True', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv1-3-b', questionId: 'q-lv1-3', optionKey: 'False', optionText: 'False', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv1-4-a', questionId: 'q-lv1-4', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-4-b', questionId: 'q-lv1-4', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-5-a', questionId: 'q-lv1-5', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-5-b', questionId: 'q-lv1-5', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    // Multiple Choice options for Level 1
    { id: 'opt-lv1-6-a', questionId: 'q-lv1-6', optionKey: 'A', optionText: 'Narrow AI', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv1-6-b', questionId: 'q-lv1-6', optionKey: 'B', optionText: 'General AI', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-6-c', questionId: 'q-lv1-6', optionKey: 'C', optionText: 'Mechanical Intelligence', isCorrect: true, sortOrder: 3 },
    { id: 'opt-lv1-6-d', questionId: 'q-lv1-6', optionKey: 'D', optionText: 'Superintelligent AI', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv1-7-a', questionId: 'q-lv1-7', optionKey: 'A', optionText: 'Large Language Model', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-7-b', questionId: 'q-lv1-7', optionKey: 'B', optionText: 'Linear Learning Machine', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-7-c', questionId: 'q-lv1-7', optionKey: 'C', optionText: 'Logic Language Module', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv1-7-d', questionId: 'q-lv1-7', optionKey: 'D', optionText: 'Local Learning Method', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv1-8-a', questionId: 'q-lv1-8', optionKey: 'A', optionText: 'OpenAI', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-8-b', questionId: 'q-lv1-8', optionKey: 'B', optionText: 'Google', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-8-c', questionId: 'q-lv1-8', optionKey: 'C', optionText: 'Microsoft', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv1-8-d', questionId: 'q-lv1-8', optionKey: 'D', optionText: 'Meta', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv1-9-a', questionId: 'q-lv1-9', optionKey: 'A', optionText: 'When AI generates false or inaccurate information', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-9-b', questionId: 'q-lv1-9', optionKey: 'B', optionText: 'When AI creates visual effects', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-9-c', questionId: 'q-lv1-9', optionKey: 'C', optionText: 'When AI processes images', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv1-9-d', questionId: 'q-lv1-9', optionKey: 'D', optionText: 'When AI runs out of memory', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv1-10-a', questionId: 'q-lv1-10', optionKey: 'A', optionText: 'AI that creates new content like text, images, or code', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv1-10-b', questionId: 'q-lv1-10', optionKey: 'B', optionText: 'AI that only analyzes existing data', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv1-10-c', questionId: 'q-lv1-10', optionKey: 'C', optionText: 'AI that controls robots', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv1-10-d', questionId: 'q-lv1-10', optionKey: 'D', optionText: 'AI that generates electricity', isCorrect: false, sortOrder: 4 },
  ]);

  // Level 2 Options
  db.questionOptions.createMany([
    // True/False options for Level 2
    { id: 'opt-lv2-1-a', questionId: 'q-lv2-1', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv2-1-b', questionId: 'q-lv2-1', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv2-2-a', questionId: 'q-lv2-2', optionKey: 'True', optionText: 'True', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv2-2-b', questionId: 'q-lv2-2', optionKey: 'False', optionText: 'False', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv2-3-a', questionId: 'q-lv2-3', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv2-3-b', questionId: 'q-lv2-3', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv2-4-a', questionId: 'q-lv2-4', optionKey: 'True', optionText: 'True', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv2-4-b', questionId: 'q-lv2-4', optionKey: 'False', optionText: 'False', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv2-5-a', questionId: 'q-lv2-5', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv2-5-b', questionId: 'q-lv2-5', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    // Multiple Choice options for Level 2
    { id: 'opt-lv2-6-a', questionId: 'q-lv2-6', optionKey: 'A', optionText: 'ChatGPT', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv2-6-b', questionId: 'q-lv2-6', optionKey: 'B', optionText: 'Claude', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv2-6-c', questionId: 'q-lv2-6', optionKey: 'C', optionText: 'Photoshop', isCorrect: true, sortOrder: 3 },
    { id: 'opt-lv2-6-d', questionId: 'q-lv2-6', optionKey: 'D', optionText: 'Gemini', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv2-7-a', questionId: 'q-lv2-7', optionKey: 'A', optionText: 'Generate human-like text responses', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv2-7-b', questionId: 'q-lv2-7', optionKey: 'B', optionText: 'Create video content', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv2-7-c', questionId: 'q-lv2-7', optionKey: 'C', optionText: 'Edit photographs', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv2-7-d', questionId: 'q-lv2-7', optionKey: 'D', optionText: 'Compose music', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv2-8-a', questionId: 'q-lv2-8', optionKey: 'A', optionText: 'ChatGPT', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv2-8-b', questionId: 'q-lv2-8', optionKey: 'B', optionText: 'DALL-E', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv2-8-c', questionId: 'q-lv2-8', optionKey: 'C', optionText: 'Claude', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv2-8-d', questionId: 'q-lv2-8', optionKey: 'D', optionText: 'Grammarly', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv2-9-a', questionId: 'q-lv2-9', optionKey: 'A', optionText: 'A unit of text that the model processes', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv2-9-b', questionId: 'q-lv2-9', optionKey: 'B', optionText: 'A security credential', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv2-9-c', questionId: 'q-lv2-9', optionKey: 'C', optionText: 'A type of neural network', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv2-9-d', questionId: 'q-lv2-9', optionKey: 'D', optionText: 'A payment method', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv2-10-a', questionId: 'q-lv2-10', optionKey: 'A', optionText: 'Google', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv2-10-b', questionId: 'q-lv2-10', optionKey: 'B', optionText: 'OpenAI', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv2-10-c', questionId: 'q-lv2-10', optionKey: 'C', optionText: 'Anthropic', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv2-10-d', questionId: 'q-lv2-10', optionKey: 'D', optionText: 'Meta', isCorrect: false, sortOrder: 4 },
  ]);

  // Level 3 Options
  db.questionOptions.createMany([
    // True/False options for Level 3
    { id: 'opt-lv3-1-a', questionId: 'q-lv3-1', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv3-1-b', questionId: 'q-lv3-1', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv3-2-a', questionId: 'q-lv3-2', optionKey: 'True', optionText: 'True', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv3-2-b', questionId: 'q-lv3-2', optionKey: 'False', optionText: 'False', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv3-3-a', questionId: 'q-lv3-3', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv3-3-b', questionId: 'q-lv3-3', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv3-4-a', questionId: 'q-lv3-4', optionKey: 'True', optionText: 'True', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv3-4-b', questionId: 'q-lv3-4', optionKey: 'False', optionText: 'False', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv3-5-a', questionId: 'q-lv3-5', optionKey: 'True', optionText: 'True', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv3-5-b', questionId: 'q-lv3-5', optionKey: 'False', optionText: 'False', isCorrect: false, sortOrder: 2 },
    // Multiple Choice options for Level 3
    { id: 'opt-lv3-6-a', questionId: 'q-lv3-6', optionKey: 'A', optionText: 'To optimize AI responses through better input design', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv3-6-b', questionId: 'q-lv3-6', optionKey: 'B', optionText: 'To build AI hardware', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv3-6-c', questionId: 'q-lv3-6', optionKey: 'C', optionText: 'To train AI models', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv3-6-d', questionId: 'q-lv3-6', optionKey: 'D', optionText: 'To manage AI costs', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv3-7-a', questionId: 'q-lv3-7', optionKey: 'A', optionText: 'Using many keywords', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv3-7-b', questionId: 'q-lv3-7', optionKey: 'B', optionText: 'Specific instructions about the desired output', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv3-7-c', questionId: 'q-lv3-7', optionKey: 'C', optionText: 'Making the prompt as long as possible', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv3-7-d', questionId: 'q-lv3-7', optionKey: 'D', optionText: 'Using technical jargon', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv3-8-a', questionId: 'q-lv3-8', optionKey: 'A', optionText: 'Asking AI to perform a task without providing examples', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv3-8-b', questionId: 'q-lv3-8', optionKey: 'B', optionText: 'Giving one example before the task', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv3-8-c', questionId: 'q-lv3-8', optionKey: 'C', optionText: 'Providing many examples', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv3-8-d', questionId: 'q-lv3-8', optionKey: 'D', optionText: 'Shooting without aiming', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv3-9-a', questionId: 'q-lv3-9', optionKey: 'A', optionText: 'Be vague to give AI freedom', isCorrect: false, sortOrder: 1 },
    { id: 'opt-lv3-9-b', questionId: 'q-lv3-9', optionKey: 'B', optionText: 'Be specific about the format you want', isCorrect: true, sortOrder: 2 },
    { id: 'opt-lv3-9-c', questionId: 'q-lv3-9', optionKey: 'C', optionText: 'Use only single-word prompts', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv3-9-d', questionId: 'q-lv3-9', optionKey: 'D', optionText: 'Always write in uppercase', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv3-10-a', questionId: 'q-lv3-10', optionKey: 'A', optionText: 'Providing a few examples to guide the AI response', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv3-10-b', questionId: 'q-lv3-10', optionKey: 'B', optionText: 'Shooting a few times at a target', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv3-10-c', questionId: 'q-lv3-10', optionKey: 'C', optionText: 'Asking multiple questions at once', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv3-10-d', questionId: 'q-lv3-10', optionKey: 'D', optionText: 'Using a few words only', isCorrect: false, sortOrder: 4 },
  ]);

  // Level 4 Options (Multiple Choice only - Short Answer doesn't need options)
  db.questionOptions.createMany([
    { id: 'opt-lv4-1-a', questionId: 'q-lv4-1', optionKey: 'A', optionText: 'Asking AI to explain its reasoning step by step', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv4-1-b', questionId: 'q-lv4-1', optionKey: 'B', optionText: 'Connecting multiple AI models together', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv4-1-c', questionId: 'q-lv4-1', optionKey: 'C', optionText: 'Training AI on chain-related data', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv4-1-d', questionId: 'q-lv4-1', optionKey: 'D', optionText: 'Using blockchain for AI', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv4-2-a', questionId: 'q-lv4-2', optionKey: 'A', optionText: 'The randomness/creativity of responses', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv4-2-b', questionId: 'q-lv4-2', optionKey: 'B', optionText: 'The speed of processing', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv4-2-c', questionId: 'q-lv4-2', optionKey: 'C', optionText: 'The model size', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv4-2-d', questionId: 'q-lv4-2', optionKey: 'D', optionText: 'The cost per token', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv4-3-a', questionId: 'q-lv4-3', optionKey: 'A', optionText: 'To clearly separate different sections of content', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv4-3-b', questionId: 'q-lv4-3', optionKey: 'B', optionText: 'To make prompts look prettier', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv4-3-c', questionId: 'q-lv4-3', optionKey: 'C', optionText: 'To reduce token count', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv4-3-d', questionId: 'q-lv4-3', optionKey: 'D', optionText: 'To speed up processing', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv4-4-a', questionId: 'q-lv4-4', optionKey: 'A', optionText: 'Malicious input attempting to manipulate AI behavior', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv4-4-b', questionId: 'q-lv4-4', optionKey: 'B', optionText: 'Injecting new training data', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv4-4-c', questionId: 'q-lv4-4', optionKey: 'C', optionText: 'Adding prompts to a queue', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv4-4-d', questionId: 'q-lv4-4', optionKey: 'D', optionText: 'Medical injection by AI robots', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv4-5-a', questionId: 'q-lv4-5', optionKey: 'A', optionText: 'AI gives more deterministic, consistent responses', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv4-5-b', questionId: 'q-lv4-5', optionKey: 'B', optionText: 'AI becomes very creative', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv4-5-c', questionId: 'q-lv4-5', optionKey: 'C', optionText: 'AI stops responding', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv4-5-d', questionId: 'q-lv4-5', optionKey: 'D', optionText: 'AI responses become random', isCorrect: false, sortOrder: 4 },
  ]);

  // Level 5 Options
  db.questionOptions.createMany([
    { id: 'opt-lv5-1-a', questionId: 'q-lv5-1', optionKey: 'A', optionText: 'Allowing AI to invoke external tools or functions', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv5-1-b', questionId: 'q-lv5-1', optionKey: 'B', optionText: 'Making phone calls through AI', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv5-1-c', questionId: 'q-lv5-1', optionKey: 'C', optionText: 'Calling the AI support team', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv5-1-d', questionId: 'q-lv5-1', optionKey: 'D', optionText: 'Programming function names', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv5-2-a', questionId: 'q-lv5-2', optionKey: 'A', optionText: 'Combining AI with external knowledge retrieval', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv5-2-b', questionId: 'q-lv5-2', optionKey: 'B', optionText: 'A type of file format', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv5-2-c', questionId: 'q-lv5-2', optionKey: 'C', optionText: 'Random AI Generation', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv5-2-d', questionId: 'q-lv5-2', optionKey: 'D', optionText: 'A cleaning product', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv5-3-a', questionId: 'q-lv5-3', optionKey: 'A', optionText: 'Converting text to numerical vectors for similarity search', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv5-3-b', questionId: 'q-lv5-3', optionKey: 'B', optionText: 'Embedding videos in websites', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv5-3-c', questionId: 'q-lv5-3', optionKey: 'C', optionText: 'Adding AI to hardware', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv5-3-d', questionId: 'q-lv5-3', optionKey: 'D', optionText: 'Creating embedded systems', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv5-4-a', questionId: 'q-lv5-4', optionKey: 'A', optionText: 'Zapier or Make (Integromat)', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv5-4-b', questionId: 'q-lv5-4', optionKey: 'B', optionText: 'Photoshop', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv5-4-c', questionId: 'q-lv5-4', optionKey: 'C', optionText: 'Microsoft Word', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv5-4-d', questionId: 'q-lv5-4', optionKey: 'D', optionText: 'Notepad', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv5-5-a', questionId: 'q-lv5-5', optionKey: 'A', optionText: 'Storing and searching embeddings efficiently', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv5-5-b', questionId: 'q-lv5-5', optionKey: 'B', optionText: 'Storing mathematical vectors for physics', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv5-5-c', questionId: 'q-lv5-5', optionKey: 'C', optionText: 'Creating vector graphics', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv5-5-d', questionId: 'q-lv5-5', optionKey: 'D', optionText: 'Managing database backups', isCorrect: false, sortOrder: 4 },
  ]);

  // Level 6 Options
  db.questionOptions.createMany([
    { id: 'opt-lv6-1-a', questionId: 'q-lv6-1', optionKey: 'A', optionText: 'Creating a detailed style guide prompt', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv6-1-b', questionId: 'q-lv6-1', optionKey: 'B', optionText: 'Using random prompts each time', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv6-1-c', questionId: 'q-lv6-1', optionKey: 'C', optionText: 'Copying competitor content', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv6-1-d', questionId: 'q-lv6-1', optionKey: 'D', optionText: 'Using only one-word prompts', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv6-2-a', questionId: 'q-lv6-2', optionKey: 'A', optionText: 'Outline first, then expand section by section', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv6-2-b', questionId: 'q-lv6-2', optionKey: 'B', optionText: 'Ask AI to write everything at once', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv6-2-c', questionId: 'q-lv6-2', optionKey: 'C', optionText: 'Copy from multiple AI outputs', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv6-2-d', questionId: 'q-lv6-2', optionKey: 'D', optionText: 'Use only bullet points', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv6-3-a', questionId: 'q-lv6-3', optionKey: 'A', optionText: 'Human review and fact-checking', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv6-3-b', questionId: 'q-lv6-3', optionKey: 'B', optionText: 'Keyword stuffing', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv6-3-c', questionId: 'q-lv6-3', optionKey: 'C', optionText: 'Publishing immediately without review', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv6-3-d', questionId: 'q-lv6-3', optionKey: 'D', optionText: 'Using maximum word count', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv6-4-a', questionId: 'q-lv6-4', optionKey: 'A', optionText: 'Identifying text generated by AI systems', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv6-4-b', questionId: 'q-lv6-4', optionKey: 'B', optionText: 'Detecting plagiarism from humans', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv6-4-c', questionId: 'q-lv6-4', optionKey: 'C', optionText: 'Finding grammar errors', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv6-4-d', questionId: 'q-lv6-4', optionKey: 'D', optionText: 'Improving writing style', isCorrect: false, sortOrder: 4 },
    { id: 'opt-lv6-5-a', questionId: 'q-lv6-5', optionKey: 'A', optionText: 'Iterative refinement with specific feedback', isCorrect: true, sortOrder: 1 },
    { id: 'opt-lv6-5-b', questionId: 'q-lv6-5', optionKey: 'B', optionText: 'Using the first output without changes', isCorrect: false, sortOrder: 2 },
    { id: 'opt-lv6-5-c', questionId: 'q-lv6-5', optionKey: 'C', optionText: 'Always using maximum temperature', isCorrect: false, sortOrder: 3 },
    { id: 'opt-lv6-5-d', questionId: 'q-lv6-5', optionKey: 'D', optionText: 'Combining random AI outputs', isCorrect: false, sortOrder: 4 },
  ]);

  // ==========================================
  // QUESTION STATS (for analytics)
  // ==========================================
  db.questionStats.createMany([
    { questionId: 'q-lv1-1', timesAsked: 1500, timesCorrect: 1350, correctRate: 0.9, averageTimeSeconds: 15, lastUpdatedAt: now },
    { questionId: 'q-lv1-2', timesAsked: 1500, timesCorrect: 1410, correctRate: 0.94, averageTimeSeconds: 12, lastUpdatedAt: now },
    { questionId: 'q-lv1-3', timesAsked: 1500, timesCorrect: 1275, correctRate: 0.85, averageTimeSeconds: 18, lastUpdatedAt: now },
    { questionId: 'q-lv1-6', timesAsked: 1500, timesCorrect: 1125, correctRate: 0.75, averageTimeSeconds: 25, lastUpdatedAt: now },
    { questionId: 'q-lv1-9', timesAsked: 1500, timesCorrect: 900, correctRate: 0.6, averageTimeSeconds: 30, lastUpdatedAt: now },
  ]);

  // ==========================================
  // USER TEST PROGRESS
  // ==========================================
  const progressRecords: UserTestProgressRecord[] = [
    {
      id: 'utp-guest',
      userId: 'guest',
      currentLevel: 1,
      highestPassedLevel: 0,
      totalAttempts: 0,
      totalPassed: 0,
      totalFailed: 0,
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
      totalFailed: 0,
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
      totalFailed: 2,
      averageScore: 68,
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
      totalFailed: 5,
      averageScore: 72,
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
      totalFailed: 6,
      averageScore: 75,
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
      totalFailed: 9,
      averageScore: 78,
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
      totalFailed: 16,
      averageScore: 82,
      lastAttemptAt: new Date('2026-01-21'),
      createdAt: now,
      updatedAt: now,
    },
  ];

  db.userTestProgress.createMany(progressRecords);

  // ==========================================
  // USER LEVEL STATS (sample data)
  // ==========================================
  db.userLevelStats.createMany([
    { id: 'uls-1-1', userId: 'user-1', levelId: 'level-1', totalAttempts: 2, passCount: 1, bestScore: 85, bestPercentage: 85, averageScore: 75, averageTimeSeconds: 240, fastestTimeSeconds: 200, isUnlocked: true, isPassed: true, firstPassedAt: new Date('2026-01-10'), lastAttemptAt: new Date('2026-01-10'), createdAt: now, updatedAt: now },
    { id: 'uls-1-2', userId: 'user-1', levelId: 'level-2', totalAttempts: 3, passCount: 1, bestScore: 78, bestPercentage: 78, averageScore: 68, averageTimeSeconds: 270, fastestTimeSeconds: 230, isUnlocked: true, isPassed: true, firstPassedAt: new Date('2026-01-12'), lastAttemptAt: new Date('2026-01-12'), createdAt: now, updatedAt: now },
    { id: 'uls-1-3', userId: 'user-1', levelId: 'level-3', totalAttempts: 3, passCount: 1, bestScore: 72, bestPercentage: 72, averageScore: 62, averageTimeSeconds: 280, fastestTimeSeconds: 250, isUnlocked: true, isPassed: true, firstPassedAt: new Date('2026-01-15'), lastAttemptAt: new Date('2026-01-15'), createdAt: now, updatedAt: now },
    { id: 'uls-1-4', userId: 'user-1', levelId: 'level-4', totalAttempts: 0, passCount: 0, bestScore: 0, bestPercentage: 0, averageScore: 0, averageTimeSeconds: 0, isUnlocked: true, isPassed: false, createdAt: now, updatedAt: now },
    { id: 'uls-2-6', userId: 'user-2', levelId: 'level-6', totalAttempts: 4, passCount: 1, bestScore: 68, bestPercentage: 68, averageScore: 60, averageTimeSeconds: 840, fastestTimeSeconds: 750, isUnlocked: true, isPassed: true, firstPassedAt: new Date('2026-01-18'), lastAttemptAt: new Date('2026-01-18'), createdAt: now, updatedAt: now },
    { id: 'uls-2-7', userId: 'user-2', levelId: 'level-7', totalAttempts: 0, passCount: 0, bestScore: 0, bestPercentage: 0, averageScore: 0, averageTimeSeconds: 0, isUnlocked: true, isPassed: false, createdAt: now, updatedAt: now },
  ]);
}
