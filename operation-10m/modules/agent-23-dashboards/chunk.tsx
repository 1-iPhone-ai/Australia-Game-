// OP10M_MODULE_BEGIN agent-23-dashboards
// Operation 10M — Agent 23 dashboards / maps / data viz (bundled for Agent 25 assembly).
// Source tree: operation-10m/agent-23-dashboards/ — regenerate via npm run bundle:agent-23-chunk
// --- bundled from types.ts ---
/** Agent 23 — dashboard/map contracts (mirror V9.4 Living Regions + National Systems views). */

export type LRMomentumBand =
  | 'declining'
  | 'weakening'
  | 'stable'
  | 'growing'
  | 'rapid_growth'
  | 'booming';

export type LRDevTier =
  | 'underdeveloped'
  | 'emerging'
  | 'developing'
  | 'advanced'
  | 'highly_developed';

export type LREconomyBand = 'depressed' | 'weak' | 'moderate' | 'strong' | 'booming';

export type NationalNetworkKind = 'freight' | 'energy' | 'water' | 'trade' | 'digital';

export type NationalNetworkCondition =
  | 'surplus'
  | 'healthy'
  | 'strained'
  | 'bottlenecked'
  | 'critical';

export type NationalResilienceBand =
  | 'fragile'
  | 'exposed'
  | 'stable'
  | 'resilient'
  | 'highly_resilient';

export interface RegionalNeed {
  category: string;
  status: 'open' | 'met' | 'dismissed';
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface RegionalRisk {
  severity: 'low' | 'moderate' | 'high' | 'critical';
}

export interface DynamicRegionalState {
  regionId: string;
  name: string;
  development: { tier: LRDevTier };
  economy: { band: LREconomyBand };
  momentum: { band: LRMomentumBand; history: number[] };
  needs: RegionalNeed[];
  risks: RegionalRisk[];
}

export interface LRDerivedEvent {
  turn: number;
  text: string;
  significance: 'meaningful' | 'major';
}

export interface LivingRegionsState {
  revision: number;
  regions: Record<string, DynamicRegionalState>;
  derived: LRDerivedEvent[];
}

export interface LivingRegionsWorldView {
  state: LivingRegionsState;
}

export interface NationalNetworkRegionState {
  utilization: number;
  condition: NationalNetworkCondition;
}

export interface NationalRegionSystemsState {
  regionId: string;
  name: string;
  networks: Record<NationalNetworkKind, NationalNetworkRegionState>;
  primaryConstraint: NationalNetworkKind | null;
  resilience: number;
  resilienceBand: NationalResilienceBand;
}

export interface NationalNetworkNationalSummary {
  utilization: number;
  condition: NationalNetworkCondition;
  bottlenecks: number;
}

export interface NationalSystemsSummary
  extends Record<NationalNetworkKind, NationalNetworkNationalSummary> {
  resilienceScore: number;
  resilienceBand: NationalResilienceBand;
}

export interface NationalSystemHistoryEntry {
  turn: number;
  summary: string;
}

export interface NationalBottleneck {
  id: string;
  regionId?: string;
  network?: NationalNetworkKind;
  severity?: 'minor' | 'meaningful' | 'major' | 'critical';
}

export interface NationalDependency {
  id: string;
  consumerRegionId: string;
  providerRegionId: string;
  network: NationalNetworkKind;
  importance: 'low' | 'moderate' | 'high' | 'critical';
}

export interface NationalSystemsState {
  revision: number;
  turn?: number;
  regions: Record<string, NationalRegionSystemsState>;
  bottlenecks: NationalBottleneck[];
  dependencies: NationalDependency[];
  national: NationalSystemsSummary;
  history: NationalSystemHistoryEntry[];
}

export interface NationalSystemsWorldView {
  regionOwners: Record<string, 'you' | 'rival' | 'neutral'>;
}

export type NrDashProvenanceSource = 'living_regions' | 'national_systems' | 'derived_compare';

export interface NrDashProvenance {
  source: NrDashProvenanceSource;
  revision: string | number | null;
  turn: number;
  detail: string;
}

export interface NrDashNetworkBar {
  network: NationalNetworkKind;
  label: string;
  icon: string;
  utilization: number;
  condition: NationalNetworkCondition;
  bottlenecks: number;
}

export interface NrDashRegionalRow {
  regionId: string;
  name: string;
  owner: 'you' | 'rival' | 'neutral' | 'unknown';
  developmentTier: string;
  economyBand: string;
  momentumBand: string;
  momentumHistory: number[];
  resilience: number | null;
  resilienceBand: string | null;
  openNeeds: number;
  highRisks: number;
  primaryConstraint: NationalNetworkKind | null;
}

export interface NrDashAuthSnapshot {
  turn: number;
  provenance: NrDashProvenance[];
  nationalResilience: number | null;
  nationalResilienceBand: string | null;
  bottleneckCount: number;
  dependencyCount: number;
  networks: NrDashNetworkBar[];
  regions: NrDashRegionalRow[];
  historySnippets: string[];
}

export interface NrDashHeatCell {
  row: string;
  col: string;
  label: string;
  tone: NationalNetworkCondition;
  title: string;
}

export type NrDashTabId = 'overview' | 'regions' | 'networks' | 'trends' | 'map';

export interface RegionMapLayoutEntry {
  regionId: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export interface RegionMapNode {
  regionId: string;
  name: string;
  color: string;
  x: number;
  y: number;
  owner: NrDashRegionalRow['owner'];
  momentumBand: string;
  openNeeds: number;
  highRisks: number;
  resilience: number | null;
  /** 0..1 visual weight from authoritative momentum history span (not simulated). */
  activityWeight: number;
  /** Map focus mode dims non-neighbor regions. */
  dimmed?: boolean;
}

export interface Agent23TestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface NrDashOwnerBreakdown {
  you: number;
  rival: number;
  neutral: number;
  unknown: number;
}

export interface NrDashMapLink {
  id: string;
  kind: 'adjacency' | 'dependency';
  fromId: string;
  toId: string;
  label: string;
  stroke: string;
  dash?: string;
  title: string;
}

// --- bundled from core/constants.ts ---
export const COMM_REGION_CODES = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;

/** Canonical REGIONS.position from V9.4 (strategic map overlay, not geographic GIS). */
export const AGENT23_REGION_MAP_LAYOUT: RegionMapLayoutEntry[] = [
  { regionId: 'QLD', name: 'Queensland', color: '#f4a261', x: 80, y: 35 },
  { regionId: 'NSW', name: 'New South Wales', color: '#e76f51', x: 80, y: 65 },
  { regionId: 'VIC', name: 'Victoria', color: '#264653', x: 65, y: 85 },
  { regionId: 'TAS', name: 'Tasmania', color: '#2a9d8f', x: 75, y: 100 },
  { regionId: 'SA', name: 'South Australia', color: '#e9c46a', x: 45, y: 75 },
  { regionId: 'WA', name: 'Western Australia', color: '#f4a261', x: 15, y: 55 },
  { regionId: 'NT', name: 'Northern Territory', color: '#e76f51', x: 45, y: 35 },
  { regionId: 'ACT', name: 'Australian Capital Territory', color: '#264653', x: 75, y: 70 },
];

export const NATIONAL_NETWORKS: NationalNetworkKind[] = [
  'freight',
  'energy',
  'water',
  'trade',
  'digital',
];

export const NATIONAL_NETWORK_LABEL: Record<NationalNetworkKind, string> = {
  freight: 'Freight',
  energy: 'Energy',
  water: 'Water',
  trade: 'Trade',
  digital: 'Digital',
};

export const NATIONAL_NETWORK_ICON: Record<NationalNetworkKind, string> = {
  freight: '🚆',
  energy: '⚡',
  water: '💧',
  trade: '🚢',
  digital: '🛰',
};

export const NATIONAL_CONDITION_LABEL: Record<NationalNetworkCondition, string> = {
  surplus: 'Surplus',
  healthy: 'Healthy',
  strained: 'Strained',
  bottlenecked: 'Bottlenecked',
  critical: 'Critical',
};

export const NATIONAL_CONDITION_ICON: Record<NationalNetworkCondition, string> = {
  surplus: '✚',
  healthy: '✓',
  strained: '●',
  bottlenecked: '⚠',
  critical: '⛔',
};

export const NATIONAL_RESILIENCE_LABEL: Record<NationalResilienceBand, string> = {
  fragile: 'Fragile',
  exposed: 'Exposed',
  stable: 'Stable',
  resilient: 'Resilient',
  highly_resilient: 'Highly resilient',
};

export const LR_DEV_LABEL: Record<LRDevTier, string> = {
  underdeveloped: 'Underdeveloped',
  emerging: 'Emerging',
  developing: 'Developing',
  advanced: 'Advanced',
  highly_developed: 'Highly Developed',
};

export const LR_MOMENTUM_LABEL: Record<LRMomentumBand, string> = {
  declining: 'Declining',
  weakening: 'Weakening',
  stable: 'Stable',
  growing: 'Growing',
  rapid_growth: 'Rapid Growth',
  booming: 'Booming',
};

export const LR_ECON_LABEL: Record<LREconomyBand, string> = {
  depressed: 'Depressed',
  weak: 'Weak',
  moderate: 'Moderate',
  strong: 'Strong',
  booming: 'Booming',
};

export const NR_DASH_COND_COLOR: Record<NationalNetworkCondition, string> = {
  surplus: '#34d399',
  healthy: '#5eead4',
  strained: '#fbbf24',
  bottlenecked: '#fb923c',
  critical: '#f87171',
};

export const NR_DASH_TAB_ORDER = [
  'overview',
  'regions',
  'networks',
  'trends',
  'map',
] as const;

export const NR_DASH_TAB_LABELS: Record<(typeof NR_DASH_TAB_ORDER)[number], string> = {
  overview: 'National overview',
  regions: 'Regional compare',
  networks: 'Network matrix',
  trends: 'Turning points',
  map: 'Strategic map',
};

export const NR_DASH_MOM_RANK: Record<LRMomentumBand, number> = {
  declining: 0,
  weakening: 1,
  stable: 2,
  growing: 3,
  rapid_growth: 4,
  booming: 5,
};

export const NS_COND_RANK: Record<NationalNetworkCondition, number> = {
  surplus: 0,
  healthy: 1,
  strained: 2,
  bottlenecked: 3,
  critical: 4,
};

// --- bundled from core/util.ts ---
export function nrDashClamp01(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

export function nrDashOwnerLabel(o: 'you' | 'rival' | 'neutral' | 'unknown'): string {
  return o === 'you' ? 'You' : o === 'rival' ? 'Rival' : o === 'neutral' ? 'Neutral' : '—';
}

/** Activity weight from momentum history span only (state field, no simulation). */
export function nrDashHistoryActivityWeight(history: number[]): number {
  const pts = (history || []).filter(v => Number.isFinite(v));
  if (pts.length < 2) return 0.35;
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min;
  return nrDashClamp01(span / (Math.abs(max) + 1 || 1));
}

// --- bundled from core/auth-snapshot.ts ---
/** Build a dashboard snapshot from authoritative views only (no recompute). */
export function nrDashBuildAuthSnapshot(
  turn: number,
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  owners: Record<string, 'you' | 'rival' | 'neutral'> | null
): NrDashAuthSnapshot | null {
  if (!lr && !ns) return null;
  const provenance: NrDashProvenance[] = [];
  if (lr) {
    provenance.push({
      source: 'living_regions',
      revision: lr.state.revision,
      turn,
      detail: `regions=${Object.keys(lr.state.regions).length} derived=${lr.state.derived.length}`,
    });
  }
  if (ns) {
    provenance.push({
      source: 'national_systems',
      revision: ns.revision,
      turn: ns.turn ?? turn,
      detail: `bottlenecks=${ns.bottlenecks.length} deps=${ns.dependencies.length}`,
    });
  }

  const networks: NrDashNetworkBar[] = ns
    ? NATIONAL_NETWORKS.map(n => {
        const x = ns.national[n];
        return {
          network: n,
          label: NATIONAL_NETWORK_LABEL[n],
          icon: NATIONAL_NETWORK_ICON[n],
          utilization: nrDashClamp01(x.utilization),
          condition: x.condition,
          bottlenecks: x.bottlenecks,
        };
      })
    : [];

  const regions: NrDashRegionalRow[] = lr
    ? Object.values(lr.state.regions)
        .map(reg => {
          const nsReg = ns?.regions[reg.regionId];
          return {
            regionId: reg.regionId,
            name: reg.name,
            owner: owners?.[reg.regionId] || 'unknown',
            developmentTier: LR_DEV_LABEL[reg.development.tier],
            economyBand: LR_ECON_LABEL[reg.economy.band],
            momentumBand: LR_MOMENTUM_LABEL[reg.momentum.band],
            momentumHistory: reg.momentum.history.slice(-12),
            resilience: nsReg ? Math.round(nsReg.resilience) : null,
            resilienceBand: nsReg ? NATIONAL_RESILIENCE_LABEL[nsReg.resilienceBand] : null,
            openNeeds: reg.needs.filter(n => n.status === 'open').length,
            highRisks: reg.risks.filter(r => r.severity === 'high').length,
            primaryConstraint: nsReg?.primaryConstraint ?? null,
          };
        })
        .sort((a, b) => a.regionId.localeCompare(b.regionId))
    : [];

  const historySnippets: string[] = [];
  if (ns?.history.length) {
    historySnippets.push(...ns.history.slice(-4).reverse().map(h => `R${h.turn}: ${h.summary}`));
  }
  if (lr) {
    const majors = lr.state.derived
      .filter(d => d.significance === 'major')
      .slice(-3)
      .reverse()
      .map(d => `R${d.turn}: ${d.text}`);
    historySnippets.push(...majors);
  }

  return {
    turn,
    provenance,
    nationalResilience: ns ? Math.round(ns.national.resilienceScore) : null,
    nationalResilienceBand: ns ? NATIONAL_RESILIENCE_LABEL[ns.national.resilienceBand] : null,
    bottleneckCount: ns?.bottlenecks.length ?? 0,
    dependencyCount: ns?.dependencies.length ?? 0,
    networks,
    regions,
    historySnippets: historySnippets.slice(0, 8),
  };
}

// --- bundled from core/heat-matrix.ts ---
export function nrDashBuildHeatCells(ns: NationalSystemsState | null): {
  cells: NrDashHeatCell[];
  rows: string[];
  cols: string[];
} {
  if (!ns) return { cells: [], rows: [], cols: [] };
  const rows = Object.values(ns.regions)
    .sort((a, b) => a.regionId.localeCompare(b.regionId))
    .map(r => r.regionId);
  const cols = NATIONAL_NETWORKS.map(n => NATIONAL_NETWORK_LABEL[n]);
  const cells: NrDashHeatCell[] = [];
  for (const reg of Object.values(ns.regions)) {
    for (const n of NATIONAL_NETWORKS) {
      const x = reg.networks[n];
      cells.push({
        row: reg.regionId,
        col: NATIONAL_NETWORK_LABEL[n],
        label: NATIONAL_CONDITION_LABEL[x.condition],
        tone: x.condition,
        title: `${reg.name} ${NATIONAL_NETWORK_LABEL[n]}: ${NATIONAL_CONDITION_LABEL[x.condition]} (${Math.round(x.utilization * 100)}% used)`,
      });
    }
  }
  return { cells, rows, cols };
}

// --- bundled from core/region-map-model.ts ---
/**
 * Merge layout constants with rows from an authoritative snapshot.
 * Missing regions in snap still appear with neutral defaults (layout-only).
 */
export function nrDashBuildRegionMapNodes(snap: NrDashAuthSnapshot | null): RegionMapNode[] {
  const byId = new Map((snap?.regions || []).map(r => [r.regionId, r]));
  return AGENT23_REGION_MAP_LAYOUT.map(layout => {
    const row = byId.get(layout.regionId);
    return {
      regionId: layout.regionId,
      name: layout.name,
      color: layout.color,
      x: layout.x,
      y: layout.y,
      owner: row?.owner ?? 'unknown',
      momentumBand: row?.momentumBand ?? '—',
      openNeeds: row?.openNeeds ?? 0,
      highRisks: row?.highRisks ?? 0,
      resilience: row?.resilience ?? null,
      activityWeight: nrDashHistoryActivityWeight(row?.momentumHistory ?? []),
    };
  });
}

// --- bundled from core/adjacency.ts ---
/** Land adjacency for strategic map overlays (canonical V9.4 COMM graph). */
export const AGENT23_ADJACENT_REGIONS: Record<string, string[]> = {
  QLD: ['NT', 'NSW', 'SA'],
  NSW: ['QLD', 'VIC', 'SA', 'ACT'],
  VIC: ['NSW', 'SA', 'TAS'],
  TAS: ['VIC'],
  SA: ['WA', 'NT', 'QLD', 'NSW', 'VIC'],
  WA: ['SA', 'NT'],
  NT: ['WA', 'SA', 'QLD'],
  ACT: ['NSW'],
};

export function agent23NormalizeCorridor(a: string, b: string): string {
  return [a, b].sort().join('-');
}

/** Unique undirected adjacency pairs for map link layer. */
export function agent23ListAdjacencyPairs(): Array<{ a: string; b: string; key: string }> {
  const seen = new Set<string>();
  const out: Array<{ a: string; b: string; key: string }> = [];
  Object.entries(AGENT23_ADJACENT_REGIONS).forEach(([a, list]) => {
    (list || []).forEach(b => {
      const key = agent23NormalizeCorridor(a, b);
      if (seen.has(key)) return;
      seen.add(key);
      const [x, y] = [a, b].sort();
      out.push({ a: x, b: y, key });
    });
  });
  return out.sort((p, q) => p.key.localeCompare(q.key));
}

// --- bundled from core/analytics.ts ---
export interface NrDashRegionalLeader {
  regionId: string;
  name: string;
  momentumBand: string;
  rank: number;
  openNeeds: number;
  highRisks: number;
}

export interface NrDashOwnerBreakdown {
  you: number;
  rival: number;
  neutral: number;
  unknown: number;
}

export interface NrDashNetworkStressRow {
  network: NationalNetworkKind;
  peakUtilization: number;
  worstRegionId: string | null;
  worstCondition: NationalNetworkCondition | null;
}

export interface NrDashCompareInsights {
  ownerBreakdown: NrDashOwnerBreakdown;
  momentumLeaders: NrDashRegionalLeader[];
  momentumLaggards: NrDashRegionalLeader[];
  totalOpenNeeds: number;
  totalHighRisks: number;
  networkStress: NrDashNetworkStressRow[];
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

function rowToLeader(r: NrDashRegionalRow): NrDashRegionalLeader {
  return {
    regionId: r.regionId,
    name: r.name,
    momentumBand: r.momentumBand,
    rank: momentumRank(r.momentumBand),
    openNeeds: r.openNeeds,
    highRisks: r.highRisks,
  };
}

export function nrDashBuildOwnerBreakdown(snap: NrDashAuthSnapshot): NrDashOwnerBreakdown {
  const out: NrDashOwnerBreakdown = { you: 0, rival: 0, neutral: 0, unknown: 0 };
  snap.regions.forEach(r => {
    out[r.owner] += 1;
  });
  return out;
}

export function nrDashBuildRegionalLeaders(snap: NrDashAuthSnapshot, limit = 3): {
  leaders: NrDashRegionalLeader[];
  laggards: NrDashRegionalLeader[];
} {
  const ranked = snap.regions.map(rowToLeader).sort((a, b) => b.rank - a.rank || a.regionId.localeCompare(b.regionId));
  return {
    leaders: ranked.slice(0, limit),
    laggards: ranked.slice(-limit).reverse(),
  };
}

export function nrDashBuildNetworkStress(ns: NationalSystemsState | null): NrDashNetworkStressRow[] {
  if (!ns) return [];
  const kinds: NationalNetworkKind[] = ['freight', 'energy', 'water', 'trade', 'digital'];
  return kinds.map(network => {
    let peak = 0;
    let worstRegionId: string | null = null;
    let worstCondition: NationalNetworkCondition | null = null;
    Object.values(ns.regions).forEach(reg => {
      const cell = reg.networks[network];
      if (!cell) return;
      if (cell.utilization >= peak) {
        peak = cell.utilization;
        worstRegionId = reg.regionId;
        worstCondition = cell.condition;
      }
    });
    return { network, peakUtilization: peak, worstRegionId, worstCondition };
  });
}

/** Insights derived only from snapshot rows + NS region network cells. */
export function nrDashBuildCompareInsights(
  snap: NrDashAuthSnapshot,
  ns: NationalSystemsState | null
): NrDashCompareInsights {
  const { leaders, laggards } = nrDashBuildRegionalLeaders(snap, 3);
  return {
    ownerBreakdown: nrDashBuildOwnerBreakdown(snap),
    momentumLeaders: leaders,
    momentumLaggards: laggards,
    totalOpenNeeds: snap.regions.reduce((s, r) => s + r.openNeeds, 0),
    totalHighRisks: snap.regions.reduce((s, r) => s + r.highRisks, 0),
    networkStress: nrDashBuildNetworkStress(ns),
  };
}

// --- bundled from core/map-links.ts ---
function layoutById(layout: RegionMapLayoutEntry[]): Map<string, RegionMapLayoutEntry> {
  return new Map(layout.map(l => [l.regionId, l]));
}

export function nrDashBuildAdjacencyLinks(layout: RegionMapLayoutEntry[]): NrDashMapLink[] {
  const pos = layoutById(layout);
  return agent23ListAdjacencyPairs()
    .filter(p => pos.has(p.a) && pos.has(p.b))
    .map(p => ({
      id: `adj_${p.key}`,
      kind: 'adjacency' as const,
      fromId: p.a,
      toId: p.b,
      label: p.key,
      stroke: '#475569',
      dash: '2 2',
      title: `Land corridor ${p.a}–${p.b}`,
    }));
}

export function nrDashBuildDependencyLinks(
  ns: NationalSystemsState | null,
  layout: RegionMapLayoutEntry[]
): NrDashMapLink[] {
  if (!ns) return [];
  const pos = layoutById(layout);
  return ns.dependencies
    .filter(d => pos.has(d.consumerRegionId) && pos.has(d.providerRegionId))
    .map(d => {
      const prov = ns.regions[d.providerRegionId];
      const cond = prov?.networks[d.network]?.condition ?? 'strained';
      return {
        id: `dep_${d.id}`,
        kind: 'dependency' as const,
        fromId: d.consumerRegionId,
        toId: d.providerRegionId,
        label: d.network,
        stroke: NR_DASH_COND_COLOR[cond],
        title: `${d.consumerRegionId} depends on ${d.providerRegionId} (${d.network}, ${d.importance})`,
      };
    });
}

export function nrDashMergeMapLinks(adjacency: NrDashMapLink[], dependency: NrDashMapLink[]): NrDashMapLink[] {
  return [...adjacency, ...dependency];
}

export function nrDashLinkEndpoints(
  link: NrDashMapLink,
  nodes: RegionMapNode[]
): { x1: number; y1: number; x2: number; y2: number } | null {
  const a = nodes.find(n => n.regionId === link.fromId);
  const b = nodes.find(n => n.regionId === link.toId);
  if (!a || !b) return null;
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}

// --- bundled from core/bottleneck-rollup.ts ---
export interface NrDashBottleneckRow {
  id: string;
  regionId: string | null;
  network: string | null;
  severity: string | null;
  label: string;
}

export function nrDashBuildBottleneckRollup(ns: NationalSystemsState | null): NrDashBottleneckRow[] {
  if (!ns) return [];
  return ns.bottlenecks.map(b => ({
    id: b.id,
    regionId: b.regionId ?? null,
    network: b.network ? NATIONAL_NETWORK_LABEL[b.network] : null,
    severity: b.severity ?? null,
    label: [b.regionId, b.network, b.severity].filter(Boolean).join(' · ') || b.id,
  }));
}

// --- bundled from core/condition-catalog.ts ---
export interface NrDashConditionBucket {
  network: NationalNetworkKind;
  networkLabel: string;
  condition: NationalNetworkCondition;
  conditionLabel: string;
  regionCount: number;
}

/** Count regions in each network×condition bucket (authoritative NS cells only). */
export function nrDashBuildConditionCatalog(ns: NationalSystemsState | null): NrDashConditionBucket[] {
  if (!ns) return [];
  const counts = new Map<string, number>();
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(network => {
      const cond = reg.networks[network]?.condition ?? 'healthy';
      const key = `${network}:${cond}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });
  const out: NrDashConditionBucket[] = [];
  NATIONAL_NETWORKS.forEach(network => {
    const conditions: NationalNetworkCondition[] = ['surplus', 'healthy', 'strained', 'bottlenecked', 'critical'];
    conditions.forEach(condition => {
      const regionCount = counts.get(`${network}:${condition}`) || 0;
      if (regionCount === 0) return;
      out.push({
        network,
        networkLabel: NATIONAL_NETWORK_LABEL[network],
        condition,
        conditionLabel: NATIONAL_CONDITION_LABEL[condition],
        regionCount,
      });
    });
  });
  return out;
}

// --- bundled from core/momentum-divergence.ts ---
export interface NrDashMomentumDivergence {
  minRank: number;
  maxRank: number;
  spread: number;
  /** Mean absolute deviation from median rank (state rows only). */
  dispersion: number;
  hottestRegionId: string | null;
  coldestRegionId: string | null;
}

function rankRow(r: NrDashRegionalRow): number {
  return NR_DASH_MOM_RANK[r.momentumBand as LRMomentumBand] ?? 2;
}

export function nrDashBuildMomentumDivergence(snap: NrDashAuthSnapshot): NrDashMomentumDivergence | null {
  if (!snap.regions.length) return null;
  const ranks = snap.regions.map(r => ({ id: r.regionId, rank: rankRow(r) }));
  const values = ranks.map(r => r.rank);
  const minRank = Math.min(...values);
  const maxRank = Math.max(...values);
  const median = values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 2;
  const dispersion =
    values.reduce((s, v) => s + Math.abs(v - median), 0) / Math.max(1, values.length);
  const hottest = ranks.find(r => r.rank === maxRank);
  const coldest = ranks.find(r => r.rank === minRank);
  return {
    minRank,
    maxRank,
    spread: maxRank - minRank,
    dispersion: Math.round(dispersion * 100) / 100,
    hottestRegionId: hottest?.id ?? null,
    coldestRegionId: coldest?.id ?? null,
  };
}

// --- bundled from core/map-focus.ts ---
export function nrDashLinksTouchingRegion(links: NrDashMapLink[], regionId: string | null): NrDashMapLink[] {
  if (!regionId) return links;
  return links.filter(l => l.fromId === regionId || l.toId === regionId);
}

export function nrDashNeighborRegionIds(regionId: string): string[] {
  return [...(AGENT23_ADJACENT_REGIONS[regionId] || [])];
}

export function nrDashApplyMapFocus(
  nodes: RegionMapNode[],
  focusRegionId: string | null
): RegionMapNode[] {
  if (!focusRegionId) return nodes.map(n => ({ ...n, dimmed: false }));
  const neighbors = new Set(nrDashNeighborRegionIds(focusRegionId));
  neighbors.add(focusRegionId);
  return nodes.map(n => ({
    ...n,
    dimmed: !neighbors.has(n.regionId),
  }));
}

// --- bundled from core/trend-delta.ts ---
export interface NrDashTrendDeltaRow {
  regionId: string;
  name: string;
  delta: number | null;
  last: number | null;
}

/** Last-minus-first delta from authoritative momentum.history (no forecasting). */
export function nrDashBuildTrendDeltas(rows: NrDashRegionalRow[]): NrDashTrendDeltaRow[] {
  return rows.map(r => {
    const pts = (r.momentumHistory || []).filter(v => Number.isFinite(v));
    if (pts.length < 2) {
      return { regionId: r.regionId, name: r.name, delta: null, last: pts[pts.length - 1] ?? null };
    }
    const first = pts[0];
    const last = pts[pts.length - 1];
    return {
      regionId: r.regionId,
      name: r.name,
      delta: Math.round((last - first) * 1000) / 1000,
      last,
    };
  });
}

export function nrDashTopTrendMovers(rows: NrDashRegionalRow[], limit = 3): NrDashTrendDeltaRow[] {
  return nrDashBuildTrendDeltas(rows)
    .filter(r => r.delta != null)
    .sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!))
    .slice(0, limit);
}

// --- bundled from core/constraint-profile.ts ---
export interface NrDashConstraintCount {
  network: NationalNetworkKind;
  label: string;
  regionCount: number;
}

/** Count regions whose primaryConstraint matches each network (NS authoritative). */
export function nrDashBuildConstraintProfile(ns: NationalSystemsState | null): NrDashConstraintCount[] {
  if (!ns) return [];
  const counts: Record<NationalNetworkKind, number> = {
    freight: 0,
    energy: 0,
    water: 0,
    trade: 0,
    digital: 0,
  };
  Object.values(ns.regions).forEach(r => {
    if (r.primaryConstraint) counts[r.primaryConstraint] += 1;
  });
  return NATIONAL_NETWORKS.map(network => ({
    network,
    label: NATIONAL_NETWORK_LABEL[network],
    regionCount: counts[network],
  })).filter(x => x.regionCount > 0);
}

// --- bundled from core/resilience-spread.ts ---
export interface NrDashResilienceSpread {
  min: number;
  max: number;
  mean: number;
  sampleSize: number;
  weakestRegionId: string | null;
  strongestRegionId: string | null;
}

export function nrDashBuildResilienceSpread(snap: NrDashAuthSnapshot): NrDashResilienceSpread | null {
  const vals = snap.regions
    .filter(r => r.resilience != null && Number.isFinite(r.resilience))
    .map(r => ({ id: r.regionId, v: r.resilience as number }));
  if (!vals.length) return null;
  const numbers = vals.map(x => x.v);
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const mean = Math.round((numbers.reduce((a, b) => a + b, 0) / numbers.length) * 10) / 10;
  const weakest = vals.find(x => x.v === min);
  const strongest = vals.find(x => x.v === max);
  return {
    min,
    max,
    mean,
    sampleSize: vals.length,
    weakestRegionId: weakest?.id ?? null,
    strongestRegionId: strongest?.id ?? null,
  };
}

// --- bundled from core/dependency-profile.ts ---
export interface NrDashDependencyImportanceCount {
  importance: NationalDependency['importance'];
  count: number;
}

export function nrDashBuildDependencyProfile(ns: NationalSystemsState | null): NrDashDependencyImportanceCount[] {
  if (!ns?.dependencies.length) return [];
  const counts: Record<NationalDependency['importance'], number> = {
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  ns.dependencies.forEach(d => {
    counts[d.importance] = (counts[d.importance] || 0) + 1;
  });
  return (['critical', 'high', 'moderate', 'low'] as const)
    .map(importance => ({ importance, count: counts[importance] }))
    .filter(x => x.count > 0);
}

// --- bundled from core/heat-summary.ts ---
export interface NrDashHeatRowSummary {
  regionId: string;
  worstCondition: NationalNetworkCondition;
  worstLabel: string;
  strainedNetworks: number;
}

const condRank = (c: NationalNetworkCondition) => NS_COND_RANK[c];

/** Per-region worst network condition from heat matrix cells (NS only). */
export function nrDashBuildHeatRowSummaries(ns: NationalSystemsState | null): NrDashHeatRowSummary[] {
  if (!ns) return [];
  const { cells, rows } = nrDashBuildHeatCells(ns);
  return rows.map(regionId => {
    const rowCells = cells.filter(c => c.row === regionId);
    let worst: NationalNetworkCondition = 'healthy';
    let strained = 0;
    rowCells.forEach(c => {
      if (condRank(c.tone) >= condRank('strained')) strained += 1;
      if (condRank(c.tone) > condRank(worst)) worst = c.tone;
    });
    return {
      regionId,
      worstCondition: worst,
      worstLabel: NATIONAL_CONDITION_LABEL[worst],
      strainedNetworks: strained,
    };
  });
}

// --- bundled from core/parity-gap.ts ---
export interface NrDashParityGapRow {
  regionId: string;
  name: string;
  momentumRank: number;
  resilience: number | null;
  /** resilience minus normalized momentum rank (0..100 scale), when resilience present. */
  gapScore: number | null;
}

function momRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Compare LR momentum band rank to NS resilience score (both from snapshot row). */
export function nrDashBuildParityGapRows(snap: NrDashAuthSnapshot): NrDashParityGapRow[] {
  return snap.regions.map(r => {
    const momentumRank = momRank(r.momentumBand);
    const normalizedMom = (momentumRank / 5) * 100;
    const gapScore =
      r.resilience != null ? Math.round((r.resilience - normalizedMom) * 10) / 10 : null;
    return {
      regionId: r.regionId,
      name: r.name,
      momentumRank,
      resilience: r.resilience,
      gapScore,
    };
  });
}

export function nrDashTopParityOutliers(snap: NrDashAuthSnapshot, limit = 3): NrDashParityGapRow[] {
  return nrDashBuildParityGapRows(snap)
    .filter(r => r.gapScore != null)
    .sort((a, b) => Math.abs(b.gapScore!) - Math.abs(a.gapScore!))
    .slice(0, limit);
}

// --- bundled from tests/fixtures.ts ---
function emptyNetworks(): Record<NationalNetworkKind, NationalRegionSystemsState['networks']['freight']> {
  const base = { utilization: 0.4, condition: 'healthy' as const };
  return {
    freight: { ...base },
    energy: { ...base },
    water: { ...base },
    trade: { ...base },
    digital: { ...base },
  };
}

function variedNetworks(code: string): NationalRegionSystemsState['networks'] {
  const n = emptyNetworks();
  if (code === 'NSW') n.freight = { utilization: 0.92, condition: 'bottlenecked' };
  if (code === 'VIC') n.energy = { utilization: 0.88, condition: 'critical' };
  return n;
}

export function createAgent23LrFixture(): LivingRegionsWorldView {
  const regions: Record<string, DynamicRegionalState> = {};
  COMM_REGION_CODES.forEach((code, i) => {
    regions[code] = {
      regionId: code,
      name: code,
      development: { tier: i % 2 === 0 ? 'developing' : 'advanced' },
      economy: { band: 'moderate' },
      momentum: { band: 'stable', history: [1 + i * 0.1, 1.2 + i * 0.1, 1.15 + i * 0.1] },
      needs: [{ category: 'transport', status: 'open', severity: 'moderate' }],
      risks: i === 0 ? [{ severity: 'high' }] : [],
    };
  });
  const state: LivingRegionsState = {
    revision: 3,
    regions,
    derived: [{ turn: 4, text: 'NSW momentum ticked up', significance: 'major' }],
  };
  return { state };
}

export function createAgent23NsFixture(): NationalSystemsState {
  const regions: Record<string, NationalRegionSystemsState> = {};
  COMM_REGION_CODES.forEach(code => {
    regions[code] = {
      regionId: code,
      name: code,
      networks: variedNetworks(code),
      primaryConstraint: 'freight',
      resilience: 55,
      resilienceBand: 'stable',
    };
  });
  const national = {} as NationalSystemsState['national'];
  NATIONAL_NETWORKS.forEach((n, i) => {
    national[n] = {
      utilization: 0.35 + i * 0.05,
      condition: 'healthy',
      bottlenecks: 0,
    };
  });
  national.resilienceScore = 58;
  national.resilienceBand = 'stable';
  return {
    revision: 2,
    turn: 5,
    regions,
    bottlenecks: [{ id: 'bn1', regionId: 'NSW', network: 'freight', severity: 'meaningful' }],
    dependencies: [
      { id: 'dep1', consumerRegionId: 'SA', providerRegionId: 'NSW', network: 'energy', importance: 'high' },
      { id: 'dep2', consumerRegionId: 'TAS', providerRegionId: 'VIC', network: 'freight', importance: 'moderate' },
      { id: 'dep3', consumerRegionId: 'NT', providerRegionId: 'QLD', network: 'water', importance: 'critical' },
    ],
    national,
    history: [{ turn: 5, summary: 'Freight corridor strained in NSW' }],
  };
}

// --- bundled from ui/charts.tsx ---
export interface NrDashSparklineProps {
  values: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  ariaLabel: string;
}

export const NrDashSparkline: React.FC<NrDashSparklineProps> = ({
  values,
  width = 120,
  height = 28,
  stroke = '#38bdf8',
  fill = 'rgba(56,189,248,0.15)',
  ariaLabel,
}) => {
  const pts = (values || []).filter(v => Number.isFinite(v));
  if (pts.length < 2) {
    return (
      <svg width={width} height={height} aria-label={ariaLabel} role="img" data-testid="nr-dash-sparkline-empty">
        <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#475569" strokeDasharray="4 3" />
      </svg>
    );
  }
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const span = max - min || 1;
  const coords = pts.map((v, i) => {
    const x = (i / (pts.length - 1)) * width;
    const y = height - 2 - ((v - min) / span) * (height - 4);
    return `${x},${y}`;
  });
  const poly = `${coords.join(' ')} ${width},${height} 0,${height}`;
  return (
    <svg width={width} height={height} aria-label={ariaLabel} role="img" data-testid="nr-dash-sparkline">
      <polygon points={poly} fill={fill} stroke="none" />
      <polyline
        points={coords.join(' ')}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

export interface NrDashBarChartProps {
  items: Array<{ key: string; label: string; value: number; sublabel?: string; color?: string }>;
  maxValue?: number;
  height?: number;
}

export const NrDashBarChart: React.FC<NrDashBarChartProps> = ({ items, maxValue }) => {
  const max = maxValue ?? Math.max(1, ...items.map(i => i.value));
  return (
    <div className="space-y-1" data-testid="nr-dash-bar-chart" role="list">
      {items.map(it => (
        <div key={it.key} role="listitem" className="grid grid-cols-[minmax(6rem,8rem)_1fr_auto] gap-2 items-center text-xs">
          <span className="truncate opacity-90" title={it.label}>
            {it.label}
          </span>
          <div className="h-3 bg-slate-800 rounded overflow-hidden" aria-hidden="true">
            <div
              className="h-full rounded transition-all duration-300"
              style={{
                width: `${Math.round(nrDashClamp01(it.value / max) * 100)}%`,
                background: it.color || '#38bdf8',
              }}
            />
          </div>
          <span className="font-mono opacity-80 w-10 text-right">
            {Math.round(it.value * (max <= 1 ? 100 : 1))}
            {max <= 1 ? '%' : ''}
          </span>
        </div>
      ))}
    </div>
  );
};

export const NrDashHeatMatrix: React.FC<{
  cells: NrDashHeatCell[];
  rowLabels: string[];
  colLabels: string[];
}> = ({ cells, rowLabels, colLabels }) => (
  <div className="overflow-x-auto" data-testid="nr-dash-heat-matrix">
    <table className="text-[10px] border-collapse min-w-full">
      <thead>
        <tr>
          <th className="p-1 text-left opacity-70" />
          {colLabels.map(c => (
            <th key={c} className="p-1 font-normal opacity-80">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowLabels.map(row => (
          <tr key={row}>
            <th className="p-1 text-left font-semibold pr-2">{row}</th>
            {colLabels.map(col => {
              const cell = cells.find(x => x.row === row && x.col === col);
              const bg = cell ? NR_DASH_COND_COLOR[cell.tone as NationalNetworkCondition] : '#334155';
              return (
                <td key={col} className="p-0.5">
                  <div
                    className="w-8 h-6 rounded border border-slate-700/80 flex items-center justify-center text-[9px]"
                    style={{ backgroundColor: `${bg}33`, borderColor: bg }}
                    title={cell?.title || 'No data'}
                  >
                    {cell ? NATIONAL_CONDITION_ICON[cell.tone as NationalNetworkCondition] : '·'}
                  </div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

// --- bundled from ui/compare-insights.tsx ---
export const NrDashCompareInsightsPanel: React.FC<{
  insights: NrDashCompareInsights;
  divergence?: NrDashMomentumDivergence | null;
  conditionBuckets?: NrDashConditionBucket[];
}> = ({ insights, divergence, conditionBuckets = [] }) => (
  <div className="grid md:grid-cols-2 gap-3 text-xs" data-testid="nr-dash-compare-insights">
    <div className="rounded border border-slate-600/50 p-2">
      <div className="font-semibold mb-1">Regional control (snapshot)</div>
      <div>You {insights.ownerBreakdown.you} · Rival {insights.ownerBreakdown.rival} · Neutral {insights.ownerBreakdown.neutral}</div>
      <div className="opacity-75 mt-1">
        Open needs Σ {insights.totalOpenNeeds} · High risks Σ {insights.totalHighRisks}
      </div>
    </div>
    <div className="rounded border border-slate-600/50 p-2">
      <div className="font-semibold mb-1">Momentum leaders</div>
      <ul className="list-disc list-inside">
        {insights.momentumLeaders.map(l => (
          <li key={l.regionId}>
            {l.name} ({l.momentumBand})
          </li>
        ))}
      </ul>
    </div>
    <div className="rounded border border-slate-600/50 p-2 md:col-span-2">
      <div className="font-semibold mb-1">Network stress (peak utilization by network)</div>
      <div className="flex flex-wrap gap-2">
        {insights.networkStress.map(s => (
          <span key={s.network} className="px-1.5 py-0.5 rounded bg-slate-800/80">
            {NATIONAL_NETWORK_LABEL[s.network]} {Math.round(s.peakUtilization * 100)}%
            {s.worstRegionId ? ` @ ${s.worstRegionId}` : ''}
          </span>
        ))}
      </div>
    </div>
    {divergence && (
      <div className="rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-divergence">
        <div className="font-semibold mb-1">Momentum divergence</div>
        <div>
          Spread {divergence.spread} · dispersion {divergence.dispersion} · hot {divergence.hottestRegionId ?? '—'} · cold{' '}
          {divergence.coldestRegionId ?? '—'}
        </div>
      </div>
    )}
    {conditionBuckets.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2 md:col-span-2" data-testid="nr-dash-condition-catalog">
        <div className="font-semibold mb-1">Network condition counts (regions)</div>
        <div className="flex flex-wrap gap-1">
          {conditionBuckets.slice(0, 12).map(b => (
            <span key={`${b.network}-${b.condition}`} className="px-1 py-0.5 rounded bg-slate-800/70">
              {b.networkLabel} {b.conditionLabel}: {b.regionCount}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// --- bundled from ui/map-legend.tsx ---
export const NrDashMapLegend: React.FC = () => (
  <div className="flex flex-wrap gap-3 text-[10px] opacity-80" data-testid="nr-dash-map-legend">
    <span>— — land adjacency</span>
    <span>—— NS dependency (color = provider network condition)</span>
    <span>Ring: you / rival / neutral</span>
    <span>Dim: outside focus neighborhood</span>
  </div>
);

// --- bundled from ui/network-depth-panel.tsx ---
export const NrDashNetworkDepthPanel: React.FC<{
  constraints: NrDashConstraintCount[];
  dependencies: NrDashDependencyImportanceCount[];
  heatRows: NrDashHeatRowSummary[];
}> = ({ constraints, dependencies, heatRows }) => (
  <div className="grid md:grid-cols-2 gap-3 text-xs" data-testid="nr-dash-network-depth">
    {constraints.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2">
        <div className="font-semibold mb-1">Primary constraints (regions)</div>
        <ul className="list-disc list-inside">
          {constraints.map(c => (
            <li key={c.network}>
              {c.label}: {c.regionCount}
            </li>
          ))}
        </ul>
      </div>
    )}
    {dependencies.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2">
        <div className="font-semibold mb-1">Dependency importance</div>
        <ul className="list-disc list-inside">
          {dependencies.map(d => (
            <li key={d.importance}>
              {d.importance}: {d.count}
            </li>
          ))}
        </ul>
      </div>
    )}
    {heatRows.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2 md:col-span-2">
        <div className="font-semibold mb-1">Regional worst network condition</div>
        <div className="flex flex-wrap gap-1">
          {heatRows.map(h => (
            <span key={h.regionId} className="px-1 py-0.5 rounded bg-slate-800/70">
              {h.regionId} {h.worstLabel}
              {h.strainedNetworks > 0 ? ` (${h.strainedNetworks} strained+)` : ''}
            </span>
          ))}
        </div>
      </div>
    )}
  </div>
);

// --- bundled from ui/regions-depth-strip.tsx ---
export const NrDashRegionsDepthStrip: React.FC<{
  spread: NrDashResilienceSpread | null;
  outliers: NrDashParityGapRow[];
}> = ({ spread, outliers }) => (
  <div className="text-xs space-y-2 mb-3" data-testid="nr-dash-regions-depth">
    {spread && (
      <div className="rounded border border-slate-600/50 p-2">
        Resilience spread: {spread.min}–{spread.max} (μ {spread.mean}, n={spread.sampleSize}) · weak{' '}
        {spread.weakestRegionId ?? '—'} · strong {spread.strongestRegionId ?? '—'}
      </div>
    )}
    {outliers.length > 0 && (
      <div className="rounded border border-slate-600/50 p-2">
        <div className="font-semibold mb-1">Momentum vs resilience gap (|gap| leaders)</div>
        <ul className="list-disc list-inside">
          {outliers.map(o => (
            <li key={o.regionId}>
              {o.name}: gap {o.gapScore} (mom rank {o.momentumRank}, res {o.resilience})
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// --- bundled from ui/region-position-map.tsx ---
export interface RegionPositionMapProps {
  nodes: RegionMapNode[];
  links?: NrDashMapLink[];
  focusRegionId?: string | null;
  width?: number;
  height?: number;
  onSelect?: (regionId: string) => void;
}

const OWNER_RING: Record<RegionMapNode['owner'], string> = {
  you: '#38bdf8',
  rival: '#f87171',
  neutral: '#94a3b8',
  unknown: '#475569',
};

/** SVG strategic map — node size from momentum history activity weight in snapshot. */
export const RegionPositionMap: React.FC<RegionPositionMapProps> = ({
  nodes,
  links = [],
  focusRegionId = null,
  width = 420,
  height = 260,
  onSelect,
}) => (
  <svg
    viewBox="0 0 100 115"
    width={width}
    height={height}
    className="rounded-lg border border-slate-700 bg-slate-950/80"
    data-testid="agent23-region-position-map"
    role="img"
    aria-label="Australian regions strategic map"
  >
    <rect x={0} y={0} width={100} height={115} fill="#0f172a" />
    {links.map(link => {
      const seg = nrDashLinkEndpoints(link, nodes);
      if (!seg) return null;
      return (
        <line
          key={link.id}
          x1={seg.x1}
          y1={seg.y1}
          x2={seg.x2}
          y2={seg.y2}
          stroke={link.stroke}
          strokeWidth={link.kind === 'dependency' ? 0.9 : 0.5}
          strokeDasharray={link.dash}
          opacity={0.85}
          data-testid={`agent23-map-link-${link.id}`}
        >
          <title>{link.title}</title>
        </line>
      );
    })}
    {nodes.map(n => {
      const r = 2.2 + n.activityWeight * 2.8;
      const focused = focusRegionId === n.regionId;
      const opacity = n.dimmed ? 0.35 : 0.85;
      return (
        <g key={n.regionId} data-testid={`agent23-map-node-${n.regionId}`} opacity={opacity}>
          <circle
            cx={n.x}
            cy={n.y}
            r={r + (focused ? 1.2 : 0)}
            fill={n.color}
            fillOpacity={0.85}
            stroke={OWNER_RING[n.owner]}
            strokeWidth={focused ? 1.4 : 0.9}
            onClick={() => onSelect?.(n.regionId)}
            style={{ cursor: onSelect ? 'pointer' : 'default' }}
          />
          <text x={n.x} y={n.y + r + 4} textAnchor="middle" fontSize={3.2} fill="#e2e8f0" opacity={n.dimmed ? 0.5 : 1}>
            {n.regionId}
          </text>
          <title>
            {`${n.name} · ${nrDashOwnerLabel(n.owner)} · ${n.momentumBand} · needs ${n.openNeeds} · risks ${n.highRisks}${
              n.resilience != null ? ` · resilience ${n.resilience}` : ''
            }`}
          </title>
        </g>
      );
    })}
  </svg>
);

// --- bundled from ui/dashboard-modal.tsx ---
const NrDashProvenanceStrip: React.FC<{ items: NrDashProvenance[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-2 text-[10px] opacity-75" data-testid="nr-dash-provenance">
    {items.map((p, i) => (
      <span key={`${p.source}_${i}`} className="px-1.5 py-0.5 rounded border border-slate-600">
        {p.source === 'living_regions' ? '🗺 LR' : '🔗 NS'} rev {String(p.revision ?? '—')} · {p.detail}
      </span>
    ))}
  </div>
);

export const NrDashOverviewTab: React.FC<{
  snap: NrDashAuthSnapshot;
  nsState: NationalSystemsState | null;
  onAsk?: (q: string) => void;
}> = ({ snap, nsState, onAsk }) => (
  <div className="space-y-4" data-testid="nr-dash-tab-overview">
    <NrDashProvenanceStrip items={snap.provenance} />
    <NrDashCompareInsightsPanel
      insights={nrDashBuildCompareInsights(snap, nsState)}
      divergence={nrDashBuildMomentumDivergence(snap)}
      conditionBuckets={nrDashBuildConditionCatalog(nsState)}
    />
    <div className="grid md:grid-cols-3 gap-3 text-sm">
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">National resilience</div>
        <div className="text-xl font-bold">{snap.nationalResilienceBand ?? '—'}</div>
        <div className="text-xs opacity-80">
          {snap.nationalResilience != null ? `${snap.nationalResilience}/100` : 'National Systems off'}
        </div>
      </div>
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">Active bottlenecks</div>
        <div className="text-xl font-bold">{snap.bottleneckCount}</div>
        {onAsk && (
          <button type="button" className="text-xs underline mt-1" onClick={() => onAsk('Where are the national bottlenecks?')}>
            Ask Game AI
          </button>
        )}
      </div>
      <div className="rounded-lg border border-slate-600/50 p-3">
        <div className="text-xs opacity-70">Interregional dependencies</div>
        <div className="text-xl font-bold">{snap.dependencyCount}</div>
      </div>
    </div>
    {snap.networks.length > 0 && (
      <div>
        <h4 className="font-bold text-sm mb-2">Network utilization (authoritative)</h4>
        <NrDashBarChart
          items={snap.networks.map(n => ({
            key: n.network,
            label: `${n.icon} ${n.label}`,
            value: n.utilization,
            color: NR_DASH_COND_COLOR[n.condition],
          }))}
          maxValue={1}
        />
      </div>
    )}
  </div>
);

export const NrDashRegionsTab: React.FC<{
  snap: NrDashAuthSnapshot;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, focusRegionId, onFocusRegion }) => (
  <div className="space-y-2" data-testid="nr-dash-tab-regions">
    <NrDashProvenanceStrip items={snap.provenance.filter(p => p.source === 'living_regions')} />
    <NrDashRegionsDepthStrip
      spread={nrDashBuildResilienceSpread(snap)}
      outliers={nrDashTopParityOutliers(snap, 3)}
    />
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="opacity-70 text-left border-b border-slate-700">
            <th className="py-1 pr-2">Region</th>
            <th className="py-1 pr-2">Owner</th>
            <th className="py-1 pr-2">Economy</th>
            <th className="py-1 pr-2">Momentum</th>
            <th className="py-1 pr-2">Trend</th>
            <th className="py-1 pr-2">Needs</th>
            <th className="py-1 pr-2">Resilience</th>
          </tr>
        </thead>
        <tbody>
          {snap.regions.map(r => {
            const focused = focusRegionId === r.regionId;
            return (
              <tr
                key={r.regionId}
                className={`border-b border-slate-800/80 ${focused ? 'bg-sky-950/40' : ''}`}
                data-testid={`nr-dash-region-row-${r.regionId}`}
              >
                <td className="py-1 pr-2">
                  <button type="button" className="font-semibold underline" onClick={() => onFocusRegion?.(r.regionId)}>
                    {r.name}
                  </button>
                  <div className="opacity-60">{r.developmentTier}</div>
                </td>
                <td className="py-1 pr-2">{nrDashOwnerLabel(r.owner)}</td>
                <td className="py-1 pr-2">{r.economyBand}</td>
                <td className="py-1 pr-2">{r.momentumBand}</td>
                <td className="py-1 pr-2">
                  <NrDashSparkline values={r.momentumHistory} ariaLabel={`${r.name} momentum history`} width={100} height={24} />
                </td>
                <td className="py-1 pr-2">{r.openNeeds || '—'}</td>
                <td className="py-1 pr-2">{r.resilienceBand ?? '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>
);

export const NrDashNetworksTab: React.FC<{
  ns: NationalSystemsState | null;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}> = ({ ns, onMapNetwork }) => {
  if (!ns) {
    return (
      <p className="text-sm opacity-80" data-testid="nr-dash-networks-empty">
        National Systems data is not available in this match.
      </p>
    );
  }
  const heat = nrDashBuildHeatCells(ns);
  const bottlenecks = nrDashBuildBottleneckRollup(ns);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-networks">
      <NrDashNetworkDepthPanel
        constraints={nrDashBuildConstraintProfile(ns)}
        dependencies={nrDashBuildDependencyProfile(ns)}
        heatRows={nrDashBuildHeatRowSummaries(ns)}
      />
      <div className="flex flex-wrap gap-2">
        {NATIONAL_NETWORKS.map(n => (
          <button
            key={n}
            type="button"
            className="text-xs px-2 py-1 rounded border border-slate-600 hover:border-sky-500"
            onClick={() => onMapNetwork?.(n)}
          >
            {NATIONAL_NETWORK_ICON[n]} Map {NATIONAL_NETWORK_LABEL[n]}
          </button>
        ))}
      </div>
      <NrDashHeatMatrix cells={heat.cells} rowLabels={heat.rows} colLabels={heat.cols} />
      {bottlenecks.length > 0 && (
        <div className="text-xs" data-testid="nr-dash-bottleneck-list">
          <div className="font-semibold mb-1">Active bottlenecks (authoritative)</div>
          <ul className="list-disc list-inside opacity-90">
            {bottlenecks.map(b => (
              <li key={b.id}>{b.label}</li>
            ))}
          </ul>
        </div>
      )}
      <p className="text-[10px] opacity-70">Cell color reflects network condition from National Systems (not Living Regions).</p>
    </div>
  );
};

export const NrDashTrendsTab: React.FC<{ snap: NrDashAuthSnapshot }> = ({ snap }) => {
  const movers = nrDashTopTrendMovers(snap.regions, 5);
  return (
    <div data-testid="nr-dash-tab-trends">
      <NrDashProvenanceStrip items={snap.provenance} />
      {movers.length > 0 && (
        <div className="text-xs mb-3" data-testid="nr-dash-trend-movers">
          <div className="font-semibold mb-1">Largest momentum history deltas (authoritative)</div>
          <ul className="list-disc list-inside">
            {movers.map(m => (
              <li key={m.regionId}>
                {m.name}: Δ {m.delta} (last {m.last})
              </li>
            ))}
          </ul>
        </div>
      )}
    {snap.historySnippets.length ? (
      <ol className="text-xs space-y-1 mt-2 list-decimal list-inside">
        {snap.historySnippets.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>
    ) : (
      <p className="text-sm opacity-80">No national or major regional turning points recorded yet.</p>
    )}
    </div>
  );
};

export const NrDashMapTab: React.FC<{
  snap: NrDashAuthSnapshot;
  nsState: NationalSystemsState | null;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, nsState, focusRegionId, onFocusRegion }) => {
  const baseNodes = useMemo(() => nrDashBuildRegionMapNodes(snap), [snap]);
  const nodes = useMemo(() => nrDashApplyMapFocus(baseNodes, focusRegionId), [baseNodes, focusRegionId]);
  const allLinks = useMemo(
    () =>
      nrDashMergeMapLinks(
        nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
        nrDashBuildDependencyLinks(nsState, AGENT23_REGION_MAP_LAYOUT)
      ),
    [nsState]
  );
  const links = useMemo(
    () => (focusRegionId ? nrDashLinksTouchingRegion(allLinks, focusRegionId) : allLinks),
    [allLinks, focusRegionId]
  );
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-map">
      <NrDashProvenanceStrip items={snap.provenance} />
      <RegionPositionMap nodes={nodes} links={links} focusRegionId={focusRegionId} onSelect={onFocusRegion} />
      <NrDashMapLegend />
      <p className="text-[10px] opacity-70">
        Dashed lines: land adjacency. Solid colored lines: interregional dependencies from National Systems.
      </p>
    </div>
  );
};

export interface NationalRegionalDashboardModalProps {
  open: boolean;
  onClose: () => void;
  theme: { card?: string; border?: string; button?: string; buttonSecondary?: string; scrollbar?: string };
  turn: number;
  lrView: LivingRegionsWorldView | null;
  nsState: NationalSystemsState | null;
  nsView: NationalSystemsWorldView | null;
  focusRegionId?: string | null;
  onFocusRegion?: (id: string) => void;
  onAsk?: (q: string) => void;
  onMapNetwork?: (n: NationalNetworkKind) => void;
}

export const NationalRegionalDashboardModal: React.FC<NationalRegionalDashboardModalProps> = ({
  open,
  onClose,
  theme,
  turn,
  lrView,
  nsState,
  nsView,
  focusRegionId = null,
  onFocusRegion,
  onAsk,
  onMapNetwork,
}) => {
  const [tab, setTab] = useState<NrDashTabId>('overview');
  useEffect(() => {
    if (open) setTab('overview');
  }, [open]);
  const snap = useMemo(
    () => nrDashBuildAuthSnapshot(turn, lrView, nsState, nsView?.regionOwners || null),
    [turn, lrView, nsState, nsView]
  );
  if (!open) return null;
  const card = theme.card || '';
  const border = theme.border || 'border-slate-700';
  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 overflow-y-auto z-[9600]"
      data-testid="national-regional-dashboard-modal"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nr-dash-title"
    >
      <div
        className={`${card} ${border} border rounded-xl max-w-5xl w-full max-h-[calc(100dvh-2rem)] flex flex-col`}
        onClick={e => e.stopPropagation()}
      >
        <div className={`flex justify-between items-center p-4 border-b ${border}`}>
          <div>
            <h2 id="nr-dash-title" className="text-xl font-bold">
              📊 National & regional dashboard
            </h2>
            <p className="text-xs opacity-75">Round {turn} · authoritative Living Regions + National Systems</p>
          </div>
          <button
            type="button"
            className={`${theme.buttonSecondary || ''} px-3 py-1 rounded`}
            onClick={onClose}
            aria-label="Close dashboard"
          >
            ✕
          </button>
        </div>
        <div className={`flex flex-wrap gap-1 px-4 pt-3 border-b ${border}`} role="tablist">
          {NR_DASH_TAB_ORDER.map(id => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`px-3 py-1.5 text-xs rounded-t border-b-2 ${tab === id ? 'border-sky-400 font-bold' : 'border-transparent opacity-70'}`}
              onClick={() => setTab(id)}
            >
              {NR_DASH_TAB_LABELS[id]}
            </button>
          ))}
        </div>
        <div className={`flex-1 overflow-y-auto p-4 ${theme.scrollbar || ''}`}>
          {!snap ? (
            <p className="text-sm opacity-80">Enable Living Regions or National Systems to populate this dashboard.</p>
          ) : tab === 'overview' ? (
            <NrDashOverviewTab snap={snap} nsState={nsState} onAsk={onAsk} />
          ) : tab === 'regions' ? (
            <NrDashRegionsTab snap={snap} focusRegionId={focusRegionId} onFocusRegion={onFocusRegion} />
          ) : tab === 'networks' ? (
            <NrDashNetworksTab ns={nsState} onMapNetwork={onMapNetwork} />
          ) : tab === 'map' ? (
            <NrDashMapTab snap={snap} nsState={nsState} focusRegionId={focusRegionId} onFocusRegion={onFocusRegion} />
          ) : (
            <NrDashTrendsTab snap={snap} />
          )}
        </div>
        <div className={`p-3 border-t ${border} flex justify-end`}>
          <button type="button" className={`${theme.button || ''} px-4 py-2 rounded`} onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// --- bundled from tests/agent23-self-tests.ts ---
export function summarizeAgent23Tests(results: Agent23TestResult[]): {
  total: number;
  passed: number;
  failed: Agent23TestResult[];
} {
  const failed = results.filter(r => !r.passed);
  return { total: results.length, passed: results.length - failed.length, failed };
}

export function runAgent23SelfTests(): Agent23TestResult[] {
  const results: Agent23TestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try {
      const out = fn();
      results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') });
    } catch (e) {
      results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) });
    }
  };

  check('a23_null_snap', 'Snapshot null when LR and NS missing', () => nrDashBuildAuthSnapshot(1, null, null, null) === null);

  check('a23_lr_only', 'LR-only snapshot has 8 regions and provenance', () => {
    const lr = createAgent23LrFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null);
    return Boolean(
      snap && snap.regions.length === COMM_REGION_CODES.length && snap.provenance.some(p => p.source === 'living_regions')
    );
  });

  check('a23_ns_only', 'NS-only snapshot exposes five network bars', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, null, ns, null);
    return Boolean(snap && snap.networks.length === 5 && snap.provenance.some(p => p.source === 'national_systems'));
  });

  check('a23_heat_full', 'Heat matrix covers region × network grid', () => {
    const ns = createAgent23NsFixture();
    const heat = nrDashBuildHeatCells(ns);
    const expected = Object.keys(ns.regions).length * NATIONAL_NETWORKS.length;
    return heat.cells.length === expected || `cells=${heat.cells.length} expected=${expected}`;
  });

  check('a23_map_layout', 'Strategic map layout lists eight AU codes', () => AGENT23_REGION_MAP_LAYOUT.length === 8);

  check('a23_adj_pairs', 'Adjacency pairs are deduplicated', () => {
    const pairs = agent23ListAdjacencyPairs();
    const keys = new Set(pairs.map(p => p.key));
    return pairs.length >= 10 && keys.size === pairs.length;
  });

  check('a23_adj_links', 'Adjacency links cover TAS-VIC corridor', () => {
    const links = nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT);
    return links.some(l => l.id.includes('TAS-VIC') || l.label.includes('TAS-VIC'));
  });

  check('a23_dep_links', 'Dependency links from NS state', () => {
    const ns = createAgent23NsFixture();
    const deps = nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT);
    return deps.length === 3 && deps.every(d => d.kind === 'dependency');
  });

  check('a23_map_link_geom', 'Link endpoints resolve for SA→NSW dependency', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), ns, null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const dep = nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)[0];
    const seg = nrDashLinkEndpoints(dep, nodes);
    return Boolean(seg && seg.x1 !== seg.x2);
  });

  check('a23_map_nodes', 'Map nodes align to layout ids', () => {
    const snap = nrDashBuildAuthSnapshot(3, createAgent23LrFixture(), null, null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    return nodes.length === 8 && nodes.every(n => COMM_REGION_CODES.includes(n.regionId as (typeof COMM_REGION_CODES)[number]));
  });

  check('a23_insights_owner', 'Owner breakdown counts eight regions', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you', VIC: 'rival' })!;
    const ins = nrDashBuildCompareInsights(snap, createAgent23NsFixture());
    return ins.ownerBreakdown.you === 1 && ins.ownerBreakdown.rival === 1 && ins.ownerBreakdown.unknown === 6;
  });

  check('a23_insights_needs', 'Total open needs sums regional rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const ins = nrDashBuildCompareInsights(snap, null);
    const expected = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
    return ins.totalOpenNeeds === expected;
  });

  check('a23_leaders_order', 'Momentum leaders sorted by band rank', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const { leaders } = nrDashBuildRegionalLeaders(snap, 3);
    return leaders.length === 3 && leaders[0].rank >= leaders[1].rank;
  });

  check('a23_network_stress', 'Network stress reports five networks', () => {
    const stress = nrDashBuildNetworkStress(createAgent23NsFixture());
    return stress.length === 5 && stress.every(s => s.peakUtilization >= 0);
  });

  check('a23_bottleneck_rollup', 'Bottleneck rollup preserves region and network', () => {
    const rows = nrDashBuildBottleneckRollup(createAgent23NsFixture());
    return rows.length === 1 && rows[0].regionId === 'NSW' && rows[0].network === 'Freight';
  });

  check('a23_merge_links', 'Merged map links include adjacency and dependency', () => {
    const ns = createAgent23NsFixture();
    const merged = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    );
    return merged.some(l => l.kind === 'adjacency') && merged.some(l => l.kind === 'dependency');
  });

  check('a23_activity_weight', 'History activity weight is bounded 0..1', () => {
    const w = nrDashHistoryActivityWeight([0, 2, 4]);
    return w > 0 && nrDashClamp01(1.5) === 1;
  });

  check('a23_owner_labels', 'Owner labels', () =>
    nrDashOwnerLabel('you') === 'You' && nrDashOwnerLabel('rival') === 'Rival' && nrDashOwnerLabel('unknown') === '—'
  );

  check('a23_merged_counts', 'Merged snapshot counts bottlenecks and deps from NS', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    return snap.bottleneckCount === 1 && snap.dependencyCount === 3 && snap.regions.find(r => r.regionId === 'NSW')?.owner === 'you';
  });

  for (const code of COMM_REGION_CODES) {
    check(`a23_region_${code.toLowerCase()}`, `Regional row includes ${code}`, () => {
      const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
      return snap.regions.some(r => r.regionId === code) || `missing ${code}`;
    });
  }

  for (const net of NATIONAL_NETWORKS) {
    check(`a23_net_${net}`, `Network bar includes ${net}`, () => {
      const snap = nrDashBuildAuthSnapshot(2, null, createAgent23NsFixture(), null)!;
      return snap.networks.some(n => n.network === net);
    });
  }

  check('a23_history_snippets', 'History snippets merge NS history and LR majors', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    return snap.historySnippets.length >= 2;
  });

  check('a23_divergence', 'Momentum divergence spread is non-negative', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const d = nrDashBuildMomentumDivergence(snap)!;
    return d.spread >= 0 && d.dispersion >= 0;
  });

  check('a23_condition_catalog', 'Condition catalog lists strained cells from fixture', () => {
    const cat = nrDashBuildConditionCatalog(createAgent23NsFixture());
    return cat.some(c => c.condition === 'bottlenecked' || c.condition === 'critical');
  });

  check('a23_trend_delta', 'Trend deltas computed from history', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const deltas = nrDashBuildTrendDeltas(snap.regions);
    return deltas.length === COMM_REGION_CODES.length && deltas.some(d => d.delta != null);
  });

  check('a23_trend_movers', 'Top trend movers returns bounded list', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    return nrDashTopTrendMovers(snap.regions, 3).length <= 3;
  });

  check('a23_map_focus_neighbors', 'NSW focus keeps neighbors undimmed', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const nodes = nrDashApplyMapFocus(nrDashBuildRegionMapNodes(snap), 'NSW');
    const nsw = nodes.find(n => n.regionId === 'NSW');
    const qld = nodes.find(n => n.regionId === 'QLD');
    const wa = nodes.find(n => n.regionId === 'WA');
    return nsw && !nsw.dimmed && qld && !qld.dimmed && wa && wa.dimmed;
  });

  check('a23_map_focus_links', 'Focus filters links to touching region', () => {
    const ns = createAgent23NsFixture();
    const all = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    );
    const focused = nrDashLinksTouchingRegion(all, 'SA');
    return focused.length < all.length && focused.every(l => l.fromId === 'SA' || l.toId === 'SA');
  });

  check('a23_neighbors_nsw', 'NSW neighbor list includes QLD', () => nrDashNeighborRegionIds('NSW').includes('QLD'));

  check('a23_constraint_profile', 'Constraint profile counts primary freight regions', () => {
    const profile = nrDashBuildConstraintProfile(createAgent23NsFixture());
    return profile.some(p => p.network === 'freight' && p.regionCount === 8);
  });

  check('a23_resilience_spread', 'Resilience spread uses snapshot resilience fields', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const spread = nrDashBuildResilienceSpread(snap)!;
    return spread.sampleSize === 8 && spread.max >= spread.min;
  });

  check('a23_dep_profile', 'Dependency profile lists high and critical', () => {
    const prof = nrDashBuildDependencyProfile(createAgent23NsFixture());
    return prof.some(p => p.importance === 'high') && prof.some(p => p.importance === 'critical');
  });

  check('a23_heat_summary', 'Heat row summary marks NSW bottlenecked worst', () => {
    const rows = nrDashBuildHeatRowSummaries(createAgent23NsFixture());
    const nsw = rows.find(r => r.regionId === 'NSW');
    return Boolean(nsw && nsw.worstCondition === 'bottlenecked');
  });

  check('a23_parity_gap', 'Parity gap rows align to region count', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    return nrDashBuildParityGapRows(snap).length === 8 && nrDashTopParityOutliers(snap, 2).length <= 2;
  });

  return results;
}

/** Merge hook name expected by Agent 25 assembly. */
export function runAgent23NationalRegionalDashboardSelfTests(): Agent23TestResult[] {
  return runAgent23SelfTests();
}


export const OP10M_AGENT23_MODULE_META = {
  moduleId: 'agent-23-dashboards',
  schemaVersion: 'op10m-agent23-v1',
  integrationDoc: 'operation-10m/agent-23-dashboards/merge/INTEGRATION.md',
  slot: 'post-living-regions-national-systems',
  readOnly: true,
} as const;
// OP10M_MODULE_END agent-23-dashboards

