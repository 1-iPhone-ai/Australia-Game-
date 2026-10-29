import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 089 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_089_META = {
  id: 'mig_089',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'public_admin' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 88228,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_089_COEF = {
  k0: 46.6000,
  k1: 95.8000,
  k2: 45.3000,
  k3: 94.5000,
  k4: 44.0000,
  k5: 93.2000,
  k6: 42.7000,
  k7: 91.9000,
  k8: 41.4000,
  k9: 90.6000,
  k10: 40.1000,
  k11: 89.3000,
  k12: 38.8000,
  k13: 88.0000,
  k14: 37.5000,
  k15: 86.7000,
  k16: 36.2000,
  k17: 85.4000,
  k18: 34.9000,
  k19: 84.1000,
  k20: 33.6000,
  k21: 82.8000,
  k22: 32.3000,
  k23: 81.5000,
  k24: 31.0000,
  k25: 80.2000,
  k26: 29.7000,
  k27: 78.9000,
  k28: 28.4000,
  k29: 77.6000,
  k30: 27.1000,
  k31: 76.3000,
  k32: 25.8000,
  k33: 75.0000,
  k34: 24.5000,
  k35: 73.7000,
  k36: 23.2000,
  k37: 72.4000,
  k38: 21.9000,
  k39: 71.1000,
  k40: 20.6000,
  k41: 69.8000,
  k42: 19.3000,
  k43: 68.5000,
  k44: 18.0000,
  k45: 67.2000,
  k46: 16.7000,
  k47: 65.9000,
  k48: 15.4000,
  k49: 64.6000,
  k50: 14.1000,
  k51: 63.3000,
  k52: 12.8000,
  k53: 62.0000,
  k54: 11.5000,
  k55: 60.7000,
  k56: 10.2000,
  k57: 59.4000,
  k58: 8.9000,
  k59: 58.1000,
  k60: 7.6000,
  k61: 56.8000,
  k62: 6.3000,
  k63: 55.5000,
  k64: 5.0000,
  k65: 54.2000,
  k66: 3.7000,
  k67: 52.9000,
  k68: 2.4000,
  k69: 51.6000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_089_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_089_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_089_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_089_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_089_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_089_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_089_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_089_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_089_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_089_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_089_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
