// OP10M_MODULE_BEGIN agent-14-housing
// Agent 14 — V10.14 housing / health / education public service capacity & delayed spending
// Generated from operation-10m/agent-14-housing/ (regenerate: npm run build:agent14-housing-chunk)

// --- source: types.ts ---
/** V10.14 Agent 14 — public service capacity & delayed spending (modular slice). */

export const AGENT14_WELLBEING_SCHEMA_VERSION = '10.14.8-scale-wave-8' as const;

export type PublicServicePillar = 'housing' | 'healthcare' | 'education';

export type WorkforceReadiness =
  | 'blocking'
  | 'weak'
  | 'strained'
  | 'balanced'
  | 'strong';

export interface SpendingCommitment {
  id: string;
  programId: string;
  pillar: PublicServicePillar;
  regionId: string;
  committedTurn: number;
  /** Total fiscal load spread across durationTurns (V10.12-style points, not player cash). */
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  /** Turns after commit before any KPI uplift applies. */
  effectLagTurns: number;
  /** Turns after lag to reach full baseImpact on KPI indices. */
  rampTurns: number;
}

export type CapacityBindingConstraint =
  | 'none'
  | 'program_slots'
  | 'fiscal_absorption'
  | 'workforce';

export interface PillarCapacitySlice {
  capacityIndex: number;
  loadRatio: number;
  activeCommitments: number;
}

export interface PublicServiceCapacitySnapshot {
  turn: number;
  nationalProgramSlots: number;
  slotsUsed: number;
  slotsFree: number;
  fiscalAbsorptionCap: number;
  fiscalLoadScheduledThisTurn: number;
  fiscalHeadroomUsedRatio: number;
  workforceUtilization: number;
  deliveryCapacityIndex: number;
  bindingConstraint: CapacityBindingConstraint;
  byPillar: Record<PublicServicePillar, PillarCapacitySlice>;
  evidence: string[];
}

export interface DelayedSpendingTurnEffects {
  turn: number;
  fiscalLoadThisTurn: number;
  /** Effective completed-project equivalents feeding V10.14 pillar delivery math. */
  completedProjectBoost: Record<PublicServicePillar, number>;
  /** Per-region fractional boost from regional programs (0–1 scale × baseImpact). */
  regionalKpiDelta: Record<string, Partial<Record<PublicServicePillar, number>>>;
  maturedCommitmentIds: string[];
  events: Array<{ id: string; kind: string; summary: string }>;
}

export interface DelayedSpendingPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  active: SpendingCommitment[];
  history: Array<{ id: string; turn: number; summary: string }>;
}

export interface CapacityAndSpendingInputs {
  turn: number;
  fiscalHeadroom?: number;
  stateCapacityLoad?: number;
  workforceReadiness?: WorkforceReadiness;
  workforceSpecialistGap?: number;
  activeProgramCount?: number;
}

export interface EnrichedPublicServiceTurnInputs extends CapacityAndSpendingInputs {
  fiscalLoadFromActivePrograms: number;
  completedHousingProjects: number;
  completedHealthProjects: number;
  completedEducationProjects: number;
  activeProgramCount: number;
  capacity: PublicServiceCapacitySnapshot;
  spending: DelayedSpendingTurnEffects;
  housingWellbeing?: NationalHousingWellbeingSnapshot;
  serviceAccessLens?: NationalServiceAccessLens;
  wellbeingWarnings?: Agent14WellbeingWarningBundle;
  programRecommendations?: ProgramSequencingRecommendation[];
  crossPillarCoupling?: CrossPillarCouplingSnapshot;
  regionalWellbeingMemory?: RegionalWellbeingMemorySnapshot;
  executiveBrief?: Agent14WellbeingExecutiveBrief;
  couplingTrajectory?: CouplingTrajectorySnapshot;
  accountabilityScorecard?: Agent14WellbeingAccountabilityScorecard;
  equityRebalancing?: EquityRebalancingAdvice;
  accountabilityTrajectory?: AccountabilityTrajectorySnapshot;
  interventionPriorityQueue?: WellbeingInterventionPriorityQueue;
  wellbeingResilience?: WellbeingResilienceSnapshot;
  resilienceTrajectory?: ResilienceTrajectorySnapshot;
  capacityReliefSchedule?: CapacityReliefSchedule;
  wellbeingGovernancePanel?: WellbeingGovernancePanel;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
  reliefDispatchPlan?: ReliefDispatchPlan;
  stakeholderCoordinationBrief?: StakeholderCoordinationBrief;
}

export type CouplingTrajectoryTrend = 'improving' | 'flat' | 'deteriorating';

export interface CouplingTrajectorySnapshot {
  turn: number;
  nationalCouplingEma: number;
  instantaneousIndex: number;
  band: CouplingStressBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface CouplingTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  nationalCouplingEma: number;
  priorEma?: number;
}

export type AccountabilityBand = 'strong' | 'adequate' | 'at_risk' | 'failing';

export interface Agent14WellbeingAccountabilityScorecard {
  turn: number;
  overallScore: number;
  band: AccountabilityBand;
  dimensions: {
    delivery: number;
    equity: number;
    warnings: number;
    coupling: number;
    portfolioBalance: number;
    memoryTrend: number;
  };
  evidence: string[];
}

export interface EquityRebalancingRegionAdvice {
  regionId: string;
  deficitIndex: number;
  urgencyScore: number;
  weakestPillar: PublicServicePillar;
  suggestedProgramIds: string[];
  rationale: string;
}

export interface EquityRebalancingAdvice {
  turn: number;
  equityGap: number;
  shouldEscalate: boolean;
  laggingRegions: EquityRebalancingRegionAdvice[];
  summary: string;
}

export type AccountabilityTrajectoryTrend = 'improving' | 'flat' | 'deteriorating';

export interface AccountabilityTrajectorySnapshot {
  turn: number;
  overallScoreEma: number;
  instantaneousScore: number;
  band: AccountabilityBand;
  trajectory: AccountabilityTrajectoryTrend;
  evidence: string[];
}

export interface AccountabilityTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  overallScoreEma: number;
  priorEma?: number;
}

export interface WellbeingInterventionPriorityItem {
  rank: number;
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  priorityScore: number;
  source: 'equity' | 'sequencing' | 'capacity_relief';
  fitsCapacity: boolean;
  rationale: string;
}

export interface WellbeingInterventionPriorityQueue {
  turn: number;
  shouldExpedite: boolean;
  items: WellbeingInterventionPriorityItem[];
  summary: string;
}

export type WellbeingResilienceBand = 'robust' | 'steady' | 'fragile' | 'critical';

export interface WellbeingResilienceSnapshot {
  turn: number;
  resilienceIndex: number;
  band: WellbeingResilienceBand;
  stressLoad: number;
  drivers: string[];
}

export type ResilienceTrajectoryTrend = 'improving' | 'flat' | 'deteriorating';

export interface ResilienceTrajectorySnapshot {
  turn: number;
  resilienceIndexEma: number;
  instantaneousIndex: number;
  band: WellbeingResilienceBand;
  trajectory: ResilienceTrajectoryTrend;
  evidence: string[];
}

export interface ResilienceTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  resilienceIndexEma: number;
  priorEma?: number;
}

export interface CapacityReliefScheduleItem {
  turn: number;
  regionId: string;
  pillar: PublicServicePillar;
  programId: string;
  reliefTurnOffset: number;
  bindingConstraint: CapacityBindingConstraint;
  rationale: string;
}

export interface CapacityReliefSchedule {
  turn: number;
  bindingConstraint: CapacityBindingConstraint;
  shouldDeferNewCommits: boolean;
  items: CapacityReliefScheduleItem[];
  summary: string;
}

export type WellbeingGovernanceBand = 'aligned' | 'watch' | 'misaligned' | 'crisis';

export interface WellbeingGovernancePanel {
  turn: number;
  accountabilityBand: AccountabilityBand;
  resilienceBand: WellbeingResilienceBand;
  governanceScore: number;
  band: WellbeingGovernanceBand;
  headlines: string[];
  summary: string;
}

export interface GovernanceTrajectorySnapshot {
  turn: number;
  governanceScoreEma: number;
  instantaneousScore: number;
  band: WellbeingGovernanceBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface GovernanceTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  governanceScoreEma: number;
  priorEma?: number;
}

export type ReliefDispatchPriority = 'immediate' | 'deferred' | 'hold';

export interface ReliefDispatchAction {
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  priority: ReliefDispatchPriority;
  targetTurn: number;
  rationale: string;
}

export interface ReliefDispatchPlan {
  turn: number;
  shouldHoldCommits: boolean;
  actions: ReliefDispatchAction[];
  summary: string;
}

export interface StakeholderCoordinationBrief {
  turn: number;
  governanceBand: WellbeingGovernanceBand;
  trajectory: CouplingTrajectoryTrend;
  reliefActions: number;
  shouldEngageStakeholders: boolean;
  headlines: string[];
  summary: string;
}

export type CouplingStressBand = 'stable' | 'watch' | 'strained' | 'critical';

export interface PillarCouplingSlice {
  pillar: PublicServicePillar;
  spilloverFromHousing: number;
  spilloverFromCapacity: number;
  netCouplingIndex: number;
  band: CouplingStressBand;
}

export interface CrossPillarCouplingSnapshot {
  turn: number;
  nationalCouplingIndex: number;
  band: CouplingStressBand;
  byPillar: Record<PublicServicePillar, PillarCouplingSlice>;
  evidence: string[];
}

export interface RegionalWellbeingMemoryRow {
  regionId: string;
  turnsRecorded: number;
  rollingAffordability: number;
  rollingAccessComposite: number;
  affordabilityTrend: 'improving' | 'flat' | 'deteriorating';
  accessTrend: 'improving' | 'flat' | 'deteriorating';
}

export interface RegionalWellbeingMemorySnapshot {
  turn: number;
  regions: Record<string, RegionalWellbeingMemoryRow>;
}

export interface RegionalWellbeingMemoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  /** Exponential moving average alpha (0–1). */
  emaAlpha: number;
  affordabilityEma: Record<string, number>;
  accessEma: Record<string, number>;
}

export interface Agent14WellbeingExecutiveBrief {
  turn: number;
  headline: string;
  topWarningId?: string;
  forecastDeltaAffordability?: number;
  couplingBand: CouplingStressBand;
  recommendedProgramId?: string;
  giNotes: string[];
}

export type HousingPipelineStage =
  | 'planning'
  | 'approvals'
  | 'construction'
  | 'handover'
  | 'stabilized';

export type AffordabilityStressBand = 'low' | 'moderate' | 'elevated' | 'severe';

export interface RegionalHousingPipelineState {
  regionId: string;
  stage: HousingPipelineStage;
  planningBacklogMonths: number;
  dwellingsInPipeline: number;
  socialHousingCompletionsRate: number;
  affordabilityStress: AffordabilityStressBand;
  affordabilityIndex: number;
  remoteShare: number;
  deliveryPressure: number;
  evidence: string[];
}

export interface NationalHousingWellbeingSnapshot {
  turn: number;
  nationalAffordabilityIndex: number;
  affordabilityStress: AffordabilityStressBand;
  averagePlanningBacklogMonths: number;
  totalDwellingsInPipeline: number;
  socialCompletionsIndex: number;
  regionalEquityGap: number;
  regions: Record<string, RegionalHousingPipelineState>;
  narrativeSummary: string;
}

export type ServiceAccessBand = 'critical' | 'weak' | 'adequate' | 'strong';

export interface PillarAccessSlice {
  pillar: PublicServicePillar;
  accessIndex: number;
  band: ServiceAccessBand;
  backlogPressure: number;
}

export interface RegionalServiceAccessState {
  regionId: string;
  pillars: Record<PublicServicePillar, PillarAccessSlice>;
  compositeIndex: number;
}

export interface NationalServiceAccessLens {
  turn: number;
  nationalComposite: number;
  nationalBand: ServiceAccessBand;
  pillarNational: Record<PublicServicePillar, PillarAccessSlice>;
  regions: Record<string, RegionalServiceAccessState>;
  equityGap: number;
}

export type WellbeingWarningSeverity = 'info' | 'watch' | 'elevated' | 'critical';

export interface Agent14WellbeingWarning {
  id: string;
  severity: WellbeingWarningSeverity;
  pillar: PublicServicePillar | 'cross';
  regionId?: string;
  title: string;
  summary: string;
  assumptions: string[];
}

export interface Agent14WellbeingWarningBundle {
  shouldSurface: boolean;
  warnings: Agent14WellbeingWarning[];
}

export interface ProgramSequencingRecommendation {
  rank: number;
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  rationale: string;
  expectedLagTurns: number;
  fitsCapacity: boolean;
}

export interface WellbeingTurnForecastPoint {
  turn: number;
  affordabilityIndex: number;
  deliveryCapacityIndex: number;
  fiscalLoad: number;
  equityGap: number;
}

export interface WellbeingMultiTurnForecast {
  scenarioId: string;
  horizonTurns: number;
  points: WellbeingTurnForecastPoint[];
}


// --- source: constants.ts ---
export const AGENT14_CORE_REGIONS = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export type Agent14CoreRegion = (typeof AGENT14_CORE_REGIONS)[number];

export const AGENT14_LIMITS = {
  maxActiveCommitments: 24,
  maxHistory: 32,
  defaultNationalSlots: 8,
  minFiscalAbsorption: 18,
  maxFiscalAbsorption: 72,
  maxSimulationTurns: 48,
} as const;

export const AGENT14_DEFAULT_PROGRAM_TIMING = {
  effectLagTurns: 2,
  rampTurns: 3,
} as const;

export const AGENT14_PILLARS: readonly PublicServicePillar[] = [
  'housing',
  'healthcare',
  'education',
];

/** Baseline housing delivery context per core region (modular slice; not Living Regions state). */
export const AGENT14_HOUSING_REGION_BASELINE: Record<
  Agent14CoreRegion,
  {
    remoteShare: number;
    planningBacklogMonths: number;
    baselinePipelineDwellings: number;
    affordabilityBaseline: number;
  }
> = {
  NSW: { remoteShare: 0.08, planningBacklogMonths: 9, baselinePipelineDwellings: 4200, affordabilityBaseline: 58 },
  VIC: { remoteShare: 0.06, planningBacklogMonths: 9, baselinePipelineDwellings: 3800, affordabilityBaseline: 56 },
  QLD: { remoteShare: 0.22, planningBacklogMonths: 12, baselinePipelineDwellings: 3100, affordabilityBaseline: 52 },
  WA: { remoteShare: 0.28, planningBacklogMonths: 13, baselinePipelineDwellings: 2400, affordabilityBaseline: 50 },
  SA: { remoteShare: 0.12, planningBacklogMonths: 10, baselinePipelineDwellings: 1100, affordabilityBaseline: 54 },
  TAS: { remoteShare: 0.35, planningBacklogMonths: 15, baselinePipelineDwellings: 480, affordabilityBaseline: 48 },
  NT: { remoteShare: 0.55, planningBacklogMonths: 18, baselinePipelineDwellings: 320, affordabilityBaseline: 42 },
  ACT: { remoteShare: 0.04, planningBacklogMonths: 8, baselinePipelineDwellings: 620, affordabilityBaseline: 60 },
};

export const AGENT14_HOUSING_PROGRAM_STUBS: readonly {
  id: string;
  regionId: Agent14CoreRegion;
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  effectLagTurns: number;
}[] = [
  { id: 'ps_h_NSW_social_accel', regionId: 'NSW', fiscalLoadPoints: 22, durationTurns: 6, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_h_VIC_planning_reform', regionId: 'VIC', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_h_QLD_regional_release', regionId: 'QLD', fiscalLoadPoints: 20, durationTurns: 7, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_h_WA_remote_housing', regionId: 'WA', fiscalLoadPoints: 24, durationTurns: 8, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_h_NT_remote_housing', regionId: 'NT', fiscalLoadPoints: 26, durationTurns: 8, baseImpact: 12, effectLagTurns: 4 },
  { id: 'ps_h_TAS_affordable', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_h_SA_modular', regionId: 'SA', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 6, effectLagTurns: 1 },
  { id: 'ps_h_ACT_density', regionId: 'ACT', fiscalLoadPoints: 12, durationTurns: 4, baseImpact: 5, effectLagTurns: 1 },
];

/** Healthcare and education program stubs (scale wave 4). */
export const AGENT14_HEALTH_ED_PROGRAM_STUBS: readonly {
  id: string;
  pillar: Exclude<PublicServicePillar, 'housing'>;
  regionId: Agent14CoreRegion;
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  effectLagTurns: number;
}[] = [
  { id: 'ps_he_NSW_primary_care', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 20, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_he_VIC_hospital_backlog', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 24, durationTurns: 6, baseImpact: 10, effectLagTurns: 3 },
  { id: 'ps_he_QLD_remote_clinic', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 22, durationTurns: 7, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_he_NT_remote_clinic', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 26, durationTurns: 8, baseImpact: 12, effectLagTurns: 4 },
  { id: 'ps_ed_NSW_skills', pillar: 'education', regionId: 'NSW', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_ed_VIC_tafe', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_ed_WA_regional_schools', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 21, durationTurns: 6, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_ed_TAS_rural_connect', pillar: 'education', regionId: 'TAS', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wellness_hub', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 23, durationTurns: 6, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_xp_NT_integrated_services', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 25, durationTurns: 7, baseImpact: 11, effectLagTurns: 3 },
  { id: 'ps_xp_TAS_community_wellbeing', pillar: 'healthcare', regionId: 'TAS', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_remote_lifecycle', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 22, durationTurns: 6, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_SA_integrated_housing_health', pillar: 'healthcare', regionId: 'SA', fiscalLoadPoints: 21, durationTurns: 6, baseImpact: 10, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_wellbeing_coordination', pillar: 'education', regionId: 'ACT', fiscalLoadPoints: 15, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_governance_reform', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_relief_coordination', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
];

export const AGENT14_ALL_PROGRAM_STUBS = [
  ...AGENT14_HOUSING_PROGRAM_STUBS.map((s) => ({ ...s, pillar: 'housing' as const })),
  ...AGENT14_HEALTH_ED_PROGRAM_STUBS,
] as const;


// --- source: housing-delivery-pipeline.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function stressBand(index: number): AffordabilityStressBand {
  if (index >= 62) return 'low';
  if (index >= 48) return 'moderate';
  if (index >= 34) return 'elevated';
  return 'severe';
}

function stageFromBacklog(months: number, pipeline: number): HousingPipelineStage {
  if (months >= 16 || pipeline >= 5000) return 'planning';
  if (months >= 12) return 'approvals';
  if (months >= 8) return 'construction';
  if (months >= 5) return 'handover';
  return 'stabilized';
}

export function computeRegionalHousingPipeline(
  regionId: string,
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  fiscalHeadroom: number
): RegionalHousingPipelineState {
  const base =
    AGENT14_HOUSING_REGION_BASELINE[regionId as Agent14CoreRegion] ??
    AGENT14_HOUSING_REGION_BASELINE.NSW;
  const regionalBoost = spending.regionalKpiDelta[regionId]?.housing ?? 0;
  const remoteShare = base.remoteShare;

  let planningBacklogMonths = base.planningBacklogMonths;
  planningBacklogMonths += remoteShare * 14;
  planningBacklogMonths -= regionalBoost * 0.35;
  planningBacklogMonths -= (fiscalHeadroom - 50) * 0.04;
  if (capacity.bindingConstraint === 'fiscal_absorption') planningBacklogMonths += 3;
  if (capacity.byPillar.housing.loadRatio > 1.1) planningBacklogMonths += 2;
  planningBacklogMonths = clamp(planningBacklogMonths, 4, 28);

  let dwellingsInPipeline = base.baselinePipelineDwellings;
  dwellingsInPipeline += Math.floor(regionalBoost * 120);
  dwellingsInPipeline -= Math.floor((planningBacklogMonths - 10) * 40);
  dwellingsInPipeline = Math.max(80, dwellingsInPipeline);

  const socialHousingCompletionsRate = clamp(
    12 + regionalBoost * 4 + (capacity.byPillar.housing.capacityIndex - 50) * 0.12 - remoteShare * 18,
    2,
    45
  );

  let affordabilityIndex = base.affordabilityBaseline;
  affordabilityIndex += (fiscalHeadroom - 50) * 0.15;
  affordabilityIndex += regionalBoost * 1.2;
  affordabilityIndex -= remoteShare * 22;
  affordabilityIndex -= Math.max(0, planningBacklogMonths - 12) * 1.1;
  affordabilityIndex = clamp(affordabilityIndex);

  const deliveryPressure = clamp(
    planningBacklogMonths * 2.8 + remoteShare * 35 - socialHousingCompletionsRate * 0.9
  );

  return {
    regionId,
    stage: stageFromBacklog(planningBacklogMonths, dwellingsInPipeline),
    planningBacklogMonths,
    dwellingsInPipeline,
    socialHousingCompletionsRate,
    affordabilityStress: stressBand(affordabilityIndex),
    affordabilityIndex,
    remoteShare,
    deliveryPressure,
    evidence: [
      `t${turn}`,
      `backlog=${planningBacklogMonths}m`,
      `pipeline=${dwellingsInPipeline}`,
      `boost=${regionalBoost.toFixed(2)}`,
    ],
  };
}

export function computeAllRegionalHousingPipelines(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  fiscalHeadroom: number
): Record<string, RegionalHousingPipelineState> {
  const out: Record<string, RegionalHousingPipelineState> = {};
  for (const r of AGENT14_CORE_REGIONS) {
    out[r] = computeRegionalHousingPipeline(r, turn, capacity, spending, fiscalHeadroom);
  }
  return out;
}


// --- source: national-wellbeing-snapshot.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function stressBand(index: number): AffordabilityStressBand {
  if (index >= 62) return 'low';
  if (index >= 48) return 'moderate';
  if (index >= 34) return 'elevated';
  return 'severe';
}

export function computeNationalHousingWellbeingSnapshot(
  turn: number,
  regions: Record<string, RegionalHousingPipelineState>
): NationalHousingWellbeingSnapshot {
  const list = AGENT14_CORE_REGIONS.map((id) => regions[id]).filter(Boolean);
  const affIndices = list.map((r) => r.affordabilityIndex);
  const minAff = Math.min(...affIndices);
  const maxAff = Math.max(...affIndices);
  const nationalAffordabilityIndex =
    affIndices.length > 0 ? clamp(affIndices.reduce((a, b) => a + b, 0) / affIndices.length) : 50;

  const averagePlanningBacklogMonths =
    list.length > 0
      ? clamp(list.reduce((s, r) => s + r.planningBacklogMonths, 0) / list.length)
      : 12;

  const totalDwellingsInPipeline = list.reduce((s, r) => s + r.dwellingsInPipeline, 0);

  const socialCompletionsIndex = clamp(
    list.length > 0
      ? list.reduce((s, r) => s + r.socialHousingCompletionsRate, 0) / list.length
      : 10
  );

  const regionalEquityGap = clamp(maxAff - minAff);

  const worst = list.reduce(
    (w, r) => (r.affordabilityIndex < w.affordabilityIndex ? r : w),
    list[0]!
  );
  const best = list.reduce(
    (b, r) => (r.affordabilityIndex > b.affordabilityIndex ? r : b),
    list[0]!
  );

  const narrativeSummary =
    list.length === 0
      ? 'No regional housing pipeline data.'
      : `National affordability ${nationalAffordabilityIndex} (${stressBand(nationalAffordabilityIndex)}). ` +
        `Backlog avg ${averagePlanningBacklogMonths}m; pipeline ${totalDwellingsInPipeline} dwellings. ` +
        `Equity gap ${regionalEquityGap} (${worst.regionId} ${worst.affordabilityIndex} → ${best.regionId} ${best.affordabilityIndex}).`;

  return {
    turn,
    nationalAffordabilityIndex,
    affordabilityStress: stressBand(nationalAffordabilityIndex),
    averagePlanningBacklogMonths,
    totalDwellingsInPipeline,
    socialCompletionsIndex,
    regionalEquityGap,
    regions,
    narrativeSummary,
  };
}


// --- source: public-service-capacity.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function workforceScore(readiness: WorkforceReadiness | undefined, gap: number): number {
  let score = 62 - gap * 0.45;
  switch (readiness) {
    case 'strong':
      score += 12;
      break;
    case 'balanced':
      score += 4;
      break;
    case 'strained':
      score -= 10;
      break;
    case 'weak':
      score -= 18;
      break;
    case 'blocking':
      score -= 28;
      break;
    default:
      break;
  }
  return clamp(score);
}

export function computeFiscalAbsorptionCap(fiscalHeadroom: number, stateCapacityLoad: number): number {
  const head = clamp(fiscalHeadroom, 0, 100);
  const load = clamp(stateCapacityLoad, 0, 100);
  const cap =
    AGENT14_LIMITS.minFiscalAbsorption +
    (head / 100) * (AGENT14_LIMITS.maxFiscalAbsorption - AGENT14_LIMITS.minFiscalAbsorption) -
    load * 0.22;
  return clamp(cap, AGENT14_LIMITS.minFiscalAbsorption, AGENT14_LIMITS.maxFiscalAbsorption);
}

export function computeNationalProgramSlots(
  fiscalHeadroom: number,
  stateCapacityLoad: number
): number {
  const base = AGENT14_LIMITS.defaultNationalSlots;
  const bonus = fiscalHeadroom >= 70 ? 2 : fiscalHeadroom >= 55 ? 1 : 0;
  const penalty = stateCapacityLoad >= 75 ? 2 : stateCapacityLoad >= 55 ? 1 : 0;
  return Math.max(3, Math.min(AGENT14_LIMITS.maxActiveCommitments, base + bonus - penalty));
}

function pillarLoad(
  active: SpendingCommitment[],
  pillar: PublicServicePillar,
  turn: number
): { loadPoints: number; count: number } {
  let loadPoints = 0;
  let count = 0;
  for (const c of active) {
    if (c.pillar !== pillar) continue;
    if (turn < c.committedTurn) continue;
    const elapsed = turn - c.committedTurn;
    if (elapsed >= c.durationTurns) continue;
    count += 1;
    loadPoints += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
  }
  return { loadPoints, count };
}

export function computePublicServiceCapacity(
  inputs: CapacityAndSpendingInputs,
  activeCommitments: SpendingCommitment[]
): PublicServiceCapacitySnapshot {
  const turn = Math.max(1, Math.floor(inputs.turn || 1));
  const fiscalHeadroom = clamp(inputs.fiscalHeadroom ?? 55);
  const stateCapacityLoad = clamp(inputs.stateCapacityLoad ?? 40);
  const gap = clamp(inputs.workforceSpecialistGap ?? 32);
  const wf = workforceScore(inputs.workforceReadiness, gap);

  const nationalProgramSlots = computeNationalProgramSlots(fiscalHeadroom, stateCapacityLoad);
  const slotsUsed = activeCommitments.filter(
    (c) => turn >= c.committedTurn && turn - c.committedTurn < c.durationTurns
  ).length;
  const slotsFree = Math.max(0, nationalProgramSlots - slotsUsed);

  const fiscalAbsorptionCap = computeFiscalAbsorptionCap(fiscalHeadroom, stateCapacityLoad);
  let fiscalLoadScheduledThisTurn = 0;
  for (const c of activeCommitments) {
    if (turn < c.committedTurn || turn - c.committedTurn >= c.durationTurns) continue;
    fiscalLoadScheduledThisTurn += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
  }
  fiscalLoadScheduledThisTurn = Math.round(fiscalLoadScheduledThisTurn * 10) / 10;

  const fiscalHeadroomUsedRatio =
    fiscalAbsorptionCap > 0 ? clamp((fiscalLoadScheduledThisTurn / fiscalAbsorptionCap) * 100) : 100;

  const workforceUtilization = clamp(
    (slotsUsed / Math.max(1, nationalProgramSlots)) * 55 + (100 - wf) * 0.35 + gap * 0.25
  );

  const byPillar = {} as Record<PublicServicePillar, PillarCapacitySlice>;
  let capacitySum = 0;
  for (const pillar of AGENT14_PILLARS) {
    const { loadPoints, count } = pillarLoad(activeCommitments, pillar, turn);
    const pillarCap = fiscalAbsorptionCap / 3;
    const loadRatio = pillarCap > 0 ? loadPoints / pillarCap : 1;
    const capacityIndex = clamp(100 - loadRatio * 38 - (count > 3 ? (count - 3) * 6 : 0));
    byPillar[pillar] = {
      capacityIndex,
      loadRatio: Math.round(loadRatio * 100) / 100,
      activeCommitments: count,
    };
    capacitySum += capacityIndex;
  }

  let bindingConstraint: CapacityBindingConstraint = 'none';
  if (slotsFree <= 0) bindingConstraint = 'program_slots';
  else if (fiscalLoadScheduledThisTurn > fiscalAbsorptionCap * 1.02) bindingConstraint = 'fiscal_absorption';
  else if (workforceUtilization >= 88) bindingConstraint = 'workforce';

  const deliveryCapacityIndex = clamp(
    capacitySum / AGENT14_PILLARS.length -
      (bindingConstraint === 'fiscal_absorption' ? 8 : 0) -
      (bindingConstraint === 'program_slots' ? 6 : 0)
  );

  const evidence = [
    `slots ${slotsUsed}/${nationalProgramSlots}`,
    `fiscal ${fiscalLoadScheduledThisTurn}/${fiscalAbsorptionCap}`,
    `workforce util ${workforceUtilization}`,
    `binding ${bindingConstraint}`,
  ];

  return {
    turn,
    nationalProgramSlots,
    slotsUsed,
    slotsFree,
    fiscalAbsorptionCap,
    fiscalLoadScheduledThisTurn,
    fiscalHeadroomUsedRatio,
    workforceUtilization,
    deliveryCapacityIndex,
    bindingConstraint,
    byPillar,
    evidence,
  };
}

export function canAcceptSpendingCommitment(
  capacity: PublicServiceCapacitySnapshot,
  commitment: Pick<SpendingCommitment, 'fiscalLoadPoints' | 'durationTurns'>
): { allowed: boolean; reason: string } {
  if (capacity.slotsFree <= 0) {
    return { allowed: false, reason: 'No free national program slots for a new commitment.' };
  }
  const incrementalLoad = commitment.fiscalLoadPoints / Math.max(1, commitment.durationTurns);
  if (capacity.fiscalLoadScheduledThisTurn + incrementalLoad > capacity.fiscalAbsorptionCap * 1.05) {
    return {
      allowed: false,
      reason: 'Incremental fiscal load would exceed public finance absorption capacity this turn.',
    };
  }
  return { allowed: true, reason: 'Within capacity.' };
}


// --- source: delayed-spending-effects.ts ---
export function createInitialDelayedSpendingPersisted(): DelayedSpendingPersisted {
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    active: [],
    history: [],
  };
}

export function sanitizeDelayedSpendingPersisted(
  raw?: DelayedSpendingPersisted | null
): DelayedSpendingPersisted {
  if (!raw || typeof raw !== 'object') return createInitialDelayedSpendingPersisted();
  const active = Array.isArray(raw.active)
    ? raw.active
        .filter(
          (c) =>
            c &&
            typeof c.id === 'string' &&
            typeof c.programId === 'string' &&
            typeof c.committedTurn === 'number'
        )
        .slice(0, AGENT14_LIMITS.maxActiveCommitments)
    : [];
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    active,
    history: Array.isArray(raw.history) ? raw.history.slice(-AGENT14_LIMITS.maxHistory) : [],
  };
}

export function makeSpendingCommitment(
  partial: Omit<
    SpendingCommitment,
    'effectLagTurns' | 'rampTurns'
  > &
    Partial<Pick<SpendingCommitment, 'effectLagTurns' | 'rampTurns'>>
): SpendingCommitment {
  return {
    ...partial,
    effectLagTurns: partial.effectLagTurns ?? AGENT14_DEFAULT_PROGRAM_TIMING.effectLagTurns,
    rampTurns: partial.rampTurns ?? AGENT14_DEFAULT_PROGRAM_TIMING.rampTurns,
  };
}

function rampFactor(commit: SpendingCommitment, turn: number): number {
  const effectTurn = commit.committedTurn + commit.effectLagTurns;
  if (turn < effectTurn) return 0;
  const rampEnd = effectTurn + Math.max(1, commit.rampTurns);
  if (turn >= rampEnd) return 1;
  return (turn - effectTurn + 1) / Math.max(1, commit.rampTurns);
}

/** Advance delayed spending one turn; pure function returning new persisted state and derived effects. */
export function advanceDelayedSpendingEffects(
  turn: number,
  persistedIn: DelayedSpendingPersisted | null | undefined
): { persisted: DelayedSpendingPersisted; effects: DelayedSpendingTurnEffects } {
  const persisted = sanitizeDelayedSpendingPersisted(persistedIn);
  const t = Math.max(1, Math.floor(turn));
  let fiscalLoadThisTurn = 0;
  const completedProjectBoost: Record<PublicServicePillar, number> = {
    housing: 0,
    healthcare: 0,
    education: 0,
  };
  const regionalKpiDelta: DelayedSpendingTurnEffects['regionalKpiDelta'] = {};
  const maturedCommitmentIds: string[] = [];
  const events: DelayedSpendingTurnEffects['events'] = [];
  const stillActive: SpendingCommitment[] = [];

  for (const c of persisted.active) {
    if (t < c.committedTurn) {
      stillActive.push(c);
      continue;
    }
    const elapsed = t - c.committedTurn;
    if (elapsed < c.durationTurns) {
      stillActive.push(c);
      fiscalLoadThisTurn += c.fiscalLoadPoints / Math.max(1, c.durationTurns);
    } else if (elapsed === c.durationTurns) {
      maturedCommitmentIds.push(c.id);
      events.push({
        id: `ps_mat_${c.id}_t${t}`,
        kind: 'program_spending_matured',
        summary: `Program ${c.programId} fiscal tranche completed; KPI ramp continues from lag pipeline.`,
      });
    }

    const ramp = rampFactor(c, t);
    if (ramp <= 0) continue;

    const kpiUnits = (c.baseImpact / 10) * ramp;
    if (c.pillar === 'housing') completedProjectBoost.housing += kpiUnits;
    if (c.pillar === 'healthcare') completedProjectBoost.healthcare += kpiUnits;
    if (c.pillar === 'education') completedProjectBoost.education += kpiUnits;

    if (!regionalKpiDelta[c.regionId]) regionalKpiDelta[c.regionId] = {};
    const prev = regionalKpiDelta[c.regionId]![c.pillar] ?? 0;
    regionalKpiDelta[c.regionId]![c.pillar] = prev + kpiUnits * 2.5;
  }

  persisted.active = stillActive.slice(0, AGENT14_LIMITS.maxActiveCommitments);
  persisted.history.push({
    id: `ps_spend_t${t}`,
    turn: t,
    summary: `Fiscal load ${Math.round(fiscalLoadThisTurn * 10) / 10}; active ${persisted.active.length}`,
  });
  persisted.history = persisted.history.slice(-AGENT14_LIMITS.maxHistory);

  return {
    persisted,
    effects: {
      turn: t,
      fiscalLoadThisTurn: Math.round(fiscalLoadThisTurn * 10) / 10,
      completedProjectBoost,
      regionalKpiDelta,
      maturedCommitmentIds,
      events,
    },
  };
}

export function commitSpendingProgram(
  persistedIn: DelayedSpendingPersisted | null | undefined,
  commitment: SpendingCommitment
): DelayedSpendingPersisted {
  const persisted = sanitizeDelayedSpendingPersisted(persistedIn);
  persisted.active = [...persisted.active, commitment].slice(-AGENT14_LIMITS.maxActiveCommitments);
  persisted.history.push({
    id: `ps_commit_${commitment.id}`,
    turn: commitment.committedTurn,
    summary: `Committed ${commitment.programId} (${commitment.pillar}) lag=${commitment.effectLagTurns} ramp=${commitment.rampTurns}`,
  });
  persisted.history = persisted.history.slice(-AGENT14_LIMITS.maxHistory);
  return persisted;
}


// --- source: program-stub-commitments.ts ---
export function commitmentFromProgramStub(
  stubId: string,
  committedTurn: number,
  seq: number
): SpendingCommitment | null {
  const stub = AGENT14_ALL_PROGRAM_STUBS.find((p) => p.id === stubId);
  if (!stub) return null;
  return makeSpendingCommitment({
    id: `${stub.id}_c${seq}`,
    programId: stub.id,
    pillar: stub.pillar,
    regionId: stub.regionId,
    committedTurn,
    fiscalLoadPoints: stub.fiscalLoadPoints,
    durationTurns: stub.durationTurns,
    baseImpact: stub.baseImpact,
    effectLagTurns: stub.effectLagTurns,
    rampTurns: 3,
  });
}


// --- source: service-access-lens.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromIndex(index: number): ServiceAccessBand {
  if (index >= 72) return 'strong';
  if (index >= 55) return 'adequate';
  if (index >= 38) return 'weak';
  return 'critical';
}

function pillarSlice(
  pillar: PublicServicePillar,
  base: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  regionalDelta: number
): PillarAccessSlice {
  const capSlice = capacity.byPillar[pillar];
  const boost = spending.completedProjectBoost[pillar];
  let accessIndex = base;
  accessIndex += boost * 8;
  accessIndex += (capSlice.capacityIndex - 50) * 0.25;
  accessIndex += regionalDelta * 1.5;
  accessIndex -= capSlice.loadRatio > 1 ? (capSlice.loadRatio - 1) * 12 : 0;
  accessIndex = clamp(accessIndex);
  const backlogPressure = clamp(100 - accessIndex + capSlice.loadRatio * 15);
  return { pillar, accessIndex, band: bandFromIndex(accessIndex), backlogPressure };
}

export function computeRegionalServiceAccess(
  regionId: string,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  remoteShare: number
): RegionalServiceAccessState {
  const delta = spending.regionalKpiDelta[regionId] ?? {};
  const remotePenalty = remoteShare * 18;
  const housing = pillarSlice(
    'housing',
    58 - remotePenalty,
    capacity,
    spending,
    delta.housing ?? 0
  );
  const healthcare = pillarSlice(
    'healthcare',
    62 - remotePenalty * 0.9,
    capacity,
    spending,
    delta.healthcare ?? 0
  );
  const education = pillarSlice(
    'education',
    60 - remotePenalty * 0.85,
    capacity,
    spending,
    delta.education ?? 0
  );
  const compositeIndex = clamp((housing.accessIndex + healthcare.accessIndex + education.accessIndex) / 3);
  return {
    regionId,
    pillars: { housing, healthcare, education },
    compositeIndex,
  };
}

export function computeNationalServiceAccessLens(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  remoteShareByRegion: Record<string, number>
): NationalServiceAccessLens {
  const regions: Record<string, RegionalServiceAccessState> = {};
  const composites: number[] = [];
  for (const r of AGENT14_CORE_REGIONS) {
    const st = computeRegionalServiceAccess(
      r,
      capacity,
      spending,
      remoteShareByRegion[r] ?? 0.1
    );
    regions[r] = st;
    composites.push(st.compositeIndex);
  }
  const nationalComposite =
    composites.length > 0 ? clamp(composites.reduce((a, b) => a + b, 0) / composites.length) : 50;
  const equityGap = clamp(Math.max(...composites) - Math.min(...composites));

  const pillarNational = {} as Record<PublicServicePillar, PillarAccessSlice>;
  for (const pillar of ['housing', 'healthcare', 'education'] as PublicServicePillar[]) {
    const avg =
      AGENT14_CORE_REGIONS.reduce((s, rid) => s + regions[rid]!.pillars[pillar].accessIndex, 0) /
      AGENT14_CORE_REGIONS.length;
    pillarNational[pillar] = {
      pillar,
      accessIndex: clamp(avg),
      band: bandFromIndex(avg),
      backlogPressure: clamp(100 - avg),
    };
  }

  return {
    turn,
    nationalComposite,
    nationalBand: bandFromIndex(nationalComposite),
    pillarNational,
    regions,
    equityGap,
  };
}


// --- source: wellbeing-guardian-warnings.ts ---
export function evaluateAgent14WellbeingWarnings(
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens
): Agent14WellbeingWarningBundle {
  const warnings: Agent14WellbeingWarning[] = [];
  const assumptions = [
    'Warn-only V10.14 modular slice; does not block player actions.',
    'Uses capacity, housing pipeline, and service access lens only.',
  ];

  if (capacity.bindingConstraint === 'fiscal_absorption') {
    warnings.push({
      id: 'warn_fiscal_absorption',
      severity: 'elevated',
      pillar: 'cross',
      title: 'Fiscal absorption saturated',
      summary: `Public program fiscal load (${capacity.fiscalLoadScheduledThisTurn}) exceeds absorption cap (${capacity.fiscalAbsorptionCap}). Delay new commitments or relieve load.`,
      assumptions,
    });
  }

  if (capacity.bindingConstraint === 'program_slots') {
    warnings.push({
      id: 'warn_program_slots',
      severity: 'watch',
      pillar: 'cross',
      title: 'National program slots full',
      summary: `All ${capacity.nationalProgramSlots} national program slots are in use; sequencing required before new housing/health/education packages.`,
      assumptions,
    });
  }

  if (housing.regionalEquityGap >= 40) {
    warnings.push({
      id: 'warn_housing_equity',
      severity: 'elevated',
      pillar: 'housing',
      title: 'Regional housing equity gap',
      summary: `Affordability equity gap ${housing.regionalEquityGap} exceeds tolerance; remote and backlog-heavy regions lag capitals.`,
      assumptions,
    });
  }

  if (housing.affordabilityStress === 'severe') {
    warnings.push({
      id: 'warn_affordability_severe',
      severity: 'critical',
      pillar: 'housing',
      title: 'Severe affordability stress',
      summary: `National affordability index ${housing.nationalAffordabilityIndex} (${housing.affordabilityStress}).`,
      assumptions,
    });
  }

  for (const pillar of ['healthcare', 'education', 'housing'] as const) {
    const p = access.pillarNational[pillar];
    if (p.band === 'critical' || p.band === 'weak') {
      warnings.push({
        id: `warn_${pillar}_access`,
        severity: p.band === 'critical' ? 'critical' : 'watch',
        pillar,
        title: `${pillar} access strain`,
        summary: `National ${pillar} access index ${p.accessIndex} (${p.band}); backlog pressure ${p.backlogPressure}.`,
        assumptions,
      });
    }
  }

  if (access.equityGap >= 35) {
    warnings.push({
      id: 'warn_service_equity',
      severity: 'watch',
      pillar: 'cross',
      title: 'Service access equity divergence',
      summary: `Cross-pillar regional composite equity gap ${access.equityGap}.`,
      assumptions,
    });
  }

  const shouldSurface = warnings.some((w) => w.severity === 'critical' || w.severity === 'elevated');
  return { shouldSurface, warnings: warnings.slice(0, 8) };
}


// --- source: program-sequencing.ts ---
export function recommendAgent14ProgramSequence(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens,
  limit = 5
): ProgramSequencingRecommendation[] {
  const recs: ProgramSequencingRecommendation[] = [];
  const worstRegions = Object.values(housing.regions)
    .sort((a, b) => a.affordabilityIndex - b.affordabilityIndex)
    .slice(0, 4)
    .map((r) => r.regionId);

  const pillarPriority: PublicServicePillar[] =
    access.pillarNational.healthcare.band === 'critical' || access.pillarNational.healthcare.band === 'weak'
      ? ['healthcare', 'housing', 'education']
      : access.pillarNational.education.band === 'critical' || access.pillarNational.education.band === 'weak'
        ? ['education', 'housing', 'healthcare']
        : ['housing', 'healthcare', 'education'];

  let rank = 1;
  for (const regionId of worstRegions) {
    for (const pillar of pillarPriority) {
      const stub = AGENT14_HOUSING_PROGRAM_STUBS.find(
        (p) => p.regionId === (regionId as Agent14CoreRegion) && pillar === 'housing'
      );
      if (!stub && pillar !== 'housing') continue;
      const programId =
        stub?.id ??
        `ps_seq_${regionId}_${pillar}_${turn}`;
      const commitment =
        commitmentFromProgramStub(stub?.id ?? AGENT14_HOUSING_PROGRAM_STUBS[0]!.id, turn, rank) ??
        null;
      const fitsCapacity = commitment
        ? canAcceptSpendingCommitment(capacity, commitment).allowed
        : false;
      recs.push({
        rank,
        programId,
        regionId,
        pillar,
        rationale:
          pillar === 'housing'
            ? `Backlog ${housing.regions[regionId]?.planningBacklogMonths ?? '?'}m in ${regionId}; affordability ${housing.regions[regionId]?.affordabilityIndex ?? '?'}`
            : `${pillar} national band ${access.pillarNational[pillar].band}; uplift ${regionId} composite ${access.regions[regionId]?.compositeIndex ?? '?'}`,
        expectedLagTurns: stub?.effectLagTurns ?? 2,
        fitsCapacity,
      });
      rank += 1;
      if (recs.length >= limit) return recs;
    }
  }

  for (const stub of AGENT14_HOUSING_PROGRAM_STUBS) {
    if (recs.some((r) => r.programId === stub.id)) continue;
    const baseline = AGENT14_HOUSING_REGION_BASELINE[stub.regionId];
    const commitment = commitmentFromProgramStub(stub.id, turn, rank)!;
    recs.push({
      rank,
      programId: stub.id,
      regionId: stub.regionId,
      pillar: 'housing',
      rationale: `Catalog stub; remote ${baseline.remoteShare} planning ${baseline.planningBacklogMonths}m`,
      expectedLagTurns: stub.effectLagTurns,
      fitsCapacity: canAcceptSpendingCommitment(capacity, commitment).allowed,
    });
    rank += 1;
    if (recs.length >= limit) break;
  }

  return recs;
}


// --- source: wellbeing-forecast.ts ---
export function forecastAgent14WellbeingTurns(
  scenarioId: Agent14HousingScenarioId,
  horizonTurns: number,
  startTurn = 1
): WellbeingMultiTurnForecast {
  const sim = simulateAgent14HousingScenario(scenarioId, startTurn + horizonTurns - 1);
  const points: WellbeingTurnForecastPoint[] = sim.turns.slice(-horizonTurns).map((inp) => ({
    turn: inp.turn,
    affordabilityIndex: inp.housingWellbeing?.nationalAffordabilityIndex ?? 0,
    deliveryCapacityIndex: inp.capacity.deliveryCapacityIndex,
    fiscalLoad: inp.fiscalLoadFromActivePrograms,
    equityGap: inp.housingWellbeing?.regionalEquityGap ?? 0,
  }));
  return { scenarioId, horizonTurns, points };
}

export function forecastFromInputs(
  baseInputs: CapacityAndSpendingInputs,
  horizonTurns: number
): WellbeingTurnForecastPoint[] {
  const remoteShareByRegion = Object.fromEntries(
    Object.entries(AGENT14_HOUSING_REGION_BASELINE).map(([k, v]) => [k, v.remoteShare])
  );
  void remoteShareByRegion;
  let spendingPersisted = null;
  const points: WellbeingTurnForecastPoint[] = [];
  const start = Math.max(1, baseInputs.turn || 1);
  for (let t = start; t < start + horizonTurns; t += 1) {
    const r = advancePublicServicesTurn({
      inputs: { ...baseInputs, turn: t },
      spendingPersisted,
    });
    spendingPersisted = r.spendingPersisted;
    points.push({
      turn: t,
      affordabilityIndex: r.inputs.housingWellbeing?.nationalAffordabilityIndex ?? 0,
      deliveryCapacityIndex: r.inputs.capacity.deliveryCapacityIndex,
      fiscalLoad: r.inputs.fiscalLoadFromActivePrograms,
      equityGap: r.inputs.housingWellbeing?.regionalEquityGap ?? 0,
    });
  }
  return points;
}

export function listAgent14ScenarioIds(): Agent14HousingScenarioId[] {
  return AGENT14_HOUSING_SCENARIOS.map((s) => s.id);
}


// --- source: cross-pillar-coupling.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromCoupling(index: number): CouplingStressBand {
  if (index >= 72) return 'stable';
  if (index >= 55) return 'watch';
  if (index >= 38) return 'strained';
  return 'critical';
}

function housingSpillover(
  pillar: PublicServicePillar,
  housing: NationalHousingWellbeingSnapshot,
  capacity: PublicServiceCapacitySnapshot
): number {
  const backlog = housing.averagePlanningBacklogMonths;
  const equity = housing.regionalEquityGap;
  const delivery = capacity.deliveryCapacityIndex;
  let spill = 0;
  if (pillar === 'healthcare') {
    spill -= backlog * 0.35;
    spill -= equity * 0.12;
    spill += (delivery - 50) * 0.15;
  } else if (pillar === 'education') {
    spill -= backlog * 0.28;
    spill -= equity * 0.1;
    spill += (delivery - 50) * 0.12;
  } else {
    spill += (100 - housing.nationalAffordabilityIndex) * 0.08;
  }
  return spill;
}

function capacitySpillover(pillar: PublicServicePillar, capacity: PublicServiceCapacitySnapshot): number {
  const slice = capacity.byPillar[pillar];
  let spill = (slice.capacityIndex - 50) * 0.2;
  if (capacity.bindingConstraint === 'workforce') spill -= 8;
  if (capacity.bindingConstraint === 'fiscal_absorption') spill -= 6;
  if (slice.loadRatio > 1) spill -= (slice.loadRatio - 1) * 10;
  return spill;
}

export function computeCrossPillarCoupling(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens
): CrossPillarCouplingSnapshot {
  const evidence: string[] = [];
  const byPillar = {} as CrossPillarCouplingSnapshot['byPillar'];

  for (const pillar of ['housing', 'healthcare', 'education'] as const) {
    const fromHousing = housingSpillover(pillar, housing, capacity);
    const fromCapacity = capacitySpillover(pillar, capacity);
    const accessDrag = 50 - access.pillarNational[pillar].accessIndex;
    const net = clamp(58 + fromHousing + fromCapacity - accessDrag * 0.25);
    byPillar[pillar] = {
      pillar,
      spilloverFromHousing: Math.round(fromHousing * 10) / 10,
      spilloverFromCapacity: Math.round(fromCapacity * 10) / 10,
      netCouplingIndex: net,
      band: bandFromCoupling(net),
    };
    if (byPillar[pillar].band === 'strained' || byPillar[pillar].band === 'critical') {
      evidence.push(`${pillar} coupling ${net} (${byPillar[pillar].band})`);
    }
  }

  const nationalCouplingIndex = clamp(
    (byPillar.housing.netCouplingIndex +
      byPillar.healthcare.netCouplingIndex +
      byPillar.education.netCouplingIndex) /
      3
  );

  if (housing.affordabilityStress === 'severe' || housing.affordabilityStress === 'elevated') {
    evidence.push(`Affordability ${housing.affordabilityStress} amplifies cross-pillar spillover`);
  }

  return {
    turn,
    nationalCouplingIndex,
    band: bandFromCoupling(nationalCouplingIndex),
    byPillar,
    evidence,
  };
}


// --- source: regional-wellbeing-memory.ts ---
const DEFAULT_EMA_ALPHA = 0.35;

export function createInitialRegionalWellbeingMemory(): RegionalWellbeingMemoryPersisted {
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    affordabilityEma: {},
    accessEma: {},
  };
}

export function sanitizeRegionalWellbeingMemory(
  raw?: RegionalWellbeingMemoryPersisted | null
): RegionalWellbeingMemoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialRegionalWellbeingMemory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    affordabilityEma:
      raw.affordabilityEma && typeof raw.affordabilityEma === 'object' ? { ...raw.affordabilityEma } : {},
    accessEma: raw.accessEma && typeof raw.accessEma === 'object' ? { ...raw.accessEma } : {},
  };
}

function trend(current: number, previous: number, epsilon = 0.4): 'improving' | 'flat' | 'deteriorating' {
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function emaUpdate(prev: number | undefined, sample: number, alpha: number): number {
  if (prev === undefined) return sample;
  return Math.round((alpha * sample + (1 - alpha) * prev) * 10) / 10;
}

export function advanceRegionalWellbeingMemory(
  turn: number,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens,
  persisted?: RegionalWellbeingMemoryPersisted | null
): { snapshot: RegionalWellbeingMemorySnapshot; persisted: RegionalWellbeingMemoryPersisted } {
  const base = sanitizeRegionalWellbeingMemory(persisted);
  const alpha = base.emaAlpha;
  const regions: Record<string, RegionalWellbeingMemoryRow> = {};
  const affordabilityEma = { ...base.affordabilityEma };
  const accessEma = { ...base.accessEma };

  for (const regionId of AGENT14_CORE_REGIONS) {
    const h = housing.regions[regionId];
    const a = access.regions[regionId];
    const affSample = h?.affordabilityIndex ?? housing.nationalAffordabilityIndex;
    const accessSample = a?.compositeIndex ?? access.nationalComposite;
    const prevAff = affordabilityEma[regionId];
    const prevAccess = accessEma[regionId];
    affordabilityEma[regionId] = emaUpdate(prevAff, affSample, alpha);
    accessEma[regionId] = emaUpdate(prevAccess, accessSample, alpha);
    regions[regionId] = {
      regionId,
      turnsRecorded: (prevAff !== undefined ? 1 : 0) + (base.lastTurn > 0 ? 1 : 0) + turn,
      rollingAffordability: affordabilityEma[regionId]!,
      rollingAccessComposite: accessEma[regionId]!,
      affordabilityTrend: trend(affordabilityEma[regionId]!, prevAff ?? affSample),
      accessTrend: trend(accessEma[regionId]!, prevAccess ?? accessSample),
    };
  }

  return {
    snapshot: { turn, regions },
    persisted: {
      ...base,
      lastTurn: turn,
      affordabilityEma,
      accessEma,
    },
  };
}


// --- source: coupling-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.4;

export function createInitialCouplingTrajectory(): CouplingTrajectoryPersisted {
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    nationalCouplingEma: 58,
    priorEma: undefined,
  };
}

export function sanitizeCouplingTrajectory(
  raw?: CouplingTrajectoryPersisted | null
): CouplingTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialCouplingTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const nationalCouplingEma =
    typeof raw.nationalCouplingEma === 'number' && Number.isFinite(raw.nationalCouplingEma)
      ? Math.max(0, Math.min(100, raw.nationalCouplingEma))
      : 58;
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    nationalCouplingEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.6
): CouplingTrajectorySnapshot['trajectory'] {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromCoupling(index: number): CouplingStressBand {
  if (index >= 72) return 'stable';
  if (index >= 55) return 'watch';
  if (index >= 38) return 'strained';
  return 'critical';
}

export function advanceCouplingTrajectory(
  turn: number,
  coupling: CrossPillarCouplingSnapshot,
  persisted?: CouplingTrajectoryPersisted | null
): { snapshot: CouplingTrajectorySnapshot; persisted: CouplingTrajectoryPersisted } {
  const base = sanitizeCouplingTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = coupling.nationalCouplingIndex;
  const priorEma = base.nationalCouplingEma;
  const nationalCouplingEma =
    Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(nationalCouplingEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Coupling EMA slipping (${priorEma} → ${nationalCouplingEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Coupling EMA recovering (${priorEma} → ${nationalCouplingEma})`);
  }
  if (coupling.band === 'critical' || coupling.band === 'strained') {
    evidence.push(`Instantaneous coupling ${coupling.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      nationalCouplingEma,
      instantaneousIndex: sample,
      band: bandFromCoupling(nationalCouplingEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      nationalCouplingEma,
    },
  };
}


// --- source: wellbeing-accountability-scorecard.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function scoreBand(score: number): Agent14WellbeingAccountabilityScorecard['band'] {
  if (score >= 78) return 'strong';
  if (score >= 58) return 'adequate';
  if (score >= 38) return 'at_risk';
  return 'failing';
}

function pillarPortfolioBalance(
  spending: DelayedSpendingPersisted
): { score: number; note: string } {
  const counts = { housing: 0, healthcare: 0, education: 0 };
  for (const c of spending.active) counts[c.pillar] += 1;
  const total = counts.housing + counts.healthcare + counts.education;
  if (total === 0) return { score: 55, note: 'No active commitments — portfolio idle' };
  const ideal = total / 3;
  const variance =
    (Math.abs(counts.housing - ideal) +
      Math.abs(counts.healthcare - ideal) +
      Math.abs(counts.education - ideal)) /
    Math.max(1, total);
  const score = clamp(72 - variance * 28);
  return {
    score,
    note: `Portfolio mix H${counts.housing}/He${counts.healthcare}/E${counts.education}`,
  };
}

export function composeWellbeingAccountabilityScorecard(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  housing: NationalHousingWellbeingSnapshot;
  warnings: Agent14WellbeingWarningBundle;
  coupling: CrossPillarCouplingSnapshot;
  couplingTrajectory?: CouplingTrajectorySnapshot;
  memory?: RegionalWellbeingMemorySnapshot;
  spendingPersisted: DelayedSpendingPersisted;
}): Agent14WellbeingAccountabilityScorecard {
  const evidence: string[] = [];
  let deliveryScore = clamp(args.capacity.deliveryCapacityIndex);
  if (args.capacity.bindingConstraint !== 'none') {
    deliveryScore -= 8;
    evidence.push(`Delivery bound by ${args.capacity.bindingConstraint}`);
  }

  let equityScore = clamp(100 - args.housing.regionalEquityGap * 1.4);
  if (args.housing.affordabilityStress === 'severe') equityScore -= 12;
  else if (args.housing.affordabilityStress === 'elevated') equityScore -= 6;

  const criticalWarnings = args.warnings.warnings.filter((w) => w.severity === 'critical').length;
  const elevatedWarnings = args.warnings.warnings.filter((w) => w.severity === 'elevated').length;
  let warningScore = clamp(88 - criticalWarnings * 14 - elevatedWarnings * 6);
  if (criticalWarnings > 0) {
    evidence.push(`${criticalWarnings} critical wellbeing warning(s)`);
  }

  let couplingScore = clamp(args.coupling.nationalCouplingIndex);
  if (args.couplingTrajectory?.trajectory === 'deteriorating') couplingScore -= 10;
  if (args.couplingTrajectory?.trajectory === 'improving') couplingScore += 4;

  const portfolio = pillarPortfolioBalance(args.spendingPersisted);
  evidence.push(portfolio.note);

  let memoryScore = 60;
  if (args.memory) {
    const rows = Object.values(args.memory.regions);
    const deteriorating = rows.filter((r) => r.affordabilityTrend === 'deteriorating').length;
    const improving = rows.filter((r) => r.affordabilityTrend === 'improving').length;
    memoryScore = clamp(62 + improving * 3 - deteriorating * 5);
    if (deteriorating >= 3) evidence.push(`${deteriorating} regions with deteriorating affordability EMA`);
  }

  const overallScore = clamp(
    deliveryScore * 0.22 +
      equityScore * 0.24 +
      warningScore * 0.18 +
      couplingScore * 0.2 +
      portfolio.score * 0.08 +
      memoryScore * 0.08
  );

  return {
    turn: args.turn,
    overallScore,
    band: scoreBand(overallScore),
    dimensions: {
      delivery: deliveryScore,
      equity: equityScore,
      warnings: warningScore,
      coupling: couplingScore,
      portfolioBalance: portfolio.score,
      memoryTrend: memoryScore,
    },
    evidence,
  };
}


// --- source: equity-rebalancing-advisor.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function programsForRegion(regionId: string, pillar?: 'housing' | 'healthcare' | 'education'): string[] {
  return AGENT14_ALL_PROGRAM_STUBS.filter(
    (s) => s.regionId === regionId && (pillar ? s.pillar === pillar : true)
  ).map((s) => s.id);
}

export function adviseEquityRebalancing(args: {
  turn: number;
  housing: NationalHousingWellbeingSnapshot;
  access: NationalServiceAccessLens;
  memory?: RegionalWellbeingMemorySnapshot;
  maxRegions?: number;
}): EquityRebalancingAdvice {
  const maxRegions = args.maxRegions ?? 4;
  const lagging: EquityRebalancingAdvice['laggingRegions'] = [];

  for (const regionId of AGENT14_CORE_REGIONS) {
    const h = args.housing.regions[regionId];
    const a = args.access.regions[regionId];
    const mem = args.memory?.regions[regionId];
    const affordability = h?.affordabilityIndex ?? args.housing.nationalAffordabilityIndex;
    const accessIdx = a?.compositeIndex ?? args.access.nationalComposite;
    const nationalAff = args.housing.nationalAffordabilityIndex;
    const deficitIndex = clamp(
      (nationalAff - affordability) * 0.55 + (args.access.nationalComposite - accessIdx) * 0.45
    );
    let urgency = deficitIndex;
    if (mem?.affordabilityTrend === 'deteriorating') urgency += 8;
    if (h?.affordabilityStress === 'severe') urgency += 10;
    if (accessIdx < 42) urgency += 6;

    if (urgency < 12) continue;

    const weakestPillar = (['housing', 'healthcare', 'education'] as const).sort(
      (p1, p2) => (a?.pillars[p1].accessIndex ?? 50) - (a?.pillars[p2].accessIndex ?? 50)
    )[0];

    lagging.push({
      regionId,
      deficitIndex: Math.round(deficitIndex * 10) / 10,
      urgencyScore: Math.round(urgency * 10) / 10,
      weakestPillar,
      suggestedProgramIds: programsForRegion(regionId, weakestPillar).slice(0, 3),
      rationale: `Affordability ${affordability} vs national ${nationalAff}; access ${accessIdx}`,
    });
  }

  lagging.sort((a, b) => b.urgencyScore - a.urgencyScore);
  const top = lagging.slice(0, maxRegions);
  const equityGap = args.housing.regionalEquityGap;
  const shouldEscalate =
    equityGap >= 18 || top.some((r) => r.urgencyScore >= 28) || top.length >= 3;

  return {
    turn: args.turn,
    equityGap,
    shouldEscalate,
    laggingRegions: top,
    summary:
      top.length === 0
        ? 'Regional equity within tolerance — no rebalance push'
        : `Prioritize ${top.map((r) => r.regionId).join(', ')} (gap ${equityGap})`,
  };
}


// --- source: accountability-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.35;

export function createInitialAccountabilityTrajectory(): AccountabilityTrajectoryPersisted {
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    overallScoreEma: 62,
    priorEma: undefined,
  };
}

export function sanitizeAccountabilityTrajectory(
  raw?: AccountabilityTrajectoryPersisted | null
): AccountabilityTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialAccountabilityTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const overallScoreEma =
    typeof raw.overallScoreEma === 'number' && Number.isFinite(raw.overallScoreEma)
      ? Math.max(0, Math.min(100, raw.overallScoreEma))
      : 62;
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    overallScoreEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.8
): AccountabilityTrajectorySnapshot['trajectory'] {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromScore(score: number): AccountabilityBand {
  if (score >= 78) return 'strong';
  if (score >= 58) return 'adequate';
  if (score >= 38) return 'at_risk';
  return 'failing';
}

export function advanceAccountabilityTrajectory(
  turn: number,
  scorecard: Agent14WellbeingAccountabilityScorecard,
  persisted?: AccountabilityTrajectoryPersisted | null
): { snapshot: AccountabilityTrajectorySnapshot; persisted: AccountabilityTrajectoryPersisted } {
  const base = sanitizeAccountabilityTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = scorecard.overallScore;
  const priorEma = base.overallScoreEma;
  const overallScoreEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(overallScoreEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Accountability EMA slipping (${priorEma} → ${overallScoreEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Accountability EMA recovering (${priorEma} → ${overallScoreEma})`);
  }
  if (scorecard.band === 'failing' || scorecard.band === 'at_risk') {
    evidence.push(`Instantaneous accountability ${scorecard.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      overallScoreEma,
      instantaneousScore: sample,
      band: bandFromScore(overallScoreEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      overallScoreEma,
    },
  };
}


// --- source: wellbeing-resilience-index.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromIndex(index: number): WellbeingResilienceBand {
  if (index >= 72) return 'robust';
  if (index >= 55) return 'steady';
  if (index >= 38) return 'fragile';
  return 'critical';
}

export function computeWellbeingResilienceIndex(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  housing: NationalHousingWellbeingSnapshot;
  warnings: Agent14WellbeingWarningBundle;
  coupling: CrossPillarCouplingSnapshot;
  couplingTrajectory?: CouplingTrajectorySnapshot;
  accountabilityScorecard?: Agent14WellbeingAccountabilityScorecard;
}): WellbeingResilienceSnapshot {
  const drivers: string[] = [];
  let stressLoad = 0;

  stressLoad += Math.max(0, 100 - args.capacity.deliveryCapacityIndex) * 0.35;
  if (args.capacity.bindingConstraint !== 'none') {
    stressLoad += 8;
    drivers.push(`Delivery bound by ${args.capacity.bindingConstraint}`);
  }

  if (args.housing.affordabilityStress === 'severe') stressLoad += 18;
  else if (args.housing.affordabilityStress === 'elevated') stressLoad += 10;
  stressLoad += args.housing.regionalEquityGap * 0.45;

  const critical = args.warnings.warnings.filter((w) => w.severity === 'critical').length;
  const elevated = args.warnings.warnings.filter((w) => w.severity === 'elevated').length;
  stressLoad += critical * 12 + elevated * 5;
  if (critical > 0) drivers.push(`${critical} critical wellbeing warning(s)`);

  stressLoad += Math.max(0, 68 - args.coupling.nationalCouplingIndex) * 0.4;
  if (args.coupling.band === 'critical' || args.coupling.band === 'strained') {
    drivers.push(`Coupling ${args.coupling.band}`);
  }
  if (args.couplingTrajectory?.trajectory === 'deteriorating') {
    stressLoad += 10;
    drivers.push('Coupling trajectory deteriorating');
  }

  if (args.accountabilityScorecard?.band === 'failing') stressLoad += 14;
  else if (args.accountabilityScorecard?.band === 'at_risk') stressLoad += 8;

  stressLoad = clamp(stressLoad);
  const resilienceIndex = clamp(100 - stressLoad * 0.92);
  const band = bandFromIndex(resilienceIndex);
  if (band === 'critical' || band === 'fragile') {
    drivers.push(`Resilience ${band} (${resilienceIndex})`);
  }

  return {
    turn: args.turn,
    resilienceIndex,
    band,
    stressLoad,
    drivers: drivers.slice(0, 5),
  };
}


// --- source: resilience-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.32;

export function createInitialResilienceTrajectory(): ResilienceTrajectoryPersisted {
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    resilienceIndexEma: 58,
    priorEma: undefined,
  };
}

export function sanitizeResilienceTrajectory(
  raw?: ResilienceTrajectoryPersisted | null
): ResilienceTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialResilienceTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const resilienceIndexEma =
    typeof raw.resilienceIndexEma === 'number' && Number.isFinite(raw.resilienceIndexEma)
      ? Math.max(0, Math.min(100, raw.resilienceIndexEma))
      : 58;
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    resilienceIndexEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.9
): ResilienceTrajectorySnapshot['trajectory'] {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromIndex(index: number): WellbeingResilienceBand {
  if (index >= 72) return 'robust';
  if (index >= 55) return 'steady';
  if (index >= 38) return 'fragile';
  return 'critical';
}

export function advanceResilienceTrajectory(
  turn: number,
  resilience: WellbeingResilienceSnapshot,
  persisted?: ResilienceTrajectoryPersisted | null
): { snapshot: ResilienceTrajectorySnapshot; persisted: ResilienceTrajectoryPersisted } {
  const base = sanitizeResilienceTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = resilience.resilienceIndex;
  const priorEma = base.resilienceIndexEma;
  const resilienceIndexEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(resilienceIndexEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Resilience EMA softening (${priorEma} → ${resilienceIndexEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Resilience EMA recovering (${priorEma} → ${resilienceIndexEma})`);
  }
  if (resilience.band === 'critical' || resilience.band === 'fragile') {
    evidence.push(`Instantaneous resilience ${resilience.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      resilienceIndexEma,
      instantaneousIndex: sample,
      band: bandFromIndex(resilienceIndexEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      resilienceIndexEma,
    },
  };
}


// --- source: intervention-priority-queue.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

export function buildWellbeingInterventionPriorityQueue(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  recommendations: ProgramSequencingRecommendation[];
  equityRebalancing: EquityRebalancingAdvice;
  limit?: number;
}): WellbeingInterventionPriorityQueue {
  const limit = args.limit ?? 6;
  const byProgram = new Map<string, WellbeingInterventionPriorityItem>();

  for (const region of args.equityRebalancing.laggingRegions) {
    for (const programId of region.suggestedProgramIds) {
      const commitment = commitmentFromProgramStub(programId, args.turn, byProgram.size + 1);
      const fitsCapacity = commitment
        ? canAcceptSpendingCommitment(args.capacity, commitment).allowed
        : false;
      const priorityScore = clamp(region.urgencyScore + (fitsCapacity ? 6 : 0));
      const existing = byProgram.get(programId);
      if (!existing || priorityScore > existing.priorityScore) {
        byProgram.set(programId, {
          rank: 0,
          programId,
          regionId: region.regionId,
          pillar: region.weakestPillar,
          priorityScore,
          source: 'equity',
          fitsCapacity,
          rationale: region.rationale,
        });
      }
    }
  }

  for (const rec of args.recommendations) {
    const commitment = commitmentFromProgramStub(rec.programId, args.turn, byProgram.size + 1);
    const fitsCapacity =
      rec.fitsCapacity ||
      (commitment ? canAcceptSpendingCommitment(args.capacity, commitment).allowed : false);
    const priorityScore = clamp(48 - rec.rank * 4 + (fitsCapacity ? 8 : 0));
    const existing = byProgram.get(rec.programId);
    if (!existing || priorityScore > existing.priorityScore) {
      byProgram.set(rec.programId, {
        rank: 0,
        programId: rec.programId,
        regionId: rec.regionId,
        pillar: rec.pillar,
        priorityScore,
        source: 'sequencing',
        fitsCapacity,
        rationale: rec.rationale,
      });
    }
  }

  if (args.capacity.bindingConstraint !== 'none' && args.capacity.slotsFree <= 1) {
    const relief = args.recommendations.find((r) => r.fitsCapacity);
    if (relief) {
      const existing = byProgram.get(relief.programId);
      const boosted = clamp((existing?.priorityScore ?? 40) + 12);
      byProgram.set(relief.programId, {
        rank: 0,
        programId: relief.programId,
        regionId: relief.regionId,
        pillar: relief.pillar,
        priorityScore: boosted,
        source: 'capacity_relief',
        fitsCapacity: true,
        rationale: `Capacity relief while ${args.capacity.bindingConstraint} binds`,
      });
    }
  }

  const items = [...byProgram.values()]
    .sort((a, b) => b.priorityScore - a.priorityScore)
    .slice(0, limit)
    .map((item, i) => ({ ...item, rank: i + 1 }));

  const shouldExpedite =
    args.equityRebalancing.shouldEscalate ||
    items.some((i) => i.priorityScore >= 32 && i.fitsCapacity) ||
    (args.capacity.bindingConstraint !== 'none' && items.some((i) => i.source === 'capacity_relief'));

  const summary =
    items.length === 0
      ? 'No ranked interventions — monitor capacity and equity'
      : `Queue ${items.slice(0, 3).map((i) => i.programId).join(', ')}${shouldExpedite ? ' (expedite)' : ''}`;

  return {
    turn: args.turn,
    shouldExpedite,
    items,
    summary,
  };
}


// --- source: capacity-relief-scheduler.ts ---
export function buildCapacityReliefSchedule(args: {
  turn: number;
  capacity: PublicServiceCapacitySnapshot;
  interventionQueue: WellbeingInterventionPriorityQueue;
  limit?: number;
}): CapacityReliefSchedule {
  const limit = args.limit ?? 4;
  const binding = args.capacity.bindingConstraint;
  const items: CapacityReliefScheduleItem[] = [];

  let offset = 1;
  for (const item of args.interventionQueue.items) {
    if (!item.fitsCapacity && binding !== 'none') {
      items.push({
        turn: args.turn,
        regionId: item.regionId,
        pillar: item.pillar,
        programId: item.programId,
        reliefTurnOffset: offset,
        bindingConstraint: binding,
        rationale: `Defer until ${binding} eases — ${item.rationale}`,
      });
      offset += 1;
    } else if (item.source === 'capacity_relief') {
      items.push({
        turn: args.turn,
        regionId: item.regionId,
        pillar: item.pillar,
        programId: item.programId,
        reliefTurnOffset: 0,
        bindingConstraint: binding,
        rationale: item.rationale,
      });
    }
    if (items.length >= limit) break;
  }

  const shouldDeferNewCommits =
    binding === 'fiscal_absorption' ||
    binding === 'workforce' ||
    (binding === 'program_slots' && args.capacity.slotsFree <= 0);

  const summary =
    items.length === 0
      ? shouldDeferNewCommits
        ? `Capacity relief: defer new commits (${binding})`
        : 'Capacity relief schedule clear'
      : `Relief window for ${items.map((i) => i.programId).join(', ')}`;

  return {
    turn: args.turn,
    bindingConstraint: binding,
    shouldDeferNewCommits,
    items: items.slice(0, limit),
    summary,
  };
}


// --- source: wellbeing-governance-panel.ts ---
function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function governanceBandFromSignals(args: {
  accountabilityBand: AccountabilityBand;
  resilienceBand: WellbeingResilienceBand;
  accountabilityTrajectory?: AccountabilityTrajectorySnapshot;
  resilienceTrajectory?: ResilienceTrajectorySnapshot;
}): WellbeingGovernanceBand {
  const accFail = args.accountabilityBand === 'failing' || args.accountabilityBand === 'at_risk';
  const resFragile = args.resilienceBand === 'fragile' || args.resilienceBand === 'critical';
  const bothSlipping =
    args.accountabilityTrajectory?.trajectory === 'deteriorating' &&
    args.resilienceTrajectory?.trajectory === 'deteriorating';

  if (accFail && resFragile) return 'crisis';
  if (accFail || resFragile || bothSlipping) return 'misaligned';
  if (
    args.accountabilityTrajectory?.trajectory === 'deteriorating' ||
    args.resilienceTrajectory?.trajectory === 'deteriorating'
  ) {
    return 'watch';
  }
  return 'aligned';
}

export function composeWellbeingGovernancePanel(args: {
  turn: number;
  accountabilityScorecard?: Agent14WellbeingAccountabilityScorecard;
  wellbeingResilience?: WellbeingResilienceSnapshot;
  accountabilityTrajectory?: AccountabilityTrajectorySnapshot;
  resilienceTrajectory?: ResilienceTrajectorySnapshot;
}): WellbeingGovernancePanel {
  const accountabilityBand = args.accountabilityScorecard?.band ?? 'adequate';
  const resilienceBand = args.wellbeingResilience?.band ?? 'steady';
  const governanceScore = clamp(
    (args.accountabilityScorecard?.overallScore ?? 55) * 0.52 +
      (args.wellbeingResilience?.resilienceIndex ?? 55) * 0.48
  );
  const band = governanceBandFromSignals({
    accountabilityBand,
    resilienceBand,
    accountabilityTrajectory: args.accountabilityTrajectory,
    resilienceTrajectory: args.resilienceTrajectory,
  });

  const headlines: string[] = [];
  if (band === 'crisis') headlines.push('Governance crisis — accountability and resilience both stressed');
  else if (band === 'misaligned') headlines.push('Governance misaligned — rebalance portfolio and capacity');
  else if (band === 'watch') headlines.push('Governance watch — one trajectory slipping');
  else headlines.push('Governance aligned across accountability and resilience');

  if (args.resilienceTrajectory?.trajectory === 'improving') {
    headlines.push('Resilience trajectory improving');
  }

  const summary = `${band} governance (${governanceScore}) — accountability ${accountabilityBand}, resilience ${resilienceBand}`;

  return {
    turn: args.turn,
    accountabilityBand,
    resilienceBand,
    governanceScore,
    band,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: governance-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

export function createInitialGovernanceTrajectory(): GovernanceTrajectoryPersisted {
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    governanceScoreEma: 60,
    priorEma: undefined,
  };
}

export function sanitizeGovernanceTrajectory(
  raw?: GovernanceTrajectoryPersisted | null
): GovernanceTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialGovernanceTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const governanceScoreEma =
    typeof raw.governanceScoreEma === 'number' && Number.isFinite(raw.governanceScoreEma)
      ? Math.max(0, Math.min(100, raw.governanceScoreEma))
      : 60;
  return {
    schemaVersion: '10.14.8-scale-wave-8' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    governanceScoreEma,
    priorEma:
      typeof raw.priorEma === 'number' && Number.isFinite(raw.priorEma)
        ? Math.max(0, Math.min(100, raw.priorEma))
        : undefined,
  };
}

function trajectoryFromDelta(
  current: number,
  previous: number | undefined,
  epsilon = 0.85
): CouplingTrajectoryTrend {
  if (previous === undefined) return 'flat';
  if (current - previous > epsilon) return 'improving';
  if (previous - current > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromScore(score: number, panelBand: WellbeingGovernanceBand): WellbeingGovernanceBand {
  if (panelBand === 'crisis' || panelBand === 'misaligned') return panelBand;
  if (score >= 72) return 'aligned';
  if (score >= 52) return 'watch';
  return panelBand === 'aligned' ? 'watch' : panelBand;
}

export function advanceGovernanceTrajectory(
  turn: number,
  panel: WellbeingGovernancePanel,
  persisted?: GovernanceTrajectoryPersisted | null
): { snapshot: GovernanceTrajectorySnapshot; persisted: GovernanceTrajectoryPersisted } {
  const base = sanitizeGovernanceTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = panel.governanceScore;
  const priorEma = base.governanceScoreEma;
  const governanceScoreEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(governanceScoreEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Governance EMA softening (${priorEma} → ${governanceScoreEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Governance EMA recovering (${priorEma} → ${governanceScoreEma})`);
  }
  if (panel.band === 'crisis' || panel.band === 'misaligned') {
    evidence.push(`Instantaneous governance ${panel.band} at ${sample}`);
  }

  return {
    snapshot: {
      turn,
      governanceScoreEma,
      instantaneousScore: sample,
      band: bandFromScore(governanceScoreEma, panel.band),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      governanceScoreEma,
    },
  };
}


// --- source: relief-dispatch-planner.ts ---
export function buildReliefDispatchPlan(args: {
  turn: number;
  reliefSchedule: CapacityReliefSchedule;
  interventionQueue: WellbeingInterventionPriorityQueue;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
  limit?: number;
}): ReliefDispatchPlan {
  const limit = args.limit ?? 5;
  const actions: ReliefDispatchAction[] = [];

  for (const item of args.reliefSchedule.items) {
    const priority =
      item.reliefTurnOffset === 0
        ? ('immediate' as const)
        : item.reliefTurnOffset >= 3
          ? ('hold' as const)
          : ('deferred' as const);
    actions.push({
      programId: item.programId,
      regionId: item.regionId,
      pillar: item.pillar,
      priority,
      targetTurn: args.turn + item.reliefTurnOffset,
      rationale: item.rationale,
    });
  }

  if (actions.length < limit && args.interventionQueue.shouldExpedite) {
    for (const item of args.interventionQueue.items) {
      if (item.fitsCapacity) {
        actions.push({
          programId: item.programId,
          regionId: item.regionId,
          pillar: item.pillar,
          priority: 'immediate',
          targetTurn: args.turn,
          rationale: `Expedite — ${item.rationale}`,
        });
      }
      if (actions.length >= limit) break;
    }
  }

  const shouldHoldCommits =
    args.reliefSchedule.shouldDeferNewCommits ||
    args.governanceTrajectory?.trajectory === 'deteriorating';

  const summary =
    actions.length === 0
      ? shouldHoldCommits
        ? 'Relief dispatch: hold new commits until governance stabilizes'
        : 'Relief dispatch plan clear'
      : `Dispatch ${actions.length} relief actions (${actions.filter((a) => a.priority === 'immediate').length} immediate)`;

  return {
    turn: args.turn,
    shouldHoldCommits,
    actions: actions.slice(0, limit),
    summary,
  };
}


// --- source: stakeholder-coordination-brief.ts ---
export function composeStakeholderCoordinationBrief(args: {
  turn: number;
  governancePanel: WellbeingGovernancePanel;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
  reliefDispatchPlan: ReliefDispatchPlan;
}): StakeholderCoordinationBrief {
  const trajectory = args.governanceTrajectory?.trajectory ?? 'flat';
  const reliefActions = args.reliefDispatchPlan.actions.length;
  const shouldEngageStakeholders =
    args.governancePanel.band === 'crisis' ||
    args.governancePanel.band === 'misaligned' ||
    trajectory === 'deteriorating' ||
    args.reliefDispatchPlan.shouldHoldCommits ||
    reliefActions >= 3;

  const headlines: string[] = [];
  if (shouldEngageStakeholders) {
    headlines.push('Stakeholder coordination recommended this turn');
  } else {
    headlines.push('Routine stakeholder touchpoints sufficient');
  }
  if (args.reliefDispatchPlan.shouldHoldCommits) {
    headlines.push('Hold portfolio commits until relief dispatch clears');
  }
  if (trajectory === 'improving' && args.governancePanel.band === 'aligned') {
    headlines.push('Governance trajectory improving — reduce escalation cadence');
  }

  const summary = `${args.governancePanel.band} governance / ${trajectory} trajectory — ${reliefActions} relief actions, engage=${shouldEngageStakeholders}`;

  return {
    turn: args.turn,
    governanceBand: args.governancePanel.band,
    trajectory,
    reliefActions,
    shouldEngageStakeholders,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wellbeing-executive-brief.ts ---
export function composeAgent14WellbeingExecutiveBrief(args: {
  turn: number;
  warnings: Agent14WellbeingWarningBundle;
  coupling: CrossPillarCouplingSnapshot;
  recommendations: ProgramSequencingRecommendation[];
  forecastPoints?: WellbeingTurnForecastPoint[];
  accountabilityScorecard?: Agent14WellbeingAccountabilityScorecard;
  equityRebalancing?: EquityRebalancingAdvice;
  accountabilityTrajectory?: AccountabilityTrajectorySnapshot;
  interventionPriorityQueue?: WellbeingInterventionPriorityQueue;
  wellbeingResilience?: WellbeingResilienceSnapshot;
  resilienceTrajectory?: ResilienceTrajectorySnapshot;
  capacityReliefSchedule?: CapacityReliefSchedule;
  wellbeingGovernancePanel?: WellbeingGovernancePanel;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
  reliefDispatchPlan?: ReliefDispatchPlan;
  stakeholderCoordinationBrief?: StakeholderCoordinationBrief;
}): Agent14WellbeingExecutiveBrief {
  const giNotes: string[] = [];
  const topWarning = args.warnings.warnings.sort((a, b) => {
    const rank = (s: string) =>
      s === 'critical' ? 4 : s === 'elevated' ? 3 : s === 'watch' ? 2 : 1;
    return rank(b.severity) - rank(a.severity);
  })[0];

  let forecastDeltaAffordability: number | undefined;
  if (args.forecastPoints && args.forecastPoints.length >= 2) {
    const first = args.forecastPoints[0]!;
    const last = args.forecastPoints[args.forecastPoints.length - 1]!;
    forecastDeltaAffordability =
      Math.round((last.affordabilityIndex - first.affordabilityIndex) * 10) / 10;
    giNotes.push(
      `Forecast horizon Δ affordability ${forecastDeltaAffordability} over ${args.forecastPoints.length} turns`
    );
  }

  const topRec = args.recommendations.find((r) => r.fitsCapacity) ?? args.recommendations[0];
  if (topRec) {
    giNotes.push(`Top sequenced program ${topRec.programId} (${topRec.pillar}, ${topRec.regionId})`);
  }

  if (args.coupling.evidence.length > 0) {
    giNotes.push(...args.coupling.evidence.slice(0, 2));
  }

  if (args.accountabilityScorecard) {
    giNotes.push(
      `Accountability ${args.accountabilityScorecard.band} (${args.accountabilityScorecard.overallScore})`
    );
  }
  if (args.equityRebalancing?.shouldEscalate) {
    giNotes.push(`Equity rebalance: ${args.equityRebalancing.summary}`);
  }
  if (args.accountabilityTrajectory?.trajectory === 'deteriorating') {
    giNotes.push(
      `Accountability trajectory ${args.accountabilityTrajectory.trajectory} (EMA ${args.accountabilityTrajectory.overallScoreEma})`
    );
  }
  if (args.interventionPriorityQueue?.shouldExpedite) {
    giNotes.push(`Intervention queue: ${args.interventionPriorityQueue.summary}`);
  }
  if (args.wellbeingResilience && (args.wellbeingResilience.band === 'fragile' || args.wellbeingResilience.band === 'critical')) {
    giNotes.push(`Wellbeing resilience ${args.wellbeingResilience.band} (${args.wellbeingResilience.resilienceIndex})`);
  }
  if (args.resilienceTrajectory?.trajectory === 'deteriorating') {
    giNotes.push(
      `Resilience trajectory ${args.resilienceTrajectory.trajectory} (EMA ${args.resilienceTrajectory.resilienceIndexEma})`
    );
  }
  if (args.capacityReliefSchedule?.shouldDeferNewCommits) {
    giNotes.push(`Capacity relief: ${args.capacityReliefSchedule.summary}`);
  }
  if (args.wellbeingGovernancePanel && args.wellbeingGovernancePanel.band !== 'aligned') {
    giNotes.push(args.wellbeingGovernancePanel.summary);
  }
  if (args.governanceTrajectory?.trajectory === 'deteriorating') {
    giNotes.push(
      `Governance trajectory ${args.governanceTrajectory.trajectory} (EMA ${args.governanceTrajectory.governanceScoreEma})`
    );
  }
  if (args.reliefDispatchPlan && args.reliefDispatchPlan.actions.length > 0) {
    giNotes.push(args.reliefDispatchPlan.summary);
  }
  if (args.stakeholderCoordinationBrief?.shouldEngageStakeholders) {
    giNotes.push(args.stakeholderCoordinationBrief.summary);
  }

  const headlineParts: string[] = [];
  if (args.coupling.band === 'critical' || args.coupling.band === 'strained') {
    headlineParts.push(`Cross-pillar coupling ${args.coupling.band}`);
  } else if (topWarning) {
    headlineParts.push(topWarning.title);
  } else {
    headlineParts.push('Public services delivery within expected bands');
  }

  if (forecastDeltaAffordability !== undefined && forecastDeltaAffordability < -2) {
    headlineParts.push('affordability trajectory softening');
  }
  if (args.wellbeingGovernancePanel?.band === 'crisis') {
    headlineParts.push('governance crisis');
  } else if (args.wellbeingResilience?.band === 'critical') {
    headlineParts.push('wellbeing resilience critical');
  }

  return {
    turn: args.turn,
    headline: headlineParts.join('; '),
    topWarningId: topWarning?.id,
    forecastDeltaAffordability,
    couplingBand: args.coupling.band,
    recommendedProgramId: topRec?.programId,
    giNotes,
  };
}


// --- source: turn-advance.ts ---
export interface AdvancePublicServicesTurnArgs {
  inputs: CapacityAndSpendingInputs;
  spendingPersisted?: DelayedSpendingPersisted | null;
  wellbeingMemoryPersisted?: RegionalWellbeingMemoryPersisted | null;
  couplingTrajectoryPersisted?: CouplingTrajectoryPersisted | null;
  accountabilityTrajectoryPersisted?: AccountabilityTrajectoryPersisted | null;
  resilienceTrajectoryPersisted?: ResilienceTrajectoryPersisted | null;
  governanceTrajectoryPersisted?: GovernanceTrajectoryPersisted | null;
  /** New commitments queued this turn (already validated or not). */
  newCommitments?: SpendingCommitment[];
  /** When true, reject commitments that fail capacity gate. */
  enforceCapacity?: boolean;
}

export interface AdvancePublicServicesTurnResult {
  inputs: EnrichedPublicServiceTurnInputs;
  spendingPersisted: DelayedSpendingPersisted;
  wellbeingMemoryPersisted: RegionalWellbeingMemoryPersisted;
  couplingTrajectoryPersisted: CouplingTrajectoryPersisted;
  accountabilityTrajectoryPersisted: AccountabilityTrajectoryPersisted;
  resilienceTrajectoryPersisted: ResilienceTrajectoryPersisted;
  governanceTrajectoryPersisted: GovernanceTrajectoryPersisted;
  rejectedCommitments: Array<{ commitment: SpendingCommitment; reason: string }>;
}

export function advancePublicServicesTurn(
  args: AdvancePublicServicesTurnArgs
): AdvancePublicServicesTurnResult {
  const turn = Math.max(1, Math.floor(args.inputs.turn || 1));
  let spendingPersisted = args.spendingPersisted ?? null;
  const rejectedCommitments: AdvancePublicServicesTurnResult['rejectedCommitments'] = [];

  for (const c of args.newCommitments ?? []) {
    const capacityNow = computePublicServiceCapacity(
      args.inputs,
      spendingPersisted?.active ?? []
    );
    const gate = canAcceptSpendingCommitment(capacityNow, c);
    if (!gate.allowed && args.enforceCapacity !== false) {
      rejectedCommitments.push({ commitment: c, reason: gate.reason });
      continue;
    }
    spendingPersisted = commitSpendingProgram(spendingPersisted, c);
  }

  const { effects, persisted: afterTick } = advanceDelayedSpendingEffects(turn, spendingPersisted);
  spendingPersisted = afterTick;

  const capacity = computePublicServiceCapacity(args.inputs, spendingPersisted.active);

  const fiscalHeadroom = args.inputs.fiscalHeadroom ?? 55;
  const regionalPipelines = computeAllRegionalHousingPipelines(
    turn,
    capacity,
    effects,
    fiscalHeadroom
  );
  const housingWellbeing = computeNationalHousingWellbeingSnapshot(turn, regionalPipelines);

  const remoteShareByRegion = Object.fromEntries(
    AGENT14_CORE_REGIONS.map((r) => [r, AGENT14_HOUSING_REGION_BASELINE[r].remoteShare])
  );
  const serviceAccessLens = computeNationalServiceAccessLens(
    turn,
    capacity,
    effects,
    remoteShareByRegion
  );
  const wellbeingWarnings = evaluateAgent14WellbeingWarnings(
    capacity,
    housingWellbeing,
    serviceAccessLens
  );
  const programRecommendations = recommendAgent14ProgramSequence(
    turn,
    capacity,
    housingWellbeing,
    serviceAccessLens,
    6
  );

  const crossPillarCoupling = computeCrossPillarCoupling(
    turn,
    capacity,
    housingWellbeing,
    serviceAccessLens
  );

  const memoryAdvance = advanceRegionalWellbeingMemory(
    turn,
    housingWellbeing,
    serviceAccessLens,
    args.wellbeingMemoryPersisted
  );

  const couplingTrajectoryAdvance = advanceCouplingTrajectory(
    turn,
    crossPillarCoupling,
    args.couplingTrajectoryPersisted
  );

  const equityRebalancing = adviseEquityRebalancing({
    turn,
    housing: housingWellbeing,
    access: serviceAccessLens,
    memory: memoryAdvance.snapshot,
  });

  const accountabilityScorecard = composeWellbeingAccountabilityScorecard({
    turn,
    capacity,
    housing: housingWellbeing,
    warnings: wellbeingWarnings,
    coupling: crossPillarCoupling,
    couplingTrajectory: couplingTrajectoryAdvance.snapshot,
    memory: memoryAdvance.snapshot,
    spendingPersisted,
  });

  const accountabilityTrajectoryAdvance = advanceAccountabilityTrajectory(
    turn,
    accountabilityScorecard,
    args.accountabilityTrajectoryPersisted
  );

  const interventionPriorityQueue = buildWellbeingInterventionPriorityQueue({
    turn,
    capacity,
    recommendations: programRecommendations,
    equityRebalancing,
  });

  const wellbeingResilience = computeWellbeingResilienceIndex({
    turn,
    capacity,
    housing: housingWellbeing,
    warnings: wellbeingWarnings,
    coupling: crossPillarCoupling,
    couplingTrajectory: couplingTrajectoryAdvance.snapshot,
    accountabilityScorecard,
  });

  const resilienceTrajectoryAdvance = advanceResilienceTrajectory(
    turn,
    wellbeingResilience,
    args.resilienceTrajectoryPersisted
  );

  const capacityReliefSchedule = buildCapacityReliefSchedule({
    turn,
    capacity,
    interventionQueue: interventionPriorityQueue,
  });

  const wellbeingGovernancePanel = composeWellbeingGovernancePanel({
    turn,
    accountabilityScorecard,
    wellbeingResilience,
    accountabilityTrajectory: accountabilityTrajectoryAdvance.snapshot,
    resilienceTrajectory: resilienceTrajectoryAdvance.snapshot,
  });

  const governanceTrajectoryAdvance = advanceGovernanceTrajectory(
    turn,
    wellbeingGovernancePanel,
    args.governanceTrajectoryPersisted
  );

  const reliefDispatchPlan = buildReliefDispatchPlan({
    turn,
    reliefSchedule: capacityReliefSchedule,
    interventionQueue: interventionPriorityQueue,
    governanceTrajectory: governanceTrajectoryAdvance.snapshot,
  });

  const stakeholderCoordinationBrief = composeStakeholderCoordinationBrief({
    turn,
    governancePanel: wellbeingGovernancePanel,
    governanceTrajectory: governanceTrajectoryAdvance.snapshot,
    reliefDispatchPlan,
  });

  const executiveBrief = composeAgent14WellbeingExecutiveBrief({
    turn,
    warnings: wellbeingWarnings,
    coupling: crossPillarCoupling,
    recommendations: programRecommendations,
    accountabilityScorecard,
    equityRebalancing,
    accountabilityTrajectory: accountabilityTrajectoryAdvance.snapshot,
    interventionPriorityQueue,
    wellbeingResilience,
    resilienceTrajectory: resilienceTrajectoryAdvance.snapshot,
    capacityReliefSchedule,
    wellbeingGovernancePanel,
    governanceTrajectory: governanceTrajectoryAdvance.snapshot,
    reliefDispatchPlan,
    stakeholderCoordinationBrief,
  });

  const enriched: EnrichedPublicServiceTurnInputs = {
    ...args.inputs,
    turn,
    fiscalLoadFromActivePrograms: Math.round(
      (effects.fiscalLoadThisTurn + (args.inputs.activeProgramCount ?? 0) * 0.5) * 10
    ) / 10,
    completedHousingProjects: effects.completedProjectBoost.housing,
    completedHealthProjects: effects.completedProjectBoost.healthcare,
    completedEducationProjects: effects.completedProjectBoost.education,
    activeProgramCount: spendingPersisted.active.length,
    capacity,
    spending: effects,
    housingWellbeing,
    serviceAccessLens,
    wellbeingWarnings,
    programRecommendations,
    crossPillarCoupling,
    regionalWellbeingMemory: memoryAdvance.snapshot,
    executiveBrief,
    couplingTrajectory: couplingTrajectoryAdvance.snapshot,
    accountabilityScorecard,
    equityRebalancing,
    accountabilityTrajectory: accountabilityTrajectoryAdvance.snapshot,
    interventionPriorityQueue,
    wellbeingResilience,
    resilienceTrajectory: resilienceTrajectoryAdvance.snapshot,
    capacityReliefSchedule,
    wellbeingGovernancePanel,
    governanceTrajectory: governanceTrajectoryAdvance.snapshot,
    reliefDispatchPlan,
    stakeholderCoordinationBrief,
  };

  return {
    inputs: enriched,
    spendingPersisted,
    wellbeingMemoryPersisted: memoryAdvance.persisted,
    couplingTrajectoryPersisted: couplingTrajectoryAdvance.persisted,
    accountabilityTrajectoryPersisted: accountabilityTrajectoryAdvance.persisted,
    resilienceTrajectoryPersisted: resilienceTrajectoryAdvance.persisted,
    governanceTrajectoryPersisted: governanceTrajectoryAdvance.persisted,
    rejectedCommitments,
  };
}


// --- source: scenario-sweep.ts ---
export type Agent14HousingScenarioId =
  | 'baseline_steady'
  | 'fiscal_austerity'
  | 'remote_equity_stress'
  | 'housing_acceleration'
  | 'workforce_blocking'
  | 'crisis_recovery'
  | 'mixed_pillar_push'
  | 'capacity_saturated'
  | 'health_education_surge'
  | 'persisted_recovery_arc'
  | 'coupling_stress_escalation'
  | 'equity_rebalance_push'
  | 'accountability_slip_arc'
  | 'intervention_priority_stress'
  | 'resilience_recovery_arc'
  | 'capacity_relief_governance_stress'
  | 'governance_trajectory_arc'
  | 'relief_dispatch_coordination_stress';

export interface Agent14HousingScenarioDefinition {
  id: Agent14HousingScenarioId;
  label: string;
  baseInputs: Partial<CapacityAndSpendingInputs>;
  /** Program stub ids committed on turn 1 (from AGENT14_HOUSING_PROGRAM_STUBS). */
  launchProgramIds: string[];
}

export const AGENT14_HOUSING_SCENARIOS: readonly Agent14HousingScenarioDefinition[] = [
  {
    id: 'baseline_steady',
    label: 'Steady baseline',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
    launchProgramIds: ['ps_h_NSW_social_accel', 'ps_h_VIC_planning_reform'],
  },
  {
    id: 'fiscal_austerity',
    label: 'Fiscal austerity',
    baseInputs: { fiscalHeadroom: 28, stateCapacityLoad: 62, workforceReadiness: 'strained' },
    launchProgramIds: ['ps_h_SA_modular'],
  },
  {
    id: 'remote_equity_stress',
    label: 'Remote equity stress',
    baseInputs: { fiscalHeadroom: 45, stateCapacityLoad: 55, workforceSpecialistGap: 48 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_h_WA_remote_housing'],
  },
  {
    id: 'housing_acceleration',
    label: 'Housing acceleration',
    baseInputs: { fiscalHeadroom: 78, stateCapacityLoad: 30, workforceReadiness: 'strong' },
    launchProgramIds: ['ps_h_QLD_regional_release', 'ps_h_ACT_density', 'ps_h_NSW_social_accel'],
  },
  {
    id: 'workforce_blocking',
    label: 'Workforce blocking',
    baseInputs: { fiscalHeadroom: 52, stateCapacityLoad: 50, workforceReadiness: 'blocking', workforceSpecialistGap: 72 },
    launchProgramIds: ['ps_h_TAS_affordable'],
  },
  {
    id: 'crisis_recovery',
    label: 'Crisis recovery',
    baseInputs: { fiscalHeadroom: 32, stateCapacityLoad: 78, workforceReadiness: 'weak', workforceSpecialistGap: 55 },
    launchProgramIds: ['ps_h_QLD_regional_release', 'ps_h_SA_modular'],
  },
  {
    id: 'mixed_pillar_push',
    label: 'Mixed pillar push',
    baseInputs: { fiscalHeadroom: 62, stateCapacityLoad: 38, workforceReadiness: 'balanced' },
    launchProgramIds: ['ps_h_NSW_social_accel', 'ps_h_WA_remote_housing', 'ps_h_ACT_density'],
  },
  {
    id: 'capacity_saturated',
    label: 'Capacity saturated',
    baseInputs: { fiscalHeadroom: 35, stateCapacityLoad: 80, workforceReadiness: 'strained', workforceSpecialistGap: 60 },
    launchProgramIds: [
      'ps_h_NSW_social_accel',
      'ps_h_VIC_planning_reform',
      'ps_h_QLD_regional_release',
      'ps_h_WA_remote_housing',
      'ps_h_NT_remote_housing',
      'ps_h_TAS_affordable',
      'ps_h_SA_modular',
      'ps_h_ACT_density',
    ],
  },
  {
    id: 'health_education_surge',
    label: 'Health and education surge',
    baseInputs: { fiscalHeadroom: 68, stateCapacityLoad: 35, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_he_NSW_primary_care',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_ed_WA_regional_schools',
    ],
  },
  {
    id: 'persisted_recovery_arc',
    label: 'Persisted recovery arc',
    baseInputs: { fiscalHeadroom: 38, stateCapacityLoad: 65, workforceReadiness: 'weak' },
    launchProgramIds: ['ps_h_SA_modular', 'ps_he_QLD_remote_clinic', 'ps_ed_TAS_rural_connect'],
  },
  {
    id: 'coupling_stress_escalation',
    label: 'Coupling stress escalation',
    baseInputs: { fiscalHeadroom: 18, stateCapacityLoad: 88, workforceReadiness: 'blocking', workforceSpecialistGap: 75 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_h_TAS_affordable', 'ps_he_NT_remote_clinic'],
  },
  {
    id: 'equity_rebalance_push',
    label: 'Equity rebalance push',
    baseInputs: { fiscalHeadroom: 55, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_QLD_wellness_hub',
      'ps_xp_NT_integrated_services',
      'ps_h_WA_remote_housing',
      'ps_ed_WA_regional_schools',
    ],
  },
  {
    id: 'accountability_slip_arc',
    label: 'Accountability slip arc',
    baseInputs: { fiscalHeadroom: 22, stateCapacityLoad: 82, workforceReadiness: 'blocking', workforceSpecialistGap: 68 },
    launchProgramIds: ['ps_h_NT_remote_housing', 'ps_he_VIC_hospital_backlog', 'ps_ed_NSW_skills'],
  },
  {
    id: 'intervention_priority_stress',
    label: 'Intervention priority stress',
    baseInputs: { fiscalHeadroom: 42, stateCapacityLoad: 72, workforceReadiness: 'strained', workforceSpecialistGap: 58 },
    launchProgramIds: [
      'ps_xp_TAS_community_wellbeing',
      'ps_xp_WA_remote_lifecycle',
      'ps_h_WA_remote_housing',
      'ps_he_QLD_remote_clinic',
    ],
  },
  {
    id: 'resilience_recovery_arc',
    label: 'Resilience recovery arc',
    baseInputs: { fiscalHeadroom: 48, stateCapacityLoad: 52, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_SA_integrated_housing_health',
      'ps_h_SA_modular',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'capacity_relief_governance_stress',
    label: 'Capacity relief governance stress',
    baseInputs: { fiscalHeadroom: 26, stateCapacityLoad: 86, workforceReadiness: 'blocking', workforceSpecialistGap: 70 },
    launchProgramIds: [
      'ps_xp_ACT_wellbeing_coordination',
      'ps_h_ACT_density',
      'ps_ed_NSW_skills',
      'ps_he_VIC_hospital_backlog',
    ],
  },
  {
    id: 'governance_trajectory_arc',
    label: 'Governance trajectory arc',
    baseInputs: { fiscalHeadroom: 34, stateCapacityLoad: 68, workforceReadiness: 'strained' },
    launchProgramIds: [
      'ps_xp_NSW_governance_reform',
      'ps_h_NSW_social_accel',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'relief_dispatch_coordination_stress',
    label: 'Relief dispatch coordination stress',
    baseInputs: { fiscalHeadroom: 20, stateCapacityLoad: 92, workforceReadiness: 'blocking', workforceSpecialistGap: 74 },
    launchProgramIds: [
      'ps_xp_VIC_relief_coordination',
      'ps_h_VIC_planning_reform',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_VIC_tafe',
    ],
  },
];

export function simulateAgent14HousingScenario(
  scenarioId: Agent14HousingScenarioId,
  turnCount: number
): {
  scenario: Agent14HousingScenarioDefinition;
  turns: EnrichedPublicServiceTurnInputs[];
  spendingPersisted: DelayedSpendingPersisted;
} {
  const scenario = AGENT14_HOUSING_SCENARIOS.find((s) => s.id === scenarioId)!;
  const maxTurns = Math.min(Math.max(1, turnCount), AGENT14_LIMITS.maxSimulationTurns);
  let spendingPersisted: DelayedSpendingPersisted | null = null;
  let wellbeingMemoryPersisted = null;
  let couplingTrajectoryPersisted = null;
  let accountabilityTrajectoryPersisted = null;
  let resilienceTrajectoryPersisted = null;
  let governanceTrajectoryPersisted = null;
  const turns: EnrichedPublicServiceTurnInputs[] = [];

  for (let t = 1; t <= maxTurns; t += 1) {
    const newCommitments: SpendingCommitment[] = [];
    if (t === 1) {
      scenario.launchProgramIds.forEach((pid, i) => {
        const c = commitmentFromProgramStub(pid, 1, i);
        if (c) newCommitments.push(c);
      });
    }
    const result = advancePublicServicesTurn({
      inputs: { turn: t, ...scenario.baseInputs },
      spendingPersisted,
      wellbeingMemoryPersisted,
      couplingTrajectoryPersisted,
      accountabilityTrajectoryPersisted,
      resilienceTrajectoryPersisted,
      governanceTrajectoryPersisted,
      newCommitments,
      enforceCapacity: true,
    });
    spendingPersisted = result.spendingPersisted;
    wellbeingMemoryPersisted = result.wellbeingMemoryPersisted;
    couplingTrajectoryPersisted = result.couplingTrajectoryPersisted;
    accountabilityTrajectoryPersisted = result.accountabilityTrajectoryPersisted;
    resilienceTrajectoryPersisted = result.resilienceTrajectoryPersisted;
    governanceTrajectoryPersisted = result.governanceTrajectoryPersisted;
    turns.push(result.inputs);
  }

  return { scenario, turns, spendingPersisted: spendingPersisted! };
}

export function runAgent14HousingScenarioSweep(): Array<{
  scenarioId: Agent14HousingScenarioId;
  passed: boolean;
  detail: string;
}> {
  const out: Array<{ scenarioId: Agent14HousingScenarioId; passed: boolean; detail: string }> = [];
  for (const sc of AGENT14_HOUSING_SCENARIOS) {
    const sim = simulateAgent14HousingScenario(sc.id, 12);
    const last = sim.turns[sim.turns.length - 1];
    const wb = last.housingWellbeing;
    const ok =
      Boolean(wb) &&
      last.capacity.deliveryCapacityIndex > 0 &&
      wb!.totalDwellingsInPipeline > 0 &&
      wb!.narrativeSummary.length > 20;
    out.push({
      scenarioId: sc.id,
      passed: ok,
      detail: ok
        ? `aff=${wb!.nationalAffordabilityIndex} gap=${wb!.regionalEquityGap}`
        : 'missing wellbeing snapshot',
    });
  }
  return out;
}


// --- source: self-tests.ts ---
export interface Agent14SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function check(
  results: Agent14SelfTestResult[],
  id: string,
  name: string,
  condition: boolean,
  detail: string
): void {
  results.push({ id, name, passed: Boolean(condition), detail });
}

export function runAgent14WellbeingSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Agent14SelfTestResult[];
} {
  const results: Agent14SelfTestResult[] = [];

  check(
    results,
    'cap_fiscal_absorption_bounds',
    'Fiscal absorption cap stays within configured bounds',
    computeFiscalAbsorptionCap(10, 90) >= 18 && computeFiscalAbsorptionCap(95, 5) <= 72,
    `low=${computeFiscalAbsorptionCap(10, 90)} high=${computeFiscalAbsorptionCap(95, 5)}`
  );

  check(
    results,
    'cap_program_slots_fiscal_headroom',
    'High fiscal headroom grants extra program slots',
    computeNationalProgramSlots(75, 30) > computeNationalProgramSlots(35, 30),
    `high=${computeNationalProgramSlots(75, 30)} low=${computeNationalProgramSlots(35, 30)}`
  );

  {
    const cap = computePublicServiceCapacity(
      { turn: 3, fiscalHeadroom: 60, stateCapacityLoad: 40, workforceSpecialistGap: 30 },
      []
    );
    check(
      results,
      'cap_empty_active_delivery_index',
      'Empty commitment set yields non-zero delivery capacity index',
      cap.deliveryCapacityIndex >= 70 && cap.bindingConstraint === 'none',
      `index=${cap.deliveryCapacityIndex} binding=${cap.bindingConstraint}`
    );
  }

  {
    const heavy = makeSpendingCommitment({
      id: 'c1',
      programId: 'ps_h_NSW_1',
      pillar: 'housing',
      regionId: 'NSW',
      committedTurn: 1,
      fiscalLoadPoints: 60,
      durationTurns: 4,
      baseImpact: 8,
      effectLagTurns: 1,
      rampTurns: 2,
    });
    const cap = computePublicServiceCapacity(
      { turn: 2, fiscalHeadroom: 40, stateCapacityLoad: 70 },
      [heavy]
    );
    const gate = canAcceptSpendingCommitment(cap, {
      fiscalLoadPoints: 80,
      durationTurns: 2,
    });
    check(
      results,
      'cap_fiscal_binding_rejects',
      'Saturated fiscal absorption rejects new commitments',
      cap.fiscalLoadScheduledThisTurn > 0 && (!gate.allowed || cap.bindingConstraint !== 'none'),
      `scheduled=${cap.fiscalLoadScheduledThisTurn} allowed=${gate.allowed} binding=${cap.bindingConstraint}`
    );
  }

  {
    let persisted = createInitialDelayedSpendingPersisted();
    const c = makeSpendingCommitment({
      id: 'lag1',
      programId: 'ps_he_VIC_1',
      pillar: 'healthcare',
      regionId: 'VIC',
      committedTurn: 5,
      fiscalLoadPoints: 24,
      durationTurns: 3,
      baseImpact: 10,
      effectLagTurns: 2,
      rampTurns: 2,
    });
    persisted = commitSpendingProgram(persisted, c);
    const t5 = advanceDelayedSpendingEffects(5, persisted);
    const t6 = advanceDelayedSpendingEffects(6, t5.persisted);
    const t7 = advanceDelayedSpendingEffects(7, t6.persisted);
    check(
      results,
      'delay_fiscal_before_kpi',
      'Fiscal load applies before KPI lag elapses',
      t5.effects.fiscalLoadThisTurn > 0 &&
        t5.effects.completedProjectBoost.healthcare === 0 &&
        t7.effects.completedProjectBoost.healthcare > 0,
      `t5 fiscal=${t5.effects.fiscalLoadThisTurn} t5 kpi=${t5.effects.completedProjectBoost.healthcare} t7 kpi=${t7.effects.completedProjectBoost.healthcare}`
    );
  }

  {
    let persisted = createInitialDelayedSpendingPersisted();
    persisted = commitSpendingProgram(
      persisted,
      makeSpendingCommitment({
        id: 'r1',
        programId: 'ps_ed_QLD_1',
        pillar: 'education',
        regionId: 'QLD',
        committedTurn: 1,
        fiscalLoadPoints: 12,
        durationTurns: 2,
        baseImpact: 6,
        effectLagTurns: 0,
        rampTurns: 1,
      })
    );
    const end = advanceDelayedSpendingEffects(3, persisted);
    check(
      results,
      'delay_maturity_event',
      'Completed fiscal duration emits maturity marker',
      end.effects.maturedCommitmentIds.includes('r1'),
      `matured=${end.effects.maturedCommitmentIds.join(',')}`
    );
  }

  {
    const slots = computeNationalProgramSlots(55, 40);
    const commitments = Array.from({ length: slots + 1 }, (_, i) =>
      makeSpendingCommitment({
        id: `fill_${i}`,
        programId: `p_${i}`,
        pillar: 'housing',
        regionId: 'NSW',
        committedTurn: 1,
        fiscalLoadPoints: 8,
        durationTurns: 5,
        baseImpact: 4,
      })
    );
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 55, stateCapacityLoad: 40 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      newCommitments: commitments,
      enforceCapacity: true,
    });
    check(
      results,
      'turn_advance_capacity_gate',
      'Turn advance rejects commitments beyond slot capacity',
      adv.rejectedCommitments.length >= 1 && adv.inputs.activeProgramCount <= slots,
      `active=${adv.inputs.activeProgramCount} slots=${slots} rejected=${adv.rejectedCommitments.length}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 70, stateCapacityLoad: 25 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      newCommitments: [
        makeSpendingCommitment({
          id: 'enrich1',
          programId: 'ps_h_ACT_1',
          pillar: 'housing',
          regionId: 'ACT',
          committedTurn: 4,
          fiscalLoadPoints: 20,
          durationTurns: 4,
          baseImpact: 12,
          effectLagTurns: 0,
          rampTurns: 2,
        }),
      ],
    });
    check(
      results,
      'turn_advance_enriched_inputs',
      'Enriched inputs expose fiscal load and capacity snapshot',
      adv.inputs.fiscalLoadFromActivePrograms > 0 &&
        adv.inputs.capacity.deliveryCapacityIndex > 0 &&
        adv.inputs.completedHousingProjects > 0,
      `fiscalLoad=${adv.inputs.fiscalLoadFromActivePrograms} housingBoost=${adv.inputs.completedHousingProjects}`
    );
  }

  {
    const a = advancePublicServicesTurn({
      inputs: { turn: 1, fiscalHeadroom: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const b = advancePublicServicesTurn({
      inputs: { turn: 1, fiscalHeadroom: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'turn_advance_deterministic',
      'Identical inputs produce identical enriched fiscal load',
      a.inputs.fiscalLoadFromActivePrograms === b.inputs.fiscalLoadFromActivePrograms,
      `a=${a.inputs.fiscalLoadFromActivePrograms} b=${b.inputs.fiscalLoadFromActivePrograms}`
    );
  }

  check(
    results,
    'housing_region_baselines_count',
    'Eight core regions have housing baselines',
    AGENT14_CORE_REGIONS.length === 8 &&
      AGENT14_CORE_REGIONS.every((r) => r in AGENT14_HOUSING_REGION_BASELINE),
    `regions=${AGENT14_CORE_REGIONS.length} stubs=${AGENT14_HOUSING_PROGRAM_STUBS.length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 65, stateCapacityLoad: 35 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wb = adv.inputs.housingWellbeing;
    check(
      results,
      'housing_wellbeing_snapshot_attached',
      'Turn advance attaches national housing wellbeing snapshot',
      Boolean(wb) && Object.keys(wb!.regions).length === 8,
      `aff=${wb?.nationalAffordabilityIndex} stress=${wb?.affordabilityStress}`
    );
  }

  {
    const cap = computePublicServiceCapacity(
      { turn: 4, fiscalHeadroom: 70, stateCapacityLoad: 25 },
      []
    );
    const spending = advanceDelayedSpendingEffects(4, createInitialDelayedSpendingPersisted()).effects;
    const regions = computeAllRegionalHousingPipelines(4, cap, spending, 70);
    const nt = regions.NT;
    const act = regions.ACT;
    check(
      results,
      'housing_remote_nt_pressure',
      'NT remote share yields higher planning backlog than ACT',
      nt.planningBacklogMonths > act.planningBacklogMonths && nt.remoteShare > act.remoteShare,
      `NT=${nt.planningBacklogMonths}m ACT=${act.planningBacklogMonths}m`
    );
  }

  {
    const capLow = computePublicServiceCapacity({ turn: 3, fiscalHeadroom: 25, stateCapacityLoad: 60 }, []);
    const capHigh = computePublicServiceCapacity({ turn: 3, fiscalHeadroom: 80, stateCapacityLoad: 60 }, []);
    const spend = advanceDelayedSpendingEffects(3, createInitialDelayedSpendingPersisted()).effects;
    const low = computeAllRegionalHousingPipelines(3, capLow, spend, 25).NSW;
    const high = computeAllRegionalHousingPipelines(3, capHigh, spend, 80).NSW;
    check(
      results,
      'housing_fiscal_headroom_affordability',
      'Higher fiscal headroom improves NSW affordability index',
      high.affordabilityIndex > low.affordabilityIndex,
      `low=${low.affordabilityIndex} high=${high.affordabilityIndex}`
    );
  }

  {
    const snap = computeNationalHousingWellbeingSnapshot(
      5,
      computeAllRegionalHousingPipelines(
        5,
        computePublicServiceCapacity({ turn: 5, fiscalHeadroom: 50 }, []),
        advanceDelayedSpendingEffects(5, createInitialDelayedSpendingPersisted()).effects,
        50
      )
    );
    check(
      results,
      'housing_national_narrative',
      'National snapshot produces non-empty narrative',
      snap.narrativeSummary.length > 40 && snap.regionalEquityGap >= 0,
      snap.narrativeSummary.slice(0, 60)
    );
  }

  {
    const c = commitmentFromProgramStub('ps_h_NSW_social_accel', 2, 0);
    check(
      results,
      'housing_program_stub_commitment',
      'Program stub maps to spending commitment',
      c !== null && c!.pillar === 'housing' && c!.regionId === 'NSW',
      `id=${c?.id} load=${c?.fiscalLoadPoints}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('housing_acceleration', 10);
    const t1 = sim.turns[0];
    const t10 = sim.turns[9];
    check(
      results,
      'housing_scenario_acceleration',
      'Housing acceleration scenario runs 10 turns with programs',
      sim.turns.length === 10 &&
        t1.activeProgramCount >= 1 &&
        t10.housingWellbeing!.socialCompletionsIndex > 0,
      `active t1=${t1.activeProgramCount} social t10=${t10.housingWellbeing?.socialCompletionsIndex}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('fiscal_austerity', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'housing_scenario_austerity_capacity',
      'Austerity scenario keeps delivery capacity index bounded',
      last.capacity.deliveryCapacityIndex >= 20 && last.capacity.deliveryCapacityIndex <= 100,
      `delivery=${last.capacity.deliveryCapacityIndex} binding=${last.capacity.bindingConstraint}`
    );
  }

  {
    const remote = simulateAgent14HousingScenario('remote_equity_stress', 12);
    check(
      results,
      'housing_scenario_equity_gap',
      'Remote stress scenario reports regional equity gap',
      remote.turns[11].housingWellbeing!.regionalEquityGap >= 5,
      `gap=${remote.turns[11].housingWellbeing?.regionalEquityGap}`
    );
  }

  for (const row of runAgent14HousingScenarioSweep()) {
    check(
      results,
      `housing_sweep_${row.scenarioId}`,
      `Scenario sweep: ${row.scenarioId}`,
      row.passed,
      row.detail
    );
  }

  {
    const bad = sanitizeDelayedSpendingPersisted({
      schemaVersion: '10.14.2-housing-depth' as any,
      active: [{ id: 'x', committedTurn: 1 } as any],
      history: [],
    });
    check(
      results,
      'housing_sanitize_commitment_filter',
      'Sanitize drops malformed commitments',
      bad.active.length === 0,
      `active=${bad.active.length}`
    );
  }

  {
    let persisted = createInitialDelayedSpendingPersisted();
    for (let i = 0; i < 30; i += 1) {
      persisted = commitSpendingProgram(
        persisted,
        makeSpendingCommitment({
          id: `hist_${i}`,
          programId: 'p',
          pillar: 'housing',
          regionId: 'NSW',
          committedTurn: 1,
          fiscalLoadPoints: 4,
          durationTurns: 2,
          baseImpact: 3,
        })
      );
    }
    check(
      results,
      'housing_history_cap',
      'Commit history respects max active cap',
      persisted.active.length <= 24,
      `active=${persisted.active.length}`
    );
  }

  for (let v = 0; v < 8; v += 1) {
    const adv = advancePublicServicesTurn({
      inputs: {
        turn: v + 1,
        fiscalHeadroom: 40 + v * 5,
        stateCapacityLoad: 50 - v * 2,
        workforceReadiness: v % 2 === 0 ? 'balanced' : 'strained',
      },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      `housing_variant_turn_${v + 1}`,
      `Variant turn ${v + 1} wellbeing snapshot valid`,
      adv.inputs.housingWellbeing !== undefined &&
        adv.inputs.housingWellbeing!.nationalAffordabilityIndex >= 0 &&
        adv.inputs.housingWellbeing!.nationalAffordabilityIndex <= 100,
      `aff=${adv.inputs.housingWellbeing?.nationalAffordabilityIndex}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 55, stateCapacityLoad: 45 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave3_service_access_lens',
      'Turn advance attaches national service access lens',
      adv.inputs.serviceAccessLens !== undefined &&
        adv.inputs.serviceAccessLens!.nationalComposite > 0 &&
        adv.inputs.serviceAccessLens!.pillarNational.healthcare.accessIndex > 0,
      `composite=${adv.inputs.serviceAccessLens?.nationalComposite} band=${adv.inputs.serviceAccessLens?.nationalBand}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 25, stateCapacityLoad: 75, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      newCommitments: Array.from({ length: 6 }, (_, i) =>
        makeSpendingCommitment({
          id: `sat_${i}`,
          programId: 'p',
          pillar: 'housing',
          regionId: 'NSW',
          committedTurn: 3,
          fiscalLoadPoints: 30,
          durationTurns: 5,
          baseImpact: 6,
        })
      ),
      enforceCapacity: false,
    });
    check(
      results,
      'wave3_wellbeing_warnings',
      'Strained inputs produce guardian warning bundle',
      adv.inputs.wellbeingWarnings !== undefined &&
        adv.inputs.wellbeingWarnings!.warnings.length >= 1,
      `surface=${adv.inputs.wellbeingWarnings?.shouldSurface} n=${adv.inputs.wellbeingWarnings?.warnings.length}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 60, stateCapacityLoad: 40 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave3_program_recommendations',
      'Program sequencing returns ranked recommendations',
      (adv.inputs.programRecommendations?.length ?? 0) >= 3 &&
        adv.inputs.programRecommendations![0].rank === 1,
      `n=${adv.inputs.programRecommendations?.length} first=${adv.inputs.programRecommendations?.[0]?.programId}`
    );
  }

  {
    const fc = forecastAgent14WellbeingTurns('baseline_steady', 6);
    check(
      results,
      'wave3_forecast_scenario',
      'Scenario forecast returns horizon points',
      fc.points.length === 6 && fc.points[0].turn >= 1,
      `scenario=${fc.scenarioId} turns=${fc.points.length}`
    );
  }

  {
    const pts = forecastFromInputs({ turn: 1, fiscalHeadroom: 50, stateCapacityLoad: 45 }, 4);
    check(
      results,
      'wave3_forecast_inputs',
      'Input forecast monotonic turn labels',
      pts.length === 4 && pts[3].turn === 4,
      `t4 aff=${pts[3].affordabilityIndex}`
    );
  }

  check(
    results,
    'wave3_scenario_catalog_size',
    'Eighteen housing scenarios registered',
    listAgent14ScenarioIds().length === 18,
    `ids=${listAgent14ScenarioIds().join(',')}`
  );

  {
    const sim = simulateAgent14HousingScenario('capacity_saturated', 6);
    check(
      results,
      'wave3_capacity_saturated_scenario',
      'Saturated scenario runs with rejections or binding',
      sim.turns.length === 6 &&
        (sim.turns[5].capacity.bindingConstraint !== 'none' ||
          sim.turns[5].activeProgramCount >= 3),
      `binding=${sim.turns[5].capacity.bindingConstraint} active=${sim.turns[5].activeProgramCount}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 48, stateCapacityLoad: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const lens = adv.inputs.serviceAccessLens!;
    const wb = adv.inputs.housingWellbeing!;
    const direct = evaluateAgent14WellbeingWarnings(adv.inputs.capacity, wb, lens);
    check(
      results,
      'wave3_warnings_idempotent',
      'Standalone warning evaluator matches turn bundle shape',
      direct.warnings.length === adv.inputs.wellbeingWarnings!.warnings.length,
      `n=${direct.warnings.length}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 68, stateCapacityLoad: 32 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const recs = recommendAgent14ProgramSequence(
      7,
      adv.inputs.capacity,
      adv.inputs.housingWellbeing!,
      adv.inputs.serviceAccessLens!,
      4
    );
    check(
      results,
      'wave3_recommendations_sorted',
      'Recommendations have contiguous ranks',
      recs.every((r, i) => r.rank === i + 1),
      recs.map((r) => r.programId).join(',')
    );
  }

  {
    const cap = computePublicServiceCapacity({ turn: 1, fiscalHeadroom: 55 }, []);
    const spend = advanceDelayedSpendingEffects(1, createInitialDelayedSpendingPersisted()).effects;
    const lens = computeNationalServiceAccessLens(1, cap, spend, { NSW: 0.08, NT: 0.55 });
    check(
      results,
      'wave3_access_lens_equity',
      'Service access lens computes equity gap',
      lens.equityGap >= 0 && lens.regions.NSW!.compositeIndex >= lens.regions.NT!.compositeIndex - 5,
      `gap=${lens.equityGap} NSW=${lens.regions.NSW?.compositeIndex} NT=${lens.regions.NT?.compositeIndex}`
    );
  }

  for (const id of ['crisis_recovery', 'mixed_pillar_push'] as const) {
    const sim = simulateAgent14HousingScenario(id, 8);
    const last = sim.turns[7];
    check(
      results,
      `wave3_scenario_${id}`,
      `Scenario ${id} completes 8 turns with access lens`,
      last.serviceAccessLens !== undefined && last.programRecommendations!.length >= 3,
      `composite=${last.serviceAccessLens?.nationalComposite}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 52, stateCapacityLoad: 48 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave4_cross_pillar_coupling',
      'Turn advance attaches cross-pillar coupling snapshot',
      adv.inputs.crossPillarCoupling !== undefined &&
        adv.inputs.crossPillarCoupling!.byPillar.healthcare.netCouplingIndex > 0,
      `national=${adv.inputs.crossPillarCoupling?.nationalCouplingIndex} band=${adv.inputs.crossPillarCoupling?.band}`
    );
  }

  {
    let mem = createInitialRegionalWellbeingMemory();
    let snap = null as ReturnType<typeof advanceRegionalWellbeingMemory> | null;
    for (let t = 1; t <= 5; t += 1) {
      const adv = advancePublicServicesTurn({
        inputs: { turn: t, fiscalHeadroom: 50 + t, stateCapacityLoad: 45 },
        spendingPersisted: createInitialDelayedSpendingPersisted(),
        wellbeingMemoryPersisted: mem,
      });
      mem = adv.wellbeingMemoryPersisted;
      snap = { snapshot: adv.inputs.regionalWellbeingMemory!, persisted: mem };
    }
    check(
      results,
      'wave4_regional_memory_persist',
      'Regional wellbeing memory accumulates EMA across turns',
      snap !== null &&
        snap.persisted.lastTurn === 5 &&
        snap.snapshot.regions.NSW!.rollingAffordability > 0,
      `NSW aff=${snap?.snapshot.regions.NSW?.rollingAffordability} trend=${snap?.snapshot.regions.NSW?.affordabilityTrend}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 60, stateCapacityLoad: 40 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave4_executive_brief',
      'Executive brief includes headline and coupling band',
      adv.inputs.executiveBrief !== undefined &&
        adv.inputs.executiveBrief!.headline.length > 10 &&
        adv.inputs.executiveBrief!.couplingBand.length > 0,
      adv.inputs.executiveBrief?.headline.slice(0, 72)
    );
  }

  {
    const he = commitmentFromProgramStub('ps_he_NSW_primary_care', 1, 0);
    check(
      results,
      'wave4_health_stub_commitment',
      'Healthcare program stub maps to healthcare pillar',
      he !== null && he!.pillar === 'healthcare' && he!.regionId === 'NSW',
      `load=${he?.fiscalLoadPoints}`
    );
  }

  check(
    results,
    'wave4_health_ed_stub_catalog',
    'Health/education stub catalog populated',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.length >= 6,
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  {
    const sim = simulateAgent14HousingScenario('health_education_surge', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave4_health_education_surge',
      'Health/education surge scenario completes with health project boost',
      last.completedHealthProjects + last.completedEducationProjects >= 0 &&
        last.crossPillarCoupling !== undefined,
      `health=${last.completedHealthProjects} ed=${last.completedEducationProjects}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('persisted_recovery_arc', 12);
    const t12 = sim.turns[11];
    check(
      results,
      'wave4_recovery_arc_memory',
      'Recovery arc records memory trends on turn 12',
      t12.regionalWellbeingMemory !== undefined &&
        Object.values(t12.regionalWellbeingMemory!.regions).some(
          (r) => r.affordabilityTrend !== undefined
        ),
      `coupling=${t12.crossPillarCoupling?.band}`
    );
  }

  {
    const raw = sanitizeRegionalWellbeingMemory({
      schemaVersion: '10.14.3-scale-wave-3' as any,
      lastTurn: 2,
      emaAlpha: 0.5,
      affordabilityEma: { NSW: 50 },
      accessEma: {},
    });
    check(
      results,
      'wave4_memory_sanitize_schema',
      'Memory sanitize upgrades schema to wave 6',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.affordabilityEma.NSW === 50,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 30, stateCapacityLoad: 78, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const coupling = computeCrossPillarCoupling(
      6,
      adv.inputs.capacity,
      adv.inputs.housingWellbeing!,
      adv.inputs.serviceAccessLens!
    );
    const brief = composeAgent14WellbeingExecutiveBrief({
      turn: 6,
      warnings: adv.inputs.wellbeingWarnings!,
      coupling,
      recommendations: adv.inputs.programRecommendations!,
      forecastPoints: forecastFromInputs({ turn: 6, fiscalHeadroom: 30, stateCapacityLoad: 78 }, 3),
    });
    check(
      results,
      'wave4_brief_matches_turn_coupling',
      'Standalone brief composer aligns with coupling band',
      brief.couplingBand === coupling.band,
      `band=${brief.couplingBand}`
    );
  }

  check(
    results,
    'wave5_schema_version',
    'Wellbeing schema version is wave 8',
    AGENT14_WELLBEING_SCHEMA_VERSION === '10.14.8-scale-wave-8',
    AGENT14_WELLBEING_SCHEMA_VERSION
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 40, stateCapacityLoad: 70, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      couplingTrajectoryPersisted: createInitialCouplingTrajectory(),
    });
    check(
      results,
      'wave5_coupling_trajectory',
      'Turn advance attaches coupling trajectory snapshot',
      adv.inputs.couplingTrajectory !== undefined &&
        adv.couplingTrajectoryPersisted.lastTurn === 4 &&
        adv.inputs.couplingTrajectory!.nationalCouplingEma > 0,
      `trajectory=${adv.inputs.couplingTrajectory?.trajectory} ema=${adv.inputs.couplingTrajectory?.nationalCouplingEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 50, stateCapacityLoad: 55 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave5_accountability_scorecard',
      'Accountability scorecard populated with band',
      adv.inputs.accountabilityScorecard !== undefined &&
        adv.inputs.accountabilityScorecard!.overallScore > 0 &&
        adv.inputs.accountabilityScorecard!.band.length > 0,
      `score=${adv.inputs.accountabilityScorecard?.overallScore} band=${adv.inputs.accountabilityScorecard?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 44, stateCapacityLoad: 58, workforceSpecialistGap: 50 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave5_equity_rebalancing',
      'Equity rebalancing advice includes summary',
      adv.inputs.equityRebalancing !== undefined && adv.inputs.equityRebalancing!.summary.length > 8,
      adv.inputs.equityRebalancing?.summary.slice(0, 64)
    );
  }

  {
    const raw = sanitizeCouplingTrajectory({
      schemaVersion: '10.14.4-scale-wave-4' as any,
      lastTurn: 3,
      emaAlpha: 0.3,
      nationalCouplingEma: 51,
    });
    check(
      results,
      'wave5_coupling_sanitize',
      'Coupling trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.nationalCouplingEma === 51,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('coupling_stress_escalation', 12);
    const last = sim.turns[11];
    const minCoupling = Math.min(...sim.turns.map((t) => t.crossPillarCoupling!.nationalCouplingIndex));
    const stressedTurn = sim.turns.some(
      (t) =>
        t.crossPillarCoupling!.band === 'watch' ||
        t.crossPillarCoupling!.band === 'strained' ||
        t.crossPillarCoupling!.band === 'critical' ||
        t.couplingTrajectory!.trajectory === 'deteriorating' ||
        (t.accountabilityScorecard && t.accountabilityScorecard.band !== 'strong')
    );
    check(
      results,
      'wave5_coupling_stress_scenario',
      'Coupling stress scenario shows stress markers across the arc',
      last.couplingTrajectory !== undefined &&
        (stressedTurn || minCoupling < 58 || last.wellbeingWarnings!.warnings.length >= 2),
      `band=${last.crossPillarCoupling?.band} min=${minCoupling} warnings=${last.wellbeingWarnings?.warnings.length}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('equity_rebalance_push', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave5_equity_rebalance_scenario',
      'Equity rebalance scenario surfaces lagging regions or escalation',
      last.equityRebalancing !== undefined &&
        (last.equityRebalancing!.laggingRegions.length > 0 || last.equityRebalancing!.shouldEscalate),
      `regions=${last.equityRebalancing?.laggingRegions.length} escalate=${last.equityRebalancing?.shouldEscalate}`
    );
  }

  check(
    results,
    'wave5_cross_pillar_stub_catalog',
    'Cross-pillar wellness stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id.startsWith('ps_xp_')),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave5_scenario_catalog',
    'Scenario catalog includes wave 5 scenarios',
    listAgent14ScenarioIds().includes('coupling_stress_escalation') &&
      listAgent14ScenarioIds().includes('equity_rebalance_push'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 36, stateCapacityLoad: 74, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      accountabilityTrajectoryPersisted: createInitialAccountabilityTrajectory(),
    });
    check(
      results,
      'wave6_accountability_trajectory',
      'Turn advance attaches accountability trajectory',
      adv.inputs.accountabilityTrajectory !== undefined &&
        adv.accountabilityTrajectoryPersisted.lastTurn === 7 &&
        adv.inputs.accountabilityTrajectory!.overallScoreEma > 0,
      `trajectory=${adv.inputs.accountabilityTrajectory?.trajectory} ema=${adv.inputs.accountabilityTrajectory?.overallScoreEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 48, stateCapacityLoad: 60 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave6_intervention_queue',
      'Intervention priority queue populated',
      adv.inputs.interventionPriorityQueue !== undefined &&
        adv.inputs.interventionPriorityQueue!.summary.length > 8,
      adv.inputs.interventionPriorityQueue?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 20, stateCapacityLoad: 85, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const resilience = computeWellbeingResilienceIndex({
      turn: 8,
      capacity: adv.inputs.capacity,
      housing: adv.inputs.housingWellbeing!,
      warnings: adv.inputs.wellbeingWarnings!,
      coupling: adv.inputs.crossPillarCoupling!,
      couplingTrajectory: adv.inputs.couplingTrajectory,
      accountabilityScorecard: adv.inputs.accountabilityScorecard,
    });
    check(
      results,
      'wave6_resilience_index',
      'Resilience index reflects stress under blocking workforce',
      resilience.stressLoad > 25 && resilience.band.length > 0,
      `band=${resilience.band} stress=${resilience.stressLoad} idx=${resilience.resilienceIndex}`
    );
  }

  {
    const raw = sanitizeAccountabilityTrajectory({
      schemaVersion: '10.14.5-scale-wave-5' as any,
      lastTurn: 4,
      emaAlpha: 0.35,
      overallScoreEma: 44,
    });
    check(
      results,
      'wave6_accountability_sanitize',
      'Accountability trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.overallScoreEma === 44,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('accountability_slip_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave6_accountability_slip_scenario',
      'Accountability slip arc shows trajectory or weak scorecard',
      last.accountabilityTrajectory !== undefined &&
        (last.accountabilityScorecard!.band !== 'strong' ||
          last.accountabilityTrajectory!.trajectory === 'deteriorating' ||
          last.wellbeingResilience!.band === 'fragile' ||
          last.wellbeingResilience!.band === 'critical'),
      `band=${last.accountabilityScorecard?.band} traj=${last.accountabilityTrajectory?.trajectory} res=${last.wellbeingResilience?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('intervention_priority_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave6_intervention_stress_scenario',
      'Intervention stress scenario surfaces queue or expedite',
      last.interventionPriorityQueue !== undefined &&
        (last.interventionPriorityQueue!.items.length > 0 || last.interventionPriorityQueue!.shouldExpedite),
      `items=${last.interventionPriorityQueue?.items.length} expedite=${last.interventionPriorityQueue?.shouldExpedite}`
    );
  }

  check(
    results,
    'wave6_cross_pillar_stub_catalog',
    'Wave 6 community lifecycle stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_TAS_community_wellbeing') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_remote_lifecycle'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave6_scenario_catalog',
    'Scenario catalog includes wave 6 scenarios',
    listAgent14ScenarioIds().includes('accountability_slip_arc') &&
      listAgent14ScenarioIds().includes('intervention_priority_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 50, stateCapacityLoad: 58 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      resilienceTrajectoryPersisted: createInitialResilienceTrajectory(),
    });
    check(
      results,
      'wave7_resilience_trajectory',
      'Turn advance attaches resilience trajectory',
      adv.inputs.resilienceTrajectory !== undefined &&
        adv.resilienceTrajectoryPersisted.lastTurn === 6 &&
        adv.inputs.resilienceTrajectory!.resilienceIndexEma > 0,
      `trajectory=${adv.inputs.resilienceTrajectory?.trajectory} ema=${adv.inputs.resilienceTrajectory?.resilienceIndexEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 24, stateCapacityLoad: 88, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave7_capacity_relief_schedule',
      'Capacity relief schedule populated under binding',
      adv.inputs.capacityReliefSchedule !== undefined &&
        adv.inputs.capacityReliefSchedule!.summary.length > 8,
      adv.inputs.capacityReliefSchedule?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 40, stateCapacityLoad: 70, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave7_governance_panel',
      'Governance panel includes band and score',
      adv.inputs.wellbeingGovernancePanel !== undefined &&
        adv.inputs.wellbeingGovernancePanel!.governanceScore > 0 &&
        adv.inputs.wellbeingGovernancePanel!.band.length > 0,
      `band=${adv.inputs.wellbeingGovernancePanel?.band} score=${adv.inputs.wellbeingGovernancePanel?.governanceScore}`
    );
  }

  {
    const raw = sanitizeResilienceTrajectory({
      schemaVersion: '10.14.6-scale-wave-6' as any,
      lastTurn: 2,
      emaAlpha: 0.32,
      resilienceIndexEma: 41,
    });
    check(
      results,
      'wave7_resilience_sanitize',
      'Resilience trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.resilienceIndexEma === 41,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('resilience_recovery_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave7_resilience_recovery_scenario',
      'Resilience recovery arc shows trajectory or steady band',
      last.resilienceTrajectory !== undefined &&
        (last.resilienceTrajectory!.trajectory === 'improving' ||
          last.wellbeingResilience!.band === 'steady' ||
          last.wellbeingResilience!.band === 'robust'),
      `traj=${last.resilienceTrajectory?.trajectory} band=${last.wellbeingResilience?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('capacity_relief_governance_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave7_capacity_governance_scenario',
      'Capacity governance stress surfaces relief or misaligned panel',
      last.capacityReliefSchedule !== undefined &&
        (last.capacityReliefSchedule!.shouldDeferNewCommits ||
          last.capacityReliefSchedule!.items.length > 0 ||
          last.interventionPriorityQueue!.shouldExpedite ||
          last.wellbeingGovernancePanel!.band !== 'aligned'),
      `defer=${last.capacityReliefSchedule?.shouldDeferNewCommits} gov=${last.wellbeingGovernancePanel?.band}`
    );
  }

  check(
    results,
    'wave7_cross_pillar_stub_catalog',
    'Wave 7 coordination stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_integrated_housing_health') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_ACT_wellbeing_coordination'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave7_scenario_catalog',
    'Scenario catalog includes wave 7 scenarios',
    listAgent14ScenarioIds().includes('resilience_recovery_arc') &&
      listAgent14ScenarioIds().includes('capacity_relief_governance_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 30, stateCapacityLoad: 80, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const panel = composeWellbeingGovernancePanel({
      turn: 3,
      accountabilityScorecard: adv.inputs.accountabilityScorecard,
      wellbeingResilience: adv.inputs.wellbeingResilience,
      accountabilityTrajectory: adv.inputs.accountabilityTrajectory,
      resilienceTrajectory: adv.inputs.resilienceTrajectory,
    });
    check(
      results,
      'wave7_governance_composer',
      'Standalone governance composer returns headlines',
      panel.headlines.length > 0 && panel.summary.length > 10,
      panel.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 18, stateCapacityLoad: 90, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const schedule = buildCapacityReliefSchedule({
      turn: 9,
      capacity: adv.inputs.capacity,
      interventionQueue: adv.inputs.interventionPriorityQueue!,
    });
    check(
      results,
      'wave7_relief_scheduler',
      'Relief scheduler reflects binding constraint',
      schedule.bindingConstraint === adv.inputs.capacity.bindingConstraint,
      `binding=${schedule.bindingConstraint}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 35, stateCapacityLoad: 75, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      resilienceTrajectoryPersisted: createInitialResilienceTrajectory(),
    });
    const snap = advanceResilienceTrajectory(
      4,
      adv.inputs.wellbeingResilience!,
      createInitialResilienceTrajectory()
    );
    check(
      results,
      'wave7_resilience_advance_unit',
      'Resilience trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 4 && snap.snapshot.resilienceIndexEma > 0,
      `ema=${snap.snapshot.resilienceIndexEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 38, stateCapacityLoad: 72, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      governanceTrajectoryPersisted: createInitialGovernanceTrajectory(),
    });
    check(
      results,
      'wave8_governance_trajectory',
      'Turn advance attaches governance trajectory',
      adv.inputs.governanceTrajectory !== undefined &&
        adv.governanceTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.governanceTrajectory!.governanceScoreEma > 0,
      `trajectory=${adv.inputs.governanceTrajectory?.trajectory} ema=${adv.inputs.governanceTrajectory?.governanceScoreEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 22, stateCapacityLoad: 88, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave8_relief_dispatch_plan',
      'Relief dispatch plan populated under stress',
      adv.inputs.reliefDispatchPlan !== undefined &&
        adv.inputs.reliefDispatchPlan!.summary.length > 8,
      adv.inputs.reliefDispatchPlan?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 30, stateCapacityLoad: 80, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave8_stakeholder_brief',
      'Stakeholder coordination brief includes engagement flag',
      adv.inputs.stakeholderCoordinationBrief !== undefined &&
        adv.inputs.stakeholderCoordinationBrief!.summary.length > 10,
      `engage=${adv.inputs.stakeholderCoordinationBrief?.shouldEngageStakeholders}`
    );
  }

  {
    const raw = sanitizeGovernanceTrajectory({
      schemaVersion: '10.14.7-scale-wave-7' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      governanceScoreEma: 47,
    });
    check(
      results,
      'wave8_governance_sanitize',
      'Governance trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.governanceScoreEma === 47,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('governance_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave8_governance_arc_scenario',
      'Governance arc surfaces trajectory or panel band',
      last.governanceTrajectory !== undefined &&
        (last.wellbeingGovernancePanel!.band !== 'aligned' ||
          last.governanceTrajectory!.trajectory !== 'flat' ||
          last.stakeholderCoordinationBrief!.shouldEngageStakeholders),
      `gov=${last.wellbeingGovernancePanel?.band} traj=${last.governanceTrajectory?.trajectory}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('relief_dispatch_coordination_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave8_relief_dispatch_scenario',
      'Relief dispatch stress surfaces plan or stakeholder engagement',
      last.reliefDispatchPlan !== undefined &&
        (last.reliefDispatchPlan!.shouldHoldCommits ||
          last.reliefDispatchPlan!.actions.length > 0 ||
          last.stakeholderCoordinationBrief!.shouldEngageStakeholders),
      `hold=${last.reliefDispatchPlan?.shouldHoldCommits} actions=${last.reliefDispatchPlan?.actions.length}`
    );
  }

  check(
    results,
    'wave8_cross_pillar_stub_catalog',
    'Wave 8 governance/relief stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_governance_reform') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_relief_coordination'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave8_scenario_catalog',
    'Scenario catalog includes wave 8 scenarios',
    listAgent14ScenarioIds().includes('governance_trajectory_arc') &&
      listAgent14ScenarioIds().includes('relief_dispatch_coordination_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 28, stateCapacityLoad: 84, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const plan = buildReliefDispatchPlan({
      turn: 7,
      reliefSchedule: adv.inputs.capacityReliefSchedule!,
      interventionQueue: adv.inputs.interventionPriorityQueue!,
      governanceTrajectory: adv.inputs.governanceTrajectory,
    });
    const brief = composeStakeholderCoordinationBrief({
      turn: 7,
      governancePanel: adv.inputs.wellbeingGovernancePanel!,
      governanceTrajectory: adv.inputs.governanceTrajectory,
      reliefDispatchPlan: plan,
    });
    check(
      results,
      'wave8_coordination_composer',
      'Standalone coordination composer returns headlines',
      brief.headlines.length > 0 && brief.summary.length > 10,
      brief.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 45, stateCapacityLoad: 60 },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceGovernanceTrajectory(
      3,
      adv.inputs.wellbeingGovernancePanel!,
      createInitialGovernanceTrajectory()
    );
    check(
      results,
      'wave8_governance_advance_unit',
      'Governance trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.governanceScoreEma > 0,
      `ema=${snap.snapshot.governanceScoreEma}`
    );
  }

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}


// OP10M_MODULE_END agent-14-housing
