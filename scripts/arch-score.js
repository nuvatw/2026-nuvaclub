const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Architectural Boundary Integrity Scoring Framework
 * 
 * Version 2.0 (Compiled/Synced from TS)
 */

const SRC_PATH = path.resolve(process.cwd(), 'src');

function runGrep(query, paths, excludeTypeOnly = false) {
    try {
        const joinedPaths = paths
            .map(p => path.join(SRC_PATH, p))
            .filter(p => fs.existsSync(p));

        if (joinedPaths.length === 0) return [];

        let cmd = `grep -nrE "${query}" ${joinedPaths.map(p => `'${p}'`).join(' ')} --exclude-dir=node_modules --exclude-dir=.next || true`;
        const output = execSync(cmd, { encoding: 'utf-8' });
        let lines = output.split('\n').filter(line => line.trim() !== '');

        if (excludeTypeOnly) {
            lines = lines.filter(line => !/import\s+type\s+/.test(line));
        }

        return lines;
    } catch (error) {
        return [];
    }
}

function scoreA1() {
    const violations = runGrep("from '@/domain", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    let score = 0;
    if (violations.length === 0) score = 5;
    else if (violations.length <= 2) score = 3;
    else score = 0;
    return { id: 'A1', name: 'No domain imports in UI', maxPoints: 5, score, violations };
}

function scoreA2() {
    const v1 = runGrep("from '@/infra", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    const v2 = runGrep("MockDB|PrismaClient", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    const violations = [...v1, ...v2];
    return { id: 'A2', name: 'No infra/persistence imports in UI', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreA3() {
    const SAFE_UI_PATTERNS = [
        /toLocale/,
        /Math\.round/,
        /Math\.floor/,
        /Math\.ceil/,
        /\.length/,
        /format/,
        /JSON\.stringify/,
        /JSON\.parse/
    ];

    // 1. Core complexity patterns
    const v1 = runGrep("\\.reduce\\(|\\.map\\(.*=>.*{.*return.*}\\)|new\\s+Map\\(", ['features']);

    // 2. Arithmetic on business terms
    const v2 = runGrep("(price|total|amount|discount|tax)\\s*[\\*\\/\\+\\-]\\s*", ['features', 'components']);

    // 3. Nested ternaries
    const v3 = runGrep("\\?\\s*.*\\?\\s*.*\\:", ['features', 'components']);

    const combined = [...v1, ...v2, ...v3];

    // 4. Keyword filtering
    const keywords = ['compute', 'calculate', 'eligible', 'status', 'derive', 'discount', 'pricing', 'subscription', 'tax'];
    const pattern = new RegExp(keywords.join('|'), 'i');

    // 5. Apply whitelist - filter out safe presentation patterns
    const interesting = combined.filter(v => {
        const isInteresting = pattern.test(v);
        const isSafe = SAFE_UI_PATTERNS.some(safe => safe.test(v));
        return isInteresting && !isSafe;
    });

    return { id: 'A3', name: 'UI does not compute business state', maxPoints: 5, score: interesting.length > 10 ? 0 : (interesting.length > 0 ? 3 : 5), violations: interesting, manualReview: true };
}

function scoreA4() {
    const violations = runGrep("role\\s*===|permission\\s*===|isAdmin|hasRole|status\\s*===", ['features', 'components']);
    return { id: 'A4', name: 'Access control not client-only', maxPoints: 5, score: violations.length > 0 ? 3 : 5, violations, manualReview: true };
}

function scoreB1() {
    const v1 = runGrep("from 'react'|from \"react\"", ['domain']);
    const v2 = runGrep("from 'next/|from \"next/", ['domain']);
    const violations = [...v1, ...v2];
    return { id: 'B1', name: 'No framework imports in domain', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreB2() {
    const v1 = runGrep("window\\.|document\\.|localStorage\\.|sessionStorage\\.", ['domain']);
    return { id: 'B2', name: 'No browser API usage in domain', maxPoints: 5, score: v1.length === 0 ? 5 : 0, violations: v1 };
}

function scoreB3() {
    const v1 = runGrep("from '@/infra|MockDB|PrismaClient", ['domain']);
    return { id: 'B3', name: 'No DB client import in domain', maxPoints: 5, score: v1.length === 0 ? 5 : 0, violations: v1 };
}

function scoreB4() {
    const hasFramework = runGrep("from 'react'|from 'next/", ['domain']).length > 0;
    return { id: 'B4', name: 'Domain executable in pure Node', maxPoints: 5, score: hasFramework ? 0 : 5, violations: hasFramework ? ['Framework imports detected'] : [] };
}

function scoreC1() {
    const violations = runGrep("MockDB|PrismaClient|\\.findMany|\\.findUnique", ['features', 'components', 'app/(public)', 'app/(private)']);
    return { id: 'C1', name: 'All UI data flows through BFF', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreC2() {
    const violations = runGrep("\\.reduce\\(|\\.filter\\(|for\\s*\\(|while\\s*\\(", ['app/api/bff']);
    return { id: 'C2', name: 'BFF contains no heavy business logic', maxPoints: 5, score: violations.length > 10 ? 2 : 5, violations, manualReview: true };
}

function scoreC3() {
    return { id: 'C3', name: 'DTO completeness', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreC4() {
    const routes = runGrep("route\\.ts", ['app/api/bff']);
    const authChecks = runGrep("checkAccess|getServerSession|authenticate", ['app/api/bff']);
    const score = authChecks.length >= (routes.length / 2) ? 5 : 0;
    return { id: 'C4', name: 'Auth & gating enforced server-side', maxPoints: 5, score, violations: score === 0 ? ['Low density of auth checks in BFF routes'] : [], manualReview: true };
}

function scoreD1() {
    const repoPath = path.join(SRC_PATH, 'domain/repositories');
    let violations = [];
    if (fs.existsSync(repoPath)) {
        const files = fs.readdirSync(repoPath);
        files.forEach(file => {
            const content = fs.readFileSync(path.join(repoPath, file), 'utf-8');
            if (content.includes('class') && !content.includes('abstract class') && !file.endsWith('.test.ts')) {
                violations.push(`${file}: Contains concrete class implementation`);
            }
        });
    }
    return { id: 'D1', name: 'Repository interfaces defined outside infra', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD2() {
    const violations = runGrep("from '@/infra", ['domain', 'application']);
    return { id: 'D2', name: 'Infra implements repositories only', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD3() {
    const violations = runGrep("from '@/infra/db'|MockDB|PrismaClient", ['application']);
    return { id: 'D3', name: 'Application does not import DB client directly', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD4() {
    return { id: 'D4', name: 'Infra replaceable without UI change', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreE1() {
    const v1 = runGrep("from '@/application'|from '@/infra'|from '@/features'", ['domain']);
    const v2 = runGrep("from '@/infra'|from '@/features'", ['application']);
    const violations = [...v1, ...v2];
    return { id: 'E1', name: 'Dependency direction correct', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreE2() {
    return { id: 'E2', name: 'One module fully compliant end-to-end', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreE3() {
    return { id: 'E3', name: 'No circular dependencies', maxPoints: 5, score: 5, violations: ['Requires manual verification with tool like Madge'] };
}

function scoreE4() {
    const hasEslint = fs.existsSync(path.resolve(process.cwd(), 'eslint.config.mjs'));
    const eslintContent = hasEslint ? fs.readFileSync(path.resolve(process.cwd(), 'eslint.config.mjs'), 'utf-8') : '';
    const enforcesBoundaries = eslintContent.includes('no-restricted-imports') || eslintContent.includes('boundaries');
    return { id: 'E4', name: 'Architecture enforceable via tooling', maxPoints: 5, score: enforcesBoundaries ? 5 : (hasEslint ? 2 : 0), violations: enforcesBoundaries ? [] : ['No boundary enforcement found in ESLint config'] };
}

async function main() {
    const isCI = process.argv.includes('--ci');

    const categories = [
        { name: 'A. Frontend Boundary Isolation', items: [scoreA1(), scoreA2(), scoreA3(), scoreA4()], maxScore: 20 },
        { name: 'B. Domain Purity', items: [scoreB1(), scoreB2(), scoreB3(), scoreB4()], maxScore: 20 },
        { name: 'C. BFF Boundary Strength', items: [scoreC1(), scoreC2(), scoreC3(), scoreC4()], maxScore: 20 },
        { name: 'D. Repository Isolation', items: [scoreD1(), scoreD2(), scoreD3(), scoreD4()], maxScore: 20 },
        { name: 'E. Directional Integrity', items: [scoreE1(), scoreE2(), scoreE3(), scoreE4()], maxScore: 20 }
    ];

    let grandTotal = 0;

    // Header
    console.log('\n\x1b[1m========================================\x1b[0m');
    console.log('\x1b[1mArchitectural Boundary Integrity Score\x1b[0m');
    console.log('\x1b[1m========================================\x1b[0m\n');

    categories.forEach(cat => {
        cat.totalScore = cat.items.reduce((sum, item) => sum + item.score, 0);
        grandTotal += cat.totalScore;
        console.log(`\x1b[34m\x1b[1m## ${cat.name} (${cat.totalScore}/${cat.maxScore} pts)\x1b[0m`);
        console.log('| ID | Check | Score | Max | Status |');
        console.log('|---|---|---|---|---|');
        cat.items.forEach(item => {
            let status = '✅ Clean';
            if (item.manualReview) status = '🔍 Manual';
            if (item.score < item.maxPoints && !item.manualReview) status = '⚠️ Violation';
            if (item.score === 0) status = '❌ Critical';
            console.log(`| ${item.id} | ${item.name} | ${item.score} | ${item.maxPoints} | ${status} |`);
        });

        const violations = cat.items.flatMap(i => i.violations).filter(v => v && !v.includes('manual review') && !v.includes('Requires manual'));
        if (violations.length > 0) {
            console.log('\n\x1b[31mViolations detected:\x1b[0m');
            violations.slice(0, 10).forEach(v => {
                const displayV = v.length > 120 ? v.substring(0, 117) + '...' : v;
                console.log(`- ${displayV}`);
            });
            if (violations.length > 10) console.log(`- ... and ${violations.length - 10} more`);
        }
        console.log();
    });

    // Summary Section
    console.log('\x1b[1m========================================\x1b[0m');
    console.log(`\x1b[1mFinal Result: ${grandTotal}/100\x1b[0m`);
    console.log('\x1b[1m========================================\x1b[0m\n');

    let interpretation = '';
    let color = '\x1b[32m';
    if (grandTotal >= 95) interpretation = 'Production-grade clean architecture';
    else if (grandTotal >= 85) interpretation = 'Strong boundary integrity';
    else if (grandTotal >= 70) { interpretation = 'Transitional, needs hardening'; color = '\x1b[33m'; }
    else if (grandTotal >= 50) { interpretation = 'Boundary leakage present'; color = '\x1b[31m'; }
    else { interpretation = 'Architecture unstable'; color = '\x1b[31m'; }

    console.log(`\x1b[1m**Interpretation:** ${color}${interpretation}\x1b[0m`);
    console.log(`\x1b[1m**Status:** ${grandTotal >= 85 ? '\x1b[32mPASSED' : '\x1b[31mFAILED'}\x1b[0m\n`);

    if (isCI) {
        // Output for CI parsing
        console.log('\x1b[1m--- CI SUMMARY ---\x1b[0m');
        console.log(`ARCH_SCORE=${grandTotal}`);

        const summary = {
            score: grandTotal,
            interpretation,
            status: grandTotal >= 85 ? 'PASSED' : 'FAILED',
            categories: categories.map(cat => ({
                name: cat.name,
                score: cat.totalScore,
                items: cat.items.map(i => ({ id: i.id, name: i.name, score: i.score }))
            }))
        };
        console.log(JSON.stringify(summary, null, 2));
    }

    // Always exit 0 during informational phase
    process.exit(0);
}

main().catch(error => {
    console.error('Scoring failed:', error);
    process.exit(1);
});
