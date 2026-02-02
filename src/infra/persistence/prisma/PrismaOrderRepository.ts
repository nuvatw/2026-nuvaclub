import { Order, OrderRepository } from '../../../domain/order/Order';
import { prisma } from './client';
import { Ids } from '../../../domain/shared/ids';

export class PrismaOrderRepository implements OrderRepository {
    async findByRef(orderRef: string): Promise<Order | null> {
        const data = await prisma.order.findUnique({
            where: { orderRef },
        });

        if (!data) return null;

        return new Order(
            Ids.Order(data.id),
            data.orderRef,
            data.status as any,
            data.totalAmount,
            data.currency,
            data.purchaserInfo as any,
            data.participants as any,
            data.createdAt,
            data.paidAt || undefined
        );
    }

    async save(order: Order): Promise<void> {
        await prisma.order.upsert({
            where: { orderRef: order.orderRef },
            update: {
                status: order.status,
                paidAt: order.paidAt,
                totalAmount: order.totalAmount,
                purchaserInfo: order.purchaser as any,
                participants: order.participants as any,
            },
            create: {
                id: order.id,
                orderRef: order.orderRef,
                status: order.status,
                totalAmount: order.totalAmount,
                currency: order.currency,
                purchaserInfo: order.purchaser as any,
                participants: order.participants as any,
                createdAt: order.createdAt,
                paidAt: order.paidAt,
            },
        });
    }
}
