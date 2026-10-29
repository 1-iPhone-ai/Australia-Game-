import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 090 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_090_META = {
  id: 'mig_090',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 89219,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_090_COEF = {
  k0: 43.6000,
  k1: 92.2000,
  k2: 41.1000,
  k3: 89.7000,
  k4: 38.6000,
  k5: 87.2000,
  k6: 36.1000,
  k7: 84.7000,
  k8: 33.6000,
  k9: 82.2000,
  k10: 31.1000,
  k11: 79.7000,
  k12: 28.6000,
  k13: 77.2000,
  k14: 26.1000,
  k15: 74.7000,
  k16: 23.6000,
  k17: 72.2000,
  k18: 21.1000,
  k19: 69.7000,
  k20: 18.6000,
  k21: 67.2000,
  k22: 16.1000,
  k23: 64.7000,
  k24: 13.6000,
  k25: 62.2000,
  k26: 11.1000,
  k27: 59.7000,
  k28: 8.6000,
  k29: 57.2000,
  k30: 6.1000,
  k31: 54.7000,
  k32: 3.6000,
  k33: 52.2000,
  k34: 1.1000,
  k35: 49.7000,
  k36: 98.3000,
  k37: 47.2000,
  k38: 95.8000,
  k39: 44.7000,
  k40: 93.3000,
  k41: 42.2000,
  k42: 90.8000,
  k43: 39.7000,
  k44: 88.3000,
  k45: 37.2000,
  k46: 85.8000,
  k47: 34.7000,
  k48: 83.3000,
  k49: 32.2000,
  k50: 80.8000,
  k51: 29.7000,
  k52: 78.3000,
  k53: 27.2000,
  k54: 75.8000,
  k55: 24.7000,
  k56: 73.3000,
  k57: 22.2000,
  k58: 70.8000,
  k59: 19.7000,
  k60: 68.3000,
  k61: 17.2000,
  k62: 65.8000,
  k63: 14.7000,
  k64: 63.3000,
  k65: 12.2000,
  k66: 60.8000,
  k67: 9.7000,
  k68: 58.3000,
  k69: 7.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_090_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_090_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_090_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_090_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_090_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_090_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_090_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_090_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_090_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_090_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_090_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
