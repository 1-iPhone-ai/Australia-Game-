import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveFulfillmentAuditReport } from './archive-fulfillment-audit.ts';
import type { Agent24ContinuityExportLedger } from './continuity-export-ledger.ts';
import type { Agent24PublishReceiptLedger } from './publish-receipt-ledger.ts';

export interface Agent24ExportLedgerReconciliationGap {
  kind: 'receipt_count_drift' | 'fulfillment_not_complete' | 'export_ledger_incomplete';
  detail: string;
  fingerprint: string;
}

export interface Agent24ExportLedgerReconciliationReport {
  reportId: string;
  matchId: string;
  reconciled: boolean;
  gapCount: number;
  gaps: Agent24ExportLedgerReconciliationGap[];
  receiptEntryCount: number;
  exportLedgerEntryCount: number;
  reconciliationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ExportLedgerReconciliationInput {
  matchId: string;
  continuityExportLedger: Agent24ContinuityExportLedger;
  publishReceiptLedger: Agent24PublishReceiptLedger;
  fulfillmentAudit: Agent24ArchiveFulfillmentAuditReport;
}

export function buildAgent24ExportLedgerReconciliationReport(
  input: Agent24ExportLedgerReconciliationInput,
): Agent24ExportLedgerReconciliationReport {
  const gaps: Agent24ExportLedgerReconciliationGap[] = [];

  if (!input.continuityExportLedger.ledgerComplete) {
    gaps.push({
      kind: 'export_ledger_incomplete',
      detail: 'Continuity export ledger not complete',
      fingerprint: o6kAgent24Fingerprint('elr_export', { complete: false }),
    });
  }
  if (!input.fulfillmentAudit.fulfillmentComplete) {
    gaps.push({
      kind: 'fulfillment_not_complete',
      detail: `Fulfillment audit incomplete (${input.fulfillmentAudit.mismatchCount} mismatches)`,
      fingerprint: o6kAgent24Fingerprint('elr_fulfill', { mismatches: input.fulfillmentAudit.mismatchCount }),
    });
  }
  if (
    input.continuityExportLedger.recordedEntryCount > 0 &&
    input.publishReceiptLedger.entryCount === 0 &&
    input.fulfillmentAudit.dispatchedJobCount > 0
  ) {
    gaps.push({
      kind: 'receipt_count_drift',
      detail: 'Dispatched jobs exist but publish receipt ledger empty',
      fingerprint: o6kAgent24Fingerprint('elr_drift', { receipts: 0 }),
    });
  }

  gaps.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));

  let reconciliationScore = 100;
  reconciliationScore -= gaps.length * 20;
  reconciliationScore = Math.max(0, Math.min(100, reconciliationScore));

  const reconciled = gaps.length === 0 && input.continuityExportLedger.ledgerComplete;

  return {
    reportId: o6kAgent24Fingerprint('export_ledger_reconciliation', { matchId: input.matchId }),
    matchId: input.matchId,
    reconciled,
    gapCount: gaps.length,
    gaps,
    receiptEntryCount: input.publishReceiptLedger.entryCount,
    exportLedgerEntryCount: input.continuityExportLedger.entryCount,
    reconciliationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('export_ledger_reconciliation_body', {
      gaps: gaps.map(g => g.fingerprint),
      reconciled,
      reconciliationScore,
    }),
  };
}

export function runAgent24ExportLedgerReconciliationSelfTests(): Array<{ name: string; passed: boolean }> {
  const exportLedger = {
    ledgerId: 'e',
    matchId: 'self',
    entryCount: 1,
    recordedEntryCount: 1,
    ledgerComplete: true,
    entries: [],
    ledgerScore: 96,
    deterministicFingerprint: o6kAgent24Fingerprint('cel_elr', { v: 1 }),
  };
  const receiptLedger = {
    ledgerId: 'r',
    matchId: 'self',
    entryCount: 1,
    linkedEntryCount: 1,
    totalEventSlots: 5,
    ledgerComplete: true,
    entries: [],
    ledgerScore: 94,
    deterministicFingerprint: o6kAgent24Fingerprint('prl_elr', { v: 1 }),
  };
  const fulfillment = {
    reportId: 'fa',
    matchId: 'self',
    dispatchedJobCount: 1,
    ledgerEntryCount: 1,
    alignedPairCount: 1,
    mismatchCount: 0,
    mismatches: [],
    fulfillmentComplete: true,
    fulfillmentScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('fa_elr', { v: 1 }),
  };

  const report = buildAgent24ExportLedgerReconciliationReport({
    matchId: 'self',
    continuityExportLedger: exportLedger,
    publishReceiptLedger: receiptLedger,
    fulfillmentAudit: fulfillment,
  });

  return [
    { name: 'reconciled_when_ledgers_align', passed: report.reconciled && report.gapCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ExportLedgerReconciliationReport({
          matchId: 'self',
          continuityExportLedger: exportLedger,
          publishReceiptLedger: receiptLedger,
          fulfillmentAudit: fulfillment,
        }).deterministicFingerprint,
    },
  ];
}
