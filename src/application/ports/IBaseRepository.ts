import { BaseEntity, QueryOptions, PaginatedResult } from './types';

/**
 * Interface representing a generic repository.
 * This port allows application services to perform data operations
 * without knowledge of the underlying persistence mechanism.
 */
export interface IBaseRepository<T extends BaseEntity> {
    findById(id: string): T | undefined;
    findAll(): T[];
    findMany(options?: QueryOptions<T>): T[];
    findFirst(options?: QueryOptions<T>): T | undefined;
    findPaginated(page: number, pageSize: number, options?: Omit<QueryOptions<T>, 'limit' | 'offset'>): PaginatedResult<T>;
    count(where?: QueryOptions<T>['where']): number;
    exists(id: string): boolean;
    create(data: Omit<T, 'id'> & { id?: string }): T;
    createMany(data: Array<Omit<T, 'id'> & { id?: string }>): T[];
    update(id: string, data: Partial<T>): T | undefined;
    updateMany(where: QueryOptions<T>['where'], data: Partial<T>): number;
    delete(id: string): boolean;
    deleteMany(where: QueryOptions<T>['where']): number;
    upsert(id: string, data: Omit<T, 'id'>): T;
}
