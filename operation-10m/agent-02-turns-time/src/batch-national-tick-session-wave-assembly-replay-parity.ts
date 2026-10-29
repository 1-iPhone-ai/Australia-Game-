import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  runNationalTickSessionWaveAssembly,
  type BatchNationalTickSessionWaveAssemblyRunResult,
} from './batch-national-tick-session-wave-assembly-run.js';

export interface BatchNationalTickSessionWaveAssemblyReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyRunResult;
  replay: BatchNationalTickSessionWaveAssemblyRunResult;
}

/**
 * Round 19: deterministic replay — two assembly runs from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
): BatchNationalTickSessionWaveAssemblyReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = runNationalTickSessionWaveAssembly(engine, budget, ticks);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = runNationalTickSessionWaveAssembly(replayEngine, budget, ticks);
  const parityOk =
    baseline.assemblyDigest === replay.assemblyDigest &&
    baseline.gate.ok === replay.gate.ok &&
    baseline.wave.waveDigest === replay.wave.waveDigest;
  return { parityOk, baseline, replay };
}
