import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave38ExportGateReport } from './archive-scale-wave-wave38-export-gate.ts';
import type { Agent24ReplayScaleWaveWave37IntegrationVerificationReport } from './replay-scale-wave-wave37-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave38IntegrationHandoffReport } from './replay-scale-wave-wave38-integration-handoff.ts';
import { O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave38IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave38IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave38IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave38IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave38IntegrationHandoff: Agent24ReplayScaleWaveWave38IntegrationHandoffReport;
  archiveScaleWaveWave38ExportGate: Agent24ArchiveScaleWaveWave38ExportGateReport;
  replayScaleWaveWave37IntegrationVerification: Agent24ReplayScaleWaveWave37IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave38IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave38IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave38IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave38IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave38IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave38IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave38IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave38_integration_handoff',
      detail: `Wave 34 integration handoff incomplete (${input.replayScaleWaveWave38IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave38IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww38iv_handoff', {
        satisfied: input.replayScaleWaveWave38IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave38ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave38_export',
      detail: `Wave 35 export gate blocked (${input.archiveScaleWaveWave38ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww38iv_export', {
        blockers: input.archiveScaleWaveWave38ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave37IntegrationVerification.verified) {
    issues.push({
      segment: 'wave34_integration_verification',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave37IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww38iv_w34', {
        issues: input.replayScaleWaveWave37IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave38IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave38IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave38ExportGate.exportAllowed &&
    input.replayScaleWaveWave37IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave38_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave38IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave38_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave38IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave37IntegrationVerification = {
    reportId: 'w37iv',
    matchId: 'self',
    waveRound: 38,
    integrationBaselineSha: 'cfb4603e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww38iv_t38', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg38',
    matchId: 'self',
    waveRound: 38,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww38_t38', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih38',
    matchId: 'self',
    waveRound: 38,
    integrationBaselineSha: O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww38ih_t38', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave38IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave38IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave38ExportGate: exportGate,
    replayScaleWaveWave37IntegrationVerification: wave37IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave38_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE38_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 38 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave38IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave38IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave38ExportGate: exportGate,
          replayScaleWaveWave37IntegrationVerification: wave37IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
