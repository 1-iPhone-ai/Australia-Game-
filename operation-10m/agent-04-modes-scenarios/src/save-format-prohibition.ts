import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mProhibitionPhase,
  O10mProhibitionSession,
} from './types.js';

export const O10M_PROHIBITION_SCENARIO_CAP = 6;
export const O10M_PROHIBITION_SCORE_CAP = 1090;
export const O10M_PROHIBITION_SCORE_MONEY_CAP = 1170;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mProhibitionPhase>(['filing', 'review', 'prohibition']);

export function unlockTokenForProhibitionId(prohibitionId: string): string | null {
  if (!prohibitionId.startsWith('o10m_prohibition_')) return null;
  return `o10m_unlock_${prohibitionId.slice('o10m_prohibition_'.length)}`;
}

export function prohibitionPhaseForCursor(cursor: number, scenarioCount: number): O10mProhibitionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'prohibition';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function prohibitionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(142, Math.max(36, Math.floor(run.playerNetWorth / 124) + standingSlice));
}

export function sanitizeProhibitionSession(raw: unknown): O10mProhibitionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const prohibitionId =
    typeof o.prohibitionId === 'string' && o.prohibitionId.startsWith('o10m_prohibition_')
      ? o.prohibitionId
      : null;
  if (!prohibitionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : prohibitionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PROHIBITION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const prohibitionScore = Math.min(
    O10M_PROHIBITION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.prohibitionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mProhibitionPhase)
      ? (phaseRaw as O10mProhibitionPhase)
      : prohibitionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    prohibitionId,
    label,
    scenarioIds,
    cursor,
    active,
    prohibitionScore,
    phaseTag,
  };
}

export function createProhibitionSession(params: {
  prohibitionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mProhibitionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.prohibitionId.startsWith('o10m_prohibition_')) {
    return { session: null, warnings: ['Prohibition ids must start with o10m_prohibition_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_PROHIBITION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Prohibition arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      prohibitionId: params.prohibitionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      prohibitionScore: 0,
      phaseTag: prohibitionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachProhibitionSessionToState(
  state: O10mModesPersistedState,
  session: O10mProhibitionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeProhibitionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    prohibitionSession: sanitized,
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

export function clearProhibitionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, prohibitionSession: null };
}

export function getProhibitionScenarioAtCursor(
  session: O10mProhibitionSession | null | undefined,
): string | null {
  const prohibition = sanitizeProhibitionSession(session);
  if (!prohibition || !prohibition.active) return null;
  return prohibition.scenarioIds[prohibition.cursor] ?? null;
}

export function buildProhibitionScenarioStartOverrides(
  session: O10mProhibitionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const prohibition = sanitizeProhibitionSession(session);
  if (!prohibition) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PROHIBITION_SCORE_MONEY_CAP,
    Math.floor(prohibition.prohibitionScore * 0.88),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveProhibitionId: prohibition.prohibitionId,
      o10mActiveProhibitionStep: prohibition.cursor,
      o10mActiveProhibitionPhase: prohibition.phaseTag,
      o10mProhibitionScore: prohibition.prohibitionScore,
    },
  };
}

export function advanceProhibitionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeProhibitionSession(state.prohibitionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const prohibitionScore = Math.min(
    O10M_PROHIBITION_SCORE_CAP,
    session.prohibitionScore + prohibitionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      prohibitionSession: {
        ...session,
        cursor,
        prohibitionScore,
        phaseTag: prohibitionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForProhibitionId(session.prohibitionId);
  let next: O10mModesPersistedState = {
    ...state,
    prohibitionSession: { ...session, active: false, prohibitionScore, phaseTag: 'prohibition' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function prohibitionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  prohibitionScore: number;
  phase: O10mProhibitionPhase | null;
} {
  const session = sanitizeProhibitionSession(state.prohibitionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    prohibitionScore: session?.prohibitionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
