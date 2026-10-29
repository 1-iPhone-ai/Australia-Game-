import {
  advanceDelayedSpendingEffects,
  commitSpendingProgram,
  createInitialDelayedSpendingPersisted,
  makeSpendingCommitment,
  sanitizeDelayedSpendingPersisted,
} from './delayed-spending-effects.ts';
import {
  canAcceptSpendingCommitment,
  computeFiscalAbsorptionCap,
  computeNationalProgramSlots,
  computePublicServiceCapacity,
} from './public-service-capacity.ts';
import { advancePublicServicesTurn } from './turn-advance.ts';
import { AGENT14_CORE_REGIONS, AGENT14_HOUSING_PROGRAM_STUBS, AGENT14_HOUSING_REGION_BASELINE } from './constants.ts';
import { computeAllRegionalHousingPipelines } from './housing-delivery-pipeline.ts';
import { computeNationalHousingWellbeingSnapshot } from './national-wellbeing-snapshot.ts';
import {
  commitmentFromProgramStub,
  runAgent14HousingScenarioSweep,
  simulateAgent14HousingScenario,
} from './scenario-sweep.ts';
import { computeNationalServiceAccessLens } from './service-access-lens.ts';
import { evaluateAgent14WellbeingWarnings } from './wellbeing-guardian-warnings.ts';
import { recommendAgent14ProgramSequence } from './program-sequencing.ts';
import { computeCrossPillarCoupling } from './cross-pillar-coupling.ts';
import {
  advanceRegionalWellbeingMemory,
  createInitialRegionalWellbeingMemory,
  sanitizeRegionalWellbeingMemory,
} from './regional-wellbeing-memory.ts';
import { composeAgent14WellbeingExecutiveBrief } from './wellbeing-executive-brief.ts';
import { forecastAgent14WellbeingTurns, forecastFromInputs, listAgent14ScenarioIds } from './wellbeing-forecast.ts';
import { AGENT14_HEALTH_ED_PROGRAM_STUBS } from './constants.ts';
import { advanceCouplingTrajectory, createInitialCouplingTrajectory, sanitizeCouplingTrajectory } from './coupling-trajectory.ts';
import { composeWellbeingAccountabilityScorecard } from './wellbeing-accountability-scorecard.ts';
import { adviseEquityRebalancing } from './equity-rebalancing-advisor.ts';
import {
  advanceAccountabilityTrajectory,
  createInitialAccountabilityTrajectory,
  sanitizeAccountabilityTrajectory,
} from './accountability-trajectory.ts';
import { buildWellbeingInterventionPriorityQueue } from './intervention-priority-queue.ts';
import { computeWellbeingResilienceIndex } from './wellbeing-resilience-index.ts';
import {
  advanceResilienceTrajectory,
  createInitialResilienceTrajectory,
  sanitizeResilienceTrajectory,
} from './resilience-trajectory.ts';
import { buildCapacityReliefSchedule } from './capacity-relief-scheduler.ts';
import { composeWellbeingGovernancePanel } from './wellbeing-governance-panel.ts';
import {
  advanceGovernanceTrajectory,
  createInitialGovernanceTrajectory,
  sanitizeGovernanceTrajectory,
} from './governance-trajectory.ts';
import { buildReliefDispatchPlan } from './relief-dispatch-planner.ts';
import { composeStakeholderCoordinationBrief } from './stakeholder-coordination-brief.ts';
import {
  advanceCoordinationTrajectory,
  createInitialCoordinationTrajectory,
  sanitizeCoordinationTrajectory,
} from './coordination-trajectory.ts';
import { buildReliefExecutionMonitor } from './relief-execution-monitor.ts';
import { composePortfolioStabilizationBrief } from './portfolio-stabilization-brief.ts';
import {
  advanceStabilizationTrajectory,
  createInitialStabilizationTrajectory,
  sanitizeStabilizationTrajectory,
} from './stabilization-trajectory.ts';
import {
  advanceReliefFulfillment,
  createInitialReliefFulfillment,
  sanitizeReliefFulfillment,
} from './relief-fulfillment-tracker.ts';
import { composeWellbeingRecoveryReadinessBrief } from './wellbeing-recovery-readiness-brief.ts';
import {
  advanceReadinessTrajectory,
  createInitialReadinessTrajectory,
  sanitizeReadinessTrajectory,
} from './readiness-trajectory.ts';
import { buildFulfillmentAgingMonitor } from './fulfillment-aging-monitor.ts';
import { buildPortfolioResumptionPlan } from './portfolio-resumption-plan.ts';
import {
  advanceResumptionTrajectory,
  createInitialResumptionTrajectory,
  sanitizeResumptionTrajectory,
} from './resumption-trajectory.ts';
import { adviseCommitGating } from './commit-gating-advisor.ts';
import { composePortfolioHandoffBrief } from './portfolio-handoff-brief.ts';
import {
  advanceHandoffTrajectory,
  createInitialHandoffTrajectory,
  sanitizeHandoffTrajectory,
} from './handoff-trajectory.ts';
import { buildGatedCommitSchedule } from './gated-commit-scheduler.ts';
import { composeWellbeingIntegrationHandoffBrief } from './wellbeing-integration-handoff-brief.ts';
import {
  advanceIntegrationTrajectory,
  createInitialIntegrationTrajectory,
  sanitizeIntegrationTrajectory,
} from './integration-trajectory.ts';
import { buildScheduleReadinessMonitor } from './schedule-readiness-monitor.ts';
import { composeNationalWireInReadinessBrief } from './national-wire-in-readiness-brief.ts';
import {
  advanceWireInTrajectory,
  createInitialWireInTrajectory,
  sanitizeWireInTrajectory,
} from './wire-in-trajectory.ts';
import { buildTurnBoundaryActivationMonitor } from './turn-boundary-activation-monitor.ts';
import { composeAgent25AssemblyHandoffBrief } from './agent25-assembly-handoff-brief.ts';
import {
  advanceAssemblyMergeTrajectory,
  createInitialAssemblyMergeTrajectory,
  sanitizeAssemblyMergeTrajectory,
} from './assembly-merge-trajectory.ts';
import { buildChunkAnchorAlignmentMonitor } from './chunk-anchor-alignment-monitor.ts';
import { composeAgent25InlineReadinessBrief } from './agent25-inline-readiness-brief.ts';
import {
  advanceInlineMergeTrajectory,
  createInitialInlineMergeTrajectory,
  sanitizeInlineMergeTrajectory,
} from './inline-merge-trajectory.ts';
import { buildInlineActivationMonitor } from './inline-activation-monitor.ts';
import { composeAgent25Wave17ProjectionHandoffBrief } from './agent25-wave17-projection-handoff-brief.ts';
import {
  advanceProjectionGateTrajectory,
  createInitialProjectionGateTrajectory,
  sanitizeProjectionGateTrajectory,
} from './projection-gate-trajectory.ts';
import { buildWave18ProjectionMonitor } from './wave18-projection-monitor.ts';
import { composeAgent25Wave18ProjectionHandoffBrief } from './agent25-wave18-projection-handoff-brief.ts';
import {
  advanceWave19GateTrajectory,
  createInitialWave19GateTrajectory,
  sanitizeWave19GateTrajectory,
} from './wave19-gate-trajectory.ts';
import { buildWave19IntegrationMonitor } from './wave19-integration-monitor.ts';
import { composeAgent25Wave19ProjectionHandoffBrief } from './agent25-wave19-projection-handoff-brief.ts';
import {
  advanceWave20GateTrajectory,
  createInitialWave20GateTrajectory,
  sanitizeWave20GateTrajectory,
} from './wave20-gate-trajectory.ts';
import { buildWave20IntegrationMonitor } from './wave20-integration-monitor.ts';
import { composeAgent25Wave20ProjectionHandoffBrief } from './agent25-wave20-projection-handoff-brief.ts';
import {
  advanceWave21GateTrajectory,
  createInitialWave21GateTrajectory,
  sanitizeWave21GateTrajectory,
} from './wave21-gate-trajectory.ts';
import { buildWave21IntegrationMonitor } from './wave21-integration-monitor.ts';
import { composeAgent25Wave21ProjectionHandoffBrief } from './agent25-wave21-projection-handoff-brief.ts';
import {
  advanceWave22GateTrajectory,
  createInitialWave22GateTrajectory,
  sanitizeWave22GateTrajectory,
} from './wave22-gate-trajectory.ts';
import { buildWave22IntegrationMonitor } from './wave22-integration-monitor.ts';
import { composeAgent25Wave22ProjectionHandoffBrief } from './agent25-wave22-projection-handoff-brief.ts';
import {
  advanceWave23GateTrajectory,
  createInitialWave23GateTrajectory,
  sanitizeWave23GateTrajectory,
} from './wave23-gate-trajectory.ts';
import { buildWave23IntegrationMonitor } from './wave23-integration-monitor.ts';
import { composeAgent25Wave23ProjectionHandoffBrief } from './agent25-wave23-projection-handoff-brief.ts';
import {
  advanceWave24GateTrajectory,
  createInitialWave24GateTrajectory,
  sanitizeWave24GateTrajectory,
} from './wave24-gate-trajectory.ts';
import { buildWave24IntegrationMonitor } from './wave24-integration-monitor.ts';
import { composeAgent25Wave24ProjectionHandoffBrief } from './agent25-wave24-projection-handoff-brief.ts';
import {
  advanceWave25GateTrajectory,
  createInitialWave25GateTrajectory,
  sanitizeWave25GateTrajectory,
} from './wave25-gate-trajectory.ts';
import { buildWave25IntegrationMonitor } from './wave25-integration-monitor.ts';
import { composeAgent25Wave25ProjectionHandoffBrief } from './agent25-wave25-projection-handoff-brief.ts';
import {
  advanceWave26GateTrajectory,
  createInitialWave26GateTrajectory,
  sanitizeWave26GateTrajectory,
} from './wave26-gate-trajectory.ts';
import { buildWave26IntegrationMonitor } from './wave26-integration-monitor.ts';
import { composeAgent25Wave26ProjectionHandoffBrief } from './agent25-wave26-projection-handoff-brief.ts';
import {
  advanceWave27GateTrajectory,
  createInitialWave27GateTrajectory,
  sanitizeWave27GateTrajectory,
} from './wave27-gate-trajectory.ts';
import { buildWave27IntegrationMonitor } from './wave27-integration-monitor.ts';
import { composeAgent25Wave27ProjectionHandoffBrief } from './agent25-wave27-projection-handoff-brief.ts';
import {
  advanceWave28GateTrajectory,
  createInitialWave28GateTrajectory,
  sanitizeWave28GateTrajectory,
} from './wave28-gate-trajectory.ts';
import { buildWave28IntegrationMonitor } from './wave28-integration-monitor.ts';
import { composeAgent25Wave28ProjectionHandoffBrief } from './agent25-wave28-projection-handoff-brief.ts';
import {
  advanceWave29GateTrajectory,
  createInitialWave29GateTrajectory,
  sanitizeWave29GateTrajectory,
} from './wave29-gate-trajectory.ts';
import { buildWave29IntegrationMonitor } from './wave29-integration-monitor.ts';
import { composeAgent25Wave29ProjectionHandoffBrief } from './agent25-wave29-projection-handoff-brief.ts';
import {
  advanceWave30GateTrajectory,
  createInitialWave30GateTrajectory,
  sanitizeWave30GateTrajectory,
} from './wave30-gate-trajectory.ts';
import { buildWave30IntegrationMonitor } from './wave30-integration-monitor.ts';
import { composeAgent25Wave30ProjectionHandoffBrief } from './agent25-wave30-projection-handoff-brief.ts';
import {
  advanceWave31GateTrajectory,
  createInitialWave31GateTrajectory,
  sanitizeWave31GateTrajectory,
} from './wave31-gate-trajectory.ts';
import { buildWave31IntegrationMonitor } from './wave31-integration-monitor.ts';
import { composeAgent25Wave31ProjectionHandoffBrief } from './agent25-wave31-projection-handoff-brief.ts';
import {
  advanceWave32GateTrajectory,
  createInitialWave32GateTrajectory,
  sanitizeWave32GateTrajectory,
} from './wave32-gate-trajectory.ts';
import { buildWave32IntegrationMonitor } from './wave32-integration-monitor.ts';
import { composeAgent25Wave32ProjectionHandoffBrief } from './agent25-wave32-projection-handoff-brief.ts';
import {
  advanceWave33GateTrajectory,
  createInitialWave33GateTrajectory,
  sanitizeWave33GateTrajectory,
} from './wave33-gate-trajectory.ts';
import { buildWave33IntegrationMonitor } from './wave33-integration-monitor.ts';
import { composeAgent25Wave33ProjectionHandoffBrief } from './agent25-wave33-projection-handoff-brief.ts';
import {
  advanceWave34GateTrajectory,
  createInitialWave34GateTrajectory,
  sanitizeWave34GateTrajectory,
} from './wave34-gate-trajectory.ts';
import { buildWave34IntegrationMonitor } from './wave34-integration-monitor.ts';
import { composeAgent25Wave34ProjectionHandoffBrief } from './agent25-wave34-projection-handoff-brief.ts';
import {
  advanceWave35GateTrajectory,
  createInitialWave35GateTrajectory,
  sanitizeWave35GateTrajectory,
} from './wave35-gate-trajectory.ts';
import { buildWave35IntegrationMonitor } from './wave35-integration-monitor.ts';
import { composeAgent25Wave35ProjectionHandoffBrief } from './agent25-wave35-projection-handoff-brief.ts';
import {
  advanceWave36GateTrajectory,
  createInitialWave36GateTrajectory,
  sanitizeWave36GateTrajectory,
} from './wave36-gate-trajectory.ts';
import { buildWave36IntegrationMonitor } from './wave36-integration-monitor.ts';
import { composeAgent25Wave36ProjectionHandoffBrief } from './agent25-wave36-projection-handoff-brief.ts';
import {
  advanceWave37GateTrajectory,
  createInitialWave37GateTrajectory,
  sanitizeWave37GateTrajectory,
} from './wave37-gate-trajectory.ts';
import { buildWave37IntegrationMonitor } from './wave37-integration-monitor.ts';
import { composeAgent25Wave37ProjectionHandoffBrief } from './agent25-wave37-projection-handoff-brief.ts';
import {
  advanceWave38GateTrajectory,
  createInitialWave38GateTrajectory,
  sanitizeWave38GateTrajectory,
} from './wave38-gate-trajectory.ts';
import { buildWave38IntegrationMonitor } from './wave38-integration-monitor.ts';
import { composeAgent25Wave38ProjectionHandoffBrief } from './agent25-wave38-projection-handoff-brief.ts';
import {
  advanceWave39GateTrajectory,
  createInitialWave39GateTrajectory,
  sanitizeWave39GateTrajectory,
} from './wave39-gate-trajectory.ts';
import { buildWave39IntegrationMonitor } from './wave39-integration-monitor.ts';
import { composeAgent25Wave39ProjectionHandoffBrief } from './agent25-wave39-projection-handoff-brief.ts';
import {
  advanceWave40GateTrajectory,
  createInitialWave40GateTrajectory,
  sanitizeWave40GateTrajectory,
} from './wave40-gate-trajectory.ts';
import { buildWave40IntegrationMonitor } from './wave40-integration-monitor.ts';
import { composeAgent25Wave40ProjectionHandoffBrief } from './agent25-wave40-projection-handoff-brief.ts';
import {
  advanceWave41GateTrajectory,
  createInitialWave41GateTrajectory,
  sanitizeWave41GateTrajectory,
} from './wave41-gate-trajectory.ts';
import { buildWave41IntegrationMonitor } from './wave41-integration-monitor.ts';
import { composeAgent25Wave41ProjectionHandoffBrief } from './agent25-wave41-projection-handoff-brief.ts';
import {
  advanceWave42GateTrajectory,
  createInitialWave42GateTrajectory,
  sanitizeWave42GateTrajectory,
} from './wave42-gate-trajectory.ts';
import { buildWave42IntegrationMonitor } from './wave42-integration-monitor.ts';
import { composeAgent25Wave42ProjectionHandoffBrief } from './agent25-wave42-projection-handoff-brief.ts';
import {
  advanceWave43GateTrajectory,
  createInitialWave43GateTrajectory,
  sanitizeWave43GateTrajectory,
} from './wave43-gate-trajectory.ts';
import { buildWave43IntegrationMonitor } from './wave43-integration-monitor.ts';
import { composeAgent25Wave43ProjectionHandoffBrief } from './agent25-wave43-projection-handoff-brief.ts';
import {
  advanceWave44GateTrajectory,
  createInitialWave44GateTrajectory,
  sanitizeWave44GateTrajectory,
} from './wave44-gate-trajectory.ts';
import { buildWave44IntegrationMonitor } from './wave44-integration-monitor.ts';
import { composeAgent25Wave44ProjectionHandoffBrief } from './agent25-wave44-projection-handoff-brief.ts';
import {
  advanceWave45GateTrajectory,
  createInitialWave45GateTrajectory,
  sanitizeWave45GateTrajectory,
} from './wave45-gate-trajectory.ts';
import { buildWave45IntegrationMonitor } from './wave45-integration-monitor.ts';
import { composeAgent25Wave45ProjectionHandoffBrief } from './agent25-wave45-projection-handoff-brief.ts';
import {
  advanceWave46GateTrajectory,
  createInitialWave46GateTrajectory,
  sanitizeWave46GateTrajectory,
} from './wave46-gate-trajectory.ts';
import { buildWave46IntegrationMonitor } from './wave46-integration-monitor.ts';
import { composeAgent25Wave46ProjectionHandoffBrief } from './agent25-wave46-projection-handoff-brief.ts';
import {
  advanceWave47GateTrajectory,
  createInitialWave47GateTrajectory,
  sanitizeWave47GateTrajectory,
} from './wave47-gate-trajectory.ts';
import { buildWave47IntegrationMonitor } from './wave47-integration-monitor.ts';
import { composeAgent25Wave47ProjectionHandoffBrief } from './agent25-wave47-projection-handoff-brief.ts';
import {
  advanceWave48GateTrajectory,
  createInitialWave48GateTrajectory,
  sanitizeWave48GateTrajectory,
} from './wave48-gate-trajectory.ts';
import { buildWave48IntegrationMonitor } from './wave48-integration-monitor.ts';
import { composeAgent25Wave48ProjectionHandoffBrief } from './agent25-wave48-projection-handoff-brief.ts';
import {
  advanceWave49GateTrajectory,
  createInitialWave49GateTrajectory,
  sanitizeWave49GateTrajectory,
} from './wave49-gate-trajectory.ts';
import { buildWave49IntegrationMonitor } from './wave49-integration-monitor.ts';
import { composeAgent25Wave49ProjectionHandoffBrief } from './agent25-wave49-projection-handoff-brief.ts';
import {
  advanceWave50GateTrajectory,
  createInitialWave50GateTrajectory,
  sanitizeWave50GateTrajectory,
} from './wave50-gate-trajectory.ts';
import { buildWave50IntegrationMonitor } from './wave50-integration-monitor.ts';
import { composeAgent25Wave50ProjectionHandoffBrief } from './agent25-wave50-projection-handoff-brief.ts';
import {
  advanceWave51GateTrajectory,
  createInitialWave51GateTrajectory,
  sanitizeWave51GateTrajectory,
} from './wave51-gate-trajectory.ts';
import { buildWave51IntegrationMonitor } from './wave51-integration-monitor.ts';
import { composeAgent25Wave51ProjectionHandoffBrief } from './agent25-wave51-projection-handoff-brief.ts';
import {
  advanceWave52GateTrajectory,
  createInitialWave52GateTrajectory,
  sanitizeWave52GateTrajectory,
} from './wave52-gate-trajectory.ts';
import { buildWave52IntegrationMonitor } from './wave52-integration-monitor.ts';
import { composeAgent25Wave52ProjectionHandoffBrief } from './agent25-wave52-projection-handoff-brief.ts';
import {
  advanceWave53GateTrajectory,
  createInitialWave53GateTrajectory,
  sanitizeWave53GateTrajectory,
} from './wave53-gate-trajectory.ts';
import { buildWave53IntegrationMonitor } from './wave53-integration-monitor.ts';
import { composeAgent25Wave53ProjectionHandoffBrief } from './agent25-wave53-projection-handoff-brief.ts';
import {
  advanceWave54GateTrajectory,
  createInitialWave54GateTrajectory,
  sanitizeWave54GateTrajectory,
} from './wave54-gate-trajectory.ts';
import { buildWave54IntegrationMonitor } from './wave54-integration-monitor.ts';
import { composeAgent25Wave54ProjectionHandoffBrief } from './agent25-wave54-projection-handoff-brief.ts';
import {
  advanceWave55GateTrajectory,
  createInitialWave55GateTrajectory,
  sanitizeWave55GateTrajectory,
} from './wave55-gate-trajectory.ts';
import { buildWave55IntegrationMonitor } from './wave55-integration-monitor.ts';
import { composeAgent25Wave55ProjectionHandoffBrief } from './agent25-wave55-projection-handoff-brief.ts';
import { AGENT14_WELLBEING_SCHEMA_VERSION } from './types.ts';

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
    'One hundred twelve housing scenarios registered',
    listAgent14ScenarioIds().length === 112,
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
    AGENT14_WELLBEING_SCHEMA_VERSION === '10.14.55-scale-wave-55',
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

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave49_gate_trajectory', 'Turn advance attaches wave 49 gate trajectory', adv.inputs.wave49GateTrajectory !== undefined && adv.wave49GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave49GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 83, stateCapacityLoad: 14, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave49_integration_monitor', 'Wave 49 integration monitor present', adv.inputs.wave49IntegrationMonitor !== undefined && adv.inputs.wave49IntegrationMonitor!.summary.length > 10, adv.inputs.wave49IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave49_projection_handoff_brief', 'Agent 25 wave 49 projection handoff attached', adv.inputs.agent25Wave49ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave49ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave49ProjectionHandoffBrief?.shouldProjectWave49}`);
  }
  {
    const raw = sanitizeWave49GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave49GateEma: 1 });
    check(results, 'wave49_gate_sanitize', 'Wave 49 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave49GateEma === 1, `ema=${raw.wave49GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave49 = composeAgent25Wave49ProjectionHandoffBrief({ turn: 14, wave49IntegrationMonitor: adv.inputs.wave49IntegrationMonitor!, wave49GateTrajectory: adv.inputs.wave49GateTrajectory });
    check(results, 'wave49_projection_composer', 'Standalone wave 49 projection composer returns headlines', wave49.headlines.length > 0 && wave49.summary.length > 10, wave49.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave48: true, shouldRunO10m226DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave49GateTrajectory(10, brief, createInitialWave49GateTrajectory());
    check(results, 'wave49_gate_advance_unit', 'Wave 49 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave49GateEma > 0, `ema=${snap.snapshot.wave49GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 82, stateCapacityLoad: 16, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave49IntegrationMonitor({ turn: 9, wave48ProjectionBrief: adv.inputs.agent25Wave48ProjectionHandoffBrief!, wave49GateTrajectory: adv.inputs.wave49GateTrajectory, wave48IntegrationMonitor: adv.inputs.wave48IntegrationMonitor! });
    check(results, 'wave49_integration_monitor_unit', 'Standalone wave 49 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave49_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave49_gate_arc_scenario', 'Wave 49 gate arc scenario attaches wave 49 chain', last.wave49GateTrajectory !== undefined && last.wave49IntegrationMonitor !== undefined && last.agent25Wave49ProjectionHandoffBrief !== undefined, `gate=${last.wave49GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave49_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave49_integration_stress_scenario', 'Wave 49 integration stress keeps O10-227 gated under stress', !last.agent25Wave49ProjectionHandoffBrief!.shouldProjectWave49 || last.wave49IntegrationMonitor!.shouldRunO10m227DryRun, `project=${last.agent25Wave49ProjectionHandoffBrief?.shouldProjectWave49} o10m227=${last.wave49IntegrationMonitor?.shouldRunO10m227DryRun}`);
  }
  check(results, 'wave49_projection_stub_catalog', 'Round 49 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave49_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m227_gate'), 'wave49_projection+o10m227_gate');
  check(results, 'wave49_scenario_registry', 'Round 49 scenarios registered', listAgent14ScenarioIds().includes('wave49_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave49_integration_stress'), '100 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave50_gate_trajectory', 'Turn advance attaches wave 50 gate trajectory', adv.inputs.wave50GateTrajectory !== undefined && adv.wave50GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave50GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 83, stateCapacityLoad: 14, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave50_integration_monitor', 'Wave 50 integration monitor present', adv.inputs.wave50IntegrationMonitor !== undefined && adv.inputs.wave50IntegrationMonitor!.summary.length > 10, adv.inputs.wave50IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave50_projection_handoff_brief', 'Agent 25 wave 50 projection handoff attached', adv.inputs.agent25Wave50ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave50ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave50ProjectionHandoffBrief?.shouldProjectWave50}`);
  }
  {
    const raw = sanitizeWave50GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave50GateEma: 1 });
    check(results, 'wave50_gate_sanitize', 'Wave 50 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave50GateEma === 1, `ema=${raw.wave50GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave50 = composeAgent25Wave50ProjectionHandoffBrief({ turn: 14, wave50IntegrationMonitor: adv.inputs.wave50IntegrationMonitor!, wave50GateTrajectory: adv.inputs.wave50GateTrajectory });
    check(results, 'wave50_projection_composer', 'Standalone wave 50 projection composer returns headlines', wave50.headlines.length > 0 && wave50.summary.length > 10, wave50.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave49: true, shouldRunO10m227DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave50GateTrajectory(10, brief, createInitialWave50GateTrajectory());
    check(results, 'wave50_gate_advance_unit', 'Wave 50 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave50GateEma > 0, `ema=${snap.snapshot.wave50GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 82, stateCapacityLoad: 16, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave50IntegrationMonitor({ turn: 9, wave49ProjectionBrief: adv.inputs.agent25Wave49ProjectionHandoffBrief!, wave50GateTrajectory: adv.inputs.wave50GateTrajectory, wave49IntegrationMonitor: adv.inputs.wave49IntegrationMonitor! });
    check(results, 'wave50_integration_monitor_unit', 'Standalone wave 50 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave50_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave50_gate_arc_scenario', 'Wave 50 gate arc scenario attaches wave 50 chain', last.wave50GateTrajectory !== undefined && last.wave50IntegrationMonitor !== undefined && last.agent25Wave50ProjectionHandoffBrief !== undefined, `gate=${last.wave50GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave50_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave50_integration_stress_scenario', 'Wave 50 integration stress keeps O10-229 gated under stress', !last.agent25Wave50ProjectionHandoffBrief!.shouldProjectWave50 || last.wave50IntegrationMonitor!.shouldRunO10m229DryRun, `project=${last.agent25Wave50ProjectionHandoffBrief?.shouldProjectWave50} o10m229=${last.wave50IntegrationMonitor?.shouldRunO10m229DryRun}`);
  }
  check(results, 'wave50_projection_stub_catalog', 'Round 50 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave50_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m229_gate'), 'wave50_projection+o10m229_gate');
  check(results, 'wave50_scenario_registry', 'Round 50 scenarios registered', listAgent14ScenarioIds().includes('wave50_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave50_integration_stress'), '104 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave51_gate_trajectory', 'Turn advance attaches wave 51 gate trajectory', adv.inputs.wave51GateTrajectory !== undefined && adv.wave51GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave51GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 83, stateCapacityLoad: 14, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave51_integration_monitor', 'Wave 51 integration monitor present', adv.inputs.wave51IntegrationMonitor !== undefined && adv.inputs.wave51IntegrationMonitor!.summary.length > 10, adv.inputs.wave51IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave51_projection_handoff_brief', 'Agent 25 wave 51 projection handoff attached', adv.inputs.agent25Wave51ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave51ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave51ProjectionHandoffBrief?.shouldProjectWave51}`);
  }
  {
    const raw = sanitizeWave51GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave51GateEma: 1 });
    check(results, 'wave51_gate_sanitize', 'Wave 51 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave51GateEma === 1, `ema=${raw.wave51GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave51 = composeAgent25Wave51ProjectionHandoffBrief({ turn: 14, wave51IntegrationMonitor: adv.inputs.wave51IntegrationMonitor!, wave51GateTrajectory: adv.inputs.wave51GateTrajectory });
    check(results, 'wave51_projection_composer', 'Standalone wave 51 projection composer returns headlines', wave51.headlines.length > 0 && wave51.summary.length > 10, wave51.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave50: true, shouldRunO10m229DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave51GateTrajectory(10, brief, createInitialWave51GateTrajectory());
    check(results, 'wave51_gate_advance_unit', 'Wave 51 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave51GateEma > 0, `ema=${snap.snapshot.wave51GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 82, stateCapacityLoad: 16, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave51IntegrationMonitor({ turn: 9, wave50ProjectionBrief: adv.inputs.agent25Wave50ProjectionHandoffBrief!, wave51GateTrajectory: adv.inputs.wave51GateTrajectory, wave50IntegrationMonitor: adv.inputs.wave50IntegrationMonitor! });
    check(results, 'wave51_integration_monitor_unit', 'Standalone wave 51 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave51_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave51_gate_arc_scenario', 'Wave 51 gate arc scenario attaches wave 51 chain', last.wave51GateTrajectory !== undefined && last.wave51IntegrationMonitor !== undefined && last.agent25Wave51ProjectionHandoffBrief !== undefined, `gate=${last.wave51GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave51_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave51_integration_stress_scenario', 'Wave 51 integration stress keeps O10-231 gated under stress', !last.agent25Wave51ProjectionHandoffBrief!.shouldProjectWave51 || last.wave51IntegrationMonitor!.shouldRunO10m231DryRun, `project=${last.agent25Wave51ProjectionHandoffBrief?.shouldProjectWave51} o10m231=${last.wave51IntegrationMonitor?.shouldRunO10m231DryRun}`);
  }
  check(results, 'wave51_projection_stub_catalog', 'Round 51 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave51_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m231_gate'), 'wave51_projection+o10m231_gate');
  check(results, 'wave51_scenario_registry', 'Round 51 scenarios registered', listAgent14ScenarioIds().includes('wave51_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave51_integration_stress'), '104 scenarios');

  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave52_gate_trajectory', 'Turn advance attaches wave 52 gate trajectory', adv.inputs.wave52GateTrajectory !== undefined && adv.wave52GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave52GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 11, fiscalHeadroom: 83, stateCapacityLoad: 14, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave52_integration_monitor', 'Wave 52 integration monitor present', adv.inputs.wave52IntegrationMonitor !== undefined && adv.inputs.wave52IntegrationMonitor!.summary.length > 10, adv.inputs.wave52IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 15, fiscalHeadroom: 86, stateCapacityLoad: 10, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave52_projection_handoff_brief', 'Agent 25 wave 52 projection handoff attached', adv.inputs.agent25Wave52ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave52ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave52ProjectionHandoffBrief?.shouldProjectWave52}`);
  }
  {
    const raw = sanitizeWave52GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave52GateEma: 1 });
    check(results, 'wave52_gate_sanitize', 'Wave 52 gate trajectory sanitize preserves schema', raw.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw.wave52GateEma === 1, `ema=${raw.wave52GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 84, stateCapacityLoad: 12, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave52 = composeAgent25Wave52ProjectionHandoffBrief({ turn: 14, wave52IntegrationMonitor: adv.inputs.wave52IntegrationMonitor!, wave52GateTrajectory: adv.inputs.wave52GateTrajectory });
    check(results, 'wave52_projection_composer', 'Standalone wave 52 projection composer returns headlines', wave52.headlines.length > 0 && wave52.summary.length > 10, wave52.summary.slice(0, 64));
  }
  {
    const brief = { turn: 8, shouldProjectWave51: true, shouldRunO10m231DryRun: true, headlines: ['x'], summary: 'ok' };
    const snap = advanceWave52GateTrajectory(10, brief, createInitialWave52GateTrajectory());
    check(results, 'wave52_gate_advance_unit', 'Wave 52 gate advance updates persisted EMA', snap.persisted.lastTurn === 10 && snap.snapshot.wave52GateEma > 0, `ema=${snap.snapshot.wave52GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 9, fiscalHeadroom: 82, stateCapacityLoad: 16, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor = buildWave52IntegrationMonitor({ turn: 9, wave51ProjectionBrief: adv.inputs.agent25Wave51ProjectionHandoffBrief!, wave52GateTrajectory: adv.inputs.wave52GateTrajectory, wave51IntegrationMonitor: adv.inputs.wave51IntegrationMonitor! });
    check(results, 'wave52_integration_monitor_unit', 'Standalone wave 52 integration monitor returns summary', monitor.summary.length > 10, monitor.summary.slice(0, 64));
  }
  {
    const sim = simulateAgent14HousingScenario('wave52_gate_trajectory_arc', 10);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave52_gate_arc_scenario', 'Wave 52 gate arc scenario attaches wave 52 chain', last.wave52GateTrajectory !== undefined && last.wave52IntegrationMonitor !== undefined && last.agent25Wave52ProjectionHandoffBrief !== undefined, `gate=${last.wave52GateTrajectory?.band}`);
  }
  {
    const sim = simulateAgent14HousingScenario('wave52_integration_stress', 8);
    const last = sim.turns[sim.turns.length - 1]!;
    check(results, 'wave52_integration_stress_scenario', 'Wave 52 integration stress keeps O10-233 gated under stress', !last.agent25Wave52ProjectionHandoffBrief!.shouldProjectWave52 || last.wave52IntegrationMonitor!.shouldRunO10m233DryRun, `project=${last.agent25Wave52ProjectionHandoffBrief?.shouldProjectWave52} o10m233=${last.wave52IntegrationMonitor?.shouldRunO10m233DryRun}`);
  }
  check(results, 'wave52_projection_stub_catalog', 'Round 52 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave52_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m233_gate'), 'wave52_projection+o10m233_gate');
  check(results, 'wave52_scenario_registry', 'Round 52 scenarios registered', listAgent14ScenarioIds().includes('wave52_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave52_integration_stress'), '106 scenarios');
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave53_gate_trajectory', 'Turn advance attaches wave 53 gate trajectory', adv.inputs.wave53GateTrajectory !== undefined && adv.wave53GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave53GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 12, fiscalHeadroom: 84, stateCapacityLoad: 13, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave53_integration_monitor', 'Wave 53 integration monitor present', adv.inputs.wave53IntegrationMonitor !== undefined && adv.inputs.wave53IntegrationMonitor!.summary.length > 10, adv.inputs.wave53IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave53_projection_handoff_brief', 'Agent 25 wave 53 projection handoff attached', adv.inputs.agent25Wave53ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave53ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave53ProjectionHandoffBrief?.shouldProjectWave53}`);
  }
  {
    const raw53 = sanitizeWave53GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave53GateEma: 1 });
    check(results, 'wave53_gate_sanitize', 'Wave 53 gate trajectory sanitize preserves schema', raw53.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw53.wave53GateEma === 1, `ema=${raw53.wave53GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave53 = composeAgent25Wave53ProjectionHandoffBrief({ turn: 14, wave53IntegrationMonitor: adv.inputs.wave53IntegrationMonitor!, wave53GateTrajectory: adv.inputs.wave53GateTrajectory });
    check(results, 'wave53_projection_composer', 'Standalone wave 53 projection composer returns headlines', wave53.headlines.length > 0 && wave53.summary.length > 10, wave53.summary.slice(0, 64));
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const snap53 = advanceWave53GateTrajectory(10, adv.inputs.agent25Wave52ProjectionHandoffBrief!, createInitialWave53GateTrajectory());
    check(results, 'wave53_gate_advance_unit', 'Wave 53 gate advance updates persisted EMA', snap53.persisted.lastTurn === 10 && snap53.snapshot.wave53GateEma > 0, `ema=${snap53.snapshot.wave53GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 10, fiscalHeadroom: 83, stateCapacityLoad: 15, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor53 = buildWave53IntegrationMonitor({ turn: 9, wave52ProjectionBrief: adv.inputs.agent25Wave52ProjectionHandoffBrief!, wave53GateTrajectory: adv.inputs.wave53GateTrajectory, wave52IntegrationMonitor: adv.inputs.wave52IntegrationMonitor! });
    check(results, 'wave53_integration_monitor_unit', 'Standalone wave 53 integration monitor returns summary', monitor53.summary.length > 10, monitor53.summary.slice(0, 64));
  }
  {
    const sim53 = simulateAgent14HousingScenario('wave53_gate_trajectory_arc', 10);
    const last53 = sim53.turns[sim53.turns.length - 1]!;
    check(results, 'wave53_gate_arc_scenario', 'Wave 53 gate arc scenario attaches wave 53 chain', last53.wave53GateTrajectory !== undefined && last53.wave53IntegrationMonitor !== undefined && last53.agent25Wave53ProjectionHandoffBrief !== undefined, `gate=${last53.wave53GateTrajectory?.band}`);
  }
  {
    const sim53s = simulateAgent14HousingScenario('wave53_integration_stress', 8);
    const last53s = sim53s.turns[sim53s.turns.length - 1]!;
    check(results, 'wave53_integration_stress_scenario', 'Wave 53 integration stress keeps O10-235 gated under stress', !last53s.agent25Wave53ProjectionHandoffBrief!.shouldProjectWave53 || last53s.wave53IntegrationMonitor!.shouldRunO10m237DryRun, `project=${last53s.agent25Wave53ProjectionHandoffBrief?.shouldProjectWave53} o10m237=${last53s.wave53IntegrationMonitor?.shouldRunO10m237DryRun}`);
  }
  check(results, 'wave53_scenario_registry', 'Round 53 scenarios registered', listAgent14ScenarioIds().includes('wave53_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave53_integration_stress'), '108 scenarios');
  check(results, 'wave53_projection_stub_catalog', 'Round 53 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave53_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m235_gate'), 'wave53_projection+o10m235_gate');
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave54_gate_trajectory', 'Turn advance attaches wave 54 gate trajectory', adv.inputs.wave54GateTrajectory !== undefined && adv.wave54GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave54GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 12, fiscalHeadroom: 84, stateCapacityLoad: 13, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave54_integration_monitor', 'Wave 54 integration monitor present', adv.inputs.wave54IntegrationMonitor !== undefined && adv.inputs.wave54IntegrationMonitor!.summary.length > 10, adv.inputs.wave54IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave54_projection_handoff_brief', 'Agent 25 wave 54 projection handoff attached', adv.inputs.agent25Wave54ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave54ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave54ProjectionHandoffBrief?.shouldProjectWave54}`);
  }
  {
    const raw54 = sanitizeWave54GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave54GateEma: 1 });
    check(results, 'wave54_gate_sanitize', 'Wave 54 gate trajectory sanitize preserves schema', raw54.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw54.wave54GateEma === 1, `ema=${raw54.wave54GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave54 = composeAgent25Wave54ProjectionHandoffBrief({ turn: 14, wave54IntegrationMonitor: adv.inputs.wave54IntegrationMonitor!, wave54GateTrajectory: adv.inputs.wave54GateTrajectory });
    check(results, 'wave54_projection_composer', 'Standalone wave 54 projection composer returns headlines', wave54.headlines.length > 0 && wave54.summary.length > 10, wave54.summary.slice(0, 64));
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const snap54 = advanceWave54GateTrajectory(10, adv.inputs.agent25Wave53ProjectionHandoffBrief!, createInitialWave54GateTrajectory());
    check(results, 'wave54_gate_advance_unit', 'Wave 54 gate advance updates persisted EMA', snap54.persisted.lastTurn === 10 && snap54.snapshot.wave54GateEma > 0, `ema=${snap54.snapshot.wave54GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 10, fiscalHeadroom: 83, stateCapacityLoad: 15, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor54 = buildWave54IntegrationMonitor({ turn: 9, wave53ProjectionBrief: adv.inputs.agent25Wave53ProjectionHandoffBrief!, wave54GateTrajectory: adv.inputs.wave54GateTrajectory, wave53IntegrationMonitor: adv.inputs.wave53IntegrationMonitor! });
    check(results, 'wave54_integration_monitor_unit', 'Standalone wave 54 integration monitor returns summary', monitor54.summary.length > 10, monitor54.summary.slice(0, 64));
  }
  {
    const sim54 = simulateAgent14HousingScenario('wave54_gate_trajectory_arc', 10);
    const last54 = sim54.turns[sim54.turns.length - 1]!;
    check(results, 'wave54_gate_arc_scenario', 'Wave 54 gate arc scenario attaches wave 54 chain', last54.wave54GateTrajectory !== undefined && last54.wave54IntegrationMonitor !== undefined && last54.agent25Wave54ProjectionHandoffBrief !== undefined, `gate=${last54.wave54GateTrajectory?.band}`);
  }
  {
    const sim54s = simulateAgent14HousingScenario('wave54_integration_stress', 8);
    const last54s = sim54s.turns[sim54s.turns.length - 1]!;
    check(results, 'wave54_integration_stress_scenario', 'Wave 54 integration stress keeps O10-237 gated under stress', !last54s.agent25Wave54ProjectionHandoffBrief!.shouldProjectWave54 || last54s.wave54IntegrationMonitor!.shouldRunO10m240DryRun, `project=${last54s.agent25Wave54ProjectionHandoffBrief?.shouldProjectWave54} o10m240=${last54s.wave54IntegrationMonitor?.shouldRunO10m240DryRun}`);
  }
  check(results, 'wave54_scenario_registry', 'Round 54 scenarios registered', listAgent14ScenarioIds().includes('wave54_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave54_integration_stress'), '110 scenarios');
  check(results, 'wave54_projection_stub_catalog', 'Round 54 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave54_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m238_gate'), 'wave54_projection+o10m238_gate');
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave55_gate_trajectory', 'Turn advance attaches wave 55 gate trajectory', adv.inputs.wave55GateTrajectory !== undefined && adv.wave55GateTrajectoryPersisted.lastTurn === 14, `band=${adv.inputs.wave55GateTrajectory?.band}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 12, fiscalHeadroom: 84, stateCapacityLoad: 13, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave55_integration_monitor', 'Wave 55 integration monitor present', adv.inputs.wave55IntegrationMonitor !== undefined && adv.inputs.wave55IntegrationMonitor!.summary.length > 10, adv.inputs.wave55IntegrationMonitor?.summary.slice(0, 72) ?? 'missing');
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 16, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    check(results, 'wave55_projection_handoff_brief', 'Agent 25 wave 55 projection handoff attached', adv.inputs.agent25Wave55ProjectionHandoffBrief !== undefined && adv.inputs.agent25Wave55ProjectionHandoffBrief!.summary.length > 10, `project=${adv.inputs.agent25Wave55ProjectionHandoffBrief?.shouldProjectWave55}`);
  }
  {
    const raw55 = sanitizeWave55GateTrajectory({ schemaVersion: AGENT14_WELLBEING_SCHEMA_VERSION, lastTurn: 10, emaAlpha: 0.3, wave55GateEma: 1 });
    check(results, 'wave55_gate_sanitize', 'Wave 55 gate trajectory sanitize preserves schema', raw55.schemaVersion === AGENT14_WELLBEING_SCHEMA_VERSION && raw55.wave55GateEma === 1, `ema=${raw55.wave55GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const wave55 = composeAgent25Wave55ProjectionHandoffBrief({ turn: 14, wave55IntegrationMonitor: adv.inputs.wave55IntegrationMonitor!, wave55GateTrajectory: adv.inputs.wave55GateTrajectory });
    check(results, 'wave55_projection_composer', 'Standalone wave 55 projection composer returns headlines', wave55.headlines.length > 0 && wave55.summary.length > 10, wave55.summary.slice(0, 64));
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 14, fiscalHeadroom: 87, stateCapacityLoad: 9, workforceReadiness: 'strong' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const snap55 = advanceWave55GateTrajectory(10, adv.inputs.agent25Wave54ProjectionHandoffBrief!, createInitialWave55GateTrajectory());
    check(results, 'wave55_gate_advance_unit', 'Wave 55 gate advance updates persisted EMA', snap55.persisted.lastTurn === 10 && snap55.snapshot.wave55GateEma > 0, `ema=${snap55.snapshot.wave55GateEma}`);
  }
  {
    const adv = advancePublicServicesTurn({ inputs: { turn: 10, fiscalHeadroom: 83, stateCapacityLoad: 15, workforceReadiness: 'balanced' }, spendingPersisted: createInitialDelayedSpendingPersisted() });
    const monitor55 = buildWave55IntegrationMonitor({ turn: 9, wave54ProjectionBrief: adv.inputs.agent25Wave54ProjectionHandoffBrief!, wave55GateTrajectory: adv.inputs.wave55GateTrajectory, wave54IntegrationMonitor: adv.inputs.wave54IntegrationMonitor! });
    check(results, 'wave55_integration_monitor_unit', 'Standalone wave 55 integration monitor returns summary', monitor55.summary.length > 10, monitor55.summary.slice(0, 64));
  }
  {
    const sim55 = simulateAgent14HousingScenario('wave55_gate_trajectory_arc', 10);
    const last55 = sim55.turns[sim55.turns.length - 1]!;
    check(results, 'wave55_gate_arc_scenario', 'Wave 55 gate arc scenario attaches wave 55 chain', last55.wave55GateTrajectory !== undefined && last55.wave55IntegrationMonitor !== undefined && last55.agent25Wave55ProjectionHandoffBrief !== undefined, `gate=${last55.wave55GateTrajectory?.band}`);
  }
  {
    const sim55s = simulateAgent14HousingScenario('wave55_integration_stress', 8);
    const last55s = sim55s.turns[sim55s.turns.length - 1]!;
    check(results, 'wave55_integration_stress_scenario', 'Wave 55 integration stress keeps O10-240 gated under stress', !last55s.agent25Wave55ProjectionHandoffBrief!.shouldProjectWave55 || last55s.wave55IntegrationMonitor!.shouldRunO10m247DryRun, `project=${last55s.agent25Wave55ProjectionHandoffBrief?.shouldProjectWave55} o10m247=${last55s.wave55IntegrationMonitor?.shouldRunO10m247DryRun}`);
  }
  check(results, 'wave55_scenario_registry', 'Round 55 scenarios registered', listAgent14ScenarioIds().includes('wave55_gate_trajectory_arc') && listAgent14ScenarioIds().includes('wave55_integration_stress'), '112 scenarios');
  check(results, 'wave55_projection_stub_catalog', 'Round 55 projection stubs registered', AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_QLD_wave55_projection') && AGENT14_HEALTH_ED_PROGRAM_STUBS.some((s) => s.id === 'ps_xp_WA_o10m241_gate'), 'wave55_projection+o10m241_gate');

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}
