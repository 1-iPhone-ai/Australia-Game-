import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 128 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_128_META = {
  id: 'mig_128',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 126877,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_128_COEF = {
  k0: 29.3000,
  k1: 55.1000,
  k2: 80.9000,
  k3: 7.0000,
  k4: 32.8000,
  k5: 58.6000,
  k6: 84.4000,
  k7: 10.5000,
  k8: 36.3000,
  k9: 62.1000,
  k10: 87.9000,
  k11: 14.0000,
  k12: 39.8000,
  k13: 65.6000,
  k14: 91.4000,
  k15: 17.5000,
  k16: 43.3000,
  k17: 69.1000,
  k18: 94.9000,
  k19: 21.0000,
  k20: 46.8000,
  k21: 72.6000,
  k22: 98.4000,
  k23: 24.5000,
  k24: 50.3000,
  k25: 76.1000,
  k26: 2.2000,
  k27: 28.0000,
  k28: 53.8000,
  k29: 79.6000,
  k30: 5.7000,
  k31: 31.5000,
  k32: 57.3000,
  k33: 83.1000,
  k34: 9.2000,
  k35: 35.0000,
  k36: 60.8000,
  k37: 86.6000,
  k38: 12.7000,
  k39: 38.5000,
  k40: 64.3000,
  k41: 90.1000,
  k42: 16.2000,
  k43: 42.0000,
  k44: 67.8000,
  k45: 93.6000,
  k46: 19.7000,
  k47: 45.5000,
  k48: 71.3000,
  k49: 97.1000,
  k50: 23.2000,
  k51: 49.0000,
  k52: 74.8000,
  k53: 0.9000,
  k54: 26.7000,
  k55: 52.5000,
  k56: 78.3000,
  k57: 4.4000,
  k58: 30.2000,
  k59: 56.0000,
  k60: 81.8000,
  k61: 7.9000,
  k62: 33.7000,
  k63: 59.5000,
  k64: 85.3000,
  k65: 11.4000,
  k66: 37.2000,
  k67: 63.0000,
  k68: 88.8000,
  k69: 14.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_128_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_128_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_128_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_128_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_128_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_128_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_128_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_128_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_128_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_128_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_128_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
