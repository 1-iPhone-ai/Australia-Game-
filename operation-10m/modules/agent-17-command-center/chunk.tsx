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
  catalogDepth: { templateCount: number; deepTemplateCount: number; maxStepCount: number };
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
  const suggestion = buildAgent17PlanningSuggestion(
    ops,
    state,
    settings,
    actorId,
    recommendedDelegateKind
  );
  return {
    turn,
    actorId,
    planHealth,
    suggestion,
    templateRouting,
    delegationAnalytics,
    catalogDepth: summarizeAgent17CatalogDepth(),
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


export function runAgent17Op10mModuleSelfTests(): {
  acc17: ReturnType<typeof runAgent17Acc17DevTests>;
  recovery: ReturnType<typeof runAgent17RecoveryPathTests>;
  depth: ReturnType<typeof runAgent17PlanningDepthTests>;
  success: boolean;
} {
  const acc17 = runAgent17Acc17DevTests();
  const recovery = runAgent17RecoveryPathTests();
  const depth = runAgent17PlanningDepthTests();
  return { acc17, recovery, depth, success: acc17.success && recovery.success && depth.success };
}

// OP10M_MODULE_END agent-17-command-center
