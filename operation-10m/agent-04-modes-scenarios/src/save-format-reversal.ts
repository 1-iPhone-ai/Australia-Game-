import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mReversalPhase,
  O10mReversalSession,
} from './types.js';

export const O10M_REVERSAL_SCENARIO_CAP = 6;
export const O10M_REVERSAL_SCORE_CAP = 1010;
export const O10M_REVERSAL_SCORE_MONEY_CAP = 1090;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReversalPhase>(['motion', 'review', 'reversal']);

export function unlockTokenForReversalId(reversalId: string): string | null {
  if (!reversalId.startsWith('o10m_reversal_')) return null;
  return `o10m_unlock_${reversalId.slice('o10m_reversal_'.length)}`;
}

export function reversalPhaseForCursor(cursor: number, scenarioCount: number): O10mReversalPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'reversal';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'motion';
}

export function reversalScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(132, Math.max(29, Math.floor(run.playerNetWorth / 140) + standingSlice));
}

export function sanitizeReversalSession(raw: unknown): O10mReversalSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const reversalId =
    typeof o.reversalId === 'string' && o.reversalId.startsWith('o10m_reversal_') ? o.reversalId : null;
  if (!reversalId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : reversalId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REVERSAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const reversalScore = Math.min(
    O10M_REVERSAL_SCORE_CAP,
    Math.max(0, Math.floor(num(o.reversalScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReversalPhase)
      ? (phaseRaw as O10mReversalPhase)
      : reversalPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    reversalId,
    label,
    scenarioIds,
    cursor,
    active,
    reversalScore,
    phaseTag,
  };
}

export function createReversalSession(params: {
  reversalId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReversalSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.reversalId.startsWith('o10m_reversal_')) {
    return { session: null, warnings: ['Reversal ids must start with o10m_reversal_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_REVERSAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Reversal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      reversalId: params.reversalId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      reversalScore: 0,
      phaseTag: reversalPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReversalSessionToState(
  state: O10mModesPersistedState,
  session: O10mReversalSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReversalSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    reversalSession: sanitized,
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
    injunctionSession: null,
    contemptSession: null,
    sequestrationSession: null,
    receivershipSession: null,
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

export function clearReversalSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, reversalSession: null };
}

export function getReversalScenarioAtCursor(
  session: O10mReversalSession | null | undefined,
): string | null {
  const reversal = sanitizeReversalSession(session);
  if (!reversal || !reversal.active) return null;
  return reversal.scenarioIds[reversal.cursor] ?? null;
}

export function buildReversalScenarioStartOverrides(
  session: O10mReversalSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const reversal = sanitizeReversalSession(session);
  if (!reversal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REVERSAL_SCORE_MONEY_CAP,
    Math.floor(reversal.reversalScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReversalId: reversal.reversalId,
      o10mActiveReversalStep: reversal.cursor,
      o10mActiveReversalPhase: reversal.phaseTag,
      o10mReversalScore: reversal.reversalScore,
    },
  };
}

export function advanceReversalSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReversalSession(state.reversalSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const reversalScore = Math.min(
    O10M_REVERSAL_SCORE_CAP,
    session.reversalScore + reversalScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      reversalSession: {
        ...session,
        cursor,
        reversalScore,
        phaseTag: reversalPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReversalId(session.reversalId);
  let next: O10mModesPersistedState = {
    ...state,
    reversalSession: { ...session, active: false, reversalScore, phaseTag: 'reversal' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function reversalSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  reversalScore: number;
  phase: O10mReversalPhase | null;
} {
  const session = sanitizeReversalSession(state.reversalSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    reversalScore: session?.reversalScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
