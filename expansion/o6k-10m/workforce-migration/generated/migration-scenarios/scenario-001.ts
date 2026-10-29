import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 001 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_001_META = {
  id: 'mig_001',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'healthcare' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 1020,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_001_COEF = {
  k0: 11.5000,
  k1: 13.8000,
  k2: 16.1000,
  k3: 18.4000,
  k4: 20.7000,
  k5: 23.0000,
  k6: 25.3000,
  k7: 27.6000,
  k8: 29.9000,
  k9: 32.2000,
  k10: 34.5000,
  k11: 36.8000,
  k12: 39.1000,
  k13: 41.4000,
  k14: 43.7000,
  k15: 46.0000,
  k16: 48.3000,
  k17: 50.6000,
  k18: 52.9000,
  k19: 55.2000,
  k20: 57.5000,
  k21: 59.8000,
  k22: 62.1000,
  k23: 64.4000,
  k24: 66.7000,
  k25: 69.0000,
  k26: 71.3000,
  k27: 73.6000,
  k28: 75.9000,
  k29: 78.2000,
  k30: 80.5000,
  k31: 82.8000,
  k32: 85.1000,
  k33: 87.4000,
  k34: 89.7000,
  k35: 92.0000,
  k36: 94.3000,
  k37: 96.6000,
  k38: 98.9000,
  k39: 1.5000,
  k40: 3.8000,
  k41: 6.1000,
  k42: 8.4000,
  k43: 10.7000,
  k44: 13.0000,
  k45: 15.3000,
  k46: 17.6000,
  k47: 19.9000,
  k48: 22.2000,
  k49: 24.5000,
  k50: 26.8000,
  k51: 29.1000,
  k52: 31.4000,
  k53: 33.7000,
  k54: 36.0000,
  k55: 38.3000,
  k56: 40.6000,
  k57: 42.9000,
  k58: 45.2000,
  k59: 47.5000,
  k60: 49.8000,
  k61: 52.1000,
  k62: 54.4000,
  k63: 56.7000,
  k64: 59.0000,
  k65: 61.3000,
  k66: 63.6000,
  k67: 65.9000,
  k68: 68.2000,
  k69: 70.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_001_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_001_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_001_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_001_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_001_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_001_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_001_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_001_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_001_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_001_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_001_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
