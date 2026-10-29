import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 157 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_157_META = {
  id: 'mig_157',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 155616,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_157_COEF = {
  k0: 42.0000,
  k1: 50.4000,
  k2: 58.8000,
  k3: 67.2000,
  k4: 75.6000,
  k5: 84.0000,
  k6: 92.4000,
  k7: 1.1000,
  k8: 9.5000,
  k9: 17.9000,
  k10: 26.3000,
  k11: 34.7000,
  k12: 43.1000,
  k13: 51.5000,
  k14: 59.9000,
  k15: 68.3000,
  k16: 76.7000,
  k17: 85.1000,
  k18: 93.5000,
  k19: 2.2000,
  k20: 10.6000,
  k21: 19.0000,
  k22: 27.4000,
  k23: 35.8000,
  k24: 44.2000,
  k25: 52.6000,
  k26: 61.0000,
  k27: 69.4000,
  k28: 77.8000,
  k29: 86.2000,
  k30: 94.6000,
  k31: 3.3000,
  k32: 11.7000,
  k33: 20.1000,
  k34: 28.5000,
  k35: 36.9000,
  k36: 45.3000,
  k37: 53.7000,
  k38: 62.1000,
  k39: 70.5000,
  k40: 78.9000,
  k41: 87.3000,
  k42: 95.7000,
  k43: 4.4000,
  k44: 12.8000,
  k45: 21.2000,
  k46: 29.6000,
  k47: 38.0000,
  k48: 46.4000,
  k49: 54.8000,
  k50: 63.2000,
  k51: 71.6000,
  k52: 80.0000,
  k53: 88.4000,
  k54: 96.8000,
  k55: 5.5000,
  k56: 13.9000,
  k57: 22.3000,
  k58: 30.7000,
  k59: 39.1000,
  k60: 47.5000,
  k61: 55.9000,
  k62: 64.3000,
  k63: 72.7000,
  k64: 81.1000,
  k65: 89.5000,
  k66: 97.9000,
  k67: 6.6000,
  k68: 15.0000,
  k69: 23.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_157_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_157_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_157_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_157_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_157_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_157_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_157_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_157_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_157_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_157_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_157_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
