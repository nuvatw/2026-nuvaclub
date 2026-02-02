import { OrderId } from '../shared/ids';

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED';

export interface PurchaserInfo {
    name: string;
    email: string;
    phone: string;
}

export interface ParticipantInfo {
    name: string;
    email: string;
    phone: string;
}

export class Order {
    constructor(
        public readonly id: OrderId,
        public readonly orderRef: string,
        private _status: OrderStatus,
        public readonly totalAmount: number,
        public readonly currency: string,
        public readonly purchaser: PurchaserInfo,
        public readonly participants: ParticipantInfo[],
        public readonly createdAt: Date,
        private _paidAt?: Date
    ) { }

    get status(): OrderStatus {
        return this._status;
    }

    get paidAt(): Date | undefined {
        return this._paidAt;
    }

    /**
     * Confirms the payment of the order.
     * Throws if the order is already paid.
     */
    confirmPayment(paidAt: Date = new Date()): void {
        if (this._status === 'PAID') {
            throw new Error(`Order ${this.orderRef} is already paid.`);
        }
        this._status = 'PAID';
        this._paidAt = paidAt;
    }

    markAsFailed(): void {
        if (this._status === 'PAID') {
            throw new Error(`Order ${this.orderRef} is already paid and cannot be marked as failed.`);
        }
        this._status = 'FAILED';
    }

    // Static factory for creating new orders
    static create(
        id: OrderId,
        orderRef: string,
        amount: number,
        purchaser: PurchaserInfo,
        participants: ParticipantInfo[]
    ): Order {
        return new Order(
            id,
            orderRef,
            'PENDING',
            amount,
            'TWD',
            purchaser,
            participants,
            new Date()
        );
    }
}

export interface OrderRepository {
    findByRef(orderRef: string): Promise<Order | null>;
    save(order: Order): Promise<void>;
}
