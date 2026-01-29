import { SpaceId, UserId } from '../shared/ids';
import { SpaceRelationship, SpaceRequest } from './types';
import { matchingPolicy } from './MatchingPolicy';
import { Result } from '../shared/Result';

export class SpaceService {
    async getRelationship(id: SpaceId): Promise<SpaceRelationship | null> {
        // TODO: DB lookup
        return null;
    }

    async requestRelationship(initiatorId: UserId, request: SpaceRequest): Promise<Result<SpaceRelationship>> {
        const policyResult = matchingPolicy.validateRequest(initiatorId, request.targetUserId);
        if (!policyResult.allowed) {
            return Result.fail(new Error(policyResult.message || 'Request denied'));
        }

        // TODO: Create in DB
        return Result.fail(new Error('Not implemented'));
    }
}

export const spaceService = new SpaceService();
