import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave45ExportGateReport } from './archive-scale-wave-wave45-export-gate.ts';
import type { Agent24ReplayScaleWaveWave44IntegrationVerificationReport } from './replay-scale-wave-wave44-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave45IntegrationHandoffReport } from './replay-scale-wave-wave45-integration-handoff.ts';
import { O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave45IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave45IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave45IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave45IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave45IntegrationHandoff: Agent24ReplayScaleWaveWave45IntegrationHandoffReport;
  archiveScaleWaveWave45ExportGate: Agent24ArchiveScaleWaveWave45ExportGateReport;
  replayScaleWaveWave44IntegrationVerification: Agent24ReplayScaleWaveWave44IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave45IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave45IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave45IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave45IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave45IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave45IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave45IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave45_integration_handoff',
      detail: `Wave 39 integration handoff incomplete (${input.replayScaleWaveWave45IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave45IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww45iv_handoff', {
        satisfied: input.replayScaleWaveWave45IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave45ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave45_export',
      detail: `Wave 40 export gate blocked (${input.archiveScaleWaveWave45ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww45iv_export', {
        blockers: input.archiveScaleWaveWave45ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave44IntegrationVerification.verified) {
    issues.push({
      segment: 'wave39_integration_verification',
      detail: `Wave 39 integration verification open (${input.replayScaleWaveWave44IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww45iv_w34', {
        issues: input.replayScaleWaveWave44IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave45IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave45IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave45ExportGate.exportAllowed &&
    input.replayScaleWaveWave44IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA;

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
    handoffScore: input.replayScaleWaveWave45IntegrationHandoff.handoffScore,
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

export function runAgent24ReplayScaleWaveWave45IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave44IntegrationVerification = {
    reportId: 'w44iv',
    matchId: 'self',
    waveRound: 45,
    integrationBaselineSha: '98bcd652',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww45iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg45',
    matchId: 'self',
    waveRound: 45,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww45_t45', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih45',
    matchId: 'self',
    waveRound: 45,
    integrationBaselineSha: O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww45ih_t45', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave45IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave45IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave45ExportGate: exportGate,
    replayScaleWaveWave44IntegrationVerification: wave44IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave45_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE45_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 45 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave45IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave45IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave45ExportGate: exportGate,
          replayScaleWaveWave44IntegrationVerification: wave44IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
