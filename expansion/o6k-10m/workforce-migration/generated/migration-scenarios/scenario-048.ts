import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 048 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_048_META = {
  id: 'mig_048',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 47597,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_048_COEF = {
  k0: 69.9000,
  k1: 44.0000,
  k2: 18.1000,
  k3: 91.9000,
  k4: 66.0000,
  k5: 40.1000,
  k6: 14.2000,
  k7: 88.0000,
  k8: 62.1000,
  k9: 36.2000,
  k10: 10.3000,
  k11: 84.1000,
  k12: 58.2000,
  k13: 32.3000,
  k14: 6.4000,
  k15: 80.2000,
  k16: 54.3000,
  k17: 28.4000,
  k18: 2.5000,
  k19: 76.3000,
  k20: 50.4000,
  k21: 24.5000,
  k22: 98.3000,
  k23: 72.4000,
  k24: 46.5000,
  k25: 20.6000,
  k26: 94.4000,
  k27: 68.5000,
  k28: 42.6000,
  k29: 16.7000,
  k30: 90.5000,
  k31: 64.6000,
  k32: 38.7000,
  k33: 12.8000,
  k34: 86.6000,
  k35: 60.7000,
  k36: 34.8000,
  k37: 8.9000,
  k38: 82.7000,
  k39: 56.8000,
  k40: 30.9000,
  k41: 5.0000,
  k42: 78.8000,
  k43: 52.9000,
  k44: 27.0000,
  k45: 1.1000,
  k46: 74.9000,
  k47: 49.0000,
  k48: 23.1000,
  k49: 96.9000,
  k50: 71.0000,
  k51: 45.1000,
  k52: 19.2000,
  k53: 93.0000,
  k54: 67.1000,
  k55: 41.2000,
  k56: 15.3000,
  k57: 89.1000,
  k58: 63.2000,
  k59: 37.3000,
  k60: 11.4000,
  k61: 85.2000,
  k62: 59.3000,
  k63: 33.4000,
  k64: 7.5000,
  k65: 81.3000,
  k66: 55.4000,
  k67: 29.5000,
  k68: 3.6000,
  k69: 77.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_048_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_048_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_048_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_048_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_048_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_048_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_048_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_048_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_048_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_048_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_048_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
