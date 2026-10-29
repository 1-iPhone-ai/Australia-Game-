import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave47ExportGateReport } from './archive-scale-wave-wave47-export-gate.ts';
import type { Agent24ReplayScaleWaveWave46IntegrationVerificationReport } from './replay-scale-wave-wave46-integration-verification.ts';
import { O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave47IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave47IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave47IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave47IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave47ExportGate: Agent24ArchiveScaleWaveWave47ExportGateReport;
  replayScaleWaveWave46IntegrationVerification: Agent24ReplayScaleWaveWave46IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave47IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave47IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave46IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave46IntegrationVerification.verified &&
    input.archiveScaleWaveWave47ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave47IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w47_cp', { id: 'wave42_integration_verified', wave: waveRound }),
      label: 'Wave 41 integration verification',
      satisfied: input.replayScaleWaveWave46IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w47_cp', { id: 'wave47_export', wave: waveRound }),
      label: 'Wave 42 export gate',
      satisfied: input.archiveScaleWaveWave47ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w47_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w47_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave47ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave47_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave47_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave47IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave46IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 46,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww46iv_t47', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg47',
    matchId: 'self',
    waveRound: 46,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww47_t46', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave47ExportGate: exportGate,
    replayScaleWaveWave46IntegrationVerification: wave46IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave47_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 46 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave47IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave47ExportGate: exportGate,
          replayScaleWaveWave46IntegrationVerification: wave46IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
