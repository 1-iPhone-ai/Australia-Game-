import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mContemptPhase,
  O10mContemptSession,
} from './types.js';

export const O10M_CONTEMPT_SCENARIO_CAP = 6;
export const O10M_CONTEMPT_SCORE_CAP = 1126;
export const O10M_CONTEMPT_SCORE_MONEY_CAP = 1208;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mContemptPhase>(['filing', 'review', 'contempt']);

export function unlockTokenForContemptId(contemptId: string): string | null {
  if (!contemptId.startsWith('o10m_contempt_')) return null;
  return `o10m_unlock_${contemptId.slice('o10m_contempt_'.length)}`;
}

export function contemptPhaseForCursor(cursor: number, scenarioCount: number): O10mContemptPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'contempt';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function contemptScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(146, Math.max(36, Math.floor(run.playerNetWorth / 116) + standingSlice));
}

export function sanitizeContemptSession(raw: unknown): O10mContemptSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const contemptId =
    typeof o.contemptId === 'string' && o.contemptId.startsWith('o10m_contempt_')
      ? o.contemptId
      : null;
  if (!contemptId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : contemptId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CONTEMPT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const contemptScore = Math.min(
    O10M_CONTEMPT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.contemptScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mContemptPhase)
      ? (phaseRaw as O10mContemptPhase)
      : contemptPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    contemptId,
    label,
    scenarioIds,
    cursor,
    active,
    contemptScore,
    phaseTag,
  };
}

export function createContemptSession(params: {
  contemptId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mContemptSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.contemptId.startsWith('o10m_contempt_')) {
    return { session: null, warnings: ['Contempt ids must start with o10m_contempt_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_CONTEMPT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Contempt arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      contemptId: params.contemptId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      contemptScore: 0,
      phaseTag: contemptPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachContemptSessionToState(
  state: O10mModesPersistedState,
  session: O10mContemptSession,
): O10mModesPersistedState {
  const sanitized = sanitizeContemptSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    contemptSession: sanitized,
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

export function clearContemptSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, contemptSession: null };
}

export function getContemptScenarioAtCursor(
  session: O10mContemptSession | null | undefined,
): string | null {
  const contempt = sanitizeContemptSession(session);
  if (!contempt || !contempt.active) return null;
  return contempt.scenarioIds[contempt.cursor] ?? null;
}

export function buildContemptScenarioStartOverrides(
  session: O10mContemptSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const contempt = sanitizeContemptSession(session);
  if (!contempt) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CONTEMPT_SCORE_MONEY_CAP,
    Math.floor(contempt.contemptScore * 0.92),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveContemptId: contempt.contemptId,
      o10mActiveContemptStep: contempt.cursor,
      o10mActiveContemptPhase: contempt.phaseTag,
      o10mContemptScore: contempt.contemptScore,
    },
  };
}

export function advanceContemptSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeContemptSession(state.contemptSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const contemptScore = Math.min(
    O10M_CONTEMPT_SCORE_CAP,
    session.contemptScore + contemptScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      contemptSession: {
        ...session,
        cursor,
        contemptScore,
        phaseTag: contemptPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForContemptId(session.contemptId);
  let next: O10mModesPersistedState = {
    ...state,
    contemptSession: { ...session, active: false, contemptScore, phaseTag: 'contempt' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function contemptSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  contemptScore: number;
  phase: O10mContemptPhase | null;
} {
  const session = sanitizeContemptSession(state.contemptSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    contemptScore: session?.contemptScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
