import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 054 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_054_META = {
  id: 'mig_054',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 53543,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_054_COEF = {
  k0: 51.9000,
  k1: 22.4000,
  k2: 92.6000,
  k3: 63.1000,
  k4: 33.6000,
  k5: 4.1000,
  k6: 74.3000,
  k7: 44.8000,
  k8: 15.3000,
  k9: 85.5000,
  k10: 56.0000,
  k11: 26.5000,
  k12: 96.7000,
  k13: 67.2000,
  k14: 37.7000,
  k15: 8.2000,
  k16: 78.4000,
  k17: 48.9000,
  k18: 19.4000,
  k19: 89.6000,
  k20: 60.1000,
  k21: 30.6000,
  k22: 1.1000,
  k23: 71.3000,
  k24: 41.8000,
  k25: 12.3000,
  k26: 82.5000,
  k27: 53.0000,
  k28: 23.5000,
  k29: 93.7000,
  k30: 64.2000,
  k31: 34.7000,
  k32: 5.2000,
  k33: 75.4000,
  k34: 45.9000,
  k35: 16.4000,
  k36: 86.6000,
  k37: 57.1000,
  k38: 27.6000,
  k39: 97.8000,
  k40: 68.3000,
  k41: 38.8000,
  k42: 9.3000,
  k43: 79.5000,
  k44: 50.0000,
  k45: 20.5000,
  k46: 90.7000,
  k47: 61.2000,
  k48: 31.7000,
  k49: 2.2000,
  k50: 72.4000,
  k51: 42.9000,
  k52: 13.4000,
  k53: 83.6000,
  k54: 54.1000,
  k55: 24.6000,
  k56: 94.8000,
  k57: 65.3000,
  k58: 35.8000,
  k59: 6.3000,
  k60: 76.5000,
  k61: 47.0000,
  k62: 17.5000,
  k63: 87.7000,
  k64: 58.2000,
  k65: 28.7000,
  k66: 98.9000,
  k67: 69.4000,
  k68: 39.9000,
  k69: 10.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_054_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_054_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_054_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_054_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_054_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_054_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_054_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_054_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_054_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_054_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_054_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
