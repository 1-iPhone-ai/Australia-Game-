import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 008 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_008_META = {
  id: 'mig_008',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 7957,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_008_COEF = {
  k0: 90.2000,
  k1: 88.3000,
  k2: 86.4000,
  k3: 84.5000,
  k4: 82.6000,
  k5: 80.7000,
  k6: 78.8000,
  k7: 76.9000,
  k8: 75.0000,
  k9: 73.1000,
  k10: 71.2000,
  k11: 69.3000,
  k12: 67.4000,
  k13: 65.5000,
  k14: 63.6000,
  k15: 61.7000,
  k16: 59.8000,
  k17: 57.9000,
  k18: 56.0000,
  k19: 54.1000,
  k20: 52.2000,
  k21: 50.3000,
  k22: 48.4000,
  k23: 46.5000,
  k24: 44.6000,
  k25: 42.7000,
  k26: 40.8000,
  k27: 38.9000,
  k28: 37.0000,
  k29: 35.1000,
  k30: 33.2000,
  k31: 31.3000,
  k32: 29.4000,
  k33: 27.5000,
  k34: 25.6000,
  k35: 23.7000,
  k36: 21.8000,
  k37: 19.9000,
  k38: 18.0000,
  k39: 16.1000,
  k40: 14.2000,
  k41: 12.3000,
  k42: 10.4000,
  k43: 8.5000,
  k44: 6.6000,
  k45: 4.7000,
  k46: 2.8000,
  k47: 0.9000,
  k48: 98.7000,
  k49: 96.8000,
  k50: 94.9000,
  k51: 93.0000,
  k52: 91.1000,
  k53: 89.2000,
  k54: 87.3000,
  k55: 85.4000,
  k56: 83.5000,
  k57: 81.6000,
  k58: 79.7000,
  k59: 77.8000,
  k60: 75.9000,
  k61: 74.0000,
  k62: 72.1000,
  k63: 70.2000,
  k64: 68.3000,
  k65: 66.4000,
  k66: 64.5000,
  k67: 62.6000,
  k68: 60.7000,
  k69: 58.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_008_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_008_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_008_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_008_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_008_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_008_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_008_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_008_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_008_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_008_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_008_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
