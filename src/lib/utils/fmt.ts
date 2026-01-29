export function formatSeasonDateRange(start: Date, end: Date): string {
    // Simple formatter to avoid DB import
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
}
