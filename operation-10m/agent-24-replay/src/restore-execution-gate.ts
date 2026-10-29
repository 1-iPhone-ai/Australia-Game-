import { o6kAgent24Fingerprint } from './fingerprint.ts';
import type { Agent24ReplayPlaybackIntegrityReport } from './replay-playback-integrity.ts';
import type { Agent24ReplayRestoreGateReport } from './replay-restore-gate.ts';
import type { Agent24ReplayRestorePlan } from './replay-restore-plan.ts';

export type Agent24RestoreExecutionBlockerKind =
  | 'restore_plan_blocked'
  | 'restore_gate_closed'
  | 'required_steps_incomplete'
  | 'playback_not_ready';

export interface Agent24RestoreExecutionBlocker {
  kind: Agent24RestoreExecutionBlockerKind;
  detail: string;
  fingerprint: string;
}

export interface Agent24RestoreExecutionGateReport {
  reportId: string;
  matchId: string;
  executionAllowed: boolean;
  anchorTurn: number | null;
  requiredStepCount: number;
  satisfiedRequiredSteps: number;
  blockerCount: number;
  blockers: Agent24RestoreExecutionBlocker[];
  executionScore: number;
  deterministicFingerprint: string;
}

export interface Agent24RestoreExecutionGateInput {
  matchId: string;
  replayRestorePlan: Agent24ReplayRestorePlan;
  replayRestoreGate: Agent24ReplayRestoreGateReport;
  playbackIntegrity: Agent24ReplayPlaybackIntegrityReport;
  minIntegrityScore?: number;
}

export function buildAgent24RestoreExecutionGateReport(
  input: Agent24RestoreExecutionGateInput,
): Agent24RestoreExecutionGateReport {
  const minIntegrity = input.minIntegrityScore ?? 70;
  const blockers: Agent24RestoreExecutionBlocker[] = [];

  if (!input.replayRestorePlan.restoreAllowed) {
    blockers.push({
      kind: 'restore_plan_blocked',
      detail: 'Replay restore plan is not restore-allowed',
      fingerprint: o6kAgent24Fingerprint('exec_plan', { allowed: false }),
    });
  }
  if (!input.replayRestoreGate.restoreAllowed) {
    blockers.push({
      kind: 'restore_gate_closed',
      detail: `Restore gate closed (${input.replayRestoreGate.blockerCount} blockers)`,
      fingerprint: o6kAgent24Fingerprint('exec_gate', { blockers: input.replayRestoreGate.blockerCount }),
    });
  }

  const requiredSteps = input.replayRestorePlan.steps.filter(s => s.required);
  const satisfiedRequiredSteps = requiredSteps.filter(
    s => s.kind !== 'anchor_checkpoint' || input.replayRestorePlan.anchorTurn !== null,
  ).length;

  if (requiredSteps.length > 0 && satisfiedRequiredSteps < requiredSteps.length) {
    blockers.push({
      kind: 'required_steps_incomplete',
      detail: `Required restore steps ${satisfiedRequiredSteps}/${requiredSteps.length}`,
      fingerprint: o6kAgent24Fingerprint('exec_steps', {
        satisfied: satisfiedRequiredSteps,
        required: requiredSteps.length,
      }),
    });
  }

  if (!input.playbackIntegrity.monotonicTurns || input.playbackIntegrity.integrityScore < minIntegrity) {
    blockers.push({
      kind: 'playback_not_ready',
      detail: `Playback integrity ${input.playbackIntegrity.integrityScore} monotonic=${input.playbackIntegrity.monotonicTurns}`,
      fingerprint: o6kAgent24Fingerprint('exec_playback', {
        score: input.playbackIntegrity.integrityScore,
        monotonic: input.playbackIntegrity.monotonicTurns,
      }),
    });
  }

  let executionScore = 100;
  executionScore -= blockers.length * 18;
  if (input.replayRestorePlan.restorePlanScore < 80) executionScore -= 10;
  executionScore = Math.max(0, Math.min(100, executionScore));

  const executionAllowed =
    blockers.length === 0 &&
    input.replayRestorePlan.restoreAllowed &&
    input.replayRestoreGate.restoreAllowed;

  return {
    reportId: o6kAgent24Fingerprint('restore_execution_gate', { matchId: input.matchId }),
    matchId: input.matchId,
    executionAllowed,
    anchorTurn: input.replayRestorePlan.anchorTurn,
    requiredStepCount: requiredSteps.length,
    satisfiedRequiredSteps,
    blockerCount: blockers.length,
    blockers,
    executionScore,
    deterministicFingerprint: o6kAgent24Fingerprint('restore_execution_gate_body', {
      blockers: blockers.map(b => b.fingerprint),
      executionAllowed,
      anchorTurn: input.replayRestorePlan.anchorTurn,
      executionScore,
    }),
  };
}

export function runAgent24RestoreExecutionGateSelfTests(): Array<{ name: string; passed: boolean }> {
  const planOk = {
    planId: 'p',
    matchId: 'self',
    restoreAllowed: true,
    anchorTurn: 12,
    stepCount: 4,
    requiredStepCount: 3,
    steps: [
      { stepIndex: 0, kind: 'verify_seal' as const, targetTurn: null, detail: 'ok', required: true, fingerprint: 'a' },
      { stepIndex: 1, kind: 'anchor_checkpoint' as const, targetTurn: 12, detail: 'ok', required: true, fingerprint: 'b' },
    ],
    restorePlanScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rp_exec', { v: 1 }),
  };
  const gateOk = {
    reportId: 'g',
    matchId: 'self',
    restoreAllowed: true,
    recommendedRestoreTurn: 12,
    blockerCount: 0,
    blockers: [],
    restoreScore: 95,
    deterministicFingerprint: o6kAgent24Fingerprint('rg_exec', { v: 1 }),
  };
  const playbackOk = {
    reportId: 'pi',
    matchId: 'self',
    monotonicTurns: true,
    integrityScore: 95,
    issueCount: 0,
    eventCount: 2,
    checkpointEventCount: 2,
    issues: [],
    deterministicFingerprint: o6kAgent24Fingerprint('pb_exec', { v: 1 }),
  };

  const report = buildAgent24RestoreExecutionGateReport({
    matchId: 'self',
    replayRestorePlan: planOk,
    replayRestoreGate: gateOk,
    playbackIntegrity: playbackOk,
  });

  return [
    { name: 'execution_allowed_when_aligned', passed: report.executionAllowed && report.blockerCount === 0 },
    {
      name: 'deterministic_fingerprint',
      passed:
        report.deterministicFingerprint ===
        buildAgent24RestoreExecutionGateReport({
          matchId: 'self',
          replayRestorePlan: planOk,
          replayRestoreGate: gateOk,
          playbackIntegrity: playbackOk,
        }).deterministicFingerprint,
    },
  ];
}
