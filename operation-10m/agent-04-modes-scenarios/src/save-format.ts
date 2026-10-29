import { listO10mChallengeModeIds } from './challenge-modes.js';
import {
  sanitizeCampaignSlots,
  sanitizeChallengeStreak,
  createEmptyChallengeStreak,
} from './save-format-campaign.js';
import { sanitizeMarathonQueue, sanitizeReplayLedger } from './save-format-marathon.js';
import { sanitizeCatalogUnlockTokens, sanitizeGauntletSession } from './save-format-gauntlet.js';
import { sanitizeRelaySession } from './save-format-relay.js';
import { sanitizeCircuitSession } from './save-format-circuit.js';
import { sanitizeExpeditionSession } from './save-format-expedition.js';
import { sanitizeOdysseySession } from './save-format-odyssey.js';
import { sanitizePilgrimageSession } from './save-format-pilgrimage.js';
import { sanitizeCaravanSession } from './save-format-caravan.js';
import { sanitizeVoyageSession } from './save-format-voyage.js';
import { sanitizeSiegeSession } from './save-format-siege.js';
import { sanitizeConvoySession } from './save-format-convoy.js';
import { sanitizeEscortSession } from './save-format-escort.js';
import { sanitizeExtractionSession } from './save-format-extraction.js';
import { sanitizeSubjectSession } from './save-format-subject.js';
import { sanitizeWitnessSession } from './save-format-witness.js';
import { sanitizeTribunalSession } from './save-format-tribunal.js';
import { sanitizeIndictmentSession } from './save-format-indictment.js';
import { sanitizeAppealSession } from './save-format-appeal.js';
import { sanitizeClemencySession } from './save-format-clemency.js';
import { sanitizePardonSession } from './save-format-pardon.js';
import { sanitizeAmnestySession } from './save-format-amnesty.js';
import { sanitizeReprieveSession } from './save-format-reprieve.js';
import { sanitizeParoleSession } from './save-format-parole.js';
import { sanitizeProbationSession } from './save-format-probation.js';
import { sanitizeCommutationSession } from './save-format-commutation.js';
import { sanitizeAcquittalSession } from './save-format-acquittal.js';
import { sanitizeObjectiveProgress } from './save-format-objective-sync.js';
import { initializeChainProgress, validateChainStepSelection } from './scenario-chains.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import { resolveSandboxKnobValues } from './sandbox-knobs.js';
import type {
  GameModeSelection,
  ModeInteractionRequest,
  O10mChainProgress,
  O10mChallengeModeId,
  O10mMilestoneProgress,
  O10mModesPersistedState,
  O10mPersistedRunRecord,
  O10mRunSummary,
  O10mSandboxKnobKey,
  O10mSaveFormatValidation,
} from './types.js';
import { isCanonicalGameModeSelection } from './canonical-modes.js';

export const O10M_MODES_SAVE_SCHEMA_VERSION = 30;
export const O10M_MODES_GAME_STATE_KEY = 'o10mModesProgress' as const;
export const O10M_MODES_RUN_LOG_CAP = 24;

const VALID_CHALLENGES = new Set(listO10mChallengeModeIds());

function num(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback;
}

function str(v: unknown): string | null {
  return typeof v === 'string' && v.length > 0 ? v : null;
}

function sanitizeChallengeIds(raw: unknown): O10mChallengeModeId[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((id): id is O10mChallengeModeId => typeof id === 'string' && VALID_CHALLENGES.has(id as O10mChallengeModeId));
}

function sanitizeChainProgress(raw: unknown): O10mChainProgress | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const chainId = str(o.chainId);
  if (!chainId) return null;
  const completedStepIndexes = Array.isArray(o.completedStepIndexes)
    ? o.completedStepIndexes.filter((n): n is number => typeof n === 'number').slice(0, 12)
    : [];
  const activeStepIndex = num(o.activeStepIndex, 0);
  const chainCompleted = o.chainCompleted === true;
  const carry = (o.accumulatedCarry || {}) as O10mChainProgress['accumulatedCarry'];
  return {
    chainId,
    completedStepIndexes,
    activeStepIndex,
    chainCompleted,
    accumulatedCarry: {
      startingMoneyDelta: num(carry?.startingMoneyDelta, 0) || undefined,
      standingDelta:
        carry?.standingDelta && typeof carry.standingDelta === 'object'
          ? (carry.standingDelta as Record<string, number>)
          : undefined,
      forcedSettingsPatch:
        carry?.forcedSettingsPatch && typeof carry.forcedSettingsPatch === 'object'
          ? (carry.forcedSettingsPatch as Record<string, unknown>)
          : undefined,
    },
  };
}

function sanitizeMilestones(raw: unknown): O10mMilestoneProgress[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(m => m && typeof m === 'object')
    .map(m => {
      const row = m as Record<string, unknown>;
      return {
        milestoneId: String(row.milestoneId || ''),
        unlocked: row.unlocked === true,
        unlockedAtRunCount: num(row.unlockedAtRunCount, 0),
      };
    })
    .filter(m => m.milestoneId.startsWith('o10m_'));
}

function sanitizeRunLog(raw: unknown): O10mPersistedRunRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(-O10M_MODES_RUN_LOG_CAP)
    .filter(r => r && typeof r === 'object')
    .map(r => {
      const row = r as Record<string, unknown>;
      const baseMode = row.baseMode;
      return {
        scenarioId: String(row.scenarioId || ''),
        baseMode: (isCanonicalGameModeSelection(baseMode) ? baseMode : 'scenario') as GameModeSelection,
        primaryVictory: row.primaryVictory === true,
        chainCompleted: row.chainCompleted === true,
        day: num(row.day, 1),
        recordedAtTurn: num(row.recordedAtTurn, 0),
      };
    })
    .filter(r => r.scenarioId.startsWith('o10m_'));
}

export function createEmptyO10mModesPersistedState(baseMode: GameModeSelection = 'scenario'): O10mModesPersistedState {
  return {
    schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
    updatedAtTurn: 0,
    baseMode,
    scenarioId: null,
    chainProgress: null,
    challengeModeIds: [],
    sandboxProfileId: null,
    sandboxKnobs: {},
    milestones: [],
    completedChainIds: [],
    recentRuns: [],
    objectiveProgress: [],
    campaignSlots: [],
    activeCampaignSlotId: null,
    challengeStreak: createEmptyChallengeStreak(),
    marathonQueue: null,
    replayLedger: [],
    gauntletSession: null,
    catalogUnlockTokens: [],
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
  };
}

export function migrateO10mModesPersistedState(raw: unknown): O10mModesPersistedState {
  const base = createEmptyO10mModesPersistedState();
  if (!raw || typeof raw !== 'object') return base;
  const o = raw as Record<string, unknown>;
  const v1 = num(o.schemaVersion, 1);
  const merged = sanitizeO10mModesPersistedState({ ...o, schemaVersion: Math.max(v1, 1) }) ?? base;
  if (merged.schemaVersion < O10M_MODES_SAVE_SCHEMA_VERSION) {
    const upgraded: O10mModesPersistedState = {
      ...merged,
      schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
      recentRuns: merged.recentRuns ?? [],
      completedChainIds: merged.completedChainIds ?? [],
      saveKind: merged.saveKind ?? 'manual',
      updatedAtDay: merged.updatedAtDay ?? 0,
      objectiveProgress: merged.objectiveProgress ?? [],
      campaignSlots: merged.campaignSlots ?? [],
      activeCampaignSlotId: merged.activeCampaignSlotId ?? null,
      challengeStreak: merged.challengeStreak ?? createEmptyChallengeStreak(),
      marathonQueue: merged.marathonQueue ?? null,
      replayLedger: merged.replayLedger ?? [],
      gauntletSession: merged.gauntletSession ?? null,
      catalogUnlockTokens: merged.catalogUnlockTokens ?? [],
      relaySession: merged.relaySession ?? null,
      circuitSession: merged.circuitSession ?? null,
      expeditionSession: merged.expeditionSession ?? null,
      odysseySession: merged.odysseySession ?? null,
      pilgrimageSession: merged.pilgrimageSession ?? null,
      caravanSession: merged.caravanSession ?? null,
      voyageSession: merged.voyageSession ?? null,
      siegeSession: merged.siegeSession ?? null,
      convoySession: merged.convoySession ?? null,
      escortSession: merged.escortSession ?? null,
      extractionSession: merged.extractionSession ?? null,
      subjectSession: merged.subjectSession ?? null,
      witnessSession: merged.witnessSession ?? null,
      tribunalSession: merged.tribunalSession ?? null,
      indictmentSession: merged.indictmentSession ?? null,
      appealSession: merged.appealSession ?? null,
      clemencySession: merged.clemencySession ?? null,
      pardonSession: merged.pardonSession ?? null,
      amnestySession: merged.amnestySession ?? null,
      reprieveSession: merged.reprieveSession ?? null,
      paroleSession: merged.paroleSession ?? null,
      probationSession: merged.probationSession ?? null,
      commutationSession: merged.commutationSession ?? null,
      acquittalSession: merged.acquittalSession ?? null,
    };
    return upgraded;
  }
  return merged;
}

export function sanitizeO10mModesPersistedState(raw: unknown): O10mModesPersistedState | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const baseModeRaw = o.baseMode;
  const baseMode = isCanonicalGameModeSelection(baseModeRaw) ? baseModeRaw : 'scenario';
  const sandboxKnobsRaw = (o.sandboxKnobs && typeof o.sandboxKnobs === 'object' ? o.sandboxKnobs : {}) as Partial<
    Record<O10mSandboxKnobKey, number | string>
  >;
  const knobResolved = resolveSandboxKnobValues(str(o.sandboxProfileId), sandboxKnobsRaw);

  const saveKindRaw = o.saveKind;
  const saveKind =
    saveKindRaw === 'autosave' || saveKindRaw === 'manual' || saveKindRaw === 'checkpoint' ? saveKindRaw : 'manual';

  return {
    schemaVersion: num(o.schemaVersion, O10M_MODES_SAVE_SCHEMA_VERSION),
    updatedAtTurn: num(o.updatedAtTurn, 0),
    updatedAtDay: num(o.updatedAtDay, 0) || undefined,
    saveKind,
    sessionId: str(o.sessionId) ?? undefined,
    integrityFingerprint: str(o.integrityFingerprint) ?? undefined,
    baseMode,
    scenarioId: str(o.scenarioId),
    chainProgress: sanitizeChainProgress(o.chainProgress),
    challengeModeIds: sanitizeChallengeIds(o.challengeModeIds),
    sandboxProfileId: str(o.sandboxProfileId),
    sandboxKnobs: knobResolved.ok ? knobResolved.knobs : {},
    milestones: sanitizeMilestones(o.milestones),
    completedChainIds: Array.isArray(o.completedChainIds)
      ? o.completedChainIds.filter((id): id is string => typeof id === 'string' && id.startsWith('o10m_chain_'))
      : [],
    recentRuns: sanitizeRunLog(o.recentRuns),
    objectiveProgress: sanitizeObjectiveProgress(o.objectiveProgress),
    campaignSlots: sanitizeCampaignSlots(o.campaignSlots),
    activeCampaignSlotId:
      typeof o.activeCampaignSlotId === 'string' && o.activeCampaignSlotId.startsWith('o10m_slot_')
        ? o.activeCampaignSlotId
        : null,
    challengeStreak: sanitizeChallengeStreak(o.challengeStreak),
    marathonQueue: sanitizeMarathonQueue(o.marathonQueue),
    replayLedger: sanitizeReplayLedger(o.replayLedger),
    gauntletSession: sanitizeGauntletSession(o.gauntletSession),
    catalogUnlockTokens: sanitizeCatalogUnlockTokens(o.catalogUnlockTokens),
    relaySession: sanitizeRelaySession(o.relaySession),
    circuitSession: sanitizeCircuitSession(o.circuitSession),
    expeditionSession: sanitizeExpeditionSession(o.expeditionSession),
    odysseySession: sanitizeOdysseySession(o.odysseySession),
    pilgrimageSession: sanitizePilgrimageSession(o.pilgrimageSession),
    caravanSession: sanitizeCaravanSession(o.caravanSession),
    voyageSession: sanitizeVoyageSession(o.voyageSession),
    siegeSession: sanitizeSiegeSession(o.siegeSession),
    convoySession: sanitizeConvoySession(o.convoySession),
    escortSession: sanitizeEscortSession(o.escortSession),
    extractionSession: sanitizeExtractionSession(o.extractionSession),
    subjectSession: sanitizeSubjectSession(o.subjectSession),
    witnessSession: sanitizeWitnessSession(o.witnessSession),
    tribunalSession: sanitizeTribunalSession(o.tribunalSession),
    indictmentSession: sanitizeIndictmentSession(o.indictmentSession),
    appealSession: sanitizeAppealSession(o.appealSession),
    clemencySession: sanitizeClemencySession(o.clemencySession),
    pardonSession: sanitizePardonSession(o.pardonSession),
    amnestySession: sanitizeAmnestySession(o.amnestySession),
    reprieveSession: sanitizeReprieveSession(o.reprieveSession),
    paroleSession: sanitizeParoleSession(o.paroleSession),
    probationSession: sanitizeProbationSession(o.probationSession),
    commutationSession: sanitizeCommutationSession(o.commutationSession),
    acquittalSession: sanitizeAcquittalSession(o.acquittalSession),
  };
}

export function validateO10mModesPersistedForLoad(state: O10mModesPersistedState): O10mSaveFormatValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (state.schemaVersion > O10M_MODES_SAVE_SCHEMA_VERSION) {
    warnings.push(`Save schema ${state.schemaVersion} is newer than module ${O10M_MODES_SAVE_SCHEMA_VERSION}.`);
  }

  if (state.scenarioId && !findO10mScenario(state.scenarioId)) {
    errors.push(`Unknown scenario id in save: ${state.scenarioId}`);
  }

  if (state.chainProgress) {
    if (state.scenarioId) {
      const check = validateChainStepSelection(
        state.chainProgress.chainId,
        state.chainProgress,
        state.scenarioId,
        state.chainProgress.activeStepIndex,
      );
      if (!check.ok && !state.chainProgress.chainCompleted) {
        warnings.push(...check.errors);
      }
    }
    if (state.chainProgress.chainCompleted && !state.completedChainIds.includes(state.chainProgress.chainId)) {
      warnings.push('Chain marked complete but missing from completedChainIds history.');
    }
  }

  if (state.challengeModeIds.length > 3) {
    errors.push('Save contains more than three challenge overlays.');
  }

  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  if (state.marathonQueue && !marathon) {
    warnings.push('Marathon queue failed sanitization; planner will ignore it.');
  } else if (marathon && marathon.cursor >= marathon.scenarioIds.length) {
    warnings.push('Marathon cursor out of range; clamp on next sanitize.');
  }

  const gauntlet = sanitizeGauntletSession(state.gauntletSession);
  if (state.gauntletSession && !gauntlet) {
    warnings.push('Gauntlet session failed sanitization; planner will ignore it.');
  } else if (gauntlet && gauntlet.cursor >= gauntlet.scenarioIds.length) {
    warnings.push('Gauntlet cursor out of range; clamp on next sanitize.');
  }

  const relay = sanitizeRelaySession(state.relaySession);
  if (state.relaySession && !relay) {
    warnings.push('Relay session failed sanitization; planner will ignore it.');
  } else if (relay && relay.cursor >= relay.scenarioIds.length) {
    warnings.push('Relay cursor out of range; clamp on next sanitize.');
  }

  const circuit = sanitizeCircuitSession(state.circuitSession);
  if (state.circuitSession && !circuit) {
    warnings.push('Circuit session failed sanitization; planner will ignore it.');
  } else if (circuit && circuit.cursor >= circuit.scenarioIds.length) {
    warnings.push('Circuit cursor out of range; clamp on next sanitize.');
  }

  const expedition = sanitizeExpeditionSession(state.expeditionSession);
  if (state.expeditionSession && !expedition) {
    warnings.push('Expedition session failed sanitization; planner will ignore it.');
  } else if (expedition && expedition.cursor >= expedition.scenarioIds.length) {
    warnings.push('Expedition cursor out of range; clamp on next sanitize.');
  }

  const odyssey = sanitizeOdysseySession(state.odysseySession);
  if (state.odysseySession && !odyssey) {
    warnings.push('Odyssey session failed sanitization; planner will ignore it.');
  } else if (odyssey && odyssey.cursor >= odyssey.scenarioIds.length) {
    warnings.push('Odyssey cursor out of range; clamp on next sanitize.');
  }

  const pilgrimage = sanitizePilgrimageSession(state.pilgrimageSession);
  if (state.pilgrimageSession && !pilgrimage) {
    warnings.push('Pilgrimage session failed sanitization; planner will ignore it.');
  } else if (pilgrimage && pilgrimage.cursor >= pilgrimage.scenarioIds.length) {
    warnings.push('Pilgrimage cursor out of range; clamp on next sanitize.');
  }

  const caravan = sanitizeCaravanSession(state.caravanSession);
  if (state.caravanSession && !caravan) {
    warnings.push('Caravan session failed sanitization; planner will ignore it.');
  } else if (caravan && caravan.cursor >= caravan.scenarioIds.length) {
    warnings.push('Caravan cursor out of range; clamp on next sanitize.');
  }

  const voyage = sanitizeVoyageSession(state.voyageSession);
  if (state.voyageSession && !voyage) {
    warnings.push('Voyage session failed sanitization; planner will ignore it.');
  } else if (voyage && voyage.cursor >= voyage.scenarioIds.length) {
    warnings.push('Voyage cursor out of range; clamp on next sanitize.');
  }

  const siege = sanitizeSiegeSession(state.siegeSession);
  if (state.siegeSession && !siege) {
    warnings.push('Siege session failed sanitization; planner will ignore it.');
  } else if (siege && siege.cursor >= siege.scenarioIds.length) {
    warnings.push('Siege cursor out of range; clamp on next sanitize.');
  }

  const convoy = sanitizeConvoySession(state.convoySession);
  if (state.convoySession && !convoy) {
    warnings.push('Convoy session failed sanitization; planner will ignore it.');
  } else if (convoy && convoy.cursor >= convoy.scenarioIds.length) {
    warnings.push('Convoy cursor out of range; clamp on next sanitize.');
  }

  const escort = sanitizeEscortSession(state.escortSession);
  if (state.escortSession && !escort) {
    warnings.push('Escort session failed sanitization; planner will ignore it.');
  } else if (escort && escort.cursor >= escort.scenarioIds.length) {
    warnings.push('Escort cursor out of range; clamp on next sanitize.');
  }

  const extraction = sanitizeExtractionSession(state.extractionSession);
  if (state.extractionSession && !extraction) {
    warnings.push('Extraction session failed sanitization; planner will ignore it.');
  } else if (extraction && extraction.cursor >= extraction.scenarioIds.length) {
    warnings.push('Extraction cursor out of range; clamp on next sanitize.');
  }

  const subject = sanitizeSubjectSession(state.subjectSession);
  if (state.subjectSession && !subject) {
    warnings.push('Subject session failed sanitization; planner will ignore it.');
  } else if (subject && subject.cursor >= subject.scenarioIds.length) {
    warnings.push('Subject cursor out of range; clamp on next sanitize.');
  }

  const witness = sanitizeWitnessSession(state.witnessSession);
  if (state.witnessSession && !witness) {
    warnings.push('Witness session failed sanitization; planner will ignore it.');
  } else if (witness && witness.cursor >= witness.scenarioIds.length) {
    warnings.push('Witness cursor out of range; clamp on next sanitize.');
  }

  const tribunal = sanitizeTribunalSession(state.tribunalSession);
  if (state.tribunalSession && !tribunal) {
    warnings.push('Tribunal session failed sanitization; planner will ignore it.');
  } else if (tribunal && tribunal.cursor >= tribunal.scenarioIds.length) {
    warnings.push('Tribunal cursor out of range; clamp on next sanitize.');
  }

  const indictment = sanitizeIndictmentSession(state.indictmentSession);
  if (state.indictmentSession && !indictment) {
    warnings.push('Indictment session failed sanitization; planner will ignore it.');
  } else if (indictment && indictment.cursor >= indictment.scenarioIds.length) {
    warnings.push('Indictment cursor out of range; clamp on next sanitize.');
  }

  const appeal = sanitizeAppealSession(state.appealSession);
  if (state.appealSession && !appeal) {
    warnings.push('Appeal session failed sanitization; planner will ignore it.');
  } else if (appeal && appeal.cursor >= appeal.scenarioIds.length) {
    warnings.push('Appeal cursor out of range; clamp on next sanitize.');
  }

  const clemency = sanitizeClemencySession(state.clemencySession);
  if (state.clemencySession && !clemency) {
    warnings.push('Clemency session failed sanitization; planner will ignore it.');
  } else if (clemency && clemency.cursor >= clemency.scenarioIds.length) {
    warnings.push('Clemency cursor out of range; clamp on next sanitize.');
  }

  const pardon = sanitizePardonSession(state.pardonSession);
  if (state.pardonSession && !pardon) {
    warnings.push('Pardon session failed sanitization; planner will ignore it.');
  } else if (pardon && pardon.cursor >= pardon.scenarioIds.length) {
    warnings.push('Pardon cursor out of range; clamp on next sanitize.');
  }

  const amnesty = sanitizeAmnestySession(state.amnestySession);
  if (state.amnestySession && !amnesty) {
    warnings.push('Amnesty session failed sanitization; planner will ignore it.');
  } else if (amnesty && amnesty.cursor >= amnesty.scenarioIds.length) {
    warnings.push('Amnesty cursor out of range; clamp on next sanitize.');
  }

  const reprieve = sanitizeReprieveSession(state.reprieveSession);
  if (state.reprieveSession && !reprieve) {
    warnings.push('Reprieve session failed sanitization; planner will ignore it.');
  } else if (reprieve && reprieve.cursor >= reprieve.scenarioIds.length) {
    warnings.push('Reprieve cursor out of range; clamp on next sanitize.');
  }

  const parole = sanitizeParoleSession(state.paroleSession);
  if (state.paroleSession && !parole) {
    warnings.push('Parole session failed sanitization; planner will ignore it.');
  } else if (parole && parole.cursor >= parole.scenarioIds.length) {
    warnings.push('Parole cursor out of range; clamp on next sanitize.');
  }

  const probation = sanitizeProbationSession(state.probationSession);
  if (state.probationSession && !probation) {
    warnings.push('Probation session failed sanitization; planner will ignore it.');
  } else if (probation && probation.cursor >= probation.scenarioIds.length) {
    warnings.push('Probation cursor out of range; clamp on next sanitize.');
  }

  const commutation = sanitizeCommutationSession(state.commutationSession);
  if (state.commutationSession && !commutation) {
    warnings.push('Commutation session failed sanitization; planner will ignore it.');
  } else if (commutation && commutation.cursor >= commutation.scenarioIds.length) {
    warnings.push('Commutation cursor out of range; clamp on next sanitize.');
  }

  const acquittal = sanitizeAcquittalSession(state.acquittalSession);
  if (state.acquittalSession && !acquittal) {
    warnings.push('Acquittal session failed sanitization; planner will ignore it.');
  } else if (acquittal && acquittal.cursor >= acquittal.scenarioIds.length) {
    warnings.push('Acquittal cursor out of range; clamp on next sanitize.');
  }

  return { ok: errors.length === 0, errors, warnings };
}

export function appendRunToPersistedLog(
  state: O10mModesPersistedState,
  run: O10mRunSummary,
  turn: number,
): O10mModesPersistedState {
  const entry: O10mPersistedRunRecord = {
    scenarioId: run.scenarioId || '',
    baseMode: run.baseMode,
    primaryVictory: run.primaryVictory,
    chainCompleted: run.chainCompleted === true,
    day: run.day,
    recordedAtTurn: turn,
  };
  const recentRuns = [...state.recentRuns, entry].filter(r => r.scenarioId).slice(-O10M_MODES_RUN_LOG_CAP);
  const completedChainIds = [...state.completedChainIds];
  if (run.chainCompleted && run.scenarioId) {
    const chainId = state.chainProgress?.chainId;
    if (chainId && !completedChainIds.includes(chainId)) completedChainIds.push(chainId);
  }
  return {
    ...state,
    updatedAtTurn: turn,
    recentRuns,
    completedChainIds,
  };
}

export function buildO10mModesPersistedSnapshot(params: {
  turn: number;
  baseMode: GameModeSelection;
  scenarioId: string | null;
  chainProgress: O10mChainProgress | null;
  challengeModeIds: O10mChallengeModeId[];
  sandboxProfileId?: string | null;
  sandboxKnobs?: Partial<Record<O10mSandboxKnobKey, number | string>>;
  milestones: O10mMilestoneProgress[];
  previous?: O10mModesPersistedState | null;
}): O10mModesPersistedState {
  const prev = params.previous ?? createEmptyO10mModesPersistedState(params.baseMode);
  return {
    ...prev,
    schemaVersion: O10M_MODES_SAVE_SCHEMA_VERSION,
    updatedAtTurn: params.turn,
    baseMode: params.baseMode,
    scenarioId: params.scenarioId,
    chainProgress: params.chainProgress,
    challengeModeIds: params.challengeModeIds.slice(0, 3),
    sandboxProfileId: params.sandboxProfileId ?? null,
    sandboxKnobs: params.sandboxKnobs ?? prev.sandboxKnobs,
    milestones: params.milestones,
  };
}

export function restoreModeInteractionFromPersisted(state: O10mModesPersistedState): ModeInteractionRequest {
  return {
    baseMode: state.baseMode,
    scenarioId: state.scenarioId,
    challengeModeIds: state.challengeModeIds,
    scenarioModeEnabled: state.baseMode === 'scenario' || Boolean(state.scenarioId),
    sandboxProfileId: state.sandboxProfileId,
    sandboxKnobs: state.sandboxKnobs,
    chainId: state.chainProgress?.chainId ?? null,
    chainStepIndex: state.chainProgress?.activeStepIndex,
    chainProgress: state.chainProgress,
  };
}

export function attachO10mModesProgressToGameState<T extends Record<string, unknown>>(
  gameState: T,
  persisted: O10mModesPersistedState,
): T & { o10mModesProgress: O10mModesPersistedState } {
  return { ...gameState, [O10M_MODES_GAME_STATE_KEY]: persisted };
}

export function readO10mModesProgressFromGameState(gameState: unknown): O10mModesPersistedState | null {
  if (!gameState || typeof gameState !== 'object') return null;
  const raw = (gameState as Record<string, unknown>)[O10M_MODES_GAME_STATE_KEY];
  return migrateO10mModesPersistedState(raw);
}

export function ensureChainProgressOnLoad(
  state: O10mModesPersistedState,
  chainId: string,
): O10mModesPersistedState {
  if (state.chainProgress?.chainId === chainId) return state;
  const fresh = initializeChainProgress(chainId);
  return fresh ? { ...state, chainProgress: fresh } : state;
}
