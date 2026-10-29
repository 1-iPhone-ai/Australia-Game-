import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mQuashPhase,
  O10mQuashSession,
} from './types.js';

export const O10M_QUASH_SCENARIO_CAP = 6;
export const O10M_QUASH_SCORE_CAP = 1050;
export const O10M_QUASH_SCORE_MONEY_CAP = 1130;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mQuashPhase>(['filing', 'review', 'quash']);

export function unlockTokenForQuashId(quashId: string): string | null {
  if (!quashId.startsWith('o10m_quash_')) return null;
  return `o10m_unlock_${quashId.slice('o10m_quash_'.length)}`;
}

export function quashPhaseForCursor(cursor: number, scenarioCount: number): O10mQuashPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'quash';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function quashScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(138, Math.max(33, Math.floor(run.playerNetWorth / 132) + standingSlice));
}

export function sanitizeQuashSession(raw: unknown): O10mQuashSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const quashId =
    typeof o.quashId === 'string' && o.quashId.startsWith('o10m_quash_') ? o.quashId : null;
  if (!quashId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : quashId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_QUASH_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const quashScore = Math.min(
    O10M_QUASH_SCORE_CAP,
    Math.max(0, Math.floor(num(o.quashScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mQuashPhase)
      ? (phaseRaw as O10mQuashPhase)
      : quashPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    quashId,
    label,
    scenarioIds,
    cursor,
    active,
    quashScore,
    phaseTag,
  };
}

export function createQuashSession(params: {
  quashId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mQuashSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.quashId.startsWith('o10m_quash_')) {
    return { session: null, warnings: ['Quash ids must start with o10m_quash_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_QUASH_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Quash arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      quashId: params.quashId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      quashScore: 0,
      phaseTag: quashPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachQuashSessionToState(
  state: O10mModesPersistedState,
  session: O10mQuashSession,
): O10mModesPersistedState {
  const sanitized = sanitizeQuashSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    quashSession: sanitized,
    supersedeSession: null,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
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

export function clearQuashSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, quashSession: null };
}

export function getQuashScenarioAtCursor(
  session: O10mQuashSession | null | undefined,
): string | null {
  const quash = sanitizeQuashSession(session);
  if (!quash || !quash.active) return null;
  return quash.scenarioIds[quash.cursor] ?? null;
}

export function buildQuashScenarioStartOverrides(
  session: O10mQuashSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const quash = sanitizeQuashSession(session);
  if (!quash) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_QUASH_SCORE_MONEY_CAP,
    Math.floor(quash.quashScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveQuashId: quash.quashId,
      o10mActiveQuashStep: quash.cursor,
      o10mActiveQuashPhase: quash.phaseTag,
      o10mQuashScore: quash.quashScore,
    },
  };
}

export function advanceQuashSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeQuashSession(state.quashSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const quashScore = Math.min(
    O10M_QUASH_SCORE_CAP,
    session.quashScore + quashScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      quashSession: {
        ...session,
        cursor,
        quashScore,
        phaseTag: quashPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForQuashId(session.quashId);
  let next: O10mModesPersistedState = {
    ...state,
    quashSession: { ...session, active: false, quashScore, phaseTag: 'quash' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function quashSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  quashScore: number;
  phase: O10mQuashPhase | null;
} {
  const session = sanitizeQuashSession(state.quashSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    quashScore: session?.quashScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
