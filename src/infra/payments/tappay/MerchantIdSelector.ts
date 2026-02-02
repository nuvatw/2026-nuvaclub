import { PaymentType, InstallmentBank } from '@/domain/types/payment';

/**
 * Selects the appropriate TapPay Merchant ID based on payment type
 */
export class MerchantIdSelector {
    private readonly generalId: string;
    private readonly ctbcInstallmentId: string;
    private readonly esunInstallmentId: string;

    constructor() {
        this.generalId = process.env.TAPPAY_MERCHANT_ID_GENERAL || '';
        this.ctbcInstallmentId = process.env.TAPPAY_MERCHANT_ID_CTBC_INSTALLMENT || '';
        this.esunInstallmentId = process.env.TAPPAY_MERCHANT_ID_ESUN_INSTALLMENT || '';

        if (!this.generalId) {
            console.warn('[MerchantIdSelector] TAPPAY_MERCHANT_ID_GENERAL is not set');
        }
    }

    /**
     * Select merchant ID based on payment type and installment bank
     * 
     * @param paymentType - Type of payment (one_time, subscription, installment)
     * @param installmentBank - Bank for installment (ctbc or esun), required if paymentType is 'installment'
     * @returns Merchant ID string
     */
    selectMerchantId(
        paymentType: PaymentType,
        installmentBank?: InstallmentBank
    ): string {
        if (paymentType === 'installment') {
            if (!installmentBank) {
                console.error('[MerchantIdSelector] installmentBank is required for installment payment');
                return this.generalId;
            }

            const merchantId = installmentBank === 'ctbc'
                ? this.ctbcInstallmentId
                : this.esunInstallmentId;

            if (!merchantId) {
                console.warn(`[MerchantIdSelector] Merchant ID for ${installmentBank} installment not found, falling back to general`);
                return this.generalId;
            }

            return merchantId;
        }

        // 一般付款和訂閱都使用同一個 Merchant ID
        return this.generalId;
    }

    /**
     * Get merchant ID info for debugging
     */
    getMerchantIdInfo(paymentType: PaymentType, installmentBank?: InstallmentBank) {
        const merchantId = this.selectMerchantId(paymentType, installmentBank);

        let type = 'General';
        if (paymentType === 'installment' && installmentBank) {
            type = installmentBank === 'ctbc' ? 'CTBC Installment' : 'E.SUN Installment';
        } else if (paymentType === 'subscription') {
            type = 'Subscription';
        }

        return {
            merchantId,
            type,
            paymentType,
            installmentBank,
        };
    }
}
