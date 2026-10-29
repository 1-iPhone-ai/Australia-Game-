import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 063 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_063_META = {
  id: 'mig_063',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 62462,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_063_COEF = {
  k0: 24.9000,
  k1: 89.7000,
  k2: 54.8000,
  k3: 19.9000,
  k4: 84.7000,
  k5: 49.8000,
  k6: 14.9000,
  k7: 79.7000,
  k8: 44.8000,
  k9: 9.9000,
  k10: 74.7000,
  k11: 39.8000,
  k12: 4.9000,
  k13: 69.7000,
  k14: 34.8000,
  k15: 99.6000,
  k16: 64.7000,
  k17: 29.8000,
  k18: 94.6000,
  k19: 59.7000,
  k20: 24.8000,
  k21: 89.6000,
  k22: 54.7000,
  k23: 19.8000,
  k24: 84.6000,
  k25: 49.7000,
  k26: 14.8000,
  k27: 79.6000,
  k28: 44.7000,
  k29: 9.8000,
  k30: 74.6000,
  k31: 39.7000,
  k32: 4.8000,
  k33: 69.6000,
  k34: 34.7000,
  k35: 99.5000,
  k36: 64.6000,
  k37: 29.7000,
  k38: 94.5000,
  k39: 59.6000,
  k40: 24.7000,
  k41: 89.5000,
  k42: 54.6000,
  k43: 19.7000,
  k44: 84.5000,
  k45: 49.6000,
  k46: 14.7000,
  k47: 79.5000,
  k48: 44.6000,
  k49: 9.7000,
  k50: 74.5000,
  k51: 39.6000,
  k52: 4.7000,
  k53: 69.5000,
  k54: 34.6000,
  k55: 99.4000,
  k56: 64.5000,
  k57: 29.6000,
  k58: 94.4000,
  k59: 59.5000,
  k60: 24.6000,
  k61: 89.4000,
  k62: 54.5000,
  k63: 19.6000,
  k64: 84.4000,
  k65: 49.5000,
  k66: 14.6000,
  k67: 79.4000,
  k68: 44.5000,
  k69: 9.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_063_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_063_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_063_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_063_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_063_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_063_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_063_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_063_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_063_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_063_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_063_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
