import { IPaymentGateway, PayByPrimeRequest, PayByPrimeResult } from "@/application/ports/IPaymentGateway";
import { TapPayGateway } from "@/infra/payments/tappay/TapPayGateway";

export class CheckoutPaymentService {
    private gateway: IPaymentGateway;
    private static transactions: Map<string, PayByPrimeResult> = new Map(); // Simple idempotency storage (stub)

    constructor(gateway?: IPaymentGateway) {
        this.gateway = gateway || new TapPayGateway();
    }

    async payWithTapPayPrime(req: PayByPrimeRequest): Promise<PayByPrimeResult> {
        // 1. Basic Validation
        if (req.amount <= 0) {
            return { ok: false, status: -400, msg: "Invalid amount" };
        }

        if (!req.details) {
            return { ok: false, status: -400, msg: "Missing order details" };
        }

        // 1.1 Idempotency check
        if (req.orderRef) {
            const existing = CheckoutPaymentService.transactions.get(req.orderRef);
            if (existing) {
                if (existing.ok) {
                    console.log(`[CheckoutPaymentService] Idempotency hit: ${req.orderRef}`);
                    return existing;
                }
            }
        }

        // 2. Call Gateway
        try {
            const result = await this.gateway.payByPrime(req);

            // Phase 2: Persist transaction record (stub)
            if (req.orderRef) {
                CheckoutPaymentService.transactions.set(req.orderRef, result);
            }

            // Phase 2 TODO: Apply entitlements if result.ok

            return result;
        } catch (error) {
            console.error("[CheckoutPaymentService] Payment failed", error);
            return {
                ok: false,
                status: -500,
                msg: error instanceof Error ? error.message : "INTERNAL_SERVER_ERROR",
            };
        }
    }
}
