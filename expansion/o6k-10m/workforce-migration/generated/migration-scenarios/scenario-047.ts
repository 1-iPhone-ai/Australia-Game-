import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 047 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_047_META = {
  id: 'mig_047',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'agriculture' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 46606,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_047_COEF = {
  k0: 72.9000,
  k1: 47.6000,
  k2: 22.3000,
  k3: 96.7000,
  k4: 71.4000,
  k5: 46.1000,
  k6: 20.8000,
  k7: 95.2000,
  k8: 69.9000,
  k9: 44.6000,
  k10: 19.3000,
  k11: 93.7000,
  k12: 68.4000,
  k13: 43.1000,
  k14: 17.8000,
  k15: 92.2000,
  k16: 66.9000,
  k17: 41.6000,
  k18: 16.3000,
  k19: 90.7000,
  k20: 65.4000,
  k21: 40.1000,
  k22: 14.8000,
  k23: 89.2000,
  k24: 63.9000,
  k25: 38.6000,
  k26: 13.3000,
  k27: 87.7000,
  k28: 62.4000,
  k29: 37.1000,
  k30: 11.8000,
  k31: 86.2000,
  k32: 60.9000,
  k33: 35.6000,
  k34: 10.3000,
  k35: 84.7000,
  k36: 59.4000,
  k37: 34.1000,
  k38: 8.8000,
  k39: 83.2000,
  k40: 57.9000,
  k41: 32.6000,
  k42: 7.3000,
  k43: 81.7000,
  k44: 56.4000,
  k45: 31.1000,
  k46: 5.8000,
  k47: 80.2000,
  k48: 54.9000,
  k49: 29.6000,
  k50: 4.3000,
  k51: 78.7000,
  k52: 53.4000,
  k53: 28.1000,
  k54: 2.8000,
  k55: 77.2000,
  k56: 51.9000,
  k57: 26.6000,
  k58: 1.3000,
  k59: 75.7000,
  k60: 50.4000,
  k61: 25.1000,
  k62: 99.5000,
  k63: 74.2000,
  k64: 48.9000,
  k65: 23.6000,
  k66: 98.0000,
  k67: 72.7000,
  k68: 47.4000,
  k69: 22.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_047_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_047_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_047_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_047_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_047_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_047_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_047_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_047_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_047_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_047_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_047_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
