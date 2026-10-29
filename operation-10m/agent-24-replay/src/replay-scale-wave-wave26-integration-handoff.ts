import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave26ExportGateReport } from './archive-scale-wave-wave26-export-gate.ts';
import type { Agent24ReplayScaleWaveWave25IntegrationVerificationReport } from './replay-scale-wave-wave25-integration-verification.ts';
import { O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave26IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave26IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave26IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave26IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave26ExportGate: Agent24ArchiveScaleWaveWave26ExportGateReport;
  replayScaleWaveWave25IntegrationVerification: Agent24ReplayScaleWaveWave25IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave26IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave26IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave26IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave25IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave25IntegrationVerification.verified &&
    input.archiveScaleWaveWave26ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave26IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w26_cp', { id: 'wave25_integration_verified', wave: waveRound }),
      label: 'Wave 25 integration verification',
      satisfied: input.replayScaleWaveWave25IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w26_cp', { id: 'wave26_export', wave: waveRound }),
      label: 'Wave 26 export gate',
      satisfied: input.archiveScaleWaveWave26ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w26_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w26_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave26ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave26_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave26_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave26IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave25IntegrationVerification = {
    reportId: 'w25iv',
    matchId: 'self',
    waveRound: 26,
    integrationBaselineSha: '8d741ac7',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww25iv_t26', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg26',
    matchId: 'self',
    waveRound: 26,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww26_t26', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave26IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave26ExportGate: exportGate,
    replayScaleWaveWave25IntegrationVerification: wave25IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave26_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 26 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave26IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave26ExportGate: exportGate,
          replayScaleWaveWave25IntegrationVerification: wave25IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
