#!/usr/bin/env npx tsx
import { runV1014FiscalOutcomesSelfTests } from './modules/fiscal-outcomes/self-tests';
import { runAgent07ReconciliationSelfTests } from './modules/reconciliation/self-tests';
import { runRecurringCommitmentsSelfTests } from './modules/recurring-commitments/self-tests';
import { runFiscalResilienceSelfTests } from './modules/fiscal-resilience/self-tests';
import { runDebtRolloverSelfTests } from './modules/debt-rollover/self-tests';
import { runBudgetLinesSelfTests } from './modules/budget-lines/self-tests';
import { runFederalStateReconciliationSelfTests } from './modules/federal-state/self-tests';
import { runTaxExpenditureSelfTests } from './modules/tax-expenditure/self-tests';
import { runMediumTermOutlookSelfTests } from './modules/medium-term-outlook/self-tests';
import { runConsolidatedFiscalSelfTests } from './modules/consolidated-fiscal/self-tests';
import { runFiscalRulesSelfTests } from './modules/fiscal-rules/self-tests';
import { runSovereignIssuanceSelfTests } from './modules/sovereign-issuance/self-tests';
import { runProgramPerformanceSelfTests } from './modules/program-performance/self-tests';
import { runMultiYearFrameworkSelfTests } from './modules/multi-year-framework/self-tests';
import { runContingentLiabilitiesSelfTests } from './modules/contingent-liabilities/self-tests';
import { runFiscalTransparencySelfTests } from './modules/fiscal-transparency/self-tests';
import { runInfrastructureFinancingSelfTests } from './modules/infrastructure-financing/self-tests';
import { runRevenueLedgerSelfTests } from './modules/revenue-ledger/self-tests';
import { runFiscalRiskRegisterSelfTests } from './modules/fiscal-risk-register/self-tests';
import { runIntergovernmentalGrantsSelfTests } from './modules/intergovernmental-grants/self-tests';
import { runStatutoryBalancesSelfTests } from './modules/statutory-balances/self-tests';
import { runCostRecoveryPricingSelfTests } from './modules/cost-recovery-pricing/self-tests';
import { runCashManagementSelfTests } from './modules/cash-management/self-tests';
import { runAppropriationWarrantsSelfTests } from './modules/appropriation-warrants/self-tests';

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
ok = runSuite('Budget appropriation lines', runBudgetLinesSelfTests) && ok;
ok = runSuite('Federal–state IGR reconciliation', runFederalStateReconciliationSelfTests) && ok;
ok = runSuite('Tax expenditure statement', runTaxExpenditureSelfTests) && ok;
ok = runSuite('Medium-term fiscal outlook', runMediumTermOutlookSelfTests) && ok;
ok = runSuite('Consolidated fiscal stack', runConsolidatedFiscalSelfTests) && ok;
ok = runSuite('Fiscal rules framework', runFiscalRulesSelfTests) && ok;
ok = runSuite('Sovereign debt issuance', runSovereignIssuanceSelfTests) && ok;
ok = runSuite('Program performance review', runProgramPerformanceSelfTests) && ok;
ok = runSuite('Multi-year expenditure framework', runMultiYearFrameworkSelfTests) && ok;
ok = runSuite('Contingent liabilities register', runContingentLiabilitiesSelfTests) && ok;
ok = runSuite('Fiscal transparency index', runFiscalTransparencySelfTests) && ok;
ok = runSuite('Infrastructure financing stacks', runInfrastructureFinancingSelfTests) && ok;
ok = runSuite('National revenue ledger', runRevenueLedgerSelfTests) && ok;
ok = runSuite('Fiscal risk register', runFiscalRiskRegisterSelfTests) && ok;
ok = runSuite('Intergovernmental grants', runIntergovernmentalGrantsSelfTests) && ok;
ok = runSuite('Statutory balances', runStatutoryBalancesSelfTests) && ok;
ok = runSuite('Cost recovery pricing', runCostRecoveryPricingSelfTests) && ok;
ok = runSuite('Treasury cash management', runCashManagementSelfTests) && ok;
ok = runSuite('Appropriation warrants', runAppropriationWarrantsSelfTests) && ok;
ok = runSuite('Agent 07 reconciliation', runAgent07ReconciliationSelfTests) && ok;

process.exit(ok ? 0 : 1);
