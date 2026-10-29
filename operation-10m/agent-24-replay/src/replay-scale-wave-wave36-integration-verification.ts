import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave36ExportGateReport } from './archive-scale-wave-wave36-export-gate.ts';
import type { Agent24ReplayScaleWaveWave35IntegrationVerificationReport } from './replay-scale-wave-wave35-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave36IntegrationHandoffReport } from './replay-scale-wave-wave36-integration-handoff.ts';
import { O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave36IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave36IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave36IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave36IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave36IntegrationHandoff: Agent24ReplayScaleWaveWave36IntegrationHandoffReport;
  archiveScaleWaveWave36ExportGate: Agent24ArchiveScaleWaveWave36ExportGateReport;
  replayScaleWaveWave35IntegrationVerification: Agent24ReplayScaleWaveWave35IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave36IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave36IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave36IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave36IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave36IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave36IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave36IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave36_integration_handoff',
      detail: `Wave 34 integration handoff incomplete (${input.replayScaleWaveWave36IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave36IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww36iv_handoff', {
        satisfied: input.replayScaleWaveWave36IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave36ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave36_export',
      detail: `Wave 35 export gate blocked (${input.archiveScaleWaveWave36ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww36iv_export', {
        blockers: input.archiveScaleWaveWave36ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave35IntegrationVerification.verified) {
    issues.push({
      segment: 'wave34_integration_verification',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave35IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww36iv_w34', {
        issues: input.replayScaleWaveWave35IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave36IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave36IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave36ExportGate.exportAllowed &&
    input.replayScaleWaveWave35IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave36_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave36IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave36_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave36IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave35IntegrationVerification = {
    reportId: 'w35iv',
    matchId: 'self',
    waveRound: 36,
    integrationBaselineSha: '1f7d25be',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww35iv_t36', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg36',
    matchId: 'self',
    waveRound: 36,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww36_t36', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih36',
    matchId: 'self',
    waveRound: 36,
    integrationBaselineSha: O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww36ih_t36', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave36IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave36IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave36ExportGate: exportGate,
    replayScaleWaveWave35IntegrationVerification: wave35IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave36_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE36_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 36 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave36IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave36IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave36ExportGate: exportGate,
          replayScaleWaveWave35IntegrationVerification: wave35IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
