import {
  evaluateConditionalAutomationAction,
  type ConditionalActionContext,
} from './conditional-actions.js';
import {
  checkHumanAutomationSafetyLimits,
  evaluateHumanAutomationExecutionEligibility,
} from './limits.js';
import { resolveO10AutomationPath } from './national-steward.js';
import { canAdvanceDay, canEndTurn } from './safe-time-advance.js';
import type {
  AutomationRuleConflict,
  HumanAutomationSelectionResult,
  IdleAutomationBand,
  NationalStewardPersisted,
  O10AutomationPathId,
  O10SelfTestResult,
  PortableHumanAutomationRule,
  SafeTimeAdvanceContext,
  AutoModePermission,
  PlayerControlMode,
} from './types.js';

export const O10_IDLE_MS_SOFT_NUDGE = 45_000;
export const O10_IDLE_MS_WATCH = 120_000;
export const O10_IDLE_MS_DEEP_TICK = 180_000;
export const O10_IDLE_TURNS_DEEP_TICK = 3;

export function countInventoryResource(inventory: string[], resource: string): number {
  return inventory.filter(r => r === resource).length;
}

export function classifyIdleAutomationBand(input: {
  idleMs: number;
  consecutiveIdleTurns: number;
  stewardEnabled: boolean;
  playerPaused: boolean;
}): IdleAutomationBand {
  if (input.playerPaused || !input.stewardEnabled) return 'active';
  if (input.idleMs >= O10_IDLE_MS_DEEP_TICK && input.consecutiveIdleTurns >= O10_IDLE_TURNS_DEEP_TICK) {
    return 'steward_tick';
  }
  if (input.idleMs >= O10_IDLE_MS_WATCH || input.consecutiveIdleTurns >= 5) return 'deep_idle';
  if (input.idleMs >= O10_IDLE_MS_SOFT_NUDGE || input.consecutiveIdleTurns >= 2) return 'idle';
  if (input.consecutiveIdleTurns >= 1) return 'drifting';
  return 'active';
}

export function resolveIdleAwareAutomationPath(input: {
  playerControlMode?: PlayerControlMode;
  autoModeEnabled?: boolean;
  autoModePermission?: AutoModePermission;
  takeoverActive?: boolean;
  idleMs?: number;
  consecutiveIdleTurns?: number;
  stewardEnabled?: boolean;
  coPilotMode?: string;
}): O10AutomationPathId {
  const band = classifyIdleAutomationBand({
    idleMs: input.idleMs || 0,
    consecutiveIdleTurns: input.consecutiveIdleTurns || 0,
    stewardEnabled: Boolean(input.stewardEnabled),
    playerPaused: false,
  });
  if (
    band === 'steward_tick' &&
    (input.playerControlMode || 'manual') === 'manual' &&
    !input.takeoverActive
  ) {
    return 'v94_idle_steward_national_tick';
  }
  return resolveO10AutomationPath(input);
}

export function detectPortableAutomationConflicts(
  rules: PortableHumanAutomationRule[],
  conflictWarningsEnabled: boolean
): AutomationRuleConflict[] {
  if (!conflictWarningsEnabled) return [];
  const active = rules.filter(r => r.enabled && !r.authorityDisabled);
  const out: AutomationRuleConflict[] = [];
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];
      if (a.priority === b.priority) {
        out.push({
          ruleId: a.id,
          otherRuleId: b.id,
          kind: 'priority_collision',
          message: `Priority collision with "${b.name}" at level ${a.priority}.`,
        });
      }
      if (a.trigger.type === b.trigger.type) {
        out.push({
          ruleId: a.id,
          otherRuleId: b.id,
          kind: 'trigger_overlap',
          message: `Trigger overlap with "${b.name}" (${a.trigger.type}).`,
        });
      }
    }
  }
  return out;
}

export function selectHumanAutomationCandidate(
  rules: PortableHumanAutomationRule[],
  ctx: ConditionalActionContext,
  options?: { skipRuleIds?: string[]; confirmBeforeRunning?: boolean }
): HumanAutomationSelectionResult {
  const skipped: HumanAutomationSelectionResult['skipped'] = [];
  const skip = new Set(options?.skipRuleIds || []);
  const sorted = [...rules]
    .filter(r => r.enabled && !r.authorityDisabled && !skip.has(r.id))
    .sort((a, b) => b.priority - a.priority);

  for (const rule of sorted) {
    const eligibility = evaluateHumanAutomationExecutionEligibility(
      rule.enabled,
      rule.authorityDisabled,
      rule.activeFromDay,
      rule.activeUntilDay,
      rule.limits,
      rule.safety,
      rule.stats,
      ctx.currentDay,
      ctx.currentTurn
    );
    if (!eligibility.eligible) {
      skipped.push({ ruleId: rule.id, reason: eligibility.reason });
      continue;
    }
    const conditional = evaluateConditionalAutomationAction({
      trigger: rule.trigger,
      conditions: rule.conditions,
      ctx,
    });
    if (!conditional.wouldRun) {
      skipped.push({ ruleId: rule.id, reason: conditional.reason });
      continue;
    }
    const safety = checkHumanAutomationSafetyLimits(rule.safety, rule.spendableCash, rule.resolvedCost);
    if (!safety.ok) {
      skipped.push({ ruleId: rule.id, reason: safety.reason });
      continue;
    }
    return {
      selected: rule,
      skipped,
      requiresConfirmation: Boolean(options?.confirmBeforeRunning),
    };
  }
  return { selected: null, skipped, requiresConfirmation: false };
}

export function previewHumanAutomationRule(
  rule: PortableHumanAutomationRule,
  ctx: ConditionalActionContext
): string {
  const eligibility = evaluateHumanAutomationExecutionEligibility(
    rule.enabled,
    rule.authorityDisabled,
    rule.activeFromDay,
    rule.activeUntilDay,
    rule.limits,
    rule.safety,
    rule.stats,
    ctx.currentDay,
    ctx.currentTurn
  );
  if (!eligibility.eligible) return `Would NOT run: ${eligibility.reason}`;
  const conditional = evaluateConditionalAutomationAction({
    trigger: rule.trigger,
    conditions: rule.conditions,
    ctx,
  });
  if (!conditional.wouldRun) return `Would NOT run: ${conditional.reason}`;
  const safety = checkHumanAutomationSafetyLimits(rule.safety, rule.spendableCash, rule.resolvedCost);
  if (!safety.ok) return `Would NOT run: ${safety.reason}`;
  return `Would run: ${rule.actionType} (cost ${rule.resolvedCost}, cash ${rule.spendableCash}).`;
}

export function commitNationalStewardSpend(
  persisted: NationalStewardPersisted,
  turn: number,
  cashSpent: number
): NationalStewardPersisted {
  const spent = Math.max(0, cashSpent);
  let { cycleSpendAccumulator, cycleStartTurn, turnSpendAccumulator } = persisted;
  if (turn > persisted.cycleStartTurn + persisted.spendingCap.cycleTurns) {
    cycleSpendAccumulator = 0;
    cycleStartTurn = turn;
  }
  return {
    ...persisted,
    turnSpendAccumulator: turnSpendAccumulator + spent,
    cycleSpendAccumulator: cycleSpendAccumulator + spent,
    cycleStartTurn,
  };
}

export function buildSafeTimeAdvanceContextFromIdle(input: {
  gameMode: string;
  matchEnded: boolean;
  currentActorId: string;
  humanAutomationEnabled: boolean;
  humanAutomationExecuting: boolean;
  pendingHumanAutomationApprovals: number;
  pendingGenericApprovals: number;
  copilotTakeoverActive: boolean;
  copilotStepInFlight: boolean;
  playerInTransit: boolean;
  stewardPlanBlocked: boolean;
  stewardPaused: boolean;
  autoModeReplayRecording: boolean;
  dialogBlockingTime: boolean;
}): SafeTimeAdvanceContext {
  return {
    gameMode: input.gameMode,
    matchEnded: input.matchEnded,
    currentActorId: input.currentActorId,
    humanAutomationEnabled: input.humanAutomationEnabled,
    humanAutomationExecuting: input.humanAutomationExecuting,
    pendingHumanAutomationApprovals: input.pendingHumanAutomationApprovals,
    pendingGenericApprovals: input.pendingGenericApprovals,
    copilotTakeoverActive: input.copilotTakeoverActive,
    copilotStepInFlight: input.copilotStepInFlight,
    playerInTransit: input.playerInTransit,
    nationalStewardPlanBlocked: input.stewardPlanBlocked,
    nationalStewardPaused: input.stewardPaused,
    autoModeReplayRecording: input.autoModeReplayRecording,
    dialogBlockingTime: input.dialogBlockingTime,
  };
}

export function summarizeIdleAutomationSafety(
  ctx: SafeTimeAdvanceContext
): { endTurnOk: boolean; advanceDayOk: boolean; blockers: string[] } {
  const endTurn = canEndTurn(ctx);
  const advanceDay = canAdvanceDay(ctx);
  const blockers: string[] = [];
  if (!endTurn.allowed) blockers.push(`end_turn: ${endTurn.reason}`);
  if (!advanceDay.allowed) blockers.push(`advance_day: ${advanceDay.reason}`);
  return { endTurnOk: endTurn.allowed, advanceDayOk: advanceDay.allowed, blockers };
}

export function runO10Agent20IdleDepthSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  push(
    'idle_band_tick',
    'deep idle band maps to steward tick path',
    resolveIdleAwareAutomationPath({
      playerControlMode: 'manual',
      stewardEnabled: true,
      idleMs: 200_000,
      consecutiveIdleTurns: 4,
    }) === 'v94_idle_steward_national_tick'
  );

  push(
    'idle_band_active',
    'low idle stays manual',
    resolveIdleAwareAutomationPath({
      playerControlMode: 'manual',
      stewardEnabled: true,
      idleMs: 1000,
      consecutiveIdleTurns: 0,
    }) === 'v94_player_control_manual'
  );

  const ctx: ConditionalActionContext = {
    actor: { money: 100, inventory: ['wheat', 'wheat'], currentRegion: 'NSW', level: 5 },
    currentDay: 2,
    currentTurn: 4,
    isNewDayForActor: false,
    extendedTriggersEnabled: true,
    consecutiveIdleTurns: 4,
    settingsFlags: {},
  };

  const rule: PortableHumanAutomationRule = {
    id: 'r1',
    name: 'Idle sell',
    enabled: true,
    authorityDisabled: false,
    priority: 10,
    activeFromDay: 0,
    activeUntilDay: 999,
    trigger: { type: 'consecutive_idle_turns_at_or_above', thresholdAmount: 3 },
    conditions: {
      mode: 'all_must_pass',
      items: [{ id: 'w', enabled: true, kind: 'region_equals', value: 'NSW' }],
    },
    limits: { maxRunsPerDay: 5, maxRunsTotal: null, cooldownTurns: 0 },
    safety: { maxCostPerRun: 500, minCashRemainingAfterRun: 50, stopIfNoStateChangeCount: 5 },
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
    actionType: 'sell',
    resolvedCost: 0,
    spendableCash: 100,
  };

  const sel = selectHumanAutomationCandidate([rule], ctx);
  push('select_idle_rule', 'selects idle trigger rule', sel.selected?.id === 'r1');

  push(
    'preview_ok',
    'preview reports would run',
    previewHumanAutomationRule(rule, ctx).startsWith('Would run')
  );

  const conflicts = detectPortableAutomationConflicts(
    [
      rule,
      { ...rule, id: 'r2', name: 'Other', priority: 10, trigger: { type: 'turn_start' } },
    ],
    true
  );
  push('conflicts', 'detects priority collision', conflicts.some(c => c.kind === 'priority_collision'));

  push(
    'resource_trigger',
    'resource quantity trigger in conditional path',
    evaluateConditionalAutomationAction({
      trigger: { type: 'resource_quantity_at_least', resource: 'wheat', thresholdAmount: 2 },
      conditions: null,
      ctx,
    }).wouldRun
  );

  push(
    'steward_spend',
    'steward spend accumulators update',
    commitNationalStewardSpend(
      {
        schemaVersion: '10.14.0-agent20',
        enabled: true,
        operatingMode: 'watch_only',
        automationPath: 'v94_idle_steward_watch',
        categoryLocks: [],
        spendingCap: { perTurnCash: 100, perCycleCash: 500, perActionCash: 50, cycleTurns: 3 },
        playerOverride: {
          latched: false,
          paused: false,
          reason: '',
          sinceTurn: 0,
          sinceTimestampMs: 0,
          frozenCategories: [],
          resumeRequiresExplicitStart: true,
        },
        idleTelemetry: { msSinceLastHumanInput: 0, msSinceLastCommittedAction: 0, consecutiveIdleTurns: 0 },
        turnSpendAccumulator: 0,
        cycleSpendAccumulator: 0,
        cycleStartTurn: 1,
        history: [],
      },
      2,
      40
    ).turnSpendAccumulator === 40
  );

  const safety = summarizeIdleAutomationSafety(
    buildSafeTimeAdvanceContextFromIdle({
      gameMode: 'game',
      matchEnded: false,
      currentActorId: 'player',
      humanAutomationEnabled: true,
      humanAutomationExecuting: true,
      pendingHumanAutomationApprovals: 0,
      pendingGenericApprovals: 0,
      copilotTakeoverActive: false,
      copilotStepInFlight: false,
      playerInTransit: false,
      stewardPlanBlocked: false,
      stewardPaused: false,
      autoModeReplayRecording: false,
      dialogBlockingTime: false,
    })
  );
  push('safety_summary', 'executing automation blocks time', !safety.endTurnOk && safety.blockers.length > 0);

  return results;
}
