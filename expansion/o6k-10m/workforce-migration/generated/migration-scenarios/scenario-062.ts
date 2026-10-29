import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 062 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_062_META = {
  id: 'mig_062',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 61471,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_062_COEF = {
  k0: 27.9000,
  k1: 93.3000,
  k2: 59.0000,
  k3: 24.7000,
  k4: 90.1000,
  k5: 55.8000,
  k6: 21.5000,
  k7: 86.9000,
  k8: 52.6000,
  k9: 18.3000,
  k10: 83.7000,
  k11: 49.4000,
  k12: 15.1000,
  k13: 80.5000,
  k14: 46.2000,
  k15: 11.9000,
  k16: 77.3000,
  k17: 43.0000,
  k18: 8.7000,
  k19: 74.1000,
  k20: 39.8000,
  k21: 5.5000,
  k22: 70.9000,
  k23: 36.6000,
  k24: 2.3000,
  k25: 67.7000,
  k26: 33.4000,
  k27: 98.8000,
  k28: 64.5000,
  k29: 30.2000,
  k30: 95.6000,
  k31: 61.3000,
  k32: 27.0000,
  k33: 92.4000,
  k34: 58.1000,
  k35: 23.8000,
  k36: 89.2000,
  k37: 54.9000,
  k38: 20.6000,
  k39: 86.0000,
  k40: 51.7000,
  k41: 17.4000,
  k42: 82.8000,
  k43: 48.5000,
  k44: 14.2000,
  k45: 79.6000,
  k46: 45.3000,
  k47: 11.0000,
  k48: 76.4000,
  k49: 42.1000,
  k50: 7.8000,
  k51: 73.2000,
  k52: 38.9000,
  k53: 4.6000,
  k54: 70.0000,
  k55: 35.7000,
  k56: 1.4000,
  k57: 66.8000,
  k58: 32.5000,
  k59: 97.9000,
  k60: 63.6000,
  k61: 29.3000,
  k62: 94.7000,
  k63: 60.4000,
  k64: 26.1000,
  k65: 91.5000,
  k66: 57.2000,
  k67: 22.9000,
  k68: 88.3000,
  k69: 54.0000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_062_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_062_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_062_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_062_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_062_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_062_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_062_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_062_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_062_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_062_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_062_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
