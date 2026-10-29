import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mSubjectPhase,
  O10mSubjectSession,
} from './types.js';

export const O10M_SUBJECT_SCENARIO_CAP = 6;
export const O10M_SUBJECT_FIDELITY_CAP = 700;
export const O10M_SUBJECT_FIDELITY_MONEY_CAP = 780;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSubjectPhase>(['intake', 'probe', 'verdict']);

export function unlockTokenForSubjectId(subjectId: string): string | null {
  if (!subjectId.startsWith('o10m_subject_')) return null;
  return `o10m_unlock_${subjectId.slice('o10m_subject_'.length)}`;
}

export function subjectPhaseForCursor(cursor: number, scenarioCount: number): O10mSubjectPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'verdict';
  if (clamped >= Math.floor(total / 2)) return 'probe';
  return 'intake';
}

export function subjectFidelityFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(98, Math.max(12, Math.floor(run.playerNetWorth / 188) + standingSlice));
}

export function sanitizeSubjectSession(raw: unknown): O10mSubjectSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const subjectId =
    typeof o.subjectId === 'string' && o.subjectId.startsWith('o10m_subject_') ? o.subjectId : null;
  if (!subjectId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : subjectId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SUBJECT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const fidelityScore = Math.min(
    O10M_SUBJECT_FIDELITY_CAP,
    Math.max(0, Math.floor(num(o.fidelityScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSubjectPhase)
      ? (phaseRaw as O10mSubjectPhase)
      : subjectPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    subjectId,
    label,
    scenarioIds,
    cursor,
    active,
    fidelityScore,
    phaseTag,
  };
}

export function createSubjectSession(params: {
  subjectId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSubjectSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.subjectId.startsWith('o10m_subject_')) {
    return { session: null, warnings: ['Subject ids must start with o10m_subject_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_SUBJECT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Subject arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      subjectId: params.subjectId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      fidelityScore: 0,
      phaseTag: subjectPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSubjectSessionToState(
  state: O10mModesPersistedState,
  session: O10mSubjectSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSubjectSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    subjectSession: sanitized,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
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

export function clearSubjectSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, subjectSession: null };
}

export function getSubjectScenarioAtCursor(
  session: O10mSubjectSession | null | undefined,
): string | null {
  const subject = sanitizeSubjectSession(session);
  if (!subject || !subject.active) return null;
  return subject.scenarioIds[subject.cursor] ?? null;
}

export function buildSubjectScenarioStartOverrides(
  session: O10mSubjectSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const subject = sanitizeSubjectSession(session);
  if (!subject) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SUBJECT_FIDELITY_MONEY_CAP,
    Math.floor(subject.fidelityScore * 0.79),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSubjectId: subject.subjectId,
      o10mActiveSubjectStep: subject.cursor,
      o10mActiveSubjectPhase: subject.phaseTag,
      o10mSubjectFidelity: subject.fidelityScore,
    },
  };
}

export function advanceSubjectSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSubjectSession(state.subjectSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const fidelityScore = Math.min(
    O10M_SUBJECT_FIDELITY_CAP,
    session.fidelityScore + subjectFidelityFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      subjectSession: {
        ...session,
        cursor,
        fidelityScore,
        phaseTag: subjectPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSubjectId(session.subjectId);
  let next: O10mModesPersistedState = {
    ...state,
    subjectSession: { ...session, active: false, fidelityScore, phaseTag: 'verdict' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function subjectSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  fidelity: number;
  phase: O10mSubjectPhase | null;
} {
  const session = sanitizeSubjectSession(state.subjectSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    fidelity: session?.fidelityScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
