import { UserId } from '../shared/ids';
import { GateResponse } from '../gate/types';
import { Board } from './types';

export class ForumPolicy {
    canViewBoard(userId: UserId | null, board: Board): GateResponse {
        if (board.type === 'public') {
            return { allowed: true, reason: 'SUCCESS' };
        }

        if (!userId) {
            return { allowed: false, reason: 'LOGIN_REQUIRED', nextAction: 'login' };
        }

        if (board.requiresMembership) {
            // TODO: Check membership
            return { allowed: false, reason: 'UPGRADE_REQUIRED', nextAction: 'upgrade' };
        }

        return { allowed: true, reason: 'SUCCESS' };
    }
}

export const forumPolicy = new ForumPolicy();
