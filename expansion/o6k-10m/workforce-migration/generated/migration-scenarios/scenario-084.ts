import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 084 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_084_META = {
  id: 'mig_084',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'logistics' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 83273,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_084_COEF = {
  k0: 61.6000,
  k1: 14.1000,
  k2: 66.3000,
  k3: 18.8000,
  k4: 71.0000,
  k5: 23.5000,
  k6: 75.7000,
  k7: 28.2000,
  k8: 80.4000,
  k9: 32.9000,
  k10: 85.1000,
  k11: 37.6000,
  k12: 89.8000,
  k13: 42.3000,
  k14: 94.5000,
  k15: 47.0000,
  k16: 99.2000,
  k17: 51.7000,
  k18: 4.2000,
  k19: 56.4000,
  k20: 8.9000,
  k21: 61.1000,
  k22: 13.6000,
  k23: 65.8000,
  k24: 18.3000,
  k25: 70.5000,
  k26: 23.0000,
  k27: 75.2000,
  k28: 27.7000,
  k29: 79.9000,
  k30: 32.4000,
  k31: 84.6000,
  k32: 37.1000,
  k33: 89.3000,
  k34: 41.8000,
  k35: 94.0000,
  k36: 46.5000,
  k37: 98.7000,
  k38: 51.2000,
  k39: 3.7000,
  k40: 55.9000,
  k41: 8.4000,
  k42: 60.6000,
  k43: 13.1000,
  k44: 65.3000,
  k45: 17.8000,
  k46: 70.0000,
  k47: 22.5000,
  k48: 74.7000,
  k49: 27.2000,
  k50: 79.4000,
  k51: 31.9000,
  k52: 84.1000,
  k53: 36.6000,
  k54: 88.8000,
  k55: 41.3000,
  k56: 93.5000,
  k57: 46.0000,
  k58: 98.2000,
  k59: 50.7000,
  k60: 3.2000,
  k61: 55.4000,
  k62: 7.9000,
  k63: 60.1000,
  k64: 12.6000,
  k65: 64.8000,
  k66: 17.3000,
  k67: 69.5000,
  k68: 22.0000,
  k69: 74.2000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_084_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_084_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_084_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_084_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_084_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_084_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_084_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_084_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_084_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_084_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_084_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
