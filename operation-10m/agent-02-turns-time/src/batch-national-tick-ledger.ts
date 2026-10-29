export interface BatchNationalTickLedgerEntry {
  tickIndex: number;
  startTurn: number;
  endTurn: number;
  nationalTickDigest: string;
  ok: boolean;
}

export interface BatchNationalTickLedger {
  entries: BatchNationalTickLedgerEntry[];
}

export function createBatchNationalTickLedger(): BatchNationalTickLedger {
  return { entries: [] };
}

export function appendBatchNationalTickLedgerEntry(
  ledger: BatchNationalTickLedger,
  entry: BatchNationalTickLedgerEntry,
): BatchNationalTickLedger {
  return { entries: [...ledger.entries, entry] };
}
