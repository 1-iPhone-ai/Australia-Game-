import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveFinalizationReport } from './archive-scale-wave-finalization.ts';
import type { Agent24ReplayScaleWaveAttestation } from './replay-scale-wave-attestation.ts';
import type { Agent24ReplayScaleWaveVerificationReport } from './replay-scale-wave-verification.ts';

export interface Agent24ReplayScaleWaveAttestationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveAttestationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveAttestationVerificationIssue[];
  attestationScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveAttestationVerificationInput {
  matchId: string;
  replayScaleWaveAttestation: Agent24ReplayScaleWaveAttestation;
  replayScaleWaveVerification: Agent24ReplayScaleWaveVerificationReport;
  archiveScaleWaveFinalization: Agent24ArchiveScaleWaveFinalizationReport;
}

export function buildAgent24ReplayScaleWaveAttestationVerificationReport(
  input: Agent24ReplayScaleWaveAttestationVerificationInput,
): Agent24ReplayScaleWaveAttestationVerificationReport {
  const waveRound = input.replayScaleWaveAttestation.waveRound;
  const issues: Agent24ReplayScaleWaveAttestationVerificationIssue[] = [];

  if (input.replayScaleWaveAttestation.status !== 'verified') {
    issues.push({
      segment: 'attestation',
      detail: `Scale wave attestation status ${input.replayScaleWaveAttestation.status}`,
      fingerprint: o6kAgent24Fingerprint('rswav_attest', {
        status: input.replayScaleWaveAttestation.status,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveVerification.verified) {
    issues.push({
      segment: 'wave_verification',
      detail: `Scale wave verification open (${input.replayScaleWaveVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rswav_wave', {
        issues: input.replayScaleWaveVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveFinalization.finalized) {
    issues.push({
      segment: 'finalization',
      detail: `Scale wave finalization blocked (${input.archiveScaleWaveFinalization.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswav_fin', {
        blockers: input.archiveScaleWaveFinalization.blockerCount,
        wave: waveRound,
      }),
    });
  }

  for (const blocker of input.archiveScaleWaveFinalization.blockers) {
    issues.push({
      segment: blocker.kind,
      detail: blocker.detail,
      fingerprint: o6kAgent24Fingerprint('rswav_blocker', { kind: blocker.kind, fp: blocker.fingerprint, wave: waveRound }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 12;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveAttestation.attestationScore) * 0.1;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveAttestation.status === 'verified' &&
    input.replayScaleWaveVerification.verified &&
    input.archiveScaleWaveFinalization.finalized;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_attestation_verification', {
      matchId: input.matchId,
      wave: waveRound,
    }),
    matchId: input.matchId,
    waveRound,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    attestationScore: input.replayScaleWaveAttestation.attestationScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_attestation_verification_body', {
      waveRound,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveAttestationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const finalization = {
    reportId: 'fin',
    matchId: 'self',
    waveRound: 45,
    finalized: true,
    blockerCount: 0,
    blockers: [],
    finalizationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswf_t19', { v: 1 }),
  };
  const waveVerification = {
    reportId: 'sv',
    matchId: 'self',
    waveRound: 45,
    verified: true,
    issueCount: 0,
    issues: [],
    closeoutScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswv_t19', { v: 1 }),
  };
  const attestation = {
    attestationId: 'att',
    matchId: 'self',
    waveRound: 45,
    status: 'verified' as const,
    verificationOk: true,
    finalizationOk: true,
    closeoutOk: true,
    attestationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswa_t19', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveAttestationVerificationReport({
    matchId: 'self',
    replayScaleWaveAttestation: attestation,
    replayScaleWaveVerification: waveVerification,
    archiveScaleWaveFinalization: finalization,
  });

  return [
    { name: 'verified_when_attestation_stack_ready', passed: report.verified && report.issueCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 45 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveAttestationVerificationReport({
          matchId: 'self',
          replayScaleWaveAttestation: attestation,
          replayScaleWaveVerification: waveVerification,
          archiveScaleWaveFinalization: finalization,
        }).deterministicFingerprint,
    },
  ];
}
