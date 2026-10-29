import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppropriationCarryForwardReport } from '../appropriation-carry-forward/types';
import type { AppropriationLapseRegisterReport } from '../appropriation-lapse-register/types';
import type { AppropriationWarrantLedger } from '../appropriation-warrants/types';
import type { LapseCarryCheck, LapseCarryWarrantCoherenceReport } from './types';
import { LAPSE_CARRY_WARRANT_COHERENCE_SCHEMA } from './types';

const LAPSE_CARRY_TOLERANCE = 6.1;

export function buildLapseCarryWarrantCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  lapseRegister: AppropriationLapseRegisterReport,
  carryForward: AppropriationCarryForwardReport,
  warrantLedger: AppropriationWarrantLedger
): LapseCarryWarrantCoherenceReport {
  const carryGap = Math.abs(
    carryForward.aggregateSourceLapsePoints - lapseRegister.aggregateLapsePoints * 0.88
  );
  const warrantGap = Math.abs(warrantLedger.aggregateLapseRisk - lapseRegister.aggregateLapsePoints * 0.24);
  const aggregateCoherenceGapPoints = Math.round((carryGap + warrantGap) * 10) / 20;

  const checks: LapseCarryCheck[] = [
    {
      id: 'LCWC01',
      label: 'Lapse register within tolerance',
      passed: lapseRegister.withinRegisterTolerance || v1012.pressure === 'critical',
      detail: `ratio=${lapseRegister.lapseToRemainingRatio}, lapse=${lapseRegister.aggregateLapsePoints}`
    },
    {
      id: 'LCWC02',
      label: 'Carry-forward within portfolio cap',
      passed: carryForward.withinPortfolioCarryCap || v1012.pressure === 'critical',
      detail: `carry=${carryForward.aggregateCarryForwardPoints}, ratio=${carryForward.carryToEnvelopeRatio}`
    },
    {
      id: 'LCWC03',
      label: 'Lapse vs carry source alignment',
      passed:
        carryGap <= LAPSE_CARRY_TOLERANCE + 2 ||
        carryForward.alignedWithLapseRegister ||
        v1012.pressure === 'critical',
      detail: `carryGap=${carryGap}, source=${carryForward.aggregateSourceLapsePoints}`
    }
  ];

  const withinLapseCarryBand =
    checks.every(c => c.passed) ||
    (lapseRegister.withinRegisterTolerance && carryForward.withinPortfolioCarryCap) ||
    v1012.pressure === 'critical';

  const alignedWithWarrantLedger =
    lapseRegister.alignedWithWarrantLedger &&
    (aggregateCoherenceGapPoints <= warrantLedger.aggregateLapseRisk + 2.5 ||
      warrantLedger.lapseWithinTolerance ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinLapseCarryBand) {
    warnings.push(`Lapse carry warrant gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithWarrantLedger) {
    warnings.push('Lapse carry coherence diverges from warrant ledger.');
  }

  const narrative = withinLapseCarryBand
    ? `Lapse carry warrant gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Lapse carry warrant alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: LAPSE_CARRY_WARRANT_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinLapseCarryBand,
    alignedWithWarrantLedger,
    narrative,
    warnings
  };
}
