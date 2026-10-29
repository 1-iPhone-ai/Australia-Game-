import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave50ExportGateReport } from './archive-scale-wave-wave50-export-gate.ts';
import type { Agent24ReplayScaleWaveWave49IntegrationVerificationReport } from './replay-scale-wave-wave49-integration-verification.ts';
import { O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave50IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave50IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave50IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave50IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave50ExportGate: Agent24ArchiveScaleWaveWave50ExportGateReport;
  replayScaleWaveWave49IntegrationVerification: Agent24ReplayScaleWaveWave49IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave50IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave50IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave50IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave49IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave49IntegrationVerification.verified &&
    input.archiveScaleWaveWave50ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave50IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w50_cp', { id: 'wave45_integration_verified', wave: waveRound }),
      label: 'Wave 44 integration verification',
      satisfied: input.replayScaleWaveWave49IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w50_cp', { id: 'wave50_export', wave: waveRound }),
      label: 'Wave 45 export gate',
      satisfied: input.archiveScaleWaveWave50ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w50_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w50_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave50ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave50_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave50_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave50IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave49IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 49,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww49iv_t50', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg50',
    matchId: 'self',
    waveRound: 49,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww50_t49', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave50IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave50ExportGate: exportGate,
    replayScaleWaveWave49IntegrationVerification: wave49IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave50_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 49 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave50IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave50ExportGate: exportGate,
          replayScaleWaveWave49IntegrationVerification: wave49IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
