import {
  completeAutomationIntent,
  createEmptyAutomationIntentQueue,
  dequeueHighestPriorityIntent,
  enqueueAutomationIntent,
  intentFromSelectedRule,
} from './automation-intent-queue.js';
import { dayBoundaryFromComputeState } from './day-boundary-compute.js';
import { buildSafeTimeAdvanceContextFromIdle } from './idle-automation-depth.js';
import {
  createDefaultO10TurnComputeState,
  type O10TurnComputeInput,
} from './turn-compute-engine.js';
import { simulateO10IdleAutomationTurn } from './idle-automation-simulation.js';
import type { O10SelfTestResult } from './types.js';

export interface O10ScenarioTurnSpec {
  label: string;
  patch: Partial<O10TurnComputeInput> & {
    advanceDayAfterTurn?: boolean;
    requireEndTurn?: boolean;
  };
}

export interface O10ScenarioRunResult {
  labels: string[];
  digests: string[];
  violations: string[];
  finalState: import('./turn-compute-engine.js').O10TurnComputeState;
}

export interface O10ScenarioOptions {
  hooks?: Parameters<typeof simulateO10IdleAutomationTurn>[2];
  queueIntents?: boolean;
}

/** Multi-turn scripted simulation with optional intent queue + day boundary checks. */
export function runO10IdleAutomationScenario(
  baseInput: O10TurnComputeInput,
  steps: O10ScenarioTurnSpec[],
  options: O10ScenarioOptions = {}
): O10ScenarioRunResult {
  const labels: string[] = [];
  const digests: string[] = [];
  const violations: string[] = [];
  let state = createDefaultO10TurnComputeState();
  let queue = createEmptyAutomationIntentQueue();

  for (const step of steps) {
    const merged: O10TurnComputeInput = {
      ...baseInput,
      ...step.patch,
      conditionalCtx: step.patch.conditionalCtx || baseInput.conditionalCtx,
      automationRules: step.patch.automationRules || baseInput.automationRules,
      gameState: step.patch.gameState || baseInput.gameState,
      settings: step.patch.settings || baseInput.settings,
    };
    const turn = simulateO10IdleAutomationTurn(merged, state, options.hooks);
    labels.push(step.label);
    digests.push(turn.digest);
    state = turn.state;

    if (options.queueIntents && turn.effects.selectedRule) {
      const enq = enqueueAutomationIntent(
        queue,
        intentFromSelectedRule(turn.effects.selectedRule, merged.turn, merged.day, step.label)
      );
      if (enq.accepted) queue = enq.queue;
      const { queue: q2, intent } = dequeueHighestPriorityIntent(queue, merged.turn);
      queue = q2;
      if (intent) {
        queue = completeAutomationIntent(queue, intent.id, 'completed');
      }
    }

    if (step.patch.advanceDayAfterTurn) {
      const safeCtx = buildSafeTimeAdvanceContextFromIdle({
        gameMode: merged.gameMode,
        matchEnded: merged.matchEnded ?? false,
        currentActorId: merged.actorId,
        humanAutomationEnabled: merged.humanAutomationEnabled,
        humanAutomationExecuting: merged.humanAutomationExecuting,
        pendingHumanAutomationApprovals: merged.pendingHumanAutomationApprovals,
        pendingGenericApprovals: merged.pendingGenericApprovals,
        copilotTakeoverActive: merged.copilotTakeoverActive,
        copilotStepInFlight: merged.copilotStepInFlight,
        playerInTransit: merged.playerInTransit,
        stewardPlanBlocked: Boolean(turn.effects.stewardStep?.blocked),
        stewardPaused: turn.effects.steward.playerOverride.paused,
        autoModeReplayRecording: merged.autoModeReplayRecording,
        dialogBlockingTime: merged.dialogBlockingTime,
      });
      const day = dayBoundaryFromComputeState(state, {
        currentDay: merged.day,
        currentTurn: merged.turn,
        safeTimeCtx: safeCtx,
        humanCommittedOnLastTurn: merged.humanCommittedThisTurn,
        msSinceLastHumanInput: merged.msSinceLastHumanInput,
        msSinceLastCommittedAction: merged.msSinceLastCommittedAction,
      });
      if (!day.allowed) violations.push(`${step.label}:day_blocked:${day.reason}`);
      else if (state.effects) state = { ...state, effects: { ...state.effects, steward: day.steward } };
    }

    if (turn.effects.endTurnAllowed === false && step.patch.requireEndTurn) {
      violations.push(`${step.label}:end_turn_blocked`);
    }
  }

  return { labels, digests, violations, finalState: state };
}

export function runO10Agent20ScenarioSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const base: O10TurnComputeInput = {
    turn: 0,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 5000,
    msSinceLastCommittedAction: 5000,
    playerInTransit: false,
    humanAutomationEnabled: true,
    humanAutomationExecuting: false,
    pendingHumanAutomationApprovals: 0,
    pendingGenericApprovals: 0,
    copilotTakeoverActive: false,
    copilotStepInFlight: false,
    autoModeReplayRecording: false,
    dialogBlockingTime: false,
    gameState: { turnCounter: 1 },
    settings: { playerControlMode: 'manual' },
    automationRules: [
      {
        id: 'auto1',
        name: 'Auto',
        enabled: true,
        authorityDisabled: false,
        priority: 2,
        activeFromDay: 0,
        activeUntilDay: 99,
        trigger: { type: 'turn_start' },
        conditions: null,
        limits: { maxRunsPerDay: 9, maxRunsTotal: null, cooldownTurns: 0 },
        safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 9 },
        stats: {
          totalRuns: 0,
          totalSuccesses: 0,
          totalSkipped: 0,
          totalFailed: 0,
          lastRunDay: null,
          lastRunTurn: null,
          runsToday: 0,
          runsTodayDay: -1,
          consecutiveNoChangeCount: 0,
          lastResultSummary: '',
        },
        actionType: 'wait',
        resolvedCost: 0,
        spendableCash: 200,
      },
    ],
    conditionalCtx: {
      actor: { money: 200, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 1,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      settingsFlags: {},
    },
  };

  const run = runO10IdleAutomationScenario(base, [
    { label: 't1', patch: { turn: 1, day: 1 } },
    { label: 't2', patch: { turn: 2, day: 1, humanAutomationExecuting: true, requireEndTurn: true } },
    { label: 't3', patch: { turn: 3, day: 1, humanAutomationExecuting: false, advanceDayAfterTurn: true } },
  ], { queueIntents: true });

  push('scenario_steps', 'runs all scenario steps', run.labels.length === 3);
  push('scenario_digests', 'unique digests per step', new Set(run.digests).size >= 2);
  push('scenario_violation', 'detects blocked end turn', run.violations.some(v => v.includes('end_turn_blocked')));
  push('scenario_queue', 'scenario completes without crash', run.finalState.lastTurnKey === 'player:3');

  return results;
}
