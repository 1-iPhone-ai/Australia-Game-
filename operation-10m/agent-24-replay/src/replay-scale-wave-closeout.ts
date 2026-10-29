import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveReleaseVerificationReport } from './archive-release-verification.ts';
import type { Agent24ReplayScaleWaveAcceptanceReport } from './replay-scale-wave-acceptance.ts';
import type { Agent24ReplayScaleWaveHandoffSeal } from './replay-scale-wave-handoff-seal.ts';

export interface Agent24ReplayScaleWaveCloseoutCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveCloseoutReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  closeoutComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveCloseoutCheckpoint[];
  closeoutScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveCloseoutInput {
  matchId: string;
  replayScaleWaveAcceptance: Agent24ReplayScaleWaveAcceptanceReport;
  replayScaleWaveHandoffSeal: Agent24ReplayScaleWaveHandoffSeal;
  archiveReleaseVerification: Agent24ArchiveReleaseVerificationReport;
}

export function buildAgent24ReplayScaleWaveCloseoutReport(
  input: Agent24ReplayScaleWaveCloseoutInput,
): Agent24ReplayScaleWaveCloseoutReport {
  const waveRound = input.replayScaleWaveAcceptance.waveRound;

  const checkpoints: Agent24ReplayScaleWaveCloseoutCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_closeout_cp', { id: 'wave_acceptance', wave: waveRound }),
      label: 'Replay scale wave acceptance',
      satisfied: input.replayScaleWaveAcceptance.accepted,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_closeout_cp', { id: 'release_verification', wave: waveRound }),
      label: 'Archive release verification',
      satisfied: input.archiveReleaseVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_closeout_cp', { id: 'scale_wave_handoff', wave: waveRound }),
      label: 'Scale wave handoff seal',
      satisfied: input.replayScaleWaveHandoffSeal.handoffReady,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_closeout_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let closeoutScore = 100;
  closeoutScore -= (checkpoints.length - satisfiedCheckpointCount) * 21;
  closeoutScore -= Math.max(0, 100 - input.replayScaleWaveHandoffSeal.handoffScore) * 0.1;
  closeoutScore = Math.max(0, Math.min(100, Math.round(closeoutScore)));

  const closeoutComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_closeout', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    closeoutComplete,
    checkpointCount: checkpoints.length,
    satisfiedCheckpointCount,
    checkpoints,
    closeoutScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_closeout_body', {
      waveRound,
      checkpoints: checkpoints.map(c => c.fingerprint),
      closeoutComplete,
      closeoutScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveCloseoutSelfTests(): Array<{ name: string; passed: boolean }> {
  const waveAcceptance = {
    reportId: 'wa',
    matchId: 'self',
    waveRound: 23,
    accepted: true,
    blockerCount: 0,
    blockers: [],
    acceptanceScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswa_t', { v: 2 }),
  };
  const releaseVerification = {
    reportId: 'rv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    releaseScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('arv_t', { v: 1 }),
  };
  const handoffSeal = {
    sealId: 'sws',
    matchId: 'self',
    waveRound: 23,
    handoffReady: true,
    linkCount: 3,
    readyLinkCount: 3,
    links: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswhs_t', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveCloseoutReport({
    matchId: 'self',
    replayScaleWaveAcceptance: waveAcceptance,
    replayScaleWaveHandoffSeal: handoffSeal,
    archiveReleaseVerification: releaseVerification,
  });

  return [
    { name: 'closeout_complete_when_wave_pipeline_ready', passed: report.closeoutComplete && report.waveRound === 23 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveCloseoutReport({
          matchId: 'self',
          replayScaleWaveAcceptance: waveAcceptance,
          replayScaleWaveHandoffSeal: handoffSeal,
          archiveReleaseVerification: releaseVerification,
        }).deterministicFingerprint,
    },
  ];
}
