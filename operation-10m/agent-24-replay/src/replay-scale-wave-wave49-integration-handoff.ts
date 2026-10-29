import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave49ExportGateReport } from './archive-scale-wave-wave49-export-gate.ts';
import type { Agent24ReplayScaleWaveWave48IntegrationVerificationReport } from './replay-scale-wave-wave48-integration-verification.ts';
import { O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave49IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave49IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave49IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave49IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave49ExportGate: Agent24ArchiveScaleWaveWave49ExportGateReport;
  replayScaleWaveWave48IntegrationVerification: Agent24ReplayScaleWaveWave48IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave49IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave49IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave48IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave48IntegrationVerification.verified &&
    input.archiveScaleWaveWave49ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave49IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w49_cp', { id: 'wave44_integration_verified', wave: waveRound }),
      label: 'Wave 43 integration verification',
      satisfied: input.replayScaleWaveWave48IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w49_cp', { id: 'wave49_export', wave: waveRound }),
      label: 'Wave 44 export gate',
      satisfied: input.archiveScaleWaveWave49ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w49_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w49_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave49ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave49_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave49_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave49IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave48IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 48,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww48iv_t49', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg49',
    matchId: 'self',
    waveRound: 48,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww49_t48', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave49ExportGate: exportGate,
    replayScaleWaveWave48IntegrationVerification: wave48IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave49_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 48 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave49IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave49ExportGate: exportGate,
          replayScaleWaveWave48IntegrationVerification: wave48IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
