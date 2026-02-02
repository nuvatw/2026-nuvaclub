const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = path.join(__dirname, '../src/content/i18n/messages');
const LOCALES = ['zh-TW', 'en', 'ja', 'ko'];
const MASTER_LOCALE = 'zh-TW';

function checkI18n() {
    console.log('--- i18n Consistency Check ---');

    let masterKeys;
    try {
        const masterFile = path.join(MESSAGES_DIR, `${MASTER_LOCALE}.ts`);
        const content = fs.readFileSync(masterFile, 'utf8');
        // Simple regex-based key extraction to avoid complex TS execution in script
        masterKeys = Array.from(content.matchAll(/'([^']+)':/g)).map(m => m[1]);
    } catch (e) {
        console.error(`Error reading master locale ${MASTER_LOCALE}:`, e.message);
        process.exit(1);
    }

    let hasError = false;

    LOCALES.forEach(locale => {
        if (locale === MASTER_LOCALE) return;

        const localeFile = path.join(MESSAGES_DIR, `${locale}.ts`);
        if (!fs.existsSync(localeFile)) {
            console.error(`[ERROR] Missing locale file: ${locale}.ts`);
            hasError = true;
            return;
        }

        const content = fs.readFileSync(localeFile, 'utf8');
        const localeKeys = Array.from(content.matchAll(/'([^']+)':/g)).map(m => m[1]);

        const missingKeys = masterKeys.filter(k => !localeKeys.includes(k));
        const extraKeys = localeKeys.filter(k => !masterKeys.includes(k));

        if (missingKeys.length > 0) {
            console.error(`[ERROR] ${locale}.ts is missing keys:`, missingKeys);
            hasError = true;
        }
        if (extraKeys.length > 0) {
            console.warn(`[WARN] ${locale}.ts has extra keys:`, extraKeys);
        }

        if (missingKeys.length === 0) {
            console.log(`[OK] ${locale}.ts is consistent with ${MASTER_LOCALE}`);
        }
    });

    if (hasError) {
        console.log('\nResult: FAILED');
        process.exit(1);
    } else {
        console.log('\nResult: PASSED');
    }
}

checkI18n();
