import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 003 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_003_META = {
  id: 'mig_003',
  regionId: 'WA' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 3002,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_003_COEF = {
  k0: 5.5000,
  k1: 6.6000,
  k2: 7.7000,
  k3: 8.8000,
  k4: 9.9000,
  k5: 11.0000,
  k6: 12.1000,
  k7: 13.2000,
  k8: 14.3000,
  k9: 15.4000,
  k10: 16.5000,
  k11: 17.6000,
  k12: 18.7000,
  k13: 19.8000,
  k14: 20.9000,
  k15: 22.0000,
  k16: 23.1000,
  k17: 24.2000,
  k18: 25.3000,
  k19: 26.4000,
  k20: 27.5000,
  k21: 28.6000,
  k22: 29.7000,
  k23: 30.8000,
  k24: 31.9000,
  k25: 33.0000,
  k26: 34.1000,
  k27: 35.2000,
  k28: 36.3000,
  k29: 37.4000,
  k30: 38.5000,
  k31: 39.6000,
  k32: 40.7000,
  k33: 41.8000,
  k34: 42.9000,
  k35: 44.0000,
  k36: 45.1000,
  k37: 46.2000,
  k38: 47.3000,
  k39: 48.4000,
  k40: 49.5000,
  k41: 50.6000,
  k42: 51.7000,
  k43: 52.8000,
  k44: 53.9000,
  k45: 55.0000,
  k46: 56.1000,
  k47: 57.2000,
  k48: 58.3000,
  k49: 59.4000,
  k50: 60.5000,
  k51: 61.6000,
  k52: 62.7000,
  k53: 63.8000,
  k54: 64.9000,
  k55: 66.0000,
  k56: 67.1000,
  k57: 68.2000,
  k58: 69.3000,
  k59: 70.4000,
  k60: 71.5000,
  k61: 72.6000,
  k62: 73.7000,
  k63: 74.8000,
  k64: 75.9000,
  k65: 77.0000,
  k66: 78.1000,
  k67: 79.2000,
  k68: 80.3000,
  k69: 81.4000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_003_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_003_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_003_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_003_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_003_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_003_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_003_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_003_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_003_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_003_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_003_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
