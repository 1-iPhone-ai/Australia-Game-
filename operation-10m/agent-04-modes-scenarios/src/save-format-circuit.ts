import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mCircuitPhase,
  O10mCircuitSession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_CIRCUIT_SCENARIO_CAP = 6;
export const O10M_CIRCUIT_MOMENTUM_CAP = 900;
export const O10M_CIRCUIT_MOMENTUM_MONEY_CAP = 800;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mCircuitPhase>(['warmup', 'ascent', 'summit']);

export function unlockTokenForCircuitId(circuitId: string): string | null {
  if (!circuitId.startsWith('o10m_circuit_')) return null;
  return `o10m_unlock_${circuitId.slice('o10m_circuit_'.length)}`;
}

export function circuitPhaseForCursor(cursor: number, scenarioCount: number): O10mCircuitPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'summit';
  if (clamped >= Math.floor(total / 2)) return 'ascent';
  return 'warmup';
}

export function circuitMomentumFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  return Math.min(120, Math.max(15, Math.floor(run.playerNetWorth / 180)));
}

export function sanitizeCircuitSession(raw: unknown): O10mCircuitSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const circuitId =
    typeof o.circuitId === 'string' && o.circuitId.startsWith('o10m_circuit_') ? o.circuitId : null;
  if (!circuitId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : circuitId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CIRCUIT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const momentumScore = Math.min(O10M_CIRCUIT_MOMENTUM_CAP, Math.max(0, Math.floor(num(o.momentumScore, 0))));
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mCircuitPhase)
      ? (phaseRaw as O10mCircuitPhase)
      : circuitPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    circuitId,
    label,
    scenarioIds,
    cursor,
    active,
    momentumScore,
    phaseTag,
  };
}

export function createCircuitSession(params: {
  circuitId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCircuitSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.circuitId.startsWith('o10m_circuit_')) {
    return { session: null, warnings: ['Circuit ids must start with o10m_circuit_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_CIRCUIT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Circuit requires at least one valid scenario.'] };
  }
  return {
    session: {
      circuitId: params.circuitId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      momentumScore: 0,
      phaseTag: circuitPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCircuitSessionToState(
  state: O10mModesPersistedState,
  session: O10mCircuitSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCircuitSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    circuitSession: sanitized,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
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
    expeditionSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearCircuitSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, circuitSession: null };
}

export function getCircuitScenarioAtCursor(session: O10mCircuitSession | null | undefined): string | null {
  const circuit = sanitizeCircuitSession(session);
  if (!circuit || !circuit.active) return null;
  return circuit.scenarioIds[circuit.cursor] ?? null;
}

export function buildCircuitScenarioStartOverrides(session: O10mCircuitSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const circuit = sanitizeCircuitSession(session);
  if (!circuit) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CIRCUIT_MOMENTUM_MONEY_CAP,
    Math.floor(circuit.momentumScore * 0.85),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCircuitId: circuit.circuitId,
      o10mActiveCircuitStep: circuit.cursor,
      o10mActiveCircuitPhase: circuit.phaseTag,
      o10mCircuitMomentum: circuit.momentumScore,
    },
  };
}

export function advanceCircuitSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCircuitSession(state.circuitSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const momentumScore = Math.min(
    O10M_CIRCUIT_MOMENTUM_CAP,
    session.momentumScore + circuitMomentumFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      circuitSession: {
        ...session,
        cursor,
        momentumScore,
        phaseTag: circuitPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCircuitId(session.circuitId);
  let next: O10mModesPersistedState = {
    ...state,
    circuitSession: { ...session, active: false, momentumScore, phaseTag: 'summit' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function circuitSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  momentum: number;
  phase: O10mCircuitPhase | null;
} {
  const session = sanitizeCircuitSession(state.circuitSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    momentum: session?.momentumScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
