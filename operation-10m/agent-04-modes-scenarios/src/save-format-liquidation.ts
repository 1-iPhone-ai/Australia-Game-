import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mLiquidationPhase,
  O10mLiquidationSession,
} from './types.js';

export const O10M_LIQUIDATION_SCENARIO_CAP = 6;
export const O10M_LIQUIDATION_SCORE_CAP = 1144;
export const O10M_LIQUIDATION_SCORE_MONEY_CAP = 1232;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mLiquidationPhase>(['filing', 'review', 'liquidation']);

export function unlockTokenForLiquidationId(liquidationId: string): string | null {
  if (!liquidationId.startsWith('o10m_liquidation_')) return null;
  return `o10m_unlock_${liquidationId.slice('o10m_liquidation_'.length)}`;
}

export function liquidationPhaseForCursor(cursor: number, scenarioCount: number): O10mLiquidationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'liquidation';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function liquidationScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(149, Math.max(36, Math.floor(run.playerNetWorth / 110) + standingSlice));
}

export function sanitizeLiquidationSession(raw: unknown): O10mLiquidationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const liquidationId =
    typeof o.liquidationId === 'string' && o.liquidationId.startsWith('o10m_liquidation_')
      ? o.liquidationId
      : null;
  if (!liquidationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : liquidationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_LIQUIDATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const liquidationScore = Math.min(
    O10M_LIQUIDATION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.liquidationScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mLiquidationPhase)
      ? (phaseRaw as O10mLiquidationPhase)
      : liquidationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    liquidationId,
    label,
    scenarioIds,
    cursor,
    active,
    liquidationScore,
    phaseTag,
  };
}

export function createLiquidationSession(params: {
  liquidationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mLiquidationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.liquidationId.startsWith('o10m_liquidation_')) {
    return { session: null, warnings: ['Liquidation ids must start with o10m_liquidation_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_LIQUIDATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Liquidation arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      liquidationId: params.liquidationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      liquidationScore: 0,
      phaseTag: liquidationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachLiquidationSessionToState(
  state: O10mModesPersistedState,
  session: O10mLiquidationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeLiquidationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    liquidationSession: sanitized,
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

export function clearLiquidationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, liquidationSession: null };
}

export function getLiquidationScenarioAtCursor(
  session: O10mLiquidationSession | null | undefined,
): string | null {
  const liquidation = sanitizeLiquidationSession(session);
  if (!liquidation || !liquidation.active) return null;
  return liquidation.scenarioIds[liquidation.cursor] ?? null;
}

export function buildLiquidationScenarioStartOverrides(
  session: O10mLiquidationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const liquidation = sanitizeLiquidationSession(session);
  if (!liquidation) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_LIQUIDATION_SCORE_MONEY_CAP,
    Math.floor(liquidation.liquidationScore * 0.95),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveLiquidationId: liquidation.liquidationId,
      o10mActiveLiquidationStep: liquidation.cursor,
      o10mActiveLiquidationPhase: liquidation.phaseTag,
      o10mLiquidationScore: liquidation.liquidationScore,
    },
  };
}

export function advanceLiquidationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeLiquidationSession(state.liquidationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const liquidationScore = Math.min(
    O10M_LIQUIDATION_SCORE_CAP,
    session.liquidationScore + liquidationScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      liquidationSession: {
        ...session,
        cursor,
        liquidationScore,
        phaseTag: liquidationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForLiquidationId(session.liquidationId);
  let next: O10mModesPersistedState = {
    ...state,
    liquidationSession: { ...session, active: false, liquidationScore, phaseTag: 'liquidation' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function liquidationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  liquidationScore: number;
  phase: O10mLiquidationPhase | null;
} {
  const session = sanitizeLiquidationSession(state.liquidationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    liquidationScore: session?.liquidationScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
