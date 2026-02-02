import { TapPayPayByPrimeInput, TapPayPayByPrimeResponse } from "./types";
import { MerchantIdSelector } from "./MerchantIdSelector";
import { PaymentType, InstallmentBank } from "@/domain/types/payment";

export class TapPayClient {
    private readonly apiBase: string;
    private readonly partnerKey: string;
    private readonly merchantIdSelector: MerchantIdSelector;

    constructor() {
        this.apiBase = process.env.TAPPAY_API_BASE || "https://sandbox.tappaysdk.com";
        this.partnerKey = process.env.TAPPAY_PARTNER_KEY || "";
        this.merchantIdSelector = new MerchantIdSelector();
    }

    async payByPrime(
        input: Omit<TapPayPayByPrimeInput, "partner_key" | "merchant_id">,
        paymentType: PaymentType = 'one_time',
        installmentBank?: InstallmentBank
    ): Promise<TapPayPayByPrimeResponse> {
        const url = `${this.apiBase}/tpc/payment/pay-by-prime`;

        // Select appropriate merchant ID based on payment type
        const merchantId = this.merchantIdSelector.selectMerchantId(
            paymentType,
            installmentBank
        );

        // Log merchant ID selection for debugging
        const merchantInfo = this.merchantIdSelector.getMerchantIdInfo(paymentType, installmentBank);
        console.log('[TapPayClient] Using merchant ID:', merchantInfo);

        const body: TapPayPayByPrimeInput = {
            ...input,
            partner_key: this.partnerKey,
            merchant_id: merchantId,
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.partnerKey,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                return {
                    status: -1,
                    msg: `HTTP_ERROR: ${response.status} ${response.statusText}`,
                };
            }

            const data = (await response.json()) as TapPayPayByPrimeResponse;
            return data;
        } catch (error) {
            return {
                status: -2,
                msg: error instanceof Error ? error.message : "NETWORK_ERROR",
            };
        }
    }
}
