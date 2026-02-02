const { t } = require('../src/content/i18n');

function testT() {
    console.log('--- Testing t() function ---');

    const messages = {
        'greeting': 'Hello, {name}!',
        'simple': 'Just a test',
    };

    // Test 1: Simple resolution
    const res1 = t(messages, 'simple');
    if (res1 === 'Just a test') {
        console.log('[OK] Simple resolution');
    } else {
        console.error('[FAIL] Simple resolution:', res1);
    }

    // Test 2: Parameter interpolation
    const res2 = t(messages, 'greeting', { name: 'Antigravity' });
    if (res2 === 'Hello, Antigravity!') {
        console.log('[OK] Parameter interpolation');
    } else {
        console.error('[FAIL] Parameter interpolation:', res2);
    }

    // Test 3: Missing key
    const res3 = t(messages, 'missing');
    if (res3 === 'missing') {
        console.log('[OK] Missing key fallback');
    } else {
        console.error('[FAIL] Missing key fallback:', res3);
    }
}

testT();
