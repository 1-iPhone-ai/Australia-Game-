import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { scoreFiscalTransparencyIndex } from '../fiscal-transparency/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildMediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildRevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/compute';
import { buildRevenueIntegrityAuditReport } from '../revenue-integrity-audit/compute';
import { buildRevenueIntegrityForwardBridgeReport } from '../revenue-integrity-forward-bridge/compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildTransparencyForwardCoherenceReport } from './compute';
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

export function runTransparencyForwardCoherenceSelfTests(): {
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
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const revenueForward = buildRevenueForwardReconciliationReport(9, v, ledger, myefo, growth);
  const taxSensitivity = buildTaxPolicySensitivityReport(9, v, ledger);
  const integrity = buildRevenueIntegrityAuditReport(9, v, ledger, taxSensitivity);
  const anchor = buildMediumTermRevenueAnchorReport(9, v, outlook, revenueForward, growth);
  const integrityBridge = buildRevenueIntegrityForwardBridgeReport(9, v, integrity, revenueForward, anchor);
  const transparency = scoreFiscalTransparencyIndex({
    turn: 9,
    v1012: v,
    publishesTaxExpenditure: true,
    publishesMultiYearEstimates: true,
    publishesContingentRegister: true,
    publishesProgramOutcomes: true,
    auditLagTurns: 2
  });
  const healthy = buildTransparencyForwardCoherenceReport(9, v, transparency, forwardIntegrity, integrityBridge);

  record('TFC-T01', 'Three coherence checks', healthy.checks.length === 3, 'ok');
  record(
    'TFC-T02',
    'Within transparency forward band',
    healthy.withinTransparencyForwardBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'TFC-T03',
    'Aligned with integrity bridge',
    healthy.alignedWithIntegrityBridge,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
