import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave24ExportGateReport } from './archive-scale-wave-wave24-export-gate.ts';
import type { Agent24ReplayScaleWaveWave23IntegrationVerificationReport } from './replay-scale-wave-wave23-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave24IntegrationHandoffReport } from './replay-scale-wave-wave24-integration-handoff.ts';
import {
  O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
  O6K_AGENT24_WAVE25_INTEGRATION_BASELINE_SHA,
} from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave24IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave24IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave24IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave24IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave24IntegrationHandoff: Agent24ReplayScaleWaveWave24IntegrationHandoffReport;
  archiveScaleWaveWave24ExportGate: Agent24ArchiveScaleWaveWave24ExportGateReport;
  replayScaleWaveWave23IntegrationVerification: Agent24ReplayScaleWaveWave23IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave24IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave24IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave24IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave24IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave24IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave24IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave24IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave24_integration_handoff',
      detail: `Wave 24 integration handoff incomplete (${input.replayScaleWaveWave24IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave24IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww24iv_handoff', {
        satisfied: input.replayScaleWaveWave24IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave24ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave24_export',
      detail: `Wave 24 export gate blocked (${input.archiveScaleWaveWave24ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww24iv_export', {
        blockers: input.archiveScaleWaveWave24ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave23IntegrationVerification.verified) {
    issues.push({
      segment: 'wave23_integration_verification',
      detail: `Wave 23 integration verification open (${input.replayScaleWaveWave23IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww24iv_w23', {
        issues: input.replayScaleWaveWave23IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave24IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave24IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave24ExportGate.exportAllowed &&
    input.replayScaleWaveWave23IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave24_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave24IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave24_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave24IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave23IntegrationVerification = {
    reportId: 'w23iv',
    matchId: 'self',
    waveRound: 26,
    integrationBaselineSha: 'b23e1449',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww23iv_t25', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg24',
    matchId: 'self',
    waveRound: 26,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww24_t25', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih24',
    matchId: 'self',
    waveRound: 26,
    integrationBaselineSha: O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww24ih_t25', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave24IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave24IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave24ExportGate: exportGate,
    replayScaleWaveWave23IntegrationVerification: wave23IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave24_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE24_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 26 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave24IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave24IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave24ExportGate: exportGate,
          replayScaleWaveWave23IntegrationVerification: wave23IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
