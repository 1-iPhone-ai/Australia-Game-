import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mParolePhase,
  O10mParoleSession,
} from './types.js';

export const O10M_PAROLE_SCENARIO_CAP = 6;
export const O10M_PAROLE_TRUST_SCORE_CAP = 880;
export const O10M_PAROLE_TRUST_SCORE_MONEY_CAP = 960;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mParolePhase>(['intake', 'review', 'parole']);

export function unlockTokenForParoleId(paroleId: string): string | null {
  if (!paroleId.startsWith('o10m_parole_')) return null;
  return `o10m_unlock_${paroleId.slice('o10m_parole_'.length)}`;
}

export function parolePhaseForCursor(cursor: number, scenarioCount: number): O10mParolePhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'parole';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'intake';
}

export function paroleTrustScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(116, Math.max(21, Math.floor(run.playerNetWorth / 166) + standingSlice));
}

export function sanitizeParoleSession(raw: unknown): O10mParoleSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const paroleId =
    typeof o.paroleId === 'string' && o.paroleId.startsWith('o10m_parole_') ? o.paroleId : null;
  if (!paroleId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : paroleId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PAROLE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const trustScore = Math.min(
    O10M_PAROLE_TRUST_SCORE_CAP,
    Math.max(0, Math.floor(num(o.trustScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mParolePhase)
      ? (phaseRaw as O10mParolePhase)
      : parolePhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    paroleId,
    label,
    scenarioIds,
    cursor,
    active,
    trustScore,
    phaseTag,
  };
}

export function createParoleSession(params: {
  paroleId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mParoleSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.paroleId.startsWith('o10m_parole_')) {
    return { session: null, warnings: ['Parole ids must start with o10m_parole_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_PAROLE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Parole arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      paroleId: params.paroleId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      trustScore: 0,
      phaseTag: parolePhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachParoleSessionToState(
  state: O10mModesPersistedState,
  session: O10mParoleSession,
): O10mModesPersistedState {
  const sanitized = sanitizeParoleSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    paroleSession: sanitized,
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

export function clearParoleSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, paroleSession: null };
}

export function getParoleScenarioAtCursor(
  session: O10mParoleSession | null | undefined,
): string | null {
  const parole = sanitizeParoleSession(session);
  if (!parole || !parole.active) return null;
  return parole.scenarioIds[parole.cursor] ?? null;
}

export function buildParoleScenarioStartOverrides(
  session: O10mParoleSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const parole = sanitizeParoleSession(session);
  if (!parole) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PAROLE_TRUST_SCORE_MONEY_CAP,
    Math.floor(parole.trustScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveParoleId: parole.paroleId,
      o10mActiveParoleStep: parole.cursor,
      o10mActiveParolePhase: parole.phaseTag,
      o10mParoleTrustScore: parole.trustScore,
    },
  };
}

export function advanceParoleSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeParoleSession(state.paroleSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const trustScore = Math.min(
    O10M_PAROLE_TRUST_SCORE_CAP,
    session.trustScore + paroleTrustScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      paroleSession: {
        ...session,
        cursor,
        trustScore,
        phaseTag: parolePhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForParoleId(session.paroleId);
  let next: O10mModesPersistedState = {
    ...state,
    paroleSession: { ...session, active: false, trustScore, phaseTag: 'parole' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function paroleSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  trustScore: number;
  phase: O10mParolePhase | null;
} {
  const session = sanitizeParoleSession(state.paroleSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    trustScore: session?.trustScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
