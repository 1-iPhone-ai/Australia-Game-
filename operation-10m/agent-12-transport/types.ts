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
