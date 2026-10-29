import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 034 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_034_META = {
  id: 'mig_034',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 33723,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_034_COEF = {
  k0: 12.2000,
  k1: 94.4000,
  k2: 76.9000,
  k3: 59.4000,
  k4: 41.9000,
  k5: 24.4000,
  k6: 6.9000,
  k7: 89.1000,
  k8: 71.6000,
  k9: 54.1000,
  k10: 36.6000,
  k11: 19.1000,
  k12: 1.6000,
  k13: 83.8000,
  k14: 66.3000,
  k15: 48.8000,
  k16: 31.3000,
  k17: 13.8000,
  k18: 96.0000,
  k19: 78.5000,
  k20: 61.0000,
  k21: 43.5000,
  k22: 26.0000,
  k23: 8.5000,
  k24: 90.7000,
  k25: 73.2000,
  k26: 55.7000,
  k27: 38.2000,
  k28: 20.7000,
  k29: 3.2000,
  k30: 85.4000,
  k31: 67.9000,
  k32: 50.4000,
  k33: 32.9000,
  k34: 15.4000,
  k35: 97.6000,
  k36: 80.1000,
  k37: 62.6000,
  k38: 45.1000,
  k39: 27.6000,
  k40: 10.1000,
  k41: 92.3000,
  k42: 74.8000,
  k43: 57.3000,
  k44: 39.8000,
  k45: 22.3000,
  k46: 4.8000,
  k47: 87.0000,
  k48: 69.5000,
  k49: 52.0000,
  k50: 34.5000,
  k51: 17.0000,
  k52: 99.2000,
  k53: 81.7000,
  k54: 64.2000,
  k55: 46.7000,
  k56: 29.2000,
  k57: 11.7000,
  k58: 93.9000,
  k59: 76.4000,
  k60: 58.9000,
  k61: 41.4000,
  k62: 23.9000,
  k63: 6.4000,
  k64: 88.6000,
  k65: 71.1000,
  k66: 53.6000,
  k67: 36.1000,
  k68: 18.6000,
  k69: 1.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_034_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_034_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_034_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_034_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_034_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_034_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_034_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_034_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_034_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_034_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_034_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
