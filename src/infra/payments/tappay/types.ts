export type TapPayServerType = "sandbox" | "production";

export interface TapPayPayByPrimeInput {
    prime: string;
    partner_key: string;
    merchant_id: string;
    amount: number;
    currency: string;
    details: string;
    cardholder: {
        phone_number: string;
        name: string;
        email: string;
    };
    // optional
    order_number?: string;
    three_domain_secure?: boolean;
    result_url?: {
        frontend_redirect_url?: string;
        backend_notify_url?: string;
    };
    remember?: boolean;
}

export interface TapPayPayByPrimeResponse {
    status: number;
    msg: string;
    rec_trade_id?: string;
    bank_transaction_id?: string;
    auth_code?: string;
    amount?: number;
    currency?: string;
    order_number?: string;
    card_info?: {
        last_four: string;
        bin_code: string;
        type: number;
        level: string;
        country: string;
        country_code: string;
        bank_id: string;
        bank_name: string;
    };
    [k: string]: unknown;
}
