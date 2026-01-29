import { getMatchAccessForVariant } from '@/Database';

// In a real domain, this would be part of ShopService or EntitlementService
export class ShopService {
    async getDuoAccess(variant: any) {
        return getMatchAccessForVariant(variant);
    }
}

export const shopService = new ShopService();
