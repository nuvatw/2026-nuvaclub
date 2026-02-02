import { ContentProvider } from '../types';
import { Locale } from '../i18n';

/**
 * Strapi Content Provider (Stub)
 * Future implementation will use Strapi GraphQL or REST API
 */
export class StrapiContentProvider implements ContentProvider {
    private apiUrl: string;
    private apiToken: string;

    constructor() {
        this.apiUrl = process.env.STRAPI_URL || 'http://localhost:1337';
        this.apiToken = process.env.STRAPI_TOKEN || '';
    }

    async getContent<T>(key: string, locale: Locale): Promise<T | null> {
        // TODO: Implement Strapi fetch logic
        // Example: 
        // const res = await fetch(`${this.apiUrl}/api/${key}?locale=${locale}`, {
        //     headers: { Authorization: `Bearer ${this.apiToken}` }
        // });
        // return res.json();

        console.warn(`StrapiContentProvider.getContent called for ${key} (${locale}), but not implemented. Falling back.`);
        return null;
    }
}

export const strapiContentProvider = new StrapiContentProvider();
