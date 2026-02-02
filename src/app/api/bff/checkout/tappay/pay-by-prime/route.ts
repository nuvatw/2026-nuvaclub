import { NextRequest, NextResponse } from "next/server";
import { PledgeWorkflowService } from "@/application/services/PledgeWorkflowService";
import { TapPayGateway } from "@/infra/payments/tappay/TapPayGateway";
import { PrismaOrderRepository } from "@/infra/persistence/prisma/PrismaOrderRepository";
import { PrismaMembershipRepository } from "@/infra/persistence/prisma/PrismaMembershipRepository";
import { StubEmailService } from "@/application/services/EmailService";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { prime, amount, currency, details, cardholder, orderRef, tier, months, participants } = body;

        // 1. Validation
        if (!prime || !amount || !cardholder || !cardholder.email || !tier || !months || !participants) {
            return NextResponse.json(
                { ok: false, msg: "Missing required fields for fulfillment" },
                { status: 400 }
            );
        }

        // Initialize dependencies (In a real app, use a DI container)
        const workflow = new PledgeWorkflowService(
            new TapPayGateway(),
            new PrismaOrderRepository(),
            new PrismaMembershipRepository(),
            new StubEmailService()
        );

        const result = await workflow.processPledge({
            prime,
            amount,
            currency: currency || "TWD",
            details,
            cardholder: {
                name: cardholder.name,
                email: cardholder.email,
                phoneNumber: cardholder.phone_number || cardholder.phone,
            },
            orderRef,
            tier,
            months,
            participants,
        });

        if (result.ok) {
            return NextResponse.json({
                ok: true,
                orderId: result.orderId,
                memberNumbers: result.memberNumbers,
                msg: result.msg || "Pledge successful",
            });
        } else {
            return NextResponse.json(
                { ok: false, msg: result.msg || "Fulfillment failed" },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error("[BFF] Pledge workflow error", error);
        return NextResponse.json(
            { ok: false, msg: error instanceof Error ? error.message : "Internal Server Error" },
            { status: 500 }
        );
    }
}
