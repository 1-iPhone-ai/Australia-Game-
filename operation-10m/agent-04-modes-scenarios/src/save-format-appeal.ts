import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mAppealPhase,
  O10mAppealSession,
} from './types.js';

export const O10M_APPEAL_SCENARIO_CAP = 6;
export const O10M_APPEAL_MERIT_SCORE_CAP = 780;
export const O10M_APPEAL_MERIT_SCORE_MONEY_CAP = 860;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAppealPhase>(['petition', 'review', 'grant']);

export function unlockTokenForAppealId(appealId: string): string | null {
  if (!appealId.startsWith('o10m_appeal_')) return null;
  return `o10m_unlock_${appealId.slice('o10m_appeal_'.length)}`;
}

export function appealPhaseForCursor(cursor: number, scenarioCount: number): O10mAppealPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'grant';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'petition';
}

export function appealMeritScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(106, Math.max(16, Math.floor(run.playerNetWorth / 176) + standingSlice));
}

export function sanitizeAppealSession(raw: unknown): O10mAppealSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const appealId =
    typeof o.appealId === 'string' && o.appealId.startsWith('o10m_appeal_') ? o.appealId : null;
  if (!appealId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : appealId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_APPEAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const meritScore = Math.min(
    O10M_APPEAL_MERIT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.meritScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAppealPhase)
      ? (phaseRaw as O10mAppealPhase)
      : appealPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    appealId,
    label,
    scenarioIds,
    cursor,
    active,
    meritScore,
    phaseTag,
  };
}

export function createAppealSession(params: {
  appealId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAppealSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.appealId.startsWith('o10m_appeal_')) {
    return { session: null, warnings: ['Appeal ids must start with o10m_appeal_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_APPEAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Appeal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      appealId: params.appealId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      meritScore: 0,
      phaseTag: appealPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAppealSessionToState(
  state: O10mModesPersistedState,
  session: O10mAppealSession,
): O10mModesPersistedState {
  const sanitized = sanitizeAppealSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    appealSession: sanitized,
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
    injunctionSession: null,
    contemptSession: null,
    sequestrationSession: null,
    liquidationSession: null,
    receivershipSession: null,
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

export function clearAppealSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, appealSession: null };
}

export function getAppealScenarioAtCursor(
  session: O10mAppealSession | null | undefined,
): string | null {
  const appeal = sanitizeAppealSession(session);
  if (!appeal || !appeal.active) return null;
  return appeal.scenarioIds[appeal.cursor] ?? null;
}

export function buildAppealScenarioStartOverrides(
  session: O10mAppealSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const appeal = sanitizeAppealSession(session);
  if (!appeal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_APPEAL_MERIT_SCORE_MONEY_CAP,
    Math.floor(appeal.meritScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAppealId: appeal.appealId,
      o10mActiveAppealStep: appeal.cursor,
      o10mActiveAppealPhase: appeal.phaseTag,
      o10mAppealMeritScore: appeal.meritScore,
    },
  };
}

export function advanceAppealSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAppealSession(state.appealSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const meritScore = Math.min(
    O10M_APPEAL_MERIT_SCORE_CAP,
    session.meritScore + appealMeritScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      appealSession: {
        ...session,
        cursor,
        meritScore,
        phaseTag: appealPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAppealId(session.appealId);
  let next: O10mModesPersistedState = {
    ...state,
    appealSession: { ...session, active: false, meritScore, phaseTag: 'grant' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function appealSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  meritScore: number;
  phase: O10mAppealPhase | null;
} {
  const session = sanitizeAppealSession(state.appealSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    meritScore: session?.meritScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
