import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24AttestationChainSeal } from './attestation-chain-seal.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';
import type { Agent24SnapshotSeal } from './snapshot-seal.ts';

export interface Agent24AttestationChainVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24AttestationChainVerificationReport {
  reportId: string;
  matchId: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24AttestationChainVerificationIssue[];
  alignedLinkCount: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24AttestationChainVerificationInput {
  matchId: string;
  attestationChainSeal: Agent24AttestationChainSeal;
  snapshotSeal: Agent24SnapshotSeal;
  sealVerification: Agent24SealVerificationReport;
}

export function buildAgent24AttestationChainVerificationReport(
  input: Agent24AttestationChainVerificationInput,
): Agent24AttestationChainVerificationReport {
  const issues: Agent24AttestationChainVerificationIssue[] = [];

  if (!input.sealVerification.verified) {
    issues.push({
      segment: 'snapshot_seal',
      detail: 'Underlying seal verification failed',
      fingerprint: o6kAgent24Fingerprint('acv_seal', { verified: false }),
    });
  }
  if (!input.attestationChainSeal.chainSealed) {
    issues.push({
      segment: 'attestation_chain',
      detail: `Chain not sealed (${input.attestationChainSeal.alignedLinkCount}/${input.attestationChainSeal.linkCount} aligned)`,
      fingerprint: o6kAgent24Fingerprint('acv_chain', {
        aligned: input.attestationChainSeal.alignedLinkCount,
        total: input.attestationChainSeal.linkCount,
      }),
    });
  }

  for (const link of input.attestationChainSeal.links) {
    if (!link.aligned) {
      issues.push({
        segment: link.segment,
        detail: `Chain segment ${link.segment} not aligned`,
        fingerprint: o6kAgent24Fingerprint('acv_segment', { segment: link.segment }),
      });
    }
  }

  if (!input.snapshotSeal.sealed && input.attestationChainSeal.chainSealed) {
    issues.push({
      segment: 'snapshot_seal',
      detail: 'Chain sealed but snapshot seal not sealed',
      fingerprint: o6kAgent24Fingerprint('acv_mismatch', { sealed: false }),
    });
  }

  issues.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));

  let verificationScore = 100;
  verificationScore -= issues.length * 12;
  verificationScore = Math.max(0, Math.min(100, verificationScore));

  const verified = issues.length === 0 && input.attestationChainSeal.chainSealed && input.sealVerification.verified;

  return {
    reportId: o6kAgent24Fingerprint('attestation_chain_verification', { matchId: input.matchId }),
    matchId: input.matchId,
    verified,
    issueCount: issues.length,
    issues,
    alignedLinkCount: input.attestationChainSeal.alignedLinkCount,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('attestation_chain_verification_body', {
      issues: issues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24AttestationChainVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const chain = {
    sealId: 'c',
    matchId: 'self',
    chainSealed: true,
    linkCount: 4,
    alignedLinkCount: 4,
    links: [
      { linkId: 'l1', segment: 'continuity_attestation' as const, aligned: true, fingerprint: 'a' },
      { linkId: 'l2', segment: 'export_gate' as const, aligned: true, fingerprint: 'b' },
      { linkId: 'l3', segment: 'manifest' as const, aligned: true, fingerprint: 'c' },
      { linkId: 'l4', segment: 'snapshot_seal' as const, aligned: true, fingerprint: 'd' },
    ],
    chainScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acs_v', { v: 1 }),
  };
  const seal = {
    sealId: 's',
    matchId: 'self',
    turn: 10,
    sealed: true,
    linkCount: 5,
    links: [],
    compositeBundleFingerprint: 'comp',
    sealFingerprint: 'sf',
    deterministicFingerprint: o6kAgent24Fingerprint('ss_v', { v: 1 }),
  };
  const sealVerification = {
    reportId: 'v',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    linkMatchCount: 5,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_v', { v: 1 }),
  };

  const report = buildAgent24AttestationChainVerificationReport({
    matchId: 'self',
    attestationChainSeal: chain,
    snapshotSeal: seal,
    sealVerification,
  });

  return [
    { name: 'verified_when_chain_and_seal_ok', passed: report.verified && report.issueCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24AttestationChainVerificationReport({
          matchId: 'self',
          attestationChainSeal: chain,
          snapshotSeal: seal,
          sealVerification,
        }).deterministicFingerprint,
    },
  ];
}
