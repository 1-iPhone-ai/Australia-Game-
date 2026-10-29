import { grantCatalogUnlockToken } from './save-format-gauntlet.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import type {
  O10mModesPersistedState,
  O10mRunSummary,
  O10mCertiorariPhase,
  O10mCertiorariSession,
} from './types.js';

export const O10M_CERTIORARI_SCENARIO_CAP = 6;
export const O10M_CERTIORARI_SCORE_CAP = 1070;
export const O10M_CERTIORARI_SCORE_MONEY_CAP = 1150;

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

const VALID_PHASES = new Set<O10mCertiorariPhase>(['filing', 'review', 'certiorari']);

export function unlockTokenForCertiorariId(certiorariId: string): string | null {
  if (!certiorariId.startsWith('o10m_certiorari_')) return null;
  return `o10m_unlock_${certiorariId.slice('o10m_certiorari_'.length)}`;
}

export function certiorariPhaseForCursor(cursor: number, scenarioCount: number): O10mCertiorariPhase {
  const total = Math.max(1, scenarioCount);
  const clamped = Math.min(Math.max(0, Math.floor(cursor)), total - 1);
  if (clamped >= total - 1) return 'certiorari';
  if (clamped >= Math.floor(total / 2)) return 'review';
  return 'filing';
}

export function certiorariScoreFromRun(run: O10mRunSummary): number {
  if (!run.primaryVictory) return 0;
  const standingSlice = Math.min(18, Math.floor(run.maxRegionalStanding / 4));
  return Math.min(140, Math.max(35, Math.floor(run.playerNetWorth / 128) + standingSlice));
}

export function sanitizeCertiorariSession(raw: unknown): O10mCertiorariSession | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const certiorariId =
    typeof o.certiorariId === 'string' && o.certiorariId.startsWith('o10m_certiorari_')
      ? o.certiorariId
      : null;
  if (!certiorariId) return null;
  const label =
    typeof o.label === 'string' && o.label.length > 0 ? o.label.slice(0, 72) : certiorariId;
  const scenarioIds = Array.isArray(o.scenarioIds)
    ? o.scenarioIds
        .filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_'))
        .filter(id => findO10mScenario(id))
        .slice(0, O10M_CERTIORARI_SCENARIO_CAP)
    : [];
  if (scenarioIds.length === 0) return null;
  const cursorRaw = Math.floor(num(o.cursor, 0));
  const cursor = Math.min(Math.max(0, cursorRaw), scenarioIds.length - 1);
  const certiorariScore = Math.min(
    O10M_CERTIORARI_SCORE_CAP,
    Math.max(0, Math.floor(num(o.certiorariScore, 0))),
  );
  const phaseRaw = o.phaseTag;
  const phaseTag =
    typeof phaseRaw === 'string' && VALID_PHASES.has(phaseRaw as O10mCertiorariPhase)
      ? (phaseRaw as O10mCertiorariPhase)
      : certiorariPhaseForCursor(cursor, scenarioIds.length);
  const active = o.active !== false;
  return {
    certiorariId,
    label,
    scenarioIds,
    cursor,
    active,
    certiorariScore,
    phaseTag,
  };
}

export function createCertiorariSession(params: {
  certiorariId: string;
  label: string;
  scenarioIds: string[];
}): { session: O10mCertiorariSession | null; warnings: string[] } {
  const warnings: string[] = [];
  if (!params.certiorariId.startsWith('o10m_certiorari_')) {
    return { session: null, warnings: ['Certiorari ids must start with o10m_certiorari_.'] };
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
  const trimmed = scenarioIds.slice(0, O10M_CERTIORARI_SCENARIO_CAP);
  if (trimmed.length === 0) {
    return {
      session: null,
      warnings: [...warnings, 'Certiorari arc requires at least one valid scenario.'],
    };
  }
  return {
    session: {
      certiorariId: params.certiorariId,
      label: params.label,
      scenarioIds: trimmed,
      cursor: 0,
      active: true,
      certiorariScore: 0,
      phaseTag: certiorariPhaseForCursor(0, trimmed.length),
    },
    warnings,
  };
}

export function attachCertiorariSessionToState(
  state: O10mModesPersistedState,
  session: O10mCertiorariSession,
): O10mModesPersistedState {
  const sanitized = sanitizeCertiorariSession(session);
  if (!sanitized) return state;
  const scenarioId = sanitized.scenarioIds[sanitized.cursor] ?? null;
  return {
    ...state,
    certiorariSession: sanitized,
    supersedeSession: null,
    quashSession: null,
    setAsideSession: null,
    reinstatementSession: null,
    annulmentSession: null,
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

export function clearCertiorariSession(state: O10mModesPersistedState): O10mModesPersistedState {
  return { ...state, certiorariSession: null };
}

export function getCertiorariScenarioAtCursor(
  session: O10mCertiorariSession | null | undefined,
): string | null {
  const certiorari = sanitizeCertiorariSession(session);
  if (!certiorari || !certiorari.active) return null;
  return certiorari.scenarioIds[certiorari.cursor] ?? null;
}

export function buildCertiorariScenarioStartOverrides(
  session: O10mCertiorariSession | null | undefined,
): {
  startingMoneyDelta: number;
  forcedSettingsPatch: Record<string, unknown>;
} {
  const certiorari = sanitizeCertiorariSession(session);
  if (!certiorari) {
    return { startingMoneyDelta: 0, forcedSettingsPatch: {} };
  }
  const moneyBoost = Math.min(
    O10M_CERTIORARI_SCORE_MONEY_CAP,
    Math.floor(certiorari.certiorariScore * 0.87),
  );
  return {
    startingMoneyDelta: moneyBoost,
    forcedSettingsPatch: {
      o10mActiveCertiorariId: certiorari.certiorariId,
      o10mActiveCertiorariStep: certiorari.cursor,
      o10mActiveCertiorariPhase: certiorari.phaseTag,
      o10mCertiorariScore: certiorari.certiorariScore,
    },
  };
}

export function advanceCertiorariSessionAfterRun(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
): O10mModesPersistedState {
  const session = sanitizeCertiorariSession(state.certiorariSession);
  if (!session || !session.active) return state;
  const atCursor = session.scenarioIds[session.cursor];
  if (atCursor !== run.scenarioId) return state;
  if (!run.primaryVictory) return state;

  const certiorariScore = Math.min(
    O10M_CERTIORARI_SCORE_CAP,
    session.certiorariScore + certiorariScoreFromRun(run),
  );
  const atEnd = session.cursor >= session.scenarioIds.length - 1;
  if (!atEnd) {
    const cursor = session.cursor + 1;
    const nextScenario = session.scenarioIds[cursor] ?? null;
    return {
      ...state,
      certiorariSession: {
        ...session,
        cursor,
        certiorariScore,
        phaseTag: certiorariPhaseForCursor(cursor, session.scenarioIds.length),
      },
      scenarioId: nextScenario ?? state.scenarioId,
    };
  }

  const token = unlockTokenForCertiorariId(session.certiorariId);
  let next: O10mModesPersistedState = {
    ...state,
    certiorariSession: { ...session, active: false, certiorariScore, phaseTag: 'certiorari' },
  };
  if (token) next = grantCatalogUnlockToken(next, token);
  return next;
}

export function certiorariSessionSummary(state: O10mModesPersistedState): {
  active: boolean;
  cursor: number | null;
  certiorariScore: number;
  phase: O10mCertiorariPhase | null;
} {
  const session = sanitizeCertiorariSession(state.certiorariSession);
  return {
    active: session?.active === true,
    cursor: session?.active ? session.cursor : null,
    certiorariScore: session?.certiorariScore ?? 0,
    phase: session?.active ? session.phaseTag : null,
  };
}
