// OP10M_MODULE_BEGIN agent-14-housing
// Agent 14 — V10.14 housing / health / education public service capacity & delayed spending
// Generated from operation-10m/agent-14-housing/ (regenerate: npm run build:agent14-housing-chunk)

// --- source: types.ts ---
/** V10.14 Agent 14 — public service capacity & delayed spending (modular slice). */

export const AGENT14_WELLBEING_SCHEMA_VERSION = '10.14.48-scale-wave-48' as const;

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
  pillar: PublicServicePillar;
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
  { id: 'ps_xp_QLD_stakeholder_alignment', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_portfolio_stabilization', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 20, durationTurns: 6, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_NT_recovery_readiness', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_fulfillment_coordination', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_WA_resumption_planning', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_readiness_cohesion', pillar: 'education', regionId: 'ACT', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_TAS_handoff_alignment', pillar: 'healthcare', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_commit_gating', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_integration_handoff', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_SA_gated_commit_wave', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_national_wire_in', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_schedule_readiness', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_turn_boundary', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_SA_agent25_handoff', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_chunk_anchor', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 20, durationTurns: 6, baseImpact: 10, effectLagTurns: 1 },
  { id: 'ps_xp_WA_assembly_merge', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_TAS_inline_merge', pillar: 'education', regionId: 'TAS', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_wave17_projection', pillar: 'healthcare', regionId: 'ACT', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 1 },
  { id: 'ps_xp_NSW_wave18_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_projection_gate', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave19_projection', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_SA_integration_gate', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 1 },
  { id: 'ps_xp_WA_wave20_projection', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_o10m171_gate', pillar: 'education', regionId: 'ACT', fiscalLoadPoints: 14, durationTurns: 4, baseImpact: 7, effectLagTurns: 1 },
  { id: 'ps_xp_NT_wave21_projection', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 19, durationTurns: 5, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_VIC_o10m174_gate', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave22_projection', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_o10m176_gate', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave23_projection', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m178_gate', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 1 },
  { id: 'ps_xp_ACT_wave24_projection', pillar: 'healthcare', regionId: 'ACT', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m180_gate', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 15, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave25_projection', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m182_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave26_projection', pillar: 'housing', regionId: 'NSW', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m184_gate', pillar: 'healthcare', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave27_projection', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m186_gate', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_ACT_wave28_projection', pillar: 'healthcare', regionId: 'ACT', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m188_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 3 },
  { id: 'ps_xp_VIC_wave29_projection', pillar: 'healthcare', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m190_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave30_projection', pillar: 'education', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m192_gate', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 4, baseImpact: 9, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave31_projection', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m194_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave32_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m196_gate', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 7, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave33_projection', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 18, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m198_gate', pillar: 'healthcare', regionId: 'SA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave34_projection', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m200_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave35_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m202_gate', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave36_projection', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m204_gate', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave37_projection', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m206_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_QLD_wave38_projection', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m208_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave39_projection', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m210_gate', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_NSW_wave40_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m212_gate', pillar: 'housing', regionId: 'QLD', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave41_projection', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m214_gate', pillar: 'healthcare', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_wave42_projection', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m216_gate', pillar: 'education', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_QLD_wave43_projection', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m218_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_wave44_projection', pillar: 'education', regionId: 'WA', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NT_o10m220_gate', pillar: 'healthcare', regionId: 'NT', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 3 },
  { id: 'ps_xp_VIC_wave45_projection', pillar: 'housing', regionId: 'VIC', fiscalLoadPoints: 16, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m222_gate', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_NSW_wave46_projection', pillar: 'healthcare', regionId: 'NSW', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m224_gate', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_wave47_projection', pillar: 'education', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_WA_o10m225_gate', pillar: 'housing', regionId: 'WA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_VIC_wave48_projection', pillar: 'education', regionId: 'VIC', fiscalLoadPoints: 17, durationTurns: 5, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_SA_o10m226_gate', pillar: 'housing', regionId: 'SA', fiscalLoadPoints: 16, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
  { id: 'ps_xp_QLD_o10m224_gate', pillar: 'healthcare', regionId: 'QLD', fiscalLoadPoints: 17, durationTurns: 4, baseImpact: 8, effectLagTurns: 2 },
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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

    const weakestPillar = [...AGENT14_PILLARS].sort(
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
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


// --- source: coordination-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function engagementSample(brief: StakeholderCoordinationBrief): number {
  let sample = brief.shouldEngageStakeholders ? 68 : 38;
  sample += Math.min(brief.reliefActions * 4, 24);
  if (brief.governanceBand === 'crisis' || brief.governanceBand === 'misaligned') {
    sample += 12;
  }
  if (brief.trajectory === 'deteriorating') {
    sample += 8;
  } else if (brief.trajectory === 'improving') {
    sample -= 6;
  }
  return Math.max(0, Math.min(100, sample));
}

export function createInitialCoordinationTrajectory(): CoordinationTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    engagementPressureEma: 45,
    priorEma: undefined,
  };
}

export function sanitizeCoordinationTrajectory(
  raw?: CoordinationTrajectoryPersisted | null
): CoordinationTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialCoordinationTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const engagementPressureEma =
    typeof raw.engagementPressureEma === 'number' && Number.isFinite(raw.engagementPressureEma)
      ? Math.max(0, Math.min(100, raw.engagementPressureEma))
      : 45;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    engagementPressureEma,
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
  if (current - previous > epsilon) return 'deteriorating';
  if (previous - current > epsilon) return 'improving';
  return 'flat';
}

function bandFromPressure(score: number): CoordinationEngagementBand {
  if (score >= 72) return 'escalation';
  if (score >= 52) return 'elevated';
  return 'routine';
}

export function advanceCoordinationTrajectory(
  turn: number,
  brief: StakeholderCoordinationBrief,
  persisted?: CoordinationTrajectoryPersisted | null
): { snapshot: CoordinationTrajectorySnapshot; persisted: CoordinationTrajectoryPersisted } {
  const base = sanitizeCoordinationTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = engagementSample(brief);
  const priorEma = base.engagementPressureEma;
  const engagementPressureEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(engagementPressureEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'deteriorating') {
    evidence.push(`Engagement pressure EMA rising (${priorEma} → ${engagementPressureEma})`);
  } else if (trajectory === 'improving') {
    evidence.push(`Engagement pressure EMA easing (${priorEma} → ${engagementPressureEma})`);
  }
  if (brief.shouldEngageStakeholders) {
    evidence.push('Stakeholder engagement flagged this turn');
  }

  return {
    snapshot: {
      turn,
      engagementPressureEma,
      instantaneousPressure: sample,
      band: bandFromPressure(engagementPressureEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      engagementPressureEma,
    },
  };
}


// --- source: relief-execution-monitor.ts ---
export function buildReliefExecutionMonitor(args: {
  turn: number;
  reliefDispatchPlan: ReliefDispatchPlan;
  reliefSchedule: CapacityReliefSchedule;
  coordinationTrajectory?: CoordinationTrajectorySnapshot;
}): ReliefExecutionMonitor {
  const immediateDue = args.reliefDispatchPlan.actions.filter(
    (a) => a.priority === 'immediate' && a.targetTurn <= args.turn
  ).length;
  const deferredCount = args.reliefDispatchPlan.actions.filter((a) => a.priority === 'deferred').length;
  const holdCount = args.reliefDispatchPlan.actions.filter((a) => a.priority === 'hold').length;
  const scheduleItems = Math.max(1, args.reliefSchedule.items.length);
  const backlogPressure =
    Math.round(
      ((args.reliefDispatchPlan.actions.length + holdCount * 0.5) / scheduleItems) * 100
    ) / 100;

  const coordinationEscalation = args.coordinationTrajectory?.band === 'escalation';
  const shouldEscalateExecution =
    immediateDue >= 2 ||
    args.reliefDispatchPlan.shouldHoldCommits ||
    coordinationEscalation ||
    (backlogPressure >= 1.25 && deferredCount >= 2);

  let summary: string;
  if (args.reliefDispatchPlan.actions.length === 0) {
    summary = shouldEscalateExecution
      ? 'Relief execution: hold commits — monitor capacity binding'
      : 'Relief execution queue clear';
  } else {
    summary = `Relief execution: ${immediateDue} immediate, ${deferredCount} deferred (pressure ${backlogPressure})`;
  }

  return {
    turn: args.turn,
    immediateDue,
    deferredCount,
    holdCount,
    backlogPressure,
    shouldEscalateExecution,
    summary,
  };
}


// --- source: portfolio-stabilization-brief.ts ---
function resolvePath(
  execution: ReliefExecutionMonitor,
  coordination?: CoordinationTrajectorySnapshot,
  governance?: GovernanceTrajectorySnapshot
): PortfolioStabilizationPath {
  if (execution.shouldEscalateExecution || execution.backlogPressure >= 1.5) {
    return 'blocked';
  }
  if (
    coordination?.band === 'escalation' ||
    governance?.trajectory === 'deteriorating' ||
    execution.immediateDue >= 1
  ) {
    return 'watch';
  }
  return 'clear';
}

export function composePortfolioStabilizationBrief(args: {
  turn: number;
  reliefExecutionMonitor: ReliefExecutionMonitor;
  stakeholderBrief: StakeholderCoordinationBrief;
  coordinationTrajectory?: CoordinationTrajectorySnapshot;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
}): PortfolioStabilizationBrief {
  const stabilizationPath = resolvePath(
    args.reliefExecutionMonitor,
    args.coordinationTrajectory,
    args.governanceTrajectory
  );
  const shouldPausePortfolioGrowth =
    stabilizationPath === 'blocked' ||
    args.reliefExecutionMonitor.shouldEscalateExecution ||
    args.stakeholderBrief.shouldEngageStakeholders;

  const headlines: string[] = [];
  if (stabilizationPath === 'blocked') {
    headlines.push('Portfolio stabilization blocked — defer growth commits');
  } else if (stabilizationPath === 'watch') {
    headlines.push('Portfolio stabilization on watch — sequence relief first');
  } else {
    headlines.push('Portfolio stabilization path clear');
  }
  if (args.coordinationTrajectory?.band === 'escalation') {
    headlines.push('Coordination pressure elevated — tighten cadence');
  }
  if (args.governanceTrajectory?.band === 'aligned' && stabilizationPath === 'clear') {
    headlines.push('Governance aligned — resume normal portfolio pacing');
  }

  const summary = `${stabilizationPath} path / execution escalate=${args.reliefExecutionMonitor.shouldEscalateExecution} pause=${shouldPausePortfolioGrowth}`;

  return {
    turn: args.turn,
    stabilizationPath,
    shouldPausePortfolioGrowth,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: stabilization-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function stressSample(brief: PortfolioStabilizationBrief): number {
  const base =
    brief.stabilizationPath === 'blocked' ? 84 : brief.stabilizationPath === 'watch' ? 58 : 34;
  let sample = base + (brief.shouldPausePortfolioGrowth ? 8 : 0);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialStabilizationTrajectory(): StabilizationTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    stabilizationStressEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeStabilizationTrajectory(
  raw?: StabilizationTrajectoryPersisted | null
): StabilizationTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialStabilizationTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const stabilizationStressEma =
    typeof raw.stabilizationStressEma === 'number' && Number.isFinite(raw.stabilizationStressEma)
      ? Math.max(0, Math.min(100, raw.stabilizationStressEma))
      : 50;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    stabilizationStressEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromStress(score: number): StabilizationStressBand {
  if (score >= 72) return 'stressed';
  if (score >= 52) return 'constrained';
  return 'recovering';
}

export function advanceStabilizationTrajectory(
  turn: number,
  brief: PortfolioStabilizationBrief,
  persisted?: StabilizationTrajectoryPersisted | null
): { snapshot: StabilizationTrajectorySnapshot; persisted: StabilizationTrajectoryPersisted } {
  const base = sanitizeStabilizationTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = stressSample(brief);
  const priorEma = base.stabilizationStressEma;
  const stabilizationStressEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(stabilizationStressEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Stabilization stress EMA easing (${priorEma} → ${stabilizationStressEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Stabilization stress EMA rising (${priorEma} → ${stabilizationStressEma})`);
  }
  if (brief.stabilizationPath === 'blocked') {
    evidence.push(`Portfolio path blocked at turn ${turn}`);
  }

  return {
    snapshot: {
      turn,
      stabilizationStressEma,
      instantaneousStress: sample,
      band: bandFromStress(stabilizationStressEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      stabilizationStressEma,
    },
  };
}


// --- source: relief-fulfillment-tracker.ts ---
function actionKey(action: ReliefDispatchAction): string {
  return `${action.programId}:${action.regionId}:${action.targetTurn}:${action.priority}`;
}

export function createInitialReliefFulfillment(): ReliefFulfillmentPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    openActions: [],
    cumulativeFulfilled: 0,
  };
}

export function sanitizeReliefFulfillment(
  raw?: ReliefFulfillmentPersisted | null
): ReliefFulfillmentPersisted {
  if (!raw || typeof raw !== 'object') return createInitialReliefFulfillment();
  const openActions = Array.isArray(raw.openActions)
    ? raw.openActions.filter(
        (a) => a && typeof a.actionKey === 'string' && typeof a.programId === 'string'
      )
    : [];
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    openActions,
    cumulativeFulfilled:
      typeof raw.cumulativeFulfilled === 'number' && Number.isFinite(raw.cumulativeFulfilled)
        ? Math.max(0, Math.floor(raw.cumulativeFulfilled))
        : 0,
  };
}

function mergeOpenActions(
  existing: ReliefFulfillmentOpenAction[],
  plan: ReliefDispatchPlan
): ReliefFulfillmentOpenAction[] {
  const keys = new Set(existing.map((a) => a.actionKey));
  const merged = [...existing];
  for (const action of plan.actions) {
    const key = actionKey(action);
    if (keys.has(key)) continue;
    keys.add(key);
    merged.push({
      actionKey: key,
      programId: action.programId,
      regionId: action.regionId,
      pillar: action.pillar,
      priority: action.priority,
      targetTurn: action.targetTurn,
    });
  }
  return merged;
}

export function advanceReliefFulfillment(args: {
  turn: number;
  reliefDispatchPlan: ReliefDispatchPlan;
  executionMonitor: ReliefExecutionMonitor;
  capacity: PublicServiceCapacitySnapshot;
  persisted?: ReliefFulfillmentPersisted | null;
}): { snapshot: ReliefFulfillmentSnapshot; persisted: ReliefFulfillmentPersisted } {
  const base = sanitizeReliefFulfillment(args.persisted);
  let openActions = mergeOpenActions(base.openActions, args.reliefDispatchPlan);
  let fulfilledThisTurn = 0;

  const canFulfill =
    args.capacity.bindingConstraint === 'none' &&
    !args.executionMonitor.shouldEscalateExecution &&
    args.capacity.slotsFree > 0;

  if (canFulfill) {
    const remaining: ReliefFulfillmentOpenAction[] = [];
    let slots = args.capacity.slotsFree;
    for (const item of openActions) {
      const due = item.targetTurn <= args.turn && item.priority !== 'hold';
      if (due && slots > 0) {
        fulfilledThisTurn += 1;
        slots -= 1;
        continue;
      }
      remaining.push(item);
    }
    openActions = remaining;
  }

  const openCount = openActions.length;
  const denominator = Math.max(1, openCount + fulfilledThisTurn);
  const fulfillmentRatio = Math.round((fulfilledThisTurn / denominator) * 100) / 100;
  const shouldClearBacklog = openCount === 0 && fulfilledThisTurn === 0 && !args.reliefDispatchPlan.shouldHoldCommits;

  const summary =
    fulfilledThisTurn > 0
      ? `Relief fulfillment: ${fulfilledThisTurn} closed, ${openCount} open`
      : openCount > 0
        ? `Relief fulfillment backlog: ${openCount} open actions`
        : 'Relief fulfillment queue clear';

  return {
    snapshot: {
      turn: args.turn,
      openCount,
      fulfilledThisTurn,
      fulfillmentRatio,
      shouldClearBacklog,
      summary,
    },
    persisted: {
      ...base,
      lastTurn: args.turn,
      openActions,
      cumulativeFulfilled: base.cumulativeFulfilled + fulfilledThisTurn,
    },
  };
}


// --- source: wellbeing-recovery-readiness-brief.ts ---
function resolveReadiness(
  portfolio: PortfolioStabilizationBrief,
  fulfillment: ReliefFulfillmentSnapshot,
  stabilization?: StabilizationTrajectorySnapshot
): WellbeingRecoveryReadinessBand {
  if (
    portfolio.stabilizationPath === 'blocked' ||
    portfolio.shouldPausePortfolioGrowth ||
    fulfillment.openCount >= 4
  ) {
    return 'not_ready';
  }
  if (
    portfolio.stabilizationPath === 'clear' &&
    fulfillment.openCount === 0 &&
    (stabilization?.band === 'recovering' || stabilization?.trajectory === 'improving')
  ) {
    return 'ready';
  }
  if (fulfillment.fulfilledThisTurn > 0 || portfolio.stabilizationPath === 'watch') {
    return 'partial';
  }
  return portfolio.stabilizationPath === 'clear' ? 'ready' : 'partial';
}

export function composeWellbeingRecoveryReadinessBrief(args: {
  turn: number;
  portfolioBrief: PortfolioStabilizationBrief;
  reliefFulfillment: ReliefFulfillmentSnapshot;
  stabilizationTrajectory?: StabilizationTrajectorySnapshot;
}): WellbeingRecoveryReadinessBrief {
  const readinessBand = resolveReadiness(
    args.portfolioBrief,
    args.reliefFulfillment,
    args.stabilizationTrajectory
  );
  const shouldResumePortfolioGrowth =
    readinessBand === 'ready' &&
    !args.portfolioBrief.shouldPausePortfolioGrowth &&
    args.reliefFulfillment.shouldClearBacklog;

  const headlines: string[] = [];
  if (readinessBand === 'ready') {
    headlines.push('Recovery readiness: resume sequenced portfolio growth');
  } else if (readinessBand === 'partial') {
    headlines.push('Recovery readiness partial — finish relief fulfillment first');
  } else {
    headlines.push('Recovery readiness blocked — hold portfolio expansion');
  }
  if (args.reliefFulfillment.fulfilledThisTurn > 0) {
    headlines.push(`${args.reliefFulfillment.fulfilledThisTurn} relief actions fulfilled this turn`);
  }
  if (args.stabilizationTrajectory?.trajectory === 'improving') {
    headlines.push('Stabilization stress trajectory improving');
  }

  const summary = `${readinessBand} readiness / open=${args.reliefFulfillment.openCount} resume=${shouldResumePortfolioGrowth}`;

  return {
    turn: args.turn,
    readinessBand,
    shouldResumePortfolioGrowth,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: readiness-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gapSample(brief: WellbeingRecoveryReadinessBrief): number {
  const base =
    brief.readinessBand === 'not_ready' ? 82 : brief.readinessBand === 'partial' ? 54 : 28;
  let sample = base + (brief.shouldResumePortfolioGrowth ? -10 : 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialReadinessTrajectory(): ReadinessTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    readinessGapEma: 48,
    priorEma: undefined,
  };
}

export function sanitizeReadinessTrajectory(
  raw?: ReadinessTrajectoryPersisted | null
): ReadinessTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialReadinessTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const readinessGapEma =
    typeof raw.readinessGapEma === 'number' && Number.isFinite(raw.readinessGapEma)
      ? Math.max(0, Math.min(100, raw.readinessGapEma))
      : 48;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    readinessGapEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGap(score: number): ReadinessGapBand {
  if (score >= 72) return 'wide';
  if (score >= 52) return 'moderate';
  return 'narrow';
}

export function advanceReadinessTrajectory(
  turn: number,
  brief: WellbeingRecoveryReadinessBrief,
  persisted?: ReadinessTrajectoryPersisted | null
): { snapshot: ReadinessTrajectorySnapshot; persisted: ReadinessTrajectoryPersisted } {
  const base = sanitizeReadinessTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gapSample(brief);
  const priorEma = base.readinessGapEma;
  const readinessGapEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(readinessGapEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Readiness gap EMA narrowing (${priorEma} → ${readinessGapEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Readiness gap EMA widening (${priorEma} → ${readinessGapEma})`);
  }
  if (brief.readinessBand === 'not_ready') {
    evidence.push('Recovery readiness blocked this turn');
  }

  return {
    snapshot: {
      turn,
      readinessGapEma,
      instantaneousGap: sample,
      band: bandFromGap(readinessGapEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      readinessGapEma,
    },
  };
}


// --- source: fulfillment-aging-monitor.ts ---
export function buildFulfillmentAgingMonitor(args: {
  turn: number;
  reliefFulfillment: ReliefFulfillmentSnapshot;
  persisted: ReliefFulfillmentPersisted;
}): FulfillmentAgingMonitor {
  const overdueActions = args.persisted.openActions.filter((a) => a.targetTurn < args.turn);
  const ages = args.persisted.openActions.map((a) => Math.max(0, args.turn - a.targetTurn));
  const averageAgeTurns =
    ages.length === 0 ? 0 : Math.round((ages.reduce((s, v) => s + v, 0) / ages.length) * 10) / 10;
  const maxAgeTurns = ages.length === 0 ? 0 : Math.max(...ages);
  const shouldExpediteAging =
    overdueActions.length >= 2 || maxAgeTurns >= 2 || args.reliefFulfillment.openCount >= 6;

  const summary =
    args.reliefFulfillment.openCount === 0
      ? 'Fulfillment aging: no open backlog'
      : `Fulfillment aging: ${overdueActions.length} overdue, avg age ${averageAgeTurns} turns`;

  return {
    turn: args.turn,
    openCount: args.reliefFulfillment.openCount,
    overdueCount: overdueActions.length,
    averageAgeTurns,
    maxAgeTurns,
    shouldExpediteAging,
    summary,
  };
}


// --- source: portfolio-resumption-plan.ts ---
export function buildPortfolioResumptionPlan(args: {
  turn: number;
  recoveryBrief: WellbeingRecoveryReadinessBrief;
  readinessTrajectory?: ReadinessTrajectorySnapshot;
  fulfillmentAging: FulfillmentAgingMonitor;
  interventionQueue?: WellbeingInterventionPriorityQueue;
  limit?: number;
}): PortfolioResumptionPlan {
  const limit = args.limit ?? 4;
  const shouldHoldNewCommits =
    !args.recoveryBrief.shouldResumePortfolioGrowth ||
    args.fulfillmentAging.shouldExpediteAging ||
    args.readinessTrajectory?.band === 'wide';

  const recommendedResumeTurn =
    shouldHoldNewCommits
      ? args.turn + (args.fulfillmentAging.overdueCount >= 2 ? 3 : 2)
      : args.turn;

  const actions: PortfolioResumptionAction[] = [];
  if (!shouldHoldNewCommits && args.interventionQueue) {
    for (const item of args.interventionQueue.items) {
      if (!item.fitsCapacity) continue;
      actions.push({
        programId: item.programId,
        regionId: item.regionId,
        pillar: item.pillar,
        priority: item.rank,
        rationale: `Resume — ${item.rationale}`,
      });
      if (actions.length >= limit) break;
    }
  }

  const summary = shouldHoldNewCommits
    ? `Portfolio resumption on hold until turn ${recommendedResumeTurn}`
    : actions.length > 0
      ? `Portfolio resumption: ${actions.length} sequenced programs from turn ${recommendedResumeTurn}`
      : 'Portfolio resumption clear with no queued programs';

  return {
    turn: args.turn,
    shouldHoldNewCommits,
    recommendedResumeTurn,
    actions,
    summary,
  };
}


// --- source: resumption-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function frictionSample(plan: PortfolioResumptionPlan): number {
  let sample = plan.shouldHoldNewCommits ? 76 : plan.actions.length > 0 ? 32 : 44;
  if (plan.recommendedResumeTurn > plan.turn + 2) {
    sample += 10;
  }
  return Math.max(0, Math.min(100, sample));
}

export function createInitialResumptionTrajectory(): ResumptionTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    resumptionFrictionEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeResumptionTrajectory(
  raw?: ResumptionTrajectoryPersisted | null
): ResumptionTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialResumptionTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const resumptionFrictionEma =
    typeof raw.resumptionFrictionEma === 'number' && Number.isFinite(raw.resumptionFrictionEma)
      ? Math.max(0, Math.min(100, raw.resumptionFrictionEma))
      : 50;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    resumptionFrictionEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromFriction(score: number): ResumptionFrictionBand {
  if (score >= 68) return 'high';
  if (score >= 48) return 'moderate';
  return 'low';
}

export function advanceResumptionTrajectory(
  turn: number,
  plan: PortfolioResumptionPlan,
  persisted?: ResumptionTrajectoryPersisted | null
): { snapshot: ResumptionTrajectorySnapshot; persisted: ResumptionTrajectoryPersisted } {
  const base = sanitizeResumptionTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = frictionSample(plan);
  const priorEma = base.resumptionFrictionEma;
  const resumptionFrictionEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(resumptionFrictionEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Resumption friction EMA easing (${priorEma} → ${resumptionFrictionEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Resumption friction EMA rising (${priorEma} → ${resumptionFrictionEma})`);
  }
  if (plan.shouldHoldNewCommits) {
    evidence.push(`Portfolio commits held until turn ${plan.recommendedResumeTurn}`);
  }

  return {
    snapshot: {
      turn,
      resumptionFrictionEma,
      instantaneousFriction: sample,
      band: bandFromFriction(resumptionFrictionEma),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      resumptionFrictionEma,
    },
  };
}


// --- source: commit-gating-advisor.ts ---
export function adviseCommitGating(args: {
  turn: number;
  resumptionPlan: PortfolioResumptionPlan;
  capacity: PublicServiceCapacitySnapshot;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
  rejectedCommitmentsCount?: number;
}): CommitGatingAdvice {
  const rejected = args.rejectedCommitmentsCount ?? 0;
  const shouldBlockAllCommits =
    args.resumptionPlan.shouldHoldNewCommits ||
    args.resumptionTrajectory?.band === 'high' ||
    args.capacity.bindingConstraint === 'workforce';

  let allowedNewCommits = 0;
  if (!shouldBlockAllCommits) {
    allowedNewCommits = Math.min(args.capacity.slotsFree, args.resumptionPlan.actions.length > 0 ? 2 : 1);
  }

  const reasons: string[] = [];
  if (shouldBlockAllCommits) {
    reasons.push('Resumption plan or capacity blocks new commits');
  }
  if (rejected > 0) {
    reasons.push(`${rejected} commitments rejected this turn`);
  }
  if (args.capacity.slotsFree === 0 && !shouldBlockAllCommits) {
    reasons.push('Program slots exhausted');
    allowedNewCommits = 0;
  }

  const summary = shouldBlockAllCommits
    ? `Commit gating: block all new commits (${reasons[0] ?? 'hold active'})`
    : allowedNewCommits > 0
      ? `Commit gating: up to ${allowedNewCommits} new commits allowed`
      : 'Commit gating: no spare capacity for new commits';

  return {
    turn: args.turn,
    shouldBlockAllCommits,
    allowedNewCommits,
    rejectedCommitmentsCount: rejected,
    bindingConstraint: args.capacity.bindingConstraint,
    reasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: portfolio-handoff-brief.ts ---
export function composePortfolioHandoffBrief(args: {
  turn: number;
  resumptionPlan: PortfolioResumptionPlan;
  commitGating: CommitGatingAdvice;
  recoveryBrief: WellbeingRecoveryReadinessBrief;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
}): PortfolioHandoffBrief {
  const shouldSignalHandoff =
    !args.commitGating.shouldBlockAllCommits &&
    args.recoveryBrief.readinessBand !== 'not_ready' &&
    (args.resumptionTrajectory?.trajectory === 'improving' ||
      args.resumptionPlan.actions.length > 0);

  const headlines: string[] = [];
  if (shouldSignalHandoff) {
    headlines.push('Portfolio handoff: sequenced programs ready for national wire-in');
  } else {
    headlines.push('Portfolio handoff deferred — finish gating preconditions');
  }
  if (args.resumptionPlan.actions.length > 0) {
    headlines.push(`${args.resumptionPlan.actions.length} resumption actions queued`);
  }
  if (args.commitGating.allowedNewCommits > 0) {
    headlines.push(`Capacity allows ${args.commitGating.allowedNewCommits} gated commits`);
  }

  const summary = `handoff=${shouldSignalHandoff} allowed=${args.commitGating.allowedNewCommits} hold=${args.resumptionPlan.shouldHoldNewCommits}`;

  return {
    turn: args.turn,
    shouldSignalHandoff,
    queuedResumptionActions: args.resumptionPlan.actions.length,
    allowedNewCommits: args.commitGating.allowedNewCommits,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: handoff-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function readinessSample(brief: PortfolioHandoffBrief): number {
  let sample = brief.shouldSignalHandoff ? 30 : 72;
  sample -= Math.min(brief.allowedNewCommits * 6, 18);
  sample += Math.min(brief.queuedResumptionActions * 3, 15);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialHandoffTrajectory(): HandoffTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    handoffReadinessEma: 52,
    priorEma: undefined,
  };
}

export function sanitizeHandoffTrajectory(
  raw?: HandoffTrajectoryPersisted | null
): HandoffTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialHandoffTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const handoffReadinessEma =
    typeof raw.handoffReadinessEma === 'number' && Number.isFinite(raw.handoffReadinessEma)
      ? Math.max(0, Math.min(100, raw.handoffReadinessEma))
      : 52;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    handoffReadinessEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromReadiness(score: number, brief: PortfolioHandoffBrief): HandoffReadinessBand {
  if (brief.shouldSignalHandoff && score <= 45) return 'ready';
  if (score >= 68) return 'blocked';
  return 'pending';
}

export function advanceHandoffTrajectory(
  turn: number,
  brief: PortfolioHandoffBrief,
  persisted?: HandoffTrajectoryPersisted | null
): { snapshot: HandoffTrajectorySnapshot; persisted: HandoffTrajectoryPersisted } {
  const base = sanitizeHandoffTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = readinessSample(brief);
  const priorEma = base.handoffReadinessEma;
  const handoffReadinessEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(handoffReadinessEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Handoff readiness EMA improving (${priorEma} → ${handoffReadinessEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Handoff readiness EMA softening (${priorEma} → ${handoffReadinessEma})`);
  }
  if (brief.shouldSignalHandoff) {
    evidence.push('Portfolio handoff signal active');
  }

  return {
    snapshot: {
      turn,
      handoffReadinessEma,
      instantaneousReadiness: sample,
      band: bandFromReadiness(handoffReadinessEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      handoffReadinessEma,
    },
  };
}


// --- source: gated-commit-scheduler.ts ---
export function buildGatedCommitSchedule(args: {
  turn: number;
  commitGating: CommitGatingAdvice;
  resumptionPlan: PortfolioResumptionPlan;
  recommendations?: ProgramSequencingRecommendation[];
  limit?: number;
}): GatedCommitSchedule {
  const limit = args.limit ?? 5;
  const items: GatedCommitScheduleItem[] = [];

  if (!args.commitGating.shouldBlockAllCommits && args.commitGating.allowedNewCommits > 0) {
    for (const action of args.resumptionPlan.actions) {
      items.push({
        programId: action.programId,
        regionId: action.regionId,
        pillar: action.pillar,
        targetTurn: args.turn,
        source: 'resumption',
        rationale: action.rationale,
      });
      if (items.length >= args.commitGating.allowedNewCommits) break;
    }
  }

  if (items.length < limit && !args.commitGating.shouldBlockAllCommits) {
    for (const rec of args.recommendations ?? []) {
      if (!rec.fitsCapacity) continue;
      if (items.some((i) => i.programId === rec.programId)) continue;
      items.push({
        programId: rec.programId,
        regionId: rec.regionId,
        pillar: rec.pillar,
        targetTurn: args.turn + 1,
        source: 'sequencing',
        rationale: rec.rationale,
      });
      if (items.length >= limit) break;
    }
  }

  const deferUntilTurn = args.commitGating.shouldBlockAllCommits
    ? args.resumptionPlan.recommendedResumeTurn
    : args.turn;

  const summary =
    items.length === 0
      ? args.commitGating.shouldBlockAllCommits
        ? `Gated commits deferred until turn ${deferUntilTurn}`
        : 'Gated commit schedule empty'
      : `Gated schedule: ${items.length} commits (${items.filter((i) => i.source === 'resumption').length} resumption)`;

  return {
    turn: args.turn,
    deferUntilTurn,
    shouldDeferAll: args.commitGating.shouldBlockAllCommits,
    items: items.slice(0, limit),
    summary,
  };
}


// --- source: wellbeing-integration-handoff-brief.ts ---
export function composeWellbeingIntegrationHandoffBrief(args: {
  turn: number;
  portfolioHandoff: PortfolioHandoffBrief;
  handoffTrajectory?: HandoffTrajectorySnapshot;
  gatedCommitSchedule: GatedCommitSchedule;
}): WellbeingIntegrationHandoffBrief {
  const shouldPublishIntegration =
    args.portfolioHandoff.shouldSignalHandoff &&
    args.handoffTrajectory?.band === 'ready' &&
    !args.gatedCommitSchedule.shouldDeferAll;

  const headlines: string[] = [];
  if (shouldPublishIntegration) {
    headlines.push('Integration handoff: publish Agent 14 slice to national turn boundary');
  } else {
    headlines.push('Integration handoff pending — complete gated commit schedule first');
  }
  if (args.gatedCommitSchedule.items.length > 0) {
    headlines.push(`${args.gatedCommitSchedule.items.length} gated commits scheduled`);
  }
  if (args.handoffTrajectory?.trajectory === 'improving') {
    headlines.push('Handoff readiness trajectory improving');
  }

  const summary = `publish=${shouldPublishIntegration} scheduled=${args.gatedCommitSchedule.items.length} defer=${args.gatedCommitSchedule.deferUntilTurn}`;

  return {
    turn: args.turn,
    shouldPublishIntegration,
    scheduledCommitCount: args.gatedCommitSchedule.items.length,
    deferUntilTurn: args.gatedCommitSchedule.deferUntilTurn,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: integration-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function publishSample(brief: WellbeingIntegrationHandoffBrief): number {
  let sample = brief.shouldPublishIntegration ? 26 : 74;
  sample -= Math.min(brief.scheduledCommitCount * 4, 16);
  if (brief.deferUntilTurn > brief.turn + 1) {
    sample += 12;
  }
  return Math.max(0, Math.min(100, sample));
}

export function createInitialIntegrationTrajectory(): IntegrationTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    integrationReadinessEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeIntegrationTrajectory(
  raw?: IntegrationTrajectoryPersisted | null
): IntegrationTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialIntegrationTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const integrationReadinessEma =
    typeof raw.integrationReadinessEma === 'number' && Number.isFinite(raw.integrationReadinessEma)
      ? Math.max(0, Math.min(100, raw.integrationReadinessEma))
      : 50;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    integrationReadinessEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromReadiness(score: number, brief: WellbeingIntegrationHandoffBrief): IntegrationPublishBand {
  if (brief.shouldPublishIntegration && score <= 40) return 'publish';
  if (score >= 65) return 'hold';
  return 'watch';
}

export function advanceIntegrationTrajectory(
  turn: number,
  brief: WellbeingIntegrationHandoffBrief,
  persisted?: IntegrationTrajectoryPersisted | null
): { snapshot: IntegrationTrajectorySnapshot; persisted: IntegrationTrajectoryPersisted } {
  const base = sanitizeIntegrationTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = publishSample(brief);
  const priorEma = base.integrationReadinessEma;
  const integrationReadinessEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(integrationReadinessEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Integration readiness EMA improving (${priorEma} → ${integrationReadinessEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Integration readiness EMA softening (${priorEma} → ${integrationReadinessEma})`);
  }
  if (brief.shouldPublishIntegration) {
    evidence.push('Integration publish signal active');
  }

  return {
    snapshot: {
      turn,
      integrationReadinessEma,
      instantaneousReadiness: sample,
      band: bandFromReadiness(integrationReadinessEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      integrationReadinessEma,
    },
  };
}


// --- source: schedule-readiness-monitor.ts ---
export function buildScheduleReadinessMonitor(args: {
  turn: number;
  gatedCommitSchedule: GatedCommitSchedule;
}): ScheduleReadinessMonitor {
  const dueThisTurn = args.gatedCommitSchedule.items.filter((i) => i.targetTurn <= args.turn).length;
  const futureItems = args.gatedCommitSchedule.items.filter((i) => i.targetTurn > args.turn).length;
  const overdue = args.gatedCommitSchedule.shouldDeferAll && args.turn >= args.gatedCommitSchedule.deferUntilTurn
    ? args.gatedCommitSchedule.items.length
    : 0;
  const total = Math.max(1, args.gatedCommitSchedule.items.length);
  const readinessRatio = Math.round((dueThisTurn / total) * 100) / 100;

  const shouldExpediteSchedule =
    args.gatedCommitSchedule.shouldDeferAll ||
    (dueThisTurn === 0 && futureItems >= 3) ||
    overdue > 0;

  const summary = args.gatedCommitSchedule.shouldDeferAll
    ? `Schedule readiness: deferred until turn ${args.gatedCommitSchedule.deferUntilTurn}`
    : dueThisTurn > 0
      ? `Schedule readiness: ${dueThisTurn} commits due this turn`
      : 'Schedule readiness: no commits due';

  return {
    turn: args.turn,
    dueThisTurn,
    futureItems,
    overdueCount: overdue,
    readinessRatio,
    shouldExpediteSchedule,
    summary,
  };
}


// --- source: national-wire-in-readiness-brief.ts ---
export function composeNationalWireInReadinessBrief(args: {
  turn: number;
  integrationHandoff: WellbeingIntegrationHandoffBrief;
  scheduleReadiness: ScheduleReadinessMonitor;
  integrationTrajectory?: IntegrationTrajectorySnapshot;
}): NationalWireInReadinessBrief {
  const shouldWireNationalTurn =
    args.integrationHandoff.shouldPublishIntegration &&
    args.integrationTrajectory?.band === 'publish' &&
    !args.scheduleReadiness.shouldExpediteSchedule &&
    args.scheduleReadiness.dueThisTurn > 0;

  const headlines: string[] = [];
  if (shouldWireNationalTurn) {
    headlines.push('National wire-in: attach Agent 14 enriched inputs at turn boundary');
  } else {
    headlines.push('National wire-in deferred — schedule or integration band not ready');
  }
  if (args.scheduleReadiness.dueThisTurn > 0) {
    headlines.push(`${args.scheduleReadiness.dueThisTurn} gated commits due for wire-in`);
  }
  if (args.integrationTrajectory?.trajectory === 'improving') {
    headlines.push('Integration readiness trajectory improving');
  }

  const summary = `wire=${shouldWireNationalTurn} due=${args.scheduleReadiness.dueThisTurn} band=${args.integrationTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldWireNationalTurn,
    dueCommitCount: args.scheduleReadiness.dueThisTurn,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wire-in-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function activationSample(brief: NationalWireInReadinessBrief): number {
  let sample = brief.shouldWireNationalTurn ? 27 : 73;
  sample -= Math.min(brief.dueCommitCount * 5, 20);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWireInTrajectory(): WireInTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wireInActivationEma: 50,
    priorEma: undefined,
  };
}

export function sanitizeWireInTrajectory(
  raw?: WireInTrajectoryPersisted | null
): WireInTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWireInTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wireInActivationEma =
    typeof raw.wireInActivationEma === 'number' && Number.isFinite(raw.wireInActivationEma)
      ? Math.max(0, Math.min(100, raw.wireInActivationEma))
      : 50;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wireInActivationEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromActivation(score: number, brief: NationalWireInReadinessBrief): WireInActivationBand {
  if (brief.shouldWireNationalTurn && score <= 38) return 'active';
  if (score >= 66) return 'blocked';
  return 'pending';
}

export function advanceWireInTrajectory(
  turn: number,
  brief: NationalWireInReadinessBrief,
  persisted?: WireInTrajectoryPersisted | null
): { snapshot: WireInTrajectorySnapshot; persisted: WireInTrajectoryPersisted } {
  const base = sanitizeWireInTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = activationSample(brief);
  const priorEma = base.wireInActivationEma;
  const wireInActivationEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wireInActivationEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wire-in activation EMA improving (${priorEma} → ${wireInActivationEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wire-in activation EMA softening (${priorEma} → ${wireInActivationEma})`);
  }
  if (brief.shouldWireNationalTurn) {
    evidence.push('National wire-in signal active');
  }

  return {
    snapshot: {
      turn,
      wireInActivationEma,
      instantaneousActivation: sample,
      band: bandFromActivation(wireInActivationEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wireInActivationEma,
    },
  };
}


// --- source: turn-boundary-activation-monitor.ts ---
export function buildTurnBoundaryActivationMonitor(args: {
  turn: number;
  wireInBrief: NationalWireInReadinessBrief;
  scheduleReadiness: ScheduleReadinessMonitor;
  capacity: PublicServiceCapacitySnapshot;
}): TurnBoundaryActivationMonitor {
  const reasons: string[] = [];
  let shouldActivateTurnBoundary =
    args.wireInBrief.shouldWireNationalTurn &&
    !args.scheduleReadiness.shouldExpediteSchedule &&
    args.capacity.deliveryCapacityIndex >= 40;

  if (!args.wireInBrief.shouldWireNationalTurn) {
    reasons.push('Wire-in readiness not set');
    shouldActivateTurnBoundary = false;
  }
  if (args.scheduleReadiness.shouldExpediteSchedule) {
    reasons.push('Gated schedule requires expedite');
    shouldActivateTurnBoundary = false;
  }
  if (args.capacity.bindingConstraint === 'workforce') {
    reasons.push('Workforce binding blocks turn boundary activation');
    shouldActivateTurnBoundary = false;
  }
  if (args.scheduleReadiness.dueThisTurn === 0 && !args.wireInBrief.shouldWireNationalTurn) {
    reasons.push('No commits due at boundary');
  }

  const summary = shouldActivateTurnBoundary
    ? `Turn boundary activation: ready (${args.scheduleReadiness.dueThisTurn} commits due)`
    : reasons.length > 0
      ? `Turn boundary activation blocked — ${reasons[0]}`
      : 'Turn boundary activation pending';

  return {
    turn: args.turn,
    shouldActivateTurnBoundary,
    dueCommitCount: args.scheduleReadiness.dueThisTurn,
    deliveryCapacityIndex: args.capacity.deliveryCapacityIndex,
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-assembly-handoff-brief.ts ---
export function composeAgent25AssemblyHandoffBrief(args: {
  turn: number;
  activationMonitor: TurnBoundaryActivationMonitor;
  wireInTrajectory?: WireInTrajectorySnapshot;
}): Agent25AssemblyHandoffBrief {
  const shouldHandoffChunk =
    args.activationMonitor.shouldActivateTurnBoundary &&
    args.wireInTrajectory?.band === 'active';

  const headlines: string[] = [];
  if (shouldHandoffChunk) {
    headlines.push('Agent 25: merge chunk at OP10M anchor with persisted trajectories');
  } else {
    headlines.push('Agent 25 handoff deferred — turn boundary not active');
  }
  if (args.activationMonitor.dueCommitCount > 0) {
    headlines.push(`${args.activationMonitor.dueCommitCount} commits align with boundary activation`);
  }
  if (args.wireInTrajectory?.trajectory === 'improving') {
    headlines.push('Wire-in activation trajectory improving');
  }

  const summary = `handoff=${shouldHandoffChunk} activate=${args.activationMonitor.shouldActivateTurnBoundary} band=${args.wireInTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldHandoffChunk,
    shouldActivateTurnBoundary: args.activationMonitor.shouldActivateTurnBoundary,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: assembly-merge-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function mergeSample(brief: Agent25AssemblyHandoffBrief): number {
  let sample = brief.shouldHandoffChunk ? 25 : 74;
  if (!brief.shouldActivateTurnBoundary) {
    sample += 14;
  }
  sample -= Math.min(brief.headlines.length * 2, 8);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialAssemblyMergeTrajectory(): AssemblyMergeTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    assemblyMergeEma: 48,
    priorEma: undefined,
  };
}

export function sanitizeAssemblyMergeTrajectory(
  raw?: AssemblyMergeTrajectoryPersisted | null
): AssemblyMergeTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialAssemblyMergeTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const assemblyMergeEma =
    typeof raw.assemblyMergeEma === 'number' && Number.isFinite(raw.assemblyMergeEma)
      ? Math.max(0, Math.min(100, raw.assemblyMergeEma))
      : 48;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    assemblyMergeEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromMerge(score: number, brief: Agent25AssemblyHandoffBrief): AssemblyMergeBand {
  if (brief.shouldHandoffChunk && score <= 36) return 'ready';
  if (score >= 68) return 'blocked';
  return 'pending';
}

export function advanceAssemblyMergeTrajectory(
  turn: number,
  brief: Agent25AssemblyHandoffBrief,
  persisted?: AssemblyMergeTrajectoryPersisted | null
): { snapshot: AssemblyMergeTrajectorySnapshot; persisted: AssemblyMergeTrajectoryPersisted } {
  const base = sanitizeAssemblyMergeTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = mergeSample(brief);
  const priorEma = base.assemblyMergeEma;
  const assemblyMergeEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(assemblyMergeEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Assembly merge EMA improving (${priorEma} → ${assemblyMergeEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Assembly merge EMA softening (${priorEma} → ${assemblyMergeEma})`);
  }
  if (brief.shouldHandoffChunk) {
    evidence.push('Agent 25 assembly handoff signal active');
  }

  return {
    snapshot: {
      turn,
      assemblyMergeEma,
      instantaneousMerge: sample,
      band: bandFromMerge(assemblyMergeEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      assemblyMergeEma,
    },
  };
}


// --- source: chunk-anchor-alignment-monitor.ts ---
export function buildChunkAnchorAlignmentMonitor(args: {
  turn: number;
  handoffBrief: Agent25AssemblyHandoffBrief;
  wireInTrajectory?: WireInTrajectorySnapshot;
  integrationTrajectory?: IntegrationTrajectorySnapshot;
  handoffTrajectory?: HandoffTrajectorySnapshot;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
  readinessTrajectory?: ReadinessTrajectorySnapshot;
}): ChunkAnchorAlignmentMonitor {
  const reasons: string[] = [];
  const trajectorySlots = [
    args.wireInTrajectory,
    args.integrationTrajectory,
    args.handoffTrajectory,
    args.resumptionTrajectory,
    args.readinessTrajectory,
  ];
  const trajectoryCoverage = trajectorySlots.filter(Boolean).length;
  const requiredTrajectoryCount = trajectorySlots.length;

  let anchorAligned =
    args.handoffBrief.shouldHandoffChunk &&
    args.wireInTrajectory?.band === 'active' &&
    trajectoryCoverage === requiredTrajectoryCount;

  if (!args.handoffBrief.shouldHandoffChunk) {
    reasons.push('Assembly handoff not set');
    anchorAligned = false;
  }
  if (args.wireInTrajectory?.band !== 'active') {
    reasons.push(`Wire-in band ${args.wireInTrajectory?.band ?? 'missing'} (need active)`);
    anchorAligned = false;
  }
  if (trajectoryCoverage < requiredTrajectoryCount) {
    reasons.push(`Trajectory coverage ${trajectoryCoverage}/${requiredTrajectoryCount}`);
    anchorAligned = false;
  }

  const summary = anchorAligned
    ? `OP10M anchor alignment: ${trajectoryCoverage}/${requiredTrajectoryCount} trajectories ready`
    : reasons.length > 0
      ? `Anchor alignment blocked — ${reasons[0]}`
      : 'Anchor alignment pending';

  return {
    turn: args.turn,
    anchorAligned,
    trajectoryCoverage,
    requiredTrajectoryCount,
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-inline-readiness-brief.ts ---
export function composeAgent25InlineReadinessBrief(args: {
  turn: number;
  anchorMonitor: ChunkAnchorAlignmentMonitor;
  assemblyMergeTrajectory?: AssemblyMergeTrajectorySnapshot;
}): Agent25InlineReadinessBrief {
  const shouldInlineChunk =
    args.anchorMonitor.anchorAligned && args.assemblyMergeTrajectory?.band === 'ready';

  const headlines: string[] = [];
  if (shouldInlineChunk) {
    headlines.push('Agent 25: inline chunk at O10M_AGENT14_CAPACITY_DELAY_ANCHOR');
  } else {
    headlines.push('Agent 25 inline deferred — anchor or merge trajectory not ready');
  }
  if (args.anchorMonitor.trajectoryCoverage > 0) {
    headlines.push(
      `${args.anchorMonitor.trajectoryCoverage}/${args.anchorMonitor.requiredTrajectoryCount} persisted trajectories aligned`
    );
  }
  if (args.assemblyMergeTrajectory?.trajectory === 'improving') {
    headlines.push('Assembly merge trajectory improving');
  }

  const summary = `inline=${shouldInlineChunk} anchor=${args.anchorMonitor.anchorAligned} mergeBand=${args.assemblyMergeTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldInlineChunk,
    anchorAligned: args.anchorMonitor.anchorAligned,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: inline-merge-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function inlineSample(brief: Agent25InlineReadinessBrief): number {
  let sample = brief.shouldInlineChunk ? 22 : 71;
  if (!brief.anchorAligned) {
    sample += 16;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialInlineMergeTrajectory(): InlineMergeTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    inlineMergeEma: 46,
    priorEma: undefined,
  };
}

export function sanitizeInlineMergeTrajectory(
  raw?: InlineMergeTrajectoryPersisted | null
): InlineMergeTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialInlineMergeTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const inlineMergeEma =
    typeof raw.inlineMergeEma === 'number' && Number.isFinite(raw.inlineMergeEma)
      ? Math.max(0, Math.min(100, raw.inlineMergeEma))
      : 46;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    inlineMergeEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromInline(score: number, brief: Agent25InlineReadinessBrief): InlineMergeBand {
  if (brief.shouldInlineChunk && score <= 34) return 'ready';
  if (score >= 66) return 'blocked';
  return 'pending';
}

export function advanceInlineMergeTrajectory(
  turn: number,
  brief: Agent25InlineReadinessBrief,
  persisted?: InlineMergeTrajectoryPersisted | null
): { snapshot: InlineMergeTrajectorySnapshot; persisted: InlineMergeTrajectoryPersisted } {
  const base = sanitizeInlineMergeTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = inlineSample(brief);
  const priorEma = base.inlineMergeEma;
  const inlineMergeEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(inlineMergeEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Inline merge EMA improving (${priorEma} → ${inlineMergeEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Inline merge EMA softening (${priorEma} → ${inlineMergeEma})`);
  }
  if (brief.shouldInlineChunk) {
    evidence.push('Agent 25 inline readiness signal active');
  }

  return {
    snapshot: {
      turn,
      inlineMergeEma,
      instantaneousInline: sample,
      band: bandFromInline(inlineMergeEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      inlineMergeEma,
    },
  };
}


// --- source: inline-activation-monitor.ts ---
export function buildInlineActivationMonitor(args: {
  turn: number;
  inlineBrief: Agent25InlineReadinessBrief;
  inlineMergeTrajectory?: InlineMergeTrajectorySnapshot;
  activationMonitor: TurnBoundaryActivationMonitor;
}): InlineActivationMonitor {
  const reasons: string[] = [];
  let shouldActivateInline =
    args.inlineBrief.shouldInlineChunk &&
    args.inlineMergeTrajectory?.band === 'ready' &&
    args.activationMonitor.shouldActivateTurnBoundary;

  if (!args.inlineBrief.shouldInlineChunk) {
    reasons.push('Inline readiness not set');
    shouldActivateInline = false;
  }
  if (args.inlineMergeTrajectory?.band !== 'ready') {
    reasons.push(`Inline merge band ${args.inlineMergeTrajectory?.band ?? 'missing'} (need ready)`);
    shouldActivateInline = false;
  }
  if (!args.activationMonitor.shouldActivateTurnBoundary) {
    reasons.push('Turn boundary activation blocked');
    shouldActivateInline = false;
  }

  const summary = shouldActivateInline
    ? `Inline activation: ready at OP10M anchor (merge EMA ${args.inlineMergeTrajectory?.inlineMergeEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Inline activation blocked — ${reasons[0]}`
      : 'Inline activation pending';

  return {
    turn: args.turn,
    shouldActivateInline,
    inlineMergeBand: args.inlineMergeTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave17-projection-handoff-brief.ts ---
export function composeAgent25Wave17ProjectionHandoffBrief(args: {
  turn: number;
  inlineActivationMonitor: InlineActivationMonitor;
  inlineMergeTrajectory?: InlineMergeTrajectorySnapshot;
}): Agent25Wave17ProjectionHandoffBrief {
  const shouldProjectWave17 =
    args.inlineActivationMonitor.shouldActivateInline &&
    args.inlineMergeTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave17) {
    headlines.push('Agent 25: project wave 17 module gate after inline activation');
  } else {
    headlines.push('Agent 25 wave 17 projection deferred — inline path not stable');
  }
  if (args.inlineMergeTrajectory?.band === 'ready') {
    headlines.push('Inline merge trajectory ready for O10-164 dry-run');
  }
  if (args.inlineActivationMonitor.inlineMergeBand === 'blocked') {
    headlines.push('Inline merge band blocked — hold projection handoff');
  }

  const summary = `project=${shouldProjectWave17} inline=${args.inlineActivationMonitor.shouldActivateInline} band=${args.inlineMergeTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave17,
    shouldActivateInline: args.inlineActivationMonitor.shouldActivateInline,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: projection-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave17ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave17 ? 19 : 73;
  if (!brief.shouldActivateInline) {
    sample += 15;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialProjectionGateTrajectory(): ProjectionGateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    projectionGateEma: 44,
    priorEma: undefined,
  };
}

export function sanitizeProjectionGateTrajectory(
  raw?: ProjectionGateTrajectoryPersisted | null
): ProjectionGateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialProjectionGateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const projectionGateEma =
    typeof raw.projectionGateEma === 'number' && Number.isFinite(raw.projectionGateEma)
      ? Math.max(0, Math.min(100, raw.projectionGateEma))
      : 44;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    projectionGateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave17ProjectionHandoffBrief): ProjectionGateBand {
  if (brief.shouldProjectWave17 && score <= 33) return 'ready';
  if (score >= 67) return 'blocked';
  return 'pending';
}

export function advanceProjectionGateTrajectory(
  turn: number,
  brief: Agent25Wave17ProjectionHandoffBrief,
  persisted?: ProjectionGateTrajectoryPersisted | null
): { snapshot: ProjectionGateTrajectorySnapshot; persisted: ProjectionGateTrajectoryPersisted } {
  const base = sanitizeProjectionGateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.projectionGateEma;
  const projectionGateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(projectionGateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Projection gate EMA improving (${priorEma} → ${projectionGateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Projection gate EMA softening (${priorEma} → ${projectionGateEma})`);
  }
  if (brief.shouldProjectWave17) {
    evidence.push('Agent 25 wave 17 projection signal active');
  }

  return {
    snapshot: {
      turn,
      projectionGateEma,
      instantaneousGate: sample,
      band: bandFromGate(projectionGateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      projectionGateEma,
    },
  };
}


// --- source: wave18-projection-monitor.ts ---
export function buildWave18ProjectionMonitor(args: {
  turn: number;
  wave17ProjectionBrief: Agent25Wave17ProjectionHandoffBrief;
  projectionGateTrajectory?: ProjectionGateTrajectorySnapshot;
  inlineActivationMonitor: InlineActivationMonitor;
}): Wave18ProjectionMonitor {
  const reasons: string[] = [];
  let shouldRunO10m167DryRun =
    args.wave17ProjectionBrief.shouldProjectWave17 &&
    args.projectionGateTrajectory?.band === 'ready' &&
    args.inlineActivationMonitor.shouldActivateInline;

  if (!args.wave17ProjectionBrief.shouldProjectWave17) {
    reasons.push('Wave 17 projection not cleared');
    shouldRunO10m167DryRun = false;
  }
  if (args.projectionGateTrajectory?.band !== 'ready') {
    reasons.push(
      `Projection gate band ${args.projectionGateTrajectory?.band ?? 'missing'} (need ready)`
    );
    shouldRunO10m167DryRun = false;
  }
  if (!args.inlineActivationMonitor.shouldActivateInline) {
    reasons.push('Inline activation blocked for wave 18 gate');
    shouldRunO10m167DryRun = false;
  }

  const summary = shouldRunO10m167DryRun
    ? `Wave 18 O10-167 dry-run gate ready (gate EMA ${args.projectionGateTrajectory?.projectionGateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 18 projection deferred — ${reasons[0]}`
      : 'Wave 18 projection pending';

  return {
    turn: args.turn,
    shouldRunO10m167DryRun,
    projectionGateBand: args.projectionGateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave18-projection-handoff-brief.ts ---
export function composeAgent25Wave18ProjectionHandoffBrief(args: {
  turn: number;
  wave18ProjectionMonitor: Wave18ProjectionMonitor;
  projectionGateTrajectory?: ProjectionGateTrajectorySnapshot;
}): Agent25Wave18ProjectionHandoffBrief {
  const shouldProjectWave18 =
    args.wave18ProjectionMonitor.shouldRunO10m167DryRun &&
    args.projectionGateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave18) {
    headlines.push('Agent 25: project wave 18 module gate / O10-167 dry-run');
  } else {
    headlines.push('Agent 25 wave 18 projection deferred — gate path not stable');
  }
  if (args.projectionGateTrajectory?.band === 'ready') {
    headlines.push('Projection gate trajectory ready for O10-167 integration handoff');
  }
  if (args.wave18ProjectionMonitor.projectionGateBand === 'blocked') {
    headlines.push('Projection gate blocked — hold O10-167 handoff');
  }

  const summary = `project=${shouldProjectWave18} o10m167=${args.wave18ProjectionMonitor.shouldRunO10m167DryRun} band=${args.projectionGateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave18,
    shouldRunO10m167DryRun: args.wave18ProjectionMonitor.shouldRunO10m167DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave19-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave18ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave18 ? 18 : 72;
  if (!brief.shouldRunO10m167DryRun) {
    sample += 14;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave19GateTrajectory(): Wave19GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave19GateEma: 42,
    priorEma: undefined,
  };
}

export function sanitizeWave19GateTrajectory(
  raw?: Wave19GateTrajectoryPersisted | null
): Wave19GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave19GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave19GateEma =
    typeof raw.wave19GateEma === 'number' && Number.isFinite(raw.wave19GateEma)
      ? Math.max(0, Math.min(100, raw.wave19GateEma))
      : 42;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave19GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave18ProjectionHandoffBrief): Wave19GateBand {
  if (brief.shouldProjectWave18 && score <= 32) return 'ready';
  if (score >= 66) return 'blocked';
  return 'pending';
}

export function advanceWave19GateTrajectory(
  turn: number,
  brief: Agent25Wave18ProjectionHandoffBrief,
  persisted?: Wave19GateTrajectoryPersisted | null
): { snapshot: Wave19GateTrajectorySnapshot; persisted: Wave19GateTrajectoryPersisted } {
  const base = sanitizeWave19GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave19GateEma;
  const wave19GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave19GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 19 gate EMA improving (${priorEma} → ${wave19GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 19 gate EMA softening (${priorEma} → ${wave19GateEma})`);
  }
  if (brief.shouldProjectWave18) {
    evidence.push('Agent 25 wave 18 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave19GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave19GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave19GateEma,
    },
  };
}


// --- source: wave19-integration-monitor.ts ---
export function buildWave19IntegrationMonitor(args: {
  turn: number;
  wave18ProjectionBrief: Agent25Wave18ProjectionHandoffBrief;
  wave19GateTrajectory?: Wave19GateTrajectorySnapshot;
  wave18ProjectionMonitor: Wave18ProjectionMonitor;
}): Wave19IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m169DryRun =
    args.wave18ProjectionBrief.shouldProjectWave18 &&
    args.wave19GateTrajectory?.band === 'ready' &&
    args.wave18ProjectionMonitor.shouldRunO10m167DryRun;

  if (!args.wave18ProjectionBrief.shouldProjectWave18) {
    reasons.push('Wave 18 projection not cleared');
    shouldRunO10m169DryRun = false;
  }
  if (args.wave19GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 19 gate band ${args.wave19GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m169DryRun = false;
  }
  if (!args.wave18ProjectionMonitor.shouldRunO10m167DryRun) {
    reasons.push('O10-167 dry-run path blocked for wave 19 gate');
    shouldRunO10m169DryRun = false;
  }

  const summary = shouldRunO10m169DryRun
    ? `Wave 19 O10-169 dry-run gate ready (gate EMA ${args.wave19GateTrajectory?.wave19GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 19 integration deferred — ${reasons[0]}`
      : 'Wave 19 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m169DryRun,
    wave19GateBand: args.wave19GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave19-projection-handoff-brief.ts ---
export function composeAgent25Wave19ProjectionHandoffBrief(args: {
  turn: number;
  wave19IntegrationMonitor: Wave19IntegrationMonitor;
  wave19GateTrajectory?: Wave19GateTrajectorySnapshot;
}): Agent25Wave19ProjectionHandoffBrief {
  const shouldProjectWave19 =
    args.wave19IntegrationMonitor.shouldRunO10m169DryRun &&
    args.wave19GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave19) {
    headlines.push('Agent 25: project wave 19 module gate / O10-169 dry-run');
  } else {
    headlines.push('Agent 25 wave 19 projection deferred — integration gate not stable');
  }
  if (args.wave19GateTrajectory?.band === 'ready') {
    headlines.push('Wave 19 gate trajectory ready for O10-169 projection handoff');
  }
  if (args.wave19IntegrationMonitor.wave19GateBand === 'blocked') {
    headlines.push('Wave 19 gate blocked — hold O10-169 handoff');
  }

  const summary = `project=${shouldProjectWave19} o10m169=${args.wave19IntegrationMonitor.shouldRunO10m169DryRun} band=${args.wave19GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave19,
    shouldRunO10m169DryRun: args.wave19IntegrationMonitor.shouldRunO10m169DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave20-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave19ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave19 ? 17 : 71;
  if (!brief.shouldRunO10m169DryRun) {
    sample += 13;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave20GateTrajectory(): Wave20GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave20GateEma: 40,
    priorEma: undefined,
  };
}

export function sanitizeWave20GateTrajectory(
  raw?: Wave20GateTrajectoryPersisted | null
): Wave20GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave20GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave20GateEma =
    typeof raw.wave20GateEma === 'number' && Number.isFinite(raw.wave20GateEma)
      ? Math.max(0, Math.min(100, raw.wave20GateEma))
      : 40;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave20GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave19ProjectionHandoffBrief): Wave20GateBand {
  if (brief.shouldProjectWave19 && score <= 31) return 'ready';
  if (score >= 65) return 'blocked';
  return 'pending';
}

export function advanceWave20GateTrajectory(
  turn: number,
  brief: Agent25Wave19ProjectionHandoffBrief,
  persisted?: Wave20GateTrajectoryPersisted | null
): { snapshot: Wave20GateTrajectorySnapshot; persisted: Wave20GateTrajectoryPersisted } {
  const base = sanitizeWave20GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave20GateEma;
  const wave20GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave20GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 20 gate EMA improving (${priorEma} → ${wave20GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 20 gate EMA softening (${priorEma} → ${wave20GateEma})`);
  }
  if (brief.shouldProjectWave19) {
    evidence.push('Agent 25 wave 19 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave20GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave20GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave20GateEma,
    },
  };
}


// --- source: wave20-integration-monitor.ts ---
export function buildWave20IntegrationMonitor(args: {
  turn: number;
  wave19ProjectionBrief: Agent25Wave19ProjectionHandoffBrief;
  wave20GateTrajectory?: Wave20GateTrajectorySnapshot;
  wave19IntegrationMonitor: Wave19IntegrationMonitor;
}): Wave20IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m171DryRun =
    args.wave19ProjectionBrief.shouldProjectWave19 &&
    args.wave20GateTrajectory?.band === 'ready' &&
    args.wave19IntegrationMonitor.shouldRunO10m169DryRun;

  if (!args.wave19ProjectionBrief.shouldProjectWave19) {
    reasons.push('Wave 19 projection not cleared');
    shouldRunO10m171DryRun = false;
  }
  if (args.wave20GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 20 gate band ${args.wave20GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m171DryRun = false;
  }
  if (!args.wave19IntegrationMonitor.shouldRunO10m169DryRun) {
    reasons.push('O10-169 dry-run path blocked for wave 20 gate');
    shouldRunO10m171DryRun = false;
  }

  const summary = shouldRunO10m171DryRun
    ? `Wave 20 O10-171 dry-run gate ready (gate EMA ${args.wave20GateTrajectory?.wave20GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 20 integration deferred — ${reasons[0]}`
      : 'Wave 20 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m171DryRun,
    wave20GateBand: args.wave20GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave20-projection-handoff-brief.ts ---
export function composeAgent25Wave20ProjectionHandoffBrief(args: {
  turn: number;
  wave20IntegrationMonitor: Wave20IntegrationMonitor;
  wave20GateTrajectory?: Wave20GateTrajectorySnapshot;
}): Agent25Wave20ProjectionHandoffBrief {
  const shouldProjectWave20 =
    args.wave20IntegrationMonitor.shouldRunO10m171DryRun &&
    args.wave20GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave20) {
    headlines.push('Agent 25: project wave 20 module gate / O10-171 dry-run');
  } else {
    headlines.push('Agent 25 wave 20 projection deferred — tranche gate not stable');
  }
  if (args.wave20GateTrajectory?.band === 'ready') {
    headlines.push('Wave 20 gate trajectory ready for O10-171 projection handoff');
  }
  if (args.wave20IntegrationMonitor.wave20GateBand === 'blocked') {
    headlines.push('Wave 20 gate blocked — hold O10-171 handoff');
  }

  const summary = `project=${shouldProjectWave20} o10m171=${args.wave20IntegrationMonitor.shouldRunO10m171DryRun} band=${args.wave20GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave20,
    shouldRunO10m171DryRun: args.wave20IntegrationMonitor.shouldRunO10m171DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave21-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave20ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave20 ? 16 : 70;
  if (!brief.shouldRunO10m171DryRun) {
    sample += 12;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave21GateTrajectory(): Wave21GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave21GateEma: 38,
    priorEma: undefined,
  };
}

export function sanitizeWave21GateTrajectory(
  raw?: Wave21GateTrajectoryPersisted | null
): Wave21GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave21GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave21GateEma =
    typeof raw.wave21GateEma === 'number' && Number.isFinite(raw.wave21GateEma)
      ? Math.max(0, Math.min(100, raw.wave21GateEma))
      : 38;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave21GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave20ProjectionHandoffBrief): Wave21GateBand {
  if (brief.shouldProjectWave20 && score <= 30) return 'ready';
  if (score >= 64) return 'blocked';
  return 'pending';
}

export function advanceWave21GateTrajectory(
  turn: number,
  brief: Agent25Wave20ProjectionHandoffBrief,
  persisted?: Wave21GateTrajectoryPersisted | null
): { snapshot: Wave21GateTrajectorySnapshot; persisted: Wave21GateTrajectoryPersisted } {
  const base = sanitizeWave21GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave21GateEma;
  const wave21GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave21GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 21 gate EMA improving (${priorEma} → ${wave21GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 21 gate EMA softening (${priorEma} → ${wave21GateEma})`);
  }
  if (brief.shouldProjectWave20) {
    evidence.push('Agent 25 wave 20 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave21GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave21GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave21GateEma,
    },
  };
}


// --- source: wave21-integration-monitor.ts ---
export function buildWave21IntegrationMonitor(args: {
  turn: number;
  wave20ProjectionBrief: Agent25Wave20ProjectionHandoffBrief;
  wave21GateTrajectory?: Wave21GateTrajectorySnapshot;
  wave20IntegrationMonitor: Wave20IntegrationMonitor;
}): Wave21IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m174DryRun =
    args.wave20ProjectionBrief.shouldProjectWave20 &&
    args.wave21GateTrajectory?.band === 'ready' &&
    args.wave20IntegrationMonitor.shouldRunO10m171DryRun;

  if (!args.wave20ProjectionBrief.shouldProjectWave20) {
    reasons.push('Wave 20 projection not cleared');
    shouldRunO10m174DryRun = false;
  }
  if (args.wave21GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 21 gate band ${args.wave21GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m174DryRun = false;
  }
  if (!args.wave20IntegrationMonitor.shouldRunO10m171DryRun) {
    reasons.push('O10-171 dry-run path blocked for wave 21 gate');
    shouldRunO10m174DryRun = false;
  }

  const summary = shouldRunO10m174DryRun
    ? `Wave 21 O10-174 dry-run gate ready (gate EMA ${args.wave21GateTrajectory?.wave21GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 21 integration deferred — ${reasons[0]}`
      : 'Wave 21 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m174DryRun,
    wave21GateBand: args.wave21GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave21-projection-handoff-brief.ts ---
export function composeAgent25Wave21ProjectionHandoffBrief(args: {
  turn: number;
  wave21IntegrationMonitor: Wave21IntegrationMonitor;
  wave21GateTrajectory?: Wave21GateTrajectorySnapshot;
}): Agent25Wave21ProjectionHandoffBrief {
  const shouldProjectWave21 =
    args.wave21IntegrationMonitor.shouldRunO10m174DryRun &&
    args.wave21GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave21) {
    headlines.push('Agent 25: project wave 21 module gate / O10-174 dry-run');
  } else {
    headlines.push('Agent 25 wave 21 projection deferred — integration gate not stable');
  }
  if (args.wave21GateTrajectory?.band === 'ready') {
    headlines.push('Wave 21 gate trajectory ready for O10-174 projection handoff');
  }
  if (args.wave21IntegrationMonitor.wave21GateBand === 'blocked') {
    headlines.push('Wave 21 gate blocked — hold O10-174 handoff');
  }

  const summary = `project=${shouldProjectWave21} o10m174=${args.wave21IntegrationMonitor.shouldRunO10m174DryRun} band=${args.wave21GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave21,
    shouldRunO10m174DryRun: args.wave21IntegrationMonitor.shouldRunO10m174DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave22-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave21ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave21 ? 15 : 69;
  if (!brief.shouldRunO10m174DryRun) {
    sample += 11;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave22GateTrajectory(): Wave22GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave22GateEma: 36,
    priorEma: undefined,
  };
}

export function sanitizeWave22GateTrajectory(
  raw?: Wave22GateTrajectoryPersisted | null
): Wave22GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave22GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave22GateEma =
    typeof raw.wave22GateEma === 'number' && Number.isFinite(raw.wave22GateEma)
      ? Math.max(0, Math.min(100, raw.wave22GateEma))
      : 36;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave22GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave21ProjectionHandoffBrief): Wave22GateBand {
  if (brief.shouldProjectWave21 && score <= 29) return 'ready';
  if (score >= 63) return 'blocked';
  return 'pending';
}

export function advanceWave22GateTrajectory(
  turn: number,
  brief: Agent25Wave21ProjectionHandoffBrief,
  persisted?: Wave22GateTrajectoryPersisted | null
): { snapshot: Wave22GateTrajectorySnapshot; persisted: Wave22GateTrajectoryPersisted } {
  const base = sanitizeWave22GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave22GateEma;
  const wave22GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave22GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 22 gate EMA improving (${priorEma} → ${wave22GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 22 gate EMA softening (${priorEma} → ${wave22GateEma})`);
  }
  if (brief.shouldProjectWave21) {
    evidence.push('Agent 25 wave 21 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave22GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave22GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave22GateEma,
    },
  };
}


// --- source: wave22-integration-monitor.ts ---
export function buildWave22IntegrationMonitor(args: {
  turn: number;
  wave21ProjectionBrief: Agent25Wave21ProjectionHandoffBrief;
  wave22GateTrajectory?: Wave22GateTrajectorySnapshot;
  wave21IntegrationMonitor: Wave21IntegrationMonitor;
}): Wave22IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m176DryRun =
    args.wave21ProjectionBrief.shouldProjectWave21 &&
    args.wave22GateTrajectory?.band === 'ready' &&
    args.wave21IntegrationMonitor.shouldRunO10m174DryRun;

  if (!args.wave21ProjectionBrief.shouldProjectWave21) {
    reasons.push('Wave 21 projection not cleared');
    shouldRunO10m176DryRun = false;
  }
  if (args.wave22GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 22 gate band ${args.wave22GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m176DryRun = false;
  }
  if (!args.wave21IntegrationMonitor.shouldRunO10m174DryRun) {
    reasons.push('O10-174 dry-run path blocked for wave 22 gate');
    shouldRunO10m176DryRun = false;
  }

  const summary = shouldRunO10m176DryRun
    ? `Wave 22 O10-176 dry-run gate ready (gate EMA ${args.wave22GateTrajectory?.wave22GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 22 integration deferred — ${reasons[0]}`
      : 'Wave 22 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m176DryRun,
    wave22GateBand: args.wave22GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave22-projection-handoff-brief.ts ---
export function composeAgent25Wave22ProjectionHandoffBrief(args: {
  turn: number;
  wave22IntegrationMonitor: Wave22IntegrationMonitor;
  wave22GateTrajectory?: Wave22GateTrajectorySnapshot;
}): Agent25Wave22ProjectionHandoffBrief {
  const shouldProjectWave22 =
    args.wave22IntegrationMonitor.shouldRunO10m176DryRun &&
    args.wave22GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave22) {
    headlines.push('Agent 25: project wave 22 module gate / O10-176 dry-run');
  } else {
    headlines.push('Agent 25 wave 22 projection deferred — integration gate not stable');
  }
  if (args.wave22GateTrajectory?.band === 'ready') {
    headlines.push('Wave 22 gate trajectory ready for O10-176 projection handoff');
  }
  if (args.wave22IntegrationMonitor.wave22GateBand === 'blocked') {
    headlines.push('Wave 22 gate blocked — hold O10-176 handoff');
  }

  const summary = `project=${shouldProjectWave22} o10m176=${args.wave22IntegrationMonitor.shouldRunO10m176DryRun} band=${args.wave22GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave22,
    shouldRunO10m176DryRun: args.wave22IntegrationMonitor.shouldRunO10m176DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave23-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave22ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave22 ? 14 : 68;
  if (!brief.shouldRunO10m176DryRun) {
    sample += 10;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave23GateTrajectory(): Wave23GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave23GateEma: 34,
    priorEma: undefined,
  };
}

export function sanitizeWave23GateTrajectory(
  raw?: Wave23GateTrajectoryPersisted | null
): Wave23GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave23GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave23GateEma =
    typeof raw.wave23GateEma === 'number' && Number.isFinite(raw.wave23GateEma)
      ? Math.max(0, Math.min(100, raw.wave23GateEma))
      : 34;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave23GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave22ProjectionHandoffBrief): Wave23GateBand {
  if (brief.shouldProjectWave22 && score <= 28) return 'ready';
  if (score >= 62) return 'blocked';
  return 'pending';
}

export function advanceWave23GateTrajectory(
  turn: number,
  brief: Agent25Wave22ProjectionHandoffBrief,
  persisted?: Wave23GateTrajectoryPersisted | null
): { snapshot: Wave23GateTrajectorySnapshot; persisted: Wave23GateTrajectoryPersisted } {
  const base = sanitizeWave23GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave23GateEma;
  const wave23GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave23GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 23 gate EMA improving (${priorEma} → ${wave23GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 23 gate EMA softening (${priorEma} → ${wave23GateEma})`);
  }
  if (brief.shouldProjectWave22) {
    evidence.push('Agent 25 wave 22 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave23GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave23GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave23GateEma,
    },
  };
}


// --- source: wave23-integration-monitor.ts ---
export function buildWave23IntegrationMonitor(args: {
  turn: number;
  wave22ProjectionBrief: Agent25Wave22ProjectionHandoffBrief;
  wave23GateTrajectory?: Wave23GateTrajectorySnapshot;
  wave22IntegrationMonitor: Wave22IntegrationMonitor;
}): Wave23IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m178DryRun =
    args.wave22ProjectionBrief.shouldProjectWave22 &&
    args.wave23GateTrajectory?.band === 'ready' &&
    args.wave22IntegrationMonitor.shouldRunO10m176DryRun;

  if (!args.wave22ProjectionBrief.shouldProjectWave22) {
    reasons.push('Wave 22 projection not cleared');
    shouldRunO10m178DryRun = false;
  }
  if (args.wave23GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 23 gate band ${args.wave23GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m178DryRun = false;
  }
  if (!args.wave22IntegrationMonitor.shouldRunO10m176DryRun) {
    reasons.push('O10-176 dry-run path blocked for wave 23 gate');
    shouldRunO10m178DryRun = false;
  }

  const summary = shouldRunO10m178DryRun
    ? `Wave 23 O10-178 dry-run gate ready (gate EMA ${args.wave23GateTrajectory?.wave23GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 23 integration deferred — ${reasons[0]}`
      : 'Wave 23 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m178DryRun,
    wave23GateBand: args.wave23GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave23-projection-handoff-brief.ts ---
export function composeAgent25Wave23ProjectionHandoffBrief(args: {
  turn: number;
  wave23IntegrationMonitor: Wave23IntegrationMonitor;
  wave23GateTrajectory?: Wave23GateTrajectorySnapshot;
}): Agent25Wave23ProjectionHandoffBrief {
  const shouldProjectWave23 =
    args.wave23IntegrationMonitor.shouldRunO10m178DryRun &&
    args.wave23GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave23) {
    headlines.push('Agent 25: project wave 23 module gate / O10-178 dry-run');
  } else {
    headlines.push('Agent 25 wave 23 projection deferred — integration gate not stable');
  }
  if (args.wave23GateTrajectory?.band === 'ready') {
    headlines.push('Wave 23 gate trajectory ready for O10-178 projection handoff');
  }
  if (args.wave23IntegrationMonitor.wave23GateBand === 'blocked') {
    headlines.push('Wave 23 gate blocked — hold O10-178 handoff');
  }

  const summary = `project=${shouldProjectWave23} o10m178=${args.wave23IntegrationMonitor.shouldRunO10m178DryRun} band=${args.wave23GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave23,
    shouldRunO10m178DryRun: args.wave23IntegrationMonitor.shouldRunO10m178DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave24-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave23ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave23 ? 13 : 67;
  if (!brief.shouldRunO10m178DryRun) {
    sample += 9;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave24GateTrajectory(): Wave24GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave24GateEma: 32,
    priorEma: undefined,
  };
}

export function sanitizeWave24GateTrajectory(
  raw?: Wave24GateTrajectoryPersisted | null
): Wave24GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave24GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave24GateEma =
    typeof raw.wave24GateEma === 'number' && Number.isFinite(raw.wave24GateEma)
      ? Math.max(0, Math.min(100, raw.wave24GateEma))
      : 32;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave24GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave23ProjectionHandoffBrief): Wave24GateBand {
  if (brief.shouldProjectWave23 && score <= 27) return 'ready';
  if (score >= 61) return 'blocked';
  return 'pending';
}

export function advanceWave24GateTrajectory(
  turn: number,
  brief: Agent25Wave23ProjectionHandoffBrief,
  persisted?: Wave24GateTrajectoryPersisted | null
): { snapshot: Wave24GateTrajectorySnapshot; persisted: Wave24GateTrajectoryPersisted } {
  const base = sanitizeWave24GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave24GateEma;
  const wave24GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave24GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 24 gate EMA improving (${priorEma} → ${wave24GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 24 gate EMA softening (${priorEma} → ${wave24GateEma})`);
  }
  if (brief.shouldProjectWave23) {
    evidence.push('Agent 25 wave 23 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave24GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave24GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave24GateEma,
    },
  };
}


// --- source: wave24-integration-monitor.ts ---
export function buildWave24IntegrationMonitor(args: {
  turn: number;
  wave23ProjectionBrief: Agent25Wave23ProjectionHandoffBrief;
  wave24GateTrajectory?: Wave24GateTrajectorySnapshot;
  wave23IntegrationMonitor: Wave23IntegrationMonitor;
}): Wave24IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m180DryRun =
    args.wave23ProjectionBrief.shouldProjectWave23 &&
    args.wave24GateTrajectory?.band === 'ready' &&
    args.wave23IntegrationMonitor.shouldRunO10m178DryRun;

  if (!args.wave23ProjectionBrief.shouldProjectWave23) {
    reasons.push('Wave 23 projection not cleared');
    shouldRunO10m180DryRun = false;
  }
  if (args.wave24GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 24 gate band ${args.wave24GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m180DryRun = false;
  }
  if (!args.wave23IntegrationMonitor.shouldRunO10m178DryRun) {
    reasons.push('O10-178 dry-run path blocked for wave 24 gate');
    shouldRunO10m180DryRun = false;
  }

  const summary = shouldRunO10m180DryRun
    ? `Wave 24 O10-180 dry-run gate ready (gate EMA ${args.wave24GateTrajectory?.wave24GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 24 integration deferred — ${reasons[0]}`
      : 'Wave 24 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m180DryRun,
    wave24GateBand: args.wave24GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave24-projection-handoff-brief.ts ---
export function composeAgent25Wave24ProjectionHandoffBrief(args: {
  turn: number;
  wave24IntegrationMonitor: Wave24IntegrationMonitor;
  wave24GateTrajectory?: Wave24GateTrajectorySnapshot;
}): Agent25Wave24ProjectionHandoffBrief {
  const shouldProjectWave24 =
    args.wave24IntegrationMonitor.shouldRunO10m180DryRun &&
    args.wave24GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave24) {
    headlines.push('Agent 25: project wave 24 module gate / O10-180 dry-run');
  } else {
    headlines.push('Agent 25 wave 24 projection deferred — integration gate not stable');
  }
  if (args.wave24GateTrajectory?.band === 'ready') {
    headlines.push('Wave 24 gate trajectory ready for O10-180 projection handoff');
  }
  if (args.wave24IntegrationMonitor.wave24GateBand === 'blocked') {
    headlines.push('Wave 24 gate blocked — hold O10-180 handoff');
  }

  const summary = `project=${shouldProjectWave24} o10m180=${args.wave24IntegrationMonitor.shouldRunO10m180DryRun} band=${args.wave24GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave24,
    shouldRunO10m180DryRun: args.wave24IntegrationMonitor.shouldRunO10m180DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave25-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave24ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave24 ? 12 : 66;
  if (!brief.shouldRunO10m180DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave25GateTrajectory(): Wave25GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave25GateEma: 30,
    priorEma: undefined,
  };
}

export function sanitizeWave25GateTrajectory(
  raw?: Wave25GateTrajectoryPersisted | null
): Wave25GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave25GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave25GateEma =
    typeof raw.wave25GateEma === 'number' && Number.isFinite(raw.wave25GateEma)
      ? Math.max(0, Math.min(100, raw.wave25GateEma))
      : 30;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave25GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave24ProjectionHandoffBrief): Wave25GateBand {
  if (brief.shouldProjectWave24 && score <= 26) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave25GateTrajectory(
  turn: number,
  brief: Agent25Wave24ProjectionHandoffBrief,
  persisted?: Wave25GateTrajectoryPersisted | null
): { snapshot: Wave25GateTrajectorySnapshot; persisted: Wave25GateTrajectoryPersisted } {
  const base = sanitizeWave25GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave25GateEma;
  const wave25GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave25GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 25 gate EMA improving (${priorEma} → ${wave25GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 25 gate EMA softening (${priorEma} → ${wave25GateEma})`);
  }
  if (brief.shouldProjectWave24) {
    evidence.push('Agent 25 wave 24 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave25GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave25GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave25GateEma,
    },
  };
}


// --- source: wave25-integration-monitor.ts ---
export function buildWave25IntegrationMonitor(args: {
  turn: number;
  wave24ProjectionBrief: Agent25Wave24ProjectionHandoffBrief;
  wave25GateTrajectory?: Wave25GateTrajectorySnapshot;
  wave24IntegrationMonitor: Wave24IntegrationMonitor;
}): Wave25IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m182DryRun =
    args.wave24ProjectionBrief.shouldProjectWave24 &&
    args.wave25GateTrajectory?.band === 'ready' &&
    args.wave24IntegrationMonitor.shouldRunO10m180DryRun;

  if (!args.wave24ProjectionBrief.shouldProjectWave24) {
    reasons.push('Wave 24 projection not cleared');
    shouldRunO10m182DryRun = false;
  }
  if (args.wave25GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 25 gate band ${args.wave25GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m182DryRun = false;
  }
  if (!args.wave24IntegrationMonitor.shouldRunO10m180DryRun) {
    reasons.push('O10-180 dry-run path blocked for wave 25 gate');
    shouldRunO10m182DryRun = false;
  }

  const summary = shouldRunO10m182DryRun
    ? `Wave 25 O10-182 dry-run gate ready (gate EMA ${args.wave25GateTrajectory?.wave25GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 25 integration deferred — ${reasons[0]}`
      : 'Wave 25 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m182DryRun,
    wave25GateBand: args.wave25GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave25-projection-handoff-brief.ts ---
export function composeAgent25Wave25ProjectionHandoffBrief(args: {
  turn: number;
  wave25IntegrationMonitor: Wave25IntegrationMonitor;
  wave25GateTrajectory?: Wave25GateTrajectorySnapshot;
}): Agent25Wave25ProjectionHandoffBrief {
  const shouldProjectWave25 =
    args.wave25IntegrationMonitor.shouldRunO10m182DryRun &&
    args.wave25GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave25) {
    headlines.push('Agent 25: project wave 25 module gate / O10-182 dry-run');
  } else {
    headlines.push('Agent 25 wave 25 projection deferred — integration gate not stable');
  }
  if (args.wave25GateTrajectory?.band === 'ready') {
    headlines.push('Wave 25 gate trajectory ready for O10-182 projection handoff');
  }
  if (args.wave25IntegrationMonitor.wave25GateBand === 'blocked') {
    headlines.push('Wave 25 gate blocked — hold O10-182 handoff');
  }

  const summary = `project=${shouldProjectWave25} o10m182=${args.wave25IntegrationMonitor.shouldRunO10m182DryRun} band=${args.wave25GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave25,
    shouldRunO10m182DryRun: args.wave25IntegrationMonitor.shouldRunO10m182DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave26-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave25ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave25 ? 12 : 66;
  if (!brief.shouldRunO10m182DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave26GateTrajectory(): Wave26GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave26GateEma: 29,
    priorEma: undefined,
  };
}

export function sanitizeWave26GateTrajectory(
  raw?: Wave26GateTrajectoryPersisted | null
): Wave26GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave26GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave26GateEma =
    typeof raw.wave26GateEma === 'number' && Number.isFinite(raw.wave26GateEma)
      ? Math.max(0, Math.min(100, raw.wave26GateEma))
      : 29;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave26GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave25ProjectionHandoffBrief): Wave26GateBand {
  if (brief.shouldProjectWave25 && score <= 25) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave26GateTrajectory(
  turn: number,
  brief: Agent25Wave25ProjectionHandoffBrief,
  persisted?: Wave26GateTrajectoryPersisted | null
): { snapshot: Wave26GateTrajectorySnapshot; persisted: Wave26GateTrajectoryPersisted } {
  const base = sanitizeWave26GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave26GateEma;
  const wave26GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave26GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 26 gate EMA improving (${priorEma} → ${wave26GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 26 gate EMA softening (${priorEma} → ${wave26GateEma})`);
  }
  if (brief.shouldProjectWave25) {
    evidence.push('Agent 25 wave 25 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave26GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave26GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave26GateEma,
    },
  };
}


// --- source: wave26-integration-monitor.ts ---
export function buildWave26IntegrationMonitor(args: {
  turn: number;
  wave25ProjectionBrief: Agent25Wave25ProjectionHandoffBrief;
  wave26GateTrajectory?: Wave26GateTrajectorySnapshot;
  wave25IntegrationMonitor: Wave25IntegrationMonitor;
}): Wave26IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m184DryRun =
    args.wave25ProjectionBrief.shouldProjectWave25 &&
    args.wave26GateTrajectory?.band === 'ready' &&
    args.wave25IntegrationMonitor.shouldRunO10m182DryRun;

  if (!args.wave25ProjectionBrief.shouldProjectWave25) {
    reasons.push('Wave 25 projection not cleared');
    shouldRunO10m184DryRun = false;
  }
  if (args.wave26GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 26 gate band ${args.wave26GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m184DryRun = false;
  }
  if (!args.wave25IntegrationMonitor.shouldRunO10m182DryRun) {
    reasons.push('O10-182 dry-run path blocked for wave 26 gate');
    shouldRunO10m184DryRun = false;
  }

  const summary = shouldRunO10m184DryRun
    ? `Wave 26 O10-184 dry-run gate ready (gate EMA ${args.wave26GateTrajectory?.wave26GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 26 integration deferred — ${reasons[0]}`
      : 'Wave 26 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m184DryRun,
    wave26GateBand: args.wave26GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave26-projection-handoff-brief.ts ---
export function composeAgent25Wave26ProjectionHandoffBrief(args: {
  turn: number;
  wave26IntegrationMonitor: Wave26IntegrationMonitor;
  wave26GateTrajectory?: Wave26GateTrajectorySnapshot;
}): Agent25Wave26ProjectionHandoffBrief {
  const shouldProjectWave26 =
    args.wave26IntegrationMonitor.shouldRunO10m184DryRun &&
    args.wave26GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave26) {
    headlines.push('Agent 25: project wave 26 module gate / O10-184 dry-run');
  } else {
    headlines.push('Agent 25 wave 26 projection deferred — integration gate not stable');
  }
  if (args.wave26GateTrajectory?.band === 'ready') {
    headlines.push('Wave 26 gate trajectory ready for O10-184 projection handoff');
  }
  if (args.wave26IntegrationMonitor.wave26GateBand === 'blocked') {
    headlines.push('Wave 26 gate blocked — hold O10-184 handoff');
  }

  const summary = `project=${shouldProjectWave26} o10m184=${args.wave26IntegrationMonitor.shouldRunO10m184DryRun} band=${args.wave26GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave26,
    shouldRunO10m184DryRun: args.wave26IntegrationMonitor.shouldRunO10m184DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave27-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave26ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave26 ? 12 : 66;
  if (!brief.shouldRunO10m184DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave27GateTrajectory(): Wave27GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave27GateEma: 28,
    priorEma: undefined,
  };
}

export function sanitizeWave27GateTrajectory(
  raw?: Wave27GateTrajectoryPersisted | null
): Wave27GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave27GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave27GateEma =
    typeof raw.wave27GateEma === 'number' && Number.isFinite(raw.wave27GateEma)
      ? Math.max(0, Math.min(100, raw.wave27GateEma))
      : 28;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave27GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave26ProjectionHandoffBrief): Wave27GateBand {
  if (brief.shouldProjectWave26 && score <= 24) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave27GateTrajectory(
  turn: number,
  brief: Agent25Wave26ProjectionHandoffBrief,
  persisted?: Wave27GateTrajectoryPersisted | null
): { snapshot: Wave27GateTrajectorySnapshot; persisted: Wave27GateTrajectoryPersisted } {
  const base = sanitizeWave27GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave27GateEma;
  const wave27GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave27GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 27 gate EMA improving (${priorEma} → ${wave27GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 27 gate EMA softening (${priorEma} → ${wave27GateEma})`);
  }
  if (brief.shouldProjectWave26) {
    evidence.push('Agent 25 wave 26 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave27GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave27GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave27GateEma,
    },
  };
}


// --- source: wave27-integration-monitor.ts ---
export function buildWave27IntegrationMonitor(args: {
  turn: number;
  wave26ProjectionBrief: Agent25Wave26ProjectionHandoffBrief;
  wave27GateTrajectory?: Wave27GateTrajectorySnapshot;
  wave26IntegrationMonitor: Wave26IntegrationMonitor;
}): Wave27IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m186DryRun =
    args.wave26ProjectionBrief.shouldProjectWave26 &&
    args.wave27GateTrajectory?.band === 'ready' &&
    args.wave26IntegrationMonitor.shouldRunO10m184DryRun;

  if (!args.wave26ProjectionBrief.shouldProjectWave26) {
    reasons.push('Wave 26 projection not cleared');
    shouldRunO10m186DryRun = false;
  }
  if (args.wave27GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 27 gate band ${args.wave27GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m186DryRun = false;
  }
  if (!args.wave26IntegrationMonitor.shouldRunO10m184DryRun) {
    reasons.push('O10-184 dry-run path blocked for wave 27 gate');
    shouldRunO10m186DryRun = false;
  }

  const summary = shouldRunO10m186DryRun
    ? `Wave 27 O10-186 dry-run gate ready (gate EMA ${args.wave27GateTrajectory?.wave27GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 27 integration deferred — ${reasons[0]}`
      : 'Wave 27 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m186DryRun,
    wave27GateBand: args.wave27GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave27-projection-handoff-brief.ts ---
export function composeAgent25Wave27ProjectionHandoffBrief(args: {
  turn: number;
  wave27IntegrationMonitor: Wave27IntegrationMonitor;
  wave27GateTrajectory?: Wave27GateTrajectorySnapshot;
}): Agent25Wave27ProjectionHandoffBrief {
  const shouldProjectWave27 =
    args.wave27IntegrationMonitor.shouldRunO10m186DryRun &&
    args.wave27GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave27) {
    headlines.push('Agent 25: project wave 27 module gate / O10-186 dry-run');
  } else {
    headlines.push('Agent 25 wave 27 projection deferred — integration gate not stable');
  }
  if (args.wave27GateTrajectory?.band === 'ready') {
    headlines.push('Wave 27 gate trajectory ready for O10-186 projection handoff');
  }
  if (args.wave27IntegrationMonitor.wave27GateBand === 'blocked') {
    headlines.push('Wave 27 gate blocked — hold O10-186 handoff');
  }

  const summary = `project=${shouldProjectWave27} o10m186=${args.wave27IntegrationMonitor.shouldRunO10m186DryRun} band=${args.wave27GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave27,
    shouldRunO10m186DryRun: args.wave27IntegrationMonitor.shouldRunO10m186DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave28-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave27ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave27 ? 12 : 66;
  if (!brief.shouldRunO10m186DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave28GateTrajectory(): Wave28GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave28GateEma: 27,
    priorEma: undefined,
  };
}

export function sanitizeWave28GateTrajectory(
  raw?: Wave28GateTrajectoryPersisted | null
): Wave28GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave28GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave28GateEma =
    typeof raw.wave28GateEma === 'number' && Number.isFinite(raw.wave28GateEma)
      ? Math.max(0, Math.min(100, raw.wave28GateEma))
      : 27;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave28GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave27ProjectionHandoffBrief): Wave28GateBand {
  if (brief.shouldProjectWave27 && score <= 23) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave28GateTrajectory(
  turn: number,
  brief: Agent25Wave27ProjectionHandoffBrief,
  persisted?: Wave28GateTrajectoryPersisted | null
): { snapshot: Wave28GateTrajectorySnapshot; persisted: Wave28GateTrajectoryPersisted } {
  const base = sanitizeWave28GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave28GateEma;
  const wave28GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave28GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 28 gate EMA improving (${priorEma} → ${wave28GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 28 gate EMA softening (${priorEma} → ${wave28GateEma})`);
  }
  if (brief.shouldProjectWave27) {
    evidence.push('Agent 25 wave 27 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave28GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave28GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave28GateEma,
    },
  };
}


// --- source: wave28-integration-monitor.ts ---
export function buildWave28IntegrationMonitor(args: {
  turn: number;
  wave27ProjectionBrief: Agent25Wave27ProjectionHandoffBrief;
  wave28GateTrajectory?: Wave28GateTrajectorySnapshot;
  wave27IntegrationMonitor: Wave27IntegrationMonitor;
}): Wave28IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m188DryRun =
    args.wave27ProjectionBrief.shouldProjectWave27 &&
    args.wave28GateTrajectory?.band === 'ready' &&
    args.wave27IntegrationMonitor.shouldRunO10m186DryRun;

  if (!args.wave27ProjectionBrief.shouldProjectWave27) {
    reasons.push('Wave 27 projection not cleared');
    shouldRunO10m188DryRun = false;
  }
  if (args.wave28GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 28 gate band ${args.wave28GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m188DryRun = false;
  }
  if (!args.wave27IntegrationMonitor.shouldRunO10m186DryRun) {
    reasons.push('O10-186 dry-run path blocked for wave 28 gate');
    shouldRunO10m188DryRun = false;
  }

  const summary = shouldRunO10m188DryRun
    ? `Wave 28 O10-188 dry-run gate ready (gate EMA ${args.wave28GateTrajectory?.wave28GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 28 integration deferred — ${reasons[0]}`
      : 'Wave 28 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m188DryRun,
    wave28GateBand: args.wave28GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave28-projection-handoff-brief.ts ---
export function composeAgent25Wave28ProjectionHandoffBrief(args: {
  turn: number;
  wave28IntegrationMonitor: Wave28IntegrationMonitor;
  wave28GateTrajectory?: Wave28GateTrajectorySnapshot;
}): Agent25Wave28ProjectionHandoffBrief {
  const shouldProjectWave28 =
    args.wave28IntegrationMonitor.shouldRunO10m188DryRun &&
    args.wave28GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave28) {
    headlines.push('Agent 25: project wave 28 module gate / O10-188 dry-run');
  } else {
    headlines.push('Agent 25 wave 28 projection deferred — integration gate not stable');
  }
  if (args.wave28GateTrajectory?.band === 'ready') {
    headlines.push('Wave 28 gate trajectory ready for O10-188 projection handoff');
  }
  if (args.wave28IntegrationMonitor.wave28GateBand === 'blocked') {
    headlines.push('Wave 28 gate blocked — hold O10-188 handoff');
  }

  const summary = `project=${shouldProjectWave28} o10m188=${args.wave28IntegrationMonitor.shouldRunO10m188DryRun} band=${args.wave28GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave28,
    shouldRunO10m188DryRun: args.wave28IntegrationMonitor.shouldRunO10m188DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave29-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave28ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave28 ? 12 : 66;
  if (!brief.shouldRunO10m188DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave29GateTrajectory(): Wave29GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave29GateEma: 26,
    priorEma: undefined,
  };
}

export function sanitizeWave29GateTrajectory(
  raw?: Wave29GateTrajectoryPersisted | null
): Wave29GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave29GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave29GateEma =
    typeof raw.wave29GateEma === 'number' && Number.isFinite(raw.wave29GateEma)
      ? Math.max(0, Math.min(100, raw.wave29GateEma))
      : 26;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave29GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave28ProjectionHandoffBrief): Wave29GateBand {
  if (brief.shouldProjectWave28 && score <= 22) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave29GateTrajectory(
  turn: number,
  brief: Agent25Wave28ProjectionHandoffBrief,
  persisted?: Wave29GateTrajectoryPersisted | null
): { snapshot: Wave29GateTrajectorySnapshot; persisted: Wave29GateTrajectoryPersisted } {
  const base = sanitizeWave29GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave29GateEma;
  const wave29GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave29GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 29 gate EMA improving (${priorEma} → ${wave29GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 29 gate EMA softening (${priorEma} → ${wave29GateEma})`);
  }
  if (brief.shouldProjectWave28) {
    evidence.push('Agent 25 wave 28 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave29GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave29GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave29GateEma,
    },
  };
}


// --- source: wave29-integration-monitor.ts ---
export function buildWave29IntegrationMonitor(args: {
  turn: number;
  wave28ProjectionBrief: Agent25Wave28ProjectionHandoffBrief;
  wave29GateTrajectory?: Wave29GateTrajectorySnapshot;
  wave28IntegrationMonitor: Wave28IntegrationMonitor;
}): Wave29IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m190DryRun =
    args.wave28ProjectionBrief.shouldProjectWave28 &&
    args.wave29GateTrajectory?.band === 'ready' &&
    args.wave28IntegrationMonitor.shouldRunO10m188DryRun;

  if (!args.wave28ProjectionBrief.shouldProjectWave28) {
    reasons.push('Wave 28 projection not cleared');
    shouldRunO10m190DryRun = false;
  }
  if (args.wave29GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 29 gate band ${args.wave29GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m190DryRun = false;
  }
  if (!args.wave28IntegrationMonitor.shouldRunO10m188DryRun) {
    reasons.push('O10-188 dry-run path blocked for wave 29 gate');
    shouldRunO10m190DryRun = false;
  }

  const summary = shouldRunO10m190DryRun
    ? `Wave 29 O10-190 dry-run gate ready (gate EMA ${args.wave29GateTrajectory?.wave29GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 29 integration deferred — ${reasons[0]}`
      : 'Wave 29 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m190DryRun,
    wave29GateBand: args.wave29GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave29-projection-handoff-brief.ts ---
export function composeAgent25Wave29ProjectionHandoffBrief(args: {
  turn: number;
  wave29IntegrationMonitor: Wave29IntegrationMonitor;
  wave29GateTrajectory?: Wave29GateTrajectorySnapshot;
}): Agent25Wave29ProjectionHandoffBrief {
  const shouldProjectWave29 =
    args.wave29IntegrationMonitor.shouldRunO10m190DryRun &&
    args.wave29GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave29) {
    headlines.push('Agent 25: project wave 29 module gate / O10-190 dry-run');
  } else {
    headlines.push('Agent 25 wave 29 projection deferred — integration gate not stable');
  }
  if (args.wave29GateTrajectory?.band === 'ready') {
    headlines.push('Wave 29 gate trajectory ready for O10-190 projection handoff');
  }
  if (args.wave29IntegrationMonitor.wave29GateBand === 'blocked') {
    headlines.push('Wave 29 gate blocked — hold O10-190 handoff');
  }

  const summary = `project=${shouldProjectWave29} o10m190=${args.wave29IntegrationMonitor.shouldRunO10m190DryRun} band=${args.wave29GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave29,
    shouldRunO10m190DryRun: args.wave29IntegrationMonitor.shouldRunO10m190DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave30-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave29ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave29 ? 12 : 66;
  if (!brief.shouldRunO10m190DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave30GateTrajectory(): Wave30GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave30GateEma: 25,
    priorEma: undefined,
  };
}

export function sanitizeWave30GateTrajectory(
  raw?: Wave30GateTrajectoryPersisted | null
): Wave30GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave30GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave30GateEma =
    typeof raw.wave30GateEma === 'number' && Number.isFinite(raw.wave30GateEma)
      ? Math.max(0, Math.min(100, raw.wave30GateEma))
      : 25;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave30GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave29ProjectionHandoffBrief): Wave30GateBand {
  if (brief.shouldProjectWave29 && score <= 21) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave30GateTrajectory(
  turn: number,
  brief: Agent25Wave29ProjectionHandoffBrief,
  persisted?: Wave30GateTrajectoryPersisted | null
): { snapshot: Wave30GateTrajectorySnapshot; persisted: Wave30GateTrajectoryPersisted } {
  const base = sanitizeWave30GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave30GateEma;
  const wave30GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave30GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 30 gate EMA improving (${priorEma} → ${wave30GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 30 gate EMA softening (${priorEma} → ${wave30GateEma})`);
  }
  if (brief.shouldProjectWave29) {
    evidence.push('Agent 25 wave 29 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave30GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave30GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave30GateEma,
    },
  };
}


// --- source: wave30-integration-monitor.ts ---
export function buildWave30IntegrationMonitor(args: {
  turn: number;
  wave29ProjectionBrief: Agent25Wave29ProjectionHandoffBrief;
  wave30GateTrajectory?: Wave30GateTrajectorySnapshot;
  wave29IntegrationMonitor: Wave29IntegrationMonitor;
}): Wave30IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m192DryRun =
    args.wave29ProjectionBrief.shouldProjectWave29 &&
    args.wave30GateTrajectory?.band === 'ready' &&
    args.wave29IntegrationMonitor.shouldRunO10m190DryRun;

  if (!args.wave29ProjectionBrief.shouldProjectWave29) {
    reasons.push('Wave 29 projection not cleared');
    shouldRunO10m192DryRun = false;
  }
  if (args.wave30GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 30 gate band ${args.wave30GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m192DryRun = false;
  }
  if (!args.wave29IntegrationMonitor.shouldRunO10m190DryRun) {
    reasons.push('O10-190 dry-run path blocked for wave 30 gate');
    shouldRunO10m192DryRun = false;
  }

  const summary = shouldRunO10m192DryRun
    ? `Wave 30 O10-192 dry-run gate ready (gate EMA ${args.wave30GateTrajectory?.wave30GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 30 integration deferred — ${reasons[0]}`
      : 'Wave 30 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m192DryRun,
    wave30GateBand: args.wave30GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave30-projection-handoff-brief.ts ---
export function composeAgent25Wave30ProjectionHandoffBrief(args: {
  turn: number;
  wave30IntegrationMonitor: Wave30IntegrationMonitor;
  wave30GateTrajectory?: Wave30GateTrajectorySnapshot;
}): Agent25Wave30ProjectionHandoffBrief {
  const shouldProjectWave30 =
    args.wave30IntegrationMonitor.shouldRunO10m192DryRun &&
    args.wave30GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave30) {
    headlines.push('Agent 25: project wave 30 module gate / O10-192 dry-run');
  } else {
    headlines.push('Agent 25 wave 30 projection deferred — integration gate not stable');
  }
  if (args.wave30GateTrajectory?.band === 'ready') {
    headlines.push('Wave 30 gate trajectory ready for O10-192 projection handoff');
  }
  if (args.wave30IntegrationMonitor.wave30GateBand === 'blocked') {
    headlines.push('Wave 30 gate blocked — hold O10-192 handoff');
  }

  const summary = `project=${shouldProjectWave30} o10m192=${args.wave30IntegrationMonitor.shouldRunO10m192DryRun} band=${args.wave30GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave30,
    shouldRunO10m192DryRun: args.wave30IntegrationMonitor.shouldRunO10m192DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave31-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave30ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave30 ? 12 : 66;
  if (!brief.shouldRunO10m192DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave31GateTrajectory(): Wave31GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave31GateEma: 24,
    priorEma: undefined,
  };
}

export function sanitizeWave31GateTrajectory(
  raw?: Wave31GateTrajectoryPersisted | null
): Wave31GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave31GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave31GateEma =
    typeof raw.wave31GateEma === 'number' && Number.isFinite(raw.wave31GateEma)
      ? Math.max(0, Math.min(100, raw.wave31GateEma))
      : 24;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave31GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave30ProjectionHandoffBrief): Wave31GateBand {
  if (brief.shouldProjectWave30 && score <= 20) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave31GateTrajectory(
  turn: number,
  brief: Agent25Wave30ProjectionHandoffBrief,
  persisted?: Wave31GateTrajectoryPersisted | null
): { snapshot: Wave31GateTrajectorySnapshot; persisted: Wave31GateTrajectoryPersisted } {
  const base = sanitizeWave31GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave31GateEma;
  const wave31GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave31GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 31 gate EMA improving (${priorEma} → ${wave31GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 31 gate EMA softening (${priorEma} → ${wave31GateEma})`);
  }
  if (brief.shouldProjectWave30) {
    evidence.push('Agent 25 wave 30 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave31GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave31GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave31GateEma,
    },
  };
}


// --- source: wave31-integration-monitor.ts ---
export function buildWave31IntegrationMonitor(args: {
  turn: number;
  wave30ProjectionBrief: Agent25Wave30ProjectionHandoffBrief;
  wave31GateTrajectory?: Wave31GateTrajectorySnapshot;
  wave30IntegrationMonitor: Wave30IntegrationMonitor;
}): Wave31IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m194DryRun =
    args.wave30ProjectionBrief.shouldProjectWave30 &&
    args.wave31GateTrajectory?.band === 'ready' &&
    args.wave30IntegrationMonitor.shouldRunO10m192DryRun;

  if (!args.wave30ProjectionBrief.shouldProjectWave30) {
    reasons.push('Wave 30 projection not cleared');
    shouldRunO10m194DryRun = false;
  }
  if (args.wave31GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 31 gate band ${args.wave31GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m194DryRun = false;
  }
  if (!args.wave30IntegrationMonitor.shouldRunO10m192DryRun) {
    reasons.push('O10-192 dry-run path blocked for wave 31 gate');
    shouldRunO10m194DryRun = false;
  }

  const summary = shouldRunO10m194DryRun
    ? `Wave 31 O10-194 dry-run gate ready (gate EMA ${args.wave31GateTrajectory?.wave31GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 31 integration deferred — ${reasons[0]}`
      : 'Wave 31 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m194DryRun,
    wave31GateBand: args.wave31GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave31-projection-handoff-brief.ts ---
export function composeAgent25Wave31ProjectionHandoffBrief(args: {
  turn: number;
  wave31IntegrationMonitor: Wave31IntegrationMonitor;
  wave31GateTrajectory?: Wave31GateTrajectorySnapshot;
}): Agent25Wave31ProjectionHandoffBrief {
  const shouldProjectWave31 =
    args.wave31IntegrationMonitor.shouldRunO10m194DryRun &&
    args.wave31GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave31) {
    headlines.push('Agent 25: project wave 31 module gate / O10-194 dry-run');
  } else {
    headlines.push('Agent 25 wave 31 projection deferred — integration gate not stable');
  }
  if (args.wave31GateTrajectory?.band === 'ready') {
    headlines.push('Wave 31 gate trajectory ready for O10-194 projection handoff');
  }
  if (args.wave31IntegrationMonitor.wave31GateBand === 'blocked') {
    headlines.push('Wave 31 gate blocked — hold O10-194 handoff');
  }

  const summary = `project=${shouldProjectWave31} o10m194=${args.wave31IntegrationMonitor.shouldRunO10m194DryRun} band=${args.wave31GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave31,
    shouldRunO10m194DryRun: args.wave31IntegrationMonitor.shouldRunO10m194DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave32-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave31ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave31 ? 12 : 66;
  if (!brief.shouldRunO10m194DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave32GateTrajectory(): Wave32GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave32GateEma: 23,
    priorEma: undefined,
  };
}

export function sanitizeWave32GateTrajectory(
  raw?: Wave32GateTrajectoryPersisted | null
): Wave32GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave32GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave32GateEma =
    typeof raw.wave32GateEma === 'number' && Number.isFinite(raw.wave32GateEma)
      ? Math.max(0, Math.min(100, raw.wave32GateEma))
      : 23;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave32GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave31ProjectionHandoffBrief): Wave32GateBand {
  if (brief.shouldProjectWave31 && score <= 19) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave32GateTrajectory(
  turn: number,
  brief: Agent25Wave31ProjectionHandoffBrief,
  persisted?: Wave32GateTrajectoryPersisted | null
): { snapshot: Wave32GateTrajectorySnapshot; persisted: Wave32GateTrajectoryPersisted } {
  const base = sanitizeWave32GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave32GateEma;
  const wave32GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave32GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 32 gate EMA improving (${priorEma} → ${wave32GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 32 gate EMA softening (${priorEma} → ${wave32GateEma})`);
  }
  if (brief.shouldProjectWave31) {
    evidence.push('Agent 25 wave 31 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave32GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave32GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave32GateEma,
    },
  };
}


// --- source: wave32-integration-monitor.ts ---
export function buildWave32IntegrationMonitor(args: {
  turn: number;
  wave31ProjectionBrief: Agent25Wave31ProjectionHandoffBrief;
  wave32GateTrajectory?: Wave32GateTrajectorySnapshot;
  wave31IntegrationMonitor: Wave31IntegrationMonitor;
}): Wave32IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m196DryRun =
    args.wave31ProjectionBrief.shouldProjectWave31 &&
    args.wave32GateTrajectory?.band === 'ready' &&
    args.wave31IntegrationMonitor.shouldRunO10m194DryRun;

  if (!args.wave31ProjectionBrief.shouldProjectWave31) {
    reasons.push('Wave 31 projection not cleared');
    shouldRunO10m196DryRun = false;
  }
  if (args.wave32GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 32 gate band ${args.wave32GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m196DryRun = false;
  }
  if (!args.wave31IntegrationMonitor.shouldRunO10m194DryRun) {
    reasons.push('O10-194 dry-run path blocked for wave 32 gate');
    shouldRunO10m196DryRun = false;
  }

  const summary = shouldRunO10m196DryRun
    ? `Wave 32 O10-196 dry-run gate ready (gate EMA ${args.wave32GateTrajectory?.wave32GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 32 integration deferred — ${reasons[0]}`
      : 'Wave 32 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m196DryRun,
    wave32GateBand: args.wave32GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave32-projection-handoff-brief.ts ---
export function composeAgent25Wave32ProjectionHandoffBrief(args: {
  turn: number;
  wave32IntegrationMonitor: Wave32IntegrationMonitor;
  wave32GateTrajectory?: Wave32GateTrajectorySnapshot;
}): Agent25Wave32ProjectionHandoffBrief {
  const shouldProjectWave32 =
    args.wave32IntegrationMonitor.shouldRunO10m196DryRun &&
    args.wave32GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave32) {
    headlines.push('Agent 25: project wave 32 module gate / O10-196 dry-run');
  } else {
    headlines.push('Agent 25 wave 32 projection deferred — integration gate not stable');
  }
  if (args.wave32GateTrajectory?.band === 'ready') {
    headlines.push('Wave 32 gate trajectory ready for O10-196 projection handoff');
  }
  if (args.wave32IntegrationMonitor.wave32GateBand === 'blocked') {
    headlines.push('Wave 32 gate blocked — hold O10-196 handoff');
  }

  const summary = `project=${shouldProjectWave32} o10m196=${args.wave32IntegrationMonitor.shouldRunO10m196DryRun} band=${args.wave32GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave32,
    shouldRunO10m196DryRun: args.wave32IntegrationMonitor.shouldRunO10m196DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave33-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave32ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave32 ? 12 : 66;
  if (!brief.shouldRunO10m196DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave33GateTrajectory(): Wave33GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave33GateEma: 22,
    priorEma: undefined,
  };
}

export function sanitizeWave33GateTrajectory(
  raw?: Wave33GateTrajectoryPersisted | null
): Wave33GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave33GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave33GateEma =
    typeof raw.wave33GateEma === 'number' && Number.isFinite(raw.wave33GateEma)
      ? Math.max(0, Math.min(100, raw.wave33GateEma))
      : 22;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave33GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave32ProjectionHandoffBrief): Wave33GateBand {
  if (brief.shouldProjectWave32 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave33GateTrajectory(
  turn: number,
  brief: Agent25Wave32ProjectionHandoffBrief,
  persisted?: Wave33GateTrajectoryPersisted | null
): { snapshot: Wave33GateTrajectorySnapshot; persisted: Wave33GateTrajectoryPersisted } {
  const base = sanitizeWave33GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave33GateEma;
  const wave33GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave33GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 33 gate EMA improving (${priorEma} → ${wave33GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 33 gate EMA softening (${priorEma} → ${wave33GateEma})`);
  }
  if (brief.shouldProjectWave32) {
    evidence.push('Agent 25 wave 32 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave33GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave33GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave33GateEma,
    },
  };
}


// --- source: wave33-integration-monitor.ts ---
export function buildWave33IntegrationMonitor(args: {
  turn: number;
  wave32ProjectionBrief: Agent25Wave32ProjectionHandoffBrief;
  wave33GateTrajectory?: Wave33GateTrajectorySnapshot;
  wave32IntegrationMonitor: Wave32IntegrationMonitor;
}): Wave33IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m198DryRun =
    args.wave32ProjectionBrief.shouldProjectWave32 &&
    args.wave33GateTrajectory?.band === 'ready' &&
    args.wave32IntegrationMonitor.shouldRunO10m196DryRun;

  if (!args.wave32ProjectionBrief.shouldProjectWave32) {
    reasons.push('Wave 32 projection not cleared');
    shouldRunO10m198DryRun = false;
  }
  if (args.wave33GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 33 gate band ${args.wave33GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m198DryRun = false;
  }
  if (!args.wave32IntegrationMonitor.shouldRunO10m196DryRun) {
    reasons.push('O10-196 dry-run path blocked for wave 33 gate');
    shouldRunO10m198DryRun = false;
  }

  const summary = shouldRunO10m198DryRun
    ? `Wave 33 O10-198 dry-run gate ready (gate EMA ${args.wave33GateTrajectory?.wave33GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 33 integration deferred — ${reasons[0]}`
      : 'Wave 33 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m198DryRun,
    wave33GateBand: args.wave33GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave33-projection-handoff-brief.ts ---
export function composeAgent25Wave33ProjectionHandoffBrief(args: {
  turn: number;
  wave33IntegrationMonitor: Wave33IntegrationMonitor;
  wave33GateTrajectory?: Wave33GateTrajectorySnapshot;
}): Agent25Wave33ProjectionHandoffBrief {
  const shouldProjectWave33 =
    args.wave33IntegrationMonitor.shouldRunO10m198DryRun &&
    args.wave33GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave33) {
    headlines.push('Agent 25: project wave 33 module gate / O10-198 dry-run');
  } else {
    headlines.push('Agent 25 wave 33 projection deferred — integration gate not stable');
  }
  if (args.wave33GateTrajectory?.band === 'ready') {
    headlines.push('Wave 33 gate trajectory ready for O10-198 projection handoff');
  }
  if (args.wave33IntegrationMonitor.wave33GateBand === 'blocked') {
    headlines.push('Wave 33 gate blocked — hold O10-198 handoff');
  }

  const summary = `project=${shouldProjectWave33} o10m198=${args.wave33IntegrationMonitor.shouldRunO10m198DryRun} band=${args.wave33GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave33,
    shouldRunO10m198DryRun: args.wave33IntegrationMonitor.shouldRunO10m198DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave34-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave33ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave33 ? 12 : 66;
  if (!brief.shouldRunO10m198DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave34GateTrajectory(): Wave34GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave34GateEma: 21,
    priorEma: undefined,
  };
}

export function sanitizeWave34GateTrajectory(
  raw?: Wave34GateTrajectoryPersisted | null
): Wave34GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave34GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave34GateEma =
    typeof raw.wave34GateEma === 'number' && Number.isFinite(raw.wave34GateEma)
      ? Math.max(0, Math.min(100, raw.wave34GateEma))
      : 21;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave34GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave33ProjectionHandoffBrief): Wave34GateBand {
  if (brief.shouldProjectWave33 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave34GateTrajectory(
  turn: number,
  brief: Agent25Wave33ProjectionHandoffBrief,
  persisted?: Wave34GateTrajectoryPersisted | null
): { snapshot: Wave34GateTrajectorySnapshot; persisted: Wave34GateTrajectoryPersisted } {
  const base = sanitizeWave34GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave34GateEma;
  const wave34GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave34GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 34 gate EMA improving (${priorEma} → ${wave34GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 34 gate EMA softening (${priorEma} → ${wave34GateEma})`);
  }
  if (brief.shouldProjectWave33) {
    evidence.push('Agent 25 wave 33 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave34GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave34GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave34GateEma,
    },
  };
}


// --- source: wave34-integration-monitor.ts ---
export function buildWave34IntegrationMonitor(args: {
  turn: number;
  wave33ProjectionBrief: Agent25Wave33ProjectionHandoffBrief;
  wave34GateTrajectory?: Wave34GateTrajectorySnapshot;
  wave33IntegrationMonitor: Wave33IntegrationMonitor;
}): Wave34IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m200DryRun =
    args.wave33ProjectionBrief.shouldProjectWave33 &&
    args.wave34GateTrajectory?.band === 'ready' &&
    args.wave33IntegrationMonitor.shouldRunO10m198DryRun;

  if (!args.wave33ProjectionBrief.shouldProjectWave33) {
    reasons.push('Wave 33 projection not cleared');
    shouldRunO10m200DryRun = false;
  }
  if (args.wave34GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 34 gate band ${args.wave34GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m200DryRun = false;
  }
  if (!args.wave33IntegrationMonitor.shouldRunO10m198DryRun) {
    reasons.push('O10-198 dry-run path blocked for wave 34 gate');
    shouldRunO10m200DryRun = false;
  }

  const summary = shouldRunO10m200DryRun
    ? `Wave 34 O10-200 dry-run gate ready (gate EMA ${args.wave34GateTrajectory?.wave34GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 34 integration deferred — ${reasons[0]}`
      : 'Wave 34 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m200DryRun,
    wave34GateBand: args.wave34GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave34-projection-handoff-brief.ts ---
export function composeAgent25Wave34ProjectionHandoffBrief(args: {
  turn: number;
  wave34IntegrationMonitor: Wave34IntegrationMonitor;
  wave34GateTrajectory?: Wave34GateTrajectorySnapshot;
}): Agent25Wave34ProjectionHandoffBrief {
  const shouldProjectWave34 =
    args.wave34IntegrationMonitor.shouldRunO10m200DryRun &&
    args.wave34GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave34) {
    headlines.push('Agent 25: project wave 34 module gate / O10-200 dry-run');
  } else {
    headlines.push('Agent 25 wave 34 projection deferred — integration gate not stable');
  }
  if (args.wave34GateTrajectory?.band === 'ready') {
    headlines.push('Wave 34 gate trajectory ready for O10-200 projection handoff');
  }
  if (args.wave34IntegrationMonitor.wave34GateBand === 'blocked') {
    headlines.push('Wave 34 gate blocked — hold O10-200 handoff');
  }

  const summary = `project=${shouldProjectWave34} o10m200=${args.wave34IntegrationMonitor.shouldRunO10m200DryRun} band=${args.wave34GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave34,
    shouldRunO10m200DryRun: args.wave34IntegrationMonitor.shouldRunO10m200DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave35-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave34ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave34 ? 12 : 66;
  if (!brief.shouldRunO10m200DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave35GateTrajectory(): Wave35GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave35GateEma: 20,
    priorEma: undefined,
  };
}

export function sanitizeWave35GateTrajectory(
  raw?: Wave35GateTrajectoryPersisted | null
): Wave35GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave35GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave35GateEma =
    typeof raw.wave35GateEma === 'number' && Number.isFinite(raw.wave35GateEma)
      ? Math.max(0, Math.min(100, raw.wave35GateEma))
      : 20;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave35GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave34ProjectionHandoffBrief): Wave35GateBand {
  if (brief.shouldProjectWave34 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave35GateTrajectory(
  turn: number,
  brief: Agent25Wave34ProjectionHandoffBrief,
  persisted?: Wave35GateTrajectoryPersisted | null
): { snapshot: Wave35GateTrajectorySnapshot; persisted: Wave35GateTrajectoryPersisted } {
  const base = sanitizeWave35GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave35GateEma;
  const wave35GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave35GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 35 gate EMA improving (${priorEma} → ${wave35GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 35 gate EMA softening (${priorEma} → ${wave35GateEma})`);
  }
  if (brief.shouldProjectWave34) {
    evidence.push('Agent 25 wave 34 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave35GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave35GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave35GateEma,
    },
  };
}


// --- source: wave35-integration-monitor.ts ---
export function buildWave35IntegrationMonitor(args: {
  turn: number;
  wave34ProjectionBrief: Agent25Wave34ProjectionHandoffBrief;
  wave35GateTrajectory?: Wave35GateTrajectorySnapshot;
  wave34IntegrationMonitor: Wave34IntegrationMonitor;
}): Wave35IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m202DryRun =
    args.wave34ProjectionBrief.shouldProjectWave34 &&
    args.wave35GateTrajectory?.band === 'ready' &&
    args.wave34IntegrationMonitor.shouldRunO10m200DryRun;

  if (!args.wave34ProjectionBrief.shouldProjectWave34) {
    reasons.push('Wave 34 projection not cleared');
    shouldRunO10m202DryRun = false;
  }
  if (args.wave35GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 35 gate band ${args.wave35GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m202DryRun = false;
  }
  if (!args.wave34IntegrationMonitor.shouldRunO10m200DryRun) {
    reasons.push('O10-200 dry-run path blocked for wave 35 gate');
    shouldRunO10m202DryRun = false;
  }

  const summary = shouldRunO10m202DryRun
    ? `Wave 35 O10-202 dry-run gate ready (gate EMA ${args.wave35GateTrajectory?.wave35GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 35 integration deferred — ${reasons[0]}`
      : 'Wave 35 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m202DryRun,
    wave35GateBand: args.wave35GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave35-projection-handoff-brief.ts ---
export function composeAgent25Wave35ProjectionHandoffBrief(args: {
  turn: number;
  wave35IntegrationMonitor: Wave35IntegrationMonitor;
  wave35GateTrajectory?: Wave35GateTrajectorySnapshot;
}): Agent25Wave35ProjectionHandoffBrief {
  const shouldProjectWave35 =
    args.wave35IntegrationMonitor.shouldRunO10m202DryRun &&
    args.wave35GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave35) {
    headlines.push('Agent 25: project wave 35 module gate / O10-202 dry-run');
  } else {
    headlines.push('Agent 25 wave 35 projection deferred — integration gate not stable');
  }
  if (args.wave35GateTrajectory?.band === 'ready') {
    headlines.push('Wave 35 gate trajectory ready for O10-202 projection handoff');
  }
  if (args.wave35IntegrationMonitor.wave35GateBand === 'blocked') {
    headlines.push('Wave 35 gate blocked — hold O10-202 handoff');
  }

  const summary = `project=${shouldProjectWave35} o10m202=${args.wave35IntegrationMonitor.shouldRunO10m202DryRun} band=${args.wave35GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave35,
    shouldRunO10m202DryRun: args.wave35IntegrationMonitor.shouldRunO10m202DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave36-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave35ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave35 ? 12 : 66;
  if (!brief.shouldRunO10m202DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave36GateTrajectory(): Wave36GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave36GateEma: 19,
    priorEma: undefined,
  };
}

export function sanitizeWave36GateTrajectory(
  raw?: Wave36GateTrajectoryPersisted | null
): Wave36GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave36GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave36GateEma =
    typeof raw.wave36GateEma === 'number' && Number.isFinite(raw.wave36GateEma)
      ? Math.max(0, Math.min(100, raw.wave36GateEma))
      : 19;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave36GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave35ProjectionHandoffBrief): Wave36GateBand {
  if (brief.shouldProjectWave35 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave36GateTrajectory(
  turn: number,
  brief: Agent25Wave35ProjectionHandoffBrief,
  persisted?: Wave36GateTrajectoryPersisted | null
): { snapshot: Wave36GateTrajectorySnapshot; persisted: Wave36GateTrajectoryPersisted } {
  const base = sanitizeWave36GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave36GateEma;
  const wave36GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave36GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 36 gate EMA improving (${priorEma} → ${wave36GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 36 gate EMA softening (${priorEma} → ${wave36GateEma})`);
  }
  if (brief.shouldProjectWave35) {
    evidence.push('Agent 25 wave 35 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave36GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave36GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave36GateEma,
    },
  };
}


// --- source: wave36-integration-monitor.ts ---
export function buildWave36IntegrationMonitor(args: {
  turn: number;
  wave35ProjectionBrief: Agent25Wave35ProjectionHandoffBrief;
  wave36GateTrajectory?: Wave36GateTrajectorySnapshot;
  wave35IntegrationMonitor: Wave35IntegrationMonitor;
}): Wave36IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m204DryRun =
    args.wave35ProjectionBrief.shouldProjectWave35 &&
    args.wave36GateTrajectory?.band === 'ready' &&
    args.wave35IntegrationMonitor.shouldRunO10m202DryRun;

  if (!args.wave35ProjectionBrief.shouldProjectWave35) {
    reasons.push('Wave 35 projection not cleared');
    shouldRunO10m204DryRun = false;
  }
  if (args.wave36GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 36 gate band ${args.wave36GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m204DryRun = false;
  }
  if (!args.wave35IntegrationMonitor.shouldRunO10m202DryRun) {
    reasons.push('O10-202 dry-run path blocked for wave 36 gate');
    shouldRunO10m204DryRun = false;
  }

  const summary = shouldRunO10m204DryRun
    ? `Wave 36 O10-204 dry-run gate ready (gate EMA ${args.wave36GateTrajectory?.wave36GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 36 integration deferred — ${reasons[0]}`
      : 'Wave 36 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m204DryRun,
    wave36GateBand: args.wave36GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave36-projection-handoff-brief.ts ---
export function composeAgent25Wave36ProjectionHandoffBrief(args: {
  turn: number;
  wave36IntegrationMonitor: Wave36IntegrationMonitor;
  wave36GateTrajectory?: Wave36GateTrajectorySnapshot;
}): Agent25Wave36ProjectionHandoffBrief {
  const shouldProjectWave36 =
    args.wave36IntegrationMonitor.shouldRunO10m204DryRun &&
    args.wave36GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave36) {
    headlines.push('Agent 25: project wave 36 module gate / O10-204 dry-run');
  } else {
    headlines.push('Agent 25 wave 36 projection deferred — integration gate not stable');
  }
  if (args.wave36GateTrajectory?.band === 'ready') {
    headlines.push('Wave 36 gate trajectory ready for O10-204 projection handoff');
  }
  if (args.wave36IntegrationMonitor.wave36GateBand === 'blocked') {
    headlines.push('Wave 36 gate blocked — hold O10-204 handoff');
  }

  const summary = `project=${shouldProjectWave36} o10m204=${args.wave36IntegrationMonitor.shouldRunO10m204DryRun} band=${args.wave36GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave36,
    shouldRunO10m204DryRun: args.wave36IntegrationMonitor.shouldRunO10m204DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave37-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave36ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave36 ? 12 : 66;
  if (!brief.shouldRunO10m204DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave37GateTrajectory(): Wave37GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave37GateEma: 18,
    priorEma: undefined,
  };
}

export function sanitizeWave37GateTrajectory(
  raw?: Wave37GateTrajectoryPersisted | null
): Wave37GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave37GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave37GateEma =
    typeof raw.wave37GateEma === 'number' && Number.isFinite(raw.wave37GateEma)
      ? Math.max(0, Math.min(100, raw.wave37GateEma))
      : 18;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave37GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave36ProjectionHandoffBrief): Wave37GateBand {
  if (brief.shouldProjectWave36 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave37GateTrajectory(
  turn: number,
  brief: Agent25Wave36ProjectionHandoffBrief,
  persisted?: Wave37GateTrajectoryPersisted | null
): { snapshot: Wave37GateTrajectorySnapshot; persisted: Wave37GateTrajectoryPersisted } {
  const base = sanitizeWave37GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave37GateEma;
  const wave37GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave37GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 37 gate EMA improving (${priorEma} → ${wave37GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 37 gate EMA softening (${priorEma} → ${wave37GateEma})`);
  }
  if (brief.shouldProjectWave36) {
    evidence.push('Agent 25 wave 36 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave37GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave37GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave37GateEma,
    },
  };
}


// --- source: wave37-integration-monitor.ts ---
export function buildWave37IntegrationMonitor(args: {
  turn: number;
  wave36ProjectionBrief: Agent25Wave36ProjectionHandoffBrief;
  wave37GateTrajectory?: Wave37GateTrajectorySnapshot;
  wave36IntegrationMonitor: Wave36IntegrationMonitor;
}): Wave37IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m206DryRun =
    args.wave36ProjectionBrief.shouldProjectWave36 &&
    args.wave37GateTrajectory?.band === 'ready' &&
    args.wave36IntegrationMonitor.shouldRunO10m204DryRun;

  if (!args.wave36ProjectionBrief.shouldProjectWave36) {
    reasons.push('Wave 36 projection not cleared');
    shouldRunO10m206DryRun = false;
  }
  if (args.wave37GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 37 gate band ${args.wave37GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m206DryRun = false;
  }
  if (!args.wave36IntegrationMonitor.shouldRunO10m204DryRun) {
    reasons.push('O10-204 dry-run path blocked for wave 37 gate');
    shouldRunO10m206DryRun = false;
  }

  const summary = shouldRunO10m206DryRun
    ? `Wave 37 O10-206 dry-run gate ready (gate EMA ${args.wave37GateTrajectory?.wave37GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 37 integration deferred — ${reasons[0]}`
      : 'Wave 37 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m206DryRun,
    wave37GateBand: args.wave37GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave37-projection-handoff-brief.ts ---
export function composeAgent25Wave37ProjectionHandoffBrief(args: {
  turn: number;
  wave37IntegrationMonitor: Wave37IntegrationMonitor;
  wave37GateTrajectory?: Wave37GateTrajectorySnapshot;
}): Agent25Wave37ProjectionHandoffBrief {
  const shouldProjectWave37 =
    args.wave37IntegrationMonitor.shouldRunO10m206DryRun &&
    args.wave37GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave37) {
    headlines.push('Agent 25: project wave 37 module gate / O10-206 dry-run');
  } else {
    headlines.push('Agent 25 wave 37 projection deferred — integration gate not stable');
  }
  if (args.wave37GateTrajectory?.band === 'ready') {
    headlines.push('Wave 37 gate trajectory ready for O10-206 projection handoff');
  }
  if (args.wave37IntegrationMonitor.wave37GateBand === 'blocked') {
    headlines.push('Wave 37 gate blocked — hold O10-206 handoff');
  }

  const summary = `project=${shouldProjectWave37} o10m206=${args.wave37IntegrationMonitor.shouldRunO10m206DryRun} band=${args.wave37GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave37,
    shouldRunO10m206DryRun: args.wave37IntegrationMonitor.shouldRunO10m206DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave38-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave37ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave37 ? 12 : 66;
  if (!brief.shouldRunO10m206DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave38GateTrajectory(): Wave38GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave38GateEma: 17,
    priorEma: undefined,
  };
}

export function sanitizeWave38GateTrajectory(
  raw?: Wave38GateTrajectoryPersisted | null
): Wave38GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave38GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave38GateEma =
    typeof raw.wave38GateEma === 'number' && Number.isFinite(raw.wave38GateEma)
      ? Math.max(0, Math.min(100, raw.wave38GateEma))
      : 17;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave38GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave37ProjectionHandoffBrief): Wave38GateBand {
  if (brief.shouldProjectWave37 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave38GateTrajectory(
  turn: number,
  brief: Agent25Wave37ProjectionHandoffBrief,
  persisted?: Wave38GateTrajectoryPersisted | null
): { snapshot: Wave38GateTrajectorySnapshot; persisted: Wave38GateTrajectoryPersisted } {
  const base = sanitizeWave38GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave38GateEma;
  const wave38GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave38GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 38 gate EMA improving (${priorEma} → ${wave38GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 38 gate EMA softening (${priorEma} → ${wave38GateEma})`);
  }
  if (brief.shouldProjectWave37) {
    evidence.push('Agent 25 wave 37 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave38GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave38GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave38GateEma,
    },
  };
}


// --- source: wave38-integration-monitor.ts ---
export function buildWave38IntegrationMonitor(args: {
  turn: number;
  wave37ProjectionBrief: Agent25Wave37ProjectionHandoffBrief;
  wave38GateTrajectory?: Wave38GateTrajectorySnapshot;
  wave37IntegrationMonitor: Wave37IntegrationMonitor;
}): Wave38IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m208DryRun =
    args.wave37ProjectionBrief.shouldProjectWave37 &&
    args.wave38GateTrajectory?.band === 'ready' &&
    args.wave37IntegrationMonitor.shouldRunO10m206DryRun;

  if (!args.wave37ProjectionBrief.shouldProjectWave37) {
    reasons.push('Wave 37 projection not cleared');
    shouldRunO10m208DryRun = false;
  }
  if (args.wave38GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 38 gate band ${args.wave38GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m208DryRun = false;
  }
  if (!args.wave37IntegrationMonitor.shouldRunO10m206DryRun) {
    reasons.push('O10-206 dry-run path blocked for wave 38 gate');
    shouldRunO10m208DryRun = false;
  }

  const summary = shouldRunO10m208DryRun
    ? `Wave 38 O10-208 dry-run gate ready (gate EMA ${args.wave38GateTrajectory?.wave38GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 38 integration deferred — ${reasons[0]}`
      : 'Wave 38 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m208DryRun,
    wave38GateBand: args.wave38GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave38-projection-handoff-brief.ts ---
export function composeAgent25Wave38ProjectionHandoffBrief(args: {
  turn: number;
  wave38IntegrationMonitor: Wave38IntegrationMonitor;
  wave38GateTrajectory?: Wave38GateTrajectorySnapshot;
}): Agent25Wave38ProjectionHandoffBrief {
  const shouldProjectWave38 =
    args.wave38IntegrationMonitor.shouldRunO10m208DryRun &&
    args.wave38GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave38) {
    headlines.push('Agent 25: project wave 38 module gate / O10-208 dry-run');
  } else {
    headlines.push('Agent 25 wave 38 projection deferred — integration gate not stable');
  }
  if (args.wave38GateTrajectory?.band === 'ready') {
    headlines.push('Wave 38 gate trajectory ready for O10-208 projection handoff');
  }
  if (args.wave38IntegrationMonitor.wave38GateBand === 'blocked') {
    headlines.push('Wave 38 gate blocked — hold O10-208 handoff');
  }

  const summary = `project=${shouldProjectWave38} o10m208=${args.wave38IntegrationMonitor.shouldRunO10m208DryRun} band=${args.wave38GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave38,
    shouldRunO10m208DryRun: args.wave38IntegrationMonitor.shouldRunO10m208DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave39-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave38ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave38 ? 12 : 66;
  if (!brief.shouldRunO10m208DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave39GateTrajectory(): Wave39GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave39GateEma: 16,
    priorEma: undefined,
  };
}

export function sanitizeWave39GateTrajectory(
  raw?: Wave39GateTrajectoryPersisted | null
): Wave39GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave39GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave39GateEma =
    typeof raw.wave39GateEma === 'number' && Number.isFinite(raw.wave39GateEma)
      ? Math.max(0, Math.min(100, raw.wave39GateEma))
      : 16;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave39GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave38ProjectionHandoffBrief): Wave39GateBand {
  if (brief.shouldProjectWave38 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave39GateTrajectory(
  turn: number,
  brief: Agent25Wave38ProjectionHandoffBrief,
  persisted?: Wave39GateTrajectoryPersisted | null
): { snapshot: Wave39GateTrajectorySnapshot; persisted: Wave39GateTrajectoryPersisted } {
  const base = sanitizeWave39GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave39GateEma;
  const wave39GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave39GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 39 gate EMA improving (${priorEma} → ${wave39GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 39 gate EMA softening (${priorEma} → ${wave39GateEma})`);
  }
  if (brief.shouldProjectWave38) {
    evidence.push('Agent 25 wave 38 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave39GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave39GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave39GateEma,
    },
  };
}


// --- source: wave39-integration-monitor.ts ---
export function buildWave39IntegrationMonitor(args: {
  turn: number;
  wave38ProjectionBrief: Agent25Wave38ProjectionHandoffBrief;
  wave39GateTrajectory?: Wave39GateTrajectorySnapshot;
  wave38IntegrationMonitor: Wave38IntegrationMonitor;
}): Wave39IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m210DryRun =
    args.wave38ProjectionBrief.shouldProjectWave38 &&
    args.wave39GateTrajectory?.band === 'ready' &&
    args.wave38IntegrationMonitor.shouldRunO10m208DryRun;

  if (!args.wave38ProjectionBrief.shouldProjectWave38) {
    reasons.push('Wave 38 projection not cleared');
    shouldRunO10m210DryRun = false;
  }
  if (args.wave39GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 39 gate band ${args.wave39GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m210DryRun = false;
  }
  if (!args.wave38IntegrationMonitor.shouldRunO10m208DryRun) {
    reasons.push('O10-208 dry-run path blocked for wave 39 gate');
    shouldRunO10m210DryRun = false;
  }

  const summary = shouldRunO10m210DryRun
    ? `Wave 39 O10-210 dry-run gate ready (gate EMA ${args.wave39GateTrajectory?.wave39GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 39 integration deferred — ${reasons[0]}`
      : 'Wave 39 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m210DryRun,
    wave39GateBand: args.wave39GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave39-projection-handoff-brief.ts ---
export function composeAgent25Wave39ProjectionHandoffBrief(args: {
  turn: number;
  wave39IntegrationMonitor: Wave39IntegrationMonitor;
  wave39GateTrajectory?: Wave39GateTrajectorySnapshot;
}): Agent25Wave39ProjectionHandoffBrief {
  const shouldProjectWave39 =
    args.wave39IntegrationMonitor.shouldRunO10m210DryRun &&
    args.wave39GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave39) {
    headlines.push('Agent 25: project wave 39 module gate / O10-210 dry-run');
  } else {
    headlines.push('Agent 25 wave 39 projection deferred — integration gate not stable');
  }
  if (args.wave39GateTrajectory?.band === 'ready') {
    headlines.push('Wave 39 gate trajectory ready for O10-210 projection handoff');
  }
  if (args.wave39IntegrationMonitor.wave39GateBand === 'blocked') {
    headlines.push('Wave 39 gate blocked — hold O10-210 handoff');
  }

  const summary = `project=${shouldProjectWave39} o10m210=${args.wave39IntegrationMonitor.shouldRunO10m210DryRun} band=${args.wave39GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave39,
    shouldRunO10m210DryRun: args.wave39IntegrationMonitor.shouldRunO10m210DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave40-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave39ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave39 ? 12 : 66;
  if (!brief.shouldRunO10m210DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave40GateTrajectory(): Wave40GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave40GateEma: 15,
    priorEma: undefined,
  };
}

export function sanitizeWave40GateTrajectory(
  raw?: Wave40GateTrajectoryPersisted | null
): Wave40GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave40GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave40GateEma =
    typeof raw.wave40GateEma === 'number' && Number.isFinite(raw.wave40GateEma)
      ? Math.max(0, Math.min(100, raw.wave40GateEma))
      : 15;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave40GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave39ProjectionHandoffBrief): Wave40GateBand {
  if (brief.shouldProjectWave39 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave40GateTrajectory(
  turn: number,
  brief: Agent25Wave39ProjectionHandoffBrief,
  persisted?: Wave40GateTrajectoryPersisted | null
): { snapshot: Wave40GateTrajectorySnapshot; persisted: Wave40GateTrajectoryPersisted } {
  const base = sanitizeWave40GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave40GateEma;
  const wave40GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave40GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 40 gate EMA improving (${priorEma} → ${wave40GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 40 gate EMA softening (${priorEma} → ${wave40GateEma})`);
  }
  if (brief.shouldProjectWave39) {
    evidence.push('Agent 25 wave 39 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave40GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave40GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave40GateEma,
    },
  };
}


// --- source: wave40-integration-monitor.ts ---
export function buildWave40IntegrationMonitor(args: {
  turn: number;
  wave39ProjectionBrief: Agent25Wave39ProjectionHandoffBrief;
  wave40GateTrajectory?: Wave40GateTrajectorySnapshot;
  wave39IntegrationMonitor: Wave39IntegrationMonitor;
}): Wave40IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m212DryRun =
    args.wave39ProjectionBrief.shouldProjectWave39 &&
    args.wave40GateTrajectory?.band === 'ready' &&
    args.wave39IntegrationMonitor.shouldRunO10m210DryRun;

  if (!args.wave39ProjectionBrief.shouldProjectWave39) {
    reasons.push('Wave 39 projection not cleared');
    shouldRunO10m212DryRun = false;
  }
  if (args.wave40GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 40 gate band ${args.wave40GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m212DryRun = false;
  }
  if (!args.wave39IntegrationMonitor.shouldRunO10m210DryRun) {
    reasons.push('O10-210 dry-run path blocked for wave 40 gate');
    shouldRunO10m212DryRun = false;
  }

  const summary = shouldRunO10m212DryRun
    ? `Wave 40 O10-212 dry-run gate ready (gate EMA ${args.wave40GateTrajectory?.wave40GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 40 integration deferred — ${reasons[0]}`
      : 'Wave 40 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m212DryRun,
    wave40GateBand: args.wave40GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave40-projection-handoff-brief.ts ---
export function composeAgent25Wave40ProjectionHandoffBrief(args: {
  turn: number;
  wave40IntegrationMonitor: Wave40IntegrationMonitor;
  wave40GateTrajectory?: Wave40GateTrajectorySnapshot;
}): Agent25Wave40ProjectionHandoffBrief {
  const shouldProjectWave40 =
    args.wave40IntegrationMonitor.shouldRunO10m212DryRun &&
    args.wave40GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave40) {
    headlines.push('Agent 25: project wave 40 module gate / O10-212 dry-run');
  } else {
    headlines.push('Agent 25 wave 40 projection deferred — integration gate not stable');
  }
  if (args.wave40GateTrajectory?.band === 'ready') {
    headlines.push('Wave 40 gate trajectory ready for O10-212 projection handoff');
  }
  if (args.wave40IntegrationMonitor.wave40GateBand === 'blocked') {
    headlines.push('Wave 40 gate blocked — hold O10-212 handoff');
  }

  const summary = `project=${shouldProjectWave40} o10m212=${args.wave40IntegrationMonitor.shouldRunO10m212DryRun} band=${args.wave40GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave40,
    shouldRunO10m212DryRun: args.wave40IntegrationMonitor.shouldRunO10m212DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave41-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave40ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave40 ? 12 : 66;
  if (!brief.shouldRunO10m212DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave41GateTrajectory(): Wave41GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave41GateEma: 14,
    priorEma: undefined,
  };
}

export function sanitizeWave41GateTrajectory(
  raw?: Wave41GateTrajectoryPersisted | null
): Wave41GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave41GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave41GateEma =
    typeof raw.wave41GateEma === 'number' && Number.isFinite(raw.wave41GateEma)
      ? Math.max(0, Math.min(100, raw.wave41GateEma))
      : 14;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave41GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave40ProjectionHandoffBrief): Wave41GateBand {
  if (brief.shouldProjectWave40 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave41GateTrajectory(
  turn: number,
  brief: Agent25Wave40ProjectionHandoffBrief,
  persisted?: Wave41GateTrajectoryPersisted | null
): { snapshot: Wave41GateTrajectorySnapshot; persisted: Wave41GateTrajectoryPersisted } {
  const base = sanitizeWave41GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave41GateEma;
  const wave41GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave41GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 41 gate EMA improving (${priorEma} → ${wave41GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 41 gate EMA softening (${priorEma} → ${wave41GateEma})`);
  }
  if (brief.shouldProjectWave40) {
    evidence.push('Agent 25 wave 40 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave41GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave41GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave41GateEma,
    },
  };
}


// --- source: wave41-integration-monitor.ts ---
export function buildWave41IntegrationMonitor(args: {
  turn: number;
  wave40ProjectionBrief: Agent25Wave40ProjectionHandoffBrief;
  wave41GateTrajectory?: Wave41GateTrajectorySnapshot;
  wave40IntegrationMonitor: Wave40IntegrationMonitor;
}): Wave41IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m214DryRun =
    args.wave40ProjectionBrief.shouldProjectWave40 &&
    args.wave41GateTrajectory?.band === 'ready' &&
    args.wave40IntegrationMonitor.shouldRunO10m212DryRun;

  if (!args.wave40ProjectionBrief.shouldProjectWave40) {
    reasons.push('Wave 40 projection not cleared');
    shouldRunO10m214DryRun = false;
  }
  if (args.wave41GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 41 gate band ${args.wave41GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m214DryRun = false;
  }
  if (!args.wave40IntegrationMonitor.shouldRunO10m212DryRun) {
    reasons.push('O10-212 dry-run path blocked for wave 41 gate');
    shouldRunO10m214DryRun = false;
  }

  const summary = shouldRunO10m214DryRun
    ? `Wave 41 O10-214 dry-run gate ready (gate EMA ${args.wave41GateTrajectory?.wave41GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 41 integration deferred — ${reasons[0]}`
      : 'Wave 41 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m214DryRun,
    wave41GateBand: args.wave41GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave41-projection-handoff-brief.ts ---
export function composeAgent25Wave41ProjectionHandoffBrief(args: {
  turn: number;
  wave41IntegrationMonitor: Wave41IntegrationMonitor;
  wave41GateTrajectory?: Wave41GateTrajectorySnapshot;
}): Agent25Wave41ProjectionHandoffBrief {
  const shouldProjectWave41 =
    args.wave41IntegrationMonitor.shouldRunO10m214DryRun &&
    args.wave41GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave41) {
    headlines.push('Agent 25: project wave 41 module gate / O10-214 dry-run');
  } else {
    headlines.push('Agent 25 wave 41 projection deferred — integration gate not stable');
  }
  if (args.wave41GateTrajectory?.band === 'ready') {
    headlines.push('Wave 41 gate trajectory ready for O10-214 projection handoff');
  }
  if (args.wave41IntegrationMonitor.wave41GateBand === 'blocked') {
    headlines.push('Wave 41 gate blocked — hold O10-214 handoff');
  }

  const summary = `project=${shouldProjectWave41} o10m214=${args.wave41IntegrationMonitor.shouldRunO10m214DryRun} band=${args.wave41GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave41,
    shouldRunO10m214DryRun: args.wave41IntegrationMonitor.shouldRunO10m214DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave42-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave41ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave41 ? 12 : 66;
  if (!brief.shouldRunO10m214DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave42GateTrajectory(): Wave42GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave42GateEma: 13,
    priorEma: undefined,
  };
}

export function sanitizeWave42GateTrajectory(
  raw?: Wave42GateTrajectoryPersisted | null
): Wave42GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave42GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave42GateEma =
    typeof raw.wave42GateEma === 'number' && Number.isFinite(raw.wave42GateEma)
      ? Math.max(0, Math.min(100, raw.wave42GateEma))
      : 13;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave42GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave41ProjectionHandoffBrief): Wave42GateBand {
  if (brief.shouldProjectWave41 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave42GateTrajectory(
  turn: number,
  brief: Agent25Wave41ProjectionHandoffBrief,
  persisted?: Wave42GateTrajectoryPersisted | null
): { snapshot: Wave42GateTrajectorySnapshot; persisted: Wave42GateTrajectoryPersisted } {
  const base = sanitizeWave42GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave42GateEma;
  const wave42GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave42GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 42 gate EMA improving (${priorEma} → ${wave42GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 42 gate EMA softening (${priorEma} → ${wave42GateEma})`);
  }
  if (brief.shouldProjectWave41) {
    evidence.push('Agent 25 wave 41 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave42GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave42GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave42GateEma,
    },
  };
}


// --- source: wave42-integration-monitor.ts ---
export function buildWave42IntegrationMonitor(args: {
  turn: number;
  wave41ProjectionBrief: Agent25Wave41ProjectionHandoffBrief;
  wave42GateTrajectory?: Wave42GateTrajectorySnapshot;
  wave41IntegrationMonitor: Wave41IntegrationMonitor;
}): Wave42IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m216DryRun =
    args.wave41ProjectionBrief.shouldProjectWave41 &&
    args.wave42GateTrajectory?.band === 'ready' &&
    args.wave41IntegrationMonitor.shouldRunO10m214DryRun;

  if (!args.wave41ProjectionBrief.shouldProjectWave41) {
    reasons.push('Wave 41 projection not cleared');
    shouldRunO10m216DryRun = false;
  }
  if (args.wave42GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 42 gate band ${args.wave42GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m216DryRun = false;
  }
  if (!args.wave41IntegrationMonitor.shouldRunO10m214DryRun) {
    reasons.push('O10-214 dry-run path blocked for wave 42 gate');
    shouldRunO10m216DryRun = false;
  }

  const summary = shouldRunO10m216DryRun
    ? `Wave 42 O10-216 dry-run gate ready (gate EMA ${args.wave42GateTrajectory?.wave42GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 42 integration deferred — ${reasons[0]}`
      : 'Wave 42 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m216DryRun,
    wave42GateBand: args.wave42GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave42-projection-handoff-brief.ts ---
export function composeAgent25Wave42ProjectionHandoffBrief(args: {
  turn: number;
  wave42IntegrationMonitor: Wave42IntegrationMonitor;
  wave42GateTrajectory?: Wave42GateTrajectorySnapshot;
}): Agent25Wave42ProjectionHandoffBrief {
  const shouldProjectWave42 =
    args.wave42IntegrationMonitor.shouldRunO10m216DryRun &&
    args.wave42GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave42) {
    headlines.push('Agent 25: project wave 42 module gate / O10-216 dry-run');
  } else {
    headlines.push('Agent 25 wave 42 projection deferred — integration gate not stable');
  }
  if (args.wave42GateTrajectory?.band === 'ready') {
    headlines.push('Wave 42 gate trajectory ready for O10-216 projection handoff');
  }
  if (args.wave42IntegrationMonitor.wave42GateBand === 'blocked') {
    headlines.push('Wave 42 gate blocked — hold O10-216 handoff');
  }

  const summary = `project=${shouldProjectWave42} o10m216=${args.wave42IntegrationMonitor.shouldRunO10m216DryRun} band=${args.wave42GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave42,
    shouldRunO10m216DryRun: args.wave42IntegrationMonitor.shouldRunO10m216DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave43-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave42ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave42 ? 12 : 66;
  if (!brief.shouldRunO10m216DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave43GateTrajectory(): Wave43GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave43GateEma: 12,
    priorEma: undefined,
  };
}

export function sanitizeWave43GateTrajectory(
  raw?: Wave43GateTrajectoryPersisted | null
): Wave43GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave43GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave43GateEma =
    typeof raw.wave43GateEma === 'number' && Number.isFinite(raw.wave43GateEma)
      ? Math.max(0, Math.min(100, raw.wave43GateEma))
      : 12;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave43GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave42ProjectionHandoffBrief): Wave43GateBand {
  if (brief.shouldProjectWave42 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave43GateTrajectory(
  turn: number,
  brief: Agent25Wave42ProjectionHandoffBrief,
  persisted?: Wave43GateTrajectoryPersisted | null
): { snapshot: Wave43GateTrajectorySnapshot; persisted: Wave43GateTrajectoryPersisted } {
  const base = sanitizeWave43GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave43GateEma;
  const wave43GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave43GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 43 gate EMA improving (${priorEma} → ${wave43GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 43 gate EMA softening (${priorEma} → ${wave43GateEma})`);
  }
  if (brief.shouldProjectWave42) {
    evidence.push('Agent 25 wave 42 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave43GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave43GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave43GateEma,
    },
  };
}


// --- source: wave43-integration-monitor.ts ---
export function buildWave43IntegrationMonitor(args: {
  turn: number;
  wave42ProjectionBrief: Agent25Wave42ProjectionHandoffBrief;
  wave43GateTrajectory?: Wave43GateTrajectorySnapshot;
  wave42IntegrationMonitor: Wave42IntegrationMonitor;
}): Wave43IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m218DryRun =
    args.wave42ProjectionBrief.shouldProjectWave42 &&
    args.wave43GateTrajectory?.band === 'ready' &&
    args.wave42IntegrationMonitor.shouldRunO10m216DryRun;

  if (!args.wave42ProjectionBrief.shouldProjectWave42) {
    reasons.push('Wave 42 projection not cleared');
    shouldRunO10m218DryRun = false;
  }
  if (args.wave43GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 43 gate band ${args.wave43GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m218DryRun = false;
  }
  if (!args.wave42IntegrationMonitor.shouldRunO10m216DryRun) {
    reasons.push('O10-216 dry-run path blocked for wave 43 gate');
    shouldRunO10m218DryRun = false;
  }

  const summary = shouldRunO10m218DryRun
    ? `Wave 43 O10-218 dry-run gate ready (gate EMA ${args.wave43GateTrajectory?.wave43GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 43 integration deferred — ${reasons[0]}`
      : 'Wave 43 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m218DryRun,
    wave43GateBand: args.wave43GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave43-projection-handoff-brief.ts ---
export function composeAgent25Wave43ProjectionHandoffBrief(args: {
  turn: number;
  wave43IntegrationMonitor: Wave43IntegrationMonitor;
  wave43GateTrajectory?: Wave43GateTrajectorySnapshot;
}): Agent25Wave43ProjectionHandoffBrief {
  const shouldProjectWave43 =
    args.wave43IntegrationMonitor.shouldRunO10m218DryRun &&
    args.wave43GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave43) {
    headlines.push('Agent 25: project wave 43 module gate / O10-218 dry-run');
  } else {
    headlines.push('Agent 25 wave 43 projection deferred — integration gate not stable');
  }
  if (args.wave43GateTrajectory?.band === 'ready') {
    headlines.push('Wave 43 gate trajectory ready for O10-218 projection handoff');
  }
  if (args.wave43IntegrationMonitor.wave43GateBand === 'blocked') {
    headlines.push('Wave 43 gate blocked — hold O10-218 handoff');
  }

  const summary = `project=${shouldProjectWave43} o10m218=${args.wave43IntegrationMonitor.shouldRunO10m218DryRun} band=${args.wave43GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave43,
    shouldRunO10m218DryRun: args.wave43IntegrationMonitor.shouldRunO10m218DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave44-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave43ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave43 ? 12 : 66;
  if (!brief.shouldRunO10m218DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave44GateTrajectory(): Wave44GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave44GateEma: 11,
    priorEma: undefined,
  };
}

export function sanitizeWave44GateTrajectory(
  raw?: Wave44GateTrajectoryPersisted | null
): Wave44GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave44GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave44GateEma =
    typeof raw.wave44GateEma === 'number' && Number.isFinite(raw.wave44GateEma)
      ? Math.max(0, Math.min(100, raw.wave44GateEma))
      : 11;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave44GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave43ProjectionHandoffBrief): Wave44GateBand {
  if (brief.shouldProjectWave43 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave44GateTrajectory(
  turn: number,
  brief: Agent25Wave43ProjectionHandoffBrief,
  persisted?: Wave44GateTrajectoryPersisted | null
): { snapshot: Wave44GateTrajectorySnapshot; persisted: Wave44GateTrajectoryPersisted } {
  const base = sanitizeWave44GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave44GateEma;
  const wave44GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave44GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 44 gate EMA improving (${priorEma} → ${wave44GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 44 gate EMA softening (${priorEma} → ${wave44GateEma})`);
  }
  if (brief.shouldProjectWave43) {
    evidence.push('Agent 25 wave 43 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave44GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave44GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave44GateEma,
    },
  };
}


// --- source: wave44-integration-monitor.ts ---
export function buildWave44IntegrationMonitor(args: {
  turn: number;
  wave43ProjectionBrief: Agent25Wave43ProjectionHandoffBrief;
  wave44GateTrajectory?: Wave44GateTrajectorySnapshot;
  wave43IntegrationMonitor: Wave43IntegrationMonitor;
}): Wave44IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m220DryRun =
    args.wave43ProjectionBrief.shouldProjectWave43 &&
    args.wave44GateTrajectory?.band === 'ready' &&
    args.wave43IntegrationMonitor.shouldRunO10m218DryRun;

  if (!args.wave43ProjectionBrief.shouldProjectWave43) {
    reasons.push('Wave 43 projection not cleared');
    shouldRunO10m220DryRun = false;
  }
  if (args.wave44GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 44 gate band ${args.wave44GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m220DryRun = false;
  }
  if (!args.wave43IntegrationMonitor.shouldRunO10m218DryRun) {
    reasons.push('O10-218 dry-run path blocked for wave 44 gate');
    shouldRunO10m220DryRun = false;
  }

  const summary = shouldRunO10m220DryRun
    ? `Wave 44 O10-220 dry-run gate ready (gate EMA ${args.wave44GateTrajectory?.wave44GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 44 integration deferred — ${reasons[0]}`
      : 'Wave 44 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m220DryRun,
    wave44GateBand: args.wave44GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave44-projection-handoff-brief.ts ---
export function composeAgent25Wave44ProjectionHandoffBrief(args: {
  turn: number;
  wave44IntegrationMonitor: Wave44IntegrationMonitor;
  wave44GateTrajectory?: Wave44GateTrajectorySnapshot;
}): Agent25Wave44ProjectionHandoffBrief {
  const shouldProjectWave44 =
    args.wave44IntegrationMonitor.shouldRunO10m220DryRun &&
    args.wave44GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave44) {
    headlines.push('Agent 25: project wave 44 module gate / O10-220 dry-run');
  } else {
    headlines.push('Agent 25 wave 44 projection deferred — integration gate not stable');
  }
  if (args.wave44GateTrajectory?.band === 'ready') {
    headlines.push('Wave 44 gate trajectory ready for O10-220 projection handoff');
  }
  if (args.wave44IntegrationMonitor.wave44GateBand === 'blocked') {
    headlines.push('Wave 44 gate blocked — hold O10-220 handoff');
  }

  const summary = `project=${shouldProjectWave44} o10m220=${args.wave44IntegrationMonitor.shouldRunO10m220DryRun} band=${args.wave44GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave44,
    shouldRunO10m220DryRun: args.wave44IntegrationMonitor.shouldRunO10m220DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave45-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave44ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave44 ? 12 : 66;
  if (!brief.shouldRunO10m220DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave45GateTrajectory(): Wave45GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave45GateEma: 10,
    priorEma: undefined,
  };
}

export function sanitizeWave45GateTrajectory(
  raw?: Wave45GateTrajectoryPersisted | null
): Wave45GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave45GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave45GateEma =
    typeof raw.wave45GateEma === 'number' && Number.isFinite(raw.wave45GateEma)
      ? Math.max(0, Math.min(100, raw.wave45GateEma))
      : 10;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave45GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave44ProjectionHandoffBrief): Wave45GateBand {
  if (brief.shouldProjectWave44 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave45GateTrajectory(
  turn: number,
  brief: Agent25Wave44ProjectionHandoffBrief,
  persisted?: Wave45GateTrajectoryPersisted | null
): { snapshot: Wave45GateTrajectorySnapshot; persisted: Wave45GateTrajectoryPersisted } {
  const base = sanitizeWave45GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave45GateEma;
  const wave45GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave45GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 45 gate EMA improving (${priorEma} → ${wave45GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 45 gate EMA softening (${priorEma} → ${wave45GateEma})`);
  }
  if (brief.shouldProjectWave44) {
    evidence.push('Agent 25 wave 44 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave45GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave45GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave45GateEma,
    },
  };
}


// --- source: wave45-integration-monitor.ts ---
export function buildWave45IntegrationMonitor(args: {
  turn: number;
  wave44ProjectionBrief: Agent25Wave44ProjectionHandoffBrief;
  wave45GateTrajectory?: Wave45GateTrajectorySnapshot;
  wave44IntegrationMonitor: Wave44IntegrationMonitor;
}): Wave45IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m222DryRun =
    args.wave44ProjectionBrief.shouldProjectWave44 &&
    args.wave45GateTrajectory?.band === 'ready' &&
    args.wave44IntegrationMonitor.shouldRunO10m220DryRun;

  if (!args.wave44ProjectionBrief.shouldProjectWave44) {
    reasons.push('Wave 44 projection not cleared');
    shouldRunO10m222DryRun = false;
  }
  if (args.wave45GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 45 gate band ${args.wave45GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m222DryRun = false;
  }
  if (!args.wave44IntegrationMonitor.shouldRunO10m220DryRun) {
    reasons.push('O10-220 dry-run path blocked for wave 45 gate');
    shouldRunO10m222DryRun = false;
  }

  const summary = shouldRunO10m222DryRun
    ? `Wave 45 O10-222 dry-run gate ready (gate EMA ${args.wave45GateTrajectory?.wave45GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 45 integration deferred — ${reasons[0]}`
      : 'Wave 45 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m222DryRun,
    wave45GateBand: args.wave45GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave45-projection-handoff-brief.ts ---
export function composeAgent25Wave45ProjectionHandoffBrief(args: {
  turn: number;
  wave45IntegrationMonitor: Wave45IntegrationMonitor;
  wave45GateTrajectory?: Wave45GateTrajectorySnapshot;
}): Agent25Wave45ProjectionHandoffBrief {
  const shouldProjectWave45 =
    args.wave45IntegrationMonitor.shouldRunO10m222DryRun &&
    args.wave45GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave45) {
    headlines.push('Agent 25: project wave 45 module gate / O10-222 dry-run');
  } else {
    headlines.push('Agent 25 wave 45 projection deferred — integration gate not stable');
  }
  if (args.wave45GateTrajectory?.band === 'ready') {
    headlines.push('Wave 45 gate trajectory ready for O10-222 projection handoff');
  }
  if (args.wave45IntegrationMonitor.wave45GateBand === 'blocked') {
    headlines.push('Wave 45 gate blocked — hold O10-222 handoff');
  }

  const summary = `project=${shouldProjectWave45} o10m222=${args.wave45IntegrationMonitor.shouldRunO10m222DryRun} band=${args.wave45GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave45,
    shouldRunO10m222DryRun: args.wave45IntegrationMonitor.shouldRunO10m222DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave46-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave45ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave45 ? 12 : 66;
  if (!brief.shouldRunO10m222DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave46GateTrajectory(): Wave46GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave46GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave46GateTrajectory(
  raw?: Wave46GateTrajectoryPersisted | null
): Wave46GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave46GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave46GateEma =
    typeof raw.wave46GateEma === 'number' && Number.isFinite(raw.wave46GateEma)
      ? Math.max(0, Math.min(100, raw.wave46GateEma))
      : 9;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave46GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave45ProjectionHandoffBrief): Wave46GateBand {
  if (brief.shouldProjectWave45 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave46GateTrajectory(
  turn: number,
  brief: Agent25Wave45ProjectionHandoffBrief,
  persisted?: Wave46GateTrajectoryPersisted | null
): { snapshot: Wave46GateTrajectorySnapshot; persisted: Wave46GateTrajectoryPersisted } {
  const base = sanitizeWave46GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave46GateEma;
  const wave46GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave46GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 46 gate EMA improving (${priorEma} → ${wave46GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 46 gate EMA softening (${priorEma} → ${wave46GateEma})`);
  }
  if (brief.shouldProjectWave45) {
    evidence.push('Agent 25 wave 45 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave46GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave46GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave46GateEma,
    },
  };
}


// --- source: wave46-integration-monitor.ts ---
export function buildWave46IntegrationMonitor(args: {
  turn: number;
  wave45ProjectionBrief: Agent25Wave45ProjectionHandoffBrief;
  wave46GateTrajectory?: Wave46GateTrajectorySnapshot;
  wave45IntegrationMonitor: Wave45IntegrationMonitor;
}): Wave46IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m224DryRun =
    args.wave45ProjectionBrief.shouldProjectWave45 &&
    args.wave46GateTrajectory?.band === 'ready' &&
    args.wave45IntegrationMonitor.shouldRunO10m222DryRun;

  if (!args.wave45ProjectionBrief.shouldProjectWave45) {
    reasons.push('Wave 45 projection not cleared');
    shouldRunO10m224DryRun = false;
  }
  if (args.wave46GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 46 gate band ${args.wave46GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m224DryRun = false;
  }
  if (!args.wave45IntegrationMonitor.shouldRunO10m222DryRun) {
    reasons.push('O10-222 dry-run path blocked for wave 46 gate');
    shouldRunO10m224DryRun = false;
  }

  const summary = shouldRunO10m224DryRun
    ? `Wave 46 O10-224 dry-run gate ready (gate EMA ${args.wave46GateTrajectory?.wave46GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 46 integration deferred — ${reasons[0]}`
      : 'Wave 46 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m224DryRun,
    wave46GateBand: args.wave46GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave46-projection-handoff-brief.ts ---
export function composeAgent25Wave46ProjectionHandoffBrief(args: {
  turn: number;
  wave46IntegrationMonitor: Wave46IntegrationMonitor;
  wave46GateTrajectory?: Wave46GateTrajectorySnapshot;
}): Agent25Wave46ProjectionHandoffBrief {
  const shouldProjectWave46 =
    args.wave46IntegrationMonitor.shouldRunO10m224DryRun &&
    args.wave46GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave46) {
    headlines.push('Agent 25: project wave 46 module gate / O10-224 dry-run');
  } else {
    headlines.push('Agent 25 wave 46 projection deferred — integration gate not stable');
  }
  if (args.wave46GateTrajectory?.band === 'ready') {
    headlines.push('Wave 46 gate trajectory ready for O10-224 projection handoff');
  }
  if (args.wave46IntegrationMonitor.wave46GateBand === 'blocked') {
    headlines.push('Wave 46 gate blocked — hold O10-224 handoff');
  }

  const summary = `project=${shouldProjectWave46} o10m224=${args.wave46IntegrationMonitor.shouldRunO10m224DryRun} band=${args.wave46GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave46,
    shouldRunO10m224DryRun: args.wave46IntegrationMonitor.shouldRunO10m224DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave47-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave46ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave46 ? 12 : 66;
  if (!brief.shouldRunO10m224DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave47GateTrajectory(): Wave47GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave47GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave47GateTrajectory(
  raw?: Wave47GateTrajectoryPersisted | null
): Wave47GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave47GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave47GateEma =
    typeof raw.wave47GateEma === 'number' && Number.isFinite(raw.wave47GateEma)
      ? Math.max(0, Math.min(100, raw.wave47GateEma))
      : 9;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave47GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave46ProjectionHandoffBrief): Wave47GateBand {
  if (brief.shouldProjectWave46 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave47GateTrajectory(
  turn: number,
  brief: Agent25Wave46ProjectionHandoffBrief,
  persisted?: Wave47GateTrajectoryPersisted | null
): { snapshot: Wave47GateTrajectorySnapshot; persisted: Wave47GateTrajectoryPersisted } {
  const base = sanitizeWave47GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave47GateEma;
  const wave47GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave47GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 47 gate EMA improving (${priorEma} → ${wave47GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 47 gate EMA softening (${priorEma} → ${wave47GateEma})`);
  }
  if (brief.shouldProjectWave46) {
    evidence.push('Agent 25 wave 46 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave47GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave47GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave47GateEma,
    },
  };
}


// --- source: wave47-integration-monitor.ts ---
export function buildWave47IntegrationMonitor(args: {
  turn: number;
  wave46ProjectionBrief: Agent25Wave46ProjectionHandoffBrief;
  wave47GateTrajectory?: Wave47GateTrajectorySnapshot;
  wave46IntegrationMonitor: Wave46IntegrationMonitor;
}): Wave47IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m225DryRun =
    args.wave46ProjectionBrief.shouldProjectWave46 &&
    args.wave47GateTrajectory?.band === 'ready' &&
    args.wave46IntegrationMonitor.shouldRunO10m224DryRun;

  if (!args.wave46ProjectionBrief.shouldProjectWave46) {
    reasons.push('Wave 46 projection not cleared');
    shouldRunO10m225DryRun = false;
  }
  if (args.wave47GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 47 gate band ${args.wave47GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m225DryRun = false;
  }
  if (!args.wave46IntegrationMonitor.shouldRunO10m224DryRun) {
    reasons.push('O10-224 dry-run path blocked for wave 47 gate');
    shouldRunO10m225DryRun = false;
  }

  const summary = shouldRunO10m225DryRun
    ? `Wave 47 O10-225 dry-run gate ready (gate EMA ${args.wave47GateTrajectory?.wave47GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 47 integration deferred — ${reasons[0]}`
      : 'Wave 47 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m225DryRun,
    wave47GateBand: args.wave47GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave47-projection-handoff-brief.ts ---
export function composeAgent25Wave47ProjectionHandoffBrief(args: {
  turn: number;
  wave47IntegrationMonitor: Wave47IntegrationMonitor;
  wave47GateTrajectory?: Wave47GateTrajectorySnapshot;
}): Agent25Wave47ProjectionHandoffBrief {
  const shouldProjectWave47 =
    args.wave47IntegrationMonitor.shouldRunO10m225DryRun &&
    args.wave47GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave47) {
    headlines.push('Agent 25: project wave 47 module gate / O10-225 dry-run');
  } else {
    headlines.push('Agent 25 wave 47 projection deferred — integration gate not stable');
  }
  if (args.wave47GateTrajectory?.band === 'ready') {
    headlines.push('Wave 47 gate trajectory ready for O10-225 projection handoff');
  }
  if (args.wave47IntegrationMonitor.wave47GateBand === 'blocked') {
    headlines.push('Wave 47 gate blocked — hold O10-225 handoff');
  }

  const summary = `project=${shouldProjectWave47} o10m225=${args.wave47IntegrationMonitor.shouldRunO10m225DryRun} band=${args.wave47GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave47,
    shouldRunO10m225DryRun: args.wave47IntegrationMonitor.shouldRunO10m225DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}


// --- source: wave48-gate-trajectory.ts ---
const DEFAULT_EMA_ALPHA = 0.3;

function gateSample(brief: Agent25Wave47ProjectionHandoffBrief): number {
  let sample = brief.shouldProjectWave47 ? 12 : 66;
  if (!brief.shouldRunO10m225DryRun) {
    sample += 8;
  }
  sample -= Math.min(brief.headlines.length * 2, 6);
  return Math.max(0, Math.min(100, sample));
}

export function createInitialWave48GateTrajectory(): Wave48GateTrajectoryPersisted {
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: 0,
    emaAlpha: DEFAULT_EMA_ALPHA,
    wave48GateEma: 9,
    priorEma: undefined,
  };
}

export function sanitizeWave48GateTrajectory(
  raw?: Wave48GateTrajectoryPersisted | null
): Wave48GateTrajectoryPersisted {
  if (!raw || typeof raw !== 'object') return createInitialWave48GateTrajectory();
  const alpha =
    typeof raw.emaAlpha === 'number' && raw.emaAlpha > 0 && raw.emaAlpha <= 1
      ? raw.emaAlpha
      : DEFAULT_EMA_ALPHA;
  const wave48GateEma =
    typeof raw.wave48GateEma === 'number' && Number.isFinite(raw.wave48GateEma)
      ? Math.max(0, Math.min(100, raw.wave48GateEma))
      : 9;
  return {
    schemaVersion: '10.14.48-scale-wave-48' as typeof AGENT14_WELLBEING_SCHEMA_VERSION,
    lastTurn: typeof raw.lastTurn === 'number' ? Math.max(0, Math.floor(raw.lastTurn)) : 0,
    emaAlpha: alpha,
    wave48GateEma,
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
  if (previous - current > epsilon) return 'improving';
  if (current - previous > epsilon) return 'deteriorating';
  return 'flat';
}

function bandFromGate(score: number, brief: Agent25Wave47ProjectionHandoffBrief): Wave48GateBand {
  if (brief.shouldProjectWave47 && score <= 18) return 'ready';
  if (score >= 60) return 'blocked';
  return 'pending';
}

export function advanceWave48GateTrajectory(
  turn: number,
  brief: Agent25Wave47ProjectionHandoffBrief,
  persisted?: Wave48GateTrajectoryPersisted | null
): { snapshot: Wave48GateTrajectorySnapshot; persisted: Wave48GateTrajectoryPersisted } {
  const base = sanitizeWave48GateTrajectory(persisted);
  const alpha = base.emaAlpha;
  const sample = gateSample(brief);
  const priorEma = base.wave48GateEma;
  const wave48GateEma = Math.round((alpha * sample + (1 - alpha) * priorEma) * 10) / 10;
  const trajectory = trajectoryFromDelta(wave48GateEma, base.priorEma ?? priorEma);
  const evidence: string[] = [];
  if (trajectory === 'improving') {
    evidence.push(`Wave 48 gate EMA improving (${priorEma} → ${wave48GateEma})`);
  } else if (trajectory === 'deteriorating') {
    evidence.push(`Wave 48 gate EMA softening (${priorEma} → ${wave48GateEma})`);
  }
  if (brief.shouldProjectWave47) {
    evidence.push('Agent 25 wave 47 projection signal active');
  }

  return {
    snapshot: {
      turn,
      wave48GateEma,
      instantaneousGate: sample,
      band: bandFromGate(wave48GateEma, brief),
      trajectory,
      evidence,
    },
    persisted: {
      ...base,
      lastTurn: turn,
      priorEma: priorEma,
      wave48GateEma,
    },
  };
}


// --- source: wave48-integration-monitor.ts ---
export function buildWave48IntegrationMonitor(args: {
  turn: number;
  wave47ProjectionBrief: Agent25Wave47ProjectionHandoffBrief;
  wave48GateTrajectory?: Wave48GateTrajectorySnapshot;
  wave47IntegrationMonitor: Wave47IntegrationMonitor;
}): Wave48IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m226DryRun =
    args.wave47ProjectionBrief.shouldProjectWave47 &&
    args.wave48GateTrajectory?.band === 'ready' &&
    args.wave47IntegrationMonitor.shouldRunO10m225DryRun;

  if (!args.wave47ProjectionBrief.shouldProjectWave47) {
    reasons.push('Wave 47 projection not cleared');
    shouldRunO10m226DryRun = false;
  }
  if (args.wave48GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 48 gate band ${args.wave48GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m226DryRun = false;
  }
  if (!args.wave47IntegrationMonitor.shouldRunO10m225DryRun) {
    reasons.push('O10-225 dry-run path blocked for wave 48 gate');
    shouldRunO10m226DryRun = false;
  }

  const summary = shouldRunO10m226DryRun
    ? `Wave 48 O10-226 dry-run gate ready (gate EMA ${args.wave48GateTrajectory?.wave48GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 48 integration deferred — ${reasons[0]}`
      : 'Wave 48 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m226DryRun,
    wave48GateBand: args.wave48GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}


// --- source: agent25-wave48-projection-handoff-brief.ts ---
export function composeAgent25Wave48ProjectionHandoffBrief(args: {
  turn: number;
  wave48IntegrationMonitor: Wave48IntegrationMonitor;
  wave48GateTrajectory?: Wave48GateTrajectorySnapshot;
}): Agent25Wave48ProjectionHandoffBrief {
  const shouldProjectWave48 =
    args.wave48IntegrationMonitor.shouldRunO10m226DryRun &&
    args.wave48GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave48) {
    headlines.push('Agent 25: project wave 48 module gate / O10-226 dry-run');
  } else {
    headlines.push('Agent 25 wave 48 projection deferred — integration gate not stable');
  }
  if (args.wave48GateTrajectory?.band === 'ready') {
    headlines.push('Wave 48 gate trajectory ready for O10-226 projection handoff');
  }
  if (args.wave48IntegrationMonitor.wave48GateBand === 'blocked') {
    headlines.push('Wave 48 gate blocked — hold O10-226 handoff');
  }

  const summary = `project=${shouldProjectWave48} o10m226=${args.wave48IntegrationMonitor.shouldRunO10m226DryRun} band=${args.wave48GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave48,
    shouldRunO10m226DryRun: args.wave48IntegrationMonitor.shouldRunO10m226DryRun,
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
  if (args.coordinationTrajectory?.band === 'escalation') {
    giNotes.push(
      `Coordination pressure ${args.coordinationTrajectory.band} (EMA ${args.coordinationTrajectory.engagementPressureEma})`
    );
  }
  if (args.reliefExecutionMonitor?.shouldEscalateExecution) {
    giNotes.push(args.reliefExecutionMonitor.summary);
  }
  if (args.portfolioStabilizationBrief?.shouldPausePortfolioGrowth) {
    giNotes.push(args.portfolioStabilizationBrief.summary);
  }
  if (args.stabilizationTrajectory?.trajectory === 'deteriorating') {
    giNotes.push(
      `Stabilization stress ${args.stabilizationTrajectory.trajectory} (EMA ${args.stabilizationTrajectory.stabilizationStressEma})`
    );
  }
  if (args.reliefFulfillment && args.reliefFulfillment.fulfilledThisTurn > 0) {
    giNotes.push(args.reliefFulfillment.summary);
  }
  if (args.wellbeingRecoveryReadinessBrief?.shouldResumePortfolioGrowth) {
    giNotes.push(args.wellbeingRecoveryReadinessBrief.summary);
  }
  if (args.readinessTrajectory?.trajectory === 'deteriorating') {
    giNotes.push(
      `Readiness gap ${args.readinessTrajectory.trajectory} (EMA ${args.readinessTrajectory.readinessGapEma})`
    );
  }
  if (args.fulfillmentAgingMonitor?.shouldExpediteAging) {
    giNotes.push(args.fulfillmentAgingMonitor.summary);
  }
  if (args.portfolioResumptionPlan?.shouldHoldNewCommits) {
    giNotes.push(args.portfolioResumptionPlan.summary);
  }
  if (args.resumptionTrajectory?.trajectory === 'deteriorating') {
    giNotes.push(
      `Resumption friction ${args.resumptionTrajectory.trajectory} (EMA ${args.resumptionTrajectory.resumptionFrictionEma})`
    );
  }
  if (args.commitGatingAdvice?.shouldBlockAllCommits) {
    giNotes.push(args.commitGatingAdvice.summary);
  }
  if (args.portfolioHandoffBrief?.shouldSignalHandoff) {
    giNotes.push(args.portfolioHandoffBrief.summary);
  }
  if (args.handoffTrajectory?.band === 'blocked') {
    giNotes.push(
      `Handoff readiness ${args.handoffTrajectory.band} (EMA ${args.handoffTrajectory.handoffReadinessEma})`
    );
  }
  if (args.gatedCommitSchedule?.shouldDeferAll) {
    giNotes.push(args.gatedCommitSchedule.summary);
  }
  if (args.wellbeingIntegrationHandoffBrief?.shouldPublishIntegration) {
    giNotes.push(args.wellbeingIntegrationHandoffBrief.summary);
  }
  if (args.integrationTrajectory?.band === 'hold') {
    giNotes.push(
      `Integration band ${args.integrationTrajectory.band} (EMA ${args.integrationTrajectory.integrationReadinessEma})`
    );
  }
  if (args.scheduleReadinessMonitor?.shouldExpediteSchedule) {
    giNotes.push(args.scheduleReadinessMonitor.summary);
  }
  if (args.nationalWireInReadinessBrief?.shouldWireNationalTurn) {
    giNotes.push(args.nationalWireInReadinessBrief.summary);
  }
  if (args.wireInTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wire-in activation ${args.wireInTrajectory.band} (EMA ${args.wireInTrajectory.wireInActivationEma})`
    );
  }
  if (args.turnBoundaryActivationMonitor && !args.turnBoundaryActivationMonitor.shouldActivateTurnBoundary) {
    giNotes.push(args.turnBoundaryActivationMonitor.summary);
  }
  if (args.agent25AssemblyHandoffBrief?.shouldHandoffChunk) {
    giNotes.push(args.agent25AssemblyHandoffBrief.summary);
  }
  if (args.assemblyMergeTrajectory?.band === 'blocked') {
    giNotes.push(
      `Assembly merge ${args.assemblyMergeTrajectory.band} (EMA ${args.assemblyMergeTrajectory.assemblyMergeEma})`
    );
  }
  if (args.chunkAnchorAlignmentMonitor && !args.chunkAnchorAlignmentMonitor.anchorAligned) {
    giNotes.push(args.chunkAnchorAlignmentMonitor.summary);
  }
  if (args.agent25InlineReadinessBrief?.shouldInlineChunk) {
    giNotes.push(args.agent25InlineReadinessBrief.summary);
  }
  if (args.inlineMergeTrajectory?.band === 'blocked') {
    giNotes.push(
      `Inline merge ${args.inlineMergeTrajectory.band} (EMA ${args.inlineMergeTrajectory.inlineMergeEma})`
    );
  }
  if (args.inlineActivationMonitor && !args.inlineActivationMonitor.shouldActivateInline) {
    giNotes.push(args.inlineActivationMonitor.summary);
  }
  if (args.agent25Wave17ProjectionHandoffBrief?.shouldProjectWave17) {
    giNotes.push(args.agent25Wave17ProjectionHandoffBrief.summary);
  }
  if (args.projectionGateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Projection gate ${args.projectionGateTrajectory.band} (EMA ${args.projectionGateTrajectory.projectionGateEma})`
    );
  }
  if (args.wave18ProjectionMonitor && !args.wave18ProjectionMonitor.shouldRunO10m167DryRun) {
    giNotes.push(args.wave18ProjectionMonitor.summary);
  }
  if (args.agent25Wave18ProjectionHandoffBrief?.shouldProjectWave18) {
    giNotes.push(args.agent25Wave18ProjectionHandoffBrief.summary);
  }
  if (args.wave19GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 19 gate ${args.wave19GateTrajectory.band} (EMA ${args.wave19GateTrajectory.wave19GateEma})`
    );
  }
  if (args.wave19IntegrationMonitor && !args.wave19IntegrationMonitor.shouldRunO10m169DryRun) {
    giNotes.push(args.wave19IntegrationMonitor.summary);
  }
  if (args.agent25Wave19ProjectionHandoffBrief?.shouldProjectWave19) {
    giNotes.push(args.agent25Wave19ProjectionHandoffBrief.summary);
  }
  if (args.wave20GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 20 gate ${args.wave20GateTrajectory.band} (EMA ${args.wave20GateTrajectory.wave20GateEma})`
    );
  }
  if (args.wave20IntegrationMonitor && !args.wave20IntegrationMonitor.shouldRunO10m171DryRun) {
    giNotes.push(args.wave20IntegrationMonitor.summary);
  }
  if (args.agent25Wave20ProjectionHandoffBrief?.shouldProjectWave20) {
    giNotes.push(args.agent25Wave20ProjectionHandoffBrief.summary);
  }
  if (args.wave21GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 21 gate ${args.wave21GateTrajectory.band} (EMA ${args.wave21GateTrajectory.wave21GateEma})`
    );
  }
  if (args.wave21IntegrationMonitor && !args.wave21IntegrationMonitor.shouldRunO10m174DryRun) {
    giNotes.push(args.wave21IntegrationMonitor.summary);
  }
  if (args.agent25Wave21ProjectionHandoffBrief?.shouldProjectWave21) {
    giNotes.push(args.agent25Wave21ProjectionHandoffBrief.summary);
  }
  if (args.wave22GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 22 gate ${args.wave22GateTrajectory.band} (EMA ${args.wave22GateTrajectory.wave22GateEma})`
    );
  }
  if (args.wave22IntegrationMonitor && !args.wave22IntegrationMonitor.shouldRunO10m176DryRun) {
    giNotes.push(args.wave22IntegrationMonitor.summary);
  }
  if (args.agent25Wave22ProjectionHandoffBrief?.shouldProjectWave22) {
    giNotes.push(args.agent25Wave22ProjectionHandoffBrief.summary);
  }
  if (args.wave23GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 23 gate ${args.wave23GateTrajectory.band} (EMA ${args.wave23GateTrajectory.wave23GateEma})`
    );
  }
  if (args.wave23IntegrationMonitor && !args.wave23IntegrationMonitor.shouldRunO10m178DryRun) {
    giNotes.push(args.wave23IntegrationMonitor.summary);
  }
  if (args.agent25Wave23ProjectionHandoffBrief?.shouldProjectWave23) {
    giNotes.push(args.agent25Wave23ProjectionHandoffBrief.summary);
  }
  if (args.wave24GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 24 gate ${args.wave24GateTrajectory.band} (EMA ${args.wave24GateTrajectory.wave24GateEma})`
    );
  }
  if (args.wave24IntegrationMonitor && !args.wave24IntegrationMonitor.shouldRunO10m180DryRun) {
    giNotes.push(args.wave24IntegrationMonitor.summary);
  }
  if (args.agent25Wave24ProjectionHandoffBrief?.shouldProjectWave24) {
    giNotes.push(args.agent25Wave24ProjectionHandoffBrief.summary);
  }
  if (args.wave25GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 25 gate ${args.wave25GateTrajectory.band} (EMA ${args.wave25GateTrajectory.wave25GateEma})`
    );
  }
  if (args.wave25IntegrationMonitor && !args.wave25IntegrationMonitor.shouldRunO10m182DryRun) {
    giNotes.push(args.wave25IntegrationMonitor.summary);
  }
  if (args.agent25Wave25ProjectionHandoffBrief?.shouldProjectWave25) {
    giNotes.push(args.agent25Wave25ProjectionHandoffBrief.summary);
  }
  if (args.wave26GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 26 gate ${args.wave26GateTrajectory.band} (EMA ${args.wave26GateTrajectory.wave26GateEma})`
    );
  }
  if (args.wave26IntegrationMonitor && !args.wave26IntegrationMonitor.shouldRunO10m184DryRun) {
    giNotes.push(args.wave26IntegrationMonitor.summary);
  }
  if (args.agent25Wave26ProjectionHandoffBrief?.shouldProjectWave26) {
    giNotes.push(args.agent25Wave26ProjectionHandoffBrief.summary);
  }
  if (args.wave27GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 27 gate ${args.wave27GateTrajectory.band} (EMA ${args.wave27GateTrajectory.wave27GateEma})`
    );
  }
  if (args.wave27IntegrationMonitor && !args.wave27IntegrationMonitor.shouldRunO10m186DryRun) {
    giNotes.push(args.wave27IntegrationMonitor.summary);
  }
  if (args.agent25Wave27ProjectionHandoffBrief?.shouldProjectWave27) {
    giNotes.push(args.agent25Wave27ProjectionHandoffBrief.summary);
  }
  if (args.wave28GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 28 gate ${args.wave28GateTrajectory.band} (EMA ${args.wave28GateTrajectory.wave28GateEma})`
    );
  }
  if (args.wave28IntegrationMonitor && !args.wave28IntegrationMonitor.shouldRunO10m188DryRun) {
    giNotes.push(args.wave28IntegrationMonitor.summary);
  }
  if (args.agent25Wave28ProjectionHandoffBrief?.shouldProjectWave28) {
    giNotes.push(args.agent25Wave28ProjectionHandoffBrief.summary);
  }
  if (args.wave29GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 29 gate ${args.wave29GateTrajectory.band} (EMA ${args.wave29GateTrajectory.wave29GateEma})`
    );
  }
  if (args.wave29IntegrationMonitor && !args.wave29IntegrationMonitor.shouldRunO10m190DryRun) {
    giNotes.push(args.wave29IntegrationMonitor.summary);
  }
  if (args.agent25Wave29ProjectionHandoffBrief?.shouldProjectWave29) {
    giNotes.push(args.agent25Wave29ProjectionHandoffBrief.summary);
  }
  if (args.wave30GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 30 gate ${args.wave30GateTrajectory.band} (EMA ${args.wave30GateTrajectory.wave30GateEma})`
    );
  }
  if (args.wave30IntegrationMonitor && !args.wave30IntegrationMonitor.shouldRunO10m192DryRun) {
    giNotes.push(args.wave30IntegrationMonitor.summary);
  }
  if (args.agent25Wave30ProjectionHandoffBrief?.shouldProjectWave30) {
    giNotes.push(args.agent25Wave30ProjectionHandoffBrief.summary);
  }
  if (args.wave31GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 31 gate ${args.wave31GateTrajectory.band} (EMA ${args.wave31GateTrajectory.wave31GateEma})`
    );
  }
  if (args.wave31IntegrationMonitor && !args.wave31IntegrationMonitor.shouldRunO10m194DryRun) {
    giNotes.push(args.wave31IntegrationMonitor.summary);
  }
  if (args.agent25Wave31ProjectionHandoffBrief?.shouldProjectWave31) {
    giNotes.push(args.agent25Wave31ProjectionHandoffBrief.summary);
  }
  if (args.wave32GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 32 gate ${args.wave32GateTrajectory.band} (EMA ${args.wave32GateTrajectory.wave32GateEma})`
    );
  }
  if (args.wave32IntegrationMonitor && !args.wave32IntegrationMonitor.shouldRunO10m196DryRun) {
    giNotes.push(args.wave32IntegrationMonitor.summary);
  }
  if (args.agent25Wave32ProjectionHandoffBrief?.shouldProjectWave32) {
    giNotes.push(args.agent25Wave32ProjectionHandoffBrief.summary);
  }
  if (args.wave33GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 33 gate ${args.wave33GateTrajectory.band} (EMA ${args.wave33GateTrajectory.wave33GateEma})`
    );
  }
  if (args.wave33IntegrationMonitor && !args.wave33IntegrationMonitor.shouldRunO10m198DryRun) {
    giNotes.push(args.wave33IntegrationMonitor.summary);
  }
  if (args.agent25Wave33ProjectionHandoffBrief?.shouldProjectWave33) {
    giNotes.push(args.agent25Wave33ProjectionHandoffBrief.summary);
  }
  if (args.wave34GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 34 gate ${args.wave34GateTrajectory.band} (EMA ${args.wave34GateTrajectory.wave34GateEma})`
    );
  }
  if (args.wave34IntegrationMonitor && !args.wave34IntegrationMonitor.shouldRunO10m200DryRun) {
    giNotes.push(args.wave34IntegrationMonitor.summary);
  }
  if (args.agent25Wave34ProjectionHandoffBrief?.shouldProjectWave34) {
    giNotes.push(args.agent25Wave34ProjectionHandoffBrief.summary);
  }
  if (args.wave35GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 35 gate ${args.wave35GateTrajectory.band} (EMA ${args.wave35GateTrajectory.wave35GateEma})`
    );
  }
  if (args.wave35IntegrationMonitor && !args.wave35IntegrationMonitor.shouldRunO10m202DryRun) {
    giNotes.push(args.wave35IntegrationMonitor.summary);
  }
  if (args.agent25Wave35ProjectionHandoffBrief?.shouldProjectWave35) {
    giNotes.push(args.agent25Wave35ProjectionHandoffBrief.summary);
  }
  if (args.wave36GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 36 gate ${args.wave36GateTrajectory.band} (EMA ${args.wave36GateTrajectory.wave36GateEma})`
    );
  }
  if (args.wave36IntegrationMonitor && !args.wave36IntegrationMonitor.shouldRunO10m204DryRun) {
    giNotes.push(args.wave36IntegrationMonitor.summary);
  }
  if (args.agent25Wave36ProjectionHandoffBrief?.shouldProjectWave36) {
    giNotes.push(args.agent25Wave36ProjectionHandoffBrief.summary);
  }
  if (args.wave37GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 37 gate ${args.wave37GateTrajectory.band} (EMA ${args.wave37GateTrajectory.wave37GateEma})`
    );
  }
  if (args.wave37IntegrationMonitor && !args.wave37IntegrationMonitor.shouldRunO10m206DryRun) {
    giNotes.push(args.wave37IntegrationMonitor.summary);
  }
  if (args.agent25Wave37ProjectionHandoffBrief?.shouldProjectWave37) {
    giNotes.push(args.agent25Wave37ProjectionHandoffBrief.summary);
  }
  if (args.wave38GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 38 gate ${args.wave38GateTrajectory.band} (EMA ${args.wave38GateTrajectory.wave38GateEma})`
    );
  }
  if (args.wave38IntegrationMonitor && !args.wave38IntegrationMonitor.shouldRunO10m208DryRun) {
    giNotes.push(args.wave38IntegrationMonitor.summary);
  }
  if (args.agent25Wave38ProjectionHandoffBrief?.shouldProjectWave38) {
    giNotes.push(args.agent25Wave38ProjectionHandoffBrief.summary);
  }
  if (args.wave39GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 39 gate ${args.wave39GateTrajectory.band} (EMA ${args.wave39GateTrajectory.wave39GateEma})`
    );
  }
  if (args.wave39IntegrationMonitor && !args.wave39IntegrationMonitor.shouldRunO10m210DryRun) {
    giNotes.push(args.wave39IntegrationMonitor.summary);
  }
  if (args.agent25Wave39ProjectionHandoffBrief?.shouldProjectWave39) {
    giNotes.push(args.agent25Wave39ProjectionHandoffBrief.summary);
  }
  if (args.wave40GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 40 gate ${args.wave40GateTrajectory.band} (EMA ${args.wave40GateTrajectory.wave40GateEma})`
    );
  }
  if (args.wave40IntegrationMonitor && !args.wave40IntegrationMonitor.shouldRunO10m212DryRun) {
    giNotes.push(args.wave40IntegrationMonitor.summary);
  }
  if (args.agent25Wave40ProjectionHandoffBrief?.shouldProjectWave40) {
    giNotes.push(args.agent25Wave40ProjectionHandoffBrief.summary);
  }
  if (args.wave41GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 41 gate ${args.wave41GateTrajectory.band} (EMA ${args.wave41GateTrajectory.wave41GateEma})`
    );
  }
  if (args.wave41IntegrationMonitor && !args.wave41IntegrationMonitor.shouldRunO10m214DryRun) {
    giNotes.push(args.wave41IntegrationMonitor.summary);
  }
  if (args.agent25Wave41ProjectionHandoffBrief?.shouldProjectWave41) {
    giNotes.push(args.agent25Wave41ProjectionHandoffBrief.summary);
  }
  if (args.wave42GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 42 gate ${args.wave42GateTrajectory.band} (EMA ${args.wave42GateTrajectory.wave42GateEma})`
    );
  }
  if (args.wave42IntegrationMonitor && !args.wave42IntegrationMonitor.shouldRunO10m216DryRun) {
    giNotes.push(args.wave42IntegrationMonitor.summary);
  }
  if (args.agent25Wave42ProjectionHandoffBrief?.shouldProjectWave42) {
    giNotes.push(args.agent25Wave42ProjectionHandoffBrief.summary);
  }
  if (args.wave43GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 43 gate ${args.wave43GateTrajectory.band} (EMA ${args.wave43GateTrajectory.wave43GateEma})`
    );
  }
  if (args.wave43IntegrationMonitor && !args.wave43IntegrationMonitor.shouldRunO10m218DryRun) {
    giNotes.push(args.wave43IntegrationMonitor.summary);
  }
  if (args.agent25Wave43ProjectionHandoffBrief?.shouldProjectWave43) {
    giNotes.push(args.agent25Wave43ProjectionHandoffBrief.summary);
  }
  if (args.wave44GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 44 gate ${args.wave44GateTrajectory.band} (EMA ${args.wave44GateTrajectory.wave44GateEma})`
    );
  }
  if (args.wave44IntegrationMonitor && !args.wave44IntegrationMonitor.shouldRunO10m220DryRun) {
    giNotes.push(args.wave44IntegrationMonitor.summary);
  }
  if (args.agent25Wave44ProjectionHandoffBrief?.shouldProjectWave44) {
    giNotes.push(args.agent25Wave44ProjectionHandoffBrief.summary);
  }
  if (args.wave45GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 45 gate ${args.wave45GateTrajectory.band} (EMA ${args.wave45GateTrajectory.wave45GateEma})`
    );
  }
  if (args.wave45IntegrationMonitor && !args.wave45IntegrationMonitor.shouldRunO10m222DryRun) {
    giNotes.push(args.wave45IntegrationMonitor.summary);
  }
  if (args.agent25Wave45ProjectionHandoffBrief?.shouldProjectWave45) {
    giNotes.push(args.agent25Wave45ProjectionHandoffBrief.summary);
  }
  if (args.wave46GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 46 gate ${args.wave46GateTrajectory.band} (EMA ${args.wave46GateTrajectory.wave46GateEma})`
    );
  }
  if (args.wave46IntegrationMonitor && !args.wave46IntegrationMonitor.shouldRunO10m224DryRun) {
    giNotes.push(args.wave46IntegrationMonitor.summary);
  }
  if (args.agent25Wave46ProjectionHandoffBrief?.shouldProjectWave46) {
    giNotes.push(args.agent25Wave46ProjectionHandoffBrief.summary);
  }
  if (args.wave47GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 47 gate ${args.wave47GateTrajectory.band} (EMA ${args.wave47GateTrajectory.wave47GateEma})`
    );
  }
  if (args.wave47IntegrationMonitor && !args.wave47IntegrationMonitor.shouldRunO10m225DryRun) {
    giNotes.push(args.wave47IntegrationMonitor.summary);
  }
  if (args.agent25Wave47ProjectionHandoffBrief?.shouldProjectWave47) {
    giNotes.push(args.agent25Wave47ProjectionHandoffBrief.summary);
  }
  if (args.wave48GateTrajectory?.band === 'blocked') {
    giNotes.push(
      `Wave 48 gate ${args.wave48GateTrajectory.band} (EMA ${args.wave48GateTrajectory.wave48GateEma})`
    );
  }
  if (args.wave48IntegrationMonitor && !args.wave48IntegrationMonitor.shouldRunO10m226DryRun) {
    giNotes.push(args.wave48IntegrationMonitor.summary);
  }
  if (args.agent25Wave48ProjectionHandoffBrief?.shouldProjectWave48) {
    giNotes.push(args.agent25Wave48ProjectionHandoffBrief.summary);
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
  } else if (args.portfolioStabilizationBrief?.stabilizationPath === 'blocked') {
    headlineParts.push('portfolio stabilization blocked');
  } else if (args.wellbeingRecoveryReadinessBrief?.readinessBand === 'ready') {
    headlineParts.push('recovery readiness clear');
  } else if (args.portfolioResumptionPlan?.shouldHoldNewCommits) {
    headlineParts.push('portfolio resumption on hold');
  } else if (args.portfolioHandoffBrief?.shouldSignalHandoff) {
    headlineParts.push('portfolio handoff ready');
  } else if (args.wellbeingIntegrationHandoffBrief?.shouldPublishIntegration) {
    headlineParts.push('national integration handoff ready');
  } else if (args.nationalWireInReadinessBrief?.shouldWireNationalTurn) {
    headlineParts.push('national wire-in ready');
  } else if (args.agent25AssemblyHandoffBrief?.shouldHandoffChunk) {
    headlineParts.push('Agent 25 assembly handoff ready');
  } else if (args.agent25InlineReadinessBrief?.shouldInlineChunk) {
    headlineParts.push('Agent 25 inline readiness clear');
  } else if (args.agent25Wave17ProjectionHandoffBrief?.shouldProjectWave17) {
    headlineParts.push('Agent 25 wave 17 projection ready');
  } else if (args.agent25Wave18ProjectionHandoffBrief?.shouldProjectWave18) {
    headlineParts.push('Agent 25 wave 18 / O10-167 projection ready');
  } else if (args.agent25Wave19ProjectionHandoffBrief?.shouldProjectWave19) {
    headlineParts.push('Agent 25 wave 19 / O10-169 projection ready');
  } else if (args.agent25Wave20ProjectionHandoffBrief?.shouldProjectWave20) {
    headlineParts.push('Agent 25 wave 20 / O10-171 projection ready');
  } else if (args.agent25Wave21ProjectionHandoffBrief?.shouldProjectWave21) {
    headlineParts.push('Agent 25 wave 21 / O10-174 projection ready');
  } else if (args.agent25Wave22ProjectionHandoffBrief?.shouldProjectWave22) {
    headlineParts.push('Agent 25 wave 22 / O10-176 projection ready');
  } else if (args.agent25Wave23ProjectionHandoffBrief?.shouldProjectWave23) {
    headlineParts.push('Agent 25 wave 23 / O10-178 projection ready');
  } else if (args.agent25Wave24ProjectionHandoffBrief?.shouldProjectWave24) {
    headlineParts.push('Agent 25 wave 24 / O10-180 projection ready');
  } else if (args.agent25Wave25ProjectionHandoffBrief?.shouldProjectWave25) {
    headlineParts.push('Agent 25 wave 25 / O10-182 projection ready');
  } else if (args.agent25Wave26ProjectionHandoffBrief?.shouldProjectWave26) {
    headlineParts.push('Agent 25 wave 26 / O10-184 projection ready');
  } else if (args.agent25Wave27ProjectionHandoffBrief?.shouldProjectWave27) {
    headlineParts.push('Agent 25 wave 27 / O10-186 projection ready');
  } else if (args.agent25Wave28ProjectionHandoffBrief?.shouldProjectWave28) {
    headlineParts.push('Agent 25 wave 28 / O10-188 projection ready');
  } else if (args.agent25Wave29ProjectionHandoffBrief?.shouldProjectWave29) {
    headlineParts.push('Agent 25 wave 29 / O10-190 projection ready');
  } else if (args.agent25Wave30ProjectionHandoffBrief?.shouldProjectWave30) {
    headlineParts.push('Agent 25 wave 30 / O10-192 projection ready');
  } else if (args.agent25Wave31ProjectionHandoffBrief?.shouldProjectWave31) {
    headlineParts.push('Agent 25 wave 31 / O10-194 projection ready');
  } else if (args.agent25Wave32ProjectionHandoffBrief?.shouldProjectWave32) {
    headlineParts.push('Agent 25 wave 32 / O10-196 projection ready');
  } else if (args.agent25Wave33ProjectionHandoffBrief?.shouldProjectWave33) {
    headlineParts.push('Agent 25 wave 33 / O10-198 projection ready');
  } else if (args.agent25Wave34ProjectionHandoffBrief?.shouldProjectWave34) {
    headlineParts.push('Agent 25 wave 34 / O10-200 projection ready');
  } else if (args.agent25Wave35ProjectionHandoffBrief?.shouldProjectWave35) {
    headlineParts.push('Agent 25 wave 35 / O10-202 projection ready');
  } else if (args.agent25Wave36ProjectionHandoffBrief?.shouldProjectWave36) {
    headlineParts.push('Agent 25 wave 36 / O10-204 projection ready');
  } else if (args.agent25Wave37ProjectionHandoffBrief?.shouldProjectWave37) {
    headlineParts.push('Agent 25 wave 37 / O10-206 projection ready');
  } else if (args.agent25Wave38ProjectionHandoffBrief?.shouldProjectWave38) {
    headlineParts.push('Agent 25 wave 38 / O10-208 projection ready');
  } else if (args.agent25Wave39ProjectionHandoffBrief?.shouldProjectWave39) {
    headlineParts.push('Agent 25 wave 39 / O10-210 projection ready');
  } else if (args.agent25Wave40ProjectionHandoffBrief?.shouldProjectWave40) {
    headlineParts.push('Agent 25 wave 40 / O10-212 projection ready');
  } else if (args.agent25Wave41ProjectionHandoffBrief?.shouldProjectWave41) {
    headlineParts.push('Agent 25 wave 41 / O10-214 projection ready');
  } else if (args.agent25Wave42ProjectionHandoffBrief?.shouldProjectWave42) {
    headlineParts.push('Agent 25 wave 42 / O10-216 projection ready');
  } else if (args.agent25Wave43ProjectionHandoffBrief?.shouldProjectWave43) {
    headlineParts.push('Agent 25 wave 43 / O10-218 projection ready');
  } else if (args.agent25Wave44ProjectionHandoffBrief?.shouldProjectWave44) {
    headlineParts.push('Agent 25 wave 44 / O10-220 projection ready');
  } else if (args.agent25Wave45ProjectionHandoffBrief?.shouldProjectWave45) {
    headlineParts.push('Agent 25 wave 45 / O10-222 projection ready');
  } else if (args.agent25Wave46ProjectionHandoffBrief?.shouldProjectWave46) {
    headlineParts.push('Agent 25 wave 46 / O10-224 projection ready');
  } else if (args.agent25Wave47ProjectionHandoffBrief?.shouldProjectWave47) {
    headlineParts.push('Agent 25 wave 47 / O10-225 projection ready');
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
  coordinationTrajectoryPersisted?: CoordinationTrajectoryPersisted | null;
  stabilizationTrajectoryPersisted?: StabilizationTrajectoryPersisted | null;
  reliefFulfillmentPersisted?: ReliefFulfillmentPersisted | null;
  readinessTrajectoryPersisted?: ReadinessTrajectoryPersisted | null;
  resumptionTrajectoryPersisted?: ResumptionTrajectoryPersisted | null;
  handoffTrajectoryPersisted?: HandoffTrajectoryPersisted | null;
  integrationTrajectoryPersisted?: IntegrationTrajectoryPersisted | null;
  wireInTrajectoryPersisted?: WireInTrajectoryPersisted | null;
  assemblyMergeTrajectoryPersisted?: AssemblyMergeTrajectoryPersisted | null;
  inlineMergeTrajectoryPersisted?: InlineMergeTrajectoryPersisted | null;
  projectionGateTrajectoryPersisted?: ProjectionGateTrajectoryPersisted | null;
  wave19GateTrajectoryPersisted?: Wave19GateTrajectoryPersisted | null;
  wave20GateTrajectoryPersisted?: Wave20GateTrajectoryPersisted | null;
  wave21GateTrajectoryPersisted?: Wave21GateTrajectoryPersisted | null;
  wave22GateTrajectoryPersisted?: Wave22GateTrajectoryPersisted | null;
  wave23GateTrajectoryPersisted?: Wave23GateTrajectoryPersisted | null;
  wave24GateTrajectoryPersisted?: Wave24GateTrajectoryPersisted | null;
  wave25GateTrajectoryPersisted?: Wave25GateTrajectoryPersisted | null;
  wave26GateTrajectoryPersisted?: Wave26GateTrajectoryPersisted | null;
  wave27GateTrajectoryPersisted?: Wave27GateTrajectoryPersisted | null;
  wave28GateTrajectoryPersisted?: Wave28GateTrajectoryPersisted | null;
  wave29GateTrajectoryPersisted?: Wave29GateTrajectoryPersisted | null;
  wave30GateTrajectoryPersisted?: Wave30GateTrajectoryPersisted | null;
  wave31GateTrajectoryPersisted?: Wave31GateTrajectoryPersisted | null;
  wave32GateTrajectoryPersisted?: Wave32GateTrajectoryPersisted | null;
  wave33GateTrajectoryPersisted?: Wave33GateTrajectoryPersisted | null;
  wave34GateTrajectoryPersisted?: Wave34GateTrajectoryPersisted | null;
  wave35GateTrajectoryPersisted?: Wave35GateTrajectoryPersisted | null;
  wave36GateTrajectoryPersisted?: Wave36GateTrajectoryPersisted | null;
  wave37GateTrajectoryPersisted?: Wave37GateTrajectoryPersisted | null;
  wave38GateTrajectoryPersisted?: Wave38GateTrajectoryPersisted | null;
  wave39GateTrajectoryPersisted?: Wave39GateTrajectoryPersisted | null;
  wave40GateTrajectoryPersisted?: Wave40GateTrajectoryPersisted | null;
  wave41GateTrajectoryPersisted?: Wave41GateTrajectoryPersisted | null;
  wave42GateTrajectoryPersisted?: Wave42GateTrajectoryPersisted | null;
  wave43GateTrajectoryPersisted?: Wave43GateTrajectoryPersisted | null;
  wave44GateTrajectoryPersisted?: Wave44GateTrajectoryPersisted | null;
  wave45GateTrajectoryPersisted?: Wave45GateTrajectoryPersisted | null;
  wave46GateTrajectoryPersisted?: Wave46GateTrajectoryPersisted | null;
  wave47GateTrajectoryPersisted?: Wave47GateTrajectoryPersisted | null;
  wave48GateTrajectoryPersisted?: Wave48GateTrajectoryPersisted | null;
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
  coordinationTrajectoryPersisted: CoordinationTrajectoryPersisted;
  stabilizationTrajectoryPersisted: StabilizationTrajectoryPersisted;
  reliefFulfillmentPersisted: ReliefFulfillmentPersisted;
  readinessTrajectoryPersisted: ReadinessTrajectoryPersisted;
  resumptionTrajectoryPersisted: ResumptionTrajectoryPersisted;
  handoffTrajectoryPersisted: HandoffTrajectoryPersisted;
  integrationTrajectoryPersisted: IntegrationTrajectoryPersisted;
  wireInTrajectoryPersisted: WireInTrajectoryPersisted;
  assemblyMergeTrajectoryPersisted: AssemblyMergeTrajectoryPersisted;
  inlineMergeTrajectoryPersisted: InlineMergeTrajectoryPersisted;
  projectionGateTrajectoryPersisted: ProjectionGateTrajectoryPersisted;
  wave19GateTrajectoryPersisted: Wave19GateTrajectoryPersisted;
  wave20GateTrajectoryPersisted: Wave20GateTrajectoryPersisted;
  wave21GateTrajectoryPersisted: Wave21GateTrajectoryPersisted;
  wave22GateTrajectoryPersisted: Wave22GateTrajectoryPersisted;
  wave23GateTrajectoryPersisted: Wave23GateTrajectoryPersisted;
  wave24GateTrajectoryPersisted: Wave24GateTrajectoryPersisted;
  wave25GateTrajectoryPersisted: Wave25GateTrajectoryPersisted;
  wave26GateTrajectoryPersisted: Wave26GateTrajectoryPersisted;
  wave27GateTrajectoryPersisted: Wave27GateTrajectoryPersisted;
  wave28GateTrajectoryPersisted: Wave28GateTrajectoryPersisted;
  wave29GateTrajectoryPersisted: Wave29GateTrajectoryPersisted;
  wave30GateTrajectoryPersisted: Wave30GateTrajectoryPersisted;
  wave31GateTrajectoryPersisted: Wave31GateTrajectoryPersisted;
  wave32GateTrajectoryPersisted: Wave32GateTrajectoryPersisted;
  wave33GateTrajectoryPersisted: Wave33GateTrajectoryPersisted;
  wave34GateTrajectoryPersisted: Wave34GateTrajectoryPersisted;
  wave35GateTrajectoryPersisted: Wave35GateTrajectoryPersisted;
  wave36GateTrajectoryPersisted: Wave36GateTrajectoryPersisted;
  wave37GateTrajectoryPersisted: Wave37GateTrajectoryPersisted;
  wave38GateTrajectoryPersisted: Wave38GateTrajectoryPersisted;
  wave39GateTrajectoryPersisted: Wave39GateTrajectoryPersisted;
  wave40GateTrajectoryPersisted: Wave40GateTrajectoryPersisted;
  wave41GateTrajectoryPersisted: Wave41GateTrajectoryPersisted;
  wave42GateTrajectoryPersisted: Wave42GateTrajectoryPersisted;
  wave43GateTrajectoryPersisted: Wave43GateTrajectoryPersisted;
  wave44GateTrajectoryPersisted: Wave44GateTrajectoryPersisted;
  wave45GateTrajectoryPersisted: Wave45GateTrajectoryPersisted;
  wave46GateTrajectoryPersisted: Wave46GateTrajectoryPersisted;
  wave47GateTrajectoryPersisted: Wave47GateTrajectoryPersisted;
  wave48GateTrajectoryPersisted: Wave48GateTrajectoryPersisted;
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

  const coordinationTrajectoryAdvance = advanceCoordinationTrajectory(
    turn,
    stakeholderCoordinationBrief,
    args.coordinationTrajectoryPersisted
  );

  const reliefExecutionMonitor = buildReliefExecutionMonitor({
    turn,
    reliefDispatchPlan,
    reliefSchedule: capacityReliefSchedule,
    coordinationTrajectory: coordinationTrajectoryAdvance.snapshot,
  });

  const portfolioStabilizationBrief = composePortfolioStabilizationBrief({
    turn,
    reliefExecutionMonitor,
    stakeholderBrief: stakeholderCoordinationBrief,
    coordinationTrajectory: coordinationTrajectoryAdvance.snapshot,
    governanceTrajectory: governanceTrajectoryAdvance.snapshot,
  });

  const stabilizationTrajectoryAdvance = advanceStabilizationTrajectory(
    turn,
    portfolioStabilizationBrief,
    args.stabilizationTrajectoryPersisted
  );

  const reliefFulfillmentAdvance = advanceReliefFulfillment({
    turn,
    reliefDispatchPlan,
    executionMonitor: reliefExecutionMonitor,
    capacity,
    persisted: args.reliefFulfillmentPersisted,
  });

  const wellbeingRecoveryReadinessBrief = composeWellbeingRecoveryReadinessBrief({
    turn,
    portfolioBrief: portfolioStabilizationBrief,
    reliefFulfillment: reliefFulfillmentAdvance.snapshot,
    stabilizationTrajectory: stabilizationTrajectoryAdvance.snapshot,
  });

  const readinessTrajectoryAdvance = advanceReadinessTrajectory(
    turn,
    wellbeingRecoveryReadinessBrief,
    args.readinessTrajectoryPersisted
  );

  const fulfillmentAgingMonitor = buildFulfillmentAgingMonitor({
    turn,
    reliefFulfillment: reliefFulfillmentAdvance.snapshot,
    persisted: reliefFulfillmentAdvance.persisted,
  });

  const portfolioResumptionPlan = buildPortfolioResumptionPlan({
    turn,
    recoveryBrief: wellbeingRecoveryReadinessBrief,
    readinessTrajectory: readinessTrajectoryAdvance.snapshot,
    fulfillmentAging: fulfillmentAgingMonitor,
    interventionQueue: interventionPriorityQueue,
  });

  const resumptionTrajectoryAdvance = advanceResumptionTrajectory(
    turn,
    portfolioResumptionPlan,
    args.resumptionTrajectoryPersisted
  );

  const commitGatingAdvice = adviseCommitGating({
    turn,
    resumptionPlan: portfolioResumptionPlan,
    capacity,
    resumptionTrajectory: resumptionTrajectoryAdvance.snapshot,
    rejectedCommitmentsCount: rejectedCommitments.length,
  });

  const portfolioHandoffBrief = composePortfolioHandoffBrief({
    turn,
    resumptionPlan: portfolioResumptionPlan,
    commitGating: commitGatingAdvice,
    recoveryBrief: wellbeingRecoveryReadinessBrief,
    resumptionTrajectory: resumptionTrajectoryAdvance.snapshot,
  });

  const handoffTrajectoryAdvance = advanceHandoffTrajectory(
    turn,
    portfolioHandoffBrief,
    args.handoffTrajectoryPersisted
  );

  const gatedCommitSchedule = buildGatedCommitSchedule({
    turn,
    commitGating: commitGatingAdvice,
    resumptionPlan: portfolioResumptionPlan,
    recommendations: programRecommendations,
  });

  const wellbeingIntegrationHandoffBrief = composeWellbeingIntegrationHandoffBrief({
    turn,
    portfolioHandoff: portfolioHandoffBrief,
    handoffTrajectory: handoffTrajectoryAdvance.snapshot,
    gatedCommitSchedule,
  });

  const integrationTrajectoryAdvance = advanceIntegrationTrajectory(
    turn,
    wellbeingIntegrationHandoffBrief,
    args.integrationTrajectoryPersisted
  );

  const scheduleReadinessMonitor = buildScheduleReadinessMonitor({
    turn,
    gatedCommitSchedule,
  });

  const nationalWireInReadinessBrief = composeNationalWireInReadinessBrief({
    turn,
    integrationHandoff: wellbeingIntegrationHandoffBrief,
    scheduleReadiness: scheduleReadinessMonitor,
    integrationTrajectory: integrationTrajectoryAdvance.snapshot,
  });

  const wireInTrajectoryAdvance = advanceWireInTrajectory(
    turn,
    nationalWireInReadinessBrief,
    args.wireInTrajectoryPersisted
  );

  const turnBoundaryActivationMonitor = buildTurnBoundaryActivationMonitor({
    turn,
    wireInBrief: nationalWireInReadinessBrief,
    scheduleReadiness: scheduleReadinessMonitor,
    capacity,
  });

  const agent25AssemblyHandoffBrief = composeAgent25AssemblyHandoffBrief({
    turn,
    activationMonitor: turnBoundaryActivationMonitor,
    wireInTrajectory: wireInTrajectoryAdvance.snapshot,
  });

  const assemblyMergeTrajectoryAdvance = advanceAssemblyMergeTrajectory(
    turn,
    agent25AssemblyHandoffBrief,
    args.assemblyMergeTrajectoryPersisted
  );

  const chunkAnchorAlignmentMonitor = buildChunkAnchorAlignmentMonitor({
    turn,
    handoffBrief: agent25AssemblyHandoffBrief,
    wireInTrajectory: wireInTrajectoryAdvance.snapshot,
    integrationTrajectory: integrationTrajectoryAdvance.snapshot,
    handoffTrajectory: handoffTrajectoryAdvance.snapshot,
    resumptionTrajectory: resumptionTrajectoryAdvance.snapshot,
    readinessTrajectory: readinessTrajectoryAdvance.snapshot,
  });

  const agent25InlineReadinessBrief = composeAgent25InlineReadinessBrief({
    turn,
    anchorMonitor: chunkAnchorAlignmentMonitor,
    assemblyMergeTrajectory: assemblyMergeTrajectoryAdvance.snapshot,
  });

  const inlineMergeTrajectoryAdvance = advanceInlineMergeTrajectory(
    turn,
    agent25InlineReadinessBrief,
    args.inlineMergeTrajectoryPersisted
  );

  const inlineActivationMonitor = buildInlineActivationMonitor({
    turn,
    inlineBrief: agent25InlineReadinessBrief,
    inlineMergeTrajectory: inlineMergeTrajectoryAdvance.snapshot,
    activationMonitor: turnBoundaryActivationMonitor,
  });

  const agent25Wave17ProjectionHandoffBrief = composeAgent25Wave17ProjectionHandoffBrief({
    turn,
    inlineActivationMonitor,
    inlineMergeTrajectory: inlineMergeTrajectoryAdvance.snapshot,
  });

  const projectionGateTrajectoryAdvance = advanceProjectionGateTrajectory(
    turn,
    agent25Wave17ProjectionHandoffBrief,
    args.projectionGateTrajectoryPersisted
  );

  const wave18ProjectionMonitor = buildWave18ProjectionMonitor({
    turn,
    wave17ProjectionBrief: agent25Wave17ProjectionHandoffBrief,
    projectionGateTrajectory: projectionGateTrajectoryAdvance.snapshot,
    inlineActivationMonitor,
  });

  const agent25Wave18ProjectionHandoffBrief = composeAgent25Wave18ProjectionHandoffBrief({
    turn,
    wave18ProjectionMonitor,
    projectionGateTrajectory: projectionGateTrajectoryAdvance.snapshot,
  });

  const wave19GateTrajectoryAdvance = advanceWave19GateTrajectory(
    turn,
    agent25Wave18ProjectionHandoffBrief,
    args.wave19GateTrajectoryPersisted
  );

  const wave19IntegrationMonitor = buildWave19IntegrationMonitor({
    turn,
    wave18ProjectionBrief: agent25Wave18ProjectionHandoffBrief,
    wave19GateTrajectory: wave19GateTrajectoryAdvance.snapshot,
    wave18ProjectionMonitor,
  });

  const agent25Wave19ProjectionHandoffBrief = composeAgent25Wave19ProjectionHandoffBrief({
    turn,
    wave19IntegrationMonitor,
    wave19GateTrajectory: wave19GateTrajectoryAdvance.snapshot,
  });

  const wave20GateTrajectoryAdvance = advanceWave20GateTrajectory(
    turn,
    agent25Wave19ProjectionHandoffBrief,
    args.wave20GateTrajectoryPersisted
  );

  const wave20IntegrationMonitor = buildWave20IntegrationMonitor({
    turn,
    wave19ProjectionBrief: agent25Wave19ProjectionHandoffBrief,
    wave20GateTrajectory: wave20GateTrajectoryAdvance.snapshot,
    wave19IntegrationMonitor,
  });

  const agent25Wave20ProjectionHandoffBrief = composeAgent25Wave20ProjectionHandoffBrief({
    turn,
    wave20IntegrationMonitor,
    wave20GateTrajectory: wave20GateTrajectoryAdvance.snapshot,
  });

  const wave21GateTrajectoryAdvance = advanceWave21GateTrajectory(
    turn,
    agent25Wave20ProjectionHandoffBrief,
    args.wave21GateTrajectoryPersisted
  );

  const wave21IntegrationMonitor = buildWave21IntegrationMonitor({
    turn,
    wave20ProjectionBrief: agent25Wave20ProjectionHandoffBrief,
    wave21GateTrajectory: wave21GateTrajectoryAdvance.snapshot,
    wave20IntegrationMonitor,
  });

  const agent25Wave21ProjectionHandoffBrief = composeAgent25Wave21ProjectionHandoffBrief({
    turn,
    wave21IntegrationMonitor,
    wave21GateTrajectory: wave21GateTrajectoryAdvance.snapshot,
  });

  const wave22GateTrajectoryAdvance = advanceWave22GateTrajectory(
    turn,
    agent25Wave21ProjectionHandoffBrief,
    args.wave22GateTrajectoryPersisted
  );

  const wave22IntegrationMonitor = buildWave22IntegrationMonitor({
    turn,
    wave21ProjectionBrief: agent25Wave21ProjectionHandoffBrief,
    wave22GateTrajectory: wave22GateTrajectoryAdvance.snapshot,
    wave21IntegrationMonitor,
  });

  const agent25Wave22ProjectionHandoffBrief = composeAgent25Wave22ProjectionHandoffBrief({
    turn,
    wave22IntegrationMonitor,
    wave22GateTrajectory: wave22GateTrajectoryAdvance.snapshot,
  });

  const wave23GateTrajectoryAdvance = advanceWave23GateTrajectory(
    turn,
    agent25Wave22ProjectionHandoffBrief,
    args.wave23GateTrajectoryPersisted
  );

  const wave23IntegrationMonitor = buildWave23IntegrationMonitor({
    turn,
    wave22ProjectionBrief: agent25Wave22ProjectionHandoffBrief,
    wave23GateTrajectory: wave23GateTrajectoryAdvance.snapshot,
    wave22IntegrationMonitor,
  });

  const agent25Wave23ProjectionHandoffBrief = composeAgent25Wave23ProjectionHandoffBrief({
    turn,
    wave23IntegrationMonitor,
    wave23GateTrajectory: wave23GateTrajectoryAdvance.snapshot,
  });

  const wave24GateTrajectoryAdvance = advanceWave24GateTrajectory(
    turn,
    agent25Wave23ProjectionHandoffBrief,
    args.wave24GateTrajectoryPersisted
  );

  const wave24IntegrationMonitor = buildWave24IntegrationMonitor({
    turn,
    wave23ProjectionBrief: agent25Wave23ProjectionHandoffBrief,
    wave24GateTrajectory: wave24GateTrajectoryAdvance.snapshot,
    wave23IntegrationMonitor,
  });

  const agent25Wave24ProjectionHandoffBrief = composeAgent25Wave24ProjectionHandoffBrief({
    turn,
    wave24IntegrationMonitor,
    wave24GateTrajectory: wave24GateTrajectoryAdvance.snapshot,
  });

  const wave25GateTrajectoryAdvance = advanceWave25GateTrajectory(
    turn,
    agent25Wave24ProjectionHandoffBrief,
    args.wave25GateTrajectoryPersisted
  );

  const wave25IntegrationMonitor = buildWave25IntegrationMonitor({
    turn,
    wave24ProjectionBrief: agent25Wave24ProjectionHandoffBrief,
    wave25GateTrajectory: wave25GateTrajectoryAdvance.snapshot,
    wave24IntegrationMonitor,
  });

  const agent25Wave25ProjectionHandoffBrief = composeAgent25Wave25ProjectionHandoffBrief({
    turn,
    wave25IntegrationMonitor,
    wave25GateTrajectory: wave25GateTrajectoryAdvance.snapshot,
  });

  const wave26GateTrajectoryAdvance = advanceWave26GateTrajectory(
    turn,
    agent25Wave25ProjectionHandoffBrief,
    args.wave26GateTrajectoryPersisted
  );

  const wave26IntegrationMonitor = buildWave26IntegrationMonitor({
    turn,
    wave25ProjectionBrief: agent25Wave25ProjectionHandoffBrief,
    wave26GateTrajectory: wave26GateTrajectoryAdvance.snapshot,
    wave25IntegrationMonitor,
  });

  const agent25Wave26ProjectionHandoffBrief = composeAgent25Wave26ProjectionHandoffBrief({
    turn,
    wave26IntegrationMonitor,
    wave26GateTrajectory: wave26GateTrajectoryAdvance.snapshot,
  });

  const wave27GateTrajectoryAdvance = advanceWave27GateTrajectory(
    turn,
    agent25Wave26ProjectionHandoffBrief,
    args.wave27GateTrajectoryPersisted
  );

  const wave27IntegrationMonitor = buildWave27IntegrationMonitor({
    turn,
    wave26ProjectionBrief: agent25Wave26ProjectionHandoffBrief,
    wave27GateTrajectory: wave27GateTrajectoryAdvance.snapshot,
    wave26IntegrationMonitor,
  });

  const agent25Wave27ProjectionHandoffBrief = composeAgent25Wave27ProjectionHandoffBrief({
    turn,
    wave27IntegrationMonitor,
    wave27GateTrajectory: wave27GateTrajectoryAdvance.snapshot,
  });

  const wave28GateTrajectoryAdvance = advanceWave28GateTrajectory(
    turn,
    agent25Wave27ProjectionHandoffBrief,
    args.wave28GateTrajectoryPersisted
  );

  const wave28IntegrationMonitor = buildWave28IntegrationMonitor({
    turn,
    wave27ProjectionBrief: agent25Wave27ProjectionHandoffBrief,
    wave28GateTrajectory: wave28GateTrajectoryAdvance.snapshot,
    wave27IntegrationMonitor,
  });

  const agent25Wave28ProjectionHandoffBrief = composeAgent25Wave28ProjectionHandoffBrief({
    turn,
    wave28IntegrationMonitor,
    wave28GateTrajectory: wave28GateTrajectoryAdvance.snapshot,
  });

  const wave29GateTrajectoryAdvance = advanceWave29GateTrajectory(
    turn,
    agent25Wave28ProjectionHandoffBrief,
    args.wave29GateTrajectoryPersisted
  );

  const wave29IntegrationMonitor = buildWave29IntegrationMonitor({
    turn,
    wave28ProjectionBrief: agent25Wave28ProjectionHandoffBrief,
    wave29GateTrajectory: wave29GateTrajectoryAdvance.snapshot,
    wave28IntegrationMonitor,
  });

  const agent25Wave29ProjectionHandoffBrief = composeAgent25Wave29ProjectionHandoffBrief({
    turn,
    wave29IntegrationMonitor,
    wave29GateTrajectory: wave29GateTrajectoryAdvance.snapshot,
  });

  const wave30GateTrajectoryAdvance = advanceWave30GateTrajectory(
    turn,
    agent25Wave29ProjectionHandoffBrief,
    args.wave30GateTrajectoryPersisted
  );

  const wave30IntegrationMonitor = buildWave30IntegrationMonitor({
    turn,
    wave29ProjectionBrief: agent25Wave29ProjectionHandoffBrief,
    wave30GateTrajectory: wave30GateTrajectoryAdvance.snapshot,
    wave29IntegrationMonitor,
  });

  const agent25Wave30ProjectionHandoffBrief = composeAgent25Wave30ProjectionHandoffBrief({
    turn,
    wave30IntegrationMonitor,
    wave30GateTrajectory: wave30GateTrajectoryAdvance.snapshot,
  });

  const wave31GateTrajectoryAdvance = advanceWave31GateTrajectory(
    turn,
    agent25Wave30ProjectionHandoffBrief,
    args.wave31GateTrajectoryPersisted
  );

  const wave31IntegrationMonitor = buildWave31IntegrationMonitor({
    turn,
    wave30ProjectionBrief: agent25Wave30ProjectionHandoffBrief,
    wave31GateTrajectory: wave31GateTrajectoryAdvance.snapshot,
    wave30IntegrationMonitor,
  });

  const agent25Wave31ProjectionHandoffBrief = composeAgent25Wave31ProjectionHandoffBrief({
    turn,
    wave31IntegrationMonitor,
    wave31GateTrajectory: wave31GateTrajectoryAdvance.snapshot,
  });

  const wave32GateTrajectoryAdvance = advanceWave32GateTrajectory(
    turn,
    agent25Wave31ProjectionHandoffBrief,
    args.wave32GateTrajectoryPersisted
  );

  const wave32IntegrationMonitor = buildWave32IntegrationMonitor({
    turn,
    wave31ProjectionBrief: agent25Wave31ProjectionHandoffBrief,
    wave32GateTrajectory: wave32GateTrajectoryAdvance.snapshot,
    wave31IntegrationMonitor,
  });

  const agent25Wave32ProjectionHandoffBrief = composeAgent25Wave32ProjectionHandoffBrief({
    turn,
    wave32IntegrationMonitor,
    wave32GateTrajectory: wave32GateTrajectoryAdvance.snapshot,
  });

  const wave33GateTrajectoryAdvance = advanceWave33GateTrajectory(
    turn,
    agent25Wave32ProjectionHandoffBrief,
    args.wave33GateTrajectoryPersisted
  );

  const wave33IntegrationMonitor = buildWave33IntegrationMonitor({
    turn,
    wave32ProjectionBrief: agent25Wave32ProjectionHandoffBrief,
    wave33GateTrajectory: wave33GateTrajectoryAdvance.snapshot,
    wave32IntegrationMonitor,
  });

  const agent25Wave33ProjectionHandoffBrief = composeAgent25Wave33ProjectionHandoffBrief({
    turn,
    wave33IntegrationMonitor,
    wave33GateTrajectory: wave33GateTrajectoryAdvance.snapshot,
  });

  const wave34GateTrajectoryAdvance = advanceWave34GateTrajectory(
    turn,
    agent25Wave33ProjectionHandoffBrief,
    args.wave34GateTrajectoryPersisted
  );

  const wave34IntegrationMonitor = buildWave34IntegrationMonitor({
    turn,
    wave33ProjectionBrief: agent25Wave33ProjectionHandoffBrief,
    wave34GateTrajectory: wave34GateTrajectoryAdvance.snapshot,
    wave33IntegrationMonitor,
  });

  const agent25Wave34ProjectionHandoffBrief = composeAgent25Wave34ProjectionHandoffBrief({
    turn,
    wave34IntegrationMonitor,
    wave34GateTrajectory: wave34GateTrajectoryAdvance.snapshot,
  });

  const wave35GateTrajectoryAdvance = advanceWave35GateTrajectory(
    turn,
    agent25Wave34ProjectionHandoffBrief,
    args.wave35GateTrajectoryPersisted
  );

  const wave35IntegrationMonitor = buildWave35IntegrationMonitor({
    turn,
    wave34ProjectionBrief: agent25Wave34ProjectionHandoffBrief,
    wave35GateTrajectory: wave35GateTrajectoryAdvance.snapshot,
    wave34IntegrationMonitor,
  });

  const agent25Wave35ProjectionHandoffBrief = composeAgent25Wave35ProjectionHandoffBrief({
    turn,
    wave35IntegrationMonitor,
    wave35GateTrajectory: wave35GateTrajectoryAdvance.snapshot,
  });

  const wave36GateTrajectoryAdvance = advanceWave36GateTrajectory(
    turn,
    agent25Wave35ProjectionHandoffBrief,
    args.wave36GateTrajectoryPersisted
  );

  const wave36IntegrationMonitor = buildWave36IntegrationMonitor({
    turn,
    wave35ProjectionBrief: agent25Wave35ProjectionHandoffBrief,
    wave36GateTrajectory: wave36GateTrajectoryAdvance.snapshot,
    wave35IntegrationMonitor,
  });

  const agent25Wave36ProjectionHandoffBrief = composeAgent25Wave36ProjectionHandoffBrief({
    turn,
    wave36IntegrationMonitor,
    wave36GateTrajectory: wave36GateTrajectoryAdvance.snapshot,
  });

  const wave37GateTrajectoryAdvance = advanceWave37GateTrajectory(
    turn,
    agent25Wave36ProjectionHandoffBrief,
    args.wave37GateTrajectoryPersisted
  );

  const wave37IntegrationMonitor = buildWave37IntegrationMonitor({
    turn,
    wave36ProjectionBrief: agent25Wave36ProjectionHandoffBrief,
    wave37GateTrajectory: wave37GateTrajectoryAdvance.snapshot,
    wave36IntegrationMonitor,
  });

  const agent25Wave37ProjectionHandoffBrief = composeAgent25Wave37ProjectionHandoffBrief({
    turn,
    wave37IntegrationMonitor,
    wave37GateTrajectory: wave37GateTrajectoryAdvance.snapshot,
  });

  const wave38GateTrajectoryAdvance = advanceWave38GateTrajectory(
    turn,
    agent25Wave37ProjectionHandoffBrief,
    args.wave38GateTrajectoryPersisted
  );

  const wave38IntegrationMonitor = buildWave38IntegrationMonitor({
    turn,
    wave37ProjectionBrief: agent25Wave37ProjectionHandoffBrief,
    wave38GateTrajectory: wave38GateTrajectoryAdvance.snapshot,
    wave37IntegrationMonitor,
  });

  const agent25Wave38ProjectionHandoffBrief = composeAgent25Wave38ProjectionHandoffBrief({
    turn,
    wave38IntegrationMonitor,
    wave38GateTrajectory: wave38GateTrajectoryAdvance.snapshot,
  });

  const wave39GateTrajectoryAdvance = advanceWave39GateTrajectory(
    turn,
    agent25Wave38ProjectionHandoffBrief,
    args.wave39GateTrajectoryPersisted
  );

  const wave39IntegrationMonitor = buildWave39IntegrationMonitor({
    turn,
    wave38ProjectionBrief: agent25Wave38ProjectionHandoffBrief,
    wave39GateTrajectory: wave39GateTrajectoryAdvance.snapshot,
    wave38IntegrationMonitor,
  });

  const agent25Wave39ProjectionHandoffBrief = composeAgent25Wave39ProjectionHandoffBrief({
    turn,
    wave39IntegrationMonitor,
    wave39GateTrajectory: wave39GateTrajectoryAdvance.snapshot,
  });

  const wave40GateTrajectoryAdvance = advanceWave40GateTrajectory(
    turn,
    agent25Wave39ProjectionHandoffBrief,
    args.wave40GateTrajectoryPersisted
  );

  const wave40IntegrationMonitor = buildWave40IntegrationMonitor({
    turn,
    wave39ProjectionBrief: agent25Wave39ProjectionHandoffBrief,
    wave40GateTrajectory: wave40GateTrajectoryAdvance.snapshot,
    wave39IntegrationMonitor,
  });

  const agent25Wave40ProjectionHandoffBrief = composeAgent25Wave40ProjectionHandoffBrief({
    turn,
    wave40IntegrationMonitor,
    wave40GateTrajectory: wave40GateTrajectoryAdvance.snapshot,
  });

  const wave41GateTrajectoryAdvance = advanceWave41GateTrajectory(
    turn,
    agent25Wave40ProjectionHandoffBrief,
    args.wave41GateTrajectoryPersisted
  );

  const wave41IntegrationMonitor = buildWave41IntegrationMonitor({
    turn,
    wave40ProjectionBrief: agent25Wave40ProjectionHandoffBrief,
    wave41GateTrajectory: wave41GateTrajectoryAdvance.snapshot,
    wave40IntegrationMonitor,
  });

  const agent25Wave41ProjectionHandoffBrief = composeAgent25Wave41ProjectionHandoffBrief({
    turn,
    wave41IntegrationMonitor,
    wave41GateTrajectory: wave41GateTrajectoryAdvance.snapshot,
  });

  const wave42GateTrajectoryAdvance = advanceWave42GateTrajectory(
    turn,
    agent25Wave41ProjectionHandoffBrief,
    args.wave42GateTrajectoryPersisted
  );

  const wave42IntegrationMonitor = buildWave42IntegrationMonitor({
    turn,
    wave41ProjectionBrief: agent25Wave41ProjectionHandoffBrief,
    wave42GateTrajectory: wave42GateTrajectoryAdvance.snapshot,
    wave41IntegrationMonitor,
  });

  const agent25Wave42ProjectionHandoffBrief = composeAgent25Wave42ProjectionHandoffBrief({
    turn,
    wave42IntegrationMonitor,
    wave42GateTrajectory: wave42GateTrajectoryAdvance.snapshot,
  });

  const wave43GateTrajectoryAdvance = advanceWave43GateTrajectory(
    turn,
    agent25Wave42ProjectionHandoffBrief,
    args.wave43GateTrajectoryPersisted
  );

  const wave43IntegrationMonitor = buildWave43IntegrationMonitor({
    turn,
    wave42ProjectionBrief: agent25Wave42ProjectionHandoffBrief,
    wave43GateTrajectory: wave43GateTrajectoryAdvance.snapshot,
    wave42IntegrationMonitor,
  });

  const agent25Wave43ProjectionHandoffBrief = composeAgent25Wave43ProjectionHandoffBrief({
    turn,
    wave43IntegrationMonitor,
    wave43GateTrajectory: wave43GateTrajectoryAdvance.snapshot,
  });

  const wave44GateTrajectoryAdvance = advanceWave44GateTrajectory(
    turn,
    agent25Wave43ProjectionHandoffBrief,
    args.wave44GateTrajectoryPersisted
  );

  const wave44IntegrationMonitor = buildWave44IntegrationMonitor({
    turn,
    wave43ProjectionBrief: agent25Wave43ProjectionHandoffBrief,
    wave44GateTrajectory: wave44GateTrajectoryAdvance.snapshot,
    wave43IntegrationMonitor,
  });

  const agent25Wave44ProjectionHandoffBrief = composeAgent25Wave44ProjectionHandoffBrief({
    turn,
    wave44IntegrationMonitor,
    wave44GateTrajectory: wave44GateTrajectoryAdvance.snapshot,
  });

  const wave45GateTrajectoryAdvance = advanceWave45GateTrajectory(
    turn,
    agent25Wave44ProjectionHandoffBrief,
    args.wave45GateTrajectoryPersisted
  );

  const wave45IntegrationMonitor = buildWave45IntegrationMonitor({
    turn,
    wave44ProjectionBrief: agent25Wave44ProjectionHandoffBrief,
    wave45GateTrajectory: wave45GateTrajectoryAdvance.snapshot,
    wave44IntegrationMonitor,
  });

  const agent25Wave45ProjectionHandoffBrief = composeAgent25Wave45ProjectionHandoffBrief({
    turn,
    wave45IntegrationMonitor,
    wave45GateTrajectory: wave45GateTrajectoryAdvance.snapshot,
  });

  const wave46GateTrajectoryAdvance = advanceWave46GateTrajectory(
    turn,
    agent25Wave45ProjectionHandoffBrief,
    args.wave46GateTrajectoryPersisted
  );

  const wave46IntegrationMonitor = buildWave46IntegrationMonitor({
    turn,
    wave45ProjectionBrief: agent25Wave45ProjectionHandoffBrief,
    wave46GateTrajectory: wave46GateTrajectoryAdvance.snapshot,
    wave45IntegrationMonitor,
  });

  const agent25Wave46ProjectionHandoffBrief = composeAgent25Wave46ProjectionHandoffBrief({
    turn,
    wave46IntegrationMonitor,
    wave46GateTrajectory: wave46GateTrajectoryAdvance.snapshot,
  });

  const wave47GateTrajectoryAdvance = advanceWave47GateTrajectory(
    turn,
    agent25Wave46ProjectionHandoffBrief,
    args.wave47GateTrajectoryPersisted
  );

  const wave47IntegrationMonitor = buildWave47IntegrationMonitor({
    turn,
    wave46ProjectionBrief: agent25Wave46ProjectionHandoffBrief,
    wave47GateTrajectory: wave47GateTrajectoryAdvance.snapshot,
    wave46IntegrationMonitor,
  });

  const agent25Wave47ProjectionHandoffBrief = composeAgent25Wave47ProjectionHandoffBrief({
    turn,
    wave47IntegrationMonitor,
    wave47GateTrajectory: wave47GateTrajectoryAdvance.snapshot,
  });

  const wave48GateTrajectoryAdvance = advanceWave48GateTrajectory(
    turn,
    agent25Wave47ProjectionHandoffBrief,
    args.wave48GateTrajectoryPersisted
  );

  const wave48IntegrationMonitor = buildWave48IntegrationMonitor({
    turn,
    wave47ProjectionBrief: agent25Wave47ProjectionHandoffBrief,
    wave48GateTrajectory: wave48GateTrajectoryAdvance.snapshot,
    wave47IntegrationMonitor,
  });

  const agent25Wave48ProjectionHandoffBrief = composeAgent25Wave48ProjectionHandoffBrief({
    turn,
    wave48IntegrationMonitor,
    wave48GateTrajectory: wave48GateTrajectoryAdvance.snapshot,
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
    coordinationTrajectory: coordinationTrajectoryAdvance.snapshot,
    reliefExecutionMonitor,
    portfolioStabilizationBrief,
    stabilizationTrajectory: stabilizationTrajectoryAdvance.snapshot,
    reliefFulfillment: reliefFulfillmentAdvance.snapshot,
    wellbeingRecoveryReadinessBrief,
    readinessTrajectory: readinessTrajectoryAdvance.snapshot,
    fulfillmentAgingMonitor,
    portfolioResumptionPlan,
    resumptionTrajectory: resumptionTrajectoryAdvance.snapshot,
    commitGatingAdvice,
    portfolioHandoffBrief,
    handoffTrajectory: handoffTrajectoryAdvance.snapshot,
    gatedCommitSchedule,
    wellbeingIntegrationHandoffBrief,
    integrationTrajectory: integrationTrajectoryAdvance.snapshot,
    scheduleReadinessMonitor,
    nationalWireInReadinessBrief,
    wireInTrajectory: wireInTrajectoryAdvance.snapshot,
    turnBoundaryActivationMonitor,
    agent25AssemblyHandoffBrief,
    assemblyMergeTrajectory: assemblyMergeTrajectoryAdvance.snapshot,
    chunkAnchorAlignmentMonitor,
    agent25InlineReadinessBrief,
    inlineMergeTrajectory: inlineMergeTrajectoryAdvance.snapshot,
    inlineActivationMonitor,
    agent25Wave17ProjectionHandoffBrief,
    projectionGateTrajectory: projectionGateTrajectoryAdvance.snapshot,
    wave18ProjectionMonitor,
    agent25Wave18ProjectionHandoffBrief,
    wave19GateTrajectory: wave19GateTrajectoryAdvance.snapshot,
    wave19IntegrationMonitor,
    agent25Wave19ProjectionHandoffBrief,
    wave20GateTrajectory: wave20GateTrajectoryAdvance.snapshot,
    wave20IntegrationMonitor,
    agent25Wave20ProjectionHandoffBrief,
    wave21GateTrajectory: wave21GateTrajectoryAdvance.snapshot,
    wave21IntegrationMonitor,
    agent25Wave21ProjectionHandoffBrief,
    wave22GateTrajectory: wave22GateTrajectoryAdvance.snapshot,
    wave22IntegrationMonitor,
    agent25Wave22ProjectionHandoffBrief,
    wave23GateTrajectory: wave23GateTrajectoryAdvance.snapshot,
    wave23IntegrationMonitor,
    agent25Wave23ProjectionHandoffBrief,
    wave24GateTrajectory: wave24GateTrajectoryAdvance.snapshot,
    wave24IntegrationMonitor,
    agent25Wave24ProjectionHandoffBrief,
    wave25GateTrajectory: wave25GateTrajectoryAdvance.snapshot,
    wave25IntegrationMonitor,
    agent25Wave25ProjectionHandoffBrief,
    wave26GateTrajectory: wave26GateTrajectoryAdvance.snapshot,
    wave26IntegrationMonitor,
    agent25Wave26ProjectionHandoffBrief,
    wave27GateTrajectory: wave27GateTrajectoryAdvance.snapshot,
    wave27IntegrationMonitor,
    agent25Wave27ProjectionHandoffBrief,
    wave28GateTrajectory: wave28GateTrajectoryAdvance.snapshot,
    wave28IntegrationMonitor,
    agent25Wave28ProjectionHandoffBrief,
    wave29GateTrajectory: wave29GateTrajectoryAdvance.snapshot,
    wave29IntegrationMonitor,
    agent25Wave29ProjectionHandoffBrief,
    wave30GateTrajectory: wave30GateTrajectoryAdvance.snapshot,
    wave30IntegrationMonitor,
    agent25Wave30ProjectionHandoffBrief,
    wave31GateTrajectory: wave31GateTrajectoryAdvance.snapshot,
    wave31IntegrationMonitor,
    agent25Wave31ProjectionHandoffBrief,
    wave32GateTrajectory: wave32GateTrajectoryAdvance.snapshot,
    wave32IntegrationMonitor,
    agent25Wave32ProjectionHandoffBrief,
    wave33GateTrajectory: wave33GateTrajectoryAdvance.snapshot,
    wave33IntegrationMonitor,
    agent25Wave33ProjectionHandoffBrief,
    wave34GateTrajectory: wave34GateTrajectoryAdvance.snapshot,
    wave34IntegrationMonitor,
    agent25Wave34ProjectionHandoffBrief,
    wave35GateTrajectory: wave35GateTrajectoryAdvance.snapshot,
    wave35IntegrationMonitor,
    agent25Wave35ProjectionHandoffBrief,
    wave36GateTrajectory: wave36GateTrajectoryAdvance.snapshot,
    wave36IntegrationMonitor,
    agent25Wave36ProjectionHandoffBrief,
    wave37GateTrajectory: wave37GateTrajectoryAdvance.snapshot,
    wave37IntegrationMonitor,
    agent25Wave37ProjectionHandoffBrief,
    wave38GateTrajectory: wave38GateTrajectoryAdvance.snapshot,
    wave38IntegrationMonitor,
    agent25Wave38ProjectionHandoffBrief,
    wave39GateTrajectory: wave39GateTrajectoryAdvance.snapshot,
    wave39IntegrationMonitor,
    agent25Wave39ProjectionHandoffBrief,
    wave40GateTrajectory: wave40GateTrajectoryAdvance.snapshot,
    wave40IntegrationMonitor,
    agent25Wave40ProjectionHandoffBrief,
    wave41GateTrajectory: wave41GateTrajectoryAdvance.snapshot,
    wave41IntegrationMonitor,
    agent25Wave41ProjectionHandoffBrief,
    wave42GateTrajectory: wave42GateTrajectoryAdvance.snapshot,
    wave42IntegrationMonitor,
    agent25Wave42ProjectionHandoffBrief,
    wave43GateTrajectory: wave43GateTrajectoryAdvance.snapshot,
    wave43IntegrationMonitor,
    agent25Wave43ProjectionHandoffBrief,
    wave44GateTrajectory: wave44GateTrajectoryAdvance.snapshot,
    wave44IntegrationMonitor,
    agent25Wave44ProjectionHandoffBrief,
    wave45GateTrajectory: wave45GateTrajectoryAdvance.snapshot,
    wave45IntegrationMonitor,
    agent25Wave45ProjectionHandoffBrief,
    wave46GateTrajectory: wave46GateTrajectoryAdvance.snapshot,
    wave46IntegrationMonitor,
    agent25Wave46ProjectionHandoffBrief,
    wave47GateTrajectory: wave47GateTrajectoryAdvance.snapshot,
    wave47IntegrationMonitor,
    agent25Wave47ProjectionHandoffBrief,
    wave48GateTrajectory: wave48GateTrajectoryAdvance.snapshot,
    wave48IntegrationMonitor,
    agent25Wave48ProjectionHandoffBrief,
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
    coordinationTrajectory: coordinationTrajectoryAdvance.snapshot,
    reliefExecutionMonitor,
    portfolioStabilizationBrief,
    stabilizationTrajectory: stabilizationTrajectoryAdvance.snapshot,
    reliefFulfillment: reliefFulfillmentAdvance.snapshot,
    wellbeingRecoveryReadinessBrief,
    readinessTrajectory: readinessTrajectoryAdvance.snapshot,
    fulfillmentAgingMonitor,
    portfolioResumptionPlan,
    resumptionTrajectory: resumptionTrajectoryAdvance.snapshot,
    commitGatingAdvice,
    portfolioHandoffBrief,
    handoffTrajectory: handoffTrajectoryAdvance.snapshot,
    gatedCommitSchedule,
    wellbeingIntegrationHandoffBrief,
    integrationTrajectory: integrationTrajectoryAdvance.snapshot,
    scheduleReadinessMonitor,
    nationalWireInReadinessBrief,
    wireInTrajectory: wireInTrajectoryAdvance.snapshot,
    turnBoundaryActivationMonitor,
    agent25AssemblyHandoffBrief,
    assemblyMergeTrajectory: assemblyMergeTrajectoryAdvance.snapshot,
    chunkAnchorAlignmentMonitor,
    agent25InlineReadinessBrief,
    inlineMergeTrajectory: inlineMergeTrajectoryAdvance.snapshot,
    inlineActivationMonitor,
    agent25Wave17ProjectionHandoffBrief,
    projectionGateTrajectory: projectionGateTrajectoryAdvance.snapshot,
    wave18ProjectionMonitor,
    agent25Wave18ProjectionHandoffBrief,
    wave19GateTrajectory: wave19GateTrajectoryAdvance.snapshot,
    wave19IntegrationMonitor,
    agent25Wave19ProjectionHandoffBrief,
    wave20GateTrajectory: wave20GateTrajectoryAdvance.snapshot,
    wave20IntegrationMonitor,
    agent25Wave20ProjectionHandoffBrief,
    wave21GateTrajectory: wave21GateTrajectoryAdvance.snapshot,
    wave21IntegrationMonitor,
    agent25Wave21ProjectionHandoffBrief,
    wave22GateTrajectory: wave22GateTrajectoryAdvance.snapshot,
    wave22IntegrationMonitor,
    agent25Wave22ProjectionHandoffBrief,
    wave23GateTrajectory: wave23GateTrajectoryAdvance.snapshot,
    wave23IntegrationMonitor,
    agent25Wave23ProjectionHandoffBrief,
    wave24GateTrajectory: wave24GateTrajectoryAdvance.snapshot,
    wave24IntegrationMonitor,
    agent25Wave24ProjectionHandoffBrief,
    wave25GateTrajectory: wave25GateTrajectoryAdvance.snapshot,
    wave25IntegrationMonitor,
    agent25Wave25ProjectionHandoffBrief,
    wave26GateTrajectory: wave26GateTrajectoryAdvance.snapshot,
    wave26IntegrationMonitor,
    agent25Wave26ProjectionHandoffBrief,
    wave27GateTrajectory: wave27GateTrajectoryAdvance.snapshot,
    wave27IntegrationMonitor,
    agent25Wave27ProjectionHandoffBrief,
    wave28GateTrajectory: wave28GateTrajectoryAdvance.snapshot,
    wave28IntegrationMonitor,
    agent25Wave28ProjectionHandoffBrief,
    wave29GateTrajectory: wave29GateTrajectoryAdvance.snapshot,
    wave29IntegrationMonitor,
    agent25Wave29ProjectionHandoffBrief,
    wave30GateTrajectory: wave30GateTrajectoryAdvance.snapshot,
    wave30IntegrationMonitor,
    agent25Wave30ProjectionHandoffBrief,
    wave31GateTrajectory: wave31GateTrajectoryAdvance.snapshot,
    wave31IntegrationMonitor,
    agent25Wave31ProjectionHandoffBrief,
    wave32GateTrajectory: wave32GateTrajectoryAdvance.snapshot,
    wave32IntegrationMonitor,
    agent25Wave32ProjectionHandoffBrief,
    wave33GateTrajectory: wave33GateTrajectoryAdvance.snapshot,
    wave33IntegrationMonitor,
    agent25Wave33ProjectionHandoffBrief,
    wave34GateTrajectory: wave34GateTrajectoryAdvance.snapshot,
    wave34IntegrationMonitor,
    agent25Wave34ProjectionHandoffBrief,
    wave35GateTrajectory: wave35GateTrajectoryAdvance.snapshot,
    wave35IntegrationMonitor,
    agent25Wave35ProjectionHandoffBrief,
    wave36GateTrajectory: wave36GateTrajectoryAdvance.snapshot,
    wave36IntegrationMonitor,
    agent25Wave36ProjectionHandoffBrief,
    wave37GateTrajectory: wave37GateTrajectoryAdvance.snapshot,
    wave37IntegrationMonitor,
    agent25Wave37ProjectionHandoffBrief,
    wave38GateTrajectory: wave38GateTrajectoryAdvance.snapshot,
    wave38IntegrationMonitor,
    agent25Wave38ProjectionHandoffBrief,
    wave39GateTrajectory: wave39GateTrajectoryAdvance.snapshot,
    wave39IntegrationMonitor,
    agent25Wave39ProjectionHandoffBrief,
    wave40GateTrajectory: wave40GateTrajectoryAdvance.snapshot,
    wave40IntegrationMonitor,
    agent25Wave40ProjectionHandoffBrief,
    wave41GateTrajectory: wave41GateTrajectoryAdvance.snapshot,
    wave41IntegrationMonitor,
    agent25Wave41ProjectionHandoffBrief,
    wave42GateTrajectory: wave42GateTrajectoryAdvance.snapshot,
    wave42IntegrationMonitor,
    agent25Wave42ProjectionHandoffBrief,
    wave43GateTrajectory: wave43GateTrajectoryAdvance.snapshot,
    wave43IntegrationMonitor,
    agent25Wave43ProjectionHandoffBrief,
    wave44GateTrajectory: wave44GateTrajectoryAdvance.snapshot,
    wave44IntegrationMonitor,
    agent25Wave44ProjectionHandoffBrief,
    wave45GateTrajectory: wave45GateTrajectoryAdvance.snapshot,
    wave45IntegrationMonitor,
    agent25Wave45ProjectionHandoffBrief,
    wave46GateTrajectory: wave46GateTrajectoryAdvance.snapshot,
    wave46IntegrationMonitor,
    agent25Wave46ProjectionHandoffBrief,
    wave47GateTrajectory: wave47GateTrajectoryAdvance.snapshot,
    wave47IntegrationMonitor,
    agent25Wave47ProjectionHandoffBrief,
    wave48GateTrajectory: wave48GateTrajectoryAdvance.snapshot,
    wave48IntegrationMonitor,
    agent25Wave48ProjectionHandoffBrief,
  };

  return {
    inputs: enriched,
    spendingPersisted,
    wellbeingMemoryPersisted: memoryAdvance.persisted,
    couplingTrajectoryPersisted: couplingTrajectoryAdvance.persisted,
    accountabilityTrajectoryPersisted: accountabilityTrajectoryAdvance.persisted,
    resilienceTrajectoryPersisted: resilienceTrajectoryAdvance.persisted,
    governanceTrajectoryPersisted: governanceTrajectoryAdvance.persisted,
    coordinationTrajectoryPersisted: coordinationTrajectoryAdvance.persisted,
    stabilizationTrajectoryPersisted: stabilizationTrajectoryAdvance.persisted,
    reliefFulfillmentPersisted: reliefFulfillmentAdvance.persisted,
    readinessTrajectoryPersisted: readinessTrajectoryAdvance.persisted,
    resumptionTrajectoryPersisted: resumptionTrajectoryAdvance.persisted,
    handoffTrajectoryPersisted: handoffTrajectoryAdvance.persisted,
    integrationTrajectoryPersisted: integrationTrajectoryAdvance.persisted,
    wireInTrajectoryPersisted: wireInTrajectoryAdvance.persisted,
    assemblyMergeTrajectoryPersisted: assemblyMergeTrajectoryAdvance.persisted,
    inlineMergeTrajectoryPersisted: inlineMergeTrajectoryAdvance.persisted,
    projectionGateTrajectoryPersisted: projectionGateTrajectoryAdvance.persisted,
    wave19GateTrajectoryPersisted: wave19GateTrajectoryAdvance.persisted,
    wave20GateTrajectoryPersisted: wave20GateTrajectoryAdvance.persisted,
    wave21GateTrajectoryPersisted: wave21GateTrajectoryAdvance.persisted,
    wave22GateTrajectoryPersisted: wave22GateTrajectoryAdvance.persisted,
    wave23GateTrajectoryPersisted: wave23GateTrajectoryAdvance.persisted,
    wave24GateTrajectoryPersisted: wave24GateTrajectoryAdvance.persisted,
    wave25GateTrajectoryPersisted: wave25GateTrajectoryAdvance.persisted,
    wave26GateTrajectoryPersisted: wave26GateTrajectoryAdvance.persisted,
    wave27GateTrajectoryPersisted: wave27GateTrajectoryAdvance.persisted,
    wave28GateTrajectoryPersisted: wave28GateTrajectoryAdvance.persisted,
    wave29GateTrajectoryPersisted: wave29GateTrajectoryAdvance.persisted,
    wave30GateTrajectoryPersisted: wave30GateTrajectoryAdvance.persisted,
    wave31GateTrajectoryPersisted: wave31GateTrajectoryAdvance.persisted,
    wave32GateTrajectoryPersisted: wave32GateTrajectoryAdvance.persisted,
    wave33GateTrajectoryPersisted: wave33GateTrajectoryAdvance.persisted,
    wave34GateTrajectoryPersisted: wave34GateTrajectoryAdvance.persisted,
    wave35GateTrajectoryPersisted: wave35GateTrajectoryAdvance.persisted,
    wave36GateTrajectoryPersisted: wave36GateTrajectoryAdvance.persisted,
    wave37GateTrajectoryPersisted: wave37GateTrajectoryAdvance.persisted,
    wave38GateTrajectoryPersisted: wave38GateTrajectoryAdvance.persisted,
    wave39GateTrajectoryPersisted: wave39GateTrajectoryAdvance.persisted,
    wave40GateTrajectoryPersisted: wave40GateTrajectoryAdvance.persisted,
    wave41GateTrajectoryPersisted: wave41GateTrajectoryAdvance.persisted,
    wave42GateTrajectoryPersisted: wave42GateTrajectoryAdvance.persisted,
    wave43GateTrajectoryPersisted: wave43GateTrajectoryAdvance.persisted,
    wave44GateTrajectoryPersisted: wave44GateTrajectoryAdvance.persisted,
    wave45GateTrajectoryPersisted: wave45GateTrajectoryAdvance.persisted,
    wave46GateTrajectoryPersisted: wave46GateTrajectoryAdvance.persisted,
    wave47GateTrajectoryPersisted: wave47GateTrajectoryAdvance.persisted,
    wave48GateTrajectoryPersisted: wave48GateTrajectoryAdvance.persisted,
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
  | 'relief_dispatch_coordination_stress'
  | 'coordination_trajectory_arc'
  | 'relief_execution_stress'
  | 'stabilization_recovery_arc'
  | 'relief_fulfillment_backlog_stress'
  | 'readiness_trajectory_arc'
  | 'fulfillment_aging_stress'
  | 'resumption_trajectory_arc'
  | 'commit_gating_stress'
  | 'handoff_trajectory_arc'
  | 'gated_commit_scheduler_stress'
  | 'integration_trajectory_arc'
  | 'schedule_readiness_stress'
  | 'wire_in_trajectory_arc'
  | 'turn_boundary_activation_stress'
  | 'assembly_merge_trajectory_arc'
  | 'chunk_anchor_alignment_stress'
  | 'inline_merge_trajectory_arc'
  | 'inline_activation_stress'
  | 'projection_gate_trajectory_arc'
  | 'wave18_projection_stress'
  | 'wave19_gate_trajectory_arc'
  | 'wave19_integration_stress'
  | 'wave20_gate_trajectory_arc'
  | 'wave20_integration_stress'
  | 'wave21_gate_trajectory_arc'
  | 'wave21_integration_stress'
  | 'wave22_gate_trajectory_arc'
  | 'wave22_integration_stress'
  | 'wave23_gate_trajectory_arc'
  | 'wave23_integration_stress'
  | 'wave24_gate_trajectory_arc'
  | 'wave24_integration_stress'
  | 'wave25_gate_trajectory_arc'
  | 'wave25_integration_stress'
  | 'wave26_gate_trajectory_arc'
  | 'wave26_integration_stress'
  | 'wave27_gate_trajectory_arc'
  | 'wave27_integration_stress'
  | 'wave28_gate_trajectory_arc'
  | 'wave28_integration_stress'
  | 'wave29_gate_trajectory_arc'
  | 'wave29_integration_stress'
  | 'wave30_gate_trajectory_arc'
  | 'wave30_integration_stress'
  | 'wave31_gate_trajectory_arc'
  | 'wave31_integration_stress'
  | 'wave32_gate_trajectory_arc'
  | 'wave32_integration_stress'
  | 'wave33_gate_trajectory_arc'
  | 'wave33_integration_stress'
  | 'wave34_gate_trajectory_arc'
  | 'wave34_integration_stress'
  | 'wave35_gate_trajectory_arc'
  | 'wave35_integration_stress'
  | 'wave36_gate_trajectory_arc'
  | 'wave36_integration_stress'
  | 'wave37_gate_trajectory_arc'
  | 'wave37_integration_stress'
  | 'wave38_gate_trajectory_arc'
  | 'wave38_integration_stress'
  | 'wave39_gate_trajectory_arc'
  | 'wave39_integration_stress'
  | 'wave40_gate_trajectory_arc'
  | 'wave40_integration_stress'
  | 'wave41_gate_trajectory_arc'
  | 'wave41_integration_stress'
  | 'wave42_gate_trajectory_arc'
  | 'wave42_integration_stress'
  | 'wave43_gate_trajectory_arc'
  | 'wave43_integration_stress'
  | 'wave44_gate_trajectory_arc'
  | 'wave44_integration_stress'
  | 'wave45_gate_trajectory_arc'
  | 'wave45_integration_stress'
  | 'wave46_gate_trajectory_arc'
  | 'wave46_integration_stress'
  | 'wave47_gate_trajectory_arc'
  | 'wave47_integration_stress'
  | 'wave48_gate_trajectory_arc'
  | 'wave48_integration_stress';

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
  {
    id: 'coordination_trajectory_arc',
    label: 'Coordination trajectory arc',
    baseInputs: { fiscalHeadroom: 32, stateCapacityLoad: 74, workforceReadiness: 'strained', workforceSpecialistGap: 62 },
    launchProgramIds: [
      'ps_xp_QLD_stakeholder_alignment',
      'ps_h_QLD_regional_release',
      'ps_he_QLD_remote_clinic',
    ],
  },
  {
    id: 'relief_execution_stress',
    label: 'Relief execution stress',
    baseInputs: { fiscalHeadroom: 19, stateCapacityLoad: 90, workforceReadiness: 'blocking', workforceSpecialistGap: 76 },
    launchProgramIds: [
      'ps_xp_SA_portfolio_stabilization',
      'ps_h_SA_modular',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
    ],
  },
  {
    id: 'stabilization_recovery_arc',
    label: 'Stabilization recovery arc',
    baseInputs: { fiscalHeadroom: 44, stateCapacityLoad: 55, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_NT_recovery_readiness',
      'ps_h_NT_remote_housing',
      'ps_he_NT_remote_clinic',
    ],
  },
  {
    id: 'relief_fulfillment_backlog_stress',
    label: 'Relief fulfillment backlog stress',
    baseInputs: { fiscalHeadroom: 17, stateCapacityLoad: 93, workforceReadiness: 'blocking', workforceSpecialistGap: 78 },
    launchProgramIds: [
      'ps_xp_VIC_fulfillment_coordination',
      'ps_h_VIC_planning_reform',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_VIC_tafe',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'readiness_trajectory_arc',
    label: 'Readiness trajectory arc',
    baseInputs: { fiscalHeadroom: 50, stateCapacityLoad: 50, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_ACT_readiness_cohesion',
      'ps_h_ACT_density',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'fulfillment_aging_stress',
    label: 'Fulfillment aging stress',
    baseInputs: { fiscalHeadroom: 16, stateCapacityLoad: 94, workforceReadiness: 'blocking', workforceSpecialistGap: 80 },
    launchProgramIds: [
      'ps_xp_WA_resumption_planning',
      'ps_h_WA_remote_housing',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_WA_regional_schools',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'resumption_trajectory_arc',
    label: 'Resumption trajectory arc',
    baseInputs: { fiscalHeadroom: 52, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_TAS_handoff_alignment',
      'ps_h_TAS_affordable',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'commit_gating_stress',
    label: 'Commit gating stress',
    baseInputs: { fiscalHeadroom: 15, stateCapacityLoad: 95, workforceReadiness: 'blocking', workforceSpecialistGap: 82 },
    launchProgramIds: [
      'ps_xp_QLD_commit_gating',
      'ps_h_QLD_regional_release',
      'ps_he_QLD_remote_clinic',
      'ps_ed_NSW_skills',
      'ps_h_NSW_social_accel',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'handoff_trajectory_arc',
    label: 'Handoff trajectory arc',
    baseInputs: { fiscalHeadroom: 54, stateCapacityLoad: 46, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_NSW_integration_handoff',
      'ps_h_NSW_social_accel',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'gated_commit_scheduler_stress',
    label: 'Gated commit scheduler stress',
    baseInputs: { fiscalHeadroom: 14, stateCapacityLoad: 96, workforceReadiness: 'blocking', workforceSpecialistGap: 84 },
    launchProgramIds: [
      'ps_xp_SA_gated_commit_wave',
      'ps_h_SA_modular',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'integration_trajectory_arc',
    label: 'Integration trajectory arc',
    baseInputs: { fiscalHeadroom: 56, stateCapacityLoad: 44, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_VIC_national_wire_in',
      'ps_h_VIC_planning_reform',
      'ps_he_VIC_hospital_backlog',
    ],
  },
  {
    id: 'schedule_readiness_stress',
    label: 'Schedule readiness stress',
    baseInputs: { fiscalHeadroom: 13, stateCapacityLoad: 97, workforceReadiness: 'blocking', workforceSpecialistGap: 86 },
    launchProgramIds: [
      'ps_xp_NT_schedule_readiness',
      'ps_h_NT_remote_housing',
      'ps_he_NT_remote_clinic',
      'ps_ed_NSW_skills',
      'ps_h_NSW_social_accel',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wire_in_trajectory_arc',
    label: 'Wire-in trajectory arc',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
    launchProgramIds: [
      'ps_xp_NSW_turn_boundary',
      'ps_h_NSW_social_accel',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'turn_boundary_activation_stress',
    label: 'Turn boundary activation stress',
    baseInputs: { fiscalHeadroom: 12, stateCapacityLoad: 98, workforceReadiness: 'blocking', workforceSpecialistGap: 88 },
    launchProgramIds: [
      'ps_xp_SA_agent25_handoff',
      'ps_h_SA_modular',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_QLD_regional_release',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'assembly_merge_trajectory_arc',
    label: 'Assembly merge trajectory arc',
    baseInputs: { fiscalHeadroom: 60, stateCapacityLoad: 38, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_chunk_anchor',
      'ps_xp_NSW_turn_boundary',
      'ps_h_QLD_regional_release',
      'ps_he_NSW_primary_care',
    ],
  },
  {
    id: 'chunk_anchor_alignment_stress',
    label: 'Chunk anchor alignment stress',
    baseInputs: { fiscalHeadroom: 18, stateCapacityLoad: 92, workforceReadiness: 'blocking', workforceSpecialistGap: 80 },
    launchProgramIds: [
      'ps_xp_WA_assembly_merge',
      'ps_xp_SA_agent25_handoff',
      'ps_h_WA_remote_housing',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'inline_merge_trajectory_arc',
    label: 'Inline merge trajectory arc',
    baseInputs: { fiscalHeadroom: 58, stateCapacityLoad: 42, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_TAS_inline_merge',
      'ps_xp_QLD_chunk_anchor',
      'ps_xp_NSW_turn_boundary',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'inline_activation_stress',
    label: 'Inline activation stress',
    baseInputs: { fiscalHeadroom: 14, stateCapacityLoad: 96, workforceReadiness: 'blocking', workforceSpecialistGap: 85 },
    launchProgramIds: [
      'ps_xp_ACT_wave17_projection',
      'ps_xp_WA_assembly_merge',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'projection_gate_trajectory_arc',
    label: 'Projection gate trajectory arc',
    baseInputs: { fiscalHeadroom: 56, stateCapacityLoad: 40, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave18_projection',
      'ps_xp_TAS_inline_merge',
      'ps_xp_QLD_chunk_anchor',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave18_projection_stress',
    label: 'Wave 18 projection stress',
    baseInputs: { fiscalHeadroom: 13, stateCapacityLoad: 97, workforceReadiness: 'blocking', workforceSpecialistGap: 86 },
    launchProgramIds: [
      'ps_xp_VIC_projection_gate',
      'ps_xp_ACT_wave17_projection',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave19_gate_trajectory_arc',
    label: 'Wave 19 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 57, stateCapacityLoad: 38, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave19_projection',
      'ps_xp_NSW_wave18_projection',
      'ps_xp_TAS_inline_merge',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave19_integration_stress',
    label: 'Wave 19 integration stress',
    baseInputs: { fiscalHeadroom: 12, stateCapacityLoad: 98, workforceReadiness: 'blocking', workforceSpecialistGap: 87 },
    launchProgramIds: [
      'ps_xp_SA_integration_gate',
      'ps_xp_VIC_projection_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave20_gate_trajectory_arc',
    label: 'Wave 20 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 59, stateCapacityLoad: 36, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave20_projection',
      'ps_xp_QLD_wave19_projection',
      'ps_xp_NSW_wave18_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave20_integration_stress',
    label: 'Wave 20 integration stress',
    baseInputs: { fiscalHeadroom: 11, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 88 },
    launchProgramIds: [
      'ps_xp_ACT_o10m171_gate',
      'ps_xp_SA_integration_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave21_gate_trajectory_arc',
    label: 'Wave 21 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 60, stateCapacityLoad: 35, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NT_wave21_projection',
      'ps_xp_WA_wave20_projection',
      'ps_xp_QLD_wave19_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave21_integration_stress',
    label: 'Wave 21 integration stress',
    baseInputs: { fiscalHeadroom: 10, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 89 },
    launchProgramIds: [
      'ps_xp_VIC_o10m174_gate',
      'ps_xp_ACT_o10m171_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave22_gate_trajectory_arc',
    label: 'Wave 22 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 61, stateCapacityLoad: 34, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave22_projection',
      'ps_xp_NT_wave21_projection',
      'ps_xp_WA_wave20_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave22_integration_stress',
    label: 'Wave 22 integration stress',
    baseInputs: { fiscalHeadroom: 9, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 90 },
    launchProgramIds: [
      'ps_xp_NSW_o10m176_gate',
      'ps_xp_VIC_o10m174_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave23_gate_trajectory_arc',
    label: 'Wave 23 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 62, stateCapacityLoad: 33, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave23_projection',
      'ps_xp_QLD_wave22_projection',
      'ps_xp_NT_wave21_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave23_integration_stress',
    label: 'Wave 23 integration stress',
    baseInputs: { fiscalHeadroom: 8, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 91 },
    launchProgramIds: [
      'ps_xp_QLD_o10m178_gate',
      'ps_xp_NSW_o10m176_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave24_gate_trajectory_arc',
    label: 'Wave 24 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 63, stateCapacityLoad: 32, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_ACT_wave24_projection',
      'ps_xp_SA_wave23_projection',
      'ps_xp_QLD_wave22_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave24_integration_stress',
    label: 'Wave 24 integration stress',
    baseInputs: { fiscalHeadroom: 7, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 92 },
    launchProgramIds: [
      'ps_xp_WA_o10m180_gate',
      'ps_xp_QLD_o10m178_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave25_gate_trajectory_arc',
    label: 'Wave 25 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 64, stateCapacityLoad: 31, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave25_projection',
      'ps_xp_ACT_wave24_projection',
      'ps_xp_SA_wave23_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave25_integration_stress',
    label: 'Wave 25 integration stress',
    baseInputs: { fiscalHeadroom: 6, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 93 },
    launchProgramIds: [
      'ps_xp_NT_o10m182_gate',
      'ps_xp_WA_o10m180_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave26_gate_trajectory_arc',
    label: 'Wave 26 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 65, stateCapacityLoad: 30, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave26_projection',
      'ps_xp_VIC_wave25_projection',
      'ps_xp_ACT_wave24_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave26_integration_stress',
    label: 'Wave 26 integration stress',
    baseInputs: { fiscalHeadroom: 5, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 94 },
    launchProgramIds: [
      'ps_xp_SA_o10m184_gate',
      'ps_xp_NT_o10m182_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave27_gate_trajectory_arc',
    label: 'Wave 27 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 66, stateCapacityLoad: 29, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave27_projection',
      'ps_xp_NSW_wave26_projection',
      'ps_xp_VIC_wave25_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave27_integration_stress',
    label: 'Wave 27 integration stress',
    baseInputs: { fiscalHeadroom: 4, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 95 },
    launchProgramIds: [
      'ps_xp_WA_o10m186_gate',
      'ps_xp_SA_o10m184_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave28_gate_trajectory_arc',
    label: 'Wave 28 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 67, stateCapacityLoad: 28, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_ACT_wave28_projection',
      'ps_xp_QLD_wave27_projection',
      'ps_xp_NSW_wave26_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave28_integration_stress',
    label: 'Wave 28 integration stress',
    baseInputs: { fiscalHeadroom: 3, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 96 },
    launchProgramIds: [
      'ps_xp_NT_o10m188_gate',
      'ps_xp_WA_o10m186_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave29_gate_trajectory_arc',
    label: 'Wave 29 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 68, stateCapacityLoad: 27, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave29_projection',
      'ps_xp_ACT_wave28_projection',
      'ps_xp_QLD_wave27_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave29_integration_stress',
    label: 'Wave 29 integration stress',
    baseInputs: { fiscalHeadroom: 2, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 97 },
    launchProgramIds: [
      'ps_xp_SA_o10m190_gate',
      'ps_xp_NT_o10m188_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave30_gate_trajectory_arc',
    label: 'Wave 30 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 69, stateCapacityLoad: 26, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave30_projection',
      'ps_xp_VIC_wave29_projection',
      'ps_xp_ACT_wave28_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave30_integration_stress',
    label: 'Wave 30 integration stress',
    baseInputs: { fiscalHeadroom: 1, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 98 },
    launchProgramIds: [
      'ps_xp_QLD_o10m192_gate',
      'ps_xp_SA_o10m190_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave31_gate_trajectory_arc',
    label: 'Wave 31 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 70, stateCapacityLoad: 25, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave31_projection',
      'ps_xp_SA_wave30_projection',
      'ps_xp_VIC_wave29_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave31_integration_stress',
    label: 'Wave 31 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 99 },
    launchProgramIds: [
      'ps_xp_NT_o10m194_gate',
      'ps_xp_QLD_o10m192_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_NT_remote_housing',
    ],
  },
  {
    id: 'wave32_gate_trajectory_arc',
    label: 'Wave 32 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 71, stateCapacityLoad: 24, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave32_projection',
      'ps_xp_WA_wave31_projection',
      'ps_xp_SA_wave30_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave32_integration_stress',
    label: 'Wave 32 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m196_gate',
      'ps_xp_NT_o10m194_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave33_gate_trajectory_arc',
    label: 'Wave 33 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 72, stateCapacityLoad: 23, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave33_projection',
      'ps_xp_NSW_wave32_projection',
      'ps_xp_WA_wave31_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave33_integration_stress',
    label: 'Wave 33 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m198_gate',
      'ps_xp_WA_o10m196_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave34_gate_trajectory_arc',
    label: 'Wave 34 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 73, stateCapacityLoad: 22, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave34_projection',
      'ps_xp_QLD_wave33_projection',
      'ps_xp_NSW_wave32_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave34_integration_stress',
    label: 'Wave 34 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m200_gate',
      'ps_xp_SA_o10m198_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave35_gate_trajectory_arc',
    label: 'Wave 35 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 74, stateCapacityLoad: 21, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave35_projection',
      'ps_xp_WA_wave34_projection',
      'ps_xp_QLD_wave33_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave35_integration_stress',
    label: 'Wave 35 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_QLD_o10m202_gate',
      'ps_xp_NT_o10m200_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave36_gate_trajectory_arc',
    label: 'Wave 36 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 75, stateCapacityLoad: 20, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave36_projection',
      'ps_xp_NSW_wave35_projection',
      'ps_xp_WA_wave34_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave36_integration_stress',
    label: 'Wave 36 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m204_gate',
      'ps_xp_QLD_o10m202_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave37_gate_trajectory_arc',
    label: 'Wave 37 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 76, stateCapacityLoad: 19, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave37_projection',
      'ps_xp_VIC_wave36_projection',
      'ps_xp_NSW_wave35_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave37_integration_stress',
    label: 'Wave 37 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m206_gate',
      'ps_xp_WA_o10m204_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave38_gate_trajectory_arc',
    label: 'Wave 38 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 77, stateCapacityLoad: 18, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave38_projection',
      'ps_xp_SA_wave37_projection',
      'ps_xp_VIC_wave36_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave38_integration_stress',
    label: 'Wave 38 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m208_gate',
      'ps_xp_NT_o10m206_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave39_gate_trajectory_arc',
    label: 'Wave 39 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 78, stateCapacityLoad: 17, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave39_projection',
      'ps_xp_QLD_wave38_projection',
      'ps_xp_SA_wave37_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave39_integration_stress',
    label: 'Wave 39 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m210_gate',
      'ps_xp_SA_o10m208_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave40_gate_trajectory_arc',
    label: 'Wave 40 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 79, stateCapacityLoad: 16, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave40_projection',
      'ps_xp_WA_wave39_projection',
      'ps_xp_QLD_wave38_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave40_integration_stress',
    label: 'Wave 40 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_QLD_o10m212_gate',
      'ps_xp_NT_o10m210_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave41_gate_trajectory_arc',
    label: 'Wave 41 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 80, stateCapacityLoad: 15, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave41_projection',
      'ps_xp_NSW_wave40_projection',
      'ps_xp_WA_wave39_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave41_integration_stress',
    label: 'Wave 41 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m214_gate',
      'ps_xp_QLD_o10m212_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave42_gate_trajectory_arc',
    label: 'Wave 42 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 81, stateCapacityLoad: 14, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_SA_wave42_projection',
      'ps_xp_VIC_wave41_projection',
      'ps_xp_NSW_wave40_projection',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave42_integration_stress',
    label: 'Wave 42 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m216_gate',
      'ps_xp_WA_o10m214_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave43_gate_trajectory_arc',
    label: 'Wave 43 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 82, stateCapacityLoad: 13, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave43_projection',
      'ps_xp_SA_wave42_projection',
      'ps_xp_VIC_wave41_projection',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'wave43_integration_stress',
    label: 'Wave 43 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m218_gate',
      'ps_xp_NT_o10m216_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave44_gate_trajectory_arc',
    label: 'Wave 44 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 83, stateCapacityLoad: 12, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_WA_wave44_projection',
      'ps_xp_QLD_wave43_projection',
      'ps_xp_SA_wave42_projection',
      'ps_h_VIC_planning_reform',
    ],
  },
  {
    id: 'wave44_integration_stress',
    label: 'Wave 44 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_NT_o10m220_gate',
      'ps_xp_SA_o10m218_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave45_gate_trajectory_arc',
    label: 'Wave 45 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 84, stateCapacityLoad: 11, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave45_projection',
      'ps_xp_WA_wave44_projection',
      'ps_xp_QLD_wave43_projection',
      'ps_h_SA_modular',
    ],
  },
  {
    id: 'wave45_integration_stress',
    label: 'Wave 45 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_QLD_o10m222_gate',
      'ps_xp_NT_o10m220_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_QLD_regional_release',
    ],
  },
  {
    id: 'wave46_gate_trajectory_arc',
    label: 'Wave 46 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 85, stateCapacityLoad: 10, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_NSW_wave46_projection',
      'ps_xp_VIC_wave45_projection',
      'ps_xp_WA_wave44_projection',
      'ps_h_NSW_social_accel',
    ],
  },
  {
    id: 'wave46_integration_stress',
    label: 'Wave 46 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m224_gate',
      'ps_xp_QLD_o10m222_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_WA_remote_housing',
    ],
  },
  {
    id: 'wave47_gate_trajectory_arc',
    label: 'Wave 47 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 86, stateCapacityLoad: 9, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_QLD_wave47_projection',
      'ps_xp_NSW_wave46_projection',
      'ps_xp_VIC_wave45_projection',
      'ps_h_ACT_density',
    ],
  },
  {
    id: 'wave47_integration_stress',
    label: 'Wave 47 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_WA_o10m225_gate',
      'ps_xp_QLD_o10m224_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_SA_modular',
    ],
  },
{
    id: 'wave48_gate_trajectory_arc',
    label: 'Wave 48 gate trajectory arc',
    baseInputs: { fiscalHeadroom: 87, stateCapacityLoad: 8, workforceReadiness: 'strong' },
    launchProgramIds: [
      'ps_xp_VIC_wave48_projection',
      'ps_xp_QLD_wave47_projection',
      'ps_xp_NSW_wave46_projection',
      'ps_h_TAS_affordable',
    ],
  },
  {
    id: 'wave48_integration_stress',
    label: 'Wave 48 integration stress',
    baseInputs: { fiscalHeadroom: 0, stateCapacityLoad: 99, workforceReadiness: 'blocking', workforceSpecialistGap: 100 },
    launchProgramIds: [
      'ps_xp_SA_o10m226_gate',
      'ps_xp_WA_o10m225_gate',
      'ps_he_VIC_hospital_backlog',
      'ps_ed_NSW_skills',
      'ps_h_ACT_density',
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
  let coordinationTrajectoryPersisted = null;
  let stabilizationTrajectoryPersisted = null;
  let reliefFulfillmentPersisted = null;
  let readinessTrajectoryPersisted = null;
  let resumptionTrajectoryPersisted = null;
  let handoffTrajectoryPersisted = null;
  let integrationTrajectoryPersisted = null;
  let wireInTrajectoryPersisted = null;
  let assemblyMergeTrajectoryPersisted = null;
  let inlineMergeTrajectoryPersisted = null;
  let projectionGateTrajectoryPersisted = null;
  let wave19GateTrajectoryPersisted = null;
  let wave20GateTrajectoryPersisted = null;
  let wave21GateTrajectoryPersisted = null;
  let wave22GateTrajectoryPersisted = null;
  let wave23GateTrajectoryPersisted = null;
  let wave24GateTrajectoryPersisted = null;
  let wave25GateTrajectoryPersisted = null;
  let wave26GateTrajectoryPersisted = null;
  let wave27GateTrajectoryPersisted = null;
  let wave28GateTrajectoryPersisted = null;
  let wave29GateTrajectoryPersisted = null;
  let wave30GateTrajectoryPersisted = null;
  let wave31GateTrajectoryPersisted = null;
  let wave32GateTrajectoryPersisted = null;
  let wave33GateTrajectoryPersisted = null;
  let wave34GateTrajectoryPersisted = null;
  let wave35GateTrajectoryPersisted = null;
  let wave36GateTrajectoryPersisted = null;
  let wave37GateTrajectoryPersisted = null;
  let wave38GateTrajectoryPersisted = null;
  let wave39GateTrajectoryPersisted = null;
  let wave40GateTrajectoryPersisted = null;
  let wave41GateTrajectoryPersisted = null;
  let wave42GateTrajectoryPersisted = null;
  let wave43GateTrajectoryPersisted = null;
  let wave44GateTrajectoryPersisted = null;
  let wave45GateTrajectoryPersisted = null;
  let wave46GateTrajectoryPersisted = null;
  let wave47GateTrajectoryPersisted = null;
  let wave48GateTrajectoryPersisted = null;
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
      coordinationTrajectoryPersisted,
      stabilizationTrajectoryPersisted,
      reliefFulfillmentPersisted,
      readinessTrajectoryPersisted,
      resumptionTrajectoryPersisted,
      handoffTrajectoryPersisted,
      integrationTrajectoryPersisted,
      wireInTrajectoryPersisted,
      assemblyMergeTrajectoryPersisted,
      inlineMergeTrajectoryPersisted,
      projectionGateTrajectoryPersisted,
      wave19GateTrajectoryPersisted,
      wave20GateTrajectoryPersisted,
      wave21GateTrajectoryPersisted,
      wave22GateTrajectoryPersisted,
      wave23GateTrajectoryPersisted,
      wave24GateTrajectoryPersisted,
      wave25GateTrajectoryPersisted,
      wave26GateTrajectoryPersisted,
      wave27GateTrajectoryPersisted,
      wave28GateTrajectoryPersisted,
      wave29GateTrajectoryPersisted,
      wave30GateTrajectoryPersisted,
      wave31GateTrajectoryPersisted,
      wave32GateTrajectoryPersisted,
      wave33GateTrajectoryPersisted,
      wave34GateTrajectoryPersisted,
      wave35GateTrajectoryPersisted,
      wave36GateTrajectoryPersisted,
      wave37GateTrajectoryPersisted,
      wave38GateTrajectoryPersisted,
      wave39GateTrajectoryPersisted,
      wave40GateTrajectoryPersisted,
      wave41GateTrajectoryPersisted,
      wave42GateTrajectoryPersisted,
      wave43GateTrajectoryPersisted,
      wave44GateTrajectoryPersisted,
      wave45GateTrajectoryPersisted,
      wave46GateTrajectoryPersisted,
      wave47GateTrajectoryPersisted,
      wave48GateTrajectoryPersisted,
      newCommitments,
      enforceCapacity: true,
    });
    spendingPersisted = result.spendingPersisted;
    wellbeingMemoryPersisted = result.wellbeingMemoryPersisted;
    couplingTrajectoryPersisted = result.couplingTrajectoryPersisted;
    accountabilityTrajectoryPersisted = result.accountabilityTrajectoryPersisted;
    resilienceTrajectoryPersisted = result.resilienceTrajectoryPersisted;
    governanceTrajectoryPersisted = result.governanceTrajectoryPersisted;
    coordinationTrajectoryPersisted = result.coordinationTrajectoryPersisted;
    stabilizationTrajectoryPersisted = result.stabilizationTrajectoryPersisted;
    reliefFulfillmentPersisted = result.reliefFulfillmentPersisted;
    readinessTrajectoryPersisted = result.readinessTrajectoryPersisted;
    resumptionTrajectoryPersisted = result.resumptionTrajectoryPersisted;
    handoffTrajectoryPersisted = result.handoffTrajectoryPersisted;
    integrationTrajectoryPersisted = result.integrationTrajectoryPersisted;
    wireInTrajectoryPersisted = result.wireInTrajectoryPersisted;
    assemblyMergeTrajectoryPersisted = result.assemblyMergeTrajectoryPersisted;
    inlineMergeTrajectoryPersisted = result.inlineMergeTrajectoryPersisted;
    projectionGateTrajectoryPersisted = result.projectionGateTrajectoryPersisted;
    wave19GateTrajectoryPersisted = result.wave19GateTrajectoryPersisted;
    wave20GateTrajectoryPersisted = result.wave20GateTrajectoryPersisted;
    wave21GateTrajectoryPersisted = result.wave21GateTrajectoryPersisted;
    wave22GateTrajectoryPersisted = result.wave22GateTrajectoryPersisted;
    wave23GateTrajectoryPersisted = result.wave23GateTrajectoryPersisted;
    wave24GateTrajectoryPersisted = result.wave24GateTrajectoryPersisted;
    wave25GateTrajectoryPersisted = result.wave25GateTrajectoryPersisted;
    wave26GateTrajectoryPersisted = result.wave26GateTrajectoryPersisted;
    wave27GateTrajectoryPersisted = result.wave27GateTrajectoryPersisted;
    wave28GateTrajectoryPersisted = result.wave28GateTrajectoryPersisted;
    wave29GateTrajectoryPersisted = result.wave29GateTrajectoryPersisted;
    wave30GateTrajectoryPersisted = result.wave30GateTrajectoryPersisted;
    wave31GateTrajectoryPersisted = result.wave31GateTrajectoryPersisted;
    wave32GateTrajectoryPersisted = result.wave32GateTrajectoryPersisted;
    wave33GateTrajectoryPersisted = result.wave33GateTrajectoryPersisted;
    wave34GateTrajectoryPersisted = result.wave34GateTrajectoryPersisted;
    wave35GateTrajectoryPersisted = result.wave35GateTrajectoryPersisted;
    wave36GateTrajectoryPersisted = result.wave36GateTrajectoryPersisted;
    wave37GateTrajectoryPersisted = result.wave37GateTrajectoryPersisted;
    wave38GateTrajectoryPersisted = result.wave38GateTrajectoryPersisted;
    wave39GateTrajectoryPersisted = result.wave39GateTrajectoryPersisted;
    wave40GateTrajectoryPersisted = result.wave40GateTrajectoryPersisted;
    wave41GateTrajectoryPersisted = result.wave41GateTrajectoryPersisted;
    wave42GateTrajectoryPersisted = result.wave42GateTrajectoryPersisted;
    wave43GateTrajectoryPersisted = result.wave43GateTrajectoryPersisted;
    wave44GateTrajectoryPersisted = result.wave44GateTrajectoryPersisted;
    wave45GateTrajectoryPersisted = result.wave45GateTrajectoryPersisted;
    wave46GateTrajectoryPersisted = result.wave46GateTrajectoryPersisted;
    wave47GateTrajectoryPersisted = result.wave47GateTrajectoryPersisted;
    wave48GateTrajectoryPersisted = result.wave48GateTrajectoryPersisted;
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
    'Ninety-eight housing scenarios registered',
    listAgent14ScenarioIds().length === 98,
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
    'Wellbeing schema version is wave 15',
    AGENT14_WELLBEING_SCHEMA_VERSION === '10.14.48-scale-wave-48',
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
      schemaVersion: '10.14.8-scale-wave-8' as any,
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

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 24, stateCapacityLoad: 86, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      coordinationTrajectoryPersisted: createInitialCoordinationTrajectory(),
    });
    check(
      results,
      'wave9_coordination_trajectory',
      'Turn advance attaches coordination trajectory',
      adv.inputs.coordinationTrajectory !== undefined &&
        adv.coordinationTrajectoryPersisted.lastTurn === 6 &&
        adv.inputs.coordinationTrajectory!.engagementPressureEma > 0,
      `band=${adv.inputs.coordinationTrajectory?.band} ema=${adv.inputs.coordinationTrajectory?.engagementPressureEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 21, stateCapacityLoad: 91, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave9_relief_execution_monitor',
      'Relief execution monitor populated under stress',
      adv.inputs.reliefExecutionMonitor !== undefined &&
        adv.inputs.reliefExecutionMonitor!.summary.length > 8,
      adv.inputs.reliefExecutionMonitor?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 33, stateCapacityLoad: 78, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave9_portfolio_stabilization_brief',
      'Portfolio stabilization brief includes path',
      adv.inputs.portfolioStabilizationBrief !== undefined &&
        adv.inputs.portfolioStabilizationBrief!.summary.length > 10,
      `path=${adv.inputs.portfolioStabilizationBrief?.stabilizationPath}`
    );
  }

  {
    const raw = sanitizeCoordinationTrajectory({
      schemaVersion: '10.14.8-scale-wave-8' as any,
      lastTurn: 3,
      emaAlpha: 0.3,
      engagementPressureEma: 58,
    });
    check(
      results,
      'wave9_coordination_sanitize',
      'Coordination trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.engagementPressureEma === 58,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('coordination_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave9_coordination_arc_scenario',
      'Coordination arc surfaces trajectory or engagement',
      last.coordinationTrajectory !== undefined &&
        (last.coordinationTrajectory!.band !== 'routine' ||
          last.stakeholderCoordinationBrief!.shouldEngageStakeholders ||
          last.coordinationTrajectory!.trajectory !== 'flat'),
      `band=${last.coordinationTrajectory?.band} traj=${last.coordinationTrajectory?.trajectory}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('relief_execution_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave9_relief_execution_scenario',
      'Relief execution stress surfaces monitor or stabilization pause',
      last.reliefExecutionMonitor !== undefined &&
        (last.reliefExecutionMonitor!.shouldEscalateExecution ||
          last.reliefExecutionMonitor!.immediateDue > 0 ||
          last.portfolioStabilizationBrief!.shouldPausePortfolioGrowth),
      `escalate=${last.reliefExecutionMonitor?.shouldEscalateExecution} pause=${last.portfolioStabilizationBrief?.shouldPausePortfolioGrowth}`
    );
  }

  check(
    results,
    'wave9_stabilization_stub_catalog',
    'Wave 9 stabilization stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_stakeholder_alignment') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_portfolio_stabilization'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave9_scenario_catalog',
    'Scenario catalog includes wave 9 scenarios',
    listAgent14ScenarioIds().includes('coordination_trajectory_arc') &&
      listAgent14ScenarioIds().includes('relief_execution_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 26, stateCapacityLoad: 85, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildReliefExecutionMonitor({
      turn: 8,
      reliefDispatchPlan: adv.inputs.reliefDispatchPlan!,
      reliefSchedule: adv.inputs.capacityReliefSchedule!,
      coordinationTrajectory: adv.inputs.coordinationTrajectory,
    });
    const brief = composePortfolioStabilizationBrief({
      turn: 8,
      reliefExecutionMonitor: monitor,
      stakeholderBrief: adv.inputs.stakeholderCoordinationBrief!,
      coordinationTrajectory: adv.inputs.coordinationTrajectory,
      governanceTrajectory: adv.inputs.governanceTrajectory,
    });
    check(
      results,
      'wave9_stabilization_composer',
      'Standalone stabilization composer returns headlines',
      brief.headlines.length > 0 && brief.summary.length > 10,
      brief.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 36, stateCapacityLoad: 70, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceCoordinationTrajectory(
      4,
      adv.inputs.stakeholderCoordinationBrief!,
      createInitialCoordinationTrajectory()
    );
    check(
      results,
      'wave9_coordination_advance_unit',
      'Coordination trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 4 && snap.snapshot.engagementPressureEma > 0,
      `ema=${snap.snapshot.engagementPressureEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 40, stateCapacityLoad: 70, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      stabilizationTrajectoryPersisted: createInitialStabilizationTrajectory(),
    });
    check(
      results,
      'wave10_stabilization_trajectory',
      'Turn advance attaches stabilization trajectory',
      adv.inputs.stabilizationTrajectory !== undefined &&
        adv.stabilizationTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.stabilizationTrajectory!.stabilizationStressEma > 0,
      `band=${adv.inputs.stabilizationTrajectory?.band} ema=${adv.inputs.stabilizationTrajectory?.stabilizationStressEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 22, stateCapacityLoad: 88, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      reliefFulfillmentPersisted: createInitialReliefFulfillment(),
    });
    check(
      results,
      'wave10_relief_fulfillment',
      'Relief fulfillment snapshot attached',
      adv.inputs.reliefFulfillment !== undefined &&
        adv.reliefFulfillmentPersisted.lastTurn === 6,
      adv.inputs.reliefFulfillment?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 46, stateCapacityLoad: 58, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave10_recovery_readiness_brief',
      'Recovery readiness brief includes band',
      adv.inputs.wellbeingRecoveryReadinessBrief !== undefined &&
        adv.inputs.wellbeingRecoveryReadinessBrief!.summary.length > 10,
      `band=${adv.inputs.wellbeingRecoveryReadinessBrief?.readinessBand}`
    );
  }

  {
    const raw = sanitizeStabilizationTrajectory({
      schemaVersion: '10.14.9-scale-wave-9' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      stabilizationStressEma: 61,
    });
    check(
      results,
      'wave10_stabilization_sanitize',
      'Stabilization trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.stabilizationStressEma === 61,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('stabilization_recovery_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave10_stabilization_recovery_scenario',
      'Stabilization recovery arc wires trajectory, fulfillment, and readiness',
      last.stabilizationTrajectory !== undefined &&
        last.reliefFulfillment !== undefined &&
        last.wellbeingRecoveryReadinessBrief !== undefined,
      `stress=${last.stabilizationTrajectory?.band} ready=${last.wellbeingRecoveryReadinessBrief?.readinessBand}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('relief_fulfillment_backlog_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave10_fulfillment_backlog_scenario',
      'Fulfillment backlog stress surfaces open actions or not-ready readiness',
      last.reliefFulfillment !== undefined &&
        (last.reliefFulfillment!.openCount > 0 ||
          last.wellbeingRecoveryReadinessBrief!.readinessBand === 'not_ready' ||
          last.reliefFulfillment!.fulfilledThisTurn > 0),
      `open=${last.reliefFulfillment?.openCount} ready=${last.wellbeingRecoveryReadinessBrief?.readinessBand}`
    );
  }

  check(
    results,
    'wave10_recovery_stub_catalog',
    'Wave 10 recovery stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_recovery_readiness') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_fulfillment_coordination'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave10_scenario_catalog',
    'Scenario catalog includes wave 10 scenarios',
    listAgent14ScenarioIds().includes('stabilization_recovery_arc') &&
      listAgent14ScenarioIds().includes('relief_fulfillment_backlog_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 28, stateCapacityLoad: 84, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const fulfillment = advanceReliefFulfillment({
      turn: 7,
      reliefDispatchPlan: adv.inputs.reliefDispatchPlan!,
      executionMonitor: adv.inputs.reliefExecutionMonitor!,
      capacity: adv.inputs.capacity,
      persisted: createInitialReliefFulfillment(),
    });
    const brief = composeWellbeingRecoveryReadinessBrief({
      turn: 7,
      portfolioBrief: adv.inputs.portfolioStabilizationBrief!,
      reliefFulfillment: fulfillment.snapshot,
      stabilizationTrajectory: adv.inputs.stabilizationTrajectory,
    });
    check(
      results,
      'wave10_recovery_composer',
      'Standalone recovery composer returns headlines',
      brief.headlines.length > 0 && brief.summary.length > 10,
      brief.summary.slice(0, 64)
    );
  }

  {
    const raw = sanitizeReliefFulfillment({
      schemaVersion: '10.14.9-scale-wave-9' as any,
      lastTurn: 1,
      openActions: [],
      cumulativeFulfilled: 3,
    });
    check(
      results,
      'wave10_fulfillment_sanitize',
      'Relief fulfillment sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.cumulativeFulfilled === 3,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 38, stateCapacityLoad: 72, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceStabilizationTrajectory(
      3,
      adv.inputs.portfolioStabilizationBrief!,
      createInitialStabilizationTrajectory()
    );
    check(
      results,
      'wave10_stabilization_advance_unit',
      'Stabilization trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.stabilizationStressEma > 0,
      `ema=${snap.snapshot.stabilizationStressEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 42, stateCapacityLoad: 68, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      readinessTrajectoryPersisted: createInitialReadinessTrajectory(),
    });
    check(
      results,
      'wave11_readiness_trajectory',
      'Turn advance attaches readiness trajectory',
      adv.inputs.readinessTrajectory !== undefined &&
        adv.readinessTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.readinessTrajectory!.readinessGapEma > 0,
      `band=${adv.inputs.readinessTrajectory?.band} ema=${adv.inputs.readinessTrajectory?.readinessGapEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 20, stateCapacityLoad: 90, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave11_fulfillment_aging_monitor',
      'Fulfillment aging monitor populated under stress',
      adv.inputs.fulfillmentAgingMonitor !== undefined &&
        adv.inputs.fulfillmentAgingMonitor!.summary.length > 8,
      adv.inputs.fulfillmentAgingMonitor?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 48, stateCapacityLoad: 56, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave11_portfolio_resumption_plan',
      'Portfolio resumption plan includes summary',
      adv.inputs.portfolioResumptionPlan !== undefined &&
        adv.inputs.portfolioResumptionPlan!.summary.length > 10,
      `hold=${adv.inputs.portfolioResumptionPlan?.shouldHoldNewCommits}`
    );
  }

  {
    const raw = sanitizeReadinessTrajectory({
      schemaVersion: '10.14.10-scale-wave-10' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      readinessGapEma: 49,
    });
    check(
      results,
      'wave11_readiness_sanitize',
      'Readiness trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.readinessGapEma === 49,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('readiness_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave11_readiness_arc_scenario',
      'Readiness arc wires trajectory, aging, and resumption plan',
      last.readinessTrajectory !== undefined &&
        last.fulfillmentAgingMonitor !== undefined &&
        last.portfolioResumptionPlan !== undefined,
      `gap=${last.readinessTrajectory?.band} hold=${last.portfolioResumptionPlan?.shouldHoldNewCommits}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('fulfillment_aging_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave11_aging_stress_scenario',
      'Aging stress surfaces overdue backlog or resumption hold',
      last.fulfillmentAgingMonitor !== undefined &&
        (last.fulfillmentAgingMonitor!.shouldExpediteAging ||
          last.fulfillmentAgingMonitor!.overdueCount > 0 ||
          last.portfolioResumptionPlan!.shouldHoldNewCommits),
      `overdue=${last.fulfillmentAgingMonitor?.overdueCount} hold=${last.portfolioResumptionPlan?.shouldHoldNewCommits}`
    );
  }

  check(
    results,
    'wave11_cohesion_stub_catalog',
    'Wave 11 cohesion stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_resumption_planning') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_ACT_readiness_cohesion'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave11_scenario_catalog',
    'Scenario catalog includes wave 11 scenarios',
    listAgent14ScenarioIds().includes('readiness_trajectory_arc') &&
      listAgent14ScenarioIds().includes('fulfillment_aging_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 25, stateCapacityLoad: 86, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const plan = buildPortfolioResumptionPlan({
      turn: 7,
      recoveryBrief: adv.inputs.wellbeingRecoveryReadinessBrief!,
      readinessTrajectory: adv.inputs.readinessTrajectory,
      fulfillmentAging: adv.inputs.fulfillmentAgingMonitor!,
      interventionQueue: adv.inputs.interventionPriorityQueue,
    });
    check(
      results,
      'wave11_resumption_composer',
      'Standalone resumption composer returns summary',
      plan.summary.length > 10,
      plan.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 40, stateCapacityLoad: 65, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const aging = buildFulfillmentAgingMonitor({
      turn: 3,
      reliefFulfillment: adv.inputs.reliefFulfillment!,
      persisted: adv.reliefFulfillmentPersisted ?? createInitialReliefFulfillment(),
    });
    check(
      results,
      'wave11_aging_composer',
      'Standalone aging composer returns summary',
      aging.summary.length > 8,
      aging.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 44, stateCapacityLoad: 60, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceReadinessTrajectory(
      4,
      adv.inputs.wellbeingRecoveryReadinessBrief!,
      createInitialReadinessTrajectory()
    );
    check(
      results,
      'wave11_readiness_advance_unit',
      'Readiness trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 4 && snap.snapshot.readinessGapEma > 0,
      `ema=${snap.snapshot.readinessGapEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 41, stateCapacityLoad: 66, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      resumptionTrajectoryPersisted: createInitialResumptionTrajectory(),
    });
    check(
      results,
      'wave12_resumption_trajectory',
      'Turn advance attaches resumption trajectory',
      adv.inputs.resumptionTrajectory !== undefined &&
        adv.resumptionTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.resumptionTrajectory!.resumptionFrictionEma > 0,
      `band=${adv.inputs.resumptionTrajectory?.band} ema=${adv.inputs.resumptionTrajectory?.resumptionFrictionEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 18, stateCapacityLoad: 92, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave12_commit_gating_advice',
      'Commit gating advice populated under stress',
      adv.inputs.commitGatingAdvice !== undefined &&
        adv.inputs.commitGatingAdvice!.summary.length > 8,
      adv.inputs.commitGatingAdvice?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 47, stateCapacityLoad: 54, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave12_portfolio_handoff_brief',
      'Portfolio handoff brief includes summary',
      adv.inputs.portfolioHandoffBrief !== undefined &&
        adv.inputs.portfolioHandoffBrief!.summary.length > 10,
      `handoff=${adv.inputs.portfolioHandoffBrief?.shouldSignalHandoff}`
    );
  }

  {
    const raw = sanitizeResumptionTrajectory({
      schemaVersion: '10.14.11-scale-wave-11' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      resumptionFrictionEma: 55,
    });
    check(
      results,
      'wave12_resumption_sanitize',
      'Resumption trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.resumptionFrictionEma === 55,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('resumption_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave12_resumption_arc_scenario',
      'Resumption arc wires trajectory, gating, and handoff brief',
      last.resumptionTrajectory !== undefined &&
        last.commitGatingAdvice !== undefined &&
        last.portfolioHandoffBrief !== undefined,
      `friction=${last.resumptionTrajectory?.band} block=${last.commitGatingAdvice?.shouldBlockAllCommits}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('commit_gating_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave12_gating_stress_scenario',
      'Gating stress blocks commits or holds resumption',
      last.commitGatingAdvice !== undefined &&
        (last.commitGatingAdvice!.shouldBlockAllCommits ||
          last.commitGatingAdvice!.allowedNewCommits === 0 ||
          last.portfolioResumptionPlan!.shouldHoldNewCommits),
      `block=${last.commitGatingAdvice?.shouldBlockAllCommits} allowed=${last.commitGatingAdvice?.allowedNewCommits}`
    );
  }

  check(
    results,
    'wave12_handoff_stub_catalog',
    'Wave 12 handoff stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_TAS_handoff_alignment') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_commit_gating'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave12_scenario_catalog',
    'Scenario catalog includes wave 12 scenarios',
    listAgent14ScenarioIds().includes('resumption_trajectory_arc') &&
      listAgent14ScenarioIds().includes('commit_gating_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 24, stateCapacityLoad: 87, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const gating = adviseCommitGating({
      turn: 7,
      resumptionPlan: adv.inputs.portfolioResumptionPlan!,
      capacity: adv.inputs.capacity,
      resumptionTrajectory: adv.inputs.resumptionTrajectory,
    });
    const handoff = composePortfolioHandoffBrief({
      turn: 7,
      resumptionPlan: adv.inputs.portfolioResumptionPlan!,
      commitGating: gating,
      recoveryBrief: adv.inputs.wellbeingRecoveryReadinessBrief!,
      resumptionTrajectory: adv.inputs.resumptionTrajectory,
    });
    check(
      results,
      'wave12_handoff_composer',
      'Standalone handoff composer returns headlines',
      handoff.headlines.length > 0 && handoff.summary.length > 10,
      handoff.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 43, stateCapacityLoad: 62, workforceReadiness: 'weak' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceResumptionTrajectory(
      3,
      adv.inputs.portfolioResumptionPlan!,
      createInitialResumptionTrajectory()
    );
    check(
      results,
      'wave12_resumption_advance_unit',
      'Resumption trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.resumptionFrictionEma > 0,
      `ema=${snap.snapshot.resumptionFrictionEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 43, stateCapacityLoad: 64, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      handoffTrajectoryPersisted: createInitialHandoffTrajectory(),
    });
    check(
      results,
      'wave13_handoff_trajectory',
      'Turn advance attaches handoff trajectory',
      adv.inputs.handoffTrajectory !== undefined &&
        adv.handoffTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.handoffTrajectory!.handoffReadinessEma > 0,
      `band=${adv.inputs.handoffTrajectory?.band} ema=${adv.inputs.handoffTrajectory?.handoffReadinessEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 17, stateCapacityLoad: 93, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave13_gated_commit_schedule',
      'Gated commit schedule populated under stress',
      adv.inputs.gatedCommitSchedule !== undefined &&
        adv.inputs.gatedCommitSchedule!.summary.length > 8,
      adv.inputs.gatedCommitSchedule?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 49, stateCapacityLoad: 52, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave13_integration_handoff_brief',
      'Integration handoff brief includes summary',
      adv.inputs.wellbeingIntegrationHandoffBrief !== undefined &&
        adv.inputs.wellbeingIntegrationHandoffBrief!.summary.length > 10,
      `publish=${adv.inputs.wellbeingIntegrationHandoffBrief?.shouldPublishIntegration}`
    );
  }

  {
    const raw = sanitizeHandoffTrajectory({
      schemaVersion: '10.14.12-scale-wave-12' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      handoffReadinessEma: 41,
    });
    check(
      results,
      'wave13_handoff_sanitize',
      'Handoff trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.handoffReadinessEma === 41,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('handoff_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave13_handoff_arc_scenario',
      'Handoff arc wires trajectory, schedule, and integration brief',
      last.handoffTrajectory !== undefined &&
        last.gatedCommitSchedule !== undefined &&
        last.wellbeingIntegrationHandoffBrief !== undefined,
      `band=${last.handoffTrajectory?.band} defer=${last.gatedCommitSchedule?.shouldDeferAll}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('gated_commit_scheduler_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave13_scheduler_stress_scenario',
      'Scheduler stress defers commits or blocks integration publish',
      last.gatedCommitSchedule !== undefined &&
        (last.gatedCommitSchedule!.shouldDeferAll ||
          last.commitGatingAdvice!.shouldBlockAllCommits ||
          !last.wellbeingIntegrationHandoffBrief!.shouldPublishIntegration),
      `defer=${last.gatedCommitSchedule?.shouldDeferAll} publish=${last.wellbeingIntegrationHandoffBrief?.shouldPublishIntegration}`
    );
  }

  check(
    results,
    'wave13_integration_stub_catalog',
    'Wave 13 integration stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_integration_handoff') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_gated_commit_wave'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave13_scenario_catalog',
    'Scenario catalog includes wave 13 scenarios',
    listAgent14ScenarioIds().includes('handoff_trajectory_arc') &&
      listAgent14ScenarioIds().includes('gated_commit_scheduler_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 23, stateCapacityLoad: 88, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const schedule = buildGatedCommitSchedule({
      turn: 7,
      commitGating: adv.inputs.commitGatingAdvice!,
      resumptionPlan: adv.inputs.portfolioResumptionPlan!,
      recommendations: adv.inputs.programRecommendations,
    });
    const integration = composeWellbeingIntegrationHandoffBrief({
      turn: 7,
      portfolioHandoff: adv.inputs.portfolioHandoffBrief!,
      handoffTrajectory: adv.inputs.handoffTrajectory,
      gatedCommitSchedule: schedule,
    });
    check(
      results,
      'wave13_integration_composer',
      'Standalone integration composer returns headlines',
      integration.headlines.length > 0 && integration.summary.length > 10,
      integration.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 46, stateCapacityLoad: 58, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceHandoffTrajectory(
      3,
      adv.inputs.portfolioHandoffBrief!,
      createInitialHandoffTrajectory()
    );
    check(
      results,
      'wave13_handoff_advance_unit',
      'Handoff trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.handoffReadinessEma > 0,
      `ema=${snap.snapshot.handoffReadinessEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 44, stateCapacityLoad: 62, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      integrationTrajectoryPersisted: createInitialIntegrationTrajectory(),
    });
    check(
      results,
      'wave14_integration_trajectory',
      'Turn advance attaches integration trajectory',
      adv.inputs.integrationTrajectory !== undefined &&
        adv.integrationTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.integrationTrajectory!.integrationReadinessEma > 0,
      `band=${adv.inputs.integrationTrajectory?.band} ema=${adv.inputs.integrationTrajectory?.integrationReadinessEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 16, stateCapacityLoad: 94, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave14_schedule_readiness_monitor',
      'Schedule readiness monitor populated under stress',
      adv.inputs.scheduleReadinessMonitor !== undefined &&
        adv.inputs.scheduleReadinessMonitor!.summary.length > 8,
      adv.inputs.scheduleReadinessMonitor?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 51, stateCapacityLoad: 50, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave14_national_wire_in_brief',
      'National wire-in brief includes summary',
      adv.inputs.nationalWireInReadinessBrief !== undefined &&
        adv.inputs.nationalWireInReadinessBrief!.summary.length > 10,
      `wire=${adv.inputs.nationalWireInReadinessBrief?.shouldWireNationalTurn}`
    );
  }

  {
    const raw = sanitizeIntegrationTrajectory({
      schemaVersion: '10.14.13-scale-wave-13' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      integrationReadinessEma: 44,
    });
    check(
      results,
      'wave14_integration_sanitize',
      'Integration trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.integrationReadinessEma === 44,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('integration_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave14_integration_arc_scenario',
      'Integration arc wires trajectory, schedule monitor, and wire-in brief',
      last.integrationTrajectory !== undefined &&
        last.scheduleReadinessMonitor !== undefined &&
        last.nationalWireInReadinessBrief !== undefined,
      `band=${last.integrationTrajectory?.band} wire=${last.nationalWireInReadinessBrief?.shouldWireNationalTurn}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('schedule_readiness_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave14_schedule_stress_scenario',
      'Schedule stress expedites or blocks wire-in',
      last.scheduleReadinessMonitor !== undefined &&
        (last.scheduleReadinessMonitor!.shouldExpediteSchedule ||
          last.gatedCommitSchedule!.shouldDeferAll ||
          !last.nationalWireInReadinessBrief!.shouldWireNationalTurn),
      `expedite=${last.scheduleReadinessMonitor?.shouldExpediteSchedule} wire=${last.nationalWireInReadinessBrief?.shouldWireNationalTurn}`
    );
  }

  check(
    results,
    'wave14_wire_in_stub_catalog',
    'Wave 14 wire-in stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_national_wire_in') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_schedule_readiness'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave14_scenario_catalog',
    'Scenario catalog includes wave 14 scenarios',
    listAgent14ScenarioIds().includes('integration_trajectory_arc') &&
      listAgent14ScenarioIds().includes('schedule_readiness_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 22, stateCapacityLoad: 89, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildScheduleReadinessMonitor({
      turn: 7,
      gatedCommitSchedule: adv.inputs.gatedCommitSchedule!,
    });
    const wireIn = composeNationalWireInReadinessBrief({
      turn: 7,
      integrationHandoff: adv.inputs.wellbeingIntegrationHandoffBrief!,
      scheduleReadiness: monitor,
      integrationTrajectory: adv.inputs.integrationTrajectory,
    });
    check(
      results,
      'wave14_wire_in_composer',
      'Standalone wire-in composer returns headlines',
      wireIn.headlines.length > 0 && wireIn.summary.length > 10,
      wireIn.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 48, stateCapacityLoad: 54, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceIntegrationTrajectory(
      3,
      adv.inputs.wellbeingIntegrationHandoffBrief!,
      createInitialIntegrationTrajectory()
    );
    check(
      results,
      'wave14_integration_advance_unit',
      'Integration trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.integrationReadinessEma > 0,
      `ema=${snap.snapshot.integrationReadinessEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 45, stateCapacityLoad: 60, workforceReadiness: 'strained' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
      wireInTrajectoryPersisted: createInitialWireInTrajectory(),
    });
    check(
      results,
      'wave15_wire_in_trajectory',
      'Turn advance attaches wire-in trajectory',
      adv.inputs.wireInTrajectory !== undefined &&
        adv.wireInTrajectoryPersisted.lastTurn === 5 &&
        adv.inputs.wireInTrajectory!.wireInActivationEma > 0,
      `band=${adv.inputs.wireInTrajectory?.band} ema=${adv.inputs.wireInTrajectory?.wireInActivationEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 15, stateCapacityLoad: 95, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave15_turn_boundary_monitor',
      'Turn boundary activation monitor populated under stress',
      adv.inputs.turnBoundaryActivationMonitor !== undefined &&
        adv.inputs.turnBoundaryActivationMonitor!.summary.length > 8,
      adv.inputs.turnBoundaryActivationMonitor?.summary.slice(0, 72)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 53, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave15_agent25_handoff_brief',
      'Agent 25 assembly handoff brief includes summary',
      adv.inputs.agent25AssemblyHandoffBrief !== undefined &&
        adv.inputs.agent25AssemblyHandoffBrief!.summary.length > 10,
      `handoff=${adv.inputs.agent25AssemblyHandoffBrief?.shouldHandoffChunk}`
    );
  }

  {
    const raw = sanitizeWireInTrajectory({
      schemaVersion: '10.14.14-scale-wave-14' as any,
      lastTurn: 2,
      emaAlpha: 0.3,
      wireInActivationEma: 42,
    });
    check(
      results,
      'wave15_wire_in_sanitize',
      'Wire-in trajectory sanitize upgrades schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wireInActivationEma === 42,
      `schema=${raw.schemaVersion}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wire_in_trajectory_arc', 10);
    const last = sim.turns[9];
    check(
      results,
      'wave15_wire_in_arc_scenario',
      'Wire-in arc wires trajectory, boundary monitor, and Agent 25 brief',
      last.wireInTrajectory !== undefined &&
        last.turnBoundaryActivationMonitor !== undefined &&
        last.agent25AssemblyHandoffBrief !== undefined,
      `band=${last.wireInTrajectory?.band} activate=${last.turnBoundaryActivationMonitor?.shouldActivateTurnBoundary}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('turn_boundary_activation_stress', 8);
    const last = sim.turns[7];
    check(
      results,
      'wave15_boundary_stress_scenario',
      'Boundary stress blocks activation or Agent 25 handoff',
      last.turnBoundaryActivationMonitor !== undefined &&
        (!last.turnBoundaryActivationMonitor!.shouldActivateTurnBoundary ||
          !last.agent25AssemblyHandoffBrief!.shouldHandoffChunk ||
          last.wireInTrajectory!.band !== 'active'),
      `activate=${last.turnBoundaryActivationMonitor?.shouldActivateTurnBoundary} handoff=${last.agent25AssemblyHandoffBrief?.shouldHandoffChunk}`
    );
  }

  check(
    results,
    'wave15_boundary_stub_catalog',
    'Wave 15 boundary stubs present',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_turn_boundary') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_agent25_handoff'),
    `n=${AGENT14_HEALTH_ED_PROGRAM_STUBS.length}`
  );

  check(
    results,
    'wave15_scenario_catalog',
    'Scenario catalog includes wave 15 scenarios',
    listAgent14ScenarioIds().includes('wire_in_trajectory_arc') &&
      listAgent14ScenarioIds().includes('turn_boundary_activation_stress'),
    `count=${listAgent14ScenarioIds().length}`
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 21, stateCapacityLoad: 90, workforceReadiness: 'blocking' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildTurnBoundaryActivationMonitor({
      turn: 7,
      wireInBrief: adv.inputs.nationalWireInReadinessBrief!,
      scheduleReadiness: adv.inputs.scheduleReadinessMonitor!,
      capacity: adv.inputs.capacity,
    });
    const handoff = composeAgent25AssemblyHandoffBrief({
      turn: 7,
      activationMonitor: monitor,
      wireInTrajectory: adv.inputs.wireInTrajectory,
    });
    check(
      results,
      'wave15_agent25_composer',
      'Standalone Agent 25 composer returns headlines',
      handoff.headlines.length > 0 && handoff.summary.length > 10,
      handoff.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 50, stateCapacityLoad: 52, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWireInTrajectory(
      3,
      adv.inputs.nationalWireInReadinessBrief!,
      createInitialWireInTrajectory()
    );
    check(
      results,
      'wave15_wire_in_advance_unit',
      'Wire-in trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.wireInActivationEma > 0,
      `ema=${snap.snapshot.wireInActivationEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 55, stateCapacityLoad: 44, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave16_assembly_merge_trajectory',
      'Turn advance attaches assembly merge trajectory',
      adv.inputs.assemblyMergeTrajectory !== undefined &&
        adv.assemblyMergeTrajectoryPersisted.lastTurn === 5,
      `band=${adv.inputs.assemblyMergeTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 48, stateCapacityLoad: 50, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave16_chunk_anchor_monitor',
      'Chunk anchor alignment monitor present',
      adv.inputs.chunkAnchorAlignmentMonitor !== undefined &&
        adv.inputs.chunkAnchorAlignmentMonitor!.requiredTrajectoryCount === 5,
      adv.inputs.chunkAnchorAlignmentMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 62, stateCapacityLoad: 36, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave16_inline_readiness_brief',
      'Agent 25 inline readiness brief attached',
      adv.inputs.agent25InlineReadinessBrief !== undefined &&
        adv.inputs.agent25InlineReadinessBrief!.summary.length > 10,
      `inline=${adv.inputs.agent25InlineReadinessBrief?.shouldInlineChunk}`
    );
  }

  {
    const raw = sanitizeAssemblyMergeTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 2,
      emaAlpha: 0.3,
      assemblyMergeEma: 33,
    });
    check(
      results,
      'wave16_assembly_merge_sanitize',
      'Assembly merge trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.assemblyMergeEma === 33,
      `ema=${raw.assemblyMergeEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 58, stateCapacityLoad: 40, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const inline = composeAgent25InlineReadinessBrief({
      turn: 8,
      anchorMonitor: adv.inputs.chunkAnchorAlignmentMonitor!,
      assemblyMergeTrajectory: adv.inputs.assemblyMergeTrajectory,
    });
    check(
      results,
      'wave16_inline_composer',
      'Standalone inline readiness composer returns headlines',
      inline.headlines.length > 0 && inline.summary.length > 10,
      inline.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 50, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceAssemblyMergeTrajectory(
      2,
      adv.inputs.agent25AssemblyHandoffBrief!,
      createInitialAssemblyMergeTrajectory()
    );
    check(
      results,
      'wave16_assembly_merge_advance_unit',
      'Assembly merge trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 2 && snap.snapshot.assemblyMergeEma > 0,
      `ema=${snap.snapshot.assemblyMergeEma}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('assembly_merge_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave16_assembly_merge_arc_scenario',
      'Assembly merge arc scenario surfaces inline brief',
      last.assemblyMergeTrajectory !== undefined &&
        last.chunkAnchorAlignmentMonitor !== undefined &&
        last.agent25InlineReadinessBrief !== undefined,
      `merge=${last.assemblyMergeTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('chunk_anchor_alignment_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave16_chunk_anchor_stress_scenario',
      'Chunk anchor stress keeps inline gated under stress',
      !last.agent25InlineReadinessBrief!.shouldInlineChunk ||
        last.chunkAnchorAlignmentMonitor!.anchorAligned,
      `inline=${last.agent25InlineReadinessBrief?.shouldInlineChunk} anchor=${last.chunkAnchorAlignmentMonitor?.anchorAligned}`
    );
  }

  check(
    results,
    'wave16_assembly_stub_catalog',
    'Round 16 assembly stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_chunk_anchor') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_assembly_merge'),
    'chunk_anchor+assembly_merge'
  );

  check(
    results,
    'wave16_scenario_registry',
    'Round 16 scenarios registered',
    listAgent14ScenarioIds().includes('assembly_merge_trajectory_arc') &&
      listAgent14ScenarioIds().includes('chunk_anchor_alignment_stress'),
    '34 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 54, stateCapacityLoad: 46, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave17_inline_merge_trajectory',
      'Turn advance attaches inline merge trajectory',
      adv.inputs.inlineMergeTrajectory !== undefined &&
        adv.inlineMergeTrajectoryPersisted.lastTurn === 5,
      `band=${adv.inputs.inlineMergeTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 50, stateCapacityLoad: 50, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave17_inline_activation_monitor',
      'Inline activation monitor present',
      adv.inputs.inlineActivationMonitor !== undefined &&
        adv.inputs.inlineActivationMonitor!.summary.length > 10,
      adv.inputs.inlineActivationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 60, stateCapacityLoad: 38, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave17_projection_handoff_brief',
      'Agent 25 wave 17 projection handoff attached',
      adv.inputs.agent25Wave17ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave17ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave17ProjectionHandoffBrief?.shouldProjectWave17}`
    );
  }

  {
    const raw = sanitizeInlineMergeTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 2,
      emaAlpha: 0.3,
      inlineMergeEma: 31,
    });
    check(
      results,
      'wave17_inline_merge_sanitize',
      'Inline merge trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.inlineMergeEma === 31,
      `ema=${raw.inlineMergeEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 58, stateCapacityLoad: 40, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const projection = composeAgent25Wave17ProjectionHandoffBrief({
      turn: 8,
      inlineActivationMonitor: adv.inputs.inlineActivationMonitor!,
      inlineMergeTrajectory: adv.inputs.inlineMergeTrajectory,
    });
    check(
      results,
      'wave17_projection_composer',
      'Standalone wave 17 projection composer returns headlines',
      projection.headlines.length > 0 && projection.summary.length > 10,
      projection.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 2, fiscalHeadroom: 50, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceInlineMergeTrajectory(
      2,
      adv.inputs.agent25InlineReadinessBrief!,
      createInitialInlineMergeTrajectory()
    );
    check(
      results,
      'wave17_inline_merge_advance_unit',
      'Inline merge trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 2 && snap.snapshot.inlineMergeEma > 0,
      `ema=${snap.snapshot.inlineMergeEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 62, stateCapacityLoad: 36, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildInlineActivationMonitor({
      turn: 6,
      inlineBrief: adv.inputs.agent25InlineReadinessBrief!,
      inlineMergeTrajectory: adv.inputs.inlineMergeTrajectory,
      activationMonitor: adv.inputs.turnBoundaryActivationMonitor!,
    });
    check(
      results,
      'wave17_inline_activation_unit',
      'Standalone inline activation monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('inline_merge_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave17_inline_merge_arc_scenario',
      'Inline merge arc scenario surfaces projection brief',
      last.inlineMergeTrajectory !== undefined &&
        last.inlineActivationMonitor !== undefined &&
        last.agent25Wave17ProjectionHandoffBrief !== undefined,
      `merge=${last.inlineMergeTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('inline_activation_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave17_inline_activation_stress_scenario',
      'Inline activation stress keeps projection gated under stress',
      !last.agent25Wave17ProjectionHandoffBrief!.shouldProjectWave17 ||
        last.inlineActivationMonitor!.shouldActivateInline,
      `project=${last.agent25Wave17ProjectionHandoffBrief?.shouldProjectWave17} inline=${last.inlineActivationMonitor?.shouldActivateInline}`
    );
  }

  check(
    results,
    'wave17_inline_stub_catalog',
    'Round 17 inline stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_TAS_inline_merge') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_ACT_wave17_projection'),
    'inline_merge+wave17_projection'
  );

  check(
    results,
    'wave17_scenario_registry',
    'Round 17 scenarios registered',
    listAgent14ScenarioIds().includes('inline_merge_trajectory_arc') &&
      listAgent14ScenarioIds().includes('inline_activation_stress'),
    '36 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 55, stateCapacityLoad: 44, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave18_projection_gate_trajectory',
      'Turn advance attaches projection gate trajectory',
      adv.inputs.projectionGateTrajectory !== undefined &&
        adv.projectionGateTrajectoryPersisted.lastTurn === 6,
      `band=${adv.inputs.projectionGateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 52, stateCapacityLoad: 48, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave18_projection_monitor',
      'Wave 18 projection monitor present',
      adv.inputs.wave18ProjectionMonitor !== undefined &&
        adv.inputs.wave18ProjectionMonitor!.summary.length > 10,
      adv.inputs.wave18ProjectionMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 61, stateCapacityLoad: 36, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave18_projection_handoff_brief',
      'Agent 25 wave 18 projection handoff attached',
      adv.inputs.agent25Wave18ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave18ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave18ProjectionHandoffBrief?.shouldProjectWave18}`
    );
  }

  {
    const raw = sanitizeProjectionGateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 3,
      emaAlpha: 0.3,
      projectionGateEma: 29,
    });
    check(
      results,
      'wave18_projection_gate_sanitize',
      'Projection gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.projectionGateEma === 29,
      `ema=${raw.projectionGateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 57, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave18 = composeAgent25Wave18ProjectionHandoffBrief({
      turn: 7,
      wave18ProjectionMonitor: adv.inputs.wave18ProjectionMonitor!,
      projectionGateTrajectory: adv.inputs.projectionGateTrajectory,
    });
    check(
      results,
      'wave18_projection_composer',
      'Standalone wave 18 projection composer returns headlines',
      wave18.headlines.length > 0 && wave18.summary.length > 10,
      wave18.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 3, fiscalHeadroom: 50, stateCapacityLoad: 46, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceProjectionGateTrajectory(
      3,
      adv.inputs.agent25Wave17ProjectionHandoffBrief!,
      createInitialProjectionGateTrajectory()
    );
    check(
      results,
      'wave18_projection_gate_advance_unit',
      'Projection gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 3 && snap.snapshot.projectionGateEma > 0,
      `ema=${snap.snapshot.projectionGateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 63, stateCapacityLoad: 34, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave18ProjectionMonitor({
      turn: 8,
      wave17ProjectionBrief: adv.inputs.agent25Wave17ProjectionHandoffBrief!,
      projectionGateTrajectory: adv.inputs.projectionGateTrajectory,
      inlineActivationMonitor: adv.inputs.inlineActivationMonitor!,
    });
    check(
      results,
      'wave18_projection_monitor_unit',
      'Standalone wave 18 projection monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('projection_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave18_projection_gate_arc_scenario',
      'Projection gate arc scenario surfaces wave 18 brief',
      last.projectionGateTrajectory !== undefined &&
        last.wave18ProjectionMonitor !== undefined &&
        last.agent25Wave18ProjectionHandoffBrief !== undefined,
      `gate=${last.projectionGateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave18_projection_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave18_projection_stress_scenario',
      'Wave 18 projection stress keeps O10-167 gated under stress',
      !last.agent25Wave18ProjectionHandoffBrief!.shouldProjectWave18 ||
        last.wave18ProjectionMonitor!.shouldRunO10m167DryRun,
      `project=${last.agent25Wave18ProjectionHandoffBrief?.shouldProjectWave18} o10m167=${last.wave18ProjectionMonitor?.shouldRunO10m167DryRun}`
    );
  }

  check(
    results,
    'wave18_projection_stub_catalog',
    'Round 18 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_wave18_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_projection_gate'),
    'wave18_projection+projection_gate'
  );

  check(
    results,
    'wave18_scenario_registry',
    'Round 18 scenarios registered',
    listAgent14ScenarioIds().includes('projection_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave18_projection_stress'),
    '38 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 56, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave19_gate_trajectory',
      'Turn advance attaches wave 19 gate trajectory',
      adv.inputs.wave19GateTrajectory !== undefined &&
        adv.wave19GateTrajectoryPersisted.lastTurn === 6,
      `band=${adv.inputs.wave19GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 51, stateCapacityLoad: 47, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave19_integration_monitor',
      'Wave 19 integration monitor present',
      adv.inputs.wave19IntegrationMonitor !== undefined &&
        adv.inputs.wave19IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave19IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 62, stateCapacityLoad: 34, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave19_projection_handoff_brief',
      'Agent 25 wave 19 projection handoff attached',
      adv.inputs.agent25Wave19ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave19ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave19ProjectionHandoffBrief?.shouldProjectWave19}`
    );
  }

  {
    const raw = sanitizeWave19GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 4,
      emaAlpha: 0.3,
      wave19GateEma: 28,
    });
    check(
      results,
      'wave19_gate_sanitize',
      'Wave 19 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave19GateEma === 28,
      `ema=${raw.wave19GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 58, stateCapacityLoad: 40, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave19 = composeAgent25Wave19ProjectionHandoffBrief({
      turn: 8,
      wave19IntegrationMonitor: adv.inputs.wave19IntegrationMonitor!,
      wave19GateTrajectory: adv.inputs.wave19GateTrajectory,
    });
    check(
      results,
      'wave19_projection_composer',
      'Standalone wave 19 projection composer returns headlines',
      wave19.headlines.length > 0 && wave19.summary.length > 10,
      wave19.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 4, fiscalHeadroom: 49, stateCapacityLoad: 45, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave19GateTrajectory(
      4,
      adv.inputs.agent25Wave18ProjectionHandoffBrief!,
      createInitialWave19GateTrajectory()
    );
    check(
      results,
      'wave19_gate_advance_unit',
      'Wave 19 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 4 && snap.snapshot.wave19GateEma > 0,
      `ema=${snap.snapshot.wave19GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 64, stateCapacityLoad: 32, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave19IntegrationMonitor({
      turn: 9,
      wave18ProjectionBrief: adv.inputs.agent25Wave18ProjectionHandoffBrief!,
      wave19GateTrajectory: adv.inputs.wave19GateTrajectory,
      wave18ProjectionMonitor: adv.inputs.wave18ProjectionMonitor!,
    });
    check(
      results,
      'wave19_integration_monitor_unit',
      'Standalone wave 19 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave19_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave19_gate_arc_scenario',
      'Wave 19 gate arc scenario surfaces wave 19 brief',
      last.wave19GateTrajectory !== undefined &&
        last.wave19IntegrationMonitor !== undefined &&
        last.agent25Wave19ProjectionHandoffBrief !== undefined,
      `gate=${last.wave19GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave19_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave19_integration_stress_scenario',
      'Wave 19 integration stress keeps O10-169 gated under stress',
      !last.agent25Wave19ProjectionHandoffBrief!.shouldProjectWave19 ||
        last.wave19IntegrationMonitor!.shouldRunO10m169DryRun,
      `project=${last.agent25Wave19ProjectionHandoffBrief?.shouldProjectWave19} o10m169=${last.wave19IntegrationMonitor?.shouldRunO10m169DryRun}`
    );
  }

  check(
    results,
    'wave19_projection_stub_catalog',
    'Round 19 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave19_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_integration_gate'),
    'wave19_projection+integration_gate'
  );

  check(
    results,
    'wave19_scenario_registry',
    'Round 19 scenarios registered',
    listAgent14ScenarioIds().includes('wave19_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave19_integration_stress'),
    '40 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 58, stateCapacityLoad: 40, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave20_gate_trajectory',
      'Turn advance attaches wave 20 gate trajectory',
      adv.inputs.wave20GateTrajectory !== undefined &&
        adv.wave20GateTrajectoryPersisted.lastTurn === 7,
      `band=${adv.inputs.wave20GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 52, stateCapacityLoad: 46, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave20_integration_monitor',
      'Wave 20 integration monitor present',
      adv.inputs.wave20IntegrationMonitor !== undefined &&
        adv.inputs.wave20IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave20IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 63, stateCapacityLoad: 33, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave20_projection_handoff_brief',
      'Agent 25 wave 20 projection handoff attached',
      adv.inputs.agent25Wave20ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave20ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave20ProjectionHandoffBrief?.shouldProjectWave20}`
    );
  }

  {
    const raw = sanitizeWave20GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 5,
      emaAlpha: 0.3,
      wave20GateEma: 27,
    });
    check(
      results,
      'wave20_gate_sanitize',
      'Wave 20 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave20GateEma === 27,
      `ema=${raw.wave20GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 57, stateCapacityLoad: 39, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave20 = composeAgent25Wave20ProjectionHandoffBrief({
      turn: 9,
      wave20IntegrationMonitor: adv.inputs.wave20IntegrationMonitor!,
      wave20GateTrajectory: adv.inputs.wave20GateTrajectory,
    });
    check(
      results,
      'wave20_projection_composer',
      'Standalone wave 20 projection composer returns headlines',
      wave20.headlines.length > 0 && wave20.summary.length > 10,
      wave20.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 5, fiscalHeadroom: 48, stateCapacityLoad: 44, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave20GateTrajectory(
      5,
      adv.inputs.agent25Wave19ProjectionHandoffBrief!,
      createInitialWave20GateTrajectory()
    );
    check(
      results,
      'wave20_gate_advance_unit',
      'Wave 20 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 5 && snap.snapshot.wave20GateEma > 0,
      `ema=${snap.snapshot.wave20GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 65, stateCapacityLoad: 31, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave20IntegrationMonitor({
      turn: 10,
      wave19ProjectionBrief: adv.inputs.agent25Wave19ProjectionHandoffBrief!,
      wave20GateTrajectory: adv.inputs.wave20GateTrajectory,
      wave19IntegrationMonitor: adv.inputs.wave19IntegrationMonitor!,
    });
    check(
      results,
      'wave20_integration_monitor_unit',
      'Standalone wave 20 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave20_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave20_gate_arc_scenario',
      'Wave 20 gate arc scenario surfaces wave 20 brief',
      last.wave20GateTrajectory !== undefined &&
        last.wave20IntegrationMonitor !== undefined &&
        last.agent25Wave20ProjectionHandoffBrief !== undefined,
      `gate=${last.wave20GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave20_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave20_integration_stress_scenario',
      'Wave 20 integration stress keeps O10-171 gated under stress',
      !last.agent25Wave20ProjectionHandoffBrief!.shouldProjectWave20 ||
        last.wave20IntegrationMonitor!.shouldRunO10m171DryRun,
      `project=${last.agent25Wave20ProjectionHandoffBrief?.shouldProjectWave20} o10m171=${last.wave20IntegrationMonitor?.shouldRunO10m171DryRun}`
    );
  }

  check(
    results,
    'wave20_projection_stub_catalog',
    'Round 20 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_wave20_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_ACT_o10m171_gate'),
    'wave20_projection+o10m171_gate'
  );

  check(
    results,
    'wave20_scenario_registry',
    'Round 20 scenarios registered',
    listAgent14ScenarioIds().includes('wave20_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave20_integration_stress'),
    '42 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 59, stateCapacityLoad: 38, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave21_gate_trajectory',
      'Turn advance attaches wave 21 gate trajectory',
      adv.inputs.wave21GateTrajectory !== undefined &&
        adv.wave21GateTrajectoryPersisted.lastTurn === 8,
      `band=${adv.inputs.wave21GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 53, stateCapacityLoad: 45, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave21_integration_monitor',
      'Wave 21 integration monitor present',
      adv.inputs.wave21IntegrationMonitor !== undefined &&
        adv.inputs.wave21IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave21IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 64, stateCapacityLoad: 32, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave21_projection_handoff_brief',
      'Agent 25 wave 21 projection handoff attached',
      adv.inputs.agent25Wave21ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave21ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave21ProjectionHandoffBrief?.shouldProjectWave21}`
    );
  }

  {
    const raw = sanitizeWave21GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 6,
      emaAlpha: 0.3,
      wave21GateEma: 26,
    });
    check(
      results,
      'wave21_gate_sanitize',
      'Wave 21 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave21GateEma === 26,
      `ema=${raw.wave21GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 56, stateCapacityLoad: 37, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave21 = composeAgent25Wave21ProjectionHandoffBrief({
      turn: 10,
      wave21IntegrationMonitor: adv.inputs.wave21IntegrationMonitor!,
      wave21GateTrajectory: adv.inputs.wave21GateTrajectory,
    });
    check(
      results,
      'wave21_projection_composer',
      'Standalone wave 21 projection composer returns headlines',
      wave21.headlines.length > 0 && wave21.summary.length > 10,
      wave21.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 6, fiscalHeadroom: 47, stateCapacityLoad: 43, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave21GateTrajectory(
      6,
      adv.inputs.agent25Wave20ProjectionHandoffBrief!,
      createInitialWave21GateTrajectory()
    );
    check(
      results,
      'wave21_gate_advance_unit',
      'Wave 21 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 6 && snap.snapshot.wave21GateEma > 0,
      `ema=${snap.snapshot.wave21GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 66, stateCapacityLoad: 30, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave21IntegrationMonitor({
      turn: 11,
      wave20ProjectionBrief: adv.inputs.agent25Wave20ProjectionHandoffBrief!,
      wave21GateTrajectory: adv.inputs.wave21GateTrajectory,
      wave20IntegrationMonitor: adv.inputs.wave20IntegrationMonitor!,
    });
    check(
      results,
      'wave21_integration_monitor_unit',
      'Standalone wave 21 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave21_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave21_gate_arc_scenario',
      'Wave 21 gate arc scenario surfaces wave 21 brief',
      last.wave21GateTrajectory !== undefined &&
        last.wave21IntegrationMonitor !== undefined &&
        last.agent25Wave21ProjectionHandoffBrief !== undefined,
      `gate=${last.wave21GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave21_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave21_integration_stress_scenario',
      'Wave 21 integration stress keeps O10-174 gated under stress',
      !last.agent25Wave21ProjectionHandoffBrief!.shouldProjectWave21 ||
        last.wave21IntegrationMonitor!.shouldRunO10m174DryRun,
      `project=${last.agent25Wave21ProjectionHandoffBrief?.shouldProjectWave21} o10m174=${last.wave21IntegrationMonitor?.shouldRunO10m174DryRun}`
    );
  }

  check(
    results,
    'wave21_projection_stub_catalog',
    'Round 21 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_wave21_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_o10m174_gate'),
    'wave21_projection+o10m174_gate'
  );

  check(
    results,
    'wave21_scenario_registry',
    'Round 21 scenarios registered',
    listAgent14ScenarioIds().includes('wave21_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave21_integration_stress'),
    '44 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 60, stateCapacityLoad: 36, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave22_gate_trajectory',
      'Turn advance attaches wave 22 gate trajectory',
      adv.inputs.wave22GateTrajectory !== undefined &&
        adv.wave22GateTrajectoryPersisted.lastTurn === 9,
      `band=${adv.inputs.wave22GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 54, stateCapacityLoad: 44, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave22_integration_monitor',
      'Wave 22 integration monitor present',
      adv.inputs.wave22IntegrationMonitor !== undefined &&
        adv.inputs.wave22IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave22IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 13, fiscalHeadroom: 65, stateCapacityLoad: 31, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave22_projection_handoff_brief',
      'Agent 25 wave 22 projection handoff attached',
      adv.inputs.agent25Wave22ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave22ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave22ProjectionHandoffBrief?.shouldProjectWave22}`
    );
  }

  {
    const raw = sanitizeWave22GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 7,
      emaAlpha: 0.3,
      wave22GateEma: 25,
    });
    check(
      results,
      'wave22_gate_sanitize',
      'Wave 22 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave22GateEma === 25,
      `ema=${raw.wave22GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 55, stateCapacityLoad: 36, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave22 = composeAgent25Wave22ProjectionHandoffBrief({
      turn: 11,
      wave22IntegrationMonitor: adv.inputs.wave22IntegrationMonitor!,
      wave22GateTrajectory: adv.inputs.wave22GateTrajectory,
    });
    check(
      results,
      'wave22_projection_composer',
      'Standalone wave 22 projection composer returns headlines',
      wave22.headlines.length > 0 && wave22.summary.length > 10,
      wave22.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 7, fiscalHeadroom: 46, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave22GateTrajectory(
      7,
      adv.inputs.agent25Wave21ProjectionHandoffBrief!,
      createInitialWave22GateTrajectory()
    );
    check(
      results,
      'wave22_gate_advance_unit',
      'Wave 22 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 7 && snap.snapshot.wave22GateEma > 0,
      `ema=${snap.snapshot.wave22GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 67, stateCapacityLoad: 29, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave22IntegrationMonitor({
      turn: 12,
      wave21ProjectionBrief: adv.inputs.agent25Wave21ProjectionHandoffBrief!,
      wave22GateTrajectory: adv.inputs.wave22GateTrajectory,
      wave21IntegrationMonitor: adv.inputs.wave21IntegrationMonitor!,
    });
    check(
      results,
      'wave22_integration_monitor_unit',
      'Standalone wave 22 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave22_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave22_gate_arc_scenario',
      'Wave 22 gate arc scenario surfaces wave 22 brief',
      last.wave22GateTrajectory !== undefined &&
        last.wave22IntegrationMonitor !== undefined &&
        last.agent25Wave22ProjectionHandoffBrief !== undefined,
      `gate=${last.wave22GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave22_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave22_integration_stress_scenario',
      'Wave 22 integration stress keeps O10-176 gated under stress',
      !last.agent25Wave22ProjectionHandoffBrief!.shouldProjectWave22 ||
        last.wave22IntegrationMonitor!.shouldRunO10m176DryRun,
      `project=${last.agent25Wave22ProjectionHandoffBrief?.shouldProjectWave22} o10m176=${last.wave22IntegrationMonitor?.shouldRunO10m176DryRun}`
    );
  }

  check(
    results,
    'wave22_projection_stub_catalog',
    'Round 22 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave22_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_o10m176_gate'),
    'wave22_projection+o10m176_gate'
  );

  check(
    results,
    'wave22_scenario_registry',
    'Round 22 scenarios registered',
    listAgent14ScenarioIds().includes('wave22_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave22_integration_stress'),
    '46 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 61, stateCapacityLoad: 35, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave23_gate_trajectory',
      'Turn advance attaches wave 23 gate trajectory',
      adv.inputs.wave23GateTrajectory !== undefined &&
        adv.wave23GateTrajectoryPersisted.lastTurn === 10,
      `band=${adv.inputs.wave23GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 55, stateCapacityLoad: 43, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave23_integration_monitor',
      'Wave 23 integration monitor present',
      adv.inputs.wave23IntegrationMonitor !== undefined &&
        adv.inputs.wave23IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave23IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 66, stateCapacityLoad: 30, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave23_projection_handoff_brief',
      'Agent 25 wave 23 projection handoff attached',
      adv.inputs.agent25Wave23ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave23ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave23ProjectionHandoffBrief?.shouldProjectWave23}`
    );
  }

  {
    const raw = sanitizeWave23GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 8,
      emaAlpha: 0.3,
      wave23GateEma: 24,
    });
    check(
      results,
      'wave23_gate_sanitize',
      'Wave 23 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave23GateEma === 24,
      `ema=${raw.wave23GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 54, stateCapacityLoad: 35, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave23 = composeAgent25Wave23ProjectionHandoffBrief({
      turn: 12,
      wave23IntegrationMonitor: adv.inputs.wave23IntegrationMonitor!,
      wave23GateTrajectory: adv.inputs.wave23GateTrajectory,
    });
    check(
      results,
      'wave23_projection_composer',
      'Standalone wave 23 projection composer returns headlines',
      wave23.headlines.length > 0 && wave23.summary.length > 10,
      wave23.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 8, fiscalHeadroom: 45, stateCapacityLoad: 41, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave23GateTrajectory(
      8,
      adv.inputs.agent25Wave22ProjectionHandoffBrief!,
      createInitialWave23GateTrajectory()
    );
    check(
      results,
      'wave23_gate_advance_unit',
      'Wave 23 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 8 && snap.snapshot.wave23GateEma > 0,
      `ema=${snap.snapshot.wave23GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 13, fiscalHeadroom: 68, stateCapacityLoad: 28, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave23IntegrationMonitor({
      turn: 13,
      wave22ProjectionBrief: adv.inputs.agent25Wave22ProjectionHandoffBrief!,
      wave23GateTrajectory: adv.inputs.wave23GateTrajectory,
      wave22IntegrationMonitor: adv.inputs.wave22IntegrationMonitor!,
    });
    check(
      results,
      'wave23_integration_monitor_unit',
      'Standalone wave 23 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave23_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave23_gate_arc_scenario',
      'Wave 23 gate arc scenario surfaces wave 23 brief',
      last.wave23GateTrajectory !== undefined &&
        last.wave23IntegrationMonitor !== undefined &&
        last.agent25Wave23ProjectionHandoffBrief !== undefined,
      `gate=${last.wave23GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave23_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave23_integration_stress_scenario',
      'Wave 23 integration stress keeps O10-178 gated under stress',
      !last.agent25Wave23ProjectionHandoffBrief!.shouldProjectWave23 ||
        last.wave23IntegrationMonitor!.shouldRunO10m178DryRun,
      `project=${last.agent25Wave23ProjectionHandoffBrief?.shouldProjectWave23} o10m178=${last.wave23IntegrationMonitor?.shouldRunO10m178DryRun}`
    );
  }

  check(
    results,
    'wave23_projection_stub_catalog',
    'Round 23 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_wave23_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_o10m178_gate'),
    'wave23_projection+o10m178_gate'
  );

  check(
    results,
    'wave23_scenario_registry',
    'Round 23 scenarios registered',
    listAgent14ScenarioIds().includes('wave23_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave23_integration_stress'),
    '48 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 62, stateCapacityLoad: 34, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave24_gate_trajectory',
      'Turn advance attaches wave 24 gate trajectory',
      adv.inputs.wave24GateTrajectory !== undefined &&
        adv.wave24GateTrajectoryPersisted.lastTurn === 11,
      `band=${adv.inputs.wave24GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 56, stateCapacityLoad: 42, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave24_integration_monitor',
      'Wave 24 integration monitor present',
      adv.inputs.wave24IntegrationMonitor !== undefined &&
        adv.inputs.wave24IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave24IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 15, fiscalHeadroom: 67, stateCapacityLoad: 29, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave24_projection_handoff_brief',
      'Agent 25 wave 24 projection handoff attached',
      adv.inputs.agent25Wave24ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave24ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave24ProjectionHandoffBrief?.shouldProjectWave24}`
    );
  }

  {
    const raw = sanitizeWave24GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 9,
      emaAlpha: 0.3,
      wave24GateEma: 23,
    });
    check(
      results,
      'wave24_gate_sanitize',
      'Wave 24 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave24GateEma === 23,
      `ema=${raw.wave24GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 13, fiscalHeadroom: 53, stateCapacityLoad: 34, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave24 = composeAgent25Wave24ProjectionHandoffBrief({
      turn: 13,
      wave24IntegrationMonitor: adv.inputs.wave24IntegrationMonitor!,
      wave24GateTrajectory: adv.inputs.wave24GateTrajectory,
    });
    check(
      results,
      'wave24_projection_composer',
      'Standalone wave 24 projection composer returns headlines',
      wave24.headlines.length > 0 && wave24.summary.length > 10,
      wave24.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 44, stateCapacityLoad: 40, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave24GateTrajectory(
      9,
      adv.inputs.agent25Wave23ProjectionHandoffBrief!,
      createInitialWave24GateTrajectory()
    );
    check(
      results,
      'wave24_gate_advance_unit',
      'Wave 24 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 9 && snap.snapshot.wave24GateEma > 0,
      `ema=${snap.snapshot.wave24GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 69, stateCapacityLoad: 27, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave24IntegrationMonitor({
      turn: 14,
      wave23ProjectionBrief: adv.inputs.agent25Wave23ProjectionHandoffBrief!,
      wave24GateTrajectory: adv.inputs.wave24GateTrajectory,
      wave23IntegrationMonitor: adv.inputs.wave23IntegrationMonitor!,
    });
    check(
      results,
      'wave24_integration_monitor_unit',
      'Standalone wave 24 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave24_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave24_gate_arc_scenario',
      'Wave 24 gate arc scenario surfaces wave 24 brief',
      last.wave24GateTrajectory !== undefined &&
        last.wave24IntegrationMonitor !== undefined &&
        last.agent25Wave24ProjectionHandoffBrief !== undefined,
      `gate=${last.wave24GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave24_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave24_integration_stress_scenario',
      'Wave 24 integration stress keeps O10-180 gated under stress',
      !last.agent25Wave24ProjectionHandoffBrief!.shouldProjectWave24 ||
        last.wave24IntegrationMonitor!.shouldRunO10m180DryRun,
      `project=${last.agent25Wave24ProjectionHandoffBrief?.shouldProjectWave24} o10m180=${last.wave24IntegrationMonitor?.shouldRunO10m180DryRun}`
    );
  }

  check(
    results,
    'wave24_projection_stub_catalog',
    'Round 24 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_ACT_wave24_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m180_gate'),
    'wave24_projection+o10m180_gate'
  );

  check(
    results,
    'wave24_scenario_registry',
    'Round 24 scenarios registered',
    listAgent14ScenarioIds().includes('wave24_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave24_integration_stress'),
    '50 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 63, stateCapacityLoad: 33, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave25_gate_trajectory',
      'Turn advance attaches wave 25 gate trajectory',
      adv.inputs.wave25GateTrajectory !== undefined &&
        adv.wave25GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave25GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 57, stateCapacityLoad: 41, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave25_integration_monitor',
      'Wave 25 integration monitor present',
      adv.inputs.wave25IntegrationMonitor !== undefined &&
        adv.inputs.wave25IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave25IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 68, stateCapacityLoad: 28, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave25_projection_handoff_brief',
      'Agent 25 wave 25 projection handoff attached',
      adv.inputs.agent25Wave25ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave25ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave25ProjectionHandoffBrief?.shouldProjectWave25}`
    );
  }

  {
    const raw = sanitizeWave25GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave25GateEma: 22,
    });
    check(
      results,
      'wave25_gate_sanitize',
      'Wave 25 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave25GateEma === 22,
      `ema=${raw.wave25GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 52, stateCapacityLoad: 33, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave25 = composeAgent25Wave25ProjectionHandoffBrief({
      turn: 14,
      wave25IntegrationMonitor: adv.inputs.wave25IntegrationMonitor!,
      wave25GateTrajectory: adv.inputs.wave25GateTrajectory,
    });
    check(
      results,
      'wave25_projection_composer',
      'Standalone wave 25 projection composer returns headlines',
      wave25.headlines.length > 0 && wave25.summary.length > 10,
      wave25.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 43, stateCapacityLoad: 39, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave25GateTrajectory(
      10,
      adv.inputs.agent25Wave24ProjectionHandoffBrief!,
      createInitialWave25GateTrajectory()
    );
    check(
      results,
      'wave25_gate_advance_unit',
      'Wave 25 gate trajectory advance updates persisted turn',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave25GateEma > 0,
      `ema=${snap.snapshot.wave25GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 15, fiscalHeadroom: 70, stateCapacityLoad: 26, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave25IntegrationMonitor({
      turn: 15,
      wave24ProjectionBrief: adv.inputs.agent25Wave24ProjectionHandoffBrief!,
      wave25GateTrajectory: adv.inputs.wave25GateTrajectory,
      wave24IntegrationMonitor: adv.inputs.wave24IntegrationMonitor!,
    });
    check(
      results,
      'wave25_integration_monitor_unit',
      'Standalone wave 25 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave25_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave25_gate_arc_scenario',
      'Wave 25 gate arc scenario surfaces wave 25 brief',
      last.wave25GateTrajectory !== undefined &&
        last.wave25IntegrationMonitor !== undefined &&
        last.agent25Wave25ProjectionHandoffBrief !== undefined,
      `gate=${last.wave25GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave25_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1];
    check(
      results,
      'wave25_integration_stress_scenario',
      'Wave 25 integration stress keeps O10-182 gated under stress',
      !last.agent25Wave25ProjectionHandoffBrief!.shouldProjectWave25 ||
        last.wave25IntegrationMonitor!.shouldRunO10m182DryRun,
      `project=${last.agent25Wave25ProjectionHandoffBrief?.shouldProjectWave25} o10m182=${last.wave25IntegrationMonitor?.shouldRunO10m182DryRun}`
    );
  }

  check(
    results,
    'wave25_projection_stub_catalog',
    'Round 25 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_wave25_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m182_gate'),
    'wave25_projection+o10m182_gate'
  );

  check(
    results,
    'wave25_scenario_registry',
    'Round 25 scenarios registered',
    listAgent14ScenarioIds().includes('wave25_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave25_integration_stress'),
    '52 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 64, stateCapacityLoad: 32, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave26_gate_trajectory',
      'Turn advance attaches wave 26 gate trajectory',
      adv.inputs.wave26GateTrajectory !== undefined &&
        adv.wave26GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave26GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 58, stateCapacityLoad: 40, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave26_integration_monitor',
      'Wave 26 integration monitor present',
      adv.inputs.wave26IntegrationMonitor !== undefined &&
        adv.inputs.wave26IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave26IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 69, stateCapacityLoad: 27, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave26_projection_handoff_brief',
      'Agent 25 wave 26 projection handoff attached',
      adv.inputs.agent25Wave26ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave26ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave26ProjectionHandoffBrief?.shouldProjectWave26}`
    );
  }

  {
    const raw = sanitizeWave26GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave26GateEma: 21,
    });
    check(
      results,
      'wave26_gate_sanitize',
      'Wave 26 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave26GateEma === 21,
      `ema=${raw.wave26GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 53, stateCapacityLoad: 32, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave26 = composeAgent25Wave26ProjectionHandoffBrief({
      turn: 14,
      wave26IntegrationMonitor: adv.inputs.wave26IntegrationMonitor!,
      wave26GateTrajectory: adv.inputs.wave26GateTrajectory,
    });
    check(
      results,
      'wave26_projection_composer',
      'Wave 26 projection composer emits summary',
      wave26.headlines.length > 0 && wave26.summary.length > 10,
      wave26.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 60, stateCapacityLoad: 35, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave26GateTrajectory(
      10,
      adv.inputs.agent25Wave25ProjectionHandoffBrief!,
      createInitialWave26GateTrajectory()
    );
    check(
      results,
      'wave26_gate_advance_unit',
      'Wave 26 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave26GateEma > 0,
      `ema=${snap.snapshot.wave26GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 55, stateCapacityLoad: 38, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave26IntegrationMonitor({
      turn: 9,
      wave25ProjectionBrief: adv.inputs.agent25Wave25ProjectionHandoffBrief!,
      wave26GateTrajectory: adv.inputs.wave26GateTrajectory,
      wave25IntegrationMonitor: adv.inputs.wave25IntegrationMonitor!,
    });
    check(
      results,
      'wave26_integration_monitor_unit',
      'Wave 26 integration monitor defers when wave 25 projection not cleared',
      !monitor.shouldRunO10m184DryRun && monitor.summary.includes('deferred'),
      monitor.summary.slice(0, 72)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave26_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave26_gate_arc_scenario',
      'Wave 26 gate arc scenario attaches wave 26 chain',
      last.wave26GateTrajectory !== undefined &&
        last.wave26IntegrationMonitor !== undefined &&
        last.agent25Wave26ProjectionHandoffBrief !== undefined,
      `gate=${last.wave26GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave26_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave26_integration_stress_scenario',
      'Wave 26 integration stress keeps O10-184 gated under stress',
      !last.agent25Wave26ProjectionHandoffBrief!.shouldProjectWave26 ||
        last.wave26IntegrationMonitor!.shouldRunO10m184DryRun,
      `project=${last.agent25Wave26ProjectionHandoffBrief?.shouldProjectWave26} o10m184=${last.wave26IntegrationMonitor?.shouldRunO10m184DryRun}`
    );
  }

  check(
    results,
    'wave26_projection_stub_catalog',
    'Round 26 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_wave26_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_o10m184_gate'),
    'wave26_projection+o10m184_gate'
  );

  check(
    results,
    'wave26_scenario_registry',
    'Round 26 scenarios registered',
    listAgent14ScenarioIds().includes('wave26_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave26_integration_stress'),
    '54 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 65, stateCapacityLoad: 31, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave27_gate_trajectory',
      'Turn advance attaches wave 27 gate trajectory',
      adv.inputs.wave27GateTrajectory !== undefined &&
        adv.wave27GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave27GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 59, stateCapacityLoad: 39, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave27_integration_monitor',
      'Wave 27 integration monitor present',
      adv.inputs.wave27IntegrationMonitor !== undefined &&
        adv.inputs.wave27IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave27IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 70, stateCapacityLoad: 26, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave27_projection_handoff_brief',
      'Agent 25 wave 27 projection handoff attached',
      adv.inputs.agent25Wave27ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave27ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave27ProjectionHandoffBrief?.shouldProjectWave27}`
    );
  }

  {
    const raw = sanitizeWave27GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave27GateEma: 20,
    });
    check(
      results,
      'wave27_gate_sanitize',
      'Wave 27 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave27GateEma === 20,
      `ema=${raw.wave27GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 54, stateCapacityLoad: 31, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave27 = composeAgent25Wave27ProjectionHandoffBrief({
      turn: 14,
      wave27IntegrationMonitor: adv.inputs.wave27IntegrationMonitor!,
      wave27GateTrajectory: adv.inputs.wave27GateTrajectory,
    });
    check(
      results,
      'wave27_projection_composer',
      'Standalone wave 27 projection composer returns headlines',
      wave27.headlines.length > 0 && wave27.summary.length > 10,
      wave27.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 61, stateCapacityLoad: 34, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave27GateTrajectory(
      10,
      adv.inputs.agent25Wave26ProjectionHandoffBrief!,
      createInitialWave27GateTrajectory()
    );
    check(
      results,
      'wave27_gate_advance_unit',
      'Wave 27 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave27GateEma > 0,
      `ema=${snap.snapshot.wave27GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 56, stateCapacityLoad: 37, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave27IntegrationMonitor({
      turn: 9,
      wave26ProjectionBrief: adv.inputs.agent25Wave26ProjectionHandoffBrief!,
      wave27GateTrajectory: adv.inputs.wave27GateTrajectory,
      wave26IntegrationMonitor: adv.inputs.wave26IntegrationMonitor!,
    });
    check(
      results,
      'wave27_integration_monitor_unit',
      'Standalone wave 27 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave27_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave27_gate_arc_scenario',
      'Wave 27 gate arc scenario attaches wave 27 chain',
      last.wave27GateTrajectory !== undefined &&
        last.wave27IntegrationMonitor !== undefined &&
        last.agent25Wave27ProjectionHandoffBrief !== undefined,
      `gate=${last.wave27GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave27_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave27_integration_stress_scenario',
      'Wave 27 integration stress keeps O10-186 gated under stress',
      !last.agent25Wave27ProjectionHandoffBrief!.shouldProjectWave27 ||
        last.wave27IntegrationMonitor!.shouldRunO10m186DryRun,
      `project=${last.agent25Wave27ProjectionHandoffBrief?.shouldProjectWave27} o10m186=${last.wave27IntegrationMonitor?.shouldRunO10m186DryRun}`
    );
  }

  check(
    results,
    'wave27_projection_stub_catalog',
    'Round 27 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave27_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m186_gate'),
    'wave27_projection+o10m186_gate'
  );

  check(
    results,
    'wave27_scenario_registry',
    'Round 27 scenarios registered',
    listAgent14ScenarioIds().includes('wave27_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave27_integration_stress'),
    '56 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 66, stateCapacityLoad: 30, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave28_gate_trajectory',
      'Turn advance attaches wave 28 gate trajectory',
      adv.inputs.wave28GateTrajectory !== undefined &&
        adv.wave28GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave28GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 60, stateCapacityLoad: 38, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave28_integration_monitor',
      'Wave 28 integration monitor present',
      adv.inputs.wave28IntegrationMonitor !== undefined &&
        adv.inputs.wave28IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave28IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 71, stateCapacityLoad: 25, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave28_projection_handoff_brief',
      'Agent 25 wave 28 projection handoff attached',
      adv.inputs.agent25Wave28ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave28ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave28ProjectionHandoffBrief?.shouldProjectWave28}`
    );
  }

  {
    const raw = sanitizeWave28GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave28GateEma: 19,
    });
    check(
      results,
      'wave28_gate_sanitize',
      'Wave 28 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave28GateEma === 19,
      `ema=${raw.wave28GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 55, stateCapacityLoad: 30, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave28 = composeAgent25Wave28ProjectionHandoffBrief({
      turn: 14,
      wave28IntegrationMonitor: adv.inputs.wave28IntegrationMonitor!,
      wave28GateTrajectory: adv.inputs.wave28GateTrajectory,
    });
    check(
      results,
      'wave28_projection_composer',
      'Standalone wave 28 projection composer returns headlines',
      wave28.headlines.length > 0 && wave28.summary.length > 10,
      wave28.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 62, stateCapacityLoad: 33, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave28GateTrajectory(
      10,
      adv.inputs.agent25Wave27ProjectionHandoffBrief!,
      createInitialWave28GateTrajectory()
    );
    check(
      results,
      'wave28_gate_advance_unit',
      'Wave 28 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave28GateEma > 0,
      `ema=${snap.snapshot.wave28GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 57, stateCapacityLoad: 36, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave28IntegrationMonitor({
      turn: 9,
      wave27ProjectionBrief: adv.inputs.agent25Wave27ProjectionHandoffBrief!,
      wave28GateTrajectory: adv.inputs.wave28GateTrajectory,
      wave27IntegrationMonitor: adv.inputs.wave27IntegrationMonitor!,
    });
    check(
      results,
      'wave28_integration_monitor_unit',
      'Standalone wave 28 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave28_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave28_gate_arc_scenario',
      'Wave 28 gate arc scenario attaches wave 28 chain',
      last.wave28GateTrajectory !== undefined &&
        last.wave28IntegrationMonitor !== undefined &&
        last.agent25Wave28ProjectionHandoffBrief !== undefined,
      `gate=${last.wave28GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave28_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave28_integration_stress_scenario',
      'Wave 28 integration stress keeps O10-188 gated under stress',
      !last.agent25Wave28ProjectionHandoffBrief!.shouldProjectWave28 ||
        last.wave28IntegrationMonitor!.shouldRunO10m188DryRun,
      `project=${last.agent25Wave28ProjectionHandoffBrief?.shouldProjectWave28} o10m188=${last.wave28IntegrationMonitor?.shouldRunO10m188DryRun}`
    );
  }

  check(
    results,
    'wave28_projection_stub_catalog',
    'Round 28 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_ACT_wave28_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m188_gate'),
    'wave28_projection+o10m188_gate'
  );

  check(
    results,
    'wave28_scenario_registry',
    'Round 28 scenarios registered',
    listAgent14ScenarioIds().includes('wave28_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave28_integration_stress'),
    '58 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 67, stateCapacityLoad: 29, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave29_gate_trajectory',
      'Turn advance attaches wave 29 gate trajectory',
      adv.inputs.wave29GateTrajectory !== undefined &&
        adv.wave29GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave29GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 61, stateCapacityLoad: 37, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave29_integration_monitor',
      'Wave 29 integration monitor present',
      adv.inputs.wave29IntegrationMonitor !== undefined &&
        adv.inputs.wave29IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave29IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 72, stateCapacityLoad: 24, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave29_projection_handoff_brief',
      'Agent 25 wave 29 projection handoff attached',
      adv.inputs.agent25Wave29ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave29ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave29ProjectionHandoffBrief?.shouldProjectWave29}`
    );
  }

  {
    const raw = sanitizeWave29GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave29GateEma: 18,
    });
    check(
      results,
      'wave29_gate_sanitize',
      'Wave 29 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave29GateEma === 18,
      `ema=${raw.wave29GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 56, stateCapacityLoad: 29, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave29 = composeAgent25Wave29ProjectionHandoffBrief({
      turn: 14,
      wave29IntegrationMonitor: adv.inputs.wave29IntegrationMonitor!,
      wave29GateTrajectory: adv.inputs.wave29GateTrajectory,
    });
    check(
      results,
      'wave29_projection_composer',
      'Standalone wave 29 projection composer returns headlines',
      wave29.headlines.length > 0 && wave29.summary.length > 10,
      wave29.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 63, stateCapacityLoad: 32, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave29GateTrajectory(
      10,
      adv.inputs.agent25Wave28ProjectionHandoffBrief!,
      createInitialWave29GateTrajectory()
    );
    check(
      results,
      'wave29_gate_advance_unit',
      'Wave 29 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave29GateEma > 0,
      `ema=${snap.snapshot.wave29GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 58, stateCapacityLoad: 35, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave29IntegrationMonitor({
      turn: 9,
      wave28ProjectionBrief: adv.inputs.agent25Wave28ProjectionHandoffBrief!,
      wave29GateTrajectory: adv.inputs.wave29GateTrajectory,
      wave28IntegrationMonitor: adv.inputs.wave28IntegrationMonitor!,
    });
    check(
      results,
      'wave29_integration_monitor_unit',
      'Standalone wave 29 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave29_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave29_gate_arc_scenario',
      'Wave 29 gate arc scenario attaches wave 29 chain',
      last.wave29GateTrajectory !== undefined &&
        last.wave29IntegrationMonitor !== undefined &&
        last.agent25Wave29ProjectionHandoffBrief !== undefined,
      `gate=${last.wave29GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave29_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave29_integration_stress_scenario',
      'Wave 29 integration stress keeps O10-190 gated under stress',
      !last.agent25Wave29ProjectionHandoffBrief!.shouldProjectWave29 ||
        last.wave29IntegrationMonitor!.shouldRunO10m190DryRun,
      `project=${last.agent25Wave29ProjectionHandoffBrief?.shouldProjectWave29} o10m190=${last.wave29IntegrationMonitor?.shouldRunO10m190DryRun}`
    );
  }

  check(
    results,
    'wave29_projection_stub_catalog',
    'Round 29 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_wave29_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_o10m190_gate'),
    'wave29_projection+o10m190_gate'
  );

  check(
    results,
    'wave29_scenario_registry',
    'Round 29 scenarios registered',
    listAgent14ScenarioIds().includes('wave29_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave29_integration_stress'),
    '60 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 68, stateCapacityLoad: 28, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave30_gate_trajectory',
      'Turn advance attaches wave 30 gate trajectory',
      adv.inputs.wave30GateTrajectory !== undefined &&
        adv.wave30GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave30GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 62, stateCapacityLoad: 36, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave30_integration_monitor',
      'Wave 30 integration monitor present',
      adv.inputs.wave30IntegrationMonitor !== undefined &&
        adv.inputs.wave30IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave30IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 73, stateCapacityLoad: 23, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave30_projection_handoff_brief',
      'Agent 25 wave 30 projection handoff attached',
      adv.inputs.agent25Wave30ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave30ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave30ProjectionHandoffBrief?.shouldProjectWave30}`
    );
  }

  {
    const raw = sanitizeWave30GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave30GateEma: 17,
    });
    check(
      results,
      'wave30_gate_sanitize',
      'Wave 30 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave30GateEma === 17,
      `ema=${raw.wave30GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 57, stateCapacityLoad: 28, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave30 = composeAgent25Wave30ProjectionHandoffBrief({
      turn: 14,
      wave30IntegrationMonitor: adv.inputs.wave30IntegrationMonitor!,
      wave30GateTrajectory: adv.inputs.wave30GateTrajectory,
    });
    check(
      results,
      'wave30_projection_composer',
      'Standalone wave 30 projection composer returns headlines',
      wave30.headlines.length > 0 && wave30.summary.length > 10,
      wave30.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 64, stateCapacityLoad: 31, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave30GateTrajectory(
      10,
      adv.inputs.agent25Wave29ProjectionHandoffBrief!,
      createInitialWave30GateTrajectory()
    );
    check(
      results,
      'wave30_gate_advance_unit',
      'Wave 30 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave30GateEma > 0,
      `ema=${snap.snapshot.wave30GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 59, stateCapacityLoad: 34, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave30IntegrationMonitor({
      turn: 9,
      wave29ProjectionBrief: adv.inputs.agent25Wave29ProjectionHandoffBrief!,
      wave30GateTrajectory: adv.inputs.wave30GateTrajectory,
      wave29IntegrationMonitor: adv.inputs.wave29IntegrationMonitor!,
    });
    check(
      results,
      'wave30_integration_monitor_unit',
      'Standalone wave 30 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave30_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave30_gate_arc_scenario',
      'Wave 30 gate arc scenario attaches wave 30 chain',
      last.wave30GateTrajectory !== undefined &&
        last.wave30IntegrationMonitor !== undefined &&
        last.agent25Wave30ProjectionHandoffBrief !== undefined,
      `gate=${last.wave30GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave30_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave30_integration_stress_scenario',
      'Wave 30 integration stress keeps O10-192 gated under stress',
      !last.agent25Wave30ProjectionHandoffBrief!.shouldProjectWave30 ||
        last.wave30IntegrationMonitor!.shouldRunO10m192DryRun,
      `project=${last.agent25Wave30ProjectionHandoffBrief?.shouldProjectWave30} o10m192=${last.wave30IntegrationMonitor?.shouldRunO10m192DryRun}`
    );
  }

  check(
    results,
    'wave30_projection_stub_catalog',
    'Round 30 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_wave30_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_o10m192_gate'),
    'wave30_projection+o10m192_gate'
  );

  check(
    results,
    'wave30_scenario_registry',
    'Round 30 scenarios registered',
    listAgent14ScenarioIds().includes('wave30_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave30_integration_stress'),
    '62 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 69, stateCapacityLoad: 27, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave31_gate_trajectory',
      'Turn advance attaches wave 31 gate trajectory',
      adv.inputs.wave31GateTrajectory !== undefined &&
        adv.wave31GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave31GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 63, stateCapacityLoad: 35, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave31_integration_monitor',
      'Wave 31 integration monitor present',
      adv.inputs.wave31IntegrationMonitor !== undefined &&
        adv.inputs.wave31IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave31IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 74, stateCapacityLoad: 22, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave31_projection_handoff_brief',
      'Agent 25 wave 31 projection handoff attached',
      adv.inputs.agent25Wave31ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave31ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave31ProjectionHandoffBrief?.shouldProjectWave31}`
    );
  }

  {
    const raw = sanitizeWave31GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave31GateEma: 16,
    });
    check(
      results,
      'wave31_gate_sanitize',
      'Wave 31 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave31GateEma === 16,
      `ema=${raw.wave31GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 58, stateCapacityLoad: 27, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave31 = composeAgent25Wave31ProjectionHandoffBrief({
      turn: 14,
      wave31IntegrationMonitor: adv.inputs.wave31IntegrationMonitor!,
      wave31GateTrajectory: adv.inputs.wave31GateTrajectory,
    });
    check(
      results,
      'wave31_projection_composer',
      'Standalone wave 31 projection composer returns headlines',
      wave31.headlines.length > 0 && wave31.summary.length > 10,
      wave31.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 65, stateCapacityLoad: 30, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave31GateTrajectory(
      10,
      adv.inputs.agent25Wave30ProjectionHandoffBrief!,
      createInitialWave31GateTrajectory()
    );
    check(
      results,
      'wave31_gate_advance_unit',
      'Wave 31 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave31GateEma > 0,
      `ema=${snap.snapshot.wave31GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 60, stateCapacityLoad: 33, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave31IntegrationMonitor({
      turn: 9,
      wave30ProjectionBrief: adv.inputs.agent25Wave30ProjectionHandoffBrief!,
      wave31GateTrajectory: adv.inputs.wave31GateTrajectory,
      wave30IntegrationMonitor: adv.inputs.wave30IntegrationMonitor!,
    });
    check(
      results,
      'wave31_integration_monitor_unit',
      'Standalone wave 31 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave31_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave31_gate_arc_scenario',
      'Wave 31 gate arc scenario attaches wave 31 chain',
      last.wave31GateTrajectory !== undefined &&
        last.wave31IntegrationMonitor !== undefined &&
        last.agent25Wave31ProjectionHandoffBrief !== undefined,
      `gate=${last.wave31GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave31_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave31_integration_stress_scenario',
      'Wave 31 integration stress keeps O10-194 gated under stress',
      !last.agent25Wave31ProjectionHandoffBrief!.shouldProjectWave31 ||
        last.wave31IntegrationMonitor!.shouldRunO10m194DryRun,
      `project=${last.agent25Wave31ProjectionHandoffBrief?.shouldProjectWave31} o10m194=${last.wave31IntegrationMonitor?.shouldRunO10m194DryRun}`
    );
  }

  check(
    results,
    'wave31_projection_stub_catalog',
    'Round 31 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_wave31_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m194_gate'),
    'wave31_projection+o10m194_gate'
  );

  check(
    results,
    'wave31_scenario_registry',
    'Round 31 scenarios registered',
    listAgent14ScenarioIds().includes('wave31_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave31_integration_stress'),
    '64 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 70, stateCapacityLoad: 26, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave32_gate_trajectory',
      'Turn advance attaches wave 32 gate trajectory',
      adv.inputs.wave32GateTrajectory !== undefined &&
        adv.wave32GateTrajectoryPersisted.lastTurn === 12,
      `band=${adv.inputs.wave32GateTrajectory?.band}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 11, fiscalHeadroom: 64, stateCapacityLoad: 34, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave32_integration_monitor',
      'Wave 32 integration monitor present',
      adv.inputs.wave32IntegrationMonitor !== undefined &&
        adv.inputs.wave32IntegrationMonitor!.summary.length > 10,
      adv.inputs.wave32IntegrationMonitor?.summary.slice(0, 72) ?? 'missing'
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 16, fiscalHeadroom: 75, stateCapacityLoad: 21, workforceReadiness: 'strong' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(
      results,
      'wave32_projection_handoff_brief',
      'Agent 25 wave 32 projection handoff attached',
      adv.inputs.agent25Wave32ProjectionHandoffBrief !== undefined &&
        adv.inputs.agent25Wave32ProjectionHandoffBrief!.summary.length > 10,
      `project=${adv.inputs.agent25Wave32ProjectionHandoffBrief?.shouldProjectWave32}`
    );
  }

  {
    const raw = sanitizeWave32GateTrajectory({
      schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION,
      lastTurn: 10,
      emaAlpha: 0.3,
      wave32GateEma: 15,
    });
    check(
      results,
      'wave32_gate_sanitize',
      'Wave 32 gate trajectory sanitize preserves schema',
      raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave32GateEma === 15,
      `ema=${raw.wave32GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 14, fiscalHeadroom: 59, stateCapacityLoad: 26, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const wave32 = composeAgent25Wave32ProjectionHandoffBrief({
      turn: 14,
      wave32IntegrationMonitor: adv.inputs.wave32IntegrationMonitor!,
      wave32GateTrajectory: adv.inputs.wave32GateTrajectory,
    });
    check(
      results,
      'wave32_projection_composer',
      'Standalone wave 32 projection composer returns headlines',
      wave32.headlines.length > 0 && wave32.summary.length > 10,
      wave32.summary.slice(0, 64)
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 10, fiscalHeadroom: 66, stateCapacityLoad: 29, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const snap = advanceWave32GateTrajectory(
      10,
      adv.inputs.agent25Wave31ProjectionHandoffBrief!,
      createInitialWave32GateTrajectory()
    );
    check(
      results,
      'wave32_gate_advance_unit',
      'Wave 32 gate advance updates persisted EMA',
      snap.persisted.lastTurn === 10 && snap.snapshot.wave32GateEma > 0,
      `ema=${snap.snapshot.wave32GateEma}`
    );
  }

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 9, fiscalHeadroom: 61, stateCapacityLoad: 32, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    const monitor = buildWave32IntegrationMonitor({
      turn: 9,
      wave31ProjectionBrief: adv.inputs.agent25Wave31ProjectionHandoffBrief!,
      wave32GateTrajectory: adv.inputs.wave32GateTrajectory,
      wave31IntegrationMonitor: adv.inputs.wave31IntegrationMonitor!,
    });
    check(
      results,
      'wave32_integration_monitor_unit',
      'Standalone wave 32 integration monitor returns summary',
      monitor.summary.length > 10,
      monitor.summary.slice(0, 64)
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave32_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave32_gate_arc_scenario',
      'Wave 32 gate arc scenario attaches wave 32 chain',
      last.wave32GateTrajectory !== undefined &&
        last.wave32IntegrationMonitor !== undefined &&
        last.agent25Wave32ProjectionHandoffBrief !== undefined,
      `gate=${last.wave32GateTrajectory?.band}`
    );
  }

  {
    const sim = simulateAgent14HousingScenario('wave32_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(
      results,
      'wave32_integration_stress_scenario',
      'Wave 32 integration stress keeps O10-196 gated under stress',
      !last.agent25Wave32ProjectionHandoffBrief!.shouldProjectWave32 ||
        last.wave32IntegrationMonitor!.shouldRunO10m196DryRun,
      `project=${last.agent25Wave32ProjectionHandoffBrief?.shouldProjectWave32} o10m196=${last.wave32IntegrationMonitor?.shouldRunO10m196DryRun}`
    );
  }

  check(
    results,
    'wave32_projection_stub_catalog',
    'Round 32 projection stubs registered',
    AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_wave32_projection') &&
      AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m196_gate'),
    'wave32_projection+o10m196_gate'
  );

  check(
    results,
    'wave32_scenario_registry',
    'Round 32 scenarios registered',
    listAgent14ScenarioIds().includes('wave32_gate_trajectory_arc') &&
      listAgent14ScenarioIds().includes('wave32_integration_stress'),
    '66 scenarios'
  );

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 71, stateCapacityLoad: 25, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave33_gate_trajectory', 'Turn advance attaches wave 33 gate trajectory', adv.inputs.wave33GateTrajectory !== undefined && adv.wave33GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave33GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 65, stateCapacityLoad: 33, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave33_integration_monitor', 'Wave 33 integration monitor present', adv.inputs.wave33IntegrationMonitor !== undefined && adv.inputs.wave33IntegrationMonitor!.summary.length > 10, adv.inputs.wave33IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 76, stateCapacityLoad: 20, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave33_projection_handoff_brief', 'Agent 25 wave 33 projection handoff attached', adv.inputs.agent25Wave33ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave33ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave33ProjectionHandoffBrief?.shouldProjectWave33}`);
  }
  {
    const raw = sanitizeWave33GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave33GateEma: 14 });
    check(results, 'wave33_gate_sanitize', 'Wave 33 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave33GateEma === 14, `ema=${raw.wave33GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 60, stateCapacityLoad: 25, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave33 = composeAgent25Wave33ProjectionHandoffBrief({ turn: 14, wave33IntegrationMonitor: adv.inputs.wave33IntegrationMonitor!, wave33GateTrajectory: adv.inputs.wave33GateTrajectory });
    check(results, 'wave33_projection_composer', 'Standalone wave 33 projection composer returns headlines', wave33.headlines.length > 0 && wave33.summary.length > 10, wave33.summary.slice(0, 64));
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 10, fiscalHeadroom: 67, stateCapacityLoad: 28, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const snap = advanceWave33GateTrajectory(10, adv.inputs.agent25Wave32ProjectionHandoffBrief!, createInitialWave33GateTrajectory());
    check(results, 'wave33_gate_advance_unit', 'Wave 33 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave33GateEma > 0, `ema=${snap.snapshot.wave33GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 62, stateCapacityLoad: 31, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave33IntegrationMonitor({ turn: 9, wave32ProjectionBrief: adv.inputs.agent25Wave32ProjectionHandoffBrief!, wave33GateTrajectory: adv.inputs.wave33GateTrajectory, wave32IntegrationMonitor: adv.inputs.wave32IntegrationMonitor! });
    check(results, 'wave33_integration_monitor_unit', 'Standalone wave 33 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave33_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave33_gate_arc_scenario', 'Wave 33 gate arc scenario attaches wave 33 chain', last.wave33GateTrajectory !== undefined && last.wave33IntegrationMonitor !== undefined && last.agent25Wave33ProjectionHandoffBrief !== undefined, `gate=${last.wave33GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave33_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave33_integration_stress_scenario', 'Wave 33 integration stress keeps O10-198 gated under stress', !last.agent25Wave33ProjectionHandoffBrief!.shouldProjectWave33 || last.wave33IntegrationMonitor!.shouldRunO10m198DryRun, `project=${last.agent25Wave33ProjectionHandoffBrief?.shouldProjectWave33} o10m198=${last.wave33IntegrationMonitor?.shouldRunO10m198DryRun}`);
  }
  check(results, 'wave33_projection_stub_catalog', 'Round 33 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave33_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_o10m198_gate'), 'wave33_projection+o10m198_gate');
  check(results, 'wave33_scenario_registry', 'Round 33 scenarios registered', listAgent14ScenarioIds().includes('wave33_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave33_integration_stress'), '68 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 72, stateCapacityLoad: 24, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave34_gate_trajectory', 'Turn advance attaches wave 34 gate trajectory', adv.inputs.wave34GateTrajectory !== undefined && adv.wave34GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave34GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 66, stateCapacityLoad: 32, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave34_integration_monitor', 'Wave 34 integration monitor present', adv.inputs.wave34IntegrationMonitor !== undefined && adv.inputs.wave34IntegrationMonitor!.summary.length > 10, adv.inputs.wave34IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 77, stateCapacityLoad: 19, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave34_projection_handoff_brief', 'Agent 25 wave 34 projection handoff attached', adv.inputs.agent25Wave34ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave34ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave34ProjectionHandoffBrief?.shouldProjectWave34}`);
  }
  {
    const raw = sanitizeWave34GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave34GateEma: 13 });
    check(results, 'wave34_gate_sanitize', 'Wave 34 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave34GateEma === 13, `ema=${raw.wave34GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 70, stateCapacityLoad: 26, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave34 = composeAgent25Wave34ProjectionHandoffBrief({ turn: 14, wave34IntegrationMonitor: adv.inputs.wave34IntegrationMonitor!, wave34GateTrajectory: adv.inputs.wave34GateTrajectory });
    check(results, 'wave34_projection_composer', 'Standalone wave 34 projection composer returns headlines', wave34.headlines.length > 0 && wave34.summary.length > 10, wave34.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave33: true, shouldRunO10m198DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave34GateTrajectory(10, brief, createInitialWave34GateTrajectory());
    check(results, 'wave34_gate_advance_unit', 'Wave 34 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave34GateEma > 0, `ema=${snap.snapshot.wave34GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 68, stateCapacityLoad: 30, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave34IntegrationMonitor({ turn: 9, wave33ProjectionBrief: adv.inputs.agent25Wave33ProjectionHandoffBrief!, wave34GateTrajectory: adv.inputs.wave34GateTrajectory, wave33IntegrationMonitor: adv.inputs.wave33IntegrationMonitor! });
    check(results, 'wave34_integration_monitor_unit', 'Standalone wave 34 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave34_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave34_gate_arc_scenario', 'Wave 34 gate arc scenario attaches wave 34 chain', last.wave34GateTrajectory !== undefined && last.wave34IntegrationMonitor !== undefined && last.agent25Wave34ProjectionHandoffBrief !== undefined, `gate=${last.wave34GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave34_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave34_integration_stress_scenario', 'Wave 34 integration stress keeps O10-200 gated under stress', !last.agent25Wave34ProjectionHandoffBrief!.shouldProjectWave34 || last.wave34IntegrationMonitor!.shouldRunO10m200DryRun, `project=${last.agent25Wave34ProjectionHandoffBrief?.shouldProjectWave34} o10m200=${last.wave34IntegrationMonitor?.shouldRunO10m200DryRun}`);
  }
  check(results, 'wave34_projection_stub_catalog', 'Round 34 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_wave34_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m200_gate'), 'wave34_projection+o10m200_gate');
  check(results, 'wave34_scenario_registry', 'Round 34 scenarios registered', listAgent14ScenarioIds().includes('wave34_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave34_integration_stress'), '70 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 73, stateCapacityLoad: 23, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave35_gate_trajectory', 'Turn advance attaches wave 35 gate trajectory', adv.inputs.wave35GateTrajectory !== undefined && adv.wave35GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave35GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 67, stateCapacityLoad: 31, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave35_integration_monitor', 'Wave 35 integration monitor present', adv.inputs.wave35IntegrationMonitor !== undefined && adv.inputs.wave35IntegrationMonitor!.summary.length > 10, adv.inputs.wave35IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 78, stateCapacityLoad: 18, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave35_projection_handoff_brief', 'Agent 25 wave 35 projection handoff attached', adv.inputs.agent25Wave35ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave35ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave35ProjectionHandoffBrief?.shouldProjectWave35}`);
  }
  {
    const raw = sanitizeWave35GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave35GateEma: 12 });
    check(results, 'wave35_gate_sanitize', 'Wave 35 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave35GateEma === 12, `ema=${raw.wave35GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 71, stateCapacityLoad: 25, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave35 = composeAgent25Wave35ProjectionHandoffBrief({ turn: 14, wave35IntegrationMonitor: adv.inputs.wave35IntegrationMonitor!, wave35GateTrajectory: adv.inputs.wave35GateTrajectory });
    check(results, 'wave35_projection_composer', 'Standalone wave 35 projection composer returns headlines', wave35.headlines.length > 0 && wave35.summary.length > 10, wave35.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave34: true, shouldRunO10m200DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave35GateTrajectory(10, brief, createInitialWave35GateTrajectory());
    check(results, 'wave35_gate_advance_unit', 'Wave 35 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave35GateEma > 0, `ema=${snap.snapshot.wave35GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 69, stateCapacityLoad: 29, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave35IntegrationMonitor({ turn: 9, wave34ProjectionBrief: adv.inputs.agent25Wave34ProjectionHandoffBrief!, wave35GateTrajectory: adv.inputs.wave35GateTrajectory, wave34IntegrationMonitor: adv.inputs.wave34IntegrationMonitor! });
    check(results, 'wave35_integration_monitor_unit', 'Standalone wave 35 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave35_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave35_gate_arc_scenario', 'Wave 35 gate arc scenario attaches wave 35 chain', last.wave35GateTrajectory !== undefined && last.wave35IntegrationMonitor !== undefined && last.agent25Wave35ProjectionHandoffBrief !== undefined, `gate=${last.wave35GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave35_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave35_integration_stress_scenario', 'Wave 35 integration stress keeps O10-202 gated under stress', !last.agent25Wave35ProjectionHandoffBrief!.shouldProjectWave35 || last.wave35IntegrationMonitor!.shouldRunO10m202DryRun, `project=${last.agent25Wave35ProjectionHandoffBrief?.shouldProjectWave35} o10m202=${last.wave35IntegrationMonitor?.shouldRunO10m202DryRun}`);
  }
  check(results, 'wave35_projection_stub_catalog', 'Round 35 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_wave35_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_o10m202_gate'), 'wave35_projection+o10m202_gate');
  check(results, 'wave35_scenario_registry', 'Round 35 scenarios registered', listAgent14ScenarioIds().includes('wave35_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave35_integration_stress'), '72 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 74, stateCapacityLoad: 22, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave36_gate_trajectory', 'Turn advance attaches wave 36 gate trajectory', adv.inputs.wave36GateTrajectory !== undefined && adv.wave36GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave36GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 68, stateCapacityLoad: 30, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave36_integration_monitor', 'Wave 36 integration monitor present', adv.inputs.wave36IntegrationMonitor !== undefined && adv.inputs.wave36IntegrationMonitor!.summary.length > 10, adv.inputs.wave36IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 79, stateCapacityLoad: 17, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave36_projection_handoff_brief', 'Agent 25 wave 36 projection handoff attached', adv.inputs.agent25Wave36ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave36ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave36ProjectionHandoffBrief?.shouldProjectWave36}`);
  }
  {
    const raw = sanitizeWave36GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave36GateEma: 11 });
    check(results, 'wave36_gate_sanitize', 'Wave 36 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave36GateEma === 11, `ema=${raw.wave36GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 72, stateCapacityLoad: 24, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave36 = composeAgent25Wave36ProjectionHandoffBrief({ turn: 14, wave36IntegrationMonitor: adv.inputs.wave36IntegrationMonitor!, wave36GateTrajectory: adv.inputs.wave36GateTrajectory });
    check(results, 'wave36_projection_composer', 'Standalone wave 36 projection composer returns headlines', wave36.headlines.length > 0 && wave36.summary.length > 10, wave36.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave35: true, shouldRunO10m202DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave36GateTrajectory(10, brief, createInitialWave36GateTrajectory());
    check(results, 'wave36_gate_advance_unit', 'Wave 36 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave36GateEma > 0, `ema=${snap.snapshot.wave36GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 70, stateCapacityLoad: 28, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave36IntegrationMonitor({ turn: 9, wave35ProjectionBrief: adv.inputs.agent25Wave35ProjectionHandoffBrief!, wave36GateTrajectory: adv.inputs.wave36GateTrajectory, wave35IntegrationMonitor: adv.inputs.wave35IntegrationMonitor! });
    check(results, 'wave36_integration_monitor_unit', 'Standalone wave 36 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave36_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave36_gate_arc_scenario', 'Wave 36 gate arc scenario attaches wave 36 chain', last.wave36GateTrajectory !== undefined && last.wave36IntegrationMonitor !== undefined && last.agent25Wave36ProjectionHandoffBrief !== undefined, `gate=${last.wave36GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave36_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave36_integration_stress_scenario', 'Wave 36 integration stress keeps O10-204 gated under stress', !last.agent25Wave36ProjectionHandoffBrief!.shouldProjectWave36 || last.wave36IntegrationMonitor!.shouldRunO10m204DryRun, `project=${last.agent25Wave36ProjectionHandoffBrief?.shouldProjectWave36} o10m204=${last.wave36IntegrationMonitor?.shouldRunO10m204DryRun}`);
  }
  check(results, 'wave36_projection_stub_catalog', 'Round 36 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_wave36_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m204_gate'), 'wave36_projection+o10m204_gate');
  check(results, 'wave36_scenario_registry', 'Round 36 scenarios registered', listAgent14ScenarioIds().includes('wave36_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave36_integration_stress'), '74 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 75, stateCapacityLoad: 21, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave37_gate_trajectory', 'Turn advance attaches wave 37 gate trajectory', adv.inputs.wave37GateTrajectory !== undefined && adv.wave37GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave37GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 69, stateCapacityLoad: 29, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave37_integration_monitor', 'Wave 37 integration monitor present', adv.inputs.wave37IntegrationMonitor !== undefined && adv.inputs.wave37IntegrationMonitor!.summary.length > 10, adv.inputs.wave37IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 80, stateCapacityLoad: 16, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave37_projection_handoff_brief', 'Agent 25 wave 37 projection handoff attached', adv.inputs.agent25Wave37ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave37ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave37ProjectionHandoffBrief?.shouldProjectWave37}`);
  }
  {
    const raw = sanitizeWave37GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave37GateEma: 10 });
    check(results, 'wave37_gate_sanitize', 'Wave 37 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave37GateEma === 10, `ema=${raw.wave37GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 73, stateCapacityLoad: 23, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave37 = composeAgent25Wave37ProjectionHandoffBrief({ turn: 14, wave37IntegrationMonitor: adv.inputs.wave37IntegrationMonitor!, wave37GateTrajectory: adv.inputs.wave37GateTrajectory });
    check(results, 'wave37_projection_composer', 'Standalone wave 37 projection composer returns headlines', wave37.headlines.length > 0 && wave37.summary.length > 10, wave37.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave36: true, shouldRunO10m204DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave37GateTrajectory(10, brief, createInitialWave37GateTrajectory());
    check(results, 'wave37_gate_advance_unit', 'Wave 37 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave37GateEma > 0, `ema=${snap.snapshot.wave37GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 71, stateCapacityLoad: 27, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave37IntegrationMonitor({ turn: 9, wave36ProjectionBrief: adv.inputs.agent25Wave36ProjectionHandoffBrief!, wave37GateTrajectory: adv.inputs.wave37GateTrajectory, wave36IntegrationMonitor: adv.inputs.wave36IntegrationMonitor! });
    check(results, 'wave37_integration_monitor_unit', 'Standalone wave 37 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave37_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave37_gate_arc_scenario', 'Wave 37 gate arc scenario attaches wave 37 chain', last.wave37GateTrajectory !== undefined && last.wave37IntegrationMonitor !== undefined && last.agent25Wave37ProjectionHandoffBrief !== undefined, `gate=${last.wave37GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave37_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave37_integration_stress_scenario', 'Wave 37 integration stress keeps O10-206 gated under stress', !last.agent25Wave37ProjectionHandoffBrief!.shouldProjectWave37 || last.wave37IntegrationMonitor!.shouldRunO10m206DryRun, `project=${last.agent25Wave37ProjectionHandoffBrief?.shouldProjectWave37} o10m206=${last.wave37IntegrationMonitor?.shouldRunO10m206DryRun}`);
  }
  check(results, 'wave37_projection_stub_catalog', 'Round 37 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_wave37_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m206_gate'), 'wave37_projection+o10m206_gate');
  check(results, 'wave37_scenario_registry', 'Round 37 scenarios registered', listAgent14ScenarioIds().includes('wave37_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave37_integration_stress'), '76 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 76, stateCapacityLoad: 20, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave38_gate_trajectory', 'Turn advance attaches wave 38 gate trajectory', adv.inputs.wave38GateTrajectory !== undefined && adv.wave38GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave38GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 70, stateCapacityLoad: 28, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave38_integration_monitor', 'Wave 38 integration monitor present', adv.inputs.wave38IntegrationMonitor !== undefined && adv.inputs.wave38IntegrationMonitor!.summary.length > 10, adv.inputs.wave38IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 81, stateCapacityLoad: 15, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave38_projection_handoff_brief', 'Agent 25 wave 38 projection handoff attached', adv.inputs.agent25Wave38ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave38ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave38ProjectionHandoffBrief?.shouldProjectWave38}`);
  }
  {
    const raw = sanitizeWave38GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave38GateEma: 9 });
    check(results, 'wave38_gate_sanitize', 'Wave 38 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave38GateEma === 9, `ema=${raw.wave38GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 74, stateCapacityLoad: 22, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave38 = composeAgent25Wave38ProjectionHandoffBrief({ turn: 14, wave38IntegrationMonitor: adv.inputs.wave38IntegrationMonitor!, wave38GateTrajectory: adv.inputs.wave38GateTrajectory });
    check(results, 'wave38_projection_composer', 'Standalone wave 38 projection composer returns headlines', wave38.headlines.length > 0 && wave38.summary.length > 10, wave38.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave37: true, shouldRunO10m206DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave38GateTrajectory(10, brief, createInitialWave38GateTrajectory());
    check(results, 'wave38_gate_advance_unit', 'Wave 38 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave38GateEma > 0, `ema=${snap.snapshot.wave38GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 72, stateCapacityLoad: 26, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave38IntegrationMonitor({ turn: 9, wave37ProjectionBrief: adv.inputs.agent25Wave37ProjectionHandoffBrief!, wave38GateTrajectory: adv.inputs.wave38GateTrajectory, wave37IntegrationMonitor: adv.inputs.wave37IntegrationMonitor! });
    check(results, 'wave38_integration_monitor_unit', 'Standalone wave 38 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave38_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave38_gate_arc_scenario', 'Wave 38 gate arc scenario attaches wave 38 chain', last.wave38GateTrajectory !== undefined && last.wave38IntegrationMonitor !== undefined && last.agent25Wave38ProjectionHandoffBrief !== undefined, `gate=${last.wave38GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave38_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave38_integration_stress_scenario', 'Wave 38 integration stress keeps O10-208 gated under stress', !last.agent25Wave38ProjectionHandoffBrief!.shouldProjectWave38 || last.wave38IntegrationMonitor!.shouldRunO10m208DryRun, `project=${last.agent25Wave38ProjectionHandoffBrief?.shouldProjectWave38} o10m208=${last.wave38IntegrationMonitor?.shouldRunO10m208DryRun}`);
  }
  check(results, 'wave38_projection_stub_catalog', 'Round 38 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave38_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_o10m208_gate'), 'wave38_projection+o10m208_gate');
  check(results, 'wave38_scenario_registry', 'Round 38 scenarios registered', listAgent14ScenarioIds().includes('wave38_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave38_integration_stress'), '78 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 77, stateCapacityLoad: 19, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave39_gate_trajectory', 'Turn advance attaches wave 39 gate trajectory', adv.inputs.wave39GateTrajectory !== undefined && adv.wave39GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave39GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 71, stateCapacityLoad: 27, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave39_integration_monitor', 'Wave 39 integration monitor present', adv.inputs.wave39IntegrationMonitor !== undefined && adv.inputs.wave39IntegrationMonitor!.summary.length > 10, adv.inputs.wave39IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 82, stateCapacityLoad: 14, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave39_projection_handoff_brief', 'Agent 25 wave 39 projection handoff attached', adv.inputs.agent25Wave39ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave39ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave39ProjectionHandoffBrief?.shouldProjectWave39}`);
  }
  {
    const raw = sanitizeWave39GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave39GateEma: 8 });
    check(results, 'wave39_gate_sanitize', 'Wave 39 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave39GateEma === 8, `ema=${raw.wave39GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 75, stateCapacityLoad: 21, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave39 = composeAgent25Wave39ProjectionHandoffBrief({ turn: 14, wave39IntegrationMonitor: adv.inputs.wave39IntegrationMonitor!, wave39GateTrajectory: adv.inputs.wave39GateTrajectory });
    check(results, 'wave39_projection_composer', 'Standalone wave 39 projection composer returns headlines', wave39.headlines.length > 0 && wave39.summary.length > 10, wave39.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave38: true, shouldRunO10m208DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave39GateTrajectory(10, brief, createInitialWave39GateTrajectory());
    check(results, 'wave39_gate_advance_unit', 'Wave 39 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave39GateEma > 0, `ema=${snap.snapshot.wave39GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 73, stateCapacityLoad: 25, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave39IntegrationMonitor({ turn: 9, wave38ProjectionBrief: adv.inputs.agent25Wave38ProjectionHandoffBrief!, wave39GateTrajectory: adv.inputs.wave39GateTrajectory, wave38IntegrationMonitor: adv.inputs.wave38IntegrationMonitor! });
    check(results, 'wave39_integration_monitor_unit', 'Standalone wave 39 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave39_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave39_gate_arc_scenario', 'Wave 39 gate arc scenario attaches wave 39 chain', last.wave39GateTrajectory !== undefined && last.wave39IntegrationMonitor !== undefined && last.agent25Wave39ProjectionHandoffBrief !== undefined, `gate=${last.wave39GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave39_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave39_integration_stress_scenario', 'Wave 39 integration stress keeps O10-210 gated under stress', !last.agent25Wave39ProjectionHandoffBrief!.shouldProjectWave39 || last.wave39IntegrationMonitor!.shouldRunO10m210DryRun, `project=${last.agent25Wave39ProjectionHandoffBrief?.shouldProjectWave39} o10m210=${last.wave39IntegrationMonitor?.shouldRunO10m210DryRun}`);
  }
  check(results, 'wave39_projection_stub_catalog', 'Round 39 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_wave39_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m210_gate'), 'wave39_projection+o10m210_gate');
  check(results, 'wave39_scenario_registry', 'Round 39 scenarios registered', listAgent14ScenarioIds().includes('wave39_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave39_integration_stress'), '80 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 78, stateCapacityLoad: 18, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave40_gate_trajectory', 'Turn advance attaches wave 40 gate trajectory', adv.inputs.wave40GateTrajectory !== undefined && adv.wave40GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave40GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 72, stateCapacityLoad: 26, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave40_integration_monitor', 'Wave 40 integration monitor present', adv.inputs.wave40IntegrationMonitor !== undefined && adv.inputs.wave40IntegrationMonitor!.summary.length > 10, adv.inputs.wave40IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 83, stateCapacityLoad: 13, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave40_projection_handoff_brief', 'Agent 25 wave 40 projection handoff attached', adv.inputs.agent25Wave40ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave40ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave40ProjectionHandoffBrief?.shouldProjectWave40}`);
  }
  {
    const raw = sanitizeWave40GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave40GateEma: 7 });
    check(results, 'wave40_gate_sanitize', 'Wave 40 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave40GateEma === 7, `ema=${raw.wave40GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 76, stateCapacityLoad: 20, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave40 = composeAgent25Wave40ProjectionHandoffBrief({ turn: 14, wave40IntegrationMonitor: adv.inputs.wave40IntegrationMonitor!, wave40GateTrajectory: adv.inputs.wave40GateTrajectory });
    check(results, 'wave40_projection_composer', 'Standalone wave 40 projection composer returns headlines', wave40.headlines.length > 0 && wave40.summary.length > 10, wave40.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave39: true, shouldRunO10m210DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave40GateTrajectory(10, brief, createInitialWave40GateTrajectory());
    check(results, 'wave40_gate_advance_unit', 'Wave 40 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave40GateEma > 0, `ema=${snap.snapshot.wave40GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 74, stateCapacityLoad: 24, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave40IntegrationMonitor({ turn: 9, wave39ProjectionBrief: adv.inputs.agent25Wave39ProjectionHandoffBrief!, wave40GateTrajectory: adv.inputs.wave40GateTrajectory, wave39IntegrationMonitor: adv.inputs.wave39IntegrationMonitor! });
    check(results, 'wave40_integration_monitor_unit', 'Standalone wave 40 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave40_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave40_gate_arc_scenario', 'Wave 40 gate arc scenario attaches wave 40 chain', last.wave40GateTrajectory !== undefined && last.wave40IntegrationMonitor !== undefined && last.agent25Wave40ProjectionHandoffBrief !== undefined, `gate=${last.wave40GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave40_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave40_integration_stress_scenario', 'Wave 40 integration stress keeps O10-212 gated under stress', !last.agent25Wave40ProjectionHandoffBrief!.shouldProjectWave40 || last.wave40IntegrationMonitor!.shouldRunO10m212DryRun, `project=${last.agent25Wave40ProjectionHandoffBrief?.shouldProjectWave40} o10m212=${last.wave40IntegrationMonitor?.shouldRunO10m212DryRun}`);
  }
  check(results, 'wave40_projection_stub_catalog', 'Round 40 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_wave40_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_o10m212_gate'), 'wave40_projection+o10m212_gate');
  check(results, 'wave40_scenario_registry', 'Round 40 scenarios registered', listAgent14ScenarioIds().includes('wave40_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave40_integration_stress'), '82 scenarios');

  {
    const adv = advancePublicServicesTurn({
      inputs: { turn: 12, fiscalHeadroom: 79, stateCapacityLoad: 17, workforceReadiness: 'balanced' },
      spendingPersisted: createInitialDelayedSpendingPersisted(),
    });
    check(results, 'wave41_gate_trajectory', 'Turn advance attaches wave 41 gate trajectory', adv.inputs.wave41GateTrajectory !== undefined && adv.wave41GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave41GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 73, stateCapacityLoad: 25, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave41_integration_monitor', 'Wave 41 integration monitor present', adv.inputs.wave41IntegrationMonitor !== undefined && adv.inputs.wave41IntegrationMonitor!.summary.length > 10, adv.inputs.wave41IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave41_projection_handoff_brief', 'Agent 25 wave 41 projection handoff attached', adv.inputs.agent25Wave41ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave41ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave41ProjectionHandoffBrief?.shouldProjectWave41}`);
  }
  {
    const raw = sanitizeWave41GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave41GateEma: 6 });
    check(results, 'wave41_gate_sanitize', 'Wave 41 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave41GateEma === 6, `ema=${raw.wave41GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 77, stateCapacityLoad: 19, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave41 = composeAgent25Wave41ProjectionHandoffBrief({ turn: 14, wave41IntegrationMonitor: adv.inputs.wave41IntegrationMonitor!, wave41GateTrajectory: adv.inputs.wave41GateTrajectory });
    check(results, 'wave41_projection_composer', 'Standalone wave 41 projection composer returns headlines', wave41.headlines.length > 0 && wave41.summary.length > 10, wave41.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave40: true, shouldRunO10m212DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave41GateTrajectory(10, brief, createInitialWave41GateTrajectory());
    check(results, 'wave41_gate_advance_unit', 'Wave 41 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave41GateEma > 0, `ema=${snap.snapshot.wave41GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 75, stateCapacityLoad: 23, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave41IntegrationMonitor({ turn: 9, wave40ProjectionBrief: adv.inputs.agent25Wave40ProjectionHandoffBrief!, wave41GateTrajectory: adv.inputs.wave41GateTrajectory, wave40IntegrationMonitor: adv.inputs.wave40IntegrationMonitor! });
    check(results, 'wave41_integration_monitor_unit', 'Standalone wave 41 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave41_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave41_gate_arc_scenario', 'Wave 41 gate arc scenario attaches wave 41 chain', last.wave41GateTrajectory !== undefined && last.wave41IntegrationMonitor !== undefined && last.agent25Wave41ProjectionHandoffBrief !== undefined, `gate=${last.wave41GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave41_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave41_integration_stress_scenario', 'Wave 41 integration stress keeps O10-214 gated under stress', !last.agent25Wave41ProjectionHandoffBrief!.shouldProjectWave41 || last.wave41IntegrationMonitor!.shouldRunO10m214DryRun, `project=${last.agent25Wave41ProjectionHandoffBrief?.shouldProjectWave41} o10m214=${last.wave41IntegrationMonitor?.shouldRunO10m214DryRun}`);
  }
  check(results, 'wave41_projection_stub_catalog', 'Round 41 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_wave41_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m214_gate'), 'wave41_projection+o10m214_gate');
  check(results, 'wave41_scenario_registry', 'Round 41 scenarios registered', listAgent14ScenarioIds().includes('wave41_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave41_integration_stress'), '84 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 12, fiscalHeadroom: 80, stateCapacityLoad: 16, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave42_gate_trajectory', 'Turn advance attaches wave 42 gate trajectory', adv.inputs.wave42GateTrajectory !== undefined && adv.wave42GateTrajectoryPersisted.lastTurn === 12, `band=${adv.inputs.wave42GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 74, stateCapacityLoad: 24, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave42_integration_monitor', 'Wave 42 integration monitor present', adv.inputs.wave42IntegrationMonitor !== undefined && adv.inputs.wave42IntegrationMonitor!.summary.length > 10, adv.inputs.wave42IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 85, stateCapacityLoad: 11, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave42_projection_handoff_brief', 'Agent 25 wave 42 projection handoff attached', adv.inputs.agent25Wave42ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave42ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave42ProjectionHandoffBrief?.shouldProjectWave42}`);
  }
  {
    const raw = sanitizeWave42GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave42GateEma: 5 });
    check(results, 'wave42_gate_sanitize', 'Wave 42 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave42GateEma === 5, `ema=${raw.wave42GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 78, stateCapacityLoad: 18, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave42 = composeAgent25Wave42ProjectionHandoffBrief({ turn: 14, wave42IntegrationMonitor: adv.inputs.wave42IntegrationMonitor!, wave42GateTrajectory: adv.inputs.wave42GateTrajectory });
    check(results, 'wave42_projection_composer', 'Standalone wave 42 projection composer returns headlines', wave42.headlines.length > 0 && wave42.summary.length > 10, wave42.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave41: true, shouldRunO10m214DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave42GateTrajectory(10, brief, createInitialWave42GateTrajectory());
    check(results, 'wave42_gate_advance_unit', 'Wave 42 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave42GateEma > 0, `ema=${snap.snapshot.wave42GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 76, stateCapacityLoad: 22, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave42IntegrationMonitor({ turn: 9, wave41ProjectionBrief: adv.inputs.agent25Wave41ProjectionHandoffBrief!, wave42GateTrajectory: adv.inputs.wave42GateTrajectory, wave41IntegrationMonitor: adv.inputs.wave41IntegrationMonitor! });
    check(results, 'wave42_integration_monitor_unit', 'Standalone wave 42 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave42_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave42_gate_arc_scenario', 'Wave 42 gate arc scenario attaches wave 42 chain', last.wave42GateTrajectory !== undefined && last.wave42IntegrationMonitor !== undefined && last.agent25Wave42ProjectionHandoffBrief !== undefined, `gate=${last.wave42GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave42_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave42_integration_stress_scenario', 'Wave 42 integration stress keeps O10-216 gated under stress', !last.agent25Wave42ProjectionHandoffBrief!.shouldProjectWave42 || last.wave42IntegrationMonitor!.shouldRunO10m216DryRun, `project=${last.agent25Wave42ProjectionHandoffBrief?.shouldProjectWave42} o10m216=${last.wave42IntegrationMonitor?.shouldRunO10m216DryRun}`);
  }
  check(results, 'wave42_projection_stub_catalog', 'Round 42 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_wave42_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m216_gate'), 'wave42_projection+o10m216_gate');
  check(results, 'wave42_scenario_registry', 'Round 42 scenarios registered', listAgent14ScenarioIds().includes('wave42_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave42_integration_stress'), '86 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 79, stateCapacityLoad: 17, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave43_gate_trajectory', 'Turn advance attaches wave 43 gate trajectory', adv.inputs.wave43GateTrajectory !== undefined && adv.wave43GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave43GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 77, stateCapacityLoad: 20, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave43_integration_monitor', 'Wave 43 integration monitor present', adv.inputs.wave43IntegrationMonitor !== undefined && adv.inputs.wave43IntegrationMonitor!.summary.length > 10, adv.inputs.wave43IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 80, stateCapacityLoad: 16, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave43_projection_handoff_brief', 'Agent 25 wave 43 projection handoff attached', adv.inputs.agent25Wave43ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave43ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave43ProjectionHandoffBrief?.shouldProjectWave43}`);
  }
  {
    const raw = sanitizeWave43GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave43GateEma: 4 });
    check(results, 'wave43_gate_sanitize', 'Wave 43 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave43GateEma === 4, `ema=${raw.wave43GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 78, stateCapacityLoad: 18, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave43 = composeAgent25Wave43ProjectionHandoffBrief({ turn: 14, wave43IntegrationMonitor: adv.inputs.wave43IntegrationMonitor!, wave43GateTrajectory: adv.inputs.wave43GateTrajectory });
    check(results, 'wave43_projection_composer', 'Standalone wave 43 projection composer returns headlines', wave43.headlines.length > 0 && wave43.summary.length > 10, wave43.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave42: true, shouldRunO10m216DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave43GateTrajectory(10, brief, createInitialWave43GateTrajectory());
    check(results, 'wave43_gate_advance_unit', 'Wave 43 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave43GateEma > 0, `ema=${snap.snapshot.wave43GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 76, stateCapacityLoad: 22, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave43IntegrationMonitor({ turn: 9, wave42ProjectionBrief: adv.inputs.agent25Wave42ProjectionHandoffBrief!, wave43GateTrajectory: adv.inputs.wave43GateTrajectory, wave42IntegrationMonitor: adv.inputs.wave42IntegrationMonitor! });
    check(results, 'wave43_integration_monitor_unit', 'Standalone wave 43 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave43_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave43_gate_arc_scenario', 'Wave 43 gate arc scenario attaches wave 43 chain', last.wave43GateTrajectory !== undefined && last.wave43IntegrationMonitor !== undefined && last.agent25Wave43ProjectionHandoffBrief !== undefined, `gate=${last.wave43GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave43_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave43_integration_stress_scenario', 'Wave 43 integration stress keeps O10-218 gated under stress', !last.agent25Wave43ProjectionHandoffBrief!.shouldProjectWave43 || last.wave43IntegrationMonitor!.shouldRunO10m218DryRun, `project=${last.agent25Wave43ProjectionHandoffBrief?.shouldProjectWave43} o10m218=${last.wave43IntegrationMonitor?.shouldRunO10m218DryRun}`);
  }
  check(results, 'wave43_projection_stub_catalog', 'Round 43 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave43_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_o10m218_gate'), 'wave43_projection+o10m218_gate');
  check(results, 'wave43_scenario_registry', 'Round 43 scenarios registered', listAgent14ScenarioIds().includes('wave43_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave43_integration_stress'), '88 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 80, stateCapacityLoad: 16, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave44_gate_trajectory', 'Turn advance attaches wave 44 gate trajectory', adv.inputs.wave44GateTrajectory !== undefined && adv.wave44GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave44GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 78, stateCapacityLoad: 19, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave44_integration_monitor', 'Wave 44 integration monitor present', adv.inputs.wave44IntegrationMonitor !== undefined && adv.inputs.wave44IntegrationMonitor!.summary.length > 10, adv.inputs.wave44IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 81, stateCapacityLoad: 15, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave44_projection_handoff_brief', 'Agent 25 wave 44 projection handoff attached', adv.inputs.agent25Wave44ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave44ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave44ProjectionHandoffBrief?.shouldProjectWave44}`);
  }
  {
    const raw = sanitizeWave44GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave44GateEma: 3 });
    check(results, 'wave44_gate_sanitize', 'Wave 44 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave44GateEma === 3, `ema=${raw.wave44GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 79, stateCapacityLoad: 17, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave44 = composeAgent25Wave44ProjectionHandoffBrief({ turn: 14, wave44IntegrationMonitor: adv.inputs.wave44IntegrationMonitor!, wave44GateTrajectory: adv.inputs.wave44GateTrajectory });
    check(results, 'wave44_projection_composer', 'Standalone wave 44 projection composer returns headlines', wave44.headlines.length > 0 && wave44.summary.length > 10, wave44.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave43: true, shouldRunO10m218DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave44GateTrajectory(10, brief, createInitialWave44GateTrajectory());
    check(results, 'wave44_gate_advance_unit', 'Wave 44 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave44GateEma > 0, `ema=${snap.snapshot.wave44GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 77, stateCapacityLoad: 21, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave44IntegrationMonitor({ turn: 9, wave43ProjectionBrief: adv.inputs.agent25Wave43ProjectionHandoffBrief!, wave44GateTrajectory: adv.inputs.wave44GateTrajectory, wave43IntegrationMonitor: adv.inputs.wave43IntegrationMonitor! });
    check(results, 'wave44_integration_monitor_unit', 'Standalone wave 44 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave44_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave44_gate_arc_scenario', 'Wave 44 gate arc scenario attaches wave 44 chain', last.wave44GateTrajectory !== undefined && last.wave44IntegrationMonitor !== undefined && last.agent25Wave44ProjectionHandoffBrief !== undefined, `gate=${last.wave44GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave44_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave44_integration_stress_scenario', 'Wave 44 integration stress keeps O10-220 gated under stress', !last.agent25Wave44ProjectionHandoffBrief!.shouldProjectWave44 || last.wave44IntegrationMonitor!.shouldRunO10m220DryRun, `project=${last.agent25Wave44ProjectionHandoffBrief?.shouldProjectWave44} o10m220=${last.wave44IntegrationMonitor?.shouldRunO10m220DryRun}`);
  }
  check(results, 'wave44_projection_stub_catalog', 'Round 44 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_wave44_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NT_o10m220_gate'), 'wave44_projection+o10m220_gate');
  check(results, 'wave44_scenario_registry', 'Round 44 scenarios registered', listAgent14ScenarioIds().includes('wave44_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave44_integration_stress'), '90 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 81, stateCapacityLoad: 15, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave45_gate_trajectory', 'Turn advance attaches wave 45 gate trajectory', adv.inputs.wave45GateTrajectory !== undefined && adv.wave45GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave45GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 79, stateCapacityLoad: 18, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave45_integration_monitor', 'Wave 45 integration monitor present', adv.inputs.wave45IntegrationMonitor !== undefined && adv.inputs.wave45IntegrationMonitor!.summary.length > 10, adv.inputs.wave45IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 82, stateCapacityLoad: 14, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave45_projection_handoff_brief', 'Agent 25 wave 45 projection handoff attached', adv.inputs.agent25Wave45ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave45ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave45ProjectionHandoffBrief?.shouldProjectWave45}`);
  }
  {
    const raw = sanitizeWave45GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave45GateEma: 2 });
    check(results, 'wave45_gate_sanitize', 'Wave 45 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave45GateEma === 2, `ema=${raw.wave45GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 80, stateCapacityLoad: 16, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave45 = composeAgent25Wave45ProjectionHandoffBrief({ turn: 14, wave45IntegrationMonitor: adv.inputs.wave45IntegrationMonitor!, wave45GateTrajectory: adv.inputs.wave45GateTrajectory });
    check(results, 'wave45_projection_composer', 'Standalone wave 45 projection composer returns headlines', wave45.headlines.length > 0 && wave45.summary.length > 10, wave45.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave44: true, shouldRunO10m220DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave45GateTrajectory(10, brief, createInitialWave45GateTrajectory());
    check(results, 'wave45_gate_advance_unit', 'Wave 45 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave45GateEma > 0, `ema=${snap.snapshot.wave45GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 78, stateCapacityLoad: 20, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave45IntegrationMonitor({ turn: 9, wave44ProjectionBrief: adv.inputs.agent25Wave44ProjectionHandoffBrief!, wave45GateTrajectory: adv.inputs.wave45GateTrajectory, wave44IntegrationMonitor: adv.inputs.wave44IntegrationMonitor! });
    check(results, 'wave45_integration_monitor_unit', 'Standalone wave 45 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave45_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave45_gate_arc_scenario', 'Wave 45 gate arc scenario attaches wave 45 chain', last.wave45GateTrajectory !== undefined && last.wave45IntegrationMonitor !== undefined && last.agent25Wave45ProjectionHandoffBrief !== undefined, `gate=${last.wave45GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave45_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave45_integration_stress_scenario', 'Wave 45 integration stress keeps O10-222 gated under stress', !last.agent25Wave45ProjectionHandoffBrief!.shouldProjectWave45 || last.wave45IntegrationMonitor!.shouldRunO10m222DryRun, `project=${last.agent25Wave45ProjectionHandoffBrief?.shouldProjectWave45} o10m222=${last.wave45IntegrationMonitor?.shouldRunO10m222DryRun}`);
  }
  check(results, 'wave45_projection_stub_catalog', 'Round 45 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_wave45_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_o10m222_gate'), 'wave45_projection+o10m222_gate');
  check(results, 'wave45_scenario_registry', 'Round 45 scenarios registered', listAgent14ScenarioIds().includes('wave45_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave45_integration_stress'), '92 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 82, stateCapacityLoad: 14, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave46_gate_trajectory', 'Turn advance attaches wave 46 gate trajectory', adv.inputs.wave46GateTrajectory !== undefined && adv.wave46GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave46GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 80, stateCapacityLoad: 17, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave46_integration_monitor', 'Wave 46 integration monitor present', adv.inputs.wave46IntegrationMonitor !== undefined && adv.inputs.wave46IntegrationMonitor!.summary.length > 10, adv.inputs.wave46IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 83, stateCapacityLoad: 13, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave46_projection_handoff_brief', 'Agent 25 wave 46 projection handoff attached', adv.inputs.agent25Wave46ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave46ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave46ProjectionHandoffBrief?.shouldProjectWave46}`);
  }
  {
    const raw = sanitizeWave46GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave46GateEma: 1 });
    check(results, 'wave46_gate_sanitize', 'Wave 46 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave46GateEma === 1, `ema=${raw.wave46GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 81, stateCapacityLoad: 15, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave46 = composeAgent25Wave46ProjectionHandoffBrief({ turn: 14, wave46IntegrationMonitor: adv.inputs.wave46IntegrationMonitor!, wave46GateTrajectory: adv.inputs.wave46GateTrajectory });
    check(results, 'wave46_projection_composer', 'Standalone wave 46 projection composer returns headlines', wave46.headlines.length > 0 && wave46.summary.length > 10, wave46.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave45: true, shouldRunO10m222DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave46GateTrajectory(10, brief, createInitialWave46GateTrajectory());
    check(results, 'wave46_gate_advance_unit', 'Wave 46 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave46GateEma > 0, `ema=${snap.snapshot.wave46GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 79, stateCapacityLoad: 19, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave46IntegrationMonitor({ turn: 9, wave45ProjectionBrief: adv.inputs.agent25Wave45ProjectionHandoffBrief!, wave46GateTrajectory: adv.inputs.wave46GateTrajectory, wave45IntegrationMonitor: adv.inputs.wave45IntegrationMonitor! });
    check(results, 'wave46_integration_monitor_unit', 'Standalone wave 46 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave46_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave46_gate_arc_scenario', 'Wave 46 gate arc scenario attaches wave 46 chain', last.wave46GateTrajectory !== undefined && last.wave46IntegrationMonitor !== undefined && last.agent25Wave46ProjectionHandoffBrief !== undefined, `gate=${last.wave46GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave46_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave46_integration_stress_scenario', 'Wave 46 integration stress keeps O10-224 gated under stress', !last.agent25Wave46ProjectionHandoffBrief!.shouldProjectWave46 || last.wave46IntegrationMonitor!.shouldRunO10m224DryRun, `project=${last.agent25Wave46ProjectionHandoffBrief?.shouldProjectWave46} o10m224=${last.wave46IntegrationMonitor?.shouldRunO10m224DryRun}`);
  }
  check(results, 'wave46_projection_stub_catalog', 'Round 46 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_NSW_wave46_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m224_gate'), 'wave46_projection+o10m224_gate');
  check(results, 'wave46_scenario_registry', 'Round 46 scenarios registered', listAgent14ScenarioIds().includes('wave46_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave46_integration_stress'), '94 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave47_gate_trajectory', 'Turn advance attaches wave 47 gate trajectory', adv.inputs.wave47GateTrajectory !== undefined && adv.wave47GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave47GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 81, stateCapacityLoad: 16, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave47_integration_monitor', 'Wave 47 integration monitor present', adv.inputs.wave47IntegrationMonitor !== undefined && adv.inputs.wave47IntegrationMonitor!.summary.length > 10, adv.inputs.wave47IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave47_projection_handoff_brief', 'Agent 25 wave 47 projection handoff attached', adv.inputs.agent25Wave47ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave47ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave47ProjectionHandoffBrief?.shouldProjectWave47}`);
  }
  {
    const raw = sanitizeWave47GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave47GateEma: 1 });
    check(results, 'wave47_gate_sanitize', 'Wave 47 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave47GateEma === 1, `ema=${raw.wave47GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 82, stateCapacityLoad: 14, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave47 = composeAgent25Wave47ProjectionHandoffBrief({ turn: 14, wave47IntegrationMonitor: adv.inputs.wave47IntegrationMonitor!, wave47GateTrajectory: adv.inputs.wave47GateTrajectory });
    check(results, 'wave47_projection_composer', 'Standalone wave 47 projection composer returns headlines', wave47.headlines.length > 0 && wave47.summary.length > 10, wave47.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave46: true, shouldRunO10m224DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave47GateTrajectory(10, brief, createInitialWave47GateTrajectory());
    check(results, 'wave47_gate_advance_unit', 'Wave 47 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave47GateEma > 0, `ema=${snap.snapshot.wave47GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 80, stateCapacityLoad: 18, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave47IntegrationMonitor({ turn: 9, wave46ProjectionBrief: adv.inputs.agent25Wave46ProjectionHandoffBrief!, wave47GateTrajectory: adv.inputs.wave47GateTrajectory, wave46IntegrationMonitor: adv.inputs.wave46IntegrationMonitor! });
    check(results, 'wave47_integration_monitor_unit', 'Standalone wave 47 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave47_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave47_gate_arc_scenario', 'Wave 47 gate arc scenario attaches wave 47 chain', last.wave47GateTrajectory !== undefined && last.wave47IntegrationMonitor !== undefined && last.agent25Wave47ProjectionHandoffBrief !== undefined, `gate=${last.wave47GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave47_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave47_integration_stress_scenario', 'Wave 47 integration stress keeps O10-225 gated under stress', !last.agent25Wave47ProjectionHandoffBrief!.shouldProjectWave47 || last.wave47IntegrationMonitor!.shouldRunO10m225DryRun, `project=${last.agent25Wave47ProjectionHandoffBrief?.shouldProjectWave47} o10m225=${last.wave47IntegrationMonitor?.shouldRunO10m225DryRun}`);
  }
  check(results, 'wave47_projection_stub_catalog', 'Round 47 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave47_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m225_gate'), 'wave47_projection+o10m225_gate');
  check(results, 'wave47_scenario_registry', 'Round 47 scenarios registered', listAgent14ScenarioIds().includes('wave47_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave47_integration_stress'), '96 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 85, stateCapacityLoad: 11, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave48_gate_trajectory', 'Turn advance attaches wave 48 gate trajectory', adv.inputs.wave48GateTrajectory !== undefined && adv.wave48GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave48GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 82, stateCapacityLoad: 15, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave48_integration_monitor', 'Wave 48 integration monitor present', adv.inputs.wave48IntegrationMonitor !== undefined && adv.inputs.wave48IntegrationMonitor!.summary.length > 10, adv.inputs.wave48IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 85, stateCapacityLoad: 11, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave48_projection_handoff_brief', 'Agent 25 wave 48 projection handoff attached', adv.inputs.agent25Wave48ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave48ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave48ProjectionHandoffBrief?.shouldProjectWave48}`);
  }
  {
    const raw = sanitizeWave48GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave48GateEma: 1 });
    check(results, 'wave48_gate_sanitize', 'Wave 48 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave48GateEma === 1, `ema=${raw.wave48GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 83, stateCapacityLoad: 13, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave48 = composeAgent25Wave48ProjectionHandoffBrief({ turn: 14, wave48IntegrationMonitor: adv.inputs.wave48IntegrationMonitor!, wave48GateTrajectory: adv.inputs.wave48GateTrajectory });
    check(results, 'wave48_projection_composer', 'Standalone wave 48 projection composer returns headlines', wave48.headlines.length > 0 && wave48.summary.length > 10, wave48.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave47: true, shouldRunO10m225DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave48GateTrajectory(10, brief, createInitialWave48GateTrajectory());
    check(results, 'wave48_gate_advance_unit', 'Wave 48 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave48GateEma > 0, `ema=${snap.snapshot.wave48GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 81, stateCapacityLoad: 17, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave48IntegrationMonitor({ turn: 9, wave47ProjectionBrief: adv.inputs.agent25Wave47ProjectionHandoffBrief!, wave48GateTrajectory: adv.inputs.wave48GateTrajectory, wave47IntegrationMonitor: adv.inputs.wave47IntegrationMonitor! });
    check(results, 'wave48_integration_monitor_unit', 'Standalone wave 48 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave48_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave48_gate_arc_scenario', 'Wave 48 gate arc scenario attaches wave 48 chain', last.wave48GateTrajectory !== undefined && last.wave48IntegrationMonitor !== undefined && last.agent25Wave48ProjectionHandoffBrief !== undefined, `gate=${last.wave48GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave48_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave48_integration_stress_scenario', 'Wave 48 integration stress keeps O10-226 gated under stress', !last.agent25Wave48ProjectionHandoffBrief!.shouldProjectWave48 || last.wave48IntegrationMonitor!.shouldRunO10m226DryRun, `project=${last.agent25Wave48ProjectionHandoffBrief?.shouldProjectWave48} o10m226=${last.wave48IntegrationMonitor?.shouldRunO10m226DryRun}`);
  }
  check(results, 'wave48_projection_stub_catalog', 'Round 48 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_VIC_wave48_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_SA_o10m226_gate'), 'wave48_projection+o10m226_gate');
  check(results, 'wave48_scenario_registry', 'Round 48 scenarios registered', listAgent14ScenarioIds().includes('wave48_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave48_integration_stress'), '98 scenarios');

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}


// OP10M_MODULE_END agent-14-housing
