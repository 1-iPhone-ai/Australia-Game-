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

  const names = input.actorNames || {};
  const dip = deriveDiplomaticTradeModifiers(input.diplomacyState, turn, names);
  const agr = deriveTradeAgreementModifiers(persisted, turn);
  const shock = deriveShockModifiers(persisted);
  const sanctions = deriveSanctionModifiers(persisted);

  const partnerDeltas = mergePartnerDeltas(
    mergePartnerDeltas(mergePartnerDeltas(dip.partnerDeltas, agr.partnerDeltas), shock.partnerDeltas),
    sanctions.partnerDeltas,
  );
  const commodityDeltas = mergeCommodityDeltas(
    mergeCommodityDeltas(mergeCommodityDeltas(dip.commodityDeltas, agr.commodityDeltas), shock.commodityDeltas),
    sanctions.commodityDeltas,
  );

  const notes = [...dip.notes, ...agr.notes, ...shock.notes, ...sanctions.notes];
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

  const partners: GTELPartnerMarket[] = GTEL_PARTNER_DEFS.map(def => {
    const prevBand = persisted.partnerAccess[def.id] || 'normal';
    const prevScore = GTEL_ACCESS_RANK[prevBand] / 4;
    const delta = gtelNum(partnerDeltas[def.id], 0);
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

  const commodities = GTEL_COMMODITIES.map(commodity => {
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

  const exportLedPressure = gtelClamp(
    (net.throughput / 120) * 0.4 + partners.filter(p => p.id !== 'domestic_premium' && GTEL_ACCESS_RANK[p.access] >= 3).length * 0.08,
    0,
    1,
  );
  const avgCommodity = commodities.reduce((a, c) => a + c.effectiveIndex, 0) / commodities.length;
  const householdOffset = gtelClamp(
    (avgCommodity - 95) / -80 - (shock.domesticStress + sanctions.domesticStress) * 0.15,
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
    shockStress: shock.domesticStress + sanctions.domesticStress,
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
    exportThroughput: net.throughput,
    diplomacyTradeDealsActive: gtelActiveDeals(input.diplomacyState).filter(d => d.type === 'resource_trade').length,
    violationsLastWindow: gtelRecentViolations(input.diplomacyState, turn),
    activeSanctionTiers: sanctions.activeTiers,
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

  return { passed, failed };
}

export function runAgent15ModuleSelfTests(): { passed: number; failed: string[]; total: number } {
  const r = runAgent15GlobalTradeLinkageSelfTests();
  return { ...r, total: r.passed + r.failed.length };
}


// OP10M_MODULE_END agent-15-trade
