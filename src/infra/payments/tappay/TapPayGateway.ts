import { IPaymentGateway, PayByPrimeRequest, PayByPrimeResult } from "@/application/ports/IPaymentGateway";
import { TapPayClient } from "./TapPayClient";

export class TapPayGateway implements IPaymentGateway {
    private client: TapPayClient;

    constructor() {
        this.client = new TapPayClient();
    }

    async payByPrime(req: PayByPrimeRequest): Promise<PayByPrimeResult> {
        // Determine payment type and installment bank
        const paymentType = req.paymentType || 'one_time';
        const installmentBank = req.installment?.bank;

        // Handle both phoneNumber (camelCase) and phone_number (snake_case) for compatibility
        const phoneNumber = req.cardholder.phoneNumber || (req.cardholder as any).phone_number;

        if (!phoneNumber) {
            return {
                ok: false,
                status: -400,
                msg: 'Missing arguments : cardholder > phone_number',
            };
        }

        const response = await this.client.payByPrime(
            {
                prime: req.prime,
                amount: req.amount,
                currency: req.currency,
                details: req.details,
                cardholder: {
                    name: req.cardholder.name,
                    email: req.cardholder.email,
                    phone_number: phoneNumber,
                },
                order_number: req.orderRef,
            },
            paymentType,
            installmentBank
        );

        return {
            ok: response.status === 0,
            status: response.status,
            msg: response.msg,
            recTradeId: response.rec_trade_id,
            bankTransactionId: response.bank_transaction_id,
            raw: response,
        };
    }
}
