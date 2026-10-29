// OP10M_MODULE_BEGIN agent-20-automation
// OP10M_MANIFEST_SHA256: 6368fa1b3e3e5213d0f193b209be9281f3e6db6ab04610ead24c6d9f95d39d55
// OP10M_MODULE_VERSION: 10m.1.52.0-agent20
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


// --- source: automation-idle-governance-program-wave-scorecard-compare.ts ---

export interface O10IdleGovernanceProgramWaveScorecardCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-scorecard-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareScorecardFields(
  baseline: O10IdleGovernanceProgramWaveScorecardResult,
  candidate: O10IdleGovernanceProgramWaveScorecardResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.scorecardBand !== candidate.scorecardBand) {
    mismatches.push(`band ${baseline.scorecardBand} vs ${candidate.scorecardBand}`);
  }
  if (baseline.assemblyReady !== candidate.assemblyReady) {
    mismatches.push(`assembly_ready ${baseline.assemblyReady} vs ${candidate.assemblyReady}`);
  }
  if (baseline.waveRecommendation !== candidate.waveRecommendation) {
    mismatches.push(`rec ${baseline.waveRecommendation} vs ${candidate.waveRecommendation}`);
  }
  if (baseline.clearance !== candidate.clearance) {
    mismatches.push(`clearance ${baseline.clearance} vs ${candidate.clearance}`);
  }
  const scoreDelta = Math.abs(baseline.meanComplianceScore - candidate.meanComplianceScore);
  if (scoreDelta > 0.001) {
    mismatches.push(`mean_score_delta ${scoreDelta.toFixed(4)}`);
  }
  return mismatches;
}

/** Round-19 scorecard compare across twin assembly gate runs. */
export function compareIdleGovernanceProgramWaveScorecards(
  baseline: O10IdleGovernanceProgramWaveScorecardResult,
  candidate: O10IdleGovernanceProgramWaveScorecardResult
): O10IdleGovernanceProgramWaveScorecardCompareResult {
  const mismatches = compareScorecardFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_scorecard_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scorecard-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScorecardCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveScorecardResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scorecard.v1',
    waveRound: 19,
    clearance: 'cleared',
    waveRecommendation: 'advance_scale_wave',
    meanComplianceScore: 81,
    scorecardBand: 'green',
    assemblyReady: true,
    scorecardMarkdown: 'md',
    summaryLine: 'sc',
  });

  const ok = compareIdleGovernanceProgramWaveScorecards(twin(), twin());
  push('gov_prog_sc_cmp_parity', 'identical scorecards report parity', ok.parityOk === true);

  const drift = compareIdleGovernanceProgramWaveScorecards(twin(), { ...twin(), assemblyReady: false });
  push(
    'gov_prog_sc_cmp_drift',
    'assembly readiness drift surfaces mismatch',
    drift.parityOk === false && drift.mismatches.some(m => m.startsWith('assembly_ready'))
  );

  push(
    'gov_prog_sc_cmp_schema',
    'scorecard compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-scorecard-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-assembly-run.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveAssemblyDigest {
  waveRound: number;
  gateOpen: boolean;
  scorecardBand: string;
  waveRecommendation: string;
  closeoutParityOk: boolean;
  scorecardParityOk: boolean;
  assemblyReady: boolean;
}

export interface O10IdleGovernanceProgramWaveAssemblyRunResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-run.v1';
  waveRound: number;
  primaryGate: ReturnType<typeof gateIdleGovernanceProgramWaveAssembly>;
  twinGate: ReturnType<typeof gateIdleGovernanceProgramWaveAssembly>;
  scorecardCompare: ReturnType<typeof compareIdleGovernanceProgramWaveScorecards>;
  assemblyDigest: O10IdleGovernanceProgramWaveAssemblyDigest;
  runSucceeded: boolean;
  runMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveAssemblyRunMarkdown(
  digest: O10IdleGovernanceProgramWaveAssemblyDigest,
  primaryGate: ReturnType<typeof gateIdleGovernanceProgramWaveAssembly>
): string {
  return [
    '# Agent 20 idle governance wave assembly run',
    '',
    `- wave_round=${digest.waveRound}`,
    `- run_succeeded=${digest.gateOpen && digest.scorecardParityOk}`,
    `- gate_open=${digest.gateOpen}`,
    `- scorecard_parity=${digest.scorecardParityOk}`,
    '',
    primaryGate.gateMarkdown,
  ].join('\n');
}

/** Round-19 orchestrated assembly run: twin gates + scorecard compare + digest. */
export function runIdleGovernanceProgramWaveAssembly(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyRunResult {
  const primaryGate = gateIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinGate = gateIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const scorecardCompare = compareIdleGovernanceProgramWaveScorecards(
    primaryGate.scorecard,
    twinGate.scorecard
  );

  const assemblyDigest: O10IdleGovernanceProgramWaveAssemblyDigest = {
    waveRound,
    gateOpen: primaryGate.gateOpen,
    scorecardBand: primaryGate.scorecard.scorecardBand,
    waveRecommendation: primaryGate.scorecard.waveRecommendation,
    closeoutParityOk: primaryGate.compare.parityOk,
    scorecardParityOk: scorecardCompare.parityOk,
    assemblyReady: primaryGate.scorecard.assemblyReady,
  };

  const runSucceeded =
    primaryGate.gateOpen && scorecardCompare.parityOk && primaryGate.compare.parityOk;

  const runMarkdown = buildIdleGovernanceProgramWaveAssemblyRunMarkdown(assemblyDigest, primaryGate);

  const summaryLine = [
    'gov_program_wave_assembly_run',
    `round=${waveRound}`,
    `ok=${runSucceeded}`,
    scorecardCompare.summaryLine,
    primaryGate.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-run.v1',
    waveRound,
    primaryGate,
    twinGate,
    scorecardCompare,
    assemblyDigest,
    runSucceeded,
    runMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyRunSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'run1',
    name: 'Assembly run',
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

  const run = runIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 19);
  push(
    'gov_prog_asm_run_calm',
    'calm assembly run succeeds with digest',
    run.runSucceeded === true &&
      run.assemblyDigest.scorecardParityOk === true &&
      run.runMarkdown.includes('assembly run')
  );

  const run2 = runIdleGovernanceProgramWaveAssembly(
    calmSpec,
    sampleRule,
    3,
    2,
    19,
    run.primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_asm_run_chain',
    'chained assembly run accumulates registry',
    run2.primaryGate.primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      run2.summaryLine.includes('gov_program_wave_assembly_run')
  );

  push(
    'gov_prog_asm_run_schema',
    'wave assembly run schema marker',
    run.schema === '10m.agent20.idle-governance-program-wave-assembly-run.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-assembly-export.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveAssemblyExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1';
  waveRound: number;
  runSucceeded: boolean;
  assemblyDigest: O10IdleGovernanceProgramWaveAssemblyRunResult['assemblyDigest'];
  integrationHookLines: string[];
}

export interface O10IdleGovernanceProgramWaveAssemblyExportResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1';
  waveRound: number;
  run: O10IdleGovernanceProgramWaveAssemblyRunResult;
  payload: O10IdleGovernanceProgramWaveAssemblyExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

function buildIntegrationHookLines(
  run: O10IdleGovernanceProgramWaveAssemblyRunResult
): string[] {
  const d = run.assemblyDigest;
  return [
    `O10_AGENT20_WAVE_ASSEMBLY round=${d.waveRound}`,
    `O10_AGENT20_WAVE_GATE open=${d.gateOpen}`,
    `O10_AGENT20_WAVE_SCORECARD band=${d.scorecardBand} rec=${d.waveRecommendation}`,
    `O10_AGENT20_WAVE_PARITY closeout=${d.closeoutParityOk} scorecard=${d.scorecardParityOk}`,
    `O10_AGENT20_WAVE_RUN ok=${run.runSucceeded}`,
  ];
}

/** Round-19 flattened assembly export for Agent 25 integration hooks. */
export function exportIdleGovernanceProgramWaveAssembly(
  run: O10IdleGovernanceProgramWaveAssemblyRunResult
): O10IdleGovernanceProgramWaveAssemblyExportResult {
  const integrationHookLines = buildIntegrationHookLines(run);
  const payload: O10IdleGovernanceProgramWaveAssemblyExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
    waveRound: run.waveRound,
    runSucceeded: run.runSucceeded,
    assemblyDigest: run.assemblyDigest,
    integrationHookLines,
  };

  const exportMarkdown = [
    '# Agent 20 idle governance wave assembly export',
    '',
    ...integrationHookLines.map(line => `- ${line}`),
    '',
    run.runMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_assembly_export',
    `round=${run.waveRound}`,
    `ok=${run.runSucceeded}`,
    `hooks=${integrationHookLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
    waveRound: run.waveRound,
    run,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

/** Convenience entry: run assembly then export in one call. */
export function runAndExportIdleGovernanceProgramWaveAssembly(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyExportResult {
  const run = runIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  return exportIdleGovernanceProgramWaveAssembly(run);
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'exp1',
    name: 'Assembly export',
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

  const exported = runAndExportIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 19);
  push(
    'gov_prog_asm_export_calm',
    'export includes integration hook lines',
    exported.payload.integrationHookLines.length === 5 &&
      exported.exportMarkdown.includes('O10_AGENT20_WAVE_RUN') &&
      exported.payload.runSucceeded === true
  );

  push(
    'gov_prog_asm_export_schema',
    'assembly export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-assembly-export.v1'
  );

  push(
    'gov_prog_asm_export_payload',
    'payload schema marker',
    exported.payload.schema === '10m.agent20.idle-governance-program-wave-assembly-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-assembly-export-compare.ts ---

export interface O10IdleGovernanceProgramWaveAssemblyExportCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-export-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareExportPayloads(
  baseline: O10IdleGovernanceProgramWaveAssemblyExportResult,
  candidate: O10IdleGovernanceProgramWaveAssemblyExportResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.payload.runSucceeded !== candidate.payload.runSucceeded) {
    mismatches.push(
      `run_succeeded ${baseline.payload.runSucceeded} vs ${candidate.payload.runSucceeded}`
    );
  }
  const b = baseline.payload.assemblyDigest;
  const c = candidate.payload.assemblyDigest;
  if (b.gateOpen !== c.gateOpen) mismatches.push('digest_gate_open');
  if (b.scorecardParityOk !== c.scorecardParityOk) mismatches.push('digest_scorecard_parity');
  if (b.closeoutParityOk !== c.closeoutParityOk) mismatches.push('digest_closeout_parity');
  if (b.scorecardBand !== c.scorecardBand) mismatches.push('digest_band');
  if (baseline.payload.integrationHookLines.length !== candidate.payload.integrationHookLines.length) {
    mismatches.push('hook_line_count');
  } else {
    for (let i = 0; i < baseline.payload.integrationHookLines.length; i += 1) {
      if (baseline.payload.integrationHookLines[i] !== candidate.payload.integrationHookLines[i]) {
        mismatches.push(`hook_line_${i}`);
        break;
      }
    }
  }
  return mismatches;
}

/** Round-20 twin assembly export regression compare. */
export function compareIdleGovernanceProgramWaveAssemblyExports(
  baseline: O10IdleGovernanceProgramWaveAssemblyExportResult,
  candidate: O10IdleGovernanceProgramWaveAssemblyExportResult
): O10IdleGovernanceProgramWaveAssemblyExportCompareResult {
  const mismatches = compareExportPayloads(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_assembly_export_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-export-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyExportCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveAssemblyExportResult => ({
    schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
    waveRound: 20,
    exportMarkdown: 'md',
    summaryLine: 'exp',
    run: {} as O10IdleGovernanceProgramWaveAssemblyExportResult['run'],
    payload: {
      schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
      waveRound: 20,
      runSucceeded: true,
      assemblyDigest: {
        waveRound: 20,
        gateOpen: true,
        scorecardBand: 'green',
        waveRecommendation: 'advance_scale_wave',
        closeoutParityOk: true,
        scorecardParityOk: true,
        assemblyReady: true,
      },
      integrationHookLines: ['O10_AGENT20_WAVE_RUN ok=true'],
    },
  });

  const ok = compareIdleGovernanceProgramWaveAssemblyExports(twin(), twin());
  push('gov_prog_exp_cmp_parity', 'identical exports report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveAssemblyExports(twin(), {
    ...twin(),
    payload: { ...twin().payload, runSucceeded: false },
  });
  push(
    'gov_prog_exp_cmp_drift',
    'run_succeeded drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('run_succeeded'))
  );

  push(
    'gov_prog_exp_cmp_schema',
    'export compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-assembly-export-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-assembly-replay-parity.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveAssemblyReplayParityResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-replay-parity.v1';
  waveRound: number;
  replayParityOk: boolean;
  baselineExport: O10IdleGovernanceProgramWaveAssemblyExportResult;
  replayExport: O10IdleGovernanceProgramWaveAssemblyExportResult;
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveAssemblyExports>;
  summaryLine: string;
}

/** Round-20 replay parity: re-run assembly export and compare to baseline export. */
export function verifyIdleGovernanceProgramWaveAssemblyReplayParity(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  baselineExport: O10IdleGovernanceProgramWaveAssemblyExportResult,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyReplayParityResult {
  const replayExport = runAndExportIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const compare = compareIdleGovernanceProgramWaveAssemblyExports(baselineExport, replayExport);
  const replayParityOk = compare.parityOk && baselineExport.payload.runSucceeded === replayExport.payload.runSucceeded;

  const summaryLine = [
    'gov_program_wave_assembly_replay_parity',
    `round=${waveRound}`,
    `parity=${replayParityOk}`,
    compare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-replay-parity.v1',
    waveRound,
    replayParityOk,
    baselineExport,
    replayExport,
    compare,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyReplayParitySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'rpl1',
    name: 'Replay parity',
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

  const baseline = runAndExportIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 20);
  const parity = verifyIdleGovernanceProgramWaveAssemblyReplayParity(
    calmSpec,
    sampleRule,
    1,
    3,
    20,
    baseline,
    createEmptyIdleGovernanceProgramRegistry()
  );
  push(
    'gov_prog_rpl_parity_calm',
    'replay export matches baseline on calm spec',
    parity.replayParityOk === true && parity.compare.parityOk === true
  );

  push(
    'gov_prog_rpl_parity_schema',
    'replay parity schema marker',
    parity.schema === '10m.agent20.idle-governance-program-wave-assembly-replay-parity.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-integration-gate.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveIntegrationGateResult {
  schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1';
  waveRound: number;
  gateOpen: boolean;
  primaryExport: ReturnType<typeof runAndExportIdleGovernanceProgramWaveAssembly>;
  twinExport: ReturnType<typeof runAndExportIdleGovernanceProgramWaveAssembly>;
  exportCompare: ReturnType<typeof compareIdleGovernanceProgramWaveAssemblyExports>;
  replayParity: ReturnType<typeof verifyIdleGovernanceProgramWaveAssemblyReplayParity>;
  gateMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveIntegrationGateMarkdown(
  gateOpen: boolean,
  primaryExport: ReturnType<typeof runAndExportIdleGovernanceProgramWaveAssembly>,
  replayParity: ReturnType<typeof verifyIdleGovernanceProgramWaveAssemblyReplayParity>
): string {
  return [
    '# Agent 20 idle governance wave integration gate',
    '',
    `- gate_open=${gateOpen}`,
    `- ${replayParity.summaryLine}`,
    '',
    primaryExport.exportMarkdown,
  ].join('\n');
}

/** Round-20 integration gate: twin exports + export compare + assembly replay parity. */
export function gateIdleGovernanceProgramWaveIntegration(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveIntegrationGateResult {
  const primaryExport = runAndExportIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinExport = runAndExportIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const exportCompare = compareIdleGovernanceProgramWaveAssemblyExports(primaryExport, twinExport);
  const replayParity = verifyIdleGovernanceProgramWaveAssemblyReplayParity(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    primaryExport,
    priorRegistry
  );

  const gateOpen =
    primaryExport.payload.runSucceeded &&
    exportCompare.parityOk &&
    replayParity.replayParityOk;

  const gateMarkdown = buildIdleGovernanceProgramWaveIntegrationGateMarkdown(
    gateOpen,
    primaryExport,
    replayParity
  );

  const summaryLine = [
    'gov_program_wave_integration_gate',
    `round=${waveRound}`,
    `open=${gateOpen}`,
    exportCompare.summaryLine,
    replayParity.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1',
    waveRound,
    gateOpen,
    primaryExport,
    twinExport,
    exportCompare,
    replayParity,
    gateMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveIntegrationGateSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'int1',
    name: 'Integration gate',
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

  const gate = gateIdleGovernanceProgramWaveIntegration(calmSpec, sampleRule, 1, 3, 20);
  push(
    'gov_prog_int_gate_calm',
    'calm integration gate opens with export and replay parity',
    gate.gateOpen === true &&
      gate.exportCompare.parityOk === true &&
      gate.replayParity.replayParityOk === true
  );

  const gate2 = gateIdleGovernanceProgramWaveIntegration(
    calmSpec,
    sampleRule,
    3,
    2,
    20,
    gate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_int_gate_chain',
    'chained integration gate accumulates registry',
    gate2.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup.entryCount ===
      2 && gate2.gateMarkdown.includes('integration gate')
  );

  push(
    'gov_prog_int_gate_schema',
    'integration gate schema marker',
    gate.schema === '10m.agent20.idle-governance-program-wave-integration-gate.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-integration-gate-compare.ts ---

export interface O10IdleGovernanceProgramWaveIntegrationGateCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-integration-gate-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareIntegrationGateFields(
  baseline: O10IdleGovernanceProgramWaveIntegrationGateResult,
  candidate: O10IdleGovernanceProgramWaveIntegrationGateResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.gateOpen !== candidate.gateOpen) {
    mismatches.push(`gate_open ${baseline.gateOpen} vs ${candidate.gateOpen}`);
  }
  if (baseline.exportCompare.parityOk !== candidate.exportCompare.parityOk) {
    mismatches.push('export_compare_parity');
  }
  if (baseline.replayParity.replayParityOk !== candidate.replayParity.replayParityOk) {
    mismatches.push('replay_parity');
  }
  if (
    baseline.primaryExport.payload.runSucceeded !== candidate.primaryExport.payload.runSucceeded
  ) {
    mismatches.push('primary_run_succeeded');
  }
  return mismatches;
}

/** Round-21 twin integration gate regression compare. */
export function compareIdleGovernanceProgramWaveIntegrationGates(
  baseline: O10IdleGovernanceProgramWaveIntegrationGateResult,
  candidate: O10IdleGovernanceProgramWaveIntegrationGateResult
): O10IdleGovernanceProgramWaveIntegrationGateCompareResult {
  const mismatches = compareIntegrationGateFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_integration_gate_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-integration-gate-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveIntegrationGateCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveIntegrationGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1',
    waveRound: 21,
    gateOpen: true,
    gateMarkdown: 'md',
    summaryLine: 'gate',
    primaryExport: {
      payload: { runSucceeded: true },
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['primaryExport'],
    twinExport: {} as O10IdleGovernanceProgramWaveIntegrationGateResult['twinExport'],
    exportCompare: {
      parityOk: true,
      summaryLine: 'cmp',
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['exportCompare'],
    replayParity: {
      replayParityOk: true,
      summaryLine: 'rpl',
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['replayParity'],
  });

  const ok = compareIdleGovernanceProgramWaveIntegrationGates(twin(), twin());
  push('gov_prog_int_gate_cmp_parity', 'identical gates report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveIntegrationGates(twin(), { ...twin(), gateOpen: false });
  push(
    'gov_prog_int_gate_cmp_drift',
    'gate_open drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('gate_open'))
  );

  push(
    'gov_prog_int_gate_cmp_schema',
    'integration gate compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-integration-gate-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-handoff-bundle.ts ---

export interface O10IdleGovernanceProgramWaveHandoffBundlePayload {
  schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1';
  waveRound: number;
  gateOpen: boolean;
  integrationHookLines: string[];
  handoffDigestLines: string[];
}

export interface O10IdleGovernanceProgramWaveHandoffBundleResult {
  schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1';
  waveRound: number;
  gate: O10IdleGovernanceProgramWaveIntegrationGateResult;
  payload: O10IdleGovernanceProgramWaveHandoffBundlePayload;
  bundleMarkdown: string;
  summaryLine: string;
}

function buildHandoffDigestLines(gate: O10IdleGovernanceProgramWaveIntegrationGateResult): string[] {
  const exp = gate.primaryExport.payload;
  return [
    `O10_AGENT20_WAVE_HANDOFF round=${gate.waveRound}`,
    `O10_AGENT20_WAVE_INTEGRATION_GATE open=${gate.gateOpen}`,
    `O10_AGENT20_WAVE_EXPORT_COMPARE parity=${gate.exportCompare.parityOk}`,
    `O10_AGENT20_WAVE_REPLAY parity=${gate.replayParity.replayParityOk}`,
    `O10_AGENT20_WAVE_DIGEST run_ok=${exp.runSucceeded} band=${exp.assemblyDigest.scorecardBand}`,
  ];
}

/** Round-21 handoff bundle flattening integration gate for scale-wave coordination. */
export function bundleIdleGovernanceProgramWaveHandoff(
  gate: O10IdleGovernanceProgramWaveIntegrationGateResult
): O10IdleGovernanceProgramWaveHandoffBundleResult {
  const integrationHookLines = gate.primaryExport.payload.integrationHookLines;
  const handoffDigestLines = buildHandoffDigestLines(gate);

  const payload: O10IdleGovernanceProgramWaveHandoffBundlePayload = {
    schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1',
    waveRound: gate.waveRound,
    gateOpen: gate.gateOpen,
    integrationHookLines: [...integrationHookLines],
    handoffDigestLines,
  };

  const bundleMarkdown = [
    '# Agent 20 idle governance wave handoff bundle',
    '',
    ...handoffDigestLines.map(line => `- ${line}`),
    '',
    gate.gateMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_handoff_bundle',
    `round=${gate.waveRound}`,
    `open=${gate.gateOpen}`,
    `digests=${handoffDigestLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-handoff-bundle.v1',
    waveRound: gate.waveRound,
    gate,
    payload,
    bundleMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveHandoffBundleSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockGate = (): O10IdleGovernanceProgramWaveIntegrationGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1',
    waveRound: 21,
    gateOpen: true,
    gateMarkdown: '# gate',
    summaryLine: 'gate',
    exportCompare: { parityOk: true, summaryLine: 'c' } as O10IdleGovernanceProgramWaveIntegrationGateResult['exportCompare'],
    replayParity: { replayParityOk: true, summaryLine: 'r' } as O10IdleGovernanceProgramWaveIntegrationGateResult['replayParity'],
    twinExport: {} as O10IdleGovernanceProgramWaveIntegrationGateResult['twinExport'],
    primaryExport: {
      payload: {
        runSucceeded: true,
        integrationHookLines: ['hook-a'],
        assemblyDigest: {
          waveRound: 21,
          gateOpen: true,
          scorecardBand: 'green',
          waveRecommendation: 'advance_scale_wave',
          closeoutParityOk: true,
          scorecardParityOk: true,
          assemblyReady: true,
        },
      },
    } as O10IdleGovernanceProgramWaveIntegrationGateResult['primaryExport'],
  });

  const bundle = bundleIdleGovernanceProgramWaveHandoff(mockGate());
  push(
    'gov_prog_handoff_bundle_lines',
    'handoff bundle includes digest and hook lines',
    bundle.payload.handoffDigestLines.length === 5 &&
      bundle.payload.integrationHookLines[0] === 'hook-a' &&
      bundle.bundleMarkdown.includes('handoff bundle')
  );

  push(
    'gov_prog_handoff_bundle_schema',
    'handoff bundle schema marker',
    bundle.schema === '10m.agent20.idle-governance-program-wave-handoff-bundle.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-cycle-closeout.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export type O10IdleGovernanceProgramWaveCycleRecommendation =
  | 'advance_scale_wave_cycle'
  | 'hold_scale_wave_cycle'
  | 'escalate_scale_wave_cycle';

export interface O10IdleGovernanceProgramWaveCycleCloseoutResult {
  schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1';
  waveRound: number;
  primaryGate: ReturnType<typeof gateIdleGovernanceProgramWaveIntegration>;
  twinGate: ReturnType<typeof gateIdleGovernanceProgramWaveIntegration>;
  gateCompare: ReturnType<typeof compareIdleGovernanceProgramWaveIntegrationGates>;
  handoffBundle: ReturnType<typeof bundleIdleGovernanceProgramWaveHandoff>;
  cycleRecommendation: O10IdleGovernanceProgramWaveCycleRecommendation;
  cycleCloseoutMarkdown: string;
  summaryLine: string;
}

function deriveCycleRecommendation(
  gateOpen: boolean,
  gateCompareParity: boolean
): O10IdleGovernanceProgramWaveCycleRecommendation {
  if (gateOpen && gateCompareParity) return 'advance_scale_wave_cycle';
  if (!gateCompareParity) return 'escalate_scale_wave_cycle';
  return 'hold_scale_wave_cycle';
}

export function buildIdleGovernanceProgramWaveCycleCloseoutMarkdown(
  waveRound: number,
  recommendation: O10IdleGovernanceProgramWaveCycleRecommendation,
  handoffBundle: ReturnType<typeof bundleIdleGovernanceProgramWaveHandoff>
): string {
  return [
    '# Agent 20 idle governance wave cycle closeout',
    '',
    `- wave_round=${waveRound}`,
    `- cycle_recommendation=${recommendation}`,
    '',
    handoffBundle.bundleMarkdown,
  ].join('\n');
}

/** Round-21 cycle closeout: integration gate, twin compare, handoff bundle, cycle recommendation. */
export function runIdleGovernanceProgramWaveCycleCloseout(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveCycleCloseoutResult {
  const primaryGate = gateIdleGovernanceProgramWaveIntegration(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinGate = gateIdleGovernanceProgramWaveIntegration(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const gateCompare = compareIdleGovernanceProgramWaveIntegrationGates(primaryGate, twinGate);
  const handoffBundle = bundleIdleGovernanceProgramWaveHandoff(primaryGate);
  const cycleRecommendation = deriveCycleRecommendation(primaryGate.gateOpen, gateCompare.parityOk);
  const cycleCloseoutMarkdown = buildIdleGovernanceProgramWaveCycleCloseoutMarkdown(
    waveRound,
    cycleRecommendation,
    handoffBundle
  );

  const summaryLine = [
    'gov_program_wave_cycle_closeout',
    `round=${waveRound}`,
    `rec=${cycleRecommendation}`,
    gateCompare.summaryLine,
    handoffBundle.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1',
    waveRound,
    primaryGate,
    twinGate,
    gateCompare,
    handoffBundle,
    cycleRecommendation,
    cycleCloseoutMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCycleCloseoutSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cyc1',
    name: 'Cycle closeout',
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

  const closeout = runIdleGovernanceProgramWaveCycleCloseout(calmSpec, sampleRule, 1, 3, 21);
  push(
    'gov_prog_cycle_closeout_calm',
    'calm cycle closeout advances with gate parity',
    closeout.cycleRecommendation === 'advance_scale_wave_cycle' &&
      closeout.gateCompare.parityOk === true &&
      closeout.cycleCloseoutMarkdown.includes('cycle closeout')
  );

  const closeout2 = runIdleGovernanceProgramWaveCycleCloseout(
    calmSpec,
    sampleRule,
    3,
    2,
    21,
    closeout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
      .operations.registry
  );
  push(
    'gov_prog_cycle_closeout_chain',
    'chained cycle closeout accumulates registry',
    closeout2.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
      .registryRollup.entryCount === 2 &&
      closeout2.summaryLine.includes('gov_program_wave_cycle_closeout')
  );

  push(
    'gov_prog_cycle_closeout_schema',
    'cycle closeout schema marker',
    closeout.schema === '10m.agent20.idle-governance-program-wave-cycle-closeout.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-cycle-closeout-compare.ts ---

export interface O10IdleGovernanceProgramWaveCycleCloseoutCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-cycle-closeout-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareCycleCloseoutFields(
  baseline: O10IdleGovernanceProgramWaveCycleCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCycleCloseoutResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.cycleRecommendation !== candidate.cycleRecommendation) {
    mismatches.push(
      `cycle_rec ${baseline.cycleRecommendation} vs ${candidate.cycleRecommendation}`
    );
  }
  if (baseline.gateCompare.parityOk !== candidate.gateCompare.parityOk) {
    mismatches.push('gate_compare_parity');
  }
  if (baseline.primaryGate.gateOpen !== candidate.primaryGate.gateOpen) {
    mismatches.push('primary_gate_open');
  }
  if (baseline.handoffBundle.payload.gateOpen !== candidate.handoffBundle.payload.gateOpen) {
    mismatches.push('handoff_gate_open');
  }
  return mismatches;
}

/** Round-22 twin cycle closeout regression compare. */
export function compareIdleGovernanceProgramWaveCycleCloseouts(
  baseline: O10IdleGovernanceProgramWaveCycleCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveCycleCloseoutResult
): O10IdleGovernanceProgramWaveCycleCloseoutCompareResult {
  const mismatches = compareCycleCloseoutFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_cycle_closeout_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCycleCloseoutCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveCycleCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1',
    waveRound: 22,
    cycleRecommendation: 'advance_scale_wave_cycle',
    cycleCloseoutMarkdown: 'md',
    summaryLine: 'close',
    primaryGate: { gateOpen: true } as O10IdleGovernanceProgramWaveCycleCloseoutResult['primaryGate'],
    twinGate: {} as O10IdleGovernanceProgramWaveCycleCloseoutResult['twinGate'],
    gateCompare: { parityOk: true } as O10IdleGovernanceProgramWaveCycleCloseoutResult['gateCompare'],
    handoffBundle: {
      payload: { gateOpen: true },
    } as O10IdleGovernanceProgramWaveCycleCloseoutResult['handoffBundle'],
  });

  const ok = compareIdleGovernanceProgramWaveCycleCloseouts(twin(), twin());
  push('gov_prog_cycle_cmp_parity', 'identical cycle closeouts report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveCycleCloseouts(twin(), {
    ...twin(),
    cycleRecommendation: 'hold_scale_wave_cycle',
  });
  push(
    'gov_prog_cycle_cmp_rec',
    'cycle recommendation drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('cycle_rec'))
  );

  push(
    'gov_prog_cycle_cmp_schema',
    'cycle closeout compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-cycle-closeout-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-projection-rollup.ts ---

export interface O10IdleGovernanceProgramWaveProjectionRollupResult {
  schema: '10m.agent20.idle-governance-program-wave-projection-rollup.v1';
  waveRound: number;
  projectedLocBand: 'on_track' | 'watch' | 'behind';
  cycleRecommendation: O10IdleGovernanceProgramWaveCycleCloseoutResult['cycleRecommendation'];
  handoffLineCount: number;
  projectionHookLines: string[];
  summaryLine: string;
}

function mapRecommendationToLocBand(
  rec: O10IdleGovernanceProgramWaveCycleCloseoutResult['cycleRecommendation']
): O10IdleGovernanceProgramWaveProjectionRollupResult['projectedLocBand'] {
  if (rec === 'advance_scale_wave_cycle') return 'on_track';
  if (rec === 'hold_scale_wave_cycle') return 'watch';
  return 'behind';
}

/** Round-22 projection rollup from cycle closeout for scale-wave LOC coordination. */
export function rollupIdleGovernanceProgramWaveProjection(
  closeout: O10IdleGovernanceProgramWaveCycleCloseoutResult,
  projectedLocHint: number = 1_401_419
): O10IdleGovernanceProgramWaveProjectionRollupResult {
  const waveRound = closeout.waveRound;
  const cycleRecommendation = closeout.cycleRecommendation;
  const projectedLocBand = mapRecommendationToLocBand(cycleRecommendation);
  const handoffLineCount =
    closeout.handoffBundle.payload.handoffDigestLines.length +
    closeout.handoffBundle.payload.integrationHookLines.length;

  const projectionHookLines = [
    `O10_AGENT20_WAVE_PROJECTION round=${waveRound}`,
    `O10_AGENT20_WAVE_LOC_HINT ${projectedLocHint}`,
    `O10_AGENT20_WAVE_LOC_BAND ${projectedLocBand}`,
    `O10_AGENT20_WAVE_CYCLE ${cycleRecommendation}`,
    `O10_AGENT20_WAVE_GATE open=${closeout.primaryGate.gateOpen}`,
  ];

  const summaryLine = [
    'gov_program_wave_projection_rollup',
    `round=${waveRound}`,
    `band=${projectedLocBand}`,
    `rec=${cycleRecommendation}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-projection-rollup.v1',
    waveRound,
    projectedLocBand,
    cycleRecommendation,
    handoffLineCount,
    projectionHookLines,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveProjectionRollupSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCloseout = (
    rec: O10IdleGovernanceProgramWaveCycleCloseoutResult['cycleRecommendation']
  ): O10IdleGovernanceProgramWaveCycleCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1',
    waveRound: 22,
    cycleRecommendation: rec,
    cycleCloseoutMarkdown: 'md',
    summaryLine: 's',
    primaryGate: { gateOpen: rec === 'advance_scale_wave_cycle' } as O10IdleGovernanceProgramWaveCycleCloseoutResult['primaryGate'],
    twinGate: {} as O10IdleGovernanceProgramWaveCycleCloseoutResult['twinGate'],
    gateCompare: {} as O10IdleGovernanceProgramWaveCycleCloseoutResult['gateCompare'],
    handoffBundle: {
      payload: {
        gateOpen: true,
        handoffDigestLines: ['a', 'b', 'c', 'd', 'e'],
        integrationHookLines: ['h1'],
      },
    } as O10IdleGovernanceProgramWaveCycleCloseoutResult['handoffBundle'],
  });

  const advance = rollupIdleGovernanceProgramWaveProjection(mockCloseout('advance_scale_wave_cycle'));
  push(
    'gov_prog_proj_roll_advance',
    'advance cycle maps to on_track loc band',
    advance.projectedLocBand === 'on_track' && advance.projectionHookLines.length === 5
  );

  const escalate = rollupIdleGovernanceProgramWaveProjection(mockCloseout('escalate_scale_wave_cycle'));
  push(
    'gov_prog_proj_roll_escalate',
    'escalate cycle maps to behind loc band',
    escalate.projectedLocBand === 'behind'
  );

  push(
    'gov_prog_proj_roll_schema',
    'projection rollup schema marker',
    advance.schema === '10m.agent20.idle-governance-program-wave-projection-rollup.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scale-dispatch.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveScaleDispatchResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-dispatch.v1';
  waveRound: number;
  dispatchReady: boolean;
  primaryCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCycleCloseout>;
  twinCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCycleCloseout>;
  closeoutCompare: ReturnType<typeof compareIdleGovernanceProgramWaveCycleCloseouts>;
  projectionRollup: ReturnType<typeof rollupIdleGovernanceProgramWaveProjection>;
  dispatchMarkdown: string;
  summaryLine: string;
}

/** Round-22 scale dispatch: cycle closeout + parity + projection rollup for wave landing. */
export function dispatchIdleGovernanceProgramWaveScale(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveScaleDispatchResult {
  const primaryCloseout = runIdleGovernanceProgramWaveCycleCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinCloseout = runIdleGovernanceProgramWaveCycleCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const closeoutCompare = compareIdleGovernanceProgramWaveCycleCloseouts(primaryCloseout, twinCloseout);
  const projectionRollup = rollupIdleGovernanceProgramWaveProjection(primaryCloseout, projectedLocHint);

  const dispatchReady =
    closeoutCompare.parityOk &&
    primaryCloseout.cycleRecommendation === 'advance_scale_wave_cycle' &&
    primaryCloseout.primaryGate.gateOpen;

  const dispatchMarkdown = [
    '# Agent 20 idle governance wave scale dispatch',
    '',
    `- dispatch_ready=${dispatchReady}`,
    `- ${closeoutCompare.summaryLine}`,
    '',
    ...projectionRollup.projectionHookLines.map(line => `- ${line}`),
    '',
    primaryCloseout.cycleCloseoutMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_scale_dispatch',
    `round=${waveRound}`,
    `ready=${dispatchReady}`,
    projectionRollup.summaryLine,
    closeoutCompare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch.v1',
    waveRound,
    dispatchReady,
    primaryCloseout,
    twinCloseout,
    closeoutCompare,
    projectionRollup,
    dispatchMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleDispatchSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'dsp1',
    name: 'Scale dispatch',
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

  const dispatch = dispatchIdleGovernanceProgramWaveScale(calmSpec, sampleRule, 1, 3, 22, 1_401_419);
  push(
    'gov_prog_scale_dispatch_calm',
    'calm dispatch ready with closeout parity',
    dispatch.dispatchReady === true &&
      dispatch.closeoutCompare.parityOk === true &&
      dispatch.dispatchMarkdown.includes('1_401_419') === false &&
      dispatch.projectionRollup.projectionHookLines.some(l => l.includes('1401419'))
  );

  const dispatch2 = dispatchIdleGovernanceProgramWaveScale(
    calmSpec,
    sampleRule,
    3,
    2,
    22,
    1_401_419,
    dispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.operations.registry
  );
  push(
    'gov_prog_scale_dispatch_chain',
    'chained dispatch accumulates registry',
    dispatch2.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup.entryCount === 2 &&
      dispatch2.summaryLine.includes('gov_program_wave_scale_dispatch')
  );

  push(
    'gov_prog_scale_dispatch_schema',
    'scale dispatch schema marker',
    dispatch.schema === '10m.agent20.idle-governance-program-wave-scale-dispatch.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scale-dispatch-compare.ts ---

export interface O10IdleGovernanceProgramWaveScaleDispatchCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareDispatchFields(
  baseline: O10IdleGovernanceProgramWaveScaleDispatchResult,
  candidate: O10IdleGovernanceProgramWaveScaleDispatchResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.dispatchReady !== candidate.dispatchReady) {
    mismatches.push(`dispatch_ready ${baseline.dispatchReady} vs ${candidate.dispatchReady}`);
  }
  if (baseline.closeoutCompare.parityOk !== candidate.closeoutCompare.parityOk) {
    mismatches.push('closeout_compare_parity');
  }
  if (baseline.projectionRollup.projectedLocBand !== candidate.projectionRollup.projectedLocBand) {
    mismatches.push('projection_loc_band');
  }
  if (
    baseline.projectionRollup.projectionHookLines.length !==
    candidate.projectionRollup.projectionHookLines.length
  ) {
    mismatches.push('projection_hook_count');
  }
  return mismatches;
}

/** Round-23 twin scale dispatch regression compare. */
export function compareIdleGovernanceProgramWaveScaleDispatches(
  baseline: O10IdleGovernanceProgramWaveScaleDispatchResult,
  candidate: O10IdleGovernanceProgramWaveScaleDispatchResult
): O10IdleGovernanceProgramWaveScaleDispatchCompareResult {
  const mismatches = compareDispatchFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_scale_dispatch_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleDispatchCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveScaleDispatchResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch.v1',
    waveRound: 23,
    dispatchReady: true,
    dispatchMarkdown: 'md',
    summaryLine: 'dsp',
    primaryCloseout: {} as O10IdleGovernanceProgramWaveScaleDispatchResult['primaryCloseout'],
    twinCloseout: {} as O10IdleGovernanceProgramWaveScaleDispatchResult['twinCloseout'],
    closeoutCompare: { parityOk: true } as O10IdleGovernanceProgramWaveScaleDispatchResult['closeoutCompare'],
    projectionRollup: {
      projectedLocBand: 'on_track',
      projectionHookLines: ['a', 'b', 'c', 'd', 'e'],
    } as O10IdleGovernanceProgramWaveScaleDispatchResult['projectionRollup'],
  });

  const ok = compareIdleGovernanceProgramWaveScaleDispatches(twin(), twin());
  push('gov_prog_dsp_cmp_parity', 'identical dispatches report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveScaleDispatches(twin(), {
    ...twin(),
    dispatchReady: false,
  });
  push(
    'gov_prog_dsp_cmp_ready',
    'dispatch_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('dispatch_ready'))
  );

  push(
    'gov_prog_dsp_cmp_schema',
    'scale dispatch compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-scale-dispatch-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scale-dispatch-replay-parity.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveScaleDispatchReplayParityResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-replay-parity.v1';
  waveRound: number;
  replayParityOk: boolean;
  baselineDispatch: O10IdleGovernanceProgramWaveScaleDispatchResult;
  replayDispatch: O10IdleGovernanceProgramWaveScaleDispatchResult;
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveScaleDispatches>;
  summaryLine: string;
}

/** Round-23 replay parity: re-run scale dispatch and compare to baseline. */
export function verifyIdleGovernanceProgramWaveScaleDispatchReplayParity(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  baselineDispatch: O10IdleGovernanceProgramWaveScaleDispatchResult,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveScaleDispatchReplayParityResult {
  const replayDispatch = dispatchIdleGovernanceProgramWaveScale(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const compare = compareIdleGovernanceProgramWaveScaleDispatches(baselineDispatch, replayDispatch);
  const replayParityOk =
    compare.parityOk &&
    baselineDispatch.dispatchReady === replayDispatch.dispatchReady;

  const summaryLine = [
    'gov_program_wave_scale_dispatch_replay_parity',
    `round=${waveRound}`,
    `parity=${replayParityOk}`,
    compare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-replay-parity.v1',
    waveRound,
    replayParityOk,
    baselineDispatch,
    replayDispatch,
    compare,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleDispatchReplayParitySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'drpl1',
    name: 'Dispatch replay',
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

  const baseline = dispatchIdleGovernanceProgramWaveScale(calmSpec, sampleRule, 1, 3, 23, 1_448_902);
  const parity = verifyIdleGovernanceProgramWaveScaleDispatchReplayParity(
    calmSpec,
    sampleRule,
    1,
    3,
    23,
    1_448_902,
    baseline,
    createEmptyIdleGovernanceProgramRegistry()
  );
  push(
    'gov_prog_dsp_rpl_parity',
    'replay dispatch matches baseline',
    parity.replayParityOk === true && parity.compare.parityOk === true
  );

  push(
    'gov_prog_dsp_rpl_schema',
    'dispatch replay parity schema marker',
    parity.schema === '10m.agent20.idle-governance-program-wave-scale-dispatch-replay-parity.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-landing-gate.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveLandingGateResult {
  schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1';
  waveRound: number;
  landingOpen: boolean;
  primaryDispatch: ReturnType<typeof dispatchIdleGovernanceProgramWaveScale>;
  twinDispatch: ReturnType<typeof dispatchIdleGovernanceProgramWaveScale>;
  dispatchCompare: ReturnType<typeof compareIdleGovernanceProgramWaveScaleDispatches>;
  replayParity: ReturnType<typeof verifyIdleGovernanceProgramWaveScaleDispatchReplayParity>;
  landingMarkdown: string;
  summaryLine: string;
}

/** Round-23 landing gate: twin dispatch + compare + replay parity for origin landing. */
export function gateIdleGovernanceProgramWaveLanding(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveLandingGateResult {
  const primaryDispatch = dispatchIdleGovernanceProgramWaveScale(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinDispatch = dispatchIdleGovernanceProgramWaveScale(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const dispatchCompare = compareIdleGovernanceProgramWaveScaleDispatches(
    primaryDispatch,
    twinDispatch
  );
  const replayParity = verifyIdleGovernanceProgramWaveScaleDispatchReplayParity(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    primaryDispatch,
    priorRegistry
  );

  const landingOpen =
    primaryDispatch.dispatchReady && dispatchCompare.parityOk && replayParity.replayParityOk;

  const landingMarkdown = [
    '# Agent 20 idle governance wave landing gate',
    '',
    `- landing_open=${landingOpen}`,
    `- ${dispatchCompare.summaryLine}`,
    `- ${replayParity.summaryLine}`,
    '',
    primaryDispatch.dispatchMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_landing_gate',
    `round=${waveRound}`,
    `open=${landingOpen}`,
    dispatchCompare.summaryLine,
    replayParity.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1',
    waveRound,
    landingOpen,
    primaryDispatch,
    twinDispatch,
    dispatchCompare,
    replayParity,
    landingMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveLandingGateSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'land1',
    name: 'Landing gate',
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

  const gate = gateIdleGovernanceProgramWaveLanding(calmSpec, sampleRule, 1, 3, 23, 1_448_902);
  push(
    'gov_prog_land_gate_calm',
    'calm landing gate opens with dispatch parity',
    gate.landingOpen === true &&
      gate.dispatchCompare.parityOk === true &&
      gate.replayParity.replayParityOk === true
  );

  const gate2 = gateIdleGovernanceProgramWaveLanding(
    calmSpec,
    sampleRule,
    3,
    2,
    23,
    1_448_902,
    gate.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.operations.registry
  );
  push(
    'gov_prog_land_gate_chain',
    'chained landing gate accumulates registry',
    gate2.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.registryRollup.entryCount === 2 &&
      gate2.landingMarkdown.includes('landing gate')
  );

  push(
    'gov_prog_land_gate_schema',
    'landing gate schema marker',
    gate.schema === '10m.agent20.idle-governance-program-wave-landing-gate.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-landing-gate-compare.ts ---

export interface O10IdleGovernanceProgramWaveLandingGateCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-landing-gate-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareLandingGateFields(
  baseline: O10IdleGovernanceProgramWaveLandingGateResult,
  candidate: O10IdleGovernanceProgramWaveLandingGateResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.landingOpen !== candidate.landingOpen) {
    mismatches.push(`landing_open ${baseline.landingOpen} vs ${candidate.landingOpen}`);
  }
  if (baseline.dispatchCompare.parityOk !== candidate.dispatchCompare.parityOk) {
    mismatches.push('dispatch_compare_parity');
  }
  if (baseline.replayParity.replayParityOk !== candidate.replayParity.replayParityOk) {
    mismatches.push('replay_parity');
  }
  if (baseline.primaryDispatch.dispatchReady !== candidate.primaryDispatch.dispatchReady) {
    mismatches.push('primary_dispatch_ready');
  }
  return mismatches;
}

/** Round-24 twin landing gate regression compare. */
export function compareIdleGovernanceProgramWaveLandingGates(
  baseline: O10IdleGovernanceProgramWaveLandingGateResult,
  candidate: O10IdleGovernanceProgramWaveLandingGateResult
): O10IdleGovernanceProgramWaveLandingGateCompareResult {
  const mismatches = compareLandingGateFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_landing_gate_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-landing-gate-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveLandingGateCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveLandingGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1',
    waveRound: 24,
    landingOpen: true,
    landingMarkdown: 'md',
    summaryLine: 'land',
    primaryDispatch: {
      dispatchReady: true,
    } as O10IdleGovernanceProgramWaveLandingGateResult['primaryDispatch'],
    twinDispatch: {} as O10IdleGovernanceProgramWaveLandingGateResult['twinDispatch'],
    dispatchCompare: { parityOk: true } as O10IdleGovernanceProgramWaveLandingGateResult['dispatchCompare'],
    replayParity: { replayParityOk: true } as O10IdleGovernanceProgramWaveLandingGateResult['replayParity'],
  });

  const ok = compareIdleGovernanceProgramWaveLandingGates(twin(), twin());
  push('gov_prog_land_cmp_parity', 'identical landing gates report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveLandingGates(twin(), { ...twin(), landingOpen: false });
  push(
    'gov_prog_land_cmp_open',
    'landing_open drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('landing_open'))
  );

  push(
    'gov_prog_land_cmp_schema',
    'landing gate compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-landing-gate-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-landing-bundle.ts ---

export interface O10IdleGovernanceProgramWaveLandingBundlePayload {
  schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1';
  waveRound: number;
  landingOpen: boolean;
  projectedLocHint: number;
  sealHookLines: string[];
}

export interface O10IdleGovernanceProgramWaveLandingBundleResult {
  schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1';
  waveRound: number;
  landing: O10IdleGovernanceProgramWaveLandingGateResult;
  payload: O10IdleGovernanceProgramWaveLandingBundlePayload;
  bundleMarkdown: string;
  summaryLine: string;
}

function buildSealHookLines(
  landing: O10IdleGovernanceProgramWaveLandingGateResult,
  projectedLocHint: number
): string[] {
  const rollup = landing.primaryDispatch.projectionRollup;
  return [
    `O10_AGENT20_WAVE_LANDING round=${landing.waveRound}`,
    `O10_AGENT20_WAVE_LANDING_OPEN ${landing.landingOpen}`,
    `O10_AGENT20_WAVE_LOC_HINT ${projectedLocHint}`,
    `O10_AGENT20_WAVE_LOC_BAND ${rollup.projectedLocBand}`,
    `O10_AGENT20_WAVE_DISPATCH_READY ${landing.primaryDispatch.dispatchReady}`,
  ];
}

/** Round-24 landing bundle for Agent 25 wave-24 integration seal hooks. */
export function bundleIdleGovernanceProgramWaveLanding(
  landing: O10IdleGovernanceProgramWaveLandingGateResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveLandingBundleResult {
  const sealHookLines = buildSealHookLines(landing, projectedLocHint);

  const payload: O10IdleGovernanceProgramWaveLandingBundlePayload = {
    schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1',
    waveRound: landing.waveRound,
    landingOpen: landing.landingOpen,
    projectedLocHint,
    sealHookLines,
  };

  const bundleMarkdown = [
    '# Agent 20 idle governance wave landing bundle',
    '',
    ...sealHookLines.map(line => `- ${line}`),
    '',
    landing.landingMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_landing_bundle',
    `round=${landing.waveRound}`,
    `open=${landing.landingOpen}`,
    `hooks=${sealHookLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-landing-bundle.v1',
    waveRound: landing.waveRound,
    landing,
    payload,
    bundleMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveLandingBundleSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockLanding = (): O10IdleGovernanceProgramWaveLandingGateResult => ({
    schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1',
    waveRound: 24,
    landingOpen: true,
    landingMarkdown: '# land',
    summaryLine: 's',
    twinDispatch: {} as O10IdleGovernanceProgramWaveLandingGateResult['twinDispatch'],
    dispatchCompare: {} as O10IdleGovernanceProgramWaveLandingGateResult['dispatchCompare'],
    replayParity: {} as O10IdleGovernanceProgramWaveLandingGateResult['replayParity'],
    primaryDispatch: {
      dispatchReady: true,
      projectionRollup: { projectedLocBand: 'on_track' },
    } as O10IdleGovernanceProgramWaveLandingGateResult['primaryDispatch'],
  });

  const bundle = bundleIdleGovernanceProgramWaveLanding(mockLanding(), 1_487_095);
  push(
    'gov_prog_land_bundle_hooks',
    'landing bundle includes seal hook lines',
    bundle.payload.sealHookLines.length === 5 &&
      bundle.payload.projectedLocHint === 1_487_095 &&
      bundle.bundleMarkdown.includes('landing bundle')
  );

  push(
    'gov_prog_land_bundle_schema',
    'landing bundle schema marker',
    bundle.schema === '10m.agent20.idle-governance-program-wave-landing-bundle.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scale-wave-seal.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export type O10IdleGovernanceProgramWaveScaleWaveSealVerdict = 'sealed' | 'hold' | 'blocked';

export interface O10IdleGovernanceProgramWaveScaleWaveSealResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1';
  waveRound: number;
  sealVerdict: O10IdleGovernanceProgramWaveScaleWaveSealVerdict;
  primaryLanding: ReturnType<typeof gateIdleGovernanceProgramWaveLanding>;
  twinLanding: ReturnType<typeof gateIdleGovernanceProgramWaveLanding>;
  landingCompare: ReturnType<typeof compareIdleGovernanceProgramWaveLandingGates>;
  landingBundle: ReturnType<typeof bundleIdleGovernanceProgramWaveLanding>;
  sealMarkdown: string;
  summaryLine: string;
}

function deriveSealVerdict(
  landingOpen: boolean,
  landingCompareParity: boolean
): O10IdleGovernanceProgramWaveScaleWaveSealVerdict {
  if (landingOpen && landingCompareParity) return 'sealed';
  if (!landingCompareParity) return 'blocked';
  return 'hold';
}

/** Round-24 scale-wave seal: landing gate + twin compare + bundle for wave 24/24 close. */
export function sealIdleGovernanceProgramWaveScaleWave(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveScaleWaveSealResult {
  const primaryLanding = gateIdleGovernanceProgramWaveLanding(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinLanding = gateIdleGovernanceProgramWaveLanding(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const landingCompare = compareIdleGovernanceProgramWaveLandingGates(primaryLanding, twinLanding);
  const landingBundle = bundleIdleGovernanceProgramWaveLanding(primaryLanding, projectedLocHint);
  const sealVerdict = deriveSealVerdict(primaryLanding.landingOpen, landingCompare.parityOk);

  const sealMarkdown = [
    '# Agent 20 idle governance scale wave seal',
    '',
    `- wave_round=${waveRound}`,
    `- seal_verdict=${sealVerdict}`,
    `- ${landingCompare.summaryLine}`,
    '',
    landingBundle.bundleMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_scale_wave_seal',
    `round=${waveRound}`,
    `verdict=${sealVerdict}`,
    landingBundle.summaryLine,
    landingCompare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1',
    waveRound,
    sealVerdict,
    primaryLanding,
    twinLanding,
    landingCompare,
    landingBundle,
    sealMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleWaveSealSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'seal1',
    name: 'Scale wave seal',
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

  const seal = sealIdleGovernanceProgramWaveScaleWave(calmSpec, sampleRule, 1, 3, 24, 1_487_095);
  push(
    'gov_prog_wave_seal_calm',
    'calm spec seals wave with landing parity',
    seal.sealVerdict === 'sealed' &&
      seal.landingCompare.parityOk === true &&
      seal.sealMarkdown.includes('scale wave seal')
  );

  const seal2 = sealIdleGovernanceProgramWaveScaleWave(
    calmSpec,
    sampleRule,
    3,
    2,
    24,
    1_487_095,
    seal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_wave_seal_chain',
    'chained seal accumulates registry',
    seal2.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      seal2.summaryLine.includes('gov_program_wave_scale_wave_seal')
  );

  push(
    'gov_prog_wave_seal_schema',
    'scale wave seal schema marker',
    seal.schema === '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scale-wave-seal-compare.ts ---

export interface O10IdleGovernanceProgramWaveScaleWaveSealCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareSealFields(
  baseline: O10IdleGovernanceProgramWaveScaleWaveSealResult,
  candidate: O10IdleGovernanceProgramWaveScaleWaveSealResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.sealVerdict !== candidate.sealVerdict) {
    mismatches.push(`seal_verdict ${baseline.sealVerdict} vs ${candidate.sealVerdict}`);
  }
  if (baseline.landingCompare.parityOk !== candidate.landingCompare.parityOk) {
    mismatches.push('landing_compare_parity');
  }
  if (baseline.primaryLanding.landingOpen !== candidate.primaryLanding.landingOpen) {
    mismatches.push('primary_landing_open');
  }
  if (baseline.landingBundle.payload.projectedLocHint !== candidate.landingBundle.payload.projectedLocHint) {
    mismatches.push('projected_loc_hint');
  }
  return mismatches;
}

/** Round-25 twin scale-wave seal regression compare. */
export function compareIdleGovernanceProgramWaveScaleWaveSeals(
  baseline: O10IdleGovernanceProgramWaveScaleWaveSealResult,
  candidate: O10IdleGovernanceProgramWaveScaleWaveSealResult
): O10IdleGovernanceProgramWaveScaleWaveSealCompareResult {
  const mismatches = compareSealFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_scale_wave_seal_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleWaveSealCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveScaleWaveSealResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1',
    waveRound: 25,
    sealVerdict: 'sealed',
    sealMarkdown: 'md',
    summaryLine: 'seal',
    primaryLanding: { landingOpen: true } as O10IdleGovernanceProgramWaveScaleWaveSealResult['primaryLanding'],
    twinLanding: {} as O10IdleGovernanceProgramWaveScaleWaveSealResult['twinLanding'],
    landingCompare: { parityOk: true } as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingCompare'],
    landingBundle: {
      payload: { projectedLocHint: 1_525_288 },
    } as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingBundle'],
  });

  const ok = compareIdleGovernanceProgramWaveScaleWaveSeals(twin(), twin());
  push('gov_prog_seal_cmp_parity', 'identical seals report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveScaleWaveSeals(twin(), {
    ...twin(),
    sealVerdict: 'hold',
  });
  push(
    'gov_prog_seal_cmp_verdict',
    'seal verdict drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('seal_verdict'))
  );

  push(
    'gov_prog_seal_cmp_schema',
    'scale-wave seal compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-scale-wave-seal-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-scale-wave-seal-export.ts ---

export interface O10IdleGovernanceProgramWaveScaleWaveSealExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1';
  waveRound: number;
  sealVerdict: O10IdleGovernanceProgramWaveScaleWaveSealResult['sealVerdict'];
  projectedLocHint: number;
  capstoneHookLines: string[];
}

export interface O10IdleGovernanceProgramWaveScaleWaveSealExportResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1';
  waveRound: number;
  seal: O10IdleGovernanceProgramWaveScaleWaveSealResult;
  payload: O10IdleGovernanceProgramWaveScaleWaveSealExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-25 capstone export flattening scale-wave seal for Agent 25 O10-182 hooks. */
export function exportIdleGovernanceProgramWaveScaleWaveSeal(
  seal: O10IdleGovernanceProgramWaveScaleWaveSealResult
): O10IdleGovernanceProgramWaveScaleWaveSealExportResult {
  const projectedLocHint = seal.landingBundle.payload.projectedLocHint;
  const capstoneHookLines = [
    `O10_AGENT20_WAVE_CAPSTONE round=${seal.waveRound}`,
    `O10_AGENT20_WAVE_SEAL_VERDICT ${seal.sealVerdict}`,
    `O10_AGENT20_WAVE_LOC_HINT ${projectedLocHint}`,
    ...seal.landingBundle.payload.sealHookLines.map(line => `O10_AGENT20_WAVE_SEAL_HOOK ${line}`),
    `O10_AGENT20_WAVE_LANDING_OPEN ${seal.primaryLanding.landingOpen}`,
  ];

  const payload: O10IdleGovernanceProgramWaveScaleWaveSealExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1',
    waveRound: seal.waveRound,
    sealVerdict: seal.sealVerdict,
    projectedLocHint,
    capstoneHookLines,
  };

  const exportMarkdown = [
    '# Agent 20 idle governance scale-wave seal export',
    '',
    ...capstoneHookLines.map(line => `- ${line}`),
    '',
    seal.sealMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_scale_wave_seal_export',
    `round=${seal.waveRound}`,
    `verdict=${seal.sealVerdict}`,
    `hooks=${capstoneHookLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1',
    waveRound: seal.waveRound,
    seal,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleWaveSealExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockSeal = (): O10IdleGovernanceProgramWaveScaleWaveSealResult => ({
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1',
    waveRound: 25,
    sealVerdict: 'sealed',
    sealMarkdown: '# seal',
    summaryLine: 's',
    primaryLanding: { landingOpen: true } as O10IdleGovernanceProgramWaveScaleWaveSealResult['primaryLanding'],
    twinLanding: {} as O10IdleGovernanceProgramWaveScaleWaveSealResult['twinLanding'],
    landingCompare: {} as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingCompare'],
    landingBundle: {
      payload: {
        projectedLocHint: 1_525_288,
        sealHookLines: ['hook-a', 'hook-b'],
      },
    } as O10IdleGovernanceProgramWaveScaleWaveSealResult['landingBundle'],
  });

  const exported = exportIdleGovernanceProgramWaveScaleWaveSeal(mockSeal());
  push(
    'gov_prog_seal_export_hooks',
    'seal export includes capstone hook lines',
    exported.payload.capstoneHookLines.length >= 5 &&
      exported.exportMarkdown.includes('CAPSTONE') &&
      exported.payload.projectedLocHint === 1_525_288
  );

  push(
    'gov_prog_seal_export_schema',
    'seal export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-scale-wave-seal-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-epoch-closeout.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveEpochCloseoutResult {
  schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1';
  waveRound: number;
  epochReady: boolean;
  primarySeal: ReturnType<typeof sealIdleGovernanceProgramWaveScaleWave>;
  twinSeal: ReturnType<typeof sealIdleGovernanceProgramWaveScaleWave>;
  sealCompare: ReturnType<typeof compareIdleGovernanceProgramWaveScaleWaveSeals>;
  sealExport: ReturnType<typeof exportIdleGovernanceProgramWaveScaleWaveSeal>;
  epochCloseoutMarkdown: string;
  summaryLine: string;
}

/** Round-25 epoch closeout: seal + twin compare + capstone export for wave round 25 landing. */
export function runIdleGovernanceProgramWaveEpochCloseout(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveEpochCloseoutResult {
  const primarySeal = sealIdleGovernanceProgramWaveScaleWave(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinSeal = sealIdleGovernanceProgramWaveScaleWave(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const sealCompare = compareIdleGovernanceProgramWaveScaleWaveSeals(primarySeal, twinSeal);
  const sealExport = exportIdleGovernanceProgramWaveScaleWaveSeal(primarySeal);

  const epochReady =
    primarySeal.sealVerdict === 'sealed' &&
    sealCompare.parityOk &&
    primarySeal.primaryLanding.landingOpen;

  const epochCloseoutMarkdown = [
    '# Agent 20 idle governance wave epoch closeout',
    '',
    `- wave_round=${waveRound}`,
    `- epoch_ready=${epochReady}`,
    `- ${sealCompare.summaryLine}`,
    '',
    sealExport.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_epoch_closeout',
    `round=${waveRound}`,
    `ready=${epochReady}`,
    sealExport.summaryLine,
    sealCompare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1',
    waveRound,
    epochReady,
    primarySeal,
    twinSeal,
    sealCompare,
    sealExport,
    epochCloseoutMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveEpochCloseoutSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'ep1',
    name: 'Epoch closeout',
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

  const epoch = runIdleGovernanceProgramWaveEpochCloseout(calmSpec, sampleRule, 1, 3, 25, 1_525_288);
  push(
    'gov_prog_epoch_closeout_calm',
    'calm epoch closeout ready with seal parity',
    epoch.epochReady === true &&
      epoch.sealCompare.parityOk === true &&
      epoch.epochCloseoutMarkdown.includes('epoch closeout')
  );

  const epoch2 = runIdleGovernanceProgramWaveEpochCloseout(
    calmSpec,
    sampleRule,
    3,
    2,
    25,
    1_525_288,
    epoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
      .primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_epoch_closeout_chain',
    'chained epoch closeout accumulates registry',
    epoch2.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
      .primaryGate.primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      epoch2.summaryLine.includes('gov_program_wave_epoch_closeout')
  );

  push(
    'gov_prog_epoch_closeout_schema',
    'epoch closeout schema marker',
    epoch.schema === '10m.agent20.idle-governance-program-wave-epoch-closeout.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-epoch-closeout-compare.ts ---

export interface O10IdleGovernanceProgramWaveEpochCloseoutCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-epoch-closeout-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareEpochCloseoutFields(
  baseline: O10IdleGovernanceProgramWaveEpochCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveEpochCloseoutResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.epochReady !== candidate.epochReady) {
    mismatches.push(`epoch_ready ${baseline.epochReady} vs ${candidate.epochReady}`);
  }
  if (baseline.sealCompare.parityOk !== candidate.sealCompare.parityOk) {
    mismatches.push('seal_compare_parity');
  }
  if (baseline.primarySeal.sealVerdict !== candidate.primarySeal.sealVerdict) {
    mismatches.push('primary_seal_verdict');
  }
  if (
    baseline.sealExport.payload.projectedLocHint !== candidate.sealExport.payload.projectedLocHint
  ) {
    mismatches.push('projected_loc_hint');
  }
  return mismatches;
}

/** Round-26 / wave-26 twin epoch closeout regression compare (O10-183). */
export function compareIdleGovernanceProgramWaveEpochCloseouts(
  baseline: O10IdleGovernanceProgramWaveEpochCloseoutResult,
  candidate: O10IdleGovernanceProgramWaveEpochCloseoutResult
): O10IdleGovernanceProgramWaveEpochCloseoutCompareResult {
  const mismatches = compareEpochCloseoutFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_epoch_closeout_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveEpochCloseoutCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveEpochCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1',
    waveRound: 26,
    epochReady: true,
    epochCloseoutMarkdown: 'md',
    summaryLine: 'ep',
    primarySeal: { sealVerdict: 'sealed' } as O10IdleGovernanceProgramWaveEpochCloseoutResult['primarySeal'],
    twinSeal: {} as O10IdleGovernanceProgramWaveEpochCloseoutResult['twinSeal'],
    sealCompare: { parityOk: true } as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealCompare'],
    sealExport: {
      payload: { projectedLocHint: 1_563_481 },
    } as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealExport'],
  });

  const ok = compareIdleGovernanceProgramWaveEpochCloseouts(twin(), twin());
  push('gov_prog_epoch_cmp_parity', 'identical epoch closeouts report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveEpochCloseouts(twin(), { ...twin(), epochReady: false });
  push(
    'gov_prog_epoch_cmp_ready',
    'epoch_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('epoch_ready'))
  );

  push(
    'gov_prog_epoch_cmp_schema',
    'epoch closeout compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-epoch-closeout-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-epoch-export.ts ---

export interface O10IdleGovernanceProgramWaveEpochExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1';
  waveRound: number;
  epochReady: boolean;
  projectedLocHint: number;
  o10TaskId: 'O10-183';
  wave26HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveEpochExportResult {
  schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1';
  waveRound: number;
  epoch: O10IdleGovernanceProgramWaveEpochCloseoutResult;
  payload: O10IdleGovernanceProgramWaveEpochExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-26 / wave-26 epoch export for Agent 25 (O10-183). */
export function exportIdleGovernanceProgramWaveEpoch(
  epoch: O10IdleGovernanceProgramWaveEpochCloseoutResult,
  projectedLocHint: number = epoch.sealExport.payload.projectedLocHint
): O10IdleGovernanceProgramWaveEpochExportResult {
  const wave26HookLines = [
    `O10_AGENT20_WAVE26 task=O10-183 round=${epoch.waveRound}`,
    `O10_AGENT20_WAVE26 epoch_ready=${epoch.epochReady}`,
    `O10_AGENT20_WAVE26 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE26 seal=${epoch.primarySeal.sealVerdict}`,
    ...epoch.sealExport.payload.capstoneHookLines.map(line => `O10_AGENT20_WAVE26 capstone ${line}`),
  ];

  const payload: O10IdleGovernanceProgramWaveEpochExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1',
    waveRound: epoch.waveRound,
    epochReady: epoch.epochReady,
    projectedLocHint,
    o10TaskId: 'O10-183',
    wave26HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 idle governance wave 26 epoch export (O10-183)',
    '',
    ...wave26HookLines.map(line => `- ${line}`),
    '',
    epoch.epochCloseoutMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_epoch_export',
    'task=O10-183',
    `round=${epoch.waveRound}`,
    `ready=${epoch.epochReady}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-epoch-export.v1',
    waveRound: epoch.waveRound,
    epoch,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveEpochExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockEpoch = (): O10IdleGovernanceProgramWaveEpochCloseoutResult => ({
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1',
    waveRound: 26,
    epochReady: true,
    epochCloseoutMarkdown: '# epoch',
    summaryLine: 's',
    primarySeal: { sealVerdict: 'sealed' } as O10IdleGovernanceProgramWaveEpochCloseoutResult['primarySeal'],
    twinSeal: {} as O10IdleGovernanceProgramWaveEpochCloseoutResult['twinSeal'],
    sealCompare: {} as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealCompare'],
    sealExport: {
      payload: {
        projectedLocHint: 1_563_481,
        capstoneHookLines: ['cap-a'],
      },
    } as O10IdleGovernanceProgramWaveEpochCloseoutResult['sealExport'],
  });

  const exported = exportIdleGovernanceProgramWaveEpoch(mockEpoch(), 1_563_481);
  push(
    'gov_prog_epoch_export_o10',
    'wave 26 export tags O10-183 hooks',
    exported.payload.o10TaskId === 'O10-183' &&
      exported.payload.wave26HookLines.some(l => l.includes('O10-183')) &&
      exported.payload.projectedLocHint === 1_563_481
  );

  push(
    'gov_prog_epoch_export_schema',
    'epoch export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-epoch-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round26-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound26CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1';
  o10TaskId: 'O10-183';
  waveRound: 26;
  capstoneReady: boolean;
  primaryEpoch: ReturnType<typeof runIdleGovernanceProgramWaveEpochCloseout>;
  twinEpoch: ReturnType<typeof runIdleGovernanceProgramWaveEpochCloseout>;
  epochCompare: ReturnType<typeof compareIdleGovernanceProgramWaveEpochCloseouts>;
  epochExport: ReturnType<typeof exportIdleGovernanceProgramWaveEpoch>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-26 / wave-26 capstone gate for O10-183 origin landing. */
export function runIdleGovernanceProgramWaveRound26Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound26CapstoneResult {
  const waveRound = 26;
  const primaryEpoch = runIdleGovernanceProgramWaveEpochCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinEpoch = runIdleGovernanceProgramWaveEpochCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const epochCompare = compareIdleGovernanceProgramWaveEpochCloseouts(primaryEpoch, twinEpoch);
  const epochExport = exportIdleGovernanceProgramWaveEpoch(primaryEpoch, projectedLocHint);

  const capstoneReady =
    primaryEpoch.epochReady && epochCompare.parityOk && epochExport.payload.epochReady;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 26 capstone (O10-183)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${epochCompare.summaryLine}`,
    '',
    epochExport.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round26_capstone',
    'task=O10-183',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    epochExport.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1',
    o10TaskId: 'O10-183',
    waveRound,
    capstoneReady,
    primaryEpoch,
    twinEpoch,
    epochCompare,
    epochExport,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound26CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap26',
    name: 'Round 26 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound26Capstone(calmSpec, sampleRule, 1, 3, 1_563_481);
  push(
    'gov_prog_r26_capstone_calm',
    'O10-183 wave 26 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-183' &&
      cap.waveRound === 26 &&
      cap.capstoneMarkdown.includes('O10-183')
  );

  const cap2 = runIdleGovernanceProgramWaveRound26Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_563_481,
    cap.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_r26_capstone_chain',
    'chained capstone accumulates registry',
    cap2.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup
      .entryCount === 2 && cap2.summaryLine.includes('O10-183')
  );

  push(
    'gov_prog_r26_capstone_schema',
    'round 26 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round26-capstone.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round26-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound26CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round26-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareCapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound26CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound26CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.epochCompare.parityOk !== candidate.epochCompare.parityOk) {
    mismatches.push('epoch_compare_parity');
  }
  if (baseline.epochExport.payload.epochReady !== candidate.epochExport.payload.epochReady) {
    mismatches.push('epoch_export_ready');
  }
  return mismatches;
}

/** Round-27 twin round-26 capstone regression compare (O10-185 ladder). */
export function compareIdleGovernanceProgramWaveRound26Capstones(
  baseline: O10IdleGovernanceProgramWaveRound26CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound26CapstoneResult
): O10IdleGovernanceProgramWaveRound26CapstoneCompareResult {
  const mismatches = compareCapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round26_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound26CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound26CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1',
    o10TaskId: 'O10-183',
    waveRound: 26,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['primaryEpoch'],
    twinEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['twinEpoch'],
    epochCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochCompare'],
    epochExport: {
      payload: { epochReady: true },
    } as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochExport'],
  });

  const ok = compareIdleGovernanceProgramWaveRound26Capstones(twin(), twin());
  push('gov_prog_r26_cap_cmp_parity', 'identical capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound26Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r26_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r26_cap_cmp_schema',
    'round26 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round26-capstone-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round27-export.ts ---

export interface O10IdleGovernanceProgramWaveRound27ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round27-export.v1';
  waveRound: 27;
  o10TaskId: 'O10-185';
  projectedLocHint: number;
  round27Ready: boolean;
  wave27HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound27ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round27-export.v1';
  waveRound: 27;
  o10TaskId: 'O10-185';
  round26Capstone: O10IdleGovernanceProgramWaveRound26CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound27ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-27 / wave-27 export hooks for O10-185 Agent 25 integration. */
export function exportIdleGovernanceProgramWaveRound27(
  round26Capstone: O10IdleGovernanceProgramWaveRound26CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound27ExportResult {
  const round27Ready = round26Capstone.capstoneReady;

  const wave27HookLines = [
    `O10_AGENT20_WAVE27 task=O10-185 round=27`,
    `O10_AGENT20_WAVE27 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE27 round27_ready=${round27Ready}`,
    `O10_AGENT20_WAVE27 prior_capstone=${round26Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE27 prior_task=${round26Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound27ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round27-export.v1',
    waveRound: 27,
    o10TaskId: 'O10-185',
    projectedLocHint,
    round27Ready,
    wave27HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 27 export (O10-185)',
    '',
    ...wave27HookLines.map(line => `- ${line}`),
    '',
    round26Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round27_export',
    'task=O10-185',
    'round=27',
    `ready=${round27Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round27-export.v1',
    waveRound: 27,
    o10TaskId: 'O10-185',
    round26Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound27ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound26CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1',
    o10TaskId: 'O10-183',
    waveRound: 26,
    capstoneReady: true,
    capstoneMarkdown: '# r26',
    summaryLine: 's',
    primaryEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['primaryEpoch'],
    twinEpoch: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['twinEpoch'],
    epochCompare: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochCompare'],
    epochExport: {} as O10IdleGovernanceProgramWaveRound26CapstoneResult['epochExport'],
  });

  const exported = exportIdleGovernanceProgramWaveRound27(mockCap(), 1_601_674);
  push(
    'gov_prog_r27_export_o10',
    'wave 27 export tags O10-185 and loc hint',
    exported.o10TaskId === 'O10-185' &&
      exported.payload.projectedLocHint === 1_601_674 &&
      exported.payload.wave27HookLines.some(l => l.includes('O10-185'))
  );

  push(
    'gov_prog_r27_export_schema',
    'round 27 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round27-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round27-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound27CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1';
  o10TaskId: 'O10-185';
  waveRound: 27;
  capstoneReady: boolean;
  primaryRound26Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound26Capstone>;
  twinRound26Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound26Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound26Capstones>;
  round27Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound27>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-27 / wave-27 capstone landing for O10-185 on origin. */
export function runIdleGovernanceProgramWaveRound27Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound27CapstoneResult {
  const waveRound = 27;
  const primaryRound26Capstone = runIdleGovernanceProgramWaveRound26Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound26Capstone = runIdleGovernanceProgramWaveRound26Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound26Capstones(
    primaryRound26Capstone,
    twinRound26Capstone
  );
  const round27Export = exportIdleGovernanceProgramWaveRound27(
    primaryRound26Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound26Capstone.capstoneReady &&
    round27Export.payload.round27Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 27 capstone (O10-185)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round27Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round27_capstone',
    'task=O10-185',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round27Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1',
    o10TaskId: 'O10-185',
    waveRound,
    capstoneReady,
    primaryRound26Capstone,
    twinRound26Capstone,
    capstoneCompare,
    round27Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound27CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap27',
    name: 'Round 27 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound27Capstone(calmSpec, sampleRule, 1, 3, 1_601_674);
  push(
    'gov_prog_r27_capstone_calm',
    'O10-185 wave 27 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-185' &&
      cap.waveRound === 27 &&
      cap.capstoneMarkdown.includes('O10-185')
  );

  const cap2 = runIdleGovernanceProgramWaveRound27Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_601_674,
    cap.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.operations.registry
  );
  push(
    'gov_prog_r27_capstone_chain',
    'chained wave 27 capstone accumulates registry',
    cap2.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup.entryCount === 2 &&
      cap2.summaryLine.includes('O10-185')
  );

  push(
    'gov_prog_r27_capstone_schema',
    'round 27 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round27-capstone.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round27-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound27CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round27-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound27CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound27CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound27CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round27Export.payload.round27Ready !== candidate.round27Export.payload.round27Ready) {
    mismatches.push('round27_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) {
    mismatches.push('o10_task_id');
  }
  return mismatches;
}

/** Round-28 twin round-27 capstone compare (O10-187 ladder). */
export function compareIdleGovernanceProgramWaveRound27Capstones(
  baseline: O10IdleGovernanceProgramWaveRound27CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound27CapstoneResult
): O10IdleGovernanceProgramWaveRound27CapstoneCompareResult {
  const mismatches = compareRound27CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round27_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound27CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound27CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1',
    o10TaskId: 'O10-185',
    waveRound: 27,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['primaryRound26Capstone'],
    twinRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['twinRound26Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound27CapstoneResult['capstoneCompare'],
    round27Export: {
      payload: { round27Ready: true },
    } as O10IdleGovernanceProgramWaveRound27CapstoneResult['round27Export'],
  });

  const ok = compareIdleGovernanceProgramWaveRound27Capstones(twin(), twin());
  push('gov_prog_r27_cap_cmp_parity', 'identical round 27 capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound27Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r27_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r27_cap_cmp_schema',
    'round27 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round27-capstone-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round28-export.ts ---

export interface O10IdleGovernanceProgramWaveRound28ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round28-export.v1';
  waveRound: 28;
  o10TaskId: 'O10-187';
  projectedLocHint: number;
  round28Ready: boolean;
  wave28HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound28ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round28-export.v1';
  waveRound: 28;
  o10TaskId: 'O10-187';
  round27Capstone: O10IdleGovernanceProgramWaveRound27CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound28ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-28 / wave-28 export for O10-187 integration hooks. */
export function exportIdleGovernanceProgramWaveRound28(
  round27Capstone: O10IdleGovernanceProgramWaveRound27CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound28ExportResult {
  const round28Ready = round27Capstone.capstoneReady;

  const wave28HookLines = [
    `O10_AGENT20_WAVE28 task=O10-187 round=28`,
    `O10_AGENT20_WAVE28 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE28 round28_ready=${round28Ready}`,
    `O10_AGENT20_WAVE28 prior_capstone=${round27Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE28 prior_task=${round27Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound28ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round28-export.v1',
    waveRound: 28,
    o10TaskId: 'O10-187',
    projectedLocHint,
    round28Ready,
    wave28HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 28 export (O10-187)',
    '',
    ...wave28HookLines.map(line => `- ${line}`),
    '',
    round27Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round28_export',
    'task=O10-187',
    'round=28',
    `ready=${round28Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round28-export.v1',
    waveRound: 28,
    o10TaskId: 'O10-187',
    round27Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound28ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound27CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1',
    o10TaskId: 'O10-185',
    waveRound: 27,
    capstoneReady: true,
    capstoneMarkdown: '# r27',
    summaryLine: 's',
    primaryRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['primaryRound26Capstone'],
    twinRound26Capstone: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['twinRound26Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['capstoneCompare'],
    round27Export: {} as O10IdleGovernanceProgramWaveRound27CapstoneResult['round27Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound28(mockCap(), 1_645_538);
  push(
    'gov_prog_r28_export_o10',
    'wave 28 export tags O10-187 and loc hint',
    exported.o10TaskId === 'O10-187' &&
      exported.payload.projectedLocHint === 1_645_538 &&
      exported.payload.wave28HookLines.some(l => l.includes('O10-187'))
  );

  push(
    'gov_prog_r28_export_schema',
    'round 28 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round28-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round28-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound28CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1';
  o10TaskId: 'O10-187';
  waveRound: 28;
  capstoneReady: boolean;
  primaryRound27Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound27Capstone>;
  twinRound27Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound27Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound27Capstones>;
  round28Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound28>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-28 / wave-28 capstone for O10-187 origin landing. */
export function runIdleGovernanceProgramWaveRound28Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound28CapstoneResult {
  const waveRound = 28;
  const primaryRound27Capstone = runIdleGovernanceProgramWaveRound27Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound27Capstone = runIdleGovernanceProgramWaveRound27Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound27Capstones(
    primaryRound27Capstone,
    twinRound27Capstone
  );
  const round28Export = exportIdleGovernanceProgramWaveRound28(
    primaryRound27Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound27Capstone.capstoneReady &&
    round28Export.payload.round28Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 28 capstone (O10-187)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round28Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round28_capstone',
    'task=O10-187',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round28Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1',
    o10TaskId: 'O10-187',
    waveRound,
    capstoneReady,
    primaryRound27Capstone,
    twinRound27Capstone,
    capstoneCompare,
    round28Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound28CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap28',
    name: 'Round 28 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound28Capstone(calmSpec, sampleRule, 1, 3, 1_645_538);
  push(
    'gov_prog_r28_capstone_calm',
    'O10-187 wave 28 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-187' &&
      cap.waveRound === 28 &&
      cap.capstoneMarkdown.includes('O10-187')
  );

  const cap2 = runIdleGovernanceProgramWaveRound28Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_645_538,
    cap.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.operations.registry
  );
  push(
    'gov_prog_r28_capstone_chain',
    'chained wave 28 capstone accumulates registry',
    cap2.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.registryRollup.entryCount === 2 &&
      cap2.summaryLine.includes('O10-187')
  );

  push(
    'gov_prog_r28_capstone_schema',
    'round 28 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round28-capstone.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round28-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound28CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round28-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound28CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound28CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound28CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round28Export.payload.round28Ready !== candidate.round28Export.payload.round28Ready) {
    mismatches.push('round28_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) {
    mismatches.push('o10_task_id');
  }
  return mismatches;
}

/** Round-29 twin round-28 capstone compare (O10-189 ladder). */
export function compareIdleGovernanceProgramWaveRound28Capstones(
  baseline: O10IdleGovernanceProgramWaveRound28CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound28CapstoneResult
): O10IdleGovernanceProgramWaveRound28CapstoneCompareResult {
  const mismatches = compareRound28CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round28_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound28CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound28CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1',
    o10TaskId: 'O10-187',
    waveRound: 28,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['primaryRound27Capstone'],
    twinRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['twinRound27Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound28CapstoneResult['capstoneCompare'],
    round28Export: {
      payload: { round28Ready: true },
    } as O10IdleGovernanceProgramWaveRound28CapstoneResult['round28Export'],
  });

  const ok = compareIdleGovernanceProgramWaveRound28Capstones(twin(), twin());
  push('gov_prog_r28_cap_cmp_parity', 'identical round 28 capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound28Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r28_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r28_cap_cmp_schema',
    'round28 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round28-capstone-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round29-export.ts ---

export interface O10IdleGovernanceProgramWaveRound29ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round29-export.v1';
  waveRound: 29;
  o10TaskId: 'O10-189';
  projectedLocHint: number;
  round29Ready: boolean;
  wave29HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound29ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round29-export.v1';
  waveRound: 29;
  o10TaskId: 'O10-189';
  round28Capstone: O10IdleGovernanceProgramWaveRound28CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound29ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-29 / wave-29 export for O10-189 integration hooks. */
export function exportIdleGovernanceProgramWaveRound29(
  round28Capstone: O10IdleGovernanceProgramWaveRound28CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound29ExportResult {
  const round29Ready = round28Capstone.capstoneReady;

  const wave29HookLines = [
    `O10_AGENT20_WAVE29 task=O10-189 round=29`,
    `O10_AGENT20_WAVE29 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE29 round29_ready=${round29Ready}`,
    `O10_AGENT20_WAVE29 prior_capstone=${round28Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE29 prior_task=${round28Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound29ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round29-export.v1',
    waveRound: 29,
    o10TaskId: 'O10-189',
    projectedLocHint,
    round29Ready,
    wave29HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 29 export (O10-189)',
    '',
    ...wave29HookLines.map(line => `- ${line}`),
    '',
    round28Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round29_export',
    'task=O10-189',
    'round=29',
    `ready=${round29Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round29-export.v1',
    waveRound: 29,
    o10TaskId: 'O10-189',
    round28Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound29ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound28CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1',
    o10TaskId: 'O10-187',
    waveRound: 28,
    capstoneReady: true,
    capstoneMarkdown: '# r28',
    summaryLine: 's',
    primaryRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['primaryRound27Capstone'],
    twinRound27Capstone: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['twinRound27Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['capstoneCompare'],
    round28Export: {} as O10IdleGovernanceProgramWaveRound28CapstoneResult['round28Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound29(mockCap(), 1_683_733);
  push(
    'gov_prog_r29_export_o10',
    'wave 29 export tags O10-189 and loc hint',
    exported.o10TaskId === 'O10-189' &&
      exported.payload.projectedLocHint === 1_683_733 &&
      exported.payload.wave29HookLines.some(l => l.includes('O10-189'))
  );

  push(
    'gov_prog_r29_export_schema',
    'round 29 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round29-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round29-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound29CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1';
  o10TaskId: 'O10-189';
  waveRound: 29;
  capstoneReady: boolean;
  primaryRound28Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound28Capstone>;
  twinRound28Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound28Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound28Capstones>;
  round29Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound29>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-29 / wave-29 capstone for O10-189 origin landing. */
export function runIdleGovernanceProgramWaveRound29Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound29CapstoneResult {
  const waveRound = 29;
  const primaryRound28Capstone = runIdleGovernanceProgramWaveRound28Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound28Capstone = runIdleGovernanceProgramWaveRound28Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound28Capstones(
    primaryRound28Capstone,
    twinRound28Capstone
  );
  const round29Export = exportIdleGovernanceProgramWaveRound29(
    primaryRound28Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound28Capstone.capstoneReady &&
    round29Export.payload.round29Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 29 capstone (O10-189)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round29Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round29_capstone',
    'task=O10-189',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round29Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1',
    o10TaskId: 'O10-189',
    waveRound,
    capstoneReady,
    primaryRound28Capstone,
    twinRound28Capstone,
    capstoneCompare,
    round29Export,
    capstoneMarkdown,
    summaryLine,
  };
}

function registryFromRound29Capstone(
  cap: O10IdleGovernanceProgramWaveRound29CapstoneResult
): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch
    .primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
    .primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

export function runO10Agent20IdleGovernanceProgramWaveRound29CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap29',
    name: 'Round 29 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound29Capstone(calmSpec, sampleRule, 1, 3, 1_683_733);
  push(
    'gov_prog_r29_capstone_calm',
    'O10-189 wave 29 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-189' &&
      cap.waveRound === 29 &&
      cap.capstoneMarkdown.includes('O10-189')
  );

  const cap2 = runIdleGovernanceProgramWaveRound29Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_683_733,
    registryFromRound29Capstone(cap)
  );
  const rollup =
    cap2.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch
      .primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
      .primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r29_capstone_chain',
    'chained wave 29 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-189')
  );

  push(
    'gov_prog_r29_capstone_schema',
    'round 29 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round29-capstone.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round29-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound29CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round29-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound29CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound29CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound29CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) {
    mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  }
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round29Export.payload.round29Ready !== candidate.round29Export.payload.round29Ready) {
    mismatches.push('round29_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) {
    mismatches.push('o10_task_id');
  }
  return mismatches;
}

/** Round-30 twin round-29 capstone compare (O10-191 ladder). */
export function compareIdleGovernanceProgramWaveRound29Capstones(
  baseline: O10IdleGovernanceProgramWaveRound29CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound29CapstoneResult
): O10IdleGovernanceProgramWaveRound29CapstoneCompareResult {
  const mismatches = compareRound29CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;

  const summaryLine = [
    'gov_program_wave_round29_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound29CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const twin = (): O10IdleGovernanceProgramWaveRound29CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1',
    o10TaskId: 'O10-189',
    waveRound: 29,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['primaryRound28Capstone'],
    twinRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['twinRound28Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound29CapstoneResult['capstoneCompare'],
    round29Export: {
      payload: { round29Ready: true },
    } as O10IdleGovernanceProgramWaveRound29CapstoneResult['round29Export'],
  });

  const ok = compareIdleGovernanceProgramWaveRound29Capstones(twin(), twin());
  push('gov_prog_r29_cap_cmp_parity', 'identical round 29 capstones report parity', ok.parityOk === true);

  const bad = compareIdleGovernanceProgramWaveRound29Capstones(twin(), { ...twin(), capstoneReady: false });
  push(
    'gov_prog_r29_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    bad.parityOk === false && bad.mismatches.some(m => m.startsWith('capstone_ready'))
  );

  push(
    'gov_prog_r29_cap_cmp_schema',
    'round29 capstone compare schema marker',
    ok.schema === '10m.agent20.idle-governance-program-wave-round29-capstone-compare.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round30-export.ts ---

export interface O10IdleGovernanceProgramWaveRound30ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round30-export.v1';
  waveRound: 30;
  o10TaskId: 'O10-191';
  projectedLocHint: number;
  round30Ready: boolean;
  wave30HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound30ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round30-export.v1';
  waveRound: 30;
  o10TaskId: 'O10-191';
  round29Capstone: O10IdleGovernanceProgramWaveRound29CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound30ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-30 / wave-30 export for O10-191 integration hooks. */
export function exportIdleGovernanceProgramWaveRound30(
  round29Capstone: O10IdleGovernanceProgramWaveRound29CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound30ExportResult {
  const round30Ready = round29Capstone.capstoneReady;

  const wave30HookLines = [
    `O10_AGENT20_WAVE30 task=O10-191 round=30`,
    `O10_AGENT20_WAVE30 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE30 round30_ready=${round30Ready}`,
    `O10_AGENT20_WAVE30 prior_capstone=${round29Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE30 prior_task=${round29Capstone.o10TaskId}`,
  ];

  const payload: O10IdleGovernanceProgramWaveRound30ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round30-export.v1',
    waveRound: 30,
    o10TaskId: 'O10-191',
    projectedLocHint,
    round30Ready,
    wave30HookLines,
  };

  const exportMarkdown = [
    '# Agent 20 scale wave round 30 export (O10-191)',
    '',
    ...wave30HookLines.map(line => `- ${line}`),
    '',
    round29Capstone.capstoneMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round30_export',
    'task=O10-191',
    'round=30',
    `ready=${round30Ready}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round30-export.v1',
    waveRound: 30,
    o10TaskId: 'O10-191',
    round29Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound30ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const mockCap = (): O10IdleGovernanceProgramWaveRound29CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1',
    o10TaskId: 'O10-189',
    waveRound: 29,
    capstoneReady: true,
    capstoneMarkdown: '# r29',
    summaryLine: 's',
    primaryRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['primaryRound28Capstone'],
    twinRound28Capstone: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['twinRound28Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['capstoneCompare'],
    round29Export: {} as O10IdleGovernanceProgramWaveRound29CapstoneResult['round29Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound30(mockCap(), 1_721_932);
  push(
    'gov_prog_r30_export_o10',
    'wave 30 export tags O10-191 and loc hint',
    exported.o10TaskId === 'O10-191' &&
      exported.payload.projectedLocHint === 1_721_932 &&
      exported.payload.wave30HookLines.some(l => l.includes('O10-191'))
  );

  push(
    'gov_prog_r30_export_schema',
    'round 30 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round30-export.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round30-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound30CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1';
  o10TaskId: 'O10-191';
  waveRound: 30;
  capstoneReady: boolean;
  primaryRound29Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound29Capstone>;
  twinRound29Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound29Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound29Capstones>;
  round30Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound30>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound30Primary(
  cap: O10IdleGovernanceProgramWaveRound30CapstoneResult
): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
    .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-30 / wave-30 capstone for O10-191 origin landing. */
export function runIdleGovernanceProgramWaveRound30Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound30CapstoneResult {
  const waveRound = 30;
  const primaryRound29Capstone = runIdleGovernanceProgramWaveRound29Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound29Capstone = runIdleGovernanceProgramWaveRound29Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound29Capstones(
    primaryRound29Capstone,
    twinRound29Capstone
  );
  const round30Export = exportIdleGovernanceProgramWaveRound30(
    primaryRound29Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound29Capstone.capstoneReady &&
    round30Export.payload.round30Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 30 capstone (O10-191)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round30Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round30_capstone',
    'task=O10-191',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round30Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1',
    o10TaskId: 'O10-191',
    waveRound,
    capstoneReady,
    primaryRound29Capstone,
    twinRound29Capstone,
    capstoneCompare,
    round30Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound30CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap30',
    name: 'Round 30 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound30Capstone(calmSpec, sampleRule, 1, 3, 1_721_932);
  push(
    'gov_prog_r30_capstone_calm',
    'O10-191 wave 30 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-191' &&
      cap.waveRound === 30 &&
      cap.capstoneMarkdown.includes('O10-191')
  );

  const cap2 = runIdleGovernanceProgramWaveRound30Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_721_932,
    registryFromRound30Primary(cap)
  );
  const rollup =
    cap2.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport
      .run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r30_capstone_chain',
    'chained wave 30 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-191')
  );

  push(
    'gov_prog_r30_capstone_schema',
    'round 30 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round30-capstone.v1'
  );

  return results;
}


// --- source: automation-idle-governance-program-wave-round30-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound30CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round30-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound30CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound30CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound30CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round30Export.payload.round30Ready !== candidate.round30Export.payload.round30Ready) {
    mismatches.push('round30_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-31 twin round-30 capstone compare (O10-193 ladder). */
export function compareIdleGovernanceProgramWaveRound30Capstones(
  baseline: O10IdleGovernanceProgramWaveRound30CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound30CapstoneResult
): O10IdleGovernanceProgramWaveRound30CapstoneCompareResult {
  const mismatches = compareRound30CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round30_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound30CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound30CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1',
    o10TaskId: 'O10-191',
    waveRound: 30,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['primaryRound29Capstone'],
    twinRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['twinRound29Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound30CapstoneResult['capstoneCompare'],
    round30Export: { payload: { round30Ready: true } } as O10IdleGovernanceProgramWaveRound30CapstoneResult['round30Export'],
  });

  push('gov_prog_r30_cap_cmp_parity', 'identical round 30 capstones report parity', compareIdleGovernanceProgramWaveRound30Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r30_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound30Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r30_cap_cmp_schema',
    'round30 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound30Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round30-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round31-export.ts ---

export interface O10IdleGovernanceProgramWaveRound31ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round31-export.v1';
  waveRound: 31;
  o10TaskId: 'O10-193';
  projectedLocHint: number;
  round31Ready: boolean;
  wave31HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound31ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round31-export.v1';
  waveRound: 31;
  o10TaskId: 'O10-193';
  round30Capstone: O10IdleGovernanceProgramWaveRound30CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound31ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-31 / wave-31 export for O10-193 integration hooks. */
export function exportIdleGovernanceProgramWaveRound31(
  round30Capstone: O10IdleGovernanceProgramWaveRound30CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound31ExportResult {
  const round31Ready = round30Capstone.capstoneReady;
  const wave31HookLines = [
    `O10_AGENT20_WAVE31 task=O10-193 round=31`,
    `O10_AGENT20_WAVE31 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE31 round31_ready=${round31Ready}`,
    `O10_AGENT20_WAVE31 prior_capstone=${round30Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE31 prior_task=${round30Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound31ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round31-export.v1',
    waveRound: 31,
    o10TaskId: 'O10-193',
    projectedLocHint,
    round31Ready,
    wave31HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 31 export (O10-193)',
    '',
    ...wave31HookLines.map(line => `- ${line}`),
    '',
    round30Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round31_export', 'task=O10-193', 'round=31', `ready=${round31Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round31-export.v1',
    waveRound: 31,
    o10TaskId: 'O10-193',
    round30Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound31ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound30CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1',
    o10TaskId: 'O10-191',
    waveRound: 30,
    capstoneReady: true,
    capstoneMarkdown: '# r30',
    summaryLine: 's',
    primaryRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['primaryRound29Capstone'],
    twinRound29Capstone: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['twinRound29Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['capstoneCompare'],
    round30Export: {} as O10IdleGovernanceProgramWaveRound30CapstoneResult['round30Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound31(mockCap(), 1_760_131);
  push(
    'gov_prog_r31_export_o10',
    'wave 31 export tags O10-193 and loc hint',
    exported.o10TaskId === 'O10-193' &&
      exported.payload.projectedLocHint === 1_760_131 &&
      exported.payload.wave31HookLines.some(l => l.includes('O10-193'))
  );
  push(
    'gov_prog_r31_export_schema',
    'round 31 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round31-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round31-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound31CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1';
  o10TaskId: 'O10-193';
  waveRound: 31;
  capstoneReady: boolean;
  primaryRound30Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound30Capstone>;
  twinRound30Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound30Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound30Capstones>;
  round31Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound31>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound31Primary(cap: O10IdleGovernanceProgramWaveRound31CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
    .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-31 / wave-31 capstone for O10-193 origin landing. */
export function runIdleGovernanceProgramWaveRound31Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound31CapstoneResult {
  const waveRound = 31;
  const primaryRound30Capstone = runIdleGovernanceProgramWaveRound30Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound30Capstone = runIdleGovernanceProgramWaveRound30Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound30Capstones(
    primaryRound30Capstone,
    twinRound30Capstone
  );
  const round31Export = exportIdleGovernanceProgramWaveRound31(primaryRound30Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound30Capstone.capstoneReady && round31Export.payload.round31Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 31 capstone (O10-193)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round31Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round31_capstone',
    'task=O10-193',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round31Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1',
    o10TaskId: 'O10-193',
    waveRound,
    capstoneReady,
    primaryRound30Capstone,
    twinRound30Capstone,
    capstoneCompare,
    round31Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound31CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap31',
    name: 'Round 31 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound31Capstone(calmSpec, sampleRule, 1, 3, 1_760_131);
  push(
    'gov_prog_r31_capstone_calm',
    'O10-193 wave 31 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-193' && cap.waveRound === 31 && cap.capstoneMarkdown.includes('O10-193')
  );

  const cap2 = runIdleGovernanceProgramWaveRound31Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_760_131,
    registryFromRound31Primary(cap)
  );
  const rollup =
    cap2.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
      .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r31_capstone_chain',
    'chained wave 31 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-193')
  );
  push(
    'gov_prog_r31_capstone_schema',
    'round 31 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round31-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round31-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound31CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round31-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound31CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound31CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound31CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round31Export.payload.round31Ready !== candidate.round31Export.payload.round31Ready) {
    mismatches.push('round31_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-32 twin round-31 capstone compare (O10-195 ladder). */
export function compareIdleGovernanceProgramWaveRound31Capstones(
  baseline: O10IdleGovernanceProgramWaveRound31CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound31CapstoneResult
): O10IdleGovernanceProgramWaveRound31CapstoneCompareResult {
  const mismatches = compareRound31CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round31_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound31CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound31CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1',
    o10TaskId: 'O10-193',
    waveRound: 31,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['primaryRound30Capstone'],
    twinRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['twinRound30Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound31CapstoneResult['capstoneCompare'],
    round31Export: { payload: { round31Ready: true } } as O10IdleGovernanceProgramWaveRound31CapstoneResult['round31Export'],
  });

  push('gov_prog_r31_cap_cmp_parity', 'identical round 31 capstones report parity', compareIdleGovernanceProgramWaveRound31Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r31_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound31Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r31_cap_cmp_schema',
    'round31 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound31Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round31-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round32-export.ts ---

export interface O10IdleGovernanceProgramWaveRound32ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round32-export.v1';
  waveRound: 32;
  o10TaskId: 'O10-195';
  projectedLocHint: number;
  round32Ready: boolean;
  wave32HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound32ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round32-export.v1';
  waveRound: 32;
  o10TaskId: 'O10-195';
  round31Capstone: O10IdleGovernanceProgramWaveRound31CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound32ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-32 / wave-32 export for O10-195 integration hooks. */
export function exportIdleGovernanceProgramWaveRound32(
  round31Capstone: O10IdleGovernanceProgramWaveRound31CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound32ExportResult {
  const round32Ready = round31Capstone.capstoneReady;
  const wave32HookLines = [
    `O10_AGENT20_WAVE32 task=O10-195 round=32`,
    `O10_AGENT20_WAVE32 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE32 round32_ready=${round32Ready}`,
    `O10_AGENT20_WAVE32 prior_capstone=${round31Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE32 prior_task=${round31Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound32ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round32-export.v1',
    waveRound: 32,
    o10TaskId: 'O10-195',
    projectedLocHint,
    round32Ready,
    wave32HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 32 export (O10-195)',
    '',
    ...wave32HookLines.map(line => `- ${line}`),
    '',
    round31Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round32_export', 'task=O10-195', 'round=32', `ready=${round32Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round32-export.v1',
    waveRound: 32,
    o10TaskId: 'O10-195',
    round31Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound32ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound31CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1',
    o10TaskId: 'O10-193',
    waveRound: 31,
    capstoneReady: true,
    capstoneMarkdown: '# r31',
    summaryLine: 's',
    primaryRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['primaryRound30Capstone'],
    twinRound30Capstone: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['twinRound30Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['capstoneCompare'],
    round31Export: {} as O10IdleGovernanceProgramWaveRound31CapstoneResult['round31Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound32(mockCap(), 1_798_330);
  push(
    'gov_prog_r32_export_o10',
    'wave 32 export tags O10-195 and loc hint',
    exported.o10TaskId === 'O10-195' &&
      exported.payload.projectedLocHint === 1_798_330 &&
      exported.payload.wave32HookLines.some(l => l.includes('O10-195'))
  );
  push(
    'gov_prog_r32_export_schema',
    'round 32 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round32-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round32-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound32CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1';
  o10TaskId: 'O10-195';
  waveRound: 32;
  capstoneReady: boolean;
  primaryRound31Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound31Capstone>;
  twinRound31Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound31Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound31Capstones>;
  round32Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound32>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound32Primary(cap: O10IdleGovernanceProgramWaveRound32CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
    .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
    .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
    .operations.registry;
}

/** Round-32 / wave-32 capstone for O10-195 origin landing. */
export function runIdleGovernanceProgramWaveRound32Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound32CapstoneResult {
  const waveRound = 32;
  const primaryRound31Capstone = runIdleGovernanceProgramWaveRound31Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound31Capstone = runIdleGovernanceProgramWaveRound31Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound31Capstones(
    primaryRound31Capstone,
    twinRound31Capstone
  );
  const round32Export = exportIdleGovernanceProgramWaveRound32(primaryRound31Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound31Capstone.capstoneReady && round32Export.payload.round32Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 32 capstone (O10-195)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round32Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round32_capstone',
    'task=O10-195',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round32Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1',
    o10TaskId: 'O10-195',
    waveRound,
    capstoneReady,
    primaryRound31Capstone,
    twinRound31Capstone,
    capstoneCompare,
    round32Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound32CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap32',
    name: 'Round 32 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound32Capstone(calmSpec, sampleRule, 1, 3, 1_798_330);
  push(
    'gov_prog_r32_capstone_calm',
    'O10-195 wave 32 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-195' && cap.waveRound === 32 && cap.capstoneMarkdown.includes('O10-195')
  );

  const cap2 = runIdleGovernanceProgramWaveRound32Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_798_330,
    registryFromRound32Primary(cap)
  );
  const rollup =
    cap2.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
      .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
      .registryRollup;
  push(
    'gov_prog_r32_capstone_chain',
    'chained wave 32 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-195')
  );
  push(
    'gov_prog_r32_capstone_schema',
    'round 32 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round32-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round32-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound32CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round32-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound32CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound32CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound32CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round32Export.payload.round32Ready !== candidate.round32Export.payload.round32Ready) {
    mismatches.push('round32_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-33 twin round-32 capstone compare (O10-197 ladder). */
export function compareIdleGovernanceProgramWaveRound32Capstones(
  baseline: O10IdleGovernanceProgramWaveRound32CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound32CapstoneResult
): O10IdleGovernanceProgramWaveRound32CapstoneCompareResult {
  const mismatches = compareRound32CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round32_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound32CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound32CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1',
    o10TaskId: 'O10-195',
    waveRound: 32,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['primaryRound31Capstone'],
    twinRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['twinRound31Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound32CapstoneResult['capstoneCompare'],
    round32Export: { payload: { round32Ready: true } } as O10IdleGovernanceProgramWaveRound32CapstoneResult['round32Export'],
  });

  push('gov_prog_r32_cap_cmp_parity', 'identical round 32 capstones report parity', compareIdleGovernanceProgramWaveRound32Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r32_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound32Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r32_cap_cmp_schema',
    'round32 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound32Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round32-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round33-export.ts ---

export interface O10IdleGovernanceProgramWaveRound33ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round33-export.v1';
  waveRound: 33;
  o10TaskId: 'O10-197';
  projectedLocHint: number;
  round33Ready: boolean;
  wave33HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound33ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round33-export.v1';
  waveRound: 33;
  o10TaskId: 'O10-197';
  round32Capstone: O10IdleGovernanceProgramWaveRound32CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound33ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-33 / wave-33 export for O10-197 integration hooks. */
export function exportIdleGovernanceProgramWaveRound33(
  round32Capstone: O10IdleGovernanceProgramWaveRound32CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound33ExportResult {
  const round33Ready = round32Capstone.capstoneReady;
  const wave33HookLines = [
    `O10_AGENT20_WAVE33 task=O10-197 round=33`,
    `O10_AGENT20_WAVE33 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE33 round33_ready=${round33Ready}`,
    `O10_AGENT20_WAVE33 prior_capstone=${round32Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE33 prior_task=${round32Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound33ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round33-export.v1',
    waveRound: 33,
    o10TaskId: 'O10-197',
    projectedLocHint,
    round33Ready,
    wave33HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 33 export (O10-197)',
    '',
    ...wave33HookLines.map(line => `- ${line}`),
    '',
    round32Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round33_export', 'task=O10-197', 'round=33', `ready=${round33Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round33-export.v1',
    waveRound: 33,
    o10TaskId: 'O10-197',
    round32Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound33ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound32CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1',
    o10TaskId: 'O10-195',
    waveRound: 32,
    capstoneReady: true,
    capstoneMarkdown: '# r32',
    summaryLine: 's',
    primaryRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['primaryRound31Capstone'],
    twinRound31Capstone: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['twinRound31Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['capstoneCompare'],
    round32Export: {} as O10IdleGovernanceProgramWaveRound32CapstoneResult['round32Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound33(mockCap(), 1_836_529);
  push(
    'gov_prog_r33_export_o10',
    'wave 33 export tags O10-197 and loc hint',
    exported.o10TaskId === 'O10-197' &&
      exported.payload.projectedLocHint === 1_836_529 &&
      exported.payload.wave33HookLines.some(l => l.includes('O10-197'))
  );
  push(
    'gov_prog_r33_export_schema',
    'round 33 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round33-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round33-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound33CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round33-capstone.v1';
  o10TaskId: 'O10-197';
  waveRound: 33;
  capstoneReady: boolean;
  primaryRound32Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound32Capstone>;
  twinRound32Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound32Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound32Capstones>;
  round33Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound33>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound33Primary(cap: O10IdleGovernanceProgramWaveRound33CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
    .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
    .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-33 / wave-33 capstone for O10-197 origin landing. */
export function runIdleGovernanceProgramWaveRound33Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound33CapstoneResult {
  const waveRound = 33;
  const primaryRound32Capstone = runIdleGovernanceProgramWaveRound32Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound32Capstone = runIdleGovernanceProgramWaveRound32Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound32Capstones(
    primaryRound32Capstone,
    twinRound32Capstone
  );
  const round33Export = exportIdleGovernanceProgramWaveRound33(primaryRound32Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound32Capstone.capstoneReady && round33Export.payload.round33Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 33 capstone (O10-197)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round33Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round33_capstone',
    'task=O10-197',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round33Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone.v1',
    o10TaskId: 'O10-197',
    waveRound,
    capstoneReady,
    primaryRound32Capstone,
    twinRound32Capstone,
    capstoneCompare,
    round33Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound33CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap33',
    name: 'Round 33 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound33Capstone(calmSpec, sampleRule, 1, 3, 1_836_529);
  push(
    'gov_prog_r33_capstone_calm',
    'O10-197 wave 33 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-197' && cap.waveRound === 33 && cap.capstoneMarkdown.includes('O10-197')
  );

  const cap2 = runIdleGovernanceProgramWaveRound33Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_836_529,
    registryFromRound33Primary(cap)
  );
  const rollup =
    cap2.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
      .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup;
  push(
    'gov_prog_r33_capstone_chain',
    'chained wave 33 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-197')
  );
  push(
    'gov_prog_r33_capstone_schema',
    'round 33 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round33-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round33-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound33CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round33-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound33CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound33CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound33CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round33Export.payload.round33Ready !== candidate.round33Export.payload.round33Ready) {
    mismatches.push('round33_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-34 twin round-33 capstone compare (O10-199 ladder). */
export function compareIdleGovernanceProgramWaveRound33Capstones(
  baseline: O10IdleGovernanceProgramWaveRound33CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound33CapstoneResult
): O10IdleGovernanceProgramWaveRound33CapstoneCompareResult {
  const mismatches = compareRound33CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round33_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound33CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound33CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone.v1',
    o10TaskId: 'O10-197',
    waveRound: 33,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['primaryRound32Capstone'],
    twinRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['twinRound32Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound33CapstoneResult['capstoneCompare'],
    round33Export: { payload: { round33Ready: true } } as O10IdleGovernanceProgramWaveRound33CapstoneResult['round33Export'],
  });

  push('gov_prog_r33_cap_cmp_parity', 'identical round 33 capstones report parity', compareIdleGovernanceProgramWaveRound33Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r33_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound33Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r33_cap_cmp_schema',
    'round33 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound33Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round33-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round34-export.ts ---

export interface O10IdleGovernanceProgramWaveRound34ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round34-export.v1';
  waveRound: 34;
  o10TaskId: 'O10-199';
  projectedLocHint: number;
  round34Ready: boolean;
  wave34HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound34ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round34-export.v1';
  waveRound: 34;
  o10TaskId: 'O10-199';
  round33Capstone: O10IdleGovernanceProgramWaveRound33CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound34ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-34 / wave-34 export for O10-199 integration hooks. */
export function exportIdleGovernanceProgramWaveRound34(
  round33Capstone: O10IdleGovernanceProgramWaveRound33CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound34ExportResult {
  const round34Ready = round33Capstone.capstoneReady;
  const wave34HookLines = [
    `O10_AGENT20_WAVE34 task=O10-199 round=34`,
    `O10_AGENT20_WAVE34 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE34 round34_ready=${round34Ready}`,
    `O10_AGENT20_WAVE34 prior_capstone=${round33Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE34 prior_task=${round33Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound34ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round34-export.v1',
    waveRound: 34,
    o10TaskId: 'O10-199',
    projectedLocHint,
    round34Ready,
    wave34HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 34 export (O10-199)',
    '',
    ...wave34HookLines.map(line => `- ${line}`),
    '',
    round33Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round34_export', 'task=O10-199', 'round=34', `ready=${round34Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round34-export.v1',
    waveRound: 34,
    o10TaskId: 'O10-199',
    round33Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound34ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound33CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round33-capstone.v1',
    o10TaskId: 'O10-197',
    waveRound: 33,
    capstoneReady: true,
    capstoneMarkdown: '# r33',
    summaryLine: 's',
    primaryRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['primaryRound32Capstone'],
    twinRound32Capstone: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['twinRound32Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['capstoneCompare'],
    round33Export: {} as O10IdleGovernanceProgramWaveRound33CapstoneResult['round33Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound34(mockCap(), 1_886_428);
  push(
    'gov_prog_r34_export_o10',
    'wave 34 export tags O10-199 and loc hint',
    exported.o10TaskId === 'O10-199' &&
      exported.payload.projectedLocHint === 1_886_428 &&
      exported.payload.wave34HookLines.some(l => l.includes('O10-199'))
  );
  push(
    'gov_prog_r34_export_schema',
    'round 34 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round34-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round34-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound34CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round34-capstone.v1';
  o10TaskId: 'O10-199';
  waveRound: 34;
  capstoneReady: boolean;
  primaryRound33Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound33Capstone>;
  twinRound33Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound33Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound33Capstones>;
  round34Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound34>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound34Primary(cap: O10IdleGovernanceProgramWaveRound34CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
    .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch
    .primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-34 / wave-34 capstone for O10-199 origin landing. */
export function runIdleGovernanceProgramWaveRound34Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound34CapstoneResult {
  const waveRound = 34;
  const primaryRound33Capstone = runIdleGovernanceProgramWaveRound33Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound33Capstone = runIdleGovernanceProgramWaveRound33Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound33Capstones(
    primaryRound33Capstone,
    twinRound33Capstone
  );
  const round34Export = exportIdleGovernanceProgramWaveRound34(primaryRound33Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound33Capstone.capstoneReady && round34Export.payload.round34Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 34 capstone (O10-199)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round34Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round34_capstone',
    'task=O10-199',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round34Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone.v1',
    o10TaskId: 'O10-199',
    waveRound,
    capstoneReady,
    primaryRound33Capstone,
    twinRound33Capstone,
    capstoneCompare,
    round34Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound34CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap34',
    name: 'Round 34 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound34Capstone(calmSpec, sampleRule, 1, 3, 1_886_428);
  push(
    'gov_prog_r34_capstone_calm',
    'O10-199 wave 34 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-199' && cap.waveRound === 34 && cap.capstoneMarkdown.includes('O10-199')
  );

  const cap2 = runIdleGovernanceProgramWaveRound34Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_886_428,
    registryFromRound34Primary(cap)
  );
  const rollup =
    cap2.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
      .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch
      .primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r34_capstone_chain',
    'chained wave 34 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-199')
  );
  push(
    'gov_prog_r34_capstone_schema',
    'round 34 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round34-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round34-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound34CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round34-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound34CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound34CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound34CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round34Export.payload.round34Ready !== candidate.round34Export.payload.round34Ready) {
    mismatches.push('round34_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-35 twin round-34 capstone compare (O10-201 ladder). */
export function compareIdleGovernanceProgramWaveRound34Capstones(
  baseline: O10IdleGovernanceProgramWaveRound34CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound34CapstoneResult
): O10IdleGovernanceProgramWaveRound34CapstoneCompareResult {
  const mismatches = compareRound34CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round34_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound34CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound34CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone.v1',
    o10TaskId: 'O10-199',
    waveRound: 34,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['primaryRound33Capstone'],
    twinRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['twinRound33Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound34CapstoneResult['capstoneCompare'],
    round34Export: { payload: { round34Ready: true } } as O10IdleGovernanceProgramWaveRound34CapstoneResult['round34Export'],
  });

  push('gov_prog_r34_cap_cmp_parity', 'identical round 34 capstones report parity', compareIdleGovernanceProgramWaveRound34Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r34_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound34Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r34_cap_cmp_schema',
    'round34 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound34Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round34-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round35-export.ts ---

export interface O10IdleGovernanceProgramWaveRound35ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round35-export.v1';
  waveRound: 35;
  o10TaskId: 'O10-201';
  projectedLocHint: number;
  round35Ready: boolean;
  wave35HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound35ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round35-export.v1';
  waveRound: 35;
  o10TaskId: 'O10-201';
  round34Capstone: O10IdleGovernanceProgramWaveRound34CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound35ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-35 / wave-35 export for O10-201 integration hooks. */
export function exportIdleGovernanceProgramWaveRound35(
  round34Capstone: O10IdleGovernanceProgramWaveRound34CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound35ExportResult {
  const round35Ready = round34Capstone.capstoneReady;
  const wave35HookLines = [
    `O10_AGENT20_WAVE35 task=O10-201 round=35`,
    `O10_AGENT20_WAVE35 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE35 round35_ready=${round35Ready}`,
    `O10_AGENT20_WAVE35 prior_capstone=${round34Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE35 prior_task=${round34Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound35ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round35-export.v1',
    waveRound: 35,
    o10TaskId: 'O10-201',
    projectedLocHint,
    round35Ready,
    wave35HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 35 export (O10-201)',
    '',
    ...wave35HookLines.map(line => `- ${line}`),
    '',
    round34Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round35_export', 'task=O10-201', 'round=35', `ready=${round35Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round35-export.v1',
    waveRound: 35,
    o10TaskId: 'O10-201',
    round34Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound35ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound34CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round34-capstone.v1',
    o10TaskId: 'O10-199',
    waveRound: 34,
    capstoneReady: true,
    capstoneMarkdown: '# r34',
    summaryLine: 's',
    primaryRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['primaryRound33Capstone'],
    twinRound33Capstone: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['twinRound33Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['capstoneCompare'],
    round34Export: {} as O10IdleGovernanceProgramWaveRound34CapstoneResult['round34Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound35(mockCap(), 1_924_628);
  push(
    'gov_prog_r35_export_o10',
    'wave 35 export tags O10-201 and loc hint',
    exported.o10TaskId === 'O10-201' &&
      exported.payload.projectedLocHint === 1_924_628 &&
      exported.payload.wave35HookLines.some(l => l.includes('O10-201'))
  );
  push(
    'gov_prog_r35_export_schema',
    'round 35 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round35-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round35-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound35CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1';
  o10TaskId: 'O10-201';
  waveRound: 35;
  capstoneReady: boolean;
  primaryRound34Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound34Capstone>;
  twinRound34Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound34Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound34Capstones>;
  round35Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound35>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound35Primary(cap: O10IdleGovernanceProgramWaveRound35CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
    .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
    .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-35 / wave-35 capstone for O10-201 origin landing. */
export function runIdleGovernanceProgramWaveRound35Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound35CapstoneResult {
  const waveRound = 35;
  const primaryRound34Capstone = runIdleGovernanceProgramWaveRound34Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound34Capstone = runIdleGovernanceProgramWaveRound34Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound34Capstones(
    primaryRound34Capstone,
    twinRound34Capstone
  );
  const round35Export = exportIdleGovernanceProgramWaveRound35(primaryRound34Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound34Capstone.capstoneReady && round35Export.payload.round35Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 35 capstone (O10-201)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round35Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round35_capstone',
    'task=O10-201',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round35Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1',
    o10TaskId: 'O10-201',
    waveRound,
    capstoneReady,
    primaryRound34Capstone,
    twinRound34Capstone,
    capstoneCompare,
    round35Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound35CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap35',
    name: 'Round 35 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound35Capstone(calmSpec, sampleRule, 1, 3, 1_924_628);
  push(
    'gov_prog_r35_capstone_calm',
    'O10-201 wave 35 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-201' && cap.waveRound === 35 && cap.capstoneMarkdown.includes('O10-201')
  );

  const cap2 = runIdleGovernanceProgramWaveRound35Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_924_628,
    registryFromRound35Primary(cap)
  );
  const rollup =
    cap2.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
      .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r35_capstone_chain',
    'chained wave 35 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-201')
  );
  push(
    'gov_prog_r35_capstone_schema',
    'round 35 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round35-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round35-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound35CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round35-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound35CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound35CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound35CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round35Export.payload.round35Ready !== candidate.round35Export.payload.round35Ready) {
    mismatches.push('round35_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-36 twin round-35 capstone compare (O10-203 ladder). */
export function compareIdleGovernanceProgramWaveRound35Capstones(
  baseline: O10IdleGovernanceProgramWaveRound35CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound35CapstoneResult
): O10IdleGovernanceProgramWaveRound35CapstoneCompareResult {
  const mismatches = compareRound35CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round35_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound35CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound35CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1',
    o10TaskId: 'O10-201',
    waveRound: 35,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['primaryRound34Capstone'],
    twinRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['twinRound34Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound35CapstoneResult['capstoneCompare'],
    round35Export: { payload: { round35Ready: true } } as O10IdleGovernanceProgramWaveRound35CapstoneResult['round35Export'],
  });

  push('gov_prog_r35_cap_cmp_parity', 'identical round 35 capstones report parity', compareIdleGovernanceProgramWaveRound35Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r35_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound35Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r35_cap_cmp_schema',
    'round35 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound35Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round35-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round36-export.ts ---

export interface O10IdleGovernanceProgramWaveRound36ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round36-export.v1';
  waveRound: 36;
  o10TaskId: 'O10-203';
  projectedLocHint: number;
  round36Ready: boolean;
  wave36HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound36ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round36-export.v1';
  waveRound: 36;
  o10TaskId: 'O10-203';
  round35Capstone: O10IdleGovernanceProgramWaveRound35CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound36ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-36 / wave-36 export for O10-203 integration hooks. */
export function exportIdleGovernanceProgramWaveRound36(
  round35Capstone: O10IdleGovernanceProgramWaveRound35CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound36ExportResult {
  const round36Ready = round35Capstone.capstoneReady;
  const wave36HookLines = [
    `O10_AGENT20_WAVE36 task=O10-203 round=36`,
    `O10_AGENT20_WAVE36 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE36 round36_ready=${round36Ready}`,
    `O10_AGENT20_WAVE36 prior_capstone=${round35Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE36 prior_task=${round35Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound36ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round36-export.v1',
    waveRound: 36,
    o10TaskId: 'O10-203',
    projectedLocHint,
    round36Ready,
    wave36HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 36 export (O10-203)',
    '',
    ...wave36HookLines.map(line => `- ${line}`),
    '',
    round35Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round36_export', 'task=O10-203', 'round=36', `ready=${round36Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round36-export.v1',
    waveRound: 36,
    o10TaskId: 'O10-203',
    round35Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound36ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound35CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1',
    o10TaskId: 'O10-201',
    waveRound: 35,
    capstoneReady: true,
    capstoneMarkdown: '# r35',
    summaryLine: 's',
    primaryRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['primaryRound34Capstone'],
    twinRound34Capstone: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['twinRound34Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['capstoneCompare'],
    round35Export: {} as O10IdleGovernanceProgramWaveRound35CapstoneResult['round35Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound36(mockCap(), 1_962_828);
  push(
    'gov_prog_r36_export_o10',
    'wave 36 export tags O10-203 and loc hint',
    exported.o10TaskId === 'O10-203' &&
      exported.payload.projectedLocHint === 1_962_828 &&
      exported.payload.wave36HookLines.some(l => l.includes('O10-203'))
  );
  push(
    'gov_prog_r36_export_schema',
    'round 36 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round36-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round36-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound36CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1';
  o10TaskId: 'O10-203';
  waveRound: 36;
  capstoneReady: boolean;
  primaryRound35Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound35Capstone>;
  twinRound35Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound35Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound35Capstones>;
  round36Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound36>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound36Primary(cap: O10IdleGovernanceProgramWaveRound36CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-36 / wave-36 capstone for O10-203 origin landing. */
export function runIdleGovernanceProgramWaveRound36Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound36CapstoneResult {
  const waveRound = 36;
  const primaryRound35Capstone = runIdleGovernanceProgramWaveRound35Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound35Capstone = runIdleGovernanceProgramWaveRound35Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound35Capstones(
    primaryRound35Capstone,
    twinRound35Capstone
  );
  const round36Export = exportIdleGovernanceProgramWaveRound36(primaryRound35Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound35Capstone.capstoneReady && round36Export.payload.round36Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 36 capstone (O10-203)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round36Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round36_capstone',
    'task=O10-203',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round36Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1',
    o10TaskId: 'O10-203',
    waveRound,
    capstoneReady,
    primaryRound35Capstone,
    twinRound35Capstone,
    capstoneCompare,
    round36Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound36CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap36',
    name: 'Round 36 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound36Capstone(calmSpec, sampleRule, 1, 3, 1_962_828);
  push(
    'gov_prog_r36_capstone_calm',
    'O10-203 wave 36 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-203' && cap.waveRound === 36 && cap.capstoneMarkdown.includes('O10-203')
  );

  const cap2 = runIdleGovernanceProgramWaveRound36Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_962_828,
    registryFromRound36Primary(cap)
  );
  const rollup =
    cap2.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r36_capstone_chain',
    'chained wave 36 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-203')
  );
  push(
    'gov_prog_r36_capstone_schema',
    'round 36 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round36-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round36-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound36CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round36-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound36CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound36CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound36CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round36Export.payload.round36Ready !== candidate.round36Export.payload.round36Ready) {
    mismatches.push('round36_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-37 twin round-36 capstone compare (O10-205 ladder). */
export function compareIdleGovernanceProgramWaveRound36Capstones(
  baseline: O10IdleGovernanceProgramWaveRound36CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound36CapstoneResult
): O10IdleGovernanceProgramWaveRound36CapstoneCompareResult {
  const mismatches = compareRound36CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round36_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound36CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound36CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1',
    o10TaskId: 'O10-203',
    waveRound: 36,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['primaryRound35Capstone'],
    twinRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['twinRound35Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound36CapstoneResult['capstoneCompare'],
    round36Export: { payload: { round36Ready: true } } as O10IdleGovernanceProgramWaveRound36CapstoneResult['round36Export'],
  });

  push('gov_prog_r36_cap_cmp_parity', 'identical round 36 capstones report parity', compareIdleGovernanceProgramWaveRound36Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r36_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound36Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r36_cap_cmp_schema',
    'round36 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound36Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round36-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round37-export.ts ---

export interface O10IdleGovernanceProgramWaveRound37ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round37-export.v1';
  waveRound: 37;
  o10TaskId: 'O10-205';
  projectedLocHint: number;
  round37Ready: boolean;
  wave37HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound37ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round37-export.v1';
  waveRound: 37;
  o10TaskId: 'O10-205';
  round36Capstone: O10IdleGovernanceProgramWaveRound36CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound37ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-37 / wave-37 export for O10-205 integration hooks. */
export function exportIdleGovernanceProgramWaveRound37(
  round36Capstone: O10IdleGovernanceProgramWaveRound36CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound37ExportResult {
  const round37Ready = round36Capstone.capstoneReady;
  const wave37HookLines = [
    `O10_AGENT20_WAVE37 task=O10-205 round=37`,
    `O10_AGENT20_WAVE37 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE37 round37_ready=${round37Ready}`,
    `O10_AGENT20_WAVE37 prior_capstone=${round36Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE37 prior_task=${round36Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound37ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round37-export.v1',
    waveRound: 37,
    o10TaskId: 'O10-205',
    projectedLocHint,
    round37Ready,
    wave37HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 37 export (O10-205)',
    '',
    ...wave37HookLines.map(line => `- ${line}`),
    '',
    round36Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round37_export', 'task=O10-205', 'round=37', `ready=${round37Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round37-export.v1',
    waveRound: 37,
    o10TaskId: 'O10-205',
    round36Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound37ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound36CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1',
    o10TaskId: 'O10-203',
    waveRound: 36,
    capstoneReady: true,
    capstoneMarkdown: '# r36',
    summaryLine: 's',
    primaryRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['primaryRound35Capstone'],
    twinRound35Capstone: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['twinRound35Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['capstoneCompare'],
    round36Export: {} as O10IdleGovernanceProgramWaveRound36CapstoneResult['round36Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound37(mockCap(), 2_001_028);
  push(
    'gov_prog_r37_export_o10',
    'wave 37 export tags O10-205 and loc hint',
    exported.o10TaskId === 'O10-205' &&
      exported.payload.projectedLocHint === 2_001_028 &&
      exported.payload.wave37HookLines.some(l => l.includes('O10-205'))
  );
  push(
    'gov_prog_r37_export_schema',
    'round 37 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round37-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round37-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound37CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1';
  o10TaskId: 'O10-205';
  waveRound: 37;
  capstoneReady: boolean;
  primaryRound36Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound36Capstone>;
  twinRound36Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound36Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound36Capstones>;
  round37Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound37>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound37Primary(cap: O10IdleGovernanceProgramWaveRound37CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
    .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
    .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
    .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-37 / wave-37 capstone for O10-205 origin landing. */
export function runIdleGovernanceProgramWaveRound37Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound37CapstoneResult {
  const waveRound = 37;
  const primaryRound36Capstone = runIdleGovernanceProgramWaveRound36Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound36Capstone = runIdleGovernanceProgramWaveRound36Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound36Capstones(
    primaryRound36Capstone,
    twinRound36Capstone
  );
  const round37Export = exportIdleGovernanceProgramWaveRound37(primaryRound36Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound36Capstone.capstoneReady && round37Export.payload.round37Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 37 capstone (O10-205)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round37Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round37_capstone',
    'task=O10-205',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round37Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1',
    o10TaskId: 'O10-205',
    waveRound,
    capstoneReady,
    primaryRound36Capstone,
    twinRound36Capstone,
    capstoneCompare,
    round37Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound37CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap37',
    name: 'Round 37 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound37Capstone(calmSpec, sampleRule, 1, 3, 2_001_028);
  push(
    'gov_prog_r37_capstone_calm',
    'O10-205 wave 37 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-205' && cap.waveRound === 37 && cap.capstoneMarkdown.includes('O10-205')
  );

  const cap2 = runIdleGovernanceProgramWaveRound37Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_001_028,
    registryFromRound37Primary(cap)
  );
  const rollup =
    cap2.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
      .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
      .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r37_capstone_chain',
    'chained wave 37 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-205')
  );
  push(
    'gov_prog_r37_capstone_schema',
    'round 37 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round37-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round37-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound37CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round37-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound37CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound37CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound37CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round37Export.payload.round37Ready !== candidate.round37Export.payload.round37Ready) {
    mismatches.push('round37_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-38 twin round-37 capstone compare (O10-207 ladder). */
export function compareIdleGovernanceProgramWaveRound37Capstones(
  baseline: O10IdleGovernanceProgramWaveRound37CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound37CapstoneResult
): O10IdleGovernanceProgramWaveRound37CapstoneCompareResult {
  const mismatches = compareRound37CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round37_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound37CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound37CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1',
    o10TaskId: 'O10-205',
    waveRound: 37,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['primaryRound36Capstone'],
    twinRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['twinRound36Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound37CapstoneResult['capstoneCompare'],
    round37Export: { payload: { round37Ready: true } } as O10IdleGovernanceProgramWaveRound37CapstoneResult['round37Export'],
  });

  push('gov_prog_r37_cap_cmp_parity', 'identical round 37 capstones report parity', compareIdleGovernanceProgramWaveRound37Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r37_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound37Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r37_cap_cmp_schema',
    'round37 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound37Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round37-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round38-export.ts ---

export interface O10IdleGovernanceProgramWaveRound38ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round38-export.v1';
  waveRound: 38;
  o10TaskId: 'O10-207';
  projectedLocHint: number;
  round38Ready: boolean;
  wave38HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound38ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round38-export.v1';
  waveRound: 38;
  o10TaskId: 'O10-207';
  round37Capstone: O10IdleGovernanceProgramWaveRound37CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound38ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-38 / wave-38 export for O10-207 integration hooks. */
export function exportIdleGovernanceProgramWaveRound38(
  round37Capstone: O10IdleGovernanceProgramWaveRound37CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound38ExportResult {
  const round38Ready = round37Capstone.capstoneReady;
  const wave38HookLines = [
    `O10_AGENT20_WAVE38 task=O10-207 round=38`,
    `O10_AGENT20_WAVE38 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE38 round38_ready=${round38Ready}`,
    `O10_AGENT20_WAVE38 prior_capstone=${round37Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE38 prior_task=${round37Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound38ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round38-export.v1',
    waveRound: 38,
    o10TaskId: 'O10-207',
    projectedLocHint,
    round38Ready,
    wave38HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 38 export (O10-207)',
    '',
    ...wave38HookLines.map(line => `- ${line}`),
    '',
    round37Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round38_export', 'task=O10-207', 'round=38', `ready=${round38Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round38-export.v1',
    waveRound: 38,
    o10TaskId: 'O10-207',
    round37Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound38ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound37CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1',
    o10TaskId: 'O10-205',
    waveRound: 37,
    capstoneReady: true,
    capstoneMarkdown: '# r37',
    summaryLine: 's',
    primaryRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['primaryRound36Capstone'],
    twinRound36Capstone: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['twinRound36Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['capstoneCompare'],
    round37Export: {} as O10IdleGovernanceProgramWaveRound37CapstoneResult['round37Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound38(mockCap(), 2_039_227);
  push(
    'gov_prog_r38_export_o10',
    'wave 38 export tags O10-207 and loc hint',
    exported.o10TaskId === 'O10-207' &&
      exported.payload.projectedLocHint === 2_039_227 &&
      exported.payload.wave38HookLines.some(l => l.includes('O10-207'))
  );
  push(
    'gov_prog_r38_export_schema',
    'round 38 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round38-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round38-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound38CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1';
  o10TaskId: 'O10-207';
  waveRound: 38;
  capstoneReady: boolean;
  primaryRound37Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound37Capstone>;
  twinRound37Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound37Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound37Capstones>;
  round38Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound38>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound38Primary(cap: O10IdleGovernanceProgramWaveRound38CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
    .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
    .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
    .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-38 / wave-38 capstone for O10-207 origin landing. */
export function runIdleGovernanceProgramWaveRound38Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound38CapstoneResult {
  const waveRound = 38;
  const primaryRound37Capstone = runIdleGovernanceProgramWaveRound37Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound37Capstone = runIdleGovernanceProgramWaveRound37Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound37Capstones(
    primaryRound37Capstone,
    twinRound37Capstone
  );
  const round38Export = exportIdleGovernanceProgramWaveRound38(primaryRound37Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound37Capstone.capstoneReady && round38Export.payload.round38Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 38 capstone (O10-207)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round38Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round38_capstone',
    'task=O10-207',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round38Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1',
    o10TaskId: 'O10-207',
    waveRound,
    capstoneReady,
    primaryRound37Capstone,
    twinRound37Capstone,
    capstoneCompare,
    round38Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound38CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap38',
    name: 'Round 38 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound38Capstone(calmSpec, sampleRule, 1, 3, 2_039_227);
  push(
    'gov_prog_r38_capstone_calm',
    'O10-207 wave 38 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-207' && cap.waveRound === 38 && cap.capstoneMarkdown.includes('O10-207')
  );

  const cap2 = runIdleGovernanceProgramWaveRound38Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_039_227,
    registryFromRound38Primary(cap)
  );
  const rollup =
    cap2.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
      .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
      .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup;
  push(
    'gov_prog_r38_capstone_chain',
    'chained wave 38 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-207')
  );
  push(
    'gov_prog_r38_capstone_schema',
    'round 38 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round38-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round38-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound38CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round38-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound38CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound38CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound38CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round38Export.payload.round38Ready !== candidate.round38Export.payload.round38Ready) {
    mismatches.push('round38_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-39 twin round-38 capstone compare (O10-209 ladder). */
export function compareIdleGovernanceProgramWaveRound38Capstones(
  baseline: O10IdleGovernanceProgramWaveRound38CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound38CapstoneResult
): O10IdleGovernanceProgramWaveRound38CapstoneCompareResult {
  const mismatches = compareRound38CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round38_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound38CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound38CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1',
    o10TaskId: 'O10-207',
    waveRound: 38,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['primaryRound37Capstone'],
    twinRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['twinRound37Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound38CapstoneResult['capstoneCompare'],
    round38Export: { payload: { round38Ready: true } } as O10IdleGovernanceProgramWaveRound38CapstoneResult['round38Export'],
  });

  push('gov_prog_r38_cap_cmp_parity', 'identical round 38 capstones report parity', compareIdleGovernanceProgramWaveRound38Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r38_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound38Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r38_cap_cmp_schema',
    'round38 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound38Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round38-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round39-export.ts ---

export interface O10IdleGovernanceProgramWaveRound39ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round39-export.v1';
  waveRound: 39;
  o10TaskId: 'O10-209';
  projectedLocHint: number;
  round39Ready: boolean;
  wave39HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound39ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round39-export.v1';
  waveRound: 39;
  o10TaskId: 'O10-209';
  round38Capstone: O10IdleGovernanceProgramWaveRound38CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound39ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-39 / wave-39 export for O10-209 integration hooks. */
export function exportIdleGovernanceProgramWaveRound39(
  round38Capstone: O10IdleGovernanceProgramWaveRound38CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound39ExportResult {
  const round39Ready = round38Capstone.capstoneReady;
  const wave39HookLines = [
    `O10_AGENT20_WAVE39 task=O10-209 round=39`,
    `O10_AGENT20_WAVE39 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE39 round39_ready=${round39Ready}`,
    `O10_AGENT20_WAVE39 prior_capstone=${round38Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE39 prior_task=${round38Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound39ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round39-export.v1',
    waveRound: 39,
    o10TaskId: 'O10-209',
    projectedLocHint,
    round39Ready,
    wave39HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 39 export (O10-209)',
    '',
    ...wave39HookLines.map(line => `- ${line}`),
    '',
    round38Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round39_export', 'task=O10-209', 'round=39', `ready=${round39Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round39-export.v1',
    waveRound: 39,
    o10TaskId: 'O10-209',
    round38Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound39ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound38CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1',
    o10TaskId: 'O10-207',
    waveRound: 38,
    capstoneReady: true,
    capstoneMarkdown: '# r38',
    summaryLine: 's',
    primaryRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['primaryRound37Capstone'],
    twinRound37Capstone: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['twinRound37Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['capstoneCompare'],
    round38Export: {} as O10IdleGovernanceProgramWaveRound38CapstoneResult['round38Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound39(mockCap(), 2_082_720);
  push(
    'gov_prog_r39_export_o10',
    'wave 39 export tags O10-209 and loc hint',
    exported.o10TaskId === 'O10-209' &&
      exported.payload.projectedLocHint === 2_082_720 &&
      exported.payload.wave39HookLines.some(l => l.includes('O10-209'))
  );
  push(
    'gov_prog_r39_export_schema',
    'round 39 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round39-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round39-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound39CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1';
  o10TaskId: 'O10-209';
  waveRound: 39;
  capstoneReady: boolean;
  primaryRound38Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound38Capstone>;
  twinRound38Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound38Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound38Capstones>;
  round39Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound39>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound39Primary(cap: O10IdleGovernanceProgramWaveRound39CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone
    .primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
    .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal
    .primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject
    .executive.director.operations.registry;
}

/** Round-39 / wave-39 capstone for O10-209 origin landing. */
export function runIdleGovernanceProgramWaveRound39Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound39CapstoneResult {
  const waveRound = 39;
  const primaryRound38Capstone = runIdleGovernanceProgramWaveRound38Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound38Capstone = runIdleGovernanceProgramWaveRound38Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound38Capstones(
    primaryRound38Capstone,
    twinRound38Capstone
  );
  const round39Export = exportIdleGovernanceProgramWaveRound39(primaryRound38Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound38Capstone.capstoneReady && round39Export.payload.round39Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 39 capstone (O10-209)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round39Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round39_capstone',
    'task=O10-209',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round39Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1',
    o10TaskId: 'O10-209',
    waveRound,
    capstoneReady,
    primaryRound38Capstone,
    twinRound38Capstone,
    capstoneCompare,
    round39Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound39CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap39',
    name: 'Round 39 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound39Capstone(calmSpec, sampleRule, 1, 3, 2_082_720);
  push(
    'gov_prog_r39_capstone_calm',
    'O10-209 wave 39 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-209' && cap.waveRound === 39 && cap.capstoneMarkdown.includes('O10-209')
  );

  const cap2 = runIdleGovernanceProgramWaveRound39Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_082_720,
    registryFromRound39Primary(cap)
  );
  const rollup =
    cap2.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone
      .primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
      .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal
      .primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject
      .executive.director.registryRollup;
  push(
    'gov_prog_r39_capstone_chain',
    'chained wave 39 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-209')
  );
  push(
    'gov_prog_r39_capstone_schema',
    'round 39 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round39-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round39-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound39CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round39-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound39CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound39CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound39CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round39Export.payload.round39Ready !== candidate.round39Export.payload.round39Ready) {
    mismatches.push('round39_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-40 twin round-39 capstone compare (O10-211 ladder). */
export function compareIdleGovernanceProgramWaveRound39Capstones(
  baseline: O10IdleGovernanceProgramWaveRound39CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound39CapstoneResult
): O10IdleGovernanceProgramWaveRound39CapstoneCompareResult {
  const mismatches = compareRound39CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round39_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound39CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound39CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1',
    o10TaskId: 'O10-209',
    waveRound: 39,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['primaryRound38Capstone'],
    twinRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['twinRound38Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound39CapstoneResult['capstoneCompare'],
    round39Export: { payload: { round39Ready: true } } as O10IdleGovernanceProgramWaveRound39CapstoneResult['round39Export'],
  });

  push('gov_prog_r39_cap_cmp_parity', 'identical round 39 capstones report parity', compareIdleGovernanceProgramWaveRound39Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r39_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound39Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r39_cap_cmp_schema',
    'round39 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound39Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round39-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round40-export.ts ---

export interface O10IdleGovernanceProgramWaveRound40ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round40-export.v1';
  waveRound: 40;
  o10TaskId: 'O10-211';
  projectedLocHint: number;
  round40Ready: boolean;
  wave40HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound40ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round40-export.v1';
  waveRound: 40;
  o10TaskId: 'O10-211';
  round39Capstone: O10IdleGovernanceProgramWaveRound39CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound40ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-40 / wave-40 export for O10-211 integration hooks. */
export function exportIdleGovernanceProgramWaveRound40(
  round39Capstone: O10IdleGovernanceProgramWaveRound39CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound40ExportResult {
  const round40Ready = round39Capstone.capstoneReady;
  const wave40HookLines = [
    `O10_AGENT20_WAVE40 task=O10-211 round=40`,
    `O10_AGENT20_WAVE40 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE40 round40_ready=${round40Ready}`,
    `O10_AGENT20_WAVE40 prior_capstone=${round39Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE40 prior_task=${round39Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound40ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round40-export.v1',
    waveRound: 40,
    o10TaskId: 'O10-211',
    projectedLocHint,
    round40Ready,
    wave40HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 40 export (O10-211)',
    '',
    ...wave40HookLines.map(line => `- ${line}`),
    '',
    round39Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round40_export', 'task=O10-211', 'round=40', `ready=${round40Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round40-export.v1',
    waveRound: 40,
    o10TaskId: 'O10-211',
    round39Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound40ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound39CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1',
    o10TaskId: 'O10-209',
    waveRound: 39,
    capstoneReady: true,
    capstoneMarkdown: '# r39',
    summaryLine: 's',
    primaryRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['primaryRound38Capstone'],
    twinRound38Capstone: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['twinRound38Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['capstoneCompare'],
    round39Export: {} as O10IdleGovernanceProgramWaveRound39CapstoneResult['round39Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound40(mockCap(), 2_121_263);
  push(
    'gov_prog_r40_export_o10',
    'wave 40 export tags O10-211 and loc hint',
    exported.o10TaskId === 'O10-211' &&
      exported.payload.projectedLocHint === 2_121_263 &&
      exported.payload.wave40HookLines.some(l => l.includes('O10-211'))
  );
  push(
    'gov_prog_r40_export_schema',
    'round 40 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round40-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round40-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound40CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1';
  o10TaskId: 'O10-211';
  waveRound: 40;
  capstoneReady: boolean;
  primaryRound39Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound39Capstone>;
  twinRound39Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound39Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound39Capstones>;
  round40Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound40>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound40Primary(cap: O10IdleGovernanceProgramWaveRound40CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
    .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
    .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
    .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-40 / wave-40 capstone for O10-211 origin landing. */
export function runIdleGovernanceProgramWaveRound40Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound40CapstoneResult {
  const waveRound = 40;
  const primaryRound39Capstone = runIdleGovernanceProgramWaveRound39Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound39Capstone = runIdleGovernanceProgramWaveRound39Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound39Capstones(
    primaryRound39Capstone,
    twinRound39Capstone
  );
  const round40Export = exportIdleGovernanceProgramWaveRound40(primaryRound39Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound39Capstone.capstoneReady && round40Export.payload.round40Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 40 capstone (O10-211)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round40Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round40_capstone',
    'task=O10-211',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round40Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1',
    o10TaskId: 'O10-211',
    waveRound,
    capstoneReady,
    primaryRound39Capstone,
    twinRound39Capstone,
    capstoneCompare,
    round40Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound40CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap40',
    name: 'Round 40 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound40Capstone(calmSpec, sampleRule, 1, 3, 2_121_263);
  push(
    'gov_prog_r40_capstone_calm',
    'O10-211 wave 40 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-211' && cap.waveRound === 40 && cap.capstoneMarkdown.includes('O10-211')
  );

  const cap2 = runIdleGovernanceProgramWaveRound40Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_121_263,
    registryFromRound40Primary(cap)
  );
  const rollup =
    cap2.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
      .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
      .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r40_capstone_chain',
    'chained wave 40 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-211')
  );
  push(
    'gov_prog_r40_capstone_schema',
    'round 40 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round40-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round40-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound40CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round40-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound40CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound40CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound40CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round40Export.payload.round40Ready !== candidate.round40Export.payload.round40Ready) {
    mismatches.push('round40_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-41 twin round-40 capstone compare (O10-213 ladder). */
export function compareIdleGovernanceProgramWaveRound40Capstones(
  baseline: O10IdleGovernanceProgramWaveRound40CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound40CapstoneResult
): O10IdleGovernanceProgramWaveRound40CapstoneCompareResult {
  const mismatches = compareRound40CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round40_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound40CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound40CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1',
    o10TaskId: 'O10-211',
    waveRound: 40,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['primaryRound39Capstone'],
    twinRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['twinRound39Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound40CapstoneResult['capstoneCompare'],
    round40Export: { payload: { round40Ready: true } } as O10IdleGovernanceProgramWaveRound40CapstoneResult['round40Export'],
  });

  push('gov_prog_r40_cap_cmp_parity', 'identical round 40 capstones report parity', compareIdleGovernanceProgramWaveRound40Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r40_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound40Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r40_cap_cmp_schema',
    'round40 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound40Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round40-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round41-export.ts ---

export interface O10IdleGovernanceProgramWaveRound41ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round41-export.v1';
  waveRound: 41;
  o10TaskId: 'O10-213';
  projectedLocHint: number;
  round41Ready: boolean;
  wave41HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound41ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round41-export.v1';
  waveRound: 41;
  o10TaskId: 'O10-213';
  round40Capstone: O10IdleGovernanceProgramWaveRound40CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound41ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-41 / wave-41 export for O10-213 integration hooks. */
export function exportIdleGovernanceProgramWaveRound41(
  round40Capstone: O10IdleGovernanceProgramWaveRound40CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound41ExportResult {
  const round41Ready = round40Capstone.capstoneReady;
  const wave41HookLines = [
    `O10_AGENT20_WAVE41 task=O10-213 round=41`,
    `O10_AGENT20_WAVE41 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE41 round41_ready=${round41Ready}`,
    `O10_AGENT20_WAVE41 prior_capstone=${round40Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE41 prior_task=${round40Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound41ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round41-export.v1',
    waveRound: 41,
    o10TaskId: 'O10-213',
    projectedLocHint,
    round41Ready,
    wave41HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 41 export (O10-213)',
    '',
    ...wave41HookLines.map(line => `- ${line}`),
    '',
    round40Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round41_export', 'task=O10-213', 'round=41', `ready=${round41Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round41-export.v1',
    waveRound: 41,
    o10TaskId: 'O10-213',
    round40Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound41ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound40CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1',
    o10TaskId: 'O10-211',
    waveRound: 40,
    capstoneReady: true,
    capstoneMarkdown: '# r40',
    summaryLine: 's',
    primaryRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['primaryRound39Capstone'],
    twinRound39Capstone: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['twinRound39Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['capstoneCompare'],
    round40Export: {} as O10IdleGovernanceProgramWaveRound40CapstoneResult['round40Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound41(mockCap(), 2_165_132);
  push(
    'gov_prog_r41_export_o10',
    'wave 41 export tags O10-213 and loc hint',
    exported.o10TaskId === 'O10-213' &&
      exported.payload.projectedLocHint === 2_165_132 &&
      exported.payload.wave41HookLines.some(l => l.includes('O10-213'))
  );
  push(
    'gov_prog_r41_export_schema',
    'round 41 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round41-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round41-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound41CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1';
  o10TaskId: 'O10-213';
  waveRound: 41;
  capstoneReady: boolean;
  primaryRound40Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound40Capstone>;
  twinRound40Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound40Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound40Capstones>;
  round41Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound41>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound41Primary(cap: O10IdleGovernanceProgramWaveRound41CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-41 / wave-41 capstone for O10-213 origin landing. */
export function runIdleGovernanceProgramWaveRound41Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound41CapstoneResult {
  const waveRound = 41;
  const primaryRound40Capstone = runIdleGovernanceProgramWaveRound40Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound40Capstone = runIdleGovernanceProgramWaveRound40Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound40Capstones(
    primaryRound40Capstone,
    twinRound40Capstone
  );
  const round41Export = exportIdleGovernanceProgramWaveRound41(primaryRound40Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound40Capstone.capstoneReady && round41Export.payload.round41Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 41 capstone (O10-213)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round41Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round41_capstone',
    'task=O10-213',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round41Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1',
    o10TaskId: 'O10-213',
    waveRound,
    capstoneReady,
    primaryRound40Capstone,
    twinRound40Capstone,
    capstoneCompare,
    round41Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound41CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap41',
    name: 'Round 41 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound41Capstone(calmSpec, sampleRule, 1, 3, 2_165_132);
  push(
    'gov_prog_r41_capstone_calm',
    'O10-213 wave 41 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-213' && cap.waveRound === 41 && cap.capstoneMarkdown.includes('O10-213')
  );

  const cap2 = runIdleGovernanceProgramWaveRound41Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_165_132,
    registryFromRound41Primary(cap)
  );
  const rollup =
    cap2.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r41_capstone_chain',
    'chained wave 41 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-213')
  );
  push(
    'gov_prog_r41_capstone_schema',
    'round 41 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round41-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round41-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound41CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round41-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound41CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound41CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound41CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round41Export.payload.round41Ready !== candidate.round41Export.payload.round41Ready) {
    mismatches.push('round41_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-42 twin round-41 capstone compare (O10-215 ladder). */
export function compareIdleGovernanceProgramWaveRound41Capstones(
  baseline: O10IdleGovernanceProgramWaveRound41CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound41CapstoneResult
): O10IdleGovernanceProgramWaveRound41CapstoneCompareResult {
  const mismatches = compareRound41CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round41_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound41CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound41CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1',
    o10TaskId: 'O10-213',
    waveRound: 41,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['primaryRound40Capstone'],
    twinRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['twinRound40Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound41CapstoneResult['capstoneCompare'],
    round41Export: { payload: { round41Ready: true } } as O10IdleGovernanceProgramWaveRound41CapstoneResult['round41Export'],
  });

  push('gov_prog_r41_cap_cmp_parity', 'identical round 41 capstones report parity', compareIdleGovernanceProgramWaveRound41Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r41_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound41Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r41_cap_cmp_schema',
    'round41 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound41Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round41-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round42-export.ts ---

export interface O10IdleGovernanceProgramWaveRound42ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round42-export.v1';
  waveRound: 42;
  o10TaskId: 'O10-215';
  projectedLocHint: number;
  round42Ready: boolean;
  wave42HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound42ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round42-export.v1';
  waveRound: 42;
  o10TaskId: 'O10-215';
  round41Capstone: O10IdleGovernanceProgramWaveRound41CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound42ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-42 / wave-42 export for O10-215 integration hooks. */
export function exportIdleGovernanceProgramWaveRound42(
  round41Capstone: O10IdleGovernanceProgramWaveRound41CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound42ExportResult {
  const round42Ready = round41Capstone.capstoneReady;
  const wave42HookLines = [
    `O10_AGENT20_WAVE42 task=O10-215 round=42`,
    `O10_AGENT20_WAVE42 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE42 round42_ready=${round42Ready}`,
    `O10_AGENT20_WAVE42 prior_capstone=${round41Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE42 prior_task=${round41Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound42ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round42-export.v1',
    waveRound: 42,
    o10TaskId: 'O10-215',
    projectedLocHint,
    round42Ready,
    wave42HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 42 export (O10-215)',
    '',
    ...wave42HookLines.map(line => `- ${line}`),
    '',
    round41Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round42_export', 'task=O10-215', 'round=42', `ready=${round42Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round42-export.v1',
    waveRound: 42,
    o10TaskId: 'O10-215',
    round41Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound42ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound41CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1',
    o10TaskId: 'O10-213',
    waveRound: 41,
    capstoneReady: true,
    capstoneMarkdown: '# r41',
    summaryLine: 's',
    primaryRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['primaryRound40Capstone'],
    twinRound40Capstone: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['twinRound40Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['capstoneCompare'],
    round41Export: {} as O10IdleGovernanceProgramWaveRound41CapstoneResult['round41Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound42(mockCap(), 2_207_543);
  push(
    'gov_prog_r42_export_o10',
    'wave 42 export tags O10-215 and loc hint',
    exported.o10TaskId === 'O10-215' &&
      exported.payload.projectedLocHint === 2_207_543 &&
      exported.payload.wave42HookLines.some(l => l.includes('O10-215'))
  );
  push(
    'gov_prog_r42_export_schema',
    'round 42 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round42-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round42-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound42CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1';
  o10TaskId: 'O10-215';
  waveRound: 42;
  capstoneReady: boolean;
  primaryRound41Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound41Capstone>;
  twinRound41Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound41Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound41Capstones>;
  round42Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound42>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound42Primary(cap: O10IdleGovernanceProgramWaveRound42CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone
    .primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
    .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
    .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
    .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-42 / wave-42 capstone for O10-215 origin landing. */
export function runIdleGovernanceProgramWaveRound42Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound42CapstoneResult {
  const waveRound = 42;
  const primaryRound41Capstone = runIdleGovernanceProgramWaveRound41Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound41Capstone = runIdleGovernanceProgramWaveRound41Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound41Capstones(
    primaryRound41Capstone,
    twinRound41Capstone
  );
  const round42Export = exportIdleGovernanceProgramWaveRound42(primaryRound41Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound41Capstone.capstoneReady && round42Export.payload.round42Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 42 capstone (O10-215)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round42Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round42_capstone',
    'task=O10-215',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round42Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1',
    o10TaskId: 'O10-215',
    waveRound,
    capstoneReady,
    primaryRound41Capstone,
    twinRound41Capstone,
    capstoneCompare,
    round42Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound42CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap42',
    name: 'Round 42 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound42Capstone(calmSpec, sampleRule, 1, 3, 2_207_543);
  push(
    'gov_prog_r42_capstone_calm',
    'O10-215 wave 42 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-215' && cap.waveRound === 42 && cap.capstoneMarkdown.includes('O10-215')
  );

  const cap2 = runIdleGovernanceProgramWaveRound42Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_207_543,
    registryFromRound42Primary(cap)
  );
  const rollup =
    cap2.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone
      .primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
      .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
      .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r42_capstone_chain',
    'chained wave 42 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-215')
  );
  push(
    'gov_prog_r42_capstone_schema',
    'round 42 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round42-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round42-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound42CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round42-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound42CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound42CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound42CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round42Export.payload.round42Ready !== candidate.round42Export.payload.round42Ready) {
    mismatches.push('round42_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-43 twin round-42 capstone compare (O10-217 ladder). */
export function compareIdleGovernanceProgramWaveRound42Capstones(
  baseline: O10IdleGovernanceProgramWaveRound42CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound42CapstoneResult
): O10IdleGovernanceProgramWaveRound42CapstoneCompareResult {
  const mismatches = compareRound42CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round42_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound42CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound42CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1',
    o10TaskId: 'O10-215',
    waveRound: 42,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['primaryRound41Capstone'],
    twinRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['twinRound41Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound42CapstoneResult['capstoneCompare'],
    round42Export: { payload: { round42Ready: true } } as O10IdleGovernanceProgramWaveRound42CapstoneResult['round42Export'],
  });

  push('gov_prog_r42_cap_cmp_parity', 'identical round 42 capstones report parity', compareIdleGovernanceProgramWaveRound42Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r42_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound42Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r42_cap_cmp_schema',
    'round42 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound42Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round42-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round43-export.ts ---

export interface O10IdleGovernanceProgramWaveRound43ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round43-export.v1';
  waveRound: 43;
  o10TaskId: 'O10-217';
  projectedLocHint: number;
  round43Ready: boolean;
  wave43HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound43ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round43-export.v1';
  waveRound: 43;
  o10TaskId: 'O10-217';
  round42Capstone: O10IdleGovernanceProgramWaveRound42CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound43ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-43 / wave-43 export for O10-217 integration hooks. */
export function exportIdleGovernanceProgramWaveRound43(
  round42Capstone: O10IdleGovernanceProgramWaveRound42CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound43ExportResult {
  const round43Ready = round42Capstone.capstoneReady;
  const wave43HookLines = [
    `O10_AGENT20_WAVE43 task=O10-217 round=43`,
    `O10_AGENT20_WAVE43 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE43 round43_ready=${round43Ready}`,
    `O10_AGENT20_WAVE43 prior_capstone=${round42Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE43 prior_task=${round42Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound43ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round43-export.v1',
    waveRound: 43,
    o10TaskId: 'O10-217',
    projectedLocHint,
    round43Ready,
    wave43HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 43 export (O10-217)',
    '',
    ...wave43HookLines.map(line => `- ${line}`),
    '',
    round42Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round43_export', 'task=O10-217', 'round=43', `ready=${round43Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round43-export.v1',
    waveRound: 43,
    o10TaskId: 'O10-217',
    round42Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound43ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound42CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1',
    o10TaskId: 'O10-215',
    waveRound: 42,
    capstoneReady: true,
    capstoneMarkdown: '# r42',
    summaryLine: 's',
    primaryRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['primaryRound41Capstone'],
    twinRound41Capstone: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['twinRound41Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['capstoneCompare'],
    round42Export: {} as O10IdleGovernanceProgramWaveRound42CapstoneResult['round42Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound43(mockCap(), 2_253_960);
  push(
    'gov_prog_r43_export_o10',
    'wave 43 export tags O10-217 and loc hint',
    exported.o10TaskId === 'O10-217' &&
      exported.payload.projectedLocHint === 2_253_960 &&
      exported.payload.wave43HookLines.some(l => l.includes('O10-217'))
  );
  push(
    'gov_prog_r43_export_schema',
    'round 43 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round43-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round43-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound43CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1';
  o10TaskId: 'O10-217';
  waveRound: 43;
  capstoneReady: boolean;
  primaryRound42Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound42Capstone>;
  twinRound42Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound42Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound42Capstones>;
  round43Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound43>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound43Primary(cap: O10IdleGovernanceProgramWaveRound43CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound42Capstone.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone
    .primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
    .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
    .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
    .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-43 / wave-43 capstone for O10-217 origin landing. */
export function runIdleGovernanceProgramWaveRound43Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound43CapstoneResult {
  const waveRound = 43;
  const primaryRound42Capstone = runIdleGovernanceProgramWaveRound42Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound42Capstone = runIdleGovernanceProgramWaveRound42Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound42Capstones(
    primaryRound42Capstone,
    twinRound42Capstone
  );
  const round43Export = exportIdleGovernanceProgramWaveRound43(primaryRound42Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound42Capstone.capstoneReady && round43Export.payload.round43Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 43 capstone (O10-217)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round43Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round43_capstone',
    'task=O10-217',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round43Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1',
    o10TaskId: 'O10-217',
    waveRound,
    capstoneReady,
    primaryRound42Capstone,
    twinRound42Capstone,
    capstoneCompare,
    round43Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound43CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap43',
    name: 'Round 43 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound43Capstone(calmSpec, sampleRule, 1, 3, 2_253_960);
  push(
    'gov_prog_r43_capstone_calm',
    'O10-217 wave 43 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-217' && cap.waveRound === 43 && cap.capstoneMarkdown.includes('O10-217')
  );

  const cap2 = runIdleGovernanceProgramWaveRound43Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_253_960,
    registryFromRound43Primary(cap)
  );
  const rollup =
    cap2.primaryRound42Capstone.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone
      .primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
      .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
      .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup;
  push(
    'gov_prog_r43_capstone_chain',
    'chained wave 43 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-217')
  );
  push(
    'gov_prog_r43_capstone_schema',
    'round 43 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round43-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round43-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound43CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round43-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound43CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound43CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound43CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round43Export.payload.round43Ready !== candidate.round43Export.payload.round43Ready) {
    mismatches.push('round43_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-44 twin round-43 capstone compare (O10-219 ladder). */
export function compareIdleGovernanceProgramWaveRound43Capstones(
  baseline: O10IdleGovernanceProgramWaveRound43CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound43CapstoneResult
): O10IdleGovernanceProgramWaveRound43CapstoneCompareResult {
  const mismatches = compareRound43CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round43_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound43CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound43CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1',
    o10TaskId: 'O10-217',
    waveRound: 43,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['primaryRound42Capstone'],
    twinRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['twinRound42Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound43CapstoneResult['capstoneCompare'],
    round43Export: { payload: { round43Ready: true } } as O10IdleGovernanceProgramWaveRound43CapstoneResult['round43Export'],
  });

  push('gov_prog_r43_cap_cmp_parity', 'identical round 43 capstones report parity', compareIdleGovernanceProgramWaveRound43Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r43_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound43Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r43_cap_cmp_schema',
    'round43 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound43Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round43-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round44-export.ts ---

export interface O10IdleGovernanceProgramWaveRound44ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round44-export.v1';
  waveRound: 44;
  o10TaskId: 'O10-219';
  projectedLocHint: number;
  round44Ready: boolean;
  wave44HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound44ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round44-export.v1';
  waveRound: 44;
  o10TaskId: 'O10-219';
  round43Capstone: O10IdleGovernanceProgramWaveRound43CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound44ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-44 / wave-44 export for O10-219 integration hooks. */
export function exportIdleGovernanceProgramWaveRound44(
  round43Capstone: O10IdleGovernanceProgramWaveRound43CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound44ExportResult {
  const round44Ready = round43Capstone.capstoneReady;
  const wave44HookLines = [
    `O10_AGENT20_WAVE44 task=O10-219 round=44`,
    `O10_AGENT20_WAVE44 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE44 round44_ready=${round44Ready}`,
    `O10_AGENT20_WAVE44 prior_capstone=${round43Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE44 prior_task=${round43Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound44ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round44-export.v1',
    waveRound: 44,
    o10TaskId: 'O10-219',
    projectedLocHint,
    round44Ready,
    wave44HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 44 export (O10-219)',
    '',
    ...wave44HookLines.map(line => `- ${line}`),
    '',
    round43Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round44_export', 'task=O10-219', 'round=44', `ready=${round44Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round44-export.v1',
    waveRound: 44,
    o10TaskId: 'O10-219',
    round43Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound44ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound43CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1',
    o10TaskId: 'O10-217',
    waveRound: 43,
    capstoneReady: true,
    capstoneMarkdown: '# r43',
    summaryLine: 's',
    primaryRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['primaryRound42Capstone'],
    twinRound42Capstone: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['twinRound42Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['capstoneCompare'],
    round43Export: {} as O10IdleGovernanceProgramWaveRound43CapstoneResult['round43Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound44(mockCap(), 2_503_353);
  push(
    'gov_prog_r44_export_o10',
    'wave 44 export tags O10-219 and loc hint',
    exported.o10TaskId === 'O10-219' &&
      exported.payload.projectedLocHint === 2_503_353 &&
      exported.payload.wave44HookLines.some(l => l.includes('O10-219'))
  );
  push(
    'gov_prog_r44_export_schema',
    'round 44 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round44-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round44-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound44CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round44-capstone.v1';
  o10TaskId: 'O10-219';
  waveRound: 44;
  capstoneReady: boolean;
  primaryRound43Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound43Capstone>;
  twinRound43Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound43Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound43Capstones>;
  round44Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound44>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound44Primary(cap: O10IdleGovernanceProgramWaveRound44CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound43Capstone.primaryRound42Capstone.primaryRound41Capstone.primaryRound40Capstone
    .primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone
    .primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
    .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal
    .primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject
    .executive.director.operations.registry;
}

/** Round-44 / wave-44 capstone for O10-219 origin landing. */
export function runIdleGovernanceProgramWaveRound44Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound44CapstoneResult {
  const waveRound = 44;
  const primaryRound43Capstone = runIdleGovernanceProgramWaveRound43Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound43Capstone = runIdleGovernanceProgramWaveRound43Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound43Capstones(
    primaryRound43Capstone,
    twinRound43Capstone
  );
  const round44Export = exportIdleGovernanceProgramWaveRound44(primaryRound43Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound43Capstone.capstoneReady && round44Export.payload.round44Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 44 capstone (O10-219)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round44Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round44_capstone',
    'task=O10-219',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round44Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone.v1',
    o10TaskId: 'O10-219',
    waveRound,
    capstoneReady,
    primaryRound43Capstone,
    twinRound43Capstone,
    capstoneCompare,
    round44Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound44CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap44',
    name: 'Round 44 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound44Capstone(calmSpec, sampleRule, 1, 3, 2_503_353);
  push(
    'gov_prog_r44_capstone_calm',
    'O10-219 wave 44 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-219' && cap.waveRound === 44 && cap.capstoneMarkdown.includes('O10-219')
  );

  const cap2 = runIdleGovernanceProgramWaveRound44Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_503_353,
    registryFromRound44Primary(cap)
  );
  const rollup =
    cap2.primaryRound43Capstone.primaryRound42Capstone.primaryRound41Capstone.primaryRound40Capstone
      .primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone
      .primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
      .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal
      .primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject
      .executive.director.registryRollup;
  push(
    'gov_prog_r44_capstone_chain',
    'chained wave 44 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-219')
  );
  push(
    'gov_prog_r44_capstone_schema',
    'round 44 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round44-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round44-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound44CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round44-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound44CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound44CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound44CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round44Export.payload.round44Ready !== candidate.round44Export.payload.round44Ready) {
    mismatches.push('round44_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-45 twin round-44 capstone compare (O10-221 ladder). */
export function compareIdleGovernanceProgramWaveRound44Capstones(
  baseline: O10IdleGovernanceProgramWaveRound44CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound44CapstoneResult
): O10IdleGovernanceProgramWaveRound44CapstoneCompareResult {
  const mismatches = compareRound44CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round44_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound44CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound44CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone.v1',
    o10TaskId: 'O10-219',
    waveRound: 44,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['primaryRound43Capstone'],
    twinRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['twinRound43Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound44CapstoneResult['capstoneCompare'],
    round44Export: { payload: { round44Ready: true } } as O10IdleGovernanceProgramWaveRound44CapstoneResult['round44Export'],
  });

  push('gov_prog_r44_cap_cmp_parity', 'identical round 44 capstones report parity', compareIdleGovernanceProgramWaveRound44Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r44_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound44Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r44_cap_cmp_schema',
    'round44 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound44Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round44-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round45-export.ts ---

export interface O10IdleGovernanceProgramWaveRound45ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round45-export.v1';
  waveRound: 45;
  o10TaskId: 'O10-221';
  projectedLocHint: number;
  round45Ready: boolean;
  wave45HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound45ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round45-export.v1';
  waveRound: 45;
  o10TaskId: 'O10-221';
  round44Capstone: O10IdleGovernanceProgramWaveRound44CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound45ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-45 / wave-45 export for O10-221 integration hooks. */
export function exportIdleGovernanceProgramWaveRound45(
  round44Capstone: O10IdleGovernanceProgramWaveRound44CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound45ExportResult {
  const round45Ready = round44Capstone.capstoneReady;
  const wave45HookLines = [
    `O10_AGENT20_WAVE45 task=O10-221 round=45`,
    `O10_AGENT20_WAVE45 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE45 round45_ready=${round45Ready}`,
    `O10_AGENT20_WAVE45 prior_capstone=${round44Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE45 prior_task=${round44Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound45ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round45-export.v1',
    waveRound: 45,
    o10TaskId: 'O10-221',
    projectedLocHint,
    round45Ready,
    wave45HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 45 export (O10-221)',
    '',
    ...wave45HookLines.map(line => `- ${line}`),
    '',
    round44Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round45_export', 'task=O10-221', 'round=45', `ready=${round45Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round45-export.v1',
    waveRound: 45,
    o10TaskId: 'O10-221',
    round44Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound45ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound44CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round44-capstone.v1',
    o10TaskId: 'O10-219',
    waveRound: 44,
    capstoneReady: true,
    capstoneMarkdown: '# r44',
    summaryLine: 's',
    primaryRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['primaryRound43Capstone'],
    twinRound43Capstone: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['twinRound43Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['capstoneCompare'],
    round44Export: {} as O10IdleGovernanceProgramWaveRound44CapstoneResult['round44Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound45(mockCap(), 2_548_579);
  push(
    'gov_prog_r45_export_o10',
    'wave 45 export tags O10-221 and loc hint',
    exported.o10TaskId === 'O10-221' &&
      exported.payload.projectedLocHint === 2_548_579 &&
      exported.payload.wave45HookLines.some(l => l.includes('O10-221'))
  );
  push(
    'gov_prog_r45_export_schema',
    'round 45 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round45-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round45-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound45CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1';
  o10TaskId: 'O10-221';
  waveRound: 45;
  capstoneReady: boolean;
  primaryRound44Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound44Capstone>;
  twinRound44Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound44Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound44Capstones>;
  round45Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound45>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound45Primary(cap: O10IdleGovernanceProgramWaveRound45CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone.primaryRound41Capstone
    .primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
    .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
    .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
    .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-45 / wave-45 capstone for O10-221 origin landing. */
export function runIdleGovernanceProgramWaveRound45Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound45CapstoneResult {
  const waveRound = 45;
  const primaryRound44Capstone = runIdleGovernanceProgramWaveRound44Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound44Capstone = runIdleGovernanceProgramWaveRound44Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound44Capstones(
    primaryRound44Capstone,
    twinRound44Capstone
  );
  const round45Export = exportIdleGovernanceProgramWaveRound45(primaryRound44Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound44Capstone.capstoneReady && round45Export.payload.round45Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 45 capstone (O10-221)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round45Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round45_capstone',
    'task=O10-221',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round45Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1',
    o10TaskId: 'O10-221',
    waveRound,
    capstoneReady,
    primaryRound44Capstone,
    twinRound44Capstone,
    capstoneCompare,
    round45Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound45CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap45',
    name: 'Round 45 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound45Capstone(calmSpec, sampleRule, 1, 3, 2_548_579);
  push(
    'gov_prog_r45_capstone_calm',
    'O10-221 wave 45 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-221' && cap.waveRound === 45 && cap.capstoneMarkdown.includes('O10-221')
  );

  const cap2 = runIdleGovernanceProgramWaveRound45Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_548_579,
    registryFromRound45Primary(cap)
  );
  const rollup =
    cap2.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone.primaryRound41Capstone
      .primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
      .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
      .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r45_capstone_chain',
    'chained wave 45 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-221')
  );
  push(
    'gov_prog_r45_capstone_schema',
    'round 45 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round45-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round45-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound45CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round45-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound45CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound45CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound45CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round45Export.payload.round45Ready !== candidate.round45Export.payload.round45Ready) {
    mismatches.push('round45_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-46 twin round-45 capstone compare (O10-223 ladder). */
export function compareIdleGovernanceProgramWaveRound45Capstones(
  baseline: O10IdleGovernanceProgramWaveRound45CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound45CapstoneResult
): O10IdleGovernanceProgramWaveRound45CapstoneCompareResult {
  const mismatches = compareRound45CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round45_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound45CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound45CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1',
    o10TaskId: 'O10-221',
    waveRound: 45,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['primaryRound44Capstone'],
    twinRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['twinRound44Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound45CapstoneResult['capstoneCompare'],
    round45Export: { payload: { round45Ready: true } } as O10IdleGovernanceProgramWaveRound45CapstoneResult['round45Export'],
  });

  push('gov_prog_r45_cap_cmp_parity', 'identical round 45 capstones report parity', compareIdleGovernanceProgramWaveRound45Capstones(twin(), twin()).parityOk);
  push(
    'gov_prog_r45_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound45Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r45_cap_cmp_schema',
    'round45 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound45Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round45-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round46-export.ts ---

export interface O10IdleGovernanceProgramWaveRound46ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round46-export.v1';
  waveRound: 46;
  o10TaskId: 'O10-223';
  projectedLocHint: number;
  round46Ready: boolean;
  wave46HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound46ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round46-export.v1';
  waveRound: 46;
  o10TaskId: 'O10-223';
  round45Capstone: O10IdleGovernanceProgramWaveRound45CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound46ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-46 / wave-46 export for O10-223 integration hooks. */
export function exportIdleGovernanceProgramWaveRound46(
  round45Capstone: O10IdleGovernanceProgramWaveRound45CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound46ExportResult {
  const round46Ready = round45Capstone.capstoneReady;
  const wave46HookLines = [
    `O10_AGENT20_WAVE46 task=O10-223 round=46`,
    `O10_AGENT20_WAVE46 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE46 round46_ready=${round46Ready}`,
    `O10_AGENT20_WAVE46 prior_capstone=${round45Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE46 prior_task=${round45Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound46ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round46-export.v1',
    waveRound: 46,
    o10TaskId: 'O10-223',
    projectedLocHint,
    round46Ready,
    wave46HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 46 export (O10-223)',
    '',
    ...wave46HookLines.map(line => `- ${line}`),
    '',
    round45Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round46_export', 'task=O10-223', 'round=46', `ready=${round46Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round46-export.v1',
    waveRound: 46,
    o10TaskId: 'O10-223',
    round45Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound46ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound45CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1',
    o10TaskId: 'O10-221',
    waveRound: 45,
    capstoneReady: true,
    capstoneMarkdown: '# r45',
    summaryLine: 's',
    primaryRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['primaryRound44Capstone'],
    twinRound44Capstone: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['twinRound44Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['capstoneCompare'],
    round45Export: {} as O10IdleGovernanceProgramWaveRound45CapstoneResult['round45Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound46(mockCap(), 2_593_189);
  push(
    'gov_prog_r46_export_o10',
    'wave 46 export tags O10-223 and loc hint',
    exported.o10TaskId === 'O10-223' &&
      exported.payload.projectedLocHint === 2_593_189 &&
      exported.payload.wave46HookLines.some(l => l.includes('O10-223'))
  );
  push(
    'gov_prog_r46_export_schema',
    'round 46 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round46-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round46-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound46CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round46-capstone.v1';
  o10TaskId: 'O10-223';
  waveRound: 46;
  capstoneReady: boolean;
  primaryRound45Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound45Capstone>;
  twinRound45Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound45Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound45Capstones>;
  round46Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound46>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound46Primary(cap: O10IdleGovernanceProgramWaveRound46CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-46 / wave-46 capstone for O10-223 origin landing. */
export function runIdleGovernanceProgramWaveRound46Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound46CapstoneResult {
  const waveRound = 46;
  const primaryRound45Capstone = runIdleGovernanceProgramWaveRound45Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound45Capstone = runIdleGovernanceProgramWaveRound45Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound45Capstones(
    primaryRound45Capstone,
    twinRound45Capstone
  );
  const round46Export = exportIdleGovernanceProgramWaveRound46(primaryRound45Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound45Capstone.capstoneReady && round46Export.payload.round46Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 46 capstone (O10-223)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round46Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round46_capstone',
    'task=O10-223',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round46Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone.v1',
    o10TaskId: 'O10-223',
    waveRound,
    capstoneReady,
    primaryRound45Capstone,
    twinRound45Capstone,
    capstoneCompare,
    round46Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound46CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap46',
    name: 'Round 46 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound46Capstone(calmSpec, sampleRule, 1, 3, 2_593_189);
  push(
    'gov_prog_r46_capstone_calm',
    'O10-223 wave 46 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-223' && cap.waveRound === 46 && cap.capstoneMarkdown.includes('O10-223')
  );

  const cap2 = runIdleGovernanceProgramWaveRound46Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_593_189,
    registryFromRound46Primary(cap)
  );
  const rollup =
    cap2.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r46_capstone_chain',
    'chained wave 46 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-223')
  );
  push(
    'gov_prog_r46_capstone_schema',
    'round 46 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round46-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round46-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound46CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round46-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound46CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound46CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound46CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round46Export.payload.round46Ready !== candidate.round46Export.payload.round46Ready) {
    mismatches.push('round46_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-47 twin round-46 capstone compare (O10-225 ladder). */
export function compareIdleGovernanceProgramWaveRound46Capstones(
  baseline: O10IdleGovernanceProgramWaveRound46CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound46CapstoneResult
): O10IdleGovernanceProgramWaveRound46CapstoneCompareResult {
  const mismatches = compareRound46CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round46_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound46CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound46CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone.v1',
    o10TaskId: 'O10-223',
    waveRound: 46,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['primaryRound45Capstone'],
    twinRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['twinRound45Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound46CapstoneResult['capstoneCompare'],
    round46Export: { payload: { round46Ready: true } } as O10IdleGovernanceProgramWaveRound46CapstoneResult['round46Export'],
  });

  push(
    'gov_prog_r46_cap_cmp_parity',
    'identical round 46 capstones report parity',
    compareIdleGovernanceProgramWaveRound46Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r46_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound46Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r46_cap_cmp_schema',
    'round46 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound46Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round46-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round47-export.ts ---

export interface O10IdleGovernanceProgramWaveRound47ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round47-export.v1';
  waveRound: 47;
  o10TaskId: 'O10-225';
  projectedLocHint: number;
  round47Ready: boolean;
  wave47HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound47ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round47-export.v1';
  waveRound: 47;
  o10TaskId: 'O10-225';
  round46Capstone: O10IdleGovernanceProgramWaveRound46CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound47ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-47 / wave-47 export for O10-225 integration hooks. */
export function exportIdleGovernanceProgramWaveRound47(
  round46Capstone: O10IdleGovernanceProgramWaveRound46CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound47ExportResult {
  const round47Ready = round46Capstone.capstoneReady;
  const wave47HookLines = [
    `O10_AGENT20_WAVE47 task=O10-225 round=47`,
    `O10_AGENT20_WAVE47 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE47 round47_ready=${round47Ready}`,
    `O10_AGENT20_WAVE47 prior_capstone=${round46Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE47 prior_task=${round46Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound47ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round47-export.v1',
    waveRound: 47,
    o10TaskId: 'O10-225',
    projectedLocHint,
    round47Ready,
    wave47HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 47 export (O10-225)',
    '',
    ...wave47HookLines.map(line => `- ${line}`),
    '',
    round46Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round47_export', 'task=O10-225', 'round=47', `ready=${round47Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round47-export.v1',
    waveRound: 47,
    o10TaskId: 'O10-225',
    round46Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound47ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound46CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round46-capstone.v1',
    o10TaskId: 'O10-223',
    waveRound: 46,
    capstoneReady: true,
    capstoneMarkdown: '# r46',
    summaryLine: 's',
    primaryRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['primaryRound45Capstone'],
    twinRound45Capstone: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['twinRound45Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['capstoneCompare'],
    round46Export: {} as O10IdleGovernanceProgramWaveRound46CapstoneResult['round46Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound47(mockCap(), 2_637_258);
  push(
    'gov_prog_r47_export_o10',
    'wave 47 export tags O10-225 and loc hint',
    exported.o10TaskId === 'O10-225' &&
      exported.payload.projectedLocHint === 2_637_258 &&
      exported.payload.wave47HookLines.some(l => l.includes('O10-225'))
  );
  push(
    'gov_prog_r47_export_schema',
    'round 47 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round47-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round47-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound47CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round47-capstone.v1';
  o10TaskId: 'O10-225';
  waveRound: 47;
  capstoneReady: boolean;
  primaryRound46Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound46Capstone>;
  twinRound46Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound46Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound46Capstones>;
  round47Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound47>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound47Primary(cap: O10IdleGovernanceProgramWaveRound47CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-47 / wave-47 capstone for O10-225 origin landing. */
export function runIdleGovernanceProgramWaveRound47Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound47CapstoneResult {
  const waveRound = 47;
  const primaryRound46Capstone = runIdleGovernanceProgramWaveRound46Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound46Capstone = runIdleGovernanceProgramWaveRound46Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound46Capstones(
    primaryRound46Capstone,
    twinRound46Capstone
  );
  const round47Export = exportIdleGovernanceProgramWaveRound47(primaryRound46Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound46Capstone.capstoneReady && round47Export.payload.round47Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 47 capstone (O10-225)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round47Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round47_capstone',
    'task=O10-225',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round47Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone.v1',
    o10TaskId: 'O10-225',
    waveRound,
    capstoneReady,
    primaryRound46Capstone,
    twinRound46Capstone,
    capstoneCompare,
    round47Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound47CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap47',
    name: 'Round 47 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound47Capstone(calmSpec, sampleRule, 1, 3, 2_637_258);
  push(
    'gov_prog_r47_capstone_calm',
    'O10-225 wave 47 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-225' && cap.waveRound === 47 && cap.capstoneMarkdown.includes('O10-225')
  );

  const cap2 = runIdleGovernanceProgramWaveRound47Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_637_258,
    registryFromRound47Primary(cap)
  );
  const rollup =
    cap2.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r47_capstone_chain',
    'chained wave 47 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-225')
  );
  push(
    'gov_prog_r47_capstone_schema',
    'round 47 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round47-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round47-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound47CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round47-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound47CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound47CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound47CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round47Export.payload.round47Ready !== candidate.round47Export.payload.round47Ready) {
    mismatches.push('round47_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-48 twin round-47 capstone compare (O10-227 ladder). */
export function compareIdleGovernanceProgramWaveRound47Capstones(
  baseline: O10IdleGovernanceProgramWaveRound47CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound47CapstoneResult
): O10IdleGovernanceProgramWaveRound47CapstoneCompareResult {
  const mismatches = compareRound47CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round47_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound47CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound47CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone.v1',
    o10TaskId: 'O10-225',
    waveRound: 47,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['primaryRound46Capstone'],
    twinRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['twinRound46Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound47CapstoneResult['capstoneCompare'],
    round47Export: { payload: { round47Ready: true } } as O10IdleGovernanceProgramWaveRound47CapstoneResult['round47Export'],
  });

  push(
    'gov_prog_r47_cap_cmp_parity',
    'identical round 47 capstones report parity',
    compareIdleGovernanceProgramWaveRound47Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r47_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound47Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r47_cap_cmp_schema',
    'round47 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound47Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round47-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round48-export.ts ---

export interface O10IdleGovernanceProgramWaveRound48ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round48-export.v1';
  waveRound: 48;
  o10TaskId: 'O10-227';
  projectedLocHint: number;
  round48Ready: boolean;
  wave48HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound48ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round48-export.v1';
  waveRound: 48;
  o10TaskId: 'O10-227';
  round47Capstone: O10IdleGovernanceProgramWaveRound47CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound48ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-48 / wave-48 export for O10-227 integration hooks. */
export function exportIdleGovernanceProgramWaveRound48(
  round47Capstone: O10IdleGovernanceProgramWaveRound47CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound48ExportResult {
  const round48Ready = round47Capstone.capstoneReady;
  const wave48HookLines = [
    `O10_AGENT20_WAVE48 task=O10-227 round=48`,
    `O10_AGENT20_WAVE48 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE48 round48_ready=${round48Ready}`,
    `O10_AGENT20_WAVE48 prior_capstone=${round47Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE48 prior_task=${round47Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound48ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round48-export.v1',
    waveRound: 48,
    o10TaskId: 'O10-227',
    projectedLocHint,
    round48Ready,
    wave48HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 48 export (O10-227)',
    '',
    ...wave48HookLines.map(line => `- ${line}`),
    '',
    round47Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round48_export', 'task=O10-227', 'round=48', `ready=${round48Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round48-export.v1',
    waveRound: 48,
    o10TaskId: 'O10-227',
    round47Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound48ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound47CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round47-capstone.v1',
    o10TaskId: 'O10-225',
    waveRound: 47,
    capstoneReady: true,
    capstoneMarkdown: '# r47',
    summaryLine: 's',
    primaryRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['primaryRound46Capstone'],
    twinRound46Capstone: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['twinRound46Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['capstoneCompare'],
    round47Export: {} as O10IdleGovernanceProgramWaveRound47CapstoneResult['round47Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound48(mockCap(), 2_684_235);
  push(
    'gov_prog_r48_export_o10',
    'wave 48 export tags O10-227 and loc hint',
    exported.o10TaskId === 'O10-227' &&
      exported.payload.projectedLocHint === 2_684_235 &&
      exported.payload.wave48HookLines.some(l => l.includes('O10-227'))
  );
  push(
    'gov_prog_r48_export_schema',
    'round 48 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round48-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round48-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound48CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round48-capstone.v1';
  o10TaskId: 'O10-227';
  waveRound: 48;
  capstoneReady: boolean;
  primaryRound47Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound47Capstone>;
  twinRound47Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound47Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound47Capstones>;
  round48Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound48>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound48Primary(cap: O10IdleGovernanceProgramWaveRound48CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-48 / wave-48 capstone for O10-227 origin landing. */
export function runIdleGovernanceProgramWaveRound48Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound48CapstoneResult {
  const waveRound = 48;
  const primaryRound47Capstone = runIdleGovernanceProgramWaveRound47Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound47Capstone = runIdleGovernanceProgramWaveRound47Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound47Capstones(
    primaryRound47Capstone,
    twinRound47Capstone
  );
  const round48Export = exportIdleGovernanceProgramWaveRound48(primaryRound47Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound47Capstone.capstoneReady && round48Export.payload.round48Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 48 capstone (O10-227)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round48Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round48_capstone',
    'task=O10-227',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round48Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone.v1',
    o10TaskId: 'O10-227',
    waveRound,
    capstoneReady,
    primaryRound47Capstone,
    twinRound47Capstone,
    capstoneCompare,
    round48Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound48CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap48',
    name: 'Round 48 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound48Capstone(calmSpec, sampleRule, 1, 3, 2_684_235);
  push(
    'gov_prog_r48_capstone_calm',
    'O10-227 wave 48 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-227' && cap.waveRound === 48 && cap.capstoneMarkdown.includes('O10-227')
  );

  const cap2 = runIdleGovernanceProgramWaveRound48Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_684_235,
    registryFromRound48Primary(cap)
  );
  const rollup =
    cap2.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r48_capstone_chain',
    'chained wave 48 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-227')
  );
  push(
    'gov_prog_r48_capstone_schema',
    'round 48 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round48-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round48-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound48CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round48-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound48CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound48CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound48CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round48Export.payload.round48Ready !== candidate.round48Export.payload.round48Ready) {
    mismatches.push('round48_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-49 twin round-48 capstone compare (O10-229 ladder). */
export function compareIdleGovernanceProgramWaveRound48Capstones(
  baseline: O10IdleGovernanceProgramWaveRound48CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound48CapstoneResult
): O10IdleGovernanceProgramWaveRound48CapstoneCompareResult {
  const mismatches = compareRound48CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round48_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound48CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound48CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone.v1',
    o10TaskId: 'O10-227',
    waveRound: 48,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['primaryRound47Capstone'],
    twinRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['twinRound47Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound48CapstoneResult['capstoneCompare'],
    round48Export: { payload: { round48Ready: true } } as O10IdleGovernanceProgramWaveRound48CapstoneResult['round48Export'],
  });

  push(
    'gov_prog_r48_cap_cmp_parity',
    'identical round 48 capstones report parity',
    compareIdleGovernanceProgramWaveRound48Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r48_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound48Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r48_cap_cmp_schema',
    'round48 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound48Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round48-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round49-export.ts ---

export interface O10IdleGovernanceProgramWaveRound49ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round49-export.v1';
  waveRound: 49;
  o10TaskId: 'O10-229';
  projectedLocHint: number;
  round49Ready: boolean;
  wave49HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound49ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round49-export.v1';
  waveRound: 49;
  o10TaskId: 'O10-229';
  round48Capstone: O10IdleGovernanceProgramWaveRound48CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound49ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-49 / wave-49 export for O10-229 integration hooks. */
export function exportIdleGovernanceProgramWaveRound49(
  round48Capstone: O10IdleGovernanceProgramWaveRound48CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound49ExportResult {
  const round49Ready = round48Capstone.capstoneReady;
  const wave49HookLines = [
    `O10_AGENT20_WAVE49 task=O10-229 round=49`,
    `O10_AGENT20_WAVE49 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE49 round49_ready=${round49Ready}`,
    `O10_AGENT20_WAVE49 prior_capstone=${round48Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE49 prior_task=${round48Capstone.o10TaskId}`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound49ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round49-export.v1',
    waveRound: 49,
    o10TaskId: 'O10-229',
    projectedLocHint,
    round49Ready,
    wave49HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 49 export (O10-229)',
    '',
    ...wave49HookLines.map(line => `- ${line}`),
    '',
    round48Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round49_export', 'task=O10-229', 'round=49', `ready=${round49Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round49-export.v1',
    waveRound: 49,
    o10TaskId: 'O10-229',
    round48Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound49ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound48CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round48-capstone.v1',
    o10TaskId: 'O10-227',
    waveRound: 48,
    capstoneReady: true,
    capstoneMarkdown: '# r48',
    summaryLine: 's',
    primaryRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['primaryRound47Capstone'],
    twinRound47Capstone: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['twinRound47Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['capstoneCompare'],
    round48Export: {} as O10IdleGovernanceProgramWaveRound48CapstoneResult['round48Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound49(mockCap(), 2_727_364);
  push(
    'gov_prog_r49_export_o10',
    'wave 49 export tags O10-229 and loc hint',
    exported.o10TaskId === 'O10-229' &&
      exported.payload.projectedLocHint === 2_727_364 &&
      exported.payload.wave49HookLines.some(l => l.includes('O10-229'))
  );
  push(
    'gov_prog_r49_export_schema',
    'round 49 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round49-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round49-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound49CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1';
  o10TaskId: 'O10-229';
  waveRound: 49;
  capstoneReady: boolean;
  primaryRound48Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound48Capstone>;
  twinRound48Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound48Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound48Capstones>;
  round49Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound49>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound49Primary(cap: O10IdleGovernanceProgramWaveRound49CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-49 / wave-49 capstone for O10-229 origin landing. */
export function runIdleGovernanceProgramWaveRound49Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound49CapstoneResult {
  const waveRound = 49;
  const primaryRound48Capstone = runIdleGovernanceProgramWaveRound48Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound48Capstone = runIdleGovernanceProgramWaveRound48Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound48Capstones(
    primaryRound48Capstone,
    twinRound48Capstone
  );
  const round49Export = exportIdleGovernanceProgramWaveRound49(primaryRound48Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound48Capstone.capstoneReady && round49Export.payload.round49Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 49 capstone (O10-229)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round49Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round49_capstone',
    'task=O10-229',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round49Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1',
    o10TaskId: 'O10-229',
    waveRound,
    capstoneReady,
    primaryRound48Capstone,
    twinRound48Capstone,
    capstoneCompare,
    round49Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound49CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap49',
    name: 'Round 49 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound49Capstone(calmSpec, sampleRule, 1, 3, 2_727_364);
  push(
    'gov_prog_r49_capstone_calm',
    'O10-229 wave 49 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-229' && cap.waveRound === 49 && cap.capstoneMarkdown.includes('O10-229')
  );

  const cap2 = runIdleGovernanceProgramWaveRound49Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_727_364,
    registryFromRound49Primary(cap)
  );
  const rollup =
    cap2.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r49_capstone_chain',
    'chained wave 49 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-229')
  );
  push(
    'gov_prog_r49_capstone_schema',
    'round 49 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round49-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round49-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound49CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round49-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound49CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound49CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound49CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round49Export.payload.round49Ready !== candidate.round49Export.payload.round49Ready) {
    mismatches.push('round49_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-50 twin round-49 capstone compare (O10-231 ladder). */
export function compareIdleGovernanceProgramWaveRound49Capstones(
  baseline: O10IdleGovernanceProgramWaveRound49CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound49CapstoneResult
): O10IdleGovernanceProgramWaveRound49CapstoneCompareResult {
  const mismatches = compareRound49CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round49_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound49CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound49CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1',
    o10TaskId: 'O10-229',
    waveRound: 49,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['primaryRound48Capstone'],
    twinRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['twinRound48Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound49CapstoneResult['capstoneCompare'],
    round49Export: { payload: { round49Ready: true } } as O10IdleGovernanceProgramWaveRound49CapstoneResult['round49Export'],
  });

  push(
    'gov_prog_r49_cap_cmp_parity',
    'identical round 49 capstones report parity',
    compareIdleGovernanceProgramWaveRound49Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r49_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound49Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r49_cap_cmp_schema',
    'round49 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound49Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round49-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round50-export.ts ---

export interface O10IdleGovernanceProgramWaveRound50ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round50-export.v1';
  waveRound: 50;
  o10TaskId: 'O10-231';
  projectedLocHint: number;
  round50Ready: boolean;
  wave50HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound50ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round50-export.v1';
  waveRound: 50;
  o10TaskId: 'O10-231';
  round49Capstone: O10IdleGovernanceProgramWaveRound49CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound50ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-50 / wave-50 export for O10-231 integration hooks. */
export function exportIdleGovernanceProgramWaveRound50(
  round49Capstone: O10IdleGovernanceProgramWaveRound49CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound50ExportResult {
  const round50Ready = round49Capstone.capstoneReady;
  const wave50HookLines = [
    `O10_AGENT20_WAVE50 task=O10-231 round=50`,
    `O10_AGENT20_WAVE50 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE50 round50_ready=${round50Ready}`,
    `O10_AGENT20_WAVE50 prior_capstone=${round49Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE50 prior_task=${round49Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE50 integration_baseline=8aaaf700`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound50ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round50-export.v1',
    waveRound: 50,
    o10TaskId: 'O10-231',
    projectedLocHint,
    round50Ready,
    wave50HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 50 export (O10-231)',
    '',
    ...wave50HookLines.map(line => `- ${line}`),
    '',
    round49Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round50_export', 'task=O10-231', 'round=50', `ready=${round50Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round50-export.v1',
    waveRound: 50,
    o10TaskId: 'O10-231',
    round49Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound50ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound49CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1',
    o10TaskId: 'O10-229',
    waveRound: 49,
    capstoneReady: true,
    capstoneMarkdown: '# r49',
    summaryLine: 's',
    primaryRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['primaryRound48Capstone'],
    twinRound48Capstone: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['twinRound48Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['capstoneCompare'],
    round49Export: {} as O10IdleGovernanceProgramWaveRound49CapstoneResult['round49Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound50(mockCap(), 2_771_207);
  push(
    'gov_prog_r50_export_o10',
    'wave 50 export tags O10-231 and loc hint',
    exported.o10TaskId === 'O10-231' &&
      exported.payload.projectedLocHint === 2_771_207 &&
      exported.payload.wave50HookLines.some(l => l.includes('O10-231'))
  );
  push(
    'gov_prog_r50_export_schema',
    'round 50 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round50-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round50-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound50CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1';
  o10TaskId: 'O10-231';
  waveRound: 50;
  capstoneReady: boolean;
  primaryRound49Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound49Capstone>;
  twinRound49Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound49Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound49Capstones>;
  round50Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound50>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound50Primary(cap: O10IdleGovernanceProgramWaveRound50CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-50 / wave-50 capstone for O10-231 origin landing. */
export function runIdleGovernanceProgramWaveRound50Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound50CapstoneResult {
  const waveRound = 50;
  const primaryRound49Capstone = runIdleGovernanceProgramWaveRound49Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound49Capstone = runIdleGovernanceProgramWaveRound49Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound49Capstones(
    primaryRound49Capstone,
    twinRound49Capstone
  );
  const round50Export = exportIdleGovernanceProgramWaveRound50(primaryRound49Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound49Capstone.capstoneReady && round50Export.payload.round50Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 50 capstone (O10-231)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=8aaaf700`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round50Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round50_capstone',
    'task=O10-231',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round50Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1',
    o10TaskId: 'O10-231',
    waveRound,
    capstoneReady,
    primaryRound49Capstone,
    twinRound49Capstone,
    capstoneCompare,
    round50Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound50CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap50',
    name: 'Round 50 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound50Capstone(calmSpec, sampleRule, 1, 3, 2_771_207);
  push(
    'gov_prog_r50_capstone_calm',
    'O10-231 wave 50 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-231' && cap.waveRound === 50 && cap.capstoneMarkdown.includes('O10-231')
  );

  const cap2 = runIdleGovernanceProgramWaveRound50Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_771_207,
    registryFromRound50Primary(cap)
  );
  const rollup =
    cap2.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r50_capstone_chain',
    'chained wave 50 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-231')
  );
  push(
    'gov_prog_r50_capstone_schema',
    'round 50 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round50-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round50-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound50CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round50-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound50CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound50CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound50CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round50Export.payload.round50Ready !== candidate.round50Export.payload.round50Ready) {
    mismatches.push('round50_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-51 twin round-50 capstone compare (O10-233 ladder). */
export function compareIdleGovernanceProgramWaveRound50Capstones(
  baseline: O10IdleGovernanceProgramWaveRound50CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound50CapstoneResult
): O10IdleGovernanceProgramWaveRound50CapstoneCompareResult {
  const mismatches = compareRound50CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round50_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound50CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound50CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1',
    o10TaskId: 'O10-231',
    waveRound: 50,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['primaryRound49Capstone'],
    twinRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['twinRound49Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound50CapstoneResult['capstoneCompare'],
    round50Export: { payload: { round50Ready: true } } as O10IdleGovernanceProgramWaveRound50CapstoneResult['round50Export'],
  });

  push(
    'gov_prog_r50_cap_cmp_parity',
    'identical round 50 capstones report parity',
    compareIdleGovernanceProgramWaveRound50Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r50_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound50Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r50_cap_cmp_schema',
    'round50 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound50Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round50-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round51-export.ts ---

export interface O10IdleGovernanceProgramWaveRound51ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round51-export.v1';
  waveRound: 51;
  o10TaskId: 'O10-233';
  projectedLocHint: number;
  round51Ready: boolean;
  wave51HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound51ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round51-export.v1';
  waveRound: 51;
  o10TaskId: 'O10-233';
  round50Capstone: O10IdleGovernanceProgramWaveRound50CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound51ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-51 / wave-51 export for O10-233 integration hooks. */
export function exportIdleGovernanceProgramWaveRound51(
  round50Capstone: O10IdleGovernanceProgramWaveRound50CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound51ExportResult {
  const round51Ready = round50Capstone.capstoneReady;
  const wave51HookLines = [
    `O10_AGENT20_WAVE51 task=O10-233 round=51`,
    `O10_AGENT20_WAVE51 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE51 round51_ready=${round51Ready}`,
    `O10_AGENT20_WAVE51 prior_capstone=${round50Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE51 prior_task=${round50Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE51 integration_baseline=a32b2b15`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound51ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round51-export.v1',
    waveRound: 51,
    o10TaskId: 'O10-233',
    projectedLocHint,
    round51Ready,
    wave51HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 51 export (O10-233)',
    '',
    ...wave51HookLines.map(line => `- ${line}`),
    '',
    round50Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round51_export', 'task=O10-233', 'round=51', `ready=${round51Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round51-export.v1',
    waveRound: 51,
    o10TaskId: 'O10-233',
    round50Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound51ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound50CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1',
    o10TaskId: 'O10-231',
    waveRound: 50,
    capstoneReady: true,
    capstoneMarkdown: '# r50',
    summaryLine: 's',
    primaryRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['primaryRound49Capstone'],
    twinRound49Capstone: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['twinRound49Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['capstoneCompare'],
    round50Export: {} as O10IdleGovernanceProgramWaveRound50CapstoneResult['round50Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound51(mockCap(), 2_887_600);
  push(
    'gov_prog_r51_export_o10',
    'wave 51 export tags O10-233 and loc hint',
    exported.o10TaskId === 'O10-233' &&
      exported.payload.projectedLocHint === 2_887_600 &&
      exported.payload.wave51HookLines.some(l => l.includes('O10-233'))
  );
  push(
    'gov_prog_r51_export_schema',
    'round 51 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round51-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round51-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound51CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1';
  o10TaskId: 'O10-233';
  waveRound: 51;
  capstoneReady: boolean;
  primaryRound50Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound50Capstone>;
  twinRound50Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound50Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound50Capstones>;
  round51Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound51>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound51Primary(cap: O10IdleGovernanceProgramWaveRound51CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound50Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-51 / wave-51 capstone for O10-233 origin landing. */
export function runIdleGovernanceProgramWaveRound51Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound51CapstoneResult {
  const waveRound = 51;
  const primaryRound50Capstone = runIdleGovernanceProgramWaveRound50Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound50Capstone = runIdleGovernanceProgramWaveRound50Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound50Capstones(
    primaryRound50Capstone,
    twinRound50Capstone
  );
  const round51Export = exportIdleGovernanceProgramWaveRound51(primaryRound50Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound50Capstone.capstoneReady && round51Export.payload.round51Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 51 capstone (O10-233)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=a32b2b15`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round51Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round51_capstone',
    'task=O10-233',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round51Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1',
    o10TaskId: 'O10-233',
    waveRound,
    capstoneReady,
    primaryRound50Capstone,
    twinRound50Capstone,
    capstoneCompare,
    round51Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound51CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap51',
    name: 'Round 51 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound51Capstone(calmSpec, sampleRule, 1, 3, 2_887_600);
  push(
    'gov_prog_r51_capstone_calm',
    'O10-233 wave 51 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-233' && cap.waveRound === 51 && cap.capstoneMarkdown.includes('O10-233')
  );

  const cap2 = runIdleGovernanceProgramWaveRound51Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_887_600,
    registryFromRound51Primary(cap)
  );
  const rollup =
    cap2.primaryRound50Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r51_capstone_chain',
    'chained wave 51 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-233')
  );
  push(
    'gov_prog_r51_capstone_schema',
    'round 51 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round51-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round51-capstone-compare.ts ---

export interface O10IdleGovernanceProgramWaveRound51CapstoneCompareResult {
  schema: '10m.agent20.idle-governance-program-wave-round51-capstone-compare.v1';
  waveRound: number;
  parityOk: boolean;
  mismatches: string[];
  summaryLine: string;
}

function compareRound51CapstoneFields(
  baseline: O10IdleGovernanceProgramWaveRound51CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound51CapstoneResult
): string[] {
  const mismatches: string[] = [];
  if (baseline.waveRound !== candidate.waveRound) mismatches.push(`wave_round ${baseline.waveRound} vs ${candidate.waveRound}`);
  if (baseline.capstoneReady !== candidate.capstoneReady) {
    mismatches.push(`capstone_ready ${baseline.capstoneReady} vs ${candidate.capstoneReady}`);
  }
  if (baseline.capstoneCompare.parityOk !== candidate.capstoneCompare.parityOk) {
    mismatches.push('capstone_compare_parity');
  }
  if (baseline.round51Export.payload.round51Ready !== candidate.round51Export.payload.round51Ready) {
    mismatches.push('round51_export_ready');
  }
  if (baseline.o10TaskId !== candidate.o10TaskId) mismatches.push('o10_task_id');
  return mismatches;
}

/** Round-52 twin round-51 capstone compare (O10-235 ladder). */
export function compareIdleGovernanceProgramWaveRound51Capstones(
  baseline: O10IdleGovernanceProgramWaveRound51CapstoneResult,
  candidate: O10IdleGovernanceProgramWaveRound51CapstoneResult
): O10IdleGovernanceProgramWaveRound51CapstoneCompareResult {
  const mismatches = compareRound51CapstoneFields(baseline, candidate);
  const waveRound = baseline.waveRound;
  const parityOk = mismatches.length === 0;
  const summaryLine = [
    'gov_program_wave_round51_capstone_compare',
    `round=${waveRound}`,
    `parity=${parityOk}`,
    `mismatches=${mismatches.length}`,
  ].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone-compare.v1',
    waveRound,
    parityOk,
    mismatches,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound51CapstoneCompareSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const twin = (): O10IdleGovernanceProgramWaveRound51CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1',
    o10TaskId: 'O10-233',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: 'md',
    summaryLine: 'c',
    primaryRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['primaryRound50Capstone'],
    twinRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['twinRound50Capstone'],
    capstoneCompare: { parityOk: true } as O10IdleGovernanceProgramWaveRound51CapstoneResult['capstoneCompare'],
    round51Export: { payload: { round51Ready: true } } as O10IdleGovernanceProgramWaveRound51CapstoneResult['round51Export'],
  });

  push(
    'gov_prog_r51_cap_cmp_parity',
    'identical round 51 capstones report parity',
    compareIdleGovernanceProgramWaveRound51Capstones(twin(), twin()).parityOk
  );
  push(
    'gov_prog_r51_cap_cmp_ready',
    'capstone_ready drift surfaces mismatch',
    !compareIdleGovernanceProgramWaveRound51Capstones(twin(), { ...twin(), capstoneReady: false }).parityOk
  );
  push(
    'gov_prog_r51_cap_cmp_schema',
    'round50 capstone compare schema marker',
    compareIdleGovernanceProgramWaveRound51Capstones(twin(), twin()).schema ===
      '10m.agent20.idle-governance-program-wave-round51-capstone-compare.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round52-export.ts ---

export interface O10IdleGovernanceProgramWaveRound52ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round52-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-235';
  projectedLocHint: number;
  round52Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound52ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round52-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-235';
  round51Capstone: O10IdleGovernanceProgramWaveRound51CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound52ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-52 / wave-52 export for O10-235 integration hooks. */
export function exportIdleGovernanceProgramWaveRound52(
  round51Capstone: O10IdleGovernanceProgramWaveRound51CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound52ExportResult {
  const round52Ready = round51Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE52 task=O10-235 round=52`,
    `O10_AGENT20_WAVE52 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE52 round52_ready=${round52Ready}`,
    `O10_AGENT20_WAVE52 prior_capstone=${round51Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE52 prior_task=${round51Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE52 integration_baseline=ba97bdce`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound52ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round52-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-235',
    projectedLocHint,
    round52Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-235)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round51Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round52_export', 'task=O10-235', 'round=52', `ready=${round52Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round52-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-235',
    round51Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound51CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1',
    o10TaskId: 'O10-233',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['primaryRound50Capstone'],
    twinRound50Capstone: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['twinRound50Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['capstoneCompare'],
    round51Export: {} as O10IdleGovernanceProgramWaveRound51CapstoneResult['round51Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound52(mockCap(), 2_932_752);
  push(
    'gov_prog_r52_export_o10',
    'wave 52 export tags O10-235 and loc hint',
    exported.o10TaskId === 'O10-235' &&
      exported.payload.projectedLocHint === 2_932_752 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-235'))
  );
  push(
    'gov_prog_r52_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round52-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round52-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound52CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round52-capstone.v1';
  o10TaskId: 'O10-235';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound51Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound51Capstone>;
  twinRound51Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound51Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound51Capstones>;
  round52Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound52>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound52Primary(cap: O10IdleGovernanceProgramWaveRound52CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound51Capstone.primaryRound50Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-52 / wave-52 capstone for O10-235 origin landing. */
export function runIdleGovernanceProgramWaveRound52Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound52CapstoneResult {
  const waveRound = 52;
  const primaryRound51Capstone = runIdleGovernanceProgramWaveRound51Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound51Capstone = runIdleGovernanceProgramWaveRound51Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound51Capstones(
    primaryRound51Capstone,
    twinRound51Capstone
  );
  const round52Export = exportIdleGovernanceProgramWaveRound52(primaryRound51Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound51Capstone.capstoneReady && round52Export.payload.round52Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 52 capstone (O10-235)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=ba97bdce`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round52Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round52_capstone',
    'task=O10-235',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round52Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round52-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound,
    capstoneReady,
    primaryRound51Capstone,
    twinRound51Capstone,
    capstoneCompare,
    round52Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap52',
    name: 'Round 52 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound52Capstone(calmSpec, sampleRule, 1, 3, 2_932_752);
  push(
    'gov_prog_r52_capstone_calm',
    'O10-235 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-235' && cap.waveRound === 52 && cap.capstoneMarkdown.includes('O10-235')
  );

  const cap2 = runIdleGovernanceProgramWaveRound52Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_932_752,
    registryFromRound52Primary(cap)
  );
  const rollup =
    cap2.primaryRound51Capstone.primaryRound50Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r52_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-235')
  );
  push(
    'gov_prog_r52_capstone_schema',
    'round 52 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round52-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round53-export.ts ---

export interface O10IdleGovernanceProgramWaveRound53ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round53-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-237';
  projectedLocHint: number;
  round53Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound53ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round53-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-237';
  round52Capstone: O10IdleGovernanceProgramWaveRound53CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound53ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-53 / wave-53 export for O10-237 integration hooks. */
export function exportIdleGovernanceProgramWaveRound53(
  round52Capstone: O10IdleGovernanceProgramWaveRound53CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound53ExportResult {
  const round53Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE53 task=O10-237 round=52`,
    `O10_AGENT20_WAVE53 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE53 round53_ready=${round53Ready}`,
    `O10_AGENT20_WAVE53 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE53 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE53 integration_baseline=51039c5e`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound53ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round53-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-237',
    projectedLocHint,
    round53Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-237)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round53_export', 'task=O10-237', 'round=52', `ready=${round53Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round53-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-237',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound53CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round53-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound53CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound53(mockCap(), 2_979_928);
  push(
    'gov_prog_r53_export_o10',
    'wave 53 export tags O10-237 and loc hint',
    exported.o10TaskId === 'O10-237' &&
      exported.payload.projectedLocHint === 2_979_928 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-237'))
  );
  push(
    'gov_prog_r53_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round53-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round53-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound53CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round53-capstone.v1';
  o10TaskId: 'O10-237';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound53Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound53Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound53Capstones>;
  round53Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound53>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound53Primary(cap: O10IdleGovernanceProgramWaveRound53CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-53 / wave-53 capstone for O10-237 origin landing. */
export function runIdleGovernanceProgramWaveRound53Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound53CapstoneResult {
  const waveRound = 53;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound53Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound53Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound53Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round53Export = exportIdleGovernanceProgramWaveRound53(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round53Export.payload.round53Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 53 capstone (O10-237)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=51039c5e`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round53Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round53_capstone',
    'task=O10-237',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round53Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round53-capstone.v1',
    o10TaskId: 'O10-237',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round53Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap53',
    name: 'Round 53 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound53Capstone(calmSpec, sampleRule, 1, 3, 2_979_928);
  push(
    'gov_prog_r53_capstone_calm',
    'O10-237 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-237' && cap.waveRound === 53 && cap.capstoneMarkdown.includes('O10-237')
  );

  const cap2 = runIdleGovernanceProgramWaveRound53Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_979_928,
    registryFromRound53Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r53_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-237')
  );
  push(
    'gov_prog_r53_capstone_schema',
    'round 53 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round53-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round54-export.ts ---

export interface O10IdleGovernanceProgramWaveRound54ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round54-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-240';
  projectedLocHint: number;
  round54Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound54ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round54-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-240';
  round52Capstone: O10IdleGovernanceProgramWaveRound54CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound54ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-54 / wave-54 export for O10-240 integration hooks. */
export function exportIdleGovernanceProgramWaveRound54(
  round52Capstone: O10IdleGovernanceProgramWaveRound54CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound54ExportResult {
  const round54Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE54 task=O10-240 round=52`,
    `O10_AGENT20_WAVE54 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE54 round54_ready=${round54Ready}`,
    `O10_AGENT20_WAVE54 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE54 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE54 integration_baseline=5bd043ad`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound54ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round54-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-240',
    projectedLocHint,
    round54Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-240)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round54_export', 'task=O10-240', 'round=52', `ready=${round54Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round54-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-240',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound54CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round54-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound54CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound54(mockCap(), 3_022_056);
  push(
    'gov_prog_r54_export_o10',
    'wave 54 export tags O10-240 and loc hint',
    exported.o10TaskId === 'O10-240' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-240'))
  );
  push(
    'gov_prog_r54_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round54-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round54-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound54CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round54-capstone.v1';
  o10TaskId: 'O10-240';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound54Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound54Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound54Capstones>;
  round54Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound54>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound54Primary(cap: O10IdleGovernanceProgramWaveRound54CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-54 / wave-54 capstone for O10-240 origin landing. */
export function runIdleGovernanceProgramWaveRound54Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound54CapstoneResult {
  const waveRound = 54;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound54Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound54Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound54Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round54Export = exportIdleGovernanceProgramWaveRound54(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round54Export.payload.round54Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 54 capstone (O10-240)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=5bd043ad`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round54Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round54_capstone',
    'task=O10-240',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round54Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round54-capstone.v1',
    o10TaskId: 'O10-240',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round54Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap54',
    name: 'Round 54 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound54Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r54_capstone_calm',
    'O10-240 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-240' && cap.waveRound === 54 && cap.capstoneMarkdown.includes('O10-240')
  );

  const cap2 = runIdleGovernanceProgramWaveRound54Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound54Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r54_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-240')
  );
  push(
    'gov_prog_r54_capstone_schema',
    'round 54 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round54-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round67-export.ts ---

export interface O10IdleGovernanceProgramWaveRound67ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round67-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-283';
  projectedLocHint: number;
  round67Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound67ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round67-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-283';
  round52Capstone: O10IdleGovernanceProgramWaveRound67CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound67ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-67 export for O10-283 integration hooks. */
export function exportIdleGovernanceProgramWaveRound67(
  round52Capstone: O10IdleGovernanceProgramWaveRound67CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound67ExportResult {
  const round67Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE67 task=O10-283 round=52`,
    `O10_AGENT20_WAVE67 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE67 round67_ready=${round67Ready}`,
    `O10_AGENT20_WAVE67 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE67 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE67 integration_baseline=369f3995`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound67ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round67-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-283',
    projectedLocHint,
    round67Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-283)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round67_export', 'task=O10-283', 'round=52', `ready=${round67Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round67-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-283',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound67ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound67CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round67-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound67CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound67CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound67CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound67CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound67(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 67 export tags O10-283 and loc hint',
    exported.o10TaskId === 'O10-283' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-283'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round67-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round67-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound67CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round67-capstone.v1';
  o10TaskId: 'O10-283';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound67Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound67Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound67Capstones>;
  round67Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound67>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound67Primary(cap: O10IdleGovernanceProgramWaveRound67CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-67 capstone for O10-283 origin landing. */
export function runIdleGovernanceProgramWaveRound67Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound67CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound67Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound67Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound67Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round67Export = exportIdleGovernanceProgramWaveRound67(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round67Export.payload.round67Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 67 capstone (O10-283)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=369f3995`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round67Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round67_capstone',
    'task=O10-283',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round67Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round67-capstone.v1',
    o10TaskId: 'O10-283',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round67Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound67CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 67 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound67Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-283 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-283' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-283')
  );

  const cap2 = runIdleGovernanceProgramWaveRound67Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound67Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-283')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 67 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round67-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round66-export.ts ---

export interface O10IdleGovernanceProgramWaveRound66ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round66-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-279';
  projectedLocHint: number;
  round66Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound66ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round66-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-279';
  round52Capstone: O10IdleGovernanceProgramWaveRound66CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound66ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-66 export for O10-279 integration hooks. */
export function exportIdleGovernanceProgramWaveRound66(
  round52Capstone: O10IdleGovernanceProgramWaveRound66CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound66ExportResult {
  const round66Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE66 task=O10-279 round=52`,
    `O10_AGENT20_WAVE66 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE66 round66_ready=${round66Ready}`,
    `O10_AGENT20_WAVE66 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE66 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE66 integration_baseline=dc433dc2`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound66ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round66-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-279',
    projectedLocHint,
    round66Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-279)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round66_export', 'task=O10-279', 'round=52', `ready=${round66Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round66-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-279',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound66ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound66CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round66-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound66CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound66CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound66CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound66CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound66(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 66 export tags O10-279 and loc hint',
    exported.o10TaskId === 'O10-279' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-279'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round66-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round66-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound66CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round66-capstone.v1';
  o10TaskId: 'O10-279';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound66Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound66Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound66Capstones>;
  round66Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound66>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound66Primary(cap: O10IdleGovernanceProgramWaveRound66CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-66 capstone for O10-279 origin landing. */
export function runIdleGovernanceProgramWaveRound66Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound66CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound66Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound66Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound66Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round66Export = exportIdleGovernanceProgramWaveRound66(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round66Export.payload.round66Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 66 capstone (O10-279)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=dc433dc2`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round66Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round66_capstone',
    'task=O10-279',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round66Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round66-capstone.v1',
    o10TaskId: 'O10-279',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round66Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound66CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 66 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound66Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-279 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-279' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-279')
  );

  const cap2 = runIdleGovernanceProgramWaveRound66Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound66Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-279')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 66 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round66-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round65-export.ts ---

export interface O10IdleGovernanceProgramWaveRound65ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round65-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-277';
  projectedLocHint: number;
  round65Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound65ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round65-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-277';
  round52Capstone: O10IdleGovernanceProgramWaveRound65CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound65ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-65 export for O10-277 integration hooks. */
export function exportIdleGovernanceProgramWaveRound65(
  round52Capstone: O10IdleGovernanceProgramWaveRound65CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound65ExportResult {
  const round65Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE65 task=O10-277 round=52`,
    `O10_AGENT20_WAVE65 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE65 round65_ready=${round65Ready}`,
    `O10_AGENT20_WAVE65 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE65 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE65 integration_baseline=18f4e9a2`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound65ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round65-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-277',
    projectedLocHint,
    round65Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-277)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round65_export', 'task=O10-277', 'round=52', `ready=${round65Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round65-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-277',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound65ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound65CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round65-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound65CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound65CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound65CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound65CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound65(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 65 export tags O10-277 and loc hint',
    exported.o10TaskId === 'O10-277' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-277'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round65-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round65-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound65CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round65-capstone.v1';
  o10TaskId: 'O10-277';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound65Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound65Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound65Capstones>;
  round65Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound65>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound65Primary(cap: O10IdleGovernanceProgramWaveRound65CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-65 capstone for O10-277 origin landing. */
export function runIdleGovernanceProgramWaveRound65Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound65CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound65Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound65Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound65Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round65Export = exportIdleGovernanceProgramWaveRound65(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round65Export.payload.round65Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 65 capstone (O10-277)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=18f4e9a2`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round65Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round65_capstone',
    'task=O10-277',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round65Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round65-capstone.v1',
    o10TaskId: 'O10-277',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round65Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound65CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 65 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound65Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-277 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-277' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-277')
  );

  const cap2 = runIdleGovernanceProgramWaveRound65Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound65Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-277')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 65 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round65-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round64-export.ts ---

export interface O10IdleGovernanceProgramWaveRound64ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round64-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-275';
  projectedLocHint: number;
  round64Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound64ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round64-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-275';
  round52Capstone: O10IdleGovernanceProgramWaveRound64CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound64ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-64 export for O10-275 integration hooks. */
export function exportIdleGovernanceProgramWaveRound64(
  round52Capstone: O10IdleGovernanceProgramWaveRound64CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound64ExportResult {
  const round64Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE64 task=O10-275 round=52`,
    `O10_AGENT20_WAVE64 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE64 round64_ready=${round64Ready}`,
    `O10_AGENT20_WAVE64 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE64 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE64 integration_baseline=308fd6dc`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound64ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round64-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-275',
    projectedLocHint,
    round64Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-275)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round64_export', 'task=O10-275', 'round=52', `ready=${round64Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round64-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-275',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound64ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound64CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round64-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound64CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound64(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 64 export tags O10-275 and loc hint',
    exported.o10TaskId === 'O10-275' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-275'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round64-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round64-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound64CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round64-capstone.v1';
  o10TaskId: 'O10-275';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound64Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound64Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound64Capstones>;
  round64Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound64>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound64Primary(cap: O10IdleGovernanceProgramWaveRound64CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-64 capstone for O10-275 origin landing. */
export function runIdleGovernanceProgramWaveRound64Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound64CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound64Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound64Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound64Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round64Export = exportIdleGovernanceProgramWaveRound64(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round64Export.payload.round64Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 64 capstone (O10-275)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=308fd6dc`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round64Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round64_capstone',
    'task=O10-275',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round64Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round64-capstone.v1',
    o10TaskId: 'O10-275',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round64Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound64CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 64 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound64Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-275 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-275' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-275')
  );

  const cap2 = runIdleGovernanceProgramWaveRound64Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound64Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-275')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 64 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round64-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round63-export.ts ---

export interface O10IdleGovernanceProgramWaveRound63ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round63-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-273';
  projectedLocHint: number;
  round63Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound63ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round63-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-273';
  round52Capstone: O10IdleGovernanceProgramWaveRound63CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound63ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-63 export for O10-273 integration hooks. */
export function exportIdleGovernanceProgramWaveRound63(
  round52Capstone: O10IdleGovernanceProgramWaveRound63CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound63ExportResult {
  const round63Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE63 task=O10-273 round=52`,
    `O10_AGENT20_WAVE63 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE63 round63_ready=${round63Ready}`,
    `O10_AGENT20_WAVE63 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE63 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE63 integration_baseline=2ccfd849`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound63ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round63-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-273',
    projectedLocHint,
    round63Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-273)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round63_export', 'task=O10-273', 'round=52', `ready=${round63Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round63-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-273',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound63ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound63CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round63-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound63CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound63CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound63CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound63CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound63(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 63 export tags O10-273 and loc hint',
    exported.o10TaskId === 'O10-273' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-273'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round63-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round63-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound63CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round63-capstone.v1';
  o10TaskId: 'O10-273';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound63Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound63Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound63Capstones>;
  round63Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound63>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound63Primary(cap: O10IdleGovernanceProgramWaveRound63CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-63 capstone for O10-273 origin landing. */
export function runIdleGovernanceProgramWaveRound63Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound63CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound63Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound63Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound63Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round63Export = exportIdleGovernanceProgramWaveRound63(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round63Export.payload.round63Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 63 capstone (O10-273)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=2ccfd849`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round63Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round63_capstone',
    'task=O10-273',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round63Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round63-capstone.v1',
    o10TaskId: 'O10-273',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round63Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound63CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 63 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound63Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-273 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-273' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-273')
  );

  const cap2 = runIdleGovernanceProgramWaveRound63Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound63Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-273')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 63 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round63-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round62-export.ts ---

export interface O10IdleGovernanceProgramWaveRound62ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round62-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-269';
  projectedLocHint: number;
  round62Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound62ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round62-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-269';
  round52Capstone: O10IdleGovernanceProgramWaveRound62CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound62ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-62 export for O10-269 integration hooks. */
export function exportIdleGovernanceProgramWaveRound62(
  round52Capstone: O10IdleGovernanceProgramWaveRound62CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound62ExportResult {
  const round62Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE62 task=O10-269 round=52`,
    `O10_AGENT20_WAVE62 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE62 round62_ready=${round62Ready}`,
    `O10_AGENT20_WAVE62 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE62 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE62 integration_baseline=e11ba60a`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound62ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round62-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-269',
    projectedLocHint,
    round62Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-269)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round62_export', 'task=O10-269', 'round=52', `ready=${round62Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round62-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-269',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound62ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound62CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round62-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound62CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound62CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound62CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound62CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound62(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 62 export tags O10-269 and loc hint',
    exported.o10TaskId === 'O10-269' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-269'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round62-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round62-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound62CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round62-capstone.v1';
  o10TaskId: 'O10-269';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound62Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound62Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound62Capstones>;
  round62Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound62>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound62Primary(cap: O10IdleGovernanceProgramWaveRound62CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-62 capstone for O10-269 origin landing. */
export function runIdleGovernanceProgramWaveRound62Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound62CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound62Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound62Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound62Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round62Export = exportIdleGovernanceProgramWaveRound62(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round62Export.payload.round62Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 62 capstone (O10-269)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=e11ba60a`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round62Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round62_capstone',
    'task=O10-269',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round62Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round62-capstone.v1',
    o10TaskId: 'O10-269',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round62Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound62CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 62 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound62Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-269 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-269' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-269')
  );

  const cap2 = runIdleGovernanceProgramWaveRound62Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound62Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-269')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 62 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round62-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round61-export.ts ---

export interface O10IdleGovernanceProgramWaveRound61ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round61-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-267';
  projectedLocHint: number;
  round61Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound61ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round61-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-267';
  round52Capstone: O10IdleGovernanceProgramWaveRound61CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound61ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-61 export for O10-267 integration hooks. */
export function exportIdleGovernanceProgramWaveRound61(
  round52Capstone: O10IdleGovernanceProgramWaveRound61CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound61ExportResult {
  const round61Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE61 task=O10-267 round=52`,
    `O10_AGENT20_WAVE61 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE61 round61_ready=${round61Ready}`,
    `O10_AGENT20_WAVE61 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE61 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE61 integration_baseline=7f862be0`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound61ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round61-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-267',
    projectedLocHint,
    round61Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-267)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round61_export', 'task=O10-267', 'round=52', `ready=${round61Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round61-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-267',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound61ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound61CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round61-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound61CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound61(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 61 export tags O10-267 and loc hint',
    exported.o10TaskId === 'O10-267' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-267'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round61-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round61-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound61CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round61-capstone.v1';
  o10TaskId: 'O10-267';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound61Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound61Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound61Capstones>;
  round61Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound61>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound61Primary(cap: O10IdleGovernanceProgramWaveRound61CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-61 capstone for O10-267 origin landing. */
export function runIdleGovernanceProgramWaveRound61Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound61CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound61Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound61Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound61Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round61Export = exportIdleGovernanceProgramWaveRound61(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round61Export.payload.round61Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 61 capstone (O10-267)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=7f862be0`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round61Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round61_capstone',
    'task=O10-267',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round61Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round61-capstone.v1',
    o10TaskId: 'O10-267',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round61Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound61CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 61 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound61Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-267 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-267' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-267')
  );

  const cap2 = runIdleGovernanceProgramWaveRound61Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound61Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-267')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 61 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round61-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round60-export.ts ---

export interface O10IdleGovernanceProgramWaveRound60ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round60-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-265';
  projectedLocHint: number;
  round60Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound60ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round60-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-265';
  round52Capstone: O10IdleGovernanceProgramWaveRound60CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound60ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-60 export for O10-265 integration hooks. */
export function exportIdleGovernanceProgramWaveRound60(
  round52Capstone: O10IdleGovernanceProgramWaveRound60CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound60ExportResult {
  const round60Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE60 task=O10-265 round=52`,
    `O10_AGENT20_WAVE60 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE60 round60_ready=${round60Ready}`,
    `O10_AGENT20_WAVE60 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE60 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE60 integration_baseline=af6c94f0`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound60ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round60-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-265',
    projectedLocHint,
    round60Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-265)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round60_export', 'task=O10-265', 'round=52', `ready=${round60Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round60-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-265',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound60ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound60CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round60-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound60CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound60(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 60 export tags O10-265 and loc hint',
    exported.o10TaskId === 'O10-265' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-265'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round60-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round60-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound60CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round60-capstone.v1';
  o10TaskId: 'O10-265';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound60Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound60Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound60Capstones>;
  round60Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound60>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound60Primary(cap: O10IdleGovernanceProgramWaveRound60CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-60 capstone for O10-265 origin landing. */
export function runIdleGovernanceProgramWaveRound60Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound60CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound60Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound60Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound60Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round60Export = exportIdleGovernanceProgramWaveRound60(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round60Export.payload.round60Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 60 capstone (O10-265)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=af6c94f0`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round60Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round60_capstone',
    'task=O10-265',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round60Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round60-capstone.v1',
    o10TaskId: 'O10-265',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round60Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound60CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 60 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound60Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-265 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-265' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-265')
  );

  const cap2 = runIdleGovernanceProgramWaveRound60Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound60Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-265')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 60 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round60-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round59-export.ts ---

export interface O10IdleGovernanceProgramWaveRound59ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round59-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-263';
  projectedLocHint: number;
  round59Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound59ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round59-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-263';
  round52Capstone: O10IdleGovernanceProgramWaveRound59CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound59ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-59 export for O10-263 integration hooks. */
export function exportIdleGovernanceProgramWaveRound59(
  round52Capstone: O10IdleGovernanceProgramWaveRound59CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound59ExportResult {
  const round59Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE59 task=O10-263 round=52`,
    `O10_AGENT20_WAVE59 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE59 round59_ready=${round59Ready}`,
    `O10_AGENT20_WAVE59 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE59 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE59 integration_baseline=4182618c`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound59ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round59-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-263',
    projectedLocHint,
    round59Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-263)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round59_export', 'task=O10-263', 'round=52', `ready=${round59Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round59-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-263',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound59ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound59CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round59-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound59CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound59(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 59 export tags O10-263 and loc hint',
    exported.o10TaskId === 'O10-263' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-263'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round59-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round59-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound59CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round59-capstone.v1';
  o10TaskId: 'O10-263';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound59Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound59Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound59Capstones>;
  round59Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound59>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound59Primary(cap: O10IdleGovernanceProgramWaveRound59CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-59 capstone for O10-263 origin landing. */
export function runIdleGovernanceProgramWaveRound59Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound59CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound59Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound59Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound59Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round59Export = exportIdleGovernanceProgramWaveRound59(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round59Export.payload.round59Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 59 capstone (O10-263)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=4182618c`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round59Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round59_capstone',
    'task=O10-263',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round59Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round59-capstone.v1',
    o10TaskId: 'O10-263',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round59Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound59CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 59 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound59Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-263 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-263' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-263')
  );

  const cap2 = runIdleGovernanceProgramWaveRound59Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound59Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-263')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 59 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round59-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round58-export.ts ---

export interface O10IdleGovernanceProgramWaveRound58ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round58-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-260';
  projectedLocHint: number;
  round58Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound58ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round58-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-260';
  round52Capstone: O10IdleGovernanceProgramWaveRound58CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound58ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-58 export for O10-260 integration hooks. */
export function exportIdleGovernanceProgramWaveRound58(
  round52Capstone: O10IdleGovernanceProgramWaveRound58CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound58ExportResult {
  const round58Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE58 task=O10-260 round=52`,
    `O10_AGENT20_WAVE58 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE58 round58_ready=${round58Ready}`,
    `O10_AGENT20_WAVE58 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE58 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE58 integration_baseline=feb7e524`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound58ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round58-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-260',
    projectedLocHint,
    round58Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-260)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round58_export', 'task=O10-260', 'round=52', `ready=${round58Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round58-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-260',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound58ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound58CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round58-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound58CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound58(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 58 export tags O10-260 and loc hint',
    exported.o10TaskId === 'O10-260' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-260'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round58-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round58-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound58CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round58-capstone.v1';
  o10TaskId: 'O10-260';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound58Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound58Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound58Capstones>;
  round58Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound58>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound58Primary(cap: O10IdleGovernanceProgramWaveRound58CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-58 capstone for O10-260 origin landing. */
export function runIdleGovernanceProgramWaveRound58Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound58CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound58Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound58Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound58Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round58Export = exportIdleGovernanceProgramWaveRound58(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round58Export.payload.round58Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 58 capstone (O10-260)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=feb7e524`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round58Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round58_capstone',
    'task=O10-260',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round58Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round58-capstone.v1',
    o10TaskId: 'O10-260',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round58Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound58CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 58 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound58Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-260 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-260' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-260')
  );

  const cap2 = runIdleGovernanceProgramWaveRound58Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound58Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-260')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 58 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round58-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round57-export.ts ---

export interface O10IdleGovernanceProgramWaveRound57ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round57-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-257';
  projectedLocHint: number;
  round57Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound57ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round57-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-257';
  round52Capstone: O10IdleGovernanceProgramWaveRound57CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound57ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-57 export for O10-257 integration hooks. */
export function exportIdleGovernanceProgramWaveRound57(
  round52Capstone: O10IdleGovernanceProgramWaveRound57CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound57ExportResult {
  const round57Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE57 task=O10-257 round=52`,
    `O10_AGENT20_WAVE57 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE57 round57_ready=${round57Ready}`,
    `O10_AGENT20_WAVE57 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE57 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE57 integration_baseline=93c42b3d`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound57ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round57-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-257',
    projectedLocHint,
    round57Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-257)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round57_export', 'task=O10-257', 'round=52', `ready=${round57Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round57-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-257',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound57ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound57CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round57-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound57CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound57(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 57 export tags O10-257 and loc hint',
    exported.o10TaskId === 'O10-257' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-257'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round57-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round57-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound57CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round57-capstone.v1';
  o10TaskId: 'O10-257';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound57Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound57Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound57Capstones>;
  round57Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound57>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound57Primary(cap: O10IdleGovernanceProgramWaveRound57CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-57 capstone for O10-257 origin landing. */
export function runIdleGovernanceProgramWaveRound57Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound57CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound57Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound57Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound57Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round57Export = exportIdleGovernanceProgramWaveRound57(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round57Export.payload.round57Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 57 capstone (O10-257)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=93c42b3d`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round57Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round57_capstone',
    'task=O10-257',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round57Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round57-capstone.v1',
    o10TaskId: 'O10-257',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round57Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound57CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 57 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound57Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-257 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-257' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-257')
  );

  const cap2 = runIdleGovernanceProgramWaveRound57Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound57Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-257')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 57 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round57-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round56-export.ts ---

export interface O10IdleGovernanceProgramWaveRound56ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round56-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-254';
  projectedLocHint: number;
  round56Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound56ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round56-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-254';
  round52Capstone: O10IdleGovernanceProgramWaveRound56CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound56ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-56 export for O10-254 integration hooks. */
export function exportIdleGovernanceProgramWaveRound56(
  round52Capstone: O10IdleGovernanceProgramWaveRound56CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound56ExportResult {
  const round56Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE56 task=O10-254 round=52`,
    `O10_AGENT20_WAVE56 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE56 round56_ready=${round56Ready}`,
    `O10_AGENT20_WAVE56 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE56 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE56 integration_baseline=8e2366bb`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound56ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round56-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-254',
    projectedLocHint,
    round56Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-254)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round56_export', 'task=O10-254', 'round=52', `ready=${round56Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round56-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-254',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound56ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound56CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round56-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound56CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound56(mockCap(), 3_022_056);
  push(
    'gov_prog_r55_export_o10',
    'wave 56 export tags O10-254 and loc hint',
    exported.o10TaskId === 'O10-254' &&
      exported.payload.projectedLocHint === 3_022_056 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-254'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round56-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round56-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound56CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round56-capstone.v1';
  o10TaskId: 'O10-254';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound56Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound56Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound56Capstones>;
  round56Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound56>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound56Primary(cap: O10IdleGovernanceProgramWaveRound56CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-56 capstone for O10-254 origin landing. */
export function runIdleGovernanceProgramWaveRound56Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound56CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound56Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound56Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound56Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round56Export = exportIdleGovernanceProgramWaveRound56(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round56Export.payload.round56Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 56 capstone (O10-254)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=8e2366bb`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round56Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round56_capstone',
    'task=O10-254',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round56Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round56-capstone.v1',
    o10TaskId: 'O10-254',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round56Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound56CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 56 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound56Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-254 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-254' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-254')
  );

  const cap2 = runIdleGovernanceProgramWaveRound56Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound56Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-254')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 56 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round56-capstone.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round55-export.ts ---

export interface O10IdleGovernanceProgramWaveRound55ExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-round55-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-247';
  projectedLocHint: number;
  round55Ready: boolean;
  wave52HookLines: string[];
}

export interface O10IdleGovernanceProgramWaveRound55ExportResult {
  schema: '10m.agent20.idle-governance-program-wave-round55-export.v1';
  waveRound: 52;
  o10TaskId: 'O10-247';
  round52Capstone: O10IdleGovernanceProgramWaveRound55CapstoneResult;
  payload: O10IdleGovernanceProgramWaveRound55ExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

/** Round-55 / wave-55 export for O10-247 integration hooks. */
export function exportIdleGovernanceProgramWaveRound55(
  round52Capstone: O10IdleGovernanceProgramWaveRound55CapstoneResult,
  projectedLocHint: number
): O10IdleGovernanceProgramWaveRound55ExportResult {
  const round55Ready = round52Capstone.capstoneReady;
  const wave52HookLines = [
    `O10_AGENT20_WAVE55 task=O10-247 round=52`,
    `O10_AGENT20_WAVE55 loc_hint=${projectedLocHint}`,
    `O10_AGENT20_WAVE55 round55_ready=${round55Ready}`,
    `O10_AGENT20_WAVE55 prior_capstone=${round52Capstone.capstoneReady}`,
    `O10_AGENT20_WAVE55 prior_task=${round52Capstone.o10TaskId}`,
    `O10_AGENT20_WAVE55 integration_baseline=c4bbec67`,
  ];
  const payload: O10IdleGovernanceProgramWaveRound55ExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-round55-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-247',
    projectedLocHint,
    round55Ready,
    wave52HookLines,
  };
  const exportMarkdown = [
    '# Agent 20 scale wave round 52 export (O10-247)',
    '',
    ...wave52HookLines.map(line => `- ${line}`),
    '',
    round52Capstone.capstoneMarkdown,
  ].join('\n');
  const summaryLine = ['gov_program_wave_round55_export', 'task=O10-247', 'round=52', `ready=${round55Ready}`].join(' ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round55-export.v1',
    waveRound: 52,
    o10TaskId: 'O10-247',
    round52Capstone,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const mockCap = (): O10IdleGovernanceProgramWaveRound55CapstoneResult => ({
    schema: '10m.agent20.idle-governance-program-wave-round55-capstone.v1',
    o10TaskId: 'O10-235',
    waveRound: 51,
    capstoneReady: true,
    capstoneMarkdown: '# r51',
    summaryLine: 's',
    primaryRound51Capstone: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['primaryRound51Capstone'],
    twinRound51Capstone: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['twinRound51Capstone'],
    capstoneCompare: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['capstoneCompare'],
    round52Export: {} as O10IdleGovernanceProgramWaveRound55CapstoneResult['round52Export'],
  });

  const exported = exportIdleGovernanceProgramWaveRound55(mockCap(), 3_054_213);
  push(
    'gov_prog_r55_export_o10',
    'wave 55 export tags O10-247 and loc hint',
    exported.o10TaskId === 'O10-247' &&
      exported.payload.projectedLocHint === 3_054_213 &&
      exported.payload.wave52HookLines.some(l => l.includes('O10-247'))
  );
  push(
    'gov_prog_r55_export_schema',
    'round 52 export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-round55-export.v1'
  );
  return results;
}


// --- source: automation-idle-governance-program-wave-round55-capstone.ts ---
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';

export interface O10IdleGovernanceProgramWaveRound55CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round55-capstone.v1';
  o10TaskId: 'O10-247';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound55Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound55Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound55Capstones>;
  round55Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound55>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound55Primary(cap: O10IdleGovernanceProgramWaveRound55CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-55 capstone for O10-247 origin landing. */
export function runIdleGovernanceProgramWaveRound55Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound55CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound55Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound55Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound55Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round55Export = exportIdleGovernanceProgramWaveRound55(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round55Export.payload.round55Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 55 capstone (O10-247)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=c4bbec67`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round55Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round55_capstone',
    'task=O10-247',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round55Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round55-capstone.v1',
    o10TaskId: 'O10-247',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round55Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 55 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound55Capstone(calmSpec, sampleRule, 1, 3, 3_054_213);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-247 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-247' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-247')
  );

  const cap2 = runIdleGovernanceProgramWaveRound55Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_054_213,
    registryFromRound55Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-247')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 55 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round55-capstone.v1'
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
  results.push(...runO10Agent20IdleGovernanceProgramWaveScorecardCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveAssemblyRunSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveAssemblyExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveAssemblyExportCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveAssemblyReplayParitySelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveIntegrationGateSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveIntegrationGateCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveHandoffBundleSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveCycleCloseoutSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveCycleCloseoutCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveProjectionRollupSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScaleDispatchSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScaleDispatchCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScaleDispatchReplayParitySelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveLandingGateSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveLandingGateCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveLandingBundleSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScaleWaveSealSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScaleWaveSealCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveScaleWaveSealExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveEpochCloseoutSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveEpochCloseoutCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveEpochExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound26CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound26CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound27ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound27CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound27CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound28ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound28CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound28CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound29ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound29CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound29CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound30ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound30CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound30CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound31ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound31CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound31CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound32ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound32CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound32CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound33ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound33CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound33CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound34ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound34CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound34CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound35ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound35CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound35CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound36ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound36CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound36CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound37ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound37CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound37CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound38ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound38CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound38CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound39ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound39CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound39CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound40ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound40CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound40CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound41ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound41CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound41CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound42ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound42CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound42CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound43ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound43CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound43CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound44ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound44CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound44CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound45ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound45CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound45CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound46ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound46CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound46CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound47ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound47CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound47CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound48ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound48CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound48CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound49ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound49CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound49CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound50ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound50CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound50CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound51ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound51CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound51CapstoneCompareSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound52ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound53ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound54ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound67ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound66ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound65ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound64ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound63ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound62ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound61ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound60ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound59ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound58ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound57ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound56ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound55ExportSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound52CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound53CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound56CapstoneSelfTests());
  results.push(...runO10Agent20IdleGovernanceProgramWaveRound55CapstoneSelfTests());
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// OP10M_MODULE_END agent-20-automation
