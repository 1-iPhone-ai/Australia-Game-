import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mVacaturPhase,
  O10mVacaturSession,
} from './types.js';

export const O10M_VACATUR_SCENARIO_CAP = 6;
export const O10M_VACATUR_MERIT_SCORE_CAP = 990;
export const O10M_VACATUR_MERIT_SCORE_MONEY_CAP = 1070;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mVacaturPhase>(['petition', 'review', 'vacatur']);

export function unlockTokenForVacaturId(vacaturId: string): string | null {
  if (!vacaturId.startsWith('o10m_vacatur_')) return null;
  return `o10m_unlock_${vacaturId.slice('o10m_vacatur_'.length)}`;
}

export function vacaturPhaseForCursor(cursor: number, scenarioCount: number): O10mVacaturPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'vacatur';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'petition';
}

export function vacaturMeritScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(128, Math.max(27, Math.floor(run.playerNetWorth / 144) + standingSlice));
}

export function sanitizeVacaturSession(raw: unknown): O10mVacaturSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const vacaturId =
    typeof o.vacaturId === 'string' && o.vacaturId.startsWith('o10m_vacatur_') ? o.vacaturId : null;
  if (!vacaturId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : vacaturId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_VACATUR_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const meritScore = Math.min(
    O10M_VACATUR_MERIT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.meritScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mVacaturPhase)
      ? (phaseRaw as O10mVacaturPhase)
      : vacaturPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    vacaturId,
    label,
    scenarioIds,
    cursor,
    active,
    meritScore,
    phaseTag,
  };
}

export function createVacaturSession(params: {
  vacaturId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mVacaturSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.vacaturId.startsWith('o10m_vacatur_')) {
    return { session: null, warnings: ['Vacatur ids must start with o10m_vacatur_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_VACATUR_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Vacatur arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      vacaturId: params.vacaturId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      meritScore: 0,
      phaseTag: vacaturPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachVacaturSessionToState(
  state: O10mModesPersistedState,
  session: O10mVacaturSession,
): O10mModesPersistedState {
  const sanitized = sanitizeVacaturSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    vacaturSession: sanitized,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
    setAsideSession: null,
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

export function clearVacaturSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, vacaturSession: null };
}

export function getVacaturScenarioAtCursor(
  session: O10mVacaturSession | null | undefined,
): string | null {
  const vacatur = sanitizeVacaturSession(session);
  if (!vacatur || !vacatur.active) return null;
  return vacatur.scenarioIds[vacatur.cursor] ?? null;
}

export function buildVacaturScenarioStartOverrides(
  session: O10mVacaturSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const vacatur = sanitizeVacaturSession(session);
  if (!vacatur) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_VACATUR_MERIT_SCORE_MONEY_CAP,
    Math.floor(vacatur.meritScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveVacaturId: vacatur.vacaturId,
      o10mActiveVacaturStep: vacatur.cursor,
      o10mActiveVacaturPhase: vacatur.phaseTag,
      o10mVacaturMeritScore: vacatur.meritScore,
    },
  };
}

export function advanceVacaturSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeVacaturSession(state.vacaturSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const meritScore = Math.min(
    O10M_VACATUR_MERIT_SCORE_CAP,
    session.meritScore + vacaturMeritScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      vacaturSession: {
        ...session,
        cursor,
        meritScore,
        phaseTag: vacaturPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForVacaturId(session.vacaturId);
  let next: O10mModesPersistedState = {
    ...state,
    vacaturSession: { ...session, active: false, meritScore, phaseTag: 'vacatur' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function vacaturSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  meritScore: number;
  phase: O10mVacaturPhase | null;
} {
  const session = sanitizeVacaturSession(state.vacaturSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    meritScore: session?.meritScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
