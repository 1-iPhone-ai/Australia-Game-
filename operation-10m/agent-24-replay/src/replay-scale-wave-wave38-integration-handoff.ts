import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave38ExportGateReport } from './archive-scale-wave-wave38-export-gate.ts';
import type { Agent24ReplayScaleWaveWave37IntegrationVerificationReport } from './replay-scale-wave-wave37-integration-verification.ts';
import { O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave38IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave38IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave38IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave38IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave38ExportGate: Agent24ArchiveScaleWaveWave38ExportGateReport;
  replayScaleWaveWave37IntegrationVerification: Agent24ReplayScaleWaveWave37IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave38IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave38IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave38IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave37IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave37IntegrationVerification.verified &&
    input.archiveScaleWaveWave38ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave38IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w38_cp', { id: 'wave36_integration_verified', wave: waveRound }),
      label: 'Wave 35 integration verification',
      satisfied: input.replayScaleWaveWave37IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w38_cp', { id: 'wave38_export', wave: waveRound }),
      label: 'Wave 36 export gate',
      satisfied: input.archiveScaleWaveWave38ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w38_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w38_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave38ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave38_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave38_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave38IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave37IntegrationVerification = {
    reportId: 'w37iv',
    matchId: 'self',
    waveRound: 37,
    integrationBaselineSha: 'cfb4603e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww37iv_t38', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg38',
    matchId: 'self',
    waveRound: 37,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww38_t37', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave38IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave38ExportGate: exportGate,
    replayScaleWaveWave37IntegrationVerification: wave37IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave38_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 37 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave38IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave38ExportGate: exportGate,
          replayScaleWaveWave37IntegrationVerification: wave37IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
