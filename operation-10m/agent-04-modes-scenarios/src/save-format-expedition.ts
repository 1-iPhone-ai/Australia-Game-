import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mExpeditionLeg,
  O10mExpeditionSession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_EXPEDITION_SCENARIO_CAP = 6;
export const O10M_EXPEDITION_SUPPLY_CAP = 720;
export const O10M_EXPEDITION_SUPPLY_MONEY_CAP = 650;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_LEGS = new Set<O10mExpeditionLeg>(['departure', 'transit', 'arrival']);

export function unlockTokenForExpeditionId(expeditionId: string): string | null {
  if (!expeditionId.startsWith('o10m_expedition_')) return null;
  return `o10m_unlock_${expeditionId.slice('o10m_expedition_'.length)}`;
}

export function expeditionLegForCursor(cursor: number, scenarioCount: number): O10mExpeditionLeg {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'arrival';
  if (clamped >= Math.floor(total / 2)) return 'transit';
  return 'departure';
}

export function expeditionSupplyFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  return Math.min(95, Math.max(12, Math.floor(run.playerNetWorth / 210)));
}

export function sanitizeExpeditionSession(raw: unknown): O10mExpeditionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const expeditionId =
    typeof o.expeditionId === 'string' && o.expeditionId.startsWith('o10m_expedition_')
      ? o.expeditionId
      : null;
  if (!expeditionId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : expeditionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXPEDITION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const supplyScore = Math.min(O10M_EXPEDITION_SUPPLY_CAP, Math.max(0, Math.floor(num(o.supplyScore, 0))));
  const legRaw = o.legTag;
  const legTag =
    typeof legRaw === 'string' && VALID_LEGS.has(legRaw as O10mExpeditionLeg)
      ? (legRaw as O10mExpeditionLeg)
      : expeditionLegForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    expeditionId,
    label,
    scenarioIds,
    cursor,
    active,
    supplyScore,
    legTag,
  };
}

export function createExpeditionSession(params: {
  expeditionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExpeditionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.expeditionId.startsWith('o10m_expedition_')) {
    return { session: null, warnings: ['Expedition ids must start with o10m_expedition_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_EXPEDITION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Expedition requires at least one valid scenario.'] };
  }
  return {
    session: {
      expeditionId: params.expeditionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      supplyScore: 0,
      legTag: expeditionLegForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExpeditionSessionToState(
  state: O10mModesPersistedState,
  session: O10mExpeditionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExpeditionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    expeditionSession: sanitized,
    odysseySession: null,
    pilgrimageSession: null,
    caravanSession: null,
    voyageSession: null,
    circuitSession: null,
    marathonQueue: null,
    gauntletSession: null,
    relaySession: null,
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearExpeditionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, expeditionSession: null };
}

export function getExpeditionScenarioAtCursor(session: O10mExpeditionSession | null | undefined): string | null {
  const expedition = sanitizeExpeditionSession(session);
  if (!expedition || !expedition.active) return null;
  return expedition.scenarioIds[expedition.cursor] ?? null;
}

export function buildExpeditionScenarioStartOverrides(session: O10mExpeditionSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const expedition = sanitizeExpeditionSession(session);
  if (!expedition) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXPEDITION_SUPPLY_MONEY_CAP,
    Math.floor(expedition.supplyScore * 0.75),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExpeditionId: expedition.expeditionId,
      o10mActiveExpeditionStep: expedition.cursor,
      o10mActiveExpeditionLeg: expedition.legTag,
      o10mExpeditionSupply: expedition.supplyScore,
    },
  };
}

export function advanceExpeditionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExpeditionSession(state.expeditionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const supplyScore = Math.min(
    O10M_EXPEDITION_SUPPLY_CAP,
    session.supplyScore + expeditionSupplyFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      expeditionSession: {
        ...session,
        cursor,
        supplyScore,
        legTag: expeditionLegForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExpeditionId(session.expeditionId);
  let next: O10mModesPersistedState = {
    ...state,
    expeditionSession: { ...session, active: false, supplyScore, legTag: 'arrival' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function expeditionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  supply: number;
  leg: O10mExpeditionLeg | null;
} {
  const session = sanitizeExpeditionSession(state.expeditionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    supply: session?.supplyScore ?? 0,
    leg: session?.active ? session.legTag : null,
  };
}
