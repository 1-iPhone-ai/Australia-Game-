import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 077 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_077_META = {
  id: 'mig_077',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 76336,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_077_COEF = {
  k0: 82.6000,
  k1: 39.3000,
  k2: 95.7000,
  k3: 52.4000,
  k4: 9.1000,
  k5: 65.5000,
  k6: 22.2000,
  k7: 78.6000,
  k8: 35.3000,
  k9: 91.7000,
  k10: 48.4000,
  k11: 5.1000,
  k12: 61.5000,
  k13: 18.2000,
  k14: 74.6000,
  k15: 31.3000,
  k16: 87.7000,
  k17: 44.4000,
  k18: 1.1000,
  k19: 57.5000,
  k20: 14.2000,
  k21: 70.6000,
  k22: 27.3000,
  k23: 83.7000,
  k24: 40.4000,
  k25: 96.8000,
  k26: 53.5000,
  k27: 10.2000,
  k28: 66.6000,
  k29: 23.3000,
  k30: 79.7000,
  k31: 36.4000,
  k32: 92.8000,
  k33: 49.5000,
  k34: 6.2000,
  k35: 62.6000,
  k36: 19.3000,
  k37: 75.7000,
  k38: 32.4000,
  k39: 88.8000,
  k40: 45.5000,
  k41: 2.2000,
  k42: 58.6000,
  k43: 15.3000,
  k44: 71.7000,
  k45: 28.4000,
  k46: 84.8000,
  k47: 41.5000,
  k48: 97.9000,
  k49: 54.6000,
  k50: 11.3000,
  k51: 67.7000,
  k52: 24.4000,
  k53: 80.8000,
  k54: 37.5000,
  k55: 93.9000,
  k56: 50.6000,
  k57: 7.3000,
  k58: 63.7000,
  k59: 20.4000,
  k60: 76.8000,
  k61: 33.5000,
  k62: 89.9000,
  k63: 46.6000,
  k64: 3.3000,
  k65: 59.7000,
  k66: 16.4000,
  k67: 72.8000,
  k68: 29.5000,
  k69: 85.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_077_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_077_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_077_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_077_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_077_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_077_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_077_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_077_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_077_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_077_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_077_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
