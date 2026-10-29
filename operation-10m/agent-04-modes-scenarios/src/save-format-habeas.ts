import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mHabeasPhase,
  O10mHabeasSession,
} from './types.js';

export const O10M_HABEAS_SCENARIO_CAP = 6;
export const O10M_HABEAS_SCORE_CAP = 1100;
export const O10M_HABEAS_SCORE_MONEY_CAP = 1190;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mHabeasPhase>(['filing', 'review', 'habeas']);

export function unlockTokenForHabeasId(habeasId: string): string | null {
  if (!habeasId.startsWith('o10m_habeas_')) return null;
  return `o10m_unlock_${habeasId.slice('o10m_habeas_'.length)}`;
}

export function habeasPhaseForCursor(cursor: number, scenarioCount: number): O10mHabeasPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'habeas';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function habeasScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(143, Math.max(36, Math.floor(run.playerNetWorth / 122) + standingSlice));
}

export function sanitizeHabeasSession(raw: unknown): O10mHabeasSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const habeasId =
    typeof o.habeasId === 'string' && o.habeasId.startsWith('o10m_habeas_')
      ? o.habeasId
      : null;
  if (!habeasId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : habeasId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_HABEAS_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const habeasScore = Math.min(
    O10M_HABEAS_SCORE_CAP,
    Math.max(0, Math.floor(num(o.habeasScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mHabeasPhase)
      ? (phaseRaw as O10mHabeasPhase)
      : habeasPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    habeasId,
    label,
    scenarioIds,
    cursor,
    active,
    habeasScore,
    phaseTag,
  };
}

export function createHabeasSession(params: {
  habeasId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mHabeasSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.habeasId.startsWith('o10m_habeas_')) {
    return { session: null, warnings: ['Habeas ids must start with o10m_habeas_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_HABEAS_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Habeas arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      habeasId: params.habeasId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      habeasScore: 0,
      phaseTag: habeasPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachHabeasSessionToState(
  state: O10mModesPersistedState,
  session: O10mHabeasSession,
): O10mModesPersistedState {
  const sanitized = sanitizeHabeasSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    habeasSession: sanitized,
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

export function clearHabeasSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, habeasSession: null };
}

export function getHabeasScenarioAtCursor(
  session: O10mHabeasSession | null | undefined,
): string | null {
  const habeas = sanitizeHabeasSession(session);
  if (!habeas || !habeas.active) return null;
  return habeas.scenarioIds[habeas.cursor] ?? null;
}

export function buildHabeasScenarioStartOverrides(
  session: O10mHabeasSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const habeas = sanitizeHabeasSession(session);
  if (!habeas) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_HABEAS_SCORE_MONEY_CAP,
    Math.floor(habeas.habeasScore * 0.89),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveHabeasId: habeas.habeasId,
      o10mActiveHabeasStep: habeas.cursor,
      o10mActiveHabeasPhase: habeas.phaseTag,
      o10mHabeasScore: habeas.habeasScore,
    },
  };
}

export function advanceHabeasSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeHabeasSession(state.habeasSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const habeasScore = Math.min(
    O10M_HABEAS_SCORE_CAP,
    session.habeasScore + habeasScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      habeasSession: {
        ...session,
        cursor,
        habeasScore,
        phaseTag: habeasPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForHabeasId(session.habeasId);
  let next: O10mModesPersistedState = {
    ...state,
    habeasSession: { ...session, active: false, habeasScore, phaseTag: 'habeas' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function habeasSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  habeasScore: number;
  phase: O10mHabeasPhase | null;
} {
  const session = sanitizeHabeasSession(state.habeasSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    habeasScore: session?.habeasScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
