import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mRemandPhase,
  O10mRemandSession,
} from './types.js';

export const O10M_REMAND_SCENARIO_CAP = 6;
export const O10M_REMAND_WEIGHT_SCORE_CAP = 1000;
export const O10M_REMAND_WEIGHT_SCORE_MONEY_CAP = 1080;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mRemandPhase>(['order', 'review', 'remand']);

export function unlockTokenForRemandId(remandId: string): string | null {
  if (!remandId.startsWith('o10m_remand_')) return null;
  return `o10m_unlock_${remandId.slice('o10m_remand_'.length)}`;
}

export function remandPhaseForCursor(cursor: number, scenarioCount: number): O10mRemandPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'remand';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'order';
}

export function remandWeightScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(130, Math.max(28, Math.floor(run.playerNetWorth / 142) + standingSlice));
}

export function sanitizeRemandSession(raw: unknown): O10mRemandSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const remandId =
    typeof o.remandId === 'string' && o.remandId.startsWith('o10m_remand_') ? o.remandId : null;
  if (!remandId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : remandId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_REMAND_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const weightScore = Math.min(
    O10M_REMAND_WEIGHT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.weightScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mRemandPhase)
      ? (phaseRaw as O10mRemandPhase)
      : remandPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    remandId,
    label,
    scenarioIds,
    cursor,
    active,
    weightScore,
    phaseTag,
  };
}

export function createRemandSession(params: {
  remandId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mRemandSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.remandId.startsWith('o10m_remand_')) {
    return { session: null, warnings: ['Remand ids must start with o10m_remand_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_REMAND_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Remand arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      remandId: params.remandId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      weightScore: 0,
      phaseTag: remandPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachRemandSessionToState(
  state: O10mModesPersistedState,
  session: O10mRemandSession,
): O10mModesPersistedState {
  const sanitized = sanitizeRemandSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    remandSession: sanitized,
    reversalSession: null,
    annulmentSession: null,
    reinstatementSession: null,
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

export function clearRemandSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, remandSession: null };
}

export function getRemandScenarioAtCursor(
  session: O10mRemandSession | null | undefined,
): string | null {
  const remand = sanitizeRemandSession(session);
  if (!remand || !remand.active) return null;
  return remand.scenarioIds[remand.cursor] ?? null;
}

export function buildRemandScenarioStartOverrides(
  session: O10mRemandSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const remand = sanitizeRemandSession(session);
  if (!remand) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_REMAND_WEIGHT_SCORE_MONEY_CAP,
    Math.floor(remand.weightScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveRemandId: remand.remandId,
      o10mActiveRemandStep: remand.cursor,
      o10mActiveRemandPhase: remand.phaseTag,
      o10mRemandWeightScore: remand.weightScore,
    },
  };
}

export function advanceRemandSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeRemandSession(state.remandSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const weightScore = Math.min(
    O10M_REMAND_WEIGHT_SCORE_CAP,
    session.weightScore + remandWeightScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      remandSession: {
        ...session,
        cursor,
        weightScore,
        phaseTag: remandPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForRemandId(session.remandId);
  let next: O10mModesPersistedState = {
    ...state,
    remandSession: { ...session, active: false, weightScore, phaseTag: 'remand' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function remandSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  weightScore: number;
  phase: O10mRemandPhase | null;
} {
  const session = sanitizeRemandSession(state.remandSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    weightScore: session?.weightScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
