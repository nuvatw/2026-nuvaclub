import { UserId } from '../shared/ids';

export type GateResource =
    | 'course'
    | 'lesson'
    | 'chapter'
    | 'sprint'
    | 'forum_board'
    | 'space'
    | 'test'
    | 'duo'
    | 'feature';

export type GateAction = 'view' | 'access' | 'post' | 'join' | 'submit' | 'claim';

export type GateReason =
    | 'LOGIN_REQUIRED'
    | 'UPGRADE_REQUIRED'
    | 'PASS_EXPIRED'
    | 'NOT_ELIGIBLE'
    | 'NOT_FOUND'
    | 'FORBIDDEN'
    | 'SUCCESS';

export type GateNextAction = 'login' | 'upgrade' | 'buy-pass' | 'none';

export interface GateResponse {
    allowed: boolean;
    reason?: GateReason;
    nextAction?: GateNextAction;
    message?: string; // Optional human-readable message
}

export interface GateEngineInterface {
    evaluate(userId: UserId | null, resource: GateResource, action: GateAction, resourceId?: string): Promise<GateResponse>;
}
