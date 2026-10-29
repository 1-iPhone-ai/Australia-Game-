import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildCashManagementReport } from '../cash-management/compute';
import { buildCostRecoveryStatement } from '../cost-recovery-pricing/compute';
import { buildCostRecoveryRevenueCoherenceReport } from '../cost-recovery-revenue-coherence/compute';
import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildFiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildContingencyDrawdownRegisterReport } from '../contingency-drawdown/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildRevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/compute';
import { buildRevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/compute';
import { buildMediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/compute';
import { buildRevenueIntegrityAuditReport } from '../revenue-integrity-audit/compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildCostRecoveryFiscalBufferBridgeReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runCostRecoveryFiscalBufferBridgeSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(9);
  const { state } = computeFiscalOutcomesLayer({ turn: 9, v1012: v }, persisted);
  const ledger = buildNationalRevenueLedger({ turn: 9, v1012: v, taxInstruments: state.taxInstruments });
  const costRecovery = buildCostRecoveryStatement(9, v);
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const revenueForward = buildRevenueForwardReconciliationReport(9, v, ledger, myefo, growth);
  const statutory = buildStatutoryBalancesReport(9, v);
  const cash = buildCashManagementReport(9, v);
  const contingencyFlex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const fiscalRules = assessFiscalRulesFramework({
    turn: 9,
    v1012: v,
    envelopeContingencyPoints: contingencyFlex,
    forwardSpendingGrowth: 2
  });
  const contingency = buildContingencyDrawdownRegisterReport(9, v, contingencyFlex, fiscalRules);
  const fiscalBuffer = buildFiscalBufferCoherenceReport(9, v, statutory, cash, contingency, revenueForward);
  const taxSensitivity = buildTaxPolicySensitivityReport(9, v, ledger);
  const revenueAudit = buildRevenueIntegrityAuditReport(9, v, ledger, taxSensitivity);
  const revenueAnchor = buildMediumTermRevenueAnchorReport(9, v, outlook, revenueForward, growth);
  const integrityForward = buildRevenueIntegrityForwardBridgeReport(
    9,
    v,
    revenueAudit,
    revenueForward,
    revenueAnchor
  );
  const recoveryRevenue = buildCostRecoveryRevenueCoherenceReport(
    9,
    v,
    costRecovery,
    ledger,
    integrityForward
  );
  const healthy = buildCostRecoveryFiscalBufferBridgeReport(9, v, costRecovery, fiscalBuffer, recoveryRevenue);

  record('CRFBB-T01', 'Three recovery buffer checks', healthy.checks.length === 3, 'ok');
  record(
    'CRFBB-T02',
    'Within recovery buffer band',
    healthy.withinRecoveryBufferBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'CRFBB-T03',
    'Aligned with recovery revenue coherence',
    healthy.alignedWithRecoveryRevenueCoherence,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
