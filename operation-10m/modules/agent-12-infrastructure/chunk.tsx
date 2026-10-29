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

export type GaugeInteroperabilityPolicy = 'baseline' | 'harmonize';

export type DisasterRecoveryStagingPolicy = 'baseline' | 'surge';

export type CircularFreightPolicy = 'baseline' | 'expand';

export type AgriculturalExportPolicy = 'baseline' | 'accelerate';

export type TrackPossessionPolicy = 'baseline' | 'optimize';

export type GreenBunkeringPolicy = 'baseline' | 'expand';

export type PacificFeederPolicy = 'baseline' | 'expand';

export type MedicalSupplyPolicy = 'baseline' | 'surge';

export type DataCentreLogisticsPolicy = 'baseline' | 'accelerate';

export type OffshoreWindLogisticsPolicy = 'baseline' | 'deploy';

export type BatterySupplyChainPolicy = 'baseline' | 'accelerate';

export type CruiseTurnaroundPolicy = 'baseline' | 'expand';

export type SubseaCableLandingPolicy = 'baseline' | 'expand';

export type GreenAmmoniaExportPolicy = 'baseline' | 'accelerate';

export type AirportExpressRailPolicy = 'baseline' | 'deploy';

export type LithiumBrineExportPolicy = 'baseline' | 'accelerate';

export type InlandRailExpressPolicy = 'baseline' | 'deploy';

export type SpaceLaunchLogisticsPolicy = 'baseline' | 'expand';

export type RareEarthMagnetExportPolicy = 'baseline' | 'accelerate';

export type TransTasmanReeferExpressPolicy = 'baseline' | 'surge';

export type ZeroEmissionTruckCorridorPolicy = 'baseline' | 'expand';

export interface TransportInfrastructureState {
  schemaVersion: 'agent12/20';
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
  nationalGaugeInteroperabilityIndex: number;
  gaugeInteroperabilityByRegion: Record<AuRegionCode, number>;
  nationalDisasterRecoveryStagingIndex: number;
  disasterRecoveryStagingByRegion: Record<AuRegionCode, number>;
  circularFreightShare: number;
  nationalCircularFreightThroughputIndex: number;
  circularFreightThroughputByRegion: Record<AuRegionCode, number>;
  nationalAgriculturalExportThroughputIndex: number;
  agriculturalExportThroughputByRegion: Record<AuRegionCode, number>;
  nationalTrackPossessionEfficiencyIndex: number;
  trackPossessionEfficiencyByRegion: Record<AuRegionCode, number>;
  greenBunkeringShare: number;
  nationalGreenBunkeringThroughputIndex: number;
  greenBunkeringThroughputByRegion: Record<AuRegionCode, number>;
  nationalPacificFeederThroughputIndex: number;
  pacificFeederThroughputByRegion: Record<AuRegionCode, number>;
  nationalMedicalSupplyChainIndex: number;
  medicalSupplyChainByRegion: Record<AuRegionCode, number>;
  dataCentreLogisticsShare: number;
  nationalDataCentreLogisticsThroughputIndex: number;
  dataCentreLogisticsThroughputByRegion: Record<AuRegionCode, number>;
  nationalOffshoreWindLogisticsIndex: number;
  offshoreWindLogisticsByRegion: Record<AuRegionCode, number>;
  nationalBatterySupplyChainIndex: number;
  batterySupplyChainByRegion: Record<AuRegionCode, number>;
  cruiseTurnaroundShare: number;
  nationalCruiseTurnaroundThroughputIndex: number;
  cruiseTurnaroundThroughputByRegion: Record<AuRegionCode, number>;
  nationalSubseaCableLandingIndex: number;
  subseaCableLandingByRegion: Record<AuRegionCode, number>;
  nationalGreenAmmoniaExportIndex: number;
  greenAmmoniaExportByRegion: Record<AuRegionCode, number>;
  airportExpressRailShare: number;
  nationalAirportExpressRailThroughputIndex: number;
  airportExpressRailThroughputByRegion: Record<AuRegionCode, number>;
  nationalLithiumBrineExportIndex: number;
  lithiumBrineExportByRegion: Record<AuRegionCode, number>;
  inlandRailExpressShare: number;
  nationalInlandRailExpressIndex: number;
  inlandRailExpressByRegion: Record<AuRegionCode, number>;
  spaceLaunchLogisticsShare: number;
  nationalSpaceLaunchLogisticsThroughputIndex: number;
  spaceLaunchLogisticsThroughputByRegion: Record<AuRegionCode, number>;
  nationalRareEarthMagnetExportIndex: number;
  rareEarthMagnetExportByRegion: Record<AuRegionCode, number>;
  transTasmanReeferExpressShare: number;
  nationalTransTasmanReeferExpressIndex: number;
  transTasmanReeferExpressByRegion: Record<AuRegionCode, number>;
  zeroEmissionTruckCorridorShare: number;
  nationalZeroEmissionTruckCorridorThroughputIndex: number;
  zeroEmissionTruckCorridorThroughputByRegion: Record<AuRegionCode, number>;
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
  gaugeInteroperabilityPolicy?: GaugeInteroperabilityPolicy;
  disasterRecoveryStagingPolicy?: DisasterRecoveryStagingPolicy;
  circularFreightPolicy?: CircularFreightPolicy;
  agriculturalExportPolicy?: AgriculturalExportPolicy;
  trackPossessionPolicy?: TrackPossessionPolicy;
  greenBunkeringPolicy?: GreenBunkeringPolicy;
  pacificFeederPolicy?: PacificFeederPolicy;
  medicalSupplyPolicy?: MedicalSupplyPolicy;
  dataCentreLogisticsPolicy?: DataCentreLogisticsPolicy;
  offshoreWindLogisticsPolicy?: OffshoreWindLogisticsPolicy;
  batterySupplyChainPolicy?: BatterySupplyChainPolicy;
  cruiseTurnaroundPolicy?: CruiseTurnaroundPolicy;
  subseaCableLandingPolicy?: SubseaCableLandingPolicy;
  greenAmmoniaExportPolicy?: GreenAmmoniaExportPolicy;
  airportExpressRailPolicy?: AirportExpressRailPolicy;
  lithiumBrineExportPolicy?: LithiumBrineExportPolicy;
  inlandRailExpressPolicy?: InlandRailExpressPolicy;
  spaceLaunchLogisticsPolicy?: SpaceLaunchLogisticsPolicy;
  rareEarthMagnetExportPolicy?: RareEarthMagnetExportPolicy;
  transTasmanReeferExpressPolicy?: TransTasmanReeferExpressPolicy;
  zeroEmissionTruckCorridorPolicy?: ZeroEmissionTruckCorridorPolicy;
}

export interface V94ProjectSnapshot {
  id: string;
  projectType: string;
  regionId: string;
  status: string;
}


// --- source: operations/maintenance-backlog.ts ---

const CONDITION_ORDER: TransportAssetCondition[] = [
  'excellent',
  'good',
  'fair',
  'degraded',
  'closed',
];

export function conditionFromMaintenanceBacklog(backlog: number): TransportAssetCondition {
  const b = Math.max(0, Math.min(100, backlog));
  if (b <= 12) return 'excellent';
  if (b <= 28) return 'good';
  if (b <= 52) return 'fair';
  if (b <= 78) return 'degraded';
  return 'closed';
}

export function worsenCondition(
  base: TransportAssetCondition,
  penaltySteps: number,
): TransportAssetCondition {
  const idx = CONDITION_ORDER.indexOf(base);
  if (idx < 0) return base;
  return CONDITION_ORDER[Math.min(CONDITION_ORDER.length - 1, idx + Math.max(0, penaltySteps))];
}

export function buildConditionMapFromMaintenance(
  backlogByAssetId: ReadonlyMap<string, number> | undefined,
): Map<string, TransportAssetCondition> {
  const out = new Map<string, TransportAssetCondition>();
  if (!backlogByAssetId) return out;
  for (const [assetId, backlog] of backlogByAssetId.entries()) {
    out.set(assetId, conditionFromMaintenanceBacklog(backlog));
  }
  return out;
}

export function maintenanceWarningsFromBacklog(
  backlogByAssetId: ReadonlyMap<string, number> | undefined,
): string[] {
  if (!backlogByAssetId) return [];
  const warnings: string[] = [];
  for (const [assetId, backlog] of backlogByAssetId.entries()) {
    if (backlog >= 70) warnings.push(`${assetId}:critical_backlog=${backlog}`);
    else if (backlog >= 50) warnings.push(`${assetId}:elevated_backlog=${backlog}`);
  }
  return warnings.sort();
}


// --- source: catalog/corridors-round2.ts ---

export const TRANSPORT_CORRIDORS_ROUND2: TransportCorridorDefinition[] = [
  {
    id: 'corr_hunter_export_chain',
    name: 'Hunter Coal Export Chain',
    networkKind: 'trade',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['mining', 'bulk', 'freight_rail'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_gladstone_energy_export',
    name: 'Gladstone Energy Export Loop',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['bulk', 'multimodal'],
    },
    productivitySynergyPoints: 5,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_geelong_grain_chain',
    name: 'Geelong Grain & Port Chain',
    networkKind: 'trade',
    regionSequence: ['VIC'],
    requiredTagsByRegion: {
      VIC: ['grain', 'port_rail'],
    },
    productivitySynergyPoints: 4.5,
    logisticsRelief: 0.028,
  },
  {
    id: 'corr_national_air_freight_feed',
    name: 'Air Freight Feed (Brisbane–Sydney–Melbourne)',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW', 'VIC'],
    requiredTagsByRegion: {
      QLD: ['air', 'perishables'],
      NSW: ['intermodal', 'warehouse'],
      VIC: ['intermodal'],
    },
    productivitySynergyPoints: 4,
    logisticsRelief: 0.025,
  },
  {
    id: 'corr_wa_kwinana_bulk',
    name: 'Kwinana Bulk Export Loop',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['bulk', 'port'],
    },
    productivitySynergyPoints: 4.8,
    logisticsRelief: 0.032,
  },
];


// --- source: catalog/corridors-round3.ts ---

export const TRANSPORT_CORRIDORS_ROUND3: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_sydney_freight_ring',
    name: 'Sydney Freight Ring',
    networkKind: 'freight',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['intermodal', 'port_rail', 'container'],
    },
    productivitySynergyPoints: 6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_qld_coal_chain',
    name: 'Queensland Coal Export Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['bulk', 'mining', 'freight_rail'],
    },
    productivitySynergyPoints: 7.5,
    logisticsRelief: 0.045,
  },
  {
    id: 'corr_vic_western_distribution',
    name: 'Western Melbourne Distribution Hub',
    networkKind: 'freight',
    regionSequence: ['VIC'],
    requiredTagsByRegion: {
      VIC: ['warehouse', 'intermodal', 'motorway'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_tas_devonport_bass',
    name: 'Devonport Bass Gateway',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['island', 'container'],
      VIC: ['intermodal'],
    },
    productivitySynergyPoints: 4.2,
    logisticsRelief: 0.028,
  },
];


// --- source: catalog/corridors-round4.ts ---

export const TRANSPORT_CORRIDORS_ROUND4: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_cape_supply',
    name: 'Cape York Remote Supply Chain',
    networkKind: 'freight',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['remote', 'national_highway', 'mining'],
    },
    productivitySynergyPoints: 4.8,
    logisticsRelief: 0.031,
  },
  {
    id: 'corr_sa_spencer_gulf',
    name: 'Spencer Gulf Grain Export',
    networkKind: 'trade',
    regionSequence: ['SA'],
    requiredTagsByRegion: {
      SA: ['grain', 'bulk', 'port_access'],
    },
    productivitySynergyPoints: 5.4,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_nsw_blue_mountains_pass',
    name: 'Blue Mountains Intercapital Pass',
    networkKind: 'freight',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['grade', 'freight_rail', 'motorway'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_wa_onslow_lng',
    name: 'Onslow LNG Logistics Spine',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['lng', 'trade', 'remote'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_act_hume_bypass',
    name: 'Capital Hume Bypass Feed',
    networkKind: 'mobility',
    regionSequence: ['ACT', 'NSW'],
    requiredTagsByRegion: {
      ACT: ['capital', 'warehouse'],
      NSW: ['motorway', 'freight'],
    },
    productivitySynergyPoints: 3.8,
    logisticsRelief: 0.026,
  },
];


// --- source: catalog/corridors-round5.ts ---

export const TRANSPORT_CORRIDORS_ROUND5: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_bass_trade',
    name: 'Bass Strait Trade Bridge',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['bass_strait', 'export'],
      VIC: ['port_access', 'motorway'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nt_darwin_gate',
    name: 'Top End Darwin Export Gate',
    networkKind: 'trade',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['export', 'port_access'],
      QLD: ['remote', 'freight'],
    },
    productivitySynergyPoints: 5.1,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_nsw_hunter_export',
    name: 'Hunter Valley Export Chain',
    networkKind: 'trade',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['coal', 'port_access', 'freight_rail'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.041,
  },
];


// --- source: catalog/corridors-round6.ts ---

export const TRANSPORT_CORRIDORS_ROUND6: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_illawarra_steel',
    name: 'Illawarra Steel Export Chain',
    networkKind: 'trade',
    regionSequence: ['NSW'],
    requiredTagsByRegion: {
      NSW: ['steel', 'port_access', 'freight_rail'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.043,
  },
  {
    id: 'corr_qld_cairns_trade',
    name: 'Cairns Tropical Trade Loop',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['export', 'container', 'port_access'],
    },
    productivitySynergyPoints: 5.4,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_act_capital_cold_chain',
    name: 'Capital Cold Chain Feed',
    networkKind: 'freight',
    regionSequence: ['ACT', 'NSW'],
    requiredTagsByRegion: {
      ACT: ['capital', 'warehouse'],
      NSW: ['motorway', 'freight'],
    },
    productivitySynergyPoints: 4.8,
    logisticsRelief: 0.031,
  },
];


// --- source: catalog/corridors-round7.ts ---

export const TRANSPORT_CORRIDORS_ROUND7: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_pilbara_lithium_bulk',
    name: 'Pilbara Lithium Bulk Export Chain',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['mining', 'heavy_haul', 'bulk'],
    },
    productivitySynergyPoints: 8.6,
    logisticsRelief: 0.048,
  },
  {
    id: 'corr_nt_barkly_remote_supply',
    name: 'Barkly Remote Supply Chain',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['remote', 'gateway'],
      QLD: ['national_highway', 'freight'],
    },
    productivitySynergyPoints: 5.2,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_tas_devonport_fresh_export',
    name: 'Devonport Fresh Export Loop',
    networkKind: 'trade',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['island', 'export'],
      VIC: ['intermodal', 'container'],
    },
    productivitySynergyPoints: 4.6,
    logisticsRelief: 0.029,
  },
];


// --- source: catalog/corridors-round8.ts ---

export const TRANSPORT_CORRIDORS_ROUND8: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_brisbane_air_cargo_chain',
    name: 'Brisbane Air Cargo Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['air_freight', 'cargo_terminal', 'gateway'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.041,
  },
  {
    id: 'corr_wa_kwinana_hydrogen_export',
    name: 'Kwinana Hydrogen Export Chain',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['hydrogen', 'energy_export', 'bulk'],
    },
    productivitySynergyPoints: 8.2,
    logisticsRelief: 0.046,
  },
  {
    id: 'corr_nsw_western_sydney_air_rail',
    name: 'Western Sydney Air-Rail Loop',
    networkKind: 'trade',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['air_freight', 'cargo_terminal'],
      ACT: ['air_freight', 'capital'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
];


// --- source: catalog/corridors-round9.ts ---

export const TRANSPORT_CORRIDORS_ROUND9: TransportCorridorDefinition[] = [
  {
    id: 'corr_tas_bass_short_sea',
    name: 'Bass Strait Short-Sea Chain',
    networkKind: 'freight',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['coastal_shipping', 'roro', 'island'],
      VIC: ['short_sea', 'roro', 'container'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.039,
  },
  {
    id: 'corr_qld_gladstone_biosecurity',
    name: 'Gladstone Biosecurity Export Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['biosecurity', 'quarantine', 'bulk'],
    },
    productivitySynergyPoints: 7.1,
    logisticsRelief: 0.042,
  },
  {
    id: 'corr_nsw_vic_autonomous_freight_spine',
    name: 'NSW–VIC Autonomous Freight Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['autonomous', 'motorway', 'smart_freight'],
      VIC: ['platoon', 'motorway', 'freight'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
];


// --- source: catalog/corridors-round10.ts ---

export const TRANSPORT_CORRIDORS_ROUND10: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_melbourne_deep_sea',
    name: 'Sydney–Melbourne Deep-Sea Gateway',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['deep_sea', 'tradelane', 'mega_container'],
      VIC: ['deep_sea', 'container', 'gateway'],
    },
    productivitySynergyPoints: 7.4,
    logisticsRelief: 0.044,
  },
  {
    id: 'corr_qld_brisbane_tradelane',
    name: 'Brisbane Pacific Tradelane Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['deep_sea', 'tradelane', 'gateway'],
    },
    productivitySynergyPoints: 6.9,
    logisticsRelief: 0.041,
  },
  {
    id: 'corr_nsw_vic_electric_freight',
    name: 'NSW–VIC Electric Freight Corridor',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['electric_freight', 'charging', 'motorway'],
      VIC: ['bev', 'charging', 'freight'],
      ACT: ['electric_freight', 'capital'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.035,
  },
];


// --- source: catalog/corridors-round11.ts ---

export const TRANSPORT_CORRIDORS_ROUND11: TransportCorridorDefinition[] = [
  {
    id: 'corr_nt_defence_northern_mobility',
    name: 'Northern Defence Mobility Chain',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD', 'WA'],
    requiredTagsByRegion: {
      NT: ['defence_logistics', 'strategic_mobility', 'remote'],
      QLD: ['defence_logistics', 'military_freight'],
      WA: ['strategic_mobility', 'remote'],
    },
    productivitySynergyPoints: 6.8,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_nsw_weather_resilience_spine',
    name: 'NSW Weather Resilience Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['weather_resilience', 'flood_bypass', 'motorway'],
      ACT: ['weather_resilience', 'capital'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_vic_digital_freight_mesh',
    name: 'Victoria Digital Freight Mesh',
    networkKind: 'trade',
    regionSequence: ['VIC', 'NSW'],
    requiredTagsByRegion: {
      VIC: ['digital_freight', 'visibility', 'telemetry'],
      NSW: ['digital_freight', 'gateway'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.037,
  },
];


// --- source: catalog/corridors-round12.ts ---

export const TRANSPORT_CORRIDORS_ROUND12: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_pilbara_critical_minerals',
    name: 'Pilbara Critical Minerals Export',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['critical_minerals', 'lithium', 'bulk'],
    },
    productivitySynergyPoints: 7.8,
    logisticsRelief: 0.045,
  },
  {
    id: 'corr_qld_gladstone_channel_chain',
    name: 'Gladstone Channel Maintenance Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['dredging', 'pilotage', 'channel_depth'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nt_indigenous_remote_supply',
    name: 'Top End Indigenous Remote Supply',
    networkKind: 'freight',
    regionSequence: ['NT', 'QLD', 'WA'],
    requiredTagsByRegion: {
      NT: ['indigenous_supply', 'remote_community', 'remote'],
      QLD: ['remote_community', 'remote'],
      WA: ['indigenous_supply', 'remote'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.036,
  },
];


// --- source: catalog/corridors-round13.ts ---

export const TRANSPORT_CORRIDORS_ROUND13: TransportCorridorDefinition[] = [
  {
    id: 'corr_sa_adelaide_gauge_bridge',
    name: 'Adelaide Gauge Interoperability Bridge',
    networkKind: 'freight',
    regionSequence: ['SA', 'VIC', 'NSW'],
    requiredTagsByRegion: {
      SA: ['gauge_standard', 'interoperability', 'intermodal'],
      VIC: ['standard_gauge', 'freight_rail'],
      NSW: ['gauge_break', 'interoperability'],
    },
    productivitySynergyPoints: 6.7,
    logisticsRelief: 0.039,
  },
  {
    id: 'corr_nsw_disaster_recovery_ring',
    name: 'NSW Disaster Recovery Ring',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['disaster_recovery', 'emergency_staging'],
      ACT: ['emergency_relief', 'capital'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.033,
  },
  {
    id: 'corr_vic_circular_freight_loop',
    name: 'Victoria Circular Freight Loop',
    networkKind: 'freight',
    regionSequence: ['VIC'],
    requiredTagsByRegion: {
      VIC: ['circular_economy', 'waste_logistics', 'recycle_freight'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.031,
  },
];


// --- source: catalog/corridors-round14.ts ---

export const TRANSPORT_CORRIDORS_ROUND14: TransportCorridorDefinition[] = [
  {
    id: 'corr_sa_grain_export_belt',
    name: 'SA Grain Export Belt',
    networkKind: 'trade',
    regionSequence: ['SA', 'VIC'],
    requiredTagsByRegion: {
      SA: ['grain_export', 'agricultural_bulk', 'grain'],
      VIC: ['harvest_corridor', 'grain'],
    },
    productivitySynergyPoints: 6.6,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nsw_track_possession_mesh',
    name: 'NSW Track Possession Mesh',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['track_possession', 'maintenance_window', 'rail_availability'],
      ACT: ['rail_availability', 'freight_rail'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.032,
  },
  {
    id: 'corr_qld_green_bunkering_chain',
    name: 'Queensland Green Bunkering Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['green_bunkering', 'ammonia_fuel', 'shore_power'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.037,
  },
];


// --- source: catalog/corridors-round15.ts ---

export const TRANSPORT_CORRIDORS_ROUND15: TransportCorridorDefinition[] = [
  {
    id: 'corr_qld_pacific_feeder_chain',
    name: 'Queensland Pacific Feeder Chain',
    networkKind: 'trade',
    regionSequence: ['QLD'],
    requiredTagsByRegion: {
      QLD: ['pacific_feeder', 'tradelane_pacific', 'feeder'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_act_medical_supply',
    name: 'NSW–ACT Medical Supply Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'ACT'],
    requiredTagsByRegion: {
      NSW: ['medical_supply', 'health_freight', 'pharma_cold'],
      ACT: ['medical_supply', 'pharma_cold', 'capital'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.034,
  },
  {
    id: 'corr_nsw_vic_data_centre_mesh',
    name: 'NSW–VIC Data Centre Logistics Mesh',
    networkKind: 'freight',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['data_centre', 'hyperscale_logistics', 'digital_infra'],
      VIC: ['data_centre', 'digital_infra'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.035,
  },
];


// --- source: catalog/corridors-round16.ts ---

export const TRANSPORT_CORRIDORS_ROUND16: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_offshore_wind_chain',
    name: 'WA–SA Offshore Wind Chain',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['offshore_wind', 'wind_farm_logistics', 'turbine_staging'],
      SA: ['offshore_wind', 'offshore_staging', 'wind_farm_logistics'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_wa_battery_export_spine',
    name: 'Western Australia Battery Export Spine',
    networkKind: 'freight',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['battery_supply', 'lithium_logistics', 'ev_freight'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_qld_nsw_cruise_turnaround',
    name: 'QLD–NSW Cruise Turnaround Corridor',
    networkKind: 'mobility',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['cruise_turnaround', 'tourism_port', 'passenger_freight'],
      NSW: ['cruise_turnaround', 'tourism_port'],
    },
    productivitySynergyPoints: 5.6,
    logisticsRelief: 0.033,
  },
];


// --- source: catalog/corridors-round17.ts ---

export const TRANSPORT_CORRIDORS_ROUND17: TransportCorridorDefinition[] = [
  {
    id: 'corr_nsw_qld_subsea_cable_chain',
    name: 'NSW–QLD Subsea Cable Chain',
    networkKind: 'trade',
    regionSequence: ['NSW', 'QLD'],
    requiredTagsByRegion: {
      NSW: ['subsea_cable', 'cable_landing', 'digital_trade'],
      QLD: ['subsea_cable', 'telecom_landing', 'digital_trade'],
    },
    productivitySynergyPoints: 6.1,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_wa_sa_green_ammonia_export',
    name: 'WA–SA Green Ammonia Export Spine',
    networkKind: 'freight',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['green_ammonia', 'ammonia_export', 'hydrogen_derivative'],
      SA: ['green_ammonia', 'renewable_export', 'ammonia_export'],
    },
    productivitySynergyPoints: 6.4,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_nsw_vic_airport_express_spine',
    name: 'NSW–VIC Airport Express Spine',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['airport_express', 'air_rail', 'passenger_freight'],
      VIC: ['airport_express', 'air_rail'],
    },
    productivitySynergyPoints: 5.8,
    logisticsRelief: 0.032,
  },
];


// --- source: catalog/corridors-round18.ts ---

export const TRANSPORT_CORRIDORS_ROUND18: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_sa_lithium_brine_chain',
    name: 'WA–SA Lithium Brine Chain',
    networkKind: 'trade',
    regionSequence: ['WA', 'SA'],
    requiredTagsByRegion: {
      WA: ['lithium_brine', 'brine_export', 'battery_feedstock'],
      SA: ['lithium_brine', 'brine_export', 'battery_feedstock'],
    },
    productivitySynergyPoints: 6.2,
    logisticsRelief: 0.036,
  },
  {
    id: 'corr_qld_nsw_inland_rail_express',
    name: 'QLD–NSW Inland Rail Express',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['inland_rail_express', 'express_freight', 'intermodal_express'],
      NSW: ['inland_rail_express', 'express_freight', 'intermodal_express'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.038,
  },
  {
    id: 'corr_nt_sa_space_launch_spine',
    name: 'NT–SA Space Launch Spine',
    networkKind: 'freight',
    regionSequence: ['NT', 'SA'],
    requiredTagsByRegion: {
      NT: ['space_launch', 'launch_logistics', 'orbital_supply'],
      SA: ['space_launch', 'launch_logistics', 'orbital_supply'],
    },
    productivitySynergyPoints: 5.9,
    logisticsRelief: 0.033,
  },
];


// --- source: catalog/corridors-round19.ts ---

export const TRANSPORT_CORRIDORS_ROUND19: TransportCorridorDefinition[] = [
  {
    id: 'corr_wa_qld_rare_earth_chain',
    name: 'WA–QLD Rare-Earth Chain',
    networkKind: 'trade',
    regionSequence: ['WA', 'QLD'],
    requiredTagsByRegion: {
      WA: ['rare_earth', 'magnet_export', 'ndfeb_supply'],
      QLD: ['rare_earth', 'magnet_export', 'ndfeb_supply'],
    },
    productivitySynergyPoints: 6.3,
    logisticsRelief: 0.037,
  },
  {
    id: 'corr_tas_vic_trans_tasman_reefer',
    name: 'TAS–VIC Trans-Tasman Reefer',
    networkKind: 'freight',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['trans_tasman', 'reefer_express', 'cold_chain_sea'],
      VIC: ['trans_tasman', 'reefer_express', 'cold_chain_sea'],
    },
    productivitySynergyPoints: 5.7,
    logisticsRelief: 0.031,
  },
  {
    id: 'corr_nsw_sa_zero_emission_truck_spine',
    name: 'NSW–SA Zero-Emission Truck Spine',
    networkKind: 'freight',
    regionSequence: ['NSW', 'SA'],
    requiredTagsByRegion: {
      NSW: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul'],
      SA: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul'],
    },
    productivitySynergyPoints: 6.0,
    logisticsRelief: 0.034,
  },
];


// --- source: catalog/corridors-catalog.ts ---

export const TRANSPORT_CORRIDORS: TransportCorridorDefinition[] = [
  {
    id: 'corr_east_coast_freight',
    name: 'East Coast Freight Chain',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW', 'VIC'],
    requiredTagsByRegion: {
      QLD: ['national_highway', 'freight'],
      NSW: ['freight', 'motorway'],
      VIC: ['motorway', 'port_access'],
    },
    productivitySynergyPoints: 8,
    logisticsRelief: 0.06,
  },
  {
    id: 'corr_sydney_melbourne_mobility',
    name: 'Sydney–Melbourne Mobility Spine',
    networkKind: 'mobility',
    regionSequence: ['NSW', 'VIC'],
    requiredTagsByRegion: {
      NSW: ['freight', 'national_highway'],
      VIC: ['motorway'],
    },
    productivitySynergyPoints: 6.5,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_transcontinental_road',
    name: 'Transcontinental Road Link',
    networkKind: 'freight',
    regionSequence: ['WA', 'SA', 'NSW'],
    requiredTagsByRegion: {
      WA: ['mining', 'port_access'],
      SA: ['transcontinental', 'east_west'],
      NSW: ['national_highway'],
    },
    productivitySynergyPoints: 7,
    logisticsRelief: 0.05,
  },
  {
    id: 'corr_pilbara_export',
    name: 'Pilbara Export System',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['mining', 'bulk', 'heavy_haul'],
    },
    productivitySynergyPoints: 9,
    logisticsRelief: 0.07,
  },
  {
    id: 'corr_qld_inland_rail',
    name: 'Queensland Inland Rail Feed',
    networkKind: 'freight',
    regionSequence: ['QLD', 'NSW'],
    requiredTagsByRegion: {
      QLD: ['inland_rail', 'freight'],
      NSW: ['freight_rail', 'intercapital'],
    },
    productivitySynergyPoints: 7.5,
    logisticsRelief: 0.055,
  },
  {
    id: 'corr_northern_gateway',
    name: 'Northern Gateway (Darwin)',
    networkKind: 'trade',
    regionSequence: ['NT', 'QLD'],
    requiredTagsByRegion: {
      NT: ['remote', 'gateway'],
      QLD: ['multimodal', 'port'],
    },
    productivitySynergyPoints: 5.5,
    logisticsRelief: 0.045,
  },
  {
    id: 'corr_southeast_ports',
    name: 'South-East Container Ports Triangle',
    networkKind: 'trade',
    regionSequence: ['NSW', 'VIC', 'SA'],
    requiredTagsByRegion: {
      NSW: ['container'],
      VIC: ['container'],
      SA: ['grain'],
    },
    productivitySynergyPoints: 6,
    logisticsRelief: 0.04,
  },
  {
    id: 'corr_tas_bass_link',
    name: 'Tasmanian Bass Strait Supply',
    networkKind: 'freight',
    regionSequence: ['TAS', 'VIC'],
    requiredTagsByRegion: {
      TAS: ['regional', 'island'],
      VIC: ['container', 'intermodal'],
    },
    productivitySynergyPoints: 4,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_act_capital_feed',
    name: 'Capital Region Feed',
    networkKind: 'mobility',
    regionSequence: ['ACT', 'NSW'],
    requiredTagsByRegion: {
      ACT: ['capital', 'retail'],
      NSW: ['motorway', 'intermodal'],
    },
    productivitySynergyPoints: 3.5,
    logisticsRelief: 0.025,
  },
  {
    id: 'corr_wa_perth_port_ring',
    name: 'Perth Port Ring',
    networkKind: 'trade',
    regionSequence: ['WA'],
    requiredTagsByRegion: {
      WA: ['port_access', 'container'],
    },
    productivitySynergyPoints: 5,
    logisticsRelief: 0.035,
  },
  {
    id: 'corr_sa_adelaide_hub',
    name: 'Adelaide Intermodal Hub',
    networkKind: 'freight',
    regionSequence: ['SA'],
    requiredTagsByRegion: {
      SA: ['intermodal', 'gauge_standard'],
    },
    productivitySynergyPoints: 4.5,
    logisticsRelief: 0.03,
  },
  {
    id: 'corr_national_remote_logistics',
    name: 'Remote Logistics Resilience',
    networkKind: 'freight',
    regionSequence: ['NT', 'WA', 'QLD'],
    requiredTagsByRegion: {
      NT: ['remote'],
      WA: ['remote'],
      QLD: ['grain_corridor'],
    },
    productivitySynergyPoints: 5,
    logisticsRelief: 0.04,
  },
  ...TRANSPORT_CORRIDORS_ROUND2,
  ...TRANSPORT_CORRIDORS_ROUND3,
  ...TRANSPORT_CORRIDORS_ROUND4,
  ...TRANSPORT_CORRIDORS_ROUND5,
  ...TRANSPORT_CORRIDORS_ROUND6,
  ...TRANSPORT_CORRIDORS_ROUND7,
  ...TRANSPORT_CORRIDORS_ROUND8,
  ...TRANSPORT_CORRIDORS_ROUND9,
  ...TRANSPORT_CORRIDORS_ROUND10,
  ...TRANSPORT_CORRIDORS_ROUND11,
  ...TRANSPORT_CORRIDORS_ROUND12,
  ...TRANSPORT_CORRIDORS_ROUND13,
  ...TRANSPORT_CORRIDORS_ROUND14,
  ...TRANSPORT_CORRIDORS_ROUND15,
  ...TRANSPORT_CORRIDORS_ROUND16,
  ...TRANSPORT_CORRIDORS_ROUND17,
  ...TRANSPORT_CORRIDORS_ROUND18,
  ...TRANSPORT_CORRIDORS_ROUND19,
];

export function corridorsByNetwork(): Record<StrategicNetworkKind, TransportCorridorDefinition[]> {
  const out: Record<StrategicNetworkKind, TransportCorridorDefinition[]> = {
    freight: [],
    trade: [],
    mobility: [],
  };
  for (const c of TRANSPORT_CORRIDORS) out[c.networkKind].push(c);
  return out;
}

export function getCorridorById(id: string): TransportCorridorDefinition | undefined {
  return TRANSPORT_CORRIDORS.find((c) => c.id === id);
}

export function corridorTouchesRegion(corridor: TransportCorridorDefinition, region: AuRegionCode): boolean {
  return corridor.regionSequence.includes(region);
}


// --- source: catalog/scenarios-round2.ts ---

export const TRANSPORT_SCENARIOS_ROUND2: TransportStressScenario[] = [
  {
    id: 'scn_nsw_hunter_flood',
    label: 'Hunter Valley Flood',
    description: 'Coal rail and road diversions around Newcastle.',
    targetRegions: ['NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.19,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail', 'road'],
  },
  {
    id: 'scn_vic_container_surge',
    label: 'Melbourne Container Surge',
    description: 'Port of Melbourne berth saturation.',
    targetRegions: ['VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_qld_cape_rail',
    label: 'Cape York Supply Disruption',
    description: 'Remote QLD logistics strain.',
    targetRegions: ['QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.17,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_wa_port_hedland_wind',
    label: 'Port Hedland Cyclone Wind Hold',
    description: 'Bulk export shutdown window.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.3,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
  {
    id: 'scn_sa_grain_peak',
    label: 'SA Grain Harvest Peak',
    description: 'Outer Harbor and road peak loading.',
    targetRegions: ['SA'],
    networkKind: 'trade',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'road'],
  },
  {
    id: 'scn_tas_island_supply',
    label: 'Tasmanian Island Supply Shock',
    description: 'Bass link + port delays compound.',
    targetRegions: ['TAS'],
    networkKind: 'freight',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 1,
  },
  {
    id: 'scn_nt_defence_lift',
    label: 'Top End Defence Logistics Lift',
    description: 'Competing priority freight to remote sites.',
    targetRegions: ['NT'],
    networkKind: 'freight',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
  {
    id: 'scn_multi_coastal_compound',
    label: 'Multi-Coastal Weather Compound',
    description: 'Simultaneous east + west coast port delays.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA'],
    networkKind: 'trade',
    utilizationAdd: 0.14,
    conditionPenaltySteps: 1,
    affectedCategories: ['port'],
  },
];


// --- source: catalog/scenarios-round3.ts ---

export const TRANSPORT_SCENARIOS_ROUND3: TransportStressScenario[] = [
  {
    id: 'scn_nsw_port_kembla_congestion',
    label: 'Port Kembla Berth Congestion',
    description: 'Steel and coal export queue at Port Kembla.',
    targetRegions: ['NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_qld_coal_rail_bottleneck',
    label: 'Bowen Basin Rail Bottleneck',
    description: 'Coal train cycle times blow out.',
    targetRegions: ['QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.29,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_vic_western_distribution_peak',
    label: 'Western Melbourne Peak Season',
    description: 'Mega-warehouse saturation pre-Christmas.',
    targetRegions: ['VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
  {
    id: 'scn_wa_northwest_cyclone',
    label: 'North West Cyclone Season',
    description: 'Karratha–Hedland road and port holds.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'port'],
  },
  {
    id: 'scn_tas_devonport_rollover',
    label: 'Devonport Ro-Ro Rollover Delay',
    description: 'Bass Strait vessel delays cascade.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_sa_wingfield_labour',
    label: 'Adelaide Warehouse Labour Gap',
    description: 'Pick/pack capacity constrained.',
    targetRegions: ['SA'],
    networkKind: 'freight',
    utilizationAdd: 0.15,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics'],
  },
  {
    id: 'scn_climate_heat_slow_orders',
    label: 'National Heat Slow Orders',
    description: 'Track and road speed restrictions in heatwave.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'NT'],
    networkKind: 'freight',
    utilizationAdd: 0.12,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'rail'],
  },
  {
    id: 'scn_investment_pipeline_delay',
    label: 'Public Investment Pipeline Delay',
    description: 'Procurement delays slow corridor upgrades.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'],
    utilizationAdd: 0.09,
    conditionPenaltySteps: 1,
  },
];


// --- source: catalog/scenarios-round4.ts ---

export const TRANSPORT_SCENARIOS_ROUND4: TransportStressScenario[] = [
  {
    id: 'scn_nsw_blue_mountains_landslip',
    label: 'Blue Mountains Landslip Closure',
    description: 'Escarpment rail and road possession after heavy rain.',
    targetRegions: ['NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'rail'],
  },
  {
    id: 'scn_vic_geelong_port_surge',
    label: 'Geelong Port Rail Surge',
    description: 'Melbourne port diversion overloads Corio shuttle paths.',
    targetRegions: ['VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'port'],
  },
  {
    id: 'scn_sa_grain_harvest_rail',
    label: 'Eyre Peninsula Harvest Rail Peak',
    description: 'Grain road trains queue at Spencer Gulf loaders.',
    targetRegions: ['SA'],
    networkKind: 'trade',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'port'],
  },
  {
    id: 'scn_wa_onslow_cyclone_hold',
    label: 'Onslow Cyclone Port Hold',
    description: 'North West Shelf vessels held offshore; supply base backlog.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.3,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_qld_cape_road_failure',
    label: 'Cape York Wet Season Washout',
    description: 'Sealed feed sections cut; Weipa supply reroutes.',
    targetRegions: ['QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_act_hume_retail_peak',
    label: 'Capital Region Retail Peak',
    description: 'Canberra distribution centres saturate pre-holiday.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.19,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
];


// --- source: catalog/scenarios-round5.ts ---

export const TRANSPORT_SCENARIOS_ROUND5: TransportStressScenario[] = [
  {
    id: 'scn_tas_bass_ferry_delay',
    label: 'Bass Strait Ferry Schedule Slip',
    description: 'Weather delays cut Burnie sailings; mainland stock buffers.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_nt_plenty_flood',
    label: 'Plenty Highway Flood Closure',
    description: 'Central Australia wet season isolates Alice supply convoys.',
    targetRegions: ['NT', 'QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_wa_kenwick_fire',
    label: 'Kenwick Warehouse Fire Hold',
    description: 'Perth intermodal yard partial shutdown reroutes rail.',
    targetRegions: ['WA'],
    networkKind: 'freight',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'rail'],
  },
  {
    id: 'scn_qld_port_rail_creep',
    label: 'Brisbane Port Rail Pathing Creep',
    description: 'Shuttle pathing conflicts extend dwell at Fisherman Islands.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'port'],
  },
  {
    id: 'scn_vic_dandenong_peak',
    label: 'Dandenong Fulfilment Peak',
    description: 'E-commerce surge saturates southeast Melbourne DC exits.',
    targetRegions: ['VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
];


// --- source: catalog/scenarios-round6.ts ---

export const TRANSPORT_SCENARIOS_ROUND6: TransportStressScenario[] = [
  {
    id: 'scn_nsw_kembla_strike',
    label: 'Port Kembla Stevedore Slowdown',
    description: 'Steel export backlog extends container dwell at Illawarra.',
    targetRegions: ['NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_qld_cairns_cyclone',
    label: 'Cairns Cyclone Supply Hold',
    description: 'Tropical cyclone closes reef supply highway segments.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.29,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_act_hume_cold_failure',
    label: 'Hume Cold Chain Compressor Outage',
    description: 'Capital region chilled DC reroutes through Sydney overflow.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics'],
  },
  {
    id: 'scn_sa_whyalla_rail_derail',
    label: 'Whyalla Export Rail Derailment',
    description: 'Spencer Gulf steel coil shuttle offline for recovery.',
    targetRegions: ['SA'],
    networkKind: 'trade',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_vic_geelong_drayage_peak',
    label: 'Geelong Drayage Peak Congestion',
    description: 'Melbourne port diversion saturates Geelong feed motorway.',
    targetRegions: ['VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'port'],
  },
];


// --- source: catalog/scenarios-round7.ts ---

export const TRANSPORT_SCENARIOS_ROUND7: TransportStressScenario[] = [
  {
    id: 'scn_wa_hedland_cyclone_hold',
    label: 'Port Hedland Cyclone Hold',
    description: 'Tropical cyclone closes bulk loaders and Karratha haul road.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.31,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'road', 'rail'],
  },
  {
    id: 'scn_nt_darwin_port_congestion',
    label: 'Darwin Port Congestion Surge',
    description: 'Remote supply surge queues intermodal handoffs at East Arm.',
    targetRegions: ['NT'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_nsw_newcastle_loader_strike',
    label: 'Newcastle Bulk Loader Strike',
    description: 'Coal loader industrial action backs up bulk export ring.',
    targetRegions: ['NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_vic_westgate_dwell_crisis',
    label: 'West Gate Intermodal Dwell Crisis',
    description: 'Melbourne port diversion extends container dwell at Geelong.',
    targetRegions: ['VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'rail'],
  },
  {
    id: 'scn_tas_bass_fresh_delay',
    label: 'Bass Strait Fresh Export Delay',
    description: 'Rough seas delay Devonport ferry slots for chilled produce.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
];


// --- source: catalog/scenarios-round8.ts ---

export const TRANSPORT_SCENARIOS_ROUND8: TransportStressScenario[] = [
  {
    id: 'scn_qld_brisbane_air_cargo_backlog',
    label: 'Brisbane Air Cargo Backlog',
    description: 'Customs surge queues Eagle Farm express freight.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_wa_kwinana_hydrogen_export_hold',
    label: 'Kwinana Hydrogen Export Hold',
    description: 'Ammonia loader maintenance slows hydrogen corridor trains.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_nsw_customs_clearance_surge',
    label: 'NSW Customs Clearance Surge',
    description: 'Western Sydney air-sea transshipment inspection backlog.',
    targetRegions: ['NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_act_canberra_air_freight_grounding',
    label: 'Canberra Air Freight Grounding',
    description: 'Fog and curfew reduce capital express cargo slots.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.19,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics'],
  },
  {
    id: 'scn_sa_perishable_air_slot_shortage',
    label: 'Adelaide Perishable Air Slot Shortage',
    description: 'Heat wave cuts refrigerated air uplift capacity.',
    targetRegions: ['SA'],
    networkKind: 'trade',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
];


// --- source: catalog/scenarios-round9.ts ---

export const TRANSPORT_SCENARIOS_ROUND9: TransportStressScenario[] = [
  {
    id: 'scn_tas_bass_short_sea_delay',
    label: 'Bass Strait Short-Sea Delay',
    description: 'Rough seas cut roro sailings; island supply backlog.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_qld_biosecurity_inspection_hold',
    label: 'Gladstone Biosecurity Inspection Hold',
    description: 'Quarantine surge delays bulk export clearances.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_nsw_autonomous_convoy_fault',
    label: 'NSW Autonomous Convoy Fault',
    description: 'Platooning control outage slows Hume smart-freight lanes.',
    targetRegions: ['NSW', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_wa_coastal_ore_storm',
    label: 'WA Coastal Ore Storm Closure',
    description: 'Cyclone shuts short-sea feeder and coastal road trains.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.29,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'road'],
  },
  {
    id: 'scn_sa_grain_biosecurity_surge',
    label: 'SA Grain Biosecurity Surge',
    description: 'Export phytosanitary checks backlog Adelaide bulk terminals.',
    targetRegions: ['SA'],
    networkKind: 'trade',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
];


// --- source: catalog/scenarios-round10.ts ---

export const TRANSPORT_SCENARIOS_ROUND10: TransportStressScenario[] = [
  {
    id: 'scn_nsw_deep_sea_berth_queue',
    label: 'NSW Deep-Sea Berth Queue',
    description: 'Mega-container vessel bunching delays Port Botany tradelane slots.',
    targetRegions: ['NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_vic_melbourne_tradelane_surge',
    label: 'Melbourne Tradelane Surge',
    description: 'Pacific import peak overwhelms Webb Dock deep-sea feeders.',
    targetRegions: ['VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_qld_permitting_backlog',
    label: 'Queensland Permitting Backlog',
    description: 'Environmental approval delays stall freight corridor upgrades.',
    targetRegions: ['QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.18,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'rail'],
  },
  {
    id: 'scn_nsw_electric_freight_outage',
    label: 'NSW Electric Freight Charging Outage',
    description: 'Grid event idles Hume BEV charging depots.',
    targetRegions: ['NSW', 'ACT'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_wa_fremantle_deep_sea_draft',
    label: 'Fremantle Deep-Sea Draft Restriction',
    description: 'Swell limits max draft on outer harbour mega-ships.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
];


// --- source: catalog/scenarios-round11.ts ---

export const TRANSPORT_SCENARIOS_ROUND11: TransportStressScenario[] = [
  {
    id: 'scn_nt_defence_mobility_surge',
    label: 'NT Defence Mobility Surge',
    description: 'Strategic lift diverts Stuart Highway defence convoys.',
    targetRegions: ['NT', 'QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_nsw_flood_bypass_overload',
    label: 'NSW Flood Bypass Overload',
    description: 'Repeated east-coast floods saturate resilience detours.',
    targetRegions: ['NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.29,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'rail'],
  },
  {
    id: 'scn_vic_digital_freight_outage',
    label: 'Victoria Digital Freight Outage',
    description: 'Telemetry platform fault blinds port–road visibility.',
    targetRegions: ['VIC', 'NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_wa_pilbara_heat_routing',
    label: 'Pilbara Heat Routing Curtailment',
    description: 'Extreme heat triggers mandatory heat-routing slowdowns.',
    targetRegions: ['WA'],
    networkKind: 'freight',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'rail'],
  },
  {
    id: 'scn_act_capital_defence_lift',
    label: 'Capital Region Defence Lift',
    description: 'Canberra strategic air–road lift crowds freight slots.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'mobility',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
];


// --- source: catalog/scenarios-round12.ts ---

export const TRANSPORT_SCENARIOS_ROUND12: TransportStressScenario[] = [
  {
    id: 'scn_wa_lithium_export_surge',
    label: 'WA Lithium Export Surge',
    description: 'Critical-minerals vessel queue at Pilbara export terminals.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.3,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_qld_channel_draft_restriction',
    label: 'Gladstone Channel Draft Restriction',
    description: 'Dredging delay narrows deep-draft export windows.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
  {
    id: 'scn_nt_remote_supply_isolation',
    label: 'NT Remote Supply Isolation',
    description: 'Wet season cuts indigenous community freight corridors.',
    targetRegions: ['NT'],
    networkKind: 'freight',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_sa_spodumene_rail_fault',
    label: 'SA Spodumene Rail Fault',
    description: 'Critical-minerals rail possession slows export feed.',
    targetRegions: ['SA', 'WA'],
    networkKind: 'trade',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_tas_pilotage_delay',
    label: 'Tasmanian Pilotage Delay',
    description: 'Pilot shortage delays Bass Strait channel movements.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.19,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
];


// --- source: catalog/scenarios-round13.ts ---

export const TRANSPORT_SCENARIOS_ROUND13: TransportStressScenario[] = [
  {
    id: 'scn_sa_gauge_break_delay',
    label: 'SA Gauge Break Delay',
    description: 'Break-of-gauge transhipment backlog at Adelaide intermodal.',
    targetRegions: ['SA', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'logistics'],
  },
  {
    id: 'scn_nsw_flood_recovery_surge',
    label: 'NSW Flood Recovery Surge',
    description: 'Disaster recovery staging overwhelms emergency corridors.',
    targetRegions: ['NSW', 'ACT'],
    networkKind: 'freight',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_vic_circular_waste_backlog',
    label: 'Victoria Circular Waste Backlog',
    description: 'Recycling freight loop congestion at Melbourne hubs.',
    targetRegions: ['VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
  {
    id: 'scn_qld_cyclone_recovery_lift',
    label: 'Queensland Cyclone Recovery Lift',
    description: 'Cyclone recovery diverts freight to emergency staging yards.',
    targetRegions: ['QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_nsw_interstate_gauge_fault',
    label: 'NSW Interstate Gauge Fault',
    description: 'Standard-gauge fault cuts Sydney–Melbourne interoperability.',
    targetRegions: ['NSW', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
];


// --- source: catalog/scenarios-round14.ts ---

export const TRANSPORT_SCENARIOS_ROUND14: TransportStressScenario[] = [
  {
    id: 'scn_sa_harvest_export_surge',
    label: 'SA Harvest Export Surge',
    description: 'Record grain harvest overwhelms Adelaide export rail.',
    targetRegions: ['SA', 'VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'port'],
  },
  {
    id: 'scn_nsw_track_possession_blitz',
    label: 'NSW Track Possession Blitz',
    description: 'Maintenance windows cut Sydney freight rail availability.',
    targetRegions: ['NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_qld_green_bunkering_shortage',
    label: 'QLD Green Bunkering Shortage',
    description: 'Ammonia bunkering outage delays export vessel turnarounds.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
  {
    id: 'scn_vic_grain_port_congestion',
    label: 'Victoria Grain Port Congestion',
    description: 'Harvest drayage queues at Geelong grain terminals.',
    targetRegions: ['VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'road'],
  },
  {
    id: 'scn_wa_ammonia_bunker_hold',
    label: 'WA Ammonia Bunker Hold',
    description: 'Green fuel loader fault slows Pilbara export bunkering.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
];


// --- source: catalog/scenarios-round15.ts ---

export const TRANSPORT_SCENARIOS_ROUND15: TransportStressScenario[] = [
  {
    id: 'scn_qld_pacific_feeder_surge',
    label: 'Queensland Pacific Feeder Surge',
    description: 'Island tradelane demand spikes Brisbane feeder berths.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_nsw_medical_supply_emergency',
    label: 'NSW Medical Supply Emergency',
    description: 'Health freight surge strains cold-chain pharma corridors.',
    targetRegions: ['NSW', 'ACT'],
    networkKind: 'freight',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
  {
    id: 'scn_vic_data_centre_build_rush',
    label: 'Victoria Data Centre Build Rush',
    description: 'Hyperscale construction overloads digital infra freight.',
    targetRegions: ['VIC', 'NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'rail'],
  },
  {
    id: 'scn_act_pharma_cold_shortage',
    label: 'Canberra Pharma Cold Shortage',
    description: 'Cold-chain fault delays capital medical supply.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 1,
    affectedCategories: ['logistics'],
  },
  {
    id: 'scn_nt_pacific_relief_lift',
    label: 'NT Pacific Relief Lift',
    description: 'Pacific island relief diverts Darwin feeder capacity.',
    targetRegions: ['NT', 'QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
];


// --- source: catalog/scenarios-round16.ts ---

export const TRANSPORT_SCENARIOS_ROUND16: TransportStressScenario[] = [
  {
    id: 'scn_wa_offshore_wind_install_surge',
    label: 'WA Offshore Wind Install Surge',
    description: 'Turbine install season overloads Geraldton marshalling berths.',
    targetRegions: ['WA', 'SA'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_wa_battery_export_rush',
    label: 'WA Battery Export Rush',
    description: 'Lithium concentrate export peaks Pilbara rail and port slots.',
    targetRegions: ['WA'],
    networkKind: 'freight',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'port'],
  },
  {
    id: 'scn_qld_cruise_turnaround_peak',
    label: 'Queensland Cruise Turnaround Peak',
    description: 'Seasonal cruise turnaround strains Brisbane tourism berths.',
    targetRegions: ['QLD', 'NSW'],
    networkKind: 'mobility',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'road'],
  },
  {
    id: 'scn_vic_ev_battery_feed_stress',
    label: 'Victoria EV Battery Feed Stress',
    description: 'Cell manufacturing surge overloads Geelong battery rail feed.',
    targetRegions: ['VIC', 'NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'logistics'],
  },
  {
    id: 'scn_tas_offshore_staging_delay',
    label: 'Tasmania Offshore Staging Delay',
    description: 'Weather delay backs up Hobart offshore staging inventory.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
];


// --- source: catalog/scenarios-round17.ts ---

export const TRANSPORT_SCENARIOS_ROUND17: TransportStressScenario[] = [
  {
    id: 'scn_wa_subsea_cable_lay_surge',
    label: 'WA Subsea Cable Lay Surge',
    description: 'Cable lay season overloads Perth landing berths and staging yards.',
    targetRegions: ['WA', 'NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_qld_ammonia_export_rush',
    label: 'Queensland Ammonia Export Rush',
    description: 'Green ammonia export peaks Gladstone bulk and rail slots.',
    targetRegions: ['QLD', 'WA'],
    networkKind: 'freight',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_nsw_airport_express_peak',
    label: 'NSW Airport Express Peak',
    description: 'Holiday peak strains Sydney airport rail and road feed.',
    targetRegions: ['NSW', 'VIC'],
    networkKind: 'mobility',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'road'],
  },
  {
    id: 'scn_sa_cable_landing_delay',
    label: 'SA Cable Landing Delay',
    description: 'Weather delay backs up Adelaide telecom landing inventory.',
    targetRegions: ['SA', 'NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.19,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_vic_air_rail_integration_stress',
    label: 'Victoria Air-Rail Integration Stress',
    description: 'Melbourne air-rail transfer surge overloads Tullamarine feed.',
    targetRegions: ['VIC', 'NSW'],
    networkKind: 'mobility',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'logistics'],
  },
];


// --- source: catalog/scenarios-round18.ts ---

export const TRANSPORT_SCENARIOS_ROUND18: TransportStressScenario[] = [
  {
    id: 'scn_wa_lithium_brine_surge',
    label: 'WA Lithium Brine Export Surge',
    description: 'Battery feedstock rush overloads Fremantle bulk and brine yards.',
    targetRegions: ['WA', 'SA'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_nsw_inland_express_peak',
    label: 'NSW Inland Express Peak',
    description: 'Holiday container peak strains Parkes express handoffs.',
    targetRegions: ['NSW', 'QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.24,
    conditionPenaltySteps: 0,
    affectedCategories: ['rail', 'logistics'],
  },
  {
    id: 'scn_nt_launch_window_crunch',
    label: 'NT Launch Window Crunch',
    description: 'Orbital launch window compresses Darwin staging and Arnhem access.',
    targetRegions: ['NT', 'SA'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_sa_brine_rail_possession',
    label: 'SA Brine Rail Possession',
    description: 'Track possession delays Spencer Gulf brine module delivery.',
    targetRegions: ['SA', 'WA'],
    networkKind: 'freight',
    utilizationAdd: 0.18,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_qld_express_port_congestion',
    label: 'Queensland Express Port Congestion',
    description: 'Brisbane express terminal queue backs up inland rail slots.',
    targetRegions: ['QLD', 'NSW'],
    networkKind: 'trade',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
];


// --- source: catalog/scenarios-round19.ts ---

export const TRANSPORT_SCENARIOS_ROUND19: TransportStressScenario[] = [
  {
    id: 'scn_wa_magnet_export_surge',
    label: 'WA Magnet Export Surge',
    description: 'Rare-earth export rush overloads Geraldton bulk and magnet yards.',
    targetRegions: ['WA', 'QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.27,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_tas_reefer_bass_delay',
    label: 'Tasman Reefer Bass Delay',
    description: 'Bass Strait weather delays Devonport reefer sailings.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.23,
    conditionPenaltySteps: 1,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_sa_zet_charging_peak',
    label: 'SA ZET Charging Peak',
    description: 'Holiday peak strains Sturt zero-emission charging hubs.',
    targetRegions: ['SA', 'NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_qld_magnet_rail_possession',
    label: 'Queensland Magnet Rail Possession',
    description: 'Track possession cuts Townsville magnet feed capacity.',
    targetRegions: ['QLD', 'WA'],
    networkKind: 'freight',
    utilizationAdd: 0.19,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_vic_reefer_cold_chain_stress',
    label: 'Victoria Reefer Cold-Chain Stress',
    description: 'Heatwave strains Melbourne reefer pre-cool capacity.',
    targetRegions: ['VIC', 'TAS'],
    networkKind: 'freight',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'road'],
  },
];


// --- source: catalog/scenarios-catalog.ts ---

/** Scale-wave scenario library — measurable utilization + condition penalties. */
export const TRANSPORT_STRESS_SCENARIOS: TransportStressScenario[] = [
  {
    id: 'scn_nsw_flood_m1',
    label: 'NSW M1 Flood Closure',
    description: 'Heavy rain closes Pacific Motorway segments; freight detours.',
    targetRegions: ['NSW'],
    networkKind: 'freight',
    utilizationAdd: 0.22,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_vic_port_strike',
    label: 'Melbourne Port Industrial Action',
    description: 'Stevedoring strike reduces container throughput.',
    targetRegions: ['VIC'],
    networkKind: 'trade',
    utilizationAdd: 0.35,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'logistics'],
  },
  {
    id: 'scn_qld_cyclone_coast',
    label: 'Queensland Coastal Cyclone',
    description: 'Brisbane port and Bruce Highway disruption.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.28,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'port'],
  },
  {
    id: 'scn_wa_pilbara_heat',
    label: 'Pilbara Extreme Heat Slow Orders',
    description: 'Rail and road speed restrictions on iron-ore corridors.',
    targetRegions: ['WA'],
    networkKind: 'freight',
    utilizationAdd: 0.18,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail', 'road'],
  },
  {
    id: 'scn_sa_rail_maintenance',
    label: 'Adelaide Rail Track Maintenance Blitz',
    description: 'Freight corridor possession windows.',
    targetRegions: ['SA'],
    networkKind: 'freight',
    utilizationAdd: 0.15,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_nt_wet_season',
    label: 'Top End Wet Season Isolation',
    description: 'Stuart Highway flooding and Darwin port delays.',
    targetRegions: ['NT'],
    networkKind: 'freight',
    utilizationAdd: 0.25,
    conditionPenaltySteps: 1,
    affectedCategories: ['road', 'port'],
  },
  {
    id: 'scn_tas_bass_ferry',
    label: 'Bass Strait Ferry Capacity Cut',
    description: 'Reduced sailings constrain island logistics.',
    targetRegions: ['TAS', 'VIC'],
    networkKind: 'freight',
    utilizationAdd: 0.2,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_act_bushfire_smoke',
    label: 'Capital Region Bushfire Smoke',
    description: 'Hume/Barton highway visibility restrictions.',
    targetRegions: ['ACT', 'NSW'],
    networkKind: 'mobility',
    utilizationAdd: 0.12,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_national_fuel_spike',
    label: 'National Diesel Price Spike',
    description: 'Road freight cost pressure without physical damage.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'],
    networkKind: 'freight',
    utilizationAdd: 0.1,
    conditionPenaltySteps: 0,
    affectedCategories: ['road', 'logistics'],
  },
  {
    id: 'scn_east_coast_labour',
    label: 'East Coast Logistics Labour Shortage',
    description: 'Warehouse and port staffing gaps.',
    targetRegions: ['NSW', 'VIC', 'QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.16,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics', 'port'],
  },
  {
    id: 'scn_wa_iron_ore_surge',
    label: 'Iron Ore Export Surge',
    description: 'Demand spike without new capacity — congestion.',
    targetRegions: ['WA'],
    networkKind: 'trade',
    utilizationAdd: 0.32,
    conditionPenaltySteps: 0,
    affectedCategories: ['port', 'rail'],
  },
  {
    id: 'scn_nsw_interstate_rail_fault',
    label: 'NSW Interstate Rail Signal Fault',
    description: 'Sydney–Brisbane path capacity cut.',
    targetRegions: ['NSW', 'QLD'],
    networkKind: 'freight',
    utilizationAdd: 0.21,
    conditionPenaltySteps: 1,
    affectedCategories: ['rail'],
  },
  {
    id: 'scn_vic_regional_flood',
    label: 'Gippsland Regional Flood',
    description: 'Monash feed and regional road damage.',
    targetRegions: ['VIC'],
    networkKind: 'mobility',
    utilizationAdd: 0.14,
    conditionPenaltySteps: 1,
    affectedCategories: ['road'],
  },
  {
    id: 'scn_qld_coal_export_queue',
    label: 'Queensland Coal Export Queue',
    description: 'Bulk vessel queue at Hay Point / Gladstone pressure.',
    targetRegions: ['QLD'],
    networkKind: 'trade',
    utilizationAdd: 0.26,
    conditionPenaltySteps: 0,
    affectedCategories: ['port'],
  },
  {
    id: 'scn_sa_desal_power',
    label: 'SA Grid Event — Logistics Cold Chain Risk',
    description: 'Power volatility hits refrigerated logistics.',
    targetRegions: ['SA'],
    networkKind: 'freight',
    utilizationAdd: 0.11,
    conditionPenaltySteps: 0,
    affectedCategories: ['logistics'],
  },
  {
    id: 'scn_deferred_maintenance_wave',
    label: 'Deferred Maintenance Wave',
    description: 'Nationwide backlog catch-up — slower effective conditions.',
    targetRegions: ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'],
    utilizationAdd: 0.08,
    conditionPenaltySteps: 1,
  },
  ...TRANSPORT_SCENARIOS_ROUND2,
  ...TRANSPORT_SCENARIOS_ROUND3,
  ...TRANSPORT_SCENARIOS_ROUND4,
  ...TRANSPORT_SCENARIOS_ROUND5,
  ...TRANSPORT_SCENARIOS_ROUND6,
  ...TRANSPORT_SCENARIOS_ROUND7,
  ...TRANSPORT_SCENARIOS_ROUND8,
  ...TRANSPORT_SCENARIOS_ROUND9,
  ...TRANSPORT_SCENARIOS_ROUND10,
  ...TRANSPORT_SCENARIOS_ROUND11,
  ...TRANSPORT_SCENARIOS_ROUND12,
  ...TRANSPORT_SCENARIOS_ROUND13,
  ...TRANSPORT_SCENARIOS_ROUND14,
  ...TRANSPORT_SCENARIOS_ROUND15,
  ...TRANSPORT_SCENARIOS_ROUND16,
  ...TRANSPORT_SCENARIOS_ROUND17,
  ...TRANSPORT_SCENARIOS_ROUND18,
  ...TRANSPORT_SCENARIOS_ROUND19,
];

export function getScenarioById(id: string): TransportStressScenario | undefined {
  return TRANSPORT_STRESS_SCENARIOS.find((s) => s.id === id);
}

export function scenariosForRegion(regionId: string): TransportStressScenario[] {
  return TRANSPORT_STRESS_SCENARIOS.filter((s) => s.targetRegions.includes(regionId as never));
}


// --- source: climate/climate-transport-modifiers.ts ---
export type ClimateTransportBand = 'mild' | 'warm' | 'hot' | 'extreme';

export const CLIMATE_BAND_UTILIZATION: Record<ClimateTransportBand, number> = {
  mild: 0,
  warm: 0.04,
  hot: 0.1,
  extreme: 0.18,
};

export const CLIMATE_BAND_CONDITION_PENALTY: Record<ClimateTransportBand, number> = {
  mild: 0,
  warm: 0,
  hot: 1,
  extreme: 1,
};

export function climateModifierFactor(band: ClimateTransportBand): number {
  return 1 - CLIMATE_BAND_UTILIZATION[band] * 0.15;
}

export function isClimateTransportBand(value: string): value is ClimateTransportBand {
  return value === 'mild' || value === 'warm' || value === 'hot' || value === 'extreme';
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
    tags: ['urban_freight', 'motorway', 'port_access'],
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
    tags: ['national_highway', 'freight'],
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


// --- source: catalog/scale-wave-assets.ts ---

/** Scale wave — additional regional depth (wave 2). */
export const SCALE_WAVE_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_nsw_golden',
    category: 'road',
    name: 'Golden Highway',
    description: 'Hunter Valley coal and wine freight link.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['freight', 'mining'],
    laneKilometres: 390,
    designSpeedKmh: 100,
    freightShare: 0.46,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_vic_western_hwy',
    category: 'road',
    name: 'Western Highway (VIC)',
    description: 'Melbourne–Adelaide road corridor.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'SA'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['east_west', 'freight'],
    laneKilometres: 440,
    designSpeedKmh: 110,
    freightShare: 0.4,
    urbanShare: 0.2,
    tollRoad: false,
  },
  {
    id: 'road_qld_cunningham',
    category: 'road',
    name: 'Cunningham Highway',
    description: 'Ipswich–Warwick inland QLD freight.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['freight'],
    tags: ['freight', 'inland_rail'],
    laneKilometres: 150,
    designSpeedKmh: 100,
    freightShare: 0.42,
    urbanShare: 0.15,
    tollRoad: false,
  },
  {
    id: 'road_wa_great_eastern',
    category: 'road',
    name: 'Great Eastern Highway',
    description: 'Perth–Kalgoorlie gold and grain corridor.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4,
    strategicNetworks: ['freight'],
    tags: ['mining', 'freight'],
    laneKilometres: 590,
    designSpeedKmh: 110,
    freightShare: 0.48,
    urbanShare: 0.1,
    tollRoad: false,
  },
  {
    id: 'road_sa_dukes',
    category: 'road',
    name: 'Dukes Highway',
    description: 'Adelaide–Melbourne primary road freight.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['east_west', 'freight'],
    laneKilometres: 290,
    designSpeedKmh: 110,
    freightShare: 0.43,
    urbanShare: 0.12,
    tollRoad: false,
  },
];

export const SCALE_WAVE_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_hunter_valley',
    category: 'rail',
    name: 'Hunter Valley Coal Rail',
    description: 'Coal export feed to Newcastle.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 6.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['freight_rail', 'mining'],
    trackKilometres: 420,
    dualTrackShare: 0.5,
    electrifiedShare: 0.35,
    designFreightTonnesPerYear: 95_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_qld_coastal',
    category: 'rail',
    name: 'Queensland Coastal Rail',
    description: 'Brisbane–Rockhampton general freight.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['freight'],
    tags: ['freight_rail', 'inland_rail'],
    trackKilometres: 680,
    dualTrackShare: 0.3,
    electrifiedShare: 0.1,
    designFreightTonnesPerYear: 8_000_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_geelong_line',
    category: 'rail',
    name: 'Geelong–Melbourne Freight Line',
    description: 'Port of Geelong and grain export feed.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['port_rail', 'grain'],
    trackKilometres: 80,
    dualTrackShare: 0.35,
    electrifiedShare: 0.5,
    designFreightTonnesPerYear: 3_200_000,
    passengerCapable: true,
  },
];

export const SCALE_WAVE_PORTS: PortAsset[] = [
  {
    id: 'port_nsw_newcastle',
    category: 'port',
    name: 'Port of Newcastle',
    description: 'World-scale coal export.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 9.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'mining'],
    berthCount: 22,
    maxDraftMetres: 15.2,
    teuCapacityPerYear: 280_000,
    automationLevel: 2,
    bulkShare: 0.88,
  },
  {
    id: 'port_qld_gladstone',
    category: 'port',
    name: 'Port of Gladstone',
    description: 'Coal, LNG, and alumina exports.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 8.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'multimodal'],
    berthCount: 26,
    maxDraftMetres: 14,
    teuCapacityPerYear: 210_000,
    automationLevel: 1,
    bulkShare: 0.75,
  },
  {
    id: 'port_vic_geelong',
    category: 'port',
    name: 'Port of Geelong',
    description: 'Grain and breakbulk exports.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 5.4,
    strategicNetworks: ['trade'],
    tags: ['grain', 'container'],
    berthCount: 14,
    maxDraftMetres: 12.5,
    teuCapacityPerYear: 240_000,
    automationLevel: 1,
    bulkShare: 0.52,
  },
];

export const SCALE_WAVE_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_nsw_hunter_imc',
    category: 'logistics',
    name: 'Hunter Intermodal Terminal',
    description: 'Coal and container staging for Newcastle.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 3.7,
    strategicNetworks: ['freight', 'trade'],
    tags: ['intermodal', 'mining'],
    warehouseSqm: 160_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 55,
  },
  {
    id: 'log_qld_yatala',
    category: 'logistics',
    name: 'Yatala Enterprise Area',
    description: 'Brisbane south logistics and manufacturing.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 3.5,
    strategicNetworks: ['freight'],
    tags: ['warehouse', 'manufacturing'],
    warehouseSqm: 340_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 62,
  },
  {
    id: 'log_wa_kwinana',
    category: 'logistics',
    name: 'Kwinana Bulk Logistics',
    description: 'Fremantle outer harbour bulk staging.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'port'],
    warehouseSqm: 190_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'port', 'rail'],
    lastMileCoveragePct: 50,
  },
  {
    id: 'log_vic_somerton',
    category: 'logistics',
    name: 'Somerton Logistics Precinct',
    description: 'Northern Melbourne national distribution.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW', 'SA'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['freight', 'trade'],
    tags: ['intermodal', 'warehouse'],
    warehouseSqm: 410_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 70,
  },
];

export const SCALE_WAVE_ASSETS = [
  ...SCALE_WAVE_ROADS,
  ...SCALE_WAVE_RAIL,
  ...SCALE_WAVE_PORTS,
  ...SCALE_WAVE_LOGISTICS,
];


// --- source: catalog/scale-wave-round2-assets.ts ---

export const ROUND2_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_nsw_pacific_hwy_coast',
    category: 'road',
    name: 'Pacific Highway (North Coast NSW)',
    description: 'Coffs–Grafton coastal freight and tourism.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 3.2,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['national_highway', 'freight'],
    laneKilometres: 620,
    designSpeedKmh: 100,
    freightShare: 0.33,
    urbanShare: 0.12,
    tollRoad: false,
  },
  {
    id: 'road_act_monaro',
    category: 'road',
    name: 'Monaro Highway',
    description: 'Canberra–Snowy logistics feed.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 2.5,
    strategicNetworks: ['mobility'],
    tags: ['capital', 'freight'],
    laneKilometres: 120,
    designSpeedKmh: 100,
    freightShare: 0.3,
    urbanShare: 0.2,
    tollRoad: false,
  },
];

export const ROUND2_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_blue_mountains',
    category: 'rail',
    name: 'Blue Mountains Freight Path',
    description: 'Sydney western rail ascent — intercapital constraint.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['freight_rail', 'intercapital'],
    trackKilometres: 160,
    dualTrackShare: 0.62,
    electrifiedShare: 0.45,
    designFreightTonnesPerYear: 6_500_000,
    passengerCapable: true,
  },
  {
    id: 'rail_wa_goldfields',
    category: 'rail',
    name: 'Goldfields Rail Network',
    description: 'Kalgoorlie mineral feed to Esperance and Fremantle.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['freight', 'trade'],
    tags: ['mining', 'freight_rail'],
    trackKilometres: 560,
    dualTrackShare: 0.28,
    electrifiedShare: 0,
    designFreightTonnesPerYear: 12_000_000,
    passengerCapable: false,
  },
];

export const ROUND2_PORTS: PortAsset[] = [
  {
    id: 'port_wa_dampier',
    category: 'port',
    name: 'Port of Dampier',
    description: 'Pilbara salt and gas export.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 7.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'mining'],
    berthCount: 10,
    maxDraftMetres: 16,
    teuCapacityPerYear: 80_000,
    automationLevel: 2,
    bulkShare: 0.85,
  },
  {
    id: 'port_sa_klein_point',
    category: 'port',
    name: 'Klein Point (Port Bonython)',
    description: 'Liquid bulk and grain export support.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['trade'],
    tags: ['bulk', 'grain'],
    berthCount: 6,
    maxDraftMetres: 13,
    teuCapacityPerYear: 60_000,
    automationLevel: 1,
    bulkShare: 0.7,
  },
];

export const ROUND2_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_nsw_enfield',
    category: 'logistics',
    name: 'Enfield Intermodal Terminal',
    description: 'Sydney metropolitan rail–road intermodal.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['freight', 'trade'],
    tags: ['intermodal', 'warehouse', 'air'],
    warehouseSqm: 220_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 66,
  },
  {
    id: 'log_qld_acacia_ridge',
    category: 'logistics',
    name: 'Acacia Ridge Freight Terminal',
    description: 'Brisbane interstate rail terminal.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight'],
    tags: ['intermodal', 'inland_rail', 'air'],
    warehouseSqm: 180_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_nt_east_arm',
    category: 'logistics',
    name: 'East Arm Logistics Precinct',
    description: 'Darwin port-adjacent staging.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'WA'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['gateway', 'remote', 'port'],
    warehouseSqm: 110_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 46,
  },
];

export const SCALE_WAVE_ROUND2_ASSETS = [...ROUND2_ROADS, ...ROUND2_RAIL, ...ROUND2_PORTS, ...ROUND2_LOGISTICS];


// --- source: catalog/scale-wave-round3-assets.ts ---

export const ROUND3_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_vic_great_ocean',
    category: 'road',
    name: 'Great Ocean Road Freight Feed',
    description: 'South-west VIC tourism and timber logistics.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 2.8,
    strategicNetworks: ['mobility', 'freight'],
    tags: ['regional', 'freight'],
    laneKilometres: 240,
    designSpeedKmh: 80,
    freightShare: 0.25,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_qld_flinders',
    category: 'road',
    name: 'Flinders Highway',
    description: 'Townsville–Mt Isa mining supply corridor.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NT'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['freight'],
    tags: ['mining', 'remote', 'freight'],
    laneKilometres: 880,
    designSpeedKmh: 100,
    freightShare: 0.5,
    urbanShare: 0.05,
    tollRoad: false,
  },
  {
    id: 'road_wa_north_west_coastal',
    category: 'road',
    name: 'North West Coastal Highway',
    description: 'Karratha–Port Hedland linkage.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.7,
    strategicNetworks: ['freight', 'trade'],
    tags: ['mining', 'port_access'],
    laneKilometres: 420,
    designSpeedKmh: 110,
    freightShare: 0.52,
    urbanShare: 0.06,
    tollRoad: false,
  },
];

export const ROUND3_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_sydney_freight_ring',
    category: 'rail',
    name: 'Sydney Metropolitan Freight Ring',
    description: 'Port Botany–Enfield–intermodal paths.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 6.4,
    strategicNetworks: ['freight', 'trade'],
    tags: ['port_rail', 'intermodal', 'freight_rail'],
    trackKilometres: 95,
    dualTrackShare: 0.55,
    electrifiedShare: 0.7,
    designFreightTonnesPerYear: 7_500_000,
    passengerCapable: false,
  },
  {
    id: 'rail_qld_coal_export',
    category: 'rail',
    name: 'Central QLD Coal Export Rail',
    description: 'Bowen Basin to Hay Point and Gladstone.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 8.1,
    strategicNetworks: ['freight', 'trade'],
    tags: ['bulk', 'mining', 'freight_rail'],
    trackKilometres: 520,
    dualTrackShare: 0.48,
    electrifiedShare: 0.25,
    designFreightTonnesPerYear: 120_000_000,
    passengerCapable: false,
  },
];

export const ROUND3_PORTS: PortAsset[] = [
  {
    id: 'port_nsw_port_kembla',
    category: 'port',
    name: 'Port Kembla',
    description: 'Steel, coal, and container exports south of Sydney.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 7.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'container'],
    berthCount: 20,
    maxDraftMetres: 14.8,
    teuCapacityPerYear: 520_000,
    automationLevel: 1,
    bulkShare: 0.55,
  },
  {
    id: 'port_tas_devonport',
    category: 'port',
    name: 'Port of Devonport',
    description: 'Bass Strait ro-ro and container gateway.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['island', 'container'],
    berthCount: 8,
    maxDraftMetres: 11.5,
    teuCapacityPerYear: 210_000,
    automationLevel: 0,
    bulkShare: 0.35,
  },
];

export const ROUND3_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_vic_truganina',
    category: 'logistics',
    name: 'Truganina National Distribution',
    description: 'Western Melbourne mega-logistics precinct.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'SA', 'NSW'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['warehouse', 'intermodal'],
    warehouseSqm: 520_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 74,
  },
  {
    id: 'log_wa_forrestfield',
    category: 'logistics',
    name: 'Forrestfield Intermodal Terminal',
    description: 'Perth eastern rail–road terminal.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4,
    strategicNetworks: ['freight'],
    tags: ['intermodal', 'port'],
    warehouseSqm: 150_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 54,
  },
  {
    id: 'log_sa_wingfield',
    category: 'logistics',
    name: 'Wingfield Industrial Logistics',
    description: 'Adelaide north freight consolidation.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'NT'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['freight'],
    tags: ['warehouse', 'intermodal'],
    warehouseSqm: 175_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 57,
  },
];

export const SCALE_WAVE_ROUND3_ASSETS = [
  ...ROUND3_ROADS,
  ...ROUND3_RAIL,
  ...ROUND3_PORTS,
  ...ROUND3_LOGISTICS,
];


// --- source: catalog/scale-wave-round4-assets.ts ---

export const ROUND4_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_qld_cape_york_sealed',
    category: 'road',
    name: 'Cape York Peninsula Sealed Feed',
    description: 'Weipa–Bamaga supply chain for mining and remote communities.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['freight', 'trade'],
    tags: ['remote', 'national_highway', 'mining'],
    laneKilometres: 680,
    designSpeedKmh: 90,
    freightShare: 0.42,
    urbanShare: 0.02,
    tollRoad: false,
  },
  {
    id: 'road_sa_spencer_gulf_haul',
    category: 'road',
    name: 'Spencer Gulf Grain Haul Road',
    description: 'Eyre Peninsula elevator to port road trains.',
    hostRegion: 'SA',
    servedRegions: ['SA'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['freight', 'trade'],
    tags: ['grain', 'bulk', 'regional'],
    laneKilometres: 310,
    designSpeedKmh: 100,
    freightShare: 0.48,
    urbanShare: 0.04,
    tollRoad: false,
  },
  {
    id: 'road_nsw_blue_mountains_grade',
    category: 'road',
    name: 'Blue Mountains Freight Grade',
    description: 'Western Sydney escarpment climb for intercapital freight.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight'],
    tags: ['grade', 'motorway', 'freight'],
    laneKilometres: 42,
    designSpeedKmh: 80,
    freightShare: 0.38,
    urbanShare: 0.12,
    tollRoad: true,
  },
];

export const ROUND4_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_blue_mountains_pass',
    category: 'rail',
    name: 'Blue Mountains Rail Pass',
    description: 'Sydney–Western freight over the Great Dividing Range.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.8,
    strategicNetworks: ['freight'],
    tags: ['freight_rail', 'grade', 'intercapital'],
    trackKilometres: 110,
    dualTrackShare: 0.42,
    electrifiedShare: 0.55,
    designFreightTonnesPerYear: 9_200_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_geelong_melbourne',
    category: 'rail',
    name: 'Geelong–Melbourne Port Rail',
    description: 'Corio Bay container shuttle into Melbourne port precinct.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['port_rail', 'container', 'freight_rail'],
    trackKilometres: 72,
    dualTrackShare: 0.6,
    electrifiedShare: 0.85,
    designFreightTonnesPerYear: 6_800_000,
    passengerCapable: false,
  },
];

export const ROUND4_PORTS: PortAsset[] = [
  {
    id: 'port_sa_spencer_gulf_jetty',
    category: 'port',
    name: 'Klein Point Bulk Terminal',
    description: 'Spencer Gulf grain and gypsum export jetty.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['grain', 'bulk', 'port_access'],
    berthCount: 6,
    maxDraftMetres: 12.5,
    teuCapacityPerYear: 45_000,
    automationLevel: 0,
    bulkShare: 0.82,
  },
  {
    id: 'port_wa_onslow',
    category: 'port',
    name: 'Onslow Marine Supply Base',
    description: 'North West Shelf LNG and offshore logistics hub.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 6.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['lng', 'trade', 'remote'],
    berthCount: 4,
    maxDraftMetres: 10.5,
    teuCapacityPerYear: 120_000,
    automationLevel: 1,
    bulkShare: 0.4,
  },
];

export const ROUND4_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_qld_redbank_national',
    category: 'logistics',
    name: 'Redbank National Distribution',
    description: 'Ipswich rail–road national freight consolidation.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['freight', 'trade'],
    tags: ['warehouse', 'intermodal', 'national_highway'],
    warehouseSqm: 280_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 62,
  },
  {
    id: 'log_nt_pinelands',
    category: 'logistics',
    name: 'Pinelands Remote Supply Hub',
    description: 'Darwin southern gateway for Top End road trains.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD', 'WA'],
    baseProductivityPoints: 3.2,
    strategicNetworks: ['freight'],
    tags: ['remote', 'warehouse', 'intermodal'],
    warehouseSqm: 95_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 48,
  },
  {
    id: 'log_act_hume_distribution',
    category: 'logistics',
    name: 'Hume Capital Distribution',
    description: 'Canberra region bypass freight and retail DC cluster.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 2.9,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['capital', 'warehouse', 'motorway'],
    warehouseSqm: 120_000,
    coldChainCapable: false,
    intermodalLinks: ['road'],
    lastMileCoveragePct: 71,
  },
];

export const SCALE_WAVE_ROUND4_ASSETS = [
  ...ROUND4_ROADS,
  ...ROUND4_RAIL,
  ...ROUND4_PORTS,
  ...ROUND4_LOGISTICS,
];


// --- source: catalog/scale-wave-round5-assets.ts ---

export const ROUND5_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_tas_bass_feed',
    category: 'road',
    name: 'Tamar–Bass Strait Feed Road',
    description: 'Launceston to Burnie export feed for intermodal ferries.',
    hostRegion: 'TAS',
    servedRegions: ['TAS'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bass_strait', 'export', 'regional'],
    laneKilometres: 290,
    designSpeedKmh: 95,
    freightShare: 0.44,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_nt_plenty_highway',
    category: 'road',
    name: 'Plenty Highway Remote Link',
    description: 'Alice Springs to Queensland border remote freight spine.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 3.1,
    strategicNetworks: ['freight'],
    tags: ['remote', 'transcontinental', 'mining'],
    laneKilometres: 520,
    designSpeedKmh: 110,
    freightShare: 0.52,
    urbanShare: 0.01,
    tollRoad: false,
  },
  {
    id: 'road_vic_goulburn_freight',
    category: 'road',
    name: 'Goulburn Valley Hume Freight',
    description: 'Shepparton produce into Melbourne distribution.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight', 'trade'],
    tags: ['produce', 'motorway', 'freight'],
    laneKilometres: 165,
    designSpeedKmh: 100,
    freightShare: 0.41,
    urbanShare: 0.06,
    tollRoad: false,
  },
];

export const ROUND5_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_sa_adelaide_perth_leg',
    category: 'rail',
    name: 'Adelaide–Kalgoorlie Standard Gauge Leg',
    description: 'Trans-Australian east–west freight acceleration segment.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 6.4,
    strategicNetworks: ['freight', 'trade'],
    tags: ['transcontinental', 'freight_rail', 'gauge_standard'],
    trackKilometres: 420,
    dualTrackShare: 0.28,
    electrifiedShare: 0.05,
    designFreightTonnesPerYear: 14_500_000,
    passengerCapable: false,
  },
  {
    id: 'rail_qld_brisbane_port_shuttle',
    category: 'rail',
    name: 'Brisbane Port Rail Shuttle',
    description: 'Acacia Ridge to Fisherman Islands container shuttle.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['trade', 'freight'],
    tags: ['port_rail', 'container', 'freight_rail'],
    trackKilometres: 38,
    dualTrackShare: 0.72,
    electrifiedShare: 0.62,
    designFreightTonnesPerYear: 7_400_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nsw_hunter_valley_coal',
    category: 'rail',
    name: 'Hunter Valley Coal Export Rail',
    description: 'Muswellbrook to Newcastle loader heavy haul.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['coal', 'bulk', 'freight_rail', 'port_access'],
    trackKilometres: 180,
    dualTrackShare: 0.55,
    electrifiedShare: 0.78,
    designFreightTonnesPerYear: 18_000_000,
    passengerCapable: false,
  },
];

export const ROUND5_PORTS: PortAsset[] = [
  {
    id: 'port_tas_burnie_bass',
    category: 'port',
    name: 'Burnie Bass Strait Container Terminal',
    description: 'Tasmania–mainland ferry and container gateway.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bass_strait', 'export', 'port_access'],
    berthCount: 5,
    maxDraftMetres: 11.5,
    teuCapacityPerYear: 210_000,
    automationLevel: 1,
    bulkShare: 0.35,
  },
  {
    id: 'port_nt_darwin_east_arm',
    category: 'port',
    name: 'Darwin East Arm Wharf',
    description: 'Live cattle and Asia-facing container exports.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 5.3,
    strategicNetworks: ['trade', 'freight'],
    tags: ['export', 'port_access', 'remote'],
    berthCount: 7,
    maxDraftMetres: 13,
    teuCapacityPerYear: 380_000,
    automationLevel: 2,
    bulkShare: 0.28,
  },
];

export const ROUND5_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_vic_dandenong_south',
    category: 'logistics',
    name: 'Dandenong South National DC',
    description: 'Southeast Melbourne retail and e-commerce fulfilment.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'TAS'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['warehouse', 'intermodal', 'motorway'],
    warehouseSqm: 320_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 74,
  },
  {
    id: 'log_wa_kenwick_intermodal',
    category: 'logistics',
    name: 'Kenwick Perth Intermodal',
    description: 'Perth eastern freight rail–road consolidation.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4,
    strategicNetworks: ['freight', 'trade'],
    tags: ['warehouse', 'intermodal', 'port_access'],
    warehouseSqm: 240_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 68,
  },
];

export const SCALE_WAVE_ROUND5_ASSETS = [
  ...ROUND5_ROADS,
  ...ROUND5_RAIL,
  ...ROUND5_PORTS,
  ...ROUND5_LOGISTICS,
];


// --- source: catalog/scale-wave-round6-assets.ts ---

export const ROUND6_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_act_barton_freight',
    category: 'road',
    name: 'Canberra Barton Freight Ring',
    description: 'Capital region distribution bypass for interstate B-double feed.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.2,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['capital', 'motorway', 'freight'],
    laneKilometres: 42,
    designSpeedKmh: 90,
    freightShare: 0.38,
    urbanShare: 0.22,
    tollRoad: false,
  },
  {
    id: 'road_nsw_illawarra_export',
    category: 'road',
    name: 'Illawarra Steel Export Highway',
    description: 'Port Kembla blast furnace and coal loader road feed.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['steel', 'port_access', 'bulk'],
    laneKilometres: 88,
    designSpeedKmh: 100,
    freightShare: 0.48,
    urbanShare: 0.12,
    tollRoad: false,
  },
  {
    id: 'road_qld_cairns_supply',
    category: 'road',
    name: 'Cairns Tropical Supply Highway',
    description: 'Tableland produce and reef tourism freight to Cairns port.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.5,
    strategicNetworks: ['trade', 'freight'],
    tags: ['export', 'port_access', 'produce'],
    laneKilometres: 120,
    designSpeedKmh: 95,
    freightShare: 0.36,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_vic_geelong_port_feed',
    category: 'road',
    name: 'Geelong Port Feed Motorway',
    description: 'Melbourne–Geelong container drayage and grain export.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['trade', 'freight'],
    tags: ['container', 'port_access', 'motorway'],
    laneKilometres: 72,
    designSpeedKmh: 110,
    freightShare: 0.44,
    urbanShare: 0.18,
    tollRoad: true,
  },
];

export const ROUND6_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_sa_whyalla_steel',
    category: 'rail',
    name: 'Whyalla Steel Export Rail',
    description: 'Onesteel and bulk export to Spencer Gulf.',
    hostRegion: 'SA',
    servedRegions: ['SA'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['steel', 'bulk', 'freight_rail', 'port_access'],
    trackKilometres: 96,
    dualTrackShare: 0.48,
    electrifiedShare: 0.42,
    designFreightTonnesPerYear: 9_800_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nsw_illawarra_coastal',
    category: 'rail',
    name: 'Illawarra Coastal Freight Rail',
    description: 'Steel coil and coal shuttle to Port Kembla.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['steel', 'coal', 'freight_rail', 'port_access'],
    trackKilometres: 64,
    dualTrackShare: 0.62,
    electrifiedShare: 0.88,
    designFreightTonnesPerYear: 11_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_qld_cairns_intermodal',
    category: 'rail',
    name: 'Cairns Intermodal Feed',
    description: 'Atherton Tableland containers into Cairns terminal.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['intermodal', 'container', 'freight_rail'],
    trackKilometres: 52,
    dualTrackShare: 0.35,
    electrifiedShare: 0.12,
    designFreightTonnesPerYear: 3_600_000,
    passengerCapable: true,
  },
];

export const ROUND6_PORTS: PortAsset[] = [
  {
    id: 'port_qld_cairns_marlin',
    category: 'port',
    name: 'Cairns Marlin Wharf',
    description: 'Reef tourism supplies and tropical export containers.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['export', 'container', 'port_access'],
    berthCount: 6,
    maxDraftMetres: 12,
    teuCapacityPerYear: 290_000,
    automationLevel: 1,
    bulkShare: 0.38,
  },
  {
    id: 'port_sa_port_lincoln',
    category: 'port',
    name: 'Port Lincoln Grain and Seafood',
    description: 'Eyre Peninsula grain export and tuna cold chain gateway.',
    hostRegion: 'SA',
    servedRegions: ['SA'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['grain', 'export', 'port_access'],
    berthCount: 8,
    maxDraftMetres: 12.5,
    teuCapacityPerYear: 180_000,
    automationLevel: 1,
    bulkShare: 0.62,
  },
];

export const ROUND6_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_act_hume_cold_dc',
    category: 'logistics',
    name: 'Hume Capital Cold Chain DC',
    description: 'Canberra region chilled grocery and pharma distribution.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['warehouse', 'capital', 'intermodal'],
    warehouseSqm: 185_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 71,
  },
  {
    id: 'log_sa_whyalla_cold_store',
    category: 'logistics',
    name: 'Whyalla Cold Store Hub',
    description: 'Spencer Gulf seafood and steel coil staging.',
    hostRegion: 'SA',
    servedRegions: ['SA'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['warehouse', 'steel', 'port_access'],
    warehouseSqm: 120_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_qld_cairns_reef_supply',
    category: 'logistics',
    name: 'Cairns Reef Supply Consolidation',
    description: 'Tourism and tropical produce cold chain to Marlin Wharf.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['warehouse', 'export', 'intermodal'],
    warehouseSqm: 95_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 62,
  },
];

export const SCALE_WAVE_ROUND6_ASSETS = [
  ...ROUND6_ROADS,
  ...ROUND6_RAIL,
  ...ROUND6_PORTS,
  ...ROUND6_LOGISTICS,
];


// --- source: catalog/scale-wave-round7-assets.ts ---

export const ROUND7_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_wa_karratha_bulk',
    category: 'road',
    name: 'Karratha Bulk Haul Road',
    description: 'Pilbara mine-to-port iron ore and lithium concentrate feed.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['mining', 'bulk', 'port_access'],
    laneKilometres: 210,
    designSpeedKmh: 90,
    freightShare: 0.52,
    urbanShare: 0.04,
    tollRoad: false,
  },
  {
    id: 'road_nt_barkly_supply',
    category: 'road',
    name: 'Barkly Tablelands Supply Route',
    description: 'Remote cattle and mining supply spine toward Darwin gateway.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 3.1,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['remote', 'bulk', 'national_highway'],
    laneKilometres: 640,
    designSpeedKmh: 110,
    freightShare: 0.41,
    urbanShare: 0.02,
    tollRoad: false,
  },
  {
    id: 'road_tas_devonport_feed',
    category: 'road',
    name: 'Devonport Fresh Export Feed',
    description: 'North-west coast produce and dairy to Bass Strait ferry terminal.',
    hostRegion: 'TAS',
    servedRegions: ['TAS'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['regional', 'island', 'export'],
    laneKilometres: 95,
    designSpeedKmh: 100,
    freightShare: 0.33,
    urbanShare: 0.11,
    tollRoad: false,
  },
  {
    id: 'road_nsw_newcastle_bulk_ring',
    category: 'road',
    name: 'Newcastle Bulk Export Ring',
    description: 'Hunter coal and grain loader drayage bypass.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'port_access', 'motorway'],
    laneKilometres: 58,
    designSpeedKmh: 100,
    freightShare: 0.46,
    urbanShare: 0.19,
    tollRoad: true,
  },
];

export const ROUND7_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_wa_pilbara_heavy_haul',
    category: 'rail',
    name: 'Pilbara Heavy Haul Mainline',
    description: 'Automated iron ore and lithium concentrate unit trains.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 7.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['mining', 'heavy_haul', 'bulk', 'port_access'],
    trackKilometres: 420,
    dualTrackShare: 0.72,
    electrifiedShare: 0.15,
    designFreightTonnesPerYear: 280_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nt_ghan_freight_feed',
    category: 'rail',
    name: 'Ghan Freight Feed Extension',
    description: 'Alice Springs to Darwin intermodal bulk and container feed.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'SA'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['freight', 'trade'],
    tags: ['remote', 'freight_rail', 'intercapital'],
    trackKilometres: 1_420,
    dualTrackShare: 0.08,
    electrifiedShare: 0,
    designFreightTonnesPerYear: 3_200_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_geelong_intermodal',
    category: 'rail',
    name: 'Geelong Port Intermodal Shuttle',
    description: 'Melbourne overflow container shuttle to Geelong wharf.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 5.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['container', 'intermodal', 'port_access'],
    trackKilometres: 72,
    dualTrackShare: 0.55,
    electrifiedShare: 0.62,
    designFreightTonnesPerYear: 6_500_000,
    passengerCapable: false,
  },
];

export const ROUND7_PORTS: PortAsset[] = [
  {
    id: 'port_wa_port_hedland_bulk',
    category: 'port',
    name: 'Port Hedland Bulk Export Terminal',
    description: 'World-scale iron ore and lithium bulk loading.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 8.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['mining', 'bulk', 'port_access'],
    berthCount: 14,
    maxDraftMetres: 18.5,
    teuCapacityPerYear: 420_000,
    automationLevel: 2,
    bulkShare: 0.88,
  },
  {
    id: 'port_tas_devonport_fresh',
    category: 'port',
    name: 'Devonport Fresh Export Wharf',
    description: 'Bass Strait ferry and chilled produce export berths.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['export', 'regional', 'island'],
    berthCount: 5,
    maxDraftMetres: 11,
    teuCapacityPerYear: 140_000,
    automationLevel: 1,
    bulkShare: 0.42,
  },
];

export const ROUND7_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_wa_karratha_bulk_staging',
    category: 'logistics',
    name: 'Karratha Bulk Staging Yard',
    description: 'Mine concentrate and reagent staging for Hedland loaders.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['mining', 'warehouse', 'intermodal'],
    warehouseSqm: 210_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 48,
  },
  {
    id: 'log_nt_darwin_intermodal',
    category: 'logistics',
    name: 'Darwin Gateway Intermodal Hub',
    description: 'Northern gateway container and remote supply consolidation.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['trade', 'freight'],
    tags: ['remote', 'gateway', 'intermodal'],
    warehouseSqm: 165_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 54,
  },
  {
    id: 'log_nsw_newcastle_bulk_dc',
    category: 'logistics',
    name: 'Newcastle Bulk Export DC',
    description: 'Coal and grain staging with automated loader feed.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['trade', 'freight'],
    tags: ['bulk', 'warehouse', 'port_access'],
    warehouseSqm: 140_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 61,
  },
  {
    id: 'log_vic_westgate_congestion_relief',
    category: 'logistics',
    name: 'West Gate Congestion Relief DC',
    description: 'Melbourne port drayage bypass and urban freight consolidation.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['container', 'warehouse', 'intermodal'],
    warehouseSqm: 175_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 78,
  },
];

export const SCALE_WAVE_ROUND7_ASSETS = [
  ...ROUND7_ROADS,
  ...ROUND7_RAIL,
  ...ROUND7_PORTS,
  ...ROUND7_LOGISTICS,
];


// --- source: catalog/scale-wave-round8-assets.ts ---

export const ROUND8_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_qld_brisbane_airport_feed',
    category: 'road',
    name: 'Brisbane Airport Cargo Feed',
    description: 'Motorway drayage from Eagle Farm air cargo precinct.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'motorway', 'port_access'],
    laneKilometres: 42,
    designSpeedKmh: 100,
    freightShare: 0.38,
    urbanShare: 0.22,
    tollRoad: true,
  },
  {
    id: 'road_wa_kwinana_hydrogen_feed',
    category: 'road',
    name: 'Kwinana Hydrogen Export Feed',
    description: 'Bulk ammonia and green H₂ feed to outer harbour loaders.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['hydrogen', 'bulk', 'port_access', 'energy_export'],
    laneKilometres: 36,
    designSpeedKmh: 90,
    freightShare: 0.51,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_nsw_western_sydney_air_cargo',
    category: 'road',
    name: 'Western Sydney Air Cargo Link',
    description: 'Badgerys Creek air freight precinct to Port Botany overflow.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'motorway', 'intermodal'],
    laneKilometres: 54,
    designSpeedKmh: 110,
    freightShare: 0.44,
    urbanShare: 0.18,
    tollRoad: true,
  },
  {
    id: 'road_sa_adelaide_airfreight_link',
    category: 'road',
    name: 'Adelaide Airfreight Link',
    description: 'Perishable and pharma feed to Adelaide airport cargo apron.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'freight', 'national_highway'],
    laneKilometres: 28,
    designSpeedKmh: 100,
    freightShare: 0.36,
    urbanShare: 0.14,
    tollRoad: false,
  },
];

export const ROUND8_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_wa_kwinana_hydrogen_corridor',
    category: 'rail',
    name: 'Kwinana Hydrogen Export Corridor',
    description: 'Dedicated ammonia unit trains to outer harbour bulk loaders.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 6.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['hydrogen', 'bulk', 'heavy_haul', 'energy_export', 'port_access'],
    trackKilometres: 48,
    dualTrackShare: 0.68,
    electrifiedShare: 0.42,
    designFreightTonnesPerYear: 18_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nsw_western_sydney_air_rail',
    category: 'rail',
    name: 'Western Sydney Air-Rail Shuttle',
    description: 'Container and express air cargo shuttle to intermodal yard.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'intermodal', 'freight_rail', 'container'],
    trackKilometres: 38,
    dualTrackShare: 0.62,
    electrifiedShare: 0.78,
    designFreightTonnesPerYear: 4_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_qld_brisbane_air_rail',
    category: 'rail',
    name: 'Brisbane Air-Rail Feed',
    description: 'Eagle Farm air cargo precinct to Fisherman Islands port rail.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 5.0,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'container', 'port_access', 'intermodal'],
    trackKilometres: 52,
    dualTrackShare: 0.58,
    electrifiedShare: 0.55,
    designFreightTonnesPerYear: 5_800_000,
    passengerCapable: true,
  },
];

export const ROUND8_PORTS: PortAsset[] = [
  {
    id: 'port_wa_kwinana_hydrogen_export',
    category: 'port',
    name: 'Kwinana Hydrogen Export Terminal',
    description: 'Green ammonia and bulk energy export berths.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 7.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['hydrogen', 'bulk', 'energy_export', 'port_access'],
    berthCount: 6,
    maxDraftMetres: 16.5,
    teuCapacityPerYear: 280_000,
    automationLevel: 2,
    bulkShare: 0.76,
  },
  {
    id: 'port_qld_brisbane_air_cargo',
    category: 'port',
    name: 'Brisbane Air Cargo Gateway',
    description: 'Eagle Farm express cargo and perishable gateway berths.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'gateway', 'container', 'export'],
    berthCount: 4,
    maxDraftMetres: 12.5,
    teuCapacityPerYear: 210_000,
    automationLevel: 2,
    bulkShare: 0.28,
  },
];

export const ROUND8_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_act_canberra_air_freight_dc',
    category: 'logistics',
    name: 'Canberra Air Freight DC',
    description: 'Capital region express and diplomatic cargo consolidation.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'air', 'cargo_terminal', 'capital'],
    warehouseSqm: 92_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'air'],
    lastMileCoveragePct: 72,
  },
  {
    id: 'log_qld_brisbane_customs_bond',
    category: 'logistics',
    name: 'Brisbane Customs Bond Hub',
    description: 'Digitized customs bond and air-sea transshipment staging.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['gateway', 'customs', 'intermodal', 'cargo_terminal'],
    warehouseSqm: 155_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port', 'air'],
    lastMileCoveragePct: 66,
  },
  {
    id: 'log_wa_kwinana_hydrogen_staging',
    category: 'logistics',
    name: 'Kwinana Hydrogen Staging Yard',
    description: 'Ammonia buffer tanks and export loader feed staging.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['hydrogen', 'warehouse', 'bulk', 'energy_export'],
    warehouseSqm: 118_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 52,
  },
  {
    id: 'log_nsw_sydney_intl_cargo',
    category: 'logistics',
    name: 'Sydney International Cargo Hub',
    description: 'Mascot and Western Sydney air cargo customs gateway.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['air_freight', 'cargo_terminal', 'gateway', 'customs'],
    warehouseSqm: 188_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port', 'air'],
    lastMileCoveragePct: 74,
  },
];

export const SCALE_WAVE_ROUND8_ASSETS = [
  ...ROUND8_ROADS,
  ...ROUND8_RAIL,
  ...ROUND8_PORTS,
  ...ROUND8_LOGISTICS,
];


// --- source: catalog/scale-wave-round9-assets.ts ---

export const ROUND9_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_tas_bass_feeder',
    category: 'road',
    name: 'Tasmanian Bass Feeder Highway',
    description: 'Devonport roro precinct to Launceston distribution.',
    hostRegion: 'TAS',
    servedRegions: ['TAS'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['freight', 'trade'],
    tags: ['coastal_shipping', 'roro', 'island', 'national_highway'],
    laneKilometres: 68,
    designSpeedKmh: 100,
    freightShare: 0.41,
    urbanShare: 0.12,
    tollRoad: false,
  },
  {
    id: 'road_vic_geelong_short_sea',
    category: 'road',
    name: 'Geelong Short-Sea Port Link',
    description: 'Roro and feeder vessel drayage to Melbourne intermodal.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'TAS'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['short_sea', 'roro', 'port_access', 'coastal_shipping'],
    laneKilometres: 46,
    designSpeedKmh: 100,
    freightShare: 0.39,
    urbanShare: 0.16,
    tollRoad: true,
  },
  {
    id: 'road_nsw_hume_autonomous_lane',
    category: 'road',
    name: 'Hume Autonomous Freight Lane',
    description: 'Platooning-enabled smart freight on Hume corridor.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['freight'],
    tags: ['autonomous', 'platoon', 'smart_freight', 'motorway', 'freight'],
    laneKilometres: 112,
    designSpeedKmh: 110,
    freightShare: 0.52,
    urbanShare: 0.08,
    tollRoad: true,
  },
  {
    id: 'road_qld_gladstone_biosecurity_feed',
    category: 'road',
    name: 'Gladstone Biosecurity Feed Road',
    description: 'Bulk export quarantine staging to port inspection gates.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['trade', 'freight'],
    tags: ['biosecurity', 'quarantine', 'bulk', 'port_access'],
    laneKilometres: 34,
    designSpeedKmh: 90,
    freightShare: 0.47,
    urbanShare: 0.06,
    tollRoad: false,
  },
];

export const ROUND9_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_tas_bell_bay_roro',
    category: 'rail',
    name: 'Bell Bay Roro Rail Feed',
    description: 'Short-sea roro cargo shuttle to Burnie and Devonport.',
    hostRegion: 'TAS',
    servedRegions: ['TAS'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['coastal_shipping', 'roro', 'island', 'intermodal'],
    trackKilometres: 58,
    dualTrackShare: 0.42,
    electrifiedShare: 0.18,
    designFreightTonnesPerYear: 2_800_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nsw_smart_freight_inland',
    category: 'rail',
    name: 'NSW Smart Freight Inland Line',
    description: 'Autonomous-ready freight shuttle on Parkes–Sydney axis.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 5.6,
    strategicNetworks: ['freight'],
    tags: ['autonomous', 'smart_freight', 'freight_rail', 'intercapital'],
    trackKilometres: 420,
    dualTrackShare: 0.55,
    electrifiedShare: 0.62,
    designFreightTonnesPerYear: 9_500_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_gippsland_platoon_feed',
    category: 'rail',
    name: 'Gippsland Platoon Feed',
    description: 'Autonomous bulk feed supporting Melbourne–Gippsland freight.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['freight'],
    tags: ['platoon', 'smart_freight', 'freight_rail', 'motorway'],
    trackKilometres: 165,
    dualTrackShare: 0.48,
    electrifiedShare: 0.35,
    designFreightTonnesPerYear: 6_200_000,
    passengerCapable: false,
  },
];

export const ROUND9_PORTS: PortAsset[] = [
  {
    id: 'port_tas_devonport_roro',
    category: 'port',
    name: 'Devonport Roro Terminal',
    description: 'Bass Strait roro and short-sea island supply berths.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['freight', 'trade'],
    tags: ['coastal_shipping', 'roro', 'short_sea', 'island', 'feeder'],
    berthCount: 5,
    maxDraftMetres: 11.5,
    teuCapacityPerYear: 185_000,
    automationLevel: 1,
    bulkShare: 0.22,
  },
  {
    id: 'port_qld_gladstone_biosecurity',
    category: 'port',
    name: 'Gladstone Biosecurity Bulk Terminal',
    description: 'Quarantine and phytosanitary inspection for export bulk.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 6.8,
    strategicNetworks: ['trade'],
    tags: ['biosecurity', 'quarantine', 'bulk', 'export'],
    berthCount: 7,
    maxDraftMetres: 14.2,
    teuCapacityPerYear: 240_000,
    automationLevel: 2,
    bulkShare: 0.68,
  },
];

export const ROUND9_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_tas_bass_strait_dc',
    category: 'logistics',
    name: 'Bass Strait Coastal DC',
    description: 'Island supply consolidation and short-sea staging.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 3.5,
    strategicNetworks: ['freight', 'trade'],
    tags: ['coastal_shipping', 'short_sea', 'roro', 'island'],
    warehouseSqm: 78_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port', 'rail'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_qld_gladstone_quarantine',
    category: 'logistics',
    name: 'Gladstone Quarantine Staging',
    description: 'Biosecurity preclear and bulk export inspection yard.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['trade'],
    tags: ['biosecurity', 'quarantine', 'bulk', 'gateway'],
    warehouseSqm: 132_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 61,
  },
  {
    id: 'log_nsw_hume_smart_freight_hub',
    category: 'logistics',
    name: 'Hume Smart Freight Hub',
    description: 'Autonomous convoy control and platoon staging on Hume.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 4.7,
    strategicNetworks: ['freight'],
    tags: ['autonomous', 'smart_freight', 'platoon', 'intermodal'],
    warehouseSqm: 168_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 69,
  },
  {
    id: 'log_sa_adelaide_biosecurity',
    category: 'logistics',
    name: 'Adelaide Grain Biosecurity Hub',
    description: 'Phytosanitary preclear for grain and bulk export.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['trade'],
    tags: ['biosecurity', 'quarantine', 'grain', 'gateway'],
    warehouseSqm: 98_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 64,
  },
];

export const SCALE_WAVE_ROUND9_ASSETS = [
  ...ROUND9_ROADS,
  ...ROUND9_RAIL,
  ...ROUND9_PORTS,
  ...ROUND9_LOGISTICS,
];


// --- source: catalog/scale-wave-round10-assets.ts ---

export const ROUND10_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_nsw_botany_deep_sea_feed',
    category: 'road',
    name: 'Port Botany Deep-Sea Feed',
    description: 'Mega-container drayage from Botany deep-sea berths.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['deep_sea', 'tradelane', 'mega_container', 'port_access'],
    laneKilometres: 38,
    designSpeedKmh: 90,
    freightShare: 0.49,
    urbanShare: 0.2,
    tollRoad: true,
  },
  {
    id: 'road_vic_webb_dock_tradelane',
    category: 'road',
    name: 'Webb Dock Tradelane Link',
    description: 'Deep-sea container feed to Melbourne intermodal yards.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['deep_sea', 'tradelane', 'container', 'motorway'],
    laneKilometres: 44,
    designSpeedKmh: 100,
    freightShare: 0.46,
    urbanShare: 0.17,
    tollRoad: true,
  },
  {
    id: 'road_nsw_hume_bev_charging',
    category: 'road',
    name: 'Hume BEV Charging Corridor',
    description: 'Electric heavy freight charging stations on Hume Highway.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC', 'ACT'],
    baseProductivityPoints: 5.0,
    strategicNetworks: ['freight'],
    tags: ['electric_freight', 'bev', 'charging', 'motorway', 'freight'],
    laneKilometres: 128,
    designSpeedKmh: 110,
    freightShare: 0.48,
    urbanShare: 0.06,
    tollRoad: true,
  },
  {
    id: 'road_qld_cairns_permitting_feed',
    category: 'road',
    name: 'Cairns Northern Permitting Feed',
    description: 'Northern development corridor planning and approval staging.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NT'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['permitting', 'planning', 'remote', 'national_highway'],
    laneKilometres: 92,
    designSpeedKmh: 100,
    freightShare: 0.33,
    urbanShare: 0.05,
    tollRoad: false,
  },
];

export const ROUND10_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_sydney_tradelane_shuttle',
    category: 'rail',
    name: 'Sydney Tradelane Port Shuttle',
    description: 'Deep-sea container shuttle from Botany to intermodal.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['deep_sea', 'tradelane', 'container', 'port_access'],
    trackKilometres: 52,
    dualTrackShare: 0.64,
    electrifiedShare: 0.72,
    designFreightTonnesPerYear: 7_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_vic_melbourne_electric_haul',
    category: 'rail',
    name: 'Melbourne Electric Haul Line',
    description: 'Electrified freight with BEV-first last-mile handoff.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['freight'],
    tags: ['electric_freight', 'charging', 'freight_rail', 'bev'],
    trackKilometres: 198,
    dualTrackShare: 0.58,
    electrifiedShare: 0.88,
    designFreightTonnesPerYear: 8_400_000,
    passengerCapable: true,
  },
  {
    id: 'rail_qld_brisbane_deep_sea',
    category: 'rail',
    name: 'Brisbane Deep-Sea Port Rail',
    description: 'Pacific tradelane container rail to Fisherman Islands.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 6.1,
    strategicNetworks: ['trade', 'freight'],
    tags: ['deep_sea', 'tradelane', 'gateway', 'container'],
    trackKilometres: 68,
    dualTrackShare: 0.61,
    electrifiedShare: 0.52,
    designFreightTonnesPerYear: 9_100_000,
    passengerCapable: false,
  },
];

export const ROUND10_PORTS: PortAsset[] = [
  {
    id: 'port_nsw_botany_deep_sea',
    category: 'port',
    name: 'Port Botany Deep-Sea Terminal',
    description: 'Mega-container tradelane berths on deep draft channels.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 8.2,
    strategicNetworks: ['trade'],
    tags: ['deep_sea', 'tradelane', 'mega_container', 'gateway', 'container'],
    berthCount: 9,
    maxDraftMetres: 16.8,
    teuCapacityPerYear: 1_450_000,
    automationLevel: 3,
    bulkShare: 0.18,
  },
  {
    id: 'port_wa_fremantle_deep_sea',
    category: 'port',
    name: 'Fremantle Deep-Sea Outer Harbour',
    description: 'Indian Ocean tradelane mega-ship berths.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 7.6,
    strategicNetworks: ['trade'],
    tags: ['deep_sea', 'tradelane', 'mega_container', 'gateway'],
    berthCount: 8,
    maxDraftMetres: 16.2,
    teuCapacityPerYear: 980_000,
    automationLevel: 2,
    bulkShare: 0.24,
  },
];

export const ROUND10_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_nsw_sydney_permitting_hub',
    category: 'logistics',
    name: 'Sydney Infrastructure Permitting Hub',
    description: 'State coordination for freight corridor approvals.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight'],
    tags: ['permitting', 'planning', 'approval_hub', 'gateway'],
    warehouseSqm: 72_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 68,
  },
  {
    id: 'log_vic_melbourne_tradelane_dc',
    category: 'logistics',
    name: 'Melbourne Tradelane DC',
    description: 'Deep-sea import deconsolidation and tradelane staging.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW', 'SA'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade'],
    tags: ['deep_sea', 'tradelane', 'cargo_terminal', 'gateway'],
    warehouseSqm: 210_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 71,
  },
  {
    id: 'log_act_capital_bev_depot',
    category: 'logistics',
    name: 'Canberra BEV Freight Depot',
    description: 'Capital region electric freight charging and staging.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['freight'],
    tags: ['electric_freight', 'bev', 'charging', 'capital'],
    warehouseSqm: 64_000,
    coldChainCapable: false,
    intermodalLinks: ['road'],
    lastMileCoveragePct: 74,
  },
  {
    id: 'log_qld_brisbane_tradelane_bond',
    category: 'logistics',
    name: 'Brisbane Tradelane Bond Hub',
    description: 'Pacific tradelane customs bond and deep-sea staging.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['trade'],
    tags: ['tradelane', 'deep_sea', 'gateway', 'customs'],
    warehouseSqm: 175_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 63,
  },
];

export const SCALE_WAVE_ROUND10_ASSETS = [
  ...ROUND10_ROADS,
  ...ROUND10_RAIL,
  ...ROUND10_PORTS,
  ...ROUND10_LOGISTICS,
];


// --- source: catalog/scale-wave-round11-assets.ts ---

export const ROUND11_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_nt_stuart_defence',
    category: 'road',
    name: 'Stuart Highway Defence Corridor',
    description: 'Strategic mobility feed for northern defence logistics.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD', 'SA'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['freight'],
    tags: ['defence_logistics', 'strategic_mobility', 'military_freight', 'remote'],
    laneKilometres: 680,
    designSpeedKmh: 110,
    freightShare: 0.38,
    urbanShare: 0.04,
    tollRoad: false,
  },
  {
    id: 'road_nsw_hunter_flood_bypass',
    category: 'road',
    name: 'Hunter Flood Bypass Route',
    description: 'Weather-resilience detour for Pacific Highway flood closures.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight'],
    tags: ['weather_resilience', 'flood_bypass', 'national_highway', 'motorway'],
    laneKilometres: 96,
    designSpeedKmh: 100,
    freightShare: 0.41,
    urbanShare: 0.1,
    tollRoad: false,
  },
  {
    id: 'road_vic_geelong_telemetry_freight',
    category: 'road',
    name: 'Geelong Telemetry Freight Lane',
    description: 'Digitized drayage with live cargo visibility.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['digital_freight', 'telemetry', 'visibility', 'motorway'],
    laneKilometres: 52,
    designSpeedKmh: 100,
    freightShare: 0.43,
    urbanShare: 0.14,
    tollRoad: true,
  },
  {
    id: 'road_wa_pilbara_heat_routing',
    category: 'road',
    name: 'Pilbara Heat Routing Highway',
    description: 'Heat-adaptive routing for iron-ore road trains.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 5.3,
    strategicNetworks: ['freight', 'trade'],
    tags: ['weather_resilience', 'heat_routing', 'mining', 'remote', 'strategic_mobility'],
    laneKilometres: 420,
    designSpeedKmh: 90,
    freightShare: 0.55,
    urbanShare: 0.02,
    tollRoad: false,
  },
];

export const ROUND11_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_qld_townsville_defence_feed',
    category: 'rail',
    name: 'Townsville Defence Rail Feed',
    description: 'Military freight shuttle to northern garrison ports.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NT'],
    baseProductivityPoints: 5.1,
    strategicNetworks: ['freight'],
    tags: ['defence_logistics', 'military_freight', 'strategic_mobility'],
    trackKilometres: 320,
    dualTrackShare: 0.52,
    electrifiedShare: 0.38,
    designFreightTonnesPerYear: 5_600_000,
    passengerCapable: true,
  },
  {
    id: 'rail_nsw_blue_mountains_resilience',
    category: 'rail',
    name: 'Blue Mountains Resilience Line',
    description: 'Flood-resilient freight path over Great Dividing Range.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 5.4,
    strategicNetworks: ['freight'],
    tags: ['weather_resilience', 'flood_bypass', 'freight_rail'],
    trackKilometres: 185,
    dualTrackShare: 0.56,
    electrifiedShare: 0.64,
    designFreightTonnesPerYear: 6_800_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_digital_intermodal',
    category: 'rail',
    name: 'Victoria Digital Intermodal Rail',
    description: 'Telemetry-integrated container shuttle with visibility hubs.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['digital_freight', 'visibility', 'telemetry', 'container'],
    trackKilometres: 142,
    dualTrackShare: 0.6,
    electrifiedShare: 0.72,
    designFreightTonnesPerYear: 7_400_000,
    passengerCapable: false,
  },
];

export const ROUND11_PORTS: PortAsset[] = [
  {
    id: 'port_nt_darwin_defence',
    category: 'port',
    name: 'Darwin Defence Logistics Berths',
    description: 'Strategic mobility and northern garrison sealift.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 6.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['defence_logistics', 'strategic_mobility', 'gateway', 'remote'],
    berthCount: 6,
    maxDraftMetres: 13.5,
    teuCapacityPerYear: 320_000,
    automationLevel: 2,
    bulkShare: 0.42,
  },
  {
    id: 'port_wa_hedland_weather',
    category: 'port',
    name: 'Port Hedland Weather-Resilient Terminal',
    description: 'Cyclone-hardened bulk export with flood bypass staging.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 7.0,
    strategicNetworks: ['trade'],
    tags: ['weather_resilience', 'bulk', 'mining', 'export'],
    berthCount: 8,
    maxDraftMetres: 17.5,
    teuCapacityPerYear: 410_000,
    automationLevel: 2,
    bulkShare: 0.82,
  },
];

export const ROUND11_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_nt_darwin_defence_dc',
    category: 'logistics',
    name: 'Darwin Defence Logistics DC',
    description: 'Northern strategic mobility staging and sealift prep.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['freight'],
    tags: ['defence_logistics', 'strategic_mobility', 'military_freight', 'remote'],
    warehouseSqm: 105_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 48,
  },
  {
    id: 'log_nsw_sydney_resilience_hub',
    category: 'logistics',
    name: 'Sydney Weather Resilience Hub',
    description: 'Flood bypass coordination and heat-routing control.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['freight'],
    tags: ['weather_resilience', 'flood_bypass', 'heat_routing', 'digital_freight', 'gateway'],
    warehouseSqm: 118_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 67,
  },
  {
    id: 'log_vic_melbourne_digital_control',
    category: 'logistics',
    name: 'Melbourne Digital Freight Control',
    description: 'National visibility mesh and telemetry integration centre.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW', 'SA'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['trade'],
    tags: ['digital_freight', 'visibility', 'telemetry', 'gateway'],
    warehouseSqm: 192_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 73,
  },
  {
    id: 'log_act_capital_defence_staging',
    category: 'logistics',
    name: 'Canberra Defence Staging Yard',
    description: 'Capital region strategic lift and defence freight staging.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.7,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['defence_logistics', 'strategic_mobility', 'capital', 'military_freight', 'weather_resilience'],
    warehouseSqm: 58_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'air'],
    lastMileCoveragePct: 76,
  },
];

export const SCALE_WAVE_ROUND11_ASSETS = [
  ...ROUND11_ROADS,
  ...ROUND11_RAIL,
  ...ROUND11_PORTS,
  ...ROUND11_LOGISTICS,
];


// --- source: catalog/scale-wave-round12-assets.ts ---

export const ROUND12_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_wa_pilbara_lithium_haul',
    category: 'road',
    name: 'Pilbara Lithium Haul Road',
    description: 'Spodumene concentrate feed to Port Hedland export.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 5.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['critical_minerals', 'lithium', 'battery_feedstock', 'mining', 'bulk'],
    laneKilometres: 380,
    designSpeedKmh: 90,
    freightShare: 0.58,
    urbanShare: 0.02,
    tollRoad: false,
  },
  {
    id: 'road_nt_arnhem_remote_supply',
    category: 'road',
    name: 'Arnhem Remote Supply Highway',
    description: 'Indigenous community freight and essential supply corridor.',
    hostRegion: 'NT',
    servedRegions: ['NT'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['freight'],
    tags: ['indigenous_supply', 'remote_community', 'remote', 'national_highway'],
    laneKilometres: 520,
    designSpeedKmh: 100,
    freightShare: 0.29,
    urbanShare: 0.03,
    tollRoad: false,
  },
  {
    id: 'road_qld_cape_remote_feed',
    category: 'road',
    name: 'Cape York Remote Community Feed',
    description: 'Seasonal remote community supply from Cairns hub.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['freight'],
    tags: ['remote_community', 'remote', 'indigenous_supply'],
    laneKilometres: 410,
    designSpeedKmh: 90,
    freightShare: 0.31,
    urbanShare: 0.04,
    tollRoad: false,
  },
  {
    id: 'road_wa_kimberley_indigenous_feed',
    category: 'road',
    name: 'Kimberley Indigenous Supply Feed',
    description: 'Remote community and indigenous supply link to Broome.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'NT'],
    baseProductivityPoints: 3.5,
    strategicNetworks: ['freight'],
    tags: ['indigenous_supply', 'remote', 'remote_community'],
    laneKilometres: 340,
    designSpeedKmh: 95,
    freightShare: 0.27,
    urbanShare: 0.05,
    tollRoad: false,
  },
];

export const ROUND12_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_wa_karratha_lithium',
    category: 'rail',
    name: 'Karratha Lithium Export Rail',
    description: 'Critical-minerals unit trains to Hedland bulk loaders.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 6.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['critical_minerals', 'lithium', 'bulk', 'heavy_haul', 'battery_feedstock'],
    trackKilometres: 280,
    dualTrackShare: 0.62,
    electrifiedShare: 0.28,
    designFreightTonnesPerYear: 14_500_000,
    passengerCapable: false,
  },
  {
    id: 'rail_sa_olympic_dam_minerals',
    category: 'rail',
    name: 'Olympic Dam Minerals Rail',
    description: 'Copper and critical-minerals feed to Adelaide export chain.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 5.9,
    strategicNetworks: ['trade'],
    tags: ['critical_minerals', 'bulk', 'mining', 'rare_earth'],
    trackKilometres: 420,
    dualTrackShare: 0.48,
    electrifiedShare: 0.22,
    designFreightTonnesPerYear: 11_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nt_gove_remote_supply',
    category: 'rail',
    name: 'Gove Remote Supply Shuttle',
    description: 'Bauxite-region remote community supply shuttle.',
    hostRegion: 'NT',
    servedRegions: ['NT'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['remote', 'remote_community', 'indigenous_supply'],
    trackKilometres: 95,
    dualTrackShare: 0.35,
    electrifiedShare: 0.12,
    designFreightTonnesPerYear: 1_800_000,
    passengerCapable: false,
  },
];

export const ROUND12_PORTS: PortAsset[] = [
  {
    id: 'port_wa_hedland_lithium_export',
    category: 'port',
    name: 'Port Hedland Lithium Export Berths',
    description: 'Critical-minerals bulk export with maintained deep channels.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 7.8,
    strategicNetworks: ['trade'],
    tags: ['critical_minerals', 'lithium', 'bulk', 'dredging', 'channel_depth', 'pilotage'],
    berthCount: 9,
    maxDraftMetres: 18.2,
    teuCapacityPerYear: 520_000,
    automationLevel: 2,
    bulkShare: 0.84,
  },
  {
    id: 'port_qld_gladstone_channel',
    category: 'port',
    name: 'Gladstone Channel Services Terminal',
    description: 'Dredged deep-draft channel with pilotage coordination.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 7.2,
    strategicNetworks: ['trade'],
    tags: ['dredging', 'pilotage', 'channel_depth', 'bulk', 'export'],
    berthCount: 8,
    maxDraftMetres: 15.8,
    teuCapacityPerYear: 380_000,
    automationLevel: 2,
    bulkShare: 0.71,
  },
];

export const ROUND12_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_wa_pilbara_minerals_staging',
    category: 'logistics',
    name: 'Pilbara Minerals Staging Yard',
    description: 'Lithium and battery-feedstock export staging.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['trade'],
    tags: ['critical_minerals', 'lithium', 'battery_feedstock', 'bulk'],
    warehouseSqm: 142_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 54,
  },
  {
    id: 'log_nt_indigenous_remote_dc',
    category: 'logistics',
    name: 'Darwin Indigenous Remote DC',
    description: 'Top End indigenous and remote community supply consolidation.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD', 'WA'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['indigenous_supply', 'remote_community', 'remote'],
    warehouseSqm: 86_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 42,
  },
  {
    id: 'log_qld_gladstone_pilotage',
    category: 'logistics',
    name: 'Gladstone Pilotage Coordination Hub',
    description: 'Channel maintenance and pilot scheduling staging.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['trade'],
    tags: ['pilotage', 'dredging', 'channel_depth', 'gateway'],
    warehouseSqm: 68_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_tas_bass_pilotage',
    category: 'logistics',
    name: 'Bass Strait Pilotage Office',
    description: 'Short-sea pilotage and channel movement coordination.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 3.2,
    strategicNetworks: ['trade'],
    tags: ['pilotage', 'channel_depth', 'coastal_shipping'],
    warehouseSqm: 42_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 51,
  },
];

export const SCALE_WAVE_ROUND12_ASSETS = [
  ...ROUND12_ROADS,
  ...ROUND12_RAIL,
  ...ROUND12_PORTS,
  ...ROUND12_LOGISTICS,
];


// --- source: catalog/scale-wave-round13-assets.ts ---

export const ROUND13_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_vic_melbourne_recycle_loop',
    category: 'road',
    name: 'Melbourne Recycle Freight Loop',
    description: 'Circular economy drayage between waste hubs and ports.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['freight'],
    tags: ['circular_economy', 'recycle_freight', 'waste_logistics', 'motorway'],
    laneKilometres: 58,
    designSpeedKmh: 90,
    freightShare: 0.4,
    urbanShare: 0.22,
    tollRoad: true,
  },
  {
    id: 'road_nsw_blue_mountains_recovery',
    category: 'road',
    name: 'Blue Mountains Recovery Route',
    description: 'Disaster recovery detour and emergency staging access.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight'],
    tags: ['disaster_recovery', 'emergency_staging', 'national_highway'],
    laneKilometres: 88,
    designSpeedKmh: 100,
    freightShare: 0.35,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_sa_sturt_gauge_feed',
    category: 'road',
    name: 'Sturt Highway Gauge Feed',
    description: 'Road feed to Adelaide gauge interoperability hub.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC', 'NSW'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['freight'],
    tags: ['gauge_break', 'interoperability', 'national_highway'],
    laneKilometres: 210,
    designSpeedKmh: 110,
    freightShare: 0.37,
    urbanShare: 0.06,
    tollRoad: false,
  },
  {
    id: 'road_qld_recovery_coastal',
    category: 'road',
    name: 'Queensland Coastal Recovery Road',
    description: 'Cyclone recovery and emergency relief coastal feed.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.7,
    strategicNetworks: ['freight'],
    tags: ['disaster_recovery', 'emergency_relief', 'coastal_shipping'],
    laneKilometres: 145,
    designSpeedKmh: 100,
    freightShare: 0.32,
    urbanShare: 0.07,
    tollRoad: false,
  },
];

export const ROUND13_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_sa_adelaide_gauge_hub',
    category: 'rail',
    name: 'Adelaide Gauge Interoperability Hub',
    description: 'Standard-gauge transhipment and break-of-gauge relief.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC', 'NSW'],
    baseProductivityPoints: 5.7,
    strategicNetworks: ['freight'],
    tags: ['gauge_standard', 'interoperability', 'intermodal', 'freight_rail'],
    trackKilometres: 165,
    dualTrackShare: 0.72,
    electrifiedShare: 0.45,
    designFreightTonnesPerYear: 7_800_000,
    passengerCapable: true,
  },
  {
    id: 'rail_nsw_sydney_gauge_break',
    category: 'rail',
    name: 'Sydney Gauge Break Shuttle',
    description: 'Interstate gauge break shuttle at Sydney intermodal.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 5.3,
    strategicNetworks: ['freight'],
    tags: ['gauge_break', 'interoperability', 'standard_gauge', 'container'],
    trackKilometres: 48,
    dualTrackShare: 0.68,
    electrifiedShare: 0.82,
    designFreightTonnesPerYear: 5_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_vic_waste_logistics_loop',
    category: 'rail',
    name: 'Victoria Waste Logistics Loop',
    description: 'Circular waste and recycling unit trains.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['freight'],
    tags: ['waste_logistics', 'circular_economy', 'recycle_freight', 'freight_rail', 'standard_gauge'],
    trackKilometres: 92,
    dualTrackShare: 0.5,
    electrifiedShare: 0.58,
    designFreightTonnesPerYear: 3_400_000,
    passengerCapable: false,
  },
];

export const ROUND13_PORTS: PortAsset[] = [
  {
    id: 'port_sa_adelaide_gauge_terminal',
    category: 'port',
    name: 'Adelaide Gauge Terminal',
    description: 'Intermodal gauge handoff berths and staging.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 5.8,
    strategicNetworks: ['freight', 'trade'],
    tags: ['gauge_standard', 'interoperability', 'intermodal', 'container'],
    berthCount: 5,
    maxDraftMetres: 12.8,
    teuCapacityPerYear: 420_000,
    automationLevel: 2,
    bulkShare: 0.32,
  },
  {
    id: 'port_qld_recovery_staging',
    category: 'port',
    name: 'Gladstone Recovery Staging Berths',
    description: 'Cyclone disaster recovery sealift and relief staging.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['freight'],
    tags: ['disaster_recovery', 'emergency_staging', 'emergency_relief', 'bulk'],
    berthCount: 4,
    maxDraftMetres: 13.5,
    teuCapacityPerYear: 260_000,
    automationLevel: 1,
    bulkShare: 0.55,
  },
];

export const ROUND13_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_vic_circular_freight_hub',
    category: 'logistics',
    name: 'Melbourne Circular Freight Hub',
    description: 'Waste-to-resource and recycling logistics consolidation.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight'],
    tags: ['circular_economy', 'waste_logistics', 'recycle_freight'],
    warehouseSqm: 156_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 62,
  },
  {
    id: 'log_nsw_emergency_staging_yard',
    category: 'logistics',
    name: 'NSW Emergency Staging Yard',
    description: 'Disaster recovery freight and relief supply staging.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['freight'],
    tags: ['disaster_recovery', 'emergency_staging', 'emergency_relief'],
    warehouseSqm: 134_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 65,
  },
  {
    id: 'log_sa_adelaide_gauge_yard',
    category: 'logistics',
    name: 'Adelaide Gauge Tranship Yard',
    description: 'Break-of-gauge container tranship and interoperability staging.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC', 'NSW'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['freight'],
    tags: ['gauge_standard', 'interoperability', 'intermodal', 'gauge_break'],
    warehouseSqm: 148_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 60,
  },
  {
    id: 'log_act_capital_emergency_relief',
    category: 'logistics',
    name: 'Canberra Emergency Relief DC',
    description: 'Capital region disaster relief and recovery staging.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.6,
    strategicNetworks: ['freight', 'mobility'],
    tags: ['emergency_relief', 'disaster_recovery', 'capital', 'emergency_staging'],
    warehouseSqm: 52_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'air'],
    lastMileCoveragePct: 78,
  },
];

export const SCALE_WAVE_ROUND13_ASSETS = [
  ...ROUND13_ROADS,
  ...ROUND13_RAIL,
  ...ROUND13_PORTS,
  ...ROUND13_LOGISTICS,
];


// --- source: catalog/scale-wave-round14-assets.ts ---

export const ROUND14_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_sa_murray_grain_feed',
    category: 'road',
    name: 'Murray Grain Feed Highway',
    description: 'Harvest corridor drayage to Adelaide grain export.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['grain_export', 'agricultural_bulk', 'harvest_corridor', 'national_highway'],
    laneKilometres: 240,
    designSpeedKmh: 110,
    freightShare: 0.45,
    urbanShare: 0.05,
    tollRoad: false,
  },
  {
    id: 'road_vic_wimmera_harvest',
    category: 'road',
    name: 'Wimmera Harvest Corridor',
    description: 'Grain bulk feed to Geelong and Portland export.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'SA'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['trade'],
    tags: ['harvest_corridor', 'grain', 'agricultural_bulk'],
    laneKilometres: 185,
    designSpeedKmh: 100,
    freightShare: 0.42,
    urbanShare: 0.06,
    tollRoad: false,
  },
  {
    id: 'road_nsw_hunter_rail_availability',
    category: 'road',
    name: 'Hunter Rail Availability Feed',
    description: 'Staging for coordinated track possession windows.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['rail_availability', 'maintenance_window', 'freight'],
    laneKilometres: 72,
    designSpeedKmh: 100,
    freightShare: 0.38,
    urbanShare: 0.11,
    tollRoad: false,
  },
  {
    id: 'road_qld_gladstone_bunker_feed',
    category: 'road',
    name: 'Gladstone Green Bunker Feed',
    description: 'Ammonia bunkering supply to export berths.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['trade'],
    tags: ['green_bunkering', 'ammonia_fuel', 'low_carbon_fuel', 'port_access'],
    laneKilometres: 38,
    designSpeedKmh: 90,
    freightShare: 0.44,
    urbanShare: 0.07,
    tollRoad: false,
  },
];

export const ROUND14_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_sa_adelaide_grain_export',
    category: 'rail',
    name: 'Adelaide Grain Export Rail',
    description: 'Standard-gauge grain unit trains to outer harbour.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 5.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['grain_export', 'agricultural_bulk', 'grain', 'freight_rail'],
    trackKilometres: 320,
    dualTrackShare: 0.58,
    electrifiedShare: 0.35,
    designFreightTonnesPerYear: 10_500_000,
    passengerCapable: true,
  },
  {
    id: 'rail_nsw_sydney_possession_mesh',
    category: 'rail',
    name: 'Sydney Possession Coordination Line',
    description: 'Dual-track mesh reducing freight possession conflicts.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['freight'],
    tags: ['track_possession', 'maintenance_window', 'rail_availability', 'freight_rail'],
    trackKilometres: 165,
    dualTrackShare: 0.74,
    electrifiedShare: 0.8,
    designFreightTonnesPerYear: 8_200_000,
    passengerCapable: true,
  },
  {
    id: 'rail_qld_curtis_green_rail',
    category: 'rail',
    name: 'Curtis Green Fuel Rail Feed',
    description: 'Ammonia and green bunkering feed to LNG export precinct.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['trade'],
    tags: ['green_bunkering', 'ammonia_fuel', 'energy_export', 'bulk'],
    trackKilometres: 88,
    dualTrackShare: 0.52,
    electrifiedShare: 0.4,
    designFreightTonnesPerYear: 6_400_000,
    passengerCapable: false,
  },
];

export const ROUND14_PORTS: PortAsset[] = [
  {
    id: 'port_sa_outer_harbour_grain',
    category: 'port',
    name: 'Outer Harbour Grain Terminal',
    description: 'Bulk grain export with shore-power bunkering.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 6.4,
    strategicNetworks: ['trade'],
    tags: ['grain_export', 'grain', 'agricultural_bulk', 'shore_power', 'green_bunkering'],
    berthCount: 7,
    maxDraftMetres: 14.5,
    teuCapacityPerYear: 380_000,
    automationLevel: 2,
    bulkShare: 0.72,
  },
  {
    id: 'port_qld_gladstone_green_bunker',
    category: 'port',
    name: 'Gladstone Green Bunkering Terminal',
    description: 'Ammonia and low-carbon fuel bunkering for export fleet.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 6.9,
    strategicNetworks: ['trade'],
    tags: ['green_bunkering', 'ammonia_fuel', 'shore_power', 'low_carbon_fuel', 'export'],
    berthCount: 6,
    maxDraftMetres: 15.2,
    teuCapacityPerYear: 290_000,
    automationLevel: 2,
    bulkShare: 0.58,
  },
];

export const ROUND14_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_sa_adelaide_grain_dc',
    category: 'logistics',
    name: 'Adelaide Grain Export DC',
    description: 'Harvest consolidation and export staging.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'VIC'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['trade'],
    tags: ['grain_export', 'agricultural_bulk', 'harvest_corridor'],
    warehouseSqm: 168_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 59,
  },
  {
    id: 'log_nsw_possession_control',
    category: 'logistics',
    name: 'NSW Possession Control Hub',
    description: 'Track possession scheduling and rail availability staging.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['freight'],
    tags: ['track_possession', 'maintenance_window', 'rail_availability'],
    warehouseSqm: 88_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 66,
  },
  {
    id: 'log_qld_green_bunker_staging',
    category: 'logistics',
    name: 'Gladstone Green Bunker Staging',
    description: 'Ammonia fuel buffer and bunkering coordination yard.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['trade'],
    tags: ['green_bunkering', 'ammonia_fuel', 'low_carbon_fuel'],
    warehouseSqm: 102_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 57,
  },
  {
    id: 'log_wa_karratha_bunker',
    category: 'logistics',
    name: 'Karratha Green Bunker Yard',
    description: 'Pilbara export vessel green fuel staging.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['trade'],
    tags: ['green_bunkering', 'ammonia_fuel', 'shore_power', 'mining'],
    warehouseSqm: 76_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 49,
  },
  {
    id: 'log_act_rail_coordination',
    category: 'logistics',
    name: 'Canberra Rail Coordination Node',
    description: 'ACT freight rail availability and possession handoff.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.4,
    strategicNetworks: ['freight'],
    tags: ['rail_availability', 'freight_rail', 'track_possession', 'capital'],
    warehouseSqm: 44_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 72,
  },
];

export const SCALE_WAVE_ROUND14_ASSETS = [
  ...ROUND14_ROADS,
  ...ROUND14_RAIL,
  ...ROUND14_PORTS,
  ...ROUND14_LOGISTICS,
];


// --- source: catalog/scale-wave-round15-assets.ts ---

export const ROUND15_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_qld_cairns_pacific_feeder',
    category: 'road',
    name: 'Cairns Pacific Feeder Link',
    description: 'Feeder drayage to Pacific island tradelane berths.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['trade'],
    tags: ['pacific_feeder', 'tradelane_pacific', 'feeder', 'coastal_shipping'],
    laneKilometres: 68,
    designSpeedKmh: 100,
    freightShare: 0.36,
    urbanShare: 0.1,
    tollRoad: false,
  },
  {
    id: 'road_nsw_health_freight_spine',
    category: 'road',
    name: 'NSW Health Freight Spine',
    description: 'Medical and pharma cold-chain motorway feed.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight'],
    tags: ['medical_supply', 'health_freight', 'pharma_cold', 'motorway'],
    laneKilometres: 94,
    designSpeedKmh: 110,
    freightShare: 0.34,
    urbanShare: 0.15,
    tollRoad: true,
  },
  {
    id: 'road_nsw_western_sydney_dc_feed',
    category: 'road',
    name: 'Western Sydney Data Centre Feed',
    description: 'Hyperscale equipment and digital infra drayage.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['freight'],
    tags: ['data_centre', 'hyperscale_logistics', 'digital_infra', 'motorway'],
    laneKilometres: 46,
    designSpeedKmh: 100,
    freightShare: 0.41,
    urbanShare: 0.2,
    tollRoad: true,
  },
  {
    id: 'road_vic_dandenong_medical',
    category: 'road',
    name: 'Dandenong Medical Supply Link',
    description: 'Melbourne health freight distribution feed.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['medical_supply', 'health_freight', 'pharma_cold'],
    laneKilometres: 32,
    designSpeedKmh: 90,
    freightShare: 0.33,
    urbanShare: 0.24,
    tollRoad: true,
  },
];

export const ROUND15_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_sydney_data_centre',
    category: 'rail',
    name: 'Sydney Data Centre Rail Shuttle',
    description: 'Digital infrastructure freight shuttle to Western Sydney.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 5.1,
    strategicNetworks: ['freight'],
    tags: ['data_centre', 'digital_infra', 'hyperscale_logistics', 'freight_rail'],
    trackKilometres: 58,
    dualTrackShare: 0.62,
    electrifiedShare: 0.75,
    designFreightTonnesPerYear: 3_800_000,
    passengerCapable: false,
  },
  {
    id: 'rail_vic_melbourne_hyperscale',
    category: 'rail',
    name: 'Melbourne Hyperscale Rail Feed',
    description: 'Data-centre construction and module delivery rail.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 5.0,
    strategicNetworks: ['freight'],
    tags: ['data_centre', 'hyperscale_logistics', 'digital_infra', 'container'],
    trackKilometres: 72,
    dualTrackShare: 0.55,
    electrifiedShare: 0.68,
    designFreightTonnesPerYear: 4_200_000,
    passengerCapable: false,
  },
  {
    id: 'rail_qld_townsville_pacific',
    category: 'rail',
    name: 'Townsville Pacific Feeder Rail',
    description: 'Island tradelane container feed to coastal ports.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['trade'],
    tags: ['pacific_feeder', 'tradelane_pacific', 'feeder', 'container'],
    trackKilometres: 125,
    dualTrackShare: 0.48,
    electrifiedShare: 0.32,
    designFreightTonnesPerYear: 4_600_000,
    passengerCapable: true,
  },
];

export const ROUND15_PORTS: PortAsset[] = [
  {
    id: 'port_qld_brisbane_pacific_feeder',
    category: 'port',
    name: 'Brisbane Pacific Feeder Terminal',
    description: 'Pacific island and tradelane feeder berths.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NT'],
    baseProductivityPoints: 6.1,
    strategicNetworks: ['trade'],
    tags: ['pacific_feeder', 'tradelane_pacific', 'feeder', 'pacific_islands', 'container'],
    berthCount: 6,
    maxDraftMetres: 13.8,
    teuCapacityPerYear: 520_000,
    automationLevel: 2,
    bulkShare: 0.26,
  },
  {
    id: 'port_nt_darwin_pacific_relief',
    category: 'port',
    name: 'Darwin Pacific Relief Berths',
    description: 'Northern Pacific feeder and relief supply berths.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'QLD'],
    baseProductivityPoints: 5.4,
    strategicNetworks: ['trade', 'freight'],
    tags: ['pacific_feeder', 'pacific_islands', 'feeder', 'remote'],
    berthCount: 5,
    maxDraftMetres: 12.5,
    teuCapacityPerYear: 310_000,
    automationLevel: 1,
    bulkShare: 0.34,
  },
];

export const ROUND15_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_nsw_sydney_medical_dc',
    category: 'logistics',
    name: 'Sydney Medical Supply DC',
    description: 'Pharma cold-chain and health freight consolidation.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'ACT'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['freight'],
    tags: ['medical_supply', 'health_freight', 'pharma_cold'],
    warehouseSqm: 128_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'air'],
    lastMileCoveragePct: 70,
  },
  {
    id: 'log_act_canberra_pharma',
    category: 'logistics',
    name: 'Canberra Pharma Cold Hub',
    description: 'Capital region medical and pharma cold-chain staging.',
    hostRegion: 'ACT',
    servedRegions: ['ACT', 'NSW'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['freight'],
    tags: ['medical_supply', 'pharma_cold', 'health_freight', 'capital'],
    warehouseSqm: 62_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'air'],
    lastMileCoveragePct: 77,
  },
  {
    id: 'log_nsw_western_sydney_hyperscale',
    category: 'logistics',
    name: 'Western Sydney Hyperscale Yard',
    description: 'Data-centre module and digital infrastructure staging.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 4.7,
    strategicNetworks: ['freight'],
    tags: ['data_centre', 'hyperscale_logistics', 'digital_infra'],
    warehouseSqm: 178_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 64,
  },
  {
    id: 'log_vic_melbourne_data_centre',
    category: 'logistics',
    name: 'Melbourne Data Centre Logistics Hub',
    description: 'Hyperscale digital infra freight and cable landing feed.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['freight'],
    tags: ['data_centre', 'digital_infra', 'hyperscale_logistics'],
    warehouseSqm: 165_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 68,
  },
];

export const SCALE_WAVE_ROUND15_ASSETS = [
  ...ROUND15_ROADS,
  ...ROUND15_RAIL,
  ...ROUND15_PORTS,
  ...ROUND15_LOGISTICS,
];


// --- source: catalog/scale-wave-round16-assets.ts ---

export const ROUND16_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_wa_geraldton_offshore_staging',
    category: 'road',
    name: 'Geraldton Offshore Wind Staging Link',
    description: 'Turbine component drayage to offshore wind marshalling.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight', 'trade'],
    tags: ['offshore_wind', 'wind_farm_logistics', 'turbine_staging', 'coastal_shipping'],
    laneKilometres: 88,
    designSpeedKmh: 100,
    freightShare: 0.39,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_wa_kwinana_battery_spine',
    category: 'road',
    name: 'Kwinana Battery Supply Spine',
    description: 'Lithium and EV cell freight feed to processing hubs.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['freight'],
    tags: ['battery_supply', 'lithium_logistics', 'ev_freight', 'motorway'],
    laneKilometres: 52,
    designSpeedKmh: 100,
    freightShare: 0.42,
    urbanShare: 0.18,
    tollRoad: true,
  },
  {
    id: 'road_qld_cairns_cruise_feed',
    category: 'road',
    name: 'Cairns Cruise Turnaround Feed',
    description: 'Tourism port provisioning and turnaround drayage.',
    hostRegion: 'QLD',
    servedRegions: ['QLD'],
    baseProductivityPoints: 3.7,
    strategicNetworks: ['mobility', 'trade'],
    tags: ['cruise_turnaround', 'tourism_port', 'passenger_freight'],
    laneKilometres: 24,
    designSpeedKmh: 80,
    freightShare: 0.22,
    urbanShare: 0.35,
    tollRoad: false,
  },
  {
    id: 'road_nsw_sydney_cruise_ring',
    category: 'road',
    name: 'Sydney Cruise Turnaround Ring',
    description: 'Circular Quay and White Bay cruise logistics ring.',
    hostRegion: 'NSW',
    servedRegions: ['NSW'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['mobility'],
    tags: ['cruise_turnaround', 'tourism_port', 'passenger_freight', 'port_access'],
    laneKilometres: 18,
    designSpeedKmh: 70,
    freightShare: 0.19,
    urbanShare: 0.42,
    tollRoad: true,
  },
];

export const ROUND16_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_wa_pilbara_battery_export',
    category: 'rail',
    name: 'Pilbara Battery Export Rail',
    description: 'Lithium concentrate and battery precursor rail export.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 5.3,
    strategicNetworks: ['freight', 'trade'],
    tags: ['battery_supply', 'lithium_logistics', 'ev_freight', 'bulk'],
    trackKilometres: 420,
    dualTrackShare: 0.58,
    electrifiedShare: 0.22,
    designFreightTonnesPerYear: 28_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_sa_spencer_offshore_wind',
    category: 'rail',
    name: 'Spencer Gulf Offshore Wind Rail',
    description: 'Turbine staging feed to Whyalla offshore marshalling.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['freight'],
    tags: ['offshore_wind', 'offshore_staging', 'wind_farm_logistics', 'freight_rail'],
    trackKilometres: 165,
    dualTrackShare: 0.44,
    electrifiedShare: 0.38,
    designFreightTonnesPerYear: 6_400_000,
    passengerCapable: false,
  },
  {
    id: 'rail_vic_geelong_battery',
    category: 'rail',
    name: 'Geelong Battery Manufacturing Rail',
    description: 'EV cell and module freight to port export berths.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 5.0,
    strategicNetworks: ['freight'],
    tags: ['battery_supply', 'cell_manufacturing', 'ev_freight', 'container'],
    trackKilometres: 78,
    dualTrackShare: 0.61,
    electrifiedShare: 0.72,
    designFreightTonnesPerYear: 5_100_000,
    passengerCapable: false,
  },
];

export const ROUND16_PORTS: PortAsset[] = [
  {
    id: 'port_wa_geraldton_offshore',
    category: 'port',
    name: 'Geraldton Offshore Wind Marshalling',
    description: 'Offshore turbine staging and renewable export berths.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 5.9,
    strategicNetworks: ['trade', 'freight'],
    tags: ['offshore_wind', 'wind_farm_logistics', 'turbine_staging', 'renewable_export'],
    berthCount: 5,
    maxDraftMetres: 14.2,
    teuCapacityPerYear: 280_000,
    automationLevel: 1,
    bulkShare: 0.38,
  },
  {
    id: 'port_qld_brisbane_cruise',
    category: 'port',
    name: 'Brisbane Cruise Turnaround Terminal',
    description: 'Dedicated cruise turnaround and tourism freight berths.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['mobility', 'trade'],
    tags: ['cruise_turnaround', 'tourism_port', 'passenger_freight', 'container'],
    berthCount: 4,
    maxDraftMetres: 12.8,
    teuCapacityPerYear: 190_000,
    automationLevel: 2,
    bulkShare: 0.18,
  },
  {
    id: 'port_tas_hobart_offshore_staging',
    category: 'port',
    name: 'Hobart Offshore Staging Berths',
    description: 'Southern ocean wind and marine logistics staging.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['trade'],
    tags: ['offshore_wind', 'offshore_staging', 'wind_farm_logistics', 'renewable_export'],
    berthCount: 3,
    maxDraftMetres: 11.5,
    teuCapacityPerYear: 95_000,
    automationLevel: 1,
    bulkShare: 0.29,
  },
];

export const ROUND16_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_wa_kwinana_battery_dc',
    category: 'logistics',
    name: 'Kwinana Battery Supply DC',
    description: 'Lithium hydroxide and EV component consolidation.',
    hostRegion: 'WA',
    servedRegions: ['WA'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['freight'],
    tags: ['battery_supply', 'lithium_logistics', 'ev_freight'],
    warehouseSqm: 142_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_sa_whyalla_offshore_yard',
    category: 'logistics',
    name: 'Whyalla Offshore Wind Yard',
    description: 'Turbine blade and nacelle staging yard.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['freight', 'trade'],
    tags: ['offshore_wind', 'turbine_staging', 'wind_farm_logistics', 'offshore_staging'],
    warehouseSqm: 118_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 52,
  },
  {
    id: 'log_nsw_sydney_cruise_provision',
    category: 'logistics',
    name: 'Sydney Cruise Provisioning Hub',
    description: 'Tourism turnaround stores and passenger freight.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['mobility'],
    tags: ['cruise_turnaround', 'tourism_port', 'passenger_freight'],
    warehouseSqm: 86_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 74,
  },
];

export const SCALE_WAVE_ROUND16_ASSETS = [
  ...ROUND16_ROADS,
  ...ROUND16_RAIL,
  ...ROUND16_PORTS,
  ...ROUND16_LOGISTICS,
];


// --- source: catalog/scale-wave-round17-assets.ts ---

export const ROUND17_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_nsw_sydney_cable_landing_feed',
    category: 'road',
    name: 'Sydney Cable Landing Feed',
    description: 'Subsea cable shore-end drayage to landing stations.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['trade', 'freight'],
    tags: ['subsea_cable', 'cable_landing', 'digital_trade'],
    laneKilometres: 32,
    designSpeedKmh: 90,
    freightShare: 0.31,
    urbanShare: 0.28,
    tollRoad: true,
  },
  {
    id: 'road_qld_brisbane_telecom_landing',
    category: 'road',
    name: 'Brisbane Telecom Landing Link',
    description: 'Pacific cable landing access to port staging.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 3.9,
    strategicNetworks: ['trade'],
    tags: ['subsea_cable', 'telecom_landing', 'digital_trade', 'port_access'],
    laneKilometres: 28,
    designSpeedKmh: 85,
    freightShare: 0.29,
    urbanShare: 0.22,
    tollRoad: false,
  },
  {
    id: 'road_wa_kwinana_ammonia_spine',
    category: 'road',
    name: 'Kwinana Green Ammonia Spine',
    description: 'Renewable ammonia feed to export berths.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 4.7,
    strategicNetworks: ['freight', 'trade'],
    tags: ['green_ammonia', 'ammonia_export', 'hydrogen_derivative', 'motorway'],
    laneKilometres: 46,
    designSpeedKmh: 100,
    freightShare: 0.41,
    urbanShare: 0.14,
    tollRoad: true,
  },
  {
    id: 'road_vic_tullamarine_air_rail',
    category: 'road',
    name: 'Tullamarine Air-Rail Connector',
    description: 'Melbourne airport express road-rail interface.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['mobility'],
    tags: ['airport_express', 'air_rail', 'passenger_freight', 'port_access'],
    laneKilometres: 14,
    designSpeedKmh: 80,
    freightShare: 0.16,
    urbanShare: 0.48,
    tollRoad: true,
  },
];

export const ROUND17_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_nsw_sydney_airport_express',
    category: 'rail',
    name: 'Sydney Airport Express Rail',
    description: 'Dedicated airport passenger and air-freight rail.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC'],
    baseProductivityPoints: 5.4,
    strategicNetworks: ['mobility', 'freight'],
    tags: ['airport_express', 'air_rail', 'passenger_freight', 'intercapital'],
    trackKilometres: 22,
    dualTrackShare: 0.72,
    electrifiedShare: 0.95,
    designFreightTonnesPerYear: 3_800_000,
    passengerCapable: true,
  },
  {
    id: 'rail_vic_skybus_rail_feed',
    category: 'rail',
    name: 'Melbourne SkyRail Airport Feed',
    description: 'Air-rail integration for Tullamarine cargo and passengers.',
    hostRegion: 'VIC',
    servedRegions: ['VIC'],
    baseProductivityPoints: 5.1,
    strategicNetworks: ['mobility'],
    tags: ['airport_express', 'air_rail', 'passenger_freight'],
    trackKilometres: 18,
    dualTrackShare: 0.68,
    electrifiedShare: 0.88,
    designFreightTonnesPerYear: 2_600_000,
    passengerCapable: true,
  },
  {
    id: 'rail_sa_spencer_ammonia_export',
    category: 'rail',
    name: 'Spencer Gulf Ammonia Export Rail',
    description: 'Green ammonia precursor rail to Whyalla export berths.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['freight', 'trade'],
    tags: ['green_ammonia', 'ammonia_export', 'renewable_export', 'bulk'],
    trackKilometres: 142,
    dualTrackShare: 0.46,
    electrifiedShare: 0.41,
    designFreightTonnesPerYear: 7_200_000,
    passengerCapable: false,
  },
];

export const ROUND17_PORTS: PortAsset[] = [
  {
    id: 'port_nsw_bondi_cable_landing',
    category: 'port',
    name: 'Bondi Subsea Cable Landing',
    description: 'Pacific subsea cable shore-end and digital trade berths.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 5.6,
    strategicNetworks: ['trade'],
    tags: ['subsea_cable', 'cable_landing', 'digital_trade', 'telecom_landing'],
    berthCount: 3,
    maxDraftMetres: 11.8,
    teuCapacityPerYear: 120_000,
    automationLevel: 2,
    bulkShare: 0.12,
  },
  {
    id: 'port_wa_geraldton_ammonia',
    category: 'port',
    name: 'Geraldton Green Ammonia Terminal',
    description: 'Renewable ammonia export and hydrogen derivative berths.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 5.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['green_ammonia', 'ammonia_export', 'hydrogen_derivative', 'renewable_export'],
    berthCount: 4,
    maxDraftMetres: 13.5,
    teuCapacityPerYear: 210_000,
    automationLevel: 1,
    bulkShare: 0.52,
  },
  {
    id: 'port_qld_gladstone_ammonia',
    category: 'port',
    name: 'Gladstone Ammonia Export Berths',
    description: 'East coast green ammonia bulk export.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 5.5,
    strategicNetworks: ['trade'],
    tags: ['green_ammonia', 'ammonia_export', 'renewable_export', 'bulk'],
    berthCount: 3,
    maxDraftMetres: 14.0,
    teuCapacityPerYear: 165_000,
    automationLevel: 1,
    bulkShare: 0.58,
  },
];

export const ROUND17_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_nsw_sydney_cable_dc',
    category: 'logistics',
    name: 'Sydney Cable Landing DC',
    description: 'Subsea cable shore-end equipment consolidation.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade'],
    tags: ['subsea_cable', 'cable_landing', 'digital_trade'],
    warehouseSqm: 96_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'port'],
    lastMileCoveragePct: 62,
  },
  {
    id: 'log_wa_kwinana_ammonia_yard',
    category: 'logistics',
    name: 'Kwinana Ammonia Staging Yard',
    description: 'Green ammonia tank and module staging.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 4.7,
    strategicNetworks: ['freight', 'trade'],
    tags: ['green_ammonia', 'ammonia_export', 'hydrogen_derivative'],
    warehouseSqm: 128_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 54,
  },
  {
    id: 'log_vic_melbourne_air_rail_hub',
    category: 'logistics',
    name: 'Melbourne Air-Rail Logistics Hub',
    description: 'Airport express cargo and passenger freight stores.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'NSW'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['mobility'],
    tags: ['airport_express', 'air_rail', 'passenger_freight'],
    warehouseSqm: 74_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 78,
  },
];

export const SCALE_WAVE_ROUND17_ASSETS = [
  ...ROUND17_ROADS,
  ...ROUND17_RAIL,
  ...ROUND17_PORTS,
  ...ROUND17_LOGISTICS,
];


// --- source: catalog/scale-wave-round18-assets.ts ---

export const ROUND18_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_wa_greenbushes_brine_haul',
    category: 'road',
    name: 'Greenbushes Lithium Brine Haul',
    description: 'Brine concentrate road feed to Kwinana processing.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['freight', 'trade'],
    tags: ['lithium_brine', 'brine_export', 'battery_feedstock', 'mining'],
    laneKilometres: 52,
    designSpeedKmh: 95,
    freightShare: 0.44,
    urbanShare: 0.08,
    tollRoad: false,
  },
  {
    id: 'road_sa_port_augusta_brine',
    category: 'road',
    name: 'Port Augusta Brine Export Link',
    description: 'Spodumene and brine module road to Spencer Gulf.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'WA'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['trade'],
    tags: ['lithium_brine', 'brine_export', 'battery_feedstock'],
    laneKilometres: 38,
    designSpeedKmh: 90,
    freightShare: 0.39,
    urbanShare: 0.12,
    tollRoad: false,
  },
  {
    id: 'road_qld_toowoomba_inland_express',
    category: 'road',
    name: 'Toowoomba Inland Express Feed',
    description: 'Road interface to inland rail express terminals.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 4.3,
    strategicNetworks: ['freight'],
    tags: ['inland_rail_express', 'express_freight', 'intermodal_express', 'motorway'],
    laneKilometres: 41,
    designSpeedKmh: 100,
    freightShare: 0.36,
    urbanShare: 0.18,
    tollRoad: true,
  },
  {
    id: 'road_nt_arnhem_launch_access',
    category: 'road',
    name: 'Arnhem Launch Access Road',
    description: 'Remote launch site logistics and fuel staging access.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'SA'],
    baseProductivityPoints: 3.8,
    strategicNetworks: ['freight'],
    tags: ['space_launch', 'launch_logistics', 'orbital_supply', 'remote'],
    laneKilometres: 96,
    designSpeedKmh: 80,
    freightShare: 0.33,
    urbanShare: 0.02,
    tollRoad: false,
  },
];

export const ROUND18_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_wa_kalgoorlie_brine_rail',
    category: 'rail',
    name: 'Kalgoorlie Brine Export Rail',
    description: 'Battery feedstock rail to Fremantle bulk.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 5.2,
    strategicNetworks: ['freight', 'trade'],
    tags: ['lithium_brine', 'brine_export', 'battery_feedstock', 'heavy_haul'],
    trackKilometres: 580,
    dualTrackShare: 0.52,
    electrifiedShare: 0.12,
    designFreightTonnesPerYear: 22_000_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nsw_parkes_inland_express',
    category: 'rail',
    name: 'Parkes Inland Rail Express',
    description: 'East-west express container path via Parkes hub.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD', 'VIC'],
    baseProductivityPoints: 5.6,
    strategicNetworks: ['freight'],
    tags: ['inland_rail_express', 'express_freight', 'intermodal_express', 'intercapital'],
    trackKilometres: 420,
    dualTrackShare: 0.61,
    electrifiedShare: 0.28,
    designFreightTonnesPerYear: 18_500_000,
    passengerCapable: false,
  },
  {
    id: 'rail_sa_woomera_launch_spur',
    category: 'rail',
    name: 'Woomera Launch Logistics Spur',
    description: 'Orbital supply rail spur to launch staging yards.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'NT'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['freight'],
    tags: ['space_launch', 'launch_logistics', 'orbital_supply'],
    trackKilometres: 210,
    dualTrackShare: 0.38,
    electrifiedShare: 0.05,
    designFreightTonnesPerYear: 4_200_000,
    passengerCapable: false,
  },
];

export const ROUND18_PORTS: PortAsset[] = [
  {
    id: 'port_wa_fremantle_lithium_bulk',
    category: 'port',
    name: 'Fremantle Lithium Bulk Terminal',
    description: 'Spodumene and brine derivative export berths.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 5.7,
    strategicNetworks: ['trade'],
    tags: ['lithium_brine', 'brine_export', 'battery_feedstock', 'bulk'],
    berthCount: 4,
    maxDraftMetres: 14.2,
    teuCapacityPerYear: 185_000,
    automationLevel: 1,
    bulkShare: 0.61,
  },
  {
    id: 'port_qld_brisbane_inland_express',
    category: 'port',
    name: 'Brisbane Inland Express Terminal',
    description: 'Express container handoff to inland rail.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'NSW'],
    baseProductivityPoints: 5.3,
    strategicNetworks: ['trade', 'freight'],
    tags: ['inland_rail_express', 'express_freight', 'intermodal_express', 'container'],
    berthCount: 3,
    maxDraftMetres: 13.8,
    teuCapacityPerYear: 320_000,
    automationLevel: 2,
    bulkShare: 0.18,
  },
  {
    id: 'port_nt_darwin_launch_staging',
    category: 'port',
    name: 'Darwin Launch Staging Port',
    description: 'Orbital supply module staging and fuel logistics.',
    hostRegion: 'NT',
    servedRegions: ['NT', 'SA'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['trade'],
    tags: ['space_launch', 'launch_logistics', 'orbital_supply', 'gateway'],
    berthCount: 2,
    maxDraftMetres: 12.5,
    teuCapacityPerYear: 95_000,
    automationLevel: 1,
    bulkShare: 0.22,
  },
];

export const ROUND18_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_wa_kwinana_brine_yard',
    category: 'logistics',
    name: 'Kwinana Brine Processing Yard',
    description: 'Lithium brine concentrate and module staging.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'SA'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['trade', 'freight'],
    tags: ['lithium_brine', 'brine_export', 'battery_feedstock'],
    warehouseSqm: 112_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 51,
  },
  {
    id: 'log_nsw_parkes_express_hub',
    category: 'logistics',
    name: 'Parkes Express Intermodal Hub',
    description: 'Inland rail express container consolidation.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'QLD', 'VIC'],
    baseProductivityPoints: 4.9,
    strategicNetworks: ['freight'],
    tags: ['inland_rail_express', 'express_freight', 'intermodal_express'],
    warehouseSqm: 142_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 58,
  },
  {
    id: 'log_sa_woomera_orbital_yard',
    category: 'logistics',
    name: 'Woomera Orbital Supply Yard',
    description: 'Launch vehicle and payload logistics stores.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'NT'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight'],
    tags: ['space_launch', 'launch_logistics', 'orbital_supply'],
    warehouseSqm: 68_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 42,
  },
];

export const SCALE_WAVE_ROUND18_ASSETS = [
  ...ROUND18_ROADS,
  ...ROUND18_RAIL,
  ...ROUND18_PORTS,
  ...ROUND18_LOGISTICS,
];


// --- source: catalog/scale-wave-round19-assets.ts ---

export const ROUND19_ROADS: RoadSegmentAsset[] = [
  {
    id: 'road_wa_mount_weld_magnet_haul',
    category: 'road',
    name: 'Mount Weld Magnet Haul Road',
    description: 'Rare-earth concentrate road to Geraldton export.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'QLD'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['freight', 'trade'],
    tags: ['rare_earth', 'magnet_export', 'ndfeb_supply', 'mining'],
    laneKilometres: 58,
    designSpeedKmh: 92,
    freightShare: 0.42,
    urbanShare: 0.06,
    tollRoad: false,
  },
  {
    id: 'road_qld_doomadgee_magnet_feed',
    category: 'road',
    name: 'Doomadgee Magnet Feed',
    description: 'North Queensland rare-earth road to Townsville bulk.',
    hostRegion: 'QLD',
    servedRegions: ['QLD', 'WA'],
    baseProductivityPoints: 4.0,
    strategicNetworks: ['trade'],
    tags: ['rare_earth', 'magnet_export', 'ndfeb_supply'],
    laneKilometres: 44,
    designSpeedKmh: 88,
    freightShare: 0.37,
    urbanShare: 0.04,
    tollRoad: false,
  },
  {
    id: 'road_tas_devonport_reefer_feed',
    category: 'road',
    name: 'Devonport Reefer Feed',
    description: 'Cold-chain road feed to Bass Strait reefer terminals.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 3.7,
    strategicNetworks: ['freight'],
    tags: ['trans_tasman', 'reefer_express', 'cold_chain_sea', 'regional'],
    laneKilometres: 36,
    designSpeedKmh: 85,
    freightShare: 0.31,
    urbanShare: 0.22,
    tollRoad: false,
  },
  {
    id: 'road_sa_sturt_zet_corridor',
    category: 'road',
    name: 'Sturt Zero-Emission Truck Corridor',
    description: 'Battery-electric heavy haul on Adelaide–Port Augusta spine.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'NSW'],
    baseProductivityPoints: 4.4,
    strategicNetworks: ['freight'],
    tags: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul', 'transcontinental'],
    laneKilometres: 48,
    designSpeedKmh: 95,
    freightShare: 0.38,
    urbanShare: 0.11,
    tollRoad: true,
  },
];

export const ROUND19_RAIL: RailCorridorAsset[] = [
  {
    id: 'rail_wa_geraldton_magnet_rail',
    category: 'rail',
    name: 'Geraldton Magnet Export Rail',
    description: 'Rare-earth bulk rail to magnet export berths.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'QLD'],
    baseProductivityPoints: 5.3,
    strategicNetworks: ['trade', 'freight'],
    tags: ['rare_earth', 'magnet_export', 'ndfeb_supply', 'heavy_haul'],
    trackKilometres: 320,
    dualTrackShare: 0.48,
    electrifiedShare: 0.18,
    designFreightTonnesPerYear: 16_500_000,
    passengerCapable: false,
  },
  {
    id: 'rail_vic_melbourne_reefer_rail',
    category: 'rail',
    name: 'Melbourne Reefer Express Rail',
    description: 'Reefer container rail to Port of Melbourne Bass handoff.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'TAS'],
    baseProductivityPoints: 5.0,
    strategicNetworks: ['freight'],
    tags: ['trans_tasman', 'reefer_express', 'cold_chain_sea', 'intermodal'],
    trackKilometres: 52,
    dualTrackShare: 0.64,
    electrifiedShare: 0.72,
    designFreightTonnesPerYear: 9_800_000,
    passengerCapable: false,
  },
  {
    id: 'rail_nsw_hume_zet_spine',
    category: 'rail',
    name: 'Hume Zero-Emission Intermodal Spine',
    description: 'Electric truck–rail intermodal on Hume feed.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC', 'SA'],
    baseProductivityPoints: 4.8,
    strategicNetworks: ['freight'],
    tags: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul', 'intercapital'],
    trackKilometres: 180,
    dualTrackShare: 0.55,
    electrifiedShare: 0.62,
    designFreightTonnesPerYear: 11_200_000,
    passengerCapable: true,
  },
];

export const ROUND19_PORTS: PortAsset[] = [
  {
    id: 'port_wa_geraldton_magnet',
    category: 'port',
    name: 'Geraldton Rare-Earth Export',
    description: 'NdFeB magnet concentrate and oxide export berths.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'QLD'],
    baseProductivityPoints: 5.9,
    strategicNetworks: ['trade'],
    tags: ['rare_earth', 'magnet_export', 'ndfeb_supply', 'bulk'],
    berthCount: 3,
    maxDraftMetres: 13.0,
    teuCapacityPerYear: 140_000,
    automationLevel: 1,
    bulkShare: 0.64,
  },
  {
    id: 'port_tas_devonport_reefer',
    category: 'port',
    name: 'Devonport Reefer Express Terminal',
    description: 'Trans-Tasman cold-chain reefer and ferry handoff.',
    hostRegion: 'TAS',
    servedRegions: ['TAS', 'VIC'],
    baseProductivityPoints: 4.6,
    strategicNetworks: ['trade', 'freight'],
    tags: ['trans_tasman', 'reefer_express', 'cold_chain_sea', 'island'],
    berthCount: 2,
    maxDraftMetres: 11.5,
    teuCapacityPerYear: 110_000,
    automationLevel: 1,
    bulkShare: 0.08,
  },
  {
    id: 'port_sa_port_augusta_zet',
    category: 'port',
    name: 'Port Augusta ZET Logistics Berth',
    description: 'Zero-emission truck staging at Spencer Gulf.',
    hostRegion: 'SA',
    servedRegions: ['SA', 'NSW'],
    baseProductivityPoints: 4.2,
    strategicNetworks: ['freight'],
    tags: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul'],
    berthCount: 2,
    maxDraftMetres: 12.0,
    teuCapacityPerYear: 88_000,
    automationLevel: 0,
    bulkShare: 0.24,
  },
];

export const ROUND19_LOGISTICS: LogisticsNodeAsset[] = [
  {
    id: 'log_wa_kwinana_magnet_yard',
    category: 'logistics',
    name: 'Kwinana Magnet Staging Yard',
    description: 'Rare-earth oxide and magnet module consolidation.',
    hostRegion: 'WA',
    servedRegions: ['WA', 'QLD'],
    baseProductivityPoints: 4.7,
    strategicNetworks: ['trade', 'freight'],
    tags: ['rare_earth', 'magnet_export', 'ndfeb_supply'],
    warehouseSqm: 108_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 49,
  },
  {
    id: 'log_vic_melbourne_reefer_dc',
    category: 'logistics',
    name: 'Melbourne Reefer DC',
    description: 'Trans-Tasman reefer pre-cool and cross-dock.',
    hostRegion: 'VIC',
    servedRegions: ['VIC', 'TAS'],
    baseProductivityPoints: 4.5,
    strategicNetworks: ['freight'],
    tags: ['trans_tasman', 'reefer_express', 'cold_chain_sea'],
    warehouseSqm: 86_000,
    coldChainCapable: true,
    intermodalLinks: ['road', 'rail', 'port'],
    lastMileCoveragePct: 71,
  },
  {
    id: 'log_nsw_goulburn_zet_hub',
    category: 'logistics',
    name: 'Goulburn ZET Charging Hub',
    description: 'Battery-electric truck charging and freight stores.',
    hostRegion: 'NSW',
    servedRegions: ['NSW', 'VIC', 'SA'],
    baseProductivityPoints: 4.1,
    strategicNetworks: ['freight'],
    tags: ['zero_emission_truck', 'electric_freight_corridor', 'battery_electric_haul'],
    warehouseSqm: 62_000,
    coldChainCapable: false,
    intermodalLinks: ['road', 'rail'],
    lastMileCoveragePct: 55,
  },
];

export const SCALE_WAVE_ROUND19_ASSETS = [
  ...ROUND19_ROADS,
  ...ROUND19_RAIL,
  ...ROUND19_PORTS,
  ...ROUND19_LOGISTICS,
];


// --- source: catalog/all-catalog.ts ---

export function getAgent12TransportCatalog(): TransportAsset[] {
  return [
    ...ROAD_CATALOG,
    ...RAIL_CATALOG,
    ...PORT_CATALOG,
    ...LOGISTICS_CATALOG,
    ...SCALE_WAVE_ASSETS,
    ...SCALE_WAVE_ROUND2_ASSETS,
    ...SCALE_WAVE_ROUND3_ASSETS,
    ...SCALE_WAVE_ROUND4_ASSETS,
    ...SCALE_WAVE_ROUND5_ASSETS,
    ...SCALE_WAVE_ROUND6_ASSETS,
    ...SCALE_WAVE_ROUND7_ASSETS,
    ...SCALE_WAVE_ROUND8_ASSETS,
    ...SCALE_WAVE_ROUND9_ASSETS,
    ...SCALE_WAVE_ROUND10_ASSETS,
    ...SCALE_WAVE_ROUND11_ASSETS,
    ...SCALE_WAVE_ROUND12_ASSETS,
    ...SCALE_WAVE_ROUND13_ASSETS,
    ...SCALE_WAVE_ROUND14_ASSETS,
    ...SCALE_WAVE_ROUND15_ASSETS,
    ...SCALE_WAVE_ROUND16_ASSETS,
    ...SCALE_WAVE_ROUND17_ASSETS,
    ...SCALE_WAVE_ROUND18_ASSETS,
    ...SCALE_WAVE_ROUND19_ASSETS,
  ];
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


// --- source: network/evaluate-corridors.ts ---
  AuRegionCode,
  CorridorActivation,
  TransportAsset,
  TransportCorridorDefinition,
} from '../types.ts';

function assetMatchesTags(asset: TransportAsset, tags: string[]): boolean {
  return tags.some((t) => asset.tags.includes(t));
}

function regionSatisfied(
  region: AuRegionCode,
  requiredTags: string[] | undefined,
  operational: TransportAsset[],
): boolean {
  if (!requiredTags || requiredTags.length === 0) return operational.some((a) => a.hostRegion === region);
  return operational.some((a) => a.hostRegion === region && assetMatchesTags(a, requiredTags));
}

export function evaluateCorridorActivation(
  corridor: TransportCorridorDefinition,
  operationalAssets: TransportAsset[],
): CorridorActivation {
  const matchedRegions: AuRegionCode[] = [];
  const missingRegions: AuRegionCode[] = [];

  for (const region of corridor.regionSequence) {
    const tags = corridor.requiredTagsByRegion[region];
    if (regionSatisfied(region, tags, operationalAssets)) matchedRegions.push(region);
    else missingRegions.push(region);
  }

  const active = missingRegions.length === 0 && matchedRegions.length === corridor.regionSequence.length;

  return {
    corridorId: corridor.id,
    name: corridor.name,
    active,
    matchedRegions,
    missingRegions,
    synergyPoints: active ? corridor.productivitySynergyPoints : 0,
  };
}

export function evaluateAllCorridors(operationalAssets: TransportAsset[]): CorridorActivation[] {
  return TRANSPORT_CORRIDORS.map((c) => evaluateCorridorActivation(c, operationalAssets));
}

export function totalCorridorSynergy(activations: CorridorActivation[]): number {
  return activations.reduce((sum, a) => sum + a.synergyPoints, 0);
}

export function corridorLogisticsRelief(activations: CorridorActivation[]): number {
  let relief = 0;
  for (const activation of activations) {
    if (!activation.active) continue;
    const def = TRANSPORT_CORRIDORS.find((c) => c.id === activation.corridorId);
    if (def) relief += def.logisticsRelief;
  }
  return Math.min(0.25, relief);
}


// --- source: network/port-rail-coupling.ts ---

export function computePortRailCouplingByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const ports = new Map<AuRegionCode, number>();
  const rail = new Map<AuRegionCode, number>();

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      ports.set(asset.hostRegion, (ports.get(asset.hostRegion) ?? 0) + asset.baseProductivityPoints);
    }
    if (asset.category === 'rail') {
      rail.set(asset.hostRegion, (rail.get(asset.hostRegion) ?? 0) + asset.baseProductivityPoints * 0.85);
    }
  }

  const out = {} as Record<AuRegionCode, number>;
  const regions: AuRegionCode[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];
  for (const code of regions) {
    const p = ports.get(code) ?? 0;
    const r = rail.get(code) ?? 0;
    if (p <= 0 || r <= 0) {
      out[code] = Math.round(Math.min(p, r) * 2);
      continue;
    }
    const balance = Math.min(p, r) / Math.max(p, r);
    out[code] = Math.round(Math.min(100, (p + r) * 2.2 * (0.65 + balance * 0.35)));
  }
  return out;
}

export function nationalPortRailCouplingIndex(coupling: Record<AuRegionCode, number>): number {
  const vals = Object.values(coupling);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}


// --- source: network/resilience-score.ts ---

export function computeResilienceScoreByRegion(
  operationalAssets: TransportAsset[],
  corridorActivations: CorridorActivation[],
): Record<AuRegionCode, number> {
  const assetCounts = {} as Record<AuRegionCode, number>;
  const categorySets = {} as Record<AuRegionCode, Set<TransportAsset['category']>>;

  for (const code of AU_REGION_CODES) {
    assetCounts[code] = 0;
    categorySets[code] = new Set();
  }

  for (const asset of operationalAssets) {
    assetCounts[asset.hostRegion] += 1;
    categorySets[asset.hostRegion].add(asset.category);
    for (const served of asset.servedRegions) {
      if (served === asset.hostRegion) continue;
      assetCounts[served] += 0.35;
    }
  }

  const activeCorridorRegions = new Set<AuRegionCode>();
  for (const c of corridorActivations) {
    if (!c.active) continue;
    for (const r of c.matchedRegions) activeCorridorRegions.add(r);
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    const diversity = categorySets[code].size / 4;
    const density = Math.min(1, assetCounts[code] / 8);
    const corridorBoost = activeCorridorRegions.has(code) ? 0.18 : 0;
    const score = (35 + density * 35 + diversity * 25 + corridorBoost * 100) ;
    out[code] = Math.round(Math.min(100, score));
  }
  return out;
}

export function nationalResilienceIndex(scores: Record<AuRegionCode, number>): number {
  return AU_REGION_CODES.reduce((s, c) => s + scores[c], 0) / AU_REGION_CODES.length;
}


// --- source: network/cross-region-spillover.ts ---

/** Stylized productivity spillover when corridors serve multiple regions. */
const SPILLOVER: Partial<Record<AuRegionCode, Partial<Record<AuRegionCode, number>>>> = {
  NSW: { VIC: 0.12, QLD: 0.08, ACT: 0.15, SA: 0.05 },
  VIC: { NSW: 0.11, TAS: 0.14, SA: 0.09 },
  QLD: { NSW: 0.1, NT: 0.11 },
  WA: { SA: 0.13, NT: 0.06 },
  SA: { WA: 0.1, VIC: 0.08, NSW: 0.06 },
  TAS: { VIC: 0.18 },
  NT: { QLD: 0.09, WA: 0.07, SA: 0.05 },
  ACT: { NSW: 0.2 },
};

export function computeSpilloverBonusByRegion(
  operationalAssets: TransportAsset[],
  regionalProductivityBonus: Record<AuRegionCode, number>,
): Record<AuRegionCode, number> {
  const hostPoints = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) hostPoints[code] = 0;
  for (const asset of operationalAssets) {
    hostPoints[asset.hostRegion] += asset.baseProductivityPoints;
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    let bonus = 0;
    const edges = SPILLOVER[code];
    if (edges) {
      for (const [target, weight] of Object.entries(edges)) {
        const t = target as AuRegionCode;
        bonus += (regionalProductivityBonus[t] ?? 0) * weight * 0.08;
        bonus += hostPoints[t] * weight * 0.05;
      }
    }
    out[code] = Math.round(bonus * 100) / 100;
  }
  return out;
}


// --- source: network/freight-latency-index.ts ---

/** Stylized hours-to-clear-regional-freight backlog (lower is better). */
export function computeFreightLatencyByRegion(
  operationalAssets: TransportAsset[],
  networkUtilizationFreight: number,
): Record<AuRegionCode, number> {
  const capacity = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) capacity[code] = 0.5;

  for (const asset of operationalAssets) {
    let units = asset.baseProductivityPoints;
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      units += asset.laneKilometres / 400;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      units += asset.trackKilometres / 250;
    }
    if (asset.category === 'port' && 'teuCapacityPerYear' in asset) {
      units += asset.teuCapacityPerYear / 800_000;
    }
    if (asset.category === 'logistics' && 'warehouseSqm' in asset) {
      units += asset.warehouseSqm / 120_000;
    }
    capacity[asset.hostRegion] += units;
  }

  const stress = clamp(networkUtilizationFreight, 0.05, 1.2);
  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    const hours = (18 / Math.max(1.2, capacity[code])) * (0.65 + stress * 0.55);
    out[code] = Math.round(hours * 100) / 100;
  }
  return out;
}

export function nationalMedianFreightLatency(byRegion: Record<AuRegionCode, number>): number {
  const sorted = AU_REGION_CODES.map((c) => byRegion[c]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}


// --- source: network/intercapital-connectivity.ts ---

/** 0–1 score from active multi-region corridors (intercapital / interstate chains). */
export function computeIntercapitalConnectivityIndex(
  activations: CorridorActivation[],
  definitions: TransportCorridorDefinition[],
): number {
  const defById = new Map(definitions.map((d) => [d.id, d]));
  let weighted = 0;
  let activeMulti = 0;

  for (const act of activations) {
    if (!act.active) continue;
    const def = defById.get(act.corridorId);
    if (!def || def.regionSequence.length < 2) continue;
    activeMulti += 1;
    weighted += act.synergyPoints + def.regionSequence.length * 0.35;
  }

  const density = activeMulti / Math.max(1, definitions.filter((d) => d.regionSequence.length >= 2).length);
  const raw = weighted * 0.012 + density * 0.45;
  return Math.round(clamp(raw, 0.12, 0.98) * 1000) / 1000;
}

export function connectivityBonusByRegion(
  activations: CorridorActivation[],
  definitions: TransportCorridorDefinition[],
): Record<AuRegionCode, number> {
  const defById = new Map(definitions.map((d) => [d.id, d]));
  const bonus = {} as Record<AuRegionCode, number>;
  for (const code of ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as AuRegionCode[]) {
    bonus[code] = 0;
  }

  for (const act of activations) {
    if (!act.active) continue;
    const def = defById.get(act.corridorId);
    if (!def || def.regionSequence.length < 2) continue;
    const share = act.synergyPoints / def.regionSequence.length;
    for (const region of def.regionSequence) {
      bonus[region] += share * 0.08;
    }
  }
  return bonus;
}


// --- source: network/container-throughput-index.ts ---

/** 0–100 normalized container handling capacity from ports and linked logistics. */
export function computeContainerThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port' && 'teuCapacityPerYear' in asset) {
      const teuScore = asset.teuCapacityPerYear / 45_000;
      const autoBoost = 1 + asset.automationLevel * 0.08;
      byRegion[asset.hostRegion] += teuScore * autoBoost;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += teuScore * 0.18;
      }
    }
    if (asset.category === 'logistics' && asset.intermodalLinks.includes('port')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 180_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalContainerThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.65 + max * 0.35;
  return Math.round(clamp(composite, 8, 98) * 10) / 10;
}


// --- source: network/bulk-export-throughput-index.ts ---

/** 0–100 normalized bulk export handling (iron ore, grain, coal, LNG feed). */
export function computeBulkExportThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port' && 'bulkShare' in asset) {
      const bulkScore = (asset.bulkShare * asset.teuCapacityPerYear) / 120_000;
      const draftBoost = 1 + Math.min(0.12, (asset.maxDraftMetres - 10) * 0.02);
      byRegion[asset.hostRegion] += bulkScore * draftBoost;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += bulkScore * 0.14;
      }
    }
    if (asset.category === 'rail' && asset.tags.some((t) => t === 'bulk' || t === 'heavy_haul' || t === 'mining')) {
      const haulScore = asset.designFreightTonnesPerYear / 8_000_000;
      byRegion[asset.hostRegion] += haulScore * (0.5 + asset.dualTrackShare * 0.5);
    }
    if (asset.category === 'road' && asset.tags.includes('bulk') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 900;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalBulkExportThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.55 + max * 0.45;
  return Math.round(clamp(composite, 6, 96) * 10) / 10;
}


// --- source: network/aviation-cargo-throughput-index.ts ---

/** 0–100 normalized air-cargo handling (perishables, express, e-commerce feed). */
export function computeAviationCargoThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const airTagged =
      asset.tags.some((t) => t === 'air' || t === 'air_freight' || t === 'cargo_terminal') ||
      (asset.category === 'logistics' && asset.intermodalLinks.includes('air'));

    if (!airTagged) continue;

    if (asset.category === 'logistics') {
      const hubScore = asset.warehouseSqm / 85_000 + asset.lastMileCoveragePct / 120;
      byRegion[asset.hostRegion] += hubScore * 1.4;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += hubScore * 0.12;
      }
    }
    if (asset.category === 'port' && asset.tags.some((t) => t === 'air_freight' || t === 'gateway')) {
      const portScore = (asset.teuCapacityPerYear / 180_000) * (0.35 + asset.automationLevel * 0.12);
      byRegion[asset.hostRegion] += portScore;
    }
    if (asset.category === 'road' && asset.tags.includes('air_freight') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 700;
    }
    if (asset.category === 'rail' && asset.tags.includes('air_freight')) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 4_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAviationCargoThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.5 + max * 0.5;
  return Math.round(clamp(composite, 4, 92) * 10) / 10;
}


// --- source: network/coastal-shipping-throughput-index.ts ---

/** 0–100 short-sea / coastal shipping throughput (roro, feeder, island supply). */
export function computeCoastalShippingThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const coastalTagged =
      asset.tags.some((t) => t === 'coastal_shipping' || t === 'short_sea' || t === 'roro' || t === 'island') ||
      (asset.category === 'port' && asset.tags.includes('feeder'));

    if (!coastalTagged) continue;

    if (asset.category === 'port') {
      const roroBoost = asset.tags.includes('roro') ? 1.15 : 1;
      byRegion[asset.hostRegion] +=
        (asset.berthCount * 2.4 + asset.teuCapacityPerYear / 160_000) * roroBoost * (0.4 + asset.bulkShare * 0.35);
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 1.8;
      }
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 5_500_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 650;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000 + asset.lastMileCoveragePct / 140;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCoastalShippingThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  const composite = avg * 0.55 + max * 0.45;
  return Math.round(clamp(composite, 3, 90) * 10) / 10;
}

export function coastalShippingProductivityMultiplier(
  throughputIndex: number,
  policy: CoastalShippingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'short_sea_boost' ? 0.045 : 0;
  const normalized = (throughputIndex - 14) / 100;
  return clamp(1 + normalized * 0.055 + policyBoost, 0.93, 1.11);
}


// --- source: network/deep-sea-gateway-throughput-index.ts ---

/** 0–100 deep-sea gateway throughput (mega-container berths, tradelane feeders). */
export function computeDeepSeaGatewayThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const deepSeaTagged =
      asset.tags.some((t) => t === 'deep_sea' || t === 'tradelane' || t === 'mega_container') ||
      (asset.category === 'port' && asset.maxDraftMetres >= 14.5 && asset.teuCapacityPerYear >= 400_000);

    if (!deepSeaTagged) continue;

    if (asset.category === 'port') {
      const draftBoost = 1 + Math.min(0.12, (asset.maxDraftMetres - 13) * 0.02);
      byRegion[asset.hostRegion] +=
        (asset.berthCount * 2.8 + asset.teuCapacityPerYear / 140_000) * draftBoost * (0.5 + asset.automationLevel * 0.08);
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 2.1;
      }
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 4_800_000;
    }
    if (asset.category === 'logistics' && asset.tags.includes('tradelane')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000;
    }
    if (asset.category === 'road' && asset.tags.includes('deep_sea') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 580;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDeepSeaGatewayThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 5, 92) * 10) / 10;
}

export function deepSeaGatewayProductivityMultiplier(
  throughputIndex: number,
  policy: DeepSeaGatewayPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.042 : 0;
  const normalized = (throughputIndex - 16) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.93, 1.11);
}


// --- source: network/defence-logistics-readiness-index.ts ---

/** 0–100 defence logistics readiness (strategic mobility, surge capacity). */
export function computeDefenceLogisticsReadinessByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const defenceTagged =
      asset.tags.some((t) => t === 'defence_logistics' || t === 'strategic_mobility' || t === 'military_freight') ||
      asset.linkedProjectType === 'remote_logistics_base';

    if (!defenceTagged) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_500_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.9 + asset.teuCapacityPerYear / 320_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + asset.lastMileCoveragePct / 130;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDefenceLogisticsReadinessIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 4, 88) * 10) / 10;
}

export function defenceLogisticsProductivityMultiplier(
  readinessIndex: number,
  policy: DefenceMobilityPolicy = 'baseline',
): number {
  const policyBoost = policy === 'mobilize' ? 0.044 : 0;
  const normalized = (readinessIndex - 10) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.93, 1.11);
}


// --- source: network/critical-minerals-export-index.ts ---

/** 0–100 critical-minerals export throughput (lithium, rare earth, battery feedstock). */
export function computeCriticalMineralsExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const mineralTagged =
      asset.tags.some(
        (t) => t === 'critical_minerals' || t === 'lithium' || t === 'rare_earth' || t === 'battery_feedstock',
      ) || (asset.category === 'port' && asset.tags.includes('bulk') && asset.bulkShare > 0.55);

    if (!mineralTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.bulkShare * (asset.berthCount * 2.2 + asset.teuCapacityPerYear / 200_000);
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 6_200_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 720;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 95_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCriticalMineralsExportIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 3, 90) * 10) / 10;
}

export function criticalMineralsProductivityMultiplier(
  exportIndex: number,
  policy: CriticalMineralsPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.043 : 0;
  const normalized = (exportIndex - 11) / 100;
  return clamp(1 + normalized * 0.054 + policyBoost, 0.93, 1.11);
}


// --- source: network/gauge-interoperability-index.ts ---

/** 0–100 rail gauge interoperability (standard gauge handoff, break-of-gauge relief). */
export function computeGaugeInteroperabilityByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const gaugeTagged =
      asset.tags.some(
        (t) => t === 'gauge_break' || t === 'standard_gauge' || t === 'interoperability' || t === 'gauge_standard',
      ) || (asset.category === 'rail' && asset.tags.includes('intermodal'));

    if (!gaugeTagged) continue;

    if (asset.category === 'rail' && 'dualTrackShare' in asset) {
      byRegion[asset.hostRegion] +=
        asset.dualTrackShare * 18 + asset.trackKilometres / 45 + asset.electrifiedShare * 6;
    }
    if (asset.category === 'logistics' && asset.intermodalLinks.includes('rail')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 110_000 + asset.intermodalLinks.length * 1.8;
    }
    if (asset.category === 'port' && asset.tags.includes('intermodal')) {
      byRegion[asset.hostRegion] += asset.berthCount * 1.5;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalGaugeInteroperabilityIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 5, 88) * 10) / 10;
}

export function gaugeInteroperabilityProductivityMultiplier(
  interoperabilityIndex: number,
  policy: GaugeInteroperabilityPolicy = 'baseline',
): number {
  const policyBoost = policy === 'harmonize' ? 0.044 : 0;
  const normalized = (interoperabilityIndex - 14) / 100;
  return clamp(1 + normalized * 0.051 + policyBoost, 0.93, 1.11);
}


// --- source: network/agricultural-export-throughput-index.ts ---

/** 0–100 agricultural export throughput (grain, livestock feed, harvest corridors). */
export function computeAgriculturalExportThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const agTagged =
      asset.tags.some(
        (t) => t === 'grain_export' || t === 'agricultural_bulk' || t === 'harvest_corridor' || t === 'grain',
      ) || (asset.category === 'port' && asset.tags.includes('grain'));

    if (!agTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.bulkShare * (asset.berthCount * 2 + asset.teuCapacityPerYear / 250_000);
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 5_500_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 680;
    }
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000 + 1.5;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAgriculturalExportThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 4, 88) * 10) / 10;
}

export function agriculturalExportProductivityMultiplier(
  throughputIndex: number,
  policy: AgriculturalExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.043 : 0;
  const normalized = (throughputIndex - 10) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.93, 1.11);
}


// --- source: network/pacific-feeder-tradelane-index.ts ---

/** 0–100 Pacific feeder / island tradelane throughput. */
export function computePacificFeederThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const pacificTagged =
      asset.tags.some(
        (t) => t === 'pacific_feeder' || t === 'island_feeder' || t === 'tradelane_pacific' || t === 'pacific_islands',
      ) || (asset.category === 'port' && asset.tags.includes('feeder'));

    if (!pacificTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.3 + asset.teuCapacityPerYear / 170_000;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 1.6;
      }
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 98_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 750;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalPacificFeederThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.53 + max * 0.47, 3, 82) * 10) / 10;
}

export function pacificFeederProductivityMultiplier(
  throughputIndex: number,
  policy: PacificFeederPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.042 : 0;
  const normalized = (throughputIndex - 8) / 100;
  return clamp(1 + normalized * 0.051 + policyBoost, 0.93, 1.11);
}


// --- source: network/offshore-wind-logistics-index.ts ---

/** 0–100 offshore wind staging and turbine logistics throughput by region. */
export function computeOffshoreWindLogisticsByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const windTagged =
      asset.tags.some(
        (t) =>
          t === 'offshore_wind' ||
          t === 'wind_farm_logistics' ||
          t === 'turbine_staging' ||
          t === 'offshore_staging',
      ) || (asset.category === 'port' && asset.tags.includes('renewable_export'));

    if (!windTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1 + asset.teuCapacityPerYear / 190_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + (asset.intermodalLinks.includes('port') ? 2.4 : 1);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 820;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalOffshoreWindLogisticsIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 78) * 10) / 10;
}

export function offshoreWindLogisticsProductivityMultiplier(
  index: number,
  policy: OffshoreWindLogisticsPolicy = 'baseline',
): number {
  const policyBoost = policy === 'deploy' ? 0.044 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.049 + policyBoost, 0.93, 1.12);
}


// --- source: network/subsea-cable-landing-index.ts ---

/** 0–100 subsea cable landing and digital trade throughput by region. */
export function computeSubseaCableLandingByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const cableTagged =
      asset.tags.some(
        (t) => t === 'subsea_cable' || t === 'cable_landing' || t === 'digital_trade',
      ) || (asset.category === 'port' && asset.tags.includes('telecom_landing'));

    if (!cableTagged) continue;

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6 + asset.teuCapacityPerYear / 220_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 118_000 + (asset.intermodalLinks.includes('port') ? 2.1 : 0.8);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 940;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 14_500_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSubseaCableLandingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.42 + max * 0.58, 4, 72) * 10) / 10;
}

export function subseaCableLandingProductivityMultiplier(
  index: number,
  policy: SubseaCableLandingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'expand' ? 0.041 : 0;
  const normalized = (index - 5) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}


// --- source: network/lithium-brine-export-index.ts ---

/** 0–100 lithium brine and battery feedstock export throughput by region. */
export function computeLithiumBrineExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const brineTagged = asset.tags.some(
      (t) => t === 'lithium_brine' || t === 'brine_export' || t === 'battery_feedstock',
    );
    if (!brineTagged) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 780 + asset.freightShare * 4.2;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 11_800_000 + asset.trackKilometres / 620;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.9 + asset.bulkShare * 6.2;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + (asset.intermodalLinks.includes('rail') ? 1.6 : 0.7);
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalLithiumBrineExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.44 + max * 0.56, 5, 74) * 10) / 10;
}

export function lithiumBrineExportProductivityMultiplier(
  index: number,
  policy: LithiumBrineExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.042 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.049 + policyBoost, 0.93, 1.11);
}


// --- source: network/rare-earth-magnet-export-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type RareEarthMagnetExportPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 rare-earth magnet export throughput by region. */
export function computeRareEarthMagnetExportByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    const tagged = asset.tags.some(
      (t) => t === 'rare_earth' || t === 'magnet_export' || t === 'ndfeb_supply',
    );
    if (!tagged) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 720 + asset.freightShare * 3.8;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 10_500_000 + asset.trackKilometres / 580;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.7 + asset.bulkShare * 5.8;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 102_000 + (asset.coldChainCapable ? 1.2 : 0.5);
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalRareEarthMagnetExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.45 + max * 0.55, 5, 76) * 10) / 10;
}

export function rareEarthMagnetExportProductivityMultiplier(
  index: number,
  policy: RareEarthMagnetExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.043 : 0;
  const normalized = (index - 6) / 100;
  return clamp(1 + normalized * 0.048 + policyBoost, 0.93, 1.11);
}


// --- source: climate/apply-climate-band.ts ---

export function applyClimateBandToInputs(
  inputs: TransportProductivityInputs,
  band: ClimateTransportBand | undefined,
): { inputs: TransportProductivityInputs; climateModifierFactor: number } {
  if (!band || band === 'mild') {
    return { inputs, climateModifierFactor: 1 };
  }

  const add = CLIMATE_BAND_UTILIZATION[band];
  const networkUtilization = {
    ...(inputs.networkUtilization ?? {}),
    freight: Math.min(1.25, (inputs.networkUtilization?.freight ?? 0) + add),
    mobility: Math.min(1.25, (inputs.networkUtilization?.mobility ?? 0) + add * 0.5),
  };

  const conditionByAssetId = new Map(inputs.conditionByAssetId ?? []);
  if (band === 'hot' || band === 'extreme') {
    for (const asset of inputs.assets) {
      if (!inputs.operationalAssetIds.has(asset.id)) continue;
      if (asset.category !== 'road' && asset.category !== 'rail') continue;
      const prior = conditionByAssetId.get(asset.id) ?? 'good';
      conditionByAssetId.set(asset.id, worsenCondition(prior, 1));
    }
  }

  return {
    inputs: { ...inputs, networkUtilization, conditionByAssetId },
    climateModifierFactor: climateModifierFactor(band),
  };
}


// --- source: scenarios/apply-transport-scenarios.ts ---
  StrategicNetworkKind,
  TransportAsset,
  TransportAssetCategory,
  TransportAssetCondition,
  TransportProductivityInputs,
  TransportStressScenario,
} from '../types.ts';

function mergeUtilization(
  base: Partial<Record<StrategicNetworkKind, number>> | undefined,
  kind: StrategicNetworkKind | undefined,
  add: number,
): Partial<Record<StrategicNetworkKind, number>> {
  const out = { ...(base ?? {}) };
  if (!kind) return out;
  out[kind] = Math.min(1.25, (out[kind] ?? 0) + add);
  return out;
}

function assetMatchesScenario(asset: TransportAsset, scenario: TransportStressScenario): boolean {
  if (!scenario.targetRegions.includes(asset.hostRegion)) return false;
  if (scenario.affectedCategories && !scenario.affectedCategories.includes(asset.category)) return false;
  if (scenario.networkKind && !asset.strategicNetworks.includes(scenario.networkKind)) return false;
  return true;
}

export function resolveActiveScenarios(activeScenarioIds: ReadonlySet<string> | undefined): TransportStressScenario[] {
  if (!activeScenarioIds || activeScenarioIds.size === 0) return [];
  const out: TransportStressScenario[] = [];
  for (const id of activeScenarioIds) {
    const s = getScenarioById(id);
    if (s) out.push(s);
  }
  return out;
}

export function applyScenariosToInputs(
  base: TransportProductivityInputs,
  scenarios: TransportStressScenario[],
): TransportProductivityInputs {
  if (scenarios.length === 0) return base;

  let networkUtilization = base.networkUtilization;
  const conditionByAssetId = new Map<string, TransportAssetCondition>(base.conditionByAssetId ?? []);

  for (const scenario of scenarios) {
    networkUtilization = mergeUtilization(networkUtilization, scenario.networkKind, scenario.utilizationAdd);
    if (scenario.conditionPenaltySteps <= 0) continue;
    for (const asset of base.assets) {
      if (!base.operationalAssetIds.has(asset.id)) continue;
      if (!assetMatchesScenario(asset, scenario)) continue;
      const prior = conditionByAssetId.get(asset.id) ?? 'good';
      conditionByAssetId.set(asset.id, worsenCondition(prior, scenario.conditionPenaltySteps));
    }
  }

  return {
    ...base,
    networkUtilization,
    conditionByAssetId,
  };
}

export function enrichInputsWithScenarios(
  base: TransportProductivityInputs,
  activeScenarioIds: ReadonlySet<string> | undefined,
): { inputs: TransportProductivityInputs; appliedScenarioIds: string[] } {
  const scenarios = resolveActiveScenarios(activeScenarioIds);
  return {
    inputs: applyScenariosToInputs(base, scenarios),
    appliedScenarioIds: scenarios.map((s) => s.id),
  };
}

export function listScenarioIds(): string[] {
  return TRANSPORT_STRESS_SCENARIOS.map((s) => s.id);
}


// --- source: scenarios/scenario-stack-policy.ts ---

/** Additional utilization when multiple scenarios overlap (cap applied downstream). */
export function computeScenarioStackFactor(scenarios: TransportStressScenario[]): number {
  if (scenarios.length <= 1) return 1;
  return 1 + Math.min(0.35, (scenarios.length - 1) * 0.08);
}

export function applyScenarioStackToUtilization(
  utilization: Partial<Record<'freight' | 'trade' | 'mobility', number>> | undefined,
  stackFactor: number,
): Partial<Record<'freight' | 'trade' | 'mobility', number>> {
  if (stackFactor <= 1 || !utilization) return utilization ?? {};
  const out = { ...utilization };
  for (const key of ['freight', 'trade', 'mobility'] as const) {
    if (out[key] != null) out[key] = Math.min(1.25, out[key]! * stackFactor);
  }
  return out;
}


// --- source: operations/maintenance-decay.ts ---
/**
 * Projects maintenance backlog one turn forward from utilization + spend.
 */
export function projectMaintenanceBacklogNextTurn(
  current: ReadonlyMap<string, number> | undefined,
  operationalAssetIds: ReadonlySet<string>,
  options: {
    networkStress: number;
    maintenanceSpendIndex?: number;
  },
): Record<string, number> {
  const out: Record<string, number> = {};
  const spend = Math.max(0, Math.min(100, options.maintenanceSpendIndex ?? 40));
  const relief = spend / 200;
  const drift = 1.2 + Math.max(0, options.networkStress) * 2.5;

  for (const assetId of operationalAssetIds) {
    const base = current?.get(assetId) ?? 18;
    const next = Math.min(100, Math.max(0, base + drift - relief));
    out[assetId] = Math.round(next * 10) / 10;
  }
  return out;
}

export function aggregateNetworkStress(
  utilization: Partial<Record<'freight' | 'trade' | 'mobility', number>> | undefined,
): number {
  if (!utilization) return 0;
  const vals = [utilization.freight ?? 0, utilization.trade ?? 0, utilization.mobility ?? 0];
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}


// --- source: operations/investment-pipeline.ts ---

export interface TransportPipelineStage {
  id: string;
  label: string;
  regionId: AuRegionCode;
  requiredFunding: number;
  productivityUnlock: number;
  logisticsRelief: number;
}

export const TRANSPORT_INVESTMENT_PIPELINE: TransportPipelineStage[] = [
  {
    id: 'pipe_nsw_botany_rail',
    label: 'Port Botany Rail Duplication',
    regionId: 'NSW',
    requiredFunding: 120_000,
    productivityUnlock: 4.5,
    logisticsRelief: 0.025,
  },
  {
    id: 'pipe_vic_inland_port_shuttle',
    label: 'Melbourne Port Rail Shuttle Expansion',
    regionId: 'VIC',
    requiredFunding: 95_000,
    productivityUnlock: 3.8,
    logisticsRelief: 0.022,
  },
  {
    id: 'pipe_qld_inland_rail_stage',
    label: 'Inland Rail Stage Completion',
    regionId: 'QLD',
    requiredFunding: 200_000,
    productivityUnlock: 6.2,
    logisticsRelief: 0.035,
  },
  {
    id: 'pipe_wa_hedland_road',
    label: 'Pilbara Last-Mile Road Hardening',
    regionId: 'WA',
    requiredFunding: 80_000,
    productivityUnlock: 3.2,
    logisticsRelief: 0.02,
  },
  {
    id: 'pipe_sa_gillman_upgrade',
    label: 'Gillman Intermodal Upgrade',
    regionId: 'SA',
    requiredFunding: 65_000,
    productivityUnlock: 2.8,
    logisticsRelief: 0.018,
  },
];

export function computePipelineUnlocks(
  fundedStageIds: ReadonlySet<string> | undefined,
): { productivityPoints: number; logisticsRelief: number; activeStageIds: string[] } {
  if (!fundedStageIds || fundedStageIds.size === 0) {
    return { productivityPoints: 0, logisticsRelief: 0, activeStageIds: [] };
  }
  let productivityPoints = 0;
  let logisticsRelief = 0;
  const activeStageIds: string[] = [];
  for (const stage of TRANSPORT_INVESTMENT_PIPELINE) {
    if (!fundedStageIds.has(stage.id)) continue;
    activeStageIds.push(stage.id);
    productivityPoints += stage.productivityUnlock;
    logisticsRelief += stage.logisticsRelief;
  }
  return {
    productivityPoints,
    logisticsRelief: Math.min(0.12, logisticsRelief),
    activeStageIds,
  };
}


// --- source: operations/disruption-recovery.ts ---

export interface DisruptionRecoverySnapshot {
  /** 0–1 headroom absorbing bottleneck shocks without productivity collapse. */
  nationalRecoveryFactor: number;
  logisticsHubCount: number;
  coldChainHubCount: number;
}

export function computeDisruptionRecovery(
  operationalAssets: TransportAsset[],
  resilienceScoreByRegion: Record<AuRegionCode, number>,
  bottleneckCount: number,
): DisruptionRecoverySnapshot {
  let logisticsHubCount = 0;
  let coldChainHubCount = 0;
  for (const asset of operationalAssets) {
    if (asset.category !== 'logistics') continue;
    logisticsHubCount += 1;
    if ('coldChainCapable' in asset && asset.coldChainCapable) coldChainHubCount += 1;
  }

  const avgResilience =
    AU_REGION_CODES.reduce((s, c) => s + (resilienceScoreByRegion[c] ?? 0), 0) / AU_REGION_CODES.length;

  const hubBoost = Math.min(0.25, logisticsHubCount * 0.012 + coldChainHubCount * 0.008);
  const bottleneckPenalty = Math.min(0.35, bottleneckCount * 0.04);
  const nationalRecoveryFactor = clamp(0.35 + avgResilience * 0.4 + hubBoost - bottleneckPenalty, 0.15, 0.95);

  return { nationalRecoveryFactor, logisticsHubCount, coldChainHubCount };
}


// --- source: operations/last-mile-coverage.ts ---

export function computeLastMileCoverageByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const weight = {} as Record<AuRegionCode, number>;
  const weightedPct = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    weight[code] = 0;
    weightedPct[code] = 0;
  }

  for (const asset of operationalAssets) {
    if (asset.category !== 'logistics' || !('lastMileCoveragePct' in asset)) continue;
    const w = Math.max(1, asset.warehouseSqm / 50_000);
    weight[asset.hostRegion] += w;
    weightedPct[asset.hostRegion] += asset.lastMileCoveragePct * w;
    for (const served of asset.servedRegions) {
      if (served === asset.hostRegion) continue;
      const spill = w * 0.35;
      weight[served] += spill;
      weightedPct[served] += asset.lastMileCoveragePct * spill * 0.85;
    }
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    if (weight[code] <= 0) {
      out[code] = 42;
      continue;
    }
    out[code] = Math.round(clamp(weightedPct[code] / weight[code], 25, 95));
  }
  return out;
}

export function nationalLastMileCoverage(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const sum = values.reduce((a, b) => a + b, 0);
  return Math.round((sum / values.length) * 10) / 10;
}


// --- source: operations/cold-chain-reliability.ts ---

/** 0–1 reliability score from cold-chain logistics and refrigerated port share. */
export function computeColdChainReliabilityByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0.35])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      const sqmFactor = clamp(asset.warehouseSqm / 250_000, 0.15, 1);
      const linkBonus = asset.intermodalLinks.length * 0.04;
      byRegion[asset.hostRegion] += 0.12 * sqmFactor + linkBonus;
      for (const r of asset.servedRegions) {
        if (r !== asset.hostRegion) byRegion[r] += 0.04 * sqmFactor;
      }
    }
    if (asset.category === 'port' && asset.bulkShare < 0.55) {
      byRegion[asset.hostRegion] += 0.06;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0.2, 0.98) * 1000) / 1000;
  }
  return byRegion;
}

export function nationalColdChainReliabilityIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const sorted = [...values].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0.5;
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  return Math.round(clamp(median * 0.55 + avg * 0.45, 0.25, 0.96) * 1000) / 1000;
}


// --- source: operations/intermodal-dwell-index.ts ---

/**
 * Normalized intermodal dwell pressure (0 = efficient handoffs, 100 = severe queueing).
 * Higher logistics–port–rail linkage without capacity lowers dwell scores.
 */
export function computeIntermodalDwellByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 22])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const linkCount = asset.intermodalLinks.length;
      const baseDwell = 18 - linkCount * 2.5 + (100 - asset.lastMileCoveragePct) * 0.08;
      byRegion[asset.hostRegion] += baseDwell * 0.35;
    }
    if (asset.category === 'port' && 'automationLevel' in asset) {
      const autoRelief = asset.automationLevel * 4;
      byRegion[asset.hostRegion] -= autoRelief;
    }
    if (asset.category === 'rail' && asset.passengerCapable && asset.designFreightTonnesPerYear > 2_000_000) {
      byRegion[asset.hostRegion] += 6 * freightUtilization;
    }
  }

  const stress = clamp(freightUtilization, 0.05, 1.15);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (0.85 + stress * 0.3), 4, 88) * 10) / 10;
  }
  return byRegion;
}

export function nationalIntermodalDwellMedian(
  byRegion: Record<AuRegionCode, number>,
): number {
  const sorted = AU_REGION_CODES.map((c) => byRegion[c]).sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  return Math.round(clamp(median, 8, 72) * 10) / 10;
}

export function dwellProductivityPenalty(dwellMedian: number): number {
  return clamp(1 - (dwellMedian - 28) * 0.004, 0.88, 1.04);
}


// --- source: operations/customs-clearance-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type CustomsModernizationPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 customs clearance efficiency (higher = faster border / gateway processing). */
export function computeCustomsClearanceByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 42])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port' && (asset.tags.includes('gateway') || asset.tags.includes('container'))) {
      const draftBoost = 1 + Math.min(0.1, (asset.maxDraftMetres - 11) * 0.015);
      const autoBoost = 1 + asset.automationLevel * 0.06;
      byRegion[asset.hostRegion] += (asset.berthCount * 1.8 + asset.teuCapacityPerYear / 220_000) * draftBoost * autoBoost;
    }
    if (
      asset.category === 'logistics' &&
      (asset.tags.includes('gateway') || asset.tags.includes('customs') || asset.tags.includes('cargo_terminal'))
    ) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 95_000 + asset.intermodalLinks.length * 2.2;
    }
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      byRegion[asset.hostRegion] += 1.5;
    }
  }

  const utilDrag = clamp(freightUtilization, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.02 - utilDrag * 0.08), 18, 96) * 10) / 10;
  }
  return byRegion;
}

export function nationalCustomsClearanceIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 88) * 10) / 10;
}

export function customsClearanceProductivityMultiplier(
  clearanceIndex: number,
  policy: CustomsModernizationPolicy = 'baseline',
): number {
  const policyBoost = policy === 'digitize' ? 0.05 : 0;
  const normalized = (clearanceIndex - 45) / 100;
  return clamp(1 + normalized * 0.06 + policyBoost, 0.92, 1.1);
}


// --- source: operations/biosecurity-clearance-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type BiosecurityStreamlinePolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 biosecurity / quarantine clearance efficiency (higher = faster ag & bulk inspections). */
export function computeBiosecurityClearanceByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 38])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.category === 'port' &&
      (asset.tags.includes('biosecurity') ||
        asset.tags.includes('quarantine') ||
        asset.tags.includes('grain') ||
        asset.bulkShare > 0.45)
    ) {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6 + asset.bulkShare * 12 + asset.automationLevel * 1.8;
    }
    if (
      asset.category === 'logistics' &&
      (asset.tags.includes('biosecurity') || asset.tags.includes('quarantine') || asset.coldChainCapable)
    ) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + (asset.coldChainCapable ? 2.2 : 0);
    }
    if (asset.category === 'road' && asset.tags.includes('biosecurity') && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 420;
    }
  }

  const utilDrag = clamp(freightUtilization, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.01 - utilDrag * 0.07), 16, 94) * 10) / 10;
  }
  return byRegion;
}

export function nationalBiosecurityClearanceIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 20, 86) * 10) / 10;
}

export function biosecurityClearanceProductivityMultiplier(
  clearanceIndex: number,
  policy: BiosecurityStreamlinePolicy = 'baseline',
): number {
  const policyBoost = policy === 'preclear' ? 0.048 : 0;
  const normalized = (clearanceIndex - 42) / 100;
  return clamp(1 + normalized * 0.055 + policyBoost, 0.91, 1.1);
}


// --- source: operations/infrastructure-permitting-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type PermittingStreamlinePolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 infrastructure permitting velocity (higher = faster project approvals). */
export function computeInfrastructurePermittingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 36])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('permitting') || asset.tags.includes('planning') || asset.tags.includes('approval_hub')) {
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + asset.intermodalLinks.length * 1.6;
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 380;
      }
    }
    if (asset.linkedProjectType && asset.baseProductivityPoints >= 5) {
      byRegion[asset.hostRegion] += 1.8;
    }
    if (asset.category === 'port' && asset.automationLevel >= 2) {
      byRegion[asset.hostRegion] += 1.2;
    }
  }

  const stressDrag = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stressDrag * 0.06), 18, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalInfrastructurePermittingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 86) * 10) / 10;
}

export function infrastructurePermittingProductivityMultiplier(
  permittingIndex: number,
  policy: PermittingStreamlinePolicy = 'baseline',
): number {
  const policyBoost = policy === 'fast_track' ? 0.046 : 0;
  const normalized = (permittingIndex - 44) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.1);
}


// --- source: operations/weather-resilience-routing-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type WeatherResiliencePolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 weather-resilience routing capacity (flood bypass, heat routing). */
export function computeWeatherResilienceRoutingByRegion(
  operationalAssets: TransportAsset[],
  climateStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 34])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('weather_resilience') ||
      asset.tags.includes('flood_bypass') ||
      asset.tags.includes('heat_routing')
    ) {
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 360 + asset.designSpeedKmh / 55;
      }
      if (asset.category === 'rail' && 'trackKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.trackKilometres / 280 + asset.dualTrackShare * 8;
      }
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 115_000 + 2.5;
      }
    }
    if (asset.category === 'port' && asset.tags.includes('weather_resilience')) {
      byRegion[asset.hostRegion] += asset.berthCount * 2.2 + asset.maxDraftMetres;
    }
  }

  const stress = clamp(climateStress, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.05), 16, 94) * 10) / 10;
  }
  return byRegion;
}

export function nationalWeatherResilienceRoutingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 20, 86) * 10) / 10;
}

export function weatherResilienceProductivityMultiplier(
  routingIndex: number,
  policy: WeatherResiliencePolicy = 'baseline',
): number {
  const policyBoost = policy === 'harden' ? 0.047 : 0;
  const normalized = (routingIndex - 40) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.92, 1.1);
}


// --- source: operations/channel-maintenance-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type ChannelMaintenancePolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 channel maintenance readiness (dredging, pilotage, draft windows). */
export function computeChannelMaintenanceByRegion(
  operationalAssets: TransportAsset[],
  tradeUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 37])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      const channelScore =
        asset.maxDraftMetres * 2.4 + asset.berthCount * 1.7 + asset.automationLevel * 2.1;
      if (
        asset.tags.includes('dredging') ||
        asset.tags.includes('pilotage') ||
        asset.tags.includes('channel_depth')
      ) {
        byRegion[asset.hostRegion] += channelScore * 0.35;
      } else {
        byRegion[asset.hostRegion] += channelScore * 0.12;
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('pilotage')) {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 100_000 + 2;
    }
  }

  const utilDrag = clamp(tradeUtilization, 0.05, 1.2);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.02 - utilDrag * 0.06), 18, 93) * 10) / 10;
  }
  return byRegion;
}

export function nationalChannelMaintenanceIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 88) * 10) / 10;
}

export function channelMaintenanceProductivityMultiplier(
  maintenanceIndex: number,
  policy: ChannelMaintenancePolicy = 'baseline',
): number {
  const policyBoost = policy === 'dredge' ? 0.045 : 0;
  const normalized = (maintenanceIndex - 43) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.1);
}


// --- source: operations/disaster-recovery-staging-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type DisasterRecoveryStagingPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 disaster recovery staging readiness (emergency corridors, relief staging). */
export function computeDisasterRecoveryStagingByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 32])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('disaster_recovery') ||
      asset.tags.includes('emergency_staging') ||
      asset.tags.includes('emergency_relief')
    ) {
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 90_000 + (asset.coldChainCapable ? 2.5 : 0);
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 400;
      }
      if (asset.category === 'port') {
        byRegion[asset.hostRegion] += asset.berthCount * 2.1;
      }
    }
    if (asset.linkedProjectType === 'remote_logistics_base') {
      byRegion[asset.hostRegion] += 3.2;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.15);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.05 - stress * 0.04), 18, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalDisasterRecoveryStagingIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 86) * 10) / 10;
}

export function disasterRecoveryStagingProductivityMultiplier(
  stagingIndex: number,
  policy: DisasterRecoveryStagingPolicy = 'baseline',
): number {
  const policyBoost = policy === 'surge' ? 0.046 : 0;
  const normalized = (stagingIndex - 38) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.92, 1.1);
}


// --- source: operations/track-possession-efficiency-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type TrackPossessionPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 track possession efficiency (shorter windows, higher rail availability). */
export function computeTrackPossessionEfficiencyByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 35])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('track_possession') ||
      asset.tags.includes('maintenance_window') ||
      asset.tags.includes('rail_availability')
    ) {
      if (asset.category === 'rail' && 'dualTrackShare' in asset) {
        byRegion[asset.hostRegion] += asset.dualTrackShare * 14 + asset.trackKilometres / 55;
      }
      if (asset.category === 'logistics' && asset.intermodalLinks.includes('rail')) {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000 + 2;
      }
    }
    if (asset.category === 'rail' && asset.passengerCapable && asset.dualTrackShare > 0.5) {
      byRegion[asset.hostRegion] += 1.8;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stress * 0.05), 18, 91) * 10) / 10;
  }
  return byRegion;
}

export function nationalTrackPossessionEfficiencyIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 22, 86) * 10) / 10;
}

export function trackPossessionProductivityMultiplier(
  efficiencyIndex: number,
  policy: TrackPossessionPolicy = 'baseline',
): number {
  const policyBoost = policy === 'optimize' ? 0.045 : 0;
  const normalized = (efficiencyIndex - 40) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.1);
}


// --- source: operations/medical-supply-chain-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type MedicalSupplyPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 medical / pharma supply chain readiness by region. */
export function computeMedicalSupplyChainByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 33])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      asset.tags.includes('medical_supply') ||
      asset.tags.includes('health_freight') ||
      asset.tags.includes('pharma_cold')
    ) {
      if (asset.category === 'logistics') {
        byRegion[asset.hostRegion] += asset.warehouseSqm / 82_000 + (asset.coldChainCapable ? 4 : 1.5);
      }
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        byRegion[asset.hostRegion] += asset.laneKilometres / 520;
      }
      if (asset.category === 'port' && asset.tags.includes('gateway')) {
        byRegion[asset.hostRegion] += asset.berthCount * 1.4;
      }
    }
    if (asset.category === 'logistics' && asset.coldChainCapable && asset.tags.includes('capital')) {
      byRegion[asset.hostRegion] += 2.2;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.04), 17, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalMedicalSupplyChainIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 20, 86) * 10) / 10;
}

export function medicalSupplyProductivityMultiplier(
  supplyIndex: number,
  policy: MedicalSupplyPolicy = 'baseline',
): number {
  const policyBoost = policy === 'surge' ? 0.047 : 0;
  const normalized = (supplyIndex - 38) / 100;
  return clamp(1 + normalized * 0.052 + policyBoost, 0.92, 1.1);
}


// --- source: operations/battery-supply-chain-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type BatterySupplyChainPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 battery / EV supply chain logistics readiness by region. */
export function computeBatterySupplyChainByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 14])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'battery_supply' || t === 'ev_freight' || t === 'lithium_logistics' || t === 'cell_manufacturing',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 76_000 + asset.intermodalLinks.length * 0.9;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 480;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_500_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.8 + asset.bulkShare * 4;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stress * 0.035), 8, 94) * 10) / 10;
  }
  return byRegion;
}

export function nationalBatterySupplyChainIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 10, 88) * 10) / 10;
}

export function batterySupplyProductivityMultiplier(
  supplyIndex: number,
  policy: BatterySupplyChainPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.046 : 0;
  const normalized = (supplyIndex - 18) / 100;
  return clamp(1 + normalized * 0.051 + policyBoost, 0.92, 1.11);
}


// --- source: operations/green-ammonia-export-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type GreenAmmoniaExportPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 green ammonia export logistics readiness by region. */
export function computeGreenAmmoniaExportByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 10])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'green_ammonia' ||
          t === 'ammonia_export' ||
          t === 'hydrogen_derivative' ||
          t === 'renewable_export',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 82_000 + asset.intermodalLinks.length * 0.85;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_200_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.2 + asset.bulkShare * 5.5;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.04 - stress * 0.032), 6, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalGreenAmmoniaExportIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.47 + max * 0.53, 8, 86) * 10) / 10;
}

export function greenAmmoniaExportProductivityMultiplier(
  exportIndex: number,
  policy: GreenAmmoniaExportPolicy = 'baseline',
): number {
  const policyBoost = policy === 'accelerate' ? 0.045 : 0;
  const normalized = (exportIndex - 12) / 100;
  return clamp(1 + normalized * 0.05 + policyBoost, 0.92, 1.12);
}


// --- source: operations/inland-rail-express-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type InlandRailExpressPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 inland rail express container throughput by region. */
export function computeInlandRailExpressByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 8])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'inland_rail_express' ||
          t === 'express_freight' ||
          t === 'intermodal_express',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 8_400_000 + asset.trackKilometres / 480;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 560;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000 + asset.intermodalLinks.length * 0.72;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.teuCapacityPerYear / 280_000 + asset.berthCount * 1.4;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.03 - stress * 0.028), 5, 90) * 10) / 10;
  }
  return byRegion;
}

export function nationalInlandRailExpressIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.46 + max * 0.54, 7, 82) * 10) / 10;
}

export function computeInlandRailExpressShare(
  operationalAssets: TransportAsset[],
  policy: InlandRailExpressPolicy = 'baseline',
): number {
  let expressUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && asset.tags.includes('inland_rail_express')) {
      const units =
        ('designFreightTonnesPerYear' in asset ? asset.designFreightTonnesPerYear / 5_600_000 : 0) +
        ('trackKilometres' in asset ? asset.trackKilometres / 220 : 0);
      totalUnits += units + 1.8;
      expressUnits += (units + 1.8) * 0.84;
    }
    if (asset.tags.includes('express_freight')) {
      totalUnits += 1.2;
      expressUnits += 0.76;
    }
  }

  if (totalUnits <= 0) return 0.038;
  const policyBoost = policy === 'deploy' ? 0.034 : 0;
  return Math.round(clamp(expressUnits / totalUnits + policyBoost, 0.035, 0.36) * 1000) / 1000;
}

export function inlandRailExpressProductivityMultiplier(
  share: number,
  policy: InlandRailExpressPolicy,
): number {
  const bias = policy === 'deploy' ? 1.023 : 1;
  return (1 + (share - 0.06) * 0.034) * bias;
}


// --- source: operations/trans-tasman-reefer-express-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type TransTasmanReeferExpressPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–100 trans-Tasman reefer express throughput by region. */
export function computeTransTasmanReeferExpressByRegion(
  operationalAssets: TransportAsset[],
  networkStress = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 6])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'trans_tasman' || t === 'reefer_express' || t === 'cold_chain_sea',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.0 + asset.teuCapacityPerYear / 260_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 76_000 + (asset.coldChainCapable ? 2.4 : 0.6);
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 640;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  const stress = clamp(networkStress, 0.05, 1.1);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (1.035 - stress * 0.03), 4, 88) * 10) / 10;
  }
  return byRegion;
}

export function nationalTransTasmanReeferExpressIndex(byRegion: Record<AuRegionCode, number>): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.48 + max * 0.52, 6, 84) * 10) / 10;
}

export function computeTransTasmanReeferExpressShare(
  operationalAssets: TransportAsset[],
  policy: TransTasmanReeferExpressPolicy = 'baseline',
): number {
  let reeferUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.includes('reefer_express') || asset.tags.includes('cold_chain_sea')) {
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.4;
        reeferUnits += asset.berthCount * 1.05;
      }
      if (asset.category === 'logistics' && asset.coldChainCapable) {
        totalUnits += asset.warehouseSqm / 80_000;
        reeferUnits += asset.warehouseSqm / 80_000 * 0.74;
      }
    }
  }

  if (totalUnits <= 0) return 0.034;
  const policyBoost = policy === 'surge' ? 0.033 : 0;
  return Math.round(clamp(reeferUnits / totalUnits + policyBoost, 0.032, 0.34) * 1000) / 1000;
}

export function transTasmanReeferExpressProductivityMultiplier(
  share: number,
  policy: TransTasmanReeferExpressPolicy,
): number {
  const bias = policy === 'surge' ? 1.024 : 1;
  return (1 + (share - 0.055) * 0.033) * bias;
}


// --- source: productivity/regional-investment-tiers.ts ---

const TIERS: TransportInvestmentTier[] = ['emerging', 'regional', 'integrated', 'national_gateway'];

export function computeInvestmentTierByRegion(
  operationalAssets: TransportAsset[],
  portRailCoupling: Record<AuRegionCode, number>,
): Record<AuRegionCode, TransportInvestmentTier> {
  const out = {} as Record<AuRegionCode, TransportInvestmentTier>;
  const regions: AuRegionCode[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'];

  for (const code of regions) {
    const regional = operationalAssets.filter((a) => a.hostRegion === code);
    const points = regional.reduce((s, a) => s + a.baseProductivityPoints, 0);
    const categories = new Set(regional.map((a) => a.category)).size;
    const coupling = portRailCoupling[code] ?? 0;
    let score = points * 0.4 + categories * 8 + coupling * 0.25;

    if (code === 'NSW' || code === 'VIC' || code === 'QLD' || code === 'WA') score += 6;

    let tier: TransportInvestmentTier = 'emerging';
    if (score >= 62) tier = 'national_gateway';
    else if (score >= 45) tier = 'integrated';
    else if (score >= 28) tier = 'regional';
    out[code] = tier;
  }
  return out;
}

export function tierProductivityMultiplier(tier: TransportInvestmentTier): number {
  switch (tier) {
    case 'national_gateway':
      return 1.08;
    case 'integrated':
      return 1.05;
    case 'regional':
      return 1.02;
    default:
      return 1;
  }
}

export function isKnownTier(value: string): value is TransportInvestmentTier {
  return TIERS.includes(value as TransportInvestmentTier);
}


// --- source: productivity/fleet-capacity-planner.ts ---

export function computeFleetCapacitySnapshot(operationalAssets: TransportAsset[]): FleetCapacitySnapshot {
  let roadIndex = 0;
  let railIndex = 0;
  let portIndex = 0;
  let logisticsIndex = 0;

  for (const asset of operationalAssets) {
    const idx = assetFreightCapacityIndex(asset);
    switch (asset.category) {
      case 'road':
        roadIndex += idx;
        break;
      case 'rail':
        railIndex += idx;
        break;
      case 'port':
        portIndex += idx;
        break;
      case 'logistics':
        logisticsIndex += idx;
        break;
    }
  }

  const nationalComposite = (roadIndex + railIndex + portIndex + logisticsIndex) / Math.max(1, operationalAssets.length);

  return {
    roadIndex: Math.round(roadIndex * 10) / 10,
    railIndex: Math.round(railIndex * 10) / 10,
    portIndex: Math.round(portIndex * 10) / 10,
    logisticsIndex: Math.round(logisticsIndex * 10) / 10,
    nationalComposite: Math.round(nationalComposite * 10) / 10,
  };
}


// --- source: productivity/intermodal-synergy.ts ---

const CATEGORY_WEIGHT: Record<TransportAsset['category'], number> = {
  road: 1,
  rail: 1.15,
  port: 1.25,
  logistics: 1.1,
};

/**
 * Intermodal synergy when a region operates road + rail + port + logistics together.
 * Returns additive productivity index points per region.
 */
export function computeIntermodalSynergyByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const categories = {} as Record<AuRegionCode, Set<TransportAsset['category']>>;
  const weights = {} as Record<AuRegionCode, number>;

  for (const code of AU_REGION_CODES) {
    categories[code] = new Set();
    weights[code] = 0;
  }

  for (const asset of operationalAssets) {
    categories[asset.hostRegion].add(asset.category);
    weights[asset.hostRegion] += asset.baseProductivityPoints * 0.04 * CATEGORY_WEIGHT[asset.category];
  }

  const out = {} as Record<AuRegionCode, number>;
  for (const code of AU_REGION_CODES) {
    const set = categories[code];
    let synergy = weights[code];
    if (set.has('road') && set.has('rail')) synergy += 1.2;
    if (set.has('port') && set.has('logistics')) synergy += 1.4;
    if (set.size >= 4) synergy += 2.5;
    else if (set.size === 3) synergy += 1.5;
    out[code] = Math.round(synergy * 100) / 100;
  }
  return out;
}

export function applyIntermodalSynergyToReport(
  byRegionBonus: Record<AuRegionCode, number>,
  synergy: Record<AuRegionCode, number>,
): Record<AuRegionCode, number> {
  const out = { ...byRegionBonus };
  for (const code of AU_REGION_CODES) {
    out[code] = (out[code] ?? 0) + (synergy[code] ?? 0);
  }
  return out;
}


// --- source: productivity/supply-chain-resilience.ts ---

export interface SupplyChainResilienceSnapshot {
  nationalIndex: number;
  weakestRegion: AuRegionCode;
  byRegion: Record<AuRegionCode, number>;
}

export function computeSupplyChainResilienceIndex(params: {
  resilienceScoreByRegion: Record<AuRegionCode, number>;
  freightLatencyByRegion: Record<AuRegionCode, number>;
  recoveryFactor: number;
  corridorSynergyPoints: number;
}): SupplyChainResilienceSnapshot {
  const byRegion = {} as Record<AuRegionCode, number>;
  let weakestRegion: AuRegionCode = 'NT';
  let weakestScore = Number.POSITIVE_INFINITY;

  for (const code of AU_REGION_CODES) {
    const latencyPenalty = Math.min(0.35, (params.freightLatencyByRegion[code] ?? 20) / 60);
    const raw =
      (params.resilienceScoreByRegion[code] ?? 0) * 0.55 +
      params.recoveryFactor * 0.25 +
      Math.min(0.2, params.corridorSynergyPoints / 120) -
      latencyPenalty;
    byRegion[code] = Math.round(clamp(raw, 0.05, 1) * 1000) / 1000;
    if (byRegion[code] < weakestScore) {
      weakestScore = byRegion[code];
      weakestRegion = code;
    }
  }

  const nationalIndex =
    Math.round(
      (AU_REGION_CODES.reduce((s, c) => s + byRegion[c], 0) / AU_REGION_CODES.length) * 1000,
    ) / 1000;

  return { nationalIndex, weakestRegion, byRegion };
}


// --- source: productivity/modal-balance-index.ts ---

/** 0–1 index peaking when road/rail freight capacity is near target mix (default 52% road). */
export function computeModalBalanceIndex(
  operationalAssets: TransportAsset[],
  policy: ModalShiftPolicy = 'balanced',
): number {
  let roadUnits = 0;
  let railUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      roadUnits += asset.laneKilometres * asset.freightShare;
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      railUnits += asset.trackKilometres * (0.35 + asset.dualTrackShare * 0.4);
      railUnits += asset.designFreightTonnesPerYear / 12_000_000;
    }
  }

  const total = roadUnits + railUnits;
  if (total <= 0) return 0.5;

  const roadShare = roadUnits / total;
  const target =
    policy === 'road' ? 0.62 : policy === 'rail' ? 0.42 : 0.52;
  const deviation = Math.abs(roadShare - target);
  return Math.round(clamp(1 - deviation * 2.2, 0.15, 1) * 1000) / 1000;
}

export function computeElectrifiedFreightShare(operationalAssets: TransportAsset[]): number {
  let electrifiedKm = 0;
  let freightKm = 0;
  for (const asset of operationalAssets) {
    if (asset.category !== 'rail' || !('electrifiedShare' in asset)) continue;
    freightKm += asset.trackKilometres;
    electrifiedKm += asset.trackKilometres * asset.electrifiedShare;
  }
  if (freightKm <= 0) return 0;
  return Math.round(clamp(electrifiedKm / freightKm, 0, 1) * 1000) / 1000;
}

export function modalBalanceProductivityMultiplier(index: number, policy: ModalShiftPolicy): number {
  const bias = policy === 'rail' ? 1.04 : policy === 'road' ? 1.02 : 1;
  return 1 + (index - 0.5) * 0.06 * bias;
}

export function emptyModalBalanceByRegion(): Record<AuRegionCode, number> {
  return Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0.5])) as Record<AuRegionCode, number>;
}


// --- source: productivity/green-freight-index.ts ---

/** 0–1 share of freight capacity meeting low-emission criteria (electrified rail + efficient road). */
export function computeGreenFreightShare(
  operationalAssets: TransportAsset[],
  policy: GreenFreightPolicy = 'baseline',
): number {
  let greenUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && 'electrifiedShare' in asset) {
      const units = asset.trackKilometres * (0.4 + asset.dualTrackShare);
      totalUnits += units;
      greenUnits += units * asset.electrifiedShare;
      if (asset.tags.includes('gauge_standard')) greenUnits += units * 0.08;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * asset.freightShare;
      totalUnits += units;
      if (asset.designSpeedKmh >= 100 && asset.urbanShare < 0.15) {
        greenUnits += units * 0.22;
      }
    }
    if (asset.category === 'logistics' && asset.coldChainCapable) {
      totalUnits += asset.warehouseSqm / 50_000;
      greenUnits += (asset.warehouseSqm / 50_000) * 0.18;
    }
  }

  if (totalUnits <= 0) return 0.2;
  const policyBoost = policy === 'accelerate' ? 0.06 : 0;
  return Math.round(clamp(greenUnits / totalUnits + policyBoost, 0.12, 0.94) * 1000) / 1000;
}

export function greenFreightProductivityMultiplier(share: number, policy: GreenFreightPolicy): number {
  const bias = policy === 'accelerate' ? 1.03 : 1;
  return (1 + (share - 0.35) * 0.05) * bias;
}

export function electrifiedBaselineShare(operationalAssets: TransportAsset[]): number {
  return computeElectrifiedFreightShare(operationalAssets);
}


// --- source: productivity/congestion-relief-index.ts ---

/** 0–100 urban freight congestion pressure (higher = worse). */
export function computeUrbanCongestionByRegion(
  operationalAssets: TransportAsset[],
  freightUtilization = 0.5,
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 28])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'urbanShare' in asset) {
      const pressure = asset.urbanShare * asset.freightShare * (asset.laneKilometres / 120);
      byRegion[asset.hostRegion] += pressure * 12;
      if (asset.tollRoad) byRegion[asset.hostRegion] -= 2.5;
    }
    if (asset.category === 'logistics' && asset.lastMileCoveragePct > 65) {
      byRegion[asset.hostRegion] -= 3;
    }
  }

  const utilStress = clamp(freightUtilization, 0.05, 1.15);
  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code] * (0.9 + utilStress * 0.25), 8, 92) * 10) / 10;
  }
  return byRegion;
}

export function nationalUrbanCongestionIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  return Math.round(clamp(avg, 12, 78) * 10) / 10;
}

export function congestionReliefMultiplier(
  congestionIndex: number,
  policy: CongestionReliefPolicy = 'baseline',
): number {
  const policyRelief =
    policy === 'invest' ? 0.06 : policy === 'priority_freight' ? 0.09 : 0;
  const normalized = (congestionIndex - 35) / 100;
  return clamp(1 - normalized * 0.08 + policyRelief, 0.9, 1.08);
}


// --- source: productivity/hydrogen-freight-index.ts ---

/** 0–100 hydrogen corridor export throughput (ammonia, green H₂ feedstock). */
export function computeHydrogenCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (!asset.tags.some((t) => t === 'hydrogen' || t === 'energy_export')) continue;

    if (asset.category === 'port' && 'bulkShare' in asset) {
      byRegion[asset.hostRegion] += asset.bulkShare * (asset.teuCapacityPerYear / 150_000) * 2.2;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 12_000_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 1100;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 120_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

/** 0–1 share of freight capacity tied to hydrogen export corridors. */
export function computeHydrogenFreightShare(
  operationalAssets: TransportAsset[],
  policy: HydrogenFreightPolicy = 'baseline',
): number {
  let hydrogenUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      const units = asset.trackKilometres * (0.35 + asset.dualTrackShare);
      totalUnits += units;
      if (asset.tags.includes('hydrogen')) hydrogenUnits += units * 0.85;
    }
    if (asset.category === 'port') {
      const units = asset.berthCount * 2 + asset.teuCapacityPerYear / 400_000;
      totalUnits += units;
      if (asset.tags.includes('hydrogen') || asset.tags.includes('energy_export')) {
        hydrogenUnits += units * (0.55 + asset.bulkShare * 0.35);
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('hydrogen')) {
      totalUnits += asset.warehouseSqm / 60_000;
      hydrogenUnits += asset.warehouseSqm / 60_000;
    }
  }

  if (totalUnits <= 0) return 0.08;
  const policyBoost = policy === 'pipeline' ? 0.05 : 0;
  return Math.round(clamp(hydrogenUnits / totalUnits + policyBoost, 0.04, 0.72) * 1000) / 1000;
}

export function hydrogenFreightProductivityMultiplier(
  share: number,
  policy: HydrogenFreightPolicy,
): number {
  const bias = policy === 'pipeline' ? 1.025 : 1;
  return (1 + (share - 0.12) * 0.04) * bias;
}

export function nationalHydrogenCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.6 + max * 0.4, 2, 85) * 10) / 10;
}


// --- source: productivity/autonomous-freight-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type AutonomousFreightPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of road/rail freight capacity with autonomous or platooning systems. */
export function computeAutonomousFreightShare(
  operationalAssets: TransportAsset[],
  policy: AutonomousFreightPolicy = 'baseline',
): number {
  let autonomousUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * (0.25 + asset.freightShare);
      totalUnits += units;
      if (asset.tags.includes('autonomous') || asset.tags.includes('platoon') || asset.tags.includes('smart_freight')) {
        autonomousUnits += units * (0.7 + asset.designSpeedKmh / 400);
      }
    }
    if (asset.category === 'rail' && 'trackKilometres' in asset) {
      const units = asset.trackKilometres * (0.3 + asset.electrifiedShare);
      totalUnits += units;
      if (asset.tags.includes('autonomous') || asset.tags.includes('smart_freight')) {
        autonomousUnits += units * 0.55;
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('smart_freight')) {
      totalUnits += asset.warehouseSqm / 70_000;
      autonomousUnits += asset.warehouseSqm / 70_000 * 0.8;
    }
  }

  if (totalUnits <= 0) return 0.06;
  const policyBoost = policy === 'deploy' ? 0.04 : 0;
  return Math.round(clamp(autonomousUnits / totalUnits + policyBoost, 0.05, 0.58) * 1000) / 1000;
}

export function autonomousFreightProductivityMultiplier(
  share: number,
  policy: AutonomousFreightPolicy,
): number {
  const bias = policy === 'deploy' ? 1.022 : 1;
  return (1 + (share - 0.1) * 0.035) * bias;
}

export function computeAutonomousCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (!asset.tags.some((t) => t === 'autonomous' || t === 'platoon' || t === 'smart_freight')) continue;

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 520;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 6_500_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 105_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAutonomousCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.55 + max * 0.45, 2, 78) * 10) / 10;
}


// --- source: productivity/electric-freight-index.ts ---

/** 0–1 share of road/rail freight tied to electric charging corridors. */
export function computeElectricFreightShare(
  operationalAssets: TransportAsset[],
  policy: ElectricFreightPolicy = 'baseline',
): number {
  let electricUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * (0.28 + asset.freightShare);
      totalUnits += units;
      if (
        asset.tags.includes('electric_freight') ||
        asset.tags.includes('bev') ||
        asset.tags.includes('charging')
      ) {
        electricUnits += units * (0.65 + asset.designSpeedKmh / 450);
      }
    }
    if (asset.category === 'rail' && 'electrifiedShare' in asset) {
      const units = asset.trackKilometres * (0.32 + asset.electrifiedShare);
      totalUnits += units;
      if (asset.tags.includes('electric_freight') || asset.tags.includes('charging')) {
        electricUnits += units * (0.45 + asset.electrifiedShare * 0.4);
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('charging')) {
      totalUnits += asset.warehouseSqm / 75_000;
      electricUnits += asset.warehouseSqm / 75_000 * 0.75;
    }
  }

  if (totalUnits <= 0) return 0.07;
  const policyBoost = policy === 'accelerate' ? 0.045 : 0;
  return Math.round(clamp(electricUnits / totalUnits + policyBoost, 0.06, 0.62) * 1000) / 1000;
}

export function electricFreightProductivityMultiplier(
  share: number,
  policy: ElectricFreightPolicy,
): number {
  const bias = policy === 'accelerate' ? 1.024 : 1;
  return (1 + (share - 0.11) * 0.038) * bias;
}

export function computeElectricCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some((t) => t === 'electric_freight' || t === 'bev' || t === 'charging')
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * asset.freightShare) / 480;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += (asset.designFreightTonnesPerYear / 7_000_000) * (0.4 + asset.electrifiedShare);
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 98_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalElectricCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.58 + max * 0.42, 2, 76) * 10) / 10;
}


// --- source: productivity/digital-freight-visibility-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type DigitalFreightPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of freight operations with digital visibility / telemetry integration. */
export function computeDigitalFreightVisibilityShare(
  operationalAssets: TransportAsset[],
  policy: DigitalFreightPolicy = 'baseline',
): number {
  let digitalUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 65_000 + asset.intermodalLinks.length;
      totalUnits += units;
      if (
        asset.tags.includes('digital_freight') ||
        asset.tags.includes('visibility') ||
        asset.tags.includes('telemetry')
      ) {
        digitalUnits += units * 0.82;
      }
    }
    if (asset.category === 'port') {
      const units = asset.berthCount * 2 + asset.automationLevel * 1.5;
      totalUnits += units;
      if (asset.tags.includes('digital_freight') || asset.automationLevel >= 2) {
        digitalUnits += units * (0.45 + asset.automationLevel * 0.08);
      }
    }
    if (asset.category === 'road' && asset.tags.includes('telemetry') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 200;
      digitalUnits += asset.laneKilometres / 200;
    }
  }

  if (totalUnits <= 0) return 0.08;
  const policyBoost = policy === 'integrate' ? 0.042 : 0;
  return Math.round(clamp(digitalUnits / totalUnits + policyBoost, 0.07, 0.65) * 1000) / 1000;
}

export function digitalFreightProductivityMultiplier(
  share: number,
  policy: DigitalFreightPolicy,
): number {
  const bias = policy === 'integrate' ? 1.023 : 1;
  return (1 + (share - 0.12) * 0.036) * bias;
}

export function computeDigitalFreightThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some((t) => t === 'digital_freight' || t === 'visibility' || t === 'telemetry')
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 90_000 + asset.intermodalLinks.length * 1.4;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.automationLevel * 2.8 + asset.teuCapacityPerYear / 400_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 620;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDigitalFreightThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.56 + max * 0.44, 2, 74) * 10) / 10;
}


// --- source: productivity/indigenous-remote-supply-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type IndigenousRemoteSupplyPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of remote/indigenous community supply served by dedicated corridors. */
export function computeIndigenousRemoteSupplyShare(
  operationalAssets: TransportAsset[],
  policy: IndigenousRemoteSupplyPolicy = 'baseline',
): number {
  let remoteUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * (0.22 + asset.freightShare);
      totalUnits += units;
      if (
        asset.tags.includes('indigenous_supply') ||
        asset.tags.includes('remote_community') ||
        asset.tags.includes('remote')
      ) {
        remoteUnits += units * (0.55 + (1 - asset.urbanShare) * 0.35);
      }
    }
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 80_000;
      totalUnits += units;
      if (asset.tags.includes('indigenous_supply') || asset.tags.includes('remote_community')) {
        remoteUnits += units * 0.9;
      }
    }
    if (asset.category === 'port' && asset.tags.includes('remote')) {
      totalUnits += asset.berthCount * 2;
      remoteUnits += asset.berthCount * 1.4;
    }
  }

  if (totalUnits <= 0) return 0.09;
  const policyBoost = policy === 'strengthen' ? 0.04 : 0;
  return Math.round(clamp(remoteUnits / totalUnits + policyBoost, 0.08, 0.55) * 1000) / 1000;
}

export function indigenousRemoteSupplyProductivityMultiplier(
  share: number,
  policy: IndigenousRemoteSupplyPolicy,
): number {
  const bias = policy === 'strengthen' ? 1.025 : 1;
  return (1 + (share - 0.14) * 0.04) * bias;
}

export function computeIndigenousRemoteSupplyThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'indigenous_supply' || t === 'remote_community' || (t === 'remote' && asset.category === 'logistics'),
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += (asset.laneKilometres * (1 - asset.urbanShare)) / 550;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 85_000 + asset.lastMileCoveragePct / 150;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 1.6;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalIndigenousRemoteSupplyThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 72) * 10) / 10;
}


// --- source: productivity/circular-freight-index.ts ---

/** 0–1 share of logistics capacity on circular / waste-to-resource freight loops. */
export function computeCircularFreightShare(
  operationalAssets: TransportAsset[],
  policy: CircularFreightPolicy = 'baseline',
): number {
  let circularUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 70_000;
      totalUnits += units;
      if (
        asset.tags.includes('circular_economy') ||
        asset.tags.includes('waste_logistics') ||
        asset.tags.includes('recycle_freight')
      ) {
        circularUnits += units * 0.85;
      }
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      const units = asset.laneKilometres * asset.freightShare;
      totalUnits += units;
      if (asset.tags.includes('circular_economy') || asset.tags.includes('recycle_freight')) {
        circularUnits += units * 0.6;
      }
    }
    if (asset.category === 'rail' && asset.tags.includes('waste_logistics')) {
      totalUnits += asset.trackKilometres / 80;
      circularUnits += asset.trackKilometres / 80;
    }
  }

  if (totalUnits <= 0) return 0.07;
  const policyBoost = policy === 'expand' ? 0.041 : 0;
  return Math.round(clamp(circularUnits / totalUnits + policyBoost, 0.06, 0.52) * 1000) / 1000;
}

export function circularFreightProductivityMultiplier(
  share: number,
  policy: CircularFreightPolicy,
): number {
  const bias = policy === 'expand' ? 1.024 : 1;
  return (1 + (share - 0.1) * 0.037) * bias;
}

export function computeCircularFreightThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'circular_economy' || t === 'waste_logistics' || t === 'recycle_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 88_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 640;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 9_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCircularFreightThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.55 + max * 0.45, 2, 70) * 10) / 10;
}


// --- source: productivity/green-bunkering-index.ts ---

/** 0–1 share of port/road fueling on green bunkering (ammonia, methanol, shore power). */
export function computeGreenBunkeringShare(
  operationalAssets: TransportAsset[],
  policy: GreenBunkeringPolicy = 'baseline',
): number {
  let greenUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      const units = asset.berthCount * 2.5 + asset.teuCapacityPerYear / 350_000;
      totalUnits += units;
      if (
        asset.tags.includes('green_bunkering') ||
        asset.tags.includes('ammonia_fuel') ||
        asset.tags.includes('shore_power')
      ) {
        greenUnits += units * (0.5 + asset.automationLevel * 0.07);
      }
    }
    if (asset.category === 'road' && asset.tags.includes('green_bunkering') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 180;
      greenUnits += asset.laneKilometres / 180 * 0.65;
    }
    if (asset.category === 'logistics' && asset.tags.includes('ammonia_fuel')) {
      totalUnits += asset.warehouseSqm / 85_000;
      greenUnits += asset.warehouseSqm / 85_000;
    }
  }

  if (totalUnits <= 0) return 0.06;
  const policyBoost = policy === 'expand' ? 0.04 : 0;
  return Math.round(clamp(greenUnits / totalUnits + policyBoost, 0.05, 0.48) * 1000) / 1000;
}

export function greenBunkeringProductivityMultiplier(
  share: number,
  policy: GreenBunkeringPolicy,
): number {
  const bias = policy === 'expand' ? 1.024 : 1;
  return (1 + (share - 0.09) * 0.038) * bias;
}

export function computeGreenBunkeringThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'green_bunkering' || t === 'ammonia_fuel' || t === 'shore_power' || t === 'low_carbon_fuel',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.6 + asset.automationLevel * 2.2;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 720;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 95_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalGreenBunkeringThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 68) * 10) / 10;
}


// --- source: productivity/data-centre-logistics-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type DataCentreLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of logistics tied to data-centre / hyperscale digital infrastructure. */
export function computeDataCentreLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: DataCentreLogisticsPolicy = 'baseline',
): number {
  let dcUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'logistics') {
      const units = asset.warehouseSqm / 68_000 + asset.intermodalLinks.length;
      totalUnits += units;
      if (
        asset.tags.includes('data_centre') ||
        asset.tags.includes('hyperscale_logistics') ||
        asset.tags.includes('digital_infra')
      ) {
        dcUnits += units * 0.88;
      }
    }
    if (asset.category === 'road' && asset.tags.includes('digital_infra') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 220;
      dcUnits += asset.laneKilometres / 220 * 0.7;
    }
    if (asset.category === 'rail' && asset.tags.includes('data_centre')) {
      totalUnits += asset.trackKilometres / 100;
      dcUnits += asset.trackKilometres / 100;
    }
  }

  if (totalUnits <= 0) return 0.07;
  const policyBoost = policy === 'accelerate' ? 0.041 : 0;
  return Math.round(clamp(dcUnits / totalUnits + policyBoost, 0.06, 0.5) * 1000) / 1000;
}

export function dataCentreLogisticsProductivityMultiplier(
  share: number,
  policy: DataCentreLogisticsPolicy,
): number {
  const bias = policy === 'accelerate' ? 1.023 : 1;
  return (1 + (share - 0.1) * 0.036) * bias;
}

export function computeDataCentreLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'data_centre' || t === 'hyperscale_logistics' || t === 'digital_infra',
      )
    ) {
      continue;
    }

    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 86_000 + asset.lastMileCoveragePct / 140;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 680;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 10_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalDataCentreLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.56 + max * 0.44, 2, 66) * 10) / 10;
}


// --- source: productivity/cruise-turnaround-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type CruiseTurnaroundPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of port logistics tied to cruise turnaround and tourism berths. */
export function computeCruiseTurnaroundShare(
  operationalAssets: TransportAsset[],
  policy: CruiseTurnaroundPolicy = 'baseline',
): number {
  let cruiseUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'port') {
      const units = asset.berthCount * 1.4 + asset.teuCapacityPerYear / 420_000;
      totalUnits += units;
      if (
        asset.tags.includes('cruise_turnaround') ||
        asset.tags.includes('tourism_port') ||
        asset.tags.includes('passenger_freight')
      ) {
        cruiseUnits += units * 0.82;
      }
    }
    if (asset.category === 'logistics' && asset.tags.includes('cruise_turnaround')) {
      totalUnits += asset.warehouseSqm / 72_000;
      cruiseUnits += asset.warehouseSqm / 72_000 * 0.65;
    }
    if (asset.category === 'road' && asset.tags.includes('tourism_port') && 'laneKilometres' in asset) {
      totalUnits += asset.laneKilometres / 260;
      cruiseUnits += asset.laneKilometres / 260 * 0.55;
    }
  }

  if (totalUnits <= 0) return 0.05;
  const policyBoost = policy === 'expand' ? 0.038 : 0;
  return Math.round(clamp(cruiseUnits / totalUnits + policyBoost, 0.04, 0.42) * 1000) / 1000;
}

export function cruiseTurnaroundProductivityMultiplier(
  share: number,
  policy: CruiseTurnaroundPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.08) * 0.034) * bias;
}

export function computeCruiseTurnaroundThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'cruise_turnaround' || t === 'tourism_port' || t === 'passenger_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 3.2 + asset.teuCapacityPerYear / 380_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 620;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalCruiseTurnaroundThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.54 + max * 0.46, 2, 62) * 10) / 10;
}


// --- source: productivity/airport-express-rail-index.ts ---
  AU_REGION_CODES,
  type AirportExpressRailPolicy,
  type AuRegionCode,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of mobility logistics tied to airport express rail links. */
export function computeAirportExpressRailShare(
  operationalAssets: TransportAsset[],
  policy: AirportExpressRailPolicy = 'baseline',
): number {
  let expressUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'rail' && asset.tags.includes('airport_express')) {
      const units =
        ('designFreightTonnesPerYear' in asset ? asset.designFreightTonnesPerYear / 4_200_000 : 0) +
        ('trackKilometres' in asset ? asset.trackKilometres / 180 : 0);
      totalUnits += units + 2;
      expressUnits += (units + 2) * 0.88;
    }
    if (asset.category === 'road' && asset.tags.includes('air_rail')) {
      totalUnits += asset.laneKilometres / 240;
      expressUnits += asset.laneKilometres / 240 * 0.62;
    }
    if (asset.category === 'logistics' && asset.tags.includes('air_rail')) {
      totalUnits += asset.warehouseSqm / 68_000;
      expressUnits += asset.warehouseSqm / 68_000 * 0.58;
    }
  }

  if (totalUnits <= 0) return 0.045;
  const policyBoost = policy === 'deploy' ? 0.036 : 0;
  return Math.round(clamp(expressUnits / totalUnits + policyBoost, 0.04, 0.38) * 1000) / 1000;
}

export function airportExpressRailProductivityMultiplier(
  share: number,
  policy: AirportExpressRailPolicy,
): number {
  const bias = policy === 'deploy' ? 1.024 : 1;
  return (1 + (share - 0.07) * 0.033) * bias;
}

export function computeAirportExpressRailThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'airport_express' || t === 'air_rail' || t === 'passenger_freight',
      )
    ) {
      continue;
    }

    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      const railBoost = asset.tags.includes('airport_express') ? 2.4 : 1;
      byRegion[asset.hostRegion] +=
        (asset.designFreightTonnesPerYear / 2_400_000 + asset.trackKilometres / 95) * railBoost;
    }
    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 320;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 98_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalAirportExpressRailThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.52 + max * 0.48, 2, 58) * 10) / 10;
}


// --- source: productivity/space-launch-logistics-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type SpaceLaunchLogisticsPolicy,
  type TransportAsset,
} from '../types.ts';

/** 0–1 share of remote logistics tied to space launch supply chains. */
export function computeSpaceLaunchLogisticsShare(
  operationalAssets: TransportAsset[],
  policy: SpaceLaunchLogisticsPolicy = 'baseline',
): number {
  let launchUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.tags.some((t) => t === 'space_launch' || t === 'launch_logistics' || t === 'orbital_supply')) {
      if (asset.category === 'road' && 'laneKilometres' in asset) {
        totalUnits += asset.laneKilometres / 310;
        launchUnits += asset.laneKilometres / 310 * 0.71;
      }
      if (asset.category === 'logistics') {
        totalUnits += asset.warehouseSqm / 72_000;
        launchUnits += asset.warehouseSqm / 72_000 * 0.65;
      }
      if (asset.category === 'port') {
        totalUnits += asset.berthCount * 1.5;
        launchUnits += asset.berthCount * 1.1;
      }
    }
  }

  if (totalUnits <= 0) return 0.032;
  const policyBoost = policy === 'expand' ? 0.031 : 0;
  return Math.round(clamp(launchUnits / totalUnits + policyBoost, 0.03, 0.32) * 1000) / 1000;
}

export function spaceLaunchLogisticsProductivityMultiplier(
  share: number,
  policy: SpaceLaunchLogisticsPolicy,
): number {
  const bias = policy === 'expand' ? 1.022 : 1;
  return (1 + (share - 0.05) * 0.032) * bias;
}

export function computeSpaceLaunchLogisticsThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) => t === 'space_launch' || t === 'launch_logistics' || t === 'orbital_supply',
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 420;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 16_000_000;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 92_000;
    }
    if (asset.category === 'port') {
      byRegion[asset.hostRegion] += asset.berthCount * 2.1;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalSpaceLaunchLogisticsThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.5 + max * 0.5, 1.5, 52) * 10) / 10;
}


// --- source: productivity/zero-emission-truck-corridor-index.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type TransportAsset,
  type ZeroEmissionTruckCorridorPolicy,
} from '../types.ts';

/** 0–1 share of road freight on zero-emission truck corridors. */
export function computeZeroEmissionTruckCorridorShare(
  operationalAssets: TransportAsset[],
  policy: ZeroEmissionTruckCorridorPolicy = 'baseline',
): number {
  let zetUnits = 0;
  let totalUnits = 0;

  for (const asset of operationalAssets) {
    if (asset.category === 'road') {
      const zetTagged = asset.tags.some(
        (t) =>
          t === 'zero_emission_truck' ||
          t === 'electric_freight_corridor' ||
          t === 'battery_electric_haul',
      );
      const units = asset.laneKilometres / 260 + asset.freightShare * 2.2;
      totalUnits += units + 0.8;
      if (zetTagged) zetUnits += (units + 0.8) * 0.79;
    }
    if (asset.category === 'logistics' && asset.tags.includes('battery_electric_haul')) {
      totalUnits += asset.warehouseSqm / 90_000;
      zetUnits += asset.warehouseSqm / 90_000 * 0.61;
    }
  }

  if (totalUnits <= 0) return 0.036;
  const policyBoost = policy === 'expand' ? 0.035 : 0;
  return Math.round(clamp(zetUnits / totalUnits + policyBoost, 0.034, 0.37) * 1000) / 1000;
}

export function zeroEmissionTruckCorridorProductivityMultiplier(
  share: number,
  policy: ZeroEmissionTruckCorridorPolicy,
): number {
  const bias = policy === 'expand' ? 1.023 : 1;
  return (1 + (share - 0.065) * 0.031) * bias;
}

export function computeZeroEmissionTruckCorridorThroughputByRegion(
  operationalAssets: TransportAsset[],
): Record<AuRegionCode, number> {
  const byRegion = Object.fromEntries(AU_REGION_CODES.map((c) => [c, 0])) as Record<AuRegionCode, number>;

  for (const asset of operationalAssets) {
    if (
      !asset.tags.some(
        (t) =>
          t === 'zero_emission_truck' ||
          t === 'electric_freight_corridor' ||
          t === 'battery_electric_haul',
      )
    ) {
      continue;
    }

    if (asset.category === 'road' && 'laneKilometres' in asset) {
      byRegion[asset.hostRegion] += asset.laneKilometres / 380 + asset.freightShare * 3.2;
    }
    if (asset.category === 'logistics') {
      byRegion[asset.hostRegion] += asset.warehouseSqm / 94_000;
    }
    if (asset.category === 'rail' && 'designFreightTonnesPerYear' in asset) {
      byRegion[asset.hostRegion] += asset.designFreightTonnesPerYear / 18_000_000;
    }
  }

  for (const code of AU_REGION_CODES) {
    byRegion[code] = Math.round(clamp(byRegion[code], 0, 100) * 10) / 10;
  }
  return byRegion;
}

export function nationalZeroEmissionTruckCorridorThroughputIndex(
  byRegion: Record<AuRegionCode, number>,
): number {
  const values = AU_REGION_CODES.map((c) => byRegion[c]);
  const avg = values.reduce((s, v) => s + v, 0) / AU_REGION_CODES.length;
  const max = Math.max(...values);
  return Math.round(clamp(avg * 0.51 + max * 0.49, 2, 56) * 10) / 10;
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


// --- source: productivity/compute-infrastructure-state.ts ---
  AU_REGION_CODES,
  type AuRegionCode,
  type NationalTransportProductivityReport,
  type TransportAsset,
  type TransportAssetCondition,
  type TransportInfrastructureOptions,
  type TransportInfrastructureState,
  type TransportProductivityInputs,
} from '../types.ts';
  buildConditionMapFromMaintenance,
  maintenanceWarningsFromBacklog,
} from '../operations/maintenance-backlog.ts';
  corridorLogisticsRelief,
  evaluateAllCorridors,
  totalCorridorSynergy,
} from '../network/evaluate-corridors.ts';
  applyScenarioStackToUtilization,
  computeScenarioStackFactor,
} from '../scenarios/scenario-stack-policy.ts';
  aggregateNetworkStress,
  projectMaintenanceBacklogNextTurn,
} from '../operations/maintenance-decay.ts';
  computeInvestmentTierByRegion,
  tierProductivityMultiplier,
} from './regional-investment-tiers.ts';
  computeFreightLatencyByRegion,
  nationalMedianFreightLatency,
} from '../network/freight-latency-index.ts';
  computeLastMileCoverageByRegion,
  nationalLastMileCoverage,
} from '../operations/last-mile-coverage.ts';
  connectivityBonusByRegion,
  computeIntercapitalConnectivityIndex,
} from '../network/intercapital-connectivity.ts';
  computeElectrifiedFreightShare,
  computeModalBalanceIndex,
  modalBalanceProductivityMultiplier,
} from './modal-balance-index.ts';
  computeGreenFreightShare,
  greenFreightProductivityMultiplier,
} from './green-freight-index.ts';
  computeContainerThroughputByRegion,
  nationalContainerThroughputIndex,
} from '../network/container-throughput-index.ts';
  computeColdChainReliabilityByRegion,
  nationalColdChainReliabilityIndex,
} from '../operations/cold-chain-reliability.ts';
  computeIntermodalDwellByRegion,
  dwellProductivityPenalty,
  nationalIntermodalDwellMedian,
} from '../operations/intermodal-dwell-index.ts';
  computeBulkExportThroughputByRegion,
  nationalBulkExportThroughputIndex,
} from '../network/bulk-export-throughput-index.ts';
  computeUrbanCongestionByRegion,
  congestionReliefMultiplier,
  nationalUrbanCongestionIndex,
} from './congestion-relief-index.ts';
  computeAviationCargoThroughputByRegion,
  nationalAviationCargoThroughputIndex,
} from '../network/aviation-cargo-throughput-index.ts';
  computeCustomsClearanceByRegion,
  customsClearanceProductivityMultiplier,
  nationalCustomsClearanceIndex,
} from '../operations/customs-clearance-index.ts';
  computeHydrogenCorridorThroughputByRegion,
  computeHydrogenFreightShare,
  hydrogenFreightProductivityMultiplier,
  nationalHydrogenCorridorThroughputIndex,
} from './hydrogen-freight-index.ts';
  coastalShippingProductivityMultiplier,
  computeCoastalShippingThroughputByRegion,
  nationalCoastalShippingThroughputIndex,
} from '../network/coastal-shipping-throughput-index.ts';
  biosecurityClearanceProductivityMultiplier,
  computeBiosecurityClearanceByRegion,
  nationalBiosecurityClearanceIndex,
} from '../operations/biosecurity-clearance-index.ts';
  autonomousFreightProductivityMultiplier,
  computeAutonomousCorridorThroughputByRegion,
  computeAutonomousFreightShare,
  nationalAutonomousCorridorThroughputIndex,
} from './autonomous-freight-index.ts';
  deepSeaGatewayProductivityMultiplier,
  computeDeepSeaGatewayThroughputByRegion,
  nationalDeepSeaGatewayThroughputIndex,
} from '../network/deep-sea-gateway-throughput-index.ts';
  computeInfrastructurePermittingByRegion,
  infrastructurePermittingProductivityMultiplier,
  nationalInfrastructurePermittingIndex,
} from '../operations/infrastructure-permitting-index.ts';
  computeElectricCorridorThroughputByRegion,
  computeElectricFreightShare,
  electricFreightProductivityMultiplier,
  nationalElectricCorridorThroughputIndex,
} from './electric-freight-index.ts';
  computeDefenceLogisticsReadinessByRegion,
  defenceLogisticsProductivityMultiplier,
  nationalDefenceLogisticsReadinessIndex,
} from '../network/defence-logistics-readiness-index.ts';
  computeWeatherResilienceRoutingByRegion,
  nationalWeatherResilienceRoutingIndex,
  weatherResilienceProductivityMultiplier,
} from '../operations/weather-resilience-routing-index.ts';
  computeDigitalFreightThroughputByRegion,
  computeDigitalFreightVisibilityShare,
  digitalFreightProductivityMultiplier,
  nationalDigitalFreightThroughputIndex,
} from './digital-freight-visibility-index.ts';
  computeCriticalMineralsExportByRegion,
  criticalMineralsProductivityMultiplier,
  nationalCriticalMineralsExportIndex,
} from '../network/critical-minerals-export-index.ts';
  channelMaintenanceProductivityMultiplier,
  computeChannelMaintenanceByRegion,
  nationalChannelMaintenanceIndex,
} from '../operations/channel-maintenance-index.ts';
  computeIndigenousRemoteSupplyThroughputByRegion,
  computeIndigenousRemoteSupplyShare,
  indigenousRemoteSupplyProductivityMultiplier,
  nationalIndigenousRemoteSupplyThroughputIndex,
} from './indigenous-remote-supply-index.ts';
  computeGaugeInteroperabilityByRegion,
  gaugeInteroperabilityProductivityMultiplier,
  nationalGaugeInteroperabilityIndex,
} from '../network/gauge-interoperability-index.ts';
  computeDisasterRecoveryStagingByRegion,
  disasterRecoveryStagingProductivityMultiplier,
  nationalDisasterRecoveryStagingIndex,
} from '../operations/disaster-recovery-staging-index.ts';
  circularFreightProductivityMultiplier,
  computeCircularFreightShare,
  computeCircularFreightThroughputByRegion,
  nationalCircularFreightThroughputIndex,
} from './circular-freight-index.ts';
  agriculturalExportProductivityMultiplier,
  computeAgriculturalExportThroughputByRegion,
  nationalAgriculturalExportThroughputIndex,
} from '../network/agricultural-export-throughput-index.ts';
  computeTrackPossessionEfficiencyByRegion,
  nationalTrackPossessionEfficiencyIndex,
  trackPossessionProductivityMultiplier,
} from '../operations/track-possession-efficiency-index.ts';
  computeGreenBunkeringShare,
  computeGreenBunkeringThroughputByRegion,
  greenBunkeringProductivityMultiplier,
  nationalGreenBunkeringThroughputIndex,
} from './green-bunkering-index.ts';
  computePacificFeederThroughputByRegion,
  nationalPacificFeederThroughputIndex,
  pacificFeederProductivityMultiplier,
} from '../network/pacific-feeder-tradelane-index.ts';
  computeMedicalSupplyChainByRegion,
  medicalSupplyProductivityMultiplier,
  nationalMedicalSupplyChainIndex,
} from '../operations/medical-supply-chain-index.ts';
  computeDataCentreLogisticsShare,
  computeDataCentreLogisticsThroughputByRegion,
  dataCentreLogisticsProductivityMultiplier,
  nationalDataCentreLogisticsThroughputIndex,
} from './data-centre-logistics-index.ts';
  computeOffshoreWindLogisticsByRegion,
  nationalOffshoreWindLogisticsIndex,
  offshoreWindLogisticsProductivityMultiplier,
} from '../network/offshore-wind-logistics-index.ts';
  batterySupplyProductivityMultiplier,
  computeBatterySupplyChainByRegion,
  nationalBatterySupplyChainIndex,
} from '../operations/battery-supply-chain-index.ts';
  computeCruiseTurnaroundShare,
  computeCruiseTurnaroundThroughputByRegion,
  cruiseTurnaroundProductivityMultiplier,
  nationalCruiseTurnaroundThroughputIndex,
} from './cruise-turnaround-index.ts';
  computeSubseaCableLandingByRegion,
  nationalSubseaCableLandingIndex,
  subseaCableLandingProductivityMultiplier,
} from '../network/subsea-cable-landing-index.ts';
  computeGreenAmmoniaExportByRegion,
  greenAmmoniaExportProductivityMultiplier,
  nationalGreenAmmoniaExportIndex,
} from '../operations/green-ammonia-export-index.ts';
  airportExpressRailProductivityMultiplier,
  computeAirportExpressRailShare,
  computeAirportExpressRailThroughputByRegion,
  nationalAirportExpressRailThroughputIndex,
} from './airport-express-rail-index.ts';
  computeLithiumBrineExportByRegion,
  lithiumBrineExportProductivityMultiplier,
  nationalLithiumBrineExportIndex,
} from '../network/lithium-brine-export-index.ts';
  computeInlandRailExpressByRegion,
  computeInlandRailExpressShare,
  inlandRailExpressProductivityMultiplier,
  nationalInlandRailExpressIndex,
} from '../operations/inland-rail-express-index.ts';
  computeSpaceLaunchLogisticsShare,
  computeSpaceLaunchLogisticsThroughputByRegion,
  nationalSpaceLaunchLogisticsThroughputIndex,
  spaceLaunchLogisticsProductivityMultiplier,
} from './space-launch-logistics-index.ts';
  computeRareEarthMagnetExportByRegion,
  nationalRareEarthMagnetExportIndex,
  rareEarthMagnetExportProductivityMultiplier,
} from '../network/rare-earth-magnet-export-index.ts';
  computeTransTasmanReeferExpressByRegion,
  computeTransTasmanReeferExpressShare,
  nationalTransTasmanReeferExpressIndex,
  transTasmanReeferExpressProductivityMultiplier,
} from '../operations/trans-tasman-reefer-express-index.ts';
  computeZeroEmissionTruckCorridorShare,
  computeZeroEmissionTruckCorridorThroughputByRegion,
  nationalZeroEmissionTruckCorridorThroughputIndex,
  zeroEmissionTruckCorridorProductivityMultiplier,
} from './zero-emission-truck-corridor-index.ts';

function seasonalFreightUtilizationDelta(band?: SeasonalDemandBand): number {
  if (band === 'low') return -0.06;
  if (band === 'peak') return 0.09;
  return 0;
}

const CONDITION_RANK: TransportAssetCondition[] = [
  'excellent',
  'good',
  'fair',
  'degraded',
  'closed',
];

function harsherCondition(a: TransportAssetCondition, b: TransportAssetCondition): TransportAssetCondition {
  return CONDITION_RANK[Math.max(CONDITION_RANK.indexOf(a), CONDITION_RANK.indexOf(b))];
}

function operationalAssets(inputs: TransportProductivityInputs): TransportAsset[] {
  return inputs.assets.filter((a) => inputs.operationalAssetIds.has(a.id));
}

function detectBottlenecks(
  report: NationalTransportProductivityReport,
  assets: TransportAsset[],
  inputs: TransportProductivityInputs,
): string[] {
  const bottlenecks: string[] = [];
  for (const asset of assets) {
    const condition = inputs.conditionByAssetId?.get(asset.id) ?? 'good';
    if (condition === 'degraded' || condition === 'closed') {
      bottlenecks.push(asset.id);
      continue;
    }
    const regional = report.byRegion[asset.hostRegion];
    const contrib = regional.contributions.find((c) => c.assetId === asset.id);
    if (!contrib) continue;
    if (contrib.freightCapacityIndex < 8 && asset.category !== 'logistics') {
      bottlenecks.push(asset.id);
    }
  }
  return bottlenecks.sort();
}

function mergeConditions(
  base: ReadonlyMap<string, TransportAssetCondition> | undefined,
  maintenance: Map<string, TransportAssetCondition>,
): Map<string, TransportAssetCondition> {
  const out = new Map<string, TransportAssetCondition>(base ?? []);
  for (const [id, cond] of maintenance.entries()) {
    out.set(id, harsherCondition(out.get(id) ?? 'good', cond));
  }
  return out;
}

export function computeTransportInfrastructureState(
  baseInputs: TransportProductivityInputs,
  options?: TransportInfrastructureOptions,
): TransportInfrastructureState {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const maintenanceMap = buildConditionMapFromMaintenance(options?.maintenanceBacklogByAssetId);
  const mergedConditions = mergeConditions(baseInputs.conditionByAssetId, maintenanceMap);

  let inputs: TransportProductivityInputs = {
    ...baseInputs,
    conditionByAssetId: mergedConditions,
  };

  const { inputs: scenarioInputs, appliedScenarioIds } = enrichInputsWithScenarios(
    inputs,
    options?.activeScenarioIds,
  );
  const activeScenarios = resolveActiveScenarios(options?.activeScenarioIds);
  const scenarioStackFactor = computeScenarioStackFactor(activeScenarios);
  inputs = {
    ...scenarioInputs,
    networkUtilization: applyScenarioStackToUtilization(scenarioInputs.networkUtilization, scenarioStackFactor),
  };

  const seasonalDelta = seasonalFreightUtilizationDelta(options?.seasonalDemandBand);
  if (seasonalDelta !== 0) {
    const freight = clamp((inputs.networkUtilization?.freight ?? 0.5) + seasonalDelta, 0.05, 1.15);
    inputs = {
      ...inputs,
      networkUtilization: { ...inputs.networkUtilization, freight },
    };
  }

  const climateApplied = applyClimateBandToInputs(inputs, options?.climateBand);
  inputs = climateApplied.inputs;
  const climateModifierFactor = climateApplied.climateModifierFactor;

  const pipeline = computePipelineUnlocks(options?.fundedPipelineStageIds);

  let productivity = computeNationalTransportProductivity(inputs);
  const ops = operationalAssets(inputs);

  const portRailCouplingByRegion = computePortRailCouplingByRegion(ops);
  const investmentTierByRegion = computeInvestmentTierByRegion(ops, portRailCouplingByRegion);

  const corridorActivations = evaluateAllCorridors(ops);
  const corridorSynergyPoints = totalCorridorSynergy(corridorActivations);
  const logisticsRelief = corridorLogisticsRelief(corridorActivations);

  const intermodalSynergyByRegion = computeIntermodalSynergyByRegion(ops);
  const resilienceScoreByRegion = computeResilienceScoreByRegion(ops, corridorActivations);

  for (const code of AU_REGION_CODES) {
    const synergy = intermodalSynergyByRegion[code];
    const tierMul = tierProductivityMultiplier(investmentTierByRegion[code]);
    const couplingBoost = (portRailCouplingByRegion[code] ?? 0) * 0.04;
    const resilienceBoost = (resilienceScoreByRegion[code] ?? 0) * 0.05;
    const corridorShare =
      corridorActivations
        .filter((c) => c.active)
        .reduce((s, c) => s + c.synergyPoints, 0) / Math.max(1, AU_REGION_CODES.length);
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + synergy + corridorShare * 0.15 + couplingBoost + resilienceBoost) *
      tierMul;
    productivity.byRegion[code].logisticsCostMultiplier = clamp(
      productivity.byRegion[code].logisticsCostMultiplier - logisticsRelief * 0.2 - couplingBoost * 0.002,
      0.5,
      1.05,
    );
  }

  productivity.nationalLogisticsCostMultiplier = clamp(
    productivity.nationalLogisticsCostMultiplier - logisticsRelief - pipeline.logisticsRelief,
    0.5,
    1.05,
  );

  const spilloverBonusByRegion = computeSpilloverBonusByRegion(
    ops,
    Object.fromEntries(AU_REGION_CODES.map((c) => [c, productivity.byRegion[c].productivityIndexBonus])) as Record<
      AuRegionCode,
      number
    >,
  );

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus += spilloverBonusByRegion[code];
    productivity.byRegion[code].productivityIndexBonus *= climateModifierFactor;
  }

  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints;

  const fleetCapacity = computeFleetCapacitySnapshot(ops);

  const freightLatencyByRegion = computeFreightLatencyByRegion(
    ops,
    inputs.networkUtilization?.freight ?? 0.5,
  );
  const nationalFreightLatencyMedian = nationalMedianFreightLatency(freightLatencyByRegion);

  const maintenanceWarnings = maintenanceWarningsFromBacklog(options?.maintenanceBacklogByAssetId);
  const bottleneckAssetIds = detectBottlenecks(productivity, ops, inputs);
  const recovery = computeDisruptionRecovery(ops, resilienceScoreByRegion, bottleneckAssetIds.length);

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus *= 0.92 + recovery.nationalRecoveryFactor * 0.08;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints;

  const supplyChain = computeSupplyChainResilienceIndex({
    resilienceScoreByRegion,
    freightLatencyByRegion,
    recoveryFactor: recovery.nationalRecoveryFactor,
    corridorSynergyPoints,
  });

  for (const code of AU_REGION_CODES) {
    productivity.byRegion[code].productivityIndexBonus += supplyChain.byRegion[code] * 2.5;
  }
  productivity.nationalProductivityIndexBonus += supplyChain.nationalIndex * 3;

  const modalBalanceIndex = computeModalBalanceIndex(ops, options?.modalShiftPolicy ?? 'balanced');
  const electrifiedFreightShare = computeElectrifiedFreightShare(ops);
  const lastMileCoverageByRegion = computeLastMileCoverageByRegion(ops);
  const nationalLastMile = nationalLastMileCoverage(lastMileCoverageByRegion);
  const intercapitalConnectivityIndex = computeIntercapitalConnectivityIndex(
    corridorActivations,
    TRANSPORT_CORRIDORS,
  );
  const connectivityBonus = connectivityBonusByRegion(corridorActivations, TRANSPORT_CORRIDORS);
  const modalMult = modalBalanceProductivityMultiplier(modalBalanceIndex, options?.modalShiftPolicy ?? 'balanced');

  for (const code of AU_REGION_CODES) {
    const lastMileBoost = (lastMileCoverageByRegion[code] - 50) * 0.015;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + connectivityBonus[code] + lastMileBoost) *
      modalMult *
      (1 + intercapitalConnectivityIndex * 0.04);
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5;

  const containerThroughputByRegion = computeContainerThroughputByRegion(ops);
  const nationalContainerThroughput = nationalContainerThroughputIndex(containerThroughputByRegion);
  const coldChainReliabilityByRegion = computeColdChainReliabilityByRegion(ops);
  const coldChainReliabilityIndex = nationalColdChainReliabilityIndex(coldChainReliabilityByRegion);
  const greenFreightShare = computeGreenFreightShare(ops, options?.greenFreightPolicy ?? 'baseline');
  const greenMult = greenFreightProductivityMultiplier(greenFreightShare, options?.greenFreightPolicy ?? 'baseline');

  for (const code of AU_REGION_CODES) {
    const throughputBoost = (containerThroughputByRegion[code] - 20) * 0.008;
    const coldBoost = (coldChainReliabilityByRegion[code] - 0.45) * 1.8;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + throughputBoost + coldBoost) * greenMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04;

  const freightUtil = inputs.networkUtilization?.freight ?? 0.5;
  const bulkExportThroughputByRegion = computeBulkExportThroughputByRegion(ops);
  const nationalBulkExport = nationalBulkExportThroughputIndex(bulkExportThroughputByRegion);
  const intermodalDwellByRegion = computeIntermodalDwellByRegion(ops, freightUtil);
  const nationalIntermodalDwell = nationalIntermodalDwellMedian(intermodalDwellByRegion);
  const dwellMult = dwellProductivityPenalty(nationalIntermodalDwell);
  const urbanCongestionByRegion = computeUrbanCongestionByRegion(ops, freightUtil);
  const nationalUrbanCongestion = nationalUrbanCongestionIndex(urbanCongestionByRegion);
  const congestionMult = congestionReliefMultiplier(
    nationalUrbanCongestion,
    options?.congestionReliefPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const bulkBoost = (bulkExportThroughputByRegion[code] - 18) * 0.007;
    const dwellPenalty = (intermodalDwellByRegion[code] - 30) * 0.012;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + bulkBoost - dwellPenalty) *
      dwellMult *
      congestionMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035;

  const aviationCargoThroughputByRegion = computeAviationCargoThroughputByRegion(ops);
  const nationalAviationCargo = nationalAviationCargoThroughputIndex(aviationCargoThroughputByRegion);
  const customsClearanceByRegion = computeCustomsClearanceByRegion(ops, freightUtil);
  const nationalCustomsClearance = nationalCustomsClearanceIndex(customsClearanceByRegion);
  const customsMult = customsClearanceProductivityMultiplier(
    nationalCustomsClearance,
    options?.customsModernizationPolicy ?? 'baseline',
  );
  const hydrogenCorridorThroughputByRegion = computeHydrogenCorridorThroughputByRegion(ops);
  const nationalHydrogenCorridor = nationalHydrogenCorridorThroughputIndex(hydrogenCorridorThroughputByRegion);
  const hydrogenFreightShare = computeHydrogenFreightShare(ops, options?.hydrogenFreightPolicy ?? 'baseline');
  const hydrogenMult = hydrogenFreightProductivityMultiplier(
    hydrogenFreightShare,
    options?.hydrogenFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const aviationBoost = (aviationCargoThroughputByRegion[code] - 12) * 0.006;
    const customsBoost = (customsClearanceByRegion[code] - 40) * 0.005;
    const hydrogenBoost = (hydrogenCorridorThroughputByRegion[code] - 8) * 0.007;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + aviationBoost + customsBoost + hydrogenBoost) *
      customsMult *
      hydrogenMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028;

  const coastalShippingThroughputByRegion = computeCoastalShippingThroughputByRegion(ops);
  const nationalCoastalShipping = nationalCoastalShippingThroughputIndex(coastalShippingThroughputByRegion);
  const coastalMult = coastalShippingProductivityMultiplier(
    nationalCoastalShipping,
    options?.coastalShippingPolicy ?? 'baseline',
  );
  const biosecurityClearanceByRegion = computeBiosecurityClearanceByRegion(ops, freightUtil);
  const nationalBiosecurityClearance = nationalBiosecurityClearanceIndex(biosecurityClearanceByRegion);
  const biosecurityMult = biosecurityClearanceProductivityMultiplier(
    nationalBiosecurityClearance,
    options?.biosecurityStreamlinePolicy ?? 'baseline',
  );
  const autonomousCorridorThroughputByRegion = computeAutonomousCorridorThroughputByRegion(ops);
  const nationalAutonomousCorridor = nationalAutonomousCorridorThroughputIndex(autonomousCorridorThroughputByRegion);
  const autonomousFreightShare = computeAutonomousFreightShare(
    ops,
    options?.autonomousFreightPolicy ?? 'baseline',
  );
  const autonomousMult = autonomousFreightProductivityMultiplier(
    autonomousFreightShare,
    options?.autonomousFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const coastalBoost = (coastalShippingThroughputByRegion[code] - 10) * 0.006;
    const biosecurityBoost = (biosecurityClearanceByRegion[code] - 40) * 0.0045;
    const autonomousBoost = (autonomousCorridorThroughputByRegion[code] - 6) * 0.0065;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + coastalBoost + biosecurityBoost + autonomousBoost) *
      coastalMult *
      biosecurityMult *
      autonomousMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024;

  const networkStress = aggregateNetworkStress(inputs.networkUtilization);
  const deepSeaGatewayThroughputByRegion = computeDeepSeaGatewayThroughputByRegion(ops);
  const nationalDeepSeaGateway = nationalDeepSeaGatewayThroughputIndex(deepSeaGatewayThroughputByRegion);
  const deepSeaMult = deepSeaGatewayProductivityMultiplier(
    nationalDeepSeaGateway,
    options?.deepSeaGatewayPolicy ?? 'baseline',
  );
  const infrastructurePermittingByRegion = computeInfrastructurePermittingByRegion(ops, networkStress);
  const nationalInfrastructurePermitting = nationalInfrastructurePermittingIndex(infrastructurePermittingByRegion);
  const permittingMult = infrastructurePermittingProductivityMultiplier(
    nationalInfrastructurePermitting,
    options?.permittingStreamlinePolicy ?? 'baseline',
  );
  const electricCorridorThroughputByRegion = computeElectricCorridorThroughputByRegion(ops);
  const nationalElectricCorridor = nationalElectricCorridorThroughputIndex(electricCorridorThroughputByRegion);
  const electricFreightShare = computeElectricFreightShare(ops, options?.electricFreightPolicy ?? 'baseline');
  const electricMult = electricFreightProductivityMultiplier(
    electricFreightShare,
    options?.electricFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const deepSeaBoost = (deepSeaGatewayThroughputByRegion[code] - 12) * 0.006;
    const permittingBoost = (infrastructurePermittingByRegion[code] - 42) * 0.004;
    const electricBoost = (electricCorridorThroughputByRegion[code] - 5) * 0.006;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + deepSeaBoost + permittingBoost + electricBoost) *
      deepSeaMult *
      permittingMult *
      electricMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023;

  const climateStress = aggregateNetworkStress(inputs.networkUtilization);
  const defenceLogisticsReadinessByRegion = computeDefenceLogisticsReadinessByRegion(ops);
  const nationalDefenceLogistics = nationalDefenceLogisticsReadinessIndex(defenceLogisticsReadinessByRegion);
  const defenceMult = defenceLogisticsProductivityMultiplier(
    nationalDefenceLogistics,
    options?.defenceMobilityPolicy ?? 'baseline',
  );
  const weatherResilienceRoutingByRegion = computeWeatherResilienceRoutingByRegion(ops, climateStress);
  const nationalWeatherResilience = nationalWeatherResilienceRoutingIndex(weatherResilienceRoutingByRegion);
  const weatherMult = weatherResilienceProductivityMultiplier(
    nationalWeatherResilience,
    options?.weatherResiliencePolicy ?? 'baseline',
  );
  const digitalFreightThroughputByRegion = computeDigitalFreightThroughputByRegion(ops);
  const nationalDigitalFreight = nationalDigitalFreightThroughputIndex(digitalFreightThroughputByRegion);
  const digitalFreightVisibilityShare = computeDigitalFreightVisibilityShare(
    ops,
    options?.digitalFreightPolicy ?? 'baseline',
  );
  const digitalMult = digitalFreightProductivityMultiplier(
    digitalFreightVisibilityShare,
    options?.digitalFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const defenceBoost = (defenceLogisticsReadinessByRegion[code] - 8) * 0.0055;
    const weatherBoost = (weatherResilienceRoutingByRegion[code] - 38) * 0.0042;
    const digitalBoost = (digitalFreightThroughputByRegion[code] - 4) * 0.0058;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + defenceBoost + weatherBoost + digitalBoost) *
      defenceMult *
      weatherMult *
      digitalMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021;

  const tradeUtil = inputs.networkUtilization?.trade ?? freightUtil;
  const criticalMineralsExportByRegion = computeCriticalMineralsExportByRegion(ops);
  const nationalCriticalMinerals = nationalCriticalMineralsExportIndex(criticalMineralsExportByRegion);
  const mineralsMult = criticalMineralsProductivityMultiplier(
    nationalCriticalMinerals,
    options?.criticalMineralsPolicy ?? 'baseline',
  );
  const channelMaintenanceByRegion = computeChannelMaintenanceByRegion(ops, tradeUtil);
  const nationalChannelMaintenance = nationalChannelMaintenanceIndex(channelMaintenanceByRegion);
  const channelMult = channelMaintenanceProductivityMultiplier(
    nationalChannelMaintenance,
    options?.channelMaintenancePolicy ?? 'baseline',
  );
  const indigenousRemoteSupplyThroughputByRegion = computeIndigenousRemoteSupplyThroughputByRegion(ops);
  const nationalIndigenousRemoteSupply = nationalIndigenousRemoteSupplyThroughputIndex(
    indigenousRemoteSupplyThroughputByRegion,
  );
  const indigenousRemoteSupplyShare = computeIndigenousRemoteSupplyShare(
    ops,
    options?.indigenousRemoteSupplyPolicy ?? 'baseline',
  );
  const indigenousMult = indigenousRemoteSupplyProductivityMultiplier(
    indigenousRemoteSupplyShare,
    options?.indigenousRemoteSupplyPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const mineralsBoost = (criticalMineralsExportByRegion[code] - 9) * 0.0058;
    const channelBoost = (channelMaintenanceByRegion[code] - 42) * 0.004;
    const indigenousBoost = (indigenousRemoteSupplyThroughputByRegion[code] - 3) * 0.0055;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + mineralsBoost + channelBoost + indigenousBoost) *
      mineralsMult *
      channelMult *
      indigenousMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019;

  const gaugeInteroperabilityByRegion = computeGaugeInteroperabilityByRegion(ops);
  const nationalGaugeInteroperability = nationalGaugeInteroperabilityIndex(gaugeInteroperabilityByRegion);
  const gaugeMult = gaugeInteroperabilityProductivityMultiplier(
    nationalGaugeInteroperability,
    options?.gaugeInteroperabilityPolicy ?? 'baseline',
  );
  const disasterRecoveryStagingByRegion = computeDisasterRecoveryStagingByRegion(ops, networkStress);
  const nationalDisasterRecoveryStaging = nationalDisasterRecoveryStagingIndex(disasterRecoveryStagingByRegion);
  const disasterMult = disasterRecoveryStagingProductivityMultiplier(
    nationalDisasterRecoveryStaging,
    options?.disasterRecoveryStagingPolicy ?? 'baseline',
  );
  const circularFreightThroughputByRegion = computeCircularFreightThroughputByRegion(ops);
  const nationalCircularFreight = nationalCircularFreightThroughputIndex(circularFreightThroughputByRegion);
  const circularFreightShare = computeCircularFreightShare(ops, options?.circularFreightPolicy ?? 'baseline');
  const circularMult = circularFreightProductivityMultiplier(
    circularFreightShare,
    options?.circularFreightPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const gaugeBoost = (gaugeInteroperabilityByRegion[code] - 12) * 0.005;
    const disasterBoost = (disasterRecoveryStagingByRegion[code] - 36) * 0.0043;
    const circularBoost = (circularFreightThroughputByRegion[code] - 3) * 0.0055;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + gaugeBoost + disasterBoost + circularBoost) *
      gaugeMult *
      disasterMult *
      circularMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018;

  const agriculturalExportThroughputByRegion = computeAgriculturalExportThroughputByRegion(ops);
  const nationalAgriculturalExport = nationalAgriculturalExportThroughputIndex(agriculturalExportThroughputByRegion);
  const agriculturalMult = agriculturalExportProductivityMultiplier(
    nationalAgriculturalExport,
    options?.agriculturalExportPolicy ?? 'baseline',
  );
  const trackPossessionEfficiencyByRegion = computeTrackPossessionEfficiencyByRegion(ops, networkStress);
  const nationalTrackPossession = nationalTrackPossessionEfficiencyIndex(trackPossessionEfficiencyByRegion);
  const trackPossessionMult = trackPossessionProductivityMultiplier(
    nationalTrackPossession,
    options?.trackPossessionPolicy ?? 'baseline',
  );
  const greenBunkeringThroughputByRegion = computeGreenBunkeringThroughputByRegion(ops);
  const nationalGreenBunkering = nationalGreenBunkeringThroughputIndex(greenBunkeringThroughputByRegion);
  const greenBunkeringShare = computeGreenBunkeringShare(ops, options?.greenBunkeringPolicy ?? 'baseline');
  const greenBunkeringMult = greenBunkeringProductivityMultiplier(
    greenBunkeringShare,
    options?.greenBunkeringPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const agriculturalBoost = (agriculturalExportThroughputByRegion[code] - 8) * 0.0056;
    const trackBoost = (trackPossessionEfficiencyByRegion[code] - 38) * 0.0041;
    const bunkeringBoost = (greenBunkeringThroughputByRegion[code] - 3) * 0.0054;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + agriculturalBoost + trackBoost + bunkeringBoost) *
      agriculturalMult *
      trackPossessionMult *
      greenBunkeringMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017;

  const pacificFeederThroughputByRegion = computePacificFeederThroughputByRegion(ops);
  const nationalPacificFeeder = nationalPacificFeederThroughputIndex(pacificFeederThroughputByRegion);
  const pacificMult = pacificFeederProductivityMultiplier(
    nationalPacificFeeder,
    options?.pacificFeederPolicy ?? 'baseline',
  );
  const medicalSupplyChainByRegion = computeMedicalSupplyChainByRegion(ops, networkStress);
  const nationalMedicalSupply = nationalMedicalSupplyChainIndex(medicalSupplyChainByRegion);
  const medicalMult = medicalSupplyProductivityMultiplier(
    nationalMedicalSupply,
    options?.medicalSupplyPolicy ?? 'baseline',
  );
  const dataCentreLogisticsThroughputByRegion = computeDataCentreLogisticsThroughputByRegion(ops);
  const nationalDataCentreLogistics = nationalDataCentreLogisticsThroughputIndex(
    dataCentreLogisticsThroughputByRegion,
  );
  const dataCentreLogisticsShare = computeDataCentreLogisticsShare(
    ops,
    options?.dataCentreLogisticsPolicy ?? 'baseline',
  );
  const dataCentreMult = dataCentreLogisticsProductivityMultiplier(
    dataCentreLogisticsShare,
    options?.dataCentreLogisticsPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const pacificBoost = (pacificFeederThroughputByRegion[code] - 7) * 0.0055;
    const medicalBoost = (medicalSupplyChainByRegion[code] - 36) * 0.0044;
    const dataCentreBoost = (dataCentreLogisticsThroughputByRegion[code] - 3) * 0.0056;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus + pacificBoost + medicalBoost + dataCentreBoost) *
      pacificMult *
      medicalMult *
      dataCentreMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017 +
    nationalPacificFeeder * 0.019 +
    nationalDataCentreLogistics * 0.018;

  const offshoreWindLogisticsByRegion = computeOffshoreWindLogisticsByRegion(ops);
  const nationalOffshoreWind = nationalOffshoreWindLogisticsIndex(offshoreWindLogisticsByRegion);
  const offshoreMult = offshoreWindLogisticsProductivityMultiplier(
    nationalOffshoreWind,
    options?.offshoreWindLogisticsPolicy ?? 'baseline',
  );
  const batterySupplyChainByRegion = computeBatterySupplyChainByRegion(ops, networkStress);
  const nationalBatterySupply = nationalBatterySupplyChainIndex(batterySupplyChainByRegion);
  const batteryMult = batterySupplyProductivityMultiplier(
    nationalBatterySupply,
    options?.batterySupplyChainPolicy ?? 'baseline',
  );
  const cruiseTurnaroundThroughputByRegion = computeCruiseTurnaroundThroughputByRegion(ops);
  const nationalCruiseTurnaround = nationalCruiseTurnaroundThroughputIndex(cruiseTurnaroundThroughputByRegion);
  const cruiseTurnaroundShare = computeCruiseTurnaroundShare(
    ops,
    options?.cruiseTurnaroundPolicy ?? 'baseline',
  );
  const cruiseMult = cruiseTurnaroundProductivityMultiplier(
    cruiseTurnaroundShare,
    options?.cruiseTurnaroundPolicy ?? 'baseline',
  );
  const subseaCableLandingByRegion = computeSubseaCableLandingByRegion(ops);
  const nationalSubseaCable = nationalSubseaCableLandingIndex(subseaCableLandingByRegion);
  const subseaMult = subseaCableLandingProductivityMultiplier(
    nationalSubseaCable,
    options?.subseaCableLandingPolicy ?? 'baseline',
  );
  const greenAmmoniaExportByRegion = computeGreenAmmoniaExportByRegion(ops, networkStress);
  const nationalGreenAmmonia = nationalGreenAmmoniaExportIndex(greenAmmoniaExportByRegion);
  const ammoniaMult = greenAmmoniaExportProductivityMultiplier(
    nationalGreenAmmonia,
    options?.greenAmmoniaExportPolicy ?? 'baseline',
  );
  const airportExpressRailThroughputByRegion = computeAirportExpressRailThroughputByRegion(ops);
  const nationalAirportExpress = nationalAirportExpressRailThroughputIndex(airportExpressRailThroughputByRegion);
  const airportExpressRailShare = computeAirportExpressRailShare(
    ops,
    options?.airportExpressRailPolicy ?? 'baseline',
  );
  const airportExpressMult = airportExpressRailProductivityMultiplier(
    airportExpressRailShare,
    options?.airportExpressRailPolicy ?? 'baseline',
  );
  const lithiumBrineExportByRegion = computeLithiumBrineExportByRegion(ops);
  const nationalLithiumBrine = nationalLithiumBrineExportIndex(lithiumBrineExportByRegion);
  const lithiumMult = lithiumBrineExportProductivityMultiplier(
    nationalLithiumBrine,
    options?.lithiumBrineExportPolicy ?? 'baseline',
  );
  const inlandRailExpressByRegion = computeInlandRailExpressByRegion(ops, networkStress);
  const nationalInlandRailExpress = nationalInlandRailExpressIndex(inlandRailExpressByRegion);
  const inlandRailExpressShare = computeInlandRailExpressShare(
    ops,
    options?.inlandRailExpressPolicy ?? 'baseline',
  );
  const inlandExpressMult = inlandRailExpressProductivityMultiplier(
    inlandRailExpressShare,
    options?.inlandRailExpressPolicy ?? 'baseline',
  );
  const spaceLaunchLogisticsThroughputByRegion = computeSpaceLaunchLogisticsThroughputByRegion(ops);
  const nationalSpaceLaunch = nationalSpaceLaunchLogisticsThroughputIndex(spaceLaunchLogisticsThroughputByRegion);
  const spaceLaunchLogisticsShare = computeSpaceLaunchLogisticsShare(
    ops,
    options?.spaceLaunchLogisticsPolicy ?? 'baseline',
  );
  const spaceLaunchMult = spaceLaunchLogisticsProductivityMultiplier(
    spaceLaunchLogisticsShare,
    options?.spaceLaunchLogisticsPolicy ?? 'baseline',
  );
  const rareEarthMagnetExportByRegion = computeRareEarthMagnetExportByRegion(ops);
  const nationalRareEarthMagnet = nationalRareEarthMagnetExportIndex(rareEarthMagnetExportByRegion);
  const rareEarthMult = rareEarthMagnetExportProductivityMultiplier(
    nationalRareEarthMagnet,
    options?.rareEarthMagnetExportPolicy ?? 'baseline',
  );
  const transTasmanReeferExpressByRegion = computeTransTasmanReeferExpressByRegion(ops, networkStress);
  const nationalTransTasmanReefer = nationalTransTasmanReeferExpressIndex(transTasmanReeferExpressByRegion);
  const transTasmanReeferExpressShare = computeTransTasmanReeferExpressShare(
    ops,
    options?.transTasmanReeferExpressPolicy ?? 'baseline',
  );
  const reeferMult = transTasmanReeferExpressProductivityMultiplier(
    transTasmanReeferExpressShare,
    options?.transTasmanReeferExpressPolicy ?? 'baseline',
  );
  const zeroEmissionTruckCorridorThroughputByRegion = computeZeroEmissionTruckCorridorThroughputByRegion(ops);
  const nationalZeroEmissionTruck = nationalZeroEmissionTruckCorridorThroughputIndex(
    zeroEmissionTruckCorridorThroughputByRegion,
  );
  const zeroEmissionTruckCorridorShare = computeZeroEmissionTruckCorridorShare(
    ops,
    options?.zeroEmissionTruckCorridorPolicy ?? 'baseline',
  );
  const zetMult = zeroEmissionTruckCorridorProductivityMultiplier(
    zeroEmissionTruckCorridorShare,
    options?.zeroEmissionTruckCorridorPolicy ?? 'baseline',
  );

  for (const code of AU_REGION_CODES) {
    const offshoreBoost = (offshoreWindLogisticsByRegion[code] - 5) * 0.0053;
    const batteryBoost = (batterySupplyChainByRegion[code] - 16) * 0.0046;
    const cruiseBoost = (cruiseTurnaroundThroughputByRegion[code] - 2) * 0.0051;
    const subseaBoost = (subseaCableLandingByRegion[code] - 4) * 0.005;
    const ammoniaBoost = (greenAmmoniaExportByRegion[code] - 12) * 0.0045;
    const airportBoost = (airportExpressRailThroughputByRegion[code] - 2) * 0.0049;
    const lithiumBoost = (lithiumBrineExportByRegion[code] - 5) * 0.0048;
    const inlandExpressBoost = (inlandRailExpressByRegion[code] - 10) * 0.0044;
    const spaceLaunchBoost = (spaceLaunchLogisticsThroughputByRegion[code] - 1) * 0.0046;
    const rareEarthBoost = (rareEarthMagnetExportByRegion[code] - 5) * 0.0047;
    const reeferBoost = (transTasmanReeferExpressByRegion[code] - 8) * 0.0043;
    const zetBoost = (zeroEmissionTruckCorridorThroughputByRegion[code] - 2) * 0.0045;
    productivity.byRegion[code].productivityIndexBonus =
      (productivity.byRegion[code].productivityIndexBonus +
        offshoreBoost +
        batteryBoost +
        cruiseBoost +
        subseaBoost +
        ammoniaBoost +
        airportBoost +
        lithiumBoost +
        inlandExpressBoost +
        spaceLaunchBoost +
        rareEarthBoost +
        reeferBoost +
        zetBoost) *
      offshoreMult *
      batteryMult *
      cruiseMult *
      subseaMult *
      ammoniaMult *
      airportExpressMult *
      lithiumMult *
      inlandExpressMult *
      spaceLaunchMult *
      rareEarthMult *
      reeferMult *
      zetMult;
  }
  productivity.nationalProductivityIndexBonus =
    AU_REGION_CODES.reduce((s, c) => s + productivity.byRegion[c].productivityIndexBonus, 0) +
    pipeline.productivityPoints +
    intercapitalConnectivityIndex * 2.5 +
    nationalContainerThroughput * 0.04 +
    nationalBulkExport * 0.035 +
    nationalAviationCargo * 0.03 +
    nationalHydrogenCorridor * 0.028 +
    nationalCoastalShipping * 0.026 +
    nationalAutonomousCorridor * 0.024 +
    nationalDeepSeaGateway * 0.027 +
    nationalElectricCorridor * 0.023 +
    nationalDefenceLogistics * 0.022 +
    nationalDigitalFreight * 0.021 +
    nationalCriticalMinerals * 0.024 +
    nationalIndigenousRemoteSupply * 0.019 +
    nationalGaugeInteroperability * 0.02 +
    nationalCircularFreight * 0.018 +
    nationalAgriculturalExport * 0.022 +
    nationalGreenBunkering * 0.017 +
    nationalPacificFeeder * 0.019 +
    nationalDataCentreLogistics * 0.018 +
    nationalOffshoreWind * 0.017 +
    nationalBatterySupply * 0.016 +
    nationalCruiseTurnaround * 0.015 +
    nationalSubseaCable * 0.014 +
    nationalGreenAmmonia * 0.014 +
    nationalAirportExpress * 0.013 +
    nationalLithiumBrine * 0.012 +
    nationalInlandRailExpress * 0.012 +
    nationalSpaceLaunch * 0.011 +
    nationalRareEarthMagnet * 0.011 +
    nationalTransTasmanReefer * 0.01 +
    nationalZeroEmissionTruck * 0.01;

  const projectedBacklogNextTurn = projectMaintenanceBacklogNextTurn(
    options?.maintenanceBacklogByAssetId,
    baseInputs.operationalAssetIds,
    {
      networkStress: aggregateNetworkStress(inputs.networkUtilization),
      maintenanceSpendIndex: options?.maintenanceSpendIndex,
    },
  );

  const computeMs =
    (typeof performance !== 'undefined' ? performance.now() : Date.now()) - t0 + productivity.computeMs;

  return {
    schemaVersion: 'agent12/20',
    turn: baseInputs.turn,
    productivity,
    activeCorridors: corridorActivations,
    corridorSynergyPoints,
    intermodalSynergyByRegion,
    appliedScenarioIds,
    bottleneckAssetIds,
    maintenanceWarnings,
    resilienceScoreByRegion,
    portRailCouplingByRegion,
    investmentTierByRegion,
    scenarioStackFactor,
    projectedBacklogNextTurn,
    spilloverBonusByRegion,
    fleetCapacity,
    climateModifierFactor,
    pipelineUnlockPoints: pipeline.productivityPoints,
    activePipelineStageIds: pipeline.activeStageIds,
    freightLatencyByRegion,
    nationalFreightLatencyMedian,
    supplyChainResilienceIndex: supplyChain.nationalIndex,
    supplyChainResilienceByRegion: supplyChain.byRegion,
    weakestSupplyChainRegion: supplyChain.weakestRegion,
    disruptionRecoveryFactor: recovery.nationalRecoveryFactor,
    intercapitalConnectivityIndex,
    modalBalanceIndex,
    electrifiedFreightShare,
    lastMileCoverageByRegion,
    nationalLastMileCoverage: nationalLastMile,
    nationalContainerThroughputIndex: nationalContainerThroughput,
    containerThroughputByRegion,
    coldChainReliabilityIndex,
    coldChainReliabilityByRegion,
    greenFreightShare,
    nationalBulkExportThroughputIndex: nationalBulkExport,
    bulkExportThroughputByRegion,
    nationalIntermodalDwellMedian: nationalIntermodalDwell,
    intermodalDwellByRegion,
    nationalUrbanCongestionIndex: nationalUrbanCongestion,
    urbanCongestionByRegion,
    nationalAviationCargoThroughputIndex: nationalAviationCargo,
    aviationCargoThroughputByRegion,
    nationalCustomsClearanceIndex: nationalCustomsClearance,
    customsClearanceByRegion,
    hydrogenFreightShare,
    nationalHydrogenCorridorThroughputIndex: nationalHydrogenCorridor,
    hydrogenCorridorThroughputByRegion,
    nationalCoastalShippingThroughputIndex: nationalCoastalShipping,
    coastalShippingThroughputByRegion,
    nationalBiosecurityClearanceIndex: nationalBiosecurityClearance,
    biosecurityClearanceByRegion,
    autonomousFreightShare,
    nationalAutonomousCorridorThroughputIndex: nationalAutonomousCorridor,
    autonomousCorridorThroughputByRegion,
    nationalDeepSeaGatewayThroughputIndex: nationalDeepSeaGateway,
    deepSeaGatewayThroughputByRegion,
    nationalInfrastructurePermittingIndex: nationalInfrastructurePermitting,
    infrastructurePermittingByRegion,
    electricFreightShare,
    nationalElectricCorridorThroughputIndex: nationalElectricCorridor,
    electricCorridorThroughputByRegion,
    nationalDefenceLogisticsReadinessIndex: nationalDefenceLogistics,
    defenceLogisticsReadinessByRegion,
    nationalWeatherResilienceRoutingIndex: nationalWeatherResilience,
    weatherResilienceRoutingByRegion,
    digitalFreightVisibilityShare,
    nationalDigitalFreightThroughputIndex: nationalDigitalFreight,
    digitalFreightThroughputByRegion,
    nationalCriticalMineralsExportIndex: nationalCriticalMinerals,
    criticalMineralsExportByRegion,
    nationalChannelMaintenanceIndex: nationalChannelMaintenance,
    channelMaintenanceByRegion,
    indigenousRemoteSupplyShare,
    nationalIndigenousRemoteSupplyThroughputIndex: nationalIndigenousRemoteSupply,
    indigenousRemoteSupplyThroughputByRegion,
    nationalGaugeInteroperabilityIndex: nationalGaugeInteroperability,
    gaugeInteroperabilityByRegion,
    nationalDisasterRecoveryStagingIndex: nationalDisasterRecoveryStaging,
    disasterRecoveryStagingByRegion,
    circularFreightShare,
    nationalCircularFreightThroughputIndex: nationalCircularFreight,
    circularFreightThroughputByRegion,
    nationalAgriculturalExportThroughputIndex: nationalAgriculturalExport,
    agriculturalExportThroughputByRegion,
    nationalTrackPossessionEfficiencyIndex: nationalTrackPossession,
    trackPossessionEfficiencyByRegion,
    greenBunkeringShare,
    nationalGreenBunkeringThroughputIndex: nationalGreenBunkering,
    greenBunkeringThroughputByRegion,
    nationalPacificFeederThroughputIndex: nationalPacificFeeder,
    pacificFeederThroughputByRegion,
    nationalMedicalSupplyChainIndex: nationalMedicalSupply,
    medicalSupplyChainByRegion,
    dataCentreLogisticsShare,
    nationalDataCentreLogisticsThroughputIndex: nationalDataCentreLogistics,
    dataCentreLogisticsThroughputByRegion,
    nationalOffshoreWindLogisticsIndex: nationalOffshoreWind,
    offshoreWindLogisticsByRegion,
    nationalBatterySupplyChainIndex: nationalBatterySupply,
    batterySupplyChainByRegion,
    cruiseTurnaroundShare,
    nationalCruiseTurnaroundThroughputIndex: nationalCruiseTurnaround,
    cruiseTurnaroundThroughputByRegion,
    nationalSubseaCableLandingIndex: nationalSubseaCable,
    subseaCableLandingByRegion,
    nationalGreenAmmoniaExportIndex: nationalGreenAmmonia,
    greenAmmoniaExportByRegion,
    airportExpressRailShare,
    nationalAirportExpressRailThroughputIndex: nationalAirportExpress,
    airportExpressRailThroughputByRegion,
    nationalLithiumBrineExportIndex: nationalLithiumBrine,
    lithiumBrineExportByRegion,
    inlandRailExpressShare,
    nationalInlandRailExpressIndex: nationalInlandRailExpress,
    inlandRailExpressByRegion,
    spaceLaunchLogisticsShare,
    nationalSpaceLaunchLogisticsThroughputIndex: nationalSpaceLaunch,
    spaceLaunchLogisticsThroughputByRegion,
    nationalRareEarthMagnetExportIndex: nationalRareEarthMagnet,
    rareEarthMagnetExportByRegion,
    transTasmanReeferExpressShare,
    nationalTransTasmanReeferExpressIndex: nationalTransTasmanReefer,
    transTasmanReeferExpressByRegion,
    zeroEmissionTruckCorridorShare,
    nationalZeroEmissionTruckCorridorThroughputIndex: nationalZeroEmissionTruck,
    zeroEmissionTruckCorridorThroughputByRegion,
    computeMs,
  };
}

export function defaultInfrastructureInputs(turn: number): TransportProductivityInputs {
  const assets = getAgent12TransportCatalog();
  return {
    turn,
    assets,
    operationalAssetIds: new Set(assets.map((a) => a.id)),
  };
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
    ok: integrity.duplicateIds.length === 0 && integrity.invalidRegions.length === 0 && integrity.totalAssets >= 100,
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
  const withProject = computeNationalTransportProductivity({
    turn: 2,
    assets: getAgent12TransportCatalog(),
    operationalAssetIds: getDefaultOperationalAssetIds(),
    activeProjectIds: new Set(['infra_v93_wa_freight_rail']),
  });
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

  const infra = computeTransportInfrastructureState(defaultInfrastructureInputs(5));
  results.push({
    id: 'infrastructure_state_v9',
    ok:
      infra.schemaVersion === 'agent12/20' &&
      infra.corridorSynergyPoints > 0 &&
      infra.activeCorridors.some((c) => c.active) &&
      infra.scenarioStackFactor >= 1 &&
      infra.supplyChainResilienceIndex > 0.2 &&
      infra.nationalFreightLatencyMedian > 0 &&
      infra.intercapitalConnectivityIndex > 0.15 &&
      infra.modalBalanceIndex > 0.2 &&
      infra.nationalLastMileCoverage > 45 &&
      infra.nationalContainerThroughputIndex > 15 &&
      infra.coldChainReliabilityIndex > 0.35 &&
      infra.greenFreightShare > 0.12 &&
      infra.nationalBulkExportThroughputIndex > 18 &&
      infra.nationalIntermodalDwellMedian > 10 &&
      infra.nationalUrbanCongestionIndex > 15 &&
      infra.nationalAviationCargoThroughputIndex > 9 &&
      infra.nationalCustomsClearanceIndex > 35 &&
      infra.hydrogenFreightShare >= 0.04 &&
      infra.nationalHydrogenCorridorThroughputIndex > 2 &&
      infra.nationalCoastalShippingThroughputIndex > 8 &&
      infra.nationalBiosecurityClearanceIndex > 36 &&
      infra.autonomousFreightShare >= 0.05 &&
      infra.nationalAutonomousCorridorThroughputIndex >= 2 &&
      infra.nationalDeepSeaGatewayThroughputIndex > 10 &&
      infra.nationalInfrastructurePermittingIndex > 38 &&
      infra.electricFreightShare >= 0.06 &&
      infra.nationalElectricCorridorThroughputIndex >= 2 &&
      infra.nationalDefenceLogisticsReadinessIndex >= 8 &&
      infra.nationalWeatherResilienceRoutingIndex > 38 &&
      infra.digitalFreightVisibilityShare >= 0.07 &&
      infra.nationalDigitalFreightThroughputIndex >= 2 &&
      infra.nationalCriticalMineralsExportIndex >= 10 &&
      infra.nationalChannelMaintenanceIndex > 40 &&
      infra.indigenousRemoteSupplyShare >= 0.08 &&
      infra.nationalIndigenousRemoteSupplyThroughputIndex >= 2 &&
      infra.nationalGaugeInteroperabilityIndex >= 12 &&
      infra.nationalDisasterRecoveryStagingIndex > 37 &&
      infra.circularFreightShare >= 0.06 &&
      infra.nationalCircularFreightThroughputIndex >= 2 &&
      infra.nationalAgriculturalExportThroughputIndex >= 9 &&
      infra.nationalTrackPossessionEfficiencyIndex >= 38 &&
      infra.greenBunkeringShare >= 0.05 &&
      infra.nationalGreenBunkeringThroughputIndex >= 2 &&
      infra.nationalPacificFeederThroughputIndex >= 7 &&
      infra.nationalMedicalSupplyChainIndex >= 36 &&
      infra.dataCentreLogisticsShare >= 0.06 &&
      infra.nationalDataCentreLogisticsThroughputIndex >= 2 &&
      infra.nationalOffshoreWindLogisticsIndex >= 6 &&
      infra.nationalBatterySupplyChainIndex >= 18 &&
      infra.cruiseTurnaroundShare >= 0.04 &&
      infra.nationalCruiseTurnaroundThroughputIndex >= 2 &&
      infra.nationalSubseaCableLandingIndex >= 5 &&
      infra.nationalGreenAmmoniaExportIndex >= 12 &&
      infra.airportExpressRailShare >= 0.04 &&
      infra.nationalAirportExpressRailThroughputIndex >= 2 &&
      infra.nationalLithiumBrineExportIndex >= 6 &&
      infra.nationalInlandRailExpressIndex >= 10 &&
      infra.spaceLaunchLogisticsShare >= 0.03 &&
      infra.nationalSpaceLaunchLogisticsThroughputIndex >= 1.5 &&
      infra.nationalRareEarthMagnetExportIndex >= 6 &&
      infra.nationalTransTasmanReeferExpressIndex >= 8 &&
      infra.zeroEmissionTruckCorridorShare >= 0.034 &&
      infra.nationalZeroEmissionTruckCorridorThroughputIndex >= 2,
    detail: `synergy=${infra.corridorSynergyPoints.toFixed(1)} rareEarth=${infra.nationalRareEarthMagnetExportIndex.toFixed(1)} reefer=${infra.nationalTransTasmanReeferExpressIndex.toFixed(1)} zet=${infra.nationalZeroEmissionTruckCorridorThroughputIndex.toFixed(1)}`,
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
