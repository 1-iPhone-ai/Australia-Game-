import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 100 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_100_META = {
  id: 'mig_100',
  regionId: 'SA' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 99129,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_100_COEF = {
  k0: 13.6000,
  k1: 56.2000,
  k2: 98.8000,
  k3: 41.7000,
  k4: 84.3000,
  k5: 27.2000,
  k6: 69.8000,
  k7: 12.7000,
  k8: 55.3000,
  k9: 97.9000,
  k10: 40.8000,
  k11: 83.4000,
  k12: 26.3000,
  k13: 68.9000,
  k14: 11.8000,
  k15: 54.4000,
  k16: 97.0000,
  k17: 39.9000,
  k18: 82.5000,
  k19: 25.4000,
  k20: 68.0000,
  k21: 10.9000,
  k22: 53.5000,
  k23: 96.1000,
  k24: 39.0000,
  k25: 81.6000,
  k26: 24.5000,
  k27: 67.1000,
  k28: 10.0000,
  k29: 52.6000,
  k30: 95.2000,
  k31: 38.1000,
  k32: 80.7000,
  k33: 23.6000,
  k34: 66.2000,
  k35: 9.1000,
  k36: 51.7000,
  k37: 94.3000,
  k38: 37.2000,
  k39: 79.8000,
  k40: 22.7000,
  k41: 65.3000,
  k42: 8.2000,
  k43: 50.8000,
  k44: 93.4000,
  k45: 36.3000,
  k46: 78.9000,
  k47: 21.8000,
  k48: 64.4000,
  k49: 7.3000,
  k50: 49.9000,
  k51: 92.5000,
  k52: 35.4000,
  k53: 78.0000,
  k54: 20.9000,
  k55: 63.5000,
  k56: 6.4000,
  k57: 49.0000,
  k58: 91.6000,
  k59: 34.5000,
  k60: 77.1000,
  k61: 20.0000,
  k62: 62.6000,
  k63: 5.5000,
  k64: 48.1000,
  k65: 90.7000,
  k66: 33.6000,
  k67: 76.2000,
  k68: 19.1000,
  k69: 61.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_100_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_100_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_100_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_100_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_100_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_100_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_100_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_100_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_100_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_100_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_100_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
