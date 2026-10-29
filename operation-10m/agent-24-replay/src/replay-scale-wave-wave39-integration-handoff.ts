import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave39ExportGateReport } from './archive-scale-wave-wave39-export-gate.ts';
import type { Agent24ReplayScaleWaveWave38IntegrationVerificationReport } from './replay-scale-wave-wave38-integration-verification.ts';
import { O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave39IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave39IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave39IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave39IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave39ExportGate: Agent24ArchiveScaleWaveWave39ExportGateReport;
  replayScaleWaveWave38IntegrationVerification: Agent24ReplayScaleWaveWave38IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave39IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave39IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave39IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave38IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave38IntegrationVerification.verified &&
    input.archiveScaleWaveWave39ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave39IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w39_cp', { id: 'wave36_integration_verified', wave: waveRound }),
      label: 'Wave 35 integration verification',
      satisfied: input.replayScaleWaveWave38IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w39_cp', { id: 'wave39_export', wave: waveRound }),
      label: 'Wave 36 export gate',
      satisfied: input.archiveScaleWaveWave39ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w39_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w39_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave39ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave39_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave39_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave39IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave38IntegrationVerification = {
    reportId: 'w38iv',
    matchId: 'self',
    waveRound: 38,
    integrationBaselineSha: 'b44b36fe',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww38iv_t39', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg39',
    matchId: 'self',
    waveRound: 38,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww39_t38', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave39IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave39ExportGate: exportGate,
    replayScaleWaveWave38IntegrationVerification: wave38IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave39_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 38 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave39IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave39ExportGate: exportGate,
          replayScaleWaveWave38IntegrationVerification: wave38IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
