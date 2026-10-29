/**
 * Agent 21 — in-memory forecast audit ledger (lab session trace; never canonical).
 */

import { ag21FingerprintSnapshot } from './isolation-core';

export interface Ag21ForecastAuditEntry {
  id: string;
  atTurn: number;
  kind: 'sensitivity' | 'domain_matrix' | 'projection' | 'batch';
  summary: string;
  fingerprint: string;
  authoritative: false;
}

export interface Ag21ForecastAuditLedger {
  entries: Ag21ForecastAuditEntry[];
  maxEntries: number;
}

let AG21_AUDIT_SEQ = 0;

export function createAg21ForecastAuditLedger(maxEntries = 32): Ag21ForecastAuditLedger {
  return { entries: [], maxEntries };
}

export function appendAg21ForecastAuditEntry(
  ledger: Ag21ForecastAuditLedger,
  entry: Omit<Ag21ForecastAuditEntry, 'id' | 'fingerprint' | 'authoritative'> & { payload: unknown }
): Ag21ForecastAuditEntry {
  const record: Ag21ForecastAuditEntry = {
    id: `ag21_audit_${++AG21_AUDIT_SEQ}`,
    atTurn: entry.atTurn,
    kind: entry.kind,
    summary: entry.summary,
    fingerprint: ag21FingerprintSnapshot({ kind: entry.kind, summary: entry.summary, payload: entry.payload }),
    authoritative: false
  };
  ledger.entries.push(record);
  if (ledger.entries.length > ledger.maxEntries) {
    ledger.entries.splice(0, ledger.entries.length - ledger.maxEntries);
  }
  return record;
}

export function summarizeAg21ForecastAuditLedger(ledger: Ag21ForecastAuditLedger): {
  count: number;
  byKind: Record<string, number>;
  latestSummary: string;
  authoritative: false;
} {
  const byKind: Record<string, number> = {};
  for (const e of ledger.entries) byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
  return {
    count: ledger.entries.length,
    byKind,
    latestSummary: ledger.entries[ledger.entries.length - 1]?.summary ?? 'empty',
    authoritative: false
  };
}

export function runAg21ForecastAuditSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ledger = createAg21ForecastAuditLedger(3);
  appendAg21ForecastAuditEntry(ledger, { atTurn: 1, kind: 'projection', summary: 'a', payload: { x: 1 } });
  appendAg21ForecastAuditEntry(ledger, { atTurn: 2, kind: 'batch', summary: 'b', payload: { x: 2 } });
  appendAg21ForecastAuditEntry(ledger, { atTurn: 3, kind: 'sensitivity', summary: 'c', payload: { x: 3 } });
  appendAg21ForecastAuditEntry(ledger, { atTurn: 4, kind: 'domain_matrix', summary: 'd', payload: { x: 4 } });

  push('audit_trim', ledger.entries.length === 3, String(ledger.entries.length));
  const summary = summarizeAg21ForecastAuditLedger(ledger);
  push('audit_summary', summary.count === 3 && summary.authoritative === false, summary.latestSummary);
  push('audit_kinds', (summary.byKind.sensitivity ?? 0) >= 1, JSON.stringify(summary.byKind));

  return out;
}
