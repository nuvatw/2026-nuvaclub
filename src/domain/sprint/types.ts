import { SprintId } from '../shared/ids';

export type SprintStatus = 'upcoming' | 'active' | 'voting' | 'ended';

export interface Sprint {
    id: SprintId;
    status: SprintStatus;
    startDate: Date;
    endDate: Date;
}
