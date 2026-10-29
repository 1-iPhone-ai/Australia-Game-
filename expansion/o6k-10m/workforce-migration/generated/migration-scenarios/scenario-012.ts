import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 012 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_012_META = {
  id: 'mig_012',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 11921,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_012_COEF = {
  k0: 78.2000,
  k1: 73.9000,
  k2: 69.6000,
  k3: 65.3000,
  k4: 61.0000,
  k5: 56.7000,
  k6: 52.4000,
  k7: 48.1000,
  k8: 43.8000,
  k9: 39.5000,
  k10: 35.2000,
  k11: 30.9000,
  k12: 26.6000,
  k13: 22.3000,
  k14: 18.0000,
  k15: 13.7000,
  k16: 9.4000,
  k17: 5.1000,
  k18: 0.8000,
  k19: 96.2000,
  k20: 91.9000,
  k21: 87.6000,
  k22: 83.3000,
  k23: 79.0000,
  k24: 74.7000,
  k25: 70.4000,
  k26: 66.1000,
  k27: 61.8000,
  k28: 57.5000,
  k29: 53.2000,
  k30: 48.9000,
  k31: 44.6000,
  k32: 40.3000,
  k33: 36.0000,
  k34: 31.7000,
  k35: 27.4000,
  k36: 23.1000,
  k37: 18.8000,
  k38: 14.5000,
  k39: 10.2000,
  k40: 5.9000,
  k41: 1.6000,
  k42: 97.0000,
  k43: 92.7000,
  k44: 88.4000,
  k45: 84.1000,
  k46: 79.8000,
  k47: 75.5000,
  k48: 71.2000,
  k49: 66.9000,
  k50: 62.6000,
  k51: 58.3000,
  k52: 54.0000,
  k53: 49.7000,
  k54: 45.4000,
  k55: 41.1000,
  k56: 36.8000,
  k57: 32.5000,
  k58: 28.2000,
  k59: 23.9000,
  k60: 19.6000,
  k61: 15.3000,
  k62: 11.0000,
  k63: 6.7000,
  k64: 2.4000,
  k65: 97.8000,
  k66: 93.5000,
  k67: 89.2000,
  k68: 84.9000,
  k69: 80.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_012_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_012_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_012_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_012_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_012_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_012_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_012_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_012_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_012_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_012_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_012_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
