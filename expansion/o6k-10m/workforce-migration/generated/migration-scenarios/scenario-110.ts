import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 110 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_110_META = {
  id: 'mig_110',
  regionId: 'NT' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'constrained' as V1014WorkforceMigrationFlowBand,
  seed: 109039,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_110_COEF = {
  k0: 83.3000,
  k1: 20.2000,
  k2: 56.8000,
  k3: 93.4000,
  k4: 30.3000,
  k5: 66.9000,
  k6: 3.8000,
  k7: 40.4000,
  k8: 77.0000,
  k9: 13.9000,
  k10: 50.5000,
  k11: 87.1000,
  k12: 24.0000,
  k13: 60.6000,
  k14: 97.2000,
  k15: 34.1000,
  k16: 70.7000,
  k17: 7.6000,
  k18: 44.2000,
  k19: 80.8000,
  k20: 17.7000,
  k21: 54.3000,
  k22: 90.9000,
  k23: 27.8000,
  k24: 64.4000,
  k25: 1.3000,
  k26: 37.9000,
  k27: 74.5000,
  k28: 11.4000,
  k29: 48.0000,
  k30: 84.6000,
  k31: 21.5000,
  k32: 58.1000,
  k33: 94.7000,
  k34: 31.6000,
  k35: 68.2000,
  k36: 5.1000,
  k37: 41.7000,
  k38: 78.3000,
  k39: 15.2000,
  k40: 51.8000,
  k41: 88.4000,
  k42: 25.3000,
  k43: 61.9000,
  k44: 98.5000,
  k45: 35.4000,
  k46: 72.0000,
  k47: 8.9000,
  k48: 45.5000,
  k49: 82.1000,
  k50: 19.0000,
  k51: 55.6000,
  k52: 92.2000,
  k53: 29.1000,
  k54: 65.7000,
  k55: 2.6000,
  k56: 39.2000,
  k57: 75.8000,
  k58: 12.7000,
  k59: 49.3000,
  k60: 85.9000,
  k61: 22.8000,
  k62: 59.4000,
  k63: 96.0000,
  k64: 32.9000,
  k65: 69.5000,
  k66: 6.4000,
  k67: 43.0000,
  k68: 79.6000,
  k69: 16.5000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_110_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_110_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_110_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_110_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_110_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_110_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_110_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_110_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_110_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_110_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_110_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
