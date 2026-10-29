import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  sealBatchNationalTickSessionWave56Integration,
  type BatchNationalTickSessionWave56IntegrationSealResult,
} from './batch-national-tick-session-wave56-integration-seal.js';

export interface BatchNationalTickSessionWave56IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave56IntegrationSealResult;
  replay: BatchNationalTickSessionWave56IntegrationSealResult;
}

/**
 * Round 51 wave 51: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-232 baseline pin.
 */
export function verifyBatchNationalTickSessionWave56IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave56IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave56Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave56Integration(
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
