import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave52ExportGateReport } from './archive-scale-wave-wave52-export-gate.ts';
import type { Agent24ReplayScaleWaveWave51IntegrationVerificationReport } from './replay-scale-wave-wave51-integration-verification.ts';
import { O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave52IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave52IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave52IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave52IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave52ExportGate: Agent24ArchiveScaleWaveWave52ExportGateReport;
  replayScaleWaveWave51IntegrationVerification: Agent24ReplayScaleWaveWave51IntegrationVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave52IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave52IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave52IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveWave51IntegrationVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    input.replayScaleWaveWave51IntegrationVerification.verified &&
    input.archiveScaleWaveWave52ExportGate.exportAllowed;

  const checkpoints: Agent24ReplayScaleWaveWave52IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w52_cp', { id: 'wave47_integration_verified', wave: waveRound }),
      label: 'Wave 46 integration verification',
      satisfied: input.replayScaleWaveWave51IntegrationVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w52_cp', { id: 'wave52_export', wave: waveRound }),
      label: 'Wave 47 export gate',
      satisfied: input.archiveScaleWaveWave52ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w52_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w52_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave52ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave52_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave52_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave52IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave51IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 51,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww51iv_t52', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg52',
    matchId: 'self',
    waveRound: 51,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww52_t51', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave52IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave52ExportGate: exportGate,
    replayScaleWaveWave51IntegrationVerification: wave51IntegrationVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave52_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE52_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 51 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave52IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave52ExportGate: exportGate,
          replayScaleWaveWave51IntegrationVerification: wave51IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
