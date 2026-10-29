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

export interface GlobalTradeEconomyPanelProps {
  state: GTELState | null;
  theme?: { isDark?: boolean };
  onAsk?: (question: string) => void;
}
