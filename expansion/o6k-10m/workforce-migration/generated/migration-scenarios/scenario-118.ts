import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 118 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_118_META = {
  id: 'mig_118',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 116967,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_118_COEF = {
  k0: 59.3000,
  k1: 91.1000,
  k2: 23.2000,
  k3: 55.0000,
  k4: 86.8000,
  k5: 18.9000,
  k6: 50.7000,
  k7: 82.5000,
  k8: 14.6000,
  k9: 46.4000,
  k10: 78.2000,
  k11: 10.3000,
  k12: 42.1000,
  k13: 73.9000,
  k14: 6.0000,
  k15: 37.8000,
  k16: 69.6000,
  k17: 1.7000,
  k18: 33.5000,
  k19: 65.3000,
  k20: 97.1000,
  k21: 29.2000,
  k22: 61.0000,
  k23: 92.8000,
  k24: 24.9000,
  k25: 56.7000,
  k26: 88.5000,
  k27: 20.6000,
  k28: 52.4000,
  k29: 84.2000,
  k30: 16.3000,
  k31: 48.1000,
  k32: 79.9000,
  k33: 12.0000,
  k34: 43.8000,
  k35: 75.6000,
  k36: 7.7000,
  k37: 39.5000,
  k38: 71.3000,
  k39: 3.4000,
  k40: 35.2000,
  k41: 67.0000,
  k42: 98.8000,
  k43: 30.9000,
  k44: 62.7000,
  k45: 94.5000,
  k46: 26.6000,
  k47: 58.4000,
  k48: 90.2000,
  k49: 22.3000,
  k50: 54.1000,
  k51: 85.9000,
  k52: 18.0000,
  k53: 49.8000,
  k54: 81.6000,
  k55: 13.7000,
  k56: 45.5000,
  k57: 77.3000,
  k58: 9.4000,
  k59: 41.2000,
  k60: 73.0000,
  k61: 5.1000,
  k62: 36.9000,
  k63: 68.7000,
  k64: 0.8000,
  k65: 32.6000,
  k66: 64.4000,
  k67: 96.2000,
  k68: 28.3000,
  k69: 60.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_118_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_118_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_118_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_118_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_118_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_118_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_118_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_118_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_118_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_118_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_118_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
