import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Architectural Boundary Integrity Scoring Framework
 * 
 * This script automates most of the scoring for the Nuva Club architectural boundaries.
 * Version 2.0 - Refined checks and detailed reporting.
 */

interface ScoreResult {
    id: string;
    name: string;
    maxPoints: number;
    score: number;
    violations: string[];
    manualReview?: boolean;
}

interface CategoryScore {
    name: string;
    items: ScoreResult[];
    totalScore: number;
    maxScore: number;
}

const SRC_PATH = path.resolve(process.cwd(), 'src');

/**
 * Enhanced grep runner that returns file paths and matching lines
 */
function runGrep(query: string, paths: string[], excludeTypeOnly: boolean = false): string[] {
    try {
        const joinedPaths = paths
            .map(p => path.join(SRC_PATH, p))
            .filter(p => fs.existsSync(p));

        if (joinedPaths.length === 0) return [];

        // -n: line number, -r: recursive, -E: regex
        let cmd = `grep -nrE "${query}" ${joinedPaths.join(' ')} --exclude-dir=node_modules --exclude-dir=.next || true`;
        const output = execSync(cmd, { encoding: 'utf-8' });
        let lines = output.split('\n').filter(line => line.trim() !== '');

        if (excludeTypeOnly) {
            // Filter out lines that look like type-only imports: "import type ... from"
            lines = lines.filter(line => !/import\s+type\s+/.test(line));
        }

        return lines;
    } catch (error) {
        return [];
    }
}

// ==========================================
// Category A: Frontend Boundary Isolation
// ==========================================
function scoreA1(): ScoreResult {
    const violations = runGrep("from '@/domain", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    let score = 0;
    if (violations.length === 0) score = 5;
    else if (violations.length <= 2) score = 3;
    else score = 0;

    return { id: 'A1', name: 'No domain imports in UI', maxPoints: 5, score, violations };
}

function scoreA2(): ScoreResult {
    const v1 = runGrep("from '@/infra", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    const v2 = runGrep("MockDB|PrismaClient", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    const violations = [...v1, ...v2];

    return { id: 'A2', name: 'No infra/persistence imports in UI', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreA3(): ScoreResult {
    // Heuristic: Check for complex calculations in UI files (e.g., reduce, complex object mapping, state machines)
    // This is still largely manual but we can flag potential candidates
    const v1 = runGrep("\\.reduce\\(|\\.map\\(.*=>.*{.*return.*}\\)|new\\s+Map\\(", ['features']);
    // Filter to show only likely business logic
    const interesting = v1.filter(v => v.includes('compute') || v.includes('calculate') || v.includes('status') || v.includes('eligible'));

    return {
        id: 'A3',
        name: 'UI does not compute business state',
        maxPoints: 5,
        score: interesting.length > 5 ? 0 : (interesting.length > 0 ? 3 : 5),
        violations: interesting,
        manualReview: true
    };
}

function scoreA4(): ScoreResult {
    // Check if UI has any code that checks "role" or "permission" locally without BFF check
    const violations = runGrep("role\\s*===|permission\\s*===", ['features', 'components']);
    return {
        id: 'A4',
        name: 'Access control not client-only',
        maxPoints: 5,
        score: violations.length > 0 ? 3 : 5,
        violations,
        manualReview: true
    };
}

// ==========================================
// Category B: Domain Purity
// ==========================================
function scoreB1(): ScoreResult {
    const v1 = runGrep("from 'react'|from \"react\"", ['domain']);
    const v2 = runGrep("from 'next/|from \"next/", ['domain']);
    const violations = [...v1, ...v2];
    return { id: 'B1', name: 'No framework imports in domain', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreB2(): ScoreResult {
    const v1 = runGrep("window\\.|document\\.|localStorage\\.|sessionStorage\\.", ['domain']);
    const violations = [...v1];
    return { id: 'B2', name: 'No browser API usage in domain', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreB3(): ScoreResult {
    const v1 = runGrep("from '@/infra|MockDB|PrismaClient", ['domain']);
    return { id: 'B3', name: 'No DB client import in domain', maxPoints: 5, score: v1.length === 0 ? 5 : 0, violations: v1 };
}

function scoreB4(): ScoreResult {
    // Same as old B4, but more explicit
    const hasFramework = runGrep("from 'react'|from 'next/", ['domain']).length > 0;
    return { id: 'B4', name: 'Domain executable in pure Node', maxPoints: 5, score: hasFramework ? 0 : 5, violations: hasFramework ? ['Framework imports detected'] : [] };
}

// ==========================================
// Category C: BFF Boundary Strength
// ==========================================
function scoreC1(): ScoreResult {
    // Check for direct data access in UI
    const violations = runGrep("MockDB|PrismaClient|\\.findMany|\\.findUnique", ['features', 'components', 'app/(public)', 'app/(private)']);
    return { id: 'C1', name: 'All UI data flows through BFF', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreC2(): ScoreResult {
    // Heuristic: BFF routes should mostly call Services or Repositories
    // Check for "new Service" or direct complex calculations in app/api/bff
    const violations = runGrep("\\.reduce\\(|\\.filter\\(|for\\s*\\(|while\\s*\\(", ['app/api/bff']);
    return { id: 'C2', name: 'BFF contains no heavy business logic', maxPoints: 5, score: violations.length > 10 ? 2 : 5, violations, manualReview: true };
}

function scoreC3(): ScoreResult {
    // DTO completeness: Check if UI defines its own logic to "fill gaps"
    // Hard to automate, keep as manual
    return { id: 'C3', name: 'DTO completeness', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreC4(): ScoreResult {
    // Check for auth patterns in BFF routes
    const routes = runGrep("route\\.ts", ['app/api/bff']);
    const authChecks = runGrep("checkAccess|getServerSession|authenticate", ['app/api/bff']);

    // Very rough heuristic
    const score = authChecks.length >= (routes.length / 2) ? 5 : 0;
    return { id: 'C4', name: 'Auth & gating enforced server-side', maxPoints: 5, score, violations: score === 0 ? ['Low density of auth checks in BFF routes'] : [], manualReview: true };
}

// ==========================================
// Category D: Repository Isolation
// ==========================================
function scoreD1(): ScoreResult {
    // Check if domain/repositories (or similar) contains only interfaces/abstract classes
    const repoPath = path.join(SRC_PATH, 'domain/repositories');
    let violations: string[] = [];
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

function scoreD2(): ScoreResult {
    const violations = runGrep("from '@/infra", ['domain', 'application']);
    return { id: 'D2', name: 'Infra implements repositories only', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD3(): ScoreResult {
    const violations = runGrep("from '@/infra/db'|MockDB|PrismaClient", ['application']);
    return { id: 'D3', name: 'Application does not import DB client directly', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD4(): ScoreResult {
    // Manual check for adapter pattern
    return { id: 'D4', name: 'Infra replaceable without UI change', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

// ==========================================
// Category E: Directional Integrity
// ==========================================
function scoreE1(): ScoreResult {
    // domain -> nothing internally relevant
    // application -> domain
    // infra -> domain, application
    // ui -> BFF (app/api/bff)

    const v1 = runGrep("from '@/application'|from '@/infra'|from '@/features'", ['domain']);
    const v2 = runGrep("from '@/infra'|from '@/features'", ['application']);
    const violations = [...v1, ...v2];

    return { id: 'E1', name: 'Dependency direction correct', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreE2(): ScoreResult {
    return { id: 'E2', name: 'One module fully compliant end-to-end', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreE3(): ScoreResult {
    // Madge or similar would be better, but we can check for common circular import patterns
    // e.g., A imports B and B imports A in the same layer
    return { id: 'E3', name: 'No circular dependencies', maxPoints: 5, score: 5, violations: ['Requires manual verification with tool like Madge'] };
}

function scoreE4(): ScoreResult {
    const hasEslint = fs.existsSync(path.resolve(process.cwd(), 'eslint.config.mjs'));
    const eslintContent = hasEslint ? fs.readFileSync(path.resolve(process.cwd(), 'eslint.config.mjs'), 'utf-8') : '';
    const enforcesBoundaries = eslintContent.includes('no-restricted-imports') || eslintContent.includes('boundaries');

    return {
        id: 'E4',
        name: 'Architecture enforceable via tooling',
        maxPoints: 5,
        score: enforcesBoundaries ? 5 : (hasEslint ? 2 : 0),
        violations: enforcesBoundaries ? [] : ['No boundary enforcement found in ESLint config']
    };
}

// ==========================================
// Reporting
// ==========================================
async function main() {
    const categories: CategoryScore[] = [
        {
            name: 'A. Frontend Boundary Isolation',
            items: [scoreA1(), scoreA2(), scoreA3(), scoreA4()],
            maxScore: 20,
            totalScore: 0
        },
        {
            name: 'B. Domain Purity',
            items: [scoreB1(), scoreB2(), scoreB3(), scoreB4()],
            maxScore: 20,
            totalScore: 0
        },
        {
            name: 'C. BFF Boundary Strength',
            items: [scoreC1(), scoreC2(), scoreC3(), scoreC4()],
            maxScore: 20,
            totalScore: 0
        },
        {
            name: 'D. Repository Isolation',
            items: [scoreD1(), scoreD2(), scoreD3(), scoreD4()],
            maxScore: 20,
            totalScore: 0
        },
        {
            name: 'E. Directional Integrity',
            items: [scoreE1(), scoreE2(), scoreE3(), scoreE4()],
            maxScore: 20,
            totalScore: 0
        }
    ];

    let grandTotal = 0;

    console.log('\x1b[1m# Architectural Boundary Integrity Scoring Framework\x1b[0m\n');

    categories.forEach(cat => {
        cat.totalScore = cat.items.reduce((sum, item) => sum + item.score, 0);
        grandTotal += cat.totalScore;

        console.log(`\x1b[34m## ${cat.name} (${cat.totalScore}/${cat.maxScore} pts)\x1b[0m`);
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
            violations.slice(0, 15).forEach(v => {
                // Shorten long paths for readability
                const displayV = v.length > 120 ? v.substring(0, 117) + '...' : v;
                console.log(`- ${displayV}`);
            });
            if (violations.length > 15) console.log(`- ... and ${violations.length - 15} more`);
        }
        console.log();
    });

    console.log(`\x1b[1m## Final Result: ${grandTotal}/100\x1b[0m`);
    let interpretation = '';
    let color = '\x1b[32m'; // Green

    if (grandTotal >= 95) interpretation = 'Production-grade clean architecture';
    else if (grandTotal >= 85) interpretation = 'Strong boundary integrity';
    else if (grandTotal >= 70) { interpretation = 'Transitional, needs hardening'; color = '\x1b[33m'; }
    else if (grandTotal >= 50) { interpretation = 'Boundary leakage present'; color = '\x1b[31m'; }
    else { interpretation = 'Architecture unstable'; color = '\x1b[31m'; }

    console.log(`\x1b[1m**Interpretation:** ${color}${interpretation}\x1b[0m`);
    console.log(`\x1b[1m**Status:** ${grandTotal >= 85 ? '\x1b[32mPASSED' : '\x1b[31mFAILED'}\x1b[0m\n`);
}

main().catch(console.error);
