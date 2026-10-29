import type { V1012FiscalSnapshot, BudgetEnvelope } from '../fiscal-outcomes/types';
import type { AppropriationLapseRegisterReport } from '../appropriation-lapse-register/types';
import type { AppropriationWarrantLedger } from '../appropriation-warrants/types';
import type { AppropriationCarryForwardReport, CarryForwardLine } from './types';
import { APPROPRIATION_CARRY_FORWARD_SCHEMA } from './types';

const CARRY_RATIO_CAP = 0.16;

export function buildAppropriationCarryForwardReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  envelope: BudgetEnvelope,
  lapseRegister: AppropriationLapseRegisterReport,
  warrantLedger: AppropriationWarrantLedger
): AppropriationCarryForwardReport {
  const envelopeCapacity = envelope.totalCapacityPoints;
  const yearEnd = turn % 12 >= 10;

  const lines: CarryForwardLine[] = lapseRegister.entries.map(entry => {
    const carryFactor = entry.disposition === 'reallocated' ? 0.62 : entry.disposition === 'pending_review' ? 0.38 : 0.22;
    const carryForwardPoints =
      Math.round((entry.lapsePoints * carryFactor * (yearEnd ? 1.05 : 0.94)) * 10) / 10;
    const envelopeShare =
      envelopeCapacity <= 0 ? 0 : Math.round((carryForwardPoints / envelopeCapacity) * 1000) / 1000;
    const withinLineCap =
      envelopeShare <= 0.045 || entry.withinEntryTolerance || v1012.pressure === 'critical';
    return {
      id: `cf_${entry.portfolio}`,
      portfolio: entry.portfolio,
      carryForwardPoints,
      sourceLapsePoints: entry.lapsePoints,
      envelopeShare,
      withinLineCap
    };
  });

  let aggregateCarryForwardPoints = Math.round(lines.reduce((s, l) => s + l.carryForwardPoints, 0) * 10) / 10;
  const aggregateSourceLapsePoints = Math.round(
    lines.reduce((s, l) => s + l.sourceLapsePoints, 0) * 10
  ) / 10;

  if (v1012.pressure !== 'critical' && envelopeCapacity > 0) {
    const ratio = aggregateCarryForwardPoints / envelopeCapacity;
    if (ratio > CARRY_RATIO_CAP) {
      const scale = (CARRY_RATIO_CAP * envelopeCapacity) / Math.max(0.1, aggregateCarryForwardPoints);
      for (const line of lines) {
        line.carryForwardPoints = Math.round(line.carryForwardPoints * scale * 10) / 10;
        line.envelopeShare = Math.round((line.carryForwardPoints / envelopeCapacity) * 1000) / 1000;
      }
      aggregateCarryForwardPoints = Math.round(lines.reduce((s, l) => s + l.carryForwardPoints, 0) * 10) / 10;
    }
  }

  const carryToEnvelopeRatio =
    envelopeCapacity <= 0
      ? 0
      : Math.round((aggregateCarryForwardPoints / envelopeCapacity) * 1000) / 1000;

  const withinPortfolioCarryCap =
    carryToEnvelopeRatio <= CARRY_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && carryToEnvelopeRatio <= CARRY_RATIO_CAP * 1.12);

  const alignedWithLapseRegister =
    aggregateCarryForwardPoints <= aggregateSourceLapsePoints * 0.72 + 1.5 ||
    lapseRegister.withinRegisterTolerance ||
    warrantLedger.lapseWithinTolerance ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinPortfolioCarryCap) {
    warnings.push(`Carry-forward ratio ${carryToEnvelopeRatio} exceeds cap ${CARRY_RATIO_CAP}.`);
  }
  if (!alignedWithLapseRegister) {
    warnings.push(
      `Carry ${aggregateCarryForwardPoints} exceeds lapse-derived pool ${aggregateSourceLapsePoints}.`
    );
  }

  const narrative = withinPortfolioCarryCap
    ? `Appropriation carry-forward ${aggregateCarryForwardPoints} (${carryToEnvelopeRatio} of envelope).`
    : `Carry-forward alert: ratio ${carryToEnvelopeRatio}.`;

  return {
    schemaVersion: APPROPRIATION_CARRY_FORWARD_SCHEMA,
    turn,
    lines,
    aggregateCarryForwardPoints,
    aggregateSourceLapsePoints,
    carryToEnvelopeRatio,
    withinPortfolioCarryCap,
    alignedWithLapseRegister,
    narrative,
    warnings
  };
}
