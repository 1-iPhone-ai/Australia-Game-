import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  runNationalTickSessionWaveAssembly,
  type BatchNationalTickSessionWaveAssemblyRunResult,
} from './batch-national-tick-session-wave-assembly-run.js';

export interface BatchNationalTickSessionWaveAssemblyBatchResult {
  runs: BatchNationalTickSessionWaveAssemblyRunResult[];
  batchDigest: string;
  allOk: boolean;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchDigest(
  runs: readonly BatchNationalTickSessionWaveAssemblyRunResult[],
): string {
  return fnv1a64Hex(
    JSON.stringify({
      runs: runs.map((run) => run.assemblyDigest),
      allOk: runs.every((run) => run.gate.ok),
    }),
  );
}

/**
 * Round 20: chain multiple assembly runs on one engine (multi-wave national tick sessions).
 */
export function runNationalTickSessionWaveAssemblyBatch(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchResult {
  const runs: BatchNationalTickSessionWaveAssemblyRunResult[] = [];
  for (const ticks of tickBatches) {
    runs.push(runNationalTickSessionWaveAssembly(engine, budget, ticks));
  }
  const allOk = runs.every((run) => run.gate.ok);
  const batchDigest = computeBatchNationalTickSessionWaveAssemblyBatchDigest(runs);
  return { runs, batchDigest, allOk };
}
