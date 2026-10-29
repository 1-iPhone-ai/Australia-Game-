import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave49ExportGateReport } from './archive-scale-wave-wave49-export-gate.ts';
import type { Agent24ReplayScaleWaveWave48IntegrationVerificationReport } from './replay-scale-wave-wave48-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave49IntegrationHandoffReport } from './replay-scale-wave-wave49-integration-handoff.ts';
import { O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave49IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave49IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave49IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave49IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave49IntegrationHandoff: Agent24ReplayScaleWaveWave49IntegrationHandoffReport;
  archiveScaleWaveWave49ExportGate: Agent24ArchiveScaleWaveWave49ExportGateReport;
  replayScaleWaveWave48IntegrationVerification: Agent24ReplayScaleWaveWave48IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave49IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave49IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave49IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave49IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave49IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave49IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave49IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave49_integration_handoff',
      detail: `Wave 43 integration handoff incomplete (${input.replayScaleWaveWave49IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave49IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww49iv_handoff', {
        satisfied: input.replayScaleWaveWave49IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave49ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave49_export',
      detail: `Wave 44 export gate blocked (${input.archiveScaleWaveWave49ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww49iv_export', {
        blockers: input.archiveScaleWaveWave49ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave48IntegrationVerification.verified) {
    issues.push({
      segment: 'wave43_integration_verification',
      detail: `Wave 43 integration verification open (${input.replayScaleWaveWave48IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww49iv_w34', {
        issues: input.replayScaleWaveWave48IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave49IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave49IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave49ExportGate.exportAllowed &&
    input.replayScaleWaveWave48IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave43_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave49IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave43_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave49IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave48IntegrationVerification = {
    reportId: 'w48iv',
    matchId: 'self',
    waveRound: 49,
    integrationBaselineSha: '73e5e01e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww49iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg49',
    matchId: 'self',
    waveRound: 49,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww49_t49', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih49',
    matchId: 'self',
    waveRound: 49,
    integrationBaselineSha: O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww49ih_t49', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave49IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave49IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave49ExportGate: exportGate,
    replayScaleWaveWave48IntegrationVerification: wave48IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave49_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE49_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 49 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave49IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave49IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave49ExportGate: exportGate,
          replayScaleWaveWave48IntegrationVerification: wave48IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
