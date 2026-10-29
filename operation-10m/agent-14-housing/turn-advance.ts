import { AGENT14_CORE_REGIONS, AGENT14_HOUSING_REGION_BASELINE } from './constants.ts';
import { advanceDelayedSpendingEffects, commitSpendingProgram } from './delayed-spending-effects.ts';
import { computeAllRegionalHousingPipelines } from './housing-delivery-pipeline.ts';
import { computeNationalHousingWellbeingSnapshot } from './national-wellbeing-snapshot.ts';
import { recommendAgent14ProgramSequence } from './program-sequencing.ts';
import { computeNationalServiceAccessLens } from './service-access-lens.ts';
import { computeCrossPillarCoupling } from './cross-pillar-coupling.ts';
import { advanceRegionalWellbeingMemory } from './regional-wellbeing-memory.ts';
import { evaluateAgent14WellbeingWarnings } from './wellbeing-guardian-warnings.ts';
import { advanceCouplingTrajectory } from './coupling-trajectory.ts';
import { adviseEquityRebalancing } from './equity-rebalancing-advisor.ts';
import { composeWellbeingAccountabilityScorecard } from './wellbeing-accountability-scorecard.ts';
import { advanceAccountabilityTrajectory } from './accountability-trajectory.ts';
import { buildWellbeingInterventionPriorityQueue } from './intervention-priority-queue.ts';
import { buildCapacityReliefSchedule } from './capacity-relief-scheduler.ts';
import { computeWellbeingResilienceIndex } from './wellbeing-resilience-index.ts';
import { advanceResilienceTrajectory } from './resilience-trajectory.ts';
import { composeWellbeingGovernancePanel } from './wellbeing-governance-panel.ts';
import { advanceGovernanceTrajectory } from './governance-trajectory.ts';
import { buildReliefDispatchPlan } from './relief-dispatch-planner.ts';
import { composeStakeholderCoordinationBrief } from './stakeholder-coordination-brief.ts';
import { advanceCoordinationTrajectory } from './coordination-trajectory.ts';
import { buildReliefExecutionMonitor } from './relief-execution-monitor.ts';
import { composePortfolioStabilizationBrief } from './portfolio-stabilization-brief.ts';
import { advanceStabilizationTrajectory } from './stabilization-trajectory.ts';
import { advanceReliefFulfillment } from './relief-fulfillment-tracker.ts';
import { composeWellbeingRecoveryReadinessBrief } from './wellbeing-recovery-readiness-brief.ts';
import { advanceReadinessTrajectory } from './readiness-trajectory.ts';
import { buildFulfillmentAgingMonitor } from './fulfillment-aging-monitor.ts';
import { buildPortfolioResumptionPlan } from './portfolio-resumption-plan.ts';
import { advanceResumptionTrajectory } from './resumption-trajectory.ts';
import { adviseCommitGating } from './commit-gating-advisor.ts';
import { composePortfolioHandoffBrief } from './portfolio-handoff-brief.ts';
import { advanceHandoffTrajectory } from './handoff-trajectory.ts';
import { buildGatedCommitSchedule } from './gated-commit-scheduler.ts';
import { composeWellbeingIntegrationHandoffBrief } from './wellbeing-integration-handoff-brief.ts';
import { advanceIntegrationTrajectory } from './integration-trajectory.ts';
import { buildScheduleReadinessMonitor } from './schedule-readiness-monitor.ts';
import { composeNationalWireInReadinessBrief } from './national-wire-in-readiness-brief.ts';
import { advanceWireInTrajectory } from './wire-in-trajectory.ts';
import { buildTurnBoundaryActivationMonitor } from './turn-boundary-activation-monitor.ts';
import { composeAgent25AssemblyHandoffBrief } from './agent25-assembly-handoff-brief.ts';
import { advanceAssemblyMergeTrajectory } from './assembly-merge-trajectory.ts';
import { buildChunkAnchorAlignmentMonitor } from './chunk-anchor-alignment-monitor.ts';
import { composeAgent25InlineReadinessBrief } from './agent25-inline-readiness-brief.ts';
import { advanceInlineMergeTrajectory } from './inline-merge-trajectory.ts';
import { buildInlineActivationMonitor } from './inline-activation-monitor.ts';
import { composeAgent25Wave17ProjectionHandoffBrief } from './agent25-wave17-projection-handoff-brief.ts';
import { advanceProjectionGateTrajectory } from './projection-gate-trajectory.ts';
import { buildWave18ProjectionMonitor } from './wave18-projection-monitor.ts';
import { composeAgent25Wave18ProjectionHandoffBrief } from './agent25-wave18-projection-handoff-brief.ts';
import { advanceWave19GateTrajectory } from './wave19-gate-trajectory.ts';
import { buildWave19IntegrationMonitor } from './wave19-integration-monitor.ts';
import { composeAgent25Wave19ProjectionHandoffBrief } from './agent25-wave19-projection-handoff-brief.ts';
import { advanceWave20GateTrajectory } from './wave20-gate-trajectory.ts';
import { buildWave20IntegrationMonitor } from './wave20-integration-monitor.ts';
import { composeAgent25Wave20ProjectionHandoffBrief } from './agent25-wave20-projection-handoff-brief.ts';
import { advanceWave21GateTrajectory } from './wave21-gate-trajectory.ts';
import { buildWave21IntegrationMonitor } from './wave21-integration-monitor.ts';
import { composeAgent25Wave21ProjectionHandoffBrief } from './agent25-wave21-projection-handoff-brief.ts';
import { advanceWave22GateTrajectory } from './wave22-gate-trajectory.ts';
import { buildWave22IntegrationMonitor } from './wave22-integration-monitor.ts';
import { composeAgent25Wave22ProjectionHandoffBrief } from './agent25-wave22-projection-handoff-brief.ts';
import { advanceWave23GateTrajectory } from './wave23-gate-trajectory.ts';
import { buildWave23IntegrationMonitor } from './wave23-integration-monitor.ts';
import { composeAgent25Wave23ProjectionHandoffBrief } from './agent25-wave23-projection-handoff-brief.ts';
import { advanceWave24GateTrajectory } from './wave24-gate-trajectory.ts';
import { buildWave24IntegrationMonitor } from './wave24-integration-monitor.ts';
import { composeAgent25Wave24ProjectionHandoffBrief } from './agent25-wave24-projection-handoff-brief.ts';
import { advanceWave25GateTrajectory } from './wave25-gate-trajectory.ts';
import { buildWave25IntegrationMonitor } from './wave25-integration-monitor.ts';
import { composeAgent25Wave25ProjectionHandoffBrief } from './agent25-wave25-projection-handoff-brief.ts';
import { advanceWave26GateTrajectory } from './wave26-gate-trajectory.ts';
import { buildWave26IntegrationMonitor } from './wave26-integration-monitor.ts';
import { composeAgent25Wave26ProjectionHandoffBrief } from './agent25-wave26-projection-handoff-brief.ts';
import { advanceWave27GateTrajectory } from './wave27-gate-trajectory.ts';
import { buildWave27IntegrationMonitor } from './wave27-integration-monitor.ts';
import { composeAgent25Wave27ProjectionHandoffBrief } from './agent25-wave27-projection-handoff-brief.ts';
import { advanceWave28GateTrajectory } from './wave28-gate-trajectory.ts';
import { buildWave28IntegrationMonitor } from './wave28-integration-monitor.ts';
import { composeAgent25Wave28ProjectionHandoffBrief } from './agent25-wave28-projection-handoff-brief.ts';
import { advanceWave29GateTrajectory } from './wave29-gate-trajectory.ts';
import { buildWave29IntegrationMonitor } from './wave29-integration-monitor.ts';
import { composeAgent25Wave29ProjectionHandoffBrief } from './agent25-wave29-projection-handoff-brief.ts';
import { advanceWave30GateTrajectory } from './wave30-gate-trajectory.ts';
import { buildWave30IntegrationMonitor } from './wave30-integration-monitor.ts';
import { composeAgent25Wave30ProjectionHandoffBrief } from './agent25-wave30-projection-handoff-brief.ts';
import { advanceWave31GateTrajectory } from './wave31-gate-trajectory.ts';
import { buildWave31IntegrationMonitor } from './wave31-integration-monitor.ts';
import { composeAgent25Wave31ProjectionHandoffBrief } from './agent25-wave31-projection-handoff-brief.ts';
import { advanceWave32GateTrajectory } from './wave32-gate-trajectory.ts';
import { buildWave32IntegrationMonitor } from './wave32-integration-monitor.ts';
import { composeAgent25Wave32ProjectionHandoffBrief } from './agent25-wave32-projection-handoff-brief.ts';
import { advanceWave33GateTrajectory } from './wave33-gate-trajectory.ts';
import { buildWave33IntegrationMonitor } from './wave33-integration-monitor.ts';
import { composeAgent25Wave33ProjectionHandoffBrief } from './agent25-wave33-projection-handoff-brief.ts';
import { advanceWave34GateTrajectory } from './wave34-gate-trajectory.ts';
import { buildWave34IntegrationMonitor } from './wave34-integration-monitor.ts';
import { composeAgent25Wave34ProjectionHandoffBrief } from './agent25-wave34-projection-handoff-brief.ts';
import { advanceWave35GateTrajectory } from './wave35-gate-trajectory.ts';
import { buildWave35IntegrationMonitor } from './wave35-integration-monitor.ts';
import { composeAgent25Wave35ProjectionHandoffBrief } from './agent25-wave35-projection-handoff-brief.ts';
import { advanceWave36GateTrajectory } from './wave36-gate-trajectory.ts';
import { buildWave36IntegrationMonitor } from './wave36-integration-monitor.ts';
import { composeAgent25Wave36ProjectionHandoffBrief } from './agent25-wave36-projection-handoff-brief.ts';
import { advanceWave37GateTrajectory } from './wave37-gate-trajectory.ts';
import { buildWave37IntegrationMonitor } from './wave37-integration-monitor.ts';
import { composeAgent25Wave37ProjectionHandoffBrief } from './agent25-wave37-projection-handoff-brief.ts';
import { advanceWave38GateTrajectory } from './wave38-gate-trajectory.ts';
import { buildWave38IntegrationMonitor } from './wave38-integration-monitor.ts';
import { composeAgent25Wave38ProjectionHandoffBrief } from './agent25-wave38-projection-handoff-brief.ts';
import { advanceWave39GateTrajectory } from './wave39-gate-trajectory.ts';
import { buildWave39IntegrationMonitor } from './wave39-integration-monitor.ts';
import { composeAgent25Wave39ProjectionHandoffBrief } from './agent25-wave39-projection-handoff-brief.ts';
import { advanceWave40GateTrajectory } from './wave40-gate-trajectory.ts';
import { buildWave40IntegrationMonitor } from './wave40-integration-monitor.ts';
import { composeAgent25Wave40ProjectionHandoffBrief } from './agent25-wave40-projection-handoff-brief.ts';
import { advanceWave41GateTrajectory } from './wave41-gate-trajectory.ts';
import { buildWave41IntegrationMonitor } from './wave41-integration-monitor.ts';
import { composeAgent25Wave41ProjectionHandoffBrief } from './agent25-wave41-projection-handoff-brief.ts';
import { advanceWave42GateTrajectory } from './wave42-gate-trajectory.ts';
import { buildWave42IntegrationMonitor } from './wave42-integration-monitor.ts';
import { composeAgent25Wave42ProjectionHandoffBrief } from './agent25-wave42-projection-handoff-brief.ts';
import { advanceWave43GateTrajectory } from './wave43-gate-trajectory.ts';
import { buildWave43IntegrationMonitor } from './wave43-integration-monitor.ts';
import { composeAgent25Wave43ProjectionHandoffBrief } from './agent25-wave43-projection-handoff-brief.ts';
import { advanceWave44GateTrajectory } from './wave44-gate-trajectory.ts';
import { buildWave44IntegrationMonitor } from './wave44-integration-monitor.ts';
import { composeAgent25Wave44ProjectionHandoffBrief } from './agent25-wave44-projection-handoff-brief.ts';
import { advanceWave45GateTrajectory } from './wave45-gate-trajectory.ts';
import { buildWave45IntegrationMonitor } from './wave45-integration-monitor.ts';
import { composeAgent25Wave45ProjectionHandoffBrief } from './agent25-wave45-projection-handoff-brief.ts';
import { composeAgent14WellbeingExecutiveBrief } from './wellbeing-executive-brief.ts';
import {
  canAcceptSpendingCommitment,
  computePublicServiceCapacity,
} from './public-service-capacity.ts';
import type {
  CapacityAndSpendingInputs,
  CouplingTrajectoryPersisted,
  AccountabilityTrajectoryPersisted,
  DelayedSpendingPersisted,
  EnrichedPublicServiceTurnInputs,
  RegionalWellbeingMemoryPersisted,
  ResilienceTrajectoryPersisted,
  GovernanceTrajectoryPersisted,
  CoordinationTrajectoryPersisted,
  StabilizationTrajectoryPersisted,
  ReliefFulfillmentPersisted,
  ReadinessTrajectoryPersisted,
  ResumptionTrajectoryPersisted,
  HandoffTrajectoryPersisted,
  IntegrationTrajectoryPersisted,
  WireInTrajectoryPersisted,
  AssemblyMergeTrajectoryPersisted,
  InlineMergeTrajectoryPersisted,
  ProjectionGateTrajectoryPersisted,
  Wave19GateTrajectoryPersisted,
  Wave20GateTrajectoryPersisted,
  Wave21GateTrajectoryPersisted,
  Wave22GateTrajectoryPersisted,
  Wave23GateTrajectoryPersisted,
  Wave24GateTrajectoryPersisted,
  Wave25GateTrajectoryPersisted,
  Wave26GateTrajectoryPersisted,
  Wave27GateTrajectoryPersisted,
  Wave28GateTrajectoryPersisted,
  Wave29GateTrajectoryPersisted,
  Wave30GateTrajectoryPersisted,
  Wave31GateTrajectoryPersisted,
  Wave32GateTrajectoryPersisted,
  Wave33GateTrajectoryPersisted,
  Wave34GateTrajectoryPersisted,
  Wave35GateTrajectoryPersisted,
  Wave36GateTrajectoryPersisted,
  Wave37GateTrajectoryPersisted,
  Wave38GateTrajectoryPersisted,
  Wave39GateTrajectoryPersisted,
  Wave40GateTrajectoryPersisted,
  Wave41GateTrajectoryPersisted,
  Wave42GateTrajectoryPersisted,
  Wave43GateTrajectoryPersisted,
  Wave44GateTrajectoryPersisted,
  Wave45GateTrajectoryPersisted,
  SpendingCommitment,
} from './types.ts';

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
    rejectedCommitments,
  };
}
