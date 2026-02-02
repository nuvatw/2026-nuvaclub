export class MemberNoGenerator {
    /**
     * Generates a unique member number.
     * Format: NC-2026-XXXX (where XXXX is a unique suffix)
     */
    static generate(): string {
        const year = new Date().getFullYear();
        // Use a short unique suffix
        const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `NC-${year}-${suffix}`;
    }
}
