import {
  GTEL_ACCESS_RANK,
  GTEL_BASE_COMMODITY_INDEX,
  GTEL_COMMODITIES,
  GTEL_COMMODITY_LABEL,
  GTEL_LIMITS,
  GTEL_PARTNER_DEFS,
} from './constants.ts';
import {
  deriveDiplomaticTradeModifiers,
  gtelAccessBandFromScore,
  gtelActiveDeals,
  gtelNetworkModifier,
  gtelRecentViolations,
} from './diplomacy-linkage.ts';
import { computeRegionalDomesticImpacts, summarizeDomesticConsequences } from './domestic-consequences.ts';
import { applyScheduledScenarios, getCommodityShockScenario } from './commodity-shock-scenarios.ts';
import { createEmptyGTELPersisted, sanitizeGTELPersisted } from './persist.ts';
import { advancePartnerSanctions, deriveSanctionModifiers } from './sanctions.ts';
import { advancePartnerTrustScores, deriveTrustAccessModifiers } from './partner-trust.ts';
import { autoTradePolicyAdjustments, deriveTradePolicyModifiers, listActiveTradePolicies } from './trade-policy.ts';
import {
  advanceTradeDisputes,
  autoOpenDisputesFromSanctions,
  countOpenTradeDisputes,
} from './trade-disputes.ts';
import { advanceTradeComplianceRecord, complianceReviewNotes, deriveCompliancePartnerPenalty } from './trade-compliance.ts';
import {
  applyLogisticsToCommodityQuotes,
  computeLogisticsStress,
  logisticsWorldEvent,
} from './export-logistics.ts';
import { computeTradeBalanceSnapshot, tradeBalanceGiNotes } from './trade-balance.ts';
import {
  advanceDiplomaticEngagement,
  deriveEngagementPartnerModifiers,
  diplomaticEngagementGiNotes,
} from './diplomatic-engagement.ts';
import {
  computeImportDependencySnapshot,
  importDependencyConsumerPressure,
  importDependencyGiNotes,
} from './import-dependency.ts';
import {
  advancePartnerMixMemory,
  computeMarketDiversificationSnapshot,
  deriveDiversificationPartnerModifiers,
  diversificationWorldEvent,
  marketDiversificationGiNotes,
} from './market-diversification.ts';
import {
  computeTradeFinanceSnapshot,
  tradeFinanceDomesticStress,
  tradeFinanceExportScale,
  tradeFinanceGiNotes,
} from './trade-finance.ts';
import {
  computeTermsOfTradeSnapshot,
  termsOfTradeGiNotes,
  termsOfTradeHouseholdModifier,
  termsOfTradeWorldEvent,
} from './terms-of-trade.ts';
import {
  computeSupplyChainResilienceSnapshot,
  supplyChainResilienceDomesticStress,
  supplyChainResilienceExportScale,
  supplyChainResilienceGiNotes,
  supplyChainResilienceWorldEvent,
} from './supply-chain-resilience.ts';
import {
  computeForeignExchangeSnapshot,
  foreignExchangeDomesticStress,
  foreignExchangeExportScale,
  foreignExchangeGiNotes,
  foreignExchangeHouseholdModifier,
  foreignExchangeWorldEvent,
} from './foreign-exchange-pressure.ts';
import {
  computeTradeRetaliationSnapshot,
  deriveRetaliationPartnerModifiers,
  tradeRetaliationGiNotes,
  tradeRetaliationWorldEvent,
} from './trade-retaliation.ts';
import {
  computeTradeDeescalationSnapshot,
  deriveDeescalationPartnerModifiers,
  tradeDeescalationGiNotes,
  tradeDeescalationWorldEvent,
} from './trade-deescalation.ts';
import {
  applyExportCapacityToCommodityQuotes,
  computeExportCapacitySnapshot,
  exportCapacityDomesticStress,
  exportCapacityExportScale,
  exportCapacityGiNotes,
  exportCapacityWorldEvent,
} from './export-capacity-allocation.ts';
import {
  computeTradeReconciliationSnapshot,
  deriveReconciliationPartnerModifiers,
  reconciliationEffectiveDisputeCount,
  tradeReconciliationGiNotes,
  tradeReconciliationWorldEvent,
} from './trade-reconciliation.ts';
import {
  computeMaritimeRiskSnapshot,
  maritimeRiskDomesticStress,
  maritimeRiskExportScale,
  maritimeRiskGiNotes,
  maritimeRiskWorldEvent,
} from './maritime-risk-premium.ts';
import {
  applyPreferentialUtilizationToCommodityQuotes,
  computePreferentialUtilizationSnapshot,
  preferentialUtilizationExportScale,
  preferentialUtilizationGiNotes,
  preferentialUtilizationWorldEvent,
} from './preferential-access-utilization.ts';
import {
  computeTradeEnforcementSnapshot,
  deriveEnforcementPartnerModifiers,
  enforcementExportScale,
  tradeEnforcementGiNotes,
  tradeEnforcementWorldEvent,
} from './trade-enforcement-intensity.ts';
import {
  computeExportInsuranceStackSnapshot,
  exportInsuranceStackDomesticStress,
  exportInsuranceStackExportScale,
  exportInsuranceStackGiNotes,
  exportInsuranceStackWorldEvent,
} from './export-credit-insurance-stack.ts';
import {
  computePartnerAccessRestorationSnapshot,
  deriveAccessRestorationPartnerModifiers,
  partnerAccessRestorationGiNotes,
  partnerAccessRestorationWorldEvent,
} from './partner-access-restoration.ts';
import {
  computeSanctionsSpilloverSnapshot,
  deriveSanctionsSpilloverPartnerModifiers,
  sanctionsSpilloverExportScale,
  sanctionsSpilloverGiNotes,
  sanctionsSpilloverWorldEvent,
} from './sanctions-spillover-depth.ts';
import {
  computeTradeCorridorResilienceSnapshot,
  tradeCorridorDomesticStress,
  tradeCorridorExportScale,
  tradeCorridorGiNotes,
  tradeCorridorWorldEvent,
} from './trade-corridor-resilience.ts';
import {
  computeTradeFxHedgingSnapshot,
  tradeFxHedgingExportScale,
  tradeFxHedgingGiNotes,
  tradeFxHedgingHouseholdModifier,
  tradeFxHedgingWorldEvent,
} from './trade-fx-hedging.ts';
import {
  computeImportLanePressureSnapshot,
  importLanePressureDomesticStress,
  importLanePressureExportScale,
  importLanePressureGiNotes,
  importLanePressureWorldEvent,
} from './import-lane-pressure.ts';
import {
  computeDiplomaticTradeCoherenceSnapshot,
  diplomaticTradeCoherenceDomesticStressRelief,
  diplomaticTradeCoherenceExportScale,
  diplomaticTradeCoherenceGiNotes,
  diplomaticTradeCoherenceWorldEvent,
} from './diplomatic-trade-coherence.ts';
import {
  computeTradeBalanceStabilizationSnapshot,
  tradeBalanceStabilizationDomesticStress,
  tradeBalanceStabilizationExportScale,
  tradeBalanceStabilizationGiNotes,
  tradeBalanceStabilizationWorldEvent,
} from './trade-balance-stabilization.ts';
import {
  computeTradeShockAbsorptionSnapshot,
  tradeShockAbsorptionDomesticStressRelief,
  tradeShockAbsorptionExportScale,
  tradeShockAbsorptionGiNotes,
  tradeShockAbsorptionWorldEvent,
} from './trade-shock-absorption.ts';
import {
  computeTradeCommitmentPipelineSnapshot,
  exportCommitmentPipelineDomesticStress,
  exportCommitmentPipelineExportScale,
  exportCommitmentPipelineGiNotes,
  exportCommitmentPipelineWorldEvent,
} from './export-commitment-pipeline.ts';
import {
  computeImportCommitmentPipelineSnapshot,
  importCommitmentPipelineDomesticStress,
  importCommitmentPipelineExportScale,
  importCommitmentPipelineGiNotes,
  importCommitmentPipelineWorldEvent,
} from './import-commitment-pipeline.ts';
import {
  computeTradeFlowCohesionSnapshot,
  tradeFlowCohesionDomesticStressRelief,
  tradeFlowCohesionExportScale,
  tradeFlowCohesionGiNotes,
  tradeFlowCohesionWorldEvent,
} from './trade-flow-cohesion.ts';
import {
  computeTradeThroughputOrchestrationSnapshot,
  tradeThroughputOrchestrationDomesticStress,
  tradeThroughputOrchestrationExportScale,
  tradeThroughputOrchestrationGiNotes,
  tradeThroughputOrchestrationWorldEvent,
} from './trade-throughput-orchestration.ts';
import {
  computeCommitmentLedgerHarmonizationSnapshot,
  commitmentLedgerHarmonizationDomesticStressRelief,
  commitmentLedgerHarmonizationExportScale,
  commitmentLedgerHarmonizationGiNotes,
  commitmentLedgerHarmonizationWorldEvent,
} from './commitment-ledger-harmonization.ts';
import {
  computeBilateralCargoSchedulingSnapshot,
  bilateralCargoSchedulingDomesticStress,
  bilateralCargoSchedulingExportScale,
  bilateralCargoSchedulingGiNotes,
  bilateralCargoSchedulingWorldEvent,
} from './bilateral-cargo-scheduling.ts';
import {
  computeCommitmentTurnCloseoutSnapshot,
  commitmentTurnCloseoutDomesticStressRelief,
  commitmentTurnCloseoutExportScale,
  commitmentTurnCloseoutGiNotes,
  commitmentTurnCloseoutWorldEvent,
} from './commitment-turn-closeout.ts';
import {
  computeForwardSlotRolloverSnapshot,
  forwardSlotRolloverDomesticStress,
  forwardSlotRolloverExportScale,
  forwardSlotRolloverGiNotes,
  forwardSlotRolloverWorldEvent,
} from './forward-slot-rollover.ts';
import {
  computeBilateralSettlementReconciliationSnapshot,
  bilateralSettlementReconciliationDomesticStressRelief,
  bilateralSettlementReconciliationExportScale,
  bilateralSettlementReconciliationGiNotes,
  bilateralSettlementReconciliationWorldEvent,
} from './bilateral-settlement-reconciliation.ts';
import {
  computeTradeSettlementContinuitySnapshot,
  tradeSettlementContinuityDomesticStress,
  tradeSettlementContinuityExportScale,
  tradeSettlementContinuityGiNotes,
  tradeSettlementContinuityWorldEvent,
} from './trade-settlement-continuity.ts';
import {
  computeForwardBookAnchorStabilizationSnapshot,
  forwardBookAnchorStabilizationDomesticStressRelief,
  forwardBookAnchorStabilizationExportScale,
  forwardBookAnchorStabilizationGiNotes,
  forwardBookAnchorStabilizationWorldEvent,
} from './forward-book-anchor-stabilization.ts';
import {
  computeAnchoredBookReadinessSnapshot,
  anchoredBookReadinessDomesticStress,
  anchoredBookReadinessExportScale,
  anchoredBookReadinessGiNotes,
  anchoredBookReadinessWorldEvent,
} from './anchored-book-readiness.ts';
import {
  computeBilateralThroughputCertificationSnapshot,
  bilateralThroughputCertificationDomesticStressRelief,
  bilateralThroughputCertificationExportScale,
  bilateralThroughputCertificationGiNotes,
  bilateralThroughputCertificationWorldEvent,
} from './bilateral-throughput-certification.ts';
import {
  computeCertifiedThroughputSustainmentSnapshot,
  certifiedThroughputSustainmentDomesticStress,
  certifiedThroughputSustainmentExportScale,
  certifiedThroughputSustainmentGiNotes,
  certifiedThroughputSustainmentWorldEvent,
} from './certified-throughput-sustainment.ts';
import {
  computeBilateralCapacityHandoffGateSnapshot,
  bilateralCapacityHandoffGateDomesticStressRelief,
  bilateralCapacityHandoffGateExportScale,
  bilateralCapacityHandoffGateGiNotes,
  bilateralCapacityHandoffGateWorldEvent,
} from './bilateral-capacity-handoff-gate.ts';
import {
  computeCapacityHandoffAbsorptionSnapshot,
  capacityHandoffAbsorptionDomesticStress,
  capacityHandoffAbsorptionExportScale,
  capacityHandoffAbsorptionGiNotes,
  capacityHandoffAbsorptionWorldEvent,
} from './capacity-handoff-absorption.ts';
import {
  computeBilateralTradeWindowContinuitySnapshot,
  bilateralTradeWindowContinuityDomesticStressRelief,
  bilateralTradeWindowContinuityExportScale,
  bilateralTradeWindowContinuityGiNotes,
  bilateralTradeWindowContinuityWorldEvent,
} from './bilateral-trade-window-continuity.ts';
import {
  computeTradeCycleSealVerificationSnapshot,
  tradeCycleSealVerificationDomesticStress,
  tradeCycleSealVerificationExportScale,
  tradeCycleSealVerificationGiNotes,
  tradeCycleSealVerificationWorldEvent,
} from './trade-cycle-seal-verification.ts';
import {
  computeBilateralCapacityRenewalGateSnapshot,
  bilateralCapacityRenewalGateDomesticStressRelief,
  bilateralCapacityRenewalGateExportScale,
  bilateralCapacityRenewalGateGiNotes,
  bilateralCapacityRenewalGateWorldEvent,
} from './bilateral-capacity-renewal-gate.ts';
import {
  computeCapacityRenewalPrimingSnapshot,
  capacityRenewalPrimingDomesticStress,
  capacityRenewalPrimingExportScale,
  capacityRenewalPrimingGiNotes,
  capacityRenewalPrimingWorldEvent,
} from './capacity-renewal-priming.ts';
import {
  computeBilateralCycleReentryGateSnapshot,
  bilateralCycleReentryGateDomesticStressRelief,
  bilateralCycleReentryGateExportScale,
  bilateralCycleReentryGateGiNotes,
  bilateralCycleReentryGateWorldEvent,
} from './bilateral-cycle-reentry-gate.ts';
import {
  computeCycleReentryStabilizationSnapshot,
  cycleReentryStabilizationDomesticStress,
  cycleReentryStabilizationExportScale,
  cycleReentryStabilizationGiNotes,
  cycleReentryStabilizationWorldEvent,
} from './cycle-reentry-stabilization.ts';
import {
  computeBilateralLoopResumptionGateSnapshot,
  bilateralLoopResumptionGateDomesticStressRelief,
  bilateralLoopResumptionGateExportScale,
  bilateralLoopResumptionGateGiNotes,
  bilateralLoopResumptionGateWorldEvent,
} from './bilateral-loop-resumption-gate.ts';
import {
  computeResumedLoopContinuitySnapshot,
  resumedLoopContinuityDomesticStress,
  resumedLoopContinuityExportScale,
  resumedLoopContinuityGiNotes,
  resumedLoopContinuityWorldEvent,
} from './resumed-loop-continuity.ts';
import {
  computeBilateralCycleRestartAcknowledgmentSnapshot,
  bilateralCycleRestartAcknowledgmentDomesticStressRelief,
  bilateralCycleRestartAcknowledgmentExportScale,
  bilateralCycleRestartAcknowledgmentGiNotes,
  bilateralCycleRestartAcknowledgmentWorldEvent,
} from './bilateral-cycle-restart-acknowledgment.ts';
import {
  computeAcknowledgedCyclePrimingSnapshot,
  acknowledgedCyclePrimingDomesticStress,
  acknowledgedCyclePrimingExportScale,
  acknowledgedCyclePrimingGiNotes,
  acknowledgedCyclePrimingWorldEvent,
} from './acknowledged-cycle-priming.ts';
import {
  computeBilateralCommitmentArcOpeningSnapshot,
  bilateralCommitmentArcOpeningDomesticStressRelief,
  bilateralCommitmentArcOpeningExportScale,
  bilateralCommitmentArcOpeningGiNotes,
  bilateralCommitmentArcOpeningWorldEvent,
} from './bilateral-commitment-arc-opening.ts';
import {
  computeCommitmentArcContinuitySnapshot,
  commitmentArcContinuityDomesticStress,
  commitmentArcContinuityExportScale,
  commitmentArcContinuityGiNotes,
  commitmentArcContinuityWorldEvent,
} from './commitment-arc-continuity.ts';
import {
  computeBilateralForwardCommitmentAdmissionSnapshot,
  bilateralForwardCommitmentAdmissionDomesticStressRelief,
  bilateralForwardCommitmentAdmissionExportScale,
  bilateralForwardCommitmentAdmissionGiNotes,
  bilateralForwardCommitmentAdmissionWorldEvent,
} from './bilateral-forward-commitment-admission.ts';
import {
  computeAdmittedForwardCommitmentContinuitySnapshot,
  admittedForwardCommitmentContinuityDomesticStress,
  admittedForwardCommitmentContinuityExportScale,
  admittedForwardCommitmentContinuityGiNotes,
  admittedForwardCommitmentContinuityWorldEvent,
} from './admitted-forward-commitment-continuity.ts';
import {
  computeBilateralCommitmentWindowHandoffSnapshot,
  bilateralCommitmentWindowHandoffDomesticStressRelief,
  bilateralCommitmentWindowHandoffExportScale,
  bilateralCommitmentWindowHandoffGiNotes,
  bilateralCommitmentWindowHandoffWorldEvent,
} from './bilateral-commitment-window-handoff.ts';
import {
  computeCommitmentWindowSustainmentSnapshot,
  commitmentWindowSustainmentDomesticStress,
  commitmentWindowSustainmentExportScale,
  commitmentWindowSustainmentGiNotes,
  commitmentWindowSustainmentWorldEvent,
} from './commitment-window-sustainment.ts';
import {
  computeBilateralForwardCycleAdvanceGateSnapshot,
  bilateralForwardCycleAdvanceGateDomesticStressRelief,
  bilateralForwardCycleAdvanceGateExportScale,
  bilateralForwardCycleAdvanceGateGiNotes,
  bilateralForwardCycleAdvanceGateWorldEvent,
} from './bilateral-forward-cycle-advance-gate.ts';
import {
  computeForwardCycleAdvanceContinuitySnapshot,
  forwardCycleAdvanceContinuityDomesticStress,
  forwardCycleAdvanceContinuityExportScale,
  forwardCycleAdvanceContinuityGiNotes,
  forwardCycleAdvanceContinuityWorldEvent,
} from './forward-cycle-advance-continuity.ts';
import {
  computeBilateralCommitmentLoopReopenGateSnapshot,
  bilateralCommitmentLoopReopenGateDomesticStressRelief,
  bilateralCommitmentLoopReopenGateExportScale,
  bilateralCommitmentLoopReopenGateGiNotes,
  bilateralCommitmentLoopReopenGateWorldEvent,
} from './bilateral-commitment-loop-reopen-gate.ts';
import {
  deriveTradeAgreementModifiers,
  expireStaleAgreements,
  mergeCommodityDeltas,
  mergePartnerDeltas,
} from './trade-agreements.ts';
import type { GTELPartnerMarket, GTELTurnInput, GTELTurnResult } from './types.ts';
import { gtelClamp, gtelHash, gtelNum } from './util.ts';
import {
  applyScheduledShocks,
  deriveShockModifiers,
  getWorldTradeShockDefinition,
  shockWorldEventFromDefinition,
} from './world-shocks.ts';

export { createEmptyGTELPersisted, sanitizeGTELPersisted };

export function advanceGlobalTradeEconomyTurn(input: GTELTurnInput): GTELTurnResult {
  const turn = Math.max(1, Math.floor(gtelNum(input.turn, 1)));
  let persisted = sanitizeGTELPersisted(input.persisted, turn);
  persisted.agreements = expireStaleAgreements(persisted, turn);
  const shockSchedule = applyScheduledShocks(persisted, turn);
  persisted = shockSchedule.persisted;
  const scenarioSchedule = applyScheduledScenarios(persisted, turn);
  persisted = scenarioSchedule.persisted;

  const sanctionStep = advancePartnerSanctions(persisted, input.diplomacyState, turn);
  persisted = sanctionStep.persisted;

  const preSanctions = deriveSanctionModifiers(persisted);
  persisted = autoOpenDisputesFromSanctions(persisted, turn, preSanctions.activeTiers);
  persisted = advancePartnerTrustScores(persisted, input.diplomacyState, turn, preSanctions.activeTiers);
  persisted = autoTradePolicyAdjustments(persisted, turn);
  const disputeStep = advanceTradeDisputes(persisted, turn, preSanctions.activeTiers);
  persisted = disputeStep.persisted;
  persisted = advanceTradeComplianceRecord(persisted, input.diplomacyState, turn);
  const engagementStep = advanceDiplomaticEngagement(persisted, input.diplomacyState, turn);
  persisted = engagementStep.persisted;

  const openDisputesEarly = countOpenTradeDisputes(persisted);
  const activeSanctionCountEarly = Object.values(preSanctions.activeTiers).filter(t => t && t !== 'none').length;
  const retaliationStep = computeTradeRetaliationSnapshot({
    openDisputeCount: openDisputesEarly,
    activeSanctionCount: activeSanctionCountEarly,
    engagement: engagementStep.state,
    persisted,
  });
  persisted = retaliationStep.persisted;
  const retaliationMods = deriveRetaliationPartnerModifiers(retaliationStep.snapshot);
  const tradeRetaliation = retaliationStep.snapshot;

  const deescalationStep = computeTradeDeescalationSnapshot({
    openDisputeCount: openDisputesEarly,
    engagement: engagementStep.state,
    tradeRetaliation,
    complianceScore: gtelNum(persisted.tradeCompliance?.score, 0.62),
    persisted,
  });
  persisted = deescalationStep.persisted;
  const deescalationMods = deriveDeescalationPartnerModifiers(deescalationStep.snapshot);
  const tradeDeescalation = deescalationStep.snapshot;

  const reconciliationStep = computeTradeReconciliationSnapshot({
    openDisputeCount: openDisputesEarly,
    complianceScore: gtelNum(persisted.tradeCompliance?.score, 0.62),
    tradeDeescalation,
    engagement: engagementStep.state,
    persisted,
  });
  persisted = reconciliationStep.persisted;
  const reconciliationMods = deriveReconciliationPartnerModifiers(reconciliationStep.snapshot);
  const tradeReconciliation = reconciliationStep.snapshot;
  const financeDisputeCount = reconciliationEffectiveDisputeCount(openDisputesEarly, tradeReconciliation);

  const restorationStep = computePartnerAccessRestorationSnapshot({
    tradeDeescalation,
    tradeReconciliation,
    persisted,
  });
  persisted = restorationStep.persisted;
  const restorationMods = deriveAccessRestorationPartnerModifiers(restorationStep.snapshot);
  const partnerAccessRestoration = restorationStep.snapshot;

  const enforcementStep = computeTradeEnforcementSnapshot({
    openDisputeCount: openDisputesEarly,
    tradeCompliance: persisted.tradeCompliance,
    tradeRetaliation,
    tradeReconciliation,
    persisted,
  });
  persisted = enforcementStep.persisted;
  const enforcementMods = deriveEnforcementPartnerModifiers(enforcementStep.snapshot);
  const tradeEnforcement = enforcementStep.snapshot;

  const names = input.actorNames || {};
  const dip = deriveDiplomaticTradeModifiers(input.diplomacyState, turn, names);
  const agr = deriveTradeAgreementModifiers(persisted, turn);
  const shock = deriveShockModifiers(persisted);
  const sanctions = deriveSanctionModifiers(persisted);
  const trust = deriveTrustAccessModifiers(persisted);
  const policy = deriveTradePolicyModifiers(persisted);
  const compliancePenalty = deriveCompliancePartnerPenalty(persisted.tradeCompliance);
  const engagement = deriveEngagementPartnerModifiers(engagementStep.state);

  const spilloverStep = computeSanctionsSpilloverSnapshot({
    activeTiers: preSanctions.activeTiers,
    tradeRetaliation,
    tradeEnforcement,
    persisted,
  });
  persisted = spilloverStep.persisted;
  const spilloverMods = deriveSanctionsSpilloverPartnerModifiers(spilloverStep.snapshot);
  const sanctionsSpillover = spilloverStep.snapshot;

  const partnerDeltas = mergePartnerDeltas(
    mergePartnerDeltas(
      mergePartnerDeltas(mergePartnerDeltas(dip.partnerDeltas, agr.partnerDeltas), shock.partnerDeltas),
      sanctions.partnerDeltas,
    ),
    mergePartnerDeltas(
      mergePartnerDeltas(trust.partnerDeltas, policy.partnerDeltas),
      mergePartnerDeltas(
        mergePartnerDeltas(
          mergePartnerDeltas(engagement.partnerDeltas, retaliationMods.partnerDeltas),
          mergePartnerDeltas(
            mergePartnerDeltas(deescalationMods.partnerDeltas, reconciliationMods.partnerDeltas),
            restorationMods.partnerDeltas,
          ),
        ),
        enforcementMods.partnerDeltas,
      ),
    ),
    spilloverMods.partnerDeltas,
  );
  const commodityDeltas = mergeCommodityDeltas(
    mergeCommodityDeltas(
      mergeCommodityDeltas(mergeCommodityDeltas(dip.commodityDeltas, agr.commodityDeltas), shock.commodityDeltas),
      sanctions.commodityDeltas,
    ),
    policy.commodityDeltas,
  );

  const notes = [
    ...dip.notes,
    ...agr.notes,
    ...shock.notes,
    ...sanctions.notes,
    ...trust.notes,
    ...policy.notes,
    ...complianceReviewNotes(persisted.tradeCompliance),
    ...engagement.notes,
  ];
  const net = gtelNetworkModifier(input.nationalSystems);
  const worldEvents: GTELTurnResult['worldEvents'] = [];

  shockSchedule.newShockIds.forEach(id => {
    const def = getWorldTradeShockDefinition(id);
    if (def) worldEvents.push(shockWorldEventFromDefinition(def, turn));
  });
  scenarioSchedule.scenarioIds.forEach(sid => {
    const sc = getCommodityShockScenario(sid);
    if (sc) {
      worldEvents.push({
        id: `gtel_scenario_${sid}_${turn}`,
        turn,
        kind: 'shock',
        title: sc.title,
        summary: sc.summary,
        regionIds: sc.regionIds,
      });
    }
  });
  worldEvents.push(...sanctionStep.events);
  worldEvents.push(...disputeStep.events);
  worldEvents.push(...engagementStep.events);
  const retaliationEvent = tradeRetaliationWorldEvent(tradeRetaliation, turn);
  if (retaliationEvent) worldEvents.push(retaliationEvent);
  const deescalationEvent = tradeDeescalationWorldEvent(tradeDeescalation, turn);
  if (deescalationEvent) worldEvents.push(deescalationEvent);
  const reconciliationEvent = tradeReconciliationWorldEvent(tradeReconciliation, turn);
  if (reconciliationEvent) worldEvents.push(reconciliationEvent);
  const restorationEvent = partnerAccessRestorationWorldEvent(partnerAccessRestoration, turn);
  if (restorationEvent) worldEvents.push(restorationEvent);
  const enforcementEvent = tradeEnforcementWorldEvent(tradeEnforcement, turn);
  if (enforcementEvent) worldEvents.push(enforcementEvent);
  const spilloverEvent = sanctionsSpilloverWorldEvent(sanctionsSpillover, turn);
  if (spilloverEvent) worldEvents.push(spilloverEvent);

  const partners: GTELPartnerMarket[] = GTEL_PARTNER_DEFS.map(def => {
    const prevBand = persisted.partnerAccess[def.id] || 'normal';
    const prevScore = GTEL_ACCESS_RANK[prevBand] / 4;
    const delta = gtelNum(partnerDeltas[def.id], 0) + (def.id !== 'domestic_premium' ? compliancePenalty : 0);
    const embKey = `embargo_${def.id}`;
    const cooldown = gtelNum(persisted.embargoCooldowns[embKey], 0);
    let penalty = cooldown > 0 ? -0.15 : 0;
    if (cooldown > 0) persisted.embargoCooldowns[embKey] = cooldown - 1;
    const score = gtelClamp(def.baseOpenness * 0.55 + prevScore * 0.25 + delta + net.networkMod + penalty, 0, 1);
    const access = gtelAccessBandFromScore(score);
    persisted.partnerAccess[def.id] = access;
    return { ...def, access, accessScore: score };
  });

  if (dip.notes.some(n => /friction/i.test(n))) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id !== 'domestic_premium') persisted.embargoCooldowns[`embargo_${p.id}`] = GTEL_LIMITS.embargoCooldown;
    });
    worldEvents.push({
      id: `gtel_embargo_${turn}`,
      turn,
      kind: 'diplomacy',
      title: 'Trade access under pressure',
      summary: 'Diplomatic breaches are propagating into tighter export partner gates.',
      regionIds: ['WA', 'QLD', 'NSW'],
    });
  }

  let commodities = GTEL_COMMODITIES.map(commodity => {
    const baseIndex = GTEL_BASE_COMMODITY_INDEX[commodity];
    const prevSmooth = gtelNum(persisted.commoditySmoothing[commodity], baseIndex);
    let partnerModifier = 0;
    partners.forEach(p => {
      const w = gtelNum(p.demandWeights[commodity], 0.5);
      partnerModifier += (GTEL_ACCESS_RANK[p.access] / 4 - 0.5) * w * 0.06 * p.priceSensitivity;
    });
    const diplomacyModifier = gtelNum(commodityDeltas[commodity], 0);
    const agreementModifier = gtelNum(agr.commodityDeltas[commodity], 0);
    const shockModifier = gtelNum(shock.commodityDeltas[commodity], 0);
    const networkModifier = net.networkMod * (commodity === 'services' ? 0.5 : 1);
    const raw =
      baseIndex * (1 + partnerModifier + diplomacyModifier + agreementModifier + shockModifier + networkModifier);
    const effectiveIndex = prevSmooth * (1 - GTEL_LIMITS.smoothing) + raw * GTEL_LIMITS.smoothing;
    persisted.commoditySmoothing[commodity] = gtelClamp(effectiveIndex, 45, 175);
    const trend =
      effectiveIndex > prevSmooth + 1.5 ? 'rising' : effectiveIndex < prevSmooth - 1.5 ? 'falling' : 'stable';
    const evidence = [
      `National trade network: ${net.condition}`,
      `Partner-weighted access applied`,
      diplomacyModifier !== 0 ? 'Diplomatic resource terms adjusted price' : 'No active resource-transfer terms',
      agreementModifier !== 0 ? 'Ratified trade agreement tariff cuts applied' : 'No ratified agreement tariff cuts',
      shockModifier !== 0 ? 'World shock adjusted export index' : 'No active shock on this commodity',
    ];
    return {
      commodity,
      baseIndex,
      partnerModifier,
      diplomacyModifier,
      networkModifier,
      shockModifier,
      agreementModifier,
      effectiveIndex: Math.round(effectiveIndex * 10) / 10,
      trend,
      evidence,
    };
  });

  const openDisputes = countOpenTradeDisputes(persisted);
  const logistics = computeLogisticsStress({
    nationalSystems: input.nationalSystems,
    partners,
    exportThroughput: net.throughput,
    openDisputeCount: openDisputes,
  });
  commodities = applyLogisticsToCommodityQuotes(commodities, logistics);
  const logisticsEvent = logisticsWorldEvent(logistics, turn);
  if (logisticsEvent) worldEvents.push(logisticsEvent);

  const tradeBalance = computeTradeBalanceSnapshot({
    commodities,
    partners,
    logistics,
    exportThroughput: net.throughput,
  });

  persisted = advancePartnerMixMemory(partners, persisted);
  const marketDiversification = computeMarketDiversificationSnapshot({ partners, persisted });
  const diversificationMods = deriveDiversificationPartnerModifiers(marketDiversification);
  const diversificationEvent = diversificationWorldEvent(marketDiversification, turn);
  if (diversificationEvent) worldEvents.push(diversificationEvent);

  const activeSanctionCount = Object.values(sanctions.activeTiers).filter(t => t && t !== 'none').length;
  const financeStep = computeTradeFinanceSnapshot({
    logistics,
    tradeBalance,
    tradeCompliance: persisted.tradeCompliance,
    openDisputeCount: financeDisputeCount,
    activeSanctionCount,
    persisted,
  });
  persisted = financeStep.persisted;
  const tradeFinance = financeStep.snapshot;

  const dependencyStep = computeImportDependencySnapshot({ partners, commodities, persisted });
  persisted = dependencyStep.persisted;
  const importDependency = dependencyStep.snapshot;
  const importPressure = importDependencyConsumerPressure(importDependency);

  const importLaneStep = computeImportLanePressureSnapshot({
    importDependency,
    logistics,
    tradeEnforcement,
    persisted,
  });
  persisted = importLaneStep.persisted;
  const importLanePressure = importLaneStep.snapshot;
  const importLaneEvent = importLanePressureWorldEvent(importLanePressure, turn);
  if (importLaneEvent) worldEvents.push(importLaneEvent);

  const termsStep = computeTermsOfTradeSnapshot({
    commodities,
    tradeBalance,
    importDependency,
    persisted,
  });
  persisted = termsStep.persisted;
  const termsOfTrade = termsStep.snapshot;
  const termsEvent = termsOfTradeWorldEvent(termsOfTrade, turn);
  if (termsEvent) worldEvents.push(termsEvent);

  const resilienceStep = computeSupplyChainResilienceSnapshot({
    logistics,
    marketDiversification,
    importDependency,
    openDisputeCount: openDisputes,
    persisted,
  });
  persisted = resilienceStep.persisted;
  const supplyChainResilience = resilienceStep.snapshot;
  const resilienceEvent = supplyChainResilienceWorldEvent(supplyChainResilience, turn);
  if (resilienceEvent) worldEvents.push(resilienceEvent);

  const fxStep = computeForeignExchangeSnapshot({
    termsOfTrade,
    tradeBalance,
    tradeFinance,
    persisted,
  });
  persisted = fxStep.persisted;
  const foreignExchange = fxStep.snapshot;
  const fxEvent = foreignExchangeWorldEvent(foreignExchange, turn);
  if (fxEvent) worldEvents.push(fxEvent);

  const fxHedgingStep = computeTradeFxHedgingSnapshot({
    foreignExchange,
    termsOfTrade,
    tradeFinance,
    persisted,
  });
  persisted = fxHedgingStep.persisted;
  const tradeFxHedging = fxHedgingStep.snapshot;
  const fxHedgingEvent = tradeFxHedgingWorldEvent(tradeFxHedging, turn);
  if (fxHedgingEvent) worldEvents.push(fxHedgingEvent);

  const capacityStep = computeExportCapacitySnapshot({
    commodities,
    partners,
    logistics,
    termsOfTrade,
    marketDiversification,
    exportThroughput: logistics.effectiveExportThroughput,
    persisted,
  });
  persisted = capacityStep.persisted;
  const exportCapacity = capacityStep.snapshot;
  commodities = applyExportCapacityToCommodityQuotes(commodities, exportCapacity);
  const capacityEvent = exportCapacityWorldEvent(exportCapacity, turn);
  if (capacityEvent) worldEvents.push(capacityEvent);

  const maritimeStep = computeMaritimeRiskSnapshot({
    logistics,
    tradeRetaliation,
    activeSanctionCount,
    exportCapacity,
    persisted,
  });
  persisted = maritimeStep.persisted;
  const maritimeRisk = maritimeStep.snapshot;
  const maritimeEvent = maritimeRiskWorldEvent(maritimeRisk, turn);
  if (maritimeEvent) worldEvents.push(maritimeEvent);

  const corridorStep = computeTradeCorridorResilienceSnapshot({
    logistics,
    maritimeRisk,
    supplyChainResilience,
    marketDiversification,
    persisted,
  });
  persisted = corridorStep.persisted;
  const tradeCorridorResilience = corridorStep.snapshot;
  const corridorEvent = tradeCorridorWorldEvent(tradeCorridorResilience, turn);
  if (corridorEvent) worldEvents.push(corridorEvent);

  const utilizationStep = computePreferentialUtilizationSnapshot({
    turn,
    partners,
    persisted,
    tradeReconciliation,
    marketDiversification,
    exportCapacity,
  });
  persisted = utilizationStep.persisted;
  const preferentialUtilization = utilizationStep.snapshot;
  commodities = applyPreferentialUtilizationToCommodityQuotes(commodities, preferentialUtilization);
  const utilizationEvent = preferentialUtilizationWorldEvent(preferentialUtilization, turn);
  if (utilizationEvent) worldEvents.push(utilizationEvent);

  const insuranceStackStep = computeExportInsuranceStackSnapshot({
    tradeFinance,
    maritimeRisk,
    tradeEnforcement,
    persisted,
  });
  persisted = insuranceStackStep.persisted;
  const exportInsuranceStack = insuranceStackStep.snapshot;
  const insuranceStackEvent = exportInsuranceStackWorldEvent(exportInsuranceStack, turn);
  if (insuranceStackEvent) worldEvents.push(insuranceStackEvent);

  const coherenceStep = computeDiplomaticTradeCoherenceSnapshot({
    engagement: engagementStep.state,
    tradeDeescalation,
    tradeReconciliation,
    partnerAccessRestoration,
    persisted,
  });
  persisted = coherenceStep.persisted;
  const diplomaticTradeCoherence = coherenceStep.snapshot;
  const coherenceEvent = diplomaticTradeCoherenceWorldEvent(diplomaticTradeCoherence, turn);
  if (coherenceEvent) worldEvents.push(coherenceEvent);

  const tradeBalanceAdjusted = computeTradeBalanceSnapshot({
    commodities,
    partners,
    logistics,
    exportThroughput: net.throughput,
  });

  const stabilizationStep = computeTradeBalanceStabilizationSnapshot({
    tradeBalance: tradeBalanceAdjusted,
    termsOfTrade,
    tradeFxHedging,
    exportInsuranceStack,
    tradeReconciliation,
    persisted,
  });
  persisted = stabilizationStep.persisted;
  const tradeBalanceStabilization = stabilizationStep.snapshot;
  const stabilizationEvent = tradeBalanceStabilizationWorldEvent(tradeBalanceStabilization, turn);
  if (stabilizationEvent) worldEvents.push(stabilizationEvent);

  const shockAbsorptionStep = computeTradeShockAbsorptionSnapshot({
    supplyChainResilience,
    tradeFxHedging,
    exportInsuranceStack,
    diplomaticTradeCoherence,
    persisted,
  });
  persisted = shockAbsorptionStep.persisted;
  const tradeShockAbsorption = shockAbsorptionStep.snapshot;
  const shockAbsorptionEvent = tradeShockAbsorptionWorldEvent(tradeShockAbsorption, turn);
  if (shockAbsorptionEvent) worldEvents.push(shockAbsorptionEvent);

  const commitmentStep = computeTradeCommitmentPipelineSnapshot({
    exportCapacity,
    preferentialUtilization,
    tradeFinance,
    tradeCorridorResilience,
    persisted,
  });
  persisted = commitmentStep.persisted;
  const exportCommitmentPipeline = commitmentStep.snapshot;
  const commitmentEvent = exportCommitmentPipelineWorldEvent(exportCommitmentPipeline, turn);
  if (commitmentEvent) worldEvents.push(commitmentEvent);

  const importCommitmentStep = computeImportCommitmentPipelineSnapshot({
    importDependency,
    importLanePressure,
    tradeFinance,
    supplyChainResilience,
    persisted,
  });
  persisted = importCommitmentStep.persisted;
  const importCommitmentPipeline = importCommitmentStep.snapshot;
  const importCommitmentEvent = importCommitmentPipelineWorldEvent(importCommitmentPipeline, turn);
  if (importCommitmentEvent) worldEvents.push(importCommitmentEvent);

  const flowCohesionStep = computeTradeFlowCohesionSnapshot({
    exportCommitmentPipeline,
    importCommitmentPipeline,
    tradeBalanceStabilization,
    tradeShockAbsorption,
    persisted,
  });
  persisted = flowCohesionStep.persisted;
  const tradeFlowCohesion = flowCohesionStep.snapshot;
  const flowCohesionEvent = tradeFlowCohesionWorldEvent(tradeFlowCohesion, turn);
  if (flowCohesionEvent) worldEvents.push(flowCohesionEvent);

  const orchestrationStep = computeTradeThroughputOrchestrationSnapshot({
    exportCommitmentPipeline,
    importCommitmentPipeline,
    tradeFlowCohesion,
    logistics,
    persisted,
  });
  persisted = orchestrationStep.persisted;
  const tradeThroughputOrchestration = orchestrationStep.snapshot;
  const orchestrationEvent = tradeThroughputOrchestrationWorldEvent(tradeThroughputOrchestration, turn);
  if (orchestrationEvent) worldEvents.push(orchestrationEvent);

  const harmonizationStep = computeCommitmentLedgerHarmonizationSnapshot({
    exportCommitmentPipeline,
    importCommitmentPipeline,
    tradeFlowCohesion,
    tradeThroughputOrchestration,
    persisted,
  });
  persisted = harmonizationStep.persisted;
  const commitmentLedgerHarmonization = harmonizationStep.snapshot;
  const harmonizationEvent = commitmentLedgerHarmonizationWorldEvent(commitmentLedgerHarmonization, turn);
  if (harmonizationEvent) worldEvents.push(harmonizationEvent);

  const cargoSchedulingStep = computeBilateralCargoSchedulingSnapshot({
    commitmentLedgerHarmonization,
    tradeThroughputOrchestration,
    logistics,
    persisted,
  });
  persisted = cargoSchedulingStep.persisted;
  const bilateralCargoScheduling = cargoSchedulingStep.snapshot;
  const cargoSchedulingEvent = bilateralCargoSchedulingWorldEvent(bilateralCargoScheduling, turn);
  if (cargoSchedulingEvent) worldEvents.push(cargoSchedulingEvent);

  const closeoutStep = computeCommitmentTurnCloseoutSnapshot({
    exportCommitmentPipeline,
    importCommitmentPipeline,
    commitmentLedgerHarmonization,
    bilateralCargoScheduling,
    persisted,
  });
  persisted = closeoutStep.persisted;
  const commitmentTurnCloseout = closeoutStep.snapshot;
  const closeoutEvent = commitmentTurnCloseoutWorldEvent(commitmentTurnCloseout, turn);
  if (closeoutEvent) worldEvents.push(closeoutEvent);

  const rolloverStep = computeForwardSlotRolloverSnapshot({
    exportCommitmentPipeline,
    importCommitmentPipeline,
    commitmentTurnCloseout,
    persisted,
  });
  persisted = rolloverStep.persisted;
  const forwardSlotRollover = rolloverStep.snapshot;
  const rolloverEvent = forwardSlotRolloverWorldEvent(forwardSlotRollover, turn);
  if (rolloverEvent) worldEvents.push(rolloverEvent);

  const settlementStep = computeBilateralSettlementReconciliationSnapshot({
    forwardSlotRollover,
    bilateralCargoScheduling,
    tradeThroughputOrchestration,
    persisted,
  });
  persisted = settlementStep.persisted;
  const bilateralSettlementReconciliation = settlementStep.snapshot;
  const settlementEvent = bilateralSettlementReconciliationWorldEvent(bilateralSettlementReconciliation, turn);
  if (settlementEvent) worldEvents.push(settlementEvent);

  const continuityStep = computeTradeSettlementContinuitySnapshot({
    bilateralSettlementReconciliation,
    forwardSlotRollover,
    persisted,
  });
  persisted = continuityStep.persisted;
  const tradeSettlementContinuity = continuityStep.snapshot;
  const continuityEvent = tradeSettlementContinuityWorldEvent(tradeSettlementContinuity, turn);
  if (continuityEvent) worldEvents.push(continuityEvent);

  const anchorStep = computeForwardBookAnchorStabilizationSnapshot({
    tradeSettlementContinuity,
    commitmentLedgerHarmonization,
    persisted,
  });
  persisted = anchorStep.persisted;
  const forwardBookAnchorStabilization = anchorStep.snapshot;
  const anchorEvent = forwardBookAnchorStabilizationWorldEvent(forwardBookAnchorStabilization, turn);
  if (anchorEvent) worldEvents.push(anchorEvent);

  const readinessStep = computeAnchoredBookReadinessSnapshot({
    forwardBookAnchorStabilization,
    tradeSettlementContinuity,
    tradeThroughputOrchestration,
    persisted,
  });
  persisted = readinessStep.persisted;
  const anchoredBookReadiness = readinessStep.snapshot;
  const readinessEvent = anchoredBookReadinessWorldEvent(anchoredBookReadiness, turn);
  if (readinessEvent) worldEvents.push(readinessEvent);

  const certificationStep = computeBilateralThroughputCertificationSnapshot({
    anchoredBookReadiness,
    logistics,
    persisted,
  });
  persisted = certificationStep.persisted;
  const bilateralThroughputCertification = certificationStep.snapshot;
  const certificationEvent = bilateralThroughputCertificationWorldEvent(bilateralThroughputCertification, turn);
  if (certificationEvent) worldEvents.push(certificationEvent);

  const sustainmentStep = computeCertifiedThroughputSustainmentSnapshot({
    bilateralThroughputCertification,
    forwardBookAnchorStabilization,
    persisted,
  });
  persisted = sustainmentStep.persisted;
  const certifiedThroughputSustainment = sustainmentStep.snapshot;
  const sustainmentEvent = certifiedThroughputSustainmentWorldEvent(certifiedThroughputSustainment, turn);
  if (sustainmentEvent) worldEvents.push(sustainmentEvent);

  const handoffStep = computeBilateralCapacityHandoffGateSnapshot({
    certifiedThroughputSustainment,
    anchoredBookReadiness,
    persisted,
  });
  persisted = handoffStep.persisted;
  const bilateralCapacityHandoffGate = handoffStep.snapshot;
  const handoffEvent = bilateralCapacityHandoffGateWorldEvent(bilateralCapacityHandoffGate, turn);
  if (handoffEvent) worldEvents.push(handoffEvent);

  const absorptionStep = computeCapacityHandoffAbsorptionSnapshot({
    bilateralCapacityHandoffGate,
    certifiedThroughputSustainment,
    persisted,
  });
  persisted = absorptionStep.persisted;
  const capacityHandoffAbsorption = absorptionStep.snapshot;
  const absorptionEvent = capacityHandoffAbsorptionWorldEvent(capacityHandoffAbsorption, turn);
  if (absorptionEvent) worldEvents.push(absorptionEvent);

  const windowContinuityStep = computeBilateralTradeWindowContinuitySnapshot({
    capacityHandoffAbsorption,
    anchoredBookReadiness,
    persisted,
  });
  persisted = windowContinuityStep.persisted;
  const bilateralTradeWindowContinuity = windowContinuityStep.snapshot;
  const windowContinuityEvent = bilateralTradeWindowContinuityWorldEvent(bilateralTradeWindowContinuity, turn);
  if (windowContinuityEvent) worldEvents.push(windowContinuityEvent);

  const sealStep = computeTradeCycleSealVerificationSnapshot({
    bilateralTradeWindowContinuity,
    certifiedThroughputSustainment,
    persisted,
  });
  persisted = sealStep.persisted;
  const tradeCycleSealVerification = sealStep.snapshot;
  const sealEvent = tradeCycleSealVerificationWorldEvent(tradeCycleSealVerification, turn);
  if (sealEvent) worldEvents.push(sealEvent);

  const renewalStep = computeBilateralCapacityRenewalGateSnapshot({
    tradeCycleSealVerification,
    anchoredBookReadiness,
    persisted,
  });
  persisted = renewalStep.persisted;
  const bilateralCapacityRenewalGate = renewalStep.snapshot;
  const renewalEvent = bilateralCapacityRenewalGateWorldEvent(bilateralCapacityRenewalGate, turn);
  if (renewalEvent) worldEvents.push(renewalEvent);

  const primingStep = computeCapacityRenewalPrimingSnapshot({
    bilateralCapacityRenewalGate,
    certifiedThroughputSustainment,
    persisted,
  });
  persisted = primingStep.persisted;
  const capacityRenewalPriming = primingStep.snapshot;
  const primingEvent = capacityRenewalPrimingWorldEvent(capacityRenewalPriming, turn);
  if (primingEvent) worldEvents.push(primingEvent);

  const reentryStep = computeBilateralCycleReentryGateSnapshot({
    capacityRenewalPriming,
    anchoredBookReadiness,
    persisted,
  });
  persisted = reentryStep.persisted;
  const bilateralCycleReentryGate = reentryStep.snapshot;
  const reentryEvent = bilateralCycleReentryGateWorldEvent(bilateralCycleReentryGate, turn);
  if (reentryEvent) worldEvents.push(reentryEvent);

  const reentryStabilizationStep = computeCycleReentryStabilizationSnapshot({
    bilateralCycleReentryGate,
    tradeCycleSealVerification,
    persisted,
  });
  persisted = reentryStabilizationStep.persisted;
  const cycleReentryStabilization = reentryStabilizationStep.snapshot;
  const reentryStabilizationEvent = cycleReentryStabilizationWorldEvent(cycleReentryStabilization, turn);
  if (reentryStabilizationEvent) worldEvents.push(reentryStabilizationEvent);

  const resumptionStep = computeBilateralLoopResumptionGateSnapshot({
    cycleReentryStabilization,
    capacityRenewalPriming,
    persisted,
  });
  persisted = resumptionStep.persisted;
  const bilateralLoopResumptionGate = resumptionStep.snapshot;
  const resumptionEvent = bilateralLoopResumptionGateWorldEvent(bilateralLoopResumptionGate, turn);
  if (resumptionEvent) worldEvents.push(resumptionEvent);

  const loopContinuityStep = computeResumedLoopContinuitySnapshot({
    bilateralLoopResumptionGate,
    cycleReentryStabilization,
    persisted,
  });
  persisted = loopContinuityStep.persisted;
  const resumedLoopContinuity = loopContinuityStep.snapshot;
  const loopContinuityEvent = resumedLoopContinuityWorldEvent(resumedLoopContinuity, turn);
  if (loopContinuityEvent) worldEvents.push(loopContinuityEvent);

  const restartAckStep = computeBilateralCycleRestartAcknowledgmentSnapshot({
    resumedLoopContinuity,
    anchoredBookReadiness,
    persisted,
  });
  persisted = restartAckStep.persisted;
  const bilateralCycleRestartAcknowledgment = restartAckStep.snapshot;
  const restartAckEvent = bilateralCycleRestartAcknowledgmentWorldEvent(bilateralCycleRestartAcknowledgment, turn);
  if (restartAckEvent) worldEvents.push(restartAckEvent);

  const ackPrimingStep = computeAcknowledgedCyclePrimingSnapshot({
    bilateralCycleRestartAcknowledgment,
    capacityRenewalPriming,
    persisted,
  });
  persisted = ackPrimingStep.persisted;
  const acknowledgedCyclePriming = ackPrimingStep.snapshot;
  const ackPrimingEvent = acknowledgedCyclePrimingWorldEvent(acknowledgedCyclePriming, turn);
  if (ackPrimingEvent) worldEvents.push(ackPrimingEvent);

  const arcOpeningStep = computeBilateralCommitmentArcOpeningSnapshot({
    acknowledgedCyclePriming,
    anchoredBookReadiness,
    persisted,
  });
  persisted = arcOpeningStep.persisted;
  const bilateralCommitmentArcOpening = arcOpeningStep.snapshot;
  const arcOpeningEvent = bilateralCommitmentArcOpeningWorldEvent(bilateralCommitmentArcOpening, turn);
  if (arcOpeningEvent) worldEvents.push(arcOpeningEvent);

  const arcContinuityStep = computeCommitmentArcContinuitySnapshot({
    bilateralCommitmentArcOpening,
    resumedLoopContinuity,
    persisted,
  });
  persisted = arcContinuityStep.persisted;
  const commitmentArcContinuity = arcContinuityStep.snapshot;
  const arcContinuityEvent = commitmentArcContinuityWorldEvent(commitmentArcContinuity, turn);
  if (arcContinuityEvent) worldEvents.push(arcContinuityEvent);

  const forwardAdmissionStep = computeBilateralForwardCommitmentAdmissionSnapshot({
    commitmentArcContinuity,
    bilateralCommitmentArcOpening,
    persisted,
  });
  persisted = forwardAdmissionStep.persisted;
  const bilateralForwardCommitmentAdmission = forwardAdmissionStep.snapshot;
  const forwardAdmissionEvent = bilateralForwardCommitmentAdmissionWorldEvent(
    bilateralForwardCommitmentAdmission,
    turn,
  );
  if (forwardAdmissionEvent) worldEvents.push(forwardAdmissionEvent);

  const admittedContinuityStep = computeAdmittedForwardCommitmentContinuitySnapshot({
    bilateralForwardCommitmentAdmission,
    commitmentArcContinuity,
    persisted,
  });
  persisted = admittedContinuityStep.persisted;
  const admittedForwardCommitmentContinuity = admittedContinuityStep.snapshot;
  const admittedContinuityEvent = admittedForwardCommitmentContinuityWorldEvent(
    admittedForwardCommitmentContinuity,
    turn,
  );
  if (admittedContinuityEvent) worldEvents.push(admittedContinuityEvent);

  const windowHandoffStep = computeBilateralCommitmentWindowHandoffSnapshot({
    admittedForwardCommitmentContinuity,
    bilateralTradeWindowContinuity,
    persisted,
  });
  persisted = windowHandoffStep.persisted;
  const bilateralCommitmentWindowHandoff = windowHandoffStep.snapshot;
  const windowHandoffEvent = bilateralCommitmentWindowHandoffWorldEvent(bilateralCommitmentWindowHandoff, turn);
  if (windowHandoffEvent) worldEvents.push(windowHandoffEvent);

  const windowSustainmentStep = computeCommitmentWindowSustainmentSnapshot({
    bilateralCommitmentWindowHandoff,
    admittedForwardCommitmentContinuity,
    persisted,
  });
  persisted = windowSustainmentStep.persisted;
  const commitmentWindowSustainment = windowSustainmentStep.snapshot;
  const windowSustainmentEvent = commitmentWindowSustainmentWorldEvent(commitmentWindowSustainment, turn);
  if (windowSustainmentEvent) worldEvents.push(windowSustainmentEvent);

  const cycleAdvanceStep = computeBilateralForwardCycleAdvanceGateSnapshot({
    commitmentWindowSustainment,
    tradeCycleSealVerification,
    persisted,
  });
  persisted = cycleAdvanceStep.persisted;
  const bilateralForwardCycleAdvanceGate = cycleAdvanceStep.snapshot;
  const cycleAdvanceEvent = bilateralForwardCycleAdvanceGateWorldEvent(bilateralForwardCycleAdvanceGate, turn);
  if (cycleAdvanceEvent) worldEvents.push(cycleAdvanceEvent);

  const advanceContinuityStep = computeForwardCycleAdvanceContinuitySnapshot({
    bilateralForwardCycleAdvanceGate,
    commitmentWindowSustainment,
    persisted,
  });
  persisted = advanceContinuityStep.persisted;
  const forwardCycleAdvanceContinuity = advanceContinuityStep.snapshot;
  const advanceContinuityEvent = forwardCycleAdvanceContinuityWorldEvent(forwardCycleAdvanceContinuity, turn);
  if (advanceContinuityEvent) worldEvents.push(advanceContinuityEvent);

  const loopReopenStep = computeBilateralCommitmentLoopReopenGateSnapshot({
    forwardCycleAdvanceContinuity,
    bilateralLoopResumptionGate,
    persisted,
  });
  persisted = loopReopenStep.persisted;
  const bilateralCommitmentLoopReopenGate = loopReopenStep.snapshot;
  const loopReopenEvent = bilateralCommitmentLoopReopenGateWorldEvent(bilateralCommitmentLoopReopenGate, turn);
  if (loopReopenEvent) worldEvents.push(loopReopenEvent);

  const financeScaledThroughput =
    Math.round(
      logistics.effectiveExportThroughput *
        tradeFinanceExportScale(tradeFinance) *
        supplyChainResilienceExportScale(supplyChainResilience) *
        foreignExchangeExportScale(foreignExchange) *
        exportCapacityExportScale(exportCapacity) *
        maritimeRiskExportScale(maritimeRisk) *
        preferentialUtilizationExportScale(preferentialUtilization) *
        enforcementExportScale(tradeEnforcement) *
        exportInsuranceStackExportScale(exportInsuranceStack) *
        tradeCorridorExportScale(tradeCorridorResilience) *
        sanctionsSpilloverExportScale(sanctionsSpillover) *
        tradeFxHedgingExportScale(tradeFxHedging) *
        importLanePressureExportScale(importLanePressure) *
        diplomaticTradeCoherenceExportScale(diplomaticTradeCoherence) *
        tradeBalanceStabilizationExportScale(tradeBalanceStabilization) *
        tradeShockAbsorptionExportScale(tradeShockAbsorption) *
        exportCommitmentPipelineExportScale(exportCommitmentPipeline) *
        importCommitmentPipelineExportScale(importCommitmentPipeline) *
        tradeFlowCohesionExportScale(tradeFlowCohesion) *
        tradeThroughputOrchestrationExportScale(tradeThroughputOrchestration) *
        commitmentLedgerHarmonizationExportScale(commitmentLedgerHarmonization) *
        bilateralCargoSchedulingExportScale(bilateralCargoScheduling) *
        commitmentTurnCloseoutExportScale(commitmentTurnCloseout) *
        forwardSlotRolloverExportScale(forwardSlotRollover) *
        bilateralSettlementReconciliationExportScale(bilateralSettlementReconciliation) *
        tradeSettlementContinuityExportScale(tradeSettlementContinuity) *
        forwardBookAnchorStabilizationExportScale(forwardBookAnchorStabilization) *
        anchoredBookReadinessExportScale(anchoredBookReadiness) *
        bilateralThroughputCertificationExportScale(bilateralThroughputCertification) *
        certifiedThroughputSustainmentExportScale(certifiedThroughputSustainment) *
        bilateralCapacityHandoffGateExportScale(bilateralCapacityHandoffGate) *
        capacityHandoffAbsorptionExportScale(capacityHandoffAbsorption) *
        bilateralTradeWindowContinuityExportScale(bilateralTradeWindowContinuity) *
        tradeCycleSealVerificationExportScale(tradeCycleSealVerification) *
        bilateralCapacityRenewalGateExportScale(bilateralCapacityRenewalGate) *
        capacityRenewalPrimingExportScale(capacityRenewalPriming) *
        bilateralCycleReentryGateExportScale(bilateralCycleReentryGate) *
        cycleReentryStabilizationExportScale(cycleReentryStabilization) *
        bilateralLoopResumptionGateExportScale(bilateralLoopResumptionGate) *
        resumedLoopContinuityExportScale(resumedLoopContinuity) *
        bilateralCycleRestartAcknowledgmentExportScale(bilateralCycleRestartAcknowledgment) *
        acknowledgedCyclePrimingExportScale(acknowledgedCyclePriming) *
        bilateralCommitmentArcOpeningExportScale(bilateralCommitmentArcOpening) *
        commitmentArcContinuityExportScale(commitmentArcContinuity) *
        bilateralForwardCommitmentAdmissionExportScale(bilateralForwardCommitmentAdmission) *
        admittedForwardCommitmentContinuityExportScale(admittedForwardCommitmentContinuity) *
        bilateralCommitmentWindowHandoffExportScale(bilateralCommitmentWindowHandoff) *
        commitmentWindowSustainmentExportScale(commitmentWindowSustainment) *
        bilateralForwardCycleAdvanceGateExportScale(bilateralForwardCycleAdvanceGate) *
        forwardCycleAdvanceContinuityExportScale(forwardCycleAdvanceContinuity) *
        bilateralCommitmentLoopReopenGateExportScale(bilateralCommitmentLoopReopenGate) *
        10,
    ) / 10;

  const exportLedPressure = gtelClamp(
    (net.throughput / 120) * 0.4 + partners.filter(p => p.id !== 'domestic_premium' && GTEL_ACCESS_RANK[p.access] >= 3).length * 0.08,
    0,
    1,
  );
  const avgCommodity = commodities.reduce((a, c) => a + c.effectiveIndex, 0) / commodities.length;
  const householdOffset = gtelClamp(
    (avgCommodity - 95) / -80 -
      (shock.domesticStress + sanctions.domesticStress + policy.domesticStress) * 0.15 +
      termsOfTradeHouseholdModifier(termsOfTrade) +
      foreignExchangeHouseholdModifier(foreignExchange) +
      tradeFxHedgingHouseholdModifier(tradeFxHedging),
    -0.25,
    0.35,
  );
  const exportSectorBoom = exportLedPressure > 0.55 && avgCommodity > 98;
  let exportVsDomesticModel: import('./types.ts').GTELDomesticCoupling['exportVsDomesticModel'] = 'domestically_balanced';
  if (exportSectorBoom && householdOffset < -0.05) exportVsDomesticModel = 'export_led';
  else if (householdOffset > 0.12 && exportLedPressure < 0.35) exportVsDomesticModel = 'household_led';
  else if (net.condition === 'critical' || net.condition === 'bottlenecked') exportVsDomesticModel = 'constrained';

  const transportHealthDelta = gtelClamp(net.networkMod * 12 + (exportSectorBoom ? 2 : 0), -8, 6);
  let domesticSummary =
    exportVsDomesticModel === 'export_led'
      ? 'Export channels are hot; watch whether household demand keeps pace.'
      : exportVsDomesticModel === 'constrained'
        ? 'Trade bottlenecks are capping exports and squeezing domestic spillover.'
        : exportVsDomesticModel === 'household_led'
          ? 'Domestic channels carry more of national income than export premiums right now.'
          : 'Exports and domestic demand are roughly in balance.';
  const domestic = {
    exportLedPressure,
    householdOffset,
    exportSectorBoom,
    exportVsDomesticModel,
    transportHealthDelta,
    summary: domesticSummary,
  };

  const regionalImpacts = computeRegionalDomesticImpacts({
    commodities,
    partners,
    domestic,
    nationalSystems: input.nationalSystems,
    shockStress:
      shock.domesticStress +
      sanctions.domesticStress +
      Math.max(0, policy.domesticStress) +
      importPressure +
      diversificationMods.domesticStress +
      tradeFinanceDomesticStress(tradeFinance) +
      supplyChainResilienceDomesticStress(supplyChainResilience) +
      foreignExchangeDomesticStress(foreignExchange) +
      retaliationMods.domesticStress -
      deescalationMods.domesticStressRelief -
      reconciliationMods.domesticStressRelief -
      restorationMods.domesticStressRelief -
      diplomaticTradeCoherenceDomesticStressRelief(diplomaticTradeCoherence) -
      tradeShockAbsorptionDomesticStressRelief(tradeShockAbsorption) +
      tradeFlowCohesionDomesticStressRelief(tradeFlowCohesion) +
      commitmentLedgerHarmonizationDomesticStressRelief(commitmentLedgerHarmonization) +
      commitmentTurnCloseoutDomesticStressRelief(commitmentTurnCloseout) +
      bilateralSettlementReconciliationDomesticStressRelief(bilateralSettlementReconciliation) +
      forwardBookAnchorStabilizationDomesticStressRelief(forwardBookAnchorStabilization) +
      bilateralThroughputCertificationDomesticStressRelief(bilateralThroughputCertification) +
      bilateralCapacityHandoffGateDomesticStressRelief(bilateralCapacityHandoffGate) +
      bilateralTradeWindowContinuityDomesticStressRelief(bilateralTradeWindowContinuity) +
      bilateralCapacityRenewalGateDomesticStressRelief(bilateralCapacityRenewalGate) +
      bilateralCycleReentryGateDomesticStressRelief(bilateralCycleReentryGate) +
      bilateralLoopResumptionGateDomesticStressRelief(bilateralLoopResumptionGate) +
      bilateralCycleRestartAcknowledgmentDomesticStressRelief(bilateralCycleRestartAcknowledgment) +
      bilateralCommitmentArcOpeningDomesticStressRelief(bilateralCommitmentArcOpening) +
      bilateralForwardCommitmentAdmissionDomesticStressRelief(bilateralForwardCommitmentAdmission) +
      bilateralCommitmentWindowHandoffDomesticStressRelief(bilateralCommitmentWindowHandoff) +
      bilateralForwardCycleAdvanceGateDomesticStressRelief(bilateralForwardCycleAdvanceGate) +
      bilateralCommitmentLoopReopenGateDomesticStressRelief(bilateralCommitmentLoopReopenGate) +
      exportCapacityDomesticStress(exportCapacity) +
      maritimeRiskDomesticStress(maritimeRisk) +
      enforcementMods.domesticStress +
      exportInsuranceStackDomesticStress(exportInsuranceStack) +
      tradeCorridorDomesticStress(tradeCorridorResilience) +
      spilloverMods.domesticStress +
      importLanePressureDomesticStress(importLanePressure) +
      tradeBalanceStabilizationDomesticStress(tradeBalanceStabilization) +
      exportCommitmentPipelineDomesticStress(exportCommitmentPipeline) +
      importCommitmentPipelineDomesticStress(importCommitmentPipeline) +
      tradeThroughputOrchestrationDomesticStress(tradeThroughputOrchestration) +
      bilateralCargoSchedulingDomesticStress(bilateralCargoScheduling) +
      forwardSlotRolloverDomesticStress(forwardSlotRollover) +
      tradeSettlementContinuityDomesticStress(tradeSettlementContinuity) +
      anchoredBookReadinessDomesticStress(anchoredBookReadiness) +
      certifiedThroughputSustainmentDomesticStress(certifiedThroughputSustainment) +
      capacityHandoffAbsorptionDomesticStress(capacityHandoffAbsorption) +
      tradeCycleSealVerificationDomesticStress(tradeCycleSealVerification) +
      capacityRenewalPrimingDomesticStress(capacityRenewalPriming) +
      cycleReentryStabilizationDomesticStress(cycleReentryStabilization) +
      resumedLoopContinuityDomesticStress(resumedLoopContinuity) +
      acknowledgedCyclePrimingDomesticStress(acknowledgedCyclePriming) +
      commitmentArcContinuityDomesticStress(commitmentArcContinuity) +
      admittedForwardCommitmentContinuityDomesticStress(admittedForwardCommitmentContinuity) +
      commitmentWindowSustainmentDomesticStress(commitmentWindowSustainment) +
      forwardCycleAdvanceContinuityDomesticStress(forwardCycleAdvanceContinuity),
    shockRegions: shock.regionIds,
  });
  domestic.summary = `${domestic.summary} ${summarizeDomesticConsequences(regionalImpacts)}`;

  const inputHash = gtelHash([
    turn,
    partnerDeltas,
    commodityDeltas,
    net.condition,
    commodities.map(c => c.effectiveIndex),
    partners.map(p => p.access),
    persisted.activeShocks.map(s => s.shockId),
    persisted.partnerSanctions,
    persisted.partnerTrust,
    persisted.tradePolicies?.length,
    persisted.tradeCompliance?.score,
    persisted.importDependencySmoothing,
    engagementStep.state.summitPulse,
    persisted.tradeFinanceSmoothing,
    persisted.partnerMixSmoothing,
    persisted.termsOfTradeSmoothing,
    persisted.supplyChainResilienceSmoothing,
    persisted.foreignExchangeSmoothing,
    persisted.retaliationPressureSmoothing,
    persisted.deescalationMomentumSmoothing,
    persisted.exportCapacitySmoothing,
    persisted.reconciliationProgressSmoothing,
    persisted.maritimeRiskSmoothing,
    persisted.preferentialUtilizationSmoothing,
    persisted.enforcementIntensitySmoothing,
    persisted.exportInsuranceStackSmoothing,
    persisted.accessRestorationSmoothing,
    persisted.tradeCorridorSmoothing,
    persisted.sanctionsSpilloverSmoothing,
    persisted.tradeFxHedgingSmoothing,
    persisted.importLanePressureSmoothing,
    persisted.diplomaticTradeCoherenceSmoothing,
    persisted.tradeBalanceStabilizationSmoothing,
    persisted.tradeShockAbsorptionSmoothing,
    persisted.exportCommitmentPipelineSmoothing,
    persisted.importCommitmentPipelineSmoothing,
    persisted.tradeFlowCohesionSmoothing,
    persisted.tradeThroughputOrchestrationSmoothing,
    persisted.commitmentLedgerHarmonizationSmoothing,
    persisted.bilateralCargoSchedulingSmoothing,
    persisted.commitmentTurnCloseoutSmoothing,
    persisted.forwardSlotRolloverSmoothing,
    persisted.bilateralSettlementReconciliationSmoothing,
    persisted.tradeSettlementContinuitySmoothing,
    persisted.forwardBookAnchorStabilizationSmoothing,
    persisted.anchoredBookReadinessSmoothing,
    persisted.bilateralThroughputCertificationSmoothing,
    persisted.certifiedThroughputSustainmentSmoothing,
    persisted.bilateralCapacityHandoffGateSmoothing,
    persisted.capacityHandoffAbsorptionSmoothing,
    persisted.bilateralTradeWindowContinuitySmoothing,
    persisted.tradeCycleSealVerificationSmoothing,
    persisted.bilateralCapacityRenewalGateSmoothing,
    persisted.capacityRenewalPrimingSmoothing,
    persisted.bilateralCycleReentryGateSmoothing,
    persisted.cycleReentryStabilizationSmoothing,
    persisted.bilateralLoopResumptionGateSmoothing,
    persisted.resumedLoopContinuitySmoothing,
    persisted.bilateralCycleRestartAcknowledgmentSmoothing,
    persisted.acknowledgedCyclePrimingSmoothing,
    persisted.bilateralCommitmentArcOpeningSmoothing,
    persisted.commitmentArcContinuitySmoothing,
    persisted.bilateralForwardCommitmentAdmissionSmoothing,
    persisted.admittedForwardCommitmentContinuitySmoothing,
    persisted.bilateralCommitmentWindowHandoffSmoothing,
    persisted.commitmentWindowSustainmentSmoothing,
    persisted.bilateralForwardCycleAdvanceGateSmoothing,
    persisted.forwardCycleAdvanceContinuitySmoothing,
    persisted.bilateralCommitmentLoopReopenGateSmoothing,
  ]);
  persisted.revision += 1;
  persisted.lastProcessedTurn = turn;

  if (exportSectorBoom) {
    worldEvents.push({
      id: `gtel_boom_${turn}`,
      turn,
      kind: 'trade',
      title: 'Export window widening',
      summary: domestic.summary,
      regionIds: ['WA', 'QLD'],
    });
  }

  if (shock.regionIds.length && shock.domesticStress > 0.05) {
    worldEvents.push({
      id: `gtel_domestic_spill_${turn}`,
      turn,
      kind: 'domestic',
      title: 'Domestic spillover from world markets',
      summary: summarizeDomesticConsequences(regionalImpacts),
      regionIds: shock.regionIds.slice(0, 6),
    });
  }

  persisted.recentEvents = [
    ...persisted.recentEvents,
    ...worldEvents.map(e => ({ id: e.id, turn: e.turn, kind: e.kind, text: e.summary })),
  ].slice(-GTEL_LIMITS.history);

  const state = {
    turn,
    partners,
    commodities,
    domestic,
    regionalImpacts,
    nationalTradeCondition: net.condition,
    exportThroughput: financeScaledThroughput,
    diplomacyTradeDealsActive: gtelActiveDeals(input.diplomacyState).filter(d => d.type === 'resource_trade').length,
    violationsLastWindow: gtelRecentViolations(input.diplomacyState, turn),
    activeSanctionTiers: sanctions.activeTiers,
    partnerTrust: persisted.partnerTrust || {},
    activeTradePolicies: listActiveTradePolicies(persisted),
    openDisputeCount: openDisputes,
    logistics,
    tradeBalance: tradeBalanceAdjusted,
    tradeCompliance: persisted.tradeCompliance,
    importDependency,
    diplomaticEngagement: engagementStep.state,
    tradeFinance,
    marketDiversification,
    termsOfTrade,
    supplyChainResilience,
    foreignExchange,
    tradeRetaliation,
    tradeDeescalation,
    exportCapacity,
    tradeReconciliation,
    maritimeRisk,
    preferentialUtilization,
    tradeEnforcement,
    exportInsuranceStack,
    partnerAccessRestoration,
    tradeCorridorResilience,
    sanctionsSpillover,
    tradeFxHedging,
    importLanePressure,
    diplomaticTradeCoherence,
    tradeBalanceStabilization,
    tradeShockAbsorption,
    exportCommitmentPipeline,
    importCommitmentPipeline,
    tradeFlowCohesion,
    tradeThroughputOrchestration,
    commitmentLedgerHarmonization,
    bilateralCargoScheduling,
    commitmentTurnCloseout,
    forwardSlotRollover,
    bilateralSettlementReconciliation,
    tradeSettlementContinuity,
    forwardBookAnchorStabilization,
    anchoredBookReadiness,
    bilateralThroughputCertification,
    certifiedThroughputSustainment,
    bilateralCapacityHandoffGate,
    capacityHandoffAbsorption,
    bilateralTradeWindowContinuity,
    tradeCycleSealVerification,
    bilateralCapacityRenewalGate,
    capacityRenewalPriming,
    bilateralCycleReentryGate,
    cycleReentryStabilization,
    bilateralLoopResumptionGate,
    resumedLoopContinuity,
    bilateralCycleRestartAcknowledgment,
    acknowledgedCyclePriming,
    bilateralCommitmentArcOpening,
    commitmentArcContinuity,
    bilateralForwardCommitmentAdmission,
    admittedForwardCommitmentContinuity,
    bilateralCommitmentWindowHandoff,
    commitmentWindowSustainment,
    bilateralForwardCycleAdvanceGate,
    forwardCycleAdvanceContinuity,
    bilateralCommitmentLoopReopenGate,
    inputHash,
  };

  return { state, persisted, worldEvents: worldEvents.slice(0, GTEL_LIMITS.maxEvent) };
}

export function buildGlobalTradeEconomyInputsFromGameState(gs: any, turn?: number): GTELTurnInput {
  const t = Math.max(1, Math.floor(gtelNum(turn ?? gs?.turnCounter ?? gs?.turn ?? 1, 1)));
  return {
    turn: t,
    diplomacyState: gs?.diplomacyState || null,
    nationalSystems: gs?.nationalSystems || null,
    persisted: sanitizeGTELPersisted(gs?.globalTradeEconomy, t),
    actorNames: gs?.actorNames || { player: 'You', ai: 'Rival' },
  };
}

export function buildGlobalTradeGi3Notes(state: import('./types.ts').GTELState | null): string[] {
  if (!state) return [];
  const lines = [state.domestic.summary];
  const hot = state.commodities.filter(c => c.trend === 'rising').slice(0, 2);
  if (hot.length) lines.push(`Rising quotes: ${hot.map(c => GTEL_COMMODITY_LABEL[c.commodity]).join(', ')}.`);
  const blocked = state.partners.filter(p => p.access === 'blocked' || p.access === 'restricted');
  if (blocked.length) lines.push(`Restricted partners: ${blocked.map(p => p.label).join('; ')}.`);
  const stressed = state.regionalImpacts?.filter(r => r.stabilityDelta < -0.05).slice(0, 2);
  if (stressed?.length) lines.push(`Regional stress: ${stressed.map(r => r.regionId).join(', ')}.`);
  lines.push(...tradeBalanceGiNotes(state.tradeBalance));
  lines.push(...importDependencyGiNotes(state.importDependency));
  lines.push(...diplomaticEngagementGiNotes(state.diplomaticEngagement));
  lines.push(...tradeFinanceGiNotes(state.tradeFinance));
  lines.push(...marketDiversificationGiNotes(state.marketDiversification));
  lines.push(...termsOfTradeGiNotes(state.termsOfTrade));
  lines.push(...supplyChainResilienceGiNotes(state.supplyChainResilience));
  lines.push(...foreignExchangeGiNotes(state.foreignExchange));
  lines.push(...tradeRetaliationGiNotes(state.tradeRetaliation));
  lines.push(...tradeDeescalationGiNotes(state.tradeDeescalation));
  lines.push(...exportCapacityGiNotes(state.exportCapacity));
  lines.push(...tradeReconciliationGiNotes(state.tradeReconciliation));
  lines.push(...maritimeRiskGiNotes(state.maritimeRisk));
  lines.push(...preferentialUtilizationGiNotes(state.preferentialUtilization));
  lines.push(...tradeEnforcementGiNotes(state.tradeEnforcement));
  lines.push(...exportInsuranceStackGiNotes(state.exportInsuranceStack));
  lines.push(...partnerAccessRestorationGiNotes(state.partnerAccessRestoration));
  lines.push(...tradeCorridorGiNotes(state.tradeCorridorResilience));
  lines.push(...sanctionsSpilloverGiNotes(state.sanctionsSpillover));
  lines.push(...tradeFxHedgingGiNotes(state.tradeFxHedging));
  lines.push(...importLanePressureGiNotes(state.importLanePressure));
  lines.push(...diplomaticTradeCoherenceGiNotes(state.diplomaticTradeCoherence));
  lines.push(...tradeBalanceStabilizationGiNotes(state.tradeBalanceStabilization));
  lines.push(...tradeShockAbsorptionGiNotes(state.tradeShockAbsorption));
  lines.push(...exportCommitmentPipelineGiNotes(state.exportCommitmentPipeline));
  lines.push(...importCommitmentPipelineGiNotes(state.importCommitmentPipeline));
  lines.push(...tradeFlowCohesionGiNotes(state.tradeFlowCohesion));
  lines.push(...tradeThroughputOrchestrationGiNotes(state.tradeThroughputOrchestration));
  lines.push(...commitmentLedgerHarmonizationGiNotes(state.commitmentLedgerHarmonization));
  lines.push(...bilateralCargoSchedulingGiNotes(state.bilateralCargoScheduling));
  lines.push(...commitmentTurnCloseoutGiNotes(state.commitmentTurnCloseout));
  lines.push(...forwardSlotRolloverGiNotes(state.forwardSlotRollover));
  lines.push(...bilateralSettlementReconciliationGiNotes(state.bilateralSettlementReconciliation));
  lines.push(...tradeSettlementContinuityGiNotes(state.tradeSettlementContinuity));
  lines.push(...forwardBookAnchorStabilizationGiNotes(state.forwardBookAnchorStabilization));
  lines.push(...anchoredBookReadinessGiNotes(state.anchoredBookReadiness));
  lines.push(...bilateralThroughputCertificationGiNotes(state.bilateralThroughputCertification));
  lines.push(...certifiedThroughputSustainmentGiNotes(state.certifiedThroughputSustainment));
  lines.push(...bilateralCapacityHandoffGateGiNotes(state.bilateralCapacityHandoffGate));
  lines.push(...capacityHandoffAbsorptionGiNotes(state.capacityHandoffAbsorption));
  lines.push(...bilateralTradeWindowContinuityGiNotes(state.bilateralTradeWindowContinuity));
  lines.push(...tradeCycleSealVerificationGiNotes(state.tradeCycleSealVerification));
  lines.push(...bilateralCapacityRenewalGateGiNotes(state.bilateralCapacityRenewalGate));
  lines.push(...capacityRenewalPrimingGiNotes(state.capacityRenewalPriming));
  lines.push(...bilateralCycleReentryGateGiNotes(state.bilateralCycleReentryGate));
  lines.push(...cycleReentryStabilizationGiNotes(state.cycleReentryStabilization));
  lines.push(...bilateralLoopResumptionGateGiNotes(state.bilateralLoopResumptionGate));
  lines.push(...resumedLoopContinuityGiNotes(state.resumedLoopContinuity));
  lines.push(...bilateralCycleRestartAcknowledgmentGiNotes(state.bilateralCycleRestartAcknowledgment));
  lines.push(...acknowledgedCyclePrimingGiNotes(state.acknowledgedCyclePriming));
  lines.push(...bilateralCommitmentArcOpeningGiNotes(state.bilateralCommitmentArcOpening));
  lines.push(...commitmentArcContinuityGiNotes(state.commitmentArcContinuity));
  lines.push(...bilateralForwardCommitmentAdmissionGiNotes(state.bilateralForwardCommitmentAdmission));
  lines.push(...admittedForwardCommitmentContinuityGiNotes(state.admittedForwardCommitmentContinuity));
  lines.push(...bilateralCommitmentWindowHandoffGiNotes(state.bilateralCommitmentWindowHandoff));
  lines.push(...commitmentWindowSustainmentGiNotes(state.commitmentWindowSustainment));
  lines.push(...bilateralForwardCycleAdvanceGateGiNotes(state.bilateralForwardCycleAdvanceGate));
  lines.push(...forwardCycleAdvanceContinuityGiNotes(state.forwardCycleAdvanceContinuity));
  lines.push(...bilateralCommitmentLoopReopenGateGiNotes(state.bilateralCommitmentLoopReopenGate));
  if (state.logistics?.band === 'congested' || state.logistics?.band === 'tight') {
    lines.push(state.logistics.summary);
  }
  return lines;
}
