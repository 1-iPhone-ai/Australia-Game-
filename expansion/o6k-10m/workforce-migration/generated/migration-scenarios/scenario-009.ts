import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 009 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_009_META = {
  id: 'mig_009',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 8948,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_009_COEF = {
  k0: 87.2000,
  k1: 84.7000,
  k2: 82.2000,
  k3: 79.7000,
  k4: 77.2000,
  k5: 74.7000,
  k6: 72.2000,
  k7: 69.7000,
  k8: 67.2000,
  k9: 64.7000,
  k10: 62.2000,
  k11: 59.7000,
  k12: 57.2000,
  k13: 54.7000,
  k14: 52.2000,
  k15: 49.7000,
  k16: 47.2000,
  k17: 44.7000,
  k18: 42.2000,
  k19: 39.7000,
  k20: 37.2000,
  k21: 34.7000,
  k22: 32.2000,
  k23: 29.7000,
  k24: 27.2000,
  k25: 24.7000,
  k26: 22.2000,
  k27: 19.7000,
  k28: 17.2000,
  k29: 14.7000,
  k30: 12.2000,
  k31: 9.7000,
  k32: 7.2000,
  k33: 4.7000,
  k34: 2.2000,
  k35: 99.4000,
  k36: 96.9000,
  k37: 94.4000,
  k38: 91.9000,
  k39: 89.4000,
  k40: 86.9000,
  k41: 84.4000,
  k42: 81.9000,
  k43: 79.4000,
  k44: 76.9000,
  k45: 74.4000,
  k46: 71.9000,
  k47: 69.4000,
  k48: 66.9000,
  k49: 64.4000,
  k50: 61.9000,
  k51: 59.4000,
  k52: 56.9000,
  k53: 54.4000,
  k54: 51.9000,
  k55: 49.4000,
  k56: 46.9000,
  k57: 44.4000,
  k58: 41.9000,
  k59: 39.4000,
  k60: 36.9000,
  k61: 34.4000,
  k62: 31.9000,
  k63: 29.4000,
  k64: 26.9000,
  k65: 24.4000,
  k66: 21.9000,
  k67: 19.4000,
  k68: 16.9000,
  k69: 14.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_009_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_009_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_009_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_009_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_009_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_009_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_009_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_009_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_009_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_009_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_009_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
