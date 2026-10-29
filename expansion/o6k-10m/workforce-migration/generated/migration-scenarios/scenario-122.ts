import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 122 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_122_META = {
  id: 'mig_122',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 120931,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_122_COEF = {
  k0: 47.3000,
  k1: 76.7000,
  k2: 6.4000,
  k3: 35.8000,
  k4: 65.2000,
  k5: 94.6000,
  k6: 24.3000,
  k7: 53.7000,
  k8: 83.1000,
  k9: 12.8000,
  k10: 42.2000,
  k11: 71.6000,
  k12: 1.3000,
  k13: 30.7000,
  k14: 60.1000,
  k15: 89.5000,
  k16: 19.2000,
  k17: 48.6000,
  k18: 78.0000,
  k19: 7.7000,
  k20: 37.1000,
  k21: 66.5000,
  k22: 95.9000,
  k23: 25.6000,
  k24: 55.0000,
  k25: 84.4000,
  k26: 14.1000,
  k27: 43.5000,
  k28: 72.9000,
  k29: 2.6000,
  k30: 32.0000,
  k31: 61.4000,
  k32: 90.8000,
  k33: 20.5000,
  k34: 49.9000,
  k35: 79.3000,
  k36: 9.0000,
  k37: 38.4000,
  k38: 67.8000,
  k39: 97.2000,
  k40: 26.9000,
  k41: 56.3000,
  k42: 85.7000,
  k43: 15.4000,
  k44: 44.8000,
  k45: 74.2000,
  k46: 3.9000,
  k47: 33.3000,
  k48: 62.7000,
  k49: 92.1000,
  k50: 21.8000,
  k51: 51.2000,
  k52: 80.6000,
  k53: 10.3000,
  k54: 39.7000,
  k55: 69.1000,
  k56: 98.5000,
  k57: 28.2000,
  k58: 57.6000,
  k59: 87.0000,
  k60: 16.7000,
  k61: 46.1000,
  k62: 75.5000,
  k63: 5.2000,
  k64: 34.6000,
  k65: 64.0000,
  k66: 93.4000,
  k67: 23.1000,
  k68: 52.5000,
  k69: 81.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_122_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_122_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_122_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_122_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_122_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_122_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_122_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_122_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_122_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_122_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_122_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
