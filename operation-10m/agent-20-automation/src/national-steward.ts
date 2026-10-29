import { appendNationalStewardHistory } from './logs.js';
import { evaluateNationalStewardSafeguards } from './limits.js';
import type {
  NationalStewardCategory,
  NationalStewardPersisted,
  NationalStewardPlanStep,
  O10AutomationPathId,
  PlayerControlMode,
  AutoModePermission,
  NationalStewardOperatingMode,
} from './types.js';
import {
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
