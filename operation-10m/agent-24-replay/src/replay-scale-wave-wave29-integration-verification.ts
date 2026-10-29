import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave28ExportGateReport } from './archive-scale-wave-wave29-export-gate.ts';
import type { Agent24ReplayScaleWaveWave27IntegrationVerificationReport } from './replay-scale-wave-wave28-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave29IntegrationHandoffReport } from './replay-scale-wave-wave29-integration-handoff.ts';
import { O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave29IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave29IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave29IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave29IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave29IntegrationHandoff: Agent24ReplayScaleWaveWave29IntegrationHandoffReport;
  archiveScaleWaveWave29ExportGate: Agent24ArchiveScaleWaveWave28ExportGateReport;
  replayScaleWaveWave28IntegrationVerification: Agent24ReplayScaleWaveWave27IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave29IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave29IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave29IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave29IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave29IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave29IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave29IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave29_integration_handoff',
      detail: `Wave 29 integration handoff incomplete (${input.replayScaleWaveWave29IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave29IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww29iv_handoff', {
        satisfied: input.replayScaleWaveWave29IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave29ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave29_export',
      detail: `Wave 29 export gate blocked (${input.archiveScaleWaveWave29ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww29iv_export', {
        blockers: input.archiveScaleWaveWave29ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave28IntegrationVerification.verified) {
    issues.push({
      segment: 'wave28_integration_verification',
      detail: `Wave 28 integration verification open (${input.replayScaleWaveWave28IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww29iv_w28', {
        issues: input.replayScaleWaveWave28IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave29IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave29IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave29ExportGate.exportAllowed &&
    input.replayScaleWaveWave28IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave29_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave29IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave29_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave29IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave28IntegrationVerification = {
    reportId: 'w28iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: 'b9e129bd',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww28iv_t30', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg29',
    matchId: 'self',
    waveRound: 33,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww29_t30', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih29',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww29ih_t30', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave29IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave29IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave29ExportGate: exportGate,
    replayScaleWaveWave28IntegrationVerification: wave28IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave29_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE29_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave29IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave29IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave29ExportGate: exportGate,
          replayScaleWaveWave28IntegrationVerification: wave28IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
