import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildMediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildRevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/compute';
import { buildRevenueIntegrityAuditReport } from '../revenue-integrity-audit/compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildRevenueIntegrityOutlookBridgeReport } from './compute';
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

export function runRevenueIntegrityOutlookBridgeSelfTests(): {
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
  const taxSensitivity = buildTaxPolicySensitivityReport(9, v, ledger);
  const integrityAudit = buildRevenueIntegrityAuditReport(9, v, ledger, taxSensitivity);
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const revenueForward = buildRevenueForwardReconciliationReport(9, v, ledger, myefo, growth);
  const revenueAnchor = buildMediumTermRevenueAnchorReport(9, v, outlook, revenueForward, growth);
  const healthy = buildRevenueIntegrityOutlookBridgeReport(9, v, integrityAudit, revenueAnchor, outlook);

  record('RIOB-T01', 'Three revenue integrity outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'RIOB-T02',
    'Within revenue integrity outlook band',
    healthy.withinRevenueIntegrityOutlookBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'RIOB-T03',
    'Aligned with revenue anchor',
    healthy.alignedWithRevenueAnchor,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
