import {
  advanceDelayedSpendingEffects,
  commitSpendingProgram,
  createInitialDelayedSpendingPersisted,
  makeSpendingCommitment,
} from './delayed-spending-effects.ts';
import {
  canAcceptSpendingCommitment,
  computeFiscalAbsorptionCap,
  computeNationalProgramSlots,
  computePublicServiceCapacity,
} from './public-service-capacity.ts';
import { advancePublicServicesTurn } from './turn-advance.ts';

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

  const passed = results.filter((r) => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}
