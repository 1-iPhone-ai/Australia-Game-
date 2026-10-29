import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveReleaseVerificationReport } from './archive-release-verification.ts';
import type { Agent24ReplayScaleWaveAttestationVerificationReport } from './replay-scale-wave-attestation-verification.ts';
import type { Agent24ReplayScaleWaveAttestation } from './replay-scale-wave-attestation.ts';

export type Agent24ArchiveScaleWaveReleaseHandoffBlockerKind =
  | 'attestation_not_verified'
  | 'release_not_verified'
  | 'attestation_status_weak';

export interface Agent24ArchiveScaleWaveReleaseHandoffBlocker {
  kind: Agent24ArchiveScaleWaveReleaseHandoffBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveReleaseHandoffGateReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  handoffAllowed: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveReleaseHandoffBlocker[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveReleaseHandoffGateInput {
  matchId: string;
  replayScaleWaveAttestationVerification: Agent24ReplayScaleWaveAttestationVerificationReport;
  archiveReleaseVerification: Agent24ArchiveReleaseVerificationReport;
  replayScaleWaveAttestation: Agent24ReplayScaleWaveAttestation;
}

export function buildAgent24ArchiveScaleWaveReleaseHandoffGateReport(
  input: Agent24ArchiveScaleWaveReleaseHandoffGateInput,
): Agent24ArchiveScaleWaveReleaseHandoffGateReport {
  const waveRound = input.replayScaleWaveAttestation.waveRound;
  const blockers: Agent24ArchiveScaleWaveReleaseHandoffBlocker[] = [];

  if (!input.replayScaleWaveAttestationVerification.verified) {
    blockers.push({
      kind: 'attestation_not_verified',
      detail: `Attestation verification open (${input.replayScaleWaveAttestationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswrhg_att_v', {
        issues: input.replayScaleWaveAttestationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveReleaseVerification.verified) {
    blockers.push({
      kind: 'release_not_verified',
      detail: `Archive release verification open (${input.archiveReleaseVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswrhg_release', {
        issues: input.archiveReleaseVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (input.replayScaleWaveAttestation.status !== 'verified') {
    blockers.push({
      kind: 'attestation_status_weak',
      detail: `Attestation status ${input.replayScaleWaveAttestation.status}`,
      fingerprint: o6kAgent24Fingerprint('aswrhg_status', {
        status: input.replayScaleWaveAttestation.status,
        wave: waveRound,
      }),
    });
  }

  let handoffScore = 100;
  handoffScore -= blockers.length * 19;
  handoffScore -= Math.max(0, 100 - input.replayScaleWaveAttestationVerification.verificationScore) * 0.09;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffAllowed = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_release_handoff_gate', {
      matchId: input.matchId,
      wave: waveRound,
    }),
    matchId: input.matchId,
    waveRound,
    handoffAllowed,
    blockerCount: blockers.length,
    blockers,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_release_handoff_gate_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      handoffAllowed,
      handoffScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveReleaseHandoffGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const attestationVerification = {
    reportId: 'av',
    matchId: 'self',
    waveRound: 34,
    verified: true,
    issueCount: 0,
    issues: [],
    attestationScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswav_t19', { v: 2 }),
  };
  const releaseVerification = {
    reportId: 'rv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    releaseScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('arv_t19', { v: 1 }),
  };
  const attestation = {
    attestationId: 'att',
    matchId: 'self',
    waveRound: 34,
    status: 'verified' as const,
    verificationOk: true,
    finalizationOk: true,
    closeoutOk: true,
    attestationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswatt_t19', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveReleaseHandoffGateReport({
    matchId: 'self',
    replayScaleWaveAttestationVerification: attestationVerification,
    archiveReleaseVerification: releaseVerification,
    replayScaleWaveAttestation: attestation,
  });

  return [
    { name: 'handoff_allowed_when_release_stack_ready', passed: report.handoffAllowed && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 34 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveReleaseHandoffGateReport({
          matchId: 'self',
          replayScaleWaveAttestationVerification: attestationVerification,
          archiveReleaseVerification: releaseVerification,
          replayScaleWaveAttestation: attestation,
        }).deterministicFingerprint,
    },
  ];
}
