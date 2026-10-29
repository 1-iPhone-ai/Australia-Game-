import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 021 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_021_META = {
  id: 'mig_021',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 20840,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_021_COEF = {
  k0: 51.2000,
  k1: 41.5000,
  k2: 31.8000,
  k3: 22.1000,
  k4: 12.4000,
  k5: 2.7000,
  k6: 92.7000,
  k7: 83.0000,
  k8: 73.3000,
  k9: 63.6000,
  k10: 53.9000,
  k11: 44.2000,
  k12: 34.5000,
  k13: 24.8000,
  k14: 15.1000,
  k15: 5.4000,
  k16: 95.4000,
  k17: 85.7000,
  k18: 76.0000,
  k19: 66.3000,
  k20: 56.6000,
  k21: 46.9000,
  k22: 37.2000,
  k23: 27.5000,
  k24: 17.8000,
  k25: 8.1000,
  k26: 98.1000,
  k27: 88.4000,
  k28: 78.7000,
  k29: 69.0000,
  k30: 59.3000,
  k31: 49.6000,
  k32: 39.9000,
  k33: 30.2000,
  k34: 20.5000,
  k35: 10.8000,
  k36: 1.1000,
  k37: 91.1000,
  k38: 81.4000,
  k39: 71.7000,
  k40: 62.0000,
  k41: 52.3000,
  k42: 42.6000,
  k43: 32.9000,
  k44: 23.2000,
  k45: 13.5000,
  k46: 3.8000,
  k47: 93.8000,
  k48: 84.1000,
  k49: 74.4000,
  k50: 64.7000,
  k51: 55.0000,
  k52: 45.3000,
  k53: 35.6000,
  k54: 25.9000,
  k55: 16.2000,
  k56: 6.5000,
  k57: 96.5000,
  k58: 86.8000,
  k59: 77.1000,
  k60: 67.4000,
  k61: 57.7000,
  k62: 48.0000,
  k63: 38.3000,
  k64: 28.6000,
  k65: 18.9000,
  k66: 9.2000,
  k67: 99.2000,
  k68: 89.5000,
  k69: 79.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_021_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_021_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_021_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_021_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_021_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_021_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_021_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_021_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_021_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_021_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_021_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
