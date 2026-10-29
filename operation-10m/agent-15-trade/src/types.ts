/** Agent 15 — core types (Operation 10M modular GTEL). */

export type GTELDealStatus = 'active' | 'violated' | 'completed' | 'expired' | 'terminated';

export interface GTELDiplomaticDeal {
  id: string;
  type: string;
  status: GTELDealStatus | string;
  participants: string[];
  compliance?: string;
  terms?: Array<{
    kind: string;
    actorId: string;
    targetActorId?: string | null;
    resourceId?: string | null;
    amount?: number | null;
    regionId?: string | null;
    status?: string;
  }>;
  violatedBy?: string | null;
  startTurn?: number | null;
  expirationTurn?: number | null;
}

export interface GTELDiplomacyState {
  deals: GTELDiplomaticDeal[];
  history?: GTELDiplomaticDeal[];
  events?: Array<{ kind: string; turn: number; actorId?: string; text?: string }>;
}

export interface GTELNationalTradeSummary {
  condition?: string;
  utilization?: number;
  exportedCapacity?: number;
  unmetDemand?: number;
  trend?: string;
}

export interface GTELNationalSystemsSlice {
  national?: { trade?: GTELNationalTradeSummary };
  regions?: Record<string, { networks?: { trade?: { exportedCapacity?: number; condition?: string } } }>;
}

export type GTELCommodityId =
  | 'iron_ore'
  | 'coal'
  | 'lng'
  | 'wheat'
  | 'beef'
  | 'aluminium'
  | 'services'
  | 'manufacturing';

export type GTELPartnerId = 'asia_pacific' | 'india_ocean' | 'north_america' | 'europe' | 'domestic_premium';

export type GTELAccessBand = 'blocked' | 'restricted' | 'normal' | 'preferred' | 'strategic';

export interface GTELPartnerMarket {
  id: GTELPartnerId;
  label: string;
  baseOpenness: number;
  access: GTELAccessBand;
  accessScore: number;
  demandWeights: Partial<Record<GTELCommodityId, number>>;
  priceSensitivity: number;
  diplomaticActorIds: string[];
}

export interface GTELCommodityQuote {
  commodity: GTELCommodityId;
  baseIndex: number;
  partnerModifier: number;
  diplomacyModifier: number;
  networkModifier: number;
  shockModifier: number;
  agreementModifier: number;
  effectiveIndex: number;
  trend: 'rising' | 'stable' | 'falling';
  evidence: string[];
}

export interface GTELDomesticCoupling {
  exportLedPressure: number;
  householdOffset: number;
  exportSectorBoom: boolean;
  exportVsDomesticModel: 'export_led' | 'domestically_balanced' | 'household_led' | 'constrained';
  transportHealthDelta: number;
  summary: string;
}

export interface GTELPersisted {
  schemaVersion: 1;
  revision: number;
  lastProcessedTurn: number | null;
  partnerAccess: Partial<Record<GTELPartnerId, GTELAccessBand>>;
  commoditySmoothing: Partial<Record<GTELCommodityId, number>>;
  embargoCooldowns: Record<string, number>;
  recentEvents: Array<{ id: string; turn: number; kind: string; text: string }>;
  /** Active structured agreements (ratified). */
  agreements: TradeAgreementRecord[];
  /** Shock instances still affecting markets. */
  activeShocks: ActiveWorldTradeShock[];
  /** Escalating partner sanctions keyed by partner market id. */
  partnerSanctions: Partial<Record<GTELPartnerId, PartnerSanctionRegime>>;
  /** Scenario ids already fired (dedupe). */
  firedShockScenarios: string[];
  /** Bilateral trust (0–1) per partner market. */
  partnerTrust: Partial<Record<GTELPartnerId, PartnerTrustScore>>;
  /** Active national trade policy instruments. */
  tradePolicies: TradePolicyInstrument[];
  /** Open / recently closed trade disputes. */
  tradeDisputes: TradeDisputeCase[];
  /** Rolling rules-based trade compliance posture. */
  tradeCompliance: TradeComplianceRecord;
  /** Smoothed import-exposure indices per commodity. */
  importDependencySmoothing: Partial<Record<GTELCommodityId, number>>;
  /** Partner engagement momentum memory. */
  diplomaticEngagement: Partial<
    Record<GTELPartnerId, { momentum: number; lastEventTurn: number; highlights?: string[] }>
  >;
  /** Smoothed export credit availability (0–1). */
  tradeFinanceSmoothing?: number;
  /** Smoothed partner export mix shares. */
  partnerMixSmoothing?: Partial<Record<GTELPartnerId, number>>;
  /** Smoothed net barter terms index (~1 = neutral). */
  termsOfTradeSmoothing?: number;
  /** Smoothed supply-chain resilience score (0–1). */
  supplyChainResilienceSmoothing?: number;
  /** Smoothed trade-weighted FX pressure index (~1 = neutral). */
  foreignExchangeSmoothing?: number;
  /** Smoothed retaliation intensity (0–1). */
  retaliationPressureSmoothing?: number;
  /** Smoothed diplomatic de-escalation momentum (0–1). */
  deescalationMomentumSmoothing?: number;
  /** Smoothed export capacity utilisation (0–1). */
  exportCapacitySmoothing?: number;
  /** Smoothed dispute reconciliation progress (0–1). */
  reconciliationProgressSmoothing?: number;
  /** Smoothed maritime insurance / war-risk premium (0–1). */
  maritimeRiskSmoothing?: number;
  /** Smoothed preferential FTA lane utilisation (0–1). */
  preferentialUtilizationSmoothing?: number;
  /** Smoothed customs enforcement intensity (0–1). */
  enforcementIntensitySmoothing?: number;
  /** Smoothed export credit + marine insurance composite (0–1). */
  exportInsuranceStackSmoothing?: number;
  /** Smoothed partner access restoration momentum (0–1). */
  accessRestorationSmoothing?: number;
  /** Smoothed trade corridor resilience score (0–1). */
  tradeCorridorSmoothing?: number;
  /** Smoothed sanctions spillover intensity (0–1). */
  sanctionsSpilloverSmoothing?: number;
  /** Smoothed trade FX / terms hedging effectiveness (0–1). */
  tradeFxHedgingSmoothing?: number;
  /** Smoothed import arrival lane pressure (0–1). */
  importLanePressureSmoothing?: number;
  /** Smoothed diplomatic trade coherence score (0–1). */
  diplomaticTradeCoherenceSmoothing?: number;
  /** Smoothed trade balance stabilization index (0–1). */
  tradeBalanceStabilizationSmoothing?: number;
  /** Smoothed trade shock absorption capacity (0–1). */
  tradeShockAbsorptionSmoothing?: number;
  /** Smoothed export commitment pipeline fill (0–1). */
  exportCommitmentPipelineSmoothing?: number;
  /** Smoothed import commitment pipeline fill (0–1). */
  importCommitmentPipelineSmoothing?: number;
  /** Smoothed bilateral trade flow cohesion score (0–1). */
  tradeFlowCohesionSmoothing?: number;
  /** Smoothed trade throughput orchestration score (0–1). */
  tradeThroughputOrchestrationSmoothing?: number;
  /** Smoothed commitment ledger harmonization score (0–1). */
  commitmentLedgerHarmonizationSmoothing?: number;
  /** Smoothed bilateral cargo scheduling score (0–1). */
  bilateralCargoSchedulingSmoothing?: number;
  /** Smoothed commitment turn closeout score (0–1). */
  commitmentTurnCloseoutSmoothing?: number;
  /** Smoothed forward slot rollover score (0–1). */
  forwardSlotRolloverSmoothing?: number;
  /** Smoothed bilateral settlement reconciliation score (0–1). */
  bilateralSettlementReconciliationSmoothing?: number;
  /** Smoothed trade settlement continuity score (0–1). */
  tradeSettlementContinuitySmoothing?: number;
  /** Smoothed forward book anchor stabilization score (0–1). */
  forwardBookAnchorStabilizationSmoothing?: number;
  /** Smoothed anchored book readiness score (0–1). */
  anchoredBookReadinessSmoothing?: number;
  /** Smoothed bilateral throughput certification score (0–1). */
  bilateralThroughputCertificationSmoothing?: number;
  certifiedThroughputSustainmentSmoothing?: number;
  bilateralCapacityHandoffGateSmoothing?: number;
  capacityHandoffAbsorptionSmoothing?: number;
  bilateralTradeWindowContinuitySmoothing?: number;
  tradeCycleSealVerificationSmoothing?: number;
  bilateralCapacityRenewalGateSmoothing?: number;
  capacityRenewalPrimingSmoothing?: number;
  bilateralCycleReentryGateSmoothing?: number;
  cycleReentryStabilizationSmoothing?: number;
  bilateralLoopResumptionGateSmoothing?: number;
  resumedLoopContinuitySmoothing?: number;
  bilateralCycleRestartAcknowledgmentSmoothing?: number;
  acknowledgedCyclePrimingSmoothing?: number;
  bilateralCommitmentArcOpeningSmoothing?: number;
  commitmentArcContinuitySmoothing?: number;
  bilateralForwardCommitmentAdmissionSmoothing?: number;
  admittedForwardCommitmentContinuitySmoothing?: number;
  bilateralCommitmentWindowHandoffSmoothing?: number;
  commitmentWindowSustainmentSmoothing?: number;
  bilateralForwardCycleAdvanceGateSmoothing?: number;
  forwardCycleAdvanceContinuitySmoothing?: number;
  bilateralCommitmentLoopReopenGateSmoothing?: number;
  reopenedCommitmentLoopContinuitySmoothing?: number;
  bilateralForwardArcRechargeGateSmoothing?: number;
  forwardArcRechargeContinuitySmoothing?: number;
  bilateralRenewalArcPrimingGateSmoothing?: number;
  renewalArcPrimingContinuitySmoothing?: number;
  bilateralNextArcOpenPrepGateSmoothing?: number;
  nextArcOpenPrepContinuitySmoothing?: number;
  bilateralPreparedArcOpeningHandoffSmoothing?: number;
  preparedArcHandoffContinuitySmoothing?: number;
  bilateralScaleLoopSealGateSmoothing?: number;
}

export interface GTELState {
  turn: number;
  partners: GTELPartnerMarket[];
  commodities: GTELCommodityQuote[];
  domestic: GTELDomesticCoupling;
  regionalImpacts: RegionalDomesticImpact[];
  nationalTradeCondition: string;
  exportThroughput: number;
  diplomacyTradeDealsActive: number;
  violationsLastWindow: number;
  activeSanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>;
  partnerTrust: Partial<Record<GTELPartnerId, PartnerTrustScore>>;
  activeTradePolicies: TradePolicyInstrument[];
  openDisputeCount: number;
  logistics: GTELLogisticsStress;
  tradeBalance: GTELTradeBalanceSnapshot;
  tradeCompliance: TradeComplianceRecord;
  importDependency: GTELImportDependencySnapshot;
  diplomaticEngagement: GTELDiplomaticEngagementState;
  tradeFinance: GTELTradeFinanceSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  supplyChainResilience: GTELSupplyChainResilienceSnapshot;
  foreignExchange: GTELForeignExchangeSnapshot;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  exportCapacity: GTELExportCapacitySnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  maritimeRisk: GTELMaritimeRiskSnapshot;
  preferentialUtilization: GTELPreferentialUtilizationSnapshot;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  exportInsuranceStack: GTELExportInsuranceStackSnapshot;
  partnerAccessRestoration: GTELPartnerAccessRestorationSnapshot;
  tradeCorridorResilience: GTELTradeCorridorResilienceSnapshot;
  sanctionsSpillover: GTELSanctionsSpilloverSnapshot;
  tradeFxHedging: GTELTradeFxHedgingSnapshot;
  importLanePressure: GTELImportLanePressureSnapshot;
  diplomaticTradeCoherence: GTELDiplomaticTradeCoherenceSnapshot;
  tradeBalanceStabilization: GTELTradeBalanceStabilizationSnapshot;
  tradeShockAbsorption: GTELTradeShockAbsorptionSnapshot;
  exportCommitmentPipeline: GTELTradeCommitmentPipelineSnapshot;
  importCommitmentPipeline: GTELImportCommitmentPipelineSnapshot;
  tradeFlowCohesion: GTELTradeFlowCohesionSnapshot;
  tradeThroughputOrchestration: GTELTradeThroughputOrchestrationSnapshot;
  commitmentLedgerHarmonization: GTELCommitmentLedgerHarmonizationSnapshot;
  bilateralCargoScheduling: GTELBilateralCargoSchedulingSnapshot;
  commitmentTurnCloseout: GTELCommitmentTurnCloseoutSnapshot;
  forwardSlotRollover: GTELForwardSlotRolloverSnapshot;
  bilateralSettlementReconciliation: GTELBilateralSettlementReconciliationSnapshot;
  tradeSettlementContinuity: GTELTradeSettlementContinuitySnapshot;
  forwardBookAnchorStabilization: GTELForwardBookAnchorStabilizationSnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  bilateralThroughputCertification: GTELBilateralThroughputCertificationSnapshot;
  certifiedThroughputSustainment: GTELCertifiedThroughputSustainmentSnapshot;
  bilateralCapacityHandoffGate: GTELBilateralCapacityHandoffGateSnapshot;
  capacityHandoffAbsorption: GTELCapacityHandoffAbsorptionSnapshot;
  bilateralTradeWindowContinuity: GTELBilateralTradeWindowContinuitySnapshot;
  tradeCycleSealVerification: GTELTradeCycleSealVerificationSnapshot;
  bilateralCapacityRenewalGate: GTELBilateralCapacityRenewalGateSnapshot;
  capacityRenewalPriming: GTELCapacityRenewalPrimingSnapshot;
  bilateralCycleReentryGate: GTELBilateralCycleReentryGateSnapshot;
  cycleReentryStabilization: GTELCycleReentryStabilizationSnapshot;
  bilateralLoopResumptionGate: GTELBilateralLoopResumptionGateSnapshot;
  resumedLoopContinuity: GTELResumedLoopContinuitySnapshot;
  bilateralCycleRestartAcknowledgment: GTELBilateralCycleRestartAcknowledgmentSnapshot;
  acknowledgedCyclePriming: GTELAcknowledgedCyclePrimingSnapshot;
  bilateralCommitmentArcOpening: GTELBilateralCommitmentArcOpeningSnapshot;
  commitmentArcContinuity: GTELCommitmentArcContinuitySnapshot;
  bilateralForwardCommitmentAdmission: GTELBilateralForwardCommitmentAdmissionSnapshot;
  admittedForwardCommitmentContinuity: GTELAdmittedForwardCommitmentContinuitySnapshot;
  bilateralCommitmentWindowHandoff: GTELBilateralCommitmentWindowHandoffSnapshot;
  commitmentWindowSustainment: GTELCommitmentWindowSustainmentSnapshot;
  bilateralForwardCycleAdvanceGate: GTELBilateralForwardCycleAdvanceGateSnapshot;
  forwardCycleAdvanceContinuity: GTELForwardCycleAdvanceContinuitySnapshot;
  bilateralCommitmentLoopReopenGate: GTELBilateralCommitmentLoopReopenGateSnapshot;
  reopenedCommitmentLoopContinuity: GTELReopenedCommitmentLoopContinuitySnapshot;
  bilateralForwardArcRechargeGate: GTELBilateralForwardArcRechargeGateSnapshot;
  forwardArcRechargeContinuity: GTELForwardArcRechargeContinuitySnapshot;
  bilateralRenewalArcPrimingGate: GTELBilateralRenewalArcPrimingGateSnapshot;
  renewalArcPrimingContinuity: GTELRenewalArcPrimingContinuitySnapshot;
  bilateralNextArcOpenPrepGate: GTELBilateralNextArcOpenPrepGateSnapshot;
  nextArcOpenPrepContinuity: GTELNextArcOpenPrepContinuitySnapshot;
  bilateralPreparedArcOpeningHandoff: GTELBilateralPreparedArcOpeningHandoffSnapshot;
  preparedArcHandoffContinuity: GTELPreparedArcHandoffContinuitySnapshot;
  bilateralScaleLoopSealGate: GTELBilateralScaleLoopSealGateSnapshot;
  inputHash: string;
}

export interface GTELTurnInput {
  turn: number;
  diplomacyState: GTELDiplomacyState | null;
  nationalSystems: GTELNationalSystemsSlice | null;
  actorNames?: Record<string, string>;
  persisted: GTELPersisted | null;
  actorPartnerMap?: Record<string, GTELPartnerId>;
}

export interface GTELTurnResult {
  state: GTELState;
  persisted: GTELPersisted;
  worldEvents: Array<{
    id: string;
    turn: number;
    kind: 'trade' | 'diplomacy' | 'domestic' | 'shock' | 'sanction';
    title: string;
    summary: string;
    regionIds: string[];
  }>;
}

/** Bilateral / plurilateral trade agreement (persisted). */
export type TradeAgreementStatus = 'draft' | 'negotiating' | 'ratified' | 'suspended' | 'expired';

export interface TradeAgreementTariffLine {
  commodity: GTELCommodityId;
  tariffCut: number;
  quotaCap?: number | null;
}

export interface TradeAgreementRecord {
  id: string;
  templateId: string;
  title: string;
  partnerId: GTELPartnerId;
  counterpartyActorIds: string[];
  status: TradeAgreementStatus;
  ratifiedTurn: number | null;
  expiresTurn: number | null;
  tariffLines: TradeAgreementTariffLine[];
  accessBoost: number;
  notes: string[];
}

export interface TradeAgreementLedger {
  version: 1;
  agreements: TradeAgreementRecord[];
}

export type SanctionTier = 'none' | 'watchlist' | 'sectoral' | 'comprehensive';

export interface PartnerSanctionRegime {
  partnerId: GTELPartnerId;
  tier: SanctionTier;
  escalatedTurn: number;
  cooldownUntilTurn: number | null;
  violationStreak: number;
  complianceStreak: number;
  scopedCommodities: GTELCommodityId[];
  reason: string;
}

export type WorldTradeShockKind =
  | 'shipping_disruption'
  | 'partner_embargo'
  | 'commodity_crash'
  | 'commodity_spike'
  | 'supply_chain'
  | 'financial_contagion'
  | 'sanctions_retaliation';

export interface WorldTradeShockDefinition {
  id: string;
  kind: WorldTradeShockKind;
  title: string;
  summary: string;
  durationTurns: number;
  partnerIds: GTELPartnerId[];
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  partnerAccessDelta: number;
  domesticStress: number;
  regionIds: string[];
}

export interface ActiveWorldTradeShock {
  shockId: string;
  startedTurn: number;
  endsTurn: number;
  remainingIntensity: number;
}

export interface RegionalDomesticImpact {
  regionId: string;
  employmentDelta: number;
  consumerPricePressure: number;
  stabilityDelta: number;
  narrative: string;
}

export type TradePolicyKind = 'export_quota_relief' | 'tariff_surge' | 'preferential_lane' | 'diversification_push';

export type TradePolicyStatus = 'proposed' | 'active' | 'expired' | 'suspended';

export interface TradePolicyInstrument {
  id: string;
  kind: TradePolicyKind;
  title: string;
  partnerId: GTELPartnerId | null;
  commodity: GTELCommodityId | null;
  status: TradePolicyStatus;
  activatedTurn: number;
  expiresTurn: number | null;
  accessDelta: number;
  commodityDelta: number;
  domesticStressDelta: number;
  summary: string;
}

export interface PartnerTrustScore {
  partnerId: GTELPartnerId;
  score: number;
  band: 'critical' | 'fragile' | 'steady' | 'strong';
  lastUpdatedTurn: number;
  drivers: string[];
}

export type TradeDisputeStatus = 'open' | 'mediation' | 'resolved' | 'escalated';

export interface TradeDisputeCase {
  id: string;
  partnerId: GTELPartnerId;
  status: TradeDisputeStatus;
  openedTurn: number;
  resolvedTurn: number | null;
  subject: string;
  requestedRelief: 'sanction_step_down' | 'shock_containment' | 'quota_restoration';
  severity: number;
}

export type TradeComplianceBand = 'strong' | 'adequate' | 'weak' | 'critical';

export interface TradeComplianceRecord {
  score: number;
  band: TradeComplianceBand;
  lastReviewTurn: number;
  violationsWindow: number;
  openDisputes: number;
  findings: string[];
}

export type GTELLogisticsBand = 'fluid' | 'watch' | 'tight' | 'congested';

export interface GTELLogisticsStress {
  band: GTELLogisticsBand;
  freightPressure: number;
  redundancyScore: number;
  effectiveExportThroughput: number;
  networkStrain: number;
  summary: string;
}

export type GTELCurrentAccountTone = 'surplus' | 'mild_surplus' | 'balanced' | 'mild_deficit' | 'deficit';

export interface GTELTradeBalanceSnapshot {
  exportValueIndex: number;
  importPressureIndex: number;
  netExportPulse: number;
  currentAccountTone: GTELCurrentAccountTone;
  effectiveThroughput: number;
  narrative: string;
}

export type GTELImportRiskBand = 'low' | 'moderate' | 'elevated' | 'critical';

export interface GTELImportDependencyLine {
  commodity: GTELCommodityId;
  importExposure: number;
  band: GTELImportRiskBand;
  dominantPartnerId: GTELPartnerId | null;
  narrative: string;
}

export interface GTELImportDependencySnapshot {
  aggregateRisk: number;
  band: GTELImportRiskBand;
  lines: GTELImportDependencyLine[];
  summary: string;
}

export interface DiplomaticEngagementTrack {
  partnerId: GTELPartnerId;
  momentum: number;
  band: 'stalled' | 'cautious' | 'active' | 'breakthrough';
  lastEventTurn: number;
  highlights: string[];
}

export interface GTELDiplomaticEngagementState {
  tracks: Partial<Record<GTELPartnerId, DiplomaticEngagementTrack>>;
  summitPulse: number;
  summary: string;
}

export type GTELTradeFinanceBand = 'fluid' | 'watch' | 'tight' | 'frozen';

export interface GTELTradeFinanceSnapshot {
  availabilityScore: number;
  band: GTELTradeFinanceBand;
  financingPremium: number;
  exportCreditCeiling: number;
  summary: string;
}

export type GTELDiversificationBand = 'well_spread' | 'moderate' | 'concentrated' | 'critical';

export interface GTELMarketDiversificationSnapshot {
  concentrationIndex: number;
  band: GTELDiversificationBand;
  dominantPartnerId: GTELPartnerId | null;
  effectivePartnerCount: number;
  summary: string;
}

export type GTELTermsOfTradeBand = 'favorable' | 'neutral' | 'unfavorable' | 'severely_unfavorable';

export interface GTELTermsOfTradeSnapshot {
  index: number;
  band: GTELTermsOfTradeBand;
  exportBasketIndex: number;
  importBasketIndex: number;
  summary: string;
}

export type GTELSupplyChainBand = 'robust' | 'adaptive' | 'fragile' | 'brittle';

export interface GTELSupplyChainResilienceSnapshot {
  score: number;
  band: GTELSupplyChainBand;
  chokepointCount: number;
  redundancyIndex: number;
  summary: string;
}

export type GTELForeignExchangeBand = 'supportive' | 'neutral' | 'stress' | 'crisis';

export interface GTELForeignExchangeSnapshot {
  pressureIndex: number;
  band: GTELForeignExchangeBand;
  passThroughToImports: number;
  exportCompetitiveness: number;
  summary: string;
}

export type GTELTradeRetaliationBand = 'dormant' | 'watch' | 'active' | 'escalating';

export interface GTELTradeRetaliationSnapshot {
  intensity: number;
  band: GTELTradeRetaliationBand;
  activeMeasureCount: number;
  targetedPartnerIds: GTELPartnerId[];
  summary: string;
}

export type GTELTradeDeescalationBand = 'stalled' | 'thawing' | 'warming' | 'breakthrough';

export interface GTELTradeDeescalationSnapshot {
  momentum: number;
  band: GTELTradeDeescalationBand;
  coolingPartnerIds: GTELPartnerId[];
  retaliationAttenuation: number;
  summary: string;
}

export type GTELExportCapacityBand = 'slack' | 'balanced' | 'tight' | 'saturated';

export interface GTELExportCapacitySnapshot {
  utilization: number;
  band: GTELExportCapacityBand;
  allocationEfficiency: number;
  priorityCommodities: GTELCommodityId[];
  summary: string;
}

export type GTELTradeReconciliationBand = 'stalled' | 'procedural' | 'substantive' | 'settled';

export interface GTELTradeReconciliationSnapshot {
  progress: number;
  band: GTELTradeReconciliationBand;
  disputeReliefCount: number;
  reconciledPartnerIds: GTELPartnerId[];
  summary: string;
}

export type GTELMaritimeRiskBand = 'calm' | 'elevated' | 'severe' | 'blocked';

export interface GTELMaritimeRiskSnapshot {
  premiumIndex: number;
  band: GTELMaritimeRiskBand;
  insuranceLoad: number;
  laneReliability: number;
  summary: string;
}

export type GTELPreferentialUtilizationBand = 'underused' | 'balanced' | 'high' | 'saturated';

export interface GTELPreferentialUtilizationSnapshot {
  utilizationRate: number;
  band: GTELPreferentialUtilizationBand;
  activeAgreementCount: number;
  boostedCommodities: GTELCommodityId[];
  summary: string;
}

export type GTELTradeEnforcementBand = 'light' | 'active' | 'intensive' | 'sweep';

export interface GTELTradeEnforcementSnapshot {
  intensity: number;
  band: GTELTradeEnforcementBand;
  probeLoad: number;
  clearanceDelayTurns: number;
  summary: string;
}

export type GTELExportInsuranceStackBand = 'robust' | 'adequate' | 'strained' | 'impaired';

export interface GTELExportInsuranceStackSnapshot {
  compositeScore: number;
  band: GTELExportInsuranceStackBand;
  blendedPremium: number;
  creditHeadroom: number;
  summary: string;
}

export type GTELPartnerAccessRestorationBand = 'stalled' | 'partial' | 'recovering' | 'reopened';

export interface GTELPartnerAccessRestorationSnapshot {
  momentum: number;
  band: GTELPartnerAccessRestorationBand;
  restoredPartnerIds: GTELPartnerId[];
  accessRecoveryIndex: number;
  summary: string;
}

export type GTELTradeCorridorBand = 'robust' | 'stable' | 'fragile' | 'disrupted';

export interface GTELTradeCorridorResilienceSnapshot {
  score: number;
  band: GTELTradeCorridorBand;
  chokepointLoad: number;
  rerouteCapacity: number;
  summary: string;
}

export type GTELSanctionsSpilloverBand = 'contained' | 'localized' | 'broad' | 'pervasive';

export interface GTELSanctionsSpilloverSnapshot {
  intensity: number;
  band: GTELSanctionsSpilloverBand;
  activeTierCount: number;
  spilloverPartnerIds: GTELPartnerId[];
  summary: string;
}

export type GTELTradeFxHedgingBand = 'well_hedged' | 'balanced' | 'exposed' | 'unhedged';

export interface GTELTradeFxHedgingSnapshot {
  effectiveness: number;
  band: GTELTradeFxHedgingBand;
  passThroughBuffer: number;
  termsShield: number;
  summary: string;
}

export type GTELImportLanePressureBand = 'fluid' | 'busy' | 'congested' | 'gridlocked';

export interface GTELImportLanePressureSnapshot {
  load: number;
  band: GTELImportLanePressureBand;
  clearanceBacklog: number;
  consumerPricePassThrough: number;
  summary: string;
}

export type GTELDiplomaticTradeCoherenceBand = 'aligned' | 'coordinated' | 'fragmented' | 'divergent';

export interface GTELDiplomaticTradeCoherenceSnapshot {
  score: number;
  band: GTELDiplomaticTradeCoherenceBand;
  trackAlignment: number;
  narrativeConsistency: number;
  summary: string;
}

export type GTELTradeBalanceStabilizationBand = 'anchored' | 'steady' | 'volatile' | 'unstable';

export interface GTELTradeBalanceStabilizationSnapshot {
  index: number;
  band: GTELTradeBalanceStabilizationBand;
  surplusSupport: number;
  volatilityDampening: number;
  summary: string;
}

export type GTELTradeShockAbsorptionBand = 'deep' | 'moderate' | 'thin' | 'exhausted';

export interface GTELTradeShockAbsorptionSnapshot {
  capacity: number;
  band: GTELTradeShockAbsorptionBand;
  resilienceBuffer: number;
  hedgingBuffer: number;
  summary: string;
}

export type GTELTradeCommitmentPipelineBand = 'slack' | 'steady' | 'strong' | 'booked_out';

export interface GTELTradeCommitmentPipelineSnapshot {
  fillRate: number;
  band: GTELTradeCommitmentPipelineBand;
  forwardBookTurns: number;
  financeCoverage: number;
  summary: string;
}

export type GTELImportCommitmentPipelineBand = 'slack' | 'steady' | 'strong' | 'booked_out';

export interface GTELImportCommitmentPipelineSnapshot {
  fillRate: number;
  band: GTELImportCommitmentPipelineBand;
  forwardBookTurns: number;
  financeCoverage: number;
  summary: string;
}

export type GTELTradeFlowCohesionBand = 'synchronized' | 'balanced' | 'skewed' | 'dislocated';

export interface GTELTradeFlowCohesionSnapshot {
  score: number;
  band: GTELTradeFlowCohesionBand;
  exportImportGap: number;
  stabilizationSupport: number;
  summary: string;
}

export type GTELTradeThroughputOrchestrationBand = 'fluid' | 'paced' | 'congested' | 'stalled';

export interface GTELTradeThroughputOrchestrationSnapshot {
  score: number;
  band: GTELTradeThroughputOrchestrationBand;
  pipelineHeadroom: number;
  logisticsSupport: number;
  summary: string;
}

export type GTELCommitmentLedgerHarmonizationBand = 'aligned' | 'adjusting' | 'divergent' | 'fractured';

export interface GTELCommitmentLedgerHarmonizationSnapshot {
  score: number;
  band: GTELCommitmentLedgerHarmonizationBand;
  ledgerGap: number;
  orchestrationSupport: number;
  summary: string;
}

export type GTELBilateralCargoSchedulingBand = 'on_schedule' | 'slipping' | 'backlogged' | 'gridlocked';

export interface GTELBilateralCargoSchedulingSnapshot {
  score: number;
  band: GTELBilateralCargoSchedulingBand;
  slotUtilization: number;
  harmonizationSupport: number;
  summary: string;
}

export type GTELCommitmentTurnCloseoutBand = 'closed_clean' | 'minor_variance' | 'open_slots' | 'unsettled';

export interface GTELCommitmentTurnCloseoutSnapshot {
  score: number;
  band: GTELCommitmentTurnCloseoutBand;
  slotVariance: number;
  schedulingSupport: number;
  summary: string;
}

export type GTELForwardSlotRolloverBand = 'seamless' | 'partial' | 'lumpy' | 'blocked';

export interface GTELForwardSlotRolloverSnapshot {
  score: number;
  band: GTELForwardSlotRolloverBand;
  openSlotCarry: number;
  closeoutSupport: number;
  summary: string;
}

export type GTELBilateralSettlementReconciliationBand = 'settled' | 'reconciling' | 'disputed' | 'unsettled';

export interface GTELBilateralSettlementReconciliationSnapshot {
  score: number;
  band: GTELBilateralSettlementReconciliationBand;
  rolloverAlignment: number;
  schedulingSupport: number;
  summary: string;
}

export type GTELTradeSettlementContinuityBand = 'anchored' | 'tracking' | 'drifting' | 'broken';

export interface GTELTradeSettlementContinuitySnapshot {
  score: number;
  band: GTELTradeSettlementContinuityBand;
  settlementCarry: number;
  rolloverSupport: number;
  summary: string;
}

export type GTELForwardBookAnchorStabilizationBand = 'locked' | 'firm' | 'soft' | 'unmoored';

export interface GTELForwardBookAnchorStabilizationSnapshot {
  score: number;
  band: GTELForwardBookAnchorStabilizationBand;
  continuitySupport: number;
  harmonizationLift: number;
  summary: string;
}

export type GTELAnchoredBookReadinessBand = 'ready' | 'staging' | 'constrained' | 'blocked';

export interface GTELAnchoredBookReadinessSnapshot {
  score: number;
  band: GTELAnchoredBookReadinessBand;
  anchorSupport: number;
  continuityLift: number;
  summary: string;
}

export type GTELBilateralThroughputCertificationBand = 'certified' | 'pending' | 'conditional' | 'rejected';

export interface GTELBilateralThroughputCertificationSnapshot {
  score: number;
  band: GTELBilateralThroughputCertificationBand;
  readinessSupport: number;
  logisticsClearance: number;
  summary: string;
}

export type GTELCertifiedThroughputSustainmentBand = 'sustained' | 'holding' | 'fading' | 'exhausted';

export interface GTELCertifiedThroughputSustainmentSnapshot {
  score: number;
  band: GTELCertifiedThroughputSustainmentBand;
  certificationSupport: number;
  anchorLift: number;
  summary: string;
}

export type GTELBilateralCapacityHandoffGateBand = 'open' | 'queued' | 'throttled' | 'closed';

export interface GTELBilateralCapacityHandoffGateSnapshot {
  score: number;
  band: GTELBilateralCapacityHandoffGateBand;
  sustainmentSupport: number;
  readinessLift: number;
  summary: string;
}

export type GTELCapacityHandoffAbsorptionBand = 'absorbed' | 'integrating' | 'leaking' | 'rejected';

export interface GTELCapacityHandoffAbsorptionSnapshot {
  score: number;
  band: GTELCapacityHandoffAbsorptionBand;
  handoffSupport: number;
  sustainmentLift: number;
  summary: string;
}

export type GTELBilateralTradeWindowContinuityBand = 'continuous' | 'bridging' | 'gapped' | 'severed';

export interface GTELBilateralTradeWindowContinuitySnapshot {
  score: number;
  band: GTELBilateralTradeWindowContinuityBand;
  absorptionSupport: number;
  readinessAnchor: number;
  summary: string;
}

export type GTELTradeCycleSealVerificationBand = 'verified' | 'provisional' | 'contested' | 'failed';

export interface GTELTradeCycleSealVerificationSnapshot {
  score: number;
  band: GTELTradeCycleSealVerificationBand;
  continuitySupport: number;
  sustainmentAnchor: number;
  summary: string;
}

export type GTELBilateralCapacityRenewalGateBand = 'renewed' | 'pending' | 'deferred' | 'blocked';

export interface GTELBilateralCapacityRenewalGateSnapshot {
  score: number;
  band: GTELBilateralCapacityRenewalGateBand;
  sealSupport: number;
  readinessLift: number;
  summary: string;
}

export type GTELCapacityRenewalPrimingBand = 'primed' | 'charging' | 'underfed' | 'starved';

export interface GTELCapacityRenewalPrimingSnapshot {
  score: number;
  band: GTELCapacityRenewalPrimingBand;
  renewalSupport: number;
  sustainmentFeed: number;
  summary: string;
}

export type GTELBilateralCycleReentryGateBand = 'entered' | 'approaching' | 'held' | 'denied';

export interface GTELBilateralCycleReentryGateSnapshot {
  score: number;
  band: GTELBilateralCycleReentryGateBand;
  primingSupport: number;
  readinessAnchor: number;
  summary: string;
}

export type GTELCycleReentryStabilizationBand = 'stable' | 'settling' | 'unsettled' | 'volatile';

export interface GTELCycleReentryStabilizationSnapshot {
  score: number;
  band: GTELCycleReentryStabilizationBand;
  reentrySupport: number;
  sealAnchor: number;
  summary: string;
}

export type GTELBilateralLoopResumptionGateBand = 'resumed' | 'opening' | 'stalled' | 'closed';

export interface GTELBilateralLoopResumptionGateSnapshot {
  score: number;
  band: GTELBilateralLoopResumptionGateBand;
  stabilizationSupport: number;
  primingLift: number;
  summary: string;
}

export type GTELResumedLoopContinuityBand = 'continuous' | 'linked' | 'fragile' | 'broken';

export interface GTELResumedLoopContinuitySnapshot {
  score: number;
  band: GTELResumedLoopContinuityBand;
  resumptionSupport: number;
  stabilizationAnchor: number;
  summary: string;
}

export type GTELBilateralCycleRestartAcknowledgmentBand = 'acknowledged' | 'pending' | 'deferred' | 'rejected';

export interface GTELBilateralCycleRestartAcknowledgmentSnapshot {
  score: number;
  band: GTELBilateralCycleRestartAcknowledgmentBand;
  continuitySupport: number;
  readinessLift: number;
  summary: string;
}

export type GTELAcknowledgedCyclePrimingBand = 'primed' | 'charging' | 'weak' | 'empty';

export interface GTELAcknowledgedCyclePrimingSnapshot {
  score: number;
  band: GTELAcknowledgedCyclePrimingBand;
  acknowledgmentSupport: number;
  renewalFeed: number;
  summary: string;
}

export type GTELBilateralCommitmentArcOpeningBand = 'opened' | 'unlocking' | 'latched' | 'sealed';

export interface GTELBilateralCommitmentArcOpeningSnapshot {
  score: number;
  band: GTELBilateralCommitmentArcOpeningBand;
  primingSupport: number;
  readinessAnchor: number;
  summary: string;
}

export type GTELCommitmentArcContinuityBand = 'sustained' | 'tracking' | 'drifting' | 'lost';

export interface GTELCommitmentArcContinuitySnapshot {
  score: number;
  band: GTELCommitmentArcContinuityBand;
  arcOpeningSupport: number;
  loopAlignment: number;
  summary: string;
}

export type GTELBilateralForwardCommitmentAdmissionBand = 'admitted' | 'staging' | 'throttled' | 'closed';

export interface GTELBilateralForwardCommitmentAdmissionSnapshot {
  score: number;
  band: GTELBilateralForwardCommitmentAdmissionBand;
  continuityFeed: number;
  arcGateLift: number;
  summary: string;
}

export type GTELAdmittedForwardCommitmentContinuityBand = 'anchored' | 'holding' | 'slipping' | 'revoked';

export interface GTELAdmittedForwardCommitmentContinuitySnapshot {
  score: number;
  band: GTELAdmittedForwardCommitmentContinuityBand;
  admissionSupport: number;
  arcContinuityFeed: number;
  summary: string;
}

export type GTELBilateralCommitmentWindowHandoffBand = 'handed_off' | 'aligning' | 'queued' | 'blocked';

export interface GTELBilateralCommitmentWindowHandoffSnapshot {
  score: number;
  band: GTELBilateralCommitmentWindowHandoffBand;
  continuityAnchor: number;
  windowFeed: number;
  summary: string;
}

export type GTELCommitmentWindowSustainmentBand = 'sustained' | 'carrying' | 'fading' | 'dropped';

export interface GTELCommitmentWindowSustainmentSnapshot {
  score: number;
  band: GTELCommitmentWindowSustainmentBand;
  handoffSupport: number;
  admittedAnchor: number;
  summary: string;
}

export type GTELBilateralForwardCycleAdvanceGateBand = 'advanced' | 'clearing' | 'held' | 'denied';

export interface GTELBilateralForwardCycleAdvanceGateSnapshot {
  score: number;
  band: GTELBilateralForwardCycleAdvanceGateBand;
  sustainmentFeed: number;
  sealLift: number;
  summary: string;
}

export type GTELForwardCycleAdvanceContinuityBand = 'locked_in' | 'tracking' | 'wavering' | 'broken';

export interface GTELForwardCycleAdvanceContinuitySnapshot {
  score: number;
  band: GTELForwardCycleAdvanceContinuityBand;
  advanceSupport: number;
  sustainmentFeed: number;
  summary: string;
}

export type GTELBilateralCommitmentLoopReopenGateBand = 'reopened' | 'unlocking' | 'latched' | 'sealed';

export interface GTELBilateralCommitmentLoopReopenGateSnapshot {
  score: number;
  band: GTELBilateralCommitmentLoopReopenGateBand;
  continuityAnchor: number;
  loopLift: number;
  summary: string;
}

export type GTELReopenedCommitmentLoopContinuityBand = 'stable' | 'linked' | 'fraying' | 'cut';

export interface GTELReopenedCommitmentLoopContinuitySnapshot {
  score: number;
  band: GTELReopenedCommitmentLoopContinuityBand;
  reopenSupport: number;
  advanceAnchor: number;
  summary: string;
}

export type GTELBilateralForwardArcRechargeGateBand = 'recharged' | 'charging' | 'starved' | 'blocked';

export interface GTELBilateralForwardArcRechargeGateSnapshot {
  score: number;
  band: GTELBilateralForwardArcRechargeGateBand;
  loopContinuityFeed: number;
  renewalLift: number;
  summary: string;
}

export type GTELForwardArcRechargeContinuityBand = 'held' | 'carrying' | 'thinning' | 'lost';

export interface GTELForwardArcRechargeContinuitySnapshot {
  score: number;
  band: GTELForwardArcRechargeContinuityBand;
  rechargeSupport: number;
  loopFeed: number;
  summary: string;
}

export type GTELBilateralRenewalArcPrimingGateBand = 'primed' | 'arming' | 'idle' | 'blocked';

export interface GTELBilateralRenewalArcPrimingGateSnapshot {
  score: number;
  band: GTELBilateralRenewalArcPrimingGateBand;
  rechargeContinuityFeed: number;
  readinessLift: number;
  summary: string;
}

export type GTELRenewalArcPrimingContinuityBand = 'settled' | 'holding' | 'unsettled' | 'void';

export interface GTELRenewalArcPrimingContinuitySnapshot {
  score: number;
  band: GTELRenewalArcPrimingContinuityBand;
  primingGateSupport: number;
  rechargeAnchor: number;
  summary: string;
}

export type GTELBilateralNextArcOpenPrepGateBand = 'prepped' | 'staging' | 'deferred' | 'blocked';

export interface GTELBilateralNextArcOpenPrepGateSnapshot {
  score: number;
  band: GTELBilateralNextArcOpenPrepGateBand;
  continuityFeed: number;
  cyclePrimingLift: number;
  summary: string;
}

export type GTELNextArcOpenPrepContinuityBand = 'ready' | 'aligned' | 'drifting' | 'cleared';

export interface GTELNextArcOpenPrepContinuitySnapshot {
  score: number;
  band: GTELNextArcOpenPrepContinuityBand;
  prepGateSupport: number;
  primingAnchor: number;
  summary: string;
}

export type GTELBilateralPreparedArcOpeningHandoffBand = 'handed_off' | 'coupling' | 'queued' | 'withheld';

export interface GTELBilateralPreparedArcOpeningHandoffSnapshot {
  score: number;
  band: GTELBilateralPreparedArcOpeningHandoffBand;
  prepContinuityFeed: number;
  arcOpeningLift: number;
  summary: string;
}

export type GTELPreparedArcHandoffContinuityBand = 'locked' | 'tracking' | 'slack' | 'broken';

export interface GTELPreparedArcHandoffContinuitySnapshot {
  score: number;
  band: GTELPreparedArcHandoffContinuityBand;
  handoffSupport: number;
  prepAnchor: number;
  summary: string;
}

export type GTELBilateralScaleLoopSealGateBand = 'sealed' | 'tightening' | 'pending' | 'open';

export interface GTELBilateralScaleLoopSealGateSnapshot {
  score: number;
  band: GTELBilateralScaleLoopSealGateBand;
  handoffContinuityFeed: number;
  cycleSealLift: number;
  summary: string;
}

export interface GlobalTradeEconomyPanelProps {
  state: GTELState | null;
  theme?: { isDark?: boolean };
  onAsk?: (question: string) => void;
}
