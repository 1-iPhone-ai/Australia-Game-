import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 043 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_043_META = {
  id: 'mig_043',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 42642,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_043_COEF = {
  k0: 84.9000,
  k1: 62.0000,
  k2: 39.1000,
  k3: 16.2000,
  k4: 93.0000,
  k5: 70.1000,
  k6: 47.2000,
  k7: 24.3000,
  k8: 1.4000,
  k9: 78.2000,
  k10: 55.3000,
  k11: 32.4000,
  k12: 9.5000,
  k13: 86.3000,
  k14: 63.4000,
  k15: 40.5000,
  k16: 17.6000,
  k17: 94.4000,
  k18: 71.5000,
  k19: 48.6000,
  k20: 25.7000,
  k21: 2.8000,
  k22: 79.6000,
  k23: 56.7000,
  k24: 33.8000,
  k25: 10.9000,
  k26: 87.7000,
  k27: 64.8000,
  k28: 41.9000,
  k29: 19.0000,
  k30: 95.8000,
  k31: 72.9000,
  k32: 50.0000,
  k33: 27.1000,
  k34: 4.2000,
  k35: 81.0000,
  k36: 58.1000,
  k37: 35.2000,
  k38: 12.3000,
  k39: 89.1000,
  k40: 66.2000,
  k41: 43.3000,
  k42: 20.4000,
  k43: 97.2000,
  k44: 74.3000,
  k45: 51.4000,
  k46: 28.5000,
  k47: 5.6000,
  k48: 82.4000,
  k49: 59.5000,
  k50: 36.6000,
  k51: 13.7000,
  k52: 90.5000,
  k53: 67.6000,
  k54: 44.7000,
  k55: 21.8000,
  k56: 98.6000,
  k57: 75.7000,
  k58: 52.8000,
  k59: 29.9000,
  k60: 7.0000,
  k61: 83.8000,
  k62: 60.9000,
  k63: 38.0000,
  k64: 15.1000,
  k65: 91.9000,
  k66: 69.0000,
  k67: 46.1000,
  k68: 23.2000,
  k69: 0.3000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_043_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_043_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_043_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_043_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_043_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_043_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_043_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_043_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_043_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_043_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_043_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
