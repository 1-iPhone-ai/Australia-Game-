import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveWave34ExportGateReport } from './archive-scale-wave-wave34-export-gate.ts';
import type { Agent24ReplayScaleWaveWave33IntegrationVerificationReport } from './replay-scale-wave-wave33-integration-verification.ts';
import type { Agent24ReplayScaleWaveWave34IntegrationHandoffReport } from './replay-scale-wave-wave34-integration-handoff.ts';
import { O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA } from './replay-scale-wave-integration-closeout.ts';

export interface Agent24ReplayScaleWaveWave34IntegrationVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveWave34IntegrationVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  integrationBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveWave34IntegrationVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveWave34IntegrationVerificationInput {
  matchId: string;
  replayScaleWaveWave34IntegrationHandoff: Agent24ReplayScaleWaveWave34IntegrationHandoffReport;
  archiveScaleWaveWave34ExportGate: Agent24ArchiveScaleWaveWave34ExportGateReport;
  replayScaleWaveWave33IntegrationVerification: Agent24ReplayScaleWaveWave33IntegrationVerificationReport;
}

export function buildAgent24ReplayScaleWaveWave34IntegrationVerificationReport(
  input: Agent24ReplayScaleWaveWave34IntegrationVerificationInput,
): Agent24ReplayScaleWaveWave34IntegrationVerificationReport {
  const waveRound = input.replayScaleWaveWave34IntegrationHandoff.waveRound;
  const integrationBaselineSha = input.replayScaleWaveWave34IntegrationHandoff.integrationBaselineSha;
  const issues: Agent24ReplayScaleWaveWave34IntegrationVerificationIssue[] = [];

  if (!input.replayScaleWaveWave34IntegrationHandoff.handoffComplete) {
    issues.push({
      segment: 'wave34_integration_handoff',
      detail: `Wave 33 integration handoff incomplete (${input.replayScaleWaveWave34IntegrationHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveWave34IntegrationHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rsww34iv_handoff', {
        satisfied: input.replayScaleWaveWave34IntegrationHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveWave34ExportGate.exportAllowed) {
    issues.push({
      segment: 'wave34_export',
      detail: `Wave 34 export gate blocked (${input.archiveScaleWaveWave34ExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rsww34iv_export', {
        blockers: input.archiveScaleWaveWave34ExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveWave33IntegrationVerification.verified) {
    issues.push({
      segment: 'wave33_integration_verification',
      detail: `Wave 33 integration verification open (${input.replayScaleWaveWave33IntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rsww34iv_w30', {
        issues: input.replayScaleWaveWave33IntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveWave34IntegrationHandoff.handoffScore) * 0.09;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveWave34IntegrationHandoff.handoffComplete &&
    input.archiveScaleWaveWave34ExportGate.exportAllowed &&
    input.replayScaleWaveWave33IntegrationVerification.verified &&
    integrationBaselineSha === O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_wave34_integration_verification', {
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
    handoffScore: input.replayScaleWaveWave34IntegrationHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_wave34_integration_verification_body', {
      waveRound,
      baseline: integrationBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveWave34IntegrationVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const wave32IntegrationVerification = {
    reportId: 'w33iv',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: '2187b54e',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww33iv_t34', { v: 1 }),
  };
  const exportGate = {
    reportId: 'eg34',
    matchId: 'self',
    waveRound: 33,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asww34_t33', { v: 1 }),
  };
  const integrationHandoff = {
    reportId: 'ih34',
    matchId: 'self',
    waveRound: 33,
    integrationBaselineSha: O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA,
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rsww34ih_t33', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveWave34IntegrationVerificationReport({
    matchId: 'self',
    replayScaleWaveWave34IntegrationHandoff: integrationHandoff,
    archiveScaleWaveWave34ExportGate: exportGate,
    replayScaleWaveWave33IntegrationVerification: wave32IntegrationVerification,
  });

  return [
    {
      name: 'verified_when_wave34_integration_stack_ready',
      passed:
        report.verified &&
        report.integrationBaselineSha === O6K_AGENT24_WAVE34_INTEGRATION_BASELINE_SHA,
    },
    { name: 'wave_round_pinned', passed: report.waveRound === 33 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveWave34IntegrationVerificationReport({
          matchId: 'self',
          replayScaleWaveWave34IntegrationHandoff: integrationHandoff,
          archiveScaleWaveWave34ExportGate: exportGate,
          replayScaleWaveWave33IntegrationVerification: wave32IntegrationVerification,
        }).deterministicFingerprint,
    },
  ];
}
