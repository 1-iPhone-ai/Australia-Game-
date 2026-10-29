import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  runNationalTickSessionWaveAssemblyBatch,
  type BatchNationalTickSessionWaveAssemblyBatchResult,
} from './batch-national-tick-session-wave-assembly-batch.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatch,
  type BatchNationalTickSessionWaveAssemblyBatchExport,
} from './batch-national-tick-session-wave-assembly-batch-export.js';
import { verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity } from './batch-national-tick-session-wave-assembly-batch-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchGateResult {
  ok: boolean;
  exportAllOk: boolean;
  parityOk: boolean;
  batch: BatchNationalTickSessionWaveAssemblyBatchResult;
  export: BatchNationalTickSessionWaveAssemblyBatchExport;
}

/**
 * Round 21: assembly batch gate — export ok and replay parity from pre-batch snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatch(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchGateResult {
  const snapshot = engine.snapshot();
  const batch = runNationalTickSessionWaveAssemblyBatch(engine, budget, tickBatches);
  const exp = exportBatchNationalTickSessionWaveAssemblyBatch(batch);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const exportAllOk = exp.allOk;
  const parityOk = parity.parityOk;
  return {
    ok: exportAllOk && parityOk,
    exportAllOk,
    parityOk,
    batch,
    export: exp,
  };
}
