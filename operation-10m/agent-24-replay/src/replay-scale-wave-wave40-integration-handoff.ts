import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave40ExportGateReport } from './archive-scale-wave-wave40-export-gate.ts';
import type { Agent24ReplayScaleWaveWave39IntegrationVerificationReport } from './replay-scale-wave-wave39-integration-verification.ts';
import { O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave40IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave40IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave40IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave40IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave40ExportGate: Agent24ArchiveScaleWaveWave40ExportGateReport;
  replayScaleWaveWave39IntegrationVerification: Agent24ReplayScaleWaveWave39IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave40IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave40IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave40IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave39IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave39IntegrationVerification.verified &&
    input.archiveScaleWaveWave40ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave40IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w40_cp', { id: 'wave36_integration_verified', wave: waveRound }),
      label: 'Wave 35 integration verification',
      satisfied: input.replayScaleWaveWave39IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w40_cp', { id: 'wave40_export', wave: waveRound }),
      label: 'Wave 36 export gate',
      satisfied: input.archiveScaleWaveWave40ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w40_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w40_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave40ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave40_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave40_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave40IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave39IntegrationVerification = {
    reportId: 'w39iv',
    matchId: 'self',
    waveRound: 39,
    integrationBaselineSha: '6134c6ae',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww39iv_t40', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg40',
    matchId: 'self',
    waveRound: 39,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww40_t39', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave40IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave40ExportGate: exportGate,
    replayScaleWaveWave39IntegrationVerification: wave39IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave40_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 39 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave40IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave40ExportGate: exportGate,
          replayScaleWaveWave39IntegrationVerification: wave39IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
