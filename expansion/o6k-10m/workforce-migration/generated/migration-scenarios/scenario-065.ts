import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 065 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_065_META = {
  id: 'mig_065',
  regionId: 'VIC' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'balanced' as V1014WorkforceMigrationFlowBand,
  seed: 64444,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_065_COEF = {
  k0: 18.9000,
  k1: 82.5000,
  k2: 46.4000,
  k3: 10.3000,
  k4: 73.9000,
  k5: 37.8000,
  k6: 1.7000,
  k7: 65.3000,
  k8: 29.2000,
  k9: 92.8000,
  k10: 56.7000,
  k11: 20.6000,
  k12: 84.2000,
  k13: 48.1000,
  k14: 12.0000,
  k15: 75.6000,
  k16: 39.5000,
  k17: 3.4000,
  k18: 67.0000,
  k19: 30.9000,
  k20: 94.5000,
  k21: 58.4000,
  k22: 22.3000,
  k23: 85.9000,
  k24: 49.8000,
  k25: 13.7000,
  k26: 77.3000,
  k27: 41.2000,
  k28: 5.1000,
  k29: 68.7000,
  k30: 32.6000,
  k31: 96.2000,
  k32: 60.1000,
  k33: 24.0000,
  k34: 87.6000,
  k35: 51.5000,
  k36: 15.4000,
  k37: 79.0000,
  k38: 42.9000,
  k39: 6.8000,
  k40: 70.4000,
  k41: 34.3000,
  k42: 97.9000,
  k43: 61.8000,
  k44: 25.7000,
  k45: 89.3000,
  k46: 53.2000,
  k47: 17.1000,
  k48: 80.7000,
  k49: 44.6000,
  k50: 8.5000,
  k51: 72.1000,
  k52: 36.0000,
  k53: 99.6000,
  k54: 63.5000,
  k55: 27.4000,
  k56: 91.0000,
  k57: 54.9000,
  k58: 18.8000,
  k59: 82.4000,
  k60: 46.3000,
  k61: 10.2000,
  k62: 73.8000,
  k63: 37.7000,
  k64: 1.6000,
  k65: 65.2000,
  k66: 29.1000,
  k67: 92.7000,
  k68: 56.6000,
  k69: 20.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_065_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_065_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_065_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_065_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_065_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_065_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_065_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_065_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_065_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_065_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_065_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
