import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 036 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_036_META = {
  id: 'mig_036',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 35705,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_036_COEF = {
  k0: 6.2000,
  k1: 87.2000,
  k2: 68.5000,
  k3: 49.8000,
  k4: 31.1000,
  k5: 12.4000,
  k6: 93.4000,
  k7: 74.7000,
  k8: 56.0000,
  k9: 37.3000,
  k10: 18.6000,
  k11: 99.6000,
  k12: 80.9000,
  k13: 62.2000,
  k14: 43.5000,
  k15: 24.8000,
  k16: 6.1000,
  k17: 87.1000,
  k18: 68.4000,
  k19: 49.7000,
  k20: 31.0000,
  k21: 12.3000,
  k22: 93.3000,
  k23: 74.6000,
  k24: 55.9000,
  k25: 37.2000,
  k26: 18.5000,
  k27: 99.5000,
  k28: 80.8000,
  k29: 62.1000,
  k30: 43.4000,
  k31: 24.7000,
  k32: 6.0000,
  k33: 87.0000,
  k34: 68.3000,
  k35: 49.6000,
  k36: 30.9000,
  k37: 12.2000,
  k38: 93.2000,
  k39: 74.5000,
  k40: 55.8000,
  k41: 37.1000,
  k42: 18.4000,
  k43: 99.4000,
  k44: 80.7000,
  k45: 62.0000,
  k46: 43.3000,
  k47: 24.6000,
  k48: 5.9000,
  k49: 86.9000,
  k50: 68.2000,
  k51: 49.5000,
  k52: 30.8000,
  k53: 12.1000,
  k54: 93.1000,
  k55: 74.4000,
  k56: 55.7000,
  k57: 37.0000,
  k58: 18.3000,
  k59: 99.3000,
  k60: 80.6000,
  k61: 61.9000,
  k62: 43.2000,
  k63: 24.5000,
  k64: 5.8000,
  k65: 86.8000,
  k66: 68.1000,
  k67: 49.4000,
  k68: 30.7000,
  k69: 12.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_036_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_036_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_036_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_036_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_036_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_036_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_036_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_036_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_036_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_036_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_036_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
