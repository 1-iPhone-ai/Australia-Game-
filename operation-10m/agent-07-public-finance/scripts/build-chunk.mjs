#!/usr/bin/env node
/**
 * Bundles Agent 07 module sources into operation-10m/modules/agent-07-public-finance/chunk.tsx
 * (no top-level imports — Agent 25 inline assembly).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '../../..');
const srcRoot = path.join(repoRoot, 'operation-10m/agent-07-public-finance/modules');
const outDir = path.join(repoRoot, 'operation-10m/modules/agent-07-public-finance');
const outFile = path.join(outDir, 'chunk.tsx');

const MODULE_ID = 'agent-07-public-finance';

const FILES = [
  'fiscal-outcomes/types.ts',
  'fiscal-outcomes/boundaries.ts',
  'fiscal-outcomes/tax-instruments.ts',
  'fiscal-outcomes/budget-envelopes.ts',
  'fiscal-outcomes/debt-outcomes.ts',
  'fiscal-outcomes/outcome-linkage.ts',
  'fiscal-outcomes/bridge-v1012.ts',
  'fiscal-outcomes/compute.ts',
  'fiscal-outcomes/gi-queries.ts',
  'fiscal-outcomes/catalog/policy-scenarios.ts',
  'revenue-ledger/types.ts',
  'revenue-ledger/compute.ts',
  'fiscal-risk-register/types.ts',
  'fiscal-risk-register/compute.ts',
  'intergovernmental-grants/types.ts',
  'intergovernmental-grants/compute.ts',
  'statutory-balances/types.ts',
  'statutory-balances/compute.ts',
  'cost-recovery-pricing/types.ts',
  'cost-recovery-pricing/compute.ts',
  'cash-management/types.ts',
  'cash-management/compute.ts',
  'appropriation-warrants/types.ts',
  'appropriation-warrants/compute.ts',
  'supplementary-estimates/types.ts',
  'supplementary-estimates/compute.ts',
  'spending-offsets/types.ts',
  'spending-offsets/compute.ts',
  'portfolio-outturn/types.ts',
  'portfolio-outturn/compute.ts',
  'debt-portfolio-governance/types.ts',
  'debt-portfolio-governance/compute.ts',
  'fiscal-stress-scenarios/types.ts',
  'fiscal-stress-scenarios/compute.ts',
  'public-sector-balance-sheet/types.ts',
  'public-sector-balance-sheet/compute.ts',
  'tax-policy-sensitivity/types.ts',
  'tax-policy-sensitivity/compute.ts',
  'appropriation-lapse-register/types.ts',
  'appropriation-lapse-register/compute.ts',
  'contingency-drawdown/types.ts',
  'contingency-drawdown/compute.ts',
  'forward-estimates-integrity/types.ts',
  'forward-estimates-integrity/compute.ts',
  'sovereign-credit-outlook/types.ts',
  'sovereign-credit-outlook/compute.ts',
  'debt-service-coverage/types.ts',
  'debt-service-coverage/compute.ts',
  'grant-clawback-schedule/types.ts',
  'grant-clawback-schedule/compute.ts',
  'budget-neutral-packages/types.ts',
  'budget-neutral-packages/compute.ts',
  'infrastructure-fiscal-load/types.ts',
  'infrastructure-fiscal-load/compute.ts',
  'revenue-integrity-audit/types.ts',
  'revenue-integrity-audit/compute.ts',
  'appropriation-carry-forward/types.ts',
  'appropriation-carry-forward/compute.ts',
  'expenditure-growth-benchmark/types.ts',
  'expenditure-growth-benchmark/compute.ts',
  'efficiency-dividend-register/types.ts',
  'efficiency-dividend-register/compute.ts',
  'revenue-forward-reconciliation/types.ts',
  'revenue-forward-reconciliation/compute.ts',
  'portfolio-reprioritisation-ledger/types.ts',
  'portfolio-reprioritisation-ledger/compute.ts',
  'fiscal-buffer-coherence/types.ts',
  'fiscal-buffer-coherence/compute.ts',
  'medium-term-revenue-anchor/types.ts',
  'medium-term-revenue-anchor/compute.ts',
  'appropriation-timing-coherence/types.ts',
  'appropriation-timing-coherence/compute.ts',
  'debt-fiscal-coupling-register/types.ts',
  'debt-fiscal-coupling-register/compute.ts',
  'grant-forward-alignment/types.ts',
  'grant-forward-alignment/compute.ts',
  'infrastructure-envelope-coherence/types.ts',
  'infrastructure-envelope-coherence/compute.ts',
  'fiscal-stress-resilience-bridge/types.ts',
  'fiscal-stress-resilience-bridge/compute.ts',
  'revenue-integrity-forward-bridge/types.ts',
  'revenue-integrity-forward-bridge/compute.ts',
  'budget-neutral-forward-coherence/types.ts',
  'budget-neutral-forward-coherence/compute.ts',
  'program-performance-fiscal-bridge/types.ts',
  'program-performance-fiscal-bridge/compute.ts',
  'transparency-forward-coherence/types.ts',
  'transparency-forward-coherence/compute.ts',
  'contingent-liability-forward-bridge/types.ts',
  'contingent-liability-forward-bridge/compute.ts',
  'cost-recovery-revenue-coherence/types.ts',
  'cost-recovery-revenue-coherence/compute.ts',
  'grant-clawback-forward-coherence/types.ts',
  'grant-clawback-forward-coherence/compute.ts',
  'balance-sheet-fiscal-coherence/types.ts',
  'balance-sheet-fiscal-coherence/compute.ts',
  'infrastructure-financing/types.ts',
  'infrastructure-financing/compute.ts',
  'recurring-commitments/types.ts',
  'recurring-commitments/compute.ts',
  'fiscal-resilience/types.ts',
  'fiscal-resilience/compute.ts',
  'debt-rollover/types.ts',
  'debt-rollover/compute.ts',
  'budget-lines/types.ts',
  'budget-lines/catalog/appropriation-lines.ts',
  'budget-lines/compute.ts',
  'federal-state/types.ts',
  'federal-state/catalog/state-profiles.ts',
  'federal-state/reconcile.ts',
  'tax-expenditure/types.ts',
  'tax-expenditure/catalog/measures.ts',
  'tax-expenditure/compute.ts',
  'medium-term-outlook/types.ts',
  'medium-term-outlook/compute.ts',
  'consolidated-fiscal/compute.ts',
  'fiscal-rules/types.ts',
  'fiscal-rules/compute.ts',
  'sovereign-issuance/types.ts',
  'sovereign-issuance/compute.ts',
  'program-performance/types.ts',
  'program-performance/compute.ts',
  'multi-year-framework/types.ts',
  'multi-year-framework/compute.ts',
  'contingent-liabilities/types.ts',
  'contingent-liabilities/compute.ts',
  'fiscal-transparency/types.ts',
  'fiscal-transparency/compute.ts',
  'reconciliation/reconcile.ts',
  'fiscal-outcomes/react/FiscalOutcomesInspector.tsx',
  'fiscal-outcomes/self-tests.ts',
  'reconciliation/self-tests.ts',
  'recurring-commitments/self-tests.ts',
  'fiscal-resilience/self-tests.ts',
  'debt-rollover/self-tests.ts',
  'budget-lines/self-tests.ts',
  'federal-state/self-tests.ts',
  'tax-expenditure/self-tests.ts',
  'medium-term-outlook/self-tests.ts',
  'consolidated-fiscal/self-tests.ts',
  'fiscal-rules/self-tests.ts',
  'sovereign-issuance/self-tests.ts',
  'program-performance/self-tests.ts',
  'multi-year-framework/self-tests.ts',
  'contingent-liabilities/self-tests.ts',
  'fiscal-transparency/self-tests.ts',
  'infrastructure-financing/self-tests.ts',
  'revenue-ledger/self-tests.ts',
  'fiscal-risk-register/self-tests.ts',
  'intergovernmental-grants/self-tests.ts',
  'statutory-balances/self-tests.ts',
  'cost-recovery-pricing/self-tests.ts',
  'cash-management/self-tests.ts',
  'appropriation-warrants/self-tests.ts',
  'supplementary-estimates/self-tests.ts',
  'spending-offsets/self-tests.ts',
  'portfolio-outturn/self-tests.ts',
  'debt-portfolio-governance/self-tests.ts',
  'fiscal-stress-scenarios/self-tests.ts',
  'public-sector-balance-sheet/self-tests.ts',
  'tax-policy-sensitivity/self-tests.ts',
  'appropriation-lapse-register/self-tests.ts',
  'contingency-drawdown/self-tests.ts',
  'forward-estimates-integrity/self-tests.ts',
  'sovereign-credit-outlook/self-tests.ts',
  'debt-service-coverage/self-tests.ts',
  'grant-clawback-schedule/self-tests.ts',
  'budget-neutral-packages/self-tests.ts',
  'infrastructure-fiscal-load/self-tests.ts',
  'revenue-integrity-audit/self-tests.ts',
  'appropriation-carry-forward/self-tests.ts',
  'expenditure-growth-benchmark/self-tests.ts',
  'efficiency-dividend-register/self-tests.ts',
  'revenue-forward-reconciliation/self-tests.ts',
  'portfolio-reprioritisation-ledger/self-tests.ts',
  'fiscal-buffer-coherence/self-tests.ts',
  'medium-term-revenue-anchor/self-tests.ts',
  'appropriation-timing-coherence/self-tests.ts',
  'debt-fiscal-coupling-register/self-tests.ts',
  'grant-forward-alignment/self-tests.ts',
  'infrastructure-envelope-coherence/self-tests.ts',
  'fiscal-stress-resilience-bridge/self-tests.ts',
  'revenue-integrity-forward-bridge/self-tests.ts',
  'budget-neutral-forward-coherence/self-tests.ts',
  'program-performance-fiscal-bridge/self-tests.ts',
  'transparency-forward-coherence/self-tests.ts',
  'contingent-liability-forward-bridge/self-tests.ts',
  'cost-recovery-revenue-coherence/self-tests.ts',
  'grant-clawback-forward-coherence/self-tests.ts',
  'balance-sheet-fiscal-coherence/self-tests.ts'
];

function stripModulePreamble(source) {
  return source
    .split('\n')
    .filter(line => {
      const t = line.trim();
      if (t.startsWith('import ')) return false;
      if (t.startsWith('export * from')) return false;
      return true;
    })
    .join('\n');
}

const parts = [
  `// OP10M_MODULE_BEGIN ${MODULE_ID}`,
  '// Agent 07 — public finance & taxation (generated; source: operation-10m/agent-07-public-finance/modules/)',
  ''
];

for (const rel of FILES) {
  const abs = path.join(srcRoot, rel);
  if (!fs.existsSync(abs)) {
    console.error('Missing source file:', rel);
    process.exit(1);
  }
  parts.push(`// --- source: ${rel} ---`);
  parts.push(stripModulePreamble(fs.readFileSync(abs, 'utf8')));
  parts.push('');
}

parts.push(`// OP10M_MODULE_END ${MODULE_ID}`);
parts.push('');

fs.mkdirSync(outDir, { recursive: true });
const body = parts.join('\n');
fs.writeFileSync(outFile, body);
console.log('Wrote', outFile, `(${body.split('\n').length} lines)`);
