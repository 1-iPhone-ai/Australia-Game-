import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave27ExportGateReport } from './archive-scale-wave-wave27-export-gate.ts';
import type { Agent24ReplayScaleWaveWave26IntegrationVerificationReport } from './replay-scale-wave-wave26-integration-verification.ts';
import { O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave27IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave27IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave27IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave27IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave27ExportGate: Agent24ArchiveScaleWaveWave27ExportGateReport;
  replayScaleWaveWave26IntegrationVerification: Agent24ReplayScaleWaveWave26IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave27IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave27IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave27IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave26IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave26IntegrationVerification.verified &&
    input.archiveScaleWaveWave27ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave27IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w27_cp', { id: 'wave26_integration_verified', wave: waveRound }),
      label: 'Wave 26 integration verification',
      satisfied: input.replayScaleWaveWave26IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w27_cp', { id: 'wave27_export', wave: waveRound }),
      label: 'Wave 27 export gate',
      satisfied: input.archiveScaleWaveWave27ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w27_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w27_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave27ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave27_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave27_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave27IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave26IntegrationVerification = {
    reportId: 'w26iv',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: 'de3079f9',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww26iv_t27', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg27',
    matchId: 'self',
    waveRound: 34,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww27_t27', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave27IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave27ExportGate: exportGate,
    replayScaleWaveWave26IntegrationVerification: wave26IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave27_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 34 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave27IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave27ExportGate: exportGate,
          replayScaleWaveWave26IntegrationVerification: wave26IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
