import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveContinuityVerificationReport } from './archive-continuity-verification.ts';
import type { Agent24ExportReadinessReport } from './export-readiness.ts';
import type { Agent24ReplayAnalyticsDepth } from './analytics-depth.ts';

export type Agent24ScaleWaveAcceptanceBlockerKind =
  | 'continuity_not_verified'
  | 'export_not_ready'
  | 'analytics_depth_low';

export interface Agent24ScaleWaveAcceptanceBlocker {
  kind: Agent24ScaleWaveAcceptanceBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveAcceptanceReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  accepted: boolean;
  blockerCount: number;
  blockers: Agent24ScaleWaveAcceptanceBlocker[];
  acceptanceScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveAcceptanceInput {
  matchId: string;
  waveRound?: number;
  archiveContinuityVerification: Agent24ArchiveContinuityVerificationReport;
  exportReadiness: Agent24ExportReadinessReport;
  analyticsDepth: Agent24ReplayAnalyticsDepth;
  minDepthScore?: number;
}

export function buildAgent24ReplayScaleWaveAcceptanceReport(
  input: Agent24ReplayScaleWaveAcceptanceInput,
): Agent24ReplayScaleWaveAcceptanceReport {
  const waveRound = input.waveRound ?? 27;
  const minDepth = input.minDepthScore ?? 55;
  const blockers: Agent24ScaleWaveAcceptanceBlocker[] = [];

  if (!input.archiveContinuityVerification.verified) {
    blockers.push({
      kind: 'continuity_not_verified',
      detail: `Continuity verification score ${input.archiveContinuityVerification.verificationScore}`,
      fingerprint: o6kAgent24Fingerprint('rswa_continuity', {
        verified: input.archiveContinuityVerification.verified,
      }),
    });
  }
  if (!input.exportReadiness.ready) {
    blockers.push({
      kind: 'export_not_ready',
      detail: `Export readiness blocked (${input.exportReadiness.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswa_export', { blockers: input.exportReadiness.blockerCount }),
    });
  }
  if (input.analyticsDepth.integrityScore < minDepth) {
    blockers.push({
      kind: 'analytics_depth_low',
      detail: `Analytics depth integrity ${input.analyticsDepth.integrityScore} below ${minDepth}`,
      fingerprint: o6kAgent24Fingerprint('rswa_depth', { score: input.analyticsDepth.integrityScore }),
    });
  }

  let acceptanceScore = 100;
  acceptanceScore -= blockers.length * 20;
  acceptanceScore -= Math.max(0, minDepth - input.analyticsDepth.integrityScore) * 0.5;
  acceptanceScore = Math.max(0, Math.min(100, Math.round(acceptanceScore)));

  const accepted = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_acceptance', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    accepted,
    blockerCount: blockers.length,
    blockers,
    acceptanceScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_acceptance_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      accepted,
      acceptanceScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveAcceptanceSelfTests(): Array<{ name: string; passed: boolean }> {
  const continuityVerification = {
    reportId: 'cv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    finalizationScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acv_t', { v: 1 }),
  };
  const exportReadiness = {
    reportId: 'er',
    matchId: 'self',
    ready: true,
    readinessScore: 95,
    blockerCount: 0,
    blockers: [],
    deterministicFingerprint: o6kAgent24Fingerprint('er_t', { v: 1 }),
  };
  const analyticsDepth = {
    depthId: 'd',
    milestoneCategoryRollups: [],
    totalMilestoneWeight: 10,
    causalDepthHistogram: [],
    longestCausalChainLength: 4,
    timelineEntryCount: 2,
    branchTimelineCount: 1,
    replayEventCount: 12,
    checkpointCount: 3,
    lateGamePhase: 'midgame',
    integrityScore: 80,
    deterministicFingerprint: o6kAgent24Fingerprint('depth_t', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveAcceptanceReport({
    matchId: 'self',
    waveRound: 43,
    archiveContinuityVerification: continuityVerification,
    exportReadiness,
    analyticsDepth,
  });

  return [
    { name: 'accepted_when_wave_gates_pass', passed: report.accepted && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 43 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveAcceptanceReport({
          matchId: 'self',
          waveRound: 43,
          archiveContinuityVerification: continuityVerification,
          exportReadiness,
          analyticsDepth,
        }).deterministicFingerprint,
    },
  ];
}
