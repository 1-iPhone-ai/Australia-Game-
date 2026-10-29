import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mTribunalPhase,
  O10mTribunalSession,
} from './types.js';

export const O10M_TRIBUNAL_SCENARIO_CAP = 6;
export const O10M_TRIBUNAL_GRAVITAS_CAP = 740;
export const O10M_TRIBUNAL_GRAVITAS_MONEY_CAP = 820;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mTribunalPhase>(['docket', 'hearing', 'seal']);

export function unlockTokenForTribunalId(tribunalId: string): string | null {
  if (!tribunalId.startsWith('o10m_tribunal_')) return null;
  return `o10m_unlock_${tribunalId.slice('o10m_tribunal_'.length)}`;
}

export function tribunalPhaseForCursor(cursor: number, scenarioCount: number): O10mTribunalPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'seal';
  if (clamped >= Math.floor(total / 2)) return 'hearing';
  return 'docket';
}

export function tribunalGravitasFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(102, Math.max(14, Math.floor(run.playerNetWorth / 182) + standingSlice));
}

export function sanitizeTribunalSession(raw: unknown): O10mTribunalSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const tribunalId =
    typeof o.tribunalId === 'string' && o.tribunalId.startsWith('o10m_tribunal_') ? o.tribunalId : null;
  if (!tribunalId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : tribunalId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_TRIBUNAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const gravitasScore = Math.min(
    O10M_TRIBUNAL_GRAVITAS_CAP,
    Math.max(0, Math.floor(num(o.gravitasScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mTribunalPhase)
      ? (phaseRaw as O10mTribunalPhase)
      : tribunalPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    tribunalId,
    label,
    scenarioIds,
    cursor,
    active,
    gravitasScore,
    phaseTag,
  };
}

export function createTribunalSession(params: {
  tribunalId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mTribunalSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.tribunalId.startsWith('o10m_tribunal_')) {
    return { session: null, warnings: ['Tribunal ids must start with o10m_tribunal_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_TRIBUNAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Tribunal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      tribunalId: params.tribunalId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      gravitasScore: 0,
      phaseTag: tribunalPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachTribunalSessionToState(
  state: O10mModesPersistedState,
  session: O10mTribunalSession,
): O10mModesPersistedState {
  const sanitized = sanitizeTribunalSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    tribunalSession: sanitized,
    indictmentSession: null,
    appealSession: null,
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

export function clearTribunalSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, tribunalSession: null };
}

export function getTribunalScenarioAtCursor(
  session: O10mTribunalSession | null | undefined,
): string | null {
  const tribunal = sanitizeTribunalSession(session);
  if (!tribunal || !tribunal.active) return null;
  return tribunal.scenarioIds[tribunal.cursor] ?? null;
}

export function buildTribunalScenarioStartOverrides(
  session: O10mTribunalSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const tribunal = sanitizeTribunalSession(session);
  if (!tribunal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_TRIBUNAL_GRAVITAS_MONEY_CAP,
    Math.floor(tribunal.gravitasScore * 0.83),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveTribunalId: tribunal.tribunalId,
      o10mActiveTribunalStep: tribunal.cursor,
      o10mActiveTribunalPhase: tribunal.phaseTag,
      o10mTribunalGravitas: tribunal.gravitasScore,
    },
  };
}

export function advanceTribunalSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeTribunalSession(state.tribunalSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const gravitasScore = Math.min(
    O10M_TRIBUNAL_GRAVITAS_CAP,
    session.gravitasScore + tribunalGravitasFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      tribunalSession: {
        ...session,
        cursor,
        gravitasScore,
        phaseTag: tribunalPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForTribunalId(session.tribunalId);
  let next: O10mModesPersistedState = {
    ...state,
    tribunalSession: { ...session, active: false, gravitasScore, phaseTag: 'seal' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function tribunalSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  gravitas: number;
  phase: O10mTribunalPhase | null;
} {
  const session = sanitizeTribunalSession(state.tribunalSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    gravitas: session?.gravitasScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
