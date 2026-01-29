import { UserId } from '../shared/ids';
import { GateResponse } from '../gate/types';
import { Course } from './types';

export class LearnAccessPolicy {
    canViewCourse(userId: UserId | null, course: Course): GateResponse {
        if (course.isFree) {
            return { allowed: true, reason: 'SUCCESS' };
        }

        if (!userId) {
            return { allowed: false, reason: 'LOGIN_REQUIRED', nextAction: 'login' };
        }

        // TODO: Connect to MembershipService to check if user has access
        return { allowed: false, reason: 'FORBIDDEN', nextAction: 'buy-pass' };
    }
}

export const learnAccessPolicy = new LearnAccessPolicy();
