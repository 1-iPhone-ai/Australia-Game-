import { advanceGauntletSessionAfterRun } from './save-format-gauntlet.js';
import { advanceCircuitSessionAfterRun } from './save-format-circuit.js';
import { advanceExpeditionSessionAfterRun } from './save-format-expedition.js';
import { advanceOdysseySessionAfterRun } from './save-format-odyssey.js';
import { advancePilgrimageSessionAfterRun } from './save-format-pilgrimage.js';
import { advanceCaravanSessionAfterRun } from './save-format-caravan.js';
import { advanceConvoySessionAfterRun } from './save-format-convoy.js';
import { advanceEscortSessionAfterRun } from './save-format-escort.js';
import { advanceExtractionSessionAfterRun } from './save-format-extraction.js';
import { advanceSubjectSessionAfterRun } from './save-format-subject.js';
import { advanceWitnessSessionAfterRun } from './save-format-witness.js';
import { advanceTribunalSessionAfterRun } from './save-format-tribunal.js';
import { advanceIndictmentSessionAfterRun } from './save-format-indictment.js';
import { advanceAppealSessionAfterRun } from './save-format-appeal.js';
import { advanceClemencySessionAfterRun } from './save-format-clemency.js';
import { advancePardonSessionAfterRun } from './save-format-pardon.js';
import { advanceSiegeSessionAfterRun } from './save-format-siege.js';
import { advanceVoyageSessionAfterRun } from './save-format-voyage.js';
import { advanceRelaySessionAfterRun } from './save-format-relay.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mMarathonQueue,
  O10mModesPersistedState,
  O10mRunSummary,
  O10mScenarioReplayRow,
} from './types.js';

export const O10M_MARATHON_QUEUE_CAP = 8;
export const O10M_REPLAY_LEDGER_CAP = 20;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

export function sanitizeReplayLedger(raw: unknown): O10mScenarioReplayRow[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(r => r && typeof r === 'object')
    .map(r => {
      const row = r as Record<string, unknown>;
      const scenarioId = typeof row.scenarioId === 'string' && row.scenarioId.startsWith('o10m_') ? row.scenarioId : '';
      if (!scenarioId) return null;
      return {
        scenarioId,
        playCount: Math.max(0, Math.floor(num(row.playCount, 0))),
        primaryVictories: Math.max(0, Math.floor(num(row.primaryVictories, 0))),
        lastPlayedTurn: Math.max(0, Math.floor(num(row.lastPlayedTurn, 0))),
      };
    })
    .filter((r): r is O10mScenarioReplayRow => r !== null)
    .slice(0, O10M_REPLAY_LEDGER_CAP);
}

export function sanitizeMarathonQueue(raw: unknown): O10mMarathonQueue | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const queueId =
    typeof o.queueId === 'string' && o.queueId.startsWith('o10m_marathon_') ? o.queueId : null;
  if (!queueId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : queueId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_MARATHON_QUEUE_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const loopOnComplete = o.loopOnComplete === true;
  const active = o.active !== false;
  return { queueId, label, scenarioIds, cursor, loopOnComplete, active };
}

export function createMarathonQueue(params: {
  queueId: string;
  label: string;
  scenarioIds: string[];
  loopOnComplete?: boolean;
}): { queue: O10mMarathonQueue | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.queueId.startsWith('o10m_marathon_')) {
    return { queue: null, warnings: ['Marathon queue ids must start with o10m_marathon_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_MARATHON_QUEUE_CAP);
  if (trimmed.length === 0) {
    return { queue: null, warnings: [...warnings, 'Marathon queue requires at least one valid scenario.'] };
  }
  return {
    queue: {
      queueId: params.queueId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      loopOnComplete: params.loopOnComplete === true,
      active: true,
    },
    warnings,
  };
}

export function attachMarathonQueueToState(
  state: O10mModesPersistedState,
  queue: O10mMarathonQueue,
): O10mModesPersistedState {
  const sanitized = sanitizeMarathonQueue(queue);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    marathonQueue: sanitized,
    gauntletSession: null,
    relaySession: null,
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
    scenarioId,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearMarathonQueue(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, marathonQueue: null };
}

export function getMarathonScenarioAtCursor(queue: O10mMarathonQueue | null | undefined): string | null {
  const q = sanitizeMarathonQueue(queue);
  if (!q || !q.active) return null;
  return q.scenarioIds[q.cursor] ?? null;
}

export function recordScenarioReplayEntry(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
  turn: number,
): O10mModesPersistedState {
  const scenarioId = run.scenarioId;
  if (!scenarioId || !scenarioId.startsWith('o10m_')) return state;
  const ledger = sanitizeReplayLedger(state.replayLedger);
  const idx = ledger.findIndex(r => r.scenarioId === scenarioId);
  const prev =
    idx >= 0
      ? ledger[idx]!
      : { scenarioId, playCount: 0, primaryVictories: 0, lastPlayedTurn: 0 };
  const next: O10mScenarioReplayRow = {
    scenarioId,
    playCount: prev.playCount + 1,
    primaryVictories: prev.primaryVictories + (run.primaryVictory ? 1 : 0),
    lastPlayedTurn: turn,
  };
  const merged = idx >= 0 ? ledger.map((r, i) => (i === idx ? next : r)) : [...ledger, next];
  merged.sort((a, b) => b.lastPlayedTurn - a.lastPlayedTurn);
  return { ...state, replayLedger: merged.slice(0, O10M_REPLAY_LEDGER_CAP) };
}

export function advanceMarathonQueueAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const queue = sanitizeMarathonQueue(state.marathonQueue);
  if (!queue || !queue.active) return state;
  const atCursor = queue.scenarioIds[queue.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) {
    return { ...state, marathonQueue: { ...queue, active: true } };
  }

  const atEnd = queue.cursor >= queue.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = queue.cursor + 1;
    const nextScenario = queue.scenarioIds[cursor] ?? null;
    return {
      ...state,
      marathonQueue: { ...queue, cursor },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  if (queue.loopOnComplete) {
    const nextScenario = queue.scenarioIds[0] ?? null;
    return {
      ...state,
      marathonQueue: { ...queue, cursor: 0 },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  return {
    ...state,
    marathonQueue: { ...queue, active: false },
  };
}

export function mergeReplayLedgers(
  a: O10mScenarioReplayRow[],
  b: O10mScenarioReplayRow[],
): O10mScenarioReplayRow[] {
  const map = new Map<string, O10mScenarioReplayRow>();
  for (const row of [...a, ...b]) {
    const prev = map.get(row.scenarioId);
    if (!prev) {
      map.set(row.scenarioId, { ...row });
      continue;
    }
    map.set(row.scenarioId, {
      scenarioId: row.scenarioId,
      playCount: Math.max(prev.playCount, row.playCount),
      primaryVictories: Math.max(prev.primaryVictories, row.primaryVictories),
      lastPlayedTurn: Math.max(prev.lastPlayedTurn, row.lastPlayedTurn),
    });
  }
  return [...map.values()].sort((x, y) => y.lastPlayedTurn - x.lastPlayedTurn).slice(0, O10M_REPLAY_LEDGER_CAP);
}

export function replayLedgerSummary(state: O10mModesPersistedState): {
  trackedScenarios: number;
  totalPlays: number;
  totalPrimaryVictories: number;
} {
  const ledger = sanitizeReplayLedger(state.replayLedger);
  return {
    trackedScenarios: ledger.length,
    totalPlays: ledger.reduce((s, r) => s + r.playCount, 0),
    totalPrimaryVictories: ledger.reduce((s, r) => s + r.primaryVictories, 0),
  };
}

export function applyPostRunPersistedUpdates(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
  turn: number,
): O10mModesPersistedState {
  let next = recordScenarioReplayEntry(state, run, turn);
  next = advancePardonSessionAfterRun(next, run);
  next = advanceClemencySessionAfterRun(next, run);
  next = advanceAppealSessionAfterRun(next, run);
  next = advanceIndictmentSessionAfterRun(next, run);
  next = advanceTribunalSessionAfterRun(next, run);
  next = advanceWitnessSessionAfterRun(next, run);
  next = advanceSubjectSessionAfterRun(next, run);
  next = advanceExtractionSessionAfterRun(next, run);
  next = advanceEscortSessionAfterRun(next, run);
  next = advanceConvoySessionAfterRun(next, run);
  next = advanceSiegeSessionAfterRun(next, run);
  next = advanceVoyageSessionAfterRun(next, run);
  next = advanceCaravanSessionAfterRun(next, run);
  next = advancePilgrimageSessionAfterRun(next, run);
  next = advanceOdysseySessionAfterRun(next, run);
  next = advanceExpeditionSessionAfterRun(next, run);
  next = advanceCircuitSessionAfterRun(next, run);
  next = advanceRelaySessionAfterRun(next, run);
  next = advanceMarathonQueueAfterRun(next, run);
  next = advanceGauntletSessionAfterRun(next, run);
  return next;
}
