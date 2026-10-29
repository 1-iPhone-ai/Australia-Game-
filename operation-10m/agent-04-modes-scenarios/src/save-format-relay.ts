import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type { O10mChainCarryBonus, O10mModesPersistedState, O10mRelaySession, O10mRunSummary } from './types.js';

export const O10M_RELAY_SCENARIO_CAP = 6;
export const O10M_RELAY_CARRY_MONEY_CAP = 2500;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function mergeLegCarry(base: O10mChainCarryBonus, add: O10mChainCarryBonus): O10mChainCarryBonus {
  const standingDelta = { ...(base.standingDelta || {}) };
  for (const [k, v] of Object.entries(add.standingDelta || {})) {
    standingDelta[k] = (standingDelta[k] || 0) + v;
  }
  const money = Math.min(
    O10M_RELAY_CARRY_MONEY_CAP,
    (base.startingMoneyDelta || 0) + (add.startingMoneyDelta || 0),
  );
  return {
    startingMoneyDelta: money > 0 ? money : undefined,
    standingDelta: Object.keys(standingDelta).length ? standingDelta : undefined,
    forcedSettingsPatch: { ...(base.forcedSettingsPatch || {}), ...(add.forcedSettingsPatch || {}) },
  };
}

function sanitizeLegCarry(raw: unknown): O10mChainCarryBonus {
  if (!raw || typeof raw !== 'object') return {};
  const o = raw as Record<string, unknown>;
  const standingDelta =
    o.standingDelta && typeof o.standingDelta === 'object'
      ? (Object.fromEntries(
          Object.entries(o.standingDelta as Record<string, unknown>).filter(
            ([, v]) => typeof v === 'number' && Number.isFinite(v),
          ),
        ) as Record<string, number>)
      : undefined;
  const moneyRaw = num(o.startingMoneyDelta, 0);
  const startingMoneyDelta =
    moneyRaw > 0 ? Math.min(O10M_RELAY_CARRY_MONEY_CAP, Math.floor(moneyRaw)) : undefined;
  const forcedSettingsPatch =
    o.forcedSettingsPatch && typeof o.forcedSettingsPatch === 'object'
      ? (o.forcedSettingsPatch as Record<string, unknown>)
      : undefined;
  return { startingMoneyDelta, standingDelta, forcedSettingsPatch };
}

export function unlockTokenForRelayId(relayId: string): string | null {
  if (!relayId.startsWith('o10m_relay_')) return null;
  return `o10m_unlock_${relayId.slice('o10m_relay_'.length)}`;
}

export function relayLegCarryFromRun(run: O10mRunSummary): O10mChainCarryBonus {
  if (!run.primaryVictory) return {};
  const bonus = Math.min(500, Math.max(50, Math.floor(run.playerMoney / 12)));
  return { startingMoneyDelta: bonus };
}

export function sanitizeRelaySession(raw: unknown): O10mRelaySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const relayId =
    typeof o.relayId === 'string' && o.relayId.startsWith('o10m_relay_') ? o.relayId : null;
  if (!relayId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : relayId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_RELAY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const active = o.active !== false;
  return {
    relayId,
    label,
    scenarioIds,
    cursor,
    active,
    legCarry: sanitizeLegCarry(o.legCarry),
  };
}

export function createRelaySession(params: {
  relayId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mRelaySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.relayId.startsWith('o10m_relay_')) {
    return { session: null, warnings: ['Relay ids must start with o10m_relay_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_RELAY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Relay requires at least one valid scenario.'] };
  }
  return {
    session: {
      relayId: params.relayId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      legCarry: {},
    },
    warnings,
  };
}

export function attachRelaySessionToState(
  state: O10mModesPersistedState,
  session: O10mRelaySession,
): O10mModesPersistedState {
  const sanitized = sanitizeRelaySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    relaySession: sanitized,
    marathonQueue: null,
    gauntletSession: null,
    circuitSession: null,
    expeditionSession: null,
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
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearRelaySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, relaySession: null };
}

export function getRelayScenarioAtCursor(session: O10mRelaySession | null | undefined): string | null {
  const relay = sanitizeRelaySession(session);
  if (!relay || !relay.active) return null;
  return relay.scenarioIds[relay.cursor] ?? null;
}

export function buildRelayScenarioStartOverrides(session: O10mRelaySession | null | undefined): {
  startingMoneyDelta: number;
  startingStandingDelta?: Record<string, number>;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const relay = sanitizeRelaySession(session);
  if (!relay) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const carry = relay.legCarry;
  return {
    startingMoneyDelta: carry.startingMoneyDelta ?? 0,
    startingStandingDelta: carry.standingDelta ? { ...carry.standingDelta } : undefined,
    forcedSettingsPatch: {
      ...(carry.forcedSettingsPatch || {}),
      o10mActiveRelayId: relay.relayId,
      o10mActiveRelayStep: relay.cursor,
    },
  };
}

export function advanceRelaySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeRelaySession(state.relaySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const legCarry = mergeLegCarry(session.legCarry, relayLegCarryFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      relaySession: { ...session, cursor, legCarry },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForRelayId(session.relayId);
  let next: O10mModesPersistedState = {
    ...state,
    relaySession: { ...session, active: false, legCarry },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function relaySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  carryMoney: number;
} {
  const session = sanitizeRelaySession(state.relaySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    carryMoney: session?.legCarry.startingMoneyDelta ?? 0,
  };
}
