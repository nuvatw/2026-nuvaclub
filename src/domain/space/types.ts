import { SpaceId, UserId } from '../shared/ids';

export type SpaceRelationshipType = 'companion' | 'sprint_buddy' | 'mentor';
export type SpaceRelationshipStatus = 'pending' | 'active' | 'rejected' | 'expired';

export interface SpaceRelationship {
    id: SpaceId;
    initiatorId: UserId;
    receiverId: UserId;
    type: SpaceRelationshipType;
    status: SpaceRelationshipStatus;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
}

export interface SpaceRequest {
    targetUserId: UserId;
    type: SpaceRelationshipType;
    message?: string;
}
