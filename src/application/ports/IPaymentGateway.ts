import { PaymentType, InstallmentBank } from '@/domain/types/payment';

export interface PayByPrimeRequest {
    prime: string;
    amount: number;
    currency: string;
    details: string;
    cardholder: {
        name: string;
        email: string;
        phoneNumber: string;
    };
    orderRef?: string; // internal idempotency reference

    // Payment type and installment options
    paymentType?: PaymentType; // 'one_time' | 'subscription' | 'installment'
    installment?: {
        bank: InstallmentBank; // 'ctbc' | 'esun'
        periods: 3 | 6;
    };
}

export interface PayByPrimeResult {
    ok: boolean;
    status: number; // tappay status or internal error status
    msg?: string;
    recTradeId?: string;
    bankTransactionId?: string;
    raw?: unknown; // full raw response for audit
}

export interface IPaymentGateway {
    payByPrime(req: PayByPrimeRequest): Promise<PayByPrimeResult>;
}
