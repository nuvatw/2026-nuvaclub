import { IUserRepository } from '@/application/ports/IUserRepository';
import { BaseRepository } from './BaseRepository';
import type { MockDB } from '../core/MockDB';
import type {
  UserRecord,
  UserSubscriptionRecord,
  UserDuoTicketRecord,
} from '../schema';
import type { IdentityType } from '@/features/auth/types';

export interface UserWithRelations extends UserRecord {
  subscription?: UserSubscriptionRecord;
  duoTicket?: UserDuoTicketRecord;
}

export class UserRepository extends BaseRepository<UserRecord> implements IUserRepository {
  constructor(db: MockDB) {
    super(db.users, db);
  }

  /**
   * Find user by email
   */
  findByEmail(email: string): UserRecord | undefined {
    return this.findFirst({ where: { email } });
  }

  /**
   * Find user with related subscription and duo ticket
   */
  findByIdWithRelations(id: string): UserWithRelations | undefined {
    const user = this.findById(id);
    if (!user) return undefined;

    const subscription = this.db.userSubscriptions.findFirst({
      where: (s) => s.userId === id && s.status === 'active',
    });

    const duoTicket = this.db.userDuoTickets.findFirst({
      where: (t) => t.userId === id && t.status === 'active',
    });

    return {
      ...user,
      subscription,
      duoTicket,
    };
  }

  /**
   * Find users by identity type
   */
  findByIdentityType(identityType: string): UserRecord[] {
    return this.findMany({ where: { identityType: identityType as IdentityType } });
  }

  /**
   * Update user's last login timestamp
   */
  updateLastLogin(id: string): UserRecord | undefined {
    return this.update(id, {
      lastLoginAt: new Date(),
      updatedAt: new Date(),
    });
  }

  /**
   * Get user's active subscription
   */
  getActiveSubscription(userId: string): UserSubscriptionRecord | undefined {
    return this.db.userSubscriptions.findFirst({
      where: (s) => s.userId === userId && s.status === 'active',
    });
  }

  /**
   * Get user's active duo ticket
   */
  getActiveDuoTicket(userId: string): UserDuoTicketRecord | undefined {
    return this.db.userDuoTickets.findFirst({
      where: (t) => t.userId === userId && t.status === 'active',
    });
  }

  /**
   * Get user favorites
   */
  getFavorites(userId: string): any[] {
    return this.db.userFavorites.findMany({ where: { userId } });
  }

  /**
   * Remove a favorite
   */
  removeFavorite(favoriteId: string): boolean {
    return this.db.userFavorites.delete(favoriteId);
  }

  /**
   * Create a Duo ticket
   */
  createDuoTicket(userId: string, data: any): any {
    const ticket = this.db.userDuoTickets.create({
      ...data,
      userId,
    });
    this.persist();
    return ticket;
  }

  /**
   * Expire active Duo tickets
   */
  expireActiveDuoTickets(userId: string): void {
    const existing = this.db.userDuoTickets.findFirst({
      where: (t) => t.userId === userId && t.status === 'active',
    });

    if (existing) {
      this.db.userDuoTickets.update(existing.id, {
        status: 'expired',
      });
      this.persist();
    }
  }
}
