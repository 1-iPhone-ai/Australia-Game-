import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mDissolutionPhase,
  O10mDissolutionSession,
} from './types.js';

export const O10M_DISSOLUTION_SCENARIO_CAP = 6;
export const O10M_DISSOLUTION_SCORE_CAP = 1150;
export const O10M_DISSOLUTION_SCORE_MONEY_CAP = 1240;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mDissolutionPhase>(['filing', 'review', 'dissolution']);

export function unlockTokenForDissolutionId(dissolutionId: string): string | null {
  if (!dissolutionId.startsWith('o10m_dissolution_')) return null;
  return `o10m_unlock_${dissolutionId.slice('o10m_dissolution_'.length)}`;
}

export function dissolutionPhaseForCursor(cursor: number, scenarioCount: number): O10mDissolutionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'dissolution';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function dissolutionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(150, Math.max(36, Math.floor(run.playerNetWorth / 108) + standingSlice));
}

export function sanitizeDissolutionSession(raw: unknown): O10mDissolutionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const dissolutionId =
    typeof o.dissolutionId === 'string' && o.dissolutionId.startsWith('o10m_dissolution_')
      ? o.dissolutionId
      : null;
  if (!dissolutionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : dissolutionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_DISSOLUTION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const dissolutionScore = Math.min(
    O10M_DISSOLUTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.dissolutionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mDissolutionPhase)
      ? (phaseRaw as O10mDissolutionPhase)
      : dissolutionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    dissolutionId,
    label,
    scenarioIds,
    cursor,
    active,
    dissolutionScore,
    phaseTag,
  };
}

export function createDissolutionSession(params: {
  dissolutionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mDissolutionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.dissolutionId.startsWith('o10m_dissolution_')) {
    return { session: null, warnings: ['Dissolution ids must start with o10m_dissolution_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_DISSOLUTION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Dissolution arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      dissolutionId: params.dissolutionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      dissolutionScore: 0,
      phaseTag: dissolutionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachDissolutionSessionToState(
  state: O10mModesPersistedState,
  session: O10mDissolutionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeDissolutionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    dissolutionSession: sanitized,
    liquidationDepthSession: null,
    liquidationSession: null,
    receivershipSession: null,
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

export function clearDissolutionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, dissolutionSession: null };
}

export function getDissolutionScenarioAtCursor(
  session: O10mDissolutionSession | null | undefined,
): string | null {
  const dissolution = sanitizeDissolutionSession(session);
  if (!dissolution || !dissolution.active) return null;
  return dissolution.scenarioIds[dissolution.cursor] ?? null;
}

export function buildDissolutionScenarioStartOverrides(
  session: O10mDissolutionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const dissolution = sanitizeDissolutionSession(session);
  if (!dissolution) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_DISSOLUTION_SCORE_MONEY_CAP,
    Math.floor(dissolution.dissolutionScore * 0.95),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveDissolutionId: dissolution.dissolutionId,
      o10mActiveDissolutionStep: dissolution.cursor,
      o10mActiveDissolutionPhase: dissolution.phaseTag,
      o10mDissolutionScore: dissolution.dissolutionScore,
    },
  };
}

export function advanceDissolutionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeDissolutionSession(state.dissolutionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const dissolutionScore = Math.min(
    O10M_DISSOLUTION_SCORE_CAP,
    session.dissolutionScore + dissolutionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      dissolutionSession: {
        ...session,
        cursor,
        dissolutionScore,
        phaseTag: dissolutionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForDissolutionId(session.dissolutionId);
  let next: O10mModesPersistedState = {
    ...state,
    dissolutionSession: { ...session, active: false, dissolutionScore, phaseTag: 'dissolution' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function dissolutionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  dissolutionScore: number;
  phase: O10mDissolutionPhase | null;
} {
  const session = sanitizeDissolutionSession(state.dissolutionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    dissolutionScore: session?.dissolutionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
