import { canAdvanceDay } from './safe-time-advance.js';
import type { SafeTimeAdvanceContext } from './types.js';
import { createDefaultAutonomousIdleNationalPersisted, tickIdleNationalStewardTelemetry } from './national-steward.js';
import type { NationalStewardPersisted, O10DayBoundaryResult, O10SelfTestResult } from './types.js';
import type { O10TurnComputeState } from './turn-compute-engine.js';

export interface O10DayBoundaryInput {
  currentDay: number;
  currentTurn: number;
  safeTimeCtx: SafeTimeAdvanceContext;
  steward: NationalStewardPersisted;
  humanCommittedOnLastTurn: boolean;
  msSinceLastHumanInput: number;
  msSinceLastCommittedAction: number;
}

export function computeO10DayBoundary(input: O10DayBoundaryInput): O10DayBoundaryResult {
  const verdict = canAdvanceDay(input.safeTimeCtx);
  if (!verdict.allowed) {
    return {
      allowed: false,
      reason: verdict.reason,
      nextDay: input.currentDay,
      steward: input.steward,
      turnSpendReset: false,
      cycleRolled: false,
    };
  }

  let steward = tickIdleNationalStewardTelemetry(input.steward, {
    msSinceLastHumanInput: input.msSinceLastHumanInput,
    msSinceLastCommittedAction: input.msSinceLastCommittedAction,
    humanCommittedThisTurn: input.humanCommittedOnLastTurn,
    turn: input.currentTurn,
  });

  const cycleRolled =
    input.currentTurn > steward.cycleStartTurn + steward.spendingCap.cycleTurns;
  if (cycleRolled) {
    steward = {
      ...steward,
      cycleSpendAccumulator: 0,
      cycleStartTurn: input.currentTurn,
    };
  }

  steward = {
    ...steward,
    turnSpendAccumulator: 0,
    idleTelemetry: {
      ...steward.idleTelemetry,
      consecutiveIdleTurns: input.humanCommittedOnLastTurn ? 0 : steward.idleTelemetry.consecutiveIdleTurns,
    },
  };

  return {
    allowed: true,
    reason: '',
    nextDay: input.currentDay + 1,
    steward,
    turnSpendReset: true,
    cycleRolled,
  };
}

export function dayBoundaryFromComputeState(
  state: O10TurnComputeState,
  input: Omit<O10DayBoundaryInput, 'steward' | 'safeTimeCtx'> & { safeTimeCtx: SafeTimeAdvanceContext }
): O10DayBoundaryResult {
  const steward = state.effects?.steward || createDefaultAutonomousIdleNationalPersisted();
  return computeO10DayBoundary({ ...input, steward });
}

export function runO10Agent20DayBoundarySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const baseCtx: SafeTimeAdvanceContext = {
    gameMode: 'game',
    matchEnded: false,
    currentActorId: 'player',
    humanAutomationEnabled: true,
    humanAutomationExecuting: false,
    pendingHumanAutomationApprovals: 0,
    pendingGenericApprovals: 0,
    copilotTakeoverActive: false,
    copilotStepInFlight: false,
    playerInTransit: false,
    nationalStewardPlanBlocked: false,
    nationalStewardPaused: false,
    autoModeReplayRecording: false,
    dialogBlockingTime: false,
  };

  const ok = computeO10DayBoundary({
    currentDay: 2,
    currentTurn: 8,
    safeTimeCtx: baseCtx,
    steward: { ...createDefaultAutonomousIdleNationalPersisted(), turnSpendAccumulator: 500 },
    humanCommittedOnLastTurn: true,
    msSinceLastHumanInput: 1000,
    msSinceLastCommittedAction: 1000,
  });
  push('day_ok', 'allows day when safe', ok.allowed && ok.nextDay === 3 && ok.turnSpendReset);
  push('day_reset_spend', 'resets turn spend accumulator', ok.steward.turnSpendAccumulator === 0);

  const blocked = computeO10DayBoundary({
    currentDay: 2,
    currentTurn: 8,
    safeTimeCtx: { ...baseCtx, pendingGenericApprovals: 2 },
    steward: createDefaultAutonomousIdleNationalPersisted(),
    humanCommittedOnLastTurn: false,
    msSinceLastHumanInput: 0,
    msSinceLastCommittedAction: 0,
  });
  push('day_block', 'blocks day on approvals', blocked.allowed === false);

  return results;
}
