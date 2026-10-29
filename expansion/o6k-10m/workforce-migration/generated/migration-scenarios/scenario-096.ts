import { V1014_WORKFORCE_clamp, V1014_WORKFORCE_readinessFromScore } from '../../engine/workforce-migration-utils.ts';
import type {
  V1014WorkforceMigrationFlowBand,
  V1014WorkforceMigrationScenarioSnapshot,
  V1014WorkforceRegionId,
  V1014WorkforceSkillDomain,
} from '../../types/core.ts';

/** Generated migration scenario 096 — mirrors 20AJ catalog row (20AC part 4). */
export const V1014_WORKFORCE_MIG_SCENARIO_096_META = {
  id: 'mig_096',
  regionId: 'NSW' as V1014WorkforceRegionId,
  primaryDomain: 'mining' as V1014WorkforceSkillDomain,
  flowBand: 'surge' as V1014WorkforceMigrationFlowBand,
  seed: 95165,
} as const;

const V1014_WORKFORCE_MIG_SCENARIO_096_COEF = {
  k0: 25.6000,
  k1: 70.6000,
  k2: 15.9000,
  k3: 60.9000,
  k4: 6.2000,
  k5: 51.2000,
  k6: 96.2000,
  k7: 41.5000,
  k8: 86.5000,
  k9: 31.8000,
  k10: 76.8000,
  k11: 22.1000,
  k12: 67.1000,
  k13: 12.4000,
  k14: 57.4000,
  k15: 2.7000,
  k16: 47.7000,
  k17: 92.7000,
  k18: 38.0000,
  k19: 83.0000,
  k20: 28.3000,
  k21: 73.3000,
  k22: 18.6000,
  k23: 63.6000,
  k24: 8.9000,
  k25: 53.9000,
  k26: 98.9000,
  k27: 44.2000,
  k28: 89.2000,
  k29: 34.5000,
  k30: 79.5000,
  k31: 24.8000,
  k32: 69.8000,
  k33: 15.1000,
  k34: 60.1000,
  k35: 5.4000,
  k36: 50.4000,
  k37: 95.4000,
  k38: 40.7000,
  k39: 85.7000,
  k40: 31.0000,
  k41: 76.0000,
  k42: 21.3000,
  k43: 66.3000,
  k44: 11.6000,
  k45: 56.6000,
  k46: 1.9000,
  k47: 46.9000,
  k48: 91.9000,
  k49: 37.2000,
  k50: 82.2000,
  k51: 27.5000,
  k52: 72.5000,
  k53: 17.8000,
  k54: 62.8000,
  k55: 8.1000,
  k56: 53.1000,
  k57: 98.1000,
  k58: 43.4000,
  k59: 88.4000,
  k60: 33.7000,
  k61: 78.7000,
  k62: 24.0000,
  k63: 69.0000,
  k64: 14.3000,
  k65: 59.3000,
  k66: 4.6000,
  k67: 49.6000,
  k68: 94.6000,
  k69: 39.9000,
} as const;

export function V1014_WORKFORCE_MIG_SCENARIO_096_evaluate(turn: number): {
  netInflow: number;
  skillMismatchIndex: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1014_WORKFORCE_MIG_SCENARIO_096_COEF) as Array<
    keyof typeof V1014_WORKFORCE_MIG_SCENARIO_096_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1014_WORKFORCE_MIG_SCENARIO_096_COEF[keys[j]] * ((turn + j) % 11);
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

export function V1014_WORKFORCE_MIG_SCENARIO_096_snapshot(turn: number): V1014WorkforceMigrationScenarioSnapshot {
  const r = V1014_WORKFORCE_MIG_SCENARIO_096_evaluate(turn);
  return {
    scenarioId: V1014_WORKFORCE_MIG_SCENARIO_096_META.id,
    regionId: V1014_WORKFORCE_MIG_SCENARIO_096_META.regionId,
    flowBand: V1014_WORKFORCE_MIG_SCENARIO_096_META.flowBand,
    netInflow: r.netInflow,
    skillMismatchIndex: r.skillMismatchIndex,
    readinessBand: V1014_WORKFORCE_readinessFromScore(100 - r.skillMismatchIndex),
  };
}

export function V1014_WORKFORCE_MIG_SCENARIO_096_regressionAssert(turn: number): boolean {
  const r = V1014_WORKFORCE_MIG_SCENARIO_096_evaluate(turn);
  return typeof r.netInflow === 'number' && r.skillMismatchIndex <= 100;
}
