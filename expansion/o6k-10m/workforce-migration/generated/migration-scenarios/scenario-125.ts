import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 125 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_125_META = {
  id: 'mig_125',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 123904,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_125_COEF = {
  k0: 38.3000,
  k1: 65.9000,
  k2: 93.5000,
  k3: 21.4000,
  k4: 49.0000,
  k5: 76.6000,
  k6: 4.5000,
  k7: 32.1000,
  k8: 59.7000,
  k9: 87.3000,
  k10: 15.2000,
  k11: 42.8000,
  k12: 70.4000,
  k13: 98.0000,
  k14: 25.9000,
  k15: 53.5000,
  k16: 81.1000,
  k17: 9.0000,
  k18: 36.6000,
  k19: 64.2000,
  k20: 91.8000,
  k21: 19.7000,
  k22: 47.3000,
  k23: 74.9000,
  k24: 2.8000,
  k25: 30.4000,
  k26: 58.0000,
  k27: 85.6000,
  k28: 13.5000,
  k29: 41.1000,
  k30: 68.7000,
  k31: 96.3000,
  k32: 24.2000,
  k33: 51.8000,
  k34: 79.4000,
  k35: 7.3000,
  k36: 34.9000,
  k37: 62.5000,
  k38: 90.1000,
  k39: 18.0000,
  k40: 45.6000,
  k41: 73.2000,
  k42: 1.1000,
  k43: 28.7000,
  k44: 56.3000,
  k45: 83.9000,
  k46: 11.8000,
  k47: 39.4000,
  k48: 67.0000,
  k49: 94.6000,
  k50: 22.5000,
  k51: 50.1000,
  k52: 77.7000,
  k53: 5.6000,
  k54: 33.2000,
  k55: 60.8000,
  k56: 88.4000,
  k57: 16.3000,
  k58: 43.9000,
  k59: 71.5000,
  k60: 99.1000,
  k61: 27.0000,
  k62: 54.6000,
  k63: 82.2000,
  k64: 10.1000,
  k65: 37.7000,
  k66: 65.3000,
  k67: 92.9000,
  k68: 20.8000,
  k69: 48.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_125_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_125_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_125_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_125_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_125_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_125_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_125_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_125_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_125_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_125_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_125_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
