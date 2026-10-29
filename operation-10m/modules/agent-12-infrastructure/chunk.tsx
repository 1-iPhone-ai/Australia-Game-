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

export interface TransportInfrastructureState {
  schemaVersion: 'agent12/4';
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
  computeMs: number;
}

export type ClimateTransportBand = 'mild' | 'warm' | 'hot' | 'extreme';

export interface TransportInfrastructureOptions {
  activeScenarioIds?: ReadonlySet<string>;
  maintenanceBacklogByAssetId?: ReadonlyMap<string, number>;
  maintenanceSpendIndex?: number;
  fundedPipelineStageIds?: ReadonlySet<string>;
  climateBand?: ClimateTransportBand;
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

  const maintenanceWarnings = maintenanceWarningsFromBacklog(options?.maintenanceBacklogByAssetId);
  const bottleneckAssetIds = detectBottlenecks(productivity, ops, inputs);
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
    schemaVersion: 'agent12/4',
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
    ok: integrity.duplicateIds.length === 0 && integrity.invalidRegions.length === 0 && integrity.totalAssets >= 71,
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
    id: 'infrastructure_state_v4',
    ok:
      infra.schemaVersion === 'agent12/4' &&
      infra.corridorSynergyPoints > 0 &&
      infra.activeCorridors.some((c) => c.active) &&
      infra.scenarioStackFactor >= 1,
    detail: `synergy=${infra.corridorSynergyPoints.toFixed(1)} resilience=${Object.values(infra.resilienceScoreByRegion).reduce((a, b) => a + b, 0).toFixed(0)}`,
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
