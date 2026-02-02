import { ContentProvider } from '../types';
import { Locale } from '../i18n';

export class LocalContentProvider implements ContentProvider {
    async getContent<T>(key: string, locale: Locale): Promise<T | null> {
        // In a real implementation, this would load from a local JSON or TS file 
        // structured by locale. For now, we return a mock or null.
        // Example: import(`./data/${locale}/${key}.json`)

        // Mock implementation for demonstration
        if (key === 'course.basic-react') {
            const data = {
                'zh-TW': { title: 'React 基礎', description: '學習 React 的核心概念' },
                'en': { title: 'React Basics', description: 'Learn core concepts of React' },
            };
            return (data as any)[locale] || (data as any)['zh-TW'];
        }

        return null;
    }
}

export const localContentProvider = new LocalContentProvider();
