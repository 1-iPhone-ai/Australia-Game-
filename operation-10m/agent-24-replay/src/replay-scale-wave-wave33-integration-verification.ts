import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave33ExportGateReport } from './archive-scale-wave-wave33-export-gate.ts';
import type { Agent24ReplayScaleWaveWave32IntegrationVerificationReport } from './replay-scale-wave-wave32-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave33IntegrationHandoffReport } from './replay-scale-wave-wave33-integration-handoff.ts';
import { O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave33IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave33IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave33IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave33IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave33IntegrationHandoff: Agent24ReplayScaleWaveWave33IntegrationHandoffReport;
  archiveScaleWaveWave33ExportGate: Agent24ArchiveScaleWaveWave33ExportGateReport;
  replayScaleWaveWave32IntegrationVerification: Agent24ReplayScaleWaveWave32IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave33IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave33IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave33IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave33IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave33IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave33IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave33IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave33_integration_handoff',
      detail: `Wave 31 integration handoff incomplete (${input.replayScaleWaveWave33IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave33IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww33iv_handoff', {
        satisfied: input.replayScaleWaveWave33IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave33ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave33_export',
      detail: `Wave 31 export gate blocked (${input.archiveScaleWaveWave33ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww33iv_export', {
        blockers: input.archiveScaleWaveWave33ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave32IntegrationVerification.verified) {
    issues.push({
      segment: 'wave32_integration_verification',
      detail: `Wave 30 integration verification open (${input.replayScaleWaveWave32IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww33iv_w30', {
        issues: input.replayScaleWaveWave32IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave33IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave33IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave33ExportGate.exportAllowed &&
    input.replayScaleWaveWave32IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave33_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave33IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave33_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave33IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave32IntegrationVerification = {
    reportId: 'w30iv',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: 'aa70dace',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww32iv_t33', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg31',
    matchId: 'self',
    waveRound: 31,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww33_t31', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih31',
    matchId: 'self',
    waveRound: 31,
    integrationBaselineSha: O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww33ih_t31', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave33IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave33IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave33ExportGate: exportGate,
    replayScaleWaveWave32IntegrationVerification: wave32IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave33_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE33_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 32 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave33IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave33IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave33ExportGate: exportGate,
          replayScaleWaveWave32IntegrationVerification: wave32IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
