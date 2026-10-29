import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave31ExportGateReport } from './archive-scale-wave-wave31-export-gate.ts';
import type { Agent24ReplayScaleWaveWave30IntegrationVerificationReport } from './replay-scale-wave-wave30-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave31IntegrationHandoffReport } from './replay-scale-wave-wave31-integration-handoff.ts';
import { O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave31IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave31IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave31IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave31IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave31IntegrationHandoff: Agent24ReplayScaleWaveWave31IntegrationHandoffReport;
  archiveScaleWaveWave31ExportGate: Agent24ArchiveScaleWaveWave31ExportGateReport;
  replayScaleWaveWave30IntegrationVerification: Agent24ReplayScaleWaveWave30IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave31IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave31IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave31IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave31IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave31IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave31IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave31IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave31_integration_handoff',
      detail: `Wave 31 integration handoff incomplete (${input.replayScaleWaveWave31IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave31IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww31iv_handoff', {
        satisfied: input.replayScaleWaveWave31IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave31ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave31_export',
      detail: `Wave 31 export gate blocked (${input.archiveScaleWaveWave31ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww31iv_export', {
        blockers: input.archiveScaleWaveWave31ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave30IntegrationVerification.verified) {
    issues.push({
      segment: 'wave30_integration_verification',
      detail: `Wave 30 integration verification open (${input.replayScaleWaveWave30IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww31iv_w30', {
        issues: input.replayScaleWaveWave30IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave31IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave31IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave31ExportGate.exportAllowed &&
    input.replayScaleWaveWave30IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave31_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave31IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave31_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave31IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave30IntegrationVerification = {
    reportId: 'w30iv',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: '88fa570e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww30iv_t31', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg31',
    matchId: 'self',
    waveRound: 31,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww31_t31', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih31',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww31ih_t31', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave31IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave31IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave31ExportGate: exportGate,
    replayScaleWaveWave30IntegrationVerification: wave30IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave31_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE31_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 31 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave31IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave31IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave31ExportGate: exportGate,
          replayScaleWaveWave30IntegrationVerification: wave30IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
