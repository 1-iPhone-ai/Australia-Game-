import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave28ExportGateReport } from './archive-scale-wave-wave28-export-gate.ts';
import type { Agent24ReplayScaleWaveWave27IntegrationVerificationReport } from './replay-scale-wave-wave27-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave28IntegrationHandoffReport } from './replay-scale-wave-wave28-integration-handoff.ts';
import { O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave28IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave28IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave28IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave28IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave28IntegrationHandoff: Agent24ReplayScaleWaveWave28IntegrationHandoffReport;
  archiveScaleWaveWave28ExportGate: Agent24ArchiveScaleWaveWave28ExportGateReport;
  replayScaleWaveWave27IntegrationVerification: Agent24ReplayScaleWaveWave27IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave28IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave28IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave28IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave28IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave28IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave28IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave28IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave28_integration_handoff',
      detail: `Wave 28 integration handoff incomplete (${input.replayScaleWaveWave28IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave28IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww28iv_handoff', {
        satisfied: input.replayScaleWaveWave28IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave28ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave28_export',
      detail: `Wave 28 export gate blocked (${input.archiveScaleWaveWave28ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww28iv_export', {
        blockers: input.archiveScaleWaveWave28ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave27IntegrationVerification.verified) {
    issues.push({
      segment: 'wave27_integration_verification',
      detail: `Wave 27 integration verification open (${input.replayScaleWaveWave27IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww28iv_w27', {
        issues: input.replayScaleWaveWave27IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave28IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave28IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave28ExportGate.exportAllowed &&
    input.replayScaleWaveWave27IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave28_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave28IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave28_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave28IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave27IntegrationVerification = {
    reportId: 'w27iv',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: '7c1cfd89',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww27iv_t29', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg28',
    matchId: 'self',
    waveRound: 34,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww28_t29', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih28',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww28ih_t29', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave28IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave28IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave28ExportGate: exportGate,
    replayScaleWaveWave27IntegrationVerification: wave27IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave28_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE28_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 34 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave28IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave28IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave28ExportGate: exportGate,
          replayScaleWaveWave27IntegrationVerification: wave27IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
