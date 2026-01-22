import type { MockDB } from '../core/MockDB';
import { seedUsers } from './users.seed';
import { seedLearn } from './learn.seed';
import { seedForum } from './forum.seed';
import { seedSpace } from './space.seed';
import { seedSprint } from './sprint.seed';
import { seedShop } from './shop.seed';
import { seedTest } from './test.seed';

/**
 * Seed all data in the correct order
 * (respecting foreign key relationships)
 */
export async function seedAll(db: MockDB): Promise<void> {
  console.log('[MockDB] Seeding database...');

  // 1. Users first (no dependencies)
  await seedUsers(db);
  console.log('[MockDB] ✓ Users seeded');

  // 2. Learn module (depends on users for progress)
  await seedLearn(db);
  console.log('[MockDB] ✓ Learn module seeded');

  // 3. Forum module (depends on users)
  await seedForum(db);
  console.log('[MockDB] ✓ Forum module seeded');

  // 4. Space module (depends on users and duo tickets)
  await seedSpace(db);
  console.log('[MockDB] ✓ Space module seeded');

  // 5. Sprint module (depends on users)
  await seedSprint(db);
  console.log('[MockDB] ✓ Sprint module seeded');

  // 6. Shop module (depends on users for orders)
  await seedShop(db);
  console.log('[MockDB] ✓ Shop module seeded');

  // 7. Test module (depends on users for progress)
  await seedTest(db);
  console.log('[MockDB] ✓ Test module seeded');

  console.log('[MockDB] Database seeding complete!');
}

// Re-export individual seed functions for testing
export { seedUsers, seedLearn, seedForum, seedSpace, seedSprint, seedShop, seedTest };
