import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchivePublishDispatchReport } from './archive-publish-dispatch.ts';
import type { Agent24ArchivePublishPlan } from './archive-publish-plan.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24PublishReceiptEntry {
  receiptId: string;
  jobId: string;
  slotId: string;
  fromTurn: number;
  toTurn: number;
  eventSlots: number;
  sealFingerprint: string;
  linked: boolean;
  fingerprint: string;
}

export interface Agent24PublishReceiptLedger {
  ledgerId: string;
  matchId: string;
  entryCount: number;
  linkedEntryCount: number;
  totalEventSlots: number;
  ledgerComplete: boolean;
  entries: Agent24PublishReceiptEntry[];
  ledgerScore: number;
  deterministicFingerprint: string;
}

export interface Agent24PublishReceiptLedgerInput {
  matchId: string;
  snapshotSeal: Agent24SnapshotSeal;
  archivePublishPlan: Agent24ArchivePublishPlan;
  publishDispatch: Agent24ArchivePublishDispatchReport;
}

export function buildAgent24PublishReceiptLedger(input: Agent24PublishReceiptLedgerInput): Agent24PublishReceiptLedger {
  const sealFp = input.snapshotSeal.sealFingerprint || input.snapshotSeal.deterministicFingerprint;

  const entries: Agent24PublishReceiptEntry[] = input.publishDispatch.jobs
    .filter(job => job.dispatched)
    .map(job => {
      const linked = input.snapshotSeal.sealed && job.eventSlots > 0;
      return {
        receiptId: o6kAgent24Fingerprint('publish_receipt', { matchId: input.matchId, job: job.jobId }),
        jobId: job.jobId,
        slotId: job.slotId,
        fromTurn: job.fromTurn,
        toTurn: job.toTurn,
        eventSlots: job.eventSlots,
        sealFingerprint: sealFp,
        linked,
        fingerprint: o6kAgent24Fingerprint('publish_receipt_body', {
          job: job.jobId,
          linked,
          events: job.eventSlots,
          seal: sealFp,
        }),
      };
    });

  entries.sort((a, b) => a.fromTurn - b.fromTurn);
  const linkedEntryCount = entries.filter(e => e.linked).length;
  const totalEventSlots = entries.reduce((sum, e) => sum + e.eventSlots, 0);

  let ledgerScore = 100;
  if (!input.snapshotSeal.sealed) ledgerScore -= 40;
  if (entries.length === 0 && input.archivePublishPlan.publishReady) ledgerScore -= 20;
  if (linkedEntryCount < entries.length) ledgerScore -= (entries.length - linkedEntryCount) * 5;
  ledgerScore = Math.max(0, Math.min(100, ledgerScore));

  const ledgerComplete =
    input.snapshotSeal.sealed &&
    input.publishDispatch.dispatchAllowed &&
    entries.length > 0 &&
    linkedEntryCount === entries.length;

  return {
    ledgerId: o6kAgent24Fingerprint('publish_receipt_ledger', { matchId: input.matchId }),
    matchId: input.matchId,
    entryCount: entries.length,
    linkedEntryCount,
    totalEventSlots,
    ledgerComplete,
    entries,
    ledgerScore,
    deterministicFingerprint: o6kAgent24Fingerprint('publish_receipt_ledger_body', {
      entries: entries.map(e => e.fingerprint),
      ledgerComplete,
      totalEventSlots,
      ledgerScore,
    }),
  };
}

export function runAgent24PublishReceiptLedgerSelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 20,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'c',
    sealFingerprint: 'sf_ledger',
    deterministicFingerprint: o6kAgent24Fingerprint('seal_led', { v: 1 }),
  };
  const publishPlan = {
    planId: 'p',
    matchId: 'self',
    currentTurn: 20,
    publishableSlotCount: 1,
    withheldSlotCount: 0,
    estimatedPublishedEvents: 8,
    publishReady: true,
    publishScore: 88,
    slots: [],
    deterministicFingerprint: o6kAgent24Fingerprint('ap_led', { v: 1 }),
  };
  const dispatch = {
    reportId: 'd',
    matchId: 'self',
    currentTurn: 20,
    dispatchAllowed: true,
    jobCount: 1,
    dispatchedJobCount: 1,
    withheldJobCount: 0,
    estimatedDispatchedEvents: 8,
    dispatchScore: 92,
    jobs: [
      {
        jobId: 'j1',
        slotId: 'slot1',
        fromTurn: 1,
        toTurn: 5,
        dispatched: true,
        reason: 'dispatched_to_cold_archive',
        eventSlots: 8,
        fingerprint: o6kAgent24Fingerprint('job_led', { v: 1 }),
      },
    ],
    deterministicFingerprint: o6kAgent24Fingerprint('disp_led', { v: 1 }),
  };

  const ledger = buildAgent24PublishReceiptLedger({
    matchId: 'self',
    snapshotSeal: seal,
    archivePublishPlan: publishPlan,
    publishDispatch: dispatch,
  });

  return [
    { name: 'ledger_complete_with_dispatched_job', passed: ledger.ledgerComplete && ledger.entryCount === 1 },
    {
      name: 'deterministic_fingerprint',
      passed:
        ledger.deterministicFingerprint ===
        buildAgent24PublishReceiptLedger({
          matchId: 'self',
          snapshotSeal: seal,
          archivePublishPlan: publishPlan,
          publishDispatch: dispatch,
        }).deterministicFingerprint,
    },
  ];
}
