// OP10M_MODULE_BEGIN agent-15-trade
// Agent 15 — Global trade, diplomacy, sanctions & world economy (generated; source: operation-10m/agent-15-trade/src/)

// --- source: types.ts ---
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

export interface GlobalTradeEconomyPanelProps {
  state: GTELState | null;
  theme?: { isDark?: boolean };
  onAsk?: (question: string) => void;
}


// --- source: constants.ts ---

export const GTEL_COMMODITIES: GTELCommodityId[] = [
  'iron_ore',
  'coal',
  'lng',
  'wheat',
  'beef',
  'aluminium',
  'services',
  'manufacturing',
];

export const GTEL_COMMODITY_LABEL: Record<GTELCommodityId, string> = {
  iron_ore: 'Iron ore',
  coal: 'Coal',
  lng: 'LNG',
  wheat: 'Wheat',
  beef: 'Beef',
  aluminium: 'Aluminium',
  services: 'Services exports',
  manufacturing: 'Manufactured goods',
};

export const GTEL_PARTNER_DEFS: Array<{
  id: GTELPartnerId;
  label: string;
  baseOpenness: number;
  demandWeights: Partial<Record<GTELCommodityId, number>>;
  priceSensitivity: number;
  diplomaticActorIds: string[];
}> = [
  {
    id: 'asia_pacific',
    label: 'Asia–Pacific buyers',
    baseOpenness: 0.92,
    demandWeights: { iron_ore: 1.2, coal: 0.9, lng: 1.1, aluminium: 1.0, manufacturing: 0.85, services: 0.7 },
    priceSensitivity: 1.05,
    diplomaticActorIds: ['ai', 'rival_east', 'team_blue_lead'],
  },
  {
    id: 'india_ocean',
    label: 'Indian Ocean & ASEAN',
    baseOpenness: 0.88,
    demandWeights: { wheat: 1.1, beef: 0.95, coal: 0.8, services: 0.75, manufacturing: 0.9 },
    priceSensitivity: 1.0,
    diplomaticActorIds: ['rival_south'],
  },
  {
    id: 'north_america',
    label: 'North America',
    baseOpenness: 0.75,
    demandWeights: { lng: 0.9, services: 1.15, manufacturing: 1.05, beef: 0.85 },
    priceSensitivity: 0.95,
    diplomaticActorIds: ['rival_west'],
  },
  {
    id: 'europe',
    label: 'Europe',
    baseOpenness: 0.7,
    demandWeights: { lng: 1.0, services: 1.1, aluminium: 0.95, wheat: 0.6 },
    priceSensitivity: 0.9,
    diplomaticActorIds: ['rival_north'],
  },
  {
    id: 'domestic_premium',
    label: 'Domestic premium channels',
    baseOpenness: 1.0,
    demandWeights: { wheat: 0.8, beef: 0.85, services: 0.5, manufacturing: 0.55 },
    priceSensitivity: 0.85,
    diplomaticActorIds: ['player'],
  },
];

export const GTEL_LIMITS = { history: 24, embargoCooldown: 8, smoothing: 0.35, maxEvent: 6, maxAgreements: 12 } as const;

export const GTEL_ACCESS_RANK: Record<GTELAccessBand, number> = {
  blocked: 0,
  restricted: 1,
  normal: 2,
  preferred: 3,
  strategic: 4,
};

export const GTEL_BASE_COMMODITY_INDEX: Record<GTELCommodityId, number> = {
  iron_ore: 100,
  coal: 88,
  lng: 112,
  wheat: 76,
  beef: 82,
  aluminium: 95,
  services: 105,
  manufacturing: 98,
};

export const AU_TRADE_REGIONS = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;


// --- source: util.ts ---
export function gtelNum(v: unknown, d = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
}

export function gtelClamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function gtelHash(parts: unknown[]): string {
  return parts
    .map(p => {
      try {
        return JSON.stringify(p);
      } catch {
        return String(p);
      }
    })
    .join('|')
    .slice(0, 240);
}

export function gtelAssert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`Agent15 GTEL: ${msg}`);
}


// --- source: persist.ts ---

export function createEmptyGTELPersisted(): GTELPersisted {
  return {
    schemaVersion: 1,
    revision: 0,
    lastProcessedTurn: null,
    partnerAccess: {},
    commoditySmoothing: {},
    embargoCooldowns: {},
    recentEvents: [],
    agreements: [],
    activeShocks: [],
    partnerSanctions: {},
    firedShockScenarios: [],
    partnerTrust: {},
    tradePolicies: [],
    tradeDisputes: [],
    tradeCompliance: createEmptyTradeComplianceRecord(),
    importDependencySmoothing: {},
    diplomaticEngagement: {},
    tradeFinanceSmoothing: 0.62,
    partnerMixSmoothing: {},
    termsOfTradeSmoothing: 1,
    supplyChainResilienceSmoothing: 0.58,
    foreignExchangeSmoothing: 1,
    retaliationPressureSmoothing: 0.22,
    deescalationMomentumSmoothing: 0.28,
    exportCapacitySmoothing: 0.62,
    reconciliationProgressSmoothing: 0.24,
    maritimeRiskSmoothing: 0.22,
    preferentialUtilizationSmoothing: 0.48,
    enforcementIntensitySmoothing: 0.26,
    exportInsuranceStackSmoothing: 0.56,
    accessRestorationSmoothing: 0.3,
    tradeCorridorSmoothing: 0.54,
    sanctionsSpilloverSmoothing: 0.24,
    tradeFxHedgingSmoothing: 0.5,
    importLanePressureSmoothing: 0.38,
    diplomaticTradeCoherenceSmoothing: 0.48,
    tradeBalanceStabilizationSmoothing: 0.52,
  };
}

function sanitizeAgreement(raw: unknown): TradeAgreementRecord | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.templateId !== 'string') return null;
  const partnerId = String(r.partnerId || '') as GTELPartnerId;
  if (!GTEL_PARTNER_DEFS.some(p => p.id === partnerId)) return null;
  const status = ['draft', 'negotiating', 'ratified', 'suspended', 'expired'].includes(String(r.status))
    ? (r.status as TradeAgreementRecord['status'])
    : 'draft';
  const tariffLines = (Array.isArray(r.tariffLines) ? r.tariffLines : [])
    .filter((t: unknown) => t && typeof t === 'object')
    .slice(0, 8)
    .map((t: any) => ({
      commodity: GTEL_COMMODITIES.includes(t.commodity) ? t.commodity : 'services',
      tariffCut: gtelClamp(gtelNum(t.tariffCut, 0), 0, 0.5),
      quotaCap: t.quotaCap == null ? null : Math.max(0, Math.floor(gtelNum(t.quotaCap, 0))),
    }));
  return {
    id: r.id.slice(0, 80),
    templateId: String(r.templateId).slice(0, 40),
    title: String(r.title || 'Trade agreement').slice(0, 120),
    partnerId,
    counterpartyActorIds: (Array.isArray(r.counterpartyActorIds) ? r.counterpartyActorIds : []).map(String).slice(0, 4),
    status,
    ratifiedTurn: r.ratifiedTurn == null ? null : Math.max(1, Math.floor(gtelNum(r.ratifiedTurn, 1))),
    expiresTurn: r.expiresTurn == null ? null : Math.max(1, Math.floor(gtelNum(r.expiresTurn, 1))),
    tariffLines,
    accessBoost: gtelClamp(gtelNum(r.accessBoost, 0.05), 0, 0.25),
    notes: (Array.isArray(r.notes) ? r.notes : []).map(String).slice(0, 6),
  };
}

export function sanitizeGTELPersisted(raw: unknown, turn = 1): GTELPersisted {
  const base = createEmptyGTELPersisted();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  base.revision = Math.max(0, Math.floor(gtelNum(r.revision, 0)));
  base.lastProcessedTurn = r.lastProcessedTurn === null ? null : Math.max(1, Math.floor(gtelNum(r.lastProcessedTurn, turn)));
  if (r.partnerAccess && typeof r.partnerAccess === 'object') {
    Object.entries(r.partnerAccess as Record<string, string>).forEach(([k, v]) => {
      if (GTEL_PARTNER_DEFS.some(p => p.id === k) && ['blocked', 'restricted', 'normal', 'preferred', 'strategic'].includes(v)) {
        base.partnerAccess[k as GTELPartnerId] = v as GTELAccessBand;
      }
    });
  }
  if (r.commoditySmoothing && typeof r.commoditySmoothing === 'object') {
    GTEL_COMMODITIES.forEach(c => {
      const v = gtelNum((r.commoditySmoothing as Record<string, number>)[c], GTEL_BASE_COMMODITY_INDEX[c]);
      base.commoditySmoothing[c] = gtelClamp(v, 40, 180);
    });
  }
  if (r.embargoCooldowns && typeof r.embargoCooldowns === 'object') {
    Object.entries(r.embargoCooldowns as Record<string, number>)
      .slice(0, 12)
      .forEach(([k, v]) => {
        base.embargoCooldowns[k.slice(0, 40)] = Math.max(0, Math.floor(gtelNum(v, 0)));
      });
  }
  if (Array.isArray(r.recentEvents)) {
    base.recentEvents = r.recentEvents
      .filter((e: unknown) => e && typeof e === 'object' && typeof (e as any).id === 'string')
      .slice(-GTEL_LIMITS.history)
      .map((e: any) => ({
        id: String(e.id).slice(0, 60),
        turn: Math.max(1, Math.floor(gtelNum(e.turn, turn))),
        kind: String(e.kind || 'trade').slice(0, 24),
        text: String(e.text || '').slice(0, 200),
      }));
  }
  if (Array.isArray(r.agreements)) {
    base.agreements = r.agreements.map(sanitizeAgreement).filter(Boolean).slice(-GTEL_LIMITS.maxAgreements) as TradeAgreementRecord[];
  }
  if (Array.isArray(r.activeShocks)) {
    base.activeShocks = r.activeShocks
      .filter((s: unknown) => s && typeof s === 'object' && typeof (s as any).shockId === 'string')
      .slice(0, 8)
      .map((s: any) => ({
        shockId: String(s.shockId).slice(0, 40),
        startedTurn: Math.max(1, Math.floor(gtelNum(s.startedTurn, turn))),
        endsTurn: Math.max(1, Math.floor(gtelNum(s.endsTurn, turn + 1))),
        remainingIntensity: gtelClamp(gtelNum(s.remainingIntensity, 1), 0.1, 1),
      }));
  }
  if (r.partnerSanctions && typeof r.partnerSanctions === 'object') {
    Object.entries(r.partnerSanctions as Record<string, unknown>).slice(0, 6).forEach(([k, v]) => {
      if (!GTEL_PARTNER_DEFS.some(p => p.id === k)) return;
      base.partnerSanctions![k as GTELPartnerId] = sanitizePartnerSanctionRegime(v, k as GTELPartnerId);
    });
  }
  if (Array.isArray(r.firedShockScenarios)) {
    base.firedShockScenarios = r.firedShockScenarios.map(String).slice(-16);
  }
  if (r.partnerTrust && typeof r.partnerTrust === 'object') {
    Object.entries(r.partnerTrust as Record<string, unknown>).slice(0, 6).forEach(([k, v]) => {
      if (!GTEL_PARTNER_DEFS.some(p => p.id === k)) return;
      base.partnerTrust![k as GTELPartnerId] = sanitizePartnerTrustScore(v, k as GTELPartnerId, turn);
    });
  }
  if (Array.isArray(r.tradePolicies)) {
    base.tradePolicies = r.tradePolicies
      .filter((p: unknown) => p && typeof p === 'object')
      .slice(-8)
      .map((p: any) => ({
        id: String(p.id || '').slice(0, 60),
        kind: ['export_quota_relief', 'tariff_surge', 'preferential_lane', 'diversification_push'].includes(p.kind)
          ? p.kind
          : 'diversification_push',
        title: String(p.title || 'Policy').slice(0, 100),
        partnerId: GTEL_PARTNER_DEFS.some(x => x.id === p.partnerId) ? p.partnerId : null,
        commodity: GTEL_COMMODITIES.includes(p.commodity) ? p.commodity : null,
        status: ['proposed', 'active', 'expired', 'suspended'].includes(p.status) ? p.status : 'active',
        activatedTurn: Math.max(1, Math.floor(gtelNum(p.activatedTurn, turn))),
        expiresTurn: p.expiresTurn == null ? null : Math.max(1, Math.floor(gtelNum(p.expiresTurn, turn))),
        accessDelta: gtelClamp(gtelNum(p.accessDelta, 0), -0.3, 0.3),
        commodityDelta: gtelClamp(gtelNum(p.commodityDelta, 0), -0.3, 0.3),
        domesticStressDelta: gtelClamp(gtelNum(p.domesticStressDelta, 0), -0.1, 0.2),
        summary: String(p.summary || '').slice(0, 200),
      })) as TradePolicyInstrument[];
  }
  if (Array.isArray(r.tradeDisputes)) {
    base.tradeDisputes = r.tradeDisputes
      .filter((d: unknown) => d && typeof d === 'object')
      .slice(-12)
      .map((d: any) => ({
        id: String(d.id || '').slice(0, 60),
        partnerId: GTEL_PARTNER_DEFS.some(x => x.id === d.partnerId) ? d.partnerId : 'asia_pacific',
        status: ['open', 'mediation', 'resolved', 'escalated'].includes(d.status) ? d.status : 'open',
        openedTurn: Math.max(1, Math.floor(gtelNum(d.openedTurn, turn))),
        resolvedTurn: d.resolvedTurn == null ? null : Math.max(1, Math.floor(gtelNum(d.resolvedTurn, turn))),
        subject: String(d.subject || '').slice(0, 160),
        requestedRelief: ['sanction_step_down', 'shock_containment', 'quota_restoration'].includes(d.requestedRelief)
          ? d.requestedRelief
          : 'sanction_step_down',
        severity: gtelClamp(gtelNum(d.severity, 0.5), 0.1, 1),
      })) as TradeDisputeCase[];
  }
  base.tradeCompliance = sanitizeTradeComplianceRecord(r.tradeCompliance, turn);
  base.importDependencySmoothing = sanitizeImportDependencySmoothing(r.importDependencySmoothing);
  if (r.diplomaticEngagement && typeof r.diplomaticEngagement === 'object') {
    Object.entries(r.diplomaticEngagement as Record<string, unknown>).slice(0, 6).forEach(([k, v]) => {
      if (!GTEL_PARTNER_DEFS.some(p => p.id === k) || !v || typeof v !== 'object') return;
      const row = v as Record<string, unknown>;
      base.diplomaticEngagement![k as GTELPartnerId] = {
        momentum: gtelClamp(gtelNum(row.momentum, 0.4), 0.08, 0.98),
        lastEventTurn: Math.max(1, Math.floor(gtelNum(row.lastEventTurn, turn))),
        highlights: (Array.isArray(row.highlights) ? row.highlights : []).map(String).slice(0, 4),
      };
    });
  }
  base.tradeFinanceSmoothing = sanitizeTradeFinanceSmoothing(r.tradeFinanceSmoothing);
  base.partnerMixSmoothing = sanitizePartnerMixSmoothing(r.partnerMixSmoothing);
  base.termsOfTradeSmoothing = sanitizeTermsOfTradeSmoothing(r.termsOfTradeSmoothing);
  base.supplyChainResilienceSmoothing = sanitizeSupplyChainResilienceSmoothing(r.supplyChainResilienceSmoothing);
  base.foreignExchangeSmoothing = sanitizeForeignExchangeSmoothing(r.foreignExchangeSmoothing);
  base.retaliationPressureSmoothing = sanitizeRetaliationPressureSmoothing(r.retaliationPressureSmoothing);
  base.deescalationMomentumSmoothing = sanitizeDeescalationMomentumSmoothing(r.deescalationMomentumSmoothing);
  base.exportCapacitySmoothing = sanitizeExportCapacitySmoothing(r.exportCapacitySmoothing);
  base.reconciliationProgressSmoothing = sanitizeReconciliationProgressSmoothing(r.reconciliationProgressSmoothing);
  base.maritimeRiskSmoothing = sanitizeMaritimeRiskSmoothing(r.maritimeRiskSmoothing);
  base.preferentialUtilizationSmoothing = sanitizePreferentialUtilizationSmoothing(
    r.preferentialUtilizationSmoothing,
  );
  base.enforcementIntensitySmoothing = sanitizeEnforcementIntensitySmoothing(r.enforcementIntensitySmoothing);
  base.exportInsuranceStackSmoothing = sanitizeExportInsuranceStackSmoothing(r.exportInsuranceStackSmoothing);
  base.accessRestorationSmoothing = sanitizeAccessRestorationSmoothing(r.accessRestorationSmoothing);
  base.tradeCorridorSmoothing = sanitizeTradeCorridorSmoothing(r.tradeCorridorSmoothing);
  base.sanctionsSpilloverSmoothing = sanitizeSanctionsSpilloverSmoothing(r.sanctionsSpilloverSmoothing);
  base.tradeFxHedgingSmoothing = sanitizeTradeFxHedgingSmoothing(r.tradeFxHedgingSmoothing);
  base.importLanePressureSmoothing = sanitizeImportLanePressureSmoothing(r.importLanePressureSmoothing);
  base.diplomaticTradeCoherenceSmoothing = sanitizeDiplomaticTradeCoherenceSmoothing(
    r.diplomaticTradeCoherenceSmoothing,
  );
  base.tradeBalanceStabilizationSmoothing = sanitizeTradeBalanceStabilizationSmoothing(
    r.tradeBalanceStabilizationSmoothing,
  );
  return base;
}


// --- source: diplomacy-linkage.ts ---

export function gtelActiveDeals(st: GTELDiplomacyState | null): GTELDiplomaticDeal[] {
  if (!st || !Array.isArray(st.deals)) return [];
  return st.deals.filter(d => d && (d.status === 'active' || d.compliance === 'compliant' || d.compliance === 'at_risk'));
}

export function gtelRecentViolations(st: GTELDiplomacyState | null, turn: number, window = 6): number {
  if (!st) return 0;
  let n = 0;
  (st.deals || []).forEach(d => {
    if (d.status === 'violated' || d.compliance === 'violated') n += 1;
  });
  (st.events || []).forEach(ev => {
    if (turn - ev.turn <= window && /violation|embargo|breach/i.test(String(ev.kind) + ev.text)) n += 1;
  });
  return n;
}

export function deriveDiplomaticTradeModifiers(
  diplomacyState: GTELDiplomacyState | null,
  turn: number,
  actorNames: Record<string, string> = {},
): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  const notes: string[] = [];
  const deals = gtelActiveDeals(diplomacyState);
  const actorPartner = (actorId: string): GTELPartnerId | null => {
    const def = GTEL_PARTNER_DEFS.find(p => p.diplomaticActorIds.includes(actorId));
    return def ? def.id : null;
  };

  deals.forEach(deal => {
    const isTrade = deal.type === 'resource_trade' || (deal.terms || []).some(t => t.kind === 'transfer_resource');
    if (!isTrade) return;
    deal.participants.forEach(pid => {
      const partner = actorPartner(pid);
      if (partner) partnerDeltas[partner] = (partnerDeltas[partner] || 0) + 0.08;
    });
    (deal.terms || []).forEach(term => {
      if (term.kind !== 'transfer_resource') return;
      const res = String(term.resourceId || 'iron_ore').toLowerCase();
      const commodity = GTEL_COMMODITIES.find(c => res.includes(c.replace('_', '')) || res.includes(c)) || 'iron_ore';
      commodityDeltas[commodity] = (commodityDeltas[commodity] || 0) + gtelClamp(gtelNum(term.amount, 500) / 5000, 0.02, 0.12);
    });
    const who = deal.participants.map(p => actorNames[p] || p).join(' ↔ ');
    notes.push(`Active trade arrangement (${who}) supports partner access.`);
  });

  const violations = gtelRecentViolations(diplomacyState, turn);
  if (violations > 0) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id === 'domestic_premium') return;
      partnerDeltas[p.id] = (partnerDeltas[p.id] || 0) - 0.06 * violations;
    });
    notes.push(`Recent diplomatic friction (${violations} signal${violations > 1 ? 's' : ''}) tightens external market access.`);
  }

  return { partnerDeltas, commodityDeltas, notes };
}

export function gtelNetworkModifier(national: import('./types.ts').GTELNationalSystemsSlice | null): {
  networkMod: number;
  condition: string;
  throughput: number;
} {
  const trade = national?.national?.trade;
  const condition = String(trade?.condition || 'healthy');
  const rank: Record<string, number> = { surplus: 0.08, healthy: 0.03, strained: -0.04, bottlenecked: -0.1, critical: -0.18 };
  const networkMod = rank[condition] ?? 0;
  let exported = gtelNum(trade?.exportedCapacity, 0);
  if (!exported && national?.regions) {
    exported = Object.values(national.regions).reduce((acc, r) => acc + gtelNum(r?.networks?.trade?.exportedCapacity, 0), 0);
  }
  return { networkMod, condition, throughput: exported };
}

export function gtelAccessBandFromScore(score: number): import('./types.ts').GTELAccessBand {
  if (score < 0.25) return 'blocked';
  if (score < 0.45) return 'restricted';
  if (score < 0.65) return 'normal';
  if (score < 0.85) return 'preferred';
  return 'strategic';
}


// --- source: trade-agreements.ts ---
  GTELCommodityId,
  GTELPartnerId,
  GTELPersisted,
  TradeAgreementRecord,
  TradeAgreementTariffLine,
} from './types.ts';

export interface TradeAgreementTemplate {
  id: string;
  title: string;
  partnerId: GTELPartnerId;
  defaultDurationTurns: number;
  accessBoost: number;
  tariffLines: TradeAgreementTariffLine[];
  summary: string;
}

export const TRADE_AGREEMENT_TEMPLATES: TradeAgreementTemplate[] = [
  {
    id: 'fta_asia_bulk',
    title: 'Asia–Pacific bulk commodities FTA',
    partnerId: 'asia_pacific',
    defaultDurationTurns: 24,
    accessBoost: 0.12,
    tariffLines: [
      { commodity: 'iron_ore', tariffCut: 0.08 },
      { commodity: 'coal', tariffCut: 0.06 },
      { commodity: 'lng', tariffCut: 0.05 },
    ],
    summary: 'Cuts bulk export frictions with Asia–Pacific buyers.',
  },
  {
    id: 'services_eu_mutual',
    title: 'EU–Australia services recognition pact',
    partnerId: 'europe',
    defaultDurationTurns: 18,
    accessBoost: 0.08,
    tariffLines: [{ commodity: 'services', tariffCut: 0.1 }],
    summary: 'Professional services exports face lower non-tariff barriers in Europe.',
  },
  {
    id: 'agri_asean',
    title: 'ASEAN agricultural corridor',
    partnerId: 'india_ocean',
    defaultDurationTurns: 16,
    accessBoost: 0.07,
    tariffLines: [
      { commodity: 'wheat', tariffCut: 0.07, quotaCap: 5000 },
      { commodity: 'beef', tariffCut: 0.05, quotaCap: 3000 },
    ],
    summary: 'Quota-managed wheat and beef access into Indian Ocean markets.',
  },
  {
    id: 'domestic_premium_anchor',
    title: 'Domestic premium supply anchor',
    partnerId: 'domestic_premium',
    defaultDurationTurns: 12,
    accessBoost: 0.04,
    tariffLines: [
      { commodity: 'wheat', tariffCut: 0.03 },
      { commodity: 'manufacturing', tariffCut: 0.04 },
    ],
    summary: 'Stabilises domestic premium channels when export markets tighten.',
  },
];

export function getTradeAgreementTemplate(templateId: string): TradeAgreementTemplate | null {
  return TRADE_AGREEMENT_TEMPLATES.find(t => t.id === templateId) || null;
}

export function createTradeAgreementFromTemplate(
  templateId: string,
  turn: number,
  counterpartyActorIds: string[],
  overrides: Partial<Pick<TradeAgreementRecord, 'id' | 'title'>> = {},
): TradeAgreementRecord | null {
  const tpl = getTradeAgreementTemplate(templateId);
  if (!tpl) return null;
  const id = overrides.id || `ta_${templateId}_${turn}`;
  return {
    id: id.slice(0, 80),
    templateId: tpl.id,
    title: (overrides.title || tpl.title).slice(0, 120),
    partnerId: tpl.partnerId,
    counterpartyActorIds: counterpartyActorIds.slice(0, 4),
    status: 'negotiating',
    ratifiedTurn: null,
    expiresTurn: turn + tpl.defaultDurationTurns,
    tariffLines: tpl.tariffLines.map(l => ({ ...l })),
    accessBoost: tpl.accessBoost,
    notes: [tpl.summary],
  };
}

export function ratifyTradeAgreement(agreement: TradeAgreementRecord, turn: number): TradeAgreementRecord {
  if (agreement.status === 'ratified') return agreement;
  return {
    ...agreement,
    status: 'ratified',
    ratifiedTurn: turn,
    expiresTurn: agreement.expiresTurn ?? turn + 12,
    notes: [...agreement.notes, `Ratified turn ${turn}.`],
  };
}

export function expireStaleAgreements(persisted: GTELPersisted, turn: number): TradeAgreementRecord[] {
  return persisted.agreements.map(a => {
    if (a.status === 'ratified' && a.expiresTurn != null && turn > a.expiresTurn) {
      return { ...a, status: 'expired' as const, notes: [...a.notes, `Expired after turn ${a.expiresTurn}.`] };
    }
    return a;
  });
}

/** Modifiers from ratified structured agreements (stacked with diplomacy deals). */
export function deriveTradeAgreementModifiers(persisted: GTELPersisted, turn: number): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  const notes: string[] = [];
  const active = persisted.agreements.filter(
    a => a.status === 'ratified' && (a.expiresTurn == null || turn <= a.expiresTurn),
  );
  active.forEach(a => {
    partnerDeltas[a.partnerId] = (partnerDeltas[a.partnerId] || 0) + a.accessBoost;
    a.tariffLines.forEach(line => {
      if (!GTEL_COMMODITIES.includes(line.commodity)) return;
      commodityDeltas[line.commodity] = (commodityDeltas[line.commodity] || 0) + line.tariffCut * 0.35;
    });
    notes.push(`${a.title} (${GTEL_PARTNER_DEFS.find(p => p.id === a.partnerId)?.label || a.partnerId}) is active.`);
  });
  if (active.length >= GTEL_LIMITS.maxAgreements - 2) {
    notes.push('Agreement portfolio is near capacity — renegotiation may be required.');
  }
  return { partnerDeltas, commodityDeltas, notes };
}

export function mergePartnerDeltas(
  a: Partial<Record<GTELPartnerId, number>>,
  b: Partial<Record<GTELPartnerId, number>>,
): Partial<Record<GTELPartnerId, number>> {
  const out: Partial<Record<GTELPartnerId, number>> = { ...a };
  Object.entries(b).forEach(([k, v]) => {
    const id = k as GTELPartnerId;
    out[id] = gtelClamp(gtelNum(out[id], 0) + gtelNum(v, 0), -0.5, 0.5);
  });
  return out;
}

export function mergeCommodityDeltas(
  a: Partial<Record<GTELCommodityId, number>>,
  b: Partial<Record<GTELCommodityId, number>>,
): Partial<Record<GTELCommodityId, number>> {
  const out: Partial<Record<GTELCommodityId, number>> = { ...a };
  Object.entries(b).forEach(([k, v]) => {
    const id = k as GTELCommodityId;
    out[id] = gtelClamp(gtelNum(out[id], 0) + gtelNum(v, 0), -0.4, 0.4);
  });
  return out;
}


// --- source: world-shocks.ts ---
  ActiveWorldTradeShock,
  GTELCommodityId,
  GTELPartnerId,
  GTELPersisted,
  WorldTradeShockDefinition,
} from './types.ts';

export const WORLD_TRADE_SHOCK_CATALOG: WorldTradeShockDefinition[] = [
  {
    id: 'shock_suez_style',
    kind: 'shipping_disruption',
    title: 'Global shipping lane disruption',
    summary: 'Freight bottlenecks raise export costs and delay partner deliveries.',
    durationTurns: 5,
    partnerIds: ['asia_pacific', 'india_ocean', 'europe'],
    commodityDeltas: { manufacturing: -0.06, services: -0.04 },
    partnerAccessDelta: -0.1,
    domesticStress: 0.08,
    regionIds: ['NSW', 'VIC', 'QLD'],
  },
  {
    id: 'shock_iron_crash',
    kind: 'commodity_crash',
    title: 'Iron ore price collapse',
    summary: 'Bulk buyers pull back; mining regions feel the squeeze first.',
    durationTurns: 6,
    partnerIds: ['asia_pacific'],
    commodityDeltas: { iron_ore: -0.18, coal: -0.06 },
    partnerAccessDelta: -0.05,
    domesticStress: 0.12,
    regionIds: ['WA', 'QLD'],
  },
  {
    id: 'shock_lng_spike',
    kind: 'commodity_spike',
    title: 'LNG spot spike',
    summary: 'Energy export premiums jump while households face pass-through pressure.',
    durationTurns: 4,
    partnerIds: ['asia_pacific', 'north_america'],
    commodityDeltas: { lng: 0.14, services: 0.03 },
    partnerAccessDelta: 0.06,
    domesticStress: 0.1,
    regionIds: ['WA', 'QLD', 'NSW'],
  },
  {
    id: 'shock_eu_embargo',
    kind: 'partner_embargo',
    title: 'Partial European market embargo',
    summary: 'Compliance disputes block a slice of services and aluminium exports.',
    durationTurns: 7,
    partnerIds: ['europe'],
    commodityDeltas: { aluminium: -0.1, services: -0.08 },
    partnerAccessDelta: -0.2,
    domesticStress: 0.09,
    regionIds: ['VIC', 'NSW', 'SA'],
  },
  {
    id: 'shock_supply_chain',
    kind: 'supply_chain',
    title: 'Manufacturing input shortage',
    summary: 'Imported components stall; manufacturing export indices soften.',
    durationTurns: 5,
    partnerIds: ['north_america', 'asia_pacific'],
    commodityDeltas: { manufacturing: -0.12, coal: -0.03 },
    partnerAccessDelta: -0.07,
    domesticStress: 0.07,
    regionIds: ['VIC', 'SA', 'NSW'],
  },
  {
    id: 'shock_financial_contagion',
    kind: 'financial_contagion',
    title: 'Trade finance tightening',
    summary: 'Letters of credit cost more; all partner gates slip one band.',
    durationTurns: 4,
    partnerIds: ['asia_pacific', 'india_ocean', 'north_america', 'europe'],
    commodityDeltas: { services: -0.05, beef: -0.04, wheat: -0.04 },
    partnerAccessDelta: -0.12,
    domesticStress: 0.11,
    regionIds: ['NSW', 'VIC', 'WA'],
  },
  {
    id: 'shock_coal_softening',
    kind: 'commodity_crash',
    title: 'Coal export softening',
    summary: 'Thermal coal buyers delay cargoes; QLD and NSW networks feel idle capacity.',
    durationTurns: 5,
    partnerIds: ['asia_pacific', 'india_ocean'],
    commodityDeltas: { coal: -0.11, manufacturing: -0.02 },
    partnerAccessDelta: -0.04,
    domesticStress: 0.07,
    regionIds: ['QLD', 'NSW'],
  },
  {
    id: 'shock_wheat_drought',
    kind: 'commodity_crash',
    title: 'Wheat belt drought',
    summary: 'Domestic and export wheat quotes weaken on yield downgrades.',
    durationTurns: 6,
    partnerIds: ['india_ocean', 'domestic_premium'],
    commodityDeltas: { wheat: -0.14, beef: -0.03 },
    partnerAccessDelta: -0.03,
    domesticStress: 0.09,
    regionIds: ['NSW', 'SA', 'VIC'],
  },
  {
    id: 'shock_beef_access',
    kind: 'partner_embargo',
    title: 'Beef market access friction',
    summary: 'Sanitary and quota disputes delay beef consignments to key buyers.',
    durationTurns: 5,
    partnerIds: ['north_america', 'india_ocean'],
    commodityDeltas: { beef: -0.12, services: -0.02 },
    partnerAccessDelta: -0.09,
    domesticStress: 0.08,
    regionIds: ['QLD', 'TAS', 'NSW'],
  },
  {
    id: 'shock_aluminium_retaliation',
    kind: 'sanctions_retaliation',
    title: 'Aluminium tariff retaliation',
    summary: 'Retaliatory duties hit aluminium and downstream manufacturing exports.',
    durationTurns: 6,
    partnerIds: ['europe', 'north_america'],
    commodityDeltas: { aluminium: -0.15, manufacturing: -0.07 },
    partnerAccessDelta: -0.14,
    domesticStress: 0.1,
    regionIds: ['VIC', 'SA', 'NSW'],
  },
];

export function getWorldTradeShockDefinition(shockId: string): WorldTradeShockDefinition | null {
  return WORLD_TRADE_SHOCK_CATALOG.find(s => s.id === shockId) || null;
}

export function activateWorldTradeShock(
  persisted: GTELPersisted,
  shockId: string,
  turn: number,
): { persisted: GTELPersisted; activated: ActiveWorldTradeShock | null } {
  const def = getWorldTradeShockDefinition(shockId);
  if (!def) return { persisted, activated: null };
  if (persisted.activeShocks.some(s => s.shockId === shockId && turn <= s.endsTurn)) {
    return { persisted, activated: null };
  }
  const active: ActiveWorldTradeShock = {
    shockId: def.id,
    startedTurn: turn,
    endsTurn: turn + def.durationTurns,
    remainingIntensity: 1,
  };
  return {
    persisted: { ...persisted, activeShocks: [...persisted.activeShocks, active].slice(-8) },
    activated: active,
  };
}

export function tickActiveShocks(persisted: GTELPersisted, turn: number): GTELPersisted {
  const activeShocks = persisted.activeShocks
    .filter(s => turn <= s.endsTurn)
    .map(s => ({
      ...s,
      remainingIntensity: gtelClamp(s.remainingIntensity - 1 / Math.max(1, s.endsTurn - s.startedTurn + 1), 0.15, 1),
    }));
  return { ...persisted, activeShocks };
}

export function scheduledShockIdForTurn(turn: number): string | null {
  if (turn > 0 && turn % 47 === 0) return 'shock_suez_style';
  if (turn > 0 && turn % 53 === 0) return 'shock_iron_crash';
  if (turn > 0 && turn % 61 === 0) return 'shock_lng_spike';
  return null;
}

export function applyScheduledShocks(persisted: GTELPersisted, turn: number): {
  persisted: GTELPersisted;
  newShockIds: string[];
} {
  let next = tickActiveShocks(persisted, turn);
  const newShockIds: string[] = [];
  const id = scheduledShockIdForTurn(turn);
  if (id) {
    const r = activateWorldTradeShock(next, id, turn);
    next = r.persisted;
    if (r.activated) newShockIds.push(id);
  }
  return { persisted: next, newShockIds };
}

export function deriveShockModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  domesticStress: number;
  notes: string[];
  regionIds: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  let domesticStress = 0;
  const notes: string[] = [];
  const regionSet = new Set<string>();

  persisted.activeShocks.forEach(active => {
    const def = getWorldTradeShockDefinition(active.shockId);
    if (!def) return;
    const scale = active.remainingIntensity;
    def.partnerIds.forEach(pid => {
      partnerDeltas[pid] = (partnerDeltas[pid] || 0) + def.partnerAccessDelta * scale;
    });
    Object.entries(def.commodityDeltas).forEach(([c, delta]) => {
      const commodity = c as GTELCommodityId;
      commodityDeltas[commodity] = (commodityDeltas[commodity] || 0) + gtelNum(delta, 0) * scale;
    });
    domesticStress += def.domesticStress * scale;
    def.regionIds.forEach(r => regionSet.add(r));
    notes.push(`${def.title} (${Math.round(scale * 100)}% intensity).`);
  });

  return {
    partnerDeltas,
    commodityDeltas,
    domesticStress: gtelClamp(domesticStress, 0, 0.5),
    notes,
    regionIds: [...regionSet],
  };
}

export function shockWorldEventFromDefinition(def: WorldTradeShockDefinition, turn: number): {
  id: string;
  turn: number;
  kind: 'shock';
  title: string;
  summary: string;
  regionIds: string[];
} {
  return {
    id: `gtel_shock_${def.id}_${turn}`,
    turn,
    kind: 'shock',
    title: def.title,
    summary: def.summary,
    regionIds: def.regionIds,
  };
}


// --- source: commodity-shock-scenarios.ts ---

export interface CommodityShockScenario {
  id: string;
  title: string;
  summary: string;
  /** Shock ids activated together (order preserved). */
  shockIds: string[];
  /** Minimum turn before scenario can fire via schedule. */
  minTurn: number;
  regionIds: string[];
}

export const COMMODITY_SHOCK_SCENARIOS: CommodityShockScenario[] = [
  {
    id: 'scenario_bulk_crash',
    title: 'Bulk commodity crash scenario',
    summary: 'Iron and coal indices fall together as Asia–Pacific demand falters.',
    shockIds: ['shock_iron_crash', 'shock_coal_softening'],
    minTurn: 10,
    regionIds: ['WA', 'QLD', 'NSW'],
  },
  {
    id: 'scenario_energy_volatility',
    title: 'Energy export volatility',
    summary: 'LNG spikes while trade finance tightens — mixed household and export signals.',
    shockIds: ['shock_lng_spike', 'shock_financial_contagion'],
    minTurn: 12,
    regionIds: ['WA', 'QLD', 'NSW', 'VIC'],
  },
  {
    id: 'scenario_agri_stress',
    title: 'Agricultural export stress',
    summary: 'Drought-linked wheat weakness and beef market access friction compound.',
    shockIds: ['shock_wheat_drought', 'shock_beef_access'],
    minTurn: 8,
    regionIds: ['NSW', 'VIC', 'SA', 'TAS'],
  },
  {
    id: 'scenario_western_sanctions_spiral',
    title: 'Western market sanctions spiral',
    summary: 'EU embargo plus aluminium retaliation scenario for diplomacy stress tests.',
    shockIds: ['shock_eu_embargo', 'shock_aluminium_retaliation'],
    minTurn: 15,
    regionIds: ['VIC', 'NSW', 'SA'],
  },
];

export function getCommodityShockScenario(id: string): CommodityShockScenario | null {
  return COMMODITY_SHOCK_SCENARIOS.find(s => s.id === id) || null;
}

/** Deterministic scenario schedule (no RNG). */
export function scheduledScenarioIdForTurn(turn: number): string | null {
  if (turn >= 100 && turn % 100 === 0) return 'scenario_bulk_crash';
  if (turn >= 120 && turn % 120 === 0) return 'scenario_energy_volatility';
  if (turn >= 90 && turn % 90 === 0) return 'scenario_agri_stress';
  return null;
}

export function triggerCommodityShockScenario(
  persisted: GTELPersisted,
  scenarioId: string,
  turn: number,
): { persisted: GTELPersisted; activatedShockIds: string[]; scenario: CommodityShockScenario | null } {
  const scenario = getCommodityShockScenario(scenarioId);
  if (!scenario || turn < scenario.minTurn) return { persisted, activatedShockIds: [], scenario: null };
  if ((persisted.firedShockScenarios || []).includes(scenarioId)) {
    return { persisted, activatedShockIds: [], scenario };
  }
  let next = persisted;
  const activatedShockIds: string[] = [];
  scenario.shockIds.forEach(shockId => {
    if (!getWorldTradeShockDefinition(shockId)) return;
    const r = activateWorldTradeShock(next, shockId, turn);
    next = r.persisted;
    if (r.activated) activatedShockIds.push(shockId);
  });
  next = {
    ...next,
    firedShockScenarios: [...(next.firedShockScenarios || []), scenarioId].slice(-16),
  };
  return { persisted: next, activatedShockIds, scenario };
}

export function applyScheduledScenarios(persisted: GTELPersisted, turn: number): {
  persisted: GTELPersisted;
  scenarioIds: string[];
  activatedShockIds: string[];
} {
  const id = scheduledScenarioIdForTurn(turn);
  if (!id) return { persisted, scenarioIds: [], activatedShockIds: [] };
  const r = triggerCommodityShockScenario(persisted, id, turn);
  return {
    persisted: r.persisted,
    scenarioIds: r.scenario ? [id] : [],
    activatedShockIds: r.activatedShockIds,
  };
}

/** Returns shock ids required by scenarios that are missing from the catalog. */
export function validateScenarioShockCatalog(): string[] {
  const ids = WORLD_TRADE_SHOCK_CATALOG.map(s => s.id);
  const required = ['shock_coal_softening', 'shock_wheat_drought', 'shock_beef_access', 'shock_aluminium_retaliation'];
  return required.filter(id => !ids.includes(id));
}


// --- source: sanctions.ts ---
  GTELCommodityId,
  GTELDiplomacyState,
  GTELPartnerId,
  GTELPersisted,
  PartnerSanctionRegime,
  SanctionTier,
} from './types.ts';

const TIER_RANK: Record<SanctionTier, number> = {
  none: 0,
  watchlist: 1,
  sectoral: 2,
  comprehensive: 3,
};

const TIER_PARTNER_PENALTY: Record<SanctionTier, number> = {
  none: 0,
  watchlist: -0.04,
  sectoral: -0.12,
  comprehensive: -0.22,
};

const TIER_DOMESTIC_STRESS: Record<SanctionTier, number> = {
  none: 0,
  watchlist: 0.02,
  sectoral: 0.06,
  comprehensive: 0.11,
};

/** Default commodity scopes when a partner market is sectorally sanctioned. */
export const PARTNER_SANCTION_COMMODITY_SCOPE: Partial<Record<GTELPartnerId, GTELCommodityId[]>> = {
  asia_pacific: ['iron_ore', 'coal', 'lng'],
  india_ocean: ['wheat', 'beef', 'coal'],
  north_america: ['lng', 'services', 'manufacturing'],
  europe: ['services', 'aluminium', 'manufacturing'],
  domestic_premium: [],
};

function emptyRegime(partnerId: GTELPartnerId): PartnerSanctionRegime {
  return {
    partnerId,
    tier: 'none',
    escalatedTurn: 0,
    cooldownUntilTurn: null,
    violationStreak: 0,
    complianceStreak: 0,
    scopedCommodities: [],
    reason: 'No active sanctions.',
  };
}

function escalateTier(current: SanctionTier, violations: number): SanctionTier {
  if (violations >= 4) return 'comprehensive';
  if (violations >= 2) return 'sectoral';
  if (violations >= 1) return 'watchlist';
  return current === 'none' ? 'none' : current;
}

function deescalateTier(current: SanctionTier, complianceStreak: number): SanctionTier {
  if (current === 'comprehensive' && complianceStreak >= 3) return 'sectoral';
  if (current === 'sectoral' && complianceStreak >= 2) return 'watchlist';
  if (current === 'watchlist' && complianceStreak >= 2) return 'none';
  return current;
}

export function sanitizePartnerSanctionRegime(raw: unknown, partnerId: GTELPartnerId): PartnerSanctionRegime {
  const base = emptyRegime(partnerId);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const tier = ['none', 'watchlist', 'sectoral', 'comprehensive'].includes(String(r.tier))
    ? (r.tier as SanctionTier)
    : 'none';
  return {
    partnerId,
    tier,
    escalatedTurn: Math.max(0, Math.floor(gtelNum(r.escalatedTurn, 0))),
    cooldownUntilTurn: r.cooldownUntilTurn == null ? null : Math.max(1, Math.floor(gtelNum(r.cooldownUntilTurn, 1))),
    violationStreak: Math.max(0, Math.floor(gtelNum(r.violationStreak, 0))),
    complianceStreak: Math.max(0, Math.floor(gtelNum(r.complianceStreak, 0))),
    scopedCommodities: (Array.isArray(r.scopedCommodities) ? r.scopedCommodities : [])
      .map(String)
      .filter((c): c is GTELCommodityId => (PARTNER_SANCTION_COMMODITY_SCOPE[partnerId] || []).includes(c as GTELCommodityId))
      .slice(0, 6),
    reason: String(r.reason || base.reason).slice(0, 200),
  };
}

/** Map diplomatic actors to partner markets for sanction attribution. */
function violationsByPartner(diplomacy: GTELDiplomacyState | null, turn: number): Partial<Record<GTELPartnerId, number>> {
  const out: Partial<Record<GTELPartnerId, number>> = {};
  if (!diplomacy) return out;
  const bump = (pid: GTELPartnerId, n = 1) => {
    out[pid] = (out[pid] || 0) + n;
  };
  (diplomacy.deals || []).forEach(d => {
    if (d.status !== 'violated' && d.compliance !== 'violated') return;
    d.participants.forEach(actorId => {
      const def = GTEL_PARTNER_DEFS.find(p => p.diplomaticActorIds.includes(actorId));
      if (def && def.id !== 'domestic_premium') bump(def.id);
    });
  });
  (diplomacy.events || []).forEach(ev => {
    if (turn - ev.turn > 8) return;
    if (!/violation|sanction|embargo|breach/i.test(`${ev.kind} ${ev.text || ''}`)) return;
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id === 'domestic_premium') return;
      if (new RegExp(p.id.replace('_', '[_\\s]?'), 'i').test(ev.text || '')) bump(p.id);
      else if (/embargo|sanction/i.test(ev.text || '')) bump(p.id, 0.5);
    });
  });
  return out;
}

export function advancePartnerSanctions(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
): {
  persisted: GTELPersisted;
  events: Array<{ id: string; turn: number; kind: 'sanction'; title: string; summary: string; regionIds: string[] }>;
} {
  const partnerSanctions: Partial<Record<GTELPartnerId, PartnerSanctionRegime>> = { ...persisted.partnerSanctions };
  const events: Array<{ id: string; turn: number; kind: 'sanction'; title: string; summary: string; regionIds: string[] }> =
    [];
  const violByPartner = violationsByPartner(diplomacy, turn);
  const totalViolations = gtelRecentViolations(diplomacy, turn);

  GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium').forEach(def => {
    const prev = partnerSanctions[def.id] || emptyRegime(def.id);
    let regime = { ...prev };
    if (regime.cooldownUntilTurn != null && turn < regime.cooldownUntilTurn) {
      partnerSanctions[def.id] = regime;
      return;
    }
    const partnerViol = gtelNum(violByPartner[def.id], 0);
    if (partnerViol > 0) {
      regime.violationStreak = Math.min(8, regime.violationStreak + Math.ceil(partnerViol));
      regime.complianceStreak = 0;
    } else if (totalViolations === 0) {
      regime.complianceStreak = Math.min(6, regime.complianceStreak + 1);
      regime.violationStreak = Math.max(0, regime.violationStreak - 1);
    }
    const targetTier = partnerViol > 0 ? escalateTier(regime.tier, regime.violationStreak) : deescalateTier(regime.tier, regime.complianceStreak);
    if (TIER_RANK[targetTier] > TIER_RANK[regime.tier]) {
      regime = {
        ...regime,
        tier: targetTier,
        escalatedTurn: turn,
        cooldownUntilTurn: turn + 6,
        scopedCommodities: PARTNER_SANCTION_COMMODITY_SCOPE[def.id] || [],
        reason: `Escalated to ${targetTier} after diplomatic/trade breaches involving ${def.label}.`,
      };
      events.push({
        id: `gtel_sanction_up_${def.id}_${turn}`,
        turn,
        kind: 'sanction',
        title: `${def.label}: sanctions intensify`,
        summary: regime.reason,
        regionIds: ['NSW', 'WA', 'VIC'],
      });
    } else if (TIER_RANK[targetTier] < TIER_RANK[regime.tier]) {
      regime = {
        ...regime,
        tier: targetTier,
        escalatedTurn: turn,
        reason: targetTier === 'none' ? 'Sanctions lifted after compliance window.' : `De-escalated to ${targetTier}.`,
        scopedCommodities: targetTier === 'sectoral' ? PARTNER_SANCTION_COMMODITY_SCOPE[def.id] || [] : [],
      };
      if (targetTier === 'none') regime.cooldownUntilTurn = null;
    }
    partnerSanctions[def.id] = regime;
  });

  return { persisted: { ...persisted, partnerSanctions }, events: events.slice(0, 4) };
}

export function deriveSanctionModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  domesticStress: number;
  notes: string[];
  activeTiers: Partial<Record<GTELPartnerId, SanctionTier>>;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  let domesticStress = 0;
  const notes: string[] = [];
  const activeTiers: Partial<Record<GTELPartnerId, SanctionTier>> = {};

  Object.entries(persisted.partnerSanctions || {}).forEach(([k, regime]) => {
    if (!regime || regime.tier === 'none') return;
    const partnerId = k as GTELPartnerId;
    activeTiers[partnerId] = regime.tier;
    const penalty = TIER_PARTNER_PENALTY[regime.tier];
    partnerDeltas[partnerId] = (partnerDeltas[partnerId] || 0) + penalty;
    domesticStress += TIER_DOMESTIC_STRESS[regime.tier];
    const commodityPenalty =
      regime.tier === 'comprehensive' ? -0.08 : regime.tier === 'sectoral' ? -0.05 : -0.02;
    (regime.scopedCommodities.length ? regime.scopedCommodities : PARTNER_SANCTION_COMMODITY_SCOPE[partnerId] || []).forEach(c => {
      commodityDeltas[c] = (commodityDeltas[c] || 0) + commodityPenalty;
    });
    notes.push(`${regime.tier} sanctions on ${GTEL_PARTNER_DEFS.find(p => p.id === partnerId)?.label || partnerId}.`);
  });

  return {
    partnerDeltas,
    commodityDeltas,
    domesticStress: gtelClamp(domesticStress, 0, 0.35),
    notes,
    activeTiers,
  };
}


// --- source: partner-trust.ts ---
  GTELDiplomacyState,
  GTELPartnerId,
  GTELPersisted,
  PartnerTrustScore,
  SanctionTier,
} from './types.ts';

function trustBand(score: number): PartnerTrustScore['band'] {
  if (score < 0.35) return 'critical';
  if (score < 0.55) return 'fragile';
  if (score < 0.75) return 'steady';
  return 'strong';
}

function emptyTrust(partnerId: GTELPartnerId, turn: number): PartnerTrustScore {
  const def = GTEL_PARTNER_DEFS.find(p => p.id === partnerId);
  const base = def?.baseOpenness ?? 0.7;
  return {
    partnerId,
    score: gtelClamp(base * 0.65 + 0.2, 0.25, 0.85),
    band: 'steady',
    lastUpdatedTurn: turn,
    drivers: ['Baseline partner openness.'],
  };
}

export function sanitizePartnerTrustScore(raw: unknown, partnerId: GTELPartnerId, turn: number): PartnerTrustScore {
  const base = emptyTrust(partnerId, turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const score = gtelClamp(gtelNum(r.score, base.score), 0.05, 0.99);
  return {
    partnerId,
    score,
    band: trustBand(score),
    lastUpdatedTurn: Math.max(1, Math.floor(gtelNum(r.lastUpdatedTurn, turn))),
    drivers: (Array.isArray(r.drivers) ? r.drivers : base.drivers).map(String).slice(0, 6),
  };
}

export function advancePartnerTrustScores(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
  sanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>,
): GTELPersisted {
  const partnerTrust: Partial<Record<GTELPartnerId, PartnerTrustScore>> = { ...persisted.partnerTrust };
  const violations = gtelRecentViolations(diplomacy, turn);
  const ratified = persisted.agreements.filter(a => a.status === 'ratified').length;

  GTEL_PARTNER_DEFS.forEach(def => {
    if (def.id === 'domestic_premium') return;
    const prev = partnerTrust[def.id] || emptyTrust(def.id, turn);
    let score = prev.score;
    const drivers: string[] = [];

    const tier = sanctionTiers[def.id] || 'none';
    if (tier === 'comprehensive') {
      score -= 0.08;
      drivers.push('Comprehensive sanctions erode trust.');
    } else if (tier === 'sectoral') {
      score -= 0.04;
      drivers.push('Sectoral sanctions weigh on confidence.');
    } else if (tier === 'watchlist') {
      score -= 0.02;
      drivers.push('Watchlist status adds friction.');
    }

    const partnerAgreements = persisted.agreements.filter(a => a.partnerId === def.id && a.status === 'ratified').length;
    if (partnerAgreements > 0) {
      score += 0.03 * Math.min(3, partnerAgreements);
      drivers.push(`${partnerAgreements} ratified agreement(s) support trust.`);
    }

    if (violations > 0 && def.id !== 'domestic_premium') {
      score -= 0.015 * violations;
      drivers.push('Recent diplomatic violations reduce trust.');
    }

    if (ratified >= 2) {
      score += 0.02;
      drivers.push('Broad agreement portfolio signals reliability.');
    }

    score = gtelClamp(score, 0.08, 0.96);
    partnerTrust[def.id] = {
      partnerId: def.id,
      score: Math.round(score * 1000) / 1000,
      band: trustBand(score),
      lastUpdatedTurn: turn,
      drivers: drivers.length ? drivers.slice(0, 5) : prev.drivers,
    };
  });

  return { ...persisted, partnerTrust };
}

export function deriveTrustAccessModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const notes: string[] = [];
  Object.values(persisted.partnerTrust || {}).forEach(t => {
    if (!t) return;
    const delta = gtelClamp((t.score - 0.55) * 0.12, -0.08, 0.1);
    if (Math.abs(delta) < 0.005) return;
    partnerDeltas[t.partnerId] = (partnerDeltas[t.partnerId] || 0) + delta;
    notes.push(`${GTEL_PARTNER_DEFS.find(p => p.id === t.partnerId)?.label || t.partnerId} trust ${t.band} (${Math.round(t.score * 100)}%).`);
  });
  return { partnerDeltas, notes };
}

export function summarizePartnerTrust(persisted: GTELPersisted): PartnerTrustScore[] {
  return GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium')
    .map(p => persisted.partnerTrust?.[p.id] || emptyTrust(p.id, 1))
    .sort((a, b) => b.score - a.score);
}


// --- source: trade-policy.ts ---
  GTELCommodityId,
  GTELPartnerId,
  GTELPersisted,
  TradePolicyInstrument,
  TradePolicyKind,
} from './types.ts';

export const TRADE_POLICY_CATALOG: Array<Omit<TradePolicyInstrument, 'id' | 'status' | 'activatedTurn'>> = [
  {
    kind: 'export_quota_relief',
    title: 'Export quota relief lane',
    partnerId: 'asia_pacific',
    commodity: 'iron_ore',
    expiresTurn: null,
    accessDelta: 0.06,
    commodityDelta: 0.04,
    domesticStressDelta: -0.02,
    summary: 'Temporary quota headroom for bulk exports to Asia–Pacific.',
  },
  {
    kind: 'tariff_surge',
    title: 'Defensive tariff surge',
    partnerId: 'europe',
    commodity: 'manufacturing',
    expiresTurn: null,
    accessDelta: -0.05,
    commodityDelta: -0.03,
    domesticStressDelta: 0.04,
    summary: 'Retaliatory tariff posture after partner market restrictions.',
  },
  {
    kind: 'preferential_lane',
    title: 'Preferential services lane',
    partnerId: 'north_america',
    commodity: 'services',
    expiresTurn: null,
    accessDelta: 0.05,
    commodityDelta: 0.03,
    domesticStressDelta: 0,
    summary: 'Fast-track professional services export clearance.',
  },
  {
    kind: 'diversification_push',
    title: 'Market diversification push',
    partnerId: null,
    commodity: null,
    expiresTurn: null,
    accessDelta: 0.03,
    commodityDelta: 0.01,
    domesticStressDelta: -0.01,
    summary: 'Incentives to spread export dependence across partner markets.',
  },
];

export function createTradePolicyInstrument(
  kind: TradePolicyKind,
  turn: number,
  durationTurns = 8,
  overrides: Partial<Pick<TradePolicyInstrument, 'partnerId' | 'commodity' | 'title'>> = {},
): TradePolicyInstrument | null {
  const tpl = TRADE_POLICY_CATALOG.find(p => p.kind === kind);
  if (!tpl) return null;
  return {
    id: `tp_${kind}_${turn}`,
    kind,
    title: overrides.title || tpl.title,
    partnerId: overrides.partnerId ?? tpl.partnerId,
    commodity: overrides.commodity ?? tpl.commodity,
    status: 'active',
    activatedTurn: turn,
    expiresTurn: turn + durationTurns,
    accessDelta: tpl.accessDelta,
    commodityDelta: tpl.commodityDelta,
    domesticStressDelta: tpl.domesticStressDelta,
    summary: tpl.summary,
  };
}

export function expireTradePolicies(persisted: GTELPersisted, turn: number): TradePolicyInstrument[] {
  return (persisted.tradePolicies || []).map(p => {
    if (p.status === 'active' && p.expiresTurn != null && turn > p.expiresTurn) {
      return { ...p, status: 'expired' as const };
    }
    return p;
  });
}

/** Auto-activate diversification push when multiple partners are restricted. */
export function autoTradePolicyAdjustments(persisted: GTELPersisted, turn: number): GTELPersisted {
  let policies = expireTradePolicies(persisted, turn);
  const restricted = GTEL_PARTNER_DEFS.filter(
    p => p.id !== 'domestic_premium' && (persisted.partnerAccess[p.id] === 'blocked' || persisted.partnerAccess[p.id] === 'restricted'),
  ).length;
  const hasDiversification = policies.some(p => p.kind === 'diversification_push' && p.status === 'active');
  if (restricted >= 2 && !hasDiversification) {
    const inst = createTradePolicyInstrument('diversification_push', turn, 10);
    if (inst) policies = [...policies, inst].slice(-8);
  }
  return { ...persisted, tradePolicies: policies };
}

export function deriveTradePolicyModifiers(persisted: GTELPersisted): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  commodityDeltas: Partial<Record<GTELCommodityId, number>>;
  domesticStress: number;
  notes: string[];
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const commodityDeltas: Partial<Record<GTELCommodityId, number>> = {};
  let domesticStress = 0;
  const notes: string[] = [];

  (persisted.tradePolicies || [])
    .filter(p => p.status === 'active')
    .forEach(p => {
      if (p.kind === 'diversification_push') {
        GTEL_PARTNER_DEFS.filter(x => x.id !== 'domestic_premium').forEach(x => {
          partnerDeltas[x.id] = (partnerDeltas[x.id] || 0) + p.accessDelta / 4;
        });
      } else if (p.partnerId) {
        partnerDeltas[p.partnerId] = (partnerDeltas[p.partnerId] || 0) + p.accessDelta;
      }
      if (p.commodity && GTEL_COMMODITIES.includes(p.commodity)) {
        commodityDeltas[p.commodity] = (commodityDeltas[p.commodity] || 0) + p.commodityDelta;
      }
      domesticStress += gtelNum(p.domesticStressDelta, 0);
      notes.push(`Policy active: ${p.title}.`);
    });

  return {
    partnerDeltas,
    commodityDeltas,
    domesticStress: gtelClamp(domesticStress, -0.05, 0.15),
    notes,
  };
}

export function listActiveTradePolicies(persisted: GTELPersisted): TradePolicyInstrument[] {
  return (persisted.tradePolicies || []).filter(p => p.status === 'active');
}


// --- source: trade-disputes.ts ---

export function openTradeDispute(
  persisted: GTELPersisted,
  partnerId: GTELPartnerId,
  turn: number,
  subject: string,
  requestedRelief: TradeDisputeCase['requestedRelief'] = 'sanction_step_down',
  severity = 0.5,
): { persisted: GTELPersisted; dispute: TradeDisputeCase | null } {
  if (!GTEL_PARTNER_DEFS.some(p => p.id === partnerId)) return { persisted, dispute: null };
  const open = (persisted.tradeDisputes || []).filter(d => d.status === 'open' || d.status === 'mediation');
  if (open.some(d => d.partnerId === partnerId)) return { persisted, dispute: null };
  const dispute: TradeDisputeCase = {
    id: `td_${partnerId}_${turn}`,
    partnerId,
    status: 'open',
    openedTurn: turn,
    resolvedTurn: null,
    subject: subject.slice(0, 160),
    requestedRelief,
    severity: gtelClamp(severity, 0.1, 1),
  };
  return {
    persisted: { ...persisted, tradeDisputes: [...(persisted.tradeDisputes || []), dispute].slice(-12) },
    dispute,
  };
}

export function advanceTradeDisputes(
  persisted: GTELPersisted,
  turn: number,
  sanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>,
): {
  persisted: GTELPersisted;
  events: Array<{ id: string; turn: number; kind: 'trade'; title: string; summary: string; regionIds: string[] }>;
} {
  const events: Array<{ id: string; turn: number; kind: 'trade'; title: string; summary: string; regionIds: string[] }> = [];
  const tradeDisputes = (persisted.tradeDisputes || []).map(d => {
    if (d.status !== 'open' && d.status !== 'mediation') return d;
    const age = turn - d.openedTurn;
    const tier = sanctionTiers[d.partnerId] || 'none';
    let status: TradeDisputeStatus = d.status;
    if (age >= 2 && tier !== 'none') status = 'mediation';
    if (age >= 6 && tier === 'comprehensive') status = 'escalated';
    if (age >= 5 && tier === 'none') status = 'resolved';
    if (status === 'resolved' && d.status !== 'resolved') {
      events.push({
        id: `gtel_dispute_res_${d.id}`,
        turn,
        kind: 'trade',
        title: 'Trade dispute closed',
        summary: `${d.subject} — partners returned to normal compliance window.`,
        regionIds: ['NSW', 'VIC'],
      });
    }
    if (status === 'escalated' && d.status !== 'escalated') {
      events.push({
        id: `gtel_dispute_esc_${d.id}`,
        turn,
        kind: 'trade',
        title: 'Trade dispute escalated',
        summary: `${d.subject} — mediation failed; market access remains constrained.`,
        regionIds: ['WA', 'QLD', 'NSW'],
      });
    }
    return {
      ...d,
      status,
      resolvedTurn: status === 'resolved' ? turn : d.resolvedTurn,
    };
  });

  let next = { ...persisted, tradeDisputes };
  tradeDisputes.forEach(d => {
    if (d.status !== 'resolved' || d.resolvedTurn !== turn) return;
    if (d.requestedRelief !== 'sanction_step_down') return;
    const regime = next.partnerSanctions?.[d.partnerId];
    if (!regime || regime.tier === 'none') return;
    const down: SanctionTier =
      regime.tier === 'comprehensive' ? 'sectoral' : regime.tier === 'sectoral' ? 'watchlist' : 'none';
    next = {
      ...next,
      partnerSanctions: {
        ...next.partnerSanctions,
        [d.partnerId]: {
          ...regime,
          tier: down,
          reason: `Dispute ${d.id} resolution stepped sanctions down to ${down}.`,
          complianceStreak: regime.complianceStreak + 1,
        },
      },
    };
  });

  return { persisted: next, events: events.slice(0, 4) };
}

export function countOpenTradeDisputes(persisted: GTELPersisted): number {
  return (persisted.tradeDisputes || []).filter(d => d.status === 'open' || d.status === 'mediation').length;
}

export function autoOpenDisputesFromSanctions(
  persisted: GTELPersisted,
  turn: number,
  sanctionTiers: Partial<Record<GTELPartnerId, SanctionTier>>,
): GTELPersisted {
  let next = persisted;
  Object.entries(sanctionTiers).forEach(([pid, tier]) => {
    if (tier !== 'sectoral' && tier !== 'comprehensive') return;
    const partnerId = pid as GTELPartnerId;
    const r = openTradeDispute(
      next,
      partnerId,
      turn,
      `Automatic dispute: ${tier} sanctions on ${GTEL_PARTNER_DEFS.find(p => p.id === partnerId)?.label || partnerId}`,
      'sanction_step_down',
      tier === 'comprehensive' ? 0.85 : 0.55,
    );
    next = r.persisted;
  });
  return next;
}


// --- source: trade-compliance.ts ---

export const TRADE_COMPLIANCE_RULES = [
  { id: 'rule_honor_agreements', label: 'Honor ratified trade agreements', weight: 0.25 },
  { id: 'rule_avoid_embargo_breach', label: 'Avoid embargo and breach events', weight: 0.3 },
  { id: 'rule_dispute_engagement', label: 'Engage dispute mediation in good faith', weight: 0.2 },
  { id: 'rule_transparent_tariffs', label: 'Keep tariff/sanction changes documented', weight: 0.25 },
] as const;

export function createEmptyTradeComplianceRecord(turn = 1): TradeComplianceRecord {
  return {
    score: 0.72,
    band: 'adequate',
    lastReviewTurn: turn,
    violationsWindow: 0,
    openDisputes: 0,
    findings: ['Baseline compliance posture.'],
  };
}

export function sanitizeTradeComplianceRecord(raw: unknown, turn = 1): TradeComplianceRecord {
  const base = createEmptyTradeComplianceRecord(turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const score = gtelClamp(gtelNum(r.score, base.score), 0.1, 0.99);
  const band: TradeComplianceRecord['band'] =
    score >= 0.8 ? 'strong' : score >= 0.6 ? 'adequate' : score >= 0.4 ? 'weak' : 'critical';
  return {
    score: Math.round(score * 1000) / 1000,
    band,
    lastReviewTurn: Math.max(1, Math.floor(gtelNum(r.lastReviewTurn, turn))),
    violationsWindow: Math.max(0, Math.floor(gtelNum(r.violationsWindow, 0))),
    openDisputes: Math.max(0, Math.floor(gtelNum(r.openDisputes, 0))),
    findings: (Array.isArray(r.findings) ? r.findings : base.findings).map(String).slice(0, 8),
  };
}

export function advanceTradeComplianceRecord(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
): GTELPersisted {
  const prev = sanitizeTradeComplianceRecord(persisted.tradeCompliance, turn);
  const violations = gtelRecentViolations(diplomacy, turn);
  const openDisputes = countOpenTradeDisputes(persisted);
  const ratified = persisted.agreements.filter(a => a.status === 'ratified').length;
  let score = prev.score;
  const findings: string[] = [];
  if (violations === 0) {
    score += 0.015;
    findings.push('No diplomatic violations in the review window.');
  } else {
    score -= 0.035 * violations;
    findings.push(`${violations} violation signal(s) recorded.`);
  }
  if (openDisputes === 0) {
    score += 0.01;
  } else {
    score -= 0.02 * openDisputes;
    findings.push(`${openDisputes} open trade dispute(s) require engagement.`);
  }
  if (ratified >= 2) {
    score += 0.02;
    findings.push('Multiple ratified agreements support compliance.');
  }
  const comprehensive = Object.values(persisted.partnerSanctions || {}).filter(s => s?.tier === 'comprehensive').length;
  if (comprehensive > 0) {
    score -= 0.04 * comprehensive;
    findings.push('Comprehensive partner sanctions weigh on compliance score.');
  }
  score = gtelClamp(score, 0.12, 0.98);
  const band: TradeComplianceRecord['band'] =
    score >= 0.8 ? 'strong' : score >= 0.6 ? 'adequate' : score >= 0.4 ? 'weak' : 'critical';
  return {
    ...persisted,
    tradeCompliance: {
      score: Math.round(score * 1000) / 1000,
      band,
      lastReviewTurn: turn,
      violationsWindow: violations,
      openDisputes,
      findings: findings.slice(0, 6),
    },
  };
}

/** Weak compliance accelerates external market friction. */
export function deriveCompliancePartnerPenalty(record: TradeComplianceRecord | null | undefined): number {
  if (!record) return 0;
  if (record.band === 'critical') return -0.035;
  if (record.band === 'weak') return -0.018;
  return 0;
}

export function complianceReviewNotes(record: TradeComplianceRecord | null | undefined): string[] {
  if (!record) return [];
  return [`Compliance ${record.band} (${Math.round(record.score * 100)}%).`, ...record.findings.slice(0, 2)];
}


// --- source: export-logistics.ts ---
  GTELCommodityId,
  GTELCommodityQuote,
  GTELLogisticsStress,
  GTELNationalSystemsSlice,
  GTELPartnerMarket,
} from './types.ts';

const BULK: GTELCommodityId[] = ['iron_ore', 'coal', 'lng', 'wheat', 'beef', 'aluminium'];

export function computeLogisticsStress(params: {
  nationalSystems: GTELNationalSystemsSlice | null;
  partners: GTELPartnerMarket[];
  exportThroughput: number;
  openDisputeCount: number;
}): GTELLogisticsStress {
  const condition = String(params.nationalSystems?.national?.trade?.condition || 'healthy');
  const rank: Record<string, number> = {
    surplus: 0.12,
    healthy: 0.05,
    strained: -0.08,
    bottlenecked: -0.16,
    critical: -0.28,
  };
  const networkStrain = rank[condition] ?? 0;
  const restrictedRoutes = params.partners.filter(p => p.id !== 'domestic_premium' && GTEL_ACCESS_RANK[p.access] <= 1).length;
  const redundancyScore = gtelClamp(1 - restrictedRoutes * 0.18 - params.openDisputeCount * 0.04, 0.15, 1);
  const throughputRatio = gtelClamp(params.exportThroughput / 120, 0, 1.4);
  const freightPressure = gtelClamp(0.45 - redundancyScore * 0.35 + (throughputRatio > 1 ? 0.08 : 0) - networkStrain, 0, 1);
  const effectiveThroughput = Math.round(params.exportThroughput * (0.75 + redundancyScore * 0.25 + networkStrain) * 10) / 10;
  let band: GTELLogisticsStress['band'] = 'fluid';
  if (freightPressure > 0.72) band = 'congested';
  else if (freightPressure > 0.48) band = 'tight';
  else if (freightPressure > 0.28) band = 'watch';
  const summary =
    band === 'congested'
      ? 'Port and corridor congestion is capping export conversion.'
      : band === 'tight'
        ? 'Freight lanes are tight — schedule risk is elevated.'
        : band === 'watch'
          ? 'Logistics are manageable but redundancy is thin.'
          : 'Export logistics have adequate redundancy.';
  return {
    band,
    freightPressure: Math.round(freightPressure * 1000) / 1000,
    redundancyScore: Math.round(redundancyScore * 1000) / 1000,
    effectiveExportThroughput: effectiveThroughput,
    networkStrain: Math.round(networkStrain * 1000) / 1000,
    summary,
  };
}

export function deriveLogisticsCommodityModifiers(logistics: GTELLogisticsStress): Partial<Record<GTELCommodityId, number>> {
  const penalty = gtelClamp(logistics.freightPressure * 0.12, 0, 0.1);
  const out: Partial<Record<GTELCommodityId, number>> = {};
  BULK.forEach(c => {
    out[c] = -penalty * (c === 'services' ? 0.3 : 1);
  });
  out.services = -penalty * 0.35;
  out.manufacturing = -penalty * 0.55;
  return out;
}

export function applyLogisticsToCommodityQuotes(
  commodities: GTELCommodityQuote[],
  logistics: GTELLogisticsStress,
): GTELCommodityQuote[] {
  const mods = deriveLogisticsCommodityModifiers(logistics);
  return commodities.map(c => {
    const logisticsMod = gtelNum(mods[c.commodity], 0);
    if (!logisticsMod) return c;
    const effectiveIndex = Math.round(c.effectiveIndex * (1 + logisticsMod) * 10) / 10;
    return {
      ...c,
      effectiveIndex,
      evidence: [...c.evidence, `Logistics ${logistics.band}: ${logistics.summary}`],
    };
  });
}

export function logisticsWorldEvent(logistics: GTELLogisticsStress, turn: number): {
  id: string;
  turn: number;
  kind: 'trade';
  title: string;
  summary: string;
  regionIds: string[];
} | null {
  if (logistics.band !== 'congested' && logistics.band !== 'tight') return null;
  return {
    id: `gtel_logistics_${logistics.band}_${turn}`,
    turn,
    kind: 'trade',
    title: logistics.band === 'congested' ? 'Export corridor congestion' : 'Freight lane tightness',
    summary: logistics.summary,
    regionIds: ['NSW', 'VIC', 'QLD', 'WA'],
  };
}


// --- source: trade-balance.ts ---
  GTELCommodityQuote,
  GTELLogisticsStress,
  GTELPartnerMarket,
  GTELTradeBalanceSnapshot,
} from './types.ts';

export function computeTradeBalanceSnapshot(params: {
  commodities: GTELCommodityQuote[];
  partners: GTELPartnerMarket[];
  logistics: GTELLogisticsStress;
  exportThroughput: number;
}): GTELTradeBalanceSnapshot {
  const exportWeighted = params.commodities.reduce((acc, c) => {
    const w = gtelNum(GTEL_BASE_COMMODITY_INDEX[c.commodity], 90) / 100;
    return acc + (c.effectiveIndex - c.baseIndex) * w;
  }, 0);
  const exportValueIndex = Math.round((100 + exportWeighted * 0.85) * 10) / 10;
  const externalPartners = params.partners.filter(p => p.id !== 'domestic_premium');
  const accessAvg =
    externalPartners.reduce((a, p) => a + GTEL_ACCESS_RANK[p.access] / 4, 0) / Math.max(1, externalPartners.length);
  const importPressureIndex = Math.round((100 + (0.55 - accessAvg) * 40 + params.logistics.freightPressure * 18) * 10) / 10;
  const netExportPulse = Math.round((exportValueIndex - importPressureIndex) * 10) / 10;
  let currentAccountTone: GTELTradeBalanceSnapshot['currentAccountTone'] = 'balanced';
  if (netExportPulse > 8) currentAccountTone = 'surplus';
  else if (netExportPulse > 3) currentAccountTone = 'mild_surplus';
  else if (netExportPulse < -8) currentAccountTone = 'deficit';
  else if (netExportPulse < -3) currentAccountTone = 'mild_deficit';
  const narrative =
    currentAccountTone === 'surplus'
      ? 'Export values are outpacing import-linked price pressure.'
      : currentAccountTone === 'deficit'
        ? 'Import pressure and logistics costs dominate export receipts.'
        : 'External trade flows are broadly balanced this turn.';
  return {
    exportValueIndex,
    importPressureIndex,
    netExportPulse,
    currentAccountTone,
    effectiveThroughput: params.logistics.effectiveExportThroughput,
    narrative,
  };
}

export function tradeBalanceGiNotes(balance: GTELTradeBalanceSnapshot | null | undefined): string[] {
  if (!balance) return [];
  return [`Trade balance: ${balance.currentAccountTone.replace(/_/g, ' ')} (net pulse ${balance.netExportPulse}).`, balance.narrative];
}


// --- source: import-dependency.ts ---
  GTELCommodityId,
  GTELCommodityQuote,
  GTELImportDependencyLine,
  GTELImportDependencySnapshot,
  GTELImportRiskBand,
  GTELPartnerId,
  GTELPartnerMarket,
  GTELPersisted,
} from './types.ts';

/** Commodities where Australia is structurally import-exposed (inputs / manufactured goods). */
export const GTEL_IMPORT_EXPOSURE_WEIGHT: Partial<Record<GTELCommodityId, number>> = {
  manufacturing: 0.92,
  services: 0.35,
  aluminium: 0.28,
  coal: 0.12,
  lng: 0.18,
  iron_ore: 0.08,
  wheat: 0.15,
  beef: 0.1,
};

function riskBandFromScore(score: number): GTELImportRiskBand {
  if (score >= 0.72) return 'critical';
  if (score >= 0.52) return 'elevated';
  if (score >= 0.32) return 'moderate';
  return 'low';
}

export function createEmptyImportDependencySnapshot(): GTELImportDependencySnapshot {
  return {
    aggregateRisk: 0.25,
    band: 'moderate',
    lines: [],
    summary: 'Import exposure baseline.',
  };
}

export function sanitizeImportDependencySmoothing(raw: unknown): Partial<Record<GTELCommodityId, number>> {
  const out: Partial<Record<GTELCommodityId, number>> = {};
  if (!raw || typeof raw !== 'object') return out;
  GTEL_COMMODITIES.forEach(c => {
    const v = gtelNum((raw as Record<string, number>)[c], 0.25);
    out[c] = gtelClamp(v, 0.05, 0.95);
  });
  return out;
}

function partnerImportStress(partners: GTELPartnerMarket[]): Partial<Record<GTELPartnerId, number>> {
  const stress: Partial<Record<GTELPartnerId, number>> = {};
  partners.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const accessStress = 1 - GTEL_ACCESS_RANK[p.access] / 4;
    stress[p.id] = gtelClamp(accessStress * 0.85 + (1 - p.accessScore) * 0.35, 0, 1);
  });
  return stress;
}

export function computeImportDependencySnapshot(input: {
  partners: GTELPartnerMarket[];
  commodities: GTELCommodityQuote[];
  persisted: GTELPersisted;
}): { snapshot: GTELImportDependencySnapshot; persisted: GTELPersisted } {
  const partnerStress = partnerImportStress(input.partners);
  const smoothing = sanitizeImportDependencySmoothing(input.persisted.importDependencySmoothing);
  const lines: GTELImportDependencyLine[] = [];

  GTEL_COMMODITIES.forEach(commodity => {
    const baseExposure = gtelNum(GTEL_IMPORT_EXPOSURE_WEIGHT[commodity], 0.2);
    let weightedPartnerStress = 0;
    let weightSum = 0;
    let dominantPartnerId: GTELPartnerId | null = null;
    let dominantStress = -1;

    input.partners.forEach(p => {
      if (p.id === 'domestic_premium') return;
      const w = gtelNum(p.demandWeights[commodity], 0.45) * p.priceSensitivity;
      const stress = gtelNum(partnerStress[p.id], 0.3);
      weightedPartnerStress += stress * w;
      weightSum += w;
      if (stress > dominantStress) {
        dominantStress = stress;
        dominantPartnerId = p.id;
      }
    });

    const partnerComponent = weightSum > 0 ? weightedPartnerStress / weightSum : 0.35;
    const blockedPartners = input.partners.filter(
      p => p.id !== 'domestic_premium' && (p.access === 'blocked' || p.access === 'restricted'),
    ).length;
    const accessPenalty = gtelClamp(blockedPartners * 0.06, 0, 0.18);
    const quote = input.commodities.find(c => c.commodity === commodity);
    const priceStress = quote ? gtelClamp((quote.effectiveIndex - 100) / 90, -0.15, 0.35) : 0;
    const rawExposure = gtelClamp(
      baseExposure * 0.55 + partnerComponent * 0.35 + Math.max(0, priceStress) * 0.25 + accessPenalty,
      0.08,
      0.95,
    );
    const prev = gtelNum(smoothing[commodity], rawExposure);
    const importExposure = gtelClamp(prev * 0.65 + rawExposure * 0.35, 0.08, 0.95);
    smoothing[commodity] = Math.round(importExposure * 1000) / 1000;

    const band = riskBandFromScore(importExposure);
    const partnerLabel = dominantPartnerId
      ? GTEL_PARTNER_DEFS.find(p => p.id === dominantPartnerId)?.label || dominantPartnerId
      : 'external partners';
    const narrative =
      band === 'critical'
        ? `${GTEL_COMMODITY_LABEL[commodity]} import channels are fragile via ${partnerLabel}.`
        : band === 'elevated'
          ? `${GTEL_COMMODITY_LABEL[commodity]} faces elevated import reliance on ${partnerLabel}.`
          : `${GTEL_COMMODITY_LABEL[commodity]} import exposure is ${band}.`;

    lines.push({ commodity, importExposure, band, dominantPartnerId, narrative });
  });

  const aggregateRisk =
    lines.reduce((acc, l) => acc + l.importExposure, 0) / Math.max(1, lines.length);
  const band = riskBandFromScore(aggregateRisk);
  const hot = lines.filter(l => l.band === 'critical' || l.band === 'elevated').slice(0, 2);
  const summary =
    hot.length === 0
      ? 'Import dependency is manageable across major commodity lanes.'
      : `Import vulnerability concentrates on ${hot.map(h => GTEL_COMMODITY_LABEL[h.commodity]).join(' and ')}.`;

  return {
    snapshot: {
      aggregateRisk: Math.round(aggregateRisk * 1000) / 1000,
      band,
      lines,
      summary,
    },
    persisted: { ...input.persisted, importDependencySmoothing: smoothing },
  };
}

export function importDependencyConsumerPressure(snapshot: GTELImportDependencySnapshot): number {
  const base = gtelClamp(snapshot.aggregateRisk * 0.22, 0, 0.18);
  const criticalLines = snapshot.lines.filter(l => l.band === 'critical').length;
  return gtelClamp(base + criticalLines * 0.025, 0, 0.28);
}

export function importDependencyGiNotes(snapshot: GTELImportDependencySnapshot | null | undefined): string[] {
  if (!snapshot) return [];
  const lines = [snapshot.summary];
  if (snapshot.band === 'elevated' || snapshot.band === 'critical') {
    lines.push(`Import risk band: ${snapshot.band} (aggregate ${Math.round(snapshot.aggregateRisk * 100)}%).`);
  }
  return lines;
}


// --- source: diplomatic-engagement.ts ---
  DiplomaticEngagementTrack,
  GTELDiplomacyState,
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';

export type EngagementBand = DiplomaticEngagementTrack['band'];

function engagementBand(momentum: number): EngagementBand {
  if (momentum >= 0.78) return 'breakthrough';
  if (momentum >= 0.55) return 'active';
  if (momentum >= 0.32) return 'cautious';
  return 'stalled';
}

function sanitizeTrack(raw: unknown, partnerId: GTELPartnerId, turn: number): DiplomaticEngagementTrack {
  const base: DiplomaticEngagementTrack = {
    partnerId,
    momentum: 0.45,
    band: 'cautious',
    lastEventTurn: turn,
    highlights: [],
  };
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const momentum = gtelClamp(gtelNum(r.momentum, base.momentum), 0.08, 0.98);
  return {
    partnerId,
    momentum: Math.round(momentum * 1000) / 1000,
    band: engagementBand(momentum),
    lastEventTurn: Math.max(1, Math.floor(gtelNum(r.lastEventTurn, turn))),
    highlights: (Array.isArray(r.highlights) ? r.highlights : []).map(String).slice(0, 4),
  };
}

export function advanceDiplomaticEngagement(
  persisted: GTELPersisted,
  diplomacy: GTELDiplomacyState | null,
  turn: number,
): { persisted: GTELPersisted; state: GTELDiplomaticEngagementState; events: GTELTurnResult['worldEvents'] } {
  const events: GTELTurnResult['worldEvents'] = [];
  const tracks: Partial<Record<GTELPartnerId, DiplomaticEngagementTrack>> = {};
  const violations = gtelRecentViolations(diplomacy, turn);
  const openDisputes = countOpenTradeDisputes(persisted);
  const activeDeals = gtelActiveDeals(diplomacy);
  const prevMemory = persisted.diplomaticEngagement || {};

  GTEL_PARTNER_DEFS.forEach(def => {
    if (def.id === 'domestic_premium') return;
    const prev = sanitizeTrack(prevMemory[def.id], def.id, turn);
    let momentum = prev.momentum;
    const highlights: string[] = [];

    const partnerDeals = activeDeals.filter(d =>
      d.participants.some(pid => def.diplomaticActorIds.includes(pid)),
    );
    if (partnerDeals.length > 0) {
      momentum += 0.04 * Math.min(3, partnerDeals.length);
      highlights.push(`${partnerDeals.length} active trade-linked deal(s) with ${def.label}.`);
    }

    const ratified = persisted.agreements.filter(a => a.status === 'ratified' && a.partnerId === def.id).length;
    if (ratified > 0) {
      momentum += 0.03 * ratified;
      highlights.push('Ratified agreement supports engagement.');
    }

    const sanction = persisted.partnerSanctions?.[def.id];
    if (sanction && sanction.tier !== 'none') {
      momentum -= sanction.tier === 'comprehensive' ? 0.12 : sanction.tier === 'sectoral' ? 0.07 : 0.04;
      highlights.push(`${sanction.tier} sanctions dampen engagement.`);
    }

    const partnerDisputes = (persisted.tradeDisputes || []).filter(
      d => d.partnerId === def.id && (d.status === 'open' || d.status === 'mediation'),
    );
    if (partnerDisputes.length > 0) {
      momentum -= 0.05 * partnerDisputes.length;
      highlights.push(`${partnerDisputes.length} open dispute(s) need mediation.`);
    }

    if (violations > 0) momentum -= 0.025 * violations;

    momentum = gtelClamp(momentum * 0.92 + 0.04, 0.1, 0.95);
    const band = engagementBand(momentum);
    const track: DiplomaticEngagementTrack = {
      partnerId: def.id,
      momentum: Math.round(momentum * 1000) / 1000,
      band,
      lastEventTurn: turn,
      highlights: highlights.slice(0, 3),
    };
    tracks[def.id] = track;

    if (band === 'breakthrough' && prev.band !== 'breakthrough') {
      events.push({
        id: `gtel_engagement_breakthrough_${def.id}_${turn}`,
        turn,
        kind: 'diplomacy',
        title: `Engagement breakthrough — ${def.label}`,
        summary: `Diplomatic momentum with ${def.label} opens room for dispute de-escalation and market confidence.`,
        regionIds: ['ACT', 'NSW'],
      });
    }
  });

  const momentumValues = Object.values(tracks).map(t => t?.momentum || 0);
  const summitPulse =
    momentumValues.length > 0 ? momentumValues.reduce((a, b) => a + b, 0) / momentumValues.length : 0.4;
  const stalled = Object.values(tracks).filter(t => t?.band === 'stalled').length;
  const summary =
    stalled >= 3
      ? 'Multiple partner engagement tracks are stalled; trade diplomacy needs active outreach.'
      : summitPulse >= 0.62
        ? 'Cross-partner engagement pulse is constructive for trade normalization.'
        : 'Engagement is mixed — selective partner outreach recommended.';

  if (openDisputes >= 2 && summitPulse < 0.45 && turn % 5 === 0) {
    events.push({
      id: `gtel_engagement_summit_${turn}`,
      turn,
      kind: 'diplomacy',
      title: 'Trade diplomacy summit window',
      summary: 'Low engagement momentum coincides with open disputes — a coordinated outreach push could unlock mediation.',
      regionIds: ['ACT'],
    });
  }

  const memory: GTELPersisted['diplomaticEngagement'] = {};
  Object.entries(tracks).forEach(([k, v]) => {
    if (!v) return;
    memory[k as GTELPartnerId] = { momentum: v.momentum, lastEventTurn: v.lastEventTurn, highlights: v.highlights };
  });

  return {
    persisted: { ...persisted, diplomaticEngagement: memory },
    state: { tracks, summitPulse: Math.round(summitPulse * 1000) / 1000, summary },
    events,
  };
}

export function deriveEngagementPartnerModifiers(
  engagement: GTELDiplomaticEngagementState | null | undefined,
): { partnerDeltas: Partial<Record<GTELPartnerId, number>>; notes: string[] } {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  const notes: string[] = [];
  if (!engagement?.tracks) return { partnerDeltas, notes };

  Object.values(engagement.tracks).forEach(track => {
    if (!track) return;
    if (track.band === 'breakthrough') partnerDeltas[track.partnerId] = (partnerDeltas[track.partnerId] || 0) + 0.05;
    else if (track.band === 'active') partnerDeltas[track.partnerId] = (partnerDeltas[track.partnerId] || 0) + 0.025;
    else if (track.band === 'stalled') partnerDeltas[track.partnerId] = (partnerDeltas[track.partnerId] || 0) - 0.04;
  });

  if (engagement.summitPulse >= 0.65) notes.push('Strong engagement pulse supports partner access normalization.');
  else if (engagement.summitPulse < 0.38) notes.push('Stalled engagement tracks are weighing on trade diplomacy.');

  return { partnerDeltas, notes };
}

export function engagementTrustRecoveryBonus(engagement: GTELDiplomaticEngagementState | null | undefined): number {
  if (!engagement) return 0;
  return gtelClamp((engagement.summitPulse - 0.45) * 0.08, -0.02, 0.04);
}

export function diplomaticEngagementGiNotes(engagement: GTELDiplomaticEngagementState | null | undefined): string[] {
  if (!engagement) return [];
  const lines = [engagement.summary];
  const active = Object.values(engagement.tracks || {}).filter(t => t?.band === 'active' || t?.band === 'breakthrough');
  if (active.length >= 2) {
    lines.push(`Active engagement: ${active.map(t => GTEL_PARTNER_DEFS.find(p => p.id === t!.partnerId)?.label || t!.partnerId).join(', ')}.`);
  }
  return lines;
}


// --- source: trade-finance.ts ---
  GTELLogisticsStress,
  GTELPersisted,
  GTELTradeBalanceSnapshot,
  GTELTradeComplianceRecord,
  GTELTradeFinanceSnapshot,
} from './types.ts';

export type GTELTradeFinanceBand = GTELTradeFinanceSnapshot['band'];

function financeBand(score: number): GTELTradeFinanceBand {
  if (score >= 0.72) return 'fluid';
  if (score >= 0.52) return 'watch';
  if (score >= 0.32) return 'tight';
  return 'frozen';
}

export function sanitizeTradeFinanceSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.62), 0.12, 0.98);
}

export function createEmptyTradeFinanceSnapshot(): GTELTradeFinanceSnapshot {
  return {
    availabilityScore: 0.62,
    band: 'watch',
    financingPremium: 0.08,
    exportCreditCeiling: 100,
    summary: 'Export credit markets at baseline watch.',
  };
}

export function advanceTradeFinanceSmoothing(
  persisted: GTELPersisted,
  rawAvailability: number,
): GTELPersisted {
  const prev = sanitizeTradeFinanceSmoothing(persisted.tradeFinanceSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawAvailability, 0.08, 0.98) * 0.28, 0.12, 0.98);
  return {
    ...persisted,
    tradeFinanceSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeTradeFinanceSnapshot(input: {
  logistics: GTELLogisticsStress;
  tradeBalance: GTELTradeBalanceSnapshot;
  tradeCompliance: GTELTradeComplianceRecord;
  openDisputeCount: number;
  activeSanctionCount: number;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeFinanceSnapshot; persisted: GTELPersisted } {
  const logisticsPenalty =
    input.logistics.band === 'congested'
      ? 0.22
      : input.logistics.band === 'tight'
        ? 0.14
        : input.logistics.band === 'watch'
          ? 0.06
          : 0;
  const compliancePenalty =
    input.tradeCompliance.band === 'critical'
      ? 0.18
      : input.tradeCompliance.band === 'weak'
        ? 0.1
        : input.tradeCompliance.band === 'adequate'
          ? 0.04
          : 0;
  const disputePenalty = gtelClamp(input.openDisputeCount * 0.05, 0, 0.2);
  const sanctionPenalty = gtelClamp(input.activeSanctionCount * 0.06, 0, 0.24);
  const balanceLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.08
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.1
        : 0;

  const rawAvailability = gtelClamp(
    0.68 - logisticsPenalty - compliancePenalty - disputePenalty - sanctionPenalty + balanceLift,
    0.1,
    0.95,
  );
  const persisted = advanceTradeFinanceSmoothing(input.persisted, rawAvailability);
  const availabilityScore = sanitizeTradeFinanceSmoothing(persisted.tradeFinanceSmoothing);
  const band = financeBand(availabilityScore);
  const financingPremium = gtelClamp(1 - availabilityScore + logisticsPenalty * 0.35, 0.04, 0.55);
  const exportCreditCeiling = Math.round((85 + availabilityScore * 35 - financingPremium * 12) * 10) / 10;

  const summary =
    band === 'fluid'
      ? 'Trade finance desks are open; export credit lines roll without friction.'
      : band === 'frozen'
        ? 'Export credit is largely frozen — insurers and banks are pulling exposure.'
        : band === 'tight'
          ? 'Letters of credit and export insurance carry tighter covenants.'
          : 'Export finance remains available but under heightened review.';

  return {
    snapshot: {
      availabilityScore: Math.round(availabilityScore * 1000) / 1000,
      band,
      financingPremium: Math.round(financingPremium * 1000) / 1000,
      exportCreditCeiling,
      summary,
    },
    persisted,
  };
}

/** Scale applied to effective export throughput after logistics. */
export function tradeFinanceExportScale(snapshot: GTELTradeFinanceSnapshot | null | undefined): number {
  if (!snapshot) return 1;
  return gtelClamp(0.78 + snapshot.availabilityScore * 0.28, 0.72, 1.08);
}

export function tradeFinanceDomesticStress(snapshot: GTELTradeFinanceSnapshot | null | undefined): number {
  if (!snapshot) return 0;
  return gtelClamp(snapshot.financingPremium * 0.22, 0, 0.12);
}

export function tradeFinanceGiNotes(finance: GTELTradeFinanceSnapshot | null | undefined): string[] {
  if (!finance) return [];
  return [
    `Export finance: ${finance.band.replace(/_/g, ' ')} (availability ${Math.round(finance.availabilityScore * 100)}%).`,
    finance.summary,
  ];
}


// --- source: market-diversification.ts ---
  GTELMarketDiversificationSnapshot,
  GTELPartnerId,
  GTELPartnerMarket,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';

export type GTELDiversificationBand = GTELMarketDiversificationSnapshot['band'];

function diversificationBand(concentrationIndex: number): GTELDiversificationBand {
  if (concentrationIndex >= 0.78) return 'critical';
  if (concentrationIndex >= 0.58) return 'concentrated';
  if (concentrationIndex >= 0.38) return 'moderate';
  return 'well_spread';
}

export function sanitizePartnerMixSmoothing(raw: unknown): Partial<Record<GTELPartnerId, number>> {
  const out: Partial<Record<GTELPartnerId, number>> = {};
  if (!raw || typeof raw !== 'object') return out;
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const v = gtelNum((raw as Record<string, number>)[p.id], 0.2);
    out[p.id] = gtelClamp(v, 0.02, 0.85);
  });
  return out;
}

export function advancePartnerMixMemory(
  partners: GTELPartnerMarket[],
  persisted: GTELPersisted,
): GTELPersisted {
  const prev = sanitizePartnerMixSmoothing(persisted.partnerMixSmoothing);
  const external = partners.filter(p => p.id !== 'domestic_premium');
  const weightSum = external.reduce((a, p) => a + GTEL_ACCESS_RANK[p.access] * p.accessScore, 0) || 1;
  const next: Partial<Record<GTELPartnerId, number>> = { ...prev };
  external.forEach(p => {
    const share = (GTEL_ACCESS_RANK[p.access] * p.accessScore) / weightSum;
    const smoothed = gtelClamp(gtelNum(prev[p.id], share) * 0.75 + share * 0.25, 0.02, 0.85);
    next[p.id] = Math.round(smoothed * 1000) / 1000;
  });
  return { ...persisted, partnerMixSmoothing: next };
}

function effectivePartnerCount(mix: Partial<Record<GTELPartnerId, number>>): number {
  const shares = GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium').map(p => gtelNum(mix[p.id], 0.2));
  const sumSq = shares.reduce((a, s) => a + s * s, 0);
  return sumSq > 0 ? Math.round((1 / sumSq) * 10) / 10 : 4;
}

export function computeMarketDiversificationSnapshot(input: {
  partners: GTELPartnerMarket[];
  persisted: GTELPersisted;
}): GTELMarketDiversificationSnapshot {
  const mix = sanitizePartnerMixSmoothing(input.persisted.partnerMixSmoothing);
  let dominantPartnerId: GTELPartnerId | null = null;
  let dominantShare = 0;
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const share = gtelNum(mix[p.id], 0.2);
    if (share > dominantShare) {
      dominantShare = share;
      dominantPartnerId = p.id;
    }
  });

  const hhi = GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium').reduce(
    (acc, p) => acc + gtelNum(mix[p.id], 0.2) ** 2,
    0,
  );
  const concentrationIndex = gtelClamp(hhi * 1.35 + (dominantShare > 0.45 ? (dominantShare - 0.45) * 0.6 : 0), 0.08, 0.95);
  const band = diversificationBand(concentrationIndex);
  const blockedDominant =
    dominantPartnerId &&
    input.partners.find(p => p.id === dominantPartnerId && (p.access === 'blocked' || p.access === 'restricted'));
  const summary =
    band === 'well_spread'
      ? 'Export demand is spread across multiple partner basins.'
      : band === 'critical' || blockedDominant
        ? `Partner concentration is acute${dominantPartnerId ? ` (${dominantPartnerId.replace(/_/g, ' ')})` : ''}; diversification risk is elevated.`
        : 'Export receipts lean on a narrow set of partner lanes.';

  return {
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    band,
    dominantPartnerId,
    effectivePartnerCount: effectivePartnerCount(mix),
    summary,
  };
}

export function deriveDiversificationPartnerModifiers(snapshot: GTELMarketDiversificationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'well_spread') {
    return { partnerDeltas, domesticStress: 0 };
  }
  const penalty = snapshot.band === 'critical' ? -0.06 : snapshot.band === 'concentrated' ? -0.035 : -0.015;
  if (snapshot.dominantPartnerId) {
    partnerDeltas[snapshot.dominantPartnerId] = penalty;
  }
  const domesticStress =
    snapshot.band === 'critical' ? 0.06 : snapshot.band === 'concentrated' ? 0.035 : 0.015;
  return { partnerDeltas, domesticStress };
}

export function diversificationWorldEvent(
  snapshot: GTELMarketDiversificationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'critical') return null;
  return {
    id: `gtel_diversification_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export partner concentration alarm',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function marketDiversificationGiNotes(
  diversification: GTELMarketDiversificationSnapshot | null | undefined,
): string[] {
  if (!diversification) return [];
  return [
    `Market diversification: ${diversification.band.replace(/_/g, ' ')} (concentration ${Math.round(diversification.concentrationIndex * 100)}%).`,
    diversification.summary,
  ];
}


// --- source: terms-of-trade.ts ---
  GTELCommodityQuote,
  GTELImportDependencySnapshot,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTradeBalanceSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTermsOfTradeBand = GTELTermsOfTradeSnapshot['band'];

const EXPORT_WEIGHT: Partial<Record<(typeof GTEL_COMMODITIES)[number], number>> = {
  iron_ore: 1.15,
  coal: 0.95,
  lng: 1.05,
  wheat: 0.75,
  beef: 0.7,
  aluminium: 0.85,
  services: 0.55,
  manufacturing: 0.45,
};

const IMPORT_BASKET_WEIGHT: Partial<Record<(typeof GTEL_COMMODITIES)[number], number>> = {
  manufacturing: 1.2,
  services: 0.65,
  aluminium: 0.55,
  lng: 0.35,
  coal: 0.2,
  iron_ore: 0.15,
  wheat: 0.25,
  beef: 0.18,
};

function termsBand(index: number): GTELTermsOfTradeBand {
  if (index >= 1.06) return 'favorable';
  if (index >= 0.98) return 'neutral';
  if (index >= 0.88) return 'unfavorable';
  return 'severely_unfavorable';
}

export function sanitizeTermsOfTradeSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 1), 0.72, 1.28);
}

export function createEmptyTermsOfTradeSnapshot(): GTELTermsOfTradeSnapshot {
  return {
    index: 1,
    band: 'neutral',
    exportBasketIndex: 100,
    importBasketIndex: 100,
    summary: 'Export and import price baskets are in rough parity.',
  };
}

function weightedBasketIndex(
  commodities: GTELCommodityQuote[],
  weights: Partial<Record<(typeof GTEL_COMMODITIES)[number], number>>,
): number {
  let sum = 0;
  let wSum = 0;
  GTEL_COMMODITIES.forEach(c => {
    const w = gtelNum(weights[c], 0.5);
    const quote = commodities.find(q => q.commodity === c);
    const idx = quote?.effectiveIndex ?? GTEL_BASE_COMMODITY_INDEX[c];
    sum += idx * w;
    wSum += w;
  });
  return wSum > 0 ? sum / wSum : 100;
}

export function advanceTermsOfTradeSmoothing(persisted: GTELPersisted, rawIndex: number): GTELPersisted {
  const prev = sanitizeTermsOfTradeSmoothing(persisted.termsOfTradeSmoothing);
  const next = gtelClamp(prev * 0.78 + gtelClamp(rawIndex, 0.75, 1.25) * 0.22, 0.72, 1.28);
  return { ...persisted, termsOfTradeSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTermsOfTradeSnapshot(input: {
  commodities: GTELCommodityQuote[];
  tradeBalance: GTELTradeBalanceSnapshot;
  importDependency: GTELImportDependencySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTermsOfTradeSnapshot; persisted: GTELPersisted } {
  const exportBasketIndex = Math.round(weightedBasketIndex(input.commodities, EXPORT_WEIGHT) * 10) / 10;
  const importBasketIndex = Math.round(
    (weightedBasketIndex(input.commodities, IMPORT_BASKET_WEIGHT) +
      input.tradeBalance.importPressureIndex * 0.08 +
      input.importDependency.aggregateRisk * 12) *
      10,
  ) / 10;
  const rawIndex = gtelClamp(exportBasketIndex / Math.max(72, importBasketIndex), 0.76, 1.22);
  const balanceLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.025
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.035
        : 0;
  const adjustedRaw = gtelClamp(rawIndex + balanceLift, 0.75, 1.25);
  const persisted = advanceTermsOfTradeSmoothing(input.persisted, adjustedRaw);
  const index = sanitizeTermsOfTradeSmoothing(persisted.termsOfTradeSmoothing);
  const band = termsBand(index);
  const summary =
    band === 'favorable'
      ? 'Export commodity prices are outpacing import-linked costs — terms of trade are working in your favour.'
      : band === 'severely_unfavorable'
        ? 'Import basket inflation is eroding export purchasing power; terms of trade are sharply adverse.'
        : band === 'unfavorable'
          ? 'Import-side price pressure is nibbling at export-led income gains.'
          : 'Terms of trade are broadly neutral this turn.';

  return {
    snapshot: {
      index: Math.round(index * 1000) / 1000,
      band,
      exportBasketIndex,
      importBasketIndex,
      summary,
    },
    persisted,
  };
}

/** Household offset modifier from terms-of-trade (negative = tighter household room). */
export function termsOfTradeHouseholdModifier(snapshot: GTELTermsOfTradeSnapshot | null | undefined): number {
  if (!snapshot) return 0;
  if (snapshot.band === 'favorable') return 0.04;
  if (snapshot.band === 'severely_unfavorable') return -0.08;
  if (snapshot.band === 'unfavorable') return -0.035;
  return 0;
}

export function termsOfTradeWorldEvent(
  snapshot: GTELTermsOfTradeSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severely_unfavorable') return null;
  return {
    id: `gtel_terms_of_trade_${turn}`,
    turn,
    kind: 'trade',
    title: 'Adverse terms of trade shock',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function termsOfTradeGiNotes(terms: GTELTermsOfTradeSnapshot | null | undefined): string[] {
  if (!terms) return [];
  return [
    `Terms of trade: ${terms.band.replace(/_/g, ' ')} (index ${terms.index.toFixed(2)}).`,
    terms.summary,
  ];
}


// --- source: supply-chain-resilience.ts ---
  GTELImportDependencySnapshot,
  GTELLogisticsStress,
  GTELMarketDiversificationSnapshot,
  GTELPersisted,
  GTELSupplyChainResilienceSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELSupplyChainBand = GTELSupplyChainResilienceSnapshot['band'];

function resilienceBand(score: number): GTELSupplyChainBand {
  if (score >= 0.72) return 'robust';
  if (score >= 0.52) return 'adaptive';
  if (score >= 0.32) return 'fragile';
  return 'brittle';
}

export function sanitizeSupplyChainResilienceSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.58), 0.15, 0.95);
}

export function createEmptySupplyChainResilienceSnapshot(): GTELSupplyChainResilienceSnapshot {
  return {
    score: 0.58,
    band: 'adaptive',
    chokepointCount: 0,
    redundancyIndex: 0.55,
    summary: 'Supply chains retain baseline redundancy.',
  };
}

export function advanceSupplyChainResilienceSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSupplyChainResilienceSmoothing(persisted.supplyChainResilienceSmoothing);
  const next = gtelClamp(prev * 0.74 + gtelClamp(rawScore, 0.12, 0.92) * 0.26, 0.15, 0.95);
  return { ...persisted, supplyChainResilienceSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeSupplyChainResilienceSnapshot(input: {
  logistics: GTELLogisticsStress;
  marketDiversification: GTELMarketDiversificationSnapshot;
  importDependency: GTELImportDependencySnapshot;
  openDisputeCount: number;
  persisted: GTELPersisted;
}): { snapshot: GTELSupplyChainResilienceSnapshot; persisted: GTELPersisted } {
  const logisticsScore =
    input.logistics.band === 'fluid'
      ? 0.82
      : input.logistics.band === 'watch'
        ? 0.68
        : input.logistics.band === 'tight'
          ? 0.48
          : 0.28;
  const diversificationScore =
    input.marketDiversification.band === 'well_spread'
      ? 0.85
      : input.marketDiversification.band === 'moderate'
        ? 0.62
        : input.marketDiversification.band === 'concentrated'
          ? 0.38
          : 0.22;
  const importScore = gtelClamp(1 - input.importDependency.aggregateRisk * 0.95, 0.15, 0.88);
  const disputePenalty = gtelClamp(input.openDisputeCount * 0.06, 0, 0.22);
  const redundancyIndex = gtelClamp(
    logisticsScore * 0.38 + diversificationScore * 0.32 + importScore * 0.3 + input.logistics.redundancyScore * 0.12,
    0.12,
    0.92,
  );
  const rawScore = gtelClamp(redundancyIndex - disputePenalty, 0.1, 0.9);
  const persisted = advanceSupplyChainResilienceSmoothing(input.persisted, rawScore);
  const score = sanitizeSupplyChainResilienceSmoothing(persisted.supplyChainResilienceSmoothing);
  const band = resilienceBand(score);
  const chokepointCount =
    (input.logistics.band === 'congested' || input.logistics.band === 'tight' ? 1 : 0) +
    (input.marketDiversification.band === 'critical' || input.marketDiversification.band === 'concentrated' ? 1 : 0) +
    (input.importDependency.band === 'critical' || input.importDependency.band === 'elevated' ? 1 : 0) +
    (input.openDisputeCount >= 2 ? 1 : 0);
  const summary =
    band === 'robust'
      ? 'Multiple lanes and partner basins absorb shocks without systemic chokepoints.'
      : band === 'brittle'
        ? 'Supply chains are one disruption away from cascading delays across import-exposed sectors.'
        : band === 'fragile'
          ? 'Redundancy is thin — logistics or partner shocks will propagate quickly.'
          : 'Supply chains are coping but lack deep buffers.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      chokepointCount,
      redundancyIndex: Math.round(redundancyIndex * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function supplyChainResilienceExportScale(
  snapshot: GTELSupplyChainResilienceSnapshot | null | undefined,
): number {
  if (!snapshot) return 1;
  return gtelClamp(0.82 + snapshot.score * 0.22, 0.78, 1.06);
}

export function supplyChainResilienceDomesticStress(
  snapshot: GTELSupplyChainResilienceSnapshot | null | undefined,
): number {
  if (!snapshot) return 0;
  return gtelClamp((0.62 - snapshot.score) * 0.18, 0, 0.1);
}

export function supplyChainResilienceWorldEvent(
  snapshot: GTELSupplyChainResilienceSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'brittle' || snapshot.chokepointCount < 2) return null;
  return {
    id: `gtel_supply_chain_${turn}`,
    turn,
    kind: 'trade',
    title: 'Supply chain redundancy alarm',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'VIC'],
  };
}

export function supplyChainResilienceGiNotes(
  resilience: GTELSupplyChainResilienceSnapshot | null | undefined,
): string[] {
  if (!resilience) return [];
  return [
    `Supply chain resilience: ${resilience.band.replace(/_/g, ' ')} (score ${Math.round(resilience.score * 100)}%).`,
    resilience.summary,
  ];
}


// --- source: foreign-exchange-pressure.ts ---
  GTELForeignExchangeSnapshot,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTradeBalanceSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELForeignExchangeBand = GTELForeignExchangeSnapshot['band'];

function fxBand(pressureIndex: number): GTELForeignExchangeBand {
  if (pressureIndex >= 1.045) return 'supportive';
  if (pressureIndex >= 0.96) return 'neutral';
  if (pressureIndex >= 0.88) return 'stress';
  return 'crisis';
}

export function sanitizeForeignExchangeSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 1), 0.78, 1.22);
}

export function createEmptyForeignExchangeSnapshot(): GTELForeignExchangeSnapshot {
  return {
    pressureIndex: 1,
    band: 'neutral',
    passThroughToImports: 0.12,
    exportCompetitiveness: 0.5,
    summary: 'Trade-weighted FX pass-through is near neutral.',
  };
}

export function advanceForeignExchangeSmoothing(
  persisted: GTELPersisted,
  rawPressure: number,
): GTELPersisted {
  const prev = sanitizeForeignExchangeSmoothing(persisted.foreignExchangeSmoothing);
  const next = gtelClamp(prev * 0.76 + gtelClamp(rawPressure, 0.8, 1.18) * 0.24, 0.78, 1.22);
  return { ...persisted, foreignExchangeSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeForeignExchangeSnapshot(input: {
  termsOfTrade: GTELTermsOfTradeSnapshot;
  tradeBalance: GTELTradeBalanceSnapshot;
  tradeFinance: GTELTradeFinanceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELForeignExchangeSnapshot; persisted: GTELPersisted } {
  const termsLift = gtelClamp((input.termsOfTrade.index - 1) * 0.35, -0.08, 0.1);
  const balanceLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.035
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.045
        : 0;
  const financeDrag =
    input.tradeFinance.band === 'frozen'
      ? -0.06
      : input.tradeFinance.band === 'tight'
        ? -0.035
        : input.tradeFinance.band === 'fluid'
          ? 0.025
          : 0;
  const rawPressure = gtelClamp(1 + termsLift + balanceLift + financeDrag, 0.82, 1.16);
  const persisted = advanceForeignExchangeSmoothing(input.persisted, rawPressure);
  const pressureIndex = sanitizeForeignExchangeSmoothing(persisted.foreignExchangeSmoothing);
  const band = fxBand(pressureIndex);
  const passThroughToImports = gtelClamp(0.08 + (1.02 - pressureIndex) * 0.22, 0.04, 0.28);
  const exportCompetitiveness = gtelClamp((pressureIndex - 0.88) / 0.34, 0, 1);

  const summary =
    band === 'supportive'
      ? 'Commodity-linked FX is easing import costs while keeping export quotes competitive.'
      : band === 'crisis'
        ? 'FX pass-through is amplifying import inflation faster than export receipts can offset.'
        : band === 'stress'
          ? 'Currency pressure is feeding through to import prices and squeezing household budgets.'
          : 'Trade-weighted exchange pass-through is broadly balanced this turn.';

  return {
    snapshot: {
      pressureIndex: Math.round(pressureIndex * 1000) / 1000,
      band,
      passThroughToImports: Math.round(passThroughToImports * 1000) / 1000,
      exportCompetitiveness: Math.round(exportCompetitiveness * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function foreignExchangeExportScale(
  snapshot: GTELForeignExchangeSnapshot | null | undefined,
): number {
  if (!snapshot) return 1;
  return gtelClamp(0.88 + snapshot.exportCompetitiveness * 0.16, 0.86, 1.06);
}

export function foreignExchangeHouseholdModifier(
  snapshot: GTELForeignExchangeSnapshot | null | undefined,
): number {
  if (!snapshot) return 0;
  return gtelClamp((1 - snapshot.pressureIndex) * 0.18 - snapshot.passThroughToImports * 0.12, -0.12, 0.08);
}

export function foreignExchangeDomesticStress(
  snapshot: GTELForeignExchangeSnapshot | null | undefined,
): number {
  if (!snapshot) return 0;
  return gtelClamp(snapshot.passThroughToImports * 0.14 + (snapshot.band === 'crisis' ? 0.04 : 0), 0, 0.1);
}

export function foreignExchangeWorldEvent(
  snapshot: GTELForeignExchangeSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'crisis') return null;
  return {
    id: `gtel_fx_crisis_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade-weighted FX stress',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function foreignExchangeGiNotes(
  fx: GTELForeignExchangeSnapshot | null | undefined,
): string[] {
  if (!fx) return [];
  return [
    `FX pass-through: ${fx.band.replace(/_/g, ' ')} (index ${Math.round(fx.pressureIndex * 100) / 100}).`,
    fx.summary,
  ];
}


// --- source: trade-retaliation.ts ---
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeRetaliationBand = GTELTradeRetaliationSnapshot['band'];

function retaliationBand(intensity: number): GTELTradeRetaliationBand {
  if (intensity >= 0.62) return 'escalating';
  if (intensity >= 0.38) return 'active';
  if (intensity >= 0.18) return 'watch';
  return 'dormant';
}

export function sanitizeRetaliationPressureSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.22), 0.05, 0.88);
}

export function createEmptyTradeRetaliationSnapshot(): GTELTradeRetaliationSnapshot {
  return {
    intensity: 0.22,
    band: 'watch',
    activeMeasureCount: 0,
    targetedPartnerIds: [],
    summary: 'No coordinated trade retaliation is in force.',
  };
}

export function advanceRetaliationPressureSmoothing(
  persisted: GTELPersisted,
  rawIntensity: number,
): GTELPersisted {
  const prev = sanitizeRetaliationPressureSmoothing(persisted.retaliationPressureSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawIntensity, 0.05, 0.9) * 0.3, 0.05, 0.88);
  return { ...persisted, retaliationPressureSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeRetaliationSnapshot(input: {
  openDisputeCount: number;
  activeSanctionCount: number;
  engagement: GTELDiplomaticEngagementState;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeRetaliationSnapshot; persisted: GTELPersisted } {
  const stalledTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'stalled' || t.momentum < 0.25),
  ).length;
  const disputeIntensity = gtelClamp(input.openDisputeCount * 0.14, 0, 0.42);
  const sanctionIntensity = gtelClamp(input.activeSanctionCount * 0.11, 0, 0.35);
  const engagementIntensity = gtelClamp(stalledTracks * 0.08 + (1 - input.engagement.summitPulse) * 0.06, 0, 0.22);
  const rawIntensity = gtelClamp(disputeIntensity + sanctionIntensity + engagementIntensity, 0.05, 0.88);
  const persisted = advanceRetaliationPressureSmoothing(input.persisted, rawIntensity);
  const intensity = sanitizeRetaliationPressureSmoothing(persisted.retaliationPressureSmoothing);
  const band = retaliationBand(intensity);
  const activeMeasureCount =
    Math.min(6, input.openDisputeCount + input.activeSanctionCount + (band === 'escalating' ? 1 : 0));
  const targetedPartnerIds: GTELPartnerId[] = [];
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const track = input.engagement.tracks?.[p.id];
    if (input.openDisputeCount > 0 || (track && track.band === 'stalled')) {
      if (intensity > 0.28) targetedPartnerIds.push(p.id);
    }
  });

  const summary =
    band === 'escalating'
      ? 'Partners are stacking counter-tariffs and compliance probes across multiple lanes.'
      : band === 'active'
        ? 'Retaliatory trade measures are live — expect tighter partner gates until diplomacy cools.'
        : band === 'dormant'
          ? 'Retaliation risk is low; disputes have not yet triggered counter-measures.'
          : 'Retaliation risk is elevated but still mostly rhetorical.';

  return {
    snapshot: {
      intensity: Math.round(intensity * 1000) / 1000,
      band,
      activeMeasureCount,
      targetedPartnerIds: targetedPartnerIds.slice(0, 4),
      summary,
    },
    persisted,
  };
}

export function deriveRetaliationPartnerModifiers(snapshot: GTELTradeRetaliationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'dormant' || snapshot.band === 'watch') {
    return { partnerDeltas, domesticStress: snapshot.intensity * 0.04 };
  }
  const delta = snapshot.band === 'escalating' ? -0.09 : -0.05;
  snapshot.targetedPartnerIds.forEach(id => {
    partnerDeltas[id] = delta;
  });
  if (snapshot.band === 'escalating' && snapshot.targetedPartnerIds.length === 0) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id !== 'domestic_premium') partnerDeltas[p.id] = delta * 0.6;
    });
  }
  return {
    partnerDeltas,
    domesticStress: gtelClamp(snapshot.intensity * 0.12, 0, 0.1),
  };
}

export function tradeRetaliationWorldEvent(
  snapshot: GTELTradeRetaliationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'escalating' || snapshot.activeMeasureCount < 2) return null;
  return {
    id: `gtel_retaliation_${turn}`,
    turn,
    kind: 'sanction',
    title: 'Coordinated trade retaliation',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'ACT'],
  };
}

export function tradeRetaliationGiNotes(
  retaliation: GTELTradeRetaliationSnapshot | null | undefined,
): string[] {
  if (!retaliation) return [];
  return [
    `Trade retaliation: ${retaliation.band.replace(/_/g, ' ')} (intensity ${Math.round(retaliation.intensity * 100)}%).`,
    retaliation.summary,
  ];
}


// --- source: trade-deescalation.ts ---
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTradeDeescalationSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeDeescalationBand = GTELTradeDeescalationSnapshot['band'];

function deescalationBand(momentum: number): GTELTradeDeescalationBand {
  if (momentum >= 0.72) return 'breakthrough';
  if (momentum >= 0.52) return 'warming';
  if (momentum >= 0.32) return 'thawing';
  return 'stalled';
}

export function sanitizeDeescalationMomentumSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.28), 0.08, 0.92);
}

export function createEmptyTradeDeescalationSnapshot(): GTELTradeDeescalationSnapshot {
  return {
    momentum: 0.28,
    band: 'stalled',
    coolingPartnerIds: [],
    retaliationAttenuation: 0,
    summary: 'Diplomatic cooling lanes are not yet absorbing retaliation pressure.',
  };
}

export function advanceDeescalationMomentumSmoothing(
  persisted: GTELPersisted,
  rawMomentum: number,
): GTELPersisted {
  const prev = sanitizeDeescalationMomentumSmoothing(persisted.deescalationMomentumSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawMomentum, 0.08, 0.92) * 0.28, 0.08, 0.92);
  return { ...persisted, deescalationMomentumSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeDeescalationSnapshot(input: {
  openDisputeCount: number;
  engagement: GTELDiplomaticEngagementState;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  complianceScore: number;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeDeescalationSnapshot; persisted: GTELPersisted } {
  const breakthroughTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'breakthrough' || t.momentum >= 0.72),
  ).length;
  const activeTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'active' || t.momentum >= 0.45),
  ).length;
  const summitLift = gtelClamp(input.engagement.summitPulse * 0.22, 0, 0.18);
  const engagementLift = gtelClamp(breakthroughTracks * 0.14 + activeTracks * 0.06, 0, 0.32);
  const disputeDrag = gtelClamp(input.openDisputeCount * 0.11, 0, 0.38);
  const retaliationDrag =
    input.tradeRetaliation.band === 'escalating'
      ? 0.12
      : input.tradeRetaliation.band === 'active'
        ? 0.08
        : 0.03;
  const complianceLift = gtelClamp((input.complianceScore - 0.55) * 0.18, -0.06, 0.12);
  const rawMomentum = gtelClamp(
    0.22 + summitLift + engagementLift + complianceLift - disputeDrag - retaliationDrag,
    0.08,
    0.92,
  );
  const persisted = advanceDeescalationMomentumSmoothing(input.persisted, rawMomentum);
  const momentum = sanitizeDeescalationMomentumSmoothing(persisted.deescalationMomentumSmoothing);
  const band = deescalationBand(momentum);
  const coolingPartnerIds: GTELPartnerId[] = [];
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const track = input.engagement.tracks?.[p.id];
    if (track && (track.band === 'breakthrough' || track.band === 'active') && momentum > 0.38) {
      coolingPartnerIds.push(p.id);
    }
  });
  const retaliationAttenuation =
    band === 'breakthrough'
      ? gtelClamp(input.tradeRetaliation.intensity * 0.35, 0, 0.22)
      : band === 'warming'
        ? gtelClamp(input.tradeRetaliation.intensity * 0.22, 0, 0.14)
        : band === 'thawing'
          ? gtelClamp(input.tradeRetaliation.intensity * 0.12, 0, 0.08)
          : 0;

  const summary =
    band === 'breakthrough'
      ? 'Summit momentum is unwinding retaliation — partner gates are reopening on priority lanes.'
      : band === 'warming'
        ? 'Confidence-building measures are offsetting part of the counter-tariff stack.'
        : band === 'thawing'
          ? 'Quiet diplomacy is easing rhetoric, but retaliation measures remain on the books.'
          : 'Retaliation and disputes dominate; de-escalation tracks have not gained traction.';

  return {
    snapshot: {
      momentum: Math.round(momentum * 1000) / 1000,
      band,
      coolingPartnerIds: coolingPartnerIds.slice(0, 4),
      retaliationAttenuation: Math.round(retaliationAttenuation * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function deriveDeescalationPartnerModifiers(snapshot: GTELTradeDeescalationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStressRelief: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'stalled') {
    return { partnerDeltas, domesticStressRelief: 0 };
  }
  const delta =
    snapshot.band === 'breakthrough' ? 0.07 : snapshot.band === 'warming' ? 0.045 : 0.025;
  snapshot.coolingPartnerIds.forEach(id => {
    partnerDeltas[id] = delta;
  });
  if (snapshot.band === 'breakthrough' && snapshot.coolingPartnerIds.length === 0) {
    GTEL_PARTNER_DEFS.forEach(p => {
      if (p.id !== 'domestic_premium') partnerDeltas[p.id] = delta * 0.55;
    });
  }
  return {
    partnerDeltas,
    domesticStressRelief: gtelClamp(snapshot.retaliationAttenuation * 0.45 + snapshot.momentum * 0.04, 0, 0.12),
  };
}

export function tradeDeescalationWorldEvent(
  snapshot: GTELTradeDeescalationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'breakthrough' || snapshot.coolingPartnerIds.length < 1) return null;
  return {
    id: `gtel_deescalation_${turn}`,
    turn,
    kind: 'diplomacy',
    title: 'Trade tensions cooling',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function tradeDeescalationGiNotes(
  deescalation: GTELTradeDeescalationSnapshot | null | undefined,
): string[] {
  if (!deescalation) return [];
  return [
    `Trade de-escalation: ${deescalation.band.replace(/_/g, ' ')} (momentum ${Math.round(deescalation.momentum * 100)}%).`,
    deescalation.summary,
  ];
}


// --- source: export-capacity-allocation.ts ---
  GTELCommodityQuote,
  GTELExportCapacitySnapshot,
  GTELLogisticsStress,
  GTELMarketDiversificationSnapshot,
  GTELPartnerMarket,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELExportCapacityBand = GTELExportCapacitySnapshot['band'];

function capacityBand(utilization: number): GTELExportCapacityBand {
  if (utilization >= 0.94) return 'saturated';
  if (utilization >= 0.78) return 'tight';
  if (utilization >= 0.55) return 'balanced';
  return 'slack';
}

export function sanitizeExportCapacitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.62), 0.35, 0.98);
}

export function createEmptyExportCapacitySnapshot(): GTELExportCapacitySnapshot {
  return {
    utilization: 0.62,
    band: 'balanced',
    allocationEfficiency: 0.58,
    priorityCommodities: [],
    summary: 'Export capacity is broadly balanced across commodity lanes.',
  };
}

export function advanceExportCapacitySmoothing(
  persisted: GTELPersisted,
  rawUtilization: number,
): GTELPersisted {
  const prev = sanitizeExportCapacitySmoothing(persisted.exportCapacitySmoothing);
  const next = gtelClamp(prev * 0.74 + gtelClamp(rawUtilization, 0.35, 0.98) * 0.26, 0.35, 0.98);
  return { ...persisted, exportCapacitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeExportCapacitySnapshot(input: {
  commodities: GTELCommodityQuote[];
  partners: GTELPartnerMarket[];
  logistics: GTELLogisticsStress;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  exportThroughput: number;
  persisted: GTELPersisted;
}): { snapshot: GTELExportCapacitySnapshot; persisted: GTELPersisted } {
  const throughputNorm = gtelClamp(input.exportThroughput / 130, 0.35, 1.05);
  const logisticsLoad = gtelClamp(
    (input.logistics.band === 'congested' ? 0.18 : input.logistics.band === 'tight' ? 0.1 : 0.04) +
      input.logistics.networkStrain * 0.12,
    0,
    0.28,
  );
  const diversificationDrag =
    input.marketDiversification.band === 'critical'
      ? 0.08
      : input.marketDiversification.band === 'concentrated'
        ? 0.05
        : 0.02;
  const termsLift =
    input.termsOfTrade.band === 'favorable' ? -0.04 : input.termsOfTrade.band === 'severely_unfavorable' ? 0.06 : 0;
  const avgQuote =
    input.commodities.reduce((a, c) => a + c.effectiveIndex, 0) / Math.max(1, input.commodities.length);
  const quoteHeat = gtelClamp((avgQuote - 98) / 55, -0.05, 0.12);
  const rawUtilization = gtelClamp(
    throughputNorm * 0.55 + logisticsLoad + diversificationDrag + termsLift + quoteHeat + 0.08,
    0.35,
    0.98,
  );
  const persisted = advanceExportCapacitySmoothing(input.persisted, rawUtilization);
  const utilization = sanitizeExportCapacitySmoothing(persisted.exportCapacitySmoothing);
  const band = capacityBand(utilization);

  const weights = input.commodities.map(c => {
    const partnerDemand = input.partners.reduce((acc, p) => {
      const w = gtelNum(p.demandWeights[c.commodity], 0.35);
      return acc + w * (p.access === 'blocked' ? 0.2 : p.access === 'restricted' ? 0.55 : 1);
    }, 0);
    return {
      commodity: c.commodity,
      weight: gtelClamp(c.effectiveIndex / 105 + partnerDemand * 0.08 + (c.trend === 'rising' ? 0.04 : 0), 0.2, 1.4),
    };
  });
  weights.sort((a, b) => b.weight - a.weight);
  const priorityCommodities = weights.slice(0, 3).map(w => w.commodity);
  const spread =
    weights.length > 1 ? weights[0].weight - weights[weights.length - 1].weight : 0;
  const allocationEfficiency = gtelClamp(
    0.52 +
      (band === 'slack' ? 0.08 : band === 'balanced' ? 0.04 : -0.06) -
      spread * 0.05 +
      (input.marketDiversification.band === 'well_spread' ? 0.05 : 0),
    0.28,
    0.92,
  );

  const summary =
    band === 'saturated'
      ? 'Port and rail slots are saturated — export allocation is rationing lower-priority commodities.'
      : band === 'tight'
        ? 'Capacity is tight; planners are prioritising high-value export lanes.'
        : band === 'slack'
          ? 'Spare export capacity allows broader commodity mix without rationing.'
          : 'Export capacity utilisation is balanced across major commodity lanes.';

  return {
    snapshot: {
      utilization: Math.round(utilization * 1000) / 1000,
      band,
      allocationEfficiency: Math.round(allocationEfficiency * 1000) / 1000,
      priorityCommodities,
      summary,
    },
    persisted,
  };
}

export function applyExportCapacityToCommodityQuotes(
  commodities: GTELCommodityQuote[],
  snapshot: GTELExportCapacitySnapshot,
): GTELCommodityQuote[] {
  if (snapshot.band === 'balanced' || snapshot.band === 'slack') return commodities;
  const boost = snapshot.band === 'saturated' ? -0.018 : -0.01;
  const priority = new Set(snapshot.priorityCommodities);
  return commodities.map(c => {
    const isPriority = priority.has(c.commodity);
    const delta = isPriority ? Math.abs(boost) * 0.65 : boost;
    const effectiveIndex = gtelClamp(Math.round((c.effectiveIndex * (1 + delta)) * 10) / 10, 45, 175);
    return {
      ...c,
      effectiveIndex,
      evidence: [
        ...c.evidence,
        isPriority
          ? 'Export capacity rationing prioritised this commodity lane'
          : 'Export capacity rationing trimmed non-priority quotes',
      ],
    };
  });
}

export function exportCapacityExportScale(snapshot: GTELExportCapacitySnapshot): number {
  if (snapshot.band === 'slack') return gtelClamp(1 + (0.62 - snapshot.utilization) * 0.08, 1, 1.04);
  if (snapshot.band === 'saturated') return gtelClamp(0.9 + snapshot.allocationEfficiency * 0.08, 0.88, 0.96);
  if (snapshot.band === 'tight') return gtelClamp(0.94 + snapshot.allocationEfficiency * 0.05, 0.9, 0.99);
  return gtelClamp(0.96 + snapshot.allocationEfficiency * 0.04, 0.92, 1.02);
}

export function exportCapacityDomesticStress(snapshot: GTELExportCapacitySnapshot): number {
  if (snapshot.band === 'saturated') return gtelClamp((snapshot.utilization - 0.78) * 0.18, 0, 0.08);
  if (snapshot.band === 'tight') return gtelClamp((snapshot.utilization - 0.7) * 0.1, 0, 0.05);
  return 0;
}

export function exportCapacityWorldEvent(
  snapshot: GTELExportCapacitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'saturated' || snapshot.utilization < 0.92) return null;
  return {
    id: `gtel_capacity_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export capacity rationing',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function exportCapacityGiNotes(
  capacity: GTELExportCapacitySnapshot | null | undefined,
): string[] {
  if (!capacity) return [];
  return [
    `Export capacity: ${capacity.band.replace(/_/g, ' ')} (${Math.round(capacity.utilization * 100)}% utilisation).`,
    capacity.summary,
  ];
}


// --- source: trade-reconciliation.ts ---
  GTELDiplomaticEngagementState,
  GTELPartnerId,
  GTELPersisted,
  GTELTradeDeescalationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeReconciliationBand = GTELTradeReconciliationSnapshot['band'];

function reconciliationBand(progress: number): GTELTradeReconciliationBand {
  if (progress >= 0.78) return 'settled';
  if (progress >= 0.52) return 'substantive';
  if (progress >= 0.28) return 'procedural';
  return 'stalled';
}

export function sanitizeReconciliationProgressSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.24), 0.06, 0.92);
}

export function createEmptyTradeReconciliationSnapshot(): GTELTradeReconciliationSnapshot {
  return {
    progress: 0.24,
    band: 'stalled',
    disputeReliefCount: 0,
    reconciledPartnerIds: [],
    summary: 'Dispute panels have not yet produced a reconciliation track.',
  };
}

export function advanceReconciliationProgressSmoothing(
  persisted: GTELPersisted,
  rawProgress: number,
): GTELPersisted {
  const prev = sanitizeReconciliationProgressSmoothing(persisted.reconciliationProgressSmoothing);
  const next = gtelClamp(prev * 0.74 + gtelClamp(rawProgress, 0.06, 0.92) * 0.26, 0.06, 0.92);
  return { ...persisted, reconciliationProgressSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeReconciliationSnapshot(input: {
  openDisputeCount: number;
  complianceScore: number;
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  engagement: GTELDiplomaticEngagementState;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeReconciliationSnapshot; persisted: GTELPersisted } {
  const deescalationLift =
    input.tradeDeescalation.band === 'breakthrough'
      ? 0.28
      : input.tradeDeescalation.band === 'warming'
        ? 0.18
        : input.tradeDeescalation.band === 'thawing'
          ? 0.1
          : 0.02;
  const complianceLift = gtelClamp((input.complianceScore - 0.58) * 0.22, -0.05, 0.14);
  const breakthroughTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'breakthrough' || t.momentum >= 0.7),
  ).length;
  const engagementLift = gtelClamp(breakthroughTracks * 0.08 + input.engagement.summitPulse * 0.12, 0, 0.22);
  const disputeDrag =
    input.openDisputeCount === 0 ? 0 : gtelClamp(0.12 + input.openDisputeCount * 0.09, 0.08, 0.42);
  const rawProgress = gtelClamp(
    0.18 + deescalationLift + complianceLift + engagementLift - disputeDrag,
    0.06,
    0.92,
  );
  const persisted = advanceReconciliationProgressSmoothing(input.persisted, rawProgress);
  const progress = sanitizeReconciliationProgressSmoothing(persisted.reconciliationProgressSmoothing);
  const band = reconciliationBand(progress);
  const disputeReliefCount =
    input.openDisputeCount === 0
      ? 0
      : band === 'settled'
        ? Math.min(input.openDisputeCount, 2)
        : band === 'substantive'
          ? Math.min(input.openDisputeCount, 1)
          : 0;
  const reconciledPartnerIds: GTELPartnerId[] = [];
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const track = input.engagement.tracks?.[p.id];
    if (
      progress > 0.42 &&
      (input.tradeDeescalation.coolingPartnerIds.includes(p.id) ||
        (track && (track.band === 'active' || track.band === 'breakthrough')))
    ) {
      reconciledPartnerIds.push(p.id);
    }
  });

  const summary =
    band === 'settled'
      ? 'Panel findings are closing disputes — compliance monitors are signing off staged relief.'
      : band === 'substantive'
        ? 'Negotiators are exchanging concrete remedies; dispute counts should ease next window.'
        : band === 'procedural'
          ? 'Procedural reconciliation is underway but remedies remain thin.'
          : 'Disputes remain entrenched; reconciliation tracks have not cleared procedural hurdles.';

  return {
    snapshot: {
      progress: Math.round(progress * 1000) / 1000,
      band,
      disputeReliefCount,
      reconciledPartnerIds: reconciledPartnerIds.slice(0, 4),
      summary,
    },
    persisted,
  };
}

export function deriveReconciliationPartnerModifiers(snapshot: GTELTradeReconciliationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStressRelief: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'stalled') {
    return { partnerDeltas, domesticStressRelief: 0 };
  }
  const lift =
    snapshot.band === 'settled' ? 0.08 : snapshot.band === 'substantive' ? 0.05 : 0.03;
  snapshot.reconciledPartnerIds.forEach(id => {
    partnerDeltas[id] = gtelNum(partnerDeltas[id], 0) + lift;
  });
  const domesticStressRelief =
    snapshot.band === 'settled'
      ? gtelClamp(snapshot.progress * 0.06, 0, 0.05)
      : snapshot.band === 'substantive'
        ? gtelClamp(snapshot.progress * 0.04, 0, 0.035)
        : gtelClamp(snapshot.progress * 0.02, 0, 0.02);
  return { partnerDeltas, domesticStressRelief };
}

export function reconciliationEffectiveDisputeCount(
  openDisputeCount: number,
  snapshot: GTELTradeReconciliationSnapshot,
): number {
  return Math.max(0, openDisputeCount - snapshot.disputeReliefCount);
}

export function tradeReconciliationWorldEvent(
  snapshot: GTELTradeReconciliationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'settled' && snapshot.band !== 'substantive') return null;
  if (snapshot.progress < 0.55) return null;
  return {
    id: `gtel_reconciliation_${turn}`,
    turn,
    kind: 'diplomacy',
    title: 'Trade dispute reconciliation advancing',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function tradeReconciliationGiNotes(
  reconciliation: GTELTradeReconciliationSnapshot | null | undefined,
): string[] {
  if (!reconciliation) return [];
  return [
    `Trade reconciliation: ${reconciliation.band.replace(/_/g, ' ')} (${Math.round(reconciliation.progress * 100)}% progress).`,
    reconciliation.summary,
  ];
}


// --- source: maritime-risk-premium.ts ---
  GTELExportCapacitySnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELMaritimeRiskSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELMaritimeRiskBand = GTELMaritimeRiskSnapshot['band'];

function maritimeBand(premium: number): GTELMaritimeRiskBand {
  if (premium >= 0.72) return 'blocked';
  if (premium >= 0.48) return 'severe';
  if (premium >= 0.28) return 'elevated';
  return 'calm';
}

export function sanitizeMaritimeRiskSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.22), 0.08, 0.88);
}

export function createEmptyMaritimeRiskSnapshot(): GTELMaritimeRiskSnapshot {
  return {
    premiumIndex: 0.22,
    band: 'calm',
    insuranceLoad: 0.04,
    laneReliability: 0.82,
    summary: 'Maritime insurance markets are calm on major export lanes.',
  };
}

export function advanceMaritimeRiskSmoothing(
  persisted: GTELPersisted,
  rawPremium: number,
): GTELPersisted {
  const prev = sanitizeMaritimeRiskSmoothing(persisted.maritimeRiskSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawPremium, 0.08, 0.88) * 0.3, 0.08, 0.88);
  return { ...persisted, maritimeRiskSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeMaritimeRiskSnapshot(input: {
  logistics: GTELLogisticsStress;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  activeSanctionCount: number;
  exportCapacity: GTELExportCapacitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELMaritimeRiskSnapshot; persisted: GTELPersisted } {
  const logisticsLoad =
    input.logistics.band === 'congested'
      ? 0.28
      : input.logistics.band === 'tight'
        ? 0.18
        : input.logistics.band === 'watch'
          ? 0.08
          : 0.03;
  const retaliationLoad =
    input.tradeRetaliation.band === 'escalating'
      ? 0.22
      : input.tradeRetaliation.band === 'active'
        ? 0.14
        : input.tradeRetaliation.band === 'watch'
          ? 0.06
          : 0.02;
  const sanctionLoad = gtelClamp(input.activeSanctionCount * 0.09, 0, 0.26);
  const capacityLoad =
    input.exportCapacity.band === 'saturated'
      ? 0.1
      : input.exportCapacity.band === 'tight'
        ? 0.06
        : 0.02;
  const rawPremium = gtelClamp(
    0.16 + logisticsLoad + retaliationLoad + sanctionLoad + capacityLoad + input.logistics.networkStrain * 0.08,
    0.08,
    0.88,
  );
  const persisted = advanceMaritimeRiskSmoothing(input.persisted, rawPremium);
  const premiumIndex = sanitizeMaritimeRiskSmoothing(persisted.maritimeRiskSmoothing);
  const band = maritimeBand(premiumIndex);
  const insuranceLoad = gtelClamp(0.03 + premiumIndex * 0.22, 0.03, 0.28);
  const laneReliability = gtelClamp(0.92 - premiumIndex * 0.55 - logisticsLoad * 0.12, 0.35, 0.92);

  const summary =
    band === 'blocked'
      ? 'War-risk and sanctions clauses are blocking standard hull cover on several export corridors.'
      : band === 'severe'
        ? 'Maritime insurers are repricing premiums — charterers face steep surcharges.'
        : band === 'elevated'
          ? 'Shipping lanes carry elevated insurance load; minor reroutes are common.'
          : 'Maritime insurance markets are calm on major export lanes.';

  return {
    snapshot: {
      premiumIndex: Math.round(premiumIndex * 1000) / 1000,
      band,
      insuranceLoad: Math.round(insuranceLoad * 1000) / 1000,
      laneReliability: Math.round(laneReliability * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function maritimeRiskExportScale(snapshot: GTELMaritimeRiskSnapshot): number {
  if (snapshot.band === 'calm') return gtelClamp(1.01 - snapshot.premiumIndex * 0.02, 0.98, 1.02);
  if (snapshot.band === 'blocked') return gtelClamp(0.82 + snapshot.laneReliability * 0.08, 0.78, 0.9);
  if (snapshot.band === 'severe') return gtelClamp(0.88 + snapshot.laneReliability * 0.06, 0.84, 0.94);
  return gtelClamp(0.92 + snapshot.laneReliability * 0.05, 0.88, 0.98);
}

export function maritimeRiskDomesticStress(snapshot: GTELMaritimeRiskSnapshot): number {
  if (snapshot.band === 'blocked') return gtelClamp(snapshot.premiumIndex * 0.12, 0.04, 0.1);
  if (snapshot.band === 'severe') return gtelClamp(snapshot.premiumIndex * 0.08, 0.02, 0.07);
  if (snapshot.band === 'elevated') return gtelClamp(snapshot.premiumIndex * 0.04, 0, 0.04);
  return 0;
}

export function maritimeRiskFinanceDrag(snapshot: GTELMaritimeRiskSnapshot): number {
  return gtelClamp(snapshot.insuranceLoad * 0.35, 0, 0.12);
}

export function maritimeRiskWorldEvent(
  snapshot: GTELMaritimeRiskSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severe' && snapshot.band !== 'blocked') return null;
  if (snapshot.premiumIndex < 0.5) return null;
  return {
    id: `gtel_maritime_${turn}`,
    turn,
    kind: 'trade',
    title: 'Maritime insurance repricing',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function maritimeRiskGiNotes(maritime: GTELMaritimeRiskSnapshot | null | undefined): string[] {
  if (!maritime) return [];
  return [
    `Maritime risk premium: ${maritime.band} (${Math.round(maritime.premiumIndex * 100)}% index).`,
    maritime.summary,
  ];
}


// --- source: preferential-access-utilization.ts ---
  GTELCommodityId,
  GTELCommodityQuote,
  GTELExportCapacitySnapshot,
  GTELMarketDiversificationSnapshot,
  GTELPartnerMarket,
  GTELPersisted,
  GTELPreferentialUtilizationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
  TradeAgreementRecord,
} from './types.ts';

export type GTELPreferentialUtilizationBand = GTELPreferentialUtilizationSnapshot['band'];

function utilizationBand(rate: number): GTELPreferentialUtilizationBand {
  if (rate >= 0.82) return 'saturated';
  if (rate >= 0.62) return 'high';
  if (rate >= 0.38) return 'balanced';
  return 'underused';
}

export function sanitizePreferentialUtilizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.48), 0.18, 0.92);
}

export function createEmptyPreferentialUtilizationSnapshot(): GTELPreferentialUtilizationSnapshot {
  return {
    utilizationRate: 0.48,
    band: 'balanced',
    activeAgreementCount: 0,
    boostedCommodities: [],
    summary: 'Preferential FTA lanes are lightly used relative to headline access.',
  };
}

export function advancePreferentialUtilizationSmoothing(
  persisted: GTELPersisted,
  rawRate: number,
): GTELPersisted {
  const prev = sanitizePreferentialUtilizationSmoothing(persisted.preferentialUtilizationSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawRate, 0.18, 0.92) * 0.27, 0.18, 0.92);
  return { ...persisted, preferentialUtilizationSmoothing: Math.round(next * 1000) / 1000 };
}

function activeRatifiedAgreements(persisted: GTELPersisted, turn: number): TradeAgreementRecord[] {
  return persisted.agreements.filter(
    a => a.status === 'ratified' && (a.expiresTurn == null || turn <= a.expiresTurn),
  );
}

export function computePreferentialUtilizationSnapshot(input: {
  turn: number;
  partners: GTELPartnerMarket[];
  persisted: GTELPersisted;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  exportCapacity: GTELExportCapacitySnapshot;
}): { snapshot: GTELPreferentialUtilizationSnapshot; persisted: GTELPersisted } {
  const active = activeRatifiedAgreements(input.persisted, input.turn);
  const preferredPartners = input.partners.filter(
    p => p.id !== 'domestic_premium' && (p.access === 'preferred' || p.access === 'normal'),
  );
  const accessLift =
    preferredPartners.length > 0
      ? preferredPartners.reduce((acc, p) => acc + p.accessScore, 0) / preferredPartners.length
      : 0.45;
  const agreementLift = gtelClamp(active.length * 0.09, 0, 0.28);
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.12
      : input.tradeReconciliation.band === 'substantive'
        ? 0.08
        : input.tradeReconciliation.band === 'procedural'
          ? 0.04
          : 0;
  const capacityDrag =
    input.exportCapacity.band === 'saturated'
      ? 0.1
      : input.exportCapacity.band === 'tight'
        ? 0.06
        : 0.02;
  const concentrationDrag =
    input.marketDiversification.band === 'critical'
      ? 0.08
      : input.marketDiversification.band === 'concentrated'
        ? 0.05
        : 0.02;
  const rawRate = gtelClamp(
    0.32 + accessLift * 0.35 + agreementLift + reconciliationLift - capacityDrag - concentrationDrag,
    0.18,
    0.92,
  );
  const persisted = advancePreferentialUtilizationSmoothing(input.persisted, rawRate);
  const utilizationRate = sanitizePreferentialUtilizationSmoothing(persisted.preferentialUtilizationSmoothing);
  const band = utilizationBand(utilizationRate);

  const boostedSet = new Set<GTELCommodityId>();
  active.forEach(a => {
    a.tariffLines.forEach(line => {
      if (GTEL_COMMODITIES.includes(line.commodity)) boostedSet.add(line.commodity);
    });
  });
  const boostedCommodities = [...boostedSet].slice(0, 5);

  const summary =
    band === 'saturated'
      ? 'FTA preferential lanes are running hot — quota clerks are prioritising ratified tariff lines.'
      : band === 'high'
        ? 'Exporters are actively filling preferential access windows under ratified agreements.'
        : band === 'underused'
          ? 'Headline FTA access is under-utilised; paperwork and partner friction are leaving quota on the table.'
          : 'Preferential lane usage is broadly aligned with ratified agreement coverage.';

  return {
    snapshot: {
      utilizationRate: Math.round(utilizationRate * 1000) / 1000,
      band,
      activeAgreementCount: active.length,
      boostedCommodities,
      summary,
    },
    persisted,
  };
}

export function applyPreferentialUtilizationToCommodityQuotes(
  commodities: GTELCommodityQuote[],
  snapshot: GTELPreferentialUtilizationSnapshot,
): GTELCommodityQuote[] {
  if (snapshot.band === 'balanced' || snapshot.band === 'underused') return commodities;
  const boost =
    snapshot.band === 'saturated' ? 0.016 : snapshot.band === 'high' ? 0.01 : 0;
  const boosted = new Set(snapshot.boostedCommodities);
  return commodities.map(c => {
    if (!boosted.has(c.commodity)) return c;
    const effectiveIndex = gtelClamp(Math.round(c.effectiveIndex * (1 + boost)) * 10 / 10, 45, 175);
    return {
      ...c,
      effectiveIndex,
      evidence: [...c.evidence, 'Preferential FTA utilisation lifted this commodity quote'],
    };
  });
}

export function preferentialUtilizationExportScale(snapshot: GTELPreferentialUtilizationSnapshot): number {
  if (snapshot.band === 'underused') return gtelClamp(0.97 + snapshot.utilizationRate * 0.02, 0.96, 0.99);
  if (snapshot.band === 'saturated') return gtelClamp(1.02 + snapshot.utilizationRate * 0.03, 1, 1.05);
  if (snapshot.band === 'high') return gtelClamp(1 + snapshot.utilizationRate * 0.02, 0.99, 1.04);
  return gtelClamp(0.99 + snapshot.utilizationRate * 0.015, 0.98, 1.02);
}

export function preferentialUtilizationWorldEvent(
  snapshot: GTELPreferentialUtilizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'high' && snapshot.band !== 'saturated') return null;
  if (snapshot.activeAgreementCount < 1) return null;
  return {
    id: `gtel_preferential_${turn}`,
    turn,
    kind: 'trade',
    title: 'Preferential FTA lanes filling',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function preferentialUtilizationGiNotes(
  utilization: GTELPreferentialUtilizationSnapshot | null | undefined,
): string[] {
  if (!utilization) return [];
  return [
    `Preferential FTA utilisation: ${utilization.band.replace(/_/g, ' ')} (${Math.round(utilization.utilizationRate * 100)}%).`,
    utilization.summary,
  ];
}


// --- source: trade-enforcement-intensity.ts ---
  GTELPartnerId,
  GTELPersisted,
  GTELTradeComplianceRecord,
  GTELTradeEnforcementSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeEnforcementBand = GTELTradeEnforcementSnapshot['band'];

function enforcementBand(intensity: number): GTELTradeEnforcementBand {
  if (intensity >= 0.72) return 'sweep';
  if (intensity >= 0.48) return 'intensive';
  if (intensity >= 0.28) return 'active';
  return 'light';
}

export function sanitizeEnforcementIntensitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.26), 0.08, 0.88);
}

export function createEmptyTradeEnforcementSnapshot(): GTELTradeEnforcementSnapshot {
  return {
    intensity: 0.26,
    band: 'light',
    probeLoad: 0.05,
    clearanceDelayTurns: 0,
    summary: 'Customs enforcement is at routine inspection levels.',
  };
}

export function advanceEnforcementIntensitySmoothing(
  persisted: GTELPersisted,
  rawIntensity: number,
): GTELPersisted {
  const prev = sanitizeEnforcementIntensitySmoothing(persisted.enforcementIntensitySmoothing);
  const next = gtelClamp(prev * 0.71 + gtelClamp(rawIntensity, 0.08, 0.88) * 0.29, 0.08, 0.88);
  return { ...persisted, enforcementIntensitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeEnforcementSnapshot(input: {
  openDisputeCount: number;
  tradeCompliance: GTELTradeComplianceRecord;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeEnforcementSnapshot; persisted: GTELPersisted } {
  const complianceGap =
    input.tradeCompliance.band === 'critical'
      ? 0.28
      : input.tradeCompliance.band === 'weak'
        ? 0.18
        : input.tradeCompliance.band === 'adequate'
          ? 0.08
          : 0.03;
  const disputeLoad = gtelClamp(input.openDisputeCount * 0.12, 0, 0.36);
  const retaliationLoad =
    input.tradeRetaliation.band === 'escalating'
      ? 0.2
      : input.tradeRetaliation.band === 'active'
        ? 0.12
        : input.tradeRetaliation.band === 'watch'
          ? 0.05
          : 0.02;
  const reconciliationRelief =
    input.tradeReconciliation.band === 'settled'
      ? 0.14
      : input.tradeReconciliation.band === 'substantive'
        ? 0.08
        : input.tradeReconciliation.band === 'procedural'
          ? 0.04
          : 0;
  const rawIntensity = gtelClamp(
    0.14 + complianceGap + disputeLoad + retaliationLoad - reconciliationRelief,
    0.08,
    0.88,
  );
  const persisted = advanceEnforcementIntensitySmoothing(input.persisted, rawIntensity);
  const intensity = sanitizeEnforcementIntensitySmoothing(persisted.enforcementIntensitySmoothing);
  const band = enforcementBand(intensity);
  const probeLoad = gtelClamp(0.04 + intensity * 0.22, 0.04, 0.26);
  const clearanceDelayTurns =
    band === 'sweep' ? 2 : band === 'intensive' ? 1 : band === 'active' ? 1 : 0;

  const summary =
    band === 'sweep'
      ? 'Partner customs agencies are running sweeping compliance probes on export declarations.'
      : band === 'intensive'
        ? 'Rules-of-origin audits and document checks are delaying several export lanes.'
        : band === 'active'
          ? 'Enforcement activity is elevated but still targeted rather than economy-wide.'
          : 'Customs enforcement is at routine inspection levels.';

  return {
    snapshot: {
      intensity: Math.round(intensity * 1000) / 1000,
      band,
      probeLoad: Math.round(probeLoad * 1000) / 1000,
      clearanceDelayTurns,
      summary,
    },
    persisted,
  };
}

export function deriveEnforcementPartnerModifiers(snapshot: GTELTradeEnforcementSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'light') {
    return { partnerDeltas, domesticStress: 0 };
  }
  const penalty =
    snapshot.band === 'sweep' ? -0.06 : snapshot.band === 'intensive' ? -0.04 : -0.02;
  (['asia_pacific', 'europe', 'north_america', 'india_ocean'] as GTELPartnerId[]).forEach(id => {
    partnerDeltas[id] = penalty;
  });
  const domesticStress =
    snapshot.band === 'sweep'
      ? gtelClamp(snapshot.intensity * 0.1, 0.04, 0.09)
      : snapshot.band === 'intensive'
        ? gtelClamp(snapshot.intensity * 0.07, 0.02, 0.06)
        : gtelClamp(snapshot.intensity * 0.04, 0, 0.04);
  return { partnerDeltas, domesticStress };
}

export function enforcementExportScale(snapshot: GTELTradeEnforcementSnapshot): number {
  if (snapshot.band === 'light') return gtelClamp(1 - snapshot.probeLoad * 0.08, 0.97, 1);
  if (snapshot.band === 'sweep') return gtelClamp(0.86 + (1 - snapshot.intensity) * 0.08, 0.82, 0.9);
  if (snapshot.band === 'intensive') return gtelClamp(0.9 + (1 - snapshot.intensity) * 0.06, 0.86, 0.94);
  return gtelClamp(0.94 + (1 - snapshot.intensity) * 0.04, 0.9, 0.98);
}

export function tradeEnforcementWorldEvent(
  snapshot: GTELTradeEnforcementSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'intensive' && snapshot.band !== 'sweep') return null;
  if (snapshot.intensity < 0.45) return null;
  return {
    id: `gtel_enforcement_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade enforcement surge',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function tradeEnforcementGiNotes(
  enforcement: GTELTradeEnforcementSnapshot | null | undefined,
): string[] {
  if (!enforcement) return [];
  return [
    `Trade enforcement: ${enforcement.band} (${Math.round(enforcement.intensity * 100)}% intensity).`,
    enforcement.summary,
  ];
}


// --- source: export-credit-insurance-stack.ts ---
  GTELMaritimeRiskSnapshot,
  GTELPersisted,
  GTELExportInsuranceStackSnapshot,
  GTELTradeEnforcementSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELExportInsuranceStackBand = GTELExportInsuranceStackSnapshot['band'];

function stackBand(composite: number): GTELExportInsuranceStackBand {
  if (composite >= 0.78) return 'robust';
  if (composite >= 0.58) return 'adequate';
  if (composite >= 0.38) return 'strained';
  return 'impaired';
}

export function sanitizeExportInsuranceStackSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.56), 0.22, 0.92);
}

export function createEmptyExportInsuranceStackSnapshot(): GTELExportInsuranceStackSnapshot {
  return {
    compositeScore: 0.56,
    band: 'adequate',
    blendedPremium: 0.1,
    creditHeadroom: 0.62,
    summary: 'Export credit and marine insurance markets are broadly aligned.',
  };
}

export function advanceExportInsuranceStackSmoothing(
  persisted: GTELPersisted,
  rawComposite: number,
): GTELPersisted {
  const prev = sanitizeExportInsuranceStackSmoothing(persisted.exportInsuranceStackSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawComposite, 0.22, 0.92) * 0.28, 0.22, 0.92);
  return { ...persisted, exportInsuranceStackSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeExportInsuranceStackSnapshot(input: {
  tradeFinance: GTELTradeFinanceSnapshot;
  maritimeRisk: GTELMaritimeRiskSnapshot;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELExportInsuranceStackSnapshot; persisted: GTELPersisted } {
  const financeLift = gtelClamp(input.tradeFinance.availabilityScore * 0.42, 0.05, 0.38);
  const maritimeDrag = gtelClamp(input.maritimeRisk.premiumIndex * 0.28 + input.maritimeRisk.insuranceLoad * 0.12, 0, 0.32);
  const enforcementDrag = gtelClamp(input.tradeEnforcement.probeLoad * 0.35 + input.tradeEnforcement.intensity * 0.08, 0, 0.22);
  const rawComposite = gtelClamp(0.38 + financeLift - maritimeDrag - enforcementDrag, 0.22, 0.92);
  const persisted = advanceExportInsuranceStackSmoothing(input.persisted, rawComposite);
  const compositeScore = sanitizeExportInsuranceStackSmoothing(persisted.exportInsuranceStackSmoothing);
  const band = stackBand(compositeScore);
  const blendedPremium = gtelClamp(
    input.tradeFinance.financingPremium * 0.45 +
      input.maritimeRisk.insuranceLoad * 0.35 +
      input.tradeEnforcement.probeLoad * 0.2,
    0.04,
    0.48,
  );
  const creditHeadroom = gtelClamp(
    compositeScore * 0.55 + input.tradeFinance.availabilityScore * 0.35 - blendedPremium * 0.15,
    0.18,
    0.88,
  );

  const summary =
    band === 'robust'
      ? 'Export credit insurers and marine underwriters are offering stacked cover without punitive loadings.'
      : band === 'impaired'
        ? 'Stacked export credit and war-risk premiums are choking new shipment declarations.'
        : band === 'strained'
          ? 'Blended insurance and export finance premiums are squeezing marginal export lanes.'
          : 'Export credit and marine insurance markets are broadly aligned.';

  return {
    snapshot: {
      compositeScore: Math.round(compositeScore * 1000) / 1000,
      band,
      blendedPremium: Math.round(blendedPremium * 1000) / 1000,
      creditHeadroom: Math.round(creditHeadroom * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function exportInsuranceStackExportScale(snapshot: GTELExportInsuranceStackSnapshot): number {
  if (snapshot.band === 'robust') return gtelClamp(1 + snapshot.creditHeadroom * 0.04, 1, 1.05);
  if (snapshot.band === 'impaired') return gtelClamp(0.84 + snapshot.compositeScore * 0.08, 0.8, 0.9);
  if (snapshot.band === 'strained') return gtelClamp(0.9 + snapshot.compositeScore * 0.06, 0.86, 0.96);
  return gtelClamp(0.96 + snapshot.compositeScore * 0.03, 0.92, 1.02);
}

export function exportInsuranceStackDomesticStress(snapshot: GTELExportInsuranceStackSnapshot): number {
  if (snapshot.band === 'impaired') return gtelClamp((0.55 - snapshot.compositeScore) * 0.12, 0.03, 0.08);
  if (snapshot.band === 'strained') return gtelClamp((0.5 - snapshot.compositeScore) * 0.08, 0, 0.05);
  return 0;
}

export function exportInsuranceStackWorldEvent(
  snapshot: GTELExportInsuranceStackSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'strained' && snapshot.band !== 'impaired') return null;
  if (snapshot.blendedPremium < 0.18) return null;
  return {
    id: `gtel_insurance_stack_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export insurance stack repricing',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'WA'],
  };
}

export function exportInsuranceStackGiNotes(
  stack: GTELExportInsuranceStackSnapshot | null | undefined,
): string[] {
  if (!stack) return [];
  return [
    `Export credit insurance stack: ${stack.band} (${Math.round(stack.compositeScore * 100)}% composite).`,
    stack.summary,
  ];
}


// --- source: partner-access-restoration.ts ---
  GTELPartnerId,
  GTELPersisted,
  GTELPartnerAccessRestorationSnapshot,
  GTELTradeDeescalationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELPartnerAccessRestorationBand = GTELPartnerAccessRestorationSnapshot['band'];

function restorationBand(momentum: number): GTELPartnerAccessRestorationBand {
  if (momentum >= 0.72) return 'reopened';
  if (momentum >= 0.52) return 'recovering';
  if (momentum >= 0.32) return 'partial';
  return 'stalled';
}

export function sanitizeAccessRestorationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.3), 0.1, 0.9);
}

export function createEmptyPartnerAccessRestorationSnapshot(): GTELPartnerAccessRestorationSnapshot {
  return {
    momentum: 0.3,
    band: 'stalled',
    restoredPartnerIds: [],
    accessRecoveryIndex: 0,
    summary: 'Partner gate restoration tracks have not yet reopened export lanes.',
  };
}

export function advanceAccessRestorationSmoothing(
  persisted: GTELPersisted,
  rawMomentum: number,
): GTELPersisted {
  const prev = sanitizeAccessRestorationSmoothing(persisted.accessRestorationSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawMomentum, 0.1, 0.9) * 0.27, 0.1, 0.9);
  return { ...persisted, accessRestorationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computePartnerAccessRestorationSnapshot(input: {
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELPartnerAccessRestorationSnapshot; persisted: GTELPersisted } {
  const deescalationLift =
    input.tradeDeescalation.band === 'breakthrough'
      ? 0.26
      : input.tradeDeescalation.band === 'warming'
        ? 0.16
        : input.tradeDeescalation.band === 'thawing'
          ? 0.08
          : 0.02;
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.22
      : input.tradeReconciliation.band === 'substantive'
        ? 0.14
        : input.tradeReconciliation.band === 'procedural'
          ? 0.06
          : 0;
  const attenuationLift = gtelClamp(input.tradeDeescalation.retaliationAttenuation * 0.85, 0, 0.12);
  const rawMomentum = gtelClamp(
    0.2 + deescalationLift + reconciliationLift + attenuationLift,
    0.1,
    0.9,
  );
  const persisted = advanceAccessRestorationSmoothing(input.persisted, rawMomentum);
  const momentum = sanitizeAccessRestorationSmoothing(persisted.accessRestorationSmoothing);
  const band = restorationBand(momentum);

  const restoredPartnerIds: GTELPartnerId[] = [];
  const cooling = new Set(input.tradeDeescalation.coolingPartnerIds);
  const reconciled = new Set(input.tradeReconciliation.reconciledPartnerIds);
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    if (momentum > 0.38 && (cooling.has(p.id) || reconciled.has(p.id))) {
      restoredPartnerIds.push(p.id);
    }
  });

  const accessRecoveryIndex =
    band === 'reopened'
      ? gtelClamp(momentum * 0.14 + restoredPartnerIds.length * 0.03, 0.04, 0.18)
      : band === 'recovering'
        ? gtelClamp(momentum * 0.1 + restoredPartnerIds.length * 0.025, 0.02, 0.12)
        : band === 'partial'
          ? gtelClamp(momentum * 0.06, 0, 0.06)
          : 0;

  const summary =
    band === 'reopened'
      ? 'Restoration panels are reopening partner gates on previously restricted export lanes.'
      : band === 'recovering'
        ? 'Confidence measures are restoring bilateral access on priority partner markets.'
        : band === 'partial'
          ? 'Limited partner access restoration is underway but remains fragile.'
          : 'Partner gate restoration tracks have not yet reopened export lanes.';

  return {
    snapshot: {
      momentum: Math.round(momentum * 1000) / 1000,
      band,
      restoredPartnerIds: restoredPartnerIds.slice(0, 4),
      accessRecoveryIndex: Math.round(accessRecoveryIndex * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function deriveAccessRestorationPartnerModifiers(snapshot: GTELPartnerAccessRestorationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStressRelief: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'stalled') {
    return { partnerDeltas, domesticStressRelief: 0 };
  }
  const lift =
    snapshot.band === 'reopened' ? 0.07 : snapshot.band === 'recovering' ? 0.05 : 0.03;
  snapshot.restoredPartnerIds.forEach(id => {
    partnerDeltas[id] = gtelNum(partnerDeltas[id], 0) + lift;
  });
  const domesticStressRelief =
    snapshot.band === 'reopened'
      ? gtelClamp(snapshot.accessRecoveryIndex * 0.35, 0, 0.05)
      : snapshot.band === 'recovering'
        ? gtelClamp(snapshot.accessRecoveryIndex * 0.28, 0, 0.035)
        : gtelClamp(snapshot.accessRecoveryIndex * 0.2, 0, 0.02);
  return { partnerDeltas, domesticStressRelief };
}

export function partnerAccessRestorationWorldEvent(
  snapshot: GTELPartnerAccessRestorationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'recovering' && snapshot.band !== 'reopened') return null;
  if (snapshot.restoredPartnerIds.length < 1) return null;
  return {
    id: `gtel_access_restore_${turn}`,
    turn,
    kind: 'diplomacy',
    title: 'Partner access restoration',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'QLD'],
  };
}

export function partnerAccessRestorationGiNotes(
  restoration: GTELPartnerAccessRestorationSnapshot | null | undefined,
): string[] {
  if (!restoration) return [];
  return [
    `Partner access restoration: ${restoration.band.replace(/_/g, ' ')} (${Math.round(restoration.momentum * 100)}% momentum).`,
    restoration.summary,
  ];
}


// --- source: trade-corridor-resilience.ts ---
  GTELLogisticsStress,
  GTELMaritimeRiskSnapshot,
  GTELMarketDiversificationSnapshot,
  GTELPersisted,
  GTELSupplyChainResilienceSnapshot,
  GTELTradeCorridorResilienceSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeCorridorBand = GTELTradeCorridorResilienceSnapshot['band'];

function corridorBand(score: number): GTELTradeCorridorBand {
  if (score >= 0.74) return 'robust';
  if (score >= 0.52) return 'stable';
  if (score >= 0.34) return 'fragile';
  return 'disrupted';
}

export function sanitizeTradeCorridorSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.54), 0.2, 0.9);
}

export function createEmptyTradeCorridorResilienceSnapshot(): GTELTradeCorridorResilienceSnapshot {
  return {
    score: 0.54,
    band: 'stable',
    chokepointLoad: 0.22,
    rerouteCapacity: 0.58,
    summary: 'Major export corridors are operating with normal redundancy.',
  };
}

export function advanceTradeCorridorSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeTradeCorridorSmoothing(persisted.tradeCorridorSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawScore, 0.2, 0.9) * 0.28, 0.2, 0.9);
  return { ...persisted, tradeCorridorSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeCorridorResilienceSnapshot(input: {
  logistics: GTELLogisticsStress;
  maritimeRisk: GTELMaritimeRiskSnapshot;
  supplyChainResilience: GTELSupplyChainResilienceSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeCorridorResilienceSnapshot; persisted: GTELPersisted } {
  const logisticsLift =
    input.logistics.band === 'fluid'
      ? 0.18
      : input.logistics.band === 'watch'
        ? 0.1
        : input.logistics.band === 'tight'
          ? 0.04
          : -0.06;
  const maritimeLift = gtelClamp(input.maritimeRisk.laneReliability * 0.22 - input.maritimeRisk.premiumIndex * 0.12, -0.1, 0.14);
  const resilienceLift = gtelClamp(input.supplyChainResilience.score * 0.28, 0.05, 0.22);
  const diversificationLift =
    input.marketDiversification.band === 'well_spread'
      ? 0.1
      : input.marketDiversification.band === 'balanced'
        ? 0.05
        : input.marketDiversification.band === 'concentrated'
          ? -0.04
          : -0.08;
  const rawScore = gtelClamp(
    0.42 + logisticsLift + maritimeLift + resilienceLift + diversificationLift - input.logistics.networkStrain * 0.08,
    0.2,
    0.9,
  );
  const persisted = advanceTradeCorridorSmoothing(input.persisted, rawScore);
  const score = sanitizeTradeCorridorSmoothing(persisted.tradeCorridorSmoothing);
  const band = corridorBand(score);
  const chokepointLoad = gtelClamp(
    (input.supplyChainResilience.chokepointCount / 6) * 0.18 +
      (input.logistics.band === 'congested' ? 0.22 : 0.08) +
      input.maritimeRisk.premiumIndex * 0.1,
    0.08,
    0.62,
  );
  const rerouteCapacity = gtelClamp(
    score * 0.45 + input.marketDiversification.effectivePartnerCount * 0.04 + input.maritimeRisk.laneReliability * 0.12,
    0.22,
    0.88,
  );

  const summary =
    band === 'robust'
      ? 'Export corridors retain strong redundancy — reroutes absorb lane shocks without rationing.'
      : band === 'disrupted'
        ? 'Multiple corridor chokepoints are binding; planners should expect shipment delays.'
        : band === 'fragile'
          ? 'Corridor redundancy is thin; minor lane shocks could cascade into export rationing.'
          : 'Major export corridors are operating with normal redundancy.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      chokepointLoad: Math.round(chokepointLoad * 1000) / 1000,
      rerouteCapacity: Math.round(rerouteCapacity * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeCorridorExportScale(snapshot: GTELTradeCorridorResilienceSnapshot): number {
  if (snapshot.band === 'robust') return gtelClamp(1 + snapshot.rerouteCapacity * 0.03, 1, 1.04);
  if (snapshot.band === 'disrupted') return gtelClamp(0.82 + snapshot.score * 0.08, 0.78, 0.88);
  if (snapshot.band === 'fragile') return gtelClamp(0.9 + snapshot.score * 0.06, 0.86, 0.95);
  return gtelClamp(0.96 + snapshot.score * 0.03, 0.92, 1.02);
}

export function tradeCorridorDomesticStress(snapshot: GTELTradeCorridorResilienceSnapshot): number {
  if (snapshot.band === 'disrupted') return gtelClamp(snapshot.chokepointLoad * 0.14, 0.04, 0.09);
  if (snapshot.band === 'fragile') return gtelClamp(snapshot.chokepointLoad * 0.08, 0.02, 0.06);
  return 0;
}

export function tradeCorridorWorldEvent(
  snapshot: GTELTradeCorridorResilienceSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'fragile' && snapshot.band !== 'disrupted') return null;
  if (snapshot.chokepointLoad < 0.35) return null;
  return {
    id: `gtel_corridor_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export corridor stress',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function tradeCorridorGiNotes(
  corridor: GTELTradeCorridorResilienceSnapshot | null | undefined,
): string[] {
  if (!corridor) return [];
  return [
    `Trade corridor resilience: ${corridor.band} (${Math.round(corridor.score * 100)}% score).`,
    corridor.summary,
  ];
}


// --- source: sanctions-spillover-depth.ts ---
  GTELPartnerId,
  GTELPersisted,
  GTELSanctionsSpilloverSnapshot,
  GTELTradeEnforcementSnapshot,
  GTELTradeRetaliationSnapshot,
  GTELTurnResult,
  SanctionTier,
} from './types.ts';

export type GTELSanctionsSpilloverBand = GTELSanctionsSpilloverSnapshot['band'];

function spilloverBand(intensity: number): GTELSanctionsSpilloverBand {
  if (intensity >= 0.68) return 'pervasive';
  if (intensity >= 0.44) return 'broad';
  if (intensity >= 0.24) return 'localized';
  return 'contained';
}

export function sanitizeSanctionsSpilloverSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.24), 0.08, 0.88);
}

export function createEmptySanctionsSpilloverSnapshot(): GTELSanctionsSpilloverSnapshot {
  return {
    intensity: 0.24,
    band: 'localized',
    activeTierCount: 0,
    spilloverPartnerIds: [],
    summary: 'Sanctions spillover remains localized to directly targeted partners.',
  };
}

export function advanceSanctionsSpilloverSmoothing(
  persisted: GTELPersisted,
  rawIntensity: number,
): GTELPersisted {
  const prev = sanitizeSanctionsSpilloverSmoothing(persisted.sanctionsSpilloverSmoothing);
  const next = gtelClamp(prev * 0.7 + gtelClamp(rawIntensity, 0.08, 0.88) * 0.3, 0.08, 0.88);
  return { ...persisted, sanctionsSpilloverSmoothing: Math.round(next * 1000) / 1000 };
}

function tierWeight(tier: SanctionTier | undefined): number {
  if (!tier || tier === 'none') return 0;
  if (tier === 'comprehensive') return 0.28;
  if (tier === 'sectoral') return 0.16;
  return 0.08;
}

export function computeSanctionsSpilloverSnapshot(input: {
  activeTiers: Partial<Record<GTELPartnerId, SanctionTier>>;
  tradeRetaliation: GTELTradeRetaliationSnapshot;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELSanctionsSpilloverSnapshot; persisted: GTELPersisted } {
  const tiers = Object.entries(input.activeTiers || {}) as Array<[GTELPartnerId, SanctionTier]>;
  const activeTierCount = tiers.filter(([, t]) => t && t !== 'none').length;
  const tierIntensity = tiers.reduce((acc, [, t]) => acc + tierWeight(t), 0);
  const retaliationLoad =
    input.tradeRetaliation.band === 'escalating'
      ? 0.18
      : input.tradeRetaliation.band === 'active'
        ? 0.12
        : 0.05;
  const enforcementLoad = gtelClamp(input.tradeEnforcement.intensity * 0.14, 0, 0.16);
  const rawIntensity = gtelClamp(tierIntensity + retaliationLoad + enforcementLoad, 0.08, 0.88);
  const persisted = advanceSanctionsSpilloverSmoothing(input.persisted, rawIntensity);
  const intensity = sanitizeSanctionsSpilloverSmoothing(persisted.sanctionsSpilloverSmoothing);
  const band = spilloverBand(intensity);

  const spilloverPartnerIds: GTELPartnerId[] = [];
  tiers.forEach(([id, t]) => {
    if (t && t !== 'none' && id !== 'domestic_premium') spilloverPartnerIds.push(id);
  });
  input.tradeRetaliation.targetedPartnerIds.forEach(id => {
    if (!spilloverPartnerIds.includes(id)) spilloverPartnerIds.push(id);
  });

  const summary =
    band === 'pervasive'
      ? 'Sanctions spillover is pervasive — secondary partners are tightening compliance on Australian exports.'
      : band === 'broad'
        ? 'Sanctions are spilling into adjacent partner markets beyond the primary targets.'
        : band === 'contained'
          ? 'Sanctions spillover remains contained to directly targeted partners.'
          : 'Localized sanctions spillover is elevating scrutiny on a handful of partner lanes.';

  return {
    snapshot: {
      intensity: Math.round(intensity * 1000) / 1000,
      band,
      activeTierCount,
      spilloverPartnerIds: spilloverPartnerIds.slice(0, 5),
      summary,
    },
    persisted,
  };
}

export function deriveSanctionsSpilloverPartnerModifiers(snapshot: GTELSanctionsSpilloverSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'contained') {
    return { partnerDeltas, domesticStress: 0 };
  }
  const penalty =
    snapshot.band === 'pervasive' ? -0.07 : snapshot.band === 'broad' ? -0.05 : -0.03;
  snapshot.spilloverPartnerIds.forEach(id => {
    partnerDeltas[id] = gtelNum(partnerDeltas[id], 0) + penalty;
  });
  const domesticStress =
    snapshot.band === 'pervasive'
      ? gtelClamp(snapshot.intensity * 0.1, 0.04, 0.09)
      : snapshot.band === 'broad'
        ? gtelClamp(snapshot.intensity * 0.07, 0.02, 0.06)
        : gtelClamp(snapshot.intensity * 0.04, 0, 0.04);
  return { partnerDeltas, domesticStress };
}

export function sanctionsSpilloverExportScale(snapshot: GTELSanctionsSpilloverSnapshot): number {
  if (snapshot.band === 'contained') return gtelClamp(1 - snapshot.intensity * 0.02, 0.97, 1);
  if (snapshot.band === 'pervasive') return gtelClamp(0.84 + (1 - snapshot.intensity) * 0.06, 0.8, 0.9);
  if (snapshot.band === 'broad') return gtelClamp(0.9 + (1 - snapshot.intensity) * 0.05, 0.86, 0.95);
  return gtelClamp(0.94 + (1 - snapshot.intensity) * 0.04, 0.9, 0.98);
}

export function sanctionsSpilloverWorldEvent(
  snapshot: GTELSanctionsSpilloverSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broad' && snapshot.band !== 'pervasive') return null;
  if (snapshot.activeTierCount < 1) return null;
  return {
    id: `gtel_sanctions_spill_${turn}`,
    turn,
    kind: 'sanction',
    title: 'Sanctions spillover widening',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function sanctionsSpilloverGiNotes(
  spillover: GTELSanctionsSpilloverSnapshot | null | undefined,
): string[] {
  if (!spillover) return [];
  return [
    `Sanctions spillover: ${spillover.band} (${Math.round(spillover.intensity * 100)}% intensity).`,
    spillover.summary,
  ];
}


// --- source: trade-fx-hedging.ts ---
  GTELForeignExchangeSnapshot,
  GTELPersisted,
  GTELTermsOfTradeSnapshot,
  GTELTradeFinanceSnapshot,
  GTELTradeFxHedgingSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeFxHedgingBand = GTELTradeFxHedgingSnapshot['band'];

function hedgingBand(effectiveness: number): GTELTradeFxHedgingBand {
  if (effectiveness >= 0.74) return 'well_hedged';
  if (effectiveness >= 0.52) return 'balanced';
  if (effectiveness >= 0.32) return 'exposed';
  return 'unhedged';
}

export function sanitizeTradeFxHedgingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.5), 0.18, 0.92);
}

export function createEmptyTradeFxHedgingSnapshot(): GTELTradeFxHedgingSnapshot {
  return {
    effectiveness: 0.5,
    band: 'balanced',
    passThroughBuffer: 0.08,
    termsShield: 0.12,
    summary: 'FX and terms hedging are providing moderate pass-through buffers.',
  };
}

export function advanceTradeFxHedgingSmoothing(
  persisted: GTELPersisted,
  rawEffectiveness: number,
): GTELPersisted {
  const prev = sanitizeTradeFxHedgingSmoothing(persisted.tradeFxHedgingSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawEffectiveness, 0.18, 0.92) * 0.27, 0.18, 0.92);
  return { ...persisted, tradeFxHedgingSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeFxHedgingSnapshot(input: {
  foreignExchange: GTELForeignExchangeSnapshot;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  tradeFinance: GTELTradeFinanceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeFxHedgingSnapshot; persisted: GTELPersisted } {
  const fxLift =
    input.foreignExchange.band === 'supportive'
      ? 0.16
      : input.foreignExchange.band === 'neutral'
        ? 0.08
        : input.foreignExchange.band === 'stress'
          ? -0.06
          : -0.12;
  const termsLift =
    input.termsOfTrade.band === 'favorable'
      ? 0.14
      : input.termsOfTrade.band === 'neutral'
        ? 0.06
        : input.termsOfTrade.band === 'unfavorable'
          ? -0.05
          : -0.1;
  const financeLift = gtelClamp((input.tradeFinance.availabilityScore - 0.55) * 0.22, -0.08, 0.12);
  const rawEffectiveness = gtelClamp(0.42 + fxLift + termsLift + financeLift, 0.18, 0.92);
  const persisted = advanceTradeFxHedgingSmoothing(input.persisted, rawEffectiveness);
  const effectiveness = sanitizeTradeFxHedgingSmoothing(persisted.tradeFxHedgingSmoothing);
  const band = hedgingBand(effectiveness);
  const passThroughBuffer = gtelClamp(
    effectiveness * 0.12 + (input.foreignExchange.band === 'crisis' ? -0.04 : 0.02),
    0.02,
    0.2,
  );
  const termsShield = gtelClamp(effectiveness * 0.14 + (input.termsOfTrade.index > 1 ? 0.03 : -0.02), 0.02, 0.22);

  const summary =
    band === 'well_hedged'
      ? 'Treasury hedges are absorbing FX and terms shocks before they hit export quotes.'
      : band === 'unhedged'
        ? 'Minimal hedging — FX and terms swings are passing straight into export pricing.'
        : band === 'exposed'
          ? 'Hedging books are thin; terms and FX moves are leaking into commodity quotes.'
          : 'FX and terms hedging are providing moderate pass-through buffers.';

  return {
    snapshot: {
      effectiveness: Math.round(effectiveness * 1000) / 1000,
      band,
      passThroughBuffer: Math.round(passThroughBuffer * 1000) / 1000,
      termsShield: Math.round(termsShield * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeFxHedgingHouseholdModifier(snapshot: GTELTradeFxHedgingSnapshot): number {
  if (snapshot.band === 'well_hedged') return gtelClamp(snapshot.passThroughBuffer * 0.15, 0, 0.04);
  if (snapshot.band === 'unhedged') return gtelClamp(-snapshot.passThroughBuffer * 0.2, -0.06, 0);
  if (snapshot.band === 'exposed') return gtelClamp(-snapshot.passThroughBuffer * 0.12, -0.04, 0);
  return 0;
}

export function tradeFxHedgingExportScale(snapshot: GTELTradeFxHedgingSnapshot): number {
  if (snapshot.band === 'well_hedged') return gtelClamp(1 + snapshot.effectiveness * 0.02, 1, 1.03);
  if (snapshot.band === 'unhedged') return gtelClamp(0.94 + snapshot.effectiveness * 0.04, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.effectiveness * 0.03, 0.93, 1.01);
}

export function tradeFxHedgingWorldEvent(
  snapshot: GTELTradeFxHedgingSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'exposed' && snapshot.band !== 'unhedged') return null;
  if (snapshot.effectiveness > 0.38) return null;
  return {
    id: `gtel_fx_hedge_${turn}`,
    turn,
    kind: 'trade',
    title: 'FX hedging gap widening',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'QLD'],
  };
}

export function tradeFxHedgingGiNotes(hedging: GTELTradeFxHedgingSnapshot | null | undefined): string[] {
  if (!hedging) return [];
  return [
    `Trade FX hedging: ${hedging.band.replace(/_/g, ' ')} (${Math.round(hedging.effectiveness * 100)}% effective).`,
    hedging.summary,
  ];
}


// --- source: import-lane-pressure.ts ---
  GTELImportDependencySnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELImportLanePressureSnapshot,
  GTELTradeEnforcementSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELImportLanePressureBand = GTELImportLanePressureSnapshot['band'];

function lanePressureBand(load: number): GTELImportLanePressureBand {
  if (load >= 0.72) return 'gridlocked';
  if (load >= 0.52) return 'congested';
  if (load >= 0.32) return 'busy';
  return 'fluid';
}

export function sanitizeImportLanePressureSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.38), 0.12, 0.88);
}

export function createEmptyImportLanePressureSnapshot(): GTELImportLanePressureSnapshot {
  return {
    load: 0.38,
    band: 'busy',
    clearanceBacklog: 0.12,
    consumerPricePassThrough: 0.06,
    summary: 'Import arrival lanes are busy but clearing within normal windows.',
  };
}

export function advanceImportLanePressureSmoothing(
  persisted: GTELPersisted,
  rawLoad: number,
): GTELPersisted {
  const prev = sanitizeImportLanePressureSmoothing(persisted.importLanePressureSmoothing);
  const next = gtelClamp(prev * 0.71 + gtelClamp(rawLoad, 0.12, 0.88) * 0.29, 0.12, 0.88);
  return { ...persisted, importLanePressureSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeImportLanePressureSnapshot(input: {
  importDependency: GTELImportDependencySnapshot;
  logistics: GTELLogisticsStress;
  tradeEnforcement: GTELTradeEnforcementSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELImportLanePressureSnapshot; persisted: GTELPersisted } {
  const dependencyLoad =
    input.importDependency.band === 'critical'
      ? 0.24
      : input.importDependency.band === 'elevated'
        ? 0.16
        : input.importDependency.band === 'moderate'
          ? 0.08
          : 0.04;
  const logisticsLoad =
    input.logistics.band === 'congested'
      ? 0.22
      : input.logistics.band === 'tight'
        ? 0.14
        : input.logistics.band === 'watch'
          ? 0.06
          : 0.02;
  const enforcementLoad = gtelClamp(input.tradeEnforcement.probeLoad * 0.45 + input.tradeEnforcement.clearanceDelayTurns * 0.04, 0, 0.18);
  const rawLoad = gtelClamp(dependencyLoad + logisticsLoad + enforcementLoad + 0.08, 0.12, 0.88);
  const persisted = advanceImportLanePressureSmoothing(input.persisted, rawLoad);
  const load = sanitizeImportLanePressureSmoothing(persisted.importLanePressureSmoothing);
  const band = lanePressureBand(load);
  const clearanceBacklog = gtelClamp(load * 0.22 + enforcementLoad * 0.15, 0.06, 0.38);
  const consumerPricePassThrough = gtelClamp(
    load * 0.12 + (input.importDependency.band === 'critical' ? 0.06 : 0.02),
    0.02,
    0.22,
  );

  const summary =
    band === 'gridlocked'
      ? 'Import arrival lanes are gridlocked — clearance backlogs are feeding domestic price pressure.'
      : band === 'congested'
        ? 'Port import slots are congested; consumer goods pass-through is elevated.'
        : band === 'fluid'
          ? 'Import lanes are fluid with minimal clearance backlog.'
          : 'Import arrival lanes are busy but clearing within normal windows.';

  return {
    snapshot: {
      load: Math.round(load * 1000) / 1000,
      band,
      clearanceBacklog: Math.round(clearanceBacklog * 1000) / 1000,
      consumerPricePassThrough: Math.round(consumerPricePassThrough * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function importLanePressureDomesticStress(snapshot: GTELImportLanePressureSnapshot): number {
  if (snapshot.band === 'gridlocked') return gtelClamp(snapshot.consumerPricePassThrough * 0.35, 0.04, 0.1);
  if (snapshot.band === 'congested') return gtelClamp(snapshot.consumerPricePassThrough * 0.25, 0.02, 0.07);
  if (snapshot.band === 'busy') return gtelClamp(snapshot.consumerPricePassThrough * 0.12, 0, 0.04);
  return 0;
}

export function importLanePressureExportScale(snapshot: GTELImportLanePressureSnapshot): number {
  if (snapshot.band === 'gridlocked') return gtelClamp(0.9 + (1 - snapshot.load) * 0.06, 0.86, 0.94);
  if (snapshot.band === 'congested') return gtelClamp(0.94 + (1 - snapshot.load) * 0.04, 0.9, 0.98);
  return gtelClamp(0.98 + (1 - snapshot.load) * 0.02, 0.96, 1.01);
}

export function importLanePressureWorldEvent(
  snapshot: GTELImportLanePressureSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'congested' && snapshot.band !== 'gridlocked') return null;
  if (snapshot.load < 0.5) return null;
  return {
    id: `gtel_import_lane_${turn}`,
    turn,
    kind: 'domestic',
    title: 'Import lane congestion',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function importLanePressureGiNotes(
  pressure: GTELImportLanePressureSnapshot | null | undefined,
): string[] {
  if (!pressure) return [];
  return [
    `Import lane pressure: ${pressure.band} (${Math.round(pressure.load * 100)}% load).`,
    pressure.summary,
  ];
}


// --- source: diplomatic-trade-coherence.ts ---
  GTELDiplomaticEngagementState,
  GTELPartnerAccessRestorationSnapshot,
  GTELPersisted,
  GTELDiplomaticTradeCoherenceSnapshot,
  GTELTradeDeescalationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELDiplomaticTradeCoherenceBand = GTELDiplomaticTradeCoherenceSnapshot['band'];

function coherenceBand(score: number): GTELDiplomaticTradeCoherenceBand {
  if (score >= 0.74) return 'aligned';
  if (score >= 0.52) return 'coordinated';
  if (score >= 0.34) return 'fragmented';
  return 'divergent';
}

export function sanitizeDiplomaticTradeCoherenceSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.48), 0.16, 0.92);
}

export function createEmptyDiplomaticTradeCoherenceSnapshot(): GTELDiplomaticTradeCoherenceSnapshot {
  return {
    score: 0.48,
    band: 'coordinated',
    trackAlignment: 0.52,
    narrativeConsistency: 0.5,
    summary: 'Diplomatic and trade tracks are moderately coordinated.',
  };
}

export function advanceDiplomaticTradeCoherenceSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeDiplomaticTradeCoherenceSmoothing(persisted.diplomaticTradeCoherenceSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawScore, 0.16, 0.92) * 0.28, 0.16, 0.92);
  return { ...persisted, diplomaticTradeCoherenceSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeDiplomaticTradeCoherenceSnapshot(input: {
  engagement: GTELDiplomaticEngagementState;
  tradeDeescalation: GTELTradeDeescalationSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  partnerAccessRestoration: GTELPartnerAccessRestorationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELDiplomaticTradeCoherenceSnapshot; persisted: GTELPersisted } {
  const activeTracks = Object.values(input.engagement.tracks || {}).filter(
    t => t && (t.band === 'active' || t.band === 'breakthrough'),
  ).length;
  const engagementLift = gtelClamp(activeTracks * 0.08 + input.engagement.summitPulse * 0.14, 0, 0.28);
  const deescalationLift =
    input.tradeDeescalation.band === 'breakthrough'
      ? 0.16
      : input.tradeDeescalation.band === 'warming'
        ? 0.1
        : 0.04;
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.14
      : input.tradeReconciliation.band === 'substantive'
        ? 0.08
        : 0.03;
  const restorationLift =
    input.partnerAccessRestoration.band === 'reopened'
      ? 0.12
      : input.partnerAccessRestoration.band === 'recovering'
        ? 0.07
        : 0.02;
  const rawScore = gtelClamp(0.32 + engagementLift + deescalationLift + reconciliationLift + restorationLift, 0.16, 0.92);
  const persisted = advanceDiplomaticTradeCoherenceSmoothing(input.persisted, rawScore);
  const score = sanitizeDiplomaticTradeCoherenceSmoothing(persisted.diplomaticTradeCoherenceSmoothing);
  const band = coherenceBand(score);
  const trackAlignment = gtelClamp(score * 0.55 + activeTracks * 0.06, 0.2, 0.88);
  const narrativeConsistency = gtelClamp(
    score * 0.5 + deescalationLift + reconciliationLift,
    0.18,
    0.9,
  );

  const summary =
    band === 'aligned'
      ? 'Diplomatic messaging and trade measures are aligned — partners see a single coherent story.'
      : band === 'divergent'
        ? 'Trade retaliation and diplomatic outreach are sending mixed signals to partners.'
        : band === 'fragmented'
          ? 'Diplomatic tracks and trade enforcement are pulling in different directions.'
          : 'Diplomatic and trade tracks are moderately coordinated.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      trackAlignment: Math.round(trackAlignment * 1000) / 1000,
      narrativeConsistency: Math.round(narrativeConsistency * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function diplomaticTradeCoherenceDomesticStressRelief(snapshot: GTELDiplomaticTradeCoherenceSnapshot): number {
  if (snapshot.band === 'aligned') return gtelClamp(snapshot.score * 0.05, 0.02, 0.045);
  if (snapshot.band === 'coordinated') return gtelClamp(snapshot.score * 0.03, 0, 0.03);
  return 0;
}

export function diplomaticTradeCoherenceExportScale(snapshot: GTELDiplomaticTradeCoherenceSnapshot): number {
  if (snapshot.band === 'aligned') return gtelClamp(1 + snapshot.trackAlignment * 0.025, 1, 1.03);
  if (snapshot.band === 'divergent') return gtelClamp(0.93 + snapshot.score * 0.05, 0.9, 0.97);
  if (snapshot.band === 'fragmented') return gtelClamp(0.96 + snapshot.score * 0.03, 0.93, 0.99);
  return gtelClamp(0.98 + snapshot.score * 0.02, 0.96, 1.02);
}

export function diplomaticTradeCoherenceWorldEvent(
  snapshot: GTELDiplomaticTradeCoherenceSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'aligned' && snapshot.band !== 'divergent') return null;
  if (snapshot.band === 'aligned' && snapshot.score < 0.72) return null;
  return {
    id: `gtel_dipl_coherence_${turn}`,
    turn,
    kind: 'diplomacy',
    title: snapshot.band === 'aligned' ? 'Diplomatic trade alignment' : 'Diplomatic trade divergence',
    summary: snapshot.summary,
    regionIds: ['ACT', 'NSW', 'VIC'],
  };
}

export function diplomaticTradeCoherenceGiNotes(
  coherence: GTELDiplomaticTradeCoherenceSnapshot | null | undefined,
): string[] {
  if (!coherence) return [];
  return [
    `Diplomatic trade coherence: ${coherence.band} (${Math.round(coherence.score * 100)}% score).`,
    coherence.summary,
  ];
}


// --- source: trade-balance-stabilization.ts ---
  GTELExportInsuranceStackSnapshot,
  GTELPersisted,
  GTELTradeBalanceSnapshot,
  GTELTradeBalanceStabilizationSnapshot,
  GTELTradeFxHedgingSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTermsOfTradeSnapshot,
  GTELTurnResult,
} from './types.ts';

export type GTELTradeBalanceStabilizationBand = GTELTradeBalanceStabilizationSnapshot['band'];

function stabilizationBand(index: number): GTELTradeBalanceStabilizationBand {
  if (index >= 0.72) return 'anchored';
  if (index >= 0.52) return 'steady';
  if (index >= 0.34) return 'volatile';
  return 'unstable';
}

export function sanitizeTradeBalanceStabilizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.2, 0.9);
}

export function createEmptyTradeBalanceStabilizationSnapshot(): GTELTradeBalanceStabilizationSnapshot {
  return {
    index: 0.52,
    band: 'steady',
    surplusSupport: 0.08,
    volatilityDampening: 0.12,
    summary: 'Trade balance adjustments are proceeding at a steady pace.',
  };
}

export function advanceTradeBalanceStabilizationSmoothing(
  persisted: GTELPersisted,
  rawIndex: number,
): GTELPersisted {
  const prev = sanitizeTradeBalanceStabilizationSmoothing(persisted.tradeBalanceStabilizationSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawIndex, 0.2, 0.9) * 0.27, 0.2, 0.9);
  return { ...persisted, tradeBalanceStabilizationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeBalanceStabilizationSnapshot(input: {
  tradeBalance: GTELTradeBalanceSnapshot;
  termsOfTrade: GTELTermsOfTradeSnapshot;
  tradeFxHedging: GTELTradeFxHedgingSnapshot;
  exportInsuranceStack: GTELExportInsuranceStackSnapshot;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeBalanceStabilizationSnapshot; persisted: GTELPersisted } {
  const surplusLift =
    input.tradeBalance.currentAccountTone === 'surplus' || input.tradeBalance.currentAccountTone === 'mild_surplus'
      ? 0.16
      : input.tradeBalance.currentAccountTone === 'deficit'
        ? -0.1
        : 0.04;
  const termsLift =
    input.termsOfTrade.band === 'favorable'
      ? 0.1
      : input.termsOfTrade.band === 'severely_unfavorable'
        ? -0.08
        : 0;
  const hedgingLift = gtelClamp((input.tradeFxHedging.effectiveness - 0.5) * 0.2, -0.06, 0.1);
  const insuranceLift =
    input.exportInsuranceStack.band === 'robust'
      ? 0.08
      : input.exportInsuranceStack.band === 'impaired'
        ? -0.1
        : 0.02;
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.08
      : input.tradeReconciliation.band === 'substantive'
        ? 0.05
        : 0;
  const rawIndex = gtelClamp(
    0.46 + surplusLift + termsLift + hedgingLift + insuranceLift + reconciliationLift,
    0.2,
    0.9,
  );
  const persisted = advanceTradeBalanceStabilizationSmoothing(input.persisted, rawIndex);
  const index = sanitizeTradeBalanceStabilizationSmoothing(persisted.tradeBalanceStabilizationSmoothing);
  const band = stabilizationBand(index);
  const surplusSupport = gtelClamp(
    (input.tradeBalance.netExportPulse > 0.08 ? 0.1 : 0.04) + surplusLift * 0.5,
    0.02,
    0.18,
  );
  const volatilityDampening = gtelClamp(
    index * 0.15 + input.tradeFxHedging.passThroughBuffer * 0.35 + reconciliationLift,
    0.04,
    0.28,
  );

  const summary =
    band === 'anchored'
      ? 'Trade balance stabilizers are anchoring the current account despite external shocks.'
      : band === 'unstable'
        ? 'Trade balance swings are outpacing hedging and reconciliation buffers.'
        : band === 'volatile'
          ? 'External terms and finance stress are making trade balance outcomes harder to predict.'
          : 'Trade balance adjustments are proceeding at a steady pace.';

  return {
    snapshot: {
      index: Math.round(index * 1000) / 1000,
      band,
      surplusSupport: Math.round(surplusSupport * 1000) / 1000,
      volatilityDampening: Math.round(volatilityDampening * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeBalanceStabilizationExportScale(snapshot: GTELTradeBalanceStabilizationSnapshot): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.surplusSupport * 0.15, 1, 1.04);
  if (snapshot.band === 'unstable') return gtelClamp(0.88 + snapshot.index * 0.08, 0.84, 0.92);
  if (snapshot.band === 'volatile') return gtelClamp(0.92 + snapshot.index * 0.06, 0.88, 0.96);
  return gtelClamp(0.97 + snapshot.index * 0.03, 0.94, 1.02);
}

export function tradeBalanceStabilizationDomesticStress(snapshot: GTELTradeBalanceStabilizationSnapshot): number {
  if (snapshot.band === 'unstable') return gtelClamp((0.5 - snapshot.index) * 0.12, 0.03, 0.08);
  if (snapshot.band === 'volatile') return gtelClamp((0.48 - snapshot.index) * 0.08, 0, 0.05);
  return 0;
}

export function tradeBalanceStabilizationWorldEvent(
  snapshot: GTELTradeBalanceStabilizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'volatile' && snapshot.band !== 'unstable') return null;
  if (snapshot.index > 0.42) return null;
  return {
    id: `gtel_balance_stab_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade balance volatility',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function tradeBalanceStabilizationGiNotes(
  stabilization: GTELTradeBalanceStabilizationSnapshot | null | undefined,
): string[] {
  if (!stabilization) return [];
  return [
    `Trade balance stabilization: ${stabilization.band} (${Math.round(stabilization.index * 100)}% index).`,
    stabilization.summary,
  ];
}


// --- source: domestic-consequences.ts ---
  GTELCommodityQuote,
  GTELDomesticCoupling,
  GTELNationalSystemsSlice,
  GTELPartnerMarket,
  RegionalDomesticImpact,
} from './types.ts';

const REGION_EXPORT_WEIGHT: Record<string, Partial<Record<string, number>>> = {
  WA: { iron_ore: 1, coal: 0.6, lng: 0.8 },
  QLD: { coal: 0.9, beef: 0.5, lng: 0.4 },
  NSW: { services: 0.7, manufacturing: 0.6, wheat: 0.4 },
  VIC: { manufacturing: 0.8, services: 0.6, beef: 0.3 },
  SA: { wheat: 0.7, manufacturing: 0.4, wine: 0.2 },
  TAS: { beef: 0.5, services: 0.3 },
  NT: { beef: 0.4, lng: 0.3 },
  ACT: { services: 0.9 },
};

function regionCommodityExposure(regionId: string, commodities: GTELCommodityQuote[]): number {
  const weights = REGION_EXPORT_WEIGHT[regionId] || { services: 0.4 };
  let exposure = 0;
  Object.entries(weights).forEach(([key, w]) => {
    const c = commodities.find(q => q.commodity === key);
    if (!c) return;
    const move = (c.effectiveIndex - c.baseIndex) / Math.max(1, c.baseIndex);
    exposure += gtelNum(w, 0) * move;
  });
  return exposure;
}

export function computeRegionalDomesticImpacts(params: {
  commodities: GTELCommodityQuote[];
  partners: GTELPartnerMarket[];
  domestic: GTELDomesticCoupling;
  nationalSystems: GTELNationalSystemsSlice | null;
  shockStress: number;
  shockRegions: string[];
}): RegionalDomesticImpact[] {
  const { commodities, partners, domestic, nationalSystems, shockStress, shockRegions } = params;
  const blockedPartners = partners.filter(p => p.access === 'blocked' || p.access === 'restricted').length;
  const networkStrain = ['critical', 'bottlenecked', 'strained'].includes(
    String(nationalSystems?.national?.trade?.condition || 'healthy'),
  );

  return AU_TRADE_REGIONS.map(regionId => {
    const exposure = regionCommodityExposure(regionId, commodities);
    const shockHit = shockRegions.includes(regionId) ? shockStress : shockStress * 0.35;
    const employmentDelta = gtelClamp(
      exposure * 0.12 + (domestic.exportSectorBoom ? 0.04 : 0) - shockHit * 0.15 - (networkStrain ? 0.03 : 0),
      -0.2,
      0.18,
    );
    const consumerPricePressure = gtelClamp(
      domestic.householdOffset * -0.5 + shockHit * 0.2 + (blockedPartners > 1 ? 0.03 : 0),
      -0.15,
      0.25,
    );
    const stabilityDelta = gtelClamp(
      -Math.abs(employmentDelta) * 0.4 - consumerPricePressure * 0.3 + (domestic.exportVsDomesticModel === 'domestically_balanced' ? 0.02 : 0),
      -0.15,
      0.08,
    );
    let narrative = 'Trade spillover is muted this turn.';
    if (employmentDelta > 0.06) narrative = 'Export premiums are supporting regional jobs.';
    else if (employmentDelta < -0.06) narrative = 'Export softness is weighing on regional employment.';
    if (consumerPricePressure > 0.08) narrative += ' Households face higher import-linked prices.';
    if (shockHit > 0.08) narrative += ' An active world shock is amplifying local stress.';

    return {
      regionId,
      employmentDelta: Math.round(employmentDelta * 1000) / 1000,
      consumerPricePressure: Math.round(consumerPricePressure * 1000) / 1000,
      stabilityDelta: Math.round(stabilityDelta * 1000) / 1000,
      narrative,
    };
  });
}

export function summarizeDomesticConsequences(impacts: RegionalDomesticImpact[]): string {
  const worst = [...impacts].sort((a, b) => a.stabilityDelta - b.stabilityDelta)[0];
  const best = [...impacts].sort((a, b) => b.employmentDelta - a.employmentDelta)[0];
  if (!worst || !best) return 'No regional domestic impacts computed.';
  return `Strongest employment lift: ${best.regionId}. Greatest stability pressure: ${worst.regionId} — ${worst.narrative}`;
}

export function aggregateDomesticStabilityPenalty(impacts: RegionalDomesticImpact[]): number {
  if (!impacts.length) return 0;
  const avg = impacts.reduce((a, i) => a + i.stabilityDelta, 0) / impacts.length;
  return gtelClamp(-avg * 10, 0, 8);
}


// --- source: household-bridge.ts ---

export function applyGlobalTradeHouseholdOverrides<T extends Record<string, any>>(inputs: T, view: GTELState | null): T {
  if (!view || inputs.enabled === false) return inputs;
  const prices: Record<string, number> = { ...(inputs.commodityPrices || {}) };
  view.commodities.forEach(c => {
    prices[c.commodity] = c.effectiveIndex;
  });
  const base = inputs.baseCommodityPrices || { ...GTEL_BASE_COMMODITY_INDEX };
  return {
    ...inputs,
    exportSectorBoom: Boolean(inputs.exportSectorBoom) || view.domestic.exportSectorBoom,
    commodityPrices: prices,
    baseCommodityPrices: base,
    transportNetworkHealth: gtelClamp(gtelNum(inputs.transportNetworkHealth, 70) + view.domestic.transportHealthDelta, 35, 100),
    existingIndustryDemandSources: [...(inputs.existingIndustryDemandSources || []), `gtel:${view.domestic.exportVsDomesticModel}`],
    regionalTradeStress: view.regionalImpacts?.map(r => `${r.regionId}:${r.stabilityDelta}`) || [],
  };
}


// --- source: trade-turn.ts ---
  GTEL_ACCESS_RANK,
  GTEL_BASE_COMMODITY_INDEX,
  GTEL_COMMODITIES,
  GTEL_COMMODITY_LABEL,
  GTEL_LIMITS,
  GTEL_PARTNER_DEFS,
} from './constants.ts';
  deriveDiplomaticTradeModifiers,
  gtelAccessBandFromScore,
  gtelActiveDeals,
  gtelNetworkModifier,
  gtelRecentViolations,
} from './diplomacy-linkage.ts';
  advanceTradeDisputes,
  autoOpenDisputesFromSanctions,
  countOpenTradeDisputes,
} from './trade-disputes.ts';
  applyLogisticsToCommodityQuotes,
  computeLogisticsStress,
  logisticsWorldEvent,
} from './export-logistics.ts';
  advanceDiplomaticEngagement,
  deriveEngagementPartnerModifiers,
  diplomaticEngagementGiNotes,
} from './diplomatic-engagement.ts';
  computeImportDependencySnapshot,
  importDependencyConsumerPressure,
  importDependencyGiNotes,
} from './import-dependency.ts';
  advancePartnerMixMemory,
  computeMarketDiversificationSnapshot,
  deriveDiversificationPartnerModifiers,
  diversificationWorldEvent,
  marketDiversificationGiNotes,
} from './market-diversification.ts';
  computeTradeFinanceSnapshot,
  tradeFinanceDomesticStress,
  tradeFinanceExportScale,
  tradeFinanceGiNotes,
} from './trade-finance.ts';
  computeTermsOfTradeSnapshot,
  termsOfTradeGiNotes,
  termsOfTradeHouseholdModifier,
  termsOfTradeWorldEvent,
} from './terms-of-trade.ts';
  computeSupplyChainResilienceSnapshot,
  supplyChainResilienceDomesticStress,
  supplyChainResilienceExportScale,
  supplyChainResilienceGiNotes,
  supplyChainResilienceWorldEvent,
} from './supply-chain-resilience.ts';
  computeForeignExchangeSnapshot,
  foreignExchangeDomesticStress,
  foreignExchangeExportScale,
  foreignExchangeGiNotes,
  foreignExchangeHouseholdModifier,
  foreignExchangeWorldEvent,
} from './foreign-exchange-pressure.ts';
  computeTradeRetaliationSnapshot,
  deriveRetaliationPartnerModifiers,
  tradeRetaliationGiNotes,
  tradeRetaliationWorldEvent,
} from './trade-retaliation.ts';
  computeTradeDeescalationSnapshot,
  deriveDeescalationPartnerModifiers,
  tradeDeescalationGiNotes,
  tradeDeescalationWorldEvent,
} from './trade-deescalation.ts';
  applyExportCapacityToCommodityQuotes,
  computeExportCapacitySnapshot,
  exportCapacityDomesticStress,
  exportCapacityExportScale,
  exportCapacityGiNotes,
  exportCapacityWorldEvent,
} from './export-capacity-allocation.ts';
  computeTradeReconciliationSnapshot,
  deriveReconciliationPartnerModifiers,
  reconciliationEffectiveDisputeCount,
  tradeReconciliationGiNotes,
  tradeReconciliationWorldEvent,
} from './trade-reconciliation.ts';
  computeMaritimeRiskSnapshot,
  maritimeRiskDomesticStress,
  maritimeRiskExportScale,
  maritimeRiskGiNotes,
  maritimeRiskWorldEvent,
} from './maritime-risk-premium.ts';
  applyPreferentialUtilizationToCommodityQuotes,
  computePreferentialUtilizationSnapshot,
  preferentialUtilizationExportScale,
  preferentialUtilizationGiNotes,
  preferentialUtilizationWorldEvent,
} from './preferential-access-utilization.ts';
  computeTradeEnforcementSnapshot,
  deriveEnforcementPartnerModifiers,
  enforcementExportScale,
  tradeEnforcementGiNotes,
  tradeEnforcementWorldEvent,
} from './trade-enforcement-intensity.ts';
  computeExportInsuranceStackSnapshot,
  exportInsuranceStackDomesticStress,
  exportInsuranceStackExportScale,
  exportInsuranceStackGiNotes,
  exportInsuranceStackWorldEvent,
} from './export-credit-insurance-stack.ts';
  computePartnerAccessRestorationSnapshot,
  deriveAccessRestorationPartnerModifiers,
  partnerAccessRestorationGiNotes,
  partnerAccessRestorationWorldEvent,
} from './partner-access-restoration.ts';
  computeSanctionsSpilloverSnapshot,
  deriveSanctionsSpilloverPartnerModifiers,
  sanctionsSpilloverExportScale,
  sanctionsSpilloverGiNotes,
  sanctionsSpilloverWorldEvent,
} from './sanctions-spillover-depth.ts';
  computeTradeCorridorResilienceSnapshot,
  tradeCorridorDomesticStress,
  tradeCorridorExportScale,
  tradeCorridorGiNotes,
  tradeCorridorWorldEvent,
} from './trade-corridor-resilience.ts';
  computeTradeFxHedgingSnapshot,
  tradeFxHedgingExportScale,
  tradeFxHedgingGiNotes,
  tradeFxHedgingHouseholdModifier,
  tradeFxHedgingWorldEvent,
} from './trade-fx-hedging.ts';
  computeImportLanePressureSnapshot,
  importLanePressureDomesticStress,
  importLanePressureExportScale,
  importLanePressureGiNotes,
  importLanePressureWorldEvent,
} from './import-lane-pressure.ts';
  computeDiplomaticTradeCoherenceSnapshot,
  diplomaticTradeCoherenceDomesticStressRelief,
  diplomaticTradeCoherenceExportScale,
  diplomaticTradeCoherenceGiNotes,
  diplomaticTradeCoherenceWorldEvent,
} from './diplomatic-trade-coherence.ts';
  computeTradeBalanceStabilizationSnapshot,
  tradeBalanceStabilizationDomesticStress,
  tradeBalanceStabilizationExportScale,
  tradeBalanceStabilizationGiNotes,
  tradeBalanceStabilizationWorldEvent,
} from './trade-balance-stabilization.ts';
  deriveTradeAgreementModifiers,
  expireStaleAgreements,
  mergeCommodityDeltas,
  mergePartnerDeltas,
} from './trade-agreements.ts';
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
      diplomaticTradeCoherenceDomesticStressRelief(diplomaticTradeCoherence) +
      exportCapacityDomesticStress(exportCapacity) +
      maritimeRiskDomesticStress(maritimeRisk) +
      enforcementMods.domesticStress +
      exportInsuranceStackDomesticStress(exportInsuranceStack) +
      tradeCorridorDomesticStress(tradeCorridorResilience) +
      spilloverMods.domesticStress +
      importLanePressureDomesticStress(importLanePressure) +
      tradeBalanceStabilizationDomesticStress(tradeBalanceStabilization),
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
  if (state.logistics?.band === 'congested' || state.logistics?.band === 'tight') {
    lines.push(state.logistics.summary);
  }
  return lines;
}


// --- source: self-tests.ts ---
  createTradeAgreementFromTemplate,
  deriveTradeAgreementModifiers,
  ratifyTradeAgreement,
} from './trade-agreements.ts';
  computeMarketDiversificationSnapshot,
  deriveDiversificationPartnerModifiers,
} from './market-diversification.ts';
  computeSupplyChainResilienceSnapshot,
  supplyChainResilienceExportScale,
} from './supply-chain-resilience.ts';
  computeTradeRetaliationSnapshot,
  createEmptyTradeRetaliationSnapshot,
  deriveRetaliationPartnerModifiers,
} from './trade-retaliation.ts';
  computeTradeDeescalationSnapshot,
  createEmptyTradeDeescalationSnapshot,
  deriveDeescalationPartnerModifiers,
} from './trade-deescalation.ts';
  computeExportCapacitySnapshot,
  createEmptyExportCapacitySnapshot,
  exportCapacityExportScale,
} from './export-capacity-allocation.ts';
  computeTradeReconciliationSnapshot,
  createEmptyTradeReconciliationSnapshot,
  deriveReconciliationPartnerModifiers,
} from './trade-reconciliation.ts';
  computePreferentialUtilizationSnapshot,
  preferentialUtilizationExportScale,
} from './preferential-access-utilization.ts';
  computeTradeEnforcementSnapshot,
  createEmptyTradeEnforcementSnapshot,
  deriveEnforcementPartnerModifiers,
  enforcementExportScale,
} from './trade-enforcement-intensity.ts';
  computeExportInsuranceStackSnapshot,
  createEmptyExportInsuranceStackSnapshot,
  exportInsuranceStackExportScale,
} from './export-credit-insurance-stack.ts';
  computePartnerAccessRestorationSnapshot,
  createEmptyPartnerAccessRestorationSnapshot,
  deriveAccessRestorationPartnerModifiers,
} from './partner-access-restoration.ts';
  computeSanctionsSpilloverSnapshot,
  deriveSanctionsSpilloverPartnerModifiers,
  sanctionsSpilloverExportScale,
} from './sanctions-spillover-depth.ts';
  computeTradeCorridorResilienceSnapshot,
  tradeCorridorExportScale,
} from './trade-corridor-resilience.ts';
  computeTradeFxHedgingSnapshot,
  createEmptyTradeFxHedgingSnapshot,
  tradeFxHedgingExportScale,
} from './trade-fx-hedging.ts';
  computeImportLanePressureSnapshot,
  importLanePressureExportScale,
} from './import-lane-pressure.ts';
  computeDiplomaticTradeCoherenceSnapshot,
  diplomaticTradeCoherenceExportScale,
} from './diplomatic-trade-coherence.ts';
  computeTradeBalanceStabilizationSnapshot,
  tradeBalanceStabilizationExportScale,
} from './trade-balance-stabilization.ts';
  validateScenarioShockCatalog,
  triggerCommodityShockScenario,
  COMMODITY_SHOCK_SCENARIOS,
} from './commodity-shock-scenarios.ts';

export function runAgent15GlobalTradeLinkageSelfTests(): { passed: number; failed: string[] } {
  const failed: string[] = [];
  let passed = 0;
  const ok = (name: string, fn: () => void) => {
    try {
      fn();
      passed += 1;
    } catch (e: any) {
      failed.push(`${name}: ${e?.message || e}`);
    }
  };

  ok('sanitize empty', () => {
    const p = createEmptyGTELPersisted();
    gtelAssert(p.schemaVersion === 1 && p.revision === 0 && p.agreements.length === 0, 'bad empty persist');
  });

  ok('partner access opens with resource trade deal', () => {
    const dip = {
      deals: [
        {
          id: 'd1',
          type: 'resource_trade',
          status: 'active',
          participants: ['player', 'ai'],
          compliance: 'compliant',
          terms: [{ kind: 'transfer_resource', actorId: 'player', resourceId: 'iron_ore', amount: 2000 }],
        },
      ],
    };
    const r = advanceGlobalTradeEconomyTurn({
      turn: 5,
      diplomacyState: dip,
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 90 } } },
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(r.state.diplomacyTradeDealsActive === 1, 'deal not counted');
    gtelAssert(r.state.commodities.find(c => c.commodity === 'iron_ore')!.effectiveIndex >= 100, 'iron ore below base');
  });

  ok('violations tighten access and emit event', () => {
    const dip = {
      deals: [{ id: 'v1', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 10, text: 'embargo risk' }],
    };
    const r = advanceGlobalTradeEconomyTurn({
      turn: 12,
      diplomacyState: dip,
      nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 40 } } },
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(r.worldEvents.some(e => e.kind === 'diplomacy'), 'expected diplomacy trade event');
    gtelAssert(
      r.state.domestic.exportVsDomesticModel === 'constrained' || r.state.partners.some(p => p.access !== 'strategic'),
      'access should tighten',
    );
  });

  ok('ratified trade agreement boosts partner access', () => {
    const draft = createTradeAgreementFromTemplate('fta_asia_bulk', 8, ['ai']);
    gtelAssert(Boolean(draft), 'template missing');
    const ratified = ratifyTradeAgreement(draft!, 9);
    const persisted = createEmptyGTELPersisted();
    persisted.agreements = [ratified];
    const mods = deriveTradeAgreementModifiers(persisted, 10);
    gtelAssert((mods.partnerDeltas.asia_pacific || 0) > 0, 'expected partner boost');
    const r = advanceGlobalTradeEconomyTurn({
      turn: 10,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 70 } } },
      persisted,
    });
    gtelAssert(r.state.partners.find(p => p.id === 'asia_pacific')!.accessScore > 0.5, 'asia score low');
  });

  ok('world shock reduces iron ore index', () => {
    let persisted = createEmptyGTELPersisted();
    const act = activateWorldTradeShock(persisted, 'shock_iron_crash', 15);
    persisted = act.persisted;
    gtelAssert(Boolean(act.activated), 'shock not activated');
    const r = advanceGlobalTradeEconomyTurn({
      turn: 15,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 80 } } },
      persisted,
    });
    const iron = r.state.commodities.find(c => c.commodity === 'iron_ore')!;
    gtelAssert(iron.shockModifier < 0, 'expected negative shock modifier');
    gtelAssert(r.state.regionalImpacts.some(i => i.regionId === 'WA'), 'WA impact missing');
  });

  ok('scheduled shock is deterministic', () => {
    gtelAssert(scheduledShockIdForTurn(47) === 'shock_suez_style', '47 schedule');
    gtelAssert(scheduledShockIdForTurn(48) === null, '48 should be null');
  });

  ok('household override sets exportSectorBoom', () => {
    const view = advanceGlobalTradeEconomyTurn({
      turn: 20,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'surplus', exportedCapacity: 200 } } },
      persisted: createEmptyGTELPersisted(),
    }).state;
    const out = applyGlobalTradeHouseholdOverrides({ turn: 20, transportNetworkHealth: 70 }, view);
    gtelAssert(typeof out.commodityPrices?.iron_ore === 'number', 'missing commodity price');
    gtelAssert(out.existingIndustryDemandSources?.some((s: string) => s.startsWith('gtel:')), 'missing provenance');
  });

  ok('deterministic hash stable', () => {
    const input = {
      turn: 3,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 55 } } },
      persisted: createEmptyGTELPersisted(),
    };
    const a = advanceGlobalTradeEconomyTurn(input);
    const b = advanceGlobalTradeEconomyTurn(input);
    gtelAssert(a.state.inputHash === b.state.inputHash, 'hash drift');
  });

  ok('sanctions escalate on repeated violations', () => {
    let persisted = createEmptyGTELPersisted();
    const dip = {
      deals: [
        { id: 'v1', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' },
        { id: 'v2', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' },
      ],
      events: [{ kind: 'violation', turn: 6, text: 'embargo asia_pacific breach' }],
    };
    const step = advancePartnerSanctions(persisted, dip, 7);
    persisted = step.persisted;
    const mods = deriveSanctionModifiers(persisted);
    gtelAssert((mods.activeTiers.asia_pacific || 'none') !== 'none', 'expected asia sanctions');
    gtelAssert(mods.partnerDeltas.asia_pacific! < 0, 'partner penalty');
  });

  ok('commodity shock scenario registers catalog shocks', () => {
    const missing = validateScenarioShockCatalog();
    gtelAssert(missing.length === 0, `missing shocks: ${missing.join(',')}`);
    let persisted = createEmptyGTELPersisted();
    const r = triggerCommodityShockScenario(persisted, 'scenario_agri_stress', 20);
    gtelAssert(r.scenario !== null, 'scenario missing');
    gtelAssert(r.activatedShockIds.length >= 1, 'no shocks activated');
    gtelAssert(r.persisted.firedShockScenarios.includes('scenario_agri_stress'), 'scenario not recorded');
  });

  ok('scenario does not double-fire', () => {
    let persisted = createEmptyGTELPersisted();
    persisted = triggerCommodityShockScenario(persisted, 'scenario_bulk_crash', 100).persisted;
    const second = triggerCommodityShockScenario(persisted, 'scenario_bulk_crash', 101);
    gtelAssert(second.activatedShockIds.length === 0, 'should not reactivate');
  });

  ok('partner trust responds to sanctions', () => {
    let persisted = createEmptyGTELPersisted();
    const before = advancePartnerTrustScores(persisted, { deals: [] }, 4, {}).partnerTrust?.asia_pacific?.score;
    persisted.partnerSanctions = {
      asia_pacific: {
        partnerId: 'asia_pacific',
        tier: 'sectoral',
        escalatedTurn: 3,
        cooldownUntilTurn: null,
        violationStreak: 2,
        complianceStreak: 0,
        scopedCommodities: ['iron_ore'],
        reason: 'test',
      },
    };
    persisted = advancePartnerTrustScores(persisted, { deals: [] }, 4, { asia_pacific: 'sectoral' });
    const after = persisted.partnerTrust?.asia_pacific?.score;
    gtelAssert(typeof before === 'number' && typeof after === 'number' && after < before, 'trust should fall under sectoral sanctions');
  });

  ok('trade policy diversification activates under restriction', () => {
    let persisted = createEmptyGTELPersisted();
    persisted.partnerAccess = { asia_pacific: 'blocked', europe: 'restricted' };
    persisted = autoTradePolicyAdjustments(persisted, 6);
    gtelAssert(persisted.tradePolicies.some(p => p.kind === 'diversification_push'), 'missing diversification policy');
  });

  ok('trade dispute resolution steps down sanctions', () => {
    let persisted = createEmptyGTELPersisted();
    persisted.partnerSanctions = {
      europe: {
        partnerId: 'europe',
        tier: 'sectoral',
        escalatedTurn: 1,
        cooldownUntilTurn: null,
        violationStreak: 2,
        complianceStreak: 0,
        scopedCommodities: ['services'],
        reason: 'test',
      },
    };
    const opened = openTradeDispute(persisted, 'europe', 1, 'Test dispute');
    persisted = opened.persisted;
    persisted.tradeDisputes = (persisted.tradeDisputes || []).map(d => ({ ...d, openedTurn: 1, status: 'open' as const }));
    const resolved = advanceTradeDisputes(persisted, 6, { europe: 'none' });
    gtelAssert(resolved.persisted.partnerSanctions?.europe?.tier !== 'sectoral', 'sanctions should step down');
  });

  ok('trade compliance falls after violations', () => {
    let persisted = createEmptyGTELPersisted();
    const base = persisted.tradeCompliance.score;
    persisted = advanceTradeComplianceRecord(
      persisted,
      {
        deals: [{ id: 'x', type: 'resource_trade', status: 'violated', participants: ['p', 'a'], compliance: 'violated' }],
        events: [{ kind: 'violation', turn: 2, text: 'breach' }],
      },
      3,
    );
    gtelAssert(persisted.tradeCompliance.score < base, 'compliance should drop');
  });

  ok('logistics congestion under critical network', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'normal' as const, accessScore: 0.6 }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 140 } } },
      partners,
      exportThroughput: 140,
      openDisputeCount: 2,
    });
    gtelAssert(logistics.band === 'congested' || logistics.band === 'tight', 'expected stress band');
  });

  ok('trade balance surplus when export quotes hot', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'strategic' as const, accessScore: 0.9 }));
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0.1,
      diplomacyModifier: 0,
      networkModifier: 0.05,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 112,
      trend: 'rising' as const,
      evidence: [],
    }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'surplus', exportedCapacity: 180 } } },
      partners,
      exportThroughput: 180,
      openDisputeCount: 0,
    });
    const bal = computeTradeBalanceSnapshot({ commodities, partners, logistics, exportThroughput: 180 });
    gtelAssert(bal.currentAccountTone === 'surplus' || bal.currentAccountTone === 'mild_surplus', 'expected surplus tone');
  });

  ok('import dependency rises when partners restricted', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('normal' as const),
      accessScore: p.id === 'asia_pacific' ? 0.15 : 0.55,
    }));
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 108,
      trend: 'rising' as const,
      evidence: [],
    }));
    const step = computeImportDependencySnapshot({
      partners,
      commodities,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(step.snapshot.lines.length === GTEL_COMMODITIES.length, 'missing dependency lines');
    gtelAssert(step.snapshot.aggregateRisk > 0.25, 'expected elevated aggregate risk');
    gtelAssert(importDependencyConsumerPressure(step.snapshot) > 0, 'expected consumer pressure');
  });

  ok('diplomatic engagement boosts partner under active deals', () => {
    const dip = {
      deals: [
        {
          id: 'd1',
          type: 'resource_trade',
          status: 'active',
          participants: ['player', 'rival_east'],
          compliance: 'compliant',
        },
      ],
    };
    const step = advanceDiplomaticEngagement(createEmptyGTELPersisted(), dip, 9);
    const asiaTrack = step.state.tracks?.asia_pacific;
    gtelAssert(Boolean(asiaTrack), 'missing asia track');
    gtelAssert(asiaTrack!.momentum > 0.45, 'expected engagement momentum lift');
    const mods = deriveEngagementPartnerModifiers(step.state);
    gtelAssert((mods.partnerDeltas.asia_pacific || 0) >= 0, 'asia engagement should not penalize active deal');
  });

  ok('trade finance tightens under congested logistics', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'normal' as const, accessScore: 0.55 }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 140 } } },
      partners,
      exportThroughput: 140,
      openDisputeCount: 2,
    });
    const balance = computeTradeBalanceSnapshot({
      commodities: GTEL_COMMODITIES.map(c => ({
        commodity: c,
        baseIndex: 100,
        partnerModifier: 0,
        diplomacyModifier: 0,
        networkModifier: 0,
        shockModifier: 0,
        agreementModifier: 0,
        effectiveIndex: 102,
        trend: 'stable' as const,
        evidence: [],
      })),
      partners,
      logistics,
      exportThroughput: 140,
    });
    const step = computeTradeFinanceSnapshot({
      logistics,
      tradeBalance: balance,
      tradeCompliance: createEmptyGTELPersisted().tradeCompliance,
      openDisputeCount: 2,
      activeSanctionCount: 1,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(step.snapshot.band !== 'fluid', 'expected non-fluid finance under stress');
    gtelAssert(step.snapshot.financingPremium > 0.35, 'expected financing premium');
  });

  ok('market diversification flags concentrated partner mix', () => {
    const persisted = createEmptyGTELPersisted();
    persisted.partnerMixSmoothing = {
      asia_pacific: 0.78,
      india_ocean: 0.07,
      north_america: 0.07,
      europe: 0.06,
    };
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('normal' as const),
      accessScore: p.id === 'asia_pacific' ? 0.12 : 0.5,
    }));
    const snapshot = computeMarketDiversificationSnapshot({ partners, persisted });
    gtelAssert(snapshot.band === 'concentrated' || snapshot.band === 'critical', 'expected concentration band');
    const mods = deriveDiversificationPartnerModifiers(snapshot);
    gtelAssert(mods.domesticStress > 0, 'expected diversification domestic stress');
  });

  ok('terms of trade deteriorate when import dependency critical', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('restricted' as const),
      accessScore: 0.2,
    }));
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: c === 'manufacturing' ? 118 : 101,
      trend: 'stable' as const,
      evidence: [],
    }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 120 } } },
      partners,
      exportThroughput: 120,
      openDisputeCount: 2,
    });
    const balance = computeTradeBalanceSnapshot({ commodities, partners, logistics, exportThroughput: 120 });
    const dep = computeImportDependencySnapshot({ partners, commodities, persisted: createEmptyGTELPersisted() });
    const step = computeTermsOfTradeSnapshot({
      commodities,
      tradeBalance: balance,
      importDependency: dep.snapshot,
      persisted: dep.persisted,
    });
    gtelAssert(step.snapshot.index < 1, 'expected sub-neutral terms index');
    gtelAssert(termsOfTradeHouseholdModifier(step.snapshot) <= 0, 'expected household squeeze');
  });

  ok('supply chain resilience brittle under stacked chokepoints', () => {
    const partners = GTEL_PARTNER_DEFS.map(p => ({
      ...p,
      access: p.id === 'asia_pacific' ? ('blocked' as const) : ('normal' as const),
      accessScore: p.id === 'asia_pacific' ? 0.12 : 0.5,
    }));
    const logistics = computeLogisticsStress({
      nationalSystems: { national: { trade: { condition: 'critical', exportedCapacity: 150 } } },
      partners,
      exportThroughput: 150,
      openDisputeCount: 3,
    });
    const persisted = createEmptyGTELPersisted();
    persisted.supplyChainResilienceSmoothing = 0.22;
    persisted.partnerMixSmoothing = { asia_pacific: 0.8, india_ocean: 0.07, north_america: 0.07, europe: 0.06 };
    const diversification = computeMarketDiversificationSnapshot({ partners, persisted });
    const commodities = GTEL_COMMODITIES.map(c => ({
      commodity: c,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 110,
      trend: 'rising' as const,
      evidence: [],
    }));
    const dep = computeImportDependencySnapshot({ partners, commodities, persisted });
    const step = computeSupplyChainResilienceSnapshot({
      logistics,
      marketDiversification: diversification,
      importDependency: dep.snapshot,
      openDisputeCount: 3,
      persisted: dep.persisted,
    });
    gtelAssert(step.snapshot.band === 'fragile' || step.snapshot.band === 'brittle', 'expected fragile resilience');
    gtelAssert(supplyChainResilienceExportScale(step.snapshot) < 1, 'expected export scale haircut');
  });

  ok('foreign exchange stress when finance frozen and deficit tone', () => {
    const terms = {
      index: 0.92,
      band: 'unfavorable' as const,
      exportBasketIndex: 98,
      importBasketIndex: 108,
      summary: 'test',
    };
    const balance = {
      exportValueIndex: 92,
      importPressureIndex: 112,
      netExportPulse: -0.12,
      currentAccountTone: 'deficit' as const,
      effectiveThroughput: 80,
      narrative: 'test',
    };
    const finance = {
      availabilityScore: 0.28,
      band: 'frozen' as const,
      financingPremium: 0.42,
      exportCreditCeiling: 70,
      summary: 'test',
    };
    const step = computeForeignExchangeSnapshot({
      termsOfTrade: terms,
      tradeBalance: balance,
      tradeFinance: finance,
      persisted: { ...createEmptyGTELPersisted(), foreignExchangeSmoothing: 0.88 },
    });
    gtelAssert(
      step.snapshot.band === 'stress' || step.snapshot.band === 'crisis' || step.snapshot.pressureIndex < 0.96,
      'expected FX stress',
    );
    gtelAssert(step.snapshot.pressureIndex < 0.96, 'expected sub-neutral FX index');
  });

  ok('trade retaliation escalates with disputes and sanctions', () => {
    const engagement = {
      tracks: {},
      summitPulse: 0.2,
      summary: 'test',
    };
    const step = computeTradeRetaliationSnapshot({
      openDisputeCount: 3,
      activeSanctionCount: 2,
      engagement,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(
      ['watch', 'active', 'escalating'].includes(step.snapshot.band),
      'expected retaliation band',
    );
    const mods = deriveRetaliationPartnerModifiers(step.snapshot);
    gtelAssert(mods.domesticStress > 0, 'expected retaliation domestic stress');
  });

  ok('trade de-escalation warms with summit pulse and compliance', () => {
    const retaliation = computeTradeRetaliationSnapshot({
      openDisputeCount: 1,
      activeSanctionCount: 0,
      engagement: { tracks: {}, summitPulse: 0.2, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const cold = computeTradeDeescalationSnapshot({
      openDisputeCount: 2,
      engagement: { tracks: {}, summitPulse: 0.15, summary: 'test' },
      tradeRetaliation: retaliation,
      complianceScore: 0.5,
      persisted: createEmptyGTELPersisted(),
    });
    const warm = computeTradeDeescalationSnapshot({
      openDisputeCount: 0,
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.78, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.82,
        summary: 'test',
      },
      tradeRetaliation: retaliation,
      complianceScore: 0.82,
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(warm.snapshot.momentum > cold.snapshot.momentum, 'expected warmer de-escalation');
    const mods = deriveDeescalationPartnerModifiers(warm.snapshot);
    gtelAssert(mods.domesticStressRelief >= 0, 'relief non-negative');
  });

  ok('export capacity tightens throughput scale when saturated', () => {
    const commodities = GTEL_COMMODITIES.map(commodity => ({
      commodity,
      baseIndex: 100,
      partnerModifier: 0,
      diplomacyModifier: 0,
      networkModifier: 0,
      shockModifier: 0,
      agreementModifier: 0,
      effectiveIndex: 112,
      trend: 'rising' as const,
      evidence: ['test'],
    }));
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'preferred' as const, accessScore: 0.82 }));
    const logistics = {
      band: 'congested' as const,
      freightPressure: 0.82,
      redundancyScore: 0.35,
      effectiveExportThroughput: 150,
      networkStrain: 0.78,
      summary: 'test',
    };
    const step = computeExportCapacitySnapshot({
      commodities,
      partners,
      logistics,
      termsOfTrade: { index: 0.94, band: 'unfavorable', exportBasketIndex: 96, importBasketIndex: 104, summary: 'test' },
      marketDiversification: {
        concentrationIndex: 0.72,
        band: 'concentrated',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 2.1,
        summary: 'test',
      },
      exportThroughput: 150,
      persisted: { ...createEmptyGTELPersisted(), exportCapacitySmoothing: 0.92 },
    });
    gtelAssert(step.snapshot.band === 'tight' || step.snapshot.band === 'saturated', 'expected tight capacity');
    gtelAssert(exportCapacityExportScale(step.snapshot) <= 0.99, 'expected throughput scale drag');
  });

  ok('trade reconciliation advances with de-escalation breakthrough', () => {
    const deescalation = computeTradeDeescalationSnapshot({
      openDisputeCount: 1,
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.8, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.75,
        summary: 'test',
      },
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      complianceScore: 0.8,
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const stalled = computeTradeReconciliationSnapshot({
      openDisputeCount: 3,
      complianceScore: 0.52,
      tradeDeescalation: createEmptyTradeDeescalationSnapshot(),
      engagement: { tracks: {}, summitPulse: 0.1, summary: 'test' },
      persisted: createEmptyGTELPersisted(),
    });
    const advanced = computeTradeReconciliationSnapshot({
      openDisputeCount: 2,
      complianceScore: 0.82,
      tradeDeescalation: deescalation,
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.8, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.75,
        summary: 'test',
      },
      persisted: createEmptyGTELPersisted(),
    });
    gtelAssert(advanced.snapshot.progress > stalled.snapshot.progress, 'expected reconciliation progress');
    const mods = deriveReconciliationPartnerModifiers(advanced.snapshot);
    gtelAssert(mods.domesticStressRelief >= 0, 'reconciliation relief non-negative');
  });

  ok('maritime risk premium tightens throughput when logistics congested', () => {
    const calm = computeMaritimeRiskSnapshot({
      logistics: {
        band: 'fluid',
        freightPressure: 0.2,
        redundancyScore: 0.8,
        effectiveExportThroughput: 90,
        networkStrain: 0.15,
        summary: 'test',
      },
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      activeSanctionCount: 0,
      exportCapacity: createEmptyExportCapacitySnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const stressed = computeMaritimeRiskSnapshot({
      logistics: {
        band: 'congested',
        freightPressure: 0.88,
        redundancyScore: 0.3,
        effectiveExportThroughput: 150,
        networkStrain: 0.82,
        summary: 'test',
      },
      tradeRetaliation: computeTradeRetaliationSnapshot({
        openDisputeCount: 2,
        activeSanctionCount: 2,
        engagement: { tracks: {}, summitPulse: 0.2, summary: 'test' },
        persisted: createEmptyGTELPersisted(),
      }).snapshot,
      activeSanctionCount: 2,
      exportCapacity: { ...createEmptyExportCapacitySnapshot(), band: 'saturated', utilization: 0.95 },
      persisted: { ...createEmptyGTELPersisted(), maritimeRiskSmoothing: 0.62 },
    }).snapshot;
    gtelAssert(stressed.premiumIndex > calm.premiumIndex, 'expected higher maritime premium');
    gtelAssert(maritimeRiskExportScale(stressed) <= maritimeRiskExportScale(calm) + 0.01, 'expected maritime scale drag');
  });

  ok('preferential utilization rises with ratified agreements', () => {
    let persisted = createEmptyGTELPersisted();
    const draft = createTradeAgreementFromTemplate('fta_asia_bulk', 4, ['rival_east']);
    gtelAssert(!!draft, 'expected agreement draft');
    persisted = { ...persisted, agreements: [ratifyTradeAgreement(draft!, 5)] };
    const partners = GTEL_PARTNER_DEFS.map(p => ({ ...p, access: 'preferred' as const, accessScore: 0.82 }));
    const sparse = computePreferentialUtilizationSnapshot({
      turn: 6,
      partners,
      persisted: createEmptyGTELPersisted(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      marketDiversification: {
        concentrationIndex: 0.55,
        band: 'balanced',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 3.2,
        summary: 'test',
      },
      exportCapacity: createEmptyExportCapacitySnapshot(),
    });
    const rich = computePreferentialUtilizationSnapshot({
      turn: 6,
      partners,
      persisted,
      tradeReconciliation: {
        ...createEmptyTradeReconciliationSnapshot(),
        band: 'substantive',
        progress: 0.58,
      },
      marketDiversification: {
        concentrationIndex: 0.55,
        band: 'balanced',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 3.2,
        summary: 'test',
      },
      exportCapacity: createEmptyExportCapacitySnapshot(),
    });
    gtelAssert(rich.snapshot.utilizationRate > sparse.snapshot.utilizationRate, 'expected higher FTA utilisation');
    gtelAssert(preferentialUtilizationExportScale(rich.snapshot) >= preferentialUtilizationExportScale(sparse.snapshot), 'expected export scale lift');
  });

  ok('trade enforcement intensifies with compliance gaps', () => {
    const light = computeTradeEnforcementSnapshot({
      openDisputeCount: 0,
      tradeCompliance: { band: 'strong', score: 0.82, lastReviewTurn: 1, violationsWindow: 0, openDisputes: 0, findings: [] },
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const heavy = computeTradeEnforcementSnapshot({
      openDisputeCount: 3,
      tradeCompliance: { band: 'critical', score: 0.38, lastReviewTurn: 1, violationsWindow: 4, openDisputes: 3, findings: ['gap'] },
      tradeRetaliation: computeTradeRetaliationSnapshot({
        openDisputeCount: 3,
        activeSanctionCount: 2,
        engagement: { tracks: {}, summitPulse: 0.1, summary: 'test' },
        persisted: createEmptyGTELPersisted(),
      }).snapshot,
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: { ...createEmptyGTELPersisted(), enforcementIntensitySmoothing: 0.55 },
    }).snapshot;
    gtelAssert(heavy.intensity > light.intensity, 'expected higher enforcement intensity');
    const mods = deriveEnforcementPartnerModifiers(heavy);
    gtelAssert(mods.domesticStress > 0, 'expected enforcement domestic stress');
    gtelAssert(enforcementExportScale(heavy) <= enforcementExportScale(light) + 0.01, 'expected enforcement throughput drag');
  });

  ok('export insurance stack weakens when maritime and enforcement stress finance', () => {
    const robust = computeExportInsuranceStackSnapshot({
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.82, band: 'fluid', financingPremium: 0.06 },
      maritimeRisk: createEmptyMaritimeRiskSnapshot(),
      tradeEnforcement: createEmptyTradeEnforcementSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const impaired = computeExportInsuranceStackSnapshot({
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.28, band: 'frozen', financingPremium: 0.42 },
      maritimeRisk: { ...createEmptyMaritimeRiskSnapshot(), premiumIndex: 0.72, band: 'severe', insuranceLoad: 0.22 },
      tradeEnforcement: { ...createEmptyTradeEnforcementSnapshot(), intensity: 0.68, band: 'sweep', probeLoad: 0.2 },
      persisted: { ...createEmptyGTELPersisted(), exportInsuranceStackSmoothing: 0.35 },
    }).snapshot;
    gtelAssert(impaired.compositeScore < robust.compositeScore, 'expected weaker insurance stack');
    gtelAssert(exportInsuranceStackExportScale(impaired) <= exportInsuranceStackExportScale(robust) + 0.01, 'expected stack scale drag');
  });

  ok('partner access restoration gains momentum from de-escalation breakthrough', () => {
    const stalled = computePartnerAccessRestorationSnapshot({
      tradeDeescalation: createEmptyTradeDeescalationSnapshot(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const reopened = computePartnerAccessRestorationSnapshot({
      tradeDeescalation: {
        ...createEmptyTradeDeescalationSnapshot(),
        band: 'breakthrough',
        momentum: 0.78,
        coolingPartnerIds: ['asia_pacific'],
        retaliationAttenuation: 0.14,
      },
      tradeReconciliation: {
        ...createEmptyTradeReconciliationSnapshot(),
        band: 'settled',
        progress: 0.8,
        reconciledPartnerIds: ['asia_pacific'],
      },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(reopened.momentum > stalled.momentum, 'expected restoration momentum');
    const mods = deriveAccessRestorationPartnerModifiers(reopened);
    gtelAssert(mods.domesticStressRelief >= 0, 'restoration relief non-negative');
  });

  ok('trade corridor resilience drops when logistics congested', () => {
    const stable = computeTradeCorridorResilienceSnapshot({
      logistics: {
        band: 'fluid',
        freightPressure: 0.2,
        redundancyScore: 0.82,
        effectiveExportThroughput: 90,
        networkStrain: 0.12,
        summary: 'test',
      },
      maritimeRisk: createEmptyMaritimeRiskSnapshot(),
      supplyChainResilience: { score: 0.62, band: 'adaptive', chokepointCount: 1, redundancyIndex: 0.58, summary: 'test' },
      marketDiversification: {
        concentrationIndex: 0.48,
        band: 'balanced',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 3.4,
        summary: 'test',
      },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const fragile = computeTradeCorridorResilienceSnapshot({
      logistics: {
        band: 'congested',
        freightPressure: 0.9,
        redundancyScore: 0.28,
        effectiveExportThroughput: 160,
        networkStrain: 0.85,
        summary: 'test',
      },
      maritimeRisk: { ...createEmptyMaritimeRiskSnapshot(), premiumIndex: 0.62, band: 'severe', laneReliability: 0.42 },
      supplyChainResilience: { score: 0.32, band: 'brittle', chokepointCount: 4, redundancyIndex: 0.22, summary: 'test' },
      marketDiversification: {
        concentrationIndex: 0.78,
        band: 'critical',
        dominantPartnerId: 'asia_pacific',
        effectivePartnerCount: 1.8,
        summary: 'test',
      },
      persisted: { ...createEmptyGTELPersisted(), tradeCorridorSmoothing: 0.38 },
    }).snapshot;
    gtelAssert(fragile.score < stable.score, 'expected lower corridor score');
    gtelAssert(tradeCorridorExportScale(fragile) <= tradeCorridorExportScale(stable) + 0.01, 'expected corridor scale drag');
  });

  ok('sanctions spillover intensifies with sectoral tiers and retaliation', () => {
    const contained = computeSanctionsSpilloverSnapshot({
      activeTiers: {},
      tradeRetaliation: createEmptyTradeRetaliationSnapshot(),
      tradeEnforcement: createEmptyTradeEnforcementSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const broad = computeSanctionsSpilloverSnapshot({
      activeTiers: { asia_pacific: 'sectoral', europe: 'comprehensive' },
      tradeRetaliation: computeTradeRetaliationSnapshot({
        openDisputeCount: 2,
        activeSanctionCount: 2,
        engagement: { tracks: {}, summitPulse: 0.15, summary: 'test' },
        persisted: createEmptyGTELPersisted(),
      }).snapshot,
      tradeEnforcement: { ...createEmptyTradeEnforcementSnapshot(), intensity: 0.55, band: 'intensive', probeLoad: 0.16 },
      persisted: { ...createEmptyGTELPersisted(), sanctionsSpilloverSmoothing: 0.52 },
    }).snapshot;
    gtelAssert(broad.intensity > contained.intensity, 'expected spillover intensity');
    const mods = deriveSanctionsSpilloverPartnerModifiers(broad);
    gtelAssert(mods.domesticStress > 0, 'expected spillover domestic stress');
    gtelAssert(sanctionsSpilloverExportScale(broad) <= sanctionsSpilloverExportScale(contained) + 0.01, 'expected spillover scale drag');
  });

  ok('trade FX hedging strengthens with supportive FX and favorable terms', () => {
    const weak = computeTradeFxHedgingSnapshot({
      foreignExchange: { pressureIndex: 0.88, band: 'crisis', passThroughToImports: 0.2, exportCompetitiveness: 0.4, summary: 'test' },
      termsOfTrade: { index: 0.86, band: 'severely_unfavorable', exportBasketIndex: 90, importBasketIndex: 108, summary: 'test' },
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.28, band: 'frozen' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const strong = computeTradeFxHedgingSnapshot({
      foreignExchange: { pressureIndex: 0.92, band: 'supportive', passThroughToImports: 0.08, exportCompetitiveness: 0.72, summary: 'test' },
      termsOfTrade: { index: 1.08, band: 'favorable', exportBasketIndex: 108, importBasketIndex: 98, summary: 'test' },
      tradeFinance: { ...createEmptyTradeFinanceSnapshot(), availabilityScore: 0.82, band: 'fluid' },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(strong.effectiveness > weak.effectiveness, 'expected stronger hedging');
    gtelAssert(tradeFxHedgingExportScale(strong) >= tradeFxHedgingExportScale(weak), 'expected hedging scale lift');
  });

  ok('import lane pressure rises with critical dependency and congested logistics', () => {
    const fluid = computeImportLanePressureSnapshot({
      importDependency: { band: 'moderate', lines: [], aggregateRisk: 0.4, summary: 'test' },
      logistics: { band: 'fluid', freightPressure: 0.2, redundancyScore: 0.8, effectiveExportThroughput: 80, networkStrain: 0.1, summary: 'test' },
      tradeEnforcement: createEmptyTradeEnforcementSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const gridlocked = computeImportLanePressureSnapshot({
      importDependency: { band: 'critical', lines: [], aggregateRisk: 0.82, summary: 'test' },
      logistics: { band: 'congested', freightPressure: 0.9, redundancyScore: 0.25, effectiveExportThroughput: 150, networkStrain: 0.8, summary: 'test' },
      tradeEnforcement: { ...createEmptyTradeEnforcementSnapshot(), band: 'sweep', intensity: 0.7, probeLoad: 0.22, clearanceDelayTurns: 2 },
      persisted: { ...createEmptyGTELPersisted(), importLanePressureSmoothing: 0.68 },
    }).snapshot;
    gtelAssert(gridlocked.load > fluid.load, 'expected higher import lane load');
    gtelAssert(importLanePressureExportScale(gridlocked) <= importLanePressureExportScale(fluid) + 0.01, 'expected import lane scale drag');
  });

  ok('diplomatic trade coherence rises with aligned tracks', () => {
    const fragmented = computeDiplomaticTradeCoherenceSnapshot({
      engagement: { tracks: {}, summitPulse: 0.1, summary: 'test' },
      tradeDeescalation: createEmptyTradeDeescalationSnapshot(),
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      partnerAccessRestoration: createEmptyPartnerAccessRestorationSnapshot(),
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const aligned = computeDiplomaticTradeCoherenceSnapshot({
      engagement: {
        tracks: { asia_pacific: { partnerId: 'asia_pacific', momentum: 0.8, band: 'breakthrough', lastEventTurn: 1, highlights: [] } },
        summitPulse: 0.82,
        summary: 'test',
      },
      tradeDeescalation: { ...createEmptyTradeDeescalationSnapshot(), band: 'breakthrough', momentum: 0.76 },
      tradeReconciliation: { ...createEmptyTradeReconciliationSnapshot(), band: 'settled', progress: 0.82 },
      partnerAccessRestoration: { ...createEmptyPartnerAccessRestorationSnapshot(), band: 'reopened', momentum: 0.74 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    gtelAssert(aligned.score > fragmented.score, 'expected higher coherence');
    gtelAssert(diplomaticTradeCoherenceExportScale(aligned) >= diplomaticTradeCoherenceExportScale(fragmented), 'expected coherence scale lift');
  });

  ok('trade balance stabilization weakens under deficit and impaired insurance', () => {
    const anchored = computeTradeBalanceStabilizationSnapshot({
      tradeBalance: {
        exportValueIndex: 110,
        importPressureIndex: 90,
        netExportPulse: 0.12,
        currentAccountTone: 'surplus',
        effectiveThroughput: 100,
        narrative: 'test',
      },
      termsOfTrade: { index: 1.05, band: 'favorable', exportBasketIndex: 106, importBasketIndex: 98, summary: 'test' },
      tradeFxHedging: { ...createEmptyTradeFxHedgingSnapshot(), band: 'well_hedged', effectiveness: 0.78 },
      exportInsuranceStack: { ...createEmptyExportInsuranceStackSnapshot(), band: 'robust', compositeScore: 0.76 },
      tradeReconciliation: { ...createEmptyTradeReconciliationSnapshot(), band: 'settled', progress: 0.8 },
      persisted: createEmptyGTELPersisted(),
    }).snapshot;
    const unstable = computeTradeBalanceStabilizationSnapshot({
      tradeBalance: {
        exportValueIndex: 92,
        importPressureIndex: 118,
        netExportPulse: -0.08,
        currentAccountTone: 'deficit',
        effectiveThroughput: 80,
        narrative: 'test',
      },
      termsOfTrade: { index: 0.84, band: 'severely_unfavorable', exportBasketIndex: 88, importBasketIndex: 112, summary: 'test' },
      tradeFxHedging: { ...createEmptyTradeFxHedgingSnapshot(), band: 'unhedged', effectiveness: 0.28 },
      exportInsuranceStack: { ...createEmptyExportInsuranceStackSnapshot(), band: 'impaired', compositeScore: 0.32 },
      tradeReconciliation: createEmptyTradeReconciliationSnapshot(),
      persisted: { ...createEmptyGTELPersisted(), tradeBalanceStabilizationSmoothing: 0.34 },
    }).snapshot;
    gtelAssert(unstable.index < anchored.index, 'expected weaker stabilization');
    gtelAssert(tradeBalanceStabilizationExportScale(unstable) <= tradeBalanceStabilizationExportScale(anchored) + 0.01, 'expected stabilization scale drag');
  });

  return { passed, failed };
}

export function runAgent15ModuleSelfTests(): { passed: number; failed: string[]; total: number } {
  const r = runAgent15GlobalTradeLinkageSelfTests();
  return { ...r, total: r.passed + r.failed.length };
}


// OP10M_MODULE_END agent-15-trade
