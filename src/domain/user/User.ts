import { UserId } from '../shared/ids';
import { IdentityType } from '@/features/auth/types';

export type UserRole = 'admin' | 'user';

export class User {
    constructor(
        public readonly id: UserId,
        public readonly email: string,
        public readonly name: string,
        public readonly identity: IdentityType = 'guest',
        public readonly role: UserRole = 'user',
        public readonly avatar?: string,
        public readonly bio?: string,
        public readonly discordId?: string,
        public readonly githubUsername?: string,
        public readonly emailVerified: boolean = false,
        public readonly lastLoginAt?: Date,
        public readonly createdAt: Date = new Date(),
        public readonly updatedAt: Date = new Date()
    ) { }

    static create(
        id: UserId,
        email: string,
        name: string,
        identity: IdentityType = 'guest'
    ): User {
        return new User(id, email, name, identity);
    }
}

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: UserId): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
