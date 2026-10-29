import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mIndictmentPhase,
  O10mIndictmentSession,
} from './types.js';

export const O10M_INDICTMENT_SCENARIO_CAP = 6;
export const O10M_INDICTMENT_CASE_WEIGHT_CAP = 760;
export const O10M_INDICTMENT_CASE_WEIGHT_MONEY_CAP = 840;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mIndictmentPhase>(['charge', 'arraign', 'bind']);

export function unlockTokenForIndictmentId(indictmentId: string): string | null {
  if (!indictmentId.startsWith('o10m_indictment_')) return null;
  return `o10m_unlock_${indictmentId.slice('o10m_indictment_'.length)}`;
}

export function indictmentPhaseForCursor(cursor: number, scenarioCount: number): O10mIndictmentPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'bind';
  if (clamped >= Math.floor(total / 2)) return 'arraign';
  return 'charge';
}

export function indictmentCaseWeightFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(104, Math.max(15, Math.floor(run.playerNetWorth / 179) + standingSlice));
}

export function sanitizeIndictmentSession(raw: unknown): O10mIndictmentSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const indictmentId =
    typeof o.indictmentId === 'string' && o.indictmentId.startsWith('o10m_indictment_') ? o.indictmentId : null;
  if (!indictmentId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : indictmentId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_INDICTMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const caseWeightScore = Math.min(
    O10M_INDICTMENT_CASE_WEIGHT_CAP,
    Math.max(0, Math.floor(num(o.caseWeightScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mIndictmentPhase)
      ? (phaseRaw as O10mIndictmentPhase)
      : indictmentPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    indictmentId,
    label,
    scenarioIds,
    cursor,
    active,
    caseWeightScore,
    phaseTag,
  };
}

export function createIndictmentSession(params: {
  indictmentId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mIndictmentSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.indictmentId.startsWith('o10m_indictment_')) {
    return { session: null, warnings: ['Indictment ids must start with o10m_indictment_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_INDICTMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Indictment arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      indictmentId: params.indictmentId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      caseWeightScore: 0,
      phaseTag: indictmentPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachIndictmentSessionToState(
  state: O10mModesPersistedState,
  session: O10mIndictmentSession,
): O10mModesPersistedState {
  const sanitized = sanitizeIndictmentSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    indictmentSession: sanitized,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
    amnestySession: null,
    reprieveSession: null,
    paroleSession: null,
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

export function clearIndictmentSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, indictmentSession: null };
}

export function getIndictmentScenarioAtCursor(
  session: O10mIndictmentSession | null | undefined,
): string | null {
  const indictment = sanitizeIndictmentSession(session);
  if (!indictment || !indictment.active) return null;
  return indictment.scenarioIds[indictment.cursor] ?? null;
}

export function buildIndictmentScenarioStartOverrides(
  session: O10mIndictmentSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const indictment = sanitizeIndictmentSession(session);
  if (!indictment) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_INDICTMENT_CASE_WEIGHT_MONEY_CAP,
    Math.floor(indictment.caseWeightScore * 0.85),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveIndictmentId: indictment.indictmentId,
      o10mActiveIndictmentStep: indictment.cursor,
      o10mActiveIndictmentPhase: indictment.phaseTag,
      o10mIndictmentCaseWeight: indictment.caseWeightScore,
    },
  };
}

export function advanceIndictmentSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeIndictmentSession(state.indictmentSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const caseWeightScore = Math.min(
    O10M_INDICTMENT_CASE_WEIGHT_CAP,
    session.caseWeightScore + indictmentCaseWeightFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      indictmentSession: {
        ...session,
        cursor,
        caseWeightScore,
        phaseTag: indictmentPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForIndictmentId(session.indictmentId);
  let next: O10mModesPersistedState = {
    ...state,
    indictmentSession: { ...session, active: false, caseWeightScore, phaseTag: 'bind' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function indictmentSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  caseWeight: number;
  phase: O10mIndictmentPhase | null;
} {
  const session = sanitizeIndictmentSession(state.indictmentSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    caseWeight: session?.caseWeightScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
