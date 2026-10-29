import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave48ExportGateReport } from './archive-scale-wave-wave48-export-gate.ts';
import type { Agent24ReplayScaleWaveWave47IntegrationVerificationReport } from './replay-scale-wave-wave47-integration-verification.ts';
import { O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave48IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave48IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave48IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave48IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave48ExportGate: Agent24ArchiveScaleWaveWave48ExportGateReport;
  replayScaleWaveWave47IntegrationVerification: Agent24ReplayScaleWaveWave47IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave48IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave48IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave47IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave47IntegrationVerification.verified &&
    input.archiveScaleWaveWave48ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave48IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w48_cp', { id: 'wave43_integration_verified', wave: waveRound }),
      label: 'Wave 42 integration verification',
      satisfied: input.replayScaleWaveWave47IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w48_cp', { id: 'wave48_export', wave: waveRound }),
      label: 'Wave 43 export gate',
      satisfied: input.archiveScaleWaveWave48ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w48_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w48_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave48ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave48_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave48_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave48IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave47IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 47,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww47iv_t48', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg48',
    matchId: 'self',
    waveRound: 47,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww48_t47', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave48ExportGate: exportGate,
    replayScaleWaveWave47IntegrationVerification: wave47IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave48_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 47 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave48IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave48ExportGate: exportGate,
          replayScaleWaveWave47IntegrationVerification: wave47IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
