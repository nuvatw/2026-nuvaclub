import { DuoTier, DUO_TIERS, DuoPricing } from './DuoTier';

export interface DuoMonthStatus {
    month: string;
    isPurchasable: boolean;
    isOwned: boolean;
    isUpgradeable: boolean;
    currentTier?: DuoTier;
    upgradePrice?: number;
    disabledReason?: string;
}

export class DuoEligibilityService {
    static getMonthStatus(
        month: string,
        currentMonth: string,
        selectedTier: DuoTier,
        existingPasses: Map<string, DuoTier>
    ): DuoMonthStatus {
        const existingTier = existingPasses.get(month);

        // 1. Past/Current month check
        if (month < currentMonth) {
            return {
                month,
                isPurchasable: false,
                isOwned: !!existingTier,
                isUpgradeable: false,
                disabledReason: 'Cannot purchase past months'
            };
        }
        if (month === currentMonth) {
            return {
                month,
                isPurchasable: false,
                isOwned: !!existingTier,
                isUpgradeable: false,
                disabledReason: 'Cannot purchase current month'
            };
        }

        // 2. Existing entitlement logic
        if (existingTier) {
            const existingRank = DuoPricing.getTierRank(existingTier);
            const selectedRank = DuoPricing.getTierRank(selectedTier);

            if (selectedRank < existingRank) {
                return {
                    month,
                    isPurchasable: false,
                    isOwned: true,
                    isUpgradeable: false,
                    currentTier: existingTier,
                    disabledReason: `Cannot downgrade from ${existingTier.toUpperCase()}`
                };
            }

            if (selectedRank === existingRank) {
                return {
                    month,
                    isPurchasable: false,
                    isOwned: true,
                    isUpgradeable: false,
                    currentTier: existingTier,
                    disabledReason: `Already owned ${existingTier.toUpperCase()}`
                };
            }

            // Upgrade available
            return {
                month,
                isPurchasable: true,
                isOwned: true,
                isUpgradeable: true,
                currentTier: existingTier,
                upgradePrice: DuoPricing.calculateUpgradePrice(existingTier, selectedTier)
            };
        }

        // 3. Available for new purchase
        return {
            month,
            isPurchasable: true,
            isOwned: false,
            isUpgradeable: false
        };
    }
}
