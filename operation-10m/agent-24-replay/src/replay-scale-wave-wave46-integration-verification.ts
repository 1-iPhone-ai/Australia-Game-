import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave46ExportGateReport } from './archive-scale-wave-wave46-export-gate.ts';
import type { Agent24ReplayScaleWaveWave45IntegrationVerificationReport } from './replay-scale-wave-wave45-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave46IntegrationHandoffReport } from './replay-scale-wave-wave46-integration-handoff.ts';
import { O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave46IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave46IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave46IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave46IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave46IntegrationHandoff: Agent24ReplayScaleWaveWave46IntegrationHandoffReport;
  archiveScaleWaveWave46ExportGate: Agent24ArchiveScaleWaveWave46ExportGateReport;
  replayScaleWaveWave45IntegrationVerification: Agent24ReplayScaleWaveWave45IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave46IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave46IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave46IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave46IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave46IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave46IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave46_integration_handoff',
      detail: `Wave 40 integration handoff incomplete (${input.replayScaleWaveWave46IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave46IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww46iv_handoff', {
        satisfied: input.replayScaleWaveWave46IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave46ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave46_export',
      detail: `Wave 41 export gate blocked (${input.archiveScaleWaveWave46ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww46iv_export', {
        blockers: input.archiveScaleWaveWave46ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave45IntegrationVerification.verified) {
    issues.push({
      segment: 'wave40_integration_verification',
      detail: `Wave 40 integration verification open (${input.replayScaleWaveWave45IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww46iv_w34', {
        issues: input.replayScaleWaveWave45IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave46IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave46IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave46ExportGate.exportAllowed &&
    input.replayScaleWaveWave45IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA;

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
    handoffScore: input.replayScaleWaveWave46IntegrationHandoff.handoffScore,
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

export function runAgent24ReplayScaleWaveWave46IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave45IntegrationVerification = {
    reportId: 'w45iv',
    matchId: 'self',
    waveRound: 46,
    integrationBaselineSha: 'a9bb07e5',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww46iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg46',
    matchId: 'self',
    waveRound: 46,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww46_t46', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih46',
    matchId: 'self',
    waveRound: 46,
    integrationBaselineSha: O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww46ih_t46', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave46IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave46ExportGate: exportGate,
    replayScaleWaveWave45IntegrationVerification: wave45IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave46_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE46_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 46 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave46IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave46IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave46ExportGate: exportGate,
          replayScaleWaveWave45IntegrationVerification: wave45IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
