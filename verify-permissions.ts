import { hasPermission, Permission } from './src/lib/config/permissions';
import { IdentityType } from './src/features/auth/types';

const testPermission = (identity: IdentityType, permission: Permission, expected: boolean) => {
    const result = hasPermission(identity, permission);
    console.log(`[${result === expected ? 'PASS' : 'FAIL'}] ${identity} -> ${permission}: expected ${expected}, got ${result}`);
};

console.log('--- Verifying Permission Matrix ---');

// Guest
testPermission('guest', 'learn:view_first_chapter', true);
testPermission('guest', 'forum:read', true);
testPermission('guest', 'forum:like_comment', false);

// explorer (Bob)
testPermission('explorer', 'learn:view_free_courses', true);
testPermission('explorer', 'forum:like_comment', true);
testPermission('explorer', 'forum:post', false);
testPermission('explorer', 'msg:send', true);

// duo-go (Basic)
testPermission('duo-go', 'learn:view_all_courses', true);
testPermission('duo-go', 'learn:weekly_live', true);
testPermission('duo-go', 'support:passive', true);
testPermission('duo-go', 'support:active', false);

// duo-run (Go)
testPermission('duo-run', 'support:active', true);

// duo-fly (Run)
testPermission('duo-fly', 'special:one_on_one', true);

console.log('--- Verification Complete ---');
