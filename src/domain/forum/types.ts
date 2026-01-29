import { UserId } from '../shared/ids';

export type BoardType = 'public' | 'sprint' | 'club';

export interface Board {
    id: string;
    type: BoardType;
    requiresMembership: boolean;
}
