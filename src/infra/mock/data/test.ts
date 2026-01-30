import { MockDB } from '@/infra/mock/core/MockDB';
import type { QuestionRecord } from '@/features/test/hooks/useTests';

/**
 * Get all questions for a specific level
 * @param level The level number
 * @returns Array of questions with options
 */
export function getQuestionsForLevel(level: number): any[] {
    const db = MockDB.getInstance();
    const testLevel = db.testLevels.findFirst({ where: { level } });
    if (!testLevel) return [];

    const questions = db.questions.findMany({ where: { levelId: testLevel.id } });
    return questions.map(q => {
        const options = db.questionOptions.findMany({ where: { questionId: q.id } });
        return {
            ...q,
            options: options.map(opt => opt.optionText)
        };
    });
}

/**
 * Get a specific question by ID
 */
export function getQuestionById(id: string) {
    const db = MockDB.getInstance();
    const question = db.questions.findById(id);
    if (!question) return null;

    const options = db.questionOptions.findMany({ where: { questionId: question.id } });
    return {
        ...question,
        options: options.map(opt => opt.optionText)
    };
}

/**
 * Get all test levels
 */
export function getAllTestLevels() {
    return MockDB.getInstance().testLevels.findAll();
}

/**
 * Get level details by level number
 */
export function getTestLevelByNumber(level: number) {
    return MockDB.getInstance().testLevels.findFirst({ where: { level } });
}
