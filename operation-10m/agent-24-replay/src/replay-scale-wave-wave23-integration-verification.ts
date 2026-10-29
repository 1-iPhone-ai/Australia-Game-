import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave23ExportGateReport } from './archive-scale-wave-wave23-export-gate.ts';
import type { Agent24ReplayScaleWaveFullChunksVerificationReport } from './replay-scale-wave-full-chunks-verification.ts';
import type { Agent24ReplayScaleWaveWave23IntegrationHandoffReport } from './replay-scale-wave-wave23-integration-handoff.ts';
import {
  O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave23IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave23IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave23IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave23IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave23IntegrationHandoff: Agent24ReplayScaleWaveWave23IntegrationHandoffReport;
  archiveScaleWaveWave23ExportGate: Agent24ArchiveScaleWaveWave23ExportGateReport;
  replayScaleWaveFullChunksVerification: Agent24ReplayScaleWaveFullChunksVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave23IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave23IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave23IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave23IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave23IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave23IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave23IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave23_integration_handoff',
      detail: `Wave 23 integration handoff incomplete (${input.replayScaleWaveWave23IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave23IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww23iv_handoff', {
        satisfied: input.replayScaleWaveWave23IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave23ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave23_export',
      detail: `Wave 23 export gate blocked (${input.archiveScaleWaveWave23ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww23iv_export', {
        blockers: input.archiveScaleWaveWave23ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveFullChunksVerification.verified) {
    issues.push({
      segment: 'full_chunks_verification',
      detail: `Full-chunks verification open (${input.replayScaleWaveFullChunksVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww23iv_fc', {
        issues: input.replayScaleWaveFullChunksVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave23IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave23IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave23ExportGate.exportAllowed &&
    input.replayScaleWaveFullChunksVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave23_integration_verification', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: integrationBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    integrationBaselineSha,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    handoffScore: input.replayScaleWaveWave23IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave23_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave23IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const fullChunksVerification = {
    reportId: 'fcv',
    matchId: 'self',
    waveRound: 28,
    fullChunksBaselineSha: O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswfcv_t24', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg',
    matchId: 'self',
    waveRound: 28,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww23_t24', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih',
    matchId: 'self',
    waveRound: 28,
    integrationBaselineSha: O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww23ih_t24', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave23IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave23IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave23ExportGate: exportGate,
    replayScaleWaveFullChunksVerification: fullChunksVerification,
  });

  return [
    {
      name: 'verified_when_wave23_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE23_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 28 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave23IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave23IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave23ExportGate: exportGate,
          replayScaleWaveFullChunksVerification: fullChunksVerification,
        }).deterministicFingerprint,
    },
  ];
}
