import { fnv1a64Hex } from './turn-audit.js';
import type { BatchNationalTickLedger } from './batch-national-tick-ledger.js';

export function computeBatchNationalTickLedgerDigest(ledger: BatchNationalTickLedger): string {
  const payload = JSON.stringify({
    count: ledger.entries.length,
    digests: ledger.entries.map((e) => e.nationalTickDigest),
    ok: ledger.entries.every((e) => e.ok),
  });
  return fnv1a64Hex(payload);
}
