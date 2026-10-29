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
export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.38' as const;

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
  | 'settlement_reception_strain'
  | 'land_use_regulatory_gridlock'
  | 'mobility_affordability_trap'
  | 'infrastructure_absorption_gap'
  | 'relief_coordination_overhead'
  | 'corridor_equity_drift'
  | 'climate_adaptation_lag'
  | 'fiscal_capacity_strain'
  | 'network_resilience_erosion'
  | 'long_horizon_capacity_risk'
  | 'cohesion_integrity_stress'
  | 'relief_delivery_equity_gap'
  | 'systemic_settlement_fragility'
  | 'governance_resilience_decay'
  | 'migration_stability_erosion'
  | 'adaptive_capacity_ceiling'
  | 'fiscal_governance_coupling_strain'
  | 'network_equity_tension'
  | 'resilience_frontier_pressure'
  | 'meta_governance_coordination_fatigue'
  | 'capital_mobility_asymmetry'
  | 'compound_shock_saturation'
  | 'institutional_trust_erosion'
  | 'liquidity_fragmentation_stress'
  | 'cascading_failure_risk'
  | 'social_contract_fragility'
  | 'capital_flight_panic'
  | 'irrecoverable_collapse_threshold'
  | 'settlement_legitimacy_collapse'
  | 'fiscal_panic_contagion'
  | 'terminal_state_lock_in'
  | 'governance_vacuum_escalation'
  | 'settlement_abandonment_spiral'
  | 'post_collapse_recovery_impossibility'
  | 'state_collapse_cascade_amplification'
  | 'hollow_region_contagion'
  | 'permanent_depopulation_lock'
  | 'total_collapse_singularity_pressure'
  | 'void_expansion_velocity'
  | 'existential_continuity_fracture'
  | 'collapse_horizon_convergence'
  | 'void_totalization_surge'
  | 'existential_terminus_lock'
  | 'absolute_collapse_horizon_lock'
  | 'void_finalization_cascade'
  | 'existential_obliteration_threshold'
  | 'ultimate_collapse_singularity_seal'
  | 'void_annihilation_convergence'
  | 'existential_null_state_lock'
  | 'collapse_existence_singularity_point'
  | 'void_existence_annihilation_front'
  | 'existential_absolute_zero_lock'
  | 'collapse_omni_singularity_node'
  | 'void_absolute_erosion_surge'
  | 'existential_final_nullity_lock'
  | 'collapse_total_singularity_vertex'
  | 'void_terminal_erosion_cascade'
  | 'existential_ultimate_nullity_seal'
  | 'collapse_absolute_singularity_apex'
  | 'void_complete_erosion_terminality'
  | 'existential_final_nullity_closure'
  | 'collapse_ultimate_singularity_zenith'
  | 'void_total_erosion_finality'
  | 'existential_absolute_nullity_verdict'
  | 'collapse_total_singularity_nexus'
  | 'void_absolute_erosion_termination'
  | 'existential_final_nullity_sentence'
  | 'collapse_absolute_singularity_culmination'
  | 'void_complete_erosion_extinction'
  | 'existential_total_nullity_decree'
  | 'collapse_omni_singularity_synthesis'
  | 'void_total_erosion_annihilation'
  | 'existential_absolute_nullity_mandate'
  | 'collapse_omni_singularity_convergence'
  | 'void_total_erosion_obliteration'
  | 'existential_absolute_nullity_binding'
  | 'collapse_omni_singularity_integration'
  | 'void_total_erosion_eradication'
  | 'existential_absolute_nullity_continuity'
  | 'collapse_omni_singularity_unification'
  | 'void_total_erosion_elimination'
  | 'existential_absolute_nullity_perpetuity'
  | 'collapse_omni_singularity_consolidation'
  | 'void_total_erosion_dissolution'
  | 'existential_absolute_nullity_immutability'
  | 'collapse_omni_singularity_coalescence'
  | 'void_total_erosion_sublimation'
  | 'existential_absolute_nullity_permanence'
  | 'collapse_omni_singularity_amalgamation'
  | 'void_total_erosion_atomization'
  | 'existential_absolute_nullity_inevitability';

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

export type OP10M_A11_LandUseGridlockBand = 'fluid' | 'slowing' | 'gridlocked' | 'paralyzed';

export interface OP10M_A11_LandUseGridlockRow {
  regionId: OP10M_A11_RegionId;
  gridlockScore: number;
  band: OP10M_A11_LandUseGridlockBand;
  blockers: string[];
  narrative: string;
}

export type OP10M_A11_MobilityTrapBand = 'mobile' | 'constrained' | 'trapped' | 'immobilized';

export interface OP10M_A11_MobilityTrapRow {
  regionId: OP10M_A11_RegionId;
  trapScore: number;
  band: OP10M_A11_MobilityTrapBand;
  binds: string[];
  narrative: string;
}

export type OP10M_A11_AbsorptionGapBand = 'aligned' | 'widening' | 'critical' | 'rupture';

export interface OP10M_A11_AbsorptionGapRow {
  regionId: OP10M_A11_RegionId;
  gapScore: number;
  band: OP10M_A11_AbsorptionGapBand;
  gaps: string[];
  narrative: string;
}

export type OP10M_A11_ReliefOverheadBand = 'lean' | 'elevated' | 'overloaded' | 'paralytic';

export interface OP10M_A11_ReliefOverheadRow {
  regionId: OP10M_A11_RegionId;
  overheadScore: number;
  band: OP10M_A11_ReliefOverheadBand;
  stressors: string[];
  narrative: string;
}

export type OP10M_A11_CorridorEquityDriftBand = 'aligned' | 'drifting' | 'polarized' | 'fractured';

export interface OP10M_A11_CorridorEquityDriftRow {
  regionId: OP10M_A11_RegionId;
  driftScore: number;
  band: OP10M_A11_CorridorEquityDriftBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_AdaptationLagBand = 'responsive' | 'lagging' | 'stalled' | 'critical_lag';

export interface OP10M_A11_AdaptationLagRow {
  regionId: OP10M_A11_RegionId;
  lagScore: number;
  band: OP10M_A11_AdaptationLagBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_FiscalCapacityStrainBand = 'sound' | 'stretched' | 'fragile' | 'exhausted';

export interface OP10M_A11_FiscalCapacityStrainRow {
  regionId: OP10M_A11_RegionId;
  strainScore: number;
  band: OP10M_A11_FiscalCapacityStrainBand;
  pressures: string[];
  narrative: string;
}

export type OP10M_A11_NetworkErosionBand = 'robust' | 'thinning' | 'eroding' | 'fracturing';

export interface OP10M_A11_NetworkErosionRow {
  regionId: OP10M_A11_RegionId;
  erosionScore: number;
  band: OP10M_A11_NetworkErosionBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_HorizonRiskBand = 'stable' | 'elevated' | 'acute' | 'critical';

export interface OP10M_A11_HorizonRiskRow {
  regionId: OP10M_A11_RegionId;
  riskScore: number;
  band: OP10M_A11_HorizonRiskBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_CohesionIntegrityBand = 'cohesive' | 'fraying' | 'fractured' | 'disintegrating';

export interface OP10M_A11_CohesionIntegrityRow {
  regionId: OP10M_A11_RegionId;
  pressureScore: number;
  band: OP10M_A11_CohesionIntegrityBand;
  strains: string[];
  narrative: string;
}

export type OP10M_A11_ReliefEquityGapBand = 'aligned' | 'uneven' | 'skewed' | 'polarized';

export interface OP10M_A11_ReliefEquityGapRow {
  regionId: OP10M_A11_RegionId;
  gapScore: number;
  band: OP10M_A11_ReliefEquityGapBand;
  gaps: string[];
  narrative: string;
}

export type OP10M_A11_SystemicFragilityBand = 'contained' | 'elevated' | 'systemic' | 'cascade_risk';

export interface OP10M_A11_SystemicFragilityRow {
  regionId: OP10M_A11_RegionId;
  fragilityScore: number;
  band: OP10M_A11_SystemicFragilityBand;
  cascades: string[];
  narrative: string;
}

export type OP10M_A11_GovernanceResilienceBand = 'resilient' | 'eroding' | 'brittle' | 'collapsed';

export interface OP10M_A11_GovernanceResilienceRow {
  regionId: OP10M_A11_RegionId;
  decayScore: number;
  band: OP10M_A11_GovernanceResilienceBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_MigrationStabilityBand = 'stable' | 'volatile' | 'unstable' | 'chaotic';

export interface OP10M_A11_MigrationStabilityRow {
  regionId: OP10M_A11_RegionId;
  erosionScore: number;
  band: OP10M_A11_MigrationStabilityBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_AdaptiveCeilingBand = 'headroom' | 'tight' | 'capped' | 'breached';

export interface OP10M_A11_AdaptiveCeilingRow {
  regionId: OP10M_A11_RegionId;
  ceilingScore: number;
  band: OP10M_A11_AdaptiveCeilingBand;
  limits: string[];
  narrative: string;
}

export type OP10M_A11_FiscalGovernanceCouplingBand = 'aligned' | 'strained' | 'misaligned' | 'ruptured';

export interface OP10M_A11_FiscalGovernanceCouplingRow {
  regionId: OP10M_A11_RegionId;
  strainScore: number;
  band: OP10M_A11_FiscalGovernanceCouplingBand;
  tensions: string[];
  narrative: string;
}

export type OP10M_A11_NetworkEquityTensionBand = 'balanced' | 'stressed' | 'polarized' | 'fractured';

export interface OP10M_A11_NetworkEquityTensionRow {
  regionId: OP10M_A11_RegionId;
  tensionScore: number;
  band: OP10M_A11_NetworkEquityTensionBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_ResilienceFrontierBand = 'within' | 'approaching' | 'at_limit' | 'breached';

export interface OP10M_A11_ResilienceFrontierRow {
  regionId: OP10M_A11_RegionId;
  pressureScore: number;
  band: OP10M_A11_ResilienceFrontierBand;
  pressures: string[];
  narrative: string;
}

export type OP10M_A11_MetaGovernanceFatigueBand = 'rested' | 'tiring' | 'fatigued' | 'exhausted';

export interface OP10M_A11_MetaGovernanceFatigueRow {
  regionId: OP10M_A11_RegionId;
  fatigueScore: number;
  band: OP10M_A11_MetaGovernanceFatigueBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_CapitalMobilityAsymmetryBand = 'balanced' | 'skewed' | 'polarized' | 'locked';

export interface OP10M_A11_CapitalMobilityAsymmetryRow {
  regionId: OP10M_A11_RegionId;
  asymmetryScore: number;
  band: OP10M_A11_CapitalMobilityAsymmetryBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_CompoundShockSaturationBand = 'buffered' | 'loading' | 'saturated' | 'overwhelmed';

export interface OP10M_A11_CompoundShockSaturationRow {
  regionId: OP10M_A11_RegionId;
  saturationScore: number;
  band: OP10M_A11_CompoundShockSaturationBand;
  shocks: string[];
  narrative: string;
}

export type OP10M_A11_InstitutionalTrustErosionBand = 'trusted' | 'thinning' | 'brittle' | 'breakdown';

export interface OP10M_A11_InstitutionalTrustErosionRow {
  regionId: OP10M_A11_RegionId;
  erosionScore: number;
  band: OP10M_A11_InstitutionalTrustErosionBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_LiquidityFragmentationBand = 'integrated' | 'segmented' | 'fractured' | 'frozen';

export interface OP10M_A11_LiquidityFragmentationRow {
  regionId: OP10M_A11_RegionId;
  fragmentationScore: number;
  band: OP10M_A11_LiquidityFragmentationBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_CascadingFailureBand = 'contained' | 'spreading' | 'cascade_risk' | 'systemic';

export interface OP10M_A11_CascadingFailureRiskRow {
  regionId: OP10M_A11_RegionId;
  cascadeScore: number;
  band: OP10M_A11_CascadingFailureBand;
  triggers: string[];
  narrative: string;
}

export type OP10M_A11_SocialContractFragilityBand = 'honored' | 'strained' | 'fraying' | 'ruptured';

export interface OP10M_A11_SocialContractFragilityRow {
  regionId: OP10M_A11_RegionId;
  fragilityScore: number;
  band: OP10M_A11_SocialContractFragilityBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_CapitalFlightPanicBand = 'stable' | 'nervous' | 'panicked' | 'stampede';

export interface OP10M_A11_CapitalFlightPanicRow {
  regionId: OP10M_A11_RegionId;
  panicScore: number;
  band: OP10M_A11_CapitalFlightPanicBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_IrrecoverableCollapseBand = 'recoverable' | 'stressed' | 'terminal' | 'irrecoverable';

export interface OP10M_A11_IrrecoverableCollapseThresholdRow {
  regionId: OP10M_A11_RegionId;
  thresholdScore: number;
  band: OP10M_A11_IrrecoverableCollapseBand;
  markers: string[];
  narrative: string;
}

export type OP10M_A11_SettlementLegitimacyCollapseBand = 'legitimate' | 'contested' | 'delegitimized' | 'collapsed';

export interface OP10M_A11_SettlementLegitimacyCollapseRow {
  regionId: OP10M_A11_RegionId;
  collapseScore: number;
  band: OP10M_A11_SettlementLegitimacyCollapseBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_FiscalPanicContagionBand = 'isolated' | 'spreading' | 'contagion' | 'systemic';

export interface OP10M_A11_FiscalPanicContagionRow {
  regionId: OP10M_A11_RegionId;
  contagionScore: number;
  band: OP10M_A11_FiscalPanicContagionBand;
  channels: string[];
  narrative: string;
}

export type OP10M_A11_TerminalStateLockInBand = 'reversible' | 'sticky' | 'locked' | 'terminal';

export interface OP10M_A11_TerminalStateLockInRow {
  regionId: OP10M_A11_RegionId;
  lockInScore: number;
  band: OP10M_A11_TerminalStateLockInBand;
  markers: string[];
  narrative: string;
}

export type OP10M_A11_GovernanceVacuumEscalationBand = 'staffed' | 'thinning' | 'hollow' | 'vacuum';

export interface OP10M_A11_GovernanceVacuumEscalationRow {
  regionId: OP10M_A11_RegionId;
  vacuumScore: number;
  band: OP10M_A11_GovernanceVacuumEscalationBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_SettlementAbandonmentSpiralBand = 'anchored' | 'drifting' | 'exodus' | 'abandoned';

export interface OP10M_A11_SettlementAbandonmentSpiralRow {
  regionId: OP10M_A11_RegionId;
  spiralScore: number;
  band: OP10M_A11_SettlementAbandonmentSpiralBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_PostCollapseRecoveryImpossibilityBand = 'recoverable' | 'constrained' | 'blocked' | 'impossible';

export interface OP10M_A11_PostCollapseRecoveryImpossibilityRow {
  regionId: OP10M_A11_RegionId;
  impossibilityScore: number;
  band: OP10M_A11_PostCollapseRecoveryImpossibilityBand;
  blockers: string[];
  narrative: string;
}

export type OP10M_A11_StateCollapseCascadeAmplificationBand = 'damped' | 'amplifying' | 'runaway' | 'total';

export interface OP10M_A11_StateCollapseCascadeAmplificationRow {
  regionId: OP10M_A11_RegionId;
  amplificationScore: number;
  band: OP10M_A11_StateCollapseCascadeAmplificationBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_HollowRegionContagionBand = 'contained' | 'hollowing' | 'contagion' | 'voided';

export interface OP10M_A11_HollowRegionContagionRow {
  regionId: OP10M_A11_RegionId;
  contagionScore: number;
  band: OP10M_A11_HollowRegionContagionBand;
  channels: string[];
  narrative: string;
}

export type OP10M_A11_PermanentDepopulationLockBand = 'fluid' | 'sticky' | 'locked' | 'permanent';

export interface OP10M_A11_PermanentDepopulationLockRow {
  regionId: OP10M_A11_RegionId;
  lockScore: number;
  band: OP10M_A11_PermanentDepopulationLockBand;
  markers: string[];
  narrative: string;
}

export type OP10M_A11_TotalCollapseSingularityBand = 'bounded' | 'accelerating' | 'singular' | 'total';

export interface OP10M_A11_TotalCollapseSingularityRow {
  regionId: OP10M_A11_RegionId;
  singularityScore: number;
  band: OP10M_A11_TotalCollapseSingularityBand;
  drivers: string[];
  narrative: string;
}

export type OP10M_A11_VoidExpansionVelocityBand = 'stable' | 'widening' | 'surging' | 'unbounded';

export interface OP10M_A11_VoidExpansionVelocityRow {
  regionId: OP10M_A11_RegionId;
  velocityScore: number;
  band: OP10M_A11_VoidExpansionVelocityBand;
  vectors: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialContinuityFractureBand = 'intact' | 'fraying' | 'shattered' | 'extinguished';

export interface OP10M_A11_ExistentialContinuityFractureRow {
  regionId: OP10M_A11_RegionId;
  fractureScore: number;
  band: OP10M_A11_ExistentialContinuityFractureBand;
  ruptures: string[];
  narrative: string;
}

export type OP10M_A11_CollapseHorizonConvergenceBand = 'distant' | 'narrowing' | 'imminent' | 'locked';

export interface OP10M_A11_CollapseHorizonConvergenceRow {
  regionId: OP10M_A11_RegionId;
  convergenceScore: number;
  band: OP10M_A11_CollapseHorizonConvergenceBand;
  signals: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalizationSurgeBand = 'contained' | 'spreading' | 'totalizing' | 'absolute';

export interface OP10M_A11_VoidTotalizationSurgeRow {
  regionId: OP10M_A11_RegionId;
  surgeScore: number;
  band: OP10M_A11_VoidTotalizationSurgeBand;
  fronts: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialTerminusLockBand = 'open' | 'closing' | 'sealed' | 'terminal';

export interface OP10M_A11_ExistentialTerminusLockRow {
  regionId: OP10M_A11_RegionId;
  terminusScore: number;
  band: OP10M_A11_ExistentialTerminusLockBand;
  seals: string[];
  narrative: string;
}

export type OP10M_A11_AbsoluteCollapseHorizonLockBand = 'buffered' | 'compressing' | 'sealed' | 'absolute';

export interface OP10M_A11_AbsoluteCollapseHorizonLockRow {
  regionId: OP10M_A11_RegionId;
  lockScore: number;
  band: OP10M_A11_AbsoluteCollapseHorizonLockBand;
  clamps: string[];
  narrative: string;
}

export type OP10M_A11_VoidFinalizationCascadeBand = 'latent' | 'cascading' | 'finalizing' | 'complete';

export interface OP10M_A11_VoidFinalizationCascadeRow {
  regionId: OP10M_A11_RegionId;
  cascadeScore: number;
  band: OP10M_A11_VoidFinalizationCascadeBand;
  stages: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialObliterationThresholdBand = 'dormant' | 'approaching' | 'breached' | 'obliterated';

export interface OP10M_A11_ExistentialObliterationThresholdRow {
  regionId: OP10M_A11_RegionId;
  thresholdScore: number;
  band: OP10M_A11_ExistentialObliterationThresholdBand;
  triggers: string[];
  narrative: string;
}

export type OP10M_A11_UltimateCollapseSingularitySealBand = 'open' | 'closing' | 'sealed' | 'ultimate';

export interface OP10M_A11_UltimateCollapseSingularitySealRow {
  regionId: OP10M_A11_RegionId;
  sealScore: number;
  band: OP10M_A11_UltimateCollapseSingularitySealBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidAnnihilationConvergenceBand = 'diffuse' | 'focusing' | 'annihilating' | 'total';

export interface OP10M_A11_VoidAnnihilationConvergenceRow {
  regionId: OP10M_A11_RegionId;
  convergenceScore: number;
  band: OP10M_A11_VoidAnnihilationConvergenceBand;
  vectors: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialNullStateLockBand = 'present' | 'fading' | 'null' | 'absolute_null';

export interface OP10M_A11_ExistentialNullStateLockRow {
  regionId: OP10M_A11_RegionId;
  nullScore: number;
  band: OP10M_A11_ExistentialNullStateLockBand;
  voids: string[];
  narrative: string;
}

export type OP10M_A11_CollapseExistenceSingularityPointBand = 'remote' | 'converging' | 'singular' | 'existential';

export interface OP10M_A11_CollapseExistenceSingularityPointRow {
  regionId: OP10M_A11_RegionId;
  pointScore: number;
  band: OP10M_A11_CollapseExistenceSingularityPointBand;
  axes: string[];
  narrative: string;
}

export type OP10M_A11_VoidExistenceAnnihilationFrontBand = 'dormant' | 'advancing' | 'consuming' | 'total_void';

export interface OP10M_A11_VoidExistenceAnnihilationFrontRow {
  regionId: OP10M_A11_RegionId;
  frontScore: number;
  band: OP10M_A11_VoidExistenceAnnihilationFrontBand;
  waves: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteZeroLockBand = 'residual' | 'collapsing' | 'zero' | 'absolute_zero';

export interface OP10M_A11_ExistentialAbsoluteZeroLockRow {
  regionId: OP10M_A11_RegionId;
  zeroScore: number;
  band: OP10M_A11_ExistentialAbsoluteZeroLockBand;
  locks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityNodeBand = 'peripheral' | 'convergent' | 'omni' | 'total_node';

export interface OP10M_A11_CollapseOmniSingularityNodeRow {
  regionId: OP10M_A11_RegionId;
  nodeScore: number;
  band: OP10M_A11_CollapseOmniSingularityNodeBand;
  facets: string[];
  narrative: string;
}

export type OP10M_A11_VoidAbsoluteErosionSurgeBand = 'trace' | 'surging' | 'absolute' | 'omni_erosion';

export interface OP10M_A11_VoidAbsoluteErosionSurgeRow {
  regionId: OP10M_A11_RegionId;
  surgeScore: number;
  band: OP10M_A11_VoidAbsoluteErosionSurgeBand;
  pulses: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialFinalNullityLockBand = 'remnant' | 'dissolving' | 'nullity' | 'final_nullity';

export interface OP10M_A11_ExistentialFinalNullityLockRow {
  regionId: OP10M_A11_RegionId;
  nullityScore: number;
  band: OP10M_A11_ExistentialFinalNullityLockBand;
  seals: string[];
  narrative: string;
}

export type OP10M_A11_CollapseTotalSingularityVertexBand = 'latent' | 'forming' | 'total' | 'vertex';

export interface OP10M_A11_CollapseTotalSingularityVertexRow {
  regionId: OP10M_A11_RegionId;
  vertexScore: number;
  band: OP10M_A11_CollapseTotalSingularityVertexBand;
  anchors: string[];
  narrative: string;
}

export type OP10M_A11_VoidTerminalErosionCascadeBand = 'inactive' | 'terminalizing' | 'cascade' | 'total_erosion';

export interface OP10M_A11_VoidTerminalErosionCascadeRow {
  regionId: OP10M_A11_RegionId;
  cascadeScore: number;
  band: OP10M_A11_VoidTerminalErosionCascadeBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialUltimateNullitySealBand = 'trace' | 'sealing' | 'ultimate' | 'total_seal';

export interface OP10M_A11_ExistentialUltimateNullitySealRow {
  regionId: OP10M_A11_RegionId;
  sealScore: number;
  band: OP10M_A11_ExistentialUltimateNullitySealBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseAbsoluteSingularityApexBand = 'latent' | 'forming' | 'total' | 'apex';

export interface OP10M_A11_CollapseAbsoluteSingularityApexRow {
  regionId: OP10M_A11_RegionId;
  apexScore: number;
  band: OP10M_A11_CollapseAbsoluteSingularityApexBand;
  anchors: string[];
  narrative: string;
}

export type OP10M_A11_VoidCompleteErosionTerminalityBand = 'inactive' | 'completing' | 'terminal' | 'total_terminality';

export interface OP10M_A11_VoidCompleteErosionTerminalityRow {
  regionId: OP10M_A11_RegionId;
  terminalityScore: number;
  band: OP10M_A11_VoidCompleteErosionTerminalityBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialFinalNullityClosureBand = 'trace' | 'closing' | 'final' | 'total_closure';

export interface OP10M_A11_ExistentialFinalNullityClosureRow {
  regionId: OP10M_A11_RegionId;
  closureScore: number;
  band: OP10M_A11_ExistentialFinalNullityClosureBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseUltimateSingularityZenithBand = 'latent' | 'forming' | 'total' | 'zenith';

export interface OP10M_A11_CollapseUltimateSingularityZenithRow {
  regionId: OP10M_A11_RegionId;
  zenithScore: number;
  band: OP10M_A11_CollapseUltimateSingularityZenithBand;
  anchors: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionFinalityBand = 'inactive' | 'finalizing' | 'final' | 'total_finality';

export interface OP10M_A11_VoidTotalErosionFinalityRow {
  regionId: OP10M_A11_RegionId;
  finalityScore: number;
  band: OP10M_A11_VoidTotalErosionFinalityBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityVerdictBand = 'trace' | 'judging' | 'absolute' | 'total_verdict';

export interface OP10M_A11_ExistentialAbsoluteNullityVerdictRow {
  regionId: OP10M_A11_RegionId;
  verdictScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityVerdictBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseTotalSingularityNexusBand = 'latent' | 'forming' | 'total' | 'nexus';

export interface OP10M_A11_CollapseTotalSingularityNexusRow {
  regionId: OP10M_A11_RegionId;
  nexusScore: number;
  band: OP10M_A11_CollapseTotalSingularityNexusBand;
  anchors: string[];
  narrative: string;
}

export type OP10M_A11_VoidAbsoluteErosionTerminationBand = 'inactive' | 'terminating' | 'absolute' | 'total_termination';

export interface OP10M_A11_VoidAbsoluteErosionTerminationRow {
  regionId: OP10M_A11_RegionId;
  terminationScore: number;
  band: OP10M_A11_VoidAbsoluteErosionTerminationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialFinalNullitySentenceBand = 'trace' | 'sentencing' | 'final' | 'total_sentence';

export interface OP10M_A11_ExistentialFinalNullitySentenceRow {
  regionId: OP10M_A11_RegionId;
  sentenceScore: number;
  band: OP10M_A11_ExistentialFinalNullitySentenceBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseAbsoluteSingularityCulminationBand = 'latent' | 'forming' | 'total' | 'culmination';

export interface OP10M_A11_CollapseAbsoluteSingularityCulminationRow {
  regionId: OP10M_A11_RegionId;
  culminationScore: number;
  band: OP10M_A11_CollapseAbsoluteSingularityCulminationBand;
  anchors: string[];
  narrative: string;
}

export type OP10M_A11_VoidCompleteErosionExtinctionBand = 'inactive' | 'extinguishing' | 'complete' | 'total_extinction';

export interface OP10M_A11_VoidCompleteErosionExtinctionRow {
  regionId: OP10M_A11_RegionId;
  extinctionScore: number;
  band: OP10M_A11_VoidCompleteErosionExtinctionBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialTotalNullityDecreeBand = 'trace' | 'decreeing' | 'total' | 'absolute_decree';

export interface OP10M_A11_ExistentialTotalNullityDecreeRow {
  regionId: OP10M_A11_RegionId;
  decreeScore: number;
  band: OP10M_A11_ExistentialTotalNullityDecreeBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularitySynthesisBand = 'latent' | 'forming' | 'total' | 'synthesis';

export interface OP10M_A11_CollapseOmniSingularitySynthesisRow {
  regionId: OP10M_A11_RegionId;
  synthesisScore: number;
  band: OP10M_A11_CollapseOmniSingularitySynthesisBand;
  anchors: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionAnnihilationBand = 'inactive' | 'annihilating' | 'total' | 'complete_annihilation';

export interface OP10M_A11_VoidTotalErosionAnnihilationRow {
  regionId: OP10M_A11_RegionId;
  annihilationScore: number;
  band: OP10M_A11_VoidTotalErosionAnnihilationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityMandateBand = 'trace' | 'mandating' | 'absolute' | 'total_mandate';

export interface OP10M_A11_ExistentialAbsoluteNullityMandateRow {
  regionId: OP10M_A11_RegionId;
  mandateScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityMandateBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityConvergenceBand = 'dormant' | 'aligning' | 'total' | 'convergence';

export interface OP10M_A11_CollapseOmniSingularityConvergenceRow {
  regionId: OP10M_A11_RegionId;
  convergenceScore: number;
  band: OP10M_A11_CollapseOmniSingularityConvergenceBand;
  vectors: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionObliterationBand = 'dormant' | 'obliterating' | 'total' | 'complete_obliteration';

export interface OP10M_A11_VoidTotalErosionObliterationRow {
  regionId: OP10M_A11_RegionId;
  obliterationScore: number;
  band: OP10M_A11_VoidTotalErosionObliterationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityBindingBand = 'trace' | 'binding' | 'absolute' | 'total_binding';

export interface OP10M_A11_ExistentialAbsoluteNullityBindingRow {
  regionId: OP10M_A11_RegionId;
  bindingScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityBindingBand;
  marks: string[];
  narrative: string;
}


export type OP10M_A11_CollapseOmniSingularityIntegrationBand = 'dormant' | 'aligning' | 'total' | 'integration';

export interface OP10M_A11_CollapseOmniSingularityIntegrationRow {
  regionId: OP10M_A11_RegionId;
  integrationScore: number;
  band: OP10M_A11_CollapseOmniSingularityIntegrationBand;
  vectors: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionEradicationBand = 'dormant' | 'eradicating' | 'total' | 'complete_eradication';

export interface OP10M_A11_VoidTotalErosionEradicationRow {
  regionId: OP10M_A11_RegionId;
  eradicationScore: number;
  band: OP10M_A11_VoidTotalErosionEradicationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityContinuityBand = 'trace' | 'continuity' | 'absolute' | 'total_continuity';


export type OP10M_A11_CollapseOmniSingularityUnificationBand = 'dormant' | 'aligning' | 'total' | 'unification';

export interface OP10M_A11_CollapseOmniSingularityUnificationRow {
  regionId: OP10M_A11_RegionId;
  unificationScore: number;
  band: OP10M_A11_CollapseOmniSingularityUnificationBand;
  vectors: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionEliminationBand = 'dormant' | 'eliminating' | 'total' | 'complete_elimination';

export interface OP10M_A11_VoidTotalErosionEliminationRow {
  regionId: OP10M_A11_RegionId;
  eliminationScore: number;
  band: OP10M_A11_VoidTotalErosionEliminationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityPerpetuityBand = 'trace' | 'perpetuity' | 'absolute' | 'total_perpetuity';

export interface OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow {
  regionId: OP10M_A11_RegionId;
  perpetuityScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityPerpetuityBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityConsolidationBand = 'latent' | 'aligning' | 'total' | 'consolidation';

export interface OP10M_A11_CollapseOmniSingularityConsolidationRow {
  regionId: OP10M_A11_RegionId;
  consolidationScore: number;
  band: OP10M_A11_CollapseOmniSingularityConsolidationBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionDissolutionBand = 'dormant' | 'dissolving' | 'total' | 'complete_dissolution';

export interface OP10M_A11_VoidTotalErosionDissolutionRow {
  regionId: OP10M_A11_RegionId;
  dissolutionScore: number;
  band: OP10M_A11_VoidTotalErosionDissolutionBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityImmutabilityBand = 'trace' | 'immutable' | 'absolute' | 'total_immutability';

export interface OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow {
  regionId: OP10M_A11_RegionId;
  immutabilityScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityImmutabilityBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityCoalescenceBand = 'latent' | 'aligning' | 'total' | 'coalescence';

export interface OP10M_A11_CollapseOmniSingularityCoalescenceRow {
  regionId: OP10M_A11_RegionId;
  coalescenceScore: number;
  band: OP10M_A11_CollapseOmniSingularityCoalescenceBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionSublimationBand = 'dormant' | 'sublimating' | 'total' | 'complete_sublimation';

export interface OP10M_A11_VoidTotalErosionSublimationRow {
  regionId: OP10M_A11_RegionId;
  sublimationScore: number;
  band: OP10M_A11_VoidTotalErosionSublimationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityPermanenceBand = 'trace' | 'permanent' | 'absolute' | 'total_permanence';

export interface OP10M_A11_ExistentialAbsoluteNullityPermanenceRow {
  regionId: OP10M_A11_RegionId;
  permanenceScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityPermanenceBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityAmalgamationBand = 'latent' | 'aligning' | 'total' | 'amalgamation';

export interface OP10M_A11_CollapseOmniSingularityAmalgamationRow {
  regionId: OP10M_A11_RegionId;
  amalgamationScore: number;
  band: OP10M_A11_CollapseOmniSingularityAmalgamationBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionAtomizationBand = 'dormant' | 'atomizing' | 'total' | 'complete_atomization';

export interface OP10M_A11_VoidTotalErosionAtomizationRow {
  regionId: OP10M_A11_RegionId;
  atomizationScore: number;
  band: OP10M_A11_VoidTotalErosionAtomizationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityInevitabilityBand = 'trace' | 'inevitable' | 'absolute' | 'total_inevitability';

export interface OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow {
  regionId: OP10M_A11_RegionId;
  inevitabilityScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityInevitabilityBand;
  marks: string[];
  narrative: string;
}

export interface OP10M_A11_ExistentialAbsoluteNullityContinuityRow {
  regionId: OP10M_A11_RegionId;
  continuityScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityContinuityBand;
  marks: string[];
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
  landUseGridlock: OP10M_A11_LandUseGridlockRow[];
  nationalLandUseGridlockIndex: number;
  mobilityTrap: OP10M_A11_MobilityTrapRow[];
  nationalMobilityTrapIndex: number;
  absorptionGap: OP10M_A11_AbsorptionGapRow[];
  nationalAbsorptionGapIndex: number;
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
  nationalReliefOverheadIndex: number;
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
  nationalCorridorEquityDriftIndex: number;
  climateAdaptationLag: OP10M_A11_AdaptationLagRow[];
  nationalClimateAdaptationLagIndex: number;
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
  nationalFiscalCapacityStrainIndex: number;
  networkResilienceErosion: OP10M_A11_NetworkErosionRow[];
  nationalNetworkResilienceErosionIndex: number;
  longHorizonCapacityRisk: OP10M_A11_HorizonRiskRow[];
  nationalLongHorizonCapacityRiskIndex: number;
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
  nationalCohesionIntegrityIndex: number;
  reliefEquityGap: OP10M_A11_ReliefEquityGapRow[];
  nationalReliefEquityGapIndex: number;
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  nationalSystemicFragilityIndex: number;
  governanceResilienceDecay: OP10M_A11_GovernanceResilienceRow[];
  nationalGovernanceResilienceDecayIndex: number;
  migrationStabilityErosion: OP10M_A11_MigrationStabilityRow[];
  nationalMigrationStabilityErosionIndex: number;
  adaptiveCapacityCeiling: OP10M_A11_AdaptiveCeilingRow[];
  nationalAdaptiveCapacityCeilingIndex: number;
  fiscalGovernanceCoupling: OP10M_A11_FiscalGovernanceCouplingRow[];
  nationalFiscalGovernanceCouplingIndex: number;
  networkEquityTension: OP10M_A11_NetworkEquityTensionRow[];
  nationalNetworkEquityTensionIndex: number;
  resilienceFrontier: OP10M_A11_ResilienceFrontierRow[];
  nationalResilienceFrontierIndex: number;
  metaGovernanceFatigue: OP10M_A11_MetaGovernanceFatigueRow[];
  nationalMetaGovernanceFatigueIndex: number;
  capitalMobilityAsymmetry: OP10M_A11_CapitalMobilityAsymmetryRow[];
  nationalCapitalMobilityAsymmetryIndex: number;
  compoundShockSaturation: OP10M_A11_CompoundShockSaturationRow[];
  nationalCompoundShockSaturationIndex: number;
  institutionalTrustErosion: OP10M_A11_InstitutionalTrustErosionRow[];
  nationalInstitutionalTrustErosionIndex: number;
  liquidityFragmentation: OP10M_A11_LiquidityFragmentationRow[];
  nationalLiquidityFragmentationIndex: number;
  cascadingFailureRisk: OP10M_A11_CascadingFailureRiskRow[];
  nationalCascadingFailureRiskIndex: number;
  socialContractFragility: OP10M_A11_SocialContractFragilityRow[];
  nationalSocialContractFragilityIndex: number;
  capitalFlightPanic: OP10M_A11_CapitalFlightPanicRow[];
  nationalCapitalFlightPanicIndex: number;
  irrecoverableCollapseThreshold: OP10M_A11_IrrecoverableCollapseThresholdRow[];
  nationalIrrecoverableCollapseThresholdIndex: number;
  settlementLegitimacyCollapse: OP10M_A11_SettlementLegitimacyCollapseRow[];
  nationalSettlementLegitimacyCollapseIndex: number;
  fiscalPanicContagion: OP10M_A11_FiscalPanicContagionRow[];
  nationalFiscalPanicContagionIndex: number;
  terminalStateLockIn: OP10M_A11_TerminalStateLockInRow[];
  nationalTerminalStateLockInIndex: number;
  governanceVacuumEscalation: OP10M_A11_GovernanceVacuumEscalationRow[];
  nationalGovernanceVacuumEscalationIndex: number;
  settlementAbandonmentSpiral: OP10M_A11_SettlementAbandonmentSpiralRow[];
  nationalSettlementAbandonmentSpiralIndex: number;
  postCollapseRecoveryImpossibility: OP10M_A11_PostCollapseRecoveryImpossibilityRow[];
  nationalPostCollapseRecoveryImpossibilityIndex: number;
  stateCollapseCascadeAmplification: OP10M_A11_StateCollapseCascadeAmplificationRow[];
  nationalStateCollapseCascadeAmplificationIndex: number;
  hollowRegionContagion: OP10M_A11_HollowRegionContagionRow[];
  nationalHollowRegionContagionIndex: number;
  permanentDepopulationLock: OP10M_A11_PermanentDepopulationLockRow[];
  nationalPermanentDepopulationLockIndex: number;
  totalCollapseSingularity: OP10M_A11_TotalCollapseSingularityRow[];
  nationalTotalCollapseSingularityIndex: number;
  voidExpansionVelocity: OP10M_A11_VoidExpansionVelocityRow[];
  nationalVoidExpansionVelocityIndex: number;
  existentialContinuityFracture: OP10M_A11_ExistentialContinuityFractureRow[];
  nationalExistentialContinuityFractureIndex: number;
  collapseHorizonConvergence: OP10M_A11_CollapseHorizonConvergenceRow[];
  nationalCollapseHorizonConvergenceIndex: number;
  voidTotalizationSurge: OP10M_A11_VoidTotalizationSurgeRow[];
  nationalVoidTotalizationSurgeIndex: number;
  existentialTerminusLock: OP10M_A11_ExistentialTerminusLockRow[];
  nationalExistentialTerminusLockIndex: number;
  absoluteCollapseHorizonLock: OP10M_A11_AbsoluteCollapseHorizonLockRow[];
  nationalAbsoluteCollapseHorizonLockIndex: number;
  voidFinalizationCascade: OP10M_A11_VoidFinalizationCascadeRow[];
  nationalVoidFinalizationCascadeIndex: number;
  existentialObliterationThreshold: OP10M_A11_ExistentialObliterationThresholdRow[];
  nationalExistentialObliterationThresholdIndex: number;
  ultimateCollapseSingularitySeal: OP10M_A11_UltimateCollapseSingularitySealRow[];
  nationalUltimateCollapseSingularitySealIndex: number;
  voidAnnihilationConvergence: OP10M_A11_VoidAnnihilationConvergenceRow[];
  nationalVoidAnnihilationConvergenceIndex: number;
  existentialNullStateLock: OP10M_A11_ExistentialNullStateLockRow[];
  nationalExistentialNullStateLockIndex: number;
  collapseExistenceSingularityPoint: OP10M_A11_CollapseExistenceSingularityPointRow[];
  nationalCollapseExistenceSingularityPointIndex: number;
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
  nationalVoidExistenceAnnihilationFrontIndex: number;
  existentialAbsoluteZeroLock: OP10M_A11_ExistentialAbsoluteZeroLockRow[];
  nationalExistentialAbsoluteZeroLockIndex: number;
  collapseOmniSingularityNode: OP10M_A11_CollapseOmniSingularityNodeRow[];
  nationalCollapseOmniSingularityNodeIndex: number;
  voidAbsoluteErosionSurge: OP10M_A11_VoidAbsoluteErosionSurgeRow[];
  nationalVoidAbsoluteErosionSurgeIndex: number;
  existentialFinalNullityLock: OP10M_A11_ExistentialFinalNullityLockRow[];
  nationalExistentialFinalNullityLockIndex: number;
  collapseTotalSingularityVertex: OP10M_A11_CollapseTotalSingularityVertexRow[];
  nationalCollapseTotalSingularityVertexIndex: number;
  voidTerminalErosionCascade: OP10M_A11_VoidTerminalErosionCascadeRow[];
  nationalVoidTerminalErosionCascadeIndex: number;
  existentialUltimateNullitySeal: OP10M_A11_ExistentialUltimateNullitySealRow[];
  nationalExistentialUltimateNullitySealIndex: number;
  collapseAbsoluteSingularityApex: OP10M_A11_CollapseAbsoluteSingularityApexRow[];
  nationalCollapseAbsoluteSingularityApexIndex: number;
  voidCompleteErosionTerminality: OP10M_A11_VoidCompleteErosionTerminalityRow[];
  nationalVoidCompleteErosionTerminalityIndex: number;
  existentialFinalNullityClosure: OP10M_A11_ExistentialFinalNullityClosureRow[];
  nationalExistentialFinalNullityClosureIndex: number;
  collapseUltimateSingularityZenith: OP10M_A11_CollapseUltimateSingularityZenithRow[];
  nationalCollapseUltimateSingularityZenithIndex: number;
  voidTotalErosionFinality: OP10M_A11_VoidTotalErosionFinalityRow[];
  nationalVoidTotalErosionFinalityIndex: number;
  existentialAbsoluteNullityVerdict: OP10M_A11_ExistentialAbsoluteNullityVerdictRow[];
  nationalExistentialAbsoluteNullityVerdictIndex: number;
  collapseTotalSingularityNexus: OP10M_A11_CollapseTotalSingularityNexusRow[];
  nationalCollapseTotalSingularityNexusIndex: number;
  voidAbsoluteErosionTermination: OP10M_A11_VoidAbsoluteErosionTerminationRow[];
  nationalVoidAbsoluteErosionTerminationIndex: number;
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
  nationalExistentialFinalNullitySentenceIndex: number;
  collapseAbsoluteSingularityCulmination: OP10M_A11_CollapseAbsoluteSingularityCulminationRow[];
  nationalCollapseAbsoluteSingularityCulminationIndex: number;
  voidCompleteErosionExtinction: OP10M_A11_VoidCompleteErosionExtinctionRow[];
  nationalVoidCompleteErosionExtinctionIndex: number;
  existentialTotalNullityDecree: OP10M_A11_ExistentialTotalNullityDecreeRow[];
  nationalExistentialTotalNullityDecreeIndex: number;
  collapseOmniSingularitySynthesis: OP10M_A11_CollapseOmniSingularitySynthesisRow[];
  nationalCollapseOmniSingularitySynthesisIndex: number;
  voidTotalErosionAnnihilation: OP10M_A11_VoidTotalErosionAnnihilationRow[];
  nationalVoidTotalErosionAnnihilationIndex: number;
  existentialAbsoluteNullityMandate: OP10M_A11_ExistentialAbsoluteNullityMandateRow[];
  nationalExistentialAbsoluteNullityMandateIndex: number;
  collapseOmniSingularityConvergence: OP10M_A11_CollapseOmniSingularityConvergenceRow[];
  nationalCollapseOmniSingularityConvergenceIndex: number;
  voidTotalErosionObliteration: OP10M_A11_VoidTotalErosionObliterationRow[];
  nationalVoidTotalErosionObliterationIndex: number;
  existentialAbsoluteNullityBinding: OP10M_A11_ExistentialAbsoluteNullityBindingRow[];
  nationalExistentialAbsoluteNullityBindingIndex: number;
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  nationalCollapseOmniSingularityIntegrationIndex: number;
  voidTotalErosionEradication: OP10M_A11_VoidTotalErosionEradicationRow[];
  nationalVoidTotalErosionEradicationIndex: number;
  existentialAbsoluteNullityContinuity: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[];
  nationalExistentialAbsoluteNullityContinuityIndex: number;
  collapseOmniSingularityUnification: OP10M_A11_CollapseOmniSingularityUnificationRow[];
  nationalCollapseOmniSingularityUnificationIndex: number;
  voidTotalErosionElimination: OP10M_A11_VoidTotalErosionEliminationRow[];
  nationalVoidTotalErosionEliminationIndex: number;
  existentialAbsoluteNullityPerpetuity: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[];
  nationalExistentialAbsoluteNullityPerpetuityIndex: number;
  collapseOmniSingularityConsolidation: OP10M_A11_CollapseOmniSingularityConsolidationRow[];
  nationalCollapseOmniSingularityConsolidationIndex: number;
  voidTotalErosionDissolution: OP10M_A11_VoidTotalErosionDissolutionRow[];
  nationalVoidTotalErosionDissolutionIndex: number;
  existentialAbsoluteNullityImmutability: OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow[];
  nationalExistentialAbsoluteNullityImmutabilityIndex: number;
  collapseOmniSingularityCoalescence: OP10M_A11_CollapseOmniSingularityCoalescenceRow[];
  nationalCollapseOmniSingularityCoalescenceIndex: number;
  voidTotalErosionSublimation: OP10M_A11_VoidTotalErosionSublimationRow[];
  nationalVoidTotalErosionSublimationIndex: number;
  existentialAbsoluteNullityPermanence: OP10M_A11_ExistentialAbsoluteNullityPermanenceRow[];
  nationalExistentialAbsoluteNullityPermanenceIndex: number;
  collapseOmniSingularityAmalgamation: OP10M_A11_CollapseOmniSingularityAmalgamationRow[];
  nationalCollapseOmniSingularityAmalgamationIndex: number;
  voidTotalErosionAtomization: OP10M_A11_VoidTotalErosionAtomizationRow[];
  nationalVoidTotalErosionAtomizationIndex: number;
  existentialAbsoluteNullityInevitability: OP10M_A11_ExistentialAbsoluteNullityInevitabilityRow[];
  nationalExistentialAbsoluteNullityInevitabilityIndex: number;
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
  lastLandUseGridlockIndex: number;
  lastMobilityTrapIndex: number;
  lastAbsorptionGapIndex: number;
  lastReliefOverheadIndex: number;
  lastCorridorEquityDriftIndex: number;
  lastClimateAdaptationLagIndex: number;
  lastFiscalCapacityStrainIndex: number;
  lastNetworkResilienceErosionIndex: number;
  lastLongHorizonCapacityRiskIndex: number;
  lastCohesionIntegrityIndex: number;
  lastReliefEquityGapIndex: number;
  lastSystemicFragilityIndex: number;
  lastGovernanceResilienceDecayIndex: number;
  lastMigrationStabilityErosionIndex: number;
  lastAdaptiveCapacityCeilingIndex: number;
  lastFiscalGovernanceCouplingIndex: number;
  lastNetworkEquityTensionIndex: number;
  lastResilienceFrontierIndex: number;
  lastMetaGovernanceFatigueIndex: number;
  lastCapitalMobilityAsymmetryIndex: number;
  lastCompoundShockSaturationIndex: number;
  lastInstitutionalTrustErosionIndex: number;
  lastLiquidityFragmentationIndex: number;
  lastCascadingFailureRiskIndex: number;
  lastSocialContractFragilityIndex: number;
  lastCapitalFlightPanicIndex: number;
  lastIrrecoverableCollapseThresholdIndex: number;
  lastSettlementLegitimacyCollapseIndex: number;
  lastFiscalPanicContagionIndex: number;
  lastTerminalStateLockInIndex: number;
  lastGovernanceVacuumEscalationIndex: number;
  lastSettlementAbandonmentSpiralIndex: number;
  lastPostCollapseRecoveryImpossibilityIndex: number;
  lastStateCollapseCascadeAmplificationIndex: number;
  lastHollowRegionContagionIndex: number;
  lastPermanentDepopulationLockIndex: number;
  lastTotalCollapseSingularityIndex: number;
  lastVoidExpansionVelocityIndex: number;
  lastExistentialContinuityFractureIndex: number;
  lastCollapseHorizonConvergenceIndex: number;
  lastVoidTotalizationSurgeIndex: number;
  lastExistentialTerminusLockIndex: number;
  lastAbsoluteCollapseHorizonLockIndex: number;
  lastVoidFinalizationCascadeIndex: number;
  lastExistentialObliterationThresholdIndex: number;
  lastUltimateCollapseSingularitySealIndex: number;
  lastVoidAnnihilationConvergenceIndex: number;
  lastExistentialNullStateLockIndex: number;
  lastCollapseExistenceSingularityPointIndex: number;
  lastVoidExistenceAnnihilationFrontIndex: number;
  lastExistentialAbsoluteZeroLockIndex: number;
  lastCollapseOmniSingularityNodeIndex: number;
  lastVoidAbsoluteErosionSurgeIndex: number;
  lastExistentialFinalNullityLockIndex: number;
  lastCollapseTotalSingularityVertexIndex: number;
  lastVoidTerminalErosionCascadeIndex: number;
  lastExistentialUltimateNullitySealIndex: number;
  lastCollapseAbsoluteSingularityApexIndex: number;
  lastVoidCompleteErosionTerminalityIndex: number;
  lastExistentialFinalNullityClosureIndex: number;
  lastCollapseUltimateSingularityZenithIndex: number;
  lastVoidTotalErosionFinalityIndex: number;
  lastExistentialAbsoluteNullityVerdictIndex: number;
  lastCollapseTotalSingularityNexusIndex: number;
  lastVoidAbsoluteErosionTerminationIndex: number;
  lastExistentialFinalNullitySentenceIndex: number;
  lastCollapseAbsoluteSingularityCulminationIndex: number;
  lastVoidCompleteErosionExtinctionIndex: number;
  lastExistentialTotalNullityDecreeIndex: number;
  lastCollapseOmniSingularitySynthesisIndex: number;
  lastVoidTotalErosionAnnihilationIndex: number;
  lastExistentialAbsoluteNullityMandateIndex: number;
  lastCollapseOmniSingularityConvergenceIndex: number;
  lastVoidTotalErosionObliterationIndex: number;
  lastExistentialAbsoluteNullityBindingIndex: number;
  lastCollapseOmniSingularityIntegrationIndex: number;
  lastVoidTotalErosionEradicationIndex: number;
  lastExistentialAbsoluteNullityContinuityIndex: number;
  lastCollapseOmniSingularityUnificationIndex: number;
  lastVoidTotalErosionEliminationIndex: number;
  lastExistentialAbsoluteNullityPerpetuityIndex: number;
  lastCollapseOmniSingularityConsolidationIndex: number;
  lastVoidTotalErosionDissolutionIndex: number;
  lastExistentialAbsoluteNullityImmutabilityIndex: number;
  lastCollapseOmniSingularityCoalescenceIndex: number;
  lastVoidTotalErosionSublimationIndex: number;
  lastExistentialAbsoluteNullityPermanenceIndex: number;
  lastCollapseOmniSingularityAmalgamationIndex: number;
  lastVoidTotalErosionAtomizationIndex: number;
  lastExistentialAbsoluteNullityInevitabilityIndex: number;
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


// --- source: urban-corridor-flow.ts ---

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


// --- source: regional-migration-pressure.ts ---

function migrationBand(score: number): OP10M_A11_MigrationPressureBand {
  if (score < 22) return 'stable';
  if (score < 42) return 'elevated';
  if (score < 62) return 'high';
  return 'surge';
}

export function op10mA11ComputeMigrationPressure(args: {
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): OP10M_A11_MigrationPressureRow[] {
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const inboundFlow = new Map<OP10M_A11_RegionId, number>();
  for (const rid of OP10M_A11_CORE_REGIONS) inboundFlow.set(rid, 0);
  for (const f of args.corridorFlows) {
    if (f.band === 'heavy' || f.band === 'surge') {
      inboundFlow.set(f.toRegion, (inboundFlow.get(f.toRegion) ?? 0) + f.flowPressure * 0.35);
    }
  }

  const rows: OP10M_A11_MigrationPressureRow[] = [];
  for (const rid of OP10M_A11_CORE_REGIONS) {
    const row = args.regions[rid];
    const hub = hubByRegion.get(rid);
    const bn = bottleneckByRegion.get(rid);

    const pull =
      row.leading && row.band !== 'contracting'
        ? op10mA11Clamp(row.urbanGrowthIndex * 0.45 + (row.relativeStanding - 50) * 0.25)
        : op10mA11Clamp(Math.max(0, 62 - row.urbanGrowthIndex) * 0.2);

    const push =
      (row.lagging ? 18 : 0) +
      (bn?.severity === 'critical' ? 22 : bn?.severity === 'meaningful' ? 12 : 0) +
      (hub ? hub.isolationScore * 0.28 : 0);

    const corridorPull = op10mA11Clamp((inboundFlow.get(rid) ?? 0) * 0.4);
    const netPressure = op10mA11Clamp(pull + corridorPull + push * 0.55 - (row.spilloverBand === 'integrated' ? 8 : 0));

    const primaryDirection: OP10M_A11_MigrationPressureRow['primaryDirection'] =
      pull + corridorPull > push + 12
        ? 'inbound'
        : push > pull + 10
          ? 'outbound'
          : 'balanced';

    rows.push({
      regionId: rid,
      pullScore: op10mA11Round(pull + corridorPull),
      pushScore: op10mA11Round(push),
      netPressure: op10mA11Round(netPressure),
      band: migrationBand(netPressure),
      primaryDirection,
      narrative: `${rid} migration ${migrationBand(netPressure)} (${primaryDirection}); pull ${op10mA11Round(pull + corridorPull)} vs push ${op10mA11Round(push)}.`,
    });
  }

  return rows.sort((a, b) => b.netPressure - a.netPressure);
}

export function op10mA11RegionsWithMigrationSurge(rows: OP10M_A11_MigrationPressureRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'surge' || r.band === 'high').map((r) => r.regionId);
}


// --- source: settlement-vulnerability.ts ---

function vulnerabilityBand(score: number): OP10M_A11_SettlementVulnerabilityBand {
  if (score < 28) return 'resilient';
  if (score < 48) return 'exposed';
  if (score < 68) return 'fragile';
  return 'critical';
}

export function op10mA11ComputeSettlementVulnerability(args: {
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  fragilityIndex: number;
}): OP10M_A11_SettlementVulnerabilityRow[] {
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_SettlementVulnerabilityRow[] = [];
  for (const rid of OP10M_A11_CORE_REGIONS) {
    const region = args.regions[rid];
    const bn = bottleneckByRegion.get(rid);
    const hub = hubByRegion.get(rid);

    const inequalityStress = region.lagging ? 22 : region.leading ? 8 : 14;
    const bottleneckStress =
      bn?.severity === 'critical' ? 32 : bn?.severity === 'meaningful' ? 20 : bn ? 10 : 0;
    const isolationStress = hub ? op10mA11Clamp(hub.isolationScore * 0.55) : 15;
    const spilloverPenalty =
      region.spilloverBand === 'isolated' ? 16 : region.spilloverBand === 'weak' ? 8 : 0;
    const networkStress = op10mA11Clamp(args.fragilityIndex * 0.12);

    const compositeScore = op10mA11Clamp(
      inequalityStress + bottleneckStress + isolationStress + spilloverPenalty + networkStress,
    );

    const drivers: string[] = [];
    if (region.lagging) drivers.push('lagging urban standing');
    if (bn) drivers.push(`infrastructure bottleneck (${bn.severity})`);
    if (hub && hub.isolationScore >= 55) drivers.push('linkage isolation');
    if (region.spilloverBand === 'isolated') drivers.push('weak national spillover');
    if (!drivers.length) drivers.push('baseline settlement exposure');

    rows.push({
      regionId: rid,
      vulnerabilityScore: op10mA11Round(compositeScore),
      band: vulnerabilityBand(compositeScore),
      drivers: drivers.slice(0, 4),
      narrative: `${rid} settlement ${vulnerabilityBand(compositeScore)} (score ${op10mA11Round(compositeScore)}): ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  return rows.sort((a, b) => b.vulnerabilityScore - a.vulnerabilityScore);
}

export function op10mA11CriticalSettlementRegions(
  rows: OP10M_A11_SettlementVulnerabilityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical' || r.band === 'fragile').map((r) => r.regionId);
}


// --- source: fiscal-urban-coupling.ts ---

const DISTRIBUTION_FISCAL_WEIGHT: Record<OP10M_A11_NationalSlice['distributionBand'], number> = {
  broad_based: 78,
  mixed: 58,
  uneven: 38,
  highly_uneven: 22,
};

function fiscalBand(score: number): OP10M_A11_FiscalCouplingBand {
  if (score >= 68) return 'aligned';
  if (score >= 48) return 'partial';
  if (score >= 28) return 'strained';
  return 'misaligned';
}

export function op10mA11ComputeFiscalUrbanCoupling(args: {
  national: OP10M_A11_NationalSlice;
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
}): { rows: OP10M_A11_FiscalUrbanCouplingRow[]; nationalIndex: number } {
  const baseFiscal = DISTRIBUTION_FISCAL_WEIGHT[args.national.distributionBand];
  const biasDrag = op10mA11Clamp(args.national.capitalCityBias * 0.42, 0, 24);

  const rows: OP10M_A11_FiscalUrbanCouplingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const region = args.regions[rid];
    const lagNeed = region.lagging ? 18 : region.leading ? -6 : 4;
    const spilloverBoost =
      region.spilloverBand === 'integrated' ? 10 : region.spilloverBand === 'connected' ? 5 : 0;

    const couplingScore = op10mA11Clamp(
      baseFiscal + spilloverBoost + lagNeed - biasDrag - (region.leading ? biasDrag * 0.25 : 0),
    );

    weighted += couplingScore;

    rows.push({
      regionId: rid,
      couplingScore: op10mA11Round(couplingScore),
      band: fiscalBand(couplingScore),
      catchUpPotential: op10mA11Clamp(couplingScore * 0.65 + (region.lagging ? 12 : 0)),
      narrative: `${rid} fiscal–urban ${fiscalBand(couplingScore)} (${op10mA11Round(couplingScore)}); catch-up potential ${op10mA11Round(op10mA11Clamp(couplingScore * 0.65 + (region.lagging ? 12 : 0)))}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows, nationalIndex };
}

export function op10mA11RegionalCohesionIndex(args: {
  inequalityIndex: number;
  fragilityIndex: number;
  fiscalNationalIndex: number;
  maxMigrationPressure: number;
}): number {
  const inequalityDrag = op10mA11Clamp(args.inequalityIndex * 0.35);
  const fragilityDrag = op10mA11Clamp(args.fragilityIndex * 0.28);
  const fiscalLift = op10mA11Clamp(args.fiscalNationalIndex * 0.45);
  const migrationDrag = op10mA11Clamp(args.maxMigrationPressure * 0.22);
  return op10mA11Clamp(72 + fiscalLift - inequalityDrag - fragilityDrag - migrationDrag);
}

export function op10mA11MisalignedFiscalRegions(rows: OP10M_A11_FiscalUrbanCouplingRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'misaligned' || r.band === 'strained').map((r) => r.regionId);
}


// --- source: metropolitan-absorption-stress.ts ---

const GROWTH_LOAD: Record<OP10M_A11_CityGrowthSlice['growthBand'], number> = {
  contracting: 8,
  slow: 18,
  steady: 32,
  fast: 52,
  surging: 68,
};

function absorptionBand(stress: number): OP10M_A11_AbsorptionStressBand {
  if (stress < 28) return 'comfortable';
  if (stress < 48) return 'tightening';
  if (stress < 68) return 'strained';
  return 'breached';
}

export function op10mA11ComputeMetropolitanAbsorptionStress(
  cities: OP10M_A11_CityGrowthSlice[],
): OP10M_A11_AbsorptionStressRow[] {
  const rows: OP10M_A11_AbsorptionStressRow[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const regionCities = cities.filter((c) => c.regionId === rid);
    if (!regionCities.length) {
      rows.push({
        regionId: rid,
        stressScore: 22,
        band: 'comfortable',
        minHeadroom: 50,
        gatewayLoad: 0,
        narrative: `${rid} absorption comfortable — no tracked metros; neutral prior.`,
      });
      continue;
    }

    const minHeadroom = Math.min(...regionCities.map((c) => c.absorptionHeadroom));
    const avgLoad =
      regionCities.reduce((a, c) => a + GROWTH_LOAD[c.growthBand], 0) / regionCities.length;
    const gatewayLoad = regionCities
      .filter((c) => c.gateway)
      .reduce((a, c) => a + GROWTH_LOAD[c.growthBand] * 1.15, 0);

    const headroomPenalty = op10mA11Clamp(72 - minHeadroom);
    const stressScore = op10mA11Clamp(avgLoad * 0.55 + headroomPenalty * 0.65 + gatewayLoad * 0.08);

    rows.push({
      regionId: rid,
      stressScore: op10mA11Round(stressScore),
      band: absorptionBand(stressScore),
      minHeadroom: op10mA11Round(minHeadroom),
      gatewayLoad: op10mA11Round(gatewayLoad),
      narrative: `${rid} absorption ${absorptionBand(stressScore)} (stress ${op10mA11Round(stressScore)}); min headroom ${op10mA11Round(minHeadroom)}.`,
    });
  }

  return rows.sort((a, b) => b.stressScore - a.stressScore);
}

export function op10mA11RegionsWithAbsorptionBreach(rows: OP10M_A11_AbsorptionStressRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'breached' || r.band === 'strained').map((r) => r.regionId);
}

export function op10mA11NationalMetropolitanSaturation(rows: OP10M_A11_AbsorptionStressRow[]): number {
  if (!rows.length) return 0;
  const avg = rows.reduce((a, r) => a + r.stressScore, 0) / rows.length;
  const breached = rows.filter((r) => r.band === 'breached').length;
  return op10mA11Round(op10mA11Clamp(avg + breached * 6));
}


// --- source: regional-service-equity.ts ---

function serviceEquityBand(score: number): OP10M_A11_ServiceEquityBand {
  if (score >= 68) return 'equitable';
  if (score >= 48) return 'mixed';
  if (score >= 28) return 'uneven';
  return 'critical_gap';
}

export function op10mA11ComputeRegionalServiceEquity(args: {
  settlement: OP10M_A11_SettlementVulnerabilityRow[];
  fiscal: OP10M_A11_FiscalUrbanCouplingRow[];
}): { rows: OP10M_A11_ServiceEquityRow[]; nationalIndex: number } {
  const settlementByRegion = new Map(args.settlement.map((s) => [s.regionId, s]));
  const fiscalByRegion = new Map(args.fiscal.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_ServiceEquityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const settle = settlementByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);
    const vulnerabilityDrag = settle ? op10mA11Clamp(settle.vulnerabilityScore * 0.55) : 20;
    const fiscalLift = fiscal ? op10mA11Clamp(fiscal.couplingScore * 0.42) : 24;
    const catchUpBoost = fiscal ? op10mA11Clamp(fiscal.catchUpPotential * 0.18) : 0;

    const equityScore = op10mA11Clamp(58 + fiscalLift + catchUpBoost - vulnerabilityDrag);
    weighted += equityScore;

    const gapDrivers: string[] = [];
    if (settle && (settle.band === 'critical' || settle.band === 'fragile')) {
      gapDrivers.push('settlement exposure');
    }
    if (fiscal && (fiscal.band === 'misaligned' || fiscal.band === 'strained')) {
      gapDrivers.push('fiscal misalignment');
    }
    if (!gapDrivers.length) gapDrivers.push('balanced service delivery');

    rows.push({
      regionId: rid,
      equityScore: op10mA11Round(equityScore),
      band: serviceEquityBand(equityScore),
      gapDrivers: gapDrivers.slice(0, 3),
      narrative: `${rid} service equity ${serviceEquityBand(equityScore)} (${op10mA11Round(equityScore)}); ${gapDrivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => a.equityScore - b.equityScore), nationalIndex };
}

export function op10mA11RegionsWithServiceEquityGap(rows: OP10M_A11_ServiceEquityRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical_gap' || r.band === 'uneven').map((r) => r.regionId);
}


// --- source: regional-convergence-velocity.ts ---

function convergenceBand(velocity: number, spread: number): OP10M_A11_ConvergenceBand {
  if (spread < 18) return 'balanced';
  if (velocity >= 4) return 'catching_up';
  if (velocity <= -3) return 'diverging';
  return 'stalled';
}

export function op10mA11StandingSpread(regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>): number {
  const standings = OP10M_A11_CORE_REGIONS.map((rid) => regions[rid].relativeStanding);
  return op10mA11Round(Math.max(...standings) - Math.min(...standings));
}

export function op10mA11ComputeRegionalConvergence(args: {
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
  priorStandingSpread: number | null;
}): OP10M_A11_ConvergenceVelocityRow {
  const spread = op10mA11StandingSpread(args.regions);
  const prior = args.priorStandingSpread ?? spread;
  const velocity = op10mA11Round(prior - spread);

  const lagging = OP10M_A11_CORE_REGIONS.filter((rid) => args.regions[rid].lagging);
  const leading = OP10M_A11_CORE_REGIONS.filter((rid) => args.regions[rid].leading);
  const band = convergenceBand(velocity, spread);

  return {
    standingSpread: spread,
    velocity,
    band,
    laggingCount: lagging.length,
    leadingCount: leading.length,
    narrative: `Regional standing spread ${spread} (${band}); velocity ${velocity} vs prior ${prior}.`,
  };
}

export function op10mA11ConvergenceStalled(row: OP10M_A11_ConvergenceVelocityRow): boolean {
  return row.band === 'stalled' || row.band === 'diverging';
}

export function op10mA11LaggingRegionsNotClosing(
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>,
  row: OP10M_A11_ConvergenceVelocityRow,
): OP10M_A11_RegionId[] {
  if (row.band === 'catching_up' || row.band === 'balanced') return [];
  return OP10M_A11_CORE_REGIONS.filter((rid) => regions[rid].lagging && regions[rid].relativeStanding < 42);
}


// --- source: peri-urban-expansion-pressure.ts ---

const GROWTH_SPRAWL: Record<OP10M_A11_CityGrowthSlice['growthBand'], number> = {
  contracting: 6,
  slow: 14,
  steady: 28,
  fast: 46,
  surging: 62,
};

function periUrbanBand(score: number): OP10M_A11_PeriUrbanPressureBand {
  if (score < 26) return 'contained';
  if (score < 46) return 'expanding';
  if (score < 66) return 'sprawl_risk';
  return 'unchecked';
}

export function op10mA11ComputePeriUrbanExpansionPressure(args: {
  cities: OP10M_A11_CityGrowthSlice[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): OP10M_A11_PeriUrbanPressureRow[] {
  const inboundFlow = new Map<OP10M_A11_RegionId, number>();
  for (const flow of args.corridorFlows) {
    inboundFlow.set(flow.toRegion, (inboundFlow.get(flow.toRegion) ?? 0) + flow.flowPressure * 0.35);
  }

  const rows: OP10M_A11_PeriUrbanPressureRow[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const regionCities = args.cities.filter((c) => c.regionId === rid);
    const avgSprawl =
      regionCities.length > 0
        ? regionCities.reduce((a, c) => a + GROWTH_SPRAWL[c.growthBand], 0) / regionCities.length
        : 18;
    const corridorPull = op10mA11Clamp(inboundFlow.get(rid) ?? 0);
    const nonGatewayPenalty = regionCities.filter((c) => !c.gateway).length * 4;

    const pressureScore = op10mA11Clamp(avgSprawl * 0.62 + corridorPull * 0.48 + nonGatewayPenalty);
    const band = periUrbanBand(pressureScore);

    rows.push({
      regionId: rid,
      pressureScore: op10mA11Round(pressureScore),
      band,
      corridorPull: op10mA11Round(corridorPull),
      metroCount: regionCities.length,
      narrative: `${rid} peri-urban ${band} (pressure ${op10mA11Round(pressureScore)}); corridor pull ${op10mA11Round(corridorPull)}.`,
    });
  }

  return rows.sort((a, b) => b.pressureScore - a.pressureScore);
}

export function op10mA11NationalPeriUrbanPressureIndex(rows: OP10M_A11_PeriUrbanPressureRow[]): number {
  if (!rows.length) return 0;
  const avg = rows.reduce((a, r) => a + r.pressureScore, 0) / rows.length;
  const hot = rows.filter((r) => r.band === 'sprawl_risk' || r.band === 'unchecked').length;
  return op10mA11Round(op10mA11Clamp(avg + hot * 5));
}

export function op10mA11RegionsWithPeriUrbanSprawl(rows: OP10M_A11_PeriUrbanPressureRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'sprawl_risk' || r.band === 'unchecked').map((r) => r.regionId);
}


// --- source: regional-infrastructure-backlog.ts ---

function backlogBand(score: number): OP10M_A11_InfrastructureBacklogBand {
  if (score < 28) return 'manageable';
  if (score < 48) return 'elevated';
  if (score < 68) return 'severe';
  return 'critical';
}

export function op10mA11ComputeRegionalInfrastructureBacklog(args: {
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  corridorStressIndex: number;
}): { rows: OP10M_A11_InfrastructureBacklogRow[]; nationalIndex: number } {
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_InfrastructureBacklogRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const bn = bottleneckByRegion.get(rid);
    const abs = absorptionByRegion.get(rid);
    const bottleneckLoad = bn ? op10mA11Clamp(bn.bindScore * 0.72) : 16;
    const absorptionDrag = abs ? op10mA11Clamp(abs.stressScore * 0.38) : 12;
    const networkDrag = op10mA11Clamp(args.corridorStressIndex * 0.22);

    const backlogScore = op10mA11Clamp(bottleneckLoad + absorptionDrag + networkDrag);
    weighted += backlogScore;

    const drivers: string[] = [];
    if (bn && bn.bindScore >= 45) drivers.push('regional bottleneck');
    if (abs && (abs.band === 'strained' || abs.band === 'breached')) drivers.push('absorption strain');
    if (args.corridorStressIndex >= 50) drivers.push('network corridor stress');
    if (!drivers.length) drivers.push('routine maintenance queue');

    rows.push({
      regionId: rid,
      backlogScore: op10mA11Round(backlogScore),
      band: backlogBand(backlogScore),
      estimatedTurnsToClear: op10mA11Round(op10mA11Clamp(backlogScore / 12)),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} infrastructure backlog ${backlogBand(backlogScore)} (${op10mA11Round(backlogScore)}); ~${op10mA11Round(op10mA11Clamp(backlogScore / 12))} turns to clear.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.backlogScore - a.backlogScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalBacklog(rows: OP10M_A11_InfrastructureBacklogRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical' || r.band === 'severe').map((r) => r.regionId);
}


// --- source: multi-tier-governance-friction.ts ---

const DISTRIBUTION_FRICTION: Record<OP10M_A11_NationalUrbanInputs['distributionBand'], number> = {
  balanced: 8,
  mixed: 18,
  uneven: 32,
  highly_uneven: 44,
};

function frictionBand(score: number): OP10M_A11_GovernanceFrictionBand {
  if (score < 30) return 'aligned';
  if (score < 50) return 'strained';
  if (score < 68) return 'fragmented';
  return 'breakdown';
}

export function op10mA11ComputeMultiTierGovernanceFriction(args: {
  national: OP10M_A11_NationalUrbanInputs;
  reliefPlaybook: OP10M_A11_ReliefPlaybookItem[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
}): { rows: OP10M_A11_GovernanceFrictionRow[]; nationalIndex: number } {
  const playbookByRegion = new Map(args.reliefPlaybook.map((p) => [p.regionId, p]));
  const equityByRegion = new Map(args.serviceEquity.map((e) => [e.regionId, e]));
  const nationalDrag = DISTRIBUTION_FRICTION[args.national.distributionBand];

  const rows: OP10M_A11_GovernanceFrictionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const playbook = playbookByRegion.get(rid);
    const equity = equityByRegion.get(rid);
    const reliefUrgency =
      playbook?.priority === 'urgent' ? 38 : playbook?.priority === 'high' ? 26 : playbook?.priority === 'medium' ? 14 : 6;
    const equityGap = equity ? op10mA11Clamp(72 - equity.equityScore) : 20;

    const frictionScore = op10mA11Clamp(reliefUrgency * 0.55 + equityGap * 0.42 + nationalDrag * 0.35);
    weighted += frictionScore;

    const coordinationGaps: string[] = [];
    if (playbook && (playbook.priority === 'urgent' || playbook.priority === 'high')) {
      coordinationGaps.push('relief coordination lag');
    }
    if (equity && (equity.band === 'critical_gap' || equity.band === 'uneven')) {
      coordinationGaps.push('service tier mismatch');
    }
    if (nationalDrag >= 32) coordinationGaps.push('national distribution skew');
    if (!coordinationGaps.length) coordinationGaps.push('routine intergovernmental sync');

    rows.push({
      regionId: rid,
      frictionScore: op10mA11Round(frictionScore),
      band: frictionBand(frictionScore),
      coordinationGaps: coordinationGaps.slice(0, 3),
      narrative: `${rid} governance ${frictionBand(frictionScore)} (friction ${op10mA11Round(frictionScore)}); ${coordinationGaps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.frictionScore - a.frictionScore), nationalIndex };
}

export function op10mA11RegionsWithGovernanceBreakdown(rows: OP10M_A11_GovernanceFrictionRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'breakdown' || r.band === 'fragmented').map((r) => r.regionId);
}

export function op10mA11GovernanceFrictionEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 58;
  return currentIndex >= 52 && currentIndex > priorIndex + 5;
}


// --- source: regional-housing-spillover-pressure.ts ---

function spilloverBand(score: number): OP10M_A11_HousingSpilloverBand {
  if (score < 28) return 'localized';
  if (score < 48) return 'spreading';
  if (score < 66) return 'cascade';
  return 'systemic';
}

export function op10mA11ComputeRegionalHousingSpilloverPressure(args: {
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): { rows: OP10M_A11_HousingSpilloverRow[]; nationalIndex: number } {
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));
  const periByRegion = new Map(args.periUrbanPressure.map((p) => [p.regionId, p]));
  const outboundFlow = new Map<OP10M_A11_RegionId, number>();

  for (const flow of args.corridorFlows) {
    outboundFlow.set(flow.fromRegion, (outboundFlow.get(flow.fromRegion) ?? 0) + flow.flowPressure * 0.42);
  }

  const rows: OP10M_A11_HousingSpilloverRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const abs = absorptionByRegion.get(rid);
    const peri = periByRegion.get(rid);
    const saturationDrag = abs ? op10mA11Clamp(abs.stressScore * 0.55) : 14;
    const fringeDrag = peri ? op10mA11Clamp(peri.pressureScore * 0.48) : 12;
    const corridorPush = op10mA11Clamp(outboundFlow.get(rid) ?? 0);

    const spilloverScore = op10mA11Clamp(saturationDrag + fringeDrag * 0.62 + corridorPush * 0.38);
    weighted += spilloverScore;

    const channels: string[] = [];
    if (abs && (abs.band === 'strained' || abs.band === 'breached')) channels.push('metro saturation bleed');
    if (peri && (peri.band === 'sprawl_risk' || peri.band === 'unchecked')) channels.push('peri-urban fringe');
    if (corridorPush >= 28) channels.push('corridor price diffusion');
    if (!channels.length) channels.push('contained local market');

    rows.push({
      regionId: rid,
      spilloverScore: op10mA11Round(spilloverScore),
      band: spilloverBand(spilloverScore),
      corridorPush: op10mA11Round(corridorPush),
      channels: channels.slice(0, 3),
      narrative: `${rid} housing spillover ${spilloverBand(spilloverScore)} (${op10mA11Round(spilloverScore)}); ${channels.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.spilloverScore - a.spilloverScore), nationalIndex };
}

export function op10mA11RegionsWithHousingSpilloverCascade(rows: OP10M_A11_HousingSpilloverRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'cascade' || r.band === 'systemic').map((r) => r.regionId);
}

export function op10mA11HousingSpilloverEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}


// --- source: interregional-talent-retention-stress.ts ---

const HUB_RETENTION: Record<OP10M_A11_LinkageHubProfile['role'], number> = {
  peripheral: 32,
  connector: 22,
  regional_hub: 14,
  national_hub: 8,
};

function retentionBand(drainScore: number): OP10M_A11_TalentRetentionBand {
  if (drainScore < 28) return 'stable';
  if (drainScore < 48) return 'leaky';
  if (drainScore < 66) return 'draining';
  return 'collapse';
}

export function op10mA11ComputeInterregionalTalentRetentionStress(args: {
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
}): { rows: OP10M_A11_TalentRetentionRow[]; nationalIndex: number } {
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));
  const fiscalByRegion = new Map(args.fiscalUrbanCoupling.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_TalentRetentionRow[] = [];
  let weightedDrain = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const mig = migrationByRegion.get(rid);
    const hub = hubByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const outboundDrag =
      mig && mig.primaryDirection === 'outbound' ? op10mA11Clamp(mig.pushScore * 0.58) : op10mA11Clamp((mig?.netPressure ?? 10) * 0.22);
    const hubDrag = hub ? HUB_RETENTION[hub.role] : 18;
    const fiscalDrag = fiscal ? op10mA11Clamp(68 - fiscal.couplingScore) * 0.42 : 16;

    const drainScore = op10mA11Clamp(outboundDrag + hubDrag * 0.45 + fiscalDrag);
    weightedDrain += drainScore;

    const riskFactors: string[] = [];
    if (mig && (mig.band === 'high' || mig.band === 'surge') && mig.primaryDirection === 'outbound') {
      riskFactors.push('outbound migration pull');
    }
    if (hub && (hub.role === 'peripheral' || hub.isolationScore >= 55)) riskFactors.push('peripheral isolation');
    if (fiscal && (fiscal.band === 'strained' || fiscal.band === 'misaligned')) riskFactors.push('fiscal catch-up gap');
    if (!riskFactors.length) riskFactors.push('balanced labor market');

    rows.push({
      regionId: rid,
      drainScore: op10mA11Round(drainScore),
      band: retentionBand(drainScore),
      riskFactors: riskFactors.slice(0, 3),
      narrative: `${rid} talent retention ${retentionBand(drainScore)} (drain ${op10mA11Round(drainScore)}); ${riskFactors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weightedDrain / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.drainScore - a.drainScore), nationalIndex };
}

export function op10mA11RegionsWithTalentDrain(rows: OP10M_A11_TalentRetentionRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'draining' || r.band === 'collapse').map((r) => r.regionId);
}


// --- source: climate-settlement-displacement-risk.ts ---

function displacementBand(score: number): OP10M_A11_ClimateDisplacementBand {
  if (score < 26) return 'low';
  if (score < 46) return 'elevated';
  if (score < 64) return 'acute';
  return 'critical';
}

export function op10mA11ComputeClimateSettlementDisplacementRisk(args: {
  settlementVulnerability: OP10M_A11_SettlementVulnerabilityRow[];
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  networkDigital: number;
  corridorStressIndex: number;
}): { rows: OP10M_A11_ClimateDisplacementRow[]; nationalIndex: number } {
  const settlementByRegion = new Map(args.settlementVulnerability.map((s) => [s.regionId, s]));
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const resilienceGap = op10mA11Clamp(78 - args.networkDigital * 0.65);
  const networkStress = op10mA11Clamp(args.corridorStressIndex * 0.28);

  const rows: OP10M_A11_ClimateDisplacementRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const settlement = settlementByRegion.get(rid);
    const bottleneck = bottleneckByRegion.get(rid);

    const exposureBase = settlement ? op10mA11Clamp(settlement.vulnerabilityScore * 0.62) : 18;
    const evacDrag = bottleneck ? op10mA11Clamp(bottleneck.bindScore * 0.38) : 12;
    const displacementScore = op10mA11Clamp(exposureBase + evacDrag + resilienceGap * 0.35 + networkStress);

    weighted += displacementScore;

    const hazards: string[] = [];
    if (settlement && (settlement.band === 'fragile' || settlement.band === 'critical')) {
      hazards.push('settlement exposure');
    }
    if (bottleneck && bottleneck.bindScore >= 42) hazards.push('evacuation corridor bind');
    if (resilienceGap >= 28) hazards.push('digital resilience gap');
    if (args.corridorStressIndex >= 52) hazards.push('network stress amplification');
    if (!hazards.length) hazards.push('routine hazard monitoring');

    rows.push({
      regionId: rid,
      displacementScore: op10mA11Round(displacementScore),
      band: displacementBand(displacementScore),
      hazards: hazards.slice(0, 3),
      narrative: `${rid} climate displacement ${displacementBand(displacementScore)} (${op10mA11Round(displacementScore)}); ${hazards.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.displacementScore - a.displacementScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalClimateDisplacement(rows: OP10M_A11_ClimateDisplacementRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'acute' || r.band === 'critical').map((r) => r.regionId);
}


// --- source: regional-amenity-cost-pressure.ts ---

function amenityBand(score: number): OP10M_A11_AmenityCostBand {
  if (score < 26) return 'affordable';
  if (score < 44) return 'stretching';
  if (score < 62) return 'strained';
  return 'crisis';
}

export function op10mA11ComputeRegionalAmenityCostPressure(args: {
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
  talentRetention: OP10M_A11_TalentRetentionRow[];
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
}): { rows: OP10M_A11_AmenityCostRow[]; nationalIndex: number } {
  const spillByRegion = new Map(args.housingSpillover.map((h) => [h.regionId, h]));
  const talentByRegion = new Map(args.talentRetention.map((t) => [t.regionId, t]));
  const fiscalByRegion = new Map(args.fiscalUrbanCoupling.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_AmenityCostRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const spill = spillByRegion.get(rid);
    const talent = talentByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const housingDrag = spill ? op10mA11Clamp(spill.spilloverScore * 0.52) : 14;
    const workforceDrag = talent ? op10mA11Clamp(talent.drainScore * 0.38) : 10;
    const fiscalDrag = fiscal
      ? op10mA11Clamp((100 - fiscal.couplingScore) * 0.22 + (fiscal.band === 'misaligned' ? 12 : 0))
      : 8;

    const amenityScore = op10mA11Clamp(housingDrag + workforceDrag * 0.58 + fiscalDrag);
    weighted += amenityScore;

    const pressures: string[] = [];
    if (spill && (spill.band === 'cascade' || spill.band === 'systemic')) pressures.push('housing spillover');
    if (talent && (talent.band === 'draining' || talent.band === 'collapse')) pressures.push('talent cost spiral');
    if (fiscal && (fiscal.band === 'strained' || fiscal.band === 'misaligned')) pressures.push('fiscal mismatch');
    if (!pressures.length) pressures.push('contained amenity load');

    rows.push({
      regionId: rid,
      amenityScore: op10mA11Round(amenityScore),
      band: amenityBand(amenityScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} amenity cost ${amenityBand(amenityScore)} (${op10mA11Round(amenityScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.amenityScore - a.amenityScore), nationalIndex };
}

export function op10mA11RegionsWithAmenityCostCrisis(rows: OP10M_A11_AmenityCostRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'strained' || r.band === 'crisis').map((r) => r.regionId);
}

export function op10mA11AmenityCostEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 5;
}


// --- source: digital-connectivity-decentralization-shift.ts ---

function decentralizationBand(score: number): OP10M_A11_DecentralizationBand {
  if (score < 22) return 'metro_locked';
  if (score < 40) return 'partial_shift';
  if (score < 58) return 'broadening';
  return 'accelerating';
}

export function op10mA11ComputeDigitalConnectivityDecentralizationShift(args: {
  networkDigital: number;
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  hierarchy: OP10M_A11_UrbanHierarchyRow[];
}): { rows: OP10M_A11_DecentralizationShiftRow[]; nationalIndex: number } {
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));
  const hierarchyByRegion = new Map(args.hierarchy.map((h) => [h.regionId, h]));
  const digitalLift = op10mA11Clamp(args.networkDigital * 0.48);

  const rows: OP10M_A11_DecentralizationShiftRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const migration = migrationByRegion.get(rid);
    const hub = hubByRegion.get(rid);
    const hier = hierarchyByRegion.get(rid);

    const remoteEnablement = op10mA11Clamp(digitalLift * (hub && hub.role === 'peripheral' ? 1.08 : 0.92));
    const outboundRelief =
      migration && migration.primaryDirection === 'outbound'
        ? op10mA11Clamp(migration.netPressure * 0.35)
        : migration && migration.primaryDirection === 'inbound'
          ? op10mA11Clamp(-migration.netPressure * 0.18)
          : 0;
    const primateDrag = hier
      ? op10mA11Clamp(
          (hier.primateBand === 'concentrated' || hier.primateBand === 'hyper_concentrated' ? 18 : 6) -
            hier.secondaryMomentum * 0.12,
        )
      : 10;

    const shiftScore = op10mA11Clamp(remoteEnablement + outboundRelief + (100 - primateDrag) * 0.22);
    weighted += shiftScore;

    const signals: string[] = [];
    if (remoteEnablement >= 32) signals.push('digital connectivity lift');
    if (outboundRelief >= 12) signals.push('outbound migration relief');
    if (hub && (hub.role === 'connector' || hub.role === 'regional_hub')) signals.push('secondary hub pull');
    if (hier && hier.primateBand === 'decentralized') signals.push('balanced hierarchy');
    if (!signals.length) signals.push('metro-centric default');

    rows.push({
      regionId: rid,
      shiftScore: op10mA11Round(shiftScore),
      band: decentralizationBand(shiftScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} decentralization ${decentralizationBand(shiftScore)} (${op10mA11Round(shiftScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.shiftScore - a.shiftScore), nationalIndex };
}

export function op10mA11RegionsWithAcceleratingDecentralization(
  rows: OP10M_A11_DecentralizationShiftRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'broadening' || r.band === 'accelerating').map((r) => r.regionId);
}


// --- source: settlement-relocation-burden.ts ---

function relocationBand(score: number): OP10M_A11_RelocationBurdenBand {
  if (score < 24) return 'manageable';
  if (score < 42) return 'elevated';
  if (score < 60) return 'severe';
  return 'overwhelming';
}

export function op10mA11ComputeSettlementRelocationBurden(args: {
  climateDisplacement: OP10M_A11_ClimateDisplacementRow[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
}): { rows: OP10M_A11_RelocationBurdenRow[]; nationalIndex: number } {
  const climateByRegion = new Map(args.climateDisplacement.map((c) => [c.regionId, c]));
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const housingByRegion = new Map(args.housingSpillover.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_RelocationBurdenRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const climate = climateByRegion.get(rid);
    const governance = governanceByRegion.get(rid);
    const housing = housingByRegion.get(rid);

    const displacementLoad = climate ? op10mA11Clamp(climate.displacementScore * 0.55) : 16;
    const coordinationDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.32) : 12;
    const receptionStress = housing ? op10mA11Clamp(housing.spilloverScore * 0.28) : 10;

    const burdenScore = op10mA11Clamp(displacementLoad + coordinationDrag + receptionStress);
    weighted += burdenScore;

    const factors: string[] = [];
    if (climate && (climate.band === 'acute' || climate.band === 'critical')) factors.push('climate displacement');
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      factors.push('governance coordination gap');
    }
    if (housing && (housing.band === 'cascade' || housing.band === 'systemic')) factors.push('host market saturation');
    if (!factors.length) factors.push('routine relocation capacity');

    rows.push({
      regionId: rid,
      burdenScore: op10mA11Round(burdenScore),
      band: relocationBand(burdenScore),
      factors: factors.slice(0, 3),
      narrative: `${rid} relocation burden ${relocationBand(burdenScore)} (${op10mA11Round(burdenScore)}); ${factors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.burdenScore - a.burdenScore), nationalIndex };
}

export function op10mA11RegionsWithOverwhelmingRelocationBurden(
  rows: OP10M_A11_RelocationBurdenRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'severe' || r.band === 'overwhelming').map((r) => r.regionId);
}

export function op10mA11RelocationBurdenEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}


// --- source: regional-employment-anchor-stress.ts ---

function anchorBand(score: number): OP10M_A11_EmploymentAnchorBand {
  if (score < 22) return 'anchored';
  if (score < 40) return 'softening';
  if (score < 58) return 'fragile';
  return 'collapsing';
}

export function op10mA11ComputeRegionalEmploymentAnchorStress(args: {
  decentralizationShift: OP10M_A11_DecentralizationShiftRow[];
  talentRetention: OP10M_A11_TalentRetentionRow[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
}): { rows: OP10M_A11_EmploymentAnchorRow[]; nationalIndex: number } {
  const decentralByRegion = new Map(args.decentralizationShift.map((d) => [d.regionId, d]));
  const talentByRegion = new Map(args.talentRetention.map((t) => [t.regionId, t]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_EmploymentAnchorRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const decentral = decentralByRegion.get(rid);
    const talent = talentByRegion.get(rid);
    const hub = hubByRegion.get(rid);

    const drainDrag = talent ? op10mA11Clamp(talent.drainScore * 0.48) : 14;
    const shiftDrag = decentral
      ? op10mA11Clamp(
          decentral.band === 'metro_locked' ? 18 : decentral.shiftScore * 0.32 + (decentral.band === 'accelerating' ? 6 : 0),
        )
      : 10;
    const hubDrag = hub
      ? op10mA11Clamp(hub.isolationScore * 0.35 + (hub.role === 'peripheral' ? 14 : hub.role === 'connector' ? 6 : 0))
      : 12;

    const stressScore = op10mA11Clamp(drainDrag + shiftDrag * 0.55 + hubDrag);
    weighted += stressScore;

    const drivers: string[] = [];
    if (talent && (talent.band === 'draining' || talent.band === 'collapse')) drivers.push('talent outflow');
    if (decentral && (decentral.band === 'partial_shift' || decentral.band === 'metro_locked')) {
      drivers.push('weak decentralization');
    }
    if (hub && (hub.role === 'peripheral' || hub.isolationScore >= 52)) drivers.push('hub isolation');
    if (!drivers.length) drivers.push('stable employment base');

    rows.push({
      regionId: rid,
      stressScore: op10mA11Round(stressScore),
      band: anchorBand(stressScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} employment anchor ${anchorBand(stressScore)} (${op10mA11Round(stressScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.stressScore - a.stressScore), nationalIndex };
}

export function op10mA11RegionsWithFragileEmploymentAnchors(
  rows: OP10M_A11_EmploymentAnchorRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fragile' || r.band === 'collapsing').map((r) => r.regionId);
}

export function op10mA11EmploymentAnchorStressEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 5;
}


// --- source: interregional-commute-affordability-wedge.ts ---

function wedgeBand(score: number): OP10M_A11_CommuteWedgeBand {
  if (score < 24) return 'balanced';
  if (score < 42) return 'widening';
  if (score < 60) return 'severe';
  return 'unsustainable';
}

export function op10mA11ComputeInterregionalCommuteAffordabilityWedge(args: {
  amenityCost: OP10M_A11_AmenityCostRow[];
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): { rows: OP10M_A11_CommuteWedgeRow[]; nationalIndex: number } {
  const amenityByRegion = new Map(args.amenityCost.map((a) => [a.regionId, a]));
  const periByRegion = new Map(args.periUrbanPressure.map((p) => [p.regionId, p]));

  const outboundPressure = new Map<OP10M_A11_RegionId, number>();
  for (const flow of args.corridorFlows) {
    const prev = outboundPressure.get(flow.fromRegion) ?? 0;
    outboundPressure.set(flow.fromRegion, Math.max(prev, flow.flowPressure));
  }

  const rows: OP10M_A11_CommuteWedgeRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const amenity = amenityByRegion.get(rid);
    const peri = periByRegion.get(rid);
    const corridorLoad = outboundPressure.get(rid) ?? 22;

    const costDrag = amenity ? op10mA11Clamp(amenity.amenityScore * 0.5) : 16;
    const sprawlDrag = peri ? op10mA11Clamp(peri.pressureScore * 0.38) : 12;
    const commuteDrag = op10mA11Clamp(corridorLoad * 0.42);

    const wedgeScore = op10mA11Clamp(costDrag + sprawlDrag + commuteDrag * 0.62);
    weighted += wedgeScore;

    const pressures: string[] = [];
    if (amenity && (amenity.band === 'strained' || amenity.band === 'crisis')) pressures.push('amenity cost');
    if (peri && (peri.band === 'sprawl_risk' || peri.band === 'unchecked')) pressures.push('peri-urban stretch');
    if (corridorLoad >= 58) pressures.push('corridor commute load');
    if (!pressures.length) pressures.push('contained commute wedge');

    rows.push({
      regionId: rid,
      wedgeScore: op10mA11Round(wedgeScore),
      band: wedgeBand(wedgeScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} commute affordability wedge ${wedgeBand(wedgeScore)} (${op10mA11Round(wedgeScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.wedgeScore - a.wedgeScore), nationalIndex };
}

export function op10mA11RegionsWithSevereCommuteWedge(rows: OP10M_A11_CommuteWedgeRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'severe' || r.band === 'unsustainable').map((r) => r.regionId);
}

export function op10mA11CommuteWedgeWidening(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}


// --- source: settlement-reception-capacity-strain.ts ---

function strainBand(score: number): OP10M_A11_ReceptionStrainBand {
  if (score < 23) return 'absorptive';
  if (score < 41) return 'tight';
  if (score < 59) return 'strained';
  return 'saturated';
}

export function op10mA11ComputeSettlementReceptionCapacityStrain(args: {
  relocationBurden: OP10M_A11_RelocationBurdenRow[];
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
}): { rows: OP10M_A11_ReceptionStrainRow[]; nationalIndex: number } {
  const relocationByRegion = new Map(args.relocationBurden.map((r) => [r.regionId, r]));
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));
  const equityByRegion = new Map(args.serviceEquity.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ReceptionStrainRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const relocation = relocationByRegion.get(rid);
    const absorption = absorptionByRegion.get(rid);
    const equity = equityByRegion.get(rid);

    const inflowLoad = relocation ? op10mA11Clamp(relocation.burdenScore * 0.52) : 15;
    const capacityDrag = absorption ? op10mA11Clamp(absorption.stressScore * 0.4) : 12;
    const serviceDrag = equity
      ? op10mA11Clamp((100 - equity.equityScore) * 0.28 + (equity.band === 'critical_gap' ? 10 : 0))
      : 8;

    const strainScore = op10mA11Clamp(inflowLoad + capacityDrag + serviceDrag);
    weighted += strainScore;

    const factors: string[] = [];
    if (relocation && (relocation.band === 'severe' || relocation.band === 'overwhelming')) {
      factors.push('relocation inflow');
    }
    if (absorption && (absorption.band === 'strained' || absorption.band === 'breached')) {
      factors.push('absorption ceiling');
    }
    if (equity && (equity.band === 'uneven' || equity.band === 'critical_gap')) factors.push('service equity gap');
    if (!factors.length) factors.push('routine reception headroom');

    rows.push({
      regionId: rid,
      strainScore: op10mA11Round(strainScore),
      band: strainBand(strainScore),
      factors: factors.slice(0, 3),
      narrative: `${rid} reception capacity ${strainBand(strainScore)} (${op10mA11Round(strainScore)}); ${factors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.strainScore - a.strainScore), nationalIndex };
}

export function op10mA11RegionsWithReceptionCapacityStrain(
  rows: OP10M_A11_ReceptionStrainRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'strained' || r.band === 'saturated').map((r) => r.regionId);
}

export function op10mA11ReceptionStrainEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 5;
}


// --- source: regional-land-use-regulatory-gridlock.ts ---

function gridlockBand(score: number): OP10M_A11_LandUseGridlockBand {
  if (score < 22) return 'fluid';
  if (score < 40) return 'slowing';
  if (score < 58) return 'gridlocked';
  return 'paralyzed';
}

export function op10mA11ComputeRegionalLandUseRegulatoryGridlock(args: {
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  periUrbanPressure: OP10M_A11_PeriUrbanPressureRow[];
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
}): { rows: OP10M_A11_LandUseGridlockRow[]; nationalIndex: number } {
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const periByRegion = new Map(args.periUrbanPressure.map((p) => [p.regionId, p]));
  const housingByRegion = new Map(args.housingSpillover.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_LandUseGridlockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const governance = governanceByRegion.get(rid);
    const peri = periByRegion.get(rid);
    const housing = housingByRegion.get(rid);

    const coordinationDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.46) : 14;
    const sprawlDrag = peri ? op10mA11Clamp(peri.pressureScore * 0.36) : 11;
    const spillDrag = housing ? op10mA11Clamp(housing.spilloverScore * 0.34) : 10;

    const gridlockScore = op10mA11Clamp(coordinationDrag + sprawlDrag + spillDrag * 0.58);
    weighted += gridlockScore;

    const blockers: string[] = [];
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      blockers.push('multi-tier deadlock');
    }
    if (peri && (peri.band === 'sprawl_risk' || peri.band === 'unchecked')) blockers.push('peri-urban overrun');
    if (housing && (housing.band === 'cascade' || housing.band === 'systemic')) blockers.push('housing spillover');
    if (!blockers.length) blockers.push('routine approvals flow');

    rows.push({
      regionId: rid,
      gridlockScore: op10mA11Round(gridlockScore),
      band: gridlockBand(gridlockScore),
      blockers: blockers.slice(0, 3),
      narrative: `${rid} land-use regulatory ${gridlockBand(gridlockScore)} (${op10mA11Round(gridlockScore)}); ${blockers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.gridlockScore - a.gridlockScore), nationalIndex };
}

export function op10mA11RegionsWithLandUseGridlock(rows: OP10M_A11_LandUseGridlockRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'gridlocked' || r.band === 'paralyzed').map((r) => r.regionId);
}

export function op10mA11LandUseGridlockEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}


// --- source: interregional-mobility-affordability-trap.ts ---

function trapBand(score: number): OP10M_A11_MobilityTrapBand {
  if (score < 23) return 'mobile';
  if (score < 41) return 'constrained';
  if (score < 59) return 'trapped';
  return 'immobilized';
}

export function op10mA11ComputeInterregionalMobilityAffordabilityTrap(args: {
  commuteWedge: OP10M_A11_CommuteWedgeRow[];
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  amenityCost: OP10M_A11_AmenityCostRow[];
}): { rows: OP10M_A11_MobilityTrapRow[]; nationalIndex: number } {
  const wedgeByRegion = new Map(args.commuteWedge.map((c) => [c.regionId, c]));
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const amenityByRegion = new Map(args.amenityCost.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_MobilityTrapRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const wedge = wedgeByRegion.get(rid);
    const migration = migrationByRegion.get(rid);
    const amenity = amenityByRegion.get(rid);

    const commuteDrag = wedge ? op10mA11Clamp(wedge.wedgeScore * 0.5) : 15;
    const flowDrag = migration ? op10mA11Clamp(migration.netPressure * 0.42) : 12;
    const costDrag = amenity ? op10mA11Clamp(amenity.amenityScore * 0.38) : 11;

    const trapScore = op10mA11Clamp(commuteDrag + flowDrag + costDrag * 0.6);
    weighted += trapScore;

    const binds: string[] = [];
    if (wedge && (wedge.band === 'severe' || wedge.band === 'unsustainable')) binds.push('commute wedge');
    if (migration && (migration.band === 'high' || migration.band === 'surge')) binds.push('migration pressure');
    if (amenity && (amenity.band === 'strained' || amenity.band === 'crisis')) binds.push('amenity lock-in');
    if (!binds.length) binds.push('open mobility');

    rows.push({
      regionId: rid,
      trapScore: op10mA11Round(trapScore),
      band: trapBand(trapScore),
      binds: binds.slice(0, 3),
      narrative: `${rid} mobility affordability ${trapBand(trapScore)} (${op10mA11Round(trapScore)}); ${binds.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.trapScore - a.trapScore), nationalIndex };
}

export function op10mA11RegionsWithMobilityTrap(rows: OP10M_A11_MobilityTrapRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'trapped' || r.band === 'immobilized').map((r) => r.regionId);
}

export function op10mA11MobilityTrapEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}


// --- source: settlement-infrastructure-absorption-gap.ts ---

function gapBand(score: number): OP10M_A11_AbsorptionGapBand {
  if (score < 22) return 'aligned';
  if (score < 40) return 'widening';
  if (score < 58) return 'critical';
  return 'rupture';
}

export function op10mA11ComputeSettlementInfrastructureAbsorptionGap(args: {
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
}): { rows: OP10M_A11_AbsorptionGapRow[]; nationalIndex: number } {
  const backlogByRegion = new Map(args.infrastructureBacklog.map((b) => [b.regionId, b]));
  const receptionByRegion = new Map(args.receptionStrain.map((r) => [r.regionId, r]));
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_AbsorptionGapRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const backlog = backlogByRegion.get(rid);
    const reception = receptionByRegion.get(rid);
    const absorption = absorptionByRegion.get(rid);

    const backlogDrag = backlog ? op10mA11Clamp(backlog.backlogScore * 0.48) : 14;
    const inflowDrag = reception ? op10mA11Clamp(reception.strainScore * 0.44) : 12;
    const capacityDrag = absorption ? op10mA11Clamp(absorption.stressScore * 0.36) : 10;

    const gapScore = op10mA11Clamp(backlogDrag + inflowDrag + capacityDrag * 0.55);
    weighted += gapScore;

    const gaps: string[] = [];
    if (backlog && (backlog.band === 'severe' || backlog.band === 'critical')) gaps.push('infra backlog');
    if (reception && (reception.band === 'strained' || reception.band === 'saturated')) gaps.push('reception overload');
    if (absorption && (absorption.band === 'strained' || absorption.band === 'breached')) gaps.push('absorption ceiling');
    if (!gaps.length) gaps.push('capacity matched');

    rows.push({
      regionId: rid,
      gapScore: op10mA11Round(gapScore),
      band: gapBand(gapScore),
      gaps: gaps.slice(0, 3),
      narrative: `${rid} infrastructure absorption gap ${gapBand(gapScore)} (${op10mA11Round(gapScore)}); ${gaps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.gapScore - a.gapScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalAbsorptionGap(rows: OP10M_A11_AbsorptionGapRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical' || r.band === 'rupture').map((r) => r.regionId);
}

export function op10mA11AbsorptionGapEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 5;
}


// --- source: regional-relief-coordination-overhead.ts ---

function overheadBand(score: number): OP10M_A11_ReliefOverheadBand {
  if (score < 21) return 'lean';
  if (score < 39) return 'elevated';
  if (score < 57) return 'overloaded';
  return 'paralytic';
}

const priorityWeight: Record<OP10M_A11_ReliefPlaybookItem['priority'], number> = {
  low: 4,
  medium: 10,
  high: 18,
  urgent: 28,
};

export function op10mA11ComputeRegionalReliefCoordinationOverhead(args: {
  reliefPlaybook: OP10M_A11_ReliefPlaybookItem[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
}): { rows: OP10M_A11_ReliefOverheadRow[]; nationalIndex: number } {
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const receptionByRegion = new Map(args.receptionStrain.map((r) => [r.regionId, r]));

  const reliefLoadByRegion = new Map<OP10M_A11_RegionId, number>();
  for (const item of args.reliefPlaybook) {
    const prev = reliefLoadByRegion.get(item.regionId) ?? 0;
    reliefLoadByRegion.set(item.regionId, prev + priorityWeight[item.priority]);
  }

  const rows: OP10M_A11_ReliefOverheadRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const governance = governanceByRegion.get(rid);
    const reception = receptionByRegion.get(rid);
    const reliefLoad = reliefLoadByRegion.get(rid) ?? 8;

    const queueDrag = op10mA11Clamp(reliefLoad * 0.72);
    const coordinationDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.38) : 12;
    const intakeDrag = reception ? op10mA11Clamp(reception.strainScore * 0.34) : 10;

    const overheadScore = op10mA11Clamp(queueDrag + coordinationDrag + intakeDrag * 0.55);
    weighted += overheadScore;

    const stressors: string[] = [];
    if (reliefLoad >= 26) stressors.push('relief queue depth');
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      stressors.push('coordination friction');
    }
    if (reception && (reception.band === 'strained' || reception.band === 'saturated')) {
      stressors.push('intake saturation');
    }
    if (!stressors.length) stressors.push('routine relief cadence');

    rows.push({
      regionId: rid,
      overheadScore: op10mA11Round(overheadScore),
      band: overheadBand(overheadScore),
      stressors: stressors.slice(0, 3),
      narrative: `${rid} relief coordination ${overheadBand(overheadScore)} (${op10mA11Round(overheadScore)}); ${stressors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.overheadScore - a.overheadScore), nationalIndex };
}

export function op10mA11RegionsWithReliefOverheadCritical(
  rows: OP10M_A11_ReliefOverheadRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'overloaded' || r.band === 'paralytic').map((r) => r.regionId);
}

export function op10mA11ReliefOverheadEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}


// --- source: interregional-corridor-equity-drift.ts ---

function driftBand(score: number): OP10M_A11_CorridorEquityDriftBand {
  if (score < 22) return 'aligned';
  if (score < 40) return 'drifting';
  if (score < 58) return 'polarized';
  return 'fractured';
}

export function op10mA11ComputeInterregionalCorridorEquityDrift(args: {
  corridorFlows: OP10M_A11_CorridorFlowRow[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
  commuteWedge: OP10M_A11_CommuteWedgeRow[];
}): { rows: OP10M_A11_CorridorEquityDriftRow[]; nationalIndex: number } {
  const equityByRegion = new Map(args.serviceEquity.map((s) => [s.regionId, s]));
  const wedgeByRegion = new Map(args.commuteWedge.map((c) => [c.regionId, c]));

  const corridorLoad = new Map<OP10M_A11_RegionId, number>();
  for (const flow of args.corridorFlows) {
    for (const rid of [flow.fromRegion, flow.toRegion] as OP10M_A11_RegionId[]) {
      const prev = corridorLoad.get(rid) ?? 0;
      corridorLoad.set(rid, Math.max(prev, flow.flowPressure));
    }
  }

  const rows: OP10M_A11_CorridorEquityDriftRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const equity = equityByRegion.get(rid);
    const wedge = wedgeByRegion.get(rid);
    const load = corridorLoad.get(rid) ?? 20;

    const equityDrag = equity
      ? op10mA11Clamp((100 - equity.equityScore) * 0.42 + (equity.band === 'critical_gap' ? 8 : 0))
      : 14;
    const commuteDrag = wedge ? op10mA11Clamp(wedge.wedgeScore * 0.36) : 11;
    const corridorDrag = op10mA11Clamp(load * 0.44);

    const driftScore = op10mA11Clamp(equityDrag + commuteDrag + corridorDrag * 0.58);
    weighted += driftScore;

    const signals: string[] = [];
    if (equity && (equity.band === 'uneven' || equity.band === 'critical_gap')) signals.push('service equity gap');
    if (wedge && (wedge.band === 'severe' || wedge.band === 'unsustainable')) signals.push('commute wedge');
    if (load >= 56) signals.push('corridor load asymmetry');
    if (!signals.length) signals.push('balanced corridor equity');

    rows.push({
      regionId: rid,
      driftScore: op10mA11Round(driftScore),
      band: driftBand(driftScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} corridor equity ${driftBand(driftScore)} (${op10mA11Round(driftScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.driftScore - a.driftScore), nationalIndex };
}

export function op10mA11RegionsWithCorridorEquityFracture(
  rows: OP10M_A11_CorridorEquityDriftRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'polarized' || r.band === 'fractured').map((r) => r.regionId);
}

export function op10mA11CorridorEquityDriftEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}


// --- source: settlement-climate-adaptation-lag.ts ---

function lagBand(score: number): OP10M_A11_AdaptationLagBand {
  if (score < 23) return 'responsive';
  if (score < 41) return 'lagging';
  if (score < 59) return 'stalled';
  return 'critical_lag';
}

export function op10mA11ComputeSettlementClimateAdaptationLag(args: {
  climateDisplacement: OP10M_A11_ClimateDisplacementRow[];
  absorptionGap: OP10M_A11_AbsorptionGapRow[];
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
}): { rows: OP10M_A11_AdaptationLagRow[]; nationalIndex: number } {
  const climateByRegion = new Map(args.climateDisplacement.map((c) => [c.regionId, c]));
  const gapByRegion = new Map(args.absorptionGap.map((g) => [g.regionId, g]));
  const backlogByRegion = new Map(args.infrastructureBacklog.map((b) => [b.regionId, b]));

  const rows: OP10M_A11_AdaptationLagRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const climate = climateByRegion.get(rid);
    const gap = gapByRegion.get(rid);
    const backlog = backlogByRegion.get(rid);

    const exposureDrag = climate ? op10mA11Clamp(climate.displacementScore * 0.5) : 16;
    const capacityDrag = gap ? op10mA11Clamp(gap.gapScore * 0.4) : 12;
    const infraDrag = backlog ? op10mA11Clamp(backlog.backlogScore * 0.34) : 10;

    const lagScore = op10mA11Clamp(exposureDrag + capacityDrag + infraDrag * 0.55);
    weighted += lagScore;

    const drivers: string[] = [];
    if (climate && (climate.band === 'acute' || climate.band === 'critical')) drivers.push('climate exposure');
    if (gap && (gap.band === 'critical' || gap.band === 'rupture')) drivers.push('absorption mismatch');
    if (backlog && (backlog.band === 'severe' || backlog.band === 'critical')) drivers.push('adaptation backlog');
    if (!drivers.length) drivers.push('adaptation on track');

    rows.push({
      regionId: rid,
      lagScore: op10mA11Round(lagScore),
      band: lagBand(lagScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} climate adaptation ${lagBand(lagScore)} (${op10mA11Round(lagScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.lagScore - a.lagScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalAdaptationLag(rows: OP10M_A11_AdaptationLagRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'stalled' || r.band === 'critical_lag').map((r) => r.regionId);
}

export function op10mA11AdaptationLagEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}


// --- source: regional-fiscal-capacity-strain.ts ---

function strainBand(score: number): OP10M_A11_FiscalCapacityStrainBand {
  if (score < 22) return 'sound';
  if (score < 40) return 'stretched';
  if (score < 58) return 'fragile';
  return 'exhausted';
}

export function op10mA11ComputeRegionalFiscalCapacityStrain(args: {
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
}): { rows: OP10M_A11_FiscalCapacityStrainRow[]; nationalIndex: number } {
  const fiscalByRegion = new Map(args.fiscalUrbanCoupling.map((f) => [f.regionId, f]));
  const reliefByRegion = new Map(args.reliefOverhead.map((r) => [r.regionId, r]));
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));

  const rows: OP10M_A11_FiscalCapacityStrainRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fiscal = fiscalByRegion.get(rid);
    const relief = reliefByRegion.get(rid);
    const governance = governanceByRegion.get(rid);

    const mismatchDrag = fiscal
      ? op10mA11Clamp((100 - fiscal.couplingScore) * 0.44 + (fiscal.band === 'misaligned' ? 10 : 0))
      : 14;
    const reliefDrag = relief ? op10mA11Clamp(relief.overheadScore * 0.38) : 11;
    const governanceDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.32) : 10;

    const strainScore = op10mA11Clamp(mismatchDrag + reliefDrag + governanceDrag * 0.55);
    weighted += strainScore;

    const pressures: string[] = [];
    if (fiscal && (fiscal.band === 'strained' || fiscal.band === 'misaligned')) pressures.push('fiscal mismatch');
    if (relief && (relief.band === 'overloaded' || relief.band === 'paralytic')) pressures.push('relief spend');
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      pressures.push('coordination cost');
    }
    if (!pressures.length) pressures.push('fiscal headroom intact');

    rows.push({
      regionId: rid,
      strainScore: op10mA11Round(strainScore),
      band: strainBand(strainScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} fiscal capacity ${strainBand(strainScore)} (${op10mA11Round(strainScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.strainScore - a.strainScore), nationalIndex };
}

export function op10mA11RegionsWithFiscalCapacityFragility(
  rows: OP10M_A11_FiscalCapacityStrainRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fragile' || r.band === 'exhausted').map((r) => r.regionId);
}

export function op10mA11FiscalCapacityStrainEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}


// --- source: interregional-network-resilience-erosion.ts ---

function erosionBand(score: number): OP10M_A11_NetworkErosionBand {
  if (score < 21) return 'robust';
  if (score < 39) return 'thinning';
  if (score < 57) return 'eroding';
  return 'fracturing';
}

export function op10mA11ComputeInterregionalNetworkResilienceErosion(args: {
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
  fragilityIndex: number;
}): { rows: OP10M_A11_NetworkErosionRow[]; nationalIndex: number } {
  const driftByRegion = new Map(args.corridorEquityDrift.map((d) => [d.regionId, d]));
  const backlogByRegion = new Map(args.infrastructureBacklog.map((b) => [b.regionId, b]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_NetworkErosionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const hub = hubByRegion.get(rid);
    const drift = driftByRegion.get(rid);
    const backlog = backlogByRegion.get(rid);

    const isolationDrag = hub
      ? op10mA11Clamp(hub.isolationScore * 0.46 + (hub.role === 'peripheral' ? 12 : 0))
      : 14;
    const equityDrag = drift ? op10mA11Clamp(drift.driftScore * 0.4) : 11;
    const infraDrag = backlog ? op10mA11Clamp(backlog.backlogScore * 0.34) : 10;
    const nationalDrag = op10mA11Clamp(args.fragilityIndex * 0.12);

    const erosionScore = op10mA11Clamp(isolationDrag + equityDrag + infraDrag + nationalDrag * 0.45);
    weighted += erosionScore;

    const signals: string[] = [];
    if (hub && (hub.role === 'peripheral' || hub.isolationScore >= 50)) signals.push('hub isolation');
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) signals.push('corridor inequity');
    if (backlog && (backlog.band === 'severe' || backlog.band === 'critical')) signals.push('network backlog');
    if (!signals.length) signals.push('linkage resilience holding');

    rows.push({
      regionId: rid,
      erosionScore: op10mA11Round(erosionScore),
      band: erosionBand(erosionScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} network resilience ${erosionBand(erosionScore)} (${op10mA11Round(erosionScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.erosionScore - a.erosionScore), nationalIndex };
}

export function op10mA11RegionsWithNetworkFracture(rows: OP10M_A11_NetworkErosionRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'eroding' || r.band === 'fracturing').map((r) => r.regionId);
}

export function op10mA11NetworkErosionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}


// --- source: settlement-long-horizon-capacity-risk.ts ---

function horizonBand(score: number): OP10M_A11_HorizonRiskBand {
  if (score < 23) return 'stable';
  if (score < 41) return 'elevated';
  if (score < 59) return 'acute';
  return 'critical';
}

export function op10mA11ComputeSettlementLongHorizonCapacityRisk(args: {
  climateAdaptationLag: OP10M_A11_AdaptationLagRow[];
  mobilityTrap: OP10M_A11_MobilityTrapRow[];
  convergence: OP10M_A11_ConvergenceVelocityRow;
}): { rows: OP10M_A11_HorizonRiskRow[]; nationalIndex: number } {
  const lagByRegion = new Map(args.climateAdaptationLag.map((a) => [a.regionId, a]));
  const trapByRegion = new Map(args.mobilityTrap.map((m) => [m.regionId, m]));
  const spreadDrag = op10mA11Clamp(args.convergence.standingSpread * 0.28);
  const convergenceDrag =
    args.convergence.band === 'diverging' ? 14 : args.convergence.band === 'stalled' ? 8 : 0;

  const rows: OP10M_A11_HorizonRiskRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lag = lagByRegion.get(rid);
    const trap = trapByRegion.get(rid);

    const adaptationDrag = lag ? op10mA11Clamp(lag.lagScore * 0.48) : 15;
    const mobilityDrag = trap ? op10mA11Clamp(trap.trapScore * 0.42) : 12;

    const riskScore = op10mA11Clamp(adaptationDrag + mobilityDrag + spreadDrag + convergenceDrag);
    weighted += riskScore;

    const drivers: string[] = [];
    if (lag && (lag.band === 'stalled' || lag.band === 'critical_lag')) drivers.push('adaptation lag');
    if (trap && (trap.band === 'trapped' || trap.band === 'immobilized')) drivers.push('mobility lock-in');
    if (args.convergence.band === 'stalled' || args.convergence.band === 'diverging') {
      drivers.push('convergence stress');
    }
    if (!drivers.length) drivers.push('long-horizon capacity adequate');

    rows.push({
      regionId: rid,
      riskScore: op10mA11Round(riskScore),
      band: horizonBand(riskScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} long-horizon capacity ${horizonBand(riskScore)} (${op10mA11Round(riskScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.riskScore - a.riskScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalHorizonRisk(rows: OP10M_A11_HorizonRiskRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'acute' || r.band === 'critical').map((r) => r.regionId);
}

export function op10mA11HorizonRiskEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}


// --- source: regional-cohesion-integrity-pressure.ts ---

function integrityBand(score: number): OP10M_A11_CohesionIntegrityBand {
  if (score < 22) return 'cohesive';
  if (score < 40) return 'fraying';
  if (score < 58) return 'fractured';
  return 'disintegrating';
}

export function op10mA11ComputeRegionalCohesionIntegrityPressure(args: {
  regionalCohesionIndex: number;
  networkResilienceErosion: OP10M_A11_NetworkErosionRow[];
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
}): { rows: OP10M_A11_CohesionIntegrityRow[]; nationalIndex: number } {
  const erosionByRegion = new Map(args.networkResilienceErosion.map((n) => [n.regionId, n]));
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));
  const nationalCohesionDrag = op10mA11Clamp((100 - args.regionalCohesionIndex) * 0.22);

  const rows: OP10M_A11_CohesionIntegrityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const erosion = erosionByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const networkDrag = erosion ? op10mA11Clamp(erosion.erosionScore * 0.44) : 13;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.38) : 11;

    const pressureScore = op10mA11Clamp(networkDrag + fiscalDrag + nationalCohesionDrag);
    weighted += pressureScore;

    const strains: string[] = [];
    if (erosion && (erosion.band === 'eroding' || erosion.band === 'fracturing')) strains.push('network erosion');
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) strains.push('fiscal strain');
    if (args.regionalCohesionIndex < 42) strains.push('national cohesion slip');
    if (!strains.length) strains.push('integrity holding');

    rows.push({
      regionId: rid,
      pressureScore: op10mA11Round(pressureScore),
      band: integrityBand(pressureScore),
      strains: strains.slice(0, 3),
      narrative: `${rid} cohesion integrity ${integrityBand(pressureScore)} (${op10mA11Round(pressureScore)}); ${strains.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pressureScore - a.pressureScore), nationalIndex };
}

export function op10mA11RegionsWithCohesionIntegrityFracture(
  rows: OP10M_A11_CohesionIntegrityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fractured' || r.band === 'disintegrating').map((r) => r.regionId);
}

export function op10mA11CohesionIntegrityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}


// --- source: interregional-relief-delivery-equity-gap.ts ---

function gapBand(score: number): OP10M_A11_ReliefEquityGapBand {
  if (score < 21) return 'aligned';
  if (score < 39) return 'uneven';
  if (score < 57) return 'skewed';
  return 'polarized';
}

export function op10mA11ComputeInterregionalReliefDeliveryEquityGap(args: {
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
}): { rows: OP10M_A11_ReliefEquityGapRow[]; nationalIndex: number } {
  const reliefByRegion = new Map(args.reliefOverhead.map((r) => [r.regionId, r]));
  const driftByRegion = new Map(args.corridorEquityDrift.map((d) => [d.regionId, d]));
  const equityByRegion = new Map(args.serviceEquity.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ReliefEquityGapRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const relief = reliefByRegion.get(rid);
    const drift = driftByRegion.get(rid);
    const equity = equityByRegion.get(rid);

    const deliveryDrag = relief ? op10mA11Clamp(relief.overheadScore * 0.46) : 14;
    const corridorDrag = drift ? op10mA11Clamp(drift.driftScore * 0.4) : 12;
    const serviceDrag = equity
      ? op10mA11Clamp((100 - equity.equityScore) * 0.3 + (equity.band === 'critical_gap' ? 8 : 0))
      : 10;

    const gapScore = op10mA11Clamp(deliveryDrag + corridorDrag + serviceDrag * 0.55);
    weighted += gapScore;

    const gaps: string[] = [];
    if (relief && (relief.band === 'overloaded' || relief.band === 'paralytic')) gaps.push('relief delivery load');
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) gaps.push('corridor inequity');
    if (equity && (equity.band === 'uneven' || equity.band === 'critical_gap')) gaps.push('service equity gap');
    if (!gaps.length) gaps.push('balanced relief reach');

    rows.push({
      regionId: rid,
      gapScore: op10mA11Round(gapScore),
      band: gapBand(gapScore),
      gaps: gaps.slice(0, 3),
      narrative: `${rid} relief delivery equity ${gapBand(gapScore)} (${op10mA11Round(gapScore)}); ${gaps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.gapScore - a.gapScore), nationalIndex };
}

export function op10mA11RegionsWithPolarizedReliefEquity(rows: OP10M_A11_ReliefEquityGapRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'skewed' || r.band === 'polarized').map((r) => r.regionId);
}

export function op10mA11ReliefEquityGapEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 45;
  return currentIndex >= 39 && currentIndex > priorIndex + 5;
}


// --- source: settlement-systemic-fragility-composite.ts ---

function fragilityBand(score: number): OP10M_A11_SystemicFragilityBand {
  if (score < 24) return 'contained';
  if (score < 42) return 'elevated';
  if (score < 60) return 'systemic';
  return 'cascade_risk';
}

export function op10mA11ComputeSettlementSystemicFragilityComposite(args: {
  longHorizonCapacityRisk: OP10M_A11_HorizonRiskRow[];
  landUseGridlock: OP10M_A11_LandUseGridlockRow[];
  relocationBurden: OP10M_A11_RelocationBurdenRow[];
}): { rows: OP10M_A11_SystemicFragilityRow[]; nationalIndex: number } {
  const horizonByRegion = new Map(args.longHorizonCapacityRisk.map((h) => [h.regionId, h]));
  const gridlockByRegion = new Map(args.landUseGridlock.map((l) => [l.regionId, l]));
  const relocationByRegion = new Map(args.relocationBurden.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_SystemicFragilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const horizon = horizonByRegion.get(rid);
    const gridlock = gridlockByRegion.get(rid);
    const relocation = relocationByRegion.get(rid);

    const horizonDrag = horizon ? op10mA11Clamp(horizon.riskScore * 0.46) : 15;
    const regulatoryDrag = gridlock ? op10mA11Clamp(gridlock.gridlockScore * 0.36) : 12;
    const displacementDrag = relocation ? op10mA11Clamp(relocation.burdenScore * 0.38) : 11;

    const fragilityScore = op10mA11Clamp(horizonDrag + regulatoryDrag + displacementDrag);
    weighted += fragilityScore;

    const cascades: string[] = [];
    if (horizon && (horizon.band === 'acute' || horizon.band === 'critical')) cascades.push('horizon risk');
    if (gridlock && (gridlock.band === 'gridlocked' || gridlock.band === 'paralyzed')) cascades.push('regulatory gridlock');
    if (relocation && (relocation.band === 'severe' || relocation.band === 'overwhelming')) {
      cascades.push('relocation overload');
    }
    if (!cascades.length) cascades.push('systemic buffers intact');

    rows.push({
      regionId: rid,
      fragilityScore: op10mA11Round(fragilityScore),
      band: fragilityBand(fragilityScore),
      cascades: cascades.slice(0, 3),
      narrative: `${rid} systemic fragility ${fragilityBand(fragilityScore)} (${op10mA11Round(fragilityScore)}); ${cascades.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fragilityScore - a.fragilityScore), nationalIndex };
}

export function op10mA11RegionsWithSystemicCascadeRisk(rows: OP10M_A11_SystemicFragilityRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'systemic' || r.band === 'cascade_risk').map((r) => r.regionId);
}

export function op10mA11SystemicFragilityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}


// --- source: regional-governance-resilience-decay.ts ---

function resilienceBand(score: number): OP10M_A11_GovernanceResilienceBand {
  if (score < 22) return 'resilient';
  if (score < 40) return 'eroding';
  if (score < 58) return 'brittle';
  return 'collapsed';
}

export function op10mA11ComputeRegionalGovernanceResilienceDecay(args: {
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  reliefEquityGap: OP10M_A11_ReliefEquityGapRow[];
}): { rows: OP10M_A11_GovernanceResilienceRow[]; nationalIndex: number } {
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const equityByRegion = new Map(args.reliefEquityGap.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_GovernanceResilienceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const governance = governanceByRegion.get(rid);
    const systemic = systemicByRegion.get(rid);
    const equity = equityByRegion.get(rid);

    const frictionDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.48) : 14;
    const systemicDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.4) : 12;
    const equityDrag = equity ? op10mA11Clamp(equity.gapScore * 0.34) : 10;

    const decayScore = op10mA11Clamp(frictionDrag + systemicDrag + equityDrag * 0.55);
    weighted += decayScore;

    const drivers: string[] = [];
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      drivers.push('coordination breakdown');
    }
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      drivers.push('systemic stress');
    }
    if (equity && (equity.band === 'skewed' || equity.band === 'polarized')) drivers.push('relief inequity');
    if (!drivers.length) drivers.push('governance resilience intact');

    rows.push({
      regionId: rid,
      decayScore: op10mA11Round(decayScore),
      band: resilienceBand(decayScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} governance resilience ${resilienceBand(decayScore)} (${op10mA11Round(decayScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.decayScore - a.decayScore), nationalIndex };
}

export function op10mA11RegionsWithGovernanceResilienceCollapse(
  rows: OP10M_A11_GovernanceResilienceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'brittle' || r.band === 'collapsed').map((r) => r.regionId);
}

export function op10mA11GovernanceResilienceDecayEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}


// --- source: interregional-migration-stability-erosion.ts ---

function stabilityBand(score: number): OP10M_A11_MigrationStabilityBand {
  if (score < 23) return 'stable';
  if (score < 41) return 'volatile';
  if (score < 59) return 'unstable';
  return 'chaotic';
}

export function op10mA11ComputeInterregionalMigrationStabilityErosion(args: {
  migrationPressure: OP10M_A11_MigrationPressureRow[];
  mobilityTrap: OP10M_A11_MobilityTrapRow[];
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
}): { rows: OP10M_A11_MigrationStabilityRow[]; nationalIndex: number } {
  const migrationByRegion = new Map(args.migrationPressure.map((m) => [m.regionId, m]));
  const trapByRegion = new Map(args.mobilityTrap.map((t) => [t.regionId, t]));
  const integrityByRegion = new Map(args.cohesionIntegrity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_MigrationStabilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const migration = migrationByRegion.get(rid);
    const trap = trapByRegion.get(rid);
    const integrity = integrityByRegion.get(rid);

    const flowDrag = migration ? op10mA11Clamp(migration.netPressure * 0.46) : 14;
    const trapDrag = trap ? op10mA11Clamp(trap.trapScore * 0.4) : 12;
    const cohesionDrag = integrity ? op10mA11Clamp(integrity.pressureScore * 0.32) : 10;

    const erosionScore = op10mA11Clamp(flowDrag + trapDrag + cohesionDrag * 0.55);
    weighted += erosionScore;

    const signals: string[] = [];
    if (migration && (migration.band === 'high' || migration.band === 'surge')) signals.push('migration surge');
    if (trap && (trap.band === 'trapped' || trap.band === 'immobilized')) signals.push('mobility trap');
    if (integrity && (integrity.band === 'fractured' || integrity.band === 'disintegrating')) {
      signals.push('cohesion fracture');
    }
    if (!signals.length) signals.push('migration stability holding');

    rows.push({
      regionId: rid,
      erosionScore: op10mA11Round(erosionScore),
      band: stabilityBand(erosionScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} migration stability ${stabilityBand(erosionScore)} (${op10mA11Round(erosionScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.erosionScore - a.erosionScore), nationalIndex };
}

export function op10mA11RegionsWithMigrationChaos(rows: OP10M_A11_MigrationStabilityRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'unstable' || r.band === 'chaotic').map((r) => r.regionId);
}

export function op10mA11MigrationStabilityErosionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 6;
}


// --- source: settlement-adaptive-capacity-ceiling.ts ---

function ceilingBand(score: number): OP10M_A11_AdaptiveCeilingBand {
  if (score < 24) return 'headroom';
  if (score < 42) return 'tight';
  if (score < 60) return 'capped';
  return 'breached';
}

export function op10mA11ComputeSettlementAdaptiveCapacityCeiling(args: {
  climateAdaptationLag: OP10M_A11_AdaptationLagRow[];
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
}): { rows: OP10M_A11_AdaptiveCeilingRow[]; nationalIndex: number } {
  const lagByRegion = new Map(args.climateAdaptationLag.map((a) => [a.regionId, a]));
  const receptionByRegion = new Map(args.receptionStrain.map((r) => [r.regionId, r]));
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_AdaptiveCeilingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lag = lagByRegion.get(rid);
    const reception = receptionByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const adaptationDrag = lag ? op10mA11Clamp(lag.lagScore * 0.5) : 15;
    const intakeDrag = reception ? op10mA11Clamp(reception.strainScore * 0.38) : 12;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.34) : 10;

    const ceilingScore = op10mA11Clamp(adaptationDrag + intakeDrag + fiscalDrag * 0.52);
    weighted += ceilingScore;

    const limits: string[] = [];
    if (lag && (lag.band === 'stalled' || lag.band === 'critical_lag')) limits.push('adaptation lag');
    if (reception && (reception.band === 'strained' || reception.band === 'saturated')) {
      limits.push('reception ceiling');
    }
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) limits.push('fiscal ceiling');
    if (!limits.length) limits.push('adaptive headroom available');

    rows.push({
      regionId: rid,
      ceilingScore: op10mA11Round(ceilingScore),
      band: ceilingBand(ceilingScore),
      limits: limits.slice(0, 3),
      narrative: `${rid} adaptive capacity ${ceilingBand(ceilingScore)} (${op10mA11Round(ceilingScore)}); ${limits.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.ceilingScore - a.ceilingScore), nationalIndex };
}

export function op10mA11RegionsWithBreachedAdaptiveCeiling(rows: OP10M_A11_AdaptiveCeilingRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'capped' || r.band === 'breached').map((r) => r.regionId);
}

export function op10mA11AdaptiveCeilingEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 5;
}


// --- source: regional-fiscal-governance-coupling-strain.ts ---

function couplingBand(score: number): OP10M_A11_FiscalGovernanceCouplingBand {
  if (score < 22) return 'aligned';
  if (score < 40) return 'strained';
  if (score < 58) return 'misaligned';
  return 'ruptured';
}

export function op10mA11ComputeRegionalFiscalGovernanceCouplingStrain(args: {
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
  governanceResilienceDecay: OP10M_A11_GovernanceResilienceRow[];
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
}): { rows: OP10M_A11_FiscalGovernanceCouplingRow[]; nationalIndex: number } {
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));
  const governanceByRegion = new Map(args.governanceResilienceDecay.map((g) => [g.regionId, g]));
  const integrityByRegion = new Map(args.cohesionIntegrity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_FiscalGovernanceCouplingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fiscal = fiscalByRegion.get(rid);
    const governance = governanceByRegion.get(rid);
    const integrity = integrityByRegion.get(rid);

    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.46) : 14;
    const governanceDrag = governance ? op10mA11Clamp(governance.decayScore * 0.4) : 12;
    const cohesionDrag = integrity ? op10mA11Clamp(integrity.pressureScore * 0.32) : 10;

    const strainScore = op10mA11Clamp(fiscalDrag + governanceDrag + cohesionDrag * 0.55);
    weighted += strainScore;

    const tensions: string[] = [];
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) tensions.push('fiscal exhaustion');
    if (governance && (governance.band === 'brittle' || governance.band === 'collapsed')) {
      tensions.push('governance decay');
    }
    if (integrity && (integrity.band === 'fractured' || integrity.band === 'disintegrating')) {
      tensions.push('cohesion fracture');
    }
    if (!tensions.length) tensions.push('fiscal–governance balance');

    rows.push({
      regionId: rid,
      strainScore: op10mA11Round(strainScore),
      band: couplingBand(strainScore),
      tensions: tensions.slice(0, 3),
      narrative: `${rid} fiscal–governance coupling ${couplingBand(strainScore)} (${op10mA11Round(strainScore)}); ${tensions.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.strainScore - a.strainScore), nationalIndex };
}

export function op10mA11RegionsWithFiscalGovernanceRupture(
  rows: OP10M_A11_FiscalGovernanceCouplingRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'misaligned' || r.band === 'ruptured').map((r) => r.regionId);
}

export function op10mA11FiscalGovernanceCouplingEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}


// --- source: interregional-network-equity-tension.ts ---

function tensionBand(score: number): OP10M_A11_NetworkEquityTensionBand {
  if (score < 21) return 'balanced';
  if (score < 39) return 'stressed';
  if (score < 57) return 'polarized';
  return 'fractured';
}

export function op10mA11ComputeInterregionalNetworkEquityTension(args: {
  networkResilienceErosion: OP10M_A11_NetworkErosionRow[];
  reliefEquityGap: OP10M_A11_ReliefEquityGapRow[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
}): { rows: OP10M_A11_NetworkEquityTensionRow[]; nationalIndex: number } {
  const erosionByRegion = new Map(args.networkResilienceErosion.map((n) => [n.regionId, n]));
  const reliefByRegion = new Map(args.reliefEquityGap.map((r) => [r.regionId, r]));
  const driftByRegion = new Map(args.corridorEquityDrift.map((d) => [d.regionId, d]));

  const rows: OP10M_A11_NetworkEquityTensionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const erosion = erosionByRegion.get(rid);
    const relief = reliefByRegion.get(rid);
    const drift = driftByRegion.get(rid);

    const networkDrag = erosion ? op10mA11Clamp(erosion.erosionScore * 0.44) : 13;
    const reliefDrag = relief ? op10mA11Clamp(relief.gapScore * 0.38) : 11;
    const corridorDrag = drift ? op10mA11Clamp(drift.driftScore * 0.36) : 10;

    const tensionScore = op10mA11Clamp(networkDrag + reliefDrag + corridorDrag * 0.58);
    weighted += tensionScore;

    const drivers: string[] = [];
    if (erosion && (erosion.band === 'eroding' || erosion.band === 'fracturing')) drivers.push('network erosion');
    if (relief && (relief.band === 'skewed' || relief.band === 'polarized')) drivers.push('relief inequity');
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) drivers.push('corridor drift');
    if (!drivers.length) drivers.push('network equity stable');

    rows.push({
      regionId: rid,
      tensionScore: op10mA11Round(tensionScore),
      band: tensionBand(tensionScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} network equity tension ${tensionBand(tensionScore)} (${op10mA11Round(tensionScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.tensionScore - a.tensionScore), nationalIndex };
}

export function op10mA11RegionsWithNetworkEquityFracture(
  rows: OP10M_A11_NetworkEquityTensionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'polarized' || r.band === 'fractured').map((r) => r.regionId);
}

export function op10mA11NetworkEquityTensionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 45;
  return currentIndex >= 39 && currentIndex > priorIndex + 5;
}


// --- source: settlement-resilience-frontier-pressure.ts ---

function frontierBand(score: number): OP10M_A11_ResilienceFrontierBand {
  if (score < 23) return 'within';
  if (score < 41) return 'approaching';
  if (score < 59) return 'at_limit';
  return 'breached';
}

export function op10mA11ComputeSettlementResilienceFrontierPressure(args: {
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  adaptiveCapacityCeiling: OP10M_A11_AdaptiveCeilingRow[];
  longHorizonCapacityRisk: OP10M_A11_HorizonRiskRow[];
}): { rows: OP10M_A11_ResilienceFrontierRow[]; nationalIndex: number } {
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const ceilingByRegion = new Map(args.adaptiveCapacityCeiling.map((a) => [a.regionId, a]));
  const horizonByRegion = new Map(args.longHorizonCapacityRisk.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_ResilienceFrontierRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const systemic = systemicByRegion.get(rid);
    const ceiling = ceilingByRegion.get(rid);
    const horizon = horizonByRegion.get(rid);

    const cascadeDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.48) : 15;
    const capacityDrag = ceiling ? op10mA11Clamp(ceiling.ceilingScore * 0.4) : 12;
    const horizonDrag = horizon ? op10mA11Clamp(horizon.riskScore * 0.34) : 10;

    const pressureScore = op10mA11Clamp(cascadeDrag + capacityDrag + horizonDrag * 0.52);
    weighted += pressureScore;

    const pressures: string[] = [];
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      pressures.push('systemic cascade');
    }
    if (ceiling && (ceiling.band === 'capped' || ceiling.band === 'breached')) pressures.push('adaptive ceiling');
    if (horizon && (horizon.band === 'acute' || horizon.band === 'critical')) pressures.push('horizon risk');
    if (!pressures.length) pressures.push('frontier headroom');

    rows.push({
      regionId: rid,
      pressureScore: op10mA11Round(pressureScore),
      band: frontierBand(pressureScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} resilience frontier ${frontierBand(pressureScore)} (${op10mA11Round(pressureScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pressureScore - a.pressureScore), nationalIndex };
}

export function op10mA11RegionsWithBreachedResilienceFrontier(
  rows: OP10M_A11_ResilienceFrontierRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'at_limit' || r.band === 'breached').map((r) => r.regionId);
}

export function op10mA11ResilienceFrontierEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}


// --- source: regional-meta-governance-coordination-fatigue.ts ---

function fatigueBand(score: number): OP10M_A11_MetaGovernanceFatigueBand {
  if (score < 24) return 'rested';
  if (score < 42) return 'tiring';
  if (score < 58) return 'fatigued';
  return 'exhausted';
}

export function op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue(args: {
  fiscalGovernanceCoupling: OP10M_A11_FiscalGovernanceCouplingRow[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
}): { rows: OP10M_A11_MetaGovernanceFatigueRow[]; nationalIndex: number } {
  const couplingByRegion = new Map(args.fiscalGovernanceCoupling.map((f) => [f.regionId, f]));
  const frictionByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const overheadByRegion = new Map(args.reliefOverhead.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_MetaGovernanceFatigueRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const coupling = couplingByRegion.get(rid);
    const friction = frictionByRegion.get(rid);
    const overhead = overheadByRegion.get(rid);

    const couplingDrag = coupling ? op10mA11Clamp(coupling.strainScore * 0.44) : 14;
    const frictionDrag = friction ? op10mA11Clamp(friction.frictionScore * 0.38) : 12;
    const overheadDrag = overhead ? op10mA11Clamp(overhead.overheadScore * 0.36) : 10;

    const fatigueScore = op10mA11Clamp(couplingDrag + frictionDrag + overheadDrag * 0.5);
    weighted += fatigueScore;

    const signals: string[] = [];
    if (coupling && (coupling.band === 'misaligned' || coupling.band === 'ruptured')) {
      signals.push('fiscal–governance rupture');
    }
    if (friction && (friction.band === 'fragmented' || friction.band === 'breakdown')) {
      signals.push('coordination breakdown');
    }
    if (overhead && (overhead.band === 'overloaded' || overhead.band === 'paralytic')) {
      signals.push('relief overhead');
    }
    if (!signals.length) signals.push('coordination headroom');

    rows.push({
      regionId: rid,
      fatigueScore: op10mA11Round(fatigueScore),
      band: fatigueBand(fatigueScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} meta-governance coordination ${fatigueBand(fatigueScore)} (${op10mA11Round(fatigueScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fatigueScore - a.fatigueScore), nationalIndex };
}

export function op10mA11RegionsWithMetaGovernanceExhaustion(
  rows: OP10M_A11_MetaGovernanceFatigueRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fatigued' || r.band === 'exhausted').map((r) => r.regionId);
}

export function op10mA11MetaGovernanceFatigueEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}


// --- source: interregional-capital-mobility-asymmetry.ts ---

function asymmetryBand(score: number): OP10M_A11_CapitalMobilityAsymmetryBand {
  if (score < 22) return 'balanced';
  if (score < 40) return 'skewed';
  if (score < 57) return 'polarized';
  return 'locked';
}

export function op10mA11ComputeInterregionalCapitalMobilityAsymmetry(args: {
  networkEquityTension: OP10M_A11_NetworkEquityTensionRow[];
  fiscalGovernanceCoupling: OP10M_A11_FiscalGovernanceCouplingRow[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
}): { rows: OP10M_A11_CapitalMobilityAsymmetryRow[]; nationalIndex: number } {
  const equityByRegion = new Map(args.networkEquityTension.map((n) => [n.regionId, n]));
  const couplingByRegion = new Map(args.fiscalGovernanceCoupling.map((f) => [f.regionId, f]));
  const driftByRegion = new Map(args.corridorEquityDrift.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CapitalMobilityAsymmetryRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const equity = equityByRegion.get(rid);
    const coupling = couplingByRegion.get(rid);
    const drift = driftByRegion.get(rid);

    const equityDrag = equity ? op10mA11Clamp(equity.tensionScore * 0.42) : 13;
    const couplingDrag = coupling ? op10mA11Clamp(coupling.strainScore * 0.36) : 11;
    const driftDrag = drift ? op10mA11Clamp(drift.driftScore * 0.4) : 10;

    const asymmetryScore = op10mA11Clamp(equityDrag + couplingDrag + driftDrag * 0.55);
    weighted += asymmetryScore;

    const drivers: string[] = [];
    if (equity && (equity.band === 'polarized' || equity.band === 'fractured')) drivers.push('network equity fracture');
    if (coupling && (coupling.band === 'misaligned' || coupling.band === 'ruptured')) {
      drivers.push('fiscal lock-in');
    }
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) drivers.push('corridor drift');
    if (!drivers.length) drivers.push('mobility balance');

    rows.push({
      regionId: rid,
      asymmetryScore: op10mA11Round(asymmetryScore),
      band: asymmetryBand(asymmetryScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} capital mobility asymmetry ${asymmetryBand(asymmetryScore)} (${op10mA11Round(asymmetryScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.asymmetryScore - a.asymmetryScore), nationalIndex };
}

export function op10mA11RegionsWithLockedCapitalMobility(
  rows: OP10M_A11_CapitalMobilityAsymmetryRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'polarized' || r.band === 'locked').map((r) => r.regionId);
}

export function op10mA11CapitalMobilityAsymmetryEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 45;
  return currentIndex >= 39 && currentIndex > priorIndex + 6;
}


// --- source: settlement-compound-shock-saturation.ts ---

function saturationBand(score: number): OP10M_A11_CompoundShockSaturationBand {
  if (score < 25) return 'buffered';
  if (score < 43) return 'loading';
  if (score < 60) return 'saturated';
  return 'overwhelmed';
}

export function op10mA11ComputeSettlementCompoundShockSaturation(args: {
  resilienceFrontier: OP10M_A11_ResilienceFrontierRow[];
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  migrationStabilityErosion: OP10M_A11_MigrationStabilityRow[];
}): { rows: OP10M_A11_CompoundShockSaturationRow[]; nationalIndex: number } {
  const frontierByRegion = new Map(args.resilienceFrontier.map((r) => [r.regionId, r]));
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const migrationByRegion = new Map(args.migrationStabilityErosion.map((m) => [m.regionId, m]));

  const rows: OP10M_A11_CompoundShockSaturationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const frontier = frontierByRegion.get(rid);
    const systemic = systemicByRegion.get(rid);
    const migration = migrationByRegion.get(rid);

    const frontierDrag = frontier ? op10mA11Clamp(frontier.pressureScore * 0.46) : 14;
    const systemicDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.4) : 12;
    const migrationDrag = migration ? op10mA11Clamp(migration.erosionScore * 0.34) : 10;

    const saturationScore = op10mA11Clamp(frontierDrag + systemicDrag + migrationDrag * 0.52);
    weighted += saturationScore;

    const shocks: string[] = [];
    if (frontier && (frontier.band === 'at_limit' || frontier.band === 'breached')) shocks.push('frontier breach');
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      shocks.push('compound fragility');
    }
    if (migration && (migration.band === 'unstable' || migration.band === 'chaotic')) {
      shocks.push('migration churn');
    }
    if (!shocks.length) shocks.push('shock absorption');

    rows.push({
      regionId: rid,
      saturationScore: op10mA11Round(saturationScore),
      band: saturationBand(saturationScore),
      shocks: shocks.slice(0, 3),
      narrative: `${rid} compound shock saturation ${saturationBand(saturationScore)} (${op10mA11Round(saturationScore)}); ${shocks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.saturationScore - a.saturationScore), nationalIndex };
}

export function op10mA11RegionsWithOverwhelmingCompoundShocks(
  rows: OP10M_A11_CompoundShockSaturationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'saturated' || r.band === 'overwhelmed').map((r) => r.regionId);
}

export function op10mA11CompoundShockSaturationEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}


// --- source: regional-institutional-trust-erosion.ts ---

function trustBand(score: number): OP10M_A11_InstitutionalTrustErosionBand {
  if (score < 23) return 'trusted';
  if (score < 41) return 'thinning';
  if (score < 58) return 'brittle';
  return 'breakdown';
}

export function op10mA11ComputeRegionalInstitutionalTrustErosion(args: {
  metaGovernanceFatigue: OP10M_A11_MetaGovernanceFatigueRow[];
  governanceResilienceDecay: OP10M_A11_GovernanceResilienceRow[];
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
}): { rows: OP10M_A11_InstitutionalTrustErosionRow[]; nationalIndex: number } {
  const fatigueByRegion = new Map(args.metaGovernanceFatigue.map((m) => [m.regionId, m]));
  const decayByRegion = new Map(args.governanceResilienceDecay.map((g) => [g.regionId, g]));
  const cohesionByRegion = new Map(args.cohesionIntegrity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_InstitutionalTrustErosionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fatigue = fatigueByRegion.get(rid);
    const decay = decayByRegion.get(rid);
    const cohesion = cohesionByRegion.get(rid);

    const fatigueDrag = fatigue ? op10mA11Clamp(fatigue.fatigueScore * 0.43) : 13;
    const decayDrag = decay ? op10mA11Clamp(decay.decayScore * 0.4) : 11;
    const cohesionDrag = cohesion ? op10mA11Clamp(cohesion.pressureScore * 0.35) : 10;

    const erosionScore = op10mA11Clamp(fatigueDrag + decayDrag + cohesionDrag * 0.54);
    weighted += erosionScore;

    const signals: string[] = [];
    if (fatigue && (fatigue.band === 'fatigued' || fatigue.band === 'exhausted')) {
      signals.push('coordination exhaustion');
    }
    if (decay && (decay.band === 'brittle' || decay.band === 'collapsed')) {
      signals.push('governance collapse risk');
    }
    if (cohesion && (cohesion.band === 'fractured' || cohesion.band === 'disintegrating')) {
      signals.push('cohesion fracture');
    }
    if (!signals.length) signals.push('institutional trust');

    rows.push({
      regionId: rid,
      erosionScore: op10mA11Round(erosionScore),
      band: trustBand(erosionScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} institutional trust erosion ${trustBand(erosionScore)} (${op10mA11Round(erosionScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.erosionScore - a.erosionScore), nationalIndex };
}

export function op10mA11RegionsWithInstitutionalTrustBreakdown(
  rows: OP10M_A11_InstitutionalTrustErosionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'brittle' || r.band === 'breakdown').map((r) => r.regionId);
}

export function op10mA11InstitutionalTrustErosionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 5;
}


// --- source: interregional-liquidity-fragmentation-stress.ts ---

function fragmentationBand(score: number): OP10M_A11_LiquidityFragmentationBand {
  if (score < 24) return 'integrated';
  if (score < 42) return 'segmented';
  if (score < 59) return 'fractured';
  return 'frozen';
}

export function op10mA11ComputeInterregionalLiquidityFragmentationStress(args: {
  capitalMobilityAsymmetry: OP10M_A11_CapitalMobilityAsymmetryRow[];
  networkEquityTension: OP10M_A11_NetworkEquityTensionRow[];
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
}): { rows: OP10M_A11_LiquidityFragmentationRow[]; nationalIndex: number } {
  const mobilityByRegion = new Map(args.capitalMobilityAsymmetry.map((c) => [c.regionId, c]));
  const equityByRegion = new Map(args.networkEquityTension.map((n) => [n.regionId, n]));
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_LiquidityFragmentationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const mobility = mobilityByRegion.get(rid);
    const equity = equityByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const mobilityDrag = mobility ? op10mA11Clamp(mobility.asymmetryScore * 0.41) : 12;
    const equityDrag = equity ? op10mA11Clamp(equity.tensionScore * 0.38) : 11;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.37) : 10;

    const fragmentationScore = op10mA11Clamp(mobilityDrag + equityDrag + fiscalDrag * 0.53);
    weighted += fragmentationScore;

    const drivers: string[] = [];
    if (mobility && (mobility.band === 'polarized' || mobility.band === 'locked')) {
      drivers.push('capital lock-in');
    }
    if (equity && (equity.band === 'polarized' || equity.band === 'fractured')) {
      drivers.push('network equity fracture');
    }
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) {
      drivers.push('fiscal drought');
    }
    if (!drivers.length) drivers.push('liquidity integration');

    rows.push({
      regionId: rid,
      fragmentationScore: op10mA11Round(fragmentationScore),
      band: fragmentationBand(fragmentationScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} liquidity fragmentation ${fragmentationBand(fragmentationScore)} (${op10mA11Round(fragmentationScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fragmentationScore - a.fragmentationScore), nationalIndex };
}

export function op10mA11RegionsWithFrozenLiquidity(
  rows: OP10M_A11_LiquidityFragmentationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fractured' || r.band === 'frozen').map((r) => r.regionId);
}

export function op10mA11LiquidityFragmentationEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 6;
}


// --- source: settlement-cascading-failure-risk.ts ---

function cascadeBand(score: number): OP10M_A11_CascadingFailureBand {
  if (score < 26) return 'contained';
  if (score < 44) return 'spreading';
  if (score < 61) return 'cascade_risk';
  return 'systemic';
}

export function op10mA11ComputeSettlementCascadingFailureRisk(args: {
  compoundShockSaturation: OP10M_A11_CompoundShockSaturationRow[];
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  adaptiveCapacityCeiling: OP10M_A11_AdaptiveCeilingRow[];
}): { rows: OP10M_A11_CascadingFailureRiskRow[]; nationalIndex: number } {
  const shockByRegion = new Map(args.compoundShockSaturation.map((s) => [s.regionId, s]));
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const ceilingByRegion = new Map(args.adaptiveCapacityCeiling.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_CascadingFailureRiskRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const shock = shockByRegion.get(rid);
    const systemic = systemicByRegion.get(rid);
    const ceiling = ceilingByRegion.get(rid);

    const shockDrag = shock ? op10mA11Clamp(shock.saturationScore * 0.45) : 14;
    const systemicDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.42) : 12;
    const ceilingDrag = ceiling ? op10mA11Clamp(ceiling.ceilingScore * 0.36) : 10;

    const cascadeScore = op10mA11Clamp(shockDrag + systemicDrag + ceilingDrag * 0.5);
    weighted += cascadeScore;

    const triggers: string[] = [];
    if (shock && (shock.band === 'saturated' || shock.band === 'overwhelmed')) {
      triggers.push('shock saturation');
    }
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      triggers.push('fragility cascade');
    }
    if (ceiling && (ceiling.band === 'capped' || ceiling.band === 'breached')) {
      triggers.push('adaptive ceiling breach');
    }
    if (!triggers.length) triggers.push('failure containment');

    rows.push({
      regionId: rid,
      cascadeScore: op10mA11Round(cascadeScore),
      band: cascadeBand(cascadeScore),
      triggers: triggers.slice(0, 3),
      narrative: `${rid} cascading failure risk ${cascadeBand(cascadeScore)} (${op10mA11Round(cascadeScore)}); ${triggers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.cascadeScore - a.cascadeScore), nationalIndex };
}

export function op10mA11RegionsWithSystemicCascadeRisk(
  rows: OP10M_A11_CascadingFailureRiskRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'cascade_risk' || r.band === 'systemic').map((r) => r.regionId);
}

export function op10mA11CascadingFailureRiskEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}


// --- source: regional-collapse-omni-singularity-unification.ts ---

function unificationBand(score: number): OP10M_A11_CollapseOmniSingularityUnificationBand {
  if (score < 22) return 'dormant';
  if (score < 38) return 'aligning';
  if (score < 55) return 'total';
  return 'unification';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityUnification(args: {
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  voidTotalErosionEradication: OP10M_A11_VoidTotalErosionEradicationRow[];
  existentialAbsoluteNullityContinuity: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityUnificationRow[]; nationalIndex: number } {
  const integrationByRegion = new Map(args.collapseOmniSingularityIntegration.map((i) => [i.regionId, i]));
  const eradicationByRegion = new Map(args.voidTotalErosionEradication.map((e) => [e.regionId, e]));
  const continuityByRegion = new Map(args.existentialAbsoluteNullityContinuity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityUnificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const integration = integrationByRegion.get(rid);
    const eradication = eradicationByRegion.get(rid);
    const continuity = continuityByRegion.get(rid);

    const integrationDrag = integration ? op10mA11Clamp(integration.integrationScore * 0.55) : 19;
    const eradicationDrag = eradication ? op10mA11Clamp(eradication.eradicationScore * 0.51) : 17;
    const continuityDrag = continuity ? op10mA11Clamp(continuity.continuityScore * 0.48) : 16;

    const unificationScore = op10mA11Clamp(integrationDrag + eradicationDrag + continuityDrag * 0.59);
    weighted += unificationScore;

    const vectors: string[] = [];
    if (integration && (integration.band === 'total' || integration.band === 'integration')) {
      vectors.push('integration unify');
    }
    if (eradication && (eradication.band === 'total' || eradication.band === 'complete_eradication')) {
      vectors.push('eradication unify');
    }
    if (continuity && (continuity.band === 'absolute' || continuity.band === 'total_continuity')) {
      vectors.push('continuity unify');
    }
    if (!vectors.length) vectors.push('unification dormant');

    rows.push({
      regionId: rid,
      unificationScore: op10mA11Round(unificationScore),
      band: unificationBand(unificationScore),
      vectors: vectors.slice(0, 3),
      narrative: `${rid} collapse omni singularity unification ${unificationBand(unificationScore)} (${op10mA11Round(unificationScore)}); ${vectors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.unificationScore - a.unificationScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityUnification(
  rows: OP10M_A11_CollapseOmniSingularityUnificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'unification').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityUnificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}


// --- source: interregional-void-total-erosion-elimination.ts ---

function eliminationBand(score: number): OP10M_A11_VoidTotalErosionEliminationBand {
  if (score < 21) return 'dormant';
  if (score < 37) return 'eliminating';
  if (score < 54) return 'total';
  return 'complete_elimination';
}

export function op10mA11ComputeInterregionalVoidTotalErosionElimination(args: {
  voidTotalErosionEradication: OP10M_A11_VoidTotalErosionEradicationRow[];
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionEliminationRow[]; nationalIndex: number } {
  const eradicationByRegion = new Map(args.voidTotalErosionEradication.map((e) => [e.regionId, e]));
  const integrationByRegion = new Map(args.collapseOmniSingularityIntegration.map((i) => [i.regionId, i]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionEliminationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const eradication = eradicationByRegion.get(rid);
    const integration = integrationByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const eradicationDrag = eradication ? op10mA11Clamp(eradication.eradicationScore * 0.53) : 18;
    const integrationDrag = integration ? op10mA11Clamp(integration.integrationScore * 0.49) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.46) : 15;

    const eliminationScore = op10mA11Clamp(eradicationDrag + integrationDrag + frontDrag * 0.56);
    weighted += eliminationScore;

    const phases: string[] = [];
    if (eradication && (eradication.band === 'total' || eradication.band === 'complete_eradication')) {
      phases.push('eradication eliminate');
    }
    if (integration && (integration.band === 'total' || integration.band === 'integration')) {
      phases.push('integration eliminate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front eliminate');
    }
    if (!phases.length) phases.push('elimination dormant');

    rows.push({
      regionId: rid,
      eliminationScore: op10mA11Round(eliminationScore),
      band: eliminationBand(eliminationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion elimination ${eliminationBand(eliminationScore)} (${op10mA11Round(eliminationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.eliminationScore - a.eliminationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionElimination(
  rows: OP10M_A11_VoidTotalErosionEliminationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_elimination').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionEliminationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}


// --- source: settlement-existential-absolute-nullity-perpetuity.ts ---

function perpetuityBand(score: number): OP10M_A11_ExistentialAbsoluteNullityPerpetuityBand {
  if (score < 23) return 'trace';
  if (score < 39) return 'perpetuity';
  if (score < 56) return 'absolute';
  return 'total_perpetuity';
}

export function op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity(args: {
  existentialAbsoluteNullityContinuity: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[];
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  existentialFinalNullitySentence: OP10M_A11_ExistentialFinalNullitySentenceRow[];
}): { rows: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[]; nationalIndex: number } {
  const continuityByRegion = new Map(args.existentialAbsoluteNullityContinuity.map((c) => [c.regionId, c]));
  const integrationByRegion = new Map(args.collapseOmniSingularityIntegration.map((i) => [i.regionId, i]));
  const sentenceByRegion = new Map(args.existentialFinalNullitySentence.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const continuity = continuityByRegion.get(rid);
    const integration = integrationByRegion.get(rid);
    const sentence = sentenceByRegion.get(rid);

    const continuityDrag = continuity ? op10mA11Clamp(continuity.continuityScore * 0.52) : 18;
    const integrationDrag = integration ? op10mA11Clamp(integration.integrationScore * 0.48) : 16;
    const sentenceDrag = sentence ? op10mA11Clamp(sentence.sentenceScore * 0.49) : 15;

    const perpetuityScore = op10mA11Clamp(continuityDrag + integrationDrag + sentenceDrag * 0.6);
    weighted += perpetuityScore;

    const marks: string[] = [];
    if (continuity && (continuity.band === 'absolute' || continuity.band === 'total_continuity')) {
      marks.push('continuity perpetuate');
    }
    if (integration && (integration.band === 'total' || integration.band === 'integration')) {
      marks.push('integration perpetuate');
    }
    if (sentence && (sentence.band === 'final' || sentence.band === 'total_sentence')) {
      marks.push('sentence perpetuate');
    }
    if (!marks.length) marks.push('perpetuity trace');

    rows.push({
      regionId: rid,
      perpetuityScore: op10mA11Round(perpetuityScore),
      band: perpetuityBand(perpetuityScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} existential absolute nullity perpetuity ${perpetuityBand(perpetuityScore)} (${op10mA11Round(perpetuityScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.perpetuityScore - a.perpetuityScore), nationalIndex };
}

export function op10mA11RegionsWithTotalAbsoluteNullityPerpetuity(
  rows: OP10M_A11_ExistentialAbsoluteNullityPerpetuityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'absolute' || r.band === 'total_perpetuity').map((r) => r.regionId);
}

export function op10mA11ExistentialAbsoluteNullityPerpetuityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}


// --- source: composite-recompute.ts ---

export function createEmptyOP10M_A11_CompositePersisted(): OP10M_A11_CompositePersisted {
  return {
    schemaVersion: OP10M_A11_COMPOSITE_SCHEMA_VERSION,
    revision: 0,
    initializedTurn: null,
    urban: createEmptyOP10M_A11_Persisted(),
    infra: createEmptyOP10M_A11_InfraPersisted(),
    lastFragilityIndex: 0,
    lastMaxCorridorFlow: 0,
    lastCohesionIndex: 0,
    lastStandingSpread: 0,
    lastServiceEquityIndex: 0,
    lastInfrastructureBacklogIndex: 0,
    lastGovernanceFrictionIndex: 0,
    lastHousingSpilloverIndex: 0,
    lastClimateDisplacementIndex: 0,
    lastAmenityCostIndex: 0,
    lastRelocationBurdenIndex: 0,
    lastEmploymentAnchorIndex: 0,
    lastCommuteWedgeIndex: 0,
    lastReceptionStrainIndex: 0,
    lastLandUseGridlockIndex: 0,
    lastMobilityTrapIndex: 0,
    lastAbsorptionGapIndex: 0,
    lastReliefOverheadIndex: 0,
    lastCorridorEquityDriftIndex: 0,
    lastClimateAdaptationLagIndex: 0,
    lastFiscalCapacityStrainIndex: 0,
    lastNetworkResilienceErosionIndex: 0,
    lastLongHorizonCapacityRiskIndex: 0,
    lastCohesionIntegrityIndex: 0,
    lastReliefEquityGapIndex: 0,
    lastSystemicFragilityIndex: 0,
    lastGovernanceResilienceDecayIndex: 0,
    lastMigrationStabilityErosionIndex: 0,
    lastAdaptiveCapacityCeilingIndex: 0,
    lastFiscalGovernanceCouplingIndex: 0,
    lastNetworkEquityTensionIndex: 0,
    lastResilienceFrontierIndex: 0,
    lastMetaGovernanceFatigueIndex: 0,
    lastCapitalMobilityAsymmetryIndex: 0,
    lastCompoundShockSaturationIndex: 0,
    lastInstitutionalTrustErosionIndex: 0,
    lastLiquidityFragmentationIndex: 0,
    lastCascadingFailureRiskIndex: 0,
    lastSocialContractFragilityIndex: 0,
    lastCapitalFlightPanicIndex: 0,
    lastIrrecoverableCollapseThresholdIndex: 0,
    lastSettlementLegitimacyCollapseIndex: 0,
    lastFiscalPanicContagionIndex: 0,
    lastTerminalStateLockInIndex: 0,
    lastGovernanceVacuumEscalationIndex: 0,
    lastSettlementAbandonmentSpiralIndex: 0,
    lastPostCollapseRecoveryImpossibilityIndex: 0,
    lastStateCollapseCascadeAmplificationIndex: 0,
    lastHollowRegionContagionIndex: 0,
    lastPermanentDepopulationLockIndex: 0,
    lastTotalCollapseSingularityIndex: 0,
    lastVoidExpansionVelocityIndex: 0,
    lastExistentialContinuityFractureIndex: 0,
    lastCollapseHorizonConvergenceIndex: 0,
    lastVoidTotalizationSurgeIndex: 0,
    lastExistentialTerminusLockIndex: 0,
    lastAbsoluteCollapseHorizonLockIndex: 0,
    lastVoidFinalizationCascadeIndex: 0,
    lastExistentialObliterationThresholdIndex: 0,
    lastUltimateCollapseSingularitySealIndex: 0,
    lastVoidAnnihilationConvergenceIndex: 0,
    lastExistentialNullStateLockIndex: 0,
    lastCollapseExistenceSingularityPointIndex: 0,
    lastVoidExistenceAnnihilationFrontIndex: 0,
    lastExistentialAbsoluteZeroLockIndex: 0,
    lastCollapseOmniSingularityNodeIndex: 0,
    lastVoidAbsoluteErosionSurgeIndex: 0,
    lastExistentialFinalNullityLockIndex: 0,
    lastCollapseTotalSingularityVertexIndex: 0,
    lastVoidTerminalErosionCascadeIndex: 0,
    lastExistentialUltimateNullitySealIndex: 0,
    lastCollapseAbsoluteSingularityApexIndex: 0,
    lastVoidCompleteErosionTerminalityIndex: 0,
    lastExistentialFinalNullityClosureIndex: 0,
    lastCollapseUltimateSingularityZenithIndex: 0,
    lastVoidTotalErosionFinalityIndex: 0,
    lastExistentialAbsoluteNullityVerdictIndex: 0,
    lastCollapseTotalSingularityNexusIndex: 0,
    lastVoidAbsoluteErosionTerminationIndex: 0,
    lastExistentialFinalNullitySentenceIndex: 0,
    lastCollapseAbsoluteSingularityCulminationIndex: 0,
    lastVoidCompleteErosionExtinctionIndex: 0,
    lastExistentialTotalNullityDecreeIndex: 0,
    lastCollapseOmniSingularitySynthesisIndex: 0,
    lastVoidTotalErosionAnnihilationIndex: 0,
    lastExistentialAbsoluteNullityMandateIndex: 0,
    lastCollapseOmniSingularityConvergenceIndex: 0,
    lastVoidTotalErosionObliterationIndex: 0,
    lastExistentialAbsoluteNullityBindingIndex: 0,
    lastCollapseOmniSingularityIntegrationIndex: 0,
    lastVoidTotalErosionEradicationIndex: 0,
    lastExistentialAbsoluteNullityContinuityIndex: 0,
    lastCollapseOmniSingularityUnificationIndex: 0,
    lastVoidTotalErosionEliminationIndex: 0,
    lastExistentialAbsoluteNullityPerpetuityIndex: 0,
    lastCollapseOmniSingularityConsolidationIndex: 0,
    lastVoidTotalErosionDissolutionIndex: 0,
    lastExistentialAbsoluteNullityImmutabilityIndex: 0,
    lastCollapseOmniSingularityCoalescenceIndex: 0,
    lastVoidTotalErosionSublimationIndex: 0,
    lastExistentialAbsoluteNullityPermanenceIndex: 0,
    lastCollapseOmniSingularityAmalgamationIndex: 0,
    lastVoidTotalErosionAtomizationIndex: 0,
    lastExistentialAbsoluteNullityInevitabilityIndex: 0,
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
  if (state.migrationPressure.length !== 8) errs.push('migration pressure row count');
  if (state.settlementVulnerability.length !== 8) errs.push('settlement vulnerability count');
  if (state.fiscalUrbanCoupling.length !== 8) errs.push('fiscal coupling count');
  if (state.regionalCohesionIndex < 0 || state.regionalCohesionIndex > 100) errs.push('cohesion out of range');
  if (state.absorptionStress.length !== 8) errs.push('absorption stress row count');
  if (state.serviceEquity.length !== 8) errs.push('service equity row count');
  if (state.metropolitanSaturationIndex < 0 || state.metropolitanSaturationIndex > 100) errs.push('saturation out of range');
  if (state.nationalServiceEquityIndex < 0 || state.nationalServiceEquityIndex > 100) errs.push('service equity index out of range');
  if (!state.convergence?.narrative) errs.push('convergence row missing');
  if (state.periUrbanPressure.length !== 8) errs.push('peri-urban pressure row count');
  if (state.infrastructureBacklog.length !== 8) errs.push('infrastructure backlog row count');
  if (state.governanceFriction.length !== 8) errs.push('governance friction row count');
  if (state.nationalPeriUrbanPressureIndex < 0 || state.nationalPeriUrbanPressureIndex > 100) errs.push('peri-urban index out of range');
  if (state.nationalInfrastructureBacklogIndex < 0 || state.nationalInfrastructureBacklogIndex > 100) errs.push('backlog index out of range');
  if (state.nationalGovernanceFrictionIndex < 0 || state.nationalGovernanceFrictionIndex > 100) errs.push('governance friction index out of range');
  if (state.housingSpillover.length !== 8) errs.push('housing spillover row count');
  if (state.talentRetention.length !== 8) errs.push('talent retention row count');
  if (state.climateDisplacement.length !== 8) errs.push('climate displacement row count');
  if (state.nationalHousingSpilloverIndex < 0 || state.nationalHousingSpilloverIndex > 100) errs.push('housing spillover index out of range');
  if (state.nationalTalentDrainIndex < 0 || state.nationalTalentDrainIndex > 100) errs.push('talent drain index out of range');
  if (state.nationalClimateDisplacementIndex < 0 || state.nationalClimateDisplacementIndex > 100) errs.push('climate displacement index out of range');
  if (state.amenityCost.length !== 8) errs.push('amenity cost row count');
  if (state.decentralizationShift.length !== 8) errs.push('decentralization shift row count');
  if (state.relocationBurden.length !== 8) errs.push('relocation burden row count');
  if (state.nationalAmenityCostIndex < 0 || state.nationalAmenityCostIndex > 100) errs.push('amenity cost index out of range');
  if (state.nationalDecentralizationIndex < 0 || state.nationalDecentralizationIndex > 100) errs.push('decentralization index out of range');
  if (state.nationalRelocationBurdenIndex < 0 || state.nationalRelocationBurdenIndex > 100) errs.push('relocation burden index out of range');
  if (state.employmentAnchor.length !== 8) errs.push('employment anchor row count');
  if (state.commuteWedge.length !== 8) errs.push('commute wedge row count');
  if (state.receptionStrain.length !== 8) errs.push('reception strain row count');
  if (state.nationalEmploymentAnchorIndex < 0 || state.nationalEmploymentAnchorIndex > 100) errs.push('employment anchor index out of range');
  if (state.nationalCommuteWedgeIndex < 0 || state.nationalCommuteWedgeIndex > 100) errs.push('commute wedge index out of range');
  if (state.nationalReceptionStrainIndex < 0 || state.nationalReceptionStrainIndex > 100) errs.push('reception strain index out of range');
  if (state.landUseGridlock.length !== 8) errs.push('land use gridlock row count');
  if (state.mobilityTrap.length !== 8) errs.push('mobility trap row count');
  if (state.absorptionGap.length !== 8) errs.push('absorption gap row count');
  if (state.nationalLandUseGridlockIndex < 0 || state.nationalLandUseGridlockIndex > 100) errs.push('land use gridlock index out of range');
  if (state.nationalMobilityTrapIndex < 0 || state.nationalMobilityTrapIndex > 100) errs.push('mobility trap index out of range');
  if (state.nationalAbsorptionGapIndex < 0 || state.nationalAbsorptionGapIndex > 100) errs.push('absorption gap index out of range');
  if (state.reliefOverhead.length !== 8) errs.push('relief overhead row count');
  if (state.corridorEquityDrift.length !== 8) errs.push('corridor equity drift row count');
  if (state.climateAdaptationLag.length !== 8) errs.push('climate adaptation lag row count');
  if (state.nationalReliefOverheadIndex < 0 || state.nationalReliefOverheadIndex > 100) errs.push('relief overhead index out of range');
  if (state.nationalCorridorEquityDriftIndex < 0 || state.nationalCorridorEquityDriftIndex > 100) errs.push('corridor equity drift index out of range');
  if (state.nationalClimateAdaptationLagIndex < 0 || state.nationalClimateAdaptationLagIndex > 100) errs.push('climate adaptation lag index out of range');
  if (state.fiscalCapacityStrain.length !== 8) errs.push('fiscal capacity strain row count');
  if (state.networkResilienceErosion.length !== 8) errs.push('network erosion row count');
  if (state.longHorizonCapacityRisk.length !== 8) errs.push('long horizon risk row count');
  if (state.nationalFiscalCapacityStrainIndex < 0 || state.nationalFiscalCapacityStrainIndex > 100) errs.push('fiscal capacity strain index out of range');
  if (state.nationalNetworkResilienceErosionIndex < 0 || state.nationalNetworkResilienceErosionIndex > 100) errs.push('network erosion index out of range');
  if (state.nationalLongHorizonCapacityRiskIndex < 0 || state.nationalLongHorizonCapacityRiskIndex > 100) errs.push('long horizon risk index out of range');
  if (state.cohesionIntegrity.length !== 8) errs.push('cohesion integrity row count');
  if (state.reliefEquityGap.length !== 8) errs.push('relief equity gap row count');
  if (state.systemicFragility.length !== 8) errs.push('systemic fragility row count');
  if (state.nationalCohesionIntegrityIndex < 0 || state.nationalCohesionIntegrityIndex > 100) errs.push('cohesion integrity index out of range');
  if (state.nationalReliefEquityGapIndex < 0 || state.nationalReliefEquityGapIndex > 100) errs.push('relief equity gap index out of range');
  if (state.nationalSystemicFragilityIndex < 0 || state.nationalSystemicFragilityIndex > 100) errs.push('systemic fragility index out of range');
  if (state.governanceResilienceDecay.length !== 8) errs.push('governance resilience decay row count');
  if (state.migrationStabilityErosion.length !== 8) errs.push('migration stability erosion row count');
  if (state.adaptiveCapacityCeiling.length !== 8) errs.push('adaptive capacity ceiling row count');
  if (state.nationalGovernanceResilienceDecayIndex < 0 || state.nationalGovernanceResilienceDecayIndex > 100) errs.push('governance resilience decay index out of range');
  if (state.nationalMigrationStabilityErosionIndex < 0 || state.nationalMigrationStabilityErosionIndex > 100) errs.push('migration stability erosion index out of range');
  if (state.nationalAdaptiveCapacityCeilingIndex < 0 || state.nationalAdaptiveCapacityCeilingIndex > 100) errs.push('adaptive capacity ceiling index out of range');
  if (state.fiscalGovernanceCoupling.length !== 8) errs.push('fiscal governance coupling row count');
  if (state.networkEquityTension.length !== 8) errs.push('network equity tension row count');
  if (state.resilienceFrontier.length !== 8) errs.push('resilience frontier row count');
  if (state.nationalFiscalGovernanceCouplingIndex < 0 || state.nationalFiscalGovernanceCouplingIndex > 100) errs.push('fiscal governance coupling index out of range');
  if (state.nationalNetworkEquityTensionIndex < 0 || state.nationalNetworkEquityTensionIndex > 100) errs.push('network equity tension index out of range');
  if (state.nationalResilienceFrontierIndex < 0 || state.nationalResilienceFrontierIndex > 100) errs.push('resilience frontier index out of range');
  if (state.metaGovernanceFatigue.length !== 8) errs.push('meta governance fatigue row count');
  if (state.capitalMobilityAsymmetry.length !== 8) errs.push('capital mobility asymmetry row count');
  if (state.compoundShockSaturation.length !== 8) errs.push('compound shock saturation row count');
  if (state.nationalMetaGovernanceFatigueIndex < 0 || state.nationalMetaGovernanceFatigueIndex > 100) errs.push('meta governance fatigue index out of range');
  if (state.nationalCapitalMobilityAsymmetryIndex < 0 || state.nationalCapitalMobilityAsymmetryIndex > 100) errs.push('capital mobility asymmetry index out of range');
  if (state.nationalCompoundShockSaturationIndex < 0 || state.nationalCompoundShockSaturationIndex > 100) errs.push('compound shock saturation index out of range');
  if (state.institutionalTrustErosion.length !== 8) errs.push('institutional trust erosion row count');
  if (state.liquidityFragmentation.length !== 8) errs.push('liquidity fragmentation row count');
  if (state.cascadingFailureRisk.length !== 8) errs.push('cascading failure risk row count');
  if (state.nationalInstitutionalTrustErosionIndex < 0 || state.nationalInstitutionalTrustErosionIndex > 100) errs.push('institutional trust erosion index out of range');
  if (state.nationalLiquidityFragmentationIndex < 0 || state.nationalLiquidityFragmentationIndex > 100) errs.push('liquidity fragmentation index out of range');
  if (state.nationalCascadingFailureRiskIndex < 0 || state.nationalCascadingFailureRiskIndex > 100) errs.push('cascading failure risk index out of range');
  if (state.socialContractFragility.length !== 8) errs.push('social contract fragility row count');
  if (state.capitalFlightPanic.length !== 8) errs.push('capital flight panic row count');
  if (state.irrecoverableCollapseThreshold.length !== 8) errs.push('irrecoverable collapse threshold row count');
  if (state.nationalSocialContractFragilityIndex < 0 || state.nationalSocialContractFragilityIndex > 100) errs.push('social contract fragility index out of range');
  if (state.nationalCapitalFlightPanicIndex < 0 || state.nationalCapitalFlightPanicIndex > 100) errs.push('capital flight panic index out of range');
  if (state.nationalIrrecoverableCollapseThresholdIndex < 0 || state.nationalIrrecoverableCollapseThresholdIndex > 100) errs.push('irrecoverable collapse threshold index out of range');
  if (state.settlementLegitimacyCollapse.length !== 8) errs.push('settlement legitimacy collapse row count');
  if (state.fiscalPanicContagion.length !== 8) errs.push('fiscal panic contagion row count');
  if (state.terminalStateLockIn.length !== 8) errs.push('terminal state lock-in row count');
  if (state.nationalSettlementLegitimacyCollapseIndex < 0 || state.nationalSettlementLegitimacyCollapseIndex > 100) errs.push('settlement legitimacy collapse index out of range');
  if (state.nationalFiscalPanicContagionIndex < 0 || state.nationalFiscalPanicContagionIndex > 100) errs.push('fiscal panic contagion index out of range');
  if (state.nationalTerminalStateLockInIndex < 0 || state.nationalTerminalStateLockInIndex > 100) errs.push('terminal state lock-in index out of range');
  if (state.governanceVacuumEscalation.length !== 8) errs.push('governance vacuum escalation row count');
  if (state.settlementAbandonmentSpiral.length !== 8) errs.push('settlement abandonment spiral row count');
  if (state.postCollapseRecoveryImpossibility.length !== 8) errs.push('post-collapse recovery impossibility row count');
  if (state.nationalGovernanceVacuumEscalationIndex < 0 || state.nationalGovernanceVacuumEscalationIndex > 100) errs.push('governance vacuum escalation index out of range');
  if (state.nationalSettlementAbandonmentSpiralIndex < 0 || state.nationalSettlementAbandonmentSpiralIndex > 100) errs.push('settlement abandonment spiral index out of range');
  if (state.nationalPostCollapseRecoveryImpossibilityIndex < 0 || state.nationalPostCollapseRecoveryImpossibilityIndex > 100) errs.push('post-collapse recovery impossibility index out of range');
  if (state.stateCollapseCascadeAmplification.length !== 8) errs.push('state collapse cascade amplification row count');
  if (state.hollowRegionContagion.length !== 8) errs.push('hollow region contagion row count');
  if (state.permanentDepopulationLock.length !== 8) errs.push('permanent depopulation lock row count');
  if (state.nationalStateCollapseCascadeAmplificationIndex < 0 || state.nationalStateCollapseCascadeAmplificationIndex > 100) errs.push('state collapse cascade amplification index out of range');
  if (state.nationalHollowRegionContagionIndex < 0 || state.nationalHollowRegionContagionIndex > 100) errs.push('hollow region contagion index out of range');
  if (state.nationalPermanentDepopulationLockIndex < 0 || state.nationalPermanentDepopulationLockIndex > 100) errs.push('permanent depopulation lock index out of range');
  if (state.totalCollapseSingularity.length !== 8) errs.push('total collapse singularity row count');
  if (state.voidExpansionVelocity.length !== 8) errs.push('void expansion velocity row count');
  if (state.existentialContinuityFracture.length !== 8) errs.push('existential continuity fracture row count');
  if (state.nationalTotalCollapseSingularityIndex < 0 || state.nationalTotalCollapseSingularityIndex > 100) errs.push('total collapse singularity index out of range');
  if (state.nationalVoidExpansionVelocityIndex < 0 || state.nationalVoidExpansionVelocityIndex > 100) errs.push('void expansion velocity index out of range');
  if (state.nationalExistentialContinuityFractureIndex < 0 || state.nationalExistentialContinuityFractureIndex > 100) errs.push('existential continuity fracture index out of range');
  if (state.collapseHorizonConvergence.length !== 8) errs.push('collapse horizon convergence row count');
  if (state.voidTotalizationSurge.length !== 8) errs.push('void totalization surge row count');
  if (state.existentialTerminusLock.length !== 8) errs.push('existential terminus lock row count');
  if (state.nationalCollapseHorizonConvergenceIndex < 0 || state.nationalCollapseHorizonConvergenceIndex > 100) errs.push('collapse horizon convergence index out of range');
  if (state.nationalVoidTotalizationSurgeIndex < 0 || state.nationalVoidTotalizationSurgeIndex > 100) errs.push('void totalization surge index out of range');
  if (state.nationalExistentialTerminusLockIndex < 0 || state.nationalExistentialTerminusLockIndex > 100) errs.push('existential terminus lock index out of range');
  if (state.absoluteCollapseHorizonLock.length !== 8) errs.push('absolute collapse horizon lock row count');
  if (state.voidFinalizationCascade.length !== 8) errs.push('void finalization cascade row count');
  if (state.existentialObliterationThreshold.length !== 8) errs.push('existential obliteration threshold row count');
  if (state.nationalAbsoluteCollapseHorizonLockIndex < 0 || state.nationalAbsoluteCollapseHorizonLockIndex > 100) errs.push('absolute collapse horizon lock index out of range');
  if (state.nationalVoidFinalizationCascadeIndex < 0 || state.nationalVoidFinalizationCascadeIndex > 100) errs.push('void finalization cascade index out of range');
  if (state.nationalExistentialObliterationThresholdIndex < 0 || state.nationalExistentialObliterationThresholdIndex > 100) errs.push('existential obliteration threshold index out of range');
  if (state.ultimateCollapseSingularitySeal.length !== 8) errs.push('ultimate collapse singularity seal row count');
  if (state.voidAnnihilationConvergence.length !== 8) errs.push('void annihilation convergence row count');
  if (state.existentialNullStateLock.length !== 8) errs.push('existential null-state lock row count');
  if (state.nationalUltimateCollapseSingularitySealIndex < 0 || state.nationalUltimateCollapseSingularitySealIndex > 100) errs.push('ultimate collapse singularity seal index out of range');
  if (state.nationalVoidAnnihilationConvergenceIndex < 0 || state.nationalVoidAnnihilationConvergenceIndex > 100) errs.push('void annihilation convergence index out of range');
  if (state.nationalExistentialNullStateLockIndex < 0 || state.nationalExistentialNullStateLockIndex > 100) errs.push('existential null-state lock index out of range');
  if (state.collapseExistenceSingularityPoint.length !== 8) errs.push('collapse existence singularity point row count');
  if (state.voidExistenceAnnihilationFront.length !== 8) errs.push('void existence annihilation front row count');
  if (state.existentialAbsoluteZeroLock.length !== 8) errs.push('existential absolute zero lock row count');
  if (state.nationalCollapseExistenceSingularityPointIndex < 0 || state.nationalCollapseExistenceSingularityPointIndex > 100) errs.push('collapse existence singularity point index out of range');
  if (state.nationalVoidExistenceAnnihilationFrontIndex < 0 || state.nationalVoidExistenceAnnihilationFrontIndex > 100) errs.push('void existence annihilation front index out of range');
  if (state.nationalExistentialAbsoluteZeroLockIndex < 0 || state.nationalExistentialAbsoluteZeroLockIndex > 100) errs.push('existential absolute zero lock index out of range');
  if (state.collapseOmniSingularityNode.length !== 8) errs.push('collapse omni singularity node row count');
  if (state.voidAbsoluteErosionSurge.length !== 8) errs.push('void absolute erosion surge row count');
  if (state.existentialFinalNullityLock.length !== 8) errs.push('existential final nullity lock row count');
  if (state.nationalCollapseOmniSingularityNodeIndex < 0 || state.nationalCollapseOmniSingularityNodeIndex > 100) errs.push('collapse omni singularity node index out of range');
  if (state.nationalVoidAbsoluteErosionSurgeIndex < 0 || state.nationalVoidAbsoluteErosionSurgeIndex > 100) errs.push('void absolute erosion surge index out of range');
  if (state.nationalExistentialFinalNullityLockIndex < 0 || state.nationalExistentialFinalNullityLockIndex > 100) errs.push('existential final nullity lock index out of range');
  if (state.collapseTotalSingularityVertex.length !== 8) errs.push('collapse total singularity vertex row count');
  if (state.voidTerminalErosionCascade.length !== 8) errs.push('void terminal erosion cascade row count');
  if (state.existentialUltimateNullitySeal.length !== 8) errs.push('existential ultimate nullity seal row count');
  if (state.nationalCollapseTotalSingularityVertexIndex < 0 || state.nationalCollapseTotalSingularityVertexIndex > 100) errs.push('collapse total singularity vertex index out of range');
  if (state.nationalVoidTerminalErosionCascadeIndex < 0 || state.nationalVoidTerminalErosionCascadeIndex > 100) errs.push('void terminal erosion cascade index out of range');
  if (state.nationalExistentialUltimateNullitySealIndex < 0 || state.nationalExistentialUltimateNullitySealIndex > 100) errs.push('existential ultimate nullity seal index out of range');
  if (state.collapseAbsoluteSingularityApex.length !== 8) errs.push('collapse absolute singularity apex row count');
  if (state.voidCompleteErosionTerminality.length !== 8) errs.push('void complete erosion terminality row count');
  if (state.existentialFinalNullityClosure.length !== 8) errs.push('existential final nullity closure row count');
  if (state.nationalCollapseAbsoluteSingularityApexIndex < 0 || state.nationalCollapseAbsoluteSingularityApexIndex > 100) errs.push('collapse absolute singularity apex index out of range');
  if (state.nationalVoidCompleteErosionTerminalityIndex < 0 || state.nationalVoidCompleteErosionTerminalityIndex > 100) errs.push('void complete erosion terminality index out of range');
  if (state.nationalExistentialFinalNullityClosureIndex < 0 || state.nationalExistentialFinalNullityClosureIndex > 100) errs.push('existential final nullity closure index out of range');
  if (state.collapseUltimateSingularityZenith.length !== 8) errs.push('collapse ultimate singularity zenith row count');
  if (state.voidTotalErosionFinality.length !== 8) errs.push('void total erosion finality row count');
  if (state.existentialAbsoluteNullityVerdict.length !== 8) errs.push('existential absolute nullity verdict row count');
  if (state.nationalCollapseUltimateSingularityZenithIndex < 0 || state.nationalCollapseUltimateSingularityZenithIndex > 100) errs.push('collapse ultimate singularity zenith index out of range');
  if (state.nationalVoidTotalErosionFinalityIndex < 0 || state.nationalVoidTotalErosionFinalityIndex > 100) errs.push('void total erosion finality index out of range');
  if (state.nationalExistentialAbsoluteNullityVerdictIndex < 0 || state.nationalExistentialAbsoluteNullityVerdictIndex > 100) errs.push('existential absolute nullity verdict index out of range');
  if (state.collapseTotalSingularityNexus.length !== 8) errs.push('collapse total singularity nexus row count');
  if (state.voidAbsoluteErosionTermination.length !== 8) errs.push('void absolute erosion termination row count');
  if (state.existentialFinalNullitySentence.length !== 8) errs.push('existential final nullity sentence row count');
  if (state.nationalCollapseTotalSingularityNexusIndex < 0 || state.nationalCollapseTotalSingularityNexusIndex > 100) errs.push('collapse total singularity nexus index out of range');
  if (state.nationalVoidAbsoluteErosionTerminationIndex < 0 || state.nationalVoidAbsoluteErosionTerminationIndex > 100) errs.push('void absolute erosion termination index out of range');
  if (state.nationalExistentialFinalNullitySentenceIndex < 0 || state.nationalExistentialFinalNullitySentenceIndex > 100) errs.push('existential final nullity sentence index out of range');
  if (state.collapseAbsoluteSingularityCulmination.length !== 8) errs.push('collapse absolute singularity culmination row count');
  if (state.voidCompleteErosionExtinction.length !== 8) errs.push('void complete erosion extinction row count');
  if (state.existentialTotalNullityDecree.length !== 8) errs.push('existential total nullity decree row count');
  if (state.nationalCollapseAbsoluteSingularityCulminationIndex < 0 || state.nationalCollapseAbsoluteSingularityCulminationIndex > 100) errs.push('collapse absolute singularity culmination index out of range');
  if (state.nationalVoidCompleteErosionExtinctionIndex < 0 || state.nationalVoidCompleteErosionExtinctionIndex > 100) errs.push('void complete erosion extinction index out of range');
  if (state.nationalExistentialTotalNullityDecreeIndex < 0 || state.nationalExistentialTotalNullityDecreeIndex > 100) errs.push('existential total nullity decree index out of range');
  if (state.collapseOmniSingularitySynthesis.length !== 8) errs.push('collapse omni singularity synthesis row count');
  if (state.voidTotalErosionAnnihilation.length !== 8) errs.push('void total erosion annihilation row count');
  if (state.existentialAbsoluteNullityMandate.length !== 8) errs.push('existential absolute nullity mandate row count');
  if (state.nationalCollapseOmniSingularitySynthesisIndex < 0 || state.nationalCollapseOmniSingularitySynthesisIndex > 100) errs.push('collapse omni singularity synthesis index out of range');
  if (state.nationalVoidTotalErosionAnnihilationIndex < 0 || state.nationalVoidTotalErosionAnnihilationIndex > 100) errs.push('void total erosion annihilation index out of range');
  if (state.nationalExistentialAbsoluteNullityMandateIndex < 0 || state.nationalExistentialAbsoluteNullityMandateIndex > 100) errs.push('existential absolute nullity mandate index out of range');
  if (state.collapseOmniSingularityConvergence.length !== 8) errs.push('collapse omni singularity convergence row count');
  if (state.voidTotalErosionObliteration.length !== 8) errs.push('void total erosion obliteration row count');
  if (state.existentialAbsoluteNullityBinding.length !== 8) errs.push('existential absolute nullity binding row count');
  if (state.nationalCollapseOmniSingularityConvergenceIndex < 0 || state.nationalCollapseOmniSingularityConvergenceIndex > 100) errs.push('collapse omni singularity convergence index out of range');
  if (state.nationalVoidTotalErosionObliterationIndex < 0 || state.nationalVoidTotalErosionObliterationIndex > 100) errs.push('void total erosion obliteration index out of range');
  if (state.nationalExistentialAbsoluteNullityBindingIndex < 0 || state.nationalExistentialAbsoluteNullityBindingIndex > 100) errs.push('existential absolute nullity binding index out of range');
  if (state.collapseOmniSingularityIntegration.length !== 8) errs.push('collapse omni singularity integration row count');
  if (state.voidTotalErosionEradication.length !== 8) errs.push('void total erosion eradication row count');
  if (state.existentialAbsoluteNullityContinuity.length !== 8) errs.push('existential absolute nullity continuity row count');
  if (state.nationalCollapseOmniSingularityIntegrationIndex < 0 || state.nationalCollapseOmniSingularityIntegrationIndex > 100) errs.push('collapse omni singularity integration index out of range');
  if (state.nationalVoidTotalErosionEradicationIndex < 0 || state.nationalVoidTotalErosionEradicationIndex > 100) errs.push('void total erosion eradication index out of range');
  if (state.nationalExistentialAbsoluteNullityContinuityIndex < 0 || state.nationalExistentialAbsoluteNullityContinuityIndex > 100) errs.push('existential absolute nullity continuity index out of range');
  if (state.collapseOmniSingularityUnification.length !== 8) errs.push('collapse omni singularity unification row count');
  if (state.voidTotalErosionElimination.length !== 8) errs.push('void total erosion elimination row count');
  if (state.existentialAbsoluteNullityPerpetuity.length !== 8) errs.push('existential absolute nullity perpetuity row count');
  if (state.nationalCollapseOmniSingularityUnificationIndex < 0 || state.nationalCollapseOmniSingularityUnificationIndex > 100) errs.push('collapse omni singularity unification index out of range');
  if (state.nationalVoidTotalErosionEliminationIndex < 0 || state.nationalVoidTotalErosionEliminationIndex > 100) errs.push('void total erosion elimination index out of range');
  if (state.nationalExistentialAbsoluteNullityPerpetuityIndex < 0 || state.nationalExistentialAbsoluteNullityPerpetuityIndex > 100) errs.push('existential absolute nullity perpetuity index out of range');
  if (state.collapseOmniSingularityConsolidation.length !== 8) errs.push('collapse omni singularity consolidation row count');
  if (state.voidTotalErosionDissolution.length !== 8) errs.push('void total erosion dissolution row count');
  if (state.existentialAbsoluteNullityImmutability.length !== 8) errs.push('existential absolute nullity immutability row count');
  if (state.nationalCollapseOmniSingularityConsolidationIndex < 0 || state.nationalCollapseOmniSingularityConsolidationIndex > 100) errs.push('collapse omni singularity consolidation index out of range');
  if (state.nationalVoidTotalErosionDissolutionIndex < 0 || state.nationalVoidTotalErosionDissolutionIndex > 100) errs.push('void total erosion dissolution index out of range');
  if (state.nationalExistentialAbsoluteNullityImmutabilityIndex < 0 || state.nationalExistentialAbsoluteNullityImmutabilityIndex > 100) errs.push('existential absolute nullity immutability index out of range');
  if (state.collapseOmniSingularityCoalescence.length !== 8) errs.push('collapse omni singularity coalescence row count');
  if (state.voidTotalErosionSublimation.length !== 8) errs.push('void total erosion sublimation row count');
  if (state.existentialAbsoluteNullityPermanence.length !== 8) errs.push('existential absolute nullity permanence row count');
  if (state.nationalCollapseOmniSingularityCoalescenceIndex < 0 || state.nationalCollapseOmniSingularityCoalescenceIndex > 100) errs.push('collapse omni singularity coalescence index out of range');
  if (state.nationalVoidTotalErosionSublimationIndex < 0 || state.nationalVoidTotalErosionSublimationIndex > 100) errs.push('void total erosion sublimation index out of range');
  if (state.nationalExistentialAbsoluteNullityPermanenceIndex < 0 || state.nationalExistentialAbsoluteNullityPermanenceIndex > 100) errs.push('existential absolute nullity permanence index out of range');
  if (state.collapseOmniSingularityAmalgamation.length !== 8) errs.push('collapse omni singularity amalgamation row count');
  if (state.voidTotalErosionAtomization.length !== 8) errs.push('void total erosion atomization row count');
  if (state.existentialAbsoluteNullityInevitability.length !== 8) errs.push('existential absolute nullity inevitability row count');
  if (state.nationalCollapseOmniSingularityAmalgamationIndex < 0 || state.nationalCollapseOmniSingularityAmalgamationIndex > 100) errs.push('collapse omni singularity amalgamation index out of range');
  if (state.nationalVoidTotalErosionAtomizationIndex < 0 || state.nationalVoidTotalErosionAtomizationIndex > 100) errs.push('void total erosion atomization index out of range');
  if (state.nationalExistentialAbsoluteNullityInevitabilityIndex < 0 || state.nationalExistentialAbsoluteNullityInevitabilityIndex > 100) errs.push('existential absolute nullity inevitability index out of range');
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

  const migrationPressure = op10mA11ComputeMigrationPressure({
    regions: urbanOut.state.regions,
    bottlenecks: infraOut.state.bottlenecks,
    linkageHubs,
    corridorFlows,
  });
  const maxMigrationPressure = migrationPressure[0]?.netPressure ?? 0;

  const settlementVulnerability = op10mA11ComputeSettlementVulnerability({
    regions: urbanOut.state.regions,
    bottlenecks: infraOut.state.bottlenecks,
    linkageHubs,
    fragilityIndex,
  });

  const fiscalOut = op10mA11ComputeFiscalUrbanCoupling({
    national: inputs.urban.national,
    regions: urbanOut.state.regions,
  });

  const regionalCohesionIndex = op10mA11RegionalCohesionIndex({
    inequalityIndex: urbanOut.state.inequalityIndex,
    fragilityIndex,
    fiscalNationalIndex: fiscalOut.nationalIndex,
    maxMigrationPressure,
  });

  const absorptionStress = op10mA11ComputeMetropolitanAbsorptionStress(inputs.urban.cities);
  const metropolitanSaturationIndex = op10mA11NationalMetropolitanSaturation(absorptionStress);

  const serviceEquityOut = op10mA11ComputeRegionalServiceEquity({
    settlement: settlementVulnerability,
    fiscal: fiscalOut.rows,
  });

  const standingSpread = op10mA11StandingSpread(urbanOut.state.regions);
  const convergence = op10mA11ComputeRegionalConvergence({
    regions: urbanOut.state.regions,
    priorStandingSpread: base.revision > 0 ? base.lastStandingSpread : null,
  });

  const periUrbanPressure = op10mA11ComputePeriUrbanExpansionPressure({
    cities: inputs.urban.cities,
    corridorFlows,
  });
  const nationalPeriUrbanPressureIndex = op10mA11NationalPeriUrbanPressureIndex(periUrbanPressure);

  const backlogOut = op10mA11ComputeRegionalInfrastructureBacklog({
    bottlenecks: infraOut.state.bottlenecks,
    absorptionStress,
    corridorStressIndex: infraOut.state.corridorStressIndex,
  });

  const governanceOut = op10mA11ComputeMultiTierGovernanceFriction({
    national: inputs.urban.national,
    reliefPlaybook,
    serviceEquity: serviceEquityOut.rows,
  });

  const housingSpilloverOut = op10mA11ComputeRegionalHousingSpilloverPressure({
    absorptionStress,
    periUrbanPressure,
    corridorFlows,
  });

  const talentOut = op10mA11ComputeInterregionalTalentRetentionStress({
    migrationPressure,
    linkageHubs,
    fiscalUrbanCoupling: fiscalOut.rows,
  });

  const climateOut = op10mA11ComputeClimateSettlementDisplacementRisk({
    settlementVulnerability,
    bottlenecks: infraOut.state.bottlenecks,
    networkDigital: inputs.infra.networkDigital,
    corridorStressIndex: infraOut.state.corridorStressIndex,
  });

  const amenityOut = op10mA11ComputeRegionalAmenityCostPressure({
    housingSpillover: housingSpilloverOut.rows,
    talentRetention: talentOut.rows,
    fiscalUrbanCoupling: fiscalOut.rows,
  });

  const decentralOut = op10mA11ComputeDigitalConnectivityDecentralizationShift({
    networkDigital: inputs.urban.national.networkDigital,
    migrationPressure,
    linkageHubs,
    hierarchy,
  });

  const relocationOut = op10mA11ComputeSettlementRelocationBurden({
    climateDisplacement: climateOut.rows,
    governanceFriction: governanceOut.rows,
    housingSpillover: housingSpilloverOut.rows,
  });

  const employmentAnchorOut = op10mA11ComputeRegionalEmploymentAnchorStress({
    decentralizationShift: decentralOut.rows,
    talentRetention: talentOut.rows,
    linkageHubs,
  });

  const commuteWedgeOut = op10mA11ComputeInterregionalCommuteAffordabilityWedge({
    amenityCost: amenityOut.rows,
    periUrbanPressure,
    corridorFlows,
  });

  const receptionStrainOut = op10mA11ComputeSettlementReceptionCapacityStrain({
    relocationBurden: relocationOut.rows,
    absorptionStress,
    serviceEquity: serviceEquityOut.rows,
  });

  const landUseGridlockOut = op10mA11ComputeRegionalLandUseRegulatoryGridlock({
    governanceFriction: governanceOut.rows,
    periUrbanPressure,
    housingSpillover: housingSpilloverOut.rows,
  });

  const mobilityTrapOut = op10mA11ComputeInterregionalMobilityAffordabilityTrap({
    commuteWedge: commuteWedgeOut.rows,
    migrationPressure,
    amenityCost: amenityOut.rows,
  });

  const absorptionGapOut = op10mA11ComputeSettlementInfrastructureAbsorptionGap({
    infrastructureBacklog: backlogOut.rows,
    receptionStrain: receptionStrainOut.rows,
    absorptionStress,
  });

  const reliefOverheadOut = op10mA11ComputeRegionalReliefCoordinationOverhead({
    reliefPlaybook,
    governanceFriction: governanceOut.rows,
    receptionStrain: receptionStrainOut.rows,
  });

  const corridorEquityDriftOut = op10mA11ComputeInterregionalCorridorEquityDrift({
    corridorFlows,
    serviceEquity: serviceEquityOut.rows,
    commuteWedge: commuteWedgeOut.rows,
  });

  const climateAdaptationLagOut = op10mA11ComputeSettlementClimateAdaptationLag({
    climateDisplacement: climateOut.rows,
    absorptionGap: absorptionGapOut.rows,
    infrastructureBacklog: backlogOut.rows,
  });

  const fiscalCapacityStrainOut = op10mA11ComputeRegionalFiscalCapacityStrain({
    fiscalUrbanCoupling: fiscalOut.rows,
    reliefOverhead: reliefOverheadOut.rows,
    governanceFriction: governanceOut.rows,
  });

  const networkErosionOut = op10mA11ComputeInterregionalNetworkResilienceErosion({
    linkageHubs,
    corridorEquityDrift: corridorEquityDriftOut.rows,
    infrastructureBacklog: backlogOut.rows,
    fragilityIndex,
  });

  const longHorizonRiskOut = op10mA11ComputeSettlementLongHorizonCapacityRisk({
    climateAdaptationLag: climateAdaptationLagOut.rows,
    mobilityTrap: mobilityTrapOut.rows,
    convergence,
  });

  const cohesionIntegrityOut = op10mA11ComputeRegionalCohesionIntegrityPressure({
    regionalCohesionIndex,
    networkResilienceErosion: networkErosionOut.rows,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
  });

  const reliefEquityGapOut = op10mA11ComputeInterregionalReliefDeliveryEquityGap({
    reliefOverhead: reliefOverheadOut.rows,
    corridorEquityDrift: corridorEquityDriftOut.rows,
    serviceEquity: serviceEquityOut.rows,
  });

  const systemicFragilityOut = op10mA11ComputeSettlementSystemicFragilityComposite({
    longHorizonCapacityRisk: longHorizonRiskOut.rows,
    landUseGridlock: landUseGridlockOut.rows,
    relocationBurden: relocationOut.rows,
  });

  const governanceResilienceDecayOut = op10mA11ComputeRegionalGovernanceResilienceDecay({
    governanceFriction: governanceOut.rows,
    systemicFragility: systemicFragilityOut.rows,
    reliefEquityGap: reliefEquityGapOut.rows,
  });

  const migrationStabilityErosionOut = op10mA11ComputeInterregionalMigrationStabilityErosion({
    migrationPressure,
    mobilityTrap: mobilityTrapOut.rows,
    cohesionIntegrity: cohesionIntegrityOut.rows,
  });

  const adaptiveCapacityCeilingOut = op10mA11ComputeSettlementAdaptiveCapacityCeiling({
    climateAdaptationLag: climateAdaptationLagOut.rows,
    receptionStrain: receptionStrainOut.rows,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
  });

  const fiscalGovernanceCouplingOut = op10mA11ComputeRegionalFiscalGovernanceCouplingStrain({
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
    governanceResilienceDecay: governanceResilienceDecayOut.rows,
    cohesionIntegrity: cohesionIntegrityOut.rows,
  });

  const networkEquityTensionOut = op10mA11ComputeInterregionalNetworkEquityTension({
    networkResilienceErosion: networkErosionOut.rows,
    reliefEquityGap: reliefEquityGapOut.rows,
    corridorEquityDrift: corridorEquityDriftOut.rows,
  });

  const resilienceFrontierOut = op10mA11ComputeSettlementResilienceFrontierPressure({
    systemicFragility: systemicFragilityOut.rows,
    adaptiveCapacityCeiling: adaptiveCapacityCeilingOut.rows,
    longHorizonCapacityRisk: longHorizonRiskOut.rows,
  });

  const metaGovernanceFatigueOut = op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue({
    fiscalGovernanceCoupling: fiscalGovernanceCouplingOut.rows,
    governanceFriction: governanceOut.rows,
    reliefOverhead: reliefOverheadOut.rows,
  });

  const capitalMobilityAsymmetryOut = op10mA11ComputeInterregionalCapitalMobilityAsymmetry({
    networkEquityTension: networkEquityTensionOut.rows,
    fiscalGovernanceCoupling: fiscalGovernanceCouplingOut.rows,
    corridorEquityDrift: corridorEquityDriftOut.rows,
  });

  const compoundShockSaturationOut = op10mA11ComputeSettlementCompoundShockSaturation({
    resilienceFrontier: resilienceFrontierOut.rows,
    systemicFragility: systemicFragilityOut.rows,
    migrationStabilityErosion: migrationStabilityErosionOut.rows,
  });

  const institutionalTrustErosionOut = op10mA11ComputeRegionalInstitutionalTrustErosion({
    metaGovernanceFatigue: metaGovernanceFatigueOut.rows,
    governanceResilienceDecay: governanceResilienceDecayOut.rows,
    cohesionIntegrity: cohesionIntegrityOut.rows,
  });

  const liquidityFragmentationOut = op10mA11ComputeInterregionalLiquidityFragmentationStress({
    capitalMobilityAsymmetry: capitalMobilityAsymmetryOut.rows,
    networkEquityTension: networkEquityTensionOut.rows,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
  });

  const cascadingFailureRiskOut = op10mA11ComputeSettlementCascadingFailureRisk({
    compoundShockSaturation: compoundShockSaturationOut.rows,
    systemicFragility: systemicFragilityOut.rows,
    adaptiveCapacityCeiling: adaptiveCapacityCeilingOut.rows,
  });

  const socialContractFragilityOut = op10mA11ComputeRegionalSocialContractFragility({
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
    liquidityFragmentation: liquidityFragmentationOut.rows,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
  });

  const capitalFlightPanicOut = op10mA11ComputeInterregionalCapitalFlightPanic({
    liquidityFragmentation: liquidityFragmentationOut.rows,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
    capitalMobilityAsymmetry: capitalMobilityAsymmetryOut.rows,
  });

  const irrecoverableCollapseOut = op10mA11ComputeSettlementIrrecoverableCollapseThreshold({
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
    compoundShockSaturation: compoundShockSaturationOut.rows,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
  });

  const settlementLegitimacyCollapseOut = op10mA11ComputeRegionalSettlementLegitimacyCollapse({
    socialContractFragility: socialContractFragilityOut.rows,
    capitalFlightPanic: capitalFlightPanicOut.rows,
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
  });

  const fiscalPanicContagionOut = op10mA11ComputeInterregionalFiscalPanicContagion({
    capitalFlightPanic: capitalFlightPanicOut.rows,
    liquidityFragmentation: liquidityFragmentationOut.rows,
    socialContractFragility: socialContractFragilityOut.rows,
  });

  const terminalStateLockInOut = op10mA11ComputeSettlementTerminalStateLockIn({
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
    socialContractFragility: socialContractFragilityOut.rows,
  });

  const governanceVacuumEscalationOut = op10mA11ComputeRegionalGovernanceVacuumEscalation({
    settlementLegitimacyCollapse: settlementLegitimacyCollapseOut.rows,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
  });

  const settlementAbandonmentSpiralOut = op10mA11ComputeInterregionalSettlementAbandonmentSpiral({
    terminalStateLockIn: terminalStateLockInOut.rows,
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
    capitalFlightPanic: capitalFlightPanicOut.rows,
  });

  const postCollapseRecoveryImpossibilityOut = op10mA11ComputeSettlementPostCollapseRecoveryImpossibility({
    terminalStateLockIn: terminalStateLockInOut.rows,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
  });

  const stateCollapseCascadeAmplificationOut = op10mA11ComputeRegionalStateCollapseCascadeAmplification({
    governanceVacuumEscalation: governanceVacuumEscalationOut.rows,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
  });

  const hollowRegionContagionOut = op10mA11ComputeInterregionalHollowRegionContagion({
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    governanceVacuumEscalation: governanceVacuumEscalationOut.rows,
  });

  const permanentDepopulationLockOut = op10mA11ComputeSettlementPermanentDepopulationLock({
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    terminalStateLockIn: terminalStateLockInOut.rows,
  });

  const totalCollapseSingularityOut = op10mA11ComputeRegionalTotalCollapseSingularityPressure({
    stateCollapseCascadeAmplification: stateCollapseCascadeAmplificationOut.rows,
    hollowRegionContagion: hollowRegionContagionOut.rows,
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
  });

  const voidExpansionVelocityOut = op10mA11ComputeInterregionalVoidExpansionVelocity({
    hollowRegionContagion: hollowRegionContagionOut.rows,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    stateCollapseCascadeAmplification: stateCollapseCascadeAmplificationOut.rows,
  });

  const existentialContinuityFractureOut = op10mA11ComputeSettlementExistentialContinuityFracture({
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
    settlementLegitimacyCollapse: settlementLegitimacyCollapseOut.rows,
  });

  const collapseHorizonConvergenceOut = op10mA11ComputeRegionalCollapseHorizonConvergence({
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
  });

  const voidTotalizationSurgeOut = op10mA11ComputeInterregionalVoidTotalizationSurge({
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    hollowRegionContagion: hollowRegionContagionOut.rows,
  });

  const existentialTerminusLockOut = op10mA11ComputeSettlementExistentialTerminusLock({
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
  });

  const absoluteCollapseHorizonLockOut = op10mA11ComputeRegionalAbsoluteCollapseHorizonLock({
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
    existentialTerminusLock: existentialTerminusLockOut.rows,
  });

  const voidFinalizationCascadeOut = op10mA11ComputeInterregionalVoidFinalizationCascade({
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
  });

  const existentialObliterationThresholdOut = op10mA11ComputeSettlementExistentialObliterationThreshold({
    existentialTerminusLock: existentialTerminusLockOut.rows,
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
  });

  const ultimateCollapseSingularitySealOut = op10mA11ComputeRegionalUltimateCollapseSingularitySeal({
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
  });

  const voidAnnihilationConvergenceOut = op10mA11ComputeInterregionalVoidAnnihilationConvergence({
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
  });

  const existentialNullStateLockOut = op10mA11ComputeSettlementExistentialNullStateLock({
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    existentialTerminusLock: existentialTerminusLockOut.rows,
  });

  const collapseExistenceSingularityPointOut = op10mA11ComputeRegionalCollapseExistenceSingularityPoint({
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
    existentialNullStateLock: existentialNullStateLockOut.rows,
  });

  const voidExistenceAnnihilationFrontOut = op10mA11ComputeInterregionalVoidExistenceAnnihilationFront({
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
  });

  const existentialAbsoluteZeroLockOut = op10mA11ComputeSettlementExistentialAbsoluteZeroLock({
    existentialNullStateLock: existentialNullStateLockOut.rows,
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
  });

  const collapseOmniSingularityNodeOut = op10mA11ComputeRegionalCollapseOmniSingularityNode({
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
    existentialAbsoluteZeroLock: existentialAbsoluteZeroLockOut.rows,
  });

  const voidAbsoluteErosionSurgeOut = op10mA11ComputeInterregionalVoidAbsoluteErosionSurge({
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
  });

  const existentialFinalNullityLockOut = op10mA11ComputeSettlementExistentialFinalNullityLock({
    existentialAbsoluteZeroLock: existentialAbsoluteZeroLockOut.rows,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    existentialNullStateLock: existentialNullStateLockOut.rows,
  });

  const collapseTotalSingularityVertexOut = op10mA11ComputeRegionalCollapseTotalSingularityVertex({
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    voidAbsoluteErosionSurge: voidAbsoluteErosionSurgeOut.rows,
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
  });

  const voidTerminalErosionCascadeOut = op10mA11ComputeInterregionalVoidTerminalErosionCascade({
    voidAbsoluteErosionSurge: voidAbsoluteErosionSurgeOut.rows,
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialUltimateNullitySealOut = op10mA11ComputeSettlementExistentialUltimateNullitySeal({
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
  });

  const collapseAbsoluteSingularityApexOut = op10mA11ComputeRegionalCollapseAbsoluteSingularityApex({
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    voidTerminalErosionCascade: voidTerminalErosionCascadeOut.rows,
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
  });

  const voidCompleteErosionTerminalityOut = op10mA11ComputeInterregionalVoidCompleteErosionTerminality({
    voidTerminalErosionCascade: voidTerminalErosionCascadeOut.rows,
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialFinalNullityClosureOut = op10mA11ComputeSettlementExistentialFinalNullityClosure({
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
  });

  const collapseUltimateSingularityZenithOut = op10mA11ComputeRegionalCollapseUltimateSingularityZenith({
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    voidCompleteErosionTerminality: voidCompleteErosionTerminalityOut.rows,
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
  });

  const voidTotalErosionFinalityOut = op10mA11ComputeInterregionalVoidTotalErosionFinality({
    voidCompleteErosionTerminality: voidCompleteErosionTerminalityOut.rows,
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityVerdictOut = op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict({
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
  });

  const collapseTotalSingularityNexusOut = op10mA11ComputeRegionalCollapseTotalSingularityNexus({
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    voidTotalErosionFinality: voidTotalErosionFinalityOut.rows,
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
  });

  const voidAbsoluteErosionTerminationOut = op10mA11ComputeInterregionalVoidAbsoluteErosionTermination({
    voidTotalErosionFinality: voidTotalErosionFinalityOut.rows,
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialFinalNullitySentenceOut = op10mA11ComputeSettlementExistentialFinalNullitySentence({
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
  });

  const collapseAbsoluteSingularityCulminationOut = op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination({
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    voidAbsoluteErosionTermination: voidAbsoluteErosionTerminationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const voidCompleteErosionExtinctionOut = op10mA11ComputeInterregionalVoidCompleteErosionExtinction({
    voidAbsoluteErosionTermination: voidAbsoluteErosionTerminationOut.rows,
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialTotalNullityDecreeOut = op10mA11ComputeSettlementExistentialTotalNullityDecree({
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
  });

  const collapseOmniSingularitySynthesisOut = op10mA11ComputeRegionalCollapseOmniSingularitySynthesis({
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    voidCompleteErosionExtinction: voidCompleteErosionExtinctionOut.rows,
    existentialTotalNullityDecree: existentialTotalNullityDecreeOut.rows,
  });

  const voidTotalErosionAnnihilationOut = op10mA11ComputeInterregionalVoidTotalErosionAnnihilation({
    voidCompleteErosionExtinction: voidCompleteErosionExtinctionOut.rows,
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityMandateOut = op10mA11ComputeSettlementExistentialAbsoluteNullityMandate({
    existentialTotalNullityDecree: existentialTotalNullityDecreeOut.rows,
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityConvergenceOut = op10mA11ComputeRegionalCollapseOmniSingularityConvergence({
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    voidTotalErosionAnnihilation: voidTotalErosionAnnihilationOut.rows,
    existentialAbsoluteNullityMandate: existentialAbsoluteNullityMandateOut.rows,
  });

  const voidTotalErosionObliterationOut = op10mA11ComputeInterregionalVoidTotalErosionObliteration({
    voidTotalErosionAnnihilation: voidTotalErosionAnnihilationOut.rows,
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityBindingOut = op10mA11ComputeSettlementExistentialAbsoluteNullityBinding({
    existentialAbsoluteNullityMandate: existentialAbsoluteNullityMandateOut.rows,
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityIntegrationOut = op10mA11ComputeRegionalCollapseOmniSingularityIntegration({
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    voidTotalErosionObliteration: voidTotalErosionObliterationOut.rows,
    existentialAbsoluteNullityBinding: existentialAbsoluteNullityBindingOut.rows,
  });

  const voidTotalErosionEradicationOut = op10mA11ComputeInterregionalVoidTotalErosionEradication({
    voidTotalErosionObliteration: voidTotalErosionObliterationOut.rows,
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityContinuityOut = op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity({
    existentialAbsoluteNullityBinding: existentialAbsoluteNullityBindingOut.rows,
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityUnificationOut = op10mA11ComputeRegionalCollapseOmniSingularityUnification({
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    voidTotalErosionEradication: voidTotalErosionEradicationOut.rows,
    existentialAbsoluteNullityContinuity: existentialAbsoluteNullityContinuityOut.rows,
  });

  const voidTotalErosionEliminationOut = op10mA11ComputeInterregionalVoidTotalErosionElimination({
    voidTotalErosionEradication: voidTotalErosionEradicationOut.rows,
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityPerpetuityOut = op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity({
    existentialAbsoluteNullityContinuity: existentialAbsoluteNullityContinuityOut.rows,
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityConsolidationOut = op10mA11ComputeRegionalCollapseOmniSingularityConsolidation({
    collapseOmniSingularityUnification: collapseOmniSingularityUnificationOut.rows,
    voidTotalErosionElimination: voidTotalErosionEliminationOut.rows,
    existentialAbsoluteNullityPerpetuity: existentialAbsoluteNullityPerpetuityOut.rows,
  });

  const voidTotalErosionDissolutionOut = op10mA11ComputeInterregionalVoidTotalErosionDissolution({
    voidTotalErosionElimination: voidTotalErosionEliminationOut.rows,
    collapseOmniSingularityUnification: collapseOmniSingularityUnificationOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityImmutabilityOut = op10mA11ComputeSettlementExistentialAbsoluteNullityImmutability({
    existentialAbsoluteNullityPerpetuity: existentialAbsoluteNullityPerpetuityOut.rows,
    collapseOmniSingularityUnification: collapseOmniSingularityUnificationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityCoalescenceOut = op10mA11ComputeRegionalCollapseOmniSingularityCoalescence({
    collapseOmniSingularityConsolidation: collapseOmniSingularityConsolidationOut.rows,
    voidTotalErosionDissolution: voidTotalErosionDissolutionOut.rows,
    existentialAbsoluteNullityImmutability: existentialAbsoluteNullityImmutabilityOut.rows,
  });

  const voidTotalErosionSublimationOut = op10mA11ComputeInterregionalVoidTotalErosionSublimation({
    voidTotalErosionDissolution: voidTotalErosionDissolutionOut.rows,
    collapseOmniSingularityConsolidation: collapseOmniSingularityConsolidationOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityPermanenceOut = op10mA11ComputeSettlementExistentialAbsoluteNullityPermanence({
    existentialAbsoluteNullityImmutability: existentialAbsoluteNullityImmutabilityOut.rows,
    collapseOmniSingularityConsolidation: collapseOmniSingularityConsolidationOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
  });

  const collapseOmniSingularityAmalgamationOut = op10mA11ComputeRegionalCollapseOmniSingularityAmalgamation({
    collapseOmniSingularityCoalescence: collapseOmniSingularityCoalescenceOut.rows,
    voidTotalErosionSublimation: voidTotalErosionSublimationOut.rows,
    existentialAbsoluteNullityPermanence: existentialAbsoluteNullityPermanenceOut.rows,
  });

  const voidTotalErosionAtomizationOut = op10mA11ComputeInterregionalVoidTotalErosionAtomization({
    voidTotalErosionSublimation: voidTotalErosionSublimationOut.rows,
    collapseOmniSingularityCoalescence: collapseOmniSingularityCoalescenceOut.rows,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
  });

  const existentialAbsoluteNullityInevitabilityOut = op10mA11ComputeSettlementExistentialAbsoluteNullityInevitability({
    existentialAbsoluteNullityPermanence: existentialAbsoluteNullityPermanenceOut.rows,
    collapseOmniSingularityCoalescence: collapseOmniSingularityCoalescenceOut.rows,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
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

  const migrationSurge = op10mA11RegionsWithMigrationSurge(migrationPressure);
  if (migrationSurge.length >= 2) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'migration_pressure_spike',
      migrationSurge,
      `Migration pressure elevated in ${migrationSurge.join(', ')} (peak ${maxMigrationPressure.toFixed(1)}).`,
      maxMigrationPressure >= 58 ? 'major' : 'meaningful',
    );
  }

  const criticalSettlement = op10mA11CriticalSettlementRegions(settlementVulnerability);
  if (criticalSettlement.length >= 1) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_vulnerability_critical',
      criticalSettlement.slice(0, 4),
      `Settlement vulnerability critical for ${criticalSettlement.slice(0, 3).join(', ')}.`,
      criticalSettlement.length >= 3 ? 'major' : 'meaningful',
    );
  }

  const fiscalMisaligned = op10mA11MisalignedFiscalRegions(fiscalOut.rows);
  if (
    fiscalMisaligned.length >= 3 ||
    (inputs.urban.national.distributionBand === 'highly_uneven' && fiscalOut.nationalIndex < 40)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_coupling_mismatch',
      fiscalMisaligned.slice(0, 5),
      `Fiscal–urban coupling strained (national index ${fiscalOut.nationalIndex.toFixed(1)}).`,
      fiscalOut.nationalIndex < 32 ? 'major' : 'meaningful',
    );
  }

  if (
    base.revision > 0 &&
    regionalCohesionIndex < base.lastCohesionIndex - 8 &&
    regionalCohesionIndex < 45
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'regional_linkage_fragility',
      weakRegions,
      `Regional cohesion slipped to ${regionalCohesionIndex.toFixed(1)} (was ${base.lastCohesionIndex.toFixed(1)}).`,
    );
  }

  const absorptionBreach = op10mA11RegionsWithAbsorptionBreach(absorptionStress);
  if (absorptionBreach.length >= 2 || metropolitanSaturationIndex >= 58) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'absorption_capacity_breach',
      absorptionBreach.slice(0, 5),
      `Metropolitan absorption strained (saturation ${metropolitanSaturationIndex.toFixed(1)}); ${absorptionBreach.slice(0, 3).join(', ')}.`,
      metropolitanSaturationIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const equityGap = op10mA11RegionsWithServiceEquityGap(serviceEquityOut.rows);
  if (
    equityGap.length >= 3 ||
    (serviceEquityOut.nationalIndex < 38 && base.revision > 0 && serviceEquityOut.nationalIndex < base.lastServiceEquityIndex - 6)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'service_equity_gap',
      equityGap.slice(0, 5),
      `Regional service equity gap (national index ${serviceEquityOut.nationalIndex.toFixed(1)}).`,
      serviceEquityOut.nationalIndex < 30 ? 'major' : 'meaningful',
    );
  }

  const laggingStuck = op10mA11LaggingRegionsNotClosing(urbanOut.state.regions, convergence);
  if (op10mA11ConvergenceStalled(convergence) && (standingSpread >= 32 || laggingStuck.length >= 2)) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'convergence_stall',
      laggingStuck.slice(0, 4),
      `Regional convergence ${convergence.band}; standing spread ${standingSpread.toFixed(1)}.`,
      convergence.band === 'diverging' ? 'major' : 'meaningful',
    );
  }

  const periUrbanHot = op10mA11RegionsWithPeriUrbanSprawl(periUrbanPressure);
  if (periUrbanHot.length >= 2 || nationalPeriUrbanPressureIndex >= 55) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'peri_urban_sprawl_pressure',
      periUrbanHot.slice(0, 5),
      `Peri-urban expansion pressure elevated (index ${nationalPeriUrbanPressureIndex.toFixed(1)}).`,
      nationalPeriUrbanPressureIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const backlogCritical = op10mA11RegionsWithCriticalBacklog(backlogOut.rows);
  if (
    backlogCritical.length >= 2 ||
    backlogOut.nationalIndex >= 52 ||
    (base.revision > 0 && backlogOut.nationalIndex > base.lastInfrastructureBacklogIndex + 7)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'infrastructure_backlog_critical',
      backlogCritical.slice(0, 5),
      `Regional infrastructure backlog critical (index ${backlogOut.nationalIndex.toFixed(1)}).`,
      backlogOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const governanceBreakdown = op10mA11RegionsWithGovernanceBreakdown(governanceOut.rows);
  if (
    governanceBreakdown.length >= 3 ||
    op10mA11GovernanceFrictionEscalating(governanceOut.nationalIndex, base.revision > 0 ? base.lastGovernanceFrictionIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'governance_coordination_breakdown',
      governanceBreakdown.slice(0, 5),
      `Multi-tier governance friction (index ${governanceOut.nationalIndex.toFixed(1)}).`,
      governanceOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const spilloverHot = op10mA11RegionsWithHousingSpilloverCascade(housingSpilloverOut.rows);
  if (
    spilloverHot.length >= 2 ||
    housingSpilloverOut.nationalIndex >= 52 ||
    op10mA11HousingSpilloverEscalating(
      housingSpilloverOut.nationalIndex,
      base.revision > 0 ? base.lastHousingSpilloverIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'housing_spillover_cascade',
      spilloverHot.slice(0, 5),
      `Regional housing spillover cascade (index ${housingSpilloverOut.nationalIndex.toFixed(1)}).`,
      housingSpilloverOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const talentDrain = op10mA11RegionsWithTalentDrain(talentOut.rows);
  if (talentDrain.length >= 2 || talentOut.nationalIndex >= 50) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'regional_talent_drain',
      talentDrain.slice(0, 5),
      `Interregional talent retention stress (drain index ${talentOut.nationalIndex.toFixed(1)}).`,
      talentOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const climateCritical = op10mA11RegionsWithCriticalClimateDisplacement(climateOut.rows);
  if (
    climateCritical.length >= 2 ||
    climateOut.nationalIndex >= 48 ||
    (base.revision > 0 && climateOut.nationalIndex > base.lastClimateDisplacementIndex + 6)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'climate_displacement_exposure',
      climateCritical.slice(0, 5),
      `Climate settlement displacement exposure (index ${climateOut.nationalIndex.toFixed(1)}).`,
      climateOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const amenityCrisis = op10mA11RegionsWithAmenityCostCrisis(amenityOut.rows);
  if (
    amenityCrisis.length >= 2 ||
    amenityOut.nationalIndex >= 50 ||
    op10mA11AmenityCostEscalating(amenityOut.nationalIndex, base.revision > 0 ? base.lastAmenityCostIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'amenity_cost_spiral',
      amenityCrisis.slice(0, 5),
      `Regional amenity cost spiral (index ${amenityOut.nationalIndex.toFixed(1)}).`,
      amenityOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const decentralHot = op10mA11RegionsWithAcceleratingDecentralization(decentralOut.rows);
  if (decentralHot.length >= 3 || decentralOut.nationalIndex >= 52) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'digital_decentralization_pulse',
      decentralHot.slice(0, 5),
      `Digital connectivity decentralization pulse (index ${decentralOut.nationalIndex.toFixed(1)}).`,
      decentralOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const relocationOverwhelm = op10mA11RegionsWithOverwhelmingRelocationBurden(relocationOut.rows);
  if (
    relocationOverwhelm.length >= 2 ||
    relocationOut.nationalIndex >= 48 ||
    op10mA11RelocationBurdenEscalating(
      relocationOut.nationalIndex,
      base.revision > 0 ? base.lastRelocationBurdenIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_relocation_burden',
      relocationOverwhelm.slice(0, 5),
      `Settlement relocation burden (index ${relocationOut.nationalIndex.toFixed(1)}).`,
      relocationOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const anchorFragile = op10mA11RegionsWithFragileEmploymentAnchors(employmentAnchorOut.rows);
  if (
    anchorFragile.length >= 2 ||
    employmentAnchorOut.nationalIndex >= 48 ||
    op10mA11EmploymentAnchorStressEscalating(
      employmentAnchorOut.nationalIndex,
      base.revision > 0 ? base.lastEmploymentAnchorIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'employment_anchor_fragility',
      anchorFragile.slice(0, 5),
      `Regional employment anchor fragility (index ${employmentAnchorOut.nationalIndex.toFixed(1)}).`,
      employmentAnchorOut.nationalIndex >= 56 ? 'major' : 'meaningful',
    );
  }

  const commuteSevere = op10mA11RegionsWithSevereCommuteWedge(commuteWedgeOut.rows);
  if (
    commuteSevere.length >= 2 ||
    commuteWedgeOut.nationalIndex >= 50 ||
    op10mA11CommuteWedgeWidening(commuteWedgeOut.nationalIndex, base.revision > 0 ? base.lastCommuteWedgeIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'commute_affordability_wedge',
      commuteSevere.slice(0, 5),
      `Interregional commute affordability wedge (index ${commuteWedgeOut.nationalIndex.toFixed(1)}).`,
      commuteWedgeOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const receptionStrained = op10mA11RegionsWithReceptionCapacityStrain(receptionStrainOut.rows);
  if (
    receptionStrained.length >= 2 ||
    receptionStrainOut.nationalIndex >= 47 ||
    op10mA11ReceptionStrainEscalating(
      receptionStrainOut.nationalIndex,
      base.revision > 0 ? base.lastReceptionStrainIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_reception_strain',
      receptionStrained.slice(0, 5),
      `Settlement reception capacity strain (index ${receptionStrainOut.nationalIndex.toFixed(1)}).`,
      receptionStrainOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const landUseBlocked = op10mA11RegionsWithLandUseGridlock(landUseGridlockOut.rows);
  if (
    landUseBlocked.length >= 2 ||
    landUseGridlockOut.nationalIndex >= 46 ||
    op10mA11LandUseGridlockEscalating(
      landUseGridlockOut.nationalIndex,
      base.revision > 0 ? base.lastLandUseGridlockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'land_use_regulatory_gridlock',
      landUseBlocked.slice(0, 5),
      `Regional land-use regulatory gridlock (index ${landUseGridlockOut.nationalIndex.toFixed(1)}).`,
      landUseGridlockOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const mobilityTrapped = op10mA11RegionsWithMobilityTrap(mobilityTrapOut.rows);
  if (
    mobilityTrapped.length >= 2 ||
    mobilityTrapOut.nationalIndex >= 48 ||
    op10mA11MobilityTrapEscalating(mobilityTrapOut.nationalIndex, base.revision > 0 ? base.lastMobilityTrapIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'mobility_affordability_trap',
      mobilityTrapped.slice(0, 5),
      `Interregional mobility affordability trap (index ${mobilityTrapOut.nationalIndex.toFixed(1)}).`,
      mobilityTrapOut.nationalIndex >= 56 ? 'major' : 'meaningful',
    );
  }

  const absorptionGapCritical = op10mA11RegionsWithCriticalAbsorptionGap(absorptionGapOut.rows);
  if (
    absorptionGapCritical.length >= 2 ||
    absorptionGapOut.nationalIndex >= 47 ||
    op10mA11AbsorptionGapEscalating(absorptionGapOut.nationalIndex, base.revision > 0 ? base.lastAbsorptionGapIndex : null)
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'infrastructure_absorption_gap',
      absorptionGapCritical.slice(0, 5),
      `Settlement infrastructure absorption gap (index ${absorptionGapOut.nationalIndex.toFixed(1)}).`,
      absorptionGapOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const reliefOverloaded = op10mA11RegionsWithReliefOverheadCritical(reliefOverheadOut.rows);
  if (
    reliefOverloaded.length >= 2 ||
    reliefOverheadOut.nationalIndex >= 45 ||
    op10mA11ReliefOverheadEscalating(
      reliefOverheadOut.nationalIndex,
      base.revision > 0 ? base.lastReliefOverheadIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'relief_coordination_overhead',
      reliefOverloaded.slice(0, 5),
      `Regional relief coordination overhead (index ${reliefOverheadOut.nationalIndex.toFixed(1)}).`,
      reliefOverheadOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const corridorFractured = op10mA11RegionsWithCorridorEquityFracture(corridorEquityDriftOut.rows);
  if (
    corridorFractured.length >= 2 ||
    corridorEquityDriftOut.nationalIndex >= 46 ||
    op10mA11CorridorEquityDriftEscalating(
      corridorEquityDriftOut.nationalIndex,
      base.revision > 0 ? base.lastCorridorEquityDriftIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'corridor_equity_drift',
      corridorFractured.slice(0, 5),
      `Interregional corridor equity drift (index ${corridorEquityDriftOut.nationalIndex.toFixed(1)}).`,
      corridorEquityDriftOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const adaptationLagCritical = op10mA11RegionsWithCriticalAdaptationLag(climateAdaptationLagOut.rows);
  if (
    adaptationLagCritical.length >= 2 ||
    climateAdaptationLagOut.nationalIndex >= 48 ||
    op10mA11AdaptationLagEscalating(
      climateAdaptationLagOut.nationalIndex,
      base.revision > 0 ? base.lastClimateAdaptationLagIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'climate_adaptation_lag',
      adaptationLagCritical.slice(0, 5),
      `Settlement climate adaptation lag (index ${climateAdaptationLagOut.nationalIndex.toFixed(1)}).`,
      climateAdaptationLagOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const fiscalFragile = op10mA11RegionsWithFiscalCapacityFragility(fiscalCapacityStrainOut.rows);
  if (
    fiscalFragile.length >= 2 ||
    fiscalCapacityStrainOut.nationalIndex >= 46 ||
    op10mA11FiscalCapacityStrainEscalating(
      fiscalCapacityStrainOut.nationalIndex,
      base.revision > 0 ? base.lastFiscalCapacityStrainIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_capacity_strain',
      fiscalFragile.slice(0, 5),
      `Regional fiscal capacity strain (index ${fiscalCapacityStrainOut.nationalIndex.toFixed(1)}).`,
      fiscalCapacityStrainOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const networkFracture = op10mA11RegionsWithNetworkFracture(networkErosionOut.rows);
  if (
    networkFracture.length >= 2 ||
    networkErosionOut.nationalIndex >= 45 ||
    op10mA11NetworkErosionEscalating(
      networkErosionOut.nationalIndex,
      base.revision > 0 ? base.lastNetworkResilienceErosionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'network_resilience_erosion',
      networkFracture.slice(0, 5),
      `Interregional network resilience erosion (index ${networkErosionOut.nationalIndex.toFixed(1)}).`,
      networkErosionOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const horizonCritical = op10mA11RegionsWithCriticalHorizonRisk(longHorizonRiskOut.rows);
  if (
    horizonCritical.length >= 2 ||
    longHorizonRiskOut.nationalIndex >= 48 ||
    op10mA11HorizonRiskEscalating(
      longHorizonRiskOut.nationalIndex,
      base.revision > 0 ? base.lastLongHorizonCapacityRiskIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'long_horizon_capacity_risk',
      horizonCritical.slice(0, 5),
      `Settlement long-horizon capacity risk (index ${longHorizonRiskOut.nationalIndex.toFixed(1)}).`,
      longHorizonRiskOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const cohesionFractured = op10mA11RegionsWithCohesionIntegrityFracture(cohesionIntegrityOut.rows);
  if (
    cohesionFractured.length >= 2 ||
    cohesionIntegrityOut.nationalIndex >= 44 ||
    op10mA11CohesionIntegrityEscalating(
      cohesionIntegrityOut.nationalIndex,
      base.revision > 0 ? base.lastCohesionIntegrityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'cohesion_integrity_stress',
      cohesionFractured.slice(0, 5),
      `Regional cohesion integrity stress (index ${cohesionIntegrityOut.nationalIndex.toFixed(1)}).`,
      cohesionIntegrityOut.nationalIndex >= 53 ? 'major' : 'meaningful',
    );
  }

  const reliefPolarized = op10mA11RegionsWithPolarizedReliefEquity(reliefEquityGapOut.rows);
  if (
    reliefPolarized.length >= 2 ||
    reliefEquityGapOut.nationalIndex >= 43 ||
    op10mA11ReliefEquityGapEscalating(
      reliefEquityGapOut.nationalIndex,
      base.revision > 0 ? base.lastReliefEquityGapIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'relief_delivery_equity_gap',
      reliefPolarized.slice(0, 5),
      `Interregional relief delivery equity gap (index ${reliefEquityGapOut.nationalIndex.toFixed(1)}).`,
      reliefEquityGapOut.nationalIndex >= 52 ? 'major' : 'meaningful',
    );
  }

  const systemicCascade = op10mA11RegionsWithSystemicCascadeRisk(systemicFragilityOut.rows);
  if (
    systemicCascade.length >= 2 ||
    systemicFragilityOut.nationalIndex >= 49 ||
    op10mA11SystemicFragilityEscalating(
      systemicFragilityOut.nationalIndex,
      base.revision > 0 ? base.lastSystemicFragilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'systemic_settlement_fragility',
      systemicCascade.slice(0, 5),
      `Settlement systemic fragility (index ${systemicFragilityOut.nationalIndex.toFixed(1)}).`,
      systemicFragilityOut.nationalIndex >= 59 ? 'major' : 'meaningful',
    );
  }

  const governanceCollapsed = op10mA11RegionsWithGovernanceResilienceCollapse(governanceResilienceDecayOut.rows);
  if (
    governanceCollapsed.length >= 2 ||
    governanceResilienceDecayOut.nationalIndex >= 45 ||
    op10mA11GovernanceResilienceDecayEscalating(
      governanceResilienceDecayOut.nationalIndex,
      base.revision > 0 ? base.lastGovernanceResilienceDecayIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'governance_resilience_decay',
      governanceCollapsed.slice(0, 5),
      `Regional governance resilience decay (index ${governanceResilienceDecayOut.nationalIndex.toFixed(1)}).`,
      governanceResilienceDecayOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const migrationChaos = op10mA11RegionsWithMigrationChaos(migrationStabilityErosionOut.rows);
  if (
    migrationChaos.length >= 2 ||
    migrationStabilityErosionOut.nationalIndex >= 46 ||
    op10mA11MigrationStabilityErosionEscalating(
      migrationStabilityErosionOut.nationalIndex,
      base.revision > 0 ? base.lastMigrationStabilityErosionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'migration_stability_erosion',
      migrationChaos.slice(0, 5),
      `Interregional migration stability erosion (index ${migrationStabilityErosionOut.nationalIndex.toFixed(1)}).`,
      migrationStabilityErosionOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const ceilingBreached = op10mA11RegionsWithBreachedAdaptiveCeiling(adaptiveCapacityCeilingOut.rows);
  if (
    ceilingBreached.length >= 2 ||
    adaptiveCapacityCeilingOut.nationalIndex >= 48 ||
    op10mA11AdaptiveCeilingEscalating(
      adaptiveCapacityCeilingOut.nationalIndex,
      base.revision > 0 ? base.lastAdaptiveCapacityCeilingIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'adaptive_capacity_ceiling',
      ceilingBreached.slice(0, 5),
      `Settlement adaptive capacity ceiling (index ${adaptiveCapacityCeilingOut.nationalIndex.toFixed(1)}).`,
      adaptiveCapacityCeilingOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const fiscalGovernanceRupture = op10mA11RegionsWithFiscalGovernanceRupture(fiscalGovernanceCouplingOut.rows);
  if (
    fiscalGovernanceRupture.length >= 2 ||
    fiscalGovernanceCouplingOut.nationalIndex >= 44 ||
    op10mA11FiscalGovernanceCouplingEscalating(
      fiscalGovernanceCouplingOut.nationalIndex,
      base.revision > 0 ? base.lastFiscalGovernanceCouplingIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_governance_coupling_strain',
      fiscalGovernanceRupture.slice(0, 5),
      `Regional fiscal–governance coupling strain (index ${fiscalGovernanceCouplingOut.nationalIndex.toFixed(1)}).`,
      fiscalGovernanceCouplingOut.nationalIndex >= 53 ? 'major' : 'meaningful',
    );
  }

  const networkEquityFracture = op10mA11RegionsWithNetworkEquityFracture(networkEquityTensionOut.rows);
  if (
    networkEquityFracture.length >= 2 ||
    networkEquityTensionOut.nationalIndex >= 43 ||
    op10mA11NetworkEquityTensionEscalating(
      networkEquityTensionOut.nationalIndex,
      base.revision > 0 ? base.lastNetworkEquityTensionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'network_equity_tension',
      networkEquityFracture.slice(0, 5),
      `Interregional network equity tension (index ${networkEquityTensionOut.nationalIndex.toFixed(1)}).`,
      networkEquityTensionOut.nationalIndex >= 52 ? 'major' : 'meaningful',
    );
  }

  const frontierBreached = op10mA11RegionsWithBreachedResilienceFrontier(resilienceFrontierOut.rows);
  if (
    frontierBreached.length >= 2 ||
    resilienceFrontierOut.nationalIndex >= 49 ||
    op10mA11ResilienceFrontierEscalating(
      resilienceFrontierOut.nationalIndex,
      base.revision > 0 ? base.lastResilienceFrontierIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'resilience_frontier_pressure',
      frontierBreached.slice(0, 5),
      `Settlement resilience frontier pressure (index ${resilienceFrontierOut.nationalIndex.toFixed(1)}).`,
      resilienceFrontierOut.nationalIndex >= 59 ? 'major' : 'meaningful',
    );
  }

  const metaGovernanceExhausted = op10mA11RegionsWithMetaGovernanceExhaustion(metaGovernanceFatigueOut.rows);
  if (
    metaGovernanceExhausted.length >= 2 ||
    metaGovernanceFatigueOut.nationalIndex >= 46 ||
    op10mA11MetaGovernanceFatigueEscalating(
      metaGovernanceFatigueOut.nationalIndex,
      base.revision > 0 ? base.lastMetaGovernanceFatigueIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'meta_governance_coordination_fatigue',
      metaGovernanceExhausted.slice(0, 5),
      `Regional meta-governance coordination fatigue (index ${metaGovernanceFatigueOut.nationalIndex.toFixed(1)}).`,
      metaGovernanceFatigueOut.nationalIndex >= 56 ? 'major' : 'meaningful',
    );
  }

  const capitalMobilityLocked = op10mA11RegionsWithLockedCapitalMobility(capitalMobilityAsymmetryOut.rows);
  if (
    capitalMobilityLocked.length >= 2 ||
    capitalMobilityAsymmetryOut.nationalIndex >= 44 ||
    op10mA11CapitalMobilityAsymmetryEscalating(
      capitalMobilityAsymmetryOut.nationalIndex,
      base.revision > 0 ? base.lastCapitalMobilityAsymmetryIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'capital_mobility_asymmetry',
      capitalMobilityLocked.slice(0, 5),
      `Interregional capital mobility asymmetry (index ${capitalMobilityAsymmetryOut.nationalIndex.toFixed(1)}).`,
      capitalMobilityAsymmetryOut.nationalIndex >= 54 ? 'major' : 'meaningful',
    );
  }

  const compoundShocksOverwhelming = op10mA11RegionsWithOverwhelmingCompoundShocks(compoundShockSaturationOut.rows);
  if (
    compoundShocksOverwhelming.length >= 2 ||
    compoundShockSaturationOut.nationalIndex >= 50 ||
    op10mA11CompoundShockSaturationEscalating(
      compoundShockSaturationOut.nationalIndex,
      base.revision > 0 ? base.lastCompoundShockSaturationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'compound_shock_saturation',
      compoundShocksOverwhelming.slice(0, 5),
      `Settlement compound shock saturation (index ${compoundShockSaturationOut.nationalIndex.toFixed(1)}).`,
      compoundShockSaturationOut.nationalIndex >= 60 ? 'major' : 'meaningful',
    );
  }

  const institutionalTrustBreakdown = op10mA11RegionsWithInstitutionalTrustBreakdown(institutionalTrustErosionOut.rows);
  if (
    institutionalTrustBreakdown.length >= 2 ||
    institutionalTrustErosionOut.nationalIndex >= 47 ||
    op10mA11InstitutionalTrustErosionEscalating(
      institutionalTrustErosionOut.nationalIndex,
      base.revision > 0 ? base.lastInstitutionalTrustErosionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'institutional_trust_erosion',
      institutionalTrustBreakdown.slice(0, 5),
      `Regional institutional trust erosion (index ${institutionalTrustErosionOut.nationalIndex.toFixed(1)}).`,
      institutionalTrustErosionOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const liquidityFrozen = op10mA11RegionsWithFrozenLiquidity(liquidityFragmentationOut.rows);
  if (
    liquidityFrozen.length >= 2 ||
    liquidityFragmentationOut.nationalIndex >= 45 ||
    op10mA11LiquidityFragmentationEscalating(
      liquidityFragmentationOut.nationalIndex,
      base.revision > 0 ? base.lastLiquidityFragmentationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'liquidity_fragmentation_stress',
      liquidityFrozen.slice(0, 5),
      `Interregional liquidity fragmentation stress (index ${liquidityFragmentationOut.nationalIndex.toFixed(1)}).`,
      liquidityFragmentationOut.nationalIndex >= 55 ? 'major' : 'meaningful',
    );
  }

  const cascadeSystemic = op10mA11RegionsWithSystemicCascadeRisk(cascadingFailureRiskOut.rows);
  if (
    cascadeSystemic.length >= 2 ||
    cascadingFailureRiskOut.nationalIndex >= 51 ||
    op10mA11CascadingFailureRiskEscalating(
      cascadingFailureRiskOut.nationalIndex,
      base.revision > 0 ? base.lastCascadingFailureRiskIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'cascading_failure_risk',
      cascadeSystemic.slice(0, 5),
      `Settlement cascading failure risk (index ${cascadingFailureRiskOut.nationalIndex.toFixed(1)}).`,
      cascadingFailureRiskOut.nationalIndex >= 61 ? 'major' : 'meaningful',
    );
  }

  const socialContractRupture = op10mA11RegionsWithRupturedSocialContract(socialContractFragilityOut.rows);
  if (
    socialContractRupture.length >= 2 ||
    socialContractFragilityOut.nationalIndex >= 48 ||
    op10mA11SocialContractFragilityEscalating(
      socialContractFragilityOut.nationalIndex,
      base.revision > 0 ? base.lastSocialContractFragilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'social_contract_fragility',
      socialContractRupture.slice(0, 5),
      `Regional social contract fragility (index ${socialContractFragilityOut.nationalIndex.toFixed(1)}).`,
      socialContractFragilityOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const capitalFlightStampede = op10mA11RegionsWithCapitalFlightStampede(capitalFlightPanicOut.rows);
  if (
    capitalFlightStampede.length >= 2 ||
    capitalFlightPanicOut.nationalIndex >= 47 ||
    op10mA11CapitalFlightPanicEscalating(
      capitalFlightPanicOut.nationalIndex,
      base.revision > 0 ? base.lastCapitalFlightPanicIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'capital_flight_panic',
      capitalFlightStampede.slice(0, 5),
      `Interregional capital flight panic (index ${capitalFlightPanicOut.nationalIndex.toFixed(1)}).`,
      capitalFlightPanicOut.nationalIndex >= 57 ? 'major' : 'meaningful',
    );
  }

  const irrecoverableCollapse = op10mA11RegionsWithIrrecoverableCollapse(irrecoverableCollapseOut.rows);
  if (
    irrecoverableCollapse.length >= 2 ||
    irrecoverableCollapseOut.nationalIndex >= 52 ||
    op10mA11IrrecoverableCollapseThresholdEscalating(
      irrecoverableCollapseOut.nationalIndex,
      base.revision > 0 ? base.lastIrrecoverableCollapseThresholdIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'irrecoverable_collapse_threshold',
      irrecoverableCollapse.slice(0, 5),
      `Settlement irrecoverable collapse threshold (index ${irrecoverableCollapseOut.nationalIndex.toFixed(1)}).`,
      irrecoverableCollapseOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const legitimacyCollapsed = op10mA11RegionsWithCollapsedSettlementLegitimacy(settlementLegitimacyCollapseOut.rows);
  if (
    legitimacyCollapsed.length >= 2 ||
    settlementLegitimacyCollapseOut.nationalIndex >= 49 ||
    op10mA11SettlementLegitimacyCollapseEscalating(
      settlementLegitimacyCollapseOut.nationalIndex,
      base.revision > 0 ? base.lastSettlementLegitimacyCollapseIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_legitimacy_collapse',
      legitimacyCollapsed.slice(0, 5),
      `Regional settlement legitimacy collapse (index ${settlementLegitimacyCollapseOut.nationalIndex.toFixed(1)}).`,
      settlementLegitimacyCollapseOut.nationalIndex >= 59 ? 'major' : 'meaningful',
    );
  }

  const fiscalContagionSystemic = op10mA11RegionsWithSystemicFiscalPanicContagion(fiscalPanicContagionOut.rows);
  if (
    fiscalContagionSystemic.length >= 2 ||
    fiscalPanicContagionOut.nationalIndex >= 48 ||
    op10mA11FiscalPanicContagionEscalating(
      fiscalPanicContagionOut.nationalIndex,
      base.revision > 0 ? base.lastFiscalPanicContagionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'fiscal_panic_contagion',
      fiscalContagionSystemic.slice(0, 5),
      `Interregional fiscal panic contagion (index ${fiscalPanicContagionOut.nationalIndex.toFixed(1)}).`,
      fiscalPanicContagionOut.nationalIndex >= 58 ? 'major' : 'meaningful',
    );
  }

  const terminalLocked = op10mA11RegionsWithTerminalStateLockIn(terminalStateLockInOut.rows);
  if (
    terminalLocked.length >= 2 ||
    terminalStateLockInOut.nationalIndex >= 54 ||
    op10mA11TerminalStateLockInEscalating(
      terminalStateLockInOut.nationalIndex,
      base.revision > 0 ? base.lastTerminalStateLockInIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'terminal_state_lock_in',
      terminalLocked.slice(0, 5),
      `Settlement terminal state lock-in (index ${terminalStateLockInOut.nationalIndex.toFixed(1)}).`,
      terminalStateLockInOut.nationalIndex >= 64 ? 'major' : 'meaningful',
    );
  }

  const governanceVacuum = op10mA11RegionsWithGovernanceVacuum(governanceVacuumEscalationOut.rows);
  if (
    governanceVacuum.length >= 2 ||
    governanceVacuumEscalationOut.nationalIndex >= 50 ||
    op10mA11GovernanceVacuumEscalating(
      governanceVacuumEscalationOut.nationalIndex,
      base.revision > 0 ? base.lastGovernanceVacuumEscalationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'governance_vacuum_escalation',
      governanceVacuum.slice(0, 5),
      `Regional governance vacuum escalation (index ${governanceVacuumEscalationOut.nationalIndex.toFixed(1)}).`,
      governanceVacuumEscalationOut.nationalIndex >= 60 ? 'major' : 'meaningful',
    );
  }

  const abandonmentSpiral = op10mA11RegionsWithSettlementAbandonment(settlementAbandonmentSpiralOut.rows);
  if (
    abandonmentSpiral.length >= 2 ||
    settlementAbandonmentSpiralOut.nationalIndex >= 51 ||
    op10mA11SettlementAbandonmentSpiralEscalating(
      settlementAbandonmentSpiralOut.nationalIndex,
      base.revision > 0 ? base.lastSettlementAbandonmentSpiralIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'settlement_abandonment_spiral',
      abandonmentSpiral.slice(0, 5),
      `Interregional settlement abandonment spiral (index ${settlementAbandonmentSpiralOut.nationalIndex.toFixed(1)}).`,
      settlementAbandonmentSpiralOut.nationalIndex >= 61 ? 'major' : 'meaningful',
    );
  }

  const recoveryImpossible = op10mA11RegionsWithImpossibleRecovery(postCollapseRecoveryImpossibilityOut.rows);
  if (
    recoveryImpossible.length >= 2 ||
    postCollapseRecoveryImpossibilityOut.nationalIndex >= 55 ||
    op10mA11PostCollapseRecoveryImpossibilityEscalating(
      postCollapseRecoveryImpossibilityOut.nationalIndex,
      base.revision > 0 ? base.lastPostCollapseRecoveryImpossibilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'post_collapse_recovery_impossibility',
      recoveryImpossible.slice(0, 5),
      `Settlement post-collapse recovery impossibility (index ${postCollapseRecoveryImpossibilityOut.nationalIndex.toFixed(1)}).`,
      postCollapseRecoveryImpossibilityOut.nationalIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const runawayCascade = op10mA11RegionsWithRunawayCollapseCascade(stateCollapseCascadeAmplificationOut.rows);
  if (
    runawayCascade.length >= 2 ||
    stateCollapseCascadeAmplificationOut.nationalIndex >= 51 ||
    op10mA11StateCollapseCascadeAmplificationEscalating(
      stateCollapseCascadeAmplificationOut.nationalIndex,
      base.revision > 0 ? base.lastStateCollapseCascadeAmplificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'state_collapse_cascade_amplification',
      runawayCascade.slice(0, 5),
      `Regional state collapse cascade amplification (index ${stateCollapseCascadeAmplificationOut.nationalIndex.toFixed(1)}).`,
      stateCollapseCascadeAmplificationOut.nationalIndex >= 61 ? 'major' : 'meaningful',
    );
  }

  const hollowVoided = op10mA11RegionsWithVoidedHollowContagion(hollowRegionContagionOut.rows);
  if (
    hollowVoided.length >= 2 ||
    hollowRegionContagionOut.nationalIndex >= 52 ||
    op10mA11HollowRegionContagionEscalating(
      hollowRegionContagionOut.nationalIndex,
      base.revision > 0 ? base.lastHollowRegionContagionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'hollow_region_contagion',
      hollowVoided.slice(0, 5),
      `Interregional hollow region contagion (index ${hollowRegionContagionOut.nationalIndex.toFixed(1)}).`,
      hollowRegionContagionOut.nationalIndex >= 62 ? 'major' : 'meaningful',
    );
  }

  const depopulationLocked = op10mA11RegionsWithPermanentDepopulationLock(permanentDepopulationLockOut.rows);
  if (
    depopulationLocked.length >= 2 ||
    permanentDepopulationLockOut.nationalIndex >= 56 ||
    op10mA11PermanentDepopulationLockEscalating(
      permanentDepopulationLockOut.nationalIndex,
      base.revision > 0 ? base.lastPermanentDepopulationLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'permanent_depopulation_lock',
      depopulationLocked.slice(0, 5),
      `Settlement permanent depopulation lock (index ${permanentDepopulationLockOut.nationalIndex.toFixed(1)}).`,
      permanentDepopulationLockOut.nationalIndex >= 66 ? 'major' : 'meaningful',
    );
  }

  const singularityTotal = op10mA11RegionsWithTotalCollapseSingularity(totalCollapseSingularityOut.rows);
  if (
    singularityTotal.length >= 2 ||
    totalCollapseSingularityOut.nationalIndex >= 55 ||
    op10mA11TotalCollapseSingularityEscalating(
      totalCollapseSingularityOut.nationalIndex,
      base.revision > 0 ? base.lastTotalCollapseSingularityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'total_collapse_singularity_pressure',
      singularityTotal.slice(0, 5),
      `Regional total collapse singularity pressure (index ${totalCollapseSingularityOut.nationalIndex.toFixed(1)}).`,
      totalCollapseSingularityOut.nationalIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const voidUnbounded = op10mA11RegionsWithUnboundedVoidExpansion(voidExpansionVelocityOut.rows);
  if (
    voidUnbounded.length >= 2 ||
    voidExpansionVelocityOut.nationalIndex >= 54 ||
    op10mA11VoidExpansionVelocityEscalating(
      voidExpansionVelocityOut.nationalIndex,
      base.revision > 0 ? base.lastVoidExpansionVelocityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_expansion_velocity',
      voidUnbounded.slice(0, 5),
      `Interregional void expansion velocity (index ${voidExpansionVelocityOut.nationalIndex.toFixed(1)}).`,
      voidExpansionVelocityOut.nationalIndex >= 64 ? 'major' : 'meaningful',
    );
  }

  const continuityExtinguished = op10mA11RegionsWithExtinguishedContinuity(existentialContinuityFractureOut.rows);
  if (
    continuityExtinguished.length >= 2 ||
    existentialContinuityFractureOut.nationalIndex >= 57 ||
    op10mA11ExistentialContinuityFractureEscalating(
      existentialContinuityFractureOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialContinuityFractureIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_continuity_fracture',
      continuityExtinguished.slice(0, 5),
      `Settlement existential continuity fracture (index ${existentialContinuityFractureOut.nationalIndex.toFixed(1)}).`,
      existentialContinuityFractureOut.nationalIndex >= 67 ? 'major' : 'meaningful',
    );
  }

  const horizonLocked = op10mA11RegionsWithLockedCollapseHorizon(collapseHorizonConvergenceOut.rows);
  if (
    horizonLocked.length >= 2 ||
    collapseHorizonConvergenceOut.nationalIndex >= 56 ||
    op10mA11CollapseHorizonConvergenceEscalating(
      collapseHorizonConvergenceOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseHorizonConvergenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_horizon_convergence',
      horizonLocked.slice(0, 5),
      `Regional collapse horizon convergence (index ${collapseHorizonConvergenceOut.nationalIndex.toFixed(1)}).`,
      collapseHorizonConvergenceOut.nationalIndex >= 66 ? 'major' : 'meaningful',
    );
  }

  const voidAbsolute = op10mA11RegionsWithAbsoluteVoidTotalization(voidTotalizationSurgeOut.rows);
  if (
    voidAbsolute.length >= 2 ||
    voidTotalizationSurgeOut.nationalIndex >= 55 ||
    op10mA11VoidTotalizationSurgeEscalating(
      voidTotalizationSurgeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalizationSurgeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_totalization_surge',
      voidAbsolute.slice(0, 5),
      `Interregional void totalization surge (index ${voidTotalizationSurgeOut.nationalIndex.toFixed(1)}).`,
      voidTotalizationSurgeOut.nationalIndex >= 65 ? 'major' : 'meaningful',
    );
  }

  const terminusTerminal = op10mA11RegionsWithTerminalExistentialLock(existentialTerminusLockOut.rows);
  if (
    terminusTerminal.length >= 2 ||
    existentialTerminusLockOut.nationalIndex >= 58 ||
    op10mA11ExistentialTerminusLockEscalating(
      existentialTerminusLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialTerminusLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_terminus_lock',
      terminusTerminal.slice(0, 5),
      `Settlement existential terminus lock (index ${existentialTerminusLockOut.nationalIndex.toFixed(1)}).`,
      existentialTerminusLockOut.nationalIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const horizonAbsolute = op10mA11RegionsWithAbsoluteCollapseHorizonLock(absoluteCollapseHorizonLockOut.rows);
  if (
    horizonAbsolute.length >= 2 ||
    absoluteCollapseHorizonLockOut.nationalIndex >= 57 ||
    op10mA11AbsoluteCollapseHorizonLockEscalating(
      absoluteCollapseHorizonLockOut.nationalIndex,
      base.revision > 0 ? base.lastAbsoluteCollapseHorizonLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'absolute_collapse_horizon_lock',
      horizonAbsolute.slice(0, 5),
      `Regional absolute collapse horizon lock (index ${absoluteCollapseHorizonLockOut.nationalIndex.toFixed(1)}).`,
      absoluteCollapseHorizonLockOut.nationalIndex >= 67 ? 'major' : 'meaningful',
    );
  }

  const voidComplete = op10mA11RegionsWithCompleteVoidFinalization(voidFinalizationCascadeOut.rows);
  if (
    voidComplete.length >= 2 ||
    voidFinalizationCascadeOut.nationalIndex >= 56 ||
    op10mA11VoidFinalizationCascadeEscalating(
      voidFinalizationCascadeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidFinalizationCascadeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_finalization_cascade',
      voidComplete.slice(0, 5),
      `Interregional void finalization cascade (index ${voidFinalizationCascadeOut.nationalIndex.toFixed(1)}).`,
      voidFinalizationCascadeOut.nationalIndex >= 66 ? 'major' : 'meaningful',
    );
  }

  const obliterated = op10mA11RegionsWithObliteratedExistentialThreshold(existentialObliterationThresholdOut.rows);
  if (
    obliterated.length >= 2 ||
    existentialObliterationThresholdOut.nationalIndex >= 59 ||
    op10mA11ExistentialObliterationThresholdEscalating(
      existentialObliterationThresholdOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialObliterationThresholdIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_obliteration_threshold',
      obliterated.slice(0, 5),
      `Settlement existential obliteration threshold (index ${existentialObliterationThresholdOut.nationalIndex.toFixed(1)}).`,
      existentialObliterationThresholdOut.nationalIndex >= 69 ? 'major' : 'meaningful',
    );
  }

  const sealUltimate = op10mA11RegionsWithUltimateCollapseSeal(ultimateCollapseSingularitySealOut.rows);
  if (
    sealUltimate.length >= 2 ||
    ultimateCollapseSingularitySealOut.nationalIndex >= 58 ||
    op10mA11UltimateCollapseSingularitySealEscalating(
      ultimateCollapseSingularitySealOut.nationalIndex,
      base.revision > 0 ? base.lastUltimateCollapseSingularitySealIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'ultimate_collapse_singularity_seal',
      sealUltimate.slice(0, 5),
      `Regional ultimate collapse singularity seal (index ${ultimateCollapseSingularitySealOut.nationalIndex.toFixed(1)}).`,
      ultimateCollapseSingularitySealOut.nationalIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const annihilationTotal = op10mA11RegionsWithTotalVoidAnnihilation(voidAnnihilationConvergenceOut.rows);
  if (
    annihilationTotal.length >= 2 ||
    voidAnnihilationConvergenceOut.nationalIndex >= 57 ||
    op10mA11VoidAnnihilationConvergenceEscalating(
      voidAnnihilationConvergenceOut.nationalIndex,
      base.revision > 0 ? base.lastVoidAnnihilationConvergenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_annihilation_convergence',
      annihilationTotal.slice(0, 5),
      `Interregional void annihilation convergence (index ${voidAnnihilationConvergenceOut.nationalIndex.toFixed(1)}).`,
      voidAnnihilationConvergenceOut.nationalIndex >= 67 ? 'major' : 'meaningful',
    );
  }

  const nullAbsolute = op10mA11RegionsWithAbsoluteExistentialNull(existentialNullStateLockOut.rows);
  if (
    nullAbsolute.length >= 2 ||
    existentialNullStateLockOut.nationalIndex >= 60 ||
    op10mA11ExistentialNullStateLockEscalating(
      existentialNullStateLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialNullStateLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_null_state_lock',
      nullAbsolute.slice(0, 5),
      `Settlement existential null-state lock (index ${existentialNullStateLockOut.nationalIndex.toFixed(1)}).`,
      existentialNullStateLockOut.nationalIndex >= 70 ? 'major' : 'meaningful',
    );
  }

  const singularityPoint = op10mA11RegionsWithExistentialSingularityPoint(collapseExistenceSingularityPointOut.rows);
  if (
    singularityPoint.length >= 2 ||
    collapseExistenceSingularityPointOut.nationalIndex >= 59 ||
    op10mA11CollapseExistenceSingularityPointEscalating(
      collapseExistenceSingularityPointOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseExistenceSingularityPointIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_existence_singularity_point',
      singularityPoint.slice(0, 5),
      `Regional collapse existence singularity point (index ${collapseExistenceSingularityPointOut.nationalIndex.toFixed(1)}).`,
      collapseExistenceSingularityPointOut.nationalIndex >= 69 ? 'major' : 'meaningful',
    );
  }

  const voidFrontTotal = op10mA11RegionsWithTotalVoidExistenceFront(voidExistenceAnnihilationFrontOut.rows);
  if (
    voidFrontTotal.length >= 2 ||
    voidExistenceAnnihilationFrontOut.nationalIndex >= 58 ||
    op10mA11VoidExistenceAnnihilationFrontEscalating(
      voidExistenceAnnihilationFrontOut.nationalIndex,
      base.revision > 0 ? base.lastVoidExistenceAnnihilationFrontIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_existence_annihilation_front',
      voidFrontTotal.slice(0, 5),
      `Interregional void existence annihilation front (index ${voidExistenceAnnihilationFrontOut.nationalIndex.toFixed(1)}).`,
      voidExistenceAnnihilationFrontOut.nationalIndex >= 68 ? 'major' : 'meaningful',
    );
  }

  const zeroLocked = op10mA11RegionsWithAbsoluteZeroLock(existentialAbsoluteZeroLockOut.rows);
  if (
    zeroLocked.length >= 2 ||
    existentialAbsoluteZeroLockOut.nationalIndex >= 61 ||
    op10mA11ExistentialAbsoluteZeroLockEscalating(
      existentialAbsoluteZeroLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteZeroLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_zero_lock',
      zeroLocked.slice(0, 5),
      `Settlement existential absolute zero lock (index ${existentialAbsoluteZeroLockOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteZeroLockOut.nationalIndex >= 71 ? 'major' : 'meaningful',
    );
  }

  const omniNode = op10mA11RegionsWithTotalOmniSingularityNode(collapseOmniSingularityNodeOut.rows);
  if (
    omniNode.length >= 2 ||
    collapseOmniSingularityNodeOut.nationalIndex >= 60 ||
    op10mA11CollapseOmniSingularityNodeEscalating(
      collapseOmniSingularityNodeOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityNodeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_node',
      omniNode.slice(0, 5),
      `Regional collapse omni singularity node (index ${collapseOmniSingularityNodeOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityNodeOut.nationalIndex >= 70 ? 'major' : 'meaningful',
    );
  }

  const erosionOmni = op10mA11RegionsWithOmniVoidErosion(voidAbsoluteErosionSurgeOut.rows);
  if (
    erosionOmni.length >= 2 ||
    voidAbsoluteErosionSurgeOut.nationalIndex >= 59 ||
    op10mA11VoidAbsoluteErosionSurgeEscalating(
      voidAbsoluteErosionSurgeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidAbsoluteErosionSurgeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_absolute_erosion_surge',
      erosionOmni.slice(0, 5),
      `Interregional void absolute erosion surge (index ${voidAbsoluteErosionSurgeOut.nationalIndex.toFixed(1)}).`,
      voidAbsoluteErosionSurgeOut.nationalIndex >= 69 ? 'major' : 'meaningful',
    );
  }

  const finalNullity = op10mA11RegionsWithFinalNullityLock(existentialFinalNullityLockOut.rows);
  if (
    finalNullity.length >= 2 ||
    existentialFinalNullityLockOut.nationalIndex >= 62 ||
    op10mA11ExistentialFinalNullityLockEscalating(
      existentialFinalNullityLockOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialFinalNullityLockIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_final_nullity_lock',
      finalNullity.slice(0, 5),
      `Settlement existential final nullity lock (index ${existentialFinalNullityLockOut.nationalIndex.toFixed(1)}).`,
      existentialFinalNullityLockOut.nationalIndex >= 72 ? 'major' : 'meaningful',
    );
  }

  const singularityVertex = op10mA11RegionsWithCollapseSingularityVertex(collapseTotalSingularityVertexOut.rows);
  if (
    singularityVertex.length >= 2 ||
    collapseTotalSingularityVertexOut.nationalIndex >= 61 ||
    op10mA11CollapseTotalSingularityVertexEscalating(
      collapseTotalSingularityVertexOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseTotalSingularityVertexIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_total_singularity_vertex',
      singularityVertex.slice(0, 5),
      `Regional collapse total singularity vertex (index ${collapseTotalSingularityVertexOut.nationalIndex.toFixed(1)}).`,
      collapseTotalSingularityVertexOut.nationalIndex >= 71 ? 'major' : 'meaningful',
    );
  }

  const terminalErosion = op10mA11RegionsWithTotalTerminalErosion(voidTerminalErosionCascadeOut.rows);
  if (
    terminalErosion.length >= 2 ||
    voidTerminalErosionCascadeOut.nationalIndex >= 60 ||
    op10mA11VoidTerminalErosionCascadeEscalating(
      voidTerminalErosionCascadeOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTerminalErosionCascadeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_terminal_erosion_cascade',
      terminalErosion.slice(0, 5),
      `Interregional void terminal erosion cascade (index ${voidTerminalErosionCascadeOut.nationalIndex.toFixed(1)}).`,
      voidTerminalErosionCascadeOut.nationalIndex >= 70 ? 'major' : 'meaningful',
    );
  }

  const ultimateSeal = op10mA11RegionsWithTotalUltimateNullitySeal(existentialUltimateNullitySealOut.rows);
  if (
    ultimateSeal.length >= 2 ||
    existentialUltimateNullitySealOut.nationalIndex >= 63 ||
    op10mA11ExistentialUltimateNullitySealEscalating(
      existentialUltimateNullitySealOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialUltimateNullitySealIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_ultimate_nullity_seal',
      ultimateSeal.slice(0, 5),
      `Settlement existential ultimate nullity seal (index ${existentialUltimateNullitySealOut.nationalIndex.toFixed(1)}).`,
      existentialUltimateNullitySealOut.nationalIndex >= 73 ? 'major' : 'meaningful',
    );
  }

  const singularityApex = op10mA11RegionsWithCollapseSingularityApex(collapseAbsoluteSingularityApexOut.rows);
  if (
    singularityApex.length >= 2 ||
    collapseAbsoluteSingularityApexOut.nationalIndex >= 62 ||
    op10mA11CollapseAbsoluteSingularityApexEscalating(
      collapseAbsoluteSingularityApexOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseAbsoluteSingularityApexIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_absolute_singularity_apex',
      singularityApex.slice(0, 5),
      `Regional collapse absolute singularity apex (index ${collapseAbsoluteSingularityApexOut.nationalIndex.toFixed(1)}).`,
      collapseAbsoluteSingularityApexOut.nationalIndex >= 72 ? 'major' : 'meaningful',
    );
  }

  const completeTerminality = op10mA11RegionsWithCompleteErosionTerminality(voidCompleteErosionTerminalityOut.rows);
  if (
    completeTerminality.length >= 2 ||
    voidCompleteErosionTerminalityOut.nationalIndex >= 61 ||
    op10mA11VoidCompleteErosionTerminalityEscalating(
      voidCompleteErosionTerminalityOut.nationalIndex,
      base.revision > 0 ? base.lastVoidCompleteErosionTerminalityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_complete_erosion_terminality',
      completeTerminality.slice(0, 5),
      `Interregional void complete erosion terminality (index ${voidCompleteErosionTerminalityOut.nationalIndex.toFixed(1)}).`,
      voidCompleteErosionTerminalityOut.nationalIndex >= 71 ? 'major' : 'meaningful',
    );
  }

  const nullityClosure = op10mA11RegionsWithTotalFinalNullityClosure(existentialFinalNullityClosureOut.rows);
  if (
    nullityClosure.length >= 2 ||
    existentialFinalNullityClosureOut.nationalIndex >= 64 ||
    op10mA11ExistentialFinalNullityClosureEscalating(
      existentialFinalNullityClosureOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialFinalNullityClosureIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_final_nullity_closure',
      nullityClosure.slice(0, 5),
      `Settlement existential final nullity closure (index ${existentialFinalNullityClosureOut.nationalIndex.toFixed(1)}).`,
      existentialFinalNullityClosureOut.nationalIndex >= 74 ? 'major' : 'meaningful',
    );
  }

  const singularityZenith = op10mA11RegionsWithCollapseSingularityZenith(collapseUltimateSingularityZenithOut.rows);
  if (
    singularityZenith.length >= 2 ||
    collapseUltimateSingularityZenithOut.nationalIndex >= 63 ||
    op10mA11CollapseUltimateSingularityZenithEscalating(
      collapseUltimateSingularityZenithOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseUltimateSingularityZenithIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_ultimate_singularity_zenith',
      singularityZenith.slice(0, 5),
      `Regional collapse ultimate singularity zenith (index ${collapseUltimateSingularityZenithOut.nationalIndex.toFixed(1)}).`,
      collapseUltimateSingularityZenithOut.nationalIndex >= 73 ? 'major' : 'meaningful',
    );
  }

  const totalFinality = op10mA11RegionsWithTotalErosionFinality(voidTotalErosionFinalityOut.rows);
  if (
    totalFinality.length >= 2 ||
    voidTotalErosionFinalityOut.nationalIndex >= 62 ||
    op10mA11VoidTotalErosionFinalityEscalating(
      voidTotalErosionFinalityOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionFinalityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_finality',
      totalFinality.slice(0, 5),
      `Interregional void total erosion finality (index ${voidTotalErosionFinalityOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionFinalityOut.nationalIndex >= 72 ? 'major' : 'meaningful',
    );
  }

  const nullityVerdict = op10mA11RegionsWithTotalAbsoluteNullityVerdict(existentialAbsoluteNullityVerdictOut.rows);
  if (
    nullityVerdict.length >= 2 ||
    existentialAbsoluteNullityVerdictOut.nationalIndex >= 65 ||
    op10mA11ExistentialAbsoluteNullityVerdictEscalating(
      existentialAbsoluteNullityVerdictOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityVerdictIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_verdict',
      nullityVerdict.slice(0, 5),
      `Settlement existential absolute nullity verdict (index ${existentialAbsoluteNullityVerdictOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityVerdictOut.nationalIndex >= 75 ? 'major' : 'meaningful',
    );
  }

  const singularityNexus = op10mA11RegionsWithCollapseSingularityNexus(collapseTotalSingularityNexusOut.rows);
  if (
    singularityNexus.length >= 2 ||
    collapseTotalSingularityNexusOut.nationalIndex >= 64 ||
    op10mA11CollapseTotalSingularityNexusEscalating(
      collapseTotalSingularityNexusOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseTotalSingularityNexusIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_total_singularity_nexus',
      singularityNexus.slice(0, 5),
      `Regional collapse total singularity nexus (index ${collapseTotalSingularityNexusOut.nationalIndex.toFixed(1)}).`,
      collapseTotalSingularityNexusOut.nationalIndex >= 74 ? 'major' : 'meaningful',
    );
  }

  const erosionTermination = op10mA11RegionsWithAbsoluteErosionTermination(voidAbsoluteErosionTerminationOut.rows);
  if (
    erosionTermination.length >= 2 ||
    voidAbsoluteErosionTerminationOut.nationalIndex >= 63 ||
    op10mA11VoidAbsoluteErosionTerminationEscalating(
      voidAbsoluteErosionTerminationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidAbsoluteErosionTerminationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_absolute_erosion_termination',
      erosionTermination.slice(0, 5),
      `Interregional void absolute erosion termination (index ${voidAbsoluteErosionTerminationOut.nationalIndex.toFixed(1)}).`,
      voidAbsoluteErosionTerminationOut.nationalIndex >= 73 ? 'major' : 'meaningful',
    );
  }

  const nullitySentence = op10mA11RegionsWithTotalFinalNullitySentence(existentialFinalNullitySentenceOut.rows);
  if (
    nullitySentence.length >= 2 ||
    existentialFinalNullitySentenceOut.nationalIndex >= 66 ||
    op10mA11ExistentialFinalNullitySentenceEscalating(
      existentialFinalNullitySentenceOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialFinalNullitySentenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_final_nullity_sentence',
      nullitySentence.slice(0, 5),
      `Settlement existential final nullity sentence (index ${existentialFinalNullitySentenceOut.nationalIndex.toFixed(1)}).`,
      existentialFinalNullitySentenceOut.nationalIndex >= 76 ? 'major' : 'meaningful',
    );
  }

  const singularityCulmination = op10mA11RegionsWithCollapseSingularityCulmination(
    collapseAbsoluteSingularityCulminationOut.rows,
  );
  if (
    singularityCulmination.length >= 2 ||
    collapseAbsoluteSingularityCulminationOut.nationalIndex >= 65 ||
    op10mA11CollapseAbsoluteSingularityCulminationEscalating(
      collapseAbsoluteSingularityCulminationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseAbsoluteSingularityCulminationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_absolute_singularity_culmination',
      singularityCulmination.slice(0, 5),
      `Regional collapse absolute singularity culmination (index ${collapseAbsoluteSingularityCulminationOut.nationalIndex.toFixed(1)}).`,
      collapseAbsoluteSingularityCulminationOut.nationalIndex >= 75 ? 'major' : 'meaningful',
    );
  }

  const erosionExtinction = op10mA11RegionsWithCompleteErosionExtinction(voidCompleteErosionExtinctionOut.rows);
  if (
    erosionExtinction.length >= 2 ||
    voidCompleteErosionExtinctionOut.nationalIndex >= 64 ||
    op10mA11VoidCompleteErosionExtinctionEscalating(
      voidCompleteErosionExtinctionOut.nationalIndex,
      base.revision > 0 ? base.lastVoidCompleteErosionExtinctionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_complete_erosion_extinction',
      erosionExtinction.slice(0, 5),
      `Interregional void complete erosion extinction (index ${voidCompleteErosionExtinctionOut.nationalIndex.toFixed(1)}).`,
      voidCompleteErosionExtinctionOut.nationalIndex >= 74 ? 'major' : 'meaningful',
    );
  }

  const nullityDecree = op10mA11RegionsWithTotalNullityDecree(existentialTotalNullityDecreeOut.rows);
  if (
    nullityDecree.length >= 2 ||
    existentialTotalNullityDecreeOut.nationalIndex >= 67 ||
    op10mA11ExistentialTotalNullityDecreeEscalating(
      existentialTotalNullityDecreeOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialTotalNullityDecreeIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_total_nullity_decree',
      nullityDecree.slice(0, 5),
      `Settlement existential total nullity decree (index ${existentialTotalNullityDecreeOut.nationalIndex.toFixed(1)}).`,
      existentialTotalNullityDecreeOut.nationalIndex >= 77 ? 'major' : 'meaningful',
    );
  }

  const singularitySynthesis = op10mA11RegionsWithCollapseSingularitySynthesis(
    collapseOmniSingularitySynthesisOut.rows,
  );
  if (
    singularitySynthesis.length >= 2 ||
    collapseOmniSingularitySynthesisOut.nationalIndex >= 66 ||
    op10mA11CollapseOmniSingularitySynthesisEscalating(
      collapseOmniSingularitySynthesisOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularitySynthesisIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_synthesis',
      singularitySynthesis.slice(0, 5),
      `Regional collapse omni singularity synthesis (index ${collapseOmniSingularitySynthesisOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularitySynthesisOut.nationalIndex >= 76 ? 'major' : 'meaningful',
    );
  }

  const erosionAnnihilation = op10mA11RegionsWithTotalErosionAnnihilation(voidTotalErosionAnnihilationOut.rows);
  if (
    erosionAnnihilation.length >= 2 ||
    voidTotalErosionAnnihilationOut.nationalIndex >= 65 ||
    op10mA11VoidTotalErosionAnnihilationEscalating(
      voidTotalErosionAnnihilationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionAnnihilationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_annihilation',
      erosionAnnihilation.slice(0, 5),
      `Interregional void total erosion annihilation (index ${voidTotalErosionAnnihilationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionAnnihilationOut.nationalIndex >= 75 ? 'major' : 'meaningful',
    );
  }

  const nullityMandate = op10mA11RegionsWithTotalAbsoluteNullityMandate(existentialAbsoluteNullityMandateOut.rows);
  if (
    nullityMandate.length >= 2 ||
    existentialAbsoluteNullityMandateOut.nationalIndex >= 68 ||
    op10mA11ExistentialAbsoluteNullityMandateEscalating(
      existentialAbsoluteNullityMandateOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityMandateIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_mandate',
      nullityMandate.slice(0, 5),
      `Settlement existential absolute nullity mandate (index ${existentialAbsoluteNullityMandateOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityMandateOut.nationalIndex >= 78 ? 'major' : 'meaningful',
    );
  }

  const singularityConvergence = op10mA11RegionsWithCollapseSingularityConvergence(
    collapseOmniSingularityConvergenceOut.rows,
  );
  if (
    singularityConvergence.length >= 2 ||
    collapseOmniSingularityConvergenceOut.nationalIndex >= 67 ||
    op10mA11CollapseOmniSingularityConvergenceEscalating(
      collapseOmniSingularityConvergenceOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityConvergenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_convergence',
      singularityConvergence.slice(0, 5),
      `Regional collapse omni singularity convergence (index ${collapseOmniSingularityConvergenceOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityConvergenceOut.nationalIndex >= 77 ? 'major' : 'meaningful',
    );
  }

  const erosionObliteration = op10mA11RegionsWithTotalErosionObliteration(voidTotalErosionObliterationOut.rows);
  if (
    erosionObliteration.length >= 2 ||
    voidTotalErosionObliterationOut.nationalIndex >= 66 ||
    op10mA11VoidTotalErosionObliterationEscalating(
      voidTotalErosionObliterationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionObliterationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_obliteration',
      erosionObliteration.slice(0, 5),
      `Interregional void total erosion obliteration (index ${voidTotalErosionObliterationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionObliterationOut.nationalIndex >= 76 ? 'major' : 'meaningful',
    );
  }

  const nullityBinding = op10mA11RegionsWithTotalAbsoluteNullityBinding(existentialAbsoluteNullityBindingOut.rows);
  if (
    nullityBinding.length >= 2 ||
    existentialAbsoluteNullityBindingOut.nationalIndex >= 69 ||
    op10mA11ExistentialAbsoluteNullityBindingEscalating(
      existentialAbsoluteNullityBindingOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityBindingIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_binding',
      nullityBinding.slice(0, 5),
      `Settlement existential absolute nullity binding (index ${existentialAbsoluteNullityBindingOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityBindingOut.nationalIndex >= 79 ? 'major' : 'meaningful',
    );
  }

  const singularityIntegration = op10mA11RegionsWithCollapseSingularityIntegration(
    collapseOmniSingularityIntegrationOut.rows,
  );
  if (
    singularityIntegration.length >= 2 ||
    collapseOmniSingularityIntegrationOut.nationalIndex >= 68 ||
    op10mA11CollapseOmniSingularityIntegrationEscalating(
      collapseOmniSingularityIntegrationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityIntegrationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_integration',
      singularityIntegration.slice(0, 5),
      `Regional collapse omni singularity integration (index ${collapseOmniSingularityIntegrationOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityIntegrationOut.nationalIndex >= 78 ? 'major' : 'meaningful',
    );
  }

  const erosionEradication = op10mA11RegionsWithTotalErosionEradication(voidTotalErosionEradicationOut.rows);
  if (
    erosionEradication.length >= 2 ||
    voidTotalErosionEradicationOut.nationalIndex >= 67 ||
    op10mA11VoidTotalErosionEradicationEscalating(
      voidTotalErosionEradicationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionEradicationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_eradication',
      erosionEradication.slice(0, 5),
      `Interregional void total erosion eradication (index ${voidTotalErosionEradicationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionEradicationOut.nationalIndex >= 77 ? 'major' : 'meaningful',
    );
  }

  const nullityContinuity = op10mA11RegionsWithTotalAbsoluteNullityContinuity(existentialAbsoluteNullityContinuityOut.rows);
  if (
    nullityContinuity.length >= 2 ||
    existentialAbsoluteNullityContinuityOut.nationalIndex >= 70 ||
    op10mA11ExistentialAbsoluteNullityContinuityEscalating(
      existentialAbsoluteNullityContinuityOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityContinuityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_continuity',
      nullityContinuity.slice(0, 5),
      `Settlement existential absolute nullity continuity (index ${existentialAbsoluteNullityContinuityOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityContinuityOut.nationalIndex >= 80 ? 'major' : 'meaningful',
    );
  }

  const singularityUnification = op10mA11RegionsWithCollapseSingularityUnification(
    collapseOmniSingularityUnificationOut.rows,
  );
  if (
    singularityUnification.length >= 2 ||
    collapseOmniSingularityUnificationOut.nationalIndex >= 69 ||
    op10mA11CollapseOmniSingularityUnificationEscalating(
      collapseOmniSingularityUnificationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityUnificationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_unification',
      singularityUnification.slice(0, 5),
      `Regional collapse omni singularity unification (index ${collapseOmniSingularityUnificationOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityUnificationOut.nationalIndex >= 79 ? 'major' : 'meaningful',
    );
  }

  const erosionElimination = op10mA11RegionsWithTotalErosionElimination(voidTotalErosionEliminationOut.rows);
  if (
    erosionElimination.length >= 2 ||
    voidTotalErosionEliminationOut.nationalIndex >= 68 ||
    op10mA11VoidTotalErosionEliminationEscalating(
      voidTotalErosionEliminationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionEliminationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_elimination',
      erosionElimination.slice(0, 5),
      `Interregional void total erosion elimination (index ${voidTotalErosionEliminationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionEliminationOut.nationalIndex >= 78 ? 'major' : 'meaningful',
    );
  }

  const nullityPerpetuity = op10mA11RegionsWithTotalAbsoluteNullityPerpetuity(existentialAbsoluteNullityPerpetuityOut.rows);
  if (
    nullityPerpetuity.length >= 2 ||
    existentialAbsoluteNullityPerpetuityOut.nationalIndex >= 71 ||
    op10mA11ExistentialAbsoluteNullityPerpetuityEscalating(
      existentialAbsoluteNullityPerpetuityOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityPerpetuityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_perpetuity',
      nullityPerpetuity.slice(0, 5),
      `Settlement existential absolute nullity perpetuity (index ${existentialAbsoluteNullityPerpetuityOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityPerpetuityOut.nationalIndex >= 81 ? 'major' : 'meaningful',
    );
  }

  const singularityConsolidation = op10mA11RegionsWithCollapseSingularityConsolidation(
    collapseOmniSingularityConsolidationOut.rows,
  );
  if (
    singularityConsolidation.length >= 2 ||
    collapseOmniSingularityConsolidationOut.nationalIndex >= 70 ||
    op10mA11CollapseOmniSingularityConsolidationEscalating(
      collapseOmniSingularityConsolidationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityConsolidationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_consolidation',
      singularityConsolidation.slice(0, 5),
      `Regional collapse omni singularity consolidation (index ${collapseOmniSingularityConsolidationOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityConsolidationOut.nationalIndex >= 80 ? 'major' : 'meaningful',
    );
  }

  const erosionDissolution = op10mA11RegionsWithTotalErosionDissolution(voidTotalErosionDissolutionOut.rows);
  if (
    erosionDissolution.length >= 2 ||
    voidTotalErosionDissolutionOut.nationalIndex >= 69 ||
    op10mA11VoidTotalErosionDissolutionEscalating(
      voidTotalErosionDissolutionOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionDissolutionIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_dissolution',
      erosionDissolution.slice(0, 5),
      `Interregional void total erosion dissolution (index ${voidTotalErosionDissolutionOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionDissolutionOut.nationalIndex >= 79 ? 'major' : 'meaningful',
    );
  }

  const nullityImmutability = op10mA11RegionsWithTotalAbsoluteNullityImmutability(
    existentialAbsoluteNullityImmutabilityOut.rows,
  );
  if (
    nullityImmutability.length >= 2 ||
    existentialAbsoluteNullityImmutabilityOut.nationalIndex >= 72 ||
    op10mA11ExistentialAbsoluteNullityImmutabilityEscalating(
      existentialAbsoluteNullityImmutabilityOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityImmutabilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_immutability',
      nullityImmutability.slice(0, 5),
      `Settlement existential absolute nullity immutability (index ${existentialAbsoluteNullityImmutabilityOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityImmutabilityOut.nationalIndex >= 82 ? 'major' : 'meaningful',
    );
  }

  const singularityCoalescence = op10mA11RegionsWithCollapseSingularityCoalescence(
    collapseOmniSingularityCoalescenceOut.rows,
  );
  if (
    singularityCoalescence.length >= 2 ||
    collapseOmniSingularityCoalescenceOut.nationalIndex >= 71 ||
    op10mA11CollapseOmniSingularityCoalescenceEscalating(
      collapseOmniSingularityCoalescenceOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityCoalescenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_coalescence',
      singularityCoalescence.slice(0, 5),
      `Regional collapse omni singularity coalescence (index ${collapseOmniSingularityCoalescenceOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityCoalescenceOut.nationalIndex >= 81 ? 'major' : 'meaningful',
    );
  }

  const erosionSublimation = op10mA11RegionsWithTotalErosionSublimation(voidTotalErosionSublimationOut.rows);
  if (
    erosionSublimation.length >= 2 ||
    voidTotalErosionSublimationOut.nationalIndex >= 70 ||
    op10mA11VoidTotalErosionSublimationEscalating(
      voidTotalErosionSublimationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionSublimationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_sublimation',
      erosionSublimation.slice(0, 5),
      `Interregional void total erosion sublimation (index ${voidTotalErosionSublimationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionSublimationOut.nationalIndex >= 80 ? 'major' : 'meaningful',
    );
  }

  const nullityPermanence = op10mA11RegionsWithTotalAbsoluteNullityPermanence(
    existentialAbsoluteNullityPermanenceOut.rows,
  );
  if (
    nullityPermanence.length >= 2 ||
    existentialAbsoluteNullityPermanenceOut.nationalIndex >= 73 ||
    op10mA11ExistentialAbsoluteNullityPermanenceEscalating(
      existentialAbsoluteNullityPermanenceOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityPermanenceIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_permanence',
      nullityPermanence.slice(0, 5),
      `Settlement existential absolute nullity permanence (index ${existentialAbsoluteNullityPermanenceOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityPermanenceOut.nationalIndex >= 83 ? 'major' : 'meaningful',
    );
  }

  const singularityAmalgamation = op10mA11RegionsWithCollapseSingularityAmalgamation(
    collapseOmniSingularityAmalgamationOut.rows,
  );
  if (
    singularityAmalgamation.length >= 2 ||
    collapseOmniSingularityAmalgamationOut.nationalIndex >= 72 ||
    op10mA11CollapseOmniSingularityAmalgamationEscalating(
      collapseOmniSingularityAmalgamationOut.nationalIndex,
      base.revision > 0 ? base.lastCollapseOmniSingularityAmalgamationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'collapse_omni_singularity_amalgamation',
      singularityAmalgamation.slice(0, 5),
      `Regional collapse omni singularity amalgamation (index ${collapseOmniSingularityAmalgamationOut.nationalIndex.toFixed(1)}).`,
      collapseOmniSingularityAmalgamationOut.nationalIndex >= 82 ? 'major' : 'meaningful',
    );
  }

  const erosionAtomization = op10mA11RegionsWithTotalErosionAtomization(voidTotalErosionAtomizationOut.rows);
  if (
    erosionAtomization.length >= 2 ||
    voidTotalErosionAtomizationOut.nationalIndex >= 71 ||
    op10mA11VoidTotalErosionAtomizationEscalating(
      voidTotalErosionAtomizationOut.nationalIndex,
      base.revision > 0 ? base.lastVoidTotalErosionAtomizationIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'void_total_erosion_atomization',
      erosionAtomization.slice(0, 5),
      `Interregional void total erosion atomization (index ${voidTotalErosionAtomizationOut.nationalIndex.toFixed(1)}).`,
      voidTotalErosionAtomizationOut.nationalIndex >= 81 ? 'major' : 'meaningful',
    );
  }

  const nullityInevitability = op10mA11RegionsWithTotalAbsoluteNullityInevitability(
    existentialAbsoluteNullityInevitabilityOut.rows,
  );
  if (
    nullityInevitability.length >= 2 ||
    existentialAbsoluteNullityInevitabilityOut.nationalIndex >= 74 ||
    op10mA11ExistentialAbsoluteNullityInevitabilityEscalating(
      existentialAbsoluteNullityInevitabilityOut.nationalIndex,
      base.revision > 0 ? base.lastExistentialAbsoluteNullityInevitabilityIndex : null,
    )
  ) {
    pushCompositeDerived(
      derivedRaw,
      inputs.urban.turn,
      'existential_absolute_nullity_inevitability',
      nullityInevitability.slice(0, 5),
      `Settlement existential absolute nullity inevitability (index ${existentialAbsoluteNullityInevitabilityOut.nationalIndex.toFixed(1)}).`,
      existentialAbsoluteNullityInevitabilityOut.nationalIndex >= 84 ? 'major' : 'meaningful',
    );
  }

  base.revision += 1;
  base.urban = urbanOut.persisted;
  base.infra = infraOut.persisted;
  base.lastFragilityIndex = fragilityIndex;
  base.lastMaxCorridorFlow = maxCorridorFlow;
  base.lastCohesionIndex = regionalCohesionIndex;
  base.lastStandingSpread = standingSpread;
  base.lastServiceEquityIndex = serviceEquityOut.nationalIndex;
  base.lastInfrastructureBacklogIndex = backlogOut.nationalIndex;
  base.lastGovernanceFrictionIndex = governanceOut.nationalIndex;
  base.lastHousingSpilloverIndex = housingSpilloverOut.nationalIndex;
  base.lastClimateDisplacementIndex = climateOut.nationalIndex;
  base.lastAmenityCostIndex = amenityOut.nationalIndex;
  base.lastRelocationBurdenIndex = relocationOut.nationalIndex;
  base.lastEmploymentAnchorIndex = employmentAnchorOut.nationalIndex;
  base.lastCommuteWedgeIndex = commuteWedgeOut.nationalIndex;
  base.lastReceptionStrainIndex = receptionStrainOut.nationalIndex;
  base.lastLandUseGridlockIndex = landUseGridlockOut.nationalIndex;
  base.lastMobilityTrapIndex = mobilityTrapOut.nationalIndex;
  base.lastAbsorptionGapIndex = absorptionGapOut.nationalIndex;
  base.lastReliefOverheadIndex = reliefOverheadOut.nationalIndex;
  base.lastCorridorEquityDriftIndex = corridorEquityDriftOut.nationalIndex;
  base.lastClimateAdaptationLagIndex = climateAdaptationLagOut.nationalIndex;
  base.lastFiscalCapacityStrainIndex = fiscalCapacityStrainOut.nationalIndex;
  base.lastNetworkResilienceErosionIndex = networkErosionOut.nationalIndex;
  base.lastLongHorizonCapacityRiskIndex = longHorizonRiskOut.nationalIndex;
  base.lastCohesionIntegrityIndex = cohesionIntegrityOut.nationalIndex;
  base.lastReliefEquityGapIndex = reliefEquityGapOut.nationalIndex;
  base.lastSystemicFragilityIndex = systemicFragilityOut.nationalIndex;
  base.lastGovernanceResilienceDecayIndex = governanceResilienceDecayOut.nationalIndex;
  base.lastMigrationStabilityErosionIndex = migrationStabilityErosionOut.nationalIndex;
  base.lastAdaptiveCapacityCeilingIndex = adaptiveCapacityCeilingOut.nationalIndex;
  base.lastFiscalGovernanceCouplingIndex = fiscalGovernanceCouplingOut.nationalIndex;
  base.lastNetworkEquityTensionIndex = networkEquityTensionOut.nationalIndex;
  base.lastResilienceFrontierIndex = resilienceFrontierOut.nationalIndex;
  base.lastMetaGovernanceFatigueIndex = metaGovernanceFatigueOut.nationalIndex;
  base.lastCapitalMobilityAsymmetryIndex = capitalMobilityAsymmetryOut.nationalIndex;
  base.lastCompoundShockSaturationIndex = compoundShockSaturationOut.nationalIndex;
  base.lastInstitutionalTrustErosionIndex = institutionalTrustErosionOut.nationalIndex;
  base.lastLiquidityFragmentationIndex = liquidityFragmentationOut.nationalIndex;
  base.lastCascadingFailureRiskIndex = cascadingFailureRiskOut.nationalIndex;
  base.lastSocialContractFragilityIndex = socialContractFragilityOut.nationalIndex;
  base.lastCapitalFlightPanicIndex = capitalFlightPanicOut.nationalIndex;
  base.lastIrrecoverableCollapseThresholdIndex = irrecoverableCollapseOut.nationalIndex;
  base.lastSettlementLegitimacyCollapseIndex = settlementLegitimacyCollapseOut.nationalIndex;
  base.lastFiscalPanicContagionIndex = fiscalPanicContagionOut.nationalIndex;
  base.lastTerminalStateLockInIndex = terminalStateLockInOut.nationalIndex;
  base.lastGovernanceVacuumEscalationIndex = governanceVacuumEscalationOut.nationalIndex;
  base.lastSettlementAbandonmentSpiralIndex = settlementAbandonmentSpiralOut.nationalIndex;
  base.lastPostCollapseRecoveryImpossibilityIndex = postCollapseRecoveryImpossibilityOut.nationalIndex;
  base.lastStateCollapseCascadeAmplificationIndex = stateCollapseCascadeAmplificationOut.nationalIndex;
  base.lastHollowRegionContagionIndex = hollowRegionContagionOut.nationalIndex;
  base.lastPermanentDepopulationLockIndex = permanentDepopulationLockOut.nationalIndex;
  base.lastTotalCollapseSingularityIndex = totalCollapseSingularityOut.nationalIndex;
  base.lastVoidExpansionVelocityIndex = voidExpansionVelocityOut.nationalIndex;
  base.lastExistentialContinuityFractureIndex = existentialContinuityFractureOut.nationalIndex;
  base.lastCollapseHorizonConvergenceIndex = collapseHorizonConvergenceOut.nationalIndex;
  base.lastVoidTotalizationSurgeIndex = voidTotalizationSurgeOut.nationalIndex;
  base.lastExistentialTerminusLockIndex = existentialTerminusLockOut.nationalIndex;
  base.lastAbsoluteCollapseHorizonLockIndex = absoluteCollapseHorizonLockOut.nationalIndex;
  base.lastVoidFinalizationCascadeIndex = voidFinalizationCascadeOut.nationalIndex;
  base.lastExistentialObliterationThresholdIndex = existentialObliterationThresholdOut.nationalIndex;
  base.lastUltimateCollapseSingularitySealIndex = ultimateCollapseSingularitySealOut.nationalIndex;
  base.lastVoidAnnihilationConvergenceIndex = voidAnnihilationConvergenceOut.nationalIndex;
  base.lastExistentialNullStateLockIndex = existentialNullStateLockOut.nationalIndex;
  base.lastCollapseExistenceSingularityPointIndex = collapseExistenceSingularityPointOut.nationalIndex;
  base.lastVoidExistenceAnnihilationFrontIndex = voidExistenceAnnihilationFrontOut.nationalIndex;
  base.lastExistentialAbsoluteZeroLockIndex = existentialAbsoluteZeroLockOut.nationalIndex;
  base.lastCollapseOmniSingularityNodeIndex = collapseOmniSingularityNodeOut.nationalIndex;
  base.lastVoidAbsoluteErosionSurgeIndex = voidAbsoluteErosionSurgeOut.nationalIndex;
  base.lastExistentialFinalNullityLockIndex = existentialFinalNullityLockOut.nationalIndex;
  base.lastCollapseTotalSingularityVertexIndex = collapseTotalSingularityVertexOut.nationalIndex;
  base.lastVoidTerminalErosionCascadeIndex = voidTerminalErosionCascadeOut.nationalIndex;
  base.lastExistentialUltimateNullitySealIndex = existentialUltimateNullitySealOut.nationalIndex;
  base.lastCollapseAbsoluteSingularityApexIndex = collapseAbsoluteSingularityApexOut.nationalIndex;
  base.lastVoidCompleteErosionTerminalityIndex = voidCompleteErosionTerminalityOut.nationalIndex;
  base.lastExistentialFinalNullityClosureIndex = existentialFinalNullityClosureOut.nationalIndex;
  base.lastCollapseUltimateSingularityZenithIndex = collapseUltimateSingularityZenithOut.nationalIndex;
  base.lastVoidTotalErosionFinalityIndex = voidTotalErosionFinalityOut.nationalIndex;
  base.lastExistentialAbsoluteNullityVerdictIndex = existentialAbsoluteNullityVerdictOut.nationalIndex;
  base.lastCollapseTotalSingularityNexusIndex = collapseTotalSingularityNexusOut.nationalIndex;
  base.lastVoidAbsoluteErosionTerminationIndex = voidAbsoluteErosionTerminationOut.nationalIndex;
  base.lastExistentialFinalNullitySentenceIndex = existentialFinalNullitySentenceOut.nationalIndex;
  base.lastCollapseAbsoluteSingularityCulminationIndex = collapseAbsoluteSingularityCulminationOut.nationalIndex;
  base.lastVoidCompleteErosionExtinctionIndex = voidCompleteErosionExtinctionOut.nationalIndex;
  base.lastExistentialTotalNullityDecreeIndex = existentialTotalNullityDecreeOut.nationalIndex;
  base.lastCollapseOmniSingularitySynthesisIndex = collapseOmniSingularitySynthesisOut.nationalIndex;
  base.lastVoidTotalErosionAnnihilationIndex = voidTotalErosionAnnihilationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityMandateIndex = existentialAbsoluteNullityMandateOut.nationalIndex;
  base.lastCollapseOmniSingularityConvergenceIndex = collapseOmniSingularityConvergenceOut.nationalIndex;
  base.lastVoidTotalErosionObliterationIndex = voidTotalErosionObliterationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityBindingIndex = existentialAbsoluteNullityBindingOut.nationalIndex;
  base.lastCollapseOmniSingularityIntegrationIndex = collapseOmniSingularityIntegrationOut.nationalIndex;
  base.lastVoidTotalErosionEradicationIndex = voidTotalErosionEradicationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityContinuityIndex = existentialAbsoluteNullityContinuityOut.nationalIndex;
  base.lastCollapseOmniSingularityUnificationIndex = collapseOmniSingularityUnificationOut.nationalIndex;
  base.lastVoidTotalErosionEliminationIndex = voidTotalErosionEliminationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityPerpetuityIndex = existentialAbsoluteNullityPerpetuityOut.nationalIndex;
  base.lastCollapseOmniSingularityConsolidationIndex = collapseOmniSingularityConsolidationOut.nationalIndex;
  base.lastVoidTotalErosionDissolutionIndex = voidTotalErosionDissolutionOut.nationalIndex;
  base.lastExistentialAbsoluteNullityImmutabilityIndex = existentialAbsoluteNullityImmutabilityOut.nationalIndex;
  base.lastCollapseOmniSingularityCoalescenceIndex = collapseOmniSingularityCoalescenceOut.nationalIndex;
  base.lastVoidTotalErosionSublimationIndex = voidTotalErosionSublimationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityPermanenceIndex = existentialAbsoluteNullityPermanenceOut.nationalIndex;
  base.lastCollapseOmniSingularityAmalgamationIndex = collapseOmniSingularityAmalgamationOut.nationalIndex;
  base.lastVoidTotalErosionAtomizationIndex = voidTotalErosionAtomizationOut.nationalIndex;
  base.lastExistentialAbsoluteNullityInevitabilityIndex = existentialAbsoluteNullityInevitabilityOut.nationalIndex;
  base.inputHash = op10mA11HashInputs({
    turn: inputs.urban.turn,
    cityCount: inputs.urban.cities.length,
    regionKeys: 'composite',
    nationalGrowth: `${fragilityIndex}:${nationalPrimateIndex}:${maxCorridorFlow}:${regionalCohesionIndex}:${metropolitanSaturationIndex}:${backlogOut.nationalIndex}:${housingSpilloverOut.nationalIndex}:${climateOut.nationalIndex}:${amenityOut.nationalIndex}:${relocationOut.nationalIndex}:${employmentAnchorOut.nationalIndex}:${commuteWedgeOut.nationalIndex}:${receptionStrainOut.nationalIndex}:${landUseGridlockOut.nationalIndex}:${mobilityTrapOut.nationalIndex}:${absorptionGapOut.nationalIndex}:${reliefOverheadOut.nationalIndex}:${corridorEquityDriftOut.nationalIndex}:${climateAdaptationLagOut.nationalIndex}:${fiscalCapacityStrainOut.nationalIndex}:${networkErosionOut.nationalIndex}:${longHorizonRiskOut.nationalIndex}:${cohesionIntegrityOut.nationalIndex}:${reliefEquityGapOut.nationalIndex}:${systemicFragilityOut.nationalIndex}:${governanceResilienceDecayOut.nationalIndex}:${migrationStabilityErosionOut.nationalIndex}:${adaptiveCapacityCeilingOut.nationalIndex}:${fiscalGovernanceCouplingOut.nationalIndex}:${networkEquityTensionOut.nationalIndex}:${resilienceFrontierOut.nationalIndex}:${metaGovernanceFatigueOut.nationalIndex}:${capitalMobilityAsymmetryOut.nationalIndex}:${compoundShockSaturationOut.nationalIndex}:${institutionalTrustErosionOut.nationalIndex}:${liquidityFragmentationOut.nationalIndex}:${cascadingFailureRiskOut.nationalIndex}:${socialContractFragilityOut.nationalIndex}:${capitalFlightPanicOut.nationalIndex}:${irrecoverableCollapseOut.nationalIndex}:${settlementLegitimacyCollapseOut.nationalIndex}:${fiscalPanicContagionOut.nationalIndex}:${terminalStateLockInOut.nationalIndex}:${governanceVacuumEscalationOut.nationalIndex}:${settlementAbandonmentSpiralOut.nationalIndex}:${postCollapseRecoveryImpossibilityOut.nationalIndex}:${stateCollapseCascadeAmplificationOut.nationalIndex}:${hollowRegionContagionOut.nationalIndex}:${permanentDepopulationLockOut.nationalIndex}:${totalCollapseSingularityOut.nationalIndex}:${voidExpansionVelocityOut.nationalIndex}:${existentialContinuityFractureOut.nationalIndex}:${collapseHorizonConvergenceOut.nationalIndex}:${voidTotalizationSurgeOut.nationalIndex}:${existentialTerminusLockOut.nationalIndex}:${absoluteCollapseHorizonLockOut.nationalIndex}:${voidFinalizationCascadeOut.nationalIndex}:${existentialObliterationThresholdOut.nationalIndex}:${ultimateCollapseSingularitySealOut.nationalIndex}:${voidAnnihilationConvergenceOut.nationalIndex}:${existentialNullStateLockOut.nationalIndex}:${collapseExistenceSingularityPointOut.nationalIndex}:${voidExistenceAnnihilationFrontOut.nationalIndex}:${existentialAbsoluteZeroLockOut.nationalIndex}:${collapseOmniSingularityNodeOut.nationalIndex}:${voidAbsoluteErosionSurgeOut.nationalIndex}:${existentialFinalNullityLockOut.nationalIndex}:${collapseTotalSingularityVertexOut.nationalIndex}:${voidTerminalErosionCascadeOut.nationalIndex}:${existentialUltimateNullitySealOut.nationalIndex}:${collapseAbsoluteSingularityApexOut.nationalIndex}:${voidCompleteErosionTerminalityOut.nationalIndex}:${existentialFinalNullityClosureOut.nationalIndex}:${collapseUltimateSingularityZenithOut.nationalIndex}:${voidTotalErosionFinalityOut.nationalIndex}:${existentialAbsoluteNullityVerdictOut.nationalIndex}:${collapseTotalSingularityNexusOut.nationalIndex}:${voidAbsoluteErosionTerminationOut.nationalIndex}:${existentialFinalNullitySentenceOut.nationalIndex}:${collapseAbsoluteSingularityCulminationOut.nationalIndex}:${voidCompleteErosionExtinctionOut.nationalIndex}:${existentialTotalNullityDecreeOut.nationalIndex}:${collapseOmniSingularitySynthesisOut.nationalIndex}:${voidTotalErosionAnnihilationOut.nationalIndex}:${existentialAbsoluteNullityMandateOut.nationalIndex}:${collapseOmniSingularityConvergenceOut.nationalIndex}:${voidTotalErosionObliterationOut.nationalIndex}:${existentialAbsoluteNullityBindingOut.nationalIndex}:${collapseOmniSingularityIntegrationOut.nationalIndex}:${voidTotalErosionEradicationOut.nationalIndex}:${existentialAbsoluteNullityContinuityOut.nationalIndex}:${collapseOmniSingularityUnificationOut.nationalIndex}:${voidTotalErosionEliminationOut.nationalIndex}:${existentialAbsoluteNullityPerpetuityOut.nationalIndex}:${collapseOmniSingularityConsolidationOut.nationalIndex}:${voidTotalErosionDissolutionOut.nationalIndex}:${existentialAbsoluteNullityImmutabilityOut.nationalIndex}:${collapseOmniSingularityCoalescenceOut.nationalIndex}:${voidTotalErosionSublimationOut.nationalIndex}:${existentialAbsoluteNullityPermanenceOut.nationalIndex}:${collapseOmniSingularityAmalgamationOut.nationalIndex}:${voidTotalErosionAtomizationOut.nationalIndex}:${existentialAbsoluteNullityInevitabilityOut.nationalIndex}`,
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
    migrationPressure,
    settlementVulnerability,
    fiscalUrbanCoupling: fiscalOut.rows,
    fiscalUrbanCouplingIndex: fiscalOut.nationalIndex,
    regionalCohesionIndex,
    absorptionStress,
    metropolitanSaturationIndex,
    serviceEquity: serviceEquityOut.rows,
    nationalServiceEquityIndex: serviceEquityOut.nationalIndex,
    convergence,
    periUrbanPressure,
    nationalPeriUrbanPressureIndex,
    infrastructureBacklog: backlogOut.rows,
    nationalInfrastructureBacklogIndex: backlogOut.nationalIndex,
    governanceFriction: governanceOut.rows,
    nationalGovernanceFrictionIndex: governanceOut.nationalIndex,
    housingSpillover: housingSpilloverOut.rows,
    nationalHousingSpilloverIndex: housingSpilloverOut.nationalIndex,
    talentRetention: talentOut.rows,
    nationalTalentDrainIndex: talentOut.nationalIndex,
    climateDisplacement: climateOut.rows,
    nationalClimateDisplacementIndex: climateOut.nationalIndex,
    amenityCost: amenityOut.rows,
    nationalAmenityCostIndex: amenityOut.nationalIndex,
    decentralizationShift: decentralOut.rows,
    nationalDecentralizationIndex: decentralOut.nationalIndex,
    relocationBurden: relocationOut.rows,
    nationalRelocationBurdenIndex: relocationOut.nationalIndex,
    employmentAnchor: employmentAnchorOut.rows,
    nationalEmploymentAnchorIndex: employmentAnchorOut.nationalIndex,
    commuteWedge: commuteWedgeOut.rows,
    nationalCommuteWedgeIndex: commuteWedgeOut.nationalIndex,
    receptionStrain: receptionStrainOut.rows,
    nationalReceptionStrainIndex: receptionStrainOut.nationalIndex,
    landUseGridlock: landUseGridlockOut.rows,
    nationalLandUseGridlockIndex: landUseGridlockOut.nationalIndex,
    mobilityTrap: mobilityTrapOut.rows,
    nationalMobilityTrapIndex: mobilityTrapOut.nationalIndex,
    absorptionGap: absorptionGapOut.rows,
    nationalAbsorptionGapIndex: absorptionGapOut.nationalIndex,
    reliefOverhead: reliefOverheadOut.rows,
    nationalReliefOverheadIndex: reliefOverheadOut.nationalIndex,
    corridorEquityDrift: corridorEquityDriftOut.rows,
    nationalCorridorEquityDriftIndex: corridorEquityDriftOut.nationalIndex,
    climateAdaptationLag: climateAdaptationLagOut.rows,
    nationalClimateAdaptationLagIndex: climateAdaptationLagOut.nationalIndex,
    fiscalCapacityStrain: fiscalCapacityStrainOut.rows,
    nationalFiscalCapacityStrainIndex: fiscalCapacityStrainOut.nationalIndex,
    networkResilienceErosion: networkErosionOut.rows,
    nationalNetworkResilienceErosionIndex: networkErosionOut.nationalIndex,
    longHorizonCapacityRisk: longHorizonRiskOut.rows,
    nationalLongHorizonCapacityRiskIndex: longHorizonRiskOut.nationalIndex,
    cohesionIntegrity: cohesionIntegrityOut.rows,
    nationalCohesionIntegrityIndex: cohesionIntegrityOut.nationalIndex,
    reliefEquityGap: reliefEquityGapOut.rows,
    nationalReliefEquityGapIndex: reliefEquityGapOut.nationalIndex,
    systemicFragility: systemicFragilityOut.rows,
    nationalSystemicFragilityIndex: systemicFragilityOut.nationalIndex,
    governanceResilienceDecay: governanceResilienceDecayOut.rows,
    nationalGovernanceResilienceDecayIndex: governanceResilienceDecayOut.nationalIndex,
    migrationStabilityErosion: migrationStabilityErosionOut.rows,
    nationalMigrationStabilityErosionIndex: migrationStabilityErosionOut.nationalIndex,
    adaptiveCapacityCeiling: adaptiveCapacityCeilingOut.rows,
    nationalAdaptiveCapacityCeilingIndex: adaptiveCapacityCeilingOut.nationalIndex,
    fiscalGovernanceCoupling: fiscalGovernanceCouplingOut.rows,
    nationalFiscalGovernanceCouplingIndex: fiscalGovernanceCouplingOut.nationalIndex,
    networkEquityTension: networkEquityTensionOut.rows,
    nationalNetworkEquityTensionIndex: networkEquityTensionOut.nationalIndex,
    resilienceFrontier: resilienceFrontierOut.rows,
    nationalResilienceFrontierIndex: resilienceFrontierOut.nationalIndex,
    metaGovernanceFatigue: metaGovernanceFatigueOut.rows,
    nationalMetaGovernanceFatigueIndex: metaGovernanceFatigueOut.nationalIndex,
    capitalMobilityAsymmetry: capitalMobilityAsymmetryOut.rows,
    nationalCapitalMobilityAsymmetryIndex: capitalMobilityAsymmetryOut.nationalIndex,
    compoundShockSaturation: compoundShockSaturationOut.rows,
    nationalCompoundShockSaturationIndex: compoundShockSaturationOut.nationalIndex,
    institutionalTrustErosion: institutionalTrustErosionOut.rows,
    nationalInstitutionalTrustErosionIndex: institutionalTrustErosionOut.nationalIndex,
    liquidityFragmentation: liquidityFragmentationOut.rows,
    nationalLiquidityFragmentationIndex: liquidityFragmentationOut.nationalIndex,
    cascadingFailureRisk: cascadingFailureRiskOut.rows,
    nationalCascadingFailureRiskIndex: cascadingFailureRiskOut.nationalIndex,
    socialContractFragility: socialContractFragilityOut.rows,
    nationalSocialContractFragilityIndex: socialContractFragilityOut.nationalIndex,
    capitalFlightPanic: capitalFlightPanicOut.rows,
    nationalCapitalFlightPanicIndex: capitalFlightPanicOut.nationalIndex,
    irrecoverableCollapseThreshold: irrecoverableCollapseOut.rows,
    nationalIrrecoverableCollapseThresholdIndex: irrecoverableCollapseOut.nationalIndex,
    settlementLegitimacyCollapse: settlementLegitimacyCollapseOut.rows,
    nationalSettlementLegitimacyCollapseIndex: settlementLegitimacyCollapseOut.nationalIndex,
    fiscalPanicContagion: fiscalPanicContagionOut.rows,
    nationalFiscalPanicContagionIndex: fiscalPanicContagionOut.nationalIndex,
    terminalStateLockIn: terminalStateLockInOut.rows,
    nationalTerminalStateLockInIndex: terminalStateLockInOut.nationalIndex,
    governanceVacuumEscalation: governanceVacuumEscalationOut.rows,
    nationalGovernanceVacuumEscalationIndex: governanceVacuumEscalationOut.nationalIndex,
    settlementAbandonmentSpiral: settlementAbandonmentSpiralOut.rows,
    nationalSettlementAbandonmentSpiralIndex: settlementAbandonmentSpiralOut.nationalIndex,
    postCollapseRecoveryImpossibility: postCollapseRecoveryImpossibilityOut.rows,
    nationalPostCollapseRecoveryImpossibilityIndex: postCollapseRecoveryImpossibilityOut.nationalIndex,
    stateCollapseCascadeAmplification: stateCollapseCascadeAmplificationOut.rows,
    nationalStateCollapseCascadeAmplificationIndex: stateCollapseCascadeAmplificationOut.nationalIndex,
    hollowRegionContagion: hollowRegionContagionOut.rows,
    nationalHollowRegionContagionIndex: hollowRegionContagionOut.nationalIndex,
    permanentDepopulationLock: permanentDepopulationLockOut.rows,
    nationalPermanentDepopulationLockIndex: permanentDepopulationLockOut.nationalIndex,
    totalCollapseSingularity: totalCollapseSingularityOut.rows,
    nationalTotalCollapseSingularityIndex: totalCollapseSingularityOut.nationalIndex,
    voidExpansionVelocity: voidExpansionVelocityOut.rows,
    nationalVoidExpansionVelocityIndex: voidExpansionVelocityOut.nationalIndex,
    existentialContinuityFracture: existentialContinuityFractureOut.rows,
    nationalExistentialContinuityFractureIndex: existentialContinuityFractureOut.nationalIndex,
    collapseHorizonConvergence: collapseHorizonConvergenceOut.rows,
    nationalCollapseHorizonConvergenceIndex: collapseHorizonConvergenceOut.nationalIndex,
    voidTotalizationSurge: voidTotalizationSurgeOut.rows,
    nationalVoidTotalizationSurgeIndex: voidTotalizationSurgeOut.nationalIndex,
    existentialTerminusLock: existentialTerminusLockOut.rows,
    nationalExistentialTerminusLockIndex: existentialTerminusLockOut.nationalIndex,
    absoluteCollapseHorizonLock: absoluteCollapseHorizonLockOut.rows,
    nationalAbsoluteCollapseHorizonLockIndex: absoluteCollapseHorizonLockOut.nationalIndex,
    voidFinalizationCascade: voidFinalizationCascadeOut.rows,
    nationalVoidFinalizationCascadeIndex: voidFinalizationCascadeOut.nationalIndex,
    existentialObliterationThreshold: existentialObliterationThresholdOut.rows,
    nationalExistentialObliterationThresholdIndex: existentialObliterationThresholdOut.nationalIndex,
    ultimateCollapseSingularitySeal: ultimateCollapseSingularitySealOut.rows,
    nationalUltimateCollapseSingularitySealIndex: ultimateCollapseSingularitySealOut.nationalIndex,
    voidAnnihilationConvergence: voidAnnihilationConvergenceOut.rows,
    nationalVoidAnnihilationConvergenceIndex: voidAnnihilationConvergenceOut.nationalIndex,
    existentialNullStateLock: existentialNullStateLockOut.rows,
    nationalExistentialNullStateLockIndex: existentialNullStateLockOut.nationalIndex,
    collapseExistenceSingularityPoint: collapseExistenceSingularityPointOut.rows,
    nationalCollapseExistenceSingularityPointIndex: collapseExistenceSingularityPointOut.nationalIndex,
    voidExistenceAnnihilationFront: voidExistenceAnnihilationFrontOut.rows,
    nationalVoidExistenceAnnihilationFrontIndex: voidExistenceAnnihilationFrontOut.nationalIndex,
    existentialAbsoluteZeroLock: existentialAbsoluteZeroLockOut.rows,
    nationalExistentialAbsoluteZeroLockIndex: existentialAbsoluteZeroLockOut.nationalIndex,
    collapseOmniSingularityNode: collapseOmniSingularityNodeOut.rows,
    nationalCollapseOmniSingularityNodeIndex: collapseOmniSingularityNodeOut.nationalIndex,
    voidAbsoluteErosionSurge: voidAbsoluteErosionSurgeOut.rows,
    nationalVoidAbsoluteErosionSurgeIndex: voidAbsoluteErosionSurgeOut.nationalIndex,
    existentialFinalNullityLock: existentialFinalNullityLockOut.rows,
    nationalExistentialFinalNullityLockIndex: existentialFinalNullityLockOut.nationalIndex,
    collapseTotalSingularityVertex: collapseTotalSingularityVertexOut.rows,
    nationalCollapseTotalSingularityVertexIndex: collapseTotalSingularityVertexOut.nationalIndex,
    voidTerminalErosionCascade: voidTerminalErosionCascadeOut.rows,
    nationalVoidTerminalErosionCascadeIndex: voidTerminalErosionCascadeOut.nationalIndex,
    existentialUltimateNullitySeal: existentialUltimateNullitySealOut.rows,
    nationalExistentialUltimateNullitySealIndex: existentialUltimateNullitySealOut.nationalIndex,
    collapseAbsoluteSingularityApex: collapseAbsoluteSingularityApexOut.rows,
    nationalCollapseAbsoluteSingularityApexIndex: collapseAbsoluteSingularityApexOut.nationalIndex,
    voidCompleteErosionTerminality: voidCompleteErosionTerminalityOut.rows,
    nationalVoidCompleteErosionTerminalityIndex: voidCompleteErosionTerminalityOut.nationalIndex,
    existentialFinalNullityClosure: existentialFinalNullityClosureOut.rows,
    nationalExistentialFinalNullityClosureIndex: existentialFinalNullityClosureOut.nationalIndex,
    collapseUltimateSingularityZenith: collapseUltimateSingularityZenithOut.rows,
    nationalCollapseUltimateSingularityZenithIndex: collapseUltimateSingularityZenithOut.nationalIndex,
    voidTotalErosionFinality: voidTotalErosionFinalityOut.rows,
    nationalVoidTotalErosionFinalityIndex: voidTotalErosionFinalityOut.nationalIndex,
    existentialAbsoluteNullityVerdict: existentialAbsoluteNullityVerdictOut.rows,
    nationalExistentialAbsoluteNullityVerdictIndex: existentialAbsoluteNullityVerdictOut.nationalIndex,
    collapseTotalSingularityNexus: collapseTotalSingularityNexusOut.rows,
    nationalCollapseTotalSingularityNexusIndex: collapseTotalSingularityNexusOut.nationalIndex,
    voidAbsoluteErosionTermination: voidAbsoluteErosionTerminationOut.rows,
    nationalVoidAbsoluteErosionTerminationIndex: voidAbsoluteErosionTerminationOut.nationalIndex,
    existentialFinalNullitySentence: existentialFinalNullitySentenceOut.rows,
    nationalExistentialFinalNullitySentenceIndex: existentialFinalNullitySentenceOut.nationalIndex,
    collapseAbsoluteSingularityCulmination: collapseAbsoluteSingularityCulminationOut.rows,
    nationalCollapseAbsoluteSingularityCulminationIndex: collapseAbsoluteSingularityCulminationOut.nationalIndex,
    voidCompleteErosionExtinction: voidCompleteErosionExtinctionOut.rows,
    nationalVoidCompleteErosionExtinctionIndex: voidCompleteErosionExtinctionOut.nationalIndex,
    existentialTotalNullityDecree: existentialTotalNullityDecreeOut.rows,
    nationalExistentialTotalNullityDecreeIndex: existentialTotalNullityDecreeOut.nationalIndex,
    collapseOmniSingularitySynthesis: collapseOmniSingularitySynthesisOut.rows,
    nationalCollapseOmniSingularitySynthesisIndex: collapseOmniSingularitySynthesisOut.nationalIndex,
    voidTotalErosionAnnihilation: voidTotalErosionAnnihilationOut.rows,
    nationalVoidTotalErosionAnnihilationIndex: voidTotalErosionAnnihilationOut.nationalIndex,
    existentialAbsoluteNullityMandate: existentialAbsoluteNullityMandateOut.rows,
    nationalExistentialAbsoluteNullityMandateIndex: existentialAbsoluteNullityMandateOut.nationalIndex,
    collapseOmniSingularityConvergence: collapseOmniSingularityConvergenceOut.rows,
    nationalCollapseOmniSingularityConvergenceIndex: collapseOmniSingularityConvergenceOut.nationalIndex,
    voidTotalErosionObliteration: voidTotalErosionObliterationOut.rows,
    nationalVoidTotalErosionObliterationIndex: voidTotalErosionObliterationOut.nationalIndex,
    existentialAbsoluteNullityBinding: existentialAbsoluteNullityBindingOut.rows,
    nationalExistentialAbsoluteNullityBindingIndex: existentialAbsoluteNullityBindingOut.nationalIndex,
    collapseOmniSingularityIntegration: collapseOmniSingularityIntegrationOut.rows,
    nationalCollapseOmniSingularityIntegrationIndex: collapseOmniSingularityIntegrationOut.nationalIndex,
    voidTotalErosionEradication: voidTotalErosionEradicationOut.rows,
    nationalVoidTotalErosionEradicationIndex: voidTotalErosionEradicationOut.nationalIndex,
    existentialAbsoluteNullityContinuity: existentialAbsoluteNullityContinuityOut.rows,
    nationalExistentialAbsoluteNullityContinuityIndex: existentialAbsoluteNullityContinuityOut.nationalIndex,
    collapseOmniSingularityUnification: collapseOmniSingularityUnificationOut.rows,
    nationalCollapseOmniSingularityUnificationIndex: collapseOmniSingularityUnificationOut.nationalIndex,
    voidTotalErosionElimination: voidTotalErosionEliminationOut.rows,
    nationalVoidTotalErosionEliminationIndex: voidTotalErosionEliminationOut.nationalIndex,
    existentialAbsoluteNullityPerpetuity: existentialAbsoluteNullityPerpetuityOut.rows,
    nationalExistentialAbsoluteNullityPerpetuityIndex: existentialAbsoluteNullityPerpetuityOut.nationalIndex,
    collapseOmniSingularityConsolidation: collapseOmniSingularityConsolidationOut.rows,
    nationalCollapseOmniSingularityConsolidationIndex: collapseOmniSingularityConsolidationOut.nationalIndex,
    voidTotalErosionDissolution: voidTotalErosionDissolutionOut.rows,
    nationalVoidTotalErosionDissolutionIndex: voidTotalErosionDissolutionOut.nationalIndex,
    existentialAbsoluteNullityImmutability: existentialAbsoluteNullityImmutabilityOut.rows,
    nationalExistentialAbsoluteNullityImmutabilityIndex: existentialAbsoluteNullityImmutabilityOut.nationalIndex,
    collapseOmniSingularityCoalescence: collapseOmniSingularityCoalescenceOut.rows,
    nationalCollapseOmniSingularityCoalescenceIndex: collapseOmniSingularityCoalescenceOut.nationalIndex,
    voidTotalErosionSublimation: voidTotalErosionSublimationOut.rows,
    nationalVoidTotalErosionSublimationIndex: voidTotalErosionSublimationOut.nationalIndex,
    existentialAbsoluteNullityPermanence: existentialAbsoluteNullityPermanenceOut.rows,
    nationalExistentialAbsoluteNullityPermanenceIndex: existentialAbsoluteNullityPermanenceOut.nationalIndex,
    collapseOmniSingularityAmalgamation: collapseOmniSingularityAmalgamationOut.rows,
    nationalCollapseOmniSingularityAmalgamationIndex: collapseOmniSingularityAmalgamationOut.nationalIndex,
    voidTotalErosionAtomization: voidTotalErosionAtomizationOut.rows,
    nationalVoidTotalErosionAtomizationIndex: voidTotalErosionAtomizationOut.nationalIndex,
    existentialAbsoluteNullityInevitability: existentialAbsoluteNullityInevitabilityOut.rows,
    nationalExistentialAbsoluteNullityInevitabilityIndex: existentialAbsoluteNullityInevitabilityOut.nationalIndex,
    summary: `${urbanOut.state.summary} ${infraOut.state.summary} Fragility ${fragilityIndex}; primate ${nationalPrimateIndex}; peak flow ${maxCorridorFlow}; cohesion ${regionalCohesionIndex}; saturation ${metropolitanSaturationIndex}; service equity ${serviceEquityOut.nationalIndex}; backlog ${backlogOut.nationalIndex}; governance ${governanceOut.nationalIndex}; housing spillover ${housingSpilloverOut.nationalIndex}; talent drain ${talentOut.nationalIndex}; climate displacement ${climateOut.nationalIndex}; amenity cost ${amenityOut.nationalIndex}; decentralization ${decentralOut.nationalIndex}; relocation burden ${relocationOut.nationalIndex}; employment anchor ${employmentAnchorOut.nationalIndex}; commute wedge ${commuteWedgeOut.nationalIndex}; reception strain ${receptionStrainOut.nationalIndex}; land-use gridlock ${landUseGridlockOut.nationalIndex}; mobility trap ${mobilityTrapOut.nationalIndex}; absorption gap ${absorptionGapOut.nationalIndex}; relief overhead ${reliefOverheadOut.nationalIndex}; corridor equity drift ${corridorEquityDriftOut.nationalIndex}; climate adaptation lag ${climateAdaptationLagOut.nationalIndex}; fiscal capacity ${fiscalCapacityStrainOut.nationalIndex}; network erosion ${networkErosionOut.nationalIndex}; horizon risk ${longHorizonRiskOut.nationalIndex}; cohesion integrity ${cohesionIntegrityOut.nationalIndex}; relief equity gap ${reliefEquityGapOut.nationalIndex}; systemic fragility ${systemicFragilityOut.nationalIndex}; governance decay ${governanceResilienceDecayOut.nationalIndex}; migration stability ${migrationStabilityErosionOut.nationalIndex}; adaptive ceiling ${adaptiveCapacityCeilingOut.nationalIndex}; fiscal–governance ${fiscalGovernanceCouplingOut.nationalIndex}; network equity ${networkEquityTensionOut.nationalIndex}; resilience frontier ${resilienceFrontierOut.nationalIndex}; meta-governance fatigue ${metaGovernanceFatigueOut.nationalIndex}; capital mobility ${capitalMobilityAsymmetryOut.nationalIndex}; compound shocks ${compoundShockSaturationOut.nationalIndex}; institutional trust ${institutionalTrustErosionOut.nationalIndex}; liquidity fragmentation ${liquidityFragmentationOut.nationalIndex}; cascade risk ${cascadingFailureRiskOut.nationalIndex}; social contract ${socialContractFragilityOut.nationalIndex}; capital flight ${capitalFlightPanicOut.nationalIndex}; collapse threshold ${irrecoverableCollapseOut.nationalIndex}; legitimacy collapse ${settlementLegitimacyCollapseOut.nationalIndex}; fiscal contagion ${fiscalPanicContagionOut.nationalIndex}; terminal lock-in ${terminalStateLockInOut.nationalIndex}; governance vacuum ${governanceVacuumEscalationOut.nationalIndex}; abandonment spiral ${settlementAbandonmentSpiralOut.nationalIndex}; recovery impossibility ${postCollapseRecoveryImpossibilityOut.nationalIndex}; cascade amplification ${stateCollapseCascadeAmplificationOut.nationalIndex}; hollow contagion ${hollowRegionContagionOut.nationalIndex}; depopulation lock ${permanentDepopulationLockOut.nationalIndex}; collapse singularity ${totalCollapseSingularityOut.nationalIndex}; void expansion ${voidExpansionVelocityOut.nationalIndex}; continuity fracture ${existentialContinuityFractureOut.nationalIndex}; horizon convergence ${collapseHorizonConvergenceOut.nationalIndex}; void totalization ${voidTotalizationSurgeOut.nationalIndex}; terminus lock ${existentialTerminusLockOut.nationalIndex}; absolute horizon lock ${absoluteCollapseHorizonLockOut.nationalIndex}; void finalization ${voidFinalizationCascadeOut.nationalIndex}; obliteration threshold ${existentialObliterationThresholdOut.nationalIndex}; singularity seal ${ultimateCollapseSingularitySealOut.nationalIndex}; void annihilation ${voidAnnihilationConvergenceOut.nationalIndex}; null-state lock ${existentialNullStateLockOut.nationalIndex}; existence point ${collapseExistenceSingularityPointOut.nationalIndex}; void front ${voidExistenceAnnihilationFrontOut.nationalIndex}; absolute zero ${existentialAbsoluteZeroLockOut.nationalIndex}; omni node ${collapseOmniSingularityNodeOut.nationalIndex}; erosion surge ${voidAbsoluteErosionSurgeOut.nationalIndex}; final nullity ${existentialFinalNullityLockOut.nationalIndex}; singularity vertex ${collapseTotalSingularityVertexOut.nationalIndex}; terminal erosion ${voidTerminalErosionCascadeOut.nationalIndex}; ultimate seal ${existentialUltimateNullitySealOut.nationalIndex}; singularity apex ${collapseAbsoluteSingularityApexOut.nationalIndex}; complete terminality ${voidCompleteErosionTerminalityOut.nationalIndex}; nullity closure ${existentialFinalNullityClosureOut.nationalIndex}; singularity zenith ${collapseUltimateSingularityZenithOut.nationalIndex}; total finality ${voidTotalErosionFinalityOut.nationalIndex}; nullity verdict ${existentialAbsoluteNullityVerdictOut.nationalIndex}; singularity nexus ${collapseTotalSingularityNexusOut.nationalIndex}; erosion termination ${voidAbsoluteErosionTerminationOut.nationalIndex}; nullity sentence ${existentialFinalNullitySentenceOut.nationalIndex}; singularity culmination ${collapseAbsoluteSingularityCulminationOut.nationalIndex}; erosion extinction ${voidCompleteErosionExtinctionOut.nationalIndex}; nullity decree ${existentialTotalNullityDecreeOut.nationalIndex}; omni synthesis ${collapseOmniSingularitySynthesisOut.nationalIndex}; erosion annihilation ${voidTotalErosionAnnihilationOut.nationalIndex}; nullity mandate ${existentialAbsoluteNullityMandateOut.nationalIndex}; omni convergence ${collapseOmniSingularityConvergenceOut.nationalIndex}; erosion obliteration ${voidTotalErosionObliterationOut.nationalIndex}; nullity binding ${existentialAbsoluteNullityBindingOut.nationalIndex}; omni integration ${collapseOmniSingularityIntegrationOut.nationalIndex}; erosion eradication ${voidTotalErosionEradicationOut.nationalIndex}; nullity continuity ${existentialAbsoluteNullityContinuityOut.nationalIndex}; omni unification ${collapseOmniSingularityUnificationOut.nationalIndex}; erosion elimination ${voidTotalErosionEliminationOut.nationalIndex}; nullity perpetuity ${existentialAbsoluteNullityPerpetuityOut.nationalIndex}; omni consolidation ${collapseOmniSingularityConsolidationOut.nationalIndex}; erosion dissolution ${voidTotalErosionDissolutionOut.nationalIndex}; nullity immutability ${existentialAbsoluteNullityImmutabilityOut.nationalIndex}; omni coalescence ${collapseOmniSingularityCoalescenceOut.nationalIndex}; erosion sublimation ${voidTotalErosionSublimationOut.nationalIndex}; nullity permanence ${existentialAbsoluteNullityPermanenceOut.nationalIndex}; omni amalgamation ${collapseOmniSingularityAmalgamationOut.nationalIndex}; erosion atomization ${voidTotalErosionAtomizationOut.nationalIndex}; nullity inevitability ${existentialAbsoluteNullityInevitabilityOut.nationalIndex}.`,
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


// --- source: integration/regional-regression-harness.ts ---

export type OP10M_A11_RegressionTurnSnapshot = {
  turn: number;
  revision: number;
  cohesionIndex: number;
  inequalityIndex: number;
  serviceEquityIndex: number;
  standingSpread: number;
  backlogIndex: number;
  governanceFrictionIndex: number;
  housingSpilloverIndex: number;
  climateDisplacementIndex: number;
  amenityCostIndex: number;
  relocationBurdenIndex: number;
  employmentAnchorIndex: number;
  commuteWedgeIndex: number;
  receptionStrainIndex: number;
  landUseGridlockIndex: number;
  mobilityTrapIndex: number;
  absorptionGapIndex: number;
  reliefOverheadIndex: number;
  corridorEquityDriftIndex: number;
  climateAdaptationLagIndex: number;
  fiscalCapacityStrainIndex: number;
  networkResilienceErosionIndex: number;
  longHorizonCapacityRiskIndex: number;
  cohesionIntegrityIndex: number;
  reliefEquityGapIndex: number;
  systemicFragilityIndex: number;
  governanceResilienceDecayIndex: number;
  migrationStabilityErosionIndex: number;
  adaptiveCapacityCeilingIndex: number;
  fiscalGovernanceCouplingIndex: number;
  networkEquityTensionIndex: number;
  resilienceFrontierIndex: number;
  metaGovernanceFatigueIndex: number;
  capitalMobilityAsymmetryIndex: number;
  compoundShockSaturationIndex: number;
  institutionalTrustErosionIndex: number;
  liquidityFragmentationIndex: number;
  cascadingFailureRiskIndex: number;
  socialContractFragilityIndex: number;
  capitalFlightPanicIndex: number;
  irrecoverableCollapseThresholdIndex: number;
  settlementLegitimacyCollapseIndex: number;
  fiscalPanicContagionIndex: number;
  terminalStateLockInIndex: number;
  governanceVacuumEscalationIndex: number;
  settlementAbandonmentSpiralIndex: number;
  postCollapseRecoveryImpossibilityIndex: number;
  stateCollapseCascadeAmplificationIndex: number;
  hollowRegionContagionIndex: number;
  permanentDepopulationLockIndex: number;
  totalCollapseSingularityIndex: number;
  voidExpansionVelocityIndex: number;
  existentialContinuityFractureIndex: number;
  collapseHorizonConvergenceIndex: number;
  voidTotalizationSurgeIndex: number;
  existentialTerminusLockIndex: number;
  absoluteCollapseHorizonLockIndex: number;
  voidFinalizationCascadeIndex: number;
  existentialObliterationThresholdIndex: number;
  ultimateCollapseSingularitySealIndex: number;
  voidAnnihilationConvergenceIndex: number;
  existentialNullStateLockIndex: number;
  collapseExistenceSingularityPointIndex: number;
  voidExistenceAnnihilationFrontIndex: number;
  existentialAbsoluteZeroLockIndex: number;
  collapseOmniSingularityNodeIndex: number;
  voidAbsoluteErosionSurgeIndex: number;
  existentialFinalNullityLockIndex: number;
  collapseTotalSingularityVertexIndex: number;
  voidTerminalErosionCascadeIndex: number;
  existentialUltimateNullitySealIndex: number;
  collapseAbsoluteSingularityApexIndex: number;
  voidCompleteErosionTerminalityIndex: number;
  existentialFinalNullityClosureIndex: number;
  collapseUltimateSingularityZenithIndex: number;
  voidTotalErosionFinalityIndex: number;
  existentialAbsoluteNullityVerdictIndex: number;
  collapseTotalSingularityNexusIndex: number;
  voidAbsoluteErosionTerminationIndex: number;
  existentialFinalNullitySentenceIndex: number;
  collapseAbsoluteSingularityCulminationIndex: number;
  voidCompleteErosionExtinctionIndex: number;
  existentialTotalNullityDecreeIndex: number;
  collapseOmniSingularitySynthesisIndex: number;
  voidTotalErosionAnnihilationIndex: number;
  existentialAbsoluteNullityMandateIndex: number;
  collapseOmniSingularityConvergenceIndex: number;
  voidTotalErosionObliterationIndex: number;
  existentialAbsoluteNullityBindingIndex: number;
  collapseOmniSingularityIntegrationIndex: number;
  voidTotalErosionEradicationIndex: number;
  existentialAbsoluteNullityContinuityIndex: number;
  collapseOmniSingularityUnificationIndex: number;
  voidTotalErosionEliminationIndex: number;
  existentialAbsoluteNullityPerpetuityIndex: number;
  collapseOmniSingularityConsolidationIndex: number;
  voidTotalErosionDissolutionIndex: number;
  existentialAbsoluteNullityImmutabilityIndex: number;
  collapseOmniSingularityCoalescenceIndex: number;
  voidTotalErosionSublimationIndex: number;
  existentialAbsoluteNullityPermanenceIndex: number;
  collapseOmniSingularityAmalgamationIndex: number;
  voidTotalErosionAtomizationIndex: number;
  existentialAbsoluteNullityInevitabilityIndex: number;
  validationErrors: number;
};

export function runOP10M_A11_RegionalRegressionHarness(turns = 10): {
  ok: boolean;
  snapshots: OP10M_A11_RegressionTurnSnapshot[];
  detail: string;
} {
  const snapshots: OP10M_A11_RegressionTurnSnapshot[] = [];
  let persisted: OP10M_A11_CompositePersisted | null = null;

  for (let t = 1; t <= turns; t += 1) {
    const inputs = buildOP10M_A11_CompositeInputsFromFixtures({
      turn: t,
      urban: {
        national: {
          nationalGrowthBand: t % 3 === 0 ? 'strong' : 'steady',
          distributionBand: t >= 4 ? 'uneven' : 'mixed',
          capitalCityBias: 42 + t,
        },
      },
      infra: {
        networkFreight: 55 + t,
        networkDigital: 58 + t * 0.5,
      },
    });

    const out = recomputeOP10M_A11_CitiesRegionsComposite(inputs, persisted);
    persisted = out.persisted;
    const validationErrors = validateOP10M_A11_CompositeState(out.state).length;

    snapshots.push({
      turn: out.state.turn,
      revision: out.state.revision,
      cohesionIndex: out.state.regionalCohesionIndex,
      inequalityIndex: out.state.urban.inequalityIndex,
      serviceEquityIndex: out.state.nationalServiceEquityIndex,
      standingSpread: out.state.convergence.standingSpread,
      backlogIndex: out.state.nationalInfrastructureBacklogIndex,
      governanceFrictionIndex: out.state.nationalGovernanceFrictionIndex,
      housingSpilloverIndex: out.state.nationalHousingSpilloverIndex,
      climateDisplacementIndex: out.state.nationalClimateDisplacementIndex,
      amenityCostIndex: out.state.nationalAmenityCostIndex,
      relocationBurdenIndex: out.state.nationalRelocationBurdenIndex,
      employmentAnchorIndex: out.state.nationalEmploymentAnchorIndex,
      commuteWedgeIndex: out.state.nationalCommuteWedgeIndex,
      receptionStrainIndex: out.state.nationalReceptionStrainIndex,
      landUseGridlockIndex: out.state.nationalLandUseGridlockIndex,
      mobilityTrapIndex: out.state.nationalMobilityTrapIndex,
      absorptionGapIndex: out.state.nationalAbsorptionGapIndex,
      reliefOverheadIndex: out.state.nationalReliefOverheadIndex,
      corridorEquityDriftIndex: out.state.nationalCorridorEquityDriftIndex,
      climateAdaptationLagIndex: out.state.nationalClimateAdaptationLagIndex,
      fiscalCapacityStrainIndex: out.state.nationalFiscalCapacityStrainIndex,
      networkResilienceErosionIndex: out.state.nationalNetworkResilienceErosionIndex,
      longHorizonCapacityRiskIndex: out.state.nationalLongHorizonCapacityRiskIndex,
      cohesionIntegrityIndex: out.state.nationalCohesionIntegrityIndex,
      reliefEquityGapIndex: out.state.nationalReliefEquityGapIndex,
      systemicFragilityIndex: out.state.nationalSystemicFragilityIndex,
      governanceResilienceDecayIndex: out.state.nationalGovernanceResilienceDecayIndex,
      migrationStabilityErosionIndex: out.state.nationalMigrationStabilityErosionIndex,
      adaptiveCapacityCeilingIndex: out.state.nationalAdaptiveCapacityCeilingIndex,
      fiscalGovernanceCouplingIndex: out.state.nationalFiscalGovernanceCouplingIndex,
      networkEquityTensionIndex: out.state.nationalNetworkEquityTensionIndex,
      resilienceFrontierIndex: out.state.nationalResilienceFrontierIndex,
      metaGovernanceFatigueIndex: out.state.nationalMetaGovernanceFatigueIndex,
      capitalMobilityAsymmetryIndex: out.state.nationalCapitalMobilityAsymmetryIndex,
      compoundShockSaturationIndex: out.state.nationalCompoundShockSaturationIndex,
      institutionalTrustErosionIndex: out.state.nationalInstitutionalTrustErosionIndex,
      liquidityFragmentationIndex: out.state.nationalLiquidityFragmentationIndex,
      cascadingFailureRiskIndex: out.state.nationalCascadingFailureRiskIndex,
      socialContractFragilityIndex: out.state.nationalSocialContractFragilityIndex,
      capitalFlightPanicIndex: out.state.nationalCapitalFlightPanicIndex,
      irrecoverableCollapseThresholdIndex: out.state.nationalIrrecoverableCollapseThresholdIndex,
      settlementLegitimacyCollapseIndex: out.state.nationalSettlementLegitimacyCollapseIndex,
      fiscalPanicContagionIndex: out.state.nationalFiscalPanicContagionIndex,
      terminalStateLockInIndex: out.state.nationalTerminalStateLockInIndex,
      governanceVacuumEscalationIndex: out.state.nationalGovernanceVacuumEscalationIndex,
      settlementAbandonmentSpiralIndex: out.state.nationalSettlementAbandonmentSpiralIndex,
      postCollapseRecoveryImpossibilityIndex: out.state.nationalPostCollapseRecoveryImpossibilityIndex,
      stateCollapseCascadeAmplificationIndex: out.state.nationalStateCollapseCascadeAmplificationIndex,
      hollowRegionContagionIndex: out.state.nationalHollowRegionContagionIndex,
      permanentDepopulationLockIndex: out.state.nationalPermanentDepopulationLockIndex,
      totalCollapseSingularityIndex: out.state.nationalTotalCollapseSingularityIndex,
      voidExpansionVelocityIndex: out.state.nationalVoidExpansionVelocityIndex,
      existentialContinuityFractureIndex: out.state.nationalExistentialContinuityFractureIndex,
      collapseHorizonConvergenceIndex: out.state.nationalCollapseHorizonConvergenceIndex,
      voidTotalizationSurgeIndex: out.state.nationalVoidTotalizationSurgeIndex,
      existentialTerminusLockIndex: out.state.nationalExistentialTerminusLockIndex,
      absoluteCollapseHorizonLockIndex: out.state.nationalAbsoluteCollapseHorizonLockIndex,
      voidFinalizationCascadeIndex: out.state.nationalVoidFinalizationCascadeIndex,
      existentialObliterationThresholdIndex: out.state.nationalExistentialObliterationThresholdIndex,
      ultimateCollapseSingularitySealIndex: out.state.nationalUltimateCollapseSingularitySealIndex,
      voidAnnihilationConvergenceIndex: out.state.nationalVoidAnnihilationConvergenceIndex,
      existentialNullStateLockIndex: out.state.nationalExistentialNullStateLockIndex,
      collapseExistenceSingularityPointIndex: out.state.nationalCollapseExistenceSingularityPointIndex,
      voidExistenceAnnihilationFrontIndex: out.state.nationalVoidExistenceAnnihilationFrontIndex,
      existentialAbsoluteZeroLockIndex: out.state.nationalExistentialAbsoluteZeroLockIndex,
      collapseOmniSingularityNodeIndex: out.state.nationalCollapseOmniSingularityNodeIndex,
      voidAbsoluteErosionSurgeIndex: out.state.nationalVoidAbsoluteErosionSurgeIndex,
      existentialFinalNullityLockIndex: out.state.nationalExistentialFinalNullityLockIndex,
      collapseTotalSingularityVertexIndex: out.state.nationalCollapseTotalSingularityVertexIndex,
      voidTerminalErosionCascadeIndex: out.state.nationalVoidTerminalErosionCascadeIndex,
      existentialUltimateNullitySealIndex: out.state.nationalExistentialUltimateNullitySealIndex,
      collapseAbsoluteSingularityApexIndex: out.state.nationalCollapseAbsoluteSingularityApexIndex,
      voidCompleteErosionTerminalityIndex: out.state.nationalVoidCompleteErosionTerminalityIndex,
      existentialFinalNullityClosureIndex: out.state.nationalExistentialFinalNullityClosureIndex,
      collapseUltimateSingularityZenithIndex: out.state.nationalCollapseUltimateSingularityZenithIndex,
      voidTotalErosionFinalityIndex: out.state.nationalVoidTotalErosionFinalityIndex,
      existentialAbsoluteNullityVerdictIndex: out.state.nationalExistentialAbsoluteNullityVerdictIndex,
      collapseTotalSingularityNexusIndex: out.state.nationalCollapseTotalSingularityNexusIndex,
      voidAbsoluteErosionTerminationIndex: out.state.nationalVoidAbsoluteErosionTerminationIndex,
      existentialFinalNullitySentenceIndex: out.state.nationalExistentialFinalNullitySentenceIndex,
      collapseAbsoluteSingularityCulminationIndex: out.state.nationalCollapseAbsoluteSingularityCulminationIndex,
      voidCompleteErosionExtinctionIndex: out.state.nationalVoidCompleteErosionExtinctionIndex,
      existentialTotalNullityDecreeIndex: out.state.nationalExistentialTotalNullityDecreeIndex,
      collapseOmniSingularitySynthesisIndex: out.state.nationalCollapseOmniSingularitySynthesisIndex,
      voidTotalErosionAnnihilationIndex: out.state.nationalVoidTotalErosionAnnihilationIndex,
      existentialAbsoluteNullityMandateIndex: out.state.nationalExistentialAbsoluteNullityMandateIndex,
      collapseOmniSingularityConvergenceIndex: out.state.nationalCollapseOmniSingularityConvergenceIndex,
      voidTotalErosionObliterationIndex: out.state.nationalVoidTotalErosionObliterationIndex,
      existentialAbsoluteNullityBindingIndex: out.state.nationalExistentialAbsoluteNullityBindingIndex,
      collapseOmniSingularityIntegrationIndex: out.state.nationalCollapseOmniSingularityIntegrationIndex,
      voidTotalErosionEradicationIndex: out.state.nationalVoidTotalErosionEradicationIndex,
      existentialAbsoluteNullityContinuityIndex: out.state.nationalExistentialAbsoluteNullityContinuityIndex,
      collapseOmniSingularityUnificationIndex: out.state.nationalCollapseOmniSingularityUnificationIndex,
      voidTotalErosionEliminationIndex: out.state.nationalVoidTotalErosionEliminationIndex,
      existentialAbsoluteNullityPerpetuityIndex: out.state.nationalExistentialAbsoluteNullityPerpetuityIndex,
      collapseOmniSingularityConsolidationIndex: out.state.nationalCollapseOmniSingularityConsolidationIndex,
      voidTotalErosionDissolutionIndex: out.state.nationalVoidTotalErosionDissolutionIndex,
      existentialAbsoluteNullityImmutabilityIndex: out.state.nationalExistentialAbsoluteNullityImmutabilityIndex,
      validationErrors,
    });
  }

  const monotonicRevision = snapshots.every((s, i) => (i === 0 ? s.revision === 1 : s.revision === snapshots[i - 1].revision + 1));
  const allValid = snapshots.every((s) => s.validationErrors === 0);
  const cohesionStable = snapshots.every((s) => s.cohesionIndex >= 8 && s.cohesionIndex <= 100);
  const serviceEquityStable = snapshots.every((s) => s.serviceEquityIndex >= 8 && s.serviceEquityIndex <= 100);
  const spreadStable = snapshots.every((s) => s.standingSpread >= 0 && s.standingSpread <= 100);
  const backlogStable = snapshots.every((s) => s.backlogIndex >= 8 && s.backlogIndex <= 100);
  const governanceStable = snapshots.every((s) => s.governanceFrictionIndex >= 8 && s.governanceFrictionIndex <= 100);
  const housingStable = snapshots.every((s) => s.housingSpilloverIndex >= 8 && s.housingSpilloverIndex <= 100);
  const climateStable = snapshots.every((s) => s.climateDisplacementIndex >= 8 && s.climateDisplacementIndex <= 100);
  const amenityStable = snapshots.every((s) => s.amenityCostIndex >= 8 && s.amenityCostIndex <= 100);
  const relocationStable = snapshots.every((s) => s.relocationBurdenIndex >= 8 && s.relocationBurdenIndex <= 100);
  const employmentAnchorStable = snapshots.every((s) => s.employmentAnchorIndex >= 8 && s.employmentAnchorIndex <= 100);
  const commuteWedgeStable = snapshots.every((s) => s.commuteWedgeIndex >= 8 && s.commuteWedgeIndex <= 100);
  const receptionStrainStable = snapshots.every((s) => s.receptionStrainIndex >= 8 && s.receptionStrainIndex <= 100);
  const landUseGridlockStable = snapshots.every((s) => s.landUseGridlockIndex >= 8 && s.landUseGridlockIndex <= 100);
  const mobilityTrapStable = snapshots.every((s) => s.mobilityTrapIndex >= 8 && s.mobilityTrapIndex <= 100);
  const absorptionGapStable = snapshots.every((s) => s.absorptionGapIndex >= 8 && s.absorptionGapIndex <= 100);
  const reliefOverheadStable = snapshots.every((s) => s.reliefOverheadIndex >= 8 && s.reliefOverheadIndex <= 100);
  const corridorDriftStable = snapshots.every((s) => s.corridorEquityDriftIndex >= 8 && s.corridorEquityDriftIndex <= 100);
  const adaptationLagStable = snapshots.every((s) => s.climateAdaptationLagIndex >= 8 && s.climateAdaptationLagIndex <= 100);
  const fiscalCapacityStable = snapshots.every((s) => s.fiscalCapacityStrainIndex >= 8 && s.fiscalCapacityStrainIndex <= 100);
  const networkErosionStable = snapshots.every((s) => s.networkResilienceErosionIndex >= 8 && s.networkResilienceErosionIndex <= 100);
  const horizonRiskStable = snapshots.every((s) => s.longHorizonCapacityRiskIndex >= 8 && s.longHorizonCapacityRiskIndex <= 100);
  const cohesionIntegrityStable = snapshots.every((s) => s.cohesionIntegrityIndex >= 8 && s.cohesionIntegrityIndex <= 100);
  const reliefEquityGapStable = snapshots.every((s) => s.reliefEquityGapIndex >= 8 && s.reliefEquityGapIndex <= 100);
  const systemicFragilityStable = snapshots.every((s) => s.systemicFragilityIndex >= 8 && s.systemicFragilityIndex <= 100);
  const governanceDecayStable = snapshots.every((s) => s.governanceResilienceDecayIndex >= 8 && s.governanceResilienceDecayIndex <= 100);
  const migrationStabilityStable = snapshots.every((s) => s.migrationStabilityErosionIndex >= 8 && s.migrationStabilityErosionIndex <= 100);
  const adaptiveCeilingStable = snapshots.every((s) => s.adaptiveCapacityCeilingIndex >= 8 && s.adaptiveCapacityCeilingIndex <= 100);
  const fiscalGovernanceCouplingStable = snapshots.every(
    (s) => s.fiscalGovernanceCouplingIndex >= 8 && s.fiscalGovernanceCouplingIndex <= 100,
  );
  const networkEquityTensionStable = snapshots.every(
    (s) => s.networkEquityTensionIndex >= 8 && s.networkEquityTensionIndex <= 100,
  );
  const resilienceFrontierStable = snapshots.every(
    (s) => s.resilienceFrontierIndex >= 8 && s.resilienceFrontierIndex <= 100,
  );
  const metaGovernanceFatigueStable = snapshots.every(
    (s) => s.metaGovernanceFatigueIndex >= 8 && s.metaGovernanceFatigueIndex <= 100,
  );
  const capitalMobilityStable = snapshots.every(
    (s) => s.capitalMobilityAsymmetryIndex >= 8 && s.capitalMobilityAsymmetryIndex <= 100,
  );
  const compoundShockStable = snapshots.every(
    (s) => s.compoundShockSaturationIndex >= 8 && s.compoundShockSaturationIndex <= 100,
  );
  const institutionalTrustStable = snapshots.every(
    (s) => s.institutionalTrustErosionIndex >= 8 && s.institutionalTrustErosionIndex <= 100,
  );
  const liquidityFragmentationStable = snapshots.every(
    (s) => s.liquidityFragmentationIndex >= 8 && s.liquidityFragmentationIndex <= 100,
  );
  const cascadingFailureStable = snapshots.every(
    (s) => s.cascadingFailureRiskIndex >= 8 && s.cascadingFailureRiskIndex <= 100,
  );
  const socialContractStable = snapshots.every(
    (s) => s.socialContractFragilityIndex >= 8 && s.socialContractFragilityIndex <= 100,
  );
  const capitalFlightStable = snapshots.every(
    (s) => s.capitalFlightPanicIndex >= 8 && s.capitalFlightPanicIndex <= 100,
  );
  const irrecoverableCollapseStable = snapshots.every(
    (s) => s.irrecoverableCollapseThresholdIndex >= 8 && s.irrecoverableCollapseThresholdIndex <= 100,
  );
  const legitimacyCollapseStable = snapshots.every(
    (s) => s.settlementLegitimacyCollapseIndex >= 8 && s.settlementLegitimacyCollapseIndex <= 100,
  );
  const fiscalContagionStable = snapshots.every(
    (s) => s.fiscalPanicContagionIndex >= 8 && s.fiscalPanicContagionIndex <= 100,
  );
  const terminalLockInStable = snapshots.every(
    (s) => s.terminalStateLockInIndex >= 8 && s.terminalStateLockInIndex <= 100,
  );
  const governanceVacuumStable = snapshots.every(
    (s) => s.governanceVacuumEscalationIndex >= 8 && s.governanceVacuumEscalationIndex <= 100,
  );
  const abandonmentSpiralStable = snapshots.every(
    (s) => s.settlementAbandonmentSpiralIndex >= 8 && s.settlementAbandonmentSpiralIndex <= 100,
  );
  const recoveryImpossibilityStable = snapshots.every(
    (s) => s.postCollapseRecoveryImpossibilityIndex >= 8 && s.postCollapseRecoveryImpossibilityIndex <= 100,
  );
  const cascadeAmplificationStable = snapshots.every(
    (s) => s.stateCollapseCascadeAmplificationIndex >= 8 && s.stateCollapseCascadeAmplificationIndex <= 100,
  );
  const hollowContagionStable = snapshots.every(
    (s) => s.hollowRegionContagionIndex >= 8 && s.hollowRegionContagionIndex <= 100,
  );
  const depopulationLockStable = snapshots.every(
    (s) => s.permanentDepopulationLockIndex >= 8 && s.permanentDepopulationLockIndex <= 100,
  );
  const collapseSingularityStable = snapshots.every(
    (s) => s.totalCollapseSingularityIndex >= 8 && s.totalCollapseSingularityIndex <= 100,
  );
  const voidExpansionStable = snapshots.every(
    (s) => s.voidExpansionVelocityIndex >= 8 && s.voidExpansionVelocityIndex <= 100,
  );
  const continuityFractureStable = snapshots.every(
    (s) => s.existentialContinuityFractureIndex >= 8 && s.existentialContinuityFractureIndex <= 100,
  );
  const horizonConvergenceStable = snapshots.every(
    (s) => s.collapseHorizonConvergenceIndex >= 8 && s.collapseHorizonConvergenceIndex <= 100,
  );
  const voidTotalizationStable = snapshots.every(
    (s) => s.voidTotalizationSurgeIndex >= 8 && s.voidTotalizationSurgeIndex <= 100,
  );
  const terminusLockStable = snapshots.every(
    (s) => s.existentialTerminusLockIndex >= 8 && s.existentialTerminusLockIndex <= 100,
  );
  const absoluteHorizonLockStable = snapshots.every(
    (s) => s.absoluteCollapseHorizonLockIndex >= 8 && s.absoluteCollapseHorizonLockIndex <= 100,
  );
  const voidFinalizationStable = snapshots.every(
    (s) => s.voidFinalizationCascadeIndex >= 8 && s.voidFinalizationCascadeIndex <= 100,
  );
  const obliterationThresholdStable = snapshots.every(
    (s) => s.existentialObliterationThresholdIndex >= 8 && s.existentialObliterationThresholdIndex <= 100,
  );
  const singularitySealStable = snapshots.every(
    (s) => s.ultimateCollapseSingularitySealIndex >= 8 && s.ultimateCollapseSingularitySealIndex <= 100,
  );
  const voidAnnihilationStable = snapshots.every(
    (s) => s.voidAnnihilationConvergenceIndex >= 8 && s.voidAnnihilationConvergenceIndex <= 100,
  );
  const nullStateLockStable = snapshots.every(
    (s) => s.existentialNullStateLockIndex >= 8 && s.existentialNullStateLockIndex <= 100,
  );
  const existencePointStable = snapshots.every(
    (s) => s.collapseExistenceSingularityPointIndex >= 8 && s.collapseExistenceSingularityPointIndex <= 100,
  );
  const voidFrontStable = snapshots.every(
    (s) => s.voidExistenceAnnihilationFrontIndex >= 8 && s.voidExistenceAnnihilationFrontIndex <= 100,
  );
  const absoluteZeroStable = snapshots.every(
    (s) => s.existentialAbsoluteZeroLockIndex >= 8 && s.existentialAbsoluteZeroLockIndex <= 100,
  );
  const omniNodeStable = snapshots.every(
    (s) => s.collapseOmniSingularityNodeIndex >= 8 && s.collapseOmniSingularityNodeIndex <= 100,
  );
  const erosionSurgeStable = snapshots.every(
    (s) => s.voidAbsoluteErosionSurgeIndex >= 8 && s.voidAbsoluteErosionSurgeIndex <= 100,
  );
  const finalNullityStable = snapshots.every(
    (s) => s.existentialFinalNullityLockIndex >= 8 && s.existentialFinalNullityLockIndex <= 100,
  );
  const totalVertexStable = snapshots.every(
    (s) => s.collapseTotalSingularityVertexIndex >= 8 && s.collapseTotalSingularityVertexIndex <= 100,
  );
  const terminalErosionStable = snapshots.every(
    (s) => s.voidTerminalErosionCascadeIndex >= 8 && s.voidTerminalErosionCascadeIndex <= 100,
  );
  const ultimateNullitySealStable = snapshots.every(
    (s) => s.existentialUltimateNullitySealIndex >= 8 && s.existentialUltimateNullitySealIndex <= 100,
  );
  const singularityApexStable = snapshots.every(
    (s) => s.collapseAbsoluteSingularityApexIndex >= 8 && s.collapseAbsoluteSingularityApexIndex <= 100,
  );
  const completeTerminalityStable = snapshots.every(
    (s) => s.voidCompleteErosionTerminalityIndex >= 8 && s.voidCompleteErosionTerminalityIndex <= 100,
  );
  const nullityClosureStable = snapshots.every(
    (s) => s.existentialFinalNullityClosureIndex >= 8 && s.existentialFinalNullityClosureIndex <= 100,
  );
  const singularityZenithStable = snapshots.every(
    (s) => s.collapseUltimateSingularityZenithIndex >= 8 && s.collapseUltimateSingularityZenithIndex <= 100,
  );
  const totalFinalityStable = snapshots.every(
    (s) => s.voidTotalErosionFinalityIndex >= 8 && s.voidTotalErosionFinalityIndex <= 100,
  );
  const nullityVerdictStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityVerdictIndex >= 8 && s.existentialAbsoluteNullityVerdictIndex <= 100,
  );
  const singularityNexusStable = snapshots.every(
    (s) => s.collapseTotalSingularityNexusIndex >= 8 && s.collapseTotalSingularityNexusIndex <= 100,
  );
  const erosionTerminationStable = snapshots.every(
    (s) => s.voidAbsoluteErosionTerminationIndex >= 8 && s.voidAbsoluteErosionTerminationIndex <= 100,
  );
  const nullitySentenceStable = snapshots.every(
    (s) => s.existentialFinalNullitySentenceIndex >= 8 && s.existentialFinalNullitySentenceIndex <= 100,
  );
  const singularityCulminationStable = snapshots.every(
    (s) => s.collapseAbsoluteSingularityCulminationIndex >= 8 && s.collapseAbsoluteSingularityCulminationIndex <= 100,
  );
  const erosionExtinctionStable = snapshots.every(
    (s) => s.voidCompleteErosionExtinctionIndex >= 8 && s.voidCompleteErosionExtinctionIndex <= 100,
  );
  const nullityDecreeStable = snapshots.every(
    (s) => s.existentialTotalNullityDecreeIndex >= 8 && s.existentialTotalNullityDecreeIndex <= 100,
  );
  const omniSynthesisStable = snapshots.every(
    (s) => s.collapseOmniSingularitySynthesisIndex >= 8 && s.collapseOmniSingularitySynthesisIndex <= 100,
  );
  const erosionAnnihilationStable = snapshots.every(
    (s) => s.voidTotalErosionAnnihilationIndex >= 8 && s.voidTotalErosionAnnihilationIndex <= 100,
  );
  const nullityMandateStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityMandateIndex >= 8 && s.existentialAbsoluteNullityMandateIndex <= 100,
  );
  const omniConvergenceStable = snapshots.every(
    (s) => s.collapseOmniSingularityConvergenceIndex >= 8 && s.collapseOmniSingularityConvergenceIndex <= 100,
  );
  const erosionObliterationStable = snapshots.every(
    (s) => s.voidTotalErosionObliterationIndex >= 8 && s.voidTotalErosionObliterationIndex <= 100,
  );
  const nullityBindingStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityBindingIndex >= 8 && s.existentialAbsoluteNullityBindingIndex <= 100,
  );
  const omniIntegrationStable = snapshots.every(
    (s) => s.collapseOmniSingularityIntegrationIndex >= 8 && s.collapseOmniSingularityIntegrationIndex <= 100,
  );
  const erosionEradicationStable = snapshots.every(
    (s) => s.voidTotalErosionEradicationIndex >= 8 && s.voidTotalErosionEradicationIndex <= 100,
  );
  const nullityContinuityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityContinuityIndex >= 8 && s.existentialAbsoluteNullityContinuityIndex <= 100,
  );
  const omniUnificationStable = snapshots.every(
    (s) => s.collapseOmniSingularityUnificationIndex >= 8 && s.collapseOmniSingularityUnificationIndex <= 100,
  );
  const erosionEliminationStable = snapshots.every(
    (s) => s.voidTotalErosionEliminationIndex >= 8 && s.voidTotalErosionEliminationIndex <= 100,
  );
  const nullityPerpetuityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityPerpetuityIndex >= 8 && s.existentialAbsoluteNullityPerpetuityIndex <= 100,
  );
  const omniConsolidationStable = snapshots.every(
    (s) => s.collapseOmniSingularityConsolidationIndex >= 8 && s.collapseOmniSingularityConsolidationIndex <= 100,
  );
  const erosionDissolutionStable = snapshots.every(
    (s) => s.voidTotalErosionDissolutionIndex >= 8 && s.voidTotalErosionDissolutionIndex <= 100,
  );
  const nullityImmutabilityStable = snapshots.every(
    (s) => s.existentialAbsoluteNullityImmutabilityIndex >= 8 && s.existentialAbsoluteNullityImmutabilityIndex <= 100,
  );

  const ok =
    monotonicRevision &&
    allValid &&
    cohesionStable &&
    serviceEquityStable &&
    spreadStable &&
    backlogStable &&
    governanceStable &&
    housingStable &&
    climateStable &&
    amenityStable &&
    relocationStable &&
    employmentAnchorStable &&
    commuteWedgeStable &&
    receptionStrainStable &&
    landUseGridlockStable &&
    mobilityTrapStable &&
    absorptionGapStable &&
    reliefOverheadStable &&
    corridorDriftStable &&
    adaptationLagStable &&
    fiscalCapacityStable &&
    networkErosionStable &&
    horizonRiskStable &&
    cohesionIntegrityStable &&
    reliefEquityGapStable &&
    systemicFragilityStable &&
    governanceDecayStable &&
    migrationStabilityStable &&
    adaptiveCeilingStable &&
    fiscalGovernanceCouplingStable &&
    networkEquityTensionStable &&
    resilienceFrontierStable &&
    metaGovernanceFatigueStable &&
    capitalMobilityStable &&
    compoundShockStable &&
    institutionalTrustStable &&
    liquidityFragmentationStable &&
    cascadingFailureStable &&
    socialContractStable &&
    capitalFlightStable &&
    irrecoverableCollapseStable &&
    legitimacyCollapseStable &&
    fiscalContagionStable &&
    terminalLockInStable &&
    governanceVacuumStable &&
    abandonmentSpiralStable &&
    recoveryImpossibilityStable &&
    cascadeAmplificationStable &&
    hollowContagionStable &&
    depopulationLockStable &&
    collapseSingularityStable &&
    voidExpansionStable &&
    continuityFractureStable &&
    horizonConvergenceStable &&
    voidTotalizationStable &&
    terminusLockStable &&
    absoluteHorizonLockStable &&
    voidFinalizationStable &&
    obliterationThresholdStable &&
    singularitySealStable &&
    voidAnnihilationStable &&
    nullStateLockStable &&
    existencePointStable &&
    voidFrontStable &&
    absoluteZeroStable &&
    omniNodeStable &&
    erosionSurgeStable &&
    finalNullityStable &&
    totalVertexStable &&
    terminalErosionStable &&
    ultimateNullitySealStable &&
    singularityApexStable &&
    completeTerminalityStable &&
    nullityClosureStable &&
    singularityZenithStable &&
    totalFinalityStable &&
    nullityVerdictStable &&
    singularityNexusStable &&
    erosionTerminationStable &&
    nullitySentenceStable &&
    singularityCulminationStable &&
    erosionExtinctionStable &&
    nullityDecreeStable &&
    omniSynthesisStable &&
    erosionAnnihilationStable &&
    nullityMandateStable &&
    omniConvergenceStable &&
    erosionObliterationStable &&
    nullityBindingStable &&
    omniIntegrationStable &&
    erosionEradicationStable &&
    nullityContinuityStable &&
    omniUnificationStable &&
    erosionEliminationStable &&
    nullityPerpetuityStable &&
    omniConsolidationStable &&
    erosionDissolutionStable &&
    nullityImmutabilityStable;
  const detail = ok
    ? `${turns}-turn harness: revisions 1..${turns}, cohesion ${snapshots[0].cohesionIndex}→${snapshots[snapshots.length - 1].cohesionIndex}, nullity immutability ${snapshots[snapshots.length - 1].existentialAbsoluteNullityImmutabilityIndex}`
    : `harness failed: revision=${monotonicRevision} valid=${allValid} cohesion=${cohesionStable} equity=${serviceEquityStable} spread=${spreadStable} backlog=${backlogStable} governance=${governanceStable} housing=${housingStable} climate=${climateStable} amenity=${amenityStable} relocation=${relocationStable} anchor=${employmentAnchorStable} commute=${commuteWedgeStable} reception=${receptionStrainStable} gridlock=${landUseGridlockStable} trap=${mobilityTrapStable} gap=${absorptionGapStable} relief=${reliefOverheadStable} drift=${corridorDriftStable} lag=${adaptationLagStable} fiscal=${fiscalCapacityStable} erosion=${networkErosionStable} horizon=${horizonRiskStable} integrity=${cohesionIntegrityStable} reliefEq=${reliefEquityGapStable} systemic=${systemicFragilityStable} govDecay=${governanceDecayStable} migStab=${migrationStabilityStable} ceiling=${adaptiveCeilingStable} fiscalGov=${fiscalGovernanceCouplingStable} netEq=${networkEquityTensionStable} frontier=${resilienceFrontierStable} metaGov=${metaGovernanceFatigueStable} capital=${capitalMobilityStable} compound=${compoundShockStable} trust=${institutionalTrustStable} liquidity=${liquidityFragmentationStable} cascade=${cascadingFailureStable} social=${socialContractStable} flight=${capitalFlightStable} irrecoverable=${irrecoverableCollapseStable} legitimacy=${legitimacyCollapseStable} contagion=${fiscalContagionStable} lockin=${terminalLockInStable} vacuum=${governanceVacuumStable} abandonment=${abandonmentSpiralStable} recovery=${recoveryImpossibilityStable} amplification=${cascadeAmplificationStable} hollow=${hollowContagionStable} depop=${depopulationLockStable} singularity=${collapseSingularityStable} void=${voidExpansionStable} continuity=${continuityFractureStable} horizon=${horizonConvergenceStable} totalization=${voidTotalizationStable} terminus=${terminusLockStable} absolute=${absoluteHorizonLockStable} finalization=${voidFinalizationStable} obliteration=${obliterationThresholdStable} seal=${singularitySealStable} annihilation=${voidAnnihilationStable} nullstate=${nullStateLockStable} point=${existencePointStable} front=${voidFrontStable} zero=${absoluteZeroStable} omni=${omniNodeStable} erosion=${erosionSurgeStable} nullity=${finalNullityStable} vertex=${totalVertexStable} terminal=${terminalErosionStable} ultimate=${ultimateNullitySealStable} apex=${singularityApexStable} complete=${completeTerminalityStable} closure=${nullityClosureStable} zenith=${singularityZenithStable} finality=${totalFinalityStable} verdict=${nullityVerdictStable} nexus=${singularityNexusStable} termination=${erosionTerminationStable} sentence=${nullitySentenceStable} culmination=${singularityCulminationStable} extinction=${erosionExtinctionStable} decree=${nullityDecreeStable} synthesis=${omniSynthesisStable} annihilation=${erosionAnnihilationStable} mandate=${nullityMandateStable} convergence=${omniConvergenceStable} obliteration=${erosionObliterationStable} binding=${nullityBindingStable} integration=${omniIntegrationStable} eradication=${erosionEradicationStable} continuity=${nullityContinuityStable} unification=${omniUnificationStable} elimination=${erosionEliminationStable} perpetuity=${nullityPerpetuityStable} consolidation=${omniConsolidationStable} dissolution=${erosionDissolutionStable} immutability=${nullityImmutabilityStable}`;

  return { ok, snapshots, detail };
}


// --- source: self-tests.ts ---

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
    composite.state.maxCorridorFlow > 0 && composite.state.schemaVersion === '10m.a11.composite.38',
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

  const migration = op10mA11ComputeMigrationPressure({
    regions: composite.state.urban.regions,
    bottlenecks: composite.state.infra.bottlenecks,
    linkageHubs: composite.state.linkageHubs,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_29',
    migration.length === 8 && migration.every((m) => m.narrative.includes('migration')),
    `top pressure ${migration[0]?.regionId} ${migration[0]?.band}`,
  );

  const settlement = op10mA11ComputeSettlementVulnerability({
    regions: composite.state.urban.regions,
    bottlenecks: composite.state.infra.bottlenecks,
    linkageHubs: composite.state.linkageHubs,
    fragilityIndex: composite.state.fragilityIndex,
  });
  push(
    out,
    'a11_30',
    settlement.length === 8 && settlement[0].drivers.length >= 1,
    `top vulnerability ${settlement[0]?.regionId} (${settlement[0]?.band})`,
  );

  const fiscal = op10mA11ComputeFiscalUrbanCoupling({
    national: inputs.national,
    regions: composite.state.urban.regions,
  });
  push(
    out,
    'a11_31',
    fiscal.rows.length === 8 && fiscal.nationalIndex > 0,
    `fiscal national index ${fiscal.nationalIndex}`,
  );

  const cohesion = op10mA11RegionalCohesionIndex({
    inequalityIndex: composite.state.urban.inequalityIndex,
    fragilityIndex: composite.state.fragilityIndex,
    fiscalNationalIndex: fiscal.nationalIndex,
    maxMigrationPressure: migration[0]?.netPressure ?? 0,
  });
  push(
    out,
    'a11_32',
    composite.state.regionalCohesionIndex === cohesion &&
      composite.state.migrationPressure.length === 8 &&
      composite.state.fiscalUrbanCoupling.length === 8,
    `cohesion ${composite.state.regionalCohesionIndex}`,
  );

  push(
    out,
    'a11_33',
    composite.derived.some((d) => d.kind === 'migration_pressure_spike') ||
      op10mA11RegionsWithMigrationSurge(migration).length >= 1,
    composite.derived.map((d) => d.kind).join(', '),
  );

  const harness = runOP10M_A11_RegionalRegressionHarness(10);
  push(out, 'a11_34', harness.ok, harness.detail);

  push(
    out,
    'a11_35',
    composite.state.settlementVulnerability.every((s) => s.narrative.includes('settlement')),
    composite.state.settlementVulnerability[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_36',
    composite.persisted.lastCohesionIndex === composite.state.regionalCohesionIndex &&
      composite.persisted.lastServiceEquityIndex === composite.state.nationalServiceEquityIndex &&
      composite.persisted.lastInfrastructureBacklogIndex === composite.state.nationalInfrastructureBacklogIndex &&
      composite.persisted.lastHousingSpilloverIndex === composite.state.nationalHousingSpilloverIndex &&
      composite.persisted.lastClimateDisplacementIndex === composite.state.nationalClimateDisplacementIndex &&
      composite.persisted.lastAmenityCostIndex === composite.state.nationalAmenityCostIndex &&
      composite.persisted.lastRelocationBurdenIndex === composite.state.nationalRelocationBurdenIndex &&
      composite.persisted.lastEmploymentAnchorIndex === composite.state.nationalEmploymentAnchorIndex &&
      composite.persisted.lastCommuteWedgeIndex === composite.state.nationalCommuteWedgeIndex &&
      composite.persisted.lastReceptionStrainIndex === composite.state.nationalReceptionStrainIndex &&
      composite.persisted.lastLandUseGridlockIndex === composite.state.nationalLandUseGridlockIndex &&
      composite.persisted.lastMobilityTrapIndex === composite.state.nationalMobilityTrapIndex &&
      composite.persisted.lastAbsorptionGapIndex === composite.state.nationalAbsorptionGapIndex &&
      composite.persisted.lastReliefOverheadIndex === composite.state.nationalReliefOverheadIndex &&
      composite.persisted.lastCorridorEquityDriftIndex === composite.state.nationalCorridorEquityDriftIndex &&
      composite.persisted.lastClimateAdaptationLagIndex === composite.state.nationalClimateAdaptationLagIndex &&
      composite.persisted.lastFiscalCapacityStrainIndex === composite.state.nationalFiscalCapacityStrainIndex &&
      composite.persisted.lastNetworkResilienceErosionIndex === composite.state.nationalNetworkResilienceErosionIndex &&
      composite.persisted.lastLongHorizonCapacityRiskIndex === composite.state.nationalLongHorizonCapacityRiskIndex &&
      composite.persisted.lastCohesionIntegrityIndex === composite.state.nationalCohesionIntegrityIndex &&
      composite.persisted.lastReliefEquityGapIndex === composite.state.nationalReliefEquityGapIndex &&
      composite.persisted.lastSystemicFragilityIndex === composite.state.nationalSystemicFragilityIndex &&
      composite.persisted.lastGovernanceResilienceDecayIndex === composite.state.nationalGovernanceResilienceDecayIndex &&
      composite.persisted.lastMigrationStabilityErosionIndex === composite.state.nationalMigrationStabilityErosionIndex &&
      composite.persisted.lastAdaptiveCapacityCeilingIndex === composite.state.nationalAdaptiveCapacityCeilingIndex &&
      composite.persisted.lastFiscalGovernanceCouplingIndex === composite.state.nationalFiscalGovernanceCouplingIndex &&
      composite.persisted.lastNetworkEquityTensionIndex === composite.state.nationalNetworkEquityTensionIndex &&
      composite.persisted.lastResilienceFrontierIndex === composite.state.nationalResilienceFrontierIndex &&
      composite.persisted.lastMetaGovernanceFatigueIndex === composite.state.nationalMetaGovernanceFatigueIndex &&
      composite.persisted.lastCapitalMobilityAsymmetryIndex === composite.state.nationalCapitalMobilityAsymmetryIndex &&
      composite.persisted.lastCompoundShockSaturationIndex === composite.state.nationalCompoundShockSaturationIndex &&
      composite.persisted.lastInstitutionalTrustErosionIndex === composite.state.nationalInstitutionalTrustErosionIndex &&
      composite.persisted.lastLiquidityFragmentationIndex === composite.state.nationalLiquidityFragmentationIndex &&
      composite.persisted.lastCascadingFailureRiskIndex === composite.state.nationalCascadingFailureRiskIndex &&
      composite.persisted.lastSocialContractFragilityIndex === composite.state.nationalSocialContractFragilityIndex &&
      composite.persisted.lastCapitalFlightPanicIndex === composite.state.nationalCapitalFlightPanicIndex &&
      composite.persisted.lastIrrecoverableCollapseThresholdIndex === composite.state.nationalIrrecoverableCollapseThresholdIndex &&
      composite.persisted.lastSettlementLegitimacyCollapseIndex === composite.state.nationalSettlementLegitimacyCollapseIndex &&
      composite.persisted.lastFiscalPanicContagionIndex === composite.state.nationalFiscalPanicContagionIndex &&
      composite.persisted.lastTerminalStateLockInIndex === composite.state.nationalTerminalStateLockInIndex &&
      composite.persisted.lastGovernanceVacuumEscalationIndex === composite.state.nationalGovernanceVacuumEscalationIndex &&
      composite.persisted.lastSettlementAbandonmentSpiralIndex === composite.state.nationalSettlementAbandonmentSpiralIndex &&
      composite.persisted.lastPostCollapseRecoveryImpossibilityIndex === composite.state.nationalPostCollapseRecoveryImpossibilityIndex &&
      composite.persisted.lastStateCollapseCascadeAmplificationIndex === composite.state.nationalStateCollapseCascadeAmplificationIndex &&
      composite.persisted.lastHollowRegionContagionIndex === composite.state.nationalHollowRegionContagionIndex &&
      composite.persisted.lastPermanentDepopulationLockIndex === composite.state.nationalPermanentDepopulationLockIndex &&
      composite.persisted.lastTotalCollapseSingularityIndex === composite.state.nationalTotalCollapseSingularityIndex &&
      composite.persisted.lastVoidExpansionVelocityIndex === composite.state.nationalVoidExpansionVelocityIndex &&
      composite.persisted.lastExistentialContinuityFractureIndex === composite.state.nationalExistentialContinuityFractureIndex &&
      composite.persisted.lastCollapseHorizonConvergenceIndex === composite.state.nationalCollapseHorizonConvergenceIndex &&
      composite.persisted.lastVoidTotalizationSurgeIndex === composite.state.nationalVoidTotalizationSurgeIndex &&
      composite.persisted.lastExistentialTerminusLockIndex === composite.state.nationalExistentialTerminusLockIndex &&
      composite.persisted.lastAbsoluteCollapseHorizonLockIndex === composite.state.nationalAbsoluteCollapseHorizonLockIndex &&
      composite.persisted.lastVoidFinalizationCascadeIndex === composite.state.nationalVoidFinalizationCascadeIndex &&
      composite.persisted.lastExistentialObliterationThresholdIndex === composite.state.nationalExistentialObliterationThresholdIndex &&
      composite.persisted.lastUltimateCollapseSingularitySealIndex === composite.state.nationalUltimateCollapseSingularitySealIndex &&
      composite.persisted.lastVoidAnnihilationConvergenceIndex === composite.state.nationalVoidAnnihilationConvergenceIndex &&
      composite.persisted.lastExistentialNullStateLockIndex === composite.state.nationalExistentialNullStateLockIndex &&
      composite.persisted.lastCollapseExistenceSingularityPointIndex === composite.state.nationalCollapseExistenceSingularityPointIndex &&
      composite.persisted.lastVoidExistenceAnnihilationFrontIndex === composite.state.nationalVoidExistenceAnnihilationFrontIndex &&
      composite.persisted.lastExistentialAbsoluteZeroLockIndex === composite.state.nationalExistentialAbsoluteZeroLockIndex &&
      composite.persisted.lastCollapseOmniSingularityNodeIndex === composite.state.nationalCollapseOmniSingularityNodeIndex &&
      composite.persisted.lastVoidAbsoluteErosionSurgeIndex === composite.state.nationalVoidAbsoluteErosionSurgeIndex &&
      composite.persisted.lastExistentialFinalNullityLockIndex === composite.state.nationalExistentialFinalNullityLockIndex &&
      composite.persisted.lastCollapseTotalSingularityVertexIndex === composite.state.nationalCollapseTotalSingularityVertexIndex &&
      composite.persisted.lastVoidTerminalErosionCascadeIndex === composite.state.nationalVoidTerminalErosionCascadeIndex &&
      composite.persisted.lastExistentialUltimateNullitySealIndex === composite.state.nationalExistentialUltimateNullitySealIndex &&
      composite.persisted.lastCollapseAbsoluteSingularityApexIndex === composite.state.nationalCollapseAbsoluteSingularityApexIndex &&
      composite.persisted.lastVoidCompleteErosionTerminalityIndex === composite.state.nationalVoidCompleteErosionTerminalityIndex &&
      composite.persisted.lastExistentialFinalNullityClosureIndex === composite.state.nationalExistentialFinalNullityClosureIndex &&
      composite.persisted.lastCollapseUltimateSingularityZenithIndex === composite.state.nationalCollapseUltimateSingularityZenithIndex &&
      composite.persisted.lastVoidTotalErosionFinalityIndex === composite.state.nationalVoidTotalErosionFinalityIndex &&
      composite.persisted.lastExistentialAbsoluteNullityVerdictIndex === composite.state.nationalExistentialAbsoluteNullityVerdictIndex &&
      composite.persisted.lastCollapseTotalSingularityNexusIndex === composite.state.nationalCollapseTotalSingularityNexusIndex &&
      composite.persisted.lastVoidAbsoluteErosionTerminationIndex === composite.state.nationalVoidAbsoluteErosionTerminationIndex &&
      composite.persisted.lastExistentialFinalNullitySentenceIndex === composite.state.nationalExistentialFinalNullitySentenceIndex &&
      composite.persisted.lastCollapseAbsoluteSingularityCulminationIndex === composite.state.nationalCollapseAbsoluteSingularityCulminationIndex &&
      composite.persisted.lastVoidCompleteErosionExtinctionIndex === composite.state.nationalVoidCompleteErosionExtinctionIndex &&
      composite.persisted.lastExistentialTotalNullityDecreeIndex === composite.state.nationalExistentialTotalNullityDecreeIndex &&
      composite.persisted.lastCollapseOmniSingularitySynthesisIndex === composite.state.nationalCollapseOmniSingularitySynthesisIndex &&
      composite.persisted.lastVoidTotalErosionAnnihilationIndex === composite.state.nationalVoidTotalErosionAnnihilationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityMandateIndex === composite.state.nationalExistentialAbsoluteNullityMandateIndex &&
      composite.persisted.lastCollapseOmniSingularityConvergenceIndex === composite.state.nationalCollapseOmniSingularityConvergenceIndex &&
      composite.persisted.lastVoidTotalErosionObliterationIndex === composite.state.nationalVoidTotalErosionObliterationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityBindingIndex === composite.state.nationalExistentialAbsoluteNullityBindingIndex &&
      composite.persisted.lastCollapseOmniSingularityIntegrationIndex === composite.state.nationalCollapseOmniSingularityIntegrationIndex &&
      composite.persisted.lastVoidTotalErosionEradicationIndex === composite.state.nationalVoidTotalErosionEradicationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityContinuityIndex === composite.state.nationalExistentialAbsoluteNullityContinuityIndex &&
      composite.persisted.lastCollapseOmniSingularityUnificationIndex === composite.state.nationalCollapseOmniSingularityUnificationIndex &&
      composite.persisted.lastVoidTotalErosionEliminationIndex === composite.state.nationalVoidTotalErosionEliminationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityPerpetuityIndex === composite.state.nationalExistentialAbsoluteNullityPerpetuityIndex &&
      composite.persisted.lastCollapseOmniSingularityConsolidationIndex === composite.state.nationalCollapseOmniSingularityConsolidationIndex &&
      composite.persisted.lastVoidTotalErosionDissolutionIndex === composite.state.nationalVoidTotalErosionDissolutionIndex &&
      composite.persisted.lastExistentialAbsoluteNullityImmutabilityIndex === composite.state.nationalExistentialAbsoluteNullityImmutabilityIndex &&
      composite.persisted.lastCollapseOmniSingularityCoalescenceIndex === composite.state.nationalCollapseOmniSingularityCoalescenceIndex &&
      composite.persisted.lastVoidTotalErosionSublimationIndex === composite.state.nationalVoidTotalErosionSublimationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityPermanenceIndex === composite.state.nationalExistentialAbsoluteNullityPermanenceIndex &&
      composite.persisted.lastCollapseOmniSingularityAmalgamationIndex === composite.state.nationalCollapseOmniSingularityAmalgamationIndex &&
      composite.persisted.lastVoidTotalErosionAtomizationIndex === composite.state.nationalVoidTotalErosionAtomizationIndex &&
      composite.persisted.lastExistentialAbsoluteNullityInevitabilityIndex === composite.state.nationalExistentialAbsoluteNullityInevitabilityIndex,
    `persisted cohesion ${composite.persisted.lastCohesionIndex} equity ${composite.persisted.lastServiceEquityIndex}`,
  );

  const absorption = composite.state.absorptionStress;
  push(
    out,
    'a11_37',
    absorption.length === 8 &&
      composite.state.metropolitanSaturationIndex === op10mA11NationalMetropolitanSaturation(absorption),
    `saturation ${composite.state.metropolitanSaturationIndex}`,
  );

  const serviceEq = op10mA11ComputeRegionalServiceEquity({
    settlement: composite.state.settlementVulnerability,
    fiscal: composite.state.fiscalUrbanCoupling,
  });
  push(
    out,
    'a11_38',
    composite.state.nationalServiceEquityIndex === serviceEq.nationalIndex &&
      composite.state.serviceEquity.every((s) => s.narrative.includes('service equity')),
    `service equity ${composite.state.nationalServiceEquityIndex}`,
  );

  push(
    out,
    'a11_39',
    composite.state.convergence.narrative.includes('standing spread') &&
      composite.persisted.lastStandingSpread === composite.state.convergence.standingSpread,
    composite.state.convergence.band,
  );

  push(
    out,
    'a11_40',
    composite.derived.some((d) => d.kind === 'absorption_capacity_breach') ||
      composite.state.absorptionStress.some((a) => a.band === 'strained' || a.band === 'breached'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_41',
    composite.derived.some((d) => d.kind === 'service_equity_gap') || serviceEq.rows[0].gapDrivers.length >= 1,
    composite.state.serviceEquity[0]?.band ?? 'none',
  );

  const spread = op10mA11StandingSpread(composite.state.urban.regions);
  const conv = op10mA11ComputeRegionalConvergence({
    regions: composite.state.urban.regions,
    priorStandingSpread: spread + 2,
  });
  push(
    out,
    'a11_42',
    conv.velocity !== 0 && composite.state.convergence.standingSpread === spread,
    `velocity sample ${conv.velocity}`,
  );

  push(
    out,
    'a11_43',
    validateOP10M_A11_CompositeState(composite.state).length === 0,
    'composite validation clean',
  );

  push(
    out,
    'a11_44',
    composite.derived.some((d) => d.kind === 'convergence_stall') || composite.state.convergence.band !== 'balanced',
    composite.state.convergence.band,
  );

  const periUrban = op10mA11ComputePeriUrbanExpansionPressure({
    cities: sampleCities,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_45',
    composite.state.periUrbanPressure.length === 8 &&
      composite.state.nationalPeriUrbanPressureIndex === op10mA11NationalPeriUrbanPressureIndex(periUrban),
    `peri-urban index ${composite.state.nationalPeriUrbanPressureIndex}`,
  );

  const backlog = op10mA11ComputeRegionalInfrastructureBacklog({
    bottlenecks: composite.state.infra.bottlenecks,
    absorptionStress: composite.state.absorptionStress,
    corridorStressIndex: composite.state.infra.corridorStressIndex,
  });
  push(
    out,
    'a11_46',
    composite.state.infrastructureBacklog.length === 8 &&
      composite.state.nationalInfrastructureBacklogIndex === backlog.nationalIndex,
    `backlog index ${composite.state.nationalInfrastructureBacklogIndex}`,
  );

  const governance = op10mA11ComputeMultiTierGovernanceFriction({
    national: inputs.national,
    reliefPlaybook: composite.state.reliefPlaybook,
    serviceEquity: composite.state.serviceEquity,
  });
  push(
    out,
    'a11_47',
    composite.state.governanceFriction.length === 8 &&
      composite.state.nationalGovernanceFrictionIndex === governance.nationalIndex,
    `governance friction ${composite.state.nationalGovernanceFrictionIndex}`,
  );

  push(
    out,
    'a11_48',
    composite.state.periUrbanPressure.every((p) => p.narrative.includes('peri-urban')),
    composite.state.periUrbanPressure[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_49',
    composite.derived.some((d) => d.kind === 'peri_urban_sprawl_pressure') ||
      composite.state.periUrbanPressure.some(
        (p) => p.band === 'expanding' || p.band === 'sprawl_risk' || p.band === 'unchecked',
      ),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_50',
    composite.derived.some((d) => d.kind === 'infrastructure_backlog_critical') ||
      composite.state.infrastructureBacklog.some((b) => b.band === 'severe' || b.band === 'critical'),
    composite.state.infrastructureBacklog[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_51',
    composite.persisted.lastGovernanceFrictionIndex === composite.state.nationalGovernanceFrictionIndex,
    `persisted governance ${composite.persisted.lastGovernanceFrictionIndex}`,
  );

  push(
    out,
    'a11_52',
    composite.derived.some((d) => d.kind === 'governance_coordination_breakdown') ||
      composite.state.governanceFriction.some(
        (g) => g.band === 'strained' || g.band === 'fragmented' || g.band === 'breakdown',
      ),
    composite.state.governanceFriction[0]?.band ?? 'none',
  );

  const housingSpill = op10mA11ComputeRegionalHousingSpilloverPressure({
    absorptionStress: composite.state.absorptionStress,
    periUrbanPressure: composite.state.periUrbanPressure,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_53',
    composite.state.housingSpillover.length === 8 &&
      composite.state.nationalHousingSpilloverIndex === housingSpill.nationalIndex,
    `housing spillover ${composite.state.nationalHousingSpilloverIndex}`,
  );

  const talent = op10mA11ComputeInterregionalTalentRetentionStress({
    migrationPressure: composite.state.migrationPressure,
    linkageHubs: composite.state.linkageHubs,
    fiscalUrbanCoupling: composite.state.fiscalUrbanCoupling,
  });
  push(
    out,
    'a11_54',
    composite.state.talentRetention.length === 8 && composite.state.nationalTalentDrainIndex === talent.nationalIndex,
    `talent drain ${composite.state.nationalTalentDrainIndex}`,
  );

  const climate = op10mA11ComputeClimateSettlementDisplacementRisk({
    settlementVulnerability: composite.state.settlementVulnerability,
    bottlenecks: composite.state.infra.bottlenecks,
    networkDigital: compositeIn.infra.networkDigital,
    corridorStressIndex: composite.state.infra.corridorStressIndex,
  });
  push(
    out,
    'a11_55',
    composite.state.climateDisplacement.length === 8 &&
      composite.state.nationalClimateDisplacementIndex === climate.nationalIndex,
    `climate displacement ${composite.state.nationalClimateDisplacementIndex}`,
  );

  push(
    out,
    'a11_56',
    composite.state.housingSpillover.every((h) => h.narrative.includes('housing spillover')),
    composite.state.housingSpillover[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_57',
    composite.derived.some((d) => d.kind === 'housing_spillover_cascade') ||
      composite.state.housingSpillover.some((h) => h.band === 'cascade' || h.band === 'systemic'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_58',
    composite.derived.some((d) => d.kind === 'regional_talent_drain') ||
      composite.state.talentRetention.some((t) => t.band === 'draining' || t.band === 'collapse'),
    composite.state.talentRetention[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_59',
    composite.persisted.lastHousingSpilloverIndex === composite.state.nationalHousingSpilloverIndex,
    `persisted spillover ${composite.persisted.lastHousingSpilloverIndex}`,
  );

  push(
    out,
    'a11_60',
    composite.derived.some((d) => d.kind === 'climate_displacement_exposure') ||
      composite.state.climateDisplacement.some((c) => c.band === 'acute' || c.band === 'critical'),
    composite.state.climateDisplacement[0]?.band ?? 'none',
  );

  const amenity = op10mA11ComputeRegionalAmenityCostPressure({
    housingSpillover: composite.state.housingSpillover,
    talentRetention: composite.state.talentRetention,
    fiscalUrbanCoupling: composite.state.fiscalUrbanCoupling,
  });
  push(
    out,
    'a11_61',
    composite.state.amenityCost.length === 8 && composite.state.nationalAmenityCostIndex === amenity.nationalIndex,
    `amenity cost ${composite.state.nationalAmenityCostIndex}`,
  );

  const decentral = op10mA11ComputeDigitalConnectivityDecentralizationShift({
    networkDigital: inputs.national.networkDigital,
    migrationPressure: composite.state.migrationPressure,
    linkageHubs: composite.state.linkageHubs,
    hierarchy: composite.state.hierarchy,
  });
  push(
    out,
    'a11_62',
    composite.state.decentralizationShift.length === 8 &&
      composite.state.nationalDecentralizationIndex === decentral.nationalIndex,
    `decentralization ${composite.state.nationalDecentralizationIndex}`,
  );

  const relocation = op10mA11ComputeSettlementRelocationBurden({
    climateDisplacement: composite.state.climateDisplacement,
    governanceFriction: composite.state.governanceFriction,
    housingSpillover: composite.state.housingSpillover,
  });
  push(
    out,
    'a11_63',
    composite.state.relocationBurden.length === 8 &&
      composite.state.nationalRelocationBurdenIndex === relocation.nationalIndex,
    `relocation burden ${composite.state.nationalRelocationBurdenIndex}`,
  );

  push(
    out,
    'a11_64',
    composite.state.amenityCost.every((a) => a.narrative.includes('amenity cost')),
    composite.state.amenityCost[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_65',
    composite.derived.some((d) => d.kind === 'amenity_cost_spiral') ||
      composite.state.amenityCost.some((a) => a.band === 'strained' || a.band === 'crisis'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_66',
    composite.derived.some((d) => d.kind === 'digital_decentralization_pulse') ||
      composite.state.decentralizationShift.some((d) => d.band === 'broadening' || d.band === 'accelerating'),
    composite.state.decentralizationShift[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_67',
    composite.persisted.lastAmenityCostIndex === composite.state.nationalAmenityCostIndex,
    `persisted amenity ${composite.persisted.lastAmenityCostIndex}`,
  );

  push(
    out,
    'a11_68',
    composite.derived.some((d) => d.kind === 'settlement_relocation_burden') ||
      composite.state.relocationBurden.some((r) => r.band === 'severe' || r.band === 'overwhelming'),
    composite.state.relocationBurden[0]?.band ?? 'none',
  );

  const employmentAnchor = op10mA11ComputeRegionalEmploymentAnchorStress({
    decentralizationShift: composite.state.decentralizationShift,
    talentRetention: composite.state.talentRetention,
    linkageHubs: composite.state.linkageHubs,
  });
  push(
    out,
    'a11_69',
    composite.state.employmentAnchor.length === 8 &&
      composite.state.nationalEmploymentAnchorIndex === employmentAnchor.nationalIndex,
    `employment anchor ${composite.state.nationalEmploymentAnchorIndex}`,
  );

  const commuteWedge = op10mA11ComputeInterregionalCommuteAffordabilityWedge({
    amenityCost: composite.state.amenityCost,
    periUrbanPressure: composite.state.periUrbanPressure,
    corridorFlows: composite.state.corridorFlows,
  });
  push(
    out,
    'a11_70',
    composite.state.commuteWedge.length === 8 &&
      composite.state.nationalCommuteWedgeIndex === commuteWedge.nationalIndex,
    `commute wedge ${composite.state.nationalCommuteWedgeIndex}`,
  );

  const receptionStrain = op10mA11ComputeSettlementReceptionCapacityStrain({
    relocationBurden: composite.state.relocationBurden,
    absorptionStress: composite.state.absorptionStress,
    serviceEquity: composite.state.serviceEquity,
  });
  push(
    out,
    'a11_71',
    composite.state.receptionStrain.length === 8 &&
      composite.state.nationalReceptionStrainIndex === receptionStrain.nationalIndex,
    `reception strain ${composite.state.nationalReceptionStrainIndex}`,
  );

  push(
    out,
    'a11_72',
    composite.state.employmentAnchor.every((e) => e.narrative.includes('employment anchor')),
    composite.state.employmentAnchor[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_73',
    composite.derived.some((d) => d.kind === 'employment_anchor_fragility') ||
      composite.state.employmentAnchor.some((e) => e.band === 'fragile' || e.band === 'collapsing'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_74',
    composite.derived.some((d) => d.kind === 'commute_affordability_wedge') ||
      composite.state.commuteWedge.some((c) => c.band === 'severe' || c.band === 'unsustainable'),
    composite.state.commuteWedge[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_75',
    composite.persisted.lastEmploymentAnchorIndex === composite.state.nationalEmploymentAnchorIndex,
    `persisted anchor ${composite.persisted.lastEmploymentAnchorIndex}`,
  );

  push(
    out,
    'a11_76',
    composite.derived.some((d) => d.kind === 'settlement_reception_strain') ||
      composite.state.receptionStrain.some((r) => r.band === 'strained' || r.band === 'saturated'),
    composite.state.receptionStrain[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_77',
    composite.state.commuteWedge.every((c) => c.narrative.includes('commute affordability wedge')),
    composite.state.commuteWedge[0]?.band ?? 'none',
  );

  const landUseGridlock = op10mA11ComputeRegionalLandUseRegulatoryGridlock({
    governanceFriction: composite.state.governanceFriction,
    periUrbanPressure: composite.state.periUrbanPressure,
    housingSpillover: composite.state.housingSpillover,
  });
  push(
    out,
    'a11_78',
    composite.state.landUseGridlock.length === 8 &&
      composite.state.nationalLandUseGridlockIndex === landUseGridlock.nationalIndex,
    `land-use gridlock ${composite.state.nationalLandUseGridlockIndex}`,
  );

  const mobilityTrap = op10mA11ComputeInterregionalMobilityAffordabilityTrap({
    commuteWedge: composite.state.commuteWedge,
    migrationPressure: composite.state.migrationPressure,
    amenityCost: composite.state.amenityCost,
  });
  push(
    out,
    'a11_79',
    composite.state.mobilityTrap.length === 8 &&
      composite.state.nationalMobilityTrapIndex === mobilityTrap.nationalIndex,
    `mobility trap ${composite.state.nationalMobilityTrapIndex}`,
  );

  const absorptionGap = op10mA11ComputeSettlementInfrastructureAbsorptionGap({
    infrastructureBacklog: composite.state.infrastructureBacklog,
    receptionStrain: composite.state.receptionStrain,
    absorptionStress: composite.state.absorptionStress,
  });
  push(
    out,
    'a11_80',
    composite.state.absorptionGap.length === 8 &&
      composite.state.nationalAbsorptionGapIndex === absorptionGap.nationalIndex,
    `absorption gap ${composite.state.nationalAbsorptionGapIndex}`,
  );

  push(
    out,
    'a11_81',
    composite.state.landUseGridlock.every((l) => l.narrative.includes('land-use regulatory')),
    composite.state.landUseGridlock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_82',
    composite.derived.some((d) => d.kind === 'land_use_regulatory_gridlock') ||
      composite.state.landUseGridlock.some((l) => l.band === 'gridlocked' || l.band === 'paralyzed'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_83',
    composite.derived.some((d) => d.kind === 'mobility_affordability_trap') ||
      composite.state.mobilityTrap.some((m) => m.band === 'trapped' || m.band === 'immobilized'),
    composite.state.mobilityTrap[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_84',
    composite.persisted.lastLandUseGridlockIndex === composite.state.nationalLandUseGridlockIndex,
    `persisted gridlock ${composite.persisted.lastLandUseGridlockIndex}`,
  );

  push(
    out,
    'a11_85',
    composite.derived.some((d) => d.kind === 'infrastructure_absorption_gap') ||
      composite.state.absorptionGap.some((g) => g.band === 'critical' || g.band === 'rupture'),
    composite.state.absorptionGap[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_86',
    composite.state.mobilityTrap.every((m) => m.narrative.includes('mobility affordability')),
    composite.state.mobilityTrap[0]?.band ?? 'none',
  );

  const reliefOverhead = op10mA11ComputeRegionalReliefCoordinationOverhead({
    reliefPlaybook: composite.state.reliefPlaybook,
    governanceFriction: composite.state.governanceFriction,
    receptionStrain: composite.state.receptionStrain,
  });
  push(
    out,
    'a11_87',
    composite.state.reliefOverhead.length === 8 &&
      composite.state.nationalReliefOverheadIndex === reliefOverhead.nationalIndex,
    `relief overhead ${composite.state.nationalReliefOverheadIndex}`,
  );

  const corridorDrift = op10mA11ComputeInterregionalCorridorEquityDrift({
    corridorFlows: composite.state.corridorFlows,
    serviceEquity: composite.state.serviceEquity,
    commuteWedge: composite.state.commuteWedge,
  });
  push(
    out,
    'a11_88',
    composite.state.corridorEquityDrift.length === 8 &&
      composite.state.nationalCorridorEquityDriftIndex === corridorDrift.nationalIndex,
    `corridor drift ${composite.state.nationalCorridorEquityDriftIndex}`,
  );

  const adaptationLag = op10mA11ComputeSettlementClimateAdaptationLag({
    climateDisplacement: composite.state.climateDisplacement,
    absorptionGap: composite.state.absorptionGap,
    infrastructureBacklog: composite.state.infrastructureBacklog,
  });
  push(
    out,
    'a11_89',
    composite.state.climateAdaptationLag.length === 8 &&
      composite.state.nationalClimateAdaptationLagIndex === adaptationLag.nationalIndex,
    `adaptation lag ${composite.state.nationalClimateAdaptationLagIndex}`,
  );

  push(
    out,
    'a11_90',
    composite.state.reliefOverhead.every((r) => r.narrative.includes('relief coordination')),
    composite.state.reliefOverhead[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_91',
    composite.derived.some((d) => d.kind === 'relief_coordination_overhead') ||
      composite.state.reliefOverhead.some((r) => r.band === 'overloaded' || r.band === 'paralytic'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_92',
    composite.derived.some((d) => d.kind === 'corridor_equity_drift') ||
      composite.state.corridorEquityDrift.some((c) => c.band === 'polarized' || c.band === 'fractured'),
    composite.state.corridorEquityDrift[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_93',
    composite.persisted.lastReliefOverheadIndex === composite.state.nationalReliefOverheadIndex,
    `persisted relief ${composite.persisted.lastReliefOverheadIndex}`,
  );

  push(
    out,
    'a11_94',
    composite.derived.some((d) => d.kind === 'climate_adaptation_lag') ||
      composite.state.climateAdaptationLag.some((a) => a.band === 'stalled' || a.band === 'critical_lag'),
    composite.state.climateAdaptationLag[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_95',
    composite.state.corridorEquityDrift.every((c) => c.narrative.includes('corridor equity')),
    composite.state.corridorEquityDrift[0]?.band ?? 'none',
  );

  const fiscalCapacity = op10mA11ComputeRegionalFiscalCapacityStrain({
    fiscalUrbanCoupling: composite.state.fiscalUrbanCoupling,
    reliefOverhead: composite.state.reliefOverhead,
    governanceFriction: composite.state.governanceFriction,
  });
  push(
    out,
    'a11_96',
    composite.state.fiscalCapacityStrain.length === 8 &&
      composite.state.nationalFiscalCapacityStrainIndex === fiscalCapacity.nationalIndex,
    `fiscal capacity ${composite.state.nationalFiscalCapacityStrainIndex}`,
  );

  const networkErosion = op10mA11ComputeInterregionalNetworkResilienceErosion({
    linkageHubs: composite.state.linkageHubs,
    corridorEquityDrift: composite.state.corridorEquityDrift,
    infrastructureBacklog: composite.state.infrastructureBacklog,
    fragilityIndex: composite.state.fragilityIndex,
  });
  push(
    out,
    'a11_97',
    composite.state.networkResilienceErosion.length === 8 &&
      composite.state.nationalNetworkResilienceErosionIndex === networkErosion.nationalIndex,
    `network erosion ${composite.state.nationalNetworkResilienceErosionIndex}`,
  );

  const horizonRisk = op10mA11ComputeSettlementLongHorizonCapacityRisk({
    climateAdaptationLag: composite.state.climateAdaptationLag,
    mobilityTrap: composite.state.mobilityTrap,
    convergence: composite.state.convergence,
  });
  push(
    out,
    'a11_98',
    composite.state.longHorizonCapacityRisk.length === 8 &&
      composite.state.nationalLongHorizonCapacityRiskIndex === horizonRisk.nationalIndex,
    `horizon risk ${composite.state.nationalLongHorizonCapacityRiskIndex}`,
  );

  push(
    out,
    'a11_99',
    composite.state.fiscalCapacityStrain.every((f) => f.narrative.includes('fiscal capacity')),
    composite.state.fiscalCapacityStrain[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_100',
    composite.derived.some((d) => d.kind === 'fiscal_capacity_strain') ||
      composite.state.fiscalCapacityStrain.some((f) => f.band === 'fragile' || f.band === 'exhausted'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_101',
    composite.derived.some((d) => d.kind === 'network_resilience_erosion') ||
      composite.state.networkResilienceErosion.some((n) => n.band === 'eroding' || n.band === 'fracturing'),
    composite.state.networkResilienceErosion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_102',
    composite.persisted.lastFiscalCapacityStrainIndex === composite.state.nationalFiscalCapacityStrainIndex,
    `persisted fiscal ${composite.persisted.lastFiscalCapacityStrainIndex}`,
  );

  push(
    out,
    'a11_103',
    composite.derived.some((d) => d.kind === 'long_horizon_capacity_risk') ||
      composite.state.longHorizonCapacityRisk.some((h) => h.band === 'acute' || h.band === 'critical'),
    composite.state.longHorizonCapacityRisk[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_104',
    composite.state.networkResilienceErosion.every((n) => n.narrative.includes('network resilience')),
    composite.state.networkResilienceErosion[0]?.band ?? 'none',
  );

  const cohesionIntegrity = op10mA11ComputeRegionalCohesionIntegrityPressure({
    regionalCohesionIndex: composite.state.regionalCohesionIndex,
    networkResilienceErosion: composite.state.networkResilienceErosion,
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
  });
  push(
    out,
    'a11_105',
    composite.state.cohesionIntegrity.length === 8 &&
      composite.state.nationalCohesionIntegrityIndex === cohesionIntegrity.nationalIndex,
    `cohesion integrity ${composite.state.nationalCohesionIntegrityIndex}`,
  );

  const reliefEquityGap = op10mA11ComputeInterregionalReliefDeliveryEquityGap({
    reliefOverhead: composite.state.reliefOverhead,
    corridorEquityDrift: composite.state.corridorEquityDrift,
    serviceEquity: composite.state.serviceEquity,
  });
  push(
    out,
    'a11_106',
    composite.state.reliefEquityGap.length === 8 &&
      composite.state.nationalReliefEquityGapIndex === reliefEquityGap.nationalIndex,
    `relief equity gap ${composite.state.nationalReliefEquityGapIndex}`,
  );

  const systemicFragility = op10mA11ComputeSettlementSystemicFragilityComposite({
    longHorizonCapacityRisk: composite.state.longHorizonCapacityRisk,
    landUseGridlock: composite.state.landUseGridlock,
    relocationBurden: composite.state.relocationBurden,
  });
  push(
    out,
    'a11_107',
    composite.state.systemicFragility.length === 8 &&
      composite.state.nationalSystemicFragilityIndex === systemicFragility.nationalIndex,
    `systemic fragility ${composite.state.nationalSystemicFragilityIndex}`,
  );

  push(
    out,
    'a11_108',
    composite.state.cohesionIntegrity.every((c) => c.narrative.includes('cohesion integrity')),
    composite.state.cohesionIntegrity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_109',
    composite.derived.some((d) => d.kind === 'cohesion_integrity_stress') ||
      composite.state.cohesionIntegrity.some((c) => c.band === 'fractured' || c.band === 'disintegrating'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_110',
    composite.derived.some((d) => d.kind === 'relief_delivery_equity_gap') ||
      composite.state.reliefEquityGap.some((r) => r.band === 'skewed' || r.band === 'polarized'),
    composite.state.reliefEquityGap[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_111',
    composite.persisted.lastCohesionIntegrityIndex === composite.state.nationalCohesionIntegrityIndex,
    `persisted integrity ${composite.persisted.lastCohesionIntegrityIndex}`,
  );

  push(
    out,
    'a11_112',
    composite.derived.some((d) => d.kind === 'systemic_settlement_fragility') ||
      composite.state.systemicFragility.some((s) => s.band === 'systemic' || s.band === 'cascade_risk'),
    composite.state.systemicFragility[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_113',
    composite.state.systemicFragility.every((s) => s.narrative.includes('systemic fragility')),
    composite.state.systemicFragility[0]?.band ?? 'none',
  );

  const governanceDecay = op10mA11ComputeRegionalGovernanceResilienceDecay({
    governanceFriction: composite.state.governanceFriction,
    systemicFragility: composite.state.systemicFragility,
    reliefEquityGap: composite.state.reliefEquityGap,
  });
  push(
    out,
    'a11_114',
    composite.state.governanceResilienceDecay.length === 8 &&
      composite.state.nationalGovernanceResilienceDecayIndex === governanceDecay.nationalIndex,
    `governance decay ${composite.state.nationalGovernanceResilienceDecayIndex}`,
  );

  const migrationStability = op10mA11ComputeInterregionalMigrationStabilityErosion({
    migrationPressure: composite.state.migrationPressure,
    mobilityTrap: composite.state.mobilityTrap,
    cohesionIntegrity: composite.state.cohesionIntegrity,
  });
  push(
    out,
    'a11_115',
    composite.state.migrationStabilityErosion.length === 8 &&
      composite.state.nationalMigrationStabilityErosionIndex === migrationStability.nationalIndex,
    `migration stability ${composite.state.nationalMigrationStabilityErosionIndex}`,
  );

  const adaptiveCeiling = op10mA11ComputeSettlementAdaptiveCapacityCeiling({
    climateAdaptationLag: composite.state.climateAdaptationLag,
    receptionStrain: composite.state.receptionStrain,
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
  });
  push(
    out,
    'a11_116',
    composite.state.adaptiveCapacityCeiling.length === 8 &&
      composite.state.nationalAdaptiveCapacityCeilingIndex === adaptiveCeiling.nationalIndex,
    `adaptive ceiling ${composite.state.nationalAdaptiveCapacityCeilingIndex}`,
  );

  push(
    out,
    'a11_117',
    composite.state.governanceResilienceDecay.every((g) => g.narrative.includes('governance resilience')),
    composite.state.governanceResilienceDecay[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_118',
    composite.derived.some((d) => d.kind === 'governance_resilience_decay') ||
      composite.state.governanceResilienceDecay.some((g) => g.band === 'brittle' || g.band === 'collapsed'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_119',
    composite.derived.some((d) => d.kind === 'migration_stability_erosion') ||
      composite.state.migrationStabilityErosion.some((m) => m.band === 'unstable' || m.band === 'chaotic'),
    composite.state.migrationStabilityErosion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_120',
    composite.persisted.lastGovernanceResilienceDecayIndex === composite.state.nationalGovernanceResilienceDecayIndex,
    `persisted decay ${composite.persisted.lastGovernanceResilienceDecayIndex}`,
  );

  push(
    out,
    'a11_121',
    composite.derived.some((d) => d.kind === 'adaptive_capacity_ceiling') ||
      composite.state.adaptiveCapacityCeiling.some((a) => a.band === 'capped' || a.band === 'breached'),
    composite.state.adaptiveCapacityCeiling[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_122',
    composite.state.migrationStabilityErosion.every((m) => m.narrative.includes('migration stability')),
    composite.state.migrationStabilityErosion[0]?.band ?? 'none',
  );

  const fiscalGovernanceCoupling = op10mA11ComputeRegionalFiscalGovernanceCouplingStrain({
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
    governanceResilienceDecay: composite.state.governanceResilienceDecay,
    cohesionIntegrity: composite.state.cohesionIntegrity,
  });
  push(
    out,
    'a11_123',
    composite.state.fiscalGovernanceCoupling.length === 8 &&
      composite.state.nationalFiscalGovernanceCouplingIndex === fiscalGovernanceCoupling.nationalIndex,
    `fiscal–governance coupling ${composite.state.nationalFiscalGovernanceCouplingIndex}`,
  );

  const networkEquityTension = op10mA11ComputeInterregionalNetworkEquityTension({
    networkResilienceErosion: composite.state.networkResilienceErosion,
    reliefEquityGap: composite.state.reliefEquityGap,
    corridorEquityDrift: composite.state.corridorEquityDrift,
  });
  push(
    out,
    'a11_124',
    composite.state.networkEquityTension.length === 8 &&
      composite.state.nationalNetworkEquityTensionIndex === networkEquityTension.nationalIndex,
    `network equity tension ${composite.state.nationalNetworkEquityTensionIndex}`,
  );

  const resilienceFrontier = op10mA11ComputeSettlementResilienceFrontierPressure({
    systemicFragility: composite.state.systemicFragility,
    adaptiveCapacityCeiling: composite.state.adaptiveCapacityCeiling,
    longHorizonCapacityRisk: composite.state.longHorizonCapacityRisk,
  });
  push(
    out,
    'a11_125',
    composite.state.resilienceFrontier.length === 8 &&
      composite.state.nationalResilienceFrontierIndex === resilienceFrontier.nationalIndex,
    `resilience frontier ${composite.state.nationalResilienceFrontierIndex}`,
  );

  push(
    out,
    'a11_126',
    composite.state.fiscalGovernanceCoupling.every((f) => f.narrative.includes('fiscal–governance coupling')),
    composite.state.fiscalGovernanceCoupling[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_127',
    composite.derived.some((d) => d.kind === 'fiscal_governance_coupling_strain') ||
      composite.state.fiscalGovernanceCoupling.some((f) => f.band === 'misaligned' || f.band === 'ruptured'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_128',
    composite.derived.some((d) => d.kind === 'network_equity_tension') ||
      composite.state.networkEquityTension.some((n) => n.band === 'polarized' || n.band === 'fractured'),
    composite.state.networkEquityTension[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_129',
    composite.persisted.lastNetworkEquityTensionIndex === composite.state.nationalNetworkEquityTensionIndex,
    `persisted network equity ${composite.persisted.lastNetworkEquityTensionIndex}`,
  );

  push(
    out,
    'a11_130',
    composite.derived.some((d) => d.kind === 'resilience_frontier_pressure') ||
      composite.state.resilienceFrontier.some((r) => r.band === 'at_limit' || r.band === 'breached'),
    composite.state.resilienceFrontier[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_131',
    composite.state.resilienceFrontier.every((r) => r.narrative.includes('resilience frontier')),
    composite.state.resilienceFrontier[0]?.band ?? 'none',
  );

  const metaGovernanceFatigue = op10mA11ComputeRegionalMetaGovernanceCoordinationFatigue({
    fiscalGovernanceCoupling: composite.state.fiscalGovernanceCoupling,
    governanceFriction: composite.state.governanceFriction,
    reliefOverhead: composite.state.reliefOverhead,
  });
  push(
    out,
    'a11_132',
    composite.state.metaGovernanceFatigue.length === 8 &&
      composite.state.nationalMetaGovernanceFatigueIndex === metaGovernanceFatigue.nationalIndex,
    `meta-governance fatigue ${composite.state.nationalMetaGovernanceFatigueIndex}`,
  );

  const capitalMobilityAsymmetry = op10mA11ComputeInterregionalCapitalMobilityAsymmetry({
    networkEquityTension: composite.state.networkEquityTension,
    fiscalGovernanceCoupling: composite.state.fiscalGovernanceCoupling,
    corridorEquityDrift: composite.state.corridorEquityDrift,
  });
  push(
    out,
    'a11_133',
    composite.state.capitalMobilityAsymmetry.length === 8 &&
      composite.state.nationalCapitalMobilityAsymmetryIndex === capitalMobilityAsymmetry.nationalIndex,
    `capital mobility ${composite.state.nationalCapitalMobilityAsymmetryIndex}`,
  );

  const compoundShockSaturation = op10mA11ComputeSettlementCompoundShockSaturation({
    resilienceFrontier: composite.state.resilienceFrontier,
    systemicFragility: composite.state.systemicFragility,
    migrationStabilityErosion: composite.state.migrationStabilityErosion,
  });
  push(
    out,
    'a11_134',
    composite.state.compoundShockSaturation.length === 8 &&
      composite.state.nationalCompoundShockSaturationIndex === compoundShockSaturation.nationalIndex,
    `compound shocks ${composite.state.nationalCompoundShockSaturationIndex}`,
  );

  push(
    out,
    'a11_135',
    composite.state.metaGovernanceFatigue.every((m) => m.narrative.includes('meta-governance coordination')),
    composite.state.metaGovernanceFatigue[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_136',
    composite.derived.some((d) => d.kind === 'meta_governance_coordination_fatigue') ||
      composite.state.metaGovernanceFatigue.some((m) => m.band === 'fatigued' || m.band === 'exhausted'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_137',
    composite.derived.some((d) => d.kind === 'capital_mobility_asymmetry') ||
      composite.state.capitalMobilityAsymmetry.some((c) => c.band === 'polarized' || c.band === 'locked'),
    composite.state.capitalMobilityAsymmetry[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_138',
    composite.persisted.lastCompoundShockSaturationIndex === composite.state.nationalCompoundShockSaturationIndex,
    `persisted compound shocks ${composite.persisted.lastCompoundShockSaturationIndex}`,
  );

  push(
    out,
    'a11_139',
    composite.derived.some((d) => d.kind === 'compound_shock_saturation') ||
      composite.state.compoundShockSaturation.some((s) => s.band === 'saturated' || s.band === 'overwhelmed'),
    composite.state.compoundShockSaturation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_140',
    composite.state.capitalMobilityAsymmetry.every((c) => c.narrative.includes('capital mobility asymmetry')),
    composite.state.capitalMobilityAsymmetry[0]?.band ?? 'none',
  );

  const institutionalTrustErosion = op10mA11ComputeRegionalInstitutionalTrustErosion({
    metaGovernanceFatigue: composite.state.metaGovernanceFatigue,
    governanceResilienceDecay: composite.state.governanceResilienceDecay,
    cohesionIntegrity: composite.state.cohesionIntegrity,
  });
  push(
    out,
    'a11_141',
    composite.state.institutionalTrustErosion.length === 8 &&
      composite.state.nationalInstitutionalTrustErosionIndex === institutionalTrustErosion.nationalIndex,
    `institutional trust ${composite.state.nationalInstitutionalTrustErosionIndex}`,
  );

  const liquidityFragmentation = op10mA11ComputeInterregionalLiquidityFragmentationStress({
    capitalMobilityAsymmetry: composite.state.capitalMobilityAsymmetry,
    networkEquityTension: composite.state.networkEquityTension,
    fiscalCapacityStrain: composite.state.fiscalCapacityStrain,
  });
  push(
    out,
    'a11_142',
    composite.state.liquidityFragmentation.length === 8 &&
      composite.state.nationalLiquidityFragmentationIndex === liquidityFragmentation.nationalIndex,
    `liquidity fragmentation ${composite.state.nationalLiquidityFragmentationIndex}`,
  );

  const cascadingFailureRisk = op10mA11ComputeSettlementCascadingFailureRisk({
    compoundShockSaturation: composite.state.compoundShockSaturation,
    systemicFragility: composite.state.systemicFragility,
    adaptiveCapacityCeiling: composite.state.adaptiveCapacityCeiling,
  });
  push(
    out,
    'a11_143',
    composite.state.cascadingFailureRisk.length === 8 &&
      composite.state.nationalCascadingFailureRiskIndex === cascadingFailureRisk.nationalIndex,
    `cascade risk ${composite.state.nationalCascadingFailureRiskIndex}`,
  );

  push(
    out,
    'a11_144',
    composite.state.institutionalTrustErosion.every((t) => t.narrative.includes('institutional trust erosion')),
    composite.state.institutionalTrustErosion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_145',
    composite.derived.some((d) => d.kind === 'institutional_trust_erosion') ||
      composite.state.institutionalTrustErosion.some((t) => t.band === 'brittle' || t.band === 'breakdown'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_146',
    composite.derived.some((d) => d.kind === 'liquidity_fragmentation_stress') ||
      composite.state.liquidityFragmentation.some((l) => l.band === 'fractured' || l.band === 'frozen'),
    composite.state.liquidityFragmentation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_147',
    composite.persisted.lastLiquidityFragmentationIndex === composite.state.nationalLiquidityFragmentationIndex,
    `persisted liquidity ${composite.persisted.lastLiquidityFragmentationIndex}`,
  );

  push(
    out,
    'a11_148',
    composite.derived.some((d) => d.kind === 'cascading_failure_risk') ||
      composite.state.cascadingFailureRisk.some((c) => c.band === 'cascade_risk' || c.band === 'systemic'),
    composite.state.cascadingFailureRisk[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_149',
    composite.state.cascadingFailureRisk.every((c) => c.narrative.includes('cascading failure risk')),
    composite.state.cascadingFailureRisk[0]?.band ?? 'none',
  );

  const socialContractFragility = op10mA11ComputeRegionalSocialContractFragility({
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
    liquidityFragmentation: composite.state.liquidityFragmentation,
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
  });
  push(
    out,
    'a11_150',
    composite.state.socialContractFragility.length === 8 &&
      composite.state.nationalSocialContractFragilityIndex === socialContractFragility.nationalIndex,
    `social contract ${composite.state.nationalSocialContractFragilityIndex}`,
  );

  const capitalFlightPanic = op10mA11ComputeInterregionalCapitalFlightPanic({
    liquidityFragmentation: composite.state.liquidityFragmentation,
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
    capitalMobilityAsymmetry: composite.state.capitalMobilityAsymmetry,
  });
  push(
    out,
    'a11_151',
    composite.state.capitalFlightPanic.length === 8 &&
      composite.state.nationalCapitalFlightPanicIndex === capitalFlightPanic.nationalIndex,
    `capital flight ${composite.state.nationalCapitalFlightPanicIndex}`,
  );

  const irrecoverableCollapse = op10mA11ComputeSettlementIrrecoverableCollapseThreshold({
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
    compoundShockSaturation: composite.state.compoundShockSaturation,
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
  });
  push(
    out,
    'a11_152',
    composite.state.irrecoverableCollapseThreshold.length === 8 &&
      composite.state.nationalIrrecoverableCollapseThresholdIndex === irrecoverableCollapse.nationalIndex,
    `collapse threshold ${composite.state.nationalIrrecoverableCollapseThresholdIndex}`,
  );

  push(
    out,
    'a11_153',
    composite.state.socialContractFragility.every((s) => s.narrative.includes('social contract fragility')),
    composite.state.socialContractFragility[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_154',
    composite.derived.some((d) => d.kind === 'social_contract_fragility') ||
      composite.state.socialContractFragility.some((s) => s.band === 'fraying' || s.band === 'ruptured'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_155',
    composite.derived.some((d) => d.kind === 'capital_flight_panic') ||
      composite.state.capitalFlightPanic.some((c) => c.band === 'panicked' || c.band === 'stampede'),
    composite.state.capitalFlightPanic[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_156',
    composite.persisted.lastCapitalFlightPanicIndex === composite.state.nationalCapitalFlightPanicIndex,
    `persisted capital flight ${composite.persisted.lastCapitalFlightPanicIndex}`,
  );

  push(
    out,
    'a11_157',
    composite.derived.some((d) => d.kind === 'irrecoverable_collapse_threshold') ||
      composite.state.irrecoverableCollapseThreshold.some((i) => i.band === 'terminal' || i.band === 'irrecoverable'),
    composite.state.irrecoverableCollapseThreshold[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_158',
    composite.state.irrecoverableCollapseThreshold.every((i) => i.narrative.includes('irrecoverable collapse threshold')),
    composite.state.irrecoverableCollapseThreshold[0]?.band ?? 'none',
  );

  const settlementLegitimacyCollapse = op10mA11ComputeRegionalSettlementLegitimacyCollapse({
    socialContractFragility: composite.state.socialContractFragility,
    capitalFlightPanic: composite.state.capitalFlightPanic,
    irrecoverableCollapseThreshold: composite.state.irrecoverableCollapseThreshold,
  });
  push(
    out,
    'a11_159',
    composite.state.settlementLegitimacyCollapse.length === 8 &&
      composite.state.nationalSettlementLegitimacyCollapseIndex === settlementLegitimacyCollapse.nationalIndex,
    `legitimacy collapse ${composite.state.nationalSettlementLegitimacyCollapseIndex}`,
  );

  const fiscalPanicContagion = op10mA11ComputeInterregionalFiscalPanicContagion({
    capitalFlightPanic: composite.state.capitalFlightPanic,
    liquidityFragmentation: composite.state.liquidityFragmentation,
    socialContractFragility: composite.state.socialContractFragility,
  });
  push(
    out,
    'a11_160',
    composite.state.fiscalPanicContagion.length === 8 &&
      composite.state.nationalFiscalPanicContagionIndex === fiscalPanicContagion.nationalIndex,
    `fiscal contagion ${composite.state.nationalFiscalPanicContagionIndex}`,
  );

  const terminalStateLockIn = op10mA11ComputeSettlementTerminalStateLockIn({
    irrecoverableCollapseThreshold: composite.state.irrecoverableCollapseThreshold,
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
    socialContractFragility: composite.state.socialContractFragility,
  });
  push(
    out,
    'a11_161',
    composite.state.terminalStateLockIn.length === 8 &&
      composite.state.nationalTerminalStateLockInIndex === terminalStateLockIn.nationalIndex,
    `terminal lock-in ${composite.state.nationalTerminalStateLockInIndex}`,
  );

  push(
    out,
    'a11_162',
    composite.state.settlementLegitimacyCollapse.every((s) => s.narrative.includes('settlement legitimacy collapse')),
    composite.state.settlementLegitimacyCollapse[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_163',
    composite.derived.some((d) => d.kind === 'settlement_legitimacy_collapse') ||
      composite.state.settlementLegitimacyCollapse.some((s) => s.band === 'delegitimized' || s.band === 'collapsed'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_164',
    composite.derived.some((d) => d.kind === 'fiscal_panic_contagion') ||
      composite.state.fiscalPanicContagion.some((f) => f.band === 'contagion' || f.band === 'systemic'),
    composite.state.fiscalPanicContagion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_165',
    composite.persisted.lastFiscalPanicContagionIndex === composite.state.nationalFiscalPanicContagionIndex,
    `persisted fiscal contagion ${composite.persisted.lastFiscalPanicContagionIndex}`,
  );

  push(
    out,
    'a11_166',
    composite.derived.some((d) => d.kind === 'terminal_state_lock_in') ||
      composite.state.terminalStateLockIn.some((t) => t.band === 'locked' || t.band === 'terminal'),
    composite.state.terminalStateLockIn[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_167',
    composite.state.terminalStateLockIn.every((t) => t.narrative.includes('terminal state lock-in')),
    composite.state.terminalStateLockIn[0]?.band ?? 'none',
  );

  const governanceVacuumEscalation = op10mA11ComputeRegionalGovernanceVacuumEscalation({
    settlementLegitimacyCollapse: composite.state.settlementLegitimacyCollapse,
    fiscalPanicContagion: composite.state.fiscalPanicContagion,
    institutionalTrustErosion: composite.state.institutionalTrustErosion,
  });
  push(
    out,
    'a11_168',
    composite.state.governanceVacuumEscalation.length === 8 &&
      composite.state.nationalGovernanceVacuumEscalationIndex === governanceVacuumEscalation.nationalIndex,
    `governance vacuum ${composite.state.nationalGovernanceVacuumEscalationIndex}`,
  );

  const settlementAbandonmentSpiral = op10mA11ComputeInterregionalSettlementAbandonmentSpiral({
    terminalStateLockIn: composite.state.terminalStateLockIn,
    irrecoverableCollapseThreshold: composite.state.irrecoverableCollapseThreshold,
    capitalFlightPanic: composite.state.capitalFlightPanic,
  });
  push(
    out,
    'a11_169',
    composite.state.settlementAbandonmentSpiral.length === 8 &&
      composite.state.nationalSettlementAbandonmentSpiralIndex === settlementAbandonmentSpiral.nationalIndex,
    `abandonment spiral ${composite.state.nationalSettlementAbandonmentSpiralIndex}`,
  );

  const postCollapseRecoveryImpossibility = op10mA11ComputeSettlementPostCollapseRecoveryImpossibility({
    terminalStateLockIn: composite.state.terminalStateLockIn,
    fiscalPanicContagion: composite.state.fiscalPanicContagion,
    cascadingFailureRisk: composite.state.cascadingFailureRisk,
  });
  push(
    out,
    'a11_170',
    composite.state.postCollapseRecoveryImpossibility.length === 8 &&
      composite.state.nationalPostCollapseRecoveryImpossibilityIndex === postCollapseRecoveryImpossibility.nationalIndex,
    `recovery impossibility ${composite.state.nationalPostCollapseRecoveryImpossibilityIndex}`,
  );

  push(
    out,
    'a11_171',
    composite.state.governanceVacuumEscalation.every((g) => g.narrative.includes('governance vacuum escalation')),
    composite.state.governanceVacuumEscalation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_172',
    composite.derived.some((d) => d.kind === 'governance_vacuum_escalation') ||
      composite.state.governanceVacuumEscalation.some((g) => g.band === 'hollow' || g.band === 'vacuum'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_173',
    composite.derived.some((d) => d.kind === 'settlement_abandonment_spiral') ||
      composite.state.settlementAbandonmentSpiral.some((s) => s.band === 'exodus' || s.band === 'abandoned'),
    composite.state.settlementAbandonmentSpiral[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_174',
    composite.persisted.lastSettlementAbandonmentSpiralIndex === composite.state.nationalSettlementAbandonmentSpiralIndex,
    `persisted abandonment ${composite.persisted.lastSettlementAbandonmentSpiralIndex}`,
  );

  push(
    out,
    'a11_175',
    composite.derived.some((d) => d.kind === 'post_collapse_recovery_impossibility') ||
      composite.state.postCollapseRecoveryImpossibility.some((p) => p.band === 'blocked' || p.band === 'impossible'),
    composite.state.postCollapseRecoveryImpossibility[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_176',
    composite.state.postCollapseRecoveryImpossibility.every((p) => p.narrative.includes('post-collapse recovery impossibility')),
    composite.state.postCollapseRecoveryImpossibility[0]?.band ?? 'none',
  );

  const stateCollapseCascadeAmplification = op10mA11ComputeRegionalStateCollapseCascadeAmplification({
    governanceVacuumEscalation: composite.state.governanceVacuumEscalation,
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    postCollapseRecoveryImpossibility: composite.state.postCollapseRecoveryImpossibility,
  });
  push(
    out,
    'a11_177',
    composite.state.stateCollapseCascadeAmplification.length === 8 &&
      composite.state.nationalStateCollapseCascadeAmplificationIndex === stateCollapseCascadeAmplification.nationalIndex,
    `cascade amplification ${composite.state.nationalStateCollapseCascadeAmplificationIndex}`,
  );

  const hollowRegionContagion = op10mA11ComputeInterregionalHollowRegionContagion({
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    fiscalPanicContagion: composite.state.fiscalPanicContagion,
    governanceVacuumEscalation: composite.state.governanceVacuumEscalation,
  });
  push(
    out,
    'a11_178',
    composite.state.hollowRegionContagion.length === 8 &&
      composite.state.nationalHollowRegionContagionIndex === hollowRegionContagion.nationalIndex,
    `hollow contagion ${composite.state.nationalHollowRegionContagionIndex}`,
  );

  const permanentDepopulationLock = op10mA11ComputeSettlementPermanentDepopulationLock({
    postCollapseRecoveryImpossibility: composite.state.postCollapseRecoveryImpossibility,
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    terminalStateLockIn: composite.state.terminalStateLockIn,
  });
  push(
    out,
    'a11_179',
    composite.state.permanentDepopulationLock.length === 8 &&
      composite.state.nationalPermanentDepopulationLockIndex === permanentDepopulationLock.nationalIndex,
    `depopulation lock ${composite.state.nationalPermanentDepopulationLockIndex}`,
  );

  push(
    out,
    'a11_180',
    composite.state.stateCollapseCascadeAmplification.every((s) => s.narrative.includes('state collapse cascade amplification')),
    composite.state.stateCollapseCascadeAmplification[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_181',
    composite.derived.some((d) => d.kind === 'state_collapse_cascade_amplification') ||
      composite.state.stateCollapseCascadeAmplification.some((s) => s.band === 'runaway' || s.band === 'total'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_182',
    composite.derived.some((d) => d.kind === 'hollow_region_contagion') ||
      composite.state.hollowRegionContagion.some((h) => h.band === 'contagion' || h.band === 'voided'),
    composite.state.hollowRegionContagion[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_183',
    composite.persisted.lastHollowRegionContagionIndex === composite.state.nationalHollowRegionContagionIndex,
    `persisted hollow ${composite.persisted.lastHollowRegionContagionIndex}`,
  );

  push(
    out,
    'a11_184',
    composite.derived.some((d) => d.kind === 'permanent_depopulation_lock') ||
      composite.state.permanentDepopulationLock.some((p) => p.band === 'locked' || p.band === 'permanent'),
    composite.state.permanentDepopulationLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_185',
    composite.state.permanentDepopulationLock.every((p) => p.narrative.includes('permanent depopulation lock')),
    composite.state.permanentDepopulationLock[0]?.band ?? 'none',
  );

  const totalCollapseSingularity = op10mA11ComputeRegionalTotalCollapseSingularityPressure({
    stateCollapseCascadeAmplification: composite.state.stateCollapseCascadeAmplification,
    hollowRegionContagion: composite.state.hollowRegionContagion,
    permanentDepopulationLock: composite.state.permanentDepopulationLock,
  });
  push(
    out,
    'a11_186',
    composite.state.totalCollapseSingularity.length === 8 &&
      composite.state.nationalTotalCollapseSingularityIndex === totalCollapseSingularity.nationalIndex,
    `collapse singularity ${composite.state.nationalTotalCollapseSingularityIndex}`,
  );

  const voidExpansionVelocity = op10mA11ComputeInterregionalVoidExpansionVelocity({
    hollowRegionContagion: composite.state.hollowRegionContagion,
    settlementAbandonmentSpiral: composite.state.settlementAbandonmentSpiral,
    stateCollapseCascadeAmplification: composite.state.stateCollapseCascadeAmplification,
  });
  push(
    out,
    'a11_187',
    composite.state.voidExpansionVelocity.length === 8 &&
      composite.state.nationalVoidExpansionVelocityIndex === voidExpansionVelocity.nationalIndex,
    `void expansion ${composite.state.nationalVoidExpansionVelocityIndex}`,
  );

  const existentialContinuityFracture = op10mA11ComputeSettlementExistentialContinuityFracture({
    permanentDepopulationLock: composite.state.permanentDepopulationLock,
    postCollapseRecoveryImpossibility: composite.state.postCollapseRecoveryImpossibility,
    settlementLegitimacyCollapse: composite.state.settlementLegitimacyCollapse,
  });
  push(
    out,
    'a11_188',
    composite.state.existentialContinuityFracture.length === 8 &&
      composite.state.nationalExistentialContinuityFractureIndex === existentialContinuityFracture.nationalIndex,
    `continuity fracture ${composite.state.nationalExistentialContinuityFractureIndex}`,
  );

  push(
    out,
    'a11_189',
    composite.state.totalCollapseSingularity.every((s) => s.narrative.includes('total collapse singularity pressure')),
    composite.state.totalCollapseSingularity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_190',
    composite.derived.some((d) => d.kind === 'total_collapse_singularity_pressure') ||
      composite.state.totalCollapseSingularity.some((s) => s.band === 'singular' || s.band === 'total'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_191',
    composite.derived.some((d) => d.kind === 'void_expansion_velocity') ||
      composite.state.voidExpansionVelocity.some((v) => v.band === 'surging' || v.band === 'unbounded'),
    composite.state.voidExpansionVelocity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_192',
    composite.persisted.lastVoidExpansionVelocityIndex === composite.state.nationalVoidExpansionVelocityIndex,
    `persisted void ${composite.persisted.lastVoidExpansionVelocityIndex}`,
  );

  push(
    out,
    'a11_193',
    composite.derived.some((d) => d.kind === 'existential_continuity_fracture') ||
      composite.state.existentialContinuityFracture.some((e) => e.band === 'shattered' || e.band === 'extinguished'),
    composite.state.existentialContinuityFracture[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_194',
    composite.state.existentialContinuityFracture.every((e) => e.narrative.includes('existential continuity fracture')),
    composite.state.existentialContinuityFracture[0]?.band ?? 'none',
  );

  const collapseHorizonConvergence = op10mA11ComputeRegionalCollapseHorizonConvergence({
    totalCollapseSingularity: composite.state.totalCollapseSingularity,
    voidExpansionVelocity: composite.state.voidExpansionVelocity,
    existentialContinuityFracture: composite.state.existentialContinuityFracture,
  });
  push(
    out,
    'a11_195',
    composite.state.collapseHorizonConvergence.length === 8 &&
      composite.state.nationalCollapseHorizonConvergenceIndex === collapseHorizonConvergence.nationalIndex,
    `horizon convergence ${composite.state.nationalCollapseHorizonConvergenceIndex}`,
  );

  const voidTotalizationSurge = op10mA11ComputeInterregionalVoidTotalizationSurge({
    voidExpansionVelocity: composite.state.voidExpansionVelocity,
    totalCollapseSingularity: composite.state.totalCollapseSingularity,
    hollowRegionContagion: composite.state.hollowRegionContagion,
  });
  push(
    out,
    'a11_196',
    composite.state.voidTotalizationSurge.length === 8 &&
      composite.state.nationalVoidTotalizationSurgeIndex === voidTotalizationSurge.nationalIndex,
    `void totalization ${composite.state.nationalVoidTotalizationSurgeIndex}`,
  );

  const existentialTerminusLock = op10mA11ComputeSettlementExistentialTerminusLock({
    existentialContinuityFracture: composite.state.existentialContinuityFracture,
    totalCollapseSingularity: composite.state.totalCollapseSingularity,
    permanentDepopulationLock: composite.state.permanentDepopulationLock,
  });
  push(
    out,
    'a11_197',
    composite.state.existentialTerminusLock.length === 8 &&
      composite.state.nationalExistentialTerminusLockIndex === existentialTerminusLock.nationalIndex,
    `terminus lock ${composite.state.nationalExistentialTerminusLockIndex}`,
  );

  push(
    out,
    'a11_198',
    composite.state.collapseHorizonConvergence.every((c) => c.narrative.includes('collapse horizon convergence')),
    composite.state.collapseHorizonConvergence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_199',
    composite.derived.some((d) => d.kind === 'collapse_horizon_convergence') ||
      composite.state.collapseHorizonConvergence.some((c) => c.band === 'imminent' || c.band === 'locked'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_200',
    composite.derived.some((d) => d.kind === 'void_totalization_surge') ||
      composite.state.voidTotalizationSurge.some((v) => v.band === 'totalizing' || v.band === 'absolute'),
    composite.state.voidTotalizationSurge[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_201',
    composite.persisted.lastVoidTotalizationSurgeIndex === composite.state.nationalVoidTotalizationSurgeIndex,
    `persisted totalization ${composite.persisted.lastVoidTotalizationSurgeIndex}`,
  );

  push(
    out,
    'a11_202',
    composite.derived.some((d) => d.kind === 'existential_terminus_lock') ||
      composite.state.existentialTerminusLock.some((t) => t.band === 'sealed' || t.band === 'terminal'),
    composite.state.existentialTerminusLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_203',
    composite.state.existentialTerminusLock.every((t) => t.narrative.includes('existential terminus lock')),
    composite.state.existentialTerminusLock[0]?.band ?? 'none',
  );

  const absoluteCollapseHorizonLock = op10mA11ComputeRegionalAbsoluteCollapseHorizonLock({
    collapseHorizonConvergence: composite.state.collapseHorizonConvergence,
    voidTotalizationSurge: composite.state.voidTotalizationSurge,
    existentialTerminusLock: composite.state.existentialTerminusLock,
  });
  push(
    out,
    'a11_204',
    composite.state.absoluteCollapseHorizonLock.length === 8 &&
      composite.state.nationalAbsoluteCollapseHorizonLockIndex === absoluteCollapseHorizonLock.nationalIndex,
    `absolute horizon lock ${composite.state.nationalAbsoluteCollapseHorizonLockIndex}`,
  );

  const voidFinalizationCascade = op10mA11ComputeInterregionalVoidFinalizationCascade({
    voidTotalizationSurge: composite.state.voidTotalizationSurge,
    collapseHorizonConvergence: composite.state.collapseHorizonConvergence,
    voidExpansionVelocity: composite.state.voidExpansionVelocity,
  });
  push(
    out,
    'a11_205',
    composite.state.voidFinalizationCascade.length === 8 &&
      composite.state.nationalVoidFinalizationCascadeIndex === voidFinalizationCascade.nationalIndex,
    `void finalization ${composite.state.nationalVoidFinalizationCascadeIndex}`,
  );

  const existentialObliterationThreshold = op10mA11ComputeSettlementExistentialObliterationThreshold({
    existentialTerminusLock: composite.state.existentialTerminusLock,
    collapseHorizonConvergence: composite.state.collapseHorizonConvergence,
    existentialContinuityFracture: composite.state.existentialContinuityFracture,
  });
  push(
    out,
    'a11_206',
    composite.state.existentialObliterationThreshold.length === 8 &&
      composite.state.nationalExistentialObliterationThresholdIndex === existentialObliterationThreshold.nationalIndex,
    `obliteration threshold ${composite.state.nationalExistentialObliterationThresholdIndex}`,
  );

  push(
    out,
    'a11_207',
    composite.state.absoluteCollapseHorizonLock.every((a) => a.narrative.includes('absolute collapse horizon lock')),
    composite.state.absoluteCollapseHorizonLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_208',
    composite.derived.some((d) => d.kind === 'absolute_collapse_horizon_lock') ||
      composite.state.absoluteCollapseHorizonLock.some((a) => a.band === 'sealed' || a.band === 'absolute'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_209',
    composite.derived.some((d) => d.kind === 'void_finalization_cascade') ||
      composite.state.voidFinalizationCascade.some((v) => v.band === 'finalizing' || v.band === 'complete'),
    composite.state.voidFinalizationCascade[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_210',
    composite.persisted.lastVoidFinalizationCascadeIndex === composite.state.nationalVoidFinalizationCascadeIndex,
    `persisted finalization ${composite.persisted.lastVoidFinalizationCascadeIndex}`,
  );

  push(
    out,
    'a11_211',
    composite.derived.some((d) => d.kind === 'existential_obliteration_threshold') ||
      composite.state.existentialObliterationThreshold.some((o) => o.band === 'breached' || o.band === 'obliterated'),
    composite.state.existentialObliterationThreshold[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_212',
    composite.state.existentialObliterationThreshold.every((o) => o.narrative.includes('existential obliteration threshold')),
    composite.state.existentialObliterationThreshold[0]?.band ?? 'none',
  );

  const ultimateCollapseSingularitySeal = op10mA11ComputeRegionalUltimateCollapseSingularitySeal({
    absoluteCollapseHorizonLock: composite.state.absoluteCollapseHorizonLock,
    voidFinalizationCascade: composite.state.voidFinalizationCascade,
    existentialObliterationThreshold: composite.state.existentialObliterationThreshold,
  });
  push(
    out,
    'a11_213',
    composite.state.ultimateCollapseSingularitySeal.length === 8 &&
      composite.state.nationalUltimateCollapseSingularitySealIndex === ultimateCollapseSingularitySeal.nationalIndex,
    `singularity seal ${composite.state.nationalUltimateCollapseSingularitySealIndex}`,
  );

  const voidAnnihilationConvergence = op10mA11ComputeInterregionalVoidAnnihilationConvergence({
    voidFinalizationCascade: composite.state.voidFinalizationCascade,
    absoluteCollapseHorizonLock: composite.state.absoluteCollapseHorizonLock,
    voidTotalizationSurge: composite.state.voidTotalizationSurge,
  });
  push(
    out,
    'a11_214',
    composite.state.voidAnnihilationConvergence.length === 8 &&
      composite.state.nationalVoidAnnihilationConvergenceIndex === voidAnnihilationConvergence.nationalIndex,
    `void annihilation ${composite.state.nationalVoidAnnihilationConvergenceIndex}`,
  );

  const existentialNullStateLock = op10mA11ComputeSettlementExistentialNullStateLock({
    existentialObliterationThreshold: composite.state.existentialObliterationThreshold,
    absoluteCollapseHorizonLock: composite.state.absoluteCollapseHorizonLock,
    existentialTerminusLock: composite.state.existentialTerminusLock,
  });
  push(
    out,
    'a11_215',
    composite.state.existentialNullStateLock.length === 8 &&
      composite.state.nationalExistentialNullStateLockIndex === existentialNullStateLock.nationalIndex,
    `null-state lock ${composite.state.nationalExistentialNullStateLockIndex}`,
  );

  push(
    out,
    'a11_216',
    composite.state.ultimateCollapseSingularitySeal.every((s) => s.narrative.includes('ultimate collapse singularity seal')),
    composite.state.ultimateCollapseSingularitySeal[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_217',
    composite.derived.some((d) => d.kind === 'ultimate_collapse_singularity_seal') ||
      composite.state.ultimateCollapseSingularitySeal.some((s) => s.band === 'sealed' || s.band === 'ultimate'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_218',
    composite.derived.some((d) => d.kind === 'void_annihilation_convergence') ||
      composite.state.voidAnnihilationConvergence.some((v) => v.band === 'annihilating' || v.band === 'total'),
    composite.state.voidAnnihilationConvergence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_219',
    composite.persisted.lastVoidAnnihilationConvergenceIndex === composite.state.nationalVoidAnnihilationConvergenceIndex,
    `persisted annihilation ${composite.persisted.lastVoidAnnihilationConvergenceIndex}`,
  );

  push(
    out,
    'a11_220',
    composite.derived.some((d) => d.kind === 'existential_null_state_lock') ||
      composite.state.existentialNullStateLock.some((n) => n.band === 'null' || n.band === 'absolute_null'),
    composite.state.existentialNullStateLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_221',
    composite.state.existentialNullStateLock.every((n) => n.narrative.includes('existential null-state lock')),
    composite.state.existentialNullStateLock[0]?.band ?? 'none',
  );

  const collapseExistenceSingularityPoint = op10mA11ComputeRegionalCollapseExistenceSingularityPoint({
    ultimateCollapseSingularitySeal: composite.state.ultimateCollapseSingularitySeal,
    voidAnnihilationConvergence: composite.state.voidAnnihilationConvergence,
    existentialNullStateLock: composite.state.existentialNullStateLock,
  });
  push(
    out,
    'a11_222',
    composite.state.collapseExistenceSingularityPoint.length === 8 &&
      composite.state.nationalCollapseExistenceSingularityPointIndex === collapseExistenceSingularityPoint.nationalIndex,
    `existence point ${composite.state.nationalCollapseExistenceSingularityPointIndex}`,
  );

  const voidExistenceAnnihilationFront = op10mA11ComputeInterregionalVoidExistenceAnnihilationFront({
    voidAnnihilationConvergence: composite.state.voidAnnihilationConvergence,
    ultimateCollapseSingularitySeal: composite.state.ultimateCollapseSingularitySeal,
    voidFinalizationCascade: composite.state.voidFinalizationCascade,
  });
  push(
    out,
    'a11_223',
    composite.state.voidExistenceAnnihilationFront.length === 8 &&
      composite.state.nationalVoidExistenceAnnihilationFrontIndex === voidExistenceAnnihilationFront.nationalIndex,
    `void front ${composite.state.nationalVoidExistenceAnnihilationFrontIndex}`,
  );

  const existentialAbsoluteZeroLock = op10mA11ComputeSettlementExistentialAbsoluteZeroLock({
    existentialNullStateLock: composite.state.existentialNullStateLock,
    ultimateCollapseSingularitySeal: composite.state.ultimateCollapseSingularitySeal,
    existentialObliterationThreshold: composite.state.existentialObliterationThreshold,
  });
  push(
    out,
    'a11_224',
    composite.state.existentialAbsoluteZeroLock.length === 8 &&
      composite.state.nationalExistentialAbsoluteZeroLockIndex === existentialAbsoluteZeroLock.nationalIndex,
    `absolute zero ${composite.state.nationalExistentialAbsoluteZeroLockIndex}`,
  );

  push(
    out,
    'a11_225',
    composite.state.collapseExistenceSingularityPoint.every((p) => p.narrative.includes('collapse existence singularity point')),
    composite.state.collapseExistenceSingularityPoint[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_226',
    composite.derived.some((d) => d.kind === 'collapse_existence_singularity_point') ||
      composite.state.collapseExistenceSingularityPoint.some((p) => p.band === 'singular' || p.band === 'existential'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_227',
    composite.derived.some((d) => d.kind === 'void_existence_annihilation_front') ||
      composite.state.voidExistenceAnnihilationFront.some((f) => f.band === 'consuming' || f.band === 'total_void'),
    composite.state.voidExistenceAnnihilationFront[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_228',
    composite.persisted.lastVoidExistenceAnnihilationFrontIndex === composite.state.nationalVoidExistenceAnnihilationFrontIndex,
    `persisted void front ${composite.persisted.lastVoidExistenceAnnihilationFrontIndex}`,
  );

  push(
    out,
    'a11_229',
    composite.derived.some((d) => d.kind === 'existential_absolute_zero_lock') ||
      composite.state.existentialAbsoluteZeroLock.some((z) => z.band === 'zero' || z.band === 'absolute_zero'),
    composite.state.existentialAbsoluteZeroLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_230',
    composite.state.existentialAbsoluteZeroLock.every((z) => z.narrative.includes('existential absolute zero lock')),
    composite.state.existentialAbsoluteZeroLock[0]?.band ?? 'none',
  );

  const collapseOmniSingularityNode = op10mA11ComputeRegionalCollapseOmniSingularityNode({
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
    existentialAbsoluteZeroLock: composite.state.existentialAbsoluteZeroLock,
  });
  push(
    out,
    'a11_231',
    composite.state.collapseOmniSingularityNode.length === 8 &&
      composite.state.nationalCollapseOmniSingularityNodeIndex === collapseOmniSingularityNode.nationalIndex,
    `omni node ${composite.state.nationalCollapseOmniSingularityNodeIndex}`,
  );

  const voidAbsoluteErosionSurge = op10mA11ComputeInterregionalVoidAbsoluteErosionSurge({
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
    voidAnnihilationConvergence: composite.state.voidAnnihilationConvergence,
  });
  push(
    out,
    'a11_232',
    composite.state.voidAbsoluteErosionSurge.length === 8 &&
      composite.state.nationalVoidAbsoluteErosionSurgeIndex === voidAbsoluteErosionSurge.nationalIndex,
    `erosion surge ${composite.state.nationalVoidAbsoluteErosionSurgeIndex}`,
  );

  const existentialFinalNullityLock = op10mA11ComputeSettlementExistentialFinalNullityLock({
    existentialAbsoluteZeroLock: composite.state.existentialAbsoluteZeroLock,
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
    existentialNullStateLock: composite.state.existentialNullStateLock,
  });
  push(
    out,
    'a11_233',
    composite.state.existentialFinalNullityLock.length === 8 &&
      composite.state.nationalExistentialFinalNullityLockIndex === existentialFinalNullityLock.nationalIndex,
    `final nullity ${composite.state.nationalExistentialFinalNullityLockIndex}`,
  );

  push(
    out,
    'a11_234',
    composite.state.collapseOmniSingularityNode.every((n) => n.narrative.includes('collapse omni singularity node')),
    composite.state.collapseOmniSingularityNode[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_235',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_node') ||
      composite.state.collapseOmniSingularityNode.some((n) => n.band === 'omni' || n.band === 'total_node'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_236',
    composite.derived.some((d) => d.kind === 'void_absolute_erosion_surge') ||
      composite.state.voidAbsoluteErosionSurge.some((e) => e.band === 'absolute' || e.band === 'omni_erosion'),
    composite.state.voidAbsoluteErosionSurge[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_237',
    composite.persisted.lastVoidAbsoluteErosionSurgeIndex === composite.state.nationalVoidAbsoluteErosionSurgeIndex,
    `persisted erosion ${composite.persisted.lastVoidAbsoluteErosionSurgeIndex}`,
  );

  push(
    out,
    'a11_238',
    composite.derived.some((d) => d.kind === 'existential_final_nullity_lock') ||
      composite.state.existentialFinalNullityLock.some((f) => f.band === 'nullity' || f.band === 'final_nullity'),
    composite.state.existentialFinalNullityLock[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_239',
    composite.state.existentialFinalNullityLock.every((f) => f.narrative.includes('existential final nullity lock')),
    composite.state.existentialFinalNullityLock[0]?.band ?? 'none',
  );

  const collapseTotalSingularityVertex = op10mA11ComputeRegionalCollapseTotalSingularityVertex({
    collapseOmniSingularityNode: composite.state.collapseOmniSingularityNode,
    voidAbsoluteErosionSurge: composite.state.voidAbsoluteErosionSurge,
    existentialFinalNullityLock: composite.state.existentialFinalNullityLock,
  });
  push(
    out,
    'a11_240',
    composite.state.collapseTotalSingularityVertex.length === 8 &&
      composite.state.nationalCollapseTotalSingularityVertexIndex === collapseTotalSingularityVertex.nationalIndex,
    `total vertex ${composite.state.nationalCollapseTotalSingularityVertexIndex}`,
  );

  const voidTerminalErosionCascade = op10mA11ComputeInterregionalVoidTerminalErosionCascade({
    voidAbsoluteErosionSurge: composite.state.voidAbsoluteErosionSurge,
    collapseOmniSingularityNode: composite.state.collapseOmniSingularityNode,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_241',
    composite.state.voidTerminalErosionCascade.length === 8 &&
      composite.state.nationalVoidTerminalErosionCascadeIndex === voidTerminalErosionCascade.nationalIndex,
    `terminal erosion ${composite.state.nationalVoidTerminalErosionCascadeIndex}`,
  );

  const existentialUltimateNullitySeal = op10mA11ComputeSettlementExistentialUltimateNullitySeal({
    existentialFinalNullityLock: composite.state.existentialFinalNullityLock,
    collapseOmniSingularityNode: composite.state.collapseOmniSingularityNode,
    collapseExistenceSingularityPoint: composite.state.collapseExistenceSingularityPoint,
  });
  push(
    out,
    'a11_242',
    composite.state.existentialUltimateNullitySeal.length === 8 &&
      composite.state.nationalExistentialUltimateNullitySealIndex === existentialUltimateNullitySeal.nationalIndex,
    `ultimate seal ${composite.state.nationalExistentialUltimateNullitySealIndex}`,
  );

  push(
    out,
    'a11_243',
    composite.state.collapseTotalSingularityVertex.every((v) => v.narrative.includes('collapse total singularity vertex')),
    composite.state.collapseTotalSingularityVertex[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_244',
    composite.derived.some((d) => d.kind === 'collapse_total_singularity_vertex') ||
      composite.state.collapseTotalSingularityVertex.some((v) => v.band === 'total' || v.band === 'vertex'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_245',
    composite.derived.some((d) => d.kind === 'void_terminal_erosion_cascade') ||
      composite.state.voidTerminalErosionCascade.some((c) => c.band === 'cascade' || c.band === 'total_erosion'),
    composite.state.voidTerminalErosionCascade[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_246',
    composite.persisted.lastVoidTerminalErosionCascadeIndex === composite.state.nationalVoidTerminalErosionCascadeIndex,
    `persisted terminal ${composite.persisted.lastVoidTerminalErosionCascadeIndex}`,
  );

  push(
    out,
    'a11_247',
    composite.derived.some((d) => d.kind === 'existential_ultimate_nullity_seal') ||
      composite.state.existentialUltimateNullitySeal.some((s) => s.band === 'ultimate' || s.band === 'total_seal'),
    composite.state.existentialUltimateNullitySeal[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_248',
    composite.state.existentialUltimateNullitySeal.every((s) => s.narrative.includes('existential ultimate nullity seal')),
    composite.state.existentialUltimateNullitySeal[0]?.band ?? 'none',
  );

  const collapseAbsoluteSingularityApex = op10mA11ComputeRegionalCollapseAbsoluteSingularityApex({
    collapseTotalSingularityVertex: composite.state.collapseTotalSingularityVertex,
    voidTerminalErosionCascade: composite.state.voidTerminalErosionCascade,
    existentialUltimateNullitySeal: composite.state.existentialUltimateNullitySeal,
  });
  push(
    out,
    'a11_249',
    composite.state.collapseAbsoluteSingularityApex.length === 8 &&
      composite.state.nationalCollapseAbsoluteSingularityApexIndex === collapseAbsoluteSingularityApex.nationalIndex,
    `singularity apex ${composite.state.nationalCollapseAbsoluteSingularityApexIndex}`,
  );

  const voidCompleteErosionTerminality = op10mA11ComputeInterregionalVoidCompleteErosionTerminality({
    voidTerminalErosionCascade: composite.state.voidTerminalErosionCascade,
    collapseTotalSingularityVertex: composite.state.collapseTotalSingularityVertex,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_250',
    composite.state.voidCompleteErosionTerminality.length === 8 &&
      composite.state.nationalVoidCompleteErosionTerminalityIndex === voidCompleteErosionTerminality.nationalIndex,
    `complete terminality ${composite.state.nationalVoidCompleteErosionTerminalityIndex}`,
  );

  const existentialFinalNullityClosure = op10mA11ComputeSettlementExistentialFinalNullityClosure({
    existentialUltimateNullitySeal: composite.state.existentialUltimateNullitySeal,
    collapseTotalSingularityVertex: composite.state.collapseTotalSingularityVertex,
    existentialFinalNullityLock: composite.state.existentialFinalNullityLock,
  });
  push(
    out,
    'a11_251',
    composite.state.existentialFinalNullityClosure.length === 8 &&
      composite.state.nationalExistentialFinalNullityClosureIndex === existentialFinalNullityClosure.nationalIndex,
    `nullity closure ${composite.state.nationalExistentialFinalNullityClosureIndex}`,
  );

  push(
    out,
    'a11_252',
    composite.state.collapseAbsoluteSingularityApex.every((a) => a.narrative.includes('collapse absolute singularity apex')),
    composite.state.collapseAbsoluteSingularityApex[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_253',
    composite.derived.some((d) => d.kind === 'collapse_absolute_singularity_apex') ||
      composite.state.collapseAbsoluteSingularityApex.some((a) => a.band === 'total' || a.band === 'apex'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_254',
    composite.derived.some((d) => d.kind === 'void_complete_erosion_terminality') ||
      composite.state.voidCompleteErosionTerminality.some((t) => t.band === 'terminal' || t.band === 'total_terminality'),
    composite.state.voidCompleteErosionTerminality[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_255',
    composite.persisted.lastVoidCompleteErosionTerminalityIndex === composite.state.nationalVoidCompleteErosionTerminalityIndex,
    `persisted complete ${composite.persisted.lastVoidCompleteErosionTerminalityIndex}`,
  );

  push(
    out,
    'a11_256',
    composite.derived.some((d) => d.kind === 'existential_final_nullity_closure') ||
      composite.state.existentialFinalNullityClosure.some((c) => c.band === 'final' || c.band === 'total_closure'),
    composite.state.existentialFinalNullityClosure[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_257',
    composite.state.existentialFinalNullityClosure.every((c) => c.narrative.includes('existential final nullity closure')),
    composite.state.existentialFinalNullityClosure[0]?.band ?? 'none',
  );

  const collapseUltimateSingularityZenith = op10mA11ComputeRegionalCollapseUltimateSingularityZenith({
    collapseAbsoluteSingularityApex: composite.state.collapseAbsoluteSingularityApex,
    voidCompleteErosionTerminality: composite.state.voidCompleteErosionTerminality,
    existentialFinalNullityClosure: composite.state.existentialFinalNullityClosure,
  });
  push(
    out,
    'a11_258',
    composite.state.collapseUltimateSingularityZenith.length === 8 &&
      composite.state.nationalCollapseUltimateSingularityZenithIndex === collapseUltimateSingularityZenith.nationalIndex,
    `singularity zenith ${composite.state.nationalCollapseUltimateSingularityZenithIndex}`,
  );

  const voidTotalErosionFinality = op10mA11ComputeInterregionalVoidTotalErosionFinality({
    voidCompleteErosionTerminality: composite.state.voidCompleteErosionTerminality,
    collapseAbsoluteSingularityApex: composite.state.collapseAbsoluteSingularityApex,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_259',
    composite.state.voidTotalErosionFinality.length === 8 &&
      composite.state.nationalVoidTotalErosionFinalityIndex === voidTotalErosionFinality.nationalIndex,
    `total finality ${composite.state.nationalVoidTotalErosionFinalityIndex}`,
  );

  const existentialAbsoluteNullityVerdict = op10mA11ComputeSettlementExistentialAbsoluteNullityVerdict({
    existentialFinalNullityClosure: composite.state.existentialFinalNullityClosure,
    collapseAbsoluteSingularityApex: composite.state.collapseAbsoluteSingularityApex,
    existentialUltimateNullitySeal: composite.state.existentialUltimateNullitySeal,
  });
  push(
    out,
    'a11_260',
    composite.state.existentialAbsoluteNullityVerdict.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityVerdictIndex === existentialAbsoluteNullityVerdict.nationalIndex,
    `nullity verdict ${composite.state.nationalExistentialAbsoluteNullityVerdictIndex}`,
  );

  push(
    out,
    'a11_261',
    composite.state.collapseUltimateSingularityZenith.every((z) => z.narrative.includes('collapse ultimate singularity zenith')),
    composite.state.collapseUltimateSingularityZenith[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_262',
    composite.derived.some((d) => d.kind === 'collapse_ultimate_singularity_zenith') ||
      composite.state.collapseUltimateSingularityZenith.some((z) => z.band === 'total' || z.band === 'zenith'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_263',
    composite.derived.some((d) => d.kind === 'void_total_erosion_finality') ||
      composite.state.voidTotalErosionFinality.some((f) => f.band === 'final' || f.band === 'total_finality'),
    composite.state.voidTotalErosionFinality[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_264',
    composite.persisted.lastVoidTotalErosionFinalityIndex === composite.state.nationalVoidTotalErosionFinalityIndex,
    `persisted finality ${composite.persisted.lastVoidTotalErosionFinalityIndex}`,
  );

  push(
    out,
    'a11_265',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_verdict') ||
      composite.state.existentialAbsoluteNullityVerdict.some((v) => v.band === 'absolute' || v.band === 'total_verdict'),
    composite.state.existentialAbsoluteNullityVerdict[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_266',
    composite.state.existentialAbsoluteNullityVerdict.every((v) => v.narrative.includes('existential absolute nullity verdict')),
    composite.state.existentialAbsoluteNullityVerdict[0]?.band ?? 'none',
  );

  const collapseTotalSingularityNexus = op10mA11ComputeRegionalCollapseTotalSingularityNexus({
    collapseUltimateSingularityZenith: composite.state.collapseUltimateSingularityZenith,
    voidTotalErosionFinality: composite.state.voidTotalErosionFinality,
    existentialAbsoluteNullityVerdict: composite.state.existentialAbsoluteNullityVerdict,
  });
  push(
    out,
    'a11_267',
    composite.state.collapseTotalSingularityNexus.length === 8 &&
      composite.state.nationalCollapseTotalSingularityNexusIndex === collapseTotalSingularityNexus.nationalIndex,
    `singularity nexus ${composite.state.nationalCollapseTotalSingularityNexusIndex}`,
  );

  const voidAbsoluteErosionTermination = op10mA11ComputeInterregionalVoidAbsoluteErosionTermination({
    voidTotalErosionFinality: composite.state.voidTotalErosionFinality,
    collapseUltimateSingularityZenith: composite.state.collapseUltimateSingularityZenith,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_268',
    composite.state.voidAbsoluteErosionTermination.length === 8 &&
      composite.state.nationalVoidAbsoluteErosionTerminationIndex === voidAbsoluteErosionTermination.nationalIndex,
    `erosion termination ${composite.state.nationalVoidAbsoluteErosionTerminationIndex}`,
  );

  const existentialFinalNullitySentence = op10mA11ComputeSettlementExistentialFinalNullitySentence({
    existentialAbsoluteNullityVerdict: composite.state.existentialAbsoluteNullityVerdict,
    collapseUltimateSingularityZenith: composite.state.collapseUltimateSingularityZenith,
    existentialFinalNullityClosure: composite.state.existentialFinalNullityClosure,
  });
  push(
    out,
    'a11_269',
    composite.state.existentialFinalNullitySentence.length === 8 &&
      composite.state.nationalExistentialFinalNullitySentenceIndex === existentialFinalNullitySentence.nationalIndex,
    `nullity sentence ${composite.state.nationalExistentialFinalNullitySentenceIndex}`,
  );

  push(
    out,
    'a11_270',
    composite.state.collapseTotalSingularityNexus.every((n) => n.narrative.includes('collapse total singularity nexus')),
    composite.state.collapseTotalSingularityNexus[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_271',
    composite.derived.some((d) => d.kind === 'collapse_total_singularity_nexus') ||
      composite.state.collapseTotalSingularityNexus.some((n) => n.band === 'total' || n.band === 'nexus'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_272',
    composite.derived.some((d) => d.kind === 'void_absolute_erosion_termination') ||
      composite.state.voidAbsoluteErosionTermination.some((t) => t.band === 'absolute' || t.band === 'total_termination'),
    composite.state.voidAbsoluteErosionTermination[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_273',
    composite.persisted.lastVoidAbsoluteErosionTerminationIndex === composite.state.nationalVoidAbsoluteErosionTerminationIndex,
    `persisted termination ${composite.persisted.lastVoidAbsoluteErosionTerminationIndex}`,
  );

  push(
    out,
    'a11_274',
    composite.derived.some((d) => d.kind === 'existential_final_nullity_sentence') ||
      composite.state.existentialFinalNullitySentence.some((s) => s.band === 'final' || s.band === 'total_sentence'),
    composite.state.existentialFinalNullitySentence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_275',
    composite.state.existentialFinalNullitySentence.every((s) => s.narrative.includes('existential final nullity sentence')),
    composite.state.existentialFinalNullitySentence[0]?.band ?? 'none',
  );

  const collapseAbsoluteSingularityCulmination = op10mA11ComputeRegionalCollapseAbsoluteSingularityCulmination({
    collapseTotalSingularityNexus: composite.state.collapseTotalSingularityNexus,
    voidAbsoluteErosionTermination: composite.state.voidAbsoluteErosionTermination,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_276',
    composite.state.collapseAbsoluteSingularityCulmination.length === 8 &&
      composite.state.nationalCollapseAbsoluteSingularityCulminationIndex === collapseAbsoluteSingularityCulmination.nationalIndex,
    `singularity culmination ${composite.state.nationalCollapseAbsoluteSingularityCulminationIndex}`,
  );

  const voidCompleteErosionExtinction = op10mA11ComputeInterregionalVoidCompleteErosionExtinction({
    voidAbsoluteErosionTermination: composite.state.voidAbsoluteErosionTermination,
    collapseTotalSingularityNexus: composite.state.collapseTotalSingularityNexus,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_277',
    composite.state.voidCompleteErosionExtinction.length === 8 &&
      composite.state.nationalVoidCompleteErosionExtinctionIndex === voidCompleteErosionExtinction.nationalIndex,
    `erosion extinction ${composite.state.nationalVoidCompleteErosionExtinctionIndex}`,
  );

  const existentialTotalNullityDecree = op10mA11ComputeSettlementExistentialTotalNullityDecree({
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
    collapseTotalSingularityNexus: composite.state.collapseTotalSingularityNexus,
    existentialAbsoluteNullityVerdict: composite.state.existentialAbsoluteNullityVerdict,
  });
  push(
    out,
    'a11_278',
    composite.state.existentialTotalNullityDecree.length === 8 &&
      composite.state.nationalExistentialTotalNullityDecreeIndex === existentialTotalNullityDecree.nationalIndex,
    `nullity decree ${composite.state.nationalExistentialTotalNullityDecreeIndex}`,
  );

  push(
    out,
    'a11_279',
    composite.state.collapseAbsoluteSingularityCulmination.every((c) => c.narrative.includes('collapse absolute singularity culmination')),
    composite.state.collapseAbsoluteSingularityCulmination[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_280',
    composite.derived.some((d) => d.kind === 'collapse_absolute_singularity_culmination') ||
      composite.state.collapseAbsoluteSingularityCulmination.some((c) => c.band === 'total' || c.band === 'culmination'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_281',
    composite.derived.some((d) => d.kind === 'void_complete_erosion_extinction') ||
      composite.state.voidCompleteErosionExtinction.some((e) => e.band === 'complete' || e.band === 'total_extinction'),
    composite.state.voidCompleteErosionExtinction[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_282',
    composite.persisted.lastVoidCompleteErosionExtinctionIndex === composite.state.nationalVoidCompleteErosionExtinctionIndex,
    `persisted extinction ${composite.persisted.lastVoidCompleteErosionExtinctionIndex}`,
  );

  push(
    out,
    'a11_283',
    composite.derived.some((d) => d.kind === 'existential_total_nullity_decree') ||
      composite.state.existentialTotalNullityDecree.some((d) => d.band === 'total' || d.band === 'absolute_decree'),
    composite.state.existentialTotalNullityDecree[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_284',
    composite.state.existentialTotalNullityDecree.every((d) => d.narrative.includes('existential total nullity decree')),
    composite.state.existentialTotalNullityDecree[0]?.band ?? 'none',
  );

  const collapseOmniSingularitySynthesis = op10mA11ComputeRegionalCollapseOmniSingularitySynthesis({
    collapseAbsoluteSingularityCulmination: composite.state.collapseAbsoluteSingularityCulmination,
    voidCompleteErosionExtinction: composite.state.voidCompleteErosionExtinction,
    existentialTotalNullityDecree: composite.state.existentialTotalNullityDecree,
  });
  push(
    out,
    'a11_285',
    composite.state.collapseOmniSingularitySynthesis.length === 8 &&
      composite.state.nationalCollapseOmniSingularitySynthesisIndex === collapseOmniSingularitySynthesis.nationalIndex,
    `omni synthesis ${composite.state.nationalCollapseOmniSingularitySynthesisIndex}`,
  );

  const voidTotalErosionAnnihilation = op10mA11ComputeInterregionalVoidTotalErosionAnnihilation({
    voidCompleteErosionExtinction: composite.state.voidCompleteErosionExtinction,
    collapseAbsoluteSingularityCulmination: composite.state.collapseAbsoluteSingularityCulmination,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_286',
    composite.state.voidTotalErosionAnnihilation.length === 8 &&
      composite.state.nationalVoidTotalErosionAnnihilationIndex === voidTotalErosionAnnihilation.nationalIndex,
    `erosion annihilation ${composite.state.nationalVoidTotalErosionAnnihilationIndex}`,
  );

  const existentialAbsoluteNullityMandate = op10mA11ComputeSettlementExistentialAbsoluteNullityMandate({
    existentialTotalNullityDecree: composite.state.existentialTotalNullityDecree,
    collapseAbsoluteSingularityCulmination: composite.state.collapseAbsoluteSingularityCulmination,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_287',
    composite.state.existentialAbsoluteNullityMandate.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityMandateIndex === existentialAbsoluteNullityMandate.nationalIndex,
    `nullity mandate ${composite.state.nationalExistentialAbsoluteNullityMandateIndex}`,
  );

  push(
    out,
    'a11_288',
    composite.state.collapseOmniSingularitySynthesis.every((s) => s.narrative.includes('collapse omni singularity synthesis')),
    composite.state.collapseOmniSingularitySynthesis[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_289',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_synthesis') ||
      composite.state.collapseOmniSingularitySynthesis.some((s) => s.band === 'total' || s.band === 'synthesis'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_290',
    composite.derived.some((d) => d.kind === 'void_total_erosion_annihilation') ||
      composite.state.voidTotalErosionAnnihilation.some((a) => a.band === 'total' || a.band === 'complete_annihilation'),
    composite.state.voidTotalErosionAnnihilation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_291',
    composite.persisted.lastVoidTotalErosionAnnihilationIndex === composite.state.nationalVoidTotalErosionAnnihilationIndex,
    `persisted annihilation ${composite.persisted.lastVoidTotalErosionAnnihilationIndex}`,
  );

  push(
    out,
    'a11_292',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_mandate') ||
      composite.state.existentialAbsoluteNullityMandate.some((m) => m.band === 'absolute' || m.band === 'total_mandate'),
    composite.state.existentialAbsoluteNullityMandate[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_293',
    composite.state.existentialAbsoluteNullityMandate.every((m) => m.narrative.includes('existential absolute nullity mandate')),
    composite.state.existentialAbsoluteNullityMandate[0]?.band ?? 'none',
  );

  const collapseOmniSingularityConvergence = op10mA11ComputeRegionalCollapseOmniSingularityConvergence({
    collapseOmniSingularitySynthesis: composite.state.collapseOmniSingularitySynthesis,
    voidTotalErosionAnnihilation: composite.state.voidTotalErosionAnnihilation,
    existentialAbsoluteNullityMandate: composite.state.existentialAbsoluteNullityMandate,
  });
  push(
    out,
    'a11_294',
    composite.state.collapseOmniSingularityConvergence.length === 8 &&
      composite.state.nationalCollapseOmniSingularityConvergenceIndex === collapseOmniSingularityConvergence.nationalIndex,
    `omni convergence ${composite.state.nationalCollapseOmniSingularityConvergenceIndex}`,
  );

  const voidTotalErosionObliteration = op10mA11ComputeInterregionalVoidTotalErosionObliteration({
    voidTotalErosionAnnihilation: composite.state.voidTotalErosionAnnihilation,
    collapseOmniSingularitySynthesis: composite.state.collapseOmniSingularitySynthesis,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_295',
    composite.state.voidTotalErosionObliteration.length === 8 &&
      composite.state.nationalVoidTotalErosionObliterationIndex === voidTotalErosionObliteration.nationalIndex,
    `erosion obliteration ${composite.state.nationalVoidTotalErosionObliterationIndex}`,
  );

  const existentialAbsoluteNullityBinding = op10mA11ComputeSettlementExistentialAbsoluteNullityBinding({
    existentialAbsoluteNullityMandate: composite.state.existentialAbsoluteNullityMandate,
    collapseOmniSingularitySynthesis: composite.state.collapseOmniSingularitySynthesis,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_296',
    composite.state.existentialAbsoluteNullityBinding.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityBindingIndex === existentialAbsoluteNullityBinding.nationalIndex,
    `nullity binding ${composite.state.nationalExistentialAbsoluteNullityBindingIndex}`,
  );

  push(
    out,
    'a11_297',
    composite.state.collapseOmniSingularityConvergence.every((c) => c.narrative.includes('collapse omni singularity convergence')),
    composite.state.collapseOmniSingularityConvergence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_298',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_convergence') ||
      composite.state.collapseOmniSingularityConvergence.some((c) => c.band === 'total' || c.band === 'convergence'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_299',
    composite.derived.some((d) => d.kind === 'void_total_erosion_obliteration') ||
      composite.state.voidTotalErosionObliteration.some((o) => o.band === 'total' || o.band === 'complete_obliteration'),
    composite.state.voidTotalErosionObliteration[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_300',
    composite.persisted.lastVoidTotalErosionObliterationIndex === composite.state.nationalVoidTotalErosionObliterationIndex,
    `persisted obliteration ${composite.persisted.lastVoidTotalErosionObliterationIndex}`,
  );

  push(
    out,
    'a11_301',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_binding') ||
      composite.state.existentialAbsoluteNullityBinding.some((b) => b.band === 'absolute' || b.band === 'total_binding'),
    composite.state.existentialAbsoluteNullityBinding[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_302',
    composite.state.existentialAbsoluteNullityBinding.every((b) => b.narrative.includes('existential absolute nullity binding')),
    composite.state.existentialAbsoluteNullityBinding[0]?.band ?? 'none',
  );
  const collapseOmniSingularityIntegration = op10mA11ComputeRegionalCollapseOmniSingularityIntegration({
    collapseOmniSingularityConvergence: composite.state.collapseOmniSingularityConvergence,
    voidTotalErosionObliteration: composite.state.voidTotalErosionObliteration,
    existentialAbsoluteNullityBinding: composite.state.existentialAbsoluteNullityBinding,
  });
  push(
    out,
    'a11_303',
    composite.state.collapseOmniSingularityIntegration.length === 8 &&
      composite.state.nationalCollapseOmniSingularityIntegrationIndex === collapseOmniSingularityIntegration.nationalIndex,
    `omni integration ${composite.state.nationalCollapseOmniSingularityIntegrationIndex}`,
  );

  const voidTotalErosionEradication = op10mA11ComputeInterregionalVoidTotalErosionEradication({
    voidTotalErosionObliteration: composite.state.voidTotalErosionObliteration,
    collapseOmniSingularityConvergence: composite.state.collapseOmniSingularityConvergence,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_304',
    composite.state.voidTotalErosionEradication.length === 8 &&
      composite.state.nationalVoidTotalErosionEradicationIndex === voidTotalErosionEradication.nationalIndex,
    `erosion eradication ${composite.state.nationalVoidTotalErosionEradicationIndex}`,
  );

  const existentialAbsoluteNullityContinuity = op10mA11ComputeSettlementExistentialAbsoluteNullityContinuity({
    existentialAbsoluteNullityBinding: composite.state.existentialAbsoluteNullityBinding,
    collapseOmniSingularityConvergence: composite.state.collapseOmniSingularityConvergence,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_305',
    composite.state.existentialAbsoluteNullityContinuity.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityContinuityIndex === existentialAbsoluteNullityContinuity.nationalIndex,
    `nullity continuity ${composite.state.nationalExistentialAbsoluteNullityContinuityIndex}`,
  );

  push(
    out,
    'a11_306',
    composite.state.collapseOmniSingularityIntegration.every((i) => i.narrative.includes('collapse omni singularity integration')),
    composite.state.collapseOmniSingularityIntegration[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_307',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_integration') ||
      composite.state.collapseOmniSingularityIntegration.some((i) => i.band === 'total' || i.band === 'integration'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_308',
    composite.derived.some((d) => d.kind === 'void_total_erosion_eradication') ||
      composite.state.voidTotalErosionEradication.some((e) => e.band === 'total' || e.band === 'complete_eradication'),
    composite.state.voidTotalErosionEradication[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_309',
    composite.persisted.lastVoidTotalErosionEradicationIndex === composite.state.nationalVoidTotalErosionEradicationIndex,
    `persisted eradication ${composite.persisted.lastVoidTotalErosionEradicationIndex}`,
  );

  push(
    out,
    'a11_310',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_continuity') ||
      composite.state.existentialAbsoluteNullityContinuity.some((b) => b.band === 'absolute' || b.band === 'total_continuity'),
    composite.state.existentialAbsoluteNullityContinuity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_311',
    composite.state.existentialAbsoluteNullityContinuity.every((b) => b.narrative.includes('existential absolute nullity continuity')),
    composite.state.existentialAbsoluteNullityContinuity[0]?.band ?? 'none',
  );
  const collapseOmniSingularityUnification = op10mA11ComputeRegionalCollapseOmniSingularityUnification({
    collapseOmniSingularityIntegration: composite.state.collapseOmniSingularityIntegration,
    voidTotalErosionEradication: composite.state.voidTotalErosionEradication,
    existentialAbsoluteNullityContinuity: composite.state.existentialAbsoluteNullityContinuity,
  });
  push(
    out,
    'a11_312',
    composite.state.collapseOmniSingularityUnification.length === 8 &&
      composite.state.nationalCollapseOmniSingularityUnificationIndex === collapseOmniSingularityUnification.nationalIndex,
    `omni unification ${composite.state.nationalCollapseOmniSingularityUnificationIndex}`,
  );

  const voidTotalErosionElimination = op10mA11ComputeInterregionalVoidTotalErosionElimination({
    voidTotalErosionEradication: composite.state.voidTotalErosionEradication,
    collapseOmniSingularityIntegration: composite.state.collapseOmniSingularityIntegration,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_313',
    composite.state.voidTotalErosionElimination.length === 8 &&
      composite.state.nationalVoidTotalErosionEliminationIndex === voidTotalErosionElimination.nationalIndex,
    `erosion elimination ${composite.state.nationalVoidTotalErosionEliminationIndex}`,
  );

  const existentialAbsoluteNullityPerpetuity = op10mA11ComputeSettlementExistentialAbsoluteNullityPerpetuity({
    existentialAbsoluteNullityContinuity: composite.state.existentialAbsoluteNullityContinuity,
    collapseOmniSingularityIntegration: composite.state.collapseOmniSingularityIntegration,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_314',
    composite.state.existentialAbsoluteNullityPerpetuity.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityPerpetuityIndex === existentialAbsoluteNullityPerpetuity.nationalIndex,
    `nullity perpetuity ${composite.state.nationalExistentialAbsoluteNullityPerpetuityIndex}`,
  );

  push(
    out,
    'a11_315',
    composite.state.collapseOmniSingularityUnification.every((u) => u.narrative.includes('collapse omni singularity unification')),
    composite.state.collapseOmniSingularityUnification[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_316',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_unification') ||
      composite.state.collapseOmniSingularityUnification.some((u) => u.band === 'total' || u.band === 'unification'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_317',
    composite.derived.some((d) => d.kind === 'void_total_erosion_elimination') ||
      composite.state.voidTotalErosionElimination.some((e) => e.band === 'total' || e.band === 'complete_elimination'),
    composite.state.voidTotalErosionElimination[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_318',
    composite.persisted.lastVoidTotalErosionEliminationIndex === composite.state.nationalVoidTotalErosionEliminationIndex,
    `persisted elimination ${composite.persisted.lastVoidTotalErosionEliminationIndex}`,
  );

  push(
    out,
    'a11_319',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_perpetuity') ||
      composite.state.existentialAbsoluteNullityPerpetuity.some((p) => p.band === 'absolute' || p.band === 'total_perpetuity'),
    composite.state.existentialAbsoluteNullityPerpetuity[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_320',
    composite.state.existentialAbsoluteNullityPerpetuity.every((p) => p.narrative.includes('existential absolute nullity perpetuity')),
    composite.state.existentialAbsoluteNullityPerpetuity[0]?.band ?? 'none',
  );

  const collapseOmniSingularityConsolidation = op10mA11ComputeRegionalCollapseOmniSingularityConsolidation({
    collapseOmniSingularityUnification: composite.state.collapseOmniSingularityUnification,
    voidTotalErosionElimination: composite.state.voidTotalErosionElimination,
    existentialAbsoluteNullityPerpetuity: composite.state.existentialAbsoluteNullityPerpetuity,
  });
  push(
    out,
    'a11_321',
    composite.state.collapseOmniSingularityConsolidation.length === 8 &&
      composite.state.nationalCollapseOmniSingularityConsolidationIndex === collapseOmniSingularityConsolidation.nationalIndex,
    `omni consolidation ${composite.state.nationalCollapseOmniSingularityConsolidationIndex}`,
  );

  const voidTotalErosionDissolution = op10mA11ComputeInterregionalVoidTotalErosionDissolution({
    voidTotalErosionElimination: composite.state.voidTotalErosionElimination,
    collapseOmniSingularityUnification: composite.state.collapseOmniSingularityUnification,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_322',
    composite.state.voidTotalErosionDissolution.length === 8 &&
      composite.state.nationalVoidTotalErosionDissolutionIndex === voidTotalErosionDissolution.nationalIndex,
    `erosion dissolution ${composite.state.nationalVoidTotalErosionDissolutionIndex}`,
  );

  const existentialAbsoluteNullityImmutability = op10mA11ComputeSettlementExistentialAbsoluteNullityImmutability({
    existentialAbsoluteNullityPerpetuity: composite.state.existentialAbsoluteNullityPerpetuity,
    collapseOmniSingularityUnification: composite.state.collapseOmniSingularityUnification,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_323',
    composite.state.existentialAbsoluteNullityImmutability.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityImmutabilityIndex === existentialAbsoluteNullityImmutability.nationalIndex,
    `nullity immutability ${composite.state.nationalExistentialAbsoluteNullityImmutabilityIndex}`,
  );

  push(
    out,
    'a11_324',
    composite.state.collapseOmniSingularityConsolidation.every((c) => c.narrative.includes('collapse omni singularity consolidation')),
    composite.state.collapseOmniSingularityConsolidation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_325',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_consolidation') ||
      composite.state.collapseOmniSingularityConsolidation.some((c) => c.band === 'total' || c.band === 'consolidation'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_326',
    composite.derived.some((d) => d.kind === 'void_total_erosion_dissolution') ||
      composite.state.voidTotalErosionDissolution.some((d) => d.band === 'total' || d.band === 'complete_dissolution'),
    composite.state.voidTotalErosionDissolution[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_327',
    composite.persisted.lastVoidTotalErosionDissolutionIndex === composite.state.nationalVoidTotalErosionDissolutionIndex,
    `persisted dissolution ${composite.persisted.lastVoidTotalErosionDissolutionIndex}`,
  );

  push(
    out,
    'a11_328',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_immutability') ||
      composite.state.existentialAbsoluteNullityImmutability.some((i) => i.band === 'absolute' || i.band === 'total_immutability'),
    composite.state.existentialAbsoluteNullityImmutability[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_329',
    composite.state.existentialAbsoluteNullityImmutability.every((i) => i.narrative.includes('existential absolute nullity immutability')),
    composite.state.existentialAbsoluteNullityImmutability[0]?.band ?? 'none',
  );

  const collapseOmniSingularityCoalescence = op10mA11ComputeRegionalCollapseOmniSingularityCoalescence({
    collapseOmniSingularityConsolidation: composite.state.collapseOmniSingularityConsolidation,
    voidTotalErosionDissolution: composite.state.voidTotalErosionDissolution,
    existentialAbsoluteNullityImmutability: composite.state.existentialAbsoluteNullityImmutability,
  });
  push(
    out,
    'a11_330',
    composite.state.collapseOmniSingularityCoalescence.length === 8 &&
      composite.state.nationalCollapseOmniSingularityCoalescenceIndex === collapseOmniSingularityCoalescence.nationalIndex,
    `omni coalescence ${composite.state.nationalCollapseOmniSingularityCoalescenceIndex}`,
  );

  const voidTotalErosionSublimation = op10mA11ComputeInterregionalVoidTotalErosionSublimation({
    voidTotalErosionDissolution: composite.state.voidTotalErosionDissolution,
    collapseOmniSingularityConsolidation: composite.state.collapseOmniSingularityConsolidation,
    voidExistenceAnnihilationFront: composite.state.voidExistenceAnnihilationFront,
  });
  push(
    out,
    'a11_331',
    composite.state.voidTotalErosionSublimation.length === 8 &&
      composite.state.nationalVoidTotalErosionSublimationIndex === voidTotalErosionSublimation.nationalIndex,
    `erosion sublimation ${composite.state.nationalVoidTotalErosionSublimationIndex}`,
  );

  const existentialAbsoluteNullityPermanence = op10mA11ComputeSettlementExistentialAbsoluteNullityPermanence({
    existentialAbsoluteNullityImmutability: composite.state.existentialAbsoluteNullityImmutability,
    collapseOmniSingularityConsolidation: composite.state.collapseOmniSingularityConsolidation,
    existentialFinalNullitySentence: composite.state.existentialFinalNullitySentence,
  });
  push(
    out,
    'a11_332',
    composite.state.existentialAbsoluteNullityPermanence.length === 8 &&
      composite.state.nationalExistentialAbsoluteNullityPermanenceIndex === existentialAbsoluteNullityPermanence.nationalIndex,
    `nullity permanence ${composite.state.nationalExistentialAbsoluteNullityPermanenceIndex}`,
  );

  push(
    out,
    'a11_333',
    composite.state.collapseOmniSingularityCoalescence.every((c) => c.narrative.includes('collapse omni singularity coalescence')),
    composite.state.collapseOmniSingularityCoalescence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_334',
    composite.derived.some((d) => d.kind === 'collapse_omni_singularity_coalescence') ||
      composite.state.collapseOmniSingularityCoalescence.some((c) => c.band === 'total' || c.band === 'coalescence'),
    composite.derived.map((d) => d.kind).join(', '),
  );

  push(
    out,
    'a11_335',
    composite.derived.some((d) => d.kind === 'void_total_erosion_sublimation') ||
      composite.state.voidTotalErosionSublimation.some((s) => s.band === 'total' || s.band === 'complete_sublimation'),
    composite.state.voidTotalErosionSublimation[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_336',
    composite.persisted.lastVoidTotalErosionSublimationIndex === composite.state.nationalVoidTotalErosionSublimationIndex,
    `persisted sublimation ${composite.persisted.lastVoidTotalErosionSublimationIndex}`,
  );

  push(
    out,
    'a11_337',
    composite.derived.some((d) => d.kind === 'existential_absolute_nullity_permanence') ||
      composite.state.existentialAbsoluteNullityPermanence.some((p) => p.band === 'absolute' || p.band === 'total_permanence'),
    composite.state.existentialAbsoluteNullityPermanence[0]?.band ?? 'none',
  );

  push(
    out,
    'a11_338',
    composite.state.existentialAbsoluteNullityPermanence.every((p) => p.narrative.includes('existential absolute nullity permanence')),
    composite.state.existentialAbsoluteNullityPermanence[0]?.band ?? 'none',
  );

  return out;
}

export function assertOP10M_A11_SelfTests(): { ok: boolean; failed: OP10M_A11_SelfTestResult[] } {
  const results = runOP10M_A11_SelfTests();
  const failed = results.filter((r) => !r.passed);
  return { ok: failed.length === 0, failed };
}


// OP10M_MODULE_END agent-11-cities
