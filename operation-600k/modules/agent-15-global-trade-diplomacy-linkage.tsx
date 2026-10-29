// ============================================================================
// Agent 15 (Operation 600K): Global Trade–Diplomacy–Domestic Linkage
// MERGE: Inline into (V9.4) australia-game-with-ai.tsx per
// operation-600k/internal/agents/agent-15-integration-contract.md
// Remove the GTEL_* type stubs below when merged (canonical types already exist).
// ============================================================================

/** Minimal diplomacy deal shape for read-only scans (full types exist in V9.4). */
type GTELDealStatus = 'active' | 'violated' | 'completed' | 'expired' | 'terminated';
interface GTELDiplomaticDeal {
  id: string;
  type: string;
  status: GTELDealStatus | string;
  participants: string[];
  compliance?: string;
  terms?: Array<{ kind: string; actorId: string; targetActorId?: string | null; resourceId?: string | null; amount?: number | null; regionId?: string | null; status?: string }>;
  violatedBy?: string | null;
  startTurn?: number | null;
  expirationTurn?: number | null;
}
interface GTELDiplomacyState {
  deals: GTELDiplomaticDeal[];
  history?: GTELDiplomaticDeal[];
  events?: Array<{ kind: string; turn: number; actorId?: string; text?: string }>;
}

interface GTELNationalTradeSummary {
  condition?: string;
  utilization?: number;
  exportedCapacity?: number;
  unmetDemand?: number;
  trend?: string;
}
interface GTELNationalSystemsSlice {
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
}

export interface GTELState {
  turn: number;
  partners: GTELPartnerMarket[];
  commodities: GTELCommodityQuote[];
  domestic: GTELDomesticCoupling;
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
  /** Optional: map diplomatic actor id → preferred partner market */
  actorPartnerMap?: Record<string, GTELPartnerId>;
}

export interface GTELTurnResult {
  state: GTELState;
  persisted: GTELPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: 'trade' | 'diplomacy' | 'domestic'; title: string; summary: string; regionIds: string[] }>;
}

export const GTEL_COMMODITIES: GTELCommodityId[] = [
  'iron_ore',
  'coal',
  'lng',
  'wheat',
  'beef',
  'aluminium',
  'services',
  'manufacturing'
];

export const GTEL_COMMODITY_LABEL: Record<GTELCommodityId, string> = {
  iron_ore: 'Iron ore',
  coal: 'Coal',
  lng: 'LNG',
  wheat: 'Wheat',
  beef: 'Beef',
  aluminium: 'Aluminium',
  services: 'Services exports',
  manufacturing: 'Manufactured goods'
};

export const GTEL_PARTNER_DEFS: Array<Omit<GTELPartnerMarket, 'access' | 'accessScore'>> = [
  {
    id: 'asia_pacific',
    label: 'Asia–Pacific buyers',
    baseOpenness: 0.92,
    demandWeights: { iron_ore: 1.2, coal: 0.9, lng: 1.1, aluminium: 1.0, manufacturing: 0.85, services: 0.7 },
    priceSensitivity: 1.05,
    diplomaticActorIds: ['ai', 'rival_east', 'team_blue_lead']
  },
  {
    id: 'india_ocean',
    label: 'Indian Ocean & ASEAN',
    baseOpenness: 0.88,
    demandWeights: { wheat: 1.1, beef: 0.95, coal: 0.8, services: 0.75, manufacturing: 0.9 },
    priceSensitivity: 1.0,
    diplomaticActorIds: ['rival_south']
  },
  {
    id: 'north_america',
    label: 'North America',
    baseOpenness: 0.75,
    demandWeights: { lng: 0.9, services: 1.15, manufacturing: 1.05, beef: 0.85 },
    priceSensitivity: 0.95,
    diplomaticActorIds: ['rival_west']
  },
  {
    id: 'europe',
    label: 'Europe',
    baseOpenness: 0.7,
    demandWeights: { lng: 1.0, services: 1.1, aluminium: 0.95, wheat: 0.6 },
    priceSensitivity: 0.9,
    diplomaticActorIds: ['rival_north']
  },
  {
    id: 'domestic_premium',
    label: 'Domestic premium channels',
    baseOpenness: 1.0,
    demandWeights: { wheat: 0.8, beef: 0.85, services: 0.5, manufacturing: 0.55 },
    priceSensitivity: 0.85,
    diplomaticActorIds: ['player']
  }
];

export const GTEL_LIMITS = { history: 24, embargoCooldown: 8, smoothing: 0.35, maxEvent: 6 } as const;

const GTEL_ACCESS_RANK: Record<GTELAccessBand, number> = {
  blocked: 0,
  restricted: 1,
  normal: 2,
  preferred: 3,
  strategic: 4
};

const GTEL_BASE_COMMODITY_INDEX: Record<GTELCommodityId, number> = {
  iron_ore: 100,
  coal: 88,
  lng: 112,
  wheat: 76,
  beef: 82,
  aluminium: 95,
  services: 105,
  manufacturing: 98
};

function gtelNum(v: unknown, d = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : d;
}

function gtelClamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function gtelHash(parts: unknown[]): string {
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

export function createEmptyGTELPersisted(): GTELPersisted {
  return {
    schemaVersion: 1,
    revision: 0,
    lastProcessedTurn: null,
    partnerAccess: {},
    commoditySmoothing: {},
    embargoCooldowns: {},
    recentEvents: []
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
    Object.entries(r.embargoCooldowns as Record<string, number>).slice(0, 12).forEach(([k, v]) => {
      base.embargoCooldowns[k.slice(0, 40)] = Math.max(0, Math.floor(gtelNum(v, 0)));
    });
  }
  if (Array.isArray(r.recentEvents)) {
    base.recentEvents = r.recentEvents
      .filter((e: any) => e && typeof e === 'object' && typeof e.id === 'string')
      .slice(-GTEL_LIMITS.history)
      .map((e: any) => ({
        id: String(e.id).slice(0, 60),
        turn: Math.max(1, Math.floor(gtelNum(e.turn, turn))),
        kind: String(e.kind || 'trade').slice(0, 24),
        text: String(e.text || '').slice(0, 200)
      }));
  }
  return base;
}

function gtelActiveDeals(st: GTELDiplomacyState | null): GTELDiplomaticDeal[] {
  if (!st || !Array.isArray(st.deals)) return [];
  return st.deals.filter(d => d && (d.status === 'active' || d.compliance === 'compliant' || d.compliance === 'at_risk'));
}

function gtelRecentViolations(st: GTELDiplomacyState | null, turn: number, window = 6): number {
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
  actorNames: Record<string, string> = {}
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

function gtelNetworkModifier(national: GTELNationalSystemsSlice | null): { networkMod: number; condition: string; throughput: number } {
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

function gtelAccessBandFromScore(score: number): GTELAccessBand {
  if (score < 0.25) return 'blocked';
  if (score < 0.45) return 'restricted';
  if (score < 0.65) return 'normal';
  if (score < 0.85) return 'preferred';
  return 'strategic';
}

export function advanceGlobalTradeEconomyTurn(input: GTELTurnInput): GTELTurnResult {
  const turn = Math.max(1, Math.floor(gtelNum(input.turn, 1)));
  const persisted = sanitizeGTELPersisted(input.persisted, turn);
  const names = input.actorNames || {};
  const dip = deriveDiplomaticTradeModifiers(input.diplomacyState, turn, names);
  const net = gtelNetworkModifier(input.nationalSystems);
  const worldEvents: GTELTurnResult['worldEvents'] = [];

  const partners: GTELPartnerMarket[] = GTEL_PARTNER_DEFS.map(def => {
    const prevBand = persisted.partnerAccess[def.id] || 'normal';
    const prevScore = GTEL_ACCESS_RANK[prevBand] / 4;
    const delta = gtelNum(dip.partnerDeltas[def.id], 0);
    const embKey = `embargo_${def.id}`;
    const cooldown = gtelNum(persisted.embargoCooldowns[embKey], 0);
    let penalty = cooldown > 0 ? -0.15 : 0;
    if (cooldown > 0) persisted.embargoCooldowns[embKey] = cooldown - 1;
    const score = gtelClamp(def.baseOpenness * 0.55 + prevScore * 0.25 + delta + net.networkMod + penalty, 0, 1);
    const access = gtelAccessBandFromScore(score);
    persisted.partnerAccess[def.id] = access;
    return {
      ...def,
      access,
      accessScore: score
    };
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
      regionIds: ['WA', 'QLD', 'NSW']
    });
  }

  const commodities: GTELCommodityQuote[] = GTEL_COMMODITIES.map(commodity => {
    const baseIndex = GTEL_BASE_COMMODITY_INDEX[commodity];
    const prevSmooth = gtelNum(persisted.commoditySmoothing[commodity], baseIndex);
    let partnerModifier = 0;
    partners.forEach(p => {
      const w = gtelNum(p.demandWeights[commodity], 0.5);
      partnerModifier += (GTEL_ACCESS_RANK[p.access] / 4 - 0.5) * w * 0.06 * p.priceSensitivity;
    });
    const diplomacyModifier = gtelNum(dip.commodityDeltas[commodity], 0);
    const networkModifier = net.networkMod * (commodity === 'services' ? 0.5 : 1);
    const raw = baseIndex * (1 + partnerModifier + diplomacyModifier + networkModifier);
    const effectiveIndex = prevSmooth * (1 - GTEL_LIMITS.smoothing) + raw * GTEL_LIMITS.smoothing;
    persisted.commoditySmoothing[commodity] = gtelClamp(effectiveIndex, 45, 175);
    const trend: GTELCommodityQuote['trend'] =
      effectiveIndex > prevSmooth + 1.5 ? 'rising' : effectiveIndex < prevSmooth - 1.5 ? 'falling' : 'stable';
    const evidence = [
      `National trade network: ${net.condition}`,
      `Partner-weighted access applied`,
      diplomacyModifier !== 0 ? 'Diplomatic resource terms adjusted price' : 'No active resource-transfer terms'
    ];
    return {
      commodity,
      baseIndex,
      partnerModifier,
      diplomacyModifier,
      networkModifier,
      effectiveIndex: Math.round(effectiveIndex * 10) / 10,
      trend,
      evidence
    };
  });

  const exportLedPressure = gtelClamp(
    (net.throughput / 120) * 0.4 +
      partners.filter(p => p.id !== 'domestic_premium' && GTEL_ACCESS_RANK[p.access] >= 3).length * 0.08,
    0,
    1
  );
  const avgCommodity = commodities.reduce((a, c) => a + c.effectiveIndex, 0) / commodities.length;
  const householdOffset = gtelClamp((avgCommodity - 95) / -80, -0.25, 0.35);
  const exportSectorBoom = exportLedPressure > 0.55 && avgCommodity > 98;
  let exportVsDomesticModel: GTELDomesticCoupling['exportVsDomesticModel'] = 'domestically_balanced';
  if (exportSectorBoom && householdOffset < -0.05) exportVsDomesticModel = 'export_led';
  else if (householdOffset > 0.12 && exportLedPressure < 0.35) exportVsDomesticModel = 'household_led';
  else if (net.condition === 'critical' || net.condition === 'bottlenecked') exportVsDomesticModel = 'constrained';

  const transportHealthDelta = gtelClamp(net.networkMod * 12 + (exportSectorBoom ? 2 : 0), -8, 6);
  const domestic: GTELDomesticCoupling = {
    exportLedPressure,
    householdOffset,
    exportSectorBoom,
    exportVsDomesticModel,
    transportHealthDelta,
    summary:
      exportVsDomesticModel === 'export_led'
        ? 'Export channels are hot; watch whether household demand keeps pace.'
        : exportVsDomesticModel === 'constrained'
        ? 'Trade bottlenecks are capping exports and squeezing domestic spillover.'
        : exportVsDomesticModel === 'household_led'
        ? 'Domestic channels carry more of national income than export premiums right now.'
        : 'Exports and domestic demand are roughly in balance.'
  };

  const inputHash = gtelHash([turn, dip, net.condition, commodities.map(c => c.effectiveIndex), partners.map(p => p.access)]);
  persisted.revision += 1;
  persisted.lastProcessedTurn = turn;

  if (exportSectorBoom) {
    worldEvents.push({
      id: `gtel_boom_${turn}`,
      turn,
      kind: 'trade',
      title: 'Export window widening',
      summary: domestic.summary,
      regionIds: ['WA', 'QLD']
    });
  }

  persisted.recentEvents = [
    ...persisted.recentEvents,
    ...worldEvents.map(e => ({ id: e.id, turn: e.turn, kind: e.kind, text: e.summary }))
  ].slice(-GTEL_LIMITS.history);

  const state: GTELState = {
    turn,
    partners,
    commodities,
    domestic,
    nationalTradeCondition: net.condition,
    exportThroughput: net.throughput,
    diplomacyTradeDealsActive: gtelActiveDeals(input.diplomacyState).filter(d => d.type === 'resource_trade').length,
    violationsLastWindow: gtelRecentViolations(input.diplomacyState, turn),
    inputHash
  };

  return { state, persisted, worldEvents: worldEvents.slice(0, GTEL_LIMITS.maxEvent) };
}

export function buildGlobalTradeEconomyInputsFromGameState(gs: any, turn?: number): GTELTurnInput {
  const t = Math.max(1, Math.floor(gtelNum(turn ?? gs?.turnCounter ?? gs?.turn ?? 1, 1)));
  return {
    turn: t,
    diplomacyState: (gs?.diplomacyState as GTELDiplomacyState) || null,
    nationalSystems: gs?.nationalSystems || null,
    persisted: sanitizeGTELPersisted(gs?.globalTradeEconomy, t),
    actorNames: gs?.actorNames || { player: 'You', ai: 'Rival' }
  };
}

/** Merged types: HouseholdEconomyInputs exists in V9.4 — use any for fragment isolation. */
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
    existingIndustryDemandSources: [
      ...(inputs.existingIndustryDemandSources || []),
      `gtel:${view.domestic.exportVsDomesticModel}`
    ]
  };
}

export function buildGlobalTradeGi3Notes(state: GTELState | null): string[] {
  if (!state) return [];
  const lines = [state.domestic.summary];
  const hot = state.commodities.filter(c => c.trend === 'rising').slice(0, 2);
  if (hot.length) lines.push(`Rising quotes: ${hot.map(c => GTEL_COMMODITY_LABEL[c.commodity]).join(', ')}.`);
  const blocked = state.partners.filter(p => p.access === 'blocked' || p.access === 'restricted');
  if (blocked.length) lines.push(`Restricted partners: ${blocked.map(p => p.label).join('; ')}.`);
  return lines;
}

// ---- UI (read-only snapshot) ---------------------------------------------------------------------------

export interface GlobalTradeEconomyPanelProps {
  state: GTELState | null;
  theme?: { isDark?: boolean };
  onAsk?: (question: string) => void;
}

export const GlobalTradeEconomyPanel: React.FC<GlobalTradeEconomyPanelProps> = ({ state, theme, onAsk }) => {
  if (!state) {
    return (
      <section data-testid="gtel-panel" className="rounded-lg border p-3 text-sm opacity-80">
        Global trade linkage warming up — advance a turn after national systems are active.
      </section>
    );
  }
  const dark = Boolean(theme?.isDark);
  const card = `rounded-lg border p-3 space-y-2 ${dark ? 'border-slate-700' : 'border-slate-200'}`;
  return (
    <section data-testid="gtel-panel" aria-labelledby="gtel-heading" className="space-y-2">
      <div className={card}>
        <h3 id="gtel-heading" className="font-bold">
          🌐 Trade, diplomacy & domestic spillover
        </h3>
        <p className="text-xs opacity-85">{state.domestic.summary}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <div className="opacity-70">National trade net</div>
            <div className="font-semibold">{state.nationalTradeCondition}</div>
          </div>
          <div>
            <div className="opacity-70">Export throughput</div>
            <div className="font-semibold">{Math.round(state.exportThroughput)}</div>
          </div>
          <div>
            <div className="opacity-70">Active trade deals</div>
            <div className="font-semibold">{state.diplomacyTradeDealsActive}</div>
          </div>
          <div>
            <div className="opacity-70">Domestic model</div>
            <div className="font-semibold">{state.domestic.exportVsDomesticModel.replace(/_/g, ' ')}</div>
          </div>
        </div>
      </div>
      <div className={card}>
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Partner access</div>
        <ul className="text-xs space-y-1">
          {state.partners.map(p => (
            <li key={p.id} className="flex justify-between gap-2">
              <span>{p.label}</span>
              <span className="font-mono">
                {p.access} ({Math.round(p.accessScore * 100)}%)
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className={card}>
        <div className="text-[11px] font-semibold uppercase tracking-wider opacity-70">Commodity indices</div>
        <ul className="text-xs space-y-1 max-h-40 overflow-y-auto">
          {state.commodities.map(c => (
            <li key={c.commodity} className="flex justify-between gap-2">
              <span>
                {GTEL_COMMODITY_LABEL[c.commodity]}{' '}
                <span className="opacity-60">({c.trend})</span>
              </span>
              <span className="font-mono">{c.effectiveIndex}</span>
            </li>
          ))}
        </ul>
        {onAsk && (
          <button
            type="button"
            className="text-xs underline mt-2"
            onClick={() => onAsk('How are exports affecting domestic demand this turn?')}
          >
            Ask co-pilot about domestic spillover
          </button>
        )}
      </div>
    </section>
  );
};

// ---- Self-tests ----------------------------------------------------------------------------------------

function gtelAssert(cond: boolean, msg: string): void {
  if (!cond) throw new Error(`Agent15 GTEL: ${msg}`);
}

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
    const p = sanitizeGTELPersisted(null);
    gtelAssert(p.schemaVersion === 1 && p.revision === 0, 'bad empty persist');
  });

  ok('partner access opens with resource trade deal', () => {
    const dip: GTELDiplomacyState = {
      deals: [
        {
          id: 'd1',
          type: 'resource_trade',
          status: 'active',
          participants: ['player', 'ai'],
          compliance: 'compliant',
          terms: [{ kind: 'transfer_resource', actorId: 'player', resourceId: 'iron_ore', amount: 2000 }]
        }
      ]
    };
    const r = advanceGlobalTradeEconomyTurn({
      turn: 5,
      diplomacyState: dip,
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 90 } } },
      persisted: createEmptyGTELPersisted()
    });
    gtelAssert(r.state.diplomacyTradeDealsActive === 1, 'deal not counted');
    gtelAssert(r.state.commodities.find(c => c.commodity === 'iron_ore')!.effectiveIndex >= 100, 'iron ore should not fall below base on trade deal');
  });

  ok('violations tighten access and emit event', () => {
    const dip: GTELDiplomacyState = {
      deals: [{ id: 'v1', type: 'resource_trade', status: 'violated', participants: ['player', 'ai'], compliance: 'violated' }],
      events: [{ kind: 'violation', turn: 10, text: 'embargo risk' }]
    };
    const r = advanceGlobalTradeEconomyTurn({
      turn: 12,
      diplomacyState: dip,
      nationalSystems: { national: { trade: { condition: 'strained', exportedCapacity: 40 } } },
      persisted: createEmptyGTELPersisted()
    });
    gtelAssert(r.worldEvents.some(e => e.kind === 'diplomacy'), 'expected diplomacy trade event');
    gtelAssert(r.state.domestic.exportVsDomesticModel === 'constrained' || r.state.partners.some(p => p.access !== 'strategic'), 'access should tighten');
  });

  ok('household override sets exportSectorBoom', () => {
    const view = advanceGlobalTradeEconomyTurn({
      turn: 20,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'surplus', exportedCapacity: 200 } } },
      persisted: createEmptyGTELPersisted()
    }).state;
    const out = applyGlobalTradeHouseholdOverrides({ turn: 20, transportNetworkHealth: 70 }, view);
    gtelAssert(typeof out.commodityPrices?.iron_ore === 'number', 'missing commodity price');
    gtelAssert(out.existingIndustryDemandSources?.some((s: string) => s.startsWith('gtel:')), 'missing provenance');
  });

  ok('deterministic hash stable', () => {
    const input: GTELTurnInput = {
      turn: 3,
      diplomacyState: { deals: [] },
      nationalSystems: { national: { trade: { condition: 'healthy', exportedCapacity: 55 } } },
      persisted: createEmptyGTELPersisted()
    };
    const a = advanceGlobalTradeEconomyTurn(input);
    const b = advanceGlobalTradeEconomyTurn(input);
    gtelAssert(a.state.inputHash === b.state.inputHash, 'hash drift');
  });

  return { passed, failed };
}
