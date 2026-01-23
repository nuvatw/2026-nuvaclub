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

export class UserRepository extends BaseRepository<UserRecord> {
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
  findByIdentityType(identityType: IdentityType): UserRecord[] {
    return this.findMany({ where: { identityType } });
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
}
