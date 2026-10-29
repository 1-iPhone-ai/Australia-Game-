import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveHandoffSeal } from './archive-handoff-seal.ts';
import type { Agent24ArchiveRoundtripVerificationReport } from './archive-roundtrip-verification.ts';
import type { Agent24AttestationChainVerificationReport } from './attestation-chain-verification.ts';

export interface Agent24ArchiveHandoffVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveHandoffVerificationReport {
  reportId: string;
  matchId: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ArchiveHandoffVerificationIssue[];
  readyLinkCount: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveHandoffVerificationInput {
  matchId: string;
  archiveHandoffSeal: Agent24ArchiveHandoffSeal;
  archiveRoundtripVerification: Agent24ArchiveRoundtripVerificationReport;
  attestationChainVerification: Agent24AttestationChainVerificationReport;
}

export function buildAgent24ArchiveHandoffVerificationReport(
  input: Agent24ArchiveHandoffVerificationInput,
): Agent24ArchiveHandoffVerificationReport {
  const issues: Agent24ArchiveHandoffVerificationIssue[] = [];

  if (!input.archiveHandoffSeal.handoffReady) {
    issues.push({
      segment: 'handoff_seal',
      detail: `Handoff seal not ready (${input.archiveHandoffSeal.readyLinkCount}/${input.archiveHandoffSeal.linkCount} links)`,
      fingerprint: o6kAgent24Fingerprint('ahv_seal', { ready: input.archiveHandoffSeal.readyLinkCount }),
    });
  }
  if (!input.archiveRoundtripVerification.verified) {
    issues.push({
      segment: 'roundtrip',
      detail: 'Roundtrip verification failed',
      fingerprint: o6kAgent24Fingerprint('ahv_rt', { verified: false }),
    });
  }
  if (!input.attestationChainVerification.verified) {
    issues.push({
      segment: 'chain',
      detail: 'Attestation chain verification failed',
      fingerprint: o6kAgent24Fingerprint('ahv_chain', { verified: false }),
    });
  }

  for (const link of input.archiveHandoffSeal.links) {
    if (!link.ready) {
      issues.push({
        segment: link.segment,
        detail: `Handoff link ${link.segment} not ready`,
        fingerprint: o6kAgent24Fingerprint('ahv_link', { segment: link.segment }),
      });
    }
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 14;
  verificationScore = Math.max(0, Math.min(100, verificationScore));

  const verified =
    uniqueIssues.length === 0 &&
    input.archiveHandoffSeal.handoffReady &&
    input.archiveRoundtripVerification.verified &&
    input.attestationChainVerification.verified;

  return {
    reportId: o6kAgent24Fingerprint('archive_handoff_verification', { matchId: input.matchId }),
    matchId: input.matchId,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    readyLinkCount: input.archiveHandoffSeal.readyLinkCount,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_handoff_verification_body', {
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ArchiveHandoffVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const handoff = {
    sealId: 'h',
    matchId: 'self',
    handoffReady: true,
    linkCount: 3,
    readyLinkCount: 3,
    links: [
      { linkId: 'l1', segment: 'roundtrip_verified' as const, ready: true, fingerprint: 'a' },
      { linkId: 'l2', segment: 'ledger_reconciled' as const, ready: true, fingerprint: 'b' },
      { linkId: 'l3', segment: 'chain_sealed' as const, ready: true, fingerprint: 'c' },
    ],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('ahs_v', { v: 1 }),
  };
  const roundtrip = {
    reportId: 'rt',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rtv_v', { v: 1 }),
  };
  const chain = {
    reportId: 'cv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    alignedLinkCount: 4,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acv_v', { v: 1 }),
  };

  const report = buildAgent24ArchiveHandoffVerificationReport({
    matchId: 'self',
    archiveHandoffSeal: handoff,
    archiveRoundtripVerification: roundtrip,
    attestationChainVerification: chain,
  });

  return [
    { name: 'verified_when_handoff_pipeline_ready', passed: report.verified && report.issueCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveHandoffVerificationReport({
          matchId: 'self',
          archiveHandoffSeal: handoff,
          archiveRoundtripVerification: roundtrip,
          attestationChainVerification: chain,
        }).deterministicFingerprint,
    },
  ];
}
