import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 052 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_052_META = {
  id: 'mig_052',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 51561,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_052_COEF = {
  k0: 57.9000,
  k1: 29.6000,
  k2: 1.3000,
  k3: 72.7000,
  k4: 44.4000,
  k5: 16.1000,
  k6: 87.5000,
  k7: 59.2000,
  k8: 30.9000,
  k9: 2.6000,
  k10: 74.0000,
  k11: 45.7000,
  k12: 17.4000,
  k13: 88.8000,
  k14: 60.5000,
  k15: 32.2000,
  k16: 3.9000,
  k17: 75.3000,
  k18: 47.0000,
  k19: 18.7000,
  k20: 90.1000,
  k21: 61.8000,
  k22: 33.5000,
  k23: 5.2000,
  k24: 76.6000,
  k25: 48.3000,
  k26: 20.0000,
  k27: 91.4000,
  k28: 63.1000,
  k29: 34.8000,
  k30: 6.5000,
  k31: 77.9000,
  k32: 49.6000,
  k33: 21.3000,
  k34: 92.7000,
  k35: 64.4000,
  k36: 36.1000,
  k37: 7.8000,
  k38: 79.2000,
  k39: 50.9000,
  k40: 22.6000,
  k41: 94.0000,
  k42: 65.7000,
  k43: 37.4000,
  k44: 9.1000,
  k45: 80.5000,
  k46: 52.2000,
  k47: 23.9000,
  k48: 95.3000,
  k49: 67.0000,
  k50: 38.7000,
  k51: 10.4000,
  k52: 81.8000,
  k53: 53.5000,
  k54: 25.2000,
  k55: 96.6000,
  k56: 68.3000,
  k57: 40.0000,
  k58: 11.7000,
  k59: 83.1000,
  k60: 54.8000,
  k61: 26.5000,
  k62: 97.9000,
  k63: 69.6000,
  k64: 41.3000,
  k65: 13.0000,
  k66: 84.4000,
  k67: 56.1000,
  k68: 27.8000,
  k69: 99.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_052_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_052_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_052_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_052_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_052_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_052_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_052_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_052_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_052_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_052_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_052_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
