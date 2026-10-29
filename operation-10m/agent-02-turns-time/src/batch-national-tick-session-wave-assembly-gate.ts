import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { BatchNationalTickSessionWaveResult } from './batch-national-tick-session-wave.js';
import { exportBatchNationalTickSessionWave } from './batch-national-tick-session-wave-export.js';
import {
  exportBatchNationalTickSessionWaveScorecard,
  type BatchNationalTickSessionWaveScorecardExport,
} from './batch-national-tick-session-wave-scorecard-export.js';
import {
  verifyBatchNationalTickSessionWaveReplayParity,
  type BatchNationalTickSessionWaveReplayParityResult,
} from './batch-national-tick-session-wave-replay-parity.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';

export interface BatchNationalTickSessionWaveAssemblyGateResult {
  ok: boolean;
  exportAllOk: boolean;
  scorecardOk: boolean;
  parityOk: boolean;
  scorecard: BatchNationalTickSessionWaveScorecardExport;
  parity: BatchNationalTickSessionWaveReplayParityResult;
}

/**
 * Round 18: assembly gate — export ok, scorecard ok, and replay parity on the same tick specs.
 */
export function gateBatchNationalTickSessionWaveAssembly(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
  wave: BatchNationalTickSessionWaveResult,
): BatchNationalTickSessionWaveAssemblyGateResult {
  const exp = exportBatchNationalTickSessionWave(wave);
  const scorecard = exportBatchNationalTickSessionWaveScorecard(wave);
  const parity = verifyBatchNationalTickSessionWaveReplayParity(engine, budget, ticks);
  const exportAllOk = exp.allOk;
  const scorecardOk = scorecard.ok;
  const parityOk = parity.parityOk;
  return {
    ok: exportAllOk && scorecardOk && parityOk,
    exportAllOk,
    scorecardOk,
    parityOk,
    scorecard,
    parity,
  };
}
