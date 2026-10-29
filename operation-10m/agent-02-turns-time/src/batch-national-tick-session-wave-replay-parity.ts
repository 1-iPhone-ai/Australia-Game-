import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  runNationalTickOrchestratedSessionWave,
  type BatchNationalTickSessionWaveResult,
  type NationalTickSessionWaveTickSpec,
} from './batch-national-tick-session-wave.js';

export interface BatchNationalTickSessionWaveReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveResult;
  replay: BatchNationalTickSessionWaveResult;
}

/**
 * Round 17: deterministic replay — two session waves from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
): BatchNationalTickSessionWaveReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = runNationalTickOrchestratedSessionWave(engine, budget, ticks);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = runNationalTickOrchestratedSessionWave(replayEngine, budget, ticks);
  const parityOk =
    baseline.waveDigest === replay.waveDigest &&
    baseline.ledgerExport.ledgerDigest === replay.ledgerExport.ledgerDigest &&
    baseline.ledgerExport.allOk === replay.ledgerExport.allOk;
  return { parityOk, baseline, replay };
}
