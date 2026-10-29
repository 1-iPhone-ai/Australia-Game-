import { computeBatchNationalTickLedgerDigest } from './batch-national-tick-ledger-digest.js';
import type { BatchNationalTickLedger } from './batch-national-tick-ledger.js';

export interface BatchNationalTickSessionLedgerExportRow {
  tickIndex: number;
  startTurn: number;
  endTurn: number;
  nationalTickDigest: string;
  ok: boolean;
}

export interface BatchNationalTickSessionLedgerExport {
  rows: BatchNationalTickSessionLedgerExportRow[];
  entryCount: number;
  allOk: boolean;
  ledgerDigest: string;
}

/**
 * Round 16: flatten append-only national tick ledger for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionLedger(
  ledger: BatchNationalTickLedger,
): BatchNationalTickSessionLedgerExport {
  const rows = ledger.entries.map((e) => ({
    tickIndex: e.tickIndex,
    startTurn: e.startTurn,
    endTurn: e.endTurn,
    nationalTickDigest: e.nationalTickDigest,
    ok: e.ok,
  }));
  return {
    rows,
    entryCount: rows.length,
    allOk: rows.every((r) => r.ok),
    ledgerDigest: computeBatchNationalTickLedgerDigest(ledger),
  };
}
