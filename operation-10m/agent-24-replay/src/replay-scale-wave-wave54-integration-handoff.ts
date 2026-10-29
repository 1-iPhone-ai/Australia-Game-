import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave54ExportGateReport } from './archive-scale-wave-wave54-export-gate.ts';
import type { Agent24ReplayScaleWaveWave53IntegrationVerificationReport } from './replay-scale-wave-wave53-integration-verification.ts';
import { O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave54IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave54IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave54IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave54IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave54ExportGate: Agent24ArchiveScaleWaveWave54ExportGateReport;
  replayScaleWaveWave53IntegrationVerification: Agent24ReplayScaleWaveWave53IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave54IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave54IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave54IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave53IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave53IntegrationVerification.verified &&
    input.archiveScaleWaveWave54ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave54IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w54_cp', { id: 'wave47_integration_verified', wave: waveRound }),
      label: 'Wave 46 integration verification',
      satisfied: input.replayScaleWaveWave53IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w54_cp', { id: 'wave54_export', wave: waveRound }),
      label: 'Wave 47 export gate',
      satisfied: input.archiveScaleWaveWave54ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w54_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w54_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave54ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave54_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave54_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave54IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave53IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 52,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww53iv_t54', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg54',
    matchId: 'self',
    waveRound: 52,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww54_t53', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave54IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave54ExportGate: exportGate,
    replayScaleWaveWave53IntegrationVerification: wave53IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave54_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE54_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 52 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave54IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave54ExportGate: exportGate,
          replayScaleWaveWave53IntegrationVerification: wave53IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
