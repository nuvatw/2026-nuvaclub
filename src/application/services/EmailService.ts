export interface EmailService {
    sendFulfillmentNotification(email: string, details: any): Promise<void>;
}

export class StubEmailService implements EmailService {
    async sendFulfillmentNotification(email: string, details: any): Promise<void> {
        console.log(`[EmailService] Sending fulfillment email to ${email}`, details);
    }
}
