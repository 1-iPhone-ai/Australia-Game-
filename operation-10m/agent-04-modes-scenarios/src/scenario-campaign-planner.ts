import { getO10mScenarioChain } from './scenario-chains.js';
import { findO10mScenario } from './scenarios/o10m-presets.js';
import { sanitizeCampaignSlots } from './save-format-campaign.js';
import {
  getGauntletScenarioAtCursor,
  gauntletSessionSummary,
  sanitizeCatalogUnlockTokens,
  sanitizeGauntletSession,
} from './save-format-gauntlet.js';
import {
  getMarathonScenarioAtCursor,
  sanitizeMarathonQueue,
} from './save-format-marathon.js';
import {
  getRelayScenarioAtCursor,
  relaySessionSummary,
  sanitizeRelaySession,
} from './save-format-relay.js';
import {
  getCircuitScenarioAtCursor,
  circuitSessionSummary,
  sanitizeCircuitSession,
} from './save-format-circuit.js';
import {
  getExpeditionScenarioAtCursor,
  expeditionSessionSummary,
  sanitizeExpeditionSession,
} from './save-format-expedition.js';
import {
  getOdysseyScenarioAtCursor,
  odysseySessionSummary,
  sanitizeOdysseySession,
} from './save-format-odyssey.js';
import {
  getPilgrimageScenarioAtCursor,
  pilgrimageSessionSummary,
  sanitizePilgrimageSession,
} from './save-format-pilgrimage.js';
import {
  getCaravanScenarioAtCursor,
  caravanSessionSummary,
  sanitizeCaravanSession,
} from './save-format-caravan.js';
import {
  getConvoyScenarioAtCursor,
  convoySessionSummary,
  sanitizeConvoySession,
} from './save-format-convoy.js';
import {
  getEscortScenarioAtCursor,
  escortSessionSummary,
  sanitizeEscortSession,
} from './save-format-escort.js';
import {
  getExtractionScenarioAtCursor,
  extractionSessionSummary,
  sanitizeExtractionSession,
} from './save-format-extraction.js';
import {
  getSubjectScenarioAtCursor,
  subjectSessionSummary,
  sanitizeSubjectSession,
} from './save-format-subject.js';
import {
  getWitnessScenarioAtCursor,
  witnessSessionSummary,
  sanitizeWitnessSession,
} from './save-format-witness.js';
import {
  getTribunalScenarioAtCursor,
  tribunalSessionSummary,
  sanitizeTribunalSession,
} from './save-format-tribunal.js';
import {
  getIndictmentScenarioAtCursor,
  indictmentSessionSummary,
  sanitizeIndictmentSession,
} from './save-format-indictment.js';
import {
  getAppealScenarioAtCursor,
  appealSessionSummary,
  sanitizeAppealSession,
} from './save-format-appeal.js';
import {
  getClemencyScenarioAtCursor,
  clemencySessionSummary,
  sanitizeClemencySession,
} from './save-format-clemency.js';
import {
  getSiegeScenarioAtCursor,
  siegeSessionSummary,
  sanitizeSiegeSession,
} from './save-format-siege.js';
import {
  getVoyageScenarioAtCursor,
  voyageSessionSummary,
  sanitizeVoyageSession,
} from './save-format-voyage.js';
import { objectiveProgressCompletionRatio } from './save-format-objective-sync.js';
import type {
  O10mCampaignPlan,
  O10mCaravanLeg,
  O10mCircuitPhase,
  O10mExpeditionLeg,
  O10mOdysseyAct,
  O10mPilgrimageStage,
  O10mConvoyStage,
  O10mEscortPhase,
  O10mExtractionPhase,
  O10mSubjectPhase,
  O10mWitnessPhase,
  O10mTribunalPhase,
  O10mIndictmentPhase,
  O10mAppealPhase,
  O10mClemencyPhase,
  O10mSiegePhase,
  O10mVoyageSegment,
  O10mModesPersistedState,
} from './types.js';

const emptyQueuePlan = {
  marathonQueueId: null as string | null,
  marathonCursor: null as number | null,
  gauntletId: null as string | null,
  gauntletCursor: null as number | null,
  gauntletLives: null as number | null,
  relayId: null as string | null,
  relayCursor: null as number | null,
  relayCarryMoney: null as number | null,
  circuitId: null as string | null,
  circuitCursor: null as number | null,
  circuitPhase: null as O10mCircuitPhase | null,
  circuitMomentum: null as number | null,
  expeditionId: null as string | null,
  expeditionCursor: null as number | null,
  expeditionLeg: null as O10mExpeditionLeg | null,
  expeditionSupply: null as number | null,
  odysseyId: null as string | null,
  odysseyCursor: null as number | null,
  odysseyAct: null as O10mOdysseyAct | null,
  odysseyRenown: null as number | null,
  pilgrimageId: null as string | null,
  pilgrimageCursor: null as number | null,
  pilgrimageStage: null as O10mPilgrimageStage | null,
  pilgrimageDevotion: null as number | null,
  caravanId: null as string | null,
  caravanCursor: null as number | null,
  caravanLeg: null as O10mCaravanLeg | null,
  caravanCargo: null as number | null,
  voyageId: null as string | null,
  voyageCursor: null as number | null,
  voyageSegment: null as O10mVoyageSegment | null,
  voyageChart: null as number | null,
  siegeId: null as string | null,
  siegeCursor: null as number | null,
  siegePhase: null as O10mSiegePhase | null,
  siegeMorale: null as number | null,
  convoyId: null as string | null,
  convoyCursor: null as number | null,
  convoyStage: null as O10mConvoyStage | null,
  convoyHaul: null as number | null,
  escortId: null as string | null,
  escortCursor: null as number | null,
  escortPhase: null as O10mEscortPhase | null,
  escortTrust: null as number | null,
  extractionId: null as string | null,
  extractionCursor: null as number | null,
  extractionPhase: null as O10mExtractionPhase | null,
  extractionAssets: null as number | null,
  subjectId: null as string | null,
  subjectCursor: null as number | null,
  subjectPhase: null as O10mSubjectPhase | null,
  subjectFidelity: null as number | null,
  witnessId: null as string | null,
  witnessCursor: null as number | null,
  witnessPhase: null as O10mWitnessPhase | null,
  witnessCredibility: null as number | null,
  tribunalId: null as string | null,
  tribunalCursor: null as number | null,
  tribunalPhase: null as O10mTribunalPhase | null,
  tribunalGravitas: null as number | null,
  indictmentId: null as string | null,
  indictmentCursor: null as number | null,
  indictmentPhase: null as O10mIndictmentPhase | null,
  indictmentCaseWeight: null as number | null,
  appealId: null as string | null,
  appealCursor: null as number | null,
  appealPhase: null as O10mAppealPhase | null,
  appealMerit: null as number | null,
  clemencyId: null as string | null,
  clemencyCursor: null as number | null,
  clemencyPhase: null as O10mClemencyPhase | null,
  clemencyMercy: null as number | null,
};

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
  const clemency = sanitizeClemencySession(state.clemencySession);
  const clemencyScenario = getClemencyScenarioAtCursor(clemency);
  if (clemency && clemency.active && clemencyScenario) {
    return {
      kind: 'clemency_step',
      scenarioId: clemencyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      clemencyId: clemency.clemencyId,
      clemencyCursor: clemency.cursor,
      clemencyPhase: clemency.phaseTag,
      clemencyMercy: clemency.mercyScore,
      reason: `Clemency "${clemency.label}" ${clemency.phaseTag} phase ${clemency.cursor + 1}/${clemency.scenarioIds.length} (mercy ${clemency.mercyScore}).`,
    };
  }

  const appeal = sanitizeAppealSession(state.appealSession);
  const appealScenario = getAppealScenarioAtCursor(appeal);
  if (appeal && appeal.active && appealScenario) {
    return {
      kind: 'appeal_step',
      scenarioId: appealScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      appealId: appeal.appealId,
      appealCursor: appeal.cursor,
      appealPhase: appeal.phaseTag,
      appealMerit: appeal.meritScore,
      reason: `Appeal "${appeal.label}" ${appeal.phaseTag} phase ${appeal.cursor + 1}/${appeal.scenarioIds.length} (merit ${appeal.meritScore}).`,
    };
  }

  const indictment = sanitizeIndictmentSession(state.indictmentSession);
  const indictmentScenario = getIndictmentScenarioAtCursor(indictment);
  if (indictment && indictment.active && indictmentScenario) {
    return {
      kind: 'indictment_step',
      scenarioId: indictmentScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      indictmentId: indictment.indictmentId,
      indictmentCursor: indictment.cursor,
      indictmentPhase: indictment.phaseTag,
      indictmentCaseWeight: indictment.caseWeightScore,
      reason: `Indictment "${indictment.label}" ${indictment.phaseTag} phase ${indictment.cursor + 1}/${indictment.scenarioIds.length} (case weight ${indictment.caseWeightScore}).`,
    };
  }

  const tribunal = sanitizeTribunalSession(state.tribunalSession);
  const tribunalScenario = getTribunalScenarioAtCursor(tribunal);
  if (tribunal && tribunal.active && tribunalScenario) {
    return {
      kind: 'tribunal_step',
      scenarioId: tribunalScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      tribunalId: tribunal.tribunalId,
      tribunalCursor: tribunal.cursor,
      tribunalPhase: tribunal.phaseTag,
      tribunalGravitas: tribunal.gravitasScore,
      reason: `Tribunal "${tribunal.label}" ${tribunal.phaseTag} phase ${tribunal.cursor + 1}/${tribunal.scenarioIds.length} (gravitas ${tribunal.gravitasScore}).`,
    };
  }

  const witness = sanitizeWitnessSession(state.witnessSession);
  const witnessScenario = getWitnessScenarioAtCursor(witness);
  if (witness && witness.active && witnessScenario) {
    return {
      kind: 'witness_step',
      scenarioId: witnessScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      witnessId: witness.witnessId,
      witnessCursor: witness.cursor,
      witnessPhase: witness.phaseTag,
      witnessCredibility: witness.credibilityScore,
      reason: `Witness "${witness.label}" ${witness.phaseTag} phase ${witness.cursor + 1}/${witness.scenarioIds.length} (credibility ${witness.credibilityScore}).`,
    };
  }

  const subject = sanitizeSubjectSession(state.subjectSession);
  const subjectScenario = getSubjectScenarioAtCursor(subject);
  if (subject && subject.active && subjectScenario) {
    return {
      kind: 'subject_step',
      scenarioId: subjectScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      subjectId: subject.subjectId,
      subjectCursor: subject.cursor,
      subjectPhase: subject.phaseTag,
      subjectFidelity: subject.fidelityScore,
      reason: `Subject "${subject.label}" ${subject.phaseTag} phase ${subject.cursor + 1}/${subject.scenarioIds.length} (fidelity ${subject.fidelityScore}).`,
    };
  }

  const extraction = sanitizeExtractionSession(state.extractionSession);
  const extractionScenario = getExtractionScenarioAtCursor(extraction);
  if (extraction && extraction.active && extractionScenario) {
    return {
      kind: 'extraction_step',
      scenarioId: extractionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      extractionId: extraction.extractionId,
      extractionCursor: extraction.cursor,
      extractionPhase: extraction.phaseTag,
      extractionAssets: extraction.assetScore,
      reason: `Extraction "${extraction.label}" ${extraction.phaseTag} phase ${extraction.cursor + 1}/${extraction.scenarioIds.length} (assets ${extraction.assetScore}).`,
    };
  }

  const escort = sanitizeEscortSession(state.escortSession);
  const escortScenario = getEscortScenarioAtCursor(escort);
  if (escort && escort.active && escortScenario) {
    return {
      kind: 'escort_step',
      scenarioId: escortScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      escortId: escort.escortId,
      escortCursor: escort.cursor,
      escortPhase: escort.phaseTag,
      escortTrust: escort.trustScore,
      reason: `Escort "${escort.label}" ${escort.phaseTag} phase ${escort.cursor + 1}/${escort.scenarioIds.length} (trust ${escort.trustScore}).`,
    };
  }

  const convoy = sanitizeConvoySession(state.convoySession);
  const convoyScenario = getConvoyScenarioAtCursor(convoy);
  if (convoy && convoy.active && convoyScenario) {
    return {
      kind: 'convoy_step',
      scenarioId: convoyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      convoyId: convoy.convoyId,
      convoyCursor: convoy.cursor,
      convoyStage: convoy.stageTag,
      convoyHaul: convoy.haulScore,
      reason: `Convoy "${convoy.label}" ${convoy.stageTag} stage ${convoy.cursor + 1}/${convoy.scenarioIds.length} (haul ${convoy.haulScore}).`,
    };
  }

  const siege = sanitizeSiegeSession(state.siegeSession);
  const siegeScenario = getSiegeScenarioAtCursor(siege);
  if (siege && siege.active && siegeScenario) {
    return {
      kind: 'siege_step',
      scenarioId: siegeScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      siegeId: siege.siegeId,
      siegeCursor: siege.cursor,
      siegePhase: siege.phaseTag,
      siegeMorale: siege.moraleScore,
      reason: `Siege "${siege.label}" ${siege.phaseTag} phase ${siege.cursor + 1}/${siege.scenarioIds.length} (morale ${siege.moraleScore}).`,
    };
  }

  const voyage = sanitizeVoyageSession(state.voyageSession);
  const voyageScenario = getVoyageScenarioAtCursor(voyage);
  if (voyage && voyage.active && voyageScenario) {
    return {
      kind: 'voyage_step',
      scenarioId: voyageScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      voyageId: voyage.voyageId,
      voyageCursor: voyage.cursor,
      voyageSegment: voyage.segmentTag,
      voyageChart: voyage.chartScore,
      reason: `Voyage "${voyage.label}" ${voyage.segmentTag} segment ${voyage.cursor + 1}/${voyage.scenarioIds.length} (chart ${voyage.chartScore}).`,
    };
  }

  const caravan = sanitizeCaravanSession(state.caravanSession);
  const caravanScenario = getCaravanScenarioAtCursor(caravan);
  if (caravan && caravan.active && caravanScenario) {
    return {
      kind: 'caravan_step',
      scenarioId: caravanScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      caravanId: caravan.caravanId,
      caravanCursor: caravan.cursor,
      caravanLeg: caravan.legTag,
      caravanCargo: caravan.cargoScore,
      reason: `Caravan "${caravan.label}" ${caravan.legTag} leg ${caravan.cursor + 1}/${caravan.scenarioIds.length} (cargo ${caravan.cargoScore}).`,
    };
  }

  const pilgrimage = sanitizePilgrimageSession(state.pilgrimageSession);
  const pilgrimageScenario = getPilgrimageScenarioAtCursor(pilgrimage);
  if (pilgrimage && pilgrimage.active && pilgrimageScenario) {
    return {
      kind: 'pilgrimage_step',
      scenarioId: pilgrimageScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      pilgrimageId: pilgrimage.pilgrimageId,
      pilgrimageCursor: pilgrimage.cursor,
      pilgrimageStage: pilgrimage.stageTag,
      pilgrimageDevotion: pilgrimage.devotionScore,
      reason: `Pilgrimage "${pilgrimage.label}" ${pilgrimage.stageTag} stop ${pilgrimage.cursor + 1}/${pilgrimage.scenarioIds.length} (devotion ${pilgrimage.devotionScore}).`,
    };
  }

  const odyssey = sanitizeOdysseySession(state.odysseySession);
  const odysseyScenario = getOdysseyScenarioAtCursor(odyssey);
  if (odyssey && odyssey.active && odysseyScenario) {
    return {
      kind: 'odyssey_step',
      scenarioId: odysseyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      odysseyId: odyssey.odysseyId,
      odysseyCursor: odyssey.cursor,
      odysseyAct: odyssey.actTag,
      odysseyRenown: odyssey.renownScore,
      reason: `Odyssey "${odyssey.label}" ${odyssey.actTag} chapter ${odyssey.cursor + 1}/${odyssey.scenarioIds.length} (renown ${odyssey.renownScore}).`,
    };
  }

  const expedition = sanitizeExpeditionSession(state.expeditionSession);
  const expeditionScenario = getExpeditionScenarioAtCursor(expedition);
  if (expedition && expedition.active && expeditionScenario) {
    return {
      kind: 'expedition_step',
      scenarioId: expeditionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      expeditionId: expedition.expeditionId,
      expeditionCursor: expedition.cursor,
      expeditionLeg: expedition.legTag,
      expeditionSupply: expedition.supplyScore,
      reason: `Expedition "${expedition.label}" ${expedition.legTag} waypoint ${expedition.cursor + 1}/${expedition.scenarioIds.length} (supply ${expedition.supplyScore}).`,
    };
  }

  const circuit = sanitizeCircuitSession(state.circuitSession);
  const circuitScenario = getCircuitScenarioAtCursor(circuit);
  if (circuit && circuit.active && circuitScenario) {
    return {
      kind: 'circuit_step',
      scenarioId: circuitScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      circuitId: circuit.circuitId,
      circuitCursor: circuit.cursor,
      circuitPhase: circuit.phaseTag,
      circuitMomentum: circuit.momentumScore,
      reason: `Circuit "${circuit.label}" ${circuit.phaseTag} leg ${circuit.cursor + 1}/${circuit.scenarioIds.length} (momentum ${circuit.momentumScore}).`,
    };
  }

  const relay = sanitizeRelaySession(state.relaySession);
  const relayScenario = getRelayScenarioAtCursor(relay);
  if (relay && relay.active && relayScenario) {
    const carryMoney = relay.legCarry.startingMoneyDelta ?? 0;
    return {
      kind: 'relay_step',
      scenarioId: relayScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      relayId: relay.relayId,
      relayCursor: relay.cursor,
      relayCarryMoney: carryMoney,
      reason: `Relay "${relay.label}" leg ${relay.cursor + 1}/${relay.scenarioIds.length} (+$${carryMoney} carry).`,
    };
  }

  const gauntlet = sanitizeGauntletSession(state.gauntletSession);
  const gauntletScenario = getGauntletScenarioAtCursor(gauntlet);
  if (gauntlet && gauntlet.active && gauntletScenario) {
    return {
      kind: 'gauntlet_step',
      scenarioId: gauntletScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      gauntletId: gauntlet.gauntletId,
      gauntletCursor: gauntlet.cursor,
      gauntletLives: gauntlet.livesRemaining,
      reason: `Gauntlet "${gauntlet.label}" step ${gauntlet.cursor + 1}/${gauntlet.scenarioIds.length} (${gauntlet.livesRemaining} lives).`,
    };
  }

  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  const marathonScenario = getMarathonScenarioAtCursor(marathon);
  if (marathon && marathon.active && marathonScenario) {
    return {
      kind: 'marathon_step',
      scenarioId: marathonScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      marathonQueueId: marathon.queueId,
      marathonCursor: marathon.cursor,
      reason: `Marathon "${marathon.label}" step ${marathon.cursor + 1}/${marathon.scenarioIds.length}.`,
    };
  }

  if (state.activeCampaignSlotId) {
    const slot = sanitizeCampaignSlots(state.campaignSlots).find(s => s.slotId === state.activeCampaignSlotId);
    if (slot?.scenarioId) {
      return {
        kind: 'slot_resume',
        scenarioId: slot.scenarioId,
        chainId: slot.chainId,
        chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
        slotId: slot.slotId,
        ...emptyQueuePlan,
        reason: `Resume pinned slot "${slot.label}".`,
      };
    }
  }

  if (state.chainProgress && !state.chainProgress.chainCompleted) {
    const chain = getO10mScenarioChain(state.chainProgress.chainId);
    const step = chain?.steps.find(s => s.stepIndex === state.chainProgress!.activeStepIndex);
    if (step) {
      return {
        kind: 'chain_step',
        scenarioId: step.scenarioId,
        chainId: state.chainProgress.chainId,
        chainStepIndex: step.stepIndex,
        slotId: null,
        ...emptyQueuePlan,
        reason: `Continue chain "${chain?.title ?? state.chainProgress.chainId}" at step ${step.stepIndex + 1}.`,
      };
    }
  }

  if (state.scenarioId && findO10mScenario(state.scenarioId)) {
    const ratio = objectiveProgressCompletionRatio(state, state.scenarioId);
    return {
      kind: 'free_play',
      scenarioId: state.scenarioId,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: null,
      ...emptyQueuePlan,
      reason:
        ratio > 0 && ratio < 1
          ? `Resume in-progress scenario (${Math.round(ratio * 100)}% objectives captured).`
          : 'Continue last selected scenario.',
    };
  }

  return {
    kind: 'free_play',
    scenarioId: null,
    chainId: null,
    chainStepIndex: null,
    slotId: null,
    ...emptyQueuePlan,
    reason: 'No active chain, slot, or scenario — pick from catalog.',
  };
}

export function rankCampaignSlotsByRecency(state: O10mModesPersistedState): string[] {
  return sanitizeCampaignSlots(state.campaignSlots)
    .sort((a, b) => b.pinnedAtTurn - a.pinnedAtTurn)
    .map(s => s.slotId);
}

export function campaignProgressSummary(state: O10mModesPersistedState): {
  completedChains: number;
  recentVictories: number;
  activeChainTitle: string | null;
  marathonActive: boolean;
  gauntletActive: boolean;
  relayActive: boolean;
  circuitActive: boolean;
  expeditionActive: boolean;
  odysseyActive: boolean;
  pilgrimageActive: boolean;
  caravanActive: boolean;
  voyageActive: boolean;
  siegeActive: boolean;
  convoyActive: boolean;
  escortActive: boolean;
  extractionActive: boolean;
  subjectActive: boolean;
  witnessActive: boolean;
  tribunalActive: boolean;
  indictmentActive: boolean;
  appealActive: boolean;
  clemencyActive: boolean;
  replayTracked: number;
  unlockTokens: number;
  nextPlan: O10mCampaignPlan;
} {
  const nextPlan = planNextCampaignAction(state);
  const chain = state.chainProgress ? getO10mScenarioChain(state.chainProgress.chainId) : undefined;
  const recentVictories = state.recentRuns.filter(r => r.primaryVictory).length;
  const marathon = sanitizeMarathonQueue(state.marathonQueue);
  const gauntlet = gauntletSessionSummary(state);
  const relay = relaySessionSummary(state);
  const circuit = circuitSessionSummary(state);
  const expedition = expeditionSessionSummary(state);
  const odyssey = odysseySessionSummary(state);
  const pilgrimage = pilgrimageSessionSummary(state);
  const caravan = caravanSessionSummary(state);
  const voyage = voyageSessionSummary(state);
  const siege = siegeSessionSummary(state);
  const convoy = convoySessionSummary(state);
  const escort = escortSessionSummary(state);
  const extraction = extractionSessionSummary(state);
  const subject = subjectSessionSummary(state);
  const witness = witnessSessionSummary(state);
  const tribunal = tribunalSessionSummary(state);
  const indictment = indictmentSessionSummary(state);
  const appeal = appealSessionSummary(state);
  const clemency = clemencySessionSummary(state);
  const tokens = sanitizeCatalogUnlockTokens(state.catalogUnlockTokens);
  return {
    completedChains: state.completedChainIds.length,
    recentVictories,
    activeChainTitle: chain?.title ?? null,
    marathonActive: marathon?.active === true,
    gauntletActive: gauntlet.active,
    relayActive: relay.active,
    circuitActive: circuit.active,
    expeditionActive: expedition.active,
    odysseyActive: odyssey.active,
    pilgrimageActive: pilgrimage.active,
    caravanActive: caravan.active,
    voyageActive: voyage.active,
    siegeActive: siege.active,
    convoyActive: convoy.active,
    escortActive: escort.active,
    extractionActive: extraction.active,
    subjectActive: subject.active,
    witnessActive: witness.active,
    tribunalActive: tribunal.active,
    indictmentActive: indictment.active,
    appealActive: appeal.active,
    clemencyActive: clemency.active,
    replayTracked: (state.replayLedger ?? []).length,
    unlockTokens: tokens.length,
    nextPlan,
  };
}
