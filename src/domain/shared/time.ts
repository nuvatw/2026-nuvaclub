export const now = (): Date => new Date();

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const isAfter = (date: Date, toCompare: Date): boolean => {
    return date.getTime() > toCompare.getTime();
};

export const isBefore = (date: Date, toCompare: Date): boolean => {
    return date.getTime() < toCompare.getTime();
};

export const isExpired = (expirationDate: Date | null): boolean => {
    if (!expirationDate) return false;
    return isBefore(expirationDate, now());
};
