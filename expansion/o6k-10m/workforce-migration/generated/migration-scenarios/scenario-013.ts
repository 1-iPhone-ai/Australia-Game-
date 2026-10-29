import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 013 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_013_META = {
  id: 'mig_013',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 12912,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_013_COEF = {
  k0: 75.2000,
  k1: 70.3000,
  k2: 65.4000,
  k3: 60.5000,
  k4: 55.6000,
  k5: 50.7000,
  k6: 45.8000,
  k7: 40.9000,
  k8: 36.0000,
  k9: 31.1000,
  k10: 26.2000,
  k11: 21.3000,
  k12: 16.4000,
  k13: 11.5000,
  k14: 6.6000,
  k15: 1.7000,
  k16: 96.5000,
  k17: 91.6000,
  k18: 86.7000,
  k19: 81.8000,
  k20: 76.9000,
  k21: 72.0000,
  k22: 67.1000,
  k23: 62.2000,
  k24: 57.3000,
  k25: 52.4000,
  k26: 47.5000,
  k27: 42.6000,
  k28: 37.7000,
  k29: 32.8000,
  k30: 27.9000,
  k31: 23.0000,
  k32: 18.1000,
  k33: 13.2000,
  k34: 8.3000,
  k35: 3.4000,
  k36: 98.2000,
  k37: 93.3000,
  k38: 88.4000,
  k39: 83.5000,
  k40: 78.6000,
  k41: 73.7000,
  k42: 68.8000,
  k43: 63.9000,
  k44: 59.0000,
  k45: 54.1000,
  k46: 49.2000,
  k47: 44.3000,
  k48: 39.4000,
  k49: 34.5000,
  k50: 29.6000,
  k51: 24.7000,
  k52: 19.8000,
  k53: 14.9000,
  k54: 10.0000,
  k55: 5.1000,
  k56: 0.2000,
  k57: 95.0000,
  k58: 90.1000,
  k59: 85.2000,
  k60: 80.3000,
  k61: 75.4000,
  k62: 70.5000,
  k63: 65.6000,
  k64: 60.7000,
  k65: 55.8000,
  k66: 50.9000,
  k67: 46.0000,
  k68: 41.1000,
  k69: 36.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_013_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_013_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_013_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_013_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_013_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_013_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_013_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_013_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_013_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_013_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_013_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
