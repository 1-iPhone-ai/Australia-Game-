import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveContinuityFinalizationReport } from './archive-continuity-finalization.ts';
import type { Agent24ArchiveHandoffVerificationReport } from './archive-handoff-verification.ts';
import type { Agent24ReplayPipelineCloseoutReport } from './replay-pipeline-closeout.ts';

export interface Agent24ArchiveContinuityVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ArchiveContinuityVerificationReport {
  reportId: string;
  matchId: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ArchiveContinuityVerificationIssue[];
  finalizationScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ArchiveContinuityVerificationInput {
  matchId: string;
  archiveContinuityFinalization: Agent24ArchiveContinuityFinalizationReport;
  archiveHandoffVerification: Agent24ArchiveHandoffVerificationReport;
  replayPipelineCloseout: Agent24ReplayPipelineCloseoutReport;
}

export function buildAgent24ArchiveContinuityVerificationReport(
  input: Agent24ArchiveContinuityVerificationInput,
): Agent24ArchiveContinuityVerificationReport {
  const issues: Agent24ArchiveContinuityVerificationIssue[] = [];

  if (!input.archiveContinuityFinalization.finalized) {
    issues.push({
      segment: 'finalization',
      detail: `Continuity finalization blocked (${input.archiveContinuityFinalization.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('acv_finalization', {
        blockers: input.archiveContinuityFinalization.blockerCount,
      }),
    });
  }
  if (!input.archiveHandoffVerification.verified) {
    issues.push({
      segment: 'handoff',
      detail: `Handoff verification open (${input.archiveHandoffVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('acv_handoff', { issues: input.archiveHandoffVerification.issueCount }),
    });
  }
  if (!input.replayPipelineCloseout.closeoutComplete) {
    issues.push({
      segment: 'closeout',
      detail: `Pipeline closeout incomplete (${input.replayPipelineCloseout.satisfiedCheckpointCount}/${input.replayPipelineCloseout.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('acv_closeout', {
        satisfied: input.replayPipelineCloseout.satisfiedCheckpointCount,
      }),
    });
  }

  for (const blocker of input.archiveContinuityFinalization.blockers) {
    issues.push({
      segment: blocker.kind,
      detail: blocker.detail,
      fingerprint: o6kAgent24Fingerprint('acv_blocker', { kind: blocker.kind, fp: blocker.fingerprint }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 12;
  verificationScore -= Math.max(0, 100 - input.archiveContinuityFinalization.finalizationScore) * 0.1;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.archiveContinuityFinalization.finalized &&
    input.archiveHandoffVerification.verified &&
    input.replayPipelineCloseout.closeoutComplete;

  return {
    reportId: o6kAgent24Fingerprint('archive_continuity_verification', { matchId: input.matchId }),
    matchId: input.matchId,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    finalizationScore: input.archiveContinuityFinalization.finalizationScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('archive_continuity_verification_body', {
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ArchiveContinuityVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const closeout = {
    reportId: 'co',
    matchId: 'self',
    currentTurn: 40,
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rpc_f', { v: 1 }),
  };
  const handoffVerification = {
    reportId: 'hv',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    readyLinkCount: 3,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('ahv_f', { v: 1 }),
  };
  const finalization = {
    reportId: 'fin',
    matchId: 'self',
    finalized: true,
    blockerCount: 0,
    blockers: [],
    finalizationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('acf_f', { v: 1 }),
  };

  const report = buildAgent24ArchiveContinuityVerificationReport({
    matchId: 'self',
    archiveContinuityFinalization: finalization,
    archiveHandoffVerification: handoffVerification,
    replayPipelineCloseout: closeout,
  });

  return [
    { name: 'verified_when_continuity_pipeline_ready', passed: report.verified && report.issueCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ArchiveContinuityVerificationReport({
          matchId: 'self',
          archiveContinuityFinalization: finalization,
          archiveHandoffVerification: handoffVerification,
          replayPipelineCloseout: closeout,
        }).deterministicFingerprint,
    },
  ];
}
