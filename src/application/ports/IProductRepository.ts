import { Product } from '@/domain/types/shop';
import { IBaseRepository } from './IBaseRepository';

export interface PlanDetails {
    features?: string[];
    planType: string;
    billingCycle: string;
}

export interface EventDetails {
    agenda?: any[];
    faqs?: any[];
    whatYouWillLearn?: string[];
    whoIsItFor?: string[];
    date: Date;
    location: string;
}

export interface ProductWithDetails extends Product {
    planDetails?: PlanDetails;
    eventDetails?: EventDetails;
    merchandiseDetails?: any;
    stats?: {
        avgRating: number;
        totalRatings: number;
        totalSold: number;
        viewCount: number;
    };
}

export interface IProductRepository extends IBaseRepository<Product> {
    findByIdWithDetails(id: string): ProductWithDetails | undefined;
    findAllWithDetails(): ProductWithDetails[];
    findByType(type: string): ProductWithDetails[];
    findPlans(): ProductWithDetails[];
    findEvents(): ProductWithDetails[];
    findUpcomingEvents(): ProductWithDetails[];
    findMerchandise(): ProductWithDetails[];
    search(query: string): ProductWithDetails[];
    findPlanByType(planType: 'explorer' | 'traveler'): ProductWithDetails | undefined;
}
