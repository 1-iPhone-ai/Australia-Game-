import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mMandamusPhase,
  O10mMandamusSession,
} from './types.js';

export const O10M_MANDAMUS_SCENARIO_CAP = 6;
export const O10M_MANDAMUS_SCORE_CAP = 1080;
export const O10M_MANDAMUS_SCORE_MONEY_CAP = 1160;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mMandamusPhase>(['filing', 'review', 'mandamus']);

export function unlockTokenForMandamusId(mandamusId: string): string | null {
  if (!mandamusId.startsWith('o10m_mandamus_')) return null;
  return `o10m_unlock_${mandamusId.slice('o10m_mandamus_'.length)}`;
}

export function mandamusPhaseForCursor(cursor: number, scenarioCount: number): O10mMandamusPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'mandamus';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function mandamusScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(141, Math.max(36, Math.floor(run.playerNetWorth / 126) + standingSlice));
}

export function sanitizeMandamusSession(raw: unknown): O10mMandamusSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const mandamusId =
    typeof o.mandamusId === 'string' && o.mandamusId.startsWith('o10m_mandamus_')
      ? o.mandamusId
      : null;
  if (!mandamusId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : mandamusId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_MANDAMUS_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const mandamusScore = Math.min(
    O10M_MANDAMUS_SCORE_CAP,
    Math.max(0, Math.floor(num(o.mandamusScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mMandamusPhase)
      ? (phaseRaw as O10mMandamusPhase)
      : mandamusPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    mandamusId,
    label,
    scenarioIds,
    cursor,
    active,
    mandamusScore,
    phaseTag,
  };
}

export function createMandamusSession(params: {
  mandamusId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mMandamusSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.mandamusId.startsWith('o10m_mandamus_')) {
    return { session: null, warnings: ['Mandamus ids must start with o10m_mandamus_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_MANDAMUS_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Mandamus arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      mandamusId: params.mandamusId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      mandamusScore: 0,
      phaseTag: mandamusPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachMandamusSessionToState(
  state: O10mModesPersistedState,
  session: O10mMandamusSession,
): O10mModesPersistedState {
  const sanitized = sanitizeMandamusSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    mandamusSession: sanitized,
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

export function clearMandamusSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, mandamusSession: null };
}

export function getMandamusScenarioAtCursor(
  session: O10mMandamusSession | null | undefined,
): string | null {
  const mandamus = sanitizeMandamusSession(session);
  if (!mandamus || !mandamus.active) return null;
  return mandamus.scenarioIds[mandamus.cursor] ?? null;
}

export function buildMandamusScenarioStartOverrides(
  session: O10mMandamusSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const mandamus = sanitizeMandamusSession(session);
  if (!mandamus) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_MANDAMUS_SCORE_MONEY_CAP,
    Math.floor(mandamus.mandamusScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveMandamusId: mandamus.mandamusId,
      o10mActiveMandamusStep: mandamus.cursor,
      o10mActiveMandamusPhase: mandamus.phaseTag,
      o10mMandamusScore: mandamus.mandamusScore,
    },
  };
}

export function advanceMandamusSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeMandamusSession(state.mandamusSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const mandamusScore = Math.min(
    O10M_MANDAMUS_SCORE_CAP,
    session.mandamusScore + mandamusScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      mandamusSession: {
        ...session,
        cursor,
        mandamusScore,
        phaseTag: mandamusPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForMandamusId(session.mandamusId);
  let next: O10mModesPersistedState = {
    ...state,
    mandamusSession: { ...session, active: false, mandamusScore, phaseTag: 'mandamus' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function mandamusSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  mandamusScore: number;
  phase: O10mMandamusPhase | null;
} {
  const session = sanitizeMandamusSession(state.mandamusSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    mandamusScore: session?.mandamusScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
