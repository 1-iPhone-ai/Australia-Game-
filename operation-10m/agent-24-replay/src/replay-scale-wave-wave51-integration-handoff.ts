import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave51ExportGateReport } from './archive-scale-wave-wave51-export-gate.ts';
import type { Agent24ReplayScaleWaveWave50IntegrationVerificationReport } from './replay-scale-wave-wave50-integration-verification.ts';
import { O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave51IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave51IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave51IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave51IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave51ExportGate: Agent24ArchiveScaleWaveWave51ExportGateReport;
  replayScaleWaveWave50IntegrationVerification: Agent24ReplayScaleWaveWave50IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave51IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave51IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave51IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave50IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave50IntegrationVerification.verified &&
    input.archiveScaleWaveWave51ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave51IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w51_cp', { id: 'wave46_integration_verified', wave: waveRound }),
      label: 'Wave 45 integration verification',
      satisfied: input.replayScaleWaveWave50IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w51_cp', { id: 'wave51_export', wave: waveRound }),
      label: 'Wave 46 export gate',
      satisfied: input.archiveScaleWaveWave51ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w51_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w51_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave51ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave51_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave51_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave51IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave50IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 50,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww50iv_t51', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg51',
    matchId: 'self',
    waveRound: 50,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww51_t50', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave51IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave51ExportGate: exportGate,
    replayScaleWaveWave50IntegrationVerification: wave50IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave51_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 50 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave51IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave51ExportGate: exportGate,
          replayScaleWaveWave50IntegrationVerification: wave50IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
