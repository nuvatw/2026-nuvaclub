export interface ContentProvider {
    getContent<T>(key: string): Promise<T | null>;
}
