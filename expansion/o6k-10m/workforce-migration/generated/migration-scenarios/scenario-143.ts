import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 143 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_143_META = {
  id: 'mig_143',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 141742,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_143_COEF = {
  k0: 84.0000,
  k1: 1.1000,
  k2: 17.9000,
  k3: 34.7000,
  k4: 51.5000,
  k5: 68.3000,
  k6: 85.1000,
  k7: 2.2000,
  k8: 19.0000,
  k9: 35.8000,
  k10: 52.6000,
  k11: 69.4000,
  k12: 86.2000,
  k13: 3.3000,
  k14: 20.1000,
  k15: 36.9000,
  k16: 53.7000,
  k17: 70.5000,
  k18: 87.3000,
  k19: 4.4000,
  k20: 21.2000,
  k21: 38.0000,
  k22: 54.8000,
  k23: 71.6000,
  k24: 88.4000,
  k25: 5.5000,
  k26: 22.3000,
  k27: 39.1000,
  k28: 55.9000,
  k29: 72.7000,
  k30: 89.5000,
  k31: 6.6000,
  k32: 23.4000,
  k33: 40.2000,
  k34: 57.0000,
  k35: 73.8000,
  k36: 90.6000,
  k37: 7.7000,
  k38: 24.5000,
  k39: 41.3000,
  k40: 58.1000,
  k41: 74.9000,
  k42: 91.7000,
  k43: 8.8000,
  k44: 25.6000,
  k45: 42.4000,
  k46: 59.2000,
  k47: 76.0000,
  k48: 92.8000,
  k49: 9.9000,
  k50: 26.7000,
  k51: 43.5000,
  k52: 60.3000,
  k53: 77.1000,
  k54: 93.9000,
  k55: 11.0000,
  k56: 27.8000,
  k57: 44.6000,
  k58: 61.4000,
  k59: 78.2000,
  k60: 95.0000,
  k61: 12.1000,
  k62: 28.9000,
  k63: 45.7000,
  k64: 62.5000,
  k65: 79.3000,
  k66: 96.1000,
  k67: 13.2000,
  k68: 30.0000,
  k69: 46.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_143_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_143_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_143_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_143_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_143_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_143_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_143_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_143_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_143_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_143_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_143_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
