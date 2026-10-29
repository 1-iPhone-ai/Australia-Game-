import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveFulfillmentAuditReport } from './archive-fulfillment-audit.ts';
import type { Agent24ArchiveReleaseGateReport } from './archive-release-gate.ts';
import type { Agent24PublishReceiptLedger } from './publish-receipt-ledger.ts';

export interface Agent24ArchiveReleaseVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveReleaseVerificationReport {
  reportId: string;
  matchId: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ArchiveReleaseVerificationIssue[];
  releaseScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveReleaseVerificationInput {
  matchId: string;
  archiveReleaseGate: Agent24ArchiveReleaseGateReport;
  publishReceiptLedger: Agent24PublishReceiptLedger;
  archiveFulfillmentAudit: Agent24ArchiveFulfillmentAuditReport;
}

export function buildAgent24ArchiveReleaseVerificationReport(
  input: Agent24ArchiveReleaseVerificationInput,
): Agent24ArchiveReleaseVerificationReport {
  const issues: Agent24ArchiveReleaseVerificationIssue[] = [];

  if (!input.archiveReleaseGate.releaseAllowed) {
    issues.push({
      segment: 'release_gate',
      detail: `Release gate blocked (${input.archiveReleaseGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('arv_gate', { blockers: input.archiveReleaseGate.blockerCount }),
    });
  }
  if (!input.publishReceiptLedger.ledgerComplete) {
    issues.push({
      segment: 'receipt_ledger',
      detail: `Publish receipt ledger incomplete (${input.publishReceiptLedger.linkedEntryCount}/${input.publishReceiptLedger.entryCount})`,
      fingerprint: o6kAgent24Fingerprint('arv_ledger', {
        linked: input.publishReceiptLedger.linkedEntryCount,
      }),
    });
  }
  if (!input.archiveFulfillmentAudit.fulfillmentComplete) {
    issues.push({
      segment: 'fulfillment',
      detail: `Fulfillment audit open (${input.archiveFulfillmentAudit.mismatchCount} mismatches)`,
      fingerprint: o6kAgent24Fingerprint('arv_fulfill', { mismatches: input.archiveFulfillmentAudit.mismatchCount }),
    });
  }

  for (const blocker of input.archiveReleaseGate.blockers) {
    issues.push({
      segment: blocker.kind,
      detail: blocker.detail,
      fingerprint: o6kAgent24Fingerprint('arv_blocker', { kind: blocker.kind, fp: blocker.fingerprint }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.archiveReleaseGate.releaseScore) * 0.1;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.archiveReleaseGate.releaseAllowed &&
    input.publishReceiptLedger.ledgerComplete &&
    input.archiveFulfillmentAudit.fulfillmentComplete;

  return {
    reportId: o6kAgent24Fingerprint('archive_release_verification', { matchId: input.matchId }),
    matchId: input.matchId,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    releaseScore: input.archiveReleaseGate.releaseScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_release_verification_body', {
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ArchiveReleaseVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const releaseGate = {
    reportId: 'rg',
    matchId: 'self',
    releaseAllowed: true,
    blockerCount: 0,
    blockers: [],
    releaseScore: 100,
    publishableSlotCount: 2,
    dispatchedJobCount: 2,
    deterministicFingerprint: o6kAgent24Fingerprint('arg_t', { v: 1 }),
  };
  const publishReceiptLedger = {
    ledgerId: 'prl',
    matchId: 'self',
    entryCount: 2,
    linkedEntryCount: 2,
    totalEventSlots: 80,
    ledgerComplete: true,
    entries: [],
    ledgerScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('prl_t', { v: 1 }),
  };
  const fulfillmentAudit = {
    reportId: 'fa',
    matchId: 'self',
    dispatchedJobCount: 2,
    ledgerEntryCount: 2,
    alignedPairCount: 2,
    mismatchCount: 0,
    mismatches: [],
    fulfillmentComplete: true,
    fulfillmentScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('afa_t', { v: 1 }),
  };

  const report = buildAgent24ArchiveReleaseVerificationReport({
    matchId: 'self',
    archiveReleaseGate: releaseGate,
    publishReceiptLedger,
    archiveFulfillmentAudit: fulfillmentAudit,
  });

  return [
    { name: 'verified_when_release_pipeline_ready', passed: report.verified && report.issueCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveReleaseVerificationReport({
          matchId: 'self',
          archiveReleaseGate: releaseGate,
          publishReceiptLedger,
          archiveFulfillmentAudit: fulfillmentAudit,
        }).deterministicFingerprint,
    },
  ];
}
