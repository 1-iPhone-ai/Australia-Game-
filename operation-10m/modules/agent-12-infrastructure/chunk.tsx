// OP10M_MODULE_BEGIN agent-12-infrastructure
// Agent 12 — Transportation / infrastructure productivity (generated; source: operation-10m/agent-12-transport/)

// --- source: types.ts ---
/**
 * Agent 12 — Transportation & infrastructure productivity types.
 * Standalone until Agent 25 assembly; mirrors V9.4 region codes and infra project types.
 */

export const AU_REGION_CODES = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export type AuRegionCode = (typeof AU_REGION_CODES)[number];

export type TransportAssetCategory = 'road' | 'rail' | 'port' | 'logistics';

export type TransportAssetCondition =
  | 'excellent'
  | 'good'
  | 'fair'
  | 'degraded'
  | 'closed';

/** Canonical V9.4 infrastructure project types this agent maps into productivity. */
export type V94InfrastructureProjectType =
  | 'high_speed_rail'
  | 'inland_rail_hub'
  | 'freight_rail_upgrade'
  | 'remote_logistics_base'
  | 'automated_port'
  | 'port_expansion';

export type StrategicNetworkKind =
  | 'freight'
  | 'trade'
  | 'mobility';

export interface TransportAssetBase {
  id: string;
  category: TransportAssetCategory;
  name: string;
  description: string;
  /** Primary host region; corridors may list additional served regions. */
  hostRegion: AuRegionCode;
  servedRegions: AuRegionCode[];
  /** Baseline productivity index points contributed when fully operational (0–25 typical). */
  baseProductivityPoints: number;
  /** Maps to canonical infra project when built through the game engine. */
  linkedProjectType?: V94InfrastructureProjectType;
  linkedProjectId?: string;
  strategicNetworks: StrategicNetworkKind[];
  tags: string[];
}

export interface RoadSegmentAsset extends TransportAssetBase {
  category: 'road';
  laneKilometres: number;
  designSpeedKmh: number;
  freightShare: number;
  urbanShare: number;
  tollRoad: boolean;
}

export interface RailCorridorAsset extends TransportAssetBase {
  category: 'rail';
  trackKilometres: number;
  dualTrackShare: number;
  electrifiedShare: number;
  designFreightTonnesPerYear: number;
  passengerCapable: boolean;
}

export interface PortAsset extends TransportAssetBase {
  category: 'port';
  berthCount: number;
  maxDraftMetres: number;
  teuCapacityPerYear: number;
  automationLevel: 0 | 1 | 2 | 3;
  bulkShare: number;
}

export interface LogisticsNodeAsset extends TransportAssetBase {
  category: 'logistics';
  warehouseSqm: number;
  coldChainCapable: boolean;
  intermodalLinks: Array<'road' | 'rail' | 'port' | 'air'>;
  lastMileCoveragePct: number;
}

export type TransportAsset =
  | RoadSegmentAsset
  | RailCorridorAsset
  | PortAsset
  | LogisticsNodeAsset;

export interface ProductivityContribution {
  assetId: string;
  category: TransportAssetCategory;
  hostRegion: AuRegionCode;
  /** Additive points to regional productivity index (measurable). */
  productivityIndexDelta: number;
  /** Multiplicative adjustment to logistics / freight cost (1 = neutral, 0.85 = 15% cheaper). */
  logisticsCostMultiplier: number;
  /** Normalized freight throughput contribution (0–100 scale per asset). */
  freightCapacityIndex: number;
  /** Passenger / crew travel time factor (1 = baseline, 0.5 = half effective travel cost). */
  travelTimeFactor: number;
  evidence: string[];
}

export interface RegionalTransportProductivity {
  regionId: AuRegionCode;
  productivityIndexBonus: number;
  logisticsCostMultiplier: number;
  freightCapacityIndex: number;
  travelTimeFactor: number;
  assetCount: number;
  contributions: ProductivityContribution[];
}

export interface NationalTransportProductivityReport {
  schemaVersion: 'agent12/1';
  turn: number;
  byRegion: Record<AuRegionCode, RegionalTransportProductivity>;
  nationalProductivityIndexBonus: number;
  nationalLogisticsCostMultiplier: number;
  nationalFreightCapacityIndex: number;
  computeMs: number;
}

export interface TransportProductivityInputs {
  turn: number;
  assets: TransportAsset[];
  /** Asset ids treated as operational (active infra + catalog baseline). */
  operationalAssetIds: ReadonlySet<string>;
  /** Optional per-asset condition overrides. */
  conditionByAssetId?: ReadonlyMap<string, TransportAssetCondition>;
  /** 0–1 utilization stress on strategic networks (lowers effective capacity). */
  networkUtilization?: Partial<Record<StrategicNetworkKind, number>>;
  /** Active canonical infrastructure project ids (boost linked catalog assets). */
  activeProjectIds?: ReadonlySet<string>;
}

export interface V94ProjectSnapshot {
  id: string;
  projectType: string;
  regionId: string;
  status: string;
}


// --- source: productivity/formulas.ts ---
  AuRegionCode,
  StrategicNetworkKind,
  TransportAsset,
  TransportAssetCondition,
} from '../types.ts';

export const CONDITION_OPERATIONAL_FACTOR: Record<TransportAssetCondition, number> = {
  excellent: 1.08,
  good: 1,
  fair: 0.82,
  degraded: 0.55,
  closed: 0,
};

export const UTILIZATION_PENALTY_K = 0.35;

export function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function utilizationEffectiveFactor(utilization: number | undefined): number {
  if (utilization == null || !Number.isFinite(utilization)) return 1;
  const u = clamp(utilization, 0, 1.25);
  return clamp(1 - UTILIZATION_PENALTY_K * Math.max(0, u - 0.7), 0.55, 1.05);
}

export function roadFreightCapacityIndex(asset: Extract<TransportAsset, { category: 'road' }>): number {
  const freightKm = asset.laneKilometres * asset.freightShare;
  const speedFactor = clamp(asset.designSpeedKmh / 100, 0.4, 1.2);
  const urbanPenalty = 1 - asset.urbanShare * 0.25;
  const tollBoost = asset.tollRoad ? 1.04 : 1;
  return clamp((freightKm / 120) * speedFactor * urbanPenalty * tollBoost * 8, 0, 100);
}

export function railFreightCapacityIndex(asset: Extract<TransportAsset, { category: 'rail' }>): number {
  const tonneFactor = clamp(asset.designFreightTonnesPerYear / 25_000_000, 0.2, 1.4);
  const trackFactor = clamp(asset.trackKilometres / 800, 0.15, 1);
  const dualBoost = 1 + asset.dualTrackShare * 0.18;
  const elecBoost = 1 + asset.electrifiedShare * 0.06;
  return clamp(tonneFactor * trackFactor * dualBoost * elecBoost * 42, 0, 100);
}

export function portFreightCapacityIndex(asset: Extract<TransportAsset, { category: 'port' }>): number {
  const teuFactor = clamp(asset.teuCapacityPerYear / 3_000_000, 0.15, 1.5);
  const berthFactor = clamp(asset.berthCount / 12, 0.2, 1.2);
  const draftFactor = clamp(asset.maxDraftMetres / 14, 0.5, 1.15);
  const autoBoost = 1 + asset.automationLevel * 0.05;
  const bulkAdj = 1 + asset.bulkShare * 0.12;
  return clamp(teuFactor * berthFactor * draftFactor * autoBoost * bulkAdj * 38, 0, 100);
}

export function logisticsFreightCapacityIndex(
  asset: Extract<TransportAsset, { category: 'logistics' }>,
): number {
  const sqmFactor = clamp(asset.warehouseSqm / 200_000, 0.1, 1.3);
  const linkBoost = 1 + asset.intermodalLinks.length * 0.07;
  const lastMile = 0.6 + asset.lastMileCoveragePct * 0.004;
  const cold = asset.coldChainCapable ? 1.08 : 1;
  return clamp(sqmFactor * linkBoost * lastMile * cold * 22, 0, 100);
}

export function assetFreightCapacityIndex(asset: TransportAsset): number {
  switch (asset.category) {
    case 'road':
      return roadFreightCapacityIndex(asset);
    case 'rail':
      return railFreightCapacityIndex(asset);
    case 'port':
      return portFreightCapacityIndex(asset);
    case 'logistics':
      return logisticsFreightCapacityIndex(asset);
    default:
      return 0;
  }
}

export function roadTravelTimeFactor(asset: Extract<TransportAsset, { category: 'road' }>): number {
  const congestion = 1 + asset.urbanShare * 0.35;
  const speedRelief = clamp(100 / (asset.designSpeedKmh * congestion), 0.45, 1.1);
  return clamp(speedRelief * (asset.tollRoad ? 0.92 : 1), 0.35, 1);
}

export function railTravelTimeFactor(asset: Extract<TransportAsset, { category: 'rail' }>): number {
  const pax = asset.passengerCapable ? 0.88 : 1;
  const dual = 1 - asset.dualTrackShare * 0.12;
  return clamp(pax * dual, 0.4, 1);
}

export function portTravelTimeFactor(_asset: Extract<TransportAsset, { category: 'port' }>): number {
  return 0.95;
}

export function logisticsTravelTimeFactor(
  asset: Extract<TransportAsset, { category: 'logistics' }>,
): number {
  return clamp(1 - asset.lastMileCoveragePct * 0.0025, 0.7, 1);
}

export function assetTravelTimeFactor(asset: TransportAsset): number {
  switch (asset.category) {
    case 'road':
      return roadTravelTimeFactor(asset);
    case 'rail':
      return railTravelTimeFactor(asset);
    case 'port':
      return portTravelTimeFactor(asset);
    case 'logistics':
      return logisticsTravelTimeFactor(asset);
    default:
      return 1;
  }
}

export function logisticsCostMultiplierFromCapacity(freightIndex: number, travelFactor: number): number {
  const capacityRelief = clamp(1 - freightIndex / 400, 0.72, 1);
  const travelRelief = clamp(travelFactor, 0.35, 1);
  return clamp(capacityRelief * (0.85 + travelRelief * 0.15), 0.55, 1);
}

export function productivityPointsFromAsset(
  asset: TransportAsset,
  operationalFactor: number,
  projectBoost: number,
): number {
  const base = asset.baseProductivityPoints * operationalFactor * projectBoost;
  const categoryWeight =
    asset.category === 'port' ? 1.12 : asset.category === 'rail' ? 1.08 : asset.category === 'logistics' ? 1.05 : 1;
  return clamp(base * categoryWeight, 0, 30);
}

export function networkUtilizationForAsset(
  asset: TransportAsset,
  networkUtilization: Partial<Record<StrategicNetworkKind, number>> | undefined,
): number {
  if (!networkUtilization || asset.strategicNetworks.length === 0) return 0;
  const vals = asset.strategicNetworks.map((k) => networkUtilization[k] ?? 0);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

export function emptyRegionalAccumulator(): {
  productivityIndexBonus: number;
  logisticsCostMultiplier: number;
  freightCapacityIndex: number;
  travelTimeFactor: number;
  assetCount: number;
} {
  return {
    productivityIndexBonus: 0,
    logisticsCostMultiplier: 1,
    freightCapacityIndex: 0,
    travelTimeFactor: 1,
    assetCount: 0,
  };
}

export function mergeRegionalContribution(
  acc: ReturnType<typeof emptyRegionalAccumulator>,
  contribution: {
    productivityIndexDelta: number;
    logisticsCostMultiplier: number;
    freightCapacityIndex: number;
    travelTimeFactor: number;
  },
): void {
  acc.productivityIndexBonus += contribution.productivityIndexDelta;
  acc.logisticsCostMultiplier *= contribution.logisticsCostMultiplier;
  acc.freightCapacityIndex += contribution.freightCapacityIndex;
  acc.travelTimeFactor *= contribution.travelTimeFactor;
  acc.assetCount += 1;
}

export function finalizeRegionalLogisticsMultiplier(raw: number): number {
  return clamp(raw, 0.5, 1.05);
}

export function finalizeRegionalTravelFactor(raw: number, count: number): number {
  if (count <= 0) return 1;
  return clamp(Math.pow(raw, 1 / count), 0.35, 1.05);
}

export function isAuRegionCode(value: string): value is AuRegionCode {
  return (
    value === 'NSW' ||
    value === 'VIC' ||
    value === 'QLD' ||
    value === 'WA' ||
    value === 'SA' ||
    value === 'TAS' ||
    value === 'NT' ||
    value === 'ACT'
  );
}


// --- source: catalog/roads-catalog.ts ---

/** Major road corridors — baseline catalog (operational unless scenario marks degraded). */
export const ROAD_CATALOG: RoadSegmentAsset[] = [
  {
    id: 'road_nsw_m1_pacific',
    category: 'road',
    name: 'M1 Pacific Motorway (NSW)',
    description: 'Sydney–Newcastle freight and commuter spine.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 6.5,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v102_nsw_interstate_rail',
    strategicNetworks: ['freight', 'mobility'],
    tags: ['motorway', 'freight'],
    laneKilometres: 780,
    designSpeedKmh: 110,
    freightShare: 0.38,
    urbanShare: 0.42,
    tollRoad: true,
  },
  {
    id: 'road_nsw_hume',
    category: 'road',
    name: 'Hume Highway (NSW section)',
    description: 'Sydney–Melbourne corridor through Goulburn and Albury.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 7.2,
    linkedProjectType: 'high_speed_rail',
    linkedProjectId: 'infra_hsr_nsw_vic',
    strategicNetworks: ['freight', 'mobility'],
    tags: ['national_highway', 'freight'],
    laneKilometres: 550,
    designSpeedKmh: 110,
    freightShare: 0.45,
    urbanShare: 0.25,
    tollRoad: false,
  },
  {
    id: 'road_vic_m1_monash',
    category: 'road',
    name: 'Monash / M1 (VIC)',
    description: 'Melbourne outer-east freight access to Gippsland and the port.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 5.8,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['motorway'],
    laneKilometres: 420,
    designSpeedKmh: 100,
    freightShare: 0.32,
    urbanShare: 0.55,
    tollRoad: true,
  },
  {
    id: 'road_vic_western_ring',
    category: 'road',
    name: 'Western Ring Road',
    description: 'Melbourne port bypass for container freight.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 4.9,
    linkedProjectType: 'port_expansion',
    strategicNetworks: ['freight', 'trade'],
    tags: ['urban_freight'],
    laneKilometres: 280,
    designSpeedKmh: 100,
    freightShare: 0.52,
    urbanShare: 0.68,
    tollRoad: true,
  },
  {
    id: 'road_qld_m1_bruce',
    category: 'road',
    name: 'M1 Bruce Highway (QLD)',
    description: 'Brisbane–Cairns agricultural and mining supply chain.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 6.1,
    linkedProjectType: 'inland_rail_hub',
    linkedProjectId: 'infra_inland_rail_qld',
    strategicNetworks: ['freight'],
    tags: ['national_highway'],
    laneKilometres: 1670,
    designSpeedKmh: 100,
    freightShare: 0.41,
    urbanShare: 0.18,
    tollRoad: false,
  },
  {
    id: 'road_qld_warrego',
    category: 'road',
    name: 'Warrego Highway',
    description: 'Brisbane inland link toward Toowoomba and Darling Downs grain.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight'],
    tags: ['grain_corridor'],
    laneKilometres: 320,
    designSpeedKmh: 100,
    freightShare: 0.48,
    urbanShare: 0.12,
    tollRoad: false,
  },
  {
    id: 'road_wa_great_northern',
    category: 'road',
    name: 'Great Northern Highway',
    description: 'Perth–Pilbara mining supply route.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 5.5,
    linkedProjectType: 'remote_logistics_base',
    linkedProjectId: 'infra_v93_wa_remote_logistics',
    strategicNetworks: ['freight'],
    tags: ['mining', 'remote'],
    laneKilometres: 2100,
    designSpeedKmh: 110,
    freightShare: 0.55,
    urbanShare: 0.05,
    tollRoad: false,
  },
  {
    id: 'road_wa_roe_hwy',
    category: 'road',
    name: 'Roe Highway & Fremantle access',
    description: 'Perth outer freight ring to Kwinana and Fremantle ports.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.6,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v93_wa_freight_rail',
    strategicNetworks: ['freight', 'trade'],
    tags: ['port_access'],
    laneKilometres: 190,
    designSpeedKmh: 100,
    freightShare: 0.5,
    urbanShare: 0.4,
    tollRoad: false,
  },
  {
    id: 'road_sa_sturt',
    category: 'road',
    name: 'Sturt Highway',
    description: 'Adelaide–Sydney freight connector through Riverland.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'NSW', 'VIC'],
    baseProductivityPoints: 4.8,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v102_sa_freight_corridor',
    strategicNetworks: ['freight'],
    tags: ['east_west'],
    laneKilometres: 720,
    designSpeedKmh: 110,
    freightShare: 0.44,
    urbanShare: 0.15,
    tollRoad: false,
  },
  {
    id: 'road_sa_eyre',
    category: 'road',
    name: 'Eyre Highway',
    description: 'Nullarbor link — Perth to Adelaide road freight.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['freight'],
    tags: ['transcontinental'],
    laneKilometres: 1200,
    designSpeedKmh: 110,
    freightShare: 0.58,
    urbanShare: 0.02,
    tollRoad: false,
  },
  {
    id: 'road_tas_midlands',
    category: 'road',
    name: 'Midlands Highway',
    description: 'Launceston–Hobart agricultural distribution.',
    hostRegion: 'TAS',
    servedRegions: ['TAS'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['regional'],
    laneKilometres: 200,
    designSpeedKmh: 100,
    freightShare: 0.36,
    urbanShare: 0.22,
    tollRoad: false,
  },
  {
    id: 'road_nt_stuart',
    category: 'road',
    name: 'Stuart Highway',
    description: 'Darwin–Alice Springs supply corridor.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'SA'],
    baseProductivityPoints: 4.1,
    linkedProjectType: 'remote_logistics_base',
    linkedProjectId: 'infra_v93_nt_gateway',
    strategicNetworks: ['freight'],
    tags: ['remote'],
    laneKilometres: 1500,
    designSpeedKmh: 110,
    freightShare: 0.42,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_act_barton',
    category: 'road',
    name: 'Morshead / Barton Highways',
    description: 'Canberra freight feed from NSW coast.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 2.2,
    strategicNetworks: ['mobility'],
    tags: ['capital'],
    laneKilometres: 90,
    designSpeedKmh: 100,
    freightShare: 0.28,
    urbanShare: 0.35,
    tollRoad: false,
  },
];

export function getRoadCatalogById(): Map<string, RoadSegmentAsset> {
  return new Map(ROAD_CATALOG.map((r) => [r.id, r]));
}


// --- source: catalog/rail-catalog.ts ---

export const RAIL_CATALOG: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_sydney_melbourne',
    category: 'rail',
    name: 'Sydney–Melbourne Interstate Rail',
    description: 'Primary east-coast intercapital freight path.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 8.5,
    linkedProjectType: 'high_speed_rail',
    linkedProjectId: 'infra_hsr_nsw_vic',
    strategicNetworks: ['freight', 'mobility'],
    tags: ['intercapital'],
    trackKilometres: 960,
    dualTrackShare: 0.55,
    electrifiedShare: 0.15,
    designFreightTonnesPerYear: 12_000_000,
    passengerCapable: true,
  },
  {
    id: 'rail_qld_inland_freight',
    category: 'rail',
    name: 'Inland Rail (QLD segment)',
    description: 'Parkes–Brisbane standard gauge freight program.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 9.2,
    linkedProjectType: 'inland_rail_hub',
    linkedProjectId: 'infra_inland_rail_qld',
    strategicNetworks: ['freight', 'trade'],
    tags: ['inland_rail'],
    trackKilometres: 1100,
    dualTrackShare: 0.35,
    electrifiedShare: 0,
    designFreightTonnesPerYear: 22_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_wa_pilbara_heavy',
    category: 'rail',
    name: 'Pilbara Heavy-Haul Network',
    description: 'Private iron-ore railways feeding Port Hedland.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 10.5,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v93_wa_freight_rail',
    strategicNetworks: ['freight', 'trade'],
    tags: ['mining', 'heavy_haul'],
    trackKilometres: 1800,
    dualTrackShare: 0.72,
    electrifiedShare: 0,
    designFreightTonnesPerYear: 480_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_sa_adelaide_freight',
    category: 'rail',
    name: 'Adelaide Freight Corridor',
    description: 'Gauge-standardised freight through Adelaide to eastern states.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA', 'VIC', 'NSW'],
    baseProductivityPoints: 6.8,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v102_sa_freight_corridor',
    strategicNetworks: ['freight'],
    tags: ['gauge_standard'],
    trackKilometres: 640,
    dualTrackShare: 0.4,
    electrifiedShare: 0.05,
    designFreightTonnesPerYear: 9_500_000,
    passengerCapable: true,
  },
  {
    id: 'rail_nsw_interstate_upgrade',
    category: 'rail',
    name: 'NSW Interstate Freight Upgrade',
    description: 'Capacity uplift on Sydney–Brisbane paths.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 5.9,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v102_nsw_interstate_rail',
    strategicNetworks: ['freight'],
    tags: ['upgrade'],
    trackKilometres: 820,
    dualTrackShare: 0.48,
    electrifiedShare: 0.2,
    designFreightTonnesPerYear: 14_000_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_melbourne_freight',
    category: 'rail',
    name: 'Melbourne Port Rail Shuttle',
    description: 'Metropolitan shuttle linking terminals to Dynon and port.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 5.1,
    strategicNetworks: ['freight', 'trade'],
    tags: ['port_rail'],
    trackKilometres: 120,
    dualTrackShare: 0.25,
    electrifiedShare: 0.6,
    designFreightTonnesPerYear: 4_500_000,
    passengerCapable: false,
  },
  {
    id: 'rail_tas_freight',
    category: 'rail',
    name: 'TasRail Main Line',
    description: 'Bell Bay and Burnie export feed.',
    hostRegion: 'TAS',
    servedRegions: ['TAS'],
    baseProductivityPoints: 3.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['regional'],
    trackKilometres: 610,
    dualTrackShare: 0.05,
    electrifiedShare: 0,
    designFreightTonnesPerYear: 1_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nt_adrail',
    category: 'rail',
    name: 'Darwin–Alice Springs Rail',
    description: 'Ghan corridor freight supplement to road.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'SA'],
    baseProductivityPoints: 3.8,
    linkedProjectType: 'remote_logistics_base',
    linkedProjectId: 'infra_v93_nt_gateway',
    strategicNetworks: ['freight'],
    tags: ['remote'],
    trackKilometres: 1420,
    dualTrackShare: 0.12,
    electrifiedShare: 0,
    designFreightTonnesPerYear: 800_000,
    passengerCapable: true,
  },
];

export function getRailCatalogById(): Map<string, RailCorridorAsset> {
  return new Map(RAIL_CATALOG.map((r) => [r.id, r]));
}


// --- source: catalog/ports-catalog.ts ---

export const PORT_CATALOG: PortAsset[] = [
  {
    id: 'port_vic_melbourne',
    category: 'port',
    name: 'Port of Melbourne',
    description: 'Largest container port — national trade gateway.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW', 'SA', 'TAS'],
    baseProductivityPoints: 11.5,
    linkedProjectType: 'port_expansion',
    strategicNetworks: ['trade', 'freight'],
    tags: ['container'],
    berthCount: 52,
    maxDraftMetres: 14.2,
    teuCapacityPerYear: 3_200_000,
    automationLevel: 2,
    bulkShare: 0.22,
  },
  {
    id: 'port_nsw_botany',
    category: 'port',
    name: 'Port Botany (Sydney)',
    description: 'NSW container hub with rail shuttles.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 10.8,
    linkedProjectType: 'port_expansion',
    strategicNetworks: ['trade', 'freight'],
    tags: ['container'],
    berthCount: 38,
    maxDraftMetres: 15,
    teuCapacityPerYear: 2_800_000,
    automationLevel: 2,
    bulkShare: 0.18,
  },
  {
    id: 'port_qld_brisbane',
    category: 'port',
    name: 'Port of Brisbane',
    description: 'Queensland trade gateway — coal and containers.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 9.6,
    linkedProjectType: 'automated_port',
    linkedProjectId: 'infra_v93_qld_port_automated',
    strategicNetworks: ['trade', 'freight'],
    tags: ['multimodal'],
    berthCount: 42,
    maxDraftMetres: 14.5,
    teuCapacityPerYear: 1_450_000,
    automationLevel: 2,
    bulkShare: 0.35,
  },
  {
    id: 'port_wa_fremantle',
    category: 'port',
    name: 'Fremantle Port',
    description: 'Indian Ocean container and bulk exports.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 8.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['container', 'bulk'],
    berthCount: 28,
    maxDraftMetres: 13.5,
    teuCapacityPerYear: 820_000,
    automationLevel: 1,
    bulkShare: 0.4,
  },
  {
    id: 'port_wa_hedland',
    category: 'port',
    name: 'Port Hedland',
    description: 'World-scale iron ore export terminal.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 12.2,
    linkedProjectType: 'green_hydrogen_terminal',
    linkedProjectId: 'infra_hydrogen_wa',
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'mining'],
    berthCount: 8,
    maxDraftMetres: 18,
    teuCapacityPerYear: 120_000,
    automationLevel: 3,
    bulkShare: 0.92,
  },
  {
    id: 'port_sa_outer_harbor',
    category: 'port',
    name: 'Port Adelaide (Outer Harbor)',
    description: 'Grain, automotive, and breakbulk.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC', 'NSW'],
    baseProductivityPoints: 6.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['grain'],
    berthCount: 18,
    maxDraftMetres: 12.8,
    teuCapacityPerYear: 310_000,
    automationLevel: 1,
    bulkShare: 0.55,
  },
  {
    id: 'port_tas_burnie',
    category: 'port',
    name: 'Port of Burnie',
    description: 'Tasmanian export woodchips and containers.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 3.5,
    strategicNetworks: ['trade'],
    tags: ['regional'],
    berthCount: 6,
    maxDraftMetres: 11,
    teuCapacityPerYear: 180_000,
    automationLevel: 0,
    bulkShare: 0.48,
  },
  {
    id: 'port_nt_darwin',
    category: 'port',
    name: 'Port of Darwin',
    description: 'Northern gateway — LNG, live export, defence supply.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD', 'WA'],
    baseProductivityPoints: 5.8,
    linkedProjectType: 'remote_logistics_base',
    linkedProjectId: 'infra_v93_nt_gateway',
    strategicNetworks: ['trade', 'freight'],
    tags: ['gateway'],
    berthCount: 12,
    maxDraftMetres: 15,
    teuCapacityPerYear: 260_000,
    automationLevel: 1,
    bulkShare: 0.5,
  },
];

export function getPortCatalogById(): Map<string, PortAsset> {
  return new Map(PORT_CATALOG.map((p) => [p.id, p]));
}


// --- source: catalog/logistics-catalog.ts ---

export const LOGISTICS_CATALOG: LogisticsNodeAsset[] = [
  {
    id: 'log_nsw_western_sydney',
    category: 'logistics',
    name: 'Western Sydney Intermodal Precinct',
    description: 'IMC and warehouse cluster feeding Port Botany and interstate road.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 5.4,
    linkedProjectType: 'inland_rail_hub',
    linkedProjectId: 'infra_inland_rail_qld',
    strategicNetworks: ['freight', 'trade'],
    tags: ['intermodal', 'warehouse'],
    warehouseSqm: 620_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 72,
  },
  {
    id: 'log_vic_dandenong',
    category: 'logistics',
    name: 'Dandenong South Logistics Hub',
    description: 'Manufacturing and cold-chain distribution south-east of Melbourne.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'TAS'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['freight'],
    tags: ['manufacturing'],
    warehouseSqm: 480_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 68,
  },
  {
    id: 'log_qld_brisbane_trade_coast',
    category: 'logistics',
    name: 'Brisbane TradeCoast',
    description: 'Airport-adjacent freight and perishables near Port of Brisbane.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 5.1,
    linkedProjectType: 'automated_port',
    strategicNetworks: ['trade', 'freight'],
    tags: ['air', 'perishables'],
    warehouseSqm: 390_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port', 'air'],
    lastMileCoveragePct: 65,
  },
  {
    id: 'log_wa_kewdale',
    category: 'logistics',
    name: 'Kewdale Freight Terminal',
    description: 'Perth metropolitan freight consolidation.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.2,
    linkedProjectType: 'remote_logistics_base',
    linkedProjectId: 'infra_v93_wa_remote_logistics',
    strategicNetworks: ['freight'],
    tags: ['metro'],
    warehouseSqm: 280_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_sa_gillman',
    category: 'logistics',
    name: 'Gillman Intermodal',
    description: 'Adelaide north intermodal supporting east–west freight.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA', 'VIC'],
    baseProductivityPoints: 3.9,
    linkedProjectType: 'freight_rail_upgrade',
    linkedProjectId: 'infra_v102_sa_freight_corridor',
    strategicNetworks: ['freight'],
    tags: ['intermodal'],
    warehouseSqm: 210_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 52,
  },
  {
    id: 'log_nt_berrimah',
    category: 'logistics',
    name: 'Darwin Berrimah Logistics',
    description: 'Remote supply staging for Top End communities and projects.',
    hostRegion: 'NT',
    servedRegions: ['NT'],
    baseProductivityPoints: 3.1,
    linkedProjectType: 'remote_logistics_base',
    linkedProjectId: 'infra_v93_nt_gateway',
    strategicNetworks: ['freight'],
    tags: ['remote'],
    warehouseSqm: 95_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 44,
  },
  {
    id: 'log_act_hume_dc',
    category: 'logistics',
    name: 'Canberra Hume Distribution Centre',
    description: 'Capital region retail and public-sector supply chain node.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 2.4,
    strategicNetworks: ['freight'],
    tags: ['retail'],
    warehouseSqm: 120_000,
    coldChainCapable: true,
    intermodalLinks: ['road'],
    lastMileCoveragePct: 78,
  },
  {
    id: 'log_tas_hobart',
    category: 'logistics',
    name: 'Hobart Freight Hub',
    description: 'Island logistics with Bass Strait ferry dependency.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 2.8,
    strategicNetworks: ['freight', 'trade'],
    tags: ['island'],
    warehouseSqm: 85_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 61,
  },
];

export function getLogisticsCatalogById(): Map<string, LogisticsNodeAsset> {
  return new Map(LOGISTICS_CATALOG.map((l) => [l.id, l]));
}


// --- source: catalog/all-catalog.ts ---

export function getAgent12TransportCatalog(): TransportAsset[] {
  return [...ROAD_CATALOG, ...RAIL_CATALOG, ...PORT_CATALOG, ...LOGISTICS_CATALOG];
}

export function getDefaultOperationalAssetIds(): ReadonlySet<string> {
  return new Set(getAgent12TransportCatalog().map((a) => a.id));
}

export function getCatalogIntegrityReport(): {
  totalAssets: number;
  byCategory: Record<string, number>;
  duplicateIds: string[];
  invalidRegions: string[];
} {
  const assets = getAgent12TransportCatalog();
  const byCategory: Record<string, number> = {};
  const seen = new Set<string>();
  const duplicateIds: string[] = [];
  const invalidRegions: string[] = [];
  const valid = new Set(['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT']);

  for (const a of assets) {
    byCategory[a.category] = (byCategory[a.category] ?? 0) + 1;
    if (seen.has(a.id)) duplicateIds.push(a.id);
    seen.add(a.id);
    if (!valid.has(a.hostRegion)) invalidRegions.push(`${a.id}:host`);
    for (const r of a.servedRegions) {
      if (!valid.has(r)) invalidRegions.push(`${a.id}:served:${r}`);
    }
  }

  return {
    totalAssets: assets.length,
    byCategory,
    duplicateIds,
    invalidRegions,
  };
}


// --- source: productivity/compute-national-productivity.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type NationalTransportProductivityReport,
  type ProductivityContribution,
  type RegionalTransportProductivity,
  type TransportProductivityInputs,
} from '../types.ts';
  assetFreightCapacityIndex,
  assetTravelTimeFactor,
  CONDITION_OPERATIONAL_FACTOR,
  emptyRegionalAccumulator,
  finalizeRegionalLogisticsMultiplier,
  finalizeRegionalTravelFactor,
  isAuRegionCode,
  logisticsCostMultiplierFromCapacity,
  mergeRegionalContribution,
  networkUtilizationForAsset,
  productivityPointsFromAsset,
  utilizationEffectiveFactor,
} from './formulas.ts';

function projectBoostForAsset(
  inputs: TransportProductivityInputs,
  asset: { linkedProjectId?: string; linkedProjectType?: string },
): number {
  if (!inputs.activeProjectIds || inputs.activeProjectIds.size === 0) return 1;
  if (asset.linkedProjectId && inputs.activeProjectIds.has(asset.linkedProjectId)) return 1.22;
  return 1;
}

function conditionForAsset(
  inputs: TransportProductivityInputs,
  assetId: string,
): keyof typeof CONDITION_OPERATIONAL_FACTOR {
  const override = inputs.conditionByAssetId?.get(assetId);
  return override ?? 'good';
}

export function computeAssetProductivityContribution(
  inputs: TransportProductivityInputs,
  asset: TransportProductivityInputs['assets'][number],
): ProductivityContribution | null {
  if (!inputs.operationalAssetIds.has(asset.id)) return null;

  const condition = conditionForAsset(inputs, asset.id);
  const operationalFactor = CONDITION_OPERATIONAL_FACTOR[condition];
  if (operationalFactor <= 0) return null;

  const util = networkUtilizationForAsset(asset, inputs.networkUtilization);
  const utilFactor = utilizationEffectiveFactor(util);
  const projectBoost = projectBoostForAsset(inputs, asset);

  const freightCapacityIndex = assetFreightCapacityIndex(asset) * operationalFactor * utilFactor;
  const travelTimeFactor = assetTravelTimeFactor(asset);
  const productivityIndexDelta =
    productivityPointsFromAsset(asset, operationalFactor * utilFactor, projectBoost);
  const logisticsCostMultiplier = logisticsCostMultiplierFromCapacity(freightCapacityIndex, travelTimeFactor);

  const evidence: string[] = [
    `condition=${condition} operationalFactor=${operationalFactor.toFixed(2)}`,
    `freightCapacityIndex=${freightCapacityIndex.toFixed(1)}`,
    `productivityIndexDelta=${productivityIndexDelta.toFixed(2)}`,
    `logisticsCostMultiplier=${logisticsCostMultiplier.toFixed(3)}`,
  ];
  if (projectBoost > 1) evidence.push(`activeProjectBoost=${projectBoost.toFixed(2)}`);
  if (util > 0) evidence.push(`networkUtilization=${util.toFixed(2)} utilFactor=${utilFactor.toFixed(2)}`);

  return {
    assetId: asset.id,
    category: asset.category,
    hostRegion: asset.hostRegion,
    productivityIndexDelta,
    logisticsCostMultiplier,
    freightCapacityIndex,
    travelTimeFactor,
    evidence,
  };
}

function initByRegion(): Record<AuRegionCode, RegionalTransportProductivity> {
  const out = {} as Record<AuRegionCode, RegionalTransportProductivity>;
  for (const code of AU_REGION_CODES) {
    out[code] = {
      regionId: code,
      productivityIndexBonus: 0,
      logisticsCostMultiplier: 1,
      freightCapacityIndex: 0,
      travelTimeFactor: 1,
      assetCount: 0,
      contributions: [],
    };
  }
  return out;
}

export function computeNationalTransportProductivity(
  inputs: TransportProductivityInputs,
): NationalTransportProductivityReport {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const byRegion = initByRegion();
  const servedAccum: Record<AuRegionCode, ReturnType<typeof emptyRegionalAccumulator>> = {} as Record<
    AuRegionCode,
    ReturnType<typeof emptyRegionalAccumulator>
  >;
  for (const code of AU_REGION_CODES) servedAccum[code] = emptyRegionalAccumulator();

  for (const asset of inputs.assets) {
    const contribution = computeAssetProductivityContribution(inputs, asset);
    if (!contribution) continue;

    const hostAcc = servedAccum[asset.hostRegion];
    mergeRegionalContribution(hostAcc, contribution);
    byRegion[asset.hostRegion].contributions.push(contribution);

    for (const regionId of asset.servedRegions) {
      if (regionId === asset.hostRegion) continue;
      if (!isAuRegionCode(regionId)) continue;
      const spill = {
        productivityIndexDelta: contribution.productivityIndexDelta * 0.35,
        logisticsCostMultiplier: 1 - (1 - contribution.logisticsCostMultiplier) * 0.4,
        freightCapacityIndex: contribution.freightCapacityIndex * 0.25,
        travelTimeFactor: 1 - (1 - contribution.travelTimeFactor) * 0.5,
      };
      mergeRegionalContribution(servedAccum[regionId], spill);
    }
  }

  for (const code of AU_REGION_CODES) {
    const acc = servedAccum[code];
    byRegion[code].productivityIndexBonus = acc.productivityIndexBonus;
    byRegion[code].logisticsCostMultiplier = finalizeRegionalLogisticsMultiplier(acc.logisticsCostMultiplier);
    byRegion[code].freightCapacityIndex = acc.freightCapacityIndex;
    byRegion[code].travelTimeFactor = finalizeRegionalTravelFactor(acc.travelTimeFactor, acc.assetCount);
    byRegion[code].assetCount = acc.assetCount;
  }

  let nationalProductivityIndexBonus = 0;
  let nationalLogisticsCostMultiplier = 1;
  let nationalFreightCapacityIndex = 0;
  for (const code of AU_REGION_CODES) {
    const r = byRegion[code];
    nationalProductivityIndexBonus += r.productivityIndexBonus;
    nationalLogisticsCostMultiplier *= r.logisticsCostMultiplier;
    nationalFreightCapacityIndex += r.freightCapacityIndex;
  }
  nationalLogisticsCostMultiplier = finalizeRegionalLogisticsMultiplier(
    Math.pow(nationalLogisticsCostMultiplier, 1 / AU_REGION_CODES.length),
  );
  nationalFreightCapacityIndex /= AU_REGION_CODES.length;

  const computeMs = (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0;

  return {
    schemaVersion: 'agent12/1',
    turn: inputs.turn,
    byRegion,
    nationalProductivityIndexBonus,
    nationalLogisticsCostMultiplier,
    nationalFreightCapacityIndex,
    computeMs,
  };
}

export function formatRegionalProductivitySummary(region: RegionalTransportProductivity): string {
  return [
    region.regionId,
    `Δprod=${region.productivityIndexBonus.toFixed(1)}`,
    `logistics×=${region.logisticsCostMultiplier.toFixed(3)}`,
    `freightIdx=${region.freightCapacityIndex.toFixed(0)}`,
    `travel×=${region.travelTimeFactor.toFixed(3)}`,
    `assets=${region.assetCount}`,
  ].join(' ');
}


// --- source: run-self-checks.ts ---

export interface SelfCheckResult {
  id: string;
  ok: boolean;
  detail: string;
}

export function runAgent12TransportSelfChecks(): SelfCheckResult[] {
  const results: SelfCheckResult[] = [];

  const integrity = getCatalogIntegrityReport();
  results.push({
    id: 'catalog_integrity',
    ok: integrity.duplicateIds.length === 0 && integrity.invalidRegions.length === 0 && integrity.totalAssets >= 30,
    detail: JSON.stringify(integrity),
  });

  const baseline = computeNationalTransportProductivity({
    turn: 1,
    assets: getAgent12TransportCatalog(),
    operationalAssetIds: getDefaultOperationalAssetIds(),
  });
  results.push({
    id: 'baseline_national_bonus_positive',
    ok: baseline.nationalProductivityIndexBonus > 40 && baseline.nationalFreightCapacityIndex > 5,
    detail: `bonus=${baseline.nationalProductivityIndexBonus.toFixed(1)} freightIdx=${baseline.nationalFreightCapacityIndex.toFixed(1)} ms=${baseline.computeMs.toFixed(1)}`,
  });

  const waBefore = baseline.byRegion.WA.productivityIndexBonus;
  const withProject = deriveOperationalAssetsFromProjects(
    [{ id: 'infra_v93_wa_freight_rail', projectType: 'freight_rail_upgrade', regionId: 'WA', status: 'active' }],
    2,
  );
  const waAfter = withProject.byRegion.WA.productivityIndexBonus;
  results.push({
    id: 'active_project_boosts_wa',
    ok: waAfter >= waBefore,
    detail: `WA before=${waBefore.toFixed(2)} after=${waAfter.toFixed(2)}`,
  });

  const degraded = computeNationalTransportProductivity({
    turn: 3,
    assets: getAgent12TransportCatalog(),
    operationalAssetIds: getDefaultOperationalAssetIds(),
    conditionByAssetId: new Map([['road_nt_stuart', 'degraded']]),
    networkUtilization: { freight: 0.95 },
  });
  const ntDegraded = degraded.byRegion.NT.productivityIndexBonus;
  const ntBase = baseline.byRegion.NT.productivityIndexBonus;
  results.push({
    id: 'degraded_road_and_congestion_lower_nt',
    ok: ntDegraded < ntBase,
    detail: `NT base=${ntBase.toFixed(2)} degraded=${ntDegraded.toFixed(2)}`,
  });

  results.push({
    id: 'compute_performance',
    ok: baseline.computeMs < 500,
    detail: `${baseline.computeMs.toFixed(2)}ms`,
  });

  return results;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const results = runAgent12TransportSelfChecks();
  let failed = 0;
  for (const r of results) {
    const mark = r.ok ? 'OK' : 'FAIL';
    if (!r.ok) failed += 1;
    console.log(`${mark} ${r.id}: ${r.detail}`);
  }
  process.exit(failed > 0 ? 1 : 0);
}


// OP10M_MODULE_END agent-12-infrastructure
