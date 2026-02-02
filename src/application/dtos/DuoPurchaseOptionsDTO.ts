export type DuoTier = 'go' | 'run' | 'fly';

export interface DuoTierInfo {
    name: string;
    price: number;
}

export const DUO_TIER_INFO: Record<DuoTier, DuoTierInfo> = {
    go: { name: 'Duo Go', price: 990 },
    run: { name: 'Duo Run', price: 2490 },
    fly: { name: 'Duo Fly', price: 4990 }
};

export interface DuoMonthOptionDTO {
    month: string;
    state: 'available' | 'owned' | 'upgrade' | 'disabled';
    price: number;
    currentTier?: DuoTier;
    reason?: string;
}

export interface DuoPurchaseOptionsDTO {
    year: number;
    selectedTier: DuoTier;
    options: DuoMonthOptionDTO[];
}
