import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 007 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_007_META = {
  id: 'mig_007',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 6966,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_007_COEF = {
  k0: 93.2000,
  k1: 91.9000,
  k2: 90.6000,
  k3: 89.3000,
  k4: 88.0000,
  k5: 86.7000,
  k6: 85.4000,
  k7: 84.1000,
  k8: 82.8000,
  k9: 81.5000,
  k10: 80.2000,
  k11: 78.9000,
  k12: 77.6000,
  k13: 76.3000,
  k14: 75.0000,
  k15: 73.7000,
  k16: 72.4000,
  k17: 71.1000,
  k18: 69.8000,
  k19: 68.5000,
  k20: 67.2000,
  k21: 65.9000,
  k22: 64.6000,
  k23: 63.3000,
  k24: 62.0000,
  k25: 60.7000,
  k26: 59.4000,
  k27: 58.1000,
  k28: 56.8000,
  k29: 55.5000,
  k30: 54.2000,
  k31: 52.9000,
  k32: 51.6000,
  k33: 50.3000,
  k34: 49.0000,
  k35: 47.7000,
  k36: 46.4000,
  k37: 45.1000,
  k38: 43.8000,
  k39: 42.5000,
  k40: 41.2000,
  k41: 39.9000,
  k42: 38.6000,
  k43: 37.3000,
  k44: 36.0000,
  k45: 34.7000,
  k46: 33.4000,
  k47: 32.1000,
  k48: 30.8000,
  k49: 29.5000,
  k50: 28.2000,
  k51: 26.9000,
  k52: 25.6000,
  k53: 24.3000,
  k54: 23.0000,
  k55: 21.7000,
  k56: 20.4000,
  k57: 19.1000,
  k58: 17.8000,
  k59: 16.5000,
  k60: 15.2000,
  k61: 13.9000,
  k62: 12.6000,
  k63: 11.3000,
  k64: 10.0000,
  k65: 8.7000,
  k66: 7.4000,
  k67: 6.1000,
  k68: 4.8000,
  k69: 3.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_007_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_007_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_007_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_007_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_007_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_007_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_007_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_007_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_007_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_007_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_007_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
