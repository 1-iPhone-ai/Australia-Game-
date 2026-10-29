import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 135 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_135_META = {
  id: 'mig_135',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 133814,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_135_COEF = {
  k0: 8.3000,
  k1: 29.9000,
  k2: 51.5000,
  k3: 73.1000,
  k4: 94.7000,
  k5: 16.6000,
  k6: 38.2000,
  k7: 59.8000,
  k8: 81.4000,
  k9: 3.3000,
  k10: 24.9000,
  k11: 46.5000,
  k12: 68.1000,
  k13: 89.7000,
  k14: 11.6000,
  k15: 33.2000,
  k16: 54.8000,
  k17: 76.4000,
  k18: 98.0000,
  k19: 19.9000,
  k20: 41.5000,
  k21: 63.1000,
  k22: 84.7000,
  k23: 6.6000,
  k24: 28.2000,
  k25: 49.8000,
  k26: 71.4000,
  k27: 93.0000,
  k28: 14.9000,
  k29: 36.5000,
  k30: 58.1000,
  k31: 79.7000,
  k32: 1.6000,
  k33: 23.2000,
  k34: 44.8000,
  k35: 66.4000,
  k36: 88.0000,
  k37: 9.9000,
  k38: 31.5000,
  k39: 53.1000,
  k40: 74.7000,
  k41: 96.3000,
  k42: 18.2000,
  k43: 39.8000,
  k44: 61.4000,
  k45: 83.0000,
  k46: 4.9000,
  k47: 26.5000,
  k48: 48.1000,
  k49: 69.7000,
  k50: 91.3000,
  k51: 13.2000,
  k52: 34.8000,
  k53: 56.4000,
  k54: 78.0000,
  k55: 99.6000,
  k56: 21.5000,
  k57: 43.1000,
  k58: 64.7000,
  k59: 86.3000,
  k60: 8.2000,
  k61: 29.8000,
  k62: 51.4000,
  k63: 73.0000,
  k64: 94.6000,
  k65: 16.5000,
  k66: 38.1000,
  k67: 59.7000,
  k68: 81.3000,
  k69: 3.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_135_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_135_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_135_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_135_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_135_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_135_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_135_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_135_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_135_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_135_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_135_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
