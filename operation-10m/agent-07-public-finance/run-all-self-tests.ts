#!/usr/bin/env npx tsx
import { runV1014FiscalOutcomesSelfTests } from './modules/fiscal-outcomes/self-tests';
import { runAgent07ReconciliationSelfTests } from './modules/reconciliation/self-tests';
import { runRecurringCommitmentsSelfTests } from './modules/recurring-commitments/self-tests';
import { runFiscalResilienceSelfTests } from './modules/fiscal-resilience/self-tests';
import { runDebtRolloverSelfTests } from './modules/debt-rollover/self-tests';

function runSuite(name: string, fn: () => { passed: number; total: number; allPassed: boolean }) {
  const res = fn();
  console.log(`\n=== ${name} ===`);
  console.log(`${res.passed}/${res.total} passed${res.allPassed ? '' : ' (FAILURES)'}`);
  return res.allPassed;
}

let ok = true;
ok = runSuite('V10.14 fiscal outcomes', runV1014FiscalOutcomesSelfTests) && ok;
ok = runSuite('Recurring commitments', runRecurringCommitmentsSelfTests) && ok;
ok = runSuite('Fiscal resilience shocks', runFiscalResilienceSelfTests) && ok;
ok = runSuite('Debt rollover edge cases', runDebtRolloverSelfTests) && ok;
ok = runSuite('Agent 07 reconciliation', runAgent07ReconciliationSelfTests) && ok;

process.exit(ok ? 0 : 1);
