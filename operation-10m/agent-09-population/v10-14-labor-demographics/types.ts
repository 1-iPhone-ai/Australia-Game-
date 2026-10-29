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
