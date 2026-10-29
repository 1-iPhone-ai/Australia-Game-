import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave30ExportGateReport } from './archive-scale-wave-wave30-export-gate.ts';
import type { Agent24ReplayScaleWaveWave29IntegrationVerificationReport } from './replay-scale-wave-wave29-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave30IntegrationHandoffReport } from './replay-scale-wave-wave30-integration-handoff.ts';
import { O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave30IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave30IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave30IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave30IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave30IntegrationHandoff: Agent24ReplayScaleWaveWave30IntegrationHandoffReport;
  archiveScaleWaveWave30ExportGate: Agent24ArchiveScaleWaveWave30ExportGateReport;
  replayScaleWaveWave29IntegrationVerification: Agent24ReplayScaleWaveWave29IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave30IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave30IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave30IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave30IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave30IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave30IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave30IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave30_integration_handoff',
      detail: `Wave 30 integration handoff incomplete (${input.replayScaleWaveWave30IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave30IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww30iv_handoff', {
        satisfied: input.replayScaleWaveWave30IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave30ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave30_export',
      detail: `Wave 30 export gate blocked (${input.archiveScaleWaveWave30ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww30iv_export', {
        blockers: input.archiveScaleWaveWave30ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave29IntegrationVerification.verified) {
    issues.push({
      segment: 'wave29_integration_verification',
      detail: `Wave 29 integration verification open (${input.replayScaleWaveWave29IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww30iv_w29', {
        issues: input.replayScaleWaveWave29IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave30IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave30IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave30ExportGate.exportAllowed &&
    input.replayScaleWaveWave29IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave30_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave30IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave30_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave30IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave29IntegrationVerification = {
    reportId: 'w29iv',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: '70df4aee',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww29iv_t31', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg30',
    matchId: 'self',
    waveRound: 34,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww30_t31', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih30',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww30ih_t31', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave30IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave30IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave30ExportGate: exportGate,
    replayScaleWaveWave29IntegrationVerification: wave29IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave30_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE30_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave30IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave30IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave30ExportGate: exportGate,
          replayScaleWaveWave29IntegrationVerification: wave29IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
