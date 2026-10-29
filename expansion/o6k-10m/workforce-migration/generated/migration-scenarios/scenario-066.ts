import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 066 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_066_META = {
  id: 'mig_066',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 65435,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_066_COEF = {
  k0: 15.9000,
  k1: 78.9000,
  k2: 42.2000,
  k3: 5.5000,
  k4: 68.5000,
  k5: 31.8000,
  k6: 94.8000,
  k7: 58.1000,
  k8: 21.4000,
  k9: 84.4000,
  k10: 47.7000,
  k11: 11.0000,
  k12: 74.0000,
  k13: 37.3000,
  k14: 0.6000,
  k15: 63.6000,
  k16: 26.9000,
  k17: 89.9000,
  k18: 53.2000,
  k19: 16.5000,
  k20: 79.5000,
  k21: 42.8000,
  k22: 6.1000,
  k23: 69.1000,
  k24: 32.4000,
  k25: 95.4000,
  k26: 58.7000,
  k27: 22.0000,
  k28: 85.0000,
  k29: 48.3000,
  k30: 11.6000,
  k31: 74.6000,
  k32: 37.9000,
  k33: 1.2000,
  k34: 64.2000,
  k35: 27.5000,
  k36: 90.5000,
  k37: 53.8000,
  k38: 17.1000,
  k39: 80.1000,
  k40: 43.4000,
  k41: 6.7000,
  k42: 69.7000,
  k43: 33.0000,
  k44: 96.0000,
  k45: 59.3000,
  k46: 22.6000,
  k47: 85.6000,
  k48: 48.9000,
  k49: 12.2000,
  k50: 75.2000,
  k51: 38.5000,
  k52: 1.8000,
  k53: 64.8000,
  k54: 28.1000,
  k55: 91.1000,
  k56: 54.4000,
  k57: 17.7000,
  k58: 80.7000,
  k59: 44.0000,
  k60: 7.3000,
  k61: 70.3000,
  k62: 33.6000,
  k63: 96.6000,
  k64: 59.9000,
  k65: 23.2000,
  k66: 86.2000,
  k67: 49.5000,
  k68: 12.8000,
  k69: 75.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_066_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_066_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_066_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_066_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_066_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_066_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_066_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_066_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_066_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_066_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_066_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
