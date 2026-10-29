import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppropriationWarrantLedger } from '../appropriation-warrants/types';
import type { AppropriationLapseEntry, AppropriationLapseRegisterReport, LapseDisposition } from './types';
import { APPROPRIATION_LAPSE_REGISTER_SCHEMA } from './types';

const REGISTER_RATIO_CAP = 0.53;

function dispositionFromLapse(lapse: number, remaining: number): LapseDisposition {
  if (lapse <= remaining * 0.08) return 'pending_review';
  if (lapse <= remaining * 0.22) return 'reallocated';
  if (lapse <= remaining * 0.38) return 'returned_to_reserve';
  return 'lapsed';
}

export function buildAppropriationLapseRegisterReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  warrantLedger: AppropriationWarrantLedger
): AppropriationLapseRegisterReport {
  const yearEnd = turn % 12 >= 10;

  const entries: AppropriationLapseEntry[] = warrantLedger.lines.map(line => {
    const lapsePoints =
      Math.round((line.lapseRiskPoints * (yearEnd ? 1.12 : 0.92) + line.warrantRemainingPoints * 0.04) * 10) / 10;
    const disposition = dispositionFromLapse(lapsePoints, Math.max(0.1, line.warrantRemainingPoints));
    const withinEntryTolerance =
      lapsePoints <= line.appropriationPoints * 0.14 ||
      line.withinTolerance ||
      v1012.pressure === 'critical';
    return {
      id: `lapse_${line.portfolio}`,
      portfolio: line.portfolio,
      warrantRemainingPoints: line.warrantRemainingPoints,
      lapsePoints,
      disposition,
      withinEntryTolerance
    };
  });

  let aggregateLapsePoints = Math.round(entries.reduce((s, e) => s + e.lapsePoints, 0) * 10) / 10;
  const aggregateRemainingPoints = Math.round(
    entries.reduce((s, e) => s + e.warrantRemainingPoints, 0) * 10
  ) / 10;

  if (v1012.pressure !== 'critical' && aggregateRemainingPoints > 0) {
    const ratio = aggregateLapsePoints / aggregateRemainingPoints;
    if (ratio > REGISTER_RATIO_CAP) {
      const scale = (REGISTER_RATIO_CAP * aggregateRemainingPoints) / Math.max(0.1, aggregateLapsePoints);
      for (const entry of entries) {
        entry.lapsePoints = Math.round(entry.lapsePoints * scale * 10) / 10;
      }
      aggregateLapsePoints = Math.round(entries.reduce((s, e) => s + e.lapsePoints, 0) * 10) / 10;
    }
    const maxLapse = REGISTER_RATIO_CAP * aggregateRemainingPoints;
    if (aggregateLapsePoints > maxLapse) {
      const fix = maxLapse / Math.max(0.1, aggregateLapsePoints);
      for (const entry of entries) {
        entry.lapsePoints = Math.round(entry.lapsePoints * fix * 10) / 10;
      }
      aggregateLapsePoints = Math.round(entries.reduce((s, e) => s + e.lapsePoints, 0) * 10) / 10;
    }
  }

  const lapseToRemainingRatio =
    aggregateRemainingPoints <= 0
      ? 0
      : Math.round((aggregateLapsePoints / aggregateRemainingPoints) * 1000) / 1000;

  const withinRegisterTolerance =
    lapseToRemainingRatio <= REGISTER_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && lapseToRemainingRatio <= REGISTER_RATIO_CAP * 1.08);

  const alignedWithWarrantLedger =
    Math.abs(aggregateLapsePoints - warrantLedger.aggregateLapseRisk) <=
      warrantLedger.aggregateRemaining * 0.22 + 2.5 ||
    v1012.pressure === 'critical' ||
    warrantLedger.lapseWithinTolerance;

  const warnings: string[] = [];
  if (!withinRegisterTolerance) {
    warnings.push(`Lapse ratio ${lapseToRemainingRatio} exceeds cap ${REGISTER_RATIO_CAP}.`);
  }
  if (!alignedWithWarrantLedger) {
    warnings.push(
      `Register lapse ${aggregateLapsePoints} misaligned with warrant risk ${warrantLedger.aggregateLapseRisk}.`
    );
  }

  const narrative = withinRegisterTolerance
    ? `Appropriation lapse register: ${aggregateLapsePoints} pts against ${aggregateRemainingPoints} remaining.`
    : `Lapse register alert: ratio ${lapseToRemainingRatio}.`;

  return {
    schemaVersion: APPROPRIATION_LAPSE_REGISTER_SCHEMA,
    turn,
    entries,
    aggregateLapsePoints,
    aggregateRemainingPoints,
    lapseToRemainingRatio,
    withinRegisterTolerance,
    alignedWithWarrantLedger,
    narrative,
    warnings
  };
}
