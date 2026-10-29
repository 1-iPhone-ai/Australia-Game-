import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 060 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_060_META = {
  id: 'mig_060',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 59489,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_060_COEF = {
  k0: 33.9000,
  k1: 0.8000,
  k2: 67.4000,
  k3: 34.3000,
  k4: 1.2000,
  k5: 67.8000,
  k6: 34.7000,
  k7: 1.6000,
  k8: 68.2000,
  k9: 35.1000,
  k10: 2.0000,
  k11: 68.6000,
  k12: 35.5000,
  k13: 2.4000,
  k14: 69.0000,
  k15: 35.9000,
  k16: 2.8000,
  k17: 69.4000,
  k18: 36.3000,
  k19: 3.2000,
  k20: 69.8000,
  k21: 36.7000,
  k22: 3.6000,
  k23: 70.2000,
  k24: 37.1000,
  k25: 4.0000,
  k26: 70.6000,
  k27: 37.5000,
  k28: 4.4000,
  k29: 71.0000,
  k30: 37.9000,
  k31: 4.8000,
  k32: 71.4000,
  k33: 38.3000,
  k34: 5.2000,
  k35: 71.8000,
  k36: 38.7000,
  k37: 5.6000,
  k38: 72.2000,
  k39: 39.1000,
  k40: 6.0000,
  k41: 72.6000,
  k42: 39.5000,
  k43: 6.4000,
  k44: 73.0000,
  k45: 39.9000,
  k46: 6.8000,
  k47: 73.4000,
  k48: 40.3000,
  k49: 7.2000,
  k50: 73.8000,
  k51: 40.7000,
  k52: 7.6000,
  k53: 74.2000,
  k54: 41.1000,
  k55: 8.0000,
  k56: 74.6000,
  k57: 41.5000,
  k58: 8.4000,
  k59: 75.0000,
  k60: 41.9000,
  k61: 8.8000,
  k62: 75.4000,
  k63: 42.3000,
  k64: 9.2000,
  k65: 75.8000,
  k66: 42.7000,
  k67: 9.6000,
  k68: 76.2000,
  k69: 43.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_060_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_060_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_060_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_060_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_060_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_060_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_060_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_060_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_060_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_060_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_060_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
