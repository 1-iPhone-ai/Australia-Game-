import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave45ExportGateReport } from './archive-scale-wave-wave45-export-gate.ts';
import type { Agent24ReplayScaleWaveWave44IntegrationVerificationReport } from './replay-scale-wave-wave44-integration-verification.ts';
import { O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave45IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave45IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave45IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave45IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave45ExportGate: Agent24ArchiveScaleWaveWave45ExportGateReport;
  replayScaleWaveWave44IntegrationVerification: Agent24ReplayScaleWaveWave44IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave45IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave45IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave45IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave44IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave44IntegrationVerification.verified &&
    input.archiveScaleWaveWave45ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave45IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w45_cp', { id: 'wave40_integration_verified', wave: waveRound }),
      label: 'Wave 39 integration verification',
      satisfied: input.replayScaleWaveWave44IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w45_cp', { id: 'wave45_export', wave: waveRound }),
      label: 'Wave 40 export gate',
      satisfied: input.archiveScaleWaveWave45ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w45_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w45_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave45ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave45_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave45_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave45IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave44IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 44,
    integrationBaselineSha: 'bca7e0a3',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww44iv_t45', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg45',
    matchId: 'self',
    waveRound: 44,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww45_t44', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave45IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave45ExportGate: exportGate,
    replayScaleWaveWave44IntegrationVerification: wave44IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave45_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 44 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave45IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave45ExportGate: exportGate,
          replayScaleWaveWave44IntegrationVerification: wave44IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
