import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave41ExportGateReport } from './archive-scale-wave-wave41-export-gate.ts';
import type { Agent24ReplayScaleWaveWave40IntegrationVerificationReport } from './replay-scale-wave-wave40-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave41IntegrationHandoffReport } from './replay-scale-wave-wave41-integration-handoff.ts';
import { O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave41IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave41IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave41IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave41IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave41IntegrationHandoff: Agent24ReplayScaleWaveWave41IntegrationHandoffReport;
  archiveScaleWaveWave41ExportGate: Agent24ArchiveScaleWaveWave41ExportGateReport;
  replayScaleWaveWave40IntegrationVerification: Agent24ReplayScaleWaveWave40IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave41IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave41IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave41IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave41IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave41IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave41IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave41IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave41_integration_handoff',
      detail: `Wave 35 integration handoff incomplete (${input.replayScaleWaveWave41IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave41IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww41iv_handoff', {
        satisfied: input.replayScaleWaveWave41IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave41ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave41_export',
      detail: `Wave 36 export gate blocked (${input.archiveScaleWaveWave41ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww41iv_export', {
        blockers: input.archiveScaleWaveWave41ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave40IntegrationVerification.verified) {
    issues.push({
      segment: 'wave35_integration_verification',
      detail: `Wave 35 integration verification open (${input.replayScaleWaveWave40IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww41iv_w34', {
        issues: input.replayScaleWaveWave40IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave41IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave41IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave41ExportGate.exportAllowed &&
    input.replayScaleWaveWave40IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA;

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
    handoffScore: input.replayScaleWaveWave41IntegrationHandoff.handoffScore,
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

export function runAgent24ReplayScaleWaveWave41IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave40IntegrationVerification = {
    reportId: 'w40iv',
    matchId: 'self',
    waveRound: 41,
    integrationBaselineSha: '875d6f3e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww41iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg41',
    matchId: 'self',
    waveRound: 41,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww41_t41', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih41',
    matchId: 'self',
    waveRound: 41,
    integrationBaselineSha: O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww41ih_t41', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave41IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave41IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave41ExportGate: exportGate,
    replayScaleWaveWave40IntegrationVerification: wave40IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave41_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE41_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 41 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave41IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave41IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave41ExportGate: exportGate,
          replayScaleWaveWave40IntegrationVerification: wave40IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
