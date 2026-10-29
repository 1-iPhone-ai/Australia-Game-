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
  /** 0..1 activity pulse overlay (derived from snapshot fields). */
  pulseIntensity?: number;
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
  /** 0..1 corridor or dependency stress overlay (state-derived). */
  stressLevel?: number;
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

// --- bundled from core/corridor-stress.ts ---
export interface NrDashCorridorStressRow {
  corridorKey: string;
  regionA: string;
  regionB: string;
  /** Mean peak utilization across the two endpoint regions (0..1). */
  meanPeakUtilization: number;
  /** Worst condition rank label across both regions' network cells. */
  worstLabel: string;
}

function regionPeakUtilization(ns: NationalSystemsState, regionId: string): number {
  const reg = ns.regions[regionId];
  if (!reg) return 0;
  let peak = 0;
  NATIONAL_NETWORKS.forEach(n => {
    const u = reg.networks[n]?.utilization ?? 0;
    if (u > peak) peak = u;
  });
  return peak;
}

/** Land-corridor stress from NS utilization at adjacency endpoints (state-derived). */
export function nrDashBuildCorridorStressRows(ns: NationalSystemsState | null): NrDashCorridorStressRow[] {
  if (!ns) return [];
  return agent23ListAdjacencyPairs().map(({ a, b, key }) => {
    const peakA = regionPeakUtilization(ns, a);
    const peakB = regionPeakUtilization(ns, b);
    const meanPeakUtilization = Math.round(((peakA + peakB) / 2) * 1000) / 1000;
    const worst = Math.max(peakA, peakB);
    const worstLabel = worst >= 0.9 ? 'critical corridor' : worst >= 0.75 ? 'strained corridor' : 'stable corridor';
    return { corridorKey: key, regionA: a, regionB: b, meanPeakUtilization, worstLabel };
  });
}

export function nrDashTopCorridorStress(ns: NationalSystemsState | null, limit = 5): NrDashCorridorStressRow[] {
  return nrDashBuildCorridorStressRows(ns)
    .sort((x, y) => y.meanPeakUtilization - x.meanPeakUtilization || x.corridorKey.localeCompare(y.corridorKey))
    .slice(0, limit);
}

// --- bundled from core/network-coupling.ts ---
export interface NrDashNetworkCouplingRow {
  regionId: string;
  strainedCount: number;
  /** Share of networks at strained+ condition (0..1). */
  couplingRatio: number;
}

export interface NrDashNetworkCouplingSummary {
  rows: NrDashNetworkCouplingRow[];
  meanCoupling: number;
  maxCouplingRegionId: string | null;
}

const strainedPlus = (c: NationalNetworkCondition) => NS_COND_RANK[c] >= NS_COND_RANK.strained;

/** Count co-occurring strained+ networks per region (NS cells only). */
export function nrDashBuildNetworkCoupling(ns: NationalSystemsState | null): NrDashNetworkCouplingSummary | null {
  if (!ns) return null;
  const rows: NrDashNetworkCouplingRow[] = Object.values(ns.regions).map(reg => {
    let strainedCount = 0;
    NATIONAL_NETWORKS.forEach(n => {
      const cell = reg.networks[n];
      if (cell && strainedPlus(cell.condition)) strainedCount += 1;
    });
    const couplingRatio = Math.round((strainedCount / NATIONAL_NETWORKS.length) * 1000) / 1000;
    return { regionId: reg.regionId, strainedCount, couplingRatio };
  });
  rows.sort((a, b) => b.couplingRatio - a.couplingRatio || a.regionId.localeCompare(b.regionId));
  const meanCoupling =
    rows.length === 0
      ? 0
      : Math.round((rows.reduce((s, r) => s + r.couplingRatio, 0) / rows.length) * 1000) / 1000;
  const maxCouplingRegionId = rows[0]?.couplingRatio ? rows[0].regionId : null;
  return { rows, meanCoupling, maxCouplingRegionId };
}

// --- bundled from core/dependency-chokepoint.ts ---
const IMPORTANCE_WEIGHT: Record<string, number> = {
  moderate: 1,
  high: 1.25,
  critical: 1.5,
};

export interface NrDashDependencyChokepointRow {
  dependencyId: string;
  label: string;
  consumerRegionId: string;
  providerRegionId: string;
  networkLabel: string;
  /** Endpoint peak utilization sum weighted by importance (state-derived). */
  chokeScore: number;
}

function endpointPeak(ns: NationalSystemsState, regionId: string): number {
  const reg = ns.regions[regionId];
  if (!reg) return 0;
  return Math.max(
    reg.networks.freight?.utilization ?? 0,
    reg.networks.energy?.utilization ?? 0,
    reg.networks.water?.utilization ?? 0,
    reg.networks.trade?.utilization ?? 0,
    reg.networks.digital?.utilization ?? 0
  );
}

/** Rank interregional dependencies by combined endpoint stress (NS authoritative). */
export function nrDashBuildDependencyChokepoints(ns: NationalSystemsState | null): NrDashDependencyChokepointRow[] {
  if (!ns?.dependencies?.length) return [];
  return ns.dependencies
    .map(dep => {
      const consumerPeak = endpointPeak(ns, dep.consumerRegionId);
      const providerPeak = endpointPeak(ns, dep.providerRegionId);
      const w = IMPORTANCE_WEIGHT[dep.importance] ?? 1;
      const chokeScore = Math.round((consumerPeak + providerPeak) * w * 1000) / 1000;
      return {
        dependencyId: dep.id,
        label: `${dep.consumerRegionId} ← ${dep.providerRegionId} (${NATIONAL_NETWORK_LABEL[dep.network]})`,
        consumerRegionId: dep.consumerRegionId,
        providerRegionId: dep.providerRegionId,
        networkLabel: NATIONAL_NETWORK_LABEL[dep.network],
        chokeScore,
      };
    })
    .sort((a, b) => b.chokeScore - a.chokeScore || a.dependencyId.localeCompare(b.dependencyId));
}

export function nrDashTopDependencyChokepoints(ns: NationalSystemsState | null, limit = 3): NrDashDependencyChokepointRow[] {
  return nrDashBuildDependencyChokepoints(ns).slice(0, limit);
}

// --- bundled from core/needs-imbalance.ts ---
export interface NrDashNeedsImbalance {
  totalOpenNeeds: number;
  meanPerRegion: number;
  stdDev: number;
  neediestRegionId: string | null;
  neediestOpenNeeds: number;
  /** max/min among regions with needs > 0, null when flat. */
  spreadRatio: number | null;
}

/** Regional open-needs dispersion from snapshot rows (LR-derived counts). */
export function nrDashBuildNeedsImbalance(snap: NrDashAuthSnapshot | null): NrDashNeedsImbalance | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.openNeeds);
  const totalOpenNeeds = counts.reduce((s, n) => s + n, 0);
  const meanPerRegion = totalOpenNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanPerRegion) ** 2, 0) / Math.max(counts.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;
  const ranked = [...snap.regions].sort((a, b) => b.openNeeds - a.openNeeds || a.regionId.localeCompare(b.regionId));
  const neediest = ranked[0];
  const positives = counts.filter(n => n > 0);
  const spreadRatio =
    positives.length >= 2
      ? Math.round((Math.max(...positives) / Math.min(...positives)) * 100) / 100
      : null;
  return {
    totalOpenNeeds,
    meanPerRegion: Math.round(meanPerRegion * 100) / 100,
    stdDev,
    neediestRegionId: neediest?.openNeeds ? neediest.regionId : null,
    neediestOpenNeeds: neediest?.openNeeds ?? 0,
    spreadRatio,
  };
}

// --- bundled from core/map-pulse.ts ---
export interface NrDashMapPulseRow {
  regionId: string;
  /** 0..1 composite pulse from snapshot node fields (not simulated). */
  intensity: number;
}

/** Pulse intensity blends momentum activity, open needs, and high risks on map nodes. */
export function nrDashBuildMapPulseRows(nodes: RegionMapNode[]): NrDashMapPulseRow[] {
  return nodes.map(n => {
    const needTerm = nrDashClamp01(n.openNeeds / 8);
    const riskTerm = nrDashClamp01(n.highRisks / 4);
    const intensity = nrDashClamp01(n.activityWeight * 0.55 + needTerm * 0.25 + riskTerm * 0.2);
    return { regionId: n.regionId, intensity };
  });
}

export function nrDashApplyMapPulse(nodes: RegionMapNode[]): RegionMapNode[] {
  const pulse = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  return nodes.map(n => ({ ...n, pulseIntensity: pulse.get(n.regionId) ?? 0 }));
}

export function nrDashHottestPulseRegion(nodes: RegionMapNode[]): string | null {
  const rows = nrDashBuildMapPulseRows(nodes);
  if (!rows.length) return null;
  const top = [...rows].sort((a, b) => b.intensity - a.intensity)[0];
  return top.intensity > 0 ? top.regionId : null;
}

// --- bundled from core/risk-exposure.ts ---
export interface NrDashRiskExposureRow {
  regionId: string;
  name: string;
  openNeeds: number;
  highRisks: number;
  /** Weighted LR exposure index (needs + 2× high risks). */
  exposureScore: number;
}

export interface NrDashRiskExposureSummary {
  rows: NrDashRiskExposureRow[];
  totalExposure: number;
  stdDev: number;
  hotspotRegionId: string | null;
}

/** Aggregate open needs and high-severity risks per region (snapshot rows only). */
export function nrDashBuildRiskExposure(snap: NrDashAuthSnapshot | null): NrDashRiskExposureSummary | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashRiskExposureRow[] = snap.regions.map(r => ({
    regionId: r.regionId,
    name: r.name,
    openNeeds: r.openNeeds,
    highRisks: r.highRisks,
    exposureScore: r.openNeeds + r.highRisks * 2,
  }));
  rows.sort((a, b) => b.exposureScore - a.exposureScore || a.regionId.localeCompare(b.regionId));
  const scores = rows.map(r => r.exposureScore);
  const totalExposure = scores.reduce((s, n) => s + n, 0);
  const mean = totalExposure / scores.length;
  const variance = scores.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(scores.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;
  const hotspot = rows[0]?.exposureScore ? rows[0].regionId : null;
  return { rows, totalExposure, stdDev, hotspotRegionId: hotspot };
}

export function nrDashTopRiskExposureRows(snap: NrDashAuthSnapshot | null, limit = 3): NrDashRiskExposureRow[] {
  const summary = nrDashBuildRiskExposure(snap);
  return summary ? summary.rows.slice(0, limit) : [];
}

// --- bundled from core/utilization-skew.ts ---
export interface NrDashUtilizationSkew {
  sampleSize: number;
  meanUtilization: number;
  stdDev: number;
  hottestNetwork: NrDashNetworkBar['network'] | null;
  coolestNetwork: NrDashNetworkBar['network'] | null;
  spread: number;
}

/** Dispersion of authoritative national network utilization bars. */
export function nrDashBuildUtilizationSkew(snap: NrDashAuthSnapshot | null): NrDashUtilizationSkew | null {
  if (!snap?.networks.length) return null;
  const values = snap.networks.map(n => n.utilization);
  const meanUtilization = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanUtilization) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const sorted = [...snap.networks].sort(
    (a, b) => b.utilization - a.utilization || a.network.localeCompare(b.network)
  );
  const hottest = sorted[0];
  const coolest = sorted[sorted.length - 1];
  const spread = Math.round((hottest.utilization - coolest.utilization) * 1000) / 1000;
  return {
    sampleSize: snap.networks.length,
    meanUtilization: Math.round(meanUtilization * 1000) / 1000,
    stdDev,
    hottestNetwork: hottest.utilization > 0 ? hottest.network : null,
    coolestNetwork: coolest ? coolest.network : null,
    spread,
  };
}

// --- bundled from core/momentum-resilience-tension.ts ---
export interface NrDashMomentumResilienceTensionRow {
  regionId: string;
  name: string;
  momentumRank: number;
  resilience: number;
  /** Positive = resilience ahead of momentum; negative = momentum ahead of resilience. */
  tensionScore: number;
}

export interface NrDashMomentumResilienceTensionSummary {
  rows: NrDashMomentumResilienceTensionRow[];
  meanAbsTension: number;
  /** Region with largest absolute mismatch. */
  outlierRegionId: string | null;
}

function momRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Flag LR momentum vs NS resilience mismatches on merged snapshot rows. */
export function nrDashBuildMomentumResilienceTension(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumResilienceTensionSummary | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashMomentumResilienceTensionRow[] = [];
  snap.regions.forEach(r => {
    if (r.resilience == null) return;
    const momentumRank = momRank(r.momentumBand);
    const normalizedMom = (momentumRank / 5) * 100;
    const tensionScore = Math.round((r.resilience - normalizedMom) * 10) / 10;
    rows.push({
      regionId: r.regionId,
      name: r.name,
      momentumRank,
      resilience: r.resilience,
      tensionScore,
    });
  });
  if (!rows.length) return null;
  rows.sort((a, b) => Math.abs(b.tensionScore) - Math.abs(a.tensionScore) || a.regionId.localeCompare(b.regionId));
  const meanAbsTension =
    Math.round((rows.reduce((s, r) => s + Math.abs(r.tensionScore), 0) / rows.length) * 100) / 100;
  const outlierRegionId = rows[0] ? rows[0].regionId : null;
  return { rows, meanAbsTension, outlierRegionId };
}

export function nrDashTopTensionOutliers(snap: NrDashAuthSnapshot | null, limit = 3): NrDashMomentumResilienceTensionRow[] {
  const summary = nrDashBuildMomentumResilienceTension(snap);
  return summary ? summary.rows.slice(0, limit) : [];
}

// --- bundled from core/map-hub-index.ts ---
export interface NrDashMapHubRow {
  regionId: string;
  adjacencyCount: number;
  dependencyIn: number;
  dependencyOut: number;
  hubScore: number;
}

/** Connectivity hub score from land adjacency + NS dependency in/out degree. */
export function nrDashBuildMapHubIndex(ns: NationalSystemsState | null): NrDashMapHubRow[] {
  const adjCount = new Map<string, number>();
  agent23ListAdjacencyPairs().forEach(({ a, b }) => {
    adjCount.set(a, (adjCount.get(a) ?? 0) + 1);
    adjCount.set(b, (adjCount.get(b) ?? 0) + 1);
  });
  const depIn = new Map<string, number>();
  const depOut = new Map<string, number>();
  ns?.dependencies.forEach(d => {
    depIn.set(d.consumerRegionId, (depIn.get(d.consumerRegionId) ?? 0) + 1);
    depOut.set(d.providerRegionId, (depOut.get(d.providerRegionId) ?? 0) + 1);
  });
  const regionIds = new Set<string>([...adjCount.keys(), ...depIn.keys(), ...depOut.keys()]);
  if (ns) Object.keys(ns.regions).forEach(id => regionIds.add(id));
  return [...regionIds]
    .map(regionId => {
      const adjacencyCount = adjCount.get(regionId) ?? 0;
      const dependencyIn = depIn.get(regionId) ?? 0;
      const dependencyOut = depOut.get(regionId) ?? 0;
      const hubScore = adjacencyCount + dependencyIn + dependencyOut;
      return { regionId, adjacencyCount, dependencyIn, dependencyOut, hubScore };
    })
    .sort((a, b) => b.hubScore - a.hubScore || a.regionId.localeCompare(b.regionId));
}

export function nrDashTopMapHubs(ns: NationalSystemsState | null, limit = 3): NrDashMapHubRow[] {
  return nrDashBuildMapHubIndex(ns).slice(0, limit);
}

export function nrDashPrimaryMapHub(ns: NationalSystemsState | null): string | null {
  const top = nrDashBuildMapHubIndex(ns)[0];
  return top?.hubScore ? top.regionId : null;
}

// --- bundled from core/link-stress.ts ---
function corridorKeyForLink(link: NrDashMapLink): string | null {
  if (link.kind !== 'adjacency') return null;
  const [a, b] = [link.fromId, link.toId].sort();
  return `${a}-${b}`;
}

/** Attach 0..1 stress levels to map links from corridor means or dependency choke scores. */
export function nrDashEnrichMapLinkStress(links: NrDashMapLink[], ns: NationalSystemsState | null): NrDashMapLink[] {
  if (!links.length) return links;
  const corridorByKey = new Map(
    nrDashBuildCorridorStressRows(ns).map(r => [r.corridorKey, r.meanPeakUtilization])
  );
  const chokes = nrDashBuildDependencyChokepoints(ns);
  const maxChoke = chokes.reduce((m, c) => Math.max(m, c.chokeScore), 0.001);
  const chokeByDepId = new Map(chokes.map(c => [c.dependencyId, c.chokeScore]));

  return links.map(link => {
    if (link.kind === 'adjacency') {
      const key = corridorKeyForLink(link);
      const mean = key ? corridorByKey.get(key) ?? 0 : 0;
      const stressLevel = nrDashClamp01(mean);
      return {
        ...link,
        stressLevel,
        title: `${link.title} · corridor stress ${Math.round(stressLevel * 100)}%`,
      };
    }
    const depId = link.id.replace(/^dep_/, '');
    const choke = chokeByDepId.get(depId) ?? 0;
    const stressLevel = nrDashClamp01(choke / maxChoke);
    return {
      ...link,
      stressLevel,
      title: `${link.title} · dependency stress ${Math.round(stressLevel * 100)}%`,
    };
  });
}

export function nrDashHottestMapLinkStress(links: NrDashMapLink[]): NrDashMapLink | null {
  const ranked = [...links].filter(l => (l.stressLevel ?? 0) > 0).sort((a, b) => (b.stressLevel ?? 0) - (a.stressLevel ?? 0));
  return ranked[0] ?? null;
}

// --- bundled from core/capacity-headroom.ts ---
export interface NrDashCapacityHeadroom {
  sampleSize: number;
  meanHeadroom: number;
  stdDev: number;
  tightestNetwork: NrDashNetworkBar['network'] | null;
  roomiestNetwork: NrDashNetworkBar['network'] | null;
  spread: number;
}

/** Remaining national capacity (1 − utilization) across authoritative network bars. */
export function nrDashBuildCapacityHeadroom(snap: NrDashAuthSnapshot | null): NrDashCapacityHeadroom | null {
  if (!snap?.networks.length) return null;
  const headrooms = snap.networks.map(n => ({
    network: n.network,
    headroom: Math.max(0, 1 - n.utilization),
  }));
  const values = headrooms.map(h => h.headroom);
  const meanHeadroom = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanHeadroom) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const sorted = [...headrooms].sort((a, b) => a.headroom - b.headroom || a.network.localeCompare(b.network));
  const tightest = sorted[0];
  const roomiest = sorted[sorted.length - 1];
  const spread = Math.round((roomiest.headroom - tightest.headroom) * 1000) / 1000;
  return {
    sampleSize: snap.networks.length,
    meanHeadroom: Math.round(meanHeadroom * 1000) / 1000,
    stdDev,
    tightestNetwork: tightest.headroom < 1 ? tightest.network : null,
    roomiestNetwork: roomiest ? roomiest.network : null,
    spread,
  };
}

// --- bundled from core/strain-diversity.ts ---
const CONDITION_WEIGHT: Record<NationalNetworkCondition, number> = {
  surplus: 0,
  healthy: 1,
  strained: 2,
  bottlenecked: 3,
  critical: 4,
};

export interface NrDashStrainDiversity {
  cellCount: number;
  meanWeight: number;
  stdDev: number;
  /** Normalized 0..1 spread of condition weights across the heat grid. */
  diversityIndex: number;
  dominantCondition: NationalNetworkCondition | null;
}

/** Dispersion of NS condition severity across the region × network heat grid. */
export function nrDashBuildStrainDiversity(ns: NationalSystemsState | null): NrDashStrainDiversity | null {
  if (!ns) return null;
  const heat = nrDashBuildHeatCells(ns);
  if (!heat.cells.length) return null;
  const weights = heat.cells.map(c => CONDITION_WEIGHT[c.tone] ?? 0);
  const meanWeight = weights.reduce((s, w) => s + w, 0) / weights.length;
  const variance =
    weights.reduce((s, w) => s + (w - meanWeight) ** 2, 0) / Math.max(weights.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const maxWeight = 4;
  const diversityIndex = Math.round((stdDev / maxWeight) * 1000) / 1000;
  const counts = new Map<NationalNetworkCondition, number>();
  heat.cells.forEach(c => counts.set(c.tone, (counts.get(c.tone) ?? 0) + 1));
  let dominantCondition: NationalNetworkCondition | null = null;
  let best = 0;
  counts.forEach((n, cond) => {
    if (n > best) {
      best = n;
      dominantCondition = cond;
    }
  });
  return {
    cellCount: heat.cells.length,
    meanWeight: Math.round(meanWeight * 1000) / 1000,
    stdDev,
    diversityIndex,
    dominantCondition,
  };
}

// --- bundled from core/owner-stress-gap.ts ---
export interface NrDashOwnerStressGap {
  ownedRegionCount: number;
  nationalMeanOpenNeeds: number;
  ownedMeanOpenNeeds: number;
  /** Owned minus national mean (positive = your portfolio needier). */
  openNeedsGap: number;
  nationalMeanResilience: number | null;
  ownedMeanResilience: number | null;
  resilienceGap: number | null;
}

/** Compare player-owned regions to national LR/NS averages (snapshot rows only). */
export function nrDashBuildOwnerStressGap(snap: NrDashAuthSnapshot | null): NrDashOwnerStressGap | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const nationalMeanOpenNeeds =
    snap.regions.reduce((s, r) => s + r.openNeeds, 0) / snap.regions.length;
  const ownedMeanOpenNeeds = owned.reduce((s, r) => s + r.openNeeds, 0) / owned.length;
  const openNeedsGap = Math.round((ownedMeanOpenNeeds - nationalMeanOpenNeeds) * 100) / 100;
  const withRes = snap.regions.filter(r => r.resilience != null);
  const ownedWithRes = owned.filter(r => r.resilience != null);
  let nationalMeanResilience: number | null = null;
  let ownedMeanResilience: number | null = null;
  let resilienceGap: number | null = null;
  if (withRes.length) {
    nationalMeanResilience =
      Math.round((withRes.reduce((s, r) => s + (r.resilience ?? 0), 0) / withRes.length) * 10) / 10;
  }
  if (ownedWithRes.length) {
    ownedMeanResilience =
      Math.round((ownedWithRes.reduce((s, r) => s + (r.resilience ?? 0), 0) / ownedWithRes.length) * 10) / 10;
    if (nationalMeanResilience != null) {
      resilienceGap = Math.round((ownedMeanResilience - nationalMeanResilience) * 10) / 10;
    }
  }
  return {
    ownedRegionCount: owned.length,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 100) / 100,
    ownedMeanOpenNeeds: Math.round(ownedMeanOpenNeeds * 100) / 100,
    openNeedsGap,
    nationalMeanResilience,
    ownedMeanResilience,
    resilienceGap,
  };
}

// --- bundled from core/peripheral-isolation.ts ---
export interface NrDashPeripheralIsolationRow {
  regionId: string;
  hubScore: number;
  /** Higher = more peripheral (low connectivity). */
  isolationScore: number;
}

export interface NrDashPeripheralIsolationSummary {
  rows: NrDashPeripheralIsolationRow[];
  maxHubScore: number;
}

/** Regions farthest from the connectivity core (inverse of map hub score). */
export function nrDashBuildPeripheralIsolation(ns: NationalSystemsState | null): NrDashPeripheralIsolationSummary | null {
  const hubs = nrDashBuildMapHubIndex(ns);
  if (!hubs.length) return null;
  const maxHubScore = Math.max(...hubs.map(h => h.hubScore), 1);
  const rows: NrDashPeripheralIsolationRow[] = hubs.map(h => ({
    regionId: h.regionId,
    hubScore: h.hubScore,
    isolationScore: Math.round((1 - h.hubScore / maxHubScore) * 1000) / 1000,
  }));
  rows.sort((a, b) => b.isolationScore - a.isolationScore || a.regionId.localeCompare(b.regionId));
  return { rows, maxHubScore };
}

export function nrDashTopPeripheralRegions(ns: NationalSystemsState | null, limit = 3): NrDashPeripheralIsolationRow[] {
  return nrDashBuildPeripheralIsolation(ns)?.rows.slice(0, limit) ?? [];
}

// --- bundled from core/trend-coherence.ts ---
export interface NrDashTrendCoherence {
  sampleSize: number;
  meanDelta: number;
  stdDev: number;
  /** 1 − normalized σ of deltas (1 = all regions move together). */
  coherenceScore: number;
  divergentRegionId: string | null;
}

/** How aligned regional momentum history deltas are (no forecasting). */
export function nrDashBuildTrendCoherence(snap: NrDashAuthSnapshot | null): NrDashTrendCoherence | null {
  if (!snap?.regions.length) return null;
  const deltas = nrDashBuildTrendDeltas(snap.regions).filter(d => d.delta != null);
  if (!deltas.length) return null;
  const values = deltas.map(d => d.delta!);
  const meanDelta = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanDelta) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const maxStd = Math.max(...values.map(v => Math.abs(v)), 0.001);
  const coherenceScore = Math.round(Math.max(0, 1 - stdDev / maxStd) * 1000) / 1000;
  const divergent = [...deltas].sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!))[0];
  return {
    sampleSize: deltas.length,
    meanDelta: Math.round(meanDelta * 1000) / 1000,
    stdDev,
    coherenceScore,
    divergentRegionId: divergent?.regionId ?? null,
  };
}

// --- bundled from core/border-stress.ts ---
export interface NrDashBorderStressRow {
  regionId: string;
  /** Max mean corridor stress on any land link touching this region. */
  maxCorridorStress: number;
  corridorCount: number;
}

/** Per-region land-border stress from adjacency corridor utilization peaks. */
export function nrDashBuildBorderStressRows(ns: NationalSystemsState | null): NrDashBorderStressRow[] {
  const corridors = nrDashBuildCorridorStressRows(ns);
  const byRegion = new Map<string, { max: number; count: number }>();
  corridors.forEach(c => {
    [c.regionA, c.regionB].forEach(regionId => {
      const cur = byRegion.get(regionId) ?? { max: 0, count: 0 };
      cur.max = Math.max(cur.max, c.meanPeakUtilization);
      cur.count += 1;
      byRegion.set(regionId, cur);
    });
  });
  return [...byRegion.entries()]
    .map(([regionId, { max, count }]) => ({
      regionId,
      maxCorridorStress: Math.round(max * 1000) / 1000,
      corridorCount: count,
    }))
    .sort((a, b) => b.maxCorridorStress - a.maxCorridorStress || a.regionId.localeCompare(b.regionId));
}

export function nrDashTopBorderStress(ns: NationalSystemsState | null, limit = 3): NrDashBorderStressRow[] {
  return nrDashBuildBorderStressRows(ns).slice(0, limit);
}

export function nrDashHottestBorderRegion(ns: NationalSystemsState | null): string | null {
  const top = nrDashBuildBorderStressRows(ns)[0];
  return top?.maxCorridorStress ? top.regionId : null;
}

// --- bundled from core/bottleneck-concentration.ts ---
export interface NrDashBottleneckConcentration {
  activeCount: number;
  topRegionId: string | null;
  /** Herfindahl-style share² sum across regions (1 = all bottlenecks in one region). */
  concentrationIndex: number;
  topRegionShare: number;
}

/** How clustered active NS bottlenecks are by region (authoritative list only). */
export function nrDashBuildBottleneckConcentration(ns: NationalSystemsState | null): NrDashBottleneckConcentration | null {
  if (!ns?.bottlenecks?.length) return null;
  const counts = new Map<string, number>();
  ns.bottlenecks.forEach(b => {
    const id = b.regionId ?? 'unknown';
    counts.set(id, (counts.get(id) ?? 0) + 1);
  });
  const activeCount = ns.bottlenecks.length;
  let topRegionId: string | null = null;
  let topCount = 0;
  counts.forEach((n, id) => {
    if (n > topCount) {
      topCount = n;
      topRegionId = id === 'unknown' ? null : id;
    }
  });
  let concentrationIndex = 0;
  counts.forEach(n => {
    const share = n / activeCount;
    concentrationIndex += share * share;
  });
  return {
    activeCount,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / activeCount) * 1000) / 1000,
  };
}

// --- bundled from core/dependency-asymmetry.ts ---
const IMPORTANCE_WEIGHT: Record<string, number> = {
  moderate: 1,
  high: 1.25,
  critical: 1.5,
};

export interface NrDashDependencyAsymmetryRow {
  regionId: string;
  inboundWeight: number;
  outboundWeight: number;
  /** Positive = net consumer of interregional flows. */
  netImportWeight: number;
}

export interface NrDashDependencyAsymmetrySummary {
  rows: NrDashDependencyAsymmetryRow[];
  maxAbsNet: number;
}

/** Net dependency pull/push per region from NS dependency edges (no forecasting). */
export function nrDashBuildDependencyAsymmetry(ns: NationalSystemsState | null): NrDashDependencyAsymmetrySummary | null {
  if (!ns?.dependencies?.length) return null;
  const inbound = new Map<string, number>();
  const outbound = new Map<string, number>();
  COMM_REGION_CODES.forEach(code => {
    inbound.set(code, 0);
    outbound.set(code, 0);
  });
  ns.dependencies.forEach(dep => {
    const w = IMPORTANCE_WEIGHT[dep.importance] ?? 1;
    inbound.set(dep.consumerRegionId, (inbound.get(dep.consumerRegionId) ?? 0) + w);
    outbound.set(dep.providerRegionId, (outbound.get(dep.providerRegionId) ?? 0) + w);
  });
  const rows: NrDashDependencyAsymmetryRow[] = COMM_REGION_CODES.map(regionId => {
    const inboundWeight = Math.round((inbound.get(regionId) ?? 0) * 1000) / 1000;
    const outboundWeight = Math.round((outbound.get(regionId) ?? 0) * 1000) / 1000;
    return {
      regionId,
      inboundWeight,
      outboundWeight,
      netImportWeight: Math.round((inboundWeight - outboundWeight) * 1000) / 1000,
    };
  });
  rows.sort(
    (a, b) => Math.abs(b.netImportWeight) - Math.abs(a.netImportWeight) || a.regionId.localeCompare(b.regionId)
  );
  const maxAbsNet = Math.max(...rows.map(r => Math.abs(r.netImportWeight)), 0);
  return { rows, maxAbsNet };
}

export function nrDashTopDependencyAsymmetry(ns: NationalSystemsState | null, limit = 3): NrDashDependencyAsymmetryRow[] {
  return nrDashBuildDependencyAsymmetry(ns)?.rows.slice(0, limit) ?? [];
}

// --- bundled from core/owned-momentum-skew.ts ---
export interface NrDashOwnedMomentumSkew {
  ownedRegionCount: number;
  nationalMeanRank: number;
  ownedMeanRank: number;
  /** Owned minus national mean momentum rank (positive = hotter portfolio). */
  rankSkew: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Player-owned momentum band ranks vs national LR snapshot average. */
export function nrDashBuildOwnedMomentumSkew(snap: NrDashAuthSnapshot | null): NrDashOwnedMomentumSkew | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const ownedMeanRank = owned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / owned.length;
  const rankSkew = Math.round((ownedMeanRank - nationalMeanRank) * 100) / 100;
  return {
    ownedRegionCount: owned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    ownedMeanRank: Math.round(ownedMeanRank * 100) / 100,
    rankSkew,
  };
}

// --- bundled from core/util-alignment-drift.ts ---
export interface NrDashUtilAlignmentRow {
  network: NationalNetworkKind;
  label: string;
  nationalUtilization: number;
  regionalMeanUtilization: number;
  /** Absolute gap between national bar and regional mean cell util. */
  drift: number;
}

export interface NrDashUtilAlignmentDrift {
  rows: NrDashUtilAlignmentRow[];
  meanDrift: number;
  worstNetwork: NationalNetworkKind | null;
}

/** Mean absolute mismatch between national network bars and regional NS cells. */
export function nrDashBuildUtilAlignmentDrift(ns: NationalSystemsState | null): NrDashUtilAlignmentDrift | null {
  if (!ns?.national || !ns.regions) return null;
  const regionList = Object.values(ns.regions);
  if (!regionList.length) return null;
  const rows: NrDashUtilAlignmentRow[] = NATIONAL_NETWORKS.map(network => {
    const nationalUtilization = ns.national[network]?.utilization ?? 0;
    const regionalMeanUtilization =
      regionList.reduce((s, reg) => s + (reg.networks[network]?.utilization ?? 0), 0) / regionList.length;
    const drift = Math.abs(nationalUtilization - regionalMeanUtilization);
    return {
      network,
      label: NATIONAL_NETWORK_LABEL[network],
      nationalUtilization: Math.round(nationalUtilization * 1000) / 1000,
      regionalMeanUtilization: Math.round(regionalMeanUtilization * 1000) / 1000,
      drift: Math.round(drift * 1000) / 1000,
    };
  });
  rows.sort((a, b) => b.drift - a.drift || a.network.localeCompare(b.network));
  const meanDrift = rows.reduce((s, r) => s + r.drift, 0) / rows.length;
  return {
    rows,
    meanDrift: Math.round(meanDrift * 1000) / 1000,
    worstNetwork: rows[0]?.drift > 0 ? rows[0].network : null,
  };
}

// --- bundled from core/trend-acceleration.ts ---
export interface NrDashTrendAcceleration {
  sampleSize: number;
  meanAcceleration: number;
  stdDev: number;
  /** 1 − normalized σ (1 = all regions accelerating similarly). */
  coherenceScore: number;
  outlierRegionId: string | null;
}

function accelerationFromHistory(history: number[]): number | null {
  const pts = history.filter(v => Number.isFinite(v));
  if (pts.length < 3) return null;
  const mid = pts[Math.floor(pts.length / 2)];
  const first = pts[0];
  const last = pts[pts.length - 1];
  return Math.round((last - mid - (mid - first)) * 1000) / 1000;
}

/** Second-order momentum history curvature across regions (no forecasting). */
export function nrDashBuildTrendAcceleration(snap: NrDashAuthSnapshot | null): NrDashTrendAcceleration | null {
  if (!snap?.regions.length) return null;
  const entries = snap.regions
    .map(r => ({ regionId: r.regionId, acc: accelerationFromHistory(r.momentumHistory) }))
    .filter(e => e.acc != null) as { regionId: string; acc: number }[];
  if (!entries.length) return null;
  const values = entries.map(e => e.acc);
  const meanAcceleration = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanAcceleration) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const maxStd = Math.max(...values.map(v => Math.abs(v)), 0.001);
  const coherenceScore = Math.round(Math.max(0, 1 - stdDev / maxStd) * 1000) / 1000;
  const outlier = [...entries].sort((a, b) => Math.abs(b.acc) - Math.abs(a.acc))[0];
  return {
    sampleSize: entries.length,
    meanAcceleration: Math.round(meanAcceleration * 1000) / 1000,
    stdDev,
    coherenceScore,
    outlierRegionId: outlier?.regionId ?? null,
  };
}

// --- bundled from core/hub-corridor-load.ts ---
export interface NrDashHubCorridorLoad {
  hubRegionId: string | null;
  touchingLinkCount: number;
  meanLinkStress: number;
  peakLinkStress: number;
  peakLinkLabel: string | null;
}

/** Aggregate map link stress touching the primary connectivity hub. */
export function nrDashBuildHubCorridorLoad(ns: NationalSystemsState | null): NrDashHubCorridorLoad | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const stressed = nrDashEnrichMapLinkStress(merged, ns);
  const touching = stressed.filter(l => l.fromId === hubRegionId || l.toId === hubRegionId);
  if (!touching.length) {
    return {
      hubRegionId,
      touchingLinkCount: 0,
      meanLinkStress: 0,
      peakLinkStress: 0,
      peakLinkLabel: null,
    };
  }
  const levels = touching.map(l => l.stressLevel ?? 0);
  const meanLinkStress = levels.reduce((s, v) => s + v, 0) / levels.length;
  const peak = touching.reduce((best, l) => ((l.stressLevel ?? 0) > (best.stressLevel ?? 0) ? l : best));
  return {
    hubRegionId,
    touchingLinkCount: touching.length,
    meanLinkStress: Math.round(meanLinkStress * 1000) / 1000,
    peakLinkStress: Math.round((peak.stressLevel ?? 0) * 1000) / 1000,
    peakLinkLabel: peak.label,
  };
}

// --- bundled from core/open-needs-concentration.ts ---
export interface NrDashOpenNeedsConcentration {
  totalOpenNeeds: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl-style clustering of LR open needs across regions. */
export function nrDashBuildOpenNeedsConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashOpenNeedsConcentration | null {
  if (!snap?.regions.length) return null;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  if (totalOpenNeeds <= 0) return null;
  let topRegionId: string | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  snap.regions.forEach(r => {
    if (r.openNeeds > topCount) {
      topCount = r.openNeeds;
      topRegionId = r.regionId;
    }
    const share = r.openNeeds / totalOpenNeeds;
    concentrationIndex += share * share;
  });
  return {
    totalOpenNeeds,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / totalOpenNeeds) * 1000) / 1000,
  };
}

// --- bundled from core/critical-cell-density.ts ---
export interface NrDashCriticalCellDensity {
  cellCount: number;
  criticalPlusCount: number;
  density: number;
  worstRegionId: string | null;
}

const criticalPlus = (c: NationalNetworkCondition) => NS_COND_RANK[c] >= NS_COND_RANK.critical;

/** Share of NS heat cells at critical+ condition (authoritative cells only). */
export function nrDashBuildCriticalCellDensity(ns: NationalSystemsState | null): NrDashCriticalCellDensity | null {
  if (!ns) return null;
  const heat = nrDashBuildHeatCells(ns);
  if (!heat.cells.length) return null;
  let criticalPlusCount = 0;
  const perRegion = new Map<string, number>();
  heat.cells.forEach(cell => {
    if (criticalPlus(cell.tone)) {
      criticalPlusCount += 1;
      perRegion.set(cell.row, (perRegion.get(cell.row) ?? 0) + 1);
    }
  });
  let worstRegionId: string | null = null;
  let worst = 0;
  perRegion.forEach((n, id) => {
    if (n > worst) {
      worst = n;
      worstRegionId = id;
    }
  });
  return {
    cellCount: heat.cells.length,
    criticalPlusCount,
    density: Math.round((criticalPlusCount / heat.cells.length) * 1000) / 1000,
    worstRegionId,
  };
}

// --- bundled from core/economy-momentum-drift.ts ---
const ECON_RANK: Record<LREconomyBand, number> = {
  depressed: 0,
  weak: 1,
  moderate: 2,
  strong: 3,
  booming: 4,
};

function economyRankFromLabel(label: string): number {
  for (const [key, text] of Object.entries(LR_ECON_LABEL)) {
    if (text === label) return ECON_RANK[key as LREconomyBand];
  }
  return 2;
}

function momentumRankFromLabel(label: string): number {
  for (const [key, text] of Object.entries(LR_MOMENTUM_LABEL)) {
    if (text === label) return NR_DASH_MOM_RANK[key as LRMomentumBand];
  }
  return 2;
}

export interface NrDashEconomyMomentumDriftRow {
  regionId: string;
  economyRank: number;
  momentumRank: number;
  drift: number;
}

export interface NrDashEconomyMomentumDrift {
  rows: NrDashEconomyMomentumDriftRow[];
  meanAbsDrift: number;
  outlierRegionId: string | null;
}

/** LR economy band vs momentum band rank gap (no forecasting). */
export function nrDashBuildEconomyMomentumDrift(snap: NrDashAuthSnapshot | null): NrDashEconomyMomentumDrift | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashEconomyMomentumDriftRow[] = snap.regions.map(r => {
    const economyRank = economyRankFromLabel(r.economyBand);
    const momentumRank = momentumRankFromLabel(r.momentumBand);
    return {
      regionId: r.regionId,
      economyRank,
      momentumRank,
      drift: momentumRank - economyRank,
    };
  });
  rows.sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift) || a.regionId.localeCompare(b.regionId));
  const meanAbsDrift =
    Math.round((rows.reduce((s, r) => s + Math.abs(r.drift), 0) / rows.length) * 1000) / 1000;
  return { rows, meanAbsDrift, outlierRegionId: rows[0]?.regionId ?? null };
}

export function nrDashTopEconomyMomentumDrift(
  snap: NrDashAuthSnapshot | null,
  limit = 3
): NrDashEconomyMomentumDriftRow[] {
  return nrDashBuildEconomyMomentumDrift(snap)?.rows.slice(0, limit) ?? [];
}

// --- bundled from core/momentum-history-volatility.ts ---
export interface NrDashMomentumHistoryVolatility {
  sampleSize: number;
  meanVolatility: number;
  maxVolatility: number;
  outlierRegionId: string | null;
}

function historyVolatility(values: number[]): number {
  if (values.length < 2) return 0;
  const min = Math.min(...values);
  const max = Math.max(...values);
  return Math.round((max - min) * 1000) / 1000;
}

/** Cross-region dispersion of LR momentum history range (last points only). */
export function nrDashBuildMomentumHistoryVolatility(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumHistoryVolatility | null {
  if (!snap?.regions.length) return null;
  const scored = snap.regions.map(r => ({
    regionId: r.regionId,
    volatility: historyVolatility(r.momentumHistory),
  }));
  scored.sort((a, b) => b.volatility - a.volatility || a.regionId.localeCompare(b.regionId));
  const meanVolatility =
    Math.round((scored.reduce((s, r) => s + r.volatility, 0) / scored.length) * 1000) / 1000;
  return {
    sampleSize: scored.length,
    meanVolatility,
    maxVolatility: scored[0]?.volatility ?? 0,
    outlierRegionId: scored[0]?.volatility ? scored[0].regionId : null,
  };
}

// --- bundled from core/dependency-inbound-concentration.ts ---
export interface NrDashDependencyInboundConcentration {
  edgeCount: number;
  topConsumerId: string | null;
  concentrationIndex: number;
  topConsumerShare: number;
}

/** Herfindahl clustering of weighted inbound dependency pull by consumer region. */
export function nrDashBuildDependencyInboundConcentration(
  ns: NationalSystemsState | null
): NrDashDependencyInboundConcentration | null {
  const asym = nrDashBuildDependencyAsymmetry(ns);
  if (!asym || !ns?.dependencies?.length) return null;
  const total = asym.rows.reduce((s, r) => s + r.inboundWeight, 0);
  if (total <= 0) return null;
  let topConsumerId: string | null = null;
  let topWeight = 0;
  let concentrationIndex = 0;
  asym.rows.forEach(r => {
    if (r.inboundWeight > topWeight) {
      topWeight = r.inboundWeight;
      topConsumerId = r.regionId;
    }
    const share = r.inboundWeight / total;
    concentrationIndex += share * share;
  });
  return {
    edgeCount: ns.dependencies.length,
    topConsumerId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topConsumerShare: Math.round((topWeight / total) * 1000) / 1000,
  };
}

// --- bundled from core/peripheral-corridor-gap.ts ---
export interface NrDashPeripheralCorridorGap {
  hubRegionId: string | null;
  hubMeanStress: number;
  peripheralMeanStress: number;
  gap: number;
  peripheralLinkCount: number;
}

/** Mean link stress on hub-touching corridors vs all other map links. */
export function nrDashBuildPeripheralCorridorGap(ns: NationalSystemsState | null): NrDashPeripheralCorridorGap | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const stressed = nrDashEnrichMapLinkStress(merged, ns);
  if (!stressed.length) return null;
  const hubLinks = stressed.filter(l => l.fromId === hubRegionId || l.toId === hubRegionId);
  const peripheralLinks = stressed.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  const meanOf = (links: typeof stressed) => {
    if (!links.length) return 0;
    return links.reduce((s, l) => s + (l.stressLevel ?? 0), 0) / links.length;
  };
  const hubMeanStress = Math.round(meanOf(hubLinks) * 1000) / 1000;
  const peripheralMeanStress = Math.round(meanOf(peripheralLinks) * 1000) / 1000;
  return {
    hubRegionId,
    hubMeanStress,
    peripheralMeanStress,
    gap: Math.round((hubMeanStress - peripheralMeanStress) * 1000) / 1000,
    peripheralLinkCount: peripheralLinks.length,
  };
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
    <span>Link weight/opacity: corridor or dependency stress</span>
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

// --- bundled from ui/corridor-stress-strip.tsx ---
export const NrDashCorridorStressStrip: React.FC<{ corridors: NrDashCorridorStressRow[] }> = ({ corridors }) => {
  if (!corridors.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-corridor-stress">
      <div className="font-semibold mb-1">Highest-stress land corridors (NS endpoints)</div>
      <ul className="list-disc list-inside">
        {corridors.map(c => (
          <li key={c.corridorKey}>
            {c.regionA}–{c.regionB}: {Math.round(c.meanPeakUtilization * 100)}% · {c.worstLabel}
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- bundled from ui/needs-imbalance-card.tsx ---
export const NrDashNeedsImbalanceCard: React.FC<{ imbalance: NrDashNeedsImbalance | null }> = ({ imbalance }) => {
  if (!imbalance) return null;
  return (
    <div className="rounded border border-slate-600/50 p-2 text-xs" data-testid="nr-dash-needs-imbalance">
      <div className="font-semibold mb-1">Regional open-needs imbalance</div>
      <div>
        Σ {imbalance.totalOpenNeeds} · μ {imbalance.meanPerRegion}/region · σ {imbalance.stdDev}
        {imbalance.neediestRegionId ? ` · peak ${imbalance.neediestRegionId} (${imbalance.neediestOpenNeeds})` : ''}
        {imbalance.spreadRatio != null ? ` · spread ×${imbalance.spreadRatio}` : ''}
      </div>
    </div>
  );
};

// --- bundled from ui/risk-exposure-card.tsx ---
export const NrDashRiskExposureCard: React.FC<{ exposure: NrDashRiskExposureSummary | null }> = ({ exposure }) => {
  if (!exposure) return null;
  const top = exposure.rows.slice(0, 3);
  return (
    <div className="rounded-lg border border-slate-600/50 p-3 text-xs" data-testid="nr-dash-risk-exposure">
      <div className="font-semibold mb-1">Risk exposure (LR needs + high risks)</div>
      <div className="opacity-80 mb-2">
        Total index {exposure.totalExposure} · σ {exposure.stdDev}
        {exposure.hotspotRegionId ? ` · hotspot ${exposure.hotspotRegionId}` : ''}
      </div>
      <ul className="list-disc list-inside opacity-90">
        {top.map(r => (
          <li key={r.regionId}>
            {r.regionId}: score {r.exposureScore} ({r.openNeeds} needs, {r.highRisks} high risks)
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- bundled from ui/utilization-skew-strip.tsx ---
export const NrDashUtilizationSkewStrip: React.FC<{ skew: NrDashUtilizationSkew | null }> = ({ skew }) => {
  if (!skew) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-utilization-skew">
      National utilization spread {skew.spread} (σ {skew.stdDev}) · hottest{' '}
      {skew.hottestNetwork ? `${NATIONAL_NETWORK_ICON[skew.hottestNetwork]} ${NATIONAL_NETWORK_LABEL[skew.hottestNetwork]}` : '—'}
    </div>
  );
};

// --- bundled from ui/map-hub-strip.tsx ---
export const NrDashMapHubStrip: React.FC<{ hubs: NrDashMapHubRow[]; primaryHubId: string | null }> = ({
  hubs,
  primaryHubId,
}) => {
  if (!hubs.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-map-hubs">
      <div className="font-semibold mb-1">Connectivity hubs (adjacency + dependencies)</div>
      <ul className="list-disc list-inside opacity-90">
        {hubs.map(h => (
          <li key={h.regionId}>
            {h.regionId}: score {h.hubScore}
            {primaryHubId === h.regionId ? ' · primary' : ''} (adj {h.adjacencyCount}, in {h.dependencyIn}, out{' '}
            {h.dependencyOut})
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- bundled from ui/capacity-headroom-strip.tsx ---
export const NrDashCapacityHeadroomStrip: React.FC<{ headroom: NrDashCapacityHeadroom | null }> = ({ headroom }) => {
  if (!headroom) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-capacity-headroom">
      <div className="font-semibold mb-1">National capacity headroom</div>
      <div>
        μ {headroom.meanHeadroom} · σ {headroom.stdDev} · spread {headroom.spread}
        {headroom.tightestNetwork ? (
          <>
            {' '}
            · tightest {NATIONAL_NETWORK_ICON[headroom.tightestNetwork]}{' '}
            {NATIONAL_NETWORK_LABEL[headroom.tightestNetwork]}
          </>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

// --- bundled from ui/owner-stress-gap-card.tsx ---
export const NrDashOwnerStressGapCard: React.FC<{ gap: NrDashOwnerStressGap | null }> = ({ gap }) => {
  if (!gap) return null;
  return (
    <div className="rounded border border-slate-600/50 p-2 text-xs" data-testid="nr-dash-owner-stress-gap">
      <div className="font-semibold mb-1">Your regions vs national stress</div>
      <div>
        {gap.ownedRegionCount} owned · needs μ {gap.ownedMeanOpenNeeds} vs {gap.nationalMeanOpenNeeds} national (Δ{' '}
        {gap.openNeedsGap >= 0 ? '+' : ''}
        {gap.openNeedsGap})
        {gap.resilienceGap != null
          ? ` · resilience Δ ${gap.resilienceGap >= 0 ? '+' : ''}${gap.resilienceGap}`
          : ''}
      </div>
    </div>
  );
};

// --- bundled from ui/peripheral-isolation-strip.tsx ---
export const NrDashPeripheralIsolationStrip: React.FC<{
  rows: NrDashPeripheralIsolationRow[];
}> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-peripheral-isolation">
      <div className="font-semibold mb-1">Peripheral isolation (low connectivity)</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: isolation {r.isolationScore} (hub {r.hubScore})
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- bundled from ui/border-stress-strip.tsx ---
export const NrDashBorderStressStrip: React.FC<{ rows: NrDashBorderStressRow[] }> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-border-stress">
      <div className="font-semibold mb-1">Border corridor stress (max per region)</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: {Math.round(r.maxCorridorStress * 100)}% on {r.corridorCount} border(s)
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- bundled from ui/owned-momentum-skew-card.tsx ---
export const NrDashOwnedMomentumSkewCard: React.FC<{ skew: NrDashOwnedMomentumSkew | null }> = ({ skew }) => {
  if (!skew) return null;
  return (
    <div className="rounded border border-slate-600/50 p-2 text-xs" data-testid="nr-dash-owned-momentum-skew">
      <div className="font-semibold mb-1">Your portfolio momentum skew</div>
      <div>
        {skew.ownedRegionCount} owned · rank μ {skew.ownedMeanRank} vs {skew.nationalMeanRank} national (Δ{' '}
        {skew.rankSkew >= 0 ? '+' : ''}
        {skew.rankSkew})
      </div>
    </div>
  );
};

// --- bundled from ui/dependency-asymmetry-strip.tsx ---
export const NrDashDependencyAsymmetryStrip: React.FC<{ rows: NrDashDependencyAsymmetryRow[] }> = ({ rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dependency-asymmetry">
      <div className="font-semibold mb-1">Dependency flow asymmetry</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: net {r.netImportWeight >= 0 ? 'import' : 'export'} {Math.abs(r.netImportWeight)} (in {r.inboundWeight} / out{' '}
            {r.outboundWeight})
          </li>
        ))}
      </ul>
    </div>
  );
};

// --- bundled from ui/util-alignment-strip.tsx ---
export const NrDashUtilAlignmentStrip: React.FC<{ drift: NrDashUtilAlignmentDrift | null }> = ({ drift }) => {
  if (!drift) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-util-alignment">
      <div className="font-semibold mb-1">National vs regional util drift</div>
      <div>
        mean drift {drift.meanDrift}
        {drift.worstNetwork ? ` · widest gap ${drift.worstNetwork}` : ''}
      </div>
    </div>
  );
};

// --- bundled from ui/open-needs-concentration-card.tsx ---
export const NrDashOpenNeedsConcentrationCard: React.FC<{ conc: NrDashOpenNeedsConcentration | null }> = ({ conc }) => {
  if (!conc) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-concentration">
      <div className="font-semibold mb-1">Open needs concentration</div>
      <div>
        HHI {conc.concentrationIndex} · top {conc.topRegionId ?? '—'} ({Math.round(conc.topRegionShare * 100)}% of{' '}
        {conc.totalOpenNeeds})
      </div>
    </div>
  );
};

// --- bundled from ui/economy-momentum-drift-strip.tsx ---
export const NrDashEconomyMomentumDriftStrip: React.FC<{
  meanAbsDrift: number;
  rows: NrDashEconomyMomentumDriftRow[];
}> = ({ meanAbsDrift, rows }) => {
  if (!rows.length) return null;
  return (
    <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-momentum-drift">
      <div className="font-semibold mb-1">Economy ↔ momentum rank drift</div>
      <div className="opacity-90 mb-1">μ |Δ| {meanAbsDrift}</div>
      <ul className="list-disc list-inside opacity-90">
        {rows.map(r => (
          <li key={r.regionId}>
            {r.regionId}: econ {r.economyRank} vs mom {r.momentumRank} (Δ {r.drift})
          </li>
        ))}
      </ul>
    </div>
  );
};

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
          strokeWidth={(link.kind === 'dependency' ? 0.9 : 0.5) + (link.stressLevel ?? 0) * 0.8}
          strokeDasharray={link.dash}
          opacity={0.55 + (link.stressLevel ?? 0) * 0.45}
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
      const pulse = n.pulseIntensity ?? 0;
      return (
        <g key={n.regionId} data-testid={`agent23-map-node-${n.regionId}`} opacity={opacity}>
          {pulse > 0.15 && (
            <circle
              cx={n.x}
              cy={n.y}
              r={r + 2.4 + pulse * 2}
              fill="none"
              stroke="#fbbf24"
              strokeWidth={0.35 + pulse * 0.5}
              opacity={0.25 + pulse * 0.45}
              data-testid={`agent23-map-pulse-${n.regionId}`}
            />
          )}
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
    <NrDashNeedsImbalanceCard imbalance={nrDashBuildNeedsImbalance(snap)} />
    <NrDashOpenNeedsConcentrationCard conc={nrDashBuildOpenNeedsConcentration(snap)} />
    <NrDashRiskExposureCard exposure={nrDashBuildRiskExposure(snap)} />
    <NrDashOwnerStressGapCard gap={nrDashBuildOwnerStressGap(snap)} />
    <NrDashOwnedMomentumSkewCard skew={nrDashBuildOwnedMomentumSkew(snap)} />
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
  nsState: NationalSystemsState | null;
  focusRegionId: string | null;
  onFocusRegion?: (id: string) => void;
}> = ({ snap, nsState, focusRegionId, onFocusRegion }) => (
  <div className="space-y-2" data-testid="nr-dash-tab-regions">
    <NrDashProvenanceStrip items={snap.provenance.filter(p => p.source === 'living_regions')} />
    <NrDashRegionsDepthStrip
      spread={nrDashBuildResilienceSpread(snap)}
      outliers={nrDashTopParityOutliers(snap, 3)}
    />
    <NrDashPeripheralIsolationStrip rows={nrDashTopPeripheralRegions(nsState, 3)} />
    <NrDashDependencyAsymmetryStrip rows={nrDashTopDependencyAsymmetry(nsState, 3)} />
    {(() => {
      const inboundConc = nrDashBuildDependencyInboundConcentration(nsState);
      return inboundConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-inbound-concentration">
          Dependency inbound concentration {inboundConc.concentrationIndex} · top consumer {inboundConc.topConsumerId ?? '—'} (
          {Math.round(inboundConc.topConsumerShare * 100)}%)
        </div>
      ) : null;
    })()}
    <NrDashEconomyMomentumDriftStrip
      meanAbsDrift={nrDashBuildEconomyMomentumDrift(snap)?.meanAbsDrift ?? 0}
      rows={nrDashTopEconomyMomentumDrift(snap, 3)}
    />
    {nrDashTopTensionOutliers(snap, 3).length > 0 && (
      <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-tension-outliers">
        <div className="font-semibold mb-1">Momentum ↔ resilience tension</div>
        <ul className="list-disc list-inside opacity-90">
          {nrDashTopTensionOutliers(snap, 3).map(t => (
            <li key={t.regionId}>
              {t.regionId}: tension {t.tensionScore} (mom rank {t.momentumRank}, resilience {t.resilience})
            </li>
          ))}
        </ul>
      </div>
    )}
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
  const coupling = nrDashBuildNetworkCoupling(ns);
  const chokepoints = nrDashTopDependencyChokepoints(ns, 3);
  const snapSkew = nrDashBuildUtilizationSkew(
    nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null)
  );
  const headroom = nrDashBuildCapacityHeadroom(
    nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null)
  );
  const strainDiv = nrDashBuildStrainDiversity(ns);
  const bottleneckConc = nrDashBuildBottleneckConcentration(ns);
  const utilDrift = nrDashBuildUtilAlignmentDrift(ns);
  const criticalDensity = nrDashBuildCriticalCellDensity(ns);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-networks">
      <NrDashUtilAlignmentStrip drift={utilDrift} />
      <NrDashUtilizationSkewStrip skew={snapSkew} />
      <NrDashCapacityHeadroomStrip headroom={headroom} />
      {strainDiv && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-strain-diversity">
          Strain diversity index {strainDiv.diversityIndex} · dominant {strainDiv.dominantCondition ?? '—'} · μ weight{' '}
          {strainDiv.meanWeight}
        </div>
      )}
      {criticalDensity && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-cell-density">
          Critical+ cell density {criticalDensity.density} · {criticalDensity.criticalPlusCount}/{criticalDensity.cellCount}
          {criticalDensity.worstRegionId ? ` · worst ${criticalDensity.worstRegionId}` : ''}
        </div>
      )}
      {bottleneckConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-concentration">
          Bottleneck concentration {bottleneckConc.concentrationIndex} · top {bottleneckConc.topRegionId ?? '—'} (
          {Math.round(bottleneckConc.topRegionShare * 100)}% of {bottleneckConc.activeCount})
        </div>
      )}
      {coupling && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-coupling">
          Network coupling μ {coupling.meanCoupling} · hottest {coupling.maxCouplingRegionId ?? '—'}
        </div>
      )}
      {chokepoints.length > 0 && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dependency-chokepoints">
          <div className="font-semibold mb-1">Dependency chokepoints (endpoint stress)</div>
          <ul className="list-disc list-inside">
            {chokepoints.map(c => (
              <li key={c.dependencyId}>
                {c.label}: score {c.chokeScore}
              </li>
            ))}
          </ul>
        </div>
      )}
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
  const coherence = nrDashBuildTrendCoherence(snap);
  const acceleration = nrDashBuildTrendAcceleration(snap);
  const historyVol = nrDashBuildMomentumHistoryVolatility(snap);
  return (
    <div data-testid="nr-dash-tab-trends">
      <NrDashProvenanceStrip items={snap.provenance} />
      {coherence && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-trend-coherence">
          <div className="font-semibold mb-1">National momentum coherence</div>
          <div>
            score {coherence.coherenceScore} · σ {coherence.stdDev}
            {coherence.divergentRegionId ? ` · outlier ${coherence.divergentRegionId}` : ''}
          </div>
        </div>
      )}
      {historyVol && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-volatility">
          <div className="font-semibold mb-1">Momentum history volatility</div>
          <div>
            μ range {historyVol.meanVolatility} · max {historyVol.maxVolatility}
            {historyVol.outlierRegionId ? ` · outlier ${historyVol.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {acceleration && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-trend-acceleration">
          <div className="font-semibold mb-1">Momentum acceleration coherence</div>
          <div>
            score {acceleration.coherenceScore} · μ acc {acceleration.meanAcceleration}
            {acceleration.outlierRegionId ? ` · outlier ${acceleration.outlierRegionId}` : ''}
          </div>
        </div>
      )}
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
  const nodes = useMemo(
    () => nrDashApplyMapPulse(nrDashApplyMapFocus(baseNodes, focusRegionId)),
    [baseNodes, focusRegionId]
  );
  const pulseHot = useMemo(() => nrDashHottestPulseRegion(nodes), [nodes]);
  const allLinks = useMemo(
    () =>
      nrDashMergeMapLinks(
        nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
        nrDashBuildDependencyLinks(nsState, AGENT23_REGION_MAP_LAYOUT)
      ),
    [nsState]
  );
  const stressedLinks = useMemo(() => nrDashEnrichMapLinkStress(allLinks, nsState), [allLinks, nsState]);
  const links = useMemo(
    () => (focusRegionId ? nrDashLinksTouchingRegion(stressedLinks, focusRegionId) : stressedLinks),
    [stressedLinks, focusRegionId]
  );
  const hottestLink = useMemo(() => nrDashHottestMapLinkStress(stressedLinks), [stressedLinks]);
  const hubRows = useMemo(() => nrDashTopMapHubs(nsState, 3), [nsState]);
  const primaryHub = useMemo(() => nrDashPrimaryMapHub(nsState), [nsState]);
  const hubLoad = useMemo(() => nrDashBuildHubCorridorLoad(nsState), [nsState]);
  const peripheralGap = useMemo(() => nrDashBuildPeripheralCorridorGap(nsState), [nsState]);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-map">
      <NrDashProvenanceStrip items={snap.provenance} />
      <RegionPositionMap nodes={nodes} links={links} focusRegionId={focusRegionId} onSelect={onFocusRegion} />
      <NrDashCorridorStressStrip corridors={nrDashTopCorridorStress(nsState, 4)} />
      <NrDashBorderStressStrip rows={nrDashTopBorderStress(nsState, 3)} />
      <NrDashMapHubStrip hubs={hubRows} primaryHubId={primaryHub} />
      {peripheralGap && peripheralGap.peripheralLinkCount > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-peripheral-corridor-gap">
          Hub vs peripheral corridor gap: hub μ {Math.round(peripheralGap.hubMeanStress * 100)}% · rim μ{' '}
          {Math.round(peripheralGap.peripheralMeanStress * 100)}% · Δ {Math.round(peripheralGap.gap * 100)}%
        </p>
      )}
      {hubLoad && hubLoad.touchingLinkCount > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-hub-load">
          Hub {hubLoad.hubRegionId} corridor load: μ stress {Math.round(hubLoad.meanLinkStress * 100)}% · peak{' '}
          {hubLoad.peakLinkLabel} ({Math.round(hubLoad.peakLinkStress * 100)}%)
        </p>
      )}
      {hottestLink && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-link-stress-hot">
          Hottest link stress: {hottestLink.label} ({Math.round((hottestLink.stressLevel ?? 0) * 100)}%)
        </p>
      )}
      {nrDashHottestBorderRegion(nsState) && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-border-hot">
          Hottest border stress: {nrDashHottestBorderRegion(nsState)}
        </p>
      )}
      {pulseHot && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-hot">
          Pulse hotspot: {pulseHot} (momentum activity + needs + risks)
        </p>
      )}
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
            <NrDashRegionsTab
              snap={snap}
              nsState={nsState}
              focusRegionId={focusRegionId}
              onFocusRegion={onFocusRegion}
            />
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

  check('a23_corridor_stress', 'Corridor stress ranks NSW adjacency high', () => {
    const rows = nrDashTopCorridorStress(createAgent23NsFixture(), 3);
    return rows.length === 3 && rows.some(r => r.corridorKey.includes('NSW'));
  });

  check('a23_network_coupling', 'Network coupling reports NSW strained cell', () => {
    const c = nrDashBuildNetworkCoupling(createAgent23NsFixture())!;
    const nsw = c.rows.find(r => r.regionId === 'NSW');
    return c.meanCoupling >= 0 && Boolean(nsw && nsw.strainedCount >= 1);
  });

  check('a23_dep_chokepoint', 'Dependency chokepoints preserve fixture order by score', () => {
    const rows = nrDashBuildDependencyChokepoints(createAgent23NsFixture());
    return rows.length === 3 && rows[0].chokeScore >= rows[rows.length - 1].chokeScore;
  });

  check('a23_needs_imbalance', 'Needs imbalance totals match snapshot rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const im = nrDashBuildNeedsImbalance(snap)!;
    const expected = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
    return im.totalOpenNeeds === expected && im.stdDev >= 0;
  });

  check('a23_map_pulse', 'Map pulse applies intensity and hotspot', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const base = nrDashBuildRegionMapNodes(snap);
    const pulsed = nrDashApplyMapPulse(base);
    return (
      nrDashBuildMapPulseRows(base).every(p => p.intensity >= 0 && p.intensity <= 1) &&
      pulsed.every(n => n.pulseIntensity != null) &&
      nrDashHottestPulseRegion(pulsed) != null
    );
  });

  check('a23_corridor_count', 'Corridor stress covers adjacency pair count', () => {
    const pairs = agent23ListAdjacencyPairs();
    return nrDashBuildCorridorStressRows(createAgent23NsFixture()).length === pairs.length;
  });

  check('a23_risk_exposure', 'Risk exposure hotspot marks NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const ex = nrDashBuildRiskExposure(snap)!;
    return ex.totalExposure >= 8 && ex.hotspotRegionId === 'NSW' && nrDashTopRiskExposureRows(snap, 2).length === 2;
  });

  check('a23_util_skew', 'Utilization skew spans five national bars', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const skew = nrDashBuildUtilizationSkew(snap)!;
    return skew.sampleSize === 5 && skew.spread >= 0 && skew.stdDev >= 0;
  });

  check('a23_tension', 'Momentum-resilience tension lists merged rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const t = nrDashBuildMomentumResilienceTension(snap)!;
    return t.rows.length === 8 && t.meanAbsTension >= 0 && nrDashTopTensionOutliers(snap, 2).length <= 2;
  });

  check('a23_map_hubs', 'Map hub index ranks NSW highly', () => {
    const ns = createAgent23NsFixture();
    const hubs = nrDashTopMapHubs(ns, 3);
    return hubs.length === 3 && nrDashBuildMapHubIndex(ns).length >= 8 && nrDashPrimaryMapHub(ns) != null;
  });

  check('a23_link_stress', 'Link stress enriches adjacency and dependency links', () => {
    const ns = createAgent23NsFixture();
    const merged = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    );
    const stressed = nrDashEnrichMapLinkStress(merged, ns);
    const hot = nrDashHottestMapLinkStress(stressed);
    return (
      stressed.every(l => l.stressLevel != null && l.stressLevel >= 0 && l.stressLevel <= 1) &&
      Boolean(hot && (hot.stressLevel ?? 0) > 0)
    );
  });

  check('a23_capacity_headroom', 'Capacity headroom complements utilization skew', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const head = nrDashBuildCapacityHeadroom(snap)!;
    const skew = nrDashBuildUtilizationSkew(snap)!;
    return head.sampleSize === 5 && head.meanHeadroom + skew.meanUtilization > 0.9 && head.spread >= 0;
  });

  check('a23_strain_diversity', 'Strain diversity covers heat grid cells', () => {
    const div = nrDashBuildStrainDiversity(createAgent23NsFixture())!;
    return div.cellCount === 40 && div.diversityIndex >= 0 && div.dominantCondition != null;
  });

  check('a23_owner_stress_gap', 'Owner stress gap compares NSW player row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    const gap = nrDashBuildOwnerStressGap(snap)!;
    return gap.ownedRegionCount === 1 && gap.openNeedsGap === 0 && gap.resilienceGap != null;
  });

  check('a23_peripheral_isolation', 'Peripheral isolation ranks TAS or WA highly', () => {
    const rows = nrDashTopPeripheralRegions(createAgent23NsFixture(), 3);
    return rows.length === 3 && rows.some(r => r.regionId === 'TAS' || r.regionId === 'WA');
  });

  check('a23_trend_coherence', 'Trend coherence uses momentum history deltas', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const c = nrDashBuildTrendCoherence(snap)!;
    return c.sampleSize === 8 && c.coherenceScore >= 0 && c.coherenceScore <= 1;
  });

  check('a23_border_stress', 'Border stress marks NSW fixture corridor hot', () => {
    const ns = createAgent23NsFixture();
    const rows = nrDashTopBorderStress(ns, 3);
    return (
      rows.length === 3 &&
      nrDashBuildBorderStressRows(ns).length >= 8 &&
      nrDashHottestBorderRegion(ns) === 'NSW'
    );
  });

  check('a23_bottleneck_conc', 'Bottleneck concentration peaks on NSW fixture', () => {
    const conc = nrDashBuildBottleneckConcentration(createAgent23NsFixture())!;
    return conc.activeCount === 1 && conc.topRegionId === 'NSW' && conc.concentrationIndex === 1;
  });

  check('a23_dep_asymmetry', 'Dependency asymmetry ranks net consumers', () => {
    const ns = createAgent23NsFixture();
    const summary = nrDashBuildDependencyAsymmetry(ns)!;
    const top = nrDashTopDependencyAsymmetry(ns, 2);
    return summary.rows.length === 8 && top.length === 2 && top.some(r => r.netImportWeight > 0);
  });

  check('a23_owned_mom_skew', 'Owned momentum skew compares player portfolio', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you', VIC: 'you' })!;
    const skew = nrDashBuildOwnedMomentumSkew(snap)!;
    return skew.ownedRegionCount === 2 && skew.rankSkew === 0;
  });

  check('a23_util_drift', 'Util alignment drift spans five networks', () => {
    const drift = nrDashBuildUtilAlignmentDrift(createAgent23NsFixture())!;
    return drift.rows.length === 5 && drift.meanDrift >= 0;
  });

  check('a23_trend_accel', 'Trend acceleration uses three-point history', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const acc = nrDashBuildTrendAcceleration(snap)!;
    return acc.sampleSize === 8 && acc.coherenceScore >= 0 && acc.coherenceScore <= 1;
  });

  check('a23_hub_load', 'Hub corridor load aggregates touching link stress', () => {
    const load = nrDashBuildHubCorridorLoad(createAgent23NsFixture())!;
    return load.hubRegionId != null && load.touchingLinkCount >= 1 && load.peakLinkStress >= 0;
  });

  check('a23_open_needs_conc', 'Open needs concentration is uniform on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildOpenNeedsConcentration(snap)!;
    return conc.totalOpenNeeds === 8 && conc.concentrationIndex === 0.125;
  });

  check('a23_critical_density', 'Critical cell density counts VIC energy cell', () => {
    const density = nrDashBuildCriticalCellDensity(createAgent23NsFixture())!;
    return density.cellCount === 40 && density.criticalPlusCount === 1 && density.worstRegionId === 'VIC';
  });

  check('a23_econ_mom_drift', 'Economy momentum drift spans eight regions', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const drift = nrDashBuildEconomyMomentumDrift(snap)!;
    return drift.rows.length === 8 && nrDashTopEconomyMomentumDrift(snap, 2).length === 2;
  });

  check('a23_history_vol', 'Momentum history volatility finds ACT outlier', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const vol = nrDashBuildMomentumHistoryVolatility(snap)!;
    return vol.sampleSize === 8 && vol.maxVolatility >= vol.meanVolatility && vol.outlierRegionId === 'ACT';
  });

  check('a23_dep_inbound_conc', 'Dependency inbound concentration peaks on NT fixture', () => {
    const conc = nrDashBuildDependencyInboundConcentration(createAgent23NsFixture())!;
    return conc.edgeCount === 3 && conc.topConsumerId === 'NT' && conc.concentrationIndex > 0;
  });

  check('a23_peripheral_gap', 'Peripheral corridor gap compares hub vs rim stress', () => {
    const gap = nrDashBuildPeripheralCorridorGap(createAgent23NsFixture())!;
    return gap.hubRegionId != null && gap.peripheralLinkCount >= 1;
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

