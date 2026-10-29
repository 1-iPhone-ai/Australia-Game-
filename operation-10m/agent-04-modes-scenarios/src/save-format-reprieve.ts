import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mReprievePhase,
  O10mReprieveSession,
} from './types.js';

export const O10M_REPRIEVE_SCENARIO_CAP = 6;
export const O10M_REPRIEVE_RELIEF_SCORE_CAP = 860;
export const O10M_REPRIEVE_RELIEF_SCORE_MONEY_CAP = 940;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReprievePhase>(['filing', 'review', 'reprieve']);

export function unlockTokenForReprieveId(reprieveId: string): string | null {
  if (!reprieveId.startsWith('o10m_reprieve_')) return null;
  return `o10m_unlock_${reprieveId.slice('o10m_reprieve_'.length)}`;
}

export function reprievePhaseForCursor(cursor: number, scenarioCount: number): O10mReprievePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'reprieve';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function reprieveReliefScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(114, Math.max(20, Math.floor(run.playerNetWorth / 168) + standingSlice));
}

export function sanitizeReprieveSession(raw: unknown): O10mReprieveSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const reprieveId =
    typeof o.reprieveId === 'string' && o.reprieveId.startsWith('o10m_reprieve_') ? o.reprieveId : null;
  if (!reprieveId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : reprieveId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REPRIEVE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const reliefScore = Math.min(
    O10M_REPRIEVE_RELIEF_SCORE_CAP,
    Math.max(0, Math.floor(num(o.reliefScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReprievePhase)
      ? (phaseRaw as O10mReprievePhase)
      : reprievePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    reprieveId,
    label,
    scenarioIds,
    cursor,
    active,
    reliefScore,
    phaseTag,
  };
}

export function createReprieveSession(params: {
  reprieveId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReprieveSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.reprieveId.startsWith('o10m_reprieve_')) {
    return { session: null, warnings: ['Reprieve ids must start with o10m_reprieve_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_REPRIEVE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Reprieve arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      reprieveId: params.reprieveId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      reliefScore: 0,
      phaseTag: reprievePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReprieveSessionToState(
  state: O10mModesPersistedState,
  session: O10mReprieveSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReprieveSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    reprieveSession: sanitized,
    paroleSession: null,
    probationSession: null,
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

export function clearReprieveSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, reprieveSession: null };
}

export function getReprieveScenarioAtCursor(
  session: O10mReprieveSession | null | undefined,
): string | null {
  const reprieve = sanitizeReprieveSession(session);
  if (!reprieve || !reprieve.active) return null;
  return reprieve.scenarioIds[reprieve.cursor] ?? null;
}

export function buildReprieveScenarioStartOverrides(
  session: O10mReprieveSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const reprieve = sanitizeReprieveSession(session);
  if (!reprieve) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REPRIEVE_RELIEF_SCORE_MONEY_CAP,
    Math.floor(reprieve.reliefScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReprieveId: reprieve.reprieveId,
      o10mActiveReprieveStep: reprieve.cursor,
      o10mActiveReprievePhase: reprieve.phaseTag,
      o10mReprieveReliefScore: reprieve.reliefScore,
    },
  };
}

export function advanceReprieveSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReprieveSession(state.reprieveSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const reliefScore = Math.min(
    O10M_REPRIEVE_RELIEF_SCORE_CAP,
    session.reliefScore + reprieveReliefScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      reprieveSession: {
        ...session,
        cursor,
        reliefScore,
        phaseTag: reprievePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReprieveId(session.reprieveId);
  let next: O10mModesPersistedState = {
    ...state,
    reprieveSession: { ...session, active: false, reliefScore, phaseTag: 'reprieve' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function reprieveSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  reliefScore: number;
  phase: O10mReprievePhase | null;
} {
  const session = sanitizeReprieveSession(state.reprieveSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    reliefScore: session?.reliefScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
