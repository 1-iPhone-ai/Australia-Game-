import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave50ExportGateReport } from './archive-scale-wave-wave50-export-gate.ts';
import type { Agent24ReplayScaleWaveWave49IntegrationVerificationReport } from './replay-scale-wave-wave49-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave50IntegrationHandoffReport } from './replay-scale-wave-wave50-integration-handoff.ts';
import { O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave50IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave50IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave50IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave50IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave50IntegrationHandoff: Agent24ReplayScaleWaveWave50IntegrationHandoffReport;
  archiveScaleWaveWave50ExportGate: Agent24ArchiveScaleWaveWave50ExportGateReport;
  replayScaleWaveWave49IntegrationVerification: Agent24ReplayScaleWaveWave49IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave50IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave50IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave50IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave50IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave50IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave50IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave50IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave50_integration_handoff',
      detail: `Wave 44 integration handoff incomplete (${input.replayScaleWaveWave50IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave50IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww50iv_handoff', {
        satisfied: input.replayScaleWaveWave50IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave50ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave50_export',
      detail: `Wave 45 export gate blocked (${input.archiveScaleWaveWave50ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww50iv_export', {
        blockers: input.archiveScaleWaveWave50ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave49IntegrationVerification.verified) {
    issues.push({
      segment: 'wave44_integration_verification',
      detail: `Wave 44 integration verification open (${input.replayScaleWaveWave49IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww50iv_w34', {
        issues: input.replayScaleWaveWave49IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave50IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave50IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave50ExportGate.exportAllowed &&
    input.replayScaleWaveWave49IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave44_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave50IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave44_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave50IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave49IntegrationVerification = {
    reportId: 'w49iv',
    matchId: 'self',
    waveRound: 50,
    integrationBaselineSha: '8aaaf700',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww50iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg50',
    matchId: 'self',
    waveRound: 50,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww50_t50', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih50',
    matchId: 'self',
    waveRound: 50,
    integrationBaselineSha: O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww50ih_t50', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave50IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave50IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave50ExportGate: exportGate,
    replayScaleWaveWave49IntegrationVerification: wave49IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave50_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE50_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 50 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave50IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave50IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave50ExportGate: exportGate,
          replayScaleWaveWave49IntegrationVerification: wave49IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
