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
    rejectedCommitments,
  };
}
