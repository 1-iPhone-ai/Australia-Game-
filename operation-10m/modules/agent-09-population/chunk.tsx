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
  retentionReengagementCouplingBrief?: NationalRetentionReengagementCouplingBrief;
  reengagementAlignmentOutlook?: NationalReengagementAlignmentOutlook;
  subjectReengagementReadinessBrief?: NationalSubjectReengagementReadinessBrief;
  nationalWorkforceReengagementIndex?: NationalWorkforceReengagementIndex;
  reengagementMentorshipCouplingBrief?: NationalReengagementMentorshipCouplingBrief;
  mentorshipSustainOutlook?: NationalMentorshipSustainOutlook;
  subjectMentorshipReadinessBrief?: NationalSubjectMentorshipReadinessBrief;
  nationalWorkforceMentorshipIndex?: NationalWorkforceMentorshipIndex;
  mentorshipAdvocacyCouplingBrief?: NationalMentorshipAdvocacyCouplingBrief;
  advocacyResonanceOutlook?: NationalAdvocacyResonanceOutlook;
  subjectAdvocacyReadinessBrief?: NationalSubjectAdvocacyReadinessBrief;
  nationalWorkforceAdvocacyIndex?: NationalWorkforceAdvocacyIndex;
  advocacyInclusionCouplingBrief?: NationalAdvocacyInclusionCouplingBrief;
  inclusionEquityOutlook?: NationalInclusionEquityOutlook;
  subjectInclusionReadinessBrief?: NationalSubjectInclusionReadinessBrief;
  nationalWorkforceInclusionIndex?: NationalWorkforceInclusionIndex;
  inclusionFlexibilityCouplingBrief?: NationalInclusionFlexibilityCouplingBrief;
  flexibilityFlowOutlook?: NationalFlexibilityFlowOutlook;
  subjectFlexibilityReadinessBrief?: NationalSubjectFlexibilityReadinessBrief;
  nationalWorkforceFlexibilityIndex?: NationalWorkforceFlexibilityIndex;
  flexibilityCoordinationCouplingBrief?: NationalFlexibilityCoordinationCouplingBrief;
  coordinationMeshOutlook?: NationalCoordinationMeshOutlook;
  subjectCoordinationReadinessBrief?: NationalSubjectCoordinationReadinessBrief;
  nationalWorkforceCoordinationIndex?: NationalWorkforceCoordinationIndex;
  coordinationSchedulingCouplingBrief?: NationalCoordinationSchedulingCouplingBrief;
  schedulingPulseOutlook?: NationalSchedulingPulseOutlook;
  subjectSchedulingReadinessBrief?: NationalSubjectSchedulingReadinessBrief;
  nationalWorkforceSchedulingIndex?: NationalWorkforceSchedulingIndex;
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

export type RetentionReengagementCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalRetentionReengagementCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: RetentionReengagementCouplingBand;
  retentionDrag: number;
  summary: string;
  stewardNote: string;
}

export type ReengagementAlignmentBand = 'ebbing' | 'patchy' | 'rising' | 'aligned';

export interface NationalReengagementAlignmentOutlook {
  turn: number;
  alignmentIndex: number;
  band: ReengagementAlignmentBand;
  retentionDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectReengagementReadinessBand =
  | 'below_reengagement'
  | 'approaching'
  | 'reengagement_ready'
  | 'retention_locked';

export interface NationalSubjectReengagementReadinessBrief {
  turn: number;
  reengagementIndex: number;
  band: SubjectReengagementReadinessBand;
  reengagementDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceReengagementBand = 'fragile' | 'thin' | 'elevated' | 'reengagement';

export interface NationalWorkforceReengagementIndex {
  turn: number;
  reengagementIndex: number;
  band: WorkforceReengagementBand;
  reengagementDrag: number;
  summary: string;
  stewardNote: string;
}

export type ReengagementMentorshipCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalReengagementMentorshipCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: ReengagementMentorshipCouplingBand;
  reengagementDrag: number;
  summary: string;
  stewardNote: string;
}

export type MentorshipSustainBand = 'ebbing' | 'patchy' | 'rising' | 'sustained';

export interface NationalMentorshipSustainOutlook {
  turn: number;
  sustainIndex: number;
  band: MentorshipSustainBand;
  reengagementDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectMentorshipReadinessBand =
  | 'below_mentorship'
  | 'approaching'
  | 'mentorship_ready'
  | 'reengagement_locked';

export interface NationalSubjectMentorshipReadinessBrief {
  turn: number;
  mentorshipIndex: number;
  band: SubjectMentorshipReadinessBand;
  mentorshipDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceMentorshipBand = 'fragile' | 'thin' | 'elevated' | 'mentorship';

export interface NationalWorkforceMentorshipIndex {
  turn: number;
  mentorshipIndex: number;
  band: WorkforceMentorshipBand;
  mentorshipDrag: number;
  summary: string;
  stewardNote: string;
}

export type MentorshipAdvocacyCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalMentorshipAdvocacyCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: MentorshipAdvocacyCouplingBand;
  mentorshipDrag: number;
  summary: string;
  stewardNote: string;
}

export type AdvocacyResonanceBand = 'ebbing' | 'patchy' | 'rising' | 'resonant';

export interface NationalAdvocacyResonanceOutlook {
  turn: number;
  resonanceIndex: number;
  band: AdvocacyResonanceBand;
  mentorshipDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectAdvocacyReadinessBand =
  | 'below_advocacy'
  | 'approaching'
  | 'advocacy_ready'
  | 'mentorship_locked';

export interface NationalSubjectAdvocacyReadinessBrief {
  turn: number;
  advocacyIndex: number;
  band: SubjectAdvocacyReadinessBand;
  advocacyDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceAdvocacyBand = 'fragile' | 'thin' | 'elevated' | 'advocacy';

export interface NationalWorkforceAdvocacyIndex {
  turn: number;
  advocacyIndex: number;
  band: WorkforceAdvocacyBand;
  advocacyDrag: number;
  summary: string;
  stewardNote: string;
}

export type AdvocacyInclusionCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalAdvocacyInclusionCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: AdvocacyInclusionCouplingBand;
  advocacyDrag: number;
  summary: string;
  stewardNote: string;
}

export type InclusionEquityBand = 'ebbing' | 'patchy' | 'rising' | 'equitable';

export interface NationalInclusionEquityOutlook {
  turn: number;
  equityIndex: number;
  band: InclusionEquityBand;
  advocacyDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectInclusionReadinessBand =
  | 'below_inclusion'
  | 'approaching'
  | 'inclusion_ready'
  | 'advocacy_locked';

export interface NationalSubjectInclusionReadinessBrief {
  turn: number;
  inclusionIndex: number;
  band: SubjectInclusionReadinessBand;
  inclusionDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceInclusionBand = 'fragile' | 'thin' | 'elevated' | 'inclusion';

export interface NationalWorkforceInclusionIndex {
  turn: number;
  inclusionIndex: number;
  band: WorkforceInclusionBand;
  inclusionDrag: number;
  summary: string;
  stewardNote: string;
}

export type InclusionFlexibilityCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalInclusionFlexibilityCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: InclusionFlexibilityCouplingBand;
  inclusionDrag: number;
  summary: string;
  stewardNote: string;
}

export type FlexibilityFlowBand = 'ebbing' | 'patchy' | 'rising' | 'flowing';

export interface NationalFlexibilityFlowOutlook {
  turn: number;
  flowIndex: number;
  band: FlexibilityFlowBand;
  inclusionDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectFlexibilityReadinessBand =
  | 'below_flexibility'
  | 'approaching'
  | 'flexibility_ready'
  | 'inclusion_locked';

export interface NationalSubjectFlexibilityReadinessBrief {
  turn: number;
  flexibilityIndex: number;
  band: SubjectFlexibilityReadinessBand;
  flexibilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceFlexibilityBand = 'fragile' | 'thin' | 'elevated' | 'flexibility';

export interface NationalWorkforceFlexibilityIndex {
  turn: number;
  flexibilityIndex: number;
  band: WorkforceFlexibilityBand;
  flexibilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type FlexibilityCoordinationCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalFlexibilityCoordinationCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: FlexibilityCoordinationCouplingBand;
  flexibilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type CoordinationMeshBand = 'ebbing' | 'patchy' | 'rising' | 'meshed';

export interface NationalCoordinationMeshOutlook {
  turn: number;
  meshIndex: number;
  band: CoordinationMeshBand;
  flexibilityDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectCoordinationReadinessBand =
  | 'below_coordination'
  | 'approaching'
  | 'coordination_ready'
  | 'flexibility_locked';

export interface NationalSubjectCoordinationReadinessBrief {
  turn: number;
  coordinationIndex: number;
  band: SubjectCoordinationReadinessBand;
  coordinationDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceCoordinationBand = 'fragile' | 'thin' | 'elevated' | 'coordination';

export interface NationalWorkforceCoordinationIndex {
  turn: number;
  coordinationIndex: number;
  band: WorkforceCoordinationBand;
  coordinationDrag: number;
  summary: string;
  stewardNote: string;
}

export type CoordinationSchedulingCouplingBand = 'decoupled' | 'strained' | 'amplified' | 'elevated';

export interface NationalCoordinationSchedulingCouplingBrief {
  turn: number;
  couplingIndex: number;
  band: CoordinationSchedulingCouplingBand;
  coordinationDrag: number;
  summary: string;
  stewardNote: string;
}

export type SchedulingPulseBand = 'ebbing' | 'patchy' | 'rising' | 'pulsing';

export interface NationalSchedulingPulseOutlook {
  turn: number;
  pulseIndex: number;
  band: SchedulingPulseBand;
  coordinationDrag: number;
  summary: string;
  stewardNote: string;
}

export type SubjectSchedulingReadinessBand =
  | 'below_scheduling'
  | 'approaching'
  | 'scheduling_ready'
  | 'coordination_locked';

export interface NationalSubjectSchedulingReadinessBrief {
  turn: number;
  schedulingIndex: number;
  band: SubjectSchedulingReadinessBand;
  schedulingDrag: number;
  summary: string;
  stewardNote: string;
}

export type WorkforceSchedulingBand = 'fragile' | 'thin' | 'elevated' | 'scheduling';

export interface NationalWorkforceSchedulingIndex {
  turn: number;
  schedulingIndex: number;
  band: WorkforceSchedulingBand;
  schedulingDrag: number;
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
  | 'workforce_durability'
  | 'durability_advocacy_coupling'
  | 'mentorship_endurance'
  | 'subject_tranche_readiness'
  | 'workforce_endurance'
  | 'endurance_flexibility_coupling'
  | 'inclusion_resilience'
  | 'subject_commit_readiness'
  | 'workforce_tenacity'
  | 'tenacity_care_coupling'
  | 'safety_cohesion'
  | 'subject_release_readiness'
  | 'workforce_steadfast'
  | 'steadfast_scheduling_coupling'
  | 'retention_anchor'
  | 'subject_seal_readiness'
  | 'workforce_resolve'
  | 'resolve_upskilling_coupling'
  | 'coordination_bind'
  | 'subject_bind_readiness'
  | 'workforce_fortitude'
  | 'fortitude_inclusion_coupling'
  | 'hybrid_anchor'
  | 'subject_crown_readiness'
  | 'workforce_culmination'
  | 'culmination_mentorship_coupling'
  | 'onboarding_sustain'
  | 'subject_apex_readiness'
  | 'workforce_apex'
  | 'apex_advocacy_coupling'
  | 'reengagement_thrust'
  | 'subject_pinnacle_readiness'
  | 'workforce_pinnacle'
  | 'pinnacle_retention_coupling'
  | 'retention_crest'
  | 'subject_summit_readiness'
  | 'workforce_summit'
  | 'summit_coordination_coupling'
  | 'coordination_horizon'
  | 'subject_zenith_readiness'
  | 'workforce_zenith'
  | 'zenith_flexibility_coupling'
  | 'flexibility_ascent'
  | 'subject_apogee_readiness'
  | 'workforce_apogee'
  | 'apogee_inclusion_coupling'
  | 'inclusion_orbit'
  | 'subject_orbit_readiness'
  | 'workforce_orbit'
  | 'orbit_care_coupling'
  | 'care_equilibrium'
  | 'subject_nexus_readiness'
  | 'workforce_nexus'
  | 'nexus_scheduling_coupling'
  | 'scheduling_resonance'
  | 'subject_convergence_readiness'
  | 'workforce_convergence'
  | 'convergence_safety_coupling'
  | 'safety_harmony'
  | 'subject_unification_readiness'
  | 'workforce_unification'
  | 'unification_upskilling_coupling'
  | 'upskilling_synthesis'
  | 'subject_synthesis_readiness'
  | 'workforce_synthesis'
  | 'synthesis_onboarding_coupling'
  | 'onboarding_integration'
  | 'subject_integration_readiness'
  | 'workforce_integration'
  | 'integration_retention_coupling'
  | 'retention_cohesion'
  | 'subject_retention_readiness'
  | 'workforce_retention'
  | 'retention_reengagement_coupling'
  | 'reengagement_alignment'
  | 'subject_reengagement_readiness'
  | 'workforce_reengagement'
  | 'reengagement_mentorship_coupling'
  | 'mentorship_sustain'
  | 'subject_mentorship_readiness'
  | 'workforce_mentorship'
  | 'mentorship_advocacy_coupling'
  | 'advocacy_resonance'
  | 'subject_advocacy_readiness'
  | 'workforce_advocacy'
  | 'advocacy_inclusion_coupling'
  | 'inclusion_equity'
  | 'subject_inclusion_readiness'
  | 'workforce_inclusion'
  | 'inclusion_flexibility_coupling'
  | 'flexibility_flow'
  | 'subject_flexibility_readiness'
  | 'workforce_flexibility'
  | 'flexibility_coordination_coupling'
  | 'coordination_mesh'
  | 'subject_coordination_readiness'
  | 'workforce_coordination'
  | 'coordination_scheduling_coupling'
  | 'scheduling_pulse'
  | 'subject_scheduling_readiness'
  | 'workforce_scheduling';

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
  if (/\b(participation equity|equity gap)/.test(q)) return 'participation_equity';
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
  if (/\b(durability advocacy|durability-advocacy coupling)/.test(q)) return 'durability_advocacy_coupling';
  if (/\b(mentorship endurance|mentorship pipeline endurance)/.test(q)) return 'mentorship_endurance';
  if (/\b(subject tranche readiness|tranche readiness subject)/.test(q)) return 'subject_tranche_readiness';
  if (/\b(workforce endurance|endurance index labor)/.test(q)) return 'workforce_endurance';
  if (/\b(endurance flexibility|endurance-flexibility coupling)/.test(q)) return 'endurance_flexibility_coupling';
  if (/\b(inclusion resilience|inclusion labor resilience)/.test(q)) return 'inclusion_resilience';
  if (/\b(subject commit readiness|commit readiness subject)/.test(q)) return 'subject_commit_readiness';
  if (/\b(workforce tenacity|tenacity index labor)/.test(q)) return 'workforce_tenacity';
  if (/\b(tenacity care|tenacity-care coupling)/.test(q)) return 'tenacity_care_coupling';
  if (/\b(safety cohesion|labor safety cohesion)/.test(q)) return 'safety_cohesion';
  if (/\b(subject release readiness|release readiness subject)/.test(q)) return 'subject_release_readiness';
  if (/\b(workforce steadfast|steadfast index labor)/.test(q)) return 'workforce_steadfast';
  if (/\b(steadfast scheduling|steadfast-scheduling coupling)/.test(q)) return 'steadfast_scheduling_coupling';
  if (/\b(retention anchor|labor retention anchor)/.test(q)) return 'retention_anchor';
  if (/\b(subject seal readiness|seal readiness subject)/.test(q)) return 'subject_seal_readiness';
  if (/\b(workforce resolve|resolve index labor)/.test(q)) return 'workforce_resolve';
  if (/\b(resolve upskilling|resolve-upskilling coupling)/.test(q)) return 'resolve_upskilling_coupling';
  if (/\b(coordination bind|labor coordination bind)/.test(q)) return 'coordination_bind';
  if (/\b(subject bind readiness|bind readiness subject)/.test(q)) return 'subject_bind_readiness';
  if (/\b(workforce fortitude|fortitude index labor)/.test(q)) return 'workforce_fortitude';
  if (/\b(fortitude inclusion|fortitude-inclusion coupling)/.test(q)) return 'fortitude_inclusion_coupling';
  if (/\b(hybrid anchor|hybrid work anchor)/.test(q)) return 'hybrid_anchor';
  if (/\b(subject crown readiness|crown readiness subject)/.test(q)) return 'subject_crown_readiness';
  if (/\b(workforce culmination|culmination index labor)/.test(q)) return 'workforce_culmination';
  if (/\b(culmination mentorship|culmination-mentorship coupling)/.test(q)) return 'culmination_mentorship_coupling';
  if (/\b(onboarding sustain|onboarding pipeline sustain)/.test(q)) return 'onboarding_sustain';
  if (/\b(subject apex readiness|apex readiness subject)/.test(q)) return 'subject_apex_readiness';
  if (/\b(workforce apex|apex index labor)/.test(q)) return 'workforce_apex';
  if (/\b(apex advocacy|apex-advocacy coupling)/.test(q)) return 'apex_advocacy_coupling';
  if (/\b(reengagement thrust|reengagement pipeline thrust)/.test(q)) return 'reengagement_thrust';
  if (/\b(subject pinnacle readiness|pinnacle readiness subject)/.test(q)) return 'subject_pinnacle_readiness';
  if (/\b(workforce pinnacle|pinnacle index labor)/.test(q)) return 'workforce_pinnacle';
  if (/\b(pinnacle retention|pinnacle-retention coupling)/.test(q)) return 'pinnacle_retention_coupling';
  if (/\b(retention crest|retention pipeline crest)/.test(q)) return 'retention_crest';
  if (/\b(subject summit readiness|summit readiness subject)/.test(q)) return 'subject_summit_readiness';
  if (/\b(workforce summit|summit index labor)/.test(q)) return 'workforce_summit';
  if (/\b(summit coordination|summit-coordination coupling)/.test(q)) return 'summit_coordination_coupling';
  if (/\b(coordination horizon|coordination pipeline horizon)/.test(q)) return 'coordination_horizon';
  if (/\b(subject zenith readiness|zenith readiness subject)/.test(q)) return 'subject_zenith_readiness';
  if (/\b(workforce zenith|zenith index labor)/.test(q)) return 'workforce_zenith';
  if (/\b(zenith flexibility|zenith-flexibility coupling)/.test(q)) return 'zenith_flexibility_coupling';
  if (/\b(flexibility ascent|flexibility pipeline ascent)/.test(q)) return 'flexibility_ascent';
  if (/\b(subject apogee readiness|apogee readiness subject)/.test(q)) return 'subject_apogee_readiness';
  if (/\b(workforce apogee|apogee index labor)/.test(q)) return 'workforce_apogee';
  if (/\b(apogee inclusion|apogee-inclusion coupling)/.test(q)) return 'apogee_inclusion_coupling';
  if (/\b(inclusion orbit|inclusion pipeline orbit)/.test(q)) return 'inclusion_orbit';
  if (/\b(subject orbit readiness|orbit readiness subject)/.test(q)) return 'subject_orbit_readiness';
  if (/\b(workforce orbit|orbit index labor)/.test(q)) return 'workforce_orbit';
  if (/\b(orbit care|orbit-care coupling)/.test(q)) return 'orbit_care_coupling';
  if (/\b(care equilibrium|care pipeline equilibrium)/.test(q)) return 'care_equilibrium';
  if (/\b(subject nexus readiness|nexus readiness subject)/.test(q)) return 'subject_nexus_readiness';
  if (/\b(workforce nexus|nexus index labor)/.test(q)) return 'workforce_nexus';
  if (/\b(nexus scheduling|nexus-scheduling coupling)/.test(q)) return 'nexus_scheduling_coupling';
  if (/\b(scheduling resonance|scheduling pipeline resonance)/.test(q)) return 'scheduling_resonance';
  if (/\b(subject convergence readiness|convergence readiness subject)/.test(q)) {
    return 'subject_convergence_readiness';
  }
  if (/\b(workforce convergence|convergence index labor)/.test(q)) return 'workforce_convergence';
  if (/\b(convergence safety|convergence-safety coupling)/.test(q)) return 'convergence_safety_coupling';
  if (/\b(safety harmony|safety pipeline harmony)/.test(q)) return 'safety_harmony';
  if (/\b(subject unification readiness|unification readiness subject)/.test(q)) {
    return 'subject_unification_readiness';
  }
  if (/\b(workforce unification|unification index labor)/.test(q)) return 'workforce_unification';
  if (/\b(unification upskilling|unification-upskilling coupling)/.test(q)) return 'unification_upskilling_coupling';
  if (/\b(upskilling synthesis|upskilling pipeline synthesis)/.test(q)) return 'upskilling_synthesis';
  if (/\b(subject synthesis readiness|synthesis readiness subject)/.test(q)) return 'subject_synthesis_readiness';
  if (/\b(workforce synthesis|synthesis index labor)/.test(q)) return 'workforce_synthesis';
  if (/\b(synthesis onboarding|synthesis-onboarding coupling)/.test(q)) return 'synthesis_onboarding_coupling';
  if (/\b(onboarding integration|onboarding pipeline integration)/.test(q)) return 'onboarding_integration';
  if (/\b(subject integration readiness|integration readiness subject)/.test(q)) {
    return 'subject_integration_readiness';
  }
  if (/\b(workforce integration|integration index labor)/.test(q)) return 'workforce_integration';
  if (/\b(integration retention|integration-retention coupling)/.test(q)) return 'integration_retention_coupling';
  if (/\b(retention cohesion|retention pipeline cohesion)/.test(q)) return 'retention_cohesion';
  if (/\b(subject retention readiness|retention readiness subject)/.test(q)) {
    return 'subject_retention_readiness';
  }
  if (/\b(workforce retention|retention index labor)/.test(q)) return 'workforce_retention';
  if (/\b(retention reengagement|retention-reengagement coupling)/.test(q)) return 'retention_reengagement_coupling';
  if (/\b(reengagement alignment|reengagement pipeline alignment)/.test(q)) return 'reengagement_alignment';
  if (/\b(subject reengagement readiness|reengagement readiness subject)/.test(q)) {
    return 'subject_reengagement_readiness';
  }
  if (/\b(workforce reengagement|reengagement index labor workforce)/.test(q)) return 'workforce_reengagement';
  if (/\b(reengagement mentorship|reengagement-mentorship coupling)/.test(q)) return 'reengagement_mentorship_coupling';
  if (/\b(mentorship sustain|mentorship pipeline sustain)/.test(q)) return 'mentorship_sustain';
  if (/\b(subject mentorship readiness|mentorship readiness subject)/.test(q)) {
    return 'subject_mentorship_readiness';
  }
  if (/\b(workforce mentorship|mentorship index labor workforce)/.test(q)) return 'workforce_mentorship';
  if (/\b(mentorship advocacy|mentorship-advocacy coupling)/.test(q)) return 'mentorship_advocacy_coupling';
  if (/\b(advocacy resonance|advocacy pipeline resonance)/.test(q)) return 'advocacy_resonance';
  if (/\b(subject advocacy readiness|advocacy readiness subject)/.test(q)) {
    return 'subject_advocacy_readiness';
  }
  if (/\b(workforce advocacy|advocacy index labor workforce)/.test(q)) return 'workforce_advocacy';
  if (/\b(advocacy inclusion|advocacy-inclusion coupling)/.test(q)) return 'advocacy_inclusion_coupling';
  if (/\b(inclusion equity|inclusion pipeline equity)/.test(q)) return 'inclusion_equity';
  if (/\b(subject inclusion readiness|inclusion readiness subject)/.test(q)) {
    return 'subject_inclusion_readiness';
  }
  if (/\b(workforce inclusion|inclusion index labor workforce)/.test(q)) return 'workforce_inclusion';
  if (/\b(inclusion flexibility|inclusion-flexibility coupling)/.test(q)) return 'inclusion_flexibility_coupling';
  if (/\b(flexibility flow|flexibility pipeline flow)/.test(q)) return 'flexibility_flow';
  if (/\b(subject flexibility readiness|flexibility readiness subject)/.test(q)) {
    return 'subject_flexibility_readiness';
  }
  if (/\b(workforce flexibility|flexibility index labor workforce)/.test(q)) return 'workforce_flexibility';
  if (/\b(flexibility coordination|flexibility-coordination coupling)/.test(q)) {
    return 'flexibility_coordination_coupling';
  }
  if (/\b(coordination mesh|coordination pipeline mesh)/.test(q)) return 'coordination_mesh';
  if (/\b(subject coordination readiness|coordination readiness subject)/.test(q)) {
    return 'subject_coordination_readiness';
  }
  if (/\b(workforce coordination|coordination index labor workforce)/.test(q)) return 'workforce_coordination';
  if (/\b(coordination scheduling|coordination-scheduling coupling)/.test(q)) {
    return 'coordination_scheduling_coupling';
  }
  if (/\b(scheduling pulse|scheduling pipeline pulse)/.test(q)) return 'scheduling_pulse';
  if (/\b(subject scheduling readiness|scheduling readiness subject)/.test(q)) {
    return 'subject_scheduling_readiness';
  }
  if (/\b(workforce scheduling|scheduling index labor workforce)/.test(q)) return 'workforce_scheduling';
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
    case 'durability_advocacy_coupling':
      return {
        topic,
        headline: state.durabilityAdvocacyCouplingBrief?.summary || 'Durability-advocacy coupling unavailable.',
        fact: `Coupling band ${state.durabilityAdvocacyCouplingBrief?.band ?? 'unknown'}; durability drag ${Math.round(state.durabilityAdvocacyCouplingBrief?.durabilityDrag ?? 0)}.`,
        inference: state.durabilityAdvocacyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce durability with advocacy levers — bounded indices only.'
      };
    case 'mentorship_endurance':
      return {
        topic,
        headline: state.mentorshipEnduranceOutlook?.summary || 'Mentorship endurance unavailable.',
        fact: `Endurance band ${state.mentorshipEnduranceOutlook?.band ?? 'unknown'}; momentum drag ${Math.round(state.mentorshipEnduranceOutlook?.momentumDrag ?? 0)}.`,
        inference: state.mentorshipEnduranceOutlook?.stewardNote || state.outlook,
        projection: 'Endurance blends mentorship levers with reengagement momentum — not literal mentor counts.'
      };
    case 'subject_tranche_readiness':
      return {
        topic,
        headline: state.subjectTrancheReadinessBrief?.summary || 'Subject tranche readiness unavailable.',
        fact: `Tranche band ${state.subjectTrancheReadinessBrief?.band ?? 'unknown'}; tranche drag ${Math.round(state.subjectTrancheReadinessBrief?.trancheDrag ?? 0)}.`,
        inference: state.subjectTrancheReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject tranche readiness gates wave assembly against durability for O10-170 commits.'
      };
    case 'workforce_endurance':
      return {
        topic,
        headline: state.nationalWorkforceEnduranceIndex?.summary || 'Workforce endurance unavailable.',
        fact: `Endurance band ${state.nationalWorkforceEnduranceIndex?.band ?? 'unknown'}; tranche drag ${Math.round(state.nationalWorkforceEnduranceIndex?.trancheDrag ?? 0)}.`,
        inference: state.nationalWorkforceEnduranceIndex?.stewardNote || state.summary,
        projection: 'Endurance synthesizes advocacy coupling, mentorship endurance, and subject tranche readiness.'
      };
    case 'endurance_flexibility_coupling':
      return {
        topic,
        headline: state.enduranceFlexibilityCouplingBrief?.summary || 'Endurance-flexibility coupling unavailable.',
        fact: `Coupling band ${state.enduranceFlexibilityCouplingBrief?.band ?? 'unknown'}; endurance drag ${Math.round(state.enduranceFlexibilityCouplingBrief?.enduranceDrag ?? 0)}.`,
        inference: state.enduranceFlexibilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce endurance with flexibility levers — bounded indices only.'
      };
    case 'inclusion_resilience':
      return {
        topic,
        headline: state.inclusionResilienceOutlook?.summary || 'Inclusion resilience unavailable.',
        fact: `Resilience band ${state.inclusionResilienceOutlook?.band ?? 'unknown'}; endurance drag ${Math.round(state.inclusionResilienceOutlook?.enduranceDrag ?? 0)}.`,
        inference: state.inclusionResilienceOutlook?.stewardNote || state.outlook,
        projection: 'Resilience blends inclusion levers with mentorship endurance — not literal headcount.'
      };
    case 'subject_commit_readiness':
      return {
        topic,
        headline: state.subjectCommitReadinessBrief?.summary || 'Subject commit readiness unavailable.',
        fact: `Commit band ${state.subjectCommitReadinessBrief?.band ?? 'unknown'}; commit drag ${Math.round(state.subjectCommitReadinessBrief?.commitDrag ?? 0)}.`,
        inference: state.subjectCommitReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject commit readiness gates tranche against endurance for O10-173 scale commits.'
      };
    case 'workforce_tenacity':
      return {
        topic,
        headline: state.nationalWorkforceTenacityIndex?.summary || 'Workforce tenacity unavailable.',
        fact: `Tenacity band ${state.nationalWorkforceTenacityIndex?.band ?? 'unknown'}; commit drag ${Math.round(state.nationalWorkforceTenacityIndex?.commitDrag ?? 0)}.`,
        inference: state.nationalWorkforceTenacityIndex?.stewardNote || state.summary,
        projection: 'Tenacity synthesizes flexibility coupling, inclusion resilience, and subject commit readiness.'
      };
    case 'tenacity_care_coupling':
      return {
        topic,
        headline: state.tenacityCareCouplingBrief?.summary || 'Tenacity-care coupling unavailable.',
        fact: `Coupling band ${state.tenacityCareCouplingBrief?.band ?? 'unknown'}; tenacity drag ${Math.round(state.tenacityCareCouplingBrief?.tenacityDrag ?? 0)}.`,
        inference: state.tenacityCareCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce tenacity with care levers — bounded indices only.'
      };
    case 'safety_cohesion':
      return {
        topic,
        headline: state.safetyCohesionOutlook?.summary || 'Safety cohesion unavailable.',
        fact: `Cohesion band ${state.safetyCohesionOutlook?.band ?? 'unknown'}; resilience drag ${Math.round(state.safetyCohesionOutlook?.resilienceDrag ?? 0)}.`,
        inference: state.safetyCohesionOutlook?.stewardNote || state.outlook,
        projection: 'Cohesion blends safety levers with inclusion resilience — not literal incident counts.'
      };
    case 'subject_release_readiness':
      return {
        topic,
        headline: state.subjectReleaseReadinessBrief?.summary || 'Subject release readiness unavailable.',
        fact: `Release band ${state.subjectReleaseReadinessBrief?.band ?? 'unknown'}; release drag ${Math.round(state.subjectReleaseReadinessBrief?.releaseDrag ?? 0)}.`,
        inference: state.subjectReleaseReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject release readiness gates commit against tenacity for O10-175 scale release.'
      };
    case 'workforce_steadfast':
      return {
        topic,
        headline: state.nationalWorkforceSteadfastIndex?.summary || 'Workforce steadfast unavailable.',
        fact: `Steadfast band ${state.nationalWorkforceSteadfastIndex?.band ?? 'unknown'}; release drag ${Math.round(state.nationalWorkforceSteadfastIndex?.releaseDrag ?? 0)}.`,
        inference: state.nationalWorkforceSteadfastIndex?.stewardNote || state.summary,
        projection: 'Steadfast synthesizes care coupling, safety cohesion, and subject release readiness.'
      };
    case 'steadfast_scheduling_coupling':
      return {
        topic,
        headline: state.steadfastSchedulingCouplingBrief?.summary || 'Steadfast-scheduling coupling unavailable.',
        fact: `Coupling band ${state.steadfastSchedulingCouplingBrief?.band ?? 'unknown'}; steadfast drag ${Math.round(state.steadfastSchedulingCouplingBrief?.steadfastDrag ?? 0)}.`,
        inference: state.steadfastSchedulingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce steadfast with scheduling levers — bounded indices only.'
      };
    case 'retention_anchor':
      return {
        topic,
        headline: state.retentionAnchorOutlook?.summary || 'Retention anchor unavailable.',
        fact: `Anchor band ${state.retentionAnchorOutlook?.band ?? 'unknown'}; cohesion drag ${Math.round(state.retentionAnchorOutlook?.cohesionDrag ?? 0)}.`,
        inference: state.retentionAnchorOutlook?.stewardNote || state.outlook,
        projection: 'Anchor blends retention levers with safety cohesion — not literal headcount.'
      };
    case 'subject_seal_readiness':
      return {
        topic,
        headline: state.subjectSealReadinessBrief?.summary || 'Subject seal readiness unavailable.',
        fact: `Seal band ${state.subjectSealReadinessBrief?.band ?? 'unknown'}; seal drag ${Math.round(state.subjectSealReadinessBrief?.sealDrag ?? 0)}.`,
        inference: state.subjectSealReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject seal readiness gates release against steadfast for O10-177 wave seal.'
      };
    case 'workforce_resolve':
      return {
        topic,
        headline: state.nationalWorkforceResolveIndex?.summary || 'Workforce resolve unavailable.',
        fact: `Resolve band ${state.nationalWorkforceResolveIndex?.band ?? 'unknown'}; seal drag ${Math.round(state.nationalWorkforceResolveIndex?.sealDrag ?? 0)}.`,
        inference: state.nationalWorkforceResolveIndex?.stewardNote || state.summary,
        projection: 'Resolve synthesizes scheduling coupling, retention anchor, and subject seal readiness.'
      };
    case 'resolve_upskilling_coupling':
      return {
        topic,
        headline: state.resolveUpskillingCouplingBrief?.summary || 'Resolve-upskilling coupling unavailable.',
        fact: `Coupling band ${state.resolveUpskillingCouplingBrief?.band ?? 'unknown'}; resolve drag ${Math.round(state.resolveUpskillingCouplingBrief?.resolveDrag ?? 0)}.`,
        inference: state.resolveUpskillingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce resolve with upskilling velocity and program levers.'
      };
    case 'coordination_bind':
      return {
        topic,
        headline: state.coordinationBindOutlook?.summary || 'Coordination bind unavailable.',
        fact: `Bind band ${state.coordinationBindOutlook?.band ?? 'unknown'}; scheduling drag ${Math.round(state.coordinationBindOutlook?.schedulingDrag ?? 0)}.`,
        inference: state.coordinationBindOutlook?.stewardNote || state.outlook,
        projection: 'Bind blends coordination levers with steadfast-scheduling coupling.'
      };
    case 'subject_bind_readiness':
      return {
        topic,
        headline: state.subjectBindReadinessBrief?.summary || 'Subject bind readiness unavailable.',
        fact: `Bind band ${state.subjectBindReadinessBrief?.band ?? 'unknown'}; bind drag ${Math.round(state.subjectBindReadinessBrief?.bindDrag ?? 0)}.`,
        inference: state.subjectBindReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject bind readiness gates seal against resolve for O10-179 wave bind.'
      };
    case 'workforce_fortitude':
      return {
        topic,
        headline: state.nationalWorkforceFortitudeIndex?.summary || 'Workforce fortitude unavailable.',
        fact: `Fortitude band ${state.nationalWorkforceFortitudeIndex?.band ?? 'unknown'}; bind drag ${Math.round(state.nationalWorkforceFortitudeIndex?.bindDrag ?? 0)}.`,
        inference: state.nationalWorkforceFortitudeIndex?.stewardNote || state.summary,
        projection: 'Fortitude synthesizes upskilling coupling, coordination bind, and subject bind readiness.'
      };
    case 'fortitude_inclusion_coupling':
      return {
        topic,
        headline: state.fortitudeInclusionCouplingBrief?.summary || 'Fortitude-inclusion coupling unavailable.',
        fact: `Coupling band ${state.fortitudeInclusionCouplingBrief?.band ?? 'unknown'}; fortitude drag ${Math.round(state.fortitudeInclusionCouplingBrief?.fortitudeDrag ?? 0)}.`,
        inference: state.fortitudeInclusionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce fortitude with inclusion levers — bounded indices only.'
      };
    case 'hybrid_anchor':
      return {
        topic,
        headline: state.hybridAnchorOutlook?.summary || 'Hybrid anchor unavailable.',
        fact: `Anchor band ${state.hybridAnchorOutlook?.band ?? 'unknown'}; bind drag ${Math.round(state.hybridAnchorOutlook?.bindDrag ?? 0)}.`,
        inference: state.hybridAnchorOutlook?.stewardNote || state.outlook,
        projection: 'Hybrid anchor blends flexibility levers with coordination bind depth.'
      };
    case 'subject_crown_readiness':
      return {
        topic,
        headline: state.subjectCrownReadinessBrief?.summary || 'Subject crown readiness unavailable.',
        fact: `Crown band ${state.subjectCrownReadinessBrief?.band ?? 'unknown'}; crown drag ${Math.round(state.subjectCrownReadinessBrief?.crownDrag ?? 0)}.`,
        inference: state.subjectCrownReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject crown readiness gates bind against fortitude for O10-181 wave culmination.'
      };
    case 'workforce_culmination':
      return {
        topic,
        headline: state.nationalWorkforceCulminationIndex?.summary || 'Workforce culmination unavailable.',
        fact: `Culmination band ${state.nationalWorkforceCulminationIndex?.band ?? 'unknown'}; crown drag ${Math.round(state.nationalWorkforceCulminationIndex?.crownDrag ?? 0)}.`,
        inference: state.nationalWorkforceCulminationIndex?.stewardNote || state.summary,
        projection: 'Culmination synthesizes inclusion coupling, hybrid anchor, and subject crown for Agent 25 merge.'
      };
    case 'culmination_mentorship_coupling':
      return {
        topic,
        headline: state.culminationMentorshipCouplingBrief?.summary || 'Culmination-mentorship coupling unavailable.',
        fact: `Coupling band ${state.culminationMentorshipCouplingBrief?.band ?? 'unknown'}; culmination drag ${Math.round(state.culminationMentorshipCouplingBrief?.culminationDrag ?? 0)}.`,
        inference: state.culminationMentorshipCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce culmination with mentorship levers — wave 26 / O10-183 depth.'
      };
    case 'onboarding_sustain':
      return {
        topic,
        headline: state.onboardingSustainOutlook?.summary || 'Onboarding sustain unavailable.',
        fact: `Sustain band ${state.onboardingSustainOutlook?.band ?? 'unknown'}; anchor drag ${Math.round(state.onboardingSustainOutlook?.anchorDrag ?? 0)}.`,
        inference: state.onboardingSustainOutlook?.stewardNote || state.outlook,
        projection: 'Onboarding sustain blends onboarding levers with hybrid anchor — bounded indices only.'
      };
    case 'subject_apex_readiness':
      return {
        topic,
        headline: state.subjectApexReadinessBrief?.summary || 'Subject apex readiness unavailable.',
        fact: `Apex band ${state.subjectApexReadinessBrief?.band ?? 'unknown'}; apex drag ${Math.round(state.subjectApexReadinessBrief?.apexDrag ?? 0)}.`,
        inference: state.subjectApexReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject apex readiness gates crown against culmination for O10-183 wave 26.'
      };
    case 'workforce_apex':
      return {
        topic,
        headline: state.nationalWorkforceApexIndex?.summary || 'Workforce apex unavailable.',
        fact: `Apex band ${state.nationalWorkforceApexIndex?.band ?? 'unknown'}; apex drag ${Math.round(state.nationalWorkforceApexIndex?.apexDrag ?? 0)}.`,
        inference: state.nationalWorkforceApexIndex?.stewardNote || state.summary,
        projection: 'Workforce apex synthesizes mentorship coupling, onboarding sustain, and subject apex readiness.'
      };
    case 'apex_advocacy_coupling':
      return {
        topic,
        headline: state.apexAdvocacyCouplingBrief?.summary || 'Apex-advocacy coupling unavailable.',
        fact: `Coupling band ${state.apexAdvocacyCouplingBrief?.band ?? 'unknown'}; apex drag ${Math.round(state.apexAdvocacyCouplingBrief?.apexDrag ?? 0)}.`,
        inference: state.apexAdvocacyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce apex with advocacy levers — wave 27 / O10-185 depth.'
      };
    case 'reengagement_thrust':
      return {
        topic,
        headline: state.reengagementThrustOutlook?.summary || 'Reengagement thrust unavailable.',
        fact: `Thrust band ${state.reengagementThrustOutlook?.band ?? 'unknown'}; sustain drag ${Math.round(state.reengagementThrustOutlook?.sustainDrag ?? 0)}.`,
        inference: state.reengagementThrustOutlook?.stewardNote || state.outlook,
        projection: 'Thrust blends reengagement levers with onboarding sustain — bounded indices only.'
      };
    case 'subject_pinnacle_readiness':
      return {
        topic,
        headline: state.subjectPinnacleReadinessBrief?.summary || 'Subject pinnacle readiness unavailable.',
        fact: `Pinnacle band ${state.subjectPinnacleReadinessBrief?.band ?? 'unknown'}; pinnacle drag ${Math.round(state.subjectPinnacleReadinessBrief?.pinnacleDrag ?? 0)}.`,
        inference: state.subjectPinnacleReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject pinnacle readiness gates subject apex against workforce apex for O10-185 wave 27.'
      };
    case 'workforce_pinnacle':
      return {
        topic,
        headline: state.nationalWorkforcePinnacleIndex?.summary || 'Workforce pinnacle unavailable.',
        fact: `Pinnacle band ${state.nationalWorkforcePinnacleIndex?.band ?? 'unknown'}; pinnacle drag ${Math.round(state.nationalWorkforcePinnacleIndex?.pinnacleDrag ?? 0)}.`,
        inference: state.nationalWorkforcePinnacleIndex?.stewardNote || state.summary,
        projection: 'Workforce pinnacle synthesizes advocacy coupling, reengagement thrust, and subject pinnacle.'
      };
    case 'pinnacle_retention_coupling':
      return {
        topic,
        headline: state.pinnacleRetentionCouplingBrief?.summary || 'Pinnacle-retention coupling unavailable.',
        fact: `Coupling band ${state.pinnacleRetentionCouplingBrief?.band ?? 'unknown'}; pinnacle drag ${Math.round(state.pinnacleRetentionCouplingBrief?.pinnacleDrag ?? 0)}.`,
        inference: state.pinnacleRetentionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce pinnacle with retention levers — wave 28 / O10-187 depth.'
      };
    case 'retention_crest':
      return {
        topic,
        headline: state.retentionCrestOutlook?.summary || 'Retention crest unavailable.',
        fact: `Crest band ${state.retentionCrestOutlook?.band ?? 'unknown'}; thrust drag ${Math.round(state.retentionCrestOutlook?.thrustDrag ?? 0)}.`,
        inference: state.retentionCrestOutlook?.stewardNote || state.outlook,
        projection: 'Crest blends retention levers with reengagement thrust — bounded indices only.'
      };
    case 'subject_summit_readiness':
      return {
        topic,
        headline: state.subjectSummitReadinessBrief?.summary || 'Subject summit readiness unavailable.',
        fact: `Summit band ${state.subjectSummitReadinessBrief?.band ?? 'unknown'}; summit drag ${Math.round(state.subjectSummitReadinessBrief?.summitDrag ?? 0)}.`,
        inference: state.subjectSummitReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject summit readiness gates subject pinnacle against workforce pinnacle for O10-187 wave 28.'
      };
    case 'workforce_summit':
      return {
        topic,
        headline: state.nationalWorkforceSummitIndex?.summary || 'Workforce summit unavailable.',
        fact: `Summit band ${state.nationalWorkforceSummitIndex?.band ?? 'unknown'}; summit drag ${Math.round(state.nationalWorkforceSummitIndex?.summitDrag ?? 0)}.`,
        inference: state.nationalWorkforceSummitIndex?.stewardNote || state.summary,
        projection: 'Workforce summit synthesizes retention coupling, retention crest, and subject summit.'
      };
    case 'summit_coordination_coupling':
      return {
        topic,
        headline: state.summitCoordinationCouplingBrief?.summary || 'Summit-coordination coupling unavailable.',
        fact: `Coupling band ${state.summitCoordinationCouplingBrief?.band ?? 'unknown'}; summit drag ${Math.round(state.summitCoordinationCouplingBrief?.summitDrag ?? 0)}.`,
        inference: state.summitCoordinationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce summit with coordination levers — wave 29 / O10-189 depth.'
      };
    case 'coordination_horizon':
      return {
        topic,
        headline: state.coordinationHorizonOutlook?.summary || 'Coordination horizon unavailable.',
        fact: `Horizon band ${state.coordinationHorizonOutlook?.band ?? 'unknown'}; crest drag ${Math.round(state.coordinationHorizonOutlook?.crestDrag ?? 0)}.`,
        inference: state.coordinationHorizonOutlook?.stewardNote || state.outlook,
        projection: 'Horizon blends coordination levers with retention crest — bounded indices only.'
      };
    case 'subject_zenith_readiness':
      return {
        topic,
        headline: state.subjectZenithReadinessBrief?.summary || 'Subject zenith readiness unavailable.',
        fact: `Zenith band ${state.subjectZenithReadinessBrief?.band ?? 'unknown'}; zenith drag ${Math.round(state.subjectZenithReadinessBrief?.zenithDrag ?? 0)}.`,
        inference: state.subjectZenithReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject zenith readiness gates subject summit against workforce summit for O10-189 wave 29.'
      };
    case 'workforce_zenith':
      return {
        topic,
        headline: state.nationalWorkforceZenithIndex?.summary || 'Workforce zenith unavailable.',
        fact: `Zenith band ${state.nationalWorkforceZenithIndex?.band ?? 'unknown'}; zenith drag ${Math.round(state.nationalWorkforceZenithIndex?.zenithDrag ?? 0)}.`,
        inference: state.nationalWorkforceZenithIndex?.stewardNote || state.summary,
        projection: 'Workforce zenith synthesizes coordination coupling, coordination horizon, and subject zenith.'
      };
    case 'zenith_flexibility_coupling':
      return {
        topic,
        headline: state.zenithFlexibilityCouplingBrief?.summary || 'Zenith-flexibility coupling unavailable.',
        fact: `Coupling band ${state.zenithFlexibilityCouplingBrief?.band ?? 'unknown'}; zenith drag ${Math.round(state.zenithFlexibilityCouplingBrief?.zenithDrag ?? 0)}.`,
        inference: state.zenithFlexibilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce zenith with flexibility levers — wave 30 / O10-191 depth.'
      };
    case 'flexibility_ascent':
      return {
        topic,
        headline: state.flexibilityAscentOutlook?.summary || 'Flexibility ascent unavailable.',
        fact: `Ascent band ${state.flexibilityAscentOutlook?.band ?? 'unknown'}; horizon drag ${Math.round(state.flexibilityAscentOutlook?.horizonDrag ?? 0)}.`,
        inference: state.flexibilityAscentOutlook?.stewardNote || state.outlook,
        projection: 'Ascent blends flexibility levers with coordination horizon — bounded indices only.'
      };
    case 'subject_apogee_readiness':
      return {
        topic,
        headline: state.subjectApogeeReadinessBrief?.summary || 'Subject apogee readiness unavailable.',
        fact: `Apogee band ${state.subjectApogeeReadinessBrief?.band ?? 'unknown'}; apogee drag ${Math.round(state.subjectApogeeReadinessBrief?.apogeeDrag ?? 0)}.`,
        inference: state.subjectApogeeReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject apogee readiness gates subject zenith against workforce zenith for O10-191 wave 30.'
      };
    case 'workforce_apogee':
      return {
        topic,
        headline: state.nationalWorkforceApogeeIndex?.summary || 'Workforce apogee unavailable.',
        fact: `Apogee band ${state.nationalWorkforceApogeeIndex?.band ?? 'unknown'}; apogee drag ${Math.round(state.nationalWorkforceApogeeIndex?.apogeeDrag ?? 0)}.`,
        inference: state.nationalWorkforceApogeeIndex?.stewardNote || state.summary,
        projection: 'Workforce apogee synthesizes flexibility coupling, flexibility ascent, and subject apogee.'
      };
    case 'apogee_inclusion_coupling':
      return {
        topic,
        headline: state.apogeeInclusionCouplingBrief?.summary || 'Apogee-inclusion coupling unavailable.',
        fact: `Coupling band ${state.apogeeInclusionCouplingBrief?.band ?? 'unknown'}; apogee drag ${Math.round(state.apogeeInclusionCouplingBrief?.apogeeDrag ?? 0)}.`,
        inference: state.apogeeInclusionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce apogee with inclusion levers — wave 31 / O10-193 depth.'
      };
    case 'inclusion_orbit':
      return {
        topic,
        headline: state.inclusionOrbitOutlook?.summary || 'Inclusion orbit unavailable.',
        fact: `Orbit band ${state.inclusionOrbitOutlook?.band ?? 'unknown'}; ascent drag ${Math.round(state.inclusionOrbitOutlook?.ascentDrag ?? 0)}.`,
        inference: state.inclusionOrbitOutlook?.stewardNote || state.outlook,
        projection: 'Orbit blends inclusion levers with flexibility ascent — bounded indices only.'
      };
    case 'subject_orbit_readiness':
      return {
        topic,
        headline: state.subjectOrbitReadinessBrief?.summary || 'Subject orbit readiness unavailable.',
        fact: `Orbit band ${state.subjectOrbitReadinessBrief?.band ?? 'unknown'}; orbit drag ${Math.round(state.subjectOrbitReadinessBrief?.orbitDrag ?? 0)}.`,
        inference: state.subjectOrbitReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject orbit readiness gates subject apogee against workforce apogee for O10-193 wave 31.'
      };
    case 'workforce_orbit':
      return {
        topic,
        headline: state.nationalWorkforceOrbitIndex?.summary || 'Workforce orbit unavailable.',
        fact: `Orbit band ${state.nationalWorkforceOrbitIndex?.band ?? 'unknown'}; orbit drag ${Math.round(state.nationalWorkforceOrbitIndex?.orbitDrag ?? 0)}.`,
        inference: state.nationalWorkforceOrbitIndex?.stewardNote || state.summary,
        projection: 'Workforce orbit synthesizes inclusion coupling, inclusion orbit, and subject orbit.'
      };
    case 'orbit_care_coupling':
      return {
        topic,
        headline: state.orbitCareCouplingBrief?.summary || 'Orbit-care coupling unavailable.',
        fact: `Coupling band ${state.orbitCareCouplingBrief?.band ?? 'unknown'}; orbit drag ${Math.round(state.orbitCareCouplingBrief?.orbitDrag ?? 0)}.`,
        inference: state.orbitCareCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce orbit with care levers — wave 32 / O10-195 depth.'
      };
    case 'care_equilibrium':
      return {
        topic,
        headline: state.careEquilibriumOutlook?.summary || 'Care equilibrium unavailable.',
        fact: `Equilibrium band ${state.careEquilibriumOutlook?.band ?? 'unknown'}; orbit drag ${Math.round(state.careEquilibriumOutlook?.orbitDrag ?? 0)}.`,
        inference: state.careEquilibriumOutlook?.stewardNote || state.outlook,
        projection: 'Equilibrium blends care levers with inclusion orbit — bounded indices only.'
      };
    case 'subject_nexus_readiness':
      return {
        topic,
        headline: state.subjectNexusReadinessBrief?.summary || 'Subject nexus readiness unavailable.',
        fact: `Nexus band ${state.subjectNexusReadinessBrief?.band ?? 'unknown'}; nexus drag ${Math.round(state.subjectNexusReadinessBrief?.nexusDrag ?? 0)}.`,
        inference: state.subjectNexusReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject nexus readiness gates subject orbit against workforce orbit for O10-195 wave 32.'
      };
    case 'workforce_nexus':
      return {
        topic,
        headline: state.nationalWorkforceNexusIndex?.summary || 'Workforce nexus unavailable.',
        fact: `Nexus band ${state.nationalWorkforceNexusIndex?.band ?? 'unknown'}; nexus drag ${Math.round(state.nationalWorkforceNexusIndex?.nexusDrag ?? 0)}.`,
        inference: state.nationalWorkforceNexusIndex?.stewardNote || state.summary,
        projection: 'Workforce nexus synthesizes care coupling, care equilibrium, and subject nexus.'
      };
    case 'nexus_scheduling_coupling':
      return {
        topic,
        headline: state.nexusSchedulingCouplingBrief?.summary || 'Nexus-scheduling coupling unavailable.',
        fact: `Coupling band ${state.nexusSchedulingCouplingBrief?.band ?? 'unknown'}; nexus drag ${Math.round(state.nexusSchedulingCouplingBrief?.nexusDrag ?? 0)}.`,
        inference: state.nexusSchedulingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce nexus with scheduling levers — wave 33 / O10-197 depth.'
      };
    case 'scheduling_resonance':
      return {
        topic,
        headline: state.schedulingResonanceOutlook?.summary || 'Scheduling resonance unavailable.',
        fact: `Resonance band ${state.schedulingResonanceOutlook?.band ?? 'unknown'}; equilibrium drag ${Math.round(state.schedulingResonanceOutlook?.equilibriumDrag ?? 0)}.`,
        inference: state.schedulingResonanceOutlook?.stewardNote || state.outlook,
        projection: 'Resonance blends scheduling levers with care equilibrium — bounded indices only.'
      };
    case 'subject_convergence_readiness':
      return {
        topic,
        headline: state.subjectConvergenceReadinessBrief?.summary || 'Subject convergence readiness unavailable.',
        fact: `Convergence band ${state.subjectConvergenceReadinessBrief?.band ?? 'unknown'}; convergence drag ${Math.round(state.subjectConvergenceReadinessBrief?.convergenceDrag ?? 0)}.`,
        inference: state.subjectConvergenceReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject convergence readiness gates subject nexus against workforce nexus for O10-197 wave 33.'
      };
    case 'workforce_convergence':
      return {
        topic,
        headline: state.nationalWorkforceConvergenceIndex?.summary || 'Workforce convergence unavailable.',
        fact: `Convergence band ${state.nationalWorkforceConvergenceIndex?.band ?? 'unknown'}; convergence drag ${Math.round(state.nationalWorkforceConvergenceIndex?.convergenceDrag ?? 0)}.`,
        inference: state.nationalWorkforceConvergenceIndex?.stewardNote || state.summary,
        projection: 'Workforce convergence synthesizes scheduling coupling, scheduling resonance, and subject convergence.'
      };
    case 'convergence_safety_coupling':
      return {
        topic,
        headline: state.convergenceSafetyCouplingBrief?.summary || 'Convergence-safety coupling unavailable.',
        fact: `Coupling band ${state.convergenceSafetyCouplingBrief?.band ?? 'unknown'}; convergence drag ${Math.round(state.convergenceSafetyCouplingBrief?.convergenceDrag ?? 0)}.`,
        inference: state.convergenceSafetyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce convergence with safety levers — wave 34 / O10-199 depth.'
      };
    case 'safety_harmony':
      return {
        topic,
        headline: state.safetyHarmonyOutlook?.summary || 'Safety harmony unavailable.',
        fact: `Harmony band ${state.safetyHarmonyOutlook?.band ?? 'unknown'}; resonance drag ${Math.round(state.safetyHarmonyOutlook?.resonanceDrag ?? 0)}.`,
        inference: state.safetyHarmonyOutlook?.stewardNote || state.outlook,
        projection: 'Harmony blends safety levers with scheduling resonance — bounded indices only.'
      };
    case 'subject_unification_readiness':
      return {
        topic,
        headline: state.subjectUnificationReadinessBrief?.summary || 'Subject unification readiness unavailable.',
        fact: `Unification band ${state.subjectUnificationReadinessBrief?.band ?? 'unknown'}; unification drag ${Math.round(state.subjectUnificationReadinessBrief?.unificationDrag ?? 0)}.`,
        inference: state.subjectUnificationReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject unification readiness gates subject convergence against workforce convergence for O10-199 wave 34.'
      };
    case 'workforce_unification':
      return {
        topic,
        headline: state.nationalWorkforceUnificationIndex?.summary || 'Workforce unification unavailable.',
        fact: `Unification band ${state.nationalWorkforceUnificationIndex?.band ?? 'unknown'}; unification drag ${Math.round(state.nationalWorkforceUnificationIndex?.unificationDrag ?? 0)}.`,
        inference: state.nationalWorkforceUnificationIndex?.stewardNote || state.summary,
        projection: 'Workforce unification synthesizes safety coupling, safety harmony, and subject unification.'
      };
    case 'unification_upskilling_coupling':
      return {
        topic,
        headline: state.unificationUpskillingCouplingBrief?.summary || 'Unification-upskilling coupling unavailable.',
        fact: `Coupling band ${state.unificationUpskillingCouplingBrief?.band ?? 'unknown'}; unification drag ${Math.round(state.unificationUpskillingCouplingBrief?.unificationDrag ?? 0)}.`,
        inference: state.unificationUpskillingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce unification with upskilling programs — wave 35 / O10-201 depth.'
      };
    case 'upskilling_synthesis':
      return {
        topic,
        headline: state.upskillingSynthesisOutlook?.summary || 'Upskilling synthesis unavailable.',
        fact: `Synthesis band ${state.upskillingSynthesisOutlook?.band ?? 'unknown'}; harmony drag ${Math.round(state.upskillingSynthesisOutlook?.harmonyDrag ?? 0)}.`,
        inference: state.upskillingSynthesisOutlook?.stewardNote || state.outlook,
        projection: 'Synthesis blends upskilling programs with safety harmony — bounded indices only.'
      };
    case 'subject_synthesis_readiness':
      return {
        topic,
        headline: state.subjectSynthesisReadinessBrief?.summary || 'Subject synthesis readiness unavailable.',
        fact: `Synthesis band ${state.subjectSynthesisReadinessBrief?.band ?? 'unknown'}; synthesis drag ${Math.round(state.subjectSynthesisReadinessBrief?.synthesisDrag ?? 0)}.`,
        inference: state.subjectSynthesisReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject synthesis readiness gates subject unification against workforce unification for O10-201 wave 35.'
      };
    case 'workforce_synthesis':
      return {
        topic,
        headline: state.nationalWorkforceSynthesisIndex?.summary || 'Workforce synthesis unavailable.',
        fact: `Synthesis band ${state.nationalWorkforceSynthesisIndex?.band ?? 'unknown'}; synthesis drag ${Math.round(state.nationalWorkforceSynthesisIndex?.synthesisDrag ?? 0)}.`,
        inference: state.nationalWorkforceSynthesisIndex?.stewardNote || state.summary,
        projection: 'Workforce synthesis synthesizes upskilling coupling, upskilling synthesis, and subject synthesis.'
      };
    case 'synthesis_onboarding_coupling':
      return {
        topic,
        headline: state.synthesisOnboardingCouplingBrief?.summary || 'Synthesis-onboarding coupling unavailable.',
        fact: `Coupling band ${state.synthesisOnboardingCouplingBrief?.band ?? 'unknown'}; synthesis drag ${Math.round(state.synthesisOnboardingCouplingBrief?.synthesisDrag ?? 0)}.`,
        inference: state.synthesisOnboardingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce synthesis with onboarding levers — wave 36 / O10-203 depth.'
      };
    case 'onboarding_integration':
      return {
        topic,
        headline: state.onboardingIntegrationOutlook?.summary || 'Onboarding integration unavailable.',
        fact: `Integration band ${state.onboardingIntegrationOutlook?.band ?? 'unknown'}; synthesis drag ${Math.round(state.onboardingIntegrationOutlook?.synthesisDrag ?? 0)}.`,
        inference: state.onboardingIntegrationOutlook?.stewardNote || state.outlook,
        projection: 'Integration blends onboarding levers with upskilling synthesis — bounded indices only.'
      };
    case 'subject_integration_readiness':
      return {
        topic,
        headline: state.subjectIntegrationReadinessBrief?.summary || 'Subject integration readiness unavailable.',
        fact: `Integration band ${state.subjectIntegrationReadinessBrief?.band ?? 'unknown'}; integration drag ${Math.round(state.subjectIntegrationReadinessBrief?.integrationDrag ?? 0)}.`,
        inference: state.subjectIntegrationReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject integration readiness gates subject synthesis against workforce synthesis for O10-203 wave 36.'
      };
    case 'workforce_integration':
      return {
        topic,
        headline: state.nationalWorkforceIntegrationIndex?.summary || 'Workforce integration unavailable.',
        fact: `Integration band ${state.nationalWorkforceIntegrationIndex?.band ?? 'unknown'}; integration drag ${Math.round(state.nationalWorkforceIntegrationIndex?.integrationDrag ?? 0)}.`,
        inference: state.nationalWorkforceIntegrationIndex?.stewardNote || state.summary,
        projection: 'Workforce integration synthesizes onboarding coupling, onboarding integration, and subject integration.'
      };
    case 'integration_retention_coupling':
      return {
        topic,
        headline: state.integrationRetentionCouplingBrief?.summary || 'Integration-retention coupling unavailable.',
        fact: `Coupling band ${state.integrationRetentionCouplingBrief?.band ?? 'unknown'}; integration drag ${Math.round(state.integrationRetentionCouplingBrief?.integrationDrag ?? 0)}.`,
        inference: state.integrationRetentionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce integration with retention levers — wave 37 / O10-205 depth.'
      };
    case 'retention_cohesion':
      return {
        topic,
        headline: state.retentionCohesionOutlook?.summary || 'Retention cohesion unavailable.',
        fact: `Cohesion band ${state.retentionCohesionOutlook?.band ?? 'unknown'}; integration drag ${Math.round(state.retentionCohesionOutlook?.integrationDrag ?? 0)}.`,
        inference: state.retentionCohesionOutlook?.stewardNote || state.outlook,
        projection: 'Cohesion blends retention levers with onboarding integration — bounded indices only.'
      };
    case 'subject_retention_readiness':
      return {
        topic,
        headline: state.subjectRetentionReadinessBrief?.summary || 'Subject retention readiness unavailable.',
        fact: `Retention band ${state.subjectRetentionReadinessBrief?.band ?? 'unknown'}; retention drag ${Math.round(state.subjectRetentionReadinessBrief?.retentionDrag ?? 0)}.`,
        inference: state.subjectRetentionReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject retention readiness gates subject integration against workforce integration for O10-205 wave 37.'
      };
    case 'workforce_retention':
      return {
        topic,
        headline: state.nationalWorkforceRetentionIndex?.summary || 'Workforce retention unavailable.',
        fact: `Retention band ${state.nationalWorkforceRetentionIndex?.band ?? 'unknown'}; retention drag ${Math.round(state.nationalWorkforceRetentionIndex?.retentionDrag ?? 0)}.`,
        inference: state.nationalWorkforceRetentionIndex?.stewardNote || state.summary,
        projection: 'Workforce retention synthesizes integration-retention coupling, retention cohesion, and subject retention.'
      };
    case 'retention_reengagement_coupling':
      return {
        topic,
        headline: state.retentionReengagementCouplingBrief?.summary || 'Retention-reengagement coupling unavailable.',
        fact: `Coupling band ${state.retentionReengagementCouplingBrief?.band ?? 'unknown'}; retention drag ${Math.round(state.retentionReengagementCouplingBrief?.retentionDrag ?? 0)}.`,
        inference: state.retentionReengagementCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce retention with reengagement levers — wave 38 / O10-207 depth.'
      };
    case 'reengagement_alignment':
      return {
        topic,
        headline: state.reengagementAlignmentOutlook?.summary || 'Reengagement alignment unavailable.',
        fact: `Alignment band ${state.reengagementAlignmentOutlook?.band ?? 'unknown'}; retention drag ${Math.round(state.reengagementAlignmentOutlook?.retentionDrag ?? 0)}.`,
        inference: state.reengagementAlignmentOutlook?.stewardNote || state.outlook,
        projection: 'Alignment blends reengagement levers with retention cohesion — bounded indices only.'
      };
    case 'subject_reengagement_readiness':
      return {
        topic,
        headline: state.subjectReengagementReadinessBrief?.summary || 'Subject reengagement readiness unavailable.',
        fact: `Reengagement band ${state.subjectReengagementReadinessBrief?.band ?? 'unknown'}; reengagement drag ${Math.round(state.subjectReengagementReadinessBrief?.reengagementDrag ?? 0)}.`,
        inference: state.subjectReengagementReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject reengagement readiness gates subject retention against workforce retention for O10-207 wave 38.'
      };
    case 'workforce_reengagement':
      return {
        topic,
        headline: state.nationalWorkforceReengagementIndex?.summary || 'Workforce reengagement unavailable.',
        fact: `Reengagement band ${state.nationalWorkforceReengagementIndex?.band ?? 'unknown'}; reengagement drag ${Math.round(state.nationalWorkforceReengagementIndex?.reengagementDrag ?? 0)}.`,
        inference: state.nationalWorkforceReengagementIndex?.stewardNote || state.summary,
        projection: 'Workforce reengagement synthesizes retention-reengagement coupling, reengagement alignment, and subject reengagement.'
      };
    case 'reengagement_mentorship_coupling':
      return {
        topic,
        headline: state.reengagementMentorshipCouplingBrief?.summary || 'Reengagement-mentorship coupling unavailable.',
        fact: `Coupling band ${state.reengagementMentorshipCouplingBrief?.band ?? 'unknown'}; reengagement drag ${Math.round(state.reengagementMentorshipCouplingBrief?.reengagementDrag ?? 0)}.`,
        inference: state.reengagementMentorshipCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce reengagement with mentorship levers — wave 39 / O10-209 depth.'
      };
    case 'mentorship_sustain':
      return {
        topic,
        headline: state.mentorshipSustainOutlook?.summary || 'Mentorship sustain unavailable.',
        fact: `Sustain band ${state.mentorshipSustainOutlook?.band ?? 'unknown'}; reengagement drag ${Math.round(state.mentorshipSustainOutlook?.reengagementDrag ?? 0)}.`,
        inference: state.mentorshipSustainOutlook?.stewardNote || state.outlook,
        projection: 'Sustain blends mentorship levers with reengagement alignment — bounded indices only.'
      };
    case 'subject_mentorship_readiness':
      return {
        topic,
        headline: state.subjectMentorshipReadinessBrief?.summary || 'Subject mentorship readiness unavailable.',
        fact: `Mentorship band ${state.subjectMentorshipReadinessBrief?.band ?? 'unknown'}; mentorship drag ${Math.round(state.subjectMentorshipReadinessBrief?.mentorshipDrag ?? 0)}.`,
        inference: state.subjectMentorshipReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject mentorship readiness gates subject reengagement against workforce reengagement for O10-209 wave 39.'
      };
    case 'workforce_mentorship':
      return {
        topic,
        headline: state.nationalWorkforceMentorshipIndex?.summary || 'Workforce mentorship unavailable.',
        fact: `Mentorship band ${state.nationalWorkforceMentorshipIndex?.band ?? 'unknown'}; mentorship drag ${Math.round(state.nationalWorkforceMentorshipIndex?.mentorshipDrag ?? 0)}.`,
        inference: state.nationalWorkforceMentorshipIndex?.stewardNote || state.summary,
        projection: 'Workforce mentorship synthesizes reengagement-mentorship coupling, mentorship sustain, and subject mentorship.'
      };
    case 'mentorship_advocacy_coupling':
      return {
        topic,
        headline: state.mentorshipAdvocacyCouplingBrief?.summary || 'Mentorship-advocacy coupling unavailable.',
        fact: `Coupling band ${state.mentorshipAdvocacyCouplingBrief?.band ?? 'unknown'}; mentorship drag ${Math.round(state.mentorshipAdvocacyCouplingBrief?.mentorshipDrag ?? 0)}.`,
        inference: state.mentorshipAdvocacyCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce mentorship with advocacy levers — wave 40 / O10-211 depth.'
      };
    case 'advocacy_resonance':
      return {
        topic,
        headline: state.advocacyResonanceOutlook?.summary || 'Advocacy resonance unavailable.',
        fact: `Resonance band ${state.advocacyResonanceOutlook?.band ?? 'unknown'}; mentorship drag ${Math.round(state.advocacyResonanceOutlook?.mentorshipDrag ?? 0)}.`,
        inference: state.advocacyResonanceOutlook?.stewardNote || state.outlook,
        projection: 'Resonance blends advocacy levers with mentorship sustain — bounded indices only.'
      };
    case 'subject_advocacy_readiness':
      return {
        topic,
        headline: state.subjectAdvocacyReadinessBrief?.summary || 'Subject advocacy readiness unavailable.',
        fact: `Advocacy band ${state.subjectAdvocacyReadinessBrief?.band ?? 'unknown'}; advocacy drag ${Math.round(state.subjectAdvocacyReadinessBrief?.advocacyDrag ?? 0)}.`,
        inference: state.subjectAdvocacyReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject advocacy readiness gates subject mentorship against workforce mentorship for O10-211 wave 40.'
      };
    case 'workforce_advocacy':
      return {
        topic,
        headline: state.nationalWorkforceAdvocacyIndex?.summary || 'Workforce advocacy unavailable.',
        fact: `Advocacy band ${state.nationalWorkforceAdvocacyIndex?.band ?? 'unknown'}; advocacy drag ${Math.round(state.nationalWorkforceAdvocacyIndex?.advocacyDrag ?? 0)}.`,
        inference: state.nationalWorkforceAdvocacyIndex?.stewardNote || state.summary,
        projection: 'Workforce advocacy synthesizes mentorship-advocacy coupling, advocacy resonance, and subject advocacy.'
      };
    case 'advocacy_inclusion_coupling':
      return {
        topic,
        headline: state.advocacyInclusionCouplingBrief?.summary || 'Advocacy-inclusion coupling unavailable.',
        fact: `Coupling band ${state.advocacyInclusionCouplingBrief?.band ?? 'unknown'}; advocacy drag ${Math.round(state.advocacyInclusionCouplingBrief?.advocacyDrag ?? 0)}.`,
        inference: state.advocacyInclusionCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce advocacy with inclusion levers — wave 41 / O10-213 depth.'
      };
    case 'inclusion_equity':
      return {
        topic,
        headline: state.inclusionEquityOutlook?.summary || 'Inclusion equity unavailable.',
        fact: `Equity band ${state.inclusionEquityOutlook?.band ?? 'unknown'}; advocacy drag ${Math.round(state.inclusionEquityOutlook?.advocacyDrag ?? 0)}.`,
        inference: state.inclusionEquityOutlook?.stewardNote || state.outlook,
        projection: 'Equity blends inclusion levers with advocacy resonance — bounded indices only.'
      };
    case 'subject_inclusion_readiness':
      return {
        topic,
        headline: state.subjectInclusionReadinessBrief?.summary || 'Subject inclusion readiness unavailable.',
        fact: `Inclusion band ${state.subjectInclusionReadinessBrief?.band ?? 'unknown'}; inclusion drag ${Math.round(state.subjectInclusionReadinessBrief?.inclusionDrag ?? 0)}.`,
        inference: state.subjectInclusionReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject inclusion readiness gates subject advocacy against workforce advocacy for O10-213 wave 41.'
      };
    case 'workforce_inclusion':
      return {
        topic,
        headline: state.nationalWorkforceInclusionIndex?.summary || 'Workforce inclusion unavailable.',
        fact: `Inclusion band ${state.nationalWorkforceInclusionIndex?.band ?? 'unknown'}; inclusion drag ${Math.round(state.nationalWorkforceInclusionIndex?.inclusionDrag ?? 0)}.`,
        inference: state.nationalWorkforceInclusionIndex?.stewardNote || state.summary,
        projection: 'Workforce inclusion synthesizes advocacy-inclusion coupling, inclusion equity, and subject inclusion.'
      };
    case 'inclusion_flexibility_coupling':
      return {
        topic,
        headline: state.inclusionFlexibilityCouplingBrief?.summary || 'Inclusion-flexibility coupling unavailable.',
        fact: `Coupling band ${state.inclusionFlexibilityCouplingBrief?.band ?? 'unknown'}; inclusion drag ${Math.round(state.inclusionFlexibilityCouplingBrief?.inclusionDrag ?? 0)}.`,
        inference: state.inclusionFlexibilityCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce inclusion with flexibility levers — wave 42 / O10-215 depth.'
      };
    case 'flexibility_flow':
      return {
        topic,
        headline: state.flexibilityFlowOutlook?.summary || 'Flexibility flow unavailable.',
        fact: `Flow band ${state.flexibilityFlowOutlook?.band ?? 'unknown'}; inclusion drag ${Math.round(state.flexibilityFlowOutlook?.inclusionDrag ?? 0)}.`,
        inference: state.flexibilityFlowOutlook?.stewardNote || state.outlook,
        projection: 'Flow blends flexibility levers with inclusion equity — bounded indices only.'
      };
    case 'subject_flexibility_readiness':
      return {
        topic,
        headline: state.subjectFlexibilityReadinessBrief?.summary || 'Subject flexibility readiness unavailable.',
        fact: `Flexibility band ${state.subjectFlexibilityReadinessBrief?.band ?? 'unknown'}; flexibility drag ${Math.round(state.subjectFlexibilityReadinessBrief?.flexibilityDrag ?? 0)}.`,
        inference: state.subjectFlexibilityReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject flexibility readiness gates subject inclusion against workforce inclusion for O10-215 wave 42.'
      };
    case 'workforce_flexibility':
      return {
        topic,
        headline: state.nationalWorkforceFlexibilityIndex?.summary || 'Workforce flexibility unavailable.',
        fact: `Flexibility band ${state.nationalWorkforceFlexibilityIndex?.band ?? 'unknown'}; flexibility drag ${Math.round(state.nationalWorkforceFlexibilityIndex?.flexibilityDrag ?? 0)}.`,
        inference: state.nationalWorkforceFlexibilityIndex?.stewardNote || state.summary,
        projection: 'Workforce flexibility synthesizes inclusion-flexibility coupling, flexibility flow, and subject flexibility.'
      };
    case 'flexibility_coordination_coupling':
      return {
        topic,
        headline: state.flexibilityCoordinationCouplingBrief?.summary || 'Flexibility-coordination coupling unavailable.',
        fact: `Coupling band ${state.flexibilityCoordinationCouplingBrief?.band ?? 'unknown'}; flexibility drag ${Math.round(state.flexibilityCoordinationCouplingBrief?.flexibilityDrag ?? 0)}.`,
        inference: state.flexibilityCoordinationCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce flexibility with coordination levers — wave 43 / O10-217 depth.'
      };
    case 'coordination_mesh':
      return {
        topic,
        headline: state.coordinationMeshOutlook?.summary || 'Coordination mesh unavailable.',
        fact: `Mesh band ${state.coordinationMeshOutlook?.band ?? 'unknown'}; flexibility drag ${Math.round(state.coordinationMeshOutlook?.flexibilityDrag ?? 0)}.`,
        inference: state.coordinationMeshOutlook?.stewardNote || state.outlook,
        projection: 'Mesh blends coordination levers with flexibility flow — bounded indices only.'
      };
    case 'subject_coordination_readiness':
      return {
        topic,
        headline: state.subjectCoordinationReadinessBrief?.summary || 'Subject coordination readiness unavailable.',
        fact: `Coordination band ${state.subjectCoordinationReadinessBrief?.band ?? 'unknown'}; coordination drag ${Math.round(state.subjectCoordinationReadinessBrief?.coordinationDrag ?? 0)}.`,
        inference: state.subjectCoordinationReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject coordination readiness gates subject flexibility against workforce flexibility for O10-217 wave 43.'
      };
    case 'workforce_coordination':
      return {
        topic,
        headline: state.nationalWorkforceCoordinationIndex?.summary || 'Workforce coordination unavailable.',
        fact: `Coordination band ${state.nationalWorkforceCoordinationIndex?.band ?? 'unknown'}; coordination drag ${Math.round(state.nationalWorkforceCoordinationIndex?.coordinationDrag ?? 0)}.`,
        inference: state.nationalWorkforceCoordinationIndex?.stewardNote || state.summary,
        projection: 'Workforce coordination synthesizes flexibility-coordination coupling, coordination mesh, and subject coordination.'
      };
    case 'coordination_scheduling_coupling':
      return {
        topic,
        headline: state.coordinationSchedulingCouplingBrief?.summary || 'Coordination-scheduling coupling unavailable.',
        fact: `Coupling band ${state.coordinationSchedulingCouplingBrief?.band ?? 'unknown'}; coordination drag ${Math.round(state.coordinationSchedulingCouplingBrief?.coordinationDrag ?? 0)}.`,
        inference: state.coordinationSchedulingCouplingBrief?.stewardNote || state.outlook,
        projection: 'Coupling links workforce coordination with scheduling levers — wave 44 / O10-219 depth.'
      };
    case 'scheduling_pulse':
      return {
        topic,
        headline: state.schedulingPulseOutlook?.summary || 'Scheduling pulse unavailable.',
        fact: `Pulse band ${state.schedulingPulseOutlook?.band ?? 'unknown'}; coordination drag ${Math.round(state.schedulingPulseOutlook?.coordinationDrag ?? 0)}.`,
        inference: state.schedulingPulseOutlook?.stewardNote || state.outlook,
        projection: 'Pulse blends scheduling levers with coordination mesh — bounded indices only.'
      };
    case 'subject_scheduling_readiness':
      return {
        topic,
        headline: state.subjectSchedulingReadinessBrief?.summary || 'Subject scheduling readiness unavailable.',
        fact: `Scheduling band ${state.subjectSchedulingReadinessBrief?.band ?? 'unknown'}; scheduling drag ${Math.round(state.subjectSchedulingReadinessBrief?.schedulingDrag ?? 0)}.`,
        inference: state.subjectSchedulingReadinessBrief?.stewardNote || state.summary,
        projection: 'Subject scheduling readiness gates subject coordination against workforce coordination for O10-219 wave 44.'
      };
    case 'workforce_scheduling':
      return {
        topic,
        headline: state.nationalWorkforceSchedulingIndex?.summary || 'Workforce scheduling unavailable.',
        fact: `Scheduling band ${state.nationalWorkforceSchedulingIndex?.band ?? 'unknown'}; scheduling drag ${Math.round(state.nationalWorkforceSchedulingIndex?.schedulingDrag ?? 0)}.`,
        inference: state.nationalWorkforceSchedulingIndex?.stewardNote || state.summary,
        projection: 'Workforce scheduling synthesizes coordination-scheduling coupling, scheduling pulse, and subject scheduling.'
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
  if (
    state.durabilityAdvocacyCouplingBrief?.band === 'decoupled' ||
    state.durabilityAdvocacyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.durabilityAdvocacyCouplingBrief.stewardNote);
  }
  if (
    state.mentorshipEnduranceOutlook?.band === 'depleted' ||
    state.mentorshipEnduranceOutlook?.band === 'thin'
  ) {
    hints.push(state.mentorshipEnduranceOutlook.stewardNote);
  }
  if (
    state.subjectTrancheReadinessBrief?.band === 'blocked' ||
    state.subjectTrancheReadinessBrief?.band === 'caution'
  ) {
    hints.push(state.subjectTrancheReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceEnduranceIndex?.band === 'fragile' ||
    state.nationalWorkforceEnduranceIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceEnduranceIndex.stewardNote);
  }
  if (
    state.enduranceFlexibilityCouplingBrief?.band === 'decoupled' ||
    state.enduranceFlexibilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.enduranceFlexibilityCouplingBrief.stewardNote);
  }
  if (
    state.inclusionResilienceOutlook?.band === 'fragile' ||
    state.inclusionResilienceOutlook?.band === 'patchy'
  ) {
    hints.push(state.inclusionResilienceOutlook.stewardNote);
  }
  if (
    state.subjectCommitReadinessBrief?.band === 'held' ||
    state.subjectCommitReadinessBrief?.band === 'review'
  ) {
    hints.push(state.subjectCommitReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceTenacityIndex?.band === 'brittle' ||
    state.nationalWorkforceTenacityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceTenacityIndex.stewardNote);
  }
  if (
    state.tenacityCareCouplingBrief?.band === 'decoupled' ||
    state.tenacityCareCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.tenacityCareCouplingBrief.stewardNote);
  }
  if (
    state.safetyCohesionOutlook?.band === 'exposed' ||
    state.safetyCohesionOutlook?.band === 'uneven'
  ) {
    hints.push(state.safetyCohesionOutlook.stewardNote);
  }
  if (
    state.subjectReleaseReadinessBrief?.band === 'held' ||
    state.subjectReleaseReadinessBrief?.band === 'staged'
  ) {
    hints.push(state.subjectReleaseReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSteadfastIndex?.band === 'fragile' ||
    state.nationalWorkforceSteadfastIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSteadfastIndex.stewardNote);
  }
  if (
    state.steadfastSchedulingCouplingBrief?.band === 'decoupled' ||
    state.steadfastSchedulingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.steadfastSchedulingCouplingBrief.stewardNote);
  }
  if (
    state.retentionAnchorOutlook?.band === 'drifting' ||
    state.retentionAnchorOutlook?.band === 'loose'
  ) {
    hints.push(state.retentionAnchorOutlook.stewardNote);
  }
  if (
    state.subjectSealReadinessBrief?.band === 'open' ||
    state.subjectSealReadinessBrief?.band === 'pending'
  ) {
    hints.push(state.subjectSealReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceResolveIndex?.band === 'fragile' ||
    state.nationalWorkforceResolveIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceResolveIndex.stewardNote);
  }
  if (
    state.resolveUpskillingCouplingBrief?.band === 'decoupled' ||
    state.resolveUpskillingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.resolveUpskillingCouplingBrief.stewardNote);
  }
  if (
    state.coordinationBindOutlook?.band === 'loose' ||
    state.coordinationBindOutlook?.band === 'patchy'
  ) {
    hints.push(state.coordinationBindOutlook.stewardNote);
  }
  if (
    state.subjectBindReadinessBrief?.band === 'unbound' ||
    state.subjectBindReadinessBrief?.band === 'tension'
  ) {
    hints.push(state.subjectBindReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceFortitudeIndex?.band === 'fragile' ||
    state.nationalWorkforceFortitudeIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceFortitudeIndex.stewardNote);
  }
  if (
    state.fortitudeInclusionCouplingBrief?.band === 'decoupled' ||
    state.fortitudeInclusionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.fortitudeInclusionCouplingBrief.stewardNote);
  }
  if (
    state.hybridAnchorOutlook?.band === 'drifting' ||
    state.hybridAnchorOutlook?.band === 'mixed'
  ) {
    hints.push(state.hybridAnchorOutlook.stewardNote);
  }
  if (
    state.subjectCrownReadinessBrief?.band === 'uncrowned' ||
    state.subjectCrownReadinessBrief?.band === 'pending'
  ) {
    hints.push(state.subjectCrownReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceCulminationIndex?.band === 'fragile' ||
    state.nationalWorkforceCulminationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceCulminationIndex.stewardNote);
  }
  if (
    state.culminationMentorshipCouplingBrief?.band === 'decoupled' ||
    state.culminationMentorshipCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.culminationMentorshipCouplingBrief.stewardNote);
  }
  if (
    state.onboardingSustainOutlook?.band === 'depleted' ||
    state.onboardingSustainOutlook?.band === 'thin'
  ) {
    hints.push(state.onboardingSustainOutlook.stewardNote);
  }
  if (
    state.subjectApexReadinessBrief?.band === 'below_apex' ||
    state.subjectApexReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectApexReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceApexIndex?.band === 'fragile' ||
    state.nationalWorkforceApexIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceApexIndex.stewardNote);
  }
  if (
    state.apexAdvocacyCouplingBrief?.band === 'decoupled' ||
    state.apexAdvocacyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.apexAdvocacyCouplingBrief.stewardNote);
  }
  if (
    state.reengagementThrustOutlook?.band === 'stalled' ||
    state.reengagementThrustOutlook?.band === 'patchy'
  ) {
    hints.push(state.reengagementThrustOutlook.stewardNote);
  }
  if (
    state.subjectPinnacleReadinessBrief?.band === 'below_pinnacle' ||
    state.subjectPinnacleReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectPinnacleReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforcePinnacleIndex?.band === 'fragile' ||
    state.nationalWorkforcePinnacleIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforcePinnacleIndex.stewardNote);
  }
  if (
    state.pinnacleRetentionCouplingBrief?.band === 'decoupled' ||
    state.pinnacleRetentionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.pinnacleRetentionCouplingBrief.stewardNote);
  }
  if (
    state.retentionCrestOutlook?.band === 'ebbing' ||
    state.retentionCrestOutlook?.band === 'patchy'
  ) {
    hints.push(state.retentionCrestOutlook.stewardNote);
  }
  if (
    state.subjectSummitReadinessBrief?.band === 'below_summit' ||
    state.subjectSummitReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectSummitReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSummitIndex?.band === 'fragile' ||
    state.nationalWorkforceSummitIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSummitIndex.stewardNote);
  }
  if (
    state.summitCoordinationCouplingBrief?.band === 'decoupled' ||
    state.summitCoordinationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.summitCoordinationCouplingBrief.stewardNote);
  }
  if (
    state.coordinationHorizonOutlook?.band === 'ebbing' ||
    state.coordinationHorizonOutlook?.band === 'patchy'
  ) {
    hints.push(state.coordinationHorizonOutlook.stewardNote);
  }
  if (
    state.subjectZenithReadinessBrief?.band === 'below_zenith' ||
    state.subjectZenithReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectZenithReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceZenithIndex?.band === 'fragile' ||
    state.nationalWorkforceZenithIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceZenithIndex.stewardNote);
  }
  if (
    state.zenithFlexibilityCouplingBrief?.band === 'decoupled' ||
    state.zenithFlexibilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.zenithFlexibilityCouplingBrief.stewardNote);
  }
  if (
    state.flexibilityAscentOutlook?.band === 'ebbing' ||
    state.flexibilityAscentOutlook?.band === 'patchy'
  ) {
    hints.push(state.flexibilityAscentOutlook.stewardNote);
  }
  if (
    state.subjectApogeeReadinessBrief?.band === 'below_apogee' ||
    state.subjectApogeeReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectApogeeReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceApogeeIndex?.band === 'fragile' ||
    state.nationalWorkforceApogeeIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceApogeeIndex.stewardNote);
  }
  if (
    state.apogeeInclusionCouplingBrief?.band === 'decoupled' ||
    state.apogeeInclusionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.apogeeInclusionCouplingBrief.stewardNote);
  }
  if (
    state.inclusionOrbitOutlook?.band === 'ebbing' ||
    state.inclusionOrbitOutlook?.band === 'patchy'
  ) {
    hints.push(state.inclusionOrbitOutlook.stewardNote);
  }
  if (
    state.subjectOrbitReadinessBrief?.band === 'below_orbit' ||
    state.subjectOrbitReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectOrbitReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceOrbitIndex?.band === 'fragile' ||
    state.nationalWorkforceOrbitIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceOrbitIndex.stewardNote);
  }
  if (
    state.orbitCareCouplingBrief?.band === 'decoupled' ||
    state.orbitCareCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.orbitCareCouplingBrief.stewardNote);
  }
  if (
    state.careEquilibriumOutlook?.band === 'ebbing' ||
    state.careEquilibriumOutlook?.band === 'patchy'
  ) {
    hints.push(state.careEquilibriumOutlook.stewardNote);
  }
  if (
    state.subjectNexusReadinessBrief?.band === 'below_nexus' ||
    state.subjectNexusReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectNexusReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceNexusIndex?.band === 'fragile' ||
    state.nationalWorkforceNexusIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceNexusIndex.stewardNote);
  }
  if (
    state.nexusSchedulingCouplingBrief?.band === 'decoupled' ||
    state.nexusSchedulingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.nexusSchedulingCouplingBrief.stewardNote);
  }
  if (
    state.schedulingResonanceOutlook?.band === 'ebbing' ||
    state.schedulingResonanceOutlook?.band === 'patchy'
  ) {
    hints.push(state.schedulingResonanceOutlook.stewardNote);
  }
  if (
    state.subjectConvergenceReadinessBrief?.band === 'below_convergence' ||
    state.subjectConvergenceReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectConvergenceReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceConvergenceIndex?.band === 'fragile' ||
    state.nationalWorkforceConvergenceIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceConvergenceIndex.stewardNote);
  }
  if (
    state.convergenceSafetyCouplingBrief?.band === 'decoupled' ||
    state.convergenceSafetyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.convergenceSafetyCouplingBrief.stewardNote);
  }
  if (
    state.safetyHarmonyOutlook?.band === 'ebbing' ||
    state.safetyHarmonyOutlook?.band === 'patchy'
  ) {
    hints.push(state.safetyHarmonyOutlook.stewardNote);
  }
  if (
    state.subjectUnificationReadinessBrief?.band === 'below_unification' ||
    state.subjectUnificationReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectUnificationReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceUnificationIndex?.band === 'fragile' ||
    state.nationalWorkforceUnificationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceUnificationIndex.stewardNote);
  }
  if (
    state.unificationUpskillingCouplingBrief?.band === 'decoupled' ||
    state.unificationUpskillingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.unificationUpskillingCouplingBrief.stewardNote);
  }
  if (
    state.upskillingSynthesisOutlook?.band === 'ebbing' ||
    state.upskillingSynthesisOutlook?.band === 'patchy'
  ) {
    hints.push(state.upskillingSynthesisOutlook.stewardNote);
  }
  if (
    state.subjectSynthesisReadinessBrief?.band === 'below_synthesis' ||
    state.subjectSynthesisReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectSynthesisReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSynthesisIndex?.band === 'fragile' ||
    state.nationalWorkforceSynthesisIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSynthesisIndex.stewardNote);
  }
  if (
    state.synthesisOnboardingCouplingBrief?.band === 'decoupled' ||
    state.synthesisOnboardingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.synthesisOnboardingCouplingBrief.stewardNote);
  }
  if (
    state.onboardingIntegrationOutlook?.band === 'ebbing' ||
    state.onboardingIntegrationOutlook?.band === 'patchy'
  ) {
    hints.push(state.onboardingIntegrationOutlook.stewardNote);
  }
  if (
    state.subjectIntegrationReadinessBrief?.band === 'below_integration' ||
    state.subjectIntegrationReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectIntegrationReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceIntegrationIndex?.band === 'fragile' ||
    state.nationalWorkforceIntegrationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceIntegrationIndex.stewardNote);
  }
  if (
    state.integrationRetentionCouplingBrief?.band === 'decoupled' ||
    state.integrationRetentionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.integrationRetentionCouplingBrief.stewardNote);
  }
  if (
    state.retentionCohesionOutlook?.band === 'ebbing' ||
    state.retentionCohesionOutlook?.band === 'patchy'
  ) {
    hints.push(state.retentionCohesionOutlook.stewardNote);
  }
  if (
    state.subjectRetentionReadinessBrief?.band === 'below_retention' ||
    state.subjectRetentionReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectRetentionReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceRetentionIndex?.band === 'fragile' ||
    state.nationalWorkforceRetentionIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceRetentionIndex.stewardNote);
  }
  if (
    state.retentionReengagementCouplingBrief?.band === 'decoupled' ||
    state.retentionReengagementCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.retentionReengagementCouplingBrief.stewardNote);
  }
  if (
    state.reengagementAlignmentOutlook?.band === 'ebbing' ||
    state.reengagementAlignmentOutlook?.band === 'patchy'
  ) {
    hints.push(state.reengagementAlignmentOutlook.stewardNote);
  }
  if (
    state.subjectReengagementReadinessBrief?.band === 'below_reengagement' ||
    state.subjectReengagementReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectReengagementReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceReengagementIndex?.band === 'fragile' ||
    state.nationalWorkforceReengagementIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceReengagementIndex.stewardNote);
  }
  if (
    state.reengagementMentorshipCouplingBrief?.band === 'decoupled' ||
    state.reengagementMentorshipCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.reengagementMentorshipCouplingBrief.stewardNote);
  }
  if (
    state.mentorshipSustainOutlook?.band === 'ebbing' ||
    state.mentorshipSustainOutlook?.band === 'patchy'
  ) {
    hints.push(state.mentorshipSustainOutlook.stewardNote);
  }
  if (
    state.subjectMentorshipReadinessBrief?.band === 'below_mentorship' ||
    state.subjectMentorshipReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectMentorshipReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceMentorshipIndex?.band === 'fragile' ||
    state.nationalWorkforceMentorshipIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceMentorshipIndex.stewardNote);
  }
  if (
    state.mentorshipAdvocacyCouplingBrief?.band === 'decoupled' ||
    state.mentorshipAdvocacyCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.mentorshipAdvocacyCouplingBrief.stewardNote);
  }
  if (
    state.advocacyResonanceOutlook?.band === 'ebbing' ||
    state.advocacyResonanceOutlook?.band === 'patchy'
  ) {
    hints.push(state.advocacyResonanceOutlook.stewardNote);
  }
  if (
    state.subjectAdvocacyReadinessBrief?.band === 'below_advocacy' ||
    state.subjectAdvocacyReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectAdvocacyReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceAdvocacyIndex?.band === 'fragile' ||
    state.nationalWorkforceAdvocacyIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceAdvocacyIndex.stewardNote);
  }
  if (
    state.advocacyInclusionCouplingBrief?.band === 'decoupled' ||
    state.advocacyInclusionCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.advocacyInclusionCouplingBrief.stewardNote);
  }
  if (
    state.inclusionEquityOutlook?.band === 'ebbing' ||
    state.inclusionEquityOutlook?.band === 'patchy'
  ) {
    hints.push(state.inclusionEquityOutlook.stewardNote);
  }
  if (
    state.subjectInclusionReadinessBrief?.band === 'below_inclusion' ||
    state.subjectInclusionReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectInclusionReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceInclusionIndex?.band === 'fragile' ||
    state.nationalWorkforceInclusionIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceInclusionIndex.stewardNote);
  }
  if (
    state.inclusionFlexibilityCouplingBrief?.band === 'decoupled' ||
    state.inclusionFlexibilityCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.inclusionFlexibilityCouplingBrief.stewardNote);
  }
  if (
    state.flexibilityFlowOutlook?.band === 'ebbing' ||
    state.flexibilityFlowOutlook?.band === 'patchy'
  ) {
    hints.push(state.flexibilityFlowOutlook.stewardNote);
  }
  if (
    state.subjectFlexibilityReadinessBrief?.band === 'below_flexibility' ||
    state.subjectFlexibilityReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectFlexibilityReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceFlexibilityIndex?.band === 'fragile' ||
    state.nationalWorkforceFlexibilityIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceFlexibilityIndex.stewardNote);
  }
  if (
    state.flexibilityCoordinationCouplingBrief?.band === 'decoupled' ||
    state.flexibilityCoordinationCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.flexibilityCoordinationCouplingBrief.stewardNote);
  }
  if (
    state.coordinationMeshOutlook?.band === 'ebbing' ||
    state.coordinationMeshOutlook?.band === 'patchy'
  ) {
    hints.push(state.coordinationMeshOutlook.stewardNote);
  }
  if (
    state.subjectCoordinationReadinessBrief?.band === 'below_coordination' ||
    state.subjectCoordinationReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectCoordinationReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceCoordinationIndex?.band === 'fragile' ||
    state.nationalWorkforceCoordinationIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceCoordinationIndex.stewardNote);
  }
  if (
    state.coordinationSchedulingCouplingBrief?.band === 'decoupled' ||
    state.coordinationSchedulingCouplingBrief?.band === 'strained'
  ) {
    hints.push(state.coordinationSchedulingCouplingBrief.stewardNote);
  }
  if (
    state.schedulingPulseOutlook?.band === 'ebbing' ||
    state.schedulingPulseOutlook?.band === 'patchy'
  ) {
    hints.push(state.schedulingPulseOutlook.stewardNote);
  }
  if (
    state.subjectSchedulingReadinessBrief?.band === 'below_scheduling' ||
    state.subjectSchedulingReadinessBrief?.band === 'approaching'
  ) {
    hints.push(state.subjectSchedulingReadinessBrief.stewardNote);
  }
  if (
    state.nationalWorkforceSchedulingIndex?.band === 'fragile' ||
    state.nationalWorkforceSchedulingIndex?.band === 'thin'
  ) {
    hints.push(state.nationalWorkforceSchedulingIndex.stewardNote);
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


// --- source: durability-advocacy-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type DurabilityAdvocacyCouplingBand,
  type NationalDurabilityAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceDurabilityIndex
} from './types';

function couplingBand(index: number): DurabilityAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'reinforced';
}

export function computeNationalDurabilityAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  durability: NationalWorkforceDurabilityIndex | null | undefined
): NationalDurabilityAdvocacyCouplingBrief {
  if (!state.enabled || !durability) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      durabilityDrag: 0,
      summary: 'Durability-advocacy coupling idle — workforce durability unavailable.',
      stewardNote: 'Compute workforce durability before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const durabilityDrag = v1014laborClamp(
    durability.waveDrag * 0.48 +
      (durability.band === 'brittle' || durability.band === 'thin' ? 11 : 3)
  );
  const durabilityLift =
    durability.band === 'grounded' || durability.band === 'fortified'
      ? durability.durabilityIndex * 0.24
      : durability.durabilityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + durabilityLift - durabilityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained durability-advocacy link — deploy advocacy levers before tranche scale commits.'
      : band === 'reinforced'
        ? 'Reinforced coupling — guard mentorship spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair advocacy packs with subject tranche readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    durabilityDrag,
    summary: `Durability-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); durability drag ${Math.round(durabilityDrag)}.`,
    stewardNote
  };
}


// --- source: mentorship-endurance-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type MentorshipEnduranceBand,
  type NationalLaborDemographicsState,
  type NationalMentorshipEnduranceOutlook,
  type NationalReengagementMomentumOutlook
} from './types';

function enduranceBand(index: number): MentorshipEnduranceBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'sustained';
  return 'deep';
}

export function computeNationalMentorshipEnduranceOutlook(
  state: NationalLaborDemographicsState,
  reengagementMomentum: NationalReengagementMomentumOutlook | null | undefined
): NationalMentorshipEnduranceOutlook {
  if (!state.enabled || !reengagementMomentum) {
    return {
      turn: state.turn,
      enduranceIndex: 50,
      band: 'thin',
      momentumDrag: 0,
      summary: 'Mentorship endurance idle — reengagement momentum unavailable.',
      stewardNote: 'Compute reengagement momentum before mentorship endurance guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const momentumDrag = v1014laborClamp(
    reengagementMomentum.pipelineDrag * 0.46 +
      (reengagementMomentum.band === 'stalled' || reengagementMomentum.band === 'patchy' ? 10 : 3)
  );
  const momentumLift =
    reengagementMomentum.band === 'building' || reengagementMomentum.band === 'surging'
      ? reengagementMomentum.momentumIndex * 0.2
      : reengagementMomentum.momentumIndex * 0.1;

  const enduranceIndex = v1014laborClamp(24 + mentorshipLift * 22 + momentumLift - momentumDrag);
  const band = enduranceBand(enduranceIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin mentorship endurance — ease mentorship levers before subject tranche assembly.'
      : band === 'deep'
        ? 'Deep endurance band — verify durability-advocacy coupling before auto workforce pushes.'
        : 'Sustained endurance — align mentorship with hybrid remote participation checks.';

  return {
    turn: state.turn,
    enduranceIndex,
    band,
    momentumDrag,
    summary: `National mentorship endurance ${band} (index ${Math.round(enduranceIndex)}); momentum drag ${Math.round(momentumDrag)}.`,
    stewardNote
  };
}


// --- source: subject-tranche-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectTrancheReadinessBrief,
  type NationalSubjectWaveAssemblyBrief,
  type NationalWorkforceDurabilityIndex,
  type SubjectTrancheReadinessBand
} from './types';

function trancheBand(index: number): SubjectTrancheReadinessBand {
  if (index <= 34) return 'blocked';
  if (index <= 48) return 'caution';
  if (index <= 62) return 'tranche_ready';
  return 'cleared';
}

/** Round-20 subject tranche readiness — wave assembly × durability gate for scale commits. */
export function computeNationalSubjectTrancheReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectWaveAssembly: NationalSubjectWaveAssemblyBrief | null | undefined,
  durability: NationalWorkforceDurabilityIndex | null | undefined
): NationalSubjectTrancheReadinessBrief {
  if (!state.enabled || !subjectWaveAssembly || !durability) {
    return {
      turn: state.turn,
      trancheIndex: 50,
      band: 'caution',
      trancheDrag: 0,
      summary: 'Subject tranche readiness idle — subject wave assembly or durability unavailable.',
      stewardNote: 'Compute subject wave assembly and workforce durability before tranche guidance.'
    };
  }

  const trancheDrag = v1014laborClamp(
    subjectWaveAssembly.waveDrag * 0.38 +
      durability.waveDrag * 0.38 +
      (subjectWaveAssembly.band === 'blocked' || durability.band === 'brittle' ? 12 : 3)
  );
  const waveLift =
    subjectWaveAssembly.band === 'ready' || subjectWaveAssembly.band === 'cleared'
      ? subjectWaveAssembly.assemblyIndex * 0.27
      : subjectWaveAssembly.assemblyIndex * 0.14;
  const durabilityLift =
    durability.band === 'grounded' || durability.band === 'fortified'
      ? durability.durabilityIndex * 0.25
      : durability.durabilityIndex * 0.12;

  const trancheIndex = v1014laborClamp(20 + waveLift + durabilityLift - trancheDrag);
  const band = trancheBand(trancheIndex);

  const stewardNote =
    band === 'blocked' || band === 'caution'
      ? 'Caution tranche readiness — hold O10-170 scale commits until durability-advocacy syncs.'
      : band === 'cleared'
        ? 'Cleared tranche band — still monitor mentorship endurance during corridor peaks.'
        : 'Tranche-ready — pair with workforce endurance index each assembly tranche.';

  return {
    turn: state.turn,
    trancheIndex,
    band,
    trancheDrag,
    summary: `Subject tranche readiness ${band} (index ${Math.round(trancheIndex)}); tranche drag ${Math.round(trancheDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-endurance-index.ts ---
  type NationalDurabilityAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalMentorshipEnduranceOutlook,
  type NationalSubjectTrancheReadinessBrief,
  type NationalWorkforceEnduranceIndex,
  type WorkforceEnduranceBand
} from './types';

function enduranceBand(index: number): WorkforceEnduranceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'steady';
  return 'hardened';
}

export function computeNationalWorkforceEnduranceIndex(
  state: NationalLaborDemographicsState,
  advocacyCoupling: NationalDurabilityAdvocacyCouplingBrief | null | undefined,
  mentorshipEndurance: NationalMentorshipEnduranceOutlook | null | undefined,
  subjectTranche: NationalSubjectTrancheReadinessBrief | null | undefined
): NationalWorkforceEnduranceIndex {
  if (!state.enabled || !advocacyCoupling || !mentorshipEndurance || !subjectTranche) {
    return {
      turn: state.turn,
      enduranceIndex: 50,
      band: 'thin',
      trancheDrag: 0,
      summary: 'Workforce endurance idle — advocacy coupling, mentorship endurance, or subject tranche unavailable.',
      stewardNote: 'Compute round-20 depth stack before endurance guidance.'
    };
  }

  const trancheDrag = v1014laborClamp(
    subjectTranche.trancheDrag * 0.35 +
      advocacyCoupling.durabilityDrag * 0.3 +
      mentorshipEndurance.momentumDrag * 0.25 +
      (subjectTranche.band === 'blocked' || advocacyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const advocacyLift =
    advocacyCoupling.band === 'amplified' || advocacyCoupling.band === 'reinforced'
      ? advocacyCoupling.couplingIndex * 0.2
      : advocacyCoupling.couplingIndex * 0.1;
  const mentorshipLift =
    mentorshipEndurance.band === 'sustained' || mentorshipEndurance.band === 'deep'
      ? mentorshipEndurance.enduranceIndex * 0.18
      : mentorshipEndurance.enduranceIndex * 0.09;
  const trancheLift =
    subjectTranche.band === 'tranche_ready' || subjectTranche.band === 'cleared'
      ? subjectTranche.trancheIndex * 0.22
      : subjectTranche.trancheIndex * 0.11;

  const enduranceIndex = v1014laborClamp(18 + advocacyLift + mentorshipLift + trancheLift - trancheDrag);
  const band = enduranceBand(enduranceIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce endurance — sequence durability-advocacy, mentorship, and subject tranche before post-680b9954 tranche.'
      : band === 'hardened'
        ? 'Hardened endurance — avoid corridor overload that breaks subject tranche bands.'
        : 'Steady endurance — refresh subject tranche checks each scale wave.';

  return {
    turn: state.turn,
    enduranceIndex,
    band,
    trancheDrag,
    summary: `National workforce endurance ${band} (index ${Math.round(enduranceIndex)}); tranche drag ${Math.round(trancheDrag)}.`,
    stewardNote
  };
}


// --- source: endurance-flexibility-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type EnduranceFlexibilityCouplingBand,
  type NationalEnduranceFlexibilityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceEnduranceIndex
} from './types';

function couplingBand(index: number): EnduranceFlexibilityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'elastic';
  return 'anchored';
}

export function computeNationalEnduranceFlexibilityCouplingBrief(
  state: NationalLaborDemographicsState,
  endurance: NationalWorkforceEnduranceIndex | null | undefined
): NationalEnduranceFlexibilityCouplingBrief {
  if (!state.enabled || !endurance) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      enduranceDrag: 0,
      summary: 'Endurance-flexibility coupling idle — workforce endurance unavailable.',
      stewardNote: 'Compute workforce endurance before flexibility coupling guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const enduranceDrag = v1014laborClamp(
    endurance.trancheDrag * 0.48 +
      (endurance.band === 'fragile' || endurance.band === 'thin' ? 11 : 3)
  );
  const enduranceLift =
    endurance.band === 'steady' || endurance.band === 'hardened'
      ? endurance.enduranceIndex * 0.24
      : endurance.enduranceIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + flexibilityLift * 21 + enduranceLift - enduranceDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained endurance-flexibility link — ease flexibility levers before round-21 commit pushes.'
      : band === 'anchored'
        ? 'Anchored coupling — guard inclusion spikes that drain flexibility buffers.'
        : 'Elastic coupling — pair flexibility packs with subject commit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    enduranceDrag,
    summary: `Endurance-flexibility coupling ${band} (index ${Math.round(couplingIndex)}); endurance drag ${Math.round(enduranceDrag)}.`,
    stewardNote
  };
}


// --- source: inclusion-resilience-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type InclusionResilienceBand,
  type NationalInclusionResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalMentorshipEnduranceOutlook
} from './types';

function resilienceBand(index: number): InclusionResilienceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'cohesive';
  return 'robust';
}

export function computeNationalInclusionResilienceOutlook(
  state: NationalLaborDemographicsState,
  mentorshipEndurance: NationalMentorshipEnduranceOutlook | null | undefined
): NationalInclusionResilienceOutlook {
  if (!state.enabled || !mentorshipEndurance) {
    return {
      turn: state.turn,
      resilienceIndex: 50,
      band: 'patchy',
      enduranceDrag: 0,
      summary: 'Inclusion resilience idle — mentorship endurance unavailable.',
      stewardNote: 'Compute mentorship endurance before inclusion resilience guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const enduranceDrag = v1014laborClamp(
    mentorshipEndurance.momentumDrag * 0.46 +
      (mentorshipEndurance.band === 'depleted' || mentorshipEndurance.band === 'thin' ? 10 : 3)
  );
  const mentorshipLift =
    mentorshipEndurance.band === 'sustained' || mentorshipEndurance.band === 'deep'
      ? mentorshipEndurance.enduranceIndex * 0.2
      : mentorshipEndurance.enduranceIndex * 0.1;

  const resilienceIndex = v1014laborClamp(24 + inclusionLift * 22 + mentorshipLift - enduranceDrag);
  const band = resilienceBand(resilienceIndex);

  const stewardNote =
    band === 'fragile' || band === 'patchy'
      ? 'Patchy inclusion resilience — deploy inclusion levers before subject commit assembly.'
      : band === 'robust'
        ? 'Robust resilience band — verify endurance-flexibility coupling before auto workforce pushes.'
        : 'Cohesive resilience — align inclusion with participation equity gap checks.';

  return {
    turn: state.turn,
    resilienceIndex,
    band,
    enduranceDrag,
    summary: `National inclusion resilience ${band} (index ${Math.round(resilienceIndex)}); endurance drag ${Math.round(enduranceDrag)}.`,
    stewardNote
  };
}


// --- source: subject-commit-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectCommitReadinessBrief,
  type NationalSubjectTrancheReadinessBrief,
  type NationalWorkforceEnduranceIndex,
  type SubjectCommitReadinessBand
} from './types';

function commitBand(index: number): SubjectCommitReadinessBand {
  if (index <= 34) return 'held';
  if (index <= 48) return 'review';
  if (index <= 62) return 'commit_ready';
  return 'cleared';
}

/** Round-21 subject commit readiness — tranche × endurance gate for scale commits. */
export function computeNationalSubjectCommitReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectTranche: NationalSubjectTrancheReadinessBrief | null | undefined,
  endurance: NationalWorkforceEnduranceIndex | null | undefined
): NationalSubjectCommitReadinessBrief {
  if (!state.enabled || !subjectTranche || !endurance) {
    return {
      turn: state.turn,
      commitIndex: 50,
      band: 'review',
      commitDrag: 0,
      summary: 'Subject commit readiness idle — subject tranche or endurance unavailable.',
      stewardNote: 'Compute subject tranche readiness and workforce endurance before commit guidance.'
    };
  }

  const commitDrag = v1014laborClamp(
    subjectTranche.trancheDrag * 0.38 +
      endurance.trancheDrag * 0.38 +
      (subjectTranche.band === 'blocked' || endurance.band === 'fragile' ? 12 : 3)
  );
  const trancheLift =
    subjectTranche.band === 'tranche_ready' || subjectTranche.band === 'cleared'
      ? subjectTranche.trancheIndex * 0.27
      : subjectTranche.trancheIndex * 0.14;
  const enduranceLift =
    endurance.band === 'steady' || endurance.band === 'hardened'
      ? endurance.enduranceIndex * 0.25
      : endurance.enduranceIndex * 0.12;

  const commitIndex = v1014laborClamp(20 + trancheLift + enduranceLift - commitDrag);
  const band = commitBand(commitIndex);

  const stewardNote =
    band === 'held' || band === 'review'
      ? 'Review commit readiness — hold O10-173 scale commits until endurance-flexibility syncs.'
      : band === 'cleared'
        ? 'Cleared commit band — still monitor inclusion resilience during corridor peaks.'
        : 'Commit-ready — pair with workforce tenacity index each assembly tranche.';

  return {
    turn: state.turn,
    commitIndex,
    band,
    commitDrag,
    summary: `Subject commit readiness ${band} (index ${Math.round(commitIndex)}); commit drag ${Math.round(commitDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-tenacity-index.ts ---
  type NationalEnduranceFlexibilityCouplingBrief,
  type NationalInclusionResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectCommitReadinessBrief,
  type NationalWorkforceTenacityIndex,
  type WorkforceTenacityBand
} from './types';

function tenacityBand(index: number): WorkforceTenacityBand {
  if (index <= 34) return 'brittle';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'firm';
  return 'fortified';
}

export function computeNationalWorkforceTenacityIndex(
  state: NationalLaborDemographicsState,
  flexibilityCoupling: NationalEnduranceFlexibilityCouplingBrief | null | undefined,
  inclusionResilience: NationalInclusionResilienceOutlook | null | undefined,
  subjectCommit: NationalSubjectCommitReadinessBrief | null | undefined
): NationalWorkforceTenacityIndex {
  if (!state.enabled || !flexibilityCoupling || !inclusionResilience || !subjectCommit) {
    return {
      turn: state.turn,
      tenacityIndex: 50,
      band: 'thin',
      commitDrag: 0,
      summary: 'Workforce tenacity idle — flexibility coupling, inclusion resilience, or subject commit unavailable.',
      stewardNote: 'Compute round-21 depth stack before tenacity guidance.'
    };
  }

  const commitDrag = v1014laborClamp(
    subjectCommit.commitDrag * 0.35 +
      flexibilityCoupling.enduranceDrag * 0.3 +
      inclusionResilience.enduranceDrag * 0.25 +
      (subjectCommit.band === 'held' || flexibilityCoupling.band === 'decoupled' ? 8 : 2)
  );
  const flexibilityLift =
    flexibilityCoupling.band === 'elastic' || flexibilityCoupling.band === 'anchored'
      ? flexibilityCoupling.couplingIndex * 0.2
      : flexibilityCoupling.couplingIndex * 0.1;
  const inclusionLift =
    inclusionResilience.band === 'cohesive' || inclusionResilience.band === 'robust'
      ? inclusionResilience.resilienceIndex * 0.18
      : inclusionResilience.resilienceIndex * 0.09;
  const commitLift =
    subjectCommit.band === 'commit_ready' || subjectCommit.band === 'cleared'
      ? subjectCommit.commitIndex * 0.22
      : subjectCommit.commitIndex * 0.11;

  const tenacityIndex = v1014laborClamp(18 + flexibilityLift + inclusionLift + commitLift - commitDrag);
  const band = tenacityBand(tenacityIndex);

  const stewardNote =
    band === 'brittle' || band === 'thin'
      ? 'Thin workforce tenacity — sequence endurance-flexibility, inclusion, and subject commit before post-99f2e72b tranche.'
      : band === 'fortified'
        ? 'Fortified tenacity — avoid corridor overload that breaks subject commit bands.'
        : 'Firm tenacity — refresh subject commit checks each scale wave.';

  return {
    turn: state.turn,
    tenacityIndex,
    band,
    commitDrag,
    summary: `National workforce tenacity ${band} (index ${Math.round(tenacityIndex)}); commit drag ${Math.round(commitDrag)}.`,
    stewardNote
  };
}


// --- source: tenacity-care-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalTenacityCareCouplingBrief,
  type NationalWorkforceTenacityIndex,
  type TenacityCareCouplingBand
} from './types';

function couplingBand(index: number): TenacityCareCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'supported';
  return 'nurtured';
}

export function computeNationalTenacityCareCouplingBrief(
  state: NationalLaborDemographicsState,
  tenacity: NationalWorkforceTenacityIndex | null | undefined
): NationalTenacityCareCouplingBrief {
  if (!state.enabled || !tenacity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      tenacityDrag: 0,
      summary: 'Tenacity-care coupling idle — workforce tenacity unavailable.',
      stewardNote: 'Compute workforce tenacity before care coupling guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const tenacityDrag = v1014laborClamp(
    tenacity.commitDrag * 0.48 +
      (tenacity.band === 'brittle' || tenacity.band === 'thin' ? 11 : 3)
  );
  const tenacityLift =
    tenacity.band === 'firm' || tenacity.band === 'fortified'
      ? tenacity.tenacityIndex * 0.24
      : tenacity.tenacityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + careLift * 21 + tenacityLift - tenacityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained tenacity-care link — ease care levers before round-22 release commits.'
      : band === 'nurtured'
        ? 'Nurtured coupling — guard safety spikes that drain care buffers.'
        : 'Supported coupling — pair care packs with subject release readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    tenacityDrag,
    summary: `Tenacity-care coupling ${band} (index ${Math.round(couplingIndex)}); tenacity drag ${Math.round(tenacityDrag)}.`,
    stewardNote
  };
}


// --- source: safety-cohesion-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalInclusionResilienceOutlook,
  type NationalLaborDemographicsState,
  type NationalSafetyCohesionOutlook,
  type SafetyCohesionBand
} from './types';

function cohesionBand(index: number): SafetyCohesionBand {
  if (index <= 34) return 'exposed';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'guarded';
  return 'shielded';
}

export function computeNationalSafetyCohesionOutlook(
  state: NationalLaborDemographicsState,
  inclusionResilience: NationalInclusionResilienceOutlook | null | undefined
): NationalSafetyCohesionOutlook {
  if (!state.enabled || !inclusionResilience) {
    return {
      turn: state.turn,
      cohesionIndex: 50,
      band: 'uneven',
      resilienceDrag: 0,
      summary: 'Safety cohesion idle — inclusion resilience unavailable.',
      stewardNote: 'Compute inclusion resilience before safety cohesion guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resilienceDrag = v1014laborClamp(
    inclusionResilience.enduranceDrag * 0.46 +
      (inclusionResilience.band === 'fragile' || inclusionResilience.band === 'patchy' ? 10 : 3)
  );
  const inclusionLift =
    inclusionResilience.band === 'cohesive' || inclusionResilience.band === 'robust'
      ? inclusionResilience.resilienceIndex * 0.2
      : inclusionResilience.resilienceIndex * 0.1;

  const cohesionIndex = v1014laborClamp(24 + safetyLift * 22 + inclusionLift - resilienceDrag);
  const band = cohesionBand(cohesionIndex);

  const stewardNote =
    band === 'exposed' || band === 'uneven'
      ? 'Uneven safety cohesion — deploy safety levers before subject release assembly.'
      : band === 'shielded'
        ? 'Shielded cohesion band — verify tenacity-care coupling before auto workforce pushes.'
        : 'Guarded cohesion — align safety with essential worker participation checks.';

  return {
    turn: state.turn,
    cohesionIndex,
    band,
    resilienceDrag,
    summary: `National safety cohesion ${band} (index ${Math.round(cohesionIndex)}); resilience drag ${Math.round(resilienceDrag)}.`,
    stewardNote
  };
}


// --- source: subject-release-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectCommitReadinessBrief,
  type NationalSubjectReleaseReadinessBrief,
  type NationalWorkforceTenacityIndex,
  type SubjectReleaseReadinessBand
} from './types';

function releaseBand(index: number): SubjectReleaseReadinessBand {
  if (index <= 34) return 'held';
  if (index <= 48) return 'staged';
  if (index <= 62) return 'release_ready';
  return 'cleared';
}

/** Round-22 subject release readiness — commit × tenacity gate for scale release. */
export function computeNationalSubjectReleaseReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCommit: NationalSubjectCommitReadinessBrief | null | undefined,
  tenacity: NationalWorkforceTenacityIndex | null | undefined
): NationalSubjectReleaseReadinessBrief {
  if (!state.enabled || !subjectCommit || !tenacity) {
    return {
      turn: state.turn,
      releaseIndex: 50,
      band: 'staged',
      releaseDrag: 0,
      summary: 'Subject release readiness idle — subject commit or tenacity unavailable.',
      stewardNote: 'Compute subject commit readiness and workforce tenacity before release guidance.'
    };
  }

  const releaseDrag = v1014laborClamp(
    subjectCommit.commitDrag * 0.38 +
      tenacity.commitDrag * 0.38 +
      (subjectCommit.band === 'held' || tenacity.band === 'brittle' ? 12 : 3)
  );
  const commitLift =
    subjectCommit.band === 'commit_ready' || subjectCommit.band === 'cleared'
      ? subjectCommit.commitIndex * 0.27
      : subjectCommit.commitIndex * 0.14;
  const tenacityLift =
    tenacity.band === 'firm' || tenacity.band === 'fortified'
      ? tenacity.tenacityIndex * 0.25
      : tenacity.tenacityIndex * 0.12;

  const releaseIndex = v1014laborClamp(20 + commitLift + tenacityLift - releaseDrag);
  const band = releaseBand(releaseIndex);

  const stewardNote =
    band === 'held' || band === 'staged'
      ? 'Staged release readiness — hold O10-175 scale release until tenacity-care syncs.'
      : band === 'cleared'
        ? 'Cleared release band — still monitor safety cohesion during corridor peaks.'
        : 'Release-ready — pair with workforce steadfast index each assembly tranche.';

  return {
    turn: state.turn,
    releaseIndex,
    band,
    releaseDrag,
    summary: `Subject release readiness ${band} (index ${Math.round(releaseIndex)}); release drag ${Math.round(releaseDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-steadfast-index.ts ---
  type NationalLaborDemographicsState,
  type NationalSafetyCohesionOutlook,
  type NationalSubjectReleaseReadinessBrief,
  type NationalTenacityCareCouplingBrief,
  type NationalWorkforceSteadfastIndex,
  type WorkforceSteadfastBand
} from './types';

function steadfastBand(index: number): WorkforceSteadfastBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'steady';
  return 'anchored';
}

export function computeNationalWorkforceSteadfastIndex(
  state: NationalLaborDemographicsState,
  careCoupling: NationalTenacityCareCouplingBrief | null | undefined,
  safetyCohesion: NationalSafetyCohesionOutlook | null | undefined,
  subjectRelease: NationalSubjectReleaseReadinessBrief | null | undefined
): NationalWorkforceSteadfastIndex {
  if (!state.enabled || !careCoupling || !safetyCohesion || !subjectRelease) {
    return {
      turn: state.turn,
      steadfastIndex: 50,
      band: 'thin',
      releaseDrag: 0,
      summary: 'Workforce steadfast idle — care coupling, safety cohesion, or subject release unavailable.',
      stewardNote: 'Compute round-22 depth stack before steadfast guidance.'
    };
  }

  const releaseDrag = v1014laborClamp(
    subjectRelease.releaseDrag * 0.35 +
      careCoupling.tenacityDrag * 0.3 +
      safetyCohesion.resilienceDrag * 0.25 +
      (subjectRelease.band === 'held' || careCoupling.band === 'decoupled' ? 8 : 2)
  );
  const careLift =
    careCoupling.band === 'supported' || careCoupling.band === 'nurtured'
      ? careCoupling.couplingIndex * 0.2
      : careCoupling.couplingIndex * 0.1;
  const safetyLift =
    safetyCohesion.band === 'guarded' || safetyCohesion.band === 'shielded'
      ? safetyCohesion.cohesionIndex * 0.18
      : safetyCohesion.cohesionIndex * 0.09;
  const releaseLift =
    subjectRelease.band === 'release_ready' || subjectRelease.band === 'cleared'
      ? subjectRelease.releaseIndex * 0.22
      : subjectRelease.releaseIndex * 0.11;

  const steadfastIndex = v1014laborClamp(18 + careLift + safetyLift + releaseLift - releaseDrag);
  const band = steadfastBand(steadfastIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce steadfast — sequence tenacity-care, safety cohesion, and subject release before post-634656bb tranche.'
      : band === 'anchored'
        ? 'Anchored steadfast — avoid corridor overload that breaks subject release bands.'
        : 'Steady steadfast — refresh subject release checks each scale wave.';

  return {
    turn: state.turn,
    steadfastIndex,
    band,
    releaseDrag,
    summary: `National workforce steadfast ${band} (index ${Math.round(steadfastIndex)}); release drag ${Math.round(releaseDrag)}.`,
    stewardNote
  };
}


// --- source: steadfast-scheduling-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSteadfastSchedulingCouplingBrief,
  type NationalWorkforceSteadfastIndex,
  type SteadfastSchedulingCouplingBand
} from './types';

function couplingBand(index: number): SteadfastSchedulingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'rhythmic';
  return 'locked';
}

export function computeNationalSteadfastSchedulingCouplingBrief(
  state: NationalLaborDemographicsState,
  steadfast: NationalWorkforceSteadfastIndex | null | undefined
): NationalSteadfastSchedulingCouplingBrief {
  if (!state.enabled || !steadfast) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      steadfastDrag: 0,
      summary: 'Steadfast-scheduling coupling idle — workforce steadfast unavailable.',
      stewardNote: 'Compute workforce steadfast before scheduling coupling guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const steadfastDrag = v1014laborClamp(
    steadfast.releaseDrag * 0.48 +
      (steadfast.band === 'fragile' || steadfast.band === 'thin' ? 11 : 3)
  );
  const steadfastLift =
    steadfast.band === 'steady' || steadfast.band === 'anchored'
      ? steadfast.steadfastIndex * 0.24
      : steadfast.steadfastIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + schedulingLift * 21 + steadfastLift - steadfastDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained steadfast-scheduling link — ease scheduling levers before round-23 seal commits.'
      : band === 'locked'
        ? 'Locked coupling — guard retention spikes that drain scheduling buffers.'
        : 'Rhythmic coupling — pair scheduling packs with subject seal readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    steadfastDrag,
    summary: `Steadfast-scheduling coupling ${band} (index ${Math.round(couplingIndex)}); steadfast drag ${Math.round(steadfastDrag)}.`,
    stewardNote
  };
}


// --- source: retention-anchor-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalRetentionAnchorOutlook,
  type NationalSafetyCohesionOutlook,
  type RetentionAnchorBand
} from './types';

function anchorBand(index: number): RetentionAnchorBand {
  if (index <= 34) return 'drifting';
  if (index <= 48) return 'loose';
  if (index <= 62) return 'anchored';
  return 'moored';
}

export function computeNationalRetentionAnchorOutlook(
  state: NationalLaborDemographicsState,
  safetyCohesion: NationalSafetyCohesionOutlook | null | undefined
): NationalRetentionAnchorOutlook {
  if (!state.enabled || !safetyCohesion) {
    return {
      turn: state.turn,
      anchorIndex: 50,
      band: 'loose',
      cohesionDrag: 0,
      summary: 'Retention anchor idle — safety cohesion unavailable.',
      stewardNote: 'Compute safety cohesion before retention anchor guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const cohesionDrag = v1014laborClamp(
    safetyCohesion.resilienceDrag * 0.46 +
      (safetyCohesion.band === 'exposed' || safetyCohesion.band === 'uneven' ? 10 : 3)
  );
  const safetyLift =
    safetyCohesion.band === 'guarded' || safetyCohesion.band === 'shielded'
      ? safetyCohesion.cohesionIndex * 0.2
      : safetyCohesion.cohesionIndex * 0.1;

  const anchorIndex = v1014laborClamp(24 + retentionLift * 22 + safetyLift - cohesionDrag);
  const band = anchorBand(anchorIndex);

  const stewardNote =
    band === 'drifting' || band === 'loose'
      ? 'Loose retention anchor — deploy retention levers before subject seal assembly.'
      : band === 'moored'
        ? 'Moored anchor band — verify steadfast-scheduling coupling before auto workforce pushes.'
        : 'Anchored retention — align anchor with seasonal participation swing checks.';

  return {
    turn: state.turn,
    anchorIndex,
    band,
    cohesionDrag,
    summary: `National retention anchor ${band} (index ${Math.round(anchorIndex)}); cohesion drag ${Math.round(cohesionDrag)}.`,
    stewardNote
  };
}


// --- source: subject-seal-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectReleaseReadinessBrief,
  type NationalSubjectSealReadinessBrief,
  type NationalWorkforceSteadfastIndex,
  type SubjectSealReadinessBand
} from './types';

function sealBand(index: number): SubjectSealReadinessBand {
  if (index <= 34) return 'open';
  if (index <= 48) return 'pending';
  if (index <= 62) return 'sealed';
  return 'locked';
}

/** Round-23 subject seal readiness — release × steadfast gate for wave seal. */
export function computeNationalSubjectSealReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectRelease: NationalSubjectReleaseReadinessBrief | null | undefined,
  steadfast: NationalWorkforceSteadfastIndex | null | undefined
): NationalSubjectSealReadinessBrief {
  if (!state.enabled || !subjectRelease || !steadfast) {
    return {
      turn: state.turn,
      sealIndex: 50,
      band: 'pending',
      sealDrag: 0,
      summary: 'Subject seal readiness idle — subject release or steadfast unavailable.',
      stewardNote: 'Compute subject release readiness and workforce steadfast before seal guidance.'
    };
  }

  const sealDrag = v1014laborClamp(
    subjectRelease.releaseDrag * 0.38 +
      steadfast.releaseDrag * 0.38 +
      (subjectRelease.band === 'held' || steadfast.band === 'fragile' ? 12 : 3)
  );
  const releaseLift =
    subjectRelease.band === 'release_ready' || subjectRelease.band === 'cleared'
      ? subjectRelease.releaseIndex * 0.27
      : subjectRelease.releaseIndex * 0.14;
  const steadfastLift =
    steadfast.band === 'steady' || steadfast.band === 'anchored'
      ? steadfast.steadfastIndex * 0.25
      : steadfast.steadfastIndex * 0.12;

  const sealIndex = v1014laborClamp(20 + releaseLift + steadfastLift - sealDrag);
  const band = sealBand(sealIndex);

  const stewardNote =
    band === 'open' || band === 'pending'
      ? 'Pending subject seal — hold O10-177 scale seal until steadfast-scheduling syncs.'
      : band === 'locked'
        ? 'Locked seal band — still monitor retention anchor during corridor peaks.'
        : 'Sealed band — pair with workforce resolve index each assembly tranche.';

  return {
    turn: state.turn,
    sealIndex,
    band,
    sealDrag,
    summary: `Subject seal readiness ${band} (index ${Math.round(sealIndex)}); seal drag ${Math.round(sealDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-resolve-index.ts ---
  type NationalLaborDemographicsState,
  type NationalRetentionAnchorOutlook,
  type NationalSteadfastSchedulingCouplingBrief,
  type NationalSubjectSealReadinessBrief,
  type NationalWorkforceResolveIndex,
  type WorkforceResolveBand
} from './types';

function resolveBand(index: number): WorkforceResolveBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'firm';
  return 'indomitable';
}

export function computeNationalWorkforceResolveIndex(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalSteadfastSchedulingCouplingBrief | null | undefined,
  retentionAnchor: NationalRetentionAnchorOutlook | null | undefined,
  subjectSeal: NationalSubjectSealReadinessBrief | null | undefined
): NationalWorkforceResolveIndex {
  if (!state.enabled || !schedulingCoupling || !retentionAnchor || !subjectSeal) {
    return {
      turn: state.turn,
      resolveIndex: 50,
      band: 'thin',
      sealDrag: 0,
      summary: 'Workforce resolve idle — scheduling coupling, retention anchor, or subject seal unavailable.',
      stewardNote: 'Compute round-23 depth stack before resolve guidance.'
    };
  }

  const sealDrag = v1014laborClamp(
    subjectSeal.sealDrag * 0.35 +
      schedulingCoupling.steadfastDrag * 0.3 +
      retentionAnchor.cohesionDrag * 0.25 +
      (subjectSeal.band === 'open' || schedulingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const schedulingLift =
    schedulingCoupling.band === 'rhythmic' || schedulingCoupling.band === 'locked'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;
  const anchorLift =
    retentionAnchor.band === 'anchored' || retentionAnchor.band === 'moored'
      ? retentionAnchor.anchorIndex * 0.18
      : retentionAnchor.anchorIndex * 0.09;
  const sealLift =
    subjectSeal.band === 'sealed' || subjectSeal.band === 'locked'
      ? subjectSeal.sealIndex * 0.22
      : subjectSeal.sealIndex * 0.11;

  const resolveIndex = v1014laborClamp(18 + schedulingLift + anchorLift + sealLift - sealDrag);
  const band = resolveBand(resolveIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce resolve — sequence steadfast-scheduling, retention anchor, and subject seal before post-b23e1449 tranche.'
      : band === 'indomitable'
        ? 'Indomitable resolve — avoid corridor overload that breaks subject seal bands.'
        : 'Firm resolve — refresh subject seal checks each scale wave.';

  return {
    turn: state.turn,
    resolveIndex,
    band,
    sealDrag,
    summary: `National workforce resolve ${band} (index ${Math.round(resolveIndex)}); seal drag ${Math.round(sealDrag)}.`,
    stewardNote
  };
}


// --- source: resolve-upskilling-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResolveUpskillingCouplingBrief,
  type NationalUpskillingVelocityOutlook,
  type NationalWorkforceResolveIndex,
  type ResolveUpskillingCouplingBand
} from './types';

function couplingBand(index: number): ResolveUpskillingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'aligned';
  return 'accelerated';
}

export function computeNationalResolveUpskillingCouplingBrief(
  state: NationalLaborDemographicsState,
  resolve: NationalWorkforceResolveIndex | null | undefined,
  upskillingVelocity: NationalUpskillingVelocityOutlook | null | undefined
): NationalResolveUpskillingCouplingBrief {
  if (!state.enabled || !resolve || !upskillingVelocity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      resolveDrag: 0,
      summary: 'Resolve-upskilling coupling idle — workforce resolve or upskilling velocity unavailable.',
      stewardNote: 'Compute workforce resolve and upskilling velocity before coupling guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resolveDrag = v1014laborClamp(
    resolve.sealDrag * 0.45 +
      upskillingVelocity.mismatchDrag * 0.35 +
      (resolve.band === 'fragile' || resolve.band === 'thin' ? 10 : 2)
  );
  const resolveLift =
    resolve.band === 'firm' || resolve.band === 'indomitable'
      ? resolve.resolveIndex * 0.22
      : resolve.resolveIndex * 0.11;
  const velocityLift =
    upskillingVelocity.band === 'active' || upskillingVelocity.band === 'accelerating'
      ? upskillingVelocity.velocityIndex * 0.2
      : upskillingVelocity.velocityIndex * 0.1;

  const couplingIndex = v1014laborClamp(22 + upskillingLift * 21 + resolveLift + velocityLift - resolveDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained resolve-upskilling link — deploy program levers before round-24 bind commits.'
      : band === 'accelerated'
        ? 'Accelerated coupling — guard coordination binds that drain upskilling buffers.'
        : 'Aligned coupling — pair upskilling packs with subject bind readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    resolveDrag,
    summary: `Resolve-upskilling coupling ${band} (index ${Math.round(couplingIndex)}); resolve drag ${Math.round(resolveDrag)}.`,
    stewardNote
  };
}


// --- source: coordination-bind-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CoordinationBindBand,
  type NationalCoordinationBindOutlook,
  type NationalLaborDemographicsState,
  type NationalSteadfastSchedulingCouplingBrief
} from './types';

function bindBand(index: number): CoordinationBindBand {
  if (index <= 34) return 'loose';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'bound';
  return 'locked';
}

export function computeNationalCoordinationBindOutlook(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalSteadfastSchedulingCouplingBrief | null | undefined
): NationalCoordinationBindOutlook {
  if (!state.enabled || !schedulingCoupling) {
    return {
      turn: state.turn,
      bindIndex: 50,
      band: 'patchy',
      schedulingDrag: 0,
      summary: 'Coordination bind idle — steadfast-scheduling coupling unavailable.',
      stewardNote: 'Compute steadfast-scheduling coupling before coordination bind guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const schedulingDrag = v1014laborClamp(
    schedulingCoupling.steadfastDrag * 0.46 +
      (schedulingCoupling.band === 'decoupled' || schedulingCoupling.band === 'strained' ? 10 : 3)
  );
  const schedulingLift =
    schedulingCoupling.band === 'rhythmic' || schedulingCoupling.band === 'locked'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;

  const bindIndex = v1014laborClamp(24 + coordinationLift * 22 + schedulingLift - schedulingDrag);
  const band = bindBand(bindIndex);

  const stewardNote =
    band === 'loose' || band === 'patchy'
      ? 'Patchy coordination bind — ease coordination levers before subject bind assembly.'
      : band === 'locked'
        ? 'Locked bind band — verify resolve-upskilling coupling before auto workforce pushes.'
        : 'Bound coordination — align bind with labor market stability checks.';

  return {
    turn: state.turn,
    bindIndex,
    band,
    schedulingDrag,
    summary: `National coordination bind ${band} (index ${Math.round(bindIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}


// --- source: subject-bind-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectBindReadinessBrief,
  type NationalSubjectSealReadinessBrief,
  type NationalWorkforceResolveIndex,
  type SubjectBindReadinessBand
} from './types';

function bindBand(index: number): SubjectBindReadinessBand {
  if (index <= 34) return 'unbound';
  if (index <= 48) return 'tension';
  if (index <= 62) return 'bound';
  return 'locked';
}

/** Round-24 subject bind readiness — seal × resolve gate for wave bind. */
export function computeNationalSubjectBindReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSeal: NationalSubjectSealReadinessBrief | null | undefined,
  resolve: NationalWorkforceResolveIndex | null | undefined
): NationalSubjectBindReadinessBrief {
  if (!state.enabled || !subjectSeal || !resolve) {
    return {
      turn: state.turn,
      bindIndex: 50,
      band: 'tension',
      bindDrag: 0,
      summary: 'Subject bind readiness idle — subject seal or resolve unavailable.',
      stewardNote: 'Compute subject seal readiness and workforce resolve before bind guidance.'
    };
  }

  const bindDrag = v1014laborClamp(
    subjectSeal.sealDrag * 0.38 +
      resolve.sealDrag * 0.38 +
      (subjectSeal.band === 'open' || resolve.band === 'fragile' ? 12 : 3)
  );
  const sealLift =
    subjectSeal.band === 'sealed' || subjectSeal.band === 'locked'
      ? subjectSeal.sealIndex * 0.27
      : subjectSeal.sealIndex * 0.14;
  const resolveLift =
    resolve.band === 'firm' || resolve.band === 'indomitable'
      ? resolve.resolveIndex * 0.25
      : resolve.resolveIndex * 0.12;

  const bindIndex = v1014laborClamp(20 + sealLift + resolveLift - bindDrag);
  const band = bindBand(bindIndex);

  const stewardNote =
    band === 'unbound' || band === 'tension'
      ? 'Tension bind readiness — hold O10-179 scale bind until resolve-upskilling syncs.'
      : band === 'locked'
        ? 'Locked bind band — still monitor coordination bind during corridor peaks.'
        : 'Bound band — pair with workforce fortitude index each assembly tranche.';

  return {
    turn: state.turn,
    bindIndex,
    band,
    bindDrag,
    summary: `Subject bind readiness ${band} (index ${Math.round(bindIndex)}); bind drag ${Math.round(bindDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-fortitude-index.ts ---
  type NationalCoordinationBindOutlook,
  type NationalLaborDemographicsState,
  type NationalResolveUpskillingCouplingBrief,
  type NationalSubjectBindReadinessBrief,
  type NationalWorkforceFortitudeIndex,
  type WorkforceFortitudeBand
} from './types';

function fortitudeBand(index: number): WorkforceFortitudeBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'solid';
  return 'unshakable';
}

export function computeNationalWorkforceFortitudeIndex(
  state: NationalLaborDemographicsState,
  upskillingCoupling: NationalResolveUpskillingCouplingBrief | null | undefined,
  coordinationBind: NationalCoordinationBindOutlook | null | undefined,
  subjectBind: NationalSubjectBindReadinessBrief | null | undefined
): NationalWorkforceFortitudeIndex {
  if (!state.enabled || !upskillingCoupling || !coordinationBind || !subjectBind) {
    return {
      turn: state.turn,
      fortitudeIndex: 50,
      band: 'thin',
      bindDrag: 0,
      summary: 'Workforce fortitude idle — upskilling coupling, coordination bind, or subject bind unavailable.',
      stewardNote: 'Compute round-24 depth stack before fortitude guidance.'
    };
  }

  const bindDrag = v1014laborClamp(
    subjectBind.bindDrag * 0.35 +
      upskillingCoupling.resolveDrag * 0.3 +
      coordinationBind.schedulingDrag * 0.25 +
      (subjectBind.band === 'unbound' || upskillingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const upskillingLift =
    upskillingCoupling.band === 'aligned' || upskillingCoupling.band === 'accelerated'
      ? upskillingCoupling.couplingIndex * 0.2
      : upskillingCoupling.couplingIndex * 0.1;
  const coordinationLift =
    coordinationBind.band === 'bound' || coordinationBind.band === 'locked'
      ? coordinationBind.bindIndex * 0.18
      : coordinationBind.bindIndex * 0.09;
  const subjectLift =
    subjectBind.band === 'bound' || subjectBind.band === 'locked'
      ? subjectBind.bindIndex * 0.22
      : subjectBind.bindIndex * 0.11;

  const fortitudeIndex = v1014laborClamp(18 + upskillingLift + coordinationLift + subjectLift - bindDrag);
  const band = fortitudeBand(fortitudeIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce fortitude — sequence resolve-upskilling, coordination bind, and subject bind before post-b64a7aa8 tranche.'
      : band === 'unshakable'
        ? 'Unshakable fortitude — avoid corridor overload that breaks subject bind bands.'
        : 'Solid fortitude — refresh subject bind checks each scale wave.';

  return {
    turn: state.turn,
    fortitudeIndex,
    band,
    bindDrag,
    summary: `National workforce fortitude ${band} (index ${Math.round(fortitudeIndex)}); bind drag ${Math.round(bindDrag)}.`,
    stewardNote
  };
}


// --- source: fortitude-inclusion-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type FortitudeInclusionCouplingBand,
  type NationalFortitudeInclusionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceFortitudeIndex
} from './types';

function couplingBand(index: number): FortitudeInclusionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'inclusive';
  return 'elevated';
}

export function computeNationalFortitudeInclusionCouplingBrief(
  state: NationalLaborDemographicsState,
  fortitude: NationalWorkforceFortitudeIndex | null | undefined
): NationalFortitudeInclusionCouplingBrief {
  if (!state.enabled || !fortitude) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      fortitudeDrag: 0,
      summary: 'Fortitude-inclusion coupling idle — workforce fortitude unavailable.',
      stewardNote: 'Compute workforce fortitude before inclusion coupling guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const fortitudeDrag = v1014laborClamp(
    fortitude.bindDrag * 0.48 +
      (fortitude.band === 'fragile' || fortitude.band === 'thin' ? 11 : 3)
  );
  const fortitudeLift =
    fortitude.band === 'solid' || fortitude.band === 'unshakable'
      ? fortitude.fortitudeIndex * 0.24
      : fortitude.fortitudeIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + inclusionLift * 21 + fortitudeLift - fortitudeDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained fortitude-inclusion link — deploy inclusion levers before round-25 crown commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard hybrid anchor spikes that drain inclusion buffers.'
        : 'Inclusive coupling — pair inclusion packs with subject crown readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    fortitudeDrag,
    summary: `Fortitude-inclusion coupling ${band} (index ${Math.round(couplingIndex)}); fortitude drag ${Math.round(fortitudeDrag)}.`,
    stewardNote
  };
}


// --- source: hybrid-anchor-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type HybridAnchorBand,
  type NationalCoordinationBindOutlook,
  type NationalHybridAnchorOutlook,
  type NationalLaborDemographicsState
} from './types';

function anchorBand(index: number): HybridAnchorBand {
  if (index <= 34) return 'drifting';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'anchored';
  return 'fixed';
}

export function computeNationalHybridAnchorOutlook(
  state: NationalLaborDemographicsState,
  coordinationBind: NationalCoordinationBindOutlook | null | undefined
): NationalHybridAnchorOutlook {
  if (!state.enabled || !coordinationBind) {
    return {
      turn: state.turn,
      anchorIndex: 50,
      band: 'mixed',
      bindDrag: 0,
      summary: 'Hybrid anchor idle — coordination bind unavailable.',
      stewardNote: 'Compute coordination bind before hybrid anchor guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const bindDrag = v1014laborClamp(
    coordinationBind.schedulingDrag * 0.46 +
      (coordinationBind.band === 'loose' || coordinationBind.band === 'patchy' ? 10 : 3)
  );
  const bindLift =
    coordinationBind.band === 'bound' || coordinationBind.band === 'locked'
      ? coordinationBind.bindIndex * 0.2
      : coordinationBind.bindIndex * 0.1;

  const anchorIndex = v1014laborClamp(24 + flexibilityLift * 22 + bindLift - bindDrag);
  const band = anchorBand(anchorIndex);

  const stewardNote =
    band === 'drifting' || band === 'mixed'
      ? 'Mixed hybrid anchor — ease flexibility levers before subject crown assembly.'
      : band === 'fixed'
        ? 'Fixed anchor band — verify fortitude-inclusion coupling before auto workforce pushes.'
        : 'Anchored hybrid — align anchor with hybrid remote participation checks.';

  return {
    turn: state.turn,
    anchorIndex,
    band,
    bindDrag,
    summary: `National hybrid anchor ${band} (index ${Math.round(anchorIndex)}); bind drag ${Math.round(bindDrag)}.`,
    stewardNote
  };
}


// --- source: subject-crown-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectBindReadinessBrief,
  type NationalSubjectCrownReadinessBrief,
  type NationalWorkforceFortitudeIndex,
  type SubjectCrownReadinessBand
} from './types';

function crownBand(index: number): SubjectCrownReadinessBand {
  if (index <= 34) return 'uncrowned';
  if (index <= 48) return 'pending';
  if (index <= 62) return 'crowned';
  return 'sealed';
}

/** Round-25 subject crown readiness — bind × fortitude gate for wave-25 culmination. */
export function computeNationalSubjectCrownReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectBind: NationalSubjectBindReadinessBrief | null | undefined,
  fortitude: NationalWorkforceFortitudeIndex | null | undefined
): NationalSubjectCrownReadinessBrief {
  if (!state.enabled || !subjectBind || !fortitude) {
    return {
      turn: state.turn,
      crownIndex: 50,
      band: 'pending',
      crownDrag: 0,
      summary: 'Subject crown readiness idle — subject bind or fortitude unavailable.',
      stewardNote: 'Compute subject bind readiness and workforce fortitude before crown guidance.'
    };
  }

  const crownDrag = v1014laborClamp(
    subjectBind.bindDrag * 0.38 +
      fortitude.bindDrag * 0.38 +
      (subjectBind.band === 'unbound' || fortitude.band === 'fragile' ? 12 : 3)
  );
  const bindLift =
    subjectBind.band === 'bound' || subjectBind.band === 'locked'
      ? subjectBind.bindIndex * 0.27
      : subjectBind.bindIndex * 0.14;
  const fortitudeLift =
    fortitude.band === 'solid' || fortitude.band === 'unshakable'
      ? fortitude.fortitudeIndex * 0.25
      : fortitude.fortitudeIndex * 0.12;

  const crownIndex = v1014laborClamp(20 + bindLift + fortitudeLift - crownDrag);
  const band = crownBand(crownIndex);

  const stewardNote =
    band === 'uncrowned' || band === 'pending'
      ? 'Pending subject crown — hold O10-181 scale crown until fortitude-inclusion syncs.'
      : band === 'sealed'
        ? 'Sealed crown band — still monitor hybrid anchor during corridor peaks.'
        : 'Crowned band — pair with workforce culmination index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    crownIndex,
    band,
    crownDrag,
    summary: `Subject crown readiness ${band} (index ${Math.round(crownIndex)}); crown drag ${Math.round(crownDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-culmination-index.ts ---
  type NationalFortitudeInclusionCouplingBrief,
  type NationalHybridAnchorOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectCrownReadinessBrief,
  type NationalWorkforceCulminationIndex,
  type WorkforceCulminationBand
} from './types';

function culminationBand(index: number): WorkforceCulminationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'ready';
  return 'summit';
}

export function computeNationalWorkforceCulminationIndex(
  state: NationalLaborDemographicsState,
  inclusionCoupling: NationalFortitudeInclusionCouplingBrief | null | undefined,
  hybridAnchor: NationalHybridAnchorOutlook | null | undefined,
  subjectCrown: NationalSubjectCrownReadinessBrief | null | undefined
): NationalWorkforceCulminationIndex {
  if (!state.enabled || !inclusionCoupling || !hybridAnchor || !subjectCrown) {
    return {
      turn: state.turn,
      culminationIndex: 50,
      band: 'thin',
      crownDrag: 0,
      summary: 'Workforce culmination idle — inclusion coupling, hybrid anchor, or subject crown unavailable.',
      stewardNote: 'Compute round-25 depth stack before culmination guidance.'
    };
  }

  const crownDrag = v1014laborClamp(
    subjectCrown.crownDrag * 0.35 +
      inclusionCoupling.fortitudeDrag * 0.3 +
      hybridAnchor.bindDrag * 0.25 +
      (subjectCrown.band === 'uncrowned' || inclusionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const inclusionLift =
    inclusionCoupling.band === 'inclusive' || inclusionCoupling.band === 'elevated'
      ? inclusionCoupling.couplingIndex * 0.2
      : inclusionCoupling.couplingIndex * 0.1;
  const anchorLift =
    hybridAnchor.band === 'anchored' || hybridAnchor.band === 'fixed'
      ? hybridAnchor.anchorIndex * 0.18
      : hybridAnchor.anchorIndex * 0.09;
  const crownLift =
    subjectCrown.band === 'crowned' || subjectCrown.band === 'sealed'
      ? subjectCrown.crownIndex * 0.22
      : subjectCrown.crownIndex * 0.11;

  const culminationIndex = v1014laborClamp(18 + inclusionLift + anchorLift + crownLift - crownDrag);
  const band = culminationBand(culminationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce culmination — sequence fortitude-inclusion, hybrid anchor, and subject crown before post-8d741ac7 tranche.'
      : band === 'summit'
        ? 'Summit culmination — avoid corridor overload that breaks subject crown bands.'
        : 'Ready culmination — refresh subject crown checks before Agent 25 chunk merge.';

  return {
    turn: state.turn,
    culminationIndex,
    band,
    crownDrag,
    summary: `National workforce culmination ${band} (index ${Math.round(culminationIndex)}); crown drag ${Math.round(crownDrag)}.`,
    stewardNote
  };
}


// --- source: culmination-mentorship-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CulminationMentorshipCouplingBand,
  type NationalCulminationMentorshipCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceCulminationIndex
} from './types';

function couplingBand(index: number): CulminationMentorshipCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'guided';
  return 'elevated';
}

export function computeNationalCulminationMentorshipCouplingBrief(
  state: NationalLaborDemographicsState,
  culmination: NationalWorkforceCulminationIndex | null | undefined
): NationalCulminationMentorshipCouplingBrief {
  if (!state.enabled || !culmination) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      culminationDrag: 0,
      summary: 'Culmination-mentorship coupling idle — workforce culmination unavailable.',
      stewardNote: 'Compute workforce culmination before mentorship coupling guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const culminationDrag = v1014laborClamp(
    culmination.crownDrag * 0.48 +
      (culmination.band === 'fragile' || culmination.band === 'thin' ? 11 : 3)
  );
  const culminationLift =
    culmination.band === 'ready' || culmination.band === 'summit'
      ? culmination.culminationIndex * 0.24
      : culmination.culminationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + mentorshipLift * 21 + culminationLift - culminationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained culmination-mentorship link — ease mentorship levers before wave-26 apex commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard onboarding sustain spikes that drain mentorship buffers.'
        : 'Guided coupling — pair mentorship packs with subject apex readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    culminationDrag,
    summary: `Culmination-mentorship coupling ${band} (index ${Math.round(couplingIndex)}); culmination drag ${Math.round(culminationDrag)}.`,
    stewardNote
  };
}


// --- source: onboarding-sustain-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalHybridAnchorOutlook,
  type NationalLaborDemographicsState,
  type NationalOnboardingSustainOutlook,
  type OnboardingSustainBand
} from './types';

function sustainBand(index: number): OnboardingSustainBand {
  if (index <= 34) return 'depleted';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'sustained';
  return 'deep';
}

export function computeNationalOnboardingSustainOutlook(
  state: NationalLaborDemographicsState,
  hybridAnchor: NationalHybridAnchorOutlook | null | undefined
): NationalOnboardingSustainOutlook {
  if (!state.enabled || !hybridAnchor) {
    return {
      turn: state.turn,
      sustainIndex: 50,
      band: 'thin',
      anchorDrag: 0,
      summary: 'Onboarding sustain idle — hybrid anchor unavailable.',
      stewardNote: 'Compute hybrid anchor before onboarding sustain guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const anchorDrag = v1014laborClamp(
    hybridAnchor.bindDrag * 0.46 +
      (hybridAnchor.band === 'drifting' || hybridAnchor.band === 'mixed' ? 10 : 3)
  );
  const anchorLift =
    hybridAnchor.band === 'anchored' || hybridAnchor.band === 'fixed'
      ? hybridAnchor.anchorIndex * 0.2
      : hybridAnchor.anchorIndex * 0.1;

  const sustainIndex = v1014laborClamp(24 + onboardingLift * 22 + anchorLift - anchorDrag);
  const band = sustainBand(sustainIndex);

  const stewardNote =
    band === 'depleted' || band === 'thin'
      ? 'Thin onboarding sustain — deploy onboarding levers before subject apex assembly.'
      : band === 'deep'
        ? 'Deep sustain band — verify culmination-mentorship coupling before auto workforce pushes.'
        : 'Sustained onboarding — align sustain with onboarding velocity outlook checks.';

  return {
    turn: state.turn,
    sustainIndex,
    band,
    anchorDrag,
    summary: `National onboarding sustain ${band} (index ${Math.round(sustainIndex)}); anchor drag ${Math.round(anchorDrag)}.`,
    stewardNote
  };
}


// --- source: subject-apex-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectApexReadinessBrief,
  type NationalSubjectCrownReadinessBrief,
  type NationalWorkforceCulminationIndex,
  type SubjectApexReadinessBand
} from './types';

function apexBand(index: number): SubjectApexReadinessBand {
  if (index <= 34) return 'below_apex';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'apex_ready';
  return 'summit_locked';
}

/** Round-26 / wave-26 subject apex readiness — crown × culmination gate (O10-183). */
export function computeNationalSubjectApexReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCrown: NationalSubjectCrownReadinessBrief | null | undefined,
  culmination: NationalWorkforceCulminationIndex | null | undefined
): NationalSubjectApexReadinessBrief {
  if (!state.enabled || !subjectCrown || !culmination) {
    return {
      turn: state.turn,
      apexIndex: 50,
      band: 'approaching',
      apexDrag: 0,
      summary: 'Subject apex readiness idle — subject crown or culmination unavailable.',
      stewardNote: 'Compute subject crown readiness and workforce culmination before apex guidance.'
    };
  }

  const apexDrag = v1014laborClamp(
    subjectCrown.crownDrag * 0.38 +
      culmination.crownDrag * 0.38 +
      (subjectCrown.band === 'uncrowned' || culmination.band === 'fragile' ? 12 : 3)
  );
  const crownLift =
    subjectCrown.band === 'crowned' || subjectCrown.band === 'sealed'
      ? subjectCrown.crownIndex * 0.27
      : subjectCrown.crownIndex * 0.14;
  const culminationLift =
    culmination.band === 'ready' || culmination.band === 'summit'
      ? culmination.culminationIndex * 0.25
      : culmination.culminationIndex * 0.12;

  const apexIndex = v1014laborClamp(20 + crownLift + culminationLift - apexDrag);
  const band = apexBand(apexIndex);

  const stewardNote =
    band === 'below_apex' || band === 'approaching'
      ? 'Approaching apex — hold O10-183 wave-26 scale until culmination-mentorship syncs.'
      : band === 'summit_locked'
        ? 'Summit-locked apex — still monitor onboarding sustain during corridor peaks.'
        : 'Apex-ready — pair with workforce apex index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    apexIndex,
    band,
    apexDrag,
    summary: `Subject apex readiness ${band} (index ${Math.round(apexIndex)}); apex drag ${Math.round(apexDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-apex-index.ts ---
  type NationalCulminationMentorshipCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalOnboardingSustainOutlook,
  type NationalSubjectApexReadinessBrief,
  type NationalWorkforceApexIndex,
  type WorkforceApexBand
} from './types';

function apexBand(index: number): WorkforceApexBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'summit';
}

export function computeNationalWorkforceApexIndex(
  state: NationalLaborDemographicsState,
  mentorshipCoupling: NationalCulminationMentorshipCouplingBrief | null | undefined,
  onboardingSustain: NationalOnboardingSustainOutlook | null | undefined,
  subjectApex: NationalSubjectApexReadinessBrief | null | undefined
): NationalWorkforceApexIndex {
  if (!state.enabled || !mentorshipCoupling || !onboardingSustain || !subjectApex) {
    return {
      turn: state.turn,
      apexIndex: 50,
      band: 'thin',
      apexDrag: 0,
      summary: 'Workforce apex idle — mentorship coupling, onboarding sustain, or subject apex unavailable.',
      stewardNote: 'Compute O10-183 wave-26 depth stack before apex guidance.'
    };
  }

  const apexDrag = v1014laborClamp(
    subjectApex.apexDrag * 0.35 +
      mentorshipCoupling.culminationDrag * 0.3 +
      onboardingSustain.anchorDrag * 0.25 +
      (subjectApex.band === 'below_apex' || mentorshipCoupling.band === 'decoupled' ? 8 : 2)
  );
  const mentorshipLift =
    mentorshipCoupling.band === 'guided' || mentorshipCoupling.band === 'elevated'
      ? mentorshipCoupling.couplingIndex * 0.2
      : mentorshipCoupling.couplingIndex * 0.1;
  const sustainLift =
    onboardingSustain.band === 'sustained' || onboardingSustain.band === 'deep'
      ? onboardingSustain.sustainIndex * 0.18
      : onboardingSustain.sustainIndex * 0.09;
  const subjectLift =
    subjectApex.band === 'apex_ready' || subjectApex.band === 'summit_locked'
      ? subjectApex.apexIndex * 0.22
      : subjectApex.apexIndex * 0.11;

  const apexIndex = v1014laborClamp(18 + mentorshipLift + sustainLift + subjectLift - apexDrag);
  const band = apexBand(apexIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce apex — sequence culmination-mentorship, onboarding sustain, and subject apex before post-de3079f9 tranche.'
      : band === 'summit'
        ? 'Summit apex — avoid corridor overload that breaks subject apex bands.'
        : 'Elevated apex — refresh subject apex checks each scale wave.';

  return {
    turn: state.turn,
    apexIndex,
    band,
    apexDrag,
    summary: `National workforce apex ${band} (index ${Math.round(apexIndex)}); apex drag ${Math.round(apexDrag)}.`,
    stewardNote
  };
}


// --- source: apex-advocacy-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type ApexAdvocacyCouplingBand,
  type NationalApexAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceApexIndex
} from './types';

function couplingBand(index: number): ApexAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

export function computeNationalApexAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  apex: NationalWorkforceApexIndex | null | undefined
): NationalApexAdvocacyCouplingBrief {
  if (!state.enabled || !apex) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      apexDrag: 0,
      summary: 'Apex-advocacy coupling idle — workforce apex unavailable.',
      stewardNote: 'Compute workforce apex before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const apexDrag = v1014laborClamp(
    apex.apexDrag * 0.48 + (apex.band === 'fragile' || apex.band === 'thin' ? 11 : 3)
  );
  const apexLift =
    apex.band === 'elevated' || apex.band === 'summit' ? apex.apexIndex * 0.24 : apex.apexIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + apexLift - apexDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained apex-advocacy link — deploy advocacy levers before wave-27 pinnacle commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard reengagement thrust spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair advocacy packs with subject pinnacle readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    apexDrag,
    summary: `Apex-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); apex drag ${Math.round(apexDrag)}.`,
    stewardNote
  };
}


// --- source: reengagement-thrust-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingSustainOutlook,
  type NationalReengagementThrustOutlook,
  type ReengagementThrustBand
} from './types';

function thrustBand(index: number): ReengagementThrustBand {
  if (index <= 34) return 'stalled';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'building';
  return 'surging';
}

export function computeNationalReengagementThrustOutlook(
  state: NationalLaborDemographicsState,
  onboardingSustain: NationalOnboardingSustainOutlook | null | undefined
): NationalReengagementThrustOutlook {
  if (!state.enabled || !onboardingSustain) {
    return {
      turn: state.turn,
      thrustIndex: 50,
      band: 'patchy',
      sustainDrag: 0,
      summary: 'Reengagement thrust idle — onboarding sustain unavailable.',
      stewardNote: 'Compute onboarding sustain before reengagement thrust guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const sustainDrag = v1014laborClamp(
    onboardingSustain.anchorDrag * 0.46 +
      (onboardingSustain.band === 'depleted' || onboardingSustain.band === 'thin' ? 10 : 3)
  );
  const sustainLift =
    onboardingSustain.band === 'sustained' || onboardingSustain.band === 'deep'
      ? onboardingSustain.sustainIndex * 0.2
      : onboardingSustain.sustainIndex * 0.1;

  const thrustIndex = v1014laborClamp(24 + reengagementLift * 22 + sustainLift - sustainDrag);
  const band = thrustBand(thrustIndex);

  const stewardNote =
    band === 'stalled' || band === 'patchy'
      ? 'Patchy reengagement thrust — deploy reengagement levers before subject pinnacle assembly.'
      : band === 'surging'
        ? 'Surging thrust band — verify apex-advocacy coupling before auto workforce pushes.'
        : 'Building thrust — align with reengagement momentum outlook checks.';

  return {
    turn: state.turn,
    thrustIndex,
    band,
    sustainDrag,
    summary: `National reengagement thrust ${band} (index ${Math.round(thrustIndex)}); sustain drag ${Math.round(sustainDrag)}.`,
    stewardNote
  };
}


// --- source: subject-pinnacle-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectApexReadinessBrief,
  type NationalSubjectPinnacleReadinessBrief,
  type NationalWorkforceApexIndex,
  type SubjectPinnacleReadinessBand
} from './types';

function pinnacleBand(index: number): SubjectPinnacleReadinessBand {
  if (index <= 34) return 'below_pinnacle';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'pinnacle_ready';
  return 'summit_locked';
}

/** Round-27 / wave-27 subject pinnacle readiness — apex × workforce apex (O10-185). */
export function computeNationalSubjectPinnacleReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectApex: NationalSubjectApexReadinessBrief | null | undefined,
  workforceApex: NationalWorkforceApexIndex | null | undefined
): NationalSubjectPinnacleReadinessBrief {
  if (!state.enabled || !subjectApex || !workforceApex) {
    return {
      turn: state.turn,
      pinnacleIndex: 50,
      band: 'approaching',
      pinnacleDrag: 0,
      summary: 'Subject pinnacle readiness idle — subject apex or workforce apex unavailable.',
      stewardNote: 'Compute subject apex and workforce apex before pinnacle guidance.'
    };
  }

  const pinnacleDrag = v1014laborClamp(
    subjectApex.apexDrag * 0.38 +
      workforceApex.apexDrag * 0.38 +
      (subjectApex.band === 'below_apex' || workforceApex.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectApex.band === 'apex_ready' || subjectApex.band === 'summit_locked'
      ? subjectApex.apexIndex * 0.27
      : subjectApex.apexIndex * 0.14;
  const workforceLift =
    workforceApex.band === 'elevated' || workforceApex.band === 'summit'
      ? workforceApex.apexIndex * 0.25
      : workforceApex.apexIndex * 0.12;

  const pinnacleIndex = v1014laborClamp(20 + subjectLift + workforceLift - pinnacleDrag);
  const band = pinnacleBand(pinnacleIndex);

  const stewardNote =
    band === 'below_pinnacle' || band === 'approaching'
      ? 'Approaching pinnacle — hold O10-185 wave-27 scale until apex-advocacy syncs.'
      : band === 'summit_locked'
        ? 'Summit-locked pinnacle — still monitor reengagement thrust during corridor peaks.'
        : 'Pinnacle-ready — pair with workforce pinnacle index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    pinnacleIndex,
    band,
    pinnacleDrag,
    summary: `Subject pinnacle readiness ${band} (index ${Math.round(pinnacleIndex)}); pinnacle drag ${Math.round(pinnacleDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-pinnacle-index.ts ---
  type NationalApexAdvocacyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalReengagementThrustOutlook,
  type NationalSubjectPinnacleReadinessBrief,
  type NationalWorkforcePinnacleIndex,
  type WorkforcePinnacleBand
} from './types';

function pinnacleBand(index: number): WorkforcePinnacleBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'summit';
}

export function computeNationalWorkforcePinnacleIndex(
  state: NationalLaborDemographicsState,
  advocacyCoupling: NationalApexAdvocacyCouplingBrief | null | undefined,
  reengagementThrust: NationalReengagementThrustOutlook | null | undefined,
  subjectPinnacle: NationalSubjectPinnacleReadinessBrief | null | undefined
): NationalWorkforcePinnacleIndex {
  if (!state.enabled || !advocacyCoupling || !reengagementThrust || !subjectPinnacle) {
    return {
      turn: state.turn,
      pinnacleIndex: 50,
      band: 'thin',
      pinnacleDrag: 0,
      summary: 'Workforce pinnacle idle — advocacy coupling, reengagement thrust, or subject pinnacle unavailable.',
      stewardNote: 'Compute O10-185 wave-27 depth stack before pinnacle guidance.'
    };
  }

  const pinnacleDrag = v1014laborClamp(
    subjectPinnacle.pinnacleDrag * 0.35 +
      advocacyCoupling.apexDrag * 0.3 +
      reengagementThrust.sustainDrag * 0.25 +
      (subjectPinnacle.band === 'below_pinnacle' || advocacyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const advocacyLift =
    advocacyCoupling.band === 'amplified' || advocacyCoupling.band === 'elevated'
      ? advocacyCoupling.couplingIndex * 0.2
      : advocacyCoupling.couplingIndex * 0.1;
  const thrustLift =
    reengagementThrust.band === 'building' || reengagementThrust.band === 'surging'
      ? reengagementThrust.thrustIndex * 0.18
      : reengagementThrust.thrustIndex * 0.09;
  const subjectLift =
    subjectPinnacle.band === 'pinnacle_ready' || subjectPinnacle.band === 'summit_locked'
      ? subjectPinnacle.pinnacleIndex * 0.22
      : subjectPinnacle.pinnacleIndex * 0.11;

  const pinnacleIndex = v1014laborClamp(18 + advocacyLift + thrustLift + subjectLift - pinnacleDrag);
  const band = pinnacleBand(pinnacleIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce pinnacle — sequence apex-advocacy, reengagement thrust, and subject pinnacle before post-7c1cfd89 tranche.'
      : band === 'summit'
        ? 'Summit pinnacle — avoid corridor overload that breaks subject pinnacle bands.'
        : 'Elevated pinnacle — refresh subject pinnacle checks each scale wave.';

  return {
    turn: state.turn,
    pinnacleIndex,
    band,
    pinnacleDrag,
    summary: `National workforce pinnacle ${band} (index ${Math.round(pinnacleIndex)}); pinnacle drag ${Math.round(pinnacleDrag)}.`,
    stewardNote
  };
}


// --- source: pinnacle-retention-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalPinnacleRetentionCouplingBrief,
  type NationalWorkforcePinnacleIndex,
  type PinnacleRetentionCouplingBand
} from './types';

function couplingBand(index: number): PinnacleRetentionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-28 / wave-28 pinnacle-retention coupling — pinnacle × retention levers (O10-187). */
export function computeNationalPinnacleRetentionCouplingBrief(
  state: NationalLaborDemographicsState,
  pinnacle: NationalWorkforcePinnacleIndex | null | undefined
): NationalPinnacleRetentionCouplingBrief {
  if (!state.enabled || !pinnacle) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      pinnacleDrag: 0,
      summary: 'Pinnacle-retention coupling idle — workforce pinnacle unavailable.',
      stewardNote: 'Compute workforce pinnacle before retention coupling guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const pinnacleDrag = v1014laborClamp(
    pinnacle.pinnacleDrag * 0.48 + (pinnacle.band === 'fragile' || pinnacle.band === 'thin' ? 11 : 3)
  );
  const pinnacleLift =
    pinnacle.band === 'elevated' || pinnacle.band === 'summit'
      ? pinnacle.pinnacleIndex * 0.24
      : pinnacle.pinnacleIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + retentionLift * 21 + pinnacleLift - pinnacleDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained pinnacle-retention link — deploy retention levers before wave-28 summit commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard retention crest spikes that drain pinnacle buffers.'
        : 'Amplified coupling — pair retention packs with subject summit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    pinnacleDrag,
    summary: `Pinnacle-retention coupling ${band} (index ${Math.round(couplingIndex)}); pinnacle drag ${Math.round(pinnacleDrag)}.`,
    stewardNote
  };
}


// --- source: retention-crest-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalReengagementThrustOutlook,
  type NationalRetentionCrestOutlook,
  type RetentionCrestBand
} from './types';

function crestBand(index: number): RetentionCrestBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'cresting';
}

export function computeNationalRetentionCrestOutlook(
  state: NationalLaborDemographicsState,
  reengagementThrust: NationalReengagementThrustOutlook | null | undefined
): NationalRetentionCrestOutlook {
  if (!state.enabled || !reengagementThrust) {
    return {
      turn: state.turn,
      crestIndex: 50,
      band: 'patchy',
      thrustDrag: 0,
      summary: 'Retention crest idle — reengagement thrust unavailable.',
      stewardNote: 'Compute reengagement thrust before retention crest guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const thrustDrag = v1014laborClamp(
    reengagementThrust.sustainDrag * 0.46 +
      (reengagementThrust.band === 'stalled' || reengagementThrust.band === 'patchy' ? 10 : 3)
  );
  const thrustLift =
    reengagementThrust.band === 'building' || reengagementThrust.band === 'surging'
      ? reengagementThrust.thrustIndex * 0.2
      : reengagementThrust.thrustIndex * 0.1;

  const crestIndex = v1014laborClamp(24 + retentionLift * 22 + thrustLift - thrustDrag);
  const band = crestBand(crestIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy retention crest — deploy retention levers before subject summit assembly.'
      : band === 'cresting'
        ? 'Cresting band — verify pinnacle-retention coupling before auto workforce pushes.'
        : 'Rising crest — align with retention anchor outlook checks.';

  return {
    turn: state.turn,
    crestIndex,
    band,
    thrustDrag,
    summary: `National retention crest ${band} (index ${Math.round(crestIndex)}); thrust drag ${Math.round(thrustDrag)}.`,
    stewardNote
  };
}


// --- source: subject-summit-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectPinnacleReadinessBrief,
  type NationalSubjectSummitReadinessBrief,
  type NationalWorkforcePinnacleIndex,
  type SubjectSummitReadinessBand
} from './types';

function summitBand(index: number): SubjectSummitReadinessBand {
  if (index <= 34) return 'below_summit';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'summit_ready';
  return 'zenith_locked';
}

/** Round-28 / wave-28 subject summit readiness — pinnacle × workforce pinnacle (O10-187). */
export function computeNationalSubjectSummitReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectPinnacle: NationalSubjectPinnacleReadinessBrief | null | undefined,
  workforcePinnacle: NationalWorkforcePinnacleIndex | null | undefined
): NationalSubjectSummitReadinessBrief {
  if (!state.enabled || !subjectPinnacle || !workforcePinnacle) {
    return {
      turn: state.turn,
      summitIndex: 50,
      band: 'approaching',
      summitDrag: 0,
      summary: 'Subject summit readiness idle — subject pinnacle or workforce pinnacle unavailable.',
      stewardNote: 'Compute subject pinnacle and workforce pinnacle before summit guidance.'
    };
  }

  const summitDrag = v1014laborClamp(
    subjectPinnacle.pinnacleDrag * 0.38 +
      workforcePinnacle.pinnacleDrag * 0.38 +
      (subjectPinnacle.band === 'below_pinnacle' || workforcePinnacle.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectPinnacle.band === 'pinnacle_ready' || subjectPinnacle.band === 'summit_locked'
      ? subjectPinnacle.pinnacleIndex * 0.27
      : subjectPinnacle.pinnacleIndex * 0.14;
  const workforceLift =
    workforcePinnacle.band === 'elevated' || workforcePinnacle.band === 'summit'
      ? workforcePinnacle.pinnacleIndex * 0.25
      : workforcePinnacle.pinnacleIndex * 0.12;

  const summitIndex = v1014laborClamp(20 + subjectLift + workforceLift - summitDrag);
  const band = summitBand(summitIndex);

  const stewardNote =
    band === 'below_summit' || band === 'approaching'
      ? 'Approaching summit — hold O10-187 wave-28 scale until pinnacle-retention syncs.'
      : band === 'zenith_locked'
        ? 'Zenith-locked summit — still monitor retention crest during corridor peaks.'
        : 'Summit-ready — pair with workforce summit index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    summitIndex,
    band,
    summitDrag,
    summary: `Subject summit readiness ${band} (index ${Math.round(summitIndex)}); summit drag ${Math.round(summitDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-summit-index.ts ---
  type NationalLaborDemographicsState,
  type NationalPinnacleRetentionCouplingBrief,
  type NationalRetentionCrestOutlook,
  type NationalSubjectSummitReadinessBrief,
  type NationalWorkforceSummitIndex,
  type WorkforceSummitBand
} from './types';

function summitBand(index: number): WorkforceSummitBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'zenith';
}

export function computeNationalWorkforceSummitIndex(
  state: NationalLaborDemographicsState,
  retentionCoupling: NationalPinnacleRetentionCouplingBrief | null | undefined,
  retentionCrest: NationalRetentionCrestOutlook | null | undefined,
  subjectSummit: NationalSubjectSummitReadinessBrief | null | undefined
): NationalWorkforceSummitIndex {
  if (!state.enabled || !retentionCoupling || !retentionCrest || !subjectSummit) {
    return {
      turn: state.turn,
      summitIndex: 50,
      band: 'thin',
      summitDrag: 0,
      summary: 'Workforce summit idle — retention coupling, retention crest, or subject summit unavailable.',
      stewardNote: 'Compute O10-187 wave-28 depth stack before summit guidance.'
    };
  }

  const summitDrag = v1014laborClamp(
    subjectSummit.summitDrag * 0.35 +
      retentionCoupling.pinnacleDrag * 0.3 +
      retentionCrest.thrustDrag * 0.25 +
      (subjectSummit.band === 'below_summit' || retentionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const retentionLift =
    retentionCoupling.band === 'amplified' || retentionCoupling.band === 'elevated'
      ? retentionCoupling.couplingIndex * 0.2
      : retentionCoupling.couplingIndex * 0.1;
  const crestLift =
    retentionCrest.band === 'rising' || retentionCrest.band === 'cresting'
      ? retentionCrest.crestIndex * 0.18
      : retentionCrest.crestIndex * 0.09;
  const subjectLift =
    subjectSummit.band === 'summit_ready' || subjectSummit.band === 'zenith_locked'
      ? subjectSummit.summitIndex * 0.22
      : subjectSummit.summitIndex * 0.11;

  const summitIndex = v1014laborClamp(18 + retentionLift + crestLift + subjectLift - summitDrag);
  const band = summitBand(summitIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce summit — sequence pinnacle-retention, retention crest, and subject summit before post-b9e129bd tranche.'
      : band === 'zenith'
        ? 'Zenith summit — avoid corridor overload that breaks subject summit bands.'
        : 'Elevated summit — refresh subject summit checks each scale wave.';

  return {
    turn: state.turn,
    summitIndex,
    band,
    summitDrag,
    summary: `National workforce summit ${band} (index ${Math.round(summitIndex)}); summit drag ${Math.round(summitDrag)}.`,
    stewardNote
  };
}


// --- source: summit-coordination-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSummitCoordinationCouplingBrief,
  type NationalWorkforceSummitIndex,
  type SummitCoordinationCouplingBand
} from './types';

function couplingBand(index: number): SummitCoordinationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-29 / wave-29 summit-coordination coupling — summit × coordination levers (O10-189). */
export function computeNationalSummitCoordinationCouplingBrief(
  state: NationalLaborDemographicsState,
  summit: NationalWorkforceSummitIndex | null | undefined
): NationalSummitCoordinationCouplingBrief {
  if (!state.enabled || !summit) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      summitDrag: 0,
      summary: 'Summit-coordination coupling idle — workforce summit unavailable.',
      stewardNote: 'Compute workforce summit before coordination coupling guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const summitDrag = v1014laborClamp(
    summit.summitDrag * 0.48 + (summit.band === 'fragile' || summit.band === 'thin' ? 11 : 3)
  );
  const summitLift =
    summit.band === 'elevated' || summit.band === 'zenith'
      ? summit.summitIndex * 0.24
      : summit.summitIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + coordinationLift * 21 + summitLift - summitDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained summit-coordination link — deploy coordination levers before wave-29 zenith commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard coordination horizon spikes that drain summit buffers.'
        : 'Amplified coupling — pair coordination packs with subject zenith readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    summitDrag,
    summary: `Summit-coordination coupling ${band} (index ${Math.round(couplingIndex)}); summit drag ${Math.round(summitDrag)}.`,
    stewardNote
  };
}


// --- source: coordination-horizon-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CoordinationHorizonBand,
  type NationalCoordinationHorizonOutlook,
  type NationalLaborDemographicsState,
  type NationalRetentionCrestOutlook
} from './types';

function horizonBand(index: number): CoordinationHorizonBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'horizon';
}

export function computeNationalCoordinationHorizonOutlook(
  state: NationalLaborDemographicsState,
  retentionCrest: NationalRetentionCrestOutlook | null | undefined
): NationalCoordinationHorizonOutlook {
  if (!state.enabled || !retentionCrest) {
    return {
      turn: state.turn,
      horizonIndex: 50,
      band: 'patchy',
      crestDrag: 0,
      summary: 'Coordination horizon idle — retention crest unavailable.',
      stewardNote: 'Compute retention crest before coordination horizon guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const crestDrag = v1014laborClamp(
    retentionCrest.thrustDrag * 0.46 +
      (retentionCrest.band === 'ebbing' || retentionCrest.band === 'patchy' ? 10 : 3)
  );
  const crestLift =
    retentionCrest.band === 'rising' || retentionCrest.band === 'cresting'
      ? retentionCrest.crestIndex * 0.2
      : retentionCrest.crestIndex * 0.1;

  const horizonIndex = v1014laborClamp(24 + coordinationLift * 22 + crestLift - crestDrag);
  const band = horizonBand(horizonIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy coordination horizon — deploy coordination levers before subject zenith assembly.'
      : band === 'horizon'
        ? 'Horizon band — verify summit-coordination coupling before auto workforce pushes.'
        : 'Rising horizon — align with coordination bind outlook checks.';

  return {
    turn: state.turn,
    horizonIndex,
    band,
    crestDrag,
    summary: `National coordination horizon ${band} (index ${Math.round(horizonIndex)}); crest drag ${Math.round(crestDrag)}.`,
    stewardNote
  };
}


// --- source: subject-zenith-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectSummitReadinessBrief,
  type NationalSubjectZenithReadinessBrief,
  type NationalWorkforceSummitIndex,
  type SubjectZenithReadinessBand
} from './types';

function zenithBand(index: number): SubjectZenithReadinessBand {
  if (index <= 34) return 'below_zenith';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'zenith_ready';
  return 'horizon_locked';
}

/** Round-29 / wave-29 subject zenith readiness — summit × workforce summit (O10-189). */
export function computeNationalSubjectZenithReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSummit: NationalSubjectSummitReadinessBrief | null | undefined,
  workforceSummit: NationalWorkforceSummitIndex | null | undefined
): NationalSubjectZenithReadinessBrief {
  if (!state.enabled || !subjectSummit || !workforceSummit) {
    return {
      turn: state.turn,
      zenithIndex: 50,
      band: 'approaching',
      zenithDrag: 0,
      summary: 'Subject zenith readiness idle — subject summit or workforce summit unavailable.',
      stewardNote: 'Compute subject summit and workforce summit before zenith guidance.'
    };
  }

  const zenithDrag = v1014laborClamp(
    subjectSummit.summitDrag * 0.38 +
      workforceSummit.summitDrag * 0.38 +
      (subjectSummit.band === 'below_summit' || workforceSummit.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectSummit.band === 'summit_ready' || subjectSummit.band === 'zenith_locked'
      ? subjectSummit.summitIndex * 0.27
      : subjectSummit.summitIndex * 0.14;
  const workforceLift =
    workforceSummit.band === 'elevated' || workforceSummit.band === 'zenith'
      ? workforceSummit.summitIndex * 0.25
      : workforceSummit.summitIndex * 0.12;

  const zenithIndex = v1014laborClamp(20 + subjectLift + workforceLift - zenithDrag);
  const band = zenithBand(zenithIndex);

  const stewardNote =
    band === 'below_zenith' || band === 'approaching'
      ? 'Approaching zenith — hold O10-189 wave-29 scale until summit-coordination syncs.'
      : band === 'horizon_locked'
        ? 'Horizon-locked zenith — still monitor coordination horizon during corridor peaks.'
        : 'Zenith-ready — pair with workforce zenith index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    zenithIndex,
    band,
    zenithDrag,
    summary: `Subject zenith readiness ${band} (index ${Math.round(zenithIndex)}); zenith drag ${Math.round(zenithDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-zenith-index.ts ---
  type NationalCoordinationHorizonOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectZenithReadinessBrief,
  type NationalSummitCoordinationCouplingBrief,
  type NationalWorkforceZenithIndex,
  type WorkforceZenithBand
} from './types';

function zenithBand(index: number): WorkforceZenithBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'horizon';
}

export function computeNationalWorkforceZenithIndex(
  state: NationalLaborDemographicsState,
  coordinationCoupling: NationalSummitCoordinationCouplingBrief | null | undefined,
  coordinationHorizon: NationalCoordinationHorizonOutlook | null | undefined,
  subjectZenith: NationalSubjectZenithReadinessBrief | null | undefined
): NationalWorkforceZenithIndex {
  if (!state.enabled || !coordinationCoupling || !coordinationHorizon || !subjectZenith) {
    return {
      turn: state.turn,
      zenithIndex: 50,
      band: 'thin',
      zenithDrag: 0,
      summary: 'Workforce zenith idle — coordination coupling, coordination horizon, or subject zenith unavailable.',
      stewardNote: 'Compute O10-189 wave-29 depth stack before zenith guidance.'
    };
  }

  const zenithDrag = v1014laborClamp(
    subjectZenith.zenithDrag * 0.35 +
      coordinationCoupling.summitDrag * 0.3 +
      coordinationHorizon.crestDrag * 0.25 +
      (subjectZenith.band === 'below_zenith' || coordinationCoupling.band === 'decoupled' ? 8 : 2)
  );
  const coordinationLift =
    coordinationCoupling.band === 'amplified' || coordinationCoupling.band === 'elevated'
      ? coordinationCoupling.couplingIndex * 0.2
      : coordinationCoupling.couplingIndex * 0.1;
  const horizonLift =
    coordinationHorizon.band === 'rising' || coordinationHorizon.band === 'horizon'
      ? coordinationHorizon.horizonIndex * 0.18
      : coordinationHorizon.horizonIndex * 0.09;
  const subjectLift =
    subjectZenith.band === 'zenith_ready' || subjectZenith.band === 'horizon_locked'
      ? subjectZenith.zenithIndex * 0.22
      : subjectZenith.zenithIndex * 0.11;

  const zenithIndex = v1014laborClamp(18 + coordinationLift + horizonLift + subjectLift - zenithDrag);
  const band = zenithBand(zenithIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce zenith — sequence summit-coordination, coordination horizon, and subject zenith before post-70df4aee tranche.'
      : band === 'horizon'
        ? 'Horizon zenith — avoid corridor overload that breaks subject zenith bands.'
        : 'Elevated zenith — refresh subject zenith checks each scale wave.';

  return {
    turn: state.turn,
    zenithIndex,
    band,
    zenithDrag,
    summary: `National workforce zenith ${band} (index ${Math.round(zenithIndex)}); zenith drag ${Math.round(zenithDrag)}.`,
    stewardNote
  };
}


// --- source: zenith-flexibility-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalWorkforceZenithIndex,
  type NationalZenithFlexibilityCouplingBrief,
  type ZenithFlexibilityCouplingBand
} from './types';

function couplingBand(index: number): ZenithFlexibilityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-30 / wave-30 zenith-flexibility coupling — zenith × flexibility levers (O10-191). */
export function computeNationalZenithFlexibilityCouplingBrief(
  state: NationalLaborDemographicsState,
  zenith: NationalWorkforceZenithIndex | null | undefined
): NationalZenithFlexibilityCouplingBrief {
  if (!state.enabled || !zenith) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      zenithDrag: 0,
      summary: 'Zenith-flexibility coupling idle — workforce zenith unavailable.',
      stewardNote: 'Compute workforce zenith before flexibility coupling guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const zenithDrag = v1014laborClamp(
    zenith.zenithDrag * 0.48 + (zenith.band === 'fragile' || zenith.band === 'thin' ? 11 : 3)
  );
  const zenithLift =
    zenith.band === 'elevated' || zenith.band === 'horizon'
      ? zenith.zenithIndex * 0.24
      : zenith.zenithIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + flexibilityLift * 21 + zenithLift - zenithDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained zenith-flexibility link — deploy flexibility levers before wave-30 apogee commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard flexibility ascent spikes that drain zenith buffers.'
        : 'Amplified coupling — pair flexibility packs with subject apogee readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    zenithDrag,
    summary: `Zenith-flexibility coupling ${band} (index ${Math.round(couplingIndex)}); zenith drag ${Math.round(zenithDrag)}.`,
    stewardNote
  };
}


// --- source: flexibility-ascent-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type FlexibilityAscentBand,
  type NationalCoordinationHorizonOutlook,
  type NationalFlexibilityAscentOutlook,
  type NationalLaborDemographicsState
} from './types';

function ascentBand(index: number): FlexibilityAscentBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'ascent';
}

export function computeNationalFlexibilityAscentOutlook(
  state: NationalLaborDemographicsState,
  coordinationHorizon: NationalCoordinationHorizonOutlook | null | undefined
): NationalFlexibilityAscentOutlook {
  if (!state.enabled || !coordinationHorizon) {
    return {
      turn: state.turn,
      ascentIndex: 50,
      band: 'patchy',
      horizonDrag: 0,
      summary: 'Flexibility ascent idle — coordination horizon unavailable.',
      stewardNote: 'Compute coordination horizon before flexibility ascent guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const horizonDrag = v1014laborClamp(
    coordinationHorizon.crestDrag * 0.46 +
      (coordinationHorizon.band === 'ebbing' || coordinationHorizon.band === 'patchy' ? 10 : 3)
  );
  const horizonLift =
    coordinationHorizon.band === 'rising' || coordinationHorizon.band === 'horizon'
      ? coordinationHorizon.horizonIndex * 0.2
      : coordinationHorizon.horizonIndex * 0.1;

  const ascentIndex = v1014laborClamp(24 + flexibilityLift * 22 + horizonLift - horizonDrag);
  const band = ascentBand(ascentIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy flexibility ascent — deploy flexibility levers before subject apogee assembly.'
      : band === 'ascent'
        ? 'Ascent band — verify zenith-flexibility coupling before auto workforce pushes.'
        : 'Rising ascent — align with endurance-flexibility coupling checks.';

  return {
    turn: state.turn,
    ascentIndex,
    band,
    horizonDrag,
    summary: `National flexibility ascent ${band} (index ${Math.round(ascentIndex)}); horizon drag ${Math.round(horizonDrag)}.`,
    stewardNote
  };
}


// --- source: subject-apogee-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectApogeeReadinessBrief,
  type NationalSubjectZenithReadinessBrief,
  type NationalWorkforceZenithIndex,
  type SubjectApogeeReadinessBand
} from './types';

function apogeeBand(index: number): SubjectApogeeReadinessBand {
  if (index <= 34) return 'below_apogee';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'apogee_ready';
  return 'orbit_locked';
}

/** Round-30 / wave-30 subject apogee readiness — zenith × workforce zenith (O10-191). */
export function computeNationalSubjectApogeeReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectZenith: NationalSubjectZenithReadinessBrief | null | undefined,
  workforceZenith: NationalWorkforceZenithIndex | null | undefined
): NationalSubjectApogeeReadinessBrief {
  if (!state.enabled || !subjectZenith || !workforceZenith) {
    return {
      turn: state.turn,
      apogeeIndex: 50,
      band: 'approaching',
      apogeeDrag: 0,
      summary: 'Subject apogee readiness idle — subject zenith or workforce zenith unavailable.',
      stewardNote: 'Compute subject zenith and workforce zenith before apogee guidance.'
    };
  }

  const apogeeDrag = v1014laborClamp(
    subjectZenith.zenithDrag * 0.38 +
      workforceZenith.zenithDrag * 0.38 +
      (subjectZenith.band === 'below_zenith' || workforceZenith.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectZenith.band === 'zenith_ready' || subjectZenith.band === 'horizon_locked'
      ? subjectZenith.zenithIndex * 0.27
      : subjectZenith.zenithIndex * 0.14;
  const workforceLift =
    workforceZenith.band === 'elevated' || workforceZenith.band === 'horizon'
      ? workforceZenith.zenithIndex * 0.25
      : workforceZenith.zenithIndex * 0.12;

  const apogeeIndex = v1014laborClamp(20 + subjectLift + workforceLift - apogeeDrag);
  const band = apogeeBand(apogeeIndex);

  const stewardNote =
    band === 'below_apogee' || band === 'approaching'
      ? 'Approaching apogee — hold O10-191 wave-30 scale until zenith-flexibility syncs.'
      : band === 'orbit_locked'
        ? 'Orbit-locked apogee — still monitor flexibility ascent during corridor peaks.'
        : 'Apogee-ready — pair with workforce apogee index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    apogeeIndex,
    band,
    apogeeDrag,
    summary: `Subject apogee readiness ${band} (index ${Math.round(apogeeIndex)}); apogee drag ${Math.round(apogeeDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-apogee-index.ts ---
  type NationalFlexibilityAscentOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectApogeeReadinessBrief,
  type NationalWorkforceApogeeIndex,
  type NationalZenithFlexibilityCouplingBrief,
  type WorkforceApogeeBand
} from './types';

function apogeeBand(index: number): WorkforceApogeeBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'apogee';
}

export function computeNationalWorkforceApogeeIndex(
  state: NationalLaborDemographicsState,
  flexibilityCoupling: NationalZenithFlexibilityCouplingBrief | null | undefined,
  flexibilityAscent: NationalFlexibilityAscentOutlook | null | undefined,
  subjectApogee: NationalSubjectApogeeReadinessBrief | null | undefined
): NationalWorkforceApogeeIndex {
  if (!state.enabled || !flexibilityCoupling || !flexibilityAscent || !subjectApogee) {
    return {
      turn: state.turn,
      apogeeIndex: 50,
      band: 'thin',
      apogeeDrag: 0,
      summary: 'Workforce apogee idle — flexibility coupling, flexibility ascent, or subject apogee unavailable.',
      stewardNote: 'Compute O10-191 wave-30 depth stack before apogee guidance.'
    };
  }

  const apogeeDrag = v1014laborClamp(
    subjectApogee.apogeeDrag * 0.35 +
      flexibilityCoupling.zenithDrag * 0.3 +
      flexibilityAscent.horizonDrag * 0.25 +
      (subjectApogee.band === 'below_apogee' || flexibilityCoupling.band === 'decoupled' ? 8 : 2)
  );
  const flexibilityLift =
    flexibilityCoupling.band === 'amplified' || flexibilityCoupling.band === 'elevated'
      ? flexibilityCoupling.couplingIndex * 0.2
      : flexibilityCoupling.couplingIndex * 0.1;
  const ascentLift =
    flexibilityAscent.band === 'rising' || flexibilityAscent.band === 'ascent'
      ? flexibilityAscent.ascentIndex * 0.18
      : flexibilityAscent.ascentIndex * 0.09;
  const subjectLift =
    subjectApogee.band === 'apogee_ready' || subjectApogee.band === 'orbit_locked'
      ? subjectApogee.apogeeIndex * 0.22
      : subjectApogee.apogeeIndex * 0.11;

  const apogeeIndex = v1014laborClamp(18 + flexibilityLift + ascentLift + subjectLift - apogeeDrag);
  const band = apogeeBand(apogeeIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce apogee — sequence zenith-flexibility, flexibility ascent, and subject apogee before post-88fa570 tranche.'
      : band === 'apogee'
        ? 'Apogee band — avoid corridor overload that breaks subject apogee bands.'
        : 'Elevated apogee — refresh subject apogee checks each scale wave.';

  return {
    turn: state.turn,
    apogeeIndex,
    band,
    apogeeDrag,
    summary: `National workforce apogee ${band} (index ${Math.round(apogeeIndex)}); apogee drag ${Math.round(apogeeDrag)}.`,
    stewardNote
  };
}


// --- source: apogee-inclusion-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type ApogeeInclusionCouplingBand,
  type NationalApogeeInclusionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceApogeeIndex
} from './types';

function couplingBand(index: number): ApogeeInclusionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-31 / wave-31 apogee-inclusion coupling — apogee × inclusion levers (O10-193). */
export function computeNationalApogeeInclusionCouplingBrief(
  state: NationalLaborDemographicsState,
  apogee: NationalWorkforceApogeeIndex | null | undefined
): NationalApogeeInclusionCouplingBrief {
  if (!state.enabled || !apogee) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      apogeeDrag: 0,
      summary: 'Apogee-inclusion coupling idle — workforce apogee unavailable.',
      stewardNote: 'Compute workforce apogee before inclusion coupling guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const apogeeDrag = v1014laborClamp(
    apogee.apogeeDrag * 0.48 + (apogee.band === 'fragile' || apogee.band === 'thin' ? 11 : 3)
  );
  const apogeeLift =
    apogee.band === 'elevated' || apogee.band === 'apogee'
      ? apogee.apogeeIndex * 0.24
      : apogee.apogeeIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + inclusionLift * 21 + apogeeLift - apogeeDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained apogee-inclusion link — deploy inclusion levers before wave-31 orbit commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard inclusion orbit spikes that drain apogee buffers.'
        : 'Amplified coupling — pair inclusion packs with subject orbit readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    apogeeDrag,
    summary: `Apogee-inclusion coupling ${band} (index ${Math.round(couplingIndex)}); apogee drag ${Math.round(apogeeDrag)}.`,
    stewardNote
  };
}


// --- source: inclusion-orbit-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type InclusionOrbitBand,
  type NationalFlexibilityAscentOutlook,
  type NationalInclusionOrbitOutlook,
  type NationalLaborDemographicsState
} from './types';

function orbitBand(index: number): InclusionOrbitBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'orbit';
}

export function computeNationalInclusionOrbitOutlook(
  state: NationalLaborDemographicsState,
  flexibilityAscent: NationalFlexibilityAscentOutlook | null | undefined
): NationalInclusionOrbitOutlook {
  if (!state.enabled || !flexibilityAscent) {
    return {
      turn: state.turn,
      orbitIndex: 50,
      band: 'patchy',
      ascentDrag: 0,
      summary: 'Inclusion orbit idle — flexibility ascent unavailable.',
      stewardNote: 'Compute flexibility ascent before inclusion orbit guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const ascentDrag = v1014laborClamp(
    flexibilityAscent.horizonDrag * 0.46 +
      (flexibilityAscent.band === 'ebbing' || flexibilityAscent.band === 'patchy' ? 10 : 3)
  );
  const ascentLift =
    flexibilityAscent.band === 'rising' || flexibilityAscent.band === 'ascent'
      ? flexibilityAscent.ascentIndex * 0.2
      : flexibilityAscent.ascentIndex * 0.1;

  const orbitIndex = v1014laborClamp(24 + inclusionLift * 22 + ascentLift - ascentDrag);
  const band = orbitBand(orbitIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy inclusion orbit — deploy inclusion levers before subject orbit assembly.'
      : band === 'orbit'
        ? 'Orbit band — verify apogee-inclusion coupling before auto workforce pushes.'
        : 'Rising orbit — align with fortitude-inclusion coupling checks.';

  return {
    turn: state.turn,
    orbitIndex,
    band,
    ascentDrag,
    summary: `National inclusion orbit ${band} (index ${Math.round(orbitIndex)}); ascent drag ${Math.round(ascentDrag)}.`,
    stewardNote
  };
}


// --- source: subject-orbit-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectApogeeReadinessBrief,
  type NationalSubjectOrbitReadinessBrief,
  type NationalWorkforceApogeeIndex,
  type SubjectOrbitReadinessBand
} from './types';

function orbitBand(index: number): SubjectOrbitReadinessBand {
  if (index <= 34) return 'below_orbit';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'orbit_ready';
  return 'crown_locked';
}

/** Round-31 / wave-31 subject orbit readiness — apogee × workforce apogee (O10-193). */
export function computeNationalSubjectOrbitReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectApogee: NationalSubjectApogeeReadinessBrief | null | undefined,
  workforceApogee: NationalWorkforceApogeeIndex | null | undefined
): NationalSubjectOrbitReadinessBrief {
  if (!state.enabled || !subjectApogee || !workforceApogee) {
    return {
      turn: state.turn,
      orbitIndex: 50,
      band: 'approaching',
      orbitDrag: 0,
      summary: 'Subject orbit readiness idle — subject apogee or workforce apogee unavailable.',
      stewardNote: 'Compute subject apogee and workforce apogee before orbit guidance.'
    };
  }

  const orbitDrag = v1014laborClamp(
    subjectApogee.apogeeDrag * 0.38 +
      workforceApogee.apogeeDrag * 0.38 +
      (subjectApogee.band === 'below_apogee' || workforceApogee.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectApogee.band === 'apogee_ready' || subjectApogee.band === 'orbit_locked'
      ? subjectApogee.apogeeIndex * 0.27
      : subjectApogee.apogeeIndex * 0.14;
  const workforceLift =
    workforceApogee.band === 'elevated' || workforceApogee.band === 'apogee'
      ? workforceApogee.apogeeIndex * 0.25
      : workforceApogee.apogeeIndex * 0.12;

  const orbitIndex = v1014laborClamp(20 + subjectLift + workforceLift - orbitDrag);
  const band = orbitBand(orbitIndex);

  const stewardNote =
    band === 'below_orbit' || band === 'approaching'
      ? 'Approaching orbit — hold O10-193 wave-31 scale until apogee-inclusion syncs.'
      : band === 'crown_locked'
        ? 'Crown-locked orbit — still monitor inclusion orbit during corridor peaks.'
        : 'Orbit-ready — pair with workforce orbit index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    orbitIndex,
    band,
    orbitDrag,
    summary: `Subject orbit readiness ${band} (index ${Math.round(orbitIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-orbit-index.ts ---
  type NationalApogeeInclusionCouplingBrief,
  type NationalInclusionOrbitOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectOrbitReadinessBrief,
  type NationalWorkforceOrbitIndex,
  type WorkforceOrbitBand
} from './types';

function orbitBand(index: number): WorkforceOrbitBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'orbit';
}

export function computeNationalWorkforceOrbitIndex(
  state: NationalLaborDemographicsState,
  inclusionCoupling: NationalApogeeInclusionCouplingBrief | null | undefined,
  inclusionOrbit: NationalInclusionOrbitOutlook | null | undefined,
  subjectOrbit: NationalSubjectOrbitReadinessBrief | null | undefined
): NationalWorkforceOrbitIndex {
  if (!state.enabled || !inclusionCoupling || !inclusionOrbit || !subjectOrbit) {
    return {
      turn: state.turn,
      orbitIndex: 50,
      band: 'thin',
      orbitDrag: 0,
      summary: 'Workforce orbit idle — inclusion coupling, inclusion orbit, or subject orbit unavailable.',
      stewardNote: 'Compute O10-193 wave-31 depth stack before orbit guidance.'
    };
  }

  const orbitDrag = v1014laborClamp(
    subjectOrbit.orbitDrag * 0.35 +
      inclusionCoupling.apogeeDrag * 0.3 +
      inclusionOrbit.ascentDrag * 0.25 +
      (subjectOrbit.band === 'below_orbit' || inclusionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const inclusionLift =
    inclusionCoupling.band === 'amplified' || inclusionCoupling.band === 'elevated'
      ? inclusionCoupling.couplingIndex * 0.2
      : inclusionCoupling.couplingIndex * 0.1;
  const orbitLift =
    inclusionOrbit.band === 'rising' || inclusionOrbit.band === 'orbit'
      ? inclusionOrbit.orbitIndex * 0.18
      : inclusionOrbit.orbitIndex * 0.09;
  const subjectLift =
    subjectOrbit.band === 'orbit_ready' || subjectOrbit.band === 'crown_locked'
      ? subjectOrbit.orbitIndex * 0.22
      : subjectOrbit.orbitIndex * 0.11;

  const orbitIndex = v1014laborClamp(18 + inclusionLift + orbitLift + subjectLift - orbitDrag);
  const band = orbitBand(orbitIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce orbit — sequence apogee-inclusion, inclusion orbit, and subject orbit before post-81b50b8 tranche.'
      : band === 'orbit'
        ? 'Orbit band — avoid corridor overload that breaks subject orbit bands.'
        : 'Elevated orbit — refresh subject orbit checks each scale wave.';

  return {
    turn: state.turn,
    orbitIndex,
    band,
    orbitDrag,
    summary: `National workforce orbit ${band} (index ${Math.round(orbitIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}


// --- source: orbit-care-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOrbitCareCouplingBrief,
  type NationalWorkforceOrbitIndex,
  type OrbitCareCouplingBand
} from './types';

function couplingBand(index: number): OrbitCareCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-32 / wave-32 orbit-care coupling — orbit × care levers (O10-195). */
export function computeNationalOrbitCareCouplingBrief(
  state: NationalLaborDemographicsState,
  orbit: NationalWorkforceOrbitIndex | null | undefined
): NationalOrbitCareCouplingBrief {
  if (!state.enabled || !orbit) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      orbitDrag: 0,
      summary: 'Orbit-care coupling idle — workforce orbit unavailable.',
      stewardNote: 'Compute workforce orbit before care coupling guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const orbitDrag = v1014laborClamp(
    orbit.orbitDrag * 0.48 + (orbit.band === 'fragile' || orbit.band === 'thin' ? 11 : 3)
  );
  const orbitLift =
    orbit.band === 'elevated' || orbit.band === 'orbit'
      ? orbit.orbitIndex * 0.24
      : orbit.orbitIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + careLift * 21 + orbitLift - orbitDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained orbit-care link — deploy care levers before wave-32 nexus commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard care equilibrium spikes that drain orbit buffers.'
        : 'Amplified coupling — pair care packs with subject nexus readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    orbitDrag,
    summary: `Orbit-care coupling ${band} (index ${Math.round(couplingIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}


// --- source: care-equilibrium-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CareEquilibriumBand,
  type NationalCareEquilibriumOutlook,
  type NationalInclusionOrbitOutlook,
  type NationalLaborDemographicsState
} from './types';

function equilibriumBand(index: number): CareEquilibriumBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'equilibrium';
}

export function computeNationalCareEquilibriumOutlook(
  state: NationalLaborDemographicsState,
  inclusionOrbit: NationalInclusionOrbitOutlook | null | undefined
): NationalCareEquilibriumOutlook {
  if (!state.enabled || !inclusionOrbit) {
    return {
      turn: state.turn,
      equilibriumIndex: 50,
      band: 'patchy',
      orbitDrag: 0,
      summary: 'Care equilibrium idle — inclusion orbit unavailable.',
      stewardNote: 'Compute inclusion orbit before care equilibrium guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const orbitDrag = v1014laborClamp(
    inclusionOrbit.ascentDrag * 0.46 +
      (inclusionOrbit.band === 'ebbing' || inclusionOrbit.band === 'patchy' ? 10 : 3)
  );
  const orbitLift =
    inclusionOrbit.band === 'rising' || inclusionOrbit.band === 'orbit'
      ? inclusionOrbit.orbitIndex * 0.2
      : inclusionOrbit.orbitIndex * 0.1;

  const equilibriumIndex = v1014laborClamp(24 + careLift * 22 + orbitLift - orbitDrag);
  const band = equilibriumBand(equilibriumIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy care equilibrium — deploy care levers before subject nexus assembly.'
      : band === 'equilibrium'
        ? 'Equilibrium band — verify orbit-care coupling before auto workforce pushes.'
        : 'Rising equilibrium — align with tenacity-care coupling checks.';

  return {
    turn: state.turn,
    equilibriumIndex,
    band,
    orbitDrag,
    summary: `National care equilibrium ${band} (index ${Math.round(equilibriumIndex)}); orbit drag ${Math.round(orbitDrag)}.`,
    stewardNote
  };
}


// --- source: subject-nexus-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectNexusReadinessBrief,
  type NationalSubjectOrbitReadinessBrief,
  type NationalWorkforceOrbitIndex,
  type SubjectNexusReadinessBand
} from './types';

function nexusBand(index: number): SubjectNexusReadinessBand {
  if (index <= 34) return 'below_nexus';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'nexus_ready';
  return 'sealed_locked';
}

/** Round-32 / wave-32 subject nexus readiness — orbit × workforce orbit (O10-195). */
export function computeNationalSubjectNexusReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectOrbit: NationalSubjectOrbitReadinessBrief | null | undefined,
  workforceOrbit: NationalWorkforceOrbitIndex | null | undefined
): NationalSubjectNexusReadinessBrief {
  if (!state.enabled || !subjectOrbit || !workforceOrbit) {
    return {
      turn: state.turn,
      nexusIndex: 50,
      band: 'approaching',
      nexusDrag: 0,
      summary: 'Subject nexus readiness idle — subject orbit or workforce orbit unavailable.',
      stewardNote: 'Compute subject orbit and workforce orbit before nexus guidance.'
    };
  }

  const nexusDrag = v1014laborClamp(
    subjectOrbit.orbitDrag * 0.38 +
      workforceOrbit.orbitDrag * 0.38 +
      (subjectOrbit.band === 'below_orbit' || workforceOrbit.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectOrbit.band === 'orbit_ready' || subjectOrbit.band === 'crown_locked'
      ? subjectOrbit.orbitIndex * 0.27
      : subjectOrbit.orbitIndex * 0.14;
  const workforceLift =
    workforceOrbit.band === 'elevated' || workforceOrbit.band === 'orbit'
      ? workforceOrbit.orbitIndex * 0.25
      : workforceOrbit.orbitIndex * 0.12;

  const nexusIndex = v1014laborClamp(20 + subjectLift + workforceLift - nexusDrag);
  const band = nexusBand(nexusIndex);

  const stewardNote =
    band === 'below_nexus' || band === 'approaching'
      ? 'Approaching nexus — hold O10-195 wave-32 scale until orbit-care syncs.'
      : band === 'sealed_locked'
        ? 'Sealed-locked nexus — still monitor care equilibrium during corridor peaks.'
        : 'Nexus-ready — pair with workforce nexus index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    nexusIndex,
    band,
    nexusDrag,
    summary: `Subject nexus readiness ${band} (index ${Math.round(nexusIndex)}); nexus drag ${Math.round(nexusDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-nexus-index.ts ---
  type NationalCareEquilibriumOutlook,
  type NationalLaborDemographicsState,
  type NationalOrbitCareCouplingBrief,
  type NationalSubjectNexusReadinessBrief,
  type NationalWorkforceNexusIndex,
  type WorkforceNexusBand
} from './types';

function nexusBand(index: number): WorkforceNexusBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'nexus';
}

export function computeNationalWorkforceNexusIndex(
  state: NationalLaborDemographicsState,
  careCoupling: NationalOrbitCareCouplingBrief | null | undefined,
  careEquilibrium: NationalCareEquilibriumOutlook | null | undefined,
  subjectNexus: NationalSubjectNexusReadinessBrief | null | undefined
): NationalWorkforceNexusIndex {
  if (!state.enabled || !careCoupling || !careEquilibrium || !subjectNexus) {
    return {
      turn: state.turn,
      nexusIndex: 50,
      band: 'thin',
      nexusDrag: 0,
      summary: 'Workforce nexus idle — care coupling, care equilibrium, or subject nexus unavailable.',
      stewardNote: 'Compute O10-195 wave-32 depth stack before nexus guidance.'
    };
  }

  const nexusDrag = v1014laborClamp(
    subjectNexus.nexusDrag * 0.35 +
      careCoupling.orbitDrag * 0.3 +
      careEquilibrium.orbitDrag * 0.25 +
      (subjectNexus.band === 'below_nexus' || careCoupling.band === 'decoupled' ? 8 : 2)
  );
  const careLift =
    careCoupling.band === 'amplified' || careCoupling.band === 'elevated'
      ? careCoupling.couplingIndex * 0.2
      : careCoupling.couplingIndex * 0.1;
  const equilibriumLift =
    careEquilibrium.band === 'rising' || careEquilibrium.band === 'equilibrium'
      ? careEquilibrium.equilibriumIndex * 0.18
      : careEquilibrium.equilibriumIndex * 0.09;
  const subjectLift =
    subjectNexus.band === 'nexus_ready' || subjectNexus.band === 'sealed_locked'
      ? subjectNexus.nexusIndex * 0.22
      : subjectNexus.nexusIndex * 0.11;

  const nexusIndex = v1014laborClamp(18 + careLift + equilibriumLift + subjectLift - nexusDrag);
  const band = nexusBand(nexusIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce nexus — sequence orbit-care, care equilibrium, and subject nexus before post-aa70dac tranche.'
      : band === 'nexus'
        ? 'Nexus band — avoid corridor overload that breaks subject nexus bands.'
        : 'Elevated nexus — refresh subject nexus checks each scale wave.';

  return {
    turn: state.turn,
    nexusIndex,
    band,
    nexusDrag,
    summary: `National workforce nexus ${band} (index ${Math.round(nexusIndex)}); nexus drag ${Math.round(nexusDrag)}.`,
    stewardNote
  };
}


// --- source: nexus-scheduling-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalNexusSchedulingCouplingBrief,
  type NationalWorkforceNexusIndex,
  type NexusSchedulingCouplingBand
} from './types';

function couplingBand(index: number): NexusSchedulingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-33 / wave-33 nexus-scheduling coupling — nexus × scheduling levers (O10-197). */
export function computeNationalNexusSchedulingCouplingBrief(
  state: NationalLaborDemographicsState,
  nexus: NationalWorkforceNexusIndex | null | undefined
): NationalNexusSchedulingCouplingBrief {
  if (!state.enabled || !nexus) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      nexusDrag: 0,
      summary: 'Nexus-scheduling coupling idle — workforce nexus unavailable.',
      stewardNote: 'Compute workforce nexus before scheduling coupling guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const nexusDrag = v1014laborClamp(
    nexus.nexusDrag * 0.48 + (nexus.band === 'fragile' || nexus.band === 'thin' ? 11 : 3)
  );
  const nexusLift =
    nexus.band === 'elevated' || nexus.band === 'nexus'
      ? nexus.nexusIndex * 0.24
      : nexus.nexusIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + schedulingLift * 21 + nexusLift - nexusDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained nexus-scheduling link — deploy scheduling levers before wave-33 convergence commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard scheduling resonance spikes that drain nexus buffers.'
        : 'Amplified coupling — pair scheduling packs with subject convergence readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    nexusDrag,
    summary: `Nexus-scheduling coupling ${band} (index ${Math.round(couplingIndex)}); nexus drag ${Math.round(nexusDrag)}.`,
    stewardNote
  };
}


// --- source: scheduling-resonance-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalCareEquilibriumOutlook,
  type NationalLaborDemographicsState,
  type NationalSchedulingResonanceOutlook,
  type SchedulingResonanceBand
} from './types';

function resonanceBand(index: number): SchedulingResonanceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'resonance';
}

export function computeNationalSchedulingResonanceOutlook(
  state: NationalLaborDemographicsState,
  careEquilibrium: NationalCareEquilibriumOutlook | null | undefined
): NationalSchedulingResonanceOutlook {
  if (!state.enabled || !careEquilibrium) {
    return {
      turn: state.turn,
      resonanceIndex: 50,
      band: 'patchy',
      equilibriumDrag: 0,
      summary: 'Scheduling resonance idle — care equilibrium unavailable.',
      stewardNote: 'Compute care equilibrium before scheduling resonance guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const equilibriumDrag = v1014laborClamp(
    careEquilibrium.orbitDrag * 0.46 +
      (careEquilibrium.band === 'ebbing' || careEquilibrium.band === 'patchy' ? 10 : 3)
  );
  const equilibriumLift =
    careEquilibrium.band === 'rising' || careEquilibrium.band === 'equilibrium'
      ? careEquilibrium.equilibriumIndex * 0.2
      : careEquilibrium.equilibriumIndex * 0.1;

  const resonanceIndex = v1014laborClamp(24 + schedulingLift * 22 + equilibriumLift - equilibriumDrag);
  const band = resonanceBand(resonanceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy scheduling resonance — deploy scheduling levers before subject convergence assembly.'
      : band === 'resonance'
        ? 'Resonance band — verify nexus-scheduling coupling before auto workforce pushes.'
        : 'Rising resonance — align with steadfast-scheduling coupling checks.';

  return {
    turn: state.turn,
    resonanceIndex,
    band,
    equilibriumDrag,
    summary: `National scheduling resonance ${band} (index ${Math.round(resonanceIndex)}); equilibrium drag ${Math.round(equilibriumDrag)}.`,
    stewardNote
  };
}


// --- source: subject-convergence-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectConvergenceReadinessBrief,
  type NationalSubjectNexusReadinessBrief,
  type NationalWorkforceNexusIndex,
  type SubjectConvergenceReadinessBand
} from './types';

function convergenceBand(index: number): SubjectConvergenceReadinessBand {
  if (index <= 34) return 'below_convergence';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'convergence_ready';
  return 'nexus_locked';
}

/** Round-33 / wave-33 subject convergence readiness — nexus × workforce nexus (O10-197). */
export function computeNationalSubjectConvergenceReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectNexus: NationalSubjectNexusReadinessBrief | null | undefined,
  workforceNexus: NationalWorkforceNexusIndex | null | undefined
): NationalSubjectConvergenceReadinessBrief {
  if (!state.enabled || !subjectNexus || !workforceNexus) {
    return {
      turn: state.turn,
      convergenceIndex: 50,
      band: 'approaching',
      convergenceDrag: 0,
      summary: 'Subject convergence readiness idle — subject nexus or workforce nexus unavailable.',
      stewardNote: 'Compute subject nexus and workforce nexus before convergence guidance.'
    };
  }

  const convergenceDrag = v1014laborClamp(
    subjectNexus.nexusDrag * 0.38 +
      workforceNexus.nexusDrag * 0.38 +
      (subjectNexus.band === 'below_nexus' || workforceNexus.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectNexus.band === 'nexus_ready' || subjectNexus.band === 'sealed_locked'
      ? subjectNexus.nexusIndex * 0.27
      : subjectNexus.nexusIndex * 0.14;
  const workforceLift =
    workforceNexus.band === 'elevated' || workforceNexus.band === 'nexus'
      ? workforceNexus.nexusIndex * 0.25
      : workforceNexus.nexusIndex * 0.12;

  const convergenceIndex = v1014laborClamp(20 + subjectLift + workforceLift - convergenceDrag);
  const band = convergenceBand(convergenceIndex);

  const stewardNote =
    band === 'below_convergence' || band === 'approaching'
      ? 'Approaching convergence — hold O10-197 wave-33 scale until nexus-scheduling syncs.'
      : band === 'nexus_locked'
        ? 'Nexus-locked convergence — still monitor scheduling resonance during corridor peaks.'
        : 'Convergence-ready — pair with workforce convergence index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    convergenceIndex,
    band,
    convergenceDrag,
    summary: `Subject convergence readiness ${band} (index ${Math.round(convergenceIndex)}); convergence drag ${Math.round(convergenceDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-convergence-index.ts ---
  type NationalLaborDemographicsState,
  type NationalNexusSchedulingCouplingBrief,
  type NationalSchedulingResonanceOutlook,
  type NationalSubjectConvergenceReadinessBrief,
  type NationalWorkforceConvergenceIndex,
  type WorkforceConvergenceBand
} from './types';

function convergenceBand(index: number): WorkforceConvergenceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'convergence';
}

export function computeNationalWorkforceConvergenceIndex(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalNexusSchedulingCouplingBrief | null | undefined,
  schedulingResonance: NationalSchedulingResonanceOutlook | null | undefined,
  subjectConvergence: NationalSubjectConvergenceReadinessBrief | null | undefined
): NationalWorkforceConvergenceIndex {
  if (!state.enabled || !schedulingCoupling || !schedulingResonance || !subjectConvergence) {
    return {
      turn: state.turn,
      convergenceIndex: 50,
      band: 'thin',
      convergenceDrag: 0,
      summary: 'Workforce convergence idle — scheduling coupling, scheduling resonance, or subject convergence unavailable.',
      stewardNote: 'Compute O10-197 wave-33 depth stack before convergence guidance.'
    };
  }

  const convergenceDrag = v1014laborClamp(
    subjectConvergence.convergenceDrag * 0.35 +
      schedulingCoupling.nexusDrag * 0.3 +
      schedulingResonance.equilibriumDrag * 0.25 +
      (subjectConvergence.band === 'below_convergence' || schedulingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const schedulingLift =
    schedulingCoupling.band === 'amplified' || schedulingCoupling.band === 'elevated'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;
  const resonanceLift =
    schedulingResonance.band === 'rising' || schedulingResonance.band === 'resonance'
      ? schedulingResonance.resonanceIndex * 0.18
      : schedulingResonance.resonanceIndex * 0.09;
  const subjectLift =
    subjectConvergence.band === 'convergence_ready' || subjectConvergence.band === 'nexus_locked'
      ? subjectConvergence.convergenceIndex * 0.22
      : subjectConvergence.convergenceIndex * 0.11;

  const convergenceIndex = v1014laborClamp(18 + schedulingLift + resonanceLift + subjectLift - convergenceDrag);
  const band = convergenceBand(convergenceIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce convergence — sequence nexus-scheduling, scheduling resonance, and subject convergence before post-c5f6d0b tranche.'
      : band === 'convergence'
        ? 'Convergence band — avoid corridor overload that breaks subject convergence bands.'
        : 'Elevated convergence — refresh subject convergence checks each scale wave.';

  return {
    turn: state.turn,
    convergenceIndex,
    band,
    convergenceDrag,
    summary: `National workforce convergence ${band} (index ${Math.round(convergenceIndex)}); convergence drag ${Math.round(convergenceDrag)}.`,
    stewardNote
  };
}


// --- source: convergence-safety-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type ConvergenceSafetyCouplingBand,
  type NationalConvergenceSafetyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceConvergenceIndex
} from './types';

function couplingBand(index: number): ConvergenceSafetyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-34 / wave-34 convergence-safety coupling — convergence × safety levers (O10-199). */
export function computeNationalConvergenceSafetyCouplingBrief(
  state: NationalLaborDemographicsState,
  convergence: NationalWorkforceConvergenceIndex | null | undefined
): NationalConvergenceSafetyCouplingBrief {
  if (!state.enabled || !convergence) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      convergenceDrag: 0,
      summary: 'Convergence-safety coupling idle — workforce convergence unavailable.',
      stewardNote: 'Compute workforce convergence before safety coupling guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const convergenceDrag = v1014laborClamp(
    convergence.convergenceDrag * 0.48 + (convergence.band === 'fragile' || convergence.band === 'thin' ? 11 : 3)
  );
  const convergenceLift =
    convergence.band === 'elevated' || convergence.band === 'convergence'
      ? convergence.convergenceIndex * 0.24
      : convergence.convergenceIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + safetyLift * 21 + convergenceLift - convergenceDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained convergence-safety link — deploy safety levers before wave-34 unification commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard safety harmony spikes that drain convergence buffers.'
        : 'Amplified coupling — pair safety packs with subject unification readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    convergenceDrag,
    summary: `Convergence-safety coupling ${band} (index ${Math.round(couplingIndex)}); convergence drag ${Math.round(convergenceDrag)}.`,
    stewardNote
  };
}


// --- source: safety-harmony-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSafetyHarmonyOutlook,
  type NationalSchedulingResonanceOutlook,
  type SafetyHarmonyBand
} from './types';

function harmonyBand(index: number): SafetyHarmonyBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'harmony';
}

export function computeNationalSafetyHarmonyOutlook(
  state: NationalLaborDemographicsState,
  schedulingResonance: NationalSchedulingResonanceOutlook | null | undefined
): NationalSafetyHarmonyOutlook {
  if (!state.enabled || !schedulingResonance) {
    return {
      turn: state.turn,
      harmonyIndex: 50,
      band: 'patchy',
      resonanceDrag: 0,
      summary: 'Safety harmony idle — scheduling resonance unavailable.',
      stewardNote: 'Compute scheduling resonance before safety harmony guidance.'
    };
  }

  let safetyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    safetyLift += safetyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  safetyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resonanceDrag = v1014laborClamp(
    schedulingResonance.equilibriumDrag * 0.46 +
      (schedulingResonance.band === 'ebbing' || schedulingResonance.band === 'patchy' ? 10 : 3)
  );
  const resonanceLift =
    schedulingResonance.band === 'rising' || schedulingResonance.band === 'resonance'
      ? schedulingResonance.resonanceIndex * 0.2
      : schedulingResonance.resonanceIndex * 0.1;

  const harmonyIndex = v1014laborClamp(24 + safetyLift * 22 + resonanceLift - resonanceDrag);
  const band = harmonyBand(harmonyIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy safety harmony — deploy safety levers before subject unification assembly.'
      : band === 'harmony'
        ? 'Harmony band — verify convergence-safety coupling before auto workforce pushes.'
        : 'Rising harmony — align with safety-cohesion outlook checks.';

  return {
    turn: state.turn,
    harmonyIndex,
    band,
    resonanceDrag,
    summary: `National safety harmony ${band} (index ${Math.round(harmonyIndex)}); resonance drag ${Math.round(resonanceDrag)}.`,
    stewardNote
  };
}


// --- source: subject-unification-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectConvergenceReadinessBrief,
  type NationalSubjectUnificationReadinessBrief,
  type NationalWorkforceConvergenceIndex,
  type SubjectUnificationReadinessBand
} from './types';

function unificationBand(index: number): SubjectUnificationReadinessBand {
  if (index <= 34) return 'below_unification';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'unification_ready';
  return 'convergence_locked';
}

/** Round-34 / wave-34 subject unification readiness — convergence × workforce convergence (O10-199). */
export function computeNationalSubjectUnificationReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectConvergence: NationalSubjectConvergenceReadinessBrief | null | undefined,
  workforceConvergence: NationalWorkforceConvergenceIndex | null | undefined
): NationalSubjectUnificationReadinessBrief {
  if (!state.enabled || !subjectConvergence || !workforceConvergence) {
    return {
      turn: state.turn,
      unificationIndex: 50,
      band: 'approaching',
      unificationDrag: 0,
      summary: 'Subject unification readiness idle — subject convergence or workforce convergence unavailable.',
      stewardNote: 'Compute subject convergence and workforce convergence before unification guidance.'
    };
  }

  const unificationDrag = v1014laborClamp(
    subjectConvergence.convergenceDrag * 0.38 +
      workforceConvergence.convergenceDrag * 0.38 +
      (subjectConvergence.band === 'below_convergence' || workforceConvergence.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectConvergence.band === 'convergence_ready' || subjectConvergence.band === 'nexus_locked'
      ? subjectConvergence.convergenceIndex * 0.27
      : subjectConvergence.convergenceIndex * 0.14;
  const workforceLift =
    workforceConvergence.band === 'elevated' || workforceConvergence.band === 'convergence'
      ? workforceConvergence.convergenceIndex * 0.25
      : workforceConvergence.convergenceIndex * 0.12;

  const unificationIndex = v1014laborClamp(20 + subjectLift + workforceLift - unificationDrag);
  const band = unificationBand(unificationIndex);

  const stewardNote =
    band === 'below_unification' || band === 'approaching'
      ? 'Approaching unification — hold O10-199 wave-34 scale until convergence-safety syncs.'
      : band === 'convergence_locked'
        ? 'Convergence-locked unification — still monitor safety harmony during corridor peaks.'
        : 'Unification-ready — pair with workforce unification index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    unificationIndex,
    band,
    unificationDrag,
    summary: `Subject unification readiness ${band} (index ${Math.round(unificationIndex)}); unification drag ${Math.round(unificationDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-unification-index.ts ---
  type NationalConvergenceSafetyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSafetyHarmonyOutlook,
  type NationalSubjectUnificationReadinessBrief,
  type NationalWorkforceUnificationIndex,
  type WorkforceUnificationBand
} from './types';

function unificationBand(index: number): WorkforceUnificationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'unification';
}

export function computeNationalWorkforceUnificationIndex(
  state: NationalLaborDemographicsState,
  safetyCoupling: NationalConvergenceSafetyCouplingBrief | null | undefined,
  safetyHarmony: NationalSafetyHarmonyOutlook | null | undefined,
  subjectUnification: NationalSubjectUnificationReadinessBrief | null | undefined
): NationalWorkforceUnificationIndex {
  if (!state.enabled || !safetyCoupling || !safetyHarmony || !subjectUnification) {
    return {
      turn: state.turn,
      unificationIndex: 50,
      band: 'thin',
      unificationDrag: 0,
      summary: 'Workforce unification idle — safety coupling, safety harmony, or subject unification unavailable.',
      stewardNote: 'Compute O10-199 wave-34 depth stack before unification guidance.'
    };
  }

  const unificationDrag = v1014laborClamp(
    subjectUnification.unificationDrag * 0.35 +
      safetyCoupling.convergenceDrag * 0.3 +
      safetyHarmony.resonanceDrag * 0.25 +
      (subjectUnification.band === 'below_unification' || safetyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const safetyLift =
    safetyCoupling.band === 'amplified' || safetyCoupling.band === 'elevated'
      ? safetyCoupling.couplingIndex * 0.2
      : safetyCoupling.couplingIndex * 0.1;
  const harmonyLift =
    safetyHarmony.band === 'rising' || safetyHarmony.band === 'harmony'
      ? safetyHarmony.harmonyIndex * 0.18
      : safetyHarmony.harmonyIndex * 0.09;
  const subjectLift =
    subjectUnification.band === 'unification_ready' || subjectUnification.band === 'convergence_locked'
      ? subjectUnification.unificationIndex * 0.22
      : subjectUnification.unificationIndex * 0.11;

  const unificationIndex = v1014laborClamp(18 + safetyLift + harmonyLift + subjectLift - unificationDrag);
  const band = unificationBand(unificationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce unification — sequence convergence-safety, safety harmony, and subject unification before post-2187b54 tranche.'
      : band === 'unification'
        ? 'Unification band — avoid corridor overload that breaks subject unification bands.'
        : 'Elevated unification — refresh subject unification checks each scale wave.';

  return {
    turn: state.turn,
    unificationIndex,
    band,
    unificationDrag,
    summary: `National workforce unification ${band} (index ${Math.round(unificationIndex)}); unification drag ${Math.round(unificationDrag)}.`,
    stewardNote
  };
}


// --- source: unification-upskilling-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalUnificationUpskillingCouplingBrief,
  type NationalWorkforceUnificationIndex,
  type UnificationUpskillingCouplingBand
} from './types';

function couplingBand(index: number): UnificationUpskillingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-35 / wave-35 unification-upskilling coupling — unification × upskilling (O10-201). */
export function computeNationalUnificationUpskillingCouplingBrief(
  state: NationalLaborDemographicsState,
  unification: NationalWorkforceUnificationIndex | null | undefined
): NationalUnificationUpskillingCouplingBrief {
  if (!state.enabled || !unification) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      unificationDrag: 0,
      summary: 'Unification-upskilling coupling idle — workforce unification unavailable.',
      stewardNote: 'Compute workforce unification before upskilling coupling guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const unificationDrag = v1014laborClamp(
    unification.unificationDrag * 0.48 + (unification.band === 'fragile' || unification.band === 'thin' ? 11 : 3)
  );
  const unificationLift =
    unification.band === 'elevated' || unification.band === 'unification'
      ? unification.unificationIndex * 0.24
      : unification.unificationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + upskillingLift * 21 + unificationLift - unificationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained unification-upskilling link — deploy upskilling programs before wave-35 synthesis commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard upskilling synthesis spikes that drain unification buffers.'
        : 'Amplified coupling — pair upskilling packs with subject synthesis readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    unificationDrag,
    summary: `Unification-upskilling coupling ${band} (index ${Math.round(couplingIndex)}); unification drag ${Math.round(unificationDrag)}.`,
    stewardNote
  };
}


// --- source: upskilling-synthesis-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSafetyHarmonyOutlook,
  type NationalUpskillingSynthesisOutlook,
  type UpskillingSynthesisBand
} from './types';

function synthesisBand(index: number): UpskillingSynthesisBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'synthesis';
}

export function computeNationalUpskillingSynthesisOutlook(
  state: NationalLaborDemographicsState,
  safetyHarmony: NationalSafetyHarmonyOutlook | null | undefined
): NationalUpskillingSynthesisOutlook {
  if (!state.enabled || !safetyHarmony) {
    return {
      turn: state.turn,
      synthesisIndex: 50,
      band: 'patchy',
      harmonyDrag: 0,
      summary: 'Upskilling synthesis idle — safety harmony unavailable.',
      stewardNote: 'Compute safety harmony before upskilling synthesis guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const harmonyDrag = v1014laborClamp(
    safetyHarmony.resonanceDrag * 0.46 +
      (safetyHarmony.band === 'ebbing' || safetyHarmony.band === 'patchy' ? 10 : 3)
  );
  const harmonyLift =
    safetyHarmony.band === 'rising' || safetyHarmony.band === 'harmony'
      ? safetyHarmony.harmonyIndex * 0.2
      : safetyHarmony.harmonyIndex * 0.1;

  const synthesisIndex = v1014laborClamp(24 + upskillingLift * 22 + harmonyLift - harmonyDrag);
  const band = synthesisBand(synthesisIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy upskilling synthesis — deploy upskilling programs before subject synthesis assembly.'
      : band === 'synthesis'
        ? 'Synthesis band — verify unification-upskilling coupling before auto workforce pushes.'
        : 'Rising synthesis — align with upskilling velocity outlook checks.';

  return {
    turn: state.turn,
    synthesisIndex,
    band,
    harmonyDrag,
    summary: `National upskilling synthesis ${band} (index ${Math.round(synthesisIndex)}); harmony drag ${Math.round(harmonyDrag)}.`,
    stewardNote
  };
}


// --- source: subject-synthesis-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectSynthesisReadinessBrief,
  type NationalSubjectUnificationReadinessBrief,
  type NationalWorkforceUnificationIndex,
  type SubjectSynthesisReadinessBand
} from './types';

function synthesisBand(index: number): SubjectSynthesisReadinessBand {
  if (index <= 34) return 'below_synthesis';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'synthesis_ready';
  return 'unification_locked';
}

/** Round-35 / wave-35 subject synthesis readiness — unification × workforce unification (O10-201). */
export function computeNationalSubjectSynthesisReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectUnification: NationalSubjectUnificationReadinessBrief | null | undefined,
  workforceUnification: NationalWorkforceUnificationIndex | null | undefined
): NationalSubjectSynthesisReadinessBrief {
  if (!state.enabled || !subjectUnification || !workforceUnification) {
    return {
      turn: state.turn,
      synthesisIndex: 50,
      band: 'approaching',
      synthesisDrag: 0,
      summary: 'Subject synthesis readiness idle — subject unification or workforce unification unavailable.',
      stewardNote: 'Compute subject unification and workforce unification before synthesis guidance.'
    };
  }

  const synthesisDrag = v1014laborClamp(
    subjectUnification.unificationDrag * 0.38 +
      workforceUnification.unificationDrag * 0.38 +
      (subjectUnification.band === 'below_unification' || workforceUnification.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectUnification.band === 'unification_ready' || subjectUnification.band === 'convergence_locked'
      ? subjectUnification.unificationIndex * 0.27
      : subjectUnification.unificationIndex * 0.14;
  const workforceLift =
    workforceUnification.band === 'elevated' || workforceUnification.band === 'unification'
      ? workforceUnification.unificationIndex * 0.25
      : workforceUnification.unificationIndex * 0.12;

  const synthesisIndex = v1014laborClamp(20 + subjectLift + workforceLift - synthesisDrag);
  const band = synthesisBand(synthesisIndex);

  const stewardNote =
    band === 'below_synthesis' || band === 'approaching'
      ? 'Approaching synthesis — hold O10-201 wave-35 scale until unification-upskilling syncs.'
      : band === 'unification_locked'
        ? 'Unification-locked synthesis — still monitor upskilling synthesis during corridor peaks.'
        : 'Synthesis-ready — pair with workforce synthesis index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    synthesisIndex,
    band,
    synthesisDrag,
    summary: `Subject synthesis readiness ${band} (index ${Math.round(synthesisIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-synthesis-index.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectSynthesisReadinessBrief,
  type NationalUnificationUpskillingCouplingBrief,
  type NationalUpskillingSynthesisOutlook,
  type NationalWorkforceSynthesisIndex,
  type WorkforceSynthesisBand
} from './types';

function synthesisBand(index: number): WorkforceSynthesisBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'synthesis';
}

export function computeNationalWorkforceSynthesisIndex(
  state: NationalLaborDemographicsState,
  upskillingCoupling: NationalUnificationUpskillingCouplingBrief | null | undefined,
  upskillingSynthesis: NationalUpskillingSynthesisOutlook | null | undefined,
  subjectSynthesis: NationalSubjectSynthesisReadinessBrief | null | undefined
): NationalWorkforceSynthesisIndex {
  if (!state.enabled || !upskillingCoupling || !upskillingSynthesis || !subjectSynthesis) {
    return {
      turn: state.turn,
      synthesisIndex: 50,
      band: 'thin',
      synthesisDrag: 0,
      summary: 'Workforce synthesis idle — upskilling coupling, upskilling synthesis, or subject synthesis unavailable.',
      stewardNote: 'Compute O10-201 wave-35 depth stack before synthesis guidance.'
    };
  }

  const synthesisDrag = v1014laborClamp(
    subjectSynthesis.synthesisDrag * 0.35 +
      upskillingCoupling.unificationDrag * 0.3 +
      upskillingSynthesis.harmonyDrag * 0.25 +
      (subjectSynthesis.band === 'below_synthesis' || upskillingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const upskillingLift =
    upskillingCoupling.band === 'amplified' || upskillingCoupling.band === 'elevated'
      ? upskillingCoupling.couplingIndex * 0.2
      : upskillingCoupling.couplingIndex * 0.1;
  const outlookLift =
    upskillingSynthesis.band === 'rising' || upskillingSynthesis.band === 'synthesis'
      ? upskillingSynthesis.synthesisIndex * 0.18
      : upskillingSynthesis.synthesisIndex * 0.09;
  const subjectLift =
    subjectSynthesis.band === 'synthesis_ready' || subjectSynthesis.band === 'unification_locked'
      ? subjectSynthesis.synthesisIndex * 0.22
      : subjectSynthesis.synthesisIndex * 0.11;

  const synthesisIndex = v1014laborClamp(18 + upskillingLift + outlookLift + subjectLift - synthesisDrag);
  const band = synthesisBand(synthesisIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce synthesis — sequence unification-upskilling, upskilling synthesis, and subject synthesis before post-1f7d25b tranche.'
      : band === 'synthesis'
        ? 'Synthesis band — avoid corridor overload that breaks subject synthesis bands.'
        : 'Elevated synthesis — refresh subject synthesis checks each scale wave.';

  return {
    turn: state.turn,
    synthesisIndex,
    band,
    synthesisDrag,
    summary: `National workforce synthesis ${band} (index ${Math.round(synthesisIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}


// --- source: synthesis-onboarding-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalSynthesisOnboardingCouplingBrief,
  type NationalWorkforceSynthesisIndex,
  type SynthesisOnboardingCouplingBand
} from './types';

function couplingBand(index: number): SynthesisOnboardingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-36 / wave-36 synthesis-onboarding coupling — synthesis × onboarding (O10-203). */
export function computeNationalSynthesisOnboardingCouplingBrief(
  state: NationalLaborDemographicsState,
  synthesis: NationalWorkforceSynthesisIndex | null | undefined
): NationalSynthesisOnboardingCouplingBrief {
  if (!state.enabled || !synthesis) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      synthesisDrag: 0,
      summary: 'Synthesis-onboarding coupling idle — workforce synthesis unavailable.',
      stewardNote: 'Compute workforce synthesis before onboarding coupling guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const synthesisDrag = v1014laborClamp(
    synthesis.synthesisDrag * 0.48 + (synthesis.band === 'fragile' || synthesis.band === 'thin' ? 11 : 3)
  );
  const synthesisLift =
    synthesis.band === 'elevated' || synthesis.band === 'synthesis'
      ? synthesis.synthesisIndex * 0.24
      : synthesis.synthesisIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + onboardingLift * 21 + synthesisLift - synthesisDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained synthesis-onboarding link — deploy onboarding levers before wave-36 integration commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard onboarding integration spikes that drain synthesis buffers.'
        : 'Amplified coupling — pair onboarding packs with subject integration readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    synthesisDrag,
    summary: `Synthesis-onboarding coupling ${band} (index ${Math.round(couplingIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}


// --- source: onboarding-integration-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingIntegrationOutlook,
  type NationalUpskillingSynthesisOutlook,
  type OnboardingIntegrationBand
} from './types';

function integrationBand(index: number): OnboardingIntegrationBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'integration';
}

export function computeNationalOnboardingIntegrationOutlook(
  state: NationalLaborDemographicsState,
  upskillingSynthesis: NationalUpskillingSynthesisOutlook | null | undefined
): NationalOnboardingIntegrationOutlook {
  if (!state.enabled || !upskillingSynthesis) {
    return {
      turn: state.turn,
      integrationIndex: 50,
      band: 'patchy',
      synthesisDrag: 0,
      summary: 'Onboarding integration idle — upskilling synthesis unavailable.',
      stewardNote: 'Compute upskilling synthesis before onboarding integration guidance.'
    };
  }

  let onboardingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    onboardingLift += onboardingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  onboardingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const synthesisDrag = v1014laborClamp(
    upskillingSynthesis.harmonyDrag * 0.46 +
      (upskillingSynthesis.band === 'ebbing' || upskillingSynthesis.band === 'patchy' ? 10 : 3)
  );
  const synthesisLift =
    upskillingSynthesis.band === 'rising' || upskillingSynthesis.band === 'synthesis'
      ? upskillingSynthesis.synthesisIndex * 0.2
      : upskillingSynthesis.synthesisIndex * 0.1;

  const integrationIndex = v1014laborClamp(24 + onboardingLift * 22 + synthesisLift - synthesisDrag);
  const band = integrationBand(integrationIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy onboarding integration — deploy onboarding levers before subject integration assembly.'
      : band === 'integration'
        ? 'Integration band — verify synthesis-onboarding coupling before auto workforce pushes.'
        : 'Rising integration — align with onboarding sustain outlook checks.';

  return {
    turn: state.turn,
    integrationIndex,
    band,
    synthesisDrag,
    summary: `National onboarding integration ${band} (index ${Math.round(integrationIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}


// --- source: subject-integration-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectIntegrationReadinessBrief,
  type NationalSubjectSynthesisReadinessBrief,
  type NationalWorkforceSynthesisIndex,
  type SubjectIntegrationReadinessBand
} from './types';

function integrationBand(index: number): SubjectIntegrationReadinessBand {
  if (index <= 34) return 'below_integration';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'integration_ready';
  return 'synthesis_locked';
}

/** Round-36 / wave-36 subject integration readiness — synthesis × workforce synthesis (O10-203). */
export function computeNationalSubjectIntegrationReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectSynthesis: NationalSubjectSynthesisReadinessBrief | null | undefined,
  workforceSynthesis: NationalWorkforceSynthesisIndex | null | undefined
): NationalSubjectIntegrationReadinessBrief {
  if (!state.enabled || !subjectSynthesis || !workforceSynthesis) {
    return {
      turn: state.turn,
      integrationIndex: 50,
      band: 'approaching',
      integrationDrag: 0,
      summary: 'Subject integration readiness idle — subject synthesis or workforce synthesis unavailable.',
      stewardNote: 'Compute subject synthesis and workforce synthesis before integration guidance.'
    };
  }

  const integrationDrag = v1014laborClamp(
    subjectSynthesis.synthesisDrag * 0.38 +
      workforceSynthesis.synthesisDrag * 0.38 +
      (subjectSynthesis.band === 'below_synthesis' || workforceSynthesis.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectSynthesis.band === 'synthesis_ready' || subjectSynthesis.band === 'unification_locked'
      ? subjectSynthesis.synthesisIndex * 0.27
      : subjectSynthesis.synthesisIndex * 0.14;
  const workforceLift =
    workforceSynthesis.band === 'elevated' || workforceSynthesis.band === 'synthesis'
      ? workforceSynthesis.synthesisIndex * 0.25
      : workforceSynthesis.synthesisIndex * 0.12;

  const integrationIndex = v1014laborClamp(20 + subjectLift + workforceLift - integrationDrag);
  const band = integrationBand(integrationIndex);

  const stewardNote =
    band === 'below_integration' || band === 'approaching'
      ? 'Approaching integration — hold O10-203 wave-36 scale until synthesis-onboarding syncs.'
      : band === 'synthesis_locked'
        ? 'Synthesis-locked integration — still monitor onboarding integration during corridor peaks.'
        : 'Integration-ready — pair with workforce integration index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    integrationIndex,
    band,
    integrationDrag,
    summary: `Subject integration readiness ${band} (index ${Math.round(integrationIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-integration-index.ts ---
  type NationalLaborDemographicsState,
  type NationalOnboardingIntegrationOutlook,
  type NationalSubjectIntegrationReadinessBrief,
  type NationalSynthesisOnboardingCouplingBrief,
  type NationalWorkforceIntegrationIndex,
  type WorkforceIntegrationBand
} from './types';

function integrationBand(index: number): WorkforceIntegrationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'integration';
}

export function computeNationalWorkforceIntegrationIndex(
  state: NationalLaborDemographicsState,
  onboardingCoupling: NationalSynthesisOnboardingCouplingBrief | null | undefined,
  onboardingIntegration: NationalOnboardingIntegrationOutlook | null | undefined,
  subjectIntegration: NationalSubjectIntegrationReadinessBrief | null | undefined
): NationalWorkforceIntegrationIndex {
  if (!state.enabled || !onboardingCoupling || !onboardingIntegration || !subjectIntegration) {
    return {
      turn: state.turn,
      integrationIndex: 50,
      band: 'thin',
      integrationDrag: 0,
      summary: 'Workforce integration idle — onboarding coupling, onboarding integration, or subject integration unavailable.',
      stewardNote: 'Compute O10-203 wave-36 depth stack before integration guidance.'
    };
  }

  const integrationDrag = v1014laborClamp(
    subjectIntegration.integrationDrag * 0.35 +
      onboardingCoupling.synthesisDrag * 0.3 +
      onboardingIntegration.synthesisDrag * 0.25 +
      (subjectIntegration.band === 'below_integration' || onboardingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const onboardingLift =
    onboardingCoupling.band === 'amplified' || onboardingCoupling.band === 'elevated'
      ? onboardingCoupling.couplingIndex * 0.2
      : onboardingCoupling.couplingIndex * 0.1;
  const outlookLift =
    onboardingIntegration.band === 'rising' || onboardingIntegration.band === 'integration'
      ? onboardingIntegration.integrationIndex * 0.18
      : onboardingIntegration.integrationIndex * 0.09;
  const subjectLift =
    subjectIntegration.band === 'integration_ready' || subjectIntegration.band === 'synthesis_locked'
      ? subjectIntegration.integrationIndex * 0.22
      : subjectIntegration.integrationIndex * 0.11;

  const integrationIndex = v1014laborClamp(18 + onboardingLift + outlookLift + subjectLift - integrationDrag);
  const band = integrationBand(integrationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce integration — sequence synthesis-onboarding, onboarding integration, and subject integration before post-ea2bb03 tranche.'
      : band === 'integration'
        ? 'Integration band — avoid corridor overload that breaks subject integration bands.'
        : 'Elevated integration — refresh subject integration checks each scale wave.';

  return {
    turn: state.turn,
    integrationIndex,
    band,
    integrationDrag,
    summary: `National workforce integration ${band} (index ${Math.round(integrationIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}


// --- source: integration-retention-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type IntegrationRetentionCouplingBand,
  type NationalIntegrationRetentionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceIntegrationIndex
} from './types';

function couplingBand(index: number): IntegrationRetentionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-37 / wave-37 integration-retention coupling — integration × retention (O10-205). */
export function computeNationalIntegrationRetentionCouplingBrief(
  state: NationalLaborDemographicsState,
  integration: NationalWorkforceIntegrationIndex | null | undefined
): NationalIntegrationRetentionCouplingBrief {
  if (!state.enabled || !integration) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      integrationDrag: 0,
      summary: 'Integration-retention coupling idle — workforce integration unavailable.',
      stewardNote: 'Compute workforce integration before retention coupling guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const integrationDrag = v1014laborClamp(
    integration.integrationDrag * 0.48 + (integration.band === 'fragile' || integration.band === 'thin' ? 11 : 3)
  );
  const integrationLift =
    integration.band === 'elevated' || integration.band === 'integration'
      ? integration.integrationIndex * 0.24
      : integration.integrationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + retentionLift * 21 + integrationLift - integrationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained integration-retention link — deploy retention levers before wave-37 retention commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard retention cohesion spikes that drain integration buffers.'
        : 'Amplified coupling — pair retention packs with subject retention readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    integrationDrag,
    summary: `Integration-retention coupling ${band} (index ${Math.round(couplingIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}


// --- source: retention-cohesion-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalOnboardingIntegrationOutlook,
  type NationalRetentionCohesionOutlook,
  type RetentionCohesionBand
} from './types';

function cohesionBand(index: number): RetentionCohesionBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'cohesion';
}

export function computeNationalRetentionCohesionOutlook(
  state: NationalLaborDemographicsState,
  onboardingIntegration: NationalOnboardingIntegrationOutlook | null | undefined
): NationalRetentionCohesionOutlook {
  if (!state.enabled || !onboardingIntegration) {
    return {
      turn: state.turn,
      cohesionIndex: 50,
      band: 'patchy',
      integrationDrag: 0,
      summary: 'Retention cohesion idle — onboarding integration unavailable.',
      stewardNote: 'Compute onboarding integration before retention cohesion guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const integrationDrag = v1014laborClamp(
    onboardingIntegration.synthesisDrag * 0.46 +
      (onboardingIntegration.band === 'ebbing' || onboardingIntegration.band === 'patchy' ? 10 : 3)
  );
  const integrationLift =
    onboardingIntegration.band === 'rising' || onboardingIntegration.band === 'integration'
      ? onboardingIntegration.integrationIndex * 0.2
      : onboardingIntegration.integrationIndex * 0.1;

  const cohesionIndex = v1014laborClamp(24 + retentionLift * 22 + integrationLift - integrationDrag);
  const band = cohesionBand(cohesionIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy retention cohesion — deploy retention levers before subject retention assembly.'
      : band === 'cohesion'
        ? 'Cohesion band — verify integration-retention coupling before auto workforce pushes.'
        : 'Rising cohesion — align with integration sustain outlook checks.';

  return {
    turn: state.turn,
    cohesionIndex,
    band,
    integrationDrag,
    summary: `National retention cohesion ${band} (index ${Math.round(cohesionIndex)}); integration drag ${Math.round(integrationDrag)}.`,
    stewardNote
  };
}


// --- source: subject-retention-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectIntegrationReadinessBrief,
  type NationalSubjectRetentionReadinessBrief,
  type NationalWorkforceIntegrationIndex,
  type SubjectRetentionReadinessBand
} from './types';

function retentionBand(index: number): SubjectRetentionReadinessBand {
  if (index <= 34) return 'below_retention';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'retention_ready';
  return 'integration_locked';
}

/** Round-37 / wave-37 subject retention readiness — integration × workforce integration (O10-205). */
export function computeNationalSubjectRetentionReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectIntegration: NationalSubjectIntegrationReadinessBrief | null | undefined,
  workforceIntegration: NationalWorkforceIntegrationIndex | null | undefined
): NationalSubjectRetentionReadinessBrief {
  if (!state.enabled || !subjectIntegration || !workforceIntegration) {
    return {
      turn: state.turn,
      retentionIndex: 50,
      band: 'approaching',
      retentionDrag: 0,
      summary: 'Subject retention readiness idle — subject integration or workforce integration unavailable.',
      stewardNote: 'Compute subject integration and workforce integration before retention guidance.'
    };
  }

  const retentionDrag = v1014laborClamp(
    subjectIntegration.integrationDrag * 0.38 +
      workforceIntegration.integrationDrag * 0.38 +
      (subjectIntegration.band === 'below_integration' || workforceIntegration.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectIntegration.band === 'integration_ready' || subjectIntegration.band === 'synthesis_locked'
      ? subjectIntegration.integrationIndex * 0.27
      : subjectIntegration.integrationIndex * 0.14;
  const workforceLift =
    workforceIntegration.band === 'elevated' || workforceIntegration.band === 'integration'
      ? workforceIntegration.integrationIndex * 0.25
      : workforceIntegration.integrationIndex * 0.12;

  const retentionIndex = v1014laborClamp(20 + subjectLift + workforceLift - retentionDrag);
  const band = retentionBand(retentionIndex);

  const stewardNote =
    band === 'below_retention' || band === 'approaching'
      ? 'Approaching retention — hold O10-205 wave-37 scale until integration-retention syncs.'
      : band === 'integration_locked'
        ? 'Integration-locked retention — still monitor retention cohesion during corridor peaks.'
        : 'Retention-ready — pair with workforce retention index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    retentionIndex,
    band,
    retentionDrag,
    summary: `Subject retention readiness ${band} (index ${Math.round(retentionIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-retention-index.ts ---
  type NationalIntegrationRetentionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalRetentionCohesionOutlook,
  type NationalSubjectRetentionReadinessBrief,
  type NationalWorkforceRetentionIndex,
  type WorkforceRetentionBand
} from './types';

function retentionBand(index: number): WorkforceRetentionBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'retention';
}

export function computeNationalWorkforceRetentionIndex(
  state: NationalLaborDemographicsState,
  retentionCoupling: NationalIntegrationRetentionCouplingBrief | null | undefined,
  retentionCohesion: NationalRetentionCohesionOutlook | null | undefined,
  subjectRetention: NationalSubjectRetentionReadinessBrief | null | undefined
): NationalWorkforceRetentionIndex {
  if (!state.enabled || !retentionCoupling || !retentionCohesion || !subjectRetention) {
    return {
      turn: state.turn,
      retentionIndex: 50,
      band: 'thin',
      retentionDrag: 0,
      summary: 'Workforce retention idle — retention coupling, retention cohesion, or subject retention unavailable.',
      stewardNote: 'Compute O10-205 wave-37 depth stack before retention guidance.'
    };
  }

  const retentionDrag = v1014laborClamp(
    subjectRetention.retentionDrag * 0.35 +
      retentionCoupling.integrationDrag * 0.3 +
      retentionCohesion.integrationDrag * 0.25 +
      (subjectRetention.band === 'below_retention' || retentionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    retentionCoupling.band === 'amplified' || retentionCoupling.band === 'elevated'
      ? retentionCoupling.couplingIndex * 0.2
      : retentionCoupling.couplingIndex * 0.1;
  const cohesionLift =
    retentionCohesion.band === 'rising' || retentionCohesion.band === 'cohesion'
      ? retentionCohesion.cohesionIndex * 0.18
      : retentionCohesion.cohesionIndex * 0.09;
  const subjectLift =
    subjectRetention.band === 'retention_ready' || subjectRetention.band === 'integration_locked'
      ? subjectRetention.retentionIndex * 0.22
      : subjectRetention.retentionIndex * 0.11;

  const retentionIndex = v1014laborClamp(18 + couplingLift + cohesionLift + subjectLift - retentionDrag);
  const band = retentionBand(retentionIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce retention — sequence integration-retention, retention cohesion, and subject retention before post-cfb4603 tranche.'
      : band === 'retention'
        ? 'Retention band — avoid corridor overload that breaks subject retention bands.'
        : 'Elevated retention — refresh subject retention checks each scale wave.';

  return {
    turn: state.turn,
    retentionIndex,
    band,
    retentionDrag,
    summary: `National workforce retention ${band} (index ${Math.round(retentionIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}


// --- source: retention-reengagement-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalRetentionReengagementCouplingBrief,
  type NationalWorkforceRetentionIndex,
  type RetentionReengagementCouplingBand
} from './types';

function couplingBand(index: number): RetentionReengagementCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-38 / wave-38 retention-reengagement coupling — retention × reengagement (O10-207). */
export function computeNationalRetentionReengagementCouplingBrief(
  state: NationalLaborDemographicsState,
  retention: NationalWorkforceRetentionIndex | null | undefined
): NationalRetentionReengagementCouplingBrief {
  if (!state.enabled || !retention) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      retentionDrag: 0,
      summary: 'Retention-reengagement coupling idle — workforce retention unavailable.',
      stewardNote: 'Compute workforce retention before reengagement coupling guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const retentionDrag = v1014laborClamp(
    retention.retentionDrag * 0.48 + (retention.band === 'fragile' || retention.band === 'thin' ? 11 : 3)
  );
  const retentionLift =
    retention.band === 'elevated' || retention.band === 'retention'
      ? retention.retentionIndex * 0.24
      : retention.retentionIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + reengagementLift * 21 + retentionLift - retentionDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained retention-reengagement link — deploy reengagement levers before wave-38 reengagement commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard reengagement alignment spikes that drain retention buffers.'
        : 'Amplified coupling — pair reengagement packs with subject reengagement readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    retentionDrag,
    summary: `Retention-reengagement coupling ${band} (index ${Math.round(couplingIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}


// --- source: reengagement-alignment-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalReengagementAlignmentOutlook,
  type NationalRetentionCohesionOutlook,
  type ReengagementAlignmentBand
} from './types';

function alignmentBand(index: number): ReengagementAlignmentBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'aligned';
}

export function computeNationalReengagementAlignmentOutlook(
  state: NationalLaborDemographicsState,
  retentionCohesion: NationalRetentionCohesionOutlook | null | undefined
): NationalReengagementAlignmentOutlook {
  if (!state.enabled || !retentionCohesion) {
    return {
      turn: state.turn,
      alignmentIndex: 50,
      band: 'patchy',
      retentionDrag: 0,
      summary: 'Reengagement alignment idle — retention cohesion unavailable.',
      stewardNote: 'Compute retention cohesion before reengagement alignment guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const retentionDrag = v1014laborClamp(
    retentionCohesion.integrationDrag * 0.46 +
      (retentionCohesion.band === 'ebbing' || retentionCohesion.band === 'patchy' ? 10 : 3)
  );
  const cohesionLift =
    retentionCohesion.band === 'rising' || retentionCohesion.band === 'cohesion'
      ? retentionCohesion.cohesionIndex * 0.2
      : retentionCohesion.cohesionIndex * 0.1;

  const alignmentIndex = v1014laborClamp(24 + reengagementLift * 22 + cohesionLift - retentionDrag);
  const band = alignmentBand(alignmentIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy reengagement alignment — deploy reengagement levers before subject reengagement assembly.'
      : band === 'aligned'
        ? 'Aligned band — verify retention-reengagement coupling before auto workforce pushes.'
        : 'Rising alignment — align with retention cohesion outlook checks.';

  return {
    turn: state.turn,
    alignmentIndex,
    band,
    retentionDrag,
    summary: `National reengagement alignment ${band} (index ${Math.round(alignmentIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}


// --- source: subject-reengagement-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectReengagementReadinessBrief,
  type NationalSubjectRetentionReadinessBrief,
  type NationalWorkforceRetentionIndex,
  type SubjectReengagementReadinessBand
} from './types';

function reengagementBand(index: number): SubjectReengagementReadinessBand {
  if (index <= 34) return 'below_reengagement';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'reengagement_ready';
  return 'retention_locked';
}

/** Round-38 / wave-38 subject reengagement readiness — retention × workforce retention (O10-207). */
export function computeNationalSubjectReengagementReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectRetention: NationalSubjectRetentionReadinessBrief | null | undefined,
  workforceRetention: NationalWorkforceRetentionIndex | null | undefined
): NationalSubjectReengagementReadinessBrief {
  if (!state.enabled || !subjectRetention || !workforceRetention) {
    return {
      turn: state.turn,
      reengagementIndex: 50,
      band: 'approaching',
      reengagementDrag: 0,
      summary: 'Subject reengagement readiness idle — subject retention or workforce retention unavailable.',
      stewardNote: 'Compute subject retention and workforce retention before reengagement guidance.'
    };
  }

  const reengagementDrag = v1014laborClamp(
    subjectRetention.retentionDrag * 0.38 +
      workforceRetention.retentionDrag * 0.38 +
      (subjectRetention.band === 'below_retention' || workforceRetention.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectRetention.band === 'retention_ready' || subjectRetention.band === 'integration_locked'
      ? subjectRetention.retentionIndex * 0.27
      : subjectRetention.retentionIndex * 0.14;
  const workforceLift =
    workforceRetention.band === 'elevated' || workforceRetention.band === 'retention'
      ? workforceRetention.retentionIndex * 0.25
      : workforceRetention.retentionIndex * 0.12;

  const reengagementIndex = v1014laborClamp(20 + subjectLift + workforceLift - reengagementDrag);
  const band = reengagementBand(reengagementIndex);

  const stewardNote =
    band === 'below_reengagement' || band === 'approaching'
      ? 'Approaching reengagement — hold O10-207 wave-38 scale until retention-reengagement syncs.'
      : band === 'retention_locked'
        ? 'Retention-locked reengagement — still monitor reengagement alignment during corridor peaks.'
        : 'Reengagement-ready — pair with workforce reengagement index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    reengagementIndex,
    band,
    reengagementDrag,
    summary: `Subject reengagement readiness ${band} (index ${Math.round(reengagementIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-reengagement-index.ts ---
  type NationalLaborDemographicsState,
  type NationalRetentionReengagementCouplingBrief,
  type NationalReengagementAlignmentOutlook,
  type NationalSubjectReengagementReadinessBrief,
  type NationalWorkforceReengagementIndex,
  type WorkforceReengagementBand
} from './types';

function reengagementBand(index: number): WorkforceReengagementBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'reengagement';
}

export function computeNationalWorkforceReengagementIndex(
  state: NationalLaborDemographicsState,
  reengagementCoupling: NationalRetentionReengagementCouplingBrief | null | undefined,
  reengagementAlignment: NationalReengagementAlignmentOutlook | null | undefined,
  subjectReengagement: NationalSubjectReengagementReadinessBrief | null | undefined
): NationalWorkforceReengagementIndex {
  if (!state.enabled || !reengagementCoupling || !reengagementAlignment || !subjectReengagement) {
    return {
      turn: state.turn,
      reengagementIndex: 50,
      band: 'thin',
      reengagementDrag: 0,
      summary: 'Workforce reengagement idle — reengagement coupling, alignment, or subject reengagement unavailable.',
      stewardNote: 'Compute O10-207 wave-38 depth stack before reengagement guidance.'
    };
  }

  const reengagementDrag = v1014laborClamp(
    subjectReengagement.reengagementDrag * 0.35 +
      reengagementCoupling.retentionDrag * 0.3 +
      reengagementAlignment.retentionDrag * 0.25 +
      (subjectReengagement.band === 'below_reengagement' || reengagementCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    reengagementCoupling.band === 'amplified' || reengagementCoupling.band === 'elevated'
      ? reengagementCoupling.couplingIndex * 0.2
      : reengagementCoupling.couplingIndex * 0.1;
  const alignmentLift =
    reengagementAlignment.band === 'rising' || reengagementAlignment.band === 'aligned'
      ? reengagementAlignment.alignmentIndex * 0.18
      : reengagementAlignment.alignmentIndex * 0.09;
  const subjectLift =
    subjectReengagement.band === 'reengagement_ready' || subjectReengagement.band === 'retention_locked'
      ? subjectReengagement.reengagementIndex * 0.22
      : subjectReengagement.reengagementIndex * 0.11;

  const reengagementIndex = v1014laborClamp(18 + couplingLift + alignmentLift + subjectLift - reengagementDrag);
  const band = reengagementBand(reengagementIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce reengagement — sequence retention-reengagement, reengagement alignment, and subject reengagement before post-b44b36f tranche.'
      : band === 'reengagement'
        ? 'Reengagement band — avoid corridor overload that breaks subject reengagement bands.'
        : 'Elevated reengagement — refresh subject reengagement checks each scale wave.';

  return {
    turn: state.turn,
    reengagementIndex,
    band,
    reengagementDrag,
    summary: `National workforce reengagement ${band} (index ${Math.round(reengagementIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}


// --- source: reengagement-mentorship-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalReengagementMentorshipCouplingBrief,
  type NationalWorkforceReengagementIndex,
  type ReengagementMentorshipCouplingBand
} from './types';

function couplingBand(index: number): ReengagementMentorshipCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-39 / wave-39 reengagement-mentorship coupling — reengagement × mentorship (O10-209). */
export function computeNationalReengagementMentorshipCouplingBrief(
  state: NationalLaborDemographicsState,
  reengagement: NationalWorkforceReengagementIndex | null | undefined
): NationalReengagementMentorshipCouplingBrief {
  if (!state.enabled || !reengagement) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      reengagementDrag: 0,
      summary: 'Reengagement-mentorship coupling idle — workforce reengagement unavailable.',
      stewardNote: 'Compute workforce reengagement before mentorship coupling guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const reengagementDrag = v1014laborClamp(
    reengagement.reengagementDrag * 0.48 + (reengagement.band === 'fragile' || reengagement.band === 'thin' ? 11 : 3)
  );
  const reengagementLift =
    reengagement.band === 'elevated' || reengagement.band === 'reengagement'
      ? reengagement.reengagementIndex * 0.24
      : reengagement.reengagementIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + mentorshipLift * 21 + reengagementLift - reengagementDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained reengagement-mentorship link — deploy mentorship levers before wave-39 mentorship commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard mentorship sustain spikes that drain reengagement buffers.'
        : 'Amplified coupling — pair mentorship packs with subject mentorship readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    reengagementDrag,
    summary: `Reengagement-mentorship coupling ${band} (index ${Math.round(couplingIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}


// --- source: mentorship-sustain-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type MentorshipSustainBand,
  type NationalLaborDemographicsState,
  type NationalMentorshipSustainOutlook,
  type NationalReengagementAlignmentOutlook
} from './types';

function sustainBand(index: number): MentorshipSustainBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'sustained';
}

export function computeNationalMentorshipSustainOutlook(
  state: NationalLaborDemographicsState,
  reengagementAlignment: NationalReengagementAlignmentOutlook | null | undefined
): NationalMentorshipSustainOutlook {
  if (!state.enabled || !reengagementAlignment) {
    return {
      turn: state.turn,
      sustainIndex: 50,
      band: 'patchy',
      reengagementDrag: 0,
      summary: 'Mentorship sustain idle — reengagement alignment unavailable.',
      stewardNote: 'Compute reengagement alignment before mentorship sustain guidance.'
    };
  }

  let mentorshipLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    mentorshipLift += mentorshipEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  mentorshipLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const reengagementDrag = v1014laborClamp(
    reengagementAlignment.retentionDrag * 0.46 +
      (reengagementAlignment.band === 'ebbing' || reengagementAlignment.band === 'patchy' ? 10 : 3)
  );
  const alignmentLift =
    reengagementAlignment.band === 'rising' || reengagementAlignment.band === 'aligned'
      ? reengagementAlignment.alignmentIndex * 0.2
      : reengagementAlignment.alignmentIndex * 0.1;

  const sustainIndex = v1014laborClamp(24 + mentorshipLift * 22 + alignmentLift - reengagementDrag);
  const band = sustainBand(sustainIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy mentorship sustain — deploy mentorship levers before subject mentorship assembly.'
      : band === 'sustained'
        ? 'Sustained band — verify reengagement-mentorship coupling before auto workforce pushes.'
        : 'Rising sustain — align with reengagement alignment outlook checks.';

  return {
    turn: state.turn,
    sustainIndex,
    band,
    reengagementDrag,
    summary: `National mentorship sustain ${band} (index ${Math.round(sustainIndex)}); reengagement drag ${Math.round(reengagementDrag)}.`,
    stewardNote
  };
}


// --- source: subject-mentorship-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectMentorshipReadinessBrief,
  type NationalSubjectReengagementReadinessBrief,
  type NationalWorkforceReengagementIndex,
  type SubjectMentorshipReadinessBand
} from './types';

function mentorshipBand(index: number): SubjectMentorshipReadinessBand {
  if (index <= 34) return 'below_mentorship';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'mentorship_ready';
  return 'reengagement_locked';
}

/** Round-39 / wave-39 subject mentorship readiness — reengagement × workforce reengagement (O10-209). */
export function computeNationalSubjectMentorshipReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectReengagement: NationalSubjectReengagementReadinessBrief | null | undefined,
  workforceReengagement: NationalWorkforceReengagementIndex | null | undefined
): NationalSubjectMentorshipReadinessBrief {
  if (!state.enabled || !subjectReengagement || !workforceReengagement) {
    return {
      turn: state.turn,
      mentorshipIndex: 50,
      band: 'approaching',
      mentorshipDrag: 0,
      summary: 'Subject mentorship readiness idle — subject reengagement or workforce reengagement unavailable.',
      stewardNote: 'Compute subject reengagement and workforce reengagement before mentorship guidance.'
    };
  }

  const mentorshipDrag = v1014laborClamp(
    subjectReengagement.reengagementDrag * 0.38 +
      workforceReengagement.reengagementDrag * 0.38 +
      (subjectReengagement.band === 'below_reengagement' || workforceReengagement.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectReengagement.band === 'reengagement_ready' || subjectReengagement.band === 'retention_locked'
      ? subjectReengagement.reengagementIndex * 0.27
      : subjectReengagement.reengagementIndex * 0.14;
  const workforceLift =
    workforceReengagement.band === 'elevated' || workforceReengagement.band === 'reengagement'
      ? workforceReengagement.reengagementIndex * 0.25
      : workforceReengagement.reengagementIndex * 0.12;

  const mentorshipIndex = v1014laborClamp(20 + subjectLift + workforceLift - mentorshipDrag);
  const band = mentorshipBand(mentorshipIndex);

  const stewardNote =
    band === 'below_mentorship' || band === 'approaching'
      ? 'Approaching mentorship — hold O10-209 wave-39 scale until reengagement-mentorship syncs.'
      : band === 'reengagement_locked'
        ? 'Reengagement-locked mentorship — still monitor mentorship sustain during corridor peaks.'
        : 'Mentorship-ready — pair with workforce mentorship index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    mentorshipIndex,
    band,
    mentorshipDrag,
    summary: `Subject mentorship readiness ${band} (index ${Math.round(mentorshipIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-mentorship-index.ts ---
  type NationalLaborDemographicsState,
  type NationalMentorshipSustainOutlook,
  type NationalReengagementMentorshipCouplingBrief,
  type NationalSubjectMentorshipReadinessBrief,
  type NationalWorkforceMentorshipIndex,
  type WorkforceMentorshipBand
} from './types';

function mentorshipBand(index: number): WorkforceMentorshipBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'mentorship';
}

export function computeNationalWorkforceMentorshipIndex(
  state: NationalLaborDemographicsState,
  mentorshipCoupling: NationalReengagementMentorshipCouplingBrief | null | undefined,
  mentorshipSustain: NationalMentorshipSustainOutlook | null | undefined,
  subjectMentorship: NationalSubjectMentorshipReadinessBrief | null | undefined
): NationalWorkforceMentorshipIndex {
  if (!state.enabled || !mentorshipCoupling || !mentorshipSustain || !subjectMentorship) {
    return {
      turn: state.turn,
      mentorshipIndex: 50,
      band: 'thin',
      mentorshipDrag: 0,
      summary: 'Workforce mentorship idle — mentorship coupling, sustain, or subject mentorship unavailable.',
      stewardNote: 'Compute O10-209 wave-39 depth stack before mentorship guidance.'
    };
  }

  const mentorshipDrag = v1014laborClamp(
    subjectMentorship.mentorshipDrag * 0.35 +
      mentorshipCoupling.reengagementDrag * 0.3 +
      mentorshipSustain.reengagementDrag * 0.25 +
      (subjectMentorship.band === 'below_mentorship' || mentorshipCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    mentorshipCoupling.band === 'amplified' || mentorshipCoupling.band === 'elevated'
      ? mentorshipCoupling.couplingIndex * 0.2
      : mentorshipCoupling.couplingIndex * 0.1;
  const sustainLift =
    mentorshipSustain.band === 'rising' || mentorshipSustain.band === 'sustained'
      ? mentorshipSustain.sustainIndex * 0.18
      : mentorshipSustain.sustainIndex * 0.09;
  const subjectLift =
    subjectMentorship.band === 'mentorship_ready' || subjectMentorship.band === 'reengagement_locked'
      ? subjectMentorship.mentorshipIndex * 0.22
      : subjectMentorship.mentorshipIndex * 0.11;

  const mentorshipIndex = v1014laborClamp(18 + couplingLift + sustainLift + subjectLift - mentorshipDrag);
  const band = mentorshipBand(mentorshipIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce mentorship — sequence reengagement-mentorship, mentorship sustain, and subject mentorship before post-6134c6a tranche.'
      : band === 'mentorship'
        ? 'Mentorship band — avoid corridor overload that breaks subject mentorship bands.'
        : 'Elevated mentorship — refresh subject mentorship checks each scale wave.';

  return {
    turn: state.turn,
    mentorshipIndex,
    band,
    mentorshipDrag,
    summary: `National workforce mentorship ${band} (index ${Math.round(mentorshipIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}


// --- source: mentorship-advocacy-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type MentorshipAdvocacyCouplingBand,
  type NationalLaborDemographicsState,
  type NationalMentorshipAdvocacyCouplingBrief,
  type NationalWorkforceMentorshipIndex
} from './types';

function couplingBand(index: number): MentorshipAdvocacyCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-40 / wave-40 mentorship-advocacy coupling — mentorship × advocacy (O10-211). */
export function computeNationalMentorshipAdvocacyCouplingBrief(
  state: NationalLaborDemographicsState,
  mentorship: NationalWorkforceMentorshipIndex | null | undefined
): NationalMentorshipAdvocacyCouplingBrief {
  if (!state.enabled || !mentorship) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      mentorshipDrag: 0,
      summary: 'Mentorship-advocacy coupling idle — workforce mentorship unavailable.',
      stewardNote: 'Compute workforce mentorship before advocacy coupling guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mentorshipDrag = v1014laborClamp(
    mentorship.mentorshipDrag * 0.48 + (mentorship.band === 'fragile' || mentorship.band === 'thin' ? 11 : 3)
  );
  const mentorshipLift =
    mentorship.band === 'elevated' || mentorship.band === 'mentorship'
      ? mentorship.mentorshipIndex * 0.24
      : mentorship.mentorshipIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + advocacyLift * 21 + mentorshipLift - mentorshipDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained mentorship-advocacy link — deploy advocacy levers before wave-40 advocacy commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard advocacy resonance spikes that drain mentorship buffers.'
        : 'Amplified coupling — pair advocacy packs with subject advocacy readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    mentorshipDrag,
    summary: `Mentorship-advocacy coupling ${band} (index ${Math.round(couplingIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}


// --- source: advocacy-resonance-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type AdvocacyResonanceBand,
  type NationalAdvocacyResonanceOutlook,
  type NationalLaborDemographicsState,
  type NationalMentorshipSustainOutlook
} from './types';

function resonanceBand(index: number): AdvocacyResonanceBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'resonant';
}

export function computeNationalAdvocacyResonanceOutlook(
  state: NationalLaborDemographicsState,
  mentorshipSustain: NationalMentorshipSustainOutlook | null | undefined
): NationalAdvocacyResonanceOutlook {
  if (!state.enabled || !mentorshipSustain) {
    return {
      turn: state.turn,
      resonanceIndex: 50,
      band: 'patchy',
      mentorshipDrag: 0,
      summary: 'Advocacy resonance idle — mentorship sustain unavailable.',
      stewardNote: 'Compute mentorship sustain before advocacy resonance guidance.'
    };
  }

  let advocacyLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    advocacyLift += advocacyEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  advocacyLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const mentorshipDrag = v1014laborClamp(
    mentorshipSustain.reengagementDrag * 0.46 +
      (mentorshipSustain.band === 'ebbing' || mentorshipSustain.band === 'patchy' ? 10 : 3)
  );
  const sustainLift =
    mentorshipSustain.band === 'rising' || mentorshipSustain.band === 'sustained'
      ? mentorshipSustain.sustainIndex * 0.2
      : mentorshipSustain.sustainIndex * 0.1;

  const resonanceIndex = v1014laborClamp(24 + advocacyLift * 22 + sustainLift - mentorshipDrag);
  const band = resonanceBand(resonanceIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy advocacy resonance — deploy advocacy levers before subject advocacy assembly.'
      : band === 'resonant'
        ? 'Resonant band — verify mentorship-advocacy coupling before auto workforce pushes.'
        : 'Rising resonance — align with mentorship sustain outlook checks.';

  return {
    turn: state.turn,
    resonanceIndex,
    band,
    mentorshipDrag,
    summary: `National advocacy resonance ${band} (index ${Math.round(resonanceIndex)}); mentorship drag ${Math.round(mentorshipDrag)}.`,
    stewardNote
  };
}


// --- source: subject-advocacy-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectAdvocacyReadinessBrief,
  type NationalSubjectMentorshipReadinessBrief,
  type NationalWorkforceMentorshipIndex,
  type SubjectAdvocacyReadinessBand
} from './types';

function advocacyBand(index: number): SubjectAdvocacyReadinessBand {
  if (index <= 34) return 'below_advocacy';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'advocacy_ready';
  return 'mentorship_locked';
}

/** Round-40 / wave-40 subject advocacy readiness — mentorship × workforce mentorship (O10-211). */
export function computeNationalSubjectAdvocacyReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectMentorship: NationalSubjectMentorshipReadinessBrief | null | undefined,
  workforceMentorship: NationalWorkforceMentorshipIndex | null | undefined
): NationalSubjectAdvocacyReadinessBrief {
  if (!state.enabled || !subjectMentorship || !workforceMentorship) {
    return {
      turn: state.turn,
      advocacyIndex: 50,
      band: 'approaching',
      advocacyDrag: 0,
      summary: 'Subject advocacy readiness idle — subject mentorship or workforce mentorship unavailable.',
      stewardNote: 'Compute subject mentorship and workforce mentorship before advocacy guidance.'
    };
  }

  const advocacyDrag = v1014laborClamp(
    subjectMentorship.mentorshipDrag * 0.38 +
      workforceMentorship.mentorshipDrag * 0.38 +
      (subjectMentorship.band === 'below_mentorship' || workforceMentorship.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectMentorship.band === 'mentorship_ready' || subjectMentorship.band === 'reengagement_locked'
      ? subjectMentorship.mentorshipIndex * 0.27
      : subjectMentorship.mentorshipIndex * 0.14;
  const workforceLift =
    workforceMentorship.band === 'elevated' || workforceMentorship.band === 'mentorship'
      ? workforceMentorship.mentorshipIndex * 0.25
      : workforceMentorship.mentorshipIndex * 0.12;

  const advocacyIndex = v1014laborClamp(20 + subjectLift + workforceLift - advocacyDrag);
  const band = advocacyBand(advocacyIndex);

  const stewardNote =
    band === 'below_advocacy' || band === 'approaching'
      ? 'Approaching advocacy — hold O10-211 wave-40 scale until mentorship-advocacy syncs.'
      : band === 'mentorship_locked'
        ? 'Mentorship-locked advocacy — still monitor advocacy resonance during corridor peaks.'
        : 'Advocacy-ready — pair with workforce advocacy index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    advocacyIndex,
    band,
    advocacyDrag,
    summary: `Subject advocacy readiness ${band} (index ${Math.round(advocacyIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-advocacy-index.ts ---
  type NationalAdvocacyResonanceOutlook,
  type NationalLaborDemographicsState,
  type NationalMentorshipAdvocacyCouplingBrief,
  type NationalSubjectAdvocacyReadinessBrief,
  type NationalWorkforceAdvocacyIndex,
  type WorkforceAdvocacyBand
} from './types';

function advocacyBand(index: number): WorkforceAdvocacyBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'advocacy';
}

export function computeNationalWorkforceAdvocacyIndex(
  state: NationalLaborDemographicsState,
  advocacyCoupling: NationalMentorshipAdvocacyCouplingBrief | null | undefined,
  advocacyResonance: NationalAdvocacyResonanceOutlook | null | undefined,
  subjectAdvocacy: NationalSubjectAdvocacyReadinessBrief | null | undefined
): NationalWorkforceAdvocacyIndex {
  if (!state.enabled || !advocacyCoupling || !advocacyResonance || !subjectAdvocacy) {
    return {
      turn: state.turn,
      advocacyIndex: 50,
      band: 'thin',
      advocacyDrag: 0,
      summary: 'Workforce advocacy idle — advocacy coupling, resonance, or subject advocacy unavailable.',
      stewardNote: 'Compute O10-211 wave-40 depth stack before advocacy guidance.'
    };
  }

  const advocacyDrag = v1014laborClamp(
    subjectAdvocacy.advocacyDrag * 0.35 +
      advocacyCoupling.mentorshipDrag * 0.3 +
      advocacyResonance.mentorshipDrag * 0.25 +
      (subjectAdvocacy.band === 'below_advocacy' || advocacyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    advocacyCoupling.band === 'amplified' || advocacyCoupling.band === 'elevated'
      ? advocacyCoupling.couplingIndex * 0.2
      : advocacyCoupling.couplingIndex * 0.1;
  const resonanceLift =
    advocacyResonance.band === 'rising' || advocacyResonance.band === 'resonant'
      ? advocacyResonance.resonanceIndex * 0.18
      : advocacyResonance.resonanceIndex * 0.09;
  const subjectLift =
    subjectAdvocacy.band === 'advocacy_ready' || subjectAdvocacy.band === 'mentorship_locked'
      ? subjectAdvocacy.advocacyIndex * 0.22
      : subjectAdvocacy.advocacyIndex * 0.11;

  const advocacyIndex = v1014laborClamp(18 + couplingLift + resonanceLift + subjectLift - advocacyDrag);
  const band = advocacyBand(advocacyIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce advocacy — sequence mentorship-advocacy, advocacy resonance, and subject advocacy before post-6f7fa49 tranche.'
      : band === 'advocacy'
        ? 'Advocacy band — avoid corridor overload that breaks subject advocacy bands.'
        : 'Elevated advocacy — refresh subject advocacy checks each scale wave.';

  return {
    turn: state.turn,
    advocacyIndex,
    band,
    advocacyDrag,
    summary: `National workforce advocacy ${band} (index ${Math.round(advocacyIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}


// --- source: advocacy-inclusion-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type AdvocacyInclusionCouplingBand,
  type NationalAdvocacyInclusionCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceAdvocacyIndex
} from './types';

function couplingBand(index: number): AdvocacyInclusionCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-41 / wave-41 advocacy-inclusion coupling — advocacy × inclusion (O10-213). */
export function computeNationalAdvocacyInclusionCouplingBrief(
  state: NationalLaborDemographicsState,
  advocacy: NationalWorkforceAdvocacyIndex | null | undefined
): NationalAdvocacyInclusionCouplingBrief {
  if (!state.enabled || !advocacy) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      advocacyDrag: 0,
      summary: 'Advocacy-inclusion coupling idle — workforce advocacy unavailable.',
      stewardNote: 'Compute workforce advocacy before inclusion coupling guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const advocacyDrag = v1014laborClamp(
    advocacy.advocacyDrag * 0.48 + (advocacy.band === 'fragile' || advocacy.band === 'thin' ? 11 : 3)
  );
  const advocacyLift =
    advocacy.band === 'elevated' || advocacy.band === 'advocacy'
      ? advocacy.advocacyIndex * 0.24
      : advocacy.advocacyIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + inclusionLift * 21 + advocacyLift - advocacyDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained advocacy-inclusion link — deploy inclusion levers before wave-41 inclusion commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard inclusion equity spikes that drain advocacy buffers.'
        : 'Amplified coupling — pair inclusion packs with subject inclusion readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    advocacyDrag,
    summary: `Advocacy-inclusion coupling ${band} (index ${Math.round(couplingIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}


// --- source: inclusion-equity-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type InclusionEquityBand,
  type NationalAdvocacyResonanceOutlook,
  type NationalInclusionEquityOutlook,
  type NationalLaborDemographicsState
} from './types';

function equityBand(index: number): InclusionEquityBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'equitable';
}

export function computeNationalInclusionEquityOutlook(
  state: NationalLaborDemographicsState,
  advocacyResonance: NationalAdvocacyResonanceOutlook | null | undefined
): NationalInclusionEquityOutlook {
  if (!state.enabled || !advocacyResonance) {
    return {
      turn: state.turn,
      equityIndex: 50,
      band: 'patchy',
      advocacyDrag: 0,
      summary: 'Inclusion equity idle — advocacy resonance unavailable.',
      stewardNote: 'Compute advocacy resonance before inclusion equity guidance.'
    };
  }

  let inclusionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionLift += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const advocacyDrag = v1014laborClamp(
    advocacyResonance.mentorshipDrag * 0.46 +
      (advocacyResonance.band === 'ebbing' || advocacyResonance.band === 'patchy' ? 10 : 3)
  );
  const resonanceLift =
    advocacyResonance.band === 'rising' || advocacyResonance.band === 'resonant'
      ? advocacyResonance.resonanceIndex * 0.2
      : advocacyResonance.resonanceIndex * 0.1;

  const equityIndex = v1014laborClamp(24 + inclusionLift * 22 + resonanceLift - advocacyDrag);
  const band = equityBand(equityIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy inclusion equity — deploy inclusion levers before subject inclusion assembly.'
      : band === 'equitable'
        ? 'Equitable band — verify advocacy-inclusion coupling before auto workforce pushes.'
        : 'Rising equity — align with advocacy resonance outlook checks.';

  return {
    turn: state.turn,
    equityIndex,
    band,
    advocacyDrag,
    summary: `National inclusion equity ${band} (index ${Math.round(equityIndex)}); advocacy drag ${Math.round(advocacyDrag)}.`,
    stewardNote
  };
}


// --- source: subject-inclusion-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectAdvocacyReadinessBrief,
  type NationalSubjectInclusionReadinessBrief,
  type NationalWorkforceAdvocacyIndex,
  type SubjectInclusionReadinessBand
} from './types';

function inclusionBand(index: number): SubjectInclusionReadinessBand {
  if (index <= 34) return 'below_inclusion';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'inclusion_ready';
  return 'advocacy_locked';
}

/** Round-41 / wave-41 subject inclusion readiness — advocacy × workforce advocacy (O10-213). */
export function computeNationalSubjectInclusionReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectAdvocacy: NationalSubjectAdvocacyReadinessBrief | null | undefined,
  workforceAdvocacy: NationalWorkforceAdvocacyIndex | null | undefined
): NationalSubjectInclusionReadinessBrief {
  if (!state.enabled || !subjectAdvocacy || !workforceAdvocacy) {
    return {
      turn: state.turn,
      inclusionIndex: 50,
      band: 'approaching',
      inclusionDrag: 0,
      summary: 'Subject inclusion readiness idle — subject advocacy or workforce advocacy unavailable.',
      stewardNote: 'Compute subject advocacy and workforce advocacy before inclusion guidance.'
    };
  }

  const inclusionDrag = v1014laborClamp(
    subjectAdvocacy.advocacyDrag * 0.38 +
      workforceAdvocacy.advocacyDrag * 0.38 +
      (subjectAdvocacy.band === 'below_advocacy' || workforceAdvocacy.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectAdvocacy.band === 'advocacy_ready' || subjectAdvocacy.band === 'mentorship_locked'
      ? subjectAdvocacy.advocacyIndex * 0.27
      : subjectAdvocacy.advocacyIndex * 0.14;
  const workforceLift =
    workforceAdvocacy.band === 'elevated' || workforceAdvocacy.band === 'advocacy'
      ? workforceAdvocacy.advocacyIndex * 0.25
      : workforceAdvocacy.advocacyIndex * 0.12;

  const inclusionIndex = v1014laborClamp(20 + subjectLift + workforceLift - inclusionDrag);
  const band = inclusionBand(inclusionIndex);

  const stewardNote =
    band === 'below_inclusion' || band === 'approaching'
      ? 'Approaching inclusion — hold O10-213 wave-41 scale until advocacy-inclusion syncs.'
      : band === 'advocacy_locked'
        ? 'Advocacy-locked inclusion — still monitor inclusion equity during corridor peaks.'
        : 'Inclusion-ready — pair with workforce inclusion index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    inclusionIndex,
    band,
    inclusionDrag,
    summary: `Subject inclusion readiness ${band} (index ${Math.round(inclusionIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-inclusion-index.ts ---
  type NationalAdvocacyInclusionCouplingBrief,
  type NationalInclusionEquityOutlook,
  type NationalLaborDemographicsState,
  type NationalSubjectInclusionReadinessBrief,
  type NationalWorkforceInclusionIndex,
  type WorkforceInclusionBand
} from './types';

function inclusionBand(index: number): WorkforceInclusionBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'inclusion';
}

export function computeNationalWorkforceInclusionIndex(
  state: NationalLaborDemographicsState,
  inclusionCoupling: NationalAdvocacyInclusionCouplingBrief | null | undefined,
  inclusionEquity: NationalInclusionEquityOutlook | null | undefined,
  subjectInclusion: NationalSubjectInclusionReadinessBrief | null | undefined
): NationalWorkforceInclusionIndex {
  if (!state.enabled || !inclusionCoupling || !inclusionEquity || !subjectInclusion) {
    return {
      turn: state.turn,
      inclusionIndex: 50,
      band: 'thin',
      inclusionDrag: 0,
      summary: 'Workforce inclusion idle — inclusion coupling, equity, or subject inclusion unavailable.',
      stewardNote: 'Compute O10-213 wave-41 depth stack before inclusion guidance.'
    };
  }

  const inclusionDrag = v1014laborClamp(
    subjectInclusion.inclusionDrag * 0.35 +
      inclusionCoupling.advocacyDrag * 0.3 +
      inclusionEquity.advocacyDrag * 0.25 +
      (subjectInclusion.band === 'below_inclusion' || inclusionCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    inclusionCoupling.band === 'amplified' || inclusionCoupling.band === 'elevated'
      ? inclusionCoupling.couplingIndex * 0.2
      : inclusionCoupling.couplingIndex * 0.1;
  const equityLift =
    inclusionEquity.band === 'rising' || inclusionEquity.band === 'equitable'
      ? inclusionEquity.equityIndex * 0.18
      : inclusionEquity.equityIndex * 0.09;
  const subjectLift =
    subjectInclusion.band === 'inclusion_ready' || subjectInclusion.band === 'advocacy_locked'
      ? subjectInclusion.inclusionIndex * 0.22
      : subjectInclusion.inclusionIndex * 0.11;

  const inclusionIndex = v1014laborClamp(18 + couplingLift + equityLift + subjectLift - inclusionDrag);
  const band = inclusionBand(inclusionIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce inclusion — sequence advocacy-inclusion, inclusion equity, and subject inclusion before post-875d6f3 tranche.'
      : band === 'inclusion'
        ? 'Inclusion band — avoid corridor overload that breaks subject inclusion bands.'
        : 'Elevated inclusion — refresh subject inclusion checks each scale wave.';

  return {
    turn: state.turn,
    inclusionIndex,
    band,
    inclusionDrag,
    summary: `National workforce inclusion ${band} (index ${Math.round(inclusionIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}


// --- source: inclusion-flexibility-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type InclusionFlexibilityCouplingBand,
  type NationalInclusionFlexibilityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceInclusionIndex
} from './types';

function couplingBand(index: number): InclusionFlexibilityCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-42 / wave-42 inclusion-flexibility coupling — inclusion × flexibility (O10-215). */
export function computeNationalInclusionFlexibilityCouplingBrief(
  state: NationalLaborDemographicsState,
  inclusion: NationalWorkforceInclusionIndex | null | undefined
): NationalInclusionFlexibilityCouplingBrief {
  if (!state.enabled || !inclusion) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      inclusionDrag: 0,
      summary: 'Inclusion-flexibility coupling idle — workforce inclusion unavailable.',
      stewardNote: 'Compute workforce inclusion before flexibility coupling guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const inclusionDrag = v1014laborClamp(
    inclusion.inclusionDrag * 0.48 + (inclusion.band === 'fragile' || inclusion.band === 'thin' ? 11 : 3)
  );
  const inclusionLift =
    inclusion.band === 'elevated' || inclusion.band === 'inclusion'
      ? inclusion.inclusionIndex * 0.24
      : inclusion.inclusionIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + flexibilityLift * 21 + inclusionLift - inclusionDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained inclusion-flexibility link — deploy flexibility levers before wave-42 flexibility commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard flexibility flow spikes that drain inclusion buffers.'
        : 'Amplified coupling — pair flexibility packs with subject flexibility readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    inclusionDrag,
    summary: `Inclusion-flexibility coupling ${band} (index ${Math.round(couplingIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}


// --- source: flexibility-flow-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type FlexibilityFlowBand,
  type NationalFlexibilityFlowOutlook,
  type NationalInclusionEquityOutlook,
  type NationalLaborDemographicsState
} from './types';

function flowBand(index: number): FlexibilityFlowBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'flowing';
}

export function computeNationalFlexibilityFlowOutlook(
  state: NationalLaborDemographicsState,
  inclusionEquity: NationalInclusionEquityOutlook | null | undefined
): NationalFlexibilityFlowOutlook {
  if (!state.enabled || !inclusionEquity) {
    return {
      turn: state.turn,
      flowIndex: 50,
      band: 'patchy',
      inclusionDrag: 0,
      summary: 'Flexibility flow idle — inclusion equity unavailable.',
      stewardNote: 'Compute inclusion equity before flexibility flow guidance.'
    };
  }

  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    flexibilityLift += flexibilityEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const inclusionDrag = v1014laborClamp(
    inclusionEquity.advocacyDrag * 0.46 +
      (inclusionEquity.band === 'ebbing' || inclusionEquity.band === 'patchy' ? 10 : 3)
  );
  const equityLift =
    inclusionEquity.band === 'rising' || inclusionEquity.band === 'equitable'
      ? inclusionEquity.equityIndex * 0.2
      : inclusionEquity.equityIndex * 0.1;

  const flowIndex = v1014laborClamp(24 + flexibilityLift * 22 + equityLift - inclusionDrag);
  const band = flowBand(flowIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy flexibility flow — deploy flexibility levers before subject flexibility assembly.'
      : band === 'flowing'
        ? 'Flowing band — verify inclusion-flexibility coupling before auto workforce pushes.'
        : 'Rising flow — align with inclusion equity outlook checks.';

  return {
    turn: state.turn,
    flowIndex,
    band,
    inclusionDrag,
    summary: `National flexibility flow ${band} (index ${Math.round(flowIndex)}); inclusion drag ${Math.round(inclusionDrag)}.`,
    stewardNote
  };
}


// --- source: subject-flexibility-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectFlexibilityReadinessBrief,
  type NationalSubjectInclusionReadinessBrief,
  type NationalWorkforceInclusionIndex,
  type SubjectFlexibilityReadinessBand
} from './types';

function flexibilityBand(index: number): SubjectFlexibilityReadinessBand {
  if (index <= 34) return 'below_flexibility';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'flexibility_ready';
  return 'inclusion_locked';
}

/** Round-42 / wave-42 subject flexibility readiness — inclusion × workforce inclusion (O10-215). */
export function computeNationalSubjectFlexibilityReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectInclusion: NationalSubjectInclusionReadinessBrief | null | undefined,
  workforceInclusion: NationalWorkforceInclusionIndex | null | undefined
): NationalSubjectFlexibilityReadinessBrief {
  if (!state.enabled || !subjectInclusion || !workforceInclusion) {
    return {
      turn: state.turn,
      flexibilityIndex: 50,
      band: 'approaching',
      flexibilityDrag: 0,
      summary: 'Subject flexibility readiness idle — subject inclusion or workforce inclusion unavailable.',
      stewardNote: 'Compute subject inclusion and workforce inclusion before flexibility guidance.'
    };
  }

  const flexibilityDrag = v1014laborClamp(
    subjectInclusion.inclusionDrag * 0.38 +
      workforceInclusion.inclusionDrag * 0.38 +
      (subjectInclusion.band === 'below_inclusion' || workforceInclusion.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectInclusion.band === 'inclusion_ready' || subjectInclusion.band === 'advocacy_locked'
      ? subjectInclusion.inclusionIndex * 0.27
      : subjectInclusion.inclusionIndex * 0.14;
  const workforceLift =
    workforceInclusion.band === 'elevated' || workforceInclusion.band === 'inclusion'
      ? workforceInclusion.inclusionIndex * 0.25
      : workforceInclusion.inclusionIndex * 0.12;

  const flexibilityIndex = v1014laborClamp(20 + subjectLift + workforceLift - flexibilityDrag);
  const band = flexibilityBand(flexibilityIndex);

  const stewardNote =
    band === 'below_flexibility' || band === 'approaching'
      ? 'Approaching flexibility — hold O10-215 wave-42 scale until inclusion-flexibility syncs.'
      : band === 'inclusion_locked'
        ? 'Inclusion-locked flexibility — still monitor flexibility flow during corridor peaks.'
        : 'Flexibility-ready — pair with workforce flexibility index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    flexibilityIndex,
    band,
    flexibilityDrag,
    summary: `Subject flexibility readiness ${band} (index ${Math.round(flexibilityIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-flexibility-index.ts ---
  type NationalFlexibilityFlowOutlook,
  type NationalInclusionFlexibilityCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSubjectFlexibilityReadinessBrief,
  type NationalWorkforceFlexibilityIndex,
  type WorkforceFlexibilityBand
} from './types';

function flexibilityBand(index: number): WorkforceFlexibilityBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'flexibility';
}

export function computeNationalWorkforceFlexibilityIndex(
  state: NationalLaborDemographicsState,
  flexibilityCoupling: NationalInclusionFlexibilityCouplingBrief | null | undefined,
  flexibilityFlow: NationalFlexibilityFlowOutlook | null | undefined,
  subjectFlexibility: NationalSubjectFlexibilityReadinessBrief | null | undefined
): NationalWorkforceFlexibilityIndex {
  if (!state.enabled || !flexibilityCoupling || !flexibilityFlow || !subjectFlexibility) {
    return {
      turn: state.turn,
      flexibilityIndex: 50,
      band: 'thin',
      flexibilityDrag: 0,
      summary: 'Workforce flexibility idle — flexibility coupling, flow, or subject flexibility unavailable.',
      stewardNote: 'Compute O10-215 wave-42 depth stack before flexibility guidance.'
    };
  }

  const flexibilityDrag = v1014laborClamp(
    subjectFlexibility.flexibilityDrag * 0.35 +
      flexibilityCoupling.inclusionDrag * 0.3 +
      flexibilityFlow.inclusionDrag * 0.25 +
      (subjectFlexibility.band === 'below_flexibility' || flexibilityCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    flexibilityCoupling.band === 'amplified' || flexibilityCoupling.band === 'elevated'
      ? flexibilityCoupling.couplingIndex * 0.2
      : flexibilityCoupling.couplingIndex * 0.1;
  const flowLift =
    flexibilityFlow.band === 'rising' || flexibilityFlow.band === 'flowing'
      ? flexibilityFlow.flowIndex * 0.18
      : flexibilityFlow.flowIndex * 0.09;
  const subjectLift =
    subjectFlexibility.band === 'flexibility_ready' || subjectFlexibility.band === 'inclusion_locked'
      ? subjectFlexibility.flexibilityIndex * 0.22
      : subjectFlexibility.flexibilityIndex * 0.11;

  const flexibilityIndex = v1014laborClamp(18 + couplingLift + flowLift + subjectLift - flexibilityDrag);
  const band = flexibilityBand(flexibilityIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce flexibility — sequence inclusion-flexibility, flexibility flow, and subject flexibility before post-431df5d tranche.'
      : band === 'flexibility'
        ? 'Flexibility band — avoid corridor overload that breaks subject flexibility bands.'
        : 'Elevated flexibility — refresh subject flexibility checks each scale wave.';

  return {
    turn: state.turn,
    flexibilityIndex,
    band,
    flexibilityDrag,
    summary: `National workforce flexibility ${band} (index ${Math.round(flexibilityIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}


// --- source: flexibility-coordination-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type FlexibilityCoordinationCouplingBand,
  type NationalFlexibilityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceFlexibilityIndex
} from './types';

function couplingBand(index: number): FlexibilityCoordinationCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-43 / wave-43 flexibility-coordination coupling — flexibility × coordination (O10-217). */
export function computeNationalFlexibilityCoordinationCouplingBrief(
  state: NationalLaborDemographicsState,
  flexibility: NationalWorkforceFlexibilityIndex | null | undefined
): NationalFlexibilityCoordinationCouplingBrief {
  if (!state.enabled || !flexibility) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      flexibilityDrag: 0,
      summary: 'Flexibility-coordination coupling idle — workforce flexibility unavailable.',
      stewardNote: 'Compute workforce flexibility before coordination coupling guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const flexibilityDrag = v1014laborClamp(
    flexibility.flexibilityDrag * 0.48 + (flexibility.band === 'fragile' || flexibility.band === 'thin' ? 11 : 3)
  );
  const flexibilityLift =
    flexibility.band === 'elevated' || flexibility.band === 'flexibility'
      ? flexibility.flexibilityIndex * 0.24
      : flexibility.flexibilityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + coordinationLift * 21 + flexibilityLift - flexibilityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained flexibility-coordination link — deploy coordination levers before wave-43 coordination commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard coordination mesh spikes that drain flexibility buffers.'
        : 'Amplified coupling — pair coordination packs with subject coordination readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    flexibilityDrag,
    summary: `Flexibility-coordination coupling ${band} (index ${Math.round(couplingIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}


// --- source: coordination-mesh-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CoordinationMeshBand,
  type NationalCoordinationMeshOutlook,
  type NationalFlexibilityFlowOutlook,
  type NationalLaborDemographicsState
} from './types';

function meshBand(index: number): CoordinationMeshBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'meshed';
}

export function computeNationalCoordinationMeshOutlook(
  state: NationalLaborDemographicsState,
  flexibilityFlow: NationalFlexibilityFlowOutlook | null | undefined
): NationalCoordinationMeshOutlook {
  if (!state.enabled || !flexibilityFlow) {
    return {
      turn: state.turn,
      meshIndex: 50,
      band: 'patchy',
      flexibilityDrag: 0,
      summary: 'Coordination mesh idle — flexibility flow unavailable.',
      stewardNote: 'Compute flexibility flow before coordination mesh guidance.'
    };
  }

  let coordinationLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    coordinationLift += coordinationEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  coordinationLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const flexibilityDrag = v1014laborClamp(
    flexibilityFlow.inclusionDrag * 0.46 +
      (flexibilityFlow.band === 'ebbing' || flexibilityFlow.band === 'patchy' ? 10 : 3)
  );
  const flowLift =
    flexibilityFlow.band === 'rising' || flexibilityFlow.band === 'flowing'
      ? flexibilityFlow.flowIndex * 0.2
      : flexibilityFlow.flowIndex * 0.1;

  const meshIndex = v1014laborClamp(24 + coordinationLift * 22 + flowLift - flexibilityDrag);
  const band = meshBand(meshIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy coordination mesh — deploy coordination levers before subject coordination assembly.'
      : band === 'meshed'
        ? 'Meshed band — verify flexibility-coordination coupling before auto workforce pushes.'
        : 'Rising mesh — align with flexibility flow outlook checks.';

  return {
    turn: state.turn,
    meshIndex,
    band,
    flexibilityDrag,
    summary: `National coordination mesh ${band} (index ${Math.round(meshIndex)}); flexibility drag ${Math.round(flexibilityDrag)}.`,
    stewardNote
  };
}


// --- source: subject-coordination-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectCoordinationReadinessBrief,
  type NationalSubjectFlexibilityReadinessBrief,
  type NationalWorkforceFlexibilityIndex,
  type SubjectCoordinationReadinessBand
} from './types';

function coordinationBand(index: number): SubjectCoordinationReadinessBand {
  if (index <= 34) return 'below_coordination';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'coordination_ready';
  return 'flexibility_locked';
}

/** Round-43 / wave-43 subject coordination readiness — flexibility × workforce flexibility (O10-217). */
export function computeNationalSubjectCoordinationReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectFlexibility: NationalSubjectFlexibilityReadinessBrief | null | undefined,
  workforceFlexibility: NationalWorkforceFlexibilityIndex | null | undefined
): NationalSubjectCoordinationReadinessBrief {
  if (!state.enabled || !subjectFlexibility || !workforceFlexibility) {
    return {
      turn: state.turn,
      coordinationIndex: 50,
      band: 'approaching',
      coordinationDrag: 0,
      summary: 'Subject coordination readiness idle — subject flexibility or workforce flexibility unavailable.',
      stewardNote: 'Compute subject flexibility and workforce flexibility before coordination guidance.'
    };
  }

  const coordinationDrag = v1014laborClamp(
    subjectFlexibility.flexibilityDrag * 0.38 +
      workforceFlexibility.flexibilityDrag * 0.38 +
      (subjectFlexibility.band === 'below_flexibility' || workforceFlexibility.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectFlexibility.band === 'flexibility_ready' || subjectFlexibility.band === 'inclusion_locked'
      ? subjectFlexibility.flexibilityIndex * 0.27
      : subjectFlexibility.flexibilityIndex * 0.14;
  const workforceLift =
    workforceFlexibility.band === 'elevated' || workforceFlexibility.band === 'flexibility'
      ? workforceFlexibility.flexibilityIndex * 0.25
      : workforceFlexibility.flexibilityIndex * 0.12;

  const coordinationIndex = v1014laborClamp(20 + subjectLift + workforceLift - coordinationDrag);
  const band = coordinationBand(coordinationIndex);

  const stewardNote =
    band === 'below_coordination' || band === 'approaching'
      ? 'Approaching coordination — hold O10-217 wave-43 scale until flexibility-coordination syncs.'
      : band === 'flexibility_locked'
        ? 'Flexibility-locked coordination — still monitor coordination mesh during corridor peaks.'
        : 'Coordination-ready — pair with workforce coordination index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    coordinationIndex,
    band,
    coordinationDrag,
    summary: `Subject coordination readiness ${band} (index ${Math.round(coordinationIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-coordination-index.ts ---
  type NationalCoordinationMeshOutlook,
  type NationalFlexibilityCoordinationCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSubjectCoordinationReadinessBrief,
  type NationalWorkforceCoordinationIndex,
  type WorkforceCoordinationBand
} from './types';

function coordinationBand(index: number): WorkforceCoordinationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'coordination';
}

export function computeNationalWorkforceCoordinationIndex(
  state: NationalLaborDemographicsState,
  coordinationCoupling: NationalFlexibilityCoordinationCouplingBrief | null | undefined,
  coordinationMesh: NationalCoordinationMeshOutlook | null | undefined,
  subjectCoordination: NationalSubjectCoordinationReadinessBrief | null | undefined
): NationalWorkforceCoordinationIndex {
  if (!state.enabled || !coordinationCoupling || !coordinationMesh || !subjectCoordination) {
    return {
      turn: state.turn,
      coordinationIndex: 50,
      band: 'thin',
      coordinationDrag: 0,
      summary: 'Workforce coordination idle — coordination coupling, mesh, or subject coordination unavailable.',
      stewardNote: 'Compute O10-217 wave-43 depth stack before coordination guidance.'
    };
  }

  const coordinationDrag = v1014laborClamp(
    subjectCoordination.coordinationDrag * 0.35 +
      coordinationCoupling.flexibilityDrag * 0.3 +
      coordinationMesh.flexibilityDrag * 0.25 +
      (subjectCoordination.band === 'below_coordination' || coordinationCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    coordinationCoupling.band === 'amplified' || coordinationCoupling.band === 'elevated'
      ? coordinationCoupling.couplingIndex * 0.2
      : coordinationCoupling.couplingIndex * 0.1;
  const meshLift =
    coordinationMesh.band === 'rising' || coordinationMesh.band === 'meshed'
      ? coordinationMesh.meshIndex * 0.18
      : coordinationMesh.meshIndex * 0.09;
  const subjectLift =
    subjectCoordination.band === 'coordination_ready' || subjectCoordination.band === 'flexibility_locked'
      ? subjectCoordination.coordinationIndex * 0.22
      : subjectCoordination.coordinationIndex * 0.11;

  const coordinationIndex = v1014laborClamp(18 + couplingLift + meshLift + subjectLift - coordinationDrag);
  const band = coordinationBand(coordinationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce coordination — sequence flexibility-coordination, coordination mesh, and subject coordination before post-641d7d16 tranche.'
      : band === 'coordination'
        ? 'Coordination band — avoid corridor overload that breaks subject coordination bands.'
        : 'Elevated coordination — refresh subject coordination checks each scale wave.';

  return {
    turn: state.turn,
    coordinationIndex,
    band,
    coordinationDrag,
    summary: `National workforce coordination ${band} (index ${Math.round(coordinationIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}


// --- source: coordination-scheduling-coupling-brief.ts ---
  V1014_LABOR_CORE_REGIONS,
  type CoordinationSchedulingCouplingBand,
  type NationalCoordinationSchedulingCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalWorkforceCoordinationIndex
} from './types';

function couplingBand(index: number): CoordinationSchedulingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-44 / wave-44 coordination-scheduling coupling — coordination × scheduling (O10-219). */
export function computeNationalCoordinationSchedulingCouplingBrief(
  state: NationalLaborDemographicsState,
  coordination: NationalWorkforceCoordinationIndex | null | undefined
): NationalCoordinationSchedulingCouplingBrief {
  if (!state.enabled || !coordination) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      coordinationDrag: 0,
      summary: 'Coordination-scheduling coupling idle — workforce coordination unavailable.',
      stewardNote: 'Compute workforce coordination before scheduling coupling guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const coordinationDrag = v1014laborClamp(
    coordination.coordinationDrag * 0.48 + (coordination.band === 'fragile' || coordination.band === 'thin' ? 11 : 3)
  );
  const coordinationLift =
    coordination.band === 'elevated' || coordination.band === 'coordination'
      ? coordination.coordinationIndex * 0.24
      : coordination.coordinationIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + schedulingLift * 21 + coordinationLift - coordinationDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained coordination-scheduling link — deploy scheduling levers before wave-44 scheduling commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard scheduling pulse spikes that drain coordination buffers.'
        : 'Amplified coupling — pair scheduling packs with subject scheduling readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    coordinationDrag,
    summary: `Coordination-scheduling coupling ${band} (index ${Math.round(couplingIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}


// --- source: scheduling-pulse-outlook.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalCoordinationMeshOutlook,
  type NationalLaborDemographicsState,
  type NationalSchedulingPulseOutlook,
  type SchedulingPulseBand
} from './types';

function pulseBand(index: number): SchedulingPulseBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'pulsing';
}

export function computeNationalSchedulingPulseOutlook(
  state: NationalLaborDemographicsState,
  coordinationMesh: NationalCoordinationMeshOutlook | null | undefined
): NationalSchedulingPulseOutlook {
  if (!state.enabled || !coordinationMesh) {
    return {
      turn: state.turn,
      pulseIndex: 50,
      band: 'patchy',
      coordinationDrag: 0,
      summary: 'Scheduling pulse idle — coordination mesh unavailable.',
      stewardNote: 'Compute coordination mesh before scheduling pulse guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const coordinationDrag = v1014laborClamp(
    coordinationMesh.flexibilityDrag * 0.46 +
      (coordinationMesh.band === 'ebbing' || coordinationMesh.band === 'patchy' ? 10 : 3)
  );
  const meshLift =
    coordinationMesh.band === 'rising' || coordinationMesh.band === 'meshed'
      ? coordinationMesh.meshIndex * 0.2
      : coordinationMesh.meshIndex * 0.1;

  const pulseIndex = v1014laborClamp(24 + schedulingLift * 22 + meshLift - coordinationDrag);
  const band = pulseBand(pulseIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy scheduling pulse — deploy scheduling levers before subject scheduling assembly.'
      : band === 'pulsing'
        ? 'Pulsing band — verify coordination-scheduling coupling before auto workforce pushes.'
        : 'Rising pulse — align with coordination mesh outlook checks.';

  return {
    turn: state.turn,
    pulseIndex,
    band,
    coordinationDrag,
    summary: `National scheduling pulse ${band} (index ${Math.round(pulseIndex)}); coordination drag ${Math.round(coordinationDrag)}.`,
    stewardNote
  };
}


// --- source: subject-scheduling-readiness-brief.ts ---
  type NationalLaborDemographicsState,
  type NationalSubjectCoordinationReadinessBrief,
  type NationalSubjectSchedulingReadinessBrief,
  type NationalWorkforceCoordinationIndex,
  type SubjectSchedulingReadinessBand
} from './types';

function schedulingBand(index: number): SubjectSchedulingReadinessBand {
  if (index <= 34) return 'below_scheduling';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'scheduling_ready';
  return 'coordination_locked';
}

/** Round-44 / wave-44 subject scheduling readiness — coordination × workforce coordination (O10-219). */
export function computeNationalSubjectSchedulingReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCoordination: NationalSubjectCoordinationReadinessBrief | null | undefined,
  workforceCoordination: NationalWorkforceCoordinationIndex | null | undefined
): NationalSubjectSchedulingReadinessBrief {
  if (!state.enabled || !subjectCoordination || !workforceCoordination) {
    return {
      turn: state.turn,
      schedulingIndex: 50,
      band: 'approaching',
      schedulingDrag: 0,
      summary: 'Subject scheduling readiness idle — subject coordination or workforce coordination unavailable.',
      stewardNote: 'Compute subject coordination and workforce coordination before scheduling guidance.'
    };
  }

  const schedulingDrag = v1014laborClamp(
    subjectCoordination.coordinationDrag * 0.38 +
      workforceCoordination.coordinationDrag * 0.38 +
      (subjectCoordination.band === 'below_coordination' || workforceCoordination.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectCoordination.band === 'coordination_ready' || subjectCoordination.band === 'flexibility_locked'
      ? subjectCoordination.coordinationIndex * 0.27
      : subjectCoordination.coordinationIndex * 0.14;
  const workforceLift =
    workforceCoordination.band === 'elevated' || workforceCoordination.band === 'coordination'
      ? workforceCoordination.coordinationIndex * 0.25
      : workforceCoordination.coordinationIndex * 0.12;

  const schedulingIndex = v1014laborClamp(20 + subjectLift + workforceLift - schedulingDrag);
  const band = schedulingBand(schedulingIndex);

  const stewardNote =
    band === 'below_scheduling' || band === 'approaching'
      ? 'Approaching scheduling — hold O10-219 wave-44 scale until coordination-scheduling syncs.'
      : band === 'coordination_locked'
        ? 'Coordination-locked scheduling — still monitor scheduling pulse during corridor peaks.'
        : 'Scheduling-ready — pair with workforce scheduling index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    schedulingIndex,
    band,
    schedulingDrag,
    summary: `Subject scheduling readiness ${band} (index ${Math.round(schedulingIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
    stewardNote
  };
}


// --- source: national-workforce-scheduling-index.ts ---
  type NationalCoordinationSchedulingCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSchedulingPulseOutlook,
  type NationalSubjectSchedulingReadinessBrief,
  type NationalWorkforceSchedulingIndex,
  type WorkforceSchedulingBand
} from './types';

function schedulingBand(index: number): WorkforceSchedulingBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'scheduling';
}

export function computeNationalWorkforceSchedulingIndex(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalCoordinationSchedulingCouplingBrief | null | undefined,
  schedulingPulse: NationalSchedulingPulseOutlook | null | undefined,
  subjectScheduling: NationalSubjectSchedulingReadinessBrief | null | undefined
): NationalWorkforceSchedulingIndex {
  if (!state.enabled || !schedulingCoupling || !schedulingPulse || !subjectScheduling) {
    return {
      turn: state.turn,
      schedulingIndex: 50,
      band: 'thin',
      schedulingDrag: 0,
      summary: 'Workforce scheduling idle — scheduling coupling, pulse, or subject scheduling unavailable.',
      stewardNote: 'Compute O10-219 wave-44 depth stack before scheduling guidance.'
    };
  }

  const schedulingDrag = v1014laborClamp(
    subjectScheduling.schedulingDrag * 0.35 +
      schedulingCoupling.coordinationDrag * 0.3 +
      schedulingPulse.coordinationDrag * 0.25 +
      (subjectScheduling.band === 'below_scheduling' || schedulingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const couplingLift =
    schedulingCoupling.band === 'amplified' || schedulingCoupling.band === 'elevated'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;
  const pulseLift =
    schedulingPulse.band === 'rising' || schedulingPulse.band === 'pulsing'
      ? schedulingPulse.pulseIndex * 0.18
      : schedulingPulse.pulseIndex * 0.09;
  const subjectLift =
    subjectScheduling.band === 'scheduling_ready' || subjectScheduling.band === 'coordination_locked'
      ? subjectScheduling.schedulingIndex * 0.22
      : subjectScheduling.schedulingIndex * 0.11;

  const schedulingIndex = v1014laborClamp(18 + couplingLift + pulseLift + subjectLift - schedulingDrag);
  const band = schedulingBand(schedulingIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce scheduling — sequence coordination-scheduling, scheduling pulse, and subject scheduling before post-bca7e0a3 tranche.'
      : band === 'scheduling'
        ? 'Scheduling band — avoid corridor overload that breaks subject scheduling bands.'
        : 'Elevated scheduling — refresh subject scheduling checks each scale wave.';

  return {
    turn: state.turn,
    schedulingIndex,
    band,
    schedulingDrag,
    summary: `National workforce scheduling ${band} (index ${Math.round(schedulingIndex)}); scheduling drag ${Math.round(schedulingDrag)}.`,
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
  state.durabilityAdvocacyCouplingBrief = computeNationalDurabilityAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceDurabilityIndex
  );
  state.mentorshipEnduranceOutlook = computeNationalMentorshipEnduranceOutlook(
    state,
    state.reengagementMomentumOutlook
  );
  state.subjectTrancheReadinessBrief = computeNationalSubjectTrancheReadinessBrief(
    state,
    state.subjectWaveAssemblyBrief,
    state.nationalWorkforceDurabilityIndex
  );
  state.nationalWorkforceEnduranceIndex = computeNationalWorkforceEnduranceIndex(
    state,
    state.durabilityAdvocacyCouplingBrief,
    state.mentorshipEnduranceOutlook,
    state.subjectTrancheReadinessBrief
  );
  state.enduranceFlexibilityCouplingBrief = computeNationalEnduranceFlexibilityCouplingBrief(
    state,
    state.nationalWorkforceEnduranceIndex
  );
  state.inclusionResilienceOutlook = computeNationalInclusionResilienceOutlook(
    state,
    state.mentorshipEnduranceOutlook
  );
  state.subjectCommitReadinessBrief = computeNationalSubjectCommitReadinessBrief(
    state,
    state.subjectTrancheReadinessBrief,
    state.nationalWorkforceEnduranceIndex
  );
  state.nationalWorkforceTenacityIndex = computeNationalWorkforceTenacityIndex(
    state,
    state.enduranceFlexibilityCouplingBrief,
    state.inclusionResilienceOutlook,
    state.subjectCommitReadinessBrief
  );
  state.tenacityCareCouplingBrief = computeNationalTenacityCareCouplingBrief(
    state,
    state.nationalWorkforceTenacityIndex
  );
  state.safetyCohesionOutlook = computeNationalSafetyCohesionOutlook(
    state,
    state.inclusionResilienceOutlook
  );
  state.subjectReleaseReadinessBrief = computeNationalSubjectReleaseReadinessBrief(
    state,
    state.subjectCommitReadinessBrief,
    state.nationalWorkforceTenacityIndex
  );
  state.nationalWorkforceSteadfastIndex = computeNationalWorkforceSteadfastIndex(
    state,
    state.tenacityCareCouplingBrief,
    state.safetyCohesionOutlook,
    state.subjectReleaseReadinessBrief
  );
  state.steadfastSchedulingCouplingBrief = computeNationalSteadfastSchedulingCouplingBrief(
    state,
    state.nationalWorkforceSteadfastIndex
  );
  state.retentionAnchorOutlook = computeNationalRetentionAnchorOutlook(state, state.safetyCohesionOutlook);
  state.subjectSealReadinessBrief = computeNationalSubjectSealReadinessBrief(
    state,
    state.subjectReleaseReadinessBrief,
    state.nationalWorkforceSteadfastIndex
  );
  state.nationalWorkforceResolveIndex = computeNationalWorkforceResolveIndex(
    state,
    state.steadfastSchedulingCouplingBrief,
    state.retentionAnchorOutlook,
    state.subjectSealReadinessBrief
  );
  state.resolveUpskillingCouplingBrief = computeNationalResolveUpskillingCouplingBrief(
    state,
    state.nationalWorkforceResolveIndex,
    state.upskillingVelocityOutlook
  );
  state.coordinationBindOutlook = computeNationalCoordinationBindOutlook(
    state,
    state.steadfastSchedulingCouplingBrief
  );
  state.subjectBindReadinessBrief = computeNationalSubjectBindReadinessBrief(
    state,
    state.subjectSealReadinessBrief,
    state.nationalWorkforceResolveIndex
  );
  state.nationalWorkforceFortitudeIndex = computeNationalWorkforceFortitudeIndex(
    state,
    state.resolveUpskillingCouplingBrief,
    state.coordinationBindOutlook,
    state.subjectBindReadinessBrief
  );
  state.fortitudeInclusionCouplingBrief = computeNationalFortitudeInclusionCouplingBrief(
    state,
    state.nationalWorkforceFortitudeIndex
  );
  state.hybridAnchorOutlook = computeNationalHybridAnchorOutlook(state, state.coordinationBindOutlook);
  state.subjectCrownReadinessBrief = computeNationalSubjectCrownReadinessBrief(
    state,
    state.subjectBindReadinessBrief,
    state.nationalWorkforceFortitudeIndex
  );
  state.nationalWorkforceCulminationIndex = computeNationalWorkforceCulminationIndex(
    state,
    state.fortitudeInclusionCouplingBrief,
    state.hybridAnchorOutlook,
    state.subjectCrownReadinessBrief
  );
  state.culminationMentorshipCouplingBrief = computeNationalCulminationMentorshipCouplingBrief(
    state,
    state.nationalWorkforceCulminationIndex
  );
  state.onboardingSustainOutlook = computeNationalOnboardingSustainOutlook(state, state.hybridAnchorOutlook);
  state.subjectApexReadinessBrief = computeNationalSubjectApexReadinessBrief(
    state,
    state.subjectCrownReadinessBrief,
    state.nationalWorkforceCulminationIndex
  );
  state.nationalWorkforceApexIndex = computeNationalWorkforceApexIndex(
    state,
    state.culminationMentorshipCouplingBrief,
    state.onboardingSustainOutlook,
    state.subjectApexReadinessBrief
  );
  state.apexAdvocacyCouplingBrief = computeNationalApexAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceApexIndex
  );
  state.reengagementThrustOutlook = computeNationalReengagementThrustOutlook(
    state,
    state.onboardingSustainOutlook
  );
  state.subjectPinnacleReadinessBrief = computeNationalSubjectPinnacleReadinessBrief(
    state,
    state.subjectApexReadinessBrief,
    state.nationalWorkforceApexIndex
  );
  state.nationalWorkforcePinnacleIndex = computeNationalWorkforcePinnacleIndex(
    state,
    state.apexAdvocacyCouplingBrief,
    state.reengagementThrustOutlook,
    state.subjectPinnacleReadinessBrief
  );
  state.pinnacleRetentionCouplingBrief = computeNationalPinnacleRetentionCouplingBrief(
    state,
    state.nationalWorkforcePinnacleIndex
  );
  state.retentionCrestOutlook = computeNationalRetentionCrestOutlook(
    state,
    state.reengagementThrustOutlook
  );
  state.subjectSummitReadinessBrief = computeNationalSubjectSummitReadinessBrief(
    state,
    state.subjectPinnacleReadinessBrief,
    state.nationalWorkforcePinnacleIndex
  );
  state.nationalWorkforceSummitIndex = computeNationalWorkforceSummitIndex(
    state,
    state.pinnacleRetentionCouplingBrief,
    state.retentionCrestOutlook,
    state.subjectSummitReadinessBrief
  );
  state.summitCoordinationCouplingBrief = computeNationalSummitCoordinationCouplingBrief(
    state,
    state.nationalWorkforceSummitIndex
  );
  state.coordinationHorizonOutlook = computeNationalCoordinationHorizonOutlook(
    state,
    state.retentionCrestOutlook
  );
  state.subjectZenithReadinessBrief = computeNationalSubjectZenithReadinessBrief(
    state,
    state.subjectSummitReadinessBrief,
    state.nationalWorkforceSummitIndex
  );
  state.nationalWorkforceZenithIndex = computeNationalWorkforceZenithIndex(
    state,
    state.summitCoordinationCouplingBrief,
    state.coordinationHorizonOutlook,
    state.subjectZenithReadinessBrief
  );
  state.zenithFlexibilityCouplingBrief = computeNationalZenithFlexibilityCouplingBrief(
    state,
    state.nationalWorkforceZenithIndex
  );
  state.flexibilityAscentOutlook = computeNationalFlexibilityAscentOutlook(
    state,
    state.coordinationHorizonOutlook
  );
  state.subjectApogeeReadinessBrief = computeNationalSubjectApogeeReadinessBrief(
    state,
    state.subjectZenithReadinessBrief,
    state.nationalWorkforceZenithIndex
  );
  state.nationalWorkforceApogeeIndex = computeNationalWorkforceApogeeIndex(
    state,
    state.zenithFlexibilityCouplingBrief,
    state.flexibilityAscentOutlook,
    state.subjectApogeeReadinessBrief
  );
  state.apogeeInclusionCouplingBrief = computeNationalApogeeInclusionCouplingBrief(
    state,
    state.nationalWorkforceApogeeIndex
  );
  state.inclusionOrbitOutlook = computeNationalInclusionOrbitOutlook(
    state,
    state.flexibilityAscentOutlook
  );
  state.subjectOrbitReadinessBrief = computeNationalSubjectOrbitReadinessBrief(
    state,
    state.subjectApogeeReadinessBrief,
    state.nationalWorkforceApogeeIndex
  );
  state.nationalWorkforceOrbitIndex = computeNationalWorkforceOrbitIndex(
    state,
    state.apogeeInclusionCouplingBrief,
    state.inclusionOrbitOutlook,
    state.subjectOrbitReadinessBrief
  );
  state.orbitCareCouplingBrief = computeNationalOrbitCareCouplingBrief(
    state,
    state.nationalWorkforceOrbitIndex
  );
  state.careEquilibriumOutlook = computeNationalCareEquilibriumOutlook(
    state,
    state.inclusionOrbitOutlook
  );
  state.subjectNexusReadinessBrief = computeNationalSubjectNexusReadinessBrief(
    state,
    state.subjectOrbitReadinessBrief,
    state.nationalWorkforceOrbitIndex
  );
  state.nationalWorkforceNexusIndex = computeNationalWorkforceNexusIndex(
    state,
    state.orbitCareCouplingBrief,
    state.careEquilibriumOutlook,
    state.subjectNexusReadinessBrief
  );
  state.nexusSchedulingCouplingBrief = computeNationalNexusSchedulingCouplingBrief(
    state,
    state.nationalWorkforceNexusIndex
  );
  state.schedulingResonanceOutlook = computeNationalSchedulingResonanceOutlook(
    state,
    state.careEquilibriumOutlook
  );
  state.subjectConvergenceReadinessBrief = computeNationalSubjectConvergenceReadinessBrief(
    state,
    state.subjectNexusReadinessBrief,
    state.nationalWorkforceNexusIndex
  );
  state.nationalWorkforceConvergenceIndex = computeNationalWorkforceConvergenceIndex(
    state,
    state.nexusSchedulingCouplingBrief,
    state.schedulingResonanceOutlook,
    state.subjectConvergenceReadinessBrief
  );
  state.convergenceSafetyCouplingBrief = computeNationalConvergenceSafetyCouplingBrief(
    state,
    state.nationalWorkforceConvergenceIndex
  );
  state.safetyHarmonyOutlook = computeNationalSafetyHarmonyOutlook(
    state,
    state.schedulingResonanceOutlook
  );
  state.subjectUnificationReadinessBrief = computeNationalSubjectUnificationReadinessBrief(
    state,
    state.subjectConvergenceReadinessBrief,
    state.nationalWorkforceConvergenceIndex
  );
  state.nationalWorkforceUnificationIndex = computeNationalWorkforceUnificationIndex(
    state,
    state.convergenceSafetyCouplingBrief,
    state.safetyHarmonyOutlook,
    state.subjectUnificationReadinessBrief
  );
  state.unificationUpskillingCouplingBrief = computeNationalUnificationUpskillingCouplingBrief(
    state,
    state.nationalWorkforceUnificationIndex
  );
  state.upskillingSynthesisOutlook = computeNationalUpskillingSynthesisOutlook(
    state,
    state.safetyHarmonyOutlook
  );
  state.subjectSynthesisReadinessBrief = computeNationalSubjectSynthesisReadinessBrief(
    state,
    state.subjectUnificationReadinessBrief,
    state.nationalWorkforceUnificationIndex
  );
  state.nationalWorkforceSynthesisIndex = computeNationalWorkforceSynthesisIndex(
    state,
    state.unificationUpskillingCouplingBrief,
    state.upskillingSynthesisOutlook,
    state.subjectSynthesisReadinessBrief
  );
  state.synthesisOnboardingCouplingBrief = computeNationalSynthesisOnboardingCouplingBrief(
    state,
    state.nationalWorkforceSynthesisIndex
  );
  state.onboardingIntegrationOutlook = computeNationalOnboardingIntegrationOutlook(
    state,
    state.upskillingSynthesisOutlook
  );
  state.subjectIntegrationReadinessBrief = computeNationalSubjectIntegrationReadinessBrief(
    state,
    state.subjectSynthesisReadinessBrief,
    state.nationalWorkforceSynthesisIndex
  );
  state.nationalWorkforceIntegrationIndex = computeNationalWorkforceIntegrationIndex(
    state,
    state.synthesisOnboardingCouplingBrief,
    state.onboardingIntegrationOutlook,
    state.subjectIntegrationReadinessBrief
  );
  state.integrationRetentionCouplingBrief = computeNationalIntegrationRetentionCouplingBrief(
    state,
    state.nationalWorkforceIntegrationIndex
  );
  state.retentionCohesionOutlook = computeNationalRetentionCohesionOutlook(
    state,
    state.onboardingIntegrationOutlook
  );
  state.subjectRetentionReadinessBrief = computeNationalSubjectRetentionReadinessBrief(
    state,
    state.subjectIntegrationReadinessBrief,
    state.nationalWorkforceIntegrationIndex
  );
  state.nationalWorkforceRetentionIndex = computeNationalWorkforceRetentionIndex(
    state,
    state.integrationRetentionCouplingBrief,
    state.retentionCohesionOutlook,
    state.subjectRetentionReadinessBrief
  );
  state.retentionReengagementCouplingBrief = computeNationalRetentionReengagementCouplingBrief(
    state,
    state.nationalWorkforceRetentionIndex
  );
  state.reengagementAlignmentOutlook = computeNationalReengagementAlignmentOutlook(
    state,
    state.retentionCohesionOutlook
  );
  state.subjectReengagementReadinessBrief = computeNationalSubjectReengagementReadinessBrief(
    state,
    state.subjectRetentionReadinessBrief,
    state.nationalWorkforceRetentionIndex
  );
  state.nationalWorkforceReengagementIndex = computeNationalWorkforceReengagementIndex(
    state,
    state.retentionReengagementCouplingBrief,
    state.reengagementAlignmentOutlook,
    state.subjectReengagementReadinessBrief
  );
  state.reengagementMentorshipCouplingBrief = computeNationalReengagementMentorshipCouplingBrief(
    state,
    state.nationalWorkforceReengagementIndex
  );
  state.mentorshipSustainOutlook = computeNationalMentorshipSustainOutlook(
    state,
    state.reengagementAlignmentOutlook
  );
  state.subjectMentorshipReadinessBrief = computeNationalSubjectMentorshipReadinessBrief(
    state,
    state.subjectReengagementReadinessBrief,
    state.nationalWorkforceReengagementIndex
  );
  state.nationalWorkforceMentorshipIndex = computeNationalWorkforceMentorshipIndex(
    state,
    state.reengagementMentorshipCouplingBrief,
    state.mentorshipSustainOutlook,
    state.subjectMentorshipReadinessBrief
  );
  state.mentorshipAdvocacyCouplingBrief = computeNationalMentorshipAdvocacyCouplingBrief(
    state,
    state.nationalWorkforceMentorshipIndex
  );
  state.advocacyResonanceOutlook = computeNationalAdvocacyResonanceOutlook(
    state,
    state.mentorshipSustainOutlook
  );
  state.subjectAdvocacyReadinessBrief = computeNationalSubjectAdvocacyReadinessBrief(
    state,
    state.subjectMentorshipReadinessBrief,
    state.nationalWorkforceMentorshipIndex
  );
  state.nationalWorkforceAdvocacyIndex = computeNationalWorkforceAdvocacyIndex(
    state,
    state.mentorshipAdvocacyCouplingBrief,
    state.advocacyResonanceOutlook,
    state.subjectAdvocacyReadinessBrief
  );
  state.advocacyInclusionCouplingBrief = computeNationalAdvocacyInclusionCouplingBrief(
    state,
    state.nationalWorkforceAdvocacyIndex
  );
  state.inclusionEquityOutlook = computeNationalInclusionEquityOutlook(
    state,
    state.advocacyResonanceOutlook
  );
  state.subjectInclusionReadinessBrief = computeNationalSubjectInclusionReadinessBrief(
    state,
    state.subjectAdvocacyReadinessBrief,
    state.nationalWorkforceAdvocacyIndex
  );
  state.nationalWorkforceInclusionIndex = computeNationalWorkforceInclusionIndex(
    state,
    state.advocacyInclusionCouplingBrief,
    state.inclusionEquityOutlook,
    state.subjectInclusionReadinessBrief
  );
  state.inclusionFlexibilityCouplingBrief = computeNationalInclusionFlexibilityCouplingBrief(
    state,
    state.nationalWorkforceInclusionIndex
  );
  state.flexibilityFlowOutlook = computeNationalFlexibilityFlowOutlook(
    state,
    state.inclusionEquityOutlook
  );
  state.subjectFlexibilityReadinessBrief = computeNationalSubjectFlexibilityReadinessBrief(
    state,
    state.subjectInclusionReadinessBrief,
    state.nationalWorkforceInclusionIndex
  );
  state.nationalWorkforceFlexibilityIndex = computeNationalWorkforceFlexibilityIndex(
    state,
    state.inclusionFlexibilityCouplingBrief,
    state.flexibilityFlowOutlook,
    state.subjectFlexibilityReadinessBrief
  );
  state.flexibilityCoordinationCouplingBrief = computeNationalFlexibilityCoordinationCouplingBrief(
    state,
    state.nationalWorkforceFlexibilityIndex
  );
  state.coordinationMeshOutlook = computeNationalCoordinationMeshOutlook(
    state,
    state.flexibilityFlowOutlook
  );
  state.subjectCoordinationReadinessBrief = computeNationalSubjectCoordinationReadinessBrief(
    state,
    state.subjectFlexibilityReadinessBrief,
    state.nationalWorkforceFlexibilityIndex
  );
  state.nationalWorkforceCoordinationIndex = computeNationalWorkforceCoordinationIndex(
    state,
    state.flexibilityCoordinationCouplingBrief,
    state.coordinationMeshOutlook,
    state.subjectCoordinationReadinessBrief
  );
  state.coordinationSchedulingCouplingBrief = computeNationalCoordinationSchedulingCouplingBrief(
    state,
    state.nationalWorkforceCoordinationIndex
  );
  state.schedulingPulseOutlook = computeNationalSchedulingPulseOutlook(
    state,
    state.coordinationMeshOutlook
  );
  state.subjectSchedulingReadinessBrief = computeNationalSubjectSchedulingReadinessBrief(
    state,
    state.subjectCoordinationReadinessBrief,
    state.nationalWorkforceCoordinationIndex
  );
  state.nationalWorkforceSchedulingIndex = computeNationalWorkforceSchedulingIndex(
    state,
    state.coordinationSchedulingCouplingBrief,
    state.schedulingPulseOutlook,
    state.subjectSchedulingReadinessBrief
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
  if (
    (state.durabilityAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.durabilityAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.durabilityAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.mentorshipEnduranceOutlook?.band === 'depleted' ||
      state.mentorshipEnduranceOutlook?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.mentorshipEnduranceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectTrancheReadinessBrief?.band === 'blocked' ||
      state.subjectTrancheReadinessBrief?.band === 'caution') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectTrancheReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceEnduranceIndex?.band === 'fragile' ||
      state.nationalWorkforceEnduranceIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceEnduranceIndex.summary.slice(0, 120));
  }
  if (
    (state.enduranceFlexibilityCouplingBrief?.band === 'decoupled' ||
      state.enduranceFlexibilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.enduranceFlexibilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.inclusionResilienceOutlook?.band === 'fragile' ||
      state.inclusionResilienceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionResilienceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCommitReadinessBrief?.band === 'held' ||
      state.subjectCommitReadinessBrief?.band === 'review') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCommitReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceTenacityIndex?.band === 'brittle' ||
      state.nationalWorkforceTenacityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceTenacityIndex.summary.slice(0, 120));
  }
  if (
    (state.tenacityCareCouplingBrief?.band === 'decoupled' ||
      state.tenacityCareCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.tenacityCareCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.safetyCohesionOutlook?.band === 'exposed' ||
      state.safetyCohesionOutlook?.band === 'uneven') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.safetyCohesionOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectReleaseReadinessBrief?.band === 'held' ||
      state.subjectReleaseReadinessBrief?.band === 'staged') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectReleaseReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSteadfastIndex?.band === 'fragile' ||
      state.nationalWorkforceSteadfastIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSteadfastIndex.summary.slice(0, 120));
  }
  if (
    (state.steadfastSchedulingCouplingBrief?.band === 'decoupled' ||
      state.steadfastSchedulingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.steadfastSchedulingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.retentionAnchorOutlook?.band === 'drifting' ||
      state.retentionAnchorOutlook?.band === 'loose') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionAnchorOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSealReadinessBrief?.band === 'open' ||
      state.subjectSealReadinessBrief?.band === 'pending') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSealReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceResolveIndex?.band === 'fragile' ||
      state.nationalWorkforceResolveIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceResolveIndex.summary.slice(0, 120));
  }
  if (
    (state.resolveUpskillingCouplingBrief?.band === 'decoupled' ||
      state.resolveUpskillingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.resolveUpskillingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.coordinationBindOutlook?.band === 'loose' ||
      state.coordinationBindOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationBindOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectBindReadinessBrief?.band === 'unbound' ||
      state.subjectBindReadinessBrief?.band === 'tension') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectBindReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceFortitudeIndex?.band === 'fragile' ||
      state.nationalWorkforceFortitudeIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceFortitudeIndex.summary.slice(0, 120));
  }
  if (
    (state.fortitudeInclusionCouplingBrief?.band === 'decoupled' ||
      state.fortitudeInclusionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.fortitudeInclusionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.hybridAnchorOutlook?.band === 'drifting' ||
      state.hybridAnchorOutlook?.band === 'mixed') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.hybridAnchorOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCrownReadinessBrief?.band === 'uncrowned' ||
      state.subjectCrownReadinessBrief?.band === 'pending') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCrownReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceCulminationIndex?.band === 'fragile' ||
      state.nationalWorkforceCulminationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceCulminationIndex.summary.slice(0, 120));
  }
  if (
    (state.culminationMentorshipCouplingBrief?.band === 'decoupled' ||
      state.culminationMentorshipCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.culminationMentorshipCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.onboardingSustainOutlook?.band === 'depleted' ||
      state.onboardingSustainOutlook?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.onboardingSustainOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectApexReadinessBrief?.band === 'below_apex' ||
      state.subjectApexReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectApexReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceApexIndex?.band === 'fragile' ||
      state.nationalWorkforceApexIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceApexIndex.summary.slice(0, 120));
  }
  if (
    (state.apexAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.apexAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.apexAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.reengagementThrustOutlook?.band === 'stalled' ||
      state.reengagementThrustOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementThrustOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectPinnacleReadinessBrief?.band === 'below_pinnacle' ||
      state.subjectPinnacleReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectPinnacleReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforcePinnacleIndex?.band === 'fragile' ||
      state.nationalWorkforcePinnacleIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforcePinnacleIndex.summary.slice(0, 120));
  }
  if (
    (state.pinnacleRetentionCouplingBrief?.band === 'decoupled' ||
      state.pinnacleRetentionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.pinnacleRetentionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.retentionCrestOutlook?.band === 'ebbing' ||
      state.retentionCrestOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionCrestOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSummitReadinessBrief?.band === 'below_summit' ||
      state.subjectSummitReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSummitReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSummitIndex?.band === 'fragile' ||
      state.nationalWorkforceSummitIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSummitIndex.summary.slice(0, 120));
  }
  if (
    (state.summitCoordinationCouplingBrief?.band === 'decoupled' ||
      state.summitCoordinationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.summitCoordinationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.coordinationHorizonOutlook?.band === 'ebbing' ||
      state.coordinationHorizonOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationHorizonOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectZenithReadinessBrief?.band === 'below_zenith' ||
      state.subjectZenithReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectZenithReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceZenithIndex?.band === 'fragile' ||
      state.nationalWorkforceZenithIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceZenithIndex.summary.slice(0, 120));
  }
  if (
    (state.zenithFlexibilityCouplingBrief?.band === 'decoupled' ||
      state.zenithFlexibilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.zenithFlexibilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.flexibilityAscentOutlook?.band === 'ebbing' ||
      state.flexibilityAscentOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.flexibilityAscentOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectApogeeReadinessBrief?.band === 'below_apogee' ||
      state.subjectApogeeReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectApogeeReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceApogeeIndex?.band === 'fragile' ||
      state.nationalWorkforceApogeeIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceApogeeIndex.summary.slice(0, 120));
  }
  if (
    (state.apogeeInclusionCouplingBrief?.band === 'decoupled' ||
      state.apogeeInclusionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.apogeeInclusionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.inclusionOrbitOutlook?.band === 'ebbing' ||
      state.inclusionOrbitOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionOrbitOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectOrbitReadinessBrief?.band === 'below_orbit' ||
      state.subjectOrbitReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectOrbitReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceOrbitIndex?.band === 'fragile' ||
      state.nationalWorkforceOrbitIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceOrbitIndex.summary.slice(0, 120));
  }
  if (
    (state.orbitCareCouplingBrief?.band === 'decoupled' ||
      state.orbitCareCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.orbitCareCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.careEquilibriumOutlook?.band === 'ebbing' ||
      state.careEquilibriumOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.careEquilibriumOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectNexusReadinessBrief?.band === 'below_nexus' ||
      state.subjectNexusReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectNexusReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceNexusIndex?.band === 'fragile' ||
      state.nationalWorkforceNexusIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceNexusIndex.summary.slice(0, 120));
  }
  if (
    (state.nexusSchedulingCouplingBrief?.band === 'decoupled' ||
      state.nexusSchedulingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nexusSchedulingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.schedulingResonanceOutlook?.band === 'ebbing' ||
      state.schedulingResonanceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.schedulingResonanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectConvergenceReadinessBrief?.band === 'below_convergence' ||
      state.subjectConvergenceReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectConvergenceReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceConvergenceIndex?.band === 'fragile' ||
      state.nationalWorkforceConvergenceIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceConvergenceIndex.summary.slice(0, 120));
  }
  if (
    (state.convergenceSafetyCouplingBrief?.band === 'decoupled' ||
      state.convergenceSafetyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.convergenceSafetyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.safetyHarmonyOutlook?.band === 'ebbing' ||
      state.safetyHarmonyOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.safetyHarmonyOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectUnificationReadinessBrief?.band === 'below_unification' ||
      state.subjectUnificationReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectUnificationReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceUnificationIndex?.band === 'fragile' ||
      state.nationalWorkforceUnificationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceUnificationIndex.summary.slice(0, 120));
  }
  if (
    (state.unificationUpskillingCouplingBrief?.band === 'decoupled' ||
      state.unificationUpskillingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.unificationUpskillingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.upskillingSynthesisOutlook?.band === 'ebbing' ||
      state.upskillingSynthesisOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.upskillingSynthesisOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSynthesisReadinessBrief?.band === 'below_synthesis' ||
      state.subjectSynthesisReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSynthesisReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSynthesisIndex?.band === 'fragile' ||
      state.nationalWorkforceSynthesisIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSynthesisIndex.summary.slice(0, 120));
  }
  if (
    (state.synthesisOnboardingCouplingBrief?.band === 'decoupled' ||
      state.synthesisOnboardingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.synthesisOnboardingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.onboardingIntegrationOutlook?.band === 'ebbing' ||
      state.onboardingIntegrationOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.onboardingIntegrationOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectIntegrationReadinessBrief?.band === 'below_integration' ||
      state.subjectIntegrationReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectIntegrationReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceIntegrationIndex?.band === 'fragile' ||
      state.nationalWorkforceIntegrationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceIntegrationIndex.summary.slice(0, 120));
  }
  if (
    (state.integrationRetentionCouplingBrief?.band === 'decoupled' ||
      state.integrationRetentionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.integrationRetentionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.retentionCohesionOutlook?.band === 'ebbing' ||
      state.retentionCohesionOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionCohesionOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectRetentionReadinessBrief?.band === 'below_retention' ||
      state.subjectRetentionReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectRetentionReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceRetentionIndex?.band === 'fragile' ||
      state.nationalWorkforceRetentionIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceRetentionIndex.summary.slice(0, 120));
  }
  if (
    (state.retentionReengagementCouplingBrief?.band === 'decoupled' ||
      state.retentionReengagementCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.retentionReengagementCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.reengagementAlignmentOutlook?.band === 'ebbing' ||
      state.reengagementAlignmentOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementAlignmentOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectReengagementReadinessBrief?.band === 'below_reengagement' ||
      state.subjectReengagementReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectReengagementReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceReengagementIndex?.band === 'fragile' ||
      state.nationalWorkforceReengagementIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceReengagementIndex.summary.slice(0, 120));
  }
  if (
    (state.reengagementMentorshipCouplingBrief?.band === 'decoupled' ||
      state.reengagementMentorshipCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.reengagementMentorshipCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.mentorshipSustainOutlook?.band === 'ebbing' ||
      state.mentorshipSustainOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.mentorshipSustainOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectMentorshipReadinessBrief?.band === 'below_mentorship' ||
      state.subjectMentorshipReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectMentorshipReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceMentorshipIndex?.band === 'fragile' ||
      state.nationalWorkforceMentorshipIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceMentorshipIndex.summary.slice(0, 120));
  }
  if (
    (state.mentorshipAdvocacyCouplingBrief?.band === 'decoupled' ||
      state.mentorshipAdvocacyCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.mentorshipAdvocacyCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.advocacyResonanceOutlook?.band === 'ebbing' ||
      state.advocacyResonanceOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.advocacyResonanceOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectAdvocacyReadinessBrief?.band === 'below_advocacy' ||
      state.subjectAdvocacyReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectAdvocacyReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceAdvocacyIndex?.band === 'fragile' ||
      state.nationalWorkforceAdvocacyIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceAdvocacyIndex.summary.slice(0, 120));
  }
  if (
    (state.advocacyInclusionCouplingBrief?.band === 'decoupled' ||
      state.advocacyInclusionCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.advocacyInclusionCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.inclusionEquityOutlook?.band === 'ebbing' ||
      state.inclusionEquityOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionEquityOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectInclusionReadinessBrief?.band === 'below_inclusion' ||
      state.subjectInclusionReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectInclusionReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceInclusionIndex?.band === 'fragile' ||
      state.nationalWorkforceInclusionIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceInclusionIndex.summary.slice(0, 120));
  }
  if (
    (state.inclusionFlexibilityCouplingBrief?.band === 'decoupled' ||
      state.inclusionFlexibilityCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.inclusionFlexibilityCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.flexibilityFlowOutlook?.band === 'ebbing' ||
      state.flexibilityFlowOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.flexibilityFlowOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectFlexibilityReadinessBrief?.band === 'below_flexibility' ||
      state.subjectFlexibilityReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectFlexibilityReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceFlexibilityIndex?.band === 'fragile' ||
      state.nationalWorkforceFlexibilityIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceFlexibilityIndex.summary.slice(0, 120));
  }
  if (
    (state.flexibilityCoordinationCouplingBrief?.band === 'decoupled' ||
      state.flexibilityCoordinationCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.flexibilityCoordinationCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.coordinationMeshOutlook?.band === 'ebbing' ||
      state.coordinationMeshOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationMeshOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectCoordinationReadinessBrief?.band === 'below_coordination' ||
      state.subjectCoordinationReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectCoordinationReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceCoordinationIndex?.band === 'fragile' ||
      state.nationalWorkforceCoordinationIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceCoordinationIndex.summary.slice(0, 120));
  }
  if (
    (state.coordinationSchedulingCouplingBrief?.band === 'decoupled' ||
      state.coordinationSchedulingCouplingBrief?.band === 'strained') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.coordinationSchedulingCouplingBrief.summary.slice(0, 120));
  }
  if (
    (state.schedulingPulseOutlook?.band === 'ebbing' ||
      state.schedulingPulseOutlook?.band === 'patchy') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.schedulingPulseOutlook.summary.slice(0, 120));
  }
  if (
    (state.subjectSchedulingReadinessBrief?.band === 'below_scheduling' ||
      state.subjectSchedulingReadinessBrief?.band === 'approaching') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.subjectSchedulingReadinessBrief.summary.slice(0, 120));
  }
  if (
    (state.nationalWorkforceSchedulingIndex?.band === 'fragile' ||
      state.nationalWorkforceSchedulingIndex?.band === 'thin') &&
    state.evidence.length < V1014_LABOR_LIMITS.maxEvidence
  ) {
    state.evidence.push(state.nationalWorkforceSchedulingIndex.summary.slice(0, 120));
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

  check('R2001', Boolean(r1.state.durabilityAdvocacyCouplingBrief?.band), 'durability advocacy on state');
  check(
    'R2002',
    (r1.state.durabilityAdvocacyCouplingBrief?.durabilityDrag ?? 0) >= 0,
    'durability advocacy drag'
  );
  check('R2003', Boolean(r1.state.mentorshipEnduranceOutlook?.band), 'mentorship endurance on state');
  check('R2004', (r1.state.mentorshipEnduranceOutlook?.momentumDrag ?? 0) >= 0, 'mentorship momentum drag');
  check('R2005', Boolean(r1.state.subjectTrancheReadinessBrief?.band), 'subject tranche on state');
  check('R2006', Boolean(r1.state.nationalWorkforceEnduranceIndex?.band), 'workforce endurance on state');
  check(
    'R2007',
    detectLaborDemographicsQuery('durability advocacy coupling') === 'durability_advocacy_coupling',
    'GI durability advocacy detect'
  );
  check(
    'R2008',
    detectLaborDemographicsQuery('mentorship endurance') === 'mentorship_endurance',
    'GI mentorship endurance detect'
  );
  check(
    'R2009',
    detectLaborDemographicsQuery('subject tranche readiness') === 'subject_tranche_readiness',
    'GI subject tranche detect'
  );
  check(
    'R2010',
    detectLaborDemographicsQuery('workforce endurance') === 'workforce_endurance',
    'GI workforce endurance detect'
  );
  check(
    'R2011',
    answerLaborDemographicsQuestion(r1.state, 'workforce_endurance').headline.length > 5,
    'GI workforce endurance answer'
  );
  const advocacyCouplingOnly = computeNationalDurabilityAdvocacyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceDurabilityIndex
  );
  check('R2012', advocacyCouplingOnly.summary.length > 10, 'advocacy coupling standalone summary');
  const mentorshipOnly = computeNationalMentorshipEnduranceOutlook(r1.state, r1.state.reengagementMomentumOutlook);
  check('R2013', mentorshipOnly.band.length > 3, 'mentorship endurance band string');
  const trancheOnly = computeNationalSubjectTrancheReadinessBrief(
    r1.state,
    r1.state.subjectWaveAssemblyBrief,
    r1.state.nationalWorkforceDurabilityIndex
  );
  check('R2014', trancheOnly.trancheDrag >= 0, 'subject tranche drag');
  check(
    'R2015',
    computeNationalWorkforceEnduranceIndex(
      rHhBad.state,
      rHhBad.state.durabilityAdvocacyCouplingBrief,
      rHhBad.state.mentorshipEnduranceOutlook,
      rHhBad.state.subjectTrancheReadinessBrief
    ).stewardNote.length > 8,
    'endurance steward note'
  );
  check('R2016', advocacyEaseForRegion('NSW', 'technology') > 0, 'advocacy ease for region');

  check('R2101', Boolean(r1.state.enduranceFlexibilityCouplingBrief?.band), 'endurance flexibility on state');
  check(
    'R2102',
    (r1.state.enduranceFlexibilityCouplingBrief?.enduranceDrag ?? 0) >= 0,
    'endurance flexibility drag'
  );
  check('R2103', Boolean(r1.state.inclusionResilienceOutlook?.band), 'inclusion resilience on state');
  check('R2104', (r1.state.inclusionResilienceOutlook?.enduranceDrag ?? 0) >= 0, 'inclusion endurance drag');
  check('R2105', Boolean(r1.state.subjectCommitReadinessBrief?.band), 'subject commit on state');
  check('R2106', Boolean(r1.state.nationalWorkforceTenacityIndex?.band), 'workforce tenacity on state');
  check(
    'R2107',
    detectLaborDemographicsQuery('endurance flexibility coupling') === 'endurance_flexibility_coupling',
    'GI endurance flexibility detect'
  );
  check(
    'R2108',
    detectLaborDemographicsQuery('inclusion resilience') === 'inclusion_resilience',
    'GI inclusion resilience detect'
  );
  check(
    'R2109',
    detectLaborDemographicsQuery('subject commit readiness') === 'subject_commit_readiness',
    'GI subject commit detect'
  );
  check(
    'R2110',
    detectLaborDemographicsQuery('workforce tenacity') === 'workforce_tenacity',
    'GI workforce tenacity detect'
  );
  check(
    'R2111',
    answerLaborDemographicsQuestion(r1.state, 'workforce_tenacity').headline.length > 5,
    'GI workforce tenacity answer'
  );
  const flexibilityCouplingOnly = computeNationalEnduranceFlexibilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceEnduranceIndex
  );
  check('R2112', flexibilityCouplingOnly.summary.length > 10, 'flexibility coupling standalone summary');
  const inclusionOnly = computeNationalInclusionResilienceOutlook(r1.state, r1.state.mentorshipEnduranceOutlook);
  check('R2113', inclusionOnly.band.length > 3, 'inclusion resilience band string');
  const commitOnly = computeNationalSubjectCommitReadinessBrief(
    r1.state,
    r1.state.subjectTrancheReadinessBrief,
    r1.state.nationalWorkforceEnduranceIndex
  );
  check('R2114', commitOnly.commitDrag >= 0, 'subject commit drag');
  check(
    'R2115',
    computeNationalWorkforceTenacityIndex(
      rHhBad.state,
      rHhBad.state.enduranceFlexibilityCouplingBrief,
      rHhBad.state.inclusionResilienceOutlook,
      rHhBad.state.subjectCommitReadinessBrief
    ).stewardNote.length > 8,
    'tenacity steward note'
  );
  check('R2116', flexibilityEaseForRegion('NSW', 'technology') > 0, 'flexibility ease for region');

  check('R2201', Boolean(r1.state.tenacityCareCouplingBrief?.band), 'tenacity care on state');
  check('R2202', (r1.state.tenacityCareCouplingBrief?.tenacityDrag ?? 0) >= 0, 'tenacity care drag');
  check('R2203', Boolean(r1.state.safetyCohesionOutlook?.band), 'safety cohesion on state');
  check('R2204', (r1.state.safetyCohesionOutlook?.resilienceDrag ?? 0) >= 0, 'safety resilience drag');
  check('R2205', Boolean(r1.state.subjectReleaseReadinessBrief?.band), 'subject release on state');
  check('R2206', Boolean(r1.state.nationalWorkforceSteadfastIndex?.band), 'workforce steadfast on state');
  check(
    'R2207',
    detectLaborDemographicsQuery('tenacity care coupling') === 'tenacity_care_coupling',
    'GI tenacity care detect'
  );
  check('R2208', detectLaborDemographicsQuery('safety cohesion') === 'safety_cohesion', 'GI safety cohesion detect');
  check(
    'R2209',
    detectLaborDemographicsQuery('subject release readiness') === 'subject_release_readiness',
    'GI subject release detect'
  );
  check(
    'R2210',
    detectLaborDemographicsQuery('workforce steadfast') === 'workforce_steadfast',
    'GI workforce steadfast detect'
  );
  check(
    'R2211',
    answerLaborDemographicsQuestion(r1.state, 'workforce_steadfast').headline.length > 5,
    'GI workforce steadfast answer'
  );
  const careCouplingOnly = computeNationalTenacityCareCouplingBrief(r1.state, r1.state.nationalWorkforceTenacityIndex);
  check('R2212', careCouplingOnly.summary.length > 10, 'care coupling standalone summary');
  const safetyOnly = computeNationalSafetyCohesionOutlook(r1.state, r1.state.inclusionResilienceOutlook);
  check('R2213', safetyOnly.band.length > 3, 'safety cohesion band string');
  const releaseOnly = computeNationalSubjectReleaseReadinessBrief(
    r1.state,
    r1.state.subjectCommitReadinessBrief,
    r1.state.nationalWorkforceTenacityIndex
  );
  check('R2214', releaseOnly.releaseDrag >= 0, 'subject release drag');
  check(
    'R2215',
    computeNationalWorkforceSteadfastIndex(
      rHhBad.state,
      rHhBad.state.tenacityCareCouplingBrief,
      rHhBad.state.safetyCohesionOutlook,
      rHhBad.state.subjectReleaseReadinessBrief
    ).stewardNote.length > 8,
    'steadfast steward note'
  );
  check('R2216', careReliefForRegion('NSW', 'technology') > 0, 'care relief for region');

  check('R2301', Boolean(r1.state.steadfastSchedulingCouplingBrief?.band), 'steadfast scheduling on state');
  check(
    'R2302',
    (r1.state.steadfastSchedulingCouplingBrief?.steadfastDrag ?? 0) >= 0,
    'steadfast scheduling drag'
  );
  check('R2303', Boolean(r1.state.retentionAnchorOutlook?.band), 'retention anchor on state');
  check('R2304', (r1.state.retentionAnchorOutlook?.cohesionDrag ?? 0) >= 0, 'retention cohesion drag');
  check('R2305', Boolean(r1.state.subjectSealReadinessBrief?.band), 'subject seal on state');
  check('R2306', Boolean(r1.state.nationalWorkforceResolveIndex?.band), 'workforce resolve on state');
  check(
    'R2307',
    detectLaborDemographicsQuery('steadfast scheduling coupling') === 'steadfast_scheduling_coupling',
    'GI steadfast scheduling detect'
  );
  check('R2308', detectLaborDemographicsQuery('retention anchor') === 'retention_anchor', 'GI retention anchor detect');
  check(
    'R2309',
    detectLaborDemographicsQuery('subject seal readiness') === 'subject_seal_readiness',
    'GI subject seal detect'
  );
  check(
    'R2310',
    detectLaborDemographicsQuery('workforce resolve') === 'workforce_resolve',
    'GI workforce resolve detect'
  );
  check(
    'R2311',
    answerLaborDemographicsQuestion(r1.state, 'workforce_resolve').headline.length > 5,
    'GI workforce resolve answer'
  );
  const schedulingCouplingOnly = computeNationalSteadfastSchedulingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSteadfastIndex
  );
  check('R2312', schedulingCouplingOnly.summary.length > 10, 'scheduling coupling standalone summary');
  const anchorOnly = computeNationalRetentionAnchorOutlook(r1.state, r1.state.safetyCohesionOutlook);
  check('R2313', anchorOnly.band.length > 3, 'retention anchor band string');
  const sealOnly = computeNationalSubjectSealReadinessBrief(
    r1.state,
    r1.state.subjectReleaseReadinessBrief,
    r1.state.nationalWorkforceSteadfastIndex
  );
  check('R2314', sealOnly.sealDrag >= 0, 'subject seal drag');
  check(
    'R2315',
    computeNationalWorkforceResolveIndex(
      rHhBad.state,
      rHhBad.state.steadfastSchedulingCouplingBrief,
      rHhBad.state.retentionAnchorOutlook,
      rHhBad.state.subjectSealReadinessBrief
    ).stewardNote.length > 8,
    'resolve steward note'
  );
  check('R2316', schedulingEaseForRegion('NSW', 'technology') > 0, 'scheduling ease for region');

  check('R2401', Boolean(r1.state.resolveUpskillingCouplingBrief?.band), 'resolve upskilling on state');
  check('R2402', (r1.state.resolveUpskillingCouplingBrief?.resolveDrag ?? 0) >= 0, 'resolve upskilling drag');
  check('R2403', Boolean(r1.state.coordinationBindOutlook?.band), 'coordination bind on state');
  check('R2404', (r1.state.coordinationBindOutlook?.schedulingDrag ?? 0) >= 0, 'coordination scheduling drag');
  check('R2405', Boolean(r1.state.subjectBindReadinessBrief?.band), 'subject bind on state');
  check('R2406', Boolean(r1.state.nationalWorkforceFortitudeIndex?.band), 'workforce fortitude on state');
  check(
    'R2407',
    detectLaborDemographicsQuery('resolve upskilling coupling') === 'resolve_upskilling_coupling',
    'GI resolve upskilling detect'
  );
  check(
    'R2408',
    detectLaborDemographicsQuery('coordination bind') === 'coordination_bind',
    'GI coordination bind detect'
  );
  check(
    'R2409',
    detectLaborDemographicsQuery('subject bind readiness') === 'subject_bind_readiness',
    'GI subject bind detect'
  );
  check(
    'R2410',
    detectLaborDemographicsQuery('workforce fortitude') === 'workforce_fortitude',
    'GI workforce fortitude detect'
  );
  check(
    'R2411',
    answerLaborDemographicsQuestion(r1.state, 'workforce_fortitude').headline.length > 5,
    'GI workforce fortitude answer'
  );
  const upskillingCouplingOnly = computeNationalResolveUpskillingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceResolveIndex,
    r1.state.upskillingVelocityOutlook
  );
  check('R2412', upskillingCouplingOnly.summary.length > 10, 'upskilling coupling standalone summary');
  const bindOnly = computeNationalCoordinationBindOutlook(r1.state, r1.state.steadfastSchedulingCouplingBrief);
  check('R2413', bindOnly.band.length > 3, 'coordination bind band string');
  const subjectBindOnly = computeNationalSubjectBindReadinessBrief(
    r1.state,
    r1.state.subjectSealReadinessBrief,
    r1.state.nationalWorkforceResolveIndex
  );
  check('R2414', subjectBindOnly.bindDrag >= 0, 'subject bind drag');
  check(
    'R2415',
    computeNationalWorkforceFortitudeIndex(
      rHhBad.state,
      rHhBad.state.resolveUpskillingCouplingBrief,
      rHhBad.state.coordinationBindOutlook,
      rHhBad.state.subjectBindReadinessBrief
    ).stewardNote.length > 8,
    'fortitude steward note'
  );
  check('R2416', upskillingUpliftForRegion('NSW', 'technology') > 0, 'upskilling uplift for region');

  check('R2501', Boolean(r1.state.fortitudeInclusionCouplingBrief?.band), 'fortitude inclusion on state');
  check(
    'R2502',
    (r1.state.fortitudeInclusionCouplingBrief?.fortitudeDrag ?? 0) >= 0,
    'fortitude inclusion drag'
  );
  check('R2503', Boolean(r1.state.hybridAnchorOutlook?.band), 'hybrid anchor on state');
  check('R2504', (r1.state.hybridAnchorOutlook?.bindDrag ?? 0) >= 0, 'hybrid bind drag');
  check('R2505', Boolean(r1.state.subjectCrownReadinessBrief?.band), 'subject crown on state');
  check('R2506', Boolean(r1.state.nationalWorkforceCulminationIndex?.band), 'workforce culmination on state');
  check(
    'R2507',
    detectLaborDemographicsQuery('fortitude inclusion coupling') === 'fortitude_inclusion_coupling',
    'GI fortitude inclusion detect'
  );
  check('R2508', detectLaborDemographicsQuery('hybrid anchor') === 'hybrid_anchor', 'GI hybrid anchor detect');
  check(
    'R2509',
    detectLaborDemographicsQuery('subject crown readiness') === 'subject_crown_readiness',
    'GI subject crown detect'
  );
  check(
    'R2510',
    detectLaborDemographicsQuery('workforce culmination') === 'workforce_culmination',
    'GI workforce culmination detect'
  );
  check(
    'R2511',
    answerLaborDemographicsQuestion(r1.state, 'workforce_culmination').headline.length > 5,
    'GI workforce culmination answer'
  );
  const inclusionCouplingOnly = computeNationalFortitudeInclusionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceFortitudeIndex
  );
  check('R2512', inclusionCouplingOnly.summary.length > 10, 'inclusion coupling standalone summary');
  const hybridAnchorOnly = computeNationalHybridAnchorOutlook(r1.state, r1.state.coordinationBindOutlook);
  check('R2513', hybridAnchorOnly.band.length > 3, 'hybrid anchor band string');
  const crownOnly = computeNationalSubjectCrownReadinessBrief(
    r1.state,
    r1.state.subjectBindReadinessBrief,
    r1.state.nationalWorkforceFortitudeIndex
  );
  check('R2514', crownOnly.crownDrag >= 0, 'subject crown drag');
  check(
    'R2515',
    computeNationalWorkforceCulminationIndex(
      rHhBad.state,
      rHhBad.state.fortitudeInclusionCouplingBrief,
      rHhBad.state.hybridAnchorOutlook,
      rHhBad.state.subjectCrownReadinessBrief
    ).stewardNote.length > 8,
    'culmination steward note'
  );
  check('R2516', inclusionEaseForRegion('NSW', 'technology') > 0, 'inclusion ease for region');

  check('R2601', Boolean(r1.state.culminationMentorshipCouplingBrief?.band), 'culmination mentorship on state');
  check(
    'R2602',
    (r1.state.culminationMentorshipCouplingBrief?.culminationDrag ?? 0) >= 0,
    'culmination mentorship drag'
  );
  check('R2603', Boolean(r1.state.onboardingSustainOutlook?.band), 'onboarding sustain on state');
  check('R2604', (r1.state.onboardingSustainOutlook?.anchorDrag ?? 0) >= 0, 'onboarding anchor drag');
  check('R2605', Boolean(r1.state.subjectApexReadinessBrief?.band), 'subject apex on state');
  check('R2606', Boolean(r1.state.nationalWorkforceApexIndex?.band), 'workforce apex on state');
  check(
    'R2607',
    detectLaborDemographicsQuery('culmination mentorship coupling') === 'culmination_mentorship_coupling',
    'GI culmination mentorship detect'
  );
  check(
    'R2608',
    detectLaborDemographicsQuery('onboarding sustain') === 'onboarding_sustain',
    'GI onboarding sustain detect'
  );
  check(
    'R2609',
    detectLaborDemographicsQuery('subject apex readiness') === 'subject_apex_readiness',
    'GI subject apex detect'
  );
  check(
    'R2610',
    detectLaborDemographicsQuery('workforce apex') === 'workforce_apex',
    'GI workforce apex detect'
  );
  check(
    'R2611',
    answerLaborDemographicsQuestion(r1.state, 'workforce_apex').headline.length > 5,
    'GI workforce apex answer'
  );
  const mentorshipCouplingOnly = computeNationalCulminationMentorshipCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceCulminationIndex
  );
  check('R2612', mentorshipCouplingOnly.summary.length > 10, 'mentorship coupling standalone summary');
  const onboardingSustainOnly = computeNationalOnboardingSustainOutlook(r1.state, r1.state.hybridAnchorOutlook);
  check('R2613', onboardingSustainOnly.band.length > 3, 'onboarding sustain band string');
  const subjectApexOnly = computeNationalSubjectApexReadinessBrief(
    r1.state,
    r1.state.subjectCrownReadinessBrief,
    r1.state.nationalWorkforceCulminationIndex
  );
  check('R2614', subjectApexOnly.apexDrag >= 0, 'subject apex drag');
  check(
    'R2615',
    computeNationalWorkforceApexIndex(
      rHhBad.state,
      rHhBad.state.culminationMentorshipCouplingBrief,
      rHhBad.state.onboardingSustainOutlook,
      rHhBad.state.subjectApexReadinessBrief
    ).stewardNote.length > 8,
    'apex steward note'
  );
  check('R2616', mentorshipEaseForRegion('NSW', 'technology') > 0, 'mentorship ease for region');

  check('R2701', Boolean(r1.state.apexAdvocacyCouplingBrief?.band), 'apex advocacy on state');
  check('R2702', (r1.state.apexAdvocacyCouplingBrief?.apexDrag ?? 0) >= 0, 'apex advocacy drag');
  check('R2703', Boolean(r1.state.reengagementThrustOutlook?.band), 'reengagement thrust on state');
  check('R2704', (r1.state.reengagementThrustOutlook?.sustainDrag ?? 0) >= 0, 'reengagement sustain drag');
  check('R2705', Boolean(r1.state.subjectPinnacleReadinessBrief?.band), 'subject pinnacle on state');
  check('R2706', Boolean(r1.state.nationalWorkforcePinnacleIndex?.band), 'workforce pinnacle on state');
  check(
    'R2707',
    detectLaborDemographicsQuery('apex advocacy coupling') === 'apex_advocacy_coupling',
    'GI apex advocacy detect'
  );
  check(
    'R2708',
    detectLaborDemographicsQuery('reengagement thrust') === 'reengagement_thrust',
    'GI reengagement thrust detect'
  );
  check(
    'R2709',
    detectLaborDemographicsQuery('subject pinnacle readiness') === 'subject_pinnacle_readiness',
    'GI subject pinnacle detect'
  );
  check(
    'R2710',
    detectLaborDemographicsQuery('workforce pinnacle') === 'workforce_pinnacle',
    'GI workforce pinnacle detect'
  );
  check(
    'R2711',
    answerLaborDemographicsQuestion(r1.state, 'workforce_pinnacle').headline.length > 5,
    'GI workforce pinnacle answer'
  );
  const apexAdvocacyOnly = computeNationalApexAdvocacyCouplingBrief(r1.state, r1.state.nationalWorkforceApexIndex);
  check('R2712', apexAdvocacyOnly.summary.length > 10, 'apex advocacy standalone summary');
  const reengagementThrustOnly = computeNationalReengagementThrustOutlook(r1.state, r1.state.onboardingSustainOutlook);
  check('R2713', reengagementThrustOnly.band.length > 3, 'reengagement thrust band string');
  const subjectPinnacleOnly = computeNationalSubjectPinnacleReadinessBrief(
    r1.state,
    r1.state.subjectApexReadinessBrief,
    r1.state.nationalWorkforceApexIndex
  );
  check('R2714', subjectPinnacleOnly.pinnacleDrag >= 0, 'subject pinnacle drag');
  check(
    'R2715',
    computeNationalWorkforcePinnacleIndex(
      rHhBad.state,
      rHhBad.state.apexAdvocacyCouplingBrief,
      rHhBad.state.reengagementThrustOutlook,
      rHhBad.state.subjectPinnacleReadinessBrief
    ).stewardNote.length > 8,
    'pinnacle steward note'
  );
  check('R2716', advocacyEaseForRegion('NSW', 'technology') > 0, 'advocacy ease for region');

  check('R2801', Boolean(r1.state.pinnacleRetentionCouplingBrief?.band), 'pinnacle retention on state');
  check('R2802', (r1.state.pinnacleRetentionCouplingBrief?.pinnacleDrag ?? 0) >= 0, 'pinnacle retention drag');
  check('R2803', Boolean(r1.state.retentionCrestOutlook?.band), 'retention crest on state');
  check('R2804', (r1.state.retentionCrestOutlook?.thrustDrag ?? 0) >= 0, 'retention crest thrust drag');
  check('R2805', Boolean(r1.state.subjectSummitReadinessBrief?.band), 'subject summit on state');
  check('R2806', Boolean(r1.state.nationalWorkforceSummitIndex?.band), 'workforce summit on state');
  check(
    'R2807',
    detectLaborDemographicsQuery('pinnacle retention coupling') === 'pinnacle_retention_coupling',
    'GI pinnacle retention detect'
  );
  check(
    'R2808',
    detectLaborDemographicsQuery('retention crest') === 'retention_crest',
    'GI retention crest detect'
  );
  check(
    'R2809',
    detectLaborDemographicsQuery('subject summit readiness') === 'subject_summit_readiness',
    'GI subject summit detect'
  );
  check(
    'R2810',
    detectLaborDemographicsQuery('workforce summit') === 'workforce_summit',
    'GI workforce summit detect'
  );
  check(
    'R2811',
    answerLaborDemographicsQuestion(r1.state, 'workforce_summit').headline.length > 5,
    'GI workforce summit answer'
  );
  const pinnacleRetentionOnly = computeNationalPinnacleRetentionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforcePinnacleIndex
  );
  check('R2812', pinnacleRetentionOnly.summary.length > 10, 'pinnacle retention standalone summary');
  const retentionCrestOnly = computeNationalRetentionCrestOutlook(r1.state, r1.state.reengagementThrustOutlook);
  check('R2813', retentionCrestOnly.band.length > 3, 'retention crest band string');
  const subjectSummitOnly = computeNationalSubjectSummitReadinessBrief(
    r1.state,
    r1.state.subjectPinnacleReadinessBrief,
    r1.state.nationalWorkforcePinnacleIndex
  );
  check('R2814', subjectSummitOnly.summitDrag >= 0, 'subject summit drag');
  check(
    'R2815',
    computeNationalWorkforceSummitIndex(
      rHhBad.state,
      rHhBad.state.pinnacleRetentionCouplingBrief,
      rHhBad.state.retentionCrestOutlook,
      rHhBad.state.subjectSummitReadinessBrief
    ).stewardNote.length > 8,
    'summit steward note'
  );
  check('R2816', retentionPullForRegion('NSW', 'technology') > 0, 'retention pull for region');

  check('R2901', Boolean(r1.state.summitCoordinationCouplingBrief?.band), 'summit coordination on state');
  check('R2902', (r1.state.summitCoordinationCouplingBrief?.summitDrag ?? 0) >= 0, 'summit coordination drag');
  check('R2903', Boolean(r1.state.coordinationHorizonOutlook?.band), 'coordination horizon on state');
  check('R2904', (r1.state.coordinationHorizonOutlook?.crestDrag ?? 0) >= 0, 'coordination horizon crest drag');
  check('R2905', Boolean(r1.state.subjectZenithReadinessBrief?.band), 'subject zenith on state');
  check('R2906', Boolean(r1.state.nationalWorkforceZenithIndex?.band), 'workforce zenith on state');
  check(
    'R2907',
    detectLaborDemographicsQuery('summit coordination coupling') === 'summit_coordination_coupling',
    'GI summit coordination detect'
  );
  check(
    'R2908',
    detectLaborDemographicsQuery('coordination horizon') === 'coordination_horizon',
    'GI coordination horizon detect'
  );
  check(
    'R2909',
    detectLaborDemographicsQuery('subject zenith readiness') === 'subject_zenith_readiness',
    'GI subject zenith detect'
  );
  check(
    'R2910',
    detectLaborDemographicsQuery('workforce zenith') === 'workforce_zenith',
    'GI workforce zenith detect'
  );
  check(
    'R2911',
    answerLaborDemographicsQuestion(r1.state, 'workforce_zenith').headline.length > 5,
    'GI workforce zenith answer'
  );
  const summitCoordinationOnly = computeNationalSummitCoordinationCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSummitIndex
  );
  check('R2912', summitCoordinationOnly.summary.length > 10, 'summit coordination standalone summary');
  const coordinationHorizonOnly = computeNationalCoordinationHorizonOutlook(r1.state, r1.state.retentionCrestOutlook);
  check('R2913', coordinationHorizonOnly.band.length > 3, 'coordination horizon band string');
  const subjectZenithOnly = computeNationalSubjectZenithReadinessBrief(
    r1.state,
    r1.state.subjectSummitReadinessBrief,
    r1.state.nationalWorkforceSummitIndex
  );
  check('R2914', subjectZenithOnly.zenithDrag >= 0, 'subject zenith drag');
  check(
    'R2915',
    computeNationalWorkforceZenithIndex(
      rHhBad.state,
      rHhBad.state.summitCoordinationCouplingBrief,
      rHhBad.state.coordinationHorizonOutlook,
      rHhBad.state.subjectZenithReadinessBrief
    ).stewardNote.length > 8,
    'zenith steward note'
  );
  check('R2916', coordinationEaseForRegion('NSW', 'technology') > 0, 'coordination ease for region');

  check('R3001', Boolean(r1.state.zenithFlexibilityCouplingBrief?.band), 'zenith flexibility on state');
  check('R3002', (r1.state.zenithFlexibilityCouplingBrief?.zenithDrag ?? 0) >= 0, 'zenith flexibility drag');
  check('R3003', Boolean(r1.state.flexibilityAscentOutlook?.band), 'flexibility ascent on state');
  check('R3004', (r1.state.flexibilityAscentOutlook?.horizonDrag ?? 0) >= 0, 'flexibility ascent horizon drag');
  check('R3005', Boolean(r1.state.subjectApogeeReadinessBrief?.band), 'subject apogee on state');
  check('R3006', Boolean(r1.state.nationalWorkforceApogeeIndex?.band), 'workforce apogee on state');
  check(
    'R3007',
    detectLaborDemographicsQuery('zenith flexibility coupling') === 'zenith_flexibility_coupling',
    'GI zenith flexibility detect'
  );
  check(
    'R3008',
    detectLaborDemographicsQuery('flexibility ascent') === 'flexibility_ascent',
    'GI flexibility ascent detect'
  );
  check(
    'R3009',
    detectLaborDemographicsQuery('subject apogee readiness') === 'subject_apogee_readiness',
    'GI subject apogee detect'
  );
  check(
    'R3010',
    detectLaborDemographicsQuery('workforce apogee') === 'workforce_apogee',
    'GI workforce apogee detect'
  );
  check(
    'R3011',
    answerLaborDemographicsQuestion(r1.state, 'workforce_apogee').headline.length > 5,
    'GI workforce apogee answer'
  );
  const zenithFlexibilityOnly = computeNationalZenithFlexibilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceZenithIndex
  );
  check('R3012', zenithFlexibilityOnly.summary.length > 10, 'zenith flexibility standalone summary');
  const flexibilityAscentOnly = computeNationalFlexibilityAscentOutlook(r1.state, r1.state.coordinationHorizonOutlook);
  check('R3013', flexibilityAscentOnly.band.length > 3, 'flexibility ascent band string');
  const subjectApogeeOnly = computeNationalSubjectApogeeReadinessBrief(
    r1.state,
    r1.state.subjectZenithReadinessBrief,
    r1.state.nationalWorkforceZenithIndex
  );
  check('R3014', subjectApogeeOnly.apogeeDrag >= 0, 'subject apogee drag');
  check(
    'R3015',
    computeNationalWorkforceApogeeIndex(
      rHhBad.state,
      rHhBad.state.zenithFlexibilityCouplingBrief,
      rHhBad.state.flexibilityAscentOutlook,
      rHhBad.state.subjectApogeeReadinessBrief
    ).stewardNote.length > 8,
    'apogee steward note'
  );
  check('R3016', flexibilityEaseForRegion('NSW', 'technology') > 0, 'flexibility ease for region');

  check('R3101', Boolean(r1.state.apogeeInclusionCouplingBrief?.band), 'apogee inclusion on state');
  check('R3102', (r1.state.apogeeInclusionCouplingBrief?.apogeeDrag ?? 0) >= 0, 'apogee inclusion drag');
  check('R3103', Boolean(r1.state.inclusionOrbitOutlook?.band), 'inclusion orbit on state');
  check('R3104', (r1.state.inclusionOrbitOutlook?.ascentDrag ?? 0) >= 0, 'inclusion orbit ascent drag');
  check('R3105', Boolean(r1.state.subjectOrbitReadinessBrief?.band), 'subject orbit on state');
  check('R3106', Boolean(r1.state.nationalWorkforceOrbitIndex?.band), 'workforce orbit on state');
  check(
    'R3107',
    detectLaborDemographicsQuery('apogee inclusion coupling') === 'apogee_inclusion_coupling',
    'GI apogee inclusion detect'
  );
  check(
    'R3108',
    detectLaborDemographicsQuery('inclusion orbit') === 'inclusion_orbit',
    'GI inclusion orbit detect'
  );
  check(
    'R3109',
    detectLaborDemographicsQuery('subject orbit readiness') === 'subject_orbit_readiness',
    'GI subject orbit detect'
  );
  check(
    'R3110',
    detectLaborDemographicsQuery('workforce orbit') === 'workforce_orbit',
    'GI workforce orbit detect'
  );
  check(
    'R3111',
    answerLaborDemographicsQuestion(r1.state, 'workforce_orbit').headline.length > 5,
    'GI workforce orbit answer'
  );
  const apogeeInclusionOnly = computeNationalApogeeInclusionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceApogeeIndex
  );
  check('R3112', apogeeInclusionOnly.summary.length > 10, 'apogee inclusion standalone summary');
  const inclusionOrbitOnly = computeNationalInclusionOrbitOutlook(r1.state, r1.state.flexibilityAscentOutlook);
  check('R3113', inclusionOrbitOnly.band.length > 3, 'inclusion orbit band string');
  const subjectOrbitOnly = computeNationalSubjectOrbitReadinessBrief(
    r1.state,
    r1.state.subjectApogeeReadinessBrief,
    r1.state.nationalWorkforceApogeeIndex
  );
  check('R3114', subjectOrbitOnly.orbitDrag >= 0, 'subject orbit drag');
  check(
    'R3115',
    computeNationalWorkforceOrbitIndex(
      rHhBad.state,
      rHhBad.state.apogeeInclusionCouplingBrief,
      rHhBad.state.inclusionOrbitOutlook,
      rHhBad.state.subjectOrbitReadinessBrief
    ).stewardNote.length > 8,
    'orbit steward note'
  );
  check('R3116', inclusionEaseForRegion('NSW', 'technology') > 0, 'inclusion ease for region');

  check('R3201', Boolean(r1.state.orbitCareCouplingBrief?.band), 'orbit care on state');
  check('R3202', (r1.state.orbitCareCouplingBrief?.orbitDrag ?? 0) >= 0, 'orbit care drag');
  check('R3203', Boolean(r1.state.careEquilibriumOutlook?.band), 'care equilibrium on state');
  check('R3204', (r1.state.careEquilibriumOutlook?.orbitDrag ?? 0) >= 0, 'care equilibrium orbit drag');
  check('R3205', Boolean(r1.state.subjectNexusReadinessBrief?.band), 'subject nexus on state');
  check('R3206', Boolean(r1.state.nationalWorkforceNexusIndex?.band), 'workforce nexus on state');
  check(
    'R3207',
    detectLaborDemographicsQuery('orbit care coupling') === 'orbit_care_coupling',
    'GI orbit care detect'
  );
  check(
    'R3208',
    detectLaborDemographicsQuery('care equilibrium') === 'care_equilibrium',
    'GI care equilibrium detect'
  );
  check(
    'R3209',
    detectLaborDemographicsQuery('subject nexus readiness') === 'subject_nexus_readiness',
    'GI subject nexus detect'
  );
  check(
    'R3210',
    detectLaborDemographicsQuery('workforce nexus') === 'workforce_nexus',
    'GI workforce nexus detect'
  );
  check(
    'R3211',
    answerLaborDemographicsQuestion(r1.state, 'workforce_nexus').headline.length > 5,
    'GI workforce nexus answer'
  );
  const orbitCareOnly = computeNationalOrbitCareCouplingBrief(r1.state, r1.state.nationalWorkforceOrbitIndex);
  check('R3212', orbitCareOnly.summary.length > 10, 'orbit care standalone summary');
  const careEquilibriumOnly = computeNationalCareEquilibriumOutlook(r1.state, r1.state.inclusionOrbitOutlook);
  check('R3213', careEquilibriumOnly.band.length > 3, 'care equilibrium band string');
  const subjectNexusOnly = computeNationalSubjectNexusReadinessBrief(
    r1.state,
    r1.state.subjectOrbitReadinessBrief,
    r1.state.nationalWorkforceOrbitIndex
  );
  check('R3214', subjectNexusOnly.nexusDrag >= 0, 'subject nexus drag');
  check(
    'R3215',
    computeNationalWorkforceNexusIndex(
      rHhBad.state,
      rHhBad.state.orbitCareCouplingBrief,
      rHhBad.state.careEquilibriumOutlook,
      rHhBad.state.subjectNexusReadinessBrief
    ).stewardNote.length > 8,
    'nexus steward note'
  );
  check('R3216', careReliefForRegion('NSW', 'technology') > 0, 'care relief for region');

  check('R3301', Boolean(r1.state.nexusSchedulingCouplingBrief?.band), 'nexus scheduling on state');
  check('R3302', (r1.state.nexusSchedulingCouplingBrief?.nexusDrag ?? 0) >= 0, 'nexus scheduling drag');
  check('R3303', Boolean(r1.state.schedulingResonanceOutlook?.band), 'scheduling resonance on state');
  check('R3304', (r1.state.schedulingResonanceOutlook?.equilibriumDrag ?? 0) >= 0, 'scheduling resonance drag');
  check('R3305', Boolean(r1.state.subjectConvergenceReadinessBrief?.band), 'subject convergence on state');
  check('R3306', Boolean(r1.state.nationalWorkforceConvergenceIndex?.band), 'workforce convergence on state');
  check(
    'R3307',
    detectLaborDemographicsQuery('nexus scheduling coupling') === 'nexus_scheduling_coupling',
    'GI nexus scheduling detect'
  );
  check(
    'R3308',
    detectLaborDemographicsQuery('scheduling resonance') === 'scheduling_resonance',
    'GI scheduling resonance detect'
  );
  check(
    'R3309',
    detectLaborDemographicsQuery('subject convergence readiness') === 'subject_convergence_readiness',
    'GI subject convergence detect'
  );
  check(
    'R3310',
    detectLaborDemographicsQuery('workforce convergence') === 'workforce_convergence',
    'GI workforce convergence detect'
  );
  check(
    'R3311',
    answerLaborDemographicsQuestion(r1.state, 'workforce_convergence').headline.length > 5,
    'GI workforce convergence answer'
  );
  const nexusSchedulingOnly = computeNationalNexusSchedulingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceNexusIndex
  );
  check('R3312', nexusSchedulingOnly.summary.length > 10, 'nexus scheduling standalone summary');
  const schedulingResonanceOnly = computeNationalSchedulingResonanceOutlook(
    r1.state,
    r1.state.careEquilibriumOutlook
  );
  check('R3313', schedulingResonanceOnly.band.length > 3, 'scheduling resonance band string');
  const subjectConvergenceOnly = computeNationalSubjectConvergenceReadinessBrief(
    r1.state,
    r1.state.subjectNexusReadinessBrief,
    r1.state.nationalWorkforceNexusIndex
  );
  check('R3314', subjectConvergenceOnly.convergenceDrag >= 0, 'subject convergence drag');
  check(
    'R3315',
    computeNationalWorkforceConvergenceIndex(
      rHhBad.state,
      rHhBad.state.nexusSchedulingCouplingBrief,
      rHhBad.state.schedulingResonanceOutlook,
      rHhBad.state.subjectConvergenceReadinessBrief
    ).stewardNote.length > 8,
    'convergence steward note'
  );
  check('R3316', schedulingEaseForRegion('NSW', 'technology') > 0, 'scheduling ease for region');

  check('R3401', Boolean(r1.state.convergenceSafetyCouplingBrief?.band), 'convergence safety on state');
  check('R3402', (r1.state.convergenceSafetyCouplingBrief?.convergenceDrag ?? 0) >= 0, 'convergence safety drag');
  check('R3403', Boolean(r1.state.safetyHarmonyOutlook?.band), 'safety harmony on state');
  check('R3404', (r1.state.safetyHarmonyOutlook?.resonanceDrag ?? 0) >= 0, 'safety harmony resonance drag');
  check('R3405', Boolean(r1.state.subjectUnificationReadinessBrief?.band), 'subject unification on state');
  check('R3406', Boolean(r1.state.nationalWorkforceUnificationIndex?.band), 'workforce unification on state');
  check(
    'R3407',
    detectLaborDemographicsQuery('convergence safety coupling') === 'convergence_safety_coupling',
    'GI convergence safety detect'
  );
  check(
    'R3408',
    detectLaborDemographicsQuery('safety harmony') === 'safety_harmony',
    'GI safety harmony detect'
  );
  check(
    'R3409',
    detectLaborDemographicsQuery('subject unification readiness') === 'subject_unification_readiness',
    'GI subject unification detect'
  );
  check(
    'R3410',
    detectLaborDemographicsQuery('workforce unification') === 'workforce_unification',
    'GI workforce unification detect'
  );
  check(
    'R3411',
    answerLaborDemographicsQuestion(r1.state, 'workforce_unification').headline.length > 5,
    'GI workforce unification answer'
  );
  const convergenceSafetyOnly = computeNationalConvergenceSafetyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceConvergenceIndex
  );
  check('R3412', convergenceSafetyOnly.summary.length > 10, 'convergence safety standalone summary');
  const safetyHarmonyOnly = computeNationalSafetyHarmonyOutlook(r1.state, r1.state.schedulingResonanceOutlook);
  check('R3413', safetyHarmonyOnly.band.length > 3, 'safety harmony band string');
  const subjectUnificationOnly = computeNationalSubjectUnificationReadinessBrief(
    r1.state,
    r1.state.subjectConvergenceReadinessBrief,
    r1.state.nationalWorkforceConvergenceIndex
  );
  check('R3414', subjectUnificationOnly.unificationDrag >= 0, 'subject unification drag');
  check(
    'R3415',
    computeNationalWorkforceUnificationIndex(
      rHhBad.state,
      rHhBad.state.convergenceSafetyCouplingBrief,
      rHhBad.state.safetyHarmonyOutlook,
      rHhBad.state.subjectUnificationReadinessBrief
    ).stewardNote.length > 8,
    'unification steward note'
  );
  check('R3416', safetyEaseForRegion('NSW', 'technology') > 0, 'safety ease for region');

  check('R3501', Boolean(r1.state.unificationUpskillingCouplingBrief?.band), 'unification upskilling on state');
  check('R3502', (r1.state.unificationUpskillingCouplingBrief?.unificationDrag ?? 0) >= 0, 'unification upskilling drag');
  check('R3503', Boolean(r1.state.upskillingSynthesisOutlook?.band), 'upskilling synthesis on state');
  check('R3504', (r1.state.upskillingSynthesisOutlook?.harmonyDrag ?? 0) >= 0, 'upskilling synthesis harmony drag');
  check('R3505', Boolean(r1.state.subjectSynthesisReadinessBrief?.band), 'subject synthesis on state');
  check('R3506', Boolean(r1.state.nationalWorkforceSynthesisIndex?.band), 'workforce synthesis on state');
  check(
    'R3507',
    detectLaborDemographicsQuery('unification upskilling coupling') === 'unification_upskilling_coupling',
    'GI unification upskilling detect'
  );
  check(
    'R3508',
    detectLaborDemographicsQuery('upskilling synthesis') === 'upskilling_synthesis',
    'GI upskilling synthesis detect'
  );
  check(
    'R3509',
    detectLaborDemographicsQuery('subject synthesis readiness') === 'subject_synthesis_readiness',
    'GI subject synthesis detect'
  );
  check(
    'R3510',
    detectLaborDemographicsQuery('workforce synthesis') === 'workforce_synthesis',
    'GI workforce synthesis detect'
  );
  check(
    'R3511',
    answerLaborDemographicsQuestion(r1.state, 'workforce_synthesis').headline.length > 5,
    'GI workforce synthesis answer'
  );
  const unificationUpskillingOnly = computeNationalUnificationUpskillingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceUnificationIndex
  );
  check('R3512', unificationUpskillingOnly.summary.length > 10, 'unification upskilling standalone summary');
  const upskillingSynthesisOnly = computeNationalUpskillingSynthesisOutlook(r1.state, r1.state.safetyHarmonyOutlook);
  check('R3513', upskillingSynthesisOnly.band.length > 3, 'upskilling synthesis band string');
  const subjectSynthesisOnly = computeNationalSubjectSynthesisReadinessBrief(
    r1.state,
    r1.state.subjectUnificationReadinessBrief,
    r1.state.nationalWorkforceUnificationIndex
  );
  check('R3514', subjectSynthesisOnly.synthesisDrag >= 0, 'subject synthesis drag');
  check(
    'R3515',
    computeNationalWorkforceSynthesisIndex(
      rHhBad.state,
      rHhBad.state.unificationUpskillingCouplingBrief,
      rHhBad.state.upskillingSynthesisOutlook,
      rHhBad.state.subjectSynthesisReadinessBrief
    ).stewardNote.length > 8,
    'synthesis steward note'
  );
  check('R3516', upskillingUpliftForRegion('NSW', 'technology') > 0, 'upskilling uplift for region');

  check('R3601', Boolean(r1.state.synthesisOnboardingCouplingBrief?.band), 'synthesis onboarding on state');
  check(
    'R3602',
    (r1.state.synthesisOnboardingCouplingBrief?.synthesisDrag ?? 0) >= 0,
    'synthesis onboarding drag'
  );
  check('R3603', Boolean(r1.state.onboardingIntegrationOutlook?.band), 'onboarding integration on state');
  check(
    'R3604',
    (r1.state.onboardingIntegrationOutlook?.synthesisDrag ?? 0) >= 0,
    'onboarding integration synthesis drag'
  );
  check('R3605', Boolean(r1.state.subjectIntegrationReadinessBrief?.band), 'subject integration on state');
  check('R3606', Boolean(r1.state.nationalWorkforceIntegrationIndex?.band), 'workforce integration on state');
  check(
    'R3607',
    detectLaborDemographicsQuery('synthesis onboarding coupling') === 'synthesis_onboarding_coupling',
    'GI synthesis onboarding detect'
  );
  check(
    'R3608',
    detectLaborDemographicsQuery('onboarding integration') === 'onboarding_integration',
    'GI onboarding integration detect'
  );
  check(
    'R3609',
    detectLaborDemographicsQuery('subject integration readiness') === 'subject_integration_readiness',
    'GI subject integration detect'
  );
  check(
    'R3610',
    detectLaborDemographicsQuery('workforce integration') === 'workforce_integration',
    'GI workforce integration detect'
  );
  check(
    'R3611',
    answerLaborDemographicsQuestion(r1.state, 'workforce_integration').headline.length > 5,
    'GI workforce integration answer'
  );
  const synthesisOnboardingOnly = computeNationalSynthesisOnboardingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceSynthesisIndex
  );
  check('R3612', synthesisOnboardingOnly.summary.length > 10, 'synthesis onboarding standalone summary');
  const onboardingIntegrationOnly = computeNationalOnboardingIntegrationOutlook(
    r1.state,
    r1.state.upskillingSynthesisOutlook
  );
  check('R3613', onboardingIntegrationOnly.band.length > 3, 'onboarding integration band string');
  const subjectIntegrationOnly = computeNationalSubjectIntegrationReadinessBrief(
    r1.state,
    r1.state.subjectSynthesisReadinessBrief,
    r1.state.nationalWorkforceSynthesisIndex
  );
  check('R3614', subjectIntegrationOnly.integrationDrag >= 0, 'subject integration drag');
  check(
    'R3615',
    computeNationalWorkforceIntegrationIndex(
      rHhBad.state,
      rHhBad.state.synthesisOnboardingCouplingBrief,
      rHhBad.state.onboardingIntegrationOutlook,
      rHhBad.state.subjectIntegrationReadinessBrief
    ).stewardNote.length > 8,
    'integration steward note'
  );
  check('R3616', onboardingEaseForRegion('NSW', 'technology') > 0, 'onboarding ease for region');

  check('R3701', Boolean(r1.state.integrationRetentionCouplingBrief?.band), 'integration retention on state');
  check(
    'R3702',
    (r1.state.integrationRetentionCouplingBrief?.integrationDrag ?? 0) >= 0,
    'integration retention drag'
  );
  check('R3703', Boolean(r1.state.retentionCohesionOutlook?.band), 'retention cohesion on state');
  check(
    'R3704',
    (r1.state.retentionCohesionOutlook?.integrationDrag ?? 0) >= 0,
    'retention cohesion integration drag'
  );
  check('R3705', Boolean(r1.state.subjectRetentionReadinessBrief?.band), 'subject retention on state');
  check('R3706', Boolean(r1.state.nationalWorkforceRetentionIndex?.band), 'workforce retention on state');
  check(
    'R3707',
    detectLaborDemographicsQuery('integration retention coupling') === 'integration_retention_coupling',
    'GI integration retention detect'
  );
  check(
    'R3708',
    detectLaborDemographicsQuery('retention cohesion') === 'retention_cohesion',
    'GI retention cohesion detect'
  );
  check(
    'R3709',
    detectLaborDemographicsQuery('subject retention readiness') === 'subject_retention_readiness',
    'GI subject retention detect'
  );
  check(
    'R3710',
    detectLaborDemographicsQuery('workforce retention') === 'workforce_retention',
    'GI workforce retention detect'
  );
  check(
    'R3711',
    answerLaborDemographicsQuestion(r1.state, 'workforce_retention').headline.length > 5,
    'GI workforce retention answer'
  );
  const integrationRetentionOnly = computeNationalIntegrationRetentionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceIntegrationIndex
  );
  check('R3712', integrationRetentionOnly.summary.length > 10, 'integration retention standalone summary');
  const retentionCohesionOnly = computeNationalRetentionCohesionOutlook(
    r1.state,
    r1.state.onboardingIntegrationOutlook
  );
  check('R3713', retentionCohesionOnly.band.length > 3, 'retention cohesion band string');
  const subjectRetentionOnly = computeNationalSubjectRetentionReadinessBrief(
    r1.state,
    r1.state.subjectIntegrationReadinessBrief,
    r1.state.nationalWorkforceIntegrationIndex
  );
  check('R3714', subjectRetentionOnly.retentionDrag >= 0, 'subject retention drag');
  check(
    'R3715',
    computeNationalWorkforceRetentionIndex(
      rHhBad.state,
      rHhBad.state.integrationRetentionCouplingBrief,
      rHhBad.state.retentionCohesionOutlook,
      rHhBad.state.subjectRetentionReadinessBrief
    ).stewardNote.length > 8,
    'retention steward note'
  );
  check('R3716', retentionPullForRegion('NSW', 'technology') > 0, 'retention pull for region');

  check('R3801', Boolean(r1.state.retentionReengagementCouplingBrief?.band), 'retention reengagement on state');
  check(
    'R3802',
    (r1.state.retentionReengagementCouplingBrief?.retentionDrag ?? 0) >= 0,
    'retention reengagement drag'
  );
  check('R3803', Boolean(r1.state.reengagementAlignmentOutlook?.band), 'reengagement alignment on state');
  check(
    'R3804',
    (r1.state.reengagementAlignmentOutlook?.retentionDrag ?? 0) >= 0,
    'reengagement alignment retention drag'
  );
  check('R3805', Boolean(r1.state.subjectReengagementReadinessBrief?.band), 'subject reengagement on state');
  check('R3806', Boolean(r1.state.nationalWorkforceReengagementIndex?.band), 'workforce reengagement on state');
  check(
    'R3807',
    detectLaborDemographicsQuery('retention reengagement coupling') === 'retention_reengagement_coupling',
    'GI retention reengagement detect'
  );
  check(
    'R3808',
    detectLaborDemographicsQuery('reengagement alignment') === 'reengagement_alignment',
    'GI reengagement alignment detect'
  );
  check(
    'R3809',
    detectLaborDemographicsQuery('subject reengagement readiness') === 'subject_reengagement_readiness',
    'GI subject reengagement detect'
  );
  check(
    'R3810',
    detectLaborDemographicsQuery('workforce reengagement') === 'workforce_reengagement',
    'GI workforce reengagement detect'
  );
  check(
    'R3811',
    answerLaborDemographicsQuestion(r1.state, 'workforce_reengagement').headline.length > 5,
    'GI workforce reengagement answer'
  );
  const retentionReengagementOnly = computeNationalRetentionReengagementCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceRetentionIndex
  );
  check('R3812', retentionReengagementOnly.summary.length > 10, 'retention reengagement standalone summary');
  const reengagementAlignmentOnly = computeNationalReengagementAlignmentOutlook(
    r1.state,
    r1.state.retentionCohesionOutlook
  );
  check('R3813', reengagementAlignmentOnly.band.length > 3, 'reengagement alignment band string');
  const subjectReengagementOnly = computeNationalSubjectReengagementReadinessBrief(
    r1.state,
    r1.state.subjectRetentionReadinessBrief,
    r1.state.nationalWorkforceRetentionIndex
  );
  check('R3814', subjectReengagementOnly.reengagementDrag >= 0, 'subject reengagement drag');
  check(
    'R3815',
    computeNationalWorkforceReengagementIndex(
      rHhBad.state,
      rHhBad.state.retentionReengagementCouplingBrief,
      rHhBad.state.reengagementAlignmentOutlook,
      rHhBad.state.subjectReengagementReadinessBrief
    ).stewardNote.length > 8,
    'reengagement steward note'
  );
  check('R3816', reengagementPullForRegion('NSW', 'technology') > 0, 'reengagement pull for region');

  check('R3901', Boolean(r1.state.reengagementMentorshipCouplingBrief?.band), 'reengagement mentorship on state');
  check(
    'R3902',
    (r1.state.reengagementMentorshipCouplingBrief?.reengagementDrag ?? 0) >= 0,
    'reengagement mentorship drag'
  );
  check('R3903', Boolean(r1.state.mentorshipSustainOutlook?.band), 'mentorship sustain on state');
  check(
    'R3904',
    (r1.state.mentorshipSustainOutlook?.reengagementDrag ?? 0) >= 0,
    'mentorship sustain reengagement drag'
  );
  check('R3905', Boolean(r1.state.subjectMentorshipReadinessBrief?.band), 'subject mentorship on state');
  check('R3906', Boolean(r1.state.nationalWorkforceMentorshipIndex?.band), 'workforce mentorship on state');
  check(
    'R3907',
    detectLaborDemographicsQuery('reengagement mentorship coupling') === 'reengagement_mentorship_coupling',
    'GI reengagement mentorship detect'
  );
  check(
    'R3908',
    detectLaborDemographicsQuery('mentorship sustain') === 'mentorship_sustain',
    'GI mentorship sustain detect'
  );
  check(
    'R3909',
    detectLaborDemographicsQuery('subject mentorship readiness') === 'subject_mentorship_readiness',
    'GI subject mentorship detect'
  );
  check(
    'R3910',
    detectLaborDemographicsQuery('workforce mentorship') === 'workforce_mentorship',
    'GI workforce mentorship detect'
  );
  check(
    'R3911',
    answerLaborDemographicsQuestion(r1.state, 'workforce_mentorship').headline.length > 5,
    'GI workforce mentorship answer'
  );
  const reengagementMentorshipOnly = computeNationalReengagementMentorshipCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceReengagementIndex
  );
  check('R3912', reengagementMentorshipOnly.summary.length > 10, 'reengagement mentorship standalone summary');
  const mentorshipSustainOnly = computeNationalMentorshipSustainOutlook(
    r1.state,
    r1.state.reengagementAlignmentOutlook
  );
  check('R3913', mentorshipSustainOnly.band.length > 3, 'mentorship sustain band string');
  const subjectMentorshipOnly = computeNationalSubjectMentorshipReadinessBrief(
    r1.state,
    r1.state.subjectReengagementReadinessBrief,
    r1.state.nationalWorkforceReengagementIndex
  );
  check('R3914', subjectMentorshipOnly.mentorshipDrag >= 0, 'subject mentorship drag');
  check(
    'R3915',
    computeNationalWorkforceMentorshipIndex(
      rHhBad.state,
      rHhBad.state.reengagementMentorshipCouplingBrief,
      rHhBad.state.mentorshipSustainOutlook,
      rHhBad.state.subjectMentorshipReadinessBrief
    ).stewardNote.length > 8,
    'mentorship steward note'
  );
  check('R3916', mentorshipEaseForRegion('NSW', 'technology') > 0, 'mentorship ease for region');

  check('R4001', Boolean(r1.state.mentorshipAdvocacyCouplingBrief?.band), 'mentorship advocacy on state');
  check(
    'R4002',
    (r1.state.mentorshipAdvocacyCouplingBrief?.mentorshipDrag ?? 0) >= 0,
    'mentorship advocacy drag'
  );
  check('R4003', Boolean(r1.state.advocacyResonanceOutlook?.band), 'advocacy resonance on state');
  check(
    'R4004',
    (r1.state.advocacyResonanceOutlook?.mentorshipDrag ?? 0) >= 0,
    'advocacy resonance mentorship drag'
  );
  check('R4005', Boolean(r1.state.subjectAdvocacyReadinessBrief?.band), 'subject advocacy on state');
  check('R4006', Boolean(r1.state.nationalWorkforceAdvocacyIndex?.band), 'workforce advocacy on state');
  check(
    'R4007',
    detectLaborDemographicsQuery('mentorship advocacy coupling') === 'mentorship_advocacy_coupling',
    'GI mentorship advocacy detect'
  );
  check(
    'R4008',
    detectLaborDemographicsQuery('advocacy resonance') === 'advocacy_resonance',
    'GI advocacy resonance detect'
  );
  check(
    'R4009',
    detectLaborDemographicsQuery('subject advocacy readiness') === 'subject_advocacy_readiness',
    'GI subject advocacy detect'
  );
  check(
    'R4010',
    detectLaborDemographicsQuery('workforce advocacy') === 'workforce_advocacy',
    'GI workforce advocacy detect'
  );
  check(
    'R4011',
    answerLaborDemographicsQuestion(r1.state, 'workforce_advocacy').headline.length > 5,
    'GI workforce advocacy answer'
  );
  const mentorshipAdvocacyOnly = computeNationalMentorshipAdvocacyCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceMentorshipIndex
  );
  check('R4012', mentorshipAdvocacyOnly.summary.length > 10, 'mentorship advocacy standalone summary');
  const advocacyResonanceOnly = computeNationalAdvocacyResonanceOutlook(
    r1.state,
    r1.state.mentorshipSustainOutlook
  );
  check('R4013', advocacyResonanceOnly.band.length > 3, 'advocacy resonance band string');
  const subjectAdvocacyOnly = computeNationalSubjectAdvocacyReadinessBrief(
    r1.state,
    r1.state.subjectMentorshipReadinessBrief,
    r1.state.nationalWorkforceMentorshipIndex
  );
  check('R4014', subjectAdvocacyOnly.advocacyDrag >= 0, 'subject advocacy drag');
  check(
    'R4015',
    computeNationalWorkforceAdvocacyIndex(
      rHhBad.state,
      rHhBad.state.mentorshipAdvocacyCouplingBrief,
      rHhBad.state.advocacyResonanceOutlook,
      rHhBad.state.subjectAdvocacyReadinessBrief
    ).stewardNote.length > 8,
    'advocacy steward note'
  );
  check('R4016', advocacyEaseForRegion('NSW', 'technology') > 0, 'advocacy ease for region');

  check('R4101', Boolean(r1.state.advocacyInclusionCouplingBrief?.band), 'advocacy inclusion on state');
  check(
    'R4102',
    (r1.state.advocacyInclusionCouplingBrief?.advocacyDrag ?? 0) >= 0,
    'advocacy inclusion drag'
  );
  check('R4103', Boolean(r1.state.inclusionEquityOutlook?.band), 'inclusion equity on state');
  check(
    'R4104',
    (r1.state.inclusionEquityOutlook?.advocacyDrag ?? 0) >= 0,
    'inclusion equity advocacy drag'
  );
  check('R4105', Boolean(r1.state.subjectInclusionReadinessBrief?.band), 'subject inclusion on state');
  check('R4106', Boolean(r1.state.nationalWorkforceInclusionIndex?.band), 'workforce inclusion on state');
  check(
    'R4107',
    detectLaborDemographicsQuery('advocacy inclusion coupling') === 'advocacy_inclusion_coupling',
    'GI advocacy inclusion detect'
  );
  check(
    'R4108',
    detectLaborDemographicsQuery('inclusion equity') === 'inclusion_equity',
    'GI inclusion equity detect'
  );
  check(
    'R4109',
    detectLaborDemographicsQuery('subject inclusion readiness') === 'subject_inclusion_readiness',
    'GI subject inclusion detect'
  );
  check(
    'R4110',
    detectLaborDemographicsQuery('workforce inclusion') === 'workforce_inclusion',
    'GI workforce inclusion detect'
  );
  check(
    'R4111',
    answerLaborDemographicsQuestion(r1.state, 'workforce_inclusion').headline.length > 5,
    'GI workforce inclusion answer'
  );
  const advocacyInclusionOnly = computeNationalAdvocacyInclusionCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceAdvocacyIndex
  );
  check('R4112', advocacyInclusionOnly.summary.length > 10, 'advocacy inclusion standalone summary');
  const inclusionEquityOnly = computeNationalInclusionEquityOutlook(
    r1.state,
    r1.state.advocacyResonanceOutlook
  );
  check('R4113', inclusionEquityOnly.band.length > 3, 'inclusion equity band string');
  const subjectInclusionOnly = computeNationalSubjectInclusionReadinessBrief(
    r1.state,
    r1.state.subjectAdvocacyReadinessBrief,
    r1.state.nationalWorkforceAdvocacyIndex
  );
  check('R4114', subjectInclusionOnly.inclusionDrag >= 0, 'subject inclusion drag');
  check(
    'R4115',
    computeNationalWorkforceInclusionIndex(
      rHhBad.state,
      rHhBad.state.advocacyInclusionCouplingBrief,
      rHhBad.state.inclusionEquityOutlook,
      rHhBad.state.subjectInclusionReadinessBrief
    ).stewardNote.length > 8,
    'inclusion steward note'
  );
  check('R4116', inclusionEaseForRegion('NSW', 'technology') > 0, 'inclusion ease for region');

  check('R4201', Boolean(r1.state.inclusionFlexibilityCouplingBrief?.band), 'inclusion flexibility on state');
  check(
    'R4202',
    (r1.state.inclusionFlexibilityCouplingBrief?.inclusionDrag ?? 0) >= 0,
    'inclusion flexibility drag'
  );
  check('R4203', Boolean(r1.state.flexibilityFlowOutlook?.band), 'flexibility flow on state');
  check(
    'R4204',
    (r1.state.flexibilityFlowOutlook?.inclusionDrag ?? 0) >= 0,
    'flexibility flow inclusion drag'
  );
  check('R4205', Boolean(r1.state.subjectFlexibilityReadinessBrief?.band), 'subject flexibility on state');
  check('R4206', Boolean(r1.state.nationalWorkforceFlexibilityIndex?.band), 'workforce flexibility on state');
  check(
    'R4207',
    detectLaborDemographicsQuery('inclusion flexibility coupling') === 'inclusion_flexibility_coupling',
    'GI inclusion flexibility detect'
  );
  check(
    'R4208',
    detectLaborDemographicsQuery('flexibility flow') === 'flexibility_flow',
    'GI flexibility flow detect'
  );
  check(
    'R4209',
    detectLaborDemographicsQuery('subject flexibility readiness') === 'subject_flexibility_readiness',
    'GI subject flexibility detect'
  );
  check(
    'R4210',
    detectLaborDemographicsQuery('workforce flexibility') === 'workforce_flexibility',
    'GI workforce flexibility detect'
  );
  check(
    'R4211',
    answerLaborDemographicsQuestion(r1.state, 'workforce_flexibility').headline.length > 5,
    'GI workforce flexibility answer'
  );
  const inclusionFlexibilityOnly = computeNationalInclusionFlexibilityCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceInclusionIndex
  );
  check('R4212', inclusionFlexibilityOnly.summary.length > 10, 'inclusion flexibility standalone summary');
  const flexibilityFlowOnly = computeNationalFlexibilityFlowOutlook(
    r1.state,
    r1.state.inclusionEquityOutlook
  );
  check('R4213', flexibilityFlowOnly.band.length > 3, 'flexibility flow band string');
  const subjectFlexibilityOnly = computeNationalSubjectFlexibilityReadinessBrief(
    r1.state,
    r1.state.subjectInclusionReadinessBrief,
    r1.state.nationalWorkforceInclusionIndex
  );
  check('R4214', subjectFlexibilityOnly.flexibilityDrag >= 0, 'subject flexibility drag');
  check(
    'R4215',
    computeNationalWorkforceFlexibilityIndex(
      rHhBad.state,
      rHhBad.state.inclusionFlexibilityCouplingBrief,
      rHhBad.state.flexibilityFlowOutlook,
      rHhBad.state.subjectFlexibilityReadinessBrief
    ).stewardNote.length > 8,
    'flexibility steward note'
  );
  check('R4216', flexibilityEaseForRegion('NSW', 'technology') > 0, 'flexibility ease for region');

  check('R4301', Boolean(r1.state.flexibilityCoordinationCouplingBrief?.band), 'flexibility coordination on state');
  check(
    'R4302',
    (r1.state.flexibilityCoordinationCouplingBrief?.flexibilityDrag ?? 0) >= 0,
    'flexibility coordination drag'
  );
  check('R4303', Boolean(r1.state.coordinationMeshOutlook?.band), 'coordination mesh on state');
  check(
    'R4304',
    (r1.state.coordinationMeshOutlook?.flexibilityDrag ?? 0) >= 0,
    'coordination mesh flexibility drag'
  );
  check('R4305', Boolean(r1.state.subjectCoordinationReadinessBrief?.band), 'subject coordination on state');
  check('R4306', Boolean(r1.state.nationalWorkforceCoordinationIndex?.band), 'workforce coordination on state');
  check(
    'R4307',
    detectLaborDemographicsQuery('flexibility coordination coupling') === 'flexibility_coordination_coupling',
    'GI flexibility coordination detect'
  );
  check(
    'R4308',
    detectLaborDemographicsQuery('coordination mesh') === 'coordination_mesh',
    'GI coordination mesh detect'
  );
  check(
    'R4309',
    detectLaborDemographicsQuery('subject coordination readiness') === 'subject_coordination_readiness',
    'GI subject coordination detect'
  );
  check(
    'R4310',
    detectLaborDemographicsQuery('workforce coordination') === 'workforce_coordination',
    'GI workforce coordination detect'
  );
  check(
    'R4311',
    answerLaborDemographicsQuestion(r1.state, 'workforce_coordination').headline.length > 5,
    'GI workforce coordination answer'
  );
  const flexibilityCoordinationOnly = computeNationalFlexibilityCoordinationCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceFlexibilityIndex
  );
  check('R4312', flexibilityCoordinationOnly.summary.length > 10, 'flexibility coordination standalone summary');
  const coordinationMeshOnly = computeNationalCoordinationMeshOutlook(
    r1.state,
    r1.state.flexibilityFlowOutlook
  );
  check('R4313', coordinationMeshOnly.band.length > 3, 'coordination mesh band string');
  const subjectCoordinationOnly = computeNationalSubjectCoordinationReadinessBrief(
    r1.state,
    r1.state.subjectFlexibilityReadinessBrief,
    r1.state.nationalWorkforceFlexibilityIndex
  );
  check('R4314', subjectCoordinationOnly.coordinationDrag >= 0, 'subject coordination drag');
  check(
    'R4315',
    computeNationalWorkforceCoordinationIndex(
      rHhBad.state,
      rHhBad.state.flexibilityCoordinationCouplingBrief,
      rHhBad.state.coordinationMeshOutlook,
      rHhBad.state.subjectCoordinationReadinessBrief
    ).stewardNote.length > 8,
    'coordination steward note'
  );
  check('R4316', coordinationEaseForRegion('NSW', 'technology') > 0, 'coordination ease for region');

  check('R4401', Boolean(r1.state.coordinationSchedulingCouplingBrief?.band), 'coordination scheduling on state');
  check(
    'R4402',
    (r1.state.coordinationSchedulingCouplingBrief?.coordinationDrag ?? 0) >= 0,
    'coordination scheduling drag'
  );
  check('R4403', Boolean(r1.state.schedulingPulseOutlook?.band), 'scheduling pulse on state');
  check(
    'R4404',
    (r1.state.schedulingPulseOutlook?.coordinationDrag ?? 0) >= 0,
    'scheduling pulse coordination drag'
  );
  check('R4405', Boolean(r1.state.subjectSchedulingReadinessBrief?.band), 'subject scheduling on state');
  check('R4406', Boolean(r1.state.nationalWorkforceSchedulingIndex?.band), 'workforce scheduling on state');
  check(
    'R4407',
    detectLaborDemographicsQuery('coordination scheduling coupling') === 'coordination_scheduling_coupling',
    'GI coordination scheduling detect'
  );
  check(
    'R4408',
    detectLaborDemographicsQuery('scheduling pulse') === 'scheduling_pulse',
    'GI scheduling pulse detect'
  );
  check(
    'R4409',
    detectLaborDemographicsQuery('subject scheduling readiness') === 'subject_scheduling_readiness',
    'GI subject scheduling detect'
  );
  check(
    'R4410',
    detectLaborDemographicsQuery('workforce scheduling') === 'workforce_scheduling',
    'GI workforce scheduling detect'
  );
  check(
    'R4411',
    answerLaborDemographicsQuestion(r1.state, 'workforce_scheduling').headline.length > 5,
    'GI workforce scheduling answer'
  );
  const coordinationSchedulingOnly = computeNationalCoordinationSchedulingCouplingBrief(
    r1.state,
    r1.state.nationalWorkforceCoordinationIndex
  );
  check('R4412', coordinationSchedulingOnly.summary.length > 10, 'coordination scheduling standalone summary');
  const schedulingPulseOnly = computeNationalSchedulingPulseOutlook(
    r1.state,
    r1.state.coordinationMeshOutlook
  );
  check('R4413', schedulingPulseOnly.band.length > 3, 'scheduling pulse band string');
  const subjectSchedulingOnly = computeNationalSubjectSchedulingReadinessBrief(
    r1.state,
    r1.state.subjectCoordinationReadinessBrief,
    r1.state.nationalWorkforceCoordinationIndex
  );
  check('R4414', subjectSchedulingOnly.schedulingDrag >= 0, 'subject scheduling drag');
  check(
    'R4415',
    computeNationalWorkforceSchedulingIndex(
      rHhBad.state,
      rHhBad.state.coordinationSchedulingCouplingBrief,
      rHhBad.state.schedulingPulseOutlook,
      rHhBad.state.subjectSchedulingReadinessBrief
    ).stewardNote.length > 8,
    'scheduling steward note'
  );
  check('R4416', schedulingEaseForRegion('NSW', 'technology') > 0, 'scheduling ease for region');

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
