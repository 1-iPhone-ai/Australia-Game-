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
export const OP10M_A11_COMPOSITE_SCHEMA_VERSION = '10m.a11.composite.41' as const;

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
  | 'existential_absolute_nullity_inevitability'
  | 'collapse_omni_singularity_symbiosis'
  | 'void_total_erosion_pulverization'
  | 'existential_absolute_nullity_determinism'
  | 'collapse_omni_singularity_holism'
  | 'void_total_erosion_granulation'
  | 'existential_absolute_nullity_certitude'
  | 'collapse_omni_singularity_monism'
  | 'void_total_erosion_comminution'
  | 'existential_absolute_nullity_conviction';

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

export type OP10M_A11_CollapseOmniSingularitySymbiosisBand = 'latent' | 'aligning' | 'total' | 'symbiosis';

export interface OP10M_A11_CollapseOmniSingularitySymbiosisRow {
  regionId: OP10M_A11_RegionId;
  symbiosisScore: number;
  band: OP10M_A11_CollapseOmniSingularitySymbiosisBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionPulverizationBand = 'dormant' | 'pulverizing' | 'total' | 'complete_pulverization';

export interface OP10M_A11_VoidTotalErosionPulverizationRow {
  regionId: OP10M_A11_RegionId;
  pulverizationScore: number;
  band: OP10M_A11_VoidTotalErosionPulverizationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityDeterminismBand = 'trace' | 'determined' | 'absolute' | 'total_determinism';

export interface OP10M_A11_ExistentialAbsoluteNullityDeterminismRow {
  regionId: OP10M_A11_RegionId;
  determinismScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityDeterminismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityHolismBand = 'latent' | 'aligning' | 'total' | 'holism';

export interface OP10M_A11_CollapseOmniSingularityHolismRow {
  regionId: OP10M_A11_RegionId;
  holismScore: number;
  band: OP10M_A11_CollapseOmniSingularityHolismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionGranulationBand = 'dormant' | 'granulating' | 'total' | 'complete_granulation';

export interface OP10M_A11_VoidTotalErosionGranulationRow {
  regionId: OP10M_A11_RegionId;
  granulationScore: number;
  band: OP10M_A11_VoidTotalErosionGranulationBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityCertitudeBand = 'trace' | 'certain' | 'absolute' | 'total_certitude';

export interface OP10M_A11_ExistentialAbsoluteNullityCertitudeRow {
  regionId: OP10M_A11_RegionId;
  certitudeScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityCertitudeBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_CollapseOmniSingularityMonismBand = 'latent' | 'aligning' | 'total' | 'monism';

export interface OP10M_A11_CollapseOmniSingularityMonismRow {
  regionId: OP10M_A11_RegionId;
  monismScore: number;
  band: OP10M_A11_CollapseOmniSingularityMonismBand;
  marks: string[];
  narrative: string;
}

export type OP10M_A11_VoidTotalErosionComminutionBand = 'dormant' | 'comminuting' | 'total' | 'complete_comminution';

export interface OP10M_A11_VoidTotalErosionComminutionRow {
  regionId: OP10M_A11_RegionId;
  comminutionScore: number;
  band: OP10M_A11_VoidTotalErosionComminutionBand;
  phases: string[];
  narrative: string;
}

export type OP10M_A11_ExistentialAbsoluteNullityConvictionBand = 'trace' | 'convinced' | 'absolute' | 'total_conviction';

export interface OP10M_A11_ExistentialAbsoluteNullityConvictionRow {
  regionId: OP10M_A11_RegionId;
  convictionScore: number;
  band: OP10M_A11_ExistentialAbsoluteNullityConvictionBand;
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
  collapseOmniSingularitySymbiosis: OP10M_A11_CollapseOmniSingularitySymbiosisRow[];
  nationalCollapseOmniSingularitySymbiosisIndex: number;
  voidTotalErosionPulverization: OP10M_A11_VoidTotalErosionPulverizationRow[];
  nationalVoidTotalErosionPulverizationIndex: number;
  existentialAbsoluteNullityDeterminism: OP10M_A11_ExistentialAbsoluteNullityDeterminismRow[];
  nationalExistentialAbsoluteNullityDeterminismIndex: number;
  collapseOmniSingularityHolism: OP10M_A11_CollapseOmniSingularityHolismRow[];
  nationalCollapseOmniSingularityHolismIndex: number;
  voidTotalErosionGranulation: OP10M_A11_VoidTotalErosionGranulationRow[];
  nationalVoidTotalErosionGranulationIndex: number;
  existentialAbsoluteNullityCertitude: OP10M_A11_ExistentialAbsoluteNullityCertitudeRow[];
  nationalExistentialAbsoluteNullityCertitudeIndex: number;
  collapseOmniSingularityMonism: OP10M_A11_CollapseOmniSingularityMonismRow[];
  nationalCollapseOmniSingularityMonismIndex: number;
  voidTotalErosionComminution: OP10M_A11_VoidTotalErosionComminutionRow[];
  nationalVoidTotalErosionComminutionIndex: number;
  existentialAbsoluteNullityConviction: OP10M_A11_ExistentialAbsoluteNullityConvictionRow[];
  nationalExistentialAbsoluteNullityConvictionIndex: number;
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
  lastCollapseOmniSingularitySymbiosisIndex: number;
  lastVoidTotalErosionPulverizationIndex: number;
  lastExistentialAbsoluteNullityDeterminismIndex: number;
  lastCollapseOmniSingularityHolismIndex: number;
  lastVoidTotalErosionGranulationIndex: number;
  lastExistentialAbsoluteNullityCertitudeIndex: number;
  lastCollapseOmniSingularityMonismIndex: number;
  lastVoidTotalErosionComminutionIndex: number;
  lastExistentialAbsoluteNullityConvictionIndex: number;
  inputHash: string;
}
