import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  runNationalTickSessionWaveAssemblyBatch,
  type BatchNationalTickSessionWaveAssemblyBatchResult,
} from './batch-national-tick-session-wave-assembly-batch.js';

export interface BatchNationalTickSessionWaveAssemblyBatchReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchResult;
}

/**
 * Round 21: deterministic replay — two assembly batches from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = runNationalTickSessionWaveAssemblyBatch(engine, budget, tickBatches);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = runNationalTickSessionWaveAssemblyBatch(replayEngine, budget, tickBatches);
  const parityOk =
    baseline.batchDigest === replay.batchDigest &&
    baseline.allOk === replay.allOk &&
    baseline.runs.length === replay.runs.length;
  return { parityOk, baseline, replay };
}
