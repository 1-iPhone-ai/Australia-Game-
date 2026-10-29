import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 061 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_061_META = {
  id: 'mig_061',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 60480,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_061_COEF = {
  k0: 30.9000,
  k1: 96.9000,
  k2: 63.2000,
  k3: 29.5000,
  k4: 95.5000,
  k5: 61.8000,
  k6: 28.1000,
  k7: 94.1000,
  k8: 60.4000,
  k9: 26.7000,
  k10: 92.7000,
  k11: 59.0000,
  k12: 25.3000,
  k13: 91.3000,
  k14: 57.6000,
  k15: 23.9000,
  k16: 89.9000,
  k17: 56.2000,
  k18: 22.5000,
  k19: 88.5000,
  k20: 54.8000,
  k21: 21.1000,
  k22: 87.1000,
  k23: 53.4000,
  k24: 19.7000,
  k25: 85.7000,
  k26: 52.0000,
  k27: 18.3000,
  k28: 84.3000,
  k29: 50.6000,
  k30: 16.9000,
  k31: 82.9000,
  k32: 49.2000,
  k33: 15.5000,
  k34: 81.5000,
  k35: 47.8000,
  k36: 14.1000,
  k37: 80.1000,
  k38: 46.4000,
  k39: 12.7000,
  k40: 78.7000,
  k41: 45.0000,
  k42: 11.3000,
  k43: 77.3000,
  k44: 43.6000,
  k45: 9.9000,
  k46: 75.9000,
  k47: 42.2000,
  k48: 8.5000,
  k49: 74.5000,
  k50: 40.8000,
  k51: 7.1000,
  k52: 73.1000,
  k53: 39.4000,
  k54: 5.7000,
  k55: 71.7000,
  k56: 38.0000,
  k57: 4.3000,
  k58: 70.3000,
  k59: 36.6000,
  k60: 2.9000,
  k61: 68.9000,
  k62: 35.2000,
  k63: 1.5000,
  k64: 67.5000,
  k65: 33.8000,
  k66: 0.1000,
  k67: 66.1000,
  k68: 32.4000,
  k69: 98.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_061_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_061_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_061_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_061_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_061_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_061_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_061_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_061_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_061_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_061_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_061_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
