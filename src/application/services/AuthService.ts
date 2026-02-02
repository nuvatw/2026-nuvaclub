import { IUserRepository } from '../ports';
import type { User, IdentityType, UserRole } from '@/features/auth/types';
import type { UserSessionDTO } from '../dtos/UserSessionDTO';
import { TEST_ACCOUNTS } from '@/features/auth/data/test-accounts';

export class AuthService {
    constructor(private userRepository: IUserRepository) { }

    /**
     * Get user session data by ID
     */
    async getUserSession(userId: string): Promise<UserSessionDTO | null> {
        // Handle test accounts
        if (userId.startsWith('test-')) {
            const testAccount = TEST_ACCOUNTS.find(a => a.id === userId);
            if (!testAccount) return null;

            const role: UserRole = testAccount.id.includes('admin') ? 'admin' : 'user';
            return {
                id: testAccount.id,
                name: testAccount.name,
                email: `${testAccount.id}@nuvaclub.test`,
                identity: testAccount.identity,
                role: role,
                createdAt: new Date(),
                canAccessAdminPanel: role === 'admin',
            };
        }

        const userRecord = this.userRepository.findByIdWithRelations(userId);
        if (!userRecord) return null;

        const role: UserRole = userId.includes('admin') ? 'admin' : 'user';

        return {
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            avatar: userRecord.avatar,
            identity: userRecord.identityType as IdentityType,
            role: role,
            createdAt: userRecord.createdAt,
            bio: userRecord.bio,
            discordId: userRecord.discordId,
            githubUsername: userRecord.githubUsername,
            canAccessAdminPanel: role === 'admin',
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: Partial<User>): Promise<UserSessionDTO | null> {
        const updated = this.userRepository.update(userId, {
            name: data.name,
            bio: data.bio,
            discordId: data.discordId,
            githubUsername: data.githubUsername,
            updatedAt: new Date(),
        });

        if (!updated) return null;
        return this.getUserSession(userId);
    }
}
