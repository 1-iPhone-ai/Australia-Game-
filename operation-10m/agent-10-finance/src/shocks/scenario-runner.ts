import { getShockById, applyShockDeltasToScores } from './catalog.js';
import { finClamp } from '../compute/math.js';

export interface ShockSequenceResult {
  scores: { inflation: number; credit: number; stability: number };
  creditShockActive: boolean;
  appliedShockIds: string[];
  skippedShockIds: string[];
}

/** Applies shock catalog entries in order with score clamping — simulation helper only. */
export function runFinancialShockSequence(
  initial: { inflation: number; credit: number; stability: number },
  shockIds: string[],
): ShockSequenceResult {
  let scores = { ...initial };
  let creditShockActive = false;
  const appliedShockIds: string[] = [];
  const skippedShockIds: string[] = [];
  for (const id of shockIds) {
    const shock = getShockById(id);
    if (!shock) {
      skippedShockIds.push(id);
      continue;
    }
    const next = applyShockDeltasToScores(scores, shock);
    scores = {
      inflation: finClamp(next.inflation, 0, 100),
      credit: finClamp(next.credit, 0, 100),
      stability: finClamp(next.stability, 0, 100),
    };
    creditShockActive = creditShockActive || next.creditShockActive;
    appliedShockIds.push(id);
  }
  return { scores, creditShockActive, appliedShockIds, skippedShockIds };
}
