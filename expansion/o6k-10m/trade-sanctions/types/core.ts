/**
 * V1014_TRADE_DEPTH — core types (SECTION 20BA / T6-6).
 * Cross-wire: 20AT GTEL, 20H diplomacy, 20AB investment, 20AE fiscal, 20AF households.
 */

export const V1014_TRADE_DEPTH_SCHEMA_VERSION = '10.14.trade_depth.1' as const;

export type V1014TradeDepthDealPhase =
  | 'dormant'
  | 'scoping'
  | 'negotiating'
  | 'ratifying'
  | 'active'
  | 'review'
  | 'escalating'
  | 'retaliating'
  | 'cooling'
  | 'suspended'
  | 'terminated';

export type V1014TradeDepthAccessBand = 'blocked' | 'restricted' | 'normal' | 'preferred' | 'strategic';

export type V1014TradeDepthFiscalBand = 'healthy' | 'tight' | 'stressed' | 'critical';

export interface V1014TradeDepthBilateralContext {
  turn: number;
  trustScore: number;
  baselineVolume: number;
  counterpartySanctionsActive: boolean;
}

export interface V1014TradeDepthTariffContext {
  turn: number;
  diplomaticTrust: number;
  tradeDeficitIndex: number;
  partnerId: string;
}

export interface V1014TradeDepthSanctionsMeasure {
  id: string;
  kind: 'export_control' | 'financial' | 'travel' | 'sector_embargo';
  severity: number;
  targetSectors: string[];
  complianceCost: number;
}

export interface V1014TradeDepthSanctionsState {
  packageId: string;
  active: boolean;
  enforcementScore: number;
  leakScore: number;
  measuresApplied: string[];
  startedTurn: number;
  expiryTurn: number | null;
  waivers: string[];
}

export interface V1014TradeDepthRemittanceShock {
  id: string;
  turn: number;
  severity: number;
  corridor: string;
  narrative: string;
}

export interface V1014TradeDepthCapitalState {
  regimeId: string;
  outflowLimit: number;
  remittanceCap: number;
  flightRisk: number;
  fxPressure: number;
  lastTurn: number;
  shocks: V1014TradeDepthRemittanceShock[];
}

export interface V1014TradeDepthPersisted {
  schemaVersion: typeof V1014_TRADE_DEPTH_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  bilateralSnapshots: Record<string, { phase: V1014TradeDepthDealPhase; trustScore: number; tariffPressure: number }>;
  tariffRungs: Record<string, number>;
  activePackages: string[];
  capitalRegimes: Record<string, V1014TradeDepthCapitalState>;
  aiReadCache: Record<string, string>;
}

export interface V1014TradeDepthTurnInput {
  turn: number;
  seed: number;
  gtelAccessBand: V1014TradeDepthAccessBand;
  diplomacyTrust: number;
  tradeDeficitIndex: number;
  fiscalPressureBand: V1014TradeDepthFiscalBand;
  householdSentiment: number;
  investmentClimateScore: number;
  counterpartySanctionsActive: boolean;
  bilateralPairIds: string[];
  activeSanctionPackages: string[];
  capitalRegimeIds: string[];
  persisted: V1014TradeDepthPersisted | null;
}

export interface V1014TradeDepthRuntimeState {
  turn: number;
  aggregateTariffPressure: number;
  aggregateSanctionsPressure: number;
  capitalFlightIndex: number;
  remittanceShockIndex: number;
  householdConsumptionDrag: number;
  fiscalStressContribution: number;
  investmentClimateDrag: number;
  gtelAccessHint: V1014TradeDepthAccessBand;
  diplomaticBriefing: string;
  inputHash: string;
}

export interface V1014TradeDepthTurnResult {
  state: V1014TradeDepthRuntimeState;
  persisted: V1014TradeDepthPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: 'trade' | 'sanctions' | 'capital'; title: string; summary: string }>;
}

/** Read-only diplomacy slice for 20H adapter (no mutation). */
export interface V1014TradeDepthDiplomacyReadSlice {
  activeDealCount: number;
  violatedDeals: number;
  trustAggregate: number;
  recentEvents: string[];
}

/** GTEL read slice for 20AT adapter. */
export interface V1014TradeDepthGtelReadSlice {
  accessBand: V1014TradeDepthAccessBand;
  exportThroughput: number;
  partnerAccess: Record<string, V1014TradeDepthAccessBand>;
}

/** 20AB investment climate inputs. */
export interface V1014TradeDepthInvestmentClimateDelta {
  scoreDelta: number;
  confidenceDelta: number;
  narrative: string;
}

/** 20AE fiscal stress bridge. */
export interface V1014TradeDepthFiscalStressBridge {
  revenueDrag: number;
  expenditurePressure: number;
  headroomDelta: number;
}

/** 20AF household demand bridge. */
export interface V1014TradeDepthHouseholdDemandBridge {
  consumptionMultiplier: number;
  importPriceShock: number;
  remittanceIncomeEffect: number;
}

export interface V1014TradeDepthSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
