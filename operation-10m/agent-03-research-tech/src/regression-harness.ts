import { computeResearchProgress, type ResearchProgressInputs } from './compute.ts';
import { createEmptyResearchProgressState } from './compute.ts';
import type { ResearchProgressState } from './types.ts';

export interface ResearchRegressionStep {
  turn: number;
  unlockedCount: number;
  synergyScore: number;
  persistRevision: number;
}

export interface ResearchRegressionResult {
  steps: ResearchRegressionStep[];
  monotonicUnlocks: boolean;
  monotonicPersistRevision: boolean;
}

/** Multi-turn deterministic harness for Agent 25 integration smoke. */
export function runResearchProgressRegressionHarness(
  baseInputs: ResearchProgressInputs,
  turns: number[]
): ResearchRegressionResult {
  let state: ResearchProgressState | null = null;
  const steps: ResearchRegressionStep[] = [];
  let prevUnlocks = 0;
  let prevPersist = 0;
  let monotonicUnlocks = true;
  let monotonicPersistRevision = true;

  for (const turn of turns) {
    const inputs = { ...baseInputs, turn };
    state = computeResearchProgress(inputs, state ?? createEmptyResearchProgressState(turn));
    const unlocks = state.unlockedNodes.length;
    if (unlocks < prevUnlocks) monotonicUnlocks = false;
    prevUnlocks = unlocks;
    const persistRev = state.persistRevision ?? 0;
    if (persistRev < prevPersist) monotonicPersistRevision = false;
    prevPersist = persistRev;
    steps.push({
      turn,
      unlockedCount: unlocks,
      synergyScore: state.scaleWave?.crossBranchSynergyScore ?? 0,
      persistRevision: persistRev,
    });
  }

  return { steps, monotonicUnlocks, monotonicPersistRevision };
}
