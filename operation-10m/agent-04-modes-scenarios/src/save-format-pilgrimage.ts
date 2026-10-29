import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mPilgrimageSession,
  O10mPilgrimageStage,
  O10mRunSummary,
} from './types.js';

export const O10M_PILGRIMAGE_SCENARIO_CAP = 6;
export const O10M_PILGRIMAGE_DEVOTION_CAP = 640;
export const O10M_PILGRIMAGE_DEVOTION_MONEY_CAP = 700;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_STAGES = new Set<O10mPilgrimageStage>(['setting_out', 'midway', 'sanctuary']);

export function unlockTokenForPilgrimageId(pilgrimageId: string): string | null {
  if (!pilgrimageId.startsWith('o10m_pilgrimage_')) return null;
  return `o10m_unlock_${pilgrimageId.slice('o10m_pilgrimage_'.length)}`;
}

export function pilgrimageStageForCursor(cursor: number, scenarioCount: number): O10mPilgrimageStage {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'sanctuary';
  if (clamped >= Math.floor(total / 2)) return 'midway';
  return 'setting_out';
}

export function pilgrimageDevotionFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const regionBonus = Math.min(20, run.regionsControlled * 6);
  return Math.min(92, Math.max(11, Math.floor(run.playerNetWorth / 205) + regionBonus));
}

export function sanitizePilgrimageSession(raw: unknown): O10mPilgrimageSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const pilgrimageId =
    typeof o.pilgrimageId === 'string' && o.pilgrimageId.startsWith('o10m_pilgrimage_')
      ? o.pilgrimageId
      : null;
  if (!pilgrimageId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : pilgrimageId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_PILGRIMAGE_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const devotionScore = Math.min(
    O10M_PILGRIMAGE_DEVOTION_CAP,
    Math.max(0, Math.floor(num(o.devotionScore, 0))),
  );
  const stageRaw = o.stageTag;
  const stageTag =
    typeof stageRaw === 'string' && VALID_STAGES.has(stageRaw as O10mPilgrimageStage)
      ? (stageRaw as O10mPilgrimageStage)
      : pilgrimageStageForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    pilgrimageId,
    label,
    scenarioIds,
    cursor,
    active,
    devotionScore,
    stageTag,
  };
}

export function createPilgrimageSession(params: {
  pilgrimageId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mPilgrimageSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.pilgrimageId.startsWith('o10m_pilgrimage_')) {
    return { session: null, warnings: ['Pilgrimage ids must start with o10m_pilgrimage_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_PILGRIMAGE_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Pilgrimage requires at least one valid scenario.'] };
  }
  return {
    session: {
      pilgrimageId: params.pilgrimageId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      devotionScore: 0,
      stageTag: pilgrimageStageForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachPilgrimageSessionToState(
  state: O10mModesPersistedState,
  session: O10mPilgrimageSession,
): O10mModesPersistedState {
  const sanitized = sanitizePilgrimageSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    pilgrimageSession: sanitized,
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

export function clearPilgrimageSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, pilgrimageSession: null };
}

export function getPilgrimageScenarioAtCursor(session: O10mPilgrimageSession | null | undefined): string | null {
  const pilgrimage = sanitizePilgrimageSession(session);
  if (!pilgrimage || !pilgrimage.active) return null;
  return pilgrimage.scenarioIds[pilgrimage.cursor] ?? null;
}

export function buildPilgrimageScenarioStartOverrides(session: O10mPilgrimageSession | null | undefined): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const pilgrimage = sanitizePilgrimageSession(session);
  if (!pilgrimage) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_PILGRIMAGE_DEVOTION_MONEY_CAP,
    Math.floor(pilgrimage.devotionScore * 0.78),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActivePilgrimageId: pilgrimage.pilgrimageId,
      o10mActivePilgrimageStep: pilgrimage.cursor,
      o10mActivePilgrimageStage: pilgrimage.stageTag,
      o10mPilgrimageDevotion: pilgrimage.devotionScore,
    },
  };
}

export function advancePilgrimageSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizePilgrimageSession(state.pilgrimageSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const devotionScore = Math.min(
    O10M_PILGRIMAGE_DEVOTION_CAP,
    session.devotionScore + pilgrimageDevotionFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      pilgrimageSession: {
        ...session,
        cursor,
        devotionScore,
        stageTag: pilgrimageStageForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForPilgrimageId(session.pilgrimageId);
  let next: O10mModesPersistedState = {
    ...state,
    pilgrimageSession: { ...session, active: false, devotionScore, stageTag: 'sanctuary' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function pilgrimageSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  devotion: number;
  stage: O10mPilgrimageStage | null;
} {
  const session = sanitizePilgrimageSession(state.pilgrimageSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    devotion: session?.devotionScore ?? 0,
    stage: session?.active ? session.stageTag : null,
  };
}
