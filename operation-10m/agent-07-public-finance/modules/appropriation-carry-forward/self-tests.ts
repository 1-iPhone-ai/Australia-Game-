import { buildAppropriationWarrantLedger } from '../appropriation-warrants/compute';
import { buildAppropriationLapseRegisterReport } from '../appropriation-lapse-register/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildAppropriationCarryForwardReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 4,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function bundle(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  const warrantLedger = buildAppropriationWarrantLedger(turn, v1012);
  const lapseRegister = buildAppropriationLapseRegisterReport(turn, v1012, warrantLedger);
  return { state, warrantLedger, lapseRegister };
}

export function runAppropriationCarryForwardSelfTests(): {
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
  const { state, warrantLedger, lapseRegister } = bundle(11, v);
  const healthy = buildAppropriationCarryForwardReport(11, v, state.budget, lapseRegister, warrantLedger);

  record('ACF01', 'At least one carry-forward line', healthy.lines.length >= 1, 'ok');
  record('ACF02', 'Within portfolio carry cap', healthy.withinPortfolioCarryCap, healthy.narrative);
  record('ACF03', 'Aligned with lapse register', healthy.alignedWithLapseRegister, 'ok');
  record('ACF04', 'Carry ratio bounded', healthy.carryToEnvelopeRatio <= 0.2, `ratio=${healthy.carryToEnvelopeRatio}`);

  const strained = buildAppropriationCarryForwardReport(
    11,
    snap({ pressure: 'strained', fiscalHeadroom: -4 }),
    bundle(11, snap({ pressure: 'strained', fiscalHeadroom: -4 })).state.budget,
    bundle(11, snap({ pressure: 'strained', fiscalHeadroom: -4 })).lapseRegister,
    bundle(11, snap({ pressure: 'strained', fiscalHeadroom: -4 })).warrantLedger
  );
  record('ACF05', 'Strained snapshot runs carry report', strained.lines.length >= 1, `cap=${strained.withinPortfolioCarryCap}`);

  const critical = buildAppropriationCarryForwardReport(
    11,
    snap({ pressure: 'critical' }),
    state.budget,
    lapseRegister,
    warrantLedger
  );
  record('ACF06', 'Critical override path', critical.withinPortfolioCarryCap || critical.alignedWithLapseRegister, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
