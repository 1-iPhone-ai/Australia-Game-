import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayRestorePlan } from './replay-restore-plan.ts';
import type { Agent24RestoreExecutionGateReport } from './restore-execution-gate.ts';

export interface Agent24RestoreCommitStepRecord {
  stepIndex: number;
  kind: string;
  targetTurn: number | null;
  committed: boolean;
  fingerprint: string;
}

export interface Agent24RestoreCommitRecord {
  recordId: string;
  matchId: string;
  currentTurn: number;
  commitAllowed: boolean;
  anchorTurn: number | null;
  committedStepCount: number;
  steps: Agent24RestoreCommitStepRecord[];
  commitScore: number;
  deterministicFingerprint: string;
}

export interface Agent24RestoreCommitRecordInput {
  matchId: string;
  currentTurn: number;
  replayRestorePlan: Agent24ReplayRestorePlan;
  restoreExecutionGate: Agent24RestoreExecutionGateReport;
}

export function buildAgent24RestoreCommitRecord(input: Agent24RestoreCommitRecordInput): Agent24RestoreCommitRecord {
  const commitAllowed = input.restoreExecutionGate.executionAllowed && input.replayRestorePlan.restoreAllowed;

  const steps: Agent24RestoreCommitStepRecord[] = input.replayRestorePlan.steps.map(step => {
    const committed =
      commitAllowed &&
      (step.kind === 'verify_seal' ||
        (step.kind === 'anchor_checkpoint' && input.replayRestorePlan.anchorTurn !== null) ||
        (step.kind === 'rewind_to_target' && step.targetTurn === input.replayRestorePlan.anchorTurn) ||
        (step.kind === 'replay_monotonic_check' && input.restoreExecutionGate.executionScore >= 70));
    return {
      stepIndex: step.stepIndex,
      kind: step.kind,
      targetTurn: step.targetTurn,
      committed,
      fingerprint: o6kAgent24Fingerprint('restore_commit_step', {
        idx: step.stepIndex,
        kind: step.kind,
        committed,
      }),
    };
  });

  const committedStepCount = steps.filter(s => s.committed).length;

  let commitScore = 100;
  if (!commitAllowed) commitScore -= 40;
  if (committedStepCount < input.replayRestorePlan.requiredStepCount) {
    commitScore -= (input.replayRestorePlan.requiredStepCount - committedStepCount) * 8;
  }
  commitScore = Math.max(0, Math.min(100, commitScore));

  return {
    recordId: o6kAgent24Fingerprint('restore_commit_record', {
      matchId: input.matchId,
      turn: input.currentTurn,
    }),
    matchId: input.matchId,
    currentTurn: input.currentTurn,
    commitAllowed,
    anchorTurn: input.replayRestorePlan.anchorTurn,
    committedStepCount,
    steps,
    commitScore,
    deterministicFingerprint: o6kAgent24Fingerprint('restore_commit_record_body', {
      steps: steps.map(s => s.fingerprint),
      commitAllowed,
      anchorTurn: input.replayRestorePlan.anchorTurn,
      commitScore,
    }),
  };
}

export function runAgent24RestoreCommitRecordSelfTests(): Array<{ name: string; passed: boolean }> {
  const plan = {
    planId: 'p',
    matchId: 'self',
    restoreAllowed: true,
    anchorTurn: 10,
    stepCount: 3,
    requiredStepCount: 2,
    steps: [
      {
        stepIndex: 0,
        kind: 'verify_seal',
        targetTurn: null,
        detail: 'ok',
        required: true,
        fingerprint: 'a',
      },
      {
        stepIndex: 1,
        kind: 'rewind_to_target',
        targetTurn: 10,
        detail: 'ok',
        required: true,
        fingerprint: 'b',
      },
    ],
    restorePlanScore: 90,
    deterministicFingerprint: o6kAgent24Fingerprint('rp_commit', { v: 1 }),
  };
  const gate = {
    reportId: 'g',
    matchId: 'self',
    executionAllowed: true,
    anchorTurn: 10,
    requiredStepCount: 2,
    satisfiedRequiredSteps: 2,
    blockerCount: 0,
    blockers: [],
    executionScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('eg_commit', { v: 1 }),
  };

  const record = buildAgent24RestoreCommitRecord({
    matchId: 'self',
    currentTurn: 14,
    replayRestorePlan: plan,
    restoreExecutionGate: gate,
  });

  return [
    { name: 'commit_allowed_records_steps', passed: record.commitAllowed && record.committedStepCount >= 2 },
    {
      name: 'deterministic_fingerprint',
      passed:
        record.deterministicFingerprint ===
        buildAgent24RestoreCommitRecord({
          matchId: 'self',
          currentTurn: 14,
          replayRestorePlan: plan,
          restoreExecutionGate: gate,
        }).deterministicFingerprint,
    },
  ];
}
