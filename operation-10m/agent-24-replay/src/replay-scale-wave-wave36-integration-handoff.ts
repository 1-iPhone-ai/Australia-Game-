import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave36ExportGateReport } from './archive-scale-wave-wave36-export-gate.ts';
import type { Agent24ReplayScaleWaveWave35IntegrationVerificationReport } from './replay-scale-wave-wave35-integration-verification.ts';
import { O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave36IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave36IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave36IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave36IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave36ExportGate: Agent24ArchiveScaleWaveWave36ExportGateReport;
  replayScaleWaveWave35IntegrationVerification: Agent24ReplayScaleWaveWave35IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave36IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave36IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave36IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave35IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave35IntegrationVerification.verified &&
    input.archiveScaleWaveWave36ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave36IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w36_cp', { id: 'wave35_integration_verified', wave: waveRound }),
      label: 'Wave 34 integration verification',
      satisfied: input.replayScaleWaveWave35IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w36_cp', { id: 'wave36_export', wave: waveRound }),
      label: 'Wave 35 export gate',
      satisfied: input.archiveScaleWaveWave36ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w36_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w36_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave36ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave36_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave36_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave36IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave35IntegrationVerification = {
    reportId: 'w35iv',
    matchId: 'self',
    waveRound: 35,
    integrationBaselineSha: '1f7d25be',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww35iv_t36', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg36',
    matchId: 'self',
    waveRound: 35,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww36_t35', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave36IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave36ExportGate: exportGate,
    replayScaleWaveWave35IntegrationVerification: wave35IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave36_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 35 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave36IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave36ExportGate: exportGate,
          replayScaleWaveWave35IntegrationVerification: wave35IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
