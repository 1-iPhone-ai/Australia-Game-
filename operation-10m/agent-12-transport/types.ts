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

export type OffshoreCcsLogisticsPolicy = 'baseline' | 'deploy';

export type HydrogenLngExportPolicy = 'baseline' | 'accelerate';

export type UrbanMicrofreightHubPolicy = 'baseline' | 'expand';

export type FloatingOffshoreWindStagingPolicy = 'baseline' | 'deploy';

export type CriticalMedicineAirliftPolicy = 'baseline' | 'surge';

export type RegionalFreightDronePolicy = 'baseline' | 'expand';

export type GridBatteryLogisticsPolicy = 'baseline' | 'accelerate';

export type PacificHumanitarianSealiftPolicy = 'baseline' | 'surge';

export type AutonomousPortTractorPolicy = 'baseline' | 'deploy';

export type AutonomousHeavyHaulPolicy = 'baseline' | 'deploy';

export type GbrBiosecurityLogisticsPolicy = 'baseline' | 'harden';

export type NightUrbanFreightWindowPolicy = 'baseline' | 'expand';

export type MethanolBunkeringExportPolicy = 'baseline' | 'accelerate';

export type AntarcticResupplyLogisticsPolicy = 'baseline' | 'surge';

export type SmartBorderPreclearancePolicy = 'baseline' | 'deploy';

export type SustainableAviationFuelSupplyPolicy = 'baseline' | 'expand';

export type OutbackDieselSecurityPolicy = 'baseline' | 'harden';

export type RailDoubleStackContainerPolicy = 'baseline' | 'deploy';

export type GreenSteelExportPolicy = 'baseline' | 'accelerate';

export type IndigenousCommunityAirliftPolicy = 'baseline' | 'expand';

export type PortBerthSlotOptimizerPolicy = 'baseline' | 'deploy';

export type OffshoreWindTowInstallPolicy = 'baseline' | 'deploy';

export type EvBatteryRecyclingLogisticsPolicy = 'baseline' | 'accelerate';

export type UrbanCourierMicrohubPolicy = 'baseline' | 'expand';

export type CopperConcentrateExportPolicy = 'baseline' | 'accelerate';

export type PharmaceuticalColdChainPolicy = 'baseline' | 'surge';

export type RailPassengerFreightPathPolicy = 'baseline' | 'expand';

export type AluminaRefineryExportPolicy = 'baseline' | 'accelerate';

export type DisasterReliefAirBridgePolicy = 'baseline' | 'surge';

export type ContainerYardAutomationPolicy = 'baseline' | 'deploy';

export type NickelCobaltBatteryPrecursorPolicy = 'baseline' | 'accelerate';

export type RemoteIslandSealiftPolicy = 'baseline' | 'surge';

export type RailInlandTerminalAutomationPolicy = 'baseline' | 'deploy';

export interface TransportInfrastructureState {
  schemaVersion: 'agent12/31';
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
  nationalOffshoreCcsLogisticsIndex: number;
  offshoreCcsLogisticsByRegion: Record<AuRegionCode, number>;
  nationalHydrogenLngExportIndex: number;
  hydrogenLngExportByRegion: Record<AuRegionCode, number>;
  urbanMicrofreightHubShare: number;
  nationalUrbanMicrofreightHubThroughputIndex: number;
  urbanMicrofreightHubThroughputByRegion: Record<AuRegionCode, number>;
  nationalFloatingOffshoreWindStagingIndex: number;
  floatingOffshoreWindStagingByRegion: Record<AuRegionCode, number>;
  criticalMedicineAirliftShare: number;
  nationalCriticalMedicineAirliftIndex: number;
  criticalMedicineAirliftByRegion: Record<AuRegionCode, number>;
  regionalFreightDroneShare: number;
  nationalRegionalFreightDroneThroughputIndex: number;
  regionalFreightDroneThroughputByRegion: Record<AuRegionCode, number>;
  nationalGridBatteryLogisticsIndex: number;
  gridBatteryLogisticsByRegion: Record<AuRegionCode, number>;
  pacificHumanitarianSealiftShare: number;
  nationalPacificHumanitarianSealiftIndex: number;
  pacificHumanitarianSealiftByRegion: Record<AuRegionCode, number>;
  autonomousPortTractorShare: number;
  nationalAutonomousPortTractorThroughputIndex: number;
  autonomousPortTractorThroughputByRegion: Record<AuRegionCode, number>;
  nationalAutonomousHeavyHaulIndex: number;
  autonomousHeavyHaulByRegion: Record<AuRegionCode, number>;
  gbrBiosecurityLogisticsShare: number;
  nationalGbrBiosecurityLogisticsIndex: number;
  gbrBiosecurityLogisticsByRegion: Record<AuRegionCode, number>;
  nightUrbanFreightWindowShare: number;
  nationalNightUrbanFreightWindowThroughputIndex: number;
  nightUrbanFreightWindowThroughputByRegion: Record<AuRegionCode, number>;
  nationalMethanolBunkeringExportIndex: number;
  methanolBunkeringExportByRegion: Record<AuRegionCode, number>;
  antarcticResupplyLogisticsShare: number;
  nationalAntarcticResupplyLogisticsIndex: number;
  antarcticResupplyLogisticsByRegion: Record<AuRegionCode, number>;
  smartBorderPreclearanceShare: number;
  nationalSmartBorderPreclearanceThroughputIndex: number;
  smartBorderPreclearanceThroughputByRegion: Record<AuRegionCode, number>;
  nationalSustainableAviationFuelSupplyIndex: number;
  sustainableAviationFuelSupplyByRegion: Record<AuRegionCode, number>;
  outbackDieselSecurityShare: number;
  nationalOutbackDieselSecurityIndex: number;
  outbackDieselSecurityByRegion: Record<AuRegionCode, number>;
  railDoubleStackContainerShare: number;
  nationalRailDoubleStackContainerThroughputIndex: number;
  railDoubleStackContainerThroughputByRegion: Record<AuRegionCode, number>;
  nationalGreenSteelExportIndex: number;
  greenSteelExportByRegion: Record<AuRegionCode, number>;
  indigenousCommunityAirliftShare: number;
  nationalIndigenousCommunityAirliftIndex: number;
  indigenousCommunityAirliftByRegion: Record<AuRegionCode, number>;
  portBerthSlotOptimizerShare: number;
  nationalPortBerthSlotOptimizerThroughputIndex: number;
  portBerthSlotOptimizerThroughputByRegion: Record<AuRegionCode, number>;
  nationalOffshoreWindTowInstallIndex: number;
  offshoreWindTowInstallByRegion: Record<AuRegionCode, number>;
  evBatteryRecyclingLogisticsShare: number;
  nationalEvBatteryRecyclingLogisticsIndex: number;
  evBatteryRecyclingLogisticsByRegion: Record<AuRegionCode, number>;
  urbanCourierMicrohubShare: number;
  nationalUrbanCourierMicrohubThroughputIndex: number;
  urbanCourierMicrohubThroughputByRegion: Record<AuRegionCode, number>;
  nationalCopperConcentrateExportIndex: number;
  copperConcentrateExportByRegion: Record<AuRegionCode, number>;
  pharmaceuticalColdChainShare: number;
  nationalPharmaceuticalColdChainIndex: number;
  pharmaceuticalColdChainByRegion: Record<AuRegionCode, number>;
  railPassengerFreightPathShare: number;
  nationalRailPassengerFreightPathThroughputIndex: number;
  railPassengerFreightPathThroughputByRegion: Record<AuRegionCode, number>;
  nationalAluminaRefineryExportIndex: number;
  aluminaRefineryExportByRegion: Record<AuRegionCode, number>;
  disasterReliefAirBridgeShare: number;
  nationalDisasterReliefAirBridgeIndex: number;
  disasterReliefAirBridgeByRegion: Record<AuRegionCode, number>;
  containerYardAutomationShare: number;
  nationalContainerYardAutomationThroughputIndex: number;
  containerYardAutomationThroughputByRegion: Record<AuRegionCode, number>;
  nationalNickelCobaltBatteryPrecursorIndex: number;
  nickelCobaltBatteryPrecursorByRegion: Record<AuRegionCode, number>;
  remoteIslandSealiftShare: number;
  nationalRemoteIslandSealiftIndex: number;
  remoteIslandSealiftByRegion: Record<AuRegionCode, number>;
  railInlandTerminalAutomationShare: number;
  nationalRailInlandTerminalAutomationThroughputIndex: number;
  railInlandTerminalAutomationThroughputByRegion: Record<AuRegionCode, number>;
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
  offshoreCcsLogisticsPolicy?: OffshoreCcsLogisticsPolicy;
  hydrogenLngExportPolicy?: HydrogenLngExportPolicy;
  urbanMicrofreightHubPolicy?: UrbanMicrofreightHubPolicy;
  floatingOffshoreWindStagingPolicy?: FloatingOffshoreWindStagingPolicy;
  criticalMedicineAirliftPolicy?: CriticalMedicineAirliftPolicy;
  regionalFreightDronePolicy?: RegionalFreightDronePolicy;
  gridBatteryLogisticsPolicy?: GridBatteryLogisticsPolicy;
  pacificHumanitarianSealiftPolicy?: PacificHumanitarianSealiftPolicy;
  autonomousPortTractorPolicy?: AutonomousPortTractorPolicy;
  autonomousHeavyHaulPolicy?: AutonomousHeavyHaulPolicy;
  gbrBiosecurityLogisticsPolicy?: GbrBiosecurityLogisticsPolicy;
  nightUrbanFreightWindowPolicy?: NightUrbanFreightWindowPolicy;
  methanolBunkeringExportPolicy?: MethanolBunkeringExportPolicy;
  antarcticResupplyLogisticsPolicy?: AntarcticResupplyLogisticsPolicy;
  smartBorderPreclearancePolicy?: SmartBorderPreclearancePolicy;
  sustainableAviationFuelSupplyPolicy?: SustainableAviationFuelSupplyPolicy;
  outbackDieselSecurityPolicy?: OutbackDieselSecurityPolicy;
  railDoubleStackContainerPolicy?: RailDoubleStackContainerPolicy;
  greenSteelExportPolicy?: GreenSteelExportPolicy;
  indigenousCommunityAirliftPolicy?: IndigenousCommunityAirliftPolicy;
  portBerthSlotOptimizerPolicy?: PortBerthSlotOptimizerPolicy;
  offshoreWindTowInstallPolicy?: OffshoreWindTowInstallPolicy;
  evBatteryRecyclingLogisticsPolicy?: EvBatteryRecyclingLogisticsPolicy;
  urbanCourierMicrohubPolicy?: UrbanCourierMicrohubPolicy;
  copperConcentrateExportPolicy?: CopperConcentrateExportPolicy;
  pharmaceuticalColdChainPolicy?: PharmaceuticalColdChainPolicy;
  railPassengerFreightPathPolicy?: RailPassengerFreightPathPolicy;
  aluminaRefineryExportPolicy?: AluminaRefineryExportPolicy;
  disasterReliefAirBridgePolicy?: DisasterReliefAirBridgePolicy;
  containerYardAutomationPolicy?: ContainerYardAutomationPolicy;
  nickelCobaltBatteryPrecursorPolicy?: NickelCobaltBatteryPrecursorPolicy;
  remoteIslandSealiftPolicy?: RemoteIslandSealiftPolicy;
  railInlandTerminalAutomationPolicy?: RailInlandTerminalAutomationPolicy;
}

export interface V94ProjectSnapshot {
  id: string;
  projectType: string;
  regionId: string;
  status: string;
}
