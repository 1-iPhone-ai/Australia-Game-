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

// --- bundled from core/risk-exposure-concentration.ts ---
export interface NrDashRiskExposureConcentration {
  totalExposure: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of LR risk exposure scores across regions. */
export function nrDashBuildRiskExposureConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashRiskExposureConcentration | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  let topRegionId: string | null = null;
  let topScore = 0;
  let concentrationIndex = 0;
  exposure.rows.forEach(r => {
    if (r.exposureScore > topScore) {
      topScore = r.exposureScore;
      topRegionId = r.regionId;
    }
    const share = r.exposureScore / exposure.totalExposure;
    concentrationIndex += share * share;
  });
  return {
    totalExposure: exposure.totalExposure,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topScore / exposure.totalExposure) * 1000) / 1000,
  };
}

// --- bundled from core/high-risk-region-density.ts ---
export interface NrDashHighRiskRegionDensity {
  regionCount: number;
  highRiskRegionCount: number;
  density: number;
}

/** Share of LR regions reporting at least one high-severity risk. */
export function nrDashBuildHighRiskRegionDensity(
  snap: NrDashAuthSnapshot | null
): NrDashHighRiskRegionDensity | null {
  if (!snap?.regions.length) return null;
  const highRiskRegionCount = snap.regions.filter(r => r.highRisks > 0).length;
  return {
    regionCount: snap.regions.length,
    highRiskRegionCount,
    density: Math.round((highRiskRegionCount / snap.regions.length) * 1000) / 1000,
  };
}

// --- bundled from core/dependency-outbound-concentration.ts ---
export interface NrDashDependencyOutboundConcentration {
  edgeCount: number;
  topProviderId: string | null;
  concentrationIndex: number;
  topProviderShare: number;
}

/** Herfindahl clustering of weighted outbound dependency push by provider region. */
export function nrDashBuildDependencyOutboundConcentration(
  ns: NationalSystemsState | null
): NrDashDependencyOutboundConcentration | null {
  const asym = nrDashBuildDependencyAsymmetry(ns);
  if (!asym || !ns?.dependencies?.length) return null;
  const total = asym.rows.reduce((s, r) => s + r.outboundWeight, 0);
  if (total <= 0) return null;
  let topProviderId: string | null = null;
  let topWeight = 0;
  let concentrationIndex = 0;
  asym.rows.forEach(r => {
    if (r.outboundWeight > topWeight) {
      topWeight = r.outboundWeight;
      topProviderId = r.regionId;
    }
    const share = r.outboundWeight / total;
    concentrationIndex += share * share;
  });
  return {
    edgeCount: ns.dependencies.length,
    topProviderId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topProviderShare: Math.round((topWeight / total) * 1000) / 1000,
  };
}

// --- bundled from core/national-network-util-spread.ts ---
export interface NrDashNationalNetworkUtilSpread {
  networkCount: number;
  meanUtilization: number;
  stdDev: number;
  maxUtilNetwork: string | null;
}

/** Dispersion of authoritative national-level network utilization (NS national row). */
export function nrDashBuildNationalNetworkUtilSpread(
  ns: NationalSystemsState | null
): NrDashNationalNetworkUtilSpread | null {
  if (!ns?.national) return null;
  const utils = NATIONAL_NETWORKS.map(n => ns.national[n]?.utilization ?? 0);
  if (!utils.length) return null;
  const meanUtilization = utils.reduce((s, u) => s + u, 0) / utils.length;
  const variance =
    utils.reduce((s, u) => s + (u - meanUtilization) ** 2, 0) / Math.max(utils.length, 1);
  let maxUtilNetwork: string | null = null;
  let maxUtil = -1;
  NATIONAL_NETWORKS.forEach((n, i) => {
    if (utils[i] > maxUtil) {
      maxUtil = utils[i];
      maxUtilNetwork = n;
    }
  });
  return {
    networkCount: utils.length,
    meanUtilization: Math.round(meanUtilization * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxUtilNetwork,
  };
}

// --- bundled from core/resilience-utilization-gap.ts ---
export interface NrDashResilienceUtilizationGap {
  sampleSize: number;
  meanAbsGap: number;
  maxGapRegionId: string | null;
}

function meanNetworkUtil(reg: NationalSystemsState['regions'][string]): number {
  let sum = 0;
  NATIONAL_NETWORKS.forEach(n => {
    sum += reg.networks[n]?.utilization ?? 0;
  });
  return sum / NATIONAL_NETWORKS.length;
}

/** Mean |NS resilience − mean regional network util×100| per authoritative region row. */
export function nrDashBuildResilienceUtilizationGap(
  ns: NationalSystemsState | null
): NrDashResilienceUtilizationGap | null {
  if (!ns?.regions) return null;
  const gaps: { regionId: string; absGap: number }[] = [];
  Object.values(ns.regions).forEach(reg => {
    if (!Number.isFinite(reg.resilience)) return;
    const utilPct = meanNetworkUtil(reg) * 100;
    const gap = Math.abs(reg.resilience - utilPct);
    gaps.push({ regionId: reg.regionId, absGap: Math.round(gap * 10) / 10 });
  });
  if (!gaps.length) return null;
  gaps.sort((a, b) => b.absGap - a.absGap || a.regionId.localeCompare(b.regionId));
  const meanAbsGap =
    Math.round((gaps.reduce((s, g) => s + g.absGap, 0) / gaps.length) * 100) / 100;
  return {
    sampleSize: gaps.length,
    meanAbsGap,
    maxGapRegionId: gaps[0]?.regionId ?? null,
  };
}

// --- bundled from core/link-stress-dispersion.ts ---
export interface NrDashLinkStressDispersion {
  linkCount: number;
  meanStress: number;
  stdDev: number;
  hottestLinkId: string | null;
}

/** Dispersion of enriched map link stress levels (corridor + dependency). */
export function nrDashBuildLinkStressDispersion(ns: NationalSystemsState | null): NrDashLinkStressDispersion | null {
  if (!ns) return null;
  const links = nrDashEnrichMapLinkStress(
    nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
    ),
    ns
  );
  const stresses = links.map(l => l.stressLevel ?? 0).filter(s => Number.isFinite(s));
  if (!stresses.length) return null;
  const meanStress = stresses.reduce((s, n) => s + n, 0) / stresses.length;
  const variance =
    stresses.reduce((s, n) => s + (n - meanStress) ** 2, 0) / Math.max(stresses.length, 1);
  const ranked = [...links].sort((a, b) => (b.stressLevel ?? 0) - (a.stressLevel ?? 0));
  return {
    linkCount: stresses.length,
    meanStress: Math.round(meanStress * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    hottestLinkId: ranked[0]?.id ?? null,
  };
}

// --- bundled from core/momentum-delta-spread.ts ---
export interface NrDashMomentumDeltaSpread {
  sampleSize: number;
  meanAbsDelta: number;
  stdDev: number;
  outlierRegionId: string | null;
}

/** Cross-region dispersion of LR momentum history deltas (last − first). */
export function nrDashBuildMomentumDeltaSpread(snap: NrDashAuthSnapshot | null): NrDashMomentumDeltaSpread | null {
  if (!snap?.regions.length) return null;
  const deltas = nrDashBuildTrendDeltas(snap.regions)
    .filter(r => r.delta != null)
    .map(r => ({ regionId: r.regionId, delta: r.delta as number }));
  if (!deltas.length) return null;
  const absValues = deltas.map(d => Math.abs(d.delta));
  const meanAbsDelta =
    Math.round((absValues.reduce((s, n) => s + n, 0) / absValues.length) * 1000) / 1000;
  const mean = absValues.reduce((s, n) => s + n, 0) / absValues.length;
  const variance =
    absValues.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(absValues.length, 1);
  const ranked = [...deltas].sort(
    (a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.regionId.localeCompare(b.regionId)
  );
  return {
    sampleSize: deltas.length,
    meanAbsDelta,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    outlierRegionId: ranked[0]?.regionId ?? null,
  };
}

// --- bundled from core/constraint-concentration.ts ---
export interface NrDashConstraintConcentration {
  regionCount: number;
  dominantNetwork: NationalNetworkKind | null;
  concentrationIndex: number;
  dominantShare: number;
}

/** Herfindahl clustering of NS primaryConstraint assignments across regions. */
export function nrDashBuildConstraintConcentration(
  ns: NationalSystemsState | null
): NrDashConstraintConcentration | null {
  if (!ns?.regions) return null;
  const counts: Record<NationalNetworkKind, number> = {
    freight: 0,
    energy: 0,
    water: 0,
    trade: 0,
    digital: 0,
  };
  let regionCount = 0;
  Object.values(ns.regions).forEach(r => {
    if (!r.primaryConstraint) return;
    regionCount += 1;
    counts[r.primaryConstraint] += 1;
  });
  if (regionCount <= 0) return null;
  let dominantNetwork: NationalNetworkKind | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  NATIONAL_NETWORKS.forEach(network => {
    const c = counts[network];
    if (c > topCount) {
      topCount = c;
      dominantNetwork = network;
    }
    const share = c / regionCount;
    concentrationIndex += share * share;
  });
  return {
    regionCount,
    dominantNetwork,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    dominantShare: Math.round((topCount / regionCount) * 1000) / 1000,
  };
}

// --- bundled from core/bottleneck-network-span.ts ---
export interface NrDashBottleneckNetworkSpan {
  bottleneckCount: number;
  distinctNetworks: number;
  networks: NationalNetworkKind[];
}

/** Count distinct NS networks represented in active bottleneck records. */
export function nrDashBuildBottleneckNetworkSpan(
  ns: NationalSystemsState | null
): NrDashBottleneckNetworkSpan | null {
  if (!ns?.bottlenecks?.length) return null;
  const set = new Set<NationalNetworkKind>();
  ns.bottlenecks.forEach(b => {
    if (b.network) set.add(b.network);
  });
  const networks = [...set].sort();
  return {
    bottleneckCount: ns.bottlenecks.length,
    distinctNetworks: networks.length,
    networks,
  };
}

// --- bundled from core/dependency-importance-spread.ts ---
const IMPORTANCE_WEIGHT: Record<string, number> = {
  moderate: 1,
  high: 1.25,
  critical: 1.5,
};

export interface NrDashDependencyImportanceSpread {
  edgeCount: number;
  meanWeight: number;
  stdDev: number;
  maxWeight: number;
}

/** Dispersion of authoritative dependency edge importance weights. */
export function nrDashBuildDependencyImportanceSpread(
  ns: NationalSystemsState | null
): NrDashDependencyImportanceSpread | null {
  if (!ns?.dependencies?.length) return null;
  const weights = ns.dependencies.map(d => IMPORTANCE_WEIGHT[d.importance] ?? 1);
  const meanWeight = weights.reduce((s, w) => s + w, 0) / weights.length;
  const variance =
    weights.reduce((s, w) => s + (w - meanWeight) ** 2, 0) / Math.max(weights.length, 1);
  return {
    edgeCount: weights.length,
    meanWeight: Math.round(meanWeight * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxWeight: Math.max(...weights),
  };
}

// --- bundled from core/map-pulse-concentration.ts ---
export interface NrDashMapPulseConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of map pulse intensities across region nodes. */
export function nrDashBuildMapPulseConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashMapPulseConcentration | null {
  if (!snap?.regions.length) return null;
  const pulses = nrDashBuildMapPulseRows(nrDashBuildRegionMapNodes(snap));
  const total = pulses.reduce((s, p) => s + p.intensity, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topIntensity = 0;
  let concentrationIndex = 0;
  pulses.forEach(p => {
    if (p.intensity > topIntensity) {
      topIntensity = p.intensity;
      topRegionId = p.regionId;
    }
    const share = p.intensity / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: pulses.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topIntensity / total) * 1000) / 1000,
  };
}

// --- bundled from core/economy-resilience-drift.ts ---
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

export interface NrDashEconomyResilienceDriftRow {
  regionId: string;
  economyRank: number;
  resilienceBandRank: number;
  drift: number;
}

export interface NrDashEconomyResilienceDrift {
  rows: NrDashEconomyResilienceDriftRow[];
  meanAbsDrift: number;
  outlierRegionId: string | null;
}

/** LR economy band rank vs NS resilience scaled to 0..4 (merged snapshot rows). */
export function nrDashBuildEconomyResilienceDrift(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyResilienceDrift | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashEconomyResilienceDriftRow[] = [];
  snap.regions.forEach(r => {
    if (r.resilience == null) return;
    const economyRank = economyRankFromLabel(r.economyBand);
    const resilienceBandRank = Math.round((r.resilience / 100) * 4 * 10) / 10;
    rows.push({
      regionId: r.regionId,
      economyRank,
      resilienceBandRank,
      drift: Math.round((resilienceBandRank - economyRank) * 10) / 10,
    });
  });
  if (!rows.length) return null;
  rows.sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift) || a.regionId.localeCompare(b.regionId));
  const meanAbsDrift =
    Math.round((rows.reduce((s, r) => s + Math.abs(r.drift), 0) / rows.length) * 1000) / 1000;
  return { rows, meanAbsDrift, outlierRegionId: rows[0]?.regionId ?? null };
}

export function nrDashTopEconomyResilienceDrift(
  snap: NrDashAuthSnapshot | null,
  limit = 3
): NrDashEconomyResilienceDriftRow[] {
  return nrDashBuildEconomyResilienceDrift(snap)?.rows.slice(0, limit) ?? [];
}

// --- bundled from core/owned-risk-exposure-share.ts ---
export interface NrDashOwnedRiskExposureShare {
  ownedRegionCount: number;
  totalExposure: number;
  ownedExposure: number;
  ownedShare: number;
}

/** Share of aggregate LR risk exposure index on player-owned regions. */
export function nrDashBuildOwnedRiskExposureShare(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedRiskExposureShare | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  const owned = exposure.rows.filter(r => {
    const row = snap?.regions.find(x => x.regionId === r.regionId);
    return row?.owner === 'you';
  });
  if (!owned.length) return null;
  const ownedExposure = owned.reduce((s, r) => s + r.exposureScore, 0);
  return {
    ownedRegionCount: owned.length,
    totalExposure: exposure.totalExposure,
    ownedExposure,
    ownedShare: Math.round((ownedExposure / exposure.totalExposure) * 1000) / 1000,
  };
}

// --- bundled from core/corridor-stress-concentration.ts ---
export interface NrDashCorridorStressConcentration {
  corridorCount: number;
  topCorridorKey: string | null;
  concentrationIndex: number;
  topCorridorShare: number;
}

/** Herfindahl clustering of land-corridor mean peak utilization (NS adjacency). */
export function nrDashBuildCorridorStressConcentration(
  ns: NationalSystemsState | null
): NrDashCorridorStressConcentration | null {
  const rows = nrDashBuildCorridorStressRows(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.meanPeakUtilization, 0);
  if (total <= 0) return null;
  let topCorridorKey: string | null = null;
  let topStress = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.meanPeakUtilization > topStress) {
      topStress = r.meanPeakUtilization;
      topCorridorKey = r.corridorKey;
    }
    const share = r.meanPeakUtilization / total;
    concentrationIndex += share * share;
  });
  return {
    corridorCount: rows.length,
    topCorridorKey,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topCorridorShare: Math.round((topStress / total) * 1000) / 1000,
  };
}

// --- bundled from core/development-tier-diversity.ts ---
export interface NrDashDevelopmentTierDiversity {
  regionCount: number;
  distinctTiers: number;
  diversityIndex: number;
  dominantTier: string | null;
}

/** Herfindahl-style diversity of LR development tier labels on snapshot rows. */
export function nrDashBuildDevelopmentTierDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashDevelopmentTierDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    counts.set(r.developmentTier, (counts.get(r.developmentTier) ?? 0) + 1);
  });
  const regionCount = snap.regions.length;
  let dominantTier: string | null = null;
  let topCount = 0;
  let diversityIndex = 0;
  counts.forEach((count, tier) => {
    if (count > topCount) {
      topCount = count;
      dominantTier = tier;
    }
    const share = count / regionCount;
    diversityIndex += share * share;
  });
  return {
    regionCount,
    distinctTiers: counts.size,
    diversityIndex: Math.round(diversityIndex * 1000) / 1000,
    dominantTier,
  };
}

// --- bundled from core/regional-headroom-spread.ts ---
export interface NrDashRegionalHeadroomSpread {
  regionCount: number;
  meanHeadroom: number;
  stdDev: number;
  tightestRegionId: string | null;
}

function meanRegionalUtil(reg: NationalSystemsState['regions'][string]): number {
  let sum = 0;
  NATIONAL_NETWORKS.forEach(n => {
    sum += reg.networks[n]?.utilization ?? 0;
  });
  return sum / NATIONAL_NETWORKS.length;
}

/** Cross-region dispersion of mean NS network headroom (1 − μ util). */
export function nrDashBuildRegionalHeadroomSpread(
  ns: NationalSystemsState | null
): NrDashRegionalHeadroomSpread | null {
  if (!ns?.regions) return null;
  const headrooms = Object.values(ns.regions).map(reg => ({
    regionId: reg.regionId,
    headroom: 1 - meanRegionalUtil(reg),
  }));
  if (!headrooms.length) return null;
  const values = headrooms.map(h => h.headroom);
  const meanHeadroom = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanHeadroom) ** 2, 0) / Math.max(values.length, 1);
  const sorted = [...headrooms].sort((a, b) => a.headroom - b.headroom || a.regionId.localeCompare(b.regionId));
  return {
    regionCount: headrooms.length,
    meanHeadroom: Math.round(meanHeadroom * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    tightestRegionId: sorted[0]?.regionId ?? null,
  };
}

// --- bundled from core/national-needs-pressure.ts ---
export interface NrDashNationalNeedsPressure {
  totalOpenNeeds: number;
  nationalResilience: number | null;
  /** Open needs per ten resilience points (higher = more pressure). */
  pressureIndex: number;
}

/** LR open-needs total vs NS national resilience score (merged snapshot). */
export function nrDashBuildNationalNeedsPressure(
  snap: NrDashAuthSnapshot | null
): NrDashNationalNeedsPressure | null {
  if (!snap?.regions.length) return null;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  if (snap.nationalResilience == null) return null;
  const pressureIndex =
    Math.round((totalOpenNeeds / Math.max(snap.nationalResilience / 10, 1)) * 1000) / 1000;
  return {
    totalOpenNeeds,
    nationalResilience: snap.nationalResilience,
    pressureIndex,
  };
}

// --- bundled from core/dependency-consumer-load.ts ---
export interface NrDashDependencyConsumerLoad {
  edgeCount: number;
  meanEdgesPerConsumer: number;
  stdDev: number;
  topConsumerId: string | null;
}

/** Dispersion of dependency edge counts by consumer region (NS authoritative). */
export function nrDashBuildDependencyConsumerLoad(
  ns: NationalSystemsState | null
): NrDashDependencyConsumerLoad | null {
  if (!ns?.dependencies?.length) return null;
  const counts = new Map<string, number>();
  ns.dependencies.forEach(d => {
    counts.set(d.consumerRegionId, (counts.get(d.consumerRegionId) ?? 0) + 1);
  });
  const values = [...counts.values()];
  const meanEdgesPerConsumer = values.reduce((s, n) => s + n, 0) / values.length;
  const variance =
    values.reduce((s, n) => s + (n - meanEdgesPerConsumer) ** 2, 0) / Math.max(values.length, 1);
  let topConsumerId: string | null = null;
  let topCount = 0;
  counts.forEach((count, id) => {
    if (count > topCount) {
      topCount = count;
      topConsumerId = id;
    }
  });
  return {
    edgeCount: ns.dependencies.length,
    meanEdgesPerConsumer: Math.round(meanEdgesPerConsumer * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    topConsumerId,
  };
}

// --- bundled from core/activity-weight-spread.ts ---
export interface NrDashActivityWeightSpread {
  regionCount: number;
  meanWeight: number;
  stdDev: number;
  outlierRegionId: string | null;
}

/** Cross-region dispersion of LR momentum history activity weights on map nodes. */
export function nrDashBuildActivityWeightSpread(
  snap: NrDashAuthSnapshot | null
): NrDashActivityWeightSpread | null {
  if (!snap?.regions.length) return null;
  const rows = nrDashBuildRegionMapNodes(snap).map(n => ({
    regionId: n.regionId,
    weight: n.activityWeight,
  }));
  const values = rows.map(r => r.weight);
  const meanWeight = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanWeight) ** 2, 0) / Math.max(values.length, 1);
  const ranked = [...rows].sort((a, b) => b.weight - a.weight || a.regionId.localeCompare(b.regionId));
  return {
    regionCount: rows.length,
    meanWeight: Math.round(meanWeight * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    outlierRegionId: ranked[0]?.weight ? ranked[0].regionId : null,
  };
}

// --- bundled from core/parity-gap-spread.ts ---
export interface NrDashParityGapSpread {
  sampleSize: number;
  meanAbsGap: number;
  stdDev: number;
  outlierRegionId: string | null;
}

/** Cross-region dispersion of momentum↔resilience parity gap scores (merged rows). */
export function nrDashBuildParityGapSpread(snap: NrDashAuthSnapshot | null): NrDashParityGapSpread | null {
  if (!snap?.regions.length) return null;
  const scored = nrDashBuildParityGapRows(snap)
    .filter(r => r.gapScore != null)
    .map(r => ({ regionId: r.regionId, gapScore: r.gapScore as number }));
  if (!scored.length) return null;
  const absValues = scored.map(r => Math.abs(r.gapScore));
  const meanAbsGap =
    Math.round((absValues.reduce((s, n) => s + n, 0) / absValues.length) * 1000) / 1000;
  const mean = absValues.reduce((s, n) => s + n, 0) / absValues.length;
  const variance =
    absValues.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(absValues.length, 1);
  const ranked = [...scored].sort(
    (a, b) => Math.abs(b.gapScore) - Math.abs(a.gapScore) || a.regionId.localeCompare(b.regionId)
  );
  return {
    sampleSize: scored.length,
    meanAbsGap,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    outlierRegionId: ranked[0]?.regionId ?? null,
  };
}

// --- bundled from core/heat-strained-density.ts ---
export interface NrDashHeatStrainedDensity {
  cellCount: number;
  strainedPlusCount: number;
  density: number;
}

const strainedPlus = (c: NationalNetworkCondition) => NS_COND_RANK[c] >= NS_COND_RANK.strained;

/** Share of heat-grid cells at strained+ NS conditions. */
export function nrDashBuildHeatStrainedDensity(ns: NationalSystemsState | null): NrDashHeatStrainedDensity | null {
  if (!ns) return null;
  const heat = nrDashBuildHeatCells(ns);
  const strainedPlusCount = heat.cells.filter(c => strainedPlus(c.tone)).length;
  if (!heat.cells.length) return null;
  return {
    cellCount: heat.cells.length,
    strainedPlusCount,
    density: Math.round((strainedPlusCount / heat.cells.length) * 1000) / 1000,
  };
}

// --- bundled from core/network-util-concentration.ts ---
export interface NrDashNetworkUtilConcentration {
  networkCount: number;
  topNetwork: string | null;
  concentrationIndex: number;
  topNetworkShare: number;
}

/** Herfindahl clustering of authoritative national network utilization bars. */
export function nrDashBuildNetworkUtilConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashNetworkUtilConcentration | null {
  if (!snap?.networks.length) return null;
  const total = snap.networks.reduce((s, n) => s + n.utilization, 0);
  if (total <= 0) return null;
  let topNetwork: string | null = null;
  let topUtil = 0;
  let concentrationIndex = 0;
  snap.networks.forEach(n => {
    if (n.utilization > topUtil) {
      topUtil = n.utilization;
      topNetwork = n.network;
    }
    const share = n.utilization / total;
    concentrationIndex += share * share;
  });
  return {
    networkCount: snap.networks.length,
    topNetwork,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topNetworkShare: Math.round((topUtil / total) * 1000) / 1000,
  };
}

// --- bundled from core/dependency-provider-load.ts ---
export interface NrDashDependencyProviderLoad {
  edgeCount: number;
  meanEdgesPerProvider: number;
  stdDev: number;
  topProviderId: string | null;
}

/** Dispersion of dependency edge counts by provider region (NS authoritative). */
export function nrDashBuildDependencyProviderLoad(
  ns: NationalSystemsState | null
): NrDashDependencyProviderLoad | null {
  if (!ns?.dependencies?.length) return null;
  const counts = new Map<string, number>();
  ns.dependencies.forEach(d => {
    counts.set(d.providerRegionId, (counts.get(d.providerRegionId) ?? 0) + 1);
  });
  const values = [...counts.values()];
  const meanEdgesPerProvider = values.reduce((s, n) => s + n, 0) / values.length;
  const variance =
    values.reduce((s, n) => s + (n - meanEdgesPerProvider) ** 2, 0) / Math.max(values.length, 1);
  let topProviderId: string | null = null;
  let topCount = 0;
  counts.forEach((count, id) => {
    if (count > topCount) {
      topCount = count;
      topProviderId = id;
    }
  });
  return {
    edgeCount: ns.dependencies.length,
    meanEdgesPerProvider: Math.round(meanEdgesPerProvider * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    topProviderId,
  };
}

// --- bundled from core/owned-resilience-share.ts ---
export interface NrDashOwnedResilienceShare {
  ownedRegionCount: number;
  totalResilience: number;
  ownedResilience: number;
  ownedShare: number;
}

/** Share of summed NS regional resilience on player-owned snapshot rows. */
export function nrDashBuildOwnedResilienceShare(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedResilienceShare | null {
  if (!snap?.regions.length) return null;
  const withRes = snap.regions.filter(r => r.resilience != null);
  if (!withRes.length) return null;
  const owned = withRes.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const totalResilience = withRes.reduce((s, r) => s + (r.resilience as number), 0);
  const ownedResilience = owned.reduce((s, r) => s + (r.resilience as number), 0);
  if (totalResilience <= 0) return null;
  return {
    ownedRegionCount: owned.length,
    totalResilience,
    ownedResilience,
    ownedShare: Math.round((ownedResilience / totalResilience) * 1000) / 1000,
  };
}

// --- bundled from core/momentum-band-diversity.ts ---
export interface NrDashMomentumBandDiversity {
  regionCount: number;
  distinctBands: number;
  diversityIndex: number;
  dominantBand: string | null;
}

/** Herfindahl clustering of LR momentum band labels on snapshot rows. */
export function nrDashBuildMomentumBandDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumBandDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    counts.set(r.momentumBand, (counts.get(r.momentumBand) ?? 0) + 1);
  });
  const regionCount = snap.regions.length;
  let dominantBand: string | null = null;
  let topCount = 0;
  let diversityIndex = 0;
  counts.forEach((count, band) => {
    if (count > topCount) {
      topCount = count;
      dominantBand = band;
    }
    const share = count / regionCount;
    diversityIndex += share * share;
  });
  return {
    regionCount,
    distinctBands: counts.size,
    diversityIndex: Math.round(diversityIndex * 1000) / 1000,
    dominantBand,
  };
}

// --- bundled from core/economy-band-diversity.ts ---
export interface NrDashEconomyBandDiversity {
  regionCount: number;
  distinctBands: number;
  diversityIndex: number;
  dominantBand: string | null;
}

/** Herfindahl clustering of LR economy band labels on snapshot rows. */
export function nrDashBuildEconomyBandDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyBandDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    counts.set(r.economyBand, (counts.get(r.economyBand) ?? 0) + 1);
  });
  const regionCount = snap.regions.length;
  let dominantBand: string | null = null;
  let topCount = 0;
  let diversityIndex = 0;
  counts.forEach((count, band) => {
    if (count > topCount) {
      topCount = count;
      dominantBand = band;
    }
    const share = count / regionCount;
    diversityIndex += share * share;
  });
  return {
    regionCount,
    distinctBands: counts.size,
    diversityIndex: Math.round(diversityIndex * 1000) / 1000,
    dominantBand,
  };
}

// --- bundled from core/map-hub-concentration.ts ---
export interface NrDashMapHubConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of map hub scores (adjacency + dependency degree). */
export function nrDashBuildMapHubConcentration(
  ns: NationalSystemsState | null
): NrDashMapHubConcentration | null {
  const rows = nrDashBuildMapHubIndex(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.hubScore, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topScore = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.hubScore > topScore) {
      topScore = r.hubScore;
      topRegionId = r.regionId;
    }
    const share = r.hubScore / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: rows.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topScore / total) * 1000) / 1000,
  };
}

// --- bundled from core/chokepoint-score-spread.ts ---
export interface NrDashChokepointScoreSpread {
  edgeCount: number;
  meanScore: number;
  stdDev: number;
  maxScore: number;
}

/** Dispersion of NS dependency chokepoint scores (endpoint stress weighted). */
export function nrDashBuildChokepointScoreSpread(
  ns: NationalSystemsState | null
): NrDashChokepointScoreSpread | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length) return null;
  const scores = rows.map(r => r.chokeScore);
  const meanScore = scores.reduce((s, n) => s + n, 0) / scores.length;
  const variance =
    scores.reduce((s, n) => s + (n - meanScore) ** 2, 0) / Math.max(scores.length, 1);
  return {
    edgeCount: scores.length,
    meanScore: Math.round(meanScore * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxScore: Math.max(...scores),
  };
}

// --- bundled from core/owned-open-needs-share.ts ---
export interface NrDashOwnedOpenNeedsShare {
  ownedRegionCount: number;
  totalOpenNeeds: number;
  ownedOpenNeeds: number;
  ownedShare: number;
}

/** Share of LR open needs on player-owned snapshot rows. */
export function nrDashBuildOwnedOpenNeedsShare(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedOpenNeedsShare | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const ownedOpenNeeds = owned.reduce((s, r) => s + r.openNeeds, 0);
  if (totalOpenNeeds <= 0) return null;
  return {
    ownedRegionCount: owned.length,
    totalOpenNeeds,
    ownedOpenNeeds,
    ownedShare: Math.round((ownedOpenNeeds / totalOpenNeeds) * 1000) / 1000,
  };
}

// --- bundled from core/national-strained-bar-count.ts ---
export interface NrDashNationalStrainedBarCount {
  networkCount: number;
  strainedPlusCount: number;
  density: number;
}

const strainedPlus = (condition: NationalNetworkCondition) => NS_COND_RANK[condition] >= NS_COND_RANK.strained;

/** Count of authoritative national network bars at strained+ condition. */
export function nrDashBuildNationalStrainedBarCount(
  snap: NrDashAuthSnapshot | null
): NrDashNationalStrainedBarCount | null {
  if (!snap?.networks.length) return null;
  const strainedPlusCount = snap.networks.filter(n => strainedPlus(n.condition)).length;
  return {
    networkCount: snap.networks.length,
    strainedPlusCount,
    density: Math.round((strainedPlusCount / snap.networks.length) * 1000) / 1000,
  };
}

// --- bundled from core/history-snippet-load.ts ---
export interface NrDashHistorySnippetLoad {
  snippetCount: number;
  maxSnippets: number;
  loadRatio: number;
}

/** Dashboard history snippet buffer utilization (LR majors + NS history). */
export function nrDashBuildHistorySnippetLoad(snap: NrDashAuthSnapshot | null): NrDashHistorySnippetLoad | null {
  if (!snap) return null;
  const maxSnippets = 8;
  const snippetCount = snap.historySnippets.length;
  return {
    snippetCount,
    maxSnippets,
    loadRatio: Math.round((snippetCount / maxSnippets) * 1000) / 1000,
  };
}

// --- bundled from core/network-stress-concentration.ts ---
export interface NrDashNetworkStressConcentration {
  networkCount: number;
  topNetwork: string | null;
  concentrationIndex: number;
  topNetworkShare: number;
}

/** Herfindahl clustering of peak regional utilization by national network kind. */
export function nrDashBuildNetworkStressConcentration(
  ns: NationalSystemsState | null
): NrDashNetworkStressConcentration | null {
  const rows = nrDashBuildNetworkStress(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.peakUtilization, 0);
  if (total <= 0) return null;
  let topNetwork: string | null = null;
  let topPeak = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.peakUtilization > topPeak) {
      topPeak = r.peakUtilization;
      topNetwork = r.network;
    }
    const share = r.peakUtilization / total;
    concentrationIndex += share * share;
  });
  return {
    networkCount: rows.length,
    topNetwork,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topNetworkShare: Math.round((topPeak / total) * 1000) / 1000,
  };
}

// --- bundled from core/network-coupling-spread.ts ---
export interface NrDashNetworkCouplingSpread {
  regionCount: number;
  meanCoupling: number;
  stdDev: number;
  maxCouplingRegionId: string | null;
}

/** Cross-region dispersion of strained+ network coupling ratios. */
export function nrDashBuildNetworkCouplingSpread(
  ns: NationalSystemsState | null
): NrDashNetworkCouplingSpread | null {
  const summary = nrDashBuildNetworkCoupling(ns);
  if (!summary?.rows.length) return null;
  const values = summary.rows.map(r => r.couplingRatio);
  const meanCoupling = summary.meanCoupling;
  const variance =
    values.reduce((s, v) => s + (v - meanCoupling) ** 2, 0) / Math.max(values.length, 1);
  return {
    regionCount: values.length,
    meanCoupling,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxCouplingRegionId: summary.maxCouplingRegionId,
  };
}

// --- bundled from core/resilience-band-diversity.ts ---
export interface NrDashResilienceBandDiversity {
  regionCount: number;
  distinctBands: number;
  diversityIndex: number;
  dominantBand: string | null;
}

/** Herfindahl clustering of NS resilience band labels on merged snapshot rows. */
export function nrDashBuildResilienceBandDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashResilienceBandDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    if (!r.resilienceBand) return;
    counts.set(r.resilienceBand, (counts.get(r.resilienceBand) ?? 0) + 1);
  });
  if (!counts.size) return null;
  const regionCount = [...counts.values()].reduce((s, n) => s + n, 0);
  let dominantBand: string | null = null;
  let topCount = 0;
  let diversityIndex = 0;
  counts.forEach((count, band) => {
    if (count > topCount) {
      topCount = count;
      dominantBand = band;
    }
    const share = count / regionCount;
    diversityIndex += share * share;
  });
  return {
    regionCount,
    distinctBands: counts.size,
    diversityIndex: Math.round(diversityIndex * 1000) / 1000,
    dominantBand,
  };
}

// --- bundled from core/bottleneck-severity-load.ts ---
const SEVERITY_WEIGHT: Record<string, number> = {
  minor: 0.5,
  meaningful: 1,
  severe: 1.5,
  critical: 2,
};

export interface NrDashBottleneckSeverityLoad {
  activeCount: number;
  weightedLoad: number;
  topRegionId: string | null;
}

/** Weighted sum of active NS bottleneck severities (authoritative list). */
export function nrDashBuildBottleneckSeverityLoad(
  ns: NationalSystemsState | null
): NrDashBottleneckSeverityLoad | null {
  if (!ns?.bottlenecks?.length) return null;
  let weightedLoad = 0;
  let topRegionId: string | null = null;
  let topWeight = 0;
  ns.bottlenecks.forEach(b => {
    const w = SEVERITY_WEIGHT[b.severity ?? ''] ?? 1;
    weightedLoad += w;
    if (b.regionId && w > topWeight) {
      topWeight = w;
      topRegionId = b.regionId;
    }
  });
  return {
    activeCount: ns.bottlenecks.length,
    weightedLoad: Math.round(weightedLoad * 1000) / 1000,
    topRegionId,
  };
}

// --- bundled from core/rival-risk-exposure-share.ts ---
export interface NrDashRivalRiskExposureShare {
  rivalRegionCount: number;
  totalExposure: number;
  rivalExposure: number;
  rivalShare: number;
}

/** Share of aggregate LR risk exposure on rival-owned regions. */
export function nrDashBuildRivalRiskExposureShare(
  snap: NrDashAuthSnapshot | null
): NrDashRivalRiskExposureShare | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  const rival = exposure.rows.filter(r => {
    const row = snap?.regions.find(x => x.regionId === r.regionId);
    return row?.owner === 'rival';
  });
  if (!rival.length) return null;
  const rivalExposure = rival.reduce((s, r) => s + r.exposureScore, 0);
  return {
    rivalRegionCount: rival.length,
    totalExposure: exposure.totalExposure,
    rivalExposure,
    rivalShare: Math.round((rivalExposure / exposure.totalExposure) * 1000) / 1000,
  };
}

// --- bundled from core/heat-row-strain-concentration.ts ---
export interface NrDashHeatRowStrainConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of per-region strained network counts (heat summaries). */
export function nrDashBuildHeatRowStrainConcentration(
  ns: NationalSystemsState | null
): NrDashHeatRowStrainConcentration | null {
  const rows = nrDashBuildHeatRowSummaries(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.strainedNetworks, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.strainedNetworks > topCount) {
      topCount = r.strainedNetworks;
      topRegionId = r.regionId;
    }
    const share = r.strainedNetworks / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: rows.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / total) * 1000) / 1000,
  };
}

// --- bundled from core/high-risk-concentration.ts ---
export interface NrDashHighRiskConcentration {
  totalHighRisks: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of LR high-severity risk counts across regions. */
export function nrDashBuildHighRiskConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashHighRiskConcentration | null {
  if (!snap?.regions.length) return null;
  const totalHighRisks = snap.regions.reduce((s, r) => s + r.highRisks, 0);
  if (totalHighRisks <= 0) return null;
  let topRegionId: string | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  snap.regions.forEach(r => {
    if (r.highRisks > topCount) {
      topCount = r.highRisks;
      topRegionId = r.regionId;
    }
    const share = r.highRisks / totalHighRisks;
    concentrationIndex += share * share;
  });
  return {
    totalHighRisks,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / totalHighRisks) * 1000) / 1000,
  };
}

// --- bundled from core/dependency-network-span.ts ---
export interface NrDashDependencyNetworkSpan {
  edgeCount: number;
  distinctNetworks: number;
  networks: NationalNetworkKind[];
}

/** Count distinct NS network kinds referenced by interregional dependencies. */
export function nrDashBuildDependencyNetworkSpan(
  ns: NationalSystemsState | null
): NrDashDependencyNetworkSpan | null {
  if (!ns?.dependencies?.length) return null;
  const set = new Set<NationalNetworkKind>();
  ns.dependencies.forEach(d => set.add(d.network));
  const networks = [...set].sort();
  return {
    edgeCount: ns.dependencies.length,
    distinctNetworks: networks.length,
    networks,
  };
}

// --- bundled from core/national-bottleneck-density.ts ---
export interface NrDashNationalBottleneckDensity {
  regionCount: number;
  activeBottlenecks: number;
  density: number;
}

/** Active NS bottlenecks per canonical region slot (state list length). */
export function nrDashBuildNationalBottleneckDensity(
  ns: NationalSystemsState | null
): NrDashNationalBottleneckDensity | null {
  if (!ns) return null;
  const regionCount = COMM_REGION_CODES.length;
  const activeBottlenecks = ns.bottlenecks.length;
  return {
    regionCount,
    activeBottlenecks,
    density: Math.round((activeBottlenecks / regionCount) * 1000) / 1000,
  };
}

// --- bundled from core/neutral-risk-exposure-share.ts ---
export interface NrDashNeutralRiskExposureShare {
  neutralRegionCount: number;
  totalExposure: number;
  neutralExposure: number;
  neutralShare: number;
}

/** Share of aggregate LR risk exposure on neutral-owned regions. */
export function nrDashBuildNeutralRiskExposureShare(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralRiskExposureShare | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  const neutral = exposure.rows.filter(r => {
    const row = snap?.regions.find(x => x.regionId === r.regionId);
    return row?.owner === 'neutral';
  });
  if (!neutral.length) return null;
  const neutralExposure = neutral.reduce((s, r) => s + r.exposureScore, 0);
  return {
    neutralRegionCount: neutral.length,
    totalExposure: exposure.totalExposure,
    neutralExposure,
    neutralShare: Math.round((neutralExposure / exposure.totalExposure) * 1000) / 1000,
  };
}

// --- bundled from core/util-headroom-divergence.ts ---
export interface NrDashUtilHeadroomDivergence {
  utilizationSpread: number;
  headroomSpread: number;
  /** Util spread minus headroom spread (positive = util more dispersed). */
  divergence: number;
}

/** Compare national utilization skew spread to capacity headroom spread. */
export function nrDashBuildUtilHeadroomDivergence(
  snap: NrDashAuthSnapshot | null
): NrDashUtilHeadroomDivergence | null {
  const skew = nrDashBuildUtilizationSkew(snap);
  const headroom = nrDashBuildCapacityHeadroom(snap);
  if (!skew || !headroom) return null;
  const divergence = Math.round((skew.spread - headroom.spread) * 1000) / 1000;
  return {
    utilizationSpread: skew.spread,
    headroomSpread: headroom.spread,
    divergence,
  };
}

// --- bundled from core/border-stress-concentration.ts ---
export interface NrDashBorderStressConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of per-region max land-border corridor stress. */
export function nrDashBuildBorderStressConcentration(
  ns: NationalSystemsState | null
): NrDashBorderStressConcentration | null {
  const rows = nrDashBuildBorderStressRows(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.maxCorridorStress, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topStress = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.maxCorridorStress > topStress) {
      topStress = r.maxCorridorStress;
      topRegionId = r.regionId;
    }
    const share = r.maxCorridorStress / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: rows.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topStress / total) * 1000) / 1000,
  };
}

// --- bundled from core/constraint-profile-spread.ts ---
export interface NrDashConstraintProfileSpread {
  networkKinds: number;
  meanRegionsPerConstraint: number;
  stdDev: number;
}

/** Dispersion of primary-constraint region counts across NS network kinds. */
export function nrDashBuildConstraintProfileSpread(
  ns: NationalSystemsState | null
): NrDashConstraintProfileSpread | null {
  const profile = nrDashBuildConstraintProfile(ns);
  if (!profile.length) return null;
  const counts = profile.map(p => p.regionCount);
  const meanRegionsPerConstraint = counts.reduce((s, n) => s + n, 0) / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanRegionsPerConstraint) ** 2, 0) / Math.max(counts.length, 1);
  return {
    networkKinds: profile.length,
    meanRegionsPerConstraint: Math.round(meanRegionsPerConstraint * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/bottleneck-network-share.ts ---
export interface NrDashBottleneckNetworkShare {
  activeCount: number;
  topNetwork: NationalNetworkKind | null;
  topNetworkShare: number;
  concentrationIndex: number;
}

/** Herfindahl clustering of active NS bottlenecks by network kind. */
export function nrDashBuildBottleneckNetworkShare(
  ns: NationalSystemsState | null
): NrDashBottleneckNetworkShare | null {
  if (!ns?.bottlenecks?.length) return null;
  const counts = new Map<NationalNetworkKind | 'unknown', number>();
  ns.bottlenecks.forEach(b => {
    const key = b.network ?? 'unknown';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const activeCount = ns.bottlenecks.length;
  let topNetwork: NationalNetworkKind | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  counts.forEach((n, network) => {
    if (network !== 'unknown' && n > topCount) {
      topCount = n;
      topNetwork = network;
    }
    const share = n / activeCount;
    concentrationIndex += share * share;
  });
  return {
    activeCount,
    topNetwork,
    topNetworkShare: Math.round((topCount / activeCount) * 1000) / 1000,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/dependency-critical-share.ts ---
export interface NrDashDependencyCriticalShare {
  edgeCount: number;
  criticalCount: number;
  criticalShare: number;
}

/** Share of NS dependency edges marked critical importance. */
export function nrDashBuildDependencyCriticalShare(
  ns: NationalSystemsState | null
): NrDashDependencyCriticalShare | null {
  if (!ns?.dependencies?.length) return null;
  const criticalCount = ns.dependencies.filter(d => d.importance === 'critical').length;
  return {
    edgeCount: ns.dependencies.length,
    criticalCount,
    criticalShare: Math.round((criticalCount / ns.dependencies.length) * 1000) / 1000,
  };
}

// --- bundled from core/momentum-leader-gap.ts ---
export interface NrDashMomentumLeaderGap {
  leaderRegionId: string;
  laggardRegionId: string;
  leaderRank: number;
  laggardRank: number;
  rankGap: number;
}

/** Momentum rank spread between compare-tab leader and laggard (snapshot rows only). */
export function nrDashBuildMomentumLeaderGap(
  snap: NrDashAuthSnapshot | null,
  ns: NationalSystemsState | null
): NrDashMomentumLeaderGap | null {
  if (!snap?.regions.length) return null;
  const insights = nrDashBuildCompareInsights(snap, ns);
  const leader = insights.momentumLeaders[0];
  const laggard = insights.momentumLaggards[0];
  if (!leader || !laggard) return null;
  return {
    leaderRegionId: leader.regionId,
    laggardRegionId: laggard.regionId,
    leaderRank: leader.rank,
    laggardRank: laggard.rank,
    rankGap: leader.rank - laggard.rank,
  };
}

// --- bundled from core/derived-event-load.ts ---
export interface NrDashDerivedEventLoad {
  eventCount: number;
  majorCount: number;
  latestTurn: number | null;
  majorShare: number;
}

/** Load of LR derived narrative events (authoritative list only). */
export function nrDashBuildDerivedEventLoad(
  lr: LivingRegionsWorldView | null
): NrDashDerivedEventLoad | null {
  if (!lr?.state.derived.length) return null;
  const events = lr.state.derived;
  const majorCount = events.filter(e => e.significance === 'major').length;
  const latestTurn = Math.max(...events.map(e => e.turn));
  return {
    eventCount: events.length,
    majorCount,
    latestTurn,
    majorShare: Math.round((majorCount / events.length) * 1000) / 1000,
  };
}

// --- bundled from core/owner-concentration-index.ts ---
export interface NrDashOwnerConcentrationIndex {
  regionCount: number;
  concentrationIndex: number;
  dominantOwner: NrDashAuthSnapshot['regions'][number]['owner'];
  dominantShare: number;
}

/** Herfindahl clustering of region ownership labels on the snapshot. */
export function nrDashBuildOwnerConcentrationIndex(
  snap: NrDashAuthSnapshot | null
): NrDashOwnerConcentrationIndex | null {
  if (!snap?.regions.length) return null;
  const counts: Record<NrDashAuthSnapshot['regions'][number]['owner'], number> = {
    you: 0,
    rival: 0,
    neutral: 0,
    unknown: 0,
  };
  snap.regions.forEach(r => {
    counts[r.owner] += 1;
  });
  const regionCount = snap.regions.length;
  let dominantOwner: NrDashAuthSnapshot['regions'][number]['owner'] = 'unknown';
  let topCount = 0;
  let concentrationIndex = 0;
  (Object.keys(counts) as Array<keyof typeof counts>).forEach(owner => {
    const c = counts[owner];
    if (c > topCount) {
      topCount = c;
      dominantOwner = owner;
    }
    const share = c / regionCount;
    concentrationIndex += share * share;
  });
  return {
    regionCount,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    dominantOwner,
    dominantShare: Math.round((topCount / regionCount) * 1000) / 1000,
  };
}

// --- bundled from core/open-needs-spread.ts ---
export interface NrDashOpenNeedsSpread {
  regionCount: number;
  totalOpenNeeds: number;
  meanOpenNeeds: number;
  stdDev: number;
}

/** Cross-region dispersion of LR open-need counts on the snapshot. */
export function nrDashBuildOpenNeedsSpread(
  snap: NrDashAuthSnapshot | null
): NrDashOpenNeedsSpread | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.openNeeds);
  const totalOpenNeeds = counts.reduce((s, n) => s + n, 0);
  const meanOpenNeeds = totalOpenNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanOpenNeeds) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalOpenNeeds,
    meanOpenNeeds: Math.round(meanOpenNeeds * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/critical-needs-share.ts ---
export interface NrDashCriticalNeedsShare {
  openNeedCount: number;
  criticalCount: number;
  criticalShare: number;
}

/** Share of open LR needs marked critical severity (authoritative needs list). */
export function nrDashBuildCriticalNeedsShare(
  lr: LivingRegionsWorldView | null
): NrDashCriticalNeedsShare | null {
  if (!lr?.state.regions) return null;
  let openNeedCount = 0;
  let criticalCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs.forEach(n => {
      if (n.status !== 'open') return;
      openNeedCount += 1;
      if (n.severity === 'critical') criticalCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  return {
    openNeedCount,
    criticalCount,
    criticalShare: Math.round((criticalCount / openNeedCount) * 1000) / 1000,
  };
}

// --- bundled from core/national-resilience-gap.ts ---
export interface NrDashNationalResilienceGap {
  nationalScore: number;
  regionalMean: number;
  gap: number;
  sampleSize: number;
}

/** Delta between NS national resilience score and mean regional resilience on the snapshot. */
export function nrDashBuildNationalResilienceGap(
  snap: NrDashAuthSnapshot | null
): NrDashNationalResilienceGap | null {
  if (!snap?.regions.length || snap.nationalResilience == null) return null;
  const vals = snap.regions
    .map(r => r.resilience)
    .filter((v): v is number => v != null && Number.isFinite(v));
  if (!vals.length) return null;
  const regionalMean = Math.round((vals.reduce((s, n) => s + n, 0) / vals.length) * 10) / 10;
  const nationalScore = snap.nationalResilience;
  return {
    nationalScore,
    regionalMean,
    gap: Math.round((nationalScore - regionalMean) * 10) / 10,
    sampleSize: vals.length,
  };
}

// --- bundled from core/dependency-high-share.ts ---
export interface NrDashDependencyHighShare {
  edgeCount: number;
  highPlusCount: number;
  highPlusShare: number;
}

/** Share of NS dependency edges marked high or critical importance. */
export function nrDashBuildDependencyHighShare(
  ns: NationalSystemsState | null
): NrDashDependencyHighShare | null {
  if (!ns?.dependencies?.length) return null;
  const highPlusCount = ns.dependencies.filter(
    d => d.importance === 'high' || d.importance === 'critical'
  ).length;
  return {
    edgeCount: ns.dependencies.length,
    highPlusCount,
    highPlusShare: Math.round((highPlusCount / ns.dependencies.length) * 1000) / 1000,
  };
}

// --- bundled from core/bottleneck-region-span.ts ---
export interface NrDashBottleneckRegionSpan {
  regionSlots: number;
  distinctRegions: number;
  spanRatio: number;
}

/** Fraction of canonical region slots touched by at least one active NS bottleneck. */
export function nrDashBuildBottleneckRegionSpan(
  ns: NationalSystemsState | null
): NrDashBottleneckRegionSpan | null {
  if (!ns) return null;
  const regionSlots = COMM_REGION_CODES.length;
  const touched = new Set<string>();
  ns.bottlenecks.forEach(b => {
    if (b.regionId) touched.add(b.regionId);
  });
  const distinctRegions = touched.size;
  return {
    regionSlots,
    distinctRegions,
    spanRatio: Math.round((distinctRegions / regionSlots) * 1000) / 1000,
  };
}

// --- bundled from core/momentum-history-span.ts ---
export interface NrDashMomentumHistorySpan {
  regionCount: number;
  minLength: number;
  maxLength: number;
  lengthSpread: number;
}

/** Spread of LR momentum history sample lengths across snapshot rows. */
export function nrDashBuildMomentumHistorySpan(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumHistorySpan | null {
  if (!snap?.regions.length) return null;
  const lengths = snap.regions.map(r => (r.momentumHistory || []).filter(v => Number.isFinite(v)).length);
  if (!lengths.length) return null;
  const minLength = Math.min(...lengths);
  const maxLength = Math.max(...lengths);
  return {
    regionCount: lengths.length,
    minLength,
    maxLength,
    lengthSpread: maxLength - minLength,
  };
}

// --- bundled from core/high-risk-spread.ts ---
export interface NrDashHighRiskSpread {
  regionCount: number;
  totalHighRisks: number;
  meanHighRisks: number;
  stdDev: number;
}

/** Cross-region dispersion of LR high-severity risk counts on the snapshot. */
export function nrDashBuildHighRiskSpread(
  snap: NrDashAuthSnapshot | null
): NrDashHighRiskSpread | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.highRisks);
  const totalHighRisks = counts.reduce((s, n) => s + n, 0);
  const meanHighRisks = totalHighRisks / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanHighRisks) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalHighRisks,
    meanHighRisks: Math.round(meanHighRisks * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/high-needs-share.ts ---
export interface NrDashHighNeedsShare {
  openNeedCount: number;
  highCount: number;
  highShare: number;
}

/** Share of open LR needs marked high severity (authoritative needs list). */
export function nrDashBuildHighNeedsShare(
  lr: LivingRegionsWorldView | null
): NrDashHighNeedsShare | null {
  if (!lr?.state.regions) return null;
  let openNeedCount = 0;
  let highCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs.forEach(n => {
      if (n.status !== 'open') return;
      openNeedCount += 1;
      if (n.severity === 'high') highCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  return {
    openNeedCount,
    highCount,
    highShare: Math.round((highCount / openNeedCount) * 1000) / 1000,
  };
}

// --- bundled from core/national-utilization-gap.ts ---
export interface NrDashNationalUtilizationGap {
  nationalMean: number;
  regionalMean: number;
  gap: number;
  sampleCells: number;
}

/** Delta between NS national network utilization mean and mean regional cell utilization. */
export function nrDashBuildNationalUtilizationGap(
  ns: NationalSystemsState | null
): NrDashNationalUtilizationGap | null {
  if (!ns?.national || !ns.regions) return null;
  const nationalUtils = NATIONAL_NETWORKS.map(n => ns.national[n]?.utilization ?? 0);
  if (!nationalUtils.length) return null;
  const nationalMean = nationalUtils.reduce((s, u) => s + u, 0) / nationalUtils.length;
  const regionalCells: number[] = [];
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(n => {
      regionalCells.push(reg.networks[n]?.utilization ?? 0);
    });
  });
  if (!regionalCells.length) return null;
  const regionalMean = regionalCells.reduce((s, u) => s + u, 0) / regionalCells.length;
  return {
    nationalMean: Math.round(nationalMean * 1000) / 1000,
    regionalMean: Math.round(regionalMean * 1000) / 1000,
    gap: Math.round((nationalMean - regionalMean) * 1000) / 1000,
    sampleCells: regionalCells.length,
  };
}

// --- bundled from core/dependency-moderate-share.ts ---
export interface NrDashDependencyModerateShare {
  edgeCount: number;
  moderateCount: number;
  moderateShare: number;
}

/** Share of NS dependency edges marked moderate importance. */
export function nrDashBuildDependencyModerateShare(
  ns: NationalSystemsState | null
): NrDashDependencyModerateShare | null {
  if (!ns?.dependencies?.length) return null;
  const moderateCount = ns.dependencies.filter(d => d.importance === 'moderate').length;
  return {
    edgeCount: ns.dependencies.length,
    moderateCount,
    moderateShare: Math.round((moderateCount / ns.dependencies.length) * 1000) / 1000,
  };
}

// --- bundled from core/bottleneck-severity-span.ts ---
const SEVERITY_RANK: Record<string, number> = {
  minor: 0,
  meaningful: 1,
  major: 2,
  critical: 3,
};

export interface NrDashBottleneckSeveritySpan {
  activeCount: number;
  distinctSeverities: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of severity ranks across active NS bottleneck records. */
export function nrDashBuildBottleneckSeveritySpan(
  ns: NationalSystemsState | null
): NrDashBottleneckSeveritySpan | null {
  if (!ns?.bottlenecks?.length) return null;
  const ranks = ns.bottlenecks.map(b => SEVERITY_RANK[b.severity ?? ''] ?? 1);
  const distinct = new Set(ranks);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    activeCount: ns.bottlenecks.length,
    distinctSeverities: distinct.size,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}

// --- bundled from core/development-tier-span.ts ---
const LR_DEV_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(LR_DEV_LABEL) as LRDevTier[]).map((tier, i) => [LR_DEV_LABEL[tier], i])
);

export interface NrDashDevelopmentTierSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of LR development tier ordinals across snapshot rows. */
export function nrDashBuildDevelopmentTierSpan(
  snap: NrDashAuthSnapshot | null
): NrDashDevelopmentTierSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions.map(r => LR_DEV_RANK[r.developmentTier] ?? 0);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}

// --- bundled from core/low-needs-share.ts ---
export interface NrDashLowNeedsShare {
  openNeedCount: number;
  lowCount: number;
  lowShare: number;
}

/** Share of open LR needs marked low severity (authoritative needs list). */
export function nrDashBuildLowNeedsShare(
  lr: LivingRegionsWorldView | null
): NrDashLowNeedsShare | null {
  if (!lr?.state.regions) return null;
  let openNeedCount = 0;
  let lowCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs.forEach(n => {
      if (n.status !== 'open') return;
      openNeedCount += 1;
      if (n.severity === 'low') lowCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  return {
    openNeedCount,
    lowCount,
    lowShare: Math.round((lowCount / openNeedCount) * 1000) / 1000,
  };
}

// --- bundled from core/critical-risk-share.ts ---
export interface NrDashCriticalRiskShare {
  riskCount: number;
  criticalCount: number;
  criticalShare: number;
}

/** Share of LR regional risks marked critical severity (authoritative risks list). */
export function nrDashBuildCriticalRiskShare(
  lr: LivingRegionsWorldView | null
): NrDashCriticalRiskShare | null {
  if (!lr?.state.regions) return null;
  let riskCount = 0;
  let criticalCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.risks.forEach(r => {
      riskCount += 1;
      if (r.severity === 'critical') criticalCount += 1;
    });
  });
  if (riskCount <= 0) return null;
  return {
    riskCount,
    criticalCount,
    criticalShare: Math.round((criticalCount / riskCount) * 1000) / 1000,
  };
}

// --- bundled from core/national-condition-gap.ts ---
export interface NrDashNationalConditionGap {
  nationalMeanRank: number;
  regionalMeanRank: number;
  gap: number;
  sampleCells: number;
}

function condRank(c: NationalNetworkCondition | undefined): number {
  return NS_COND_RANK[c ?? 'healthy'] ?? 1;
}

/** Delta between mean NS national condition rank and mean regional cell condition rank. */
export function nrDashBuildNationalConditionGap(
  ns: NationalSystemsState | null
): NrDashNationalConditionGap | null {
  if (!ns?.national || !ns.regions) return null;
  const nationalRanks = NATIONAL_NETWORKS.map(n => condRank(ns.national[n]?.condition));
  if (!nationalRanks.length) return null;
  const nationalMeanRank = nationalRanks.reduce((s, r) => s + r, 0) / nationalRanks.length;
  const regionalRanks: number[] = [];
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(n => {
      regionalRanks.push(condRank(reg.networks[n]?.condition));
    });
  });
  if (!regionalRanks.length) return null;
  const regionalMeanRank = regionalRanks.reduce((s, r) => s + r, 0) / regionalRanks.length;
  return {
    nationalMeanRank: Math.round(nationalMeanRank * 1000) / 1000,
    regionalMeanRank: Math.round(regionalMeanRank * 1000) / 1000,
    gap: Math.round((nationalMeanRank - regionalMeanRank) * 1000) / 1000,
    sampleCells: regionalRanks.length,
  };
}

// --- bundled from core/dependency-low-share.ts ---
export interface NrDashDependencyLowShare {
  edgeCount: number;
  lowCount: number;
  lowShare: number;
}

/** Share of NS dependency edges marked low importance. */
export function nrDashBuildDependencyLowShare(
  ns: NationalSystemsState | null
): NrDashDependencyLowShare | null {
  if (!ns?.dependencies?.length) return null;
  const lowCount = ns.dependencies.filter(d => d.importance === 'low').length;
  return {
    edgeCount: ns.dependencies.length,
    lowCount,
    lowShare: Math.round((lowCount / ns.dependencies.length) * 1000) / 1000,
  };
}

// --- bundled from core/bottleneck-network-severity-load-spread.ts ---
const SEVERITY_WEIGHT: Record<string, number> = {
  minor: 0.5,
  meaningful: 1,
  severe: 1.5,
  critical: 2,
};

export interface NrDashBottleneckNetworkSeverityLoadSpread {
  networkCount: number;
  meanLoad: number;
  stdDev: number;
  topNetwork: NationalNetworkKind | null;
}

/** Dispersion of weighted bottleneck severity load across NS network kinds. */
export function nrDashBuildBottleneckNetworkSeverityLoadSpread(
  ns: NationalSystemsState | null
): NrDashBottleneckNetworkSeverityLoadSpread | null {
  if (!ns) return null;
  const loads = NATIONAL_NETWORKS.map(network => {
    let load = 0;
    ns.bottlenecks.forEach(b => {
      if (b.network === network) load += SEVERITY_WEIGHT[b.severity ?? ''] ?? 1;
    });
    return load;
  });
  const meanLoad = loads.reduce((s, l) => s + l, 0) / loads.length;
  const variance = loads.reduce((s, l) => s + (l - meanLoad) ** 2, 0) / Math.max(loads.length, 1);
  let topNetwork: NationalNetworkKind | null = null;
  let topLoad = -1;
  NATIONAL_NETWORKS.forEach((n, i) => {
    if (loads[i] > topLoad) {
      topLoad = loads[i];
      topNetwork = n;
    }
  });
  return {
    networkCount: loads.length,
    meanLoad: Math.round(meanLoad * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    topNetwork,
  };
}

// --- bundled from core/momentum-band-span.ts ---
const LR_MOM_BAND_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(LR_MOMENTUM_LABEL) as LRMomentumBand[]).map(band => [LR_MOMENTUM_LABEL[band], NR_DASH_MOM_RANK[band]])
);

export interface NrDashMomentumBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of LR momentum band ordinals across snapshot rows. */
export function nrDashBuildMomentumBandSpan(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumBandSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions.map(r => LR_MOM_BAND_RANK[r.momentumBand] ?? 0);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}

// --- bundled from core/economy-band-span.ts ---
const LR_ECON_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(LR_ECON_LABEL) as LREconomyBand[]).map((band, i) => [LR_ECON_LABEL[band], i])
);

export interface NrDashEconomyBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of LR economy band ordinals across snapshot rows. */
export function nrDashBuildEconomyBandSpan(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyBandSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions.map(r => LR_ECON_RANK[r.economyBand] ?? 0);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}

// --- bundled from core/resilience-band-span.ts ---
const RES_BAND_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(NATIONAL_RESILIENCE_LABEL) as NationalResilienceBand[]).map((band, i) => [
    NATIONAL_RESILIENCE_LABEL[band],
    i,
  ])
);

export interface NrDashResilienceBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of NS resilience band labels on merged snapshot rows. */
export function nrDashBuildResilienceBandSpan(
  snap: NrDashAuthSnapshot | null
): NrDashResilienceBandSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions
    .map(r => (r.resilienceBand ? (RES_BAND_RANK[r.resilienceBand] ?? null) : null))
    .filter((v): v is number => v != null);
  if (!ranks.length) return null;
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}

// --- bundled from core/moderate-risk-share.ts ---
export interface NrDashModerateRiskShare {
  riskCount: number;
  moderateCount: number;
  moderateShare: number;
}

/** Share of LR regional risks marked moderate severity (authoritative risks list). */
export function nrDashBuildModerateRiskShare(
  lr: LivingRegionsWorldView | null
): NrDashModerateRiskShare | null {
  if (!lr?.state.regions) return null;
  let riskCount = 0;
  let moderateCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.risks.forEach(r => {
      riskCount += 1;
      if (r.severity === 'moderate') moderateCount += 1;
    });
  });
  if (riskCount <= 0) return null;
  return {
    riskCount,
    moderateCount,
    moderateShare: Math.round((moderateCount / riskCount) * 1000) / 1000,
  };
}

// --- bundled from core/national-bottleneck-gap.ts ---
export interface NrDashNationalBottleneckGap {
  nationalBarTotal: number;
  activeListCount: number;
  gap: number;
}

/** Delta between summed NS national bottleneck counters and active bottleneck list length. */
export function nrDashBuildNationalBottleneckGap(
  ns: NationalSystemsState | null
): NrDashNationalBottleneckGap | null {
  if (!ns?.national) return null;
  const nationalBarTotal = NATIONAL_NETWORKS.reduce((s, n) => s + (ns.national[n]?.bottlenecks ?? 0), 0);
  const activeListCount = ns.bottlenecks.length;
  return {
    nationalBarTotal,
    activeListCount,
    gap: nationalBarTotal - activeListCount,
  };
}

// --- bundled from core/dependency-consumer-span.ts ---
export interface NrDashDependencyConsumerSpan {
  regionSlots: number;
  distinctConsumers: number;
  spanRatio: number;
}

/** Fraction of canonical region slots appearing as NS dependency consumers. */
export function nrDashBuildDependencyConsumerSpan(
  ns: NationalSystemsState | null
): NrDashDependencyConsumerSpan | null {
  if (!ns?.dependencies?.length) return null;
  const regionSlots = COMM_REGION_CODES.length;
  const consumers = new Set(ns.dependencies.map(d => d.consumerRegionId));
  const distinctConsumers = consumers.size;
  return {
    regionSlots,
    distinctConsumers,
    spanRatio: Math.round((distinctConsumers / regionSlots) * 1000) / 1000,
  };
}

// --- bundled from core/map-pulse-span.ts ---
export interface NrDashMapPulseSpan {
  regionCount: number;
  minIntensity: number;
  maxIntensity: number;
  intensitySpread: number;
}

/** Spread of composite map pulse intensities across strategic map nodes. */
export function nrDashBuildMapPulseSpan(nodes: RegionMapNode[]): NrDashMapPulseSpan | null {
  if (!nodes.length) return null;
  const intensities = nrDashBuildMapPulseRows(nodes).map(p => p.intensity);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);
  return {
    regionCount: intensities.length,
    minIntensity: Math.round(minIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    intensitySpread: Math.round((maxIntensity - minIntensity) * 1000) / 1000,
  };
}

// --- bundled from core/low-risk-share.ts ---
export interface NrDashLowRiskShare {
  riskCount: number;
  lowCount: number;
  lowShare: number;
}

/** Share of LR regional risks marked low severity (authoritative risks list). */
export function nrDashBuildLowRiskShare(lr: LivingRegionsWorldView | null): NrDashLowRiskShare | null {
  if (!lr?.state.regions) return null;
  let riskCount = 0;
  let lowCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.risks.forEach(r => {
      riskCount += 1;
      if (r.severity === 'low') lowCount += 1;
    });
  });
  if (riskCount <= 0) return null;
  return {
    riskCount,
    lowCount,
    lowShare: Math.round((lowCount / riskCount) * 1000) / 1000,
  };
}

// --- bundled from core/national-dependency-gap.ts ---
export interface NrDashNationalDependencyGap {
  listCount: number;
  snapshotCount: number;
  gap: number;
}

/** Delta between NS dependency list length and merged snapshot dependencyCount. */
export function nrDashBuildNationalDependencyGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNationalDependencyGap | null {
  if (!ns || !snap) return null;
  const listCount = ns.dependencies.length;
  const snapshotCount = snap.dependencyCount;
  return {
    listCount,
    snapshotCount,
    gap: listCount - snapshotCount,
  };
}

// --- bundled from core/dependency-provider-span.ts ---
export interface NrDashDependencyProviderSpan {
  regionSlots: number;
  distinctProviders: number;
  spanRatio: number;
}

/** Fraction of canonical region slots appearing as NS dependency providers. */
export function nrDashBuildDependencyProviderSpan(
  ns: NationalSystemsState | null
): NrDashDependencyProviderSpan | null {
  if (!ns?.dependencies?.length) return null;
  const regionSlots = COMM_REGION_CODES.length;
  const providers = new Set(ns.dependencies.map(d => d.providerRegionId));
  const distinctProviders = providers.size;
  return {
    regionSlots,
    distinctProviders,
    spanRatio: Math.round((distinctProviders / regionSlots) * 1000) / 1000,
  };
}

// --- bundled from core/economy-resilience-span.ts ---
export interface NrDashEconomyResilienceSpan {
  regionCount: number;
  minDrift: number;
  maxDrift: number;
  driftSpread: number;
}

/** Spread of economy ↔ resilience drift values on merged snapshot rows. */
export function nrDashBuildEconomyResilienceSpan(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyResilienceSpan | null {
  const drift = nrDashBuildEconomyResilienceDrift(snap);
  if (!drift?.rows.length) return null;
  const values = drift.rows.map(r => r.drift);
  const minDrift = Math.min(...values);
  const maxDrift = Math.max(...values);
  return {
    regionCount: values.length,
    minDrift,
    maxDrift,
    driftSpread: Math.round((maxDrift - minDrift) * 10) / 10,
  };
}

// --- bundled from core/corridor-pulse-spread.ts ---
export interface NrDashCorridorPulseSpread {
  corridorCount: number;
  meanBlend: number;
  stdDev: number;
}

/** Dispersion of endpoint-averaged map pulse intensity across land adjacency corridors. */
export function nrDashBuildCorridorPulseSpread(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashCorridorPulseSpread | null {
  if (!ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs();
  if (!pairs.length) return null;
  const blends = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return (pa + pb) / 2;
  });
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  const variance = blends.reduce((s, v) => s + (v - meanBlend) ** 2, 0) / Math.max(blends.length, 1);
  return {
    corridorCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/history-turn-span.ts ---
export interface NrDashHistoryTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in NS history entries and LR derived events. */
export function nrDashBuildHistoryTurnSpan(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashHistoryTurnSpan | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived.forEach(d => {
    if (Number.isFinite(d.turn)) turns.push(d.turn);
  });
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    eventCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}

// --- bundled from core/moderate-needs-spread.ts ---
export interface NrDashModerateNeedsSpread {
  regionCount: number;
  totalModerateNeeds: number;
  meanModerateNeeds: number;
  stdDev: number;
}

/** Cross-region dispersion of open LR needs at moderate severity. */
export function nrDashBuildModerateNeedsSpread(
  lr: LivingRegionsWorldView | null
): NrDashModerateNeedsSpread | null {
  if (!lr?.state.regions) return null;
  const counts = Object.values(lr.state.regions).map(reg =>
    reg.needs.filter(n => n.status === 'open' && n.severity === 'moderate').length
  );
  const totalModerateNeeds = counts.reduce((s, n) => s + n, 0);
  if (totalModerateNeeds <= 0) return null;
  const meanModerateNeeds = totalModerateNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanModerateNeeds) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalModerateNeeds,
    meanModerateNeeds: Math.round(meanModerateNeeds * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/national-history-gap.ts ---
export interface NrDashNationalHistoryGap {
  sourceEventCount: number;
  surfacedSnippetCount: number;
  gap: number;
}

/** Delta between authoritative NS/LR history sources and merged snapshot snippet count. */
export function nrDashBuildNationalHistoryGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNationalHistoryGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const lrMajorCount = lr?.state.derived.filter(d => d.significance === 'major').length ?? 0;
  const sourceEventCount = nsCount + lrMajorCount;
  const surfacedSnippetCount = snap.historySnippets.length;
  if (sourceEventCount <= 0 && surfacedSnippetCount <= 0) return null;
  return {
    sourceEventCount,
    surfacedSnippetCount,
    gap: sourceEventCount - surfacedSnippetCount,
  };
}

// --- bundled from core/link-pulse-span.ts ---
export interface NrDashLinkPulseSpan {
  linkCount: number;
  minBlend: number;
  maxBlend: number;
  intensitySpread: number;
}

/** Spread of endpoint-averaged map pulse intensity across strategic map links. */
export function nrDashBuildLinkPulseSpan(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashLinkPulseSpan | null {
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const minBlend = Math.min(...blends);
  const maxBlend = Math.max(...blends);
  return {
    linkCount: blends.length,
    minBlend: Math.round(minBlend * 1000) / 1000,
    maxBlend: Math.round(maxBlend * 1000) / 1000,
    intensitySpread: Math.round((maxBlend - minBlend) * 1000) / 1000,
  };
}

// --- bundled from core/owner-portfolio-span.ts ---
export interface NrDashOwnerPortfolioSpan {
  ownerSlots: number;
  minPortfolio: number;
  maxPortfolio: number;
  portfolioSpread: number;
}

/** Spread of region counts across ownership labels on the snapshot. */
export function nrDashBuildOwnerPortfolioSpan(
  snap: NrDashAuthSnapshot | null
): NrDashOwnerPortfolioSpan | null {
  if (!snap?.regions.length) return null;
  const counts: Record<NrDashAuthSnapshot['regions'][number]['owner'], number> = {
    you: 0,
    rival: 0,
    neutral: 0,
    unknown: 0,
  };
  snap.regions.forEach(r => {
    counts[r.owner] += 1;
  });
  const values = Object.values(counts);
  const minPortfolio = Math.min(...values);
  const maxPortfolio = Math.max(...values);
  return {
    ownerSlots: values.length,
    minPortfolio,
    maxPortfolio,
    portfolioSpread: maxPortfolio - minPortfolio,
  };
}

// --- bundled from core/constraint-band-span.ts ---
const NETWORK_RANK: Record<NationalNetworkKind, number> = Object.fromEntries(
  NATIONAL_NETWORKS.map((n, i) => [n, i])
) as Record<NationalNetworkKind, number>;

export interface NrDashConstraintBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of primary NS constraint network ordinals across regional rows. */
export function nrDashBuildConstraintBandSpan(
  ns: NationalSystemsState | null
): NrDashConstraintBandSpan | null {
  if (!ns?.regions) return null;
  const ranks = Object.values(ns.regions)
    .map(r => (r.primaryConstraint ? NETWORK_RANK[r.primaryConstraint] : null))
    .filter((v): v is number => v != null);
  if (!ranks.length) return null;
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}

// --- bundled from core/derived-event-turn-span.ts ---
export interface NrDashDerivedEventTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in LR derived narrative events. */
export function nrDashBuildDerivedEventTurnSpan(
  lr: LivingRegionsWorldView | null
): NrDashDerivedEventTurnSpan | null {
  if (!lr?.state.derived.length) return null;
  const turns = lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t));
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    eventCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}

// --- bundled from core/critical-needs-spread.ts ---
export interface NrDashCriticalNeedsSpread {
  regionCount: number;
  totalCriticalNeeds: number;
  meanCriticalNeeds: number;
  stdDev: number;
}

/** Cross-region dispersion of open LR needs at critical severity. */
export function nrDashBuildCriticalNeedsSpread(
  lr: LivingRegionsWorldView | null
): NrDashCriticalNeedsSpread | null {
  if (!lr?.state.regions) return null;
  const counts = Object.values(lr.state.regions).map(reg =>
    reg.needs.filter(n => n.status === 'open' && n.severity === 'critical').length
  );
  const totalCriticalNeeds = counts.reduce((s, n) => s + n, 0);
  if (totalCriticalNeeds <= 0) return null;
  const meanCriticalNeeds = totalCriticalNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanCriticalNeeds) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalCriticalNeeds,
    meanCriticalNeeds: Math.round(meanCriticalNeeds * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/national-snippet-gap.ts ---
export interface NrDashNationalSnippetGap {
  maxSnippets: number;
  surfacedCount: number;
  unusedSlots: number;
}

/** Unused dashboard history snippet buffer slots on the merged snapshot. */
export function nrDashBuildNationalSnippetGap(
  snap: NrDashAuthSnapshot | null
): NrDashNationalSnippetGap | null {
  if (!snap) return null;
  const maxSnippets = 8;
  const surfacedCount = snap.historySnippets.length;
  return {
    maxSnippets,
    surfacedCount,
    unusedSlots: maxSnippets - surfacedCount,
  };
}

// --- bundled from core/hub-pulse-span.ts ---
export interface NrDashHubPulseSpan {
  hubRegionCount: number;
  minIntensity: number;
  maxIntensity: number;
  intensitySpread: number;
}

/** Spread of map pulse intensity across NS connectivity hub regions (hubScore > 0). */
export function nrDashBuildHubPulseSpan(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubPulseSpan | null {
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const hubs = nrDashBuildMapHubIndex(ns).filter(h => h.hubScore > 0);
  if (!hubs.length) return null;
  const intensities = hubs.map(h => pulseById.get(h.regionId) ?? 0);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);
  return {
    hubRegionCount: intensities.length,
    minIntensity: Math.round(minIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    intensitySpread: Math.round((maxIntensity - minIntensity) * 1000) / 1000,
  };
}

// --- bundled from core/rival-portfolio-span.ts ---
export interface NrDashRivalPortfolioSpan {
  youCount: number;
  rivalCount: number;
  portfolioSpread: number;
}

/** Absolute gap between player-owned and rival-owned region counts on the snapshot. */
export function nrDashBuildRivalPortfolioSpan(
  snap: NrDashAuthSnapshot | null
): NrDashRivalPortfolioSpan | null {
  if (!snap?.regions.length) return null;
  let youCount = 0;
  let rivalCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'you') youCount += 1;
    if (r.owner === 'rival') rivalCount += 1;
  });
  return {
    youCount,
    rivalCount,
    portfolioSpread: Math.abs(youCount - rivalCount),
  };
}

// --- bundled from core/network-condition-span.ts ---
export interface NrDashNetworkConditionSpan {
  cellCount: number;
  meanRank: number;
  stdDev: number;
}

function condRank(c: NationalNetworkCondition | undefined): number {
  return NS_COND_RANK[c ?? 'healthy'] ?? 1;
}

/** Dispersion of NS regional network condition ranks across the heat grid. */
export function nrDashBuildNetworkConditionSpan(
  ns: NationalSystemsState | null
): NrDashNetworkConditionSpan | null {
  if (!ns?.regions) return null;
  const ranks: number[] = [];
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(n => {
      ranks.push(condRank(reg.networks[n]?.condition));
    });
  });
  if (!ranks.length) return null;
  const meanRank = ranks.reduce((s, r) => s + r, 0) / ranks.length;
  const variance = ranks.reduce((s, r) => s + (r - meanRank) ** 2, 0) / Math.max(ranks.length, 1);
  return {
    cellCount: ranks.length,
    meanRank: Math.round(meanRank * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}

// --- bundled from core/ns-history-turn-span.ts ---
export interface NrDashNsHistoryTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in NS history entries only (authoritative list). */
export function nrDashBuildNsHistoryTurnSpan(
  ns: NationalSystemsState | null
): NrDashNsHistoryTurnSpan | null {
  if (!ns?.history.length) return null;
  const turns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    eventCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}

// --- bundled from core/lr-history-turn-span.ts ---
export interface NrDashLrHistoryTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in LR major derived narrative events (LR history lane only). */
export function nrDashBuildLrHistoryTurnSpan(
  lr: LivingRegionsWorldView | null
): NrDashLrHistoryTurnSpan | null {
  if (!lr?.state.derived.length) return null;
  const turns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    eventCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}

// --- bundled from core/open-needs-tier-spread.ts ---
const NEED_TIER_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashOpenNeedsTierSpread {
  regionCount: number;
  tierSlotCount: number;
  minTierCount: number;
  maxTierCount: number;
  tierSpread: number;
}

/** Spread between min and max open-need counts across severity tiers (national LR totals). */
export function nrDashBuildOpenNeedsTierSpread(
  lr: LivingRegionsWorldView | null
): NrDashOpenNeedsTierSpread | null {
  if (!lr?.state.regions) return null;
  const tierCounts = [0, 0, 0, 0];
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs
      .filter(n => n.status === 'open')
      .forEach(n => {
        tierCounts[NEED_TIER_ORD[n.severity]] += 1;
      });
  });
  const totalOpen = tierCounts.reduce((s, n) => s + n, 0);
  if (totalOpen <= 0) return null;
  const active = tierCounts.filter(c => c > 0);
  const minTierCount = Math.min(...active);
  const maxTierCount = Math.max(...active);
  return {
    regionCount: Object.keys(lr.state.regions).length,
    tierSlotCount: tierCounts.length,
    minTierCount,
    maxTierCount,
    tierSpread: maxTierCount - minTierCount,
  };
}

// --- bundled from core/snippet-saturation-share.ts ---
export interface NrDashSnippetSaturationShare {
  snippetCount: number;
  maxSnippets: number;
  saturationShare: number;
}

/** Fraction of dashboard history snippet buffer occupied on the merged snapshot. */
export function nrDashBuildSnippetSaturationShare(
  snap: NrDashAuthSnapshot | null
): NrDashSnippetSaturationShare | null {
  if (!snap) return null;
  const maxSnippets = 8;
  const snippetCount = snap.historySnippets.length;
  return {
    snippetCount,
    maxSnippets,
    saturationShare: Math.round((snippetCount / maxSnippets) * 1000) / 1000,
  };
}

// --- bundled from core/pulse-asymmetry-gap.ts ---
export interface NrDashPulseAsymmetryGap {
  regionCount: number;
  meanIntensity: number;
  maxIntensity: number;
  asymmetryGap: number;
}

/** Gap between hottest map pulse and the national mean intensity (concentration above average). */
export function nrDashBuildPulseAsymmetryGap(nodes: RegionMapNode[]): NrDashPulseAsymmetryGap | null {
  if (!nodes.length) return null;
  const intensities = nrDashBuildMapPulseRows(nodes).map(p => p.intensity);
  const meanIntensity = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  const maxIntensity = Math.max(...intensities);
  return {
    regionCount: intensities.length,
    meanIntensity: Math.round(meanIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    asymmetryGap: Math.round((maxIntensity - meanIntensity) * 1000) / 1000,
  };
}

// --- bundled from core/regional-owner-skew.ts ---
export interface NrDashRegionalOwnerSkew {
  regionCount: number;
  youShare: number;
  rivalShare: number;
  ownershipSkew: number;
}

/** Player minus rival ownership share on the merged regional snapshot. */
export function nrDashBuildRegionalOwnerSkew(
  snap: NrDashAuthSnapshot | null
): NrDashRegionalOwnerSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let youCount = 0;
  let rivalCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'you') youCount += 1;
    if (r.owner === 'rival') rivalCount += 1;
  });
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  const rivalShare = Math.round((rivalCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    youShare,
    rivalShare,
    ownershipSkew: Math.round((youShare - rivalShare) * 1000) / 1000,
  };
}

// --- bundled from core/combined-derived-history-gap.ts ---
export interface NrDashCombinedDerivedHistoryGap {
  combinedSourceCount: number;
  surfacedSnippetCount: number;
  gap: number;
}

/** Delta between all NS history + LR derived events and merged snapshot snippet count. */
export function nrDashBuildCombinedDerivedHistoryGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedDerivedHistoryGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const derivedCount = lr?.state.derived.length ?? 0;
  const combinedSourceCount = nsCount + derivedCount;
  const surfacedSnippetCount = snap.historySnippets.length;
  if (combinedSourceCount <= 0 && surfacedSnippetCount <= 0) return null;
  return {
    combinedSourceCount,
    surfacedSnippetCount,
    gap: combinedSourceCount - surfacedSnippetCount,
  };
}

// --- bundled from core/meaningful-derived-turn-span.ts ---
export interface NrDashMeaningfulDerivedTurnSpan {
  eventCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

/** Spread of turn numbers in LR meaningful derived narrative events. */
export function nrDashBuildMeaningfulDerivedTurnSpan(
  lr: LivingRegionsWorldView | null
): NrDashMeaningfulDerivedTurnSpan | null {
  if (!lr?.state.derived.length) return null;
  const turns = lr.state.derived
    .filter(d => d.significance === 'meaningful')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    eventCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}

// --- bundled from core/national-snippet-saturation-gap.ts ---
export interface NrDashNationalSnippetSaturationGap {
  maxSnippets: number;
  snippetCount: number;
  saturationGap: number;
  headroomShare: number;
}

/** Unused dashboard snippet buffer slots on a merged LR+NS national snapshot. */
export function nrDashBuildNationalSnippetSaturationGap(
  snap: NrDashAuthSnapshot | null
): NrDashNationalSnippetSaturationGap | null {
  if (!snap?.regions.length) return null;
  const hasLr = snap.provenance.some(p => p.source === 'living_regions');
  const hasNs = snap.provenance.some(p => p.source === 'national_systems');
  if (!hasLr || !hasNs) return null;
  const maxSnippets = 8;
  const snippetCount = snap.historySnippets.length;
  const saturationGap = maxSnippets - snippetCount;
  return {
    maxSnippets,
    snippetCount,
    saturationGap,
    headroomShare: Math.round((saturationGap / maxSnippets) * 1000) / 1000,
  };
}

// --- bundled from core/corridor-pulse-asymmetry.ts ---
export interface NrDashCorridorPulseAsymmetry {
  corridorCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across land-adjacency corridor endpoint pairs. */
export function nrDashBuildCorridorPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashCorridorPulseAsymmetry | null {
  if (!ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs();
  if (!pairs.length) return null;
  const deltas = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return Math.abs(pa - pb);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    corridorCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/neutral-owner-portfolio-skew.ts ---
export interface NrDashNeutralOwnerPortfolioSkew {
  regionCount: number;
  neutralShare: number;
  youShare: number;
  portfolioSkew: number;
}

/** Neutral minus player ownership share on the merged regional snapshot. */
export function nrDashBuildNeutralOwnerPortfolioSkew(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOwnerPortfolioSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let neutralCount = 0;
  let youCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'neutral') neutralCount += 1;
    if (r.owner === 'you') youCount += 1;
  });
  if (neutralCount <= 0) return null;
  const neutralShare = Math.round((neutralCount / regionCount) * 1000) / 1000;
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    neutralShare,
    youShare,
    portfolioSkew: Math.round((neutralShare - youShare) * 1000) / 1000,
  };
}

// --- bundled from core/multi-tier-needs-concentration.ts ---
const NEED_TIER_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashMultiTierNeedsConcentration {
  openNeedCount: number;
  activeTierCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open LR needs across severity tiers. */
export function nrDashBuildMultiTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashMultiTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const tierCounts = [0, 0, 0, 0];
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs
      .filter(n => n.status === 'open')
      .forEach(n => {
        tierCounts[NEED_TIER_ORD[n.severity]] += 1;
      });
  });
  const openNeedCount = tierCounts.reduce((s, n) => s + n, 0);
  if (openNeedCount <= 0) return null;
  const activeTierCount = tierCounts.filter(c => c > 0).length;
  if (activeTierCount <= 1) return null;
  let concentrationIndex = 0;
  tierCounts.forEach(count => {
    if (count <= 0) return;
    const share = count / openNeedCount;
    concentrationIndex += share * share;
  });
  return {
    openNeedCount,
    activeTierCount,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/lr-ns-history-overlap-gap.ts ---
export interface NrDashLrNsHistoryOverlapGap {
  totalEntries: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history entries and LR derived events. */
export function nrDashBuildLrNsHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashLrNsHistoryOverlapGap | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived.forEach(d => {
    if (Number.isFinite(d.turn)) turns.push(d.turn);
  });
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    totalEntries: turns.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}

// --- bundled from core/unknown-owner-portfolio-skew.ts ---
export interface NrDashUnknownOwnerPortfolioSkew {
  regionCount: number;
  unknownShare: number;
  youShare: number;
  portfolioSkew: number;
}

/** Unknown minus player ownership share on the merged regional snapshot. */
export function nrDashBuildUnknownOwnerPortfolioSkew(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOwnerPortfolioSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let unknownCount = 0;
  let youCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'unknown') unknownCount += 1;
    if (r.owner === 'you') youCount += 1;
  });
  if (unknownCount <= 0) return null;
  const unknownShare = Math.round((unknownCount / regionCount) * 1000) / 1000;
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    unknownShare,
    youShare,
    portfolioSkew: Math.round((unknownShare - youShare) * 1000) / 1000,
  };
}

// --- bundled from core/high-tier-needs-concentration.ts ---
export interface NrDashHighTierNeedsConcentration {
  highTierOpenCount: number;
  activeHighTierSlots: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open LR needs at high and critical severity. */
export function nrDashBuildHighTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashHighTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  let highCount = 0;
  let criticalCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs
      .filter(n => n.status === 'open')
      .forEach(n => {
        if (n.severity === 'high') highCount += 1;
        if (n.severity === 'critical') criticalCount += 1;
      });
  });
  const highTierOpenCount = highCount + criticalCount;
  if (highTierOpenCount <= 0) return null;
  const slots = [highCount, criticalCount].filter(c => c > 0);
  if (slots.length <= 1) return null;
  let concentrationIndex = 0;
  if (highCount > 0) {
    const share = highCount / highTierOpenCount;
    concentrationIndex += share * share;
  }
  if (criticalCount > 0) {
    const share = criticalCount / highTierOpenCount;
    concentrationIndex += share * share;
  }
  return {
    highTierOpenCount,
    activeHighTierSlots: slots.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/link-pulse-asymmetry.ts ---
export interface NrDashLinkPulseAsymmetry {
  linkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across strategic map link endpoint pairs. */
export function nrDashBuildLinkPulseAsymmetry(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashLinkPulseAsymmetry | null {
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    linkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/ns-only-snippet-headroom.ts ---
export interface NrDashNsOnlySnippetHeadroom {
  nsSnippetCap: number;
  surfacedCount: number;
  headroomSlots: number;
  headroomShare: number;
}

/** Unused NS history snippet lane on snapshots built from National Systems only. */
export function nrDashBuildNsOnlySnippetHeadroom(
  snap: NrDashAuthSnapshot | null
): NrDashNsOnlySnippetHeadroom | null {
  if (!snap) return null;
  const hasNs = snap.provenance.some(p => p.source === 'national_systems');
  const hasLr = snap.provenance.some(p => p.source === 'living_regions');
  if (!hasNs || hasLr) return null;
  const nsSnippetCap = 4;
  const surfacedCount = snap.historySnippets.length;
  const headroomSlots = nsSnippetCap - surfacedCount;
  return {
    nsSnippetCap,
    surfacedCount,
    headroomSlots,
    headroomShare: Math.round((headroomSlots / nsSnippetCap) * 1000) / 1000,
  };
}

// --- bundled from core/derived-major-overlap-gap.ts ---
export interface NrDashDerivedMajorOverlapGap {
  totalEntries: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major derived events. */
export function nrDashBuildDerivedMajorOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashDerivedMajorOverlapGap | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived
    .filter(d => d.significance === 'major')
    .forEach(d => {
      if (Number.isFinite(d.turn)) turns.push(d.turn);
    });
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    totalEntries: turns.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}

// --- bundled from core/corridor-saturation-share.ts ---
export interface NrDashCorridorSaturationShare {
  corridorCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean corridor pulse blend relative to the hottest land-adjacency corridor. */
export function nrDashBuildCorridorSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashCorridorSaturationShare | null {
  if (!ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs();
  if (!pairs.length) return null;
  const blends = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return (pa + pb) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    corridorCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/rival-owner-portfolio-skew.ts ---
export interface NrDashRivalOwnerPortfolioSkew {
  regionCount: number;
  rivalShare: number;
  youShare: number;
  portfolioSkew: number;
}

/** Rival minus player ownership share on the merged regional snapshot. */
export function nrDashBuildRivalOwnerPortfolioSkew(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOwnerPortfolioSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let rivalCount = 0;
  let youCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'rival') rivalCount += 1;
    if (r.owner === 'you') youCount += 1;
  });
  if (rivalCount <= 0) return null;
  const rivalShare = Math.round((rivalCount / regionCount) * 1000) / 1000;
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    rivalShare,
    youShare,
    portfolioSkew: Math.round((rivalShare - youShare) * 1000) / 1000,
  };
}

// --- bundled from core/critical-tier-needs-concentration.ts ---
export interface NrDashCriticalTierNeedsConcentration {
  criticalOpenCount: number;
  regionCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open critical LR needs across regions. */
export function nrDashBuildCriticalTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashCriticalTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const counts = regionIds.map(id =>
    lr.state.regions[id]!.needs.filter(n => n.status === 'open' && n.severity === 'critical').length
  );
  const criticalOpenCount = counts.reduce((s, n) => s + n, 0);
  if (criticalOpenCount <= 0) return null;
  const contributingRegions = counts.filter(c => c > 0).length;
  if (contributingRegions <= 1) return null;
  let concentrationIndex = 0;
  counts.forEach(count => {
    if (count <= 0) return;
    const share = count / criticalOpenCount;
    concentrationIndex += share * share;
  });
  return {
    criticalOpenCount,
    regionCount: regionIds.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/hub-pulse-asymmetry.ts ---
export interface NrDashHubPulseAsymmetry {
  hubRegionCount: number;
  meanIntensity: number;
  maxIntensity: number;
  asymmetryGap: number;
}

/** Gap between hottest hub pulse and mean hub intensity on connectivity hubs. */
export function nrDashBuildHubPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubPulseAsymmetry | null {
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const hubs = nrDashBuildMapHubIndex(ns).filter(h => h.hubScore > 0);
  if (!hubs.length) return null;
  const intensities = hubs.map(h => pulseById.get(h.regionId) ?? 0);
  const meanIntensity = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  const maxIntensity = Math.max(...intensities);
  return {
    hubRegionCount: intensities.length,
    meanIntensity: Math.round(meanIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    asymmetryGap: Math.round((maxIntensity - meanIntensity) * 1000) / 1000,
  };
}

// --- bundled from core/lr-only-snippet-headroom.ts ---
export interface NrDashLrOnlySnippetHeadroom {
  lrSnippetCap: number;
  surfacedCount: number;
  headroomSlots: number;
  headroomShare: number;
}

/** Unused LR major-derived snippet lane on snapshots built from Living Regions only. */
export function nrDashBuildLrOnlySnippetHeadroom(
  snap: NrDashAuthSnapshot | null
): NrDashLrOnlySnippetHeadroom | null {
  if (!snap) return null;
  const hasLr = snap.provenance.some(p => p.source === 'living_regions');
  const hasNs = snap.provenance.some(p => p.source === 'national_systems');
  if (!hasLr || hasNs) return null;
  const lrSnippetCap = 3;
  const surfacedCount = snap.historySnippets.length;
  const headroomSlots = lrSnippetCap - surfacedCount;
  return {
    lrSnippetCap,
    surfacedCount,
    headroomSlots,
    headroomShare: Math.round((headroomSlots / lrSnippetCap) * 1000) / 1000,
  };
}

// --- bundled from core/meaningful-derived-overlap-gap.ts ---
export interface NrDashMeaningfulDerivedOverlapGap {
  totalEntries: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived events. */
export function nrDashBuildMeaningfulDerivedOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulDerivedOverlapGap | null {
  const turns: number[] = [];
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) turns.push(h.turn);
  });
  lr?.state.derived
    .filter(d => d.significance === 'meaningful')
    .forEach(d => {
      if (Number.isFinite(d.turn)) turns.push(d.turn);
    });
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    totalEntries: turns.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}

// --- bundled from core/link-saturation-share.ts ---
export interface NrDashLinkSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean link pulse blend relative to the hottest strategic map link. */
export function nrDashBuildLinkSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashLinkSaturationShare | null {
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/you-owner-momentum-gap.ts ---
export interface NrDashYouOwnerMomentumGap {
  ownedRegionCount: number;
  nationalMeanRank: number;
  ownedMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between player-owned and national mean momentum ranks. */
export function nrDashBuildYouOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashYouOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const ownedMeanRank = owned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / owned.length;
  const momentumGap = Math.round(Math.abs(ownedMeanRank - nationalMeanRank) * 100) / 100;
  return {
    ownedRegionCount: owned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    ownedMeanRank: Math.round(ownedMeanRank * 100) / 100,
    momentumGap,
  };
}

// --- bundled from core/moderate-tier-needs-concentration.ts ---
export interface NrDashModerateTierNeedsConcentration {
  moderateOpenCount: number;
  regionCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open moderate LR needs across regions. */
export function nrDashBuildModerateTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashModerateTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const counts = regionIds.map(id =>
    lr.state.regions[id]!.needs.filter(n => n.status === 'open' && n.severity === 'moderate').length
  );
  const moderateOpenCount = counts.reduce((s, n) => s + n, 0);
  if (moderateOpenCount <= 0) return null;
  const contributingRegions = counts.filter(c => c > 0).length;
  if (contributingRegions <= 1) return null;
  let concentrationIndex = 0;
  counts.forEach(count => {
    if (count <= 0) return;
    const share = count / moderateOpenCount;
    concentrationIndex += share * share;
  });
  return {
    moderateOpenCount,
    regionCount: regionIds.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/map-pulse-saturation-share.ts ---
export interface NrDashMapPulseSaturationShare {
  regionCount: number;
  meanIntensity: number;
  peakIntensity: number;
  saturationShare: number;
}

/** Mean map pulse intensity relative to the hottest strategic map node. */
export function nrDashBuildMapPulseSaturationShare(nodes: RegionMapNode[]): NrDashMapPulseSaturationShare | null {
  if (!nodes.length) return null;
  const intensities = nrDashBuildMapPulseRows(nodes).map(p => p.intensity);
  const peakIntensity = Math.max(...intensities);
  if (peakIntensity <= 0) return null;
  const meanIntensity = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  return {
    regionCount: intensities.length,
    meanIntensity: Math.round(meanIntensity * 1000) / 1000,
    peakIntensity: Math.round(peakIntensity * 1000) / 1000,
    saturationShare: Math.round((meanIntensity / peakIntensity) * 1000) / 1000,
  };
}

// --- bundled from core/merged-snippet-overlap-gap.ts ---
export interface NrDashMergedSnippetOverlapGap {
  snippetCount: number;
  uniqueTurnCount: number;
  overlapGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Duplicate-turn pressure among merged dashboard history snippet labels. */
export function nrDashBuildMergedSnippetOverlapGap(
  snap: NrDashAuthSnapshot | null
): NrDashMergedSnippetOverlapGap | null {
  if (!snap?.historySnippets.length) return null;
  const turns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null);
  if (!turns.length) return null;
  const uniqueTurnCount = new Set(turns).size;
  return {
    snippetCount: snap.historySnippets.length,
    uniqueTurnCount,
    overlapGap: turns.length - uniqueTurnCount,
  };
}

// --- bundled from core/dependency-pulse-asymmetry.ts ---
export interface NrDashDependencyPulseAsymmetry {
  linkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across National Systems dependency map links only. */
export function nrDashBuildDependencyPulseAsymmetry(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashDependencyPulseAsymmetry | null {
  const depLinks = links.filter(l => l.kind === 'dependency');
  if (!depLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = depLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    linkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/border-corridor-saturation-share.ts ---
export interface NrDashBorderCorridorSaturationShare {
  borderRegionCount: number;
  meanStress: number;
  peakStress: number;
  saturationShare: number;
}

/** Mean land-border corridor stress relative to the hottest border region. */
export function nrDashBuildBorderCorridorSaturationShare(
  ns: NationalSystemsState | null
): NrDashBorderCorridorSaturationShare | null {
  const rows = nrDashBuildBorderStressRows(ns);
  if (!rows.length) return null;
  const stresses = rows.map(r => r.maxCorridorStress);
  const peakStress = Math.max(...stresses);
  if (peakStress <= 0) return null;
  const meanStress = stresses.reduce((s, v) => s + v, 0) / stresses.length;
  return {
    borderRegionCount: stresses.length,
    meanStress: Math.round(meanStress * 1000) / 1000,
    peakStress: Math.round(peakStress * 1000) / 1000,
    saturationShare: Math.round((meanStress / peakStress) * 1000) / 1000,
  };
}

// --- bundled from core/rival-owner-momentum-gap.ts ---
export interface NrDashRivalOwnerMomentumGap {
  rivalRegionCount: number;
  nationalMeanRank: number;
  rivalMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between rival-owned and national mean momentum ranks. */
export function nrDashBuildRivalOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const rivalOwned = snap.regions.filter(r => r.owner === 'rival');
  if (!rivalOwned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const rivalMeanRank = rivalOwned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / rivalOwned.length;
  const momentumGap = Math.round(Math.abs(rivalMeanRank - nationalMeanRank) * 100) / 100;
  return {
    rivalRegionCount: rivalOwned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    rivalMeanRank: Math.round(rivalMeanRank * 100) / 100,
    momentumGap,
  };
}

// --- bundled from core/low-tier-needs-concentration.ts ---
export interface NrDashLowTierNeedsConcentration {
  lowOpenCount: number;
  regionCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open low-severity LR needs across regions. */
export function nrDashBuildLowTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashLowTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const counts = regionIds.map(id =>
    lr.state.regions[id]!.needs.filter(n => n.status === 'open' && n.severity === 'low').length
  );
  const lowOpenCount = counts.reduce((s, n) => s + n, 0);
  if (lowOpenCount <= 0) return null;
  const contributingRegions = counts.filter(c => c > 0).length;
  if (contributingRegions <= 1) return null;
  let concentrationIndex = 0;
  counts.forEach(count => {
    if (count <= 0) return;
    const share = count / lowOpenCount;
    concentrationIndex += share * share;
  });
  return {
    lowOpenCount,
    regionCount: regionIds.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/adjacency-pulse-asymmetry.ts ---
export interface NrDashAdjacencyPulseAsymmetry {
  linkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across land-adjacency map links only. */
export function nrDashBuildAdjacencyPulseAsymmetry(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashAdjacencyPulseAsymmetry | null {
  const adjLinks = links.filter(l => l.kind === 'adjacency');
  if (!adjLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = adjLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    linkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/snippet-turn-span.ts ---
export interface NrDashSnippetTurnSpan {
  snippetCount: number;
  minTurn: number;
  maxTurn: number;
  turnSpread: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Spread of turn numbers parsed from merged dashboard history snippet labels. */
export function nrDashBuildSnippetTurnSpan(snap: NrDashAuthSnapshot | null): NrDashSnippetTurnSpan | null {
  if (!snap?.historySnippets.length) return null;
  const turns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null);
  if (!turns.length) return null;
  const minTurn = Math.min(...turns);
  const maxTurn = Math.max(...turns);
  return {
    snippetCount: turns.length,
    minTurn,
    maxTurn,
    turnSpread: maxTurn - minTurn,
  };
}

// --- bundled from core/hub-corridor-saturation-share.ts ---
export interface NrDashHubCorridorSaturationShare {
  hubRegionId: string | null;
  touchingLinkCount: number;
  meanLinkStress: number;
  peakLinkStress: number;
  saturationShare: number;
}

/** Mean hub-touching link stress relative to the peak stressed hub corridor. */
export function nrDashBuildHubCorridorSaturationShare(
  ns: NationalSystemsState | null
): NrDashHubCorridorSaturationShare | null {
  const load = nrDashBuildHubCorridorLoad(ns);
  if (!load || load.touchingLinkCount <= 0 || load.peakLinkStress <= 0) return null;
  return {
    hubRegionId: load.hubRegionId,
    touchingLinkCount: load.touchingLinkCount,
    meanLinkStress: load.meanLinkStress,
    peakLinkStress: load.peakLinkStress,
    saturationShare: Math.round((load.meanLinkStress / load.peakLinkStress) * 1000) / 1000,
  };
}

// --- bundled from core/national-derived-overlap-gap.ts ---
export interface NrDashNationalDerivedOverlapGap {
  nationalTurn: number;
  nsEntryCount: number;
  derivedEntryCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure at the authoritative NS turn across history and LR derived lanes. */
export function nrDashBuildNationalDerivedOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashNationalDerivedOverlapGap | null {
  if (!lr || !ns) return null;
  const nationalTurn = ns.turn;
  if (!Number.isFinite(nationalTurn)) return null;
  const nsEntryCount = ns.history.filter(h => h.turn === nationalTurn).length;
  const derivedEntryCount = lr.state.derived.filter(d => d.turn === nationalTurn).length;
  const totalEntries = nsEntryCount + derivedEntryCount;
  if (totalEntries <= 0) return null;
  const uniqueTurnSlots = totalEntries > 0 ? 1 : 0;
  return {
    nationalTurn,
    nsEntryCount,
    derivedEntryCount,
    overlapGap: totalEntries - uniqueTurnSlots,
  };
}

// --- bundled from core/neutral-owner-momentum-gap.ts ---
export interface NrDashNeutralOwnerMomentumGap {
  neutralRegionCount: number;
  nationalMeanRank: number;
  neutralMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between neutral-owned and national mean momentum ranks. */
export function nrDashBuildNeutralOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const neutralOwned = snap.regions.filter(r => r.owner === 'neutral');
  if (!neutralOwned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const neutralMeanRank =
    neutralOwned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / neutralOwned.length;
  const momentumGap = Math.round(Math.abs(neutralMeanRank - nationalMeanRank) * 100) / 100;
  return {
    neutralRegionCount: neutralOwned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    neutralMeanRank: Math.round(neutralMeanRank * 100) / 100,
    momentumGap,
  };
}

// --- bundled from core/open-needs-severity-span.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashOpenNeedsSeveritySpan {
  regionCount: number;
  minSeverityRank: number;
  maxSeverityRank: number;
  severitySpread: number;
}

/** Spread of peak open-need severity ranks across LR regions. */
export function nrDashBuildOpenNeedsSeveritySpan(
  lr: LivingRegionsWorldView | null
): NrDashOpenNeedsSeveritySpan | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peakRanks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return null;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const active = peakRanks.filter((r): r is number => r != null);
  if (!active.length) return null;
  const minSeverityRank = Math.min(...active);
  const maxSeverityRank = Math.max(...active);
  return {
    regionCount: regionIds.length,
    minSeverityRank,
    maxSeverityRank,
    severitySpread: maxSeverityRank - minSeverityRank,
  };
}

// --- bundled from core/peripheral-pulse-asymmetry.ts ---
export interface NrDashPeripheralPulseAsymmetry {
  peripheralLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on map links not touching the primary connectivity hub. */
export function nrDashBuildPeripheralPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashPeripheralPulseAsymmetry | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const peripheralLinks = merged.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  if (!peripheralLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = peripheralLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    peripheralLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/history-snippet-turn-gap.ts ---
export interface NrDashHistorySnippetTurnGap {
  sourceTurnSpread: number;
  snippetTurnSpread: number;
  turnGap: number;
}

/** Delta between authoritative history turn span and surfaced snippet turn span. */
export function nrDashBuildHistorySnippetTurnGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashHistorySnippetTurnGap | null {
  const source = nrDashBuildHistoryTurnSpan(lr, ns);
  const snippet = nrDashBuildSnippetTurnSpan(snap);
  if (!source || !snippet) return null;
  return {
    sourceTurnSpread: source.turnSpread,
    snippetTurnSpread: snippet.turnSpread,
    turnGap: source.turnSpread - snippet.turnSpread,
  };
}

// --- bundled from core/dependency-corridor-saturation-share.ts ---
export interface NrDashDependencyCorridorSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean dependency-link pulse blend relative to the hottest dependency corridor. */
export function nrDashBuildDependencyCorridorSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashDependencyCorridorSaturationShare | null {
  const depLinks = links.filter(l => l.kind === 'dependency');
  if (!depLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = depLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/lr-major-snippet-overlap-gap.ts ---
export interface NrDashLrMajorSnippetOverlapGap {
  majorEventCount: number;
  snippetTurnCount: number;
  overlapGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Duplicate-turn pressure between LR major derived events and matching snippet labels. */
export function nrDashBuildLrMajorSnippetOverlapGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrMajorSnippetOverlapGap | null {
  if (!lr?.state.derived.length || !snap?.historySnippets.length) return null;
  const majorTurns = lr.state.derived
    .filter(d => d.significance === 'major')
    .map(d => d.turn)
    .filter(t => Number.isFinite(t));
  if (!majorTurns.length) return null;
  const majorTurnSet = new Set(majorTurns);
  const snippetTurns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && majorTurnSet.has(t));
  const combined = [...majorTurns, ...snippetTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    majorEventCount: majorTurns.length,
    snippetTurnCount: snippetTurns.length,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/unknown-owner-momentum-gap.ts ---
export interface NrDashUnknownOwnerMomentumGap {
  unknownRegionCount: number;
  nationalMeanRank: number;
  unknownMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between unknown-owned and national mean momentum ranks. */
export function nrDashBuildUnknownOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const unknownOwned = snap.regions.filter(r => r.owner === 'unknown');
  if (!unknownOwned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const unknownMeanRank =
    unknownOwned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / unknownOwned.length;
  const momentumGap = Math.round(Math.abs(unknownMeanRank - nationalMeanRank) * 100) / 100;
  return {
    unknownRegionCount: unknownOwned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    unknownMeanRank: Math.round(unknownMeanRank * 100) / 100,
    momentumGap,
  };
}

// --- bundled from core/regional-needs-severity-concentration.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRegionalNeedsSeverityConcentration {
  regionCount: number;
  weightedSeverityTotal: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of peak open-need severity weights across regions. */
export function nrDashBuildRegionalNeedsSeverityConcentration(
  lr: LivingRegionsWorldView | null
): NrDashRegionalNeedsSeverityConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const weights = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity])) + 1;
  });
  const weightedSeverityTotal = weights.reduce((s, n) => s + n, 0);
  if (weightedSeverityTotal <= 0) return null;
  const contributing = weights.filter(w => w > 0).length;
  if (contributing <= 1) return null;
  let concentrationIndex = 0;
  weights.forEach(weight => {
    if (weight <= 0) return;
    const share = weight / weightedSeverityTotal;
    concentrationIndex += share * share;
  });
  return {
    regionCount: regionIds.length,
    weightedSeverityTotal,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/hub-peripheral-saturation-share.ts ---
export interface NrDashHubPeripheralSaturationShare {
  hubRegionId: string | null;
  hubMeanStress: number;
  peripheralMeanStress: number;
  saturationShare: number;
}

/** Peripheral corridor mean stress relative to hub-touching corridor stress. */
export function nrDashBuildHubPeripheralSaturationShare(
  ns: NationalSystemsState | null
): NrDashHubPeripheralSaturationShare | null {
  const gap = nrDashBuildPeripheralCorridorGap(ns);
  if (!gap || gap.hubMeanStress <= 0 || gap.peripheralLinkCount <= 0) return null;
  const peakStress = Math.max(gap.hubMeanStress, gap.peripheralMeanStress);
  if (peakStress <= 0) return null;
  const meanStress = Math.min(gap.hubMeanStress, gap.peripheralMeanStress);
  return {
    hubRegionId: gap.hubRegionId,
    hubMeanStress: gap.hubMeanStress,
    peripheralMeanStress: gap.peripheralMeanStress,
    saturationShare: Math.round((meanStress / peakStress) * 1000) / 1000,
  };
}

// --- bundled from core/snippet-source-turn-gap.ts ---
export interface NrDashSnippetSourceTurnGap {
  sourceEventCount: number;
  snippetLabelCount: number;
  sourceTurnGap: number;
}

/** Delta between authoritative NS/LR history event count and surfaced snippet labels. */
export function nrDashBuildSnippetSourceTurnGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: { historySnippets: string[] } | null
): NrDashSnippetSourceTurnGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const derivedCount = lr?.state.derived.length ?? 0;
  const sourceEventCount = nsCount + derivedCount;
  const snippetLabelCount = snap.historySnippets.length;
  if (sourceEventCount <= 0 && snippetLabelCount <= 0) return null;
  return {
    sourceEventCount,
    snippetLabelCount,
    sourceTurnGap: sourceEventCount - snippetLabelCount,
  };
}

// --- bundled from core/adjacency-corridor-saturation-share.ts ---
export interface NrDashAdjacencyCorridorSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean adjacency-link pulse blend relative to the hottest land-adjacency corridor. */
export function nrDashBuildAdjacencyCorridorSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashAdjacencyCorridorSaturationShare | null {
  const adjLinks = links.filter(l => l.kind === 'adjacency');
  if (!adjLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = adjLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/ns-history-snippet-overlap-gap.ts ---
export interface NrDashNsHistorySnippetOverlapGap {
  nsHistoryCount: number;
  matchingSnippetCount: number;
  overlapGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Duplicate-turn pressure between NS history entries and matching snippet labels. */
export function nrDashBuildNsHistorySnippetOverlapGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsHistorySnippetOverlapGap | null {
  if (!ns?.history.length || !snap?.historySnippets.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  if (!nsTurns.length) return null;
  const nsTurnSet = new Set(nsTurns);
  const matchingSnippetTurns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && nsTurnSet.has(t));
  const combined = [...nsTurns, ...matchingSnippetTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsHistoryCount: nsTurns.length,
    matchingSnippetCount: matchingSnippetTurns.length,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/owned-open-needs-momentum-skew-gap.ts ---
export interface NrDashOwnedOpenNeedsMomentumSkewGap {
  ownedRegionCount: number;
  openNeedsGap: number;
  momentumGap: number;
  portfolioSkewGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Combined open-needs and momentum skew gap on player-owned snapshot rows. */
export function nrDashBuildOwnedOpenNeedsMomentumSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedOpenNeedsMomentumSkewGap | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const ownedMeanNeeds = owned.reduce((s, r) => s + r.openNeeds, 0) / owned.length;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / regionCount;
  const ownedMeanRank = owned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / owned.length;
  const openNeedsGap = Math.round(Math.abs(ownedMeanNeeds - nationalMeanNeeds) * 1000) / 1000;
  const momentumGap = Math.round(Math.abs(ownedMeanRank - nationalMeanRank) * 100) / 100;
  const portfolioSkewGap = Math.round((openNeedsGap + momentumGap) * 1000) / 1000;
  return {
    ownedRegionCount: owned.length,
    openNeedsGap,
    momentumGap,
    portfolioSkewGap,
  };
}

// --- bundled from core/national-severity-tier-spread.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNationalSeverityTierSpread {
  regionCount: number;
  minMeanRank: number;
  maxMeanRank: number;
  tierSpread: number;
}

/** Spread of mean open-need severity ranks across LR regions (national view). */
export function nrDashBuildNationalSeverityTierSpread(
  lr: LivingRegionsWorldView | null
): NrDashNationalSeverityTierSpread | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const means = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return null;
    const sum = open.reduce((s, n) => s + SEVERITY_ORD[n.severity], 0);
    return sum / open.length;
  });
  const active = means.filter((m): m is number => m != null);
  if (active.length <= 1) return null;
  const minMeanRank = Math.min(...active);
  const maxMeanRank = Math.max(...active);
  return {
    regionCount: regionIds.length,
    minMeanRank: Math.round(minMeanRank * 1000) / 1000,
    maxMeanRank: Math.round(maxMeanRank * 1000) / 1000,
    tierSpread: Math.round((maxMeanRank - minMeanRank) * 1000) / 1000,
  };
}

// --- bundled from core/chokepoint-pulse-asymmetry.ts ---
export interface NrDashChokepointPulseAsymmetry {
  chokepointCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across dependency chokepoint endpoint pairs. */
export function nrDashBuildChokepointPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashChokepointPulseAsymmetry | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = rows.map(row => {
    const consumer = pulseById.get(row.consumerRegionId) ?? 0;
    const provider = pulseById.get(row.providerRegionId) ?? 0;
    return Math.abs(consumer - provider);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    chokepointCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/lr-derived-snippet-turn-gap.ts ---
export interface NrDashLrDerivedSnippetTurnGap {
  derivedTurnSpread: number;
  lrSnippetTurnSpread: number;
  turnGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

function turnSpread(turns: number[]): number | null {
  if (!turns.length) return null;
  return Math.max(...turns) - Math.min(...turns);
}

/** Delta between LR derived turn span and matching surfaced snippet turn span. */
export function nrDashBuildLrDerivedSnippetTurnGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrDerivedSnippetTurnGap | null {
  if (!lr?.state.derived.length || !snap?.historySnippets.length) return null;
  const derivedTurns = lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t));
  const derivedSpread = turnSpread(derivedTurns);
  if (derivedSpread == null) return null;
  const derivedTurnSet = new Set(derivedTurns);
  const lrSnippetTurns = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && derivedTurnSet.has(t));
  if (!lrSnippetTurns.length) return null;
  const lrSnippetSpread = turnSpread(lrSnippetTurns)!;
  return {
    derivedTurnSpread: derivedSpread,
    lrSnippetTurnSpread: lrSnippetSpread,
    turnGap: derivedSpread - lrSnippetSpread,
  };
}

// --- bundled from core/merged-corridor-saturation-share.ts ---
export interface NrDashMergedCorridorSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean merged-map pulse blend relative to the hottest strategic link corridor. */
export function nrDashBuildMergedCorridorSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashMergedCorridorSaturationShare | null {
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/major-history-overlap-gap.ts ---
export interface NrDashMajorHistoryOverlapGap {
  nsEntryCount: number;
  majorEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major events at shared turns. */
export function nrDashBuildMajorHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMajorHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const majorTurns = lr?.state.derived.filter(d => d.significance === 'major').map(d => d.turn) ?? [];
  if (!majorTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = majorTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...majorTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    majorEntryCount: majorTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/rival-open-needs-skew-gap.ts ---
export interface NrDashRivalOpenNeedsSkewGap {
  rivalRegionCount: number;
  rivalMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on rival-owned snapshot rows. */
export function nrDashBuildRivalOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const rival = snap.regions.filter(r => r.owner === 'rival');
  if (!rival.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const rivalMeanOpenNeeds = rival.reduce((s, r) => s + r.openNeeds, 0) / rival.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const rivalOpenNeeds = rival.reduce((s, r) => s + r.openNeeds, 0);
  const rivalShare = rival.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0
      ? Math.abs(rivalOpenNeeds / totalOpenNeeds - rivalShare)
      : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(rivalMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    rivalRegionCount: rival.length,
    rivalMeanOpenNeeds: Math.round(rivalMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}

// --- bundled from core/peak-severity-concentration.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashPeakSeverityConcentration {
  regionCount: number;
  peakSeverityTotal: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of regional peak open-need severity ordinals. */
export function nrDashBuildPeakSeverityConcentration(
  lr: LivingRegionsWorldView | null
): NrDashPeakSeverityConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peaks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const peakSeverityTotal = peaks.reduce((s, n) => s + n, 0);
  if (peakSeverityTotal <= 0) return null;
  const contributing = peaks.filter(p => p > 0).length;
  if (contributing <= 1) return null;
  let concentrationIndex = 0;
  peaks.forEach(peak => {
    if (peak <= 0) return;
    const share = peak / peakSeverityTotal;
    concentrationIndex += share * share;
  });
  return {
    regionCount: regionIds.length,
    peakSeverityTotal,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/border-pulse-asymmetry.ts ---
export interface NrDashBorderPulseAsymmetry {
  borderLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on land links touching the hottest border region. */
export function nrDashBuildBorderPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashBorderPulseAsymmetry | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!borderRegionId || !ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs().filter(({ a, b }) => a === borderRegionId || b === borderRegionId);
  if (!pairs.length) return null;
  const deltas = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return Math.abs(pa - pb);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    borderLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/ns-snippet-source-gap.ts ---
export interface NrDashNsSnippetSourceGap {
  nsSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history entries vs merged snapshot snippet labels at NS turns. */
export function nrDashBuildNsSnippetSourceGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsSnippetSourceGap | null {
  if (!ns?.history.length || !snap) return null;
  const nsTurnSet = new Set(ns.history.map(h => h.turn).filter(t => Number.isFinite(t)));
  if (!nsTurnSet.size) return null;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && nsTurnSet.has(t)).length;
  return {
    nsSourceCount: ns.history.length,
    matchedSnippetCount,
    sourceGap: ns.history.length - matchedSnippetCount,
  };
}

// --- bundled from core/hub-link-saturation-share.ts ---
export interface NrDashHubLinkSaturationShare {
  hubRegionId: string | null;
  touchingLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on hub-touching links relative to the peak hub corridor blend. */
export function nrDashBuildHubLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubLinkSaturationShare | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const touching = merged.filter(l => l.fromId === hubRegionId || l.toId === hubRegionId);
  if (!touching.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = touching.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    hubRegionId,
    touchingLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/meaningful-history-overlap-gap.ts ---
export interface NrDashMeaningfulHistoryOverlapGap {
  nsEntryCount: number;
  meaningfulEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived events. */
export function nrDashBuildMeaningfulHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const meaningfulTurns =
    lr?.state.derived.filter(d => d.significance === 'meaningful').map(d => d.turn).filter(t => Number.isFinite(t)) ??
    [];
  if (!meaningfulTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = meaningfulTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...meaningfulTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    meaningfulEntryCount: meaningfulTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/you-open-needs-skew-gap.ts ---
export interface NrDashYouOpenNeedsSkewGap {
  youRegionCount: number;
  youMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on player-owned snapshot rows. */
export function nrDashBuildYouOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashYouOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const you = snap.regions.filter(r => r.owner === 'you');
  if (!you.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const youMeanOpenNeeds = you.reduce((s, r) => s + r.openNeeds, 0) / you.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const youOpenNeeds = you.reduce((s, r) => s + r.openNeeds, 0);
  const youShare = you.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0 ? Math.abs(youOpenNeeds / totalOpenNeeds - youShare) : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(youMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    youRegionCount: you.length,
    youMeanOpenNeeds: Math.round(youMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}

// --- bundled from core/national-peak-tier-spread.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNationalPeakTierSpread {
  regionCount: number;
  minPeakRank: number;
  maxPeakRank: number;
  tierSpread: number;
}

/** Spread of peak open-need severity ordinals across LR regions (national view). */
export function nrDashBuildNationalPeakTierSpread(
  lr: LivingRegionsWorldView | null
): NrDashNationalPeakTierSpread | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peaks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const contributing = peaks.filter(p => p > 0);
  if (contributing.length <= 1) return null;
  const minPeakRank = Math.min(...contributing);
  const maxPeakRank = Math.max(...contributing);
  const tierSpread = maxPeakRank - minPeakRank;
  if (tierSpread <= 0) return null;
  return {
    regionCount: regionIds.length,
    minPeakRank,
    maxPeakRank,
    tierSpread: Math.round(tierSpread * 1000) / 1000,
  };
}

// --- bundled from core/chokepoint-corridor-saturation-share.ts ---
export interface NrDashChokepointCorridorSaturationShare {
  chokepointCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean dependency chokepoint pulse blend relative to the hottest chokepoint corridor. */
export function nrDashBuildChokepointCorridorSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashChokepointCorridorSaturationShare | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = rows.map(row => {
    const consumer = pulseById.get(row.consumerRegionId) ?? 0;
    const provider = pulseById.get(row.providerRegionId) ?? 0;
    return (consumer + provider) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    chokepointCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/lr-derived-snippet-source-gap.ts ---
export interface NrDashLrDerivedSnippetSourceGap {
  derivedSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR derived entries vs merged snapshot snippet labels at derived turns. */
export function nrDashBuildLrDerivedSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrDerivedSnippetSourceGap | null {
  if (!lr?.state.derived.length || !snap) return null;
  const derivedTurnSet = new Set(lr.state.derived.map(d => d.turn).filter(t => Number.isFinite(t)));
  if (!derivedTurnSet.size) return null;
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && derivedTurnSet.has(t)).length;
  return {
    derivedSourceCount: lr.state.derived.length,
    matchedSnippetCount,
    sourceGap: lr.state.derived.length - matchedSnippetCount,
  };
}

// --- bundled from core/peripheral-link-saturation-share.ts ---
export interface NrDashPeripheralLinkSaturationShare {
  hubRegionId: string | null;
  peripheralLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on non-hub links relative to the peak peripheral corridor blend. */
export function nrDashBuildPeripheralLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashPeripheralLinkSaturationShare | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const peripheral = merged.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  if (!peripheral.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = peripheral.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    hubRegionId,
    peripheralLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/ns-major-history-overlap-gap.ts ---
export interface NrDashNsMajorHistoryOverlapGap {
  nsEntryCount: number;
  majorEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR major derived events. */
export function nrDashBuildNsMajorHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashNsMajorHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const majorTurns =
    lr?.state.derived.filter(d => d.significance === 'major').map(d => d.turn).filter(t => Number.isFinite(t)) ?? [];
  if (!majorTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = majorTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...majorTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    majorEntryCount: majorTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/neutral-open-needs-skew-gap.ts ---
export interface NrDashNeutralOpenNeedsSkewGap {
  neutralRegionCount: number;
  neutralMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on neutral-owned snapshot rows. */
export function nrDashBuildNeutralOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const neutral = snap.regions.filter(r => r.owner === 'neutral');
  if (!neutral.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const neutralMeanOpenNeeds = neutral.reduce((s, r) => s + r.openNeeds, 0) / neutral.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const neutralOpenNeeds = neutral.reduce((s, r) => s + r.openNeeds, 0);
  const neutralShare = neutral.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0 ? Math.abs(neutralOpenNeeds / totalOpenNeeds - neutralShare) : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(neutralMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    neutralRegionCount: neutral.length,
    neutralMeanOpenNeeds: Math.round(neutralMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}

// --- bundled from core/national-open-needs-peak-spread.ts ---
export interface NrDashNationalOpenNeedsPeakSpread {
  regionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of regional open-need counts across the merged snapshot (national view). */
export function nrDashBuildNationalOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashNationalOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    regionCount: counts.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}

// --- bundled from core/dependency-link-saturation-share.ts ---
export interface NrDashDependencyLinkSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean dependency-link pulse blend relative to the hottest dependency corridor. */
export function nrDashBuildDependencyLinkSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashDependencyLinkSaturationShare | null {
  const depLinks = links.filter(l => l.kind === 'dependency');
  if (!depLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = depLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/ns-derived-snippet-source-gap.ts ---
export interface NrDashNsDerivedSnippetSourceGap {
  nsDerivedCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus bottleneck rows vs merged snapshot snippet labels. */
export function nrDashBuildNsDerivedSnippetSourceGap(
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashNsDerivedSnippetSourceGap | null {
  if (!ns || !snap) return null;
  const nsDerivedCount = ns.history.length + ns.bottlenecks.length;
  if (nsDerivedCount <= 0) return null;
  const nsTurnSet = new Set(ns.history.map(h => h.turn).filter(t => Number.isFinite(t)));
  if (ns.turn != null && Number.isFinite(ns.turn)) nsTurnSet.add(ns.turn);
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && nsTurnSet.has(t)).length;
  return {
    nsDerivedCount,
    matchedSnippetCount,
    sourceGap: nsDerivedCount - matchedSnippetCount,
  };
}

// --- bundled from core/rim-corridor-saturation-share.ts ---
export interface NrDashRimCorridorSaturationShare {
  hubRegionId: string | null;
  rimLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on non-hub land corridors relative to the peak rim corridor. */
export function nrDashBuildRimCorridorSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashRimCorridorSaturationShare | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const adjacency = nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT);
  const rimLinks = adjacency.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  if (!rimLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = rimLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    hubRegionId,
    rimLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/critical-history-overlap-gap.ts ---
export interface NrDashCriticalHistoryOverlapGap {
  nsEntryCount: number;
  criticalEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

function criticalOpenNeedCount(lr: LivingRegionsWorldView | null): number {
  if (!lr?.state.regions) return 0;
  return Object.values(lr.state.regions).reduce(
    (sum, reg) => sum + reg.needs.filter(n => n.status === 'open' && n.severity === 'critical').length,
    0
  );
}

/** Duplicate-turn pressure between NS history and LR critical open-need events at NS turn. */
export function nrDashBuildCriticalHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashCriticalHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const criticalCount = criticalOpenNeedCount(lr);
  if (criticalCount <= 0) return null;
  const anchorTurn = ns.turn ?? ns.history[ns.history.length - 1]!.turn;
  const criticalTurns = Array.from({ length: criticalCount }, () => anchorTurn);
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = criticalTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...criticalTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    criticalEntryCount: criticalCount,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/unknown-open-needs-skew-gap.ts ---
export interface NrDashUnknownOpenNeedsSkewGap {
  unknownRegionCount: number;
  unknownMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on unknown-owned snapshot rows. */
export function nrDashBuildUnknownOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const unknown = snap.regions.filter(r => r.owner === 'unknown');
  if (!unknown.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const unknownMeanOpenNeeds = unknown.reduce((s, r) => s + r.openNeeds, 0) / unknown.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const unknownOpenNeeds = unknown.reduce((s, r) => s + r.openNeeds, 0);
  const unknownShare = unknown.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0 ? Math.abs(unknownOpenNeeds / totalOpenNeeds - unknownShare) : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(unknownMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    unknownRegionCount: unknown.length,
    unknownMeanOpenNeeds: Math.round(unknownMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}

// --- bundled from core/regional-peak-severity-spread.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRegionalPeakSeveritySpread {
  regionCount: number;
  minPeakRank: number;
  maxPeakRank: number;
  peakSpread: number;
}

/** Spread of per-region peak open-need severity ordinals across LR regions. */
export function nrDashBuildRegionalPeakSeveritySpread(
  lr: LivingRegionsWorldView | null
): NrDashRegionalPeakSeveritySpread | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peaks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const contributing = peaks.filter(p => p > 0);
  if (contributing.length <= 1) return null;
  const minPeakRank = Math.min(...contributing);
  const maxPeakRank = Math.max(...contributing);
  const peakSpread = maxPeakRank - minPeakRank;
  if (peakSpread <= 0) return null;
  return {
    regionCount: regionIds.length,
    minPeakRank,
    maxPeakRank,
    peakSpread: Math.round(peakSpread * 1000) / 1000,
  };
}

// --- bundled from core/adjacency-link-saturation-share.ts ---
export interface NrDashAdjacencyLinkSaturationShare {
  linkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean land-adjacency pulse blend relative to the hottest adjacency corridor. */
export function nrDashBuildAdjacencyLinkSaturationShare(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashAdjacencyLinkSaturationShare | null {
  const adjLinks = links.filter(l => l.kind === 'adjacency');
  if (!adjLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = adjLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    linkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/combined-snippet-source-gap.ts ---
export interface NrDashCombinedSnippetSourceGap {
  combinedSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched NS history plus LR derived events vs merged snapshot snippet labels. */
export function nrDashBuildCombinedSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null,
  snap: NrDashAuthSnapshot | null
): NrDashCombinedSnippetSourceGap | null {
  if (!snap) return null;
  const nsCount = ns?.history.length ?? 0;
  const derivedCount = lr?.state.derived.length ?? 0;
  const combinedSourceCount = nsCount + derivedCount;
  if (combinedSourceCount <= 0) return null;
  const sourceTurns = new Set<number>();
  ns?.history.forEach(h => {
    if (Number.isFinite(h.turn)) sourceTurns.add(h.turn);
  });
  lr?.state.derived.forEach(d => {
    if (Number.isFinite(d.turn)) sourceTurns.add(d.turn);
  });
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && sourceTurns.has(t)).length;
  return {
    combinedSourceCount,
    matchedSnippetCount,
    sourceGap: combinedSourceCount - matchedSnippetCount,
  };
}

// --- bundled from core/hub-rim-pulse-asymmetry.ts ---
export interface NrDashHubRimPulseAsymmetry {
  hubRegionId: string | null;
  hubRimLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on map links with exactly one hub endpoint. */
export function nrDashBuildHubRimPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubRimPulseAsymmetry | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const hubRimLinks = merged.filter(
    l =>
      (l.fromId === hubRegionId && l.toId !== hubRegionId) ||
      (l.toId === hubRegionId && l.fromId !== hubRegionId)
  );
  if (!hubRimLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = hubRimLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    hubRegionId,
    hubRimLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/major-derived-history-overlap-gap.ts ---
export interface NrDashMajorDerivedHistoryOverlapGap {
  nsEntryCount: number;
  derivedEntryCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and all LR derived events. */
export function nrDashBuildMajorDerivedHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMajorDerivedHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const derivedTurns = lr?.state.derived.map(d => d.turn).filter(t => Number.isFinite(t)) ?? [];
  if (!derivedTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = derivedTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...derivedTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    derivedEntryCount: derivedTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
  };
}

// --- bundled from core/rival-open-needs-peak-spread.ts ---
export interface NrDashRivalOpenNeedsPeakSpread {
  rivalRegionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of open-need counts across rival-owned snapshot rows. */
export function nrDashBuildRivalOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const rival = snap.regions.filter(r => r.owner === 'rival');
  if (rival.length <= 1) return null;
  const counts = rival.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    rivalRegionCount: rival.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}

// --- bundled from core/national-severity-peak-concentration.ts ---
const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNationalSeverityPeakConcentration {
  regionCount: number;
  peakSeverityTotal: number;
  concentrationIndex: number;
}

/** National Herfindahl concentration of regional peak open-need severity ordinals. */
export function nrDashBuildNationalSeverityPeakConcentration(
  lr: LivingRegionsWorldView | null
): NrDashNationalSeverityPeakConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peaks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const peakSeverityTotal = peaks.reduce((s, n) => s + n, 0);
  if (peakSeverityTotal <= 0) return null;
  const contributing = peaks.filter(p => p > 0).length;
  if (contributing <= 1) return null;
  let concentrationIndex = 0;
  peaks.forEach(peak => {
    if (peak <= 0) return;
    const share = peak / peakSeverityTotal;
    concentrationIndex += share * share;
  });
  return {
    regionCount: regionIds.length,
    peakSeverityTotal,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}

// --- bundled from core/border-link-saturation-share.ts ---
export interface NrDashBorderLinkSaturationShare {
  borderRegionId: string | null;
  touchingLinkCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean pulse blend on border-touching links relative to the peak border corridor blend. */
export function nrDashBuildBorderLinkSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashBorderLinkSaturationShare | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!borderRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const touching = merged.filter(l => l.fromId === borderRegionId || l.toId === borderRegionId);
  if (!touching.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const blends = touching.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return (a + b) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    borderRegionId,
    touchingLinkCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}

// --- bundled from core/lr-major-snippet-source-gap.ts ---
export interface NrDashLrMajorSnippetSourceGap {
  majorSourceCount: number;
  matchedSnippetCount: number;
  sourceGap: number;
}

function snippetTurn(snippet: string): number | null {
  const match = snippet.match(/^R(\d+):/);
  if (!match) return null;
  const turn = Number(match[1]);
  return Number.isFinite(turn) ? turn : null;
}

/** Unmatched LR major derived entries vs merged snapshot snippet labels at major turns. */
export function nrDashBuildLrMajorSnippetSourceGap(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashLrMajorSnippetSourceGap | null {
  if (!lr?.state.derived.length || !snap) return null;
  const majors = lr.state.derived.filter(d => d.significance === 'major');
  if (!majors.length) return null;
  const majorTurnSet = new Set(majors.map(d => d.turn).filter(t => Number.isFinite(t)));
  const matchedSnippetCount = snap.historySnippets
    .map(snippetTurn)
    .filter((t): t is number => t != null && majorTurnSet.has(t)).length;
  return {
    majorSourceCount: majors.length,
    matchedSnippetCount,
    sourceGap: majors.length - matchedSnippetCount,
  };
}

// --- bundled from core/merged-rim-pulse-asymmetry.ts ---
export interface NrDashMergedRimPulseAsymmetry {
  hubRegionId: string | null;
  rimLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on merged map links not touching the primary hub. */
export function nrDashBuildMergedRimPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashMergedRimPulseAsymmetry | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  if (!hubRegionId || !ns) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const rimLinks = merged.filter(l => l.fromId !== hubRegionId && l.toId !== hubRegionId);
  if (!rimLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = rimLinks.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    hubRegionId,
    rimLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}

// --- bundled from core/meaningful-derived-history-overlap-gap.ts ---
export interface NrDashMeaningfulDerivedHistoryOverlapGap {
  nsEntryCount: number;
  meaningfulDerivedCount: number;
  sharedTurnCount: number;
  overlapGap: number;
}

/** Duplicate-turn pressure between NS history and LR meaningful derived pipeline. */
export function nrDashBuildMeaningfulDerivedHistoryOverlapGap(
  lr: LivingRegionsWorldView | null,
  ns: NationalSystemsState | null
): NrDashMeaningfulDerivedHistoryOverlapGap | null {
  if (!ns?.history.length) return null;
  const meaningfulTurns =
    lr?.state.derived.filter(d => d.significance === 'meaningful').map(d => d.turn).filter(t => Number.isFinite(t)) ??
    [];
  if (!meaningfulTurns.length) return null;
  const nsTurns = ns.history.map(h => h.turn).filter(t => Number.isFinite(t));
  const nsSet = new Set(nsTurns);
  const sharedTurnCount = meaningfulTurns.filter(t => nsSet.has(t)).length;
  const combined = [...nsTurns, ...meaningfulTurns];
  const uniqueTurnCount = new Set(combined).size;
  return {
    nsEntryCount: nsTurns.length,
    meaningfulDerivedCount: meaningfulTurns.length,
    sharedTurnCount,
    overlapGap: combined.length - uniqueTurnCount,
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

// --- bundled from ui/risk-exposure-concentration-card.tsx ---
export const NrDashRiskExposureConcentrationCard: React.FC<{
  conc: NrDashRiskExposureConcentration | null;
}> = ({ conc }) => {
  if (!conc) return null;
  return (
    <div className="rounded-lg border border-slate-600/50 p-3 text-xs" data-testid="nr-dash-risk-exposure-concentration">
      <div className="font-semibold mb-1">Risk exposure concentration</div>
      <div className="opacity-80">
        HHI {conc.concentrationIndex} · top {conc.topRegionId ?? '—'} ({Math.round(conc.topRegionShare * 100)}% of{' '}
        {conc.totalExposure})
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
  lrView: LivingRegionsWorldView | null;
  onAsk?: (q: string) => void;
}> = ({ snap, nsState, lrView, onAsk }) => (
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
    <NrDashRiskExposureConcentrationCard conc={nrDashBuildRiskExposureConcentration(snap)} />
    {(() => {
      const density = nrDashBuildHighRiskRegionDensity(snap);
      return density ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-risk-density">
          High-risk region density {density.density} · {density.highRiskRegionCount}/{density.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const conc = nrDashBuildHighRiskConcentration(snap);
      return conc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-risk-concentration">
          High-risk concentration {conc.concentrationIndex} · top {conc.topRegionId ?? '—'} ({conc.totalHighRisks} risks)
        </div>
      ) : null;
    })()}
    {(() => {
      const riskSpread = nrDashBuildHighRiskSpread(snap);
      return riskSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-risk-spread">
          High-risk spread σ {riskSpread.stdDev} · μ {riskSpread.meanHighRisks} across {riskSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    <NrDashOwnerStressGapCard gap={nrDashBuildOwnerStressGap(snap)} />
    <NrDashOwnedMomentumSkewCard skew={nrDashBuildOwnedMomentumSkew(snap)} />
    {(() => {
      const ownedShare = nrDashBuildOwnedRiskExposureShare(snap);
      return ownedShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-risk-share">
          Owned risk exposure share {ownedShare.ownedShare} · {ownedShare.ownedExposure}/{ownedShare.totalExposure} index
        </div>
      ) : null;
    })()}
    {(() => {
      const pressure = nrDashBuildNationalNeedsPressure(snap);
      return pressure ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-needs-pressure">
          National needs pressure {pressure.pressureIndex} · {pressure.totalOpenNeeds} open needs vs resilience{' '}
          {pressure.nationalResilience}
        </div>
      ) : null;
    })()}
    {(() => {
      const utilConc = nrDashBuildNetworkUtilConcentration(snap);
      return utilConc && nsState ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-util-concentration">
          Network util concentration {utilConc.concentrationIndex} · top {utilConc.topNetwork ?? '—'} (
          {Math.round(utilConc.topNetworkShare * 100)}%)
        </div>
      ) : null;
    })()}
    {(() => {
      const ownedRes = nrDashBuildOwnedResilienceShare(snap);
      return ownedRes ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-resilience-share">
          Owned resilience share {ownedRes.ownedShare} · {ownedRes.ownedResilience}/{ownedRes.totalResilience}
        </div>
      ) : null;
    })()}
    {(() => {
      const needsShare = nrDashBuildOwnedOpenNeedsShare(snap);
      return needsShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-open-needs-share">
          Owned open-needs share {needsShare.ownedShare} · {needsShare.ownedOpenNeeds}/{needsShare.totalOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const youNeedsSkew = nrDashBuildYouOpenNeedsSkewGap(snap);
      return youNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-you-open-needs-skew-gap">
          You open-needs skew gap {youNeedsSkew.openNeedsSkewGap} · ownership skew {youNeedsSkew.ownershipSkew} · you μ{' '}
          {youNeedsSkew.youMeanOpenNeeds} vs national μ {youNeedsSkew.nationalMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const skewGap = nrDashBuildOwnedOpenNeedsMomentumSkewGap(snap);
      return skewGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owned-open-needs-momentum-skew-gap">
          Owned open-needs momentum skew gap {skewGap.portfolioSkewGap} · needs Δ {skewGap.openNeedsGap} · momentum Δ{' '}
          {skewGap.momentumGap}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalShare = nrDashBuildRivalRiskExposureShare(snap);
      return rivalShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-risk-share">
          Rival risk exposure share {rivalShare.rivalShare} · {rivalShare.rivalExposure}/{rivalShare.totalExposure} index
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalNeedsSkew = nrDashBuildRivalOpenNeedsSkewGap(snap);
      return rivalNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-open-needs-skew-gap">
          Rival open-needs skew gap {rivalNeedsSkew.openNeedsSkewGap} · ownership skew {rivalNeedsSkew.ownershipSkew} · rival μ{' '}
          {rivalNeedsSkew.rivalMeanOpenNeeds} vs national μ {rivalNeedsSkew.nationalMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalNeedsPeak = nrDashBuildRivalOpenNeedsPeakSpread(snap);
      return rivalNeedsPeak && rivalNeedsPeak.peakSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-open-needs-peak-spread">
          Rival open-needs peak spread {rivalNeedsPeak.peakSpread} · {rivalNeedsPeak.minOpenNeeds}–{rivalNeedsPeak.maxOpenNeeds}{' '}
          across {rivalNeedsPeak.rivalRegionCount} rival regions
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralShare = nrDashBuildNeutralRiskExposureShare(snap);
      return neutralShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-risk-share">
          Neutral risk exposure share {neutralShare.neutralShare} · {neutralShare.neutralExposure}/{neutralShare.totalExposure}{' '}
          index
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralNeedsSkew = nrDashBuildNeutralOpenNeedsSkewGap(snap);
      return neutralNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-open-needs-skew-gap">
          Neutral open-needs skew gap {neutralNeedsSkew.openNeedsSkewGap} · ownership skew {neutralNeedsSkew.ownershipSkew} ·
          neutral μ {neutralNeedsSkew.neutralMeanOpenNeeds} vs national μ {neutralNeedsSkew.nationalMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const ownerConc = nrDashBuildOwnerConcentrationIndex(snap);
      return ownerConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owner-concentration">
          Owner concentration {ownerConc.concentrationIndex} · dominant {nrDashOwnerLabel(ownerConc.dominantOwner)} (
          {Math.round(ownerConc.dominantShare * 100)}%)
        </div>
      ) : null;
    })()}
    {(() => {
      const portfolioSpan = nrDashBuildOwnerPortfolioSpan(snap);
      return portfolioSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-owner-portfolio-span">
          Owner portfolio span {portfolioSpan.portfolioSpread} · min {portfolioSpan.minPortfolio} · max{' '}
          {portfolioSpan.maxPortfolio} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const derivedLoad = nrDashBuildDerivedEventLoad(lrView);
      return derivedLoad ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-derived-event-load">
          Derived event load {derivedLoad.eventCount} · {derivedLoad.majorCount} major · latest R{derivedLoad.latestTurn ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const criticalShare = nrDashBuildCriticalNeedsShare(lrView);
      return criticalShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-needs-share">
          Critical needs share {criticalShare.criticalShare} · {criticalShare.criticalCount}/{criticalShare.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const highShare = nrDashBuildHighNeedsShare(lrView);
      return highShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-needs-share">
          High needs share {highShare.highShare} · {highShare.highCount}/{highShare.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const lowShare = nrDashBuildLowNeedsShare(lrView);
      return lowShare ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-low-needs-share">
          Low needs share {lowShare.lowShare} · {lowShare.lowCount}/{lowShare.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const critRisk = nrDashBuildCriticalRiskShare(lrView);
      return critRisk ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-risk-share">
          Critical risk share {critRisk.criticalShare} · {critRisk.criticalCount}/{critRisk.riskCount} risks
        </div>
      ) : null;
    })()}
    {(() => {
      const modRisk = nrDashBuildModerateRiskShare(lrView);
      return modRisk ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-moderate-risk-share">
          Moderate risk share {modRisk.moderateShare} · {modRisk.moderateCount}/{modRisk.riskCount} risks
        </div>
      ) : null;
    })()}
    {(() => {
      const lowRisk = nrDashBuildLowRiskShare(lrView);
      return lowRisk ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-low-risk-share">
          Low risk share {lowRisk.lowShare} · {lowRisk.lowCount}/{lowRisk.riskCount} risks
        </div>
      ) : null;
    })()}
    {(() => {
      const bnGap = nrDashBuildNationalBottleneckGap(nsState);
      return bnGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-bottleneck-gap">
          National bottleneck gap {bnGap.gap} · national bars {bnGap.nationalBarTotal} vs list {bnGap.activeListCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const depGap = nrDashBuildNationalDependencyGap(nsState, snap);
      return depGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-dependency-gap">
          National dependency gap {depGap.gap} · list {depGap.listCount} vs snapshot {depGap.snapshotCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const needsSpread = nrDashBuildOpenNeedsSpread(snap);
      return needsSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-spread">
          Open needs spread σ {needsSpread.stdDev} · μ {needsSpread.meanOpenNeeds} across {needsSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const needsPeakSpread = nrDashBuildNationalOpenNeedsPeakSpread(snap);
      return needsPeakSpread && needsPeakSpread.peakSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-open-needs-peak-spread">
          National open-needs peak spread {needsPeakSpread.peakSpread} · {needsPeakSpread.minOpenNeeds}–
          {needsPeakSpread.maxOpenNeeds} across {needsPeakSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const modNeedsSpread = nrDashBuildModerateNeedsSpread(lrView);
      return modNeedsSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-moderate-needs-spread">
          Moderate needs spread σ {modNeedsSpread.stdDev} · μ {modNeedsSpread.meanModerateNeeds} across{' '}
          {modNeedsSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const critNeedsSpread = nrDashBuildCriticalNeedsSpread(lrView);
      return critNeedsSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-needs-spread-metric">
          Critical needs spread σ {critNeedsSpread.stdDev} · μ {critNeedsSpread.meanCriticalNeeds} across{' '}
          {critNeedsSpread.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const resGap = nrDashBuildNationalResilienceGap(snap);
      return resGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-resilience-gap">
          National resilience gap {resGap.gap} · national {resGap.nationalScore} vs regional μ {resGap.regionalMean}
        </div>
      ) : null;
    })()}
    {(() => {
      const utilGap = nrDashBuildNationalUtilizationGap(nsState);
      return utilGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-utilization-gap">
          National utilization gap {utilGap.gap} · national μ {utilGap.nationalMean} vs regional μ {utilGap.regionalMean}
        </div>
      ) : null;
    })()}
    {(() => {
      const condGap = nrDashBuildNationalConditionGap(nsState);
      return condGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-condition-gap">
          National condition gap {condGap.gap} · national rank μ {condGap.nationalMeanRank} vs regional μ{' '}
          {condGap.regionalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const historyLoad = nrDashBuildHistorySnippetLoad(snap);
      return historyLoad && historyLoad.snippetCount > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-snippet-load">
          History snippet load {historyLoad.loadRatio} · {historyLoad.snippetCount}/{historyLoad.maxSnippets} slots
        </div>
      ) : null;
    })()}
    {(() => {
      const histGap = nrDashBuildNationalHistoryGap(lrView, nsState, snap);
      return histGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-history-gap">
          National history gap {histGap.gap} · sources {histGap.sourceEventCount} vs surfaced {histGap.surfacedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const snippetGap = nrDashBuildNationalSnippetGap(snap);
      return snippetGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-snippet-gap">
          National snippet gap {snippetGap.unusedSlots} unused · {snippetGap.surfacedCount}/{snippetGap.maxSnippets} slots
        </div>
      ) : null;
    })()}
    {(() => {
      const saturation = nrDashBuildSnippetSaturationShare(snap);
      return saturation ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-snippet-saturation-share">
          Snippet saturation {saturation.saturationShare} · {saturation.snippetCount}/{saturation.maxSnippets} buffer
        </div>
      ) : null;
    })()}
    {(() => {
      const combinedGap = nrDashBuildCombinedDerivedHistoryGap(lrView, nsState, snap);
      return combinedGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-combined-derived-history-gap">
          Combined derived-history gap {combinedGap.gap} · sources {combinedGap.combinedSourceCount} vs surfaced{' '}
          {combinedGap.surfacedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const tierSpread = nrDashBuildOpenNeedsTierSpread(lrView);
      return tierSpread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-tier-spread">
          Open needs tier spread {tierSpread.tierSpread} · tier counts {tierSpread.minTierCount}–{tierSpread.maxTierCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const ownerSkew = nrDashBuildRegionalOwnerSkew(snap);
      return ownerSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-owner-skew">
          Regional owner skew {ownerSkew.ownershipSkew} · you {ownerSkew.youShare} · rival {ownerSkew.rivalShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralSkew = nrDashBuildNeutralOwnerPortfolioSkew(snap);
      return neutralSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-owner-portfolio-skew">
          Neutral owner portfolio skew {neutralSkew.portfolioSkew} · neutral {neutralSkew.neutralShare} · you{' '}
          {neutralSkew.youShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const tierConc = nrDashBuildMultiTierNeedsConcentration(lrView);
      return tierConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-multi-tier-needs-concentration">
          Multi-tier needs concentration {tierConc.concentrationIndex} · {tierConc.activeTierCount} tiers ·{' '}
          {tierConc.openNeedCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const satGap = nrDashBuildNationalSnippetSaturationGap(snap);
      return satGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-snippet-saturation-gap">
          National snippet saturation gap {satGap.saturationGap} · headroom {satGap.headroomShare} · {satGap.snippetCount}/
          {satGap.maxSnippets}
        </div>
      ) : null;
    })()}
    {(() => {
      const overlapGap = nrDashBuildLrNsHistoryOverlapGap(lrView, nsState);
      return overlapGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-ns-history-overlap-gap">
          LR–NS history overlap gap {overlapGap.overlapGap} · {overlapGap.totalEntries} entries · {overlapGap.uniqueTurnCount}{' '}
          unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const majorOverlap = nrDashBuildDerivedMajorOverlapGap(lrView, nsState);
      return majorOverlap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-derived-major-overlap-gap">
          Derived-major overlap gap {majorOverlap.overlapGap} · {majorOverlap.totalEntries} entries ·{' '}
          {majorOverlap.uniqueTurnCount} unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const nsHeadroom = nrDashBuildNsOnlySnippetHeadroom(snap);
      return nsHeadroom ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-only-snippet-headroom">
          NS-only snippet headroom {nsHeadroom.headroomSlots} · share {nsHeadroom.headroomShare} · {nsHeadroom.surfacedCount}/
          {nsHeadroom.nsSnippetCap}
        </div>
      ) : null;
    })()}
    {(() => {
      const unknownSkew = nrDashBuildUnknownOwnerPortfolioSkew(snap);
      return unknownSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-unknown-owner-portfolio-skew">
          Unknown owner portfolio skew {unknownSkew.portfolioSkew} · unknown {unknownSkew.unknownShare} · you{' '}
          {unknownSkew.youShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const unknownNeedsSkew = nrDashBuildUnknownOpenNeedsSkewGap(snap);
      return unknownNeedsSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-unknown-open-needs-skew-gap">
          Unknown open-needs skew gap {unknownNeedsSkew.openNeedsSkewGap} · ownership skew {unknownNeedsSkew.ownershipSkew}{' '}
          · unknown μ {unknownNeedsSkew.unknownMeanOpenNeeds}
        </div>
      ) : null;
    })()}
    {(() => {
      const highConc = nrDashBuildHighTierNeedsConcentration(lrView);
      return highConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-high-tier-needs-concentration">
          High-tier needs concentration {highConc.concentrationIndex} · {highConc.activeHighTierSlots} slots ·{' '}
          {highConc.highTierOpenCount} open
        </div>
      ) : null;
    })()}
    {(() => {
      const critConc = nrDashBuildCriticalTierNeedsConcentration(lrView);
      return critConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-tier-needs-concentration">
          Critical-tier needs concentration {critConc.concentrationIndex} · {critConc.criticalOpenCount} critical across{' '}
          {critConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const lrHeadroom = nrDashBuildLrOnlySnippetHeadroom(snap);
      return lrHeadroom ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-only-snippet-headroom">
          LR-only snippet headroom {lrHeadroom.headroomSlots} · share {lrHeadroom.headroomShare} · {lrHeadroom.surfacedCount}/
          {lrHeadroom.lrSnippetCap}
        </div>
      ) : null;
    })()}
    {(() => {
      const meaningfulOverlap = nrDashBuildMeaningfulDerivedOverlapGap(lrView, nsState);
      return meaningfulOverlap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-derived-overlap-gap">
          Meaningful-derived overlap gap {meaningfulOverlap.overlapGap} · {meaningfulOverlap.totalEntries} entries ·{' '}
          {meaningfulOverlap.uniqueTurnCount} unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalSkew = nrDashBuildRivalOwnerPortfolioSkew(snap);
      return rivalSkew ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-owner-portfolio-skew">
          Rival owner portfolio skew {rivalSkew.portfolioSkew} · rival {rivalSkew.rivalShare} · you {rivalSkew.youShare}
        </div>
      ) : null;
    })()}
    {(() => {
      const youMomGap = nrDashBuildYouOwnerMomentumGap(snap);
      return youMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-you-owner-momentum-gap">
          You-owner momentum gap {youMomGap.momentumGap} · owned μ {youMomGap.ownedMeanRank} · national μ{' '}
          {youMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalMomGap = nrDashBuildRivalOwnerMomentumGap(snap);
      return rivalMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-owner-momentum-gap">
          Rival-owner momentum gap {rivalMomGap.momentumGap} · rival μ {rivalMomGap.rivalMeanRank} · national μ{' '}
          {rivalMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const neutralMomGap = nrDashBuildNeutralOwnerMomentumGap(snap);
      return neutralMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-neutral-owner-momentum-gap">
          Neutral-owner momentum gap {neutralMomGap.momentumGap} · neutral μ {neutralMomGap.neutralMeanRank} · national μ{' '}
          {neutralMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const unknownMomGap = nrDashBuildUnknownOwnerMomentumGap(snap);
      return unknownMomGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-unknown-owner-momentum-gap">
          Unknown-owner momentum gap {unknownMomGap.momentumGap} · unknown μ {unknownMomGap.unknownMeanRank} · national μ{' '}
          {unknownMomGap.nationalMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const sevSpan = nrDashBuildOpenNeedsSeveritySpan(lrView);
      return sevSpan && sevSpan.severitySpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-open-needs-severity-span">
          Open needs severity span {sevSpan.severitySpread} · rank {sevSpan.minSeverityRank}–{sevSpan.maxSeverityRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const regionalPeakSpread = nrDashBuildRegionalPeakSeveritySpread(lrView);
      return regionalPeakSpread && regionalPeakSpread.peakSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-peak-severity-spread">
          Regional peak severity spread {regionalPeakSpread.peakSpread} · peak rank {regionalPeakSpread.minPeakRank}–
          {regionalPeakSpread.maxPeakRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const sevConc = nrDashBuildRegionalNeedsSeverityConcentration(lrView);
      return sevConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-needs-severity-concentration">
          Regional needs severity concentration {sevConc.concentrationIndex} · weight {sevConc.weightedSeverityTotal} across{' '}
          {sevConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const tierSpread = nrDashBuildNationalSeverityTierSpread(lrView);
      return tierSpread && tierSpread.tierSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-severity-tier-spread">
          National severity tier spread {tierSpread.tierSpread} · mean rank {tierSpread.minMeanRank}–{tierSpread.maxMeanRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const peakConc = nrDashBuildPeakSeverityConcentration(lrView);
      return peakConc && peakConc.concentrationIndex > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-peak-severity-concentration">
          Peak severity concentration {peakConc.concentrationIndex} · peak weight {peakConc.peakSeverityTotal} across{' '}
          {peakConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const nationalPeakConc = nrDashBuildNationalSeverityPeakConcentration(lrView);
      return nationalPeakConc && nationalPeakConc.concentrationIndex > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-severity-peak-concentration">
          National severity peak concentration {nationalPeakConc.concentrationIndex} · peak weight{' '}
          {nationalPeakConc.peakSeverityTotal}
        </div>
      ) : null;
    })()}
    {(() => {
      const peakTierSpread = nrDashBuildNationalPeakTierSpread(lrView);
      return peakTierSpread && peakTierSpread.tierSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-peak-tier-spread">
          National peak tier spread {peakTierSpread.tierSpread} · peak rank {peakTierSpread.minPeakRank}–
          {peakTierSpread.maxPeakRank}
        </div>
      ) : null;
    })()}
    {(() => {
      const lowConc = nrDashBuildLowTierNeedsConcentration(lrView);
      return lowConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-low-tier-needs-concentration">
          Low-tier needs concentration {lowConc.concentrationIndex} · {lowConc.lowOpenCount} low across {lowConc.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const modConc = nrDashBuildModerateTierNeedsConcentration(lrView);
      return modConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-moderate-tier-needs-concentration">
          Moderate-tier needs concentration {modConc.concentrationIndex} · {modConc.moderateOpenCount} moderate across{' '}
          {modConc.regionCount} regions
        </div>
      ) : null;
    })()}
    {(() => {
      const snippetOverlap = nrDashBuildMergedSnippetOverlapGap(snap);
      return snippetOverlap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-merged-snippet-overlap-gap">
          Merged snippet overlap gap {snippetOverlap.overlapGap} · {snippetOverlap.snippetCount} snippets ·{' '}
          {snippetOverlap.uniqueTurnCount} unique turns
        </div>
      ) : null;
    })()}
    {(() => {
      const snippetTurnSpan = nrDashBuildSnippetTurnSpan(snap);
      return snippetTurnSpan && snippetTurnSpan.turnSpread > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-snippet-turn-span">
          Snippet turn span {snippetTurnSpan.turnSpread} · R{snippetTurnSpan.minTurn}–R{snippetTurnSpan.maxTurn} ·{' '}
          {snippetTurnSpan.snippetCount} snippets
        </div>
      ) : null;
    })()}
    {(() => {
      const nationalDerivedGap = nrDashBuildNationalDerivedOverlapGap(lrView, nsState);
      return nationalDerivedGap && nationalDerivedGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-derived-overlap-gap">
          National derived overlap gap {nationalDerivedGap.overlapGap} · R{nationalDerivedGap.nationalTurn} · NS{' '}
          {nationalDerivedGap.nsEntryCount} · LR {nationalDerivedGap.derivedEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const histSnippetGap = nrDashBuildHistorySnippetTurnGap(lrView, nsState, snap);
      return histSnippetGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-snippet-turn-gap">
          History snippet turn gap {histSnippetGap.turnGap} · source {histSnippetGap.sourceTurnSpread} · snippet{' '}
          {histSnippetGap.snippetTurnSpread}
        </div>
      ) : null;
    })()}
    {(() => {
      const sourceGap = nrDashBuildSnippetSourceTurnGap(lrView, nsState, snap);
      return sourceGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-snippet-source-turn-gap">
          Snippet source turn gap {sourceGap.sourceTurnGap} · sources {sourceGap.sourceEventCount} · labels{' '}
          {sourceGap.snippetLabelCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const combinedSourceGap = nrDashBuildCombinedSnippetSourceGap(lrView, nsState, snap);
      return combinedSourceGap && combinedSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-combined-snippet-source-gap">
          Combined snippet source gap {combinedSourceGap.sourceGap} · sources {combinedSourceGap.combinedSourceCount} · matched{' '}
          {combinedSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsSourceGap = nrDashBuildNsSnippetSourceGap(nsState, snap);
      return nsSourceGap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-snippet-source-gap">
          NS snippet source gap {nsSourceGap.sourceGap} · history {nsSourceGap.nsSourceCount} · matched{' '}
          {nsSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsDerivedSourceGap = nrDashBuildNsDerivedSnippetSourceGap(nsState, snap);
      return nsDerivedSourceGap && nsDerivedSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-derived-snippet-source-gap">
          NS derived snippet source gap {nsDerivedSourceGap.sourceGap} · derived {nsDerivedSourceGap.nsDerivedCount} · matched{' '}
          {nsDerivedSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsSnippetOverlap = nrDashBuildNsHistorySnippetOverlapGap(nsState, snap);
      return nsSnippetOverlap && nsSnippetOverlap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-history-snippet-overlap-gap">
          NS history snippet overlap gap {nsSnippetOverlap.overlapGap} · history {nsSnippetOverlap.nsHistoryCount} · matches{' '}
          {nsSnippetOverlap.matchingSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const majorSnippetGap = nrDashBuildLrMajorSnippetOverlapGap(lrView, snap);
      return majorSnippetGap && majorSnippetGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-major-snippet-overlap-gap">
          LR major snippet overlap gap {majorSnippetGap.overlapGap} · {majorSnippetGap.majorEventCount} majors ·{' '}
          {majorSnippetGap.snippetTurnCount} snippet hits
        </div>
      ) : null;
    })()}
    {(() => {
      const lrMajorSourceGap = nrDashBuildLrMajorSnippetSourceGap(lrView, snap);
      return lrMajorSourceGap && lrMajorSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-major-snippet-source-gap">
          LR major snippet source gap {lrMajorSourceGap.sourceGap} · majors {lrMajorSourceGap.majorSourceCount} · matched{' '}
          {lrMajorSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const lrDerivedGap = nrDashBuildLrDerivedSnippetTurnGap(lrView, snap);
      return lrDerivedGap && lrDerivedGap.turnGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-derived-snippet-turn-gap">
          LR derived snippet turn gap {lrDerivedGap.turnGap} · derived {lrDerivedGap.derivedTurnSpread} · snippet{' '}
          {lrDerivedGap.lrSnippetTurnSpread}
        </div>
      ) : null;
    })()}
    {(() => {
      const lrDerivedSourceGap = nrDashBuildLrDerivedSnippetSourceGap(lrView, snap);
      return lrDerivedSourceGap && lrDerivedSourceGap.sourceGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-derived-snippet-source-gap">
          LR derived snippet source gap {lrDerivedSourceGap.sourceGap} · derived {lrDerivedSourceGap.derivedSourceCount} ·
          matched {lrDerivedSourceGap.matchedSnippetCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const majorHistGap = nrDashBuildMajorHistoryOverlapGap(lrView, nsState);
      return majorHistGap && majorHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-major-history-overlap-gap">
          Major-history overlap gap {majorHistGap.overlapGap} · shared turns {majorHistGap.sharedTurnCount} · NS{' '}
          {majorHistGap.nsEntryCount} · majors {majorHistGap.majorEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const nsMajorHistGap = nrDashBuildNsMajorHistoryOverlapGap(lrView, nsState);
      return nsMajorHistGap && nsMajorHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-major-history-overlap-gap">
          NS major history overlap gap {nsMajorHistGap.overlapGap} · shared {nsMajorHistGap.sharedTurnCount} · NS{' '}
          {nsMajorHistGap.nsEntryCount} · majors {nsMajorHistGap.majorEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const meaningfulHistGap = nrDashBuildMeaningfulHistoryOverlapGap(lrView, nsState);
      return meaningfulHistGap && meaningfulHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-history-overlap-gap">
          Meaningful-history overlap gap {meaningfulHistGap.overlapGap} · shared {meaningfulHistGap.sharedTurnCount} · NS{' '}
          {meaningfulHistGap.nsEntryCount} · meaningful {meaningfulHistGap.meaningfulEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const meaningfulDerivedHistGap = nrDashBuildMeaningfulDerivedHistoryOverlapGap(lrView, nsState);
      return meaningfulDerivedHistGap && meaningfulDerivedHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-derived-history-overlap-gap">
          Meaningful-derived history overlap gap {meaningfulDerivedHistGap.overlapGap} · shared{' '}
          {meaningfulDerivedHistGap.sharedTurnCount} · NS {meaningfulDerivedHistGap.nsEntryCount} · derived{' '}
          {meaningfulDerivedHistGap.meaningfulDerivedCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const criticalHistGap = nrDashBuildCriticalHistoryOverlapGap(lrView, nsState);
      return criticalHistGap && criticalHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-critical-history-overlap-gap">
          Critical-history overlap gap {criticalHistGap.overlapGap} · shared {criticalHistGap.sharedTurnCount} · NS{' '}
          {criticalHistGap.nsEntryCount} · critical {criticalHistGap.criticalEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const majorDerivedHistGap = nrDashBuildMajorDerivedHistoryOverlapGap(lrView, nsState);
      return majorDerivedHistGap && majorDerivedHistGap.overlapGap > 0 ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-major-derived-history-overlap-gap">
          Major-derived history overlap gap {majorDerivedHistGap.overlapGap} · shared {majorDerivedHistGap.sharedTurnCount} · NS{' '}
          {majorDerivedHistGap.nsEntryCount} · derived {majorDerivedHistGap.derivedEntryCount}
        </div>
      ) : null;
    })()}
    {(() => {
      const rivalSpan = nrDashBuildRivalPortfolioSpan(snap);
      return rivalSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-rival-portfolio-span">
          Rival portfolio span {rivalSpan.portfolioSpread} · you {rivalSpan.youCount} · rival {rivalSpan.rivalCount}
        </div>
      ) : null;
    })()}
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
    {(() => {
      const tiers = nrDashBuildDevelopmentTierDiversity(snap);
      return tiers ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dev-tier-diversity">
          Development tier diversity {tiers.diversityIndex} · {tiers.distinctTiers} tiers · dominant {tiers.dominantTier ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const tierSpan = nrDashBuildDevelopmentTierSpan(snap);
      return tierSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dev-tier-span">
          Development tier span {tierSpan.rankSpread} · rank {tierSpan.minRank}–{tierSpan.maxRank} across {tierSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const econSpan = nrDashBuildEconomyBandSpan(snap);
      return econSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-band-span">
          Economy band span {econSpan.rankSpread} · rank {econSpan.minRank}–{econSpan.maxRank} across {econSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const resSpan = nrDashBuildResilienceBandSpan(snap);
      return resSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-resilience-band-span">
          Resilience band span {resSpan.rankSpread} · rank {resSpan.minRank}–{resSpan.maxRank} across {resSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
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
    {(() => {
      const outboundConc = nrDashBuildDependencyOutboundConcentration(nsState);
      return outboundConc ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-outbound-concentration">
          Dependency outbound concentration {outboundConc.concentrationIndex} · top provider {outboundConc.topProviderId ?? '—'} (
          {Math.round(outboundConc.topProviderShare * 100)}%)
        </div>
      ) : null;
    })()}
    <NrDashEconomyMomentumDriftStrip
      meanAbsDrift={nrDashBuildEconomyMomentumDrift(snap)?.meanAbsDrift ?? 0}
      rows={nrDashTopEconomyMomentumDrift(snap, 3)}
    />
    {(() => {
      const drift = nrDashBuildEconomyResilienceDrift(snap);
      return drift ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-resilience-drift">
          Economy ↔ resilience drift μ |Δ| {drift.meanAbsDrift}
          {drift.outlierRegionId ? ` · outlier ${drift.outlierRegionId}` : ''}
          {nrDashTopEconomyResilienceDrift(snap, 2).length > 0
            ? ` · top ${nrDashTopEconomyResilienceDrift(snap, 2).map(r => r.regionId).join(', ')}`
            : ''}
        </div>
      ) : null;
    })()}
    {(() => {
      const spread = nrDashBuildDependencyImportanceSpread(nsState);
      return spread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-importance-spread">
          Dependency importance spread σ {spread.stdDev} · μ weight {spread.meanWeight} ({spread.edgeCount} edges)
        </div>
      ) : null;
    })()}
      {(() => {
        const load = nrDashBuildDependencyConsumerLoad(nsState);
        return load ? (
          <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-consumer-load">
            Dependency consumer load σ {load.stdDev} · μ {load.meanEdgesPerConsumer} edges/consumer ({load.edgeCount} edges)
          </div>
        ) : null;
      })()}
      {(() => {
        const consumerSpan = nrDashBuildDependencyConsumerSpan(nsState);
        return consumerSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-consumer-span">
            Dependency consumer span {consumerSpan.spanRatio} · {consumerSpan.distinctConsumers}/{consumerSpan.regionSlots}{' '}
            slots
          </div>
        ) : null;
      })()}
      {(() => {
        const providerSpan = nrDashBuildDependencyProviderSpan(nsState);
        return providerSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-provider-span">
            Dependency provider span {providerSpan.spanRatio} · {providerSpan.distinctProviders}/{providerSpan.regionSlots}{' '}
            slots
          </div>
        ) : null;
      })()}
      {(() => {
        const providers = nrDashBuildDependencyProviderLoad(nsState);
      return providers ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-provider-load">
          Dependency provider load σ {providers.stdDev} · μ {providers.meanEdgesPerProvider} edges/provider ({providers.edgeCount}{' '}
          edges)
        </div>
      ) : null;
    })()}
    {(() => {
      const span = nrDashBuildDependencyNetworkSpan(nsState);
      return span ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-dep-network-span">
          Dependency network span {span.distinctNetworks}/{span.edgeCount} · {span.networks.join(', ')}
        </div>
      ) : null;
    })()}
    {(() => {
      const spread = nrDashBuildConstraintProfileSpread(nsState);
      return spread ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-constraint-profile-spread">
          Constraint profile spread σ {spread.stdDev} · μ {spread.meanRegionsPerConstraint} across {spread.networkKinds} kinds
        </div>
      ) : null;
    })()}
    {(() => {
      const bandSpan = nrDashBuildConstraintBandSpan(nsState);
      return bandSpan ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-constraint-band-span">
          Constraint band span {bandSpan.rankSpread} · rank {bandSpan.minRank}–{bandSpan.maxRank} across {bandSpan.regionCount}{' '}
          regions
        </div>
      ) : null;
    })()}
    {(() => {
      const gap = nrDashBuildMomentumLeaderGap(snap, nsState);
      return gap ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-momentum-leader-gap">
          Momentum leader gap {gap.rankGap} · {gap.leaderRegionId} vs {gap.laggardRegionId}
        </div>
      ) : null;
    })()}
    {(() => {
      const bands = nrDashBuildMomentumBandDiversity(snap);
      return bands ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-momentum-band-diversity">
          Momentum band diversity {bands.diversityIndex} · {bands.distinctBands} bands · dominant {bands.dominantBand ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const econ = nrDashBuildEconomyBandDiversity(snap);
      return econ ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-economy-band-diversity">
          Economy band diversity {econ.diversityIndex} · {econ.distinctBands} bands · dominant {econ.dominantBand ?? '—'}
        </div>
      ) : null;
    })()}
    {(() => {
      const resBands = nrDashBuildResilienceBandDiversity(snap);
      return resBands ? (
        <div className="text-xs rounded border border-slate-600/50 p-2 mb-2" data-testid="nr-dash-resilience-band-diversity">
          Resilience band diversity {resBands.diversityIndex} · {resBands.distinctBands} bands · dominant{' '}
          {resBands.dominantBand ?? '—'}
        </div>
      ) : null;
    })()}
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
  const nationalSpread = nrDashBuildNationalNetworkUtilSpread(ns);
  const resilienceUtilGap = nrDashBuildResilienceUtilizationGap(ns);
  const constraintConc = nrDashBuildConstraintConcentration(ns);
  const bottleneckSpan = nrDashBuildBottleneckNetworkSpan(ns);
  const regionalHeadroom = nrDashBuildRegionalHeadroomSpread(ns);
  const heatStrained = nrDashBuildHeatStrainedDensity(ns);
  const chokeSpread = nrDashBuildChokepointScoreSpread(ns);
  const strainedBars = nrDashBuildNationalStrainedBarCount(
    nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null)
  );
  const stressConc = nrDashBuildNetworkStressConcentration(ns);
  const couplingSpread = nrDashBuildNetworkCouplingSpread(ns);
  const bottleneckLoad = nrDashBuildBottleneckSeverityLoad(ns);
  const heatStrainConc = nrDashBuildHeatRowStrainConcentration(ns);
  const nsSnap = nrDashBuildAuthSnapshot(ns.turn ?? 0, null, ns, null);
  const bottleneckDensity = nrDashBuildNationalBottleneckDensity(ns);
  const utilHeadroomDiv = nrDashBuildUtilHeadroomDivergence(nsSnap);
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
      {nationalSpread && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-network-spread">
          National network util spread σ {nationalSpread.stdDev} · μ {nationalSpread.meanUtilization}
          {nationalSpread.maxUtilNetwork ? ` · peak ${nationalSpread.maxUtilNetwork}` : ''}
        </div>
      )}
      {(() => {
        const condSpan = nrDashBuildNetworkConditionSpan(ns);
        return condSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-condition-span">
            Network condition span σ {condSpan.stdDev} · μ rank {condSpan.meanRank} · {condSpan.cellCount} cells
          </div>
        ) : null;
      })()}
      {resilienceUtilGap && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-resilience-util-gap">
          Resilience ↔ util gap μ |Δ| {resilienceUtilGap.meanAbsGap}
          {resilienceUtilGap.maxGapRegionId ? ` · max ${resilienceUtilGap.maxGapRegionId}` : ''}
        </div>
      )}
      {constraintConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-constraint-concentration">
          Primary constraint concentration {constraintConc.concentrationIndex} · dominant {constraintConc.dominantNetwork ?? '—'} (
          {Math.round(constraintConc.dominantShare * 100)}%)
        </div>
      )}
      {(() => {
        const bandSpan = nrDashBuildConstraintBandSpan(ns);
        return bandSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-constraint-band-span-networks">
            Constraint band span {bandSpan.rankSpread} · rank {bandSpan.minRank}–{bandSpan.maxRank} across {bandSpan.regionCount}{' '}
            regions
          </div>
        ) : null;
      })()}
      {bottleneckSpan && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-network-span">
          Bottleneck network span {bottleneckSpan.distinctNetworks}/{bottleneckSpan.bottleneckCount} ·{' '}
          {bottleneckSpan.networks.join(', ') || '—'}
        </div>
      )}
      {regionalHeadroom && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-regional-headroom-spread">
          Regional headroom spread σ {regionalHeadroom.stdDev} · μ {regionalHeadroom.meanHeadroom}
          {regionalHeadroom.tightestRegionId ? ` · tightest ${regionalHeadroom.tightestRegionId}` : ''}
        </div>
      )}
      {heatStrained && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-heat-strained-density">
          Heat strained+ density {heatStrained.density} · {heatStrained.strainedPlusCount}/{heatStrained.cellCount} cells
        </div>
      )}
      {chokeSpread && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-chokepoint-spread">
          Dependency chokepoint spread σ {chokeSpread.stdDev} · μ score {chokeSpread.meanScore}
        </div>
      )}
      {strainedBars && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-national-strained-bars">
          National strained+ bars {strainedBars.strainedPlusCount}/{strainedBars.networkCount}
        </div>
      )}
      {stressConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-stress-concentration">
          Peak util concentration {stressConc.concentrationIndex} · top {stressConc.topNetwork ?? '—'} (
          {Math.round(stressConc.topNetworkShare * 100)}%)
        </div>
      )}
      {couplingSpread && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-network-coupling-spread">
          Network coupling spread σ {couplingSpread.stdDev} · μ {couplingSpread.meanCoupling}
          {couplingSpread.maxCouplingRegionId ? ` · max ${couplingSpread.maxCouplingRegionId}` : ''}
        </div>
      )}
      {bottleneckLoad && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-severity-load">
          Bottleneck severity load {bottleneckLoad.weightedLoad} · {bottleneckLoad.activeCount} active
          {bottleneckLoad.topRegionId ? ` · top ${bottleneckLoad.topRegionId}` : ''}
        </div>
      )}
      {heatStrainConc && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-heat-row-strain-concentration">
          Heat row strain concentration {heatStrainConc.concentrationIndex} · top {heatStrainConc.topRegionId ?? '—'}
        </div>
      )}
      {bottleneckDensity && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-density">
          National bottleneck density {bottleneckDensity.density} · {bottleneckDensity.activeBottlenecks}/
          {bottleneckDensity.regionCount} regions
        </div>
      )}
      {utilHeadroomDiv && (
        <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-util-headroom-divergence">
          Util ↔ headroom divergence {utilHeadroomDiv.divergence} · util spread {utilHeadroomDiv.utilizationSpread} · headroom{' '}
          {utilHeadroomDiv.headroomSpread}
        </div>
      )}
      {(() => {
        const share = nrDashBuildBottleneckNetworkShare(ns);
        return share ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-network-share">
            Bottleneck network share {share.concentrationIndex} · top {share.topNetwork ?? '—'} (
            {Math.round(share.topNetworkShare * 100)}%)
          </div>
        ) : null;
      })()}
      {(() => {
        const critical = nrDashBuildDependencyCriticalShare(ns);
        return critical ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-critical-share">
            Dependency critical share {critical.criticalShare} · {critical.criticalCount}/{critical.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const highShare = nrDashBuildDependencyHighShare(ns);
        return highShare ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-high-share">
            Dependency high+ share {highShare.highPlusShare} · {highShare.highPlusCount}/{highShare.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const regionSpan = nrDashBuildBottleneckRegionSpan(ns);
        return regionSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-region-span">
            Bottleneck region span {regionSpan.spanRatio} · {regionSpan.distinctRegions}/{regionSpan.regionSlots} slots
          </div>
        ) : null;
      })()}
      {(() => {
        const sevSpan = nrDashBuildBottleneckSeveritySpan(ns);
        return sevSpan ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-severity-span">
            Bottleneck severity span {sevSpan.rankSpread} · ranks {sevSpan.minRank}–{sevSpan.maxRank} ·{' '}
            {sevSpan.distinctSeverities} levels
          </div>
        ) : null;
      })()}
      {(() => {
        const modShare = nrDashBuildDependencyModerateShare(ns);
        return modShare ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-moderate-share">
            Dependency moderate share {modShare.moderateShare} · {modShare.moderateCount}/{modShare.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const lowDep = nrDashBuildDependencyLowShare(ns);
        return lowDep ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-dep-low-share">
            Dependency low share {lowDep.lowShare} · {lowDep.lowCount}/{lowDep.edgeCount} edges
          </div>
        ) : null;
      })()}
      {(() => {
        const loadSpread = nrDashBuildBottleneckNetworkSeverityLoadSpread(ns);
        return loadSpread ? (
          <div className="text-xs rounded border border-slate-600/50 p-2" data-testid="nr-dash-bottleneck-network-severity-load-spread">
            Bottleneck network severity load spread σ {loadSpread.stdDev} · μ load {loadSpread.meanLoad} · top{' '}
            {loadSpread.topNetwork ?? '—'}
          </div>
        ) : null;
      })()}
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

export const NrDashTrendsTab: React.FC<{
  snap: NrDashAuthSnapshot;
  lrView: LivingRegionsWorldView | null;
  nsState: NationalSystemsState | null;
}> = ({ snap, lrView, nsState }) => {
  const movers = nrDashTopTrendMovers(snap.regions, 5);
  const coherence = nrDashBuildTrendCoherence(snap);
  const acceleration = nrDashBuildTrendAcceleration(snap);
  const historyVol = nrDashBuildMomentumHistoryVolatility(snap);
  const deltaSpread = nrDashBuildMomentumDeltaSpread(snap);
  const activitySpread = nrDashBuildActivityWeightSpread(snap);
  const paritySpread = nrDashBuildParityGapSpread(snap);
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
      {deltaSpread && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-delta-spread">
          <div className="font-semibold mb-1">Momentum delta spread</div>
          <div>
            μ |Δ| {deltaSpread.meanAbsDelta} · σ {deltaSpread.stdDev}
            {deltaSpread.outlierRegionId ? ` · mover ${deltaSpread.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {activitySpread && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-activity-weight-spread">
          <div className="font-semibold mb-1">Momentum activity weight spread</div>
          <div>
            μ {activitySpread.meanWeight} · σ {activitySpread.stdDev}
            {activitySpread.outlierRegionId ? ` · outlier ${activitySpread.outlierRegionId}` : ''}
          </div>
        </div>
      )}
      {paritySpread && (
        <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-parity-gap-spread">
          <div className="font-semibold mb-1">Parity gap spread</div>
          <div>
            μ |gap| {paritySpread.meanAbsGap} · σ {paritySpread.stdDev}
            {paritySpread.outlierRegionId ? ` · outlier ${paritySpread.outlierRegionId}` : ''}
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
      {(() => {
        const histSpan = nrDashBuildMomentumHistorySpan(snap);
        return histSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-history-span">
            <div className="font-semibold mb-1">Momentum history span</div>
            <div>
              length spread {histSpan.lengthSpread} · min {histSpan.minLength} · max {histSpan.maxLength} across{' '}
              {histSpan.regionCount} regions
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const bandSpan = nrDashBuildMomentumBandSpan(snap);
        return bandSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-momentum-band-span">
            <div className="font-semibold mb-1">Momentum band span</div>
            <div>
              rank spread {bandSpan.rankSpread} · min {bandSpan.minRank} · max {bandSpan.maxRank} across{' '}
              {bandSpan.regionCount} regions
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const erSpan = nrDashBuildEconomyResilienceSpan(snap);
        return erSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-economy-resilience-span">
            <div className="font-semibold mb-1">Economy ↔ resilience span</div>
            <div>
              drift spread {erSpan.driftSpread} · min {erSpan.minDrift} · max {erSpan.maxDrift} across {erSpan.regionCount}{' '}
              regions
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const turnSpan = nrDashBuildHistoryTurnSpan(lrView, nsState);
        return turnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-history-turn-span">
            <div className="font-semibold mb-1">History turn span</div>
            <div>
              turn spread {turnSpan.turnSpread} · min R{turnSpan.minTurn} · max R{turnSpan.maxTurn} · {turnSpan.eventCount}{' '}
              events
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const derivedTurnSpan = nrDashBuildDerivedEventTurnSpan(lrView);
        return derivedTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-derived-event-turn-span">
            <div className="font-semibold mb-1">Derived event turn span</div>
            <div>
              turn spread {derivedTurnSpan.turnSpread} · min R{derivedTurnSpan.minTurn} · max R{derivedTurnSpan.maxTurn} ·{' '}
              {derivedTurnSpan.eventCount} events
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const nsTurnSpan = nrDashBuildNsHistoryTurnSpan(nsState);
        return nsTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-ns-history-turn-span">
            <div className="font-semibold mb-1">NS history turn span</div>
            <div>
              turn spread {nsTurnSpan.turnSpread} · min R{nsTurnSpan.minTurn} · max R{nsTurnSpan.maxTurn} · {nsTurnSpan.eventCount}{' '}
              entries
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const lrTurnSpan = nrDashBuildLrHistoryTurnSpan(lrView);
        return lrTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-lr-history-turn-span">
            <div className="font-semibold mb-1">LR history turn span</div>
            <div>
              turn spread {lrTurnSpan.turnSpread} · min R{lrTurnSpan.minTurn} · max R{lrTurnSpan.maxTurn} · {lrTurnSpan.eventCount}{' '}
              major events
            </div>
          </div>
        ) : null;
      })()}
      {(() => {
        const meaningfulTurnSpan = nrDashBuildMeaningfulDerivedTurnSpan(lrView);
        return meaningfulTurnSpan ? (
          <div className="text-xs mb-3 rounded border border-slate-600/50 p-2" data-testid="nr-dash-meaningful-derived-turn-span">
            <div className="font-semibold mb-1">Meaningful derived turn span</div>
            <div>
              turn spread {meaningfulTurnSpan.turnSpread} · min R{meaningfulTurnSpan.minTurn} · max R{meaningfulTurnSpan.maxTurn} ·{' '}
              {meaningfulTurnSpan.eventCount} events
            </div>
          </div>
        ) : null;
      })()}
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
  const linkDispersion = useMemo(() => nrDashBuildLinkStressDispersion(nsState), [nsState]);
  const pulseConc = useMemo(() => nrDashBuildMapPulseConcentration(snap), [snap]);
  const hubConc = useMemo(() => nrDashBuildMapHubConcentration(nsState), [nsState]);
  return (
    <div className="space-y-3" data-testid="nr-dash-tab-map">
      <NrDashProvenanceStrip items={snap.provenance} />
      <RegionPositionMap nodes={nodes} links={links} focusRegionId={focusRegionId} onSelect={onFocusRegion} />
      <NrDashCorridorStressStrip corridors={nrDashTopCorridorStress(nsState, 4)} />
      {(() => {
        const conc = nrDashBuildCorridorStressConcentration(nsState);
        return conc ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-stress-concentration">
            Corridor stress concentration {conc.concentrationIndex} · top {conc.topCorridorKey ?? '—'} (
            {Math.round(conc.topCorridorShare * 100)}%)
          </p>
        ) : null;
      })()}
      {(() => {
        const borderConc = nrDashBuildBorderStressConcentration(nsState);
        return borderConc ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-stress-concentration">
            Border stress concentration {borderConc.concentrationIndex} · top {borderConc.topRegionId ?? '—'} (
            {Math.round(borderConc.topRegionShare * 100)}%)
          </p>
        ) : null;
      })()}
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
      {linkDispersion && linkDispersion.linkCount > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-link-stress-dispersion">
          Link stress dispersion: μ {Math.round(linkDispersion.meanStress * 100)}% · σ{' '}
          {Math.round(linkDispersion.stdDev * 100)}% across {linkDispersion.linkCount} links
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
      {pulseConc && pulseConc.concentrationIndex > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-concentration">
          Pulse concentration {pulseConc.concentrationIndex} · top {pulseConc.topRegionId ?? '—'} (
          {Math.round(pulseConc.topRegionShare * 100)}%)
        </p>
      )}
      {(() => {
        const pulseSpan = nrDashBuildMapPulseSpan(baseNodes);
        return pulseSpan && pulseSpan.intensitySpread > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-span">
            Map pulse span {pulseSpan.intensitySpread} · min {pulseSpan.minIntensity} · max {pulseSpan.maxIntensity} across{' '}
            {pulseSpan.regionCount} nodes
          </p>
        ) : null;
      })()}
      {(() => {
        const corridorPulse = nrDashBuildCorridorPulseSpread(nsState, baseNodes);
        return corridorPulse && corridorPulse.stdDev > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-pulse-spread">
            Corridor pulse spread σ {corridorPulse.stdDev} · μ blend {corridorPulse.meanBlend} · {corridorPulse.corridorCount}{' '}
            corridors
          </p>
        ) : null;
      })()}
      {(() => {
        const corridorAsym = nrDashBuildCorridorPulseAsymmetry(nsState, baseNodes);
        return corridorAsym && corridorAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-pulse-asymmetry">
            Corridor pulse asymmetry μΔ {corridorAsym.meanEndpointDelta} · peak {corridorAsym.maxEndpointDelta} ·{' '}
            {corridorAsym.corridorCount} corridors
          </p>
        ) : null;
      })()}
      {(() => {
        const corridorSat = nrDashBuildCorridorSaturationShare(nsState, baseNodes);
        return corridorSat && corridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-corridor-saturation-share">
            Corridor saturation share {corridorSat.saturationShare} · μ {corridorSat.meanBlend} · peak {corridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const linkPulse = nrDashBuildLinkPulseSpan(stressedLinks, baseNodes);
        return linkPulse && linkPulse.intensitySpread > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-link-pulse-span">
            Link pulse span {linkPulse.intensitySpread} · min {linkPulse.minBlend} · max {linkPulse.maxBlend} ·{' '}
            {linkPulse.linkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const linkAsym = nrDashBuildLinkPulseAsymmetry(stressedLinks, baseNodes);
        return linkAsym && linkAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-link-pulse-asymmetry">
            Link pulse asymmetry μΔ {linkAsym.meanEndpointDelta} · peak {linkAsym.maxEndpointDelta} · {linkAsym.linkCount}{' '}
            links
          </p>
        ) : null;
      })()}
      {(() => {
        const linkSat = nrDashBuildLinkSaturationShare(stressedLinks, baseNodes);
        return linkSat && linkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-link-saturation-share">
            Link saturation share {linkSat.saturationShare} · μ {linkSat.meanBlend} · peak {linkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubPulse = nrDashBuildHubPulseSpan(nsState, baseNodes);
        return hubPulse && hubPulse.intensitySpread > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-pulse-span">
            Hub pulse span {hubPulse.intensitySpread} · min {hubPulse.minIntensity} · max {hubPulse.maxIntensity} ·{' '}
            {hubPulse.hubRegionCount} hubs
          </p>
        ) : null;
      })()}
      {(() => {
        const hubAsym = nrDashBuildHubPulseAsymmetry(nsState, baseNodes);
        return hubAsym && hubAsym.asymmetryGap > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-pulse-asymmetry">
            Hub pulse asymmetry {hubAsym.asymmetryGap} · max {hubAsym.maxIntensity} vs μ {hubAsym.meanIntensity} ·{' '}
            {hubAsym.hubRegionCount} hubs
          </p>
        ) : null;
      })()}
      {(() => {
        const pulseGap = nrDashBuildPulseAsymmetryGap(baseNodes);
        return pulseGap && pulseGap.asymmetryGap > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-pulse-asymmetry-gap">
            Pulse asymmetry gap {pulseGap.asymmetryGap} · max {pulseGap.maxIntensity} vs μ {pulseGap.meanIntensity}
          </p>
        ) : null;
      })()}
      {(() => {
        const mapSat = nrDashBuildMapPulseSaturationShare(baseNodes);
        return mapSat && mapSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-map-pulse-saturation-share">
            Map pulse saturation share {mapSat.saturationShare} · μ {mapSat.meanIntensity} · peak {mapSat.peakIntensity}
          </p>
        ) : null;
      })()}
      {(() => {
        const depAsym = nrDashBuildDependencyPulseAsymmetry(stressedLinks, baseNodes);
        return depAsym && depAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-dependency-pulse-asymmetry">
            Dependency pulse asymmetry μΔ {depAsym.meanEndpointDelta} · peak {depAsym.maxEndpointDelta} · {depAsym.linkCount}{' '}
            deps
          </p>
        ) : null;
      })()}
      {(() => {
        const borderSat = nrDashBuildBorderCorridorSaturationShare(nsState);
        return borderSat && borderSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-corridor-saturation-share">
            Border corridor saturation share {borderSat.saturationShare} · μ {borderSat.meanStress} · peak{' '}
            {borderSat.peakStress}
          </p>
        ) : null;
      })()}
      {(() => {
        const borderPulseAsym = nrDashBuildBorderPulseAsymmetry(nsState, baseNodes);
        return borderPulseAsym && borderPulseAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-pulse-asymmetry">
            Border pulse asymmetry μΔ {borderPulseAsym.meanEndpointDelta} · peak {borderPulseAsym.maxEndpointDelta} ·{' '}
            {borderPulseAsym.borderLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const borderLinkSat = nrDashBuildBorderLinkSaturationShare(nsState, baseNodes);
        return borderLinkSat && borderLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-border-link-saturation-share">
            Border link saturation share {borderLinkSat.saturationShare} · border {borderLinkSat.borderRegionId ?? '—'} · μ{' '}
            {borderLinkSat.meanBlend} · peak {borderLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubCorridorSat = nrDashBuildHubCorridorSaturationShare(nsState);
        return hubCorridorSat && hubCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-corridor-saturation-share">
            Hub corridor saturation share {hubCorridorSat.saturationShare} · hub {hubCorridorSat.hubRegionId ?? '—'} · μ{' '}
            {hubCorridorSat.meanLinkStress} · peak {hubCorridorSat.peakLinkStress}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubLinkSat = nrDashBuildHubLinkSaturationShare(nsState, baseNodes);
        return hubLinkSat && hubLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-link-saturation-share">
            Hub link saturation share {hubLinkSat.saturationShare} · hub {hubLinkSat.hubRegionId ?? '—'} · μ{' '}
            {hubLinkSat.meanBlend} · peak {hubLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const peripheralLinkSat = nrDashBuildPeripheralLinkSaturationShare(nsState, baseNodes);
        return peripheralLinkSat && peripheralLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-peripheral-link-saturation-share">
            Peripheral link saturation share {peripheralLinkSat.saturationShare} · μ {peripheralLinkSat.meanBlend} · peak{' '}
            {peripheralLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const rimCorridorSat = nrDashBuildRimCorridorSaturationShare(nsState, baseNodes);
        return rimCorridorSat && rimCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-rim-corridor-saturation-share">
            Rim corridor saturation share {rimCorridorSat.saturationShare} · μ {rimCorridorSat.meanBlend} · peak{' '}
            {rimCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const hubRimAsym = nrDashBuildHubRimPulseAsymmetry(nsState, baseNodes);
        return hubRimAsym && hubRimAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-rim-pulse-asymmetry">
            Hub rim pulse asymmetry μΔ {hubRimAsym.meanEndpointDelta} · peak {hubRimAsym.maxEndpointDelta} ·{' '}
            {hubRimAsym.hubRimLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const hubPeripheralSat = nrDashBuildHubPeripheralSaturationShare(nsState);
        return hubPeripheralSat && hubPeripheralSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-hub-peripheral-saturation-share">
            Hub peripheral saturation share {hubPeripheralSat.saturationShare} · rim μ {hubPeripheralSat.peripheralMeanStress}{' '}
            · hub μ {hubPeripheralSat.hubMeanStress}
          </p>
        ) : null;
      })()}
      {(() => {
        const adjAsym = nrDashBuildAdjacencyPulseAsymmetry(stressedLinks, baseNodes);
        return adjAsym && adjAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-adjacency-pulse-asymmetry">
            Adjacency pulse asymmetry μΔ {adjAsym.meanEndpointDelta} · peak {adjAsym.maxEndpointDelta} · {adjAsym.linkCount}{' '}
            links
          </p>
        ) : null;
      })()}
      {(() => {
        const peripheralAsym = nrDashBuildPeripheralPulseAsymmetry(nsState, baseNodes);
        return peripheralAsym && peripheralAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-peripheral-pulse-asymmetry">
            Peripheral pulse asymmetry μΔ {peripheralAsym.meanEndpointDelta} · peak {peripheralAsym.maxEndpointDelta} ·{' '}
            {peripheralAsym.peripheralLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const mergedRimAsym = nrDashBuildMergedRimPulseAsymmetry(nsState, baseNodes);
        return mergedRimAsym && mergedRimAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-merged-rim-pulse-asymmetry">
            Merged rim pulse asymmetry μΔ {mergedRimAsym.meanEndpointDelta} · peak {mergedRimAsym.maxEndpointDelta} ·{' '}
            {mergedRimAsym.rimLinkCount} links
          </p>
        ) : null;
      })()}
      {(() => {
        const depCorridorSat = nrDashBuildDependencyCorridorSaturationShare(stressedLinks, baseNodes);
        return depCorridorSat && depCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-dependency-corridor-saturation-share">
            Dependency corridor saturation share {depCorridorSat.saturationShare} · μ {depCorridorSat.meanBlend} · peak{' '}
            {depCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const depLinkSat = nrDashBuildDependencyLinkSaturationShare(stressedLinks, baseNodes);
        return depLinkSat && depLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-dependency-link-saturation-share">
            Dependency link saturation share {depLinkSat.saturationShare} · μ {depLinkSat.meanBlend} · peak{' '}
            {depLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const adjCorridorSat = nrDashBuildAdjacencyCorridorSaturationShare(stressedLinks, baseNodes);
        return adjCorridorSat && adjCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-adjacency-corridor-saturation-share">
            Adjacency corridor saturation share {adjCorridorSat.saturationShare} · μ {adjCorridorSat.meanBlend} · peak{' '}
            {adjCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const adjLinkSat = nrDashBuildAdjacencyLinkSaturationShare(stressedLinks, baseNodes);
        return adjLinkSat && adjLinkSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-adjacency-link-saturation-share">
            Adjacency link saturation share {adjLinkSat.saturationShare} · μ {adjLinkSat.meanBlend} · peak {adjLinkSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const mergedCorridorSat = nrDashBuildMergedCorridorSaturationShare(stressedLinks, baseNodes);
        return mergedCorridorSat && mergedCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-merged-corridor-saturation-share">
            Merged corridor saturation share {mergedCorridorSat.saturationShare} · μ {mergedCorridorSat.meanBlend} · peak{' '}
            {mergedCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {(() => {
        const chokeAsym = nrDashBuildChokepointPulseAsymmetry(nsState, baseNodes);
        return chokeAsym && chokeAsym.maxEndpointDelta > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-chokepoint-pulse-asymmetry">
            Chokepoint pulse asymmetry μΔ {chokeAsym.meanEndpointDelta} · peak {chokeAsym.maxEndpointDelta} ·{' '}
            {chokeAsym.chokepointCount} deps
          </p>
        ) : null;
      })()}
      {(() => {
        const chokeCorridorSat = nrDashBuildChokepointCorridorSaturationShare(nsState, baseNodes);
        return chokeCorridorSat && chokeCorridorSat.saturationShare > 0 ? (
          <p className="text-[10px] opacity-75" data-testid="nr-dash-chokepoint-corridor-saturation-share">
            Chokepoint corridor saturation share {chokeCorridorSat.saturationShare} · μ {chokeCorridorSat.meanBlend} · peak{' '}
            {chokeCorridorSat.peakBlend}
          </p>
        ) : null;
      })()}
      {hubConc && hubConc.concentrationIndex > 0 && (
        <p className="text-[10px] opacity-75" data-testid="nr-dash-map-hub-concentration">
          Hub score concentration {hubConc.concentrationIndex} · top {hubConc.topRegionId ?? '—'} (
          {Math.round(hubConc.topRegionShare * 100)}%)
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
            <NrDashOverviewTab snap={snap} nsState={nsState} lrView={lrView} onAsk={onAsk} />
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
            <NrDashTrendsTab snap={snap} lrView={lrView} nsState={nsState} />
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

  check('a23_risk_exposure_conc', 'Risk exposure concentration peaks on NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildRiskExposureConcentration(snap)!;
    return conc.topRegionId === 'NSW' && conc.concentrationIndex === 0.16;
  });

  check('a23_high_risk_density', 'High-risk region density counts one NSW hotspot', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const density = nrDashBuildHighRiskRegionDensity(snap)!;
    return density.highRiskRegionCount === 1 && density.density === 0.125;
  });

  check('a23_dep_outbound_conc', 'Dependency outbound concentration peaks on QLD fixture', () => {
    const conc = nrDashBuildDependencyOutboundConcentration(createAgent23NsFixture())!;
    return conc.edgeCount === 3 && conc.topProviderId === 'QLD' && conc.concentrationIndex > 0;
  });

  check('a23_national_util_spread', 'National network util spread spans five networks', () => {
    const spread = nrDashBuildNationalNetworkUtilSpread(createAgent23NsFixture())!;
    return spread.networkCount === 5 && spread.stdDev > 0 && spread.maxUtilNetwork === 'digital';
  });

  check('a23_resilience_util_gap', 'Resilience utilization gap covers eight NS regions', () => {
    const gap = nrDashBuildResilienceUtilizationGap(createAgent23NsFixture())!;
    return gap.sampleSize === 8 && gap.meanAbsGap > 0 && gap.maxGapRegionId != null;
  });

  check('a23_link_stress_disp', 'Link stress dispersion aggregates map links', () => {
    const disp = nrDashBuildLinkStressDispersion(createAgent23NsFixture())!;
    return disp.linkCount >= 10 && disp.stdDev >= 0 && disp.hottestLinkId != null;
  });

  check('a23_momentum_delta_spread', 'Momentum delta spread covers eight LR regions', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildMomentumDeltaSpread(snap)!;
    return spread.sampleSize === 8 && spread.meanAbsDelta === 0.15 && spread.stdDev === 0;
  });

  check('a23_constraint_conc', 'Primary constraint concentration is uniform freight fixture', () => {
    const conc = nrDashBuildConstraintConcentration(createAgent23NsFixture())!;
    return conc.regionCount === 8 && conc.dominantNetwork === 'freight' && conc.concentrationIndex === 1;
  });

  check('a23_bottleneck_span', 'Bottleneck network span counts freight on fixture', () => {
    const span = nrDashBuildBottleneckNetworkSpan(createAgent23NsFixture())!;
    return span.bottleneckCount === 1 && span.distinctNetworks === 1 && span.networks[0] === 'freight';
  });

  check('a23_dep_importance_spread', 'Dependency importance spread spans three edges', () => {
    const spread = nrDashBuildDependencyImportanceSpread(createAgent23NsFixture())!;
    return spread.edgeCount === 3 && spread.stdDev > 0 && spread.maxWeight === 1.5;
  });

  check('a23_pulse_conc', 'Map pulse concentration peaks on NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildMapPulseConcentration(snap)!;
    return conc.regionCount === 8 && conc.topRegionId === 'NSW' && conc.concentrationIndex > 0.12;
  });

  check('a23_econ_resilience_drift', 'Economy resilience drift covers merged NS rows', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const drift = nrDashBuildEconomyResilienceDrift(snap)!;
    return drift.rows.length === 8 && drift.meanAbsDrift === 0.2;
  });

  check('a23_owned_risk_share', 'Owned risk exposure share tracks NSW player row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const share = nrDashBuildOwnedRiskExposureShare(snap)!;
    return share.ownedRegionCount === 1 && share.ownedShare === 0.3;
  });

  check('a23_corridor_stress_conc', 'Corridor stress concentration ranks NSW corridors', () => {
    const conc = nrDashBuildCorridorStressConcentration(createAgent23NsFixture())!;
    return conc.corridorCount >= 8 && conc.concentrationIndex > 0 && (conc.topCorridorKey ?? '').includes('NSW');
  });

  check('a23_dev_tier_diversity', 'Development tier diversity splits fixture tiers', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const tiers = nrDashBuildDevelopmentTierDiversity(snap)!;
    return tiers.distinctTiers === 2 && tiers.diversityIndex === 0.5;
  });

  check('a23_regional_headroom_spread', 'Regional headroom spread marks NSW tightest', () => {
    const spread = nrDashBuildRegionalHeadroomSpread(createAgent23NsFixture())!;
    return spread.regionCount === 8 && spread.stdDev > 0 && spread.tightestRegionId === 'NSW';
  });

  check('a23_national_needs_pressure', 'National needs pressure uses merged resilience', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const pressure = nrDashBuildNationalNeedsPressure(snap)!;
    return pressure.totalOpenNeeds === 8 && pressure.nationalResilience === 58 && pressure.pressureIndex === 1.379;
  });

  check('a23_dep_consumer_load', 'Dependency consumer load covers three consumers', () => {
    const load = nrDashBuildDependencyConsumerLoad(createAgent23NsFixture())!;
    return load.edgeCount === 3 && load.meanEdgesPerConsumer === 1 && load.stdDev === 0;
  });

  check('a23_activity_weight_spread', 'Activity weight spread covers eight map nodes', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildActivityWeightSpread(snap)!;
    return spread.regionCount === 8 && spread.meanWeight > 0 && spread.outlierRegionId === 'NSW';
  });

  check('a23_parity_gap_spread', 'Parity gap spread is flat on uniform fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const spread = nrDashBuildParityGapSpread(snap)!;
    return spread.sampleSize === 8 && spread.meanAbsGap === 15 && spread.stdDev === 0;
  });

  check('a23_heat_strained_density', 'Heat strained density counts NSW and VIC cells', () => {
    const density = nrDashBuildHeatStrainedDensity(createAgent23NsFixture())!;
    return density.cellCount === 40 && density.strainedPlusCount === 2 && density.density === 0.05;
  });

  check('a23_network_util_conc', 'Network util concentration peaks on digital bar', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const conc = nrDashBuildNetworkUtilConcentration(snap)!;
    return conc.networkCount === 5 && conc.topNetwork === 'digital' && conc.concentrationIndex > 0.2;
  });

  check('a23_dep_provider_load', 'Dependency provider load covers three providers', () => {
    const load = nrDashBuildDependencyProviderLoad(createAgent23NsFixture())!;
    return load.edgeCount === 3 && load.meanEdgesPerProvider === 1 && load.stdDev === 0;
  });

  check('a23_owned_resilience_share', 'Owned resilience share tracks NSW player portfolio', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), { NSW: 'you' })!;
    const share = nrDashBuildOwnedResilienceShare(snap)!;
    return share.ownedRegionCount === 1 && share.ownedShare === 0.125;
  });

  check('a23_momentum_band_diversity', 'Momentum band diversity is uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const bands = nrDashBuildMomentumBandDiversity(snap)!;
    return bands.distinctBands === 1 && bands.diversityIndex === 1;
  });

  check('a23_economy_band_diversity', 'Economy band diversity is uniform moderate fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const econ = nrDashBuildEconomyBandDiversity(snap)!;
    return econ.distinctBands === 1 && econ.diversityIndex === 1;
  });

  check('a23_map_hub_conc', 'Map hub concentration peaks on SA fixture', () => {
    const conc = nrDashBuildMapHubConcentration(createAgent23NsFixture())!;
    return conc.topRegionId === 'SA' && conc.concentrationIndex > 0.05;
  });

  check('a23_chokepoint_spread', 'Chokepoint score spread spans three dependencies', () => {
    const spread = nrDashBuildChokepointScoreSpread(createAgent23NsFixture())!;
    return spread.edgeCount === 3 && spread.stdDev > 0 && spread.maxScore > spread.meanScore;
  });

  check('a23_owned_open_needs_share', 'Owned open needs share tracks NSW player row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const share = nrDashBuildOwnedOpenNeedsShare(snap)!;
    return share.ownedRegionCount === 1 && share.ownedShare === 0.125;
  });

  check('a23_national_strained_bars', 'National strained bar count is zero on healthy fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const bars = nrDashBuildNationalStrainedBarCount(snap)!;
    return bars.networkCount === 5 && bars.strainedPlusCount === 0;
  });

  check('a23_history_snippet_load', 'History snippet load merges NS and LR majors', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const load = nrDashBuildHistorySnippetLoad(snap)!;
    return load.snippetCount === 2 && load.loadRatio === 0.25;
  });

  check('a23_network_stress_conc', 'Network stress concentration peaks on freight', () => {
    const conc = nrDashBuildNetworkStressConcentration(createAgent23NsFixture())!;
    return conc.topNetwork === 'freight' && conc.concentrationIndex > 0.2;
  });

  check('a23_network_coupling_spread', 'Network coupling spread marks NSW max region', () => {
    const spread = nrDashBuildNetworkCouplingSpread(createAgent23NsFixture())!;
    return spread.regionCount === 8 && spread.stdDev > 0 && spread.maxCouplingRegionId === 'NSW';
  });

  check('a23_resilience_band_diversity', 'Resilience band diversity is uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const bands = nrDashBuildResilienceBandDiversity(snap)!;
    return bands.distinctBands === 1 && bands.diversityIndex === 1;
  });

  check('a23_bottleneck_severity_load', 'Bottleneck severity load counts NSW meaningful', () => {
    const load = nrDashBuildBottleneckSeverityLoad(createAgent23NsFixture())!;
    return load.activeCount === 1 && load.weightedLoad === 1 && load.topRegionId === 'NSW';
  });

  check('a23_rival_risk_share', 'Rival risk exposure share tracks NSW rival row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const share = nrDashBuildRivalRiskExposureShare(snap)!;
    return share.rivalRegionCount === 1 && share.rivalShare === 0.3;
  });

  check('a23_heat_row_strain_conc', 'Heat row strain concentration splits NSW and VIC', () => {
    const conc = nrDashBuildHeatRowStrainConcentration(createAgent23NsFixture())!;
    return conc.concentrationIndex === 0.5 && conc.topRegionShare === 0.5;
  });

  check('a23_high_risk_conc', 'High-risk concentration peaks on NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const conc = nrDashBuildHighRiskConcentration(snap)!;
    return conc.topRegionId === 'NSW' && conc.concentrationIndex === 1;
  });

  check('a23_dep_network_span', 'Dependency network span covers three networks', () => {
    const span = nrDashBuildDependencyNetworkSpan(createAgent23NsFixture())!;
    return span.edgeCount === 3 && span.distinctNetworks === 3;
  });

  check('a23_bottleneck_density', 'National bottleneck density counts one active', () => {
    const density = nrDashBuildNationalBottleneckDensity(createAgent23NsFixture())!;
    return density.activeBottlenecks === 1 && density.density === 0.125;
  });

  check('a23_neutral_risk_share', 'Neutral risk exposure share tracks VIC neutral row', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const share = nrDashBuildNeutralRiskExposureShare(snap)!;
    return share.neutralRegionCount === 1 && share.neutralShare === 0.1;
  });

  check('a23_util_headroom_div', 'Util headroom divergence compares national spreads', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const div = nrDashBuildUtilHeadroomDivergence(snap)!;
    return div.utilizationSpread === 0.2 && div.headroomSpread === 0.2 && div.divergence === 0;
  });

  check('a23_border_stress_conc', 'Border stress concentration peaks on NSW fixture', () => {
    const conc = nrDashBuildBorderStressConcentration(createAgent23NsFixture())!;
    return conc.topRegionId === 'NSW' && conc.concentrationIndex > 0.1;
  });

  check('a23_constraint_profile_spread', 'Constraint profile spread is zero on uniform freight fixture', () => {
    const spread = nrDashBuildConstraintProfileSpread(createAgent23NsFixture())!;
    return spread.networkKinds === 1 && spread.stdDev === 0;
  });

  check('a23_bottleneck_network_share', 'Bottleneck network share is all freight on fixture', () => {
    const share = nrDashBuildBottleneckNetworkShare(createAgent23NsFixture())!;
    return share.topNetwork === 'freight' && share.concentrationIndex === 1;
  });

  check('a23_dep_critical_share', 'Dependency critical share counts one of three edges', () => {
    const share = nrDashBuildDependencyCriticalShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.criticalCount === 1 && share.criticalShare > 0.3;
  });

  check('a23_momentum_leader_gap', 'Momentum leader gap is zero when all bands stable', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildMomentumLeaderGap(snap, createAgent23NsFixture())!;
    return gap.rankGap === 0 && gap.leaderRegionId.length > 0;
  });

  check('a23_derived_event_load', 'Derived event load counts one major LR event', () => {
    const load = nrDashBuildDerivedEventLoad(createAgent23LrFixture())!;
    return load.eventCount === 1 && load.majorCount === 1 && load.latestTurn === 4;
  });

  check('a23_owner_concentration', 'Owner concentration tracks rival portfolio on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const idx = nrDashBuildOwnerConcentrationIndex(snap)!;
    return idx.dominantOwner === 'unknown' && idx.concentrationIndex > 0.75;
  });

  check('a23_open_needs_spread', 'Open needs spread is zero on uniform fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildOpenNeedsSpread(snap)!;
    return spread.totalOpenNeeds === 8 && spread.stdDev === 0;
  });

  check('a23_critical_needs_share', 'Critical needs share is zero on moderate fixture', () => {
    const share = nrDashBuildCriticalNeedsShare(createAgent23LrFixture())!;
    return share.openNeedCount === 8 && share.criticalCount === 0 && share.criticalShare === 0;
  });

  check('a23_national_resilience_gap', 'National resilience gap compares NS score to regional mean', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNationalResilienceGap(snap)!;
    return gap.nationalScore === 58 && gap.regionalMean === 55 && gap.gap === 3;
  });

  check('a23_dep_high_share', 'Dependency high share counts two of three edges', () => {
    const share = nrDashBuildDependencyHighShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.highPlusCount === 2 && share.highPlusShare > 0.6;
  });

  check('a23_bottleneck_region_span', 'Bottleneck region span touches NSW only', () => {
    const span = nrDashBuildBottleneckRegionSpan(createAgent23NsFixture())!;
    return span.distinctRegions === 1 && span.spanRatio === 0.125;
  });

  check('a23_momentum_history_span', 'Momentum history span is zero on uniform lengths', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildMomentumHistorySpan(snap)!;
    return span.minLength === 3 && span.maxLength === 3 && span.lengthSpread === 0;
  });

  check('a23_high_risk_spread', 'High-risk spread peaks on NSW-only fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const spread = nrDashBuildHighRiskSpread(snap)!;
    return spread.totalHighRisks === 1 && spread.stdDev > 0.3 && spread.meanHighRisks === 0.125;
  });

  check('a23_high_needs_share', 'High needs share is zero on moderate fixture', () => {
    const share = nrDashBuildHighNeedsShare(createAgent23LrFixture())!;
    return share.openNeedCount === 8 && share.highCount === 0 && share.highShare === 0;
  });

  check('a23_national_util_gap', 'National utilization gap compares NS national and regional means', () => {
    const gap = nrDashBuildNationalUtilizationGap(createAgent23NsFixture())!;
    return gap.nationalMean === 0.45 && gap.regionalMean === 0.425 && gap.gap === 0.025;
  });

  check('a23_dep_moderate_share', 'Dependency moderate share counts one of three edges', () => {
    const share = nrDashBuildDependencyModerateShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.moderateCount === 1 && share.moderateShare > 0.3;
  });

  check('a23_bottleneck_severity_span', 'Bottleneck severity span is zero on single meaningful bottleneck', () => {
    const span = nrDashBuildBottleneckSeveritySpan(createAgent23NsFixture())!;
    return span.activeCount === 1 && span.rankSpread === 0 && span.minRank === 1;
  });

  check('a23_dev_tier_span', 'Development tier span spans developing and advanced fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildDevelopmentTierSpan(snap)!;
    return span.rankSpread === 1 && span.regionCount === 8;
  });

  check('a23_low_needs_share', 'Low needs share is zero on moderate fixture', () => {
    const share = nrDashBuildLowNeedsShare(createAgent23LrFixture())!;
    return share.openNeedCount === 8 && share.lowCount === 0 && share.lowShare === 0;
  });

  check('a23_critical_risk_share', 'Critical risk share is zero on high-only NSW fixture', () => {
    const share = nrDashBuildCriticalRiskShare(createAgent23LrFixture())!;
    return share.riskCount === 1 && share.criticalCount === 0 && share.criticalShare === 0;
  });

  check('a23_national_condition_gap', 'National condition gap compares NS national and regional ranks', () => {
    const gap = nrDashBuildNationalConditionGap(createAgent23NsFixture())!;
    return gap.nationalMeanRank === 1 && gap.regionalMeanRank === 1.125 && gap.gap === -0.125;
  });

  check('a23_dep_low_share', 'Dependency low share is zero on mixed-importance fixture', () => {
    const share = nrDashBuildDependencyLowShare(createAgent23NsFixture())!;
    return share.edgeCount === 3 && share.lowCount === 0 && share.lowShare === 0;
  });

  check('a23_bottleneck_net_sev_load_spread', 'Bottleneck network severity load spread peaks on freight', () => {
    const spread = nrDashBuildBottleneckNetworkSeverityLoadSpread(createAgent23NsFixture())!;
    return spread.topNetwork === 'freight' && spread.stdDev === 0.4 && spread.meanLoad === 0.2;
  });

  check('a23_momentum_band_span', 'Momentum band span is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildMomentumBandSpan(snap)!;
    return span.rankSpread === 0 && span.minRank === 2 && span.maxRank === 2;
  });

  check('a23_economy_band_span', 'Economy band span is zero on uniform moderate fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildEconomyBandSpan(snap)!;
    return span.rankSpread === 0 && span.minRank === 2 && span.maxRank === 2;
  });

  check('a23_resilience_band_span', 'Resilience band span is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildResilienceBandSpan(snap)!;
    return span.rankSpread === 0 && span.minRank === 2 && span.maxRank === 2;
  });

  check('a23_moderate_risk_share', 'Moderate risk share is zero on high-only NSW fixture', () => {
    const share = nrDashBuildModerateRiskShare(createAgent23LrFixture())!;
    return share.riskCount === 1 && share.moderateCount === 0 && share.moderateShare === 0;
  });

  check('a23_national_bottleneck_gap', 'National bottleneck gap contrasts bar totals and active list', () => {
    const gap = nrDashBuildNationalBottleneckGap(createAgent23NsFixture())!;
    return gap.nationalBarTotal === 0 && gap.activeListCount === 1 && gap.gap === -1;
  });

  check('a23_dep_consumer_span', 'Dependency consumer span covers three consumer slots', () => {
    const span = nrDashBuildDependencyConsumerSpan(createAgent23NsFixture())!;
    return span.distinctConsumers === 3 && span.spanRatio === 0.375;
  });

  check('a23_map_pulse_span', 'Map pulse span is positive on NSW hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildMapPulseSpan(nrDashBuildRegionMapNodes(snap))!;
    return span.regionCount === 8 && span.intensitySpread > 0.05;
  });

  check('a23_low_risk_share', 'Low risk share is zero on high-only NSW fixture', () => {
    const share = nrDashBuildLowRiskShare(createAgent23LrFixture())!;
    return share.riskCount === 1 && share.lowCount === 0 && share.lowShare === 0;
  });

  check('a23_national_dep_gap', 'National dependency gap is zero when list matches snapshot', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), ns, null)!;
    const gap = nrDashBuildNationalDependencyGap(ns, snap)!;
    return gap.listCount === 3 && gap.snapshotCount === 3 && gap.gap === 0;
  });

  check('a23_dep_provider_span', 'Dependency provider span covers three provider slots', () => {
    const span = nrDashBuildDependencyProviderSpan(createAgent23NsFixture())!;
    return span.distinctProviders === 3 && span.spanRatio === 0.375;
  });

  check('a23_economy_resilience_span', 'Economy resilience span is flat on uniform fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildEconomyResilienceSpan(snap)!;
    return span.driftSpread === 0 && span.regionCount === 8;
  });

  check('a23_corridor_pulse_spread', 'Corridor pulse spread is positive on NSW hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const spread = nrDashBuildCorridorPulseSpread(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return spread.corridorCount > 0 && spread.stdDev > 0.01;
  });

  check('a23_history_turn_span', 'History turn span covers LR derived and NS history', () => {
    const span = nrDashBuildHistoryTurnSpan(createAgent23LrFixture(), createAgent23NsFixture())!;
    return span.eventCount === 2 && span.turnSpread === 1 && span.minTurn === 4;
  });

  check('a23_moderate_needs_spread', 'Moderate needs spread is zero on uniform fixture', () => {
    const spread = nrDashBuildModerateNeedsSpread(createAgent23LrFixture())!;
    return spread.totalModerateNeeds === 8 && spread.stdDev === 0;
  });

  check('a23_national_history_gap', 'National history gap is zero when sources match snippets', () => {
    const lr = createAgent23LrFixture();
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildNationalHistoryGap(lr, ns, snap)!;
    return gap.sourceEventCount === 2 && gap.surfacedSnippetCount === 2 && gap.gap === 0;
  });

  check('a23_link_pulse_span', 'Link pulse span is positive on merged map links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const span = nrDashBuildLinkPulseSpan(links, nodes)!;
    return span.linkCount > 0 && span.intensitySpread > 0.02;
  });

  check('a23_owner_portfolio_span', 'Owner portfolio span is eight on all-unknown fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const span = nrDashBuildOwnerPortfolioSpan(snap)!;
    return span.portfolioSpread === 8 && span.maxPortfolio === 8;
  });

  check('a23_constraint_band_span', 'Constraint band span is zero on uniform freight fixture', () => {
    const span = nrDashBuildConstraintBandSpan(createAgent23NsFixture())!;
    return span.rankSpread === 0 && span.regionCount === 8;
  });

  check('a23_derived_event_turn_span', 'Derived event turn span is zero on single major event', () => {
    const span = nrDashBuildDerivedEventTurnSpan(createAgent23LrFixture())!;
    return span.eventCount === 1 && span.turnSpread === 0 && span.minTurn === 4;
  });

  check('a23_critical_needs_spread', 'Critical needs spread is null without critical open needs', () =>
    nrDashBuildCriticalNeedsSpread(createAgent23LrFixture()) === null
  );

  check('a23_national_snippet_gap', 'National snippet gap reports unused dashboard slots', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNationalSnippetGap(snap)!;
    return gap.maxSnippets === 8 && gap.surfacedCount === 2 && gap.unusedSlots === 6;
  });

  check('a23_hub_pulse_span', 'Hub pulse span is positive on connectivity hubs', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildHubPulseSpan(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return span.hubRegionCount > 0 && span.intensitySpread > 0.02;
  });

  check('a23_rival_portfolio_span', 'Rival portfolio span tracks NSW rival ownership', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const span = nrDashBuildRivalPortfolioSpan(snap)!;
    return span.rivalCount === 1 && span.portfolioSpread === 1;
  });

  check('a23_network_condition_span', 'Network condition span is positive on strained fixture', () => {
    const span = nrDashBuildNetworkConditionSpan(createAgent23NsFixture())!;
    return span.cellCount === 40 && span.stdDev > 0.1;
  });

  check('a23_ns_history_turn_span', 'NS history turn span is zero on single entry fixture', () => {
    const span = nrDashBuildNsHistoryTurnSpan(createAgent23NsFixture())!;
    return span.eventCount === 1 && span.turnSpread === 0 && span.minTurn === 5;
  });

  check('a23_lr_history_turn_span', 'LR history turn span covers major derived on fixture', () => {
    const span = nrDashBuildLrHistoryTurnSpan(createAgent23LrFixture())!;
    return span.eventCount === 1 && span.turnSpread === 0 && span.minTurn === 4;
  });

  check('a23_open_needs_tier_spread', 'Open needs tier spread is zero on uniform moderate fixture', () => {
    const spread = nrDashBuildOpenNeedsTierSpread(createAgent23LrFixture())!;
    return spread.tierSpread === 0 && spread.maxTierCount === 8;
  });

  check('a23_snippet_saturation_share', 'Snippet saturation share matches surfaced buffer on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildSnippetSaturationShare(snap)!;
    return sat.maxSnippets === 8 && sat.snippetCount === 2 && sat.saturationShare === 0.25;
  });

  check('a23_pulse_asymmetry_gap', 'Pulse asymmetry gap is positive on NSW hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const gap = nrDashBuildPulseAsymmetryGap(nrDashBuildRegionMapNodes(snap))!;
    return gap.regionCount === 8 && gap.asymmetryGap > 0.02;
  });

  check('a23_regional_owner_skew', 'Regional owner skew favors player on NSW ownership fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const skew = nrDashBuildRegionalOwnerSkew(snap)!;
    return skew.ownershipSkew === 0.125 && skew.youShare === 0.125 && skew.rivalShare === 0;
  });

  check('a23_combined_derived_history_gap', 'Combined derived-history gap counts unsurfaced meaningful events', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 3, text: 'Minor tick', significance: 'meaningful' });
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildCombinedDerivedHistoryGap(lr, ns, snap)!;
    return gap.combinedSourceCount === 3 && gap.surfacedSnippetCount === 2 && gap.gap === 1;
  });

  check('a23_meaningful_derived_turn_span', 'Meaningful derived turn span spans fixture ticks', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Soft shift', significance: 'meaningful' });
    lr.state.derived.push({ turn: 6, text: 'Late note', significance: 'meaningful' });
    const span = nrDashBuildMeaningfulDerivedTurnSpan(lr)!;
    return span.eventCount === 2 && span.turnSpread === 4 && span.minTurn === 2;
  });

  check('a23_national_snippet_saturation_gap', 'National snippet saturation gap requires merged LR+NS snapshot', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNationalSnippetSaturationGap(snap)!;
    return gap.saturationGap === 6 && gap.headroomShare === 0.75 && gap.maxSnippets === 8;
  });

  check('a23_corridor_pulse_asymmetry', 'Corridor pulse asymmetry is positive on merged map fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildCorridorPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.corridorCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_neutral_owner_portfolio_skew', 'Neutral owner portfolio skew tracks neutral VIC fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const skew = nrDashBuildNeutralOwnerPortfolioSkew(snap)!;
    return skew.neutralShare === 0.125 && skew.portfolioSkew === 0.125;
  });

  check('a23_multi_tier_needs_concentration', 'Multi-tier needs concentration splits mixed severities', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'energy', status: 'open', severity: 'critical' });
    lr.state.regions.VIC!.needs[0]!.severity = 'low';
    const conc = nrDashBuildMultiTierNeedsConcentration(lr)!;
    return conc.activeTierCount === 3 && conc.concentrationIndex < 0.9 && conc.openNeedCount === 9;
  });

  check('a23_lr_ns_history_overlap_gap', 'LR–NS history overlap gap counts duplicate turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Same turn echo', significance: 'meaningful' });
    const gap = nrDashBuildLrNsHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.totalEntries === 3 && gap.uniqueTurnCount === 2 && gap.overlapGap === 1;
  });

  check('a23_unknown_owner_portfolio_skew', 'Unknown owner portfolio skew is one on default fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const skew = nrDashBuildUnknownOwnerPortfolioSkew(snap)!;
    return skew.unknownShare === 1 && skew.portfolioSkew === 1;
  });

  check('a23_high_tier_needs_concentration', 'High-tier needs concentration splits high and critical mix', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    lr.state.regions.VIC!.needs.push({ category: 'trade', status: 'open', severity: 'high' });
    const conc = nrDashBuildHighTierNeedsConcentration(lr)!;
    return conc.highTierOpenCount === 2 && conc.activeHighTierSlots === 2 && conc.concentrationIndex === 0.5;
  });

  check('a23_link_pulse_asymmetry', 'Link pulse asymmetry is positive on merged map links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const asym = nrDashBuildLinkPulseAsymmetry(links, nodes)!;
    return asym.linkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_ns_only_snippet_headroom', 'NS-only snippet headroom reports four-slot lane', () => {
    const snap = nrDashBuildAuthSnapshot(5, null, createAgent23NsFixture(), null)!;
    const head = nrDashBuildNsOnlySnippetHeadroom(snap)!;
    return head.nsSnippetCap === 4 && head.surfacedCount === 1 && head.headroomSlots === 3;
  });

  check('a23_derived_major_overlap_gap', 'Derived-major overlap gap ignores meaningful derived turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Same turn echo', significance: 'meaningful' });
    const gap = nrDashBuildDerivedMajorOverlapGap(lr, createAgent23NsFixture())!;
    return gap.totalEntries === 2 && gap.overlapGap === 0;
  });

  check('a23_corridor_saturation_share', 'Corridor saturation share is below one on hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildCorridorSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.corridorCount > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_rival_owner_portfolio_skew', 'Rival owner portfolio skew tracks NSW rival fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const skew = nrDashBuildRivalOwnerPortfolioSkew(snap)!;
    return skew.rivalShare === 0.125 && skew.portfolioSkew === 0.125;
  });

  check('a23_critical_tier_needs_concentration', 'Critical-tier needs concentration splits two-region fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    lr.state.regions.VIC!.needs.push({ category: 'health', status: 'open', severity: 'critical' });
    const conc = nrDashBuildCriticalTierNeedsConcentration(lr)!;
    return conc.criticalOpenCount === 2 && conc.concentrationIndex === 0.5;
  });

  check('a23_hub_pulse_asymmetry', 'Hub pulse asymmetry is positive on connectivity hubs', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildHubPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.hubRegionCount > 0 && asym.asymmetryGap > 0.01;
  });

  check('a23_lr_only_snippet_headroom', 'LR-only snippet headroom reports three-slot major lane', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const head = nrDashBuildLrOnlySnippetHeadroom(snap)!;
    return head.lrSnippetCap === 3 && head.surfacedCount === 1 && head.headroomSlots === 2;
  });

  check('a23_meaningful_derived_overlap_gap', 'Meaningful-derived overlap gap counts duplicate NS turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Echo', significance: 'meaningful' });
    const gap = nrDashBuildMeaningfulDerivedOverlapGap(lr, createAgent23NsFixture())!;
    return gap.totalEntries === 2 && gap.uniqueTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_link_saturation_share', 'Link saturation share is below one on merged map links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildLinkSaturationShare(links, nodes)!;
    return sat.linkCount > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_you_owner_momentum_gap', 'You-owner momentum gap is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const gap = nrDashBuildYouOwnerMomentumGap(snap)!;
    return gap.ownedRegionCount === 1 && gap.momentumGap === 0;
  });

  check('a23_moderate_tier_needs_concentration', 'Moderate-tier needs concentration is uniform on fixture', () => {
    const conc = nrDashBuildModerateTierNeedsConcentration(createAgent23LrFixture())!;
    return conc.moderateOpenCount === 8 && conc.concentrationIndex === 0.125;
  });

  check('a23_map_pulse_saturation_share', 'Map pulse saturation share is below one on hotspot fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const sat = nrDashBuildMapPulseSaturationShare(nrDashBuildRegionMapNodes(snap))!;
    return sat.regionCount === 8 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_merged_snippet_overlap_gap', 'Merged snippet overlap gap counts duplicate snippet turns', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    snap.historySnippets.push(snap.historySnippets[0]!);
    const gap = nrDashBuildMergedSnippetOverlapGap(snap)!;
    return gap.snippetCount === 3 && gap.uniqueTurnCount === 2 && gap.overlapGap === 1;
  });

  check('a23_dependency_pulse_asymmetry', 'Dependency pulse asymmetry is positive on dependency links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const asym = nrDashBuildDependencyPulseAsymmetry(links, nodes)!;
    return asym.linkCount === 3 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_border_corridor_saturation_share', 'Border corridor saturation share is below one on fixture', () => {
    const sat = nrDashBuildBorderCorridorSaturationShare(createAgent23NsFixture())!;
    return sat.borderRegionCount === 8 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_rival_owner_momentum_gap', 'Rival-owner momentum gap is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const gap = nrDashBuildRivalOwnerMomentumGap(snap)!;
    return gap.rivalRegionCount === 1 && gap.momentumGap === 0;
  });

  check('a23_low_tier_needs_concentration', 'Low-tier needs concentration splits two-region fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'water', status: 'open', severity: 'low' });
    lr.state.regions.VIC!.needs.push({ category: 'trade', status: 'open', severity: 'low' });
    const conc = nrDashBuildLowTierNeedsConcentration(lr)!;
    return conc.lowOpenCount === 2 && conc.concentrationIndex === 0.5;
  });

  check('a23_adjacency_pulse_asymmetry', 'Adjacency pulse asymmetry is positive on land links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const asym = nrDashBuildAdjacencyPulseAsymmetry(links, nodes)!;
    return asym.linkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_snippet_turn_span', 'Snippet turn span covers merged LR and NS snippets', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const span = nrDashBuildSnippetTurnSpan(snap)!;
    return span.snippetCount === 2 && span.turnSpread === 1 && span.minTurn === 4;
  });

  check('a23_hub_corridor_saturation_share', 'Hub corridor saturation share is below one on fixture', () => {
    const sat = nrDashBuildHubCorridorSaturationShare(createAgent23NsFixture())!;
    return sat.touchingLinkCount > 0 && sat.saturationShare > 0 && sat.saturationShare <= 1;
  });

  check('a23_national_derived_overlap_gap', 'National derived overlap gap counts same-turn NS and LR entries', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'National echo', significance: 'major' });
    const gap = nrDashBuildNationalDerivedOverlapGap(lr, createAgent23NsFixture())!;
    return gap.nationalTurn === 5 && gap.nsEntryCount === 1 && gap.derivedEntryCount === 1 && gap.overlapGap === 1;
  });

  check('a23_neutral_owner_momentum_gap', 'Neutral-owner momentum gap is zero on uniform stable fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const gap = nrDashBuildNeutralOwnerMomentumGap(snap)!;
    return gap.neutralRegionCount === 1 && gap.momentumGap === 0;
  });

  check('a23_open_needs_severity_span', 'Open needs severity span separates critical NSW fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    const span = nrDashBuildOpenNeedsSeveritySpan(lr)!;
    return span.severitySpread === 2 && span.maxSeverityRank === 3;
  });

  check('a23_peripheral_pulse_asymmetry', 'Peripheral pulse asymmetry is positive off-hub links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildPeripheralPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.peripheralLinkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_history_snippet_turn_gap', 'History snippet turn gap is zero when spans align', () => {
    const lr = createAgent23LrFixture();
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildHistorySnippetTurnGap(lr, ns, snap)!;
    return gap.sourceTurnSpread === 1 && gap.snippetTurnSpread === 1 && gap.turnGap === 0;
  });

  check('a23_dependency_corridor_saturation_share', 'Dependency corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildDependencyCorridorSaturationShare(links, nodes)!;
    return sat.linkCount === 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_lr_major_snippet_overlap_gap', 'LR major snippet overlap gap counts duplicate major turns', () => {
    const lr = createAgent23LrFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const gap = nrDashBuildLrMajorSnippetOverlapGap(lr, snap)!;
    return gap.majorEventCount === 1 && gap.snippetTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_unknown_owner_momentum_gap', 'Unknown-owner momentum gap is zero on default unknown fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const gap = nrDashBuildUnknownOwnerMomentumGap(snap)!;
    return gap.unknownRegionCount === 8 && gap.momentumGap === 0;
  });

  check('a23_regional_needs_severity_concentration', 'Regional needs severity concentration is uniform on fixture', () => {
    const conc = nrDashBuildRegionalNeedsSeverityConcentration(createAgent23LrFixture())!;
    return conc.weightedSeverityTotal === 16 && conc.concentrationIndex === 0.125;
  });

  check('a23_hub_peripheral_saturation_share', 'Hub peripheral saturation share is below one on fixture', () => {
    const sat = nrDashBuildHubPeripheralSaturationShare(createAgent23NsFixture())!;
    return sat.hubMeanStress > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_snippet_source_turn_gap', 'Snippet source turn gap counts unsurfaced derived events', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Tick', significance: 'meaningful' });
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, lr, ns, null)!;
    const gap = nrDashBuildSnippetSourceTurnGap(lr, ns, snap)!;
    return gap.sourceEventCount === 3 && gap.snippetLabelCount === 2 && gap.sourceTurnGap === 1;
  });

  check('a23_adjacency_corridor_saturation_share', 'Adjacency corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildAdjacencyCorridorSaturationShare(links, nodes)!;
    return sat.linkCount > 0 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_ns_history_snippet_overlap_gap', 'NS history snippet overlap gap counts duplicate NS turns', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const gap = nrDashBuildNsHistorySnippetOverlapGap(createAgent23NsFixture(), snap)!;
    return gap.nsHistoryCount === 1 && gap.matchingSnippetCount === 1 && gap.overlapGap === 1;
  });

  check('a23_owned_open_needs_momentum_skew_gap', 'Owned open-needs momentum skew gap is zero on uniform NSW fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const gap = nrDashBuildOwnedOpenNeedsMomentumSkewGap(snap)!;
    return gap.ownedRegionCount === 1 && gap.portfolioSkewGap === 0;
  });

  check('a23_national_severity_tier_spread', 'National severity tier spread separates low VIC fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.VIC!.needs[0]!.severity = 'low';
    const spread = nrDashBuildNationalSeverityTierSpread(lr)!;
    return spread.tierSpread > 0 && spread.maxMeanRank > spread.minMeanRank;
  });

  check('a23_chokepoint_pulse_asymmetry', 'Chokepoint pulse asymmetry is positive on dependency endpoints', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildChokepointPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.chokepointCount === 3 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_lr_derived_snippet_turn_gap', 'LR derived snippet turn gap counts unsurfaced derived turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Early', significance: 'meaningful' });
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const gap = nrDashBuildLrDerivedSnippetTurnGap(lr, snap)!;
    return gap.derivedTurnSpread === 2 && gap.lrSnippetTurnSpread === 0 && gap.turnGap === 2;
  });

  check('a23_merged_corridor_saturation_share', 'Merged corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildMergedCorridorSaturationShare(links, nodes)!;
    return sat.linkCount > 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_major_history_overlap_gap', 'Major-history overlap gap counts shared NS and major turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'National beat', significance: 'major' });
    const gap = nrDashBuildMajorHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.sharedTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_rival_open_needs_skew_gap', 'Rival open-needs skew gap tracks NSW rival fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'rival' })!;
    const gap = nrDashBuildRivalOpenNeedsSkewGap(snap)!;
    return gap.rivalRegionCount === 1 && gap.openNeedsSkewGap >= 0 && gap.ownershipSkew === 0;
  });

  check('a23_peak_severity_concentration', 'Peak severity concentration splits critical NSW fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs[0]!.severity = 'critical';
    const conc = nrDashBuildPeakSeverityConcentration(lr)!;
    return conc.regionCount === COMM_REGION_CODES.length && conc.concentrationIndex > 0.1;
  });

  check('a23_border_pulse_asymmetry', 'Border pulse asymmetry is positive on hottest border fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildBorderPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.borderLinkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_ns_snippet_source_gap', 'NS snippet source gap matches NS history on merged fixture', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), ns, null)!;
    const gap = nrDashBuildNsSnippetSourceGap(ns, snap)!;
    return gap.nsSourceCount === 1 && gap.matchedSnippetCount === 1 && gap.sourceGap === 0;
  });

  check('a23_hub_link_saturation_share', 'Hub link saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildHubLinkSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.touchingLinkCount > 0 && sat.saturationShare > 0 && sat.saturationShare <= 1;
  });

  check('a23_meaningful_history_overlap_gap', 'Meaningful-history overlap gap counts duplicate NS turns', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Echo', significance: 'meaningful' });
    const gap = nrDashBuildMeaningfulHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.sharedTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_you_open_needs_skew_gap', 'You open-needs skew gap tracks NSW player fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { NSW: 'you' })!;
    const gap = nrDashBuildYouOpenNeedsSkewGap(snap)!;
    return gap.youRegionCount === 1 && gap.openNeedsSkewGap >= 0 && gap.ownershipSkew === 0;
  });

  check('a23_national_peak_tier_spread', 'National peak tier spread separates critical NSW fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs[0]!.severity = 'critical';
    lr.state.regions.VIC!.needs[0]!.severity = 'low';
    const spread = nrDashBuildNationalPeakTierSpread(lr)!;
    return spread.tierSpread === 2 && spread.maxPeakRank === 3 && spread.minPeakRank === 1;
  });

  check('a23_chokepoint_corridor_saturation_share', 'Chokepoint corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildChokepointCorridorSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.chokepointCount === 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_lr_derived_snippet_source_gap', 'LR derived snippet source gap counts unsurfaced derived events', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Early', significance: 'meaningful' });
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const gap = nrDashBuildLrDerivedSnippetSourceGap(lr, snap)!;
    return gap.derivedSourceCount === 2 && gap.matchedSnippetCount === 1 && gap.sourceGap === 1;
  });

  check('a23_peripheral_link_saturation_share', 'Peripheral link saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildPeripheralLinkSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.peripheralLinkCount > 0 && sat.saturationShare > 0 && sat.saturationShare <= 1;
  });

  check('a23_ns_major_history_overlap_gap', 'NS major history overlap gap counts shared turn five on fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'National beat', significance: 'major' });
    const gap = nrDashBuildNsMajorHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.sharedTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_neutral_open_needs_skew_gap', 'Neutral open-needs skew gap tracks VIC neutral fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, { VIC: 'neutral' })!;
    const gap = nrDashBuildNeutralOpenNeedsSkewGap(snap)!;
    return gap.neutralRegionCount === 1 && gap.openNeedsSkewGap >= 0 && gap.ownershipSkew === 0;
  });

  check('a23_national_open_needs_peak_spread', 'National open-needs peak spread splits extra NSW need', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'health', status: 'open', severity: 'moderate' });
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const spread = nrDashBuildNationalOpenNeedsPeakSpread(snap)!;
    return spread.peakSpread === 1 && spread.maxOpenNeeds === 2;
  });

  check('a23_dependency_link_saturation_share', 'Dependency link saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildDependencyLinkSaturationShare(links, nodes)!;
    return sat.linkCount === 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_ns_derived_snippet_source_gap', 'NS derived snippet source gap counts bottleneck lane', () => {
    const ns = createAgent23NsFixture();
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), ns, null)!;
    const gap = nrDashBuildNsDerivedSnippetSourceGap(ns, snap)!;
    return gap.nsDerivedCount === 2 && gap.matchedSnippetCount === 1 && gap.sourceGap === 1;
  });

  check('a23_rim_corridor_saturation_share', 'Rim corridor saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildRimCorridorSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.rimLinkCount > 0 && sat.saturationShare > 0 && sat.saturationShare <= 1;
  });

  check('a23_critical_history_overlap_gap', 'Critical-history overlap gap counts NS turn five anchor', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'security', status: 'open', severity: 'critical' });
    const gap = nrDashBuildCriticalHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.criticalEntryCount === 1 && gap.sharedTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_unknown_open_needs_skew_gap', 'Unknown open-needs skew gap is zero on default unknown fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), null, null)!;
    const gap = nrDashBuildUnknownOpenNeedsSkewGap(snap)!;
    return gap.unknownRegionCount === 8 && gap.ownershipSkew === 0 && gap.openNeedsSkewGap === 0;
  });

  check('a23_regional_peak_severity_spread', 'Regional peak severity spread splits critical NSW fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs[0]!.severity = 'critical';
    lr.state.regions.VIC!.needs[0]!.severity = 'low';
    const spread = nrDashBuildRegionalPeakSeveritySpread(lr)!;
    return spread.peakSpread === 2 && spread.maxPeakRank === 3;
  });

  check('a23_adjacency_link_saturation_share', 'Adjacency link saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const nodes = nrDashBuildRegionMapNodes(snap);
    const links = nrDashMergeMapLinks(
      nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
      nrDashBuildDependencyLinks(createAgent23NsFixture(), AGENT23_REGION_MAP_LAYOUT)
    );
    const sat = nrDashBuildAdjacencyLinkSaturationShare(links, nodes)!;
    return sat.linkCount > 3 && sat.saturationShare > 0 && sat.saturationShare < 1;
  });

  check('a23_combined_snippet_source_gap', 'Combined snippet source gap counts extra derived event', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Early', significance: 'meaningful' });
    const snap = nrDashBuildAuthSnapshot(5, lr, createAgent23NsFixture(), null)!;
    const gap = nrDashBuildCombinedSnippetSourceGap(lr, createAgent23NsFixture(), snap)!;
    return gap.combinedSourceCount === 3 && gap.matchedSnippetCount === 2 && gap.sourceGap === 1;
  });

  check('a23_hub_rim_pulse_asymmetry', 'Hub rim pulse asymmetry is positive on hub-touching links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildHubRimPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.hubRimLinkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_major_derived_history_overlap_gap', 'Major-derived history overlap gap counts duplicate NS turn', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Echo', significance: 'meaningful' });
    const gap = nrDashBuildMajorDerivedHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.derivedEntryCount === 2 && gap.sharedTurnCount === 1 && gap.overlapGap === 1;
  });

  check('a23_rival_open_needs_peak_spread', 'Rival open-needs peak spread splits two rival regions', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs.push({ category: 'health', status: 'open', severity: 'moderate' });
    const snap = nrDashBuildAuthSnapshot(5, lr, null, { NSW: 'rival', VIC: 'rival' })!;
    const spread = nrDashBuildRivalOpenNeedsPeakSpread(snap)!;
    return spread.rivalRegionCount === 2 && spread.peakSpread === 1 && spread.maxOpenNeeds === 2;
  });

  check('a23_national_severity_peak_concentration', 'National severity peak concentration splits critical NSW fixture', () => {
    const lr = createAgent23LrFixture();
    lr.state.regions.NSW!.needs[0]!.severity = 'critical';
    const conc = nrDashBuildNationalSeverityPeakConcentration(lr)!;
    return conc.concentrationIndex > 0.1 && conc.peakSeverityTotal > 8;
  });

  check('a23_border_link_saturation_share', 'Border link saturation share is below one on fixture', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const sat = nrDashBuildBorderLinkSaturationShare(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return sat.touchingLinkCount > 0 && sat.saturationShare > 0 && sat.saturationShare <= 1;
  });

  check('a23_lr_major_snippet_source_gap', 'LR major snippet source gap is zero when majors are surfaced', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 2, text: 'Early major', significance: 'major' });
    const snap = nrDashBuildAuthSnapshot(5, lr, null, null)!;
    const gap = nrDashBuildLrMajorSnippetSourceGap(lr, snap)!;
    return gap.majorSourceCount === 2 && gap.matchedSnippetCount === 2 && gap.sourceGap === 0;
  });

  check('a23_merged_rim_pulse_asymmetry', 'Merged rim pulse asymmetry is positive off-hub links', () => {
    const snap = nrDashBuildAuthSnapshot(5, createAgent23LrFixture(), createAgent23NsFixture(), null)!;
    const asym = nrDashBuildMergedRimPulseAsymmetry(createAgent23NsFixture(), nrDashBuildRegionMapNodes(snap))!;
    return asym.rimLinkCount > 0 && asym.maxEndpointDelta > 0.01;
  });

  check('a23_meaningful_derived_history_overlap_gap', 'Meaningful-derived history overlap gap counts duplicate NS turn', () => {
    const lr = createAgent23LrFixture();
    lr.state.derived.push({ turn: 5, text: 'Echo', significance: 'meaningful' });
    const gap = nrDashBuildMeaningfulDerivedHistoryOverlapGap(lr, createAgent23NsFixture())!;
    return gap.meaningfulDerivedCount === 1 && gap.sharedTurnCount === 1 && gap.overlapGap === 1;
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

