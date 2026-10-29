import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 101 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_101_META = {
  id: 'mig_101',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 100120,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_101_COEF = {
  k0: 10.6000,
  k1: 52.6000,
  k2: 94.6000,
  k3: 36.9000,
  k4: 78.9000,
  k5: 21.2000,
  k6: 63.2000,
  k7: 5.5000,
  k8: 47.5000,
  k9: 89.5000,
  k10: 31.8000,
  k11: 73.8000,
  k12: 16.1000,
  k13: 58.1000,
  k14: 0.4000,
  k15: 42.4000,
  k16: 84.4000,
  k17: 26.7000,
  k18: 68.7000,
  k19: 11.0000,
  k20: 53.0000,
  k21: 95.0000,
  k22: 37.3000,
  k23: 79.3000,
  k24: 21.6000,
  k25: 63.6000,
  k26: 5.9000,
  k27: 47.9000,
  k28: 89.9000,
  k29: 32.2000,
  k30: 74.2000,
  k31: 16.5000,
  k32: 58.5000,
  k33: 0.8000,
  k34: 42.8000,
  k35: 84.8000,
  k36: 27.1000,
  k37: 69.1000,
  k38: 11.4000,
  k39: 53.4000,
  k40: 95.4000,
  k41: 37.7000,
  k42: 79.7000,
  k43: 22.0000,
  k44: 64.0000,
  k45: 6.3000,
  k46: 48.3000,
  k47: 90.3000,
  k48: 32.6000,
  k49: 74.6000,
  k50: 16.9000,
  k51: 58.9000,
  k52: 1.2000,
  k53: 43.2000,
  k54: 85.2000,
  k55: 27.5000,
  k56: 69.5000,
  k57: 11.8000,
  k58: 53.8000,
  k59: 95.8000,
  k60: 38.1000,
  k61: 80.1000,
  k62: 22.4000,
  k63: 64.4000,
  k64: 6.7000,
  k65: 48.7000,
  k66: 90.7000,
  k67: 33.0000,
  k68: 75.0000,
  k69: 17.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_101_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_101_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_101_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_101_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_101_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_101_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_101_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_101_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_101_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_101_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_101_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
