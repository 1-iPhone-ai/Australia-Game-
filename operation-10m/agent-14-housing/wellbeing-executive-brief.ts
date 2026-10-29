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
  HandoffTrajectorySnapshot,
  GatedCommitSchedule,
  WellbeingIntegrationHandoffBrief,
  IntegrationTrajectorySnapshot,
  ScheduleReadinessMonitor,
  NationalWireInReadinessBrief,
  WireInTrajectorySnapshot,
  TurnBoundaryActivationMonitor,
  Agent25AssemblyHandoffBrief,
  AssemblyMergeTrajectorySnapshot,
  ChunkAnchorAlignmentMonitor,
  Agent25InlineReadinessBrief,
  InlineMergeTrajectorySnapshot,
  InlineActivationMonitor,
  Agent25Wave17ProjectionHandoffBrief,
  ProjectionGateTrajectorySnapshot,
  Wave18ProjectionMonitor,
  Agent25Wave18ProjectionHandoffBrief,
  Wave19GateTrajectorySnapshot,
  Wave19IntegrationMonitor,
  Agent25Wave19ProjectionHandoffBrief,
  Wave20GateTrajectorySnapshot,
  Wave20IntegrationMonitor,
  Agent25Wave20ProjectionHandoffBrief,
  Wave21GateTrajectorySnapshot,
  Wave21IntegrationMonitor,
  Agent25Wave21ProjectionHandoffBrief,
  Wave22GateTrajectorySnapshot,
  Wave22IntegrationMonitor,
  Agent25Wave22ProjectionHandoffBrief,
  Wave23GateTrajectorySnapshot,
  Wave23IntegrationMonitor,
  Agent25Wave23ProjectionHandoffBrief,
  Wave24GateTrajectorySnapshot,
  Wave24IntegrationMonitor,
  Agent25Wave24ProjectionHandoffBrief,
  Wave25GateTrajectorySnapshot,
  Wave25IntegrationMonitor,
  Agent25Wave25ProjectionHandoffBrief,
  Wave26GateTrajectorySnapshot,
  Wave26IntegrationMonitor,
  Agent25Wave26ProjectionHandoffBrief,
  Wave27GateTrajectorySnapshot,
  Wave27IntegrationMonitor,
  Agent25Wave27ProjectionHandoffBrief,
  Wave28GateTrajectorySnapshot,
  Wave28IntegrationMonitor,
  Agent25Wave28ProjectionHandoffBrief,
  Wave29GateTrajectorySnapshot,
  Wave29IntegrationMonitor,
  Agent25Wave29ProjectionHandoffBrief,
  Wave30GateTrajectorySnapshot,
  Wave30IntegrationMonitor,
  Agent25Wave30ProjectionHandoffBrief,
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
