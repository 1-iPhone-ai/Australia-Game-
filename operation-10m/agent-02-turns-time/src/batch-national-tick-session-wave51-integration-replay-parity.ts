import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  sealBatchNationalTickSessionWave51Integration,
  type BatchNationalTickSessionWave51IntegrationSealResult,
} from './batch-national-tick-session-wave51-integration-seal.js';

export interface BatchNationalTickSessionWave51IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave51IntegrationSealResult;
  replay: BatchNationalTickSessionWave51IntegrationSealResult;
}

/**
 * Round 51 wave 51: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-232 baseline pin.
 */
export function verifyBatchNationalTickSessionWave51IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave51IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave51Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave51Integration(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.sealDigest === replay.sealDigest &&
    baseline.commit.commitDigest === replay.commit.commitDigest &&
    baseline.ok === replay.ok &&
    baseline.baselineSha === replay.baselineSha &&
    baseline.projectedLoc === replay.projectedLoc;
  return { parityOk, baseline, replay };
}
