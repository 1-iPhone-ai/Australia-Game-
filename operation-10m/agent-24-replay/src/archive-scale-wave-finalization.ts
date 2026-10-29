import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveReleaseVerificationReport } from './archive-release-verification.ts';
import type { Agent24ReplayScaleWaveCloseoutReport } from './replay-scale-wave-closeout.ts';
import type { Agent24ReplayScaleWaveVerificationReport } from './replay-scale-wave-verification.ts';

export type Agent24ArchiveScaleWaveFinalizationBlockerKind =
  | 'verification_failed'
  | 'closeout_incomplete'
  | 'release_not_verified';

export interface Agent24ArchiveScaleWaveFinalizationBlocker {
  kind: Agent24ArchiveScaleWaveFinalizationBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveScaleWaveFinalizationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  finalized: boolean;
  blockerCount: number;
  blockers: Agent24ArchiveScaleWaveFinalizationBlocker[];
  finalizationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveScaleWaveFinalizationInput {
  matchId: string;
  replayScaleWaveVerification: Agent24ReplayScaleWaveVerificationReport;
  replayScaleWaveCloseout: Agent24ReplayScaleWaveCloseoutReport;
  archiveReleaseVerification: Agent24ArchiveReleaseVerificationReport;
}

export function buildAgent24ArchiveScaleWaveFinalizationReport(
  input: Agent24ArchiveScaleWaveFinalizationInput,
): Agent24ArchiveScaleWaveFinalizationReport {
  const waveRound = input.replayScaleWaveVerification.waveRound;
  const blockers: Agent24ArchiveScaleWaveFinalizationBlocker[] = [];

  if (!input.replayScaleWaveVerification.verified) {
    blockers.push({
      kind: 'verification_failed',
      detail: `Scale wave verification open (${input.replayScaleWaveVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswf_verify', {
        issues: input.replayScaleWaveVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveCloseout.closeoutComplete) {
    blockers.push({
      kind: 'closeout_incomplete',
      detail: `Scale wave closeout ${input.replayScaleWaveCloseout.satisfiedCheckpointCount}/${input.replayScaleWaveCloseout.checkpointCount}`,
      fingerprint: o6kAgent24Fingerprint('aswf_closeout', {
        satisfied: input.replayScaleWaveCloseout.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveReleaseVerification.verified) {
    blockers.push({
      kind: 'release_not_verified',
      detail: `Archive release verification open (${input.archiveReleaseVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('aswf_release', {
        issues: input.archiveReleaseVerification.issueCount,
        wave: waveRound,
      }),
    });
  }

  let finalizationScore = 100;
  finalizationScore -= blockers.length * 22;
  finalizationScore -= Math.max(0, 100 - input.replayScaleWaveVerification.verificationScore) * 0.11;
  finalizationScore = Math.max(0, Math.min(100, Math.round(finalizationScore)));

  const finalized = blockers.length === 0;

  return {
    reportId: o6kAgent24Fingerprint('archive_scale_wave_finalization', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    finalized,
    blockerCount: blockers.length,
    blockers,
    finalizationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_scale_wave_finalization_body', {
      waveRound,
      blockers: blockers.map(b => b.fingerprint),
      finalized,
      finalizationScore,
    }),
  };
}

export function runAgent24ArchiveScaleWaveFinalizationSelfTests(): Array<{ name: string; passed: boolean }> {
  const releaseVerification = {
    reportId: 'rv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    releaseScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('arv_t18', { v: 1 }),
  };
  const closeout = {
    reportId: 'co',
    matchId: 'self',
    waveRound: 30,
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswc_t18', { v: 2 }),
  };
  const verification = {
    reportId: 'sv',
    matchId: 'self',
    waveRound: 30,
    verified: true,
    issueCount: 0,
    issues: [],
    closeoutScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswv_t18', { v: 1 }),
  };

  const report = buildAgent24ArchiveScaleWaveFinalizationReport({
    matchId: 'self',
    replayScaleWaveVerification: verification,
    replayScaleWaveCloseout: closeout,
    archiveReleaseVerification: releaseVerification,
  });

  return [
    { name: 'finalized_when_scale_wave_stack_ready', passed: report.finalized && report.blockerCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 30 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveScaleWaveFinalizationReport({
          matchId: 'self',
          replayScaleWaveVerification: verification,
          replayScaleWaveCloseout: closeout,
          archiveReleaseVerification: releaseVerification,
        }).deterministicFingerprint,
    },
  ];
}
