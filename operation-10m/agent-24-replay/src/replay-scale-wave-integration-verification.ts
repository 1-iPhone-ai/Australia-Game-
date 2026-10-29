import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveReleaseHandoffGateReport } from './archive-scale-wave-release-handoff-gate.ts';
import type { Agent24ReplayScaleWaveAttestationVerificationReport } from './replay-scale-wave-attestation-verification.ts';
import type { Agent24ReplayScaleWaveIntegrationCloseoutReport } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveIntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveIntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveIntegrationVerificationIssue[];
  closeoutScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveIntegrationVerificationInput {
  matchId: string;
  replayScaleWaveIntegrationCloseout: Agent24ReplayScaleWaveIntegrationCloseoutReport;
  replayScaleWaveAttestationVerification: Agent24ReplayScaleWaveAttestationVerificationReport;
  archiveScaleWaveReleaseHandoffGate: Agent24ArchiveScaleWaveReleaseHandoffGateReport;
}

export function buildAgent24ReplayScaleWaveIntegrationVerificationReport(
  input: Agent24ReplayScaleWaveIntegrationVerificationInput,
): Agent24ReplayScaleWaveIntegrationVerificationReport {
  const waveRound = input.replayScaleWaveIntegrationCloseout.waveRound;
  const integrationBaselineSha = input.replayScaleWaveIntegrationCloseout.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveIntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveIntegrationCloseout.closeoutComplete) {
    issues.push({
      segment: 'integration_closeout',
      detail: `Integration closeout incomplete (${input.replayScaleWaveIntegrationCloseout.satisfiedCheckpointCount}/${input.replayScaleWaveIntegrationCloseout.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rswiv_closeout', {
        satisfied: input.replayScaleWaveIntegrationCloseout.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveAttestationVerification.verified) {
    issues.push({
      segment: 'attestation_verification',
      detail: `Attestation verification open (${input.replayScaleWaveAttestationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rswiv_att_v', {
        issues: input.replayScaleWaveAttestationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveReleaseHandoffGate.handoffAllowed) {
    issues.push({
      segment: 'release_handoff',
      detail: `Release handoff gate blocked (${input.archiveScaleWaveReleaseHandoffGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswiv_handoff', {
        blockers: input.archiveScaleWaveReleaseHandoffGate.blockerCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveIntegrationCloseout.closeoutScore) * 0.11;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveIntegrationCloseout.closeoutComplete &&
    input.replayScaleWaveAttestationVerification.verified &&
    input.archiveScaleWaveReleaseHandoffGate.handoffAllowed;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_integration_verification', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: integrationBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    integrationBaselineSha,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    closeoutScore: input.replayScaleWaveIntegrationCloseout.closeoutScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveIntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const handoffGate = {
    reportId: 'hg',
    matchId: 'self',
    waveRound: 46,
    handoffAllowed: true,
    blockerCount: 0,
    blockers: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswrhg_t20', { v: 1 }),
  };
  const attestationVerification = {
    reportId: 'av',
    matchId: 'self',
    waveRound: 46,
    verified: true,
    issueCount: 0,
    issues: [],
    attestationScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswav_t20', { v: 1 }),
  };
  const integrationCloseout = {
    reportId: 'ic',
    matchId: 'self',
    waveRound: 46,
    integrationBaselineSha: '680b9954',
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswic_t20', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveIntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveIntegrationCloseout: integrationCloseout,
    replayScaleWaveAttestationVerification: attestationVerification,
    archiveScaleWaveReleaseHandoffGate: handoffGate,
  });

  return [
    { name: 'verified_when_integration_stack_ready', passed: report.verified && report.issueCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 46 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveIntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveIntegrationCloseout: integrationCloseout,
          replayScaleWaveAttestationVerification: attestationVerification,
          archiveScaleWaveReleaseHandoffGate: handoffGate,
        }).deterministicFingerprint,
    },
  ];
}
