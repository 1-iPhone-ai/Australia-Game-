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
