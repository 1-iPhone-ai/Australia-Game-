import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 018 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_018_META = {
  id: 'mig_018',
  regionId: 'QLD' as V1014WorkforceRegionId,
  primaryDomain: 'hospitality' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 17867,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_018_COEF = {
  k0: 60.2000,
  k1: 52.3000,
  k2: 44.4000,
  k3: 36.5000,
  k4: 28.6000,
  k5: 20.7000,
  k6: 12.8000,
  k7: 4.9000,
  k8: 96.7000,
  k9: 88.8000,
  k10: 80.9000,
  k11: 73.0000,
  k12: 65.1000,
  k13: 57.2000,
  k14: 49.3000,
  k15: 41.4000,
  k16: 33.5000,
  k17: 25.6000,
  k18: 17.7000,
  k19: 9.8000,
  k20: 1.9000,
  k21: 93.7000,
  k22: 85.8000,
  k23: 77.9000,
  k24: 70.0000,
  k25: 62.1000,
  k26: 54.2000,
  k27: 46.3000,
  k28: 38.4000,
  k29: 30.5000,
  k30: 22.6000,
  k31: 14.7000,
  k32: 6.8000,
  k33: 98.6000,
  k34: 90.7000,
  k35: 82.8000,
  k36: 74.9000,
  k37: 67.0000,
  k38: 59.1000,
  k39: 51.2000,
  k40: 43.3000,
  k41: 35.4000,
  k42: 27.5000,
  k43: 19.6000,
  k44: 11.7000,
  k45: 3.8000,
  k46: 95.6000,
  k47: 87.7000,
  k48: 79.8000,
  k49: 71.9000,
  k50: 64.0000,
  k51: 56.1000,
  k52: 48.2000,
  k53: 40.3000,
  k54: 32.4000,
  k55: 24.5000,
  k56: 16.6000,
  k57: 8.7000,
  k58: 0.8000,
  k59: 92.6000,
  k60: 84.7000,
  k61: 76.8000,
  k62: 68.9000,
  k63: 61.0000,
  k64: 53.1000,
  k65: 45.2000,
  k66: 37.3000,
  k67: 29.4000,
  k68: 21.5000,
  k69: 13.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_018_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_018_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_018_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_018_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_018_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_018_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_018_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_018_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_018_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_018_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_018_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
