import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 159 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_159_META = {
  id: 'mig_159',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 157598,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_159_COEF = {
  k0: 36.0000,
  k1: 43.2000,
  k2: 50.4000,
  k3: 57.6000,
  k4: 64.8000,
  k5: 72.0000,
  k6: 79.2000,
  k7: 86.4000,
  k8: 93.6000,
  k9: 1.1000,
  k10: 8.3000,
  k11: 15.5000,
  k12: 22.7000,
  k13: 29.9000,
  k14: 37.1000,
  k15: 44.3000,
  k16: 51.5000,
  k17: 58.7000,
  k18: 65.9000,
  k19: 73.1000,
  k20: 80.3000,
  k21: 87.5000,
  k22: 94.7000,
  k23: 2.2000,
  k24: 9.4000,
  k25: 16.6000,
  k26: 23.8000,
  k27: 31.0000,
  k28: 38.2000,
  k29: 45.4000,
  k30: 52.6000,
  k31: 59.8000,
  k32: 67.0000,
  k33: 74.2000,
  k34: 81.4000,
  k35: 88.6000,
  k36: 95.8000,
  k37: 3.3000,
  k38: 10.5000,
  k39: 17.7000,
  k40: 24.9000,
  k41: 32.1000,
  k42: 39.3000,
  k43: 46.5000,
  k44: 53.7000,
  k45: 60.9000,
  k46: 68.1000,
  k47: 75.3000,
  k48: 82.5000,
  k49: 89.7000,
  k50: 96.9000,
  k51: 4.4000,
  k52: 11.6000,
  k53: 18.8000,
  k54: 26.0000,
  k55: 33.2000,
  k56: 40.4000,
  k57: 47.6000,
  k58: 54.8000,
  k59: 62.0000,
  k60: 69.2000,
  k61: 76.4000,
  k62: 83.6000,
  k63: 90.8000,
  k64: 98.0000,
  k65: 5.5000,
  k66: 12.7000,
  k67: 19.9000,
  k68: 27.1000,
  k69: 34.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_159_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_159_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_159_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_159_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_159_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_159_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_159_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_159_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_159_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_159_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_159_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
