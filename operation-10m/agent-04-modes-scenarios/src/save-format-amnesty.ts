import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mAmnestyPhase,
  O10mAmnestySession,
} from './types.js';

export const O10M_AMNESTY_SCENARIO_CAP = 6;
export const O10M_AMNESTY_ABSOLUTION_SCORE_CAP = 840;
export const O10M_AMNESTY_ABSOLUTION_SCORE_MONEY_CAP = 920;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAmnestyPhase>(['warrant', 'review', 'amnesty']);

export function unlockTokenForAmnestyId(amnestyId: string): string | null {
  if (!amnestyId.startsWith('o10m_amnesty_')) return null;
  return `o10m_unlock_${amnestyId.slice('o10m_amnesty_'.length)}`;
}

export function amnestyPhaseForCursor(cursor: number, scenarioCount: number): O10mAmnestyPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'amnesty';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'warrant';
}

export function amnestyAbsolutionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(112, Math.max(19, Math.floor(run.playerNetWorth / 170) + standingSlice));
}

export function sanitizeAmnestySession(raw: unknown): O10mAmnestySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const amnestyId =
    typeof o.amnestyId === 'string' && o.amnestyId.startsWith('o10m_amnesty_') ? o.amnestyId : null;
  if (!amnestyId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : amnestyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_AMNESTY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const absolutionScore = Math.min(
    O10M_AMNESTY_ABSOLUTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.absolutionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAmnestyPhase)
      ? (phaseRaw as O10mAmnestyPhase)
      : amnestyPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    amnestyId,
    label,
    scenarioIds,
    cursor,
    active,
    absolutionScore,
    phaseTag,
  };
}

export function createAmnestySession(params: {
  amnestyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAmnestySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.amnestyId.startsWith('o10m_amnesty_')) {
    return { session: null, warnings: ['Amnesty ids must start with o10m_amnesty_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_AMNESTY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Amnesty arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      amnestyId: params.amnestyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      absolutionScore: 0,
      phaseTag: amnestyPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAmnestySessionToState(
  state: O10mModesPersistedState,
  session: O10mAmnestySession,
): O10mModesPersistedState {
  const sanitized = sanitizeAmnestySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    amnestySession: sanitized,
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
    dissolutionSession: null,
    receivershipSession: null,
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

export function clearAmnestySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, amnestySession: null };
}

export function getAmnestyScenarioAtCursor(
  session: O10mAmnestySession | null | undefined,
): string | null {
  const amnesty = sanitizeAmnestySession(session);
  if (!amnesty || !amnesty.active) return null;
  return amnesty.scenarioIds[amnesty.cursor] ?? null;
}

export function buildAmnestyScenarioStartOverrides(
  session: O10mAmnestySession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const amnesty = sanitizeAmnestySession(session);
  if (!amnesty) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_AMNESTY_ABSOLUTION_SCORE_MONEY_CAP,
    Math.floor(amnesty.absolutionScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAmnestyId: amnesty.amnestyId,
      o10mActiveAmnestyStep: amnesty.cursor,
      o10mActiveAmnestyPhase: amnesty.phaseTag,
      o10mAmnestyAbsolutionScore: amnesty.absolutionScore,
    },
  };
}

export function advanceAmnestySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAmnestySession(state.amnestySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const absolutionScore = Math.min(
    O10M_AMNESTY_ABSOLUTION_SCORE_CAP,
    session.absolutionScore + amnestyAbsolutionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      amnestySession: {
        ...session,
        cursor,
        absolutionScore,
        phaseTag: amnestyPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAmnestyId(session.amnestyId);
  let next: O10mModesPersistedState = {
    ...state,
    amnestySession: { ...session, active: false, absolutionScore, phaseTag: 'amnesty' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function amnestySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  absolutionScore: number;
  phase: O10mAmnestyPhase | null;
} {
  const session = sanitizeAmnestySession(state.amnestySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    absolutionScore: session?.absolutionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
