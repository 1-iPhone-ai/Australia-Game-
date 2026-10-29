import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mInjunctionPhase,
  O10mInjunctionSession,
} from './types.js';

export const O10M_INJUNCTION_SCENARIO_CAP = 6;
export const O10M_INJUNCTION_SCORE_CAP = 1118;
export const O10M_INJUNCTION_SCORE_MONEY_CAP = 1180;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mInjunctionPhase>(['filing', 'review', 'injunction']);

export function unlockTokenForInjunctionId(injunctionId: string): string | null {
  if (!injunctionId.startsWith('o10m_injunction_')) return null;
  return `o10m_unlock_${injunctionId.slice('o10m_injunction_'.length)}`;
}

export function injunctionPhaseForCursor(cursor: number, scenarioCount: number): O10mInjunctionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'injunction';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function injunctionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(145, Math.max(36, Math.floor(run.playerNetWorth / 118) + standingSlice));
}

export function sanitizeInjunctionSession(raw: unknown): O10mInjunctionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const injunctionId =
    typeof o.injunctionId === 'string' && o.injunctionId.startsWith('o10m_injunction_')
      ? o.injunctionId
      : null;
  if (!injunctionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : injunctionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_INJUNCTION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const injunctionScore = Math.min(
    O10M_INJUNCTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.injunctionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mInjunctionPhase)
      ? (phaseRaw as O10mInjunctionPhase)
      : injunctionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    injunctionId,
    label,
    scenarioIds,
    cursor,
    active,
    injunctionScore,
    phaseTag,
  };
}

export function createInjunctionSession(params: {
  injunctionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mInjunctionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.injunctionId.startsWith('o10m_injunction_')) {
    return { session: null, warnings: ['Injunction ids must start with o10m_injunction_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_INJUNCTION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Injunction arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      injunctionId: params.injunctionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      injunctionScore: 0,
      phaseTag: injunctionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachInjunctionSessionToState(
  state: O10mModesPersistedState,
  session: O10mInjunctionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeInjunctionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    injunctionSession: sanitized,
    contemptSession: null,
    sequestrationSession: null,
    liquidationSession: null,
    liquidationDepthSession: null,
    dissolutionSession: null,
    receivershipSession: null,
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

export function clearInjunctionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, injunctionSession: null };
}

export function getInjunctionScenarioAtCursor(
  session: O10mInjunctionSession | null | undefined,
): string | null {
  const injunction = sanitizeInjunctionSession(session);
  if (!injunction || !injunction.active) return null;
  return injunction.scenarioIds[injunction.cursor] ?? null;
}

export function buildInjunctionScenarioStartOverrides(
  session: O10mInjunctionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const injunction = sanitizeInjunctionSession(session);
  if (!injunction) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_INJUNCTION_SCORE_MONEY_CAP,
    Math.floor(injunction.injunctionScore * 0.91),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveInjunctionId: injunction.injunctionId,
      o10mActiveInjunctionStep: injunction.cursor,
      o10mActiveInjunctionPhase: injunction.phaseTag,
      o10mInjunctionScore: injunction.injunctionScore,
    },
  };
}

export function advanceInjunctionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeInjunctionSession(state.injunctionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const injunctionScore = Math.min(
    O10M_INJUNCTION_SCORE_CAP,
    session.injunctionScore + injunctionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      injunctionSession: {
        ...session,
        cursor,
        injunctionScore,
        phaseTag: injunctionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForInjunctionId(session.injunctionId);
  let next: O10mModesPersistedState = {
    ...state,
    injunctionSession: { ...session, active: false, injunctionScore, phaseTag: 'injunction' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function injunctionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  injunctionScore: number;
  phase: O10mInjunctionPhase | null;
} {
  const session = sanitizeInjunctionSession(state.injunctionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    injunctionScore: session?.injunctionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
