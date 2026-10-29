import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mConvoyStage,
  O10mConvoySession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_CONVOY_SCENARIO_CAP = 6;
export const O10M_CONVOY_HAUL_CAP = 650;
export const O10M_CONVOY_HAUL_MONEY_CAP = 730;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_STAGES = new Set<O10mConvoyStage>(['staging', 'transit', 'delivery']);

export function unlockTokenForConvoyId(convoyId: string): string | null {
  if (!convoyId.startsWith('o10m_convoy_')) return null;
  return `o10m_unlock_${convoyId.slice('o10m_convoy_'.length)}`;
}

export function convoyStageForCursor(cursor: number, scenarioCount: number): O10mConvoyStage {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'delivery';
  if (clamped >= Math.floor(total / 2)) return 'transit';
  return 'staging';
}

export function convoyHaulFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const moneySlice = Math.floor(run.playerMoney / 230);
  return Math.min(90, Math.max(11, Math.floor(run.playerNetWorth / 205) + moneySlice));
}

export function sanitizeConvoySession(raw: unknown): O10mConvoySession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const convoyId =
    typeof o.convoyId === 'string' && o.convoyId.startsWith('o10m_convoy_') ? o.convoyId : null;
  if (!convoyId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : convoyId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CONVOY_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const haulScore = Math.min(O10M_CONVOY_HAUL_CAP, Math.max(0, Math.floor(num(o.haulScore, 0))));
  const stageRaw = o.stageTag;
  const stageTag =
    typeof stageRaw === 'string' && VALID_STAGES.has(stageRaw as O10mConvoyStage)
      ? (stageRaw as O10mConvoyStage)
      : convoyStageForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    convoyId,
    label,
    scenarioIds,
    cursor,
    active,
    haulScore,
    stageTag,
  };
}

export function createConvoySession(params: {
  convoyId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mConvoySession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.convoyId.startsWith('o10m_convoy_')) {
    return { session: null, warnings: ['Convoy ids must start with o10m_convoy_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_CONVOY_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Convoy requires at least one valid scenario.'] };
  }
  return {
    session: {
      convoyId: params.convoyId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      haulScore: 0,
      stageTag: convoyStageForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachConvoySessionToState(
  state: O10mModesPersistedState,
  session: O10mConvoySession,
): O10mModesPersistedState {
  const sanitized = sanitizeConvoySession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    convoySession: sanitized,
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

export function clearConvoySession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, convoySession: null };
}

export function getConvoyScenarioAtCursor(session: O10mConvoySession | null | undefined): string | null {
  const convoy = sanitizeConvoySession(session);
  if (!convoy || !convoy.active) return null;
  return convoy.scenarioIds[convoy.cursor] ?? null;
}

export function buildConvoyScenarioStartOverrides(session: O10mConvoySession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const convoy = sanitizeConvoySession(session);
  if (!convoy) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_CONVOY_HAUL_MONEY_CAP, Math.floor(convoy.haulScore * 0.75));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveConvoyId: convoy.convoyId,
      o10mActiveConvoyStep: convoy.cursor,
      o10mActiveConvoyStage: convoy.stageTag,
      o10mConvoyHaul: convoy.haulScore,
    },
  };
}

export function advanceConvoySessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeConvoySession(state.convoySession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const haulScore = Math.min(O10M_CONVOY_HAUL_CAP, session.haulScore + convoyHaulFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      convoySession: {
        ...session,
        cursor,
        haulScore,
        stageTag: convoyStageForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForConvoyId(session.convoyId);
  let next: O10mModesPersistedState = {
    ...state,
    convoySession: { ...session, active: false, haulScore, stageTag: 'delivery' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function convoySessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  haul: number;
  stage: O10mConvoyStage | null;
} {
  const session = sanitizeConvoySession(state.convoySession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    haul: session?.haulScore ?? 0,
    stage: session?.active ? session.stageTag : null,
  };
}
