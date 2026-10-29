/** V10.14 Agent 14 — public service capacity & delayed spending (modular slice). */

export const AGENT14_WELLBEING_SCHEMA_VERSION = '10.14.55-scale-wave-55' as const;

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
  coordinationTrajectory?: CoordinationTrajectorySnapshot;
  reliefExecutionMonitor?: ReliefExecutionMonitor;
  portfolioStabilizationBrief?: PortfolioStabilizationBrief;
  stabilizationTrajectory?: StabilizationTrajectorySnapshot;
  reliefFulfillment?: ReliefFulfillmentSnapshot;
  wellbeingRecoveryReadinessBrief?: WellbeingRecoveryReadinessBrief;
  readinessTrajectory?: ReadinessTrajectorySnapshot;
  fulfillmentAgingMonitor?: FulfillmentAgingMonitor;
  portfolioResumptionPlan?: PortfolioResumptionPlan;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
  commitGatingAdvice?: CommitGatingAdvice;
  portfolioHandoffBrief?: PortfolioHandoffBrief;
  handoffTrajectory?: HandoffTrajectorySnapshot;
  gatedCommitSchedule?: GatedCommitSchedule;
  wellbeingIntegrationHandoffBrief?: WellbeingIntegrationHandoffBrief;
  integrationTrajectory?: IntegrationTrajectorySnapshot;
  scheduleReadinessMonitor?: ScheduleReadinessMonitor;
  nationalWireInReadinessBrief?: NationalWireInReadinessBrief;
  wireInTrajectory?: WireInTrajectorySnapshot;
  turnBoundaryActivationMonitor?: TurnBoundaryActivationMonitor;
  agent25AssemblyHandoffBrief?: Agent25AssemblyHandoffBrief;
  assemblyMergeTrajectory?: AssemblyMergeTrajectorySnapshot;
  chunkAnchorAlignmentMonitor?: ChunkAnchorAlignmentMonitor;
  agent25InlineReadinessBrief?: Agent25InlineReadinessBrief;
  inlineMergeTrajectory?: InlineMergeTrajectorySnapshot;
  inlineActivationMonitor?: InlineActivationMonitor;
  agent25Wave17ProjectionHandoffBrief?: Agent25Wave17ProjectionHandoffBrief;
  projectionGateTrajectory?: ProjectionGateTrajectorySnapshot;
  wave18ProjectionMonitor?: Wave18ProjectionMonitor;
  agent25Wave18ProjectionHandoffBrief?: Agent25Wave18ProjectionHandoffBrief;
  wave19GateTrajectory?: Wave19GateTrajectorySnapshot;
  wave19IntegrationMonitor?: Wave19IntegrationMonitor;
  agent25Wave19ProjectionHandoffBrief?: Agent25Wave19ProjectionHandoffBrief;
  wave20GateTrajectory?: Wave20GateTrajectorySnapshot;
  wave20IntegrationMonitor?: Wave20IntegrationMonitor;
  agent25Wave20ProjectionHandoffBrief?: Agent25Wave20ProjectionHandoffBrief;
  wave21GateTrajectory?: Wave21GateTrajectorySnapshot;
  wave21IntegrationMonitor?: Wave21IntegrationMonitor;
  agent25Wave21ProjectionHandoffBrief?: Agent25Wave21ProjectionHandoffBrief;
  wave22GateTrajectory?: Wave22GateTrajectorySnapshot;
  wave22IntegrationMonitor?: Wave22IntegrationMonitor;
  agent25Wave22ProjectionHandoffBrief?: Agent25Wave22ProjectionHandoffBrief;
  wave23GateTrajectory?: Wave23GateTrajectorySnapshot;
  wave23IntegrationMonitor?: Wave23IntegrationMonitor;
  agent25Wave23ProjectionHandoffBrief?: Agent25Wave23ProjectionHandoffBrief;
  wave24GateTrajectory?: Wave24GateTrajectorySnapshot;
  wave24IntegrationMonitor?: Wave24IntegrationMonitor;
  agent25Wave24ProjectionHandoffBrief?: Agent25Wave24ProjectionHandoffBrief;
  wave25GateTrajectory?: Wave25GateTrajectorySnapshot;
  wave25IntegrationMonitor?: Wave25IntegrationMonitor;
  agent25Wave25ProjectionHandoffBrief?: Agent25Wave25ProjectionHandoffBrief;
  wave26GateTrajectory?: Wave26GateTrajectorySnapshot;
  wave26IntegrationMonitor?: Wave26IntegrationMonitor;
  agent25Wave26ProjectionHandoffBrief?: Agent25Wave26ProjectionHandoffBrief;
  wave27GateTrajectory?: Wave27GateTrajectorySnapshot;
  wave27IntegrationMonitor?: Wave27IntegrationMonitor;
  agent25Wave27ProjectionHandoffBrief?: Agent25Wave27ProjectionHandoffBrief;
  wave28GateTrajectory?: Wave28GateTrajectorySnapshot;
  wave28IntegrationMonitor?: Wave28IntegrationMonitor;
  agent25Wave28ProjectionHandoffBrief?: Agent25Wave28ProjectionHandoffBrief;
  wave29GateTrajectory?: Wave29GateTrajectorySnapshot;
  wave29IntegrationMonitor?: Wave29IntegrationMonitor;
  agent25Wave29ProjectionHandoffBrief?: Agent25Wave29ProjectionHandoffBrief;
  wave30GateTrajectory?: Wave30GateTrajectorySnapshot;
  wave30IntegrationMonitor?: Wave30IntegrationMonitor;
  agent25Wave30ProjectionHandoffBrief?: Agent25Wave30ProjectionHandoffBrief;
  wave31GateTrajectory?: Wave31GateTrajectorySnapshot;
  wave31IntegrationMonitor?: Wave31IntegrationMonitor;
  agent25Wave31ProjectionHandoffBrief?: Agent25Wave31ProjectionHandoffBrief;
  wave32GateTrajectory?: Wave32GateTrajectorySnapshot;
  wave32IntegrationMonitor?: Wave32IntegrationMonitor;
  agent25Wave32ProjectionHandoffBrief?: Agent25Wave32ProjectionHandoffBrief;
  wave33GateTrajectory?: Wave33GateTrajectorySnapshot;
  wave33IntegrationMonitor?: Wave33IntegrationMonitor;
  agent25Wave33ProjectionHandoffBrief?: Agent25Wave33ProjectionHandoffBrief;
  wave34GateTrajectory?: Wave34GateTrajectorySnapshot;
  wave34IntegrationMonitor?: Wave34IntegrationMonitor;
  agent25Wave34ProjectionHandoffBrief?: Agent25Wave34ProjectionHandoffBrief;
  wave35GateTrajectory?: Wave35GateTrajectorySnapshot;
  wave35IntegrationMonitor?: Wave35IntegrationMonitor;
  agent25Wave35ProjectionHandoffBrief?: Agent25Wave35ProjectionHandoffBrief;
  wave36GateTrajectory?: Wave36GateTrajectorySnapshot;
  wave36IntegrationMonitor?: Wave36IntegrationMonitor;
  agent25Wave36ProjectionHandoffBrief?: Agent25Wave36ProjectionHandoffBrief;
  wave37GateTrajectory?: Wave37GateTrajectorySnapshot;
  wave37IntegrationMonitor?: Wave37IntegrationMonitor;
  agent25Wave37ProjectionHandoffBrief?: Agent25Wave37ProjectionHandoffBrief;
  wave38GateTrajectory?: Wave38GateTrajectorySnapshot;
  wave38IntegrationMonitor?: Wave38IntegrationMonitor;
  agent25Wave38ProjectionHandoffBrief?: Agent25Wave38ProjectionHandoffBrief;
  wave39GateTrajectory?: Wave39GateTrajectorySnapshot;
  wave39IntegrationMonitor?: Wave39IntegrationMonitor;
  agent25Wave39ProjectionHandoffBrief?: Agent25Wave39ProjectionHandoffBrief;
  wave40GateTrajectory?: Wave40GateTrajectorySnapshot;
  wave40IntegrationMonitor?: Wave40IntegrationMonitor;
  agent25Wave40ProjectionHandoffBrief?: Agent25Wave40ProjectionHandoffBrief;
  wave41GateTrajectory?: Wave41GateTrajectorySnapshot;
  wave41IntegrationMonitor?: Wave41IntegrationMonitor;
  agent25Wave41ProjectionHandoffBrief?: Agent25Wave41ProjectionHandoffBrief;
  wave42GateTrajectory?: Wave42GateTrajectorySnapshot;
  wave42IntegrationMonitor?: Wave42IntegrationMonitor;
  agent25Wave42ProjectionHandoffBrief?: Agent25Wave42ProjectionHandoffBrief;
  wave43GateTrajectory?: Wave43GateTrajectorySnapshot;
  wave43IntegrationMonitor?: Wave43IntegrationMonitor;
  agent25Wave43ProjectionHandoffBrief?: Agent25Wave43ProjectionHandoffBrief;
  wave44GateTrajectory?: Wave44GateTrajectorySnapshot;
  wave44IntegrationMonitor?: Wave44IntegrationMonitor;
  agent25Wave44ProjectionHandoffBrief?: Agent25Wave44ProjectionHandoffBrief;
  wave45GateTrajectory?: Wave45GateTrajectorySnapshot;
  wave45IntegrationMonitor?: Wave45IntegrationMonitor;
  agent25Wave45ProjectionHandoffBrief?: Agent25Wave45ProjectionHandoffBrief;
  wave46GateTrajectory?: Wave46GateTrajectorySnapshot;
  wave46IntegrationMonitor?: Wave46IntegrationMonitor;
  agent25Wave46ProjectionHandoffBrief?: Agent25Wave46ProjectionHandoffBrief;
  wave47GateTrajectory?: Wave47GateTrajectorySnapshot;
  wave47IntegrationMonitor?: Wave47IntegrationMonitor;
  agent25Wave47ProjectionHandoffBrief?: Agent25Wave47ProjectionHandoffBrief;
  wave48GateTrajectory?: Wave48GateTrajectorySnapshot;
  wave48IntegrationMonitor?: Wave48IntegrationMonitor;
  agent25Wave48ProjectionHandoffBrief?: Agent25Wave48ProjectionHandoffBrief;
  wave49GateTrajectory?: Wave49GateTrajectorySnapshot;
  wave49IntegrationMonitor?: Wave49IntegrationMonitor;
  agent25Wave49ProjectionHandoffBrief?: Agent25Wave49ProjectionHandoffBrief;
  wave50GateTrajectory?: Wave50GateTrajectorySnapshot;
  wave50IntegrationMonitor?: Wave50IntegrationMonitor;
  agent25Wave50ProjectionHandoffBrief?: Agent25Wave50ProjectionHandoffBrief;
  wave51GateTrajectory?: Wave51GateTrajectorySnapshot;
  wave51IntegrationMonitor?: Wave51IntegrationMonitor;
  agent25Wave51ProjectionHandoffBrief?: Agent25Wave51ProjectionHandoffBrief;
  wave52GateTrajectory?: Wave52GateTrajectorySnapshot;
  wave52IntegrationMonitor?: Wave52IntegrationMonitor;
  agent25Wave52ProjectionHandoffBrief?: Agent25Wave52ProjectionHandoffBrief;
  wave53GateTrajectory?: Wave53GateTrajectorySnapshot;
  wave53IntegrationMonitor?: Wave53IntegrationMonitor;
  agent25Wave53ProjectionHandoffBrief?: Agent25Wave53ProjectionHandoffBrief;
  wave54GateTrajectory?: Wave54GateTrajectorySnapshot;
  wave54IntegrationMonitor?: Wave54IntegrationMonitor;
  agent25Wave54ProjectionHandoffBrief?: Agent25Wave54ProjectionHandoffBrief;
  wave55GateTrajectory?: Wave55GateTrajectorySnapshot;
  wave55IntegrationMonitor?: Wave55IntegrationMonitor;
  agent25Wave55ProjectionHandoffBrief?: Agent25Wave55ProjectionHandoffBrief;
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

export type CoordinationEngagementBand = 'routine' | 'elevated' | 'escalation';

export interface CoordinationTrajectorySnapshot {
  turn: number;
  engagementPressureEma: number;
  instantaneousPressure: number;
  band: CoordinationEngagementBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface CoordinationTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  engagementPressureEma: number;
  priorEma?: number;
}

export interface ReliefExecutionMonitor {
  turn: number;
  immediateDue: number;
  deferredCount: number;
  holdCount: number;
  backlogPressure: number;
  shouldEscalateExecution: boolean;
  summary: string;
}

export type PortfolioStabilizationPath = 'clear' | 'watch' | 'blocked';

export interface PortfolioStabilizationBrief {
  turn: number;
  stabilizationPath: PortfolioStabilizationPath;
  shouldPausePortfolioGrowth: boolean;
  headlines: string[];
  summary: string;
}

export type StabilizationStressBand = 'recovering' | 'constrained' | 'stressed';

export interface StabilizationTrajectorySnapshot {
  turn: number;
  stabilizationStressEma: number;
  instantaneousStress: number;
  band: StabilizationStressBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface StabilizationTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  stabilizationStressEma: number;
  priorEma?: number;
}

export interface ReliefFulfillmentOpenAction {
  actionKey: string;
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  priority: ReliefDispatchPriority;
  targetTurn: number;
}

export interface ReliefFulfillmentPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  openActions: ReliefFulfillmentOpenAction[];
  cumulativeFulfilled: number;
}

export interface ReliefFulfillmentSnapshot {
  turn: number;
  openCount: number;
  fulfilledThisTurn: number;
  fulfillmentRatio: number;
  shouldClearBacklog: boolean;
  summary: string;
}

export type WellbeingRecoveryReadinessBand = 'ready' | 'partial' | 'not_ready';

export interface WellbeingRecoveryReadinessBrief {
  turn: number;
  readinessBand: WellbeingRecoveryReadinessBand;
  shouldResumePortfolioGrowth: boolean;
  headlines: string[];
  summary: string;
}

export type ReadinessGapBand = 'narrow' | 'moderate' | 'wide';

export interface ReadinessTrajectorySnapshot {
  turn: number;
  readinessGapEma: number;
  instantaneousGap: number;
  band: ReadinessGapBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface ReadinessTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  readinessGapEma: number;
  priorEma?: number;
}

export interface FulfillmentAgingMonitor {
  turn: number;
  openCount: number;
  overdueCount: number;
  averageAgeTurns: number;
  maxAgeTurns: number;
  shouldExpediteAging: boolean;
  summary: string;
}

export interface PortfolioResumptionAction {
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  priority: number;
  rationale: string;
}

export interface PortfolioResumptionPlan {
  turn: number;
  shouldHoldNewCommits: boolean;
  recommendedResumeTurn: number;
  actions: PortfolioResumptionAction[];
  summary: string;
}

export type ResumptionFrictionBand = 'low' | 'moderate' | 'high';

export interface ResumptionTrajectorySnapshot {
  turn: number;
  resumptionFrictionEma: number;
  instantaneousFriction: number;
  band: ResumptionFrictionBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface ResumptionTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  resumptionFrictionEma: number;
  priorEma?: number;
}

export interface CommitGatingAdvice {
  turn: number;
  shouldBlockAllCommits: boolean;
  allowedNewCommits: number;
  rejectedCommitmentsCount: number;
  bindingConstraint: CapacityBindingConstraint;
  reasons: string[];
  summary: string;
}

export interface PortfolioHandoffBrief {
  turn: number;
  shouldSignalHandoff: boolean;
  queuedResumptionActions: number;
  allowedNewCommits: number;
  headlines: string[];
  summary: string;
}

export type HandoffReadinessBand = 'ready' | 'pending' | 'blocked';

export interface HandoffTrajectorySnapshot {
  turn: number;
  handoffReadinessEma: number;
  instantaneousReadiness: number;
  band: HandoffReadinessBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface HandoffTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  handoffReadinessEma: number;
  priorEma?: number;
}

export type GatedCommitSource = 'resumption' | 'sequencing';

export interface GatedCommitScheduleItem {
  programId: string;
  regionId: string;
  pillar: PublicServicePillar;
  targetTurn: number;
  source: GatedCommitSource;
  rationale: string;
}

export interface GatedCommitSchedule {
  turn: number;
  deferUntilTurn: number;
  shouldDeferAll: boolean;
  items: GatedCommitScheduleItem[];
  summary: string;
}

export interface WellbeingIntegrationHandoffBrief {
  turn: number;
  shouldPublishIntegration: boolean;
  scheduledCommitCount: number;
  deferUntilTurn: number;
  headlines: string[];
  summary: string;
}

export type IntegrationPublishBand = 'publish' | 'watch' | 'hold';

export interface IntegrationTrajectorySnapshot {
  turn: number;
  integrationReadinessEma: number;
  instantaneousReadiness: number;
  band: IntegrationPublishBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface IntegrationTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  integrationReadinessEma: number;
  priorEma?: number;
}

export interface ScheduleReadinessMonitor {
  turn: number;
  dueThisTurn: number;
  futureItems: number;
  overdueCount: number;
  readinessRatio: number;
  shouldExpediteSchedule: boolean;
  summary: string;
}

export interface NationalWireInReadinessBrief {
  turn: number;
  shouldWireNationalTurn: boolean;
  dueCommitCount: number;
  headlines: string[];
  summary: string;
}

export type WireInActivationBand = 'active' | 'pending' | 'blocked';

export interface WireInTrajectorySnapshot {
  turn: number;
  wireInActivationEma: number;
  instantaneousActivation: number;
  band: WireInActivationBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface WireInTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wireInActivationEma: number;
  priorEma?: number;
}

export interface TurnBoundaryActivationMonitor {
  turn: number;
  shouldActivateTurnBoundary: boolean;
  dueCommitCount: number;
  deliveryCapacityIndex: number;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25AssemblyHandoffBrief {
  turn: number;
  shouldHandoffChunk: boolean;
  shouldActivateTurnBoundary: boolean;
  headlines: string[];
  summary: string;
}

export type AssemblyMergeBand = 'ready' | 'pending' | 'blocked';

export interface AssemblyMergeTrajectorySnapshot {
  turn: number;
  assemblyMergeEma: number;
  instantaneousMerge: number;
  band: AssemblyMergeBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface AssemblyMergeTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  assemblyMergeEma: number;
  priorEma?: number;
}

export interface ChunkAnchorAlignmentMonitor {
  turn: number;
  anchorAligned: boolean;
  trajectoryCoverage: number;
  requiredTrajectoryCount: number;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25InlineReadinessBrief {
  turn: number;
  shouldInlineChunk: boolean;
  anchorAligned: boolean;
  headlines: string[];
  summary: string;
}

export type InlineMergeBand = 'ready' | 'pending' | 'blocked';

export interface InlineMergeTrajectorySnapshot {
  turn: number;
  inlineMergeEma: number;
  instantaneousInline: number;
  band: InlineMergeBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface InlineMergeTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  inlineMergeEma: number;
  priorEma?: number;
}

export interface InlineActivationMonitor {
  turn: number;
  shouldActivateInline: boolean;
  inlineMergeBand: InlineMergeBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave17ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave17: boolean;
  shouldActivateInline: boolean;
  headlines: string[];
  summary: string;
}

export type ProjectionGateBand = 'ready' | 'pending' | 'blocked';

export interface ProjectionGateTrajectorySnapshot {
  turn: number;
  projectionGateEma: number;
  instantaneousGate: number;
  band: ProjectionGateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface ProjectionGateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  projectionGateEma: number;
  priorEma?: number;
}

export interface Wave18ProjectionMonitor {
  turn: number;
  shouldRunO10m167DryRun: boolean;
  projectionGateBand: ProjectionGateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave18ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave18: boolean;
  shouldRunO10m167DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave19GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave19GateTrajectorySnapshot {
  turn: number;
  wave19GateEma: number;
  instantaneousGate: number;
  band: Wave19GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave19GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave19GateEma: number;
  priorEma?: number;
}

export interface Wave19IntegrationMonitor {
  turn: number;
  shouldRunO10m169DryRun: boolean;
  wave19GateBand: Wave19GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave19ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave19: boolean;
  shouldRunO10m169DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave20GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave20GateTrajectorySnapshot {
  turn: number;
  wave20GateEma: number;
  instantaneousGate: number;
  band: Wave20GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave20GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave20GateEma: number;
  priorEma?: number;
}

export interface Wave20IntegrationMonitor {
  turn: number;
  shouldRunO10m171DryRun: boolean;
  wave20GateBand: Wave20GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave20ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave20: boolean;
  shouldRunO10m171DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave21GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave21GateTrajectorySnapshot {
  turn: number;
  wave21GateEma: number;
  instantaneousGate: number;
  band: Wave21GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave21GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave21GateEma: number;
  priorEma?: number;
}

export interface Wave21IntegrationMonitor {
  turn: number;
  shouldRunO10m174DryRun: boolean;
  wave21GateBand: Wave21GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave21ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave21: boolean;
  shouldRunO10m174DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave22GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave22GateTrajectorySnapshot {
  turn: number;
  wave22GateEma: number;
  instantaneousGate: number;
  band: Wave22GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave22GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave22GateEma: number;
  priorEma?: number;
}

export interface Wave22IntegrationMonitor {
  turn: number;
  shouldRunO10m176DryRun: boolean;
  wave22GateBand: Wave22GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave22ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave22: boolean;
  shouldRunO10m176DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave23GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave23GateTrajectorySnapshot {
  turn: number;
  wave23GateEma: number;
  instantaneousGate: number;
  band: Wave23GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave23GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave23GateEma: number;
  priorEma?: number;
}

export interface Wave23IntegrationMonitor {
  turn: number;
  shouldRunO10m178DryRun: boolean;
  wave23GateBand: Wave23GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave23ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave23: boolean;
  shouldRunO10m178DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave24GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave24GateTrajectorySnapshot {
  turn: number;
  wave24GateEma: number;
  instantaneousGate: number;
  band: Wave24GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave24GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave24GateEma: number;
  priorEma?: number;
}

export interface Wave24IntegrationMonitor {
  turn: number;
  shouldRunO10m180DryRun: boolean;
  wave24GateBand: Wave24GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave24ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave24: boolean;
  shouldRunO10m180DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave25GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave25GateTrajectorySnapshot {
  turn: number;
  wave25GateEma: number;
  instantaneousGate: number;
  band: Wave25GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave25GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave25GateEma: number;
  priorEma?: number;
}

export interface Wave25IntegrationMonitor {
  turn: number;
  shouldRunO10m182DryRun: boolean;
  wave25GateBand: Wave25GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave25ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave25: boolean;
  shouldRunO10m182DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave26GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave26GateTrajectorySnapshot {
  turn: number;
  wave26GateEma: number;
  instantaneousGate: number;
  band: Wave26GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave26GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave26GateEma: number;
  priorEma?: number;
}

export interface Wave26IntegrationMonitor {
  turn: number;
  shouldRunO10m184DryRun: boolean;
  wave26GateBand: Wave26GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave26ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave26: boolean;
  shouldRunO10m184DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave27GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave27GateTrajectorySnapshot {
  turn: number;
  wave27GateEma: number;
  instantaneousGate: number;
  band: Wave27GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave27GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave27GateEma: number;
  priorEma?: number;
}

export interface Wave27IntegrationMonitor {
  turn: number;
  shouldRunO10m186DryRun: boolean;
  wave27GateBand: Wave27GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave27ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave27: boolean;
  shouldRunO10m186DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave28GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave28GateTrajectorySnapshot {
  turn: number;
  wave28GateEma: number;
  instantaneousGate: number;
  band: Wave28GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave28GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave28GateEma: number;
  priorEma?: number;
}

export interface Wave28IntegrationMonitor {
  turn: number;
  shouldRunO10m188DryRun: boolean;
  wave28GateBand: Wave28GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave28ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave28: boolean;
  shouldRunO10m188DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave29GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave29GateTrajectorySnapshot {
  turn: number;
  wave29GateEma: number;
  instantaneousGate: number;
  band: Wave29GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave29GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave29GateEma: number;
  priorEma?: number;
}

export interface Wave29IntegrationMonitor {
  turn: number;
  shouldRunO10m190DryRun: boolean;
  wave29GateBand: Wave29GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave29ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave29: boolean;
  shouldRunO10m190DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave30GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave30GateTrajectorySnapshot {
  turn: number;
  wave30GateEma: number;
  instantaneousGate: number;
  band: Wave30GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave30GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave30GateEma: number;
  priorEma?: number;
}

export interface Wave30IntegrationMonitor {
  turn: number;
  shouldRunO10m192DryRun: boolean;
  wave30GateBand: Wave30GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave30ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave30: boolean;
  shouldRunO10m192DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave31GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave31GateTrajectorySnapshot {
  turn: number;
  wave31GateEma: number;
  instantaneousGate: number;
  band: Wave31GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave31GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave31GateEma: number;
  priorEma?: number;
}

export interface Wave31IntegrationMonitor {
  turn: number;
  shouldRunO10m194DryRun: boolean;
  wave31GateBand: Wave31GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave31ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave31: boolean;
  shouldRunO10m194DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave32GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave32GateTrajectorySnapshot {
  turn: number;
  wave32GateEma: number;
  instantaneousGate: number;
  band: Wave32GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave32GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave32GateEma: number;
  priorEma?: number;
}

export interface Wave32IntegrationMonitor {
  turn: number;
  shouldRunO10m196DryRun: boolean;
  wave32GateBand: Wave32GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave32ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave32: boolean;
  shouldRunO10m196DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave33GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave33GateTrajectorySnapshot {
  turn: number;
  wave33GateEma: number;
  instantaneousGate: number;
  band: Wave33GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave33GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave33GateEma: number;
  priorEma?: number;
}

export interface Wave33IntegrationMonitor {
  turn: number;
  shouldRunO10m198DryRun: boolean;
  wave33GateBand: Wave33GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave33ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave33: boolean;
  shouldRunO10m198DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave34GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave34GateTrajectorySnapshot {
  turn: number;
  wave34GateEma: number;
  instantaneousGate: number;
  band: Wave34GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave34GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave34GateEma: number;
  priorEma?: number;
}

export interface Wave34IntegrationMonitor {
  turn: number;
  shouldRunO10m200DryRun: boolean;
  wave34GateBand: Wave34GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave34ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave34: boolean;
  shouldRunO10m200DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave35GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave35GateTrajectorySnapshot {
  turn: number;
  wave35GateEma: number;
  instantaneousGate: number;
  band: Wave35GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave35GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave35GateEma: number;
  priorEma?: number;
}

export interface Wave35IntegrationMonitor {
  turn: number;
  shouldRunO10m202DryRun: boolean;
  wave35GateBand: Wave35GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave35ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave35: boolean;
  shouldRunO10m202DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave36GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave36GateTrajectorySnapshot {
  turn: number;
  wave36GateEma: number;
  instantaneousGate: number;
  band: Wave36GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave36GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave36GateEma: number;
  priorEma?: number;
}

export interface Wave36IntegrationMonitor {
  turn: number;
  shouldRunO10m204DryRun: boolean;
  wave36GateBand: Wave36GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave36ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave36: boolean;
  shouldRunO10m204DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave37GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave37GateTrajectorySnapshot {
  turn: number;
  wave37GateEma: number;
  instantaneousGate: number;
  band: Wave37GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave37GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave37GateEma: number;
  priorEma?: number;
}

export interface Wave37IntegrationMonitor {
  turn: number;
  shouldRunO10m206DryRun: boolean;
  wave37GateBand: Wave37GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave37ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave37: boolean;
  shouldRunO10m206DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave38GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave38GateTrajectorySnapshot {
  turn: number;
  wave38GateEma: number;
  instantaneousGate: number;
  band: Wave38GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave38GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave38GateEma: number;
  priorEma?: number;
}

export interface Wave38IntegrationMonitor {
  turn: number;
  shouldRunO10m208DryRun: boolean;
  wave38GateBand: Wave38GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave38ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave38: boolean;
  shouldRunO10m208DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave39GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave39GateTrajectorySnapshot {
  turn: number;
  wave39GateEma: number;
  instantaneousGate: number;
  band: Wave39GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave39GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave39GateEma: number;
  priorEma?: number;
}

export interface Wave39IntegrationMonitor {
  turn: number;
  shouldRunO10m210DryRun: boolean;
  wave39GateBand: Wave39GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave39ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave39: boolean;
  shouldRunO10m210DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave40GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave40GateTrajectorySnapshot {
  turn: number;
  wave40GateEma: number;
  instantaneousGate: number;
  band: Wave40GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave40GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave40GateEma: number;
  priorEma?: number;
}

export interface Wave40IntegrationMonitor {
  turn: number;
  shouldRunO10m212DryRun: boolean;
  wave40GateBand: Wave40GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave40ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave40: boolean;
  shouldRunO10m212DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave41GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave41GateTrajectorySnapshot {
  turn: number;
  wave41GateEma: number;
  instantaneousGate: number;
  band: Wave41GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave41GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave41GateEma: number;
  priorEma?: number;
}

export interface Wave41IntegrationMonitor {
  turn: number;
  shouldRunO10m214DryRun: boolean;
  wave41GateBand: Wave41GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave41ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave41: boolean;
  shouldRunO10m214DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave42GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave42GateTrajectorySnapshot {
  turn: number;
  wave42GateEma: number;
  instantaneousGate: number;
  band: Wave42GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave42GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave42GateEma: number;
  priorEma?: number;
}

export interface Wave42IntegrationMonitor {
  turn: number;
  shouldRunO10m216DryRun: boolean;
  wave42GateBand: Wave42GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave42ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave42: boolean;
  shouldRunO10m216DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave43GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave43GateTrajectorySnapshot {
  turn: number;
  wave43GateEma: number;
  instantaneousGate: number;
  band: Wave43GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave43GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave43GateEma: number;
  priorEma?: number;
}

export interface Wave43IntegrationMonitor {
  turn: number;
  shouldRunO10m218DryRun: boolean;
  wave43GateBand: Wave43GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave43ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave43: boolean;
  shouldRunO10m218DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave44GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave44GateTrajectorySnapshot {
  turn: number;
  wave44GateEma: number;
  instantaneousGate: number;
  band: Wave44GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave44GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave44GateEma: number;
  priorEma?: number;
}

export interface Wave44IntegrationMonitor {
  turn: number;
  shouldRunO10m220DryRun: boolean;
  wave44GateBand: Wave44GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave44ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave44: boolean;
  shouldRunO10m220DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave45GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave45GateTrajectorySnapshot {
  turn: number;
  wave45GateEma: number;
  instantaneousGate: number;
  band: Wave45GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave45GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave45GateEma: number;
  priorEma?: number;
}

export interface Wave45IntegrationMonitor {
  turn: number;
  shouldRunO10m222DryRun: boolean;
  wave45GateBand: Wave45GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave45ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave45: boolean;
  shouldRunO10m222DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave46GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave46GateTrajectorySnapshot {
  turn: number;
  wave46GateEma: number;
  instantaneousGate: number;
  band: Wave46GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave46GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave46GateEma: number;
  priorEma?: number;
}

export interface Wave46IntegrationMonitor {
  turn: number;
  shouldRunO10m224DryRun: boolean;
  wave46GateBand: Wave46GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave46ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave46: boolean;
  shouldRunO10m224DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave47GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave47GateTrajectorySnapshot {
  turn: number;
  wave47GateEma: number;
  instantaneousGate: number;
  band: Wave47GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave47GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave47GateEma: number;
  priorEma?: number;
}

export interface Wave47IntegrationMonitor {
  turn: number;
  shouldRunO10m225DryRun: boolean;
  wave47GateBand: Wave47GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave47ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave47: boolean;
  shouldRunO10m225DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave48GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave48GateTrajectorySnapshot {
  turn: number;
  wave48GateEma: number;
  instantaneousGate: number;
  band: Wave48GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave48GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave48GateEma: number;
  priorEma?: number;
}

export interface Wave48IntegrationMonitor {
  turn: number;
  shouldRunO10m226DryRun: boolean;
  wave48GateBand: Wave48GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave48ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave48: boolean;
  shouldRunO10m226DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave49GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave49GateTrajectorySnapshot {
  turn: number;
  wave49GateEma: number;
  instantaneousGate: number;
  band: Wave49GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave49GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave49GateEma: number;
  priorEma?: number;
}

export interface Wave49IntegrationMonitor {
  turn: number;
  shouldRunO10m227DryRun: boolean;
  wave49GateBand: Wave49GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave49ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave49: boolean;
  shouldRunO10m227DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave50GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave50GateTrajectorySnapshot {
  turn: number;
  wave50GateEma: number;
  instantaneousGate: number;
  band: Wave50GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave50GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave50GateEma: number;
  priorEma?: number;
}

export interface Wave50IntegrationMonitor {
  turn: number;
  shouldRunO10m229DryRun: boolean;
  wave50GateBand: Wave50GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave50ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave50: boolean;
  shouldRunO10m229DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave51GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave51GateTrajectorySnapshot {
  turn: number;
  wave51GateEma: number;
  instantaneousGate: number;
  band: Wave51GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave51GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave51GateEma: number;
  priorEma?: number;
}

export interface Wave51IntegrationMonitor {
  turn: number;
  shouldRunO10m231DryRun: boolean;
  wave51GateBand: Wave51GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave51ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave51: boolean;
  shouldRunO10m231DryRun: boolean;
  headlines: string[];
  summary: string;
}


export type Wave52GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave52GateTrajectorySnapshot {
  turn: number;
  wave52GateEma: number;
  instantaneousGate: number;
  band: Wave52GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave52GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave52GateEma: number;
  priorEma?: number;
}

export interface Wave52IntegrationMonitor {
  turn: number;
  shouldRunO10m233DryRun: boolean;
  wave52GateBand: Wave52GateBand;
  blockingReasons: string[];
  summary: string;
}



export type Wave53GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave53GateTrajectorySnapshot {
  turn: number;
  wave53GateEma: number;
  instantaneousGate: number;
  band: Wave53GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave53GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave53GateEma: number;
  priorEma?: number;
}

export interface Wave53IntegrationMonitor {
  turn: number;
  shouldRunO10m237DryRun: boolean;
  wave53GateBand: Wave53GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave53ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave53: boolean;
  shouldRunO10m237DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave54GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave54GateTrajectorySnapshot {
  turn: number;
  wave54GateEma: number;
  instantaneousGate: number;
  band: Wave54GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave54GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave54GateEma: number;
  priorEma?: number;
}

export interface Wave54IntegrationMonitor {
  turn: number;
  shouldRunO10m240DryRun: boolean;
  wave54GateBand: Wave54GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave54ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave54: boolean;
  shouldRunO10m240DryRun: boolean;
  headlines: string[];
  summary: string;
}


export type Wave55GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave55GateTrajectorySnapshot {
  turn: number;
  wave55GateEma: number;
  instantaneousGate: number;
  band: Wave55GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave55GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave55GateEma: number;
  priorEma?: number;
}

export interface Wave55IntegrationMonitor {
  turn: number;
  shouldRunO10m247DryRun: boolean;
  wave55GateBand: Wave55GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave55ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave55: boolean;
  shouldRunO10m247DryRun: boolean;
  headlines: string[];
  summary: string;
}

export type Wave56GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave56GateTrajectorySnapshot {
  turn: number;
  wave56GateEma: number;
  instantaneousGate: number;
  band: Wave56GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave56GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave56GateEma: number;
  priorEma?: number;
}

export interface Wave56IntegrationMonitor {
  turn: number;
  shouldRunO10m254DryRun: boolean;
  wave56GateBand: Wave56GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave56ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave56: boolean;
  shouldRunO10m254DryRun: boolean;
  headlines: string[];
  summary: string;
}


export type Wave57GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave57GateTrajectorySnapshot {
  turn: number;
  wave57GateEma: number;
  instantaneousGate: number;
  band: Wave57GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}

export interface Wave57GateTrajectoryPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  lastTurn: number;
  emaAlpha: number;
  wave57GateEma: number;
  priorEma?: number;
}

export interface Wave57IntegrationMonitor {
  turn: number;
  shouldRunO10m257DryRun: boolean;
  wave57GateBand: Wave57GateBand;
  blockingReasons: string[];
  summary: string;
}

export interface Agent25Wave57ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave57: boolean;
  shouldRunO10m257DryRun: boolean;
  headlines: string[];
  summary: string;
}

export interface Agent25Wave52ProjectionHandoffBrief {
  turn: number;
  shouldProjectWave52: boolean;
  shouldRunO10m233DryRun: boolean;
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
export type Wave58GateBand = 'ready' | 'pending' | 'blocked';

export interface Wave58GateTrajectorySnapshot {
  turn: number;
  wave58GateEma: number;
  instantaneousGate: number;
  band: Wave58GateBand;
  trajectory: CouplingTrajectoryTrend;
  evidence: string[];
}
