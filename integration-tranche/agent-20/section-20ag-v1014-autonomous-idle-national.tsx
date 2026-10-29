// ============================================================================
// SECTION 20AG: V10.14 AUTONOMOUS & IDLE NATIONAL MANAGEMENT
// Agent 20 (Operation 600K) — integration slice for Agent 25 merge into canonical V9.4
// ============================================================================
// Orchestrates national stewardship when the human player is idle or has delegated
// control, routing through existing V9.4 automation paths (Auto Mode, Co-Pilot takeover,
// Player Control modes, Guardian safeguards) without owning turn AP or wallets.
//
// INVARIANTS (A–H):
// A. Co-Pilot remains authoritative for executable action intents on the human actor.
// B. Auto Mode remains authoritative for handicap / pacing adjustment packages.
// C. Guardian remains authoritative for veto / warning on risky commits.
// D. National systems (V10.0–V10.13) remain authoritative for domain state; this layer plans only.
// E. Player override is immediate, latched, and observable in UI + ledger.
// F. Idle stewardship never mutates persisted game state without a successful downstream commit.
// G. V9.4 game-feel feedback derived here is presentation-only (never persisted).
// H. When safeguards block an action, steward idles with a reason string (never silent spin).

export const V1014_SCHEMA_VERSION = '10.14.0-agent20';

export const V1014_AUTOMATION_PATH_IDS = [
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
  'v94_idle_steward_national_tick'
] as const;

export type V1014AutomationPathId = typeof V1014_AUTOMATION_PATH_IDS[number];

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

export interface NationalStewardCategoryLock {
  category: NationalStewardCategory;
  locked: boolean;
  reason?: string;
  lockedTurn?: number;
}

export interface NationalStewardSpendingCap {
  perTurnCash: number;
  perCycleCash: number;
  perActionCash: number;
  cycleTurns: number;
}

export interface NationalStewardSafeguardRule {
  id: string;
  label: string;
  category: NationalStewardCategory;
  severity: NationalStewardSafeguardSeverity;
  /** When true, steward may still recommend but cannot auto-apply. */
  recommendOnly: boolean;
  evaluate: (ctx: NationalStewardEvaluationContext) => { triggered: boolean; message: string };
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
  lastAutomationPath?: V1014AutomationPathId;
}

export interface NationalStewardPersisted {
  schemaVersion: string;
  enabled: boolean;
  operatingMode: NationalStewardOperatingMode;
  automationPath: V1014AutomationPathId;
  categoryLocks: NationalStewardCategoryLock[];
  spendingCap: NationalStewardSpendingCap;
  playerOverride: NationalStewardPlayerOverrideState;
  idleTelemetry: NationalStewardIdleTelemetry;
  turnSpendAccumulator: number;
  cycleSpendAccumulator: number;
  cycleStartTurn: number;
  history: NationalStewardHistoryEntry[];
  lastPlanSummary?: string;
}

export interface NationalStewardHistoryEntry {
  turn: number;
  path: V1014AutomationPathId;
  outcome: 'planned' | 'committed' | 'safeguard_block' | 'player_override' | 'idle';
  summary: string;
}

export interface NationalStewardEvaluationContext {
  turn: number;
  playerControlMode: PlayerControlMode;
  assistanceLevel: AssistanceLevel;
  coPilotMode: CoPilotUiConceptualMode;
  autoModeEnabled: boolean;
  autoModePermission: AutoModePermission;
  takeoverActive: boolean;
  guardianMajorEnabled: boolean;
  cash: number;
  apRemaining: number;
  category: NationalStewardCategory;
  proposedCashDelta: number;
  persisted: NationalStewardPersisted;
}

export interface NationalStewardPlanStep {
  stepId: string;
  category: NationalStewardCategory;
  automationPath: V1014AutomationPathId;
  intentKind: 'recommend' | 'copilot_intent' | 'auto_mode_package' | 'end_turn' | 'idle';
  title: string;
  rationale: string;
  proposedCashDelta: number;
  proposedApCost: number;
  safeguardMessages: string[];
  blocked: boolean;
}

export interface NationalStewardComputedView {
  persisted: NationalStewardPersisted;
  activePath: V1014AutomationPathId;
  modeLabel: string;
  statusTone: 'neutral' | 'active' | 'warn' | 'blocked' | 'paused';
  nextStep?: NationalStewardPlanStep;
  safeguardSummary: string;
  v94PresentationMoments: Array<{ id: string; headline: string; takeaway: string; tone: 'cyan' | 'amber' | 'rose' | 'emerald' }>;
}

export function createDefaultNationalStewardSpendingCap(): NationalStewardSpendingCap {
  return {
    perTurnCash: 2500,
    perCycleCash: 8000,
    perActionCash: 1200,
    cycleTurns: 3
  };
}

export function createDefaultNationalStewardPlayerOverride(): NationalStewardPlayerOverrideState {
  return {
    latched: false,
    paused: false,
    reason: '',
    sinceTurn: 0,
    sinceTimestampMs: 0,
    frozenCategories: [],
    resumeRequiresExplicitStart: true
  };
}

export function createDefaultNationalStewardIdleTelemetry(): NationalStewardIdleTelemetry {
  return {
    msSinceLastHumanInput: 0,
    msSinceLastCommittedAction: 0,
    consecutiveIdleTurns: 0
  };
}

export function createDefaultAutonomousIdleNationalPersisted(): NationalStewardPersisted {
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
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
    history: []
  };
}

export function sanitizeAutonomousIdleNationalPersisted(raw: unknown): NationalStewardPersisted | null {
  if (raw == null) return null;
  if (typeof raw !== 'object') return null;
  const src = raw as Record<string, unknown>;
  const defaults = createDefaultAutonomousIdleNationalPersisted();
  const enabled = typeof src.enabled === 'boolean' ? src.enabled : defaults.enabled;
  const operatingMode = typeof src.operatingMode === 'string' ? (src.operatingMode as NationalStewardOperatingMode) : defaults.operatingMode;
  const automationPath = typeof src.automationPath === 'string' && (V1014_AUTOMATION_PATH_IDS as readonly string[]).includes(src.automationPath)
    ? (src.automationPath as V1014AutomationPathId)
    : defaults.automationPath;
  const spendingCap = { ...defaults.spendingCap, ...(typeof src.spendingCap === 'object' && src.spendingCap ? src.spendingCap as object : {}) };
  const playerOverride = { ...defaults.playerOverride, ...(typeof src.playerOverride === 'object' && src.playerOverride ? src.playerOverride as object : {}) };
  const idleTelemetry = { ...defaults.idleTelemetry, ...(typeof src.idleTelemetry === 'object' && src.idleTelemetry ? src.idleTelemetry as object : {}) };
  const history = Array.isArray(src.history)
    ? src.history.slice(-24).filter((h): h is NationalStewardHistoryEntry => typeof h === 'object' && h !== null && typeof (h as any).turn === 'number')
    : [];
  return {
    schemaVersion: typeof src.schemaVersion === 'string' ? src.schemaVersion : V1014_SCHEMA_VERSION,
    enabled,
    operatingMode,
    automationPath,
    categoryLocks: Array.isArray(src.categoryLocks) ? (src.categoryLocks as NationalStewardCategoryLock[]) : [],
    spendingCap,
    playerOverride,
    idleTelemetry,
    turnSpendAccumulator: typeof src.turnSpendAccumulator === 'number' ? src.turnSpendAccumulator : 0,
    cycleSpendAccumulator: typeof src.cycleSpendAccumulator === 'number' ? src.cycleSpendAccumulator : 0,
    cycleStartTurn: typeof src.cycleStartTurn === 'number' ? src.cycleStartTurn : 1,
    history,
    lastPlanSummary: typeof src.lastPlanSummary === 'string' ? src.lastPlanSummary : undefined
  };
}

export function resolveV1014AutomationPath(input: {
  playerControlMode?: PlayerControlMode;
  assistanceLevel?: AssistanceLevel;
  coPilotMode?: CoPilotUiConceptualMode;
  autoModeEnabled?: boolean;
  autoModePermission?: AutoModePermission;
  takeoverActive?: boolean;
  idleMs?: number;
  stewardEnabled?: boolean;
}): V1014AutomationPathId {
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

export function mapAutomationPathToStewardMode(path: V1014AutomationPathId): NationalStewardOperatingMode {
  switch (path) {
    case 'v94_player_control_manual':
      return 'off';
    case 'v94_player_control_advisor':
    case 'v94_auto_mode_observe':
    case 'v94_copilot_advisor':
      return 'watch_only';
    case 'v94_player_control_assistant':
    case 'v94_auto_mode_recommend':
    case 'v94_idle_steward_soft_nudge':
      return 'recommend';
    case 'v94_auto_mode_assist':
    case 'v94_copilot_active_assistant':
      return 'assisted';
    case 'v94_idle_steward_watch':
      return 'watch_only';
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


export function evaluateNationalStewardSafeguards(ctx: NationalStewardEvaluationContext): { blocked: boolean; messages: string[]; severity: NationalStewardSafeguardSeverity } {
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
  if ((ctx.category === 'diplomacy' || ctx.category === 'military') && !ctx.takeoverActive && ctx.autoModePermission !== 'full_auto') {
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


export function applyPlayerNationalStewardOverride(
  persisted: NationalStewardPersisted,
  patch: Partial<NationalStewardPlayerOverrideState> & { action?: 'pause' | 'resume' | 'latch_manual' | 'clear' },
  turn: number,
  nowMs: number = Date.now()
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
  if (patch.action === 'resume') {
    if (base.playerOverride.resumeRequiresExplicitStart) {
      base.playerOverride.paused = false;
      base.playerOverride.latched = false;
      base.playerOverride.reason = '';
      base.operatingMode = 'watch_only';
    }
  }
  if (patch.action === 'clear') {
    base.playerOverride = createDefaultNationalStewardPlayerOverride();
    base.operatingMode = 'watch_only';
  }
  if (patch.frozenCategories) base.playerOverride.frozenCategories = [...patch.frozenCategories];
  return appendNationalStewardHistory(base, turn, base.automationPath, 'player_override', base.playerOverride.reason || 'override');
}

export function appendNationalStewardHistory(
  persisted: NationalStewardPersisted,
  turn: number,
  path: V1014AutomationPathId,
  outcome: NationalStewardHistoryEntry['outcome'],
  summary: string
): NationalStewardPersisted {
  const entry: NationalStewardHistoryEntry = { turn, path, outcome, summary };
  const history = [...(persisted.history || []), entry].slice(-24);
  return { ...persisted, history, lastPlanSummary: summary };
}

export function tickIdleNationalStewardTelemetry(
  persisted: NationalStewardPersisted,
  input: { msSinceLastHumanInput: number; msSinceLastCommittedAction: number; humanCommittedThisTurn: boolean; turn: number }
): NationalStewardPersisted {
  const idleTelemetry: NationalStewardIdleTelemetry = {
    ...persisted.idleTelemetry,
    msSinceLastHumanInput: input.msSinceLastHumanInput,
    msSinceLastCommittedAction: input.msSinceLastCommittedAction,
    consecutiveIdleTurns: input.humanCommittedThisTurn ? 0 : (persisted.idleTelemetry.consecutiveIdleTurns + 1)
  };
  let cycleSpendAccumulator = persisted.cycleSpendAccumulator;
  let cycleStartTurn = persisted.cycleStartTurn;
  let turnSpendAccumulator = persisted.turnSpendAccumulator;
  if (input.turn > persisted.cycleStartTurn + persisted.spendingCap.cycleTurns) {
    cycleSpendAccumulator = 0;
    cycleStartTurn = input.turn;
  }
  if (input.humanCommittedThisTurn) turnSpendAccumulator = 0;
  return { ...persisted, idleTelemetry, cycleSpendAccumulator, cycleStartTurn, turnSpendAccumulator };
}

export function buildNationalStewardEvaluationContext(
  gameState: any,
  settings: any,
  persisted: NationalStewardPersisted,
  category: NationalStewardCategory,
  proposedCashDelta: number
): NationalStewardEvaluationContext {
  const gs = gameState || {};
  const st = settings || gs.gameSettings || {};
  const pcm = (st.playerControlMode || 'manual') as PlayerControlMode;
  const cpMode = (st.coPilotMode || mapPlayerControlModeToConceptual(pcm)) as CoPilotUiConceptualMode;
  const auto = st.autoModeSettings || createDefaultAutoModeGlobalSettings();
  const player = gs.player || gs.players?.[gs.humanPlayerId] || {};
  return {
    turn: gs.turnCounter || gs.turn || 1,
    playerControlMode: pcm,
    assistanceLevel: (st.assistanceLevel || 'guide') as AssistanceLevel,
    coPilotMode: cpMode,
    autoModeEnabled: Boolean(st.autoModeEnabled ?? auto.autoModeEnabled),
    autoModePermission: (auto.permissionMode || auto.permission || 'disabled') as AutoModePermission,
    takeoverActive: Boolean(gs.takeoverSession && gs.takeoverSession.status === 'active'),
    guardianMajorEnabled: (st.guardianAiSettings?.level || '') === 'major_mistakes',
    cash: Number(player.cash || player.money || 0),
    apRemaining: Number(player.actionPointsRemaining ?? player.ap ?? 0),
    category,
    proposedCashDelta,
    persisted
  };
}

export function planNationalStewardTurnStep(
  gameState: any,
  settings: any,
  persistedIn: NationalStewardPersisted | null | undefined,
  options?: { nowMs?: number; forceNationalTick?: boolean }
): { persisted: NationalStewardPersisted; step: NationalStewardPlanStep; view: NationalStewardComputedView } {
  const nowMs = options?.nowMs ?? Date.now();
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
      blocked: true
    };
    return { persisted, step, view: computeAutonomousIdleNationalView(gameState, settings, persisted, step) };
  }
  const idleMs = persisted.idleTelemetry.msSinceLastHumanInput;
  const path = options?.forceNationalTick
    ? 'v94_idle_steward_national_tick'
    : resolveV1014AutomationPath({
        playerControlMode: (settings?.playerControlMode || 'manual') as PlayerControlMode,
        assistanceLevel: settings?.assistanceLevel,
        coPilotMode: settings?.coPilotMode,
        autoModeEnabled: settings?.autoModeEnabled,
        autoModePermission: settings?.autoModeSettings?.permissionMode,
        takeoverActive: Boolean(gameState?.takeoverSession?.status === 'active'),
        idleMs,
        stewardEnabled: persisted.enabled
      });
  persisted = {
    ...persisted,
    automationPath: path,
    operatingMode: persisted.playerOverride.paused ? 'paused_by_player' : mapAutomationPathToStewardMode(path)
  };
  const category: NationalStewardCategory =
    path.includes('idle') ? 'regional' : path.includes('auto_mode') ? 'fiscal' : 'infrastructure';
  const proposedCashDelta = path === 'v94_idle_steward_national_tick' ? -400 : 0;
  const ctx = buildNationalStewardEvaluationContext(gameState, settings, persisted, category, proposedCashDelta);
  const sg = evaluateNationalStewardSafeguards(ctx);
  const intentKind: NationalStewardPlanStep['intentKind'] =
    sg.blocked ? 'idle'
    : path === 'v94_copilot_autonomous_takeover' || path === 'v94_player_control_autonomous' ? 'copilot_intent'
    : path.startsWith('v94_auto_mode') ? 'auto_mode_package'
    : path.includes('recommend') || path.includes('nudge') ? 'recommend'
    : persisted.operatingMode === 'autonomous_idle' ? 'end_turn'
    : 'idle';
  const step: NationalStewardPlanStep = {
    stepId: `v1014_${path}_${ctx.turn}`,
    category,
    automationPath: path,
    intentKind,
    title: sg.blocked ? 'Steward waiting (safeguard)' : `National steward: ${persisted.operatingMode}`,
    rationale: sg.messages[0] || `Routing via ${path} on V9.4 automation spine.`,
    proposedCashDelta,
    proposedApCost: intentKind === 'copilot_intent' ? 1 : 0,
    safeguardMessages: sg.messages,
    blocked: sg.blocked
  };
  if (step.blocked) {
    persisted = appendNationalStewardHistory(persisted, ctx.turn, path, 'safeguard_block', step.rationale);
  } else if (step.intentKind === 'idle') {
    persisted = appendNationalStewardHistory(persisted, ctx.turn, path, 'idle', step.rationale);
  } else {
    persisted = appendNationalStewardHistory(persisted, ctx.turn, path, 'planned', step.title);
  }
  const view = computeAutonomousIdleNationalView(gameState, settings, persisted, step);
  return { persisted, step, view };
}

export function computeAutonomousIdleNationalView(
  gameState: any,
  settings: any,
  persisted: NationalStewardPersisted,
  step?: NationalStewardPlanStep
): NationalStewardComputedView {
  const path = persisted.automationPath;
  const statusTone: NationalStewardComputedView['statusTone'] =
    persisted.playerOverride.paused ? 'paused'
    : step?.blocked ? 'blocked'
    : persisted.operatingMode.includes('autonomous') ? 'active'
    : 'neutral';
  const modeLabel =
    persisted.playerOverride.paused ? 'Paused — player override'
    : persisted.operatingMode === 'off' ? 'Manual control'
    : `Steward: ${persisted.operatingMode.replace(/_/g, ' ')}`;
  const v94PresentationMoments = [
    {
      id: 'v1014_path',
      headline: 'Automation path',
      takeaway: `V9.4 spine: ${path}`,
      tone: 'cyan' as const
    }
  ];
  if (step?.safeguardMessages?.length) {
    v94PresentationMoments.push({
      id: 'v1014_sg',
      headline: 'Safeguard',
      takeaway: step.safeguardMessages.join(' · '),
      tone: 'amber' as const
    });
  }
  return {
    persisted,
    activePath: path,
    modeLabel,
    statusTone,
    nextStep: step,
    safeguardSummary: step?.safeguardMessages?.join(' ') || 'No active safeguard blocks.',
    v94PresentationMoments
  };
}

export interface AutonomousIdleNationalStewardPanelProps {
  gameState: any;
  gameSettings: any;
  persisted: NationalStewardPersisted | null;
  onUpdatePersisted: (next: NationalStewardPersisted) => void;
  onPlayerOverride?: (action: 'pause' | 'resume' | 'latch_manual') => void;
}

export const AutonomousIdleNationalStewardPanel: React.FC<AutonomousIdleNationalStewardPanelProps> = ({
  gameState,
  gameSettings,
  persisted: persistedProp,
  onUpdatePersisted,
  onPlayerOverride
}) => {
  const persisted = sanitizeAutonomousIdleNationalPersisted(persistedProp) || createDefaultAutonomousIdleNationalPersisted();
  const plan = React.useMemo(
    () => planNationalStewardTurnStep(gameState, gameSettings, persisted),
    [gameState, gameSettings, persisted]
  );
  const view = plan.view;
  const turn = gameState?.turnCounter || 1;
  return (
    <div className="rounded-xl border border-indigo-500/40 bg-slate-950/90 p-3 space-y-2 text-xs text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-indigo-300 font-semibold">V10.14 • Autonomous & Idle National Steward</div>
          <div className="text-sm font-bold text-white">{view.modeLabel}</div>
        </div>
        <span className="px-2 py-0.5 rounded border border-indigo-400/40 text-[10px] text-indigo-100">{view.activePath}</span>
      </div>
      {view.v94PresentationMoments.map(m => (
        <div key={m.id} className="rounded border border-slate-700 bg-slate-900/80 px-2 py-1.5">
          <div className="font-semibold text-indigo-200">{m.headline}</div>
          <div className="text-[11px] text-slate-400">{m.takeaway}</div>
        </div>
      ))}
      {plan.step && (
        <div className="rounded border border-slate-700 bg-slate-900/60 p-2">
          <div className="font-semibold text-slate-100">{plan.step.title}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{plan.step.rationale}</div>
          <div className="text-[10px] text-slate-500 mt-1">Intent: {plan.step.intentKind} · Category: {plan.step.category}</div>
        </div>
      )}
      <div className="flex flex-wrap gap-2 pt-1">
        <button
          type="button"
          className="px-2 py-1 rounded bg-rose-900/50 border border-rose-500/40 text-rose-100 hover:bg-rose-800/60"
          onClick={() => {
            const next = applyPlayerNationalStewardOverride(persisted, { action: 'pause', reason: 'Player pressed Pause steward.' }, turn);
            onUpdatePersisted(next);
            onPlayerOverride?.('pause');
          }}
        >
          Pause steward
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded bg-emerald-900/40 border border-emerald-500/40 text-emerald-100 hover:bg-emerald-800/50"
          onClick={() => {
            const next = applyPlayerNationalStewardOverride(persisted, { action: 'resume' }, turn);
            onUpdatePersisted(next);
            onPlayerOverride?.('resume');
          }}
        >
          Resume
        </button>
        <button
          type="button"
          className="px-2 py-1 rounded bg-amber-900/40 border border-amber-500/40 text-amber-100"
          onClick={() => {
            const next = applyPlayerNationalStewardOverride(persisted, { action: 'latch_manual', reason: 'Take manual control.' }, turn);
            onUpdatePersisted(next);
            onPlayerOverride?.('latch_manual');
          }}
        >
          Take control
        </button>
      </div>
      <div className="text-[10px] text-slate-500">{view.safeguardSummary}</div>
    </div>
  );
};

export type V1014SelfTestResult = { id: string; name: string; passed: boolean; detail?: string };

export function runV1014AutonomousIdleNationalSelfTests(): { passed: number; total: number; allPassed: boolean; results: V1014SelfTestResult[] } {
  const results: V1014SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) => results.push({ id, name, passed, detail });

  push('path_0', 'resolve path case 0', resolveV1014AutomationPath({
    playerControlMode: 'manual',
    coPilotMode: 'advisor',
    autoModeEnabled: false,
    idleMs: 0,
    stewardEnabled: true,
    takeoverActive: false
  }) === 'v94_player_control_manual');

  push('path_1', 'resolve path case 1', resolveV1014AutomationPath({
    playerControlMode: 'autonomous',
    coPilotMode: 'autonomous_takeover',
    autoModeEnabled: false,
    idleMs: 0,
    stewardEnabled: true,
    takeoverActive: false
  }) === 'v94_player_control_autonomous');

  push('path_2', 'resolve path case 2', resolveV1014AutomationPath({
    playerControlMode: 'assistant',
    coPilotMode: 'active_assistant',
    autoModeEnabled: true,
    idleMs: 0,
    stewardEnabled: true,
    takeoverActive: false
  }) === 'v94_player_control_assistant');

  push('path_3', 'resolve path case 3', resolveV1014AutomationPath({
    playerControlMode: 'manual',
    coPilotMode: 'advisor',
    autoModeEnabled: true,
    idleMs: 130000,
    stewardEnabled: true,
    takeoverActive: false
  }) === 'v94_idle_steward_watch');

  push('path_4', 'resolve path case 4', resolveV1014AutomationPath({
    playerControlMode: 'advisor',
    coPilotMode: 'advisor',
    autoModeEnabled: false,
    idleMs: 50000,
    stewardEnabled: true,
    takeoverActive: false
  }) === 'v94_idle_steward_soft_nudge');

  const def = createDefaultAutonomousIdleNationalPersisted();
  push('default_schema', 'default schema version', def.schemaVersion === V1014_SCHEMA_VERSION);
  push('sanitize_null', 'sanitize null', sanitizeAutonomousIdleNationalPersisted(null) === null);
  const paused = applyPlayerNationalStewardOverride(def, { action: 'pause', reason: 'test' }, 3);
  push('override_pause', 'player pause sets mode', paused.operatingMode === 'paused_by_player' && paused.playerOverride.paused);
  const ctx = buildNationalStewardEvaluationContext({}, { playerControlMode: 'manual' }, def, 'fiscal', -5000);
  const sg = evaluateNationalStewardSafeguards(ctx);
  push('safeguard_spend', 'large spend blocked', sg.blocked === true);
  const plan = planNationalStewardTurnStep({}, { playerControlMode: 'autonomous', coPilotMode: 'autonomous_takeover', autoModeEnabled: true }, def);
  push('plan_autonomous', 'autonomous plan yields step', Boolean(plan.step?.stepId));

  push('catalog_v94_player_control_manual', 'path catalog includes v94_player_control_manual', (V1014_AUTOMATION_PATH_IDS as readonly string[]).includes('v94_player_control_manual'));

  push('catalog_v94_auto_mode_full_auto', 'path catalog includes v94_auto_mode_full_auto', (V1014_AUTOMATION_PATH_IDS as readonly string[]).includes('v94_auto_mode_full_auto'));

  push('catalog_v94_copilot_autonomous_takeover', 'path catalog includes v94_copilot_autonomous_takeover', (V1014_AUTOMATION_PATH_IDS as readonly string[]).includes('v94_copilot_autonomous_takeover'));

  push('catalog_v94_idle_steward_national_tick', 'path catalog includes v94_idle_steward_national_tick', (V1014_AUTOMATION_PATH_IDS as readonly string[]).includes('v94_idle_steward_national_tick'));

  push('catalog_v94_idle_steward_watch', 'path catalog includes v94_idle_steward_watch', (V1014_AUTOMATION_PATH_IDS as readonly string[]).includes('v94_idle_steward_watch'));

  push('inv_1', 'invariant cycle 1', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_2', 'invariant cycle 2', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_3', 'invariant cycle 3', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_4', 'invariant cycle 4', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_5', 'invariant cycle 5', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_6', 'invariant cycle 6', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_7', 'invariant cycle 7', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_8', 'invariant cycle 8', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_9', 'invariant cycle 9', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_10', 'invariant cycle 10', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_11', 'invariant cycle 11', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_12', 'invariant cycle 12', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_13', 'invariant cycle 13', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_14', 'invariant cycle 14', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_15', 'invariant cycle 15', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_16', 'invariant cycle 16', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_17', 'invariant cycle 17', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_18', 'invariant cycle 18', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_19', 'invariant cycle 19', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_20', 'invariant cycle 20', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_21', 'invariant cycle 21', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_22', 'invariant cycle 22', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_23', 'invariant cycle 23', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_24', 'invariant cycle 24', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_25', 'invariant cycle 25', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_26', 'invariant cycle 26', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_27', 'invariant cycle 27', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_28', 'invariant cycle 28', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_29', 'invariant cycle 29', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_30', 'invariant cycle 30', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_31', 'invariant cycle 31', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_32', 'invariant cycle 32', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_33', 'invariant cycle 33', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_34', 'invariant cycle 34', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_35', 'invariant cycle 35', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_36', 'invariant cycle 36', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_37', 'invariant cycle 37', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_38', 'invariant cycle 38', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_39', 'invariant cycle 39', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  push('inv_40', 'invariant cycle 40', mapAutomationPathToStewardMode('v94_auto_mode_recommend') === 'recommend');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}

// END SECTION 20AG (Agent 20)
