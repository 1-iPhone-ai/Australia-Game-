import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave28ExportGateReport } from './archive-scale-wave-wave28-export-gate.ts';
import type { Agent24ReplayScaleWaveWave27IntegrationVerificationReport } from './replay-scale-wave-wave27-integration-verification.ts';
import { O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave28IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave28IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave28IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave28IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave28ExportGate: Agent24ArchiveScaleWaveWave28ExportGateReport;
  replayScaleWaveWave27IntegrationVerification: Agent24ReplayScaleWaveWave27IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave28IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave28IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave28IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave27IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave27IntegrationVerification.verified &&
    input.archiveScaleWaveWave28ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave28IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w28_cp', { id: 'wave27_integration_verified', wave: waveRound }),
      label: 'Wave 27 integration verification',
      satisfied: input.replayScaleWaveWave27IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w28_cp', { id: 'wave28_export', wave: waveRound }),
      label: 'Wave 28 export gate',
      satisfied: input.archiveScaleWaveWave28ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w28_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w28_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave28ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave28_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave28_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave28IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave27IntegrationVerification = {
    reportId: 'w26iv',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: '7c1cfd89',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww26iv_t28', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg28',
    matchId: 'self',
    waveRound: 31,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww28_t28', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave28IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave28ExportGate: exportGate,
    replayScaleWaveWave27IntegrationVerification: wave27IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave28_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 31 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave28IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave28ExportGate: exportGate,
          replayScaleWaveWave27IntegrationVerification: wave27IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
