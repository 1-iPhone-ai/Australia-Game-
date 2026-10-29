import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave64ExportGateReport } from './archive-scale-wave-wave64-export-gate.ts';
import type { Agent24ReplayScaleWaveWave54IntegrationVerificationReport } from './replay-scale-wave-wave54-integration-verification.ts';
import { O6K_AGENT24_WAVE64_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave64IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave64IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave64IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave64IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave64ExportGate: Agent24ArchiveScaleWaveWave64ExportGateReport;
  replayScaleWaveWave54IntegrationVerification: Agent24ReplayScaleWaveWave54IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave64IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave64IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave64IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave54IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE64_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave54IntegrationVerification.verified &&
    input.archiveScaleWaveWave64ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave64IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w55_cp', { id: 'wave47_integration_verified', wave: waveRound }),
      label: 'Wave 46 integration verification',
      satisfied: input.replayScaleWaveWave54IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w55_cp', { id: 'wave64_export', wave: waveRound }),
      label: 'Wave 47 export gate',
      satisfied: input.archiveScaleWaveWave64ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w55_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w55_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave64ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave64_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave64_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave64IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave54IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 52,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww54iv_t55', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg55',
    matchId: 'self',
    waveRound: 52,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww55_t53', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave64IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave64ExportGate: exportGate,
    replayScaleWaveWave54IntegrationVerification: wave54IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave64_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE64_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 52 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave64IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave64ExportGate: exportGate,
          replayScaleWaveWave54IntegrationVerification: wave54IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
