/**
 * @deprecated Import from '@/Database' or '@/Database/tables/sprints' instead.
 *
 * This file is a compatibility re-export. All sprint/project data now lives in Database/tables/sprints.ts.
 *
 * Migration guide:
 *   // Old
 *   import { MOCK_SPRINTS, getSprintById } from '@/features/sprint/data/sprints';
 *
 *   // New
 *   import { SprintsTable, getSprintById } from '@/Database';
 */

export * from '@/Database/tables/sprints';
