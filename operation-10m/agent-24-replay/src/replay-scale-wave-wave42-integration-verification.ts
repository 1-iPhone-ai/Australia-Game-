import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave42ExportGateReport } from './archive-scale-wave-wave42-export-gate.ts';
import type { Agent24ReplayScaleWaveWave41IntegrationVerificationReport } from './replay-scale-wave-wave41-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave42IntegrationHandoffReport } from './replay-scale-wave-wave42-integration-handoff.ts';
import { O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave42IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave42IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave42IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave42IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave42IntegrationHandoff: Agent24ReplayScaleWaveWave42IntegrationHandoffReport;
  archiveScaleWaveWave42ExportGate: Agent24ArchiveScaleWaveWave42ExportGateReport;
  replayScaleWaveWave41IntegrationVerification: Agent24ReplayScaleWaveWave41IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave42IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave42IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave42IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave42IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave42IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave42IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave42IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave42_integration_handoff',
      detail: `Wave 36 integration handoff incomplete (${input.replayScaleWaveWave42IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave42IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww42iv_handoff', {
        satisfied: input.replayScaleWaveWave42IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave42ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave42_export',
      detail: `Wave 37 export gate blocked (${input.archiveScaleWaveWave42ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww42iv_export', {
        blockers: input.archiveScaleWaveWave42ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave41IntegrationVerification.verified) {
    issues.push({
      segment: 'wave36_integration_verification',
      detail: `Wave 36 integration verification open (${input.replayScaleWaveWave41IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww42iv_w34', {
        issues: input.replayScaleWaveWave41IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave42IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave42IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave42ExportGate.exportAllowed &&
    input.replayScaleWaveWave41IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA;

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
    handoffScore: input.replayScaleWaveWave42IntegrationHandoff.handoffScore,
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

export function runAgent24ReplayScaleWaveWave42IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave41IntegrationVerification = {
    reportId: 'w41iv',
    matchId: 'self',
    waveRound: 42,
    integrationBaselineSha: '431df5de',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww42iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg42',
    matchId: 'self',
    waveRound: 42,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww42_t42', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih42',
    matchId: 'self',
    waveRound: 42,
    integrationBaselineSha: O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww42ih_t42', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave42IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave42IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave42ExportGate: exportGate,
    replayScaleWaveWave41IntegrationVerification: wave41IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave42_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE42_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 42 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave42IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave42IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave42ExportGate: exportGate,
          replayScaleWaveWave41IntegrationVerification: wave41IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
