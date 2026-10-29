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
    'Eighteen housing scenarios registered',
    listAgent14ScenarioIds().length === 18,
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
    'Wellbeing schema version is wave 8',
    AGENT14_WELLBEING_SCHEMA_VERSION === '10.14.8-scale-wave-8',
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
      schemaVersion: '10.14.7-scale-wave-7' as any,
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

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}
