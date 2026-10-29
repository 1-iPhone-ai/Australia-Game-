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
import { sanitizeExonerationSession } from './save-format-exoneration.js';
import { sanitizeExpungementSession } from './save-format-expungement.js';
import { sanitizeVacaturSession } from './save-format-vacatur.js';
import { sanitizeRemandSession } from './save-format-remand.js';
import { sanitizeReversalSession } from './save-format-reversal.js';
import { sanitizeAnnulmentSession } from './save-format-annulment.js';
import { sanitizeReinstatementSession } from './save-format-reinstatement.js';
import { sanitizeSetAsideSession } from './save-format-setaside.js';
import { sanitizeQuashSession } from './save-format-quash.js';
import { sanitizeSupersedeSession } from './save-format-supersede.js';
import { sanitizeCertiorariSession } from './save-format-certiorari.js';
import { sanitizeMandamusSession } from './save-format-mandamus.js';
import { sanitizeProhibitionSession } from './save-format-prohibition.js';
import { sanitizeHabeasSession } from './save-format-habeas.js';
import { sanitizeQuowarrantoSession } from './save-format-quowarranto.js';
import { sanitizeInjunctionSession } from './save-format-injunction.js';
import { sanitizeContemptSession } from './save-format-contempt.js';
import { sanitizeSequestrationSession } from './save-format-sequestration.js';
import { sanitizeReceivershipSession } from './save-format-receivership.js';
import { sanitizeLiquidationSession } from './save-format-liquidation.js';
import { sanitizeDissolutionSession } from './save-format-dissolution.js';
import { sanitizeLiquidationDepthSession } from './save-format-liquidation-depth.js';
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

export const O10M_MODES_SAVE_SCHEMA_VERSION = 53;
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
    liquidationSession: null,
    liquidationDepthSession: null,
    dissolutionSession: null,
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
      exonerationSession: merged.exonerationSession ?? null,
      expungementSession: merged.expungementSession ?? null,
      vacaturSession: merged.vacaturSession ?? null,
      remandSession: merged.remandSession ?? null,
      reversalSession: merged.reversalSession ?? null,
      annulmentSession: merged.annulmentSession ?? null,
      reinstatementSession: merged.reinstatementSession ?? null,
      setAsideSession: merged.setAsideSession ?? null,
      quashSession: merged.quashSession ?? null,
      supersedeSession: merged.supersedeSession ?? null,
      certiorariSession: merged.certiorariSession ?? null,
      mandamusSession: merged.mandamusSession ?? null,
      prohibitionSession: merged.prohibitionSession ?? null,
      habeasSession: merged.habeasSession ?? null,
      quowarrantoSession: merged.quowarrantoSession ?? null,
      injunctionSession: merged.injunctionSession ?? null,
      contemptSession: merged.contemptSession ?? null,
      sequestrationSession: merged.sequestrationSession ?? null,
      receivershipSession: merged.receivershipSession ?? null,
      liquidationSession: merged.liquidationSession ?? null,
      liquidationDepthSession: merged.liquidationDepthSession ?? null,
      dissolutionSession: merged.dissolutionSession ?? null,
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
    exonerationSession: sanitizeExonerationSession(o.exonerationSession),
    expungementSession: sanitizeExpungementSession(o.expungementSession),
    vacaturSession: sanitizeVacaturSession(o.vacaturSession),
    remandSession: sanitizeRemandSession(o.remandSession),
    reversalSession: sanitizeReversalSession(o.reversalSession),
    annulmentSession: sanitizeAnnulmentSession(o.annulmentSession),
    reinstatementSession: sanitizeReinstatementSession(o.reinstatementSession),
    setAsideSession: sanitizeSetAsideSession(o.setAsideSession),
    quashSession: sanitizeQuashSession(o.quashSession),
    supersedeSession: sanitizeSupersedeSession(o.supersedeSession),
    certiorariSession: sanitizeCertiorariSession(o.certiorariSession),
    mandamusSession: sanitizeMandamusSession(o.mandamusSession),
    prohibitionSession: sanitizeProhibitionSession(o.prohibitionSession),
    habeasSession: sanitizeHabeasSession(o.habeasSession),
    quowarrantoSession: sanitizeQuowarrantoSession(o.quowarrantoSession),
    injunctionSession: sanitizeInjunctionSession(o.injunctionSession),
    contemptSession: sanitizeContemptSession(o.contemptSession),
    sequestrationSession: sanitizeSequestrationSession(o.sequestrationSession),
    receivershipSession: sanitizeReceivershipSession(o.receivershipSession),
    liquidationSession: sanitizeLiquidationSession(o.liquidationSession),
    liquidationDepthSession: sanitizeLiquidationDepthSession(o.liquidationDepthSession),
    dissolutionSession: sanitizeDissolutionSession(o.dissolutionSession),
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

  const exoneration = sanitizeExonerationSession(state.exonerationSession);
  if (state.exonerationSession && !exoneration) {
    warnings.push('Exoneration session failed sanitization; planner will ignore it.');
  } else if (exoneration && exoneration.cursor >= exoneration.scenarioIds.length) {
    warnings.push('Exoneration cursor out of range; clamp on next sanitize.');
  }

  const expungement = sanitizeExpungementSession(state.expungementSession);
  if (state.expungementSession && !expungement) {
    warnings.push('Expungement session failed sanitization; planner will ignore it.');
  } else if (expungement && expungement.cursor >= expungement.scenarioIds.length) {
    warnings.push('Expungement cursor out of range; clamp on next sanitize.');
  }

  const vacatur = sanitizeVacaturSession(state.vacaturSession);
  if (state.vacaturSession && !vacatur) {
    warnings.push('Vacatur session failed sanitization; planner will ignore it.');
  } else if (vacatur && vacatur.cursor >= vacatur.scenarioIds.length) {
    warnings.push('Vacatur cursor out of range; clamp on next sanitize.');
  }

  const remand = sanitizeRemandSession(state.remandSession);
  if (state.remandSession && !remand) {
    warnings.push('Remand session failed sanitization; planner will ignore it.');
  } else if (remand && remand.cursor >= remand.scenarioIds.length) {
    warnings.push('Remand cursor out of range; clamp on next sanitize.');
  }

  const reversal = sanitizeReversalSession(state.reversalSession);
  if (state.reversalSession && !reversal) {
    warnings.push('Reversal session failed sanitization; planner will ignore it.');
  } else if (reversal && reversal.cursor >= reversal.scenarioIds.length) {
    warnings.push('Reversal cursor out of range; clamp on next sanitize.');
  }

  const annulment = sanitizeAnnulmentSession(state.annulmentSession);
  if (state.annulmentSession && !annulment) {
    warnings.push('Annulment session failed sanitization; planner will ignore it.');
  } else if (annulment && annulment.cursor >= annulment.scenarioIds.length) {
    warnings.push('Annulment cursor out of range; clamp on next sanitize.');
  }

  const reinstatement = sanitizeReinstatementSession(state.reinstatementSession);
  if (state.reinstatementSession && !reinstatement) {
    warnings.push('Reinstatement session failed sanitization; planner will ignore it.');
  } else if (reinstatement && reinstatement.cursor >= reinstatement.scenarioIds.length) {
    warnings.push('Reinstatement cursor out of range; clamp on next sanitize.');
  }

  const setAside = sanitizeSetAsideSession(state.setAsideSession);
  if (state.setAsideSession && !setAside) {
    warnings.push('Set-aside session failed sanitization; planner will ignore it.');
  } else if (setAside && setAside.cursor >= setAside.scenarioIds.length) {
    warnings.push('Set-aside cursor out of range; clamp on next sanitize.');
  }

  const quash = sanitizeQuashSession(state.quashSession);
  if (state.quashSession && !quash) {
    warnings.push('Quash session failed sanitization; planner will ignore it.');
  } else if (quash && quash.cursor >= quash.scenarioIds.length) {
    warnings.push('Quash cursor out of range; clamp on next sanitize.');
  }

  const supersede = sanitizeSupersedeSession(state.supersedeSession);
  if (state.supersedeSession && !supersede) {
    warnings.push('Supersede session failed sanitization; planner will ignore it.');
  } else if (supersede && supersede.cursor >= supersede.scenarioIds.length) {
    warnings.push('Supersede cursor out of range; clamp on next sanitize.');
  }

  const certiorari = sanitizeCertiorariSession(state.certiorariSession);
  if (state.certiorariSession && !certiorari) {
    warnings.push('Certiorari session failed sanitization; planner will ignore it.');
  } else if (certiorari && certiorari.cursor >= certiorari.scenarioIds.length) {
    warnings.push('Certiorari cursor out of range; clamp on next sanitize.');
  }

  const mandamus = sanitizeMandamusSession(state.mandamusSession);
  if (state.mandamusSession && !mandamus) {
    warnings.push('Mandamus session failed sanitization; planner will ignore it.');
  } else if (mandamus && mandamus.cursor >= mandamus.scenarioIds.length) {
    warnings.push('Mandamus cursor out of range; clamp on next sanitize.');
  }

  const prohibition = sanitizeProhibitionSession(state.prohibitionSession);
  if (state.prohibitionSession && !prohibition) {
    warnings.push('Prohibition session failed sanitization; planner will ignore it.');
  } else if (prohibition && prohibition.cursor >= prohibition.scenarioIds.length) {
    warnings.push('Prohibition cursor out of range; clamp on next sanitize.');
  }

  const habeas = sanitizeHabeasSession(state.habeasSession);
  if (state.habeasSession && !habeas) {
    warnings.push('Habeas session failed sanitization; planner will ignore it.');
  } else if (habeas && habeas.cursor >= habeas.scenarioIds.length) {
    warnings.push('Habeas cursor out of range; clamp on next sanitize.');
  }

  const quowarranto = sanitizeQuowarrantoSession(state.quowarrantoSession);
  if (state.quowarrantoSession && !quowarranto) {
    warnings.push('Quo warranto session failed sanitization; planner will ignore it.');
  } else if (quowarranto && quowarranto.cursor >= quowarranto.scenarioIds.length) {
    warnings.push('Quo warranto cursor out of range; clamp on next sanitize.');
  }

  const injunction = sanitizeInjunctionSession(state.injunctionSession);
  if (state.injunctionSession && !injunction) {
    warnings.push('Injunction session failed sanitization; planner will ignore it.');
  } else if (injunction && injunction.cursor >= injunction.scenarioIds.length) {
    warnings.push('Injunction cursor out of range; clamp on next sanitize.');
  }

  const contempt = sanitizeContemptSession(state.contemptSession);
  if (state.contemptSession && !contempt) {
    warnings.push('Contempt session failed sanitization; planner will ignore it.');
  } else if (contempt && contempt.cursor >= contempt.scenarioIds.length) {
    warnings.push('Contempt cursor out of range; clamp on next sanitize.');
  }

  const sequestration = sanitizeSequestrationSession(state.sequestrationSession);
  if (state.sequestrationSession && !sequestration) {
    warnings.push('Sequestration session failed sanitization; planner will ignore it.');
  } else if (sequestration && sequestration.cursor >= sequestration.scenarioIds.length) {
    warnings.push('Sequestration cursor out of range; clamp on next sanitize.');
  }

  const receivership = sanitizeReceivershipSession(state.receivershipSession);
  if (state.receivershipSession && !receivership) {
    warnings.push('Receivership session failed sanitization; planner will ignore it.');
  } else if (receivership && receivership.cursor >= receivership.scenarioIds.length) {
    warnings.push('Receivership cursor out of range; clamp on next sanitize.');
  }

  const liquidation = sanitizeLiquidationSession(state.liquidationSession);
  if (state.liquidationSession && !liquidation) {
    warnings.push('Liquidation session failed sanitization; planner will ignore it.');
  } else if (liquidation && liquidation.cursor >= liquidation.scenarioIds.length) {
    warnings.push('Liquidation cursor out of range; clamp on next sanitize.');
  }

  const liquidationDepth = sanitizeLiquidationDepthSession(state.liquidationDepthSession);
  if (state.liquidationDepthSession && !liquidationDepth) {
    warnings.push('Liquidation depth session failed sanitization; planner will ignore it.');
  } else if (liquidationDepth && liquidationDepth.cursor >= liquidationDepth.scenarioIds.length) {
    warnings.push('Liquidation depth cursor out of range; clamp on next sanitize.');
  }

  const dissolution = sanitizeDissolutionSession(state.dissolutionSession);
  if (state.dissolutionSession && !dissolution) {
    warnings.push('Dissolution session failed sanitization; planner will ignore it.');
  } else if (dissolution && dissolution.cursor >= dissolution.scenarioIds.length) {
    warnings.push('Dissolution cursor out of range; clamp on next sanitize.');
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
