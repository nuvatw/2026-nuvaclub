import { CAMPAIGN_CONFIG, CUSTOM_TIER_CONFIG } from '@/content/home-content';
import { CampaignBenefitDTO } from '../dtos/CampaignBenefitDTO';
import { OrderRepository } from '@/domain/order/Order';
import { MembershipRepository } from '@/domain/membership/Membership';

export class CampaignService {
    constructor(
        private readonly orderRepo: OrderRepository,
        private readonly membershipRepo: MembershipRepository
    ) { }

    /**
     * Get campaign statistics (total raised and backer count)
     */
    async getCampaignStats(): Promise<{ totalRaised: number; backerCount: number }> {
        const [totalRaised, backerCount] = await Promise.all([
            this.orderRepo.getTotalPaidAmount(),
            this.membershipRepo.count(),
        ]);

        return {
            totalRaised,
            backerCount,
        };
    }

    /**
     * Calculate benefits (months and avg price) for a custom donation amount
     */
    calculateBenefits(amount: number): CampaignBenefitDTO {
        const minPrice = CUSTOM_TIER_CONFIG.minPrice;
        const pricePerMonth = CAMPAIGN_CONFIG.customTierMonthlyPrice;

        if (amount <= 0) {
            return {
                totalMonths: 0,
                avgMonthlyPrice: pricePerMonth,
                isValid: false
            };
        }

        if (amount < minPrice) {
            return {
                totalMonths: Math.ceil(amount / pricePerMonth),
                avgMonthlyPrice: Math.round(amount / Math.ceil(amount / pricePerMonth)) || pricePerMonth,
                isValid: false,
                error: `最低金額為 NT$${minPrice.toLocaleString()}`
            };
        }

        const totalMonths = Math.ceil(amount / pricePerMonth);
        const avgMonthlyPrice = Math.round(amount / totalMonths);

        return {
            totalMonths,
            avgMonthlyPrice,
            isValid: true
        };
    }

    /**
     * Reset campaign data (deletes all memberships and orders)
     * For development use only.
     */
    async resetCampaign(): Promise<{ ok: boolean; error?: string }> {
        try {
            // Must delete memberships first due to foreign key constraints
            await this.membershipRepo.deleteAll();
            await this.orderRepo.deleteAll();
            return { ok: true };
        } catch (error: any) {
            console.error('[CampaignService] Failed to reset campaign:', error);
            return { ok: false, error: error.message || 'Unknown error' };
        }
    }
}
