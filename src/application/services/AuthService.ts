import { IUserRepository } from '../ports';
import type { User } from '@/features/auth/types';
import type { IdentityType } from '@/features/auth/types';

export class AuthService {
    constructor(private userRepository: IUserRepository) { }

    /**
     * Get user session data by ID
     */
    async getUserSession(userId: string): Promise<User | null> {
        const userRecord = this.userRepository.findByIdWithRelations(userId);
        if (!userRecord) return null;

        return {
            id: userRecord.id,
            name: userRecord.name,
            email: userRecord.email,
            avatar: userRecord.avatar,
            identity: userRecord.identityType as IdentityType,
            role: 'user', // Default for mock
            createdAt: userRecord.createdAt,
            bio: userRecord.bio,
            discordId: userRecord.discordId,
            githubUsername: userRecord.githubUsername,
        };
    }

    /**
     * Update user profile
     */
    async updateProfile(userId: string, data: Partial<User>): Promise<User | null> {
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
