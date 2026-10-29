import { computeBatchNationalTickUnifiedSessionDigest } from './batch-national-tick-unified-session.js';
import type { BatchNationalTickSessionWaveResult } from './batch-national-tick-session-wave.js';

export interface BatchNationalTickSessionWaveExportRow {
  tickIndex: number;
  sessionDigest: string;
  unifiedOk: boolean;
  ledgerOk: boolean;
}

export interface BatchNationalTickSessionWaveExport {
  rows: BatchNationalTickSessionWaveExportRow[];
  sessionCount: number;
  allOk: boolean;
  waveDigest: string;
  ledgerDigest: string;
}

/**
 * Round 17: flatten chained unified session wave for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionWave(
  wave: BatchNationalTickSessionWaveResult,
): BatchNationalTickSessionWaveExport {
  const rows = wave.sessions.map((session, index) => {
    const ledgerRow = wave.ledgerExport.rows[index];
    return {
      tickIndex: ledgerRow?.tickIndex ?? index + 1,
      sessionDigest: computeBatchNationalTickUnifiedSessionDigest(session),
      unifiedOk: session.unifiedGate?.ok ?? true,
      ledgerOk: ledgerRow?.ok ?? false,
    };
  });
  return {
    rows,
    sessionCount: rows.length,
    allOk:
      wave.ledgerExport.allOk &&
      rows.every((row) => row.unifiedOk && row.ledgerOk),
    waveDigest: wave.waveDigest,
    ledgerDigest: wave.ledgerExport.ledgerDigest,
  };
}
