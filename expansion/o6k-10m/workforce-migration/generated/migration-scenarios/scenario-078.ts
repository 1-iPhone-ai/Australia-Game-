import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 078 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_078_META = {
  id: 'mig_078',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 77327,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_078_COEF = {
  k0: 79.6000,
  k1: 35.7000,
  k2: 91.5000,
  k3: 47.6000,
  k4: 3.7000,
  k5: 59.5000,
  k6: 15.6000,
  k7: 71.4000,
  k8: 27.5000,
  k9: 83.3000,
  k10: 39.4000,
  k11: 95.2000,
  k12: 51.3000,
  k13: 7.4000,
  k14: 63.2000,
  k15: 19.3000,
  k16: 75.1000,
  k17: 31.2000,
  k18: 87.0000,
  k19: 43.1000,
  k20: 98.9000,
  k21: 55.0000,
  k22: 11.1000,
  k23: 66.9000,
  k24: 23.0000,
  k25: 78.8000,
  k26: 34.9000,
  k27: 90.7000,
  k28: 46.8000,
  k29: 2.9000,
  k30: 58.7000,
  k31: 14.8000,
  k32: 70.6000,
  k33: 26.7000,
  k34: 82.5000,
  k35: 38.6000,
  k36: 94.4000,
  k37: 50.5000,
  k38: 6.6000,
  k39: 62.4000,
  k40: 18.5000,
  k41: 74.3000,
  k42: 30.4000,
  k43: 86.2000,
  k44: 42.3000,
  k45: 98.1000,
  k46: 54.2000,
  k47: 10.3000,
  k48: 66.1000,
  k49: 22.2000,
  k50: 78.0000,
  k51: 34.1000,
  k52: 89.9000,
  k53: 46.0000,
  k54: 2.1000,
  k55: 57.9000,
  k56: 14.0000,
  k57: 69.8000,
  k58: 25.9000,
  k59: 81.7000,
  k60: 37.8000,
  k61: 93.6000,
  k62: 49.7000,
  k63: 5.8000,
  k64: 61.6000,
  k65: 17.7000,
  k66: 73.5000,
  k67: 29.6000,
  k68: 85.4000,
  k69: 41.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_078_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_078_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_078_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_078_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_078_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_078_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_078_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_078_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_078_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_078_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_078_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
