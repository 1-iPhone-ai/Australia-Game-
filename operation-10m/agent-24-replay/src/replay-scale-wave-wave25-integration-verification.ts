import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave25ExportGateReport } from './archive-scale-wave-wave25-export-gate.ts';
import type { Agent24ReplayScaleWaveWave24IntegrationVerificationReport } from './replay-scale-wave-wave24-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave25IntegrationHandoffReport } from './replay-scale-wave-wave25-integration-handoff.ts';
import { O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave25IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave25IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave25IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave25IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave25IntegrationHandoff: Agent24ReplayScaleWaveWave25IntegrationHandoffReport;
  archiveScaleWaveWave25ExportGate: Agent24ArchiveScaleWaveWave25ExportGateReport;
  replayScaleWaveWave24IntegrationVerification: Agent24ReplayScaleWaveWave24IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave25IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave25IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave25IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave25IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave25IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave25IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave25IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave25_integration_handoff',
      detail: `Wave 25 integration handoff incomplete (${input.replayScaleWaveWave25IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave25IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww25iv_handoff', {
        satisfied: input.replayScaleWaveWave25IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave25ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave25_export',
      detail: `Wave 25 export gate blocked (${input.archiveScaleWaveWave25ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww25iv_export', {
        blockers: input.archiveScaleWaveWave25ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave24IntegrationVerification.verified) {
    issues.push({
      segment: 'wave24_integration_verification',
      detail: `Wave 24 integration verification open (${input.replayScaleWaveWave24IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww25iv_w24', {
        issues: input.replayScaleWaveWave24IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave25IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave25IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave25ExportGate.exportAllowed &&
    input.replayScaleWaveWave24IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave25_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave25IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave25_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave25IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave24IntegrationVerification = {
    reportId: 'w24iv',
    matchId: 'self',
    waveRound: 30,
    integrationBaselineSha: 'b64a7aa8',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww24iv_t26', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg25',
    matchId: 'self',
    waveRound: 30,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww25_t26', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih25',
    matchId: 'self',
    waveRound: 30,
    integrationBaselineSha: O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww25ih_t26', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave25IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave25IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave25ExportGate: exportGate,
    replayScaleWaveWave24IntegrationVerification: wave24IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave25_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave25IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave25IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave25ExportGate: exportGate,
          replayScaleWaveWave24IntegrationVerification: wave24IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
