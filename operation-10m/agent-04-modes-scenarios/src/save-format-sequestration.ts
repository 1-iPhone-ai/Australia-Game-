import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mSequestrationPhase,
  O10mSequestrationSession,
} from './types.js';

export const O10M_SEQUESTRATION_SCENARIO_CAP = 6;
export const O10M_SEQUESTRATION_SCORE_CAP = 1132;
export const O10M_SEQUESTRATION_SCORE_MONEY_CAP = 1216;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mSequestrationPhase>(['filing', 'review', 'sequestration']);

export function unlockTokenForSequestrationId(sequestrationId: string): string | null {
  if (!sequestrationId.startsWith('o10m_sequestration_')) return null;
  return `o10m_unlock_${sequestrationId.slice('o10m_sequestration_'.length)}`;
}

export function sequestrationPhaseForCursor(cursor: number, scenarioCount: number): O10mSequestrationPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'sequestration';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function sequestrationScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(147, Math.max(36, Math.floor(run.playerNetWorth / 114) + standingSlice));
}

export function sanitizeSequestrationSession(raw: unknown): O10mSequestrationSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const sequestrationId =
    typeof o.sequestrationId === 'string' && o.sequestrationId.startsWith('o10m_sequestration_')
      ? o.sequestrationId
      : null;
  if (!sequestrationId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : sequestrationId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_SEQUESTRATION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const sequestrationScore = Math.min(
    O10M_SEQUESTRATION_SCORE_CAP,
    Math.max(0, Math.floor(num(o.sequestrationScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mSequestrationPhase)
      ? (phaseRaw as O10mSequestrationPhase)
      : sequestrationPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    sequestrationId,
    label,
    scenarioIds,
    cursor,
    active,
    sequestrationScore,
    phaseTag,
  };
}

export function createSequestrationSession(params: {
  sequestrationId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mSequestrationSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.sequestrationId.startsWith('o10m_sequestration_')) {
    return { session: null, warnings: ['Sequestration ids must start with o10m_sequestration_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_SEQUESTRATION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Sequestration arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      sequestrationId: params.sequestrationId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      sequestrationScore: 0,
      phaseTag: sequestrationPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachSequestrationSessionToState(
  state: O10mModesPersistedState,
  session: O10mSequestrationSession,
): O10mModesPersistedState {
  const sanitized = sanitizeSequestrationSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    sequestrationSession: sanitized,
    contemptSession: null,
    injunctionSession: null,
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

export function clearSequestrationSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, sequestrationSession: null };
}

export function getSequestrationScenarioAtCursor(
  session: O10mSequestrationSession | null | undefined,
): string | null {
  const sequestration = sanitizeSequestrationSession(session);
  if (!sequestration || !sequestration.active) return null;
  return sequestration.scenarioIds[sequestration.cursor] ?? null;
}

export function buildSequestrationScenarioStartOverrides(
  session: O10mSequestrationSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const sequestration = sanitizeSequestrationSession(session);
  if (!sequestration) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_SEQUESTRATION_SCORE_MONEY_CAP,
    Math.floor(sequestration.sequestrationScore * 0.93),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveSequestrationId: sequestration.sequestrationId,
      o10mActiveSequestrationStep: sequestration.cursor,
      o10mActiveSequestrationPhase: sequestration.phaseTag,
      o10mSequestrationScore: sequestration.sequestrationScore,
    },
  };
}

export function advanceSequestrationSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeSequestrationSession(state.sequestrationSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const sequestrationScore = Math.min(
    O10M_SEQUESTRATION_SCORE_CAP,
    session.sequestrationScore + sequestrationScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      sequestrationSession: {
        ...session,
        cursor,
        sequestrationScore,
        phaseTag: sequestrationPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForSequestrationId(session.sequestrationId);
  let next: O10mModesPersistedState = {
    ...state,
    sequestrationSession: { ...session, active: false, sequestrationScore, phaseTag: 'sequestration' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function sequestrationSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  sequestrationScore: number;
  phase: O10mSequestrationPhase | null;
} {
  const session = sanitizeSequestrationSession(state.sequestrationSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    sequestrationScore: session?.sequestrationScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
