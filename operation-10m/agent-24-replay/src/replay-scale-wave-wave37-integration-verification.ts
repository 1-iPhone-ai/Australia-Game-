import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave37ExportGateReport } from './archive-scale-wave-wave37-export-gate.ts';
import type { Agent24ReplayScaleWaveWave36IntegrationVerificationReport } from './replay-scale-wave-wave36-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave37IntegrationHandoffReport } from './replay-scale-wave-wave37-integration-handoff.ts';
import { O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave37IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave37IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave37IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave37IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave37IntegrationHandoff: Agent24ReplayScaleWaveWave37IntegrationHandoffReport;
  archiveScaleWaveWave37ExportGate: Agent24ArchiveScaleWaveWave37ExportGateReport;
  replayScaleWaveWave36IntegrationVerification: Agent24ReplayScaleWaveWave36IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave37IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave37IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave37IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave37IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave37IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave37IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave37IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave37_integration_handoff',
      detail: `Wave 34 integration handoff incomplete (${input.replayScaleWaveWave37IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave37IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww37iv_handoff', {
        satisfied: input.replayScaleWaveWave37IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave37ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave37_export',
      detail: `Wave 35 export gate blocked (${input.archiveScaleWaveWave37ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww37iv_export', {
        blockers: input.archiveScaleWaveWave37ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave36IntegrationVerification.verified) {
    issues.push({
      segment: 'wave34_integration_verification',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave36IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww37iv_w34', {
        issues: input.replayScaleWaveWave36IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave37IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave37IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave37ExportGate.exportAllowed &&
    input.replayScaleWaveWave36IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave37_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave37IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave37_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave37IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave36IntegrationVerification = {
    reportId: 'w36iv',
    matchId: 'self',
    waveRound: 37,
    integrationBaselineSha: 'ea2bb03e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww36iv_t37', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg37',
    matchId: 'self',
    waveRound: 37,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww37_t37', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih37',
    matchId: 'self',
    waveRound: 37,
    integrationBaselineSha: O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww37ih_t37', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave37IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave37IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave37ExportGate: exportGate,
    replayScaleWaveWave36IntegrationVerification: wave36IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave37_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE37_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 37 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave37IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave37IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave37ExportGate: exportGate,
          replayScaleWaveWave36IntegrationVerification: wave36IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
