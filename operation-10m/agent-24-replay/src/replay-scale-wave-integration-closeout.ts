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

/** O10-174 integration baseline anchor (wave 22 roster). */
export const O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA = '634656bb';

/** O10-176 integration baseline anchor (wave 23 roster). */
export const O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA = 'b23e1449';

/** O10-179 integration baseline anchor (wave 24 roster). */
export const O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA = 'b64a7aa8';

/** O10-181 integration baseline anchor (wave 25 roster). */
export const O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA = '8d741ac7';

/** O10-183 integration baseline anchor (wave 26 roster). */
export const O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA = 'de3079f9';

/** O10-185 integration baseline anchor (wave 27 roster). */
export const O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA = '7c1cfd89';

/** O10-187 integration baseline anchor (wave 28 roster). */
export const O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA = 'b9e129bd';

/** O10-189 integration baseline anchor (wave 29 roster). */
export const O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA = '70df4aee';

/** O10-191 integration baseline anchor (wave 30 roster). */
export const O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA = '88fa570e';

/** O10-193 integration baseline anchor (wave 31 roster). */
export const O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA = '81b50b8e';

/** O10-195 integration baseline anchor (wave 32 roster). */
export const O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA = 'aa70dace';

/** O10-197 integration baseline anchor (wave 33 roster). */
export const O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA = 'c5f6d0be';

/** O10-199 integration baseline anchor (wave 34 roster). */
export const O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA = '2187b54e';

/** O10-201 integration baseline anchor (wave 35 roster). */
export const O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA = '1f7d25be';

/** O10-203 integration baseline anchor (wave 36 roster). */
export const O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA = 'ea2bb03e';

/** O10-205 integration baseline anchor (wave 37 roster). */
export const O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA = 'cfb4603e';

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
    (waveRound >= 37
      ? O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA
      : waveRound >= 36
      ? O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA
      : waveRound >= 35
      ? O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA
      : waveRound >= 34
      ? O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA
      : waveRound >= 33
      ? O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA
      : waveRound >= 32
      ? O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA
      : waveRound >= 31
      ? O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA
      : waveRound >= 30
      ? O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA
      : waveRound >= 29
      ? O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA
      : waveRound >= 28
      ? O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA
      : waveRound >= 27
        ? O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA
        : waveRound >= 26
        ? O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA
        : waveRound >= 25
        ? O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA
        : waveRound >= 24
        ? O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA
        : waveRound >= 23
        ? O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA
        : waveRound >= 22
          ? O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA
          : waveRound >= 21
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
    waveRound: 37,
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
    waveRound: 37,
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
    waveRound: 37,
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
      passed: report.closeoutComplete && report.integrationBaselineSha === O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 37 },
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
