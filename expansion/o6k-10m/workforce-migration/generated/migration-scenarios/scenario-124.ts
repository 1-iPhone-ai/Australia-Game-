import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 124 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_124_META = {
  id: 'mig_124',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 122913,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_124_COEF = {
  k0: 41.3000,
  k1: 69.5000,
  k2: 97.7000,
  k3: 26.2000,
  k4: 54.4000,
  k5: 82.6000,
  k6: 11.1000,
  k7: 39.3000,
  k8: 67.5000,
  k9: 95.7000,
  k10: 24.2000,
  k11: 52.4000,
  k12: 80.6000,
  k13: 9.1000,
  k14: 37.3000,
  k15: 65.5000,
  k16: 93.7000,
  k17: 22.2000,
  k18: 50.4000,
  k19: 78.6000,
  k20: 7.1000,
  k21: 35.3000,
  k22: 63.5000,
  k23: 91.7000,
  k24: 20.2000,
  k25: 48.4000,
  k26: 76.6000,
  k27: 5.1000,
  k28: 33.3000,
  k29: 61.5000,
  k30: 89.7000,
  k31: 18.2000,
  k32: 46.4000,
  k33: 74.6000,
  k34: 3.1000,
  k35: 31.3000,
  k36: 59.5000,
  k37: 87.7000,
  k38: 16.2000,
  k39: 44.4000,
  k40: 72.6000,
  k41: 1.1000,
  k42: 29.3000,
  k43: 57.5000,
  k44: 85.7000,
  k45: 14.2000,
  k46: 42.4000,
  k47: 70.6000,
  k48: 98.8000,
  k49: 27.3000,
  k50: 55.5000,
  k51: 83.7000,
  k52: 12.2000,
  k53: 40.4000,
  k54: 68.6000,
  k55: 96.8000,
  k56: 25.3000,
  k57: 53.5000,
  k58: 81.7000,
  k59: 10.2000,
  k60: 38.4000,
  k61: 66.6000,
  k62: 94.8000,
  k63: 23.3000,
  k64: 51.5000,
  k65: 79.7000,
  k66: 8.2000,
  k67: 36.4000,
  k68: 64.6000,
  k69: 92.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_124_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_124_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_124_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_124_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_124_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_124_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_124_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_124_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_124_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_124_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_124_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
