import { listO10mChallengeModeIds } from './challenge-modes.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mChallengeModeId,
  O10mGauntletSession,
  O10mModesPersistedState,
  O10mRunSummary,
} from './types.js';

export const O10M_GAUNTLET_SCENARIO_CAP = 6;
export const O10M_GAUNTLET_LIVES_MAX = 5;
export const O10M_UNLOCK_TOKEN_CAP = 16;

const VALID_CHALLENGES = new Set(listO10mChallengeModeIds());

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

export function unlockTokenForGauntletId(gauntletId: string): string | null {
  if (!gauntletId.startsWith('o10m_gauntlet_')) return null;
  return `o10m_unlock_${gauntletId.slice('o10m_gauntlet_'.length)}`;
}

export function sanitizeCatalogUnlockTokens(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((t): t is string => typeof t === 'string' && t.startsWith('o10m_unlock_'))
    .slice(0, O10M_UNLOCK_TOKEN_CAP);
}

export function sanitizeGauntletSession(raw: unknown): O10mGauntletSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const gauntletId =
    typeof o.gauntletId === 'string' && o.gauntletId.startsWith('o10m_gauntlet_') ? o.gauntletId : null;
  if (!gauntletId) return null;
  const label = typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : gauntletId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_GAUNTLET_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const livesRaw = Math.floor(num(o.livesRemaining, O10M_GAUNTLET_LIVES_MAX));
  const livesRemaining = Math.min(Math.max(1, livesRaw), O10M_GAUNTLET_LIVES_MAX);
  const failures = Math.max(0, Math.floor(num(o.failures, 0)));
  const challengeRaw = o.requiredChallengeId;
  const requiredChallengeId =
    typeof challengeRaw === 'string' && VALID_CHALLENGES.has(challengeRaw as O10mChallengeModeId)
      ? (challengeRaw as O10mChallengeModeId)
      : null;
  const active = o.active !== false;
  return {
    gauntletId,
    label,
    scenarioIds,
    cursor,
    livesRemaining,
    requiredChallengeId,
    active,
    failures,
  };
}

export function createGauntletSession(params: {
  gauntletId: string;
  label: string;
  scenarioIds: string[];
  livesRemaining?: number;
  requiredChallengeId?: O10mChallengeModeId | null;
}): { session: O10mGauntletSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.gauntletId.startsWith('o10m_gauntlet_')) {
    return { session: null, warnings: ['Gauntlet ids must start with o10m_gauntlet_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_GAUNTLET_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return { session: null, warnings: [...warnings, 'Gauntlet requires at least one valid scenario.'] };
  }
  const livesRemaining = Math.min(
    O10M_GAUNTLET_LIVES_MAX,
    Math.max(1, params.livesRemaining ?? 3),
  );
  const requiredChallengeId =
    params.requiredChallengeId && VALID_CHALLENGES.has(params.requiredChallengeId)
      ? params.requiredChallengeId
      : null;
  return {
    session: {
      gauntletId: params.gauntletId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      livesRemaining,
      requiredChallengeId,
      active: true,
      failures: 0,
    },
    warnings,
  };
}

export function attachGauntletSessionToState(
  state: O10mModesPersistedState,
  session: O10mGauntletSession,
): O10mModesPersistedState {
  const sanitized = sanitizeGauntletSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  const challengeModeIds = sanitized.requiredChallengeId
    ? [sanitized.requiredChallengeId]
    : state.challengeModeIds;
  return {
    ...state,
    gauntletSession: sanitized,
    marathonQueue: null,
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
    habeasSession: null,
    quowarrantoSession: null,
    injunctionSession: null,
    contemptSession: null,
    sequestrationSession: null,
    receivershipSession: null,
    scenarioId,
    challengeModeIds,
    baseMode: state.baseMode === 'single' ? 'scenario' : state.baseMode,
  };
}

export function clearGauntletSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, gauntletSession: null };
}

export function getGauntletScenarioAtCursor(session: O10mGauntletSession | null | undefined): string | null {
  const g = sanitizeGauntletSession(session);
  if (!g || !g.active) return null;
  return g.scenarioIds[g.cursor] ?? null;
}

export function grantCatalogUnlockToken(
  state: O10mModesPersistedState,
  token: string,
): O10mModesPersistedState {
  if (!token.startsWith('o10m_unlock_')) return state;
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  if (tokens.includes(token)) return state;
  return { ...state, catalogUnlockTokens: [...tokens, token].slice(-O10M_UNLOCK_TOKEN_CAP) };
}

export function mergeCatalogUnlockTokens(a: string[], b: string[]): string[] {
  return [...new Set([...sanitizeCatalogUnlockTokens(a), ...sanitizeCatalogUnlockTokens(b)])].slice(
    0,
    O10M_UNLOCK_TOKEN_CAP,
  );
}

export function advanceGauntletSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeGauntletSession(state.gauntletSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;

  if (session.requiredChallengeId && !run.challengeModeIds.includes(session.requiredChallengeId)) {
    return state;
  }

  if (run.primaryVictory) {
    const atEnd = session.cursor >= session.scenarioIds.length - 1;
    if (!atEnd) {
      const cursor = session.cursor + 1;
      const nextScenario = session.scenarioIds[cursor] ?? null;
      return {
        ...state,
        gauntletSession: { ...session, cursor, failures: session.failures },
        scenarioId: nextScenario ?? state.scenarioId,
      };
    }

    const token = unlockTokenForGauntletId(session.gauntletId);
    let next: O10mModesPersistedState = {
      ...state,
      gauntletSession: { ...session, active: false },
    };
    if (token) next = grantCatalogUnlockToken(next, token);
    return next;
  }

  const failures = session.failures + 1;
  const livesRemaining = session.livesRemaining - 1;
  if (livesRemaining <= 0) {
    return {
      ...state,
      gauntletSession: { ...session, active: false, failures, livesRemaining: 0 },
    };
  }
  return {
    ...state,
    gauntletSession: { ...session, failures, livesRemaining },
  };
}

export function gauntletSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  livesRemaining: number | null;
  unlockTokenCount: number;
} {
  const session = sanitizeGauntletSession(state.gauntletSession);
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    livesRemaining: session?.active ? session.livesRemaining : null,
    unlockTokenCount: tokens.length,
  };
}
