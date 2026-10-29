import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave31ExportGateReport } from './archive-scale-wave-wave31-export-gate.ts';
import type { Agent24ReplayScaleWaveWave30IntegrationVerificationReport } from './replay-scale-wave-wave30-integration-verification.ts';
import { O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave31IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave31IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave31IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave31IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave31ExportGate: Agent24ArchiveScaleWaveWave31ExportGateReport;
  replayScaleWaveWave30IntegrationVerification: Agent24ReplayScaleWaveWave30IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave31IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave31IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave31IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave30IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave30IntegrationVerification.verified &&
    input.archiveScaleWaveWave31ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave31IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w31_cp', { id: 'wave30_integration_verified', wave: waveRound }),
      label: 'Wave 30 integration verification',
      satisfied: input.replayScaleWaveWave30IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w31_cp', { id: 'wave31_export', wave: waveRound }),
      label: 'Wave 31 export gate',
      satisfied: input.archiveScaleWaveWave31ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w31_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w31_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave31ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave31_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave31_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave31IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave30IntegrationVerification = {
    reportId: 'w30iv',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: '88fa570e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww30iv_t31', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg31',
    matchId: 'self',
    waveRound: 31,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww31_t31', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave31IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave31ExportGate: exportGate,
    replayScaleWaveWave30IntegrationVerification: wave30IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave31_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 31 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave31IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave31ExportGate: exportGate,
          replayScaleWaveWave30IntegrationVerification: wave30IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
