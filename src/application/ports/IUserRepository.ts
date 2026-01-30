import { User, UserSubscription, UserDuoTicket } from '@/domain/types/user';
import { IBaseRepository } from './IBaseRepository';
import { IdentityType } from '@/features/auth/types';

export interface UserWithRelations extends User {
    subscription?: UserSubscription;
    duoTicket?: UserDuoTicket;
}

export interface IUserRepository extends IBaseRepository<User> {
    findByEmail(email: string): User | undefined;
    findByIdWithRelations(id: string): UserWithRelations | undefined;
    findByIdentityType(identityType: IdentityType): User[];
    updateLastLogin(id: string): User | undefined;
    getActiveSubscription(userId: string): UserSubscription | undefined;
    getActiveDuoTicket(userId: string): UserDuoTicket | undefined;
    getFavorites(userId: string): any[]; // We'll refine the return type if needed
    removeFavorite(favoriteId: string): boolean;
    createDuoTicket(userId: string, data: any): any;
    expireActiveDuoTickets(userId: string): void;
}
