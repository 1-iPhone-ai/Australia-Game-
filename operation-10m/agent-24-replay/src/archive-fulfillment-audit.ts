import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchivePublishDispatchReport } from './archive-publish-dispatch.ts';
import type { Agent24PublishReceiptLedger } from './publish-receipt-ledger.ts';

export interface Agent24ArchiveFulfillmentMismatch {
  kind: 'dispatch_without_receipt' | 'receipt_without_dispatch' | 'event_slot_drift';
  jobOrReceiptId: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveFulfillmentAuditReport {
  reportId: string;
  matchId: string;
  dispatchedJobCount: number;
  ledgerEntryCount: number;
  alignedPairCount: number;
  mismatchCount: number;
  mismatches: Agent24ArchiveFulfillmentMismatch[];
  fulfillmentComplete: boolean;
  fulfillmentScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveFulfillmentAuditInput {
  matchId: string;
  publishDispatch: Agent24ArchivePublishDispatchReport;
  publishReceiptLedger: Agent24PublishReceiptLedger;
}

export function buildAgent24ArchiveFulfillmentAuditReport(
  input: Agent24ArchiveFulfillmentAuditInput,
): Agent24ArchiveFulfillmentAuditReport {
  const mismatches: Agent24ArchiveFulfillmentMismatch[] = [];
  const dispatchedJobs = input.publishDispatch.jobs.filter(j => j.dispatched);
  const receiptByJob = new Map(input.publishReceiptLedger.entries.map(e => [e.jobId, e]));

  for (const job of dispatchedJobs) {
    const receipt = receiptByJob.get(job.jobId);
    if (!receipt) {
      mismatches.push({
        kind: 'dispatch_without_receipt',
        jobOrReceiptId: job.jobId,
        detail: `Dispatched job ${job.jobId} has no ledger receipt`,
        fingerprint: o6kAgent24Fingerprint('fulfill_no_receipt', { job: job.jobId }),
      });
      continue;
    }
    if (receipt.eventSlots !== job.eventSlots) {
      mismatches.push({
        kind: 'event_slot_drift',
        jobOrReceiptId: job.jobId,
        detail: `Event slots dispatch=${job.eventSlots} receipt=${receipt.eventSlots}`,
        fingerprint: o6kAgent24Fingerprint('fulfill_drift', {
          job: job.jobId,
          dispatch: job.eventSlots,
          receipt: receipt.eventSlots,
        }),
      });
    }
  }

  const dispatchedJobIds = new Set(dispatchedJobs.map(j => j.jobId));
  for (const entry of input.publishReceiptLedger.entries) {
    if (!dispatchedJobIds.has(entry.jobId)) {
      mismatches.push({
        kind: 'receipt_without_dispatch',
        jobOrReceiptId: entry.receiptId,
        detail: `Ledger receipt ${entry.receiptId} has no dispatched job`,
        fingerprint: o6kAgent24Fingerprint('fulfill_orphan_receipt', { receipt: entry.receiptId }),
      });
    }
  }

  mismatches.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));
  const alignedPairCount = dispatchedJobs.filter(j => {
    const r = receiptByJob.get(j.jobId);
    return r && r.eventSlots === j.eventSlots;
  }).length;

  let fulfillmentScore = 100;
  fulfillmentScore -= mismatches.length * 15;
  if (input.publishDispatch.dispatchAllowed && !input.publishReceiptLedger.ledgerComplete) fulfillmentScore -= 10;
  fulfillmentScore = Math.max(0, Math.min(100, fulfillmentScore));

  const fulfillmentComplete =
    input.publishDispatch.dispatchAllowed &&
    input.publishReceiptLedger.ledgerComplete &&
    mismatches.length === 0 &&
    alignedPairCount === dispatchedJobs.length;

  return {
    reportId: o6kAgent24Fingerprint('archive_fulfillment_audit', { matchId: input.matchId }),
    matchId: input.matchId,
    dispatchedJobCount: dispatchedJobs.length,
    ledgerEntryCount: input.publishReceiptLedger.entryCount,
    alignedPairCount,
    mismatchCount: mismatches.length,
    mismatches,
    fulfillmentComplete,
    fulfillmentScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_fulfillment_audit_body', {
      mismatches: mismatches.map(m => m.fingerprint),
      fulfillmentComplete,
      alignedPairCount,
      fulfillmentScore,
    }),
  };
}

export function runAgent24ArchiveFulfillmentAuditSelfTests(): Array<{ name: string; passed: boolean }> {
  const dispatch = {
    reportId: 'd',
    matchId: 'self',
    currentTurn: 20,
    dispatchAllowed: true,
    jobCount: 1,
    dispatchedJobCount: 1,
    withheldJobCount: 0,
    estimatedDispatchedEvents: 6,
    dispatchScore: 90,
    jobs: [
      {
        jobId: 'j1',
        slotId: 's1',
        fromTurn: 1,
        toTurn: 5,
        dispatched: true,
        reason: 'dispatched_to_cold_archive',
        eventSlots: 6,
        fingerprint: o6kAgent24Fingerprint('job_fa', { v: 1 }),
      },
    ],
    deterministicFingerprint: o6kAgent24Fingerprint('disp_fa', { v: 1 }),
  };
  const ledger = {
    ledgerId: 'l',
    matchId: 'self',
    entryCount: 1,
    linkedEntryCount: 1,
    totalEventSlots: 6,
    ledgerComplete: true,
    ledgerScore: 95,
    entries: [
      {
        receiptId: 'r1',
        jobId: 'j1',
        slotId: 's1',
        fromTurn: 1,
        toTurn: 5,
        eventSlots: 6,
        sealFingerprint: 'sf',
        linked: true,
        fingerprint: o6kAgent24Fingerprint('rec_fa', { v: 1 }),
      },
    ],
    deterministicFingerprint: o6kAgent24Fingerprint('led_fa', { v: 1 }),
  };

  const audit = buildAgent24ArchiveFulfillmentAuditReport({
    matchId: 'self',
    publishDispatch: dispatch,
    publishReceiptLedger: ledger,
  });

  return [
    { name: 'fulfillment_complete_when_aligned', passed: audit.fulfillmentComplete && audit.mismatchCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        audit.deterministicFingerprint ===
        buildAgent24ArchiveFulfillmentAuditReport({
          matchId: 'self',
          publishDispatch: dispatch,
          publishReceiptLedger: ledger,
        }).deterministicFingerprint,
    },
  ];
}
