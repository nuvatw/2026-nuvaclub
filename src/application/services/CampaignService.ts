import { CAMPAIGN_CONFIG, CUSTOM_TIER_CONFIG } from '@/content/home-content';
import { CampaignBenefitDTO } from '../dtos/CampaignBenefitDTO';

export class CampaignService {
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
}
