import { IUserRepository, IProductRepository } from '../ports';
import type { DuoVariant, NunuTier, DuoEntitlement } from '@/features/shop/types';

const DUO_ACCESS_MAP: Record<DuoVariant, NunuTier[]> = {
    'go': ['nunu'],
    'run': ['nunu', 'verified_nunu'],
    'fly': ['nunu', 'verified_nunu', 'super_nunu']
};

export class ShopService {
    constructor(
        private userRepository: IUserRepository,
        private productRepository: IProductRepository
    ) { }

    /**
     * Get all shop products
     */
    getAllShopProducts() {
        return this.productRepository.findAll();
    }

    /**
     * Get products by category
     */
    getProductsByCategory(category: string) {
        return this.productRepository.findMany({ where: { category } as any });
    }

    /**
     * Get user's active Duo entitlement
     */
    async getEntitlement(userId: string): Promise<DuoEntitlement | null> {
        const ticket = this.userRepository.getActiveDuoTicket(userId);
        if (!ticket) {
            return null;
        }

        const variant = ticket.tier as DuoVariant;

        return {
            variant: variant,
            purchasedAt: ticket.purchasedAt.toISOString(),
            matchAccess: DUO_ACCESS_MAP[variant] || []
        };
    }

    /**
     * Purchase (or upgrade) a Duo ticket
     */
    async purchaseDuoTicket(userId: string, variant: DuoVariant): Promise<DuoEntitlement> {
        if (!DUO_ACCESS_MAP[variant]) {
            throw new Error('Invalid variant');
        }

        // 1. Expire existing active ticket if any
        this.userRepository.expireActiveDuoTickets(userId);

        // 2. Create new ticket
        const now = new Date();
        this.userRepository.createDuoTicket(userId, {
            tier: variant,
            status: 'active',
            validFrom: now,
            validUntil: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 days
            purchasedAt: now,
            createdAt: now
        });

        return {
            variant,
            purchasedAt: now.toISOString(),
            matchAccess: DUO_ACCESS_MAP[variant]
        };
    }

    /**
     * Cancel/Expire active Duo ticket
     */
    async cancelDuoTicket(userId: string): Promise<void> {
        this.userRepository.expireActiveDuoTickets(userId);
    }
}
