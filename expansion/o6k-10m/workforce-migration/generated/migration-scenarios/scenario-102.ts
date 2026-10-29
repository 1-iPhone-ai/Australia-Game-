import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 102 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_102_META = {
  id: 'mig_102',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 101111,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_102_COEF = {
  k0: 7.6000,
  k1: 49.0000,
  k2: 90.4000,
  k3: 32.1000,
  k4: 73.5000,
  k5: 15.2000,
  k6: 56.6000,
  k7: 98.0000,
  k8: 39.7000,
  k9: 81.1000,
  k10: 22.8000,
  k11: 64.2000,
  k12: 5.9000,
  k13: 47.3000,
  k14: 88.7000,
  k15: 30.4000,
  k16: 71.8000,
  k17: 13.5000,
  k18: 54.9000,
  k19: 96.3000,
  k20: 38.0000,
  k21: 79.4000,
  k22: 21.1000,
  k23: 62.5000,
  k24: 4.2000,
  k25: 45.6000,
  k26: 87.0000,
  k27: 28.7000,
  k28: 70.1000,
  k29: 11.8000,
  k30: 53.2000,
  k31: 94.6000,
  k32: 36.3000,
  k33: 77.7000,
  k34: 19.4000,
  k35: 60.8000,
  k36: 2.5000,
  k37: 43.9000,
  k38: 85.3000,
  k39: 27.0000,
  k40: 68.4000,
  k41: 10.1000,
  k42: 51.5000,
  k43: 92.9000,
  k44: 34.6000,
  k45: 76.0000,
  k46: 17.7000,
  k47: 59.1000,
  k48: 0.8000,
  k49: 42.2000,
  k50: 83.6000,
  k51: 25.3000,
  k52: 66.7000,
  k53: 8.4000,
  k54: 49.8000,
  k55: 91.2000,
  k56: 32.9000,
  k57: 74.3000,
  k58: 16.0000,
  k59: 57.4000,
  k60: 98.8000,
  k61: 40.5000,
  k62: 81.9000,
  k63: 23.6000,
  k64: 65.0000,
  k65: 6.7000,
  k66: 48.1000,
  k67: 89.5000,
  k68: 31.2000,
  k69: 72.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_102_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_102_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_102_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_102_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_102_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_102_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_102_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_102_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_102_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_102_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_102_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
