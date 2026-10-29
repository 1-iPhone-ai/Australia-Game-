import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mWitnessPhase,
  O10mWitnessSession,
} from './types.js';

export const O10M_WITNESS_SCENARIO_CAP = 6;
export const O10M_WITNESS_CREDIBILITY_CAP = 720;
export const O10M_WITNESS_CREDIBILITY_MONEY_CAP = 800;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mWitnessPhase>(['brief', 'testimony', 'affirm']);

export function unlockTokenForWitnessId(witnessId: string): string | null {
  if (!witnessId.startsWith('o10m_witness_')) return null;
  return `o10m_unlock_${witnessId.slice('o10m_witness_'.length)}`;
}

export function witnessPhaseForCursor(cursor: number, scenarioCount: number): O10mWitnessPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'affirm';
  if (clamped >= Math.floor(total / 2)) return 'testimony';
  return 'brief';
}

export function witnessCredibilityFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(100, Math.max(13, Math.floor(run.playerNetWorth / 185) + standingSlice));
}

export function sanitizeWitnessSession(raw: unknown): O10mWitnessSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const witnessId =
    typeof o.witnessId === 'string' && o.witnessId.startsWith('o10m_witness_') ? o.witnessId : null;
  if (!witnessId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : witnessId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_WITNESS_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const credibilityScore = Math.min(
    O10M_WITNESS_CREDIBILITY_CAP,
    Math.max(0, Math.floor(num(o.credibilityScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mWitnessPhase)
      ? (phaseRaw as O10mWitnessPhase)
      : witnessPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    witnessId,
    label,
    scenarioIds,
    cursor,
    active,
    credibilityScore,
    phaseTag,
  };
}

export function createWitnessSession(params: {
  witnessId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mWitnessSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.witnessId.startsWith('o10m_witness_')) {
    return { session: null, warnings: ['Witness ids must start with o10m_witness_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_WITNESS_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Witness arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      witnessId: params.witnessId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      credibilityScore: 0,
      phaseTag: witnessPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachWitnessSessionToState(
  state: O10mModesPersistedState,
  session: O10mWitnessSession,
): O10mModesPersistedState {
  const sanitized = sanitizeWitnessSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    witnessSession: sanitized,
    tribunalSession: null,
    indictmentSession: null,
    appealSession: null,
    clemencySession: null,
    pardonSession: null,
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

export function clearWitnessSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, witnessSession: null };
}

export function getWitnessScenarioAtCursor(
  session: O10mWitnessSession | null | undefined,
): string | null {
  const witness = sanitizeWitnessSession(session);
  if (!witness || !witness.active) return null;
  return witness.scenarioIds[witness.cursor] ?? null;
}

export function buildWitnessScenarioStartOverrides(
  session: O10mWitnessSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const witness = sanitizeWitnessSession(session);
  if (!witness) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_WITNESS_CREDIBILITY_MONEY_CAP,
    Math.floor(witness.credibilityScore * 0.81),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveWitnessId: witness.witnessId,
      o10mActiveWitnessStep: witness.cursor,
      o10mActiveWitnessPhase: witness.phaseTag,
      o10mWitnessCredibility: witness.credibilityScore,
    },
  };
}

export function advanceWitnessSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeWitnessSession(state.witnessSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const credibilityScore = Math.min(
    O10M_WITNESS_CREDIBILITY_CAP,
    session.credibilityScore + witnessCredibilityFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      witnessSession: {
        ...session,
        cursor,
        credibilityScore,
        phaseTag: witnessPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForWitnessId(session.witnessId);
  let next: O10mModesPersistedState = {
    ...state,
    witnessSession: { ...session, active: false, credibilityScore, phaseTag: 'affirm' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function witnessSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  credibility: number;
  phase: O10mWitnessPhase | null;
} {
  const session = sanitizeWitnessSession(state.witnessSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    credibility: session?.credibilityScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
