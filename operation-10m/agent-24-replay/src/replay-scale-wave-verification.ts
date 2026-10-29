import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayScaleWaveAcceptanceReport } from './replay-scale-wave-acceptance.ts';
import type { Agent24ReplayScaleWaveCloseoutReport } from './replay-scale-wave-closeout.ts';
import type { Agent24ReplayScaleWaveHandoffSeal } from './replay-scale-wave-handoff-seal.ts';

export interface Agent24ReplayScaleWaveVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveVerificationIssue[];
  closeoutScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveVerificationInput {
  matchId: string;
  replayScaleWaveCloseout: Agent24ReplayScaleWaveCloseoutReport;
  replayScaleWaveHandoffSeal: Agent24ReplayScaleWaveHandoffSeal;
  replayScaleWaveAcceptance: Agent24ReplayScaleWaveAcceptanceReport;
}

export function buildAgent24ReplayScaleWaveVerificationReport(
  input: Agent24ReplayScaleWaveVerificationInput,
): Agent24ReplayScaleWaveVerificationReport {
  const waveRound = input.replayScaleWaveAcceptance.waveRound;
  const issues: Agent24ReplayScaleWaveVerificationIssue[] = [];

  if (!input.replayScaleWaveCloseout.closeoutComplete) {
    issues.push({
      segment: 'closeout',
      detail: `Scale wave closeout incomplete (${input.replayScaleWaveCloseout.satisfiedCheckpointCount}/${input.replayScaleWaveCloseout.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rswv_closeout', {
        satisfied: input.replayScaleWaveCloseout.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveHandoffSeal.handoffReady) {
    issues.push({
      segment: 'handoff_seal',
      detail: `Scale wave handoff seal not ready (${input.replayScaleWaveHandoffSeal.readyLinkCount}/${input.replayScaleWaveHandoffSeal.linkCount})`,
      fingerprint: o6kAgent24Fingerprint('rswv_handoff', {
        ready: input.replayScaleWaveHandoffSeal.readyLinkCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveAcceptance.accepted) {
    issues.push({
      segment: 'acceptance',
      detail: `Scale wave acceptance blocked (${input.replayScaleWaveAcceptance.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswv_acceptance', {
        blockers: input.replayScaleWaveAcceptance.blockerCount,
        wave: waveRound,
      }),
    });
  }

  for (const blocker of input.replayScaleWaveAcceptance.blockers) {
    issues.push({
      segment: blocker.kind,
      detail: blocker.detail,
      fingerprint: o6kAgent24Fingerprint('rswv_blocker', { kind: blocker.kind, fp: blocker.fingerprint, wave: waveRound }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 13;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveCloseout.closeoutScore) * 0.12;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveCloseout.closeoutComplete &&
    input.replayScaleWaveHandoffSeal.handoffReady &&
    input.replayScaleWaveAcceptance.accepted;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_verification', { matchId: input.matchId, wave: waveRound }),
    matchId: input.matchId,
    waveRound,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    closeoutScore: input.replayScaleWaveCloseout.closeoutScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_verification_body', {
      waveRound,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const acceptance = {
    reportId: 'wa',
    matchId: 'self',
    waveRound: 24,
    accepted: true,
    blockerCount: 0,
    blockers: [],
    acceptanceScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswa_t18', { v: 1 }),
  };
  const handoffSeal = {
    sealId: 'sws',
    matchId: 'self',
    waveRound: 24,
    handoffReady: true,
    linkCount: 3,
    readyLinkCount: 3,
    links: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswhs_t18', { v: 1 }),
  };
  const closeout = {
    reportId: 'co',
    matchId: 'self',
    waveRound: 24,
    closeoutComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    closeoutScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswc_t18', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveVerificationReport({
    matchId: 'self',
    replayScaleWaveAcceptance: acceptance,
    replayScaleWaveHandoffSeal: handoffSeal,
    replayScaleWaveCloseout: closeout,
  });

  return [
    { name: 'verified_when_scale_wave_pipeline_ready', passed: report.verified && report.issueCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 24 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveVerificationReport({
          matchId: 'self',
          replayScaleWaveAcceptance: acceptance,
          replayScaleWaveHandoffSeal: handoffSeal,
          replayScaleWaveCloseout: closeout,
        }).deterministicFingerprint,
    },
  ];
}
