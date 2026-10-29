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
export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.8' as const;

export type OP10M_A11_PrimateBand = 'decentralized' | 'balanced' | 'concentrated' | 'hyper_concentrated';

export type OP10M_A11_LinkageBand = 'weak' | 'moderate' | 'strong' | 'structural';

export type OP10M_A11_CompositeDerivedKind =
  | 'primate_concentration_risk'
  | 'regional_linkage_fragility'
  | 'integrated_relief_priority'
  | 'corridor_flow_surge'
  | 'linkage_hub_overload'
  | 'peripheral_isolation_deepening'
  | 'migration_pressure_spike'
  | 'settlement_vulnerability_critical'
  | 'fiscal_coupling_mismatch'
  | 'absorption_capacity_breach'
  | 'service_equity_gap'
  | 'convergence_stall'
  | 'peri_urban_sprawl_pressure'
  | 'infrastructure_backlog_critical'
  | 'governance_coordination_breakdown'
  | 'housing_spillover_cascade'
  | 'regional_talent_drain'
  | 'climate_displacement_exposure'
  | 'amenity_cost_spiral'
  | 'digital_decentralization_pulse'
  | 'settlement_relocation_burden'
  | 'employment_anchor_fragility'
  | 'commute_affordability_wedge'
  | 'settlement_reception_strain';

export type OP10M_A11_AbsorptionStressBand = 'comfortable' | 'tightening' | 'strained' | 'breached';

export interface OP10M_A11_AbsorptionStressRow {
  regionId: OP10M_A11_RegionId;
  stressScore: number;
  band: OP10M_A11_AbsorptionStressBand;
  minHeadroom: number;
  gatewayLoad: number;
  narrative: string;
}

export type OP10M_A11_ServiceEquityBand = 'equitable' | 'mixed' | 'uneven' | 'critical_gap';

export interface OP10M_A11_ServiceEquityRow {
  regionId: OP10M_A11_RegionId;
  equityScore: number;
  band: OP10M_A11_ServiceEquityBand;
  gapDrivers: string[];
  narrative: string;
}

export type OP10M_A11_ConvergenceBand = 'balanced' | 'catching_up' | 'stalled' | 'diverging';

export interface OP10M_A11_ConvergenceVelocityRow {
  standingSpread: number;
  velocity: number;
  band: OP10M_A11_ConvergenceBand;
  laggingCount: number;
  leadingCount: number;
  narrative: string;
}

export type OP10M_A11_PeriUrbanPressureBand = 'contained' | 'expanding' | 'sprawl_risk' | 'unchecked';

export interface OP10M_A11_PeriUrbanPressureRow {
  regionId: OP10M_A11_RegionId;
  pressureScore: number;
  band: OP10M_A11_PeriUrbanPressureBand;
  corridorPull: number;
  metroCount: number;
  narrative: string;
}

export type OP10M_A11_InfrastructureBacklogBand = 'manageable' | 'elevated' | 'severe' | 'critical';

export interface OP10M_A11_InfrastructureBacklogRow {
  regionId: OP10M_A11_RegionId;
  backlogScore: number;
  band: OP10M_A11_InfrastructureBacklogBand;
  estimatedTurnsToClear: number;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_GovernanceFrictionBand = 'aligned' | 'strained' | 'fragmented' | 'breakdown';

export interface OP10M_A11_GovernanceFrictionRow {
  regionId: OP10M_A11_RegionId;
  frictionScore: number;
  band: OP10M_A11_GovernanceFrictionBand;
  coordinationGaps: string[];
  narrative: string;
}

export type OP10M_A11_HousingSpilloverBand = 'localized' | 'spreading' | 'cascade' | 'systemic';

export interface OP10M_A11_HousingSpilloverRow {
  regionId: OP10M_A11_RegionId;
  spilloverScore: number;
  band: OP10M_A11_HousingSpilloverBand;
  corridorPush: number;
  channels: string[];
  narrative: string;
}

export type OP10M_A11_TalentRetentionBand = 'stable' | 'leaky' | 'draining' | 'collapse';

export interface OP10M_A11_TalentRetentionRow {
  regionId: OP10M_A11_RegionId;
  drainScore: number;
  band: OP10M_A11_TalentRetentionBand;
  riskFactors: string[];
  narrative: string;
}

export type OP10M_A11_ClimateDisplacementBand = 'low' | 'elevated' | 'acute' | 'critical';

export interface OP10M_A11_ClimateDisplacementRow {
  regionId: OP10M_A11_RegionId;
  displacementScore: number;
  band: OP10M_A11_ClimateDisplacementBand;
  hazards: string[];
  narrative: string;
}

export type OP10M_A11_AmenityCostBand = 'affordable' | 'stretching' | 'strained' | 'crisis';

export interface OP10M_A11_AmenityCostRow {
  regionId: OP10M_A11_RegionId;
  amenityScore: number;
  band: OP10M_A11_AmenityCostBand;
  pressures: string[];
  narrative: string;
}

export type OP10M_A11_DecentralizationBand = 'metro_locked' | 'partial_shift' | 'broadening' | 'accelerating';

export interface OP10M_A11_DecentralizationShiftRow {
  regionId: OP10M_A11_RegionId;
  shiftScore: number;
  band: OP10M_A11_DecentralizationBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_RelocationBurdenBand = 'manageable' | 'elevated' | 'severe' | 'overwhelming';

export interface OP10M_A11_RelocationBurdenRow {
  regionId: OP10M_A11_RegionId;
  burdenScore: number;
  band: OP10M_A11_RelocationBurdenBand;
  factors: string[];
  narrative: string;
}

export type OP10M_A11_EmploymentAnchorBand = 'anchored' | 'softening' | 'fragile' | 'collapsing';

export interface OP10M_A11_EmploymentAnchorRow {
  regionId: OP10M_A11_RegionId;
  stressScore: number;
  band: OP10M_A11_EmploymentAnchorBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_CommuteWedgeBand = 'balanced' | 'widening' | 'severe' | 'unsustainable';

export interface OP10M_A11_CommuteWedgeRow {
  regionId: OP10M_A11_RegionId;
  wedgeScore: number;
  band: OP10M_A11_CommuteWedgeBand;
  pressures: string[];
  narrative: string;
}

export type OP10M_A11_ReceptionStrainBand = 'absorptive' | 'tight' | 'strained' | 'saturated';

export interface OP10M_A11_ReceptionStrainRow {
  regionId: OP10M_A11_RegionId;
  strainScore: number;
  band: OP10M_A11_ReceptionStrainBand;
  factors: string[];
  narrative: string;
}

export type OP10M_A11_MigrationPressureBand = 'stable' | 'elevated' | 'high' | 'surge';

export interface OP10M_A11_MigrationPressureRow {
  regionId: OP10M_A11_RegionId;
  pullScore: number;
  pushScore: number;
  netPressure: number;
  band: OP10M_A11_MigrationPressureBand;
  primaryDirection: 'inbound' | 'outbound' | 'balanced';
  narrative: string;
}

export type OP10M_A11_SettlementVulnerabilityBand = 'resilient' | 'exposed' | 'fragile' | 'critical';

export interface OP10M_A11_SettlementVulnerabilityRow {
  regionId: OP10M_A11_RegionId;
  vulnerabilityScore: number;
  band: OP10M_A11_SettlementVulnerabilityBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_FiscalCouplingBand = 'aligned' | 'partial' | 'strained' | 'misaligned';

export interface OP10M_A11_FiscalUrbanCouplingRow {
  regionId: OP10M_A11_RegionId;
  couplingScore: number;
  band: OP10M_A11_FiscalCouplingBand;
  catchUpPotential: number;
  narrative: string;
}

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
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  settlementVulnerability: OP10M_A11_SettlementVulnerabilityRow[];
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
  fiscalUrbanCouplingIndex: number;
  regionalCohesionIndex: number;
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  metropolitanSaturationIndex: number;
  serviceEquity: OP10M_A11_ServiceEquityRow[];
  nationalServiceEquityIndex: number;
  convergence: OP10M_A11_ConvergenceVelocityRow;
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  nationalPeriUrbanPressureIndex: number;
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
  nationalInfrastructureBacklogIndex: number;
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  nationalGovernanceFrictionIndex: number;
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
  nationalHousingSpilloverIndex: number;
  talentRetention: OP10M_A11_TalentRetentionRow[];
  nationalTalentDrainIndex: number;
  climateDisplacement: OP10M_A11_ClimateDisplacementRow[];
  nationalClimateDisplacementIndex: number;
  amenityCost: OP10M_A11_AmenityCostRow[];
  nationalAmenityCostIndex: number;
  decentralizationShift: OP10M_A11_DecentralizationShiftRow[];
  nationalDecentralizationIndex: number;
  relocationBurden: OP10M_A11_RelocationBurdenRow[];
  nationalRelocationBurdenIndex: number;
  employmentAnchor: OP10M_A11_EmploymentAnchorRow[];
  nationalEmploymentAnchorIndex: number;
  commuteWedge: OP10M_A11_CommuteWedgeRow[];
  nationalCommuteWedgeIndex: number;
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
  nationalReceptionStrainIndex: number;
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
  lastCohesionIndex: number;
  lastStandingSpread: number;
  lastServiceEquityIndex: number;
  lastInfrastructureBacklogIndex: number;
  lastGovernanceFrictionIndex: number;
  lastHousingSpilloverIndex: number;
  lastClimateDisplacementIndex: number;
  lastAmenityCostIndex: number;
  lastRelocationBurdenIndex: number;
  lastEmploymentAnchorIndex: number;
  lastCommuteWedgeIndex: number;
  lastReceptionStrainIndex: number;
  inputHash: string;
}
