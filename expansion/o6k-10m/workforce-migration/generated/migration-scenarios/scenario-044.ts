import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 044 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_044_META = {
  id: 'mig_044',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 43633,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_044_COEF = {
  k0: 81.9000,
  k1: 58.4000,
  k2: 34.9000,
  k3: 11.4000,
  k4: 87.6000,
  k5: 64.1000,
  k6: 40.6000,
  k7: 17.1000,
  k8: 93.3000,
  k9: 69.8000,
  k10: 46.3000,
  k11: 22.8000,
  k12: 99.0000,
  k13: 75.5000,
  k14: 52.0000,
  k15: 28.5000,
  k16: 5.0000,
  k17: 81.2000,
  k18: 57.7000,
  k19: 34.2000,
  k20: 10.7000,
  k21: 86.9000,
  k22: 63.4000,
  k23: 39.9000,
  k24: 16.4000,
  k25: 92.6000,
  k26: 69.1000,
  k27: 45.6000,
  k28: 22.1000,
  k29: 98.3000,
  k30: 74.8000,
  k31: 51.3000,
  k32: 27.8000,
  k33: 4.3000,
  k34: 80.5000,
  k35: 57.0000,
  k36: 33.5000,
  k37: 10.0000,
  k38: 86.2000,
  k39: 62.7000,
  k40: 39.2000,
  k41: 15.7000,
  k42: 91.9000,
  k43: 68.4000,
  k44: 44.9000,
  k45: 21.4000,
  k46: 97.6000,
  k47: 74.1000,
  k48: 50.6000,
  k49: 27.1000,
  k50: 3.6000,
  k51: 79.8000,
  k52: 56.3000,
  k53: 32.8000,
  k54: 9.3000,
  k55: 85.5000,
  k56: 62.0000,
  k57: 38.5000,
  k58: 15.0000,
  k59: 91.2000,
  k60: 67.7000,
  k61: 44.2000,
  k62: 20.7000,
  k63: 96.9000,
  k64: 73.4000,
  k65: 49.9000,
  k66: 26.4000,
  k67: 2.9000,
  k68: 79.1000,
  k69: 55.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_044_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_044_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_044_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_044_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_044_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_044_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_044_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_044_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_044_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_044_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_044_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
