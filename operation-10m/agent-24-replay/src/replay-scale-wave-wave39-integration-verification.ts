import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave39ExportGateReport } from './archive-scale-wave-wave39-export-gate.ts';
import type { Agent24ReplayScaleWaveWave38IntegrationVerificationReport } from './replay-scale-wave-wave38-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave39IntegrationHandoffReport } from './replay-scale-wave-wave39-integration-handoff.ts';
import { O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave39IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave39IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave39IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave39IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave39IntegrationHandoff: Agent24ReplayScaleWaveWave39IntegrationHandoffReport;
  archiveScaleWaveWave39ExportGate: Agent24ArchiveScaleWaveWave39ExportGateReport;
  replayScaleWaveWave38IntegrationVerification: Agent24ReplayScaleWaveWave38IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave39IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave39IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave39IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave39IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave39IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave39IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave39IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave39_integration_handoff',
      detail: `Wave 34 integration handoff incomplete (${input.replayScaleWaveWave39IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave39IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww39iv_handoff', {
        satisfied: input.replayScaleWaveWave39IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave39ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave39_export',
      detail: `Wave 35 export gate blocked (${input.archiveScaleWaveWave39ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww39iv_export', {
        blockers: input.archiveScaleWaveWave39ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave38IntegrationVerification.verified) {
    issues.push({
      segment: 'wave34_integration_verification',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave38IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww39iv_w34', {
        issues: input.replayScaleWaveWave38IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave39IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave39IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave39ExportGate.exportAllowed &&
    input.replayScaleWaveWave38IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave39_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave39IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave39_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave39IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave38IntegrationVerification = {
    reportId: 'w38iv',
    matchId: 'self',
    waveRound: 39,
    integrationBaselineSha: 'b44b36fe',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww39iv_t39', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg39',
    matchId: 'self',
    waveRound: 39,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww39_t39', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih39',
    matchId: 'self',
    waveRound: 39,
    integrationBaselineSha: O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww39ih_t39', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave39IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave39IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave39ExportGate: exportGate,
    replayScaleWaveWave38IntegrationVerification: wave38IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave39_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE39_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 39 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave39IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave39IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave39ExportGate: exportGate,
          replayScaleWaveWave38IntegrationVerification: wave38IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
