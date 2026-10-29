import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 138 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_138_META = {
  id: 'mig_138',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 136787,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_138_COEF = {
  k0: 99.0000,
  k1: 19.1000,
  k2: 38.9000,
  k3: 58.7000,
  k4: 78.5000,
  k5: 98.3000,
  k6: 18.4000,
  k7: 38.2000,
  k8: 58.0000,
  k9: 77.8000,
  k10: 97.6000,
  k11: 17.7000,
  k12: 37.5000,
  k13: 57.3000,
  k14: 77.1000,
  k15: 96.9000,
  k16: 17.0000,
  k17: 36.8000,
  k18: 56.6000,
  k19: 76.4000,
  k20: 96.2000,
  k21: 16.3000,
  k22: 36.1000,
  k23: 55.9000,
  k24: 75.7000,
  k25: 95.5000,
  k26: 15.6000,
  k27: 35.4000,
  k28: 55.2000,
  k29: 75.0000,
  k30: 94.8000,
  k31: 14.9000,
  k32: 34.7000,
  k33: 54.5000,
  k34: 74.3000,
  k35: 94.1000,
  k36: 14.2000,
  k37: 34.0000,
  k38: 53.8000,
  k39: 73.6000,
  k40: 93.4000,
  k41: 13.5000,
  k42: 33.3000,
  k43: 53.1000,
  k44: 72.9000,
  k45: 92.7000,
  k46: 12.8000,
  k47: 32.6000,
  k48: 52.4000,
  k49: 72.2000,
  k50: 92.0000,
  k51: 12.1000,
  k52: 31.9000,
  k53: 51.7000,
  k54: 71.5000,
  k55: 91.3000,
  k56: 11.4000,
  k57: 31.2000,
  k58: 51.0000,
  k59: 70.8000,
  k60: 90.6000,
  k61: 10.7000,
  k62: 30.5000,
  k63: 50.3000,
  k64: 70.1000,
  k65: 89.9000,
  k66: 10.0000,
  k67: 29.8000,
  k68: 49.6000,
  k69: 69.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_138_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_138_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_138_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_138_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_138_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_138_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_138_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_138_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_138_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_138_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_138_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
