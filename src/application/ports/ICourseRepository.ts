import { Course } from '@/domain/types/learn';
import { IBaseRepository } from './IBaseRepository';

export interface ICourseRepository extends IBaseRepository<Course> {
    findBySlug(slug: string): Course | undefined;
    findFeatured(): Course[];
    findFree(): Course[];
    findByCategory(categoryId: string): Course[];
}
