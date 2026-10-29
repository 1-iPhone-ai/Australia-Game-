import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 156 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_156_META = {
  id: 'mig_156',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 154625,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_156_COEF = {
  k0: 45.0000,
  k1: 54.0000,
  k2: 63.0000,
  k3: 72.0000,
  k4: 81.0000,
  k5: 90.0000,
  k6: 99.0000,
  k7: 8.3000,
  k8: 17.3000,
  k9: 26.3000,
  k10: 35.3000,
  k11: 44.3000,
  k12: 53.3000,
  k13: 62.3000,
  k14: 71.3000,
  k15: 80.3000,
  k16: 89.3000,
  k17: 98.3000,
  k18: 7.6000,
  k19: 16.6000,
  k20: 25.6000,
  k21: 34.6000,
  k22: 43.6000,
  k23: 52.6000,
  k24: 61.6000,
  k25: 70.6000,
  k26: 79.6000,
  k27: 88.6000,
  k28: 97.6000,
  k29: 6.9000,
  k30: 15.9000,
  k31: 24.9000,
  k32: 33.9000,
  k33: 42.9000,
  k34: 51.9000,
  k35: 60.9000,
  k36: 69.9000,
  k37: 78.9000,
  k38: 87.9000,
  k39: 96.9000,
  k40: 6.2000,
  k41: 15.2000,
  k42: 24.2000,
  k43: 33.2000,
  k44: 42.2000,
  k45: 51.2000,
  k46: 60.2000,
  k47: 69.2000,
  k48: 78.2000,
  k49: 87.2000,
  k50: 96.2000,
  k51: 5.5000,
  k52: 14.5000,
  k53: 23.5000,
  k54: 32.5000,
  k55: 41.5000,
  k56: 50.5000,
  k57: 59.5000,
  k58: 68.5000,
  k59: 77.5000,
  k60: 86.5000,
  k61: 95.5000,
  k62: 4.8000,
  k63: 13.8000,
  k64: 22.8000,
  k65: 31.8000,
  k66: 40.8000,
  k67: 49.8000,
  k68: 58.8000,
  k69: 67.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_156_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_156_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_156_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_156_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_156_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_156_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_156_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_156_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_156_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_156_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_156_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
