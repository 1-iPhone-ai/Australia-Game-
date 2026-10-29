import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 064 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_064_META = {
  id: 'mig_064',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 63453,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_064_COEF = {
  k0: 21.9000,
  k1: 86.1000,
  k2: 50.6000,
  k3: 15.1000,
  k4: 79.3000,
  k5: 43.8000,
  k6: 8.3000,
  k7: 72.5000,
  k8: 37.0000,
  k9: 1.5000,
  k10: 65.7000,
  k11: 30.2000,
  k12: 94.4000,
  k13: 58.9000,
  k14: 23.4000,
  k15: 87.6000,
  k16: 52.1000,
  k17: 16.6000,
  k18: 80.8000,
  k19: 45.3000,
  k20: 9.8000,
  k21: 74.0000,
  k22: 38.5000,
  k23: 3.0000,
  k24: 67.2000,
  k25: 31.7000,
  k26: 95.9000,
  k27: 60.4000,
  k28: 24.9000,
  k29: 89.1000,
  k30: 53.6000,
  k31: 18.1000,
  k32: 82.3000,
  k33: 46.8000,
  k34: 11.3000,
  k35: 75.5000,
  k36: 40.0000,
  k37: 4.5000,
  k38: 68.7000,
  k39: 33.2000,
  k40: 97.4000,
  k41: 61.9000,
  k42: 26.4000,
  k43: 90.6000,
  k44: 55.1000,
  k45: 19.6000,
  k46: 83.8000,
  k47: 48.3000,
  k48: 12.8000,
  k49: 77.0000,
  k50: 41.5000,
  k51: 6.0000,
  k52: 70.2000,
  k53: 34.7000,
  k54: 98.9000,
  k55: 63.4000,
  k56: 27.9000,
  k57: 92.1000,
  k58: 56.6000,
  k59: 21.1000,
  k60: 85.3000,
  k61: 49.8000,
  k62: 14.3000,
  k63: 78.5000,
  k64: 43.0000,
  k65: 7.5000,
  k66: 71.7000,
  k67: 36.2000,
  k68: 0.7000,
  k69: 64.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_064_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_064_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_064_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_064_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_064_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_064_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_064_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_064_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_064_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_064_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_064_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
