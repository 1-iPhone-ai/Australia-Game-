import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 132 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_132_META = {
  id: 'mig_132',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'trades' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 130841,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_132_COEF = {
  k0: 17.3000,
  k1: 40.7000,
  k2: 64.1000,
  k3: 87.5000,
  k4: 11.2000,
  k5: 34.6000,
  k6: 58.0000,
  k7: 81.4000,
  k8: 5.1000,
  k9: 28.5000,
  k10: 51.9000,
  k11: 75.3000,
  k12: 98.7000,
  k13: 22.4000,
  k14: 45.8000,
  k15: 69.2000,
  k16: 92.6000,
  k17: 16.3000,
  k18: 39.7000,
  k19: 63.1000,
  k20: 86.5000,
  k21: 10.2000,
  k22: 33.6000,
  k23: 57.0000,
  k24: 80.4000,
  k25: 4.1000,
  k26: 27.5000,
  k27: 50.9000,
  k28: 74.3000,
  k29: 97.7000,
  k30: 21.4000,
  k31: 44.8000,
  k32: 68.2000,
  k33: 91.6000,
  k34: 15.3000,
  k35: 38.7000,
  k36: 62.1000,
  k37: 85.5000,
  k38: 9.2000,
  k39: 32.6000,
  k40: 56.0000,
  k41: 79.4000,
  k42: 3.1000,
  k43: 26.5000,
  k44: 49.9000,
  k45: 73.3000,
  k46: 96.7000,
  k47: 20.4000,
  k48: 43.8000,
  k49: 67.2000,
  k50: 90.6000,
  k51: 14.3000,
  k52: 37.7000,
  k53: 61.1000,
  k54: 84.5000,
  k55: 8.2000,
  k56: 31.6000,
  k57: 55.0000,
  k58: 78.4000,
  k59: 2.1000,
  k60: 25.5000,
  k61: 48.9000,
  k62: 72.3000,
  k63: 95.7000,
  k64: 19.4000,
  k65: 42.8000,
  k66: 66.2000,
  k67: 89.6000,
  k68: 13.3000,
  k69: 36.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_132_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_132_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_132_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_132_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_132_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_132_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_132_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_132_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_132_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_132_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_132_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
