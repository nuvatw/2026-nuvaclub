import { Locale } from './i18n';

export interface ContentProvider {
    getContent<T>(key: string, locale: Locale): Promise<T | null>;
}
