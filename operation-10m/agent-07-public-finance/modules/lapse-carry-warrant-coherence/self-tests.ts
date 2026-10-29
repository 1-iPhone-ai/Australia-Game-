import { buildAppropriationCarryForwardReport } from '../appropriation-carry-forward/compute';
import { buildAppropriationLapseRegisterReport } from '../appropriation-lapse-register/compute';
import { buildAppropriationWarrantLedger } from '../appropriation-warrants/compute';
import { buildLapseCarryWarrantCoherenceReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';

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

export function runLapseCarryWarrantCoherenceSelfTests(): {
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
  const warrantLedger = buildAppropriationWarrantLedger(9, v);
  const lapseRegister = buildAppropriationLapseRegisterReport(9, v, warrantLedger);
  const carryForward = buildAppropriationCarryForwardReport(9, v, state.budget, lapseRegister, warrantLedger);
  const healthy = buildLapseCarryWarrantCoherenceReport(9, v, lapseRegister, carryForward, warrantLedger);

  record('LCWC-T01', 'Three lapse carry checks', healthy.checks.length === 3, 'ok');
  record(
    'LCWC-T02',
    'Within lapse carry band',
    healthy.withinLapseCarryBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'LCWC-T03',
    'Aligned with warrant ledger',
    healthy.alignedWithWarrantLedger,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
