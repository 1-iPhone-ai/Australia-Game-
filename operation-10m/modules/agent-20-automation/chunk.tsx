// OP10M_MODULE_BEGIN agent-20-automation
// OP10M_MANIFEST_SHA256: 55885baff77fce2e83af8bc95325a0b14c31f76443af79b6dc748599bd8932c5
// OP10M_MODULE_VERSION: 10m.1.18.0-agent20
// Agent 20 — idle / automation / autonomous ops (generated; source: operation-10m/agent-20-automation/src/)

// --- source: types.ts ---
/** Operation 10M Agent 20 — shared types (mirror V9.4 SECTION 20AN + HA2). */

export const O10_AGENT20_MODULE_VERSION = '10m.1.4.0-agent20';
export const O10_AGENT20_SCHEMA_VERSION = '10.14.0-agent20';

export const O10_AUTOMATION_PATH_IDS = [
  'v94_player_control_manual',
  'v94_player_control_advisor',
  'v94_player_control_assistant',
  'v94_player_control_rescue',
  'v94_player_control_autonomous',
  'v94_auto_mode_observe',
  'v94_auto_mode_recommend',
  'v94_auto_mode_assist',
  'v94_auto_mode_full_auto',
  'v94_copilot_advisor',
  'v94_copilot_active_assistant',
  'v94_copilot_autonomous_takeover',
  'v94_idle_steward_watch',
  'v94_idle_steward_soft_nudge',
  'v94_idle_steward_national_tick',
] as const;

export type O10AutomationPathId = (typeof O10_AUTOMATION_PATH_IDS)[number];

export type PlayerControlMode = 'manual' | 'advisor' | 'assistant' | 'rescue' | 'autonomous';
export type AutoModePermission =
  | 'disabled'
  | 'recommend_only'
  | 'recommend'
  | 'assist_only'
  | 'auto_apply_non_intrusive'
  | 'full_auto'
  | 'full_adaptive';

export type NationalStewardOperatingMode =
  | 'off'
  | 'watch_only'
  | 'recommend'
  | 'assisted'
  | 'autonomous_idle'
  | 'autonomous_active'
  | 'paused_by_player'
  | 'blocked_by_guardian';

export type NationalStewardSafeguardSeverity = 'info' | 'warn' | 'block';

export type NationalStewardCategory =
  | 'fiscal'
  | 'infrastructure'
  | 'industry'
  | 'diplomacy'
  | 'military'
  | 'research'
  | 'regional'
  | 'household'
  | 'crisis';

export interface NationalStewardSpendingCap {
  perTurnCash: number;
  perCycleCash: number;
  perActionCash: number;
  cycleTurns: number;
}

export interface NationalStewardPlayerOverrideState {
  latched: boolean;
  paused: boolean;
  reason: string;
  sinceTurn: number;
  sinceTimestampMs: number;
  frozenCategories: NationalStewardCategory[];
  resumeRequiresExplicitStart: boolean;
}

export interface NationalStewardIdleTelemetry {
  msSinceLastHumanInput: number;
  msSinceLastCommittedAction: number;
  consecutiveIdleTurns: number;
  lastIdleReason?: string;
  lastAutomationPath?: O10AutomationPathId;
}

export interface NationalStewardHistoryEntry {
  turn: number;
  path: O10AutomationPathId;
  outcome: 'planned' | 'committed' | 'safeguard_block' | 'player_override' | 'idle';
  summary: string;
}

export interface NationalStewardPersisted {
  schemaVersion: string;
  enabled: boolean;
  operatingMode: NationalStewardOperatingMode;
  automationPath: O10AutomationPathId;
  categoryLocks: Array<{ category: NationalStewardCategory; locked: boolean; reason?: string; lockedTurn?: number }>;
  spendingCap: NationalStewardSpendingCap;
  playerOverride: NationalStewardPlayerOverrideState;
  idleTelemetry: NationalStewardIdleTelemetry;
  turnSpendAccumulator: number;
  cycleSpendAccumulator: number;
  cycleStartTurn: number;
  history: NationalStewardHistoryEntry[];
  lastPlanSummary?: string;
}

export interface NationalStewardEvaluationContext {
  turn: number;
  playerControlMode: PlayerControlMode;
  autoModeEnabled: boolean;
  autoModePermission: AutoModePermission;
  takeoverActive: boolean;
  guardianMajorEnabled: boolean;
  cash: number;
  apRemaining: number;
  category: NationalStewardCategory;
  proposedCashDelta: number;
  persisted: NationalStewardPersisted;
  playerOverride: NationalStewardPlayerOverrideState;
}

export type HumanAutomationTriggerType =
  | 'turn_start'
  | 'day_start'
  | 'cash_below_threshold'
  | 'cash_above_threshold'
  | 'resource_quantity_at_least'
  | 'resource_quantity_at_most'
  | 'consecutive_idle_turns_at_or_above'
  | 'level_at_or_above'
  | 'manual_test_only'
  | 'day_number_at_or_above'
  | 'turn_number_at_or_above';

export interface HumanAutomationTrigger {
  type: HumanAutomationTriggerType;
  region?: string;
  resource?: string;
  thresholdAmount?: number;
}

export type RequirementGroupMode = 'all_must_pass' | 'any_may_pass';

export interface PortableActionRequirement {
  id: string;
  enabled: boolean;
  strictness?: 'hard' | 'soft';
  kind:
    | 'cash_at_least'
    | 'cash_at_most'
    | 'ap_at_least'
    | 'region_equals'
    | 'flag_enabled';
  value?: number | string | boolean;
}

export interface PortableRequirementGroup {
  mode: RequirementGroupMode;
  items: Array<PortableActionRequirement | PortableRequirementGroup>;
}

export interface HumanAutomationExecutionLimits {
  maxRunsPerDay: number;
  maxRunsTotal: number | null;
  cooldownTurns: number;
}

export interface HumanAutomationSafetyLimits {
  maxCostPerRun: number | null;
  minCashRemainingAfterRun: number | null;
  stopIfNoStateChangeCount: number;
}

export interface HumanAutomationExecutionStats {
  totalRuns: number;
  totalSuccesses: number;
  totalSkipped: number;
  totalFailed: number;
  lastRunDay: number | null;
  lastRunTurn: number | null;
  runsToday: number;
  runsTodayDay: number;
  consecutiveNoChangeCount: number;
  lastResultSummary: string;
}

export type AutomationRunStatus = 'success' | 'failed' | 'skipped';

export interface AutomationRunLogEntry {
  id: string;
  timestamp: number;
  day: number;
  turn: number;
  ruleId: string;
  ruleName: string;
  triggerType: HumanAutomationTriggerType;
  actionType: string;
  status: AutomationRunStatus;
  resultMessage: string;
  error?: string;
}

export type TimeAdvanceKind = 'end_turn' | 'advance_day' | 'end_season' | 'wait_tick';

export interface SafeTimeAdvanceContext {
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
  nationalStewardPlanBlocked: boolean;
  nationalStewardPaused: boolean;
  autoModeReplayRecording: boolean;
  dialogBlockingTime: boolean;
}

export interface SafeTimeAdvanceVerdict {
  allowed: boolean;
  reason: string;
  blockedBy: TimeAdvanceKind | 'none';
}

export type O10SelfTestResult = { id: string; name: string; passed: boolean; detail?: string };

export type IdleAutomationBand = 'active' | 'drifting' | 'idle' | 'deep_idle' | 'steward_tick';

export interface PortableHumanAutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  authorityDisabled: boolean;
  priority: number;
  activeFromDay: number;
  activeUntilDay: number;
  trigger: HumanAutomationTrigger;
  conditions: PortableRequirementGroup | null;
  limits: HumanAutomationExecutionLimits;
  safety: HumanAutomationSafetyLimits;
  stats: HumanAutomationExecutionStats;
  actionType: string;
  resolvedCost: number;
  spendableCash: number;
}

export interface HumanAutomationSelectionResult {
  selected: PortableHumanAutomationRule | null;
  skipped: Array<{ ruleId: string; reason: string }>;
  requiresConfirmation: boolean;
}

export interface AutomationRuleConflict {
  ruleId: string;
  otherRuleId: string;
  kind: 'priority_collision' | 'trigger_overlap';
  message: string;
}

export type O10AutomationIntentStatus = 'queued' | 'running' | 'completed' | 'cancelled' | 'blocked';

export interface O10AutomationIntent {
  id: string;
  ruleId: string;
  actionType: string;
  priority: number;
  enqueuedTurn: number;
  enqueuedDay: number;
  resolvedCost: number;
  status: O10AutomationIntentStatus;
  reason?: string;
}

export interface O10AutomationIntentQueue {
  maxDepth: number;
  items: O10AutomationIntent[];
}

export interface O10DayBoundaryResult {
  allowed: boolean;
  reason: string;
  nextDay: number;
  steward: NationalStewardPersisted;
  turnSpendReset: boolean;
  cycleRolled: boolean;
}

export interface NationalStewardPlanStep {
  stepId: string;
  category: NationalStewardCategory;
  automationPath: O10AutomationPathId;
  intentKind: 'recommend' | 'copilot_intent' | 'auto_mode_package' | 'end_turn' | 'idle';
  title: string;
  rationale: string;
  proposedCashDelta: number;
  proposedApCost: number;
  safeguardMessages: string[];
  blocked: boolean;
}


// --- source: conditional-actions.ts ---
  HumanAutomationTrigger,
  HumanAutomationTriggerType,
  PortableActionRequirement,
  PortableRequirementGroup,
} from './types.js';

export interface AutomationActorSnapshot {
  money: number;
  inventory: string[];
  currentRegion: string;
  actionPoints?: number;
  completedChallengeCount?: number;
  level?: number;
}

export interface ConditionalActionContext {
  actor: AutomationActorSnapshot;
  currentDay: number;
  currentTurn: number;
  isNewDayForActor: boolean;
  extendedTriggersEnabled: boolean;
  consecutiveIdleTurns?: number;
  settingsFlags: Record<string, boolean | undefined>;
}

const TRIGGER_TYPES: HumanAutomationTriggerType[] = [
  'turn_start',
  'day_start',
  'cash_below_threshold',
  'cash_above_threshold',
  'resource_quantity_at_least',
  'resource_quantity_at_most',
  'consecutive_idle_turns_at_or_above',
  'level_at_or_above',
  'manual_test_only',
  'day_number_at_or_above',
  'turn_number_at_or_above',
];

export function isKnownAutomationTriggerType(type: string): type is HumanAutomationTriggerType {
  return (TRIGGER_TYPES as string[]).includes(type);
}

/** Pure trigger evaluation (subset of V9.4 evaluateHumanAutomationTrigger). */
export function evaluateAutomationTrigger(
  trigger: HumanAutomationTrigger,
  ctx: ConditionalActionContext
): boolean {
  const { actor, currentDay, currentTurn, isNewDayForActor, extendedTriggersEnabled } = ctx;
  switch (trigger.type) {
    case 'turn_start':
      return true;
    case 'day_start':
      return isNewDayForActor;
    case 'cash_below_threshold':
      return actor.money < (trigger.thresholdAmount ?? 0);
    case 'cash_above_threshold':
      return actor.money > (trigger.thresholdAmount ?? 0);
    case 'resource_quantity_at_least': {
      const res = trigger.resource || '';
      const count = actor.inventory.filter(r => r === res).length;
      return count >= (trigger.thresholdAmount ?? 0);
    }
    case 'resource_quantity_at_most': {
      const res = trigger.resource || '';
      const count = actor.inventory.filter(r => r === res).length;
      return count <= (trigger.thresholdAmount ?? 0);
    }
    case 'consecutive_idle_turns_at_or_above':
      return extendedTriggersEnabled
        ? (ctx.consecutiveIdleTurns ?? 0) >= (trigger.thresholdAmount ?? 1)
        : false;
    case 'level_at_or_above':
      return extendedTriggersEnabled ? (actor.level ?? 1) >= (trigger.thresholdAmount ?? 1) : false;
    case 'day_number_at_or_above':
      return extendedTriggersEnabled ? currentDay >= (trigger.thresholdAmount ?? 0) : false;
    case 'turn_number_at_or_above':
      return extendedTriggersEnabled ? currentTurn >= (trigger.thresholdAmount ?? 0) : false;
    case 'manual_test_only':
    default:
      return false;
  }
}

const MAX_GROUP_DEPTH = 8;

function evaluateRequirementLeaf(
  req: PortableActionRequirement,
  ctx: ConditionalActionContext
): { applicable: boolean; passed: boolean } {
  if (!req.enabled) return { applicable: false, passed: true };
  const { actor, settingsFlags } = ctx;
  switch (req.kind) {
    case 'cash_at_least':
      return { applicable: true, passed: actor.money >= Number(req.value ?? 0) };
    case 'cash_at_most':
      return { applicable: true, passed: actor.money <= Number(req.value ?? 0) };
    case 'ap_at_least':
      return { applicable: true, passed: (actor.actionPoints ?? 0) >= Number(req.value ?? 0) };
    case 'region_equals':
      return { applicable: true, passed: actor.currentRegion === String(req.value ?? '') };
    case 'flag_enabled':
      return { applicable: true, passed: Boolean(settingsFlags[String(req.value ?? '')]) };
    default:
      return { applicable: false, passed: true };
  }
}

function evaluateRequirementGroupTree(
  node: PortableActionRequirement | PortableRequirementGroup,
  strictnessFilter: 'hard' | 'soft',
  ctx: ConditionalActionContext,
  depth = 0
): { applicable: boolean; passed: boolean } {
  if (depth > MAX_GROUP_DEPTH) {
    return strictnessFilter === 'hard'
      ? { applicable: true, passed: false }
      : { applicable: false, passed: true };
  }
  if ('items' in node && Array.isArray(node.items)) {
    const group = node as PortableRequirementGroup;
    const results = group.items.map(item => evaluateRequirementGroupTree(item, strictnessFilter, ctx, depth + 1));
    const applicable = results.filter(r => r.applicable);
    if (applicable.length === 0) return { applicable: false, passed: true };
    const passed =
      group.mode === 'any_may_pass'
        ? applicable.some(r => r.passed)
        : applicable.every(r => r.passed);
    return { applicable: true, passed };
  }
  const req = node as PortableActionRequirement;
  const reqStrictness = req.strictness === 'soft' ? 'soft' : 'hard';
  if (reqStrictness !== strictnessFilter) return { applicable: false, passed: true };
  return evaluateRequirementLeaf(req, ctx);
}

/** Hard + soft requirement groups — both must pass (matches V9.4 evaluateActionRequirements shape). */
export function evaluateAutomationConditionGroup(
  group: PortableRequirementGroup | null | undefined,
  ctx: ConditionalActionContext
): { approved: boolean; failingHard: boolean; failingSoft: boolean } {
  if (!group) return { approved: true, failingHard: false, failingSoft: false };
  const hard = evaluateRequirementGroupTree(group, 'hard', ctx);
  const soft = evaluateRequirementGroupTree(group, 'soft', ctx);
  const hardOk = !hard.applicable || hard.passed;
  const softOk = !soft.applicable || soft.passed;
  return {
    approved: hardOk && softOk,
    failingHard: hard.applicable && !hard.passed,
    failingSoft: soft.applicable && !soft.passed,
  };
}

export interface ConditionalAutomationDecisionInput {
  trigger: HumanAutomationTrigger;
  conditions: PortableRequirementGroup | null;
  ctx: ConditionalActionContext;
}

export interface ConditionalAutomationDecision {
  wouldRun: boolean;
  reason: string;
  triggerFired: boolean;
  conditionsApproved: boolean;
}

/** Single chokepoint: trigger AND optional requirement tree. */
export function evaluateConditionalAutomationAction(
  input: ConditionalAutomationDecisionInput
): ConditionalAutomationDecision {
  const triggerFired = evaluateAutomationTrigger(input.trigger, input.ctx);
  if (!triggerFired) {
    return {
      wouldRun: false,
      reason: `Trigger "${input.trigger.type}" is not currently true.`,
      triggerFired: false,
      conditionsApproved: true,
    };
  }
  const gate = evaluateAutomationConditionGroup(input.conditions, input.ctx);
  if (!gate.approved) {
    const part = gate.failingHard ? 'hard requirement' : 'soft requirement';
    return {
      wouldRun: false,
      reason: `Conditional action blocked: ${part} failed.`,
      triggerFired: true,
      conditionsApproved: false,
    };
  }
  return {
    wouldRun: true,
    reason: 'Trigger and conditions satisfied.',
    triggerFired: true,
    conditionsApproved: true,
  };
}


// --- source: limits.ts ---
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


// --- source: logs.ts ---
  AutomationRunLogEntry,
  AutomationRunStatus,
  HumanAutomationTriggerType,
  NationalStewardHistoryEntry,
  NationalStewardPersisted,
  O10AutomationPathId,
} from './types.js';

export const DEFAULT_RUN_HISTORY_CAP = 50;
export const DEFAULT_STEWARD_HISTORY_CAP = 24;

export interface CreateRunLogInput {
  id: string;
  timestamp: number;
  day: number;
  turn: number;
  ruleId: string;
  ruleName: string;
  triggerType: HumanAutomationTriggerType;
  actionType: string;
  status: AutomationRunStatus;
  resultMessage: string;
  error?: string;
}

export function createAutomationRunLogEntry(input: CreateRunLogInput): AutomationRunLogEntry {
  return { ...input };
}

export function appendAutomationRunHistory(
  history: AutomationRunLogEntry[] | undefined,
  entry: AutomationRunLogEntry,
  cap = DEFAULT_RUN_HISTORY_CAP
): AutomationRunLogEntry[] {
  return [entry, ...(history || [])].slice(0, cap);
}

export function appendNationalStewardHistory(
  persisted: NationalStewardPersisted,
  turn: number,
  path: O10AutomationPathId,
  outcome: NationalStewardHistoryEntry['outcome'],
  summary: string,
  cap = DEFAULT_STEWARD_HISTORY_CAP
): NationalStewardPersisted {
  const entry: NationalStewardHistoryEntry = { turn, path, outcome, summary };
  const history = [...(persisted.history || []), entry].slice(-cap);
  return { ...persisted, history, lastPlanSummary: summary };
}

export interface DailyDigestLine {
  ruleId: string;
  ruleName: string;
  successCount: number;
  failedCount: number;
  skippedCount: number;
}

/** Groups run history for automationDailyDigestEnabled-style summaries. */
export function buildAutomationDailyDigest(
  entries: AutomationRunLogEntry[],
  day: number
): DailyDigestLine[] {
  const byRule = new Map<string, DailyDigestLine>();
  for (const e of entries) {
    if (e.day !== day) continue;
    const line = byRule.get(e.ruleId) || {
      ruleId: e.ruleId,
      ruleName: e.ruleName,
      successCount: 0,
      failedCount: 0,
      skippedCount: 0,
    };
    if (e.status === 'success') line.successCount += 1;
    else if (e.status === 'failed') line.failedCount += 1;
    else line.skippedCount += 1;
    byRule.set(e.ruleId, line);
  }
  return [...byRule.values()].sort((a, b) => a.ruleName.localeCompare(b.ruleName));
}

export function formatDailyDigestMarkdown(day: number, lines: DailyDigestLine[]): string {
  if (lines.length === 0) return `Day ${day}: no automation runs logged.`;
  const parts = lines.map(
    l =>
      `• **${l.ruleName}** — ${l.successCount} ok, ${l.failedCount} failed, ${l.skippedCount} skipped`
  );
  return [`### Automation digest (day ${day})`, ...parts].join('\n');
}

export interface StewardLogFilter {
  minTurn?: number;
  outcomes?: NationalStewardHistoryEntry['outcome'][];
}

export function filterStewardHistory(
  history: NationalStewardHistoryEntry[],
  filter: StewardLogFilter
): NationalStewardHistoryEntry[] {
  return history.filter(h => {
    if (filter.minTurn !== undefined && h.turn < filter.minTurn) return false;
    if (filter.outcomes && !filter.outcomes.includes(h.outcome)) return false;
    return true;
  });
}


// --- source: safe-time-advance.ts ---

function baseBlock(reason: string, kind: TimeAdvanceKind): SafeTimeAdvanceVerdict {
  return { allowed: false, reason, blockedBy: kind };
}

function allow(reason = ''): SafeTimeAdvanceVerdict {
  return { allowed: true, reason, blockedBy: 'none' };
}

/**
 * Fail-closed gate before end_turn / advance_day while automation, approvals, or Co-Pilot work is in flight.
 * Intended for advanceDay, handleEndTurn, and idle steward national ticks.
 */
export function evaluateSafeTimeAdvance(
  ctx: SafeTimeAdvanceContext,
  kind: TimeAdvanceKind
): SafeTimeAdvanceVerdict {
  if (ctx.matchEnded) {
    return baseBlock('Match already ended.', kind);
  }
  if (ctx.gameMode !== 'game') {
    return baseBlock('Time advance only allowed during an active match.', kind);
  }
  if (ctx.dialogBlockingTime) {
    return baseBlock('Close blocking dialogs before advancing time.', kind);
  }
  if (ctx.humanAutomationExecuting) {
    return baseBlock('Human automation action still executing.', kind);
  }
  if (ctx.copilotStepInFlight) {
    return baseBlock('Co-Pilot live step still in flight.', kind);
  }
  if (ctx.pendingHumanAutomationApprovals > 0) {
    return baseBlock('Resolve pending human automation approvals first.', kind);
  }
  if (kind === 'advance_day' || kind === 'end_season') {
    if (ctx.pendingGenericApprovals > 0) {
      return baseBlock('Resolve pending approval queue before advancing the day.', kind);
    }
    if (ctx.copilotTakeoverActive && ctx.currentActorId === 'player') {
      return baseBlock('End or interrupt Co-Pilot takeover before advancing the day.', kind);
    }
    if (ctx.playerInTransit) {
      return baseBlock('Cannot advance day while player is in transit.', kind);
    }
    if (ctx.nationalStewardPaused && ctx.nationalStewardPlanBlocked) {
      return baseBlock('National steward paused with blocked plan — review before day advance.', kind);
    }
    if (ctx.autoModeReplayRecording) {
      return baseBlock('Auto Mode replay recording active — finish or cancel before day advance.', kind);
    }
  }
  if (kind === 'end_turn') {
    if (ctx.currentActorId === 'player' && ctx.playerInTransit) {
      return baseBlock('Cannot end turn while in transit.', kind);
    }
    if (
      ctx.humanAutomationEnabled &&
      ctx.pendingHumanAutomationApprovals > 0
    ) {
      return baseBlock('Pending automation confirmation blocks end turn.', kind);
    }
  }
  if (kind === 'wait_tick') {
    if (ctx.nationalStewardPlanBlocked && !ctx.nationalStewardPaused) {
      return baseBlock('Steward safeguard block — wait tick suppressed.', kind);
    }
  }
  return allow();
}

export function canAdvanceDay(ctx: SafeTimeAdvanceContext): SafeTimeAdvanceVerdict {
  return evaluateSafeTimeAdvance(ctx, 'advance_day');
}

export function canEndTurn(ctx: SafeTimeAdvanceContext): SafeTimeAdvanceVerdict {
  return evaluateSafeTimeAdvance(ctx, 'end_turn');
}

export function summarizeBlockedTimeAdvances(
  ctx: SafeTimeAdvanceContext
): { endTurn: SafeTimeAdvanceVerdict; advanceDay: SafeTimeAdvanceVerdict } {
  return {
    endTurn: canEndTurn(ctx),
    advanceDay: canAdvanceDay(ctx),
  };
}


// --- source: national-steward.ts ---
  NationalStewardCategory,
  NationalStewardPersisted,
  NationalStewardPlanStep,
  O10AutomationPathId,
  PlayerControlMode,
  AutoModePermission,
  NationalStewardOperatingMode,
} from './types.js';
  O10_AGENT20_SCHEMA_VERSION,
  O10_AUTOMATION_PATH_IDS,
  type O10SelfTestResult,
} from './types.js';

export function createDefaultNationalStewardSpendingCap() {
  return {
    perTurnCash: 2500,
    perCycleCash: 8000,
    perActionCash: 1200,
    cycleTurns: 3,
  };
}

export function createDefaultNationalStewardPlayerOverride() {
  return {
    latched: false,
    paused: false,
    reason: '',
    sinceTurn: 0,
    sinceTimestampMs: 0,
    frozenCategories: [] as NationalStewardCategory[],
    resumeRequiresExplicitStart: true,
  };
}

export function createDefaultNationalStewardIdleTelemetry() {
  return {
    msSinceLastHumanInput: 0,
    msSinceLastCommittedAction: 0,
    consecutiveIdleTurns: 0,
  };
}

export function createDefaultAutonomousIdleNationalPersisted(): NationalStewardPersisted {
  return {
    schemaVersion: O10_AGENT20_SCHEMA_VERSION,
    enabled: true,
    operatingMode: 'watch_only',
    automationPath: 'v94_idle_steward_watch',
    categoryLocks: [],
    spendingCap: createDefaultNationalStewardSpendingCap(),
    playerOverride: createDefaultNationalStewardPlayerOverride(),
    idleTelemetry: createDefaultNationalStewardIdleTelemetry(),
    turnSpendAccumulator: 0,
    cycleSpendAccumulator: 0,
    cycleStartTurn: 1,
    history: [],
  };
}

export function sanitizeAutonomousIdleNationalPersisted(raw: unknown): NationalStewardPersisted | null {
  if (raw == null || typeof raw !== 'object') return null;
  const src = raw as Record<string, unknown>;
  const defaults = createDefaultAutonomousIdleNationalPersisted();
  const automationPath =
    typeof src.automationPath === 'string' &&
    (O10_AUTOMATION_PATH_IDS as readonly string[]).includes(src.automationPath)
      ? (src.automationPath as O10AutomationPathId)
      : defaults.automationPath;
  return {
    ...defaults,
    schemaVersion: typeof src.schemaVersion === 'string' ? src.schemaVersion : defaults.schemaVersion,
    enabled: typeof src.enabled === 'boolean' ? src.enabled : defaults.enabled,
    operatingMode:
      typeof src.operatingMode === 'string'
        ? (src.operatingMode as NationalStewardOperatingMode)
        : defaults.operatingMode,
    automationPath,
    playerOverride: {
      ...defaults.playerOverride,
      ...(typeof src.playerOverride === 'object' && src.playerOverride ? (src.playerOverride as object) : {}),
    },
    idleTelemetry: {
      ...defaults.idleTelemetry,
      ...(typeof src.idleTelemetry === 'object' && src.idleTelemetry ? (src.idleTelemetry as object) : {}),
    },
    spendingCap: {
      ...defaults.spendingCap,
      ...(typeof src.spendingCap === 'object' && src.spendingCap ? (src.spendingCap as object) : {}),
    },
    history: Array.isArray(src.history)
      ? src.history
          .slice(-24)
          .filter(
            (h): h is NationalStewardPersisted['history'][number] =>
              typeof h === 'object' && h !== null && typeof (h as { turn?: unknown }).turn === 'number'
          )
      : [],
    turnSpendAccumulator: typeof src.turnSpendAccumulator === 'number' ? src.turnSpendAccumulator : 0,
    cycleSpendAccumulator: typeof src.cycleSpendAccumulator === 'number' ? src.cycleSpendAccumulator : 0,
    cycleStartTurn: typeof src.cycleStartTurn === 'number' ? src.cycleStartTurn : 1,
  };
}

export function resolveO10AutomationPath(input: {
  playerControlMode?: PlayerControlMode;
  autoModeEnabled?: boolean;
  autoModePermission?: AutoModePermission;
  takeoverActive?: boolean;
  idleMs?: number;
  stewardEnabled?: boolean;
  coPilotMode?: string;
}): O10AutomationPathId {
  if (!input.stewardEnabled) return 'v94_player_control_manual';
  const pcm = input.playerControlMode || 'manual';
  if (pcm === 'manual' && (input.idleMs || 0) > 120_000 && !input.takeoverActive) return 'v94_idle_steward_watch';
  if (pcm === 'manual') return 'v94_player_control_manual';
  if (pcm === 'advisor') return 'v94_player_control_advisor';
  if (pcm === 'assistant') return 'v94_player_control_assistant';
  if (pcm === 'rescue') return 'v94_player_control_rescue';
  if (pcm === 'autonomous' || input.coPilotMode === 'autonomous_takeover') {
    return input.takeoverActive ? 'v94_copilot_autonomous_takeover' : 'v94_player_control_autonomous';
  }
  if (input.autoModeEnabled) {
    const perm = input.autoModePermission || 'disabled';
    if (perm === 'full_auto' || perm === 'full_adaptive') return 'v94_auto_mode_full_auto';
    if (perm === 'assist_only' || perm === 'auto_apply_non_intrusive') return 'v94_auto_mode_assist';
    if (perm === 'recommend_only' || perm === 'recommend') return 'v94_auto_mode_recommend';
    return 'v94_auto_mode_observe';
  }
  if ((input.idleMs || 0) > 45_000) return 'v94_idle_steward_soft_nudge';
  return 'v94_idle_steward_watch';
}

export function mapAutomationPathToStewardMode(path: O10AutomationPathId): NationalStewardOperatingMode {
  switch (path) {
    case 'v94_player_control_manual':
      return 'off';
    case 'v94_player_control_advisor':
    case 'v94_auto_mode_observe':
    case 'v94_copilot_advisor':
    case 'v94_idle_steward_watch':
      return 'watch_only';
    case 'v94_player_control_assistant':
    case 'v94_auto_mode_recommend':
    case 'v94_idle_steward_soft_nudge':
      return 'recommend';
    case 'v94_auto_mode_assist':
    case 'v94_copilot_active_assistant':
      return 'assisted';
    case 'v94_idle_steward_national_tick':
      return 'autonomous_idle';
    case 'v94_player_control_autonomous':
    case 'v94_auto_mode_full_auto':
    case 'v94_copilot_autonomous_takeover':
    case 'v94_player_control_rescue':
      return 'autonomous_active';
    default:
      return 'watch_only';
  }
}

export function applyPlayerNationalStewardOverride(
  persisted: NationalStewardPersisted,
  patch: { action?: 'pause' | 'resume' | 'latch_manual' | 'clear'; reason?: string; paused?: boolean },
  turn: number,
  nowMs = Date.now()
): NationalStewardPersisted {
  const base = { ...persisted, playerOverride: { ...persisted.playerOverride } };
  if (patch.action === 'pause' || patch.paused) {
    base.playerOverride.paused = true;
    base.playerOverride.latched = true;
    base.playerOverride.reason = patch.reason || 'Player paused national steward.';
    base.playerOverride.sinceTurn = turn;
    base.playerOverride.sinceTimestampMs = nowMs;
    base.operatingMode = 'paused_by_player';
    base.automationPath = 'v94_player_control_manual';
  }
  if (patch.action === 'latch_manual') {
    base.playerOverride.latched = true;
    base.playerOverride.reason = patch.reason || 'Manual control latched.';
    base.playerOverride.sinceTurn = turn;
    base.operatingMode = 'paused_by_player';
  }
  if (patch.action === 'resume' && base.playerOverride.resumeRequiresExplicitStart) {
    base.playerOverride.paused = false;
    base.playerOverride.latched = false;
    base.playerOverride.reason = '';
    base.operatingMode = 'watch_only';
  }
  if (patch.action === 'clear') {
    base.playerOverride = createDefaultNationalStewardPlayerOverride();
    base.operatingMode = 'watch_only';
  }
  return appendNationalStewardHistory(
    base,
    turn,
    base.automationPath,
    'player_override',
    base.playerOverride.reason || 'override'
  );
}

export function tickIdleNationalStewardTelemetry(
  persisted: NationalStewardPersisted,
  input: {
    msSinceLastHumanInput: number;
    msSinceLastCommittedAction: number;
    humanCommittedThisTurn: boolean;
    turn: number;
  }
): NationalStewardPersisted {
  const idleTelemetry = {
    ...persisted.idleTelemetry,
    msSinceLastHumanInput: input.msSinceLastHumanInput,
    msSinceLastCommittedAction: input.msSinceLastCommittedAction,
    consecutiveIdleTurns: input.humanCommittedThisTurn
      ? 0
      : persisted.idleTelemetry.consecutiveIdleTurns + 1,
  };
  let { cycleSpendAccumulator, cycleStartTurn, turnSpendAccumulator } = persisted;
  if (input.turn > persisted.cycleStartTurn + persisted.spendingCap.cycleTurns) {
    cycleSpendAccumulator = 0;
    cycleStartTurn = input.turn;
  }
  if (input.humanCommittedThisTurn) turnSpendAccumulator = 0;
  return { ...persisted, idleTelemetry, cycleSpendAccumulator, cycleStartTurn, turnSpendAccumulator };
}

export function buildNationalStewardEvaluationContext(
  gameState: Record<string, unknown>,
  settings: Record<string, unknown>,
  persisted: NationalStewardPersisted,
  category: NationalStewardCategory,
  proposedCashDelta: number
) {
  const player =
    (gameState.player as Record<string, unknown>) ||
    ((gameState.players as Record<string, unknown>)?.[String(gameState.humanPlayerId)] as Record<
      string,
      unknown
    >) ||
    {};
  const auto = (settings.autoModeSettings as Record<string, unknown>) || {};
  return {
    turn: Number(gameState.turnCounter || gameState.turn || 1),
    playerControlMode: (settings.playerControlMode || 'manual') as PlayerControlMode,
    autoModeEnabled: Boolean(settings.autoModeEnabled ?? auto.autoModeEnabled),
    autoModePermission: (auto.permissionMode || auto.permission || 'disabled') as AutoModePermission,
    takeoverActive: Boolean(
      (gameState.takeoverSession as { status?: string })?.status === 'active'
    ),
    guardianMajorEnabled: (settings.guardianAiSettings as { level?: string })?.level === 'major_mistakes',
    cash: Number(player.cash || player.money || 0),
    apRemaining: Number(player.actionPointsRemaining ?? player.ap ?? 0),
    category,
    proposedCashDelta,
    persisted,
    playerOverride: persisted.playerOverride,
  };
}

export function planNationalStewardTurnStep(
  gameState: Record<string, unknown>,
  settings: Record<string, unknown>,
  persistedIn: NationalStewardPersisted | null | undefined,
  options?: { forceNationalTick?: boolean }
): { persisted: NationalStewardPersisted; step: NationalStewardPlanStep } {
  let persisted = sanitizeAutonomousIdleNationalPersisted(persistedIn) || createDefaultAutonomousIdleNationalPersisted();
  if (!persisted.enabled) {
    const step: NationalStewardPlanStep = {
      stepId: 'steward_disabled',
      category: 'regional',
      automationPath: 'v94_player_control_manual',
      intentKind: 'idle',
      title: 'National steward disabled',
      rationale: 'Enable national steward in settings to delegate idle management.',
      proposedCashDelta: 0,
      proposedApCost: 0,
      safeguardMessages: [],
      blocked: true,
    };
    return { persisted, step };
  }
  const idleMs = persisted.idleTelemetry.msSinceLastHumanInput;
  const path = options?.forceNationalTick
    ? ('v94_idle_steward_national_tick' as O10AutomationPathId)
    : resolveO10AutomationPath({
        playerControlMode: settings.playerControlMode as PlayerControlMode,
        autoModeEnabled: settings.autoModeEnabled as boolean,
        autoModePermission: (settings.autoModeSettings as { permissionMode?: AutoModePermission })
          ?.permissionMode,
        takeoverActive: Boolean(
          (gameState.takeoverSession as { status?: string })?.status === 'active'
        ),
        idleMs,
        stewardEnabled: persisted.enabled,
        coPilotMode: settings.coPilotMode as string,
      });
  persisted = {
    ...persisted,
    automationPath: path,
    operatingMode: persisted.playerOverride.paused ? 'paused_by_player' : mapAutomationPathToStewardMode(path),
  };
  const category: NationalStewardCategory = path.includes('idle')
    ? 'regional'
    : path.includes('auto_mode')
      ? 'fiscal'
      : 'infrastructure';
  const proposedCashDelta = path === 'v94_idle_steward_national_tick' ? -400 : 0;
  const ctx = buildNationalStewardEvaluationContext(gameState, settings, persisted, category, proposedCashDelta);
  const sg = evaluateNationalStewardSafeguards(ctx);
  const intentKind: NationalStewardPlanStep['intentKind'] = sg.blocked
    ? 'idle'
    : path === 'v94_copilot_autonomous_takeover' || path === 'v94_player_control_autonomous'
      ? 'copilot_intent'
      : path.startsWith('v94_auto_mode')
        ? 'auto_mode_package'
        : path.includes('nudge') || path.includes('recommend')
          ? 'recommend'
          : persisted.operatingMode === 'autonomous_idle'
            ? 'end_turn'
            : 'idle';
  const step: NationalStewardPlanStep = {
    stepId: `o10_${path}_${ctx.turn}`,
    category,
    automationPath: path,
    intentKind,
    title: sg.blocked ? 'Steward waiting (safeguard)' : `National steward: ${persisted.operatingMode}`,
    rationale: sg.messages[0] || `Routing via ${path} on V9.4 automation spine.`,
    proposedCashDelta,
    proposedApCost: intentKind === 'copilot_intent' ? 1 : 0,
    safeguardMessages: sg.messages,
    blocked: sg.blocked,
  };
  if (step.blocked) {
    persisted = appendNationalStewardHistory(persisted, ctx.turn, path, 'safeguard_block', step.rationale);
  } else if (step.intentKind === 'idle') {
    persisted = appendNationalStewardHistory(persisted, ctx.turn, path, 'idle', step.rationale);
  } else {
    persisted = appendNationalStewardHistory(persisted, ctx.turn, path, 'planned', step.title);
  }
  return { persisted, step };
}

export function runO10Agent20NationalStewardSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  push(
    'path_manual',
    'manual control path',
    resolveO10AutomationPath({ playerControlMode: 'manual', stewardEnabled: true, idleMs: 0 }) ===
      'v94_player_control_manual'
  );
  push(
    'path_idle_watch',
    'long idle watch',
    resolveO10AutomationPath({
      playerControlMode: 'manual',
      stewardEnabled: true,
      idleMs: 130_000,
    }) === 'v94_idle_steward_watch'
  );
  const def = createDefaultAutonomousIdleNationalPersisted();
  push('schema', 'default schema', def.schemaVersion === O10_AGENT20_SCHEMA_VERSION);
  const paused = applyPlayerNationalStewardOverride(def, { action: 'pause', reason: 'test' }, 3);
  push('pause', 'pause override', paused.operatingMode === 'paused_by_player');
  const plan = planNationalStewardTurnStep(
    { turnCounter: 2, takeoverSession: { status: 'active' } },
    { playerControlMode: 'autonomous', autoModeEnabled: true },
    def
  );
  push('plan', 'plan step id', Boolean(plan.step.stepId));
  return results;
}


// --- source: bridge-hooks.ts ---
  applyPlayerNationalStewardOverride,
  createDefaultAutonomousIdleNationalPersisted,
  planNationalStewardTurnStep,
  resolveO10AutomationPath,
  sanitizeAutonomousIdleNationalPersisted,
  tickIdleNationalStewardTelemetry,
  mapAutomationPathToStewardMode,
} from './national-steward.js';

export interface NationalStewardBridgeHooks {
  onBeforeCoPilotLiveStep?: (input: {
    gameState: Record<string, unknown>;
    settings: Record<string, unknown>;
    persisted: NationalStewardPersisted | null;
  }) => NationalStewardPersisted | null;
  onAfterAutoModeEvaluation?: (input: {
    gameState: Record<string, unknown>;
    settings: Record<string, unknown>;
    persisted: NationalStewardPersisted | null;
  }) => NationalStewardPersisted | null;
  onPlayerInterruptTakeover?: (input: {
    persisted: NationalStewardPersisted | null;
    turn: number;
  }) => NationalStewardPersisted;
}

export function createDefaultNationalStewardBridgeHooks(): NationalStewardBridgeHooks {
  return {
    onBeforeCoPilotLiveStep: ({ gameState, settings, persisted }) => {
      const base = sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted();
      const ticked = tickIdleNationalStewardTelemetry(base, {
        msSinceLastHumanInput: base.idleTelemetry.msSinceLastHumanInput,
        msSinceLastCommittedAction: base.idleTelemetry.msSinceLastCommittedAction,
        humanCommittedThisTurn: false,
        turn: Number(gameState?.turnCounter || 1),
      });
      const { persisted: planned } = planNationalStewardTurnStep(gameState, settings, ticked);
      return planned;
    },
    onAfterAutoModeEvaluation: ({ settings, persisted }) => {
      const base = sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted();
      if (!settings?.autoModeEnabled) return base;
      const path = resolveO10AutomationPath({
        autoModeEnabled: true,
        autoModePermission: (settings.autoModeSettings as { permissionMode?: string })?.permissionMode as
          | 'full_auto'
          | 'recommend_only'
          | undefined,
        stewardEnabled: base.enabled,
        playerControlMode: settings.playerControlMode as 'manual' | undefined,
      });
      return { ...base, automationPath: path, operatingMode: mapAutomationPathToStewardMode(path) };
    },
    onPlayerInterruptTakeover: ({ persisted, turn }) =>
      applyPlayerNationalStewardOverride(
        sanitizeAutonomousIdleNationalPersisted(persisted) || createDefaultAutonomousIdleNationalPersisted(),
        { action: 'latch_manual', reason: 'Co-Pilot takeover interrupted — manual control.' },
        turn
      ),
  };
}

export function mergeAutonomousIdleNationalIntoGameState(
  gameState: Record<string, unknown>,
  persisted: NationalStewardPersisted | null | undefined
): Record<string, unknown> {
  const sanitized = sanitizeAutonomousIdleNationalPersisted(persisted);
  if (!sanitized) return gameState;
  return { ...gameState, autonomousIdleNational: sanitized };
}


// --- source: idle-automation-depth.ts ---
  evaluateConditionalAutomationAction,
  type ConditionalActionContext,
} from './conditional-actions.js';
  checkHumanAutomationSafetyLimits,
  evaluateHumanAutomationExecutionEligibility,
} from './limits.js';
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


// --- source: turn-compute-engine.ts ---

export const O10_TURN_COMPUTE_SCHEMA = '10m.turn-compute.v1';

export interface O10TurnComputeInput {
  turn: number;
  day: number;
  actorId: string;
  gameMode: string;
  humanCommittedThisTurn: boolean;
  msSinceLastHumanInput: number;
  msSinceLastCommittedAction: number;
  playerInTransit: boolean;
  humanAutomationEnabled: boolean;
  humanAutomationExecuting: boolean;
  pendingHumanAutomationApprovals: number;
  pendingGenericApprovals: number;
  copilotTakeoverActive: boolean;
  copilotStepInFlight: boolean;
  autoModeReplayRecording: boolean;
  dialogBlockingTime: boolean;
  matchEnded?: boolean;
  advanceDayAfterTurn?: boolean;
  requireEndTurn?: boolean;
  gameState: Record<string, unknown>;
  settings: Record<string, unknown>;
  automationRules: PortableHumanAutomationRule[];
  conditionalCtx: import('./conditional-actions.js').ConditionalActionContext;
}

export interface O10TurnComputeEffects {
  steward: NationalStewardPersisted;
  stewardStep: NationalStewardPlanStep | null;
  selectedRule: PortableHumanAutomationRule | null;
  idleBand: IdleAutomationBand;
  endTurnAllowed: boolean;
  advanceDayAllowed: boolean;
  timeBlockers: string[];
  committedStewardSpend: number;
  hookTrace: string[];
}

export interface O10TurnComputeState {
  schema: string;
  lastTurnKey: string;
  effects: O10TurnComputeEffects | null;
}

export function createDefaultO10TurnComputeState(): O10TurnComputeState {
  return { schema: O10_TURN_COMPUTE_SCHEMA, lastTurnKey: '', effects: null };
}

export function buildO10TurnKey(actorId: string, turn: number): string {
  return `${actorId}:${turn}`;
}

/** Stable digest for replay-safe turn compute snapshots (excludes wall-clock fields). */
export function digestO10TurnComputeEffects(effects: O10TurnComputeEffects): string {
  const payload = {
    band: effects.idleBand,
    endTurnAllowed: effects.endTurnAllowed,
    advanceDayAllowed: effects.advanceDayAllowed,
    committedStewardSpend: effects.committedStewardSpend,
    selectedRuleId: effects.selectedRule?.id ?? null,
    stewardStepId: effects.stewardStep?.stepId ?? null,
    stewardPath: effects.steward.automationPath,
    hookTrace: effects.hookTrace,
  };
  let h = 2166136261;
  const s = JSON.stringify(payload);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `o10tc_${(h >>> 0).toString(16).padStart(8, '0')}`;
}

export function runO10Agent20TurnComputeSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });
  push('turn_key', 'turn key format', buildO10TurnKey('player', 3) === 'player:3');
  const fx: O10TurnComputeEffects = {
    steward: {
      schemaVersion: '10.14.0-agent20',
      enabled: true,
      operatingMode: 'watch_only',
      automationPath: 'v94_idle_steward_watch',
      categoryLocks: [],
      spendingCap: { perTurnCash: 1, perCycleCash: 1, perActionCash: 1, cycleTurns: 1 },
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
    stewardStep: null,
    selectedRule: null,
    idleBand: 'active',
    endTurnAllowed: true,
    advanceDayAllowed: true,
    timeBlockers: [],
    committedStewardSpend: 0,
    hookTrace: ['init'],
  };
  const d1 = digestO10TurnComputeEffects(fx);
  const d2 = digestO10TurnComputeEffects({ ...fx, hookTrace: ['init'] });
  push('digest_stable', 'effects digest stable', d1 === d2 && d1.startsWith('o10tc_'));
  push('default_state', 'default compute state schema', createDefaultO10TurnComputeState().schema === O10_TURN_COMPUTE_SCHEMA);
  return results;
}


// --- source: turn-hooks.ts ---
  classifyIdleAutomationBand,
  commitNationalStewardSpend,
  selectHumanAutomationCandidate,
  summarizeIdleAutomationSafety,
  buildSafeTimeAdvanceContextFromIdle,
} from './idle-automation-depth.js';
  createDefaultAutonomousIdleNationalPersisted,
  planNationalStewardTurnStep,
  tickIdleNationalStewardTelemetry,
} from './national-steward.js';

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


// --- source: idle-automation-simulation.ts ---
  buildO10TurnKey,
  createDefaultO10TurnComputeState,
  digestO10TurnComputeEffects,
  type O10TurnComputeInput,
  type O10TurnComputeState,
} from './turn-compute-engine.js';

export interface O10IdleAutomationTurnResult {
  turnKey: string;
  digest: string;
  effects: NonNullable<O10TurnComputeState['effects']>;
  state: O10TurnComputeState;
}

/** Full turn simulation: telemetry → steward plan → automation select → safe time → steward commit. */
export function simulateO10IdleAutomationTurn(
  input: O10TurnComputeInput,
  prior?: O10TurnComputeState | null,
  hooks: O10TurnHookRegistration[] = O10_DEFAULT_TURN_HOOKS
): O10IdleAutomationTurnResult {
  const stewardSeed: NationalStewardPersisted | undefined =
    prior?.effects?.steward || createDefaultAutonomousIdleNationalPersisted();
  const effects = executeO10TurnHooks(hooks, input, stewardSeed);
  const turnKey = buildO10TurnKey(input.actorId, input.turn);
  const state: O10TurnComputeState = {
    schema: createDefaultO10TurnComputeState().schema,
    lastTurnKey: turnKey,
    effects,
  };
  return {
    turnKey,
    digest: digestO10TurnComputeEffects(effects),
    effects,
    state,
  };
}

export function runO10Agent20SimulationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const baseInput: O10TurnComputeInput = {
    turn: 2,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 190_000,
    msSinceLastCommittedAction: 190_000,
    playerInTransit: false,
    humanAutomationEnabled: false,
    humanAutomationExecuting: false,
    pendingHumanAutomationApprovals: 0,
    pendingGenericApprovals: 0,
    copilotTakeoverActive: false,
    copilotStepInFlight: false,
    autoModeReplayRecording: false,
    dialogBlockingTime: false,
    gameState: { turnCounter: 2 },
    settings: { playerControlMode: 'manual' },
    automationRules: [],
    conditionalCtx: {
      actor: { money: 500, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 2,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      consecutiveIdleTurns: 3,
      settingsFlags: {},
    },
  };

  const seed = createDefaultO10TurnComputeState();
  seed.effects = createEmptyEffects();
  seed.effects.steward.idleTelemetry.consecutiveIdleTurns = 3;

  const t1 = simulateO10IdleAutomationTurn(
    { ...baseInput, turn: 1, msSinceLastHumanInput: 200_000 },
    seed
  );
  push('sim_turn_digest', 'simulation yields digest', t1.digest.startsWith('o10tc_'));
  push(
    'sim_steward_tick_step',
    'deep idle simulation reaches national tick planning',
    t1.effects.stewardStep?.automationPath === 'v94_idle_steward_national_tick' ||
      t1.effects.idleBand === 'steward_tick'
  );

  const t2 = simulateO10IdleAutomationTurn({ ...baseInput, turn: 2 }, t1.state);
  push('sim_chain_turns', 'chained turns advance turn key', t1.turnKey === 'player:1' && t2.turnKey === 'player:2');

  return results;
}

function createEmptyEffects(): NonNullable<O10TurnComputeState['effects']> {
  return {
    steward: createDefaultAutonomousIdleNationalPersisted(),
    stewardStep: null,
    selectedRule: null,
    idleBand: 'active',
    endTurnAllowed: true,
    advanceDayAllowed: true,
    timeBlockers: [],
    committedStewardSpend: 0,
    hookTrace: [],
  };
}


// --- source: automation-intent-queue.ts ---
  O10AutomationIntent,
  O10AutomationIntentQueue,
  O10SelfTestResult,
  PortableHumanAutomationRule,
} from './types.js';

export const O10_DEFAULT_INTENT_QUEUE_DEPTH = 8;

export function createEmptyAutomationIntentQueue(
  maxDepth = O10_DEFAULT_INTENT_QUEUE_DEPTH
): O10AutomationIntentQueue {
  return { maxDepth, items: [] };
}

export function enqueueAutomationIntent(
  queue: O10AutomationIntentQueue,
  intent: O10AutomationIntent
): { queue: O10AutomationIntentQueue; accepted: boolean; reason?: string } {
  if (queue.items.some(i => i.ruleId === intent.ruleId && i.status === 'queued')) {
    return { queue, accepted: false, reason: 'Duplicate rule already queued.' };
  }
  if (queue.items.filter(i => i.status === 'queued' || i.status === 'running').length >= queue.maxDepth) {
    return { queue, accepted: false, reason: 'Intent queue at capacity.' };
  }
  return { queue: { ...queue, items: [...queue.items, intent] }, accepted: true };
}

export function intentFromSelectedRule(
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  idSuffix = '0'
): O10AutomationIntent {
  return {
    id: `intent_${rule.id}_${turn}_${idSuffix}`,
    ruleId: rule.id,
    actionType: rule.actionType,
    priority: rule.priority,
    enqueuedTurn: turn,
    enqueuedDay: day,
    resolvedCost: rule.resolvedCost,
    status: 'queued',
  };
}

export function dequeueHighestPriorityIntent(
  queue: O10AutomationIntentQueue,
  turn: number
): { queue: O10AutomationIntentQueue; intent: O10AutomationIntent | null } {
  const queued = queue.items.filter(i => i.status === 'queued' && i.enqueuedTurn <= turn);
  if (queued.length === 0) return { queue, intent: null };
  const pick = [...queued].sort((a, b) => b.priority - a.priority)[0];
  const items = queue.items.map(i =>
    i.id === pick.id ? { ...i, status: 'running' as const } : i
  );
  return { queue: { ...queue, items }, intent: { ...pick, status: 'running' } };
}

export function completeAutomationIntent(
  queue: O10AutomationIntentQueue,
  intentId: string,
  status: 'completed' | 'cancelled' | 'blocked',
  reason?: string
): O10AutomationIntentQueue {
  return {
    ...queue,
    items: queue.items.map(i =>
      i.id === intentId ? { ...i, status, reason: reason || i.reason } : i
    ),
  };
}

export function pruneAutomationIntentHistory(
  queue: O10AutomationIntentQueue,
  keep = 32
): O10AutomationIntentQueue {
  return { ...queue, items: queue.items.slice(-keep) };
}

export function runO10Agent20IntentQueueSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let q = createEmptyAutomationIntentQueue(2);
  const a = intentFromSelectedRule(
    {
      id: 'r1',
      name: 'A',
      enabled: true,
      authorityDisabled: false,
      priority: 5,
      activeFromDay: 0,
      activeUntilDay: 9,
      trigger: { type: 'turn_start' },
      conditions: null,
      limits: { maxRunsPerDay: 1, maxRunsTotal: null, cooldownTurns: 0 },
      safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 3 },
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
    },
    1,
    1
  );
  const e1 = enqueueAutomationIntent(q, a);
  q = e1.queue;
  push('enqueue_ok', 'accepts first intent', e1.accepted === true);
  const dup = enqueueAutomationIntent(q, { ...a, id: 'intent_dup' });
  push('enqueue_dup', 'rejects duplicate rule', dup.accepted === false);
  const e2 = enqueueAutomationIntent(q, { ...a, id: 'i2', ruleId: 'r2', priority: 9 });
  q = e2.queue;
  const e3 = enqueueAutomationIntent(q, { ...a, id: 'i3', ruleId: 'r3' });
  push('enqueue_cap', 'respects max depth', e3.accepted === false);
  const { queue: q2, intent } = dequeueHighestPriorityIntent(q, 1);
  push('dequeue_prio', 'dequeues highest priority', intent?.ruleId === 'r2' && intent.status === 'running');
  const q3 = completeAutomationIntent(q2, intent!.id, 'completed');
  push('complete', 'marks intent completed', q3.items.find(i => i.id === intent!.id)?.status === 'completed');

  return results;
}


// --- source: day-boundary-compute.ts ---

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


// --- source: scenario-runner.ts ---
  completeAutomationIntent,
  createEmptyAutomationIntentQueue,
  dequeueHighestPriorityIntent,
  enqueueAutomationIntent,
  intentFromSelectedRule,
} from './automation-intent-queue.js';
  createDefaultO10TurnComputeState,
  type O10TurnComputeInput,
} from './turn-compute-engine.js';

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


// --- source: automation-soak-projection.ts ---
  createDefaultO10TurnComputeState,
  type O10TurnComputeInput,
} from './turn-compute-engine.js';

export interface O10SoakProjectionOptions {
  turnCount: number;
  idleMsStart?: number;
  idleMsStep?: number;
  humanCommittedEvery?: number;
}

export interface O10SoakProjectionResult {
  turnCount: number;
  bandCounts: Record<IdleAutomationBand, number>;
  stewardTickTurns: number;
  blockedEndTurns: number;
  blockedAdvanceDays: number;
  digestChain: string;
  lastTurnKey: string;
}

/** Synthetic multi-turn soak: ramps idle telemetry and aggregates band / gate metrics. */
export function projectO10IdleAutomationSoak(
  baseInput: O10TurnComputeInput,
  options: O10SoakProjectionOptions
): O10SoakProjectionResult {
  const turnCount = Math.max(1, Math.min(options.turnCount, 64));
  const idleMsStart = options.idleMsStart ?? 30_000;
  const idleMsStep = options.idleMsStep ?? 25_000;
  const humanEvery = options.humanCommittedEvery ?? 0;

  const bandCounts: Record<IdleAutomationBand, number> = {
    active: 0,
    drifting: 0,
    idle: 0,
    deep_idle: 0,
    steward_tick: 0,
  };

  let state = createDefaultO10TurnComputeState();
  let stewardTickTurns = 0;
  let blockedEndTurns = 0;
  let blockedAdvanceDays = 0;
  const digests: string[] = [];

  for (let i = 1; i <= turnCount; i++) {
    const idleMs = idleMsStart + idleMsStep * (i - 1);
    const consecutiveIdleTurns = humanEvery > 0 && i % humanEvery === 0 ? 0 : i - 1;
    const input: O10TurnComputeInput = {
      ...baseInput,
      turn: i,
      day: baseInput.day + Math.floor((i - 1) / 8),
      humanCommittedThisTurn: humanEvery > 0 && i % humanEvery === 0,
      msSinceLastHumanInput: idleMs,
      msSinceLastCommittedAction: idleMs,
      conditionalCtx: {
        ...baseInput.conditionalCtx,
        currentTurn: i,
        currentDay: baseInput.conditionalCtx.currentDay + Math.floor((i - 1) / 8),
        consecutiveIdleTurns,
      },
    };

    const band = classifyIdleAutomationBand({
      idleMs,
      consecutiveIdleTurns,
      stewardEnabled: true,
      playerPaused: false,
    });
    bandCounts[band] += 1;

    const turn = simulateO10IdleAutomationTurn(input, state);
    digests.push(turn.digest);
    state = turn.state;

    if (turn.effects.stewardStep?.automationPath === 'v94_idle_steward_national_tick') {
      stewardTickTurns += 1;
    }
    if (!turn.effects.endTurnAllowed) blockedEndTurns += 1;
    if (!turn.effects.advanceDayAllowed) blockedAdvanceDays += 1;
  }

  let chain = 2166136261;
  const joined = digests.join('|');
  for (let i = 0; i < joined.length; i++) {
    chain ^= joined.charCodeAt(i);
    chain = Math.imul(chain, 16777619);
  }

  return {
    turnCount,
    bandCounts,
    stewardTickTurns,
    blockedEndTurns,
    blockedAdvanceDays,
    digestChain: `o10soak_${(chain >>> 0).toString(16).padStart(8, '0')}`,
    lastTurnKey: state.lastTurnKey,
  };
}

export function runO10Agent20SoakProjectionSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const base: O10TurnComputeInput = {
    turn: 0,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 0,
    msSinceLastCommittedAction: 0,
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
    automationRules: [],
    conditionalCtx: {
      actor: { money: 500, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 1,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      settingsFlags: {},
    },
  };

  const soak = projectO10IdleAutomationSoak(base, { turnCount: 6, idleMsStart: 50_000, idleMsStep: 40_000 });
  const bandTotal = Object.values(soak.bandCounts).reduce((a, b) => a + b, 0);
  push('soak_turns', 'soak runs requested turns', soak.turnCount === 6 && bandTotal === 6);
  push('soak_digest', 'soak yields stable chain id', soak.digestChain.startsWith('o10soak_'));
  push(
    'soak_deep_bands',
    'ramping idle reaches deep bands',
    soak.bandCounts.steward_tick + soak.bandCounts.deep_idle >= 2
  );

  const reset = projectO10IdleAutomationSoak(base, {
    turnCount: 4,
    idleMsStart: 10_000,
    idleMsStep: 0,
    humanCommittedEvery: 2,
  });
  push(
    'soak_human_reset',
    'periodic human commit keeps bands shallow',
    reset.bandCounts.active + reset.bandCounts.drifting >= 2
  );

  return results;
}


// --- source: automation-replay-tape.ts ---

export interface O10AutomationReplayFrame {
  label: string;
  turn: number;
  day: number;
  digest: string;
}

export interface O10AutomationReplayTape {
  schema: '10m.agent20.replay-tape.v1';
  frameCount: number;
  frames: O10AutomationReplayFrame[];
  violationCount: number;
}

export function buildAutomationReplayTapeFromScenario(
  baseInput: O10TurnComputeInput,
  steps: O10ScenarioTurnSpec[],
  options?: Parameters<typeof runO10IdleAutomationScenario>[2]
): O10AutomationReplayTape {
  const run = runO10IdleAutomationScenario(baseInput, steps, options);
  const frames: O10AutomationReplayFrame[] = run.labels.map((label, idx) => ({
    label,
    turn: steps[idx]?.patch.turn ?? baseInput.turn,
    day: steps[idx]?.patch.day ?? baseInput.day,
    digest: run.digests[idx] ?? '',
  }));
  return {
    schema: '10m.agent20.replay-tape.v1',
    frameCount: frames.length,
    frames,
    violationCount: run.violations.length,
  };
}

export function verifyAutomationReplayTapeDeterminism(
  baseInput: O10TurnComputeInput,
  steps: O10ScenarioTurnSpec[],
  tape: O10AutomationReplayTape,
  options?: Parameters<typeof runO10IdleAutomationScenario>[2]
): { ok: boolean; mismatches: string[] } {
  const rerun = buildAutomationReplayTapeFromScenario(baseInput, steps, options);
  const mismatches: string[] = [];
  if (rerun.frameCount !== tape.frameCount) {
    mismatches.push(`frame_count:${rerun.frameCount}!=${tape.frameCount}`);
  }
  const n = Math.min(rerun.frames.length, tape.frames.length);
  for (let i = 0; i < n; i++) {
    const a = rerun.frames[i];
    const b = tape.frames[i];
    if (a.digest !== b.digest) {
      mismatches.push(`${b.label}:digest`);
    }
  }
  if (rerun.violationCount !== tape.violationCount) {
    mismatches.push(`violations:${rerun.violationCount}!=${tape.violationCount}`);
  }
  return { ok: mismatches.length === 0, mismatches };
}

export function summarizeAutomationReplayTape(tape: O10AutomationReplayTape): string {
  const uniq = new Set(tape.frames.map(f => f.digest)).size;
  return `replay ${tape.frameCount} frames, ${uniq} unique digests, ${tape.violationCount} violations`;
}

export function runO10Agent20ReplayTapeSelfTests(): O10SelfTestResult[] {
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

  const steps: O10ScenarioTurnSpec[] = [
    { label: 'r1', patch: { turn: 1, day: 1 } },
    { label: 'r2', patch: { turn: 2, day: 1 } },
  ];

  const tape = buildAutomationReplayTapeFromScenario(base, steps, { queueIntents: true });
  push('tape_frames', 'tape captures scenario frames', tape.frameCount === 2 && tape.frames[0].digest.startsWith('o10tc_'));
  const verify = verifyAutomationReplayTapeDeterminism(base, steps, tape, { queueIntents: true });
  push('tape_deterministic', 'scenario replay is deterministic', verify.ok);
  const summary = summarizeAutomationReplayTape(tape);
  push('tape_summary', 'summary includes frame count', summary.includes('2 frames'));

  return results;
}


// --- source: intent-schedule-coordinator.ts ---
  completeAutomationIntent,
  createEmptyAutomationIntentQueue,
  dequeueHighestPriorityIntent,
  enqueueAutomationIntent,
  intentFromSelectedRule,
} from './automation-intent-queue.js';
  O10AutomationIntentQueue,
  O10SelfTestResult,
  PortableHumanAutomationRule,
} from './types.js';

export interface O10IntentScheduleDecision {
  action: 'execute_now' | 'defer' | 'drop';
  reason: string;
  intentId?: string;
}

export interface O10IntentScheduleResult {
  queue: O10AutomationIntentQueue;
  decision: O10IntentScheduleDecision;
}

/** Gate intent dequeue against rule limits; defer when cooldown or caps block execution. */
export function coordinateAutomationIntentSchedule(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number
): O10IntentScheduleResult {
  const elig = evaluateHumanAutomationExecutionEligibility(
    rule.enabled,
    rule.authorityDisabled,
    rule.activeFromDay,
    rule.activeUntilDay,
    rule.limits,
    rule.safety,
    rule.stats,
    day,
    turn
  );
  if (!elig.eligible) {
    return {
      queue,
      decision: { action: 'defer', reason: elig.reason },
    };
  }
  const { queue: q2, intent } = dequeueHighestPriorityIntent(queue, turn);
  if (!intent || intent.ruleId !== rule.id) {
    return {
      queue,
      decision: { action: 'drop', reason: intent ? 'Head intent rule mismatch.' : 'No queued intent.' },
    };
  }
  return {
    queue: completeAutomationIntent(q2, intent.id, 'completed'),
    decision: { action: 'execute_now', reason: '', intentId: intent.id },
  };
}

/** Enqueue selected rule when eligible; otherwise surface defer reason without mutating queue. */
export function scheduleAutomationIntentFromRule(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  label = 'sched'
): O10IntentScheduleResult {
  const elig = evaluateHumanAutomationExecutionEligibility(
    rule.enabled,
    rule.authorityDisabled,
    rule.activeFromDay,
    rule.activeUntilDay,
    rule.limits,
    rule.safety,
    rule.stats,
    day,
    turn
  );
  if (!elig.eligible) {
    return { queue, decision: { action: 'defer', reason: elig.reason } };
  }
  const enq = enqueueAutomationIntent(queue, intentFromSelectedRule(rule, turn, day, label));
  if (!enq.accepted) {
    return { queue, decision: { action: 'drop', reason: enq.reason || 'Enqueue rejected.' } };
  }
  return {
    queue: enq.queue,
    decision: { action: 'execute_now', reason: 'Intent enqueued for immediate dequeue.' },
  };
}

function sampleRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'r1',
    name: 'Sample',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 2, maxRunsTotal: null, cooldownTurns: 2 },
    safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
    stats: {
      totalRuns: 0,
      totalSuccesses: 0,
      totalSkipped: 0,
      totalFailed: 0,
      lastRunDay: 1,
      lastRunTurn: 5,
      runsToday: 0,
      runsTodayDay: 1,
      consecutiveNoChangeCount: 0,
      lastResultSummary: '',
    },
    actionType: 'wait',
    resolvedCost: 0,
    spendableCash: 100,
    ...overrides,
  };
}

export function runO10Agent20IntentScheduleSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const rule = sampleRule({ stats: { ...sampleRule().stats, lastRunTurn: null, lastRunDay: null } });
  let q = createEmptyAutomationIntentQueue(4);
  const sched = scheduleAutomationIntentFromRule(q, rule, 6, 1);
  q = sched.queue;
  push('sched_enqueue', 'eligible rule enqueues intent', sched.decision.action === 'execute_now' && q.items.length === 1);

  const cooldownRule = sampleRule({
    stats: {
      ...sampleRule().stats,
      lastRunTurn: 8,
      runsToday: 0,
    },
  });
  const defer = scheduleAutomationIntentFromRule(q, cooldownRule, 9, 1);
  push('sched_defer_cooldown', 'cooldown defers scheduling', defer.decision.action === 'defer');

  q = enqueueAutomationIntent(q, intentFromSelectedRule(rule, 10, 1, 'x')).queue;
  const exec = coordinateAutomationIntentSchedule(q, rule, 10, 1);
  push(
    'sched_execute',
    'coordinate completes head intent when eligible',
    exec.decision.action === 'execute_now' &&
      exec.queue.items.find(i => i.id === exec.decision.intentId)?.status === 'completed'
  );

  const capRule = sampleRule({
    limits: { maxRunsPerDay: 1, maxRunsTotal: null, cooldownTurns: 0 },
    stats: { ...sampleRule().stats, runsToday: 1, runsTodayDay: 2 },
  });
  const cap = coordinateAutomationIntentSchedule(
    enqueueAutomationIntent(createEmptyAutomationIntentQueue(), intentFromSelectedRule(capRule, 3, 2)).queue,
    capRule,
    3,
    2
  );
  push('sched_cap_defer', 'daily cap defers execution', cap.decision.action === 'defer');

  return results;
}


// --- source: automation-idle-escalation.ts ---

export type O10IdleEscalationTier = 0 | 1 | 2 | 3;

export interface O10IdleEscalationInput {
  idleMs: number;
  consecutiveIdleTurns: number;
  stewardEnabled?: boolean;
  playerPaused?: boolean;
  queuedIntentCount?: number;
  blockedEndTurnStreak?: number;
}

export interface O10IdleEscalationResult {
  band: IdleAutomationBand;
  tier: O10IdleEscalationTier;
  throttleHumanAutomation: boolean;
  stewardOnly: boolean;
  blockNewIntents: boolean;
  reason: string;
}

const TIER_REASON: Record<O10IdleEscalationTier, string> = {
  0: 'nominal',
  1: 'idle_watch',
  2: 'deep_idle_pressure',
  3: 'steward_or_queue_saturation',
};

/** Map idle telemetry + queue pressure to a discrete escalation tier for automation policy. */
export function evaluateIdleAutomationEscalation(input: O10IdleEscalationInput): O10IdleEscalationResult {
  const band = classifyIdleAutomationBand({
    idleMs: input.idleMs,
    consecutiveIdleTurns: input.consecutiveIdleTurns,
    stewardEnabled: input.stewardEnabled ?? true,
    playerPaused: input.playerPaused ?? false,
  });

  const queued = Math.max(0, input.queuedIntentCount ?? 0);
  const blockedStreak = Math.max(0, input.blockedEndTurnStreak ?? 0);

  let tier: O10IdleEscalationTier = 0;
  if (band === 'steward_tick' || queued >= 6 || blockedStreak >= 3) tier = 3;
  else if (band === 'deep_idle' || queued >= 4 || blockedStreak >= 2) tier = 2;
  else if (band === 'idle' || band === 'drifting' || queued >= 2) tier = 1;

  return {
    band,
    tier,
    throttleHumanAutomation: tier >= 2,
    stewardOnly: tier >= 3 && band === 'steward_tick',
    blockNewIntents: tier >= 3 && queued >= 4,
    reason: TIER_REASON[tier],
  };
}

export function mergeIdleEscalationTier(a: O10IdleEscalationTier, b: O10IdleEscalationTier): O10IdleEscalationTier {
  return (Math.max(a, b) as O10IdleEscalationTier);
}

export function formatIdleEscalationSummary(result: O10IdleEscalationResult): string {
  return `escalation t${result.tier} band=${result.band} ${result.reason}`;
}

export function runO10Agent20IdleEscalationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const nominal = evaluateIdleAutomationEscalation({
    idleMs: 1000,
    consecutiveIdleTurns: 0,
  });
  push('esc_nominal', 'active band stays tier 0', nominal.tier === 0 && !nominal.throttleHumanAutomation);

  const deep = evaluateIdleAutomationEscalation({
    idleMs: 600_000,
    consecutiveIdleTurns: 6,
  });
  push('esc_deep', 'deep idle reaches tier 2+', deep.tier >= 2 && deep.throttleHumanAutomation);

  const steward = evaluateIdleAutomationEscalation({
    idleMs: 900_000,
    consecutiveIdleTurns: 12,
    queuedIntentCount: 2,
  });
  push(
    'esc_steward',
    'steward tick tier 3 steward-only',
    steward.tier === 3 && steward.stewardOnly && steward.band === 'steward_tick'
  );

  push(
    'esc_merge',
    'merge picks higher tier',
    mergeIdleEscalationTier(1, 3) === 3 && mergeIdleEscalationTier(0, 2) === 2
  );

  return results;
}


// --- source: automation-soak-replay-attestation.ts ---
  buildAutomationReplayTapeFromScenario,
  type O10AutomationReplayTape,
} from './automation-replay-tape.js';

export interface O10SoakReplayAttestation {
  schema: '10m.agent20.soak-replay-attestation.v1';
  soakTurnCount: number;
  replayFrameCount: number;
  digestChainMatch: boolean;
  violationAligned: boolean;
  ok: boolean;
  notes: string[];
}

function fnv1aHex(text: string): string {
  let chain = 2166136261;
  for (let i = 0; i < text.length; i++) {
    chain ^= text.charCodeAt(i);
    chain = Math.imul(chain, 16777619);
  }
  return `o10soak_${(chain >>> 0).toString(16).padStart(8, '0')}`;
}

/** Compare soak projection metrics against a scenario replay tape built from the same turn count. */
export function attestSoakAgainstReplayTape(
  soak: O10SoakProjectionResult,
  tape: O10AutomationReplayTape
): O10SoakReplayAttestation {
  const notes: string[] = [];
  const digestChainMatch = tape.frameCount > 0 && soak.turnCount === tape.frameCount;
  if (!digestChainMatch) {
    notes.push(`turn_mismatch:${soak.turnCount}!=${tape.frameCount}`);
  }

  const replayChain = fnv1aHex(tape.frames.map(f => f.digest).join('|'));
  if (replayChain !== soak.digestChain) {
    notes.push('digest_chain_mismatch');
  }

  const violationAligned = soak.blockedEndTurns >= 0 && tape.violationCount >= 0;
  if (tape.violationCount > soak.blockedEndTurns + soak.blockedAdvanceDays + 2) {
    notes.push('violation_skew');
  }

  const ok = digestChainMatch && replayChain === soak.digestChain && violationAligned && notes.length === 0;

  return {
    schema: '10m.agent20.soak-replay-attestation.v1',
    soakTurnCount: soak.turnCount,
    replayFrameCount: tape.frameCount,
    digestChainMatch: replayChain === soak.digestChain,
    violationAligned,
    ok,
    notes,
  };
}

export function buildSoakReplayAttestationFromInput(
  baseInput: O10TurnComputeInput,
  turnCount: number,
  soakOptions?: Omit<Parameters<typeof projectO10IdleAutomationSoak>[1], 'turnCount'>,
  scenarioOptions?: O10ScenarioOptions
): O10SoakReplayAttestation {
  const soak = projectO10IdleAutomationSoak(baseInput, {
    turnCount,
    ...soakOptions,
  });
  const steps: O10ScenarioTurnSpec[] = [];
  for (let i = 1; i <= turnCount; i++) {
    const idleMs = (soakOptions?.idleMsStart ?? 30_000) + (soakOptions?.idleMsStep ?? 25_000) * (i - 1);
    const humanEvery = soakOptions?.humanCommittedEvery ?? 0;
    steps.push({
      label: `s${i}`,
      patch: {
        turn: i,
        day: baseInput.day + Math.floor((i - 1) / 8),
        humanCommittedThisTurn: humanEvery > 0 && i % humanEvery === 0,
        msSinceLastHumanInput: idleMs,
        msSinceLastCommittedAction: idleMs,
      },
    });
  }
  const tape = buildAutomationReplayTapeFromScenario(baseInput, steps, scenarioOptions);
  return attestSoakAgainstReplayTape(soak, tape);
}

export function runO10Agent20SoakReplayAttestationSelfTests(): O10SelfTestResult[] {
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
    automationRules: [],
    conditionalCtx: {
      actor: { money: 500, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 1,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      settingsFlags: {},
    },
  };

  const att = buildSoakReplayAttestationFromInput(base, 5, {
    idleMsStart: 20_000,
    idleMsStep: 15_000,
  });
  push('att_ok', 'soak and replay chains align', att.ok && att.schema.endsWith('.v1'));
  push('att_frames', 'frame counts match soak turns', att.soakTurnCount === 5 && att.replayFrameCount === 5);

  const soakOnly = projectO10IdleAutomationSoak(base, { turnCount: 3, idleMsStart: 10_000, idleMsStep: 0 });
  const badTape = buildAutomationReplayTapeFromScenario(base, [{ label: 'x', patch: { turn: 1 } }]);
  const fail = attestSoakAgainstReplayTape(soakOnly, badTape);
  push('att_fail_mismatch', 'detects frame count mismatch', !fail.ok && fail.notes.length > 0);

  return results;
}


// --- source: automation-intent-backpressure.ts ---
  evaluateIdleAutomationEscalation,
  type O10IdleEscalationResult,
  type O10IdleEscalationTier,
} from './automation-idle-escalation.js';
  coordinateAutomationIntentSchedule,
  scheduleAutomationIntentFromRule,
  type O10IntentScheduleResult,
} from './intent-schedule-coordinator.js';
  createEmptyAutomationIntentQueue,
} from './automation-intent-queue.js';

export interface O10IntentBackpressurePolicy {
  tier: O10IdleEscalationTier;
  effectiveMaxDepth: number;
  deferLowPriorityBelow: number;
}

export function resolveIntentBackpressurePolicy(
  escalation: O10IdleEscalationResult,
  baseMaxDepth: number
): O10IntentBackpressurePolicy {
  const shrink = escalation.tier >= 3 ? 3 : escalation.tier >= 2 ? 2 : escalation.tier >= 1 ? 1 : 0;
  const effectiveMaxDepth = Math.max(1, baseMaxDepth - shrink);
  const deferLowPriorityBelow = escalation.tier >= 2 ? 4 : escalation.tier >= 1 ? 2 : 0;
  return { tier: escalation.tier, effectiveMaxDepth, deferLowPriorityBelow };
}

export function applyQueueDepthBackpressure(
  queue: O10AutomationIntentQueue,
  policy: O10IntentBackpressurePolicy
): O10AutomationIntentQueue {
  const active = queue.items.filter(i => i.status === 'queued' || i.status === 'running');
  if (active.length <= policy.effectiveMaxDepth) return queue;
  const overflow = active.length - policy.effectiveMaxDepth;
  let dropped = 0;
  const items = [...queue.items].reverse().map((item) => {
    if (dropped >= overflow) return item;
    if (item.status !== 'queued' || item.priority >= 8) return item;
    dropped += 1;
    return { ...item, status: 'cancelled' as const, reason: 'backpressure_drop' };
  });
  return { ...queue, maxDepth: policy.effectiveMaxDepth, items: items.reverse() };
}

/** Schedule or coordinate intents under idle escalation backpressure. */
export function scheduleWithIdleBackpressure(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  escalationInput: Parameters<typeof evaluateIdleAutomationEscalation>[0],
  label = 'bp'
): { queue: O10AutomationIntentQueue; schedule: O10IntentScheduleResult; policy: O10IntentBackpressurePolicy } {
  const escalation = evaluateIdleAutomationEscalation(escalationInput);
  const policy = resolveIntentBackpressurePolicy(escalation, queue.maxDepth);
  let q = applyQueueDepthBackpressure({ ...queue, maxDepth: policy.effectiveMaxDepth }, policy);

  if (escalation.blockNewIntents) {
    return {
      queue: q,
      policy,
      schedule: { queue: q, decision: { action: 'defer', reason: 'Idle escalation blocks new intents.' } },
    };
  }

  if (policy.deferLowPriorityBelow > 0 && rule.priority < policy.deferLowPriorityBelow) {
    return {
      queue: q,
      policy,
      schedule: { queue: q, decision: { action: 'defer', reason: 'Low priority deferred under backpressure.' } },
    };
  }

  const schedule = scheduleAutomationIntentFromRule(q, rule, turn, day, label);
  q = schedule.queue;
  return { queue: q, schedule, policy };
}

export function coordinateWithIdleBackpressure(
  queue: O10AutomationIntentQueue,
  rule: PortableHumanAutomationRule,
  turn: number,
  day: number,
  escalationInput: Parameters<typeof evaluateIdleAutomationEscalation>[0]
): { queue: O10AutomationIntentQueue; schedule: O10IntentScheduleResult; policy: O10IntentBackpressurePolicy } {
  const escalation = evaluateIdleAutomationEscalation(escalationInput);
  const policy = resolveIntentBackpressurePolicy(escalation, queue.maxDepth);
  let q = applyQueueDepthBackpressure({ ...queue, maxDepth: policy.effectiveMaxDepth }, policy);
  if (escalation.throttleHumanAutomation && rule.priority < 5) {
    return {
      queue: q,
      policy,
      schedule: { queue: q, decision: { action: 'defer', reason: 'Throttled under idle escalation.' } },
    };
  }
  const schedule = coordinateAutomationIntentSchedule(q, rule, turn, day);
  return { queue: schedule.queue, schedule, policy };
}

function sampleRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'bp1',
    name: 'Backpressure sample',
    enabled: true,
    authorityDisabled: false,
    priority: 3,
    activeFromDay: 0,
    activeUntilDay: 99,
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
    spendableCash: 100,
    ...overrides,
  };
}

export function runO10Agent20IntentBackpressureSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const rule = sampleRule({ priority: 6, stats: { ...sampleRule().stats } });
  const nominal = scheduleWithIdleBackpressure(
    createEmptyAutomationIntentQueue(8),
    rule,
    2,
    1,
    { idleMs: 500, consecutiveIdleTurns: 0 }
  );
  push('bp_schedule_nominal', 'nominal tier schedules intent', nominal.schedule.decision.action === 'execute_now');

  const lowPri = scheduleWithIdleBackpressure(
    createEmptyAutomationIntentQueue(8),
    sampleRule({ priority: 1 }),
    3,
    1,
    { idleMs: 400_000, consecutiveIdleTurns: 4, queuedIntentCount: 2 }
  );
  push('bp_defer_low', 'tier 2 defers low priority enqueue', lowPri.schedule.decision.action === 'defer');

  const saturated = scheduleWithIdleBackpressure(
    createEmptyAutomationIntentQueue(8),
    sampleRule({ priority: 9 }),
    4,
    1,
    { idleMs: 900_000, consecutiveIdleTurns: 10, queuedIntentCount: 6 }
  );
  push(
    'bp_block_saturated',
    'tier 3 saturation blocks new intents',
    saturated.schedule.decision.action === 'defer' && saturated.policy.effectiveMaxDepth <= 5
  );

  const policy = resolveIntentBackpressurePolicy(
    evaluateIdleAutomationEscalation({ idleMs: 600_000, consecutiveIdleTurns: 6 }),
    8
  );
  push('bp_policy_shrink', 'steward band shrinks effective depth', policy.effectiveMaxDepth === 5 && policy.tier === 3);

  return results;
}


// --- source: automation-idle-deescalation.ts ---
  evaluateIdleAutomationEscalation,
  type O10IdleEscalationResult,
  type O10IdleEscalationTier,
} from './automation-idle-escalation.js';

export interface O10IdleDeescalationState {
  latchedTier: O10IdleEscalationTier;
  turnsAtTier: number;
}

export function createDefaultIdleDeescalationState(): O10IdleDeescalationState {
  return { latchedTier: 0, turnsAtTier: 0 };
}

/**
 * Reconcile latched escalation tier with fresh idle telemetry.
 * Human commit snaps to tier 0; easing pressure drops at most one tier per turn (hysteresis).
 */
export function stepIdleDeescalation(
  state: O10IdleDeescalationState,
  measured: O10IdleEscalationResult,
  humanCommittedThisTurn: boolean
): O10IdleDeescalationState {
  if (humanCommittedThisTurn) {
    return { latchedTier: 0, turnsAtTier: 0 };
  }

  const { latchedTier } = state;
  let next: O10IdleEscalationTier = latchedTier;

  if (measured.tier > latchedTier) {
    next = measured.tier;
  } else if (measured.tier < latchedTier) {
    next = Math.max(measured.tier, latchedTier - 1) as O10IdleEscalationTier;
  }

  const turnsAtTier = next === latchedTier ? state.turnsAtTier + 1 : 1;
  return { latchedTier: next, turnsAtTier };
}

/** Measure escalation from telemetry then apply hysteresis de-escalation latch. */
export function evaluateIdleEscalationWithDeescalation(
  escalationInput: Parameters<typeof evaluateIdleAutomationEscalation>[0],
  state: O10IdleDeescalationState,
  humanCommittedThisTurn: boolean
): { state: O10IdleDeescalationState; measured: O10IdleEscalationResult; effectiveTier: O10IdleEscalationTier } {
  const measured = evaluateIdleAutomationEscalation(escalationInput);
  const nextState = stepIdleDeescalation(state, measured, humanCommittedThisTurn);
  return { state: nextState, measured, effectiveTier: nextState.latchedTier };
}

export function formatIdleDeescalationSummary(state: O10IdleDeescalationState): string {
  return `idle_latch t${state.latchedTier} for ${state.turnsAtTier} turn(s)`;
}

export function runO10Agent20IdleDeescalationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const humanReset = stepIdleDeescalation(
    { latchedTier: 3, turnsAtTier: 4 },
    evaluateIdleAutomationEscalation({ idleMs: 900_000, consecutiveIdleTurns: 12 }),
    true
  );
  push('deesc_human', 'human commit resets latch to tier 0', humanReset.latchedTier === 0);

  const measuredLow = evaluateIdleAutomationEscalation({ idleMs: 1000, consecutiveIdleTurns: 0 });
  const oneStep = stepIdleDeescalation(
    { latchedTier: 3, turnsAtTier: 2 },
    measuredLow,
    false
  );
  push('deesc_hysteresis', 'easing drops at most one tier per turn', oneStep.latchedTier === 2);

  const measuredHigh = evaluateIdleAutomationEscalation({
    idleMs: 900_000,
    consecutiveIdleTurns: 10,
    queuedIntentCount: 6,
  });
  const ramp = stepIdleDeescalation({ latchedTier: 1, turnsAtTier: 1 }, measuredHigh, false);
  push('deesc_ramp_up', 'pressure can ramp latch upward immediately', ramp.latchedTier === 3);

  const combo = evaluateIdleEscalationWithDeescalation(
    { idleMs: 500, consecutiveIdleTurns: 0 },
    { latchedTier: 2, turnsAtTier: 3 },
    false
  );
  push(
    'deesc_combo',
    'combo returns effective latched tier',
    combo.effectiveTier === 1 && combo.state.turnsAtTier === 1
  );

  return results;
}


// --- source: automation-backpressure-telemetry.ts ---

export interface O10BackpressureTelemetrySlice {
  turn: number;
  day: number;
  tier: O10IdleEscalationTier;
  effectiveMaxDepth: number;
  deferLowPriorityBelow: number;
  decision: O10IntentScheduleDecision['action'];
  droppedLowPriority: number;
}

export interface O10BackpressureTelemetryDigest {
  schema: '10m.agent20.backpressure-telemetry.v1';
  sliceCount: number;
  deferCount: number;
  executeCount: number;
  totalDropped: number;
  peakTier: O10IdleEscalationTier;
  summaryLine: string;
}

export function recordBackpressureTelemetrySlice(
  slices: O10BackpressureTelemetrySlice[],
  slice: O10BackpressureTelemetrySlice
): O10BackpressureTelemetrySlice[] {
  const next = [...slices, slice];
  if (next.length > 64) return next.slice(next.length - 64);
  return next;
}

export function buildBackpressureTelemetryDigest(
  slices: O10BackpressureTelemetrySlice[]
): O10BackpressureTelemetryDigest {
  let deferCount = 0;
  let executeCount = 0;
  let totalDropped = 0;
  let peakTier: O10IdleEscalationTier = 0;
  for (const s of slices) {
    if (s.decision === 'defer') deferCount += 1;
    if (s.decision === 'execute_now') executeCount += 1;
    totalDropped += s.droppedLowPriority;
    if (s.tier > peakTier) peakTier = s.tier;
  }
  const summaryLine = `bp telo slices=${slices.length} defer=${deferCount} exec=${executeCount} drop=${totalDropped} peak=t${peakTier}`;
  return {
    schema: '10m.agent20.backpressure-telemetry.v1',
    sliceCount: slices.length,
    deferCount,
    executeCount,
    totalDropped,
    peakTier,
    summaryLine,
  };
}

export function sliceFromBackpressureTurn(
  turn: number,
  day: number,
  policy: O10IntentBackpressurePolicy,
  decision: O10IntentScheduleDecision,
  droppedLowPriority: number
): O10BackpressureTelemetrySlice {
  return {
    turn,
    day,
    tier: policy.tier,
    effectiveMaxDepth: policy.effectiveMaxDepth,
    deferLowPriorityBelow: policy.deferLowPriorityBelow,
    decision: decision.action,
    droppedLowPriority,
  };
}

export function runO10Agent20BackpressureTelemetrySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let slices: O10BackpressureTelemetrySlice[] = [];
  slices = recordBackpressureTelemetrySlice(slices, {
    turn: 1,
    day: 1,
    tier: 2,
    effectiveMaxDepth: 6,
    deferLowPriorityBelow: 4,
    decision: 'defer',
    droppedLowPriority: 0,
  });
  slices = recordBackpressureTelemetrySlice(slices, {
    turn: 2,
    day: 1,
    tier: 0,
    effectiveMaxDepth: 8,
    deferLowPriorityBelow: 0,
    decision: 'execute_now',
    droppedLowPriority: 1,
  });
  const digest = buildBackpressureTelemetryDigest(slices);
  push(
    'bp_telo_digest',
    'digest aggregates defer/exec/drops',
    digest.deferCount === 1 && digest.executeCount === 1 && digest.totalDropped === 1 && digest.peakTier === 2
  );

  let ring: O10BackpressureTelemetrySlice[] = [];
  for (let i = 0; i < 70; i++) {
    ring = recordBackpressureTelemetrySlice(
      ring,
      sliceFromBackpressureTurn(
        i,
        1,
        { tier: 1, effectiveMaxDepth: 7, deferLowPriorityBelow: 2 },
        { action: 'defer', reason: 'x' },
        0
      )
    );
  }
  push('bp_telo_cap', 'ring retains last 64 slices', ring.length === 64);

  push(
    'bp_telo_schema',
    'schema marker present',
    digest.schema === '10m.agent20.backpressure-telemetry.v1' && digest.summaryLine.includes('peak=t2')
  );

  return results;
}


// --- source: automation-idle-ops-pipeline.ts ---
  buildBackpressureTelemetryDigest,
  recordBackpressureTelemetrySlice,
  sliceFromBackpressureTurn,
  type O10BackpressureTelemetrySlice,
} from './automation-backpressure-telemetry.js';
  evaluateIdleEscalationWithDeescalation,
  type O10IdleDeescalationState,
} from './automation-idle-deescalation.js';

export interface O10IdleOpsTurnInput {
  queue: O10AutomationIntentQueue;
  rule: PortableHumanAutomationRule;
  turn: number;
  day: number;
  deescalationState: O10IdleDeescalationState;
  telemetry: O10BackpressureTelemetrySlice[];
  humanCommittedThisTurn: boolean;
  escalationInput: Parameters<typeof scheduleWithIdleBackpressure>[4];
}

export interface O10IdleOpsTurnResult {
  queue: O10AutomationIntentQueue;
  deescalationState: O10IdleDeescalationState;
  telemetry: O10BackpressureTelemetrySlice[];
  effectiveTier: number;
  scheduleAction: string;
  digestSummary: string;
}

function countActiveQueued(queue: O10AutomationIntentQueue): number {
  return queue.items.filter(i => i.status === 'queued' || i.status === 'running').length;
}

/** One automation ops turn: de-escalation latch, backpressure schedule, telemetry ring. */
export function runIdleAutomationOpsTurn(input: O10IdleOpsTurnInput): O10IdleOpsTurnResult {
  const before = countActiveQueued(input.queue);
  const { state, effectiveTier } = evaluateIdleEscalationWithDeescalation(
    input.escalationInput,
    input.deescalationState,
    input.humanCommittedThisTurn
  );

  const mergedEscalation = {
    ...input.escalationInput,
    blockedEndTurnStreak: Math.max(input.escalationInput.blockedEndTurnStreak ?? 0, effectiveTier >= 3 ? 2 : 0),
  };

  const { queue, schedule, policy } = scheduleWithIdleBackpressure(
    input.queue,
    input.rule,
    input.turn,
    input.day,
    mergedEscalation,
    `ops${input.turn}`
  );

  const after = countActiveQueued(queue);
  const droppedLowPriority = Math.max(0, before - after - (schedule.decision.action === 'execute_now' ? 1 : 0));

  const slice = sliceFromBackpressureTurn(input.turn, input.day, policy, schedule.decision, droppedLowPriority);
  const telemetry = recordBackpressureTelemetrySlice(input.telemetry, slice);
  const digest = buildBackpressureTelemetryDigest(telemetry);

  return {
    queue,
    deescalationState: state,
    telemetry,
    effectiveTier,
    scheduleAction: schedule.decision.action,
    digestSummary: digest.summaryLine,
  };
}

export function buildIdleOpsPipelineReportMarkdown(telemetry: O10BackpressureTelemetrySlice[]): string {
  const digest = buildBackpressureTelemetryDigest(telemetry);
  return ['## Agent 20 idle ops pipeline', digest.summaryLine, ''].join('\n');
}

function sampleOpsRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'ops1',
    name: 'Ops sample',
    enabled: true,
    authorityDisabled: false,
    priority: 6,
    activeFromDay: 0,
    activeUntilDay: 99,
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
    spendableCash: 100,
    ...overrides,
  };
}

export function runO10Agent20IdleOpsPipelineSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const turn1 = runIdleAutomationOpsTurn({
    queue: createEmptyAutomationIntentQueue(8),
    rule: sampleOpsRule(),
    turn: 1,
    day: 1,
    deescalationState: { latchedTier: 0, turnsAtTier: 0 },
    telemetry: [],
    humanCommittedThisTurn: false,
    escalationInput: { idleMs: 500, consecutiveIdleTurns: 0 },
  });
  push('ops_exec_nominal', 'nominal turn schedules execute_now', turn1.scheduleAction === 'execute_now');

  const turn2 = runIdleAutomationOpsTurn({
    queue: turn1.queue,
    rule: sampleOpsRule({ priority: 1 }),
    turn: 2,
    day: 1,
    deescalationState: turn1.deescalationState,
    telemetry: turn1.telemetry,
    humanCommittedThisTurn: false,
    escalationInput: { idleMs: 500_000, consecutiveIdleTurns: 5, queuedIntentCount: 3 },
  });
  push('ops_defer_pressure', 'pressure defers low priority rule', turn2.scheduleAction === 'defer');

  const turn3 = runIdleAutomationOpsTurn({
    queue: turn2.queue,
    rule: sampleOpsRule(),
    turn: 3,
    day: 1,
    deescalationState: { latchedTier: 3, turnsAtTier: 2 },
    telemetry: turn2.telemetry,
    humanCommittedThisTurn: true,
    escalationInput: { idleMs: 900_000, consecutiveIdleTurns: 12 },
  });
  push('ops_human_reset', 'human commit resets effective tier', turn3.effectiveTier === 0);

  const md = buildIdleOpsPipelineReportMarkdown(turn3.telemetry);
  push('ops_report_md', 'pipeline report markdown header', md.includes('idle ops pipeline') && md.includes('slices='));

  return results;
}


// --- source: automation-idle-ops-window.ts ---
  buildBackpressureTelemetryDigest,
  type O10BackpressureTelemetrySlice,
} from './automation-backpressure-telemetry.js';
  runIdleAutomationOpsTurn,
  type O10IdleOpsTurnResult,
} from './automation-idle-ops-pipeline.js';

export interface O10IdleOpsWindowSpec {
  startTurn: number;
  startDay: number;
  turnCount: number;
  /** 0 = never; N = human commit every N turns (starting when turn % N === 0). */
  humanCommittedEvery: number;
  idleMsStart: number;
  idleMsStep: number;
  consecutiveIdleStart: number;
}

export interface O10IdleOpsWindowSummary {
  schema: '10m.agent20.idle-ops-window.v1';
  turnsRun: number;
  humanCommitCount: number;
  peakEffectiveTier: O10IdleEscalationTier;
  finalScheduleAction: string;
  digestSummary: string;
}

export interface O10IdleOpsWindowResult {
  queue: O10AutomationIntentQueue;
  deescalationState: ReturnType<typeof createDefaultIdleDeescalationState>;
  telemetry: O10BackpressureTelemetrySlice[];
  summary: O10IdleOpsWindowSummary;
  lastTurn: O10IdleOpsTurnResult;
}

function sampleWindowRule(overrides: Partial<PortableHumanAutomationRule> = {}): PortableHumanAutomationRule {
  return {
    id: 'win1',
    name: 'Window sample',
    enabled: true,
    authorityDisabled: false,
    priority: 6,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 20, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
    ...overrides,
  };
}

/** Run a multi-turn idle ops window with ramping idle telemetry and optional human commit cadence. */
export function runIdleAutomationOpsWindow(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  initialQueue = createEmptyAutomationIntentQueue(8)
): O10IdleOpsWindowResult {
  let queue = initialQueue;
  let deescalationState = createDefaultIdleDeescalationState();
  let telemetry: O10BackpressureTelemetrySlice[] = [];
  let humanCommitCount = 0;
  let peakEffectiveTier: O10IdleEscalationTier = 0;
  let lastTurn!: O10IdleOpsTurnResult;

  const turnsRun = Math.max(0, spec.turnCount);
  for (let i = 0; i < turnsRun; i++) {
    const turn = spec.startTurn + i;
    const humanCommittedThisTurn =
      spec.humanCommittedEvery > 0 && turn % spec.humanCommittedEvery === 0;
    if (humanCommittedThisTurn) humanCommitCount += 1;

    const idleMs = spec.idleMsStart + spec.idleMsStep * i;
    const consecutiveIdleTurns = spec.consecutiveIdleStart + i;

    lastTurn = runIdleAutomationOpsTurn({
      queue,
      rule,
      turn,
      day: spec.startDay,
      deescalationState,
      telemetry,
      humanCommittedThisTurn,
      escalationInput: {
        idleMs,
        consecutiveIdleTurns,
        queuedIntentCount: queue.items.filter(x => x.status === 'queued' || x.status === 'running').length,
      },
    });

    queue = lastTurn.queue;
    deescalationState = lastTurn.deescalationState;
    telemetry = lastTurn.telemetry;
    if (lastTurn.effectiveTier > peakEffectiveTier) {
      peakEffectiveTier = lastTurn.effectiveTier as O10IdleEscalationTier;
    }
  }

  const digest = buildBackpressureTelemetryDigest(telemetry);
  const summary: O10IdleOpsWindowSummary = {
    schema: '10m.agent20.idle-ops-window.v1',
    turnsRun,
    humanCommitCount,
    peakEffectiveTier,
    finalScheduleAction: lastTurn?.scheduleAction ?? 'none',
    digestSummary: digest.summaryLine,
  };

  return {
    queue,
    deescalationState,
    telemetry,
    summary,
    lastTurn: lastTurn ?? {
      queue,
      deescalationState,
      telemetry,
      effectiveTier: 0,
      scheduleAction: 'none',
      digestSummary: digest.summaryLine,
    },
  };
}

export function formatIdleOpsWindowSummaryLine(summary: O10IdleOpsWindowSummary): string {
  return `ops_window turns=${summary.turnsRun} human=${summary.humanCommitCount} peak=t${summary.peakEffectiveTier} last=${summary.finalScheduleAction}`;
}

export function runO10Agent20IdleOpsWindowSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const ramp = runIdleAutomationOpsWindow(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 5,
      humanCommittedEvery: 0,
      idleMsStart: 100_000,
      idleMsStep: 80_000,
      consecutiveIdleStart: 2,
    },
    sampleWindowRule()
  );
  push(
    'ops_win_ramp',
    'window runs all turns and records telemetry slices',
    ramp.summary.turnsRun === 5 && ramp.telemetry.length === 5 && ramp.summary.peakEffectiveTier >= 1
  );

  const reset = runIdleAutomationOpsWindow(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 3,
      humanCommittedEvery: 1,
      idleMsStart: 900_000,
      idleMsStep: 0,
      consecutiveIdleStart: 12,
    },
    sampleWindowRule()
  );
  push(
    'ops_win_human',
    'human each turn keeps peak tier at 0',
    reset.summary.humanCommitCount === 3 && reset.summary.peakEffectiveTier === 0
  );

  push(
    'ops_win_schema',
    'window summary schema marker',
    ramp.summary.schema === '10m.agent20.idle-ops-window.v1' &&
      formatIdleOpsWindowSummaryLine(ramp.summary).includes('peak=t')
  );

  const empty = runIdleAutomationOpsWindow(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 0,
      humanCommittedEvery: 0,
      idleMsStart: 0,
      idleMsStep: 0,
      consecutiveIdleStart: 0,
    },
    sampleWindowRule()
  );
  push('ops_win_zero', 'zero-turn window is stable', empty.summary.turnsRun === 0 && empty.telemetry.length === 0);

  return results;
}


// --- source: automation-backpressure-alerts.ts ---
  buildBackpressureTelemetryDigest,
  type O10BackpressureTelemetryDigest,
  type O10BackpressureTelemetrySlice,
} from './automation-backpressure-telemetry.js';

export type O10BackpressureAlertLevel = 'none' | 'warn' | 'critical';

export interface O10BackpressureAlertThresholds {
  warnDeferRatio: number;
  criticalDeferRatio: number;
  warnTotalDropped: number;
  criticalTotalDropped: number;
  criticalPeakTier: O10IdleEscalationTier;
}

export const DEFAULT_BACKPRESSURE_ALERT_THRESHOLDS: O10BackpressureAlertThresholds = {
  warnDeferRatio: 0.45,
  criticalDeferRatio: 0.8,
  warnTotalDropped: 2,
  criticalTotalDropped: 6,
  criticalPeakTier: 3,
};

export interface O10BackpressureAlert {
  schema: '10m.agent20.backpressure-alert.v1';
  level: O10BackpressureAlertLevel;
  deferRatio: number;
  reasons: string[];
  digest: O10BackpressureTelemetryDigest;
}

function deferRatio(digest: O10BackpressureTelemetryDigest): number {
  if (digest.sliceCount <= 0) return 0;
  return digest.deferCount / digest.sliceCount;
}

/** Classify backpressure telemetry digest into none / warn / critical alert levels. */
export function evaluateBackpressureAlerts(
  digest: O10BackpressureTelemetryDigest,
  thresholds: O10BackpressureAlertThresholds = DEFAULT_BACKPRESSURE_ALERT_THRESHOLDS
): O10BackpressureAlert {
  const ratio = deferRatio(digest);
  const reasons: string[] = [];
  let level: O10BackpressureAlertLevel = 'none';

  const critical =
    digest.peakTier >= thresholds.criticalPeakTier ||
    ratio >= thresholds.criticalDeferRatio ||
    digest.totalDropped >= thresholds.criticalTotalDropped;

  if (critical) {
    level = 'critical';
    if (digest.peakTier >= thresholds.criticalPeakTier) reasons.push('peak_tier');
    if (ratio >= thresholds.criticalDeferRatio) reasons.push('defer_ratio');
    if (digest.totalDropped >= thresholds.criticalTotalDropped) reasons.push('drops');
  } else {
    const warn =
      ratio >= thresholds.warnDeferRatio ||
      digest.totalDropped >= thresholds.warnTotalDropped ||
      digest.peakTier >= 2;
    if (warn) {
      level = 'warn';
      if (ratio >= thresholds.warnDeferRatio) reasons.push('defer_ratio');
      if (digest.totalDropped >= thresholds.warnTotalDropped) reasons.push('drops');
      if (digest.peakTier >= 2) reasons.push('elevated_tier');
    }
  }

  return {
    schema: '10m.agent20.backpressure-alert.v1',
    level,
    deferRatio: ratio,
    reasons,
    digest,
  };
}

export function evaluateBackpressureAlertsFromSlices(
  slices: O10BackpressureTelemetrySlice[],
  thresholds?: O10BackpressureAlertThresholds
): O10BackpressureAlert {
  return evaluateBackpressureAlerts(buildBackpressureTelemetryDigest(slices), thresholds);
}

export function formatBackpressureAlertLine(alert: O10BackpressureAlert): string {
  const r = alert.reasons.length ? alert.reasons.join(',') : 'ok';
  return `bp_alert level=${alert.level} defer=${alert.deferRatio.toFixed(2)} reasons=${r}`;
}

export function runO10Agent20BackpressureAlertsSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calm = evaluateBackpressureAlerts(
    buildBackpressureTelemetryDigest([
      {
        turn: 1,
        day: 1,
        tier: 0,
        effectiveMaxDepth: 8,
        deferLowPriorityBelow: 0,
        decision: 'execute_now',
        droppedLowPriority: 0,
      },
    ])
  );
  push('bp_alert_calm', 'healthy telemetry is none', calm.level === 'none');

  const warn = evaluateBackpressureAlerts(
    buildBackpressureTelemetryDigest([
      {
        turn: 1,
        day: 1,
        tier: 2,
        effectiveMaxDepth: 6,
        deferLowPriorityBelow: 4,
        decision: 'defer',
        droppedLowPriority: 0,
      },
      {
        turn: 2,
        day: 1,
        tier: 2,
        effectiveMaxDepth: 6,
        deferLowPriorityBelow: 4,
        decision: 'execute_now',
        droppedLowPriority: 0,
      },
    ])
  );
  push('bp_alert_warn', 'elevated tier triggers warn', warn.level === 'warn' && warn.reasons.includes('elevated_tier'));

  const critical = evaluateBackpressureAlerts(
    buildBackpressureTelemetryDigest([
      {
        turn: 1,
        day: 1,
        tier: 3,
        effectiveMaxDepth: 5,
        deferLowPriorityBelow: 4,
        decision: 'defer',
        droppedLowPriority: 3,
      },
      {
        turn: 2,
        day: 1,
        tier: 3,
        effectiveMaxDepth: 5,
        deferLowPriorityBelow: 4,
        decision: 'defer',
        droppedLowPriority: 4,
      },
    ])
  );
  push(
    'bp_alert_critical',
    'peak tier and drops escalate to critical',
    critical.level === 'critical' && critical.reasons.includes('peak_tier')
  );

  push(
    'bp_alert_line',
    'alert line formatter includes level',
    formatBackpressureAlertLine(critical).includes('level=critical')
  );

  return results;
}


// --- source: automation-steward-idle-coordination.ts ---

export interface O10StewardIdleCoordinationResult {
  persisted: NationalStewardPersisted;
  throttled: boolean;
  reason: string;
}

const AUTONOMOUS_MODES = new Set(['autonomous_idle', 'autonomous_active', 'assisted']);

/**
 * Clamp national steward autonomy when idle ops backpressure tier is elevated.
 * Respects player pause/latch overrides.
 */
export function coordinateNationalStewardWithIdleOpsTier(
  persisted: NationalStewardPersisted,
  effectiveTier: O10IdleEscalationTier,
  turn: number
): O10StewardIdleCoordinationResult {
  if (persisted.playerOverride.paused || persisted.playerOverride.latched) {
    return { persisted, throttled: false, reason: 'player_override_active' };
  }

  if (effectiveTier <= 1) {
    return { persisted, throttled: false, reason: 'tier_nominal' };
  }

  let next = { ...persisted };
  let throttled = false;
  let reason = 'tier_nominal';

  if (effectiveTier >= 3) {
    throttled = true;
    reason = 'idle_ops_tier3_watch_only';
    next = {
      ...next,
      operatingMode: 'watch_only',
      automationPath: 'v94_idle_steward_watch',
    };
  } else if (effectiveTier >= 2 && AUTONOMOUS_MODES.has(persisted.operatingMode)) {
    throttled = true;
    reason = 'idle_ops_tier2_throttle_autonomy';
    next = {
      ...next,
      operatingMode: 'recommend',
      automationPath: 'v94_idle_steward_soft_nudge',
    };
  }

  if (!throttled) {
    return { persisted, throttled: false, reason: 'tier_nominal' };
  }

  const withHistory = appendNationalStewardHistory(
    next,
    turn,
    next.automationPath,
    'idle',
    reason
  );
  return { persisted: withHistory, throttled, reason };
}

export function formatStewardIdleCoordinationLine(result: O10StewardIdleCoordinationResult): string {
  return `steward_idle throttle=${result.throttled} reason=${result.reason}`;
}

export function runO10Agent20StewardIdleCoordinationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const base = createDefaultAutonomousIdleNationalPersisted();
  const nominal = coordinateNationalStewardWithIdleOpsTier(
    { ...base, operatingMode: 'autonomous_idle' },
    1,
    4
  );
  push('steward_idle_t1', 'tier 1 leaves autonomous mode', nominal.throttled === false);

  const throttle = coordinateNationalStewardWithIdleOpsTier(
    { ...base, operatingMode: 'autonomous_active' },
    2,
    5
  );
  push(
    'steward_idle_t2',
    'tier 2 throttles autonomous modes to recommend',
    throttle.throttled === true &&
      throttle.persisted.operatingMode === 'recommend' &&
      throttle.persisted.automationPath === 'v94_idle_steward_soft_nudge'
  );

  const watch = coordinateNationalStewardWithIdleOpsTier(
    { ...base, operatingMode: 'autonomous_active' },
    3,
    6
  );
  push(
    'steward_idle_t3',
    'tier 3 forces watch-only steward path',
    watch.throttled === true &&
      watch.persisted.operatingMode === 'watch_only' &&
      watch.persisted.automationPath === 'v94_idle_steward_watch'
  );

  const latched = coordinateNationalStewardWithIdleOpsTier(
    {
      ...base,
      operatingMode: 'autonomous_active',
      playerOverride: { ...base.playerOverride, latched: true },
    },
    3,
    7
  );
  push(
    'steward_idle_override',
    'latched player override skips idle coordination',
    latched.throttled === false && latched.persisted.operatingMode === 'autonomous_active'
  );

  return results;
}


// --- source: automation-backpressure-remediation.ts ---

export type O10BackpressureRemediationKind =
  | 'none'
  | 'surface_warn_banner'
  | 'defer_low_priority_intents'
  | 'request_human_commit'
  | 'shrink_intent_queue'
  | 'steward_watch_only';

export interface O10BackpressureRemediationStep {
  kind: O10BackpressureRemediationKind;
  priority: number;
  detail: string;
}

export interface O10BackpressureRemediationPlan {
  schema: '10m.agent20.backpressure-remediation.v1';
  alertLevel: O10BackpressureAlertLevel;
  steps: O10BackpressureRemediationStep[];
}

/** Map a backpressure alert into ordered remediation steps for idle ops UI / steward hooks. */
export function planBackpressureRemediation(alert: O10BackpressureAlert): O10BackpressureRemediationPlan {
  const steps: O10BackpressureRemediationStep[] = [];

  if (alert.level === 'none') {
    steps.push({ kind: 'none', priority: 0, detail: 'telemetry_nominal' });
    return { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: alert.level, steps };
  }

  if (alert.level === 'warn') {
    steps.push({
      kind: 'surface_warn_banner',
      priority: 10,
      detail: `defer_ratio=${alert.deferRatio.toFixed(2)}`,
    });
    steps.push({
      kind: 'defer_low_priority_intents',
      priority: 20,
      detail: 'elevated_tier_or_defer',
    });
  }

  if (alert.level === 'critical') {
    steps.push({
      kind: 'request_human_commit',
      priority: 5,
      detail: alert.reasons.join(',') || 'critical_backpressure',
    });
    steps.push({
      kind: 'shrink_intent_queue',
      priority: 15,
      detail: `drops=${alert.digest.totalDropped}`,
    });
    steps.push({
      kind: 'steward_watch_only',
      priority: 25,
      detail: `peak_t${alert.digest.peakTier}`,
    });
  }

  steps.sort((a, b) => a.priority - b.priority);
  return { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: alert.level, steps };
}

export function formatBackpressureRemediationLine(plan: O10BackpressureRemediationPlan): string {
  const head = plan.steps[0]?.kind ?? 'none';
  return `bp_remediation level=${plan.alertLevel} first=${head} steps=${plan.steps.length}`;
}

export function runO10Agent20BackpressureRemediationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calm = planBackpressureRemediation({
    schema: '10m.agent20.backpressure-alert.v1',
    level: 'none',
    deferRatio: 0,
    reasons: [],
    digest: {
      schema: '10m.agent20.backpressure-telemetry.v1',
      sliceCount: 2,
      deferCount: 0,
      executeCount: 2,
      totalDropped: 0,
      peakTier: 0,
      summaryLine: 'ok',
    },
  });
  push('bp_remed_calm', 'none alert yields single none step', calm.steps.length === 1 && calm.steps[0].kind === 'none');

  const warn = planBackpressureRemediation({
    schema: '10m.agent20.backpressure-alert.v1',
    level: 'warn',
    deferRatio: 0.5,
    reasons: ['defer_ratio'],
    digest: {
      schema: '10m.agent20.backpressure-telemetry.v1',
      sliceCount: 4,
      deferCount: 2,
      executeCount: 2,
      totalDropped: 1,
      peakTier: 2,
      summaryLine: 'warn',
    },
  });
  push(
    'bp_remed_warn',
    'warn includes banner and defer steps',
    warn.steps.some(s => s.kind === 'surface_warn_banner') &&
      warn.steps.some(s => s.kind === 'defer_low_priority_intents')
  );

  const critical = planBackpressureRemediation({
    schema: '10m.agent20.backpressure-alert.v1',
    level: 'critical',
    deferRatio: 0.9,
    reasons: ['peak_tier', 'drops'],
    digest: {
      schema: '10m.agent20.backpressure-telemetry.v1',
      sliceCount: 3,
      deferCount: 3,
      executeCount: 0,
      totalDropped: 8,
      peakTier: 3,
      summaryLine: 'critical',
    },
  });
  push(
    'bp_remed_critical',
    'critical requests human and steward watch',
    critical.steps.some(s => s.kind === 'request_human_commit') &&
      critical.steps.some(s => s.kind === 'steward_watch_only')
  );

  push(
    'bp_remed_order',
    'steps sorted by priority',
    critical.steps.every((s, i) => i === 0 || s.priority >= critical.steps[i - 1].priority)
  );

  return results;
}


// --- source: automation-idle-ops-governance.ts ---
  formatIdleOpsWindowSummaryLine,
  runIdleAutomationOpsWindow,
  type O10IdleOpsWindowResult,
  type O10IdleOpsWindowSpec,
} from './automation-idle-ops-window.js';
  coordinateNationalStewardWithIdleOpsTier,
  type O10StewardIdleCoordinationResult,
} from './automation-steward-idle-coordination.js';

export interface O10IdleOpsGovernanceResult {
  schema: '10m.agent20.idle-ops-governance.v1';
  window: O10IdleOpsWindowResult;
  alertLevel: string;
  remediationStepCount: number;
  steward: O10StewardIdleCoordinationResult;
  summaryLine: string;
}

/** Run idle ops window, classify backpressure, plan remediation, and align national steward to peak tier. */
export function runIdleAutomationOpsGovernance(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  stewardPersisted: NationalStewardPersisted = createDefaultAutonomousIdleNationalPersisted()
): O10IdleOpsGovernanceResult {
  const window = runIdleAutomationOpsWindow(spec, rule);
  const alert = evaluateBackpressureAlertsFromSlices(window.telemetry);
  const remediation = planBackpressureRemediation(alert);
  const steward = coordinateNationalStewardWithIdleOpsTier(
    stewardPersisted,
    window.summary.peakEffectiveTier,
    spec.startTurn + Math.max(0, spec.turnCount - 1)
  );

  const summaryLine = [
    formatIdleOpsWindowSummaryLine(window.summary),
    `alert=${alert.level}`,
    `remediation=${remediation.steps.length}`,
    `steward_throttle=${steward.throttled}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-ops-governance.v1',
    window,
    alertLevel: alert.level,
    remediationStepCount: remediation.steps.length,
    steward,
    summaryLine,
  };
}

export function runO10Agent20IdleOpsGovernanceSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'gov1',
    name: 'Gov sample',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calm = runIdleAutomationOpsGovernance(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 2,
      humanCommittedEvery: 1,
      idleMsStart: 0,
      idleMsStep: 0,
      consecutiveIdleStart: 0,
    },
    sampleRule
  );
  push(
    'ops_gov_calm',
    'human cadence keeps alert none and steward nominal',
    calm.alertLevel === 'none' && calm.steward.throttled === false && calm.window.summary.peakEffectiveTier === 0
  );

  const stressed = runIdleAutomationOpsGovernance(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 6,
      humanCommittedEvery: 0,
      idleMsStart: 200_000,
      idleMsStep: 150_000,
      consecutiveIdleStart: 8,
    },
    sampleRule,
    { ...createDefaultAutonomousIdleNationalPersisted(), operatingMode: 'autonomous_idle' }
  );
  push(
    'ops_gov_stress',
    'stressed window escalates alert and may throttle steward',
    stressed.window.summary.peakEffectiveTier >= 2 &&
      (stressed.alertLevel === 'warn' || stressed.alertLevel === 'critical') &&
      stressed.remediationStepCount >= 2
  );

  push(
    'ops_gov_schema',
    'governance schema marker',
    calm.schema === '10m.agent20.idle-ops-governance.v1' && calm.summaryLine.includes('alert=')
  );

  push(
    'ops_gov_remediation',
    'critical alert yields more remediation steps than none',
    stressed.remediationStepCount > calm.remediationStepCount
  );

  return results;
}


// --- source: automation-idle-governance-report.ts ---

export interface O10IdleGovernanceReportSections {
  schema: '10m.agent20.idle-governance-report.v1';
  headline: string;
  markdown: string;
}

/** Build co-pilot / dashboard markdown for an idle ops governance pass. */
export function buildIdleGovernanceReport(
  governance: O10IdleOpsGovernanceResult
): O10IdleGovernanceReportSections {
  const alert = evaluateBackpressureAlertsFromSlices(governance.window.telemetry);
  const remediation = planBackpressureRemediation(alert);
  const headline = `idle_governance alert=${governance.alertLevel} peak=t${governance.window.summary.peakEffectiveTier}`;

  const lines = [
    '## Agent 20 idle ops governance',
    '',
    `- ${formatIdleOpsWindowSummaryLine(governance.window.summary)}`,
    `- alert=${alert.level} defer=${alert.deferRatio.toFixed(2)}`,
    `- ${formatBackpressureRemediationLine(remediation)}`,
    `- ${formatStewardIdleCoordinationLine(governance.steward)}`,
    '',
    governance.summaryLine,
    '',
  ];

  return {
    schema: '10m.agent20.idle-governance-report.v1',
    headline,
    markdown: lines.join('\n'),
  };
}

export function runO10Agent20IdleGovernanceReportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const stewardBase = createDefaultAutonomousIdleNationalPersisted();
  const mock: O10IdleOpsGovernanceResult = {
    schema: '10m.agent20.idle-ops-governance.v1',
    alertLevel: 'warn',
    remediationStepCount: 2,
    summaryLine: 'ops_window turns=3 alert=warn remediation=2 steward_throttle=true',
    steward: {
      persisted: {
        ...stewardBase,
        operatingMode: 'recommend',
        automationPath: 'v94_idle_steward_soft_nudge',
      },
      throttled: true,
      reason: 'idle_ops_tier2_throttle_autonomy',
    },
    window: {
      queue: createEmptyAutomationIntentQueue(8),
      deescalationState: createDefaultIdleDeescalationState(),
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 2,
          effectiveMaxDepth: 6,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 0,
        },
      ],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1',
        turnsRun: 3,
        humanCommitCount: 0,
        peakEffectiveTier: 2,
        finalScheduleAction: 'defer',
        digestSummary: 'defer=1/1',
      },
      lastTurn: {
        queue: createEmptyAutomationIntentQueue(8),
        deescalationState: createDefaultIdleDeescalationState(),
        telemetry: [],
        effectiveTier: 2,
        scheduleAction: 'defer',
        digestSummary: 'defer=1/1',
      },
    },
  };

  const report = buildIdleGovernanceReport(mock);
  push('gov_report_md', 'markdown includes governance header', report.markdown.includes('## Agent 20 idle ops governance'));
  push('gov_report_headline', 'headline encodes alert and peak tier', report.headline.includes('alert=warn') && report.headline.includes('peak=t2'));
  push('gov_report_schema', 'report schema marker', report.schema === '10m.agent20.idle-governance-report.v1');
  push('gov_report_steward', 'markdown includes steward coordination line', report.markdown.includes('steward_idle throttle=true'));

  return results;
}


// --- source: automation-governance-remediation-runner.ts ---
  planBackpressureRemediation,
  type O10BackpressureRemediationKind,
  type O10BackpressureRemediationPlan,
} from './automation-backpressure-remediation.js';

export interface O10GovernanceRemediationRunResult {
  schema: '10m.agent20.governance-remediation-run.v1';
  plan: O10BackpressureRemediationPlan;
  queue: O10AutomationIntentQueue;
  appliedKinds: O10BackpressureRemediationKind[];
  appliedStepCount: number;
  pendingHumanCommit: boolean;
  summaryLine: string;
}

const LOW_PRIORITY_CUTOFF = 4;

function shrinkQueueForRemediation(queue: O10AutomationIntentQueue): O10AutomationIntentQueue {
  const nextMax = Math.max(1, queue.maxDepth - 2);
  const items = queue.items.map(item => {
    if (item.status !== 'queued') return item;
    if (item.priority < LOW_PRIORITY_CUTOFF) {
      return { ...item, status: 'cancelled' as const, reason: 'bp_remediation_shrink' };
    }
    return item;
  });
  return { maxDepth: nextMax, items };
}

function deferLowPriorityIntents(queue: O10AutomationIntentQueue): O10AutomationIntentQueue {
  const items = queue.items.map(item => {
    if (item.status !== 'queued') return item;
    if (item.priority < LOW_PRIORITY_CUTOFF) {
      return { ...item, status: 'blocked' as const, reason: 'bp_remediation_defer' };
    }
    return item;
  });
  return { ...queue, items };
}

/** Apply ordered remediation steps from a governance pass onto the live intent queue. */
export function runGovernanceRemediationPlaybook(
  governance: O10IdleOpsGovernanceResult
): O10GovernanceRemediationRunResult {
  const alert = evaluateBackpressureAlertsFromSlices(governance.window.telemetry);
  const plan = planBackpressureRemediation(alert);
  let queue = governance.window.queue;
  const appliedKinds: O10BackpressureRemediationKind[] = [];
  let pendingHumanCommit = false;

  for (const step of plan.steps) {
    switch (step.kind) {
      case 'none':
      case 'surface_warn_banner':
        appliedKinds.push(step.kind);
        break;
      case 'defer_low_priority_intents':
        queue = deferLowPriorityIntents(queue);
        appliedKinds.push(step.kind);
        break;
      case 'shrink_intent_queue':
        queue = shrinkQueueForRemediation(queue);
        appliedKinds.push(step.kind);
        break;
      case 'request_human_commit':
        pendingHumanCommit = true;
        appliedKinds.push(step.kind);
        break;
      case 'steward_watch_only':
        appliedKinds.push(step.kind);
        break;
      default:
        break;
    }
  }

  const summaryLine = [
    `gov_remediation_run level=${plan.alertLevel}`,
    `applied=${appliedKinds.length}`,
    `pending_human=${pendingHumanCommit}`,
    `queue_depth=${queue.maxDepth}`,
  ].join(' ');

  return {
    schema: '10m.agent20.governance-remediation-run.v1',
    plan,
    queue,
    appliedKinds,
    appliedStepCount: appliedKinds.filter(k => k !== 'none').length,
    pendingHumanCommit,
    summaryLine,
  };
}

export function runO10Agent20GovernanceRemediationRunnerSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calmGovernance: O10IdleOpsGovernanceResult = {
    schema: '10m.agent20.idle-ops-governance.v1',
    alertLevel: 'none',
    remediationStepCount: 1,
    summaryLine: 'calm',
    steward: { persisted: {} as never, throttled: false, reason: 'tier_nominal' },
    window: {
      queue: { maxDepth: 8, items: [] },
      deescalationState: {} as never,
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 0,
          effectiveMaxDepth: 8,
          deferLowPriorityBelow: 4,
          decision: 'execute_now',
          droppedLowPriority: 0,
        },
      ],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1',
        turnsRun: 1,
        humanCommitCount: 1,
        peakEffectiveTier: 0,
        finalScheduleAction: 'execute_now',
        digestSummary: 'ok',
      },
      lastTurn: {} as never,
    },
  };

  const calmRun = runGovernanceRemediationPlaybook(calmGovernance);
  push(
    'gov_remed_run_calm',
    'calm governance applies nominal none step',
    calmRun.appliedKinds.includes('none') && calmRun.pendingHumanCommit === false
  );

  const stressed = {
    ...calmGovernance,
    alertLevel: 'critical',
    remediationStepCount: 3,
    window: {
      ...calmGovernance.window,
      queue: {
        maxDepth: 8,
        items: [
          {
            id: 'i1',
            ruleId: 'r1',
            actionType: 'wait',
            priority: 2,
            enqueuedTurn: 1,
            enqueuedDay: 1,
            resolvedCost: 0,
            status: 'queued' as const,
          },
          {
            id: 'i2',
            ruleId: 'r2',
            actionType: 'wait',
            priority: 8,
            enqueuedTurn: 1,
            enqueuedDay: 1,
            resolvedCost: 0,
            status: 'queued' as const,
          },
        ],
      },
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 3,
          effectiveMaxDepth: 5,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 4,
        },
        {
          turn: 2,
          day: 1,
          tier: 3,
          effectiveMaxDepth: 5,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 2,
        },
      ],
      summary: {
        ...calmGovernance.window.summary,
        peakEffectiveTier: 3,
        humanCommitCount: 0,
      },
    },
  };

  const stressRun = runGovernanceRemediationPlaybook(stressed as O10IdleOpsGovernanceResult);
  push(
    'gov_remed_run_critical',
    'critical plan shrinks queue and requests human',
    stressRun.pendingHumanCommit &&
      stressRun.queue.maxDepth < 8 &&
      stressRun.appliedKinds.includes('shrink_intent_queue')
  );

  push(
    'gov_remed_run_schema',
    'remediation run schema marker',
    stressRun.schema === '10m.agent20.governance-remediation-run.v1' && stressRun.summaryLine.includes('gov_remediation_run')
  );

  push(
    'gov_remed_run_low_priority',
    'low priority intents cancelled or blocked under stress',
    stressRun.queue.items.some(i => i.id === 'i1' && (i.status === 'cancelled' || i.status === 'blocked')) &&
      stressRun.queue.items.some(i => i.id === 'i2' && i.status === 'queued')
  );

  return results;
}


// --- source: automation-idle-governance-audit-trail.ts ---

export interface O10IdleGovernanceAuditEntry {
  schema: '10m.agent20.idle-governance-audit.v1';
  turn: number;
  alertLevel: string;
  peakTier: number;
  appliedStepCount: number;
  pendingHumanCommit: boolean;
  fingerprint: string;
}

export interface O10IdleGovernanceAuditTrail {
  schema: '10m.agent20.idle-governance-audit-trail.v1';
  entries: O10IdleGovernanceAuditEntry[];
}

export function createEmptyIdleGovernanceAuditTrail(): O10IdleGovernanceAuditTrail {
  return { schema: '10m.agent20.idle-governance-audit-trail.v1', entries: [] };
}

function fingerprintGovernancePass(
  governance: O10IdleOpsGovernanceResult,
  run: O10GovernanceRemediationRunResult
): string {
  return [
    governance.alertLevel,
    governance.window.summary.peakEffectiveTier,
    run.appliedStepCount,
    run.pendingHumanCommit ? 1 : 0,
    governance.summaryLine.slice(0, 48),
  ].join('|');
}

/** Append one governance + remediation cycle to the audit trail (cap 64). */
export function appendIdleGovernanceAuditEntry(
  trail: O10IdleGovernanceAuditTrail,
  governance: O10IdleOpsGovernanceResult,
  run: O10GovernanceRemediationRunResult,
  turn: number
): O10IdleGovernanceAuditTrail {
  const entry: O10IdleGovernanceAuditEntry = {
    schema: '10m.agent20.idle-governance-audit.v1',
    turn,
    alertLevel: governance.alertLevel,
    peakTier: governance.window.summary.peakEffectiveTier,
    appliedStepCount: run.appliedStepCount,
    pendingHumanCommit: run.pendingHumanCommit,
    fingerprint: fingerprintGovernancePass(governance, run),
  };
  const entries = [...trail.entries, entry].slice(-64);
  return { schema: trail.schema, entries };
}

export function formatIdleGovernanceAuditDigest(trail: O10IdleGovernanceAuditTrail): string {
  if (trail.entries.length === 0) return 'idle_gov_audit entries=0';
  const last = trail.entries[trail.entries.length - 1];
  return `idle_gov_audit entries=${trail.entries.length} last_alert=${last.alertLevel} peak=t${last.peakTier}`;
}

export function runO10Agent20IdleGovernanceAuditTrailSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockGovernance = {
    schema: '10m.agent20.idle-ops-governance.v1' as const,
    alertLevel: 'warn',
    remediationStepCount: 2,
    summaryLine: 'ops_window turns=2 alert=warn',
    steward: { persisted: {} as never, throttled: true, reason: 'idle_ops_tier2_throttle_autonomy' },
    window: {
      queue: { maxDepth: 6, items: [] },
      deescalationState: {} as never,
      telemetry: [],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1' as const,
        turnsRun: 2,
        humanCommitCount: 0,
        peakEffectiveTier: 2 as const,
        finalScheduleAction: 'defer',
        digestSummary: 'defer=1/2',
      },
      lastTurn: {} as never,
    },
  };

  const mockRun: O10GovernanceRemediationRunResult = {
    schema: '10m.agent20.governance-remediation-run.v1',
    plan: { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: 'warn', steps: [] },
    queue: { maxDepth: 6, items: [] },
    appliedKinds: ['surface_warn_banner', 'defer_low_priority_intents'],
    appliedStepCount: 2,
    pendingHumanCommit: false,
    summaryLine: 'gov_remediation_run level=warn applied=2',
  };

  let trail = createEmptyIdleGovernanceAuditTrail();
  push('gov_audit_empty', 'empty trail digest', formatIdleGovernanceAuditDigest(trail) === 'idle_gov_audit entries=0');

  trail = appendIdleGovernanceAuditEntry(trail, mockGovernance, mockRun, 5);
  push(
    'gov_audit_append',
    'append records alert and peak tier',
    trail.entries.length === 1 &&
      trail.entries[0].alertLevel === 'warn' &&
      trail.entries[0].peakTier === 2 &&
      trail.entries[0].fingerprint.includes('warn')
  );

  trail = appendIdleGovernanceAuditEntry(trail, { ...mockGovernance, alertLevel: 'none' }, { ...mockRun, appliedStepCount: 0 }, 6);
  push('gov_audit_cap', 'trail retains latest entries', trail.entries.length === 2);

  push(
    'gov_audit_digest',
    'digest summarizes last entry',
    formatIdleGovernanceAuditDigest(trail).includes('last_alert=none') && formatIdleGovernanceAuditDigest(trail).includes('entries=2')
  );

  return results;
}


// --- source: automation-idle-governance-stabilization.ts ---
  appendIdleGovernanceAuditEntry,
  createEmptyIdleGovernanceAuditTrail,
  formatIdleGovernanceAuditDigest,
  type O10IdleGovernanceAuditTrail,
} from './automation-idle-governance-audit-trail.js';
  runGovernanceRemediationPlaybook,
  type O10GovernanceRemediationRunResult,
} from './automation-governance-remediation-runner.js';

export type O10IdleGovernanceStabilizationWave = 'idle_governance_calm' | 'idle_governance_remediating' | 'idle_governance_blocked';

export interface O10IdleGovernanceStabilizationResult {
  schema: '10m.agent20.idle-governance-stabilization.v1';
  wave: O10IdleGovernanceStabilizationWave;
  stabilized: boolean;
  auditDigest: string;
  reportHeadline: string;
  summaryLine: string;
}

export interface O10IdleGovernanceStabilizationPassResult {
  schema: '10m.agent20.idle-governance-stabilization-pass.v1';
  governance: O10IdleOpsGovernanceResult;
  remediationRun: O10GovernanceRemediationRunResult;
  auditTrail: O10IdleGovernanceAuditTrail;
  stabilization: O10IdleGovernanceStabilizationResult;
}

export function evaluateIdleGovernanceStabilization(
  governance: O10IdleOpsGovernanceResult,
  run: O10GovernanceRemediationRunResult,
  auditDigest: string
): O10IdleGovernanceStabilizationResult {
  const calm = governance.alertLevel === 'none';
  const humanRelief =
    governance.window.summary.humanCommitCount > 0 && governance.window.summary.peakEffectiveTier <= 1;
  const remediated =
    run.appliedStepCount > 0 && !run.pendingHumanCommit && governance.window.summary.peakEffectiveTier <= 2;

  let wave: O10IdleGovernanceStabilizationWave = 'idle_governance_remediating';
  if (calm || humanRelief) wave = 'idle_governance_calm';
  else if (run.pendingHumanCommit && governance.window.summary.humanCommitCount === 0) {
    wave = 'idle_governance_blocked';
  }

  const stabilized = wave === 'idle_governance_calm' || (remediated && humanRelief);
  const report = buildIdleGovernanceReport(governance);

  const summaryLine = [
    `gov_stabilization wave=${wave}`,
    `stabilized=${stabilized}`,
    auditDigest,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-stabilization.v1',
    wave,
    stabilized,
    auditDigest,
    reportHeadline: report.headline,
    summaryLine,
  };
}

/** Full round-9 pass: remediation playbook, audit trail, stabilization wave classification. */
export function runIdleGovernanceStabilizationPass(
  governance: O10IdleOpsGovernanceResult,
  turn: number,
  priorTrail: O10IdleGovernanceAuditTrail = createEmptyIdleGovernanceAuditTrail()
): O10IdleGovernanceStabilizationPassResult {
  const remediationRun = runGovernanceRemediationPlaybook(governance);
  const auditTrail = appendIdleGovernanceAuditEntry(priorTrail, governance, remediationRun, turn);
  const auditDigest = formatIdleGovernanceAuditDigest(auditTrail);
  const stabilization = evaluateIdleGovernanceStabilization(governance, remediationRun, auditDigest);

  return {
    schema: '10m.agent20.idle-governance-stabilization-pass.v1',
    governance,
    remediationRun,
    auditTrail,
    stabilization,
  };
}

export function runO10Agent20IdleGovernanceStabilizationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const calmGov: O10IdleOpsGovernanceResult = {
    schema: '10m.agent20.idle-ops-governance.v1',
    alertLevel: 'none',
    remediationStepCount: 1,
    summaryLine: 'calm',
    steward: { persisted: {} as never, throttled: false, reason: 'tier_nominal' },
    window: {
      queue: { maxDepth: 8, items: [] },
      deescalationState: {} as never,
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 0,
          effectiveMaxDepth: 8,
          deferLowPriorityBelow: 4,
          decision: 'execute_now',
          droppedLowPriority: 0,
        },
      ],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1',
        turnsRun: 2,
        humanCommitCount: 1,
        peakEffectiveTier: 0,
        finalScheduleAction: 'execute_now',
        digestSummary: 'ok',
      },
      lastTurn: {} as never,
    },
  };

  const calmPass = runIdleGovernanceStabilizationPass(calmGov, 3);
  push(
    'gov_stab_calm',
    'calm governance stabilizes on calm wave',
    calmPass.stabilization.wave === 'idle_governance_calm' && calmPass.stabilization.stabilized
  );

  const blockedGov: O10IdleOpsGovernanceResult = {
    ...calmGov,
    alertLevel: 'critical',
    window: {
      ...calmGov.window,
      summary: {
        ...calmGov.window.summary,
        humanCommitCount: 0,
        peakEffectiveTier: 3,
      },
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 3,
          effectiveMaxDepth: 5,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 6,
        },
      ],
    },
  };

  const blockedPass = runIdleGovernanceStabilizationPass(blockedGov, 4);
  push(
    'gov_stab_blocked',
    'critical without human commit stays blocked',
    blockedPass.stabilization.wave === 'idle_governance_blocked' && blockedPass.stabilization.stabilized === false
  );

  push(
    'gov_stab_audit',
    'pass appends audit trail',
    blockedPass.auditTrail.entries.length === 1 && blockedPass.stabilization.auditDigest.includes('entries=1')
  );

  push(
    'gov_stab_schema',
    'stabilization pass schema marker',
    blockedPass.schema === '10m.agent20.idle-governance-stabilization-pass.v1' &&
      blockedPass.stabilization.schema === '10m.agent20.idle-governance-stabilization.v1'
  );

  return results;
}


// --- source: automation-idle-governance-reconciliation.ts ---
  formatIdleGovernanceAuditDigest,
  type O10IdleGovernanceAuditTrail,
} from './automation-idle-governance-audit-trail.js';
  runIdleGovernanceStabilizationPass,
  type O10IdleGovernanceStabilizationPassResult,
} from './automation-idle-governance-stabilization.js';
  runIdleAutomationOpsGovernance,
  type O10IdleOpsGovernanceResult,
} from './automation-idle-ops-governance.js';

export type O10IdleGovernanceReconciliationStatus = 'aligned' | 'improved' | 'drift' | 'blocked';

export interface O10IdleGovernanceReconciliationResult {
  schema: '10m.agent20.idle-governance-reconciliation.v1';
  status: O10IdleGovernanceReconciliationStatus;
  priorAlertLevel: string | null;
  deltaPeakTier: number;
  auditMatchesPass: boolean;
  summaryLine: string;
}

function lastAuditAlert(trail: O10IdleGovernanceAuditTrail): string | null {
  if (trail.entries.length === 0) return null;
  return trail.entries[trail.entries.length - 1].alertLevel;
}

/** Compare stabilization pass outcomes against prior audit state and in-pass audit entry. */
export function reconcileIdleGovernancePass(
  pass: O10IdleGovernanceStabilizationPassResult,
  priorTrail: O10IdleGovernanceAuditTrail
): O10IdleGovernanceReconciliationResult {
  const priorAlert = lastAuditAlert(priorTrail);
  const latest = pass.auditTrail.entries[pass.auditTrail.entries.length - 1];
  const auditMatchesPass =
    !!latest &&
    latest.alertLevel === pass.governance.alertLevel &&
    latest.peakTier === pass.governance.window.summary.peakEffectiveTier &&
    latest.appliedStepCount === pass.remediationRun.appliedStepCount;

  const priorPeak =
    priorTrail.entries.length > 0 ? priorTrail.entries[priorTrail.entries.length - 1].peakTier : null;
  const deltaPeakTier =
    priorPeak === null ? 0 : pass.governance.window.summary.peakEffectiveTier - priorPeak;

  let status: O10IdleGovernanceReconciliationStatus = 'aligned';
  if (!auditMatchesPass) status = 'drift';
  else if (pass.stabilization.wave === 'idle_governance_blocked') status = 'blocked';
  else if (
    priorAlert &&
    priorAlert !== 'none' &&
    pass.governance.alertLevel === 'none'
  ) {
    status = 'improved';
  } else if (deltaPeakTier < 0) status = 'improved';

  const summaryLine = [
    `gov_reconcile status=${status}`,
    `audit_ok=${auditMatchesPass}`,
    `delta_peak=${deltaPeakTier}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-reconciliation.v1',
    status,
    priorAlertLevel: priorAlert,
    deltaPeakTier,
    auditMatchesPass,
    summaryLine,
  };
}

export interface O10IdleGovernanceComplianceCycleResult {
  schema: '10m.agent20.idle-governance-compliance-cycle.v1';
  governance: O10IdleOpsGovernanceResult;
  pass: O10IdleGovernanceStabilizationPassResult;
  reconciliation: O10IdleGovernanceReconciliationResult;
  auditDigest: string;
}

/** End-to-end governance compliance cycle for round-10 integration hooks. */
export function runIdleGovernanceComplianceCycle(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  turn: number,
  priorTrail: O10IdleGovernanceAuditTrail
): O10IdleGovernanceComplianceCycleResult {
  const governance = runIdleAutomationOpsGovernance(
    spec,
    rule,
    createDefaultAutonomousIdleNationalPersisted()
  );
  const pass = runIdleGovernanceStabilizationPass(governance, turn, priorTrail);
  const reconciliation = reconcileIdleGovernancePass(pass, priorTrail);
  return {
    schema: '10m.agent20.idle-governance-compliance-cycle.v1',
    governance,
    pass,
    reconciliation,
    auditDigest: formatIdleGovernanceAuditDigest(pass.auditTrail),
  };
}

export function runO10Agent20IdleGovernanceReconciliationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'rec1',
    name: 'Reconcile sample',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const cycle = runIdleGovernanceComplianceCycle(calmSpec, sampleRule, 2, {
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [],
  });
  push(
    'gov_reconcile_calm',
    'calm cycle reconciles aligned',
    cycle.reconciliation.status === 'aligned' && cycle.reconciliation.auditMatchesPass
  );

  const stressedSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 200_000,
    idleMsStep: 150_000,
    consecutiveIdleStart: 8,
  };
  const stressCycle = runIdleGovernanceComplianceCycle(stressedSpec, sampleRule, 5, cycle.pass.auditTrail);
  push(
    'gov_reconcile_stress',
    'stressed cycle may block or drift with elevated tier',
    stressCycle.reconciliation.auditMatchesPass &&
      (stressCycle.reconciliation.status === 'blocked' || stressCycle.governance.alertLevel !== 'none')
  );

  push(
    'gov_reconcile_schema',
    'reconciliation schema marker',
    cycle.reconciliation.schema === '10m.agent20.idle-governance-reconciliation.v1' &&
      cycle.schema === '10m.agent20.idle-governance-compliance-cycle.v1'
  );

  push(
    'gov_reconcile_digest',
    'compliance cycle exposes audit digest',
    cycle.auditDigest.includes('entries=1') && stressCycle.auditDigest.includes('entries=')
  );

  return results;
}


// --- source: automation-idle-governance-escalation-ladder.ts ---

export type O10IdleGovernanceEscalationLevel = 0 | 1 | 2 | 3;

export interface O10IdleGovernanceEscalationLadderResult {
  schema: '10m.agent20.idle-governance-escalation-ladder.v1';
  level: O10IdleGovernanceEscalationLevel;
  blockedStreak: number;
  criticalStreak: number;
  recommendedAction: string;
  summaryLine: string;
}

function isStressEntry(alertLevel: string, pendingHumanCommit: boolean): boolean {
  return alertLevel === 'critical' || (alertLevel === 'warn' && pendingHumanCommit);
}

/** Derive co-pilot escalation level from trailing audit entries. */
export function evaluateIdleGovernanceEscalationLadder(
  trail: O10IdleGovernanceAuditTrail
): O10IdleGovernanceEscalationLadderResult {
  let blockedStreak = 0;
  let criticalStreak = 0;

  for (let i = trail.entries.length - 1; i >= 0; i--) {
    const e = trail.entries[i];
    if (e.pendingHumanCommit && e.alertLevel !== 'none') {
      blockedStreak += 1;
    } else {
      break;
    }
  }

  for (let i = trail.entries.length - 1; i >= 0; i--) {
    const e = trail.entries[i];
    if (isStressEntry(e.alertLevel, e.pendingHumanCommit)) {
      criticalStreak += 1;
    } else {
      break;
    }
  }

  let level: O10IdleGovernanceEscalationLevel = 0;
  let recommendedAction = 'monitor';

  if (criticalStreak >= 3 || blockedStreak >= 3) {
    level = 3;
    recommendedAction = 'hard_pause_automation';
  } else if (blockedStreak >= 2 || criticalStreak >= 2) {
    level = 2;
    recommendedAction = 'surface_takeover_banner';
  } else if (blockedStreak >= 1 || criticalStreak >= 1) {
    level = 1;
    recommendedAction = 'nudge_human_commit';
  }

  const summaryLine = `gov_escalation level=${level} blocked_streak=${blockedStreak} critical_streak=${criticalStreak}`;

  return {
    schema: '10m.agent20.idle-governance-escalation-ladder.v1',
    level,
    blockedStreak,
    criticalStreak,
    recommendedAction,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceEscalationLadderSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = evaluateIdleGovernanceEscalationLadder({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [],
  });
  push('gov_esc_empty', 'empty trail is level 0', empty.level === 0 && empty.recommendedAction === 'monitor');

  const mk = (alert: string, pending: boolean, turn: number) => ({
    schema: '10m.agent20.idle-governance-audit.v1' as const,
    turn,
    alertLevel: alert,
    peakTier: 3 as const,
    appliedStepCount: 2,
    pendingHumanCommit: pending,
    fingerprint: `${alert}-${turn}`,
  });

  const oneBlocked = evaluateIdleGovernanceEscalationLadder({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk('critical', true, 1)],
  });
  push('gov_esc_nudge', 'single blocked entry nudges human', oneBlocked.level === 1);

  const streak = evaluateIdleGovernanceEscalationLadder({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk('warn', true, 1), mk('critical', true, 2), mk('critical', true, 3)],
  });
  push('gov_esc_hard', 'triple blocked streak hits level 3', streak.level === 3 && streak.blockedStreak === 3);

  push(
    'gov_esc_schema',
    'escalation ladder schema marker',
    streak.schema === '10m.agent20.idle-governance-escalation-ladder.v1' && streak.summaryLine.includes('level=3')
  );

  return results;
}


// --- source: automation-idle-governance-copilot-brief.ts ---
  evaluateIdleGovernanceEscalationLadder,
  type O10IdleGovernanceEscalationLadderResult,
} from './automation-idle-governance-escalation-ladder.js';

export interface O10IdleGovernanceCopilotBrief {
  schema: '10m.agent20.idle-governance-copilot-brief.v1';
  headline: string;
  markdown: string;
  escalationLevel: number;
}

export function buildIdleGovernanceCopilotBrief(
  pass: O10IdleGovernanceStabilizationPassResult,
  reconciliation: O10IdleGovernanceReconciliationResult,
  ladder: O10IdleGovernanceEscalationLadderResult
): O10IdleGovernanceCopilotBrief {
  const report = buildIdleGovernanceReport(pass.governance);
  const headline = [
    'idle_gov_brief',
    `wave=${pass.stabilization.wave}`,
    `reconcile=${reconciliation.status}`,
    `escalation=L${ladder.level}`,
  ].join(' ');

  const lines = [
    '## Agent 20 idle governance co-pilot brief',
    '',
    `- ${pass.stabilization.summaryLine}`,
    `- ${reconciliation.summaryLine}`,
    `- ${ladder.summaryLine} action=${ladder.recommendedAction}`,
    '',
    report.markdown,
    '',
    pass.remediationRun.summaryLine,
  ];

  return {
    schema: '10m.agent20.idle-governance-copilot-brief.v1',
    headline,
    markdown: lines.join('\n'),
    escalationLevel: ladder.level,
  };
}

/** Build brief from a full compliance cycle (round-10 dashboard hook). */
export function buildIdleGovernanceCopilotBriefFromCycle(
  cycle: O10IdleGovernanceComplianceCycleResult
): O10IdleGovernanceCopilotBrief {
  const ladder = evaluateIdleGovernanceEscalationLadder(cycle.pass.auditTrail);
  return buildIdleGovernanceCopilotBrief(cycle.pass, cycle.reconciliation, ladder);
}

export function runO10Agent20IdleGovernanceCopilotBriefSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockPass: O10IdleGovernanceStabilizationPassResult = {
    schema: '10m.agent20.idle-governance-stabilization-pass.v1',
    governance: {
      schema: '10m.agent20.idle-ops-governance.v1',
      alertLevel: 'warn',
      remediationStepCount: 2,
      summaryLine: 'mock gov',
      steward: { persisted: {} as never, throttled: true, reason: 'idle_ops_tier2_throttle_autonomy' },
      window: {
        queue: { maxDepth: 6, items: [] },
        deescalationState: {} as never,
        telemetry: [],
        summary: {
          schema: '10m.agent20.idle-ops-window.v1',
          turnsRun: 2,
          humanCommitCount: 0,
          peakEffectiveTier: 2,
          finalScheduleAction: 'defer',
          digestSummary: 'defer=1/2',
        },
        lastTurn: {} as never,
      },
    },
    remediationRun: {
      schema: '10m.agent20.governance-remediation-run.v1',
      plan: { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: 'warn', steps: [] },
      queue: { maxDepth: 6, items: [] },
      appliedKinds: ['surface_warn_banner'],
      appliedStepCount: 1,
      pendingHumanCommit: false,
      summaryLine: 'gov_remediation_run level=warn applied=1',
    },
    auditTrail: {
      schema: '10m.agent20.idle-governance-audit-trail.v1',
      entries: [
        {
          schema: '10m.agent20.idle-governance-audit.v1',
          turn: 1,
          alertLevel: 'warn',
          peakTier: 2,
          appliedStepCount: 1,
          pendingHumanCommit: false,
          fingerprint: 'w1',
        },
      ],
    },
    stabilization: {
      schema: '10m.agent20.idle-governance-stabilization.v1',
      wave: 'idle_governance_remediating',
      stabilized: false,
      auditDigest: 'idle_gov_audit entries=1',
      reportHeadline: 'idle_governance alert=warn peak=t2',
      summaryLine: 'gov_stabilization wave=idle_governance_remediating stabilized=false',
    },
  };

  const reconciliation: O10IdleGovernanceReconciliationResult = {
    schema: '10m.agent20.idle-governance-reconciliation.v1',
    status: 'aligned',
    priorAlertLevel: null,
    deltaPeakTier: 0,
    auditMatchesPass: true,
    summaryLine: 'gov_reconcile status=aligned audit_ok=true delta_peak=0',
  };

  const ladder = evaluateIdleGovernanceEscalationLadder(mockPass.auditTrail);
  const brief = buildIdleGovernanceCopilotBrief(mockPass, reconciliation, ladder);

  push('gov_brief_md', 'brief markdown includes co-pilot header', brief.markdown.includes('## Agent 20 idle governance co-pilot brief'));
  push(
    'gov_brief_headline',
    'headline encodes wave and reconcile',
    brief.headline.includes('wave=idle_governance_remediating') && brief.headline.includes('reconcile=aligned')
  );
  push('gov_brief_schema', 'copilot brief schema marker', brief.schema === '10m.agent20.idle-governance-copilot-brief.v1');
  push('gov_brief_escalation', 'brief carries escalation level', brief.escalationLevel === ladder.level);

  return results;
}


// --- source: automation-idle-governance-audit-trend.ts ---

export type O10IdleGovernanceAuditTrendDirection = 'improving' | 'stable' | 'degrading' | 'insufficient';

export interface O10IdleGovernanceAuditTrendResult {
  schema: '10m.agent20.idle-governance-audit-trend.v1';
  direction: O10IdleGovernanceAuditTrendDirection;
  sampleSize: number;
  peakTierSlope: number;
  blockedEntryRatio: number;
  summaryLine: string;
}

const ALERT_RANK: Record<string, number> = { none: 0, warn: 1, critical: 2 };

function alertRank(level: string): number {
  return ALERT_RANK[level] ?? 1;
}

/** Summarize recent audit trail movement for co-pilot trend badges. */
export function analyzeIdleGovernanceAuditTrend(
  trail: O10IdleGovernanceAuditTrail,
  windowSize = 5
): O10IdleGovernanceAuditTrendResult {
  const entries = trail.entries.slice(-Math.max(1, windowSize));
  if (entries.length < 2) {
    return {
      schema: '10m.agent20.idle-governance-audit-trend.v1',
      direction: 'insufficient',
      sampleSize: entries.length,
      peakTierSlope: 0,
      blockedEntryRatio: 0,
      summaryLine: 'gov_audit_trend direction=insufficient sample=1',
    };
  }

  const first = entries[0];
  const last = entries[entries.length - 1];
  const peakTierSlope = last.peakTier - first.peakTier;
  const alertDelta = alertRank(last.alertLevel) - alertRank(first.alertLevel);
  const blockedEntryRatio =
    entries.filter(e => e.pendingHumanCommit && e.alertLevel !== 'none').length / entries.length;

  let direction: O10IdleGovernanceAuditTrendDirection = 'stable';
  if (alertDelta < 0 || peakTierSlope < 0) direction = 'improving';
  else if (alertDelta > 0 || peakTierSlope > 0 || blockedEntryRatio >= 0.6) direction = 'degrading';

  const summaryLine = [
    'gov_audit_trend',
    `direction=${direction}`,
    `slope_peak=${peakTierSlope}`,
    `blocked_ratio=${blockedEntryRatio.toFixed(2)}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-audit-trend.v1',
    direction,
    sampleSize: entries.length,
    peakTierSlope,
    blockedEntryRatio,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceAuditTrendSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mk = (
    turn: number,
    alert: string,
    peak: number,
    pending: boolean
  ) => ({
    schema: '10m.agent20.idle-governance-audit.v1' as const,
    turn,
    alertLevel: alert,
    peakTier: peak as 0 | 1 | 2 | 3,
    appliedStepCount: 1,
    pendingHumanCommit: pending,
    fingerprint: `${turn}-${alert}`,
  });

  const improving = analyzeIdleGovernanceAuditTrend({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk(1, 'critical', 3, true), mk(2, 'warn', 2, false), mk(3, 'none', 0, false)],
  });
  push('gov_trend_improving', 'peak and alert easing marks improving', improving.direction === 'improving');

  const degrading = analyzeIdleGovernanceAuditTrend({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk(1, 'none', 0, false), mk(2, 'warn', 2, true), mk(3, 'critical', 3, true)],
  });
  push('gov_trend_degrading', 'rising tier marks degrading', degrading.direction === 'degrading');

  const one = analyzeIdleGovernanceAuditTrend({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk(1, 'warn', 1, false)],
  });
  push('gov_trend_insufficient', 'single entry is insufficient', one.direction === 'insufficient');

  push(
    'gov_trend_schema',
    'audit trend schema marker',
    degrading.schema === '10m.agent20.idle-governance-audit-trend.v1' && degrading.summaryLine.includes('direction=degrading')
  );

  return results;
}


// --- source: automation-idle-governance-cycle-attestation.ts ---

export interface O10IdleGovernanceCycleAttestation {
  schema: '10m.agent20.idle-governance-cycle-attestation.v1';
  turn: number;
  reconcileStatus: string;
  stabilizationWave: string;
  auditDigest: string;
  briefHeadline: string;
  fingerprint: string;
  valid: boolean;
}

function foldFingerprint(parts: string[]): string {
  let h = 2166136261;
  const text = parts.join('\n');
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `fnv1a_${(h >>> 0).toString(16)}`;
}

/** Produce a deterministic attestation blob for replay / history modules. */
export function attestIdleGovernanceComplianceCycle(
  cycle: O10IdleGovernanceComplianceCycleResult,
  turn: number
): O10IdleGovernanceCycleAttestation {
  const brief = buildIdleGovernanceCopilotBriefFromCycle(cycle);
  const fingerprint = foldFingerprint([
    cycle.governance.summaryLine,
    cycle.reconciliation.summaryLine,
    cycle.auditDigest,
    brief.headline,
    String(turn),
  ]);

  const valid =
    cycle.reconciliation.auditMatchesPass &&
    (cycle.reconciliation.status !== 'drift' || cycle.governance.alertLevel === 'none');

  return {
    schema: '10m.agent20.idle-governance-cycle-attestation.v1',
    turn,
    reconcileStatus: cycle.reconciliation.status,
    stabilizationWave: cycle.pass.stabilization.wave,
    auditDigest: cycle.auditDigest,
    briefHeadline: brief.headline,
    fingerprint,
    valid,
  };
}

export function verifyIdleGovernanceCycleAttestation(
  cycle: O10IdleGovernanceComplianceCycleResult,
  attestation: O10IdleGovernanceCycleAttestation
): boolean {
  const rerun = attestIdleGovernanceComplianceCycle(cycle, attestation.turn);
  return (
    rerun.fingerprint === attestation.fingerprint &&
    rerun.reconcileStatus === attestation.reconcileStatus &&
    rerun.stabilizationWave === attestation.stabilizationWave
  );
}

export function runO10Agent20IdleGovernanceCycleAttestationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCycle: O10IdleGovernanceComplianceCycleResult = {
    schema: '10m.agent20.idle-governance-compliance-cycle.v1',
    auditDigest: 'idle_gov_audit entries=1 last_alert=none peak=t0',
    governance: {
      schema: '10m.agent20.idle-ops-governance.v1',
      alertLevel: 'none',
      remediationStepCount: 1,
      summaryLine: 'calm window',
      steward: { persisted: {} as never, throttled: false, reason: 'tier_nominal' },
      window: {
        queue: { maxDepth: 8, items: [] },
        deescalationState: {} as never,
        telemetry: [],
        summary: {
          schema: '10m.agent20.idle-ops-window.v1',
          turnsRun: 1,
          humanCommitCount: 1,
          peakEffectiveTier: 0,
          finalScheduleAction: 'execute_now',
          digestSummary: 'ok',
        },
        lastTurn: {} as never,
      },
    },
    pass: {
      schema: '10m.agent20.idle-governance-stabilization-pass.v1',
      governance: {} as never,
      remediationRun: {} as never,
      auditTrail: {
        schema: '10m.agent20.idle-governance-audit-trail.v1',
        entries: [
          {
            schema: '10m.agent20.idle-governance-audit.v1',
            turn: 2,
            alertLevel: 'none',
            peakTier: 0,
            appliedStepCount: 0,
            pendingHumanCommit: false,
            fingerprint: 'calm',
          },
        ],
      },
      stabilization: {
        schema: '10m.agent20.idle-governance-stabilization.v1',
        wave: 'idle_governance_calm',
        stabilized: true,
        auditDigest: 'idle_gov_audit entries=1',
        reportHeadline: 'ok',
        summaryLine: 'gov_stabilization wave=idle_governance_calm stabilized=true',
      },
    },
    reconciliation: {
      schema: '10m.agent20.idle-governance-reconciliation.v1',
      status: 'aligned',
      priorAlertLevel: null,
      deltaPeakTier: 0,
      auditMatchesPass: true,
      summaryLine: 'gov_reconcile status=aligned audit_ok=true delta_peak=0',
    },
  };
  mockCycle.pass.governance = mockCycle.governance;
  mockCycle.pass.remediationRun = {
    schema: '10m.agent20.governance-remediation-run.v1',
    plan: { schema: '10m.agent20.backpressure-remediation.v1', alertLevel: 'none', steps: [] },
    queue: { maxDepth: 8, items: [] },
    appliedKinds: ['none'],
    appliedStepCount: 0,
    pendingHumanCommit: false,
    summaryLine: 'run calm',
  };

  const att = attestIdleGovernanceComplianceCycle(mockCycle, 2);
  push('gov_att_valid', 'aligned calm cycle attestation valid', att.valid && att.fingerprint.startsWith('fnv1a_'));
  push('gov_att_verify', 'verify matches rerun fingerprint', verifyIdleGovernanceCycleAttestation(mockCycle, att));

  const drift = {
    ...mockCycle,
    reconciliation: { ...mockCycle.reconciliation, status: 'drift' as const, auditMatchesPass: false },
    governance: { ...mockCycle.governance, alertLevel: 'warn' },
  };
  const attDrift = attestIdleGovernanceComplianceCycle(drift, 3);
  push('gov_att_drift', 'drift with warn fails valid flag', attDrift.valid === false);

  push('gov_att_schema', 'attestation schema marker', att.schema === '10m.agent20.idle-governance-cycle-attestation.v1');

  return results;
}


// --- source: automation-idle-governance-assurance-pass.ts ---
  runIdleGovernanceComplianceCycle,
  type O10IdleGovernanceComplianceCycleResult,
} from './automation-idle-governance-reconciliation.js';

export interface O10IdleGovernanceWatchSchedule {
  schema: '10m.agent20.idle-governance-watch-schedule.v1';
  turnsUntilNextCycle: number;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
}

export interface O10IdleGovernanceAssurancePassResult {
  schema: '10m.agent20.idle-governance-assurance-pass.v1';
  cycle: O10IdleGovernanceComplianceCycleResult;
  briefMarkdown: string;
  attestationFingerprint: string;
  trendDirection: string;
  watch: O10IdleGovernanceWatchSchedule;
  summaryLine: string;
}

export function planIdleGovernanceWatchSchedule(
  escalationLevel: number,
  trendDirection: string
): O10IdleGovernanceWatchSchedule {
  if (escalationLevel >= 3 || trendDirection === 'degrading') {
    return {
      schema: '10m.agent20.idle-governance-watch-schedule.v1',
      turnsUntilNextCycle: 1,
      urgency: 'high',
      reason: 'escalation_or_degrading_trend',
    };
  }
  if (escalationLevel >= 1 || trendDirection === 'stable') {
    return {
      schema: '10m.agent20.idle-governance-watch-schedule.v1',
      turnsUntilNextCycle: 3,
      urgency: 'medium',
      reason: 'elevated_escalation_or_stable_band',
    };
  }
  return {
    schema: '10m.agent20.idle-governance-watch-schedule.v1',
    turnsUntilNextCycle: 6,
    urgency: 'low',
    reason: 'calm_improving_band',
  };
}

/** Round-11 assurance pass: compliance cycle + brief + attestation + trend + watch cadence. */
export function runIdleGovernanceAssurancePass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  turn: number
): O10IdleGovernanceAssurancePassResult {
  const priorTrail = createEmptyIdleGovernanceAuditTrail();
  const cycle = runIdleGovernanceComplianceCycle(spec, rule, turn, priorTrail);
  const brief = buildIdleGovernanceCopilotBriefFromCycle(cycle);
  const attestation = attestIdleGovernanceComplianceCycle(cycle, turn);
  const trend = analyzeIdleGovernanceAuditTrend(cycle.pass.auditTrail);
  const ladder = evaluateIdleGovernanceEscalationLadder(cycle.pass.auditTrail);
  const watch = planIdleGovernanceWatchSchedule(ladder.level, trend.direction);

  const summaryLine = [
    'gov_assurance',
    `attest=${attestation.valid}`,
    trend.summaryLine,
    `watch_in=${watch.turnsUntilNextCycle}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-assurance-pass.v1',
    cycle,
    briefMarkdown: brief.markdown,
    attestationFingerprint: attestation.fingerprint,
    trendDirection: trend.direction,
    watch,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceAssurancePassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'as1',
    name: 'Assurance sample',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calm = runIdleGovernanceAssurancePass(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 2,
      humanCommittedEvery: 1,
      idleMsStart: 0,
      idleMsStep: 0,
      consecutiveIdleStart: 0,
    },
    sampleRule,
    1
  );
  push(
    'gov_assurance_calm',
    'calm assurance schedules low urgency watch',
    calm.watch.urgency === 'low' && calm.cycle.reconciliation.auditMatchesPass
  );

  const stress = runIdleGovernanceAssurancePass(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 6,
      humanCommittedEvery: 0,
      idleMsStart: 250_000,
      idleMsStep: 100_000,
      consecutiveIdleStart: 10,
    },
    sampleRule,
    2
  );
  push(
    'gov_assurance_stress',
    'stressed assurance yields brief and fingerprint',
    stress.briefMarkdown.includes('co-pilot brief') &&
      stress.attestationFingerprint.startsWith('fnv1a_') &&
      stress.watch.urgency !== 'low'
  );

  push(
    'gov_assurance_schema',
    'assurance pass schema marker',
    calm.schema === '10m.agent20.idle-governance-assurance-pass.v1' &&
      calm.watch.schema === '10m.agent20.idle-governance-watch-schedule.v1'
  );

  push(
    'gov_assurance_summary',
    'summary bundles attestation and watch',
    calm.summaryLine.includes('gov_assurance') && calm.summaryLine.includes('watch_in=')
  );

  return results;
}


// --- source: automation-idle-governance-assurance-journal.ts ---

export interface O10IdleGovernanceAssuranceJournalEntry {
  schema: '10m.agent20.idle-governance-assurance-journal-entry.v1';
  turn: number;
  attestationFingerprint: string;
  reconcileStatus: string;
  trendDirection: string;
  watchUrgency: string;
  attestValid: boolean;
}

export interface O10IdleGovernanceAssuranceJournal {
  schema: '10m.agent20.idle-governance-assurance-journal.v1';
  entries: O10IdleGovernanceAssuranceJournalEntry[];
}

export function createEmptyIdleGovernanceAssuranceJournal(): O10IdleGovernanceAssuranceJournal {
  return { schema: '10m.agent20.idle-governance-assurance-journal.v1', entries: [] };
}

export function appendIdleGovernanceAssuranceJournalEntry(
  journal: O10IdleGovernanceAssuranceJournal,
  pass: O10IdleGovernanceAssurancePassResult,
  turn: number,
  attestValid: boolean
): O10IdleGovernanceAssuranceJournal {
  const entry: O10IdleGovernanceAssuranceJournalEntry = {
    schema: '10m.agent20.idle-governance-assurance-journal-entry.v1',
    turn,
    attestationFingerprint: pass.attestationFingerprint,
    reconcileStatus: pass.cycle.reconciliation.status,
    trendDirection: pass.trendDirection,
    watchUrgency: pass.watch.urgency,
    attestValid,
  };
  return { schema: journal.schema, entries: [...journal.entries, entry].slice(-48) };
}

export function formatIdleGovernanceAssuranceJournalDigest(journal: O10IdleGovernanceAssuranceJournal): string {
  if (journal.entries.length === 0) return 'gov_assurance_journal entries=0';
  const last = journal.entries[journal.entries.length - 1];
  return `gov_assurance_journal entries=${journal.entries.length} last_urgency=${last.watchUrgency} valid=${last.attestValid}`;
}

export function runO10Agent20IdleGovernanceAssuranceJournalSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let journal = createEmptyIdleGovernanceAssuranceJournal();
  push('gov_journal_empty', 'empty journal digest', formatIdleGovernanceAssuranceJournalDigest(journal).includes('entries=0'));

  const mockPass: O10IdleGovernanceAssurancePassResult = {
    schema: '10m.agent20.idle-governance-assurance-pass.v1',
    attestationFingerprint: 'fnv1a_abc',
    trendDirection: 'stable',
    briefMarkdown: '',
    summaryLine: 'gov_assurance',
    watch: {
      schema: '10m.agent20.idle-governance-watch-schedule.v1',
      turnsUntilNextCycle: 3,
      urgency: 'medium',
      reason: 'test',
    },
    cycle: {
      schema: '10m.agent20.idle-governance-compliance-cycle.v1',
      auditDigest: 'd',
      governance: {} as never,
      pass: {} as never,
      reconciliation: {
        schema: '10m.agent20.idle-governance-reconciliation.v1',
        status: 'aligned',
        priorAlertLevel: null,
        deltaPeakTier: 0,
        auditMatchesPass: true,
        summaryLine: 'ok',
      },
    },
  };

  journal = appendIdleGovernanceAssuranceJournalEntry(journal, mockPass, 2, true);
  push('gov_journal_append', 'append records urgency and fingerprint', journal.entries.length === 1 && journal.entries[0].attestationFingerprint === 'fnv1a_abc');

  journal = appendIdleGovernanceAssuranceJournalEntry(journal, { ...mockPass, watch: { ...mockPass.watch, urgency: 'high' } }, 3, false);
  push('gov_journal_digest', 'digest reflects last entry', formatIdleGovernanceAssuranceJournalDigest(journal).includes('last_urgency=high'));

  push('gov_journal_schema', 'journal schema marker', journal.schema === '10m.agent20.idle-governance-assurance-journal.v1');

  return results;
}


// --- source: automation-idle-governance-assurance-rollup.ts ---

export interface O10IdleGovernanceAssuranceRollupResult {
  schema: '10m.agent20.idle-governance-assurance-rollup.v1';
  entryCount: number;
  validRatio: number;
  highUrgencyCount: number;
  dominantTrend: string;
  recommendation: string;
  summaryLine: string;
}

/** Roll up assurance journal entries for executive / replay dashboards. */
export function rollupIdleGovernanceAssuranceJournal(
  journal: O10IdleGovernanceAssuranceJournal
): O10IdleGovernanceAssuranceRollupResult {
  const entries = journal.entries;
  if (entries.length === 0) {
    return {
      schema: '10m.agent20.idle-governance-assurance-rollup.v1',
      entryCount: 0,
      validRatio: 0,
      highUrgencyCount: 0,
      dominantTrend: 'none',
      recommendation: 'run_initial_assurance_pass',
      summaryLine: 'gov_assurance_rollup entries=0',
    };
  }

  const validRatio = entries.filter(e => e.attestValid).length / entries.length;
  const highUrgencyCount = entries.filter(e => e.watchUrgency === 'high').length;

  const trendCounts = new Map<string, number>();
  for (const e of entries) {
    trendCounts.set(e.trendDirection, (trendCounts.get(e.trendDirection) ?? 0) + 1);
  }
  let dominantTrend = 'stable';
  let max = 0;
  for (const [trend, count] of trendCounts) {
    if (count > max) {
      max = count;
      dominantTrend = trend;
    }
  }

  let recommendation = 'continue_scheduled_watch';
  if (validRatio < 0.5 || highUrgencyCount >= Math.ceil(entries.length / 2)) {
    recommendation = 'escalate_to_human_takeover';
  } else if (dominantTrend === 'degrading') {
    recommendation = 'tighten_watch_cadence';
  } else if (validRatio >= 0.9 && dominantTrend === 'improving') {
    recommendation = 'relax_watch_cadence';
  }

  const summaryLine = [
    'gov_assurance_rollup',
    `entries=${entries.length}`,
    `valid_ratio=${validRatio.toFixed(2)}`,
    `high_urgency=${highUrgencyCount}`,
    `trend=${dominantTrend}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: entries.length,
    validRatio,
    highUrgencyCount,
    dominantTrend,
    recommendation,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceAssuranceRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = rollupIdleGovernanceAssuranceJournal({
    schema: '10m.agent20.idle-governance-assurance-journal.v1',
    entries: [],
  });
  push('gov_rollup_empty', 'empty journal recommends initial pass', empty.recommendation === 'run_initial_assurance_pass');

  const mk = (trend: string, urgency: string, valid: boolean, turn: number) => ({
    schema: '10m.agent20.idle-governance-assurance-journal-entry.v1' as const,
    turn,
    attestationFingerprint: `f${turn}`,
    reconcileStatus: 'aligned',
    trendDirection: trend,
    watchUrgency: urgency,
    attestValid: valid,
  });

  const healthy = rollupIdleGovernanceAssuranceJournal({
    schema: '10m.agent20.idle-governance-assurance-journal.v1',
    entries: [mk('improving', 'low', true, 1), mk('improving', 'low', true, 2)],
  });
  push('gov_rollup_relax', 'healthy journal may relax cadence', healthy.recommendation === 'relax_watch_cadence');

  const stressed = rollupIdleGovernanceAssuranceJournal({
    schema: '10m.agent20.idle-governance-assurance-journal.v1',
    entries: [mk('degrading', 'high', false, 1), mk('degrading', 'high', false, 2)],
  });
  push('gov_rollup_escalate', 'stressed journal escalates takeover', stressed.recommendation === 'escalate_to_human_takeover');

  push('gov_rollup_schema', 'rollup schema marker', stressed.schema === '10m.agent20.idle-governance-assurance-rollup.v1');

  return results;
}


// --- source: automation-idle-governance-sustained-watch.ts ---
  appendIdleGovernanceAssuranceJournalEntry,
  createEmptyIdleGovernanceAssuranceJournal,
  formatIdleGovernanceAssuranceJournalDigest,
  type O10IdleGovernanceAssuranceJournal,
} from './automation-idle-governance-assurance-journal.js';
  planIdleGovernanceWatchSchedule,
  type O10IdleGovernanceAssurancePassResult,
} from './automation-idle-governance-assurance-pass.js';
  createEmptyIdleGovernanceAuditTrail,
  type O10IdleGovernanceAuditTrail,
} from './automation-idle-governance-audit-trail.js';

export interface O10IdleGovernanceSustainedWatchResult {
  schema: '10m.agent20.idle-governance-sustained-watch.v1';
  cyclesRun: number;
  journal: O10IdleGovernanceAssuranceJournal;
  rollup: ReturnType<typeof rollupIdleGovernanceAssuranceJournal>;
  finalTrail: O10IdleGovernanceAuditTrail;
  lastPass: O10IdleGovernanceAssurancePassResult;
  summaryLine: string;
}

function buildAssurancePassFromCycle(
  cycle: ReturnType<typeof runIdleGovernanceComplianceCycle>,
  turn: number
): O10IdleGovernanceAssurancePassResult {
  const brief = buildIdleGovernanceCopilotBriefFromCycle(cycle);
  const attestation = attestIdleGovernanceComplianceCycle(cycle, turn);
  const trend = analyzeIdleGovernanceAuditTrend(cycle.pass.auditTrail);
  const ladder = evaluateIdleGovernanceEscalationLadder(cycle.pass.auditTrail);
  const watch = planIdleGovernanceWatchSchedule(ladder.level, trend.direction);
  return {
    schema: '10m.agent20.idle-governance-assurance-pass.v1',
    cycle,
    briefMarkdown: brief.markdown,
    attestationFingerprint: attestation.fingerprint,
    trendDirection: trend.direction,
    watch,
    summaryLine: [
      'gov_assurance',
      `attest=${attestation.valid}`,
      trend.summaryLine,
      `watch_in=${watch.turnsUntilNextCycle}`,
    ].join(' '),
  };
}

/** Multi-cycle sustained watch with accumulating audit trail and assurance journal. */
export function runIdleGovernanceSustainedWatch(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  cycleCount: number
): O10IdleGovernanceSustainedWatchResult {
  let trail = createEmptyIdleGovernanceAuditTrail();
  let journal = createEmptyIdleGovernanceAssuranceJournal();
  let lastPass!: O10IdleGovernanceAssurancePassResult;
  const runs = Math.max(1, Math.min(cycleCount, 8));

  for (let i = 0; i < runs; i++) {
    const turn = startTurn + i;
    const cycle = runIdleGovernanceComplianceCycle(spec, rule, turn, trail);
    trail = cycle.pass.auditTrail;
    lastPass = buildAssurancePassFromCycle(cycle, turn);
    const attestation = attestIdleGovernanceComplianceCycle(cycle, turn);
    journal = appendIdleGovernanceAssuranceJournalEntry(journal, lastPass, turn, attestation.valid);
  }

  const rollup = rollupIdleGovernanceAssuranceJournal(journal);
  const summaryLine = [
    'gov_sustained_watch',
    `cycles=${runs}`,
    formatIdleGovernanceAssuranceJournalDigest(journal),
    rollup.summaryLine,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-sustained-watch.v1',
    cyclesRun: runs,
    journal,
    rollup,
    finalTrail: trail,
    lastPass,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceSustainedWatchSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'sw1',
    name: 'Sustained watch',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const watch = runIdleGovernanceSustainedWatch(calmSpec, sampleRule, 1, 3);
  push(
    'gov_sustained_calm',
    'multi-cycle calm watch fills journal',
    watch.cyclesRun === 3 && watch.journal.entries.length === 3 && watch.finalTrail.entries.length === 3
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 5,
    humanCommittedEvery: 0,
    idleMsStart: 180_000,
    idleMsStep: 120_000,
    consecutiveIdleStart: 6,
  };
  const stressWatch = runIdleGovernanceSustainedWatch(stressSpec, sampleRule, 10, 2);
  push(
    'gov_sustained_stress',
    'stressed sustained watch produces rollup recommendation',
    stressWatch.rollup.entryCount === 2 && stressWatch.summaryLine.includes('gov_sustained_watch')
  );

  push('gov_sustained_schema', 'sustained watch schema marker', watch.schema === '10m.agent20.idle-governance-sustained-watch.v1');

  push(
    'gov_sustained_last',
    'last pass carries attestation fingerprint',
    watch.lastPass.attestationFingerprint.startsWith('fnv1a_')
  );

  return results;
}


// --- source: automation-idle-governance-watch-replay-tape.ts ---

export interface O10IdleGovernanceReplayFrame {
  schema: '10m.agent20.idle-governance-replay-frame.v1';
  label: string;
  turn: number;
  digest: string;
}

export interface O10IdleGovernanceReplayTape {
  schema: '10m.agent20.idle-governance-replay-tape.v1';
  frameCount: number;
  frames: O10IdleGovernanceReplayFrame[];
  rollupRecommendation: string;
}

/** Materialize sustained-watch journal into a replay-friendly tape for Agent 24 hooks. */
export function buildIdleGovernanceReplayTapeFromWatch(
  watch: O10IdleGovernanceSustainedWatchResult
): O10IdleGovernanceReplayTape {
  const frames: O10IdleGovernanceReplayFrame[] = watch.journal.entries.map((entry, idx) => ({
    schema: '10m.agent20.idle-governance-replay-frame.v1',
    label: `gov_watch_${entry.turn}`,
    turn: entry.turn,
    digest: `${entry.attestationFingerprint}|${entry.reconcileStatus}|${entry.watchUrgency}|${entry.attestValid ? 1 : 0}`,
  }));

  return {
    schema: '10m.agent20.idle-governance-replay-tape.v1',
    frameCount: frames.length,
    frames,
    rollupRecommendation: watch.rollup.recommendation,
  };
}

export function verifyIdleGovernanceReplayTapeDeterminism(
  watch: O10IdleGovernanceSustainedWatchResult,
  tape: O10IdleGovernanceReplayTape
): { ok: boolean; mismatches: string[] } {
  const rerun = buildIdleGovernanceReplayTapeFromWatch(watch);
  const mismatches: string[] = [];
  if (rerun.frameCount !== tape.frameCount) {
    mismatches.push(`frames:${rerun.frameCount}!=${tape.frameCount}`);
  }
  const n = Math.min(rerun.frames.length, tape.frames.length);
  for (let i = 0; i < n; i++) {
    if (rerun.frames[i].digest !== tape.frames[i].digest) {
      mismatches.push(`${tape.frames[i].label}:digest`);
    }
  }
  if (rerun.rollupRecommendation !== tape.rollupRecommendation) {
    mismatches.push('rollup_recommendation');
  }
  return { ok: mismatches.length === 0, mismatches };
}

export function buildIdleGovernanceReplayTapeFromJournal(
  journal: O10IdleGovernanceAssuranceJournal,
  rollupRecommendation: string
): O10IdleGovernanceReplayTape {
  const frames = journal.entries.map(entry => ({
    schema: '10m.agent20.idle-governance-replay-frame.v1' as const,
    label: `gov_journal_${entry.turn}`,
    turn: entry.turn,
    digest: `${entry.trendDirection}|${entry.watchUrgency}|${entry.attestValid ? 1 : 0}`,
  }));
  return {
    schema: '10m.agent20.idle-governance-replay-tape.v1',
    frameCount: frames.length,
    frames,
    rollupRecommendation,
  };
}

export function runO10Agent20IdleGovernanceWatchReplayTapeSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockWatch: O10IdleGovernanceSustainedWatchResult = {
    schema: '10m.agent20.idle-governance-sustained-watch.v1',
    cyclesRun: 2,
    summaryLine: 'mock',
    finalTrail: { schema: '10m.agent20.idle-governance-audit-trail.v1', entries: [] },
    lastPass: {} as never,
    journal: {
      schema: '10m.agent20.idle-governance-assurance-journal.v1',
      entries: [
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1',
          turn: 1,
          attestationFingerprint: 'fnv1a_aa',
          reconcileStatus: 'aligned',
          trendDirection: 'stable',
          watchUrgency: 'low',
          attestValid: true,
        },
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1',
          turn: 2,
          attestationFingerprint: 'fnv1a_bb',
          reconcileStatus: 'aligned',
          trendDirection: 'improving',
          watchUrgency: 'low',
          attestValid: true,
        },
      ],
    },
    rollup: {
      schema: '10m.agent20.idle-governance-assurance-rollup.v1',
      entryCount: 2,
      validRatio: 1,
      highUrgencyCount: 0,
      dominantTrend: 'improving',
      recommendation: 'relax_watch_cadence',
      summaryLine: 'rollup ok',
    },
  };

  const tape = buildIdleGovernanceReplayTapeFromWatch(mockWatch);
  push('gov_replay_frames', 'watch journal becomes replay frames', tape.frameCount === 2 && tape.frames[0].label === 'gov_watch_1');
  const verify = verifyIdleGovernanceReplayTapeDeterminism(mockWatch, tape);
  push('gov_replay_deterministic', 'tape rebuild is deterministic', verify.ok);

  const journalTape = buildIdleGovernanceReplayTapeFromJournal(mockWatch.journal, 'continue_scheduled_watch');
  push('gov_replay_journal', 'journal-only tape preserves recommendation', journalTape.rollupRecommendation === 'continue_scheduled_watch');

  push('gov_replay_schema', 'replay tape schema marker', tape.schema === '10m.agent20.idle-governance-replay-tape.v1');

  return results;
}


// --- source: automation-idle-governance-program-charter.ts ---

export interface O10IdleGovernanceProgramCharter {
  schema: '10m.agent20.idle-governance-program-charter.v1';
  maxAutonomyTier: number;
  maxSustainedCycles: number;
  requireHumanCommit: boolean;
  stewardModeCap: 'autonomous_idle' | 'recommend' | 'watch_only';
  policyLine: string;
}

/** Translate assurance rollup into enforceable program charter caps. */
export function deriveIdleGovernanceProgramCharter(
  rollup: O10IdleGovernanceAssuranceRollupResult
): O10IdleGovernanceProgramCharter {
  switch (rollup.recommendation) {
    case 'escalate_to_human_takeover':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 0,
        maxSustainedCycles: 1,
        requireHumanCommit: true,
        stewardModeCap: 'watch_only',
        policyLine: 'charter hard_pause human_commit_required',
      };
    case 'tighten_watch_cadence':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 1,
        maxSustainedCycles: 3,
        requireHumanCommit: rollup.highUrgencyCount > 0,
        stewardModeCap: 'recommend',
        policyLine: 'charter tighten_watch recommend_cap',
      };
    case 'relax_watch_cadence':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 2,
        maxSustainedCycles: 8,
        requireHumanCommit: false,
        stewardModeCap: 'autonomous_idle',
        policyLine: 'charter relax_watch autonomous_cap',
      };
    case 'run_initial_assurance_pass':
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 1,
        maxSustainedCycles: 2,
        requireHumanCommit: false,
        stewardModeCap: 'recommend',
        policyLine: 'charter bootstrap_assurance',
      };
    default:
      return {
        schema: '10m.agent20.idle-governance-program-charter.v1',
        maxAutonomyTier: 2,
        maxSustainedCycles: 5,
        requireHumanCommit: false,
        stewardModeCap: 'autonomous_idle',
        policyLine: 'charter continue_scheduled_watch',
      };
  }
}

export function charterPermitsSustainedWatchCycles(
  charter: O10IdleGovernanceProgramCharter,
  requestedCycles: number
): { permitted: boolean; effectiveCycles: number; reason: string } {
  const effective = Math.min(requestedCycles, charter.maxSustainedCycles);
  if (requestedCycles > charter.maxSustainedCycles) {
    return {
      permitted: effective > 0,
      effectiveCycles: effective,
      reason: 'charter_cycle_cap',
    };
  }
  return { permitted: true, effectiveCycles: effective, reason: 'charter_ok' };
}

export function runO10Agent20IdleGovernanceProgramCharterSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const escalate = deriveIdleGovernanceProgramCharter({
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: 2,
    validRatio: 0,
    highUrgencyCount: 2,
    dominantTrend: 'degrading',
    recommendation: 'escalate_to_human_takeover',
    summaryLine: 'bad',
  });
  push('gov_charter_escalate', 'escalate caps watch_only and human commit', escalate.stewardModeCap === 'watch_only' && escalate.requireHumanCommit);

  const relax = deriveIdleGovernanceProgramCharter({
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: 3,
    validRatio: 1,
    highUrgencyCount: 0,
    dominantTrend: 'improving',
    recommendation: 'relax_watch_cadence',
    summaryLine: 'good',
  });
  const permit = charterPermitsSustainedWatchCycles(relax, 10);
  push('gov_charter_cap', 'relax charter caps sustained cycles', permit.effectiveCycles === 8 && permit.reason === 'charter_cycle_cap');

  push('gov_charter_schema', 'charter schema marker', relax.schema === '10m.agent20.idle-governance-program-charter.v1');

  push('gov_charter_bootstrap', 'initial pass uses bootstrap policy', deriveIdleGovernanceProgramCharter({
    schema: '10m.agent20.idle-governance-assurance-rollup.v1',
    entryCount: 0,
    validRatio: 0,
    highUrgencyCount: 0,
    dominantTrend: 'none',
    recommendation: 'run_initial_assurance_pass',
    summaryLine: 'empty',
  }).policyLine.includes('bootstrap'));

  return results;
}


// --- source: automation-idle-governance-program-pass.ts ---
  buildIdleGovernanceReplayTapeFromWatch,
  verifyIdleGovernanceReplayTapeDeterminism,
} from './automation-idle-governance-watch-replay-tape.js';

export interface O10IdleGovernanceProgramPassResult {
  schema: '10m.agent20.idle-governance-program-pass.v1';
  requestedCycles: number;
  effectiveCycles: number;
  charterPolicyLine: string;
  watch: ReturnType<typeof runIdleGovernanceSustainedWatch>;
  replayTape: ReturnType<typeof buildIdleGovernanceReplayTapeFromWatch>;
  replayDeterministic: boolean;
  summaryLine: string;
}

/** Round-13 program pass: charter-gated sustained watch + replay tape export. */
export function runIdleGovernanceProgramPass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number
): O10IdleGovernanceProgramPassResult {
  const bootstrap = runIdleGovernanceSustainedWatch(spec, rule, startTurn, 1);
  const charter = deriveIdleGovernanceProgramCharter(bootstrap.rollup);
  const permit = charterPermitsSustainedWatchCycles(charter, requestedCycles);
  const effective = permit.effectiveCycles;

  const humanSpec =
    charter.requireHumanCommit && spec.humanCommittedEvery === 0
      ? { ...spec, humanCommittedEvery: 1 }
      : spec;

  const watch =
    effective <= 1
      ? bootstrap
      : runIdleGovernanceSustainedWatch(humanSpec, rule, startTurn, effective);

  const replayTape = buildIdleGovernanceReplayTapeFromWatch(watch);
  const replayDeterministic = verifyIdleGovernanceReplayTapeDeterminism(watch, replayTape).ok;

  const summaryLine = [
    'gov_program_pass',
    charter.policyLine,
    `cycles=${watch.cyclesRun}/${requestedCycles}`,
    `replay_frames=${replayTape.frameCount}`,
    `deterministic=${replayDeterministic}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-pass.v1',
    requestedCycles,
    effectiveCycles: watch.cyclesRun,
    charterPolicyLine: charter.policyLine,
    watch,
    replayTape,
    replayDeterministic,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramPassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'pp1',
    name: 'Program pass',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const pass = runIdleGovernanceProgramPass(calmSpec, sampleRule, 1, 4);
  push(
    'gov_program_calm',
    'calm program pass exports replay tape',
    pass.replayTape.frameCount >= 1 && pass.replayDeterministic && pass.summaryLine.includes('gov_program_pass')
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 220_000,
    idleMsStep: 100_000,
    consecutiveIdleStart: 9,
  };
  const stressPass = runIdleGovernanceProgramPass(stressSpec, sampleRule, 5, 6);
  push(
    'gov_program_stress',
    'stressed program pass respects charter cycle cap',
    stressPass.effectiveCycles <= 6 && stressPass.watch.journal.entries.length >= 1
  );

  push('gov_program_schema', 'program pass schema marker', pass.schema === '10m.agent20.idle-governance-program-pass.v1');

  push(
    'gov_program_charter',
    'program pass surfaces charter policy line',
    pass.charterPolicyLine.startsWith('charter')
  );

  return results;
}


// --- source: automation-idle-governance-program-attestation.ts ---

export interface O10IdleGovernanceProgramAttestation {
  schema: '10m.agent20.idle-governance-program-attestation.v1';
  replayFrameCount: number;
  effectiveCycles: number;
  replayDeterministic: boolean;
  charterPolicyLine: string;
  rollupRecommendation: string;
  digestChain: string;
  ok: boolean;
  notes: string[];
}

function fnv1aHex(text: string): string {
  let chain = 2166136261;
  for (let i = 0; i < text.length; i++) {
    chain ^= text.charCodeAt(i);
    chain = Math.imul(chain, 16777619);
  }
  return `o10govprog_${(chain >>> 0).toString(16).padStart(8, '0')}`;
}

/** Attest a program pass: replay determinism, cycle alignment, rollup recommendation present. */
export function attestIdleGovernanceProgramPass(
  pass: O10IdleGovernanceProgramPassResult
): O10IdleGovernanceProgramAttestation {
  const notes: string[] = [];
  const tape = pass.replayTape;
  const verify = verifyIdleGovernanceReplayTapeDeterminism(pass.watch, tape);

  if (!pass.replayDeterministic || !verify.ok) {
    notes.push('replay_nondeterministic');
  }
  if (tape.frameCount !== pass.watch.journal.entries.length) {
    notes.push(`frame_journal_mismatch:${tape.frameCount}!=${pass.watch.journal.entries.length}`);
  }
  if (pass.effectiveCycles !== pass.watch.cyclesRun) {
    notes.push('cycle_count_mismatch');
  }
  if (tape.rollupRecommendation !== pass.watch.rollup.recommendation) {
    notes.push('rollup_recommendation_mismatch');
  }

  const digestChain = fnv1aHex([
    pass.charterPolicyLine,
    tape.rollupRecommendation,
    tape.frames.map(f => f.digest).join('|'),
    String(pass.effectiveCycles),
  ].join('\n'));

  const ok = notes.length === 0;

  return {
    schema: '10m.agent20.idle-governance-program-attestation.v1',
    replayFrameCount: tape.frameCount,
    effectiveCycles: pass.effectiveCycles,
    replayDeterministic: pass.replayDeterministic && verify.ok,
    charterPolicyLine: pass.charterPolicyLine,
    rollupRecommendation: tape.rollupRecommendation,
    digestChain,
    ok,
    notes,
  };
}

export function verifyIdleGovernanceProgramAttestation(
  pass: O10IdleGovernanceProgramPassResult,
  attestation: O10IdleGovernanceProgramAttestation
): boolean {
  const rerun = attestIdleGovernanceProgramPass(pass);
  return rerun.digestChain === attestation.digestChain && rerun.ok === attestation.ok;
}

export function runO10Agent20IdleGovernanceProgramAttestationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockWatch = {
    schema: '10m.agent20.idle-governance-sustained-watch.v1' as const,
    cyclesRun: 2,
    summaryLine: 'watch',
    finalTrail: { schema: '10m.agent20.idle-governance-audit-trail.v1' as const, entries: [] },
    lastPass: {} as never,
    journal: {
      schema: '10m.agent20.idle-governance-assurance-journal.v1' as const,
      entries: [
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1' as const,
          turn: 1,
          attestationFingerprint: 'fnv1a_1',
          reconcileStatus: 'aligned',
          trendDirection: 'stable',
          watchUrgency: 'low',
          attestValid: true,
        },
        {
          schema: '10m.agent20.idle-governance-assurance-journal-entry.v1' as const,
          turn: 2,
          attestationFingerprint: 'fnv1a_2',
          reconcileStatus: 'aligned',
          trendDirection: 'stable',
          watchUrgency: 'low',
          attestValid: true,
        },
      ],
    },
    rollup: {
      schema: '10m.agent20.idle-governance-assurance-rollup.v1' as const,
      entryCount: 2,
      validRatio: 1,
      highUrgencyCount: 0,
      dominantTrend: 'stable',
      recommendation: 'continue_scheduled_watch',
      summaryLine: 'rollup',
    },
  };

  const replayTape = buildIdleGovernanceReplayTapeFromWatch(mockWatch);
  const replayDeterministic = verifyIdleGovernanceReplayTapeDeterminism(mockWatch, replayTape).ok;

  const mockPass: O10IdleGovernanceProgramPassResult = {
    schema: '10m.agent20.idle-governance-program-pass.v1',
    requestedCycles: 2,
    effectiveCycles: 2,
    charterPolicyLine: 'charter continue_scheduled_watch',
    replayDeterministic,
    summaryLine: 'mock',
    watch: mockWatch,
    replayTape,
  };

  const att = attestIdleGovernanceProgramPass(mockPass);
  push('gov_prog_att_ok', 'aligned mock pass attests ok', att.ok && att.digestChain.startsWith('o10govprog_'));
  push('gov_prog_att_verify', 'verify matches digest rerun', verifyIdleGovernanceProgramAttestation(mockPass, att));

  const badPass = {
    ...mockPass,
    replayDeterministic: false,
    replayTape: { ...mockPass.replayTape, rollupRecommendation: 'escalate_to_human_takeover' as const },
  };
  const badAtt = attestIdleGovernanceProgramPass(badPass);
  push('gov_prog_att_fail', 'mismatch yields notes and not ok', !badAtt.ok && badAtt.notes.length > 0);

  push('gov_prog_att_schema', 'program attestation schema marker', att.schema === '10m.agent20.idle-governance-program-attestation.v1');

  return results;
}


// --- source: automation-idle-governance-program-registry.ts ---

export interface O10IdleGovernanceProgramRegistryEntry {
  schema: '10m.agent20.idle-governance-program-registry-entry.v1';
  turn: number;
  digestChain: string;
  charterPolicyLine: string;
  rollupRecommendation: string;
  attestOk: boolean;
}

export interface O10IdleGovernanceProgramRegistry {
  schema: '10m.agent20.idle-governance-program-registry.v1';
  entries: O10IdleGovernanceProgramRegistryEntry[];
}

export function createEmptyIdleGovernanceProgramRegistry(): O10IdleGovernanceProgramRegistry {
  return { schema: '10m.agent20.idle-governance-program-registry.v1', entries: [] };
}

export function appendIdleGovernanceProgramRegistryEntry(
  registry: O10IdleGovernanceProgramRegistry,
  pass: O10IdleGovernanceProgramPassResult,
  attestation: O10IdleGovernanceProgramAttestation,
  turn: number
): O10IdleGovernanceProgramRegistry {
  const entry: O10IdleGovernanceProgramRegistryEntry = {
    schema: '10m.agent20.idle-governance-program-registry-entry.v1',
    turn,
    digestChain: attestation.digestChain,
    charterPolicyLine: pass.charterPolicyLine,
    rollupRecommendation: attestation.rollupRecommendation,
    attestOk: attestation.ok,
  };
  return { schema: registry.schema, entries: [...registry.entries, entry].slice(-32) };
}

export function formatIdleGovernanceProgramRegistryDigest(registry: O10IdleGovernanceProgramRegistry): string {
  if (registry.entries.length === 0) return 'gov_program_registry entries=0';
  const last = registry.entries[registry.entries.length - 1];
  return `gov_program_registry entries=${registry.entries.length} last_ok=${last.attestOk} rollup=${last.rollupRecommendation}`;
}

export function runO10Agent20IdleGovernanceProgramRegistrySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  let registry = createEmptyIdleGovernanceProgramRegistry();
  push('gov_prog_reg_empty', 'empty registry digest', formatIdleGovernanceProgramRegistryDigest(registry).includes('entries=0'));

  const mockAtt: O10IdleGovernanceProgramAttestation = {
    schema: '10m.agent20.idle-governance-program-attestation.v1',
    replayFrameCount: 1,
    effectiveCycles: 1,
    replayDeterministic: true,
    charterPolicyLine: 'charter ok',
    rollupRecommendation: 'continue_scheduled_watch',
    digestChain: 'o10govprog_deadbeef',
    ok: true,
    notes: [],
  };
  const mockPass: O10IdleGovernanceProgramPassResult = {
    schema: '10m.agent20.idle-governance-program-pass.v1',
    requestedCycles: 1,
    effectiveCycles: 1,
    charterPolicyLine: 'charter ok',
    replayDeterministic: true,
    summaryLine: 's',
    watch: {} as never,
    replayTape: {} as never,
  };

  registry = appendIdleGovernanceProgramRegistryEntry(registry, mockPass, mockAtt, 3);
  push('gov_prog_reg_append', 'append stores digest and rollup', registry.entries.length === 1 && registry.entries[0].digestChain.includes('o10govprog'));

  registry = appendIdleGovernanceProgramRegistryEntry(registry, mockPass, { ...mockAtt, ok: false, rollupRecommendation: 'escalate_to_human_takeover' }, 4);
  push('gov_prog_reg_digest', 'digest reflects last entry', formatIdleGovernanceProgramRegistryDigest(registry).includes('escalate_to_human_takeover'));

  push('gov_prog_reg_schema', 'registry schema marker', registry.schema === '10m.agent20.idle-governance-program-registry.v1');

  return results;
}


// --- source: automation-idle-governance-program-operations.ts ---
  appendIdleGovernanceProgramRegistryEntry,
  createEmptyIdleGovernanceProgramRegistry,
  formatIdleGovernanceProgramRegistryDigest,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramOperationsResult {
  schema: '10m.agent20.idle-governance-program-operations.v1';
  pass: ReturnType<typeof runIdleGovernanceProgramPass>;
  attestation: ReturnType<typeof attestIdleGovernanceProgramPass>;
  registry: O10IdleGovernanceProgramRegistry;
  registryDigest: string;
  operationsMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramOperationsMarkdown(
  pass: ReturnType<typeof runIdleGovernanceProgramPass>,
  attestation: ReturnType<typeof attestIdleGovernanceProgramPass>,
  registryDigest: string
): string {
  return [
    '## Agent 20 idle governance program operations',
    '',
    `- ${pass.summaryLine}`,
    `- attest_ok=${attestation.ok} digest=${attestation.digestChain}`,
    `- ${registryDigest}`,
    `- rollup=${attestation.rollupRecommendation}`,
    '',
  ].join('\n');
}

/** Round-14 operations bundle: program pass + attestation + registry append. */
export function runIdleGovernanceProgramOperations(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramOperationsResult {
  const pass = runIdleGovernanceProgramPass(spec, rule, startTurn, requestedCycles);
  const attestation = attestIdleGovernanceProgramPass(pass);
  const registry = appendIdleGovernanceProgramRegistryEntry(priorRegistry, pass, attestation, startTurn);
  const registryDigest = formatIdleGovernanceProgramRegistryDigest(registry);
  const operationsMarkdown = buildIdleGovernanceProgramOperationsMarkdown(pass, attestation, registryDigest);

  const summaryLine = [
    'gov_program_ops',
    `attest_ok=${attestation.ok}`,
    registryDigest,
    `frames=${attestation.replayFrameCount}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-operations.v1',
    pass,
    attestation,
    registry,
    registryDigest,
    operationsMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramOperationsSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'ops1',
    name: 'Program ops',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const ops = runIdleGovernanceProgramOperations(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_ops_calm',
    'calm operations attests and registers',
    ops.attestation.ok && ops.registry.entries.length === 1 && ops.operationsMarkdown.includes('program operations')
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 5,
    humanCommittedEvery: 0,
    idleMsStart: 200_000,
    idleMsStep: 120_000,
    consecutiveIdleStart: 7,
  };
  const ops2 = runIdleGovernanceProgramOperations(stressSpec, sampleRule, 4, 4, ops.registry);
  push(
    'gov_prog_ops_chain',
    'chained registry accumulates entries',
    ops2.registry.entries.length === 2 && ops2.summaryLine.includes('gov_program_ops')
  );

  push('gov_prog_ops_schema', 'operations schema marker', ops.schema === '10m.agent20.idle-governance-program-operations.v1');

  push(
    'gov_prog_ops_digest',
    'registry digest on operations result',
    ops.registryDigest.includes('entries=1') && ops2.registryDigest.includes('entries=2')
  );

  return results;
}


// --- source: automation-idle-governance-program-registry-rollup.ts ---

export interface O10IdleGovernanceProgramRegistryRollupResult {
  schema: '10m.agent20.idle-governance-program-registry-rollup.v1';
  entryCount: number;
  attestOkRatio: number;
  escalationCount: number;
  dominantRollup: string;
  recommendation: string;
  summaryLine: string;
}

/** Roll up program registry history for director-level dashboards. */
export function rollupIdleGovernanceProgramRegistry(
  registry: O10IdleGovernanceProgramRegistry
): O10IdleGovernanceProgramRegistryRollupResult {
  const entries = registry.entries;
  if (entries.length === 0) {
    return {
      schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
      entryCount: 0,
      attestOkRatio: 0,
      escalationCount: 0,
      dominantRollup: 'none',
      recommendation: 'run_program_operations',
      summaryLine: 'gov_program_registry_rollup entries=0',
    };
  }

  const attestOkRatio = entries.filter(e => e.attestOk).length / entries.length;
  const escalationCount = entries.filter(e => e.rollupRecommendation === 'escalate_to_human_takeover').length;

  const counts = new Map<string, number>();
  for (const e of entries) {
    counts.set(e.rollupRecommendation, (counts.get(e.rollupRecommendation) ?? 0) + 1);
  }
  let dominantRollup = 'continue_scheduled_watch';
  let max = 0;
  for (const [key, count] of counts) {
    if (count > max) {
      max = count;
      dominantRollup = key;
    }
  }

  let recommendation = 'maintain_program_cadence';
  if (escalationCount >= Math.ceil(entries.length / 2)) {
    recommendation = 'director_escalate_takeover';
  } else if (attestOkRatio < 0.6) {
    recommendation = 'director_audit_program_attestations';
  } else if (attestOkRatio >= 0.9 && escalationCount === 0) {
    recommendation = 'director_certify_program';
  }

  const summaryLine = [
    'gov_program_registry_rollup',
    `entries=${entries.length}`,
    `ok_ratio=${attestOkRatio.toFixed(2)}`,
    `escalations=${escalationCount}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
    entryCount: entries.length,
    attestOkRatio,
    escalationCount,
    dominantRollup,
    recommendation,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramRegistryRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = rollupIdleGovernanceProgramRegistry({
    schema: '10m.agent20.idle-governance-program-registry.v1',
    entries: [],
  });
  push('gov_prog_reg_roll_empty', 'empty registry rollup', empty.recommendation === 'run_program_operations');

  const mk = (ok: boolean, rollup: string, turn: number) => ({
    schema: '10m.agent20.idle-governance-program-registry-entry.v1' as const,
    turn,
    digestChain: `c${turn}`,
    charterPolicyLine: 'charter',
    rollupRecommendation: rollup,
    attestOk: ok,
  });

  const healthy = rollupIdleGovernanceProgramRegistry({
    schema: '10m.agent20.idle-governance-program-registry.v1',
    entries: [mk(true, 'continue_scheduled_watch', 1), mk(true, 'relax_watch_cadence', 2)],
  });
  push('gov_prog_reg_roll_certify', 'healthy registry certifies', healthy.recommendation === 'director_certify_program');

  const bad = rollupIdleGovernanceProgramRegistry({
    schema: '10m.agent20.idle-governance-program-registry.v1',
    entries: [mk(false, 'escalate_to_human_takeover', 1), mk(false, 'escalate_to_human_takeover', 2)],
  });
  push('gov_prog_reg_roll_escalate', 'failed escalations trigger director takeover', bad.recommendation === 'director_escalate_takeover');

  push('gov_prog_reg_roll_schema', 'registry rollup schema marker', bad.schema === '10m.agent20.idle-governance-program-registry-rollup.v1');

  return results;
}


// --- source: automation-idle-governance-program-compliance-score.ts ---

export interface O10IdleGovernanceProgramComplianceScore {
  schema: '10m.agent20.idle-governance-program-compliance-score.v1';
  score: number;
  band: 'red' | 'amber' | 'green';
  factors: string[];
  summaryLine: string;
}

/** Compute 0–100 compliance score from registry rollup + latest attestation. */
export function scoreIdleGovernanceProgramCompliance(
  rollup: O10IdleGovernanceProgramRegistryRollupResult,
  latestAttestation: O10IdleGovernanceProgramAttestation | null
): O10IdleGovernanceProgramComplianceScore {
  const factors: string[] = [];
  let score = 50;

  if (rollup.entryCount === 0) {
    return {
      schema: '10m.agent20.idle-governance-program-compliance-score.v1',
      score: 40,
      band: 'amber',
      factors: ['no_registry_history'],
      summaryLine: 'gov_program_compliance score=40 band=amber',
    };
  }

  score += Math.round(rollup.attestOkRatio * 35);
  factors.push(`ok_ratio=${rollup.attestOkRatio.toFixed(2)}`);

  score -= rollup.escalationCount * 12;
  if (rollup.escalationCount > 0) factors.push(`escalations=${rollup.escalationCount}`);

  if (latestAttestation) {
    if (latestAttestation.ok) score += 10;
    else score -= 15;
    if (latestAttestation.replayDeterministic) score += 5;
    else {
      score -= 10;
      factors.push('replay_nondeterministic');
    }
    factors.push(`latest_attest_ok=${latestAttestation.ok}`);
  }

  score = Math.max(0, Math.min(100, score));

  let band: O10IdleGovernanceProgramComplianceScore['band'] = 'amber';
  if (score >= 75) band = 'green';
  else if (score < 45) band = 'red';

  return {
    schema: '10m.agent20.idle-governance-program-compliance-score.v1',
    score,
    band,
    factors,
    summaryLine: `gov_program_compliance score=${score} band=${band}`,
  };
}

export function runO10Agent20IdleGovernanceProgramComplianceScoreSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const emptyScore = scoreIdleGovernanceProgramCompliance(
    {
      schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
      entryCount: 0,
      attestOkRatio: 0,
      escalationCount: 0,
      dominantRollup: 'none',
      recommendation: 'run_program_operations',
      summaryLine: 'empty',
    },
    null
  );
  push('gov_prog_score_empty', 'empty rollup yields amber baseline', emptyScore.band === 'amber' && emptyScore.score === 40);

  const healthyRollup = {
    schema: '10m.agent20.idle-governance-program-registry-rollup.v1' as const,
    entryCount: 3,
    attestOkRatio: 1,
    escalationCount: 0,
    dominantRollup: 'continue_scheduled_watch',
    recommendation: 'director_certify_program',
    summaryLine: 'ok',
  };
  const healthyScore = scoreIdleGovernanceProgramCompliance(healthyRollup, {
    schema: '10m.agent20.idle-governance-program-attestation.v1',
    replayFrameCount: 2,
    effectiveCycles: 2,
    replayDeterministic: true,
    charterPolicyLine: 'charter',
    rollupRecommendation: 'continue_scheduled_watch',
    digestChain: 'o10govprog_1',
    ok: true,
    notes: [],
  });
  push('gov_prog_score_green', 'healthy path reaches green band', healthyScore.band === 'green' && healthyScore.score >= 75);

  const badScore = scoreIdleGovernanceProgramCompliance(
    { ...healthyRollup, attestOkRatio: 0.2, escalationCount: 3 },
    {
      schema: '10m.agent20.idle-governance-program-attestation.v1',
      replayFrameCount: 1,
      effectiveCycles: 1,
      replayDeterministic: false,
      charterPolicyLine: 'charter',
      rollupRecommendation: 'escalate_to_human_takeover',
      digestChain: 'x',
      ok: false,
      notes: ['bad'],
    }
  );
  push('gov_prog_score_red', 'stress pulls score to red', badScore.band === 'red');

  push('gov_prog_score_schema', 'compliance score schema marker', badScore.schema === '10m.agent20.idle-governance-program-compliance-score.v1');

  return results;
}


// --- source: automation-idle-governance-program-director-pass.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramDirectorPassResult {
  schema: '10m.agent20.idle-governance-program-director-pass.v1';
  operations: ReturnType<typeof runIdleGovernanceProgramOperations>;
  registryRollup: ReturnType<typeof rollupIdleGovernanceProgramRegistry>;
  complianceScore: ReturnType<typeof scoreIdleGovernanceProgramCompliance>;
  directorMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramDirectorMarkdown(
  ops: ReturnType<typeof runIdleGovernanceProgramOperations>,
  rollup: ReturnType<typeof rollupIdleGovernanceProgramRegistry>,
  score: ReturnType<typeof scoreIdleGovernanceProgramCompliance>
): string {
  return [
    '## Agent 20 idle governance program director brief',
    '',
    `- ${score.summaryLine}`,
    `- ${rollup.summaryLine} recommendation=${rollup.recommendation}`,
    `- ${ops.summaryLine}`,
    '',
    ops.operationsMarkdown,
  ].join('\n');
}

/** Round-15 director pass: operations + registry rollup + compliance score. */
export function runIdleGovernanceProgramDirectorPass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramDirectorPassResult {
  const operations = runIdleGovernanceProgramOperations(spec, rule, startTurn, requestedCycles, priorRegistry);
  const registryRollup = rollupIdleGovernanceProgramRegistry(operations.registry);
  const complianceScore = scoreIdleGovernanceProgramCompliance(registryRollup, operations.attestation);
  const directorMarkdown = buildIdleGovernanceProgramDirectorMarkdown(operations, registryRollup, complianceScore);

  const summaryLine = [
    'gov_program_director',
    complianceScore.summaryLine,
    registryRollup.recommendation,
    `registry_entries=${registryRollup.entryCount}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-director-pass.v1',
    operations,
    registryRollup,
    complianceScore,
    directorMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramDirectorPassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'dir1',
    name: 'Director pass',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const director = runIdleGovernanceProgramDirectorPass(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_director_calm',
    'calm director pass produces markdown and score',
    director.directorMarkdown.includes('director brief') &&
      director.registryRollup.entryCount === 1 &&
      director.summaryLine.includes('gov_program_director')
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 240_000,
    idleMsStep: 110_000,
    consecutiveIdleStart: 10,
  };
  const director2 = runIdleGovernanceProgramDirectorPass(stressSpec, sampleRule, 5, 4, director.operations.registry);
  push(
    'gov_prog_director_chain',
    'chained director pass rolls up registry',
    director2.registryRollup.entryCount === 2 && director2.complianceScore.score >= 0
  );

  push('gov_prog_director_schema', 'director pass schema marker', director.schema === '10m.agent20.idle-governance-program-director-pass.v1');

  push(
    'gov_prog_director_rollup',
    'rollup recommendation present',
    director2.registryRollup.recommendation.length > 0 && director2.registryRollup.summaryLine.includes('gov_program_registry_rollup')
  );

  return results;
}


// --- source: automation-idle-governance-program-remediation-plan.ts ---

export interface O10IdleGovernanceProgramRemediationItem {
  priority: number;
  actionKey: string;
  rationale: string;
}

export interface O10IdleGovernanceProgramRemediationPlan {
  schema: '10m.agent20.idle-governance-program-remediation-plan.v1';
  items: O10IdleGovernanceProgramRemediationItem[];
  summaryLine: string;
  planMarkdown: string;
}

function buildRemediationPlanMarkdown(items: O10IdleGovernanceProgramRemediationItem[]): string {
  const lines = ['## Agent 20 idle governance remediation plan', ''];
  for (const item of items) {
    lines.push(`- [p${item.priority}] \`${item.actionKey}\` — ${item.rationale}`);
  }
  lines.push('');
  return lines.join('\n');
}

/** Round-16 remediation backlog from compliance band + registry rollup recommendation. */
export function buildIdleGovernanceProgramRemediationPlan(
  compliance: O10IdleGovernanceProgramComplianceScore,
  rollup: O10IdleGovernanceProgramRegistryRollupResult
): O10IdleGovernanceProgramRemediationPlan {
  const items: O10IdleGovernanceProgramRemediationItem[] = [];

  if (compliance.band === 'red') {
    items.push({
      priority: 1,
      actionKey: 'pause_autonomous_idle_steward',
      rationale: 'Compliance band red — latch manual override until attestation recovers.',
    });
    items.push({
      priority: 2,
      actionKey: 'run_program_attestation_audit',
      rationale: 'Reconcile failed attestations against replay tape frames.',
    });
  } else if (compliance.band === 'amber') {
    items.push({
      priority: 1,
      actionKey: 'tighten_watch_cadence',
      rationale: 'Amber band — increase sustained watch frequency for one ops window.',
    });
    items.push({
      priority: 2,
      actionKey: 'refresh_program_charter',
      rationale: 'Re-read charter policy line before next program pass.',
    });
  } else {
    items.push({
      priority: 1,
      actionKey: 'maintain_program_cadence',
      rationale: 'Green band — continue scheduled program operations.',
    });
  }

  if (rollup.recommendation === 'director_escalate_takeover') {
    items.push({
      priority: 0,
      actionKey: 'escalate_human_takeover',
      rationale: 'Registry rollup recommends director escalation to human takeover.',
    });
  } else if (rollup.recommendation === 'director_audit_program_attestations') {
    items.push({
      priority: 1,
      actionKey: 'audit_program_attestations',
      rationale: 'Registry rollup flagged low attest ok ratio.',
    });
  }

  items.sort((a, b) => a.priority - b.priority);

  const summaryLine = [
    'gov_program_remediation',
    `band=${compliance.band}`,
    `items=${items.length}`,
    `rollup=${rollup.recommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-remediation-plan.v1',
    items,
    summaryLine,
    planMarkdown: buildRemediationPlanMarkdown(items),
  };
}

export function runO10Agent20IdleGovernanceProgramRemediationPlanSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const rollupBase: O10IdleGovernanceProgramRegistryRollupResult = {
    schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
    entryCount: 2,
    attestOkRatio: 0.5,
    escalationCount: 0,
    dominantRollup: 'continue_scheduled_watch',
    recommendation: 'director_audit_program_attestations',
    summaryLine: 'rollup',
  };

  const amberPlan = buildIdleGovernanceProgramRemediationPlan(
    {
      schema: '10m.agent20.idle-governance-program-compliance-score.v1',
      score: 55,
      band: 'amber',
      factors: [],
      summaryLine: 'amber',
    },
    rollupBase
  );
  push(
    'gov_prog_remed_amber',
    'amber plan includes watch + audit actions',
    amberPlan.items.some(i => i.actionKey === 'tighten_watch_cadence') &&
      amberPlan.items.some(i => i.actionKey === 'audit_program_attestations')
  );

  const redPlan = buildIdleGovernanceProgramRemediationPlan(
    {
      schema: '10m.agent20.idle-governance-program-compliance-score.v1',
      score: 30,
      band: 'red',
      factors: ['stress'],
      summaryLine: 'red',
    },
    { ...rollupBase, recommendation: 'director_escalate_takeover', escalationCount: 2 }
  );
  push(
    'gov_prog_remed_red',
    'red plan prioritizes pause and takeover',
    redPlan.items[0]?.actionKey === 'escalate_human_takeover' &&
      redPlan.items.some(i => i.actionKey === 'pause_autonomous_idle_steward')
  );

  push(
    'gov_prog_remed_schema',
    'remediation plan schema marker',
    amberPlan.schema === '10m.agent20.idle-governance-program-remediation-plan.v1'
  );
  push(
    'gov_prog_remed_markdown',
    'plan markdown header present',
    amberPlan.planMarkdown.includes('remediation plan')
  );

  return results;
}


// --- source: automation-idle-governance-program-board-certification.ts ---

export type O10IdleGovernanceProgramBoardDecision = 'certify' | 'hold' | 'escalate';

export interface O10IdleGovernanceProgramBoardCertification {
  schema: '10m.agent20.idle-governance-program-board-certification.v1';
  decision: O10IdleGovernanceProgramBoardDecision;
  rationale: string[];
  certificationMarkdown: string;
  summaryLine: string;
}

function buildBoardCertificationMarkdown(
  decision: O10IdleGovernanceProgramBoardDecision,
  rationale: string[]
): string {
  return [
    '## Agent 20 idle governance board certification',
    '',
    `- decision=${decision}`,
    ...rationale.map(r => `- ${r}`),
    '',
  ].join('\n');
}

/** Round-16 board certification from director pass outputs + remediation backlog. */
export function certifyIdleGovernanceProgramBoard(
  director: O10IdleGovernanceProgramDirectorPassResult,
  remediation: O10IdleGovernanceProgramRemediationPlan
): O10IdleGovernanceProgramBoardCertification {
  const compliance: O10IdleGovernanceProgramComplianceScore = director.complianceScore;
  const rollup = director.registryRollup;
  const rationale: string[] = [
    compliance.summaryLine,
    rollup.summaryLine,
    remediation.summaryLine,
  ];

  let decision: O10IdleGovernanceProgramBoardDecision = 'hold';

  if (remediation.items.some(i => i.actionKey === 'escalate_human_takeover')) {
    decision = 'escalate';
    rationale.push('Remediation backlog requires human takeover escalation.');
  } else if (compliance.band === 'green' && rollup.recommendation === 'director_certify_program') {
    decision = 'certify';
    rationale.push('Green compliance with director certify recommendation.');
  } else if (compliance.band === 'red') {
    decision = 'escalate';
    rationale.push('Red compliance band blocks certification.');
  } else if (compliance.band === 'amber') {
    decision = 'hold';
    rationale.push('Amber band — hold pending remediation execution.');
  } else if (compliance.band === 'green') {
    decision = 'certify';
    rationale.push('Green compliance — board certifies program cadence.');
  }

  const summaryLine = ['gov_program_board', `decision=${decision}`, `score=${compliance.score}`].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-board-certification.v1',
    decision,
    rationale,
    certificationMarkdown: buildBoardCertificationMarkdown(decision, rationale),
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramBoardCertificationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockDirector = (band: 'red' | 'amber' | 'green', rollupRec: string, score: number) =>
    ({
      schema: '10m.agent20.idle-governance-program-director-pass.v1',
      operations: {} as O10IdleGovernanceProgramDirectorPassResult['operations'],
      registryRollup: {
        schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
        entryCount: 1,
        attestOkRatio: band === 'green' ? 1 : 0.4,
        escalationCount: 0,
        dominantRollup: 'continue_scheduled_watch',
        recommendation: rollupRec,
        summaryLine: 'rollup',
      },
      complianceScore: {
        schema: '10m.agent20.idle-governance-program-compliance-score.v1',
        score,
        band,
        factors: [],
        summaryLine: `band=${band}`,
      },
      directorMarkdown: 'brief',
      summaryLine: 'director',
    }) satisfies O10IdleGovernanceProgramDirectorPassResult;

  const mockRemediation = (items: O10IdleGovernanceProgramRemediationPlan['items']) =>
    ({
      schema: '10m.agent20.idle-governance-program-remediation-plan.v1',
      items,
      summaryLine: 'remediation',
      planMarkdown: 'plan',
    }) satisfies O10IdleGovernanceProgramRemediationPlan;

  const certify = certifyIdleGovernanceProgramBoard(
    mockDirector('green', 'director_certify_program', 88),
    mockRemediation([{ priority: 1, actionKey: 'maintain_program_cadence', rationale: 'ok' }])
  );
  push('gov_prog_board_certify', 'green + certify recommendation certifies', certify.decision === 'certify');

  const hold = certifyIdleGovernanceProgramBoard(
    mockDirector('amber', 'director_audit_program_attestations', 52),
    mockRemediation([{ priority: 1, actionKey: 'tighten_watch_cadence', rationale: 'watch' }])
  );
  push('gov_prog_board_hold', 'amber band holds', hold.decision === 'hold');

  const escalate = certifyIdleGovernanceProgramBoard(
    mockDirector('red', 'director_escalate_takeover', 25),
    mockRemediation([{ priority: 0, actionKey: 'escalate_human_takeover', rationale: 'takeover' }])
  );
  push('gov_prog_board_escalate', 'takeover remediation escalates', escalate.decision === 'escalate');

  push(
    'gov_prog_board_schema',
    'board certification schema marker',
    certify.schema === '10m.agent20.idle-governance-program-board-certification.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-executive-pass.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramExecutivePassResult {
  schema: '10m.agent20.idle-governance-program-executive-pass.v1';
  director: ReturnType<typeof runIdleGovernanceProgramDirectorPass>;
  remediation: ReturnType<typeof buildIdleGovernanceProgramRemediationPlan>;
  board: ReturnType<typeof certifyIdleGovernanceProgramBoard>;
  executiveMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramExecutiveMarkdown(
  director: ReturnType<typeof runIdleGovernanceProgramDirectorPass>,
  remediation: ReturnType<typeof buildIdleGovernanceProgramRemediationPlan>,
  board: ReturnType<typeof certifyIdleGovernanceProgramBoard>
): string {
  return [
    '# Agent 20 idle governance executive pass',
    '',
    director.directorMarkdown,
    '',
    remediation.planMarkdown,
    '',
    board.certificationMarkdown,
  ].join('\n');
}

/** Round-16 executive pass: director + remediation plan + board certification. */
export function runIdleGovernanceProgramExecutivePass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramExecutivePassResult {
  const director = runIdleGovernanceProgramDirectorPass(spec, rule, startTurn, requestedCycles, priorRegistry);
  const remediation = buildIdleGovernanceProgramRemediationPlan(director.complianceScore, director.registryRollup);
  const board = certifyIdleGovernanceProgramBoard(director, remediation);
  const executiveMarkdown = buildIdleGovernanceProgramExecutiveMarkdown(director, remediation, board);

  const summaryLine = [
    'gov_program_executive',
    board.summaryLine,
    remediation.summaryLine,
    director.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-executive-pass.v1',
    director,
    remediation,
    board,
    executiveMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramExecutivePassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'exec1',
    name: 'Executive pass',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const executive = runIdleGovernanceProgramExecutivePass(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_exec_calm',
    'calm executive pass chains director remediation board',
    executive.executiveMarkdown.includes('executive pass') &&
      executive.director.registryRollup.entryCount === 1 &&
      executive.remediation.items.length >= 1 &&
      executive.board.decision.length > 0
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 240_000,
    idleMsStep: 110_000,
    consecutiveIdleStart: 10,
  };
  const executive2 = runIdleGovernanceProgramExecutivePass(
    stressSpec,
    sampleRule,
    5,
    4,
    executive.director.operations.registry
  );
  push(
    'gov_prog_exec_chain',
    'chained executive pass accumulates registry',
    executive2.director.registryRollup.entryCount === 2 && executive2.summaryLine.includes('gov_program_executive')
  );

  push(
    'gov_prog_exec_schema',
    'executive pass schema marker',
    executive.schema === '10m.agent20.idle-governance-program-executive-pass.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-subject-pass.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export type O10IdleGovernanceProgramSubjectClearance = 'cleared' | 'conditional' | 'blocked';

export interface O10IdleGovernanceProgramSubjectPassResult {
  schema: '10m.agent20.idle-governance-program-subject-pass.v1';
  executive: ReturnType<typeof runIdleGovernanceProgramExecutivePass>;
  clearance: O10IdleGovernanceProgramSubjectClearance;
  subjectMarkdown: string;
  summaryLine: string;
}

function mapBoardDecisionToSubjectClearance(
  decision: ReturnType<typeof runIdleGovernanceProgramExecutivePass>['board']['decision']
): O10IdleGovernanceProgramSubjectClearance {
  if (decision === 'certify') return 'cleared';
  if (decision === 'hold') return 'conditional';
  return 'blocked';
}

export function buildIdleGovernanceProgramSubjectMarkdown(
  executive: ReturnType<typeof runIdleGovernanceProgramExecutivePass>,
  clearance: O10IdleGovernanceProgramSubjectClearance
): string {
  return [
    '# Agent 20 idle governance subject pass',
    '',
    `- clearance=${clearance}`,
    `- board_decision=${executive.board.decision}`,
    '',
    executive.executiveMarkdown,
  ].join('\n');
}

/** Round-17 subject pass: executive stack mapped to subject clearance lanes. */
export function runIdleGovernanceProgramSubjectPass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramSubjectPassResult {
  const executive = runIdleGovernanceProgramExecutivePass(spec, rule, startTurn, requestedCycles, priorRegistry);
  const clearance = mapBoardDecisionToSubjectClearance(executive.board.decision);
  const subjectMarkdown = buildIdleGovernanceProgramSubjectMarkdown(executive, clearance);

  const summaryLine = [
    'gov_program_subject',
    `clearance=${clearance}`,
    executive.board.summaryLine,
    executive.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-subject-pass.v1',
    executive,
    clearance,
    subjectMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramSubjectPassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'subj1',
    name: 'Subject pass',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const subject = runIdleGovernanceProgramSubjectPass(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_subject_calm',
    'calm subject pass chains executive and markdown',
    subject.subjectMarkdown.includes('subject pass') &&
      subject.executive.director.registryRollup.entryCount === 1 &&
      subject.clearance.length > 0
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 240_000,
    idleMsStep: 110_000,
    consecutiveIdleStart: 10,
  };
  const subject2 = runIdleGovernanceProgramSubjectPass(
    stressSpec,
    sampleRule,
    5,
    4,
    subject.executive.director.operations.registry
  );
  push(
    'gov_prog_subject_chain',
    'chained subject pass accumulates registry',
    subject2.executive.director.registryRollup.entryCount === 2 &&
      subject2.summaryLine.includes('gov_program_subject')
  );

  push(
    'gov_prog_subject_schema',
    'subject pass schema marker',
    subject.schema === '10m.agent20.idle-governance-program-subject-pass.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-scale-wave-rollup.ts ---

export interface O10IdleGovernanceProgramScaleWaveRollupResult {
  schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1';
  waveRound: number;
  subjectPassCount: number;
  clearedCount: number;
  conditionalCount: number;
  blockedCount: number;
  meanComplianceScore: number;
  waveRecommendation: string;
  summaryLine: string;
}

/** Round-17 scale wave rollup across one or more subject passes in the same wave. */
export function rollupIdleGovernanceProgramScaleWave(
  waveRound: number,
  subjectPasses: O10IdleGovernanceProgramSubjectPassResult[]
): O10IdleGovernanceProgramScaleWaveRollupResult {
  const count = subjectPasses.length;
  if (count === 0) {
    return {
      schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
      waveRound,
      subjectPassCount: 0,
      clearedCount: 0,
      conditionalCount: 0,
      blockedCount: 0,
      meanComplianceScore: 0,
      waveRecommendation: 'run_subject_pass',
      summaryLine: `gov_program_scale_wave_rollup round=${waveRound} passes=0`,
    };
  }

  let clearedCount = 0;
  let conditionalCount = 0;
  let blockedCount = 0;
  let scoreSum = 0;

  for (const pass of subjectPasses) {
    if (pass.clearance === 'cleared') clearedCount += 1;
    else if (pass.clearance === 'conditional') conditionalCount += 1;
    else blockedCount += 1;
    scoreSum += pass.executive.director.complianceScore.score;
  }

  const meanComplianceScore = scoreSum / count;

  let waveRecommendation = 'continue_scale_wave';
  if (blockedCount >= Math.ceil(count / 2)) {
    waveRecommendation = 'halt_scale_wave_escalate';
  } else if (conditionalCount > clearedCount) {
    waveRecommendation = 'slow_scale_wave_remediate';
  } else if (clearedCount === count && meanComplianceScore >= 75) {
    waveRecommendation = 'advance_scale_wave';
  }

  const summaryLine = [
    'gov_program_scale_wave_rollup',
    `round=${waveRound}`,
    `passes=${count}`,
    `cleared=${clearedCount}`,
    `mean_score=${meanComplianceScore.toFixed(1)}`,
    `rec=${waveRecommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
    waveRound,
    subjectPassCount: count,
    clearedCount,
    conditionalCount,
    blockedCount,
    meanComplianceScore,
    waveRecommendation,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramScaleWaveRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = rollupIdleGovernanceProgramScaleWave(17, []);
  push('gov_prog_wave_roll_empty', 'empty wave rollup prompts subject pass', empty.waveRecommendation === 'run_subject_pass');

  const mockSubject = (clearance: 'cleared' | 'conditional' | 'blocked', score: number) =>
    ({
      schema: '10m.agent20.idle-governance-program-subject-pass.v1',
      clearance,
      summaryLine: 'subject',
      subjectMarkdown: 'md',
      executive: {
        schema: '10m.agent20.idle-governance-program-executive-pass.v1',
        summaryLine: 'exec',
        executiveMarkdown: 'exec',
        board: {
          schema: '10m.agent20.idle-governance-program-board-certification.v1',
          decision: clearance === 'cleared' ? 'certify' : clearance === 'conditional' ? 'hold' : 'escalate',
          rationale: [],
          certificationMarkdown: '',
          summaryLine: 'board',
        },
        remediation: {
          schema: '10m.agent20.idle-governance-program-remediation-plan.v1',
          items: [],
          summaryLine: 'rem',
          planMarkdown: '',
        },
        director: {
          schema: '10m.agent20.idle-governance-program-director-pass.v1',
          summaryLine: 'dir',
          directorMarkdown: '',
          operations: {} as O10IdleGovernanceProgramSubjectPassResult['executive']['director']['operations'],
          registryRollup: {
            schema: '10m.agent20.idle-governance-program-registry-rollup.v1',
            entryCount: 1,
            attestOkRatio: 1,
            escalationCount: 0,
            dominantRollup: 'continue_scheduled_watch',
            recommendation: 'director_certify_program',
            summaryLine: 'rollup',
          },
          complianceScore: {
            schema: '10m.agent20.idle-governance-program-compliance-score.v1',
            score,
            band: score >= 70 ? 'green' : score >= 45 ? 'amber' : 'red',
            factors: [],
            summaryLine: 'score',
          },
        },
      },
    }) satisfies O10IdleGovernanceProgramSubjectPassResult;

  const advance = rollupIdleGovernanceProgramScaleWave(17, [
    mockSubject('cleared', 88),
    mockSubject('cleared', 82),
  ]);
  push('gov_prog_wave_roll_advance', 'all cleared high scores advance wave', advance.waveRecommendation === 'advance_scale_wave');

  const halt = rollupIdleGovernanceProgramScaleWave(17, [
    mockSubject('blocked', 20),
    mockSubject('blocked', 25),
  ]);
  push('gov_prog_wave_roll_halt', 'majority blocked halts wave', halt.waveRecommendation === 'halt_scale_wave_escalate');

  push(
    'gov_prog_wave_roll_schema',
    'scale wave rollup schema marker',
    advance.schema === '10m.agent20.idle-governance-program-scale-wave-rollup.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-closeout.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveCloseoutResult {
  schema: '10m.agent20.idle-governance-program-wave-closeout.v1';
  waveRound: number;
  subject: ReturnType<typeof runIdleGovernanceProgramSubjectPass>;
  scaleWaveRollup: ReturnType<typeof rollupIdleGovernanceProgramScaleWave>;
  closeoutMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveCloseoutMarkdown(
  waveRound: number,
  subject: ReturnType<typeof runIdleGovernanceProgramSubjectPass>,
  scaleWaveRollup: ReturnType<typeof rollupIdleGovernanceProgramScaleWave>
): string {
  return [
    '# Agent 20 idle governance scale wave closeout',
    '',
    `- wave_round=${waveRound}`,
    `- ${scaleWaveRollup.summaryLine}`,
    '',
    subject.subjectMarkdown,
  ].join('\n');
}

/** Round-17 wave closeout: subject pass + scale wave rollup for the active wave round. */
export function runIdleGovernanceProgramWaveCloseout(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveCloseoutResult {
  const subject = runIdleGovernanceProgramSubjectPass(spec, rule, startTurn, requestedCycles, priorRegistry);
  const scaleWaveRollup = rollupIdleGovernanceProgramScaleWave(waveRound, [subject]);
  const closeoutMarkdown = buildIdleGovernanceProgramWaveCloseoutMarkdown(waveRound, subject, scaleWaveRollup);

  const summaryLine = [
    'gov_program_wave_closeout',
    `round=${waveRound}`,
    scaleWaveRollup.summaryLine,
    subject.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-closeout.v1',
    waveRound,
    subject,
    scaleWaveRollup,
    closeoutMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCloseoutSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'close1',
    name: 'Wave closeout',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const closeout = runIdleGovernanceProgramWaveCloseout(calmSpec, sampleRule, 1, 3, 17);
  push(
    'gov_prog_closeout_calm',
    'calm wave closeout chains subject and rollup',
    closeout.closeoutMarkdown.includes('scale wave closeout') &&
      closeout.waveRound === 17 &&
      closeout.scaleWaveRollup.subjectPassCount === 1
  );

  const closeout2 = runIdleGovernanceProgramWaveCloseout(
    calmSpec,
    sampleRule,
    3,
    2,
    17,
    closeout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_closeout_chain',
    'chained closeout accumulates registry',
    closeout2.subject.executive.director.registryRollup.entryCount === 2 &&
      closeout2.summaryLine.includes('gov_program_wave_closeout')
  );

  push(
    'gov_prog_closeout_schema',
    'wave closeout schema marker',
    closeout.schema === '10m.agent20.idle-governance-program-wave-closeout.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scorecard.ts ---

export type O10IdleGovernanceProgramWaveScorecardBand = 'green' | 'amber' | 'red';

export interface O10IdleGovernanceProgramWaveScorecardResult {
  schema: '10m.agent20.idle-governance-program-wave-scorecard.v1';
  waveRound: number;
  clearance: O10IdleGovernanceProgramWaveCloseoutResult['subject']['clearance'];
  waveRecommendation: string;
  meanComplianceScore: number;
  scorecardBand: O10IdleGovernanceProgramWaveScorecardBand;
  assemblyReady: boolean;
  scorecardMarkdown: string;
  summaryLine: string;
}

function bandFromCloseout(closeout: O10IdleGovernanceProgramWaveCloseoutResult): O10IdleGovernanceProgramWaveScorecardBand {
  const rec = closeout.scaleWaveRollup.waveRecommendation;
  if (rec === 'halt_scale_wave_escalate') return 'red';
  if (rec === 'slow_scale_wave_remediate' || closeout.subject.clearance === 'conditional') return 'amber';
  if (closeout.subject.clearance === 'blocked') return 'red';
  return 'green';
}

export function buildIdleGovernanceProgramWaveScorecardMarkdown(
  closeout: O10IdleGovernanceProgramWaveCloseoutResult,
  band: O10IdleGovernanceProgramWaveScorecardBand,
  assemblyReady: boolean
): string {
  return [
    '# Agent 20 idle governance wave scorecard',
    '',
    `- wave_round=${closeout.waveRound}`,
    `- band=${band}`,
    `- assembly_ready=${assemblyReady}`,
    `- ${closeout.scaleWaveRollup.summaryLine}`,
    '',
    closeout.closeoutMarkdown,
  ].join('\n');
}

/** Round-18 scorecard digest from a wave closeout for assembly gating. */
export function exportIdleGovernanceProgramWaveScorecard(
  closeout: O10IdleGovernanceProgramWaveCloseoutResult
): O10IdleGovernanceProgramWaveScorecardResult {
  const waveRound = closeout.waveRound;
  const clearance = closeout.subject.clearance;
  const waveRecommendation = closeout.scaleWaveRollup.waveRecommendation;
  const meanComplianceScore = closeout.scaleWaveRollup.meanComplianceScore;
  const scorecardBand = bandFromCloseout(closeout);

  const assemblyReady =
    scorecardBand !== 'red' &&
    waveRecommendation !== 'halt_scale_wave_escalate' &&
    waveRecommendation !== 'run_subject_pass';

  const scorecardMarkdown = buildIdleGovernanceProgramWaveScorecardMarkdown(closeout, scorecardBand, assemblyReady);

  const summaryLine = [
    'gov_program_wave_scorecard',
    `round=${waveRound}`,
    `band=${scorecardBand}`,
    `ready=${assemblyReady}`,
    `rec=${waveRecommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scorecard.v1',
    waveRound,
    clearance,
    waveRecommendation,
    meanComplianceScore,
    scorecardBand,
    assemblyReady,
    scorecardMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScorecardSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCloseout = (
    clearance: 'cleared' | 'conditional' | 'blocked',
    rec: string,
    score: number
  ): O10IdleGovernanceProgramWaveCloseoutResult =>
    ({
      schema: '10m.agent20.idle-governance-program-wave-closeout.v1',
      waveRound: 18,
      closeoutMarkdown: 'closeout',
      summaryLine: 'closeout',
      subject: {
        clearance,
        summaryLine: 'subj',
        subjectMarkdown: 'subj',
        schema: '10m.agent20.idle-governance-program-subject-pass.v1',
        executive: {} as O10IdleGovernanceProgramWaveCloseoutResult['subject']['executive'],
      },
      scaleWaveRollup: {
        schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
        waveRound: 18,
        subjectPassCount: 1,
        clearedCount: clearance === 'cleared' ? 1 : 0,
        conditionalCount: clearance === 'conditional' ? 1 : 0,
        blockedCount: clearance === 'blocked' ? 1 : 0,
        meanComplianceScore: score,
        waveRecommendation: rec,
        summaryLine: 'rollup',
      },
    }) satisfies O10IdleGovernanceProgramWaveCloseoutResult;

  const green = exportIdleGovernanceProgramWaveScorecard(
    mockCloseout('cleared', 'advance_scale_wave', 90)
  );
  push(
    'gov_prog_wave_score_green',
    'advance closeout yields green scorecard ready for assembly',
    green.scorecardBand === 'green' && green.assemblyReady === true
  );

  const red = exportIdleGovernanceProgramWaveScorecard(
    mockCloseout('blocked', 'halt_scale_wave_escalate', 12)
  );
  push(
    'gov_prog_wave_score_red',
    'halt recommendation yields red scorecard not assembly ready',
    red.scorecardBand === 'red' && red.assemblyReady === false
  );

  push(
    'gov_prog_wave_score_md',
    'scorecard markdown includes wave scorecard header',
    green.scorecardMarkdown.includes('wave scorecard') && green.scorecardMarkdown.includes('band=green')
  );

  push(
    'gov_prog_wave_score_schema',
    'wave scorecard schema marker',
    green.schema === '10m.agent20.idle-governance-program-wave-scorecard.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-closeout-compare.ts ---

export interface O10IdleGovernanceProgramWaveCloseoutCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-closeout-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareCloseoutFields(
  baseline: O10IdleGovernanceProgramWaveCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCloseoutResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.subject.clearance !== candidate.subject.clearance) {
    mismatches.push(
      `clearance ${baseline.subject.clearance} vs ${candidate.subject.clearance}`
    );
  }
  if (baseline.scaleWaveRollup.waveRecommendation !== candidate.scaleWaveRollup.waveRecommendation) {
    mismatches.push(
      `rec ${baseline.scaleWaveRollup.waveRecommendation} vs ${candidate.scaleWaveRollup.waveRecommendation}`
    );
  }
  const scoreDelta = Math.abs(
    baseline.scaleWaveRollup.meanComplianceScore - candidate.scaleWaveRollup.meanComplianceScore
  );
  if (scoreDelta > 0.001) {
    mismatches.push(`mean_score_delta ${scoreDelta.toFixed(4)}`);
  }
  if (baseline.scaleWaveRollup.subjectPassCount !== candidate.scaleWaveRollup.subjectPassCount) {
    mismatches.push('subject_pass_count');
  }
  return mismatches;
}

/** Round-18 twin closeout regression compare for deterministic wave exports. */
export function compareIdleGovernanceProgramWaveCloseouts(
  baseline: O10IdleGovernanceProgramWaveCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCloseoutResult
): O10IdleGovernanceProgramWaveCloseoutCompareResult {
  const mismatches = compareCloseoutFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_closeout_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-closeout-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCloseoutCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-closeout.v1',
    waveRound: 18,
    closeoutMarkdown: 'md',
    summaryLine: 'sum',
    subject: {
      schema: '10m.agent20.idle-governance-program-subject-pass.v1',
      clearance: 'cleared',
      subjectMarkdown: 's',
      summaryLine: 's',
      executive: {} as O10IdleGovernanceProgramWaveCloseoutResult['subject']['executive'],
    },
    scaleWaveRollup: {
      schema: '10m.agent20.idle-governance-program-scale-wave-rollup.v1',
      waveRound: 18,
      subjectPassCount: 1,
      clearedCount: 1,
      conditionalCount: 0,
      blockedCount: 0,
      meanComplianceScore: 84.5,
      waveRecommendation: 'advance_scale_wave',
      summaryLine: 'r',
    },
  });

  const a = twin();
  const b = twin();
  const ok = compareIdleGovernanceProgramWaveCloseouts(a, b);
  push('gov_prog_closeout_cmp_parity', 'identical closeouts report parity', ok.parityOk === true);

  const c = { ...twin(), subject: { ...twin().subject, clearance: 'blocked' as const } };
  const bad = compareIdleGovernanceProgramWaveCloseouts(a, c);
  push(
    'gov_prog_closeout_cmp_mismatch',
    'clearance drift surfaces mismatches',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('clearance'))
  );

  push(
    'gov_prog_closeout_cmp_schema',
    'closeout compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-closeout-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-assembly-gate.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveAssemblyGateResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-gate.v1';
  waveRound: number;
  gateOpen: boolean;
  primaryCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCloseout>;
  twinCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCloseout>;
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveCloseouts>;
  scorecard: ReturnType<typeof exportIdleGovernanceProgramWaveScorecard>;
  gateMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveAssemblyGateMarkdown(
  gateOpen: boolean,
  scorecard: ReturnType<typeof exportIdleGovernanceProgramWaveScorecard>,
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveCloseouts>
): string {
  return [
    '# Agent 20 idle governance wave assembly gate',
    '',
    `- gate_open=${gateOpen}`,
    `- ${compare.summaryLine}`,
    '',
    scorecard.scorecardMarkdown,
  ].join('\n');
}

/** Round-18 assembly gate: twin closeout parity + scorecard readiness for the wave round. */
export function gateIdleGovernanceProgramWaveAssembly(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyGateResult {
  const primaryCloseout = runIdleGovernanceProgramWaveCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinCloseout = runIdleGovernanceProgramWaveCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const compare = compareIdleGovernanceProgramWaveCloseouts(primaryCloseout, twinCloseout);
  const scorecard = exportIdleGovernanceProgramWaveScorecard(primaryCloseout);

  const gateOpen = compare.parityOk && scorecard.assemblyReady;
  const gateMarkdown = buildIdleGovernanceProgramWaveAssemblyGateMarkdown(gateOpen, scorecard, compare);

  const summaryLine = [
    'gov_program_wave_assembly_gate',
    `round=${waveRound}`,
    `open=${gateOpen}`,
    compare.summaryLine,
    scorecard.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-gate.v1',
    waveRound,
    gateOpen,
    primaryCloseout,
    twinCloseout,
    compare,
    scorecard,
    gateMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyGateSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'gate1',
    name: 'Wave assembly gate',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const gate = gateIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 18);
  push(
    'gov_prog_asm_gate_calm',
    'calm spec opens assembly gate with twin parity',
    gate.gateOpen === true &&
      gate.compare.parityOk === true &&
      gate.waveRound === 18 &&
      gate.gateMarkdown.includes('assembly gate')
  );

  const gate2 = gateIdleGovernanceProgramWaveAssembly(
    calmSpec,
    sampleRule,
    3,
    2,
    18,
    gate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_asm_gate_chain',
    'chained gate accumulates registry on primary closeout',
    gate2.primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      gate2.summaryLine.includes('gov_program_wave_assembly_gate')
  );

  push(
    'gov_prog_asm_gate_schema',
    'wave assembly gate schema marker',
    gate.schema === '10m.agent20.idle-governance-program-wave-assembly-gate.v1'
  );

  return results;
}


// --- source: index.ts ---


/** Full module self-test bundle for Agent 25 dev lab registration. */
export function runO10Agent20ModuleSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: O10SelfTestResult[];
} {
  const results: O10SelfTestResult[] = [...runO10Agent20NationalStewardSelfTests()];
  const hooks = createDefaultNationalStewardBridgeHooks();
  const gs = { turnCounter: 2, takeoverSession: { status: 'active' } };
  const st = {
    autoModeEnabled: true,
    autoModeSettings: { permissionMode: 'recommend_only' },
    playerControlMode: 'assistant',
  };
  const after = hooks.onAfterAutoModeEvaluation?.({
    gameState: gs,
    settings: st,
    persisted: createDefaultAutonomousIdleNationalPersisted(),
  });
  const interrupted = hooks.onPlayerInterruptTakeover?.({
    persisted: createDefaultAutonomousIdleNationalPersisted(),
    turn: 2,
  });
  results.push({
    id: 'bridge_auto',
    name: 'bridge updates path after automode (assistant pcm)',
    passed: after?.automationPath === 'v94_player_control_assistant',
  });
  results.push({
    id: 'bridge_interrupt',
    name: 'interrupt latches manual override',
    passed: interrupted?.playerOverride.latched === true,
  });
  results.push(...runO10Agent20IdleDepthSelfTests());
  results.push(...runO10Agent20TurnComputeSelfTests());
  results.push(...runO10Agent20TurnHooksSelfTests());
  results.push(...runO10Agent20SimulationSelfTests());
  results.push(...runO10Agent20IntentQueueSelfTests());
  results.push(...runO10Agent20DayBoundarySelfTests());
  results.push(...runO10Agent20ScenarioSelfTests());
  results.push(...runO10Agent20SoakProjectionSelfTests());
  results.push(...runO10Agent20ReplayTapeSelfTests());
  results.push(...runO10Agent20IntentScheduleSelfTests());
  results.push(...runO10Agent20IdleEscalationSelfTests());
  results.push(...runO10Agent20SoakReplayAttestationSelfTests());
  results.push(...runO10Agent20IntentBackpressureSelfTests());
  results.push(...runO10Agent20IdleDeescalationSelfTests());
  results.push(...runO10Agent20BackpressureTelemetrySelfTests());
  results.push(...runO10Agent20IdleOpsPipelineSelfTests());
  results.push(...runO10Agent20IdleOpsWindowSelfTests());
  results.push(...runO10Agent20BackpressureAlertsSelfTests());
  results.push(...runO10Agent20StewardIdleCoordinationSelfTests());
  results.push(...runO10Agent20BackpressureRemediationSelfTests());
  results.push(...runO10Agent20IdleOpsGovernanceSelfTests());
  results.push(...runO10Agent20IdleGovernanceReportSelfTests());
  results.push(...runO10Agent20GovernanceRemediationRunnerSelfTests());
  results.push(...runO10Agent20IdleGovernanceAuditTrailSelfTests());
  results.push(...runO10Agent20IdleGovernanceStabilizationSelfTests());
  results.push(...runO10Agent20IdleGovernanceReconciliationSelfTests());
  results.push(...runO10Agent20IdleGovernanceEscalationLadderSelfTests());
  results.push(...runO10Agent20IdleGovernanceCopilotBriefSelfTests());
  results.push(...runO10Agent20IdleGovernanceAuditTrendSelfTests());
  results.push(...runO10Agent20IdleGovernanceCycleAttestationSelfTests());
  results.push(...runO10Agent20IdleGovernanceAssurancePassSelfTests());
  results.push(...runO10Agent20IdleGovernanceAssuranceJournalSelfTests());
  results.push(...runO10Agent20IdleGovernanceAssuranceRollupSelfTests());
  results.push(...runO10Agent20IdleGovernanceSustainedWatchSelfTests());
  results.push(...runO10Agent20IdleGovernanceWatchReplayTapeSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramCharterSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramPassSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramAttestationSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramRegistrySelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramOperationsSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramRegistryRollupSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramComplianceScoreSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramDirectorPassSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramRemediationPlanSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramBoardCertificationSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramExecutivePassSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramSubjectPassSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramScaleWaveRollupSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveCloseoutSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScorecardSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveCloseoutCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveAssemblyGateSelfTests());
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// OP10M_MODULE_END agent-20-automation
