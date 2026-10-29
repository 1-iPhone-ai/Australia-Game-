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
export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.1' as const;

export type OP10M_A11_PrimateBand = 'decentralized' | 'balanced' | 'concentrated' | 'hyper_concentrated';

export type OP10M_A11_LinkageBand = 'weak' | 'moderate' | 'strong' | 'structural';

export type OP10M_A11_CompositeDerivedKind =
  | 'primate_concentration_risk'
  | 'regional_linkage_fragility'
  | 'integrated_relief_priority';

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
  reliefPlaybook: OP10M_A11_ReliefPlaybookItem[];
  fragilityIndex: number;
  nationalPrimateIndex: number;
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
  inputHash: string;
}
