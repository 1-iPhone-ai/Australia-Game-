import type { BatchNationalTickSessionWaveAssemblyExport } from './batch-national-tick-session-wave-assembly-export.js';

export interface BatchNationalTickSessionWaveAssemblyExportCompareResult {
  ok: boolean;
  assemblyDigestMatch: boolean;
  waveDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 20: compare two assembly exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyExports(
  baseline: BatchNationalTickSessionWaveAssemblyExport,
  candidate: BatchNationalTickSessionWaveAssemblyExport,
): BatchNationalTickSessionWaveAssemblyExportCompareResult {
  const assemblyDigestMatch = baseline.assemblyDigest === candidate.assemblyDigest;
  const waveDigestMatch = baseline.waveDigest === candidate.waveDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: assemblyDigestMatch && waveDigestMatch && okFlagMatch,
    assemblyDigestMatch,
    waveDigestMatch,
    okFlagMatch,
  };
}
