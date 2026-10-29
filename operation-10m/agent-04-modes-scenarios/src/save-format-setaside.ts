import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mSetAsidePhase,
  O10mSetAsideSession,
} from './types.js';

export const O10M_SETASIDE_SCENARIO_CAP = 6;
export const O10M_SETASIDE_SCORE_CAP = 1040;
export const O10M_SETASIDE_SCORE_MONEY_CAP = 1120;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSetAsidePhase>(['filing', 'review', 'setAside']);

export function unlockTokenForSetAsideId(setAsideId: string): string | null {
  if (!setAsideId.startsWith('o10m_setaside_')) return null;
  return `o10m_unlock_${setAsideId.slice('o10m_setaside_'.length)}`;
}

export function setAsidePhaseForCursor(cursor: number, scenarioCount: number): O10mSetAsidePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'setAside';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function setAsideScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(137, Math.max(32, Math.floor(run.playerNetWorth / 134) + standingSlice));
}

export function sanitizeSetAsideSession(raw: unknown): O10mSetAsideSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const setAsideId =
    typeof o.setAsideId === 'string' && o.setAsideId.startsWith('o10m_setaside_')
      ? o.setAsideId
      : null;
  if (!setAsideId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : setAsideId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SETASIDE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const setAsideScore = Math.min(
    O10M_SETASIDE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.setAsideScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSetAsidePhase)
      ? (phaseRaw as O10mSetAsidePhase)
      : setAsidePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    setAsideId,
    label,
    scenarioIds,
    cursor,
    active,
    setAsideScore,
    phaseTag,
  };
}

export function createSetAsideSession(params: {
  setAsideId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSetAsideSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.setAsideId.startsWith('o10m_setaside_')) {
    return { session: null, warnings: ['SetAside ids must start with o10m_setaside_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_SETASIDE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'SetAside arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      setAsideId: params.setAsideId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      setAsideScore: 0,
      phaseTag: setAsidePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSetAsideSessionToState(
  state: O10mModesPersistedState,
  session: O10mSetAsideSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSetAsideSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    setAsideSession: sanitized,
    quashSession: null,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
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

export function clearSetAsideSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, setAsideSession: null };
}

export function getSetAsideScenarioAtCursor(
  session: O10mSetAsideSession | null | undefined,
): string | null {
  const setAside = sanitizeSetAsideSession(session);
  if (!setAside || !setAside.active) return null;
  return setAside.scenarioIds[setAside.cursor] ?? null;
}

export function buildSetAsideScenarioStartOverrides(
  session: O10mSetAsideSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const setAside = sanitizeSetAsideSession(session);
  if (!setAside) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SETASIDE_SCORE_MONEY_CAP,
    Math.floor(setAside.setAsideScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSetAsideId: setAside.setAsideId,
      o10mActiveSetAsideStep: setAside.cursor,
      o10mActiveSetAsidePhase: setAside.phaseTag,
      o10mSetAsideScore: setAside.setAsideScore,
    },
  };
}

export function advanceSetAsideSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSetAsideSession(state.setAsideSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const setAsideScore = Math.min(
    O10M_SETASIDE_SCORE_CAP,
    session.setAsideScore + setAsideScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      setAsideSession: {
        ...session,
        cursor,
        setAsideScore,
        phaseTag: setAsidePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSetAsideId(session.setAsideId);
  let next: O10mModesPersistedState = {
    ...state,
    setAsideSession: { ...session, active: false, setAsideScore, phaseTag: 'setAside' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function setAsideSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  setAsideScore: number;
  phase: O10mSetAsidePhase | null;
} {
  const session = sanitizeSetAsideSession(state.setAsideSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    setAsideScore: session?.setAsideScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
