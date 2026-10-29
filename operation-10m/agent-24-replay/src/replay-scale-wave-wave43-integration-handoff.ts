import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave43ExportGateReport } from './archive-scale-wave-wave43-export-gate.ts';
import type { Agent24ReplayScaleWaveWave42IntegrationVerificationReport } from './replay-scale-wave-wave42-integration-verification.ts';
import { O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave43IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave43IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave43IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave43IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave43ExportGate: Agent24ArchiveScaleWaveWave43ExportGateReport;
  replayScaleWaveWave42IntegrationVerification: Agent24ReplayScaleWaveWave42IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave43IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave43IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave43IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave42IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave42IntegrationVerification.verified &&
    input.archiveScaleWaveWave43ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave43IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w43_cp', { id: 'wave38_integration_verified', wave: waveRound }),
      label: 'Wave 37 integration verification',
      satisfied: input.replayScaleWaveWave42IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w43_cp', { id: 'wave43_export', wave: waveRound }),
      label: 'Wave 38 export gate',
      satisfied: input.archiveScaleWaveWave43ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w43_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w43_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave43ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave43_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave43_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave43IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave42IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 42,
    integrationBaselineSha: '431df5de',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww42iv_t43', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg43',
    matchId: 'self',
    waveRound: 42,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww43_t42', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave43IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave43ExportGate: exportGate,
    replayScaleWaveWave42IntegrationVerification: wave42IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave43_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 42 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave43IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave43ExportGate: exportGate,
          replayScaleWaveWave42IntegrationVerification: wave42IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
