import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mReinstatementPhase,
  O10mReinstatementSession,
} from './types.js';

export const O10M_REINSTATEMENT_SCENARIO_CAP = 6;
export const O10M_REINSTATEMENT_SCORE_CAP = 1030;
export const O10M_REINSTATEMENT_SCORE_MONEY_CAP = 1110;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mReinstatementPhase>(['filing', 'review', 'reinstatement']);

export function unlockTokenForReinstatementId(reinstatementId: string): string | null {
  if (!reinstatementId.startsWith('o10m_reinstatement_')) return null;
  return `o10m_unlock_${reinstatementId.slice('o10m_reinstatement_'.length)}`;
}

export function reinstatementPhaseForCursor(cursor: number, scenarioCount: number): O10mReinstatementPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'reinstatement';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function reinstatementScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(136, Math.max(31, Math.floor(run.playerNetWorth / 136) + standingSlice));
}

export function sanitizeReinstatementSession(raw: unknown): O10mReinstatementSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const reinstatementId =
    typeof o.reinstatementId === 'string' && o.reinstatementId.startsWith('o10m_reinstatement_')
      ? o.reinstatementId
      : null;
  if (!reinstatementId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : reinstatementId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REINSTATEMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const reinstatementScore = Math.min(
    O10M_REINSTATEMENT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.reinstatementScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mReinstatementPhase)
      ? (phaseRaw as O10mReinstatementPhase)
      : reinstatementPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    reinstatementId,
    label,
    scenarioIds,
    cursor,
    active,
    reinstatementScore,
    phaseTag,
  };
}

export function createReinstatementSession(params: {
  reinstatementId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mReinstatementSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.reinstatementId.startsWith('o10m_reinstatement_')) {
    return { session: null, warnings: ['Reinstatement ids must start with o10m_reinstatement_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_REINSTATEMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Reinstatement arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      reinstatementId: params.reinstatementId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      reinstatementScore: 0,
      phaseTag: reinstatementPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachReinstatementSessionToState(
  state: O10mModesPersistedState,
  session: O10mReinstatementSession,
): O10mModesPersistedState {
  const sanitized = sanitizeReinstatementSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    reinstatementSession: sanitized,
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

export function clearReinstatementSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, reinstatementSession: null };
}

export function getReinstatementScenarioAtCursor(
  session: O10mReinstatementSession | null | undefined,
): string | null {
  const reinstatement = sanitizeReinstatementSession(session);
  if (!reinstatement || !reinstatement.active) return null;
  return reinstatement.scenarioIds[reinstatement.cursor] ?? null;
}

export function buildReinstatementScenarioStartOverrides(
  session: O10mReinstatementSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const reinstatement = sanitizeReinstatementSession(session);
  if (!reinstatement) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REINSTATEMENT_SCORE_MONEY_CAP,
    Math.floor(reinstatement.reinstatementScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveReinstatementId: reinstatement.reinstatementId,
      o10mActiveReinstatementStep: reinstatement.cursor,
      o10mActiveReinstatementPhase: reinstatement.phaseTag,
      o10mReinstatementScore: reinstatement.reinstatementScore,
    },
  };
}

export function advanceReinstatementSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeReinstatementSession(state.reinstatementSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const reinstatementScore = Math.min(
    O10M_REINSTATEMENT_SCORE_CAP,
    session.reinstatementScore + reinstatementScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      reinstatementSession: {
        ...session,
        cursor,
        reinstatementScore,
        phaseTag: reinstatementPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForReinstatementId(session.reinstatementId);
  let next: O10mModesPersistedState = {
    ...state,
    reinstatementSession: { ...session, active: false, reinstatementScore, phaseTag: 'reinstatement' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function reinstatementSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  reinstatementScore: number;
  phase: O10mReinstatementPhase | null;
} {
  const session = sanitizeReinstatementSession(state.reinstatementSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    reinstatementScore: session?.reinstatementScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
