import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mExonerationPhase,
  O10mExonerationSession,
} from './types.js';

export const O10M_EXONERATION_SCENARIO_CAP = 6;
export const O10M_EXONERATION_RESTITUTION_SCORE_CAP = 960;
export const O10M_EXONERATION_RESTITUTION_SCORE_MONEY_CAP = 1040;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mExonerationPhase>(['claim', 'review', 'exoneration']);

export function unlockTokenForExonerationId(exonerationId: string): string | null {
  if (!exonerationId.startsWith('o10m_exoneration_')) return null;
  return `o10m_unlock_${exonerationId.slice('o10m_exoneration_'.length)}`;
}

export function exonerationPhaseForCursor(cursor: number, scenarioCount: number): O10mExonerationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'exoneration';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'claim';
}

export function exonerationRestitutionScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(124, Math.max(25, Math.floor(run.playerNetWorth / 150) + standingSlice));
}

export function sanitizeExonerationSession(raw: unknown): O10mExonerationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const exonerationId =
    typeof o.exonerationId === 'string' && o.exonerationId.startsWith('o10m_exoneration_') ? o.exonerationId : null;
  if (!exonerationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : exonerationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXONERATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const restitutionScore = Math.min(
    O10M_EXONERATION_RESTITUTION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.restitutionScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mExonerationPhase)
      ? (phaseRaw as O10mExonerationPhase)
      : exonerationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    exonerationId,
    label,
    scenarioIds,
    cursor,
    active,
    restitutionScore,
    phaseTag,
  };
}

export function createExonerationSession(params: {
  exonerationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExonerationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.exonerationId.startsWith('o10m_exoneration_')) {
    return { session: null, warnings: ['Exoneration ids must start with o10m_exoneration_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_EXONERATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Exoneration arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      exonerationId: params.exonerationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      restitutionScore: 0,
      phaseTag: exonerationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExonerationSessionToState(
  state: O10mModesPersistedState,
  session: O10mExonerationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExonerationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    exonerationSession: sanitized,
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

export function clearExonerationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, exonerationSession: null };
}

export function getExonerationScenarioAtCursor(
  session: O10mExonerationSession | null | undefined,
): string | null {
  const exoneration = sanitizeExonerationSession(session);
  if (!exoneration || !exoneration.active) return null;
  return exoneration.scenarioIds[exoneration.cursor] ?? null;
}

export function buildExonerationScenarioStartOverrides(
  session: O10mExonerationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const exoneration = sanitizeExonerationSession(session);
  if (!exoneration) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXONERATION_RESTITUTION_SCORE_MONEY_CAP,
    Math.floor(exoneration.restitutionScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExonerationId: exoneration.exonerationId,
      o10mActiveExonerationStep: exoneration.cursor,
      o10mActiveExonerationPhase: exoneration.phaseTag,
      o10mExonerationRestitutionScore: exoneration.restitutionScore,
    },
  };
}

export function advanceExonerationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExonerationSession(state.exonerationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const restitutionScore = Math.min(
    O10M_EXONERATION_RESTITUTION_SCORE_CAP,
    session.restitutionScore + exonerationRestitutionScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      exonerationSession: {
        ...session,
        cursor,
        restitutionScore,
        phaseTag: exonerationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExonerationId(session.exonerationId);
  let next: O10mModesPersistedState = {
    ...state,
    exonerationSession: { ...session, active: false, restitutionScore, phaseTag: 'exoneration' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function exonerationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  restitutionScore: number;
  phase: O10mExonerationPhase | null;
} {
  const session = sanitizeExonerationSession(state.exonerationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    restitutionScore: session?.restitutionScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
