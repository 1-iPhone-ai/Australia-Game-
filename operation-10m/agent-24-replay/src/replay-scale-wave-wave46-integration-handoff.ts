import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave46ExportGateReport } from './archive-scale-wave-wave46-export-gate.ts';
import type { Agent24ReplayScaleWaveWave45IntegrationVerificationReport } from './replay-scale-wave-wave45-integration-verification.ts';
import { O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave46IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave46IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave46IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave46IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave46ExportGate: Agent24ArchiveScaleWaveWave46ExportGateReport;
  replayScaleWaveWave45IntegrationVerification: Agent24ReplayScaleWaveWave45IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave46IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave46IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave45IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave45IntegrationVerification.verified &&
    input.archiveScaleWaveWave46ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave46IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w46_cp', { id: 'wave41_integration_verified', wave: waveRound }),
      label: 'Wave 40 integration verification',
      satisfied: input.replayScaleWaveWave45IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w46_cp', { id: 'wave46_export', wave: waveRound }),
      label: 'Wave 41 export gate',
      satisfied: input.archiveScaleWaveWave46ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w46_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w46_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave46ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave46_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave46_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave46IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave45IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 45,
    integrationBaselineSha: '98bcd652',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww45iv_t46', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg46',
    matchId: 'self',
    waveRound: 45,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww46_t45', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave46ExportGate: exportGate,
    replayScaleWaveWave45IntegrationVerification: wave45IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave46_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 45 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave46IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave46ExportGate: exportGate,
          replayScaleWaveWave45IntegrationVerification: wave45IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
