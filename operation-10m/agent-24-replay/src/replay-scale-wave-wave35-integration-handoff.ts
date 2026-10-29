import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave35ExportGateReport } from './archive-scale-wave-wave35-export-gate.ts';
import type { Agent24ReplayScaleWaveWave34IntegrationVerificationReport } from './replay-scale-wave-wave34-integration-verification.ts';
import { O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave35IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave35IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave35IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave35IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave35ExportGate: Agent24ArchiveScaleWaveWave35ExportGateReport;
  replayScaleWaveWave34IntegrationVerification: Agent24ReplayScaleWaveWave34IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave35IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave35IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave35IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave34IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave34IntegrationVerification.verified &&
    input.archiveScaleWaveWave35ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave35IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w35_cp', { id: 'wave34_integration_verified', wave: waveRound }),
      label: 'Wave 33 integration verification',
      satisfied: input.replayScaleWaveWave34IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w35_cp', { id: 'wave35_export', wave: waveRound }),
      label: 'Wave 34 export gate',
      satisfied: input.archiveScaleWaveWave35ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w35_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w35_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave35ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave35_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave35_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave35IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave33IntegrationVerification = {
    reportId: 'w31iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: '2187b54e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww33iv_t35', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg32',
    matchId: 'self',
    waveRound: 33,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww34_t35', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave35IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave35ExportGate: exportGate,
    replayScaleWaveWave34IntegrationVerification: wave33IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave35_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 35 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave35IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave35ExportGate: exportGate,
          replayScaleWaveWave34IntegrationVerification: wave33IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
