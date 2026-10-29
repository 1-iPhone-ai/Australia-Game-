import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave40ExportGateReport } from './archive-scale-wave-wave40-export-gate.ts';
import type { Agent24ReplayScaleWaveWave39IntegrationVerificationReport } from './replay-scale-wave-wave39-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave40IntegrationHandoffReport } from './replay-scale-wave-wave40-integration-handoff.ts';
import { O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave40IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave40IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave40IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave40IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave40IntegrationHandoff: Agent24ReplayScaleWaveWave40IntegrationHandoffReport;
  archiveScaleWaveWave40ExportGate: Agent24ArchiveScaleWaveWave40ExportGateReport;
  replayScaleWaveWave39IntegrationVerification: Agent24ReplayScaleWaveWave39IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave40IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave40IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave40IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave40IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave40IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave40IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave40IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave40_integration_handoff',
      detail: `Wave 34 integration handoff incomplete (${input.replayScaleWaveWave40IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave40IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww40iv_handoff', {
        satisfied: input.replayScaleWaveWave40IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave40ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave40_export',
      detail: `Wave 35 export gate blocked (${input.archiveScaleWaveWave40ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww40iv_export', {
        blockers: input.archiveScaleWaveWave40ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave39IntegrationVerification.verified) {
    issues.push({
      segment: 'wave34_integration_verification',
      detail: `Wave 34 integration verification open (${input.replayScaleWaveWave39IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww40iv_w34', {
        issues: input.replayScaleWaveWave39IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave40IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave40IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave40ExportGate.exportAllowed &&
    input.replayScaleWaveWave39IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave40_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave40IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave40_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave40IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave39IntegrationVerification = {
    reportId: 'w39iv',
    matchId: 'self',
    waveRound: 40,
    integrationBaselineSha: '6134c6ae',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww40iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg40',
    matchId: 'self',
    waveRound: 40,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww40_t40', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih40',
    matchId: 'self',
    waveRound: 40,
    integrationBaselineSha: O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww40ih_t40', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave40IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave40IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave40ExportGate: exportGate,
    replayScaleWaveWave39IntegrationVerification: wave39IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave40_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE40_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 40 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave40IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave40IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave40ExportGate: exportGate,
          replayScaleWaveWave39IntegrationVerification: wave39IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
