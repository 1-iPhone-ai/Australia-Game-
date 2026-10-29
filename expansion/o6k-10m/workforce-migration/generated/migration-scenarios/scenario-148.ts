import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 148 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_148_META = {
  id: 'mig_148',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 146697,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_148_COEF = {
  k0: 69.0000,
  k1: 82.8000,
  k2: 96.6000,
  k3: 10.7000,
  k4: 24.5000,
  k5: 38.3000,
  k6: 52.1000,
  k7: 65.9000,
  k8: 79.7000,
  k9: 93.5000,
  k10: 7.6000,
  k11: 21.4000,
  k12: 35.2000,
  k13: 49.0000,
  k14: 62.8000,
  k15: 76.6000,
  k16: 90.4000,
  k17: 4.5000,
  k18: 18.3000,
  k19: 32.1000,
  k20: 45.9000,
  k21: 59.7000,
  k22: 73.5000,
  k23: 87.3000,
  k24: 1.4000,
  k25: 15.2000,
  k26: 29.0000,
  k27: 42.8000,
  k28: 56.6000,
  k29: 70.4000,
  k30: 84.2000,
  k31: 98.0000,
  k32: 12.1000,
  k33: 25.9000,
  k34: 39.7000,
  k35: 53.5000,
  k36: 67.3000,
  k37: 81.1000,
  k38: 94.9000,
  k39: 9.0000,
  k40: 22.8000,
  k41: 36.6000,
  k42: 50.4000,
  k43: 64.2000,
  k44: 78.0000,
  k45: 91.8000,
  k46: 5.9000,
  k47: 19.7000,
  k48: 33.5000,
  k49: 47.3000,
  k50: 61.1000,
  k51: 74.9000,
  k52: 88.7000,
  k53: 2.8000,
  k54: 16.6000,
  k55: 30.4000,
  k56: 44.2000,
  k57: 58.0000,
  k58: 71.8000,
  k59: 85.6000,
  k60: 99.4000,
  k61: 13.5000,
  k62: 27.3000,
  k63: 41.1000,
  k64: 54.9000,
  k65: 68.7000,
  k66: 82.5000,
  k67: 96.3000,
  k68: 10.4000,
  k69: 24.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_148_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_148_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_148_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_148_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_148_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_148_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_148_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_148_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_148_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_148_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_148_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
