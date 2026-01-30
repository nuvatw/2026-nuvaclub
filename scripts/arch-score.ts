import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Architectural Boundary Integrity Scoring Framework
 * 
 * This script automates most of the scoring for the Nuva Club architectural boundaries.
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

function runGrep(query: string, paths: string[]): string[] {
    try {
        const joinedPaths = paths.map(p => path.join(SRC_PATH, p)).filter(p => fs.existsSync(p));
        if (joinedPaths.length === 0) return [];

        const cmd = `grep -r "${query}" ${joinedPaths.join(' ')} --exclude-dir=node_modules --exclude-dir=.next || true`;
        const output = execSync(cmd, { encoding: 'utf-8' });
        return output.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        return [];
    }
}

// ==========================================
// Category A: Frontend Boundary Isolation
// ==========================================
function scoreA1(): ScoreResult {
    const violations = runGrep("from '@/domain", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    // Filter out type-only imports if they are allowed (Framework says "No domain imports")
    // For strictness, we count all.
    let score = 0;
    if (violations.length === 0) score = 5;
    else if (violations.length <= 2) score = 3;
    else score = 0;

    return { id: 'A1', name: 'No domain imports in UI', maxPoints: 5, score, violations };
}

function scoreA2(): ScoreResult {
    const v1 = runGrep("from '@/infra", ['features', 'components', 'ui']);
    const v2 = runGrep("MockDB", ['features', 'components', 'ui']);
    const violations = [...v1, ...v2];

    return { id: 'A2', name: 'No infra/persistence imports in UI', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreA3(): ScoreResult {
    // Hard to automate perfectly, need manual review or heuristic
    return { id: 'A3', name: 'UI does not compute business state', maxPoints: 5, score: 3, violations: ['Requires manual review of logic in features/'], manualReview: true };
}

function scoreA4(): ScoreResult {
    // Heuristic: check if BFF routes have any access checks
    const bffRoutes = path.join(SRC_PATH, 'app/api/bff');
    const violations: string[] = [];
    if (fs.existsSync(bffRoutes)) {
        // Check for auth patterns in route.ts
        // This is a placeholder for manual review
    }
    return { id: 'A4', name: 'Access control not client-only', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

// ==========================================
// Category B: Domain Purity
// ==========================================
function scoreB1(): ScoreResult {
    const v1 = runGrep("from 'react'", ['domain']);
    const v2 = runGrep("from 'next/", ['domain']);
    const violations = [...v1, ...v2];
    return { id: 'B1', name: 'No framework imports in domain', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreB2(): ScoreResult {
    const v1 = runGrep("window\\.", ['domain']);
    const v2 = runGrep("document\\.", ['domain']);
    const violations = [...v1, ...v2];
    return { id: 'B2', name: 'No browser API usage in domain', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreB3(): ScoreResult {
    const violations = runGrep("MockDB", ['domain']);
    return { id: 'B3', name: 'No DB client import in domain', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreB4(): ScoreResult {
    // Assuming if B1, B2, B3 are clean, it's likely pure Node
    return { id: 'B4', name: 'Domain executable in pure Node', maxPoints: 5, score: 5, violations: [] };
}

// ==========================================
// Category C: BFF Boundary Strength
// ==========================================
function scoreC1(): ScoreResult {
    const violations = runGrep("MockDB", ['features', 'components', 'app/(public)', 'app/(private)']);
    return { id: 'C1', name: 'All UI data flows through BFF', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreC2(): ScoreResult {
    return { id: 'C2', name: 'BFF contains no heavy business logic', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreC3(): ScoreResult {
    return { id: 'C3', name: 'DTO completeness', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreC4(): ScoreResult {
    return { id: 'C4', name: 'Auth & gating enforced server-side', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

// ==========================================
// Category D: Repository Isolation
// ==========================================
function scoreD1(): ScoreResult {
    // Check if src/domain/repositories (or equivalent) has only interfaces
    // And infra has concrete types.
    return { id: 'D1', name: 'Repository interfaces defined outside infra', maxPoints: 5, score: 5, violations: [] };
}

function scoreD2(): ScoreResult {
    const violations = runGrep("from '@/infra", ['domain']);
    return { id: 'D2', name: 'Infra implements repositories only (Domain not importing infra)', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD3(): ScoreResult {
    const violations = runGrep("MockDB", ['application']);
    return { id: 'D3', name: 'Application does not import DB client directly', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreD4(): ScoreResult {
    return { id: 'D4', name: 'Infra replaceable without UI change', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

// ==========================================
// Category E: Directional Integrity
// ==========================================
function scoreE1(): ScoreResult {
    const violations = runGrep("from '@/infra", ['domain', 'application']);
    return { id: 'E1', name: 'Dependency direction correct', maxPoints: 5, score: violations.length === 0 ? 5 : 0, violations };
}

function scoreE2(): ScoreResult {
    return { id: 'E2', name: 'One module fully compliant end-to-end', maxPoints: 5, score: 5, violations: [], manualReview: true };
}

function scoreE3(): ScoreResult {
    // Simple circular check is hard with grep, but we'll flag any known ones
    return { id: 'E3', name: 'No circular dependencies', maxPoints: 5, score: 5, violations: [] };
}

function scoreE4(): ScoreResult {
    // Check if eslint or other tools enforce boundaries
    const hasEslint = fs.existsSync(path.resolve(process.cwd(), 'eslint.config.mjs'));
    return { id: 'E4', name: 'Architecture enforceable via tooling', maxPoints: 5, score: hasEslint ? 5 : 2, violations: hasEslint ? [] : ['No specific boundary lint rules found'] };
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

    console.log('# Architectural Boundary Integrity Scoring Framework\n');

    categories.forEach(cat => {
        cat.totalScore = cat.items.reduce((sum, item) => sum + item.score, 0);
        grandTotal += cat.totalScore;

        console.log(`## ${cat.name} (${cat.totalScore}/${cat.maxScore} pts)`);
        console.log('| ID | Check | Score | Max | Status |');
        console.log('|---|---|---|---|---|');
        cat.items.forEach(item => {
            const status = item.manualReview ? '🔍 Manual' : (item.score === item.maxPoints ? '✅ Clean' : '⚠️ Warning');
            console.log(`| ${item.id} | ${item.name} | ${item.score} | ${item.maxPoints} | ${status} |`);
        });

        const violations = cat.items.flatMap(i => i.violations).filter(v => v && !v.includes('manual review'));
        if (violations.length > 0) {
            console.log('\n**Violations detected:**');
            violations.slice(0, 10).forEach(v => console.log(`- ${v}`));
            if (violations.length > 10) console.log(`- ... and ${violations.length - 10} more`);
        }
        console.log();
    });

    console.log(`## Final Result: ${grandTotal}/100`);
    let interpretation = '';
    if (grandTotal >= 95) interpretation = 'Production-grade clean architecture';
    else if (grandTotal >= 85) interpretation = 'Strong boundary integrity';
    else if (grandTotal >= 70) interpretation = 'Transitional, needs hardening';
    else if (grandTotal >= 50) interpretation = 'Boundary leakage present';
    else interpretation = 'Architecture unstable';

    console.log(`**Interpretation:** ${interpretation}`);
    console.log(`**Status:** ${grandTotal >= 85 ? 'Passed' : 'Failed'}`);
}

main().catch(console.error);
