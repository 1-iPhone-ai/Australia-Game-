import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave32ExportGateReport } from './archive-scale-wave-wave32-export-gate.ts';
import type { Agent24ReplayScaleWaveWave31IntegrationVerificationReport } from './replay-scale-wave-wave31-integration-verification.ts';
import { O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave32IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave32IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave32IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave32IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave32ExportGate: Agent24ArchiveScaleWaveWave32ExportGateReport;
  replayScaleWaveWave31IntegrationVerification: Agent24ReplayScaleWaveWave31IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave32IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave32IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave32IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave31IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave31IntegrationVerification.verified &&
    input.archiveScaleWaveWave32ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave32IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w32_cp', { id: 'wave31_integration_verified', wave: waveRound }),
      label: 'Wave 31 integration verification',
      satisfied: input.replayScaleWaveWave31IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w32_cp', { id: 'wave32_export', wave: waveRound }),
      label: 'Wave 32 export gate',
      satisfied: input.archiveScaleWaveWave32ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w32_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w32_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave32ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave32_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave32_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave32IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave31IntegrationVerification = {
    reportId: 'w31iv',
    matchId: 'self',
    waveRound: 32,
    integrationBaselineSha: '81b50b8e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww30iv_t31', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg32',
    matchId: 'self',
    waveRound: 32,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww31_t31', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave32IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave32ExportGate: exportGate,
    replayScaleWaveWave31IntegrationVerification: wave31IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave32_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave32IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave32ExportGate: exportGate,
          replayScaleWaveWave31IntegrationVerification: wave31IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
