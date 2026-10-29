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

/** Strategic corridor identity formed from operational catalog assets. */
export interface TransportCorridorDefinition {
  id: string;
  name: string;
  networkKind: StrategicNetworkKind;
  regionSequence: AuRegionCode[];
  /** At least one operational asset in each listed region must match a tag. */
  requiredTagsByRegion: Partial<Record<AuRegionCode, string[]>>;
  productivitySynergyPoints: number;
  logisticsRelief: number;
}

/** Turn-scoped stress on networks / regions (flood, strike, deferred maintenance wave). */
export interface TransportStressScenario {
  id: string;
  label: string;
  description: string;
  targetRegions: AuRegionCode[];
  networkKind?: StrategicNetworkKind;
  utilizationAdd: number;
  /** Shifts effective condition down by N steps (max 2). */
  conditionPenaltySteps: number;
  affectedCategories?: TransportAssetCategory[];
}

export interface CorridorActivation {
  corridorId: string;
  name: string;
  active: boolean;
  matchedRegions: AuRegionCode[];
  missingRegions: AuRegionCode[];
  synergyPoints: number;
}

export type TransportInvestmentTier = 'emerging' | 'regional' | 'integrated' | 'national_gateway';

export interface FleetCapacitySnapshot {
  roadIndex: number;
  railIndex: number;
  portIndex: number;
  logisticsIndex: number;
  nationalComposite: number;
}

export type SeasonalDemandBand = 'low' | 'normal' | 'peak';

export type ModalShiftPolicy = 'road' | 'balanced' | 'rail';

export type GreenFreightPolicy = 'baseline' | 'accelerate';

export type CongestionReliefPolicy = 'baseline' | 'invest' | 'priority_freight';

export type HydrogenFreightPolicy = 'baseline' | 'pipeline';

export type CustomsModernizationPolicy = 'baseline' | 'digitize';

export type CoastalShippingPolicy = 'baseline' | 'short_sea_boost';

export type BiosecurityStreamlinePolicy = 'baseline' | 'preclear';

export type AutonomousFreightPolicy = 'baseline' | 'deploy';

export type DeepSeaGatewayPolicy = 'baseline' | 'expand';

export type PermittingStreamlinePolicy = 'baseline' | 'fast_track';

export type ElectricFreightPolicy = 'baseline' | 'accelerate';

export type DefenceMobilityPolicy = 'baseline' | 'mobilize';

export type WeatherResiliencePolicy = 'baseline' | 'harden';

export type DigitalFreightPolicy = 'baseline' | 'integrate';

export type CriticalMineralsPolicy = 'baseline' | 'accelerate';

export type ChannelMaintenancePolicy = 'baseline' | 'dredge';

export type IndigenousRemoteSupplyPolicy = 'baseline' | 'strengthen';

export interface TransportInfrastructureState {
  schemaVersion: 'agent12/13';
  turn: number;
  productivity: NationalTransportProductivityReport;
  activeCorridors: CorridorActivation[];
  corridorSynergyPoints: number;
  intermodalSynergyByRegion: Record<AuRegionCode, number>;
  appliedScenarioIds: string[];
  bottleneckAssetIds: string[];
  maintenanceWarnings: string[];
  resilienceScoreByRegion: Record<AuRegionCode, number>;
  portRailCouplingByRegion: Record<AuRegionCode, number>;
  investmentTierByRegion: Record<AuRegionCode, TransportInvestmentTier>;
  scenarioStackFactor: number;
  projectedBacklogNextTurn: Record<string, number>;
  spilloverBonusByRegion: Record<AuRegionCode, number>;
  fleetCapacity: FleetCapacitySnapshot;
  climateModifierFactor: number;
  pipelineUnlockPoints: number;
  activePipelineStageIds: string[];
  freightLatencyByRegion: Record<AuRegionCode, number>;
  nationalFreightLatencyMedian: number;
  supplyChainResilienceIndex: number;
  supplyChainResilienceByRegion: Record<AuRegionCode, number>;
  weakestSupplyChainRegion: AuRegionCode;
  disruptionRecoveryFactor: number;
  intercapitalConnectivityIndex: number;
  modalBalanceIndex: number;
  electrifiedFreightShare: number;
  lastMileCoverageByRegion: Record<AuRegionCode, number>;
  nationalLastMileCoverage: number;
  nationalContainerThroughputIndex: number;
  containerThroughputByRegion: Record<AuRegionCode, number>;
  coldChainReliabilityIndex: number;
  coldChainReliabilityByRegion: Record<AuRegionCode, number>;
  greenFreightShare: number;
  nationalBulkExportThroughputIndex: number;
  bulkExportThroughputByRegion: Record<AuRegionCode, number>;
  nationalIntermodalDwellMedian: number;
  intermodalDwellByRegion: Record<AuRegionCode, number>;
  nationalUrbanCongestionIndex: number;
  urbanCongestionByRegion: Record<AuRegionCode, number>;
  nationalAviationCargoThroughputIndex: number;
  aviationCargoThroughputByRegion: Record<AuRegionCode, number>;
  nationalCustomsClearanceIndex: number;
  customsClearanceByRegion: Record<AuRegionCode, number>;
  hydrogenFreightShare: number;
  nationalHydrogenCorridorThroughputIndex: number;
  hydrogenCorridorThroughputByRegion: Record<AuRegionCode, number>;
  nationalCoastalShippingThroughputIndex: number;
  coastalShippingThroughputByRegion: Record<AuRegionCode, number>;
  nationalBiosecurityClearanceIndex: number;
  biosecurityClearanceByRegion: Record<AuRegionCode, number>;
  autonomousFreightShare: number;
  nationalAutonomousCorridorThroughputIndex: number;
  autonomousCorridorThroughputByRegion: Record<AuRegionCode, number>;
  nationalDeepSeaGatewayThroughputIndex: number;
  deepSeaGatewayThroughputByRegion: Record<AuRegionCode, number>;
  nationalInfrastructurePermittingIndex: number;
  infrastructurePermittingByRegion: Record<AuRegionCode, number>;
  electricFreightShare: number;
  nationalElectricCorridorThroughputIndex: number;
  electricCorridorThroughputByRegion: Record<AuRegionCode, number>;
  nationalDefenceLogisticsReadinessIndex: number;
  defenceLogisticsReadinessByRegion: Record<AuRegionCode, number>;
  nationalWeatherResilienceRoutingIndex: number;
  weatherResilienceRoutingByRegion: Record<AuRegionCode, number>;
  digitalFreightVisibilityShare: number;
  nationalDigitalFreightThroughputIndex: number;
  digitalFreightThroughputByRegion: Record<AuRegionCode, number>;
  nationalCriticalMineralsExportIndex: number;
  criticalMineralsExportByRegion: Record<AuRegionCode, number>;
  nationalChannelMaintenanceIndex: number;
  channelMaintenanceByRegion: Record<AuRegionCode, number>;
  indigenousRemoteSupplyShare: number;
  nationalIndigenousRemoteSupplyThroughputIndex: number;
  indigenousRemoteSupplyThroughputByRegion: Record<AuRegionCode, number>;
  computeMs: number;
}

export type ClimateTransportBand = 'mild' | 'warm' | 'hot' | 'extreme';

export interface TransportInfrastructureOptions {
  activeScenarioIds?: ReadonlySet<string>;
  maintenanceBacklogByAssetId?: ReadonlyMap<string, number>;
  maintenanceSpendIndex?: number;
  fundedPipelineStageIds?: ReadonlySet<string>;
  climateBand?: ClimateTransportBand;
  seasonalDemandBand?: SeasonalDemandBand;
  modalShiftPolicy?: ModalShiftPolicy;
  greenFreightPolicy?: GreenFreightPolicy;
  congestionReliefPolicy?: CongestionReliefPolicy;
  hydrogenFreightPolicy?: HydrogenFreightPolicy;
  customsModernizationPolicy?: CustomsModernizationPolicy;
  coastalShippingPolicy?: CoastalShippingPolicy;
  biosecurityStreamlinePolicy?: BiosecurityStreamlinePolicy;
  autonomousFreightPolicy?: AutonomousFreightPolicy;
  deepSeaGatewayPolicy?: DeepSeaGatewayPolicy;
  permittingStreamlinePolicy?: PermittingStreamlinePolicy;
  electricFreightPolicy?: ElectricFreightPolicy;
  defenceMobilityPolicy?: DefenceMobilityPolicy;
  weatherResiliencePolicy?: WeatherResiliencePolicy;
  digitalFreightPolicy?: DigitalFreightPolicy;
  criticalMineralsPolicy?: CriticalMineralsPolicy;
  channelMaintenancePolicy?: ChannelMaintenancePolicy;
  indigenousRemoteSupplyPolicy?: IndigenousRemoteSupplyPolicy;
}

export interface V94ProjectSnapshot {
  id: string;
  projectType: string;
  regionId: string;
  status: string;
}
