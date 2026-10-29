import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 026 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_026_META = {
  id: 'mig_026',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 25795,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_026_COEF = {
  k0: 36.2000,
  k1: 23.5000,
  k2: 10.8000,
  k3: 97.8000,
  k4: 85.1000,
  k5: 72.4000,
  k6: 59.7000,
  k7: 47.0000,
  k8: 34.3000,
  k9: 21.6000,
  k10: 8.9000,
  k11: 95.9000,
  k12: 83.2000,
  k13: 70.5000,
  k14: 57.8000,
  k15: 45.1000,
  k16: 32.4000,
  k17: 19.7000,
  k18: 7.0000,
  k19: 94.0000,
  k20: 81.3000,
  k21: 68.6000,
  k22: 55.9000,
  k23: 43.2000,
  k24: 30.5000,
  k25: 17.8000,
  k26: 5.1000,
  k27: 92.1000,
  k28: 79.4000,
  k29: 66.7000,
  k30: 54.0000,
  k31: 41.3000,
  k32: 28.6000,
  k33: 15.9000,
  k34: 3.2000,
  k35: 90.2000,
  k36: 77.5000,
  k37: 64.8000,
  k38: 52.1000,
  k39: 39.4000,
  k40: 26.7000,
  k41: 14.0000,
  k42: 1.3000,
  k43: 88.3000,
  k44: 75.6000,
  k45: 62.9000,
  k46: 50.2000,
  k47: 37.5000,
  k48: 24.8000,
  k49: 12.1000,
  k50: 99.1000,
  k51: 86.4000,
  k52: 73.7000,
  k53: 61.0000,
  k54: 48.3000,
  k55: 35.6000,
  k56: 22.9000,
  k57: 10.2000,
  k58: 97.2000,
  k59: 84.5000,
  k60: 71.8000,
  k61: 59.1000,
  k62: 46.4000,
  k63: 33.7000,
  k64: 21.0000,
  k65: 8.3000,
  k66: 95.3000,
  k67: 82.6000,
  k68: 69.9000,
  k69: 57.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_026_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_026_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_026_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_026_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_026_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_026_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_026_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_026_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_026_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_026_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_026_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
