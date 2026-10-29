import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppropriationWarrantLedger, AppropriationWarrantLine, WarrantStatus } from './types';
import { APPROPRIATION_WARRANTS_SCHEMA } from './types';

const BASE_PORTFOLIOS: Array<{ portfolio: string; share: number }> = [
  { portfolio: 'social_services', share: 0.32 },
  { portfolio: 'infrastructure', share: 0.22 },
  { portfolio: 'defence', share: 0.14 },
  { portfolio: 'health', share: 0.18 },
  { portfolio: 'education', share: 0.14 }
];

function statusFromRemaining(ratio: number, lapseRisk: number): WarrantStatus {
  if (lapseRisk >= ratio * 0.45) return 'fully_lapsed';
  if (lapseRisk >= ratio * 0.2) return 'partially_lapsed';
  if (lapseRisk >= ratio * 0.08) return 'reallocated';
  return 'open';
}

export function buildAppropriationWarrantLedger(turn: number, v1012: V1012FiscalSnapshot): AppropriationWarrantLedger {
  const envelopeCapacity = v1012.revenueCapacity * 0.55 + Math.max(0, v1012.fiscalHeadroom) * 0.4;
  const pressureLapseScale =
    v1012.pressure === 'critical' ? 1.35 : v1012.pressure === 'strained' ? 1.15 : v1012.pressure === 'tight' ? 1.05 : 1;
  const turnPhase = turn % 12 >= 9 ? 1.2 : 1;

  const lines: AppropriationWarrantLine[] = BASE_PORTFOLIOS.map((row, idx) => {
    const appropriationPoints = Math.round(envelopeCapacity * row.share * 10) / 10;
    const issuedRatio = 0.72 + ((turn + idx) % 5) * 0.04;
    const warrantIssuedPoints = Math.round(appropriationPoints * issuedRatio * 10) / 10;
    const warrantRemainingPoints = Math.round((appropriationPoints - warrantIssuedPoints) * 10) / 10;
    const lapseRiskPoints =
      Math.round(Math.max(0, warrantRemainingPoints * 0.35 * pressureLapseScale * turnPhase) * 10) / 10;
    const status = statusFromRemaining(
      warrantRemainingPoints / Math.max(1, appropriationPoints),
      lapseRiskPoints
    );
    const withinTolerance =
      lapseRiskPoints <= appropriationPoints * 0.12 || v1012.pressure === 'critical' || status === 'open';
    return {
      warrantId: `warrant_${row.portfolio}`,
      portfolio: row.portfolio,
      appropriationPoints,
      warrantIssuedPoints,
      warrantRemainingPoints,
      lapseRiskPoints,
      status,
      withinTolerance
    };
  });

  const aggregateAppropriation = lines.reduce((s, l) => s + l.appropriationPoints, 0);
  const aggregateRemaining = lines.reduce((s, l) => s + l.warrantRemainingPoints, 0);
  const aggregateLapseRisk = lines.reduce((s, l) => s + l.lapseRiskPoints, 0);
  const reallocationCount = lines.filter(l => l.status === 'reallocated').length;

  const lapseTolerance = aggregateAppropriation * 0.1;
  const lapseWithinTolerance =
    aggregateLapseRisk <= lapseTolerance || v1012.pressure === 'critical';

  const warnings: string[] = [];
  const outOfTolerance = lines.filter(l => !l.withinTolerance);
  if (outOfTolerance.length >= 2) {
    warnings.push(`${outOfTolerance.length} warrant lines exceed per-portfolio lapse tolerance.`);
  }
  if (!lapseWithinTolerance) {
    warnings.push(`Aggregate lapse risk ${aggregateLapseRisk} above tolerance ${lapseTolerance.toFixed(1)}.`);
  }

  const narrative = lapseWithinTolerance
    ? `Warrant ledger reconciled; ${aggregateRemaining.toFixed(1)} points unissued with controlled lapse risk.`
    : `Appropriation lapse pressure: aggregate risk ${aggregateLapseRisk.toFixed(1)}.`;

  return {
    schemaVersion: APPROPRIATION_WARRANTS_SCHEMA,
    turn,
    lines,
    aggregateAppropriation,
    aggregateRemaining,
    aggregateLapseRisk,
    lapseWithinTolerance,
    reallocationCount,
    narrative,
    warnings
  };
}
