
import { ContentProvider } from './types';
import { localContentProvider } from './providers/LocalContentProvider';
import { strapiContentProvider } from './providers/StrapiContentProvider';

export class ContentFactory {
    static getProvider(): ContentProvider {
        const useCms = process.env.USE_CMS === 'true';
        if (useCms) {
            console.log('[ContentFactory] Using StrapiContentProvider');
            return strapiContentProvider;
        }
        return localContentProvider;
    }
}

export const contentProvider = ContentFactory.getProvider();
