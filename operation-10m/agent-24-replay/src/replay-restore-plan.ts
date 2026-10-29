import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24CheckpointCoverageReport } from './checkpoint-coverage.ts';
import type { Agent24ReplayRestoreGateReport } from './replay-restore-gate.ts';
import type { Agent24RewindSafetyReport } from './rewind-safety.ts';
import type { Agent24SealVerificationReport } from './seal-verification.ts';

export type Agent24ReplayRestoreStepKind =
  | 'verify_seal'
  | 'anchor_checkpoint'
  | 'rewind_to_target'
  | 'replay_monotonic_check';

export interface Agent24ReplayRestoreStep {
  stepIndex: number;
  kind: Agent24ReplayRestoreStepKind;
  targetTurn: number | null;
  detail: string;
  required: boolean;
  fingerprint: string;
}

export interface Agent24ReplayRestorePlan {
  planId: string;
  matchId: string;
  restoreAllowed: boolean;
  anchorTurn: number | null;
  stepCount: number;
  requiredStepCount: number;
  steps: Agent24ReplayRestoreStep[];
  restorePlanScore: number;
  deterministicFingerprint: string;
}

export interface Agent24ReplayRestorePlanInput {
  matchId: string;
  replayRestoreGate: Agent24ReplayRestoreGateReport;
  sealVerification: Agent24SealVerificationReport;
  rewindSafety: Agent24RewindSafetyReport;
  checkpointCoverage: Agent24CheckpointCoverageReport;
}

export function buildAgent24ReplayRestorePlan(input: Agent24ReplayRestorePlanInput): Agent24ReplayRestorePlan {
  const steps: Agent24ReplayRestoreStep[] = [];
  let stepIndex = 0;

  const pushStep = (
    kind: Agent24ReplayRestoreStepKind,
    targetTurn: number | null,
    detail: string,
    required: boolean,
  ) => {
    steps.push({
      stepIndex,
      kind,
      targetTurn,
      detail,
      required,
      fingerprint: o6kAgent24Fingerprint('restore_step', { idx: stepIndex, kind, turn: targetTurn, detail }),
    });
    stepIndex += 1;
  };

  pushStep(
    'verify_seal',
    null,
    input.sealVerification.verified ? 'Seal verification passed' : 'Seal verification required before restore',
    true,
  );

  const anchorTurn =
    input.replayRestoreGate.recommendedRestoreTurn ??
    input.rewindSafety.recommendedTurn ??
    (input.checkpointCoverage.checkpointTurns.length > 0
      ? input.checkpointCoverage.checkpointTurns[input.checkpointCoverage.checkpointTurns.length - 1]
      : null);

  if (anchorTurn !== null) {
    pushStep('anchor_checkpoint', anchorTurn, `Anchor restore at checkpoint turn ${anchorTurn}`, true);
    pushStep('rewind_to_target', anchorTurn, `Rewind playback head to turn ${anchorTurn}`, true);
  } else {
    pushStep('anchor_checkpoint', null, 'No checkpoint anchor available', true);
  }

  pushStep(
    'replay_monotonic_check',
    anchorTurn,
    'Validate monotonic replay event ordering after restore',
    input.replayRestoreGate.restoreAllowed,
  );

  const requiredStepCount = steps.filter(s => s.required).length;
  let restorePlanScore = 100;
  if (!input.sealVerification.verified) restorePlanScore -= 35;
  if (!input.replayRestoreGate.restoreAllowed) restorePlanScore -= 30;
  if (anchorTurn === null) restorePlanScore -= 25;
  if (input.rewindSafety.safeTargetCount === 0) restorePlanScore -= 10;
  restorePlanScore = Math.max(0, Math.min(100, restorePlanScore));

  const restoreAllowed =
    input.replayRestoreGate.restoreAllowed && input.sealVerification.verified && anchorTurn !== null;

  return {
    planId: o6kAgent24Fingerprint('replay_restore_plan', { matchId: input.matchId, anchor: anchorTurn }),
    matchId: input.matchId,
    restoreAllowed,
    anchorTurn,
    stepCount: steps.length,
    requiredStepCount,
    steps,
    restorePlanScore,
    deterministicFingerprint: o6kAgent24Fingerprint('replay_restore_plan_body', {
      steps: steps.map(s => s.fingerprint),
      restoreAllowed,
      anchorTurn,
      restorePlanScore,
    }),
  };
}

export function runAgent24ReplayRestorePlanSelfTests(): Array<{ name: string; passed: boolean }> {
  const gateAllowed = {
    reportId: 'g',
    matchId: 'self',
    restoreAllowed: true,
    recommendedRestoreTurn: 12,
    blockerCount: 0,
    blockers: [],
    restoreScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rg_self', { v: 1 }),
  };
  const gateBlocked = { ...gateAllowed, restoreAllowed: false, recommendedRestoreTurn: null, restoreScore: 40 };
  const sealOk = {
    reportId: 'v',
    matchId: 'self',
    verified: true,
    issueCount: 0,
    issues: [],
    linkMatchCount: 5,
    verificationScore: 100,
    deterministicFingerprint: o6kAgent24Fingerprint('sv_self', { v: 1 }),
  };
  const rewind = {
    reportId: 'w',
    matchId: 'self',
    currentTurn: 16,
    targets: [],
    safeTargetCount: 2,
    recommendedTurn: 12,
    deterministicFingerprint: o6kAgent24Fingerprint('rw_self', { v: 1 }),
  };
  const coverage = {
    reportId: 'c',
    matchId: 'self',
    checkpointTurns: [8, 12],
    checkpointCount: 2,
    maxGapTurns: 4,
    gaps: [],
    endgameCoverageOk: true,
    coverageScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('cc_self', { v: 1 }),
  };

  const plan = buildAgent24ReplayRestorePlan({
    matchId: 'self',
    replayRestoreGate: gateAllowed,
    sealVerification: sealOk,
    rewindSafety: rewind,
    checkpointCoverage: coverage,
  });
  const blocked = buildAgent24ReplayRestorePlan({
    matchId: 'self',
    replayRestoreGate: gateBlocked,
    sealVerification: sealOk,
    rewindSafety: rewind,
    checkpointCoverage: coverage,
  });

  return [
    { name: 'restore_plan_steps_when_allowed', passed: plan.restoreAllowed && plan.stepCount >= 4 },
    { name: 'restore_plan_blocked_when_gate_closed', passed: !blocked.restoreAllowed },
    {
      name: 'deterministic_fingerprint',
      passed:
        plan.deterministicFingerprint ===
        buildAgent24ReplayRestorePlan({
          matchId: 'self',
          replayRestoreGate: gateAllowed,
          sealVerification: sealOk,
          rewindSafety: rewind,
          checkpointCoverage: coverage,
        }).deterministicFingerprint,
    },
  ];
}
