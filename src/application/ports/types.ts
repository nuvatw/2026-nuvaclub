// Generic repository types for the application ports

export interface BaseEntity {
    id: string;
}

export interface Timestamps {
    createdAt: Date;
    updatedAt?: Date;
}

export type WhereClause<T> = Partial<T> | ((item: T) => boolean);

export interface QueryOptions<T> {
    where?: WhereClause<T>;
    orderBy?: keyof T | { field: keyof T; direction: 'asc' | 'desc' };
    limit?: number;
    offset?: number;
}

export interface PaginatedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
