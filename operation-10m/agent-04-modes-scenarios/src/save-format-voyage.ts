import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mVoyageSegment,
  O10mVoyageSession,
} from './types.js';

export const O10M_VOYAGE_SCENARIO_CAP = 6;
export const O10M_VOYAGE_CHART_CAP = 620;
export const O10M_VOYAGE_CHART_MONEY_CAP = 710;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_SEGMENTS = new Set<O10mVoyageSegment>(['embark', 'open_sea', 'port_call']);

export function unlockTokenForVoyageId(voyageId: string): string | null {
  if (!voyageId.startsWith('o10m_voyage_')) return null;
  return `o10m_unlock_${voyageId.slice('o10m_voyage_'.length)}`;
}

export function voyageSegmentForCursor(cursor: number, scenarioCount: number): O10mVoyageSegment {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'port_call';
  if (clamped >= Math.floor(total / 2)) return 'open_sea';
  return 'embark';
}

export function voyageChartFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingBonus = Math.min(18, Math.floor(run.maxRegionalStanding / 5));
  return Math.min(90, Math.max(13, Math.floor(run.playerNetWorth / 220) + standingBonus));
}

export function sanitizeVoyageSession(raw: unknown): O10mVoyageSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const voyageId =
    typeof o.voyageId === 'string' && o.voyageId.startsWith('o10m_voyage_') ? o.voyageId : null;
  if (!voyageId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : voyageId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_VOYAGE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const chartScore = Math.min(O10M_VOYAGE_CHART_CAP, Math.max(0, Math.floor(num(o.chartScore, 0))));
  const segmentRaw = o.segmentTag;
  const segmentTag =
    typeof segmentRaw === 'string' && VALID_SEGMENTS.has(segmentRaw as O10mVoyageSegment)
      ? (segmentRaw as O10mVoyageSegment)
      : voyageSegmentForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    voyageId,
    label,
    scenarioIds,
    cursor,
    active,
    chartScore,
    segmentTag,
  };
}

export function createVoyageSession(params: {
  voyageId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mVoyageSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.voyageId.startsWith('o10m_voyage_')) {
    return { session: null, warnings: ['Voyage ids must start with o10m_voyage_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_VOYAGE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Voyage requires at least one valid scenario.'] };
  }
  return {
    session: {
      voyageId: params.voyageId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      chartScore: 0,
      segmentTag: voyageSegmentForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachVoyageSessionToState(
  state: O10mModesPersistedState,
  session: O10mVoyageSession,
): O10mModesPersistedState {
  const sanitized = sanitizeVoyageSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    voyageSession: sanitized,
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
    acquittalSession: null,
    exonerationSession: null,
    expungementSession: null,
    vacaturSession: null,
    remandSession: null,
    reversalSession: null,
    annulmentSession: null,
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

export function clearVoyageSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, voyageSession: null };
}

export function getVoyageScenarioAtCursor(session: O10mVoyageSession | null | undefined): string | null {
  const voyage = sanitizeVoyageSession(session);
  if (!voyage || !voyage.active) return null;
  return voyage.scenarioIds[voyage.cursor] ?? null;
}

export function buildVoyageScenarioStartOverrides(session: O10mVoyageSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const voyage = sanitizeVoyageSession(session);
  if (!voyage) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(O10M_VOYAGE_CHART_MONEY_CAP, Math.floor(voyage.chartScore * 0.76));
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveVoyageId: voyage.voyageId,
      o10mActiveVoyageStep: voyage.cursor,
      o10mActiveVoyageSegment: voyage.segmentTag,
      o10mVoyageChart: voyage.chartScore,
    },
  };
}

export function advanceVoyageSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeVoyageSession(state.voyageSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const chartScore = Math.min(O10M_VOYAGE_CHART_CAP, session.chartScore + voyageChartFromRun(run));
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      voyageSession: {
        ...session,
        cursor,
        chartScore,
        segmentTag: voyageSegmentForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForVoyageId(session.voyageId);
  let next: O10mModesPersistedState = {
    ...state,
    voyageSession: { ...session, active: false, chartScore, segmentTag: 'port_call' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function voyageSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  chart: number;
  segment: O10mVoyageSegment | null;
} {
  const session = sanitizeVoyageSession(state.voyageSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    chart: session?.chartScore ?? 0,
    segment: session?.active ? session.segmentTag : null,
  };
}
