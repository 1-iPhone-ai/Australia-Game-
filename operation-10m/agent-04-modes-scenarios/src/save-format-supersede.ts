import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mSupersedePhase,
  O10mSupersedeSession,
} from './types.js';

export const O10M_SUPERSEDE_SCENARIO_CAP = 6;
export const O10M_SUPERSEDE_SCORE_CAP = 1060;
export const O10M_SUPERSEDE_SCORE_MONEY_CAP = 1140;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSupersedePhase>(['filing', 'review', 'supersede']);

export function unlockTokenForSupersedeId(supersedeId: string): string | null {
  if (!supersedeId.startsWith('o10m_supersede_')) return null;
  return `o10m_unlock_${supersedeId.slice('o10m_supersede_'.length)}`;
}

export function supersedePhaseForCursor(cursor: number, scenarioCount: number): O10mSupersedePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'supersede';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function supersedeScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(139, Math.max(34, Math.floor(run.playerNetWorth / 130) + standingSlice));
}

export function sanitizeSupersedeSession(raw: unknown): O10mSupersedeSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const supersedeId =
    typeof o.supersedeId === 'string' && o.supersedeId.startsWith('o10m_supersede_')
      ? o.supersedeId
      : null;
  if (!supersedeId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : supersedeId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SUPERSEDE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const supersedeScore = Math.min(
    O10M_SUPERSEDE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.supersedeScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSupersedePhase)
      ? (phaseRaw as O10mSupersedePhase)
      : supersedePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    supersedeId,
    label,
    scenarioIds,
    cursor,
    active,
    supersedeScore,
    phaseTag,
  };
}

export function createSupersedeSession(params: {
  supersedeId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSupersedeSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.supersedeId.startsWith('o10m_supersede_')) {
    return { session: null, warnings: ['Supersede ids must start with o10m_supersede_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_SUPERSEDE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Supersede arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      supersedeId: params.supersedeId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      supersedeScore: 0,
      phaseTag: supersedePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSupersedeSessionToState(
  state: O10mModesPersistedState,
  session: O10mSupersedeSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSupersedeSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    supersedeSession: sanitized,
    certiorariSession: null,
    mandamusSession: null,
    prohibitionSession: null,
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    contemptSession: null,
    sequestrationSession: null,
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

export function clearSupersedeSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, supersedeSession: null };
}

export function getSupersedeScenarioAtCursor(
  session: O10mSupersedeSession | null | undefined,
): string | null {
  const supersede = sanitizeSupersedeSession(session);
  if (!supersede || !supersede.active) return null;
  return supersede.scenarioIds[supersede.cursor] ?? null;
}

export function buildSupersedeScenarioStartOverrides(
  session: O10mSupersedeSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const supersede = sanitizeSupersedeSession(session);
  if (!supersede) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SUPERSEDE_SCORE_MONEY_CAP,
    Math.floor(supersede.supersedeScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSupersedeId: supersede.supersedeId,
      o10mActiveSupersedeStep: supersede.cursor,
      o10mActiveSupersedePhase: supersede.phaseTag,
      o10mSupersedeScore: supersede.supersedeScore,
    },
  };
}

export function advanceSupersedeSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSupersedeSession(state.supersedeSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const supersedeScore = Math.min(
    O10M_SUPERSEDE_SCORE_CAP,
    session.supersedeScore + supersedeScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      supersedeSession: {
        ...session,
        cursor,
        supersedeScore,
        phaseTag: supersedePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSupersedeId(session.supersedeId);
  let next: O10mModesPersistedState = {
    ...state,
    supersedeSession: { ...session, active: false, supersedeScore, phaseTag: 'supersede' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function supersedeSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  supersedeScore: number;
  phase: O10mSupersedePhase | null;
} {
  const session = sanitizeSupersedeSession(state.supersedeSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    supersedeScore: session?.supersedeScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
