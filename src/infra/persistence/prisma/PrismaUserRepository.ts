import { User, UserRepository } from '../../../domain/user/User';
import { prisma } from './client';
import { UserId, Ids } from '../../../domain/shared/ids';
import { IdentityType } from '@/features/auth/types';

export class PrismaUserRepository implements UserRepository {
    async save(user: User): Promise<void> {
        await prisma.user.upsert({
            where: { id: user.id },
            update: {
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                discordId: user.discordId,
                githubUsername: user.githubUsername,
                identity: user.identity,
                role: user.role,
                emailVerified: user.emailVerified,
                lastLoginAt: user.lastLoginAt,
                updatedAt: new Date(),
            },
            create: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatar: user.avatar,
                bio: user.bio,
                discordId: user.discordId,
                githubUsername: user.githubUsername,
                identity: user.identity,
                role: user.role,
                emailVerified: user.emailVerified,
                lastLoginAt: user.lastLoginAt,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    }

    async findById(id: UserId): Promise<User | null> {
        const data = await prisma.user.findUnique({
            where: { id },
        });

        if (!data) return null;

        return new User(
            Ids.User(data.id),
            data.email,
            data.name,
            data.identity as IdentityType,
            data.role as any,
            data.avatar || undefined,
            data.bio || undefined,
            data.discordId || undefined,
            data.githubUsername || undefined,
            data.emailVerified,
            data.lastLoginAt || undefined,
            data.createdAt,
            data.updatedAt
        );
    }

    async findByEmail(email: string): Promise<User | null> {
        const data = await prisma.user.findUnique({
            where: { email },
        });

        if (!data) return null;

        return new User(
            Ids.User(data.id),
            data.email,
            data.name,
            data.identity as IdentityType,
            data.role as any,
            data.avatar || undefined,
            data.bio || undefined,
            data.discordId || undefined,
            data.githubUsername || undefined,
            data.emailVerified,
            data.lastLoginAt || undefined,
            data.createdAt,
            data.updatedAt
        );
    }
}
