import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mEscortPhase,
  O10mEscortSession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_ESCORT_SCENARIO_CAP = 6;
export const O10M_ESCORT_TRUST_CAP = 660;
export const O10M_ESCORT_TRUST_MONEY_CAP = 740;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mEscortPhase>(['briefing', 'corridor', 'handoff']);

export function unlockTokenForEscortId(escortId: string): string | null {
  if (!escortId.startsWith('o10m_escort_')) return null;
  return `o10m_unlock_${escortId.slice('o10m_escort_'.length)}`;
}

export function escortPhaseForCursor(cursor: number, scenarioCount: number): O10mEscortPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'handoff';
  if (clamped >= Math.floor(total / 2)) return 'corridor';
  return 'briefing';
}

export function escortTrustFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(16, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(94, Math.max(10, Math.floor(run.playerNetWorth / 200) + standingSlice));
}

export function sanitizeEscortSession(raw: unknown): O10mEscortSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const escortId =
    typeof o.escortId === 'string' && o.escortId.startsWith('o10m_escort_') ? o.escortId : null;
  if (!escortId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : escortId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ESCORT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const trustScore = Math.min(O10M_ESCORT_TRUST_CAP, Math.max(0, Math.floor(num(o.trustScore, 0))));
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mEscortPhase)
      ? (phaseRaw as O10mEscortPhase)
      : escortPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    escortId,
    label,
    scenarioIds,
    cursor,
    active,
    trustScore,
    phaseTag,
  };
}

export function createEscortSession(params: {
  escortId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mEscortSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.escortId.startsWith('o10m_escort_')) {
    return { session: null, warnings: ['Escort ids must start with o10m_escort_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_ESCORT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Escort requires at least one valid scenario.'] };
  }
  return {
    session: {
      escortId: params.escortId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      trustScore: 0,
      phaseTag: escortPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachEscortSessionToState(
  state: O10mModesPersistedState,
  session: O10mEscortSession,
): O10mModesPersistedState {
  const sanitized = sanitizeEscortSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    escortSession: sanitized,
    extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
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
    liquidationSession: null,
    liquidationDepthSession: null,
    dissolutionSession: null,
    receivershipSession: null,
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

export function clearEscortSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, escortSession: null };
}

export function getEscortScenarioAtCursor(session: O10mEscortSession | null | undefined): string | null {
  const escort = sanitizeEscortSession(session);
  if (!escort || !escort.active) return null;
  return escort.scenarioIds[escort.cursor] ?? null;
}

export function buildEscortScenarioStartOverrides(session: O10mEscortSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const escort = sanitizeEscortSession(session);
  if (!escort) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_ESCORT_TRUST_MONEY_CAP, Math.floor(escort.trustScore * 0.76));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveEscortId: escort.escortId,
      o10mActiveEscortStep: escort.cursor,
      o10mActiveEscortPhase: escort.phaseTag,
      o10mEscortTrust: escort.trustScore,
    },
  };
}

export function advanceEscortSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeEscortSession(state.escortSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const trustScore = Math.min(O10M_ESCORT_TRUST_CAP, session.trustScore + escortTrustFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      escortSession: {
        ...session,
        cursor,
        trustScore,
        phaseTag: escortPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForEscortId(session.escortId);
  let next: O10mModesPersistedState = {
    ...state,
    escortSession: { ...session, active: false, trustScore, phaseTag: 'handoff' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function escortSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  trust: number;
  phase: O10mEscortPhase | null;
} {
  const session = sanitizeEscortSession(state.escortSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    trust: session?.trustScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
