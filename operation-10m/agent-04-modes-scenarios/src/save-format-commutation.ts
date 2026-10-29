import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mCommutationPhase,
  O10mCommutationSession,
} from './types.js';

export const O10M_COMMUTATION_SCENARIO_CAP = 6;
export const O10M_COMMUTATION_LENIENCY_SCORE_CAP = 920;
export const O10M_COMMUTATION_LENIENCY_SCORE_MONEY_CAP = 1000;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mCommutationPhase>(['petition', 'review', 'commutation']);

export function unlockTokenForCommutationId(commutationId: string): string | null {
  if (!commutationId.startsWith('o10m_commutation_')) return null;
  return `o10m_unlock_${commutationId.slice('o10m_commutation_'.length)}`;
}

export function commutationPhaseForCursor(cursor: number, scenarioCount: number): O10mCommutationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'commutation';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'petition';
}

export function commutationLeniencyScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(120, Math.max(23, Math.floor(run.playerNetWorth / 158) + standingSlice));
}

export function sanitizeCommutationSession(raw: unknown): O10mCommutationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const commutationId =
    typeof o.commutationId === 'string' && o.commutationId.startsWith('o10m_commutation_') ? o.commutationId : null;
  if (!commutationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : commutationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_COMMUTATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const leniencyScore = Math.min(
    O10M_COMMUTATION_LENIENCY_SCORE_CAP,
    Math.max(0, Math.floor(num(o.leniencyScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mCommutationPhase)
      ? (phaseRaw as O10mCommutationPhase)
      : commutationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    commutationId,
    label,
    scenarioIds,
    cursor,
    active,
    leniencyScore,
    phaseTag,
  };
}

export function createCommutationSession(params: {
  commutationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCommutationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.commutationId.startsWith('o10m_commutation_')) {
    return { session: null, warnings: ['Commutation ids must start with o10m_commutation_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_COMMUTATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Commutation arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      commutationId: params.commutationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      leniencyScore: 0,
      phaseTag: commutationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCommutationSessionToState(
  state: O10mModesPersistedState,
  session: O10mCommutationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCommutationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    commutationSession: sanitized,
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
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

export function clearCommutationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, commutationSession: null };
}

export function getCommutationScenarioAtCursor(
  session: O10mCommutationSession | null | undefined,
): string | null {
  const commutation = sanitizeCommutationSession(session);
  if (!commutation || !commutation.active) return null;
  return commutation.scenarioIds[commutation.cursor] ?? null;
}

export function buildCommutationScenarioStartOverrides(
  session: O10mCommutationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const commutation = sanitizeCommutationSession(session);
  if (!commutation) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_COMMUTATION_LENIENCY_SCORE_MONEY_CAP,
    Math.floor(commutation.leniencyScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCommutationId: commutation.commutationId,
      o10mActiveCommutationStep: commutation.cursor,
      o10mActiveCommutationPhase: commutation.phaseTag,
      o10mCommutationLeniencyScore: commutation.leniencyScore,
    },
  };
}

export function advanceCommutationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCommutationSession(state.commutationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const leniencyScore = Math.min(
    O10M_COMMUTATION_LENIENCY_SCORE_CAP,
    session.leniencyScore + commutationLeniencyScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      commutationSession: {
        ...session,
        cursor,
        leniencyScore,
        phaseTag: commutationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCommutationId(session.commutationId);
  let next: O10mModesPersistedState = {
    ...state,
    commutationSession: { ...session, active: false, leniencyScore, phaseTag: 'commutation' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function commutationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  leniencyScore: number;
  phase: O10mCommutationPhase | null;
} {
  const session = sanitizeCommutationSession(state.commutationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    leniencyScore: session?.leniencyScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
