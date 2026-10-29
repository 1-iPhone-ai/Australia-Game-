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
    kind: 'trade' | 'diplomacy' | 'domestic' | 'shock';
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

export type WorldTradeShockKind =
  | 'shipping_disruption'
  | 'partner_embargo'
  | 'commodity_crash'
  | 'commodity_spike'
  | 'supply_chain'
  | 'financial_contagion';

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

export interface GlobalTradeEconomyPanelProps {
  state: GTELState | null;
  theme?: { isDark?: boolean };
  onAsk?: (question: string) => void;
}
