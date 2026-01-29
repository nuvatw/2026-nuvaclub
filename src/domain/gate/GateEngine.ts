import { UserId } from '../shared/ids';
import { GateAction, GateEngineInterface, GateResource, GateResponse } from './types';

export class GateEngine implements GateEngineInterface {
    async evaluate(
        userId: UserId | null,
        resource: GateResource,
        action: GateAction,
        resourceId?: string
    ): Promise<GateResponse> {

        // 1. Check Login
        if (!userId) {
            // Some public resources might be allowed
            if (this.isPublic(resource, action)) {
                return { allowed: true, reason: 'SUCCESS', nextAction: 'none' };
            }
            return {
                allowed: false,
                reason: 'LOGIN_REQUIRED',
                nextAction: 'login',
                message: 'You must be logged in to access this resource.',
            };
        }

        // TODO: Connect to specific domain policies here
        // e.g. LearnAccessPolicy, membership check, etc.

        // Default deny for safety
        return {
            allowed: false,
            reason: 'FORBIDDEN',
            nextAction: 'none',
            message: 'Access denied by default gate key.',
        };
    }

    private isPublic(resource: GateResource, action: GateAction): boolean {
        // Define truly public resources here
        if (resource === 'course' && action === 'view') return true; // Viewing course list/details
        return false;
    }
}

export const gateEngine = new GateEngine();
