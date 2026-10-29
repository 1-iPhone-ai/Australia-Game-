import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mClemencyPhase,
  O10mClemencySession,
} from './types.js';

export const O10M_CLEMENCY_SCENARIO_CAP = 6;
export const O10M_CLEMENCY_MERCY_SCORE_CAP = 800;
export const O10M_CLEMENCY_MERCY_SCORE_MONEY_CAP = 880;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mClemencyPhase>(['plea', 'review', 'clemency']);

export function unlockTokenForClemencyId(clemencyId: string): string | null {
  if (!clemencyId.startsWith('o10m_clemency_')) return null;
  return `o10m_unlock_${clemencyId.slice('o10m_clemency_'.length)}`;
}

export function clemencyPhaseForCursor(cursor: number, scenarioCount: number): O10mClemencyPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'clemency';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'plea';
}

export function clemencyMercyScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(108, Math.max(17, Math.floor(run.playerNetWorth / 174) + standingSlice));
}

export function sanitizeClemencySession(raw: unknown): O10mClemencySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const clemencyId =
    typeof o.clemencyId === 'string' && o.clemencyId.startsWith('o10m_clemency_') ? o.clemencyId : null;
  if (!clemencyId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : clemencyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CLEMENCY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const mercyScore = Math.min(
    O10M_CLEMENCY_MERCY_SCORE_CAP,
    Math.max(0, Math.floor(num(o.mercyScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mClemencyPhase)
      ? (phaseRaw as O10mClemencyPhase)
      : clemencyPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    clemencyId,
    label,
    scenarioIds,
    cursor,
    active,
    mercyScore,
    phaseTag,
  };
}

export function createClemencySession(params: {
  clemencyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mClemencySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.clemencyId.startsWith('o10m_clemency_')) {
    return { session: null, warnings: ['Clemency ids must start with o10m_clemency_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_CLEMENCY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Clemency arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      clemencyId: params.clemencyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      mercyScore: 0,
      phaseTag: clemencyPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachClemencySessionToState(
  state: O10mModesPersistedState,
  session: O10mClemencySession,
): O10mModesPersistedState {
  const sanitized = sanitizeClemencySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    clemencySession: sanitized,
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

export function clearClemencySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, clemencySession: null };
}

export function getClemencyScenarioAtCursor(
  session: O10mClemencySession | null | undefined,
): string | null {
  const clemency = sanitizeClemencySession(session);
  if (!clemency || !clemency.active) return null;
  return clemency.scenarioIds[clemency.cursor] ?? null;
}

export function buildClemencyScenarioStartOverrides(
  session: O10mClemencySession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const clemency = sanitizeClemencySession(session);
  if (!clemency) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CLEMENCY_MERCY_SCORE_MONEY_CAP,
    Math.floor(clemency.mercyScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveClemencyId: clemency.clemencyId,
      o10mActiveClemencyStep: clemency.cursor,
      o10mActiveClemencyPhase: clemency.phaseTag,
      o10mClemencyMercyScore: clemency.mercyScore,
    },
  };
}

export function advanceClemencySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeClemencySession(state.clemencySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const mercyScore = Math.min(
    O10M_CLEMENCY_MERCY_SCORE_CAP,
    session.mercyScore + clemencyMercyScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      clemencySession: {
        ...session,
        cursor,
        mercyScore,
        phaseTag: clemencyPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForClemencyId(session.clemencyId);
  let next: O10mModesPersistedState = {
    ...state,
    clemencySession: { ...session, active: false, mercyScore, phaseTag: 'clemency' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function clemencySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  mercyScore: number;
  phase: O10mClemencyPhase | null;
} {
  const session = sanitizeClemencySession(state.clemencySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    mercyScore: session?.mercyScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
