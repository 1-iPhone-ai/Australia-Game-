import { fnv1a64Hex } from './turn-audit.js';
import type { BatchNationalTickSessionWaveAssemblyBatchGateResult } from './batch-national-tick-session-wave-assembly-batch-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchGateExport {
  ok: boolean;
  exportAllOk: boolean;
  parityOk: boolean;
  batchDigest: string;
  runCount: number;
  gateDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchGateDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: gateExport.ok,
      batchDigest: gateExport.batchDigest,
      runCount: gateExport.runCount,
    }),
  );
}

/**
 * Round 22: flatten assembly batch gate for Agent 25 post–O10-174 integration hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchGateResult,
): BatchNationalTickSessionWaveAssemblyBatchGateExport {
  const gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport = {
    ok: gate.ok,
    exportAllOk: gate.exportAllOk,
    parityOk: gate.parityOk,
    batchDigest: gate.export.batchDigest,
    runCount: gate.export.runCount,
    gateDigest: '',
  };
  gateExport.gateDigest = computeBatchNationalTickSessionWaveAssemblyBatchGateDigest(gateExport);
  return gateExport;
}
