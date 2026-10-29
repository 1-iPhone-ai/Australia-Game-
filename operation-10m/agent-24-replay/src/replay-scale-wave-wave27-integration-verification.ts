import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave27ExportGateReport } from './archive-scale-wave-wave27-export-gate.ts';
import type { Agent24ReplayScaleWaveWave26IntegrationVerificationReport } from './replay-scale-wave-wave26-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave27IntegrationHandoffReport } from './replay-scale-wave-wave27-integration-handoff.ts';
import { O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave27IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave27IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave27IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave27IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave27IntegrationHandoff: Agent24ReplayScaleWaveWave27IntegrationHandoffReport;
  archiveScaleWaveWave27ExportGate: Agent24ArchiveScaleWaveWave27ExportGateReport;
  replayScaleWaveWave26IntegrationVerification: Agent24ReplayScaleWaveWave26IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave27IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave27IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave27IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave27IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave27IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave27IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave27IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave27_integration_handoff',
      detail: `Wave 27 integration handoff incomplete (${input.replayScaleWaveWave27IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave27IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww27iv_handoff', {
        satisfied: input.replayScaleWaveWave27IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave27ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave27_export',
      detail: `Wave 27 export gate blocked (${input.archiveScaleWaveWave27ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww27iv_export', {
        blockers: input.archiveScaleWaveWave27ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave26IntegrationVerification.verified) {
    issues.push({
      segment: 'wave26_integration_verification',
      detail: `Wave 26 integration verification open (${input.replayScaleWaveWave26IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww27iv_w26', {
        issues: input.replayScaleWaveWave26IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave27IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave27IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave27ExportGate.exportAllowed &&
    input.replayScaleWaveWave26IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave27_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave27IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave27_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave27IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave26IntegrationVerification = {
    reportId: 'w26iv',
    matchId: 'self',
    waveRound: 28,
    integrationBaselineSha: 'de3079f9',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww26iv_t28', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg27',
    matchId: 'self',
    waveRound: 28,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww27_t28', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih27',
    matchId: 'self',
    waveRound: 28,
    integrationBaselineSha: O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww27ih_t28', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave27IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave27IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave27ExportGate: exportGate,
    replayScaleWaveWave26IntegrationVerification: wave26IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave27_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE27_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 28 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave27IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave27IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave27ExportGate: exportGate,
          replayScaleWaveWave26IntegrationVerification: wave26IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
