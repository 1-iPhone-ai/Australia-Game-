import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ArchiveScaleWavePostProjectionGateReport } from './archive-scale-wave-post-projection-gate.ts';
import type { Agent24ReplayScaleWaveDryrunHandoffReport } from './replay-scale-wave-dryrun-handoff.ts';
import type { Agent24ReplayScaleWaveProjectionVerificationReport } from './replay-scale-wave-projection-verification.ts';

export interface Agent24ReplayScaleWaveDryrunVerificationIssue {
  segment: string;
  detail: string;
  fingerprint: string;
}

export interface Agent24ReplayScaleWaveDryrunVerificationReport {
  reportId: string;
  matchId: string;
  waveRound: number;
  dryrunBaselineSha: string;
  verified: boolean;
  issueCount: number;
  issues: Agent24ReplayScaleWaveDryrunVerificationIssue[];
  handoffScore: number;
  verificationScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayScaleWaveDryrunVerificationInput {
  matchId: string;
  replayScaleWaveDryrunHandoff: Agent24ReplayScaleWaveDryrunHandoffReport;
  replayScaleWaveProjectionVerification: Agent24ReplayScaleWaveProjectionVerificationReport;
  archiveScaleWavePostProjectionGate: Agent24ArchiveScaleWavePostProjectionGateReport;
}

export function buildAgent24ReplayScaleWaveDryrunVerificationReport(
  input: Agent24ReplayScaleWaveDryrunVerificationInput,
): Agent24ReplayScaleWaveDryrunVerificationReport {
  const waveRound = input.replayScaleWaveDryrunHandoff.waveRound;
  const dryrunBaselineSha = input.replayScaleWaveDryrunHandoff.dryrunBaselineSha;
  const issues: Agent24ReplayScaleWaveDryrunVerificationIssue[] = [];

  if (!input.replayScaleWaveDryrunHandoff.handoffComplete) {
    issues.push({
      segment: 'dryrun_handoff',
      detail: `Dry-run handoff incomplete (${input.replayScaleWaveDryrunHandoff.satisfiedCheckpointCount}/${input.replayScaleWaveDryrunHandoff.checkpointCount})`,
      fingerprint: o6kAgent24Fingerprint('rswdv_handoff', {
        satisfied: input.replayScaleWaveDryrunHandoff.satisfiedCheckpointCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.replayScaleWaveProjectionVerification.verified) {
    issues.push({
      segment: 'projection_verification',
      detail: `Projection verification open (${input.replayScaleWaveProjectionVerification.issueCount} issues)`,
      fingerprint: o6kAgent24Fingerprint('rswdv_proj', {
        issues: input.replayScaleWaveProjectionVerification.issueCount,
        wave: waveRound,
      }),
    });
  }
  if (!input.archiveScaleWavePostProjectionGate.gateOpen) {
    issues.push({
      segment: 'post_projection_gate',
      detail: `Post-projection gate blocked (${input.archiveScaleWavePostProjectionGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('rswdv_ppg', {
        blockers: input.archiveScaleWavePostProjectionGate.blockerCount,
        wave: waveRound,
      }),
    });
  }

  const uniqueIssues = [...new Map(issues.map(i => [i.fingerprint, i])).values()].sort((a, b) =>
    a.fingerprint.localeCompare(b.fingerprint),
  );

  let verificationScore = 100;
  verificationScore -= uniqueIssues.length * 11;
  verificationScore -= Math.max(0, 100 - input.replayScaleWaveDryrunHandoff.handoffScore) * 0.1;
  verificationScore = Math.max(0, Math.min(100, Math.round(verificationScore)));

  const verified =
    uniqueIssues.length === 0 &&
    input.replayScaleWaveDryrunHandoff.handoffComplete &&
    input.replayScaleWaveProjectionVerification.verified &&
    input.archiveScaleWavePostProjectionGate.gateOpen;

  return {
    reportId: o6kAgent24Fingerprint('replay_scale_wave_dryrun_verification', {
      matchId: input.matchId,
      wave: waveRound,
      baseline: dryrunBaselineSha,
    }),
    matchId: input.matchId,
    waveRound,
    dryrunBaselineSha,
    verified,
    issueCount: uniqueIssues.length,
    issues: uniqueIssues,
    handoffScore: input.replayScaleWaveDryrunHandoff.handoffScore,
    verificationScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_scale_wave_dryrun_verification_body', {
      waveRound,
      baseline: dryrunBaselineSha,
      issues: uniqueIssues.map(i => i.fingerprint),
      verified,
      verificationScore,
    }),
  };
}

export function runAgent24ReplayScaleWaveDryrunVerificationSelfTests(): Array<{ name: string; passed: boolean }> {
  const postProjectionGate = {
    reportId: 'ppg',
    matchId: 'self',
    waveRound: 41,
    gateOpen: true,
    blockerCount: 0,
    blockers: [],
    gateScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('aswpp_t22', { v: 1 }),
  };
  const projectionVerification = {
    reportId: 'pv',
    matchId: 'self',
    waveRound: 41,
    projectionBaselineSha: '634656bb',
    verified: true,
    issueCount: 0,
    issues: [],
    handoffScore: 100,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswpv_t22', { v: 1 }),
  };
  const dryrunHandoff = {
    reportId: 'dh',
    matchId: 'self',
    waveRound: 41,
    dryrunBaselineSha: '634656bb',
    handoffComplete: true,
    checkpointCount: 3,
    satisfiedCheckpointCount: 3,
    checkpoints: [],
    handoffScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('rswdh_t22', { v: 1 }),
  };

  const report = buildAgent24ReplayScaleWaveDryrunVerificationReport({
    matchId: 'self',
    replayScaleWaveDryrunHandoff: dryrunHandoff,
    replayScaleWaveProjectionVerification: projectionVerification,
    archiveScaleWavePostProjectionGate: postProjectionGate,
  });

  return [
    { name: 'verified_when_dryrun_stack_ready', passed: report.verified && report.issueCount === 0 },
    { name: 'wave_round_pinned', passed: report.waveRound === 41 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24ReplayScaleWaveDryrunVerificationReport({
          matchId: 'self',
          replayScaleWaveDryrunHandoff: dryrunHandoff,
          replayScaleWaveProjectionVerification: projectionVerification,
          archiveScaleWavePostProjectionGate: postProjectionGate,
        }).deterministicFingerprint,
    },
  ];
}
