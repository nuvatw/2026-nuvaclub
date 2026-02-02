import { IUserRepository, IProductRepository, IDuoRepository } from '../ports';
import type { DuoVariant, NunuTier, DuoEntitlement } from '@/features/shop/types';
import { DuoTier, DUO_TIERS, DuoPricing } from '../../domain/duo/DuoTier';
import { DuoEligibilityService } from '../../domain/duo/DuoEligibilityService';
import { DuoPurchaseOptionsDTO, DuoMonthOptionDTO } from '../dtos/DuoPurchaseOptionsDTO';

const DUO_ACCESS_MAP: Record<DuoVariant, NunuTier[]> = {
    'go': ['nunu'],
    'run': ['nunu', 'verified_nunu'],
    'fly': ['nunu', 'verified_nunu', 'super_nunu']
};

export class ShopService {
    constructor(
        private userRepository: IUserRepository,
        private productRepository: IProductRepository,
        private duoRepository: IDuoRepository
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
     * Get precomputed Duo purchase options for a user/year/tier
     */
    async getDuoPurchaseOptions(userId: string, year: number, selectedTier: DuoTier): Promise<DuoPurchaseOptionsDTO> {
        const passes = this.duoRepository.getPassesByUserId(userId);
        const existingPassMap = new Map<string, DuoTier>();
        passes.forEach(p => {
            if (p.status === 'active') {
                existingPassMap.set(p.month, p.tier);
            }
        });

        const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
        const options: DuoMonthOptionDTO[] = [];

        for (let i = 1; i <= 12; i++) {
            const monthStr = `${year}-${String(i).padStart(2, '0')}`;
            const status = DuoEligibilityService.getMonthStatus(monthStr, currentMonth, selectedTier, existingPassMap);

            let state: DuoMonthOptionDTO['state'] = 'available';
            if (status.isUpgradeable) state = 'upgrade';
            else if (status.isOwned) state = 'owned';
            else if (!status.isPurchasable) state = 'disabled';

            const price = status.isUpgradeable
                ? (status.upgradePrice ?? 0)
                : (state === 'available' ? DUO_TIERS[selectedTier].price : 0);

            options.push({
                month: monthStr,
                state,
                price,
                currentTier: status.currentTier,
                reason: status.disabledReason
            });
        }

        return {
            year,
            selectedTier,
            options
        };
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
