import { buildNationalRevenueLedger } from './compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 58,
    fiscalHeadroom: partial.fiscalHeadroom ?? 3,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 19,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 2,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runRevenueLedgerSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v1012 = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(8);
  const { state } = computeFiscalOutcomesLayer({ turn: 8, v1012 }, persisted);
  const ledger = buildNationalRevenueLedger({ turn: 8, v1012, taxInstruments: state.taxInstruments });

  record('RL01', 'Streams mirror tax instruments', ledger.streams.length >= state.taxInstruments.length, `streams=${ledger.streams.length}`);
  record('RL02', 'Reconciled under balanced policy', ledger.reconciledToV1012, ledger.reconciliationNotes[0] ?? '');
  record('RL03', 'Structural capacity matches V10.12', ledger.structuralCapacity === v1012.revenueCapacity, 'ok');

  const focused = buildNationalRevenueLedger({
    turn: 8,
    v1012: snap({ revenuePolicy: 'revenue_focused' }),
    taxInstruments: state.taxInstruments
  });
  record('RL04', 'Revenue-focused policy adds dividend stream', focused.streams.some(s => s.id === 'stream_policy_dividend'), 'ok');
  record('RL05', 'Total delta aggregates stream deltas', focused.totalDelta === focused.streams.reduce((s, l) => s + l.deltaPoints, 0), `delta=${focused.totalDelta}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
