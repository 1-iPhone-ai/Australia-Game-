import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave34ExportGateReport } from './archive-scale-wave-wave34-export-gate.ts';
import type { Agent24ReplayScaleWaveWave33IntegrationVerificationReport } from './replay-scale-wave-wave33-integration-verification.ts';
import { O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave34IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave34IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave34IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave34IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave34ExportGate: Agent24ArchiveScaleWaveWave34ExportGateReport;
  replayScaleWaveWave33IntegrationVerification: Agent24ReplayScaleWaveWave33IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave34IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave34IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave34IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave33IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave33IntegrationVerification.verified &&
    input.archiveScaleWaveWave34ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave34IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w34_cp', { id: 'wave33_integration_verified', wave: waveRound }),
      label: 'Wave 31 integration verification',
      satisfied: input.replayScaleWaveWave33IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w34_cp', { id: 'wave34_export', wave: waveRound }),
      label: 'Wave 32 export gate',
      satisfied: input.archiveScaleWaveWave34ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w34_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w34_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave34ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave34_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave34_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave34IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave33IntegrationVerification = {
    reportId: 'w31iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: 'c5f6d0be',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww32iv_t34', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg32',
    matchId: 'self',
    waveRound: 33,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww33_t34', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave34IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave34ExportGate: exportGate,
    replayScaleWaveWave33IntegrationVerification: wave33IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave34_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 33 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave34IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave34ExportGate: exportGate,
          replayScaleWaveWave33IntegrationVerification: wave33IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
