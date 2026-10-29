import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWavePostProjectionGateReport } from './archive-scale-wave-post-projection-gate.ts';
import type { Agent24ReplayScaleWaveProjectionVerificationReport } from './replay-scale-wave-projection-verification.ts';
import {
  O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';

/** @deprecated use integration-closeout WAVE21 constant */
export { O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA };

export interface Agent24ReplayScaleWaveDryrunHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveDryrunHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  dryrunBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveDryrunHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveDryrunHandoffInput {
  matchId: string;
  archiveScaleWavePostProjectionGate: Agent24ArchiveScaleWavePostProjectionGateReport;
  replayScaleWaveProjectionVerification: Agent24ReplayScaleWaveProjectionVerificationReport;
  dryrunBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveDryrunHandoffReport(
  input: Agent24ReplayScaleWaveDryrunHandoffInput,
): Agent24ReplayScaleWaveDryrunHandoffReport {
  const waveRound = input.replayScaleWaveProjectionVerification.waveRound;
  const dryrunBaselineSha =
    input.dryrunBaselineSha ??
    (waveRound >= 26
      ? O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA
      : waveRound >= 25
        ? O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA
        : waveRound >= 24
        ? O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA
        : waveRound >= 23
        ? O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA
        : waveRound >= 22
          ? O6K_AGENT24_WAVE22_INTEGRATION_BASELINE_SHA
          : O6K_AGENT24_WAVE21_INTEGRATION_BASELINE_SHA);
  const baselineAligned = input.replayScaleWaveProjectionVerification.projectionBaselineSha === dryrunBaselineSha;

  const checkpoints: Agent24ReplayScaleWaveDryrunHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_dryrun_cp', { id: 'projection_verified', wave: waveRound }),
      label: 'Projection verification',
      satisfied: input.replayScaleWaveProjectionVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_dryrun_cp', { id: 'post_projection_gate', wave: waveRound }),
      label: 'Post-projection gate',
      satisfied: input.archiveScaleWavePostProjectionGate.gateOpen,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_dryrun_cp', { id: 'dryrun_baseline', wave: waveRound }),
      label: 'Dry-run baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_dryrun_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: dryrunBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 19;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWavePostProjectionGate.gateScore) * 0.09;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_dryrun_handoff', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: dryrunBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    dryrunBaselineSha,
    handoffComplete,
    checkpointCount: checkpoints.length,
    satisfiedCheckpointCount,
    checkpoints,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_dryrun_handoff_body', {
      waveRound,
      baseline: dryrunBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveDryrunHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const projectionVerification = {
    reportId: 'pv',
    matchId: 'self',
    waveRound: 26,
    projectionBaselineSha: O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswpv_t21', { v: 3 }),
  };
  const postProjectionGate = {
    reportId: 'ppg',
    matchId: 'self',
    waveRound: 26,
    gateOpen: true,
    blockerCount: 0,
    blockers: [],
    gateScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswpp_t21', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveDryrunHandoffReport({
    matchId: 'self',
    archiveScaleWavePostProjectionGate: postProjectionGate,
    replayScaleWaveProjectionVerification: projectionVerification,
  });

  return [
    {
      name: 'dryrun_handoff_complete_at_wave26_baseline',
      passed:
        report.handoffComplete &&
        report.dryrunBaselineSha === O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 26 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveDryrunHandoffReport({
          matchId: 'self',
          archiveScaleWavePostProjectionGate: postProjectionGate,
          replayScaleWaveProjectionVerification: projectionVerification,
        }).deterministicFingerprint,
    },
  ];
}
