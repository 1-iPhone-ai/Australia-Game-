// OP10M_MODULE_BEGIN agent-20-automation
// OP10M_MANIFEST_SHA256: 917a498cd73e120e51da55628a5b315d31d8f902f2bc39a40947c6a5c182abc9
// OP10M_MODULE_VERSION: 10m.1.2.0-agent20
// Agent 20 — idle / automation / autonomous ops (generated; source: operation-10m/agent-20-automation/src/)

// --- source: types.ts ---
/** Operation 10M Agent 20 — shared types (mirror V9.4 SECTION 20AN + HA2). */

export const O10_AGENT20_MODULE_VERSION = '10m.1.2.0-agent20';
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
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// OP10M_MODULE_END agent-20-automation
