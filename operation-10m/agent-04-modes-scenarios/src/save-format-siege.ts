import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mSiegePhase,
  O10mSiegeSession,
} from './types.js';

export const O10M_SIEGE_SCENARIO_CAP = 6;
export const O10M_SIEGE_MORALE_CAP = 640;
export const O10M_SIEGE_MORALE_MONEY_CAP = 720;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSiegePhase>(['mustering', 'breach', 'relief']);

export function unlockTokenForSiegeId(siegeId: string): string | null {
  if (!siegeId.startsWith('o10m_siege_')) return null;
  return `o10m_unlock_${siegeId.slice('o10m_siege_'.length)}`;
}

export function siegePhaseForCursor(cursor: number, scenarioCount: number): O10mSiegePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'relief';
  if (clamped >= Math.floor(total / 2)) return 'breach';
  return 'mustering';
}

export function siegeMoraleFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const rivalPenalty = Math.min(14, Math.floor(run.rivalNetWorth / 180));
  return Math.min(92, Math.max(12, Math.floor(run.playerNetWorth / 210) + rivalPenalty));
}

export function sanitizeSiegeSession(raw: unknown): O10mSiegeSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const siegeId =
    typeof o.siegeId === 'string' && o.siegeId.startsWith('o10m_siege_') ? o.siegeId : null;
  if (!siegeId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : siegeId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SIEGE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const moraleScore = Math.min(O10M_SIEGE_MORALE_CAP, Math.max(0, Math.floor(num(o.moraleScore, 0))));
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSiegePhase)
      ? (phaseRaw as O10mSiegePhase)
      : siegePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    siegeId,
    label,
    scenarioIds,
    cursor,
    active,
    moraleScore,
    phaseTag,
  };
}

export function createSiegeSession(params: {
  siegeId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSiegeSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.siegeId.startsWith('o10m_siege_')) {
    return { session: null, warnings: ['Siege ids must start with o10m_siege_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_SIEGE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Siege requires at least one valid scenario.'] };
  }
  return {
    session: {
      siegeId: params.siegeId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      moraleScore: 0,
      phaseTag: siegePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSiegeSessionToState(
  state: O10mModesPersistedState,
  session: O10mSiegeSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSiegeSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    siegeSession: sanitized,
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
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
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

export function clearSiegeSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, siegeSession: null };
}

export function getSiegeScenarioAtCursor(session: O10mSiegeSession | null | undefined): string | null {
  const siege = sanitizeSiegeSession(session);
  if (!siege || !siege.active) return null;
  return siege.scenarioIds[siege.cursor] ?? null;
}

export function buildSiegeScenarioStartOverrides(session: O10mSiegeSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const siege = sanitizeSiegeSession(session);
  if (!siege) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_SIEGE_MORALE_MONEY_CAP, Math.floor(siege.moraleScore * 0.74));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSiegeId: siege.siegeId,
      o10mActiveSiegeStep: siege.cursor,
      o10mActiveSiegePhase: siege.phaseTag,
      o10mSiegeMorale: siege.moraleScore,
    },
  };
}

export function advanceSiegeSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSiegeSession(state.siegeSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const moraleScore = Math.min(O10M_SIEGE_MORALE_CAP, session.moraleScore + siegeMoraleFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      siegeSession: {
        ...session,
        cursor,
        moraleScore,
        phaseTag: siegePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSiegeId(session.siegeId);
  let next: O10mModesPersistedState = {
    ...state,
    siegeSession: { ...session, active: false, moraleScore, phaseTag: 'relief' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function siegeSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  morale: number;
  phase: O10mSiegePhase | null;
} {
  const session = sanitizeSiegeSession(state.siegeSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    morale: session?.moraleScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
