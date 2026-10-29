import type {
  AccountabilityTrajectorySnapshot,
  Agent14WellbeingAccountabilityScorecard,
  Agent14WellbeingExecutiveBrief,
  Agent14WellbeingWarningBundle,
  CrossPillarCouplingSnapshot,
  EquityRebalancingAdvice,
  ProgramSequencingRecommendation,
  WellbeingInterventionPriorityQueue,
  WellbeingResilienceSnapshot,
  WellbeingGovernancePanel,
  CapacityReliefSchedule,
  ResilienceTrajectorySnapshot,
  GovernanceTrajectorySnapshot,
  ReliefDispatchPlan,
  StakeholderCoordinationBrief,
  CoordinationTrajectorySnapshot,
  ReliefExecutionMonitor,
  PortfolioStabilizationBrief,
  StabilizationTrajectorySnapshot,
  ReliefFulfillmentSnapshot,
  WellbeingRecoveryReadinessBrief,
  ReadinessTrajectorySnapshot,
  FulfillmentAgingMonitor,
  PortfolioResumptionPlan,
  ResumptionTrajectorySnapshot,
  CommitGatingAdvice,
  PortfolioHandoffBrief,
  WellbeingTurnForecastPoint,
} from './types.ts';

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
