import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave32ExportGateReport } from './archive-scale-wave-wave32-export-gate.ts';
import type { Agent24ReplayScaleWaveWave31IntegrationVerificationReport } from './replay-scale-wave-wave31-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave32IntegrationHandoffReport } from './replay-scale-wave-wave32-integration-handoff.ts';
import { O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave32IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave32IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave32IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave32IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave32IntegrationHandoff: Agent24ReplayScaleWaveWave32IntegrationHandoffReport;
  archiveScaleWaveWave32ExportGate: Agent24ArchiveScaleWaveWave32ExportGateReport;
  replayScaleWaveWave31IntegrationVerification: Agent24ReplayScaleWaveWave31IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave32IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave32IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave32IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave32IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave32IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave32IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave32IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave32_integration_handoff',
      detail: `Wave 31 integration handoff incomplete (${input.replayScaleWaveWave32IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave32IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww32iv_handoff', {
        satisfied: input.replayScaleWaveWave32IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave32ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave32_export',
      detail: `Wave 31 export gate blocked (${input.archiveScaleWaveWave32ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww32iv_export', {
        blockers: input.archiveScaleWaveWave32ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave31IntegrationVerification.verified) {
    issues.push({
      segment: 'wave31_integration_verification',
      detail: `Wave 30 integration verification open (${input.replayScaleWaveWave31IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww32iv_w30', {
        issues: input.replayScaleWaveWave31IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave32IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave32IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave32ExportGate.exportAllowed &&
    input.replayScaleWaveWave31IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave32_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave32IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave32_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave32IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave31IntegrationVerification = {
    reportId: 'w30iv',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: '81b50b8e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww31iv_t32', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg31',
    matchId: 'self',
    waveRound: 31,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww32_t31', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih31',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww32ih_t31', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave32IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave32IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave32ExportGate: exportGate,
    replayScaleWaveWave31IntegrationVerification: wave31IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave32_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE32_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 31 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave32IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave32IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave32ExportGate: exportGate,
          replayScaleWaveWave31IntegrationVerification: wave31IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
