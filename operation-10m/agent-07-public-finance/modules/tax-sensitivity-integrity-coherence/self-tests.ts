import { buildRevenueIntegrityAuditReport } from '../revenue-integrity-audit/compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildTaxSensitivityIntegrityCoherenceReport } from './compute';
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

export function runTaxSensitivityIntegrityCoherenceSelfTests(): {
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
  const healthy = buildTaxSensitivityIntegrityCoherenceReport(9, v, taxSensitivity, integrityAudit);

  record('TSIC-T01', 'Three tax sensitivity integrity checks', healthy.checks.length === 3, 'ok');
  record(
    'TSIC-T02',
    'Within tax sensitivity integrity band',
    healthy.withinTaxSensitivityIntegrityBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'TSIC-T03',
    'Aligned with integrity audit',
    healthy.alignedWithIntegrityAudit,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
