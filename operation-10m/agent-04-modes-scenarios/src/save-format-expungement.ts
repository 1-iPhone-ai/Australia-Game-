import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mExpungementPhase,
  O10mExpungementSession,
} from './types.js';

export const O10M_EXPUNGEMENT_SCENARIO_CAP = 6;
export const O10M_EXPUNGEMENT_SEAL_SCORE_CAP = 980;
export const O10M_EXPUNGEMENT_SEAL_SCORE_MONEY_CAP = 1060;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mExpungementPhase>(['filing', 'review', 'expungement']);

export function unlockTokenForExpungementId(expungementId: string): string | null {
  if (!expungementId.startsWith('o10m_expungement_')) return null;
  return `o10m_unlock_${expungementId.slice('o10m_expungement_'.length)}`;
}

export function expungementPhaseForCursor(cursor: number, scenarioCount: number): O10mExpungementPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'expungement';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function expungementSealScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(126, Math.max(26, Math.floor(run.playerNetWorth / 146) + standingSlice));
}

export function sanitizeExpungementSession(raw: unknown): O10mExpungementSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const expungementId =
    typeof o.expungementId === 'string' && o.expungementId.startsWith('o10m_expungement_') ? o.expungementId : null;
  if (!expungementId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : expungementId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_EXPUNGEMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const sealScore = Math.min(
    O10M_EXPUNGEMENT_SEAL_SCORE_CAP,
    Math.max(0, Math.floor(num(o.sealScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mExpungementPhase)
      ? (phaseRaw as O10mExpungementPhase)
      : expungementPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    expungementId,
    label,
    scenarioIds,
    cursor,
    active,
    sealScore,
    phaseTag,
  };
}

export function createExpungementSession(params: {
  expungementId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mExpungementSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.expungementId.startsWith('o10m_expungement_')) {
    return { session: null, warnings: ['Expungement ids must start with o10m_expungement_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_EXPUNGEMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Expungement arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      expungementId: params.expungementId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      sealScore: 0,
      phaseTag: expungementPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachExpungementSessionToState(
  state: O10mModesPersistedState,
  session: O10mExpungementSession,
): O10mModesPersistedState {
  const sanitized = sanitizeExpungementSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    expungementSession: sanitized,
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
    exonerationSession: null,
    acquittalSession: null,
    commutationSession: null,
    probationSession: null,
    paroleSession: null,
    reprieveSession: null,
    amnestySession: null,
    pardonSession: null,
    clemencySession: null,
    appealSession: null,
    indictmentSession: null,
    tribunalSession: null,
    witnessSession: null,
    subjectSession: null,
    extractionSession: null,
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

export function clearExpungementSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, expungementSession: null };
}

export function getExpungementScenarioAtCursor(
  session: O10mExpungementSession | null | undefined,
): string | null {
  const expungement = sanitizeExpungementSession(session);
  if (!expungement || !expungement.active) return null;
  return expungement.scenarioIds[expungement.cursor] ?? null;
}

export function buildExpungementScenarioStartOverrides(
  session: O10mExpungementSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const expungement = sanitizeExpungementSession(session);
  if (!expungement) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_EXPUNGEMENT_SEAL_SCORE_MONEY_CAP,
    Math.floor(expungement.sealScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveExpungementId: expungement.expungementId,
      o10mActiveExpungementStep: expungement.cursor,
      o10mActiveExpungementPhase: expungement.phaseTag,
      o10mExpungementSealScore: expungement.sealScore,
    },
  };
}

export function advanceExpungementSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeExpungementSession(state.expungementSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const sealScore = Math.min(
    O10M_EXPUNGEMENT_SEAL_SCORE_CAP,
    session.sealScore + expungementSealScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      expungementSession: {
        ...session,
        cursor,
        sealScore,
        phaseTag: expungementPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForExpungementId(session.expungementId);
  let next: O10mModesPersistedState = {
    ...state,
    expungementSession: { ...session, active: false, sealScore, phaseTag: 'expungement' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function expungementSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  sealScore: number;
  phase: O10mExpungementPhase | null;
} {
  const session = sanitizeExpungementSession(state.expungementSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    sealScore: session?.sealScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
