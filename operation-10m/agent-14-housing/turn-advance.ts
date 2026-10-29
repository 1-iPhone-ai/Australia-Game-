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
    rejectedCommitments,
  };
}
