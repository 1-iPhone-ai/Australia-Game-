import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave47ExportGateReport } from './archive-scale-wave-wave47-export-gate.ts';
import type { Agent24ReplayScaleWaveWave46IntegrationVerificationReport } from './replay-scale-wave-wave46-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave47IntegrationHandoffReport } from './replay-scale-wave-wave47-integration-handoff.ts';
import { O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave47IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave47IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave47IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave47IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave47IntegrationHandoff: Agent24ReplayScaleWaveWave47IntegrationHandoffReport;
  archiveScaleWaveWave47ExportGate: Agent24ArchiveScaleWaveWave47ExportGateReport;
  replayScaleWaveWave46IntegrationVerification: Agent24ReplayScaleWaveWave46IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave47IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave47IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave47IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave47IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave47IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave47IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave47_integration_handoff',
      detail: `Wave 41 integration handoff incomplete (${input.replayScaleWaveWave47IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave47IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww47iv_handoff', {
        satisfied: input.replayScaleWaveWave47IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave47ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave47_export',
      detail: `Wave 42 export gate blocked (${input.archiveScaleWaveWave47ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww47iv_export', {
        blockers: input.archiveScaleWaveWave47ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave46IntegrationVerification.verified) {
    issues.push({
      segment: 'wave41_integration_verification',
      detail: `Wave 41 integration verification open (${input.replayScaleWaveWave46IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww47iv_w34', {
        issues: input.replayScaleWaveWave46IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave47IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave47IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave47ExportGate.exportAllowed &&
    input.replayScaleWaveWave46IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave41_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave47IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave41_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave47IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave46IntegrationVerification = {
    reportId: 'w46iv',
    matchId: 'self',
    waveRound: 47,
    integrationBaselineSha: '456efb92',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww47iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg47',
    matchId: 'self',
    waveRound: 47,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww47_t47', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih47',
    matchId: 'self',
    waveRound: 47,
    integrationBaselineSha: O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww47ih_t47', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave47IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave47ExportGate: exportGate,
    replayScaleWaveWave46IntegrationVerification: wave46IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave47_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE47_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 47 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave47IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave47IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave47ExportGate: exportGate,
          replayScaleWaveWave46IntegrationVerification: wave46IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
