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
  durabilityAdvocacyCouplingBrief?: NationalDurabilityAdvocacyCouplingBrief;
  mentorshipEnduranceOutlook?: NationalMentorshipEnduranceOutlook;
  subjectTrancheReadinessBrief?: NationalSubjectTrancheReadinessBrief;
  nationalWorkforceEnduranceIndex?: NationalWorkforceEnduranceIndex;
  enduranceFlexibilityCouplingBrief?: NationalEnduranceFlexibilityCouplingBrief;
  inclusionResilienceOutlook?: NationalInclusionResilienceOutlook;
  subjectCommitReadinessBrief?: NationalSubjectCommitReadinessBrief;
  nationalWorkforceTenacityIndex?: NationalWorkforceTenacityIndex;
  tenacityCareCouplingBrief?: NationalTenacityCareCouplingBrief;
  safetyCohesionOutlook?: NationalSafetyCohesionOutlook;
  subjectReleaseReadinessBrief?: NationalSubjectReleaseReadinessBrief;
  nationalWorkforceSteadfastIndex?: NationalWorkforceSteadfastIndex;
  steadfastSchedulingCouplingBrief?: NationalSteadfastSchedulingCouplingBrief;
  retentionAnchorOutlook?: NationalRetentionAnchorOutlook;
  subjectSealReadinessBrief?: NationalSubjectSealReadinessBrief;
  nationalWorkforceResolveIndex?: NationalWorkforceResolveIndex;
  resolveUpskillingCouplingBrief?: NationalResolveUpskillingCouplingBrief;
  coordinationBindOutlook?: NationalCoordinationBindOutlook;
  subjectBindReadinessBrief?: NationalSubjectBindReadinessBrief;
  nationalWorkforceFortitudeIndex?: NationalWorkforceFortitudeIndex;
  fortitudeInclusionCouplingBrief?: NationalFortitudeInclusionCouplingBrief;
  hybridAnchorOutlook?: NationalHybridAnchorOutlook;
  subjectCrownReadinessBrief?: NationalSubjectCrownReadinessBrief;
  nationalWorkforceCulminationIndex?: NationalWorkforceCulminationIndex;
  culminationMentorshipCouplingBrief?: NationalCulminationMentorshipCouplingBrief;
  onboardingSustainOutlook?: NationalOnboardingSustainOutlook;
  subjectApexReadinessBrief?: NationalSubjectApexReadinessBrief;
  nationalWorkforceApexIndex?: NationalWorkforceApexIndex;
  apexAdvocacyCouplingBrief?: NationalApexAdvocacyCouplingBrief;
  reengagementThrustOutlook?: NationalReengagementThrustOutlook;
  subjectPinnacleReadinessBrief?: NationalSubjectPinnacleReadinessBrief;
  nationalWorkforcePinnacleIndex?: NationalWorkforcePinnacleIndex;
  pinnacleRetentionCouplingBrief?: NationalPinnacleRetentionCouplingBrief;
  retentionCrestOutlook?: NationalRetentionCrestOutlook;
  subjectSummitReadinessBrief?: NationalSubjectSummitReadinessBrief;
  nationalWorkforceSummitIndex?: NationalWorkforceSummitIndex;
  summitCoordinationCouplingBrief?: NationalSummitCoordinationCouplingBrief;
  coordinationHorizonOutlook?: NationalCoordinationHorizonOutlook;
  subjectZenithReadinessBrief?: NationalSubjectZenithReadinessBrief;
  nationalWorkforceZenithIndex?: NationalWorkforceZenithIndex;
  zenithFlexibilityCouplingBrief?: NationalZenithFlexibilityCouplingBrief;
  flexibilityAscentOutlook?: NationalFlexibilityAscentOutlook;
  subjectApogeeReadinessBrief?: NationalSubjectApogeeReadinessBrief;
  nationalWorkforceApogeeIndex?: NationalWorkforceApogeeIndex;
  apogeeInclusionCouplingBrief?: NationalApogeeInclusionCouplingBrief;
  inclusionOrbitOutlook?: NationalInclusionOrbitOutlook;
  subjectOrbitReadinessBrief?: NationalSubjectOrbitReadinessBrief;
  nationalWorkforceOrbitIndex?: NationalWorkforceOrbitIndex;
  orbitCareCouplingBrief?: NationalOrbitCareCouplingBrief;
  careEquilibriumOutlook?: NationalCareEquilibriumOutlook;
  subjectNexusReadinessBrief?: NationalSubjectNexusReadinessBrief;
  nationalWorkforceNexusIndex?: NationalWorkforceNexusIndex;
  nexusSchedulingCouplingBrief?: NationalNexusSchedulingCouplingBrief;
  schedulingResonanceOutlook?: NationalSchedulingResonanceOutlook;
  subjectConvergenceReadinessBrief?: NationalSubjectConvergenceReadinessBrief;
  nationalWorkforceConvergenceIndex?: NationalWorkforceConvergenceIndex;
  convergenceSafetyCouplingBrief?: NationalConvergenceSafetyCouplingBrief;
  safetyHarmonyOutlook?: NationalSafetyHarmonyOutlook;
  subjectUnificationReadinessBrief?: NationalSubjectUnificationReadinessBrief;
  nationalWorkforceUnificationIndex?: NationalWorkforceUnificationIndex;
  unificationUpskillingCouplingBrief?: NationalUnificationUpskillingCouplingBrief;
  upskillingSynthesisOutlook?: NationalUpskillingSynthesisOutlook;
  subjectSynthesisReadinessBrief?: NationalSubjectSynthesisReadinessBrief;
  nationalWorkforceSynthesisIndex?: NationalWorkforceSynthesisIndex;
  synthesisOnboardingCouplingBrief?: NationalSynthesisOnboardingCouplingBrief;
  onboardingIntegrationOutlook?: NationalOnboardingIntegrationOutlook;
  subjectIntegrationReadinessBrief?: NationalSubjectIntegrationReadinessBrief;
  nationalWorkforceIntegrationIndex?: NationalWorkforceIntegrationIndex;
  integrationRetentionCouplingBrief?: NationalIntegrationRetentionCouplingBrief;
  retentionCohesionOutlook?: NationalRetentionCohesionOutlook;
  subjectRetentionReadinessBrief?: NationalSubjectRetentionReadinessBrief;
  nationalWorkforceRetentionIndex?: NationalWorkforceRetentionIndex;
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

export type DurabilityAdvocacyCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'reinforced';

export interface NationalDurabilityAdvocacyCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: DurabilityAdvocacyCouplingBand;
  durabilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type MentorshipEnduranceBand = 'depleted' | 'thin' | 'sustained' | 'deep';

export interface NationalMentorshipEnduranceOutlook {
  turn: number;
  enduranceIndex: number;
  band: MentorshipEnduranceBand;
  momentumDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectTrancheReadinessBand = 'blocked' | 'caution' | 'tranche_ready' | 'cleared';

export interface NationalSubjectTrancheReadinessBrief {
  turn: number;
  trancheIndex: number;
  band: SubjectTrancheReadinessBand;
  trancheDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceEnduranceBand = 'fragile' | 'thin' | 'steady' | 'hardened';

export interface NationalWorkforceEnduranceIndex {
  turn: number;
  enduranceIndex: number;
  band: WorkforceEnduranceBand;
  trancheDrag: number;
  summary: string;
  stewardNote: string;
}

export type EnduranceFlexibilityCouplingBand = 'decoupled' | 'strained' | 'elastic' | 'anchored';

export interface NationalEnduranceFlexibilityCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: EnduranceFlexibilityCouplingBand;
  enduranceDrag: number;
  summary: string;
  stewardNote: string;
}

export type InclusionResilienceBand = 'fragile' | 'patchy' | 'cohesive' | 'robust';

export interface NationalInclusionResilienceOutlook {
  turn: number;
  resilienceIndex: number;
  band: InclusionResilienceBand;
  enduranceDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectCommitReadinessBand = 'held' | 'review' | 'commit_ready' | 'cleared';

export interface NationalSubjectCommitReadinessBrief {
  turn: number;
  commitIndex: number;
  band: SubjectCommitReadinessBand;
  commitDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceTenacityBand = 'brittle' | 'thin' | 'firm' | 'fortified';

export interface NationalWorkforceTenacityIndex {
  turn: number;
  tenacityIndex: number;
  band: WorkforceTenacityBand;
  commitDrag: number;
  summary: string;
  stewardNote: string;
}

export type TenacityCareCouplingBand = 'decoupled' | 'strained' | 'supported' | 'nurtured';

export interface NationalTenacityCareCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: TenacityCareCouplingBand;
  tenacityDrag: number;
  summary: string;
  stewardNote: string;
}

export type SafetyCohesionBand = 'exposed' | 'uneven' | 'guarded' | 'shielded';

export interface NationalSafetyCohesionOutlook {
  turn: number;
  cohesionIndex: number;
  band: SafetyCohesionBand;
  resilienceDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectReleaseReadinessBand = 'held' | 'staged' | 'release_ready' | 'cleared';

export interface NationalSubjectReleaseReadinessBrief {
  turn: number;
  releaseIndex: number;
  band: SubjectReleaseReadinessBand;
  releaseDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceSteadfastBand = 'fragile' | 'thin' | 'steady' | 'anchored';

export interface NationalWorkforceSteadfastIndex {
  turn: number;
  steadfastIndex: number;
  band: WorkforceSteadfastBand;
  releaseDrag: number;
  summary: string;
  stewardNote: string;
}

export type SteadfastSchedulingCouplingBand = 'decoupled' | 'strained' | 'rhythmic' | 'locked';

export interface NationalSteadfastSchedulingCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: SteadfastSchedulingCouplingBand;
  steadfastDrag: number;
  summary: string;
  stewardNote: string;
}

export type RetentionAnchorBand = 'drifting' | 'loose' | 'anchored' | 'moored';

export interface NationalRetentionAnchorOutlook {
  turn: number;
  anchorIndex: number;
  band: RetentionAnchorBand;
  cohesionDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectSealReadinessBand = 'open' | 'pending' | 'sealed' | 'locked';

export interface NationalSubjectSealReadinessBrief {
  turn: number;
  sealIndex: number;
  band: SubjectSealReadinessBand;
  sealDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceResolveBand = 'fragile' | 'thin' | 'firm' | 'indomitable';

export interface NationalWorkforceResolveIndex {
  turn: number;
  resolveIndex: number;
  band: WorkforceResolveBand;
  sealDrag: number;
  summary: string;
  stewardNote: string;
}

export type ResolveUpskillingCouplingBand = 'decoupled' | 'strained' | 'aligned' | 'accelerated';

export interface NationalResolveUpskillingCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ResolveUpskillingCouplingBand;
  resolveDrag: number;
  summary: string;
  stewardNote: string;
}

export type CoordinationBindBand = 'loose' | 'patchy' | 'bound' | 'locked';

export interface NationalCoordinationBindOutlook {
  turn: number;
  bindIndex: number;
  band: CoordinationBindBand;
  schedulingDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectBindReadinessBand = 'unbound' | 'tension' | 'bound' | 'locked';

export interface NationalSubjectBindReadinessBrief {
  turn: number;
  bindIndex: number;
  band: SubjectBindReadinessBand;
  bindDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceFortitudeBand = 'fragile' | 'thin' | 'solid' | 'unshakable';

export interface NationalWorkforceFortitudeIndex {
  turn: number;
  fortitudeIndex: number;
  band: WorkforceFortitudeBand;
  bindDrag: number;
  summary: string;
  stewardNote: string;
}

export type FortitudeInclusionCouplingBand = 'decoupled' | 'strained' | 'inclusive' | 'elevated';

export interface NationalFortitudeInclusionCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: FortitudeInclusionCouplingBand;
  fortitudeDrag: number;
  summary: string;
  stewardNote: string;
}

export type HybridAnchorBand = 'drifting' | 'mixed' | 'anchored' | 'fixed';

export interface NationalHybridAnchorOutlook {
  turn: number;
  anchorIndex: number;
  band: HybridAnchorBand;
  bindDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectCrownReadinessBand = 'uncrowned' | 'pending' | 'crowned' | 'sealed';

export interface NationalSubjectCrownReadinessBrief {
  turn: number;
  crownIndex: number;
  band: SubjectCrownReadinessBand;
  crownDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceCulminationBand = 'fragile' | 'thin' | 'ready' | 'summit';

export interface NationalWorkforceCulminationIndex {
  turn: number;
  culminationIndex: number;
  band: WorkforceCulminationBand;
  crownDrag: number;
  summary: string;
  stewardNote: string;
}

export type CulminationMentorshipCouplingBand = 'decoupled' | 'strained' | 'guided' | 'elevated';

export interface NationalCulminationMentorshipCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: CulminationMentorshipCouplingBand;
  culminationDrag: number;
  summary: string;
  stewardNote: string;
}

export type OnboardingSustainBand = 'depleted' | 'thin' | 'sustained' | 'deep';

export interface NationalOnboardingSustainOutlook {
  turn: number;
  sustainIndex: number;
  band: OnboardingSustainBand;
  anchorDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectApexReadinessBand = 'below_apex' | 'approaching' | 'apex_ready' | 'summit_locked';

export interface NationalSubjectApexReadinessBrief {
  turn: number;
  apexIndex: number;
  band: SubjectApexReadinessBand;
  apexDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceApexBand = 'fragile' | 'thin' | 'elevated' | 'summit';

export interface NationalWorkforceApexIndex {
  turn: number;
  apexIndex: number;
  band: WorkforceApexBand;
  apexDrag: number;
  summary: string;
  stewardNote: string;
}

export type ApexAdvocacyCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalApexAdvocacyCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ApexAdvocacyCouplingBand;
  apexDrag: number;
  summary: string;
  stewardNote: string;
}

export type ReengagementThrustBand = 'stalled' | 'patchy' | 'building' | 'surging';

export interface NationalReengagementThrustOutlook {
  turn: number;
  thrustIndex: number;
  band: ReengagementThrustBand;
  sustainDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectPinnacleReadinessBand = 'below_pinnacle' | 'approaching' | 'pinnacle_ready' | 'summit_locked';

export interface NationalSubjectPinnacleReadinessBrief {
  turn: number;
  pinnacleIndex: number;
  band: SubjectPinnacleReadinessBand;
  pinnacleDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforcePinnacleBand = 'fragile' | 'thin' | 'elevated' | 'summit';

export interface NationalWorkforcePinnacleIndex {
  turn: number;
  pinnacleIndex: number;
  band: WorkforcePinnacleBand;
  pinnacleDrag: number;
  summary: string;
  stewardNote: string;
}

export type PinnacleRetentionCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalPinnacleRetentionCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: PinnacleRetentionCouplingBand;
  pinnacleDrag: number;
  summary: string;
  stewardNote: string;
}

export type RetentionCrestBand = 'ebbing' | 'patchy' | 'rising' | 'cresting';

export interface NationalRetentionCrestOutlook {
  turn: number;
  crestIndex: number;
  band: RetentionCrestBand;
  thrustDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectSummitReadinessBand = 'below_summit' | 'approaching' | 'summit_ready' | 'zenith_locked';

export interface NationalSubjectSummitReadinessBrief {
  turn: number;
  summitIndex: number;
  band: SubjectSummitReadinessBand;
  summitDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceSummitBand = 'fragile' | 'thin' | 'elevated' | 'zenith';

export interface NationalWorkforceSummitIndex {
  turn: number;
  summitIndex: number;
  band: WorkforceSummitBand;
  summitDrag: number;
  summary: string;
  stewardNote: string;
}

export type SummitCoordinationCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalSummitCoordinationCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: SummitCoordinationCouplingBand;
  summitDrag: number;
  summary: string;
  stewardNote: string;
}

export type CoordinationHorizonBand = 'ebbing' | 'patchy' | 'rising' | 'horizon';

export interface NationalCoordinationHorizonOutlook {
  turn: number;
  horizonIndex: number;
  band: CoordinationHorizonBand;
  crestDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectZenithReadinessBand = 'below_zenith' | 'approaching' | 'zenith_ready' | 'horizon_locked';

export interface NationalSubjectZenithReadinessBrief {
  turn: number;
  zenithIndex: number;
  band: SubjectZenithReadinessBand;
  zenithDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceZenithBand = 'fragile' | 'thin' | 'elevated' | 'horizon';

export interface NationalWorkforceZenithIndex {
  turn: number;
  zenithIndex: number;
  band: WorkforceZenithBand;
  zenithDrag: number;
  summary: string;
  stewardNote: string;
}

export type ZenithFlexibilityCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalZenithFlexibilityCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ZenithFlexibilityCouplingBand;
  zenithDrag: number;
  summary: string;
  stewardNote: string;
}

export type FlexibilityAscentBand = 'ebbing' | 'patchy' | 'rising' | 'ascent';

export interface NationalFlexibilityAscentOutlook {
  turn: number;
  ascentIndex: number;
  band: FlexibilityAscentBand;
  horizonDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectApogeeReadinessBand = 'below_apogee' | 'approaching' | 'apogee_ready' | 'orbit_locked';

export interface NationalSubjectApogeeReadinessBrief {
  turn: number;
  apogeeIndex: number;
  band: SubjectApogeeReadinessBand;
  apogeeDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceApogeeBand = 'fragile' | 'thin' | 'elevated' | 'apogee';

export interface NationalWorkforceApogeeIndex {
  turn: number;
  apogeeIndex: number;
  band: WorkforceApogeeBand;
  apogeeDrag: number;
  summary: string;
  stewardNote: string;
}

export type ApogeeInclusionCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalApogeeInclusionCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ApogeeInclusionCouplingBand;
  apogeeDrag: number;
  summary: string;
  stewardNote: string;
}

export type InclusionOrbitBand = 'ebbing' | 'patchy' | 'rising' | 'orbit';

export interface NationalInclusionOrbitOutlook {
  turn: number;
  orbitIndex: number;
  band: InclusionOrbitBand;
  ascentDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectOrbitReadinessBand = 'below_orbit' | 'approaching' | 'orbit_ready' | 'crown_locked';

export interface NationalSubjectOrbitReadinessBrief {
  turn: number;
  orbitIndex: number;
  band: SubjectOrbitReadinessBand;
  orbitDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceOrbitBand = 'fragile' | 'thin' | 'elevated' | 'orbit';

export interface NationalWorkforceOrbitIndex {
  turn: number;
  orbitIndex: number;
  band: WorkforceOrbitBand;
  orbitDrag: number;
  summary: string;
  stewardNote: string;
}

export type OrbitCareCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalOrbitCareCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: OrbitCareCouplingBand;
  orbitDrag: number;
  summary: string;
  stewardNote: string;
}

export type CareEquilibriumBand = 'ebbing' | 'patchy' | 'rising' | 'equilibrium';

export interface NationalCareEquilibriumOutlook {
  turn: number;
  equilibriumIndex: number;
  band: CareEquilibriumBand;
  orbitDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectNexusReadinessBand = 'below_nexus' | 'approaching' | 'nexus_ready' | 'sealed_locked';

export interface NationalSubjectNexusReadinessBrief {
  turn: number;
  nexusIndex: number;
  band: SubjectNexusReadinessBand;
  nexusDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceNexusBand = 'fragile' | 'thin' | 'elevated' | 'nexus';

export interface NationalWorkforceNexusIndex {
  turn: number;
  nexusIndex: number;
  band: WorkforceNexusBand;
  nexusDrag: number;
  summary: string;
  stewardNote: string;
}

export type NexusSchedulingCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalNexusSchedulingCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: NexusSchedulingCouplingBand;
  nexusDrag: number;
  summary: string;
  stewardNote: string;
}

export type SchedulingResonanceBand = 'ebbing' | 'patchy' | 'rising' | 'resonance';

export interface NationalSchedulingResonanceOutlook {
  turn: number;
  resonanceIndex: number;
  band: SchedulingResonanceBand;
  equilibriumDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectConvergenceReadinessBand =
  | 'below_convergence'
  | 'approaching'
  | 'convergence_ready'
  | 'nexus_locked';

export interface NationalSubjectConvergenceReadinessBrief {
  turn: number;
  convergenceIndex: number;
  band: SubjectConvergenceReadinessBand;
  convergenceDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceConvergenceBand = 'fragile' | 'thin' | 'elevated' | 'convergence';

export interface NationalWorkforceConvergenceIndex {
  turn: number;
  convergenceIndex: number;
  band: WorkforceConvergenceBand;
  convergenceDrag: number;
  summary: string;
  stewardNote: string;
}

export type ConvergenceSafetyCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalConvergenceSafetyCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ConvergenceSafetyCouplingBand;
  convergenceDrag: number;
  summary: string;
  stewardNote: string;
}

export type SafetyHarmonyBand = 'ebbing' | 'patchy' | 'rising' | 'harmony';

export interface NationalSafetyHarmonyOutlook {
  turn: number;
  harmonyIndex: number;
  band: SafetyHarmonyBand;
  resonanceDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectUnificationReadinessBand =
  | 'below_unification'
  | 'approaching'
  | 'unification_ready'
  | 'convergence_locked';

export interface NationalSubjectUnificationReadinessBrief {
  turn: number;
  unificationIndex: number;
  band: SubjectUnificationReadinessBand;
  unificationDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceUnificationBand = 'fragile' | 'thin' | 'elevated' | 'unification';

export interface NationalWorkforceUnificationIndex {
  turn: number;
  unificationIndex: number;
  band: WorkforceUnificationBand;
  unificationDrag: number;
  summary: string;
  stewardNote: string;
}

export type UnificationUpskillingCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalUnificationUpskillingCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: UnificationUpskillingCouplingBand;
  unificationDrag: number;
  summary: string;
  stewardNote: string;
}

export type UpskillingSynthesisBand = 'ebbing' | 'patchy' | 'rising' | 'synthesis';

export interface NationalUpskillingSynthesisOutlook {
  turn: number;
  synthesisIndex: number;
  band: UpskillingSynthesisBand;
  harmonyDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectSynthesisReadinessBand =
  | 'below_synthesis'
  | 'approaching'
  | 'synthesis_ready'
  | 'unification_locked';

export interface NationalSubjectSynthesisReadinessBrief {
  turn: number;
  synthesisIndex: number;
  band: SubjectSynthesisReadinessBand;
  synthesisDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceSynthesisBand = 'fragile' | 'thin' | 'elevated' | 'synthesis';

export interface NationalWorkforceSynthesisIndex {
  turn: number;
  synthesisIndex: number;
  band: WorkforceSynthesisBand;
  synthesisDrag: number;
  summary: string;
  stewardNote: string;
}

export type SynthesisOnboardingCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalSynthesisOnboardingCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: SynthesisOnboardingCouplingBand;
  synthesisDrag: number;
  summary: string;
  stewardNote: string;
}

export type OnboardingIntegrationBand = 'ebbing' | 'patchy' | 'rising' | 'integration';

export interface NationalOnboardingIntegrationOutlook {
  turn: number;
  integrationIndex: number;
  band: OnboardingIntegrationBand;
  synthesisDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectIntegrationReadinessBand =
  | 'below_integration'
  | 'approaching'
  | 'integration_ready'
  | 'synthesis_locked';

export interface NationalSubjectIntegrationReadinessBrief {
  turn: number;
  integrationIndex: number;
  band: SubjectIntegrationReadinessBand;
  integrationDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceIntegrationBand = 'fragile' | 'thin' | 'elevated' | 'integration';

export interface NationalWorkforceIntegrationIndex {
  turn: number;
  integrationIndex: number;
  band: WorkforceIntegrationBand;
  integrationDrag: number;
  summary: string;
  stewardNote: string;
}

export type IntegrationRetentionCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalIntegrationRetentionCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: IntegrationRetentionCouplingBand;
  integrationDrag: number;
  summary: string;
  stewardNote: string;
}

export type RetentionCohesionBand = 'ebbing' | 'patchy' | 'rising' | 'cohesion';

export interface NationalRetentionCohesionOutlook {
  turn: number;
  cohesionIndex: number;
  band: RetentionCohesionBand;
  integrationDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectRetentionReadinessBand =
  | 'below_retention'
  | 'approaching'
  | 'retention_ready'
  | 'integration_locked';

export interface NationalSubjectRetentionReadinessBrief {
  turn: number;
  retentionIndex: number;
  band: SubjectRetentionReadinessBand;
  retentionDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceRetentionBand = 'fragile' | 'thin' | 'elevated' | 'retention';

export interface NationalWorkforceRetentionIndex {
  turn: number;
  retentionIndex: number;
  band: WorkforceRetentionBand;
  retentionDrag: number;
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
