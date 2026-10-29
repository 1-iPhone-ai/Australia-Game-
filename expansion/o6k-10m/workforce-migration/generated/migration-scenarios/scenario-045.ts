import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 045 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_045_META = {
  id: 'mig_045',
  regionId: 'TAS' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 44624,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_045_COEF = {
  k0: 78.9000,
  k1: 54.8000,
  k2: 30.7000,
  k3: 6.6000,
  k4: 82.2000,
  k5: 58.1000,
  k6: 34.0000,
  k7: 9.9000,
  k8: 85.5000,
  k9: 61.4000,
  k10: 37.3000,
  k11: 13.2000,
  k12: 88.8000,
  k13: 64.7000,
  k14: 40.6000,
  k15: 16.5000,
  k16: 92.1000,
  k17: 68.0000,
  k18: 43.9000,
  k19: 19.8000,
  k20: 95.4000,
  k21: 71.3000,
  k22: 47.2000,
  k23: 23.1000,
  k24: 98.7000,
  k25: 74.6000,
  k26: 50.5000,
  k27: 26.4000,
  k28: 2.3000,
  k29: 77.9000,
  k30: 53.8000,
  k31: 29.7000,
  k32: 5.6000,
  k33: 81.2000,
  k34: 57.1000,
  k35: 33.0000,
  k36: 8.9000,
  k37: 84.5000,
  k38: 60.4000,
  k39: 36.3000,
  k40: 12.2000,
  k41: 87.8000,
  k42: 63.7000,
  k43: 39.6000,
  k44: 15.5000,
  k45: 91.1000,
  k46: 67.0000,
  k47: 42.9000,
  k48: 18.8000,
  k49: 94.4000,
  k50: 70.3000,
  k51: 46.2000,
  k52: 22.1000,
  k53: 97.7000,
  k54: 73.6000,
  k55: 49.5000,
  k56: 25.4000,
  k57: 1.3000,
  k58: 76.9000,
  k59: 52.8000,
  k60: 28.7000,
  k61: 4.6000,
  k62: 80.2000,
  k63: 56.1000,
  k64: 32.0000,
  k65: 7.9000,
  k66: 83.5000,
  k67: 59.4000,
  k68: 35.3000,
  k69: 11.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_045_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_045_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_045_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_045_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_045_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_045_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_045_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_045_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_045_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_045_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_045_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
