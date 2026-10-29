import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave51ExportGateReport } from './archive-scale-wave-wave51-export-gate.ts';
import type { Agent24ReplayScaleWaveWave50IntegrationVerificationReport } from './replay-scale-wave-wave50-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave51IntegrationHandoffReport } from './replay-scale-wave-wave51-integration-handoff.ts';
import { O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave51IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave51IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave51IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave51IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave51IntegrationHandoff: Agent24ReplayScaleWaveWave51IntegrationHandoffReport;
  archiveScaleWaveWave51ExportGate: Agent24ArchiveScaleWaveWave51ExportGateReport;
  replayScaleWaveWave50IntegrationVerification: Agent24ReplayScaleWaveWave50IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave51IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave51IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave51IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave51IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave51IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave51IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave51IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave51_integration_handoff',
      detail: `Wave 45 integration handoff incomplete (${input.replayScaleWaveWave51IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave51IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww51iv_handoff', {
        satisfied: input.replayScaleWaveWave51IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave51ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave51_export',
      detail: `Wave 46 export gate blocked (${input.archiveScaleWaveWave51ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww51iv_export', {
        blockers: input.archiveScaleWaveWave51ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave50IntegrationVerification.verified) {
    issues.push({
      segment: 'wave45_integration_verification',
      detail: `Wave 45 integration verification open (${input.replayScaleWaveWave50IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww51iv_w34', {
        issues: input.replayScaleWaveWave50IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave51IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave51IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave51ExportGate.exportAllowed &&
    input.replayScaleWaveWave50IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave45_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave51IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave45_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave51IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave50IntegrationVerification = {
    reportId: 'w50iv',
    matchId: 'self',
    waveRound: 51,
    integrationBaselineSha: 'a32b2b15',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww51iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg51',
    matchId: 'self',
    waveRound: 51,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww51_t51', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih51',
    matchId: 'self',
    waveRound: 51,
    integrationBaselineSha: O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww51ih_t51', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave51IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave51IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave51ExportGate: exportGate,
    replayScaleWaveWave50IntegrationVerification: wave50IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave51_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE51_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 51 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave51IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave51IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave51ExportGate: exportGate,
          replayScaleWaveWave50IntegrationVerification: wave50IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
