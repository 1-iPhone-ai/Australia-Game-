import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mProbationPhase,
  O10mProbationSession,
} from './types.js';

export const O10M_PROBATION_SCENARIO_CAP = 6;
export const O10M_PROBATION_COMPLIANCE_SCORE_CAP = 900;
export const O10M_PROBATION_COMPLIANCE_SCORE_MONEY_CAP = 980;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mProbationPhase>(['enrollment', 'review', 'probation']);

export function unlockTokenForProbationId(probationId: string): string | null {
  if (!probationId.startsWith('o10m_probation_')) return null;
  return `o10m_unlock_${probationId.slice('o10m_probation_'.length)}`;
}

export function probationPhaseForCursor(cursor: number, scenarioCount: number): O10mProbationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'probation';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'enrollment';
}

export function probationComplianceScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(118, Math.max(22, Math.floor(run.playerNetWorth / 162) + standingSlice));
}

export function sanitizeProbationSession(raw: unknown): O10mProbationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const probationId =
    typeof o.probationId === 'string' && o.probationId.startsWith('o10m_probation_') ? o.probationId : null;
  if (!probationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : probationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PROBATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const complianceScore = Math.min(
    O10M_PROBATION_COMPLIANCE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.complianceScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mProbationPhase)
      ? (phaseRaw as O10mProbationPhase)
      : probationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    probationId,
    label,
    scenarioIds,
    cursor,
    active,
    complianceScore,
    phaseTag,
  };
}

export function createProbationSession(params: {
  probationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mProbationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.probationId.startsWith('o10m_probation_')) {
    return { session: null, warnings: ['Probation ids must start with o10m_probation_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_PROBATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Probation arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      probationId: params.probationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      complianceScore: 0,
      phaseTag: probationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachProbationSessionToState(
  state: O10mModesPersistedState,
  session: O10mProbationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeProbationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    probationSession: sanitized,
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

export function clearProbationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, probationSession: null };
}

export function getProbationScenarioAtCursor(
  session: O10mProbationSession | null | undefined,
): string | null {
  const probation = sanitizeProbationSession(session);
  if (!probation || !probation.active) return null;
  return probation.scenarioIds[probation.cursor] ?? null;
}

export function buildProbationScenarioStartOverrides(
  session: O10mProbationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const probation = sanitizeProbationSession(session);
  if (!probation) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PROBATION_COMPLIANCE_SCORE_MONEY_CAP,
    Math.floor(probation.complianceScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveProbationId: probation.probationId,
      o10mActiveProbationStep: probation.cursor,
      o10mActiveProbationPhase: probation.phaseTag,
      o10mProbationComplianceScore: probation.complianceScore,
    },
  };
}

export function advanceProbationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeProbationSession(state.probationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const complianceScore = Math.min(
    O10M_PROBATION_COMPLIANCE_SCORE_CAP,
    session.complianceScore + probationComplianceScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      probationSession: {
        ...session,
        cursor,
        complianceScore,
        phaseTag: probationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForProbationId(session.probationId);
  let next: O10mModesPersistedState = {
    ...state,
    probationSession: { ...session, active: false, complianceScore, phaseTag: 'probation' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function probationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  complianceScore: number;
  phase: O10mProbationPhase | null;
} {
  const session = sanitizeProbationSession(state.probationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    complianceScore: session?.complianceScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
