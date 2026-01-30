import { ICourseRepository, ISprintRepository } from '../ports';
import { gateEngine } from '@/domain/gate/GateEngine';
import { GateAction, GateResource, GateResponse } from '@/domain/gate/types';
import { UserId } from '@/domain/shared/ids';

export class AccessService {
    constructor(
        private courseRepository: ICourseRepository,
        private sprintRepository: ISprintRepository
    ) { }

    /**
     * Evaluate access to a resource based on ID
     */
    async evaluateAccess(
        userId: UserId | null,
        resource: GateResource,
        action: GateAction,
        resourceId?: string
    ): Promise<GateResponse> {
        let domainEntity: any = null;

        // Fetch the entity based on resource type
        if (resourceId) {
            switch (resource) {
                case 'course': {
                    domainEntity = this.courseRepository.findById(resourceId);
                    break;
                }
                case 'forum_board': {
                    // Boards are currently simple strings or local data, 
                    // but let's assume they are stored in a way we can fetch.
                    // For now, mapping to a dummy entity if not found
                    domainEntity = { id: resourceId, type: 'public' };
                    break;
                }
                case 'sprint': {
                    domainEntity = this.sprintRepository.findById(resourceId);
                    break;
                }
                // Add other resources as needed
            }
        }

        return gateEngine.evaluate(userId, resource, action, domainEntity);
    }
}
