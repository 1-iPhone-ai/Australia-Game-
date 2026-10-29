import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveFulfillmentAuditReport } from './archive-fulfillment-audit.ts';
import type { Agent24PublishReceiptLedger } from './publish-receipt-ledger.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24LedgerSealLink {
  linkId: string;
  receiptId: string;
  sealFingerprint: string;
  verifiedAgainstSeal: boolean;
  compositeAligned: boolean;
  fingerprint: string;
}

export interface Agent24LedgerSealContinuityReport {
  reportId: string;
  matchId: string;
  linkCount: number;
  verifiedLinkCount: number;
  continuityIntact: boolean;
  links: Agent24LedgerSealLink[];
  continuityScore: number;
  deterministicFingerprint: string;
}

export interface Agent24LedgerSealContinuityInput {
  matchId: string;
  compositeBundleFingerprint: string;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
  publishReceiptLedger: Agent24PublishReceiptLedger;
  fulfillmentAudit: Agent24ArchiveFulfillmentAuditReport;
}

export function buildAgent24LedgerSealContinuityReport(
  input: Agent24LedgerSealContinuityInput,
): Agent24LedgerSealContinuityReport {
  const sealFp = input.snapshotSeal.sealFingerprint || input.snapshotSeal.deterministicFingerprint;
  const compositeAligned =
    input.snapshotSeal.compositeBundleFingerprint === input.compositeBundleFingerprint;

  const links: Agent24LedgerSealLink[] = input.publishReceiptLedger.entries.map(entry => {
    const verifiedAgainstSeal = entry.sealFingerprint === sealFp && input.sealVerification.verified;
    return {
      linkId: o6kAgent24Fingerprint('ledger_seal_link', { receipt: entry.receiptId }),
      receiptId: entry.receiptId,
      sealFingerprint: entry.sealFingerprint,
      verifiedAgainstSeal,
      compositeAligned,
      fingerprint: o6kAgent24Fingerprint('ledger_seal_link_body', {
        receipt: entry.receiptId,
        verified: verifiedAgainstSeal,
        compositeAligned,
      }),
    };
  });

  links.sort((a, b) => a.receiptId.localeCompare(b.receiptId));
  const verifiedLinkCount = links.filter(l => l.verifiedAgainstSeal && l.compositeAligned).length;

  let continuityScore = 100;
  if (!input.snapshotSeal.sealed) continuityScore -= 35;
  if (!input.sealVerification.verified) continuityScore -= 25;
  if (!input.fulfillmentAudit.fulfillmentComplete) continuityScore -= 20;
  if (links.length > 0 && verifiedLinkCount < links.length) {
    continuityScore -= (links.length - verifiedLinkCount) * 8;
  }
  continuityScore = Math.max(0, Math.min(100, continuityScore));

  const continuityIntact =
    input.snapshotSeal.sealed &&
    input.sealVerification.verified &&
    input.fulfillmentAudit.fulfillmentComplete &&
    (links.length === 0 || verifiedLinkCount === links.length);

  return {
    reportId: o6kAgent24Fingerprint('ledger_seal_continuity', { matchId: input.matchId }),
    matchId: input.matchId,
    linkCount: links.length,
    verifiedLinkCount,
    continuityIntact,
    links,
    continuityScore,
    deterministicFingerprint: o6kAgent24Fingerprint('ledger_seal_continuity_body', {
      links: links.map(l => l.fingerprint),
      continuityIntact,
      verifiedLinkCount,
      continuityScore,
    }),
  };
}

export function runAgent24LedgerSealContinuitySelfTests(): Array<{ name: string; passed: boolean }> {
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 10,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'composite_self',
    sealFingerprint: 'sf_cont',
    deterministicFingerprint: o6kAgent24Fingerprint('seal_cont', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'v',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    linkMatchCount: 5,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_cont', { v: 1 }),
  };
  const ledger = {
    ledgerId: 'l',
    matchId: 'self',
    entryCount: 1,
    linkedEntryCount: 1,
    totalEventSlots: 4,
    ledgerComplete: true,
    ledgerScore: 92,
    entries: [
      {
        receiptId: 'r1',
        jobId: 'j1',
        slotId: 's1',
        fromTurn: 1,
        toTurn: 4,
        eventSlots: 4,
        sealFingerprint: 'sf_cont',
        linked: true,
        fingerprint: o6kAgent24Fingerprint('rec_cont', { v: 1 }),
      },
    ],
    deterministicFingerprint: o6kAgent24Fingerprint('led_cont', { v: 1 }),
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
    deterministicFingerprint: o6kAgent24Fingerprint('fa_cont', { v: 1 }),
  };

  const report = buildAgent24LedgerSealContinuityReport({
    matchId: 'self',
    compositeBundleFingerprint: 'composite_self',
    snapshotSeal: seal,
    sealVerification,
    publishReceiptLedger: ledger,
    fulfillmentAudit: fulfillment,
  });

  return [
    { name: 'continuity_intact_when_links_verify', passed: report.continuityIntact && report.verifiedLinkCount === 1 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24LedgerSealContinuityReport({
          matchId: 'self',
          compositeBundleFingerprint: 'composite_self',
          snapshotSeal: seal,
          sealVerification,
          publishReceiptLedger: ledger,
          fulfillmentAudit: fulfillment,
        }).deterministicFingerprint,
    },
  ];
}
