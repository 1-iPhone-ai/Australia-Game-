import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mLiquidationDepthPhase,
  O10mLiquidationDepthSession,
} from './types.js';

export const O10M_LIQUIDATION_DEPTH_SCENARIO_CAP = 6;
export const O10M_LIQUIDATION_DEPTH_SCORE_CAP = 1160;
export const O10M_LIQUIDATION_DEPTH_SCORE_MONEY_CAP = 1250;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mLiquidationDepthPhase>(['filing', 'review', 'depth']);

export function unlockTokenForLiquidationDepthId(liquidationDepthId: string): string | null {
  if (!liquidationDepthId.startsWith('o10m_liquidation_depth_')) return null;
  return `o10m_unlock_${liquidationDepthId.slice('o10m_liquidation_depth_'.length)}`;
}

export function liquidationDepthPhaseForCursor(cursor: number, scenarioCount: number): O10mLiquidationDepthPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'depth';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function liquidationDepthScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(150, Math.max(36, Math.floor(run.playerNetWorth / 108) + standingSlice));
}

export function sanitizeLiquidationDepthSession(raw: unknown): O10mLiquidationDepthSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const liquidationDepthId =
    typeof o.liquidationDepthId === 'string' && o.liquidationDepthId.startsWith('o10m_liquidation_depth_')
      ? o.liquidationDepthId
      : null;
  if (!liquidationDepthId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : liquidationDepthId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_LIQUIDATION_DEPTH_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const liquidationDepthScore = Math.min(
    O10M_LIQUIDATION_DEPTH_SCORE_CAP,
    Math.max(0, Math.floor(num(o.liquidationDepthScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mLiquidationDepthPhase)
      ? (phaseRaw as O10mLiquidationDepthPhase)
      : liquidationDepthPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    liquidationDepthId,
    label,
    scenarioIds,
    cursor,
    active,
    liquidationDepthScore,
    phaseTag,
  };
}

export function createLiquidationDepthSession(params: {
  liquidationDepthId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mLiquidationDepthSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.liquidationDepthId.startsWith('o10m_liquidation_depth_')) {
    return { session: null, warnings: ['LiquidationDepth ids must start with o10m_liquidation_depth_.'] };
  }
  const scenarioIds = params.scenarioIds.filter(id => {
    if (!id.startsWith('o10m_')) {
      warnings.push(`Skipped non-O10M scenario id ${id}.`);
      return false;
    }
    if (!findO10mScenario(id)) {
      warnings.push(`Skipped unknown scenario ${id}.`);
      return false;
    }
    return true;
  });
  const trimmed = scenarioIds.slice(0, O10M_LIQUIDATION_DEPTH_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'LiquidationDepth arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      liquidationDepthId: params.liquidationDepthId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      liquidationDepthScore: 0,
      phaseTag: liquidationDepthPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachLiquidationDepthSessionToState(
  state: O10mModesPersistedState,
  session: O10mLiquidationDepthSession,
): O10mModesPersistedState {
  const sanitized = sanitizeLiquidationDepthSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    liquidationDepthSession: sanitized,
    dissolutionSession: null,
    liquidationSession: null,
    receivershipSession: null,
    sequestrationSession: null,
    contemptSession: null,
    injunctionSession: null,
    quowarrantoSession: null,
    habeasSession: null,
    prohibitionSession: null,
    mandamusSession: null,
    certiorariSession: null,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
    escortSession: null,
    convoySession: null,
    siegeSession: null,
    voyageSession: null,
    caravanSession: null,
    pilgrimageSession: null,
    odysseySession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearLiquidationDepthSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, liquidationDepthSession: null };
}

export function getLiquidationDepthScenarioAtCursor(
  session: O10mLiquidationDepthSession | null | undefined,
): string | null {
  const liquidationDepth = sanitizeLiquidationDepthSession(session);
  if (!liquidationDepth || !liquidationDepth.active) return null;
  return liquidationDepth.scenarioIds[liquidationDepth.cursor] ?? null;
}

export function buildLiquidationDepthScenarioStartOverrides(
  session: O10mLiquidationDepthSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const liquidationDepth = sanitizeLiquidationDepthSession(session);
  if (!liquidationDepth) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_LIQUIDATION_DEPTH_SCORE_MONEY_CAP,
    Math.floor(liquidationDepth.liquidationDepthScore * 0.95),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveLiquidationDepthId: liquidationDepth.liquidationDepthId,
      o10mActiveLiquidationDepthStep: liquidationDepth.cursor,
      o10mActiveLiquidationDepthPhase: liquidationDepth.phaseTag,
      o10mLiquidationDepthScore: liquidationDepth.liquidationDepthScore,
    },
  };
}

export function advanceLiquidationDepthSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeLiquidationDepthSession(state.liquidationDepthSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const liquidationDepthScore = Math.min(
    O10M_LIQUIDATION_DEPTH_SCORE_CAP,
    session.liquidationDepthScore + liquidationDepthScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      liquidationDepthSession: {
        ...session,
        cursor,
        liquidationDepthScore,
        phaseTag: liquidationDepthPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForLiquidationDepthId(session.liquidationDepthId);
  let next: O10mModesPersistedState = {
    ...state,
    liquidationDepthSession: { ...session, active: false, liquidationDepthScore, phaseTag: 'depth' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function liquidationDepthSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  liquidationDepthScore: number;
  phase: O10mLiquidationDepthPhase | null;
} {
  const session = sanitizeLiquidationDepthSession(state.liquidationDepthSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    liquidationDepthScore: session?.liquidationDepthScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
