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

  const names = input.actorNames || {};
  const dip = deriveDiplomaticTradeModifiers(input.diplomacyState, turn, names);
  const agr = deriveTradeAgreementModifiers(persisted, turn);
  const shock = deriveShockModifiers(persisted);
  const sanctions = deriveSanctionModifiers(persisted);
  const trust = deriveTrustAccessModifiers(persisted);
  const policy = deriveTradePolicyModifiers(persisted);
  const compliancePenalty = deriveCompliancePartnerPenalty(persisted.tradeCompliance);
  const engagement = deriveEngagementPartnerModifiers(engagementStep.state);

  const partnerDeltas = mergePartnerDeltas(
    mergePartnerDeltas(
      mergePartnerDeltas(mergePartnerDeltas(dip.partnerDeltas, agr.partnerDeltas), shock.partnerDeltas),
      sanctions.partnerDeltas,
    ),
    mergePartnerDeltas(
      mergePartnerDeltas(trust.partnerDeltas, policy.partnerDeltas),
      engagement.partnerDeltas,
    ),
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

  const dependencyStep = computeImportDependencySnapshot({ partners, commodities, persisted });
  persisted = dependencyStep.persisted;
  const importDependency = dependencyStep.snapshot;
  const importPressure = importDependencyConsumerPressure(importDependency);

  const exportLedPressure = gtelClamp(
    (net.throughput / 120) * 0.4 + partners.filter(p => p.id !== 'domestic_premium' && GTEL_ACCESS_RANK[p.access] >= 3).length * 0.08,
    0,
    1,
  );
  const avgCommodity = commodities.reduce((a, c) => a + c.effectiveIndex, 0) / commodities.length;
  const householdOffset = gtelClamp(
    (avgCommodity - 95) / -80 - (shock.domesticStress + sanctions.domesticStress + policy.domesticStress) * 0.15,
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
      importPressure,
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
    exportThroughput: logistics.effectiveExportThroughput,
    diplomacyTradeDealsActive: gtelActiveDeals(input.diplomacyState).filter(d => d.type === 'resource_trade').length,
    violationsLastWindow: gtelRecentViolations(input.diplomacyState, turn),
    activeSanctionTiers: sanctions.activeTiers,
    partnerTrust: persisted.partnerTrust || {},
    activeTradePolicies: listActiveTradePolicies(persisted),
    openDisputeCount: openDisputes,
    logistics,
    tradeBalance,
    tradeCompliance: persisted.tradeCompliance,
    importDependency,
    diplomaticEngagement: engagementStep.state,
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

  return { passed, failed };
}

export function runAgent15ModuleSelfTests(): { passed: number; failed: string[]; total: number } {
  const r = runAgent15GlobalTradeLinkageSelfTests();
  return { ...r, total: r.passed + r.failed.length };
}


// OP10M_MODULE_END agent-15-trade
