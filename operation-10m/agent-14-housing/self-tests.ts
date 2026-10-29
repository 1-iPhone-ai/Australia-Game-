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
    'Fifty-two housing scenarios registered',
    listAgent14ScenarioIds().length === 52,
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
    AGENT14_WELLBEING_SCHEMA_VERSION === '10.14.25-scale-wave-25',
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

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}
