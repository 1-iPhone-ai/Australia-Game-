import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave48ExportGateReport } from './archive-scale-wave-wave48-export-gate.ts';
import type { Agent24ReplayScaleWaveWave47IntegrationVerificationReport } from './replay-scale-wave-wave47-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave48IntegrationHandoffReport } from './replay-scale-wave-wave48-integration-handoff.ts';
import { O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave48IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave48IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave48IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave48IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave48IntegrationHandoff: Agent24ReplayScaleWaveWave48IntegrationHandoffReport;
  archiveScaleWaveWave48ExportGate: Agent24ArchiveScaleWaveWave48ExportGateReport;
  replayScaleWaveWave47IntegrationVerification: Agent24ReplayScaleWaveWave47IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave48IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave48IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave48IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave48IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave48IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave48IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave48_integration_handoff',
      detail: `Wave 42 integration handoff incomplete (${input.replayScaleWaveWave48IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave48IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww48iv_handoff', {
        satisfied: input.replayScaleWaveWave48IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave48ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave48_export',
      detail: `Wave 43 export gate blocked (${input.archiveScaleWaveWave48ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww48iv_export', {
        blockers: input.archiveScaleWaveWave48ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave47IntegrationVerification.verified) {
    issues.push({
      segment: 'wave42_integration_verification',
      detail: `Wave 42 integration verification open (${input.replayScaleWaveWave47IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww48iv_w34', {
        issues: input.replayScaleWaveWave47IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave48IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave48IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave48ExportGate.exportAllowed &&
    input.replayScaleWaveWave47IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave42_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave48IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave42_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave48IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave47IntegrationVerification = {
    reportId: 'w47iv',
    matchId: 'self',
    waveRound: 48,
    integrationBaselineSha: '4404bf0f',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww48iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg48',
    matchId: 'self',
    waveRound: 48,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww48_t48', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih48',
    matchId: 'self',
    waveRound: 48,
    integrationBaselineSha: O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww48ih_t48', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave48IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave48ExportGate: exportGate,
    replayScaleWaveWave47IntegrationVerification: wave47IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave48_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE48_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 48 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave48IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave48IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave48ExportGate: exportGate,
          replayScaleWaveWave47IntegrationVerification: wave47IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
