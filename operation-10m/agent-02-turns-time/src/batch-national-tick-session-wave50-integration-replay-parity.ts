import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  sealBatchNationalTickSessionWave50Integration,
  type BatchNationalTickSessionWave50IntegrationSealResult,
} from './batch-national-tick-session-wave50-integration-seal.js';

export interface BatchNationalTickSessionWave50IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave50IntegrationSealResult;
  replay: BatchNationalTickSessionWave50IntegrationSealResult;
}

/**
 * Round 50 wave 50: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-230 baseline pin.
 */
export function verifyBatchNationalTickSessionWave50IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave50IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave50Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave50Integration(
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
