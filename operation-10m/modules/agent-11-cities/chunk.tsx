// OP10M_MODULE_BEGIN agent-11-cities
// Agent 11 — cities/regions, inequality, intercity infra (generated; source: operation-10m/agent-11-cities/src/)

// --- source: types.ts ---
/** Operation 10M Agent 11 — shared types (assembly-compatible with V10.14 §20AK shapes). */

export const OP10M_A11_SCHEMA_VERSION = '10m.a11.1' as const;

export const OP10M_A11_CORE_REGIONS = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export type OP10M_A11_RegionId = (typeof OP10M_A11_CORE_REGIONS)[number];

export type OP10M_A11_GrowthBand =
  | 'contracting'
  | 'slow'
  | 'steady'
  | 'fast'
  | 'surging';

export type OP10M_A11_InequalityBand =
  | 'balanced'
  | 'moderate_gap'
  | 'wide_gap'
  | 'polarized';

export type OP10M_A11_SpilloverBand = 'isolated' | 'weak' | 'connected' | 'integrated';

export type OP10M_A11_DerivedKind =
  | 'inequality_widened'
  | 'inequality_narrowed'
  | 'metro_regional_divergence'
  | 'national_spillover_boost'
  | 'national_spillover_drag'
  | 'lagging_region_catch_up';

export interface OP10M_A11_CityGrowthSlice {
  cityId: string;
  regionId: string;
  growthScore: number;
  growthBand: OP10M_A11_GrowthBand;
  absorptionHeadroom: number;
  gateway: boolean;
}

export interface OP10M_A11_RegionSlice {
  regionId: OP10M_A11_RegionId;
  economyScore: number;
  momentumBand: string;
  developmentTier: string;
  infrastructureQuality: number;
}

export interface OP10M_A11_NationalSlice {
  turn: number;
  nationalGrowthBand: 'contraction' | 'slow' | 'steady' | 'strong' | 'overheating';
  distributionBand: 'broad_based' | 'mixed' | 'uneven' | 'highly_uneven';
  networkFreight: number;
  networkDigital: number;
  capitalCityBias: number;
}

export interface OP10M_A11_Inputs {
  turn: number;
  cities: OP10M_A11_CityGrowthSlice[];
  regions: Partial<Record<OP10M_A11_RegionId, OP10M_A11_RegionSlice>>;
  national: OP10M_A11_NationalSlice;
}

export interface OP10M_A11_RegionInequalityRow {
  regionId: OP10M_A11_RegionId;
  urbanGrowthIndex: number;
  relativeStanding: number;
  band: OP10M_A11_GrowthBand;
  lagging: boolean;
  leading: boolean;
  spilloverBand: OP10M_A11_SpilloverBand;
  narrative: string;
}

export interface OP10M_A11_DerivedEvent {
  id: string;
  turn: number;
  kind: OP10M_A11_DerivedKind;
  regionIds: OP10M_A11_RegionId[];
  text: string;
  significance: 'minor' | 'meaningful' | 'major';
}

export interface OP10M_A11_State {
  schemaVersion: typeof OP10M_A11_SCHEMA_VERSION;
  revision: number;
  turn: number;
  inequalityIndex: number;
  inequalityBand: OP10M_A11_InequalityBand;
  metroRegionalGap: number;
  nationalLocalCoupling: number;
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
  summary: string;
  inputHash: string;
}

export interface OP10M_A11_Persisted {
  schemaVersion: typeof OP10M_A11_SCHEMA_VERSION;
  revision: number;
  initializedTurn: number | null;
  lastInequalityIndex: number;
  lastInequalityBand: OP10M_A11_InequalityBand;
  history: Array<{ turn: number; inequalityIndex: number; band: OP10M_A11_InequalityBand }>;
  inputHash: string;
}

export type OP10M_A11_SelfTestResult = { id: string; passed: boolean; detail: string };

/** Intercity / regional infrastructure slice (schema 10m.a11.2). */
export const OP10M_A11_INFRA_SCHEMA_VERSION = '10m.a11.2' as const;

export type OP10M_A11_LinkKind =
  | 'passenger_rail'
  | 'freight_rail'
  | 'highway'
  | 'domestic_air'
  | 'sea_freight';

export type OP10M_A11_LinkHealth = 'severed' | 'degraded' | 'operational' | 'strong' | 'redundant';

export type OP10M_A11_BottleneckSeverity = 'watch' | 'meaningful' | 'critical';

export type OP10M_A11_DependencyCriticality = 'low' | 'medium' | 'high' | 'essential';

export type OP10M_A11_InfraDerivedKind =
  | 'regional_bottleneck_emerged'
  | 'regional_bottleneck_eased'
  | 'intercity_chokepoint'
  | 'intercity_dependency_critical';

export interface OP10M_A11_IntercityLinkSlice {
  linkId: string;
  kind: OP10M_A11_LinkKind;
  cityA: string;
  cityB: string;
  regionA: OP10M_A11_RegionId;
  regionB: OP10M_A11_RegionId;
  utilization: number;
  health: OP10M_A11_LinkHealth;
  strategic: boolean;
  redundancyGroup: string;
}

export interface OP10M_A11_RegionTransportNeed {
  regionId: OP10M_A11_RegionId;
  category: 'transport' | 'energy' | 'water';
  severity: 'low' | 'moderate' | 'high' | 'critical';
  status: 'open' | 'mitigated';
}

export interface OP10M_A11_InfraInputs {
  turn: number;
  links: OP10M_A11_IntercityLinkSlice[];
  cities: OP10M_A11_CityGrowthSlice[];
  transportNeeds: OP10M_A11_RegionTransportNeed[];
  regions: Partial<Record<OP10M_A11_RegionId, Pick<OP10M_A11_RegionSlice, 'infrastructureQuality'>>>;
  networkFreight: number;
  networkDigital: number;
}

export interface OP10M_A11_RegionalBottleneck {
  regionId: OP10M_A11_RegionId;
  severity: OP10M_A11_BottleneckSeverity;
  bindScore: number;
  drivers: string[];
  explanation: string;
}

export interface OP10M_A11_IntercityDependencyEdge {
  linkId: string;
  criticality: OP10M_A11_DependencyCriticality;
  dependentRegions: OP10M_A11_RegionId[];
  chokePoint: boolean;
  explanation: string;
}

export interface OP10M_A11_InfraDerivedEvent {
  id: string;
  turn: number;
  kind: OP10M_A11_InfraDerivedKind;
  regionIds: OP10M_A11_RegionId[];
  linkId: string | null;
  text: string;
  significance: 'minor' | 'meaningful' | 'major';
}

export interface OP10M_A11_InfraState {
  schemaVersion: typeof OP10M_A11_INFRA_SCHEMA_VERSION;
  revision: number;
  turn: number;
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  dependencies: OP10M_A11_IntercityDependencyEdge[];
  corridorStressIndex: number;
  summary: string;
  inputHash: string;
}

export interface OP10M_A11_InfraPersisted {
  schemaVersion: typeof OP10M_A11_INFRA_SCHEMA_VERSION;
  revision: number;
  initializedTurn: number | null;
  lastStressIndex: number;
  stressedLinkIds: string[];
  inputHash: string;
}

/** Composite cities/regions depth slice (scale wave). */
export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.2' as const;

export type OP10M_A11_PrimateBand = 'decentralized' | 'balanced' | 'concentrated' | 'hyper_concentrated';

export type OP10M_A11_LinkageBand = 'weak' | 'moderate' | 'strong' | 'structural';

export type OP10M_A11_CompositeDerivedKind =
  | 'primate_concentration_risk'
  | 'regional_linkage_fragility'
  | 'integrated_relief_priority'
  | 'corridor_flow_surge'
  | 'linkage_hub_overload'
  | 'peripheral_isolation_deepening';

export interface OP10M_A11_UrbanHierarchyRow {
  regionId: OP10M_A11_RegionId;
  primateIndex: number;
  primateBand: OP10M_A11_PrimateBand;
  gatewayShare: number;
  secondaryMomentum: number;
  narrative: string;
}

export interface OP10M_A11_RegionalLinkageEdge {
  fromRegion: OP10M_A11_RegionId;
  toRegion: OP10M_A11_RegionId;
  strength: number;
  band: OP10M_A11_LinkageBand;
  viaLinks: number;
}

export type OP10M_A11_FlowPressureBand = 'light' | 'moderate' | 'heavy' | 'surge';

export interface OP10M_A11_CorridorFlowRow {
  fromRegion: OP10M_A11_RegionId;
  toRegion: OP10M_A11_RegionId;
  flowPressure: number;
  band: OP10M_A11_FlowPressureBand;
  growthGradient: number;
  explanation: string;
}

export type OP10M_A11_HubRole = 'peripheral' | 'connector' | 'regional_hub' | 'national_hub';

export interface OP10M_A11_LinkageHubProfile {
  regionId: OP10M_A11_RegionId;
  degree: number;
  weightedCentrality: number;
  role: OP10M_A11_HubRole;
  isolationScore: number;
  narrative: string;
}

export interface OP10M_A11_ReliefPlaybookItem {
  regionId: OP10M_A11_RegionId;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actions: string[];
  rationale: string;
}

export interface OP10M_A11_CompositeDerivedEvent {
  id: string;
  turn: number;
  kind: OP10M_A11_CompositeDerivedKind;
  regionIds: OP10M_A11_RegionId[];
  text: string;
  significance: 'minor' | 'meaningful' | 'major';
}

export interface OP10M_A11_CompositeInputs {
  urban: OP10M_A11_Inputs;
  infra: OP10M_A11_InfraInputs;
}

export interface OP10M_A11_CompositeState {
  schemaVersion: typeof OP10M_A11_COMPOSITE_SCHEMA_VERSION;
  revision: number;
  turn: number;
  urban: OP10M_A11_State;
  infra: OP10M_A11_InfraState;
  hierarchy: OP10M_A11_UrbanHierarchyRow[];
  linkages: OP10M_A11_RegionalLinkageEdge[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  reliefPlaybook: OP10M_A11_ReliefPlaybookItem[];
  fragilityIndex: number;
  nationalPrimateIndex: number;
  maxCorridorFlow: number;
  summary: string;
  inputHash: string;
}

export interface OP10M_A11_CompositePersisted {
  schemaVersion: typeof OP10M_A11_COMPOSITE_SCHEMA_VERSION;
  revision: number;
  initializedTurn: number | null;
  urban: OP10M_A11_Persisted;
  infra: OP10M_A11_InfraPersisted;
  lastFragilityIndex: number;
  lastMaxCorridorFlow: number;
  inputHash: string;
}


// --- source: constants.ts ---

export const OP10M_A11_LIMITS = {
  history: 24,
  derivedPerTurn: 12,
  inequalityIndexCap: 100,
} as const;

export const OP10M_A11_THRESHOLDS = {
  inequalityBalanced: 18,
  inequalityModerate: 32,
  inequalityWide: 48,
  metroGapMeaningful: 14,
  spilloverWeak: 28,
  spilloverConnected: 52,
  spilloverIntegrated: 72,
  catchUpDelta: 6,
  widenDelta: 4,
} as const;

const GROWTH_ORDER: OP10M_A11_GrowthBand[] = [
  'contracting',
  'slow',
  'steady',
  'fast',
  'surging',
];

export function op10mA11Clamp(x: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(x)) return lo;
  return Math.max(lo, Math.min(hi, x));
}

export function op10mA11Round(x: number, digits = 1): number {
  const f = 10 ** digits;
  return Math.round(x * f) / f;
}

export function op10mA11GrowthBandFromScore(score: number): OP10M_A11_GrowthBand {
  if (score < 18) return 'contracting';
  if (score < 35) return 'slow';
  if (score < 55) return 'steady';
  if (score < 75) return 'fast';
  return 'surging';
}

export function op10mA11InequalityBand(index: number): OP10M_A11_InequalityBand {
  if (index < OP10M_A11_THRESHOLDS.inequalityBalanced) return 'balanced';
  if (index < OP10M_A11_THRESHOLDS.inequalityModerate) return 'moderate_gap';
  if (index < OP10M_A11_THRESHOLDS.inequalityWide) return 'wide_gap';
  return 'polarized';
}

export function op10mA11GrowthBandRank(b: OP10M_A11_GrowthBand): number {
  return GROWTH_ORDER.indexOf(b);
}

/** Normalized mean absolute deviation — stable inequality proxy on 0–100 scale. */
export function op10mA11InequalityIndex(values: number[]): number {
  if (!values.length) return 0;
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const mad = values.reduce((a, v) => a + Math.abs(v - mean), 0) / values.length;
  return op10mA11Clamp(mad * 1.35);
}

export function op10mA11HashInputs(payload: {
  turn: number;
  cityCount: number;
  regionKeys: string;
  nationalGrowth: string;
}): string {
  return `a11:${payload.turn}:${payload.cityCount}:${payload.regionKeys}:${payload.nationalGrowth}`;
}


// --- source: regional-inequality.ts ---

export function op10mA11RelativeStanding(scores: Record<OP10M_A11_RegionId, number>): Record<OP10M_A11_RegionId, number> {
  const vals = OP10M_A11_CORE_REGIONS.map((r) => scores[r]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = Math.max(1, max - min);
  const out = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    out[rid] = op10mA11Clamp(((scores[rid] - min) / span) * 100);
  }
  return out;
}

export function op10mA11LeadingLaggingFlags(
  relative: Record<OP10M_A11_RegionId, number>,
): Record<OP10M_A11_RegionId, { leading: boolean; lagging: boolean }> {
  const out = {} as Record<OP10M_A11_RegionId, { leading: boolean; lagging: boolean }>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    out[rid] = {
      leading: relative[rid] >= 72,
      lagging: relative[rid] <= 28,
    };
  }
  return out;
}

export function op10mA11SummarizeInequality(args: {
  inequalityIndex: number;
  inequalityBand: string;
  metroGap: number;
  leading: OP10M_A11_RegionId[];
  lagging: OP10M_A11_RegionId[];
}): string {
  const lead = args.leading.slice(0, 2).join('/') || 'none';
  const lag = args.lagging.slice(0, 2).join('/') || 'none';
  return `Regional inequality ${args.inequalityBand} (index ${op10mA11Round(args.inequalityIndex)}); metro gap ${op10mA11Round(args.metroGap)}; leaders ${lead}; lagging ${lag}.`;
}


// --- source: urban-growth-dynamics.ts ---
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_RegionId,
  type OP10M_A11_RegionSlice,
} from './types.ts';

const MOMENTUM_BOOST: Record<string, number> = {
  declining: -10,
  weakening: -4,
  stable: 0,
  growing: 6,
  rapid_growth: 12,
  booming: 18,
};

const DEV_BOOST: Record<string, number> = {
  underdeveloped: -6,
  emerging: -1,
  developing: 3,
  advanced: 8,
  highly_developed: 12,
};

export function op10mA11AggregateUrbanGrowthByRegion(
  cities: OP10M_A11_CityGrowthSlice[],
): Record<OP10M_A11_RegionId, { avgGrowth: number; maxGrowth: number; cityCount: number; gatewayAvg: number }> {
  const acc: Partial<
    Record<
      OP10M_A11_RegionId,
      { sum: number; max: number; n: number; gatewaySum: number; gatewayN: number }
    >
  > = {};

  for (const c of cities) {
    const rid = c.regionId as OP10M_A11_RegionId;
    if (!OP10M_A11_CORE_REGIONS.includes(rid)) continue;
    const row = acc[rid] || { sum: 0, max: 0, n: 0, gatewaySum: 0, gatewayN: 0 };
    row.sum += c.growthScore;
    row.max = Math.max(row.max, c.growthScore);
    row.n += 1;
    if (c.gateway) {
      row.gatewaySum += c.growthScore;
      row.gatewayN += 1;
    }
    acc[rid] = row;
  }

  const out = {} as Record<
    OP10M_A11_RegionId,
    { avgGrowth: number; maxGrowth: number; cityCount: number; gatewayAvg: number }
  >;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const row = acc[rid];
    if (!row || !row.n) {
      out[rid] = { avgGrowth: 40, maxGrowth: 40, cityCount: 0, gatewayAvg: 40 };
      continue;
    }
    out[rid] = {
      avgGrowth: op10mA11Round(row.sum / row.n),
      maxGrowth: op10mA11Round(row.max),
      cityCount: row.n,
      gatewayAvg: op10mA11Round(row.gatewayN ? row.gatewaySum / row.gatewayN : row.sum / row.n),
    };
  }
  return out;
}

export function op10mA11BlendRegionalUrbanScore(
  urban: { avgGrowth: number; gatewayAvg: number },
  region: OP10M_A11_RegionSlice | undefined,
): number {
  const mom = MOMENTUM_BOOST[region?.momentumBand || 'stable'] ?? 0;
  const dev = DEV_BOOST[region?.developmentTier || 'emerging'] ?? 0;
  const infra = region?.infrastructureQuality ?? 45;
  const econ = region?.economyScore ?? 50;
  const base = urban.avgGrowth * 0.55 + urban.gatewayAvg * 0.2 + econ * 0.15;
  return op10mA11Clamp(base + mom + dev + (infra - 50) * 0.12);
}

export function op10mA11MetroRegionalGap(
  byRegion: Record<OP10M_A11_RegionId, { avgGrowth: number; gatewayAvg: number }>,
): number {
  const gatewayScores = OP10M_A11_CORE_REGIONS.map((r) => byRegion[r].gatewayAvg);
  const regionalScores = OP10M_A11_CORE_REGIONS.map((r) => byRegion[r].avgGrowth);
  const gMean = gatewayScores.reduce((a, b) => a + b, 0) / gatewayScores.length;
  const rMean = regionalScores.reduce((a, b) => a + b, 0) / regionalScores.length;
  return op10mA11Clamp(Math.abs(gMean - rMean) * 1.1);
}


// --- source: urban-national-links.ts ---
  OP10M_A11_NationalSlice,
  OP10M_A11_RegionId,
  OP10M_A11_RegionInequalityRow,
  OP10M_A11_SpilloverBand,
} from './types.ts';

const NATIONAL_GROWTH_MOD: Record<OP10M_A11_NationalSlice['nationalGrowthBand'], number> = {
  contraction: -8,
  slow: -3,
  steady: 0,
  strong: 5,
  overheating: 8,
};

const DISTRIBUTION_DRAG: Record<OP10M_A11_NationalSlice['distributionBand'], number> = {
  broad_based: -4,
  mixed: 0,
  uneven: 5,
  highly_uneven: 10,
};

export function op10mA11NationalLocalCoupling(national: OP10M_A11_NationalSlice): number {
  const network = (national.networkFreight + national.networkDigital) / 2;
  const biasPenalty = op10mA11Clamp(national.capitalCityBias * 0.35, 0, 18);
  return op10mA11Clamp(network * 0.72 + NATIONAL_GROWTH_MOD[national.nationalGrowthBand] - biasPenalty);
}

export function op10mA11SpilloverBand(coupling: number, relativeStanding: number): OP10M_A11_SpilloverBand {
  const adjusted = coupling + (relativeStanding < 45 ? 8 : relativeStanding > 62 ? -4 : 0);
  if (adjusted < OP10M_A11_THRESHOLDS.spilloverWeak) return 'isolated';
  if (adjusted < OP10M_A11_THRESHOLDS.spilloverConnected) return 'weak';
  if (adjusted < OP10M_A11_THRESHOLDS.spilloverIntegrated) return 'connected';
  return 'integrated';
}

export function op10mA11ApplyNationalSpilloverToStanding(
  urbanIndex: number,
  regionId: OP10M_A11_RegionId,
  national: OP10M_A11_NationalSlice,
  coupling: number,
): number {
  const distDrag = DISTRIBUTION_DRAG[national.distributionBand];
  const lagBonus =
    urbanIndex < 48 ? op10mA11Clamp(coupling * 0.22, 0, 12) : op10mA11Clamp(coupling * 0.08, 0, 6);
  const hotspotTax =
    urbanIndex > 68 && national.distributionBand !== 'broad_based'
      ? op10mA11Clamp(distDrag * 0.6 + national.capitalCityBias * 0.08, 0, 10)
      : 0;
  const remote =
    regionId === 'NT' || regionId === 'TAS' ? op10mA11Clamp(coupling * 0.05, 0, 4) : 0;
  return op10mA11Clamp(urbanIndex + lagBonus - hotspotTax + remote - distDrag * 0.35);
}

export function op10mA11BuildRegionInequalityRow(args: {
  regionId: OP10M_A11_RegionId;
  urbanIndex: number;
  relativeStanding: number;
  coupling: number;
  national: OP10M_A11_NationalSlice;
  leading: boolean;
  lagging: boolean;
}): OP10M_A11_RegionInequalityRow {
  const adjusted = op10mA11ApplyNationalSpilloverToStanding(
    args.urbanIndex,
    args.regionId,
    args.national,
    args.coupling,
  );
  const band = op10mA11GrowthBandFromScore(adjusted);
  const spilloverBand = op10mA11SpilloverBand(args.coupling, args.relativeStanding);
  const narrativeParts = [
    `${args.regionId} urban index ${op10mA11Round(adjusted)} (${band})`,
    spilloverBand !== 'isolated'
      ? `national–local link ${spilloverBand}`
      : 'limited national spillover',
  ];
  if (args.lagging) narrativeParts.push('lagging vs national peers');
  if (args.leading) narrativeParts.push('leading peer regions');
  return {
    regionId: args.regionId,
    urbanGrowthIndex: op10mA11Round(adjusted),
    relativeStanding: op10mA11Round(args.relativeStanding),
    band,
    lagging: args.lagging,
    leading: args.leading,
    spilloverBand,
    narrative: narrativeParts.join('; '),
  };
}


// --- source: infrastructure-bottlenecks.ts ---

const SEV_WEIGHT: Record<OP10M_A11_RegionTransportNeed['severity'], number> = {
  low: 4,
  moderate: 10,
  high: 22,
  critical: 36,
};

function bottleneckSeverity(score: number): OP10M_A11_BottleneckSeverity {
  if (score >= 58) return 'critical';
  if (score >= 34) return 'meaningful';
  if (score >= 18) return 'watch';
  return 'watch';
}

export function op10mA11DetectRegionalBottlenecks(args: {
  cities: OP10M_A11_CityGrowthSlice[];
  transportNeeds: OP10M_A11_RegionTransportNeed[];
  infraByRegion: Partial<Record<OP10M_A11_RegionId, number>>;
}): OP10M_A11_RegionalBottleneck[] {
  const out: OP10M_A11_RegionalBottleneck[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const drivers: string[] = [];
    let bindScore = 0;

    const openTransport = args.transportNeeds.filter(
      (n) => n.regionId === rid && n.category === 'transport' && n.status === 'open',
    );
    for (const need of openTransport) {
      bindScore += SEV_WEIGHT[need.severity];
      drivers.push(`open transport need (${need.severity})`);
    }

    const regionCities = args.cities.filter((c) => c.regionId === rid);
    const gateway = regionCities.filter((c) => c.gateway);
    for (const g of gateway) {
      if (g.growthBand === 'fast' || g.growthBand === 'surging') {
        if (g.absorptionHeadroom < 28) {
          bindScore += 16;
          drivers.push(`${g.cityId} growth binding (headroom ${g.absorptionHeadroom})`);
        }
      }
    }

    const infra = args.infraByRegion[rid] ?? 45;
    if (infra < 42) {
      bindScore += op10mA11Clamp(50 - infra, 0, 18);
      drivers.push(`low regional infrastructure (${infra})`);
    }

    bindScore = op10mA11Clamp(bindScore);
    if (bindScore < 18) continue;

    out.push({
      regionId: rid,
      severity: bottleneckSeverity(bindScore),
      bindScore: op10mA11Round(bindScore),
      drivers: drivers.slice(0, 4),
      explanation: `${rid} infrastructure bottleneck (${bottleneckSeverity(bindScore)}): ${drivers.slice(0, 2).join('; ')}`,
    });
  }

  return out.sort((a, b) => b.bindScore - a.bindScore);
}

export function op10mA11SummarizeBottlenecks(rows: OP10M_A11_RegionalBottleneck[]): string {
  if (!rows.length) return 'No regional infrastructure bottlenecks flagged.';
  const critical = rows.filter((r) => r.severity === 'critical').map((r) => r.regionId);
  const meaningful = rows.filter((r) => r.severity === 'meaningful').map((r) => r.regionId);
  return `Bottlenecks — critical: ${critical.join('/') || 'none'}; meaningful: ${meaningful.join('/') || 'none'}.`;
}


// --- source: intercity-dependencies.ts ---
  type OP10M_A11_DependencyCriticality,
  type OP10M_A11_IntercityDependencyEdge,
  type OP10M_A11_IntercityLinkSlice,
  type OP10M_A11_RegionId,
} from './types.ts';

function linkCriticality(link: OP10M_A11_IntercityLinkSlice, network: number): OP10M_A11_DependencyCriticality {
  let score = link.utilization * 0.55;
  if (link.strategic) score += 12;
  if (link.health === 'degraded' || link.health === 'severed') score += 18;
  if (link.health === 'operational' && link.utilization >= 72) score += 10;
  if (network < 35) score += 8;
  score = op10mA11Clamp(score);
  if (score >= 78) return 'essential';
  if (score >= 58) return 'high';
  if (score >= 36) return 'medium';
  return 'low';
}

export function op10mA11BuildIntercityDependencies(
  links: OP10M_A11_IntercityLinkSlice[],
  networkFreight: number,
  networkDigital: number,
): OP10M_A11_IntercityDependencyEdge[] {
  const network = (networkFreight + networkDigital) / 2;
  const byGroup = new Map<string, OP10M_A11_IntercityLinkSlice[]>();
  for (const link of links) {
    const g = link.redundancyGroup || link.linkId;
    const arr = byGroup.get(g) || [];
    arr.push(link);
    byGroup.set(g, arr);
  }

  const stressedGroups = new Set<string>();
  for (const [group, groupLinks] of byGroup) {
    const allStressed = groupLinks.every(
      (l) => l.utilization >= 70 || l.health === 'degraded' || l.health === 'severed',
    );
    if (allStressed && groupLinks.length >= 1) stressedGroups.add(group);
  }

  return links.map((link) => {
    const criticality = linkCriticality(link, network);
    const dependentRegions: OP10M_A11_RegionId[] = [link.regionA, link.regionB];
    const chokePoint = stressedGroups.has(link.redundancyGroup) && link.strategic;
    return {
      linkId: link.linkId,
      criticality,
      dependentRegions,
      chokePoint,
      explanation: chokePoint
        ? `${link.linkId} is a redundancy choke point (${link.kind}, ${link.health}).`
        : `${link.linkId} ${criticality} dependency for ${link.regionA}↔${link.regionB}.`,
    };
  });
}

export function op10mA11CorridorStressIndex(links: OP10M_A11_IntercityLinkSlice[]): number {
  if (!links.length) return 0;
  const avg =
    links.reduce((acc, l) => {
      const healthPenalty = l.health === 'severed' ? 30 : l.health === 'degraded' ? 18 : 0;
      return acc + op10mA11Clamp(l.utilization * 0.75 + healthPenalty);
    }, 0) / links.length;
  return op10mA11Round(avg);
}

export function op10mA11SummarizeDependencies(
  deps: OP10M_A11_IntercityDependencyEdge[],
  stress: number,
): string {
  const essential = deps.filter((d) => d.criticality === 'essential' || d.criticality === 'high').length;
  const choke = deps.filter((d) => d.chokePoint).length;
  return `Intercity stress ${stress}; ${essential} high/essential deps; ${choke} choke points.`;
}


// --- source: recompute.ts ---
  OP10M_A11_LIMITS,
  OP10M_A11_THRESHOLDS,
  op10mA11HashInputs,
  op10mA11InequalityBand,
  op10mA11InequalityIndex,
} from './constants.ts';
  op10mA11LeadingLaggingFlags,
  op10mA11RelativeStanding,
  op10mA11SummarizeInequality,
} from './regional-inequality.ts';
  OP10M_A11_CORE_REGIONS,
  OP10M_A11_SCHEMA_VERSION,
  type OP10M_A11_DerivedEvent,
  type OP10M_A11_Inputs,
  type OP10M_A11_Persisted,
  type OP10M_A11_RegionId,
  type OP10M_A11_State,
} from './types.ts';
  op10mA11AggregateUrbanGrowthByRegion,
  op10mA11BlendRegionalUrbanScore,
  op10mA11MetroRegionalGap,
} from './urban-growth-dynamics.ts';
  op10mA11BuildRegionInequalityRow,
  op10mA11NationalLocalCoupling,
} from './urban-national-links.ts';

export function createEmptyOP10M_A11_Persisted(): OP10M_A11_Persisted {
  return {
    schemaVersion: OP10M_A11_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    lastInequalityIndex: 0,
    lastInequalityBand: 'balanced',
    history: [],
    inputHash: '',
  };
}

export function validateOP10M_A11_State(state: OP10M_A11_State | null): string[] {
  if (!state) return ['null state'];
  const errs: string[] = [];
  if (state.schemaVersion !== OP10M_A11_SCHEMA_VERSION) errs.push('schema mismatch');
  if (state.inequalityIndex < 0 || state.inequalityIndex > OP10M_A11_LIMITS.inequalityIndexCap) {
    errs.push('inequality index out of range');
  }
  for (const rid of OP10M_A11_CORE_REGIONS) {
    if (!state.regions[rid]) errs.push(`missing region row ${rid}`);
  }
  return errs;
}

function pushDerived(
  list: Omit<OP10M_A11_DerivedEvent, 'id'>[],
  turn: number,
  kind: OP10M_A11_DerivedEvent['kind'],
  regionIds: OP10M_A11_RegionId[],
  text: string,
  significance: OP10M_A11_DerivedEvent['significance'] = 'meaningful',
) {
  if (list.length >= OP10M_A11_LIMITS.derivedPerTurn) return;
  list.push({ turn, kind, regionIds, text, significance });
}

export function recomputeOP10M_A11_RegionalUrbanLayer(
  inputs: OP10M_A11_Inputs,
  persisted: OP10M_A11_Persisted | null,
): {
  state: OP10M_A11_State;
  derived: OP10M_A11_DerivedEvent[];
  persisted: OP10M_A11_Persisted;
} {
  const base = persisted
    ? {
        ...persisted,
        history: [...persisted.history],
      }
    : createEmptyOP10M_A11_Persisted();

  if (base.initializedTurn === null) base.initializedTurn = inputs.turn;

  const urbanByRegion = op10mA11AggregateUrbanGrowthByRegion(inputs.cities);
  const rawScores = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    rawScores[rid] = op10mA11BlendRegionalUrbanScore(urbanByRegion[rid], inputs.regions[rid]);
  }

  const relative = op10mA11RelativeStanding(rawScores);
  const flags = op10mA11LeadingLaggingFlags(relative);
  const scoreList = OP10M_A11_CORE_REGIONS.map((r) => rawScores[r]);
  const inequalityIndex = op10mA11InequalityIndex(scoreList);
  const inequalityBand = op10mA11InequalityBand(inequalityIndex);
  const metroGap = op10mA11MetroRegionalGap(urbanByRegion);
  const coupling = op10mA11NationalLocalCoupling(inputs.national);

  const regions = {} as OP10M_A11_State['regions'];
  for (const rid of OP10M_A11_CORE_REGIONS) {
    regions[rid] = op10mA11BuildRegionInequalityRow({
      regionId: rid,
      urbanIndex: rawScores[rid],
      relativeStanding: relative[rid],
      coupling,
      national: inputs.national,
      leading: flags[rid].leading,
      lagging: flags[rid].lagging,
    });
  }

  const derivedRaw: Omit<OP10M_A11_DerivedEvent, 'id'>[] = [];
  const delta = inequalityIndex - base.lastInequalityIndex;
  if (base.revision > 0) {
    if (delta >= OP10M_A11_THRESHOLDS.widenDelta) {
      pushDerived(
        derivedRaw,
        inputs.turn,
        'inequality_widened',
        OP10M_A11_CORE_REGIONS.filter((r) => flags[r].lagging),
        `Regional inequality widened to ${inequalityBand}.`,
        inequalityBand === 'polarized' ? 'major' : 'meaningful',
      );
    } else if (delta <= -OP10M_A11_THRESHOLDS.widenDelta) {
      pushDerived(
        derivedRaw,
        inputs.turn,
        'inequality_narrowed',
        OP10M_A11_CORE_REGIONS.filter((r) => flags[r].leading),
        `Regional inequality narrowed toward ${inequalityBand}.`,
      );
    }
  }

  if (metroGap >= OP10M_A11_THRESHOLDS.metroGapMeaningful) {
    pushDerived(
      derivedRaw,
      inputs.turn,
      'metro_regional_divergence',
      OP10M_A11_CORE_REGIONS,
      `Metro–regional growth divergence elevated (gap ${metroGap.toFixed(1)}).`,
    );
  }

  if (coupling >= OP10M_A11_THRESHOLDS.spilloverConnected) {
    pushDerived(
      derivedRaw,
      inputs.turn,
      'national_spillover_boost',
      OP10M_A11_CORE_REGIONS.filter((r) => flags[r].lagging),
      'National corridor/network strength is transmitting growth spillovers to lagging regions.',
    );
  } else if (coupling < OP10M_A11_THRESHOLDS.spilloverWeak) {
    pushDerived(
      derivedRaw,
      inputs.turn,
      'national_spillover_drag',
      OP10M_A11_CORE_REGIONS,
      'Weak national–local coupling is isolating regions from aggregate momentum.',
      'minor',
    );
  }

  for (const rid of OP10M_A11_CORE_REGIONS) {
    if (!flags[rid].lagging) continue;
    if (regions[rid].urbanGrowthIndex - rawScores[rid] >= OP10M_A11_THRESHOLDS.catchUpDelta) {
      pushDerived(
        derivedRaw,
        inputs.turn,
        'lagging_region_catch_up',
        [rid],
        `${rid} received catch-up spillover from national–local links.`,
      );
    }
  }

  base.revision += 1;
  base.lastInequalityIndex = inequalityIndex;
  base.lastInequalityBand = inequalityBand;
  base.history.push({ turn: inputs.turn, inequalityIndex, band: inequalityBand });
  if (base.history.length > OP10M_A11_LIMITS.history) base.history.shift();
  base.inputHash = op10mA11HashInputs({
    turn: inputs.turn,
    cityCount: inputs.cities.length,
    regionKeys: Object.keys(inputs.regions).sort().join(','),
    nationalGrowth: inputs.national.nationalGrowthBand,
  });

  const leading = OP10M_A11_CORE_REGIONS.filter((r) => flags[r].leading);
  const lagging = OP10M_A11_CORE_REGIONS.filter((r) => flags[r].lagging);

  const state: OP10M_A11_State = {
    schemaVersion: OP10M_A11_SCHEMA_VERSION,
    revision: base.revision,
    turn: inputs.turn,
    inequalityIndex,
    inequalityBand,
    metroRegionalGap: metroGap,
    nationalLocalCoupling: coupling,
    regions,
    summary: op10mA11SummarizeInequality({
      inequalityIndex,
      inequalityBand,
      metroGap,
      leading,
      lagging,
    }),
    inputHash: base.inputHash,
  };

  const derived: OP10M_A11_DerivedEvent[] = derivedRaw.map((d, i) => ({
    ...d,
    id: `a11_${inputs.turn}_${i}_${d.kind}`,
  }));

  return { state, derived, persisted: base };
}

export function buildOP10M_A11_InputsFromFixtures(
  partial: Partial<OP10M_A11_Inputs> & { turn: number },
): OP10M_A11_Inputs {
  return {
    turn: partial.turn,
    cities: partial.cities ?? [],
    regions: partial.regions ?? {},
    national: {
      turn: partial.turn,
      nationalGrowthBand: partial.national?.nationalGrowthBand ?? 'steady',
      distributionBand: partial.national?.distributionBand ?? 'mixed',
      networkFreight: partial.national?.networkFreight ?? 50,
      networkDigital: partial.national?.networkDigital ?? 50,
      capitalCityBias: partial.national?.capitalCityBias ?? 12,
    },
  };
}


// --- source: recompute-intercity-infra.ts ---
  op10mA11BuildIntercityDependencies,
  op10mA11CorridorStressIndex,
  op10mA11SummarizeDependencies,
} from './intercity-dependencies.ts';
  OP10M_A11_CORE_REGIONS,
  OP10M_A11_INFRA_SCHEMA_VERSION,
  type OP10M_A11_InfraDerivedEvent,
  type OP10M_A11_InfraInputs,
  type OP10M_A11_InfraPersisted,
  type OP10M_A11_InfraState,
  type OP10M_A11_RegionId,
} from './types.ts';

export function createEmptyOP10M_A11_InfraPersisted(): OP10M_A11_InfraPersisted {
  return {
    schemaVersion: OP10M_A11_INFRA_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    lastStressIndex: 0,
    stressedLinkIds: [],
    inputHash: '',
  };
}

export function validateOP10M_A11_InfraState(state: OP10M_A11_InfraState | null): string[] {
  if (!state) return ['null infra state'];
  const errs: string[] = [];
  if (state.schemaVersion !== OP10M_A11_INFRA_SCHEMA_VERSION) errs.push('infra schema mismatch');
  if (state.corridorStressIndex < 0 || state.corridorStressIndex > 100) errs.push('stress out of range');
  for (const b of state.bottlenecks) {
    if (b.bindScore < 0 || b.bindScore > 100) errs.push(`bind score ${b.regionId}`);
  }
  return errs;
}

function pushInfraDerived(
  list: Omit<OP10M_A11_InfraDerivedEvent, 'id'>[],
  turn: number,
  kind: OP10M_A11_InfraDerivedEvent['kind'],
  regionIds: OP10M_A11_RegionId[],
  linkId: string | null,
  text: string,
  significance: OP10M_A11_InfraDerivedEvent['significance'] = 'meaningful',
) {
  if (list.length >= 16) return;
  list.push({ turn, kind, regionIds, linkId, text, significance });
}

export function buildOP10M_A11_InfraInputsFromFixtures(
  partial: Partial<OP10M_A11_InfraInputs> & { turn: number },
): OP10M_A11_InfraInputs {
  return {
    turn: partial.turn,
    links: partial.links ?? [],
    cities: partial.cities ?? [],
    transportNeeds: partial.transportNeeds ?? [],
    regions: partial.regions ?? {},
    networkFreight: partial.networkFreight ?? 50,
    networkDigital: partial.networkDigital ?? 50,
  };
}

export function recomputeOP10M_A11_IntercityInfraLayer(
  inputs: OP10M_A11_InfraInputs,
  persisted: OP10M_A11_InfraPersisted | null,
): {
  state: OP10M_A11_InfraState;
  derived: OP10M_A11_InfraDerivedEvent[];
  persisted: OP10M_A11_InfraPersisted;
} {
  const base = persisted ? { ...persisted, stressedLinkIds: [...persisted.stressedLinkIds] } : createEmptyOP10M_A11_InfraPersisted();
  if (base.initializedTurn === null) base.initializedTurn = inputs.turn;

  const infraByRegion = {} as Partial<Record<OP10M_A11_RegionId, number>>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    infraByRegion[rid] = inputs.regions[rid]?.infrastructureQuality ?? 45;
  }

  const bottlenecks = op10mA11DetectRegionalBottlenecks({
    cities: inputs.cities,
    transportNeeds: inputs.transportNeeds,
    infraByRegion,
  });
  const dependencies = op10mA11BuildIntercityDependencies(
    inputs.links,
    inputs.networkFreight,
    inputs.networkDigital,
  );
  const corridorStressIndex = op10mA11CorridorStressIndex(inputs.links);

  const derivedRaw: Omit<OP10M_A11_InfraDerivedEvent, 'id'>[] = [];
  if (base.revision > 0) {
    for (const b of bottlenecks) {
      if (b.severity === 'critical' || b.severity === 'meaningful') {
        pushInfraDerived(
          derivedRaw,
          inputs.turn,
          'regional_bottleneck_emerged',
          [b.regionId],
          null,
          b.explanation,
          b.severity === 'critical' ? 'major' : 'meaningful',
        );
      }
    }
    if (corridorStressIndex + 4 < base.lastStressIndex) {
      pushInfraDerived(
        derivedRaw,
        inputs.turn,
        'regional_bottleneck_eased',
        OP10M_A11_CORE_REGIONS,
        null,
        'Corridor stress eased vs prior turn.',
        'minor',
      );
    }
  }

  for (const dep of dependencies) {
    if (dep.chokePoint) {
      pushInfraDerived(
        derivedRaw,
        inputs.turn,
        'intercity_chokepoint',
        dep.dependentRegions,
        dep.linkId,
        dep.explanation,
        'major',
      );
    } else if (dep.criticality === 'essential' || dep.criticality === 'high') {
      pushInfraDerived(
        derivedRaw,
        inputs.turn,
        'intercity_dependency_critical',
        dep.dependentRegions,
        dep.linkId,
        dep.explanation,
      );
    }
  }

  const stressedNow = inputs.links.filter((l) => l.utilization >= 75 || l.health === 'degraded').map((l) => l.linkId);
  base.revision += 1;
  base.lastStressIndex = corridorStressIndex;
  base.stressedLinkIds = stressedNow.slice(0, 32);
  base.inputHash = op10mA11HashInputs({
    turn: inputs.turn,
    cityCount: inputs.cities.length,
    regionKeys: Object.keys(inputs.regions).sort().join(','),
    nationalGrowth: `${inputs.links.length}:${inputs.networkFreight}`,
  });

  const state: OP10M_A11_InfraState = {
    schemaVersion: OP10M_A11_INFRA_SCHEMA_VERSION,
    revision: base.revision,
    turn: inputs.turn,
    bottlenecks,
    dependencies,
    corridorStressIndex,
    summary: `${op10mA11SummarizeBottlenecks(bottlenecks)} ${op10mA11SummarizeDependencies(dependencies, corridorStressIndex)}`,
    inputHash: base.inputHash,
  };

  const derived: OP10M_A11_InfraDerivedEvent[] = derivedRaw.map((d, i) => ({
    ...d,
    id: `a11i_${inputs.turn}_${i}_${d.kind}`,
  }));

  return { state, derived, persisted: base };
}

export function op10mA11InfraBindPenalty(state: OP10M_A11_InfraState | null, regionId: OP10M_A11_RegionId): number {
  if (!state) return 0;
  const row = state.bottlenecks.find((b) => b.regionId === regionId);
  if (!row) return 0;
  return op10mA11Clamp(row.bindScore * 0.12, 0, 10);
}


// --- source: urban-hierarchy.ts ---
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_PrimateBand,
  type OP10M_A11_RegionId,
  type OP10M_A11_UrbanHierarchyRow,
} from './types.ts';

function primateBand(index: number): OP10M_A11_PrimateBand {
  if (index < 22) return 'decentralized';
  if (index < 40) return 'balanced';
  if (index < 62) return 'concentrated';
  return 'hyper_concentrated';
}

export function op10mA11ComputeUrbanHierarchy(cities: OP10M_A11_CityGrowthSlice[]): OP10M_A11_UrbanHierarchyRow[] {
  const rows: OP10M_A11_UrbanHierarchyRow[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const regionCities = cities.filter((c) => c.regionId === rid);
    if (!regionCities.length) {
      rows.push({
        regionId: rid,
        primateIndex: 30,
        primateBand: 'balanced',
        gatewayShare: 0,
        secondaryMomentum: 40,
        narrative: `${rid}: no tracked cities — neutral hierarchy prior.`,
      });
      continue;
    }

    const gateways = regionCities.filter((c) => c.gateway);
    const secondaries = regionCities.filter((c) => !c.gateway);
    const totalGrowth = regionCities.reduce((a, c) => a + c.growthScore, 0) || 1;
    const gatewayGrowth = gateways.reduce((a, c) => a + c.growthScore, 0);
    const gatewayShare = op10mA11Clamp((gatewayGrowth / totalGrowth) * 100);
    const secondaryMomentum =
      secondaries.length > 0
        ? secondaries.reduce((a, c) => a + c.growthScore, 0) / secondaries.length
        : gatewayGrowth / Math.max(1, gateways.length);

    const top = Math.max(...regionCities.map((c) => c.growthScore));
    const restAvg =
      regionCities.length > 1
        ? (totalGrowth - top) / (regionCities.length - 1)
        : top * 0.6;
    const primateIndex = op10mA11Clamp((top / Math.max(1, restAvg) - 1) * 28 + gatewayShare * 0.35);
    const band = primateBand(primateIndex);

    rows.push({
      regionId: rid,
      primateIndex: op10mA11Round(primateIndex),
      primateBand: band,
      gatewayShare: op10mA11Round(gatewayShare),
      secondaryMomentum: op10mA11Round(secondaryMomentum),
      narrative: `${rid} primate ${band} (index ${op10mA11Round(primateIndex)}); gateway share ${op10mA11Round(gatewayShare)}%.`,
    });
  }

  return rows;
}

export function op10mA11NationalPrimateIndex(hierarchy: OP10M_A11_UrbanHierarchyRow[]): number {
  if (!hierarchy.length) return 0;
  const avg = hierarchy.reduce((a, h) => a + h.primateIndex, 0) / hierarchy.length;
  const hyper = hierarchy.filter((h) => h.primateBand === 'hyper_concentrated' || h.primateBand === 'concentrated').length;
  return op10mA11Round(op10mA11Clamp(avg + hyper * 4));
}


// --- source: regional-linkage-matrix.ts ---
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_IntercityLinkSlice,
  type OP10M_A11_LinkageBand,
  type OP10M_A11_RegionId,
  type OP10M_A11_RegionalLinkageEdge,
} from './types.ts';

function linkageBand(strength: number): OP10M_A11_LinkageBand {
  if (strength < 18) return 'weak';
  if (strength < 38) return 'moderate';
  if (strength < 58) return 'strong';
  return 'structural';
}

export function op10mA11BuildRegionalLinkageMatrix(
  links: OP10M_A11_IntercityLinkSlice[],
): OP10M_A11_RegionalLinkageEdge[] {
  const acc = new Map<string, { strength: number; count: number }>();

  for (const link of links) {
    if (link.regionA === link.regionB) continue;
    const key = [link.regionA, link.regionB].sort().join('::');
    const healthPenalty =
      link.health === 'severed' ? 0.15 : link.health === 'degraded' ? 0.55 : link.health === 'operational' ? 0.85 : 1;
    const add = op10mA11Clamp(link.utilization * 0.45 * healthPenalty + (link.strategic ? 8 : 0));
    const prev = acc.get(key) || { strength: 0, count: 0 };
    prev.strength += add;
    prev.count += 1;
    acc.set(key, prev);
  }

  const out: OP10M_A11_RegionalLinkageEdge[] = [];
  for (const [key, val] of acc) {
    const [fromRegion, toRegion] = key.split('::') as [OP10M_A11_RegionId, OP10M_A11_RegionId];
    const strength = op10mA11Clamp(val.strength / Math.max(1, val.count) + val.count * 2);
    out.push({
      fromRegion,
      toRegion,
      strength: op10mA11Round(strength),
      band: linkageBand(strength),
      viaLinks: val.count,
    });
  }

  return out.sort((a, b) => b.strength - a.strength);
}

export function op10mA11LinkageFragilityIndex(
  linkages: OP10M_A11_RegionalLinkageEdge[],
  corridorStress: number,
): number {
  const pairsPossible = (OP10M_A11_CORE_REGIONS.length * (OP10M_A11_CORE_REGIONS.length - 1)) / 2;
  const weakShare = linkages.filter((l) => l.band === 'weak').length / Math.max(1, pairsPossible);
  const strongShare = linkages.filter((l) => l.band === 'strong' || l.band === 'structural').length / Math.max(1, pairsPossible);
  return op10mA11Round(op10mA11Clamp(weakShare * 55 + corridorStress * 0.35 - strongShare * 18 + 12));
}

export function op10mA11RegionsWithWeakLinkage(
  linkages: OP10M_A11_RegionalLinkageEdge[],
): OP10M_A11_RegionId[] {
  const weakCount = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) weakCount[rid] = 0;
  for (const l of linkages) {
    if (l.band !== 'weak') continue;
    weakCount[l.fromRegion] += 1;
    weakCount[l.toRegion] += 1;
  }
  return OP10M_A11_CORE_REGIONS.filter((r) => weakCount[r] >= 2);
}


// --- source: relief-playbook.ts ---
  OP10M_A11_RegionalBottleneck,
  OP10M_A11_RegionId,
  OP10M_A11_ReliefPlaybookItem,
  OP10M_A11_UrbanHierarchyRow,
} from './types.ts';

export function op10mA11BuildReliefPlaybook(args: {
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  hierarchy: OP10M_A11_UrbanHierarchyRow[];
  weakLinkageRegions: OP10M_A11_RegionId[];
}): OP10M_A11_ReliefPlaybookItem[] {
  const out: OP10M_A11_ReliefPlaybookItem[] = [];

  for (const rid of args.weakLinkageRegions) {
    out.push({
      regionId: rid,
      priority: 'medium',
      actions: [
        'Restore redundant intercity corridor capacity',
        'Prioritize strategic freight/digital backbone upgrades',
      ],
      rationale: `${rid} sits on multiple weak regional linkages — growth spillovers are fragile.`,
    });
  }

  for (const b of args.bottlenecks) {
    const h = args.hierarchy.find((x) => x.regionId === b.regionId);
    const actions: string[] = [];
    if (b.drivers.some((d) => d.includes('transport need'))) {
      actions.push('Clear open transport infrastructure needs before new urban projects');
    }
    if (b.drivers.some((d) => d.includes('headroom'))) {
      actions.push('Sequence housing/transport absorption projects in gateway cities');
    }
    if (b.drivers.some((d) => d.includes('infrastructure'))) {
      actions.push('Target regional infrastructure quality uplift (not cash transfers)');
    }
    if (h && (h.primateBand === 'concentrated' || h.primateBand === 'hyper_concentrated')) {
      actions.push('Seed secondary-city growth programs to reduce primate concentration');
    }
    if (!actions.length) actions.push('Monitor binding constraints; no automatic capital dispatch');

    const priority =
      b.severity === 'critical' ? 'urgent' : b.severity === 'meaningful' ? 'high' : 'medium';

    out.push({
      regionId: b.regionId,
      priority,
      actions: actions.slice(0, 4),
      rationale: b.explanation,
    });
  }

  const byRegion = new Map<OP10M_A11_RegionId, OP10M_A11_ReliefPlaybookItem>();
  for (const item of out) {
    const prev = byRegion.get(item.regionId);
    if (!prev || item.priority === 'urgent' || (item.priority === 'high' && prev.priority !== 'urgent')) {
      byRegion.set(item.regionId, item);
    }
  }
  return [...byRegion.values()].sort((a, b) => {
    const rank = { urgent: 4, high: 3, medium: 2, low: 1 };
    return rank[b.priority] - rank[a.priority];
  });
}


// --- source: composite-recompute.ts ---
  op10mA11BuildRegionalLinkageMatrix,
  op10mA11LinkageFragilityIndex,
  op10mA11RegionsWithWeakLinkage,
} from './regional-linkage-matrix.ts';
  buildOP10M_A11_InfraInputsFromFixtures,
  createEmptyOP10M_A11_InfraPersisted,
  recomputeOP10M_A11_IntercityInfraLayer,
} from './recompute-intercity-infra.ts';
  buildOP10M_A11_InputsFromFixtures,
  createEmptyOP10M_A11_Persisted,
  recomputeOP10M_A11_RegionalUrbanLayer,
} from './recompute.ts';
  OP10M_A11_COMPOSITE_SCHEMA_VERSION,
  type OP10M_A11_CompositeDerivedEvent,
  type OP10M_A11_CompositeInputs,
  type OP10M_A11_CompositePersisted,
  type OP10M_A11_CompositeState,
  type OP10M_A11_RegionId,
} from './types.ts';
  op10mA11ComputeCorridorFlows,
  op10mA11MaxCorridorFlow,
  op10mA11SurgeCorridors,
} from './urban-corridor-flow.ts';
  op10mA11AnalyzeLinkageHubs,
  op10mA11DeeplyIsolatedRegions,
  op10mA11OverloadedHubs,
} from './linkage-hub-centrality.ts';

export function createEmptyOP10M_A11_CompositePersisted(): OP10M_A11_CompositePersisted {
  return {
    schemaVersion: OP10M_A11_COMPOSITE_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    urban: createEmptyOP10M_A11_Persisted(),
    infra: createEmptyOP10M_A11_InfraPersisted(),
    lastFragilityIndex: 0,
    lastMaxCorridorFlow: 0,
    inputHash: '',
  };
}

export function validateOP10M_A11_CompositeState(state: OP10M_A11_CompositeState | null): string[] {
  if (!state) return ['null composite state'];
  const errs: string[] = [];
  if (state.schemaVersion !== OP10M_A11_COMPOSITE_SCHEMA_VERSION) errs.push('composite schema mismatch');
  if (state.fragilityIndex < 0 || state.fragilityIndex > 100) errs.push('fragility out of range');
  if (state.hierarchy.length !== 8) errs.push('hierarchy row count');
  if (state.linkageHubs.length !== 8) errs.push('hub profile count');
  if (state.maxCorridorFlow < 0 || state.maxCorridorFlow > 100) errs.push('max corridor flow');
  return errs;
}

function pushCompositeDerived(
  list: Omit<OP10M_A11_CompositeDerivedEvent, 'id'>[],
  turn: number,
  kind: OP10M_A11_CompositeDerivedEvent['kind'],
  regionIds: OP10M_A11_RegionId[],
  text: string,
  significance: OP10M_A11_CompositeDerivedEvent['significance'] = 'meaningful',
) {
  if (list.length >= 12) return;
  list.push({ turn, kind, regionIds, text, significance });
}

export function recomputeOP10M_A11_CitiesRegionsComposite(
  inputs: OP10M_A11_CompositeInputs,
  persisted: OP10M_A11_CompositePersisted | null,
): {
  state: OP10M_A11_CompositeState;
  derived: OP10M_A11_CompositeDerivedEvent[];
  persisted: OP10M_A11_CompositePersisted;
} {
  const base = persisted
    ? {
        ...persisted,
        urban: { ...persisted.urban, history: [...persisted.urban.history] },
        infra: { ...persisted.infra, stressedLinkIds: [...persisted.infra.stressedLinkIds] },
      }
    : createEmptyOP10M_A11_CompositePersisted();

  if (base.initializedTurn === null) base.initializedTurn = inputs.urban.turn;

  const urbanOut = recomputeOP10M_A11_RegionalUrbanLayer(inputs.urban, base.urban);
  const infraOut = recomputeOP10M_A11_IntercityInfraLayer(inputs.infra, base.infra);

  const hierarchy = op10mA11ComputeUrbanHierarchy(inputs.urban.cities);
  const nationalPrimateIndex = op10mA11NationalPrimateIndex(hierarchy);
  const linkages = op10mA11BuildRegionalLinkageMatrix(inputs.infra.links);
  const corridorFlows = op10mA11ComputeCorridorFlows({
    cities: inputs.urban.cities,
    links: inputs.infra.links,
    linkages,
  });
  const maxCorridorFlow = op10mA11MaxCorridorFlow(corridorFlows);
  const linkageHubs = op10mA11AnalyzeLinkageHubs(linkages);
  const fragilityIndex = op10mA11LinkageFragilityIndex(linkages, infraOut.state.corridorStressIndex);
  const weakRegions = op10mA11RegionsWithWeakLinkage(linkages);
  const reliefPlaybook = op10mA11BuildReliefPlaybook({
    bottlenecks: infraOut.state.bottlenecks,
    hierarchy,
    weakLinkageRegions: weakRegions,
  });

  const derivedRaw: Omit<OP10M_A11_CompositeDerivedEvent, 'id'>[] = [];
  if (nationalPrimateIndex >= 58) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'primate_concentration_risk',
      hierarchy.filter((h) => h.primateBand === 'concentrated' || h.primateBand === 'hyper_concentrated').map((h) => h.regionId),
      `National primate concentration elevated (index ${nationalPrimateIndex}).`,
      nationalPrimateIndex >= 68 ? 'major' : 'meaningful',
    );
  }
  if (fragilityIndex >= 45 || (base.revision > 0 && fragilityIndex > base.lastFragilityIndex + 5)) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'regional_linkage_fragility',
      weakRegions,
      `Regional linkage fragility index ${fragilityIndex.toFixed(1)}.`,
    );
  }
  const urgent = reliefPlaybook.filter((r) => r.priority === 'urgent' || r.priority === 'high');
  if (urgent.length) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'integrated_relief_priority',
      urgent.map((u) => u.regionId),
      `Integrated relief priorities: ${urgent.map((u) => u.regionId).join(', ')}.`,
    );
  }

  const surge = op10mA11SurgeCorridors(corridorFlows);
  if (surge.length) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'corridor_flow_surge',
      [...new Set(surge.flatMap((s) => [s.fromRegion, s.toRegion]))],
      `Corridor flow surge on ${surge.length} regional pair(s); peak pressure ${maxCorridorFlow.toFixed(1)}.`,
      maxCorridorFlow >= 72 ? 'major' : 'meaningful',
    );
  }

  const overloaded = op10mA11OverloadedHubs(linkageHubs);
  if (overloaded.length) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'linkage_hub_overload',
      overloaded.map((h) => h.regionId),
      `Linkage hubs under load: ${overloaded.map((h) => h.regionId).join(', ')}.`,
    );
  }

  const isolated = op10mA11DeeplyIsolatedRegions(linkageHubs);
  if (isolated.length >= 2) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'peripheral_isolation_deepening',
      isolated,
      `Peripheral isolation deepening for ${isolated.join(', ')}.`,
      'minor',
    );
  }

  base.revision += 1;
  base.urban = urbanOut.persisted;
  base.infra = infraOut.persisted;
  base.lastFragilityIndex = fragilityIndex;
  base.lastMaxCorridorFlow = maxCorridorFlow;
  base.inputHash = op10mA11HashInputs({
    turn: inputs.urban.turn,
    cityCount: inputs.urban.cities.length,
    regionKeys: 'composite',
    nationalGrowth: `${fragilityIndex}:${nationalPrimateIndex}:${maxCorridorFlow}`,
  });

  const state: OP10M_A11_CompositeState = {
    schemaVersion: OP10M_A11_COMPOSITE_SCHEMA_VERSION,
    revision: base.revision,
    turn: inputs.urban.turn,
    urban: urbanOut.state,
    infra: infraOut.state,
    hierarchy,
    linkages,
    corridorFlows,
    linkageHubs,
    reliefPlaybook,
    fragilityIndex,
    nationalPrimateIndex,
    maxCorridorFlow,
    summary: `${urbanOut.state.summary} ${infraOut.state.summary} Fragility ${fragilityIndex}; primate ${nationalPrimateIndex}; peak flow ${maxCorridorFlow}.`,
    inputHash: base.inputHash,
  };

  const derived: OP10M_A11_CompositeDerivedEvent[] = derivedRaw.map((d, i) => ({
    ...d,
    id: `a11c_${inputs.urban.turn}_${i}_${d.kind}`,
  }));

  return { state, derived, persisted: base };
}

export function buildOP10M_A11_CompositeInputsFromFixtures(
  partial: Partial<OP10M_A11_CompositeInputs> & { turn: number },
): OP10M_A11_CompositeInputs {
  return {
    urban: buildOP10M_A11_InputsFromFixtures({ turn: partial.turn, ...partial.urban }),
    infra: buildOP10M_A11_InfraInputsFromFixtures({ turn: partial.turn, ...partial.infra }),
  };
}


// --- source: urban-corridor-flow.ts ---
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_FlowPressureBand,
  type OP10M_A11_IntercityLinkSlice,
  type OP10M_A11_RegionId,
  type OP10M_A11_CorridorFlowRow,
  type OP10M_A11_RegionalLinkageEdge,
} from './types.ts';

function flowBand(pressure: number): OP10M_A11_FlowPressureBand {
  if (pressure < 28) return 'light';
  if (pressure < 48) return 'moderate';
  if (pressure < 68) return 'heavy';
  return 'surge';
}

function regionUrbanPulse(cities: OP10M_A11_CityGrowthSlice[], rid: OP10M_A11_RegionId): number {
  const rows = cities.filter((c) => c.regionId === rid);
  if (!rows.length) return 45;
  return rows.reduce((a, c) => a + c.growthScore, 0) / rows.length;
}

export function op10mA11ComputeCorridorFlows(args: {
  cities: OP10M_A11_CityGrowthSlice[];
  links: OP10M_A11_IntercityLinkSlice[];
  linkages: OP10M_A11_RegionalLinkageEdge[];
}): OP10M_A11_CorridorFlowRow[] {
  const pulse = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) pulse[rid] = regionUrbanPulse(args.cities, rid);

  const linkageByKey = new Map<string, OP10M_A11_RegionalLinkageEdge>();
  for (const l of args.linkages) {
    linkageByKey.set([l.fromRegion, l.toRegion].sort().join('::'), l);
  }

  const acc = new Map<string, { pressure: number; gradient: number; n: number }>();

  for (const link of args.links) {
    if (link.regionA === link.regionB) continue;
    const key = [link.regionA, link.regionB].sort().join('::');
    const grad = Math.abs(pulse[link.regionA] - pulse[link.regionB]);
    const util = link.utilization;
    const healthDrag =
      link.health === 'severed' ? 0.2 : link.health === 'degraded' ? 0.65 : link.health === 'operational' ? 0.9 : 1;
    const add = op10mA11Clamp(util * 0.58 * healthDrag + grad * 0.38 + (link.strategic ? 12 : 0));
    const prev = acc.get(key) || { pressure: 0, gradient: 0, n: 0 };
    prev.pressure += add;
    prev.gradient = Math.max(prev.gradient, grad);
    prev.n += 1;
    acc.set(key, prev);
  }

  const out: OP10M_A11_CorridorFlowRow[] = [];
  for (const [key, val] of acc) {
    const [fromRegion, toRegion] = key.split('::') as [OP10M_A11_RegionId, OP10M_A11_RegionId];
    const linkage = linkageByKey.get(key);
    const linkageBoost = linkage ? linkage.strength * 0.08 : 0;
    const flowPressure = op10mA11Clamp(val.pressure / Math.max(1, val.n) + linkageBoost);
    const band = flowBand(flowPressure);
    out.push({
      fromRegion,
      toRegion,
      flowPressure: op10mA11Round(flowPressure),
      band,
      growthGradient: op10mA11Round(val.gradient),
      explanation: `${fromRegion}↔${toRegion} corridor ${band} (pressure ${op10mA11Round(flowPressure)}, gradient ${op10mA11Round(val.gradient)}).`,
    });
  }

  return out.sort((a, b) => b.flowPressure - a.flowPressure);
}

export function op10mA11MaxCorridorFlow(flows: OP10M_A11_CorridorFlowRow[]): number {
  if (!flows.length) return 0;
  return Math.max(...flows.map((f) => f.flowPressure));
}

export function op10mA11SurgeCorridors(flows: OP10M_A11_CorridorFlowRow[]): OP10M_A11_CorridorFlowRow[] {
  return flows.filter((f) => f.band === 'surge' || f.band === 'heavy');
}


// --- source: linkage-hub-centrality.ts ---
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_HubRole,
  type OP10M_A11_LinkageHubProfile,
  type OP10M_A11_RegionId,
  type OP10M_A11_RegionalLinkageEdge,
} from './types.ts';

function hubRole(weighted: number, degree: number): OP10M_A11_HubRole {
  if (weighted >= 62 && degree >= 4) return 'national_hub';
  if (weighted >= 42 && degree >= 3) return 'regional_hub';
  if (degree >= 2) return 'connector';
  return 'peripheral';
}

export function op10mA11AnalyzeLinkageHubs(
  linkages: OP10M_A11_RegionalLinkageEdge[],
): OP10M_A11_LinkageHubProfile[] {
  const degree = {} as Record<OP10M_A11_RegionId, number>;
  const weight = {} as Record<OP10M_A11_RegionId, number>;
  for (const rid of OP10M_A11_CORE_REGIONS) {
    degree[rid] = 0;
    weight[rid] = 0;
  }

  for (const edge of linkages) {
    degree[edge.fromRegion] += 1;
    degree[edge.toRegion] += 1;
    weight[edge.fromRegion] += edge.strength;
    weight[edge.toRegion] += edge.strength;
  }

  const maxWeight = Math.max(...OP10M_A11_CORE_REGIONS.map((r) => weight[r]), 1);

  return OP10M_A11_CORE_REGIONS.map((regionId) => {
    const deg = degree[regionId];
    const weightedCentrality = op10mA11Clamp((weight[regionId] / maxWeight) * 100);
    const role = hubRole(weightedCentrality, deg);
    const isolationScore = op10mA11Clamp(100 - weightedCentrality * 0.75 - deg * 6);
    return {
      regionId,
      degree: deg,
      weightedCentrality: op10mA11Round(weightedCentrality),
      role,
      isolationScore: op10mA11Round(isolationScore),
      narrative: `${regionId} linkage role ${role} (degree ${deg}, isolation ${op10mA11Round(isolationScore)}).`,
    };
  }).sort((a, b) => b.weightedCentrality - a.weightedCentrality);
}

export function op10mA11OverloadedHubs(hubs: OP10M_A11_LinkageHubProfile[]): OP10M_A11_LinkageHubProfile[] {
  return hubs.filter(
    (h) =>
      (h.role === 'national_hub' || h.role === 'regional_hub') &&
      h.weightedCentrality >= 55 &&
      h.degree >= 3,
  );
}

export function op10mA11DeeplyIsolatedRegions(hubs: OP10M_A11_LinkageHubProfile[]): OP10M_A11_RegionId[] {
  return hubs.filter((h) => h.isolationScore >= 72 && h.role === 'peripheral').map((h) => h.regionId);
}


// --- source: self-tests.ts ---
  OP10M_A11_CORE_REGIONS,
  type OP10M_A11_CityGrowthSlice,
  type OP10M_A11_SelfTestResult,
} from './types.ts';
  op10mA11InequalityBand,
  op10mA11InequalityIndex,
  op10mA11GrowthBandFromScore,
} from './constants.ts';
  buildOP10M_A11_InputsFromFixtures,
  createEmptyOP10M_A11_Persisted,
  recomputeOP10M_A11_RegionalUrbanLayer,
  validateOP10M_A11_State,
} from './recompute.ts';
  buildOP10M_A11_InfraInputsFromFixtures,
  createEmptyOP10M_A11_InfraPersisted,
  recomputeOP10M_A11_IntercityInfraLayer,
  validateOP10M_A11_InfraState,
} from './recompute-intercity-infra.ts';
  buildOP10M_A11_CompositeInputsFromFixtures,
  recomputeOP10M_A11_CitiesRegionsComposite,
  validateOP10M_A11_CompositeState,
} from './composite-recompute.ts';
  op10mA11ComputeCorridorFlows,
  op10mA11MaxCorridorFlow,
} from './urban-corridor-flow.ts';

function push(out: OP10M_A11_SelfTestResult[], id: string, passed: boolean, detail: string) {
  out.push({ id, passed, detail });
}

const sampleCities: OP10M_A11_CityGrowthSlice[] = [
  {
    cityId: 'sydney',
    regionId: 'NSW',
    growthScore: 72,
    growthBand: 'fast',
    absorptionHeadroom: 22,
    gateway: true,
  },
  {
    cityId: 'newcastle',
    regionId: 'NSW',
    growthScore: 48,
    growthBand: 'steady',
    absorptionHeadroom: 40,
    gateway: false,
  },
  {
    cityId: 'melbourne',
    regionId: 'VIC',
    growthScore: 68,
    growthBand: 'fast',
    absorptionHeadroom: 28,
    gateway: true,
  },
  {
    cityId: 'hobart',
    regionId: 'TAS',
    growthScore: 38,
    growthBand: 'slow',
    absorptionHeadroom: 52,
    gateway: true,
  },
  {
    cityId: 'darwin',
    regionId: 'NT',
    growthScore: 34,
    growthBand: 'slow',
    absorptionHeadroom: 55,
    gateway: true,
  },
];

export function runOP10M_A11_SelfTests(): OP10M_A11_SelfTestResult[] {
  const out: OP10M_A11_SelfTestResult[] = [];

  push(out, 'a11_01', OP10M_A11_CORE_REGIONS.length === 8, 'core region catalog');
  push(
    out,
    'a11_02',
    op10mA11GrowthBandFromScore(80) === 'surging' && op10mA11GrowthBandFromScore(10) === 'contracting',
    'growth band mapping',
  );

  const idxBalanced = op10mA11InequalityIndex([50, 51, 49, 50, 52, 48, 50, 51]);
  const idxPolar = op10mA11InequalityIndex([30, 35, 40, 45, 50, 55, 70, 85]);
  push(
    out,
    'a11_03',
    idxBalanced < idxPolar && op10mA11InequalityBand(idxPolar) !== 'balanced',
    `inequality index ${idxBalanced.toFixed(1)} vs ${idxPolar.toFixed(1)}`,
  );

  const inputs = buildOP10M_A11_InputsFromFixtures({
    turn: 3,
    cities: sampleCities,
    regions: {
      NSW: {
        regionId: 'NSW',
        economyScore: 58,
        momentumBand: 'growing',
        developmentTier: 'advanced',
        infrastructureQuality: 60,
      },
      VIC: {
        regionId: 'VIC',
        economyScore: 56,
        momentumBand: 'growing',
        developmentTier: 'advanced',
        infrastructureQuality: 58,
      },
      TAS: {
        regionId: 'TAS',
        economyScore: 44,
        momentumBand: 'stable',
        developmentTier: 'developing',
        infrastructureQuality: 46,
      },
      NT: {
        regionId: 'NT',
        economyScore: 42,
        momentumBand: 'weakening',
        developmentTier: 'emerging',
        infrastructureQuality: 40,
      },
    },
    national: {
      turn: 3,
      nationalGrowthBand: 'strong',
      distributionBand: 'uneven',
      networkFreight: 62,
      networkDigital: 58,
      capitalCityBias: 14,
    },
  });

  const first = recomputeOP10M_A11_RegionalUrbanLayer(inputs, null);
  push(
    out,
    'a11_04',
    validateOP10M_A11_State(first.state).length === 0 && first.state.regions.NSW.leading,
    first.state.summary,
  );

  const second = recomputeOP10M_A11_RegionalUrbanLayer(
    buildOP10M_A11_InputsFromFixtures({
      ...inputs,
      turn: 4,
      national: {
        ...inputs.national,
        distributionBand: 'highly_uneven',
        capitalCityBias: 22,
      },
    }),
    first.persisted,
  );
  push(
    out,
    'a11_05',
    second.state.inequalityIndex >= first.state.inequalityIndex,
    `inequality delta ${(second.state.inequalityIndex - first.state.inequalityIndex).toFixed(1)}`,
  );

  const urban = op10mA11AggregateUrbanGrowthByRegion(sampleCities);
  const gap = op10mA11MetroRegionalGap(urban);
  push(out, 'a11_06', gap > 0 && urban.NSW.gatewayAvg > urban.TAS.gatewayAvg, `metro gap ${gap}`);

  const coupling = op10mA11NationalLocalCoupling(inputs.national);
  push(out, 'a11_07', coupling > 20, `coupling ${coupling.toFixed(1)}`);

  push(
    out,
    'a11_08',
    second.derived.length > 0 && second.derived.every((d) => d.id.startsWith('a11_')),
    second.derived.map((d) => d.kind).join(', ') || 'none',
  );

  const emptyPersisted = createEmptyOP10M_A11_Persisted();
  push(out, 'a11_09', emptyPersisted.revision === 0 && emptyPersisted.history.length === 0, 'empty persisted');

  push(
    out,
    'a11_10',
    first.state.regions.NT.lagging && first.state.regions.NT.spilloverBand !== 'integrated',
    first.state.regions.NT.narrative,
  );

  const infraLinks = [
    {
      linkId: 'link_highway_sydney__melbourne',
      kind: 'highway' as const,
      cityA: 'sydney',
      cityB: 'melbourne',
      regionA: 'NSW' as const,
      regionB: 'VIC' as const,
      utilization: 88,
      health: 'degraded' as const,
      strategic: true,
      redundancyGroup: 'highway_east_core',
    },
    {
      linkId: 'link_freight_rail_sydney__melbourne',
      kind: 'freight_rail' as const,
      cityA: 'sydney',
      cityB: 'melbourne',
      regionA: 'NSW' as const,
      regionB: 'VIC' as const,
      utilization: 82,
      health: 'degraded' as const,
      strategic: true,
      redundancyGroup: 'highway_east_core',
    },
  ];

  const infraInputs = buildOP10M_A11_InfraInputsFromFixtures({
    turn: 5,
    cities: sampleCities,
    links: infraLinks,
    transportNeeds: [
      { regionId: 'NSW', category: 'transport', severity: 'critical', status: 'open' },
      { regionId: 'NT', category: 'transport', severity: 'high', status: 'open' },
    ],
    regions: {
      NSW: { infrastructureQuality: 38 },
      NT: { infrastructureQuality: 36 },
    },
    networkFreight: 44,
    networkDigital: 48,
  });

  const infra1 = recomputeOP10M_A11_IntercityInfraLayer(infraInputs, null);
  push(
    out,
    'a11_11',
    validateOP10M_A11_InfraState(infra1.state).length === 0 && infra1.state.bottlenecks.some((b) => b.regionId === 'NSW'),
    infra1.state.summary,
  );

  push(
    out,
    'a11_12',
    infra1.state.dependencies.some((d) => d.chokePoint) &&
      infra1.derived.some((d) => d.kind === 'intercity_chokepoint'),
    `deps ${infra1.state.dependencies.length}`,
  );

  const stress = op10mA11CorridorStressIndex(infraLinks);
  push(out, 'a11_13', stress >= 50, `corridor stress ${stress}`);

  const infra2 = recomputeOP10M_A11_IntercityInfraLayer(
    buildOP10M_A11_InfraInputsFromFixtures({
      ...infraInputs,
      turn: 6,
      links: infraLinks.map((l) => ({ ...l, utilization: 40, health: 'strong' as const })),
    }),
    infra1.persisted,
  );
  push(
    out,
    'a11_14',
    infra2.state.corridorStressIndex < infra1.state.corridorStressIndex,
    `stress ${infra1.state.corridorStressIndex} → ${infra2.state.corridorStressIndex}`,
  );

  const emptyInfra = createEmptyOP10M_A11_InfraPersisted();
  push(out, 'a11_15', emptyInfra.revision === 0, 'empty infra persisted');

  push(
    out,
    'a11_16',
    infra1.state.dependencies.every((d) => d.dependentRegions.length === 2),
    'dependency region pairs',
  );

  const hierarchy = op10mA11ComputeUrbanHierarchy(sampleCities);
  push(
    out,
    'a11_17',
    hierarchy.length === 8 && hierarchy.some((h) => h.regionId === 'NSW' && h.gatewayShare > 50),
    `NSW gateway share ${hierarchy.find((h) => h.regionId === 'NSW')?.gatewayShare}`,
  );

  const nationalPrimate = op10mA11NationalPrimateIndex(hierarchy);
  push(out, 'a11_18', nationalPrimate > 0, `national primate ${nationalPrimate}`);

  const linkMatrix = op10mA11BuildRegionalLinkageMatrix(infraLinks);
  push(out, 'a11_19', linkMatrix.length >= 1 && linkMatrix[0].viaLinks >= 1, `link edges ${linkMatrix.length}`);

  const compositeIn = buildOP10M_A11_CompositeInputsFromFixtures({
    turn: 7,
    urban: inputs,
    infra: infraInputs,
  });
  const composite = recomputeOP10M_A11_CitiesRegionsComposite(compositeIn, null);
  push(
    out,
    'a11_20',
    validateOP10M_A11_CompositeState(composite.state).length === 0 &&
      composite.state.reliefPlaybook.length > 0,
    composite.state.summary.slice(0, 120),
  );

  push(
    out,
    'a11_21',
    composite.derived.some((d) => d.kind === 'integrated_relief_priority') ||
      composite.derived.some((d) => d.kind === 'primate_concentration_risk'),
    composite.derived.map((d) => d.kind).join(', ') || 'none',
  );

  const composite2 = recomputeOP10M_A11_CitiesRegionsComposite(
    buildOP10M_A11_CompositeInputsFromFixtures({ turn: 8, urban: inputs, infra: infraInputs }),
    composite.persisted,
  );
  push(
    out,
    'a11_22',
    composite2.state.revision === composite.state.revision + 1,
    `revision ${composite.state.revision}→${composite2.state.revision}`,
  );

  const flows = op10mA11ComputeCorridorFlows({
    cities: sampleCities,
    links: infraLinks,
    linkages: linkMatrix,
  });
  push(
    out,
    'a11_23',
    flows.length >= 1 && op10mA11MaxCorridorFlow(flows) >= 40 && flows[0].band !== 'light',
    `peak flow ${op10mA11MaxCorridorFlow(flows)} (${flows[0]?.band})`,
  );

  const hubs = op10mA11AnalyzeLinkageHubs(linkMatrix);
  push(
    out,
    'a11_24',
    hubs.length === 8 && hubs.every((h) => h.narrative.includes('linkage role')),
    `top hub ${hubs[0]?.regionId} (${hubs[0]?.role})`,
  );

  push(
    out,
    'a11_25',
    composite.state.corridorFlows.length >= 1 && composite.state.linkageHubs.length === 8,
    `flows ${composite.state.corridorFlows.length}`,
  );

  push(
    out,
    'a11_26',
    composite.state.maxCorridorFlow > 0 && composite.state.schemaVersion === '10m.a11.composite.2',
    composite.state.schemaVersion,
  );

  push(
    out,
    'a11_27',
    composite.derived.some((d) => d.kind === 'corridor_flow_surge' || d.kind === 'linkage_hub_overload'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_28',
    composite.state.corridorFlows[0].explanation.includes('corridor'),
    composite.state.corridorFlows[0]?.band ?? 'none',
  );

  return out;
}

export function assertOP10M_A11_SelfTests(): { ok: boolean; failed: OP10M_A11_SelfTestResult[] } {
  const results = runOP10M_A11_SelfTests();
  const failed = results.filter((r) => !r.passed);
  return { ok: failed.length === 0, failed };
}


// OP10M_MODULE_END agent-11-cities
