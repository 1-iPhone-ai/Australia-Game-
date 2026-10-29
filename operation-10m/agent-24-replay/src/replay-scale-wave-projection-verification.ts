import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWaveExportGateReport } from './archive-scale-wave-export-gate.ts';
import type { Agent24ReplayScaleWaveIntegrationVerificationReport } from './replay-scale-wave-integration-verification.ts';
import type { Agent24ReplayScaleWaveProjectionHandoffSeal } from './replay-scale-wave-projection-handoff.ts';

export interface Agent24ReplayScaleWaveProjectionVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveProjectionVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  projectionBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveProjectionVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveProjectionVerificationInput {
  matchId: string;
  replayScaleWaveProjectionHandoffSeal: Agent24ReplayScaleWaveProjectionHandoffSeal;
  replayScaleWaveIntegrationVerification: Agent24ReplayScaleWaveIntegrationVerificationReport;
  archiveScaleWaveExportGate: Agent24ArchiveScaleWaveExportGateReport;
}

export function buildAgent24ReplayScaleWaveProjectionVerificationReport(
  input: Agent24ReplayScaleWaveProjectionVerificationInput,
): Agent24ReplayScaleWaveProjectionVerificationReport {
  const waveRound = input.replayScaleWaveProjectionHandoffSeal.waveRound;
  const projectionBaselineSha = input.replayScaleWaveProjectionHandoffSeal.projectionBaselineSha;
  const issues: Agent24ReplayScaleWaveProjectionVerificationIssue[] = [];

  if (!input.replayScaleWaveProjectionHandoffSeal.handoffReady) {
    issues.push({
      segment: 'projection_handoff',
      detail: `Projection handoff not ready (${input.replayScaleWaveProjectionHandoffSeal.readyLinkCount}/${input.replayScaleWaveProjectionHandoffSeal.linkCount})`,
      fingerprint: o6kAgent24Fingerprint('rswpv_handoff', {
        ready: input.replayScaleWaveProjectionHandoffSeal.readyLinkCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveIntegrationVerification.verified) {
    issues.push({
      segment: 'integration_verification',
      detail: `Integration verification open (${input.replayScaleWaveIntegrationVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rswpv_int', {
        issues: input.replayScaleWaveIntegrationVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWaveExportGate.exportAllowed) {
    issues.push({
      segment: 'export_gate',
      detail: `Export gate blocked (${input.archiveScaleWaveExportGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswpv_export', {
        blockers: input.archiveScaleWaveExportGate.blockerCount,
        wave: waveRound,
      }),
    });
  }
  if (
    input.replayScaleWaveIntegrationVerification.integrationBaselineSha !== projectionBaselineSha &&
    waveRound >= 20
  ) {
    issues.push({
      segment: 'baseline_mismatch',
      detail: 'Integration and projection baselines diverge',
      fingerprint: o6kAgent24Fingerprint('rswpv_baseline', {
        int: input.replayScaleWaveIntegrationVerification.integrationBaselineSha,
        proj: projectionBaselineSha,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 12;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveProjectionHandoffSeal.handoffScore) * 0.1;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveProjectionHandoffSeal.handoffReady &&
    input.replayScaleWaveIntegrationVerification.verified &&
    input.archiveScaleWaveExportGate.exportAllowed;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_projection_verification', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: projectionBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    projectionBaselineSha,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    handoffScore: input.replayScaleWaveProjectionHandoffSeal.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_projection_verification_body', {
      waveRound,
      baseline: projectionBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveProjectionVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const exportGate = {
    reportId: 'eg',
    matchId: 'self',
    waveRound: 43,
    exportAllowed: true,
    blockerCount: 0,
    blockers: [],
    exportScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('asweg_t21', { v: 1 }),
  };
  const integrationVerification = {
    reportId: 'iv',
    matchId: 'self',
    waveRound: 43,
    integrationBaselineSha: '99f2e72b',
    verified: true,
    issueCount: 0,
    issues: [],
    closeoutScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswiv_t21', { v: 1 }),
  };
  const projectionHandoff = {
    sealId: 'ph',
    matchId: 'self',
    waveRound: 43,
    projectionBaselineSha: '99f2e72b',
    handoffReady: true,
    linkCount: 3,
    readyLinkCount: 3,
    links: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswph_t21', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveProjectionVerificationReport({
    matchId: 'self',
    replayScaleWaveProjectionHandoffSeal: projectionHandoff,
    replayScaleWaveIntegrationVerification: integrationVerification,
    archiveScaleWaveExportGate: exportGate,
  });

  return [
    { name: 'verified_when_projection_stack_ready', passed: report.verified && report.issueCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 43 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveProjectionVerificationReport({
          matchId: 'self',
          replayScaleWaveProjectionHandoffSeal: projectionHandoff,
          replayScaleWaveIntegrationVerification: integrationVerification,
          archiveScaleWaveExportGate: exportGate,
        }).deterministicFingerprint,
    },
  ];
}
