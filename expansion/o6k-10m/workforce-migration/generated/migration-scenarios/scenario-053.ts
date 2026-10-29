import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 053 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_053_META = {
  id: 'mig_053',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 52552,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_053_COEF = {
  k0: 54.9000,
  k1: 26.0000,
  k2: 96.8000,
  k3: 67.9000,
  k4: 39.0000,
  k5: 10.1000,
  k6: 80.9000,
  k7: 52.0000,
  k8: 23.1000,
  k9: 93.9000,
  k10: 65.0000,
  k11: 36.1000,
  k12: 7.2000,
  k13: 78.0000,
  k14: 49.1000,
  k15: 20.2000,
  k16: 91.0000,
  k17: 62.1000,
  k18: 33.2000,
  k19: 4.3000,
  k20: 75.1000,
  k21: 46.2000,
  k22: 17.3000,
  k23: 88.1000,
  k24: 59.2000,
  k25: 30.3000,
  k26: 1.4000,
  k27: 72.2000,
  k28: 43.3000,
  k29: 14.4000,
  k30: 85.2000,
  k31: 56.3000,
  k32: 27.4000,
  k33: 98.2000,
  k34: 69.3000,
  k35: 40.4000,
  k36: 11.5000,
  k37: 82.3000,
  k38: 53.4000,
  k39: 24.5000,
  k40: 95.3000,
  k41: 66.4000,
  k42: 37.5000,
  k43: 8.6000,
  k44: 79.4000,
  k45: 50.5000,
  k46: 21.6000,
  k47: 92.4000,
  k48: 63.5000,
  k49: 34.6000,
  k50: 5.7000,
  k51: 76.5000,
  k52: 47.6000,
  k53: 18.7000,
  k54: 89.5000,
  k55: 60.6000,
  k56: 31.7000,
  k57: 2.8000,
  k58: 73.6000,
  k59: 44.7000,
  k60: 15.8000,
  k61: 86.6000,
  k62: 57.7000,
  k63: 28.8000,
  k64: 99.6000,
  k65: 70.7000,
  k66: 41.8000,
  k67: 12.9000,
  k68: 83.7000,
  k69: 54.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_053_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_053_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_053_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_053_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_053_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_053_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_053_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_053_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_053_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_053_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_053_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
