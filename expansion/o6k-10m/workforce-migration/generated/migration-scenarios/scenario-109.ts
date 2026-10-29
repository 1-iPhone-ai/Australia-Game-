import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 109 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_109_META = {
  id: 'mig_109',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 108048,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_109_COEF = {
  k0: 86.3000,
  k1: 23.8000,
  k2: 61.0000,
  k3: 98.2000,
  k4: 35.7000,
  k5: 72.9000,
  k6: 10.4000,
  k7: 47.6000,
  k8: 84.8000,
  k9: 22.3000,
  k10: 59.5000,
  k11: 96.7000,
  k12: 34.2000,
  k13: 71.4000,
  k14: 8.9000,
  k15: 46.1000,
  k16: 83.3000,
  k17: 20.8000,
  k18: 58.0000,
  k19: 95.2000,
  k20: 32.7000,
  k21: 69.9000,
  k22: 7.4000,
  k23: 44.6000,
  k24: 81.8000,
  k25: 19.3000,
  k26: 56.5000,
  k27: 93.7000,
  k28: 31.2000,
  k29: 68.4000,
  k30: 5.9000,
  k31: 43.1000,
  k32: 80.3000,
  k33: 17.8000,
  k34: 55.0000,
  k35: 92.2000,
  k36: 29.7000,
  k37: 66.9000,
  k38: 4.4000,
  k39: 41.6000,
  k40: 78.8000,
  k41: 16.3000,
  k42: 53.5000,
  k43: 90.7000,
  k44: 28.2000,
  k45: 65.4000,
  k46: 2.9000,
  k47: 40.1000,
  k48: 77.3000,
  k49: 14.8000,
  k50: 52.0000,
  k51: 89.2000,
  k52: 26.7000,
  k53: 63.9000,
  k54: 1.4000,
  k55: 38.6000,
  k56: 75.8000,
  k57: 13.3000,
  k58: 50.5000,
  k59: 87.7000,
  k60: 25.2000,
  k61: 62.4000,
  k62: 99.6000,
  k63: 37.1000,
  k64: 74.3000,
  k65: 11.8000,
  k66: 49.0000,
  k67: 86.2000,
  k68: 23.7000,
  k69: 60.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_109_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_109_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_109_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_109_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_109_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_109_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_109_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_109_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_109_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_109_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_109_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
