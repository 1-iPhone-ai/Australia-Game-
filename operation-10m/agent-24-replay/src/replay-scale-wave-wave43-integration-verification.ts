import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave43ExportGateReport } from './archive-scale-wave-wave43-export-gate.ts';
import type { Agent24ReplayScaleWaveWave42IntegrationVerificationReport } from './replay-scale-wave-wave42-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave43IntegrationHandoffReport } from './replay-scale-wave-wave43-integration-handoff.ts';
import { O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave43IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave43IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave43IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave43IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave43IntegrationHandoff: Agent24ReplayScaleWaveWave43IntegrationHandoffReport;
  archiveScaleWaveWave43ExportGate: Agent24ArchiveScaleWaveWave43ExportGateReport;
  replayScaleWaveWave42IntegrationVerification: Agent24ReplayScaleWaveWave42IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave43IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave43IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave43IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave43IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave43IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave43IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave43IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave43_integration_handoff',
      detail: `Wave 37 integration handoff incomplete (${input.replayScaleWaveWave43IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave43IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww43iv_handoff', {
        satisfied: input.replayScaleWaveWave43IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave43ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave43_export',
      detail: `Wave 38 export gate blocked (${input.archiveScaleWaveWave43ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww43iv_export', {
        blockers: input.archiveScaleWaveWave43ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave42IntegrationVerification.verified) {
    issues.push({
      segment: 'wave37_integration_verification',
      detail: `Wave 37 integration verification open (${input.replayScaleWaveWave42IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww43iv_w34', {
        issues: input.replayScaleWaveWave42IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave43IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave43IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave43ExportGate.exportAllowed &&
    input.replayScaleWaveWave42IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA;

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
    handoffScore: input.replayScaleWaveWave43IntegrationHandoff.handoffScore,
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

export function runAgent24ReplayScaleWaveWave43IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave42IntegrationVerification = {
    reportId: 'w42iv',
    matchId: 'self',
    waveRound: 43,
    integrationBaselineSha: '641d7d16',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww43iv_t40', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg43',
    matchId: 'self',
    waveRound: 43,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww43_t43', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih43',
    matchId: 'self',
    waveRound: 43,
    integrationBaselineSha: O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww43ih_t43', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave43IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave43IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave43ExportGate: exportGate,
    replayScaleWaveWave42IntegrationVerification: wave42IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave43_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE43_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 43 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave43IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave43IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave43ExportGate: exportGate,
          replayScaleWaveWave42IntegrationVerification: wave42IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
