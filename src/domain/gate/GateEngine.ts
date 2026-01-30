import { UserId } from '../shared/ids';
import { GateAction, GateEngineInterface, GateResource, GateResponse } from './types';
import { learnAccessPolicy } from '../learn/LearnAccessPolicy';
import { forumPolicy } from '../forum/ForumPolicy';

export class GateEngine implements GateEngineInterface {
    async evaluate(
        userId: UserId | null,
        resource: GateResource,
        action: GateAction,
        context?: any // Entity or state
    ): Promise<GateResponse> {

        // 1. Check Login for non-public actions
        if (!userId && !this.isPublic(resource, action)) {
            return {
                allowed: false,
                reason: 'LOGIN_REQUIRED',
                nextAction: 'login',
                message: 'You must be logged in to access this resource.',
            };
        }

        // 2. Delegate to specific domain policies
        switch (resource) {
            case 'course':
            case 'lesson':
                if (context) {
                    return learnAccessPolicy.canViewCourse(userId, context);
                }
                break;

            case 'forum_board':
                if (context) {
                    return forumPolicy.canViewBoard(userId, context);
                }
                break;

            case 'sprint':
                // Sprints are generally public for viewing, but restricted for submit
                if (action === 'submit') {
                    return { allowed: !!userId, reason: userId ? 'SUCCESS' : 'LOGIN_REQUIRED' };
                }
                return { allowed: true, reason: 'SUCCESS' };

            case 'feature':
                // Global feature flags or access levels
                return { allowed: true, reason: 'SUCCESS' };
        }

        // 3. Definition of "Public" by default
        if (this.isPublic(resource, action)) {
            return { allowed: true, reason: 'SUCCESS' };
        }

        // Default deny for safety
        return {
            allowed: false,
            reason: 'FORBIDDEN',
            nextAction: 'none',
            message: `Access to ${resource}:${action} denied by default gate key.`,
        };
    }

    private isPublic(resource: GateResource, action: GateAction): boolean {
        // Viewing courses, lessons (previews), boards, and sprints is generally public
        if (action === 'view') {
            const publicResources: GateResource[] = ['course', 'lesson', 'forum_board', 'sprint'];
            return publicResources.includes(resource);
        }
        return false;
    }
}

export const gateEngine = new GateEngine();
