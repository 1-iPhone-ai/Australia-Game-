import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mPardonPhase,
  O10mPardonSession,
} from './types.js';

export const O10M_PARDON_SCENARIO_CAP = 6;
export const O10M_PARDON_GRACE_SCORE_CAP = 820;
export const O10M_PARDON_GRACE_SCORE_MONEY_CAP = 900;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mPardonPhase>(['brief', 'review', 'pardon']);

export function unlockTokenForPardonId(pardonId: string): string | null {
  if (!pardonId.startsWith('o10m_pardon_')) return null;
  return `o10m_unlock_${pardonId.slice('o10m_pardon_'.length)}`;
}

export function pardonPhaseForCursor(cursor: number, scenarioCount: number): O10mPardonPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'pardon';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'brief';
}

export function pardonGraceScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(110, Math.max(18, Math.floor(run.playerNetWorth / 172) + standingSlice));
}

export function sanitizePardonSession(raw: unknown): O10mPardonSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pardonId =
    typeof o.pardonId === 'string' && o.pardonId.startsWith('o10m_pardon_') ? o.pardonId : null;
  if (!pardonId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : pardonId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PARDON_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const graceScore = Math.min(
    O10M_PARDON_GRACE_SCORE_CAP,
    Math.max(0, Math.floor(num(o.graceScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mPardonPhase)
      ? (phaseRaw as O10mPardonPhase)
      : pardonPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    pardonId,
    label,
    scenarioIds,
    cursor,
    active,
    graceScore,
    phaseTag,
  };
}

export function createPardonSession(params: {
  pardonId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mPardonSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.pardonId.startsWith('o10m_pardon_')) {
    return { session: null, warnings: ['Pardon ids must start with o10m_pardon_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_PARDON_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Pardon arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      pardonId: params.pardonId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      graceScore: 0,
      phaseTag: pardonPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachPardonSessionToState(
  state: O10mModesPersistedState,
  session: O10mPardonSession,
): O10mModesPersistedState {
  const sanitized = sanitizePardonSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    pardonSession: sanitized,
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
    injunctionSession: null,
    contemptSession: null,
    sequestrationSession: null,
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

export function clearPardonSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, pardonSession: null };
}

export function getPardonScenarioAtCursor(
  session: O10mPardonSession | null | undefined,
): string | null {
  const pardon = sanitizePardonSession(session);
  if (!pardon || !pardon.active) return null;
  return pardon.scenarioIds[pardon.cursor] ?? null;
}

export function buildPardonScenarioStartOverrides(
  session: O10mPardonSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const pardon = sanitizePardonSession(session);
  if (!pardon) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PARDON_GRACE_SCORE_MONEY_CAP,
    Math.floor(pardon.graceScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActivePardonId: pardon.pardonId,
      o10mActivePardonStep: pardon.cursor,
      o10mActivePardonPhase: pardon.phaseTag,
      o10mPardonGraceScore: pardon.graceScore,
    },
  };
}

export function advancePardonSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizePardonSession(state.pardonSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const graceScore = Math.min(
    O10M_PARDON_GRACE_SCORE_CAP,
    session.graceScore + pardonGraceScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      pardonSession: {
        ...session,
        cursor,
        graceScore,
        phaseTag: pardonPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForPardonId(session.pardonId);
  let next: O10mModesPersistedState = {
    ...state,
    pardonSession: { ...session, active: false, graceScore, phaseTag: 'pardon' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function pardonSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  graceScore: number;
  phase: O10mPardonPhase | null;
} {
  const session = sanitizePardonSession(state.pardonSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    graceScore: session?.graceScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
