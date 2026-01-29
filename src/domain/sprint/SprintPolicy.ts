import { Sprint } from './types';
import { now, isAfter, isBefore } from '../shared/time';

export class SprintPolicy {
    isActive(sprint: Sprint): boolean {
        const today = now();
        return isAfter(today, sprint.startDate) && isBefore(today, sprint.endDate) && sprint.status === 'active';
    }

    canSubmit(sprint: Sprint): boolean {
        return this.isActive(sprint);
    }
}

export const sprintPolicy = new SprintPolicy();
