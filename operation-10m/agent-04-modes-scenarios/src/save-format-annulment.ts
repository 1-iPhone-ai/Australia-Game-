import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mAnnulmentPhase,
  O10mAnnulmentSession,
} from './types.js';

export const O10M_ANNULMENT_SCENARIO_CAP = 6;
export const O10M_ANNULMENT_SCORE_CAP = 1020;
export const O10M_ANNULMENT_SCORE_MONEY_CAP = 1100;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAnnulmentPhase>(['filing', 'review', 'annulment']);

export function unlockTokenForAnnulmentId(annulmentId: string): string | null {
  if (!annulmentId.startsWith('o10m_annulment_')) return null;
  return `o10m_unlock_${annulmentId.slice('o10m_annulment_'.length)}`;
}

export function annulmentPhaseForCursor(cursor: number, scenarioCount: number): O10mAnnulmentPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'annulment';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function annulmentScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(134, Math.max(30, Math.floor(run.playerNetWorth / 138) + standingSlice));
}

export function sanitizeAnnulmentSession(raw: unknown): O10mAnnulmentSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const annulmentId =
    typeof o.annulmentId === 'string' && o.annulmentId.startsWith('o10m_annulment_') ? o.annulmentId : null;
  if (!annulmentId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : annulmentId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ANNULMENT_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const annulmentScore = Math.min(
    O10M_ANNULMENT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.annulmentScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAnnulmentPhase)
      ? (phaseRaw as O10mAnnulmentPhase)
      : annulmentPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    annulmentId,
    label,
    scenarioIds,
    cursor,
    active,
    annulmentScore,
    phaseTag,
  };
}

export function createAnnulmentSession(params: {
  annulmentId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAnnulmentSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.annulmentId.startsWith('o10m_annulment_')) {
    return { session: null, warnings: ['Annulment ids must start with o10m_annulment_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_ANNULMENT_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Annulment arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      annulmentId: params.annulmentId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      annulmentScore: 0,
      phaseTag: annulmentPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAnnulmentSessionToState(
  state: O10mModesPersistedState,
  session: O10mAnnulmentSession,
): O10mModesPersistedState {
  const sanitized = sanitizeAnnulmentSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    annulmentSession: sanitized,
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
    reversalSession: null,
    remandSession: null,
    vacaturSession: null,
    expungementSession: null,
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

export function clearAnnulmentSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, annulmentSession: null };
}

export function getAnnulmentScenarioAtCursor(
  session: O10mAnnulmentSession | null | undefined,
): string | null {
  const annulment = sanitizeAnnulmentSession(session);
  if (!annulment || !annulment.active) return null;
  return annulment.scenarioIds[annulment.cursor] ?? null;
}

export function buildAnnulmentScenarioStartOverrides(
  session: O10mAnnulmentSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const annulment = sanitizeAnnulmentSession(session);
  if (!annulment) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_ANNULMENT_SCORE_MONEY_CAP,
    Math.floor(annulment.annulmentScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAnnulmentId: annulment.annulmentId,
      o10mActiveAnnulmentStep: annulment.cursor,
      o10mActiveAnnulmentPhase: annulment.phaseTag,
      o10mAnnulmentScore: annulment.annulmentScore,
    },
  };
}

export function advanceAnnulmentSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAnnulmentSession(state.annulmentSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const annulmentScore = Math.min(
    O10M_ANNULMENT_SCORE_CAP,
    session.annulmentScore + annulmentScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      annulmentSession: {
        ...session,
        cursor,
        annulmentScore,
        phaseTag: annulmentPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAnnulmentId(session.annulmentId);
  let next: O10mModesPersistedState = {
    ...state,
    annulmentSession: { ...session, active: false, annulmentScore, phaseTag: 'annulment' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function annulmentSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  annulmentScore: number;
  phase: O10mAnnulmentPhase | null;
} {
  const session = sanitizeAnnulmentSession(state.annulmentSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    annulmentScore: session?.annulmentScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
