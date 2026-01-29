import { UserId } from '../shared/ids';
import { GateResponse } from '../gate/types';

export class MatchingPolicy {
    validateRequest(initiatorId: UserId, targetUserId: UserId): GateResponse {
        // TODO: Implement rules
        // e.g. Cannot match with self
        if (initiatorId === targetUserId) {
            return { allowed: false, reason: 'FORBIDDEN', message: 'Cannot request relationship with self' };
        }

        // e.g. Check level gap (placeholder)
        // const initiatorLevel = ...
        // const targetLevel = ...

        return { allowed: true, reason: 'SUCCESS' };
    }
}

export const matchingPolicy = new MatchingPolicy();
