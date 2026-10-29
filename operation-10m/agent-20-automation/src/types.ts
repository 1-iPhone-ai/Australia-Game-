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
