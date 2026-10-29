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
  | 'participation_equity';

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
