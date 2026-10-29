import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 040 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_040_META = {
  id: 'mig_040',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'engineering' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 39669,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_040_COEF = {
  k0: 93.9000,
  k1: 72.8000,
  k2: 51.7000,
  k3: 30.6000,
  k4: 9.5000,
  k5: 88.1000,
  k6: 67.0000,
  k7: 45.9000,
  k8: 24.8000,
  k9: 3.7000,
  k10: 82.3000,
  k11: 61.2000,
  k12: 40.1000,
  k13: 19.0000,
  k14: 97.6000,
  k15: 76.5000,
  k16: 55.4000,
  k17: 34.3000,
  k18: 13.2000,
  k19: 91.8000,
  k20: 70.7000,
  k21: 49.6000,
  k22: 28.5000,
  k23: 7.4000,
  k24: 86.0000,
  k25: 64.9000,
  k26: 43.8000,
  k27: 22.7000,
  k28: 1.6000,
  k29: 80.2000,
  k30: 59.1000,
  k31: 38.0000,
  k32: 16.9000,
  k33: 95.5000,
  k34: 74.4000,
  k35: 53.3000,
  k36: 32.2000,
  k37: 11.1000,
  k38: 89.7000,
  k39: 68.6000,
  k40: 47.5000,
  k41: 26.4000,
  k42: 5.3000,
  k43: 83.9000,
  k44: 62.8000,
  k45: 41.7000,
  k46: 20.6000,
  k47: 99.2000,
  k48: 78.1000,
  k49: 57.0000,
  k50: 35.9000,
  k51: 14.8000,
  k52: 93.4000,
  k53: 72.3000,
  k54: 51.2000,
  k55: 30.1000,
  k56: 9.0000,
  k57: 87.6000,
  k58: 66.5000,
  k59: 45.4000,
  k60: 24.3000,
  k61: 3.2000,
  k62: 81.8000,
  k63: 60.7000,
  k64: 39.6000,
  k65: 18.5000,
  k66: 97.1000,
  k67: 76.0000,
  k68: 54.9000,
  k69: 33.8000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_040_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_040_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_040_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_040_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_040_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_040_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_040_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_040_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_040_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_040_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_040_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
