import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave37ExportGateReport } from './archive-scale-wave-wave37-export-gate.ts';
import type { Agent24ReplayScaleWaveWave36IntegrationVerificationReport } from './replay-scale-wave-wave36-integration-verification.ts';
import { O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave37IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave37IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave37IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave37IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave37ExportGate: Agent24ArchiveScaleWaveWave37ExportGateReport;
  replayScaleWaveWave36IntegrationVerification: Agent24ReplayScaleWaveWave36IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave37IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave37IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave37IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave36IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave36IntegrationVerification.verified &&
    input.archiveScaleWaveWave37ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave37IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w37_cp', { id: 'wave36_integration_verified', wave: waveRound }),
      label: 'Wave 35 integration verification',
      satisfied: input.replayScaleWaveWave36IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w37_cp', { id: 'wave37_export', wave: waveRound }),
      label: 'Wave 36 export gate',
      satisfied: input.archiveScaleWaveWave37ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w37_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w37_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave37ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave37_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave37_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave37IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave36IntegrationVerification = {
    reportId: 'w36iv',
    matchId: 'self',
    waveRound: 36,
    integrationBaselineSha: 'ea2bb03e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww36iv_t37', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg37',
    matchId: 'self',
    waveRound: 36,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww37_t36', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave37IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave37ExportGate: exportGate,
    replayScaleWaveWave36IntegrationVerification: wave36IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave37_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 36 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave37IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave37ExportGate: exportGate,
          replayScaleWaveWave36IntegrationVerification: wave36IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
