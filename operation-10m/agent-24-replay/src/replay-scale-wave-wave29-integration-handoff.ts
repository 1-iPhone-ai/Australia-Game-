import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave29ExportGateReport } from './archive-scale-wave-wave29-export-gate.ts';
import type { Agent24ReplayScaleWaveWave28IntegrationVerificationReport } from './replay-scale-wave-wave28-integration-verification.ts';
import { O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave29IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave29IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave29IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave29IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave29ExportGate: Agent24ArchiveScaleWaveWave29ExportGateReport;
  replayScaleWaveWave28IntegrationVerification: Agent24ReplayScaleWaveWave28IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave29IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave29IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave29IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave28IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave28IntegrationVerification.verified &&
    input.archiveScaleWaveWave29ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave29IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w29_cp', { id: 'wave28_integration_verified', wave: waveRound }),
      label: 'Wave 28 integration verification',
      satisfied: input.replayScaleWaveWave28IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w29_cp', { id: 'wave29_export', wave: waveRound }),
      label: 'Wave 29 export gate',
      satisfied: input.archiveScaleWaveWave29ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w29_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w29_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave29ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave29_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave29_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave29IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave28IntegrationVerification = {
    reportId: 'w28iv',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: 'b9e129bd',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww28iv_t29', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg29',
    matchId: 'self',
    waveRound: 34,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww29_t29', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave29IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave29ExportGate: exportGate,
    replayScaleWaveWave28IntegrationVerification: wave28IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave29_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 34 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave29IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave29ExportGate: exportGate,
          replayScaleWaveWave28IntegrationVerification: wave28IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
