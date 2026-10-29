import type { BatchNationalTickSessionWaveAssemblyRunResult } from './batch-national-tick-session-wave-assembly-run.js';

export interface BatchNationalTickSessionWaveAssemblyExport {
  ok: boolean;
  assemblyDigest: string;
  waveDigest: string;
  scorecardDigest: string;
  exportAllOk: boolean;
  scorecardOk: boolean;
  parityOk: boolean;
}

/**
 * Round 19: flatten assembly run for Agent 25 integration hooks.
 */
export function exportBatchNationalTickSessionWaveAssembly(
  run: BatchNationalTickSessionWaveAssemblyRunResult,
): BatchNationalTickSessionWaveAssemblyExport {
  return {
    ok: run.gate.ok,
    assemblyDigest: run.assemblyDigest,
    waveDigest: run.wave.waveDigest,
    scorecardDigest: run.gate.scorecard.scorecardDigest,
    exportAllOk: run.gate.exportAllOk,
    scorecardOk: run.gate.scorecardOk,
    parityOk: run.gate.parityOk,
  };
}
