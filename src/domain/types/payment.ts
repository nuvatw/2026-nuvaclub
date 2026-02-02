export type PaymentType = 'one_time' | 'subscription' | 'installment';

export type InstallmentBank = 'ctbc' | 'esun'; // 中信、玉山

export interface InstallmentOption {
    bank: InstallmentBank;
    periods: 3 | 6; // 3期或6期
    bankName: string;
    displayName: string;
    monthlyAmount?: number; // 每期金額
}

export const INSTALLMENT_OPTIONS: InstallmentOption[] = [
    { bank: 'ctbc', periods: 3, bankName: '中國信託', displayName: '中信卡 3 期' },
    { bank: 'ctbc', periods: 6, bankName: '中國信託', displayName: '中信卡 6 期' },
    { bank: 'esun', periods: 3, bankName: '玉山銀行', displayName: '玉山卡 3 期' },
    { bank: 'esun', periods: 6, bankName: '玉山銀行', displayName: '玉山卡 6 期' },
];

export function getInstallmentOptions(totalAmount: number): InstallmentOption[] {
    return INSTALLMENT_OPTIONS.map(option => ({
        ...option,
        monthlyAmount: Math.ceil(totalAmount / option.periods),
    }));
}
