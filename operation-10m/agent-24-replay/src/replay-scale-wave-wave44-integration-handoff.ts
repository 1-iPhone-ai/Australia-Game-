import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave44ExportGateReport } from './archive-scale-wave-wave44-export-gate.ts';
import type { Agent24ReplayScaleWaveWave43IntegrationVerificationReport } from './replay-scale-wave-wave43-integration-verification.ts';
import { O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave44IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave44IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave44IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave44IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave44ExportGate: Agent24ArchiveScaleWaveWave44ExportGateReport;
  replayScaleWaveWave43IntegrationVerification: Agent24ReplayScaleWaveWave43IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave44IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave44IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave44IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave43IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave43IntegrationVerification.verified &&
    input.archiveScaleWaveWave44ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave44IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w44_cp', { id: 'wave39_integration_verified', wave: waveRound }),
      label: 'Wave 38 integration verification',
      satisfied: input.replayScaleWaveWave43IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w44_cp', { id: 'wave44_export', wave: waveRound }),
      label: 'Wave 39 export gate',
      satisfied: input.archiveScaleWaveWave44ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w44_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w44_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave44ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave44_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave44_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave44IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave43IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 43,
    integrationBaselineSha: '641d7d16',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww43iv_t44', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg44',
    matchId: 'self',
    waveRound: 43,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww44_t43', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave44IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave44ExportGate: exportGate,
    replayScaleWaveWave43IntegrationVerification: wave43IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave44_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 43 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave44IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave44ExportGate: exportGate,
          replayScaleWaveWave43IntegrationVerification: wave43IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
