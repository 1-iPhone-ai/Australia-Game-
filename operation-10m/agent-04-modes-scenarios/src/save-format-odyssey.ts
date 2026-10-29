import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mOdysseyAct,
  O10mOdysseySession,
  O10mRunSummary,
} from './types.js';

export const O10M_ODYSSEY_SCENARIO_CAP = 6;
export const O10M_ODYSSEY_RENOWN_CAP = 680;
export const O10M_ODYSSEY_RENOWN_MONEY_CAP = 720;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_ACTS = new Set<O10mOdysseyAct>(['opening', 'crossing', 'homecoming']);

export function unlockTokenForOdysseyId(odysseyId: string): string | null {
  if (!odysseyId.startsWith('o10m_odyssey_')) return null;
  return `o10m_unlock_${odysseyId.slice('o10m_odyssey_'.length)}`;
}

export function odysseyActForCursor(cursor: number, scenarioCount: number): O10mOdysseyAct {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'homecoming';
  if (clamped >= Math.floor(total / 2)) return 'crossing';
  return 'opening';
}

export function odysseyRenownFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingBonus = Math.min(25, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(100, Math.max(14, Math.floor(run.playerNetWorth / 200) + standingBonus));
}

export function sanitizeOdysseySession(raw: unknown): O10mOdysseySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const odysseyId =
    typeof o.odysseyId === 'string' && o.odysseyId.startsWith('o10m_odyssey_') ? o.odysseyId : null;
  if (!odysseyId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : odysseyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ODYSSEY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const renownScore = Math.min(O10M_ODYSSEY_RENOWN_CAP, Math.max(0, Math.floor(num(o.renownScore, 0))));
  const actRaw = o.actTag;
  const actTag =
    typeof actRaw === 'string' && VALID_ACTS.has(actRaw as O10mOdysseyAct)
      ? (actRaw as O10mOdysseyAct)
      : odysseyActForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    odysseyId,
    label,
    scenarioIds,
    cursor,
    active,
    renownScore,
    actTag,
  };
}

export function createOdysseySession(params: {
  odysseyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mOdysseySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.odysseyId.startsWith('o10m_odyssey_')) {
    return { session: null, warnings: ['Odyssey ids must start with o10m_odyssey_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_ODYSSEY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Odyssey requires at least one valid scenario.'] };
  }
  return {
    session: {
      odysseyId: params.odysseyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      renownScore: 0,
      actTag: odysseyActForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachOdysseySessionToState(
  state: O10mModesPersistedState,
  session: O10mOdysseySession,
): O10mModesPersistedState {
  const sanitized = sanitizeOdysseySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    odysseySession: sanitized,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
    probationSession: null,
    commutationSession: null,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
    quashSession: null,
    expeditionSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearOdysseySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, odysseySession: null };
}

export function getOdysseyScenarioAtCursor(session: O10mOdysseySession | null | undefined): string | null {
  const odyssey = sanitizeOdysseySession(session);
  if (!odyssey || !odyssey.active) return null;
  return odyssey.scenarioIds[odyssey.cursor] ?? null;
}

export function buildOdysseyScenarioStartOverrides(session: O10mOdysseySession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const odyssey = sanitizeOdysseySession(session);
  if (!odyssey) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_ODYSSEY_RENOWN_MONEY_CAP, Math.floor(odyssey.renownScore * 0.8));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveOdysseyId: odyssey.odysseyId,
      o10mActiveOdysseyStep: odyssey.cursor,
      o10mActiveOdysseyAct: odyssey.actTag,
      o10mOdysseyRenown: odyssey.renownScore,
    },
  };
}

export function advanceOdysseySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeOdysseySession(state.odysseySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const renownScore = Math.min(O10M_ODYSSEY_RENOWN_CAP, session.renownScore + odysseyRenownFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      odysseySession: {
        ...session,
        cursor,
        renownScore,
        actTag: odysseyActForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForOdysseyId(session.odysseyId);
  let next: O10mModesPersistedState = {
    ...state,
    odysseySession: { ...session, active: false, renownScore, actTag: 'homecoming' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function odysseySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  renown: number;
  act: O10mOdysseyAct | null;
} {
  const session = sanitizeOdysseySession(state.odysseySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    renown: session?.renownScore ?? 0,
    act: session?.active ? session.actTag : null,
  };
}
