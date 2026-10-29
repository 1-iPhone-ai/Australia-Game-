import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 015 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_015_META = {
  id: 'mig_015',
  regionId: 'ACT' as V1014WorkforceRegionId,
  primaryDomain: 'education' as V1014WorkforceSkillDomain,
  flowBand: 'outflow' as V1014WorkforceMigrationFlowBand,
  seed: 14894,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_015_COEF = {
  k0: 69.2000,
  k1: 63.1000,
  k2: 57.0000,
  k3: 50.9000,
  k4: 44.8000,
  k5: 38.7000,
  k6: 32.6000,
  k7: 26.5000,
  k8: 20.4000,
  k9: 14.3000,
  k10: 8.2000,
  k11: 2.1000,
  k12: 95.7000,
  k13: 89.6000,
  k14: 83.5000,
  k15: 77.4000,
  k16: 71.3000,
  k17: 65.2000,
  k18: 59.1000,
  k19: 53.0000,
  k20: 46.9000,
  k21: 40.8000,
  k22: 34.7000,
  k23: 28.6000,
  k24: 22.5000,
  k25: 16.4000,
  k26: 10.3000,
  k27: 4.2000,
  k28: 97.8000,
  k29: 91.7000,
  k30: 85.6000,
  k31: 79.5000,
  k32: 73.4000,
  k33: 67.3000,
  k34: 61.2000,
  k35: 55.1000,
  k36: 49.0000,
  k37: 42.9000,
  k38: 36.8000,
  k39: 30.7000,
  k40: 24.6000,
  k41: 18.5000,
  k42: 12.4000,
  k43: 6.3000,
  k44: 0.2000,
  k45: 93.8000,
  k46: 87.7000,
  k47: 81.6000,
  k48: 75.5000,
  k49: 69.4000,
  k50: 63.3000,
  k51: 57.2000,
  k52: 51.1000,
  k53: 45.0000,
  k54: 38.9000,
  k55: 32.8000,
  k56: 26.7000,
  k57: 20.6000,
  k58: 14.5000,
  k59: 8.4000,
  k60: 2.3000,
  k61: 95.9000,
  k62: 89.8000,
  k63: 83.7000,
  k64: 77.6000,
  k65: 71.5000,
  k66: 65.4000,
  k67: 59.3000,
  k68: 53.2000,
  k69: 47.1000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_015_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_015_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_015_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_015_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_015_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_015_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_015_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_015_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_015_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_015_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_015_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
