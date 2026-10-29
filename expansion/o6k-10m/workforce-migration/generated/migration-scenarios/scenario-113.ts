import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 113 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_113_META = {
  id: 'mig_113',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 112012,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_113_COEF = {
  k0: 74.3000,
  k1: 9.4000,
  k2: 44.2000,
  k3: 79.0000,
  k4: 14.1000,
  k5: 48.9000,
  k6: 83.7000,
  k7: 18.8000,
  k8: 53.6000,
  k9: 88.4000,
  k10: 23.5000,
  k11: 58.3000,
  k12: 93.1000,
  k13: 28.2000,
  k14: 63.0000,
  k15: 97.8000,
  k16: 32.9000,
  k17: 67.7000,
  k18: 2.8000,
  k19: 37.6000,
  k20: 72.4000,
  k21: 7.5000,
  k22: 42.3000,
  k23: 77.1000,
  k24: 12.2000,
  k25: 47.0000,
  k26: 81.8000,
  k27: 16.9000,
  k28: 51.7000,
  k29: 86.5000,
  k30: 21.6000,
  k31: 56.4000,
  k32: 91.2000,
  k33: 26.3000,
  k34: 61.1000,
  k35: 95.9000,
  k36: 31.0000,
  k37: 65.8000,
  k38: 0.9000,
  k39: 35.7000,
  k40: 70.5000,
  k41: 5.6000,
  k42: 40.4000,
  k43: 75.2000,
  k44: 10.3000,
  k45: 45.1000,
  k46: 79.9000,
  k47: 15.0000,
  k48: 49.8000,
  k49: 84.6000,
  k50: 19.7000,
  k51: 54.5000,
  k52: 89.3000,
  k53: 24.4000,
  k54: 59.2000,
  k55: 94.0000,
  k56: 29.1000,
  k57: 63.9000,
  k58: 98.7000,
  k59: 33.8000,
  k60: 68.6000,
  k61: 3.7000,
  k62: 38.5000,
  k63: 73.3000,
  k64: 8.4000,
  k65: 43.2000,
  k66: 78.0000,
  k67: 13.1000,
  k68: 47.9000,
  k69: 82.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_113_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_113_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_113_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_113_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_113_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_113_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_113_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_113_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_113_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_113_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_113_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
