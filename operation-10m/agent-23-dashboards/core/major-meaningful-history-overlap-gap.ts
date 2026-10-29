import type { LivingRegionsWorldView, NationalSystemsState } from '../types.ts';

export interface NrDashMajorMeaningfulHistoryOverlapGap {
  nsEntryCount: number;
  majorMeaningfulCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major or meaningful derived events. */
export function nrDashBuildMajorMeaningfulHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMajorMeaningfulHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const pipelineTurns =
    lr?.state.derived
      .filter(d => d.significance === 'major' || d.significance === 'meaningful')
      .map(d => d.turn)
      .filter(t => Number.isFinite(t)) ?? [];
  if (!pipelineTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = pipelineTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...pipelineTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    majorMeaningfulCount: pipelineTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}
