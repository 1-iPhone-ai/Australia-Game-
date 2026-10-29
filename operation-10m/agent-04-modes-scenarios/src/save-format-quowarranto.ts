import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mQuowarrantoPhase,
  O10mQuowarrantoSession,
} from './types.js';

export const O10M_QUOWARRANTO_SCENARIO_CAP = 6;
export const O10M_QUOWARRANTO_SCORE_CAP = 1110;
export const O10M_QUOWARRANTO_SCORE_MONEY_CAP = 1190;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mQuowarrantoPhase>(['filing', 'review', 'quowarranto']);

export function unlockTokenForQuowarrantoId(quowarrantoId: string): string | null {
  if (!quowarrantoId.startsWith('o10m_quowarranto_')) return null;
  return `o10m_unlock_${quowarrantoId.slice('o10m_quowarranto_'.length)}`;
}

export function quowarrantoPhaseForCursor(cursor: number, scenarioCount: number): O10mQuowarrantoPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'quowarranto';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function quowarrantoScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(144, Math.max(36, Math.floor(run.playerNetWorth / 120) + standingSlice));
}

export function sanitizeQuowarrantoSession(raw: unknown): O10mQuowarrantoSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const quowarrantoId =
    typeof o.quowarrantoId === 'string' && o.quowarrantoId.startsWith('o10m_quowarranto_')
      ? o.quowarrantoId
      : null;
  if (!quowarrantoId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : quowarrantoId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_QUOWARRANTO_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const quowarrantoScore = Math.min(
    O10M_QUOWARRANTO_SCORE_CAP,
    Math.max(0, Math.floor(num(o.quowarrantoScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mQuowarrantoPhase)
      ? (phaseRaw as O10mQuowarrantoPhase)
      : quowarrantoPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    quowarrantoId,
    label,
    scenarioIds,
    cursor,
    active,
    quowarrantoScore,
    phaseTag,
  };
}

export function createQuowarrantoSession(params: {
  quowarrantoId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mQuowarrantoSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.quowarrantoId.startsWith('o10m_quowarranto_')) {
    return { session: null, warnings: ['Quowarranto ids must start with o10m_quowarranto_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_QUOWARRANTO_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Quowarranto arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      quowarrantoId: params.quowarrantoId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      quowarrantoScore: 0,
      phaseTag: quowarrantoPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachQuowarrantoSessionToState(
  state: O10mModesPersistedState,
  session: O10mQuowarrantoSession,
): O10mModesPersistedState {
  const sanitized = sanitizeQuowarrantoSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    quowarrantoSession: sanitized,
    injunctionSession: null,
    contemptSession: null,
    sequestrationSession: null,
    liquidationSession: null,
    receivershipSession: null,
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

export function clearQuowarrantoSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, quowarrantoSession: null };
}

export function getQuowarrantoScenarioAtCursor(
  session: O10mQuowarrantoSession | null | undefined,
): string | null {
  const quowarranto = sanitizeQuowarrantoSession(session);
  if (!quowarranto || !quowarranto.active) return null;
  return quowarranto.scenarioIds[quowarranto.cursor] ?? null;
}

export function buildQuowarrantoScenarioStartOverrides(
  session: O10mQuowarrantoSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const quowarranto = sanitizeQuowarrantoSession(session);
  if (!quowarranto) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_QUOWARRANTO_SCORE_MONEY_CAP,
    Math.floor(quowarranto.quowarrantoScore * 0.90),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveQuowarrantoId: quowarranto.quowarrantoId,
      o10mActiveQuowarrantoStep: quowarranto.cursor,
      o10mActiveQuowarrantoPhase: quowarranto.phaseTag,
      o10mQuowarrantoScore: quowarranto.quowarrantoScore,
    },
  };
}

export function advanceQuowarrantoSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeQuowarrantoSession(state.quowarrantoSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const quowarrantoScore = Math.min(
    O10M_QUOWARRANTO_SCORE_CAP,
    session.quowarrantoScore + quowarrantoScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      quowarrantoSession: {
        ...session,
        cursor,
        quowarrantoScore,
        phaseTag: quowarrantoPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForQuowarrantoId(session.quowarrantoId);
  let next: O10mModesPersistedState = {
    ...state,
    quowarrantoSession: { ...session, active: false, quowarrantoScore, phaseTag: 'quowarranto' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function quowarrantoSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  quowarrantoScore: number;
  phase: O10mQuowarrantoPhase | null;
} {
  const session = sanitizeQuowarrantoSession(state.quowarrantoSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    quowarrantoScore: session?.quowarrantoScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
