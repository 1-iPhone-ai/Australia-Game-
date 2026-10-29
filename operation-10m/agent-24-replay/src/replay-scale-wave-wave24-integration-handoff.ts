import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave24ExportGateReport } from './archive-scale-wave-wave24-export-gate.ts';
import type { Agent24ReplayScaleWaveWave23IntegrationVerificationReport } from './replay-scale-wave-wave23-integration-verification.ts';
import { O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave24IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave24IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave24IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave24IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave24ExportGate: Agent24ArchiveScaleWaveWave24ExportGateReport;
  replayScaleWaveWave23IntegrationVerification: Agent24ReplayScaleWaveWave23IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave24IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave24IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave24IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave23IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave23IntegrationVerification.verified &&
    input.archiveScaleWaveWave24ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave24IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w24_cp', { id: 'wave23_integration_verified', wave: waveRound }),
      label: 'Wave 23 integration verification',
      satisfied: input.replayScaleWaveWave23IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w24_cp', { id: 'wave24_export', wave: waveRound }),
      label: 'Wave 24 export gate',
      satisfied: input.archiveScaleWaveWave24ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w24_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w24_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave24ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave24_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave24_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave24IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave23IntegrationVerification = {
    reportId: 'w23iv',
    matchId: 'self',
    waveRound: 24,
    integrationBaselineSha: 'b23e1449',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww23iv_t24', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg24',
    matchId: 'self',
    waveRound: 24,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww24_t24', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave24IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave24ExportGate: exportGate,
    replayScaleWaveWave23IntegrationVerification: wave23IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave24_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 24 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave24IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave24ExportGate: exportGate,
          replayScaleWaveWave23IntegrationVerification: wave23IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
