import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mExtractionPhase,
  O10mExtractionSession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_EXTRACTION_SCENARIO_CAP = 6;
export const O10M_EXTRACTION_ASSET_CAP = 680;
export const O10M_EXTRACTION_ASSET_MONEY_CAP = 760;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mExtractionPhase>(['intel', 'rescue', 'exfil']);

export function unlockTokenForExtractionId(extractionId: string): string | null {
  if (!extractionId.startsWith('o10m_extraction_')) return null;
  return `o10m_unlock_${extractionId.slice('o10m_extraction_'.length)}`;
}

export function extractionPhaseForCursor(cursor: number, scenarioCount: number): O10mExtractionPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'exfil';
  if (clamped >= Math.floor(total / 2)) return 'rescue';
  return 'intel';
}

export function extractionAssetFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(17, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(96, Math.max(11, Math.floor(run.playerNetWorth / 195) + standingSlice));
}

export function sanitizeExtractionSession(raw: unknown): O10mExtractionSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const extractionId =
    typeof o.extractionId === 'string' && o.extractionId.startsWith('o10m_extraction_')
      ? o.extractionId
      : null;
  if (!extractionId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : extractionId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXTRACTION_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const assetScore = Math.min(
    O10M_EXTRACTION_ASSET_CAP,
    Math.max(0, Math.floor(num(o.assetScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mExtractionPhase)
      ? (phaseRaw as O10mExtractionPhase)
      : extractionPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    extractionId,
    label,
    scenarioIds,
    cursor,
    active,
    assetScore,
    phaseTag,
  };
}

export function createExtractionSession(params: {
  extractionId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExtractionSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.extractionId.startsWith('o10m_extraction_')) {
    return { session: null, warnings: ['Extraction ids must start with o10m_extraction_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_EXTRACTION_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Extraction requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      extractionId: params.extractionId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      assetScore: 0,
      phaseTag: extractionPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExtractionSessionToState(
  state: O10mModesPersistedState,
  session: O10mExtractionSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExtractionSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    extractionSession: sanitized,
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

export function clearExtractionSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, extractionSession: null };
}

export function getExtractionScenarioAtCursor(
  session: O10mExtractionSession | null | undefined,
): string | null {
  const extraction = sanitizeExtractionSession(session);
  if (!extraction || !extraction.active) return null;
  return extraction.scenarioIds[extraction.cursor] ?? null;
}

export function buildExtractionScenarioStartOverrides(
  session: O10mExtractionSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const extraction = sanitizeExtractionSession(session);
  if (!extraction) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXTRACTION_ASSET_MONEY_CAP,
    Math.floor(extraction.assetScore * 0.77),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExtractionId: extraction.extractionId,
      o10mActiveExtractionStep: extraction.cursor,
      o10mActiveExtractionPhase: extraction.phaseTag,
      o10mExtractionAssets: extraction.assetScore,
    },
  };
}

export function advanceExtractionSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExtractionSession(state.extractionSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const assetScore = Math.min(
    O10M_EXTRACTION_ASSET_CAP,
    session.assetScore + extractionAssetFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      extractionSession: {
        ...session,
        cursor,
        assetScore,
        phaseTag: extractionPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExtractionId(session.extractionId);
  let next: O10mModesPersistedState = {
    ...state,
    extractionSession: { ...session, active: false, assetScore, phaseTag: 'exfil' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function extractionSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  assets: number;
  phase: O10mExtractionPhase | null;
} {
  const session = sanitizeExtractionSession(state.extractionSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    assets: session?.assetScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
