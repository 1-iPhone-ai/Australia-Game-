import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave26ExportGateReport } from './archive-scale-wave-wave26-export-gate.ts';
import type { Agent24ReplayScaleWaveWave25IntegrationVerificationReport } from './replay-scale-wave-wave25-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave26IntegrationHandoffReport } from './replay-scale-wave-wave26-integration-handoff.ts';
import { O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave26IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave26IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave26IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave26IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave26IntegrationHandoff: Agent24ReplayScaleWaveWave26IntegrationHandoffReport;
  archiveScaleWaveWave26ExportGate: Agent24ArchiveScaleWaveWave26ExportGateReport;
  replayScaleWaveWave25IntegrationVerification: Agent24ReplayScaleWaveWave25IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave26IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave26IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave26IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave26IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave26IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave26IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave26IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave26_integration_handoff',
      detail: `Wave 26 integration handoff incomplete (${input.replayScaleWaveWave26IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave26IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww26iv_handoff', {
        satisfied: input.replayScaleWaveWave26IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave26ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave26_export',
      detail: `Wave 26 export gate blocked (${input.archiveScaleWaveWave26ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww26iv_export', {
        blockers: input.archiveScaleWaveWave26ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave25IntegrationVerification.verified) {
    issues.push({
      segment: 'wave25_integration_verification',
      detail: `Wave 25 integration verification open (${input.replayScaleWaveWave25IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww26iv_w25', {
        issues: input.replayScaleWaveWave25IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave26IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave26IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave26ExportGate.exportAllowed &&
    input.replayScaleWaveWave25IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave26_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave26IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave26_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave26IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave25IntegrationVerification = {
    reportId: 'w25iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: '8d741ac7',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww25iv_t27', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg26',
    matchId: 'self',
    waveRound: 33,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww26_t27', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih26',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww26ih_t27', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave26IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave26IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave26ExportGate: exportGate,
    replayScaleWaveWave25IntegrationVerification: wave25IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave26_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE26_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 33 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave26IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave26IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave26ExportGate: exportGate,
          replayScaleWaveWave25IntegrationVerification: wave25IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
