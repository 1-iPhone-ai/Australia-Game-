import type {
  HumanAutomationExecutionLimits,
  HumanAutomationExecutionStats,
  HumanAutomationSafetyLimits,
  NationalStewardEvaluationContext,
  NationalStewardSafeguardSeverity,
} from './types.js';

export interface ExecutionEligibilityResult {
  eligible: boolean;
  reason: string;
}

export function evaluateHumanAutomationExecutionEligibility(
  enabled: boolean,
  authorityDisabled: boolean,
  activeFromDay: number,
  activeUntilDay: number,
  limits: HumanAutomationExecutionLimits,
  safety: HumanAutomationSafetyLimits,
  stats: HumanAutomationExecutionStats,
  currentDay: number,
  turnCounter: number
): ExecutionEligibilityResult {
  if (!enabled || authorityDisabled) return { eligible: false, reason: 'Automation is disabled.' };
  if (currentDay < activeFromDay || currentDay > activeUntilDay) {
    return {
      eligible: false,
      reason: `Outside active days schedule (${activeFromDay}-${activeUntilDay}).`,
    };
  }
  if (limits.maxRunsTotal !== null && stats.totalRuns >= limits.maxRunsTotal) {
    return { eligible: false, reason: 'Max total runs reached.' };
  }
  const runsToday = stats.runsTodayDay === currentDay ? stats.runsToday : 0;
  if (runsToday >= limits.maxRunsPerDay) {
    return { eligible: false, reason: 'Max runs per day reached.' };
  }
  if (
    limits.cooldownTurns > 0 &&
    stats.lastRunTurn !== null &&
    turnCounter - stats.lastRunTurn < limits.cooldownTurns
  ) {
    return { eligible: false, reason: 'Cooldown active.' };
  }
  if (stats.consecutiveNoChangeCount >= safety.stopIfNoStateChangeCount) {
    return { eligible: false, reason: 'Auto-suspended: repeated no-op runs.' };
  }
  return { eligible: true, reason: '' };
}

export function checkHumanAutomationSafetyLimits(
  safety: HumanAutomationSafetyLimits,
  spendableCash: number,
  resolvedCost: number
): { ok: boolean; reason: string } {
  if (safety.maxCostPerRun !== null && resolvedCost > safety.maxCostPerRun) {
    return { ok: false, reason: 'Exceeds configured max cost per run.' };
  }
  if (
    safety.minCashRemainingAfterRun !== null &&
    spendableCash - resolvedCost < safety.minCashRemainingAfterRun
  ) {
    return { ok: false, reason: 'Would drop below the configured minimum cash reserve.' };
  }
  return { ok: true, reason: '' };
}

export function evaluateNationalStewardSafeguards(ctx: NationalStewardEvaluationContext): {
  blocked: boolean;
  messages: string[];
  severity: NationalStewardSafeguardSeverity;
} {
  const messages: string[] = [];
  let severity: NationalStewardSafeguardSeverity = 'info';
  let blocked = false;
  const cap = ctx.persisted.spendingCap;
  const spend = ctx.persisted.turnSpendAccumulator + Math.max(0, -ctx.proposedCashDelta);

  if (ctx.playerOverride.latched || ctx.playerOverride.paused) {
    messages.push(ctx.playerOverride.reason || 'Player override latched.');
    blocked = true;
    severity = 'block';
    return { blocked, messages, severity };
  }
  if (ctx.playerOverride.frozenCategories.includes(ctx.category)) {
    messages.push(`Category ${ctx.category} frozen by player.`);
    blocked = true;
    severity = 'block';
  }
  if (-ctx.proposedCashDelta > cap.perActionCash) {
    messages.push('Per-action spending cap would be exceeded.');
    blocked = true;
    severity = 'block';
  }
  if (spend > cap.perTurnCash) {
    messages.push('Per-turn steward spending cap reached.');
    blocked = true;
    severity = 'warn';
  }
  if (ctx.persisted.cycleSpendAccumulator + Math.max(0, -ctx.proposedCashDelta) > cap.perCycleCash) {
    messages.push('Cycle spending cap would be exceeded.');
    blocked = true;
    severity = 'warn';
  }
  if (
    (ctx.category === 'diplomacy' || ctx.category === 'military') &&
    !ctx.takeoverActive &&
    ctx.autoModePermission !== 'full_auto'
  ) {
    messages.push('High-impact category requires autonomous takeover or full auto permission.');
    blocked = true;
    severity = 'block';
  }
  if (ctx.guardianMajorEnabled && (ctx.category === 'military' || ctx.category === 'crisis')) {
    messages.push('Guardian major-mistakes mode requires explicit approval for this category.');
    blocked = true;
    severity = 'warn';
  }
  return { blocked, messages, severity };
}

export function mergeExecutionStatsAfterRun(
  stats: HumanAutomationExecutionStats,
  success: boolean,
  day: number,
  turn: number,
  errorMsg?: string
): HumanAutomationExecutionStats {
  return {
    ...stats,
    totalRuns: stats.totalRuns + 1,
    totalSuccesses: stats.totalSuccesses + (success ? 1 : 0),
    totalFailed: stats.totalFailed + (success ? 0 : 1),
    lastRunDay: day,
    lastRunTurn: turn,
    runsToday: (stats.runsTodayDay === day ? stats.runsToday : 0) + 1,
    runsTodayDay: day,
    consecutiveNoChangeCount: success ? 0 : stats.consecutiveNoChangeCount + 1,
    lastResultSummary: success ? 'Ran successfully.' : errorMsg || 'Execution failed.',
  };
}
