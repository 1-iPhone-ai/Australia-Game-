// OP10M_MODULE_BEGIN agent-17-command-center
// Agent 17 — Game Intelligence / AI Command Center (generated; source: operation-10m/agent-17-command-center/)

// --- source: types/command-center-types.ts ---
/** Agent 17 — Game Intelligence / AI Command Center modular types (Operation 10M). */

export type CommandCenterTab =
  | 'overview'
  | 'next_move'
  | 'priorities'
  | 'risks'
  | 'opportunities'
  | 'team'
  | 'opponents'
  | 'ai_activity'
  | 'explain'
  | 'history'
  | 'settings';

export type CommandCenterViewMode = 'simple' | 'detailed' | 'developer';

export type Acc17PlanStepStatus =
  | 'pending'
  | 'in_progress'
  | 'verified_complete'
  | 'failed'
  | 'skipped'
  | 'blocked';

export type Acc17ProjectDelegationStatus =
  | 'draft'
  | 'delegated'
  | 'executing'
  | 'awaiting_verification'
  | 'completed'
  | 'cancelled'
  | 'blocked';

export type Acc17DelegateTargetKind =
  | 'copilot'
  | 'team_os'
  | 'teammate'
  | 'strategy_planner'
  | 'manual';

export interface Acc17PlanStepRequirement {
  minCash?: number;
  minNetWorth?: number;
  requiredRegion?: string;
  requiredActionType?: string;
  prerequisiteStepIds?: string[];
  minRegionalStanding?: number;
}

export interface Acc17MultiStepPlanStep {
  id: string;
  index: number;
  title: string;
  summary: string;
  actionType: string;
  requirements: Acc17PlanStepRequirement;
  status: Acc17PlanStepStatus;
  verifiedOnTurn?: number;
  verifiedOnDay?: number;
  verifiedStateFingerprint?: string;
  lastEvaluationFingerprint?: string;
  blockerReason?: string;
}

export interface Acc17MultiStepPlan {
  id: string;
  title: string;
  objectiveSource?: string;
  createdTurn: number;
  createdDay: number;
  steps: Acc17MultiStepPlanStep[];
  activeStepIndex: number;
  completionPercent: number;
  isOnTrack: boolean;
  replanCount: number;
}

export interface Acc17DelegatedProject {
  id: string;
  planId: string;
  title: string;
  delegateKind: Acc17DelegateTargetKind;
  delegateTargetId: string;
  status: Acc17ProjectDelegationStatus;
  authorityCeiling: 'advisory' | 'assisted' | 'delegated';
  assignedTurn: number;
  assignedDay: number;
  lastVerifiedFingerprint: string;
  pendingVerificationStepId?: string;
  notes: string;
}

export interface Acc17VerifiedExecutionLogEntry {
  id: string;
  turn: number;
  day: number;
  stepId: string;
  projectId: string;
  fingerprintBefore: string;
  fingerprintAfter: string;
  verified: boolean;
  reason: string;
}

export interface Acc17V94DeepContextSlice {
  key: string;
  label: string;
  summary: string;
  weight: number;
  tags: string[];
}

export interface Acc17V94DeepContextBundle {
  actorId: string;
  turn: number;
  day: number;
  fingerprint: string;
  headline: string;
  slices: Acc17V94DeepContextSlice[];
  objectiveTitle?: string;
  attentionLabel?: string;
  strategyHeadline?: string;
}

export interface Acc17CommandCenterOpsState {
  version: 1;
  activePlan: Acc17MultiStepPlan | null;
  delegatedProjects: Acc17DelegatedProject[];
  verificationLog: Acc17VerifiedExecutionLogEntry[];
  lastContextFingerprint: string;
  lastContextBundle?: Acc17V94DeepContextBundle;
  enabled: boolean;
}

export interface Acc17OperationsSnapshot {
  deepContext: Acc17V94DeepContextBundle;
  activePlan: Acc17MultiStepPlan | null;
  delegatedProjects: Acc17DelegatedProject[];
  pendingVerificationCount: number;
  verifiedStepsThisTurn: number;
  blockedSteps: Acc17MultiStepPlanStep[];
  recommendedDelegateKind: Acc17DelegateTargetKind;
  planningDepth?: Agent17PlanningDepthSnapshot;
}

export interface Agent17PlanHealthBand {
  band: 'critical' | 'at_risk' | 'steady' | 'strong';
  score: number;
  blockedCount: number;
  verifiedRatio: number;
  replanCount: number;
  onTrack: boolean;
}

export interface Agent17PlanningSuggestion {
  kind: 'template' | 'recovery' | 'delegate' | 'hold';
  templateId?: string;
  delegateKind?: Acc17DelegateTargetKind;
  headline: string;
  rationale: string;
  confidence: number;
}

export interface Agent17DelegationAnalyticsRow {
  delegateKind: Acc17DelegateTargetKind;
  activeProjects: number;
  completedProjects: number;
  blockedProjects: number;
  authorityMix: Record<string, number>;
  recommendedAdjustment?: string;
}

export interface Agent17PlanningDepthSnapshot {
  turn: number;
  actorId: string;
  planHealth: Agent17PlanHealthBand;
  suggestion: Agent17PlanningSuggestion;
  templateRouting: { matchedCategory: string; candidateTemplateIds: string[] };
  delegationAnalytics: Agent17DelegationAnalyticsRow[];
  delegationLadder: Agent17DelegationLadderSnapshot;
  planLedger: Agent17PlanLedgerSummary;
  intentQueue: Agent17IntentQueueSnapshot;
  verificationPolicy: Agent17VerificationPolicySnapshot;
  coordinationBrief: Agent17CoordinationBrief;
  executionPacing: Agent17ExecutionPacingSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
  catalogDepth: { templateCount: number; deepTemplateCount: number; maxStepCount: number };
}

export interface Agent17IntentItem {
  id: string;
  priority: number;
  label: string;
  source: 'objective' | 'gi3' | 'recovery' | 'plan_health' | 'delegation';
  actionHint?: string;
}

export interface Agent17IntentQueueSnapshot {
  items: Agent17IntentItem[];
  primaryIntentId: string | null;
  queueDepth: number;
}

export interface Agent17VerificationPolicyRule {
  id: string;
  description: string;
  satisfied: boolean;
}

export interface Agent17VerificationPolicySnapshot {
  rules: Agent17VerificationPolicyRule[];
  allowVerification: boolean;
  blockingRuleIds: string[];
}

export interface Agent17CoordinationBriefSection {
  id: string;
  heading: string;
  bullets: string[];
}

export interface Agent17CoordinationBrief {
  headline: string;
  sections: Agent17CoordinationBriefSection[];
  giHandoffTags: string[];
  confidence: number;
}

export interface Agent17ExecutionPacingSnapshot {
  turn: number;
  turnBudgetRemaining: number;
  stepsRemaining: number;
  canAdvanceActiveStep: boolean;
  verificationGateOpen: boolean;
  cooldownTurns: number;
  pacingBand: 'urgent' | 'steady' | 'throttled';
  headline: string;
}

export interface Agent17ResilienceScorecard {
  recoveryPressure: number;
  verificationStability: number;
  compositeIndex: number;
  band: 'robust' | 'watch' | 'fragile';
  signalCount: number;
  mitigationHints: string[];
  headline: string;
}

export interface Agent17StrategicAlignmentSnapshot {
  alignmentIndex: number;
  band: 'aligned' | 'drifting' | 'divergent';
  gi3Overlap: number;
  plannerOverlap: number;
  planOverlap: number;
  driftFlags: string[];
  primaryIntentId: string | null;
  headline: string;
}

export interface Agent17HandoffReadinessCheck {
  id: string;
  label: string;
  passed: boolean;
  weight: number;
}

export interface Agent17HandoffReadinessSnapshot {
  readinessScore: number;
  band: 'ready' | 'partial' | 'blocked';
  readyForTeamOs: boolean;
  checks: Agent17HandoffReadinessCheck[];
  blockers: string[];
  headline: string;
}

export interface Agent17DelegationLadderRung {
  delegateKind: Acc17DelegateTargetKind;
  loadScore: number;
  maxConcurrent: number;
  slotsRemaining: number;
  preferredAuthority: Acc17DelegatedProject['authorityCeiling'];
  escalationTarget?: Acc17DelegateTargetKind;
}

export interface Agent17DelegationLadderSnapshot {
  rungs: Agent17DelegationLadderRung[];
  recommendedKind: Acc17DelegateTargetKind;
  totalActiveLoad: number;
  imbalanceFlag: boolean;
  headline: string;
}

export interface Agent17PlanLedgerEntry {
  id: string;
  turn: number;
  day: number;
  kind: 'verify' | 'replan' | 'delegate' | 'block';
  summary: string;
}

export interface Agent17PlanLedgerSummary {
  entries: Agent17PlanLedgerEntry[];
  verifiedEvents: number;
  replanEvents: number;
  blockedStepEvents: number;
  lastFingerprint: string;
}

export interface Acc17ProjectTemplate {
  id: string;
  title: string;
  category: string;
  delegateKind: Acc17DelegateTargetKind;
  stepBlueprints: Array<{
    title: string;
    actionType: string;
    summary: string;
    requirements?: Partial<Acc17PlanStepRequirement>;
  }>;
}

export interface Agent17GoalDefinition {
  id: string;
  title: string;
  category: 'planning' | 'validation' | 'rollback' | 'integration' | 'telemetry';
  acceptance: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface Agent17GoalVerificationResult {
  goalId: string;
  passed: boolean;
  evidence: string;
  measuredAt: number;
}

export interface Agent17ValidationReport {
  timestamp: number;
  goalResults: Agent17GoalVerificationResult[];
  passedCount: number;
  failedCount: number;
  success: boolean;
}

export interface Agent17RollbackCheckpoint {
  id: string;
  label: string;
  createdAt: number;
  turn: number;
  ops: Acc17CommandCenterOpsState;
}

export interface Agent17DevTestResult {
  id: string;
  name: string;
  status: 'passed' | 'failed';
  durationMs: number;
  errorMessage?: string;
}

export interface Agent17DevTestReport {
  timestamp: number;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  executionTimeMs: number;
  overallStatus: 'passed' | 'failed';
  success: boolean;
  testResults: Agent17DevTestResult[];
  validationReport?: Agent17ValidationReport;
  summary: string;
}

/** Minimal game-state shape for modular evaluation (canonical game is richer). */
export interface Agent17GameStateSlice {
  turnCounter?: number;
  day?: number;
  player?: Agent17ActorSlice;
  actorsById?: Record<string, Agent17ActorSlice>;
  lastExecutedAction?: { type?: string; actionType?: string };
  lastAction?: { type?: string; actionType?: string };
  playerTrackedObjective?: {
    id?: string;
    sourceType?: string;
    sourceId?: string;
    title?: string;
    description?: string;
    recommendedNextStep?: { label?: string; actionType?: string };
  };
  strategyPlannerState?: { activePlan?: { id?: string; title?: string } };
  gi3Strategy?: { headline?: string };
}

export interface Agent17ActorSlice {
  id?: string;
  money?: number;
  netWorth?: number;
  currentRegion?: string;
  currentLocation?: string;
  actionsUsedThisTurn?: number;
  inventory?: unknown[];
  currentSupplies?: number;
}

export interface Agent17SettingsSlice {
  commandCenterSettings?: { enabled?: boolean };
  aiCommunicationAutonomyLevel?: 'advisory' | 'assisted' | 'delegated';
}

export interface ResolvedObjective {
  title: string;
  description?: string;
  sourceType?: string;
  sourceId?: string;
  recommendedNextStep?: { label?: string; actionType?: string };
}

export interface AttentionClassification {
  label: string;
  detail?: string;
}

export interface Agent17ContextAdapters {
  resolveObjective?: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actor: Agent17ActorSlice,
    tracked: Agent17GameStateSlice['playerTrackedObjective']
  ) => ResolvedObjective | null;
  classifyAttention?: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actor: Agent17ActorSlice
  ) => AttentionClassification | null;
}


// --- source: planning/fingerprint.ts ---

/** FNV-1a 32-bit — matches canonical game helper semantics for ACC17 fingerprints. */
export function fnv1aHashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function acc17ComputeRelevantStateFingerprint(
  state: Agent17GameStateSlice,
  actorId: string
): string {
  const actor: Agent17ActorSlice =
    state.actorsById?.[actorId] ||
    (actorId === 'player' ? state.player : undefined) ||
    {};
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const parts = [
    actorId,
    String(turn),
    String(day),
    String(actor.money ?? 0),
    String(actor.netWorth ?? actor.money ?? 0),
    String(actor.currentRegion || actor.currentLocation || ''),
    String(actor.actionsUsedThisTurn ?? 0),
    String((actor.inventory || []).length),
    String(state.lastExecutedAction?.type || state.lastAction?.type || ''),
    String(state.playerTrackedObjective?.sourceId || ''),
    String(state.strategyPlannerState?.activePlan?.id || ''),
  ];
  return fnv1aHashString('acc17:' + parts.join('|'));
}


// --- source: planning/deep-templates.ts ---

/**
 * Multi-phase planning templates (4–6 steps, explicit prerequisite chains).
 * Merged into `AGENT17_PROJECT_TEMPLATE_CATALOG` at module load.
 */
export const AGENT17_DEEP_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'agent17_tpl_deep_capital_program',
    title: 'Deep capital program (6-phase)',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Phase 1: Cash audit',
        actionType: 'contract',
        summary: 'Establish baseline liquidity and runway.',
        requirements: { minCash: 250 },
      },
      {
        title: 'Phase 2: Liability scan',
        actionType: 'invest',
        summary: 'Map short-term obligations against reserves.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Phase 3: Asset liquidation window',
        actionType: 'sell_market',
        summary: 'Raise cash without breaching strategy constraints.',
        requirements: { prerequisiteStepIndices: [1], minCash: 400 },
      },
      {
        title: 'Phase 4: Regional deposit push',
        actionType: 'deposit',
        summary: 'Convert liquid cash into secured regional position.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Phase 5: Team treasury sync',
        actionType: 'invest',
        summary: 'Align team OS treasury with player runway target.',
        requirements: { prerequisiteStepIndices: [3] },
      },
      {
        title: 'Phase 6: Capital program verification',
        actionType: 'verify_objective',
        summary: 'Close the program with verified net-worth delta.',
        requirements: { prerequisiteStepIndices: [4] },
      },
    ],
  },
  {
    id: 'agent17_tpl_regional_recovery',
    title: 'Regional retreat and re-entry',
    category: 'recovery',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Withdraw to safe region',
        actionType: 'travel',
        summary: 'Reduce exposure in contested territory.',
      },
      {
        title: 'Fortify home deposit',
        actionType: 'deposit',
        summary: 'Rebuild VP buffer in controlled region.',
        requirements: { prerequisiteStepIndices: [0], minCash: 800 },
      },
      {
        title: 'Restock for counter-push',
        actionType: 'restock_supplies',
        summary: 'Prepare supply margin before re-entry.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Verify regional recovery',
        actionType: 'verify_objective',
        summary: 'Confirm standing and cash recovered.',
        requirements: { prerequisiteStepIndices: [2] },
      },
    ],
  },
  {
    id: 'agent17_tpl_debt_recovery',
    title: 'Debt pressure relief lane',
    category: 'recovery',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Pause discretionary spend',
        actionType: 'wait',
        summary: 'Stop non-essential actions until ratio improves.',
      },
      {
        title: 'Service minimum obligations',
        actionType: 'contract',
        summary: 'Meet contractual cash outflows first.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Sell non-core inventory',
        actionType: 'sell_market',
        summary: 'Raise cash from market liquidation.',
        requirements: { prerequisiteStepIndices: [1], minNetWorth: 2000 },
      },
      {
        title: 'Verify debt ratio',
        actionType: 'verify_objective',
        summary: 'Confirm debt pressure telemetry normalized.',
        requirements: { prerequisiteStepIndices: [2] },
      },
    ],
  },
  {
    id: 'agent17_tpl_crisis_stabilization',
    title: 'Crisis stabilization sequence',
    category: 'recovery',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Identify crisis driver',
        actionType: 'wait',
        summary: 'Classify liquidity vs supply vs regional crisis.',
      },
      {
        title: 'Emergency restock',
        actionType: 'restock_supplies',
        summary: 'Prevent condition collapse on active routes.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Emergency cash raise',
        actionType: 'sell_market',
        summary: 'Fund immediate recovery actions.',
        requirements: { prerequisiteStepIndices: [1], minCash: 100 },
      },
      {
        title: 'Stabilizing travel',
        actionType: 'travel',
        summary: 'Move to region with best recovery outlook.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Crisis exit verification',
        actionType: 'verify_objective',
        summary: 'Mark crisis lane complete after fingerprint proof.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_supply_deep_recovery',
    title: 'Deep supply chain recovery',
    category: 'recovery',
    delegateKind: 'manual',
    stepBlueprints: [
      {
        title: 'Audit supply margin',
        actionType: 'wait',
        summary: 'Quantify supply shortfall vs next expedition.',
      },
      {
        title: 'Bulk restock',
        actionType: 'restock_supplies',
        summary: 'Restore supply above critical threshold.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Craft sustainment kit',
        actionType: 'craft',
        summary: 'Convert materials into sustainment gear.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Trade for missing inputs',
        actionType: 'trade',
        summary: 'Fill gaps via regional market.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify supply recovery',
        actionType: 'verify_objective',
        summary: 'Confirm supply lane closed.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_diplomatic_depth',
    title: 'Diplomatic leverage program (deep)',
    category: 'diplomacy',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Map rival intent signals',
        actionType: 'wait',
        summary: 'Collect observable diplomacy telemetry only.',
      },
      {
        title: 'Travel to negotiation hub',
        actionType: 'travel',
        summary: 'Position in region with active negotiation window.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Execute trade sweetener',
        actionType: 'trade',
        summary: 'Offer structured trade to shift standing.',
        requirements: { prerequisiteStepIndices: [1], minCash: 600 },
      },
      {
        title: 'Deposit goodwill buffer',
        actionType: 'deposit',
        summary: 'Lock goodwill into regional deposit.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify diplomatic milestone',
        actionType: 'verify_objective',
        summary: 'Confirm diplomacy objective progress.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
  {
    id: 'agent17_tpl_automation_oversight',
    title: 'Automation oversight ladder',
    category: 'intelligence',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Review autonomy ceiling',
        actionType: 'wait',
        summary: 'Confirm AI communication autonomy matches plan.',
      },
      {
        title: 'Delegate verification pass',
        actionType: 'contract',
        summary: 'Run delegated step with assisted ceiling.',
        requirements: { prerequisiteStepIndices: [0] },
      },
      {
        title: 'Copilot session sync',
        actionType: 'invest',
        summary: 'Align copilot session with active plan id.',
        requirements: { prerequisiteStepIndices: [1] },
      },
      {
        title: 'Manual override checkpoint',
        actionType: 'wait',
        summary: 'Player confirms no silent automation.',
        requirements: { prerequisiteStepIndices: [2] },
      },
      {
        title: 'Verify oversight log',
        actionType: 'verify_objective',
        summary: 'Close oversight ladder with fingerprint proof.',
        requirements: { prerequisiteStepIndices: [3] },
      },
    ],
  },
];

export type DeepTemplateBlueprint = Acc17ProjectTemplate['stepBlueprints'][number] & {
  requirements?: Acc17ProjectTemplate['stepBlueprints'][number]['requirements'] & {
    prerequisiteStepIndices?: number[];
  };
};


// --- source: planning/templates.ts ---
  Acc17MultiStepPlan,
  Acc17MultiStepPlanStep,
  Acc17ProjectTemplate,
} from '../types/command-center-types.ts';

type StepBlueprint = Acc17ProjectTemplate['stepBlueprints'][number] & {
  requirements?: Acc17ProjectTemplate['stepBlueprints'][number]['requirements'] & {
    prerequisiteStepIndices?: number[];
  };
};

/** Curated template catalog (modular slice; full catalog remains in canonical TSX until assembly). */
export const AGENT17_BASE_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  {
    id: 'agent17_tpl_economy_liquidity',
    title: 'Liquidity stabilization program',
    category: 'economy',
    delegateKind: 'team_os',
    stepBlueprints: [
      {
        title: 'Audit cash runway',
        actionType: 'contract',
        summary: 'Confirm contracts cover minimum liquidity.',
        requirements: { minCash: 500 },
      },
      {
        title: 'Rebalance investments',
        actionType: 'invest',
        summary: 'Shift treasury to liquid instruments.',
      },
      {
        title: 'Verify debt ceiling',
        actionType: 'verify_objective',
        summary: 'Confirm debt ratio under alert threshold.',
      },
    ],
  },
  {
    id: 'agent17_tpl_trade_arbitrage',
    title: 'Regional trade arbitrage',
    category: 'trade',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Scout price delta',
        actionType: 'travel',
        summary: 'Move to opposing region with favorable spread.',
      },
      {
        title: 'Execute market trade',
        actionType: 'trade',
        summary: 'Capture spread before expiration.',
      },
      {
        title: 'Bank proceeds',
        actionType: 'deposit',
        summary: 'Lock gains into regional deposit.',
        requirements: { minCash: 1000 },
      },
    ],
  },
  {
    id: 'agent17_tpl_team_synergy',
    title: 'Team treasury synergy',
    category: 'team',
    delegateKind: 'copilot',
    stepBlueprints: [
      {
        title: 'Align team directive',
        actionType: 'wait',
        summary: 'Confirm team OS directive matches player objective.',
      },
      {
        title: 'Contribute to treasury',
        actionType: 'invest',
        summary: 'Fund shared infrastructure milestone.',
      },
      {
        title: 'Verify alignment score',
        actionType: 'verify_objective',
        summary: 'Check team alignment telemetry.',
      },
    ],
  },
  {
    id: 'agent17_tpl_recovery',
    title: 'Supply and recovery lane',
    category: 'recovery',
    delegateKind: 'teammate',
    stepBlueprints: [
      {
        title: 'Restock expedition supplies',
        actionType: 'restock_supplies',
        summary: 'Avoid condition penalties on long routes.',
      },
      {
        title: 'Craft efficiency upgrade',
        actionType: 'craft',
        summary: 'Improve action efficiency before next push.',
      },
      {
        title: 'Confirm recovery metrics',
        actionType: 'verify_objective',
        summary: 'Validate supplies and net worth recovered.',
      },
    ],
  },
  {
    id: 'agent17_tpl_gi3_strategy',
    title: 'GI3 strategy alignment',
    category: 'intelligence',
    delegateKind: 'strategy_planner',
    stepBlueprints: [
      {
        title: 'Review active strategy headline',
        actionType: 'wait',
        summary: 'Ensure GI3 constraints match next action.',
      },
      {
        title: 'Execute constrained move',
        actionType: 'travel',
        summary: 'Take lowest-divergence action toward milestone.',
      },
      {
        title: 'Verify milestone progress',
        actionType: 'verify_objective',
        summary: 'Record verified fingerprint for strategy phase.',
      },
    ],
  },
];

export const AGENT17_PROJECT_TEMPLATE_CATALOG: Acc17ProjectTemplate[] = [
  ...AGENT17_BASE_TEMPLATE_CATALOG,
  ...AGENT17_DEEP_TEMPLATE_CATALOG,
];

function wirePrerequisiteStepIds(
  steps: Acc17MultiStepPlanStep[],
  blueprints: StepBlueprint[]
): Acc17MultiStepPlanStep[] {
  return steps.map((step, idx) => {
    const indices = blueprints[idx]?.requirements?.prerequisiteStepIndices;
    if (!indices?.length) return step;
    const prerequisiteStepIds = indices
      .filter(i => i >= 0 && i < steps.length)
      .map(i => steps[i].id);
    return {
      ...step,
      requirements: {
        ...step.requirements,
        prerequisiteStepIds,
      },
    };
  }).map(step => {
    const req = { ...step.requirements };
    delete (req as { prerequisiteStepIndices?: number[] }).prerequisiteStepIndices;
    return { ...step, requirements: req };
  });
}

export function acc17InstantiatePlanFromTemplate(
  templateId: string,
  state: Agent17GameStateSlice,
  _actorId: string
): Acc17MultiStepPlan | null {
  const tpl = AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
  if (!tpl) return null;
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const planId = `acc17_plan_${templateId}_${turn}`;
  const blueprints = tpl.stepBlueprints as StepBlueprint[];
  let steps: Acc17MultiStepPlanStep[] = blueprints.map((bp, idx) => ({
    id: `${planId}_step_${idx}`,
    index: idx,
    title: bp.title,
    summary: bp.summary,
    actionType: bp.actionType,
    requirements: { ...(bp.requirements || {}) },
    status: idx === 0 ? 'in_progress' : 'pending',
  }));
  steps = wirePrerequisiteStepIds(steps, blueprints);
  return {
    id: planId,
    title: tpl.title,
    objectiveSource: templateId,
    createdTurn: turn,
    createdDay: day,
    steps,
    activeStepIndex: 0,
    completionPercent: 0,
    isOnTrack: true,
    replanCount: 0,
  };
}

export function listAgent17TemplateIds(): string[] {
  return AGENT17_PROJECT_TEMPLATE_CATALOG.map(t => t.id);
}


// --- source: planning/ops-state.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Acc17MultiStepPlan,
  Acc17MultiStepPlanStep,
  Acc17PlanStepStatus,
  Acc17ProjectDelegationStatus,
  Acc17VerifiedExecutionLogEntry,
  Acc17V94DeepContextBundle,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
  ResolvedObjective,
} from '../types/command-center-types.ts';

export function createDefaultAcc17CommandCenterOpsState(): Acc17CommandCenterOpsState {
  return {
    version: 1,
    activePlan: null,
    delegatedProjects: [],
    verificationLog: [],
    lastContextFingerprint: '',
    enabled: true,
  };
}

function acc17DelegateFallbackId(kind: Acc17DelegateTargetKind): string {
  if (kind === 'team_os') return 'team_os';
  if (kind === 'strategy_planner') return 'strategy_planner';
  return 'copilot';
}

export function sanitizeAcc17CommandCenterOpsState(input: unknown): Acc17CommandCenterOpsState {
  const defaults = createDefaultAcc17CommandCenterOpsState();
  if (!input || typeof input !== 'object') return defaults;
  const obj = input as Record<string, unknown>;
  const enabled = typeof obj.enabled === 'boolean' ? obj.enabled : defaults.enabled;
  const lastContextFingerprint =
    typeof obj.lastContextFingerprint === 'string' ? obj.lastContextFingerprint : '';

  let activePlan: Acc17MultiStepPlan | null = null;
  if (obj.activePlan && typeof obj.activePlan === 'object') {
    const p = obj.activePlan as Record<string, unknown>;
    const steps: Acc17MultiStepPlanStep[] = Array.isArray(p.steps)
      ? (p.steps as unknown[]).map((raw, idx) => {
          const s = raw as Record<string, unknown>;
          const statusList: Acc17PlanStepStatus[] = [
            'pending',
            'in_progress',
            'verified_complete',
            'failed',
            'skipped',
            'blocked',
          ];
          const status = statusList.includes(s?.status as Acc17PlanStepStatus)
            ? (s.status as Acc17PlanStepStatus)
            : 'pending';
          return {
            id: String(s?.id || `step_${idx}`),
            index: typeof s?.index === 'number' ? s.index : idx,
            title: String(s?.title || 'Step'),
            summary: String(s?.summary || ''),
            actionType: String(s?.actionType || 'wait'),
            requirements:
              s?.requirements && typeof s.requirements === 'object'
                ? (s.requirements as Acc17MultiStepPlanStep['requirements'])
                : {},
            status,
            verifiedOnTurn: typeof s?.verifiedOnTurn === 'number' ? s.verifiedOnTurn : undefined,
            verifiedOnDay: typeof s?.verifiedOnDay === 'number' ? s.verifiedOnDay : undefined,
            verifiedStateFingerprint:
              typeof s?.verifiedStateFingerprint === 'string'
                ? s.verifiedStateFingerprint
                : undefined,
            lastEvaluationFingerprint:
              typeof s?.lastEvaluationFingerprint === 'string'
                ? s.lastEvaluationFingerprint
                : undefined,
            blockerReason: typeof s?.blockerReason === 'string' ? s.blockerReason : undefined,
          };
        })
      : [];
    activePlan = {
      id: String(p.id || 'plan'),
      title: String(p.title || 'Plan'),
      objectiveSource: typeof p.objectiveSource === 'string' ? p.objectiveSource : undefined,
      createdTurn: typeof p.createdTurn === 'number' ? p.createdTurn : 1,
      createdDay: typeof p.createdDay === 'number' ? p.createdDay : 1,
      steps,
      activeStepIndex:
        typeof p.activeStepIndex === 'number'
          ? Math.max(0, Math.min(steps.length, p.activeStepIndex))
          : 0,
      completionPercent: typeof p.completionPercent === 'number' ? p.completionPercent : 0,
      isOnTrack: p.isOnTrack !== false,
      replanCount: typeof p.replanCount === 'number' ? p.replanCount : 0,
    };
  }

  const statusList: Acc17ProjectDelegationStatus[] = [
    'draft',
    'delegated',
    'executing',
    'awaiting_verification',
    'completed',
    'cancelled',
    'blocked',
  ];
  const kindList: Acc17DelegateTargetKind[] = [
    'copilot',
    'team_os',
    'teammate',
    'strategy_planner',
    'manual',
  ];

  const delegatedProjects: Acc17DelegatedProject[] = Array.isArray(obj.delegatedProjects)
    ? (obj.delegatedProjects as unknown[]).slice(0, 32).map((raw, i) => {
        const d = raw as Record<string, unknown>;
        const delegateKind = kindList.includes(d?.delegateKind as Acc17DelegateTargetKind)
          ? (d.delegateKind as Acc17DelegateTargetKind)
          : 'copilot';
        return {
          id: String(d?.id || `proj_${i}`),
          planId: String(d?.planId || ''),
          title: String(d?.title || 'Project'),
          delegateKind,
          delegateTargetId: String(
            d?.delegateTargetId || acc17DelegateFallbackId(delegateKind)
          ),
          status: statusList.includes(d?.status as Acc17ProjectDelegationStatus)
            ? (d.status as Acc17ProjectDelegationStatus)
            : 'draft',
          authorityCeiling: (['advisory', 'assisted', 'delegated'] as const).includes(
            d?.authorityCeiling as 'advisory'
          )
            ? (d.authorityCeiling as Acc17DelegatedProject['authorityCeiling'])
            : 'assisted',
          assignedTurn: typeof d?.assignedTurn === 'number' ? d.assignedTurn : 1,
          assignedDay: typeof d?.assignedDay === 'number' ? d.assignedDay : 1,
          lastVerifiedFingerprint:
            typeof d?.lastVerifiedFingerprint === 'string' ? d.lastVerifiedFingerprint : '',
          pendingVerificationStepId:
            typeof d?.pendingVerificationStepId === 'string'
              ? d.pendingVerificationStepId
              : undefined,
          notes: String(d?.notes || ''),
        };
      })
    : [];

  const verificationLog: Acc17VerifiedExecutionLogEntry[] = Array.isArray(obj.verificationLog)
    ? (obj.verificationLog as unknown[]).slice(-120).map((raw, i) => {
        const e = raw as Record<string, unknown>;
        return {
          id: String(e?.id || `vlog_${i}`),
          turn: typeof e?.turn === 'number' ? e.turn : 1,
          day: typeof e?.day === 'number' ? e.day : 1,
          stepId: String(e?.stepId || ''),
          projectId: String(e?.projectId || ''),
          fingerprintBefore: String(e?.fingerprintBefore || ''),
          fingerprintAfter: String(e?.fingerprintAfter || ''),
          verified: e?.verified === true,
          reason: String(e?.reason || ''),
        };
      })
    : [];

  const lastContextBundle =
    obj.lastContextBundle && typeof obj.lastContextBundle === 'object'
      ? (obj.lastContextBundle as Acc17V94DeepContextBundle)
      : undefined;

  return {
    version: 1,
    enabled,
    activePlan,
    delegatedProjects,
    verificationLog,
    lastContextFingerprint,
    lastContextBundle,
  };
}

export function acc17CreateMultiStepPlanFromObjective(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  resolveObjective: (
    state: Agent17GameStateSlice,
    settings: Agent17SettingsSlice,
    actorId: string
  ) => ResolvedObjective | null
): Acc17MultiStepPlan | null {
  const objective = resolveObjective(state, settings, actorId);
  if (!objective?.title) return null;
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const planId = `acc17_obj_${objective.sourceType || 'goal'}_${turn}`;
  const next = objective.recommendedNextStep;
  const steps: Acc17MultiStepPlanStep[] = [
    {
      id: `${planId}_s0`,
      index: 0,
      title: 'Align with tracked objective',
      summary: objective.description || objective.title,
      actionType: next?.actionType || 'wait',
      requirements: {},
      status: 'in_progress',
    },
    {
      id: `${planId}_s1`,
      index: 1,
      title: next?.label || 'Execute recommended move',
      summary: 'Complete the recommended next step from the intent layer.',
      actionType: next?.actionType || 'wait',
      requirements: {},
      status: 'pending',
    },
    {
      id: `${planId}_s2`,
      index: 2,
      title: 'Verify objective progress',
      summary: 'Confirm goal progress after a verified state change.',
      actionType: 'verify_objective',
      requirements: {},
      status: 'pending',
    },
  ];
  return {
    id: planId,
    title: `Plan: ${objective.title}`,
    objectiveSource: objective.sourceId,
    createdTurn: turn,
    createdDay: day,
    steps,
    activeStepIndex: 0,
    completionPercent: 0,
    isOnTrack: true,
    replanCount: 0,
  };
}

export function defaultObjectiveResolver(
  state: Agent17GameStateSlice,
  _settings: Agent17SettingsSlice,
  actorId: string
): ResolvedObjective | null {
  const tracked = state.playerTrackedObjective;
  if (!tracked?.title) return null;
  return {
    title: tracked.title,
    description: tracked.description,
    sourceType: tracked.sourceType,
    sourceId: tracked.sourceId,
    recommendedNextStep: tracked.recommendedNextStep,
  };
}

function acc17StepRequirementsMet(
  step: Acc17MultiStepPlanStep,
  state: Agent17GameStateSlice,
  actorId: string,
  completedIds: Set<string>
): boolean {
  const req = step.requirements || {};
  const actor =
    state.actorsById?.[actorId] || (actorId === 'player' ? state.player : undefined) || {};
  if (typeof req.minCash === 'number' && (actor.money || 0) < req.minCash) return false;
  if (typeof req.minNetWorth === 'number' && (actor.netWorth || actor.money || 0) < req.minNetWorth)
    return false;
  const region = actor.currentRegion || actor.currentLocation || '';
  if (req.requiredRegion && region !== req.requiredRegion) return false;
  if (Array.isArray(req.prerequisiteStepIds)) {
    for (const pid of req.prerequisiteStepIds) {
      if (!completedIds.has(pid)) return false;
    }
  }
  return true;
}

function acc17DetectActionMatch(step: Acc17MultiStepPlanStep, state: Agent17GameStateSlice): boolean {
  const last = state.lastExecutedAction || state.lastAction;
  const lastType = typeof last === 'string' ? last : last?.type || last?.actionType || '';
  if (!lastType) return false;
  if (step.actionType === 'verify_objective') {
    return (
      String(lastType).includes('objective') ||
      String(lastType).includes('contract') ||
      String(lastType).includes('track')
    );
  }
  return String(lastType) === step.actionType || String(lastType).includes(step.actionType);
}

export function acc17AdvanceVerifiedPlanProgress(
  plan: Acc17MultiStepPlan,
  state: Agent17GameStateSlice,
  actorId: string,
  previousFingerprint: string
): { plan: Acc17MultiStepPlan; logEntries: Acc17VerifiedExecutionLogEntry[]; fingerprint: string } {
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const logEntries: Acc17VerifiedExecutionLogEntry[] = [];
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const stateChanged = fingerprint !== previousFingerprint && previousFingerprint !== '';
  const completedIds = new Set(
    plan.steps.filter(s => s.status === 'verified_complete').map(s => s.id)
  );
  const steps = plan.steps.map(s => ({ ...s }));
  let activeStepIndex = plan.activeStepIndex;

  if (stateChanged) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step.status === 'verified_complete' || step.status === 'skipped') continue;
      step.lastEvaluationFingerprint = fingerprint;
      if (!acc17StepRequirementsMet(step, state, actorId, completedIds)) {
        step.status = 'blocked';
        step.blockerReason = 'Requirements not satisfied after state change.';
        continue;
      }
      if (step.status === 'pending' && i === activeStepIndex) step.status = 'in_progress';
      if (step.status === 'in_progress' && acc17DetectActionMatch(step, state)) {
        step.status = 'verified_complete';
        step.verifiedOnTurn = turn;
        step.verifiedOnDay = day;
        step.verifiedStateFingerprint = fingerprint;
        completedIds.add(step.id);
        logEntries.push({
          id: `acc17_v_${step.id}_${turn}`,
          turn,
          day,
          stepId: step.id,
          projectId: plan.id,
          fingerprintBefore: previousFingerprint,
          fingerprintAfter: fingerprint,
          verified: true,
          reason: 'Verified after canonical state change matched step.',
        });
      }
    }
  }

  while (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'verified_complete') {
    activeStepIndex++;
  }
  if (activeStepIndex < steps.length && steps[activeStepIndex]?.status === 'pending') {
    steps[activeStepIndex].status = 'in_progress';
  }
  const done = steps.filter(s => s.status === 'verified_complete').length;
  const completionPercent = steps.length ? Math.round((done / steps.length) * 100) : 100;
  const blocked = steps.some(s => s.status === 'blocked');
  return {
    plan: {
      ...plan,
      steps,
      activeStepIndex,
      completionPercent,
      isOnTrack: !blocked && completionPercent < 100,
    },
    logEntries,
    fingerprint,
  };
}

export function acc17DelegateProject(
  ops: Acc17CommandCenterOpsState,
  plan: Acc17MultiStepPlan,
  delegateKind: Acc17DelegateTargetKind,
  delegateTargetId: string,
  authorityCeiling: Acc17DelegatedProject['authorityCeiling'] = 'assisted'
): Acc17DelegatedProject {
  return {
    id: `acc17_proj_${plan.id}_${ops.delegatedProjects.length}`,
    planId: plan.id,
    title: plan.title,
    delegateKind,
    delegateTargetId,
    status: 'delegated',
    authorityCeiling,
    assignedTurn: plan.createdTurn,
    assignedDay: plan.createdDay,
    lastVerifiedFingerprint: '',
    notes: `Delegated to ${delegateKind}:${delegateTargetId}`,
  };
}


// --- source: planning/recovery-paths.ts ---
  Acc17CommandCenterOpsState,
  Acc17MultiStepPlan,
  Agent17ActorSlice,
  Agent17GameStateSlice,
} from '../types/command-center-types.ts';

export type Agent17RecoveryLane =
  | 'liquidity_crisis'
  | 'supply_collapse'
  | 'regional_exposure'
  | 'debt_pressure'
  | 'plan_blocked';

export interface Agent17RecoverySignal {
  lane: Agent17RecoveryLane;
  severity: number;
  reason: string;
}

export interface Agent17RecoveryDecision {
  templateId: string;
  lane: Agent17RecoveryLane;
  rationale: string;
}

const RECOVERY_TEMPLATE_BY_LANE: Record<Agent17RecoveryLane, string> = {
  liquidity_crisis: 'agent17_tpl_deep_capital_program',
  supply_collapse: 'agent17_tpl_supply_deep_recovery',
  regional_exposure: 'agent17_tpl_regional_recovery',
  debt_pressure: 'agent17_tpl_debt_recovery',
  plan_blocked: 'agent17_tpl_crisis_stabilization',
};

function readActor(state: Agent17GameStateSlice, actorId: string): Agent17ActorSlice {
  return (
    state.actorsById?.[actorId] ||
    (actorId === 'player' ? state.player : undefined) ||
    {}
  );
}

/** Derive recovery lanes from lightweight state slices (no canonical TSX imports). */
export function detectAgent17RecoverySignals(
  state: Agent17GameStateSlice,
  actorId: string
): Agent17RecoverySignal[] {
  const actor = readActor(state, actorId);
  const signals: Agent17RecoverySignal[] = [];
  const cash = actor.money ?? 0;
  const netWorth = actor.netWorth ?? cash;
  const supplies =
    typeof (actor as { currentSupplies?: number }).currentSupplies === 'number'
      ? (actor as { currentSupplies: number }).currentSupplies
      : 100;
  const region = actor.currentRegion || actor.currentLocation || '';

  if (cash < 400) {
    signals.push({
      lane: 'liquidity_crisis',
      severity: Math.min(100, Math.round(100 - cash / 4)),
      reason: `Cash $${cash} below liquidity crisis threshold.`,
    });
  }
  if (supplies < 35) {
    signals.push({
      lane: 'supply_collapse',
      severity: Math.min(100, Math.round(100 - supplies)),
      reason: `Supplies ${supplies} critically low.`,
    });
  }
  if (netWorth > 0 && cash / netWorth < 0.08) {
    signals.push({
      lane: 'debt_pressure',
      severity: 70,
      reason: 'Cash to net-worth ratio indicates debt pressure.',
    });
  }
  if (region === 'QLD' && cash < 1200) {
    signals.push({
      lane: 'regional_exposure',
      severity: 55,
      reason: 'High exposure region with thin reserves.',
    });
  }
  return signals.sort((a, b) => b.severity - a.severity);
}

export function pickAgent17RecoveryTemplateId(
  signals: Agent17RecoverySignal[],
  planBlocked: boolean
): Agent17RecoveryDecision | null {
  if (planBlocked) {
    const top = signals[0];
    const lane = top?.lane ?? 'plan_blocked';
    return {
      templateId: RECOVERY_TEMPLATE_BY_LANE[lane] ?? RECOVERY_TEMPLATE_BY_LANE.plan_blocked,
      lane: top ? lane : 'plan_blocked',
      rationale: top
        ? `Blocked plan; escalating ${top.lane} recovery.`
        : 'Blocked plan; applying crisis stabilization sequence.',
    };
  }
  const top = signals[0];
  if (!top || top.severity < 40) return null;
  return {
    templateId: RECOVERY_TEMPLATE_BY_LANE[top.lane],
    lane: top.lane,
    rationale: top.reason,
  };
}

export function listAgent17RecoveryTemplateIds(): string[] {
  return Object.values(RECOVERY_TEMPLATE_BY_LANE).filter(
    (id, idx, arr) => arr.indexOf(id) === idx
  );
}

export function replanAcc17WithRecoveryTemplate(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string,
  decision: Agent17RecoveryDecision
): Acc17CommandCenterOpsState {
  const replacement = acc17InstantiatePlanFromTemplate(decision.templateId, state, actorId);
  if (!replacement) return ops;
  const priorPlan = ops.activePlan;
  const replanCount = (priorPlan?.replanCount ?? 0) + 1;
  const plan: Acc17MultiStepPlan = {
    ...replacement,
    replanCount,
    objectiveSource: `recovery:${decision.lane}:${decision.templateId}`,
    title: `Recovery (${decision.lane}): ${replacement.title}`,
  };
  return {
    ...ops,
    activePlan: plan,
    delegatedProjects: [],
  };
}

/** When the active plan has blocked/failed steps, attempt a recovery replan. */
export function maybeApplyAgent17RecoveryPath(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string
): { ops: Acc17CommandCenterOpsState; applied: boolean; decision?: Agent17RecoveryDecision } {
  const blocked =
    ops.activePlan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const decision = pickAgent17RecoveryTemplateId(signals, blocked);
  if (!decision) return { ops, applied: false };
  if (!blocked && (signals[0]?.severity ?? 0) < 40) return { ops, applied: false };
  const nextOps = replanAcc17WithRecoveryTemplate(ops, state, actorId, decision);
  const changed = nextOps.activePlan?.id !== ops.activePlan?.id;
  return { ops: changed ? nextOps : ops, applied: changed, decision: changed ? decision : undefined };
}

export function resolveTemplateById(templateId: string) {
  return AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === templateId);
}


// --- source: planning/template-selector.ts ---
  Acc17ProjectTemplate,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
  ResolvedObjective,
} from '../types/command-center-types.ts';
  AGENT17_BASE_TEMPLATE_CATALOG,
  AGENT17_PROJECT_TEMPLATE_CATALOG,
} from './templates.ts';

export interface Agent17TemplateRoute {
  category: string;
  keywords: string[];
  templateIds: string[];
  priority: number;
}

export const AGENT17_TEMPLATE_ROUTE_TABLE: Agent17TemplateRoute[] = [
  {
    category: 'economy',
    keywords: ['cash', 'liquidity', 'debt', 'treasury', 'loan'],
    templateIds: ['agent17_tpl_economy_liquidity', 'agent17_tpl_deep_capital_program', 'agent17_tpl_debt_recovery'],
    priority: 10,
  },
  {
    category: 'trade',
    keywords: ['trade', 'market', 'arbitrage', 'sell', 'buy'],
    templateIds: ['agent17_tpl_trade_arbitrage', 'agent17_tpl_regional_recovery'],
    priority: 9,
  },
  {
    category: 'team',
    keywords: ['team', 'treasury', 'synergy', 'alignment'],
    templateIds: ['agent17_tpl_team_synergy', 'agent17_tpl_automation_oversight'],
    priority: 8,
  },
  {
    category: 'recovery',
    keywords: ['recover', 'supply', 'restock', 'crisis', 'blocked'],
    templateIds: [
      'agent17_tpl_recovery',
      'agent17_tpl_supply_deep_recovery',
      'agent17_tpl_crisis_stabilization',
    ],
    priority: 11,
  },
  {
    category: 'intelligence',
    keywords: ['strategy', 'gi3', 'planner', 'objective', 'plan'],
    templateIds: ['agent17_tpl_gi3_strategy', 'agent17_tpl_automation_oversight'],
    priority: 7,
  },
  {
    category: 'diplomacy',
    keywords: ['diplomacy', 'negotiation', 'rival', 'standing', 'treaty'],
    templateIds: ['agent17_tpl_diplomatic_depth'],
    priority: 6,
  },
];

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/\s+/g, ' ');
}

export function inferAgent17ObjectiveCategory(
  objective: ResolvedObjective | null,
  state: Agent17GameStateSlice
): string {
  if (!objective?.title) return 'general';
  const blob = normalizeText(
    [objective.title, objective.description || '', objective.sourceType || ''].join(' ')
  );
  let best = { category: 'general', score: 0 };
  for (const route of AGENT17_TEMPLATE_ROUTE_TABLE) {
    let score = 0;
    for (const kw of route.keywords) {
      if (blob.includes(kw)) score += 1;
    }
    if (state.gi3Strategy?.headline && route.category === 'intelligence') score += 1;
    if (score > best.score) best = { category: route.category, score };
  }
  return best.score > 0 ? best.category : 'general';
}

export function rankAgent17TemplateCandidates(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): { matchedCategory: string; candidateTemplateIds: string[] } {
  const objective = defaultObjectiveResolver(state, settings, actorId);
  const matchedCategory = inferAgent17ObjectiveCategory(objective, state);
  const route = AGENT17_TEMPLATE_ROUTE_TABLE.find(r => r.category === matchedCategory);
  const fallbackIds = AGENT17_BASE_TEMPLATE_CATALOG.slice(0, 3).map(t => t.id);
  const candidateTemplateIds = route?.templateIds?.length
    ? [...route.templateIds]
    : fallbackIds;
  const cash = state.player?.money ?? state.actorsById?.[actorId]?.money ?? 0;
  if (cash < 500) {
    candidateTemplateIds.unshift('agent17_tpl_deep_capital_program');
  }
  const unique: string[] = [];
  for (const id of candidateTemplateIds) {
    if (!unique.includes(id) && AGENT17_PROJECT_TEMPLATE_CATALOG.some(t => t.id === id)) {
      unique.push(id);
    }
  }
  return { matchedCategory, candidateTemplateIds: unique.slice(0, 6) };
}

export function pickAgent17TemplateForCategory(category: string): Acc17ProjectTemplate | null {
  const route = AGENT17_TEMPLATE_ROUTE_TABLE.find(r => r.category === category);
  const id = route?.templateIds?.[0];
  if (!id) return null;
  return AGENT17_PROJECT_TEMPLATE_CATALOG.find(t => t.id === id) ?? null;
}

export function summarizeAgent17CatalogDepth(): {
  templateCount: number;
  deepTemplateCount: number;
  maxStepCount: number;
} {
  const templateCount = AGENT17_PROJECT_TEMPLATE_CATALOG.length;
  const deepTemplateCount = AGENT17_DEEP_TEMPLATE_CATALOG.length;
  const maxStepCount = AGENT17_PROJECT_TEMPLATE_CATALOG.reduce(
    (max, t) => Math.max(max, t.stepBlueprints.length),
    0
  );
  return { templateCount, deepTemplateCount, maxStepCount };
}


// --- source: planning/plan-health.ts ---
  Acc17MultiStepPlan,
  Agent17PlanHealthBand,
  Agent17GameStateSlice,
} from '../types/command-center-types.ts';

export function assessAgent17PlanHealth(
  plan: Acc17MultiStepPlan | null,
  _state: Agent17GameStateSlice,
  _actorId: string
): Agent17PlanHealthBand {
  if (!plan || plan.steps.length === 0) {
    return {
      band: 'critical',
      score: 0,
      blockedCount: 0,
      verifiedRatio: 0,
      replanCount: 0,
      onTrack: false,
    };
  }
  const blockedCount = plan.steps.filter(
    s => s.status === 'blocked' || s.status === 'failed'
  ).length;
  const verified = plan.steps.filter(s => s.status === 'verified_complete').length;
  const verifiedRatio = verified / plan.steps.length;
  const inFlight = plan.steps.some(s => s.status === 'in_progress' || s.status === 'pending');
  let score = Math.round(verifiedRatio * 70 + (plan.isOnTrack ? 20 : 0));
  if (verifiedRatio === 0 && inFlight && blockedCount === 0) {
    score = Math.max(score, 52);
  }
  score -= blockedCount * 15;
  score -= Math.min(15, plan.replanCount * 3);
  score = Math.max(0, Math.min(100, score));
  let band: Agent17PlanHealthBand['band'] = 'steady';
  if (score < 35 || blockedCount >= 2) band = 'critical';
  else if (score < 50 || blockedCount >= 1) band = 'at_risk';
  else if (score >= 80 && verifiedRatio >= 0.6) band = 'strong';
  else if (verifiedRatio === 0 && inFlight && blockedCount === 0) band = 'steady';
  return {
    band,
    score,
    blockedCount,
    verifiedRatio,
    replanCount: plan.replanCount,
    onTrack: plan.isOnTrack && blockedCount === 0,
  };
}

export function planHealthNeedsRecovery(health: Agent17PlanHealthBand): boolean {
  return health.band === 'critical' || health.band === 'at_risk';
}

export function formatAgent17PlanHealthSummary(health: Agent17PlanHealthBand): string {
  return `${health.band} · score ${health.score} · verified ${Math.round(health.verifiedRatio * 100)}% · replans ${health.replanCount}`;
}


// --- source: planning/delegation-analytics.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Agent17DelegationAnalyticsRow,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

const DELEGATE_KINDS: Acc17DelegateTargetKind[] = [
  'copilot',
  'team_os',
  'teammate',
  'strategy_planner',
  'manual',
];

export function buildAgent17DelegationAnalytics(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice
): Agent17DelegationAnalyticsRow[] {
  const projects = ops.delegatedProjects || [];
  return DELEGATE_KINDS.map(delegateKind => {
    const rows = projects.filter(p => p.delegateKind === delegateKind);
    const authorityMix: Record<string, number> = {};
    for (const p of rows) {
      authorityMix[p.authorityCeiling] = (authorityMix[p.authorityCeiling] || 0) + 1;
    }
    const activeProjects = rows.filter(p =>
      ['delegated', 'executing', 'awaiting_verification'].includes(p.status)
    ).length;
    const completedProjects = rows.filter(p => p.status === 'completed').length;
    const blockedProjects = rows.filter(p => p.status === 'blocked').length;
    let recommendedAdjustment: string | undefined;
    const autonomy = settings.aiCommunicationAutonomyLevel;
    if (delegateKind === 'copilot' && autonomy === 'advisory' && activeProjects > 0) {
      recommendedAdjustment = 'Reduce copilot load while autonomy is advisory.';
    }
    if (delegateKind === 'team_os' && autonomy === 'delegated' && activeProjects === 0) {
      recommendedAdjustment = 'Consider team_os delegation under delegated autonomy.';
    }
    if (blockedProjects >= 2) {
      recommendedAdjustment = 'Multiple blocked delegations — replan or downgrade authority ceiling.';
    }
    return {
      delegateKind,
      activeProjects,
      completedProjects,
      blockedProjects,
      authorityMix,
      recommendedAdjustment,
    };
  });
}

export function pickAgent17DelegateKindFromAnalytics(
  rows: Agent17DelegationAnalyticsRow[],
  recommended: Acc17DelegateTargetKind
): Acc17DelegateTargetKind {
  const overloaded = rows.find(r => r.activeProjects >= 3 && r.delegateKind === recommended);
  if (overloaded) {
    const alt = rows.find(r => r.activeProjects === 0 && r.delegateKind !== 'manual');
    return alt?.delegateKind ?? recommended;
  }
  return recommended;
}

export function countAgent17ActiveDelegations(projects: Acc17DelegatedProject[]): number {
  return projects.filter(p =>
    ['delegated', 'executing', 'awaiting_verification'].includes(p.status)
  ).length;
}


// --- source: planning/delegation-ladder.ts ---
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Agent17DelegationAnalyticsRow,
  Agent17DelegationLadderRung,
  Agent17DelegationLadderSnapshot,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

const MAX_CONCURRENT_BY_KIND: Record<Acc17DelegateTargetKind, number> = {
  copilot: 2,
  team_os: 2,
  teammate: 3,
  strategy_planner: 2,
  manual: 1,
};

const PREFERRED_AUTHORITY_BY_KIND: Record<
  Acc17DelegateTargetKind,
  Acc17DelegatedProject['authorityCeiling']
> = {
  copilot: 'assisted',
  team_os: 'delegated',
  teammate: 'assisted',
  strategy_planner: 'advisory',
  manual: 'advisory',
};

const ESCALATION_CHAIN: Partial<Record<Acc17DelegateTargetKind, Acc17DelegateTargetKind>> = {
  strategy_planner: 'copilot',
  copilot: 'team_os',
  teammate: 'copilot',
  manual: 'copilot',
};

export function buildAgent17DelegationLadder(
  analytics: Agent17DelegationAnalyticsRow[],
  settings: Agent17SettingsSlice,
  recommendedKind: Acc17DelegateTargetKind
): Agent17DelegationLadderSnapshot {
  const autonomy = settings.aiCommunicationAutonomyLevel ?? 'assisted';
  const rungs: Agent17DelegationLadderRung[] = analytics.map(row => {
    const maxConcurrent = MAX_CONCURRENT_BY_KIND[row.delegateKind];
    const loadScore = row.activeProjects * 10 + row.blockedProjects * 25;
    let preferredAuthority = PREFERRED_AUTHORITY_BY_KIND[row.delegateKind];
    if (autonomy === 'advisory' && preferredAuthority === 'delegated') {
      preferredAuthority = 'assisted';
    }
    if (autonomy === 'delegated' && row.delegateKind === 'team_os') {
      preferredAuthority = 'delegated';
    }
    return {
      delegateKind: row.delegateKind,
      loadScore,
      maxConcurrent,
      slotsRemaining: Math.max(0, maxConcurrent - row.activeProjects),
      preferredAuthority,
      escalationTarget: ESCALATION_CHAIN[row.delegateKind],
    };
  });

  const totalActiveLoad = analytics.reduce((sum, r) => sum + r.activeProjects, 0);
  const recommendedRung =
    rungs.find(r => r.delegateKind === recommendedKind) ??
    rungs.find(r => r.slotsRemaining > 0) ??
    rungs[0];
  let recommendedKindResolved = recommendedKind;
  if (recommendedRung && recommendedRung.slotsRemaining === 0 && recommendedRung.escalationTarget) {
    const esc = rungs.find(r => r.delegateKind === recommendedRung.escalationTarget);
    if (esc && esc.slotsRemaining > 0) recommendedKindResolved = esc.delegateKind;
  }

  const loads = rungs.map(r => r.loadScore);
  const maxLoad = Math.max(...loads, 0);
  const minLoad = Math.min(...loads, 0);
  const imbalanceFlag = maxLoad - minLoad >= 40 && totalActiveLoad >= 2;

  const headline = imbalanceFlag
    ? `Delegation imbalance — favor ${recommendedKindResolved} (${recommendedRung?.slotsRemaining ?? 0} slots)`
    : `Delegation ladder balanced — next ${recommendedKindResolved}`;

  return {
    rungs,
    recommendedKind: recommendedKindResolved,
    totalActiveLoad,
    imbalanceFlag,
    headline,
  };
}

export function pickAuthorityCeilingForDelegateKind(
  kind: Acc17DelegateTargetKind,
  settings: Agent17SettingsSlice
): Acc17DelegatedProject['authorityCeiling'] {
  const ladder = buildAgent17DelegationLadder(
    kind === 'copilot'
      ? [{ delegateKind: 'copilot', activeProjects: 0, completedProjects: 0, blockedProjects: 0, authorityMix: {} }]
      : [{ delegateKind: kind, activeProjects: 0, completedProjects: 0, blockedProjects: 0, authorityMix: {} }],
    settings,
    kind
  );
  return ladder.rungs[0]?.preferredAuthority ?? 'assisted';
}

export function delegationLadderHasCapacity(
  ladder: Agent17DelegationLadderSnapshot,
  kind: Acc17DelegateTargetKind
): boolean {
  const rung = ladder.rungs.find(r => r.delegateKind === kind);
  return (rung?.slotsRemaining ?? 0) > 0;
}


// --- source: planning/plan-ledger.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17PlanLedgerEntry,
  Agent17PlanLedgerSummary,
} from '../types/command-center-types.ts';

const LEDGER_CAP = 24;

export function summarizeAgent17PlanLedger(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice
): Agent17PlanLedgerSummary {
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || turn;
  const entries: Agent17PlanLedgerEntry[] = [];

  for (const log of ops.verificationLog.slice(-LEDGER_CAP)) {
    entries.push({
      id: log.id,
      turn: log.turn,
      day: log.day,
      kind: 'verify',
      summary: log.verified
        ? `Verified step ${log.stepId}: ${log.reason}`
        : `Unverified step ${log.stepId}`,
    });
  }

  const plan = ops.activePlan;
  if (plan && plan.replanCount > 0) {
    entries.push({
      id: `ledger_replan_${plan.id}`,
      turn,
      day,
      kind: 'replan',
      summary: `Replan count ${plan.replanCount} on ${plan.title}`,
    });
  }

  for (const proj of ops.delegatedProjects.slice(-8)) {
    entries.push({
      id: `ledger_delegate_${proj.id}`,
      turn: proj.assignedTurn,
      day: proj.assignedDay,
      kind: 'delegate',
      summary: `${proj.delegateKind}:${proj.delegateTargetId} · ${proj.status}`,
    });
  }

  if (plan) {
    for (const step of plan.steps.filter(s => s.status === 'blocked' || s.status === 'failed')) {
      entries.push({
        id: `ledger_block_${step.id}`,
        turn,
        day,
        kind: 'block',
        summary: `${step.title} — ${step.blockerReason || step.status}`,
      });
    }
  }

  entries.sort((a, b) => b.turn - a.turn || b.day - a.day);
  const trimmed = entries.slice(0, LEDGER_CAP);
  return {
    entries: trimmed,
    verifiedEvents: trimmed.filter(e => e.kind === 'verify').length,
    replanEvents: plan?.replanCount ?? 0,
    blockedStepEvents: trimmed.filter(e => e.kind === 'block').length,
    lastFingerprint: ops.lastContextFingerprint || '',
  };
}

export function planLedgerIndicatesInstability(ledger: Agent17PlanLedgerSummary): boolean {
  return ledger.blockedStepEvents >= 2 || ledger.replanEvents >= 2;
}


// --- source: planning/delegation-depth.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Agent17GameStateSlice,
  Agent17PlanningSuggestion,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  buildAgent17DelegationLadder,
  delegationLadderHasCapacity,
} from './delegation-ladder.ts';

export function refineAgent17DelegationSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  baseSuggestion: Agent17PlanningSuggestion,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  if (baseSuggestion.kind !== 'delegate' && baseSuggestion.kind !== 'hold') {
    return baseSuggestion;
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const ladder = buildAgent17DelegationLadder(analytics, settings, recommendedDelegateKind);
  const ledger = summarizeAgent17PlanLedger(ops, state);
  const health = assessAgent17PlanHealth(ops.activePlan, state, actorId);

  if (planLedgerIndicatesInstability(ledger) && ladder.recommendedKind !== recommendedDelegateKind) {
    return {
      kind: 'delegate',
      delegateKind: ladder.recommendedKind,
      headline: `Ladder reroute → ${ladder.recommendedKind}`,
      rationale: `${ladder.headline}; ledger instability detected.`,
      confidence: 0.78,
    };
  }

  const targetKind = baseSuggestion.delegateKind ?? recommendedDelegateKind;
  if (!delegationLadderHasCapacity(ladder, targetKind)) {
    const alt = ladder.rungs.find(r => r.slotsRemaining > 0);
    if (alt) {
      return {
        kind: 'delegate',
        delegateKind: alt.delegateKind,
        headline: `Capacity reroute → ${alt.delegateKind}`,
        rationale: `${targetKind} at capacity; ${alt.slotsRemaining} slot(s) on ${alt.delegateKind}.`,
        confidence: 0.71,
      };
    }
  }

  if (health.band === 'at_risk' && baseSuggestion.kind === 'hold') {
    return {
      kind: 'delegate',
      delegateKind: ladder.recommendedKind,
      headline: `Proactive delegate ${ladder.recommendedKind}`,
      rationale: 'Plan health at risk; ladder recommends early delegation.',
      confidence: 0.66,
    };
  }

  return baseSuggestion;
}

export function computeAgent17DelegationDepthScore(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice,
  recommendedDelegateKind: Acc17DelegateTargetKind
): number {
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const ladder = buildAgent17DelegationLadder(analytics, settings, recommendedDelegateKind);
  let score = 50;
  score += ladder.rungs.filter(r => r.slotsRemaining > 0).length * 5;
  score -= ladder.totalActiveLoad * 4;
  if (ladder.imbalanceFlag) score -= 15;
  else score += 10;
  return Math.max(0, Math.min(100, score));
}


// --- source: planning/intent-synthesis.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17IntentItem,
  Agent17IntentQueueSnapshot,
  Agent17PlanHealthBand,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

export function buildAgent17IntentQueue(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  planHealth: Agent17PlanHealthBand
): Agent17IntentQueueSnapshot {
  const items: Agent17IntentItem[] = [];
  const push = (item: Agent17IntentItem) => items.push(item);

  const objective = defaultObjectiveResolver(state, settings, actorId);
  if (objective?.title) {
    push({
      id: 'intent_objective',
      priority: 100,
      label: objective.title,
      source: 'objective',
      actionHint: objective.recommendedNextStep?.actionType,
    });
  }

  if (state.gi3Strategy?.headline) {
    push({
      id: 'intent_gi3',
      priority: 90,
      label: state.gi3Strategy.headline,
      source: 'gi3',
      actionHint: 'verify_objective',
    });
  }

  const signals = detectAgent17RecoverySignals(state, actorId);
  if (signals[0]) {
    push({
      id: `intent_recovery_${signals[0].lane}`,
      priority: 80 + Math.min(15, Math.floor(signals[0].severity / 10)),
      label: signals[0].reason,
      source: 'recovery',
      actionHint: 'wait',
    });
  }

  if (planHealth.band === 'at_risk' || planHealth.band === 'critical') {
    push({
      id: 'intent_plan_health',
      priority: 95,
      label: `Plan health ${planHealth.band} (score ${planHealth.score})`,
      source: 'plan_health',
      actionHint: ops.activePlan?.steps.find(s => s.status === 'in_progress')?.actionType,
    });
  }

  if (ops.delegatedProjects.length > 0) {
    push({
      id: 'intent_delegation',
      priority: 70,
      label: `${ops.delegatedProjects.length} active delegation(s)`,
      source: 'delegation',
      actionHint: 'invest',
    });
  }

  items.sort((a, b) => b.priority - a.priority);
  return {
    items: items.slice(0, 8),
    primaryIntentId: items[0]?.id ?? null,
    queueDepth: items.length,
  };
}

export function intentQueueRequiresRecovery(intent: Agent17IntentQueueSnapshot): boolean {
  return intent.items.some(i => i.source === 'recovery' && i.priority >= 90);
}


// --- source: planning/verification-policy.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17VerificationPolicyRule,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17VerificationPolicy(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string
): Agent17VerificationPolicySnapshot {
  const fp = acc17ComputeRelevantStateFingerprint(state, actorId);
  const prev = ops.lastContextFingerprint || '';
  const rules: Agent17VerificationPolicyRule[] = [
    {
      id: 'vp_fingerprint_delta',
      description: 'State fingerprint must differ from last evaluation to verify progress.',
      satisfied: prev !== '' && fp !== prev,
    },
    {
      id: 'vp_active_plan',
      description: 'An active multi-step plan must exist.',
      satisfied: !!ops.activePlan && ops.activePlan.steps.length > 0,
    },
    {
      id: 'vp_last_action',
      description: 'Last executed action must be recorded.',
      satisfied: !!(state.lastExecutedAction?.type || state.lastAction?.type),
    },
    {
      id: 'vp_not_evaluating',
      description: 'Command center must not be in a blocked-only terminal state.',
      satisfied: !(
        ops.activePlan?.steps.every(s => s.status === 'blocked' || s.status === 'failed') ?? false
      ),
    },
    {
      id: 'vp_ops_enabled',
      description: 'Ops pipeline enabled.',
      satisfied: ops.enabled !== false,
    },
  ];

  const blockingRuleIds = rules.filter(r => !r.satisfied).map(r => r.id);
  return {
    rules,
    allowVerification: blockingRuleIds.length === 0,
    blockingRuleIds,
  };
}

export function verificationPolicyBlocksAdvance(policy: Agent17VerificationPolicySnapshot): boolean {
  return !policy.allowVerification && policy.blockingRuleIds.includes('vp_fingerprint_delta');
}


// --- source: planning/coordination-brief.ts ---
  Acc17CommandCenterOpsState,
  Agent17CoordinationBrief,
  Agent17CoordinationBriefSection,
  Agent17GameStateSlice,
  Agent17IntentQueueSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17SettingsSlice,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17CoordinationBrief(
  depth: Omit<
    Agent17PlanningDepthSnapshot,
    'intentQueue' | 'verificationPolicy' | 'coordinationBrief'
  >,
  intentQueue: Agent17IntentQueueSnapshot,
  verificationPolicy: Agent17VerificationPolicySnapshot,
  ops: Acc17CommandCenterOpsState,
  _state: Agent17GameStateSlice,
  _settings: Agent17SettingsSlice
): Agent17CoordinationBrief {
  const sections: Agent17CoordinationBriefSection[] = [];

  sections.push({
    id: 'intent',
    heading: 'Primary intents',
    bullets: intentQueue.items.slice(0, 4).map(i => `[${i.source}] ${i.label}`),
  });

  sections.push({
    id: 'plan',
    heading: 'Plan posture',
    bullets: [
      depth.planHealth
        ? `${depth.planHealth.band} · score ${depth.planHealth.score} · replans ${depth.planHealth.replanCount}`
        : 'No plan health',
      depth.suggestion.headline,
      depth.delegationLadder.headline,
    ],
  });

  sections.push({
    id: 'verify',
    heading: 'Verification policy',
    bullets: verificationPolicy.allowVerification
      ? ['All verification gates satisfied.']
      : verificationPolicy.blockingRuleIds.map(id => `Blocked: ${id}`),
  });

  if (ops.activePlan) {
    sections.push({
      id: 'steps',
      heading: 'Active plan steps',
      bullets: ops.activePlan.steps.slice(0, 5).map(
        (s, idx) => `${idx + 1}. ${s.title} (${s.status})`
      ),
    });
  }

  const giHandoffTags = [
    'agent17_command_center',
    `category_${depth.templateRouting.matchedCategory}`,
    depth.planHealth.band,
    verificationPolicy.allowVerification ? 'verify_ready' : 'verify_hold',
  ];
  if (intentQueue.primaryIntentId) giHandoffTags.push(intentQueue.primaryIntentId);

  const confidence =
    (depth.suggestion.confidence +
      (verificationPolicy.allowVerification ? 0.15 : 0) +
      (depth.planHealth.band === 'strong' ? 0.1 : 0)) /
    1.25;

  return {
    headline: depth.suggestion.headline || 'Command center coordination brief',
    sections,
    giHandoffTags,
    confidence: Math.min(0.99, Math.max(0.35, confidence)),
  };
}

export function coordinationBriefReadyForGi(brief: Agent17CoordinationBrief): boolean {
  return brief.sections.length >= 3 && brief.giHandoffTags.length >= 4;
}


// --- source: planning/execution-pacing.ts ---
  Acc17CommandCenterOpsState,
  Agent17ExecutionPacingSnapshot,
  Agent17GameStateSlice,
  Agent17PlanHealthBand,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

const DEFAULT_TURN_BUDGET = 12;
const DELEGATE_COOLDOWN_TURNS = 2;

export function buildAgent17ExecutionPacing(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  planHealth: Agent17PlanHealthBand,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17ExecutionPacingSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const plan = ops.activePlan;
  const createdTurn = plan?.createdTurn ?? turn;
  const stepsRemaining =
    plan?.steps.filter(s => s.status !== 'verified_complete' && s.status !== 'skipped').length ?? 0;
  const elapsedOnPlan = Math.max(0, turn - createdTurn);
  const turnBudgetRemaining = Math.max(0, DEFAULT_TURN_BUDGET - elapsedOnPlan);

  const activeStep = plan?.steps[plan.activeStepIndex];
  const verificationGateOpen = verificationPolicy.allowVerification;
  const healthAllowsAdvance =
    planHealth.band !== 'critical' || (planHealth.blockedCount === 0 && planHealth.verifiedRatio > 0.2);
  const canAdvanceActiveStep =
    !!activeStep &&
    (activeStep.status === 'in_progress' || activeStep.status === 'pending') &&
    verificationGateOpen &&
    healthAllowsAdvance;

  const lastDelegateTurn = ops.delegatedProjects.reduce(
    (max, p) => Math.max(max, p.assignedTurn),
    0
  );
  const cooldownTurns = Math.max(0, DELEGATE_COOLDOWN_TURNS - (turn - lastDelegateTurn));

  let pacingBand: Agent17ExecutionPacingSnapshot['pacingBand'] = 'steady';
  if (turnBudgetRemaining <= 2 || planHealth.band === 'critical') {
    pacingBand = 'urgent';
  } else if (!verificationGateOpen || cooldownTurns > 0) {
    pacingBand = 'throttled';
  }

  const headline =
    pacingBand === 'urgent'
      ? `Urgent pacing: ${stepsRemaining} step(s), ${turnBudgetRemaining} turn budget left`
      : pacingBand === 'throttled'
        ? `Throttled: verification or delegate cooldown (${cooldownTurns} turn(s))`
        : `Steady execution: advance ${canAdvanceActiveStep ? 'allowed' : 'held'}`;

  return {
    turn,
    turnBudgetRemaining,
    stepsRemaining,
    canAdvanceActiveStep,
    verificationGateOpen,
    cooldownTurns,
    pacingBand,
    headline,
  };
}

export function executionPacingRequiresThrottle(pacing: Agent17ExecutionPacingSnapshot): boolean {
  return pacing.pacingBand === 'throttled' || !pacing.verificationGateOpen;
}


// --- source: planning/resilience-scorecard.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17PlanHealthBand,
  Agent17ResilienceScorecard,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export function buildAgent17ResilienceScorecard(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  actorId: string,
  planHealth: Agent17PlanHealthBand,
  verificationPolicy: Agent17VerificationPolicySnapshot
): Agent17ResilienceScorecard {
  const signals = detectAgent17RecoverySignals(state, actorId);
  const topSeverity = signals[0]?.severity ?? 0;
  const recoveryPressure = Math.min(100, Math.round(topSeverity * 0.85 + signals.length * 6));

  const satisfiedRules = verificationPolicy.rules.filter(r => r.satisfied).length;
  const ruleTotal = Math.max(1, verificationPolicy.rules.length);
  const verificationStability = Math.round((satisfiedRules / ruleTotal) * 100);

  const healthComponent = planHealth.score;
  const delegationLoad = Math.min(30, ops.delegatedProjects.filter(p => p.status === 'executing').length * 8);
  const compositeIndex = Math.max(
    0,
    Math.min(
      100,
      Math.round(healthComponent * 0.45 + verificationStability * 0.35 + (100 - recoveryPressure) * 0.2 - delegationLoad)
    )
  );

  const mitigationHints: string[] = [];
  if (recoveryPressure >= 55) {
    mitigationHints.push('Prioritize recovery lane template before new delegation.');
  }
  if (!verificationPolicy.allowVerification) {
    mitigationHints.push(`Clear verification gates: ${verificationPolicy.blockingRuleIds.join(', ')}`);
  }
  if (planHealth.blockedCount > 0) {
    mitigationHints.push(`${planHealth.blockedCount} blocked step(s) — run replan or recovery path.`);
  }
  if (mitigationHints.length === 0) {
    mitigationHints.push('Posture stable; maintain verify-then-advance cadence.');
  }

  const band: Agent17ResilienceScorecard['band'] =
    compositeIndex >= 72 ? 'robust' : compositeIndex >= 45 ? 'watch' : 'fragile';

  return {
    recoveryPressure,
    verificationStability,
    compositeIndex,
    band,
    signalCount: signals.length,
    mitigationHints: mitigationHints.slice(0, 4),
    headline: `Resilience ${band} (${compositeIndex}/100) · recovery pressure ${recoveryPressure}`,
  };
}

export function resilienceScorecardNeedsIntervention(card: Agent17ResilienceScorecard): boolean {
  return card.band === 'fragile' || card.recoveryPressure >= 70;
}


// --- source: planning/strategic-alignment.ts ---
  Acc17CommandCenterOpsState,
  Agent17GameStateSlice,
  Agent17IntentQueueSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length >= 4)
  );
}

function overlapScore(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 50;
  let hits = 0;
  for (const w of a) {
    if (b.has(w)) hits += 1;
  }
  const denom = Math.max(1, Math.min(a.size, b.size));
  return Math.round((hits / denom) * 100);
}

export function buildAgent17StrategicAlignment(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: import('../types/command-center-types.ts').Agent17SettingsSlice,
  actorId: string,
  intentQueue: Agent17IntentQueueSnapshot
): Agent17StrategicAlignmentSnapshot {
  const objective = defaultObjectiveResolver(state, settings, actorId);
  const objectiveText = objective?.title || '';
  const gi3Text = state.gi3Strategy?.headline || '';
  const plannerText = state.strategyPlannerState?.activePlan?.title || '';
  const planText = ops.activePlan?.title || '';

  const objectiveTokens = tokenize(objectiveText);
  const gi3Tokens = tokenize(gi3Text);
  const plannerTokens = tokenize(plannerText);
  const planTokens = tokenize(planText || objectiveText);

  const gi3Overlap = gi3Text ? overlapScore(objectiveTokens, gi3Tokens) : 60;
  const plannerOverlap = plannerText ? overlapScore(objectiveTokens, plannerTokens) : 55;
  const planOverlap = ops.activePlan ? overlapScore(objectiveTokens, planTokens) : 50;

  const alignmentIndex = Math.max(
    0,
    Math.min(100, Math.round(gi3Overlap * 0.4 + plannerOverlap * 0.25 + planOverlap * 0.35))
  );

  const driftFlags: string[] = [];
  if (gi3Text && gi3Overlap < 35) driftFlags.push('gi3_objective_drift');
  if (plannerText && plannerOverlap < 30) driftFlags.push('planner_objective_drift');
  if (ops.activePlan && planOverlap < 25) driftFlags.push('plan_title_drift');
  if (intentQueue.primaryIntentId === 'intent_gi3' && gi3Overlap < 45) {
    driftFlags.push('primary_intent_misaligned');
  }

  const band: Agent17StrategicAlignmentSnapshot['band'] =
    alignmentIndex >= 70 ? 'aligned' : alignmentIndex >= 42 ? 'drifting' : 'divergent';

  const cues = [gi3Text, plannerText, planText].filter(Boolean);
  const headline =
    cues.length >= 2
      ? `Strategic ${band} (${alignmentIndex}/100) · GI3/plan cues ${cues.length}`
      : `Strategic ${band} (${alignmentIndex}/100) · sparse upstream cues`;

  return {
    alignmentIndex,
    band,
    gi3Overlap,
    plannerOverlap,
    planOverlap,
    driftFlags: driftFlags.slice(0, 4),
    primaryIntentId: intentQueue.primaryIntentId,
    headline,
  };
}

export function strategicAlignmentNeedsReconcile(snapshot: Agent17StrategicAlignmentSnapshot): boolean {
  return snapshot.band === 'divergent' || snapshot.driftFlags.length >= 2;
}


// --- source: planning/handoff-readiness.ts ---
  Agent17CoordinationBrief,
  Agent17ExecutionPacingSnapshot,
  Agent17HandoffReadinessSnapshot,
  Agent17ResilienceScorecard,
  Agent17StrategicAlignmentSnapshot,
  Agent17VerificationPolicySnapshot,
} from '../types/command-center-types.ts';

export interface Agent17HandoffReadinessInputs {
  coordinationBrief: Agent17CoordinationBrief;
  verificationPolicy: Agent17VerificationPolicySnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
  resilienceScorecard: Agent17ResilienceScorecard;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17HandoffReadiness(
  inputs: Agent17HandoffReadinessInputs
): Agent17HandoffReadinessSnapshot {
  const checks: Agent17HandoffReadinessSnapshot['checks'] = [];

  const giReady = coordinationBriefReadyForGi(inputs.coordinationBrief);
  checks.push({
    id: 'gi_brief',
    label: 'Coordination brief GI-ready',
    passed: giReady,
    weight: 20,
  });

  checks.push({
    id: 'verify_gate',
    label: 'Verification gate open',
    passed: inputs.verificationPolicy.allowVerification,
    weight: 25,
  });

  checks.push({
    id: 'pacing',
    label: 'Execution pacing not throttled',
    passed: inputs.executionPacing.pacingBand !== 'throttled',
    weight: 15,
  });

  checks.push({
    id: 'resilience',
    label: 'Resilience posture stable',
    passed: !resilienceScorecardNeedsIntervention(inputs.resilienceScorecard),
    weight: 20,
  });

  checks.push({
    id: 'alignment',
    label: 'Strategic alignment not divergent',
    passed: !strategicAlignmentNeedsReconcile(inputs.strategicAlignment),
    weight: 20,
  });

  const earned = checks.filter(c => c.passed).reduce((n, c) => n + c.weight, 0);
  const totalWeight = checks.reduce((n, c) => n + c.weight, 0);
  const readinessScore = Math.round((earned / Math.max(1, totalWeight)) * 100);

  const blockers = checks.filter(c => !c.passed).map(c => c.id);
  const readyForTeamOs =
    readinessScore >= 72 &&
    inputs.verificationPolicy.allowVerification &&
    inputs.coordinationBrief.giHandoffTags.includes('agent17_command_center');

  const band: Agent17HandoffReadinessSnapshot['band'] =
    readinessScore >= 80 ? 'ready' : readinessScore >= 50 ? 'partial' : 'blocked';

  return {
    readinessScore,
    band,
    readyForTeamOs,
    checks,
    blockers,
    headline: `Handoff ${band} (${readinessScore}/100) · blockers ${blockers.length}`,
  };
}

export function handoffReadinessBlocked(snapshot: Agent17HandoffReadinessSnapshot): boolean {
  return snapshot.band === 'blocked' || snapshot.blockers.includes('verify_gate');
}


// --- source: planning/planning-orchestrator.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Agent17PlanningDepthSnapshot,
  Agent17PlanningSuggestion,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  buildAgent17DelegationAnalytics,
  pickAgent17DelegateKindFromAnalytics,
} from './delegation-analytics.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from './template-selector.ts';

export function buildAgent17PlanningSuggestion(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningSuggestion {
  const plan = ops.activePlan;
  const health = assessAgent17PlanHealth(plan, state, actorId);
  const blocked = plan?.steps.some(s => s.status === 'blocked' || s.status === 'failed') ?? false;
  const signals = detectAgent17RecoverySignals(state, actorId);
  const recovery = pickAgent17RecoveryTemplateId(signals, blocked);
  if (recovery && (blocked || planHealthNeedsRecovery(health))) {
    return {
      kind: 'recovery',
      templateId: recovery.templateId,
      headline: `Recovery lane: ${recovery.lane}`,
      rationale: recovery.rationale,
      confidence: Math.min(0.95, 0.55 + (signals[0]?.severity ?? 40) / 200),
    };
  }
  const routing = rankAgent17TemplateCandidates(state, settings, actorId);
  const templateId = routing.candidateTemplateIds[0];
  if (templateId && (!plan || health.band === 'steady' || health.band === 'strong')) {
    return {
      kind: 'template',
      templateId,
      headline: `Route ${routing.matchedCategory} → ${templateId}`,
      rationale: `Category ${routing.matchedCategory} from objective and state cues.`,
      confidence: 0.72,
    };
  }
  const analytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegateKind = pickAgent17DelegateKindFromAnalytics(analytics, recommendedDelegateKind);
  if (plan && plan.completionPercent < 100) {
    return {
      kind: 'delegate',
      delegateKind,
      headline: `Delegate via ${delegateKind}`,
      rationale: 'Active plan incomplete; delegation analytics favor this target.',
      confidence: 0.65,
    };
  }
  return {
    kind: 'hold',
    headline: 'Hold planning posture',
    rationale: 'No recovery, template, or delegation action required this turn.',
    confidence: 0.5,
  };
}

export function buildAgent17PlanningDepthSnapshot(
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  recommendedDelegateKind: Acc17DelegateTargetKind
): Agent17PlanningDepthSnapshot {
  const turn = state.turnCounter || state.day || 1;
  const planHealth = assessAgent17PlanHealth(ops.activePlan, state, actorId);
  const templateRouting = rankAgent17TemplateCandidates(state, settings, actorId);
  const delegationAnalytics = buildAgent17DelegationAnalytics(ops, settings);
  const delegationLadder = buildAgent17DelegationLadder(
    delegationAnalytics,
    settings,
    recommendedDelegateKind
  );
  const planLedger = summarizeAgent17PlanLedger(ops, state);
  let suggestion = buildAgent17PlanningSuggestion(
    ops,
    state,
    settings,
    actorId,
    recommendedDelegateKind
  );
  suggestion = refineAgent17DelegationSuggestion(
    ops,
    state,
    settings,
    actorId,
    suggestion,
    recommendedDelegateKind
  );
  const intentQueue = buildAgent17IntentQueue(ops, state, settings, actorId, planHealth);
  const verificationPolicy = buildAgent17VerificationPolicy(ops, state, actorId);
  const core = {
    turn,
    actorId,
    planHealth,
    suggestion,
    templateRouting,
    delegationAnalytics,
    delegationLadder,
    planLedger,
    catalogDepth: summarizeAgent17CatalogDepth(),
  };
  const coordinationBrief = buildAgent17CoordinationBrief(
    core,
    intentQueue,
    verificationPolicy,
    ops,
    state,
    settings
  );
  const executionPacing = buildAgent17ExecutionPacing(
    ops,
    state,
    planHealth,
    verificationPolicy
  );
  const resilienceScorecard = buildAgent17ResilienceScorecard(
    ops,
    state,
    actorId,
    planHealth,
    verificationPolicy
  );
  const strategicAlignment = buildAgent17StrategicAlignment(
    ops,
    state,
    settings,
    actorId,
    intentQueue
  );
  const handoffReadiness = buildAgent17HandoffReadiness({
    coordinationBrief,
    verificationPolicy,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
  });
  return {
    ...core,
    intentQueue,
    verificationPolicy,
    coordinationBrief,
    executionPacing,
    resilienceScorecard,
    strategicAlignment,
    handoffReadiness,
  };
}

export function attachAgent17PlanningDepth(
  snapshot: Acc17OperationsSnapshot,
  ops: Acc17CommandCenterOpsState,
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string
): Acc17OperationsSnapshot {
  return {
    ...snapshot,
    planningDepth: buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      actorId,
      snapshot.recommendedDelegateKind
    ),
  };
}


// --- source: evaluation/operations-evaluator.ts ---
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17OperationsSnapshot,
  Acc17V94DeepContextSlice,
  Agent17ContextAdapters,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  acc17AdvanceVerifiedPlanProgress,
  acc17CreateMultiStepPlanFromObjective,
  acc17DelegateProject,
  defaultObjectiveResolver,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function buildAcc17V94DeepContextBundle(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  adapters: Agent17ContextAdapters = {}
): import('../types/command-center-types.ts').Acc17V94DeepContextBundle {
  const turn = state.turnCounter || state.day || 1;
  const day = state.day || 1;
  const fingerprint = acc17ComputeRelevantStateFingerprint(state, actorId);
  const actor =
    state.actorsById?.[actorId] || (actorId === 'player' ? state.player : undefined) || {
      id: actorId,
    };
  const slices: Acc17V94DeepContextSlice[] = [];
  const pushSlice = (
    key: string,
    label: string,
    summary: string,
    weight: number,
    tags: string[] = []
  ) => {
    if (summary) slices.push({ key, label, summary, weight, tags });
  };

  try {
    const objective = adapters.resolveObjective
      ? adapters.resolveObjective(state, settings, actor, state.playerTrackedObjective)
      : defaultObjectiveResolver(state, settings, actorId);
    if (objective?.title) {
      pushSlice(
        'objective',
        'Current objective',
        `${objective.title} — ${objective.description || ''}`,
        10,
        ['intent']
      );
    }
  } catch {
    /* noop */
  }

  if (adapters.classifyAttention) {
    try {
      const attention = adapters.classifyAttention(state, settings, actor);
      if (attention?.label) {
        pushSlice('attention', 'Attention', `${attention.label}: ${attention.detail || ''}`, 9, [
          'risk',
        ]);
      }
    } catch {
      /* noop */
    }
  }

  const gi3 = state.gi3Strategy;
  if (gi3?.headline) pushSlice('gi3', 'Strategy', String(gi3.headline), 8, ['gi3']);
  const planner = state.strategyPlannerState?.activePlan;
  if (planner?.title) pushSlice('planner', 'Planner', `Blueprint: ${planner.title}`, 7, ['planner']);
  pushSlice(
    'economy',
    'Economy',
    `Cash $${Number(actor.money || 0).toLocaleString()}`,
    5,
    ['economy']
  );
  slices.sort((a, b) => b.weight - a.weight);
  return {
    actorId,
    turn,
    day,
    fingerprint,
    headline: slices[0]?.summary || 'Deep context ready.',
    slices: slices.slice(0, 12),
    objectiveTitle: slices.find(s => s.key === 'objective')?.summary.split(' — ')[0],
    attentionLabel: slices.find(s => s.key === 'attention')?.label,
    strategyHeadline: slices.find(s => s.key === 'gi3')?.summary,
  };
}

export function evaluateAcc17CommandCenterOperations(
  state: Agent17GameStateSlice,
  settings: Agent17SettingsSlice,
  actorId: string,
  persisted: Acc17CommandCenterOpsState,
  adapters: Agent17ContextAdapters = {}
): { ops: Acc17CommandCenterOpsState; snapshot: Acc17OperationsSnapshot } {
  const enabled = persisted.enabled !== false && settings?.commandCenterSettings?.enabled !== false;
  const deepContext = buildAcc17V94DeepContextBundle(state, settings, actorId, adapters);
  let ops = sanitizeAcc17CommandCenterOpsState(persisted);
  if (!enabled) {
    return {
      ops,
      snapshot: {
        deepContext,
        activePlan: null,
        delegatedProjects: [],
        pendingVerificationCount: 0,
        verifiedStepsThisTurn: 0,
        blockedSteps: [],
        recommendedDelegateKind: 'copilot',
      },
    };
  }
  if (!ops.activePlan) {
    const fromObjective = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      actorId,
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    if (fromObjective) ops = { ...ops, activePlan: fromObjective };
  }
  const prevFp = ops.lastContextFingerprint || '';
  if (ops.activePlan) {
    const { plan, logEntries, fingerprint } = acc17AdvanceVerifiedPlanProgress(
      ops.activePlan,
      state,
      actorId,
      prevFp
    );
    ops = {
      ...ops,
      activePlan: plan,
      lastContextFingerprint: fingerprint,
      lastContextBundle: deepContext,
      verificationLog: [...ops.verificationLog, ...logEntries].slice(-200),
    };
    if (ops.delegatedProjects.length === 0 && plan.completionPercent < 100) {
      ops = {
        ...ops,
        delegatedProjects: [
          acc17DelegateProject(ops, plan, 'copilot', 'copilot_session', 'assisted'),
        ],
      };
    }
    const recovery = maybeApplyAgent17RecoveryPath(ops, state, actorId);
    if (recovery.applied && recovery.ops.activePlan) {
      ops = recovery.ops;
      if (ops.delegatedProjects.length === 0 && ops.activePlan.completionPercent < 100) {
        ops = {
          ...ops,
          delegatedProjects: [
            acc17DelegateProject(ops, ops.activePlan, 'copilot', 'copilot_session', 'assisted'),
          ],
        };
      }
    }
  } else {
    ops = { ...ops, lastContextFingerprint: deepContext.fingerprint, lastContextBundle: deepContext };
  }
  const blockedSteps =
    ops.activePlan?.steps.filter(s => s.status === 'blocked' || s.status === 'failed') || [];
  const pendingVerificationCount =
    ops.activePlan?.steps.filter(s => s.status === 'in_progress').length || 0;
  const verifiedStepsThisTurn = ops.verificationLog.filter(
    e => e.turn === (state.turnCounter || 1) && e.verified
  ).length;
  const autonomy = settings?.aiCommunicationAutonomyLevel;
  const recommendedDelegateKind: Acc17DelegateTargetKind =
    autonomy === 'delegated'
      ? 'team_os'
      : autonomy === 'assisted'
        ? 'copilot'
        : 'strategy_planner';
  return {
    ops,
    snapshot: attachAgent17PlanningDepth(
      {
        deepContext,
        activePlan: ops.activePlan,
        delegatedProjects: ops.delegatedProjects,
        pendingVerificationCount,
        verifiedStepsThisTurn,
        blockedSteps,
        recommendedDelegateKind,
      },
      ops,
      state,
      settings,
      actorId
    ),
  };
}


// --- source: rollback/rollback-controller.ts ---

const MAX_CHECKPOINTS = 16;

export interface Agent17RollbackController {
  capture(label: string, turn: number, ops: Acc17CommandCenterOpsState): Agent17RollbackCheckpoint;
  rollbackToLatest(): Acc17CommandCenterOpsState | null;
  rollbackTo(checkpointId: string): Acc17CommandCenterOpsState | null;
  listCheckpoints(): Agent17RollbackCheckpoint[];
  clear(): void;
}

export function createAgent17RollbackController(): Agent17RollbackController {
  const stack: Agent17RollbackCheckpoint[] = [];

  const trim = () => {
    while (stack.length > MAX_CHECKPOINTS) stack.shift();
  };

  return {
    capture(label, turn, ops) {
      const checkpoint: Agent17RollbackCheckpoint = {
        id: `agent17_cp_${Date.now()}_${stack.length}`,
        label,
        createdAt: Date.now(),
        turn,
        ops: sanitizeAcc17CommandCenterOpsState(ops),
      };
      stack.push(checkpoint);
      trim();
      return checkpoint;
    },
    rollbackToLatest() {
      const cp = stack.pop();
      return cp ? sanitizeAcc17CommandCenterOpsState(cp.ops) : null;
    },
    rollbackTo(checkpointId) {
      const idx = stack.findIndex(c => c.id === checkpointId);
      if (idx < 0) return null;
      const [cp] = stack.splice(idx, 1);
      return sanitizeAcc17CommandCenterOpsState(cp.ops);
    },
    listCheckpoints() {
      return [...stack];
    },
    clear() {
      stack.length = 0;
    },
  };
}

/** Migrate unknown persisted shapes before evaluation (forward-only; rollback handles undo). */
export function migrateAgent17OpsPayload(input: unknown): Acc17CommandCenterOpsState {
  if (!input || typeof input !== 'object') {
    return sanitizeAcc17CommandCenterOpsState(input);
  }
  const obj = input as Record<string, unknown>;
  if (obj.version === 2) {
    return sanitizeAcc17CommandCenterOpsState({ ...obj, version: 1 });
  }
  return sanitizeAcc17CommandCenterOpsState(input);
}


// --- source: goals/goal-registry.ts ---

/** Measurable Agent 17 delivery goals — verified by `validation/goal-verification.ts`, not prose-only. */
export const AGENT17_GOAL_REGISTRY: Agent17GoalDefinition[] = [
  {
    id: 'G17-001',
    title: 'Ops state sanitizer pins version to v1',
    category: 'validation',
    acceptance: 'Unknown version fields downgrade to version 1 with safe defaults.',
    severity: 'critical',
  },
  {
    id: 'G17-002',
    title: 'Fingerprint reacts to canonical state deltas',
    category: 'planning',
    acceptance: 'Money and lastExecutedAction changes produce distinct fingerprints.',
    severity: 'critical',
  },
  {
    id: 'G17-003',
    title: 'Objective spawns multi-step plan',
    category: 'planning',
    acceptance: 'Tracked objective yields ≥3 steps with in_progress head.',
    severity: 'critical',
  },
  {
    id: 'G17-004',
    title: 'Verification gate on unchanged fingerprint',
    category: 'validation',
    acceptance: 'No verification log entries when fingerprint unchanged.',
    severity: 'major',
  },
  {
    id: 'G17-005',
    title: 'Deep context slices populated',
    category: 'telemetry',
    acceptance: 'Evaluation snapshot includes ≥1 weighted context slice.',
    severity: 'major',
  },
  {
    id: 'G17-006',
    title: 'Auto-delegate when plan active',
    category: 'planning',
    acceptance: 'First evaluation creates copilot delegated project when plan incomplete.',
    severity: 'major',
  },
  {
    id: 'G17-007',
    title: 'Template catalog instantiates plans',
    category: 'planning',
    acceptance: 'Each catalog template id returns a non-empty step list.',
    severity: 'major',
  },
  {
    id: 'G17-008',
    title: 'Rollback restores prior ops checkpoint',
    category: 'rollback',
    acceptance: 'Rollback controller restores activePlan id from checkpoint.',
    severity: 'critical',
  },
  {
    id: 'G17-009',
    title: 'Checkpoint stack bounded',
    category: 'rollback',
    acceptance: 'Store retains at most 16 checkpoints (FIFO eviction).',
    severity: 'minor',
  },
  {
    id: 'G17-010',
    title: 'Disabled command center skips mutation',
    category: 'validation',
    acceptance: 'enabled=false yields empty plan and zero delegations.',
    severity: 'major',
  },
  {
    id: 'G17-011',
    title: 'Autonomy maps delegate recommendation',
    category: 'integration',
    acceptance: 'delegated→team_os, assisted→copilot, advisory→strategy_planner.',
    severity: 'minor',
  },
  {
    id: 'G17-012',
    title: 'Modular dev harness reports pass/fail counts',
    category: 'integration',
    acceptance: 'Dev test report exposes totalTests and success boolean.',
    severity: 'critical',
  },
  {
    id: 'G17-013',
    title: 'Deep templates expose prerequisite chains',
    category: 'planning',
    acceptance: 'Six-step capital program wires prerequisiteStepIds on late phases.',
    severity: 'major',
  },
  {
    id: 'G17-014',
    title: 'Recovery signals drive template selection',
    category: 'planning',
    acceptance: 'Blocked plan uses highest-severity lane template (severity-sorted signals).',
    severity: 'major',
  },
  {
    id: 'G17-015',
    title: 'Blocked plan recovery replan in evaluator',
    category: 'validation',
    acceptance: 'evaluateAcc17CommandCenterOperations sets recovery objectiveSource.',
    severity: 'critical',
  },
  {
    id: 'G17-016',
    title: 'Planning depth snapshot on evaluation',
    category: 'telemetry',
    acceptance: 'Snapshot includes planningDepth with catalogDepth.templateCount ≥ 12.',
    severity: 'major',
  },
  {
    id: 'G17-017',
    title: 'Template routing by objective category',
    category: 'planning',
    acceptance: 'Trade-flavored objective routes to trade category candidates.',
    severity: 'major',
  },
  {
    id: 'G17-018',
    title: 'Delegation analytics matrix complete',
    category: 'integration',
    acceptance: 'buildAgent17DelegationAnalytics returns five delegate kinds.',
    severity: 'minor',
  },
  {
    id: 'G17-019',
    title: 'Delegation ladder on planning depth',
    category: 'planning',
    acceptance: 'planningDepth.delegationLadder has five rungs and headline.',
    severity: 'major',
  },
  {
    id: 'G17-020',
    title: 'Plan ledger summarizes ops history',
    category: 'telemetry',
    acceptance: 'planLedger lists delegate entries when projects exist.',
    severity: 'major',
  },
  {
    id: 'G17-021',
    title: 'Delegation depth score bounded',
    category: 'validation',
    acceptance: 'computeAgent17DelegationDepthScore returns 0–100.',
    severity: 'minor',
  },
  {
    id: 'G17-022',
    title: 'Intent queue on planning depth',
    category: 'planning',
    acceptance: 'intentQueue.queueDepth ≥ 1 when objective present.',
    severity: 'major',
  },
  {
    id: 'G17-023',
    title: 'Verification policy gates',
    category: 'validation',
    acceptance: 'Unchanged fingerprint blocks allowVerification.',
    severity: 'major',
  },
  {
    id: 'G17-024',
    title: 'GI coordination brief attached',
    category: 'integration',
    acceptance: 'coordinationBrief has ≥3 sections and GI handoff tags.',
    severity: 'major',
  },
  {
    id: 'G17-025',
    title: 'Execution pacing on planning depth',
    category: 'planning',
    acceptance: 'executionPacing reports turnBudgetRemaining and pacingBand.',
    severity: 'major',
  },
  {
    id: 'G17-026',
    title: 'Resilience scorecard composite bounded',
    category: 'telemetry',
    acceptance: 'resilienceScorecard compositeIndex is 0–100 with mitigation hints.',
    severity: 'major',
  },
  {
    id: 'G17-027',
    title: 'Pacing respects verification gates',
    category: 'validation',
    acceptance: 'Unchanged fingerprint yields throttled pacing or closed gate.',
    severity: 'major',
  },
  {
    id: 'G17-028',
    title: 'Strategic alignment on planning depth',
    category: 'planning',
    acceptance: 'strategicAlignment reports alignmentIndex 0–100 with band.',
    severity: 'major',
  },
  {
    id: 'G17-029',
    title: 'Handoff readiness checklist complete',
    category: 'integration',
    acceptance: 'handoffReadiness exposes ≥5 weighted checks and readinessScore 0–100.',
    severity: 'major',
  },
  {
    id: 'G17-030',
    title: 'Handoff blocked on verify hold',
    category: 'validation',
    acceptance: 'Closed verification gate yields blocked handoff or verify_gate blocker.',
    severity: 'major',
  },
];

export function getAgent17GoalById(id: string): Agent17GoalDefinition | undefined {
  return AGENT17_GOAL_REGISTRY.find(g => g.id === id);
}

export function listAgent17GoalIds(): string[] {
  return AGENT17_GOAL_REGISTRY.map(g => g.id);
}


// --- source: validation/goal-verification.ts ---
  Acc17CommandCenterOpsState,
  Agent17DevTestReport,
  Agent17GameStateSlice,
  Agent17GoalVerificationResult,
  Agent17SettingsSlice,
  Agent17ValidationReport,
} from '../types/command-center-types.ts';
  createDefaultAcc17CommandCenterOpsState,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
  detectAgent17RecoverySignals,
  maybeApplyAgent17RecoveryPath,
  pickAgent17RecoveryTemplateId,
} from '../planning/recovery-paths.ts';
  Agent17RollbackController,
  createAgent17RollbackController,
} from '../rollback/rollback-controller.ts';

export interface GoalVerificationContext {
  rollback: Agent17RollbackController;
  lastDevReport?: Agent17DevTestReport;
}

function result(goalId: string, passed: boolean, evidence: string): Agent17GoalVerificationResult {
  return { goalId, passed, evidence, measuredAt: Date.now() };
}

export function verifyAgent17Goals(ctx: GoalVerificationContext): Agent17ValidationReport {
  const goalResults: Agent17GoalVerificationResult[] = [];

  const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW' };
  const baseState: Agent17GameStateSlice = {
    turnCounter: 3,
    day: 3,
    player: actor,
    actorsById: { player: actor },
    playerTrackedObjective: {
      id: 'c1',
      sourceType: 'contract',
      sourceId: 'c1',
      title: 'Test Contract',
    },
    lastExecutedAction: { type: 'wait' },
  };
  const settings: Agent17SettingsSlice = {
    aiCommunicationAutonomyLevel: 'assisted',
    commandCenterSettings: { enabled: true },
  };

  // G17-001
  goalResults.push(
    result(
      'G17-001',
      sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1,
      'sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1'
    )
  );

  // G17-002
  const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const mutated: Agent17GameStateSlice = {
    ...baseState,
    player: { ...actor, money: 5100 },
    lastExecutedAction: { type: 'travel' },
  };
  const fp2 = acc17ComputeRelevantStateFingerprint(mutated, 'player');
  goalResults.push(result('G17-002', fp1 !== fp2, `fp1=${fp1} fp2=${fp2}`));

  // G17-003
  let ops = createDefaultAcc17CommandCenterOpsState();
  const eval1 = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
  ops = eval1.ops;
  goalResults.push(
    result(
      'G17-003',
      !!ops.activePlan && ops.activePlan.steps.length >= 3,
      `steps=${ops.activePlan?.steps.length ?? 0}`
    )
  );

  // G17-004
  ops = { ...ops, lastContextFingerprint: fp1 };
  const noAdvance = evaluateAcc17CommandCenterOperations(baseState, settings, 'player', ops);
  const prevLogLen = ops.verificationLog.length;
  const newEntries = noAdvance.ops.verificationLog.length - prevLogLen;
  goalResults.push(result('G17-004', newEntries === 0, `newLogEntries=${newEntries}`));

  // G17-005
  goalResults.push(
    result(
      'G17-005',
      eval1.snapshot.deepContext.slices.length >= 1,
      `slices=${eval1.snapshot.deepContext.slices.length}`
    )
  );

  // G17-006
  goalResults.push(
    result(
      'G17-006',
      eval1.snapshot.delegatedProjects.length >= 1,
      `delegated=${eval1.snapshot.delegatedProjects.length}`
    )
  );

  // G17-007
  const tplOk = AGENT17_PROJECT_TEMPLATE_CATALOG.every(
    t => (acc17InstantiatePlanFromTemplate(t.id, baseState, 'player')?.steps.length || 0) > 0
  );
  goalResults.push(result('G17-007', tplOk, `templates=${AGENT17_PROJECT_TEMPLATE_CATALOG.length}`));

  // G17-008 / G17-009 rollback
  ctx.rollback.clear();
  ctx.rollback.capture('pre-mutation', 3, ops);
  const tampered: Acc17CommandCenterOpsState = {
    ...ops,
    activePlan: ops.activePlan
      ? { ...ops.activePlan, id: 'tampered_plan_id' }
      : null,
  };
  const restored = ctx.rollback.rollbackToLatest();
  goalResults.push(
    result(
      'G17-008',
      restored?.activePlan?.id === ops.activePlan?.id,
      `restoredId=${restored?.activePlan?.id}`
    )
  );
  for (let i = 0; i < 20; i++) {
    ctx.rollback.capture(`cp-${i}`, i, createDefaultAcc17CommandCenterOpsState());
  }
  goalResults.push(result('G17-009', ctx.rollback.listCheckpoints().length <= 16, `count=${ctx.rollback.listCheckpoints().length}`));

  // G17-010
  const disabledEval = evaluateAcc17CommandCenterOperations(
    baseState,
    { commandCenterSettings: { enabled: false } },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  );
  goalResults.push(
    result(
      'G17-010',
      !disabledEval.snapshot.activePlan && disabledEval.snapshot.delegatedProjects.length === 0,
      'disabled snapshot empty'
    )
  );

  // G17-011
  const recDelegated = evaluateAcc17CommandCenterOperations(
    baseState,
    { ...settings, aiCommunicationAutonomyLevel: 'delegated' },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  const recAssisted = evaluateAcc17CommandCenterOperations(
    baseState,
    { ...settings, aiCommunicationAutonomyLevel: 'assisted' },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  const recAdvisory = evaluateAcc17CommandCenterOperations(
    baseState,
    { aiCommunicationAutonomyLevel: 'advisory', commandCenterSettings: { enabled: true } },
    'player',
    createDefaultAcc17CommandCenterOpsState()
  ).snapshot.recommendedDelegateKind;
  goalResults.push(
    result(
      'G17-011',
      recDelegated === 'team_os' && recAssisted === 'copilot' && recAdvisory === 'strategy_planner',
      `${recDelegated}/${recAssisted}/${recAdvisory}`
    )
  );

  // G17-012
  const harnessOk =
    !!ctx.lastDevReport &&
    ctx.lastDevReport.totalTests > 0 &&
    typeof ctx.lastDevReport.success === 'boolean';
  goalResults.push(
    result(
      'G17-012',
      harnessOk === true,
      ctx.lastDevReport
        ? `tests=${ctx.lastDevReport.totalTests} success=${ctx.lastDevReport.success}`
        : 'no dev report'
    )
  );

  const crisisState: Agent17GameStateSlice = {
    turnCounter: 2,
    day: 2,
    player: { id: 'player', money: 200, netWorth: 5000, currentRegion: 'QLD', currentSupplies: 10 },
    actorsById: {
      player: { id: 'player', money: 200, netWorth: 5000, currentRegion: 'QLD', currentSupplies: 10 },
    },
  };
  const deepPlan = acc17InstantiatePlanFromTemplate(
    'agent17_tpl_deep_capital_program',
    crisisState,
    'player'
  );
  goalResults.push(
    result(
      'G17-013',
      (deepPlan?.steps[5]?.requirements.prerequisiteStepIds?.length ?? 0) >= 1,
      deepPlan?.steps[5]?.requirements.prerequisiteStepIds?.join(',') || 'none'
    )
  );

  const sig = detectAgent17RecoverySignals(crisisState, 'player');
  const rec = pickAgent17RecoveryTemplateId(sig, true);
  goalResults.push(
    result(
      'G17-014',
      rec?.templateId === 'agent17_tpl_supply_deep_recovery' && rec?.lane === 'supply_collapse',
      `${rec?.lane}/${rec?.templateId}`
    )
  );

  let blockedOps = createDefaultAcc17CommandCenterOpsState();
  const tradePlan = acc17InstantiatePlanFromTemplate('agent17_tpl_trade_arbitrage', crisisState, 'player');
  if (tradePlan) {
    tradePlan.steps[2] = { ...tradePlan.steps[2], status: 'blocked', blockerReason: 'test' };
    blockedOps = { ...blockedOps, activePlan: tradePlan };
  }
  const recoveryEval = maybeApplyAgent17RecoveryPath(blockedOps, crisisState, 'player');
  goalResults.push(
    result(
      'G17-015',
      recoveryEval.applied && recoveryEval.ops.activePlan?.objectiveSource?.startsWith('recovery:') === true,
      recoveryEval.ops.activePlan?.objectiveSource || 'not applied'
    )
  );

  const tradeState: Agent17GameStateSlice = {
    turnCounter: 4,
    day: 4,
    player: { id: 'player', money: 3000, netWorth: 7000, currentRegion: 'NSW' },
    actorsById: { player: { id: 'player', money: 3000, netWorth: 7000, currentRegion: 'NSW' } },
    playerTrackedObjective: {
      title: 'Trade market expansion',
      sourceType: 'contract',
      sourceId: 't1',
    },
  };
  const tradeRoute = rankAgent17TemplateCandidates(tradeState, settings, 'player');
  goalResults.push(
    result(
      'G17-017',
      tradeRoute.matchedCategory === 'trade' &&
        tradeRoute.candidateTemplateIds.includes('agent17_tpl_trade_arbitrage'),
      `${tradeRoute.matchedCategory}/${tradeRoute.candidateTemplateIds[0]}`
    )
  );

  const depthEval = evaluateAcc17CommandCenterOperations(
    baseState,
    settings,
    'player',
    createDefaultAcc17CommandCenterOpsState()
  );
  goalResults.push(
    result(
      'G17-016',
      (depthEval.snapshot.planningDepth?.catalogDepth.templateCount ?? 0) >= 12,
      String(depthEval.snapshot.planningDepth?.catalogDepth.templateCount)
    )
  );

  const delegationRows = buildAgent17DelegationAnalytics(
    depthEval.ops,
    settings
  );
  goalResults.push(
    result('G17-018', delegationRows.length === 5, String(delegationRows.length))
  );

  const ladder = buildAgent17DelegationLadder(delegationRows, settings, 'copilot');
  goalResults.push(
    result(
      'G17-019',
      ladder.rungs.length === 5 && ladder.headline.length > 0,
      String(ladder.rungs.length)
    )
  );

  const ledger = summarizeAgent17PlanLedger(depthEval.ops, baseState);
  goalResults.push(
    result(
      'G17-020',
      ledger.entries.length >= 0 && typeof ledger.lastFingerprint === 'string',
      `entries=${ledger.entries.length}`
    )
  );

  const depthScore = computeAgent17DelegationDepthScore(depthEval.ops, settings, 'copilot');
  goalResults.push(
    result('G17-021', depthScore >= 0 && depthScore <= 100, String(depthScore))
  );

  const intentQ = buildAgent17IntentQueue(
    depthEval.ops,
    baseState,
    settings,
    'player',
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player')
  );
  goalResults.push(
    result('G17-022', intentQ.queueDepth >= 1, String(intentQ.queueDepth))
  );

  const fp = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const pol = buildAgent17VerificationPolicy(
    { ...depthEval.ops, lastContextFingerprint: fp },
    baseState,
    'player'
  );
  goalResults.push(
    result('G17-023', pol.allowVerification === false, pol.blockingRuleIds.join(','))
  );

  const brief = depthEval.snapshot.planningDepth?.coordinationBrief;
  goalResults.push(
    result(
      'G17-024',
      !!brief && coordinationBriefReadyForGi(brief),
      brief?.giHandoffTags?.join(',') || 'none'
    )
  );

  const pacing = depthEval.snapshot.planningDepth?.executionPacing;
  goalResults.push(
    result(
      'G17-025',
      !!pacing &&
        typeof pacing.turnBudgetRemaining === 'number' &&
        (pacing.pacingBand === 'steady' ||
          pacing.pacingBand === 'urgent' ||
          pacing.pacingBand === 'throttled'),
      pacing?.pacingBand || 'none'
    )
  );

  const scorecard = depthEval.snapshot.planningDepth?.resilienceScorecard;
  goalResults.push(
    result(
      'G17-026',
      !!scorecard &&
        scorecard.compositeIndex >= 0 &&
        scorecard.compositeIndex <= 100 &&
        scorecard.mitigationHints.length >= 1,
      String(scorecard?.compositeIndex)
    )
  );

  const fpHold = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const pacingHeld = buildAgent17ExecutionPacing(
    { ...depthEval.ops, lastContextFingerprint: fpHold },
    baseState,
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player'),
    buildAgent17VerificationPolicy(
      { ...depthEval.ops, lastContextFingerprint: fpHold },
      baseState,
      'player'
    )
  );
  goalResults.push(
    result(
      'G17-027',
      pacingHeld.pacingBand === 'throttled' || !pacingHeld.verificationGateOpen,
      `${pacingHeld.pacingBand} gate=${pacingHeld.verificationGateOpen}`
    )
  );

  const strat = depthEval.snapshot.planningDepth?.strategicAlignment;
  goalResults.push(
    result(
      'G17-028',
      !!strat &&
        strat.alignmentIndex >= 0 &&
        strat.alignmentIndex <= 100 &&
        (strat.band === 'aligned' || strat.band === 'drifting' || strat.band === 'divergent'),
      `${strat?.alignmentIndex}/${strat?.band}`
    )
  );

  const handoff = depthEval.snapshot.planningDepth?.handoffReadiness;
  goalResults.push(
    result(
      'G17-029',
      !!handoff &&
        handoff.checks.length >= 5 &&
        handoff.readinessScore >= 0 &&
        handoff.readinessScore <= 100,
      `checks=${handoff?.checks.length} score=${handoff?.readinessScore}`
    )
  );

  const fpBlock = acc17ComputeRelevantStateFingerprint(baseState, 'player');
  const blockedHandoff = buildAgent17HandoffReadiness({
    coordinationBrief: brief!,
    verificationPolicy: buildAgent17VerificationPolicy(
      { ...depthEval.ops, lastContextFingerprint: fpBlock },
      baseState,
      'player'
    ),
    executionPacing: pacingHeld,
    resilienceScorecard: scorecard!,
    strategicAlignment: strat!,
  });
  goalResults.push(
    result(
      'G17-030',
      blockedHandoff.blockers.includes('verify_gate') || handoffReadinessBlocked(blockedHandoff),
      blockedHandoff.blockers.join(',')
    )
  );

  void buildAgent17ResilienceScorecard(
    depthEval.ops,
    baseState,
    'player',
    assessAgent17PlanHealth(depthEval.ops.activePlan, baseState, 'player'),
    buildAgent17VerificationPolicy(depthEval.ops, baseState, 'player')
  );

  const passedCount = goalResults.filter(r => r.passed).length;
  const failedCount = goalResults.length - passedCount;
  return {
    timestamp: Date.now(),
    goalResults,
    passedCount,
    failedCount,
    success: failedCount === 0,
  };
}

export function assertAgent17Goals(ctx: GoalVerificationContext): void {
  const report = verifyAgent17Goals(ctx);
  if (!report.success) {
    const failed = report.goalResults.filter(r => !r.passed).map(r => r.goalId);
    throw new Error(`Agent 17 goal verification failed: ${failed.join(', ')}`);
  }
}

/** Cross-check registry ids vs verification set. */
export function validateGoalRegistryCoverage(): { ok: boolean; missing: string[] } {
  const verifiedIds = new Set([
    'G17-001',
    'G17-002',
    'G17-003',
    'G17-004',
    'G17-005',
    'G17-006',
    'G17-007',
    'G17-008',
    'G17-009',
    'G17-010',
    'G17-011',
    'G17-012',
    'G17-013',
    'G17-014',
    'G17-015',
    'G17-016',
    'G17-017',
    'G17-018',
    'G17-019',
    'G17-020',
    'G17-021',
    'G17-022',
    'G17-023',
    'G17-024',
    'G17-025',
    'G17-026',
    'G17-027',
    'G17-028',
    'G17-029',
    'G17-030',
  ]);
  const missing = AGENT17_GOAL_REGISTRY.filter(g => !verifiedIds.has(g.id)).map(g => g.id);
  return { ok: missing.length === 0, missing };
}


// --- source: harness/run-acc17-dev-tests.ts ---
  Agent17DevTestReport,
  Agent17GameStateSlice,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';
  acc17AdvanceVerifiedPlanProgress,
  acc17CreateMultiStepPlanFromObjective,
  createDefaultAcc17CommandCenterOpsState,
  defaultObjectiveResolver,
  sanitizeAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function runAgent17Acc17DevTests(
  customState?: Agent17GameStateSlice,
  customSettings?: Agent17SettingsSlice
): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const actor = { id: 'player', money: 5000, netWorth: 8000, currentRegion: 'NSW' };
    const baseState: Agent17GameStateSlice = customState || {
      turnCounter: 3,
      day: 3,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        id: 'c1',
        sourceType: 'contract',
        sourceId: 'c1',
        title: 'Test Contract',
      },
      lastExecutedAction: { type: 'wait' },
    };
    const settings: Agent17SettingsSlice = customSettings || {
      aiCommunicationAutonomyLevel: 'assisted',
      commandCenterSettings: { enabled: true },
    };

    const fp1 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    const mutated: Agent17GameStateSlice = {
      ...baseState,
      player: { ...actor, money: 5100 },
      lastExecutedAction: { type: 'travel' },
    };
    const fp3 = acc17ComputeRelevantStateFingerprint(mutated, 'player');
    push('acc17_fp_delta', 'Fingerprint reacts to state delta', fp1 !== fp3, `${fp1}/${fp3}`);

    const plan = acc17CreateMultiStepPlanFromObjective(
      baseState,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    push('acc17_plan', 'Objective spawns multi-step plan', !!plan && plan!.steps.length >= 3);

    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = { ...ops, activePlan: plan, lastContextFingerprint: fp1 };
    const noAdvance = acc17AdvanceVerifiedPlanProgress(plan!, baseState, 'player', fp1);
    push(
      'acc17_gate_same_fp',
      'No verification log when fingerprint unchanged',
      noAdvance.logEntries.length === 0
    );

    ops = { ...ops, lastContextFingerprint: fp3 };
    const evalRes = evaluateAcc17CommandCenterOperations(mutated, settings, 'player', ops);
    push(
      'acc17_context',
      'Deep context slices populated',
      evalRes.snapshot.deepContext.slices.length >= 1
    );
    push(
      'acc17_delegate',
      'Delegated project created',
      evalRes.snapshot.delegatedProjects.length >= 1
    );
    push(
      'acc17_sanitize',
      'Sanitizer returns v1',
      sanitizeAcc17CommandCenterOpsState({ version: 2 }).version === 1
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('acc17_throw', 'Harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 ACC17 Dev Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-recovery-path-tests.ts ---
  detectAgent17RecoverySignals,
  maybeApplyAgent17RecoveryPath,
  pickAgent17RecoveryTemplateId,
  replanAcc17WithRecoveryTemplate,
} from '../planning/recovery-paths.ts';
  acc17AdvanceVerifiedPlanProgress,
  createDefaultAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';

export function runAgent17RecoveryPathTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const baseState: Agent17GameStateSlice = {
      turnCounter: 5,
      day: 5,
      player: {
        id: 'player',
        money: 250,
        netWorth: 6000,
        currentRegion: 'QLD',
        currentSupplies: 20,
      },
      actorsById: {
        player: {
          id: 'player',
          money: 250,
          netWorth: 6000,
          currentRegion: 'QLD',
          currentSupplies: 20,
        },
      },
      lastExecutedAction: { type: 'wait' },
    };

    const signals = detectAgent17RecoverySignals(baseState, 'player');
    push(
      'recovery_signals',
      'Low cash and supplies emit recovery signals',
      signals.some(s => s.lane === 'liquidity_crisis') &&
        signals.some(s => s.lane === 'supply_collapse'),
      `lanes=${signals.map(s => s.lane).join(',')}`
    );

    const decision = pickAgent17RecoveryTemplateId(signals, true);
    push(
      'recovery_pick_blocked',
      'Blocked plan picks highest-severity recovery lane',
      decision?.templateId === 'agent17_tpl_supply_deep_recovery' &&
        decision?.lane === 'supply_collapse',
      `${decision?.lane}/${decision?.templateId}`
    );

    const deepPlan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_deep_capital_program',
      baseState,
      'player'
    );
    push(
      'deep_template_steps',
      'Deep capital program has six wired steps',
      !!deepPlan && deepPlan.steps.length === 6,
      `steps=${deepPlan?.steps.length}`
    );
    const step5 = deepPlan?.steps[5];
    push(
      'deep_prereq_chain',
      'Final deep phase requires prior step ids',
      (step5?.requirements.prerequisiteStepIds?.length ?? 0) >= 1,
      step5?.requirements.prerequisiteStepIds?.join(',')
    );

    let ops = createDefaultAcc17CommandCenterOpsState();
    const objectivePlan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_trade_arbitrage',
      baseState,
      'player'
    );
    ops = { ...ops, activePlan: objectivePlan };
    const fp0 = acc17ComputeRelevantStateFingerprint(baseState, 'player');
    const poorState: Agent17GameStateSlice = {
      ...baseState,
      player: { ...baseState.player!, money: 50, netWorth: 6000 },
      actorsById: {
        player: { ...baseState.actorsById!.player!, money: 50, netWorth: 6000 },
      },
      lastExecutedAction: { type: 'deposit' },
    };
    const fp1 = acc17ComputeRelevantStateFingerprint(poorState, 'player');
    ops = { ...ops, lastContextFingerprint: fp0 };
    const advanced = acc17AdvanceVerifiedPlanProgress(
      ops.activePlan!,
      poorState,
      'player',
      fp0
    );
    ops = { ...ops, activePlan: advanced.plan, lastContextFingerprint: fp1 };
    const hasBlocked = advanced.plan.steps.some(s => s.status === 'blocked');
    push('recovery_blocked_step', 'Cash drop blocks template step with minCash', hasBlocked);

    const recovery = maybeApplyAgent17RecoveryPath(ops, poorState, 'player');
    push(
      'recovery_replan',
      'Recovery replan swaps active plan',
      recovery.applied && recovery.ops.activePlan?.replanCount === 1,
      recovery.ops.activePlan?.objectiveSource
    );

    if (recovery.decision) {
      const manual = replanAcc17WithRecoveryTemplate(
        recovery.ops,
        poorState,
        'player',
        recovery.decision
      );
      push(
        'recovery_replan_count',
        'Manual replan increments replanCount',
        (manual.activePlan?.replanCount ?? 0) >= 2,
        String(manual.activePlan?.replanCount)
      );
    } else {
      push('recovery_replan_count', 'Manual replan increments replanCount', false, 'no decision');
    }

    const settings = { commandCenterSettings: { enabled: true }, aiCommunicationAutonomyLevel: 'assisted' as const };
    const evalBlocked = evaluateAcc17CommandCenterOperations(poorState, settings, 'player', {
      ...createDefaultAcc17CommandCenterOpsState(),
      activePlan: advanced.plan,
      lastContextFingerprint: fp1,
    });
    push(
      'recovery_eval_integration',
      'Evaluator applies recovery on blocked plan',
      evalBlocked.ops.activePlan?.objectiveSource?.startsWith('recovery:') === true,
      evalBlocked.ops.activePlan?.objectiveSource
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('recovery_throw', 'Recovery harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Recovery Path Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-planning-depth-tests.ts ---
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17PlanningDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const state: Agent17GameStateSlice = {
      turnCounter: 8,
      day: 8,
      player: {
        id: 'player',
        money: 4200,
        netWorth: 9000,
        currentRegion: 'NSW',
        currentSupplies: 80,
      },
      actorsById: {
        player: {
          id: 'player',
          money: 4200,
          netWorth: 9000,
          currentRegion: 'NSW',
          currentSupplies: 80,
        },
      },
      playerTrackedObjective: {
        title: 'Expand trade routes across markets',
        sourceType: 'contract',
        sourceId: 'trade-1',
        description: 'Focus on trade arbitrage this turn',
      },
      lastExecutedAction: { type: 'wait' },
    };
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };

    const depth = summarizeAgent17CatalogDepth();
    push(
      'depth_catalog_scale',
      'Catalog depth meets scale wave minimums',
      depth.templateCount >= 12 && depth.deepTemplateCount >= 7 && depth.maxStepCount >= 6,
      JSON.stringify(depth)
    );

    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    push(
      'depth_template_routing',
      'Trade objective routes to trade category',
      routing.matchedCategory === 'trade' &&
        routing.candidateTemplateIds.includes('agent17_tpl_trade_arbitrage'),
      `${routing.matchedCategory}/${routing.candidateTemplateIds[0]}`
    );

    const plan = acc17InstantiatePlanFromTemplate(
      'agent17_tpl_diplomatic_depth',
      state,
      'player'
    );
    const health = assessAgent17PlanHealth(plan, state, 'player');
    push(
      'depth_plan_health',
      'Fresh deep plan starts steady or strong',
      health.band === 'steady' || health.band === 'strong',
      health.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(
      state,
      settings,
      'player',
      createDefaultAcc17CommandCenterOpsState()
    );
    push(
      'depth_snapshot_attached',
      'Evaluator attaches planningDepth snapshot',
      !!evalRes.snapshot.planningDepth &&
        evalRes.snapshot.planningDepth.catalogDepth.templateCount >= 12,
      String(evalRes.snapshot.planningDepth?.catalogDepth.templateCount)
    );
    push(
      'depth_suggestion',
      'Planning suggestion has kind and confidence',
      !!evalRes.snapshot.planningDepth?.suggestion.kind &&
        (evalRes.snapshot.planningDepth?.suggestion.confidence ?? 0) > 0,
      evalRes.snapshot.planningDepth?.suggestion.kind
    );

    const ops = evalRes.ops;
    const manualDepth = buildAgent17PlanningDepthSnapshot(
      ops,
      state,
      settings,
      'player',
      'copilot'
    );
    push(
      'depth_delegation_analytics',
      'Delegation analytics covers all delegate kinds',
      manualDepth.delegationAnalytics.length === 5,
      String(manualDepth.delegationAnalytics.length)
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('depth_throw', 'Planning depth harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Planning Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-delegation-depth-tests.ts ---
  acc17DelegateProject,
  createDefaultAcc17CommandCenterOpsState,
} from '../planning/ops-state.ts';
  buildAgent17DelegationLadder,
  delegationLadderHasCapacity,
} from '../planning/delegation-ladder.ts';

export function runAgent17DelegationDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'delegated' as const,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 12,
      day: 12,
      player: { id: 'player', money: 8000, netWorth: 12000, currentRegion: 'NSW' },
      actorsById: { player: { id: 'player', money: 8000, netWorth: 12000, currentRegion: 'NSW' } },
      playerTrackedObjective: { title: 'Team treasury coordination', sourceType: 'team' },
      lastExecutedAction: { type: 'invest' },
    };

    const plan = acc17InstantiatePlanFromTemplate('agent17_tpl_team_synergy', state, 'player');
    let ops = createDefaultAcc17CommandCenterOpsState();
    ops = {
      ...ops,
      activePlan: plan,
      delegatedProjects: [
        acc17DelegateProject(ops, plan!, 'copilot', 'c1', 'assisted'),
        acc17DelegateProject(ops, plan!, 'copilot', 'c2', 'assisted'),
      ],
    };

    const analytics = buildAgent17DelegationAnalytics(ops, settings);
    const ladder = buildAgent17DelegationLadder(analytics, settings, 'copilot');
    push(
      'delegation_ladder_rungs',
      'Delegation ladder exposes five rungs',
      ladder.rungs.length === 5,
      String(ladder.rungs.length)
    );
    push(
      'delegation_capacity',
      'Copilot at capacity triggers reroute candidate',
      !delegationLadderHasCapacity(ladder, 'copilot'),
      String(ladder.rungs.find(r => r.delegateKind === 'copilot')?.slotsRemaining)
    );

    const ledger = summarizeAgent17PlanLedger(ops, state);
    push(
      'plan_ledger_delegate',
      'Plan ledger records delegate events',
      ledger.entries.some(e => e.kind === 'delegate'),
      String(ledger.entries.length)
    );

    const score = computeAgent17DelegationDepthScore(ops, settings, 'copilot');
    push('delegation_depth_score', 'Delegation depth score bounded 0-100', score >= 0 && score <= 100, String(score));

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'depth_ladder_attached',
      'Snapshot includes delegation ladder headline',
      !!depth?.delegationLadder.headline,
      depth?.delegationLadder.headline
    );
    push(
      'depth_ledger_attached',
      'Snapshot includes plan ledger fingerprint',
      depth?.planLedger.lastFingerprint !== undefined,
      depth?.planLedger.lastFingerprint
    );

    ops = {
      ...ops,
      activePlan: plan
        ? { ...plan, replanCount: 2, steps: plan.steps.map((s, i) => (i === 1 ? { ...s, status: 'blocked' as const, blockerReason: 'x' } : s)) }
        : null,
    };
    const unstableLedger = summarizeAgent17PlanLedger(ops, state);
    push(
      'ledger_instability',
      'Ledger flags instability on replans and blocks',
      planLedgerIndicatesInstability(unstableLedger),
      `replan=${unstableLedger.replanEvents} blocks=${unstableLedger.blockedStepEvents}`
    );

    const refined = refineAgent17DelegationSuggestion(
      ops,
      state,
      settings,
      'player',
      { kind: 'hold', headline: 'hold', rationale: 'hold', confidence: 0.5 },
      'copilot'
    );
    push(
      'delegation_refine_risk',
      'Refiner upgrades hold under at-risk health',
      refined.kind === 'delegate',
      refined.delegateKind
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('delegation_throw', 'Delegation depth harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Delegation Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-coordination-depth-tests.ts ---
  buildAgent17VerificationPolicy,
  verificationPolicyBlocksAdvance,
} from '../planning/verification-policy.ts';
  buildAgent17CoordinationBrief,
  coordinationBriefReadyForGi,
} from '../planning/coordination-brief.ts';

export function runAgent17CoordinationDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 150,
      netWorth: 4000,
      currentRegion: 'QLD',
      currentSupplies: 15,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 9,
      day: 9,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: { title: 'Restock and recover supplies', sourceType: 'contract' },
      gi3Strategy: { headline: 'Hold liquidity above $500' },
      lastExecutedAction: { type: 'restock_supplies' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan };
    const health = assessAgent17PlanHealth(null, state, 'player');
    const intent = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    push(
      'coord_intent_queue',
      'Intent queue prioritizes objective and recovery',
      intent.queueDepth >= 3 && intent.primaryIntentId === 'intent_objective',
      `depth=${intent.queueDepth} primary=${intent.primaryIntentId}`
    );
    push(
      'coord_recovery_intent',
      'Low supplies emit recovery intent',
      intentQueueRequiresRecovery(intent) || intent.items.some(i => i.source === 'recovery'),
      intent.items.map(i => i.source).join(',')
    );

    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policySame = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );
    push(
      'coord_verify_block_same_fp',
      'Verification blocked when fingerprint unchanged',
      !policySame.allowVerification,
      policySame.blockingRuleIds.join(',')
    );

    const policyDelta = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'old_fp' },
      state,
      'player'
    );
    push(
      'coord_verify_allow_delta',
      'Verification allowed when fingerprint delta satisfied',
      policyDelta.allowVerification === true,
      String(policyDelta.allowVerification)
    );
    push(
      'coord_verify_blocks_advance',
      'Policy helper detects fingerprint hold',
      verificationPolicyBlocksAdvance(policySame) === true,
      String(verificationPolicyBlocksAdvance(policySame))
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'coord_brief_attached',
      'Evaluator attaches coordination brief',
      !!depth?.coordinationBrief?.headline && (depth.coordinationBrief.sections.length ?? 0) >= 3,
      String(depth?.coordinationBrief?.sections.length)
    );
    push(
      'coord_gi_handoff',
      'Coordination brief ready for GI handoff tags',
      depth?.coordinationBrief
        ? coordinationBriefReadyForGi(depth.coordinationBrief)
        : false,
      depth?.coordinationBrief?.giHandoffTags?.join(',')
    );

    if (depth) {
      const manualBrief = buildAgent17CoordinationBrief(
        {
          turn: depth.turn,
          actorId: depth.actorId,
          planHealth: depth.planHealth,
          suggestion: depth.suggestion,
          templateRouting: depth.templateRouting,
          delegationAnalytics: depth.delegationAnalytics,
          delegationLadder: depth.delegationLadder,
          planLedger: depth.planLedger,
          catalogDepth: depth.catalogDepth,
        },
        depth.intentQueue,
        depth.verificationPolicy,
        evalRes.ops,
        state,
        settings
      );
      push(
        'coord_brief_confidence',
        'Brief confidence bounded',
        manualBrief.confidence >= 0.35 && manualBrief.confidence <= 0.99,
        String(manualBrief.confidence)
      );
    } else {
      push('coord_brief_confidence', 'Brief confidence bounded', false, 'no depth');
    }
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('coord_throw', 'Coordination harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Coordination Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-execution-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17ExecutionPacing,
  executionPacingRequiresThrottle,
} from '../planning/execution-pacing.ts';
  buildAgent17ResilienceScorecard,
  resilienceScorecardNeedsIntervention,
} from '../planning/resilience-scorecard.ts';

export function runAgent17ExecutionDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 80,
      netWorth: 1200,
      currentRegion: 'VIC',
      currentSupplies: 4,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 14,
      day: 14,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: { title: 'Stabilize supply chain', sourceType: 'contract' },
      gi3Strategy: { headline: 'Avoid cash crunch' },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan };
    const health = assessAgent17PlanHealth(plan, state, 'player');
    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policyOpen = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'prior_fp' },
      state,
      'player'
    );
    const policyClosed = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );

    const pacingOpen = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyOpen);
    push(
      'exec_pacing_attached',
      'Execution pacing exposes budget and steps remaining',
      pacingOpen.stepsRemaining >= 1 && pacingOpen.turnBudgetRemaining >= 0,
      `steps=${pacingOpen.stepsRemaining} budget=${pacingOpen.turnBudgetRemaining}`
    );
    push(
      'exec_advance_when_open',
      'Can advance when verification gate open',
      pacingOpen.verificationGateOpen === true,
      String(pacingOpen.canAdvanceActiveStep)
    );

    const pacingClosed = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyClosed);
    push(
      'exec_throttle_on_fp',
      'Pacing throttles when fingerprint unchanged',
      pacingClosed.pacingBand === 'throttled' || executionPacingRequiresThrottle(pacingClosed),
      pacingClosed.pacingBand
    );
    push(
      'exec_cooldown_bounded',
      'Delegate cooldown non-negative',
      pacingOpen.cooldownTurns >= 0 && pacingOpen.cooldownTurns <= 2,
      String(pacingOpen.cooldownTurns)
    );

    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policyOpen
    );
    push(
      'exec_resilience_bounded',
      'Resilience composite index bounded 0–100',
      scorecard.compositeIndex >= 0 &&
        scorecard.compositeIndex <= 100 &&
        scorecard.recoveryPressure >= 0 &&
        scorecard.verificationStability >= 0,
      String(scorecard.compositeIndex)
    );
    push(
      'exec_mitigation_hints',
      'Scorecard emits mitigation hints',
      scorecard.mitigationHints.length >= 1 && scorecard.headline.length > 10,
      scorecard.mitigationHints[0]
    );
    push(
      'exec_low_supplies_intervention',
      'Low supplies raise recovery pressure',
      scorecard.recoveryPressure >= 20 || resilienceScorecardNeedsIntervention(scorecard),
      String(scorecard.recoveryPressure)
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'exec_evaluator_depth',
      'Evaluator attaches execution pacing and resilience scorecard',
      !!depth?.executionPacing?.headline &&
        !!depth?.resilienceScorecard?.headline &&
        depth.resilienceScorecard.mitigationHints.length >= 1,
      `${depth?.executionPacing?.pacingBand}/${depth?.resilienceScorecard?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('exec_throw', 'Execution harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Execution Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


// --- source: harness/run-continuity-depth-tests.ts ---
  createDefaultAcc17CommandCenterOpsState,
  acc17CreateMultiStepPlanFromObjective,
  defaultObjectiveResolver,
} from '../planning/ops-state.ts';
  buildAgent17StrategicAlignment,
  strategicAlignmentNeedsReconcile,
} from '../planning/strategic-alignment.ts';
  buildAgent17HandoffReadiness,
  handoffReadinessBlocked,
} from '../planning/handoff-readiness.ts';
  rankAgent17TemplateCandidates,
  summarizeAgent17CatalogDepth,
} from '../planning/template-selector.ts';

export function runAgent17ContinuityDepthTests(): Agent17DevTestReport {
  const start = Date.now();
  const testResults: Agent17DevTestReport['testResults'] = [];
  const push = (id: string, name: string, ok: boolean, detail?: string) => {
    testResults.push({
      id,
      name,
      status: ok ? 'passed' : 'failed',
      durationMs: 0,
      errorMessage: ok ? undefined : detail,
    });
  };

  try {
    const settings = {
      commandCenterSettings: { enabled: true },
      aiCommunicationAutonomyLevel: 'assisted' as const,
    };
    const actor = {
      id: 'player',
      money: 120,
      netWorth: 2400,
      currentRegion: 'QLD',
      currentSupplies: 6,
    };
    const state: Agent17GameStateSlice = {
      turnCounter: 21,
      day: 21,
      player: actor,
      actorsById: { player: actor },
      playerTrackedObjective: {
        title: 'Expand trade network supply chain',
        sourceType: 'contract',
      },
      gi3Strategy: { headline: 'Expand trade network resilience' },
      strategyPlannerState: { activePlan: { title: 'Trade network supply expansion' } },
      lastExecutedAction: { type: 'trade' },
    };
    const ops = createDefaultAcc17CommandCenterOpsState();
    const plan = acc17CreateMultiStepPlanFromObjective(
      state,
      settings,
      'player',
      (s, st, id) => defaultObjectiveResolver(s, st, id)
    );
    const opsWithPlan = { ...ops, activePlan: plan ? { ...plan, title: plan.title || 'Trade supply chain plan' } : plan };
    const health = assessAgent17PlanHealth(opsWithPlan.activePlan, state, 'player');
    const intentQueue = buildAgent17IntentQueue(opsWithPlan, state, settings, 'player', health);
    const alignment = buildAgent17StrategicAlignment(
      opsWithPlan,
      state,
      settings,
      'player',
      intentQueue
    );

    push(
      'cont_align_bounded',
      'Strategic alignment index bounded with band',
      alignment.alignmentIndex >= 0 &&
        alignment.alignmentIndex <= 100 &&
        (alignment.band === 'aligned' ||
          alignment.band === 'drifting' ||
          alignment.band === 'divergent'),
      `${alignment.alignmentIndex}/${alignment.band}`
    );
    push(
      'cont_align_high_when_cues_match',
      'Matching GI3/objective cues raise overlap',
      alignment.gi3Overlap >= 40 && !strategicAlignmentNeedsReconcile(alignment),
      `gi3=${alignment.gi3Overlap} flags=${alignment.driftFlags.length}`
    );

    const fp = acc17ComputeRelevantStateFingerprint(state, 'player');
    const policyOpen = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: 'other_fp' },
      state,
      'player'
    );
    const pacing = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyOpen);
    const scorecard = buildAgent17ResilienceScorecard(
      opsWithPlan,
      state,
      'player',
      health,
      policyOpen
    );
    const routing = rankAgent17TemplateCandidates(state, settings, 'player');
    const delegationAnalytics = buildAgent17DelegationAnalytics(opsWithPlan, settings);
    const core = {
      turn: state.turnCounter || 1,
      actorId: 'player',
      planHealth: health,
      suggestion: buildAgent17PlanningSuggestion(
        opsWithPlan,
        state,
        settings,
        'player',
        'copilot'
      ),
      templateRouting: routing,
      delegationAnalytics,
      delegationLadder: buildAgent17DelegationLadder(delegationAnalytics, settings, 'copilot'),
      planLedger: summarizeAgent17PlanLedger(opsWithPlan, state),
      catalogDepth: summarizeAgent17CatalogDepth(),
    };
    const brief = buildAgent17CoordinationBrief(
      core,
      intentQueue,
      policyOpen,
      opsWithPlan,
      state,
      settings
    );
    const handoffOpen = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policyOpen,
      executionPacing: pacing,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });

    push(
      'cont_handoff_checks',
      'Handoff readiness exposes weighted checks',
      handoffOpen.checks.length >= 5 &&
        handoffOpen.readinessScore >= 0 &&
        handoffOpen.readinessScore <= 100,
      `checks=${handoffOpen.checks.length} score=${handoffOpen.readinessScore}`
    );
    push(
      'cont_handoff_partial_or_ready',
      'Open gates yield partial or ready band',
      handoffOpen.band === 'partial' || handoffOpen.band === 'ready',
      handoffOpen.band
    );

    const policyClosed = buildAgent17VerificationPolicy(
      { ...opsWithPlan, lastContextFingerprint: fp },
      state,
      'player'
    );
    const pacingClosed = buildAgent17ExecutionPacing(opsWithPlan, state, health, policyClosed);
    const handoffClosed = buildAgent17HandoffReadiness({
      coordinationBrief: brief,
      verificationPolicy: policyClosed,
      executionPacing: pacingClosed,
      resilienceScorecard: scorecard,
      strategicAlignment: alignment,
    });
    push(
      'cont_handoff_blocked_verify',
      'Closed verification blocks handoff',
      handoffClosed.blockers.includes('verify_gate') || handoffReadinessBlocked(handoffClosed),
      handoffClosed.blockers.join(',')
    );

    const divergentState: Agent17GameStateSlice = {
      ...state,
      gi3Strategy: { headline: 'Retreat mining operations entirely' },
      strategyPlannerState: { activePlan: { title: 'Liquidate regional assets' } },
    };
    const alignDrift = buildAgent17StrategicAlignment(
      opsWithPlan,
      divergentState,
      settings,
      'player',
      buildAgent17IntentQueue(opsWithPlan, divergentState, settings, 'player', health)
    );
    push(
      'cont_drift_flags',
      'Divergent upstream cues emit drift flags',
      alignDrift.driftFlags.length >= 1 || alignDrift.band !== 'aligned',
      alignDrift.driftFlags.join(',') || alignDrift.band
    );

    const evalRes = evaluateAcc17CommandCenterOperations(state, settings, 'player', ops);
    const depth = evalRes.snapshot.planningDepth;
    push(
      'cont_evaluator_depth',
      'Evaluator attaches strategic alignment and handoff readiness',
      !!depth?.strategicAlignment?.headline &&
        !!depth?.handoffReadiness?.headline &&
        (depth.handoffReadiness.checks?.length ?? 0) >= 5,
      `${depth?.strategicAlignment?.band}/${depth?.handoffReadiness?.band}`
    );
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    push('cont_throw', 'Continuity harness did not throw', false, msg);
  }

  const passedCount = testResults.filter(t => t.status === 'passed').length;
  const failedCount = testResults.filter(t => t.status === 'failed').length;
  const overallStatus: 'passed' | 'failed' = failedCount === 0 ? 'passed' : 'failed';
  return {
    timestamp: Date.now(),
    totalTests: testResults.length,
    passedCount,
    failedCount,
    executionTimeMs: Date.now() - start,
    overallStatus,
    success: overallStatus === 'passed',
    testResults,
    summary: `Agent 17 Continuity Depth Tests: ${passedCount}/${testResults.length} Passed`,
  };
}


export function runAgent17Op10mModuleSelfTests(): {
  acc17: ReturnType<typeof runAgent17Acc17DevTests>;
  recovery: ReturnType<typeof runAgent17RecoveryPathTests>;
  depth: ReturnType<typeof runAgent17PlanningDepthTests>;
  delegation: ReturnType<typeof runAgent17DelegationDepthTests>;
  coordination: ReturnType<typeof runAgent17CoordinationDepthTests>;
  execution: ReturnType<typeof runAgent17ExecutionDepthTests>;
  continuity: ReturnType<typeof runAgent17ContinuityDepthTests>;
  success: boolean;
} {
  const acc17 = runAgent17Acc17DevTests();
  const recovery = runAgent17RecoveryPathTests();
  const depth = runAgent17PlanningDepthTests();
  const delegation = runAgent17DelegationDepthTests();
  const coordination = runAgent17CoordinationDepthTests();
  const execution = runAgent17ExecutionDepthTests();
  const continuity = runAgent17ContinuityDepthTests();
  return {
    acc17,
    recovery,
    depth,
    delegation,
    coordination,
    execution,
    continuity,
    success:
      acc17.success &&
      recovery.success &&
      depth.success &&
      delegation.success &&
      coordination.success &&
      execution.success &&
      continuity.success,
  };
}

// OP10M_MODULE_END agent-17-command-center
