import { buildTaxPolicySensitivityReport } from './compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function ledgerFor(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  return buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
}

export function runTaxPolicySensitivitySelfTests(): {
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
  const healthy = buildTaxPolicySensitivityReport(12, v, ledgerFor(12, v));
  record('TPS01', 'Four tax policy sensitivity levers', healthy.lines.length === 4, 'ok');
  record('TPS02', 'Healthy within aggregate band', healthy.withinAggregateBand, healthy.narrative);
  record('TPS03', 'Ledger coherence under healthy', healthy.coherentWithLedgerDelta, 'ok');

  const focused = buildTaxPolicySensitivityReport(12, snap({ revenuePolicy: 'revenue_focused' }), ledgerFor(12, snap({ revenuePolicy: 'revenue_focused' })));
  record(
    'TPS04',
    'Revenue-focused policy shifts aggregate marginal',
    focused.aggregateMarginalPoints !== healthy.aggregateMarginalPoints,
    `${focused.aggregateMarginalPoints} vs ${healthy.aggregateMarginalPoints}`
  );

  const critical = buildTaxPolicySensitivityReport(12, snap({ pressure: 'critical', fiscalHeadroom: -22 }), ledgerFor(12, snap({ pressure: 'critical' })));
  record('TPS05', 'Critical overrides aggregate band', critical.withinAggregateBand, 'ok');

  record(
    'TPS06',
    'Each lever within sensitivity band after guard',
    healthy.lines.every(l => l.withinSensitivityBand),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
