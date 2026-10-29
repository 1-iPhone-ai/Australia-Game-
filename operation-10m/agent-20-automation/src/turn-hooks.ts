import type { ConditionalActionContext } from './conditional-actions.js';
import {
  classifyIdleAutomationBand,
  commitNationalStewardSpend,
  selectHumanAutomationCandidate,
  summarizeIdleAutomationSafety,
  buildSafeTimeAdvanceContextFromIdle,
} from './idle-automation-depth.js';
import {
  createDefaultAutonomousIdleNationalPersisted,
  planNationalStewardTurnStep,
  tickIdleNationalStewardTelemetry,
} from './national-steward.js';
import type { O10TurnComputeEffects, O10TurnComputeInput } from './turn-compute-engine.js';
import type { NationalStewardPersisted, O10SelfTestResult } from './types.js';

export type O10TurnHookPhase =
  | 'telemetry'
  | 'steward_plan'
  | 'automation_select'
  | 'safe_time'
  | 'steward_commit';

export interface O10TurnHookContext {
  input: O10TurnComputeInput;
  steward: NationalStewardPersisted;
  effects: Partial<O10TurnComputeEffects>;
  trace: string[];
  vetoEndTurn: boolean;
  vetoAdvanceDay: boolean;
}

export type O10TurnHookFn = (ctx: O10TurnHookContext) => void;

export interface O10TurnHookRegistration {
  id: string;
  phase: O10TurnHookPhase;
  order: number;
  run: O10TurnHookFn;
}

export const O10_TURN_HOOK_TELEMETRY: O10TurnHookRegistration = {
  id: 'idle_telemetry',
  phase: 'telemetry',
  order: 10,
  run: ctx => {
    ctx.steward = tickIdleNationalStewardTelemetry(ctx.steward, {
      msSinceLastHumanInput: ctx.input.msSinceLastHumanInput,
      msSinceLastCommittedAction: ctx.input.msSinceLastCommittedAction,
      humanCommittedThisTurn: ctx.input.humanCommittedThisTurn,
      turn: ctx.input.turn,
    });
    ctx.effects.idleBand = classifyIdleAutomationBand({
      idleMs: ctx.input.msSinceLastHumanInput,
      consecutiveIdleTurns: ctx.steward.idleTelemetry.consecutiveIdleTurns,
      stewardEnabled: ctx.steward.enabled,
      playerPaused: ctx.steward.playerOverride.paused,
    });
    ctx.trace.push(`telemetry:band=${ctx.effects.idleBand}`);
  },
};

export const O10_TURN_HOOK_STEWARD_PLAN: O10TurnHookRegistration = {
  id: 'steward_plan',
  phase: 'steward_plan',
  order: 20,
  run: ctx => {
    const forceTick = ctx.effects.idleBand === 'steward_tick';
    const planned = planNationalStewardTurnStep(ctx.input.gameState, ctx.input.settings, ctx.steward, {
      forceNationalTick: forceTick,
    });
    ctx.steward = planned.persisted;
    ctx.effects.stewardStep = planned.step;
    ctx.trace.push(`steward:step=${planned.step.stepId}:blocked=${planned.step.blocked}`);
  },
};

export const O10_TURN_HOOK_AUTOMATION_SELECT: O10TurnHookRegistration = {
  id: 'automation_select',
  phase: 'automation_select',
  order: 30,
  run: ctx => {
    if (!ctx.input.humanAutomationEnabled || ctx.input.humanAutomationExecuting) {
      ctx.trace.push('automation:skipped');
      return;
    }
    const sel = selectHumanAutomationCandidate(ctx.input.automationRules, ctx.input.conditionalCtx);
    ctx.effects.selectedRule = sel.selected;
    ctx.trace.push(sel.selected ? `automation:selected=${sel.selected.id}` : 'automation:none');
  },
};

export const O10_TURN_HOOK_SAFE_TIME: O10TurnHookRegistration = {
  id: 'safe_time',
  phase: 'safe_time',
  order: 40,
  run: ctx => {
    const step = ctx.effects.stewardStep;
    const safeCtx = buildSafeTimeAdvanceContextFromIdle({
      gameMode: ctx.input.gameMode,
      matchEnded: ctx.input.matchEnded ?? false,
      currentActorId: ctx.input.actorId,
      humanAutomationEnabled: ctx.input.humanAutomationEnabled,
      humanAutomationExecuting: ctx.input.humanAutomationExecuting,
      pendingHumanAutomationApprovals: ctx.input.pendingHumanAutomationApprovals,
      pendingGenericApprovals: ctx.input.pendingGenericApprovals,
      copilotTakeoverActive: ctx.input.copilotTakeoverActive,
      copilotStepInFlight: ctx.input.copilotStepInFlight,
      playerInTransit: ctx.input.playerInTransit,
      stewardPlanBlocked: Boolean(step?.blocked),
      stewardPaused: ctx.steward.playerOverride.paused,
      autoModeReplayRecording: ctx.input.autoModeReplayRecording,
      dialogBlockingTime: ctx.input.dialogBlockingTime,
    });
    const summary = summarizeIdleAutomationSafety(safeCtx);
    ctx.effects.endTurnAllowed = summary.endTurnOk;
    ctx.effects.advanceDayAllowed = summary.advanceDayOk;
    ctx.effects.timeBlockers = summary.blockers;
    ctx.vetoEndTurn = !summary.endTurnOk;
    ctx.vetoAdvanceDay = !summary.advanceDayOk;
    ctx.trace.push(`safe_time:end=${summary.endTurnOk}:day=${summary.advanceDayOk}`);
  },
};

export const O10_TURN_HOOK_STEWARD_COMMIT: O10TurnHookRegistration = {
  id: 'steward_commit',
  phase: 'steward_commit',
  order: 50,
  run: ctx => {
    const step = ctx.effects.stewardStep;
    if (!step || step.blocked || step.intentKind === 'idle') {
      ctx.trace.push('steward_commit:skip');
      return;
    }
    const spend = Math.max(0, -step.proposedCashDelta);
    if (spend <= 0) {
      ctx.trace.push('steward_commit:no_spend');
      return;
    }
    ctx.steward = commitNationalStewardSpend(ctx.steward, ctx.input.turn, spend);
    ctx.effects.committedStewardSpend = (ctx.effects.committedStewardSpend || 0) + spend;
    ctx.trace.push(`steward_commit:spent=${spend}`);
  },
};

export const O10_DEFAULT_TURN_HOOKS: O10TurnHookRegistration[] = [
  O10_TURN_HOOK_TELEMETRY,
  O10_TURN_HOOK_STEWARD_PLAN,
  O10_TURN_HOOK_AUTOMATION_SELECT,
  O10_TURN_HOOK_SAFE_TIME,
  O10_TURN_HOOK_STEWARD_COMMIT,
];

export function executeO10TurnHooks(
  hooks: O10TurnHookRegistration[],
  input: O10TurnComputeInput,
  stewardIn?: NationalStewardPersisted
): O10TurnComputeEffects {
  const ctx: O10TurnHookContext = {
    input,
    steward: stewardIn || createDefaultAutonomousIdleNationalPersisted(),
    effects: {
      stewardStep: null,
      selectedRule: null,
      idleBand: 'active',
      endTurnAllowed: true,
      advanceDayAllowed: true,
      timeBlockers: [],
      committedStewardSpend: 0,
      hookTrace: [],
    },
    trace: [],
    vetoEndTurn: false,
    vetoAdvanceDay: false,
  };

  const sorted = [...hooks].sort((a, b) => a.order - b.order);
  for (const hook of sorted) {
    hook.run(ctx);
  }

  return {
    steward: ctx.steward,
    stewardStep: ctx.effects.stewardStep ?? null,
    selectedRule: ctx.effects.selectedRule ?? null,
    idleBand: ctx.effects.idleBand ?? 'active',
    endTurnAllowed: ctx.effects.endTurnAllowed ?? true,
    advanceDayAllowed: ctx.effects.advanceDayAllowed ?? true,
    timeBlockers: ctx.effects.timeBlockers ?? [],
    committedStewardSpend: ctx.effects.committedStewardSpend ?? 0,
    hookTrace: ctx.trace,
  };
}

export function runO10Agent20TurnHooksSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const conditionalCtx: ConditionalActionContext = {
    actor: { money: 800, inventory: [], currentRegion: 'NSW', actionPoints: 2 },
    currentDay: 1,
    currentTurn: 1,
    isNewDayForActor: false,
    extendedTriggersEnabled: true,
    consecutiveIdleTurns: 0,
    settingsFlags: {},
  };

  const stewardSeed = createDefaultAutonomousIdleNationalPersisted();
  stewardSeed.idleTelemetry.consecutiveIdleTurns = 3;

  const input: O10TurnComputeInput = {
    turn: 1,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    matchEnded: false,
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 200_000,
    msSinceLastCommittedAction: 200_000,
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
        id: 'r1',
        name: 'Turn start',
        enabled: true,
        authorityDisabled: false,
        priority: 1,
        activeFromDay: 0,
        activeUntilDay: 999,
        trigger: { type: 'turn_start' },
        conditions: null,
        limits: { maxRunsPerDay: 5, maxRunsTotal: null, cooldownTurns: 0 },
        safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
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
        spendableCash: 800,
      },
    ],
    conditionalCtx,
  };

  const fx = executeO10TurnHooks(O10_DEFAULT_TURN_HOOKS, input, stewardSeed);
  push('hooks_run', 'default hook chain produces trace', fx.hookTrace.length >= 4);
  push('hooks_steward_tick', 'deep idle plans steward tick band', fx.idleBand === 'steward_tick');
  push('hooks_automation', 'selects turn_start rule', fx.selectedRule?.id === 'r1');
  push('hooks_order', 'hook registration sorted', O10_DEFAULT_TURN_HOOKS[0].order < O10_DEFAULT_TURN_HOOKS[1].order);

  const blocked = executeO10TurnHooks(O10_DEFAULT_TURN_HOOKS, {
    ...input,
    humanAutomationExecuting: true,
  });
  push('hooks_block_time', 'executing automation blocks end turn', blocked.endTurnAllowed === false);

  return results;
}
