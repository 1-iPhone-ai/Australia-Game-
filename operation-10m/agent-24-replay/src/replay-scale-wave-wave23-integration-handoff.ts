import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave23ExportGateReport } from './archive-scale-wave-wave23-export-gate.ts';
import type { Agent24ReplayScaleWaveFullChunksVerificationReport } from './replay-scale-wave-full-chunks-verification.ts';
import {
  O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave23IntegrationHandoffCheckpoint {
  checkpointId: string;
  label: string;
  satisfied: boolean;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave23IntegrationHandoffReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  handoffComplete: boolean;
  checkpointCount: number;
  satisfiedCheckpointCount: number;
  checkpoints: Agent24ReplayScaleWaveWave23IntegrationHandoffCheckpoint[];
  handoffScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave23IntegrationHandoffInput {
  matchId: string;
  archiveScaleWaveWave23ExportGate: Agent24ArchiveScaleWaveWave23ExportGateReport;
  replayScaleWaveFullChunksVerification: Agent24ReplayScaleWaveFullChunksVerificationReport;
  integrationBaselineSha?: string;
}

export function buildAgent24ReplayScaleWaveWave23IntegrationHandoffReport(
  input: Agent24ReplayScaleWaveWave23IntegrationHandoffInput,
): Agent24ReplayScaleWaveWave23IntegrationHandoffReport {
  const waveRound = input.replayScaleWaveFullChunksVerification.waveRound;
  const integrationBaselineSha = input.integrationBaselineSha ?? O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA;
  const baselineAligned =
    waveRound >= 46
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA
      : waveRound >= 45
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA
      : waveRound >= 44
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA
      : waveRound >= 43
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA
      : waveRound >= 42
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA
      : waveRound >= 41
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA
      : waveRound >= 40
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA
      : waveRound >= 39
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA
      : waveRound >= 38
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA
      : waveRound >= 37
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA
      : waveRound >= 36
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA
      : waveRound >= 35
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA
      : waveRound >= 34
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA
      : waveRound >= 33
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA
      : waveRound >= 32
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA
      : waveRound >= 31
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA
      : waveRound >= 30
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA
      : waveRound >= 29
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA
      : waveRound >= 28
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA
      : waveRound >= 27
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA
      : waveRound >= 26
      ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
        O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA
      : waveRound >= 25
        ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
          O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA
        : waveRound >= 24
        ? input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha ===
          O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA
        : input.replayScaleWaveFullChunksVerification.fullChunksBaselineSha === integrationBaselineSha;

  const checkpoints: Agent24ReplayScaleWaveWave23IntegrationHandoffCheckpoint[] = [
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w23_cp', { id: 'full_chunks_verified', wave: waveRound }),
      label: 'Full-chunks verification',
      satisfied: input.replayScaleWaveFullChunksVerification.verified,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w23_cp', { id: 'wave23_export', wave: waveRound }),
      label: 'Wave 23 export gate',
      satisfied: input.archiveScaleWaveWave23ExportGate.exportAllowed,
      fingerprint: '',
    },
    {
      checkpointId: o6kAgent24Fingerprint('scale_wave_w23_cp', { id: 'integration_baseline', wave: waveRound }),
      label: 'Integration baseline alignment',
      satisfied: baselineAligned,
      fingerprint: '',
    },
  ];

  for (const cp of checkpoints) {
    cp.fingerprint = o6kAgent24Fingerprint('scale_wave_w23_cp_body', {
      id: cp.checkpointId,
      satisfied: cp.satisfied,
      wave: waveRound,
      baseline: integrationBaselineSha,
    });
  }

  const satisfiedCheckpointCount = checkpoints.filter(c => c.satisfied).length;

  let handoffScore = 100;
  handoffScore -= (checkpoints.length - satisfiedCheckpointCount) * 18;
  handoffScore -= Math.max(0, 100 - input.archiveScaleWaveWave23ExportGate.exportScore) * 0.08;
  handoffScore = Math.max(0, Math.min(100, Math.round(handoffScore)));

  const handoffComplete = satisfiedCheckpointCount === checkpoints.length;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave23_integration_handoff', {
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
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave23_integration_handoff_body', {
      waveRound,
      baseline: integrationBaselineSha,
      checkpoints: checkpoints.map(c => c.fingerprint),
      handoffComplete,
      handoffScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave23IntegrationHandoffSelfTests(): Array<{ name: string; passed: boolean }> {
  const fullChunksVerification = {
    reportId: 'fcv',
    matchId: 'self',
    waveRound: 23,
    fullChunksBaselineSha: O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswfcv_t23', { v: 2 }),
  };
  const exportGate = {
    reportId: 'eg',
    matchId: 'self',
    waveRound: 23,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww23_t23', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave23IntegrationHandoffReport({
    matchId: 'self',
    archiveScaleWaveWave23ExportGate: exportGate,
    replayScaleWaveFullChunksVerification: fullChunksVerification,
  });

  return [
    {
      name: 'integration_handoff_complete_at_wave23_baseline',
      passed:
        report.handoffComplete &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 23 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave23IntegrationHandoffReport({
          matchId: 'self',
          archiveScaleWaveWave23ExportGate: exportGate,
          replayScaleWaveFullChunksVerification: fullChunksVerification,
        }).deterministicFingerprint,
    },
  ];
}
