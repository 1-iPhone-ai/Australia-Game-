import type { BatchNationalTickSessionWaveAssemblyBatchResult } from './batch-national-tick-session-wave-assembly-batch.js';
import {
  exportBatchNationalTickSessionWaveAssembly,
  type BatchNationalTickSessionWaveAssemblyExport,
} from './batch-national-tick-session-wave-assembly-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchExportRow {
  index: number;
  assemblyDigest: string;
  ok: boolean;
}

export interface BatchNationalTickSessionWaveAssemblyBatchExport {
  rows: BatchNationalTickSessionWaveAssemblyBatchExportRow[];
  runCount: number;
  allOk: boolean;
  batchDigest: string;
}

/**
 * Round 20: flatten chained assembly batch for Agent 25 hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatch(
  batch: BatchNationalTickSessionWaveAssemblyBatchResult,
): BatchNationalTickSessionWaveAssemblyBatchExport {
  const rows = batch.runs.map((run, index) => {
    const exp: BatchNationalTickSessionWaveAssemblyExport =
      exportBatchNationalTickSessionWaveAssembly(run);
    return {
      index: index + 1,
      assemblyDigest: exp.assemblyDigest,
      ok: exp.ok,
    };
  });
  return {
    rows,
    runCount: rows.length,
    allOk: batch.allOk && rows.every((row) => row.ok),
    batchDigest: batch.batchDigest,
  };
}
