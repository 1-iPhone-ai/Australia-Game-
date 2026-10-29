import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave35ExportGateReport } from './archive-scale-wave-wave35-export-gate.ts';
import type { Agent24ReplayScaleWaveWave34IntegrationVerificationReport } from './replay-scale-wave-wave34-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave35IntegrationHandoffReport } from './replay-scale-wave-wave35-integration-handoff.ts';
import { O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave35IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave35IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave35IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave35IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave35IntegrationHandoff: Agent24ReplayScaleWaveWave35IntegrationHandoffReport;
  archiveScaleWaveWave35ExportGate: Agent24ArchiveScaleWaveWave35ExportGateReport;
  replayScaleWaveWave34IntegrationVerification: Agent24ReplayScaleWaveWave34IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave35IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave35IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave35IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave35IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave35IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave35IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave35IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave35_integration_handoff',
      detail: `Wave 34 integration handoff incomplete (${input.replayScaleWaveWave35IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave35IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww35iv_handoff', {
        satisfied: input.replayScaleWaveWave35IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave35ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave35_export',
      detail: `Wave 35 export gate blocked (${input.archiveScaleWaveWave35ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww35iv_export', {
        blockers: input.archiveScaleWaveWave35ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave34IntegrationVerification.verified) {
    issues.push({
      segment: 'wave34_integration_verification',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave34IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww35iv_w34', {
        issues: input.replayScaleWaveWave34IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave35IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave35IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave35ExportGate.exportAllowed &&
    input.replayScaleWaveWave34IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave35_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave35IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave35_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave35IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave34IntegrationVerification = {
    reportId: 'w34iv',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: '2187b54e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww34iv_t35', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg35',
    matchId: 'self',
    waveRound: 34,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww35_t34', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih35',
    matchId: 'self',
    waveRound: 34,
    integrationBaselineSha: O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww35ih_t34', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave35IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave35IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave35ExportGate: exportGate,
    replayScaleWaveWave34IntegrationVerification: wave34IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave35_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE35_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 34 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave35IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave35IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave35ExportGate: exportGate,
          replayScaleWaveWave34IntegrationVerification: wave34IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
