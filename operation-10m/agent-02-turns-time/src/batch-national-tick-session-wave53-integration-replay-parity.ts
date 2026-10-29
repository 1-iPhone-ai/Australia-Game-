import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  sealBatchNationalTickSessionWave53Integration,
  type BatchNationalTickSessionWave53IntegrationSealResult,
} from './batch-national-tick-session-wave53-integration-seal.js';

export interface BatchNationalTickSessionWave53IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave53IntegrationSealResult;
  replay: BatchNationalTickSessionWave53IntegrationSealResult;
}

/**
 * Round 51 wave 51: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-232 baseline pin.
 */
export function verifyBatchNationalTickSessionWave53IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave53IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave53Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave53Integration(
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
