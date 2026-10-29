import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 140 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_140_META = {
  id: 'mig_140',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 138769,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_140_COEF = {
  k0: 93.0000,
  k1: 11.9000,
  k2: 30.5000,
  k3: 49.1000,
  k4: 67.7000,
  k5: 86.3000,
  k6: 5.2000,
  k7: 23.8000,
  k8: 42.4000,
  k9: 61.0000,
  k10: 79.6000,
  k11: 98.2000,
  k12: 17.1000,
  k13: 35.7000,
  k14: 54.3000,
  k15: 72.9000,
  k16: 91.5000,
  k17: 10.4000,
  k18: 29.0000,
  k19: 47.6000,
  k20: 66.2000,
  k21: 84.8000,
  k22: 3.7000,
  k23: 22.3000,
  k24: 40.9000,
  k25: 59.5000,
  k26: 78.1000,
  k27: 96.7000,
  k28: 15.6000,
  k29: 34.2000,
  k30: 52.8000,
  k31: 71.4000,
  k32: 90.0000,
  k33: 8.9000,
  k34: 27.5000,
  k35: 46.1000,
  k36: 64.7000,
  k37: 83.3000,
  k38: 2.2000,
  k39: 20.8000,
  k40: 39.4000,
  k41: 58.0000,
  k42: 76.6000,
  k43: 95.2000,
  k44: 14.1000,
  k45: 32.7000,
  k46: 51.3000,
  k47: 69.9000,
  k48: 88.5000,
  k49: 7.4000,
  k50: 26.0000,
  k51: 44.6000,
  k52: 63.2000,
  k53: 81.8000,
  k54: 0.7000,
  k55: 19.3000,
  k56: 37.9000,
  k57: 56.5000,
  k58: 75.1000,
  k59: 93.7000,
  k60: 12.6000,
  k61: 31.2000,
  k62: 49.8000,
  k63: 68.4000,
  k64: 87.0000,
  k65: 5.9000,
  k66: 24.5000,
  k67: 43.1000,
  k68: 61.7000,
  k69: 80.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_140_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_140_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_140_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_140_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_140_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_140_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_140_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_140_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_140_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_140_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_140_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
