import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave30ExportGateReport } from './archive-scale-wave-wave30-export-gate.ts';
import type { Agent24ReplayScaleWaveWave29IntegrationVerificationReport } from './replay-scale-wave-wave29-integration-verification.ts';
import { O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave30IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave30IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave30IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave30IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave30ExportGate: Agent24ArchiveScaleWaveWave30ExportGateReport;
  replayScaleWaveWave29IntegrationVerification: Agent24ReplayScaleWaveWave29IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave30IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave30IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave30IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave29IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave29IntegrationVerification.verified &&
    input.archiveScaleWaveWave30ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave30IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w30_cp', { id: 'wave29_integration_verified', wave: waveRound }),
      label: 'Wave 29 integration verification',
      satisfied: input.replayScaleWaveWave29IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w30_cp', { id: 'wave30_export', wave: waveRound }),
      label: 'Wave 30 export gate',
      satisfied: input.archiveScaleWaveWave30ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w30_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w30_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave30ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave30_integration_handoff', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: integrationBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    integrationBaselineSha,
    handoffComplete,
    checkpointCount: checkpoints.length,
    satisfiedCheckpointCount,
    checkpoints,
    handoffScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave30_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave30IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave29IntegrationVerification = {
    reportId: 'w29iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: '70df4aee',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww29iv_t30', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg30',
    matchId: 'self',
    waveRound: 33,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww30_t30', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave30IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave30ExportGate: exportGate,
    replayScaleWaveWave29IntegrationVerification: wave29IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave30_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave30IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave30ExportGate: exportGate,
          replayScaleWaveWave29IntegrationVerification: wave29IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
