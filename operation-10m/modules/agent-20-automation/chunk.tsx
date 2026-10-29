// OP10M_MODULE_BEGIN agent-20-automation
// Agent 20 — idle / automation / autonomous ops (generated; source: operation-10m/agent-20-automation/src/)

// --- source: types.ts ---
/** Operation 10M Agent 20 — shared types (mirror V9.4 SECTION 20AN + HA2). */

export const O10_AGENT20_MODULE_VERSION = '10m.1.0.0-agent20';
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
  settingsFlags: Record<string, boolean | undefined>;
}

const TRIGGER_TYPES: HumanAutomationTriggerType[] = [
  'turn_start',
  'day_start',
  'cash_below_threshold',
  'cash_above_threshold',
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
  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// OP10M_MODULE_END agent-20-automation
