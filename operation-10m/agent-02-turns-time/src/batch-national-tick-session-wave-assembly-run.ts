import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import {
  runNationalTickOrchestratedSessionWave,
  type BatchNationalTickSessionWaveResult,
  type NationalTickSessionWaveTickSpec,
} from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssembly,
  type BatchNationalTickSessionWaveAssemblyGateResult,
} from './batch-national-tick-session-wave-assembly-gate.js';

export interface BatchNationalTickSessionWaveAssemblyRunResult {
  wave: BatchNationalTickSessionWaveResult;
  gate: BatchNationalTickSessionWaveAssemblyGateResult;
  assemblyDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyDigest(
  wave: BatchNationalTickSessionWaveResult,
  gate: BatchNationalTickSessionWaveAssemblyGateResult,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      wave: wave.waveDigest,
      scorecard: gate.scorecard.scorecardDigest,
      ok: gate.ok,
    }),
  );
}

/**
 * Round 19: run session wave plus round-18 assembly gate on one engine pass.
 */
export function runNationalTickSessionWaveAssembly(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
): BatchNationalTickSessionWaveAssemblyRunResult {
  const wave = runNationalTickOrchestratedSessionWave(engine, budget, ticks);
  const gate = gateBatchNationalTickSessionWaveAssembly(engine, budget, ticks, wave);
  const assemblyDigest = computeBatchNationalTickSessionWaveAssemblyDigest(wave, gate);
  return { wave, gate, assemblyDigest };
}
