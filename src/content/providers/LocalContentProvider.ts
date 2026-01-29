import { ContentProvider } from '../types';

export class LocalContentProvider implements ContentProvider {
    async getContent<T>(key: string): Promise<T | null> {
        // TODO: Load from local files or map
        return null;
    }
}

export const localContentProvider = new LocalContentProvider();
