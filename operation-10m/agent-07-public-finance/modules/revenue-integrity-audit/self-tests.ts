import { buildRevenueIntegrityAuditReport } from './compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 71,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 27,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function bundle(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  const ledger = buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
  const tax = buildTaxPolicySensitivityReport(turn, v1012, ledger);
  return { ledger, tax };
}

export function runRevenueIntegrityAuditSelfTests(): {
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
  const { ledger, tax } = bundle(12, v);
  const healthy = buildRevenueIntegrityAuditReport(12, v, ledger, tax);

  record('RIA01', 'Four integrity findings', healthy.findings.length === 4, 'ok');
  record('RIA02', 'Healthy audit passes', healthy.allPassed, healthy.narrative);
  record('RIA03', 'Coherent with tax sensitivity', healthy.coherentWithTaxSensitivity, 'ok');

  const tight = buildRevenueIntegrityAuditReport(
    12,
    snap({ fiscalHeadroom: -8, pressure: 'strained' }),
    bundle(12, snap({ fiscalHeadroom: -8, pressure: 'strained' })).ledger,
    bundle(12, snap({ fiscalHeadroom: -8, pressure: 'strained' })).tax
  );
  record('RIA04', 'Strained headroom still runs audit', tight.findings.length === 4, `passed=${tight.allPassed}`);

  const critical = buildRevenueIntegrityAuditReport(12, snap({ pressure: 'critical' }), ledger, tax);
  record('RIA05', 'Critical override path', critical.allPassed || critical.coherentWithTaxSensitivity, 'ok');

  record('RIA06', 'Delta gap non-negative', healthy.aggregateDeltaGap >= 0, `gap=${healthy.aggregateDeltaGap}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
