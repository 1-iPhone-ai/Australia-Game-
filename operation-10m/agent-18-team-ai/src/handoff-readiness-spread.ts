import { HandoffReadinessReport } from './handoff-readiness-scorer.ts';

export interface HandoffReadinessSpreadReport {
  spreadIndex: number;
  notes: string[];
}

/**
 * Measure dispersion of pending handoff readiness scores (uneven acceptance capacity).
 */
export function computeHandoffReadinessSpread(
  report: HandoffReadinessReport,
): HandoffReadinessSpreadReport {
  const notes: string[] = [];
  const scores = report.rows.map(r => r.readinessScore);
  if (scores.length < 2) {
    return { spreadIndex: 0, notes: ['Insufficient pending handoffs for spread'] };
  }

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const spread = max - min;
  if (spread >= 35) {
    notes.push(`Handoff readiness spread ${spread} (${min}–${max})`);
  }

  const spreadIndex = Math.round(Math.min(100, spread * 1.4 + (report.notReadyHandoffIds.length > 0 ? 12 : 0)));

  return { spreadIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHandoffReadinessSpread(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
