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
