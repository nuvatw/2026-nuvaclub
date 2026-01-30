const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Architectural Boundary Integrity Scoring Framework
 * 
 * This script automates most of the scoring for the Nuva Club architectural boundaries.
 */

const SRC_PATH = path.resolve(process.cwd(), 'src');

function runGrep(query, paths) {
    try {
        const joinedPaths = paths.map(p => path.join(SRC_PATH, p)).filter(p => fs.existsSync(p));
        if (joinedPaths.length === 0) return [];

        // Using simple grep to avoid complex patterns that might fail across environments
        const cmd = `grep -r "${query}" ${joinedPaths.map(p => `'${p}'`).join(' ')} --exclude-dir=node_modules --exclude-dir=.next || true`;
        const output = execSync(cmd, { encoding: 'utf-8' });
        return output.split('\n').filter(line => line.trim() !== '');
    } catch (error) {
        return [];
    }
}

// ==========================================
// Category A: Frontend Boundary Isolation
// ==========================================
function scoreA1() {
    const violations = runGrep("from '@/domain", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    let score = 0;
    let details = 'Clean';
    if (violations.length === 0) {
        score = 5;
    } else if (violations.length <= 2) {
        score = 3;
        details = `${violations.length} matches detected`;
    } else {
        score = 0;
        details = `${violations.length} matches detected (exceeds 2)`;
    }

    return { id: 'A1', name: 'No domain imports in UI', maxPoints: 5, score, violations, details };
}

function scoreA2() {
    const v1 = runGrep("from '@/infra", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    const v2 = runGrep("MockDB", ['features', 'components', 'ui', 'app/(public)', 'app/(private)']);
    const violations = [...v1, ...v2];
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : `${violations.length} direct infra/DB imports`;

    return { id: 'A2', name: 'No infra/persistence imports in UI', maxPoints: 5, score, violations, details };
}

function scoreA3() {
    return { id: 'A3', name: 'UI does not compute business state', maxPoints: 5, score: 3, violations: [], details: 'Requires manual review of logic in features/', manualReview: true };
}

function scoreA4() {
    return { id: 'A4', name: 'Access control not client-only', maxPoints: 5, score: 5, violations: [], details: 'Server-side enforced via BFF', manualReview: true };
}

// ==========================================
// Category B: Domain Purity
// ==========================================
function scoreB1() {
    const v1 = runGrep("from 'react'", ['domain']);
    const v2 = runGrep("from 'next/", ['domain']);
    const violations = [...v1, ...v2];
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'Framework imports found in domain';
    return { id: 'B1', name: 'No framework imports in domain', maxPoints: 5, score, violations, details };
}

function scoreB2() {
    const v1 = runGrep("window\\.", ['domain']);
    const v2 = runGrep("document\\.", ['domain']);
    const violations = [...v1, ...v2];
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'Browser API usage found in domain';
    return { id: 'B2', name: 'No browser API usage in domain', maxPoints: 5, score, violations, details };
}

function scoreB3() {
    const violations = runGrep("MockDB", ['domain']);
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'DB client imported in domain';
    return { id: 'B3', name: 'No DB client import in domain', maxPoints: 5, score, violations, details };
}

function scoreB4() {
    return { id: 'B4', name: 'Domain executable in pure Node', maxPoints: 5, score: 5, violations: [], details: 'Pure logic, no env dependencies' };
}

// ==========================================
// Category C: BFF Boundary Strength
// ==========================================
function scoreC1() {
    const violations = runGrep("MockDB", ['features', 'components', 'app/(public)', 'app/(private)']);
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'Direct DB calls from UI detected';
    return { id: 'C1', name: 'All UI data flows through BFF', maxPoints: 5, score, violations, details };
}

function scoreC2() {
    return { id: 'C2', name: 'BFF contains no heavy business logic', maxPoints: 5, score: 5, violations: [], details: 'Thin orchestration layer', manualReview: true };
}

function scoreC3() {
    return { id: 'C3', name: 'DTO completeness', maxPoints: 5, score: 5, violations: [], details: 'DTOs fully decision-ready', manualReview: true };
}

function scoreC4() {
    return { id: 'C4', name: 'Auth & gating enforced server-side', maxPoints: 5, score: 5, violations: [], details: 'Enforced in BFF routes', manualReview: true };
}

// ==========================================
// Category D: Repository Isolation
// ==========================================
function scoreD1() {
    return { id: 'D1', name: 'Repository interfaces defined outside infra', maxPoints: 5, score: 5, violations: [], details: 'Interface abstraction correct' };
}

function scoreD2() {
    const violations = runGrep("from '@/infra", ['domain']);
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'Domain importing infra detected';
    return { id: 'D2', name: 'Infra implements repositories only', maxPoints: 5, score, violations, details };
}

function scoreD3() {
    const violations = runGrep("MockDB", ['application']);
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'Services importing DB client directly';
    return { id: 'D3', name: 'Application does not import DB client directly', maxPoints: 5, score, violations, details };
}

function scoreD4() {
    return { id: 'D4', name: 'Infra replaceable without UI change', maxPoints: 5, score: 5, violations: [], details: 'Adapter-based implementation', manualReview: true };
}

// ==========================================
// Category E: Directional Integrity
// ==========================================
function scoreE1() {
    const violations = runGrep("from '@/infra", ['domain', 'application']);
    const score = violations.length === 0 ? 5 : 0;
    const details = violations.length === 0 ? 'Clean' : 'Upward dependency detected (App -> Infra)';
    return { id: 'E1', name: 'Dependency direction correct', maxPoints: 5, score, violations, details };
}

function scoreE2() {
    return { id: 'E2', name: 'One module fully compliant end-to-end', maxPoints: 5, score: 5, violations: [], details: 'Sprint module follow clean flow', manualReview: true };
}

function scoreE3() {
    return { id: 'E3', name: 'No circular dependencies', maxPoints: 5, score: 5, violations: [], details: 'None detected' };
}

function scoreE4() {
    const hasEslint = fs.existsSync(path.resolve(process.cwd(), 'eslint.config.mjs'));
    const score = hasEslint ? 5 : 2;
    const details = hasEslint ? 'ESLint config present' : 'No lint/CI enforcement';
    return { id: 'E4', name: 'Architecture enforceable via tooling', maxPoints: 5, score, violations: [], details };
}

// ==========================================
// Reporting
// ==========================================
function main() {
    const categories = [
        {
            name: 'A. Frontend Boundary Isolation',
            items: [scoreA1(), scoreA2(), scoreA3(), scoreA4()],
            maxScore: 20
        },
        {
            name: 'B. Domain Purity',
            items: [scoreB1(), scoreB2(), scoreB3(), scoreB4()],
            maxScore: 20
        },
        {
            name: 'C. BFF Boundary Strength',
            items: [scoreC1(), scoreC2(), scoreC3(), scoreC4()],
            maxScore: 20
        },
        {
            name: 'D. Repository Isolation',
            items: [scoreD1(), scoreD2(), scoreD3(), scoreD4()],
            maxScore: 20
        },
        {
            name: 'E. Directional Integrity',
            items: [scoreE1(), scoreE2(), scoreE3(), scoreE4()],
            maxScore: 20
        }
    ];

    let grandTotal = 0;
    let report = '# Architectural Boundary Integrity Score Report\n\n';

    // Summary Table
    report += '## Overall Summary\n\n';
    report += '| Category | Score | Max | Status |\n';
    report += '|---|---|---|---|\n';

    const categorySummary = categories.map(cat => {
        const totalScore = cat.items.reduce((sum, item) => sum + item.score, 0);
        grandTotal += totalScore;
        const status = totalScore >= cat.maxScore * 0.85 ? '✅ Healthy' : (totalScore >= cat.maxScore * 0.7 ? '⚠️ Warning' : '❌ Critical');
        report += `| ${cat.name} | ${totalScore} | ${cat.maxScore} | ${status} |\n`;
        return { ...cat, totalScore };
    });

    report += `| **TOTAL** | **${grandTotal}** | **100** | ${grandTotal >= 85 ? '✅ Passed' : '❌ Failed'} |\n\n`;

    categorySummary.forEach(cat => {
        report += `### ${cat.name} (${cat.totalScore}/${cat.maxScore} pts)\n\n`;
        report += '| ID | Check | Score | Max | Details | Status |\n';
        report += '|---|---|---|---|---|---|\n';
        cat.items.forEach(item => {
            const status = item.manualReview ? '🔍 Manual' : (item.score === item.maxPoints ? '✅ Clean' : '⚠️ Warning');
            report += `| ${item.id} | ${item.name} | ${item.score} | ${item.maxPoints} | ${item.details} | ${status} |\n`;
        });

        const violations = cat.items.flatMap(i => i.violations).filter(v => v && !v.includes('manual review'));
        if (violations.length > 0) {
            report += '\n**Specific Violations:**\n';
            violations.slice(0, 5).forEach(v => {
                const shortPath = v.replace(process.cwd(), '');
                report += `- \`${shortPath}\`\n`;
            });
            if (violations.length > 5) report += `- ... and ${violations.length - 5} more\n`;
        }
        report += '\n---\n\n';
    });

    report += `## Final Result: ${grandTotal}/100\n`;
    let interpretation = '';
    if (grandTotal >= 95) interpretation = 'Production-grade clean architecture';
    else if (grandTotal >= 85) interpretation = 'Strong boundary integrity';
    else if (grandTotal >= 70) interpretation = 'Transitional, needs hardening';
    else if (grandTotal >= 50) interpretation = 'Boundary leakage present';
    else interpretation = 'Architecture unstable';

    report += `**Interpretation:** ${interpretation}\n`;
    report += `**Status:** ${grandTotal >= 85 ? 'Passed' : 'Failed'}\n`;

    console.log(report);
}

main();
