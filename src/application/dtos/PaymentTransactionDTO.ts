export interface PaymentTransactionDTO {
    orderRef: string;
    amount: number;
    currency: string;
    provider: "tappay";
    status: "pending" | "success" | "failed";
    recTradeId?: string;
    bankTransactionId?: string;
    createdAt: string;
    updatedAt: string;
}
