import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave42ExportGateReport } from './archive-scale-wave-wave42-export-gate.ts';
import type { Agent24ReplayScaleWaveWave41IntegrationVerificationReport } from './replay-scale-wave-wave41-integration-verification.ts';
import { O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave42IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave42IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave42IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave42IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave42ExportGate: Agent24ArchiveScaleWaveWave42ExportGateReport;
  replayScaleWaveWave41IntegrationVerification: Agent24ReplayScaleWaveWave41IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave42IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave42IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave42IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave41IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave41IntegrationVerification.verified &&
    input.archiveScaleWaveWave42ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave42IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w42_cp', { id: 'wave37_integration_verified', wave: waveRound }),
      label: 'Wave 36 integration verification',
      satisfied: input.replayScaleWaveWave41IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w42_cp', { id: 'wave42_export', wave: waveRound }),
      label: 'Wave 37 export gate',
      satisfied: input.archiveScaleWaveWave42ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w42_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w42_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave42ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave42_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave42_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave42IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave41IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 41,
    integrationBaselineSha: '875d6f3e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww41iv_t42', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg42',
    matchId: 'self',
    waveRound: 41,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww42_t41', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave42IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave42ExportGate: exportGate,
    replayScaleWaveWave41IntegrationVerification: wave41IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave42_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 41 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave42IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave42ExportGate: exportGate,
          replayScaleWaveWave41IntegrationVerification: wave41IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
