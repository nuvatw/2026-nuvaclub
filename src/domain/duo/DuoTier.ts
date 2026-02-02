export type DuoTier = 'go' | 'run' | 'fly';

export interface DuoTierConfig {
    name: string;
    price: number;
    rank: number;
}

export const DUO_TIERS: Record<DuoTier, DuoTierConfig> = {
    go: { name: 'Duo Go', price: 990, rank: 1 },
    run: { name: 'Duo Run', price: 2490, rank: 2 },
    fly: { name: 'Duo Fly', price: 4990, rank: 3 }
};

export class DuoPricing {
    static calculateUpgradePrice(fromTier: DuoTier, toTier: DuoTier): number {
        const fromPrice = DUO_TIERS[fromTier].price;
        const toPrice = DUO_TIERS[toTier].price;
        return Math.max(0, toPrice - fromPrice);
    }

    static getTierRank(tier: DuoTier): number {
        return DUO_TIERS[tier].rank;
    }
}
