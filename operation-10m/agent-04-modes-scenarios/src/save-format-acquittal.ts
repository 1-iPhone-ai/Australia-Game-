import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mAcquittalPhase,
  O10mAcquittalSession,
} from './types.js';

export const O10M_ACQUITTAL_SCENARIO_CAP = 6;
export const O10M_ACQUITTAL_VERDICT_SCORE_CAP = 940;
export const O10M_ACQUITTAL_VERDICT_SCORE_MONEY_CAP = 1020;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mAcquittalPhase>(['brief', 'review', 'acquittal']);

export function unlockTokenForAcquittalId(acquittalId: string): string | null {
  if (!acquittalId.startsWith('o10m_acquittal_')) return null;
  return `o10m_unlock_${acquittalId.slice('o10m_acquittal_'.length)}`;
}

export function acquittalPhaseForCursor(cursor: number, scenarioCount: number): O10mAcquittalPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'acquittal';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'brief';
}

export function acquittalVerdictScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(122, Math.max(24, Math.floor(run.playerNetWorth / 154) + standingSlice));
}

export function sanitizeAcquittalSession(raw: unknown): O10mAcquittalSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const acquittalId =
    typeof o.acquittalId === 'string' && o.acquittalId.startsWith('o10m_acquittal_') ? o.acquittalId : null;
  if (!acquittalId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : acquittalId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_ACQUITTAL_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const verdictScore = Math.min(
    O10M_ACQUITTAL_VERDICT_SCORE_CAP,
    Math.max(0, Math.floor(num(o.verdictScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mAcquittalPhase)
      ? (phaseRaw as O10mAcquittalPhase)
      : acquittalPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    acquittalId,
    label,
    scenarioIds,
    cursor,
    active,
    verdictScore,
    phaseTag,
  };
}

export function createAcquittalSession(params: {
  acquittalId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mAcquittalSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.acquittalId.startsWith('o10m_acquittal_')) {
    return { session: null, warnings: ['Acquittal ids must start with o10m_acquittal_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_ACQUITTAL_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Acquittal arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      acquittalId: params.acquittalId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      verdictScore: 0,
      phaseTag: acquittalPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachAcquittalSessionToState(
  state: O10mModesPersistedState,
  session: O10mAcquittalSession,
): O10mModesPersistedState {
  const sanitized = sanitizeAcquittalSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    acquittalSession: sanitized,
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

export function clearAcquittalSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, acquittalSession: null };
}

export function getAcquittalScenarioAtCursor(
  session: O10mAcquittalSession | null | undefined,
): string | null {
  const acquittal = sanitizeAcquittalSession(session);
  if (!acquittal || !acquittal.active) return null;
  return acquittal.scenarioIds[acquittal.cursor] ?? null;
}

export function buildAcquittalScenarioStartOverrides(
  session: O10mAcquittalSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const acquittal = sanitizeAcquittalSession(session);
  if (!acquittal) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_ACQUITTAL_VERDICT_SCORE_MONEY_CAP,
    Math.floor(acquittal.verdictScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveAcquittalId: acquittal.acquittalId,
      o10mActiveAcquittalStep: acquittal.cursor,
      o10mActiveAcquittalPhase: acquittal.phaseTag,
      o10mAcquittalVerdictScore: acquittal.verdictScore,
    },
  };
}

export function advanceAcquittalSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeAcquittalSession(state.acquittalSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const verdictScore = Math.min(
    O10M_ACQUITTAL_VERDICT_SCORE_CAP,
    session.verdictScore + acquittalVerdictScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      acquittalSession: {
        ...session,
        cursor,
        verdictScore,
        phaseTag: acquittalPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForAcquittalId(session.acquittalId);
  let next: O10mModesPersistedState = {
    ...state,
    acquittalSession: { ...session, active: false, verdictScore, phaseTag: 'acquittal' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function acquittalSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  verdictScore: number;
  phase: O10mAcquittalPhase | null;
} {
  const session = sanitizeAcquittalSession(state.acquittalSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    verdictScore: session?.verdictScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
