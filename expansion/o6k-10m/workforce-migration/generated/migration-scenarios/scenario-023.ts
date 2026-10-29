import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 023 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_023_META = {
  id: 'mig_023',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'digital' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 22822,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_023_COEF = {
  k0: 45.2000,
  k1: 34.3000,
  k2: 23.4000,
  k3: 12.5000,
  k4: 1.6000,
  k5: 90.4000,
  k6: 79.5000,
  k7: 68.6000,
  k8: 57.7000,
  k9: 46.8000,
  k10: 35.9000,
  k11: 25.0000,
  k12: 14.1000,
  k13: 3.2000,
  k14: 92.0000,
  k15: 81.1000,
  k16: 70.2000,
  k17: 59.3000,
  k18: 48.4000,
  k19: 37.5000,
  k20: 26.6000,
  k21: 15.7000,
  k22: 4.8000,
  k23: 93.6000,
  k24: 82.7000,
  k25: 71.8000,
  k26: 60.9000,
  k27: 50.0000,
  k28: 39.1000,
  k29: 28.2000,
  k30: 17.3000,
  k31: 6.4000,
  k32: 95.2000,
  k33: 84.3000,
  k34: 73.4000,
  k35: 62.5000,
  k36: 51.6000,
  k37: 40.7000,
  k38: 29.8000,
  k39: 18.9000,
  k40: 8.0000,
  k41: 96.8000,
  k42: 85.9000,
  k43: 75.0000,
  k44: 64.1000,
  k45: 53.2000,
  k46: 42.3000,
  k47: 31.4000,
  k48: 20.5000,
  k49: 9.6000,
  k50: 98.4000,
  k51: 87.5000,
  k52: 76.6000,
  k53: 65.7000,
  k54: 54.8000,
  k55: 43.9000,
  k56: 33.0000,
  k57: 22.1000,
  k58: 11.2000,
  k59: 0.3000,
  k60: 89.1000,
  k61: 78.2000,
  k62: 67.3000,
  k63: 56.4000,
  k64: 45.5000,
  k65: 34.6000,
  k66: 23.7000,
  k67: 12.8000,
  k68: 1.9000,
  k69: 90.7000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_023_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_023_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_023_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_023_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_023_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_023_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_023_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_023_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_023_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_023_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_023_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
