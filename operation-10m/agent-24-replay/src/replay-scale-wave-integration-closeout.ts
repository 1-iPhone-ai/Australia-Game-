import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveReleaseHandoffGateReport } from './archive-scale-wave-release-handoff-gate.ts';
import type { Agent24ReplayScaleWaveAttestationVerificationReport } from './replay-scale-wave-attestation-verification.ts';
import type { Agent24ReplayScaleWaveCloseoutReport } from './replay-scale-wave-closeout.ts';

/** O10-167 integration baseline anchor (wave 19 roster). */
export const O6K_AGENT24_WAVE19_INTEGRATION_BASELINE_SHA = '7bd7b1f3';

/** O10-169 integration baseline anchor (wave 20 roster). */
export const O6K_AGENT24_WAVE20_INTEGRATION_BASELINE_SHA = '680b9954';

/** O10-171 integration baseline anchor (wave 21 roster). */
export const O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA = '99f2e72b';

export interface Agent24ReplayScaleWaveIntegrationCloseoutCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveIntegrationCloseoutReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  closeoutComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveIntegrationCloseoutCheckpoint[];
  closeoutScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveIntegrationCloseoutInput {
  matchId: string;
  archiveScaleWaveReleaseHandoffGate: Agent24ArchiveScaleWaveReleaseHandoffGateReport;
  replayScaleWaveAttestationVerification: Agent24ReplayScaleWaveAttestationVerificationReport;
  replayScaleWaveCloseout: Agent24ReplayScaleWaveCloseoutReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveIntegrationCloseoutReport(
  input: Agent24ReplayScaleWaveIntegrationCloseoutInput,
): Agent24ReplayScaleWaveIntegrationCloseoutReport {
  const waveRound = input.replayScaleWaveAttestationVerification.waveRound;
  const integrationBaselineSha =
    input.integrationBaselineSha ??
    (waveRound >= 21
      ? O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA
      : waveRound >= 20
        ? O6K_AGENT24_WAVE20_INTEGRATION_BASELINE_SHA
        : O6K_AGENT24_WAVE19_INTEGRATION_BASELINE_SHA);

  const checkpoints: Agent24ReplayScaleWaveIntegrationCloseoutCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_integration_cp', {
        id: 'wave_closeout',
        wave: waveRound,
      }),
      label: 'Replay scale wave closeout',
      satisfied: input.replayScaleWaveCloseout.closeoutComplete,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_integration_cp', {
        id: 'attestation_verification',
        wave: waveRound,
      }),
      label: 'Scale wave attestation verification',
      satisfied: input.replayScaleWaveAttestationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_integration_cp', {
        id: 'release_handoff_gate',
        wave: waveRound,
      }),
      label: 'Archive scale wave release handoff gate',
      satisfied: input.archiveScaleWaveReleaseHandoffGate.handoffAllowed,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_integration_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let closeoutScore = 100;
  closeoutScore -= (checkpoints.length - satisfiedCheckpointCount) * 20;
  closeoutScore -= Math.max(0, 100 - input.archiveScaleWaveReleaseHandoffGate.handoffScore) * 0.1;
  closeoutScore = Math.max(0, Math.min(100, Math.round(closeoutScore)));

  const closeoutComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_integration_closeout', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: integrationBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    integrationBaselineSha,
    closeoutComplete,
    checkpointCount: checkpoints.length,
    satisfiedCheckpointCount,
    checkpoints,
    closeoutScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_integration_closeout_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      closeoutComplete,
      closeoutScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveIntegrationCloseoutSelfTests(): Array<{ name: string; passed: boolean }> {
  const closeout = {
    reportId: 'co',
    matchId: 'self',
    waveRound: 21,
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswc_t19', { v: 1 }),
  };
  const attestationVerification = {
    reportId: 'av',
    matchId: 'self',
    waveRound: 21,
    verified: true,
    issueCount: 0,
    issues: [],
    attestationScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswav_t19', { v: 3 }),
  };
  const handoffGate = {
    reportId: 'hg',
    matchId: 'self',
    waveRound: 21,
    handoffAllowed: true,
    blockerCount: 0,
    blockers: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswrhg_t19', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveIntegrationCloseoutReport({
    matchId: 'self',
    archiveScaleWaveReleaseHandoffGate: handoffGate,
    replayScaleWaveAttestationVerification: attestationVerification,
    replayScaleWaveCloseout: closeout,
  });

  return [
    {
      name: 'integration_closeout_complete_when_wave_stack_ready',
      passed: report.closeoutComplete && report.integrationBaselineSha === O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 21 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveIntegrationCloseoutReport({
          matchId: 'self',
          archiveScaleWaveReleaseHandoffGate: handoffGate,
          replayScaleWaveAttestationVerification: attestationVerification,
          replayScaleWaveCloseout: closeout,
        }).deterministicFingerprint,
    },
  ];
}
