import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave44ExportGateReport } from './archive-scale-wave-wave44-export-gate.ts';
import type { Agent24ReplayScaleWaveWave43IntegrationVerificationReport } from './replay-scale-wave-wave43-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave44IntegrationHandoffReport } from './replay-scale-wave-wave44-integration-handoff.ts';
import { O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave44IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave44IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave44IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave44IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave44IntegrationHandoff: Agent24ReplayScaleWaveWave44IntegrationHandoffReport;
  archiveScaleWaveWave44ExportGate: Agent24ArchiveScaleWaveWave44ExportGateReport;
  replayScaleWaveWave43IntegrationVerification: Agent24ReplayScaleWaveWave43IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave44IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave44IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave44IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave44IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave44IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave44IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave44IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave44_integration_handoff',
      detail: `Wave 38 integration handoff incomplete (${input.replayScaleWaveWave44IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave44IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww44iv_handoff', {
        satisfied: input.replayScaleWaveWave44IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave44ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave44_export',
      detail: `Wave 39 export gate blocked (${input.archiveScaleWaveWave44ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww44iv_export', {
        blockers: input.archiveScaleWaveWave44ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave43IntegrationVerification.verified) {
    issues.push({
      segment: 'wave38_integration_verification',
      detail: `Wave 38 integration verification open (${input.replayScaleWaveWave43IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww44iv_w34', {
        issues: input.replayScaleWaveWave43IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave44IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave44IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave44ExportGate.exportAllowed &&
    input.replayScaleWaveWave43IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA;

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
    handoffScore: input.replayScaleWaveWave44IntegrationHandoff.handoffScore,
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

export function runAgent24ReplayScaleWaveWave44IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave43IntegrationVerification = {
    reportId: 'w43iv',
    matchId: 'self',
    waveRound: 44,
    integrationBaselineSha: 'bca7e0a3',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww44iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg44',
    matchId: 'self',
    waveRound: 44,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww44_t44', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih44',
    matchId: 'self',
    waveRound: 44,
    integrationBaselineSha: O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww44ih_t44', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave44IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave44IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave44ExportGate: exportGate,
    replayScaleWaveWave43IntegrationVerification: wave43IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave44_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE44_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 44 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave44IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave44IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave44ExportGate: exportGate,
          replayScaleWaveWave43IntegrationVerification: wave43IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
