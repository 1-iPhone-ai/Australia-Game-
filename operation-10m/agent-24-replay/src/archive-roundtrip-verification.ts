import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveRoundtripGateReport } from './archive-roundtrip-gate.ts';
import type { Agent24AttestationChainVerificationReport } from './attestation-chain-verification.ts';
import type { Agent24ContinuityExportLedger } from './continuity-export-ledger.ts';

export interface Agent24ArchiveRoundtripVerificationIssue {
  kind: 'roundtrip_blocked' | 'chain_unverified' | 'ledger_not_recorded';
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveRoundtripVerificationReport {
  reportId: string;
  matchId: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ArchiveRoundtripVerificationIssue[];
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveRoundtripVerificationInput {
  matchId: string;
  archiveRoundtripGate: Agent24ArchiveRoundtripGateReport;
  attestationChainVerification: Agent24AttestationChainVerificationReport;
  continuityExportLedger: Agent24ContinuityExportLedger;
}

export function buildAgent24ArchiveRoundtripVerificationReport(
  input: Agent24ArchiveRoundtripVerificationInput,
): Agent24ArchiveRoundtripVerificationReport {
  const issues: Agent24ArchiveRoundtripVerificationIssue[] = [];

  if (!input.archiveRoundtripGate.roundtripAllowed) {
    issues.push({
      kind: 'roundtrip_blocked',
      detail: `Roundtrip gate blocked (${input.archiveRoundtripGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rtv_gate', { blockers: input.archiveRoundtripGate.blockerCount }),
    });
  }
  if (!input.attestationChainVerification.verified) {
    issues.push({
      kind: 'chain_unverified',
      detail: `Attestation chain verification failed (${input.attestationChainVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rtv_chain', { issues: input.attestationChainVerification.issueCount }),
    });
  }
  if (input.continuityExportLedger.recordedEntryCount === 0) {
    issues.push({
      kind: 'ledger_not_recorded',
      detail: 'No recorded continuity export ledger entries',
      fingerprint: o6kAgent24Fingerprint('rtv_ledger', { recorded: 0 }),
    });
  }

  issues.sort((a, b) => a.fingerprint.localeCompare(b.fingerprint));

  let verificationScore = 100;
  verificationScore -= issues.length * 18;
  verificationScore -= Math.max(0, 100 - input.archiveRoundtripGate.roundtripScore) * 0.1;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    issues.length === 0 &&
    input.archiveRoundtripGate.roundtripAllowed &&
    input.attestationChainVerification.verified &&
    input.continuityExportLedger.ledgerComplete;

  return {
    reportId: o6kAgent24Fingerprint('archive_roundtrip_verification', { matchId: input.matchId }),
    matchId: input.matchId,
    verified,
    issueCount: issues.length,
    issues,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_roundtrip_verification_body', {
      issues: issues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ArchiveRoundtripVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const gate = {
    reportId: 'g',
    matchId: 'self',
    roundtripAllowed: true,
    blockerCount: 0,
    blockers: [],
    roundtripScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rtg_v', { v: 1 }),
  };
  const chainVerification = {
    reportId: 'cv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    alignedLinkCount: 4,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acv_v', { v: 1 }),
  };
  const ledger = {
    ledgerId: 'l',
    matchId: 'self',
    entryCount: 1,
    recordedEntryCount: 1,
    ledgerComplete: true,
    entries: [],
    ledgerScore: 98,
    deterministicFingerprint: o6kAgent24Fingerprint('cel_v', { v: 1 }),
  };

  const report = buildAgent24ArchiveRoundtripVerificationReport({
    matchId: 'self',
    archiveRoundtripGate: gate,
    attestationChainVerification: chainVerification,
    continuityExportLedger: ledger,
  });

  return [
    { name: 'verified_when_all_aligned', passed: report.verified && report.issueCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveRoundtripVerificationReport({
          matchId: 'self',
          archiveRoundtripGate: gate,
          attestationChainVerification: chainVerification,
          continuityExportLedger: ledger,
        }).deterministicFingerprint,
    },
  ];
}
