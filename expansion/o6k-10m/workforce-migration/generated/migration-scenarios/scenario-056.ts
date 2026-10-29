import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 056 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_056_META = {
  id: 'mig_056',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 55525,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_056_COEF = {
  k0: 45.9000,
  k1: 15.2000,
  k2: 84.2000,
  k3: 53.5000,
  k4: 22.8000,
  k5: 91.8000,
  k6: 61.1000,
  k7: 30.4000,
  k8: 99.4000,
  k9: 68.7000,
  k10: 38.0000,
  k11: 7.3000,
  k12: 76.3000,
  k13: 45.6000,
  k14: 14.9000,
  k15: 83.9000,
  k16: 53.2000,
  k17: 22.5000,
  k18: 91.5000,
  k19: 60.8000,
  k20: 30.1000,
  k21: 99.1000,
  k22: 68.4000,
  k23: 37.7000,
  k24: 7.0000,
  k25: 76.0000,
  k26: 45.3000,
  k27: 14.6000,
  k28: 83.6000,
  k29: 52.9000,
  k30: 22.2000,
  k31: 91.2000,
  k32: 60.5000,
  k33: 29.8000,
  k34: 98.8000,
  k35: 68.1000,
  k36: 37.4000,
  k37: 6.7000,
  k38: 75.7000,
  k39: 45.0000,
  k40: 14.3000,
  k41: 83.3000,
  k42: 52.6000,
  k43: 21.9000,
  k44: 90.9000,
  k45: 60.2000,
  k46: 29.5000,
  k47: 98.5000,
  k48: 67.8000,
  k49: 37.1000,
  k50: 6.4000,
  k51: 75.4000,
  k52: 44.7000,
  k53: 14.0000,
  k54: 83.0000,
  k55: 52.3000,
  k56: 21.6000,
  k57: 90.6000,
  k58: 59.9000,
  k59: 29.2000,
  k60: 98.2000,
  k61: 67.5000,
  k62: 36.8000,
  k63: 6.1000,
  k64: 75.1000,
  k65: 44.4000,
  k66: 13.7000,
  k67: 82.7000,
  k68: 52.0000,
  k69: 21.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_056_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_056_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_056_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_056_COEF[keys[j]] * ((turn + j) % 11);
  }
  const netInflow = V1014_WORKFORCE_clamp(-12 + (acc % 48) + turn * 0.04, -40, 55);
  const skillMismatchIndex = V1014_WORKFORCE_clamp(
    28 + (acc % 52) + Math.abs(netInflow) * 0.35,
    0,
    100,
  );
  const stable = V1014_WORKFORCE_readinessFromScore(100 - skillMismatchIndex) !== 'blocking';
  return { netInflow, skillMismatchIndex, stable };
}

export function V1014_WORKFORCE_MIG_SCENARIO_056_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_056_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_056_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_056_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_056_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_056_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_056_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
