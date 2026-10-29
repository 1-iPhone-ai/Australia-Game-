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
  getPardonScenarioAtCursor,
  pardonSessionSummary,
  sanitizePardonSession,
} from './save-format-pardon.js';
import {
  getAmnestyScenarioAtCursor,
  amnestySessionSummary,
  sanitizeAmnestySession,
} from './save-format-amnesty.js';
import {
  getExpungementScenarioAtCursor,
  expungementSessionSummary,
  sanitizeExpungementSession,
} from './save-format-expungement.js';
import {
  getVacaturScenarioAtCursor,
  vacaturSessionSummary,
  sanitizeVacaturSession,
} from './save-format-vacatur.js';
import {
  getRemandScenarioAtCursor,
  remandSessionSummary,
  sanitizeRemandSession,
} from './save-format-remand.js';
import {
  getReversalScenarioAtCursor,
  reversalSessionSummary,
  sanitizeReversalSession,
} from './save-format-reversal.js';
import {
  getInjunctionScenarioAtCursor,
  injunctionSessionSummary,
  sanitizeInjunctionSession,
} from './save-format-injunction.js';
import {
  getQuowarrantoScenarioAtCursor,
  quowarrantoSessionSummary,
  sanitizeQuowarrantoSession,
} from './save-format-quowarranto.js';
import {
  getHabeasScenarioAtCursor,
  habeasSessionSummary,
  sanitizeHabeasSession,
} from './save-format-habeas.js';
import {
  getProhibitionScenarioAtCursor,
  prohibitionSessionSummary,
  sanitizeProhibitionSession,
} from './save-format-prohibition.js';
import {
  getMandamusScenarioAtCursor,
  mandamusSessionSummary,
  sanitizeMandamusSession,
} from './save-format-mandamus.js';
import {
  getCertiorariScenarioAtCursor,
  certiorariSessionSummary,
  sanitizeCertiorariSession,
} from './save-format-certiorari.js';
import {
  getSupersedeScenarioAtCursor,
  supersedeSessionSummary,
  sanitizeSupersedeSession,
} from './save-format-supersede.js';
import {
  getQuashScenarioAtCursor,
  quashSessionSummary,
  sanitizeQuashSession,
} from './save-format-quash.js';
import {
  getSetAsideScenarioAtCursor,
  setAsideSessionSummary,
  sanitizeSetAsideSession,
} from './save-format-setaside.js';
import {
  getReinstatementScenarioAtCursor,
  reinstatementSessionSummary,
  sanitizeReinstatementSession,
} from './save-format-reinstatement.js';
import {
  getAnnulmentScenarioAtCursor,
  annulmentSessionSummary,
  sanitizeAnnulmentSession,
} from './save-format-annulment.js';
import {
  getExonerationScenarioAtCursor,
  exonerationSessionSummary,
  sanitizeExonerationSession,
} from './save-format-exoneration.js';
import {
  getAcquittalScenarioAtCursor,
  acquittalSessionSummary,
  sanitizeAcquittalSession,
} from './save-format-acquittal.js';
import {
  getCommutationScenarioAtCursor,
  commutationSessionSummary,
  sanitizeCommutationSession,
} from './save-format-commutation.js';
import {
  getProbationScenarioAtCursor,
  probationSessionSummary,
  sanitizeProbationSession,
} from './save-format-probation.js';
import {
  getParoleScenarioAtCursor,
  paroleSessionSummary,
  sanitizeParoleSession,
} from './save-format-parole.js';
import {
  getReprieveScenarioAtCursor,
  reprieveSessionSummary,
  sanitizeReprieveSession,
} from './save-format-reprieve.js';
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
  O10mPardonPhase,
  O10mAmnestyPhase,
  O10mReprievePhase,
  O10mParolePhase,
  O10mProbationPhase,
  O10mCommutationPhase,
  O10mAcquittalPhase,
  O10mExonerationPhase,
  O10mExpungementPhase,
  O10mVacaturPhase,
  O10mRemandPhase,
  O10mReversalPhase,
  O10mAnnulmentPhase,
  O10mReinstatementPhase,
  O10mSetAsidePhase,
  O10mQuashPhase,
  O10mSupersedePhase,
  O10mCertiorariPhase,
  O10mMandamusPhase,
  O10mProhibitionPhase,
  O10mHabeasPhase,
  O10mQuowarrantoPhase,
  O10mInjunctionPhase,
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
  pardonId: null as string | null,
  pardonCursor: null as number | null,
  pardonPhase: null as O10mPardonPhase | null,
  pardonGrace: null as number | null,
  amnestyId: null as string | null,
  amnestyCursor: null as number | null,
  amnestyPhase: null as O10mAmnestyPhase | null,
  amnestyAbsolution: null as number | null,
  reprieveId: null as string | null,
  reprieveCursor: null as number | null,
  reprievePhase: null as O10mReprievePhase | null,
  reprieveRelief: null as number | null,
  paroleId: null as string | null,
  paroleCursor: null as number | null,
  parolePhase: null as O10mParolePhase | null,
  paroleTrust: null as number | null,
  probationId: null as string | null,
  probationCursor: null as number | null,
  probationPhase: null as O10mProbationPhase | null,
  probationCompliance: null as number | null,
  commutationId: null as string | null,
  commutationCursor: null as number | null,
  commutationPhase: null as O10mCommutationPhase | null,
  commutationLeniency: null as number | null,
  acquittalId: null as string | null,
  acquittalCursor: null as number | null,
  acquittalPhase: null as O10mAcquittalPhase | null,
  acquittalVerdict: null as number | null,
  exonerationId: null as string | null,
  exonerationCursor: null as number | null,
  exonerationPhase: null as O10mExonerationPhase | null,
  exonerationRestitution: null as number | null,
  expungementId: null as string | null,
  expungementCursor: null as number | null,
  expungementPhase: null as O10mExpungementPhase | null,
  expungementSeal: null as number | null,
  vacaturId: null as string | null,
  vacaturCursor: null as number | null,
  vacaturPhase: null as O10mVacaturPhase | null,
  vacaturMerit: null as number | null,
  remandId: null as string | null,
  remandCursor: null as number | null,
  remandPhase: null as O10mRemandPhase | null,
  remandWeight: null as number | null,
  reversalId: null as string | null,
  reversalCursor: null as number | null,
  reversalPhase: null as O10mReversalPhase | null,
  reversalScore: null as number | null,
  annulmentId: null as string | null,
  annulmentCursor: null as number | null,
  annulmentPhase: null as O10mAnnulmentPhase | null,
  annulmentScore: null as number | null,
  reinstatementId: null as string | null,
  reinstatementCursor: null as number | null,
  reinstatementPhase: null as O10mReinstatementPhase | null,
  reinstatementScore: null as number | null,
  setAsideId: null as string | null,
  setAsideCursor: null as number | null,
  setAsidePhase: null as O10mSetAsidePhase | null,
  setAsideScore: null as number | null,
  quashId: null as string | null,
  quashCursor: null as number | null,
  quashPhase: null as O10mQuashPhase | null,
  quashScore: null as number | null,
  supersedeId: null as string | null,
  supersedeCursor: null as number | null,
  supersedePhase: null as O10mSupersedePhase | null,
  supersedeScore: null as number | null,
  certiorariId: null as string | null,
  certiorariCursor: null as number | null,
  certiorariPhase: null as O10mCertiorariPhase | null,
  certiorariScore: null as number | null,
  mandamusId: null as string | null,
  mandamusCursor: null as number | null,
  mandamusPhase: null as O10mMandamusPhase | null,
  mandamusScore: null as number | null,
  prohibitionId: null as string | null,
  prohibitionCursor: null as number | null,
  prohibitionPhase: null as O10mProhibitionPhase | null,
  prohibitionScore: null as number | null,
  habeasId: null as string | null,
  habeasCursor: null as number | null,
  habeasPhase: null as O10mHabeasPhase | null,
  habeasScore: null as number | null,
  quowarrantoId: null as string | null,
  quowarrantoCursor: null as number | null,
  quowarrantoPhase: null as O10mQuowarrantoPhase | null,
  quowarrantoScore: null as number | null,
  injunctionId: null as string | null,
  injunctionCursor: null as number | null,
  injunctionPhase: null as O10mInjunctionPhase | null,
  injunctionScore: null as number | null,
};

export function planNextCampaignAction(state: O10mModesPersistedState): O10mCampaignPlan {
  const injunction = sanitizeInjunctionSession(state.injunctionSession);
  const injunctionScenario = getInjunctionScenarioAtCursor(injunction);
  if (injunction && injunction.active && injunctionScenario) {
    return {
      kind: 'injunction_step',
      scenarioId: injunctionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      injunctionId: injunction.injunctionId,
      injunctionCursor: injunction.cursor,
      injunctionPhase: injunction.phaseTag,
      injunctionScore: injunction.injunctionScore,
      reason: `Injunction "${injunction.label}" ${injunction.phaseTag} phase ${injunction.cursor + 1}/${injunction.scenarioIds.length} (score ${injunction.injunctionScore}).`,
    };
  }

  const quowarranto = sanitizeQuowarrantoSession(state.quowarrantoSession);
  const quowarrantoScenario = getQuowarrantoScenarioAtCursor(quowarranto);
  if (quowarranto && quowarranto.active && quowarrantoScenario) {
    return {
      kind: 'quowarranto_step',
      scenarioId: quowarrantoScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      quowarrantoId: quowarranto.quowarrantoId,
      quowarrantoCursor: quowarranto.cursor,
      quowarrantoPhase: quowarranto.phaseTag,
      quowarrantoScore: quowarranto.quowarrantoScore,
      reason: `Quo warranto "${quowarranto.label}" ${quowarranto.phaseTag} phase ${quowarranto.cursor + 1}/${quowarranto.scenarioIds.length} (score ${quowarranto.quowarrantoScore}).`,
    };
  }

  const habeas = sanitizeHabeasSession(state.habeasSession);
  const habeasScenario = getHabeasScenarioAtCursor(habeas);
  if (habeas && habeas.active && habeasScenario) {
    return {
      kind: 'habeas_step',
      scenarioId: habeasScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      habeasId: habeas.habeasId,
      habeasCursor: habeas.cursor,
      habeasPhase: habeas.phaseTag,
      habeasScore: habeas.habeasScore,
      reason: `Habeas "${habeas.label}" ${habeas.phaseTag} phase ${habeas.cursor + 1}/${habeas.scenarioIds.length} (score ${habeas.habeasScore}).`,
    };
  }

  const prohibition = sanitizeProhibitionSession(state.prohibitionSession);
  const prohibitionScenario = getProhibitionScenarioAtCursor(prohibition);
  if (prohibition && prohibition.active && prohibitionScenario) {
    return {
      kind: 'prohibition_step',
      scenarioId: prohibitionScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      prohibitionId: prohibition.prohibitionId,
      prohibitionCursor: prohibition.cursor,
      prohibitionPhase: prohibition.phaseTag,
      prohibitionScore: prohibition.prohibitionScore,
      reason: `Prohibition "${prohibition.label}" ${prohibition.phaseTag} phase ${prohibition.cursor + 1}/${prohibition.scenarioIds.length} (score ${prohibition.prohibitionScore}).`,
    };
  }

  const mandamus = sanitizeMandamusSession(state.mandamusSession);
  const mandamusScenario = getMandamusScenarioAtCursor(mandamus);
  if (mandamus && mandamus.active && mandamusScenario) {
    return {
      kind: 'mandamus_step',
      scenarioId: mandamusScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      mandamusId: mandamus.mandamusId,
      mandamusCursor: mandamus.cursor,
      mandamusPhase: mandamus.phaseTag,
      mandamusScore: mandamus.mandamusScore,
      reason: `Mandamus "${mandamus.label}" ${mandamus.phaseTag} phase ${mandamus.cursor + 1}/${mandamus.scenarioIds.length} (score ${mandamus.mandamusScore}).`,
    };
  }

  const certiorari = sanitizeCertiorariSession(state.certiorariSession);
  const certiorariScenario = getCertiorariScenarioAtCursor(certiorari);
  if (certiorari && certiorari.active && certiorariScenario) {
    return {
      kind: 'certiorari_step',
      scenarioId: certiorariScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      certiorariId: certiorari.certiorariId,
      certiorariCursor: certiorari.cursor,
      certiorariPhase: certiorari.phaseTag,
      certiorariScore: certiorari.certiorariScore,
      reason: `Certiorari "${certiorari.label}" ${certiorari.phaseTag} phase ${certiorari.cursor + 1}/${certiorari.scenarioIds.length} (score ${certiorari.certiorariScore}).`,
    };
  }

  const supersede = sanitizeSupersedeSession(state.supersedeSession);
  const supersedeScenario = getSupersedeScenarioAtCursor(supersede);
  if (supersede && supersede.active && supersedeScenario) {
    return {
      kind: 'supersede_step',
      scenarioId: supersedeScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      supersedeId: supersede.supersedeId,
      supersedeCursor: supersede.cursor,
      supersedePhase: supersede.phaseTag,
      supersedeScore: supersede.supersedeScore,
      reason: `Supersede "${supersede.label}" ${supersede.phaseTag} phase ${supersede.cursor + 1}/${supersede.scenarioIds.length} (score ${supersede.supersedeScore}).`,
    };
  }

  const quash = sanitizeQuashSession(state.quashSession);
  const quashScenario = getQuashScenarioAtCursor(quash);
  if (quash && quash.active && quashScenario) {
    return {
      kind: 'quash_step',
      scenarioId: quashScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      quashId: quash.quashId,
      quashCursor: quash.cursor,
      quashPhase: quash.phaseTag,
      quashScore: quash.quashScore,
      reason: `Quash "${quash.label}" ${quash.phaseTag} phase ${quash.cursor + 1}/${quash.scenarioIds.length} (score ${quash.quashScore}).`,
    };
  }

  const setAside = sanitizeSetAsideSession(state.setAsideSession);
  const setAsideScenario = getSetAsideScenarioAtCursor(setAside);
  if (setAside && setAside.active && setAsideScenario) {
    return {
      kind: 'setaside_step',
      scenarioId: setAsideScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      setAsideId: setAside.setAsideId,
      setAsideCursor: setAside.cursor,
      setAsidePhase: setAside.phaseTag,
      setAsideScore: setAside.setAsideScore,
      reason: `Set-aside "${setAside.label}" ${setAside.phaseTag} phase ${setAside.cursor + 1}/${setAside.scenarioIds.length} (score ${setAside.setAsideScore}).`,
    };
  }

  const reinstatement = sanitizeReinstatementSession(state.reinstatementSession);
  const reinstatementScenario = getReinstatementScenarioAtCursor(reinstatement);
  if (reinstatement && reinstatement.active && reinstatementScenario) {
    return {
      kind: 'reinstatement_step',
      scenarioId: reinstatementScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      reinstatementId: reinstatement.reinstatementId,
      reinstatementCursor: reinstatement.cursor,
      reinstatementPhase: reinstatement.phaseTag,
      reinstatementScore: reinstatement.reinstatementScore,
      reason: `Reinstatement "${reinstatement.label}" ${reinstatement.phaseTag} phase ${reinstatement.cursor + 1}/${reinstatement.scenarioIds.length} (score ${reinstatement.reinstatementScore}).`,
    };
  }

  const annulment = sanitizeAnnulmentSession(state.annulmentSession);
  const annulmentScenario = getAnnulmentScenarioAtCursor(annulment);
  if (annulment && annulment.active && annulmentScenario) {
    return {
      kind: 'annulment_step',
      scenarioId: annulmentScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      annulmentId: annulment.annulmentId,
      annulmentCursor: annulment.cursor,
      annulmentPhase: annulment.phaseTag,
      annulmentScore: annulment.annulmentScore,
      reason: `Annulment "${annulment.label}" ${annulment.phaseTag} phase ${annulment.cursor + 1}/${annulment.scenarioIds.length} (score ${annulment.annulmentScore}).`,
    };
  }

  const reversal = sanitizeReversalSession(state.reversalSession);
  const reversalScenario = getReversalScenarioAtCursor(reversal);
  if (reversal && reversal.active && reversalScenario) {
    return {
      kind: 'reversal_step',
      scenarioId: reversalScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      reversalId: reversal.reversalId,
      reversalCursor: reversal.cursor,
      reversalPhase: reversal.phaseTag,
      reversalScore: reversal.reversalScore,
      reason: `Reversal "${reversal.label}" ${reversal.phaseTag} phase ${reversal.cursor + 1}/${reversal.scenarioIds.length} (score ${reversal.reversalScore}).`,
    };
  }

  const remand = sanitizeRemandSession(state.remandSession);
  const remandScenario = getRemandScenarioAtCursor(remand);
  if (remand && remand.active && remandScenario) {
    return {
      kind: 'remand_step',
      scenarioId: remandScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      remandId: remand.remandId,
      remandCursor: remand.cursor,
      remandPhase: remand.phaseTag,
      remandWeight: remand.weightScore,
      reason: `Remand "${remand.label}" ${remand.phaseTag} phase ${remand.cursor + 1}/${remand.scenarioIds.length} (weight ${remand.weightScore}).`,
    };
  }

  const vacatur = sanitizeVacaturSession(state.vacaturSession);
  const vacaturScenario = getVacaturScenarioAtCursor(vacatur);
  if (vacatur && vacatur.active && vacaturScenario) {
    return {
      kind: 'vacatur_step',
      scenarioId: vacaturScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      vacaturId: vacatur.vacaturId,
      vacaturCursor: vacatur.cursor,
      vacaturPhase: vacatur.phaseTag,
      vacaturMerit: vacatur.meritScore,
      reason: `Vacatur "${vacatur.label}" ${vacatur.phaseTag} phase ${vacatur.cursor + 1}/${vacatur.scenarioIds.length} (merit ${vacatur.meritScore}).`,
    };
  }

  const expungement = sanitizeExpungementSession(state.expungementSession);
  const expungementScenario = getExpungementScenarioAtCursor(expungement);
  if (expungement && expungement.active && expungementScenario) {
    return {
      kind: 'expungement_step',
      scenarioId: expungementScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      expungementId: expungement.expungementId,
      expungementCursor: expungement.cursor,
      expungementPhase: expungement.phaseTag,
      expungementSeal: expungement.sealScore,
      reason: `Expungement "${expungement.label}" ${expungement.phaseTag} phase ${expungement.cursor + 1}/${expungement.scenarioIds.length} (seal ${expungement.sealScore}).`,
    };
  }

  const exoneration = sanitizeExonerationSession(state.exonerationSession);
  const exonerationScenario = getExonerationScenarioAtCursor(exoneration);
  if (exoneration && exoneration.active && exonerationScenario) {
    return {
      kind: 'exoneration_step',
      scenarioId: exonerationScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      exonerationId: exoneration.exonerationId,
      exonerationCursor: exoneration.cursor,
      exonerationPhase: exoneration.phaseTag,
      exonerationRestitution: exoneration.restitutionScore,
      reason: `Exoneration "${exoneration.label}" ${exoneration.phaseTag} phase ${exoneration.cursor + 1}/${exoneration.scenarioIds.length} (restitution ${exoneration.restitutionScore}).`,
    };
  }

  const acquittal = sanitizeAcquittalSession(state.acquittalSession);
  const acquittalScenario = getAcquittalScenarioAtCursor(acquittal);
  if (acquittal && acquittal.active && acquittalScenario) {
    return {
      kind: 'acquittal_step',
      scenarioId: acquittalScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      acquittalId: acquittal.acquittalId,
      acquittalCursor: acquittal.cursor,
      acquittalPhase: acquittal.phaseTag,
      acquittalVerdict: acquittal.verdictScore,
      reason: `Acquittal "${acquittal.label}" ${acquittal.phaseTag} phase ${acquittal.cursor + 1}/${acquittal.scenarioIds.length} (verdict ${acquittal.verdictScore}).`,
    };
  }

  const commutation = sanitizeCommutationSession(state.commutationSession);
  const commutationScenario = getCommutationScenarioAtCursor(commutation);
  if (commutation && commutation.active && commutationScenario) {
    return {
      kind: 'commutation_step',
      scenarioId: commutationScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      commutationId: commutation.commutationId,
      commutationCursor: commutation.cursor,
      commutationPhase: commutation.phaseTag,
      commutationLeniency: commutation.leniencyScore,
      reason: `Commutation "${commutation.label}" ${commutation.phaseTag} phase ${commutation.cursor + 1}/${commutation.scenarioIds.length} (leniency ${commutation.leniencyScore}).`,
    };
  }

  const probation = sanitizeProbationSession(state.probationSession);
  const probationScenario = getProbationScenarioAtCursor(probation);
  if (probation && probation.active && probationScenario) {
    return {
      kind: 'probation_step',
      scenarioId: probationScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      probationId: probation.probationId,
      probationCursor: probation.cursor,
      probationPhase: probation.phaseTag,
      probationCompliance: probation.complianceScore,
      reason: `Probation "${probation.label}" ${probation.phaseTag} phase ${probation.cursor + 1}/${probation.scenarioIds.length} (compliance ${probation.complianceScore}).`,
    };
  }

  const parole = sanitizeParoleSession(state.paroleSession);
  const paroleScenario = getParoleScenarioAtCursor(parole);
  if (parole && parole.active && paroleScenario) {
    return {
      kind: 'parole_step',
      scenarioId: paroleScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      paroleId: parole.paroleId,
      paroleCursor: parole.cursor,
      parolePhase: parole.phaseTag,
      paroleTrust: parole.trustScore,
      reason: `Parole "${parole.label}" ${parole.phaseTag} phase ${parole.cursor + 1}/${parole.scenarioIds.length} (trust ${parole.trustScore}).`,
    };
  }

  const reprieve = sanitizeReprieveSession(state.reprieveSession);
  const reprieveScenario = getReprieveScenarioAtCursor(reprieve);
  if (reprieve && reprieve.active && reprieveScenario) {
    return {
      kind: 'reprieve_step',
      scenarioId: reprieveScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      reprieveId: reprieve.reprieveId,
      reprieveCursor: reprieve.cursor,
      reprievePhase: reprieve.phaseTag,
      reprieveRelief: reprieve.reliefScore,
      reason: `Reprieve "${reprieve.label}" ${reprieve.phaseTag} phase ${reprieve.cursor + 1}/${reprieve.scenarioIds.length} (relief ${reprieve.reliefScore}).`,
    };
  }

  const amnesty = sanitizeAmnestySession(state.amnestySession);
  const amnestyScenario = getAmnestyScenarioAtCursor(amnesty);
  if (amnesty && amnesty.active && amnestyScenario) {
    return {
      kind: 'amnesty_step',
      scenarioId: amnestyScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      amnestyId: amnesty.amnestyId,
      amnestyCursor: amnesty.cursor,
      amnestyPhase: amnesty.phaseTag,
      amnestyAbsolution: amnesty.absolutionScore,
      reason: `Amnesty "${amnesty.label}" ${amnesty.phaseTag} phase ${amnesty.cursor + 1}/${amnesty.scenarioIds.length} (absolution ${amnesty.absolutionScore}).`,
    };
  }

  const pardon = sanitizePardonSession(state.pardonSession);
  const pardonScenario = getPardonScenarioAtCursor(pardon);
  if (pardon && pardon.active && pardonScenario) {
    return {
      kind: 'pardon_step',
      scenarioId: pardonScenario,
      chainId: state.chainProgress?.chainId ?? null,
      chainStepIndex: state.chainProgress?.activeStepIndex ?? null,
      slotId: state.activeCampaignSlotId ?? null,
      ...emptyQueuePlan,
      pardonId: pardon.pardonId,
      pardonCursor: pardon.cursor,
      pardonPhase: pardon.phaseTag,
      pardonGrace: pardon.graceScore,
      reason: `Pardon "${pardon.label}" ${pardon.phaseTag} phase ${pardon.cursor + 1}/${pardon.scenarioIds.length} (grace ${pardon.graceScore}).`,
    };
  }

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
  pardonActive: boolean;
  amnestyActive: boolean;
  reprieveActive: boolean;
  paroleActive: boolean;
  probationActive: boolean;
  commutationActive: boolean;
  acquittalActive: boolean;
  exonerationActive: boolean;
  expungementActive: boolean;
  vacaturActive: boolean;
  remandActive: boolean;
  reversalActive: boolean;
  annulmentActive: boolean;
  reinstatementActive: boolean;
  setAsideActive: boolean;
  quashActive: boolean;
  supersedeActive: boolean;
  certiorariActive: boolean;
  mandamusActive: boolean;
  prohibitionActive: boolean;
  habeasActive: boolean;
  quowarrantoActive: boolean;
  injunctionActive: boolean;
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
  const pardon = pardonSessionSummary(state);
  const amnesty = amnestySessionSummary(state);
  const reprieve = reprieveSessionSummary(state);
  const parole = paroleSessionSummary(state);
  const probation = probationSessionSummary(state);
  const commutation = commutationSessionSummary(state);
  const acquittal = acquittalSessionSummary(state);
  const exoneration = exonerationSessionSummary(state);
  const expungement = expungementSessionSummary(state);
  const vacatur = vacaturSessionSummary(state);
  const remand = remandSessionSummary(state);
  const reversal = reversalSessionSummary(state);
  const annulment = annulmentSessionSummary(state);
  const reinstatement = reinstatementSessionSummary(state);
  const setAside = setAsideSessionSummary(state);
  const quash = quashSessionSummary(state);
  const supersede = supersedeSessionSummary(state);
  const certiorari = certiorariSessionSummary(state);
  const mandamus = mandamusSessionSummary(state);
  const prohibition = prohibitionSessionSummary(state);
  const habeas = habeasSessionSummary(state);
  const quowarranto = quowarrantoSessionSummary(state);
  const injunction = injunctionSessionSummary(state);
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
    pardonActive: pardon.active,
    amnestyActive: amnesty.active,
    reprieveActive: reprieve.active,
    paroleActive: parole.active,
    probationActive: probation.active,
    commutationActive: commutation.active,
    acquittalActive: acquittal.active,
    exonerationActive: exoneration.active,
    expungementActive: expungement.active,
    vacaturActive: vacatur.active,
    remandActive: remand.active,
    reversalActive: reversal.active,
    annulmentActive: annulment.active,
    reinstatementActive: reinstatement.active,
    setAsideActive: setAside.active,
    quashActive: quash.active,
    supersedeActive: supersede.active,
    certiorariActive: certiorari.active,
    mandamusActive: mandamus.active,
    prohibitionActive: prohibition.active,
    habeasActive: habeas.active,
    quowarrantoActive: quowarranto.active,
    injunctionActive: injunction.active,
    replayTracked: (state.replayLedger ?? []).length,
    unlockTokens: tokens.length,
    nextPlan,
  };
}
