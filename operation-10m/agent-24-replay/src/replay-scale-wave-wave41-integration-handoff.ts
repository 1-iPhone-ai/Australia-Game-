import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave41ExportGateReport } from './archive-scale-wave-wave41-export-gate.ts';
import type { Agent24ReplayScaleWaveWave40IntegrationVerificationReport } from './replay-scale-wave-wave40-integration-verification.ts';
import { O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave41IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave41IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave41IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave41IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave41ExportGate: Agent24ArchiveScaleWaveWave41ExportGateReport;
  replayScaleWaveWave40IntegrationVerification: Agent24ReplayScaleWaveWave40IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave41IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave41IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave41IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave40IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave40IntegrationVerification.verified &&
    input.archiveScaleWaveWave41ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave41IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w41_cp', { id: 'wave36_integration_verified', wave: waveRound }),
      label: 'Wave 35 integration verification',
      satisfied: input.replayScaleWaveWave40IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w41_cp', { id: 'wave41_export', wave: waveRound }),
      label: 'Wave 36 export gate',
      satisfied: input.archiveScaleWaveWave41ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w41_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w41_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave41ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave41_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave41_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave41IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave40IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 40,
    integrationBaselineSha: '6f7fa49e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww40iv_t41', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg41',
    matchId: 'self',
    waveRound: 40,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww41_t40', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave41IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave41ExportGate: exportGate,
    replayScaleWaveWave40IntegrationVerification: wave40IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave41_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 40 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave41IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave41ExportGate: exportGate,
          replayScaleWaveWave40IntegrationVerification: wave40IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
