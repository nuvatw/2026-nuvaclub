import { ContentProvider } from '../types';
import { Locale } from '../i18n';
import { localContentProvider } from '../providers/LocalContentProvider';

export class ContentService {
    constructor(private provider: ContentProvider) { }

    async getContent<T>(key: string, locale: Locale): Promise<T | null> {
        return this.provider.getContent<T>(key, locale);
    }
}

// Factory to get ContentService (expandable for Strapi)
export function getContentService(): ContentService {
    const providerType = process.env.CONTENT_PROVIDER || 'local';

    if (providerType === 'strapi') {
        // return new ContentService(new StrapiContentProvider());
        return new ContentService(localContentProvider); // Stub
    }

    return new ContentService(localContentProvider);
}

export const contentService = getContentService();
