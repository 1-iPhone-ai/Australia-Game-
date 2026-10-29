import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mReceivershipPhase,
  O10mReceivershipSession,
} from './types.js';

export const O10M_RECEIVERSHIP_SCENARIO_CAP = 6;
export const O10M_RECEIVERSHIP_SCORE_CAP = 1138;
export const O10M_RECEIVERSHIP_SCORE_MONEY_CAP = 1224;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReceivershipPhase>(['filing', 'review', 'receivership']);

export function unlockTokenForReceivershipId(receivershipId: string): string | null {
  if (!receivershipId.startsWith('o10m_receivership_')) return null;
  return `o10m_unlock_${receivershipId.slice('o10m_receivership_'.length)}`;
}

export function receivershipPhaseForCursor(cursor: number, scenarioCount: number): O10mReceivershipPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'receivership';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function receivershipScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(148, Math.max(36, Math.floor(run.playerNetWorth / 112) + standingSlice));
}

export function sanitizeReceivershipSession(raw: unknown): O10mReceivershipSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const receivershipId =
    typeof o.receivershipId === 'string' && o.receivershipId.startsWith('o10m_receivership_')
      ? o.receivershipId
      : null;
  if (!receivershipId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : receivershipId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_RECEIVERSHIP_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const receivershipScore = Math.min(
    O10M_RECEIVERSHIP_SCORE_CAP,
    Math.max(0, Math.floor(num(o.receivershipScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReceivershipPhase)
      ? (phaseRaw as O10mReceivershipPhase)
      : receivershipPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    receivershipId,
    label,
    scenarioIds,
    cursor,
    active,
    receivershipScore,
    phaseTag,
  };
}

export function createReceivershipSession(params: {
  receivershipId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReceivershipSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.receivershipId.startsWith('o10m_receivership_')) {
    return { session: null, warnings: ['Receivership ids must start with o10m_receivership_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_RECEIVERSHIP_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Receivership arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      receivershipId: params.receivershipId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      receivershipScore: 0,
      phaseTag: receivershipPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReceivershipSessionToState(
  state: O10mModesPersistedState,
  session: O10mReceivershipSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReceivershipSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    receivershipSession: sanitized,
    sequestrationSession: null,
    contemptSession: null,
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

export function clearReceivershipSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, receivershipSession: null };
}

export function getReceivershipScenarioAtCursor(
  session: O10mReceivershipSession | null | undefined,
): string | null {
  const receivership = sanitizeReceivershipSession(session);
  if (!receivership || !receivership.active) return null;
  return receivership.scenarioIds[receivership.cursor] ?? null;
}

export function buildReceivershipScenarioStartOverrides(
  session: O10mReceivershipSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const receivership = sanitizeReceivershipSession(session);
  if (!receivership) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_RECEIVERSHIP_SCORE_MONEY_CAP,
    Math.floor(receivership.receivershipScore * 0.94),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReceivershipId: receivership.receivershipId,
      o10mActiveReceivershipStep: receivership.cursor,
      o10mActiveReceivershipPhase: receivership.phaseTag,
      o10mReceivershipScore: receivership.receivershipScore,
    },
  };
}

export function advanceReceivershipSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReceivershipSession(state.receivershipSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const receivershipScore = Math.min(
    O10M_RECEIVERSHIP_SCORE_CAP,
    session.receivershipScore + receivershipScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      receivershipSession: {
        ...session,
        cursor,
        receivershipScore,
        phaseTag: receivershipPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReceivershipId(session.receivershipId);
  let next: O10mModesPersistedState = {
    ...state,
    receivershipSession: { ...session, active: false, receivershipScore, phaseTag: 'receivership' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function receivershipSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  receivershipScore: number;
  phase: O10mReceivershipPhase | null;
} {
  const session = sanitizeReceivershipSession(state.receivershipSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    receivershipScore: session?.receivershipScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
