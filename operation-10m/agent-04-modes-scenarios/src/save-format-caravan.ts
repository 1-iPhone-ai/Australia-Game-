import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mCaravanLeg,
  O10mCaravanSession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_CARAVAN_SCENARIO_CAP = 6;
export const O10M_CARAVAN_CARGO_CAP = 660;
export const O10M_CARAVAN_CARGO_MONEY_CAP = 680;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_LEGS = new Set<O10mCaravanLeg>(['assembly', 'crossing', 'bazaar']);

export function unlockTokenForCaravanId(caravanId: string): string | null {
  if (!caravanId.startsWith('o10m_caravan_')) return null;
  return `o10m_unlock_${caravanId.slice('o10m_caravan_'.length)}`;
}

export function caravanLegForCursor(cursor: number, scenarioCount: number): O10mCaravanLeg {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'bazaar';
  if (clamped >= Math.floor(total / 2)) return 'crossing';
  return 'assembly';
}

export function caravanCargoFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const moneySlice = Math.floor(run.playerMoney / 240);
  return Math.min(88, Math.max(10, Math.floor(run.playerNetWorth / 215) + moneySlice));
}

export function sanitizeCaravanSession(raw: unknown): O10mCaravanSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const caravanId =
    typeof o.caravanId === 'string' && o.caravanId.startsWith('o10m_caravan_') ? o.caravanId : null;
  if (!caravanId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : caravanId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CARAVAN_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const cargoScore = Math.min(O10M_CARAVAN_CARGO_CAP, Math.max(0, Math.floor(num(o.cargoScore, 0))));
  const legRaw = o.legTag;
  const legTag =
    typeof legRaw === 'string' && VALID_LEGS.has(legRaw as O10mCaravanLeg)
      ? (legRaw as O10mCaravanLeg)
      : caravanLegForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    caravanId,
    label,
    scenarioIds,
    cursor,
    active,
    cargoScore,
    legTag,
  };
}

export function createCaravanSession(params: {
  caravanId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCaravanSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.caravanId.startsWith('o10m_caravan_')) {
    return { session: null, warnings: ['Caravan ids must start with o10m_caravan_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_CARAVAN_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Caravan requires at least one valid scenario.'] };
  }
  return {
    session: {
      caravanId: params.caravanId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      cargoScore: 0,
      legTag: caravanLegForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCaravanSessionToState(
  state: O10mModesPersistedState,
  session: O10mCaravanSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCaravanSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    caravanSession: sanitized,
    voyageSession: null,
    siegeSession: null,
    convoySession: null,
    escortSession: null,
  extractionSession: null,
    subjectSession: null,
    witnessSession: null,
    tribunalSession: null,
    indictmentSession: null,
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

export function clearCaravanSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, caravanSession: null };
}

export function getCaravanScenarioAtCursor(session: O10mCaravanSession | null | undefined): string | null {
  const caravan = sanitizeCaravanSession(session);
  if (!caravan || !caravan.active) return null;
  return caravan.scenarioIds[caravan.cursor] ?? null;
}

export function buildCaravanScenarioStartOverrides(session: O10mCaravanSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const caravan = sanitizeCaravanSession(session);
  if (!caravan) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_CARAVAN_CARGO_MONEY_CAP, Math.floor(caravan.cargoScore * 0.77));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCaravanId: caravan.caravanId,
      o10mActiveCaravanStep: caravan.cursor,
      o10mActiveCaravanLeg: caravan.legTag,
      o10mCaravanCargo: caravan.cargoScore,
    },
  };
}

export function advanceCaravanSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCaravanSession(state.caravanSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const cargoScore = Math.min(O10M_CARAVAN_CARGO_CAP, session.cargoScore + caravanCargoFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      caravanSession: {
        ...session,
        cursor,
        cargoScore,
        legTag: caravanLegForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCaravanId(session.caravanId);
  let next: O10mModesPersistedState = {
    ...state,
    caravanSession: { ...session, active: false, cargoScore, legTag: 'bazaar' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function caravanSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  cargo: number;
  leg: O10mCaravanLeg | null;
} {
  const session = sanitizeCaravanSession(state.caravanSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    cargo: session?.cargoScore ?? 0,
    leg: session?.active ? session.legTag : null,
  };
}
