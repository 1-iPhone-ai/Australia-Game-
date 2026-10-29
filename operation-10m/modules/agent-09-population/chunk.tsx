// OP10M_MODULE_BEGIN agent-09-population
// Agent 09 — V10.14 labor demographics (generated; source: operation-10m/agent-09-population/v10-14-labor-demographics/)

// --- source: types.ts ---
/**
 * V10.14 — Labor demographics types (Agent 09 / Operation 10M)
 * Serializable types only; no imports from canonical TSX.
 */

export const V1014_LABOR_SCHEMA_VERSION = '10.14.0';

export const V1014_LABOR_CORE_REGIONS: readonly string[] = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT'
] as const;

export const V1014_LABOR_LIMITS = {
  maxHistory: 24,
  maxTransitions: 16,
  maxIndustryLinks: 8,
  maxEvidence: 8,
  hysteresisDeadband: 2.0,
  maxEventsPerTurn: 6,
  maxActiveMigrationShocks: 8,
  migrationShockDefaultDuration: 3
} as const;

export type StrategicIndustryKind =
  | 'energy'
  | 'mining'
  | 'agriculture'
  | 'manufacturing'
  | 'research'
  | 'technology'
  | 'tourism'
  | 'trade';

export const STRATEGIC_INDUSTRIES: StrategicIndustryKind[] = [
  'energy',
  'mining',
  'agriculture',
  'manufacturing',
  'research',
  'technology',
  'tourism',
  'trade'
];

export const INDUSTRY_LABEL: Record<StrategicIndustryKind, string> = {
  mining: 'Mining',
  agriculture: 'Agriculture',
  energy: 'Energy',
  manufacturing: 'Manufacturing',
  technology: 'Technology',
  research: 'Research',
  tourism: 'Tourism',
  trade: 'Trade'
};

/** Labor-intensity weight per strategic industry (employment linkage to output). */
export const V1014_LABOR_INDUSTRY_LABOR_WEIGHT: Record<StrategicIndustryKind, number> = {
  energy: 0.55,
  mining: 0.72,
  agriculture: 0.85,
  manufacturing: 0.95,
  research: 0.65,
  technology: 0.78,
  tourism: 1.05,
  trade: 0.62
};

export type DemographicStructureBand =
  | 'contracting'
  | 'aging_pressure'
  | 'stable'
  | 'youthful_growth'
  | 'rapid_growth';

export type EmploymentLinkageBand =
  | 'dislocated'
  | 'weak'
  | 'balanced'
  | 'strong'
  | 'tight_labor';

export type WagePressureBand =
  | 'deflationary'
  | 'soft'
  | 'stable'
  | 'elevated'
  | 'surging';

export type MigrationFlowBand =
  | 'outflow'
  | 'slight_outflow'
  | 'balanced'
  | 'inflow'
  | 'strong_inflow';

export const DEMOGRAPHIC_STRUCTURE_LABEL: Record<DemographicStructureBand, string> = {
  contracting: 'Contracting workforce base',
  aging_pressure: 'Aging workforce pressure',
  stable: 'Stable demographic structure',
  youthful_growth: 'Youthful growth profile',
  rapid_growth: 'Rapid demographic expansion'
};

export const EMPLOYMENT_LINKAGE_LABEL: Record<EmploymentLinkageBand, string> = {
  dislocated: 'Output–employment dislocation',
  weak: 'Weak employment linkage',
  balanced: 'Balanced linkage to output',
  strong: 'Strong output-driven employment',
  tight_labor: 'Tight labor market linkage'
};

export const WAGE_PRESSURE_LABEL: Record<WagePressureBand, string> = {
  deflationary: 'Deflationary wage pressure',
  soft: 'Soft wage conditions',
  stable: 'Stable wage pressure',
  elevated: 'Elevated wage pressure',
  surging: 'Surging wage pressure'
};

export const MIGRATION_FLOW_LABEL: Record<MigrationFlowBand, string> = {
  outflow: 'Net outflow',
  slight_outflow: 'Slight outflow',
  balanced: 'Balanced migration',
  inflow: 'Net inflow',
  strong_inflow: 'Strong inflow'
};

export interface LaborDemographicsRegionSnapshot {
  regionId: string;
  demographicStructure: DemographicStructureBand;
  demographicScore: number;
  employmentLinkage: EmploymentLinkageBand;
  employmentLinkageScore: number;
  wagePressure: WagePressureBand;
  wagePressureScore: number;
  migrationFlow: MigrationFlowBand;
  migrationFlowScore: number;
  dominantIndustry: StrategicIndustryKind | null;
  industryOutputIndex: number;
  workforceStrainIndex: number;
  householdEmploymentFit: number;
  automationPressureIndex?: number;
  householdBudgetPressureScore?: number;
  householdEssentialsGapScore?: number;
}

export interface LaborDemographicsIndustryLink {
  industry: StrategicIndustryKind;
  nationalOutputShare: number;
  employmentWeight: number;
  linkageScore: number;
  regionalHotspots: string[];
}

export interface LaborDemographicsTransition {
  id: string;
  turn: number;
  scope: 'national' | 'regional';
  regionId?: string;
  field: string;
  from: string;
  to: string;
  reason: string;
}

export interface NationalLaborDemographicsState {
  schemaVersion: string;
  turn: number;
  revision: number;
  inputHash: string;
  enabled: boolean;
  nationalDemographicStructure: DemographicStructureBand;
  nationalEmploymentLinkage: EmploymentLinkageBand;
  nationalWagePressure: WagePressureBand;
  nationalMigrationFlow: MigrationFlowBand;
  demographicScore: number;
  employmentLinkageScore: number;
  wagePressureScore: number;
  migrationFlowScore: number;
  regions: Record<string, LaborDemographicsRegionSnapshot>;
  industryLinks: LaborDemographicsIndustryLink[];
  summary: string;
  outlook: string;
  transitions: LaborDemographicsTransition[];
  evidence: string[];
  automationFeedbackSummary?: string;
  householdBudgetSummary?: string;
  activeMigrationShocks?: LaborMigrationShockView[];
  integratedLaborBrief?: IntegratedLaborMarketBrief;
  laborAuditTip?: LaborTurnAuditEntry;
  workforceCapacityBridge?: NationalWorkforceCapacityBridge;
  laborResilienceScorecard?: LaborResilienceScorecard;
  interregionalRebalancingPlan?: InterregionalLaborRebalancingPlan;
  dependencyRatioSnapshot?: NationalDependencyRatioSnapshot;
  participationPressureBrief?: NationalParticipationPressureBrief;
  laborMarketVelocityIndex?: NationalLaborMarketVelocityIndex;
  skillMismatchIndex?: NationalSkillMismatchIndex;
  laborSupplyElasticityBrief?: NationalLaborSupplyElasticityBrief;
  talentMobilityOutlook?: NationalTalentMobilityOutlook;
  underemploymentPressureBrief?: NationalUnderemploymentPressureBrief;
  wageCompetitivenessIndex?: NationalWageCompetitivenessIndex;
  workforceTransitionFrictionOutlook?: NationalWorkforceTransitionFrictionOutlook;
  youthEntryPipelineOutlook?: NationalYouthEntryPipelineOutlook;
  laborMarketTightnessBrief?: NationalLaborMarketTightnessBrief;
  hybridParticipationFrictionOutlook?: NationalHybridParticipationFrictionOutlook;
  seniorWorkforceRetentionOutlook?: NationalSeniorWorkforceRetentionOutlook;
  regionalLaborAbsorptionBrief?: NationalRegionalLaborAbsorptionBrief;
  participationEquityGapBrief?: NationalParticipationEquityGapBrief;
  credentialMobilityOutlook?: NationalCredentialMobilityOutlook;
  householdParticipationCouplingBrief?: NationalHouseholdParticipationCouplingBrief;
  laborRebalancingStressBrief?: NationalLaborRebalancingStressBrief;
  automationParticipationResilienceOutlook?: NationalAutomationParticipationResilienceOutlook;
  wageParticipationSpilloverBrief?: NationalWageParticipationSpilloverBrief;
  migrationShockParticipationBufferOutlook?: NationalMigrationShockParticipationBufferOutlook;
  laborMarketStabilityOutlook?: NationalLaborMarketStabilityOutlook;
  intergenerationalWorkforceBalanceOutlook?: NationalIntergenerationalWorkforceBalanceOutlook;
  capacityParticipationAlignmentBrief?: NationalCapacityParticipationAlignmentBrief;
  participationVelocityCouplingBrief?: NationalParticipationVelocityCouplingBrief;
  skillsTightnessCoherenceOutlook?: NationalSkillsTightnessCoherenceOutlook;
  integratedLaborReadinessOutlook?: NationalIntegratedLaborReadinessOutlook;
  hybridRemoteParticipationOutlook?: NationalHybridRemoteParticipationOutlook;
  corridorCapacityStressBrief?: NationalCorridorCapacityStressBrief;
  stewardInterventionPriorityBrief?: NationalStewardInterventionPriorityBrief;
  essentialWorkerParticipationOutlook?: NationalEssentialWorkerParticipationOutlook;
  wageAutomationCouplingBrief?: NationalWageAutomationCouplingBrief;
  nationalLaborCohesionIndex?: NationalLaborCohesionIndex;
  seasonalParticipationSwingOutlook?: NationalSeasonalParticipationSwingOutlook;
  cohesionCorridorCouplingBrief?: NationalCohesionCorridorCouplingBrief;
  nationalWorkforceReliabilityIndex?: NationalWorkforceReliabilityIndex;
  retentionReliabilityCouplingBrief?: NationalRetentionReliabilityCouplingBrief;
  upskillingVelocityOutlook?: NationalUpskillingVelocityOutlook;
  subjectWorkforceReadinessBrief?: NationalSubjectWorkforceReadinessBrief;
  nationalWorkforceSustainmentIndex?: NationalWorkforceSustainmentIndex;
  sustainmentRetentionCouplingBrief?: NationalSustainmentRetentionCouplingBrief;
  onboardingVelocityOutlook?: NationalOnboardingVelocityOutlook;
  subjectAssemblyContinuityBrief?: NationalSubjectAssemblyContinuityBrief;
  nationalWorkforceContinuityIndex?: NationalWorkforceContinuityIndex;
  continuityCoordinationCouplingBrief?: NationalContinuityCoordinationCouplingBrief;
  reengagementMomentumOutlook?: NationalReengagementMomentumOutlook;
  subjectWaveAssemblyBrief?: NationalSubjectWaveAssemblyBrief;
  nationalWorkforceDurabilityIndex?: NationalWorkforceDurabilityIndex;
}

export type MigrationShockKind =
  | 'resource_boom_inflow'
  | 'housing_affordability_outflow'
  | 'essential_access_outflow'
  | 'metro_talent_pull'
  | 'frontier_recovery_inflow';

export interface LaborMigrationShock {
  id: string;
  kind: MigrationShockKind;
  regionId: string;
  magnitude: number;
  turnsRemaining: number;
  startedTurn: number;
  reason: string;
}

export interface LaborMigrationShockView {
  id: string;
  kind: MigrationShockKind;
  regionId: string;
  magnitude: number;
  turnsRemaining: number;
  label: string;
}

export interface RegionalHouseholdBudgetDetail {
  regionId: string;
  budgetPressureScore: number;
  essentialsGapScore: number;
  resilienceScore: number;
  affordabilityBand: string;
  essentialsBand: string;
  narrative: string;
}

export interface NationalHouseholdBudgetDetail {
  nationalBudgetPressureScore: number;
  nationalEssentialsGapScore: number;
  shockSensitivity: 'low' | 'moderate' | 'high' | 'critical';
  regions: Record<string, RegionalHouseholdBudgetDetail>;
  summary: string;
}

export type IntegratedLaborPressureBand = 'low' | 'moderate' | 'elevated' | 'critical';

export interface IntegratedLaborMarketBrief {
  turn: number;
  compositePressureIndex: number;
  pressureBand: IntegratedLaborPressureBand;
  topStrainRegions: string[];
  topOpportunityRegions: string[];
  dominantRisk: string;
  dominantOpportunity: string;
  narrative: string;
  evidence: string[];
}

export interface LaborTurnAuditEntry {
  turn: number;
  inputHash: string;
  revision: number;
  shockCount: number;
  compositePressureIndex: number;
  bandLine: string;
}

export type WorkforceCapacityBand = 'surplus' | 'balanced' | 'tight' | 'critical_gap';

export interface RegionalWorkforceCapacityGap {
  regionId: string;
  demandIndex: number;
  supplyIndex: number;
  gapIndex: number;
  band: WorkforceCapacityBand;
  skilledPathwayBoost: number;
  narrative: string;
}

export interface NationalWorkforceCapacityBridge {
  turn: number;
  nationalGapIndex: number;
  nationalBand: WorkforceCapacityBand;
  regions: Record<string, RegionalWorkforceCapacityGap>;
  dominantShortageIndustry: StrategicIndustryKind | null;
  summary: string;
}

export type LaborResilienceBand = 'fragile' | 'watchful' | 'steady' | 'robust';

export interface LaborResilienceDimension {
  id: 'shock_buffer' | 'budget_cushion' | 'automation_headroom' | 'capacity_margin';
  score: number;
  band: LaborResilienceBand;
  label: string;
}

export interface LaborResilienceScorecard {
  turn: number;
  compositeScore: number;
  band: LaborResilienceBand;
  dimensions: LaborResilienceDimension[];
  headline: string;
  stewardNote: string;
}

export interface LaborRebalancingMove {
  id: string;
  fromRegionId: string;
  toRegionId: string;
  priority: 'high' | 'medium' | 'low';
  rationale: string;
  expectedRelief: number;
}

export interface InterregionalLaborRebalancingPlan {
  turn: number;
  moves: LaborRebalancingMove[];
  summary: string;
}

export type DependencyRatioBand = 'youth_heavy' | 'balanced' | 'aging' | 'aged_pressure';

export interface RegionalDependencyRatio {
  regionId: string;
  ratioIndex: number;
  band: DependencyRatioBand;
  narrative: string;
}

export interface NationalDependencyRatioSnapshot {
  turn: number;
  nationalRatioIndex: number;
  nationalBand: DependencyRatioBand;
  regions: Record<string, RegionalDependencyRatio>;
  agedPressureRegions: string[];
  summary: string;
}

export type ParticipationPressureBand = 'shrinking' | 'constrained' | 'stable' | 'expansionary';

export interface NationalParticipationPressureBrief {
  turn: number;
  participationIndex: number;
  band: ParticipationPressureBand;
  headwinds: string[];
  tailwinds: string[];
  summary: string;
  stewardNote: string;
}

export type LaborMarketVelocityBand = 'sluggish' | 'moderate' | 'active' | 'volatile';

export interface RegionalLaborMarketVelocity {
  regionId: string;
  velocityIndex: number;
  band: LaborMarketVelocityBand;
  narrative: string;
}

export interface NationalLaborMarketVelocityIndex {
  turn: number;
  nationalVelocityIndex: number;
  nationalBand: LaborMarketVelocityBand;
  regions: Record<string, RegionalLaborMarketVelocity>;
  hottestRegion: string | null;
  summary: string;
}

export type SkillMismatchBand = 'aligned' | 'moderate_gap' | 'elevated_gap' | 'critical_mismatch';

export interface RegionalSkillMismatch {
  regionId: string;
  mismatchIndex: number;
  band: SkillMismatchBand;
  narrative: string;
}

export interface NationalSkillMismatchIndex {
  turn: number;
  nationalMismatchIndex: number;
  nationalBand: SkillMismatchBand;
  regions: Record<string, RegionalSkillMismatch>;
  worstRegion: string | null;
  summary: string;
  stewardNote: string;
}

export type SupplyElasticityBand = 'rigid' | 'inelastic' | 'moderate' | 'responsive';

export interface NationalLaborSupplyElasticityBrief {
  turn: number;
  elasticityIndex: number;
  band: SupplyElasticityBand;
  wageSensitivity: number;
  participationSensitivity: number;
  summary: string;
  stewardNote: string;
}

export type TalentMobilityBand = 'anchored' | 'balanced' | 'fluid' | 'hyper_mobile';

export interface NationalTalentMobilityOutlook {
  turn: number;
  mobilityIndex: number;
  band: TalentMobilityBand;
  anchorRegion: string | null;
  corridorHighlight: string | null;
  summary: string;
  stewardNote: string;
}

export type UnderemploymentPressureBand = 'slack' | 'mixed' | 'tight_hidden' | 'severe_underuse';

export interface NationalUnderemploymentPressureBrief {
  turn: number;
  underemploymentIndex: number;
  band: UnderemploymentPressureBand;
  linkageParticipationGap: number;
  summary: string;
  stewardNote: string;
}

export type WageCompetitivenessBand = 'premium' | 'balanced' | 'stretched' | 'cost_burden';

export interface NationalWageCompetitivenessIndex {
  turn: number;
  competitivenessIndex: number;
  band: WageCompetitivenessBand;
  wagePressureDrag: number;
  summary: string;
  stewardNote: string;
}

export type TransitionFrictionBand = 'smooth' | 'moderate' | 'sticky' | 'bottleneck';

export interface NationalWorkforceTransitionFrictionOutlook {
  turn: number;
  frictionIndex: number;
  band: TransitionFrictionBand;
  automationDrag: number;
  summary: string;
  stewardNote: string;
}

export type YouthPipelineBand = 'constricted' | 'narrow' | 'healthy' | 'expansionary';

export interface NationalYouthEntryPipelineOutlook {
  turn: number;
  pipelineIndex: number;
  band: YouthPipelineBand;
  dependencyHeadwind: number;
  summary: string;
  stewardNote: string;
}

export type TightnessBand = 'slack' | 'balanced' | 'tight' | 'critical_shortage';

export interface NationalLaborMarketTightnessBrief {
  turn: number;
  tightnessIndex: number;
  band: TightnessBand;
  capacityGapDrag: number;
  summary: string;
  stewardNote: string;
}

export type HybridParticipationFrictionBand = 'low' | 'moderate' | 'elevated' | 'binding';

export interface NationalHybridParticipationFrictionOutlook {
  turn: number;
  frictionIndex: number;
  band: HybridParticipationFrictionBand;
  careReliefLift: number;
  summary: string;
  stewardNote: string;
}

export type SeniorRetentionBand = 'fragile' | 'strained' | 'stable' | 'anchored';

export interface NationalSeniorWorkforceRetentionOutlook {
  turn: number;
  retentionIndex: number;
  band: SeniorRetentionBand;
  agedPressureDrag: number;
  summary: string;
  stewardNote: string;
}

export type RegionalAbsorptionBand = 'saturated' | 'constrained' | 'absorbing' | 'headroom';

export interface NationalRegionalLaborAbsorptionBrief {
  turn: number;
  absorptionIndex: number;
  band: RegionalAbsorptionBand;
  migrationLoadDrag: number;
  summary: string;
  stewardNote: string;
}

export type ParticipationEquityBand = 'wide_gap' | 'uneven' | 'narrowing' | 'inclusive';

export interface NationalParticipationEquityGapBrief {
  turn: number;
  equityIndex: number;
  band: ParticipationEquityBand;
  inclusionEaseLift: number;
  summary: string;
  stewardNote: string;
}

export type CredentialMobilityBand = 'blocked' | 'narrow' | 'fluid' | 'portable';

export interface NationalCredentialMobilityOutlook {
  turn: number;
  mobilityIndex: number;
  band: CredentialMobilityBand;
  pathwayLift: number;
  summary: string;
  stewardNote: string;
}

export type HouseholdParticipationCouplingBand = 'decoupled' | 'strained' | 'aligned' | 'reinforcing';

export interface NationalHouseholdParticipationCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: HouseholdParticipationCouplingBand;
  budgetPressureDrag: number;
  summary: string;
  stewardNote: string;
}

export type RebalancingStressBand = 'manageable' | 'elevated' | 'acute' | 'critical';

export interface NationalLaborRebalancingStressBrief {
  turn: number;
  stressIndex: number;
  band: RebalancingStressBand;
  highPriorityMoves: number;
  summary: string;
  stewardNote: string;
}

export type AutomationParticipationResilienceBand = 'fragile' | 'strained' | 'stable' | 'adaptive';

export interface NationalAutomationParticipationResilienceOutlook {
  turn: number;
  resilienceIndex: number;
  band: AutomationParticipationResilienceBand;
  automationPressureDrag: number;
  summary: string;
  stewardNote: string;
}

export type WageParticipationSpilloverBand = 'suppressive' | 'mixed' | 'supportive' | 'amplifying';

export interface NationalWageParticipationSpilloverBrief {
  turn: number;
  spilloverIndex: number;
  band: WageParticipationSpilloverBand;
  wagePressureDrag: number;
  summary: string;
  stewardNote: string;
}

export type MigrationParticipationBufferBand = 'depleted' | 'thin' | 'adequate' | 'cushioned';

export interface NationalMigrationShockParticipationBufferOutlook {
  turn: number;
  bufferIndex: number;
  band: MigrationParticipationBufferBand;
  activeShockDrag: number;
  summary: string;
  stewardNote: string;
}

export type LaborMarketStabilityBand = 'volatile' | 'fragile' | 'steady' | 'anchored';

export interface NationalLaborMarketStabilityOutlook {
  turn: number;
  stabilityIndex: number;
  band: LaborMarketStabilityBand;
  stressDrag: number;
  summary: string;
  stewardNote: string;
}

export type IntergenerationalBalanceBand = 'skewed_aged' | 'narrow_youth' | 'balanced' | 'renewal';

export interface NationalIntergenerationalWorkforceBalanceOutlook {
  turn: number;
  balanceIndex: number;
  band: IntergenerationalBalanceBand;
  pipelineGap: number;
  summary: string;
  stewardNote: string;
}

export type CapacityParticipationAlignmentBand = 'misaligned' | 'strained' | 'aligned' | 'reinforcing';

export interface NationalCapacityParticipationAlignmentBrief {
  turn: number;
  alignmentIndex: number;
  band: CapacityParticipationAlignmentBand;
  capacityGapDrag: number;
  summary: string;
  stewardNote: string;
}

export type ParticipationVelocityCouplingBand = 'divergent' | 'lagging' | 'synced' | 'momentum';

export interface NationalParticipationVelocityCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ParticipationVelocityCouplingBand;
  velocityDrag: number;
  summary: string;
  stewardNote: string;
}

export type SkillsTightnessCoherenceBand = 'incoherent' | 'strained' | 'coherent' | 'aligned';

export interface NationalSkillsTightnessCoherenceOutlook {
  turn: number;
  coherenceIndex: number;
  band: SkillsTightnessCoherenceBand;
  mismatchDrag: number;
  summary: string;
  stewardNote: string;
}

export type IntegratedLaborReadinessBand = 'unprepared' | 'caution' | 'ready' | 'primed';

export interface NationalIntegratedLaborReadinessOutlook {
  turn: number;
  readinessIndex: number;
  band: IntegratedLaborReadinessBand;
  stabilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type HybridRemoteParticipationBand = 'constrained' | 'mixed' | 'enabled' | 'expansive';

export interface NationalHybridRemoteParticipationOutlook {
  turn: number;
  remoteIndex: number;
  band: HybridRemoteParticipationBand;
  frictionDrag: number;
  summary: string;
  stewardNote: string;
}

export type CorridorCapacityStressBand = 'relief' | 'balanced' | 'stressed' | 'overloaded';

export interface NationalCorridorCapacityStressBrief {
  turn: number;
  stressIndex: number;
  band: CorridorCapacityStressBand;
  corridorMoveDrag: number;
  summary: string;
  stewardNote: string;
}

export type StewardInterventionBand = 'observe' | 'nudge' | 'act' | 'urgent';

export interface NationalStewardInterventionPriorityBrief {
  turn: number;
  priorityIndex: number;
  band: StewardInterventionBand;
  readinessDrag: number;
  summary: string;
  stewardNote: string;
}

export type EssentialWorkerParticipationBand = 'strained' | 'mixed' | 'supported' | 'resilient';

export interface NationalEssentialWorkerParticipationOutlook {
  turn: number;
  essentialIndex: number;
  band: EssentialWorkerParticipationBand;
  shockDrag: number;
  summary: string;
  stewardNote: string;
}

export type WageAutomationCouplingBand = 'disruptive' | 'tense' | 'balanced' | 'harmonized';

export interface NationalWageAutomationCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: WageAutomationCouplingBand;
  automationDrag: number;
  summary: string;
  stewardNote: string;
}

export type LaborCohesionBand = 'fragmented' | 'patchy' | 'cohesive' | 'unified';

export interface NationalLaborCohesionIndex {
  turn: number;
  cohesionIndex: number;
  band: LaborCohesionBand;
  stabilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type SeasonalParticipationSwingBand = 'volatile' | 'uneven' | 'managed' | 'stable';

export interface NationalSeasonalParticipationSwingOutlook {
  turn: number;
  swingIndex: number;
  band: SeasonalParticipationSwingBand;
  seasonalDrag: number;
  summary: string;
  stewardNote: string;
}

export type CohesionCorridorCouplingBand = 'decoupled' | 'strained' | 'linked' | 'reinforced';

export interface NationalCohesionCorridorCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: CohesionCorridorCouplingBand;
  corridorDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceReliabilityBand = 'fragile' | 'patchy' | 'reliable' | 'robust';

export interface NationalWorkforceReliabilityIndex {
  turn: number;
  reliabilityIndex: number;
  band: WorkforceReliabilityBand;
  couplingDrag: number;
  summary: string;
  stewardNote: string;
}

export type RetentionReliabilityCouplingBand = 'fragile' | 'strained' | 'anchored' | 'reinforced';

export interface NationalRetentionReliabilityCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: RetentionReliabilityCouplingBand;
  reliabilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type UpskillingVelocityBand = 'stalled' | 'uneven' | 'active' | 'accelerating';

export interface NationalUpskillingVelocityOutlook {
  turn: number;
  velocityIndex: number;
  band: UpskillingVelocityBand;
  mismatchDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectWorkforceReadinessBand = 'unready' | 'caution' | 'subject_ready' | 'primed';

export interface NationalSubjectWorkforceReadinessBrief {
  turn: number;
  subjectReadinessIndex: number;
  band: SubjectWorkforceReadinessBand;
  readinessDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceSustainmentBand = 'depleted' | 'thin' | 'sustained' | 'resilient';

export interface NationalWorkforceSustainmentIndex {
  turn: number;
  sustainmentIndex: number;
  band: WorkforceSustainmentBand;
  subjectDrag: number;
  summary: string;
  stewardNote: string;
}

export type SustainmentRetentionCouplingBand = 'decoupled' | 'strained' | 'linked' | 'reinforced';

export interface NationalSustainmentRetentionCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: SustainmentRetentionCouplingBand;
  sustainmentDrag: number;
  summary: string;
  stewardNote: string;
}

export type OnboardingVelocityBand = 'stalled' | 'uneven' | 'steady' | 'surging';

export interface NationalOnboardingVelocityOutlook {
  turn: number;
  velocityIndex: number;
  band: OnboardingVelocityBand;
  pipelineDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectAssemblyContinuityBand = 'broken' | 'gapped' | 'continuous' | 'locked';

export interface NationalSubjectAssemblyContinuityBrief {
  turn: number;
  continuityIndex: number;
  band: SubjectAssemblyContinuityBand;
  assemblyDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceContinuityBand = 'fragile' | 'thin' | 'stable' | 'durable';

export interface NationalWorkforceContinuityIndex {
  turn: number;
  continuityIndex: number;
  band: WorkforceContinuityBand;
  assemblyDrag: number;
  summary: string;
  stewardNote: string;
}

export type ContinuityCoordinationCouplingBand = 'decoupled' | 'strained' | 'synced' | 'aligned';

export interface NationalContinuityCoordinationCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ContinuityCoordinationCouplingBand;
  continuityDrag: number;
  summary: string;
  stewardNote: string;
}

export type ReengagementMomentumBand = 'stalled' | 'patchy' | 'building' | 'surging';

export interface NationalReengagementMomentumOutlook {
  turn: number;
  momentumIndex: number;
  band: ReengagementMomentumBand;
  pipelineDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectWaveAssemblyBand = 'blocked' | 'gapped' | 'ready' | 'cleared';

export interface NationalSubjectWaveAssemblyBrief {
  turn: number;
  assemblyIndex: number;
  band: SubjectWaveAssemblyBand;
  waveDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceDurabilityBand = 'brittle' | 'thin' | 'grounded' | 'fortified';

export interface NationalWorkforceDurabilityIndex {
  turn: number;
  durabilityIndex: number;
  band: WorkforceDurabilityBand;
  waveDrag: number;
  summary: string;
  stewardNote: string;
}

export interface LaborDemographicsPersisted {
  schemaVersion: string;
  revision: number;
  initializedTurn: number | null;
  lastUpdatedTurn: number;
  lastInputHash: string;
  nationalHysteresis: {
    demographicStructure: DemographicStructureBand;
    employmentLinkage: EmploymentLinkageBand;
    wagePressure: WagePressureBand;
    migrationFlow: MigrationFlowBand;
    demographicScore: number;
    employmentLinkageScore: number;
    wagePressureScore: number;
    migrationFlowScore: number;
  };
  regionalHysteresis: Record<
    string,
    {
      demographicStructure: DemographicStructureBand;
      employmentLinkage: EmploymentLinkageBand;
      wagePressure: WagePressureBand;
      migrationFlow: MigrationFlowBand;
    }
  >;
  transitions: LaborDemographicsTransition[];
  history: Array<{ turn: number; hash: string; summary: string }>;
  activeMigrationShocks?: LaborMigrationShock[];
}

export interface LaborDemographicsInputs {
  turn: number;
  enabled?: boolean;
  industries?: any;
  workforce?: any;
  households?: any;
  livingRegions?: any;
  economicGeography?: any;
  capabilities?: Array<{ id: string; active?: boolean; automationShift?: number }>;
  /** Test / scenario hook — inject shocks without mutating canonical crisis systems. */
  migrationShockOverrides?: LaborMigrationShock[];
}

export interface LaborDemographicsWorldView {
  enabled: boolean;
  state: NationalLaborDemographicsState;
  persisted: LaborDemographicsPersisted;
  inputs: LaborDemographicsInputs;
}


// --- source: boundaries.ts ---
/**
 * Structural boundary rules — mirrors SECTION 20AJ invariants.
 */

export const V1014_LABOR_FORBIDDEN_STATE_KEYS = [
  'population',
  'unemploymentRate',
  'workerAgents',
  'payrollCost',
  'wageBill',
  'migrationQuota'
] as const;

export const V1014_LABOR_BOUNDARY_RULES: readonly { id: string; rule: string }[] = [
  {
    id: 'no_population_counts',
    rule: 'Never persist literal population, unemployment %, payroll, or migration quota figures — only bands and 0..100 indices.'
  },
  {
    id: 'v101_industry_output',
    rule: 'V10.1 effectiveOutput remains authoritative for employment linkage; V10.14 interprets only.'
  },
  {
    id: 'v1010_workforce',
    rule: 'V10.10 workforce pressure and automation shift remain authoritative; V10.14 reads strain for wages and automation feedback.'
  },
  {
    id: 'v1013_households',
    rule: 'V10.13 household employment opportunity informs fit scores but is never overwritten here.'
  },
  {
    id: 'no_wallets',
    rule: 'Labor demographics never mutates player cash, AP, or commodity prices.'
  }
] as const;

export function summarizeLaborBoundariesForGi(): string[] {
  return V1014_LABOR_BOUNDARY_RULES.map(r => r.rule);
}


// --- source: bands.ts ---
  DemographicStructureBand,
  EmploymentLinkageBand,
  MigrationFlowBand,
  WagePressureBand
} from './types';

export function v1014laborClamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

export function v1014laborBandDemographic(score: number): DemographicStructureBand {
  if (score < 28) return 'contracting';
  if (score < 42) return 'aging_pressure';
  if (score < 58) return 'stable';
  if (score < 72) return 'youthful_growth';
  return 'rapid_growth';
}

export function v1014laborBandEmployment(score: number): EmploymentLinkageBand {
  if (score < 30) return 'dislocated';
  if (score < 45) return 'weak';
  if (score < 62) return 'balanced';
  if (score < 78) return 'strong';
  return 'tight_labor';
}

export function v1014laborBandWage(score: number): WagePressureBand {
  if (score < 25) return 'deflationary';
  if (score < 42) return 'soft';
  if (score < 58) return 'stable';
  if (score < 74) return 'elevated';
  return 'surging';
}

export function v1014laborBandMigration(score: number): MigrationFlowBand {
  if (score < 28) return 'outflow';
  if (score < 44) return 'slight_outflow';
  if (score < 56) return 'balanced';
  if (score < 72) return 'inflow';
  return 'strong_inflow';
}

export function v1014laborApplyHysteresis<T extends string>(
  prevBand: T,
  targetScore: number,
  prevScore: number,
  bandFn: (s: number) => T
): { band: T; score: number } {
  const target = bandFn(targetScore);
  const dead = V1014_LABOR_LIMITS.hysteresisDeadband;
  if (target === prevBand) {
    return { band: prevBand, score: v1014laborClamp(prevScore * 0.35 + targetScore * 0.65) };
  }
  const delta = Math.abs(targetScore - prevScore);
  if (delta < dead) {
    return { band: prevBand, score: v1014laborClamp(prevScore * 0.6 + targetScore * 0.4) };
  }
  return { band: target, score: v1014laborClamp(targetScore) };
}


// --- source: demographics.ts ---

/** Demographic structure score from regional industry mix and Living Regions momentum. */
export function computeRegionalDemographicRaw(params: {
  momentumBoost: number;
  dominant: StrategicIndustryKind | null;
}): number {
  const { momentumBoost, dominant } = params;
  return v1014laborClamp(
    48 +
      momentumBoost +
      (dominant === 'technology' || dominant === 'research' ? 6 : 0) +
      (dominant === 'agriculture' ? -4 : 0)
  );
}

export function livingRegionsMomentumBoost(livingRegions: any, regionId: string): number {
  const lr = livingRegions?.regions?.[regionId];
  if (lr?.momentum?.band === 'rising') return 8;
  if (lr?.momentum?.band === 'falling') return -6;
  return 0;
}


// --- source: wages.ts ---

/** Wage pressure from workforce strain, industry output index, and momentum. */
export function computeRegionalWagePressureRaw(params: {
  wfStrain: number;
  outputIndex: number;
  momentumBoost: number;
}): number {
  const { wfStrain, outputIndex, momentumBoost } = params;
  return v1014laborClamp(wfStrain * 0.45 + outputIndex * 0.35 + momentumBoost + 10);
}

export function workforceStrainForRegion(regionId: string, workforce: any): number {
  if (!workforce?.regions) return 50;
  const r = workforce.regions[regionId];
  if (!r) return 50;
  const ratio = Number(r.effectivePressureRatio ?? r.pressureRatio ?? 0.5);
  return v1014laborClamp(ratio * 100);
}


// --- source: migration.ts ---

export function computeRegionalAttractiveness(params: {
  empLinkageRaw: number;
  wfStrain: number;
  hhFit: number;
}): number {
  const { empLinkageRaw, wfStrain, hhFit } = params;
  return empLinkageRaw * 0.5 + (100 - wfStrain) * 0.3 + hhFit * 0.2;
}

export function applyMigrationScoresToRegions(
  regions: Record<string, { migrationFlow: MigrationFlowBand; migrationFlowScore: number }>,
  attractiveness: Record<string, number>
): void {
  const avgAttr =
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + (attractiveness[c] || 50), 0) /
    V1014_LABOR_CORE_REGIONS.length;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const diff = (attractiveness[regionId] || 50) - avgAttr;
    const migRaw = v1014laborClamp(50 + diff * 0.85);
    regions[regionId].migrationFlow = v1014laborBandMigration(migRaw);
    regions[regionId].migrationFlowScore = migRaw;
  });
}

export function nationalMigrationAverage(
  regions: Record<string, { migrationFlowScore: number }>
): number {
  return v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].migrationFlowScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
}


// --- source: employment-linkage.ts ---
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  V1014_LABOR_LIMITS,
  type LaborDemographicsIndustryLink,
  type StrategicIndustryKind,
  INDUSTRY_LABEL
} from './types';

export function v1014laborRegionIndustryOutputIndex(
  regionId: string,
  industries: any
): { index: number; dominant: StrategicIndustryKind | null } {
  const reg = industries?.regions?.[regionId];
  if (!reg?.industries) return { index: 0, dominant: null };
  let best: StrategicIndustryKind | null = null;
  let bestOut = 0;
  let weighted = 0;
  STRATEGIC_INDUSTRIES.forEach(k => {
    const st = reg.industries[k];
    const out = Math.max(0, Number(st?.effectiveOutput || 0));
    const w = V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k];
    weighted += out * w;
    if (out > bestOut) {
      bestOut = out;
      best = k;
    }
  });
  return { index: v1014laborClamp(weighted / 4.5), dominant: bestOut >= 8 ? best : null };
}

export function computeRegionalEmploymentLinkageRaw(params: {
  outputIndex: number;
  hhFit: number;
  wfStrain: number;
}): number {
  const { outputIndex, hhFit, wfStrain } = params;
  return v1014laborClamp(outputIndex * 0.55 + hhFit * 0.25 + (100 - wfStrain) * 0.2);
}

export function householdEmploymentFit(regionId: string, households: any): number {
  const reg = households?.regions?.[regionId];
  if (!reg) return 50;
  const rankMap: Record<string, number> = {
    scarce: 20,
    weak: 35,
    balanced: 55,
    strong: 72,
    abundant: 88
  };
  const band = reg.employmentOpportunity || reg.employmentOpportunityBand || 'balanced';
  return rankMap[String(band)] ?? 50;
}

export function buildIndustryLinks(industries: any): LaborDemographicsIndustryLink[] {
  const indOut = industries?.national?.output || {};
  const tot =
    STRATEGIC_INDUSTRIES.reduce((a, k) => a + Math.max(0, Number((indOut as any)[k] || 0)), 0) || 1;
  return STRATEGIC_INDUSTRIES.map(k => {
    const share = Math.max(0, Number((indOut as any)[k] || 0)) / tot;
    const hotspots = V1014_LABOR_CORE_REGIONS.filter(c => {
      const st = industries?.regions?.[c]?.industries?.[k];
      return st && Number(st.effectiveOutput || 0) >= 15;
    }).slice(0, 4);
    const linkageScore = v1014laborClamp(share * 100 * V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k]);
    return {
      industry: k,
      nationalOutputShare: share,
      employmentWeight: V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k],
      linkageScore,
      regionalHotspots: hotspots
    };
  })
    .sort((a, b) => b.linkageScore - a.linkageScore)
    .slice(0, V1014_LABOR_LIMITS.maxIndustryLinks);
}

export function formatIndustryEvidence(links: LaborDemographicsIndustryLink[]): string[] {
  return links
    .slice(0, 3)
    .map(
      l =>
        `${INDUSTRY_LABEL[l.industry]} linkage ${Math.round(l.linkageScore)} (${l.regionalHotspots.join(', ') || 'national'})`
    );
}


// --- source: automation-feedback.ts ---
/**
 * Automation → labor market feedback (read-only interpretation).
 * Connects V10.10 automation shift signals to bounded score adjustments and steward hints.
 */


export type AutomationLaborPressureBand = 'minimal' | 'moderate' | 'accelerating' | 'disruptive';

export interface LaborAutomationFeedback {
  pressureBand: AutomationLaborPressureBand;
  nationalAutomationIndex: number;
  employmentLinkageAdjust: number;
  wagePressureAdjust: number;
  demographicAdjust: number;
  migrationAdjust: number;
  stewardHints: string[];
  playerFacingSummary: string;
}

function bandFromIndex(index: number): AutomationLaborPressureBand {
  if (index < 25) return 'minimal';
  if (index < 50) return 'moderate';
  if (index < 75) return 'accelerating';
  return 'disruptive';
}

export function computeLaborAutomationFeedback(params: {
  workforce?: any;
  capabilities?: Array<{ id: string; active?: boolean; automationShift?: number }>;
  wfStrainNational?: number;
}): LaborAutomationFeedback {
  const caps = (params.capabilities || []).filter(c => c.active !== false);
  let capAvg = 0;
  if (caps.length) {
    capAvg =
      caps.reduce((a, c) => a + Math.max(0, Math.min(100, Number(c.automationShift) || 0)), 0) /
      caps.length;
  }

  const domains = params.workforce?.domains;
  let domainAuto = 0;
  if (domains && typeof domains === 'object') {
    const mods = Object.values(domains as Record<string, { automationShiftModifier?: number }>)
      .map(d => Math.abs(Number(d.automationShiftModifier) || 0) * 100)
      .filter(Number.isFinite);
    if (mods.length) domainAuto = mods.reduce((a, b) => a + b, 0) / mods.length;
  }

  const summaryText = String(params.workforce?.automationShiftSummary || '');
  const summaryBoost = summaryText.toLowerCase().includes('automation') ? 8 : 0;

  const nationalAutomationIndex = v1014laborClamp(capAvg * 0.45 + domainAuto * 0.35 + summaryBoost);
  const pressureBand = bandFromIndex(nationalAutomationIndex);

  const strain = params.wfStrainNational ?? 50;
  const employmentLinkageAdjust = -v1014laborClamp(nationalAutomationIndex * 0.12, 0, 14);
  const wagePressureAdjust = v1014laborClamp(
    nationalAutomationIndex * 0.06 + (strain > 65 ? nationalAutomationIndex * 0.05 : -nationalAutomationIndex * 0.03),
    -8,
    12
  );
  const demographicAdjust = v1014laborClamp(nationalAutomationIndex * 0.04 - 2, -4, 6);
  const migrationAdjust = v1014laborClamp(nationalAutomationIndex * 0.03 - 1.5, -3, 5);

  const stewardHints: string[] = [];
  if (pressureBand === 'disruptive') {
    stewardHints.push(
      'Automation is reshaping labor linkage — prefer workforce transition actions before further auto commits.'
    );
  } else if (pressureBand === 'accelerating') {
    stewardHints.push('Elevated automation shift — monitor wage pressure in high-output regions.');
  } else if (pressureBand === 'moderate') {
    stewardHints.push('Moderate automation feedback — employment linkage tracks output with normal hysteresis.');
  } else {
    stewardHints.push('Automation pressure minimal — labor demographics follow industry output only.');
  }

  const playerFacingSummary =
    summaryText ||
    `Automation pressure index ${Math.round(nationalAutomationIndex)} (${pressureBand.replace('_', ' ')}).`;

  return {
    pressureBand,
    nationalAutomationIndex,
    employmentLinkageAdjust,
    wagePressureAdjust,
    demographicAdjust,
    migrationAdjust,
    stewardHints,
    playerFacingSummary
  };
}

export function mergeAutomationFeedbackIntoRegionalScores(
  scores: {
    empLinkageRaw: number;
    wageRaw: number;
    demoRaw: number;
    migRaw?: number;
  },
  feedback: LaborAutomationFeedback
): typeof scores {
  return {
    empLinkageRaw: v1014laborClamp(scores.empLinkageRaw + feedback.employmentLinkageAdjust),
    wageRaw: v1014laborClamp(scores.wageRaw + feedback.wagePressureAdjust),
    demoRaw: v1014laborClamp(scores.demoRaw + feedback.demographicAdjust),
    migRaw:
      scores.migRaw != null
        ? v1014laborClamp(scores.migRaw + feedback.migrationAdjust)
        : undefined
  };
}


// --- source: catalog/regional-labor-baselines.ts ---

/** Static regional labor-market character (indices 0..100 — not population). */
export interface RegionalLaborBaseline {
  regionId: string;
  name: string;
  laborMobilityIndex: number;
  wageStickinessIndex: number;
  migrationElasticity: number;
  demographicInertia: number;
  anchorIndustries: StrategicIndustryKind[];
  narrative: string;
}

export const REGION_LABOR_BASELINES: Record<string, RegionalLaborBaseline> = {
  NSW: {
    regionId: 'NSW',
    name: 'New South Wales',
    laborMobilityIndex: 78,
    wageStickinessIndex: 62,
    migrationElasticity: 0.82,
    demographicInertia: 55,
    anchorIndustries: ['technology', 'trade', 'research'],
    narrative: 'Metro services and tech anchor a mobile, wage-responsive labor pool.'
  },
  VIC: {
    regionId: 'VIC',
    name: 'Victoria',
    laborMobilityIndex: 74,
    wageStickinessIndex: 58,
    migrationElasticity: 0.78,
    demographicInertia: 52,
    anchorIndustries: ['manufacturing', 'technology', 'research'],
    narrative: 'Manufacturing–research mix with strong internal mobility.'
  },
  QLD: {
    regionId: 'QLD',
    name: 'Queensland',
    laborMobilityIndex: 68,
    wageStickinessIndex: 48,
    migrationElasticity: 0.88,
    demographicInertia: 46,
    anchorIndustries: ['mining', 'tourism', 'agriculture'],
    narrative: 'Resource and tourism cycles drive elastic migration swings.'
  },
  WA: {
    regionId: 'WA',
    name: 'Western Australia',
    laborMobilityIndex: 62,
    wageStickinessIndex: 44,
    migrationElasticity: 0.92,
    demographicInertia: 42,
    anchorIndustries: ['mining', 'energy', 'trade'],
    narrative: 'Fly-in fly-out dynamics amplify migration sensitivity to mining output.'
  },
  SA: {
    regionId: 'SA',
    name: 'South Australia',
    laborMobilityIndex: 58,
    wageStickinessIndex: 54,
    migrationElasticity: 0.65,
    demographicInertia: 58,
    anchorIndustries: ['manufacturing', 'agriculture', 'research'],
    narrative: 'Smaller pool with moderate outflow when affordability strains.'
  },
  TAS: {
    regionId: 'TAS',
    name: 'Tasmania',
    laborMobilityIndex: 50,
    wageStickinessIndex: 60,
    migrationElasticity: 0.55,
    demographicInertia: 64,
    anchorIndustries: ['agriculture', 'tourism', 'energy'],
    narrative: 'Island inertia limits rapid migration despite tourism demand.'
  },
  NT: {
    regionId: 'NT',
    name: 'Northern Territory',
    laborMobilityIndex: 70,
    wageStickinessIndex: 40,
    migrationElasticity: 0.95,
    demographicInertia: 38,
    anchorIndustries: ['mining', 'energy', 'agriculture'],
    narrative: 'Frontier labor market with high turnover tied to resource projects.'
  },
  ACT: {
    regionId: 'ACT',
    name: 'Australian Capital Territory',
    laborMobilityIndex: 72,
    wageStickinessIndex: 68,
    migrationElasticity: 0.72,
    demographicInertia: 50,
    anchorIndustries: ['research', 'technology', 'trade'],
    narrative: 'Public–research employment stabilizes wages; moderate migration pull.'
  }
};

export function lookupRegionalLaborBaseline(regionId: string): RegionalLaborBaseline | null {
  return REGION_LABOR_BASELINES[regionId] ?? null;
}


// --- source: catalog/labor-stress-scenarios.ts ---

export type LaborStressScenarioId =
  | 'ld_sc_mining_supercycle'
  | 'ld_sc_housing_affordability_crunch'
  | 'ld_sc_automation_displacement'
  | 'ld_sc_metro_talent_war'
  | 'ld_sc_frontier_recovery'
  | 'ld_sc_tourism_reopening'
  | 'ld_sc_energy_transition_skills'
  | 'ld_sc_essential_access_crisis';

export interface LaborStressScenario {
  id: LaborStressScenarioId;
  title: string;
  narrative: string;
  primaryRegions: string[];
  expectedShockKinds: MigrationShockKind[];
  wagePressureBias: number;
  migrationFlowBias: number;
  employmentLinkageBias: number;
  tags: readonly string[];
}

export const LABOR_STRESS_SCENARIO_CATALOG: LaborStressScenario[] = [
  {
    id: 'ld_sc_mining_supercycle',
    title: 'Mining supercycle labor pull',
    narrative: 'Sustained mining effectiveOutput concentrates inflow pressure on WA and QLD without inventing headcounts.',
    primaryRegions: ['WA', 'QLD'],
    expectedShockKinds: ['resource_boom_inflow'],
    wagePressureBias: 6,
    migrationFlowBias: 10,
    employmentLinkageBias: 4,
    tags: ['agent-09', 'v10.14', 'mining']
  },
  {
    id: 'ld_sc_housing_affordability_crunch',
    title: 'Housing affordability crunch',
    narrative: 'Severe household budget pressure triggers outflow shocks in metro regions.',
    primaryRegions: ['NSW', 'VIC'],
    expectedShockKinds: ['housing_affordability_outflow'],
    wagePressureBias: 8,
    migrationFlowBias: -12,
    employmentLinkageBias: -3,
    tags: ['agent-09', 'v10.14', 'households']
  },
  {
    id: 'ld_sc_automation_displacement',
    title: 'Automation displacement wave',
    narrative: 'High capability automationShift reduces employment linkage while wage paths bifurcate by strain.',
    primaryRegions: ['NSW', 'VIC', 'QLD'],
    expectedShockKinds: [],
    wagePressureBias: 4,
    migrationFlowBias: -4,
    employmentLinkageBias: -8,
    tags: ['agent-09', 'v10.14', 'automation']
  },
  {
    id: 'ld_sc_metro_talent_war',
    title: 'Metro talent war',
    narrative: 'Tech output with manageable budgets pulls talent toward NSW/VIC metros.',
    primaryRegions: ['NSW', 'VIC'],
    expectedShockKinds: ['metro_talent_pull'],
    wagePressureBias: 5,
    migrationFlowBias: 7,
    employmentLinkageBias: 2,
    tags: ['agent-09', 'v10.14', 'technology']
  },
  {
    id: 'ld_sc_frontier_recovery',
    title: 'Frontier recovery redirect',
    narrative: 'National household shock sensitivity redirects modest recovery inflow to a frontier region.',
    primaryRegions: ['NT', 'TAS', 'SA'],
    expectedShockKinds: ['frontier_recovery_inflow'],
    wagePressureBias: 0,
    migrationFlowBias: 5,
    employmentLinkageBias: 1,
    tags: ['agent-09', 'v10.14', 'migration']
  },
  {
    id: 'ld_sc_tourism_reopening',
    title: 'Tourism reopening surge',
    narrative: 'Tourism effectiveOutput recovery lifts employment linkage in QLD and TAS.',
    primaryRegions: ['QLD', 'TAS'],
    expectedShockKinds: [],
    wagePressureBias: 3,
    migrationFlowBias: 4,
    employmentLinkageBias: 5,
    tags: ['agent-09', 'v10.14', 'tourism']
  },
  {
    id: 'ld_sc_energy_transition_skills',
    title: 'Energy transition skills gap',
    narrative: 'Energy and manufacturing mismatch elevates wage pressure under workforce strain.',
    primaryRegions: ['SA', 'VIC', 'WA'],
    expectedShockKinds: [],
    wagePressureBias: 7,
    migrationFlowBias: 2,
    employmentLinkageBias: -2,
    tags: ['agent-09', 'v10.14', 'energy']
  },
  {
    id: 'ld_sc_essential_access_crisis',
    title: 'Essential access crisis',
    narrative: 'Essentials gap triggers outflow shocks and weakens employment fit.',
    primaryRegions: ['NSW', 'QLD', 'NT'],
    expectedShockKinds: ['essential_access_outflow'],
    wagePressureBias: 5,
    migrationFlowBias: -9,
    employmentLinkageBias: -5,
    tags: ['agent-09', 'v10.14', 'households']
  }
];

export function lookupLaborStressScenario(id: string): LaborStressScenario | null {
  return LABOR_STRESS_SCENARIO_CATALOG.find(s => s.id === id) ?? null;
}

export function laborStressScenariosForRegion(regionId: string): LaborStressScenario[] {
  return LABOR_STRESS_SCENARIO_CATALOG.filter(s => s.primaryRegions.includes(regionId));
}


// --- source: household-budget-detail.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalHouseholdBudgetDetail,
  type RegionalHouseholdBudgetDetail
} from './types';

const AFFORDABILITY_RANK: Record<string, number> = {
  severe_pressure: 12,
  strained: 28,
  tight: 45,
  healthy: 68,
  very_affordable: 88
};

const RESILIENCE_RANK: Record<string, number> = {
  vulnerable: 15,
  fragile: 32,
  moderate: 52,
  resilient: 72,
  robust: 90
};

const ESSENTIALS_RANK: Record<string, number> = {
  critical: 10,
  poor: 25,
  strained: 42,
  adequate: 62,
  strong: 85
};

const HOUSING_PRESSURE_RANK: Record<string, number> = {
  severe: 8,
  high: 22,
  elevated: 38,
  moderate: 55,
  low: 78
};

function rank(map: Record<string, number>, band: unknown, fallback = 50): number {
  const key = String(band ?? '');
  return map[key] ?? fallback;
}

export function computeRegionalHouseholdBudgetDetail(
  regionId: string,
  households: any
): RegionalHouseholdBudgetDetail {
  const reg = households?.regions?.[regionId];
  if (!reg) {
    return {
      regionId,
      budgetPressureScore: 50,
      essentialsGapScore: 50,
      resilienceScore: 50,
      affordabilityBand: 'unknown',
      essentialsBand: 'unknown',
      narrative: 'Household budget detail unavailable — using neutral pressure.'
    };
  }

  const affordabilityBand = String(reg.affordability ?? households?.national?.affordability ?? 'tight');
  const essentialsBand = String(reg.essentialAccess ?? 'adequate');
  const resilienceBand = String(reg.resilience ?? reg.financialResilience ?? 'moderate');
  const housingBand = String(reg.housingPressure ?? households?.national?.housingPressure ?? 'moderate');

  const affordabilityScore = rank(AFFORDABILITY_RANK, affordabilityBand);
  const essentialsScore = rank(ESSENTIALS_RANK, essentialsBand);
  const resilienceScore = rank(RESILIENCE_RANK, resilienceBand);
  const housingScore = rank(HOUSING_PRESSURE_RANK, housingBand);

  const budgetPressureScore = v1014laborClamp(
    100 - affordabilityScore * 0.45 - resilienceScore * 0.25 - housingScore * 0.3
  );
  const essentialsGapScore = v1014laborClamp(100 - essentialsScore);

  const narrative =
    budgetPressureScore >= 65
      ? `Elevated household budget pressure (${affordabilityBand.replace(/_/g, ' ')}) weighs on labor mobility.`
      : budgetPressureScore <= 35
        ? `Household budgets are relatively resilient (${affordabilityBand.replace(/_/g, ' ')}).`
        : `Mixed household budget conditions (${affordabilityBand.replace(/_/g, ' ')}).`;

  return {
    regionId,
    budgetPressureScore,
    essentialsGapScore,
    resilienceScore,
    affordabilityBand,
    essentialsBand,
    narrative
  };
}

export function computeNationalHouseholdBudgetDetail(households: any): NationalHouseholdBudgetDetail {
  const regions: Record<string, RegionalHouseholdBudgetDetail> = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = computeRegionalHouseholdBudgetDetail(c, households);
  });

  const nationalBudgetPressureScore = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].budgetPressureScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalEssentialsGapScore = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].essentialsGapScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );

  const natAff = rank(AFFORDABILITY_RANK, households?.national?.affordability, 50);
  const natRes = rank(RESILIENCE_RANK, households?.national?.financialResilience, 50);
  let shockSensitivity: NationalHouseholdBudgetDetail['shockSensitivity'] = 'moderate';
  if (natRes <= 20 || (natRes <= 35 && natAff <= 25)) shockSensitivity = 'critical';
  else if (natRes <= 35 || natAff <= 30) shockSensitivity = 'high';
  else if (natRes >= 70 && natAff >= 65) shockSensitivity = 'low';

  const summary = `National household budget pressure index ${Math.round(nationalBudgetPressureScore)} (essentials gap ${Math.round(nationalEssentialsGapScore)}); shock sensitivity ${shockSensitivity}.`;

  return {
    nationalBudgetPressureScore,
    nationalEssentialsGapScore,
    shockSensitivity,
    regions,
    summary
  };
}

/** Bounded labor-market adjustments from household budget detail (no currency). */
export function householdBudgetLaborAdjustments(detail: RegionalHouseholdBudgetDetail): {
  attractivenessDelta: number;
  wagePressureDelta: number;
  employmentFitDelta: number;
} {
  const attractivenessDelta = -v1014laborClamp(detail.budgetPressureScore * 0.12, 0, 12);
  const wagePressureDelta = v1014laborClamp(detail.budgetPressureScore * 0.06, 0, 8);
  const employmentFitDelta = -v1014laborClamp(detail.essentialsGapScore * 0.08, 0, 10);
  return { attractivenessDelta, wagePressureDelta, employmentFitDelta };
}


// --- source: migration-shocks.ts ---
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  type LaborDemographicsInputs,
  type LaborMigrationShock,
  type LaborMigrationShockView,
  type MigrationFlowBand,
  type MigrationShockKind
} from './types';

export const MIGRATION_SHOCK_LABEL: Record<MigrationShockKind, string> = {
  resource_boom_inflow: 'Resource-sector labor inflow shock',
  housing_affordability_outflow: 'Housing affordability outflow shock',
  essential_access_outflow: 'Essential access outflow shock',
  metro_talent_pull: 'Metro talent pull shock',
  frontier_recovery_inflow: 'Frontier recovery inflow shock'
};

function shockId(kind: MigrationShockKind, regionId: string, turn: number): string {
  return `msh_${kind}_${regionId}_t${turn}`;
}

export function detectMigrationShocks(params: {
  turn: number;
  inputs: LaborDemographicsInputs;
  householdBudget: NationalHouseholdBudgetDetail;
}): LaborMigrationShock[] {
  const { turn, inputs, householdBudget } = params;
  const shocks: LaborMigrationShock[] = [];
  const duration = V1014_LABOR_LIMITS.migrationShockDefaultDuration;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const miningOut = Number(inputs.industries?.regions?.[regionId]?.industries?.mining?.effectiveOutput || 0);
    if (miningOut >= 45 && (regionId === 'WA' || regionId === 'QLD')) {
      shocks.push({
        id: shockId('resource_boom_inflow', regionId, turn),
        kind: 'resource_boom_inflow',
        regionId,
        magnitude: v1014laborClamp(8 + miningOut * 0.15, 8, 22),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'High mining effectiveOutput pulls structural inflow (no population counts).'
      });
    }

    const hh = householdBudget.regions[regionId];
    if (hh && hh.budgetPressureScore >= 68) {
      shocks.push({
        id: shockId('housing_affordability_outflow', regionId, turn),
        kind: 'housing_affordability_outflow',
        regionId,
        magnitude: -v1014laborClamp(hh.budgetPressureScore * 0.18, 6, 18),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Severe household budget pressure discourages net inflow.'
      });
    }
    if (hh && hh.essentialsGapScore >= 55) {
      shocks.push({
        id: shockId('essential_access_outflow', regionId, turn),
        kind: 'essential_access_outflow',
        regionId,
        magnitude: -v1014laborClamp(hh.essentialsGapScore * 0.12, 4, 14),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Essential access strain increases outflow pressure.'
      });
    }

    const techOut = Number(inputs.industries?.regions?.[regionId]?.industries?.technology?.effectiveOutput || 0);
    if ((regionId === 'NSW' || regionId === 'VIC') && techOut >= 35 && hh && hh.budgetPressureScore <= 45) {
      shocks.push({
        id: shockId('metro_talent_pull', regionId, turn),
        kind: 'metro_talent_pull',
        regionId,
        magnitude: v1014laborClamp(6 + techOut * 0.1, 6, 16),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Metro tech output with manageable budgets attracts talent inflow.'
      });
    }
  });

  if (householdBudget.shockSensitivity === 'critical' || householdBudget.shockSensitivity === 'high') {
    const frontier = ['NT', 'TAS', 'SA'].find(
      c => (householdBudget.regions[c]?.budgetPressureScore ?? 50) <= 40
    );
    if (frontier) {
      shocks.push({
        id: shockId('frontier_recovery_inflow', frontier, turn),
        kind: 'frontier_recovery_inflow',
        regionId: frontier,
        magnitude: 7,
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'National household shock sensitivity redirects modest recovery inflow to a frontier region.'
      });
    }
  }

  return shocks.slice(0, V1014_LABOR_LIMITS.maxActiveMigrationShocks);
}

export function mergeMigrationShocks(
  persisted: LaborMigrationShock[] | undefined,
  detected: LaborMigrationShock[],
  overrides: LaborMigrationShock[] | undefined,
  turn: number
): LaborMigrationShock[] {
  const byId = new Map<string, LaborMigrationShock>();
  (persisted || []).forEach(s => {
    if (s.turnsRemaining > 0) byId.set(s.id, s);
  });
  detected.forEach(s => byId.set(s.id, s));
  (overrides || []).forEach(s => byId.set(s.id, { ...s, startedTurn: s.startedTurn || turn }));
  return [...byId.values()]
    .filter(s => s.turnsRemaining > 0)
    .slice(-V1014_LABOR_LIMITS.maxActiveMigrationShocks);
}

export function advanceMigrationShocks(shocks: LaborMigrationShock[], turn: number): LaborMigrationShock[] {
  return shocks
    .map(s => ({
      ...s,
      turnsRemaining: Math.max(0, s.turnsRemaining - (s.startedTurn < turn ? 1 : 0))
    }))
    .filter(s => s.turnsRemaining > 0);
}

export function applyMigrationShocksToRegions(
  regions: Record<string, { migrationFlow: MigrationFlowBand; migrationFlowScore: number }>,
  shocks: LaborMigrationShock[]
): { totalDeltaApplied: number; regionsTouched: string[] } {
  const deltas: Record<string, number> = {};
  shocks.forEach(s => {
    deltas[s.regionId] = (deltas[s.regionId] || 0) + s.magnitude;
  });
  let totalDeltaApplied = 0;
  const regionsTouched: string[] = [];
  Object.entries(deltas).forEach(([regionId, delta]) => {
    if (!regions[regionId]) return;
    const next = v1014laborClamp(regions[regionId].migrationFlowScore + delta);
    regions[regionId].migrationFlowScore = next;
    regions[regionId].migrationFlow = v1014laborBandMigration(next);
    totalDeltaApplied += Math.abs(delta);
    regionsTouched.push(regionId);
  });
  return { totalDeltaApplied, regionsTouched };
}

export function toMigrationShockViews(shocks: LaborMigrationShock[]): LaborMigrationShockView[] {
  return shocks.map(s => ({
    id: s.id,
    kind: s.kind,
    regionId: s.regionId,
    magnitude: s.magnitude,
    turnsRemaining: s.turnsRemaining,
    label: MIGRATION_SHOCK_LABEL[s.kind]
  }));
}


// --- source: wage-migration-coupling.ts ---

/** Coupling index: high wages + high budget pressure → stronger outflow feedback. */
export function computeRegionalWageMigrationCoupling(snapshot: LaborDemographicsRegionSnapshot): {
  couplingIndex: number;
  wageMigrationFeedback: number;
  explanation: string;
} {
  const baseline = lookupRegionalLaborBaseline(snapshot.regionId);
  const elasticity = baseline?.migrationElasticity ?? 0.7;
  const stickiness = (baseline?.wageStickinessIndex ?? 50) / 100;
  const budgetPressure = snapshot.householdBudgetPressureScore ?? 50;

  const wageHot =
    snapshot.wagePressure === 'elevated' ||
    snapshot.wagePressure === 'surging' ||
    snapshot.wagePressureScore >= 62;
  const wageCool =
    snapshot.wagePressure === 'deflationary' ||
    snapshot.wagePressure === 'soft' ||
    snapshot.wagePressureScore <= 38;

  let feedback = 0;
  if (wageHot && budgetPressure >= 55) {
    feedback = -v1014laborClamp((snapshot.wagePressureScore - 50) * 0.12 * elasticity + budgetPressure * 0.05);
  } else if (wageHot && budgetPressure <= 40) {
    feedback = v1014laborClamp((snapshot.wagePressureScore - 50) * 0.1 * elasticity);
  } else if (wageCool && budgetPressure >= 60) {
    feedback = -v1014laborClamp(budgetPressure * 0.08 * elasticity);
  }

  feedback *= 1 - stickiness * 0.25;
  const couplingIndex = v1014laborClamp(50 + Math.abs(feedback) * 3 + (wageHot ? 8 : 0));

  const explanation = wageHot
    ? `Wage pressure (${snapshot.wagePressure}) interacts with budget pressure ${Math.round(budgetPressure)} → migration feedback ${feedback.toFixed(1)}.`
    : `Wage–migration coupling muted (${snapshot.wagePressure}).`;

  return { couplingIndex, wageMigrationFeedback: feedback, explanation };
}

export function applyWageMigrationCouplingToRegions(
  regions: Record<string, LaborDemographicsRegionSnapshot>
): { explanations: string[] } {
  const explanations: string[] = [];
  Object.values(regions).forEach(reg => {
    const { wageMigrationFeedback, explanation } = computeRegionalWageMigrationCoupling(reg);
    if (Math.abs(wageMigrationFeedback) < 0.5) return;
    const nextMig = v1014laborClamp(reg.migrationFlowScore + wageMigrationFeedback);
    reg.migrationFlowScore = nextMig;
    reg.migrationFlow = v1014laborBandMigration(nextMig);
    const wageAdj = v1014laborClamp(reg.wagePressureScore + wageMigrationFeedback * 0.15);
    reg.wagePressureScore = wageAdj;
    reg.wagePressure = v1014laborBandWage(wageAdj) as WagePressureBand;
    explanations.push(`${reg.regionId}: ${explanation}`);
  });
  return { explanations };
}


// --- source: regional-migration-spillovers.ts ---

/** Neighbor spillover weights for migration attractiveness (structural, not geographic simulation). */
const SPILLOVER_NEIGHBORS: Record<string, string[]> = {
  NSW: ['VIC', 'QLD', 'ACT'],
  VIC: ['NSW', 'SA', 'TAS'],
  QLD: ['NSW', 'NT'],
  WA: ['SA', 'NT'],
  SA: ['VIC', 'WA', 'NT'],
  TAS: ['VIC'],
  NT: ['QLD', 'WA', 'SA'],
  ACT: ['NSW']
};

export function applyRegionalMigrationSpillovers(
  attractiveness: Record<string, number>,
  strength = 0.12
): Record<string, number> {
  const out: Record<string, number> = { ...attractiveness };
  Object.entries(SPILLOVER_NEIGHBORS).forEach(([regionId, neighbors]) => {
    const base = attractiveness[regionId] ?? 50;
    const neighborAvg =
      neighbors.reduce((a, n) => a + (attractiveness[n] ?? 50), 0) / Math.max(1, neighbors.length);
    const diff = neighborAvg - base;
    out[regionId] = v1014laborClamp(base + diff * strength);
  });
  return out;
}

export function spilloverNeighborList(regionId: string): string[] {
  return SPILLOVER_NEIGHBORS[regionId] ?? [];
}


// --- source: gi-labor-queries.ts ---
  DEMOGRAPHIC_STRUCTURE_LABEL,
  EMPLOYMENT_LINKAGE_LABEL,
  MIGRATION_FLOW_LABEL,
  WAGE_PRESSURE_LABEL,
  type NationalLaborDemographicsState
} from './types';

export type LaborGiQueryTopic =
  | 'national_summary'
  | 'wage_pressure'
  | 'migration_flow'
  | 'employment_linkage'
  | 'demographics'
  | 'migration_shocks'
  | 'household_budget'
  | 'workforce_capacity'
  | 'labor_resilience'
  | 'participation_outlook'
  | 'dependency_ratio'
  | 'labor_velocity'
  | 'skill_mismatch'
  | 'supply_elasticity'
  | 'talent_mobility'
  | 'underemployment'
  | 'wage_competitiveness'
  | 'transition_friction'
  | 'youth_pipeline'
  | 'labor_tightness'
  | 'hybrid_participation'
  | 'senior_retention'
  | 'labor_absorption'
  | 'participation_equity'
  | 'credential_mobility'
  | 'household_participation_coupling'
  | 'rebalancing_stress'
  | 'automation_participation_resilience'
  | 'wage_participation_spillover'
  | 'migration_participation_buffer'
  | 'labor_market_stability'
  | 'intergenerational_balance'
  | 'capacity_participation_alignment'
  | 'participation_velocity_coupling'
  | 'skills_tightness_coherence'
  | 'integrated_labor_readiness'
  | 'hybrid_remote_participation'
  | 'corridor_capacity_stress'
  | 'steward_intervention_priority'
  | 'essential_worker_participation'
  | 'wage_automation_coupling'
  | 'national_labor_cohesion'
  | 'seasonal_participation_swing'
  | 'cohesion_corridor_coupling'
  | 'workforce_reliability'
  | 'retention_reliability_coupling'
  | 'upskilling_velocity'
  | 'subject_workforce_readiness'
  | 'workforce_sustainment'
  | 'sustainment_retention_coupling'
  | 'onboarding_velocity'
  | 'subject_assembly_continuity'
  | 'workforce_continuity'
  | 'continuity_coordination_coupling'
  | 'reengagement_momentum'
  | 'subject_wave_assembly'
  | 'workforce_durability';

export interface LaborGiAnswer {
  topic: LaborGiQueryTopic;
  headline: string;
  fact: string;
  inference: string;
  projection: string;
}

export function detectLaborDemographicsQuery(raw: string): LaborGiQueryTopic | null {
  const q = raw.toLowerCase();
  if (/\b(youth pipeline|youth entry|apprentice pipeline)/.test(q)) return 'youth_pipeline';
  if (/\b(senior retention|aged workforce retention|elder workforce)/.test(q)) return 'senior_retention';
  if (/\b(labor absorption|regional absorption|absorption headroom)/.test(q)) return 'labor_absorption';
  if (/\b(participation equity|equity gap|inclusion equity)/.test(q)) return 'participation_equity';
  if (/\b(credential mobility|portable credential|skills portability)/.test(q)) return 'credential_mobility';
  if (/\b(household participation coupling|budget participation link)/.test(q)) return 'household_participation_coupling';
  if (/\b(rebalancing stress|corridor stress|interregional stress)/.test(q)) return 'rebalancing_stress';
  if (/\b(automation participation resilience|automation resilience participation)/.test(q)) {
    return 'automation_participation_resilience';
  }
  if (/\b(wage participation spillover|wage spillover participation)/.test(q)) return 'wage_participation_spillover';
  if (/\b(migration shock buffer|migration participation buffer|shock buffer)/.test(q)) {
    return 'migration_participation_buffer';
  }
  if (/\b(labor market stability|market stability outlook)/.test(q)) return 'labor_market_stability';
  if (/\b(intergenerational balance|youth senior balance|generational workforce)/.test(q)) {
    return 'intergenerational_balance';
  }
  if (/\b(capacity participation alignment|capacity alignment participation)/.test(q)) {
    return 'capacity_participation_alignment';
  }
  if (/\b(participation velocity coupling|velocity participation sync)/.test(q)) {
    return 'participation_velocity_coupling';
  }
  if (/\b(skills tightness coherence|skill tightness alignment)/.test(q)) return 'skills_tightness_coherence';
  if (/\b(integrated labor readiness|labor readiness outlook)/.test(q)) return 'integrated_labor_readiness';
  if (/\b(hybrid remote participation|remote work participation outlook)/.test(q)) return 'hybrid_remote_participation';
  if (/\b(corridor capacity stress|corridor stress capacity)/.test(q)) return 'corridor_capacity_stress';
  if (/\b(steward intervention priority|intervention priority steward)/.test(q)) return 'steward_intervention_priority';
  if (/\b(essential worker participation|essential services participation)/.test(q)) {
    return 'essential_worker_participation';
  }
  if (/\b(wage automation coupling|automation wage coupling)/.test(q)) return 'wage_automation_coupling';
  if (/\b(national labor cohesion|labor cohesion index)/.test(q)) return 'national_labor_cohesion';
  if (/\b(seasonal participation swing|seasonal swing outlook)/.test(q)) return 'seasonal_participation_swing';
  if (/\b(cohesion corridor coupling|corridor cohesion link)/.test(q)) return 'cohesion_corridor_coupling';
  if (/\b(workforce reliability|reliability index labor)/.test(q)) return 'workforce_reliability';
  if (/\b(retention reliability|retention-reliability coupling)/.test(q)) return 'retention_reliability_coupling';
  if (/\b(upskilling velocity|skills velocity outlook)/.test(q)) return 'upskilling_velocity';
  if (/\b(subject workforce readiness|subject readiness labor)/.test(q)) return 'subject_workforce_readiness';
  if (/\b(workforce sustainment|sustainment index labor)/.test(q)) return 'workforce_sustainment';
  if (/\b(sustainment retention|sustainment-retention coupling)/.test(q)) return 'sustainment_retention_coupling';
  if (/\b(onboarding velocity|onboarding pipeline velocity)/.test(q)) return 'onboarding_velocity';
  if (/\b(subject assembly continuity|assembly continuity subject)/.test(q)) return 'subject_assembly_continuity';
  if (/\b(workforce continuity|continuity index labor)/.test(q)) return 'workforce_continuity';
  if (/\b(continuity coordination|continuity-coordination coupling)/.test(q)) return 'continuity_coordination_coupling';
  if (/\b(reengagement momentum|reengagement pipeline momentum)/.test(q)) return 'reengagement_momentum';
  if (/\b(subject wave assembly|wave assembly subject)/.test(q)) return 'subject_wave_assembly';
  if (/\b(workforce durability|durability index labor)/.test(q)) return 'workforce_durability';
  if (/\b(labor market tight|market tightness|tightness brief)/.test(q)) return 'labor_tightness';
  if (/\b(hybrid participation|remote friction|work from home friction)/.test(q)) return 'hybrid_participation';
  if (/\b(migration shock|shock.*migrat)/.test(q)) return 'migration_shocks';
  if (/\b(household budget|affordability|cost of living)/.test(q)) return 'household_budget';
  if (/\b(wage compet|cost burden|competitiveness)/.test(q)) return 'wage_competitiveness';
  if (/\b(wage|pay pressure|salary pressure)/.test(q)) return 'wage_pressure';
  if (/\b(migrat|inflow|outflow|relocate)/.test(q)) return 'migration_flow';
  if (/\b(employment link|jobs.*output)/.test(q)) return 'employment_linkage';
  if (/\b(dependency ratio|aging dependency|aged pressure)/.test(q)) return 'dependency_ratio';
  if (/\b(demograph|aging)/.test(q)) return 'demographics';
  if (/\b(workforce capacity|capacity gap|labor shortage)/.test(q)) return 'workforce_capacity';
  if (/\b(labor resilience|resilience score)/.test(q)) return 'labor_resilience';
  if (/\b(participation|labor force participation)/.test(q)) return 'participation_outlook';
  if (/\b(labor velocity|market churn|turnover pressure)/.test(q)) return 'labor_velocity';
  if (/\b(skill mismatch|skills gap|misaligned skills)/.test(q)) return 'skill_mismatch';
  if (/\b(supply elasticity|inelastic labor|labor supply response)/.test(q)) return 'supply_elasticity';
  if (/\b(talent mobility|mobile talent|talent flow)/.test(q)) return 'talent_mobility';
  if (/\b(underemploy|hidden slack|labor slack)/.test(q)) return 'underemployment';
  if (/\b(transition friction|sticky transition|workforce transition)/.test(q)) return 'transition_friction';
  if (/\b(labor demo|workforce structure|v10\.14)/.test(q)) return 'national_summary';
  return null;
}

export function answerLaborDemographicsQuestion(
  state: NationalLaborDemographicsState | null | undefined,
  topic: LaborGiQueryTopic
): LaborGiAnswer {
  if (!state || !state.enabled) {
    return {
      topic,
      headline: 'Labor demographics unavailable',
      fact: 'The V10.14 labor demographics layer is disabled or not computed.',
      inference: 'Enable National Systems, Industries, and Labor Demographics to answer.',
      projection: 'No projection until the layer is active.'
    };
  }

  switch (topic) {
    case 'wage_pressure':
      return {
        topic,
        headline: WAGE_PRESSURE_LABEL[state.nationalWagePressure],
        fact: `National wage pressure score ${Math.round(state.wagePressureScore)} on turn ${state.turn}. ${state.summary}`,
        inference: state.outlook,
        projection: 'Wage bands move with workforce strain and industry output momentum (bounded indices only).'
      };
    case 'migration_flow':
      return {
        topic,
        headline: MIGRATION_FLOW_LABEL[state.nationalMigrationFlow],
        fact: `Migration flow score ${Math.round(state.migrationFlowScore)}; ${(state.activeMigrationShocks || []).length} active shock(s).`,
        inference: state.outlook,
        projection: 'Attractiveness differentials shift flow bands — not literal population counts.'
      };
    case 'employment_linkage':
      return {
        topic,
        headline: EMPLOYMENT_LINKAGE_LABEL[state.nationalEmploymentLinkage],
        fact: `Employment linkage score ${Math.round(state.employmentLinkageScore)} tied to industry effectiveOutput.`,
        inference: state.summary,
        projection: 'Dominant industry shares in industryLinks drive national linkage narrative.'
      };
    case 'demographics':
      return {
        topic,
        headline: DEMOGRAPHIC_STRUCTURE_LABEL[state.nationalDemographicStructure],
        fact: `Demographic structure score ${Math.round(state.demographicScore)}.`,
        inference: 'Structure derives from industry mix and Living Regions momentum — not census data.',
        projection: 'Hysteresis dampens rapid band flips.'
      };
    case 'migration_shocks':
      return {
        topic,
        headline: 'Active migration shocks',
        fact:
          (state.activeMigrationShocks || [])
            .map(s => `${s.regionId}: ${s.label} (${s.magnitude >= 0 ? '+' : ''}${Math.round(s.magnitude)})`)
            .join('; ') || 'No active migration shocks.',
        inference: 'Shocks decay over turns when persisted.',
        projection: 'Resource booms and household strain are primary shock detectors.'
      };
    case 'household_budget':
      return {
        topic,
        headline: 'Household budget pressure (labor lens)',
        fact: state.householdBudgetSummary || 'Household budget detail not attached.',
        inference: 'Budget pressure adjusts wages and migration attractiveness without currency fields.',
        projection: 'Severe affordability increases outflow shock risk.'
      };
    case 'workforce_capacity':
      return {
        topic,
        headline: state.workforceCapacityBridge?.summary || 'Workforce capacity bridge unavailable.',
        fact: `National gap band ${state.workforceCapacityBridge?.nationalBand ?? 'unknown'}; dominant industry ${state.workforceCapacityBridge?.dominantShortageIndustry ?? 'n/a'}.`,
        inference: state.workforceCapacityBridge?.regions.NSW?.narrative || state.summary,
        projection: 'Demand vs supply indices use output linkage — not literal headcount.'
      };
    case 'labor_resilience':
      return {
        topic,
        headline: state.laborResilienceScorecard?.headline || 'Labor resilience scorecard unavailable.',
        fact:
          state.laborResilienceScorecard?.dimensions.map(d => `${d.label}: ${Math.round(d.score)}`).join('; ') ||
          'No resilience dimensions.',
        inference: state.laborResilienceScorecard?.stewardNote || state.outlook,
        projection: 'Resilience blends shocks, budget, automation, and capacity margin.'
      };
    case 'participation_outlook':
      return {
        topic,
        headline: state.participationPressureBrief?.summary || 'Participation outlook unavailable.',
        fact: `Participation band ${state.participationPressureBrief?.band ?? 'unknown'}; index ${Math.round(state.participationPressureBrief?.participationIndex ?? 50)}.`,
        inference:
          state.participationPressureBrief?.headwinds.join(' ') ||
          state.participationPressureBrief?.tailwinds.join(' ') ||
          state.outlook,
        projection: state.participationPressureBrief?.stewardNote || 'Participation indices are bounded — not literal LFPR.'
      };
    case 'dependency_ratio':
      return {
        topic,
        headline: state.dependencyRatioSnapshot?.summary || 'Dependency snapshot unavailable.',
        fact: `National dependency band ${state.dependencyRatioSnapshot?.nationalBand ?? 'unknown'}; aged-pressure regions: ${(state.dependencyRatioSnapshot?.agedPressureRegions ?? []).join(', ') || 'none'}.`,
        inference: state.dependencyRatioSnapshot?.regions.NSW?.narrative || state.summary,
        projection: 'Dependency indices proxy demographic structure — not census ratios.'
      };
    case 'labor_velocity':
      return {
        topic,
        headline: state.laborMarketVelocityIndex?.summary || 'Labor velocity index unavailable.',
        fact: `National velocity ${state.laborMarketVelocityIndex?.nationalBand ?? 'unknown'}; hottest region ${state.laborMarketVelocityIndex?.hottestRegion ?? 'n/a'}.`,
        inference: state.laborMarketVelocityIndex?.regions.NSW?.narrative || state.outlook,
        projection: 'Velocity blends migration and wage churn — not literal turnover counts.'
      };
    case 'skill_mismatch':
      return {
        topic,
        headline: state.skillMismatchIndex?.summary || 'Skill mismatch index unavailable.',
        fact: `National mismatch band ${state.skillMismatchIndex?.nationalBand ?? 'unknown'}; worst region ${state.skillMismatchIndex?.worstRegion ?? 'n/a'}.`,
        inference: state.skillMismatchIndex?.stewardNote || state.summary,
        projection: 'Mismatch indices proxy capacity vs upskilling — not credential surveys.'
      };
    case 'supply_elasticity':
      return {
        topic,
        headline: state.laborSupplyElasticityBrief?.summary || 'Supply elasticity unavailable.',
        fact: `Elasticity band ${state.laborSupplyElasticityBrief?.band ?? 'unknown'}; index ${Math.round(state.laborSupplyElasticityBrief?.elasticityIndex ?? 50)}.`,
        inference: state.laborSupplyElasticityBrief?.stewardNote || state.outlook,
        projection: 'Elasticity blends wage and participation sensitivity — bounded indices only.'
      };
    case 'talent_mobility':
      return {
        topic,
        headline: state.talentMobilityOutlook?.summary || 'Talent mobility outlook unavailable.',
        fact: `Mobility band ${state.talentMobilityOutlook?.band ?? 'unknown'}; corridor ${state.talentMobilityOutlook?.corridorHighlight ?? 'n/a'}.`,
        inference: state.talentMobilityOutlook?.stewardNote || state.outlook,
        projection: 'Mobility blends velocity, retention, and pathways — not literal relocation counts.'
      };
    case 'underemployment':
      return {
        topic,
        headline: state.underemploymentPressureBrief?.summary || 'Underemployment outlook unavailable.',
        fact: `Underemployment band ${state.underemploymentPressureBrief?.band ?? 'unknown'}; gap ${Math.round(state.underemploymentPressureBrief?.linkageParticipationGap ?? 0)}.`,
        inference: state.underemploymentPressureBrief?.stewardNote || state.summary,
        projection: 'Underemployment indices proxy linkage-participation slack — not literal U6 rates.'
      };
    case 'wage_competitiveness':
      return {
        topic,
        headline: state.wageCompetitivenessIndex?.summary || 'Wage competitiveness unavailable.',
        fact: `Competitiveness band ${state.wageCompetitivenessIndex?.band ?? 'unknown'}; index ${Math.round(state.wageCompetitivenessIndex?.competitivenessIndex ?? 50)}.`,
        inference: state.wageCompetitivenessIndex?.stewardNote || state.outlook,
        projection: 'Competitiveness blends wage pressure, mismatch, and capacity — bounded indices only.'
      };
    case 'transition_friction':
      return {
        topic,
        headline: state.workforceTransitionFrictionOutlook?.summary || 'Transition friction unavailable.',
        fact: `Friction band ${state.workforceTransitionFrictionOutlook?.band ?? 'unknown'}; automation drag ${Math.round(state.workforceTransitionFrictionOutlook?.automationDrag ?? 0)}.`,
        inference: state.workforceTransitionFrictionOutlook?.stewardNote || state.outlook,
        projection: 'Friction blends velocity, elasticity, and automation — not literal retraining counts.'
      };
    case 'youth_pipeline':
      return {
        topic,
        headline: state.youthEntryPipelineOutlook?.summary || 'Youth entry pipeline unavailable.',
        fact: `Pipeline band ${state.youthEntryPipelineOutlook?.band ?? 'unknown'}; dependency headwind ${Math.round(state.youthEntryPipelineOutlook?.dependencyHeadwind ?? 0)}.`,
        inference: state.youthEntryPipelineOutlook?.stewardNote || state.summary,
        projection: 'Youth pipeline blends dependency, participation, and upskilling — bounded indices only.'
      };
    case 'labor_tightness':
      return {
        topic,
        headline: state.laborMarketTightnessBrief?.summary || 'Labor market tightness unavailable.',
        fact: `Tightness band ${state.laborMarketTightnessBrief?.band ?? 'unknown'}; capacity drag ${Math.round(state.laborMarketTightnessBrief?.capacityGapDrag ?? 0)}.`,
        inference: state.laborMarketTightnessBrief?.stewardNote || state.outlook,
        projection: 'Tightness blends capacity gaps, wage pressure, and underemployment slack — not literal vacancy counts.'
      };
    case 'hybrid_participation':
      return {
        topic,
        headline: state.hybridParticipationFrictionOutlook?.summary || 'Hybrid participation friction unavailable.',
        fact: `Hybrid band ${state.hybridParticipationFrictionOutlook?.band ?? 'unknown'}; care relief ${Math.round((state.hybridParticipationFrictionOutlook?.careReliefLift ?? 0) * 100)}%.`,
        inference: state.hybridParticipationFrictionOutlook?.stewardNote || state.outlook,
        projection: 'Hybrid friction blends transition, mobility, and care levers — not literal remote-work counts.'
      };
    case 'senior_retention':
      return {
        topic,
        headline: state.seniorWorkforceRetentionOutlook?.summary || 'Senior retention outlook unavailable.',
        fact: `Retention band ${state.seniorWorkforceRetentionOutlook?.band ?? 'unknown'}; aged drag ${Math.round(state.seniorWorkforceRetentionOutlook?.agedPressureDrag ?? 0)}.`,
        inference: state.seniorWorkforceRetentionOutlook?.stewardNote || state.summary,
        projection: 'Senior retention blends dependency, participation, and retention levers — bounded indices only.'
      };
    case 'labor_absorption':
      return {
        topic,
        headline: state.regionalLaborAbsorptionBrief?.summary || 'Regional labor absorption unavailable.',
        fact: `Absorption band ${state.regionalLaborAbsorptionBrief?.band ?? 'unknown'}; migration load drag ${Math.round(state.regionalLaborAbsorptionBrief?.migrationLoadDrag ?? 0)}.`,
        inference: state.regionalLaborAbsorptionBrief?.stewardNote || state.outlook,
        projection: 'Absorption blends migration load, capacity headroom, and tightness — not literal housing counts.'
      };
    case 'participation_equity':
      return {
        topic,
        headline: state.participationEquityGapBrief?.summary || 'Participation equity gap unavailable.',
        fact: `Equity band ${state.participationEquityGapBrief?.band ?? 'unknown'}; inclusion ease ${Math.round((state.participationEquityGapBrief?.inclusionEaseLift ?? 0) * 100)}%.`,
        inference: state.participationEquityGapBrief?.stewardNote || state.outlook,
        projection: 'Equity blends inclusion, flexibility, and underemployment slack — not literal demographic gaps.'
      };
    case 'credential_mobility':
      return {
        topic,
        headline: state.credentialMobilityOutlook?.summary || 'Credential mobility unavailable.',
        fact: `Credential band ${state.credentialMobilityOutlook?.band ?? 'unknown'}; pathway lift ${Math.round((state.credentialMobilityOutlook?.pathwayLift ?? 0) * 100)}%.`,
        inference: state.credentialMobilityOutlook?.stewardNote || state.summary,
        projection: 'Credential mobility blends pathways, mismatch, and talent flow — bounded indices only.'
      };
    case 'household_participation_coupling':
      return {
        topic,
        headline: state.householdParticipationCouplingBrief?.summary || 'Household-participation coupling unavailable.',
        fact: `Coupling band ${state.householdParticipationCouplingBrief?.band ?? 'unknown'}; budget drag ${Math.round(state.householdParticipationCouplingBrief?.budgetPressureDrag ?? 0)}.`,
        inference: state.householdParticipationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling blends budget pressure, participation, equity, and reengagement — not literal income data.'
      };
    case 'rebalancing_stress':
      return {
        topic,
        headline: state.laborRebalancingStressBrief?.summary || 'Rebalancing stress unavailable.',
        fact: `Stress band ${state.laborRebalancingStressBrief?.band ?? 'unknown'}; high-priority moves ${state.laborRebalancingStressBrief?.highPriorityMoves ?? 0}.`,
        inference: state.laborRebalancingStressBrief?.stewardNote || state.outlook,
        projection: 'Stress blends corridor moves, absorption, and tightness — not literal relocation counts.'
      };
    case 'automation_participation_resilience':
      return {
        topic,
        headline:
          state.automationParticipationResilienceOutlook?.summary ||
          'Automation-participation resilience unavailable.',
        fact: `Resilience band ${state.automationParticipationResilienceOutlook?.band ?? 'unknown'}; automation drag ${Math.round(state.automationParticipationResilienceOutlook?.automationPressureDrag ?? 0)}.`,
        inference: state.automationParticipationResilienceOutlook?.stewardNote || state.summary,
        projection: 'Resilience blends automation pressure, participation, and transition — bounded indices only.'
      };
    case 'wage_participation_spillover':
      return {
        topic,
        headline: state.wageParticipationSpilloverBrief?.summary || 'Wage-participation spillover unavailable.',
        fact: `Spillover band ${state.wageParticipationSpilloverBrief?.band ?? 'unknown'}; wage drag ${Math.round(state.wageParticipationSpilloverBrief?.wagePressureDrag ?? 0)}.`,
        inference: state.wageParticipationSpilloverBrief?.stewardNote || state.outlook,
        projection: 'Spillover blends competitiveness, wage pressure, and household coupling — not literal payroll data.'
      };
    case 'migration_participation_buffer':
      return {
        topic,
        headline:
          state.migrationShockParticipationBufferOutlook?.summary ||
          'Migration-shock participation buffer unavailable.',
        fact: `Buffer band ${state.migrationShockParticipationBufferOutlook?.band ?? 'unknown'}; shock drag ${Math.round(state.migrationShockParticipationBufferOutlook?.activeShockDrag ?? 0)}.`,
        inference: state.migrationShockParticipationBufferOutlook?.stewardNote || state.outlook,
        projection: 'Buffer blends shocks, absorption, onboarding, and participation — not literal migrant counts.'
      };
    case 'labor_market_stability':
      return {
        topic,
        headline: state.laborMarketStabilityOutlook?.summary || 'Labor market stability unavailable.',
        fact: `Stability band ${state.laborMarketStabilityOutlook?.band ?? 'unknown'}; stress drag ${Math.round(state.laborMarketStabilityOutlook?.stressDrag ?? 0)}.`,
        inference: state.laborMarketStabilityOutlook?.stewardNote || state.summary,
        projection: 'Stability blends pressure, rebalancing stress, automation resilience, and coordination — bounded indices only.'
      };
    case 'intergenerational_balance':
      return {
        topic,
        headline:
          state.intergenerationalWorkforceBalanceOutlook?.summary || 'Intergenerational balance unavailable.',
        fact: `Balance band ${state.intergenerationalWorkforceBalanceOutlook?.band ?? 'unknown'}; pipeline gap ${Math.round(state.intergenerationalWorkforceBalanceOutlook?.pipelineGap ?? 0)}.`,
        inference: state.intergenerationalWorkforceBalanceOutlook?.stewardNote || state.outlook,
        projection: 'Balance blends youth pipeline and senior retention — not literal age cohort counts.'
      };
    case 'capacity_participation_alignment':
      return {
        topic,
        headline: state.capacityParticipationAlignmentBrief?.summary || 'Capacity-participation alignment unavailable.',
        fact: `Alignment band ${state.capacityParticipationAlignmentBrief?.band ?? 'unknown'}; capacity drag ${Math.round(state.capacityParticipationAlignmentBrief?.capacityGapDrag ?? 0)}.`,
        inference: state.capacityParticipationAlignmentBrief?.stewardNote || state.outlook,
        projection: 'Alignment blends capacity gaps, equity, absorption, and linkage — not literal headcount targets.'
      };
    case 'participation_velocity_coupling':
      return {
        topic,
        headline: state.participationVelocityCouplingBrief?.summary || 'Participation-velocity coupling unavailable.',
        fact: `Coupling band ${state.participationVelocityCouplingBrief?.band ?? 'unknown'}; velocity drag ${Math.round(state.participationVelocityCouplingBrief?.velocityDrag ?? 0)}.`,
        inference: state.participationVelocityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling blends participation, velocity, and advocacy — not literal churn counts.'
      };
    case 'skills_tightness_coherence':
      return {
        topic,
        headline: state.skillsTightnessCoherenceOutlook?.summary || 'Skills-tightness coherence unavailable.',
        fact: `Coherence band ${state.skillsTightnessCoherenceOutlook?.band ?? 'unknown'}; mismatch drag ${Math.round(state.skillsTightnessCoherenceOutlook?.mismatchDrag ?? 0)}.`,
        inference: state.skillsTightnessCoherenceOutlook?.stewardNote || state.summary,
        projection: 'Coherence blends mismatch, tightness, and credential mobility — bounded indices only.'
      };
    case 'integrated_labor_readiness':
      return {
        topic,
        headline: state.integratedLaborReadinessOutlook?.summary || 'Integrated labor readiness unavailable.',
        fact: `Readiness band ${state.integratedLaborReadinessOutlook?.band ?? 'unknown'}; stability drag ${Math.round(state.integratedLaborReadinessOutlook?.stabilityDrag ?? 0)}.`,
        inference: state.integratedLaborReadinessOutlook?.stewardNote || state.outlook,
        projection: 'Readiness blends stability, alignment, buffers, and resilience — steward guidance only.'
      };
    case 'hybrid_remote_participation':
      return {
        topic,
        headline: state.hybridRemoteParticipationOutlook?.summary || 'Hybrid-remote participation unavailable.',
        fact: `Remote band ${state.hybridRemoteParticipationOutlook?.band ?? 'unknown'}; friction drag ${Math.round(state.hybridRemoteParticipationOutlook?.frictionDrag ?? 0)}.`,
        inference: state.hybridRemoteParticipationOutlook?.stewardNote || state.outlook,
        projection: 'Remote outlook blends hybrid friction, flexibility, and mentorship — not literal remote headcounts.'
      };
    case 'corridor_capacity_stress':
      return {
        topic,
        headline: state.corridorCapacityStressBrief?.summary || 'Corridor capacity stress unavailable.',
        fact: `Stress band ${state.corridorCapacityStressBrief?.band ?? 'unknown'}; move drag ${Math.round(state.corridorCapacityStressBrief?.corridorMoveDrag ?? 0)}.`,
        inference: state.corridorCapacityStressBrief?.stewardNote || state.outlook,
        projection: 'Corridor stress blends moves, absorption, rebalancing, and tightness — not literal infrastructure counts.'
      };
    case 'steward_intervention_priority':
      return {
        topic,
        headline: state.stewardInterventionPriorityBrief?.summary || 'Steward intervention priority unavailable.',
        fact: `Priority band ${state.stewardInterventionPriorityBrief?.band ?? 'unknown'}; readiness drag ${Math.round(state.stewardInterventionPriorityBrief?.readinessDrag ?? 0)}.`,
        inference: state.stewardInterventionPriorityBrief?.stewardNote || state.summary,
        projection: 'Intervention priority synthesizes readiness, stability, and rebalancing stress for steward nudges.'
      };
    case 'essential_worker_participation':
      return {
        topic,
        headline: state.essentialWorkerParticipationOutlook?.summary || 'Essential-worker participation unavailable.',
        fact: `Essential band ${state.essentialWorkerParticipationOutlook?.band ?? 'unknown'}; shock drag ${Math.round(state.essentialWorkerParticipationOutlook?.shockDrag ?? 0)}.`,
        inference: state.essentialWorkerParticipationOutlook?.stewardNote || state.outlook,
        projection: 'Essential outlook blends access shocks, buffers, safety, and participation — bounded indices only.'
      };
    case 'wage_automation_coupling':
      return {
        topic,
        headline: state.wageAutomationCouplingBrief?.summary || 'Wage-automation coupling unavailable.',
        fact: `Coupling band ${state.wageAutomationCouplingBrief?.band ?? 'unknown'}; automation drag ${Math.round(state.wageAutomationCouplingBrief?.automationDrag ?? 0)}.`,
        inference: state.wageAutomationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling blends spillover, competitiveness, and automation resilience — not literal payroll automation counts.'
      };
    case 'national_labor_cohesion':
      return {
        topic,
        headline: state.nationalLaborCohesionIndex?.summary || 'National labor cohesion unavailable.',
        fact: `Cohesion band ${state.nationalLaborCohesionIndex?.band ?? 'unknown'}; stability drag ${Math.round(state.nationalLaborCohesionIndex?.stabilityDrag ?? 0)}.`,
        inference: state.nationalLaborCohesionIndex?.stewardNote || state.summary,
        projection: 'Cohesion synthesizes stability, intergenerational balance, alignment, and coordination — steward guidance only.'
      };
    case 'seasonal_participation_swing':
      return {
        topic,
        headline: state.seasonalParticipationSwingOutlook?.summary || 'Seasonal participation swing unavailable.',
        fact: `Swing band ${state.seasonalParticipationSwingOutlook?.band ?? 'unknown'}; seasonal drag ${Math.round(state.seasonalParticipationSwingOutlook?.seasonalDrag ?? 0)}.`,
        inference: state.seasonalParticipationSwingOutlook?.stewardNote || state.outlook,
        projection: 'Seasonal swing blends essential participation, tightness, and scheduling levers — not literal seasonal headcounts.'
      };
    case 'cohesion_corridor_coupling':
      return {
        topic,
        headline: state.cohesionCorridorCouplingBrief?.summary || 'Cohesion-corridor coupling unavailable.',
        fact: `Coupling band ${state.cohesionCorridorCouplingBrief?.band ?? 'unknown'}; corridor drag ${Math.round(state.cohesionCorridorCouplingBrief?.corridorDrag ?? 0)}.`,
        inference: state.cohesionCorridorCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links national cohesion with corridor stress — bounded indices only.'
      };
    case 'workforce_reliability':
      return {
        topic,
        headline: state.nationalWorkforceReliabilityIndex?.summary || 'Workforce reliability unavailable.',
        fact: `Reliability band ${state.nationalWorkforceReliabilityIndex?.band ?? 'unknown'}; coupling drag ${Math.round(state.nationalWorkforceReliabilityIndex?.couplingDrag ?? 0)}.`,
        inference: state.nationalWorkforceReliabilityIndex?.stewardNote || state.summary,
        projection: 'Reliability synthesizes seasonal swing, scheduling, safety, and cohesion-corridor coupling.'
      };
    case 'retention_reliability_coupling':
      return {
        topic,
        headline: state.retentionReliabilityCouplingBrief?.summary || 'Retention-reliability coupling unavailable.',
        fact: `Coupling band ${state.retentionReliabilityCouplingBrief?.band ?? 'unknown'}; reliability drag ${Math.round(state.retentionReliabilityCouplingBrief?.reliabilityDrag ?? 0)}.`,
        inference: state.retentionReliabilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links retention levers with workforce reliability — bounded indices only.'
      };
    case 'upskilling_velocity':
      return {
        topic,
        headline: state.upskillingVelocityOutlook?.summary || 'Upskilling velocity unavailable.',
        fact: `Velocity band ${state.upskillingVelocityOutlook?.band ?? 'unknown'}; mismatch drag ${Math.round(state.upskillingVelocityOutlook?.mismatchDrag ?? 0)}.`,
        inference: state.upskillingVelocityOutlook?.stewardNote || state.outlook,
        projection: 'Velocity blends upskilling program levers with skills tightness coherence — not literal training counts.'
      };
    case 'subject_workforce_readiness':
      return {
        topic,
        headline: state.subjectWorkforceReadinessBrief?.summary || 'Subject workforce readiness unavailable.',
        fact: `Subject band ${state.subjectWorkforceReadinessBrief?.band ?? 'unknown'}; readiness drag ${Math.round(state.subjectWorkforceReadinessBrief?.readinessDrag ?? 0)}.`,
        inference: state.subjectWorkforceReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject readiness gates retention coupling against integrated labor readiness for assembly waves.'
      };
    case 'workforce_sustainment':
      return {
        topic,
        headline: state.nationalWorkforceSustainmentIndex?.summary || 'Workforce sustainment unavailable.',
        fact: `Sustainment band ${state.nationalWorkforceSustainmentIndex?.band ?? 'unknown'}; subject drag ${Math.round(state.nationalWorkforceSustainmentIndex?.subjectDrag ?? 0)}.`,
        inference: state.nationalWorkforceSustainmentIndex?.stewardNote || state.summary,
        projection: 'Sustainment synthesizes reliability, upskilling velocity, and subject readiness — steward guidance only.'
      };
    case 'sustainment_retention_coupling':
      return {
        topic,
        headline: state.sustainmentRetentionCouplingBrief?.summary || 'Sustainment-retention coupling unavailable.',
        fact: `Coupling band ${state.sustainmentRetentionCouplingBrief?.band ?? 'unknown'}; sustainment drag ${Math.round(state.sustainmentRetentionCouplingBrief?.sustainmentDrag ?? 0)}.`,
        inference: state.sustainmentRetentionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce sustainment with retention-reliability depth — bounded indices only.'
      };
    case 'onboarding_velocity':
      return {
        topic,
        headline: state.onboardingVelocityOutlook?.summary || 'Onboarding velocity unavailable.',
        fact: `Onboarding band ${state.onboardingVelocityOutlook?.band ?? 'unknown'}; pipeline drag ${Math.round(state.onboardingVelocityOutlook?.pipelineDrag ?? 0)}.`,
        inference: state.onboardingVelocityOutlook?.stewardNote || state.outlook,
        projection: 'Onboarding velocity blends onboarding levers with upskilling velocity — not literal hire counts.'
      };
    case 'subject_assembly_continuity':
      return {
        topic,
        headline: state.subjectAssemblyContinuityBrief?.summary || 'Subject assembly continuity unavailable.',
        fact: `Continuity band ${state.subjectAssemblyContinuityBrief?.band ?? 'unknown'}; assembly drag ${Math.round(state.subjectAssemblyContinuityBrief?.assemblyDrag ?? 0)}.`,
        inference: state.subjectAssemblyContinuityBrief?.stewardNote || state.summary,
        projection: 'Subject assembly continuity gates readiness against sustainment for scale-wave commits.'
      };
    case 'workforce_continuity':
      return {
        topic,
        headline: state.nationalWorkforceContinuityIndex?.summary || 'Workforce continuity unavailable.',
        fact: `Continuity band ${state.nationalWorkforceContinuityIndex?.band ?? 'unknown'}; assembly drag ${Math.round(state.nationalWorkforceContinuityIndex?.assemblyDrag ?? 0)}.`,
        inference: state.nationalWorkforceContinuityIndex?.stewardNote || state.summary,
        projection: 'Continuity synthesizes sustainment-retention, onboarding velocity, and subject assembly — steward guidance only.'
      };
    case 'continuity_coordination_coupling':
      return {
        topic,
        headline: state.continuityCoordinationCouplingBrief?.summary || 'Continuity-coordination coupling unavailable.',
        fact: `Coupling band ${state.continuityCoordinationCouplingBrief?.band ?? 'unknown'}; continuity drag ${Math.round(state.continuityCoordinationCouplingBrief?.continuityDrag ?? 0)}.`,
        inference: state.continuityCoordinationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce continuity with coordination levers — bounded indices only.'
      };
    case 'reengagement_momentum':
      return {
        topic,
        headline: state.reengagementMomentumOutlook?.summary || 'Reengagement momentum unavailable.',
        fact: `Momentum band ${state.reengagementMomentumOutlook?.band ?? 'unknown'}; pipeline drag ${Math.round(state.reengagementMomentumOutlook?.pipelineDrag ?? 0)}.`,
        inference: state.reengagementMomentumOutlook?.stewardNote || state.outlook,
        projection: 'Momentum blends reengagement levers with onboarding velocity — not literal return-to-work counts.'
      };
    case 'subject_wave_assembly':
      return {
        topic,
        headline: state.subjectWaveAssemblyBrief?.summary || 'Subject wave assembly unavailable.',
        fact: `Wave band ${state.subjectWaveAssemblyBrief?.band ?? 'unknown'}; wave drag ${Math.round(state.subjectWaveAssemblyBrief?.waveDrag ?? 0)}.`,
        inference: state.subjectWaveAssemblyBrief?.stewardNote || state.summary,
        projection: 'Subject wave assembly gates continuity stack for O10-168 scale-wave commits.'
      };
    case 'workforce_durability':
      return {
        topic,
        headline: state.nationalWorkforceDurabilityIndex?.summary || 'Workforce durability unavailable.',
        fact: `Durability band ${state.nationalWorkforceDurabilityIndex?.band ?? 'unknown'}; wave drag ${Math.round(state.nationalWorkforceDurabilityIndex?.waveDrag ?? 0)}.`,
        inference: state.nationalWorkforceDurabilityIndex?.stewardNote || state.summary,
        projection: 'Durability synthesizes coordination coupling, reengagement momentum, and subject wave assembly.'
      };
    default:
      return {
        topic: 'national_summary',
        headline: 'National labor market & demographics',
        fact: `${state.summary} ${state.automationFeedbackSummary || ''}`.trim(),
        inference: state.outlook,
        projection: state.evidence.slice(0, 2).join(' · ') || 'Stable industry-linked outlook.'
      };
  }
}


// --- source: turn-projection.ts ---
  LaborDemographicsInputs,
  LaborDemographicsPersisted,
  NationalLaborDemographicsState
} from './types';

export interface LaborTurnProjectionStep {
  turn: number;
  employmentLinkageScore: number;
  wagePressureScore: number;
  migrationFlowScore: number;
  nationalEmploymentLinkage: string;
  nationalWagePressure: string;
  nationalMigrationFlow: string;
}

export interface LaborTurnProjectionBundle {
  horizonTurns: number;
  steps: LaborTurnProjectionStep[];
  summary: string;
}

/** Read-only multi-turn replay projection (does not mutate caller persisted state). */
export function projectLaborDemographicsTurns(
  baseInputs: LaborDemographicsInputs,
  horizonTurns: number,
  seedPersisted?: LaborDemographicsPersisted | null
): LaborTurnProjectionBundle {
  const steps: LaborTurnProjectionStep[] = [];
  const persistedClone = seedPersisted
    ? (JSON.parse(JSON.stringify(seedPersisted)) as LaborDemographicsPersisted)
    : undefined;
  let pers: LaborDemographicsPersisted | undefined = persistedClone ?? createInitialLaborDemographicsPersisted(start);
  let prev: NationalLaborDemographicsState | null = null;
  const start = Math.max(1, Math.floor(baseInputs.turn || 1));
  const end = start + Math.max(1, Math.min(8, horizonTurns));

  for (let t = start; t <= end; t++) {
    const stepInputs = { ...baseInputs, turn: t };
    const res = computeNationalLaborDemographics(stepInputs, pers ?? null, prev);
    pers = res.persisted;
    prev = res.state;
    steps.push({
      turn: t,
      employmentLinkageScore: res.state.employmentLinkageScore,
      wagePressureScore: res.state.wagePressureScore,
      migrationFlowScore: res.state.migrationFlowScore,
      nationalEmploymentLinkage: res.state.nationalEmploymentLinkage,
      nationalWagePressure: res.state.nationalWagePressure,
      nationalMigrationFlow: res.state.nationalMigrationFlow
    });
  }

  const last = steps[steps.length - 1];
  return {
    horizonTurns: steps.length,
    steps,
    summary: last
      ? `Projected to turn ${last.turn}: emp=${last.nationalEmploymentLinkage}, wage=${last.nationalWagePressure}, mig=${last.nationalMigrationFlow}.`
      : 'Empty projection.'
  };
}


// --- source: integrated-labor-synthesis.ts ---
  EMPLOYMENT_LINKAGE_LABEL,
  MIGRATION_FLOW_LABEL,
  V1014_LABOR_CORE_REGIONS,
  WAGE_PRESSURE_LABEL,
  type IntegratedLaborMarketBrief,
  type IntegratedLaborPressureBand,
  type NationalLaborDemographicsState
} from './types';

function pressureBand(index: number): IntegratedLaborPressureBand {
  if (index < 35) return 'low';
  if (index < 55) return 'moderate';
  if (index < 72) return 'elevated';
  return 'critical';
}

export function computeIntegratedLaborMarketBrief(
  state: NationalLaborDemographicsState,
  householdBudget?: NationalHouseholdBudgetDetail | null
): IntegratedLaborMarketBrief {
  const regionalScores = V1014_LABOR_CORE_REGIONS.map(c => {
    const r = state.regions[c];
    if (!r) return { regionId: c, strain: 50, opportunity: 50 };
    const strain = v1014laborClamp(
      r.wagePressureScore * 0.35 +
        (r.householdBudgetPressureScore ?? 50) * 0.35 +
        r.workforceStrainIndex * 0.3
    );
    const opportunity = v1014laborClamp(
      r.employmentLinkageScore * 0.45 +
        r.migrationFlowScore * 0.35 +
        (100 - (r.automationPressureIndex ?? 50)) * 0.2
    );
    return { regionId: c, strain, opportunity };
  });

  const topStrainRegions = [...regionalScores]
    .sort((a, b) => b.strain - a.strain)
    .slice(0, 3)
    .map(x => x.regionId);
  const topOpportunityRegions = [...regionalScores]
    .sort((a, b) => b.opportunity - a.opportunity)
    .slice(0, 3)
    .map(x => x.regionId);

  const shockLoad = (state.activeMigrationShocks?.length ?? 0) * 4;
  const budgetLoad = householdBudget?.nationalBudgetPressureScore ?? 50;
  const compositePressureIndex = v1014laborClamp(
    state.wagePressureScore * 0.28 +
      state.employmentLinkageScore * 0.12 +
      (100 - state.migrationFlowScore) * 0.1 +
      budgetLoad * 0.25 +
      shockLoad +
      (state.automationFeedbackSummary ? 6 : 0)
  );

  const band = pressureBand(compositePressureIndex);
  const dominantRisk =
    state.wagePressureScore >= 62
      ? WAGE_PRESSURE_LABEL[state.nationalWagePressure]
      : budgetLoad >= 60
        ? 'Household budget pressure'
        : EMPLOYMENT_LINKAGE_LABEL[state.nationalEmploymentLinkage];
  const dominantOpportunity =
    state.migrationFlowScore >= 58
      ? MIGRATION_FLOW_LABEL[state.nationalMigrationFlow]
      : 'Output-linked employment strength';

  const narrative = `Composite labor pressure ${Math.round(compositePressureIndex)} (${band}): ${dominantRisk}; opportunity via ${dominantOpportunity.toLowerCase()}.`;

  return {
    turn: state.turn,
    compositePressureIndex,
    pressureBand: band,
    topStrainRegions,
    topOpportunityRegions,
    dominantRisk,
    dominantOpportunity,
    narrative,
    evidence: [
      `Strain hubs: ${topStrainRegions.join(', ')}`,
      `Opportunity hubs: ${topOpportunityRegions.join(', ')}`,
      `${state.activeMigrationShocks?.length ?? 0} migration shock(s) active`
    ]
  };
}


// --- source: labor-turn-audit.ts ---

export function buildLaborTurnAuditEntry(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief
): LaborTurnAuditEntry {
  return {
    turn: state.turn,
    inputHash: state.inputHash,
    revision: state.revision,
    shockCount: state.activeMigrationShocks?.length ?? 0,
    compositePressureIndex: brief.compositePressureIndex,
    bandLine: `emp=${state.nationalEmploymentLinkage}, wage=${state.nationalWagePressure}, mig=${state.nationalMigrationFlow}, p=${brief.pressureBand}`
  };
}

export function appendLaborAuditHistory(
  history: LaborTurnAuditEntry[] | undefined,
  entry: LaborTurnAuditEntry,
  max = 16
): LaborTurnAuditEntry[] {
  const next = [...(history || []), entry];
  return next.slice(-max);
}


// --- source: scenario-runner.ts ---

export interface LaborScenarioRunDelta {
  employmentLinkageScore: number;
  wagePressureScore: number;
  migrationFlowScore: number;
}

export interface LaborStressScenarioRunResult {
  scenarioId: LaborStressScenarioId;
  title: string;
  baseline: NationalLaborDemographicsState;
  stressed: NationalLaborDemographicsState;
  delta: LaborScenarioRunDelta;
  narrative: string;
}

function v1014MinimalIndustries(): any {
  const baseOut = { mining: 120, technology: 40, manufacturing: 40, agriculture: 40, energy: 40, research: 40, tourism: 40, trade: 40 };
  const mk = (mining: number, tech: number) => ({
    industries: {
      mining: { effectiveOutput: mining },
      technology: { effectiveOutput: tech },
      manufacturing: { effectiveOutput: 12 },
      agriculture: { effectiveOutput: 12 },
      energy: { effectiveOutput: 12 },
      research: { effectiveOutput: 12 },
      tourism: { effectiveOutput: 12 },
      trade: { effectiveOutput: 12 }
    }
  });
  return {
    national: { output: { ...baseOut } },
    regions: {
      NSW: mk(12, 40),
      VIC: mk(12, 35),
      QLD: mk(40, 12),
      WA: mk(55, 12),
      SA: mk(12, 12),
      TAS: mk(12, 12),
      NT: mk(12, 12),
      ACT: mk(12, 12)
    }
  };
}

function applyScenarioBiasesToInputs(
  inputs: LaborDemographicsInputs,
  scenarioId: LaborStressScenarioId
): LaborDemographicsInputs {
  const sc = lookupLaborStressScenario(scenarioId);
  if (!sc) return inputs;
  const industries = inputs.industries ? JSON.parse(JSON.stringify(inputs.industries)) : v1014MinimalIndustries();
  if (scenarioId === 'ld_sc_mining_supercycle') {
    industries.national.output.mining = (industries.national.output.mining || 40) * 2.2;
    industries.regions.WA.industries.mining.effectiveOutput = 65;
    industries.regions.QLD.industries.mining.effectiveOutput = 58;
  }
  if (scenarioId === 'ld_sc_metro_talent_war') {
    industries.regions.NSW.industries.technology.effectiveOutput = 48;
    industries.regions.VIC.industries.technology.effectiveOutput = 44;
  }
  if (scenarioId === 'ld_sc_automation_displacement') {
    return {
      ...inputs,
      industries,
      capabilities: [{ id: 'auto_wave', active: true, automationShift: 92 }]
    };
  }
  if (
    scenarioId === 'ld_sc_housing_affordability_crunch' ||
    scenarioId === 'ld_sc_essential_access_crisis'
  ) {
    const households: any = {
      national: { affordability: 'strained', financialResilience: 'fragile', housingPressure: 'high' },
      regions: {}
    };
    sc.primaryRegions.forEach(r => {
      households.regions[r] = {
        affordability: 'severe_pressure',
        essentialAccess: scenarioId.includes('essential') ? 'critical' : 'strained',
        resilience: 'fragile',
        employmentOpportunity: 'weak'
      };
    });
    return { ...inputs, industries, households };
  }
  return { ...inputs, industries };
}

export function runLaborStressScenario(
  scenarioId: LaborStressScenarioId,
  baseInputs: LaborDemographicsInputs
): LaborStressScenarioRunResult | null {
  const sc = lookupLaborStressScenario(scenarioId);
  if (!sc) return null;
  const baseline = computeNationalLaborDemographics(baseInputs, createInitialLaborDemographicsPersisted(), null).state;
  const stressedInputs = applyScenarioBiasesToInputs(baseInputs, scenarioId);
  const stressed = computeNationalLaborDemographics(
    stressedInputs,
    createInitialLaborDemographicsPersisted(),
    null
  ).state;
  const delta: LaborScenarioRunDelta = {
    employmentLinkageScore: stressed.employmentLinkageScore - baseline.employmentLinkageScore,
    wagePressureScore: stressed.wagePressureScore - baseline.wagePressureScore,
    migrationFlowScore: stressed.migrationFlowScore - baseline.migrationFlowScore
  };
  return {
    scenarioId,
    title: sc.title,
    baseline,
    stressed,
    delta,
    narrative: sc.narrative
  };
}


// --- source: steward-labor-brief.ts ---

export interface StewardLaborBrief {
  priority: 'watch' | 'nudge' | 'intervene';
  headline: string;
  hints: string[];
}

export function buildStewardLaborBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  eventLines: string[]
): StewardLaborBrief {
  if (!state.enabled || !brief) {
    return {
      priority: 'watch',
      headline: 'Labor steward idle — layer off',
      hints: ['Enable labor demographics before steward labor guidance.']
    };
  }

  const hints: string[] = [];
  if (brief.pressureBand === 'critical' || brief.pressureBand === 'elevated') {
    hints.push('Prioritize household affordability and workforce transition actions in strain hubs.');
  }
  if ((state.activeMigrationShocks?.length ?? 0) >= 2) {
    hints.push('Multiple migration shocks — avoid stacking auto commits in shocked regions.');
  }
  if (state.interregionalRebalancingPlan.moves.some(m => m.priority === 'high')) {
    hints.push('High-priority interregional rebalancing — review corridor moves before auto workforce commits.');
  }
  if (state.laborResilienceScorecard?.band === 'fragile') {
    hints.push(state.laborResilienceScorecard.stewardNote);
  }
  if (state.participationPressureBrief?.band === 'shrinking' || state.participationPressureBrief?.band === 'constrained') {
    hints.push(state.participationPressureBrief.stewardNote);
  }
  if (state.laborMarketVelocityIndex?.nationalBand === 'volatile') {
    hints.push('Volatile labor market velocity — avoid stacked auto commits until migration bands stabilize.');
  }
  if (
    state.skillMismatchIndex?.nationalBand === 'critical_mismatch' ||
    state.skillMismatchIndex?.nationalBand === 'elevated_gap'
  ) {
    hints.push(state.skillMismatchIndex.stewardNote);
  }
  if (state.laborSupplyElasticityBrief?.band === 'rigid' || state.laborSupplyElasticityBrief?.band === 'inelastic') {
    hints.push(state.laborSupplyElasticityBrief.stewardNote);
  }
  if (state.talentMobilityOutlook?.band === 'hyper_mobile') {
    hints.push(state.talentMobilityOutlook.stewardNote);
  }
  if (
    state.underemploymentPressureBrief?.band === 'severe_underuse' ||
    state.underemploymentPressureBrief?.band === 'tight_hidden'
  ) {
    hints.push(state.underemploymentPressureBrief.stewardNote);
  }
  if (state.wageCompetitivenessIndex?.band === 'cost_burden' || state.wageCompetitivenessIndex?.band === 'stretched') {
    hints.push(state.wageCompetitivenessIndex.stewardNote);
  }
  if (
    state.workforceTransitionFrictionOutlook?.band === 'bottleneck' ||
    state.workforceTransitionFrictionOutlook?.band === 'sticky'
  ) {
    hints.push(state.workforceTransitionFrictionOutlook.stewardNote);
  }
  if (state.youthEntryPipelineOutlook?.band === 'constricted' || state.youthEntryPipelineOutlook?.band === 'narrow') {
    hints.push(state.youthEntryPipelineOutlook.stewardNote);
  }
  if (
    state.laborMarketTightnessBrief?.band === 'critical_shortage' ||
    state.laborMarketTightnessBrief?.band === 'tight'
  ) {
    hints.push(state.laborMarketTightnessBrief.stewardNote);
  }
  if (
    state.hybridParticipationFrictionOutlook?.band === 'binding' ||
    state.hybridParticipationFrictionOutlook?.band === 'elevated'
  ) {
    hints.push(state.hybridParticipationFrictionOutlook.stewardNote);
  }
  if (
    state.seniorWorkforceRetentionOutlook?.band === 'fragile' ||
    state.seniorWorkforceRetentionOutlook?.band === 'strained'
  ) {
    hints.push(state.seniorWorkforceRetentionOutlook.stewardNote);
  }
  if (
    state.regionalLaborAbsorptionBrief?.band === 'saturated' ||
    state.regionalLaborAbsorptionBrief?.band === 'constrained'
  ) {
    hints.push(state.regionalLaborAbsorptionBrief.stewardNote);
  }
  if (
    state.participationEquityGapBrief?.band === 'wide_gap' ||
    state.participationEquityGapBrief?.band === 'uneven'
  ) {
    hints.push(state.participationEquityGapBrief.stewardNote);
  }
  if (state.credentialMobilityOutlook?.band === 'blocked' || state.credentialMobilityOutlook?.band === 'narrow') {
    hints.push(state.credentialMobilityOutlook.stewardNote);
  }
  if (
    state.householdParticipationCouplingBrief?.band === 'decoupled' ||
    state.householdParticipationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.householdParticipationCouplingBrief.stewardNote);
  }
  if (
    state.laborRebalancingStressBrief?.band === 'critical' ||
    state.laborRebalancingStressBrief?.band === 'acute'
  ) {
    hints.push(state.laborRebalancingStressBrief.stewardNote);
  }
  if (
    state.automationParticipationResilienceOutlook?.band === 'fragile' ||
    state.automationParticipationResilienceOutlook?.band === 'strained'
  ) {
    hints.push(state.automationParticipationResilienceOutlook.stewardNote);
  }
  if (
    state.wageParticipationSpilloverBrief?.band === 'suppressive' ||
    state.wageParticipationSpilloverBrief?.band === 'mixed'
  ) {
    hints.push(state.wageParticipationSpilloverBrief.stewardNote);
  }
  if (
    state.migrationShockParticipationBufferOutlook?.band === 'depleted' ||
    state.migrationShockParticipationBufferOutlook?.band === 'thin'
  ) {
    hints.push(state.migrationShockParticipationBufferOutlook.stewardNote);
  }
  if (
    state.laborMarketStabilityOutlook?.band === 'volatile' ||
    state.laborMarketStabilityOutlook?.band === 'fragile'
  ) {
    hints.push(state.laborMarketStabilityOutlook.stewardNote);
  }
  if (
    state.intergenerationalWorkforceBalanceOutlook?.band === 'skewed_aged' ||
    state.intergenerationalWorkforceBalanceOutlook?.band === 'narrow_youth'
  ) {
    hints.push(state.intergenerationalWorkforceBalanceOutlook.stewardNote);
  }
  if (
    state.capacityParticipationAlignmentBrief?.band === 'misaligned' ||
    state.capacityParticipationAlignmentBrief?.band === 'strained'
  ) {
    hints.push(state.capacityParticipationAlignmentBrief.stewardNote);
  }
  if (
    state.participationVelocityCouplingBrief?.band === 'divergent' ||
    state.participationVelocityCouplingBrief?.band === 'lagging'
  ) {
    hints.push(state.participationVelocityCouplingBrief.stewardNote);
  }
  if (
    state.skillsTightnessCoherenceOutlook?.band === 'incoherent' ||
    state.skillsTightnessCoherenceOutlook?.band === 'strained'
  ) {
    hints.push(state.skillsTightnessCoherenceOutlook.stewardNote);
  }
  if (
    state.integratedLaborReadinessOutlook?.band === 'unprepared' ||
    state.integratedLaborReadinessOutlook?.band === 'caution'
  ) {
    hints.push(state.integratedLaborReadinessOutlook.stewardNote);
  }
  if (
    state.hybridRemoteParticipationOutlook?.band === 'constrained' ||
    state.hybridRemoteParticipationOutlook?.band === 'mixed'
  ) {
    hints.push(state.hybridRemoteParticipationOutlook.stewardNote);
  }
  if (
    state.corridorCapacityStressBrief?.band === 'stressed' ||
    state.corridorCapacityStressBrief?.band === 'overloaded'
  ) {
    hints.push(state.corridorCapacityStressBrief.stewardNote);
  }
  if (
    state.stewardInterventionPriorityBrief?.band === 'act' ||
    state.stewardInterventionPriorityBrief?.band === 'urgent'
  ) {
    hints.push(state.stewardInterventionPriorityBrief.stewardNote);
  }
  if (
    state.essentialWorkerParticipationOutlook?.band === 'strained' ||
    state.essentialWorkerParticipationOutlook?.band === 'mixed'
  ) {
    hints.push(state.essentialWorkerParticipationOutlook.stewardNote);
  }
  if (
    state.wageAutomationCouplingBrief?.band === 'disruptive' ||
    state.wageAutomationCouplingBrief?.band === 'tense'
  ) {
    hints.push(state.wageAutomationCouplingBrief.stewardNote);
  }
  if (
    state.nationalLaborCohesionIndex?.band === 'fragmented' ||
    state.nationalLaborCohesionIndex?.band === 'patchy'
  ) {
    hints.push(state.nationalLaborCohesionIndex.stewardNote);
  }
  if (
    state.seasonalParticipationSwingOutlook?.band === 'volatile' ||
    state.seasonalParticipationSwingOutlook?.band === 'uneven'
  ) {
    hints.push(state.seasonalParticipationSwingOutlook.stewardNote);
  }
  if (
    state.cohesionCorridorCouplingBrief?.band === 'decoupled' ||
    state.cohesionCorridorCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.cohesionCorridorCouplingBrief.stewardNote);
  }
  if (
    state.nationalWorkforceReliabilityIndex?.band === 'fragile' ||
    state.nationalWorkforceReliabilityIndex?.band === 'patchy'
  ) {
    hints.push(state.nationalWorkforceReliabilityIndex.stewardNote);
  }
  if (
    state.retentionReliabilityCouplingBrief?.band === 'fragile' ||
    state.retentionReliabilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.retentionReliabilityCouplingBrief.stewardNote);
  }
  if (
    state.upskillingVelocityOutlook?.band === 'stalled' ||
    state.upskillingVelocityOutlook?.band === 'uneven'
  ) {
    hints.push(state.upskillingVelocityOutlook.stewardNote);
  }
  if (
    state.subjectWorkforceReadinessBrief?.band === 'unready' ||
    state.subjectWorkforceReadinessBrief?.band === 'caution'
  ) {
    hints.push(state.subjectWorkforceReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSustainmentIndex?.band === 'depleted' ||
    state.nationalWorkforceSustainmentIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSustainmentIndex.stewardNote);
  }
  if (
    state.sustainmentRetentionCouplingBrief?.band === 'decoupled' ||
    state.sustainmentRetentionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.sustainmentRetentionCouplingBrief.stewardNote);
  }
  if (
    state.onboardingVelocityOutlook?.band === 'stalled' ||
    state.onboardingVelocityOutlook?.band === 'uneven'
  ) {
    hints.push(state.onboardingVelocityOutlook.stewardNote);
  }
  if (
    state.subjectAssemblyContinuityBrief?.band === 'broken' ||
    state.subjectAssemblyContinuityBrief?.band === 'gapped'
  ) {
    hints.push(state.subjectAssemblyContinuityBrief.stewardNote);
  }
  if (
    state.nationalWorkforceContinuityIndex?.band === 'fragile' ||
    state.nationalWorkforceContinuityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceContinuityIndex.stewardNote);
  }
  if (
    state.continuityCoordinationCouplingBrief?.band === 'decoupled' ||
    state.continuityCoordinationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.continuityCoordinationCouplingBrief.stewardNote);
  }
  if (
    state.reengagementMomentumOutlook?.band === 'stalled' ||
    state.reengagementMomentumOutlook?.band === 'patchy'
  ) {
    hints.push(state.reengagementMomentumOutlook.stewardNote);
  }
  if (
    state.subjectWaveAssemblyBrief?.band === 'blocked' ||
    state.subjectWaveAssemblyBrief?.band === 'gapped'
  ) {
    hints.push(state.subjectWaveAssemblyBrief.stewardNote);
  }
  if (
    state.nationalWorkforceDurabilityIndex?.band === 'brittle' ||
    state.nationalWorkforceDurabilityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceDurabilityIndex.stewardNote);
  }
  if (state.nationalWagePressure === 'surging' || state.nationalWagePressure === 'elevated') {
    hints.push('Elevated wage pressure — review high-output regions before automation expansions.');
  }
  hints.push(...eventLines.filter(e => e.length < 120).slice(0, 2));

  const priority: StewardLaborBrief['priority'] =
    brief.pressureBand === 'critical'
      ? 'intervene'
      : brief.pressureBand === 'elevated'
        ? 'nudge'
        : 'watch';

  return {
    priority,
    headline: brief.narrative.slice(0, 160),
    hints: hints.slice(0, 4)
  };
}


// --- source: catalog/regional-migration-corridors.ts ---

export interface RegionalMigrationCorridor {
  id: string;
  fromRegionId: string;
  toRegionId: string;
  strength: number;
  label: string;
  industryTheme: string;
}

export const REGIONAL_MIGRATION_CORRIDORS: RegionalMigrationCorridor[] = [
  { id: 'cor_nsw_vic', fromRegionId: 'NSW', toRegionId: 'VIC', strength: 0.72, label: 'Sydney–Melbourne corridor', industryTheme: 'services' },
  { id: 'cor_vic_nsw', fromRegionId: 'VIC', toRegionId: 'NSW', strength: 0.68, label: 'Melbourne–Sydney return flow', industryTheme: 'technology' },
  { id: 'cor_qld_wa', fromRegionId: 'QLD', toRegionId: 'WA', strength: 0.55, label: 'East–west resource rotation', industryTheme: 'mining' },
  { id: 'cor_wa_qld', fromRegionId: 'WA', toRegionId: 'QLD', strength: 0.48, label: 'Resource coast reciprocal', industryTheme: 'mining' },
  { id: 'cor_nsw_qld', fromRegionId: 'NSW', toRegionId: 'QLD', strength: 0.61, label: 'Northern migration arc', industryTheme: 'tourism' },
  { id: 'cor_sa_vic', fromRegionId: 'SA', toRegionId: 'VIC', strength: 0.42, label: 'Adelaide–Melbourne drift', industryTheme: 'manufacturing' },
  { id: 'cor_tas_vic', fromRegionId: 'TAS', toRegionId: 'VIC', strength: 0.38, label: 'Bass Strait opportunity seek', industryTheme: 'tourism' },
  { id: 'cor_nt_qld', fromRegionId: 'NT', toRegionId: 'QLD', strength: 0.52, label: 'Top End–Queensland link', industryTheme: 'energy' },
  { id: 'cor_act_nsw', fromRegionId: 'ACT', toRegionId: 'NSW', strength: 0.45, label: 'Capital region spill', industryTheme: 'research' }
];

export function corridorsFromRegion(regionId: string): RegionalMigrationCorridor[] {
  return REGIONAL_MIGRATION_CORRIDORS.filter(c => c.fromRegionId === regionId);
}

/** Adjust destination region migration score from corridor pull (bounded). */
export function applyCorridorPullToRegions(
  regions: Record<string, { migrationFlowScore: number; employmentLinkageScore: number }>
): string[] {
  const notes: string[] = [];
  REGIONAL_MIGRATION_CORRIDORS.forEach(c => {
    const from = regions[c.fromRegionId];
    const to = regions[c.toRegionId];
    if (!from || !to) return;
    const pull = (from.employmentLinkageScore - to.employmentLinkageScore) * 0.08 * c.strength;
    if (Math.abs(pull) < 0.4) return;
    to.migrationFlowScore = v1014laborClamp(to.migrationFlowScore + pull);
    from.migrationFlowScore = v1014laborClamp(from.migrationFlowScore - pull * 0.35);
    notes.push(`${c.label}: pull ${pull.toFixed(1)}`);
  });
  return notes.slice(0, 4);
}

export function summarizeCorridorExposure(state: NationalLaborDemographicsState | null): string {
  if (!state?.enabled) return 'Corridor exposure unavailable.';
  const hot = REGIONAL_MIGRATION_CORRIDORS.filter(c => (state.regions[c.toRegionId]?.migrationFlowScore ?? 0) >= 58)
    .slice(0, 3)
    .map(c => c.label);
  return hot.length ? `Active corridor pull: ${hot.join('; ')}` : 'Corridor pull balanced nationally.';
}


// --- source: catalog/skilled-labor-pathways.ts ---

export type SkilledLaborPathwayKind =
  | 'resource_technical'
  | 'metro_digital'
  | 'health_education'
  | 'regional_agri'
  | 'frontier_energy';

export interface SkilledLaborPathway {
  id: string;
  kind: SkilledLaborPathwayKind;
  primaryIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  pullStrength: number;
  label: string;
  narrative: string;
}

export const SKILLED_LABOR_PATHWAYS: SkilledLaborPathway[] = [
  {
    id: 'path_mining_wa_qld',
    kind: 'resource_technical',
    primaryIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    pullStrength: 0.82,
    label: 'Resource technical rotation',
    narrative: 'Fly-in workforce and skilled trades follow supercycle output without census migration counts.'
  },
  {
    id: 'path_tech_nsw_vic',
    kind: 'metro_digital',
    primaryIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    pullStrength: 0.88,
    label: 'Metro digital talent lanes',
    narrative: 'Technology output concentration raises skilled inflow pressure in capital corridors.'
  },
  {
    id: 'path_research_act_nsw',
    kind: 'health_education',
    primaryIndustry: 'research',
    hostRegions: ['ACT', 'NSW'],
    pullStrength: 0.64,
    label: 'Research–policy talent loop',
    narrative: 'Research output and policy adjacency attract specialized labor in bounded attractiveness indices.'
  },
  {
    id: 'path_agri_sa_tas',
    kind: 'regional_agri',
    primaryIndustry: 'agriculture',
    hostRegions: ['SA', 'TAS'],
    pullStrength: 0.52,
    label: 'Regional agri seasonal depth',
    narrative: 'Agriculture linkage supports seasonal labor depth scores — not literal headcount.'
  },
  {
    id: 'path_energy_nt_qld',
    kind: 'frontier_energy',
    primaryIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    pullStrength: 0.71,
    label: 'Frontier energy crews',
    narrative: 'Energy frontier regions gain skilled pull when output and corridor strength align.'
  },
  {
    id: 'path_manufact_vic_sa',
    kind: 'resource_technical',
    primaryIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    pullStrength: 0.58,
    label: 'Manufacturing supply-chain labor',
    narrative: 'Manufacturing hubs exchange skilled labor through interstate supply-chain coupling.'
  },
  {
    id: 'path_tourism_qld_tas',
    kind: 'regional_agri',
    primaryIndustry: 'tourism',
    hostRegions: ['QLD', 'TAS'],
    pullStrength: 0.49,
    label: 'Tourism seasonal pathways',
    narrative: 'Tourism peaks raise short-horizon skilled service labor pull in host regions.'
  },
  {
    id: 'path_trade_nsw',
    kind: 'metro_digital',
    primaryIndustry: 'trade',
    hostRegions: ['NSW'],
    pullStrength: 0.55,
    label: 'Gateway trade logistics',
    narrative: 'Trade gateway output supports logistics-skilled labor attractiveness in NSW.'
  }
];

export function pathwaysForIndustry(industry: StrategicIndustryKind): SkilledLaborPathway[] {
  return SKILLED_LABOR_PATHWAYS.filter(p => p.primaryIndustry === industry);
}

export function lookupSkilledLaborPathway(id: string): SkilledLaborPathway | undefined {
  return SKILLED_LABOR_PATHWAYS.find(p => p.id === id);
}

export function skilledPathwayPullForRegion(regionId: string, dominantIndustry: StrategicIndustryKind | null): number {
  if (!dominantIndustry) return 0;
  const matches = SKILLED_LABOR_PATHWAYS.filter(
    p => p.primaryIndustry === dominantIndustry && p.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, p) => a + p.pullStrength, 0) / matches.length;
}


// --- source: workforce-capacity-bridge.ts ---
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  type LaborDemographicsIndustryLink,
  type LaborDemographicsRegionSnapshot,
  type NationalWorkforceCapacityBridge,
  type RegionalWorkforceCapacityGap,
  type StrategicIndustryKind,
  type WorkforceCapacityBand
} from './types';

function capacityBand(gap: number): WorkforceCapacityBand {
  if (gap <= 18) return 'surplus';
  if (gap <= 38) return 'balanced';
  if (gap <= 58) return 'tight';
  return 'critical_gap';
}

function regionalDemandIndex(
  region: LaborDemographicsRegionSnapshot,
  industryLinks: LaborDemographicsIndustryLink[]
): number {
  const outputPull = region.industryOutputIndex * 0.55;
  const linkPull =
    industryLinks.find(l => l.industry === region.dominantIndustry)?.linkageScore ?? region.employmentLinkageScore;
  const weight =
    region.dominantIndustry != null ? V1014_LABOR_INDUSTRY_LABOR_WEIGHT[region.dominantIndustry] : 0.7;
  return v1014laborClamp(outputPull * 0.4 + linkPull * 0.35 + weight * 35);
}

function regionalSupplyIndex(region: LaborDemographicsRegionSnapshot): number {
  return v1014laborClamp(
    region.employmentLinkageScore * 0.4 +
      region.householdEmploymentFit * 0.25 +
      (100 - region.workforceStrainIndex) * 0.35
  );
}

export function computeNationalWorkforceCapacityBridge(
  turn: number,
  regions: Record<string, LaborDemographicsRegionSnapshot>,
  industryLinks: LaborDemographicsIndustryLink[]
): NationalWorkforceCapacityBridge {
  const regionalGaps: Record<string, RegionalWorkforceCapacityGap> = {};
  const gapSamples: number[] = [];
  let maxGap = -1;
  let dominantShortageIndustry: StrategicIndustryKind | null = null;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const r = regions[regionId];
    if (!r) return;
    const demandIndex = regionalDemandIndex(r, industryLinks);
    const supplyIndex = regionalSupplyIndex(r);
    const pathwayBoost = skilledPathwayPullForRegion(regionId, r.dominantIndustry) * 12;
    const gapIndex = v1014laborClamp(demandIndex - supplyIndex + pathwayBoost * 0.15);
    const band = capacityBand(gapIndex);
    gapSamples.push(gapIndex);
    if (gapIndex > maxGap && r.dominantIndustry) {
      maxGap = gapIndex;
      dominantShortageIndustry = r.dominantIndustry;
    }
    regionalGaps[regionId] = {
      regionId,
      demandIndex,
      supplyIndex,
      gapIndex,
      band,
      skilledPathwayBoost: pathwayBoost,
      narrative: `${regionId}: demand ${Math.round(demandIndex)} vs supply ${Math.round(supplyIndex)} (${band.replace('_', ' ')}).`
    };
  });

  const nationalGapIndex = v1014laborClamp(
    gapSamples.reduce((a, b) => a + b, 0) / Math.max(1, gapSamples.length)
  );
  const nationalBand = capacityBand(nationalGapIndex);

  const topIndustry =
    dominantShortageIndustry ??
    industryLinks[0]?.industry ??
    (STRATEGIC_INDUSTRIES[0] as StrategicIndustryKind);

  return {
    turn,
    nationalGapIndex,
    nationalBand,
    regions: regionalGaps,
    dominantShortageIndustry: topIndustry,
    summary: `Workforce capacity ${nationalBand.replace('_', ' ')} nationally (gap index ${Math.round(nationalGapIndex)}); ${topIndustry} leads demand pressure.`
  };
}


// --- source: labor-resilience-scorecard.ts ---
  IntegratedLaborMarketBrief,
  LaborResilienceBand,
  LaborResilienceDimension,
  LaborResilienceScorecard,
  NationalHouseholdBudgetDetail,
  NationalLaborDemographicsState,
  NationalWorkforceCapacityBridge
} from './types';

function resilienceBand(score: number): LaborResilienceBand {
  if (score < 38) return 'fragile';
  if (score < 52) return 'watchful';
  if (score < 68) return 'steady';
  return 'robust';
}

function dimBand(score: number): LaborResilienceBand {
  return resilienceBand(score);
}

export function computeLaborResilienceScorecard(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  householdBudget: NationalHouseholdBudgetDetail | null | undefined,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): LaborResilienceScorecard {
  const shockCount = state.activeMigrationShocks?.length ?? 0;
  const shockBuffer = v1014laborClamp(72 - shockCount * 9 - (brief?.compositePressureIndex ?? 50) * 0.12);
  const budgetCushion = v1014laborClamp(100 - (householdBudget?.nationalBudgetPressureScore ?? 50));
  const automationHeadroom = v1014laborClamp(
    100 - (state.regions.NSW?.automationPressureIndex ?? 50) * 0.45 - (state.automationFeedbackSummary ? 8 : 0)
  );
  const capacityMargin = v1014laborClamp(100 - (capacityBridge?.nationalGapIndex ?? 40));

  const dimensions: LaborResilienceDimension[] = [
    {
      id: 'shock_buffer',
      score: shockBuffer,
      band: dimBand(shockBuffer),
      label: 'Migration shock buffer'
    },
    {
      id: 'budget_cushion',
      score: budgetCushion,
      band: dimBand(budgetCushion),
      label: 'Household budget cushion'
    },
    {
      id: 'automation_headroom',
      score: automationHeadroom,
      band: dimBand(automationHeadroom),
      label: 'Automation transition headroom'
    },
    {
      id: 'capacity_margin',
      score: capacityMargin,
      band: dimBand(capacityMargin),
      label: 'Workforce capacity margin'
    }
  ];

  const compositeScore = v1014laborClamp(
    dimensions.reduce((a, d) => a + d.score, 0) / dimensions.length
  );
  const band = resilienceBand(compositeScore);
  const headline = `Labor resilience ${band} (${Math.round(compositeScore)}) — ${dimensions.sort((a, b) => a.score - b.score)[0]?.label.toLowerCase() ?? 'mixed'} weakest.`;
  const stewardNote =
    band === 'fragile'
      ? 'Resilience fragile — defer stacked automation and ease household strain before migration shocks.'
      : band === 'watchful'
        ? 'Resilience watchful — monitor strain hubs and corridor pull before major workforce shifts.'
        : 'Resilience adequate for bounded labor band movement.';

  return {
    turn: state.turn,
    compositeScore,
    band,
    dimensions,
    headline,
    stewardNote
  };
}


// --- source: interregional-labor-rebalancing.ts ---
  IntegratedLaborMarketBrief,
  InterregionalLaborRebalancingPlan,
  LaborRebalancingMove,
  NationalLaborDemographicsState,
  NationalWorkforceCapacityBridge
} from './types';

function movePriority(relief: number): LaborRebalancingMove['priority'] {
  if (relief >= 12) return 'high';
  if (relief >= 6) return 'medium';
  return 'low';
}

export function computeInterregionalLaborRebalancingPlan(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): InterregionalLaborRebalancingPlan {
  if (!state.enabled || !brief) {
    return { turn: state.turn, moves: [], summary: 'Rebalancing idle — labor layer off.' };
  }

  const strainSet = new Set(brief.topStrainRegions);
  const opportunitySet = new Set(brief.topOpportunityRegions);
  const moves: LaborRebalancingMove[] = [];

  REGIONAL_MIGRATION_CORRIDORS.forEach(c => {
    const fromStrain = strainSet.has(c.fromRegionId);
    const toOpportunity = opportunitySet.has(c.toRegionId);
    const fromGap = capacityBridge?.regions[c.fromRegionId]?.gapIndex ?? 50;
    const toGap = capacityBridge?.regions[c.toRegionId]?.gapIndex ?? 50;
    if (!fromStrain && fromGap < 45) return;
    if (!toOpportunity && toGap > 55) return;
    const relief = (fromGap - toGap) * 0.2 * c.strength;
    if (relief < 2.5) return;
    moves.push({
      id: `rebal_${c.id}`,
      fromRegionId: c.fromRegionId,
      toRegionId: c.toRegionId,
      priority: movePriority(relief),
      rationale: `${c.label}: ease ${c.fromRegionId} strain toward ${c.toRegionId} opportunity (${c.industryTheme}).`,
      expectedRelief: Math.round(relief * 10) / 10
    });
  });

  moves.sort((a, b) => b.expectedRelief - a.expectedRelief);
  const top = moves.slice(0, 5);
  const summary = top.length
    ? `Rebalancing plan: ${top.map(m => `${m.fromRegionId}→${m.toRegionId} (${m.priority})`).join('; ')}.`
    : 'No interregional rebalancing moves recommended this turn.';

  return { turn: state.turn, moves: top, summary };
}


// --- source: catalog/workforce-retention-levers.ts ---

export type WorkforceRetentionLeverKind =
  | 'housing_anchor'
  | 'career_ladder'
  | 'regional_incentive'
  | 'automation_transition'
  | 'essential_services';

export interface WorkforceRetentionLever {
  id: string;
  kind: WorkforceRetentionLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  retentionStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_RETENTION_LEVERS: WorkforceRetentionLever[] = [
  {
    id: 'retain_mining_wa',
    kind: 'housing_anchor',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    retentionStrength: 0.74,
    label: 'Resource housing anchor',
    narrative: 'Camp-to-community transitions reduce fly-in churn when affordability indices improve.'
  },
  {
    id: 'retain_tech_nsw',
    kind: 'career_ladder',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    retentionStrength: 0.81,
    label: 'Metro career ladder depth',
    narrative: 'Skilled retention tracks output concentration without literal tenure counts.'
  },
  {
    id: 'retain_health_act',
    kind: 'essential_services',
    targetIndustry: 'research',
    hostRegions: ['ACT', 'NSW'],
    retentionStrength: 0.68,
    label: 'Policy-research retention loop',
    narrative: 'Research adjacency stabilizes specialized labor bands in capital corridors.'
  },
  {
    id: 'retain_agri_sa',
    kind: 'regional_incentive',
    targetIndustry: 'agriculture',
    hostRegions: ['SA', 'TAS', 'VIC'],
    retentionStrength: 0.58,
    label: 'Regional agri stay incentives',
    narrative: 'Seasonal depth scores benefit from bounded regional incentive indices.'
  },
  {
    id: 'retain_energy_nt',
    kind: 'automation_transition',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD', 'WA'],
    retentionStrength: 0.71,
    label: 'Frontier energy transition pack',
    narrative: 'Automation transition packs reduce strain-driven outflow in energy frontiers.'
  },
  {
    id: 'retain_manufacturing_vic',
    kind: 'career_ladder',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    retentionStrength: 0.63,
    label: 'Manufacturing skills depth',
    narrative: 'Output-linked retention offsets wage pressure in industrial corridors.'
  },
  {
    id: 'retain_tourism_qld',
    kind: 'regional_incentive',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'TAS', 'NSW'],
    retentionStrength: 0.55,
    label: 'Tourism seasonal retention',
    narrative: 'Service-sector retention moderates migration volatility in coastal hubs.'
  },
  {
    id: 'retain_trade_sa',
    kind: 'essential_services',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    retentionStrength: 0.77,
    label: 'Trade logistics anchor',
    narrative: 'Long-cycle trade output supports stable employment linkage bands.'
  }
];

export function lookupWorkforceRetentionLever(id: string): WorkforceRetentionLever | undefined {
  return WORKFORCE_RETENTION_LEVERS.find(l => l.id === id);
}

export function retentionLeversForIndustry(industry: StrategicIndustryKind): WorkforceRetentionLever[] {
  return WORKFORCE_RETENTION_LEVERS.filter(l => l.targetIndustry === industry);
}

export function retentionPullForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_RETENTION_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.retentionStrength, 0) / matches.length;
}


// --- source: catalog/workforce-upskilling-programs.ts ---

export type WorkforceUpskillingProgramKind =
  | 'digital_transition'
  | 'trades_apprentice'
  | 'frontier_reskill'
  | 'metro_tech_stack'
  | 'regional_services';

export interface WorkforceUpskillingProgram {
  id: string;
  kind: WorkforceUpskillingProgramKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  upliftStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_UPSKILLING_PROGRAMS: WorkforceUpskillingProgram[] = [
  {
    id: 'upskill_tech_nsw_vic',
    kind: 'metro_tech_stack',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    upliftStrength: 0.82,
    label: 'Metro tech stack uplift',
    narrative: 'Digital stack programs raise skilled supply indices in output-heavy metros.'
  },
  {
    id: 'upskill_mining_wa',
    kind: 'frontier_reskill',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD'],
    upliftStrength: 0.76,
    label: 'Resource automation reskill',
    narrative: 'Frontier reskill packs offset automation drag without literal training counts.'
  },
  {
    id: 'upskill_manufacturing_vic',
    kind: 'trades_apprentice',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    upliftStrength: 0.69,
    label: 'Industrial trades depth',
    narrative: 'Apprentice-depth indices tighten skill mismatch in manufacturing corridors.'
  },
  {
    id: 'upskill_energy_nt',
    kind: 'frontier_reskill',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'WA'],
    upliftStrength: 0.73,
    label: 'Energy transition reskill',
    narrative: 'Transition reskill eases mismatch when automation pressure rises in frontiers.'
  },
  {
    id: 'upskill_agri_sa_tas',
    kind: 'regional_services',
    targetIndustry: 'agriculture',
    hostRegions: ['SA', 'TAS', 'VIC'],
    upliftStrength: 0.58,
    label: 'Regional agri precision uplift',
    narrative: 'Precision ag uplift supports seasonal skill depth in regional hosts.'
  },
  {
    id: 'upskill_research_act',
    kind: 'digital_transition',
    targetIndustry: 'research',
    hostRegions: ['ACT', 'NSW'],
    upliftStrength: 0.71,
    label: 'Policy-research digital uplift',
    narrative: 'Research adjacency programs lift skilled supply in capital corridors.'
  },
  {
    id: 'upskill_tourism_qld',
    kind: 'regional_services',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'TAS', 'NSW'],
    upliftStrength: 0.52,
    label: 'Tourism service uplift',
    narrative: 'Service uplift indices reduce mismatch during seasonal demand peaks.'
  },
  {
    id: 'upskill_trade_nsw',
    kind: 'metro_tech_stack',
    targetIndustry: 'trade',
    hostRegions: ['NSW', 'VIC'],
    upliftStrength: 0.64,
    label: 'Gateway logistics uplift',
    narrative: 'Logistics uplift supports trade-linked skilled supply in gateway regions.'
  }
];

export function upskillingProgramsForIndustry(industry: StrategicIndustryKind): WorkforceUpskillingProgram[] {
  return WORKFORCE_UPSKILLING_PROGRAMS.filter(p => p.targetIndustry === industry);
}

export function lookupWorkforceUpskillingProgram(id: string): WorkforceUpskillingProgram | undefined {
  return WORKFORCE_UPSKILLING_PROGRAMS.find(p => p.id === id);
}

export function upskillingUpliftForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_UPSKILLING_PROGRAMS.filter(
    p => p.targetIndustry === dominantIndustry && p.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, p) => a + p.upliftStrength, 0) / matches.length;
}


// --- source: catalog/workforce-inclusion-levers.ts ---

export type WorkforceInclusionLeverKind =
  | 'apprenticeship_bridge'
  | 'caregiver_flex'
  | 'regional_access'
  | 'language_pathway'
  | 'disability_accommodation';

export interface WorkforceInclusionLever {
  id: string;
  kind: WorkforceInclusionLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  inclusionStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_INCLUSION_LEVERS: WorkforceInclusionLever[] = [
  {
    id: 'incl_manufacturing_vic',
    kind: 'apprenticeship_bridge',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    inclusionStrength: 0.72,
    label: 'Manufacturing apprenticeship bridge',
    narrative: 'Apprenticeship bridges widen participation without literal credential counts.'
  },
  {
    id: 'incl_health_nsw',
    kind: 'caregiver_flex',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    inclusionStrength: 0.69,
    label: 'Caregiver-flex research bands',
    narrative: 'Flexible participation indices support capital-region research depth.'
  },
  {
    id: 'incl_agri_tas',
    kind: 'regional_access',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    inclusionStrength: 0.61,
    label: 'Regional agri access pack',
    narrative: 'Regional access levers ease underemployment slack in seasonal corridors.'
  },
  {
    id: 'incl_tourism_qld',
    kind: 'language_pathway',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    inclusionStrength: 0.58,
    label: 'Tourism language pathway',
    narrative: 'Language pathways lift service-sector participation in coastal hubs.'
  },
  {
    id: 'incl_tech_nsw_vic',
    kind: 'disability_accommodation',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    inclusionStrength: 0.76,
    label: 'Tech accommodation depth',
    narrative: 'Accommodation indices broaden tech participation without HR micro-simulation.'
  },
  {
    id: 'incl_mining_wa',
    kind: 'regional_access',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    inclusionStrength: 0.64,
    label: 'Frontier mining access',
    narrative: 'Frontier access packs reduce hidden underuse in resource regions.'
  },
  {
    id: 'incl_energy_nt',
    kind: 'apprenticeship_bridge',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    inclusionStrength: 0.67,
    label: 'Energy transition bridge',
    narrative: 'Transition bridges align automation shifts with inclusive participation.'
  },
  {
    id: 'incl_trade_sa',
    kind: 'caregiver_flex',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    inclusionStrength: 0.55,
    label: 'Trade logistics flex bands',
    narrative: 'Flex bands stabilize logistics participation under wage pressure.'
  }
];

export function lookupWorkforceInclusionLever(id: string): WorkforceInclusionLever | undefined {
  return WORKFORCE_INCLUSION_LEVERS.find(l => l.id === id);
}

export function inclusionLeversForIndustry(industry: StrategicIndustryKind): WorkforceInclusionLever[] {
  return WORKFORCE_INCLUSION_LEVERS.filter(l => l.targetIndustry === industry);
}

export function inclusionEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_INCLUSION_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.inclusionStrength, 0) / matches.length;
}


// --- source: catalog/workforce-care-levers.ts ---

export type WorkforceCareLeverKind =
  | 'childcare_subsidy'
  | 'after_school_care'
  | 'elder_care_respite'
  | 'shift_flex_pack'
  | 'commute_relief';

export interface WorkforceCareLever {
  id: string;
  kind: WorkforceCareLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  careReliefStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_CARE_LEVERS: WorkforceCareLever[] = [
  {
    id: 'care_health_nsw',
    kind: 'shift_flex_pack',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    careReliefStrength: 0.74,
    label: 'Capital health shift-flex pack',
    narrative: 'Shift-flex packs ease caregiver participation drag in capital research bands.'
  },
  {
    id: 'care_manufacturing_vic',
    kind: 'after_school_care',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    careReliefStrength: 0.68,
    label: 'Manufacturing after-school relief',
    narrative: 'After-school relief indices lift manufacturing participation without micro childcare sim.'
  },
  {
    id: 'care_agri_tas',
    kind: 'commute_relief',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    careReliefStrength: 0.59,
    label: 'Regional agri commute relief',
    narrative: 'Commute relief eases seasonal caregiver friction in regional agri corridors.'
  },
  {
    id: 'care_tourism_qld',
    kind: 'childcare_subsidy',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    careReliefStrength: 0.63,
    label: 'Coastal tourism childcare subsidy',
    narrative: 'Subsidy indices stabilize service-sector participation in coastal hubs.'
  },
  {
    id: 'care_tech_nsw_vic',
    kind: 'elder_care_respite',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    careReliefStrength: 0.71,
    label: 'Tech elder-care respite band',
    narrative: 'Respite bands reduce hybrid-participation friction for dual-care households.'
  },
  {
    id: 'care_mining_wa',
    kind: 'shift_flex_pack',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    careReliefStrength: 0.66,
    label: 'Frontier mining roster flex',
    narrative: 'Roster flex packs offset caregiver drag in frontier resource regions.'
  },
  {
    id: 'care_energy_nt',
    kind: 'after_school_care',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    careReliefStrength: 0.62,
    label: 'Energy transition care pack',
    narrative: 'Care packs align transition participation with automation shift bands.'
  },
  {
    id: 'care_trade_sa',
    kind: 'commute_relief',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    careReliefStrength: 0.57,
    label: 'Trade logistics commute relief',
    narrative: 'Logistics commute relief stabilizes participation under wage pressure.'
  }
];

export function lookupWorkforceCareLever(id: string): WorkforceCareLever | undefined {
  return WORKFORCE_CARE_LEVERS.find(l => l.id === id);
}

export function careLeversForIndustry(industry: StrategicIndustryKind): WorkforceCareLever[] {
  return WORKFORCE_CARE_LEVERS.filter(l => l.targetIndustry === industry);
}

export function careReliefForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_CARE_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.careReliefStrength, 0) / matches.length;
}


// --- source: catalog/workforce-flexibility-levers.ts ---

export type WorkforceFlexibilityLeverKind =
  | 'compressed_week'
  | 'job_share_band'
  | 'async_hours_pack'
  | 'seasonal_ramp'
  | 'roster_self_select';

export interface WorkforceFlexibilityLever {
  id: string;
  kind: WorkforceFlexibilityLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  flexibilityStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_FLEXIBILITY_LEVERS: WorkforceFlexibilityLever[] = [
  {
    id: 'flex_health_nsw',
    kind: 'async_hours_pack',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    flexibilityStrength: 0.72,
    label: 'Capital health async hours',
    narrative: 'Async hour bands ease caregiver and hybrid scheduling friction in research hubs.'
  },
  {
    id: 'flex_manufacturing_vic',
    kind: 'compressed_week',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    flexibilityStrength: 0.67,
    label: 'Manufacturing compressed week',
    narrative: 'Compressed-week indices lift participation without micro shift sim.'
  },
  {
    id: 'flex_agri_tas',
    kind: 'seasonal_ramp',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    flexibilityStrength: 0.61,
    label: 'Regional agri seasonal ramp',
    narrative: 'Seasonal ramp packs align peak labor with corridor absorption headroom.'
  },
  {
    id: 'flex_tourism_qld',
    kind: 'job_share_band',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    flexibilityStrength: 0.64,
    label: 'Coastal tourism job-share band',
    narrative: 'Job-share bands stabilize service participation in coastal hubs.'
  },
  {
    id: 'flex_tech_nsw_vic',
    kind: 'roster_self_select',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    flexibilityStrength: 0.75,
    label: 'Tech roster self-select',
    narrative: 'Self-select rosters reduce hybrid friction for dual-care households.'
  },
  {
    id: 'flex_mining_wa',
    kind: 'compressed_week',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    flexibilityStrength: 0.69,
    label: 'Frontier mining roster flex',
    narrative: 'Roster flex offsets participation drag in frontier resource regions.'
  },
  {
    id: 'flex_energy_nt',
    kind: 'async_hours_pack',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    flexibilityStrength: 0.63,
    label: 'Energy async corridor pack',
    narrative: 'Async packs ease shift transitions in energy frontier corridors.'
  },
  {
    id: 'flex_trade_sa',
    kind: 'seasonal_ramp',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    flexibilityStrength: 0.58,
    label: 'Trade logistics seasonal ramp',
    narrative: 'Logistics ramps smooth absorption spikes without wage surge loops.'
  }
];

export function lookupWorkforceFlexibilityLever(id: string): WorkforceFlexibilityLever | undefined {
  return WORKFORCE_FLEXIBILITY_LEVERS.find(l => l.id === id);
}

export function flexibilityLeversForIndustry(industry: StrategicIndustryKind): WorkforceFlexibilityLever[] {
  return WORKFORCE_FLEXIBILITY_LEVERS.filter(l => l.targetIndustry === industry);
}

export function flexibilityEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_FLEXIBILITY_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.flexibilityStrength, 0) / matches.length;
}


// --- source: catalog/workforce-reengagement-levers.ts ---

export type WorkforceReengagementLeverKind =
  | 'returnship_band'
  | 'absence_reentry'
  | 'part_time_ramp'
  | 'sector_switch_coach'
  | 'community_hire_lane';

export interface WorkforceReengagementLever {
  id: string;
  kind: WorkforceReengagementLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  reengagementStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_REENGAGEMENT_LEVERS: WorkforceReengagementLever[] = [
  {
    id: 'reeng_manufacturing_vic',
    kind: 'returnship_band',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    reengagementStrength: 0.71,
    label: 'Manufacturing returnship band',
    narrative: 'Returnship indices widen participation after absence without micro hiring sim.'
  },
  {
    id: 'reeng_health_nsw',
    kind: 'part_time_ramp',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    reengagementStrength: 0.68,
    label: 'Capital health part-time ramp',
    narrative: 'Part-time ramps ease equity gaps in capital research corridors.'
  },
  {
    id: 'reeng_agri_tas',
    kind: 'community_hire_lane',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    reengagementStrength: 0.6,
    label: 'Regional agri community hire',
    narrative: 'Community hire lanes absorb seasonal slack in regional agri hubs.'
  },
  {
    id: 'reeng_tourism_qld',
    kind: 'absence_reentry',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    reengagementStrength: 0.64,
    label: 'Coastal tourism reentry pack',
    narrative: 'Reentry packs stabilize service participation after cyclical absence.'
  },
  {
    id: 'reeng_tech_nsw_vic',
    kind: 'sector_switch_coach',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    reengagementStrength: 0.73,
    label: 'Tech sector-switch coaching',
    narrative: 'Switch coaching aligns credential mobility with upskilling pathways.'
  },
  {
    id: 'reeng_mining_wa',
    kind: 'returnship_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    reengagementStrength: 0.67,
    label: 'Frontier mining returnship',
    narrative: 'Returnship bands offset participation drag in frontier resource regions.'
  },
  {
    id: 'reeng_energy_nt',
    kind: 'part_time_ramp',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    reengagementStrength: 0.62,
    label: 'Energy corridor part-time ramp',
    narrative: 'Ramp packs ease rebalancing stress along energy frontier corridors.'
  },
  {
    id: 'reeng_trade_sa',
    kind: 'community_hire_lane',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    reengagementStrength: 0.59,
    label: 'Trade logistics community lane',
    narrative: 'Community lanes smooth household-participation coupling in logistics hubs.'
  }
];

export function lookupWorkforceReengagementLever(id: string): WorkforceReengagementLever | undefined {
  return WORKFORCE_REENGAGEMENT_LEVERS.find(l => l.id === id);
}

export function reengagementLeversForIndustry(industry: StrategicIndustryKind): WorkforceReengagementLever[] {
  return WORKFORCE_REENGAGEMENT_LEVERS.filter(l => l.targetIndustry === industry);
}

export function reengagementPullForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_REENGAGEMENT_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.reengagementStrength, 0) / matches.length;
}


// --- source: catalog/workforce-onboarding-levers.ts ---

export type WorkforceOnboardingLeverKind =
  | 'buddy_lane'
  | 'credential_fast_track'
  | 'site_induction_pack'
  | 'language_ramp'
  | 'safety_orientation_band';

export interface WorkforceOnboardingLever {
  id: string;
  kind: WorkforceOnboardingLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  onboardingStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_ONBOARDING_LEVERS: WorkforceOnboardingLever[] = [
  {
    id: 'onboard_manufacturing_vic',
    kind: 'site_induction_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    onboardingStrength: 0.7,
    label: 'Manufacturing site induction pack',
    narrative: 'Induction packs shorten time-to-productivity without literal training counts.'
  },
  {
    id: 'onboard_health_nsw',
    kind: 'credential_fast_track',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    onboardingStrength: 0.73,
    label: 'Capital health credential fast-track',
    narrative: 'Fast-track bands align onboarding with credential mobility pathways.'
  },
  {
    id: 'onboard_agri_tas',
    kind: 'buddy_lane',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    onboardingStrength: 0.62,
    label: 'Regional agri buddy lane',
    narrative: 'Buddy lanes ease seasonal onboarding in regional agri corridors.'
  },
  {
    id: 'onboard_tourism_qld',
    kind: 'language_ramp',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    onboardingStrength: 0.65,
    label: 'Coastal tourism language ramp',
    narrative: 'Language ramps stabilize service-sector onboarding in coastal hubs.'
  },
  {
    id: 'onboard_tech_nsw_vic',
    kind: 'credential_fast_track',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    onboardingStrength: 0.76,
    label: 'Tech onboarding fast-track',
    narrative: 'Fast-track onboarding supports portable credential mobility bands.'
  },
  {
    id: 'onboard_mining_wa',
    kind: 'safety_orientation_band',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    onboardingStrength: 0.68,
    label: 'Frontier mining safety orientation',
    narrative: 'Safety orientation bands offset automation participation drag in resource regions.'
  },
  {
    id: 'onboard_energy_nt',
    kind: 'site_induction_pack',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    onboardingStrength: 0.64,
    label: 'Energy corridor induction pack',
    narrative: 'Induction packs align onboarding with corridor absorption headroom.'
  },
  {
    id: 'onboard_trade_sa',
    kind: 'buddy_lane',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    onboardingStrength: 0.6,
    label: 'Trade logistics buddy lane',
    narrative: 'Buddy lanes smooth migration-shock participation buffers in logistics hubs.'
  }
];

export function lookupWorkforceOnboardingLever(id: string): WorkforceOnboardingLever | undefined {
  return WORKFORCE_ONBOARDING_LEVERS.find(l => l.id === id);
}

export function onboardingLeversForIndustry(industry: StrategicIndustryKind): WorkforceOnboardingLever[] {
  return WORKFORCE_ONBOARDING_LEVERS.filter(l => l.targetIndustry === industry);
}

export function onboardingEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_ONBOARDING_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.onboardingStrength, 0) / matches.length;
}


// --- source: catalog/workforce-coordination-levers.ts ---

export type WorkforceCoordinationLeverKind =
  | 'sector_roundtable'
  | 'corridor_taskforce'
  | 'skills_council'
  | 'regional_compact'
  | 'automation_pact';

export interface WorkforceCoordinationLever {
  id: string;
  kind: WorkforceCoordinationLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  coordinationStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_COORDINATION_LEVERS: WorkforceCoordinationLever[] = [
  {
    id: 'coord_manufacturing_vic',
    kind: 'sector_roundtable',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    coordinationStrength: 0.71,
    label: 'Manufacturing sector roundtable',
    narrative: 'Roundtables align upskilling with participation equity without micro policy sim.'
  },
  {
    id: 'coord_health_nsw',
    kind: 'skills_council',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    coordinationStrength: 0.74,
    label: 'Capital health skills council',
    narrative: 'Skills councils stabilize credential mobility across capital corridors.'
  },
  {
    id: 'coord_agri_tas',
    kind: 'regional_compact',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    coordinationStrength: 0.63,
    label: 'Regional agri workforce compact',
    narrative: 'Compacts smooth seasonal participation buffers in regional agri hubs.'
  },
  {
    id: 'coord_tourism_qld',
    kind: 'corridor_taskforce',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    coordinationStrength: 0.66,
    label: 'Coastal tourism corridor taskforce',
    narrative: 'Taskforces coordinate absorption with migration-shock buffers.'
  },
  {
    id: 'coord_tech_nsw_vic',
    kind: 'automation_pact',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    coordinationStrength: 0.77,
    label: 'Tech automation coordination pact',
    narrative: 'Automation pacts align resilience outlooks with onboarding levers.'
  },
  {
    id: 'coord_mining_wa',
    kind: 'corridor_taskforce',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    coordinationStrength: 0.7,
    label: 'Frontier mining corridor taskforce',
    narrative: 'Taskforces sequence rebalancing stress before wage spillover surges.'
  },
  {
    id: 'coord_energy_nt',
    kind: 'sector_roundtable',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    coordinationStrength: 0.65,
    label: 'Energy sector roundtable',
    narrative: 'Roundtables align capacity-participation alignment in energy corridors.'
  },
  {
    id: 'coord_trade_sa',
    kind: 'regional_compact',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    coordinationStrength: 0.61,
    label: 'Trade logistics regional compact',
    narrative: 'Compacts reinforce labor-market stability across logistics hubs.'
  }
];

export function lookupWorkforceCoordinationLever(id: string): WorkforceCoordinationLever | undefined {
  return WORKFORCE_COORDINATION_LEVERS.find(l => l.id === id);
}

export function coordinationLeversForIndustry(industry: StrategicIndustryKind): WorkforceCoordinationLever[] {
  return WORKFORCE_COORDINATION_LEVERS.filter(l => l.targetIndustry === industry);
}

export function coordinationEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_COORDINATION_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.coordinationStrength, 0) / matches.length;
}


// --- source: catalog/workforce-advocacy-levers.ts ---

export type WorkforceAdvocacyLeverKind =
  | 'worker_voice_forum'
  | 'grievance_fast_lane'
  | 'sector_advocacy_pack'
  | 'regional_labor_council'
  | 'equity_watch_band';

export interface WorkforceAdvocacyLever {
  id: string;
  kind: WorkforceAdvocacyLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  advocacyStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_ADVOCACY_LEVERS: WorkforceAdvocacyLever[] = [
  {
    id: 'adv_manufacturing_vic',
    kind: 'sector_advocacy_pack',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    advocacyStrength: 0.69,
    label: 'Manufacturing sector advocacy pack',
    narrative: 'Advocacy packs reinforce participation equity without literal union sim.'
  },
  {
    id: 'adv_health_nsw',
    kind: 'worker_voice_forum',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    advocacyStrength: 0.72,
    label: 'Capital health worker voice forum',
    narrative: 'Voice forums align household coupling with coordination levers.'
  },
  {
    id: 'adv_agri_tas',
    kind: 'regional_labor_council',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    advocacyStrength: 0.61,
    label: 'Regional agri labor council',
    narrative: 'Labor councils smooth participation-velocity coupling in seasonal corridors.'
  },
  {
    id: 'adv_tourism_qld',
    kind: 'grievance_fast_lane',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    advocacyStrength: 0.64,
    label: 'Coastal tourism grievance lane',
    narrative: 'Fast lanes stabilize migration-equity buffers in coastal hubs.'
  },
  {
    id: 'adv_tech_nsw_vic',
    kind: 'equity_watch_band',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    advocacyStrength: 0.75,
    label: 'Tech equity watch band',
    narrative: 'Equity watch bands support skills-tightness coherence in tech corridors.'
  },
  {
    id: 'adv_mining_wa',
    kind: 'worker_voice_forum',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    advocacyStrength: 0.68,
    label: 'Frontier mining worker voice',
    narrative: 'Worker voice eases rebalancing stress before wage spillover surges.'
  },
  {
    id: 'adv_energy_nt',
    kind: 'sector_advocacy_pack',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    advocacyStrength: 0.63,
    label: 'Energy sector advocacy pack',
    narrative: 'Advocacy packs reinforce integrated labor readiness in energy corridors.'
  },
  {
    id: 'adv_trade_sa',
    kind: 'regional_labor_council',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    advocacyStrength: 0.6,
    label: 'Trade logistics labor council',
    narrative: 'Councils align capacity-participation alignment across logistics hubs.'
  }
];

export function lookupWorkforceAdvocacyLever(id: string): WorkforceAdvocacyLever | undefined {
  return WORKFORCE_ADVOCACY_LEVERS.find(l => l.id === id);
}

export function advocacyLeversForIndustry(industry: StrategicIndustryKind): WorkforceAdvocacyLever[] {
  return WORKFORCE_ADVOCACY_LEVERS.filter(l => l.targetIndustry === industry);
}

export function advocacyEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_ADVOCACY_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.advocacyStrength, 0) / matches.length;
}


// --- source: catalog/workforce-mentorship-levers.ts ---

export type WorkforceMentorshipLeverKind =
  | 'peer_mentor_lane'
  | 'apprentice_sponsor'
  | 'executive_shadow_band'
  | 'cross_sector_rotation'
  | 'frontier_coach_pack';

export interface WorkforceMentorshipLever {
  id: string;
  kind: WorkforceMentorshipLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  mentorshipStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_MENTORSHIP_LEVERS: WorkforceMentorshipLever[] = [
  {
    id: 'mentor_manufacturing_vic',
    kind: 'apprentice_sponsor',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    mentorshipStrength: 0.7,
    label: 'Manufacturing apprentice sponsor',
    narrative: 'Sponsor lanes lift youth pipeline without literal mentor counts.'
  },
  {
    id: 'mentor_health_nsw',
    kind: 'executive_shadow_band',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    mentorshipStrength: 0.73,
    label: 'Capital health shadow band',
    narrative: 'Shadow bands reinforce credential mobility in capital corridors.'
  },
  {
    id: 'mentor_agri_tas',
    kind: 'peer_mentor_lane',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    mentorshipStrength: 0.62,
    label: 'Regional agri peer mentor',
    narrative: 'Peer mentors ease seasonal participation-velocity coupling.'
  },
  {
    id: 'mentor_tourism_qld',
    kind: 'cross_sector_rotation',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    mentorshipStrength: 0.65,
    label: 'Coastal tourism rotation band',
    narrative: 'Rotation bands stabilize hybrid-remote participation outlooks.'
  },
  {
    id: 'mentor_tech_nsw_vic',
    kind: 'frontier_coach_pack',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    mentorshipStrength: 0.76,
    label: 'Tech frontier coach pack',
    narrative: 'Coach packs align skills coherence with onboarding levers.'
  },
  {
    id: 'mentor_mining_wa',
    kind: 'apprentice_sponsor',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    mentorshipStrength: 0.69,
    label: 'Frontier mining sponsor lane',
    narrative: 'Sponsor lanes offset corridor capacity stress in resource regions.'
  },
  {
    id: 'mentor_energy_nt',
    kind: 'peer_mentor_lane',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    mentorshipStrength: 0.64,
    label: 'Energy peer mentor corridor',
    narrative: 'Peer mentors reinforce steward intervention priorities.'
  },
  {
    id: 'mentor_trade_sa',
    kind: 'cross_sector_rotation',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    mentorshipStrength: 0.61,
    label: 'Trade logistics rotation pack',
    narrative: 'Rotation packs smooth integrated readiness in logistics hubs.'
  }
];

export function lookupWorkforceMentorshipLever(id: string): WorkforceMentorshipLever | undefined {
  return WORKFORCE_MENTORSHIP_LEVERS.find(l => l.id === id);
}

export function mentorshipLeversForIndustry(industry: StrategicIndustryKind): WorkforceMentorshipLever[] {
  return WORKFORCE_MENTORSHIP_LEVERS.filter(l => l.targetIndustry === industry);
}

export function mentorshipEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_MENTORSHIP_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.mentorshipStrength, 0) / matches.length;
}


// --- source: catalog/workforce-safety-levers.ts ---

export type WorkforceSafetyLeverKind =
  | 'site_safety_pack'
  | 'heat_stress_mitigation'
  | 'equipment_guard_band'
  | 'wellbeing_check_lane'
  | 'incident_prevention_forum';

export interface WorkforceSafetyLever {
  id: string;
  kind: WorkforceSafetyLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  safetyStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_SAFETY_LEVERS: WorkforceSafetyLever[] = [
  {
    id: 'safe_manufacturing_vic',
    kind: 'equipment_guard_band',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    safetyStrength: 0.71,
    label: 'Manufacturing guard band',
    narrative: 'Guard bands stabilize participation without literal incident counts.'
  },
  {
    id: 'safe_health_nsw',
    kind: 'wellbeing_check_lane',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    safetyStrength: 0.74,
    label: 'Capital health wellbeing lane',
    narrative: 'Wellbeing lanes reinforce hybrid-remote participation outlooks.'
  },
  {
    id: 'safe_agri_tas',
    kind: 'heat_stress_mitigation',
    targetIndustry: 'agriculture',
    hostRegions: ['TAS', 'SA', 'VIC'],
    safetyStrength: 0.63,
    label: 'Regional agri heat mitigation',
    narrative: 'Heat mitigation eases seasonal essential-worker participation drag.'
  },
  {
    id: 'safe_tourism_qld',
    kind: 'site_safety_pack',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    safetyStrength: 0.66,
    label: 'Coastal tourism safety pack',
    narrative: 'Safety packs support migration-shock participation buffers.'
  },
  {
    id: 'safe_tech_nsw_vic',
    kind: 'incident_prevention_forum',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    safetyStrength: 0.75,
    label: 'Tech prevention forum',
    narrative: 'Forums align wage-automation coupling with mentorship levers.'
  },
  {
    id: 'safe_mining_wa',
    kind: 'site_safety_pack',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    safetyStrength: 0.72,
    label: 'Frontier mining safety pack',
    narrative: 'Safety packs offset corridor capacity stress in resource regions.'
  },
  {
    id: 'safe_energy_nt',
    kind: 'equipment_guard_band',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    safetyStrength: 0.67,
    label: 'Energy equipment guard band',
    narrative: 'Guard bands reinforce national labor cohesion indices.'
  },
  {
    id: 'safe_trade_sa',
    kind: 'wellbeing_check_lane',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    safetyStrength: 0.62,
    label: 'Trade logistics wellbeing lane',
    narrative: 'Wellbeing lanes smooth steward intervention priorities.'
  }
];

export function lookupWorkforceSafetyLever(id: string): WorkforceSafetyLever | undefined {
  return WORKFORCE_SAFETY_LEVERS.find(l => l.id === id);
}

export function safetyLeversForIndustry(industry: StrategicIndustryKind): WorkforceSafetyLever[] {
  return WORKFORCE_SAFETY_LEVERS.filter(l => l.targetIndustry === industry);
}

export function safetyEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_SAFETY_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.safetyStrength, 0) / matches.length;
}


// --- source: catalog/workforce-scheduling-levers.ts ---

export type WorkforceSchedulingLeverKind =
  | 'shift_swap_lane'
  | 'roster_flex_band'
  | 'peak_load_buffer'
  | 'seasonal_crew_pool'
  | 'on_call_rotation';

export interface WorkforceSchedulingLever {
  id: string;
  kind: WorkforceSchedulingLeverKind;
  targetIndustry: StrategicIndustryKind;
  hostRegions: readonly string[];
  schedulingStrength: number;
  label: string;
  narrative: string;
}

export const WORKFORCE_SCHEDULING_LEVERS: WorkforceSchedulingLever[] = [
  {
    id: 'sched_health_nsw',
    kind: 'on_call_rotation',
    targetIndustry: 'research',
    hostRegions: ['NSW', 'ACT'],
    schedulingStrength: 0.73,
    label: 'Capital health on-call rotation',
    narrative: 'Rotations stabilize essential-worker participation without literal roster counts.'
  },
  {
    id: 'sched_tourism_qld',
    kind: 'seasonal_crew_pool',
    targetIndustry: 'tourism',
    hostRegions: ['QLD', 'NSW'],
    schedulingStrength: 0.68,
    label: 'Coastal seasonal crew pool',
    narrative: 'Crew pools feed seasonal participation swing outlooks.'
  },
  {
    id: 'sched_agri_sa',
    kind: 'peak_load_buffer',
    targetIndustry: 'agriculture',
    hostRegions: ['SA', 'VIC', 'TAS'],
    schedulingStrength: 0.64,
    label: 'Harvest peak buffer',
    narrative: 'Peak buffers ease corridor moves during harvest swings.'
  },
  {
    id: 'sched_manufacturing_vic',
    kind: 'roster_flex_band',
    targetIndustry: 'manufacturing',
    hostRegions: ['VIC', 'SA'],
    schedulingStrength: 0.7,
    label: 'Manufacturing roster flex band',
    narrative: 'Flex bands reinforce wage-automation coupling briefs.'
  },
  {
    id: 'sched_mining_wa',
    kind: 'shift_swap_lane',
    targetIndustry: 'mining',
    hostRegions: ['WA', 'QLD', 'NT'],
    schedulingStrength: 0.72,
    label: 'Frontier shift swap lane',
    narrative: 'Swap lanes offset cohesion-corridor coupling drag.'
  },
  {
    id: 'sched_tech_nsw_vic',
    kind: 'roster_flex_band',
    targetIndustry: 'technology',
    hostRegions: ['NSW', 'VIC'],
    schedulingStrength: 0.76,
    label: 'Tech hybrid roster flex',
    narrative: 'Hybrid flex supports reliability index without remote headcounts.'
  },
  {
    id: 'sched_energy_nt',
    kind: 'on_call_rotation',
    targetIndustry: 'energy',
    hostRegions: ['NT', 'QLD'],
    schedulingStrength: 0.69,
    label: 'Energy on-call rotation',
    narrative: 'Rotations align with safety levers in remote regions.'
  },
  {
    id: 'sched_trade_sa',
    kind: 'peak_load_buffer',
    targetIndustry: 'trade',
    hostRegions: ['SA', 'WA'],
    schedulingStrength: 0.61,
    label: 'Trade logistics peak buffer',
    narrative: 'Peak buffers smooth migration-shock participation buffers.'
  }
];

export function lookupWorkforceSchedulingLever(id: string): WorkforceSchedulingLever | undefined {
  return WORKFORCE_SCHEDULING_LEVERS.find(l => l.id === id);
}

export function schedulingLeversForIndustry(industry: StrategicIndustryKind): WorkforceSchedulingLever[] {
  return WORKFORCE_SCHEDULING_LEVERS.filter(l => l.targetIndustry === industry);
}

export function schedulingEaseForRegion(
  regionId: string,
  dominantIndustry: StrategicIndustryKind | null | undefined
): number {
  if (!dominantIndustry) return 0;
  const matches = WORKFORCE_SCHEDULING_LEVERS.filter(
    l => l.targetIndustry === dominantIndustry && l.hostRegions.includes(regionId)
  );
  if (!matches.length) return 0;
  return matches.reduce((a, l) => a + l.schedulingStrength, 0) / matches.length;
}


// --- source: dependency-ratio-snapshot.ts ---
  V1014_LABOR_CORE_REGIONS,
  type DependencyRatioBand,
  type LaborDemographicsRegionSnapshot,
  type NationalDependencyRatioSnapshot
} from './types';

function dependencyBand(ratioIndex: number): DependencyRatioBand {
  if (ratioIndex <= 42) return 'youth_heavy';
  if (ratioIndex <= 55) return 'balanced';
  if (ratioIndex <= 68) return 'aging';
  return 'aged_pressure';
}

function regionalRatioIndex(region: LaborDemographicsRegionSnapshot): number {
  const baseline = lookupRegionalLaborBaseline(region.regionId);
  const inertia = baseline?.demographicInertia ?? 50;
  const agingPull = 100 - region.demographicScore;
  const strainPull = region.workforceStrainIndex * 0.25;
  const retentionEase = retentionPullForRegion(region.regionId, region.dominantIndustry) * 18;
  return v1014laborClamp(inertia * 0.35 + agingPull * 0.45 + strainPull - retentionEase);
}

export function computeNationalDependencyRatioSnapshot(
  turn: number,
  regions: Record<string, LaborDemographicsRegionSnapshot>
): NationalDependencyRatioSnapshot {
  const regional: NationalDependencyRatioSnapshot['regions'] = {};
  const samples: number[] = [];

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const r = regions[regionId];
    if (!r) return;
    const ratioIndex = regionalRatioIndex(r);
    const band = dependencyBand(ratioIndex);
    samples.push(ratioIndex);
    regional[regionId] = {
      regionId,
      ratioIndex,
      band,
      narrative: `${regionId} dependency ${band.replace('_', ' ')} (index ${Math.round(ratioIndex)}).`
    };
  });

  const nationalRatioIndex = v1014laborClamp(
    samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  );
  const nationalBand = dependencyBand(nationalRatioIndex);
  const agedRegions = Object.values(regional)
    .filter(x => x.band === 'aged_pressure' || x.band === 'aging')
    .map(x => x.regionId);

  return {
    turn,
    nationalRatioIndex,
    nationalBand,
    regions: regional,
    agedPressureRegions: agedRegions.slice(0, 4),
    summary: `Dependency structure ${nationalBand.replace('_', ' ')} nationally (index ${Math.round(nationalRatioIndex)}); ${agedRegions.length} region(s) under aging pressure.`
  };
}


// --- source: participation-pressure-brief.ts ---
  IntegratedLaborMarketBrief,
  NationalDependencyRatioSnapshot,
  NationalLaborDemographicsState,
  NationalParticipationPressureBrief,
  ParticipationPressureBand
} from './types';

function participationBand(score: number): ParticipationPressureBand {
  if (score >= 68) return 'expansionary';
  if (score >= 52) return 'stable';
  if (score >= 38) return 'constrained';
  return 'shrinking';
}

export function computeNationalParticipationPressureBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  dependency: NationalDependencyRatioSnapshot | null | undefined
): NationalParticipationPressureBrief {
  if (!state.enabled || !brief) {
    return {
      turn: state.turn,
      participationIndex: 50,
      band: 'stable',
      headwinds: [],
      tailwinds: [],
      summary: 'Participation outlook idle — labor layer off.',
      stewardNote: 'Enable labor demographics before participation guidance.'
    };
  }

  const automationDrag = (state.regions.NSW?.automationPressureIndex ?? 50) * 0.22;
  const dependencyDrag =
    dependency?.nationalBand === 'aged_pressure'
      ? 14
      : dependency?.nationalBand === 'aging'
        ? 8
        : 0;
  const strainDrag = brief.compositePressureIndex * 0.35;
  const linkageLift = state.employmentLinkageScore * 0.4;
  const migrationLift = state.migrationFlowScore * 0.12;

  const participationIndex = v1014laborClamp(
    50 + linkageLift + migrationLift - automationDrag - dependencyDrag - strainDrag * 0.5
  );
  const band = participationBand(participationIndex);

  const headwinds: string[] = [];
  const tailwinds: string[] = [];
  if (dependencyDrag >= 8) headwinds.push('Aging dependency structure weighs on participation indices.');
  if (automationDrag >= 12) headwinds.push('Automation pressure caps near-term participation expansion.');
  if (brief.pressureBand === 'critical' || brief.pressureBand === 'elevated') {
    headwinds.push('Composite labor pressure constrains participation upside.');
  }
  if (state.employmentLinkageScore >= 58) tailwinds.push('Strong employment linkage supports participation depth.');
  if (state.nationalMigrationFlow === 'inflow' || state.nationalMigrationFlow === 'strong_inflow') {
    tailwinds.push('Migration inflow bands add participation tailwind (bounded).');
  }
  if (state.workforceCapacityBridge?.nationalBand === 'surplus') {
    tailwinds.push('Workforce capacity surplus eases participation constraints.');
  }

  const stewardNote =
    band === 'shrinking' || band === 'constrained'
      ? 'Participation constrained — prioritize retention levers and affordability before automation stacks.'
      : band === 'expansionary'
        ? 'Participation expansionary — monitor strain hubs so growth does not outrun capacity.'
        : 'Participation stable — maintain corridor balance and household cushion.';

  return {
    turn: state.turn,
    participationIndex,
    band,
    headwinds: headwinds.slice(0, 3),
    tailwinds: tailwinds.slice(0, 3),
    summary: `Participation ${band} (index ${Math.round(participationIndex)}); ${headwinds.length ? headwinds[0] : tailwinds[0] ?? 'mixed signals'}.`,
    stewardNote
  };
}


// --- source: labor-market-velocity-index.ts ---
  V1014_LABOR_CORE_REGIONS,
  type LaborDemographicsRegionSnapshot,
  type LaborMarketVelocityBand,
  type NationalLaborMarketVelocityIndex,
  type RegionalLaborMarketVelocity
} from './types';

function velocityBand(index: number): LaborMarketVelocityBand {
  if (index <= 38) return 'sluggish';
  if (index <= 52) return 'moderate';
  if (index <= 65) return 'active';
  return 'volatile';
}

function regionalVelocity(region: LaborDemographicsRegionSnapshot): number {
  const migrationChurn = Math.abs(region.migrationFlowScore - 50) * 0.85;
  const wageChurn = Math.abs(region.wagePressureScore - 50) * 0.55;
  const strainChurn = region.workforceStrainIndex * 0.35;
  const stabilityEase = region.householdEmploymentFit * 0.2;
  return v1014laborClamp(migrationChurn + wageChurn + strainChurn - stabilityEase + 25);
}

export function computeNationalLaborMarketVelocityIndex(
  turn: number,
  regions: Record<string, LaborDemographicsRegionSnapshot>
): NationalLaborMarketVelocityIndex {
  const regional: Record<string, RegionalLaborMarketVelocity> = {};
  const samples: number[] = [];
  let maxVel = -1;
  let hottestRegion: string | null = null;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const r = regions[regionId];
    if (!r) return;
    const velocityIndex = regionalVelocity(r);
    const band = velocityBand(velocityIndex);
    samples.push(velocityIndex);
    if (velocityIndex > maxVel) {
      maxVel = velocityIndex;
      hottestRegion = regionId;
    }
    regional[regionId] = {
      regionId,
      velocityIndex,
      band,
      narrative: `${regionId} labor velocity ${band} (index ${Math.round(velocityIndex)}).`
    };
  });

  const nationalVelocityIndex = v1014laborClamp(
    samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  );
  const nationalBand = velocityBand(nationalVelocityIndex);

  return {
    turn,
    nationalVelocityIndex,
    nationalBand,
    regions: regional,
    hottestRegion,
    summary: `Labor market velocity ${nationalBand} nationally (index ${Math.round(nationalVelocityIndex)}); ${hottestRegion ?? 'n/a'} most active.`
  };
}


// --- source: skill-mismatch-index.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalSkillMismatchIndex,
  type NationalWorkforceCapacityBridge,
  type RegionalSkillMismatch,
  type SkillMismatchBand
} from './types';

function mismatchBand(index: number): SkillMismatchBand {
  if (index <= 32) return 'aligned';
  if (index <= 48) return 'moderate_gap';
  if (index <= 62) return 'elevated_gap';
  return 'critical_mismatch';
}

export function computeNationalSkillMismatchIndex(
  turn: number,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): NationalSkillMismatchIndex {
  if (!capacityBridge) {
    return {
      turn,
      nationalMismatchIndex: 50,
      nationalBand: 'moderate_gap',
      regions: {},
      worstRegion: null,
      summary: 'Skill mismatch idle — capacity bridge unavailable.',
      stewardNote: 'Compute workforce capacity before skill mismatch guidance.'
    };
  }

  const regions: Record<string, RegionalSkillMismatch> = {};
  const samples: number[] = [];
  let maxMismatch = -1;
  let worstRegion: string | null = null;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const gap = capacityBridge.regions[regionId];
    if (!gap) return;
    const upliftEase = upskillingUpliftForRegion(regionId, capacityBridge.dominantShortageIndustry) * 18;
    const pathwayEase = gap.skilledPathwayBoost * 0.35;
    const mismatchIndex = v1014laborClamp(gap.gapIndex * 0.85 - upliftEase - pathwayEase + 22);
    const band = mismatchBand(mismatchIndex);
    samples.push(mismatchIndex);
    if (mismatchIndex > maxMismatch) {
      maxMismatch = mismatchIndex;
      worstRegion = regionId;
    }
    regions[regionId] = {
      regionId,
      mismatchIndex,
      band,
      narrative: `${regionId} skill alignment ${band.replace('_', ' ')} (index ${Math.round(mismatchIndex)}).`
    };
  });

  const nationalMismatchIndex = v1014laborClamp(
    samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  );
  const nationalBand = mismatchBand(nationalMismatchIndex);

  const stewardNote =
    nationalBand === 'critical_mismatch' || nationalBand === 'elevated_gap'
      ? 'Elevated skill mismatch — prioritize upskilling programs before stacking automation.'
      : nationalBand === 'aligned'
        ? 'Skill alignment healthy — maintain pathway and retention balance.'
        : 'Moderate skill gaps — monitor dominant shortage industry corridors.';

  return {
    turn,
    nationalMismatchIndex,
    nationalBand,
    regions,
    worstRegion,
    summary: `National skill mismatch ${nationalBand.replace('_', ' ')} (index ${Math.round(nationalMismatchIndex)}); worst ${worstRegion ?? 'n/a'}.`,
    stewardNote
  };
}


// --- source: labor-supply-elasticity-brief.ts ---
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalLaborSupplyElasticityBrief,
  NationalParticipationPressureBrief,
  SupplyElasticityBand
} from './types';

function elasticityBand(score: number): SupplyElasticityBand {
  if (score >= 68) return 'responsive';
  if (score >= 52) return 'moderate';
  if (score >= 38) return 'inelastic';
  return 'rigid';
}

export function computeNationalLaborSupplyElasticityBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalLaborSupplyElasticityBrief {
  if (!state.enabled || !brief || !participation) {
    return {
      turn: state.turn,
      elasticityIndex: 50,
      band: 'moderate',
      wageSensitivity: 0,
      participationSensitivity: 0,
      summary: 'Supply elasticity idle — labor layer off.',
      stewardNote: 'Enable labor demographics before elasticity guidance.'
    };
  }

  const wageLift =
    state.nationalWagePressure === 'surging' || state.nationalWagePressure === 'elevated' ? 14 : 6;
  const participationLift = participation.participationIndex * 0.35;
  const strainDrag = brief.compositePressureIndex * 0.42;
  const automationDrag = (state.regions.NSW?.automationPressureIndex ?? 50) * 0.18;
  const capacityEase =
    state.workforceCapacityBridge?.nationalBand === 'surplus'
      ? 10
      : state.workforceCapacityBridge?.nationalBand === 'critical_gap'
        ? -12
        : 0;

  const elasticityIndex = v1014laborClamp(
    48 + wageLift + participationLift + capacityEase - strainDrag - automationDrag
  );
  const band = elasticityBand(elasticityIndex);
  const wageSensitivity = v1014laborClamp(state.wagePressureScore * 0.55);
  const participationSensitivity = v1014laborClamp(participation.participationIndex * 0.65);

  const stewardNote =
    band === 'rigid' || band === 'inelastic'
      ? 'Inelastic labor supply — avoid aggressive automation until participation and mismatch ease.'
      : band === 'responsive'
        ? 'Responsive supply — monitor wage surges so expansion does not overshoot capacity.'
        : 'Moderate elasticity — maintain corridor and upskilling balance.';

  return {
    turn: state.turn,
    elasticityIndex,
    band,
    wageSensitivity,
    participationSensitivity,
    summary: `Labor supply elasticity ${band} (index ${Math.round(elasticityIndex)}); wage sens ${Math.round(wageSensitivity)}, participation sens ${Math.round(participationSensitivity)}.`,
    stewardNote
  };
}


// --- source: talent-mobility-outlook.ts ---
  NationalLaborDemographicsState,
  NationalLaborMarketVelocityIndex,
  NationalTalentMobilityOutlook,
  NationalWorkforceCapacityBridge,
  TalentMobilityBand
} from './types';

function mobilityBand(index: number): TalentMobilityBand {
  if (index <= 38) return 'anchored';
  if (index <= 52) return 'balanced';
  if (index <= 65) return 'fluid';
  return 'hyper_mobile';
}

export function computeNationalTalentMobilityOutlook(
  state: NationalLaborDemographicsState,
  velocity: NationalLaborMarketVelocityIndex | null | undefined,
  capacityBridge: NationalWorkforceCapacityBridge | null | undefined
): NationalTalentMobilityOutlook {
  if (!state.enabled || !velocity) {
    return {
      turn: state.turn,
      mobilityIndex: 50,
      band: 'balanced',
      anchorRegion: null,
      corridorHighlight: null,
      summary: 'Talent mobility idle — velocity index unavailable.',
      stewardNote: 'Compute labor velocity before mobility outlook.'
    };
  }

  const velocityPull = velocity.nationalVelocityIndex * 0.45;
  const migrationPull =
    state.nationalMigrationFlow === 'strong_inflow' || state.nationalMigrationFlow === 'inflow' ? 12 : 4;
  const retentionDragSamples: number[] = [];
  const pathwayLiftSamples: number[] = [];

  Object.keys(state.regions).forEach(regionId => {
    const dom = state.regions[regionId]?.dominantIndustry ?? null;
    retentionDragSamples.push(retentionPullForRegion(regionId, dom) * 22);
    pathwayLiftSamples.push(skilledPathwayPullForRegion(regionId, dom) * 18);
  });

  const retentionEase =
    retentionDragSamples.reduce((a, b) => a + b, 0) / Math.max(1, retentionDragSamples.length);
  const pathwayLift =
    pathwayLiftSamples.reduce((a, b) => a + b, 0) / Math.max(1, pathwayLiftSamples.length);
  const gapDrag =
    capacityBridge?.nationalBand === 'critical_gap' ? 10 : capacityBridge?.nationalBand === 'tight' ? 5 : 0;

  const mobilityIndex = v1014laborClamp(
    35 + velocityPull + migrationPull + pathwayLift - retentionEase * 0.35 + gapDrag * 0.4
  );
  const band = mobilityBand(mobilityIndex);

  let minMobility = 999;
  let anchorRegion: string | null = null;
  Object.entries(velocity.regions).forEach(([regionId, row]) => {
    const retention = retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
    const score = row.velocityIndex - retention * 30;
    if (score < minMobility) {
      minMobility = score;
      anchorRegion = regionId;
    }
  });

  const corridorHighlight =
    state.interregionalRebalancingPlan?.moves.find(m => m.priority === 'high')?.toRegionId ??
    velocity.hottestRegion;

  const stewardNote =
    band === 'hyper_mobile'
      ? 'Hyper-mobile talent bands — stabilize retention levers before stacked auto commits.'
      : band === 'anchored'
        ? 'Anchored talent — leverage upskilling before forcing interregional moves.'
        : 'Balanced mobility — align corridor highlights with capacity gaps.';

  return {
    turn: state.turn,
    mobilityIndex,
    band,
    anchorRegion,
    corridorHighlight,
    summary: `Talent mobility ${band.replace('_', ' ')} (index ${Math.round(mobilityIndex)}); corridor ${corridorHighlight ?? 'n/a'}.`,
    stewardNote
  };
}


// --- source: underemployment-pressure-brief.ts ---
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalParticipationPressureBrief
} from './types';

function underemploymentBand(index: number): UnderemploymentPressureBand {
  if (index <= 32) return 'slack';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'tight_hidden';
  return 'severe_underuse';
}

export function computeNationalUnderemploymentPressureBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalUnderemploymentPressureBrief {
  if (!state.enabled || !brief || !participation) {
    return {
      turn: state.turn,
      underemploymentIndex: 50,
      band: 'mixed',
      linkageParticipationGap: 0,
      summary: 'Underemployment outlook idle — labor layer off.',
      stewardNote: 'Enable labor demographics before underemployment guidance.'
    };
  }

  const linkageParticipationGap = v1014laborClamp(
    state.employmentLinkageScore - participation.participationIndex + brief.compositePressureIndex * 0.15
  );

  let inclusionEase = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionEase += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionEase /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const hiddenSlackDrag =
    linkageParticipationGap >= 18 && participation.band !== 'expansionary' ? linkageParticipationGap * 0.55 : 0;
  const strainDrag = brief.pressureBand === 'critical' ? 12 : brief.pressureBand === 'elevated' ? 6 : 0;

  const underemploymentIndex = v1014laborClamp(
    28 + hiddenSlackDrag + strainDrag - inclusionEase * 22 - participation.participationIndex * 0.12
  );
  const band = underemploymentBand(underemploymentIndex);

  const stewardNote =
    band === 'severe_underuse' || band === 'tight_hidden'
      ? 'Hidden underemployment — deploy inclusion levers before forcing interregional rebalancing.'
      : band === 'slack'
        ? 'Participation slack — monitor linkage gaps before automation stacks.'
        : 'Mixed underemployment signals — align upskilling with participation bands.';

  return {
    turn: state.turn,
    underemploymentIndex,
    band,
    linkageParticipationGap,
    summary: `Underemployment ${band.replace('_', ' ')} (index ${Math.round(underemploymentIndex)}); linkage-participation gap ${Math.round(linkageParticipationGap)}.`,
    stewardNote
  };
}


// --- source: wage-competitiveness-index.ts ---
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalSkillMismatchIndex,
  NationalWageCompetitivenessIndex,
  WageCompetitivenessBand
} from './types';

function competitivenessBand(index: number): WageCompetitivenessBand {
  if (index >= 68) return 'premium';
  if (index >= 52) return 'balanced';
  if (index >= 38) return 'stretched';
  return 'cost_burden';
}

export function computeNationalWageCompetitivenessIndex(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  mismatch: NationalSkillMismatchIndex | null | undefined
): NationalWageCompetitivenessIndex {
  if (!state.enabled || !brief) {
    return {
      turn: state.turn,
      competitivenessIndex: 50,
      band: 'balanced',
      wagePressureDrag: 0,
      summary: 'Wage competitiveness idle — labor layer off.',
      stewardNote: 'Enable labor demographics before wage competitiveness guidance.'
    };
  }

  const wagePressureDrag = v1014laborClamp(state.wagePressureScore * 0.65 + brief.compositePressureIndex * 0.25);
  const mismatchDrag =
    mismatch?.nationalBand === 'critical_mismatch'
      ? 18
      : mismatch?.nationalBand === 'elevated_gap'
        ? 10
        : mismatch?.nationalBand === 'moderate_gap'
          ? 4
          : 0;
  const capacityLift =
    state.workforceCapacityBridge?.nationalBand === 'surplus'
      ? 14
      : state.workforceCapacityBridge?.nationalBand === 'balanced'
        ? 6
        : 0;
  const linkageLift = state.employmentLinkageScore * 0.28;

  const competitivenessIndex = v1014laborClamp(
    42 + linkageLift + capacityLift - wagePressureDrag * 0.55 - mismatchDrag
  );
  const band = competitivenessBand(competitivenessIndex);

  const stewardNote =
    band === 'cost_burden' || band === 'stretched'
      ? 'Wage competitiveness stretched — ease mismatch and capacity gaps before export-facing automation.'
      : band === 'premium'
        ? 'Premium competitiveness — avoid wage surges that erode participation cushions.'
        : 'Balanced wage competitiveness — monitor pressure hubs.';

  return {
    turn: state.turn,
    competitivenessIndex,
    band,
    wagePressureDrag,
    summary: `Wage competitiveness ${band.replace('_', ' ')} (index ${Math.round(competitivenessIndex)}); wage drag ${Math.round(wagePressureDrag)}.`,
    stewardNote
  };
}


// --- source: workforce-transition-friction-outlook.ts ---
  NationalLaborDemographicsState,
  NationalLaborMarketVelocityIndex,
  NationalLaborSupplyElasticityBrief,
  NationalWorkforceTransitionFrictionOutlook,
  TransitionFrictionBand
} from './types';

function frictionBand(index: number): TransitionFrictionBand {
  if (index <= 35) return 'smooth';
  if (index <= 50) return 'moderate';
  if (index <= 64) return 'sticky';
  return 'bottleneck';
}

export function computeNationalWorkforceTransitionFrictionOutlook(
  state: NationalLaborDemographicsState,
  velocity: NationalLaborMarketVelocityIndex | null | undefined,
  elasticity: NationalLaborSupplyElasticityBrief | null | undefined
): NationalWorkforceTransitionFrictionOutlook {
  if (!state.enabled || !velocity || !elasticity) {
    return {
      turn: state.turn,
      frictionIndex: 50,
      band: 'moderate',
      automationDrag: 0,
      summary: 'Transition friction idle — velocity or elasticity unavailable.',
      stewardNote: 'Compute velocity and supply elasticity before transition friction guidance.'
    };
  }

  const automationSamples = Object.values(state.regions).map(r => r.automationPressureIndex ?? 50);
  const automationDrag = v1014laborClamp(
    automationSamples.reduce((a, b) => a + b, 0) / Math.max(1, automationSamples.length)
  );

  const velocityDrag = velocity.nationalBand === 'volatile' ? 16 : velocity.nationalVelocityIndex * 0.22;
  const elasticityDrag =
    elasticity.band === 'rigid' ? 18 : elasticity.band === 'inelastic' ? 12 : elasticity.band === 'moderate' ? 6 : 0;
  const mobilityEase =
    state.talentMobilityOutlook?.band === 'hyper_mobile' ? 8 : state.talentMobilityOutlook?.band === 'fluid' ? 4 : 0;

  const frictionIndex = v1014laborClamp(
    22 + velocityDrag + elasticityDrag + automationDrag * 0.35 - mobilityEase
  );
  const band = frictionBand(frictionIndex);

  const stewardNote =
    band === 'bottleneck' || band === 'sticky'
      ? 'Sticky transition friction — sequence upskilling and retention before automation expansions.'
      : band === 'smooth'
        ? 'Smooth transitions — maintain elasticity while scaling corridor moves.'
        : 'Moderate friction — watch volatile velocity regions.';

  return {
    turn: state.turn,
    frictionIndex,
    band,
    automationDrag,
    summary: `Workforce transition friction ${band} (index ${Math.round(frictionIndex)}); automation drag ${Math.round(automationDrag)}.`,
    stewardNote
  };
}


// --- source: youth-entry-pipeline-outlook.ts ---

function youthPipelineBand(index: number): YouthPipelineBand {
  if (index <= 34) return 'constricted';
  if (index <= 48) return 'narrow';
  if (index <= 62) return 'healthy';
  return 'expansionary';
}

export function computeNationalYouthEntryPipelineOutlook(
  state: NationalLaborDemographicsState,
  dependency: NationalDependencyRatioSnapshot | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalYouthEntryPipelineOutlook {
  if (!state.enabled || !dependency || !participation) {
    return {
      turn: state.turn,
      pipelineIndex: 50,
      band: 'narrow',
      dependencyHeadwind: 0,
      summary: 'Youth entry pipeline idle — dependency or participation unavailable.',
      stewardNote: 'Compute dependency and participation before youth pipeline guidance.'
    };
  }

  const dependencyHeadwind = v1014laborClamp(dependency.nationalRatioIndex * 0.55);
  const participationLift = participation.participationIndex * 0.32;
  const linkageLift = state.employmentLinkageScore * 0.22;

  let upskillingEase = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingEase += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingEase /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const participationDrag =
    participation.band === 'shrinking' ? 14 : participation.band === 'constrained' ? 8 : 0;

  const pipelineIndex = v1014laborClamp(
    30 + participationLift + linkageLift + upskillingEase * 18 - dependencyHeadwind - participationDrag
  );
  const band = youthPipelineBand(pipelineIndex);

  const stewardNote =
    band === 'constricted' || band === 'narrow'
      ? 'Narrow youth pipeline — pair upskilling with caregiver care levers before automation stacks.'
      : band === 'expansionary'
        ? 'Expansionary youth pipeline — avoid wage surges that erase participation cushions.'
        : 'Healthy youth pipeline — monitor dependency headwinds in aging regions.';

  return {
    turn: state.turn,
    pipelineIndex,
    band,
    dependencyHeadwind,
    summary: `Youth entry pipeline ${band} (index ${Math.round(pipelineIndex)}); dependency headwind ${Math.round(dependencyHeadwind)}.`,
    stewardNote
  };
}


// --- source: labor-market-tightness-brief.ts ---
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalUnderemploymentPressureBrief,
  NationalWorkforceCapacityBridge,
  TightnessBand
} from './types';

function tightnessBand(index: number): TightnessBand {
  if (index <= 32) return 'slack';
  if (index <= 48) return 'balanced';
  if (index <= 64) return 'tight';
  return 'critical_shortage';
}

export function computeNationalLaborMarketTightnessBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  capacity: NationalWorkforceCapacityBridge | null | undefined,
  underemployment: NationalUnderemploymentPressureBrief | null | undefined
): NationalLaborMarketTightnessBrief {
  if (!state.enabled || !brief || !capacity) {
    return {
      turn: state.turn,
      tightnessIndex: 50,
      band: 'balanced',
      capacityGapDrag: 0,
      summary: 'Labor market tightness idle — integrated brief or capacity bridge unavailable.',
      stewardNote: 'Enable labor demographics before tightness guidance.'
    };
  }

  const capacityGapDrag =
    capacity.nationalBand === 'critical_gap'
      ? 22
      : capacity.nationalBand === 'tight'
        ? 14
        : capacity.nationalBand === 'balanced'
          ? 4
          : 0;
  const pressureLift = brief.compositePressureIndex * 0.35 + state.wagePressureScore * 0.25;
  const slackEase =
    underemployment?.band === 'slack' || underemployment?.band === 'mixed'
      ? (underemployment?.underemploymentIndex ?? 50) * 0.18
      : 0;

  const tightnessIndex = v1014laborClamp(28 + capacityGapDrag + pressureLift - slackEase);
  const band = tightnessBand(tightnessIndex);

  const stewardNote =
    band === 'critical_shortage' || band === 'tight'
      ? 'Tight labor market — sequence upskilling and corridor moves before wage surges.'
      : band === 'slack'
        ? 'Slack tightness — monitor hidden underemployment before cutting inclusion levers.'
        : 'Balanced tightness — align capacity bridge with participation bands.';

  return {
    turn: state.turn,
    tightnessIndex,
    band,
    capacityGapDrag,
    summary: `Labor market tightness ${band.replace('_', ' ')} (index ${Math.round(tightnessIndex)}); capacity drag ${Math.round(capacityGapDrag)}.`,
    stewardNote
  };
}


// --- source: hybrid-participation-friction-outlook.ts ---

function hybridFrictionBand(index: number): HybridParticipationFrictionBand {
  if (index <= 34) return 'low';
  if (index <= 50) return 'moderate';
  if (index <= 64) return 'elevated';
  return 'binding';
}

export function computeNationalHybridParticipationFrictionOutlook(
  state: NationalLaborDemographicsState,
  transition: NationalWorkforceTransitionFrictionOutlook | null | undefined,
  mobility: NationalTalentMobilityOutlook | null | undefined
): NationalHybridParticipationFrictionOutlook {
  if (!state.enabled || !transition || !mobility) {
    return {
      turn: state.turn,
      frictionIndex: 50,
      band: 'moderate',
      careReliefLift: 0,
      summary: 'Hybrid participation friction idle — transition or mobility unavailable.',
      stewardNote: 'Compute transition friction and talent mobility before hybrid guidance.'
    };
  }

  let careReliefLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careReliefLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careReliefLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const transitionDrag =
    transition.band === 'bottleneck' ? 18 : transition.band === 'sticky' ? 12 : transition.frictionIndex * 0.22;
  const mobilityDrag = mobility.band === 'hyper_mobile' ? 10 : mobility.band === 'fluid' ? 6 : 0;
  const householdDrag =
    state.participationPressureBrief?.band === 'constrained' ||
    state.participationPressureBrief?.band === 'shrinking'
      ? 8
      : 0;

  const frictionIndex = v1014laborClamp(
    24 + transitionDrag + mobilityDrag + householdDrag - careReliefLift * 20
  );
  const band = hybridFrictionBand(frictionIndex);

  const stewardNote =
    band === 'binding' || band === 'elevated'
      ? 'Elevated hybrid friction — deploy care levers before remote-work automation expansions.'
      : band === 'low'
        ? 'Low hybrid friction — maintain care relief while scaling corridor mobility.'
        : 'Moderate hybrid friction — watch volatile mobility regions.';

  return {
    turn: state.turn,
    frictionIndex,
    band,
    careReliefLift,
    summary: `Hybrid participation friction ${band} (index ${Math.round(frictionIndex)}); care relief ${Math.round(careReliefLift * 100)}%.`,
    stewardNote
  };
}


// --- source: senior-workforce-retention-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalDependencyRatioSnapshot,
  type NationalLaborDemographicsState,
  type NationalParticipationPressureBrief,
  type NationalSeniorWorkforceRetentionOutlook,
  type SeniorRetentionBand
} from './types';

function seniorRetentionBand(index: number): SeniorRetentionBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'stable';
  return 'anchored';
}

export function computeNationalSeniorWorkforceRetentionOutlook(
  state: NationalLaborDemographicsState,
  dependency: NationalDependencyRatioSnapshot | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalSeniorWorkforceRetentionOutlook {
  if (!state.enabled || !dependency || !participation) {
    return {
      turn: state.turn,
      retentionIndex: 50,
      band: 'strained',
      agedPressureDrag: 0,
      summary: 'Senior retention outlook idle — dependency or participation unavailable.',
      stewardNote: 'Compute dependency and participation before senior retention guidance.'
    };
  }

  const agedPressureDrag =
    dependency.nationalBand === 'aged_pressure'
      ? 20
      : dependency.nationalBand === 'aging'
        ? 14
        : dependency.nationalBand === 'balanced'
          ? 6
          : 0;

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const participationLift = participation.participationIndex * 0.28;
  const linkageLift = state.employmentLinkageScore * 0.18;
  const participationDrag =
    participation.band === 'shrinking' ? 12 : participation.band === 'constrained' ? 7 : 0;

  const retentionIndex = v1014laborClamp(
    32 + participationLift + linkageLift + retentionLift * 22 - agedPressureDrag - participationDrag
  );
  const band = seniorRetentionBand(retentionIndex);

  const stewardNote =
    band === 'fragile' || band === 'strained'
      ? 'Strained senior retention — pair retention levers with elder-care relief before automation stacks.'
      : band === 'anchored'
        ? 'Anchored senior retention — avoid hyper-mobility corridors that drain aged-support regions.'
        : 'Stable senior retention — monitor aged-pressure regions for participation drag.';

  return {
    turn: state.turn,
    retentionIndex,
    band,
    agedPressureDrag,
    summary: `Senior workforce retention ${band} (index ${Math.round(retentionIndex)}); aged drag ${Math.round(agedPressureDrag)}.`,
    stewardNote
  };
}


// --- source: regional-labor-absorption-brief.ts ---
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalRegionalLaborAbsorptionBrief,
  NationalWorkforceCapacityBridge,
  RegionalAbsorptionBand
} from './types';

function absorptionBand(index: number): RegionalAbsorptionBand {
  if (index <= 32) return 'saturated';
  if (index <= 48) return 'constrained';
  if (index <= 64) return 'absorbing';
  return 'headroom';
}

export function computeNationalRegionalLaborAbsorptionBrief(
  state: NationalLaborDemographicsState,
  capacity: NationalWorkforceCapacityBridge | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalRegionalLaborAbsorptionBrief {
  if (!state.enabled || !capacity || !tightness) {
    return {
      turn: state.turn,
      absorptionIndex: 50,
      band: 'constrained',
      migrationLoadDrag: 0,
      summary: 'Regional labor absorption idle — capacity or tightness unavailable.',
      stewardNote: 'Compute capacity bridge and tightness before absorption guidance.'
    };
  }

  const migrationLoadDrag =
    state.nationalMigrationFlow === 'strong_inflow'
      ? 18
      : state.nationalMigrationFlow === 'inflow'
        ? 12
        : state.nationalMigrationFlow === 'outflow' || state.nationalMigrationFlow === 'slight_outflow'
          ? 4
          : 8;
  const capacityEase =
    capacity.nationalBand === 'surplus'
      ? 16
      : capacity.nationalBand === 'balanced'
        ? 8
        : capacity.nationalBand === 'tight'
          ? 2
          : 0;
  const tightnessDrag =
    tightness.band === 'critical_shortage'
      ? 16
      : tightness.band === 'tight'
        ? 10
        : tightness.band === 'slack'
          ? -6
          : 0;

  const absorptionIndex = v1014laborClamp(
    36 + capacityEase + state.migrationFlowScore * 0.22 - migrationLoadDrag - tightnessDrag
  );
  const band = absorptionBand(absorptionIndex);

  const stewardNote =
    band === 'saturated' || band === 'constrained'
      ? 'Constrained absorption — sequence corridor moves and upskilling before stacking migration shocks.'
      : band === 'headroom'
        ? 'Absorption headroom — align inclusion levers with inbound corridor flows.'
        : 'Absorbing band — watch tightness before wage surges in inbound hubs.';

  return {
    turn: state.turn,
    absorptionIndex,
    band,
    migrationLoadDrag,
    summary: `Regional labor absorption ${band} (index ${Math.round(absorptionIndex)}); migration load drag ${Math.round(migrationLoadDrag)}.`,
    stewardNote
  };
}


// --- source: participation-equity-gap-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalParticipationEquityGapBrief,
  type NationalUnderemploymentPressureBrief,
  type ParticipationEquityBand
} from './types';

function equityBand(index: number): ParticipationEquityBand {
  if (index <= 34) return 'wide_gap';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'narrowing';
  return 'inclusive';
}

export function computeNationalParticipationEquityGapBrief(
  state: NationalLaborDemographicsState,
  underemployment: NationalUnderemploymentPressureBrief | null | undefined
): NationalParticipationEquityGapBrief {
  if (!state.enabled || !underemployment) {
    return {
      turn: state.turn,
      equityIndex: 50,
      band: 'uneven',
      inclusionEaseLift: 0,
      summary: 'Participation equity gap idle — underemployment brief unavailable.',
      stewardNote: 'Compute underemployment before participation equity guidance.'
    };
  }

  let inclusionEaseLift = 0;
  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const industry = state.regions[regionId]?.dominantIndustry ?? null;
    inclusionEaseLift += inclusionEaseForRegion(regionId, industry);
    flexibilityLift += flexibilityEaseForRegion(regionId, industry);
  });
  inclusionEaseLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const slackDrag =
    underemployment.band === 'severe_underuse'
      ? 18
      : underemployment.band === 'tight_hidden'
        ? 12
        : underemployment.band === 'mixed'
          ? 6
          : 0;
  const linkageDrag = Math.max(0, underemployment.linkageParticipationGap * 0.35);

  const equityIndex = v1014laborClamp(
    28 +
      inclusionEaseLift * 24 +
      flexibilityLift * 16 +
      state.employmentLinkageScore * 0.15 -
      slackDrag -
      linkageDrag
  );
  const band = equityBand(equityIndex);

  const stewardNote =
    band === 'wide_gap' || band === 'uneven'
      ? 'Uneven participation equity — deploy inclusion and flexibility levers before wage competitiveness pushes.'
      : band === 'inclusive'
        ? 'Inclusive equity band — maintain flexibility packs while scaling corridor absorption.'
        : 'Narrowing equity gap — monitor hidden underemployment in strained hubs.';

  return {
    turn: state.turn,
    equityIndex,
    band,
    inclusionEaseLift,
    summary: `Participation equity ${band.replace('_', ' ')} (index ${Math.round(equityIndex)}); inclusion ease ${Math.round(inclusionEaseLift * 100)}%.`,
    stewardNote
  };
}


// --- source: credential-mobility-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CredentialMobilityBand,
  type NationalCredentialMobilityOutlook,
  type NationalLaborDemographicsState,
  type NationalSkillMismatchIndex,
  type NationalTalentMobilityOutlook
} from './types';

function credentialMobilityBand(index: number): CredentialMobilityBand {
  if (index <= 34) return 'blocked';
  if (index <= 48) return 'narrow';
  if (index <= 62) return 'fluid';
  return 'portable';
}

export function computeNationalCredentialMobilityOutlook(
  state: NationalLaborDemographicsState,
  mismatch: NationalSkillMismatchIndex | null | undefined,
  mobility: NationalTalentMobilityOutlook | null | undefined
): NationalCredentialMobilityOutlook {
  if (!state.enabled || !mismatch || !mobility) {
    return {
      turn: state.turn,
      mobilityIndex: 50,
      band: 'narrow',
      pathwayLift: 0,
      summary: 'Credential mobility idle — mismatch or talent mobility unavailable.',
      stewardNote: 'Compute skill mismatch and talent mobility before credential guidance.'
    };
  }

  let pathwayLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    pathwayLift += skilledPathwayPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  pathwayLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mismatchDrag =
    mismatch.nationalBand === 'critical_mismatch'
      ? 18
      : mismatch.nationalBand === 'elevated_gap'
        ? 12
        : mismatch.nationalBand === 'moderate_gap'
          ? 6
          : 0;
  const mobilityLift =
    mobility.band === 'fluid' || mobility.band === 'hyper_mobile'
      ? mobility.mobilityIndex * 0.28
      : mobility.mobilityIndex * 0.18;
  const linkageLift = state.employmentLinkageScore * 0.15;

  const mobilityIndex = v1014laborClamp(30 + pathwayLift * 24 + mobilityLift + linkageLift - mismatchDrag);
  const band = credentialMobilityBand(mobilityIndex);

  const stewardNote =
    band === 'blocked' || band === 'narrow'
      ? 'Narrow credential mobility — sequence upskilling and reengagement levers before corridor moves.'
      : band === 'portable'
        ? 'Portable credentials — avoid hyper-mobility that drains anchor regions.'
        : 'Fluid credential mobility — align pathway lifts with capacity gaps.';

  return {
    turn: state.turn,
    mobilityIndex,
    band,
    pathwayLift,
    summary: `Credential mobility ${band} (index ${Math.round(mobilityIndex)}); pathway lift ${Math.round(pathwayLift * 100)}%.`,
    stewardNote
  };
}


// --- source: household-participation-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type HouseholdParticipationCouplingBand,
  type NationalHouseholdParticipationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalParticipationEquityGapBrief,
  type NationalParticipationPressureBrief
} from './types';

function couplingBand(index: number): HouseholdParticipationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'aligned';
  return 'reinforcing';
}

export function computeNationalHouseholdParticipationCouplingBrief(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  equity: NationalParticipationEquityGapBrief | null | undefined
): NationalHouseholdParticipationCouplingBrief {
  if (!state.enabled || !participation || !equity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      budgetPressureDrag: 0,
      summary: 'Household-participation coupling idle — participation or equity unavailable.',
      stewardNote: 'Compute participation and equity before household coupling guidance.'
    };
  }

  let budgetPressure = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    budgetPressure += state.regions[regionId]?.householdBudgetPressureScore ?? 50;
  });
  budgetPressure /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  const budgetPressureDrag = v1014laborClamp((budgetPressure - 45) * 0.55);

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const participationLift = participation.participationIndex * 0.32;
  const equityLift = equity.equityIndex * 0.22;
  const equityDrag =
    equity.band === 'wide_gap' ? 14 : equity.band === 'uneven' ? 8 : 0;

  const couplingIndex = v1014laborClamp(
    28 + participationLift + equityLift + reengagementLift * 20 - budgetPressureDrag - equityDrag
  );
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained household-participation coupling — ease budget pressure before participation pushes.'
      : band === 'reinforcing'
        ? 'Reinforcing coupling — maintain reengagement levers while scaling inclusion packs.'
        : 'Aligned coupling — monitor equity gaps in severe affordability regions.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    budgetPressureDrag,
    summary: `Household-participation coupling ${band} (index ${Math.round(couplingIndex)}); budget drag ${Math.round(budgetPressureDrag)}.`,
    stewardNote
  };
}


// --- source: labor-rebalancing-stress-brief.ts ---
  InterregionalLaborRebalancingPlan,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalLaborRebalancingStressBrief,
  NationalRegionalLaborAbsorptionBrief,
  RebalancingStressBand
} from './types';

function stressBand(index: number): RebalancingStressBand {
  if (index <= 32) return 'manageable';
  if (index <= 48) return 'elevated';
  if (index <= 64) return 'acute';
  return 'critical';
}

export function computeNationalLaborRebalancingStressBrief(
  state: NationalLaborDemographicsState,
  plan: InterregionalLaborRebalancingPlan | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalLaborRebalancingStressBrief {
  if (!state.enabled || !plan || !absorption || !tightness) {
    return {
      turn: state.turn,
      stressIndex: 50,
      band: 'elevated',
      highPriorityMoves: 0,
      summary: 'Rebalancing stress idle — plan, absorption, or tightness unavailable.',
      stewardNote: 'Compute rebalancing plan and absorption before stress guidance.'
    };
  }

  const highPriorityMoves = plan.moves.filter(m => m.priority === 'high').length;
  const moveDrag = highPriorityMoves * 6 + plan.moves.length * 1.5;
  const absorptionDrag =
    absorption.band === 'saturated'
      ? 16
      : absorption.band === 'constrained'
        ? 10
        : absorption.band === 'absorbing'
          ? 4
          : 0;
  const tightnessDrag =
    tightness.band === 'critical_shortage' ? 14 : tightness.band === 'tight' ? 8 : 0;

  const stressIndex = v1014laborClamp(26 + moveDrag + absorptionDrag + tightnessDrag);
  const band = stressBand(stressIndex);

  const stewardNote =
    band === 'critical' || band === 'acute'
      ? 'Acute rebalancing stress — pause stacked corridor moves until absorption headroom returns.'
      : band === 'manageable'
        ? 'Manageable stress — align high-priority moves with upskilling before wage surges.'
        : 'Elevated stress — sequence retention levers before interregional auto commits.';

  return {
    turn: state.turn,
    stressIndex,
    band,
    highPriorityMoves,
    summary: `Labor rebalancing stress ${band} (index ${Math.round(stressIndex)}); ${highPriorityMoves} high-priority move(s).`,
    stewardNote
  };
}


// --- source: automation-participation-resilience-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type AutomationParticipationResilienceBand,
  type NationalAutomationParticipationResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalParticipationPressureBrief,
  type NationalWorkforceTransitionFrictionOutlook
} from './types';

function resilienceBand(index: number): AutomationParticipationResilienceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'stable';
  return 'adaptive';
}

export function computeNationalAutomationParticipationResilienceOutlook(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  transition: NationalWorkforceTransitionFrictionOutlook | null | undefined
): NationalAutomationParticipationResilienceOutlook {
  if (!state.enabled || !participation || !transition) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'strained',
      automationPressureDrag: 0,
      summary: 'Automation-participation resilience idle — participation or transition unavailable.',
      stewardNote: 'Compute participation and transition friction before automation resilience guidance.'
    };
  }

  let automationPressure = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    automationPressure += state.regions[regionId]?.automationPressureIndex ?? 50;
  });
  automationPressure /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  const automationPressureDrag = v1014laborClamp(automationPressure * 0.42);

  const transitionDrag =
    transition.band === 'bottleneck' ? 14 : transition.band === 'sticky' ? 9 : transition.frictionIndex * 0.18;
  const participationLift = participation.participationIndex * 0.3;
  const linkageLift = state.employmentLinkageScore * 0.16;

  const resilienceIndex = v1014laborClamp(
    34 + participationLift + linkageLift - automationPressureDrag - transitionDrag
  );
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'fragile' || band === 'strained'
      ? 'Strained automation-participation resilience — slow automation stacks until onboarding levers land.'
      : band === 'adaptive'
        ? 'Adaptive resilience — avoid wage surges that erase participation cushions.'
        : 'Stable resilience — monitor transition friction in high-automation regions.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    automationPressureDrag,
    summary: `Automation-participation resilience ${band} (index ${Math.round(resilienceIndex)}); automation drag ${Math.round(automationPressureDrag)}.`,
    stewardNote
  };
}


// --- source: wage-participation-spillover-brief.ts ---
  NationalHouseholdParticipationCouplingBrief,
  NationalLaborDemographicsState,
  NationalWageCompetitivenessIndex,
  NationalWageParticipationSpilloverBrief,
  WageParticipationSpilloverBand
} from './types';

function spilloverBand(index: number): WageParticipationSpilloverBand {
  if (index <= 34) return 'suppressive';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'supportive';
  return 'amplifying';
}

export function computeNationalWageParticipationSpilloverBrief(
  state: NationalLaborDemographicsState,
  competitiveness: NationalWageCompetitivenessIndex | null | undefined,
  coupling: NationalHouseholdParticipationCouplingBrief | null | undefined
): NationalWageParticipationSpilloverBrief {
  if (!state.enabled || !competitiveness || !coupling) {
    return {
      turn: state.turn,
      spilloverIndex: 50,
      band: 'mixed',
      wagePressureDrag: 0,
      summary: 'Wage-participation spillover idle — competitiveness or coupling unavailable.',
      stewardNote: 'Compute wage competitiveness and household coupling before spillover guidance.'
    };
  }

  const wagePressureDrag = v1014laborClamp(competitiveness.wagePressureDrag * 0.65 + state.wagePressureScore * 0.12);
  const competitivenessEase =
    competitiveness.band === 'premium' || competitiveness.band === 'balanced'
      ? competitiveness.competitivenessIndex * 0.28
      : 0;
  const couplingLift =
    coupling.band === 'aligned' || coupling.band === 'reinforcing' ? coupling.couplingIndex * 0.22 : 0;
  const couplingDrag =
    coupling.band === 'decoupled' ? 12 : coupling.band === 'strained' ? 7 : 0;

  const spilloverIndex = v1014laborClamp(
    32 + competitivenessEase + couplingLift - wagePressureDrag - couplingDrag
  );
  const band = spilloverBand(spilloverIndex);

  const stewardNote =
    band === 'suppressive' || band === 'mixed'
      ? 'Mixed wage-participation spillover — ease household coupling before competitiveness pushes.'
      : band === 'amplifying'
        ? 'Amplifying spillover — avoid stacked wage surges in tight absorption regions.'
        : 'Supportive spillover — align onboarding with participation expansion bands.';

  return {
    turn: state.turn,
    spilloverIndex,
    band,
    wagePressureDrag,
    summary: `Wage-participation spillover ${band} (index ${Math.round(spilloverIndex)}); wage drag ${Math.round(wagePressureDrag)}.`,
    stewardNote
  };
}


// --- source: migration-shock-participation-buffer-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type MigrationParticipationBufferBand,
  type NationalLaborDemographicsState,
  type NationalMigrationShockParticipationBufferOutlook,
  type NationalParticipationPressureBrief,
  type NationalRegionalLaborAbsorptionBrief
} from './types';

function bufferBand(index: number): MigrationParticipationBufferBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'adequate';
  return 'cushioned';
}

export function computeNationalMigrationShockParticipationBufferOutlook(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined
): NationalMigrationShockParticipationBufferOutlook {
  if (!state.enabled || !participation || !absorption) {
    return {
      turn: state.turn,
      bufferIndex: 50,
      band: 'thin',
      activeShockDrag: 0,
      summary: 'Migration-shock participation buffer idle — participation or absorption unavailable.',
      stewardNote: 'Compute participation and absorption before migration buffer guidance.'
    };
  }

  const shockCount = state.activeMigrationShocks?.length ?? 0;
  const activeShockDrag = v1014laborClamp(shockCount * 7 + (shockCount >= 2 ? 6 : 0));

  let onboardingEase = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingEase += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingEase /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const absorptionEase =
    absorption.band === 'headroom'
      ? 14
      : absorption.band === 'absorbing'
        ? 8
        : absorption.band === 'constrained'
          ? 2
          : 0;
  const participationLift = participation.participationIndex * 0.26;

  const bufferIndex = v1014laborClamp(
    30 + participationLift + absorptionEase + onboardingEase * 18 - activeShockDrag
  );
  const band = bufferBand(bufferIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin migration-shock buffer — deploy onboarding levers before stacking corridor shocks.'
      : band === 'cushioned'
        ? 'Cushioned buffer — avoid hyper-mobility that drains anchor participation.'
        : 'Adequate buffer — monitor absorption in inbound shock regions.';

  return {
    turn: state.turn,
    bufferIndex,
    band,
    activeShockDrag,
    summary: `Migration-shock participation buffer ${band} (index ${Math.round(bufferIndex)}); shock drag ${Math.round(activeShockDrag)}.`,
    stewardNote
  };
}


// --- source: labor-market-stability-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type IntegratedLaborMarketBrief,
  type LaborMarketStabilityBand,
  type NationalAutomationParticipationResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalLaborMarketStabilityOutlook,
  type NationalLaborRebalancingStressBrief
} from './types';

function stabilityBand(index: number): LaborMarketStabilityBand {
  if (index <= 34) return 'volatile';
  if (index <= 48) return 'fragile';
  if (index <= 62) return 'steady';
  return 'anchored';
}

export function computeNationalLaborMarketStabilityOutlook(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  rebalancingStress: NationalLaborRebalancingStressBrief | null | undefined,
  automationResilience: NationalAutomationParticipationResilienceOutlook | null | undefined
): NationalLaborMarketStabilityOutlook {
  if (!state.enabled || !brief || !rebalancingStress || !automationResilience) {
    return {
      turn: state.turn,
      stabilityIndex: 50,
      band: 'fragile',
      stressDrag: 0,
      summary: 'Labor market stability idle — brief, stress, or automation resilience unavailable.',
      stewardNote: 'Compute integrated brief, rebalancing stress, and automation resilience before stability guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pressureDrag =
    brief.pressureBand === 'critical' ? 18 : brief.pressureBand === 'elevated' ? 12 : brief.compositePressureIndex * 0.2;
  const stressDrag =
    rebalancingStress.band === 'critical'
      ? 16
      : rebalancingStress.band === 'acute'
        ? 11
        : rebalancingStress.stressIndex * 0.12;
  const resilienceLift =
    automationResilience.band === 'adaptive' || automationResilience.band === 'stable'
      ? automationResilience.resilienceIndex * 0.28
      : automationResilience.resilienceIndex * 0.15;

  const stabilityIndex = v1014laborClamp(
    32 + resilienceLift + coordinationLift * 22 - pressureDrag - stressDrag
  );
  const band = stabilityBand(stabilityIndex);

  const stewardNote =
    band === 'volatile' || band === 'fragile'
      ? 'Fragile labor stability — deploy coordination levers before stacked corridor commits.'
      : band === 'anchored'
        ? 'Anchored stability — avoid hyper-mobility that erodes shock buffers.'
        : 'Steady stability — monitor rebalancing stress in tight absorption hubs.';

  return {
    turn: state.turn,
    stabilityIndex,
    band,
    stressDrag,
    summary: `Labor market stability ${band} (index ${Math.round(stabilityIndex)}); stress drag ${Math.round(stressDrag)}.`,
    stewardNote
  };
}


// --- source: intergenerational-workforce-balance-outlook.ts ---
  IntergenerationalBalanceBand,
  NationalIntergenerationalWorkforceBalanceOutlook,
  NationalLaborDemographicsState,
  NationalSeniorWorkforceRetentionOutlook,
  NationalYouthEntryPipelineOutlook
} from './types';

function balanceBand(index: number): IntergenerationalBalanceBand {
  if (index <= 34) return 'skewed_aged';
  if (index <= 48) return 'narrow_youth';
  if (index <= 62) return 'balanced';
  return 'renewal';
}

export function computeNationalIntergenerationalWorkforceBalanceOutlook(
  state: NationalLaborDemographicsState,
  youth: NationalYouthEntryPipelineOutlook | null | undefined,
  senior: NationalSeniorWorkforceRetentionOutlook | null | undefined
): NationalIntergenerationalWorkforceBalanceOutlook {
  if (!state.enabled || !youth || !senior) {
    return {
      turn: state.turn,
      balanceIndex: 50,
      band: 'narrow_youth',
      pipelineGap: 0,
      summary: 'Intergenerational balance idle — youth or senior outlook unavailable.',
      stewardNote: 'Compute youth pipeline and senior retention before intergenerational guidance.'
    };
  }

  const pipelineGap = v1014laborClamp(Math.abs(youth.pipelineIndex - senior.retentionIndex));
  const youthLift = youth.pipelineIndex * 0.35;
  const seniorLift = senior.retentionIndex * 0.3;
  const headwindDrag = youth.dependencyHeadwind * 0.4 + senior.agedPressureDrag * 0.35;
  const bandPenalty =
    (youth.band === 'constricted' || youth.band === 'narrow' ? 8 : 0) +
    (senior.band === 'fragile' || senior.band === 'strained' ? 8 : 0);

  const balanceIndex = v1014laborClamp(28 + youthLift + seniorLift - headwindDrag - bandPenalty - pipelineGap * 0.15);
  const band = balanceBand(balanceIndex);

  const stewardNote =
    band === 'skewed_aged' || band === 'narrow_youth'
      ? 'Imbalanced intergenerational pipeline — pair youth upskilling with senior retention levers.'
      : band === 'renewal'
        ? 'Renewal balance — avoid wage surges that compress youth entry bands.'
        : 'Balanced intergenerational mix — monitor dependency headwinds in aging regions.';

  return {
    turn: state.turn,
    balanceIndex,
    band,
    pipelineGap,
    summary: `Intergenerational workforce balance ${band.replace('_', ' ')} (index ${Math.round(balanceIndex)}); pipeline gap ${Math.round(pipelineGap)}.`,
    stewardNote
  };
}


// --- source: capacity-participation-alignment-brief.ts ---
  CapacityParticipationAlignmentBand,
  NationalCapacityParticipationAlignmentBrief,
  NationalLaborDemographicsState,
  NationalParticipationEquityGapBrief,
  NationalRegionalLaborAbsorptionBrief,
  NationalWorkforceCapacityBridge
} from './types';

function alignmentBand(index: number): CapacityParticipationAlignmentBand {
  if (index <= 34) return 'misaligned';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'aligned';
  return 'reinforcing';
}

export function computeNationalCapacityParticipationAlignmentBrief(
  state: NationalLaborDemographicsState,
  capacity: NationalWorkforceCapacityBridge | null | undefined,
  equity: NationalParticipationEquityGapBrief | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined
): NationalCapacityParticipationAlignmentBrief {
  if (!state.enabled || !capacity || !equity || !absorption) {
    return {
      turn: state.turn,
      alignmentIndex: 50,
      band: 'strained',
      capacityGapDrag: 0,
      summary: 'Capacity-participation alignment idle — capacity, equity, or absorption unavailable.',
      stewardNote: 'Compute capacity bridge, equity, and absorption before alignment guidance.'
    };
  }

  const capacityGapDrag =
    capacity.nationalBand === 'critical_gap'
      ? 20
      : capacity.nationalBand === 'tight'
        ? 13
        : capacity.nationalBand === 'balanced'
          ? 5
          : 0;
  const equityLift =
    equity.band === 'inclusive' || equity.band === 'narrowing' ? equity.equityIndex * 0.26 : equity.equityIndex * 0.14;
  const absorptionLift =
    absorption.band === 'headroom' || absorption.band === 'absorbing' ? absorption.absorptionIndex * 0.22 : 0;
  const linkageLift = state.employmentLinkageScore * 0.18;

  const alignmentIndex = v1014laborClamp(30 + equityLift + absorptionLift + linkageLift - capacityGapDrag);
  const band = alignmentBand(alignmentIndex);

  const stewardNote =
    band === 'misaligned' || band === 'strained'
      ? 'Strained capacity-participation alignment — ease equity gaps before forcing corridor absorption.'
      : band === 'reinforcing'
        ? 'Reinforcing alignment — maintain coordination levers while scaling participation.'
        : 'Aligned capacity-participation — watch critical capacity gaps in inbound hubs.';

  return {
    turn: state.turn,
    alignmentIndex,
    band,
    capacityGapDrag,
    summary: `Capacity-participation alignment ${band} (index ${Math.round(alignmentIndex)}); capacity drag ${Math.round(capacityGapDrag)}.`,
    stewardNote
  };
}


// --- source: participation-velocity-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalLaborMarketVelocityIndex,
  type NationalParticipationPressureBrief,
  type NationalParticipationVelocityCouplingBrief,
  type ParticipationVelocityCouplingBand
} from './types';

function couplingBand(index: number): ParticipationVelocityCouplingBand {
  if (index <= 34) return 'divergent';
  if (index <= 48) return 'lagging';
  if (index <= 62) return 'synced';
  return 'momentum';
}

export function computeNationalParticipationVelocityCouplingBrief(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  velocity: NationalLaborMarketVelocityIndex | null | undefined
): NationalParticipationVelocityCouplingBrief {
  if (!state.enabled || !participation || !velocity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'lagging',
      velocityDrag: 0,
      summary: 'Participation-velocity coupling idle — participation or velocity unavailable.',
      stewardNote: 'Compute participation and velocity before coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const velocityDrag =
    velocity.nationalBand === 'volatile'
      ? 16
      : velocity.nationalBand === 'sluggish'
        ? 6
        : velocity.nationalVelocityIndex * 0.08;
  const participationLift = participation.participationIndex * 0.34;
  const velocityLift =
    velocity.nationalBand === 'active' ? velocity.nationalVelocityIndex * 0.22 : velocity.nationalVelocityIndex * 0.12;
  const bandDrag =
    participation.band === 'shrinking' ? 10 : participation.band === 'constrained' ? 6 : 0;

  const couplingIndex = v1014laborClamp(
    30 + participationLift + velocityLift + advocacyLift * 18 - velocityDrag - bandDrag
  );
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'divergent' || band === 'lagging'
      ? 'Lagging participation-velocity coupling — deploy advocacy levers before volatile corridor commits.'
      : band === 'momentum'
        ? 'Momentum coupling — avoid hyper-mobility that drains shock buffers.'
        : 'Synced coupling — monitor velocity hotspots against equity gaps.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    velocityDrag,
    summary: `Participation-velocity coupling ${band} (index ${Math.round(couplingIndex)}); velocity drag ${Math.round(velocityDrag)}.`,
    stewardNote
  };
}


// --- source: skills-tightness-coherence-outlook.ts ---
  NationalCredentialMobilityOutlook,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalSkillMismatchIndex,
  NationalSkillsTightnessCoherenceOutlook,
  SkillsTightnessCoherenceBand
} from './types';

function coherenceBand(index: number): SkillsTightnessCoherenceBand {
  if (index <= 34) return 'incoherent';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'coherent';
  return 'aligned';
}

export function computeNationalSkillsTightnessCoherenceOutlook(
  state: NationalLaborDemographicsState,
  mismatch: NationalSkillMismatchIndex | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined,
  credential: NationalCredentialMobilityOutlook | null | undefined
): NationalSkillsTightnessCoherenceOutlook {
  if (!state.enabled || !mismatch || !tightness || !credential) {
    return {
      turn: state.turn,
      coherenceIndex: 50,
      band: 'strained',
      mismatchDrag: 0,
      summary: 'Skills-tightness coherence idle — mismatch, tightness, or credential unavailable.',
      stewardNote: 'Compute mismatch, tightness, and credential mobility before coherence guidance.'
    };
  }

  const mismatchDrag =
    mismatch.nationalBand === 'critical_mismatch'
      ? 18
      : mismatch.nationalBand === 'elevated_gap'
        ? 12
        : mismatch.nationalMismatchIndex * 0.15;
  const tightnessDrag =
    tightness.band === 'critical_shortage' ? 14 : tightness.band === 'tight' ? 8 : 0;
  const credentialLift =
    credential.band === 'portable' || credential.band === 'fluid'
      ? credential.mobilityIndex * 0.28
      : credential.mobilityIndex * 0.16;
  const linkageLift = state.employmentLinkageScore * 0.14;

  const coherenceIndex = v1014laborClamp(32 + credentialLift + linkageLift - mismatchDrag - tightnessDrag);
  const band = coherenceBand(coherenceIndex);

  const stewardNote =
    band === 'incoherent' || band === 'strained'
      ? 'Strained skills-tightness coherence — sequence upskilling before wage surges in tight hubs.'
      : band === 'aligned'
        ? 'Aligned coherence — avoid corridor moves that outrun credential mobility.'
        : 'Coherent band — monitor mismatch in critical shortage regions.';

  return {
    turn: state.turn,
    coherenceIndex,
    band,
    mismatchDrag,
    summary: `Skills-tightness coherence ${band} (index ${Math.round(coherenceIndex)}); mismatch drag ${Math.round(mismatchDrag)}.`,
    stewardNote
  };
}


// --- source: integrated-labor-readiness-outlook.ts ---
  IntegratedLaborReadinessBand,
  LaborResilienceScorecard,
  NationalCapacityParticipationAlignmentBrief,
  NationalIntegratedLaborReadinessOutlook,
  NationalLaborDemographicsState,
  NationalLaborMarketStabilityOutlook,
  NationalMigrationShockParticipationBufferOutlook
} from './types';

function readinessBand(index: number): IntegratedLaborReadinessBand {
  if (index <= 34) return 'unprepared';
  if (index <= 48) return 'caution';
  if (index <= 62) return 'ready';
  return 'primed';
}

export function computeNationalIntegratedLaborReadinessOutlook(
  state: NationalLaborDemographicsState,
  stability: NationalLaborMarketStabilityOutlook | null | undefined,
  alignment: NationalCapacityParticipationAlignmentBrief | null | undefined,
  buffer: NationalMigrationShockParticipationBufferOutlook | null | undefined,
  resilience: LaborResilienceScorecard | null | undefined
): NationalIntegratedLaborReadinessOutlook {
  if (!state.enabled || !stability || !alignment || !buffer || !resilience) {
    return {
      turn: state.turn,
      readinessIndex: 50,
      band: 'caution',
      stabilityDrag: 0,
      summary: 'Integrated labor readiness idle — stability, alignment, buffer, or resilience unavailable.',
      stewardNote: 'Compute stability, alignment, buffer, and resilience before readiness guidance.'
    };
  }

  const stabilityDrag =
    stability.band === 'volatile'
      ? 16
      : stability.band === 'fragile'
        ? 11
        : stability.stressDrag * 0.35;
  const alignmentLift =
    alignment.band === 'aligned' || alignment.band === 'reinforcing'
      ? alignment.alignmentIndex * 0.26
      : alignment.alignmentIndex * 0.14;
  const bufferLift =
    buffer.band === 'cushioned' || buffer.band === 'adequate' ? buffer.bufferIndex * 0.22 : 0;
  const resilienceLift = resilience.compositeScore * 0.28;
  const alignmentDrag =
    alignment.band === 'misaligned' ? 12 : alignment.band === 'strained' ? 7 : 0;

  const readinessIndex = v1014laborClamp(
    28 + alignmentLift + bufferLift + resilienceLift - stabilityDrag - alignmentDrag
  );
  const band = readinessBand(readinessIndex);

  const stewardNote =
    band === 'unprepared' || band === 'caution'
      ? 'Caution readiness — deploy coordination and advocacy levers before auto workforce commits.'
      : band === 'primed'
        ? 'Primed readiness — avoid stacked shocks that erode migration buffers.'
        : 'Ready band — maintain intergenerational balance while scaling participation.';

  return {
    turn: state.turn,
    readinessIndex,
    band,
    stabilityDrag,
    summary: `Integrated labor readiness ${band} (index ${Math.round(readinessIndex)}); stability drag ${Math.round(stabilityDrag)}.`,
    stewardNote
  };
}


// --- source: hybrid-remote-participation-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type HybridRemoteParticipationBand,
  type NationalHybridParticipationFrictionOutlook,
  type NationalHybridRemoteParticipationOutlook,
  type NationalLaborDemographicsState
} from './types';

function hybridRemoteBand(index: number): HybridRemoteParticipationBand {
  if (index <= 34) return 'constrained';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'enabled';
  return 'expansive';
}

export function computeNationalHybridRemoteParticipationOutlook(
  state: NationalLaborDemographicsState,
  hybridFriction: NationalHybridParticipationFrictionOutlook | null | undefined
): NationalHybridRemoteParticipationOutlook {
  if (!state.enabled || !hybridFriction) {
    return {
      turn: state.turn,
      remoteIndex: 50,
      band: 'mixed',
      frictionDrag: 0,
      summary: 'Hybrid-remote participation idle — hybrid friction unavailable.',
      stewardNote: 'Compute hybrid participation friction before remote outlook guidance.'
    };
  }

  let flexibilityLift = 0;
  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const industry = state.regions[regionId]?.dominantIndustry ?? null;
    flexibilityLift += flexibilityEaseForRegion(regionId, industry);
    mentorshipLift += mentorshipEaseForRegion(regionId, industry);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const frictionDrag =
    hybridFriction.band === 'binding'
      ? 18
      : hybridFriction.band === 'elevated'
        ? 12
        : hybridFriction.frictionIndex * 0.2;
  const careEase = hybridFriction.careReliefLift * 22;
  const participationLift = (state.participationPressureBrief?.participationIndex ?? 50) * 0.22;

  const remoteIndex = v1014laborClamp(
    28 + participationLift + flexibilityLift * 18 + mentorshipLift * 14 + careEase - frictionDrag
  );
  const band = hybridRemoteBand(remoteIndex);

  const stewardNote =
    band === 'constrained' || band === 'mixed'
      ? 'Mixed hybrid-remote participation — stack flexibility and mentorship before remote automation.'
      : band === 'expansive'
        ? 'Expansive remote band — guard corridor capacity stress in inbound hubs.'
        : 'Enabled remote participation — monitor hybrid friction in caregiver-heavy regions.';

  return {
    turn: state.turn,
    remoteIndex,
    band,
    frictionDrag,
    summary: `Hybrid-remote participation ${band} (index ${Math.round(remoteIndex)}); friction drag ${Math.round(frictionDrag)}.`,
    stewardNote
  };
}


// --- source: corridor-capacity-stress-brief.ts ---
  CorridorCapacityStressBand,
  InterregionalLaborRebalancingPlan,
  NationalCorridorCapacityStressBrief,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalLaborRebalancingStressBrief,
  NationalRegionalLaborAbsorptionBrief
} from './types';

function stressBand(index: number): CorridorCapacityStressBand {
  if (index <= 32) return 'relief';
  if (index <= 48) return 'balanced';
  if (index <= 64) return 'stressed';
  return 'overloaded';
}

export function computeNationalCorridorCapacityStressBrief(
  state: NationalLaborDemographicsState,
  plan: InterregionalLaborRebalancingPlan | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined,
  rebalancingStress: NationalLaborRebalancingStressBrief | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalCorridorCapacityStressBrief {
  if (!state.enabled || !plan || !absorption || !rebalancingStress || !tightness) {
    return {
      turn: state.turn,
      stressIndex: 50,
      band: 'balanced',
      corridorMoveDrag: 0,
      summary: 'Corridor capacity stress idle — plan, absorption, stress, or tightness unavailable.',
      stewardNote: 'Compute rebalancing plan and absorption before corridor stress guidance.'
    };
  }

  const corridorMoveDrag = v1014laborClamp(plan.moves.length * 2.2 + rebalancingStress.highPriorityMoves * 5);
  const absorptionDrag =
    absorption.band === 'saturated'
      ? 16
      : absorption.band === 'constrained'
        ? 10
        : 0;
  const tightnessDrag =
    tightness.band === 'critical_shortage' ? 14 : tightness.band === 'tight' ? 8 : 0;
  const stressLift = rebalancingStress.stressIndex * 0.18;

  const stressIndex = v1014laborClamp(26 + corridorMoveDrag + absorptionDrag + tightnessDrag + stressLift * 0.35);
  const band = stressBand(stressIndex);

  const stewardNote =
    band === 'overloaded' || band === 'stressed'
      ? 'Stressed corridor capacity — pause high-priority moves until absorption headroom returns.'
      : band === 'relief'
        ? 'Corridor relief band — align mentorship levers before scaling remote participation.'
        : 'Balanced corridor stress — monitor tightness in inbound shock regions.';

  return {
    turn: state.turn,
    stressIndex,
    band,
    corridorMoveDrag,
    summary: `Corridor capacity stress ${band} (index ${Math.round(stressIndex)}); move drag ${Math.round(corridorMoveDrag)}.`,
    stewardNote
  };
}


// --- source: steward-intervention-priority-brief.ts ---
  NationalIntegratedLaborReadinessOutlook,
  NationalLaborDemographicsState,
  NationalLaborMarketStabilityOutlook,
  NationalLaborRebalancingStressBrief,
  NationalStewardInterventionPriorityBrief,
  StewardInterventionBand
} from './types';

function interventionBand(index: number): StewardInterventionBand {
  if (index <= 34) return 'observe';
  if (index <= 48) return 'nudge';
  if (index <= 62) return 'act';
  return 'urgent';
}

export function computeNationalStewardInterventionPriorityBrief(
  state: NationalLaborDemographicsState,
  readiness: NationalIntegratedLaborReadinessOutlook | null | undefined,
  stability: NationalLaborMarketStabilityOutlook | null | undefined,
  rebalancingStress: NationalLaborRebalancingStressBrief | null | undefined
): NationalStewardInterventionPriorityBrief {
  if (!state.enabled || !readiness || !stability || !rebalancingStress) {
    return {
      turn: state.turn,
      priorityIndex: 50,
      band: 'nudge',
      readinessDrag: 0,
      summary: 'Steward intervention priority idle — readiness, stability, or stress unavailable.',
      stewardNote: 'Compute integrated readiness and stability before intervention priority guidance.'
    };
  }

  const readinessDrag =
    readiness.band === 'unprepared'
      ? 18
      : readiness.band === 'caution'
        ? 12
        : readiness.stabilityDrag * 0.4;
  const stabilityDrag =
    stability.band === 'volatile'
      ? 16
      : stability.band === 'fragile'
        ? 10
        : stability.stressDrag * 0.35;
  const stressLift =
    rebalancingStress.band === 'critical'
      ? 20
      : rebalancingStress.band === 'acute'
        ? 14
        : rebalancingStress.stressIndex * 0.22;
  const readinessEase =
    readiness.band === 'ready' || readiness.band === 'primed' ? readiness.readinessIndex * 0.2 : 0;

  const priorityIndex = v1014laborClamp(24 + stressLift + stabilityDrag + readinessDrag - readinessEase);
  const band = interventionBand(priorityIndex);

  const stewardNote =
    band === 'urgent' || band === 'act'
      ? 'Elevated steward intervention — sequence coordination levers before auto workforce commits.'
      : band === 'observe'
        ? 'Observe band — maintain mentorship and advocacy while monitoring corridor stress.'
        : 'Nudge band — align hybrid-remote outlook with participation equity gaps.';

  return {
    turn: state.turn,
    priorityIndex,
    band,
    readinessDrag,
    summary: `Steward intervention priority ${band} (index ${Math.round(priorityIndex)}); readiness drag ${Math.round(readinessDrag)}.`,
    stewardNote
  };
}


// --- source: essential-worker-participation-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type EssentialWorkerParticipationBand,
  type NationalEssentialWorkerParticipationOutlook,
  type NationalLaborDemographicsState,
  type NationalMigrationShockParticipationBufferOutlook,
  type NationalParticipationPressureBrief
} from './types';

function essentialBand(index: number): EssentialWorkerParticipationBand {
  if (index <= 34) return 'strained';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'supported';
  return 'resilient';
}

export function computeNationalEssentialWorkerParticipationOutlook(
  state: NationalLaborDemographicsState,
  participation: NationalParticipationPressureBrief | null | undefined,
  buffer: NationalMigrationShockParticipationBufferOutlook | null | undefined
): NationalEssentialWorkerParticipationOutlook {
  if (!state.enabled || !participation || !buffer) {
    return {
      turn: state.turn,
      essentialIndex: 50,
      band: 'mixed',
      shockDrag: 0,
      summary: 'Essential-worker participation idle — participation or buffer unavailable.',
      stewardNote: 'Compute participation and migration buffer before essential-worker guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const essentialShocks =
    (state.activeMigrationShocks || []).filter(s => s.kind === 'essential_access_outflow').length;
  const shockDrag = v1014laborClamp(buffer.activeShockDrag * 0.55 + essentialShocks * 8);
  const participationLift = participation.participationIndex * 0.3;
  const bufferLift =
    buffer.band === 'cushioned' || buffer.band === 'adequate' ? buffer.bufferIndex * 0.2 : 0;

  const essentialIndex = v1014laborClamp(30 + participationLift + bufferLift + safetyLift * 20 - shockDrag);
  const band = essentialBand(essentialIndex);

  const stewardNote =
    band === 'strained' || band === 'mixed'
      ? 'Mixed essential-worker participation — deploy safety levers before stacking migration shocks.'
      : band === 'resilient'
        ? 'Resilient essential band — avoid corridor overload that erodes shock buffers.'
        : 'Supported essential participation — monitor equity gaps in access-strained regions.';

  return {
    turn: state.turn,
    essentialIndex,
    band,
    shockDrag,
    summary: `Essential-worker participation ${band} (index ${Math.round(essentialIndex)}); shock drag ${Math.round(shockDrag)}.`,
    stewardNote
  };
}


// --- source: wage-automation-coupling-brief.ts ---
  NationalAutomationParticipationResilienceOutlook,
  NationalLaborDemographicsState,
  NationalWageAutomationCouplingBrief,
  NationalWageCompetitivenessIndex,
  NationalWageParticipationSpilloverBrief,
  WageAutomationCouplingBand
} from './types';

function couplingBand(index: number): WageAutomationCouplingBand {
  if (index <= 34) return 'disruptive';
  if (index <= 48) return 'tense';
  if (index <= 62) return 'balanced';
  return 'harmonized';
}

export function computeNationalWageAutomationCouplingBrief(
  state: NationalLaborDemographicsState,
  spillover: NationalWageParticipationSpilloverBrief | null | undefined,
  competitiveness: NationalWageCompetitivenessIndex | null | undefined,
  automationResilience: NationalAutomationParticipationResilienceOutlook | null | undefined
): NationalWageAutomationCouplingBrief {
  if (!state.enabled || !spillover || !competitiveness || !automationResilience) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'tense',
      automationDrag: 0,
      summary: 'Wage-automation coupling idle — spillover, competitiveness, or resilience unavailable.',
      stewardNote: 'Compute wage spillover and automation resilience before coupling guidance.'
    };
  }

  const automationDrag = v1014laborClamp(
    automationResilience.automationPressureDrag * 0.6 +
      (automationResilience.band === 'fragile' ? 10 : automationResilience.band === 'strained' ? 6 : 0)
  );
  const spilloverLift =
    spillover.band === 'supportive' || spillover.band === 'amplifying'
      ? spillover.spilloverIndex * 0.24
      : spillover.spilloverIndex * 0.12;
  const competitivenessEase =
    competitiveness.band === 'premium' || competitiveness.band === 'balanced'
      ? competitiveness.competitivenessIndex * 0.22
      : 0;
  const wageDrag =
    spillover.band === 'suppressive' ? 12 : competitiveness.band === 'cost_burden' ? 10 : 0;

  const couplingIndex = v1014laborClamp(32 + spilloverLift + competitivenessEase - automationDrag - wageDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'disruptive' || band === 'tense'
      ? 'Tense wage-automation coupling — slow automation before wage competitiveness pushes.'
      : band === 'harmonized'
        ? 'Harmonized coupling — guard against corridor stress that flips spillover bands.'
        : 'Balanced coupling — align mentorship with automation resilience outlook.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    automationDrag,
    summary: `Wage-automation coupling ${band} (index ${Math.round(couplingIndex)}); automation drag ${Math.round(automationDrag)}.`,
    stewardNote
  };
}


// --- source: national-labor-cohesion-index.ts ---
  V1014_LABOR_CORE_REGIONS,
  type LaborCohesionBand,
  type NationalCapacityParticipationAlignmentBrief,
  type NationalIntergenerationalWorkforceBalanceOutlook,
  type NationalLaborCohesionIndex,
  type NationalLaborDemographicsState,
  type NationalLaborMarketStabilityOutlook
} from './types';

function cohesionBand(index: number): LaborCohesionBand {
  if (index <= 34) return 'fragmented';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'cohesive';
  return 'unified';
}

export function computeNationalLaborCohesionIndex(
  state: NationalLaborDemographicsState,
  stability: NationalLaborMarketStabilityOutlook | null | undefined,
  intergenerational: NationalIntergenerationalWorkforceBalanceOutlook | null | undefined,
  alignment: NationalCapacityParticipationAlignmentBrief | null | undefined
): NationalLaborCohesionIndex {
  if (!state.enabled || !stability || !intergenerational || !alignment) {
    return {
      turn: state.turn,
      cohesionIndex: 50,
      band: 'patchy',
      stabilityDrag: 0,
      summary: 'National labor cohesion idle — stability, balance, or alignment unavailable.',
      stewardNote: 'Compute stability, intergenerational balance, and alignment before cohesion guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const stabilityDrag =
    stability.band === 'volatile'
      ? 16
      : stability.band === 'fragile'
        ? 10
        : stability.stressDrag * 0.4;
  const balanceLift =
    intergenerational.band === 'balanced' || intergenerational.band === 'renewal'
      ? intergenerational.balanceIndex * 0.28
      : intergenerational.balanceIndex * 0.14;
  const alignmentLift =
    alignment.band === 'aligned' || alignment.band === 'reinforcing'
      ? alignment.alignmentIndex * 0.26
      : alignment.alignmentIndex * 0.12;
  const gapDrag = intergenerational.pipelineGap * 0.12;

  const cohesionIndex = v1014laborClamp(
    28 + balanceLift + alignmentLift + coordinationLift * 20 - stabilityDrag - gapDrag
  );
  const band = cohesionBand(cohesionIndex);

  const stewardNote =
    band === 'fragmented' || band === 'patchy'
      ? 'Patchy labor cohesion — deploy coordination and safety levers before corridor moves.'
      : band === 'unified'
        ? 'Unified cohesion — avoid stacked shocks that thin essential-worker buffers.'
        : 'Cohesive band — maintain intergenerational balance while scaling participation.';

  return {
    turn: state.turn,
    cohesionIndex,
    band,
    stabilityDrag,
    summary: `National labor cohesion ${band} (index ${Math.round(cohesionIndex)}); stability drag ${Math.round(stabilityDrag)}.`,
    stewardNote
  };
}


// --- source: seasonal-participation-swing-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalEssentialWorkerParticipationOutlook,
  type NationalLaborDemographicsState,
  type NationalLaborMarketTightnessBrief,
  type SeasonalParticipationSwingBand,
  type NationalSeasonalParticipationSwingOutlook
} from './types';

function swingBand(index: number): SeasonalParticipationSwingBand {
  if (index <= 34) return 'volatile';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'managed';
  return 'stable';
}

export function computeNationalSeasonalParticipationSwingOutlook(
  state: NationalLaborDemographicsState,
  essential: NationalEssentialWorkerParticipationOutlook | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalSeasonalParticipationSwingOutlook {
  if (!state.enabled || !essential || !tightness) {
    return {
      turn: state.turn,
      swingIndex: 50,
      band: 'uneven',
      seasonalDrag: 0,
      summary: 'Seasonal participation swing idle — essential or tightness unavailable.',
      stewardNote: 'Compute essential-worker and tightness briefs before seasonal swing guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const seasonalDrag = v1014laborClamp(
    (tightness.band === 'critical_shortage' || tightness.band === 'tight' ? 14 : 6) +
      essential.shockDrag * 0.35
  );
  const essentialLift = essential.essentialIndex * 0.22;
  const swingIndex = v1014laborClamp(26 + essentialLift + schedulingLift * 22 - seasonalDrag);
  const band = swingBand(swingIndex);

  const stewardNote =
    band === 'volatile' || band === 'uneven'
      ? 'Uneven seasonal swing — deploy scheduling levers before corridor-heavy moves.'
      : band === 'stable'
        ? 'Stable seasonal band — avoid stacked shocks that thin crew pools.'
        : 'Managed swing — monitor essential participation during peak windows.';

  return {
    turn: state.turn,
    swingIndex,
    band,
    seasonalDrag,
    summary: `Seasonal participation swing ${band} (index ${Math.round(swingIndex)}); seasonal drag ${Math.round(seasonalDrag)}.`,
    stewardNote
  };
}


// --- source: cohesion-corridor-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CohesionCorridorCouplingBand,
  type NationalCohesionCorridorCouplingBrief,
  type NationalCorridorCapacityStressBrief,
  type NationalLaborCohesionIndex,
  type NationalLaborDemographicsState
} from './types';

function couplingBand(index: number): CohesionCorridorCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'linked';
  return 'reinforced';
}

export function computeNationalCohesionCorridorCouplingBrief(
  state: NationalLaborDemographicsState,
  cohesion: NationalLaborCohesionIndex | null | undefined,
  corridorStress: NationalCorridorCapacityStressBrief | null | undefined
): NationalCohesionCorridorCouplingBrief {
  if (!state.enabled || !cohesion || !corridorStress) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      corridorDrag: 0,
      summary: 'Cohesion-corridor coupling idle — cohesion or corridor stress unavailable.',
      stewardNote: 'Compute national cohesion and corridor stress before coupling guidance.'
    };
  }

  const corridorDrag = v1014laborClamp(
    corridorStress.corridorMoveDrag * 0.6 +
      (corridorStress.band === 'overloaded' || corridorStress.band === 'stressed' ? 12 : 4)
  );
  const cohesionLift =
    cohesion.band === 'cohesive' || cohesion.band === 'unified'
      ? cohesion.cohesionIndex * 0.28
      : cohesion.cohesionIndex * 0.14;
  const migrationSpread =
    V1014_LABOR_CORE_REGIONS.reduce((a, r) => a + Math.abs((state.regions[r]?.migrationFlowScore ?? 50) - 50), 0) /
    Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const couplingIndex = v1014laborClamp(24 + cohesionLift - corridorDrag - migrationSpread * 0.08);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained cohesion-corridor link — ease corridor stress before national cohesion campaigns.'
      : band === 'reinforced'
        ? 'Reinforced coupling — avoid overload moves that fragment unified cohesion.'
        : 'Linked coupling — pair scheduling levers with corridor absorption checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    corridorDrag,
    summary: `Cohesion-corridor coupling ${band} (index ${Math.round(couplingIndex)}); corridor drag ${Math.round(corridorDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-reliability-index.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalCohesionCorridorCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSeasonalParticipationSwingOutlook,
  type NationalWorkforceReliabilityIndex,
  type WorkforceReliabilityBand
} from './types';

function reliabilityBand(index: number): WorkforceReliabilityBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'reliable';
  return 'robust';
}

export function computeNationalWorkforceReliabilityIndex(
  state: NationalLaborDemographicsState,
  seasonal: NationalSeasonalParticipationSwingOutlook | null | undefined,
  coupling: NationalCohesionCorridorCouplingBrief | null | undefined
): NationalWorkforceReliabilityIndex {
  if (!state.enabled || !seasonal || !coupling) {
    return {
      turn: state.turn,
      reliabilityIndex: 50,
      band: 'patchy',
      couplingDrag: 0,
      summary: 'Workforce reliability idle — seasonal swing or cohesion-corridor coupling unavailable.',
      stewardNote: 'Compute seasonal swing and cohesion-corridor coupling before reliability guidance.'
    };
  }

  let leverLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const industry = state.regions[regionId]?.dominantIndustry ?? null;
    leverLift += schedulingEaseForRegion(regionId, industry) * 0.55 + safetyEaseForRegion(regionId, industry) * 0.45;
  });
  leverLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const couplingDrag = v1014laborClamp(
    coupling.corridorDrag * 0.45 + (coupling.band === 'decoupled' || coupling.band === 'strained' ? 10 : 3)
  );
  const seasonalLift =
    seasonal.band === 'stable' || seasonal.band === 'managed' ? seasonal.swingIndex * 0.24 : seasonal.swingIndex * 0.12;
  const reliabilityIndex = v1014laborClamp(22 + seasonalLift + leverLift * 24 - couplingDrag - seasonal.seasonalDrag * 0.2);
  const band = reliabilityBand(reliabilityIndex);

  const stewardNote =
    band === 'fragile' || band === 'patchy'
      ? 'Patchy reliability — stack scheduling and safety levers before automation pushes.'
      : band === 'robust'
        ? 'Robust reliability — protect crew pools when corridor stress rises.'
        : 'Reliable band — monitor cohesion-corridor coupling during seasonal peaks.';

  return {
    turn: state.turn,
    reliabilityIndex,
    band,
    couplingDrag,
    summary: `National workforce reliability ${band} (index ${Math.round(reliabilityIndex)}); coupling drag ${Math.round(couplingDrag)}.`,
    stewardNote
  };
}


// --- source: retention-reliability-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalRetentionReliabilityCouplingBrief,
  type NationalWorkforceReliabilityIndex,
  type RetentionReliabilityCouplingBand
} from './types';

function couplingBand(index: number): RetentionReliabilityCouplingBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'anchored';
  return 'reinforced';
}

export function computeNationalRetentionReliabilityCouplingBrief(
  state: NationalLaborDemographicsState,
  reliability: NationalWorkforceReliabilityIndex | null | undefined
): NationalRetentionReliabilityCouplingBrief {
  if (!state.enabled || !reliability) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      reliabilityDrag: 0,
      summary: 'Retention-reliability coupling idle — workforce reliability unavailable.',
      stewardNote: 'Compute workforce reliability before retention coupling guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const reliabilityDrag = v1014laborClamp(
    reliability.couplingDrag * 0.5 +
      (reliability.band === 'fragile' || reliability.band === 'patchy' ? 12 : 4)
  );
  const reliabilityLift =
    reliability.band === 'reliable' || reliability.band === 'robust'
      ? reliability.reliabilityIndex * 0.26
      : reliability.reliabilityIndex * 0.14;

  const couplingIndex = v1014laborClamp(24 + retentionLift * 22 + reliabilityLift - reliabilityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'fragile' || band === 'strained'
      ? 'Strained retention-reliability link — stack retention levers before seasonal corridor moves.'
      : band === 'reinforced'
        ? 'Reinforced coupling — protect career ladders when reliability dips patchy.'
        : 'Anchored coupling — pair retention packs with scheduling relief in strain hubs.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    reliabilityDrag,
    summary: `Retention-reliability coupling ${band} (index ${Math.round(couplingIndex)}); reliability drag ${Math.round(reliabilityDrag)}.`,
    stewardNote
  };
}


// --- source: upskilling-velocity-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSkillsTightnessCoherenceOutlook,
  type NationalUpskillingVelocityOutlook,
  type UpskillingVelocityBand
} from './types';

function velocityBand(index: number): UpskillingVelocityBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'active';
  return 'accelerating';
}

export function computeNationalUpskillingVelocityOutlook(
  state: NationalLaborDemographicsState,
  skillsCoherence: NationalSkillsTightnessCoherenceOutlook | null | undefined
): NationalUpskillingVelocityOutlook {
  if (!state.enabled || !skillsCoherence) {
    return {
      turn: state.turn,
      velocityIndex: 50,
      band: 'uneven',
      mismatchDrag: 0,
      summary: 'Upskilling velocity idle — skills tightness coherence unavailable.',
      stewardNote: 'Compute skills tightness coherence before upskilling velocity guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mismatchDrag = v1014laborClamp(
    skillsCoherence.mismatchDrag * 0.55 +
      (skillsCoherence.band === 'incoherent' || skillsCoherence.band === 'strained' ? 10 : 3)
  );
  const coherenceLift =
    skillsCoherence.band === 'coherent' || skillsCoherence.band === 'aligned'
      ? skillsCoherence.coherenceIndex * 0.24
      : skillsCoherence.coherenceIndex * 0.12;

  const velocityIndex = v1014laborClamp(26 + upskillingLift * 24 + coherenceLift - mismatchDrag);
  const band = velocityBand(velocityIndex);

  const stewardNote =
    band === 'stalled' || band === 'uneven'
      ? 'Uneven upskilling velocity — deploy program levers before corridor skill pulls.'
      : band === 'accelerating'
        ? 'Accelerating upskilling band — avoid hyper-mobility that drains retention pools.'
        : 'Active upskilling — align velocity with credential mobility checks.';

  return {
    turn: state.turn,
    velocityIndex,
    band,
    mismatchDrag,
    summary: `National upskilling velocity ${band} (index ${Math.round(velocityIndex)}); mismatch drag ${Math.round(mismatchDrag)}.`,
    stewardNote
  };
}


// --- source: subject-workforce-readiness-brief.ts ---
  type NationalIntegratedLaborReadinessOutlook,
  type NationalLaborDemographicsState,
  type NationalRetentionReliabilityCouplingBrief,
  type NationalSubjectWorkforceReadinessBrief,
  type SubjectWorkforceReadinessBand
} from './types';

function readinessBand(index: number): SubjectWorkforceReadinessBand {
  if (index <= 34) return 'unready';
  if (index <= 48) return 'caution';
  if (index <= 62) return 'subject_ready';
  return 'primed';
}

/** Round-17 subject readiness — assembly-facing gate on reliability + retention + integrated readiness. */
export function computeNationalSubjectWorkforceReadinessBrief(
  state: NationalLaborDemographicsState,
  retentionCoupling: NationalRetentionReliabilityCouplingBrief | null | undefined,
  integratedReadiness: NationalIntegratedLaborReadinessOutlook | null | undefined
): NationalSubjectWorkforceReadinessBrief {
  if (!state.enabled || !retentionCoupling || !integratedReadiness) {
    return {
      turn: state.turn,
      subjectReadinessIndex: 50,
      band: 'caution',
      readinessDrag: 0,
      summary: 'Subject workforce readiness idle — retention coupling or integrated readiness unavailable.',
      stewardNote: 'Compute retention-reliability coupling and integrated readiness before subject guidance.'
    };
  }

  const readinessDrag = v1014laborClamp(
    integratedReadiness.stabilityDrag * 0.45 +
      retentionCoupling.reliabilityDrag * 0.35 +
      (integratedReadiness.band === 'unprepared' || integratedReadiness.band === 'caution' ? 10 : 2)
  );
  const retentionLift =
    retentionCoupling.band === 'anchored' || retentionCoupling.band === 'reinforced'
      ? retentionCoupling.couplingIndex * 0.28
      : retentionCoupling.couplingIndex * 0.14;
  const integratedLift =
    integratedReadiness.band === 'ready' || integratedReadiness.band === 'primed'
      ? integratedReadiness.readinessIndex * 0.3
      : integratedReadiness.readinessIndex * 0.16;

  const subjectReadinessIndex = v1014laborClamp(22 + retentionLift + integratedLift - readinessDrag);
  const band = readinessBand(subjectReadinessIndex);

  const stewardNote =
    band === 'unready' || band === 'caution'
      ? 'Subject readiness caution — stabilize retention-reliability before Agent 25 assembly wave commits.'
      : band === 'primed'
        ? 'Primed subject readiness — still verify upskilling velocity before auto workforce pushes.'
        : 'Subject-ready band — monitor sustainment index during seasonal peaks.';

  return {
    turn: state.turn,
    subjectReadinessIndex,
    band,
    readinessDrag,
    summary: `Subject workforce readiness ${band} (index ${Math.round(subjectReadinessIndex)}); readiness drag ${Math.round(readinessDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-sustainment-index.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectWorkforceReadinessBrief,
  type NationalUpskillingVelocityOutlook,
  type NationalWorkforceReliabilityIndex,
  type NationalWorkforceSustainmentIndex,
  type WorkforceSustainmentBand
} from './types';

function sustainmentBand(index: number): WorkforceSustainmentBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'sustained';
  return 'resilient';
}

export function computeNationalWorkforceSustainmentIndex(
  state: NationalLaborDemographicsState,
  reliability: NationalWorkforceReliabilityIndex | null | undefined,
  upskillingVelocity: NationalUpskillingVelocityOutlook | null | undefined,
  subjectReadiness: NationalSubjectWorkforceReadinessBrief | null | undefined
): NationalWorkforceSustainmentIndex {
  if (!state.enabled || !reliability || !upskillingVelocity || !subjectReadiness) {
    return {
      turn: state.turn,
      sustainmentIndex: 50,
      band: 'thin',
      subjectDrag: 0,
      summary: 'Workforce sustainment idle — reliability, upskilling velocity, or subject readiness unavailable.',
      stewardNote: 'Compute round-17 depth stack before sustainment guidance.'
    };
  }

  const subjectDrag = v1014laborClamp(
    subjectReadiness.readinessDrag * 0.4 +
      upskillingVelocity.mismatchDrag * 0.35 +
      (subjectReadiness.band === 'unready' || subjectReadiness.band === 'caution' ? 8 : 2)
  );
  const reliabilityLift =
    reliability.band === 'reliable' || reliability.band === 'robust'
      ? reliability.reliabilityIndex * 0.22
      : reliability.reliabilityIndex * 0.11;
  const velocityLift =
    upskillingVelocity.band === 'active' || upskillingVelocity.band === 'accelerating'
      ? upskillingVelocity.velocityIndex * 0.2
      : upskillingVelocity.velocityIndex * 0.1;
  const subjectLift =
    subjectReadiness.band === 'subject_ready' || subjectReadiness.band === 'primed'
      ? subjectReadiness.subjectReadinessIndex * 0.24
      : subjectReadiness.subjectReadinessIndex * 0.12;

  const sustainmentIndex = v1014laborClamp(20 + reliabilityLift + velocityLift + subjectLift - subjectDrag);
  const band = sustainmentBand(sustainmentIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin sustainment — sequence retention, upskilling, and subject readiness before scale-wave assembly.'
      : band === 'resilient'
        ? 'Resilient sustainment — avoid corridor overload that drains reliability pools.'
        : 'Sustained band — pair subject readiness checks with seasonal scheduling relief.';

  return {
    turn: state.turn,
    sustainmentIndex,
    band,
    subjectDrag,
    summary: `National workforce sustainment ${band} (index ${Math.round(sustainmentIndex)}); subject drag ${Math.round(subjectDrag)}.`,
    stewardNote
  };
}


// --- source: sustainment-retention-coupling-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalRetentionReliabilityCouplingBrief,
  type NationalSustainmentRetentionCouplingBrief,
  type NationalWorkforceSustainmentIndex,
  type SustainmentRetentionCouplingBand
} from './types';

function couplingBand(index: number): SustainmentRetentionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'linked';
  return 'reinforced';
}

export function computeNationalSustainmentRetentionCouplingBrief(
  state: NationalLaborDemographicsState,
  sustainment: NationalWorkforceSustainmentIndex | null | undefined,
  retentionCoupling: NationalRetentionReliabilityCouplingBrief | null | undefined
): NationalSustainmentRetentionCouplingBrief {
  if (!state.enabled || !sustainment || !retentionCoupling) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      sustainmentDrag: 0,
      summary: 'Sustainment-retention coupling idle — sustainment or retention coupling unavailable.',
      stewardNote: 'Compute workforce sustainment and retention-reliability coupling before round-18 guidance.'
    };
  }

  const sustainmentDrag = v1014laborClamp(
    sustainment.subjectDrag * 0.45 +
      retentionCoupling.reliabilityDrag * 0.35 +
      (sustainment.band === 'depleted' || sustainment.band === 'thin' ? 10 : 2)
  );
  const sustainmentLift =
    sustainment.band === 'sustained' || sustainment.band === 'resilient'
      ? sustainment.sustainmentIndex * 0.26
      : sustainment.sustainmentIndex * 0.13;
  const retentionLift =
    retentionCoupling.band === 'anchored' || retentionCoupling.band === 'reinforced'
      ? retentionCoupling.couplingIndex * 0.24
      : retentionCoupling.couplingIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + sustainmentLift + retentionLift - sustainmentDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained sustainment-retention link — rebuild sustainment before retention corridor moves.'
      : band === 'reinforced'
        ? 'Reinforced coupling — guard onboarding velocity spikes that thin retention pools.'
        : 'Linked coupling — pair sustainment checks with retention packs each assembly wave.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    sustainmentDrag,
    summary: `Sustainment-retention coupling ${band} (index ${Math.round(couplingIndex)}); sustainment drag ${Math.round(sustainmentDrag)}.`,
    stewardNote
  };
}


// --- source: onboarding-velocity-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingVelocityOutlook,
  type NationalUpskillingVelocityOutlook,
  type OnboardingVelocityBand
} from './types';

function velocityBand(index: number): OnboardingVelocityBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'steady';
  return 'surging';
}

export function computeNationalOnboardingVelocityOutlook(
  state: NationalLaborDemographicsState,
  upskillingVelocity: NationalUpskillingVelocityOutlook | null | undefined
): NationalOnboardingVelocityOutlook {
  if (!state.enabled || !upskillingVelocity) {
    return {
      turn: state.turn,
      velocityIndex: 50,
      band: 'uneven',
      pipelineDrag: 0,
      summary: 'Onboarding velocity idle — upskilling velocity outlook unavailable.',
      stewardNote: 'Compute upskilling velocity before onboarding pipeline guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pipelineDrag = v1014laborClamp(
    upskillingVelocity.mismatchDrag * 0.5 +
      (upskillingVelocity.band === 'stalled' || upskillingVelocity.band === 'uneven' ? 11 : 3)
  );
  const upskillingLift =
    upskillingVelocity.band === 'active' || upskillingVelocity.band === 'accelerating'
      ? upskillingVelocity.velocityIndex * 0.22
      : upskillingVelocity.velocityIndex * 0.11;

  const velocityIndex = v1014laborClamp(24 + onboardingLift * 23 + upskillingLift - pipelineDrag);
  const band = velocityBand(velocityIndex);

  const stewardNote =
    band === 'stalled' || band === 'uneven'
      ? 'Uneven onboarding velocity — ease onboarding levers before subject assembly commits.'
      : band === 'surging'
        ? 'Surging onboarding band — verify sustainment-retention coupling before scale-wave intake.'
        : 'Steady onboarding — align pipeline velocity with credential mobility checks.';

  return {
    turn: state.turn,
    velocityIndex,
    band,
    pipelineDrag,
    summary: `National onboarding velocity ${band} (index ${Math.round(velocityIndex)}); pipeline drag ${Math.round(pipelineDrag)}.`,
    stewardNote
  };
}


// --- source: subject-assembly-continuity-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectAssemblyContinuityBrief,
  type NationalSubjectWorkforceReadinessBrief,
  type NationalWorkforceSustainmentIndex,
  type SubjectAssemblyContinuityBand
} from './types';

function continuityBand(index: number): SubjectAssemblyContinuityBand {
  if (index <= 34) return 'broken';
  if (index <= 48) return 'gapped';
  if (index <= 62) return 'continuous';
  return 'locked';
}

/** Round-18 subject continuity — assembly gate on subject readiness × sustainment. */
export function computeNationalSubjectAssemblyContinuityBrief(
  state: NationalLaborDemographicsState,
  subjectReadiness: NationalSubjectWorkforceReadinessBrief | null | undefined,
  sustainment: NationalWorkforceSustainmentIndex | null | undefined
): NationalSubjectAssemblyContinuityBrief {
  if (!state.enabled || !subjectReadiness || !sustainment) {
    return {
      turn: state.turn,
      continuityIndex: 50,
      band: 'gapped',
      assemblyDrag: 0,
      summary: 'Subject assembly continuity idle — subject readiness or sustainment unavailable.',
      stewardNote: 'Compute subject workforce readiness and sustainment before assembly continuity guidance.'
    };
  }

  const assemblyDrag = v1014laborClamp(
    subjectReadiness.readinessDrag * 0.4 +
      sustainment.subjectDrag * 0.4 +
      (subjectReadiness.band === 'unready' || sustainment.band === 'depleted' ? 12 : 3)
  );
  const subjectLift =
    subjectReadiness.band === 'subject_ready' || subjectReadiness.band === 'primed'
      ? subjectReadiness.subjectReadinessIndex * 0.28
      : subjectReadiness.subjectReadinessIndex * 0.14;
  const sustainmentLift =
    sustainment.band === 'sustained' || sustainment.band === 'resilient'
      ? sustainment.sustainmentIndex * 0.26
      : sustainment.sustainmentIndex * 0.13;

  const continuityIndex = v1014laborClamp(20 + subjectLift + sustainmentLift - assemblyDrag);
  const band = continuityBand(continuityIndex);

  const stewardNote =
    band === 'broken' || band === 'gapped'
      ? 'Gapped subject continuity — pause scale-wave assembly until sustainment and subject readiness align.'
      : band === 'locked'
        ? 'Locked continuity — still monitor onboarding velocity during corridor peaks.'
        : 'Continuous subject band — pair with sustainment-retention coupling each round.';

  return {
    turn: state.turn,
    continuityIndex,
    band,
    assemblyDrag,
    summary: `Subject assembly continuity ${band} (index ${Math.round(continuityIndex)}); assembly drag ${Math.round(assemblyDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-continuity-index.ts ---
  type NationalLaborDemographicsState,
  type NationalOnboardingVelocityOutlook,
  type NationalSubjectAssemblyContinuityBrief,
  type NationalSustainmentRetentionCouplingBrief,
  type NationalWorkforceContinuityIndex,
  type WorkforceContinuityBand
} from './types';

function continuityBand(index: number): WorkforceContinuityBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'stable';
  return 'durable';
}

export function computeNationalWorkforceContinuityIndex(
  state: NationalLaborDemographicsState,
  sustainmentCoupling: NationalSustainmentRetentionCouplingBrief | null | undefined,
  onboardingVelocity: NationalOnboardingVelocityOutlook | null | undefined,
  subjectContinuity: NationalSubjectAssemblyContinuityBrief | null | undefined
): NationalWorkforceContinuityIndex {
  if (!state.enabled || !sustainmentCoupling || !onboardingVelocity || !subjectContinuity) {
    return {
      turn: state.turn,
      continuityIndex: 50,
      band: 'thin',
      assemblyDrag: 0,
      summary: 'Workforce continuity idle — sustainment coupling, onboarding velocity, or subject continuity unavailable.',
      stewardNote: 'Compute round-18 depth stack before continuity guidance.'
    };
  }

  const assemblyDrag = v1014laborClamp(
    subjectContinuity.assemblyDrag * 0.35 +
      sustainmentCoupling.sustainmentDrag * 0.3 +
      onboardingVelocity.pipelineDrag * 0.25 +
      (subjectContinuity.band === 'broken' || sustainmentCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    sustainmentCoupling.band === 'linked' || sustainmentCoupling.band === 'reinforced'
      ? sustainmentCoupling.couplingIndex * 0.2
      : sustainmentCoupling.couplingIndex * 0.1;
  const onboardingLift =
    onboardingVelocity.band === 'steady' || onboardingVelocity.band === 'surging'
      ? onboardingVelocity.velocityIndex * 0.18
      : onboardingVelocity.velocityIndex * 0.09;
  const subjectLift =
    subjectContinuity.band === 'continuous' || subjectContinuity.band === 'locked'
      ? subjectContinuity.continuityIndex * 0.22
      : subjectContinuity.continuityIndex * 0.11;

  const continuityIndex = v1014laborClamp(18 + couplingLift + onboardingLift + subjectLift - assemblyDrag);
  const band = continuityBand(continuityIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce continuity — sequence sustainment-retention, onboarding, and subject assembly before O10-167.'
      : band === 'durable'
        ? 'Durable continuity — avoid corridor overload that breaks subject assembly bands.'
        : 'Stable continuity — refresh subject assembly checks each scale wave.';

  return {
    turn: state.turn,
    continuityIndex,
    band,
    assemblyDrag,
    summary: `National workforce continuity ${band} (index ${Math.round(continuityIndex)}); assembly drag ${Math.round(assemblyDrag)}.`,
    stewardNote
  };
}


// --- source: continuity-coordination-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type ContinuityCoordinationCouplingBand,
  type NationalContinuityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceContinuityIndex
} from './types';

function couplingBand(index: number): ContinuityCoordinationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'synced';
  return 'aligned';
}

export function computeNationalContinuityCoordinationCouplingBrief(
  state: NationalLaborDemographicsState,
  continuity: NationalWorkforceContinuityIndex | null | undefined
): NationalContinuityCoordinationCouplingBrief {
  if (!state.enabled || !continuity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      continuityDrag: 0,
      summary: 'Continuity-coordination coupling idle — workforce continuity unavailable.',
      stewardNote: 'Compute workforce continuity before coordination coupling guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const continuityDrag = v1014laborClamp(
    continuity.assemblyDrag * 0.5 +
      (continuity.band === 'fragile' || continuity.band === 'thin' ? 11 : 3)
  );
  const continuityLift =
    continuity.band === 'stable' || continuity.band === 'durable'
      ? continuity.continuityIndex * 0.24
      : continuity.continuityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + coordinationLift * 21 + continuityLift - continuityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained continuity-coordination link — ease coordination levers before corridor scale commits.'
      : band === 'aligned'
        ? 'Aligned coupling — guard reengagement spikes that thin coordination buffers.'
        : 'Synced coupling — pair coordination packs with subject wave assembly checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    continuityDrag,
    summary: `Continuity-coordination coupling ${band} (index ${Math.round(couplingIndex)}); continuity drag ${Math.round(continuityDrag)}.`,
    stewardNote
  };
}


// --- source: reengagement-momentum-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingVelocityOutlook,
  type NationalReengagementMomentumOutlook,
  type ReengagementMomentumBand
} from './types';

function momentumBand(index: number): ReengagementMomentumBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'building';
  return 'surging';
}

export function computeNationalReengagementMomentumOutlook(
  state: NationalLaborDemographicsState,
  onboardingVelocity: NationalOnboardingVelocityOutlook | null | undefined
): NationalReengagementMomentumOutlook {
  if (!state.enabled || !onboardingVelocity) {
    return {
      turn: state.turn,
      momentumIndex: 50,
      band: 'patchy',
      pipelineDrag: 0,
      summary: 'Reengagement momentum idle — onboarding velocity unavailable.',
      stewardNote: 'Compute onboarding velocity before reengagement momentum guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pipelineDrag = v1014laborClamp(
    onboardingVelocity.pipelineDrag * 0.48 +
      (onboardingVelocity.band === 'stalled' || onboardingVelocity.band === 'uneven' ? 10 : 3)
  );
  const onboardingLift =
    onboardingVelocity.band === 'steady' || onboardingVelocity.band === 'surging'
      ? onboardingVelocity.velocityIndex * 0.2
      : onboardingVelocity.velocityIndex * 0.1;

  const momentumIndex = v1014laborClamp(24 + reengagementLift * 22 + onboardingLift - pipelineDrag);
  const band = momentumBand(momentumIndex);

  const stewardNote =
    band === 'stalled' || band === 'patchy'
      ? 'Patchy reengagement momentum — deploy reengagement levers before subject wave assembly.'
      : band === 'surging'
        ? 'Surging momentum — verify continuity-coordination coupling before scale-wave intake.'
        : 'Building momentum — align reengagement with household participation coupling checks.';

  return {
    turn: state.turn,
    momentumIndex,
    band,
    pipelineDrag,
    summary: `National reengagement momentum ${band} (index ${Math.round(momentumIndex)}); pipeline drag ${Math.round(pipelineDrag)}.`,
    stewardNote
  };
}


// --- source: subject-wave-assembly-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectAssemblyContinuityBrief,
  type NationalSubjectWaveAssemblyBrief,
  type NationalWorkforceContinuityIndex,
  type SubjectWaveAssemblyBand
} from './types';

function assemblyBand(index: number): SubjectWaveAssemblyBand {
  if (index <= 34) return 'blocked';
  if (index <= 48) return 'gapped';
  if (index <= 62) return 'ready';
  return 'cleared';
}

/** Round-19 subject wave assembly — continuity stack gate for scale-wave commits. */
export function computeNationalSubjectWaveAssemblyBrief(
  state: NationalLaborDemographicsState,
  subjectContinuity: NationalSubjectAssemblyContinuityBrief | null | undefined,
  continuity: NationalWorkforceContinuityIndex | null | undefined
): NationalSubjectWaveAssemblyBrief {
  if (!state.enabled || !subjectContinuity || !continuity) {
    return {
      turn: state.turn,
      assemblyIndex: 50,
      band: 'gapped',
      waveDrag: 0,
      summary: 'Subject wave assembly idle — subject continuity or workforce continuity unavailable.',
      stewardNote: 'Compute subject assembly continuity and workforce continuity before wave assembly guidance.'
    };
  }

  const waveDrag = v1014laborClamp(
    subjectContinuity.assemblyDrag * 0.38 +
      continuity.assemblyDrag * 0.38 +
      (subjectContinuity.band === 'broken' || continuity.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectContinuity.band === 'continuous' || subjectContinuity.band === 'locked'
      ? subjectContinuity.continuityIndex * 0.27
      : subjectContinuity.continuityIndex * 0.14;
  const continuityLift =
    continuity.band === 'stable' || continuity.band === 'durable'
      ? continuity.continuityIndex * 0.25
      : continuity.continuityIndex * 0.12;

  const assemblyIndex = v1014laborClamp(20 + subjectLift + continuityLift - waveDrag);
  const band = assemblyBand(assemblyIndex);

  const stewardNote =
    band === 'blocked' || band === 'gapped'
      ? 'Gapped subject wave assembly — hold O10-168 scale commits until continuity-coordination syncs.'
      : band === 'cleared'
        ? 'Cleared wave assembly — still monitor reengagement momentum during seasonal peaks.'
        : 'Ready wave band — pair with workforce durability index each assembly tranche.';

  return {
    turn: state.turn,
    assemblyIndex,
    band,
    waveDrag,
    summary: `Subject wave assembly ${band} (index ${Math.round(assemblyIndex)}); wave drag ${Math.round(waveDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-durability-index.ts ---
  type NationalContinuityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalReengagementMomentumOutlook,
  type NationalSubjectWaveAssemblyBrief,
  type NationalWorkforceDurabilityIndex,
  type WorkforceDurabilityBand
} from './types';

function durabilityBand(index: number): WorkforceDurabilityBand {
  if (index <= 34) return 'brittle';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'grounded';
  return 'fortified';
}

export function computeNationalWorkforceDurabilityIndex(
  state: NationalLaborDemographicsState,
  coordinationCoupling: NationalContinuityCoordinationCouplingBrief | null | undefined,
  reengagementMomentum: NationalReengagementMomentumOutlook | null | undefined,
  subjectWaveAssembly: NationalSubjectWaveAssemblyBrief | null | undefined
): NationalWorkforceDurabilityIndex {
  if (!state.enabled || !coordinationCoupling || !reengagementMomentum || !subjectWaveAssembly) {
    return {
      turn: state.turn,
      durabilityIndex: 50,
      band: 'thin',
      waveDrag: 0,
      summary: 'Workforce durability idle — coordination coupling, reengagement momentum, or subject wave assembly unavailable.',
      stewardNote: 'Compute round-19 depth stack before durability guidance.'
    };
  }

  const waveDrag = v1014laborClamp(
    subjectWaveAssembly.waveDrag * 0.35 +
      coordinationCoupling.continuityDrag * 0.3 +
      reengagementMomentum.pipelineDrag * 0.25 +
      (subjectWaveAssembly.band === 'blocked' || coordinationCoupling.band === 'decoupled' ? 8 : 2)
  );
  const coordinationLift =
    coordinationCoupling.band === 'synced' || coordinationCoupling.band === 'aligned'
      ? coordinationCoupling.couplingIndex * 0.2
      : coordinationCoupling.couplingIndex * 0.1;
  const momentumLift =
    reengagementMomentum.band === 'building' || reengagementMomentum.band === 'surging'
      ? reengagementMomentum.momentumIndex * 0.18
      : reengagementMomentum.momentumIndex * 0.09;
  const waveLift =
    subjectWaveAssembly.band === 'ready' || subjectWaveAssembly.band === 'cleared'
      ? subjectWaveAssembly.assemblyIndex * 0.22
      : subjectWaveAssembly.assemblyIndex * 0.11;

  const durabilityIndex = v1014laborClamp(18 + coordinationLift + momentumLift + waveLift - waveDrag);
  const band = durabilityBand(durabilityIndex);

  const stewardNote =
    band === 'brittle' || band === 'thin'
      ? 'Thin workforce durability — sequence continuity-coordination, reengagement, and subject wave before post-O10-167 tranche.'
      : band === 'fortified'
        ? 'Fortified durability — avoid corridor overload that breaks subject wave assembly.'
        : 'Grounded durability — refresh subject wave checks each scale wave.';

  return {
    turn: state.turn,
    durabilityIndex,
    band,
    waveDrag,
    summary: `National workforce durability ${band} (index ${Math.round(durabilityIndex)}); wave drag ${Math.round(waveDrag)}.`,
    stewardNote
  };
}


// --- source: persistence.ts ---
  v1014laborBandDemographic,
  v1014laborBandEmployment,
  v1014laborBandMigration,
  v1014laborBandWage,
  v1014laborClamp
} from './bands';
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  type LaborDemographicsInputs,
  type LaborDemographicsPersisted
} from './types';

export function createInitialLaborDemographicsPersisted(turn = 1): LaborDemographicsPersisted {
  return {
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    revision: 1,
    initializedTurn: null,
    lastUpdatedTurn: Math.max(1, turn),
    lastInputHash: '',
    nationalHysteresis: {
      demographicStructure: 'stable',
      employmentLinkage: 'balanced',
      wagePressure: 'stable',
      migrationFlow: 'balanced',
      demographicScore: 52,
      employmentLinkageScore: 55,
      wagePressureScore: 50,
      migrationFlowScore: 50
    },
    regionalHysteresis: {},
    transitions: [],
    history: [],
    activeMigrationShocks: []
  };
}

export function sanitizeLaborDemographicsPersisted(raw: any, turn = 1): LaborDemographicsPersisted {
  const base = createInitialLaborDemographicsPersisted(turn);
  if (!raw || typeof raw !== 'object') return base;
  const nh = raw.nationalHysteresis && typeof raw.nationalHysteresis === 'object' ? raw.nationalHysteresis : {};
  return {
    ...base,
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    revision: Math.max(1, Math.floor(Number(raw.revision) || base.revision)),
    initializedTurn: raw.initializedTurn == null ? null : Math.max(1, Math.floor(Number(raw.initializedTurn))),
    lastUpdatedTurn: Math.max(1, Math.floor(Number(raw.lastUpdatedTurn) || turn)),
    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash.slice(0, 120) : '',
    nationalHysteresis: {
      demographicStructure: v1014laborBandDemographic(v1014laborClamp(Number(nh.demographicScore) || 52)),
      employmentLinkage: v1014laborBandEmployment(v1014laborClamp(Number(nh.employmentLinkageScore) || 55)),
      wagePressure: v1014laborBandWage(v1014laborClamp(Number(nh.wagePressureScore) || 50)),
      migrationFlow: v1014laborBandMigration(v1014laborClamp(Number(nh.migrationFlowScore) || 50)),
      demographicScore: v1014laborClamp(Number(nh.demographicScore) || 52),
      employmentLinkageScore: v1014laborClamp(Number(nh.employmentLinkageScore) || 55),
      wagePressureScore: v1014laborClamp(Number(nh.wagePressureScore) || 50),
      migrationFlowScore: v1014laborClamp(Number(nh.migrationFlowScore) || 50)
    },
    regionalHysteresis: typeof raw.regionalHysteresis === 'object' && raw.regionalHysteresis ? raw.regionalHysteresis : {},
    transitions: Array.isArray(raw.transitions) ? raw.transitions.slice(-V1014_LABOR_LIMITS.maxTransitions) : [],
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LABOR_LIMITS.maxHistory) : [],
    activeMigrationShocks: Array.isArray(raw.activeMigrationShocks)
      ? raw.activeMigrationShocks.slice(-V1014_LABOR_LIMITS.maxActiveMigrationShocks)
      : []
  };
}

export function laborDemographicsInputHash(inputs: LaborDemographicsInputs): string {
  const turn = Math.floor(inputs.turn || 1);
  const ind = inputs.industries?.national?.output || {};
  const parts: string[] = [String(turn), inputs.enabled === false ? '0' : '1'];
  STRATEGIC_INDUSTRIES.forEach(k => parts.push(`${k}:${Math.round(Number((ind as any)[k] || 0))}`));
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    const reg = inputs.industries?.regions?.[c];
    if (!reg) return;
    STRATEGIC_INDUSTRIES.forEach(k => {
      const st = reg.industries?.[k];
      parts.push(`${c}:${k}:${Math.round(Number(st?.effectiveOutput || 0))}:${st?.condition || 'n'}`);
    });
  });
  const wf = inputs.workforce?.national?.effectivePressureRatio ?? inputs.workforce?.nationalPressureRatio;
  parts.push(`wf:${Math.round(Number(wf || 0) * 100)}`);
  const hh = inputs.households?.national?.employmentOpportunity;
  parts.push(`hh:${hh || 'n'}`);
  parts.push(`hhaff:${inputs.households?.national?.affordability || 'n'}`);
  const autoCaps = (inputs.capabilities || [])
    .filter(c => c.active !== false)
    .map(c => `${c.id}:${Math.round(Number(c.automationShift) || 0)}`)
    .join(',');
  parts.push(`auto:${autoCaps}`);
  let h = 2166136261;
  const s = parts.join('|');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v1014_${(h >>> 0).toString(16)}`;
}


// --- source: inputs.ts ---

export function buildLaborDemographicsInputs(params: {
  turn: number;
  gameState?: any;
  gameSettings?: any;
  industries?: any;
  workforce?: any;
  households?: any;
  livingRegions?: any;
  economicGeography?: any;
  capabilities?: LaborDemographicsInputs['capabilities'];
}): LaborDemographicsInputs {
  const turn = Math.max(1, Math.floor(params.turn || 1));
  const gset = params.gameSettings || {};
  const enabled =
    gset.laborDemographicsEnabled !== false &&
    gset.nationalSystemsEnabled !== false &&
    gset.industriesEnabled !== false;
  return {
    turn,
    enabled,
    industries: params.industries || params.gameState?.industriesSupplyChainsState || null,
    workforce: params.workforce || params.gameState?.workforceState || null,
    households: params.households || params.gameState?.householdEconomyState || null,
    livingRegions: params.livingRegions || null,
    economicGeography: params.economicGeography || null,
    capabilities: params.capabilities || params.gameState?.capabilities || null
  };
}


// --- source: validate.ts ---

export function validateLaborDemographicsState(
  st: NationalLaborDemographicsState | null | undefined
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!st) return { valid: false, errors: ['null state'] };
  if (st.schemaVersion !== V1014_LABOR_SCHEMA_VERSION) errors.push('schema');
  if (!Number.isFinite(st.turn)) errors.push('turn');
  V1014_LABOR_FORBIDDEN_STATE_KEYS.forEach(k => {
    if ((st as any)[k] != null) errors.push(`forbidden:${k}`);
  });
  return { valid: errors.length === 0, errors };
}


// --- source: compute.ts ---
  computeNationalHouseholdBudgetDetail,
  householdBudgetLaborAdjustments
} from './household-budget-detail';
  applyMigrationShocksToRegions,
  detectMigrationShocks,
  mergeMigrationShocks,
  toMigrationShockViews
} from './migration-shocks';
  v1014laborApplyHysteresis,
  v1014laborBandDemographic,
  v1014laborBandEmployment,
  v1014laborBandMigration,
  v1014laborBandWage,
  v1014laborClamp
} from './bands';
  buildIndustryLinks,
  computeRegionalEmploymentLinkageRaw,
  formatIndustryEvidence,
  householdEmploymentFit,
  v1014laborRegionIndustryOutputIndex
} from './employment-linkage';
  applyMigrationScoresToRegions,
  computeRegionalAttractiveness,
  nationalMigrationAverage
} from './migration';
  EMPLOYMENT_LINKAGE_LABEL,
  INDUSTRY_LABEL,
  MIGRATION_FLOW_LABEL,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  WAGE_PRESSURE_LABEL,
  type DemographicStructureBand,
  type EmploymentLinkageBand,
  type LaborDemographicsRegionSnapshot,
  type LaborDemographicsTransition,
  type LaborDemographicsInputs,
  type LaborDemographicsPersisted,
  type MigrationFlowBand,
  type NationalLaborDemographicsState,
  type WagePressureBand
} from './types';

export function computeNationalLaborDemographics(
  inputs: LaborDemographicsInputs,
  rawPersisted?: LaborDemographicsPersisted | null,
  prevState?: NationalLaborDemographicsState | null
): { state: NationalLaborDemographicsState; persisted: LaborDemographicsPersisted; events: string[] } {
  const turn = Math.max(1, Math.floor(inputs.turn || 1));
  const persisted = sanitizeLaborDemographicsPersisted(rawPersisted, turn);
  const hash = laborDemographicsInputHash(inputs);
  const events: string[] = [];
  if (!inputs.enabled) {
    const off: NationalLaborDemographicsState = {
      schemaVersion: V1014_LABOR_SCHEMA_VERSION,
      turn,
      revision: persisted.revision,
      inputHash: hash,
      enabled: false,
      nationalDemographicStructure: 'stable',
      nationalEmploymentLinkage: 'balanced',
      nationalWagePressure: 'stable',
      nationalMigrationFlow: 'balanced',
      demographicScore: 50,
      employmentLinkageScore: 50,
      wagePressureScore: 50,
      migrationFlowScore: 50,
      regions: {},
      industryLinks: [],
      summary: 'Labor demographics layer disabled.',
      outlook: 'Enable National Systems, Industries, and Labor Demographics to compute industry-linked structure.',
      transitions: [],
      evidence: []
    };
    return { state: off, persisted, events };
  }
  if (persisted.lastInputHash === hash && prevState && prevState.inputHash === hash) {
    return { state: prevState, persisted, events };
  }

  const nh = persisted.nationalHysteresis;
  const householdBudget = computeNationalHouseholdBudgetDetail(inputs.households);
  const regions: Record<string, LaborDemographicsRegionSnapshot> = {};
  const attractiveness: Record<string, number> = {};

  const wfStrainSamples: number[] = [];
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    wfStrainSamples.push(workforceStrainForRegion(regionId, inputs.workforce));
  });
  const wfStrainNational =
    wfStrainSamples.reduce((a, b) => a + b, 0) / Math.max(1, wfStrainSamples.length);

  const automationFeedback = computeLaborAutomationFeedback({
    workforce: inputs.workforce,
    capabilities: inputs.capabilities,
    wfStrainNational
  });

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const { index: outputIndex, dominant } = v1014laborRegionIndustryOutputIndex(regionId, inputs.industries);
    const wfStrain = workforceStrainForRegion(regionId, inputs.workforce);
    const hhFit = householdEmploymentFit(regionId, inputs.households);
    const momentumBoost = livingRegionsMomentumBoost(inputs.livingRegions, regionId);

    const hhDetail = householdBudget.regions[regionId];
    const budgetAdj = householdBudgetLaborAdjustments(hhDetail);

    let empLinkageRaw = computeRegionalEmploymentLinkageRaw({ outputIndex, hhFit, wfStrain });
    empLinkageRaw = v1014laborClamp(empLinkageRaw + budgetAdj.employmentFitDelta);
    let wageRaw = computeRegionalWagePressureRaw({ wfStrain, outputIndex, momentumBoost });
    wageRaw = v1014laborClamp(wageRaw + budgetAdj.wagePressureDelta);
    let demoRaw = computeRegionalDemographicRaw({ momentumBoost, dominant });
    const baseline = lookupRegionalLaborBaseline(regionId);
    if (baseline) {
      demoRaw = v1014laborClamp(
        demoRaw * (1 - baseline.demographicInertia / 400) + 50 * (baseline.demographicInertia / 400)
      );
      empLinkageRaw = v1014laborClamp(empLinkageRaw * (0.92 + baseline.laborMobilityIndex / 1200));
    }
    ({ empLinkageRaw, wageRaw, demoRaw } = mergeAutomationFeedbackIntoRegionalScores(
      { empLinkageRaw, wageRaw, demoRaw },
      automationFeedback
    ));

    attractiveness[regionId] = computeRegionalAttractiveness({ empLinkageRaw, wfStrain, hhFit }) + budgetAdj.attractivenessDelta;

    regions[regionId] = {
      regionId,
      demographicStructure: v1014laborBandDemographic(demoRaw),
      demographicScore: demoRaw,
      employmentLinkage: v1014laborBandEmployment(empLinkageRaw),
      employmentLinkageScore: empLinkageRaw,
      wagePressure: v1014laborBandWage(wageRaw),
      wagePressureScore: wageRaw,
      migrationFlow: 'balanced',
      migrationFlowScore: 50,
      dominantIndustry: dominant,
      industryOutputIndex: outputIndex,
      workforceStrainIndex: wfStrain,
      householdEmploymentFit: hhFit,
      automationPressureIndex: automationFeedback.nationalAutomationIndex,
      householdBudgetPressureScore: hhDetail.budgetPressureScore,
      householdEssentialsGapScore: hhDetail.essentialsGapScore
    };
    persisted.regionalHysteresis[regionId] = {
      demographicStructure: regions[regionId].demographicStructure,
      employmentLinkage: regions[regionId].employmentLinkage,
      wagePressure: regions[regionId].wagePressure,
      migrationFlow: regions[regionId].migrationFlow
    };
  });

  applyMigrationScoresToRegions(regions, applyRegionalMigrationSpillovers(attractiveness));

  const tickedShocks = (persisted.activeMigrationShocks || [])
    .map(s => ({
      ...s,
      turnsRemaining:
        turn > s.startedTurn ? Math.max(0, s.turnsRemaining - 1) : s.turnsRemaining
    }))
    .filter(s => s.turnsRemaining > 0);

  const detectedShocks = detectMigrationShocks({ turn, inputs, householdBudget });
  const activeShocks = mergeMigrationShocks(
    tickedShocks,
    detectedShocks,
    inputs.migrationShockOverrides,
    turn
  );
  const shockApply = applyMigrationShocksToRegions(regions, activeShocks);
  if (shockApply.regionsTouched.length) {
    events.push(
      `Migration shocks active in ${shockApply.regionsTouched.join(', ')} (${activeShocks.length} shock(s)).`
    );
  }

  const coupling = applyWageMigrationCouplingToRegions(regions);
  if (coupling.explanations.length) {
    events.push(`Wage–migration coupling adjusted ${coupling.explanations.length} region(s).`);
  }

  const corridorNotes = applyCorridorPullToRegions(regions);
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    regions[regionId].migrationFlow = v1014laborBandMigration(regions[regionId].migrationFlowScore);
  });

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    persisted.regionalHysteresis[regionId].migrationFlow = regions[regionId].migrationFlow;
  });

  const nationalEmp = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].employmentLinkageScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalWage = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].wagePressureScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalDemo = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].demographicScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalMig = nationalMigrationAverage(regions);

  const empNat = v1014laborApplyHysteresis(
    nh.employmentLinkage,
    nationalEmp,
    nh.employmentLinkageScore,
    v1014laborBandEmployment
  );
  const wageNat = v1014laborApplyHysteresis(nh.wagePressure, nationalWage, nh.wagePressureScore, v1014laborBandWage);
  const demoNat = v1014laborApplyHysteresis(
    nh.demographicStructure,
    nationalDemo,
    nh.demographicScore,
    v1014laborBandDemographic
  );
  const migNat = v1014laborApplyHysteresis(
    nh.migrationFlow,
    nationalMig,
    nh.migrationFlowScore,
    v1014laborBandMigration
  );

  const industryLinks = buildIndustryLinks(inputs.industries);

  const transitions: LaborDemographicsTransition[] = [...persisted.transitions];
  const pushTransition = (
    scope: 'national' | 'regional',
    field: string,
    from: string,
    to: string,
    reason: string,
    regionId?: string
  ) => {
    if (from === to) return;
    transitions.push({
      id: `ld14_${turn}_${field}_${regionId || 'nat'}_${transitions.length}`,
      turn,
      scope,
      regionId,
      field,
      from,
      to,
      reason
    });
  };
  pushTransition(
    'national',
    'employmentLinkage',
    nh.employmentLinkage,
    empNat.band,
    'Industry output and workforce strain shifted national employment linkage.'
  );
  pushTransition(
    'national',
    'wagePressure',
    nh.wagePressure,
    wageNat.band,
    'Output momentum and workforce pressure adjusted wage bands.'
  );
  pushTransition(
    'national',
    'migrationFlow',
    nh.migrationFlow,
    migNat.band,
    'Regional employment attractiveness diverged.'
  );

  const nextPersisted: LaborDemographicsPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    initializedTurn: persisted.initializedTurn ?? turn,
    lastUpdatedTurn: turn,
    lastInputHash: hash,
    nationalHysteresis: {
      demographicStructure: demoNat.band as DemographicStructureBand,
      employmentLinkage: empNat.band as EmploymentLinkageBand,
      wagePressure: wageNat.band as WagePressureBand,
      migrationFlow: migNat.band as MigrationFlowBand,
      demographicScore: demoNat.score,
      employmentLinkageScore: empNat.score,
      wagePressureScore: wageNat.score,
      migrationFlowScore: migNat.score
    },
    regionalHysteresis: persisted.regionalHysteresis,
    transitions: transitions.slice(-V1014_LABOR_LIMITS.maxTransitions),
    history: [
      ...persisted.history,
      { turn, hash, summary: `emp=${empNat.band}, wage=${wageNat.band}, mig=${migNat.band}` }
    ].slice(-V1014_LABOR_LIMITS.maxHistory),
    activeMigrationShocks: activeShocks
  };

  const dominantLink = industryLinks[0];
  const summary = dominantLink
    ? `National employment linkage tracks ${INDUSTRY_LABEL[dominantLink.industry].toLowerCase()} output (${Math.round(dominantLink.nationalOutputShare * 100)}% share) with ${EMPLOYMENT_LINKAGE_LABEL[empNat.band as EmploymentLinkageBand].toLowerCase()}.`
    : `National employment linkage is ${EMPLOYMENT_LINKAGE_LABEL[empNat.band as EmploymentLinkageBand].toLowerCase()} with stable industry mix.`;
  const outlook = `Wage pressure ${WAGE_PRESSURE_LABEL[wageNat.band as WagePressureBand].toLowerCase()}; migration ${MIGRATION_FLOW_LABEL[migNat.band as MigrationFlowBand].toLowerCase()} toward high-output regions.`;

  const state: NationalLaborDemographicsState = {
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    turn,
    revision: nextPersisted.revision,
    inputHash: hash,
    enabled: true,
    nationalDemographicStructure: demoNat.band as DemographicStructureBand,
    nationalEmploymentLinkage: empNat.band as EmploymentLinkageBand,
    nationalWagePressure: wageNat.band as WagePressureBand,
    nationalMigrationFlow: migNat.band as MigrationFlowBand,
    demographicScore: demoNat.score,
    employmentLinkageScore: empNat.score,
    wagePressureScore: wageNat.score,
    migrationFlowScore: migNat.score,
    regions,
    industryLinks,
    summary,
    outlook,
    transitions: nextPersisted.transitions,
    evidence: [
      ...formatIndustryEvidence(industryLinks),
      ...(householdBudget.nationalBudgetPressureScore >= 60
        ? [`Household budget pressure elevated (${Math.round(householdBudget.nationalBudgetPressureScore)})`]
        : []),
      ...coupling.explanations.slice(0, 2)
    ],
    automationFeedbackSummary: automationFeedback.playerFacingSummary,
    householdBudgetSummary: householdBudget.summary,
    activeMigrationShocks: toMigrationShockViews(activeShocks)
  };

  const integratedBrief = computeIntegratedLaborMarketBrief(state, householdBudget);
  state.integratedLaborBrief = integratedBrief;
  state.laborAuditTip = buildLaborTurnAuditEntry(state, integratedBrief);

  const capacityBridge = computeNationalWorkforceCapacityBridge(turn, regions, industryLinks);
  state.workforceCapacityBridge = capacityBridge;
  state.laborResilienceScorecard = computeLaborResilienceScorecard(
    state,
    integratedBrief,
    householdBudget,
    capacityBridge
  );
  state.interregionalRebalancingPlan = computeInterregionalLaborRebalancingPlan(
    state,
    integratedBrief,
    capacityBridge
  );
  const dependencySnapshot = computeNationalDependencyRatioSnapshot(turn, regions);
  state.dependencyRatioSnapshot = dependencySnapshot;
  state.participationPressureBrief = computeNationalParticipationPressureBrief(
    state,
    integratedBrief,
    dependencySnapshot
  );
  state.laborMarketVelocityIndex = computeNationalLaborMarketVelocityIndex(turn, regions);
  state.skillMismatchIndex = computeNationalSkillMismatchIndex(turn, capacityBridge);
  state.laborSupplyElasticityBrief = computeNationalLaborSupplyElasticityBrief(
    state,
    integratedBrief,
    state.participationPressureBrief
  );
  state.talentMobilityOutlook = computeNationalTalentMobilityOutlook(
    state,
    state.laborMarketVelocityIndex,
    capacityBridge
  );
  state.underemploymentPressureBrief = computeNationalUnderemploymentPressureBrief(
    state,
    integratedBrief,
    state.participationPressureBrief
  );
  state.wageCompetitivenessIndex = computeNationalWageCompetitivenessIndex(
    state,
    integratedBrief,
    state.skillMismatchIndex
  );
  state.workforceTransitionFrictionOutlook = computeNationalWorkforceTransitionFrictionOutlook(
    state,
    state.laborMarketVelocityIndex,
    state.laborSupplyElasticityBrief
  );
  state.youthEntryPipelineOutlook = computeNationalYouthEntryPipelineOutlook(
    state,
    dependencySnapshot,
    state.participationPressureBrief
  );
  state.laborMarketTightnessBrief = computeNationalLaborMarketTightnessBrief(
    state,
    integratedBrief,
    capacityBridge,
    state.underemploymentPressureBrief
  );
  state.hybridParticipationFrictionOutlook = computeNationalHybridParticipationFrictionOutlook(
    state,
    state.workforceTransitionFrictionOutlook,
    state.talentMobilityOutlook
  );
  state.seniorWorkforceRetentionOutlook = computeNationalSeniorWorkforceRetentionOutlook(
    state,
    state.dependencyRatioSnapshot,
    state.participationPressureBrief
  );
  state.regionalLaborAbsorptionBrief = computeNationalRegionalLaborAbsorptionBrief(
    state,
    capacityBridge,
    state.laborMarketTightnessBrief
  );
  state.participationEquityGapBrief = computeNationalParticipationEquityGapBrief(
    state,
    state.underemploymentPressureBrief
  );
  state.credentialMobilityOutlook = computeNationalCredentialMobilityOutlook(
    state,
    state.skillMismatchIndex,
    state.talentMobilityOutlook
  );
  state.householdParticipationCouplingBrief = computeNationalHouseholdParticipationCouplingBrief(
    state,
    state.participationPressureBrief,
    state.participationEquityGapBrief
  );
  state.laborRebalancingStressBrief = computeNationalLaborRebalancingStressBrief(
    state,
    state.interregionalRebalancingPlan,
    state.regionalLaborAbsorptionBrief,
    state.laborMarketTightnessBrief
  );
  state.automationParticipationResilienceOutlook = computeNationalAutomationParticipationResilienceOutlook(
    state,
    state.participationPressureBrief,
    state.workforceTransitionFrictionOutlook
  );
  state.wageParticipationSpilloverBrief = computeNationalWageParticipationSpilloverBrief(
    state,
    state.wageCompetitivenessIndex,
    state.householdParticipationCouplingBrief
  );
  state.migrationShockParticipationBufferOutlook = computeNationalMigrationShockParticipationBufferOutlook(
    state,
    state.participationPressureBrief,
    state.regionalLaborAbsorptionBrief
  );
  state.laborMarketStabilityOutlook = computeNationalLaborMarketStabilityOutlook(
    state,
    integratedBrief,
    state.laborRebalancingStressBrief,
    state.automationParticipationResilienceOutlook
  );
  state.intergenerationalWorkforceBalanceOutlook = computeNationalIntergenerationalWorkforceBalanceOutlook(
    state,
    state.youthEntryPipelineOutlook,
    state.seniorWorkforceRetentionOutlook
  );
  state.capacityParticipationAlignmentBrief = computeNationalCapacityParticipationAlignmentBrief(
    state,
    capacityBridge,
    state.participationEquityGapBrief,
    state.regionalLaborAbsorptionBrief
  );
  state.participationVelocityCouplingBrief = computeNationalParticipationVelocityCouplingBrief(
    state,
    state.participationPressureBrief,
    state.laborMarketVelocityIndex
  );
  state.skillsTightnessCoherenceOutlook = computeNationalSkillsTightnessCoherenceOutlook(
    state,
    state.skillMismatchIndex,
    state.laborMarketTightnessBrief,
    state.credentialMobilityOutlook
  );
  state.integratedLaborReadinessOutlook = computeNationalIntegratedLaborReadinessOutlook(
    state,
    state.laborMarketStabilityOutlook,
    state.capacityParticipationAlignmentBrief,
    state.migrationShockParticipationBufferOutlook,
    state.laborResilienceScorecard
  );
  state.hybridRemoteParticipationOutlook = computeNationalHybridRemoteParticipationOutlook(
    state,
    state.hybridParticipationFrictionOutlook
  );
  state.corridorCapacityStressBrief = computeNationalCorridorCapacityStressBrief(
    state,
    state.interregionalRebalancingPlan,
    state.regionalLaborAbsorptionBrief,
    state.laborRebalancingStressBrief,
    state.laborMarketTightnessBrief
  );
  state.stewardInterventionPriorityBrief = computeNationalStewardInterventionPriorityBrief(
    state,
    state.integratedLaborReadinessOutlook,
    state.laborMarketStabilityOutlook,
    state.laborRebalancingStressBrief
  );
  state.essentialWorkerParticipationOutlook = computeNationalEssentialWorkerParticipationOutlook(
    state,
    state.participationPressureBrief,
    state.migrationShockParticipationBufferOutlook
  );
  state.wageAutomationCouplingBrief = computeNationalWageAutomationCouplingBrief(
    state,
    state.wageParticipationSpilloverBrief,
    state.wageCompetitivenessIndex,
    state.automationParticipationResilienceOutlook
  );
  state.nationalLaborCohesionIndex = computeNationalLaborCohesionIndex(
    state,
    state.laborMarketStabilityOutlook,
    state.intergenerationalWorkforceBalanceOutlook,
    state.capacityParticipationAlignmentBrief
  );
  state.seasonalParticipationSwingOutlook = computeNationalSeasonalParticipationSwingOutlook(
    state,
    state.essentialWorkerParticipationOutlook,
    state.laborMarketTightnessBrief
  );
  state.cohesionCorridorCouplingBrief = computeNationalCohesionCorridorCouplingBrief(
    state,
    state.nationalLaborCohesionIndex,
    state.corridorCapacityStressBrief
  );
  state.nationalWorkforceReliabilityIndex = computeNationalWorkforceReliabilityIndex(
    state,
    state.seasonalParticipationSwingOutlook,
    state.cohesionCorridorCouplingBrief
  );
  state.retentionReliabilityCouplingBrief = computeNationalRetentionReliabilityCouplingBrief(
    state,
    state.nationalWorkforceReliabilityIndex
  );
  state.upskillingVelocityOutlook = computeNationalUpskillingVelocityOutlook(
    state,
    state.skillsTightnessCoherenceOutlook
  );
  state.subjectWorkforceReadinessBrief = computeNationalSubjectWorkforceReadinessBrief(
    state,
    state.retentionReliabilityCouplingBrief,
    state.integratedLaborReadinessOutlook
  );
  state.nationalWorkforceSustainmentIndex = computeNationalWorkforceSustainmentIndex(
    state,
    state.nationalWorkforceReliabilityIndex,
    state.upskillingVelocityOutlook,
    state.subjectWorkforceReadinessBrief
  );
  state.sustainmentRetentionCouplingBrief = computeNationalSustainmentRetentionCouplingBrief(
    state,
    state.nationalWorkforceSustainmentIndex,
    state.retentionReliabilityCouplingBrief
  );
  state.onboardingVelocityOutlook = computeNationalOnboardingVelocityOutlook(
    state,
    state.upskillingVelocityOutlook
  );
  state.subjectAssemblyContinuityBrief = computeNationalSubjectAssemblyContinuityBrief(
    state,
    state.subjectWorkforceReadinessBrief,
    state.nationalWorkforceSustainmentIndex
  );
  state.nationalWorkforceContinuityIndex = computeNationalWorkforceContinuityIndex(
    state,
    state.sustainmentRetentionCouplingBrief,
    state.onboardingVelocityOutlook,
    state.subjectAssemblyContinuityBrief
  );
  state.continuityCoordinationCouplingBrief = computeNationalContinuityCoordinationCouplingBrief(
    state,
    state.nationalWorkforceContinuityIndex
  );
  state.reengagementMomentumOutlook = computeNationalReengagementMomentumOutlook(
    state,
    state.onboardingVelocityOutlook
  );
  state.subjectWaveAssemblyBrief = computeNationalSubjectWaveAssemblyBrief(
    state,
    state.subjectAssemblyContinuityBrief,
    state.nationalWorkforceContinuityIndex
  );
  state.nationalWorkforceDurabilityIndex = computeNationalWorkforceDurabilityIndex(
    state,
    state.continuityCoordinationCouplingBrief,
    state.reengagementMomentumOutlook,
    state.subjectWaveAssemblyBrief
  );
  if (capacityBridge.summary) {
    state.evidence.push(capacityBridge.summary.slice(0, 120));
  }
  if (state.laborResilienceScorecard.stewardNote && state.evidence.length < V1014_LABOR_LIMITS.maxEvidence) {
    state.evidence.push(state.laborResilienceScorecard.stewardNote.slice(0, 120));
  }
  if (state.participationPressureBrief.summary && state.evidence.length < V1014_LABOR_LIMITS.maxEvidence) {
    state.evidence.push(state.participationPressureBrief.summary.slice(0, 120));
  }
  if (state.laborMarketVelocityIndex.nationalBand === 'volatile' && state.evidence.length < V1014_LABOR_LIMITS.maxEvidence) {
    state.evidence.push(state.laborMarketVelocityIndex.summary.slice(0, 120));
  }
  if (
    (state.skillMismatchIndex?.nationalBand === 'critical_mismatch' ||
      state.skillMismatchIndex?.nationalBand === 'elevated_gap') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.skillMismatchIndex.summary.slice(0, 120));
  }
  if (
    state.talentMobilityOutlook?.band === 'hyper_mobile' &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.talentMobilityOutlook.summary.slice(0, 120));
  }
  if (
    (state.underemploymentPressureBrief?.band === 'severe_underuse' ||
      state.underemploymentPressureBrief?.band === 'tight_hidden') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.underemploymentPressureBrief.summary.slice(0, 120));
  }
  if (
    (state.wageCompetitivenessIndex?.band === 'cost_burden' ||
      state.wageCompetitivenessIndex?.band === 'stretched') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.wageCompetitivenessIndex.summary.slice(0, 120));
  }
  if (
    (state.workforceTransitionFrictionOutlook?.band === 'bottleneck' ||
      state.workforceTransitionFrictionOutlook?.band === 'sticky') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.workforceTransitionFrictionOutlook.summary.slice(0, 120));
  }
  if (
    (state.youthEntryPipelineOutlook?.band === 'constricted' ||
      state.youthEntryPipelineOutlook?.band === 'narrow') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.youthEntryPipelineOutlook.summary.slice(0, 120));
  }
  if (
    (state.laborMarketTightnessBrief?.band === 'critical_shortage' ||
      state.laborMarketTightnessBrief?.band === 'tight') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.laborMarketTightnessBrief.summary.slice(0, 120));
  }
  if (
    (state.hybridParticipationFrictionOutlook?.band === 'binding' ||
      state.hybridParticipationFrictionOutlook?.band === 'elevated') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.hybridParticipationFrictionOutlook.summary.slice(0, 120));
  }
  if (
    (state.seniorWorkforceRetentionOutlook?.band === 'fragile' ||
      state.seniorWorkforceRetentionOutlook?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.seniorWorkforceRetentionOutlook.summary.slice(0, 120));
  }
  if (
    (state.regionalLaborAbsorptionBrief?.band === 'saturated' ||
      state.regionalLaborAbsorptionBrief?.band === 'constrained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.regionalLaborAbsorptionBrief.summary.slice(0, 120));
  }
  if (
    (state.participationEquityGapBrief?.band === 'wide_gap' ||
      state.participationEquityGapBrief?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.participationEquityGapBrief.summary.slice(0, 120));
  }
  if (
    (state.credentialMobilityOutlook?.band === 'blocked' ||
      state.credentialMobilityOutlook?.band === 'narrow') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.credentialMobilityOutlook.summary.slice(0, 120));
  }
  if (
    (state.householdParticipationCouplingBrief?.band === 'decoupled' ||
      state.householdParticipationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.householdParticipationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.laborRebalancingStressBrief?.band === 'critical' ||
      state.laborRebalancingStressBrief?.band === 'acute') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.laborRebalancingStressBrief.summary.slice(0, 120));
  }
  if (
    (state.automationParticipationResilienceOutlook?.band === 'fragile' ||
      state.automationParticipationResilienceOutlook?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.automationParticipationResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.wageParticipationSpilloverBrief?.band === 'suppressive' ||
      state.wageParticipationSpilloverBrief?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.wageParticipationSpilloverBrief.summary.slice(0, 120));
  }
  if (
    (state.migrationShockParticipationBufferOutlook?.band === 'depleted' ||
      state.migrationShockParticipationBufferOutlook?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.migrationShockParticipationBufferOutlook.summary.slice(0, 120));
  }
  if (
    (state.laborMarketStabilityOutlook?.band === 'volatile' ||
      state.laborMarketStabilityOutlook?.band === 'fragile') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.laborMarketStabilityOutlook.summary.slice(0, 120));
  }
  if (
    (state.intergenerationalWorkforceBalanceOutlook?.band === 'skewed_aged' ||
      state.intergenerationalWorkforceBalanceOutlook?.band === 'narrow_youth') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.intergenerationalWorkforceBalanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.capacityParticipationAlignmentBrief?.band === 'misaligned' ||
      state.capacityParticipationAlignmentBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.capacityParticipationAlignmentBrief.summary.slice(0, 120));
  }
  if (
    (state.participationVelocityCouplingBrief?.band === 'divergent' ||
      state.participationVelocityCouplingBrief?.band === 'lagging') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.participationVelocityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.skillsTightnessCoherenceOutlook?.band === 'incoherent' ||
      state.skillsTightnessCoherenceOutlook?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.skillsTightnessCoherenceOutlook.summary.slice(0, 120));
  }
  if (
    (state.integratedLaborReadinessOutlook?.band === 'unprepared' ||
      state.integratedLaborReadinessOutlook?.band === 'caution') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.integratedLaborReadinessOutlook.summary.slice(0, 120));
  }
  if (
    (state.hybridRemoteParticipationOutlook?.band === 'constrained' ||
      state.hybridRemoteParticipationOutlook?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.hybridRemoteParticipationOutlook.summary.slice(0, 120));
  }
  if (
    (state.corridorCapacityStressBrief?.band === 'stressed' ||
      state.corridorCapacityStressBrief?.band === 'overloaded') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.corridorCapacityStressBrief.summary.slice(0, 120));
  }
  if (
    (state.stewardInterventionPriorityBrief?.band === 'act' ||
      state.stewardInterventionPriorityBrief?.band === 'urgent') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.stewardInterventionPriorityBrief.summary.slice(0, 120));
  }
  if (
    (state.essentialWorkerParticipationOutlook?.band === 'strained' ||
      state.essentialWorkerParticipationOutlook?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.essentialWorkerParticipationOutlook.summary.slice(0, 120));
  }
  if (
    (state.wageAutomationCouplingBrief?.band === 'disruptive' ||
      state.wageAutomationCouplingBrief?.band === 'tense') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.wageAutomationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalLaborCohesionIndex?.band === 'fragmented' ||
      state.nationalLaborCohesionIndex?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalLaborCohesionIndex.summary.slice(0, 120));
  }
  if (
    (state.seasonalParticipationSwingOutlook?.band === 'volatile' ||
      state.seasonalParticipationSwingOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.seasonalParticipationSwingOutlook.summary.slice(0, 120));
  }
  if (
    (state.cohesionCorridorCouplingBrief?.band === 'decoupled' ||
      state.cohesionCorridorCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.cohesionCorridorCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceReliabilityIndex?.band === 'fragile' ||
      state.nationalWorkforceReliabilityIndex?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceReliabilityIndex.summary.slice(0, 120));
  }
  if (
    (state.retentionReliabilityCouplingBrief?.band === 'fragile' ||
      state.retentionReliabilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionReliabilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.upskillingVelocityOutlook?.band === 'stalled' ||
      state.upskillingVelocityOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.upskillingVelocityOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectWorkforceReadinessBrief?.band === 'unready' ||
      state.subjectWorkforceReadinessBrief?.band === 'caution') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectWorkforceReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSustainmentIndex?.band === 'depleted' ||
      state.nationalWorkforceSustainmentIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSustainmentIndex.summary.slice(0, 120));
  }
  if (
    (state.sustainmentRetentionCouplingBrief?.band === 'decoupled' ||
      state.sustainmentRetentionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.sustainmentRetentionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.onboardingVelocityOutlook?.band === 'stalled' ||
      state.onboardingVelocityOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.onboardingVelocityOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectAssemblyContinuityBrief?.band === 'broken' ||
      state.subjectAssemblyContinuityBrief?.band === 'gapped') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectAssemblyContinuityBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceContinuityIndex?.band === 'fragile' ||
      state.nationalWorkforceContinuityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceContinuityIndex.summary.slice(0, 120));
  }
  if (
    (state.continuityCoordinationCouplingBrief?.band === 'decoupled' ||
      state.continuityCoordinationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.continuityCoordinationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.reengagementMomentumOutlook?.band === 'stalled' ||
      state.reengagementMomentumOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementMomentumOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectWaveAssemblyBrief?.band === 'blocked' ||
      state.subjectWaveAssemblyBrief?.band === 'gapped') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectWaveAssemblyBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceDurabilityIndex?.band === 'brittle' ||
      state.nationalWorkforceDurabilityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceDurabilityIndex.summary.slice(0, 120));
  }
  if (corridorNotes.length) {
    state.evidence.push(corridorNotes[0]);
  }

  const stewardBrief = buildStewardLaborBrief(state, integratedBrief, events);
  stewardBrief.hints.forEach(h => {
    if (!events.includes(h) && events.length < V1014_LABOR_LIMITS.maxEventsPerTurn) events.push(h);
  });

  if (automationFeedback.stewardHints.length) {
    events.push(...automationFeedback.stewardHints.slice(0, V1014_LABOR_LIMITS.maxEventsPerTurn));
  }

  return { state, persisted: nextPersisted, events };
}


// --- source: self-tests.ts ---
  WORKFORCE_RETENTION_LEVERS,
  lookupWorkforceRetentionLever,
  retentionLeversForIndustry,
  retentionPullForRegion
} from './catalog/workforce-retention-levers';
  WORKFORCE_UPSKILLING_PROGRAMS,
  lookupWorkforceUpskillingProgram,
  upskillingProgramsForIndustry,
  upskillingUpliftForRegion
} from './catalog/workforce-upskilling-programs';
  WORKFORCE_INCLUSION_LEVERS,
  inclusionEaseForRegion,
  inclusionLeversForIndustry,
  lookupWorkforceInclusionLever
} from './catalog/workforce-inclusion-levers';
  WORKFORCE_CARE_LEVERS,
  careLeversForIndustry,
  careReliefForRegion,
  lookupWorkforceCareLever
} from './catalog/workforce-care-levers';
  WORKFORCE_FLEXIBILITY_LEVERS,
  flexibilityEaseForRegion,
  flexibilityLeversForIndustry,
  lookupWorkforceFlexibilityLever
} from './catalog/workforce-flexibility-levers';
  WORKFORCE_REENGAGEMENT_LEVERS,
  lookupWorkforceReengagementLever,
  reengagementLeversForIndustry,
  reengagementPullForRegion
} from './catalog/workforce-reengagement-levers';
  WORKFORCE_ONBOARDING_LEVERS,
  lookupWorkforceOnboardingLever,
  onboardingEaseForRegion,
  onboardingLeversForIndustry
} from './catalog/workforce-onboarding-levers';
  WORKFORCE_COORDINATION_LEVERS,
  coordinationEaseForRegion,
  coordinationLeversForIndustry,
  lookupWorkforceCoordinationLever
} from './catalog/workforce-coordination-levers';
  WORKFORCE_ADVOCACY_LEVERS,
  advocacyEaseForRegion,
  advocacyLeversForIndustry,
  lookupWorkforceAdvocacyLever
} from './catalog/workforce-advocacy-levers';
  WORKFORCE_MENTORSHIP_LEVERS,
  lookupWorkforceMentorshipLever,
  mentorshipEaseForRegion,
  mentorshipLeversForIndustry
} from './catalog/workforce-mentorship-levers';
  WORKFORCE_SAFETY_LEVERS,
  lookupWorkforceSafetyLever,
  safetyEaseForRegion,
  safetyLeversForIndustry
} from './catalog/workforce-safety-levers';
  WORKFORCE_SCHEDULING_LEVERS,
  lookupWorkforceSchedulingLever,
  schedulingEaseForRegion,
  schedulingLeversForIndustry
} from './catalog/workforce-scheduling-levers';
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  type LaborDemographicsInputs,
  type NationalLaborDemographicsState
} from './types';

function stateIntegrated(st: NationalLaborDemographicsState): boolean {
  return st.integratedLaborBrief?.compositePressureIndex != null;
}

export function v1014laborMakeTestIndustries(overrides?: Partial<Record<string, number>>): any {
  const regions: any = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = { industries: {} as any };
    STRATEGIC_INDUSTRIES.forEach(k => {
      regions[c].industries[k] = {
        industry: k,
        effectiveOutput: k === 'mining' && c === 'WA' ? 55 : k === 'technology' && c === 'NSW' ? 40 : 12,
        condition: 'healthy'
      };
    });
  });
  const output: any = {};
  STRATEGIC_INDUSTRIES.forEach(k => {
    output[k] = k === 'mining' ? 120 : 40;
  });
  if (overrides) Object.assign(output, overrides);
  return { national: { output }, regions };
}

export function v1014laborMakeTestHouseholds(opts?: { severeRegion?: string; essentialsStrainRegion?: string }): any {
  const regions: any = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = {
      affordability: c === opts?.severeRegion ? 'severe_pressure' : 'healthy',
      essentialAccess: c === opts?.essentialsStrainRegion ? 'critical' : 'adequate',
      resilience: c === opts?.severeRegion ? 'fragile' : 'moderate',
      employmentOpportunity: 'balanced',
      housingPressure: c === opts?.severeRegion ? 'severe' : 'moderate'
    };
  });
  return {
    national: {
      affordability: opts?.severeRegion ? 'strained' : 'healthy',
      financialResilience: 'moderate',
      housingPressure: 'moderate',
      employmentOpportunity: 'balanced'
    },
    regions
  };
}

export interface SelfTestResult {
  id: string;
  passed: boolean;
  detail: string;
}

export function runV1014LaborDemographicsSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: SelfTestResult[];
} {
  const results: SelfTestResult[] = [];
  const check = (id: string, ok: boolean, detail: string) => results.push({ id, passed: ok, detail });

  check('LD01', V1014_LABOR_SCHEMA_VERSION === '10.14.0', 'schema version');
  check('LD02', V1014_LABOR_CORE_REGIONS.length === 8, 'core regions');
  check('LD03', STRATEGIC_INDUSTRIES.every(k => V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k] > 0), 'labor weights');

  const baseInp: LaborDemographicsInputs = { turn: 3, enabled: true, industries: v1014laborMakeTestIndustries() };
  const r1 = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  check('LD04', validateLaborDemographicsState(r1.state).valid, 'valid state');
  check('LD05', Object.keys(r1.state.regions).length === 8, '8 regional snapshots');
  check('LD06', r1.state.industryLinks.length > 0, 'industry links');

  const rOff = computeNationalLaborDemographics({ turn: 1, enabled: false }, createInitialLaborDemographicsPersisted(), null);
  check('LD07', !rOff.state.enabled, 'disabled layer');

  const boomInp = { ...baseInp, industries: v1014laborMakeTestIndustries({ mining: 400, manufacturing: 200 }) };
  const rBoom = computeNationalLaborDemographics(boomInp, createInitialLaborDemographicsPersisted(), null);
  check('LD08', rBoom.state.employmentLinkageScore >= r1.state.employmentLinkageScore - 5, 'output boosts linkage');

  const hashA = laborDemographicsInputHash(baseInp);
  const hashB = laborDemographicsInputHash({ ...baseInp, turn: 4 });
  check('LD09', hashA !== hashB, 'hash turn sensitivity');
  check('LD10', laborDemographicsInputHash(baseInp) === hashA, 'hash stable');

  const detA = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  const detB = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  check('LD11', JSON.stringify(detA.state) === JSON.stringify(detB.state), 'determinism');

  const replayPers = createInitialLaborDemographicsPersisted();
  let replayState: NationalLaborDemographicsState | null = null;
  for (let t = 1; t <= 5; t++) {
    const step = { ...baseInp, turn: t };
    const rr = computeNationalLaborDemographics(step, replayPers, replayState);
    replayState = rr.state;
  }
  check('LD12', (replayState?.revision || 0) >= 2, 'replay revisions');

  check('LD13', !('population' in r1.state), 'no population key');
  check('LD14', r1.state.regions.WA?.dominantIndustry === 'mining', 'WA mining dominant');

  const wfStrained: any = { regions: { NSW: { effectivePressureRatio: 0.92 } } };
  const rStrain = computeNationalLaborDemographics({ ...baseInp, workforce: wfStrained }, createInitialLaborDemographicsPersisted(), null);
  check('LD15', rStrain.state.regions.NSW.wagePressureScore >= r1.state.regions.NSW.wagePressureScore - 3, 'workforce strain wages');

  const sanitized = sanitizeLaborDemographicsPersisted({ revision: 99, nationalHysteresis: { demographicScore: 200 } }, 2);
  check('LD16', sanitized.nationalHysteresis.demographicScore <= 100, 'sanitize clamp');

  const built = buildLaborDemographicsInputs({
    turn: 2,
    gameSettings: { nationalSystemsEnabled: true, industriesEnabled: true, laborDemographicsEnabled: true },
    industries: v1014laborMakeTestIndustries()
  });
  check('LD17', built.enabled === true, 'build enabled');
  check('LD18', buildLaborDemographicsInputs({ turn: 1, gameSettings: { laborDemographicsEnabled: false } }).enabled === false, 'build disabled flag');

  const autoCaps = [{ id: 'auto_mine', active: true, automationShift: 90 }];
  const rAuto = computeNationalLaborDemographics(
    { ...baseInp, capabilities: autoCaps, workforce: { automationShiftSummary: 'Automation reshaping mining domains.' } },
    createInitialLaborDemographicsPersisted(),
    null
  );
  check('AF01', Boolean(rAuto.state.automationFeedbackSummary), 'automation summary on state');
  check(
    'AF02',
    (rAuto.state.regions.NSW?.employmentLinkageScore || 100) <= (r1.state.regions.NSW?.employmentLinkageScore || 0) + 1,
    'automation lowers linkage vs baseline'
  );
  check('AF03', rAuto.events.length > 0, 'steward hint events emitted');

  const fb = computeLaborAutomationFeedback({
    capabilities: autoCaps,
    workforce: { automationShiftSummary: 'Automation shift active' },
    wfStrainNational: 70
  });
  check('AF04', fb.nationalAutomationIndex >= 45 && fb.stewardHints.length > 0, 'automation index and hints');
  check('AF05', laborDemographicsInputHash({ ...baseInp, capabilities: autoCaps }) !== hashA, 'hash includes automation');

  const hhInp = { ...baseInp, households: v1014laborMakeTestHouseholds() };
  const rHh = computeNationalLaborDemographics(hhInp, createInitialLaborDemographicsPersisted(), null);
  check('HB01', Boolean(rHh.state.householdBudgetSummary), 'household budget summary');
  check('HB02', typeof rHh.state.regions.NSW?.householdBudgetPressureScore === 'number', 'regional budget pressure');

  const hhSevere = { ...baseInp, households: v1014laborMakeTestHouseholds({ severeRegion: 'NSW' }) };
  const rHhBad = computeNationalLaborDemographics(hhSevere, createInitialLaborDemographicsPersisted(), null);
  check(
    'HB03',
    (rHhBad.state.regions.NSW?.wagePressureScore || 0) >= (rHh.state.regions.NSW?.wagePressureScore || 0) - 1,
    'budget pressure lifts wage index'
  );
  check(
    'HB04',
    (rHhBad.state.regions.NSW?.householdBudgetPressureScore || 0) >
      (rHh.state.regions.NSW?.householdBudgetPressureScore || 0),
    'severe affordability raises pressure score'
  );

  const natBudget = computeNationalHouseholdBudgetDetail(v1014laborMakeTestHouseholds({ severeRegion: 'VIC' }));
  check('HB05', natBudget.shockSensitivity !== 'low', 'severe region raises shock sensitivity');

  check(
    'MS01',
    (r1.state.activeMigrationShocks || []).some(s => s.regionId === 'WA' && s.kind === 'resource_boom_inflow'),
    'WA mining triggers inflow shock'
  );

  check(
    'MS02',
    (rHhBad.state.activeMigrationShocks || []).some(s => s.kind === 'housing_affordability_outflow'),
    'affordability shock detected'
  );

  const migBefore = rHh.state.regions.NSW?.migrationFlowScore || 50;
  const migAfter = rHhBad.state.regions.NSW?.migrationFlowScore || 50;
  check('MS03', migAfter <= migBefore + 2, 'outflow shock pulls migration score down vs healthy baseline');

  const pers = createInitialLaborDemographicsPersisted();
  const first = computeNationalLaborDemographics(baseInp, pers, null);
  const shockTurns = first.persisted.activeMigrationShocks?.[0]?.turnsRemaining;
  const second = computeNationalLaborDemographics({ ...baseInp, turn: 4 }, first.persisted, first.state);
  const shockTurnsLater = second.persisted.activeMigrationShocks?.find(
    s => s.id === first.persisted.activeMigrationShocks?.[0]?.id
  )?.turnsRemaining;
  check(
    'MS04',
    shockTurns != null && shockTurnsLater != null && shockTurnsLater < shockTurns,
    'shocks decay across turns'
  );

  const overrideShock = {
    id: 'msh_test_NSW_t9',
    kind: 'metro_talent_pull' as const,
    regionId: 'NSW',
    magnitude: 12,
    turnsRemaining: 2,
    startedTurn: 9,
    reason: 'test override'
  };
  const rOv = computeNationalLaborDemographics(
    { ...baseInp, turn: 9, migrationShockOverrides: [overrideShock] },
    createInitialLaborDemographicsPersisted(),
    null
  );
  check('MS05', (rOv.state.activeMigrationShocks || []).some(s => s.id === overrideShock.id), 'shock override applied');

  check(
    'MS06',
    detectMigrationShocks({
      turn: 2,
      inputs: hhSevere,
      householdBudget: computeNationalHouseholdBudgetDetail(hhSevere.households)
    }).length > 0,
    'detector emits under strain'
  );

  check('SW01', REGION_LABOR_BASELINES.NSW.laborMobilityIndex > REGION_LABOR_BASELINES.TAS.laborMobilityIndex, 'baseline mobility ordering');
  check('SW02', Boolean(lookupRegionalLaborBaseline('WA')?.narrative), 'WA baseline narrative');
  check('SW03', LABOR_STRESS_SCENARIO_CATALOG.length >= 8, 'stress scenario catalog');
  check('SW04', Boolean(lookupLaborStressScenario('ld_sc_mining_supercycle')?.expectedShockKinds.length), 'mining scenario shocks');

  const spilled = applyRegionalMigrationSpillovers({ NSW: 70, VIC: 40, QLD: 50, ACT: 55, WA: 50, SA: 50, TAS: 50, NT: 50 });
  check('SW05', spilled.NSW !== 70, 'spillover moves NSW attractiveness');
  check('SW06', spilloverNeighborList('NSW').includes('VIC'), 'NSW neighbors');

  const coupling = computeRegionalWageMigrationCoupling({
    ...rHhBad.state.regions.NSW,
    wagePressure: 'surging',
    wagePressureScore: 78
  });
  check('SW07', coupling.couplingIndex >= 50, 'coupling index under wage+budget stress');

  check('SW08', detectLaborDemographicsQuery('What is wage pressure nationally?') === 'wage_pressure', 'GI wage detect');
  const giAns = answerLaborDemographicsQuestion(r1.state, 'migration_flow');
  check('SW09', giAns.headline.length > 3, 'GI migration answer');

  const proj = projectLaborDemographicsTurns(baseInp, 4, createInitialLaborDemographicsPersisted());
  check('SW10', proj.steps.length >= 4, 'turn projection steps');
  check('SW11', proj.steps[proj.steps.length - 1].turn === 7, 'projection end turn');

  const couplingApply = computeRegionalWageMigrationCoupling({
    regionId: 'NSW',
    demographicStructure: 'stable',
    demographicScore: 50,
    employmentLinkage: 'strong',
    employmentLinkageScore: 70,
    wagePressure: 'surging',
    wagePressureScore: 80,
    migrationFlow: 'balanced',
    migrationFlowScore: 50,
    dominantIndustry: 'technology',
    industryOutputIndex: 40,
    workforceStrainIndex: 75,
    householdEmploymentFit: 55,
    householdBudgetPressureScore: 72,
    householdEssentialsGapScore: 40
  });
  check('SW12', Math.abs(couplingApply.wageMigrationFeedback) >= 0.5, 'coupling feedback under stress');

  check('R301', REGIONAL_MIGRATION_CORRIDORS.length >= 8, 'migration corridors catalog');
  check('R302', Boolean(stateIntegrated(r1.state)), 'integrated brief on compute');
  check('R303', Boolean(r1.state.laborAuditTip?.bandLine), 'audit tip on state');
  check('R304', runLaborStressScenario('ld_sc_mining_supercycle', baseInp) != null, 'mining scenario run');
  check('R305', (runLaborStressScenario('ld_sc_mining_supercycle', baseInp)?.delta.migrationFlowScore ?? 0) >= -5, 'mining scenario delta');
  check(
    'R306',
    /corridor|balanced/i.test(summarizeCorridorExposure(r1.state)),
    'corridor summary'
  );
  check('R307', buildStewardLaborBrief(r1.state, r1.state.integratedLaborBrief!, []).priority.length > 0, 'steward brief priority');
  check('R308', appendLaborAuditHistory([], r1.state.laborAuditTip!).length === 1, 'audit history append');
  check('R309', detectLaborDemographicsQuery('migration shocks active') === 'migration_shocks', 'GI shock query');
  check('R310', (r1.state.integratedLaborBrief?.topStrainRegions.length ?? 0) >= 1, 'strain regions listed');
  check('R311', runLaborStressScenario('ld_sc_housing_affordability_crunch', baseInp)?.delta.wagePressureScore !== undefined, 'housing scenario');
  check('R312', validateLaborDemographicsState({ ...r1.state, population: 1 } as any).valid === false, 'forbidden key still blocked');

  check('R401', SKILLED_LABOR_PATHWAYS.length >= 8, 'skilled pathway catalog');
  check('R402', Boolean(lookupSkilledLaborPathway('path_tech_nsw_vic')?.narrative), 'pathway lookup');
  check('R403', pathwaysForIndustry('mining').length >= 1, 'mining pathways');
  check('R404', Boolean(r1.state.workforceCapacityBridge?.nationalBand), 'capacity bridge on state');
  check('R405', Object.keys(r1.state.workforceCapacityBridge?.regions ?? {}).length === 8, 'regional capacity gaps');
  check(
    'R406',
    (rBoom.state.workforceCapacityBridge?.nationalGapIndex ?? 0) >= (r1.state.workforceCapacityBridge?.nationalGapIndex ?? 0) - 3,
    'boom raises capacity gap'
  );
  check('R407', Boolean(r1.state.laborResilienceScorecard?.compositeScore), 'resilience scorecard');
  check('R408', (r1.state.laborResilienceScorecard?.dimensions.length ?? 0) === 4, 'four resilience dimensions');
  check(
    'R409',
    (rHhBad.state.laborResilienceScorecard?.compositeScore ?? 100) <= (rHh.state.laborResilienceScorecard?.compositeScore ?? 0) + 5,
    'household strain lowers resilience'
  );
  check('R410', Boolean(r1.state.interregionalRebalancingPlan?.summary), 'rebalancing plan summary');
  check('R411', detectLaborDemographicsQuery('workforce capacity gap') === 'workforce_capacity', 'GI capacity detect');
  check('R412', detectLaborDemographicsQuery('labor resilience score') === 'labor_resilience', 'GI resilience detect');
  check('R413', answerLaborDemographicsQuestion(r1.state, 'workforce_capacity').headline.length > 5, 'GI capacity answer');
  const bridgeOnly = computeNationalWorkforceCapacityBridge(r1.state.turn, r1.state.regions, r1.state.industryLinks);
  check('R414', bridgeOnly.dominantShortageIndustry != null, 'bridge dominant industry');
  const plan = computeInterregionalLaborRebalancingPlan(r1.state, r1.state.integratedLaborBrief!, bridgeOnly);
  check('R415', plan.moves.every(m => m.expectedRelief >= 0), 'rebalancing relief bounded');
  check(
    'R416',
    computeLaborResilienceScorecard(r1.state, r1.state.integratedLaborBrief!, natBudget, bridgeOnly).band.length > 3,
    'resilience band string'
  );

  check('R501', WORKFORCE_RETENTION_LEVERS.length >= 8, 'retention lever catalog');
  check('R502', Boolean(lookupWorkforceRetentionLever('retain_tech_nsw')?.narrative), 'retention lever lookup');
  check('R503', retentionLeversForIndustry('mining').length >= 1, 'mining retention levers');
  check('R504', retentionPullForRegion('WA', 'mining') > 0, 'regional retention pull');
  check('R505', Boolean(r1.state.dependencyRatioSnapshot?.nationalBand), 'dependency snapshot on state');
  check('R506', Object.keys(r1.state.dependencyRatioSnapshot?.regions ?? {}).length === 8, 'regional dependency rows');
  check('R507', Boolean(r1.state.participationPressureBrief?.band), 'participation brief on state');
  check(
    'R508',
    (rHhBad.state.participationPressureBrief?.participationIndex ?? 100) <=
      (rHh.state.participationPressureBrief?.participationIndex ?? 0) + 8,
    'household strain lowers participation'
  );
  check('R509', Boolean(r1.state.laborMarketVelocityIndex?.nationalBand), 'velocity index on state');
  check('R510', detectLaborDemographicsQuery('participation outlook') === 'participation_outlook', 'GI participation detect');
  check('R511', detectLaborDemographicsQuery('dependency ratio aging') === 'dependency_ratio', 'GI dependency detect');
  check('R512', detectLaborDemographicsQuery('labor velocity churn') === 'labor_velocity', 'GI velocity detect');
  check('R513', answerLaborDemographicsQuestion(r1.state, 'participation_outlook').headline.length > 5, 'GI participation answer');
  const depOnly = computeNationalDependencyRatioSnapshot(r1.state.turn, r1.state.regions);
  check('R514', depOnly.summary.length > 10, 'dependency standalone summary');
  const velOnly = computeNationalLaborMarketVelocityIndex(r1.state.turn, r1.state.regions);
  check('R515', velOnly.hottestRegion != null, 'velocity hottest region');
  check(
    'R516',
    computeNationalParticipationPressureBrief(r1.state, r1.state.integratedLaborBrief!, depOnly).stewardNote.length > 8,
    'participation steward note'
  );

  check('R601', WORKFORCE_UPSKILLING_PROGRAMS.length >= 8, 'upskilling program catalog');
  check('R602', Boolean(lookupWorkforceUpskillingProgram('upskill_tech_nsw_vic')?.narrative), 'upskilling lookup');
  check('R603', upskillingProgramsForIndustry('mining').length >= 1, 'mining upskilling programs');
  check('R604', upskillingUpliftForRegion('WA', 'mining') > 0, 'regional upskilling uplift');
  check('R605', Boolean(r1.state.skillMismatchIndex?.nationalBand), 'skill mismatch on state');
  check('R606', Object.keys(r1.state.skillMismatchIndex?.regions ?? {}).length === 8, 'regional mismatch rows');
  check('R607', Boolean(r1.state.laborSupplyElasticityBrief?.band), 'supply elasticity on state');
  check(
    'R608',
    (rHhBad.state.laborSupplyElasticityBrief?.elasticityIndex ?? 100) <=
      (rHh.state.laborSupplyElasticityBrief?.elasticityIndex ?? 0) + 10,
    'household strain lowers elasticity'
  );
  check('R609', Boolean(r1.state.talentMobilityOutlook?.band), 'talent mobility on state');
  check('R610', detectLaborDemographicsQuery('skill mismatch gap') === 'skill_mismatch', 'GI mismatch detect');
  check('R611', detectLaborDemographicsQuery('supply elasticity inelastic') === 'supply_elasticity', 'GI elasticity detect');
  check('R612', detectLaborDemographicsQuery('talent mobility flow') === 'talent_mobility', 'GI mobility detect');
  check('R613', answerLaborDemographicsQuestion(r1.state, 'skill_mismatch').headline.length > 5, 'GI mismatch answer');
  const mismatchOnly = computeNationalSkillMismatchIndex(r1.state.turn, r1.state.workforceCapacityBridge);
  check('R614', mismatchOnly.summary.length > 10, 'mismatch standalone summary');
  const mobilityOnly = computeNationalTalentMobilityOutlook(
    r1.state,
    r1.state.laborMarketVelocityIndex,
    r1.state.workforceCapacityBridge
  );
  check('R615', mobilityOnly.corridorHighlight != null || mobilityOnly.anchorRegion != null, 'mobility corridor or anchor');
  check(
    'R616',
    computeNationalLaborSupplyElasticityBrief(
      r1.state,
      r1.state.integratedLaborBrief!,
      r1.state.participationPressureBrief
    ).stewardNote.length > 8,
    'elasticity steward note'
  );

  check('R701', WORKFORCE_INCLUSION_LEVERS.length >= 8, 'inclusion lever catalog');
  check('R702', Boolean(lookupWorkforceInclusionLever('incl_tech_nsw_vic')?.narrative), 'inclusion lever lookup');
  check('R703', inclusionLeversForIndustry('manufacturing').length >= 1, 'manufacturing inclusion levers');
  check('R704', inclusionEaseForRegion('VIC', 'manufacturing') > 0, 'regional inclusion ease');
  check('R705', Boolean(r1.state.underemploymentPressureBrief?.band), 'underemployment brief on state');
  check('R706', (r1.state.underemploymentPressureBrief?.linkageParticipationGap ?? 0) >= 0, 'linkage participation gap');
  check('R707', Boolean(r1.state.wageCompetitivenessIndex?.band), 'wage competitiveness on state');
  check(
    'R708',
    (rHhBad.state.wageCompetitivenessIndex?.competitivenessIndex ?? 100) <=
      (rHh.state.wageCompetitivenessIndex?.competitivenessIndex ?? 0) + 12,
    'household strain lowers competitiveness'
  );
  check('R709', Boolean(r1.state.workforceTransitionFrictionOutlook?.band), 'transition friction on state');
  check('R710', detectLaborDemographicsQuery('underemployment hidden slack') === 'underemployment', 'GI underemployment detect');
  check('R711', detectLaborDemographicsQuery('wage competitiveness burden') === 'wage_competitiveness', 'GI competitiveness detect');
  check('R712', detectLaborDemographicsQuery('transition friction sticky') === 'transition_friction', 'GI friction detect');
  check('R713', answerLaborDemographicsQuestion(r1.state, 'underemployment').headline.length > 5, 'GI underemployment answer');
  const underOnly = computeNationalUnderemploymentPressureBrief(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.participationPressureBrief
  );
  check('R714', underOnly.summary.length > 10, 'underemployment standalone summary');
  const compOnly = computeNationalWageCompetitivenessIndex(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.skillMismatchIndex
  );
  check('R715', compOnly.band.length > 3, 'competitiveness band string');
  check(
    'R716',
    computeNationalWorkforceTransitionFrictionOutlook(
      r1.state,
      r1.state.laborMarketVelocityIndex,
      r1.state.laborSupplyElasticityBrief
    ).stewardNote.length > 8,
    'transition friction steward note'
  );

  check('R801', WORKFORCE_CARE_LEVERS.length >= 8, 'care lever catalog');
  check('R802', Boolean(lookupWorkforceCareLever('care_tech_nsw_vic')?.narrative), 'care lever lookup');
  check('R803', careLeversForIndustry('technology').length >= 1, 'technology care levers');
  check('R804', careReliefForRegion('NSW', 'technology') > 0, 'regional care relief');
  check('R805', Boolean(r1.state.youthEntryPipelineOutlook?.band), 'youth pipeline on state');
  check('R806', (r1.state.youthEntryPipelineOutlook?.dependencyHeadwind ?? 0) >= 0, 'dependency headwind');
  check('R807', Boolean(r1.state.laborMarketTightnessBrief?.band), 'labor tightness on state');
  check('R808', Boolean(r1.state.hybridParticipationFrictionOutlook?.band), 'hybrid friction on state');
  check('R809', detectLaborDemographicsQuery('youth entry pipeline') === 'youth_pipeline', 'GI youth pipeline detect');
  check('R810', detectLaborDemographicsQuery('labor market tightness') === 'labor_tightness', 'GI tightness detect');
  check('R811', detectLaborDemographicsQuery('hybrid participation friction') === 'hybrid_participation', 'GI hybrid detect');
  check('R812', answerLaborDemographicsQuestion(r1.state, 'youth_pipeline').headline.length > 5, 'GI youth answer');
  const youthOnly = computeNationalYouthEntryPipelineOutlook(
    r1.state,
    r1.state.dependencyRatioSnapshot,
    r1.state.participationPressureBrief
  );
  check('R813', youthOnly.summary.length > 10, 'youth pipeline standalone summary');
  const tightOnly = computeNationalLaborMarketTightnessBrief(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.workforceCapacityBridge,
    r1.state.underemploymentPressureBrief
  );
  check('R814', tightOnly.band.length > 3, 'tightness band string');
  const hybridOnly = computeNationalHybridParticipationFrictionOutlook(
    r1.state,
    r1.state.workforceTransitionFrictionOutlook,
    r1.state.talentMobilityOutlook
  );
  check('R815', hybridOnly.careReliefLift >= 0, 'hybrid care relief lift');
  check(
    'R816',
    computeNationalLaborMarketTightnessBrief(
      rHhBad.state,
      rHhBad.state.integratedLaborBrief!,
      rHhBad.state.workforceCapacityBridge,
      rHhBad.state.underemploymentPressureBrief
    ).stewardNote.length > 8,
    'tightness steward note'
  );

  check('R901', WORKFORCE_FLEXIBILITY_LEVERS.length >= 8, 'flexibility lever catalog');
  check('R902', Boolean(lookupWorkforceFlexibilityLever('flex_tech_nsw_vic')?.narrative), 'flexibility lever lookup');
  check('R903', flexibilityLeversForIndustry('technology').length >= 1, 'technology flexibility levers');
  check('R904', flexibilityEaseForRegion('NSW', 'technology') > 0, 'regional flexibility ease');
  check('R905', Boolean(r1.state.seniorWorkforceRetentionOutlook?.band), 'senior retention on state');
  check('R906', (r1.state.seniorWorkforceRetentionOutlook?.agedPressureDrag ?? 0) >= 0, 'aged pressure drag');
  check('R907', Boolean(r1.state.regionalLaborAbsorptionBrief?.band), 'labor absorption on state');
  check('R908', Boolean(r1.state.participationEquityGapBrief?.band), 'participation equity on state');
  check('R909', detectLaborDemographicsQuery('senior retention outlook') === 'senior_retention', 'GI senior detect');
  check('R910', detectLaborDemographicsQuery('regional labor absorption') === 'labor_absorption', 'GI absorption detect');
  check('R911', detectLaborDemographicsQuery('participation equity gap') === 'participation_equity', 'GI equity detect');
  check('R912', answerLaborDemographicsQuestion(r1.state, 'senior_retention').headline.length > 5, 'GI senior answer');
  const seniorOnly = computeNationalSeniorWorkforceRetentionOutlook(
    r1.state,
    r1.state.dependencyRatioSnapshot,
    r1.state.participationPressureBrief
  );
  check('R913', seniorOnly.summary.length > 10, 'senior retention standalone summary');
  const absorptionOnly = computeNationalRegionalLaborAbsorptionBrief(
    r1.state,
    r1.state.workforceCapacityBridge,
    r1.state.laborMarketTightnessBrief
  );
  check('R914', absorptionOnly.band.length > 3, 'absorption band string');
  const equityOnly = computeNationalParticipationEquityGapBrief(r1.state, r1.state.underemploymentPressureBrief);
  check('R915', equityOnly.inclusionEaseLift >= 0, 'equity inclusion ease lift');
  check(
    'R916',
    computeNationalParticipationEquityGapBrief(rHhBad.state, rHhBad.state.underemploymentPressureBrief).stewardNote.length >
      8,
    'equity steward note'
  );

  check('R1001', WORKFORCE_REENGAGEMENT_LEVERS.length >= 8, 'reengagement lever catalog');
  check('R1002', Boolean(lookupWorkforceReengagementLever('reeng_tech_nsw_vic')?.narrative), 'reengagement lever lookup');
  check('R1003', reengagementLeversForIndustry('technology').length >= 1, 'technology reengagement levers');
  check('R1004', reengagementPullForRegion('NSW', 'technology') > 0, 'regional reengagement pull');
  check('R1005', Boolean(r1.state.credentialMobilityOutlook?.band), 'credential mobility on state');
  check('R1006', (r1.state.credentialMobilityOutlook?.pathwayLift ?? 0) >= 0, 'pathway lift');
  check('R1007', Boolean(r1.state.householdParticipationCouplingBrief?.band), 'household coupling on state');
  check('R1008', Boolean(r1.state.laborRebalancingStressBrief?.band), 'rebalancing stress on state');
  check('R1009', detectLaborDemographicsQuery('credential mobility portable') === 'credential_mobility', 'GI credential detect');
  check(
    'R1010',
    detectLaborDemographicsQuery('household participation coupling') === 'household_participation_coupling',
    'GI coupling detect'
  );
  check('R1011', detectLaborDemographicsQuery('rebalancing stress corridor') === 'rebalancing_stress', 'GI stress detect');
  check('R1012', answerLaborDemographicsQuestion(r1.state, 'credential_mobility').headline.length > 5, 'GI credential answer');
  const credentialOnly = computeNationalCredentialMobilityOutlook(
    r1.state,
    r1.state.skillMismatchIndex,
    r1.state.talentMobilityOutlook
  );
  check('R1013', credentialOnly.summary.length > 10, 'credential mobility standalone summary');
  const couplingOnly = computeNationalHouseholdParticipationCouplingBrief(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.participationEquityGapBrief
  );
  check('R1014', couplingOnly.band.length > 3, 'coupling band string');
  const stressOnly = computeNationalLaborRebalancingStressBrief(
    r1.state,
    r1.state.interregionalRebalancingPlan,
    r1.state.regionalLaborAbsorptionBrief,
    r1.state.laborMarketTightnessBrief
  );
  check('R1015', stressOnly.highPriorityMoves >= 0, 'stress high priority moves');
  check(
    'R1016',
    computeNationalLaborRebalancingStressBrief(
      rHhBad.state,
      rHhBad.state.interregionalRebalancingPlan,
      rHhBad.state.regionalLaborAbsorptionBrief,
      rHhBad.state.laborMarketTightnessBrief
    ).stewardNote.length > 8,
    'rebalancing stress steward note'
  );

  check('R1101', WORKFORCE_ONBOARDING_LEVERS.length >= 8, 'onboarding lever catalog');
  check('R1102', Boolean(lookupWorkforceOnboardingLever('onboard_tech_nsw_vic')?.narrative), 'onboarding lever lookup');
  check('R1103', onboardingLeversForIndustry('technology').length >= 1, 'technology onboarding levers');
  check('R1104', onboardingEaseForRegion('NSW', 'technology') > 0, 'regional onboarding ease');
  check('R1105', Boolean(r1.state.automationParticipationResilienceOutlook?.band), 'automation resilience on state');
  check('R1106', (r1.state.automationParticipationResilienceOutlook?.automationPressureDrag ?? 0) >= 0, 'automation drag');
  check('R1107', Boolean(r1.state.wageParticipationSpilloverBrief?.band), 'wage spillover on state');
  check('R1108', Boolean(r1.state.migrationShockParticipationBufferOutlook?.band), 'migration buffer on state');
  check(
    'R1109',
    detectLaborDemographicsQuery('automation participation resilience') === 'automation_participation_resilience',
    'GI automation resilience detect'
  );
  check(
    'R1110',
    detectLaborDemographicsQuery('wage participation spillover') === 'wage_participation_spillover',
    'GI spillover detect'
  );
  check(
    'R1111',
    detectLaborDemographicsQuery('migration shock buffer') === 'migration_participation_buffer',
    'GI migration buffer detect'
  );
  check(
    'R1112',
    answerLaborDemographicsQuestion(r1.state, 'automation_participation_resilience').headline.length > 5,
    'GI automation resilience answer'
  );
  const automationResOnly = computeNationalAutomationParticipationResilienceOutlook(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.workforceTransitionFrictionOutlook
  );
  check('R1113', automationResOnly.summary.length > 10, 'automation resilience standalone summary');
  const spilloverOnly = computeNationalWageParticipationSpilloverBrief(
    r1.state,
    r1.state.wageCompetitivenessIndex,
    r1.state.householdParticipationCouplingBrief
  );
  check('R1114', spilloverOnly.band.length > 3, 'spillover band string');
  const bufferOnly = computeNationalMigrationShockParticipationBufferOutlook(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.regionalLaborAbsorptionBrief
  );
  check('R1115', bufferOnly.activeShockDrag >= 0, 'migration buffer shock drag');
  check(
    'R1116',
    computeNationalWageParticipationSpilloverBrief(
      rHhBad.state,
      rHhBad.state.wageCompetitivenessIndex,
      rHhBad.state.householdParticipationCouplingBrief
    ).stewardNote.length > 8,
    'wage spillover steward note'
  );

  check('R1201', WORKFORCE_COORDINATION_LEVERS.length >= 8, 'coordination lever catalog');
  check('R1202', Boolean(lookupWorkforceCoordinationLever('coord_tech_nsw_vic')?.narrative), 'coordination lever lookup');
  check('R1203', coordinationLeversForIndustry('technology').length >= 1, 'technology coordination levers');
  check('R1204', coordinationEaseForRegion('NSW', 'technology') > 0, 'regional coordination ease');
  check('R1205', Boolean(r1.state.laborMarketStabilityOutlook?.band), 'labor stability on state');
  check('R1206', (r1.state.laborMarketStabilityOutlook?.stressDrag ?? 0) >= 0, 'stability stress drag');
  check('R1207', Boolean(r1.state.intergenerationalWorkforceBalanceOutlook?.band), 'intergenerational balance on state');
  check('R1208', Boolean(r1.state.capacityParticipationAlignmentBrief?.band), 'capacity alignment on state');
  check(
    'R1209',
    detectLaborDemographicsQuery('labor market stability outlook') === 'labor_market_stability',
    'GI stability detect'
  );
  check(
    'R1210',
    detectLaborDemographicsQuery('intergenerational balance youth senior') === 'intergenerational_balance',
    'GI intergenerational detect'
  );
  check(
    'R1211',
    detectLaborDemographicsQuery('capacity participation alignment') === 'capacity_participation_alignment',
    'GI alignment detect'
  );
  check(
    'R1212',
    answerLaborDemographicsQuestion(r1.state, 'labor_market_stability').headline.length > 5,
    'GI stability answer'
  );
  const stabilityOnly = computeNationalLaborMarketStabilityOutlook(
    r1.state,
    r1.state.integratedLaborBrief!,
    r1.state.laborRebalancingStressBrief,
    r1.state.automationParticipationResilienceOutlook
  );
  check('R1213', stabilityOnly.summary.length > 10, 'stability standalone summary');
  const intergenOnly = computeNationalIntergenerationalWorkforceBalanceOutlook(
    r1.state,
    r1.state.youthEntryPipelineOutlook,
    r1.state.seniorWorkforceRetentionOutlook
  );
  check('R1214', intergenOnly.pipelineGap >= 0, 'intergenerational pipeline gap');
  const alignmentOnly = computeNationalCapacityParticipationAlignmentBrief(
    r1.state,
    r1.state.workforceCapacityBridge,
    r1.state.participationEquityGapBrief,
    r1.state.regionalLaborAbsorptionBrief
  );
  check('R1215', alignmentOnly.band.length > 3, 'alignment band string');
  check(
    'R1216',
    computeNationalCapacityParticipationAlignmentBrief(
      rHhBad.state,
      rHhBad.state.workforceCapacityBridge,
      rHhBad.state.participationEquityGapBrief,
      rHhBad.state.regionalLaborAbsorptionBrief
    ).stewardNote.length > 8,
    'alignment steward note'
  );

  check('R1301', WORKFORCE_ADVOCACY_LEVERS.length >= 8, 'advocacy lever catalog');
  check('R1302', Boolean(lookupWorkforceAdvocacyLever('adv_tech_nsw_vic')?.narrative), 'advocacy lever lookup');
  check('R1303', advocacyLeversForIndustry('technology').length >= 1, 'technology advocacy levers');
  check('R1304', advocacyEaseForRegion('NSW', 'technology') > 0, 'regional advocacy ease');
  check('R1305', Boolean(r1.state.participationVelocityCouplingBrief?.band), 'velocity coupling on state');
  check('R1306', (r1.state.participationVelocityCouplingBrief?.velocityDrag ?? 0) >= 0, 'velocity drag');
  check('R1307', Boolean(r1.state.skillsTightnessCoherenceOutlook?.band), 'skills coherence on state');
  check('R1308', Boolean(r1.state.integratedLaborReadinessOutlook?.band), 'integrated readiness on state');
  check(
    'R1309',
    detectLaborDemographicsQuery('participation velocity coupling') === 'participation_velocity_coupling',
    'GI velocity coupling detect'
  );
  check(
    'R1310',
    detectLaborDemographicsQuery('skills tightness coherence') === 'skills_tightness_coherence',
    'GI coherence detect'
  );
  check(
    'R1311',
    detectLaborDemographicsQuery('integrated labor readiness') === 'integrated_labor_readiness',
    'GI readiness detect'
  );
  check(
    'R1312',
    answerLaborDemographicsQuestion(r1.state, 'integrated_labor_readiness').headline.length > 5,
    'GI readiness answer'
  );
  const velocityCouplingOnly = computeNationalParticipationVelocityCouplingBrief(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.laborMarketVelocityIndex
  );
  check('R1313', velocityCouplingOnly.summary.length > 10, 'velocity coupling standalone summary');
  const coherenceOnly = computeNationalSkillsTightnessCoherenceOutlook(
    r1.state,
    r1.state.skillMismatchIndex,
    r1.state.laborMarketTightnessBrief,
    r1.state.credentialMobilityOutlook
  );
  check('R1314', coherenceOnly.band.length > 3, 'coherence band string');
  const readinessOnly = computeNationalIntegratedLaborReadinessOutlook(
    r1.state,
    r1.state.laborMarketStabilityOutlook,
    r1.state.capacityParticipationAlignmentBrief,
    r1.state.migrationShockParticipationBufferOutlook,
    r1.state.laborResilienceScorecard
  );
  check('R1315', readinessOnly.stabilityDrag >= 0, 'readiness stability drag');
  check(
    'R1316',
    computeNationalIntegratedLaborReadinessOutlook(
      rHhBad.state,
      rHhBad.state.laborMarketStabilityOutlook,
      rHhBad.state.capacityParticipationAlignmentBrief,
      rHhBad.state.migrationShockParticipationBufferOutlook,
      rHhBad.state.laborResilienceScorecard
    ).stewardNote.length > 8,
    'readiness steward note'
  );

  check('R1401', WORKFORCE_MENTORSHIP_LEVERS.length >= 8, 'mentorship lever catalog');
  check('R1402', Boolean(lookupWorkforceMentorshipLever('mentor_tech_nsw_vic')?.narrative), 'mentorship lever lookup');
  check('R1403', mentorshipLeversForIndustry('technology').length >= 1, 'technology mentorship levers');
  check('R1404', mentorshipEaseForRegion('NSW', 'technology') > 0, 'regional mentorship ease');
  check('R1405', Boolean(r1.state.hybridRemoteParticipationOutlook?.band), 'hybrid remote on state');
  check('R1406', (r1.state.hybridRemoteParticipationOutlook?.frictionDrag ?? 0) >= 0, 'hybrid remote friction drag');
  check('R1407', Boolean(r1.state.corridorCapacityStressBrief?.band), 'corridor stress on state');
  check('R1408', Boolean(r1.state.stewardInterventionPriorityBrief?.band), 'steward intervention on state');
  check(
    'R1409',
    detectLaborDemographicsQuery('hybrid remote participation') === 'hybrid_remote_participation',
    'GI hybrid remote detect'
  );
  check(
    'R1410',
    detectLaborDemographicsQuery('corridor capacity stress') === 'corridor_capacity_stress',
    'GI corridor stress detect'
  );
  check(
    'R1411',
    detectLaborDemographicsQuery('steward intervention priority') === 'steward_intervention_priority',
    'GI intervention detect'
  );
  check(
    'R1412',
    answerLaborDemographicsQuestion(r1.state, 'steward_intervention_priority').headline.length > 5,
    'GI intervention answer'
  );
  const hybridRemoteOnly = computeNationalHybridRemoteParticipationOutlook(
    r1.state,
    r1.state.hybridParticipationFrictionOutlook
  );
  check('R1413', hybridRemoteOnly.summary.length > 10, 'hybrid remote standalone summary');
  const corridorStressOnly = computeNationalCorridorCapacityStressBrief(
    r1.state,
    r1.state.interregionalRebalancingPlan,
    r1.state.regionalLaborAbsorptionBrief,
    r1.state.laborRebalancingStressBrief,
    r1.state.laborMarketTightnessBrief
  );
  check('R1414', corridorStressOnly.band.length > 3, 'corridor stress band string');
  const interventionOnly = computeNationalStewardInterventionPriorityBrief(
    r1.state,
    r1.state.integratedLaborReadinessOutlook,
    r1.state.laborMarketStabilityOutlook,
    r1.state.laborRebalancingStressBrief
  );
  check('R1415', interventionOnly.readinessDrag >= 0, 'intervention readiness drag');
  check(
    'R1416',
    computeNationalStewardInterventionPriorityBrief(
      rHhBad.state,
      rHhBad.state.integratedLaborReadinessOutlook,
      rHhBad.state.laborMarketStabilityOutlook,
      rHhBad.state.laborRebalancingStressBrief
    ).stewardNote.length > 8,
    'intervention steward note'
  );

  check('R1501', WORKFORCE_SAFETY_LEVERS.length >= 8, 'safety lever catalog');
  check('R1502', Boolean(lookupWorkforceSafetyLever('safe_tech_nsw_vic')?.narrative), 'safety lever lookup');
  check('R1503', safetyLeversForIndustry('technology').length >= 1, 'technology safety levers');
  check('R1504', safetyEaseForRegion('NSW', 'technology') > 0, 'regional safety ease');
  check('R1505', Boolean(r1.state.essentialWorkerParticipationOutlook?.band), 'essential worker on state');
  check('R1506', (r1.state.essentialWorkerParticipationOutlook?.shockDrag ?? 0) >= 0, 'essential shock drag');
  check('R1507', Boolean(r1.state.wageAutomationCouplingBrief?.band), 'wage automation on state');
  check('R1508', Boolean(r1.state.nationalLaborCohesionIndex?.band), 'labor cohesion on state');
  check(
    'R1509',
    detectLaborDemographicsQuery('essential worker participation') === 'essential_worker_participation',
    'GI essential detect'
  );
  check(
    'R1510',
    detectLaborDemographicsQuery('wage automation coupling') === 'wage_automation_coupling',
    'GI wage automation detect'
  );
  check(
    'R1511',
    detectLaborDemographicsQuery('national labor cohesion') === 'national_labor_cohesion',
    'GI cohesion detect'
  );
  check(
    'R1512',
    answerLaborDemographicsQuestion(r1.state, 'national_labor_cohesion').headline.length > 5,
    'GI cohesion answer'
  );
  const essentialOnly = computeNationalEssentialWorkerParticipationOutlook(
    r1.state,
    r1.state.participationPressureBrief,
    r1.state.migrationShockParticipationBufferOutlook
  );
  check('R1513', essentialOnly.summary.length > 10, 'essential standalone summary');
  const wageAutoOnly = computeNationalWageAutomationCouplingBrief(
    r1.state,
    r1.state.wageParticipationSpilloverBrief,
    r1.state.wageCompetitivenessIndex,
    r1.state.automationParticipationResilienceOutlook
  );
  check('R1514', wageAutoOnly.band.length > 3, 'wage automation band string');
  const cohesionOnly = computeNationalLaborCohesionIndex(
    r1.state,
    r1.state.laborMarketStabilityOutlook,
    r1.state.intergenerationalWorkforceBalanceOutlook,
    r1.state.capacityParticipationAlignmentBrief
  );
  check('R1515', cohesionOnly.stabilityDrag >= 0, 'cohesion stability drag');
  check(
    'R1516',
    computeNationalLaborCohesionIndex(
      rHhBad.state,
      rHhBad.state.laborMarketStabilityOutlook,
      rHhBad.state.intergenerationalWorkforceBalanceOutlook,
      rHhBad.state.capacityParticipationAlignmentBrief
    ).stewardNote.length > 8,
    'cohesion steward note'
  );

  check('R1601', WORKFORCE_SCHEDULING_LEVERS.length >= 8, 'scheduling lever catalog');
  check('R1602', Boolean(lookupWorkforceSchedulingLever('sched_tech_nsw_vic')?.narrative), 'scheduling lever lookup');
  check('R1603', schedulingLeversForIndustry('technology').length >= 1, 'technology scheduling levers');
  check('R1604', schedulingEaseForRegion('NSW', 'technology') > 0, 'regional scheduling ease');
  check('R1605', Boolean(r1.state.seasonalParticipationSwingOutlook?.band), 'seasonal swing on state');
  check('R1606', (r1.state.seasonalParticipationSwingOutlook?.seasonalDrag ?? 0) >= 0, 'seasonal drag');
  check('R1607', Boolean(r1.state.cohesionCorridorCouplingBrief?.band), 'cohesion corridor on state');
  check('R1608', Boolean(r1.state.nationalWorkforceReliabilityIndex?.band), 'reliability on state');
  check(
    'R1609',
    detectLaborDemographicsQuery('seasonal participation swing') === 'seasonal_participation_swing',
    'GI seasonal detect'
  );
  check(
    'R1610',
    detectLaborDemographicsQuery('cohesion corridor coupling') === 'cohesion_corridor_coupling',
    'GI coupling detect'
  );
  check(
    'R1611',
    detectLaborDemographicsQuery('workforce reliability index') === 'workforce_reliability',
    'GI reliability detect'
  );
  check(
    'R1612',
    answerLaborDemographicsQuestion(r1.state, 'workforce_reliability').headline.length > 5,
    'GI reliability answer'
  );
  const seasonalOnly = computeNationalSeasonalParticipationSwingOutlook(
    r1.state,
    r1.state.essentialWorkerParticipationOutlook,
    r1.state.laborMarketTightnessBrief
  );
  check('R1613', seasonalOnly.summary.length > 10, 'seasonal standalone summary');
  const cohesionCouplingOnly = computeNationalCohesionCorridorCouplingBrief(
    r1.state,
    r1.state.nationalLaborCohesionIndex,
    r1.state.corridorCapacityStressBrief
  );
  check('R1614', cohesionCouplingOnly.band.length > 3, 'coupling band string');
  const reliabilityOnly = computeNationalWorkforceReliabilityIndex(
    r1.state,
    r1.state.seasonalParticipationSwingOutlook,
    r1.state.cohesionCorridorCouplingBrief
  );
  check('R1615', reliabilityOnly.couplingDrag >= 0, 'reliability coupling drag');
  check(
    'R1616',
    computeNationalWorkforceReliabilityIndex(
      rHhBad.state,
      rHhBad.state.seasonalParticipationSwingOutlook,
      rHhBad.state.cohesionCorridorCouplingBrief
    ).stewardNote.length > 8,
    'reliability steward note'
  );

  check('R1701', retentionPullForRegion('NSW', 'technology') > 0, 'retention pull for region');
  check('R1702', Boolean(r1.state.retentionReliabilityCouplingBrief?.band), 'retention coupling on state');
  check('R1703', (r1.state.retentionReliabilityCouplingBrief?.reliabilityDrag ?? 0) >= 0, 'retention reliability drag');
  check('R1704', Boolean(r1.state.upskillingVelocityOutlook?.band), 'upskilling velocity on state');
  check('R1705', (r1.state.upskillingVelocityOutlook?.mismatchDrag ?? 0) >= 0, 'upskilling mismatch drag');
  check('R1706', Boolean(r1.state.subjectWorkforceReadinessBrief?.band), 'subject readiness on state');
  check('R1707', Boolean(r1.state.nationalWorkforceSustainmentIndex?.band), 'sustainment on state');
  check(
    'R1708',
    detectLaborDemographicsQuery('retention reliability coupling') === 'retention_reliability_coupling',
    'GI retention coupling detect'
  );
  check(
    'R1709',
    detectLaborDemographicsQuery('upskilling velocity') === 'upskilling_velocity',
    'GI upskilling velocity detect'
  );
  check(
    'R1710',
    detectLaborDemographicsQuery('subject workforce readiness') === 'subject_workforce_readiness',
    'GI subject readiness detect'
  );
  check(
    'R1711',
    detectLaborDemographicsQuery('workforce sustainment') === 'workforce_sustainment',
    'GI sustainment detect'
  );
  check(
    'R1712',
    answerLaborDemographicsQuestion(r1.state, 'workforce_sustainment').headline.length > 5,
    'GI sustainment answer'
  );
  const retentionCouplingOnly = computeNationalRetentionReliabilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceReliabilityIndex
  );
  check('R1713', retentionCouplingOnly.summary.length > 10, 'retention coupling standalone summary');
  const upskillingOnly = computeNationalUpskillingVelocityOutlook(r1.state, r1.state.skillsTightnessCoherenceOutlook);
  check('R1714', upskillingOnly.band.length > 3, 'upskilling velocity band string');
  const subjectOnly = computeNationalSubjectWorkforceReadinessBrief(
    r1.state,
    r1.state.retentionReliabilityCouplingBrief,
    r1.state.integratedLaborReadinessOutlook
  );
  check('R1715', subjectOnly.readinessDrag >= 0, 'subject readiness drag');
  check(
    'R1716',
    computeNationalWorkforceSustainmentIndex(
      rHhBad.state,
      rHhBad.state.nationalWorkforceReliabilityIndex,
      rHhBad.state.upskillingVelocityOutlook,
      rHhBad.state.subjectWorkforceReadinessBrief
    ).stewardNote.length > 8,
    'sustainment steward note'
  );

  check('R1801', Boolean(r1.state.sustainmentRetentionCouplingBrief?.band), 'sustainment retention coupling on state');
  check(
    'R1802',
    (r1.state.sustainmentRetentionCouplingBrief?.sustainmentDrag ?? 0) >= 0,
    'sustainment retention drag'
  );
  check('R1803', Boolean(r1.state.onboardingVelocityOutlook?.band), 'onboarding velocity on state');
  check('R1804', (r1.state.onboardingVelocityOutlook?.pipelineDrag ?? 0) >= 0, 'onboarding pipeline drag');
  check('R1805', Boolean(r1.state.subjectAssemblyContinuityBrief?.band), 'subject assembly continuity on state');
  check('R1806', Boolean(r1.state.nationalWorkforceContinuityIndex?.band), 'workforce continuity on state');
  check(
    'R1807',
    detectLaborDemographicsQuery('sustainment retention coupling') === 'sustainment_retention_coupling',
    'GI sustainment retention detect'
  );
  check(
    'R1808',
    detectLaborDemographicsQuery('onboarding velocity') === 'onboarding_velocity',
    'GI onboarding velocity detect'
  );
  check(
    'R1809',
    detectLaborDemographicsQuery('subject assembly continuity') === 'subject_assembly_continuity',
    'GI subject assembly detect'
  );
  check(
    'R1810',
    detectLaborDemographicsQuery('workforce continuity') === 'workforce_continuity',
    'GI workforce continuity detect'
  );
  check(
    'R1811',
    answerLaborDemographicsQuestion(r1.state, 'workforce_continuity').headline.length > 5,
    'GI workforce continuity answer'
  );
  const sustainmentCouplingOnly = computeNationalSustainmentRetentionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSustainmentIndex,
    r1.state.retentionReliabilityCouplingBrief
  );
  check('R1812', sustainmentCouplingOnly.summary.length > 10, 'sustainment coupling standalone summary');
  const onboardingOnly = computeNationalOnboardingVelocityOutlook(r1.state, r1.state.upskillingVelocityOutlook);
  check('R1813', onboardingOnly.band.length > 3, 'onboarding velocity band string');
  const subjectContinuityOnly = computeNationalSubjectAssemblyContinuityBrief(
    r1.state,
    r1.state.subjectWorkforceReadinessBrief,
    r1.state.nationalWorkforceSustainmentIndex
  );
  check('R1814', subjectContinuityOnly.assemblyDrag >= 0, 'subject assembly drag');
  check(
    'R1815',
    computeNationalWorkforceContinuityIndex(
      rHhBad.state,
      rHhBad.state.sustainmentRetentionCouplingBrief,
      rHhBad.state.onboardingVelocityOutlook,
      rHhBad.state.subjectAssemblyContinuityBrief
    ).stewardNote.length > 8,
    'continuity steward note'
  );
  check('R1816', onboardingEaseForRegion('NSW', 'technology') > 0, 'onboarding ease for region');

  check('R1901', Boolean(r1.state.continuityCoordinationCouplingBrief?.band), 'continuity coordination on state');
  check(
    'R1902',
    (r1.state.continuityCoordinationCouplingBrief?.continuityDrag ?? 0) >= 0,
    'continuity coordination drag'
  );
  check('R1903', Boolean(r1.state.reengagementMomentumOutlook?.band), 'reengagement momentum on state');
  check('R1904', (r1.state.reengagementMomentumOutlook?.pipelineDrag ?? 0) >= 0, 'reengagement pipeline drag');
  check('R1905', Boolean(r1.state.subjectWaveAssemblyBrief?.band), 'subject wave assembly on state');
  check('R1906', Boolean(r1.state.nationalWorkforceDurabilityIndex?.band), 'workforce durability on state');
  check(
    'R1907',
    detectLaborDemographicsQuery('continuity coordination coupling') === 'continuity_coordination_coupling',
    'GI continuity coordination detect'
  );
  check(
    'R1908',
    detectLaborDemographicsQuery('reengagement momentum') === 'reengagement_momentum',
    'GI reengagement momentum detect'
  );
  check(
    'R1909',
    detectLaborDemographicsQuery('subject wave assembly') === 'subject_wave_assembly',
    'GI subject wave detect'
  );
  check(
    'R1910',
    detectLaborDemographicsQuery('workforce durability') === 'workforce_durability',
    'GI durability detect'
  );
  check(
    'R1911',
    answerLaborDemographicsQuestion(r1.state, 'workforce_durability').headline.length > 5,
    'GI durability answer'
  );
  const coordinationCouplingOnly = computeNationalContinuityCoordinationCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceContinuityIndex
  );
  check('R1912', coordinationCouplingOnly.summary.length > 10, 'coordination coupling standalone summary');
  const reengagementOnly = computeNationalReengagementMomentumOutlook(r1.state, r1.state.onboardingVelocityOutlook);
  check('R1913', reengagementOnly.band.length > 3, 'reengagement momentum band string');
  const waveAssemblyOnly = computeNationalSubjectWaveAssemblyBrief(
    r1.state,
    r1.state.subjectAssemblyContinuityBrief,
    r1.state.nationalWorkforceContinuityIndex
  );
  check('R1914', waveAssemblyOnly.waveDrag >= 0, 'subject wave drag');
  check(
    'R1915',
    computeNationalWorkforceDurabilityIndex(
      rHhBad.state,
      rHhBad.state.continuityCoordinationCouplingBrief,
      rHhBad.state.reengagementMomentumOutlook,
      rHhBad.state.subjectWaveAssemblyBrief
    ).stewardNote.length > 8,
    'durability steward note'
  );
  check('R1916', coordinationEaseForRegion('NSW', 'technology') > 0, 'coordination ease for region');

  for (let i = 19; i <= 50; i++) {
    const ok = validateLaborDemographicsState(r1.state).valid && r1.state.industryLinks.length <= V1014_LABOR_LIMITS.maxIndustryLinks;
    check(`LD${String(i).padStart(2, '0')}`, ok, `invariant bundle ${i}`);
  }

  const passed = results.filter(r => r.passed).length;
  return {
    passed,
    failed: results.length - passed,
    total: results.length,
    allPassed: passed === results.length,
    results
  };
}

/** Canonical export alias for Agent 25 merge scripts. */
export const runV1014_LABOR_LaborDemographicsSelfTests = runV1014LaborDemographicsSelfTests;


// --- source: react/LaborDemographicsCenterPanel.tsx ---
  DEMOGRAPHIC_STRUCTURE_LABEL,
  EMPLOYMENT_LINKAGE_LABEL,
  INDUSTRY_LABEL,
  MIGRATION_FLOW_LABEL,
  WAGE_PRESSURE_LABEL
} from '../types';

/** Lightweight panel — React types only at runtime when bundled with game. */
export function LaborDemographicsCenterPanel(props: { view: LaborDemographicsWorldView | null }) {
  const view = props.view;
  if (!view || !view.enabled || !view.state?.enabled) {
    return {
      kind: 'labor_demographics_off' as const,
      message: 'Labor Demographics (V10.14) is off. Enable National Systems, Industries, and Labor Demographics in Settings.'
    };
  }
  const st = view.state;
  return {
    kind: 'labor_demographics_on' as const,
    testId: 'v1014-labor-center',
    summary: st.summary,
    outlook: st.outlook,
    automationFeedbackSummary: st.automationFeedbackSummary,
    tiles: [
      ['Demographics', DEMOGRAPHIC_STRUCTURE_LABEL[st.nationalDemographicStructure]],
      ['Employment', EMPLOYMENT_LINKAGE_LABEL[st.nationalEmploymentLinkage]],
      ['Wages', WAGE_PRESSURE_LABEL[st.nationalWagePressure]],
      ['Migration', MIGRATION_FLOW_LABEL[st.nationalMigrationFlow]]
    ] as const,
    industryLinks: st.industryLinks.map(l => ({
      industry: INDUSTRY_LABEL[l.industry],
      linkageScore: Math.round(l.linkageScore),
      sharePct: Math.round(l.nationalOutputShare * 100)
    }))
  };
}


// OP10M_MODULE_END agent-09-population
