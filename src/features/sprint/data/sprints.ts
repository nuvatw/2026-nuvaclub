/**
 * @deprecated Import from '@/lib/legacy-db-shim' or '@/lib/types/legacy-shim/sprints' instead.
 *
 * This file is a compatibility re-export. All sprint/project data now lives in Database/tables/sprints.ts.
 *
 * Migration guide:
 *   // Old
 *   import { MOCK_SPRINTS, getSprintById } from '@/features/sprint/data/sprints';
 *
 *   // New
 *   import { SprintsTable, getSprintById } from '@/lib/legacy-db-shim';
 */

export * from '@/lib/types/legacy-shim/sprints';
